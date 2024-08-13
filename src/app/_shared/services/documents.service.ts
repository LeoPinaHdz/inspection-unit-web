import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DocumentService {
  constructor(private http: HttpClient) { }

  downloadContract(id: number, tipo: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.urlDocuments}document/contratos?idContrato=${id}&tipo=${tipo}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  downloadRequest(id: number, plantilla: number, tipo: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.urlDocuments}document/solicitudes?iSolicitud=${id}&tipoPlantilla=${plantilla}&tipoArchivo=${tipo}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  getAttachmentFilename(defaultName: string, contentDisposition: string | null): string {
    if (!contentDisposition) return defaultName;

    const matches = /filename\*=UTF-8''(.+)|filename="(.+)"|filename=(.+)/.exec(contentDisposition);
    if (matches) {
      return matches[1] || matches[2] || matches[3];
    }
    return defaultName;
  }
}
