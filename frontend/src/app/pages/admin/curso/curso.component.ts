import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CursoService } from '../../../services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    nombrecorto: ['', Validators.required ],
    activo: [true, Validators.required ],
  });
  public submited = false;
  public uid: string = 'nuevo';

  constructor( private fb: FormBuilder,
               private cursoService: CursoService,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    this.cargarDatos(this.uid);
  }

  cargarDatos( uid: string ) {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.cursoService.cargarCurso(this.uid)
        .subscribe( res => {
          if (!res['cursos']) {
            this.router.navigateByUrl('/admin/cursos');
            return;
          };
          this.datosForm.get('nombre').setValue(res['cursos'].nombre);
          this.datosForm.get('nombrecorto').setValue(res['cursos'].nombrecorto);
          this.datosForm.get('activo').setValue(res['cursos'].activo);
          this.datosForm.markAsPristine();
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('nombre').setValue('');
      this.datosForm.get('nombrecorto').setValue('');
      this.datosForm.get('activo').setValue(true);
      this.datosForm.markAsPristine();
    }

  }

  enviar() {
    this.submited = true;
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.cursoService.crearCurso( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.get('uid').setValue( res['curso'].uid );
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.cursoService.actualizarCurso( this.datosForm.get('uid').value, this.datosForm.value)
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
    this.datosForm.get('uid').setValue('nuevo');
    this.datosForm.get('activo').setValue('true');
    this.submited = false;
    this.datosForm.markAsPristine();
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/cursos');
    } else {
      this.cargarDatos(this.uid);
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value === 'nuevo') { return true; }
    return false;
  }

}
