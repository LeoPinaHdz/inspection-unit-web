import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Client } from 'src/app/_shared/models/client.model';
import { addYears } from 'src/app/_shared/utils/date.utils';
import { Unit } from 'src/app/_shared/models/unit.model';
import { UnitService } from 'src/app/_shared/services/unit.service';
import { CountrySE } from 'src/app/_shared/models/country.model';
import { CountryService } from 'src/app/_shared/services/country.service';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { Letter, LetterDetail } from 'src/app/_shared/models/letter.model';
import { LetterService } from 'src/app/_shared/services/letter.service';

@Component({
  selector: 'create-letter',
  templateUrl: './create-letter.component.html',
})
export class CreateLetterComponent implements OnInit, OnDestroy {
  letterForm!: FormGroup;
  letterDetailForm!: FormGroup;
  isEdit = false;
  id: any;
  letter: Letter = {idOficio: 0, idEstatus: 1};
  selectedDetail?: LetterDetail;
  letterDetails: LetterDetail[] = [];
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  countries: CountrySE[] = [{idPais: 'MX', nombre: 'MEXICO'}, {idPais: 'USA', nombre: 'ESTADOS UNIDOS'}];
  filteredCountries: ReplaySubject<CountrySE[]> = new ReplaySubject<CountrySE[]>(1);
  standards: any[] = [];
  representatives: any[] = [];
  places: any[] = [];
  officials: any[] = [];
  displayedColumns: string[] = ['solicitud', 'fInspeccion'];
  dataSource: MatTableDataSource<LetterDetail> = new MatTableDataSource();
  units: Unit[] = [];
  countr: Unit[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private letterService: LetterService,
    private clientService: ClientService,
    private countryService: CountryService,
    private standardService: StandardService,
    private clientRepresentativeService: ClientRepresentativeService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.letterForm = new FormGroup({
      idOficio: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      idNorma: new FormControl('', [Validators.required]),
      folio: new FormControl({ value: '', disabled: true }),
      fOficio: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      fPresentacion: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      hPresentacion: new FormControl('', [Validators.required]),
      observaciones: new FormControl('', [Validators.required]),
      idEjecutivo: new FormControl('', [Validators.required]),
      idFuncionario: new FormControl('', [Validators.required]),
      clave: new FormControl('', [Validators.required]),
      active: new FormControl(false)
    });
    this.letterDetailForm = new FormGroup({
    });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (response.length > 0) this.letterForm.get('idCliente')!.setValue(this.clients[0].idCliente);

          this.loadRepresentatives();
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });

      this.standardService.getAllActive()
        .pipe()
        .subscribe({
          next: (response) => {
            this.standards = response;
            if (response.length > 0) this.letterForm.get('idNorma')!.setValue(this.standards[0].idNorma);
          },
          error: () => {
            console.error('Error trying to get standards');
          }
        });

    this.letterForm.get('idCliente')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.loadRepresentatives();
      });

    if (this.id) {
      this.isEdit = true;

      this.letterService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del oficio ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/letters`]);
              });
            console.error('Error trying to get letter create');
          }
        });
    }
  }

  resetDetatilForm() {
    this.letterDetailForm.reset({idOficioDetalle: 0, partida: 0});
  }

  onCancelEdit(): void {
    if (this.selectedDetail) {
      this.letterDetails.push(this.selectedDetail);
      this.resetDetatilForm();
      this.selectedDetail = undefined;
    }
  }

  onSubmitDetail(): void {
    this.letterDetailForm.markAllAsTouched();
    if (!this.letterDetailForm.valid) return;

    const letterDetail = this.letterDetailForm.getRawValue();

    if (this.selectedDetail) {
      letterDetail.producto = this.selectedDetail.producto;
  
    } else {
      letterDetail.producto = letterDetail.producto == 0 ? this.letterDetails.length + 1 : letterDetail.producto;
    }

    const suboficio: string = letterDetail.producto && letterDetail.producto === 1 ? '' : (letterDetail.producto - 1).toString();
    letterDetail.suboficio = suboficio;

    this.letterDetails.push(letterDetail);
    this.selectedDetail = undefined;
    this.resetDetatilForm();
  }

  onSubmit(): void {
    this.letterForm.markAllAsTouched();
    if (!this.letterForm.valid) return;

    let request = this.letterForm.getRawValue();

    request.oficio = 0;
    request.oficiosDetalle = this.letterDetails;
    
    this.letterService.save(request)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message: `La oficio ${request.idOficio} fue guardado con éxito`},
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          this.ngOnInit();
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Error al guardar la oficio ${request.idOficio}`},
        });
        console.error('Error trying to save letters');
      }
    });
  }
  
  loadRepresentatives() {
    this.clientRepresentativeService.getAllActive(this.letterForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.representatives = response;
        },
        error: () => {
          console.error('Error trying to get representatives');
        }
      });
  }

  updateForm(letter: Letter): void {
    this.letterForm.patchValue({
      idOficio: letter.idOficio,
      idCliente: letter.idCliente,
      folio: letter.folio,
      idNorma: letter.idNorma,
      fOficio: letter.fOficio,
      idFuncionario: letter.idFuncionario,
      idEjecutivo: letter.idEjecutivo,
      clave: letter.clave,
      active: (letter.idEstatus && letter.idEstatus === 1) || false
    });

    //this.dataSource = new MatTableDataSource(sortedLetters);
  }

  private filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.letterDetailForm.get('clientFilter')!.value;
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
    let search = this.letterDetailForm.get('countryFilter')!.value;
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
    return this.letterForm.controls;
  }

  get formDetail() {
    return this.letterDetailForm.controls;
  }
}
