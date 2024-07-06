import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { Client } from 'src/app/_shared/models/client.model';
import { Reference, ReferenceDetail } from 'src/app/_shared/models/reference.model';
import { ReferenceService } from 'src/app/_shared/services/reference.service';
import { addMonths } from 'src/app/_shared/utils/date.utils';
import { Unit } from 'src/app/_shared/models/unit.model';
import { UnitService } from 'src/app/_shared/services/unit.service';
import { CountrySE } from 'src/app/_shared/models/country.model';
import { StandardService } from 'src/app/_shared/services/standard.service';

@Component({
  selector: 'reference-create',
  templateUrl: './reference-create.component.html',
})
export class ReferenceCreateComponent implements OnInit, OnDestroy {
  formReference!: FormGroup;
  formReferenceDetail!: FormGroup;
  isEdit = false;
  id: any;
  reference: Reference = { idFolio: 0, idEstatus: 1 };
  selectedDetail?: ReferenceDetail;
  referenceDetails: ReferenceDetail[] = [];
  @Input() clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  @Input() countries: CountrySE[] = [];
  filteredCountries: ReplaySubject<CountrySE[]> = new ReplaySubject<CountrySE[]>(1);
  @Input() standards: any[] = [];
  displayedColumns: string[] = ['folio', 'marca', 'producto', 'modelo', 'cantidad', 'idUnidad', 'idPais', 'etiquetas', 'fraccion', 'idEstatus', 'actions'];
  dataSource: MatTableDataSource<ReferenceDetail> = new MatTableDataSource();
  units: Unit[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private referenceService: ReferenceService,
    private standardService: StandardService,
    private unitService: UnitService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.initComponent();

    this.unitService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.units = response;
          this.formReferenceDetail.get('idUnidad')!.setValue(this.units[0]);
        },
        error: () => {
          console.error('Error trying to get units');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clients && this.clients.length > 0) {
      this.filteredClients.next(this.clients.slice());
      this.formReference.get('clientFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterClients();
        });
    }
    if (changes.countries && this.countries.length > 0) {
      this.filteredCountries.next(this.countries.slice());
      this.formReferenceDetail.get('idPais')!.setValue(this.countries[0]);
      this.formReferenceDetail.get('countryFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCountries();
        });
    }
  }

  initComponent() {
    this.formReference = new FormGroup({
      idFolio: new FormControl({ value: '', disabled: true }, [Validators.required]),
      folio: new FormControl({ value: '', disabled: true }, [Validators.required]),
      pedimento: new FormControl('', []),
      idCliente: new FormControl('', [Validators.required]),
      clientFilter: new FormControl('', []),
      idNorma: new FormControl('', [Validators.required]),
      factura: new FormControl('', []),
      fFolio: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      fVigencia: new FormControl({ value: addMonths(new Date(), 1), disabled: true }, [Validators.required]),
      persona: new FormControl('2', []),
      modalidad: new FormControl('2', []),
    });

    this.formReferenceDetail = new FormGroup({
      idFolioDetalle: new FormControl(0, []),
      fraccion: new FormControl('', [Validators.required]),
      marca: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      producto: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
      partida: new FormControl('0', [Validators.required]),
      subfolio: new FormControl('0', []),
      etiquetas: new FormControl('', [Validators.required]),
      idUnidad: new FormControl('', [Validators.required]),
      countryFilter: new FormControl('', []),
      idPais: new FormControl('', [Validators.required])
    });

    this.referenceDetails = [];
    this.selectedDetail = undefined;
    this.initDetailsTable(this.referenceDetails, true);
  }

  resetDetatilForm() {
    this.formReferenceDetail.reset({ idFolioDetalle: 0, partida: 0 });
  }

  editDetail(detail: ReferenceDetail): void {
    this.selectedDetail = detail;
    this.referenceDetails = this.referenceDetails.filter(d => d.partida !== detail.partida);
    this.initDetailsTable(this.referenceDetails);
    this.formReferenceDetail.patchValue({
      idFolioDetalle: detail.idFolioDetalle,
      fraccion: detail.fraccion,
      cantidad: detail.cantidad,
      idUnidad: detail.idUnidad,
      partida: detail.partida,
      idPais: detail.idPais,
      etiquetas: detail.etiquetas,
      modelo: detail.modelo,
      producto: detail.producto,
      marca: detail.marca,
    });
  }

  showConfirmDeleteDialog(detail: ReferenceDetail): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: `¿Esta seguro que desea eliminar la partida ${detail.partida}?`,
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.referenceDetails = this.referenceDetails.filter(d => d.partida !== detail.partida);
          this.initDetailsTable(this.referenceDetails, true);
        }
      });
  }

  onCancelEdit(): void {
    if (this.selectedDetail) {
      this.referenceDetails.push(this.selectedDetail);
      this.initDetailsTable(this.referenceDetails);
      this.resetDetatilForm();
      this.selectedDetail = undefined;
    }
  }

  onSubmitDetail(): void {
    this.formReferenceDetail.markAllAsTouched();
    if (!this.formReferenceDetail.valid) return;

    const referenceDetail = this.formReferenceDetail.getRawValue();

    if (this.selectedDetail) {
      referenceDetail.partida = this.selectedDetail.partida;
    } else {
      referenceDetail.partida = referenceDetail.partida == 0 ? this.referenceDetails.length + 1 : referenceDetail.partida;
    }

    const subfolio: string = referenceDetail.partida && referenceDetail.partida === 1 ? '' : (referenceDetail.partida - 1).toString();
    referenceDetail.subfolio = subfolio;

    referenceDetail.nombrePais = this.countries.filter(c => c.idPais == referenceDetail.idPais)[0].nombre;
    referenceDetail.nombreUnidad = this.units.filter(c => c.idUnidad == referenceDetail.idUnidad)[0].nombre;

    this.referenceDetails.push(referenceDetail);
    this.selectedDetail = undefined;
    this.initDetailsTable(this.referenceDetails, true);
    this.resetDetatilForm();
  }

  onSubmit(): void {
    this.formReference.markAllAsTouched();
    if (!this.formReference.valid || this.referenceDetails.length === 0) return;

    let reference = this.formReference.getRawValue();

    reference.folio = 0;
    reference.foliosDetalle = this.referenceDetails;

    this.referenceService.save(reference)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El folio ${reference.idFolio} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.ngOnInit();
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el folio ${reference.idFolio}` },
          });
          console.error('Error trying to save references');
        }
      });
  }

  initDetailsTable(references: ReferenceDetail[], setPartida?: boolean) {
    const sortedReferences = references.sort((a, b) => (a.partida || 0) > (b.partida || 0) ? 1 : -1);
    if (setPartida) {
      sortedReferences.forEach((item, i) => {
        item.partida = i + 1;
      });
    }

    this.dataSource = new MatTableDataSource(sortedReferences);
  }

  private filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.formReferenceDetail.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterCountries() {
    if (!this.countries) {
      return;
    }
    let search = this.formReferenceDetail.get('countryFilter')!.value;
    if (!search) {
      this.filteredCountries.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountries.next(
      this.countries.filter(country => country.nombre!.toLowerCase().indexOf(search) > -1)
    );
  }

  get form() {
    return this.formReference.controls;
  }

  get formDetail() {
    return this.formReferenceDetail.controls;
  }
}
