import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract } from '../models/contract.model';

@Injectable()
export class ContractService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${environment.url}Contratos/GetAll`);
  }

  search(request: any): Observable<Contract[]> {
    return this.http.post<Contract[]>(`${environment.url}Contratos/Search`, request);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${environment.url}Contratos/Get?id=${id}`);
  }

  save(contract: Contract): Observable<any> {
    if (!contract.idContrato || contract.idContrato === 0)
      return this.http.post<any>(`${environment.url}Contratos/Create`, contract);
    return this.http.put<any>(`${environment.url}Contratos/Update`, contract);
  }

  update(receipt: Contract): Observable<any> {
    return this.http.put<any>(`${environment.url}Contratos/UpdateEstatus`, receipt);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Contratos/GetActa?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
