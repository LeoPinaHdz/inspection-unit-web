import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReportParameters, ReportType } from '../models/reports.model';

@Injectable()
export class ReportsService {
  constructor(private http: HttpClient) { }

  getReportType(): Observable<ReportType[]> {
    return this.http.get<ReportType[]>(`${environment.url}Report/GetAll`);
  }

  getReport(reportParameters: ReportParameters): Observable<any> {
    return this.http.post<any>(`${environment.url}Report/Report`, reportParameters);
  }
}
