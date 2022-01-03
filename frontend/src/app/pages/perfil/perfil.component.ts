import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public imagenUrl = '';
  public foto: File = null;
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public showOKP = false;
  public showOKD = false;
  public fileText = 'Seleccione archivo';

  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    imagen: ['']
  });

  public datosPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  })

  constructor( private usuarioService: UsuarioService,
               private fb: FormBuilder,
               private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  // Actualizar password
  cambiarPassword(): void {
    this.sendpass = true;
    this.showOKP = false;
    if (this.datosPassword.invalid || this.passwordNoIgual()) { return; }
    this.usuarioService.cambiarPassword( this.usuarioService.uid, this.datosPassword.value )
      .subscribe( res => {
        this.showOKP = true;
        this.datosPassword.markAsPristine();
      }, (err) => {
          const errtext = err.error.msg || 'No se pudo cambiar la contraseña';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });

  }

  // Actualizar datos de usuario
  enviar(): void {
    if (this.datosForm.invalid) { return; }

    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.usuarioService.actualizarUsuario( this.usuarioService.uid, this.datosForm.value )
    .subscribe( res => {
      this.usuarioService.establecerdatos( res['usuario'].nombre_apellidos, res['usuario'].email );

      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto ) {
        this.usuarioService.subirFoto( this.usuarioService.uid, this.foto)
        .subscribe( res => {
          // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
          this.usuarioService.establecerimagen(res['nombreArchivo']);
          // cambiamos el DOM el objeto que contiene la foto
          document.getElementById('fotoperfilnavbar').setAttribute('src', this.usuarioService.imagenURL);
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo cargar la imagen';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
      this.showOKD = true;
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    });
  }

  // Precargar la imagen en la vista
  cambioImagen( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen').markAsPristine();
          console.log(this.datosForm);
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]);
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => {
        this.imagenUrl = event.target.result.toString();
        this.fileText = nombre;
      };
    } else {
      console.log('no llega target:', event);
    }
  }
  // Recupera los datos del usuario
  cargarUsuario():void {
    // this.datosForm.get('nombre').setValue(this.usuarioService.nombre);
    // this.datosForm.get('apellidos').setValue(this.usuarioService.apellidos);
    this.datosForm.get('email').setValue(this.usuarioService.email);
    this.datosForm.get('imagen').setValue('');
    this.imagenUrl = this.usuarioService.imagenURL;
    this.foto = null;
    this.fileText = 'Seleccione archivo';
    this.datosForm.markAsPristine();
  }

  cancelarPassword() {
    this.sendpass = false;
    this.showOKP = false;
    this.datosPassword.reset();
  }

  campoNoValido( campo: string): boolean {
    return this.datosForm.get(campo).invalid;
  }

  campopNoValido( campo: string): boolean {
    return this.datosPassword.get(campo).invalid && this.sendpass;
  }
  // Comprobar que los campos son iguales
  passwordNoIgual(): boolean {
    return !(this.datosPassword.get('nuevopassword').value === this.datosPassword.get('nuevopassword2').value) && this.sendpass;
  }

}
