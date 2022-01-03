import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  imagenUrl: string = '';

  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.cargarUsuario( this.usuarioService.uid )
      .subscribe( res => {
        this.imagenUrl = this.usuarioService.imagenURL;
      });
  }

  logout() {
    this.usuarioService.logout();
  }
}
