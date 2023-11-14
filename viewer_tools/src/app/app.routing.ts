import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AntrianApotikComponent } from './antrian-apotik/antrianapotik.component';
import { PemanggilanApotikComponent } from './pemanggilan-apotik/pemanggilanapotik.component';
 import { NgSelect2Module } from 'ng-select2';
import { FormsModule } from '@angular/forms';
import { ViewerBedComponent } from './viewerbed/viewerbed.component';

const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'user-profile',     component: ProfileComponent },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'antrianapotik',          component: AntrianApotikComponent },
    { path: 'pemanggilanapotik',          component: PemanggilanApotikComponent },
    { path: 'viewerbed',          component: ViewerBedComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NgSelect2Module,
    FormsModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  declarations: [
    AntrianApotikComponent // this component wants to have access to built-in directives
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
