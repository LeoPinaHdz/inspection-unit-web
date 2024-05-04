import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ScreenService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Screen[]> {
    return this.http.get<Screen[]>(`${environment.url}Screen/GetAll`);
  }
}

export interface Screen {
  nombre: string;
}
