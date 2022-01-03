import { Component, OnInit } from '@angular/core';

declare function barrasChart();
declare function linesChart();

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    barrasChart();
    linesChart();
  }

}
