import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

export interface ReportParameters {
  idReporte: Number;
  ReciboIni?: string;
  ReciboFin?: string;
  ArticuloIni?: string;
  ArticuloFin?: string;
  Fecha: string;
  FechaCierre: string;
  MovimientosEnCero: Number;
}

export interface ReportType {
  idReporte: Number;
  nombre?: string;
}
