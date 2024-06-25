import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Display } from '../models/display.model';

@Injectable()
export class DisplayService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Display[]> {
    return this.http.get<Display[]>(`${environment.url}Presentacion/GetAll`);
  }
}
