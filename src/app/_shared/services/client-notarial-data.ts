import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientNotarialData } from '../models/client-notarial-data';

@Injectable()
export class ClientNotarialDataService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<ClientNotarialData[]> {
    return this.http.get<ClientNotarialData[]>(`${environment.url}DatosNotariales/GetByCliente?id=${idCliente}`);
  }

  getById(id: number): Observable<ClientNotarialData> {
    return this.http.get<ClientNotarialData>(`${environment.url}DatosNotariales/Get?id=${id}`);
  }

  save(clientNotarialData: ClientNotarialData): Observable<any> {
    if (!clientNotarialData.idNotarial || clientNotarialData.idNotarial === 0)
      return this.http.post<any>(`${environment.url}DatosNotariales/Create`, clientNotarialData);
    return this.http.put<any>(`${environment.url}DatosNotariales/Update`, clientNotarialData);
  }
}