import { Component, OnInit, OnDestroy } from '@angular/core';
import { Asignatura } from '../../../models/asignatura.model';
import { environment } from '../../../../environments/environment.prod';
import { FormBuilder } from '@angular/forms';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../models/curso.model';
import { AsignaturaService } from '../../../services/asignatura.service';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-asignaturasprof',
  templateUrl: './asignaturasprof.component.html',
  styleUrls: ['./asignaturasprof.component.css']
})
export class AsignaturasprofComponent implements OnInit {

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Cursos lsitado
  public listaRegistros: Asignatura[] = [];
  // Ultima búsqueda
  public ultimaBusqueda = '';

  public buscarForm = this.fb.group({
    texto: [''],
    curso: ['']
  });
  public subs$;

  public cursos: Curso[] = [];

  constructor( private fb: FormBuilder,
               private cursosService: CursoService,
               private asigaturaService: AsignaturaService,
               private usuarioService: UsuarioService,
               private itemService: ItemService) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarAsignaturas();
    this.subs$ = this.buscarForm.valueChanges
      .subscribe( event => {
        this.cargarAsignaturas();
      });
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarAsignaturas();
  }

  cargarAsignaturas() {
    this.loading = true;
    const curso = this.buscarForm.get('curso').value;
    const texto = this.buscarForm.get('texto').value || '';
    this.asigaturaService.listaMisAsignaturas( this.registroactual, texto, curso)
      .subscribe( res => {
        this.listaRegistros = res['asignaturas'];
        this.totalregistros = res['page'].total;
        this.loading = false;
        for (const iterator of this.listaRegistros) {
          iterator.items = -1;
          this.itemService.listarItems(iterator.uid)
            .subscribe(res => {
              iterator.items = res['page'].total;
            });
        }
      });

    
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursosService.cargarCursos(0, '')
      .subscribe( res => {
        this.cursos = res['cursos'];
      });
  }
  
  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarAsignaturas();
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }


}
