import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactType } from '../models/contact-type.model';

@Injectable()
export class ContactTypeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ContactType[]> {
    return this.http.get<ContactType[]>(`${environment.url}Tipo/GetAll`);
  }
}
