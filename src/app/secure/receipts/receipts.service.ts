import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReceiptsService {
  constructor(private http: HttpClient) { }

  getAll(idBodega: Number, idCliente: Number): Observable<Receipts[]> {
    return this.http.get<any>(`${environment.url}DepositReceipt/GetAll?idBodega=${idBodega}&idCliente=${idCliente}`);
  }

  update(receipt: Receipts): Observable<any> {
    return this.http.put<any>(`${environment.url}DepositReceipt/UpdateEstatus`, receipt);
  }
  upload(form: FormData): Observable<any> {
    return this.http.post<any>(`${environment.url}DepositReceipt/UploadExcel`, form);
  }
}

export interface Receipts {
    idRecibo: Number;
    recibo?: string;
    idCliente?: Number;
    fRecibo?: string;
    idBodega?: Number;
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
    nombreEstatus?: string;
    fCapturaFormato?: string;
}
