import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ReferenceCsvFile } from 'src/app/_shared/models/reference.model';
import { ReferenceService } from 'src/app/_shared/services/reference.service';

@Component({
  selector: 'reference-file-csv',
  templateUrl: './reference-file-csv.component.html',
})
export class ReferenceFileCsvComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['FolioMadre', 'FolioHijo', 'Modelo', 'Fraccion', 'Resultado'];
  references: ReferenceCsvFile[] = [];
  dataSource: MatTableDataSource<ReferenceCsvFile> = new MatTableDataSource();
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
    this.references = [];
  }

  submitFile(files: any) {
    const selectedFile = files[0] as File;
    const formData = new FormData();

    formData.append('file', selectedFile, selectedFile.name);

    this.clear();
    
    this.referenceService.uploadFileCsv(formData)
      .pipe()
      .subscribe({
        next: (response) => {
          this.references = response;
          this.dataSource = new MatTableDataSource(this.references);
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: 'Folios procesados correctamente' },
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

  clear() {
    this.ngOnInit();
  }

}