import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();
declare function iniciarSidebarmenu();

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
    iniciarSidebarmenu();
  }

}
