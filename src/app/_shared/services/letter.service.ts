import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Letter } from '../models/letter.model';

@Injectable()
export class LetterService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Letter[]> {
    return this.http.get<Letter[]>(`${environment.url}Oficios/GetAll`);
  }

  getById(id: number): Observable<Letter> {
    return this.http.get<Letter>(`${environment.url}Oficios/Get?id=${id}`);
  }

  save(officialDocument: Letter): Observable<any> {
    if (!officialDocument.idOficio || officialDocument.idOficio === 0)
      return this.http.post<any>(`${environment.url}Oficios/Create`, officialDocument);
    return this.http.put<any>(`${environment.url}Oficios/Update`, officialDocument);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Document/GetActa?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
