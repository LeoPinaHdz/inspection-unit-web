import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ReferenceDetailFileM, ReferenceHeaderFileM } from 'src/app/_shared/models/reference.model';
import { ReferenceService } from 'src/app/_shared/services/reference.service';

@Component({
  selector: 'reference-file-m',
  templateUrl: './reference-file-m.component.html',
})
export class ReferenceFileMComponent implements OnInit, OnDestroy {
  displayedHeaderColumns: string[] = ['cons', 'pedimento', 'cliente', 'nombreArchivo', 'idBodega'];
  displayedColumns: string[] = ['uva', 'norma', 'fraccion', 'modalidad', 'producto', 'cantidad', 'umc'];
  header: ReferenceHeaderFileM[] = [];
  headerDataSource: MatTableDataSource<ReferenceHeaderFileM> = new MatTableDataSource();
  details: ReferenceDetailFileM[] = [];
  dataSource: MatTableDataSource<ReferenceDetailFileM> = new MatTableDataSource();

  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private referenceService: ReferenceService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.header = [];
    this.details = [];
  }

  generate() {
    this.referenceService.generate(this.header[0])
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `Folios generados con éxito` },
          })
            .afterClosed()
            .subscribe(() => {
              this.ngOnInit();
            });
        },
        error: (err) => {
          const errMessage = err.error && err.error.Message ? err.error.Message : 'Ocurrio un error al crear los folios';
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.log('Error trying to create reference');
        }
      });
  }

  submitFile(files: any) {
    const selectedFile = files[0] as File;
    const formData = new FormData();

    formData.append('file', selectedFile, selectedFile.name);

    this.referenceService.uploadFileM(formData)
      .pipe()
      .subscribe({
        next: (response) => {
          this.header = response;
          this.headerDataSource = new MatTableDataSource(this.header);

          this.referenceService.getUploadDetail(this.header[0])
            .pipe()
            .subscribe({
              next: (response) => {
                this.details = response;

                this.dataSource = new MatTableDataSource(this.details);
              },
              error: (err) => {
                const errMessage = err.error && err.error.Message ? err.error.Message : 'Ocurrio un error al consultar el detalle de folio';
                this.dialog.open(SimpleDialogComponent, {
                  data: { type: 'error', message: errMessage },
                });
                console.log('Error trying to create reference');
              }
            });
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `Archivo cargado con éxito` },
          });
        },
        error: (err) => {
          const errMessage = err.error && err.error.Message ? err.error.Message : 'Ocurrio un error al crear los folios';
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.log('Error trying to create reference');
        }
      });
  }

}