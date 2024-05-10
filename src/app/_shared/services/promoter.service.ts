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
}
