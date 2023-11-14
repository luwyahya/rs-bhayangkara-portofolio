import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerBedRoutingModule } from './viewerbed-routing.module';
 
import { ViewerBedComponent } from './viewerbed.component';
import { NgSelect2Module } from "ng-select2";
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    ViewerBedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ViewerBedRoutingModule,
    NgSelect2Module,
    DataTablesModule
  ]
})
export class PemanggilanApotiknModule { }
