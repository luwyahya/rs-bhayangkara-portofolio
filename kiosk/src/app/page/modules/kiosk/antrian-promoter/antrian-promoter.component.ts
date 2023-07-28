import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import { Configuration, HttpClient } from 'src/app/helper';
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
  selector: 'app-antrian-promoter',
  templateUrl: './antrian-promoter.component.html',
  styleUrls: ['./antrian-promoter.component.scss']
})
export class AntrianPromoterComponent implements OnInit {
  url: any
  jenisPasien: any
  isInfoPasien: boolean = false
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private httpService: HttpClient,
    private http: Http) { }

  ngOnInit() {
  }
  changePage(url) {

    this.router.navigate(['touchscreen/antrian-promoter/jenispasien'], { queryParams: { page: url } })
  }
  poli(namaPoli){
    this.url = ' Pilih Poli Tujuan';
    this.jenisPasien = namaPoli;
    this.isInfoPasien = true
  }

  print(jenis) {
    let antrian = {
      "jenis": this.jenisPasien,
      "poli": jenis,
      "idRuanganTPP": 785,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      // this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
      //   // do something with response
      // })
       window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
              + response.noRec
              + '&kdprofile=1', '_blank');

    }, error => {

    })
    this.isInfoPasien = false
    // window.history.back()
  }
}
