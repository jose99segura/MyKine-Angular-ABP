import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { NoauthGuard } from '../guards/noauth.guard';
import { RegisterComponent } from './register/register.component';
import { InicioLayoutComponent } from '../layouts/inicio-layout/inicio-layout.component';
import { Register2Component } from './register2/register2.component';

const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: LoginComponent},
    ]
  },
  { path: 'recovery', component: AuthLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: RecoveryComponent},
    ]
  },
  { path: 'register', component: AuthLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: RegisterComponent},
    ]
  },
  { path: 'register2', component: InicioLayoutComponent, canActivate: [ NoauthGuard] ,
    children: [
      { path: '', component: Register2Component},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
