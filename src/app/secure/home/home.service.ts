import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HomeService {
  constructor(private http: HttpClient) { }

  getAvailableYear(): Observable<any> {
    return this.http.get<any>(`${environment.url}Dashboard/Anio`);
  }

  getMonthlyReport(year: string): Observable<any> {
    return this.http.get<any>(`${environment.url}Dashboard/Balance?anio=${year}`);
  }
}

