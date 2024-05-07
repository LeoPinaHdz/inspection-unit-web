import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = JSON.parse(sessionStorage.getItem('currentUser') || '{\"pantallas\": []}');
  
  constructor(private http: HttpClient) {
  }

  login(params: Login): Observable<any> {
    return this.http.post<any>(`${environment.url}auth/Login`, params);
  }

  setCurrentUser(user: any) {
    if (sessionStorage.getItem('currentUser') !== null) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('token');
    }

    sessionStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('token', user.token);
    this.currentUser = user;
  }

  isAuthenticated(): boolean {
    return this.currentUser.idUsuario !== undefined;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserRoles(): string[] {
    return this.currentUser.pantallas;
  }

  hasUserRole(role: string): boolean {
    const loggedUser = JSON.parse(sessionStorage.getItem('currentUser') || '{\"pantallas\": []}');

    return loggedUser.pantallas.includes(role);
    //TODO: refactor return this.currentUser.pantallas.includes(role);
  }

  hasUserRoles(expectedRoles: string[]): boolean {
    return this.getUserRoles().some(elemento => expectedRoles.indexOf(elemento) !== -1);
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
  }
}
