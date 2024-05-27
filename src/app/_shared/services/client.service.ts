import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client.model';

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) { }

  getClients(idUsuario: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url}Clientes/Get?idUsuario=${idUsuario}`);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url}Clientes/GetAll`);
  }

  getAllActive(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url}Clientes/GetAllActive`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${environment.url}Clientes/Get?id=${id}`);
  }

  save(user: Client): Observable<any> {
    if (!user.idCliente || user.idCliente === 0)
      return this.http.post<any>(`${environment.url}Clientes/Create`, user);
    return this.http.put<any>(`${environment.url}Clientes/Update`, user);
  }
}
