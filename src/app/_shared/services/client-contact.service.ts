import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientContact } from '../models/client-contact.model';

@Injectable()
export class ClientContactService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<ClientContact[]> {
    return this.http.get<ClientContact[]>(`${environment.url}Contacto/GetByCliente?id=${idCliente}`);
  }

  getById(id: number): Observable<ClientContact> {
    return this.http.get<ClientContact>(`${environment.url}Contacto/Get?id=${id}`);
  }

  save(clientContact: ClientContact): Observable<any> {
    if (!clientContact.idContacto || clientContact.idContacto === 0)
      return this.http.post<any>(`${environment.url}Contacto/Create`, clientContact);
    return this.http.put<any>(`${environment.url}Contacto/Update`, clientContact);
  }
}