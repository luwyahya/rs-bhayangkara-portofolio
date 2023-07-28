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
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment'

@Component({
  selector: 'app-antrian',
  templateUrl: './antrian.component.html',
  styleUrls: ['./antrian.component.scss']
})
export class AntrianComponent implements OnInit {
  url: any
  jenisPasien: any
  isInfoPasien: boolean = false
  showTerbaru: boolean
  formGroupAntrol: FormGroup;
  buttons: SelectItem[]
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private httpService: HttpClient,
    private http: Http,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.formGroupAntrol = this.fb.group({
      'dokterDPJPMelayani': new FormControl(''),
    });
  }
  changePage(url) {

    this.router.navigate(['touchscreen/antrian/jenispasien'], { queryParams: { page: url } })
  }
  poli(namaPoli) {
    // this.url = ' Pilih Poli Tujuan';
    // this.jenisPasien = namaPoli;
    // this.isInfoPasien = true

    let antrian = {
      "jenis": namaPoli,
      "poli": '-',
      "idRuanganTPP": 46,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
        // do something with response
      });
      //  window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
      //         + response.noRec
      //         + '&kdprofile=1', '_blank');

    }, error => {

    })
    this.isInfoPasien = false
  }

  print(jenis) {
    let antrian = {
      "jenis": this.jenisPasien,
      "poli": jenis,
      "idRuanganTPP": 46,
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
  ShowPopUp(jenis) {
    this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
      + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=INT").subscribe(data => {
        if (data.metaData.code == 200) {
          this.buttons = [];
          data.response.list.forEach(response => {
            this.buttons.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
          });

        } else {
          this.buttons = [];
        }

      });
    this.showTerbaru = true
  }
}
