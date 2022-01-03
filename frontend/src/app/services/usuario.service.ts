import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router  ) { }

  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  actualizarUsuario ( uid: string, data: Usuario) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarListaUsuarios ( uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/lista` , data, this.cabeceras);
  }

  cargarUsuariosRol ( rol: string, uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/rol/${rol}`, data, this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  login( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login`, formData)
            .pipe(
              tap( (res : any) => {
                localStorage.setItem('token', res['token']);
                const {uid, rol} = res;
                this.usuario = new Usuario(uid, rol);
              })
            );
  }

  loginGoogle( tokenGoogle ) {
    return this.http.post(`${environment.base_url}/login/google`, { token: tokenGoogle })
            .pipe(
              tap( (res : any) => {
                localStorage.setItem('token', res['token']);
                const {uid, rol} = res;
                this.usuario = new Usuario(uid, rol);
              })
            );
  }

  logout(): void {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usuario y en localstore
          const { uid, nombre_apellidos, email, rol, alta, activo, imagen, token} = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, nombre_apellidos, email, alta, activo, imagen);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  establecerdatos(nombre_apellidos: string, email: string): void {
    // this.usuario.nombre = nombre;
    // this.usuario.apellidos = apellidos;
    this.usuario.nombre_apellidos = nombre_apellidos;
    this.usuario.email = email;
  }

  crearImagenUrl( imagen: string) {

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/upload/fotoperfil/no-imagen?token=${token}`;
    }
    return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get nombre_apellidos(): string{
    return this.usuario.nombre_apellidos;
  }

  // get apellidos(): string{
  //   return this.usuario.apellidos;
  // }

  get email(): string{
    return this.usuario.email;
  }

  get imagen(): string{
    return this.usuario.imagen;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }



}
