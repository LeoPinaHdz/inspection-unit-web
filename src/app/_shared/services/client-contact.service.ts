import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientContact } from '../models/client-contact.model';

@Injectable()
export class ClientContactService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ClientContact[]> {
    return this.http.get<ClientContact[]>(`${environment.url}ClientContact/GetAll`);
  }

  getById(id: number): Observable<ClientContact> {
    return this.http.get<ClientContact>(`${environment.url}ClientContact/Get?id=${id}`);
  }

  save(clientContact: ClientContact): Observable<any> {
    if (!clientContact.idContacto || clientContact.idContacto === 0)
      return this.http.post<any>(`${environment.url}ClientContact/Create`, clientContact);
    return this.http.put<any>(`${environment.url}ClientContact/Update`, clientContact);
  }
}