import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DocumentService {
  constructor(private http: HttpClient) { }

  downloadContractPDF(id: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.urlDocuments}document/contratoPDF?idContrato=${id}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  downloadContractWord(id: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.urlDocuments}document/contratoWord?idContrato=${id}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
