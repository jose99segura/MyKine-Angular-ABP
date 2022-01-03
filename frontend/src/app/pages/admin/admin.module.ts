import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonsModule } from '../../commons/commons.module';

import { CursosComponent } from './cursos/cursos.component';
import { CursoComponent } from './curso/curso.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AsignaturasComponent } from './asignaturas/asignaturas.component';
import { AsignaturaComponent } from './asignatura/asignatura.component';
import { GruposComponent } from './grupos/grupos.component';
import { GrupoComponent } from './grupo/grupo.component';
import { StatsComponent } from './stats/stats.component';

import { EstadisticasComponent } from './estadisticas/estadisticas.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CursosComponent,
    CursoComponent,
    UsuariosComponent,
    UsuarioComponent,
    AsignaturasComponent,
    AsignaturaComponent,
    GruposComponent,
    GrupoComponent,
    StatsComponent,
    EstadisticasComponent,

  ],
  exports: [
    CursosComponent,
    CursoComponent,
    UsuariosComponent,
    UsuarioComponent,
    DashboardComponent,
    AsignaturasComponent,
    AsignaturaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
  ]
})
export class AdminModule { }
