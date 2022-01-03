import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();

@Component({
  selector: 'app-inicio-layout',
  templateUrl: './inicio-layout.component.html',
  styleUrls: ['./inicio-layout.component.css']
})
export class InicioLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
  }

}
