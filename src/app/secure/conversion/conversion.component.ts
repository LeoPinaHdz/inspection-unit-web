import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { Reference } from 'src/app/_shared/models/reference.model';
import { ConversionService } from 'src/app/_shared/services/conversion.service';

@Component({
  selector: 'conversion',
  templateUrl: './conversion.component.html',
})
export class ConversionComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  details: any[] = [];
  references: Reference[] = [];
  displayedColumns: string[] = ['SubFolio', 'Marca', 'Producto', 'Modelo', 'Cantidad', 'NomUnidad', 'Fraccion', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  _onDestroy = new Subject<void>();

  constructor(
    private conversionService: ConversionService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      idFolio: new FormControl('', [Validators.required]),
      pendientes: new FormControl(false)
    });

    this.searchForm.get('pendientes')!.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.getReferences();
      this.details = [];
      this.dataSource = new MatTableDataSource(this.details);
    });

    this.getReferences();
  }

  clear() {
    this.details = [];
    this.dataSource = new MatTableDataSource(this.details);
  }

  getReferences() {
    const request = this.searchForm.getRawValue();

    this.conversionService.getPendings(request.pendientes ? 1 : 0)
      .pipe()
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.references = response;
          } else {
            const errMessage = 'No existe información de pedimentos';
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'warn', message: errMessage },
            });
          }
        },
        error: (err) => {
          const errMessage = 'Ocurrio un error al obtener los pedimentos';
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.log('Error trying to get references');
        }
      });
  }

  validateQty(detail: any): void {
    if (!detail.Cantidad) {
      detail.showError = true;
      detail.Cantidad = undefined;
    } else {
      detail.showError = false;
    }
  }

  onSearch() {
    this.searchForm.markAllAsTouched();
    if (!this.searchForm.valid) return;

    const request = this.searchForm.getRawValue();

    this.conversionService.getDetails(request.idFolio)
      .pipe()
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.details = response;
            this.dataSource = new MatTableDataSource(this.details);
          } else {
            const errMessage = 'No existe información para el folio seleccionado';
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'warn', message: errMessage },
            });
          }
        },
        error: (err) => {
          const errMessage = 'Ocurrio un error al obtener los detalles';
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.log('Error trying to get references');
        }
      });
  }

  onSubmit() {
    const pending = this.details.filter(d => !d.Cantidad);

    pending.forEach(d => {
      d.showError = true;
    });
    
    if (pending.length === 0) {
      this.conversionService.update(this.details)
      .pipe()
      .subscribe({
        next: (response) => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'success', message: 'Información actualizada correctamente' },
            });
            this.clear();
        },
        error: (err) => {
          const errMessage = 'Ocurrio un error al actualizar la informacion';
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.log('Error trying to update references');
        }
      });
    }
  }

  get form() {
    return this.searchForm.controls;
  }
}
