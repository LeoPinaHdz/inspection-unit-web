import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderDetail, Outbounds } from './order.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientService } from 'src/app/_shared/services/client.service';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from './order.service';
import { Subject, takeUntil } from 'rxjs';
import { Warehouse, WarehouseService } from 'src/app/_shared/services/warehouse.service';
import { Client } from 'src/app/_shared/models/client.model';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Almacen',
    'Cliente',
    'Recibo',
    'Articulo',
    'DetalleArticulo',
    'LoteArticulo',
    'Disponible',
    'retirar'
  ];
  dataSource: MatTableDataSource<OrderDetail> = new MatTableDataSource();
  clients: Client[] = [];
  warehouses: Warehouse[] = [];
  orderDetails: OrderDetail[] = [];
  clientControl = new FormControl(1, [Validators.required]);
  warehouseControl = new FormControl(1, [Validators.required]);
  transportControl = new FormControl('', [Validators.required]);
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  filterValue = '';
  disabledSubmitOrder = false;

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
    this.transportControl = new FormControl('', [Validators.required]);
    this.filterValue = '';
    this.disabledSubmitOrder = false;
    this.orderDetails = [];
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

  moveToOrderDetail(detail: OrderDetail): void {
    const orderDetail = { ...detail };
    
    this.orderDetails.push(orderDetail);
    this.table.renderRows();
  }

  deleteFromOrderDetail(detail: OrderDetail): void {
    const orderDetail = { ...detail};

    this.orderDetails = this.orderDetails.filter(( element ) => {
      return element.IdReciboDetalle !== orderDetail.IdReciboDetalle;
    });
    this.table.renderRows();
  }

  isAssigned(IdReciboDetalle: number): boolean {
    return this.orderDetails.filter(d => d.IdReciboDetalle === IdReciboDetalle).length > 0;
  }

  onSubmit(): void {
    this.transportControl.markAsTouched();
    const pending = this.orderDetails.filter(d => !d.retirar);

    pending.forEach(d => {
      d.showError = true;
    });

    if (this.transportControl.valid && pending.length === 0) {
      this.disabledSubmitOrder = true;

      const request: Outbounds[] = [];
      const groupedDetails = this.groupDetails(this.orderDetails);

      groupedDetails.forEach(details => {
        const order: Outbounds = {
          transportista: this.transportControl.value!,
          detalle: details,
          IdCliente: details[0].IdCliente,
          IdBodega: details[0].IdBodega,
          Observaciones: "",
          NumControl: "",
          Orden: "",
          idUsuario: this.currentUser.idUsuario
        };

        request.push(order);
      });
      
      this.orderService.save(request)
      .pipe()
      .subscribe({
        next: (response) => {
          let message = 'La orden se ha generado con éxito';
          let type = 'success';

          const partialOrder = response.filter(o => o.status === 2);
          const successOrder = response.filter(o => o.status === 1);
          const noOrder = response.filter(o => o.status === 3);

          if (partialOrder.length || (successOrder.length && noOrder.length)) {
            message = 'Se ha creado parcialmente la orden';
          } else if (noOrder.length && !successOrder.length && !partialOrder.length) {
            message = 'Ocurrio un error al generar la orden de salida, por falta de saldo';
            type = 'error';
          }

          this.dialog.open(SimpleDialogComponent, {
            data: {type, message},
          })
          .afterClosed()
          .subscribe(() => {
            this.ngOnInit();
          });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: {type: 'error', message: 'Ocurrio un error al generar la orden de salida'},
          });
          this.disabledSubmitOrder = false;
          console.error('Error trying to update receipt');
        }
      });
    }
  }

  groupDetails(details: any[]): any[] {
    const byGroup = details.reduce((a, e) => {
      const key = e.IdBodega.toString();
      if (!a[key]) {
        a[key] = [];
      }
      a[key].push(e);
      return a;
    }, {});
    
    return Object.values(byGroup);
  }
}
