import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { InicioLayoutComponent } from '../layouts/inicio-layout/inicio-layout.component';


import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { DashboardprofComponent } from './prof/dashboardprof/dashboardprof.component';
import { DashboardaluComponent } from './alu/dashboardalu/dashboardalu.component';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioComponent } from './inicio/inicio.component';
import { CursosComponent } from './admin/cursos/cursos.component';

import { EstadisticasComponent } from './admin/estadisticas/estadisticas.component';

import { CursoComponent } from './admin/curso/curso.component';
import { AsignaturasComponent } from './admin/asignaturas/asignaturas.component';
import { AsignaturaComponent } from './admin/asignatura/asignatura.component';
import { GruposComponent } from './admin/grupos/grupos.component';
import { GrupoComponent } from './admin/grupo/grupo.component';
import { AsignaturasprofComponent } from './prof/asignaturasprof/asignaturasprof.component';
import { AsignaturaprofComponent } from './prof/asignaturaprof/asignaturaprof.component';

import { StatsComponent } from './admin/stats/stats.component';

/*
  /perfil                               [*]
  /admin/* --> páginas de administrador [ROL_ADMIN]
  /prof/*  --> páginas de profesor      [ROL_PROFESOR]
  /alu/*   --> páginas de alumno        [ROL_ALUMNO]

  data --> pasar informacion junto a la ruta para breadcrums y para AuthGuard {rol: 'ROL_ADMIN/ROL_PROFESOR/ROL_ALUMNO/*'}

*/

const routes: Routes = [
  { path: 'perfil', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: PerfilComponent, data: {
                                    titulo: 'Perfil',
                                    breadcrums: []
                                  },},
    ]},

  { path: 'inicio', component: InicioLayoutComponent, data: {rol: '*'},
  children: [
    { path: '', component: InicioComponent, data: {
                                  titulo: 'Inicio',
                                  breadcrums: []
                                },},
  ]},

  { path: 'admin', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'ROL_ADMIN'},
    children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: '¡Bienvenido Administrador!',
                                                        breadcrums: []
                                                      },},
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuarios',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'usuarios/usuario/:uid', component: UsuarioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuario',
                                                        breadcrums: [ {titulo: 'Usuarios', url: '/admin/usuarios'} ],
                                                      },},
    { path: 'cursos', component: CursosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Cursos',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'cursos/curso/:uid', component: CursoComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Curso',
                                                        breadcrums: [ {titulo: 'Usuarios', url: '/admin/cursos'} ],
                                                      },},
    { path: 'asignaturas', component: AsignaturasComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Asignaturas',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'asignaturas/asignatura/:uid', component: AsignaturaComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Asignatura',
                                                        breadcrums: [ {titulo: 'Asignaturas', url: '/admin/asignaturas'} ],
                                                      },},
    { path: 'grupos', component: GruposComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Grupos',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'grupos/grupo/:uid', component: GrupoComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Grupo',
                                                        breadcrums: [ {titulo: 'Grupos', url: '/admin/grupos'} ],
                                                      },},

    { path: 'stats', component: StatsComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Estadisticas Matrix',
                                                        breadcrums: [ ],
                                                      },},

    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Estadisticas',
                                                        breadcrums: [ ],
                                                      },},

    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'prof', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_PROFESOR'},
    children: [
    { path: 'dashboard', component: DashboardprofComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_PROFESOR',
                                                        titulo: 'Dashboard Profesor',
                                                        breadcrums: []
                                                      },},
    { path: 'asignaturas', component: AsignaturasprofComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_PROFESOR',
                                                        titulo: 'Asignaturas - Items',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'asignaturas/asignatura/:uid', component: AsignaturaprofComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_PROFESOR',
                                                        titulo: 'Items',
                                                        breadcrums: [ {titulo: 'Asignaturas - Items', url: '/prof/asignaturas'} ],
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'alu', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ALUMNO'},
    children: [
    { path: 'dashboard', component: DashboardaluComponent, canActivate: [ AuthGuard ], data: {
                                                        rol:'ROL_ALUMNO',
                                                        titulo: 'Dashboard Alumno',
                                                        breadcrums: []
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},


];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
