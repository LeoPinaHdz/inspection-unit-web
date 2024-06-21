import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Process } from '../models/process.model';

@Injectable()
export class ProcessService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Process[]> {
    return this.http.get<Process[]>(`${environment.url}Procesos/GetAll`);
  }
}
