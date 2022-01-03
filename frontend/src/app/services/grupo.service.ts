import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/grupos/lista/${uid}`, data, this.cabeceras);
  }

  crearGrupo(data) {
    return this.http.post(`${environment.base_url}/grupos/`, data, this.cabeceras);
  }

  actualizarGrupo(uid: string, data) {
    return this.http.put(`${environment.base_url}/grupos/${uid}`, data, this.cabeceras);
  }

  cargarGrupo( uid: string) {
    if (uid===undefined) { uid=''}
    return this.http.get(`${environment.base_url}/grupos/?id=${uid}` , this.cabeceras);
  }

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
    return this.http.get(`${environment.base_url}/grupos/?desde=${desde}${texto}${curso}` , this.cabeceras);
  }

  eliminarGrupo(uid: string) {
    return this.http.delete(`${environment.base_url}/grupos/${uid}`, this.cabeceras);
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
