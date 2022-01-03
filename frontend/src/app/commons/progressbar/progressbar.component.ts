import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit {

  @Input('valor') ancho: number = 0;

  @Output('nombreEvento') salida: EventEmitter<number> = new EventEmitter(); 

  constructor() { }

  ngOnInit(): void {
  }

  accion() {
    this.ancho += 1;
    console.log('Desde progressbar emito:', this.ancho);
    this.salida.emit(this.ancho);
  }

}
