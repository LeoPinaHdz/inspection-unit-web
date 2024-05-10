import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../models/state.model';

@Injectable()
export class StateService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.url}Estado/GetAll`);
  }
}
