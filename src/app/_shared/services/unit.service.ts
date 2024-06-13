import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unit } from '../models/unit.model';

@Injectable()
export class UnitService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${environment.url}CatUnidades/GetAll`);
  }
}
