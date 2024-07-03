import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Client } from 'src/app/_shared/models/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientNotarialData } from 'src/app/_shared/models/client-notarial-data';
import { ClientNotarialDataService } from 'src/app/_shared/services/client-notarial-data.service';

@Component({
  selector: 'client-notarial-data',
  templateUrl: './client-notarial-data.component.html'
})

export class ClientNotarialDataComponent implements OnInit, OnChanges {
  @Input() client: Client = { idCliente: 0 };
  isListMode = true;
  displayedColumns: string[] = [
    'acta',
    'notaria',
    'notario',
    'lugar',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<ClientNotarialData> = new MatTableDataSource();
  clientNotarialDataForm!: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private clientNotarialDataService: ClientNotarialDataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.clientNotarialDataForm = new FormGroup({
      idNotarial: new FormControl({ value: '', disabled: true }, []),
      acta: new FormControl(''),
      notaria: new FormControl(''),
      fNotaria: new FormControl(''),
      notario: new FormControl(''),
      lugar: new FormControl(''),
      active: new FormControl(false, [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client && this.client.idCliente !== 0) {
      this.loadAllClientNotarialDatas(this.client.idCliente);
    }
  }

  loadAllClientNotarialDatas(id: number) {
    this.clientNotarialDataService.getAll(id).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get notarial data list');
        }
      });
  }

  onSubmit(): void {
    this.clientNotarialDataForm.markAllAsTouched();
    if (!this.clientNotarialDataForm.valid) return;

    const clientNotarialDataRequest = this.clientNotarialDataForm.getRawValue();
    clientNotarialDataRequest.idEstatus = clientNotarialDataRequest.active ? 1 : 4;
    clientNotarialDataRequest.idCliente = clientNotarialDataRequest.idCliente || this.client.idCliente;

    this.clientNotarialDataService.save(clientNotarialDataRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El cliente notarial ${response.idNotarial} fueron guardados con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.isListMode = !this.isListMode;
              this.clientNotarialDataForm.reset({active: false});
              this.loadAllClientNotarialDatas(this.client.idCliente);
            });
        },
        error: (err) => {
          const errMessage = err.error && err.error.Message ? err.error.Message : `Error al guardar los datos notariales`;
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.error('Error trying to save clientNotarialData');
        }
      });
  }

  onCancel(): void {
    this.isListMode = true;
    this.clientNotarialDataForm.reset({active: false});
  }

  onEditNotarialData(clientNotarialData: ClientNotarialData): void {
    this.updateForm(clientNotarialData);
    this.isListMode = !this.isListMode;
  }

  updateForm(clientNotarialData: ClientNotarialData): void {
    this.clientNotarialDataForm.patchValue({
      idNotarial: clientNotarialData.idNotarial,
      idCliente: clientNotarialData.idCliente,
      acta: clientNotarialData.acta,
      fNotaria: clientNotarialData.fNotaria,
      notaria: clientNotarialData.notaria,
      notario: clientNotarialData.notario,
      lugar: clientNotarialData.lugar,
      active: (clientNotarialData.idEstatus && clientNotarialData.idEstatus === 1) || false
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 
  
  get form() {
    return this.clientNotarialDataForm.controls;
  }
}