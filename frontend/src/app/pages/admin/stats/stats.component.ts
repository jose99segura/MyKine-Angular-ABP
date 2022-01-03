import { Component, OnInit } from '@angular/core';

declare function barrasChart();
declare function linesChart();

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    barrasChart();
    linesChart();
  }

}
