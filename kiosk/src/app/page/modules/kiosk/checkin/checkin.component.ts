import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, CacheService, AlertService } from 'src/app/helper';
import { Http } from '@angular/http';
import * as moment from 'moment';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  item: any = {}
  dataCache: any

  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpClient,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService,
    private service: Http,
  ) {

  }

  ngOnInit() {

    this.formGroup = this.fb.group({
      'noReservasi': new FormControl(''),

    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });
    let noreservasi = this.cacheHelper.get('cacheAutoNoReservasi')
    if (noreservasi != undefined) {
      this.formGroup.get('noReservasi').setValue(noreservasi)
      this.getInfoByNoReservasi()
      this.cacheHelper.set('cacheAutoNoReservasi', undefined)
    }

  }
  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return  Math.abs(diff);//Math.abs(Math.round(diff));    
  }
  getInfoByNoReservasi() {
    this.httpservice.get('medifirst2000/reservasionline/get-history?noReservasi=' + this.formGroup.get('noReservasi').value).subscribe(e => {
      if (e.data.length > 0) {

        let result = e.data[0]
        let now =new Date();// new Date(new Date(tglRes).setHours(new Date(tglRes).getHours() - 1))
        let tglResDate = new Date(result.tanggalreservasi)
        var hours = this.diff_hours(tglResDate, now)
        if (hours > 1 ) {
          this.alertService.error('Info', 'Check-In hanya bisa dilakukan SATU Jam sebelum jam reservasi')
          return
        }
        if (new Date() > new Date(result.tanggalreservasi)) {
          this.alertService.error('Info', 'Batas Waktu Check-In anda melebihi batas yang ditentukan')
          return
        }

        if (result.tgllahir == null)
          result.tgllahir = '-'
        else
          result.tgllahir = moment(new Date(result.tgllahir)).format('YYYY-MM-DD')
        if (result.tempatlahir == null)
          result.tempatlahir = '-'
        if (result.alamatlengkap == null)
          result.alamatlengkap = '-'
        if (result.notelepon == null || result.notelepon == "")
          result.notelepon = '-'
        result.tanggalreservasi = moment(new Date(result.tanggalreservasi)).format('YYYY-MM-DD HH:mm')
        this.isInfoPasien = true
        this.item = result
        // this.namaPasien = result.namapasien
        // this.jenisKelamin = result.jeniskelamin
        // this.noIdentitas = result.noidentitas
        // this.tempatTglLahir = result.tempatlahir + ', ' + result.tgllahir
        // this.alamat = result.alamatlengkap
        // this.noTelpon = result.notelepon
        // this.idPasien = result.nocmfk

      } else {
        this.isInfoPasien = false
        this.alertService.error('Info', 'Data tidak ditemukan')
      }
    }, error => {
      this.isInfoPasien = false
      this.alertService.error('Info', 'Data tidak ditemukan')
    })
  }
  cetakBukti() {

    this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran-online=1&norec='
      + this.item.noregistrasi + '&view=false'
      + '&noReservasi=' + this.item.noreservasi).subscribe(response => {
        // do something with response
      });
  }
  checkIn() {
    if (this.item.type == "BARU") {
      this.savePasienPerjanjian()
    }
    if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
      this.cacheHelper.set('cacheOnlineBPJS', this.item)
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: 'BPJS' } })
    }
    else {
      this.savePasienDaftar()
    }
  }
  savePasienPerjanjian() {

    let antrian = {
      "jenis": this.item.prefixnoantrian//"D"
    }
    this.httpservice.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      this.service.get('http://127.0.0.1:1237/printvb/cetak-antrian-online?cetak=1&norec=' + response.noRec
        + '&noReservasi=' + this.item.noreservasi).subscribe(result => {
          // do something with response

        })
      window.history.back()
    }, error => {

    })
  }
  savePasienDaftar() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.item.nocmfk,
      'objectruanganfk': this.item.objectruanganfk,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': this.item.objectkelompokpasienfk != null ? this.item.objectkelompokpasienfk : 1,//umum
      'objectrekananfk': null,
      'tipelayanan': 1,//reguler
      'objectpegawaifk': this.item.objectpegawaifk,
      'noregistrasi': '',
      'norec_pd': '',
      'israwatinap': 'false',
      'statusschedule': this.item.noreservasi,// this.formGroup.get('noReservasi').value != '' ? this.formGroup.get('noReservasi').value : '',
      'jaminankhusus':''
    }
    var antrianpasiendiperiksa = {
      'norec_apd': '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.item.objectruanganfk,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.item.objectpegawaifk,
      'objectkamarfk': null,
      'nobed': null,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectasalrujukanfk': 5,//Datang Sendiri
      'israwatgabung': 0,
    }
    var objSave = {
      'pasiendaftar': pasiendaftar,
      'antrianpasiendiperiksa': antrianpasiendiperiksa
    }

    this.httpservice.post('medifirst2000/registrasi/save-registrasipasien', objSave).subscribe(response => {

      this.item.noregistrasi = response.dataPD.noregistrasi
      this.cetakBukti()
      // if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
      //   this.alertService.info('Peringatan','Pastikan SEP Di Cetak di Loket Pendaftaran !!')
      // }
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Check-In No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.updateStatusConfirm()
      window.history.back()
    }, error => {

    })
  }
  updateStatusConfirm() {
    let data = {
      "noreservasi": this.item.noreservasi,
    }
    this.httpservice.post('medifirst2000/reservasionline/update-data-status-reservasi', data).subscribe(e => {

    })
  }
  saveLogging(jenis, referensi, noreff, ket) {
    this.httpservice.get("medifirst2000/sysadmin/logging/save-log-all?jenislog=" + jenis
      + "&referensi=" + referensi
      + "&noreff=" + noreff
      + "&keterangan=" + ket
    ).subscribe(e => {

    })
  }
}