import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import { HttpClient, AlertService, Configuration } from 'src/app/helper';
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
  selector: 'app-self-regis',
  templateUrl: './self-regis.component.html',
  styleUrls: ['./self-regis.component.scss']
})
export class SelfRegisComponent implements OnInit {

  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private httpService: HttpClient,
    private http: Http,
    private alertService:AlertService) { }

  ngOnInit() {
  }
  changePage(url) {
    if (url == 'false') {
      this.alertService.info('Informasi','Mohon Lakukan Registrasi melalui Loket Pendaftaran !')
      return
    }
    if (url == 'BPJS'){
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: url } })
    }else if (url == 'BPJS-pol'){
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs-nonpol'], { queryParams: { page: url } })
    }else{
      this.router.navigate(['touchscreen/self-regis/verif-pasien'], { queryParams: { page: url } })
    }
  }

  print(jenis) {
    let antrian = {
      "jenis": jenis
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
    window.history.back()
  }
}
