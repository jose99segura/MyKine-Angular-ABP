import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from '../../../services/asignatura.service';
import Swal from 'sweetalert2';
import { Asignatura } from '../../../models/asignatura.model';
import { Curso } from '../../../models/curso.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item.model';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';

declare var $: any;

@Component({
  selector: 'app-asignaturaprof',
  templateUrl: './asignaturaprof.component.html',
  styleUrls: ['./asignaturaprof.component.css']
})
export class AsignaturaprofComponent implements OnInit, OnDestroy {

  public uidasignatura = '';
  public asignatura: Asignatura = new Asignatura('', '', new Curso('', '', false) );

  public datosForm = this.fb.group({
    nombre: ['', Validators.required ],
    descripcion: [''],
    valor: [''],
    horasEstimadas: [''],
    horasAbsolutas: ['false', Validators.required],
    tipo: ['OBL', Validators.required],
    asignatura: ['']
  });

  public submited = false;
  public listadd = 'LISTAITEMS';

  public listaItems: Item[] = [];
  public subs$ = new Subscription();

  public tituloModal = 'Nuevo Item';
  public uidmodal = '';
  public poseditar = -1;
  public loading=false;

  constructor( private activatedRoute: ActivatedRoute,
               private asignaturaService: AsignaturaService,
               private router: Router,
               private fb: FormBuilder,
               private itemService: ItemService,
               private dragulaService: DragulaService,
               private usuarioService: UsuarioService) {


          dragulaService.createGroup(this.listadd, {
              revertOnSpill: true
            });

          this.subs$.add(
            dragulaService.dragend(this.listadd)
              .subscribe((res) => {
                this.guardarOrden();
              })
          );

  }

  ngOnInit(): void {
    this.uidasignatura = this.activatedRoute.snapshot.params.uid;
    this.cargarAsignatura();
    this.cargarItems();
  }
  
  cargarItems() {
    this.loading = true;
    this.itemService.listarItems(this.uidasignatura)
    .subscribe(res => {
      this.listaItems = res['items'];
      this.loading = false;
    }, error => {
      this.router.navigateByUrl('/prof/asignaturas');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo cargar los items de la asignatura, vuelva a intentarlo',});
    });
  }

  cargarAsignatura() {
    this.asignaturaService.cargarAsignatura( this.uidasignatura )
    .subscribe( res => {
      this.asignatura = res['asignaturas'];
    },  (err) => {
      this.router.navigateByUrl('/prof/asignaturas');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo cargar los datos, vuelva a intentarlo',});
    });
  }

  nuevo() {
    this.uidmodal = '';
    this.submited = false;
    this.poseditar = -1;
    this.tituloModal = 'Nuevo Item';
    this.datosForm.reset();
    this.datosForm.get('horasAbsolutas').setValue('false');
    this.datosForm.get('tipo').setValue('OBL');
  }

  editar(pos:number) {
    this.tituloModal='Editar Item';
    this.poseditar = pos;
    this.submited = true;
    this.uidmodal = this.listaItems[pos].uid;
    this.datosForm.get('nombre').setValue(this.listaItems[pos].nombre);
    this.datosForm.get('descripcion').setValue(this.listaItems[pos].descripcion);
    this.datosForm.get('horasAbsolutas').setValue(this.listaItems[pos].horasAbsolutas.toString());
    this.datosForm.get('horasEstimadas').setValue(this.listaItems[pos].horasEstimadas);
    this.datosForm.get('tipo').setValue(this.listaItems[pos].tipo);
    this.datosForm.get('valor').setValue(this.listaItems[pos].valor);
  }

  cancelar() {
    this.datosForm.reset();
  }

  guardar() {
    this.submited = true;
    if (this.datosForm.invalid) {return; }
    this.datosForm.get('asignatura').setValue(this.uidasignatura);
    if (this.uidmodal === '') {
      this.itemService.crearItem(this.datosForm.value)
      .subscribe(res => {
        this.listaItems.push(res['item']);
        this.submited = false;
        $('#modalformulario').modal('toggle');
      }, (err) => {
        const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
        Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
      });
    } else {
      // Estamos actualizando
      this.itemService.actualizarItem(this.uidmodal, this.datosForm.value)
      .subscribe( res => {
        this.listaItems[this.poseditar] = res["item"];
        this.poseditar = -1;
        $('#modalformulario').modal('toggle');
      }, err => {
        const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
        Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
      })
    }
  }

  guardarOrden() {
    // Creamos una lista de objetos con el uid y el nuevo orden
    let lista: string[] =[];
    for (let i = 0; i<this.listaItems.length; i++) {
      this.listaItems[i].orden = i;
      lista.push(this.listaItems[i].uid);
    }
    this.itemService.actualizarOrden(lista)
      .subscribe(res => {
          // se han actualizado los valores correctamente
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        });
  }

  eliminar( pos: number) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_PROFESOR') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar item',
      text: `Al eliminar el item '${this.listaItems[pos].nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        this.itemService.eliminarItem(this.listaItems[pos].uid)
        .subscribe( resp => {
          // Eliminamos el elemento de la lista
          this.listaItems.splice(pos,1);
        }
        ,(err) =>{
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        })
      }
    });
  }

  // Indica si un campo del form es valido para mostrar retroalimentación
  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.submited;
  }

  // Alternar entre el icono de flecha doble arriba/abajo al plegar o desplegar una descripción
  accion(idx: number) {
    $('#icono'+idx).toggleClass('fa-angle-double-down fa-angle-double-up');
  }

  // Icono para indicar el tipo de item
  iconTipo(idx: number) {
    switch (this.listaItems[idx].tipo) {
      case 'MIN':
        return 'fa-hand-rock text-warning';
      case 'OBL':
        return 'fa-hand-point-right text-success';
      case 'OPT':
        return 'fa-thumbs-up text-info';
    }
    return 'fa-exclamation text-danger';
  }

  ngOnDestroy() {
    // Desuscribir el observable para guardar orden
    this.subs$.unsubscribe();
    // Eliminr el servicio de dragula
    this.dragulaService.destroy(this.listadd);
  }

}
          