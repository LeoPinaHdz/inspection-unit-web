import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit{
  complexMenus= [{name: 'op', isOpen: false}];
  isExpanded = false;
  roles: string[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{\"pantallas\": []}');
    this.roles = currentUser.pantallas;
  }

  toggleMenu(key: string): void {
    const selectedMenu = this.complexMenus.filter(m => m.name === key)[0];
    selectedMenu.isOpen = !selectedMenu.isOpen;
  }

  isMenuOpen(key: string): boolean {
    return this.complexMenus.filter(m => m.name === key)[0].isOpen;
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }

  closeAllMenus(): void {
    this.complexMenus.forEach(m => m.isOpen = false);
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
