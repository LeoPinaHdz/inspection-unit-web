import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) { }

  getClients(idUsuario: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url}Client/Get?idUsuario=${idUsuario}`);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url}Client/GetAll`);
  }
}

export interface Client {
  idCliente: number;
  nombre?: string;
}
