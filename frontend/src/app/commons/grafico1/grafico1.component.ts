import { Component, OnInit } from '@angular/core';

declare function barrasChart();

@Component({
  selector: 'app-grafico1',
  templateUrl: './grafico1.component.html',
  styleUrls: ['./grafico1.component.css']
})
export class Grafico1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    barrasChart();
  }

}
