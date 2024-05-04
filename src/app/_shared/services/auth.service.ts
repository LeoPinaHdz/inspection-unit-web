import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private currentUser;
  
  constructor() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{\"pantallas\": []}');
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{\"pantallas\": []}');
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('currentUser') !== undefined;
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
  }

  hasUserRoles(expectedRoles: string[]): boolean {
    return this.getUserRoles().some(elemento => expectedRoles.indexOf(elemento) !== -1);
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
  }
}
