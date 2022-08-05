
import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, CacheService, AlertService } from 'src/app/helper';
import * as moment from "moment";
import { SelectItem } from 'primeng/primeng';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-antrian-online',
  templateUrl: './antrian-online.component.html',
  styleUrls: ['./antrian-online.component.scss']
})
export class AntrianOnlineComponent implements OnInit {
  url: any
  jenisPasien: any
  isInfoPasien: boolean = false
  isInfoPoli: boolean = false
  isInfoDokter: boolean = false
  isInfoPasienSave: boolean = false
  isInfoPasienSaveJKN: boolean = false
  showTerbaru: boolean
  formGroupAntrol: FormGroup;
  buttonsPoli: SelectItem[]
  buttonsDokter: SelectItem[]
  CurrentPages: string;
  listRuangan: any[] = []
  listDokter: any[] = []
  item: any = {}
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private httpService: HttpClient,
    private http: Http,
    private fb: FormBuilder,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.formGroupAntrol = this.fb.group({
      'idRuangan': new FormControl(null),
      'idDokter': new FormControl(null),
      'noRujukan': new FormControl(''),
      'rumahSakit': new FormControl(null),
      'pCare': new FormControl(null),
      'pascaRanap': new FormControl(null),
    });
  }
  changePage(url) {

    this.router.navigate(['touchscreen/antrian/jenispasien'], { queryParams: { page: url } })
  }
  poli(namaPoli) {
    this.url = ' Pilih Poli Tujuan';
    this.jenisPasien = namaPoli;
    this.httpService.get('medifirst2000/reservasionline/get-list-data').subscribe(e => {
      this.buttonsPoli = [];
      e.ruanganrajalKiosk.forEach(response => {
        this.buttonsPoli.push({
          label: response.namaruangan, value: {
            'id': response.id,
            'namaruangan': response.namaruangan,
            'objectdepartemenfk': response.objectdepartemenfk,
            'kodebpjs': response.kdinternal
          }
        });
      });
    })
    this.isInfoPasien = true
    this.isInfoPoli = true
  }
  ChangeScreensButtonPoli(button: string) {
    this.CurrentPages = button;
    this.isInfoPoli = false
    this.httpService.get("medifirst2000/bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=" + this.CurrentPages['value'].kodebpjs
      + "&tanggal=" + moment(new Date()).format('YYYY-MM-DD')).subscribe(data => {
        if (data.metaData.code == 200) {
          this.buttonsDokter = [];
          data.response.forEach(response => {
            this.buttonsDokter.push({
              label: response.namadokter, value: {
                'kode': response.kodedokter,
                'nama': response.namadokter
              }
            });
          });

        } else {
          this.buttonsDokter = [];
        }

      });
    this.listRuangan.push({ label: this.CurrentPages['label'], value: this.CurrentPages['value'].id });
    this.formGroupAntrol.get('idRuangan').setValue(this.CurrentPages)
    this.isInfoDokter = true
    this.isInfoPoli = false
  }

  ChangeScreensButtonDokter(button: string) {
    this.isInfoDokter = false
    if (this.jenisPasien == 'A') {
      this.isInfoPasienSave = true
    } else if (this.jenisPasien == 'B') {
      this.isInfoPasienSaveJKN = true
    } else {
      this.print()
      return
    }
    this.CurrentPages = button;
    this.formGroupAntrol.get('idDokter').setValue(this.CurrentPages)
    this.listDokter.push({ label: this.CurrentPages['label'], value: this.CurrentPages['value'].kode });
  }
  print() {
    let antrian = {
      "jenis": this.jenisPasien,
      "poli": this.formGroupAntrol.get('idRuangan').value.namaruangan,
      "idRuanganTPP": 46,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
        // do something with response
      })

    }, error => {

    })
    this.isInfoPasien = false
    // window.history.back()
  }
  simpanAntrol() {
    let antrian = {
      "jenis": this.jenisPasien,
      "poli": this.formGroupAntrol.get('idRuangan').value.namaruangan,
      "idRuanganTPP": 46,
      "kodepoli": this.formGroupAntrol.get('idRuangan').value.value.kodebpjs,
      "namapoli": this.formGroupAntrol.get('idRuangan').value.value.namaruangan,
      "kodedokter": this.formGroupAntrol.get('idDokter').value.value.kode,
      "namadokter": this.formGroupAntrol.get('idDokter').value.value.nama,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian-online', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
        // do something with response
      })

    }, error => {

    })
    this.isInfoPasien = false
    this.isInfoDokter = false
    this.isInfoPoli = false
    this.isInfoPasienSave = false
  }
  simpanAntrolJKN() {
    debugger
    let antrian = {
      "jenis": this.jenisPasien,
      "poli": this.formGroupAntrol.get('idRuangan').value.namaruangan,
      "idRuanganTPP": 46,
      "kodepoli": this.formGroupAntrol.get('idRuangan').value.value.kodebpjs,
      "namapoli": this.formGroupAntrol.get('idRuangan').value.value.namaruangan,
      "kodedokter": this.formGroupAntrol.get('idDokter').value.value.kode,
      "namadokter": this.formGroupAntrol.get('idDokter').value.value.nama,
      "nomorkartu": this.item.peserta.noKartu,
      "nik": this.item.peserta.nik,
      "nohp": this.item.peserta.mr.noTelepon,
      "nomorreferensi": this.item.noKunjungan
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian-online-jkn', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
        // do something with response
      })

    }, error => {

    })
    this.isInfoPasien = false
    this.isInfoDokter = false
    this.isInfoPoli = false
    this.isInfoPasienSaveJKN = false
  }
  setradio(e: string): void {
    this.formGroupAntrol.get('rumahSakit').setValue('')
    this.formGroupAntrol.get('pascaRanap').setValue('')
  }
  setradio2(e: string): void {
    this.formGroupAntrol.get('pCare').setValue('')
    this.formGroupAntrol.get('pascaRanap').setValue('')
  }
  setradio3(e: string): void {
    this.formGroupAntrol.get('pCare').setValue('')
    this.formGroupAntrol.get('rumahSakit').setValue('')
  }
  getNoRujukan() {
    if (this.formGroupAntrol.get('noRujukan').value == '') return;
    if (this.formGroupAntrol.get('pCare').value == '' && this.formGroupAntrol.get('rumahSakit').value == '' && this.formGroupAntrol.get('pascaRanap').value == '') {
      // this.alertService.warn('Peringatan', 'Jenis Faskes Belum di pilih')
      var stt = ""
      if (confirm('Jenis Faskes Belum di pilih')) {
        // Save it!
        stt = 'true';
      } else {
        // Do nothing!
        stt = 'false'
        //return
      }
      return;
    }




    let nomor = this.formGroupAntrol.get('noRujukan').value
    this.cekPesertaByNoKartu(this.formGroupAntrol.get('noRujukan').value)

  }
  cekPesertaByNoKartu(noKa) {
    let jenis = "rs"
    if (this.formGroupAntrol.get('pCare').value != '') {
      jenis = 'pcare'
    }

    this.httpService.get("medifirst2000/bridging/bpjs2/get-rujukan-" + jenis + "-nokartu?nokartu=" + noKa).subscribe(e => {
      if (e.metaData.code === "200") {
        this.item = e.response.rujukan;
        this.formGroupAntrol.get('noRujukan').setValue(this.item.noKunjungan)
        this.alertService.info('OK', 'OK');
      } else {
        this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.metaData.message);
        var stt = ""
        if (confirm(e.metaData.message)) {
          // Save it!
          stt = 'true';
        } else {
          // Do nothing!
          stt = 'false'
          //return
        }
      }
    }, error => {
      this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', error);
      var stt = ""
      if (confirm(error)) {
        // Save it!
        stt = 'true';
      } else {
        // Do nothing!
        stt = 'false'
        //return
      }
    })

  }
}
