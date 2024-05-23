import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Official } from '../models/official.model';

@Injectable()
export class OfficialService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Official[]> {
    return this.http.get<Official[]>(`${environment.url}Official/GetAll`);
  }

  getActive(): Observable<Official[]> {
    return this.http.get<Official[]>(`${environment.url}Official/GetActive`);
  }

  getById(id: number): Observable<Official> {
    return this.http.get<Official>(`${environment.url}Official/Get?id=${id}`);
  }

  save(official: Official): Observable<any> {
    if (!official.idFuncionario || official.idFuncionario === 0)
      return this.http.post<any>(`${environment.url}Official/Create`, official);
    return this.http.put<any>(`${environment.url}Official/Update`, official);
  }
}
