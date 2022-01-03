import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment  } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor( private http: HttpClient) {  }

  cargarCurso( uid: string): Observable<object> {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/cursos/?id=${uid}` , this.cabeceras);
  }

  cargarCursos( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/cursos/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  crearCurso( data: Curso ): Observable<object> {
    return this.http.post(`${environment.base_url}/cursos/`, data, this.cabeceras);
  }

  actualizarCurso(uid: string, data: Curso): Observable<object> {
    return this.http.put(`${environment.base_url}/cursos/${uid}`, data, this.cabeceras);
  }

  eliminarCurso (uid) {
    return this.http.delete(`${environment.base_url}/cursos/${uid}`, this.cabeceras);
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

}
