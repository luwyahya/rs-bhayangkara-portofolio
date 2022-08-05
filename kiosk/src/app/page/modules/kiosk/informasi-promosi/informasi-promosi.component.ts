import { Component, OnInit, Inject, forwardRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";
@Component({
  selector: 'app-informasi-promosi',
  templateUrl: './informasi-promosi.component.html',
  styleUrls: ['./informasi-promosi.component.scss']
})
export class InformasiPromosiComponent implements OnInit {

  showTerbaru:boolean
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute) {

  } 
  ngOnInit() {
  }

}
