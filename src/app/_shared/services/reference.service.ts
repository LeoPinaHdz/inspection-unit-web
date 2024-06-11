import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reference, ReferenceDetailFileM, ReferenceHeaderFileM } from '../models/reference.model';

@Injectable()
export class ReferenceService {
  constructor(private http: HttpClient) { }

  getAll(idCliente: number): Observable<Reference[]> {
    return this.http.get<Reference[]>(`${environment.url}Folio/GetByClienteLugar?id=${idCliente}`);
  }

  getById(id: number): Observable<Reference> {
    return this.http.get<Reference>(`${environment.url}Folio/Get?id=${id}`);
  }

  save(clientAddress: Reference): Observable<any> {
    if (!clientAddress.idFolio || clientAddress.idFolio === 0)
      return this.http.post<any>(`${environment.url}Folio/Create`, clientAddress);
    return this.http.put<any>(`${environment.url}Folio/Update`, clientAddress);
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
}