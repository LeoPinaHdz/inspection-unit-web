import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class OutboundsService {
  constructor(private http: HttpClient) { }

  getAll(idBodega: Number, idCliente: Number): Observable<Outbounds[]> {
    return this.http.get<any>(`${environment.url}ExitOrder/GetAll?idBodega=${idBodega}&idCliente=${idCliente}`);
  }

  update(outbound: Outbounds): Observable<any> {
    return this.http.put<any>(`${environment.url}ExitOrder/UpdateEstatus`, outbound);
  }
}

export interface Outbounds {
    idOrden: Number;
    orden?: string;
    transportista?: string;
    idCliente?: Number;
    fCaptura?: Date;
    fModificacion?: Date;
    idUsuario?: Number;
    idEstatus?: Number;
    nombreCliente?: string;
    nombreBodega?: string;
    nombreEstatus?: string;
    fCapturaFormato?: string;
}
