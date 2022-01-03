import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardprofComponent } from './dashboardprof/dashboardprof.component';
import { AsignaturasprofComponent } from './asignaturasprof/asignaturasprof.component';
import { AsignaturaprofComponent } from './asignaturaprof/asignaturaprof.component';
import { CommonsModule } from '../../commons/commons.module';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  declarations: [
    DashboardprofComponent,
    AsignaturasprofComponent,
    AsignaturaprofComponent
  ],
  exports: [
    DashboardprofComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    DragulaModule,
  ]
})
export class ProfModule { }
