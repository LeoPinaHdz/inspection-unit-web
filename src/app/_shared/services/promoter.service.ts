import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promoter } from '../models/promoter.model';

@Injectable()
export class PromoterService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Promoter[]> {
    return this.http.get<Promoter[]>(`${environment.url}Promotores/GetAll`);
  }

  getActive(): Observable<Promoter[]> {
    return this.http.get<Promoter[]>(`${environment.url}Promotores/GetActive`);
  }

  getById(id: number): Observable<Promoter> {
    return this.http.get<Promoter>(`${environment.url}Promotores/Get?id=${id}`);
  }

  save(executive: Promoter): Observable<any> {
    if (!executive.idPromotor || executive.idPromotor === 0)
      return this.http.post<any>(`${environment.url}Promotores/Create`, executive);
    return this.http.put<any>(`${environment.url}Promotores/Update`, executive);
  }
}
