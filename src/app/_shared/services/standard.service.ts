import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Standard } from '../models/standard.model';

@Injectable()
export class StandardService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Standard[]> {
    return this.http.get<Standard[]>(`${environment.url}Normas/GetAll`);
  }

  getAllActive(): Observable<Standard[]> {
    return this.http.get<Standard[]>(`${environment.url}Normas/GetAllActive`);
  }

  getById(id: number): Observable<Standard> {
    return this.http.get<Standard>(`${environment.url}Normas/Get?id=${id}`);
  }

  save(standard: Standard): Observable<any> {
    if (!standard.idNorma || standard.idNorma === 0)
      return this.http.post<any>(`${environment.url}Normas/Create`, standard);
    return this.http.put<any>(`${environment.url}Normas/Update`, standard);
  }
}