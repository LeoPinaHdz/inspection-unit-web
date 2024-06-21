import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reference, ReferenceDetail, ReferenceDetailFileM, ReferenceHeaderFileM } from '../models/reference.model';

@Injectable()
export class ReferenceService {
  constructor(private http: HttpClient) { }

  getReferences(): Observable<any> {
    return this.http.get<any>(`${environment.url}Folio/GetReferences`);
  }
  
  search(request: any): Observable<any> {
    return this.http.post<any>(`${environment.url}Folio/Listado`, request);
  }

  getById(id: number): Observable<Reference> {
    return this.http.get<Reference>(`${environment.url}Folio/Get?id=${id}`);
  }

  getByStatus(idStatus: number): Observable<Reference[]> {
    return this.http.get<Reference[]>(`${environment.url}Folio/GetEstatus?id=${idStatus}`);
  }

  getDetailByStatus(idStatus: number): Observable<ReferenceDetail[]> {
    return this.http.get<ReferenceDetail[]>(`${environment.url}Folio/GetDetallesEstatus?id=${idStatus}`);
  }

  getValidation(request: any): Observable<Reference[]> {
    return this.http.post<Reference[]>(`${environment.url}Folio/GetValidaCancela`, request);
  }

  save(references: Reference): Observable<any> {
    if (!references.idFolio || references.idFolio === 0)
      return this.http.post<any>(`${environment.url}Folio/Create`, references);
    return this.http.put<any>(`${environment.url}Folio/Update`, references);
  }
  
  uploadFileM(form: FormData): Observable<any> {
    return this.http.post<any>(`${environment.url}Folio/Upload`, form);
  }
  
  getUploadDetail(header: ReferenceHeaderFileM): Observable<ReferenceDetailFileM[]> {
    return this.http.post<ReferenceDetailFileM[]>(`${environment.url}Folio/FolioNomList`, header);
  }

  generate(header: ReferenceHeaderFileM): Observable<any> {
    return this.http.post<any>(`${environment.url}Folio/ProcessFolio`, header);
  }
  
  uploadFileCsv(form: FormData): Observable<any> {
    return this.http.post<any>(`${environment.url}Folio/UploadExcel`, form);
  }

  validateReferences(references: Reference[]): Observable<any> {
    return this.http.put<any>(`${environment.url}Folio/UpdateStatus`, references);
  }

  updateStatus(type: number, references: any[]): Observable<any> {
    if (type == 1)
      return this.http.post<any>(`${environment.url}Folio/UpdateEstatus`, references);
    return this.http.post<any>(`${environment.url}Folio/UpdateDetalleEstatus`, references);
  }
  
  download(request: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${environment.url}Folio/GetReporteExcel`, request, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
  
  generateRequests(request: any): Observable<any> {
    return this.http.post<any>(`${environment.url}Requests/Generate`, request);
  }
}