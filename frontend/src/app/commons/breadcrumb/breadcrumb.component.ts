import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public breadcrums: any[];
  private subs$: Subscription;

  constructor( private router: Router) { 
    this.subs$ = this.cargarDatos()
                      .subscribe( data => {
                        this.titulo = data.titulo;
                        this.breadcrums = data.breadcrums;
                      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  cargarDatos() {
    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
        map( (event: ActivationEnd) => event.snapshot.data)
      );
  }

}
