import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, lastValueFrom, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { RulingService } from 'src/app/_shared/services/ruling.service';
import { Ruling } from 'src/app/_shared/models/ruling.model';
import { Client } from 'src/app/_shared/models/client.model';
import { Request } from 'src/app/_shared/models/request.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Official } from 'src/app/_shared/models/official.model';
import { Executive } from 'src/app/_shared/models/executive.model';
import { ExecutiveService } from 'src/app/_shared/services/executive.service';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { RequestService } from 'src/app/_shared/services/request.service';

@Component({
  selector: 'rulings',
  templateUrl: './ruling-detail.component.html',
})
export class RulingDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  ruling: Ruling = { idDictamen: 0 };
  clients: Client[] = [];
  officials: Official[] = [];
  executives: Executive[] = [];
  requests: Request[] = [];
  rulingForm!: FormGroup;
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rulingService: RulingService,
    private clientService: ClientService,
    private executiveService: ExecutiveService,
    private officialService: OfficialService,
    private requestService: RequestService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.rulingForm = new FormGroup({
      idDictamen: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      clientFilter: new FormControl('', []),
      idSolicitud: new FormControl('', [Validators.required]),
      tipoServicio: new FormControl({ value: '', disabled: true }),
      folio: new FormControl({ value: '', disabled: true }, []),
      dictaminacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      fDictamen: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idPresentacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idFuncionario: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idEjecutivo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      active: new FormControl(false)
    });

    if (this.id) {
      this.isEdit = true;

      this.rulingService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del dictamen ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/rulings`]);
              });
            console.error('Error trying to get ruling detail');
          }
        });
    }

    try {
      this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          this.filteredClients.next(this.clients.slice());
          this.rulingForm.get('clientFilter')!.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterClients();
            });
          if (this.clients.length) {
            this.rulingForm.get('idCliente')!.setValue(this.clients[0].idCliente);
            if (this.clients.length === 1) this.rulingForm.get('idCliente')!.disable();
          }
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
      if (this.clients.length > 0) this.rulingForm.get('idCliente')!.setValue(this.clients[0].idCliente);
      this.rulingForm.get('idCliente')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.loadRequests();
        });
      if (!this.id) this.loadRequests()
    } catch (error) {
      console.error('Error trying to get clients');
    }
    try {
      this.executives = await lastValueFrom(this.executiveService.getActive());
      if (this.executives.length > 0) this.rulingForm.get('idEjecutivo')!.setValue(this.executives[0].idEjecutivo);
    } catch (error) {
      console.error('Error trying to get executives');
    }
    try {
      this.officials = await lastValueFrom(this.officialService.getActive());
      if (this.officials.length > 0) this.rulingForm.get('idFuncionario')!.setValue(this.officials[0].idFuncionario);
    } catch (error) {
      console.error('Error trying to get officials');
    }
  }

  async loadRequests() {
    this.requests = [];
    try {
      this.requests = await lastValueFrom(this.requestService.getByLetter(this.rulingForm.get('idOficio')!.value));
      if (this.requests.length > 0 && !this.id) {
        this.rulingForm.get('idSolicitud')!.setValue(this.requests[0].idSolicitud);
        this.rulingForm.get('tipoServicio')!.setValue(this.requests[0].tipoServicio);
      }
    } catch (error) {
      console.error('Error trying to get requests');
    }
  }

  updateForm(ruling: Ruling): void {
    this.rulingForm.patchValue({
      idDictamen: ruling.idDictamen,
      idCliente: ruling.idCliente,
      folio: ruling.folio,
      dictaminacion: ruling.dictaminacion,
      fDictamen: ruling.fDictamen,
      idPresentacion: ruling.idPresentacion,
      idFuncionario: ruling.idFuncionario,
      idEjecutivo: ruling.idEjecutivo,
      observaciones: ruling.observaciones,
      active: (ruling.idEstatus && ruling.idEstatus === 1) || false
    });
  }

  onSubmit(): void {
    this.rulingForm.markAllAsTouched();
    if (!this.rulingForm.valid) return;

    const rulingRequest = this.rulingForm.getRawValue();;
    rulingRequest.idEstatus = rulingRequest.active ? 1 : 3;

    this.rulingService.save(rulingRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El dictamen ${rulingRequest.idDictamen} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/rulings`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el dictamen ${rulingRequest.idDictamen}` },
          });
          console.error('Error trying to save ruling');
        }
      });
  }

  get form() {
    return this.rulingForm.controls;
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.rulingForm.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search!) > -1)
    );
  }
}