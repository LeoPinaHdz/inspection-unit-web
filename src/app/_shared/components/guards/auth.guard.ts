import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRole: string = route.data.role;

    if (!this.authService.isAuthenticated() || !this.authService.hasUserRole(allowedRole)) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return false;
    }

    return true;
  }
}