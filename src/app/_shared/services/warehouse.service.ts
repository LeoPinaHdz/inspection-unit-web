import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class WarehouseService {
  constructor(private http: HttpClient) { }

  getWarehouses(idUsuario: number): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${environment.url}Warehouse/Get?idUsuario=${idUsuario}`);
  }

  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${environment.url}Warehouse/GetActive`);
  }
}

export interface Warehouse {
  idBodega: number;
  nombre?: string;
}
