import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from '../models/request.model';

@Injectable()
export class RequestService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.url}Requests/GetAll`);
  }

  search(request: any): Observable<Request[]> {
    return this.http.post<Request[]>(`${environment.url}Requests/Listado`, request);
  }

  getByClient(id: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.url}Requests/GetByClient?id=${id}`);
  }

  getByLetter(id: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${environment.url}Requests/GetByLetter?id=${id}`);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${environment.url}Requests/Get?id=${id}`);
  }

  save(request: Request): Observable<any> {
    if (!request.idSolicitud || request.idSolicitud === 0)
      return this.http.post<any>(`${environment.url}Requests/Create`, request);
    return this.http.put<any>(`${environment.url}Requests/Update`, request);
  }

  download(id: number, type: number, template: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Requests/Download?id=${id}&type=${type}&template=${template}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
