import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Executive } from '../models/executive.model';

@Injectable()
export class ExecutiveService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Executive[]> {
    return this.http.get<Executive[]>(`${environment.url}Ejecutivo/GetAll`);
  }

  getById(id: number): Observable<Executive> {
    return this.http.get<Executive>(`${environment.url}Ejecutivo/Get?id=${id}`);
  }

  save(executive: Executive): Observable<any> {
    if (!executive.idEjecutivo || executive.idEjecutivo === 0)
      return this.http.post<any>(`${environment.url}Ejecutivo/Create`, executive);
    return this.http.put<any>(`${environment.url}Ejecutivo/Update`, executive);
  }
}

