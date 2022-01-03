import { Component, OnInit } from '@angular/core';

declare function barrasChart();
declare function linesChart();

@Component({
  selector: 'app-grafico2',
  templateUrl: './grafico2.component.html',
  styleUrls: ['./grafico2.component.css']
})
export class Grafico2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    barrasChart();
    linesChart();
  }

}
