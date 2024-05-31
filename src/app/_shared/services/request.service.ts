import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from '../models/request.model';

@Injectable()
export class RequestService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.url}Solicitudes/GetAll`);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${environment.url}Solicitudes/Get?id=${id}`);
  }

  save(request: Request): Observable<any> {
    if (!request.idSolicitud || request.idSolicitud === 0)
      return this.http.post<any>(`${environment.url}Solicitudes/Create`, request);
    return this.http.put<any>(`${environment.url}Solicitudes/Update`, request);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Document/GetActa?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
