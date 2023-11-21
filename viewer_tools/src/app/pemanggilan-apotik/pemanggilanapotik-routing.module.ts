import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PemanggilanApotikComponent } from './pemanggilanapotik.component';
import { NgSelect2Module } from 'ng-select2';
const routes: Routes = [
  { path: '', component: PemanggilanApotikComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),NgSelect2Module],
  exports: [RouterModule]
})
export class PemanggilanApotikRoutingModule { }

