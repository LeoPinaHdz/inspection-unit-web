import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reference, ReferenceDetail, ReferenceDetailFileM, ReferenceHeaderFileM } from '../models/reference.model';

@Injectable()
export class ReferenceService {
  constructor(private http: HttpClient) { }

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
    return this.http.post<any>(`${environment.url}Folio/ProcessFolioFraccion`, header);
  }
  
  uploadFileCsv(form: FormData): Observable<any> {
    return this.http.post<any>(`${environment.url}Folio/UploadExcel`, form);
  }

  validateReferences(references: Reference[]): Observable<any> {
    return this.http.put<any>(`${environment.url}Folio/UpdateStatus`, references);
  }

  updateStatus(type: number, references: Reference[]): Observable<any> {
    if (type == 1)
      return this.http.post<any>(`${environment.url}Folio/UpdateStatus`, references);
    return this.http.put<any>(`${environment.url}Folio/UpdateStatusDetail`, references);
  }
}