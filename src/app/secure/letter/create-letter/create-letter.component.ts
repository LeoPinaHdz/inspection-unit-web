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
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Letter, LetterDetail } from 'src/app/_shared/models/letter.model';
import { LetterService } from 'src/app/_shared/services/letter.service';
import { ExecutiveService } from 'src/app/_shared/services/executive.service';
import { RequestService } from 'src/app/_shared/services/request.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'create-letter',
  templateUrl: './create-letter.component.html',
})
export class CreateLetterComponent implements OnInit, OnDestroy {
  letterForm!: FormGroup;
  isEdit = false;
  id: any;
  letter: Letter = { idOficio: 0, idEstatus: 1 };
  selectedDetail?: LetterDetail;
  letterDetails: any[] = [];
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  standards: any[] = [];
  executives: any[] = [];
  displayedColumns: string[] = ['select', 'clave', 'fSolicitudFmt'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  _onDestroy = new Subject<void>();
  selection = new SelectionModel<any>(true, []);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private letterService: LetterService,
    private clientService: ClientService,
    private executiveService: ExecutiveService,
    private standardService: StandardService,
    private dialog: MatDialog,
    private requestService: RequestService
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.letterForm = new FormGroup({
      idOficio: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      clientFilter: new FormControl('', []),
      idNorma: new FormControl('', [Validators.required]),
      folio: new FormControl({ value: '', disabled: true }),
      fOficio: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      fPresentacion: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      hPresentacion: new FormControl('', []),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      idEjecutivo: new FormControl('', [Validators.required]),
      clave: new FormControl('', []),
      active: new FormControl(false)
    });

    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
      if (this.clients.length > 0) this.letterForm.get('idCliente')!.setValue(this.clients[0].idCliente);
      this.filteredClients.next(this.clients.slice());


      this.letterForm.get('idCliente')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.loadRequests();
        });

      this.loadRequests();

      this.letterForm.get('clientFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterClients();
        });
    } catch (error) {
      console.error('Error trying to get clients');
    }

    try {
      this.standards = await lastValueFrom(this.standardService.getAllActive());
      if (this.standards.length > 0) this.letterForm.get('idNorma')!.setValue(this.standards[0].idNorma);
    } catch (error) {
      console.error('Error trying to get standards');
    }

    try {
      this.executives = await lastValueFrom(this.executiveService.getActive());
      if (this.executives.length > 0) this.letterForm.get('idEjecutivo')!.setValue(this.executives[0].idEjecutivo);
    } catch (error) {
      console.error('Error trying to get executives');
    }

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

  loadRequests() {
    this.requestService.getByClient(this.letterForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.letterDetails = response;
          this.dataSource = new MatTableDataSource(this.letterDetails);
          this.updateSelection();
        },
        error: () => {
          console.error('Error trying to get addresses');
        }
      });
  }

  onSubmit(): void {
    this.letterForm.markAllAsTouched();
    if (!this.letterForm.valid || this.selection.isEmpty()) return;

    let request = this.letterForm.getRawValue();

    request.oficio = request.oficio && request.oficio > 0 ? request.oficio : 0;
    request.folio = request.folio && request.folio > 0 ? request.folio : 0;
    request.idEstatus = request.active ? 1 : 3;
    request.detalles = this.selection.selected.map(r => {
      return { idSolicitud: r.idSolicitud };
    });

    this.letterService.save(request)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El oficio ${request.idOficio} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/letters`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el oficio ${request.idOficio}` },
          });
          console.error('Error trying to save letters');
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
      idEjecutivo: letter.idEjecutivo,
      clave: letter.clave,
      observaciones: letter.observaciones,
      active: letter.idEstatus && letter.idEstatus === 1
    });

    this.letter = letter;

    this.updateSelection();
  }

  updateSelection() {
    if (this.letter.detalles) {
      const selected = this.letterDetails.filter(ld =>
        this.letter.detalles!.some(d => d.idSolicitud === ld.idSolicitud)
      );
      this.selection.select(...selected);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselecciona' : 'Selecciona'} todos`;
    }
    return `${this.selection.isSelected(row) ? 'Deselecciona' : 'Selecciona'} row ${row.folio}`;
  }

  private filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.letterForm.get('clientFilter')!.value;
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

  get form() {
    return this.letterForm.controls;
  }
}
