import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from '../models/certificate.model';

@Injectable()
export class CertificateService {
  constructor(private http: HttpClient) { }

  search(request: any): Observable<Certificate[]> {
    return this.http.post<Certificate[]>(`${environment.url}Proceedings/Listado`, request);
  }
  getAll(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.url}Proceedings/GetAll`);
  }

  getActive(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.url}Proceedings/GetActive`);
  }

  getById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${environment.url}Proceedings/Get?id=${id}`);
  }

  save(certificate: Certificate): Observable<any> {
    if (!certificate.idActa || certificate.idActa === 0)
      return this.http.post<any>(`${environment.url}Proceedings/Create`, certificate);
    return this.http.put<any>(`${environment.url}Proceedings/Update`, certificate);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Acta/GetDocument?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
