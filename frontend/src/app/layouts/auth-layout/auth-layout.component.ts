import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
  }

}
