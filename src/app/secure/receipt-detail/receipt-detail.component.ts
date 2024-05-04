import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Receipt, ReceiptDetail, ReceiptDetailService, Unit } from './receipt-detail.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { Client, ClientService } from 'src/app/_shared/services/client.service';
import { Warehouse, WarehouseService } from 'src/app/_shared/services/warehouse.service';

@Component({
  selector: 'receipt-detail',
  templateUrl: './receipt-detail.component.html',
})
export class ReceiptDetailComponent implements OnInit, OnDestroy {
  formReceipt!: FormGroup;
  formReceiptDetail!: FormGroup;
  isEdit = false;
  receiptId: any;
  receipt: Receipt = {idRecibo: 0, idEstatus: 1};
  selectedDetail?: ReceiptDetail;
  receiptDetails: ReceiptDetail[] = [];
  clients: Client[] = [];
  warehouses: Warehouse[] = [];
  displayedColumns: string[] = ['articulo', 'partida', 'cantidad', 'nombreUnidad', 'detalleArticulo', 'loteArticulo', 'pzasxBulto', 'nt', 'vm', 'actions'];
  dataSource: MatTableDataSource<ReceiptDetail> = new MatTableDataSource();
  articles: Article[] = [];
  filteredArticles: ReplaySubject<Article[]> = new ReplaySubject<Article[]>(1);
  units: Unit[] = [];
  filteredUnits: ReplaySubject<Unit[]> = new ReplaySubject<Unit[]>(1);
  _onDestroy = new Subject<void>();
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

  @ViewChild('articleSelect', { static: true }) articleSelect!: MatSelect;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private receiptDetailService: ReceiptDetailService,
    private clientService: ClientService,
    private warehouseService: WarehouseService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.receiptId = this.route.snapshot.paramMap.get('id');

    this.formReceipt = new FormGroup({
      idRecibo: new FormControl({value: '', disabled: true}, [Validators.required]),
      pedimento: new FormControl('', []),
      idCliente: new FormControl({value: '', disabled: this.receiptId}, [Validators.required]),
      idBodega: new FormControl({value: '', disabled: this.receiptId}, [Validators.required]),
      contenedores: new FormControl('', [Validators.required]),
      fRecibo: new FormControl(new Date(), [Validators.required]),
      observaciones: new FormControl('', []),
    });

    this.formReceiptDetail = new FormGroup({
      idReciboDetalle: new FormControl(0, []),
      articulo: new FormControl('', [Validators.required]),
      articuloFilter: new FormControl('', []),
      cantidad: new FormControl('', [Validators.required]),
      idUnidad: new FormControl('', [Validators.required]),
      idUnidadFilter: new FormControl('', []),
      partida: new FormControl('0', []),
      pzasxBulto: new FormControl('', [Validators.required]),
      detalleArticulo: new FormControl('', [Validators.required]),
      loteArticulo: new FormControl('', []),
      nt: new FormControl('', []),
      vm: new FormControl('', []),
    });

