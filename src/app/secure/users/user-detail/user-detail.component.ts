import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ClientService } from 'src/app/_shared/services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { WarehouseService } from 'src/app/_shared/services/warehouse.service';
import { ScreenService } from 'src/app/_shared/services/screen.service';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { User, UsersService } from 'src/app/_shared/services/users.service';

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
  clients: any[] = [];
  warehouses: any[] = [];
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
    private clientService: ClientService,
    private warehouseService: WarehouseService,
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

    this.clientService.getAll()
    .pipe()
    .subscribe({
      next: (response) => {
        this.clients = response;
        this.clients.forEach(p => p.email = '');
      },
      error: () => {
        console.error('Error trying to get clients');
      }
    });

    this.warehouseService.getAll()
    .pipe()
    .subscribe({
      next: (response) => {
        this.warehouses = response;
        this.warehouses.forEach(p => p.email = '');
      },
      error: () => {
        console.error('Error trying to get warehouses');
      }
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
    this.clients.forEach(p => {
      const client = this.getClientAssigned(p.idCliente);
      if (client.length > 0) {
        p.selected = true;
        p.email = client[0].email;
      }
    });
    this.warehouses.forEach(p => {
      const warehouse = this.getWarehouseAssigned(p.idBodega);
      if (warehouse.length > 0) {
        p.selected = true;
        p.email = warehouse[0].email;
      }
    });
    this.screens.forEach(p => p.selected = this.isScreenAssigned(p.nombre));
  }

  getClientAssigned(key: number) {
    return this.user.clientes!.filter(p => p.idCliente === key);
  }

  getWarehouseAssigned(key: number) {
    return this.user.bodegas!.filter(p => p.idBodega === key);
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

    userRequest.idEstatus = this.active ? 1 : 2;
    userRequest.clientes = this.clients.filter(t => t.selected).map(t => {return {idCliente: t.idCliente, email: t.email};});
    userRequest.bodegas = this.warehouses.filter(t => t.selected).map(t => {return {idBodega: t.idBodega, email: t.email};});
    userRequest.pantallas = this.screens.filter(t => t.selected).map(t => t.nombre);

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

  selectClient() {
    this.allClientsSelected = this.clients.every(t => t.selected);
  }

  someClientsSelected(): boolean {
    return this.clients.filter(t => t.selected).length > 0 && !this.allClientsSelected;
  }

  selectAllClients(selected: boolean) {
    this.allClientsSelected = selected;
    this.clients.forEach(t => (t.selected = selected));
  }

  selectWarehouse() {
    this.allWarehousesSelected = this.warehouses.every(t => t.selected);
  }

  someWarehousesSelected(): boolean {
    return this.warehouses.filter(t => t.selected).length > 0 && !this.allWarehousesSelected;
  }

  selectAllWarehouses(selected: boolean) {
    this.allWarehousesSelected = selected;
    this.warehouses.forEach(t => (t.selected = selected));
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