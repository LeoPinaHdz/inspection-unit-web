import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

export interface User {
    idUsuario: Number;
    idUsuarioCreacion?: Number;
    usuario?: string;
    nombre?: string;
    idEstatus?: Number;
    contrasena?: string;
    clientes?: ClientUser[];
    bodegas?: WarehouseUser[];
    pantallas?: string[];
}

export interface ClientUser {
  idCliente: Number;
  email?: string; 
}

export interface WarehouseUser {
  idBodega: Number;
  email?: string; 
}