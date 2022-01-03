import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  recover() {
    Swal.fire( {
      title:'Recuperar desactivado', 
      text: 'Para recuperar tu contraseña ponte en contacto con jvberna@ua.es', 
      icon: 'warning', 
      allowOutsideClick: false});
  }

}
