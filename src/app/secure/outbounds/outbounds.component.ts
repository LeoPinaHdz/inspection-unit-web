import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Outbounds, OutboundsService } from './outbounds.service';
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
  selector: 'outbounds',
  templateUrl: './outbounds.component.html',
  styleUrls: ['./outbounds.component.scss'],
})
export class OutboundsComponent implements OnInit {
  displayedColumns: string[] = [
    'idOrden',
    'orden',
    'nombreBodega',
    'nombreCliente',
    'fCapturaFormato',
    'transportista',
    'nombreEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Outbounds> = new MatTableDataSource();
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  selectedRow = new SelectionModel<Outbounds>(false, []);
  clients: Client[] = [];
  warehouses: Warehouse[] = [];
  clientControl = new FormControl(0, [Validators.required]);
  warehouseControl = new FormControl(0, [Validators.required]);
  _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private outboundsService: OutboundsService,
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
              this.loadAllOutbounds();
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
                    this.loadAllOutbounds();
                  });
                this.loadAllOutbounds();
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

  loadAllOutbounds() {
    this.outboundsService.getAll(this.warehouseControl.getRawValue()!, this.clientControl.getRawValue()!)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get outbound list');
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

  updateReceipt(idOrden: Number, idEstatus: Number): void {
    const orden = {idOrden, idEstatus, idUsuario: this.currentUser.idUsuario};

    this.outboundsService.update(orden)
        .pipe()
        .subscribe({
          next: (response) => {
            this.dialog.open(SimpleDialogComponent, {
              data: {type: 'success', message: `La orden de salida ${idOrden} fue actualizado con éxito`},
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.loadAllOutbounds();
            });
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: {type: 'error', message: `Ocurrio un error al actualizar la orden de salida ${idOrden}`},
            });
            console.error('Error trying to update receipt');
          }
        });
  }

  showConfirmDialog(idOrden: Number, idEstatus: Number): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: `¿Esta seguro que desea ${idEstatus === 3 ? 'eliminar' : 'liberar'} la orden de salida ${idOrden}?`,
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.updateReceipt(idOrden, idEstatus);        
      }
    });
  }

  exportAsXLSX(): void {
    const outbounds: any[] = [];

    this.dataSource.data.forEach((data: Outbounds) =>
    outbounds.push({
        '#': data.idOrden,
        'Orden': data.orden,
        'Almacen': data.nombreBodega,
        'Cliente': data.nombreCliente,
        'Fecha': data.fCapturaFormato,
        'Transportista': data.transportista,
        'Estatus': data.nombreEstatus,
      })
    );
    this.excelService.exportAsExcelFile(outbounds, 'OrdeneSalida');
  }

}
