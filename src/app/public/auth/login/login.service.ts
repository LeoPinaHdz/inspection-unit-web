import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Login {
  userName: string;
  password: string;
}

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  login(params: Login): Observable<any> {
    return this.http.post<any>(`${environment.url}auth/Login`, params);
  }
}
