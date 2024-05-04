import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderDetail, Outbounds } from '../order/order.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { Client, ClientService } from 'src/app/_shared/services/client.service';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Warehouse, WarehouseService } from 'src/app/_shared/services/warehouse.service';
import { OrderService } from '../order/order.service';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Almacen',
    'Cliente',
    'Recibo',
    'Articulo',
    'DetalleArticulo',
    'LoteArticulo',
    'Disponible'
  ];
  dataSource: MatTableDataSource<OrderDetail> = new MatTableDataSource();
  clients: Client[] = [];
  warehouses: Warehouse[] = [];
  clientControl = new FormControl(1, [Validators.required]);
  warehouseControl = new FormControl(1, [Validators.required]);
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  filterValue = '';

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  _onDestroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private clientService: ClientService,
    private warehouseService: WarehouseService
  ) {  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.filterValue = '';
    this.clientService.getClients(this.currentUser.idUsuario)
    .pipe()
    .subscribe({
      next: (response) => {
        if (response.length) {
          this.clients = response.length > 1 ? [{idCliente: 0, nombre: 'TODOS'}, ...response] : response;
          this.clientControl = new FormControl({value: this.clients[0].idCliente, disabled: response.length === 1}, [Validators.required]);

          this.clientControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.loadArticles();
            });
          this.warehouseService.getWarehouses(this.currentUser.idUsuario)
          .pipe()
          .subscribe({
            next: (response) => {
              if (response.length) {
                this.warehouses = response.length > 1 ? [{idBodega: 0, nombre: 'TODOS'}, ...response] : response;
                this.warehouseControl = new FormControl({value: this.warehouses[0].idBodega, disabled: response.length === 1}, [Validators.required]);

                this.warehouseControl.valueChanges
                  .pipe(takeUntil(this._onDestroy))
                  .subscribe(() => {
                    this.loadArticles();
                  });
                this.loadArticles();
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

  loadArticles() {
    this.orderService.getAvailableArticles(this.warehouseControl.getRawValue()!, this.clientControl.getRawValue()!)
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
  }

  validateQty(detail: OrderDetail): void {
    if (detail.retirar! > detail.Disponible! || detail.retirar! < 0) {
      detail.showError = true;
      detail.retirar = undefined;
    } else {
      detail.showError = false;
    }
  }
}
