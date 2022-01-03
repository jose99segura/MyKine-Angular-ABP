import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalRegistros: number = 0;     // total de registros a paginar
  @Input() registroActual: number = 0;  // posicion actual dentro del total
  @Input() registrosPorPagina: number = 10;   // número de registros a mostrar por página
  @Input() texto: boolean = false;

  @Output() cambiarPagina:EventEmitter<number> = new EventEmitter();

  public paginaActual = 0;
  public ultimaPagina = 0;
  public prepost = 2; // numero de páginas previas+posteriores+1
  public listaPaginas: number[];
  public registroHasta = 0;    // Indicará el hasta en el mensaje Mostrado de X a Y de Z
  
  constructor() { }

  calcularPaginas(){
    if (this.totalRegistros === 0) { 
      this.paginaActual = 0;
      this.ultimaPagina = 0;
      this.listaPaginas = [];
      return; 
    }
    // Definimos el registro hasta para mostrar en el mensaje
    this.registroHasta = ( this.registroActual + this.registrosPorPagina - 1 <= this.totalRegistros ? 
                                      this.registroActual + this.registrosPorPagina - 1 : 
                                      this.totalRegistros);

    // Si nos han pasado un registro actual mayor que el número total de registros ponemos como actual el máximo
    if (this.registroActual > this.totalRegistros) { this.registroActual = this.totalRegistros; }
    // Calculamos la página en la que está el registro actual
    this.paginaActual = Math.trunc( this.registroActual / this.registrosPorPagina) + 1;
    // Calculamos el total de páginas
    this.ultimaPagina = Math.trunc((this.totalRegistros - 1) / this.registrosPorPagina) + 1;
    // Calculamos el desde - hasta de las páginas a generar
    const desde = (this.paginaActual - this.prepost > 0 ? this.paginaActual - this.prepost : 1);
    const hasta = (this.paginaActual + this.prepost < this.ultimaPagina ? this.paginaActual + this.prepost : this.ultimaPagina);

    // inicializamos el array a vacio 
    this.listaPaginas = [];
    // Creamos un array con el número de páginas a mostrar desde-hasta
    for (let index = desde; index <= hasta; index++)
             {
                this.listaPaginas.push(index);
             }
  }

  ngOnChanges(): void {
    this.calcularPaginas();
  }

  ngOnInit(): void {
    this.calcularPaginas();
  }

  cambiaPagina( nueva: number) {
    this.cambiarPagina.emit(nueva);
  }

}
