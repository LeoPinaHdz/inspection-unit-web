import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientRepresentative } from '../models/client-representative.model';

@Injectable()
export class ClientRepresentativeService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<ClientRepresentative[]> {
    return this.http.get<ClientRepresentative[]>(`${environment.url}ClientRepresentative/GetByClientes?idCliente=${idCliente}`);
  }

  getById(id: number): Observable<ClientRepresentative> {
    return this.http.get<ClientRepresentative>(`${environment.url}ClientRepresentative/Get?id=${id}`);
  }

  save(clientRepresentative: ClientRepresentative): Observable<any> {
    if (!clientRepresentative.idRepresentante || clientRepresentative.idRepresentante === 0)
      return this.http.post<any>(`${environment.url}ClientRepresentative/Create`, clientRepresentative);
    return this.http.put<any>(`${environment.url}ClientRepresentative/Update`, clientRepresentative);
  }
}