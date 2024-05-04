import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) { }

  getAvailableArticles(idBodega: number, idCliente: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${environment.url}Article/GetBalance?idBodega=${idBodega}&idCliente=${idCliente}`);
  }

  save(outbound: Outbounds[]): Observable<OrderSavedResponse[]> {
    return this.http.post<OrderSavedResponse[]>(`${environment.url}ExitOrder/Create`, {ExitOrders: outbound});
  }
}

export interface OrderSavedResponse {
  status: number;
  message: string;
}

export interface Outbounds {
    orden?: string;
    transportista?: string;
    IdCliente?: Number;
    IdBodega?: Number;
    fCaptura?: Date;
    fSalida?: string;
    Observaciones?: string;
    Orden?: string;
    Cliente?: string;
    Almacen?: string;
    NumControl?: string;
    fModificacion?: Date;
    idUsuario?: Number;
    idEstatus?: Number;
    nombreCliente?: string;
    nombreEstatus?: string;
    fCapturaFormato?: string;
    detalle?: OrderDetail[];
}

export interface OrderDetail {
    IdRecibo?: Number;
    IdReciboDetalle?: Number;
    IdCliente?: Number;
    IdBodega?: Number;
    Cliente: string;
    Almacen?: string;
    Recibo?: string;
    Articulo?: string;
    DetalleArticulo?: string;
    LoteArticulo?: string;
    Inicial?: Number;
    Disponible?: number;
    Solicitada?: Number;
    retirar?: number;
    showError?: boolean;
}