    this.formReceipt.get('idCliente')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.getArticles();
      });

    if (!this.receiptId) {
      this.clientService.getClients(this.currentUser.idUsuario)
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (this.clients.length) {
            this.formReceipt.get('idCliente')!.setValue(this.clients[0].idCliente);
            if (this.clients.length === 1) this.formReceipt.get('idCliente')!.disable();
          }
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
      this.warehouseService.getWarehouses(this.currentUser.idUsuario)
      .pipe()
      .subscribe({
        next: (response) => {
          this.warehouses = response;
          if (this.warehouses.length) {
            this.formReceipt.get('idBodega')!.setValue(this.warehouses[0].idBodega);
            if (this.warehouses.length === 1) this.formReceipt.get('idBodega')!.disable();
          }
        },
        error: () => {
          console.error('Error trying to get warehouses');
        }
      });
    }


    this.receiptDetailService.getUnits()
    .pipe()
    .subscribe({
      next: (response) => {
        this.units = response;
        this.filteredUnits.next(this.units.slice());
        this.formReceiptDetail.get('idUnidad')!.setValue(this.units[0]);
        this.formReceiptDetail.get('idUnidadFilter')!.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterUnits();
          });
      },
      error: () => {
        console.error('Error trying to get clients');
      }
    });

    if (this.receiptId) {
      this.isEdit = true;

      this.receiptDetailService.getDetail(this.receiptId)
      .pipe()
      .subscribe({
        next: (response) => {
          this.updateReceiptForm(response);
          if (response.idEstatus !== 1) {
            this.formReceipt.get('pedimento')!.disable();
            this.formReceipt.get('contenedores')!.disable();
            this.formReceipt.get('fRecibo')!.disable();
            this.formReceipt.get('observaciones')!.disable();
          }
          if (response.detalle) this.receiptDetails = response.detalle;
          this.initDetailsTable(this.receiptDetails);
          this.clients = [{idCliente: response.idCliente || 0, nombre: response.nombreCliente}];
          this.formReceipt.get('idCliente')!.setValue(response.idCliente);
          this.warehouses = [{idBodega: response.idBodega || 0, nombre: response.nombreBodega}];
          this.formReceipt.get('idBodega')!.setValue(response.idBodega);
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: {type: 'error', message: `Error al obtener los datos del recibo ${this.receiptId}`},
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/receipts`]);
          });
          console.error('Error trying to get receipt detail');
        }
      });
    }
  }

  getArticles() {
    this.receiptDetailService.getArticles(this.formReceipt.get('idCliente')!.value)
    .pipe()
    .subscribe({
      next: (response) => {
        this.articles = response;
        this.filteredArticles.next(this.articles.slice());
        this.formReceiptDetail.get('articulo')!.setValue(this.articles[0]);
        this.formReceiptDetail.get('articuloFilter')!.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterArticles();
          });
      },
      error: () => {
        console.error('Error trying to get clients');
      }
    });
  }

  resetDetatilForm() {
    this.formReceiptDetail.reset();
    this.formReceiptDetail.get('idReciboDetalle')!.setValue(0);
    this.formReceiptDetail.get('partida')!.setValue(0);
    this.formReceiptDetail.get('loteArticulo')!.setValue('');
  }

  updateReceiptForm(receipt: Receipt): void {
    this.formReceipt.patchValue({
      idRecibo: receipt.idRecibo,
      pedimento: receipt.pedimento,
      idCliente: receipt.idCliente,
      idBodega: receipt.idBodega,
      contenedores: receipt.contenedores,
      fRecibo: receipt.fRecibo,
      observaciones: receipt.observaciones,
    });
    this.receipt = receipt;
  }

  editDetail(detail: ReceiptDetail): void {
    this.selectedDetail = detail;
    this.receiptDetails = this.receiptDetails.filter(d => d.partida !== detail.partida);
    this.initDetailsTable(this.receiptDetails);
    this.formReceiptDetail.patchValue({
      idReciboDetalle: detail.idReciboDetalle,
      articulo: detail.articulo,
      cantidad: detail.cantidad,
      idUnidad: detail.idUnidad,
      partida: detail.partida,
      pzasxBulto: detail.pzasxBulto,
      nt: detail.nt,
      vm: detail.vm,
      detalleArticulo: detail.detalleArticulo,
      loteArticulo: detail.loteArticulo,
    });
  }

  showConfirmDeleteDialog(detail: ReceiptDetail): void {
    this.dialog.open(ConfirmationDialogComponent, {
        data: `¿Esta seguro que desea eliminar la partida ${detail.partida}?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.receiptDetails = this.receiptDetails.filter(d => d.partida !== detail.partida);
          this.initDetailsTable(this.receiptDetails, true);
        }
      });
  }

  onCancelEdit(): void {
    if (this.selectedDetail) {
      this.receiptDetails.push(this.selectedDetail);
      this.initDetailsTable(this.receiptDetails);
      this.resetDetatilForm();
      this.selectedDetail = undefined;
    }
  }

  onSubmitDetail(): void {
    this.formReceiptDetail.markAllAsTouched();
    if (!this.formReceiptDetail.valid) return;

    const receiptDetail = this.formReceiptDetail.getRawValue();
    const nombreUnidad = this.units.filter(u => u.idUnidad === receiptDetail.idUnidad)[0].nombre;

    if (this.isEdit && this.selectedDetail) {
      this.selectedDetail.articulo = receiptDetail.articulo;
      this.selectedDetail.cantidad = receiptDetail.cantidad;
      this.selectedDetail.idUnidad = receiptDetail.idUnidad;
      this.selectedDetail.pzasxBulto = receiptDetail.pzasxBulto;
      this.selectedDetail.nt = receiptDetail.nt;
      this.selectedDetail.vm = receiptDetail.vm;
      this.selectedDetail.detalleArticulo = receiptDetail.detalleArticulo;
      this.selectedDetail.loteArticulo = receiptDetail.loteArticulo;
      this.selectedDetail.nombreUnidad = nombreUnidad;

      this.receiptDetails.push(this.selectedDetail);
    } else {
      receiptDetail.idUsuario = this.currentUser.idUsuario;
      receiptDetail.nombreUnidad = nombreUnidad;
      receiptDetail.descripcion = receiptDetail.detalleArticulo;
      receiptDetail.partida = receiptDetail.partida == 0 ? this.receiptDetails.length + 1 : receiptDetail.partida;
      this.receiptDetails.push(receiptDetail);
    }
    this.selectedDetail = undefined;
    this.initDetailsTable(this.receiptDetails, true);
    this.resetDetatilForm();
  }

  onSubmit(): void {
    this.formReceipt.markAllAsTouched();
    if (!this.formReceipt.valid || this.receiptDetails.length === 0) return;

    let receipt: Receipt;

    if (this.isEdit) {
      const receiptForm = this.formReceipt.getRawValue();

      this.receipt.pedimento = receiptForm.pedimento;
      this.receipt.contenedores = receiptForm.contenedores;
      this.receipt.fRecibo = receiptForm.fRecibo;
      this.receipt.observaciones = receiptForm.observaciones;

      receipt = this.receipt;
    } else {
      receipt = this.formReceipt.getRawValue();
      receipt.numControl = '';
      receipt.recibo = '';
      receipt.anio = '';
      receipt.idUsuario = this.currentUser.idUsuario;
    }

    this.receiptDetails.forEach(d => d.idBodega = receipt.idBodega);
    receipt.detalle = this.receiptDetails;
    
    this.receiptDetailService.save(receipt)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message: `El recibo ${receipt.idRecibo} fue guardado con éxito`},
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          this.router.navigate([`/secure/receipts`]);
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Error al guardar el recibo ${receipt.idRecibo}`},
        });
        console.error('Error trying to save receipt detail');
      }
    });
  }

  initDetailsTable(receipts: ReceiptDetail[], setPartida?: boolean) {
    const sortedReceipts = receipts.sort((a, b) => a.partida > b.partida ? 1 : -1);
    if (setPartida) {
      sortedReceipts.forEach((item, i) => {
        item.partida = i + 1;
      });
    }

    this.dataSource = new MatTableDataSource(sortedReceipts);
  }

  private filterArticles() {
    if (!this.articles) {
      return;
    }
    let search = this.formReceiptDetail.get('articuloFilter')!.value;
    if (!search) {
      this.filteredArticles.next(this.articles.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredArticles.next(
      this.articles.filter(article => article.articulo.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterUnits() {
    if (!this.units) {
      return;
    }
    let search = this.formReceiptDetail.get('idUnidadFilter')!.value;
    if (!search) {
      this.filteredUnits.next(this.units.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUnits.next(
      this.units.filter(unit => unit.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  get form() {
    return this.formReceipt.controls;
  }

  get formDetail() {
    return this.formReceiptDetail.controls;
  }
}
