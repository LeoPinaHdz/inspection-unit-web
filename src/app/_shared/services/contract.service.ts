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

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${environment.url}Contratos/Get?id=${id}`);
  }

  save(contract: Contract): Observable<any> {
    if (!contract.idContrato || contract.idContrato === 0)
      return this.http.post<any>(`${environment.url}Contratos/Create`, contract);
    return this.http.put<any>(`${environment.url}Contratos/Update`, contract);
  }

  download(id: number, type: number): Observable<HttpResponse<any>> {
    return this.http.get(`${environment.url}Document/GetActa?id=${id}&type=${type}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
