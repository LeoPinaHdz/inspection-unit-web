import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorLogin!: boolean;

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService) { }

  ngOnInit() {
    this.formLogin = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      Constrasena: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      const login = this.formLogin.getRawValue();

      this.loginService.login(login)
      .pipe()
      .subscribe({
        next: (response) => {
          if (sessionStorage.getItem('currentUser') !== null) {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('token');
          }
  
          sessionStorage.setItem('currentUser', JSON.stringify(response));
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/secure/home']);
        },
        error: () => {
          this.errorLogin = true
          console.error('Error trying to authenticate user');
        }
      });
    }
  }

  get form() {
    return this.formLogin.controls;
  }
}
