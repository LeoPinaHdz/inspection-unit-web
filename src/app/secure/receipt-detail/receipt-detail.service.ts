import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReceiptDetailService {
  constructor(private http: HttpClient) { }

  getDetail(id: Number): Observable<Receipt> {
    return this.http.get<any>(`${environment.url}DepositReceipt/Get?idRecibo=${id}`);
  }

  getArticles(id: Number): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.url}Article/Get?idCliente=${id}`);
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${environment.url}Unit/GetAll`);
  }

  save(receipt: Receipt): Observable<any> {
    if (!receipt.idRecibo || receipt.idRecibo === 0)
      return this.http.post<any>(`${environment.url}DepositReceipt/Create`, receipt);
    return this.http.put<any>(`${environment.url}DepositReceipt/Update`, receipt);
  }
}

export interface Unit {
  idUnidad: Number;
  nombre: string;
}

export interface ReceiptDetail {
  idReciboDetalle: Number;
  idRecibo?: Number;
  partida: Number;
  articulo?: string;
  cantidad?: Number;
  idUnidad?: Number;
  valorUnitario?: Number;
  pzasxBulto?: Number;
  nt?: Number;
  vm?: Number;
  detalleArticulo?: string;
  loteArticulo?: string;
  pesoUnitario?: Number;
  descripcion?: string;
  cantidadActual?: Number;
  cantidadDisponible?: Number;
  cantidadRetirada?: Number;
  cantidadSolicitada?: Number;
  fCaptura?: string;
  fModificacion?: string;
  idUsuario?: Number;
  idEstatus?: Number;
  nombreUnidad?: string;
  idBodega?: number;
}

export interface Receipt {
  idRecibo: Number;
  recibo?: string;
  idCliente?: number;
  fRecibo?: string;
  idBodega?: number;
  idBodeguero?: Number;
  contenedores?: string;
  observaciones?: string;
  pedimento?: string;
  numControl?: string;
  fCaptura?: Date;
  fModificacion?: Date;
  idUsuario?: Number;
  idEstatus?: Number;
  anio?: string;
  nombreCliente?: string;
  nombreBodega?: string;
  detalle?: ReceiptDetail[];
}

export interface Article {
  idArticulo: Number;
  articulo: string;
}
