import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Template } from '../models/template.model';

@Injectable()
export class TemplateService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Template[]> {
    return this.http.get<Template[]>(`${environment.url}Formatos/GetAll`);
  }
}
