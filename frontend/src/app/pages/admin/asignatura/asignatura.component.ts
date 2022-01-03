import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AsignaturaService } from '../../../services/asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.css']
})
export class AsignaturaComponent implements OnInit {

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    nombrecorto: ['', Validators.required ],
    curso: ['', Validators.required ],
  });
  public cursos: Curso[] = [];

  public submited = false;
  public uid: string = 'nuevo';

  public profesores: string[] = [];
  public alumnos: string[] = [];

  public tab = 1;
  
  constructor(private fb: FormBuilder,
              private asignaturaService: AsignaturaService,
              private cursosService: CursoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos(this.uid);
  }

  guardarLista( evento: string[], tipo: string) {
    this.asignaturaService.actualizarListas(this.uid, evento, tipo)
      .subscribe( res => {
        
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, inténtelo más tarde'});
        return;
      });
  }
   
  cargarDatos( uid: string ) {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.asignaturaService.cargarAsignatura(this.uid)
        .subscribe( res => {
          if (!res['asignaturas']) {
            this.router.navigateByUrl('/admin/asignaturas');
            return;
          };
          this.datosForm.get('nombre').setValue(res['asignaturas'].nombre);
          this.datosForm.get('nombrecorto').setValue(res['asignaturas'].nombrecorto);
          this.datosForm.get('curso').setValue(res['asignaturas'].curso._id);
          this.datosForm.markAsPristine();
          this.uid = res['asignaturas'].uid;
          this.submited = true;
          this.profesores = res['asignaturas'].profesores;
          this.alumnos = res['asignaturas'].alumnos;
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo'});
          return;
        });
    } else {
      this.nuevo();
      
    }

  }

  enviar() {
    this.submited = true;
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.asignaturaService.crearAsignatura( this.datosForm.value )
        .subscribe( res => {
          this.uid = res['asignatura'].uid;
          this.datosForm.get('uid').setValue( this.uid );
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.asignaturaService.actualizarAsignatura( this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } 

  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
    this.datosForm.get('nombre').setValue('');
    this.datosForm.get('nombrecorto').setValue('');
    this.datosForm.get('curso').setValue('');
    this.datosForm.markAsPristine();
    this.profesores= [];
    this.alumnos = [];
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/asignaturas');
    } else {
      this.cargarDatos(this.uid);
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  esnuevo(): boolean {
    if (this.uid === 'nuevo') { return true; }
    return false;
  }

  cargarCursos() {
    // cargamos todos los cursos
    this.cursosService.cargarCursos(0, '')
      .subscribe( res => { 
        this.cursos = res['cursos'];
      });
  }

}
