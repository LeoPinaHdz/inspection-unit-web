import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Receipts, ReceiptsService } from './receipts.service';
import { ExcelService } from 'src/app/_shared/services/excel.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Warehouse, WarehouseService } from 'src/app/_shared/services/warehouse.service';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Client } from 'src/app/_shared/models/client.model';

@Component({
  selector: 'receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
  displayedColumns: string[] = [
    'idRecibo',
    'recibo',
    'nombreBodega',
    'nombreCliente',
    'fCapturaFormato',
    'pedimento',
    'nombreEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Receipts> = new MatTableDataSource();
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  selectedRow = new SelectionModel<Receipts>(false, []);
  clients: Client[] = [];
  warehouses: Warehouse[] = [];
  clientControl = new FormControl(0, [Validators.required]);
  warehouseControl = new FormControl(0, [Validators.required]);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  _onDestroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private receiptsService: ReceiptsService,
    private clientService: ClientService,
    private warehouseService: WarehouseService,
    private excelService: ExcelService
  ) {  }

  ngOnInit() {
    this.clientService.getClients(this.currentUser.idUsuario)
    .pipe()
    .subscribe({
      next: (response) => {
        this.clients = response;
        if (this.clients.length) {
          this.clientControl = new FormControl({value: this.clients[0].idCliente, disabled: this.clients.length === 1}, [Validators.required]);

          this.clientControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.loadAllReceipts();
            });
          this.warehouseService.getWarehouses(this.currentUser.idUsuario)
          .pipe()
          .subscribe({
            next: (response) => {
              this.warehouses = response;
              if (this.warehouses.length) {
                this.warehouseControl = new FormControl({value: this.warehouses[0].idBodega, disabled: this.warehouses.length === 1}, [Validators.required]);

                this.warehouseControl.valueChanges
                  .pipe(takeUntil(this._onDestroy))
                  .subscribe(() => {
                    this.loadAllReceipts();
                  });
                this.loadAllReceipts();
              }
            },
            error: () => {
              console.error('Error trying to get warehouses');
            }
          });
        }
      },
      error: () => {
        console.error('Error trying to get clients');
      }
    });
  }

  loadAllReceipts() {
    this.receiptsService.getAll(this.warehouseControl.getRawValue()!, this.clientControl.getRawValue()!)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get receipt list');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.selectedRow.clear();
  }

  updateReceipt(idRecibo: Number, idEstatus: Number): void {
    const receipt = {idRecibo, idEstatus, idUsuario: this.currentUser.idUsuario};

    this.receiptsService.update(receipt)
        .pipe()
        .subscribe({
          next: (response) => {
            this.dialog.open(SimpleDialogComponent, {
              data: {type: 'success', message: `El recibo ${idRecibo} fue actualizado con éxito`},
            })
            .afterClosed()
            .subscribe(() => {
              this.loadAllReceipts();
            });
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: {type: 'error', message: `Ocurrio un error al actualizar el recibo ${idRecibo}`},
            });
            console.error('Error trying to update receipt');
          }
        });
  }

  showConfirmDialog(idRecibo: Number, idEstatus: Number): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: `¿Esta seguro que desea ${idEstatus === 3 ? 'eliminar' : 'autorizar'} el recibo ${idRecibo}?`,
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.updateReceipt(idRecibo, idEstatus);        
      }
    });
  }

  exportAsXLSX(): void {
    const receipts: any[] = [];

    this.dataSource.data.forEach((data: Receipts) =>
    receipts.push({
        '#': data.idRecibo,
        'Recibo': data.recibo,
        'Almacen': data.nombreBodega,
        'Cliente': data.nombreCliente,
        'Fecha': data.fCapturaFormato,
        'Pedimento': data.pedimento,
        'Estatus': data.nombreEstatus,
      })
    );
    this.excelService.exportAsExcelFile(receipts, 'Recibos');
  }

  submitFile(files: any){
    const selectedFile = files[0] as File;
    const formData = new FormData();
    const selectedWarehouse = this.warehouseControl.getRawValue()!.toString();

    formData.append('archivoExcel', selectedFile, selectedFile.name);
    formData.append('idUsuario', this.currentUser.idUsuario);
    formData.append('idBodega', selectedWarehouse);

    this.receiptsService.upload(formData)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message: `Recibos ${response.idRegistro.toString()} creados con éxito`},
        })
        .afterClosed()
        .subscribe(() => {
          this.loadAllReceipts();
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Ocurrio un error al crear los recibos`},
        });
        console.error('Error trying to create receipt');
      }
    });
  }

}
