import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReplaySubject, Subject, lastValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Client } from 'src/app/_shared/models/client.model';
import { RequestService } from 'src/app/_shared/services/request.service';
import { addYears } from 'src/app/_shared/utils/date.utils';
import { Unit } from 'src/app/_shared/models/unit.model';
import { UnitService } from 'src/app/_shared/services/unit.service';
import { CountrySE } from 'src/app/_shared/models/country.model';
import { CountryService } from 'src/app/_shared/services/country.service';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Request, RequestDetail } from 'src/app/_shared/models/request.model';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';

@Component({
  selector: 'create-request',
  templateUrl: './create-request.component.html',
})
export class CreateRequestComponent implements OnInit, OnDestroy {
  requestForm!: FormGroup;
  requestDetailForm!: FormGroup;
  isEdit = false;
  id: any;
  request: Request = { idSolicitud: 0, idEstatus: 1 };
  selectedDetail?: RequestDetail;
  requestDetails: RequestDetail[] = [];
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  filteredCountries: ReplaySubject<CountrySE[]> = new ReplaySubject<CountrySE[]>(1);
  standards: any[] = [];
  representatives: any[] = [];
  places: any[] = [{idLugar: 1, nombre:'Sonora'}];
  displayedColumns: string[] = ['modelo', 'producto', 'cantidad', 'idUnidad', 'marca', 'idPais', 'actions'];
  dataSource: MatTableDataSource<RequestDetail> = new MatTableDataSource();
  units: Unit[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private clientService: ClientService,
    private countryService: CountryService,
    private standardService: StandardService,
    private clientRepresentativeService: ClientRepresentativeService,
    private unitService: UnitService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.requestForm = new FormGroup({
      idSolicitud: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      folio: new FormControl({ value: '', disabled: true }),
      idNorma: new FormControl('', [Validators.required]),
      pedimento: new FormControl({ value: '', disabled: true }),
      tipoServicio: new FormControl({ value: '0', disabled: true }, [Validators.required]),
      tipoRegimen: new FormControl('', [Validators.required]),
      fSolicitud: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      fPrograma: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      idRepresentante: new FormControl(''),
      idLugar: new FormControl('', [Validators.required]),
      idFuncionario: new FormControl(''),
      idEjecutivo: new FormControl(''),
      clave: new FormControl(''),
      active: new FormControl({ value: true, disabled: true })
    });

    this.requestDetailForm = new FormGroup({
      modelo: new FormControl(''),
      producto: new FormControl(''),
      partida: new FormControl(0),
      cantidad: new FormControl(''),
      idUnidad: new FormControl(''),
      marca: new FormControl(''),
      country: new FormControl('')
    });

    try {
      this.units = await lastValueFrom(this.unitService.getAll());
      if (this.units.length > 0) this.requestDetailForm.get('idUnidad')!.setValue(this.units[0]);
    } catch (error) {
      console.error('Error trying to get units');
    }

    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
      if (this.clients.length > 0) this.requestForm.get('idCliente')!.setValue(this.clients[0].idCliente);

      this.requestForm.get('idCliente')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.loadRepresentatives();
        });
      this.loadRepresentatives();
    } catch (error) {
      console.error('Error trying to get clients');
    }
    try {
      this.standards = await lastValueFrom(this.standardService.getAllActive());
      if (this.standards.length > 0) this.requestForm.get('idNorma')!.setValue(this.standards[0].idNorma);
    } catch (error) {
      console.error('Error trying to get standards');
    }

    if (this.id) {
      this.isEdit = true;

      try {
        const response = await lastValueFrom(this.requestService.getById(this.id));
        this.updateForm(response);
      } catch (error) {
        this.dialog.open(SimpleDialogComponent, {
          data: { type: 'error', message: `Error al obtener los datos del solicitud ${this.id}` },
        })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/requests`]);
          });
        console.error('Error trying to get request create');
      }
    }
  }

  initDetailsTable(requests: RequestDetail[], setPartida?: boolean) {
    const sortedRequests = requests.sort((a, b) => (a.partida || 0) > (b.partida || 0) ? 1 : -1);
    if (setPartida) {
      sortedRequests.forEach((item, i) => {
        item.producto = i + 1;
      });
    }

    this.dataSource = new MatTableDataSource(sortedRequests);
  }
  
  resetDetatilForm() {
    this.requestDetailForm.reset({ idSolicitudDetalle: 0, partida: 0 });
  }

  editDetail(detail: RequestDetail): void {
    this.selectedDetail = detail;
    this.requestDetails = this.requestDetails.filter(d => d.partida !== detail.partida);
    this.initDetailsTable(this.requestDetails);
    this.requestDetailForm.patchValue({
      idSolicitudDetalle: detail.idSolicitudDetalle,
      cantidad: detail.cantidad,
      idUnidad: detail.idUnidad,
      idPais: detail.idPais,
      modelo: detail.modelo,
      producto: detail.producto,
      marca: detail.marca,
    });
  }

  showConfirmDeleteDialog(detail: RequestDetail): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: `¿Esta seguro que desea eliminar el producto ${detail.producto}?`,
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.requestDetails = this.requestDetails.filter(d => d.partida !== detail.partida);
          this.initDetailsTable(this.requestDetails, true);
        }
      });
  }

  onCancelEdit(): void {
    if (this.selectedDetail) {
      this.requestDetails.push(this.selectedDetail);
      this.initDetailsTable(this.requestDetails);
      this.resetDetatilForm();
      this.selectedDetail = undefined;
    }
  }

  onSubmitDetail(): void {
    this.requestDetailForm.markAllAsTouched();
    if (!this.requestDetailForm.valid) return;

    const requestDetail = this.requestDetailForm.getRawValue();

    if (this.selectedDetail) {
      requestDetail.producto = this.selectedDetail.producto;

    } else {
      requestDetail.producto = requestDetail.producto == 0 ? this.requestDetails.length + 1 : requestDetail.producto;
    }

    const subsolicitud: string = requestDetail.producto && requestDetail.producto === 1 ? '' : (requestDetail.producto - 1).toString();
    requestDetail.subsolicitud = subsolicitud;

    this.requestDetails.push(requestDetail);
    this.selectedDetail = undefined;
    this.initDetailsTable(this.requestDetails, true);
    this.resetDetatilForm();
  }

  onSubmit(): void {
    this.requestForm.markAllAsTouched();
    if (!this.requestForm.valid) return;

    let request = this.requestForm.getRawValue();
    request.idEstatus = request.active ? 1 : 3;
    request.tipoServicio = request.tipoServicio == 1;
    request.tipoRegimen = request.tipoRegimen == 1;

    request.solicitud = 0;
    request.solicitudsDetalle = this.requestDetails;

    this.requestService.save(request)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `La solicitud ${request.idSolicitud} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.ngOnInit();
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar la solicitud ${request.idSolicitud}` },
          });
          console.error('Error trying to save requests');
        }
      });
  }

  loadRepresentatives() {
    this.clientRepresentativeService.getAllActive(this.requestForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.representatives = response;
          if (response.length > 0) this.requestForm.get('idRepresentante')!.setValue(this.representatives[0].idRepresentante);
        },
        error: () => {
          console.error('Error trying to get representatives');
        }
      });
  }

  updateForm(request: Request): void {
    this.requestForm.patchValue({
      idSolicitud: request.idSolicitud,
      idCliente: request.idCliente,
      folio: request.folio,
      idNorma: request.idNorma,
      pedimento: request.pedimento,
      tipoServicio: request.tipoServicio,
      tipoRegimen: request.tipoRegimen,
      fSolicitud: request.fSolicitud,
      fPrograma: request.fPrograma,
      idRepresentante: request.idRepresentante,
      idLugar: request.idLugar,
      idFuncionario: request.idFuncionario,
      idEjecutivo: request.idEjecutivo,
      clave: request.clave,
      active: (request.idEstatus && request.idEstatus === 1) || false
    });

    //this.dataSource = new MatTableDataSource(sortedRequests);
  }

  get form() {
    return this.requestForm.controls;
  }

  get formDetail() {
    return this.requestDetailForm.controls;
  }
}
