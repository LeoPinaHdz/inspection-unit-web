import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ScreenService } from 'src/app/_shared/services/screen.service';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { UsersService } from 'src/app/_shared/services/user.service';
import { User } from 'src/app/_shared/models/user.model';

@Component({
    selector: 'users',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
  })
export class UserDetailComponent implements OnInit, OnDestroy{
  id: any;
  isEdit = false;
  active = false;
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  user: User = {idUsuario: 0};
  screens: any[] = [];
  userForm!: FormGroup;
  _onDestroy = new Subject<void>();
  allClientsSelected: boolean = false;
  allWarehousesSelected: boolean = false;
  allScreensSelected: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private screenService: ScreenService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }  

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.userForm = new FormGroup({
      idUsuario: new FormControl({value: '', disabled: true}, []),
      usuario: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      contrasena: new FormControl('', [Validators.required])
    });

    this.screenService.getAll()
    .pipe()
    .subscribe({
      next: (response) => {
        this.screens = response;
      },
      error: () => {
        console.error('Error trying to get clients');
      }
    });

    if (this.id) {
      this.isEdit = true;

      this.usersService.getById(this.id)
      .pipe()
      .subscribe({
        next: (response) => {
          this.updateForm(response);
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: {type: 'error', message: `Error al obtener los datos del usuario ${this.id}`},
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/users`]);
          });
          console.error('Error trying to get user detail');
        }
      });
    }
  }

  updateForm(user: User): void {
    this.userForm.patchValue({
      idUsuario: user.idUsuario,
      usuario: user.usuario,
      nombre: user.nombre,
      contrasena: 'HIDEN_PASS'
    });
    this.active = (user.idEstatus && user.idEstatus === 1) || false;
    this.user = user;
    this.screens.forEach(p => p.selected = this.isScreenAssigned(p.pantalla));
  }

  isScreenAssigned(key: string): boolean {
    return this.user.pantallas!.filter(p => p === key).length > 0;
  }

  onSubmit(): void {
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) return;

    let userRequest: User;

    if (this.isEdit) {
      const userForm = this.userForm.getRawValue();

      this.user.usuario = userForm.usuario;
      this.user.contrasena = userForm.contrasena === 'HIDEN_PASS' ? '' : userForm.contrasena;
      this.user.nombre = userForm.nombre;

      userRequest = this.user;
    } else {
      userRequest = this.userForm.getRawValue();
      userRequest.idUsuarioCreacion = this.currentUser.idUsuario;
    }

    userRequest.idEstatus = this.active ? 1 : 3;
    userRequest.pantallas = this.screens.filter(t => t.selected).map(t => t.pantalla);

    this.usersService.save(userRequest)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message: `El usuario ${userRequest.idUsuario} fue guardado con éxito`},
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          this.router.navigate([`/secure/users`]);
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Error al guardar el usuario ${userRequest.idUsuario}`},
        });
        console.error('Error trying to save user');
      }
    });
  }

  selectScreen() {
    this.allScreensSelected = this.screens.every(t => t.selected);
  }

  someScreensSelected(): boolean {
    return this.screens.filter(t => t.selected).length > 0 && !this.allScreensSelected;
  }

  selectAllScreens(selected: boolean) {
    this.allScreensSelected = selected;
    this.screens.forEach(t => (t.selected = selected));
  }
}