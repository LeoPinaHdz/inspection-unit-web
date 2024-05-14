import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientRepresentative } from '../models/client-representative.model';

@Injectable()
export class ClientRepresentativeService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<ClientRepresentative[]> {
    return this.http.get<ClientRepresentative[]>(`${environment.url}ClienteRepresentante/GetByCliente?id=${idCliente}`);
  }

  getById(id: number): Observable<ClientRepresentative> {
    return this.http.get<ClientRepresentative>(`${environment.url}ClienteRepresentante/Get?id=${id}`);
  }

  save(clientRepresentative: ClientRepresentative): Observable<any> {
    console.log(clientRepresentative);
    console.log(clientRepresentative.idIdentificacion);
    if (!clientRepresentative.idRepresentante || clientRepresentative.idRepresentante === 0)
      return this.http.post<any>(`${environment.url}ClienteRepresentante/Create`, clientRepresentative);
    return this.http.put<any>(`${environment.url}ClienteRepresentante/Update`, clientRepresentative);
  }
}