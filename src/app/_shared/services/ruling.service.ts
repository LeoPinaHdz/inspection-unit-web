import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ruling } from '../models/ruling.model';

@Injectable()
export class RulingService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Ruling[]> {
    return this.http.get<Ruling[]>(`${environment.url}Ruling/GetAll`);
  }

  getActive(): Observable<Ruling[]> {
    return this.http.get<Ruling[]>(`${environment.url}Ruling/GetActive`);
  }

  getById(id: number): Observable<Ruling> {
    return this.http.get<Ruling>(`${environment.url}Ruling/Get?id=${id}`);
  }

  save(ruling: Ruling): Observable<any> {
    if (!ruling.idDictamen || ruling.idDictamen === 0)
      return this.http.post<any>(`${environment.url}Ruling/Create`, ruling);
    return this.http.put<any>(`${environment.url}Ruling/Update`, ruling);
  }
}
