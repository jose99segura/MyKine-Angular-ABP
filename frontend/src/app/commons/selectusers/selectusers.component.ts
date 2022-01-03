import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UserSelect } from '../../interfaces/user-select.interface';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-selectusers',
  templateUrl: './selectusers.component.html',
  styleUrls: ['./selectusers.component.css']
})

export class SelectusersComponent implements OnInit, OnChanges {

  // Recibe una lista de usuarios extraidos de alumnos/profesores de BD
  // tiene la estructura {_id: string, usuario: string}
  @Input() selected: {_id: string, usuario: string}[] = [];
  @Input() rol: string = 'ROL_ALUMNO';

  // Emite la lista de string de los usuarios seleccionados
  @Output() nuevaLista:EventEmitter<string[]> = new EventEmitter();

  public listaSelected: UserSelect[] = [];
  public listaUsers: UserSelect[] = [];

  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void{

    this.cargarUsuariosSeleccionados();
    this.cargarUsuariosSeleccionables();
  }

  ordenarLista(lista: UserSelect[]) {
    return lista.sort( (a, b): number => {
              const nombrea = a.nombre.toLowerCase();
              const nombreb = b.nombre.toLowerCase();
              if (nombrea > nombreb) { return 1; }
              if (nombrea < nombreb) { return -1; }
              return 0;
            });
  }

  listaUID(listaU: UserSelect[]): string[] {
    let lista: string[] = [];
    for (let index = 0; index < listaU.length; index++) {
      lista[index] = listaU[index].uid;
    }
    return lista;
  }

  evento() {
    this.nuevaLista.emit(this.listaUID(this.listaSelected));  
  }

  agregarTodos() {
    while (this.listaUsers.length>0) {
      this.agregar(0, false);
    }
    this.listaUsers = this.ordenarLista(this.listaUsers);
    this.evento();
  }

  quitarTodos() {
    while (this.listaSelected.length>0) {
      this.quitar(0, false);
    }
    this.listaSelected = this.ordenarLista(this.listaSelected);
    this.evento();
  }

  agregar(pos: number, evento?: boolean): void {
    if (pos < 0 || pos > this.listaUsers.length) { return; }
    // Añadimos el elemento a seleccionado
    this.listaSelected.push(this.listaUsers[pos]);
    this.selected.push({_id:'', usuario:this.listaUsers[pos].uid});
    // Eliminamos el elemento de users
    this.listaUsers.splice(pos, 1);
    this.listaSelected = this.ordenarLista(this.listaSelected);
    if (evento) {
      this.evento();
    }
  }

  quitar(pos: number, evento?: boolean): void {
    if (pos < 0 || pos > this.listaSelected.length) { return; }
    // Añadimos el elemento a usuarios
    this.listaUsers.push(this.listaSelected[pos]);
        
    // Eliminamos el elemento de users
    this.listaSelected.splice(pos, 1);
    // La lista que queda la volcamos en selected
    let local: {_id: string, usuario: string}[] = [];
    this.listaSelected.forEach(user => {
      local.push({_id:'', usuario: user.uid});
    });
    this.selected = local;
    this.listaUsers = this.ordenarLista(this.listaUsers);
    if (evento) {
      this.evento();
    }
  }

  cargarUsuariosSeleccionados(): void {
    if (this.selected === undefined) { 
      this.listaSelected = [];
      return;
    }
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    this.selected.forEach(user => {
      selectedarray.push(user.usuario);
    });


    this.usuarioService.cargarListaUsuarios( selectedarray )
        .subscribe( res => {
          this.listaSelected=[];
          res['usuarios'].map( usuario => {
            this.listaSelected.push({nombre: `${usuario.apellidos}, ${usuario.nombre}` , uid: `${usuario.uid}`});  
          });
        }, (err) => {
        });
  }

  cargarUsuariosSeleccionables(): void {
    // Convertir el userSelected[] a string[]
    let selectedarray: string[] = [];
    if (this.selected !== undefined) {

      this.selected.forEach(user => {
        selectedarray.push(user.usuario);
      });
    }
    this.usuarioService.cargarUsuariosRol( this.rol, selectedarray )
      .subscribe( res => {
        this.listaUsers = [];
        res['usuarios'].map( usuario => {
          this.listaUsers.push({nombre: `${usuario.apellidos},${usuario.nombre}` , uid: `${usuario.uid}`});
        });
      }, (err) => {
      });
  }
}
