import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reference } from '../models/reference.model';

@Injectable()
export class ConversionService {
  constructor(private http: HttpClient) { }

  getPendings(pendings: number): Observable<Reference[]> {
    return this.http.get<Reference[]>(`${environment.url}FolioEtiquetas/GetPendientes?pendientes=${pendings}`);
  }

  getDetails(idFolio: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}FolioEtiquetas/GetDetalles?idFolio=${idFolio}`);
  }

  update(changes: any[]): Observable<any> {
    return this.http.post<any>(`${environment.url}FolioEtiquetas/Create`, changes);
  }
}