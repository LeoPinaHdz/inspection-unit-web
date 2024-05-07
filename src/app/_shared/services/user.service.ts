import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.url}User/GetAll`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.url}User/Get?id=${id}`);
  }

  save(user: User): Observable<any> {
    if (!user.idUsuario || user.idUsuario === 0)
      return this.http.post<any>(`${environment.url}User/Create`, user);
    return this.http.put<any>(`${environment.url}User/Update`, user);
  }
}

