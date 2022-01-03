import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmint = false;
  public waiting = false;

  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [ false || localStorage.getItem('email') ]
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router,
               private zone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton()
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }

  startApp() {
    gapi.load('auth2', ()=>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '826053114073-g8rqruj8i8bl3gubhrlfa3juc27ffkrn.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        var id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token)
          .subscribe( res => {
            switch (this.usuarioService.rol) {
              case 'ROL_ADMIN':
                this.zone.run(() => {
                  this.router.navigateByUrl('/admin/dashboard');
                });
                break;
              case 'ROL_ALUMNO':
                this.zone.run(() => {
                  this.router.navigateByUrl('/alu/dashboard');
                });
                break;
              case 'ROL_PROFESOR':
                this.zone.run(() => {
                  this.router.navigateByUrl('/prof/dashboard');
                });
                break;
            }
          }, (err) => {
            console.warn('Error respueta api:',err);
            Swal.fire({
              title: 'Error!',
              text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
          }
          );
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  login() {
    this.formSubmint = true;
    if (!this.loginForm.valid) {
      console.warn('Errores en le formulario');
      return;
    }
    this.waiting = true;
    this.usuarioService.login( this.loginForm.value)
      .subscribe( res => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        this.waiting = false;
        switch (this.usuarioService.rol) {
          case 'ROL_ADMIN':
            this.router.navigateByUrl('/admin/dashboard');
            break;
          case 'ROL_ALUMNO':
            this.router.navigateByUrl('/alu/dashboard');
            break;
          case 'ROL_PROFESOR':
            this.router.navigateByUrl('/prof/dashboard');
            break;
        }

      }, (err) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;

      });

  }

  campoValido( campo: string) {
    return this.loginForm.get(campo).valid || !this.formSubmint;
  }

}
