import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { SecureLayoutComponent } from './layout/secure-layout/secure-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    component: PublicLayoutComponent,
    loadChildren: () => import('./public/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'secure',
    component: SecureLayoutComponent,
    loadChildren: () => import('./secure/secure.module').then((m) => m.SecureModule),
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
