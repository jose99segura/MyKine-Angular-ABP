import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  url = 'http://localhost:3000/api/upload/evidencia/hola.txt';
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=25;


  //VARIABLES USUARIO
  public loading = true;

  public totalusuarios = 0;

  private ultimaBusqueda = '';
  public listaUsuarios: Usuario[] = [];
  //FIN VARIABLES USUARIO


  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  }

  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.url += '?token='+this.usuarioService.token;

    this.cargarUsuarios(this.ultimaBusqueda); //Para usuarios
  }

  algo( valor: number ) {
    console.log('Desde dashboard recibo:', valor);
  }

  //SECCION USUARIOS
  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['usuarios'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarUsuarios(this.ultimaBusqueda);
          } else {
            this.listaUsuarios = [];
            this.totalusuarios = 0;
          }
        } else {
          this.listaUsuarios = res['usuarios'];
          console.log(this.listaUsuarios);
          this.totalusuarios = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  crearImagenUrl(imagen: string) {
    return this.usuarioService.crearImagenUrl(imagen);
  }

  eliminarUsuario( uid: string, nombre: string, apellidos: string) {
    // Comprobar que no me borro a mi mismo
    if (uid === this.usuarioService.uid) {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
      return;
    }
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar usuario',
      text: `Al eliminar al usuario '${nombre} ${apellidos}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.usuarioService.borrarUsuario(uid)
              .subscribe( resp => {
                this.cargarUsuarios(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                //console.warn('error:', err);
              })
          }
      });
  }
  //FIN SECCION USUARIOS
}
