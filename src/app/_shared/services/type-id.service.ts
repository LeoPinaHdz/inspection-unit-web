import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeId } from '../models/type-id.model';

@Injectable()
export class CatIdService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<TypeId[]> {
    return this.http.get<TypeId[]>(`${environment.url}CatIdentificacion/GetAll`);
  }
}
