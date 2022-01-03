import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Asignatura } from '../models/asignatura.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor( private http: HttpClient,
               private usuarioService: UsuarioService) { }

  listaAsignaturas(desde: number, texto: string, curso: string) {
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!curso) {
      curso = '';
    } else {
      curso = `&curso=${curso}`;
    }
    return this.http.get(`${environment.base_url}/asignaturas/?desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  cargarAsignatura(uid: string) {
    return this.http.get(`${environment.base_url}/asignaturas/?id=${uid}`, this.cabeceras);
  }

  listaMisAsignaturas(desde: number, texto: string, curso: string) {
    const uid = this.usuarioService.uid;
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!curso) {
      curso = '';
    } else {
      curso = `&curso=${curso}`;
    }
    return this.http.get(`${environment.base_url}/asignaturas/?idprof=${uid}&desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  crearAsignatura( data) {
    return this.http.post(`${environment.base_url}/asignaturas/`, data, this.cabeceras);
  }

  actualizarAsignatura( uid:string, data ) {
    return this.http.put(`${environment.base_url}/asignaturas/${uid}`, data, this.cabeceras);
  }

  actualizarListas(uid:string, plista: string[], ptipo: string) {
    const data = {tipo: ptipo, lista: plista};
    return this.http.put(`${environment.base_url}/asignaturas/lista/${uid}`, data, this.cabeceras);
  }

  eliminarAsignatura (uid: string) {
    return this.http.delete(`${environment.base_url}/asignaturas/${uid}`, this.cabeceras);
  }

  get cabeceras(): object {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
}
