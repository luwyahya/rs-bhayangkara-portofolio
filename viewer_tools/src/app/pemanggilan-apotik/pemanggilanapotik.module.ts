import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PemanggilanApotikRoutingModule } from './pemanggilanapotik-routing.module';
 
import { PemanggilanApotikComponent } from './pemanggilanapotik.component';
import { NgSelect2Module } from "ng-select2";
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    PemanggilanApotikComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PemanggilanApotikRoutingModule,
    NgSelect2Module,
    DataTablesModule
  ]
})
export class PemanggilanApotiknModule { }
