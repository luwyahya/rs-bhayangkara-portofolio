import { Component, OnInit, Inject, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import { FormBuilder } from '@angular/forms';
import { CacheService, Configuration, HttpClient } from 'src/app/helper';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  URLSearchParams,
  Headers,
  Response,
  ResponseContentType
} from '@angular/http';

@Component({
  selector: 'app-touchscreen-v2',
  templateUrl: './touchscreen-v2.component.html',
  styleUrls: ['./touchscreen-v2.component.scss']
})
export class TouchscreenV2Component implements OnInit {
  images: any[]
  videoSource: any = 'assets/video/jasmed.mp4'
  focus: boolean = true;
  model: any
  @ViewChild("scanBarcode") nameBarcode: ElementRef;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private el: ElementRef,
    private fb: FormBuilder,
    private cache: CacheService,
    private httpService: HttpClient,
    private http: Http) {

  }
  ngOnInit() {
    this.nameBarcode.nativeElement.focus();
  }
  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }
  onChangeNoreservasi(value: string) {
    if (value.length > 6) {
      this.cache.set('cacheAutoNoReservasi', value)
      this.router.navigate(['touchscreen/checkin']);
    }
  }
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  print(jenis) {
    let antrian = {
      "jenis": jenis,
      "poli": "Kasir",
      "idRuanganTPP": 793,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      // this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
      //   // do something with response
      // })
         window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
              +  response.noRec
              + '&kdprofile=1', '_blank');

    }, error => {

    })
    // window.history.back()
  }
}

