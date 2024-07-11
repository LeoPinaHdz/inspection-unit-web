import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { List } from '../models/list.model';
import { Request } from '../models/request.model';

@Injectable()
export class ListService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<List[]> {
    return this.http.get<List[]>(`${environment.url}Lista/GetAll`);
  }

  search(request: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.url}Lista/Listado`, request);
  }

  getByClient(id: number): Observable<List[]> {
    return this.http.get<List[]>(`${environment.url}Lista/GetByClient?id=${id}`);
  }

  getMuestreo(cantidad: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}Lista/GetMuestreo?cantidad=${cantidad}`);
  }

  getPendingRequests(idCliente: number, tipoServicio: boolean): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.url}Requests/Pendientes?IdCliente=${idCliente}&tipoServicio=${tipoServicio}`);
  }

  getRequestDetail(idSolicitud: number, tipoServicio: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}Requests/PendientesDetalle?idSolicitud=${idSolicitud}&tipoServicio=${tipoServicio}`);
  }

  getById(id: number): Observable<List> {
    return this.http.get<List>(`${environment.url}Lista/Get?id=${id}`);
  }

  save(officialDocument: List): Observable<any> {
    if (!officialDocument.idLista || officialDocument.idLista === 0)
      return this.http.post<any>(`${environment.url}Lista/Create`, officialDocument);
    return this.http.put<any>(`${environment.url}Lista/Update`, officialDocument);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Document/GetActa?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
