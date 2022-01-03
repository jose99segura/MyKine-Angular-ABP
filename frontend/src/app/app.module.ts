import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragulaModule} from 'ng2-dragula';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CommonsModule } from './commons/commons.module';
import { InicioLayoutComponent } from './layouts/inicio-layout/inicio-layout.component';
import { OlMapsModule } from './ol-maps/ol-maps.module';


@NgModule({
  declarations: [
    AppComponent,
    InicioLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    CommonsModule,
    OlMapsModule,
    DragulaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
