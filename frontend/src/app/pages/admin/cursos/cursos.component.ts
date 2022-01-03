import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Cursos lsitado
  public listaRegistros: Curso[] = [];
  // Ultima búsqueda
  public ultimaBusqueda = '';
  

  constructor( private cursoService: CursoService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarCursos(this.ultimaBusqueda);
  }

  cargarCursos( texto: string ) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    this.cursoService.cargarCursos(this.registroactual, texto)
      .subscribe(res => {
        if (res['cursos'].length === 0) {
          if (this.registroactual > 0) {
            this.registroactual -= this.registrosporpagina;
            if (this.registroactual < 0) { this.registroactual = 0};
            this.cargarCursos(this.ultimaBusqueda);
          } else {
            this.listaRegistros = [];
            this.totalregistros = 0;
          }
        } else {
          this.listaRegistros = res['cursos'];
          this.totalregistros = res['page'].total;
        }
        this.loading = false;
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
        this.loading = false;
      });
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarCursos(this.ultimaBusqueda);
  }

  eliminarCurso( uid: string, nombre: string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar curso',
      text: `Al eliminar el curso '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.cursoService.eliminarCurso(uid)
              .subscribe( resp => {
                this.cargarCursos(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }
}
