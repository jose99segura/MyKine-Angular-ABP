import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardaluComponent } from './dashboardalu/dashboardalu.component';

@NgModule({
  declarations: [
    DashboardaluComponent,
  ],
  exports: [
    DashboardaluComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class AluModule { }
