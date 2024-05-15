import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientAddress } from '../models/client-address.model';

@Injectable()
export class ClientAddressService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<ClientAddress[]> {
    return this.http.get<ClientAddress[]>(`${environment.url}ClienteLugarInspeccion/GetByClienteLugar?id=${idCliente}`);
  }

  getById(id: number): Observable<ClientAddress> {
    return this.http.get<ClientAddress>(`${environment.url}ClienteLugarInspeccion/Get?id=${id}`);
  }

  save(clientAddress: ClientAddress): Observable<any> {
    if (!clientAddress.idLugar || clientAddress.idLugar === 0)
      return this.http.post<any>(`${environment.url}ClienteLugarInspeccion/Create`, clientAddress);
    return this.http.put<any>(`${environment.url}ClienteLugarInspeccion/Update`, clientAddress);
  }
}