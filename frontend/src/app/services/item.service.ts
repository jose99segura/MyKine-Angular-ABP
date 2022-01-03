import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor( private http: HttpClient ) { }

  eliminarItem( uid: string) {
    return this.http.delete(`${environment.base_url}/items/${uid}`, this.cabeceras);
  }

  crearItem( data ) {
    // Eliminamos los campos vacios para que solo se comprueben en backend los que llegan y no den error los opcionales
    for (let element in data) {
      if (!data[element]) { delete data[element]; }
    }
    return this.http.post(`${environment.base_url}/items/`, data, this.cabeceras);
  }

  actualizarItem(uid: string, data) {
    for (let element in data) {
      if (!data[element]) { delete data[element]; }
    }
    return this.http.put(`${environment.base_url}/items/${uid}`, data, this.cabeceras);

  }

  actualizarOrden( plista) {
    const data = { listauids: plista};
    return this.http.put(`${environment.base_url}/items/orden/`, data, this.cabeceras);
  }

  listarItems( asignatura: string) {
    return this.http.get(`${environment.base_url}/items/?idasignatura=${asignatura}`, this.cabeceras)
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
