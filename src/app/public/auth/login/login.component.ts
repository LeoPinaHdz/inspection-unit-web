import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_shared/services/auth.service';

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
    private readonly authService: AuthService) { }

  ngOnInit() {
    this.formLogin = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      Constrasena: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      const login = this.formLogin.getRawValue();

      this.authService.login(login)
      .pipe()
      .subscribe({
        next: (response) => {
          this.authService.setCurrentUser(response);
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
