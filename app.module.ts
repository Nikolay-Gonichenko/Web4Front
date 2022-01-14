import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Routes, RouterModule} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { CommonModule } from "@angular/common";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ShootComponent } from './shoot/shoot.component';
import {AuthInterceptor} from "./interceptor/auth-interceptor";
import {AuthGuard} from "./guards/auth-guard";


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shoot', component: ShootComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShootComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  },
    AuthGuard,
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
