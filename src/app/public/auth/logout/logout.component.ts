import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ``,
})
export class LogoutComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit() {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }
}
