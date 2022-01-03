import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../models/curso.model';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { GrupoService } from '../../../services/grupo.service';
import { Grupo } from '../../../models/grupo.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit, OnDestroy {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;

  public listaRegistros: Grupo[] = [];

  public cursos: Curso[] = [];

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$;

  constructor( private fb: FormBuilder,
               private cursoService: CursoService,
               private grupoService: GrupoService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarGrupos();
    this.subs$ = this.buscarForm.valueChanges
      .subscribe( event => {
        this.cargarGrupos();
      });
  }

  cargarGrupos() {
    this.loading = true;
    const curso = this.buscarForm.get('curso').value;
    const texto = this.buscarForm.get('texto').value || '';
    this.grupoService.listaAsignaturas( this.registroactual, texto, curso)
      .subscribe( res => {
        this.listaRegistros = res['grupos'];
        this.totalregistros = res['page'].total;
        this.loading = false;
      }, (erro) => {

      });
  }

  eliminarGrupo(uid:string, nombre:string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar grupo',
      text: `Al eliminar el grupo '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.grupoService.eliminarGrupo(uid)
              .subscribe( resp => {
                this.cargarGrupos();
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursoService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarGrupos();
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarGrupos();
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }
}
