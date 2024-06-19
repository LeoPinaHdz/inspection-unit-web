import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from '../models/certificate.model';

@Injectable()
export class CertificateService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.url}Certificate/GetAll`);
  }

  getActive(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.url}Certificate/GetActive`);
  }

  getById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${environment.url}Certificate/Get?id=${id}`);
  }

  save(certificate: Certificate): Observable<any> {
    if (!certificate.idActa || certificate.idActa === 0)
      return this.http.post<any>(`${environment.url}Certificate/Create`, certificate);
    return this.http.put<any>(`${environment.url}Certificate/Update`, certificate);
  }
}
