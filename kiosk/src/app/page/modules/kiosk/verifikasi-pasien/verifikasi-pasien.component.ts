import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, CacheService, AlertService } from 'src/app/helper';
import * as moment from 'moment'
@Component({
  selector: 'app-verifikasi-pasien',
  templateUrl: './verifikasi-pasien.component.html',
  styleUrls: ['./verifikasi-pasien.component.scss']
})
export class VerifikasiPasienComponent implements OnInit {

  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false

  noCm: any;
  namaPasien: any;
  jenisKelamin: any;
  noIdentitas: any;
  tempatTglLahir: any;
  statusKawin: any
  alamat: any;
  noTelpon: any;
  idPasien: any;
  dataCache: any
  isInfoPasienBaru: boolean
  listDataAgama: any = []
  listDataPendidikan: any = []
  listDataPekerjaan: any = []
  listDataJenisKelamin: any = []
  listDataStatusPerkawinan: any = []
  item: any = {}
  loading: boolean
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpClient,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.httpservice.get("medifirst2000/registrasi/get-combo-registrasi").subscribe(se => {
      this.listDataJenisKelamin = se.jeniskelamin
      this.listDataPekerjaan = se.pekerjaan
      this.listDataAgama = se.agama
      this.listDataPendidikan = se.pendidikan
      this.listDataStatusPerkawinan = se.statusperkawinan

    })
    this.cacheHelper.set('cacheSelfRegis', undefined);
    this.formGroup = this.fb.group({
      'noCm': new FormControl(''),
      'baru': new FormControl(''),
      'lama': new FormControl(''),
      // 'jenisPasien': new FormControl(''),

    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  getPasienByNoCM() {
    // if (this.formGroup.get('jenisPasien').value == '') {
    //   this.alertService.warn('Peringatan', 'Jenis Pasien Belum di pilih')
    //   return;
    // }

    // if (this.formGroup.get('jenisPasien').value == 'lama') {
    if (this.formGroup.get('noCm').value != null) {
      if (this.formGroup.get('noCm').value.length == 1) {
        this.formGroup.get('noCm').setValue("000000" + this.formGroup.get('noCm').value)
      } else if (this.formGroup.get('noCm').value.length == 2) {
        this.formGroup.get('noCm').setValue("00000" + this.formGroup.get('noCm').value)
      } else if (this.formGroup.get('noCm').value.length == 3) {
        this.formGroup.get('noCm').setValue("0000" + this.formGroup.get('noCm').value)
      } else if (this.formGroup.get('noCm').value.length == 4) {
        this.formGroup.get('noCm').setValue("000" + this.formGroup.get('noCm').value)
      } else if (this.formGroup.get('noCm').value.length == 5) {
        this.formGroup.get('noCm').setValue("00" + this.formGroup.get('noCm').value)
      } else if (this.formGroup.get('noCm').value.length == 6) {
        this.formGroup.get('noCm').setValue("0" + this.formGroup.get('noCm').value)
      }
    }
    var re = /[a-zA-Z]/;
    if (re.test(this.formGroup.get('noCm').value)) {
      this.alertService.warn('Peringatan', 'Nomor RM harus 8 digit ANGKA')
      return
      //there are only alphanumeric characters
    }
    this.loading = true
    this.httpservice.get('medifirst2000/reservasionline/get-pasien/' + this.formGroup.get('noCm').value + '/null').subscribe(e => {
      if (e.data.length > 0) {
        if (e.data[0].nohp == null || e.data[0].nohp == "-") {
          this.alertService.error('Info', 'NoHP Pasein Tidak Lengkap,')
          // return;
        }
        if (e.data[0].alamatlengkap == null) {
          this.alertService.error('Info', 'Alamat Lengkap Pasien Tidak Lengkap,')
          // return;
        }
        if (e.data[0].objectdesakelurahanfk == null) {
          this.alertService.error('Info', 'Desa Kelurahan Pasien Tidak Lengkap,')
          // return;
        }
        if (e.data[0].noidentitas == null || e.data[0].noidentitas == "-") {
          this.alertService.error('Info', 'NoIdentitas Pasien Tidak Lengkap,')
          // return;
        }
        let result = e.data[0]
        if (result.tgllahir == null)
          result.tgllahir = '-'
        if (result.tempatlahir == null)
          result.tempatlahir = '-'
        if (result.alamatlengkap == null)
          result.alamatlengkap = '-'
        if (result.notelepon == null || result.notelepon == "")
          result.notelepon = '-'
        if (result.noidentitas == null || result.noidentitas == "")
          result.noidentitas = '-'
        this.isInfoPasien = true
        this.noCm = result.nocm
        this.namaPasien = result.namapasien
        this.jenisKelamin = result.jeniskelamin
        this.noIdentitas = result.noidentitas
        this.tempatTglLahir = result.tempatlahir + ', ' + result.tgllahir
        this.alamat = result.alamatlengkap
        this.noTelpon = result.notelepon
        this.idPasien = result.nocmfk
        this.dataCache = result
          if(this.noCm=='0'){
let dataSend = { 
                "idpasien": result.nocmfk
            } 
            this.httpservice.post("medifirst2000/registrasi/updatenocmlamakebaru", dataSend).subscribe(e => {   
              this.getPasienByNoCM();  
            }) 
          }
            
      } else {
        this.isInfoPasien = false
        this.dataCache = undefined
        this.alertService.error('Info', 'Data tidak ditemukan')
      }
      this.loading = false
    }, error => {
      this.isInfoPasien = false
      this.loading = false
      this.alertService.error('Info', 'Data tidak ditemukan')
    })
    // } else {
    //   let nik = this.formGroup.get('noCm').value
    //   if (nik != null && nik.length > 10) {
    //     this.loading = true
    //     this.httpservice.get('medifirst2000/bridging/dukcapil/get-nik/' + nik).subscribe(e => {
    //       if (e.content == undefined) {
    //         return
    //       }
    //       if (e.messages) {
    //         this.alertService.error('Error', e.messages)
    //         return
    //       }
    //       if (e.content[0] != "") {
    //         let result = e.content[0]
    //         this.alertService.success('Sukses', 'Nama Lengkap : ' + result.NAMA_LGKP)
    //         // this.formGroup.get('namaPasien').setValue(result.NAMA_LGKP)
    //         this.isInfoPasienBaru = true
    //         // this.noCm =

    //         this.namaPasien = result.NAMA_LGKP
    //         this.jenisKelamin = result.JENIS_KLMIN
    //         this.noIdentitas = result.NIK
    //         this.tempatTglLahir = result.TMPT_LHR + ', ' + result.TGL_LHR
    //         this.alamat = result.ALAMAT + ' KEL. ' + result.NAMA_KEL
    //           + ' RT' + result.NO_RT + '/RW' + result.NO_RW + ' KEC. ' + result.NAMA_KEC
    //         this.noTelpon = '-'
    //         this.idPasien = '-'
    //         this.statusKawin = result.STAT_KWN

    //         for (let i = 0; i < this.listDataAgama.length; i++) {
    //           const element = this.listDataAgama[i];
    //           if (element.agama.toLowerCase().indexOf(result.AGAMA.toLowerCase()) > -1) {
    //             this.item.idAgama = element.id
    //             break
    //           }
    //         }

    //         for (let i = 0; i < this.listDataJenisKelamin.length; i++) {
    //           const element = this.listDataJenisKelamin[i];
    //           if (element.jeniskelamin.toLowerCase().indexOf(result.JENIS_KLMIN.toLowerCase()) > -1) {
    //             this.item.jenisKelaminId = element.id
    //             break
    //           }
    //         }

    //         for (let i = 0; i < this.listDataPekerjaan.length; i++) {
    //           const element = this.listDataPekerjaan[i];
    //           if (element.pekerjaan.toLowerCase().indexOf(result.JENIS_PKRJN.toLowerCase()) > -1) {
    //             this.item.pekerjaanId = element.id
    //             break
    //           }
    //         }
    //         for (let i = 0; i < this.listDataStatusPerkawinan.length; i++) {
    //           const element = this.listDataStatusPerkawinan[i];
    //           if (element.statusperkawinan == result.STATUS_KAWIN) {
    //             this.item.statusPerkawinanId = element.id
    //             break
    //           }
    //         }
    //         for (let i = 0; i < this.listDataPendidikan.length; i++) {
    //           const element = this.listDataPendidikan[i];
    //           if (element.pendidikan.toLowerCase().indexOf(result.PDDK_AKH.toLowerCase()) > -1) {
    //             this.item.pendidikanId = element.id
    //             break
    //           }
    //         }
    //         if (result.NAMA_KEL) {
    //           this.httpservice.get("medifirst2000/registrasi/get-desa-kelurahan-paging?namadesakelurahan=" + result.NAMA_KEL).subscribe(res => {
    //             if (res[0] != undefined) {
    //               var resss = res[0]
    //               var data = {
    //                 id: resss.id,
    //                 namadesakelurahan: resss.namadesakelurahan,
    //                 kodepos: resss.kodepos,
    //                 namakecamatan: resss.namakecamatan,
    //                 namakotakabupaten: resss.namakotakabupaten,
    //                 namapropinsi: resss.namapropinsi,
    //                 objectkecamatanfk: resss.objectkecamatanfk,
    //                 objectkotakabupatenfk: resss.objectkotakabupatenfk,
    //                 objectpropinsifk: resss.objectpropinsifk,
    //                 desa: resss.namadesakelurahan,
    //               }

    //               this.item.desaKelurahan = data
    //             }
    //           });
    //         }

    //         var postJson = {
    //           'isbayi': false,
    //           'istriageigd': false,
    //           'isPenunjang': false,
    //           'idpasien': '',
    //           'pasien': {
    //             'namaPasien': this.namaPasien,
    //             'noIdentitas': this.noIdentitas != undefined ? this.noIdentitas : null,
    //             'namaSuamiIstri': null,
    //             'noAsuransiLain': null,
    //             'noBpjs': null,
    //             'noHp': null,
    //             'tempatLahir': result.TMPT_LHR,
    //             'namaKeluarga': null,
    //             'tglLahir': moment(result.TGL_LHR).format('YYYY-MM-DD HH:mm'),
    //             'image': null
    //           },
    //           'agama': {
    //             'id': this.item.idAgama != undefined ? this.item.idAgama : null,
    //           },
    //           'jenisKelamin': {
    //             'id': this.item.jenisKelaminId != undefined ? this.item.jenisKelaminId : null,
    //           },
    //           'pekerjaan': {
    //             'id': this.item.pekerjaanId != undefined ? this.item.pekerjaanId : null,
    //           },
    //           'pendidikan': {
    //             'id': this.item.pendidikanId != undefined ? this.item.pendidikanId : null,
    //           },
    //           'statusPerkawinan': {
    //             'id': this.item.statusPerkawinanId != undefined ? this.item.statusPerkawinanId : 0,
    //           },
    //           'golonganDarah': {
    //             'id': null,
    //           },
    //           'suku': {
    //             'id': null,
    //           },

    //           'namaIbu': result.NAMA_LGKP_IBU,
    //           'noTelepon': null,
    //           'noAditional': null,
    //           'kebangsaan': {
    //             'id': 1,
    //           },
    //           'negara': {
    //             'id': 0,
    //           },
    //           'namaAyah': result.NAMA_LGKP_AYAH,
    //           'alamatLengkap': this.alamat,
    //           'desaKelurahan': {
    //             'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.id : null,
    //             'namaDesaKelurahan': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namadesakelurahan : null,
    //           },
    //           'kecamatan': {
    //             'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectkecamatanfk : null,
    //             'namaKecamatan': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namakecamatan : null,
    //           },

    //           'kotaKabupaten': {
    //             'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectkotakabupatenfk : null,
    //             'namaKotaKabupaten': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namakotakabupaten : null,
    //           },
    //           'propinsi': {
    //             'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectpropinsifk : null,
    //           },
    //           'kodePos': null,
    //           'penanggungjawab': null,
    //           'hubungankeluargapj': null,
    //           'pekerjaanpenangggungjawab': null,
    //           'ktppenanggungjawab': null,
    //           'alamatrmh': null,
    //           'alamatktr': null,
    //           'teleponpenanggungjawab': null,
    //           'bahasa': null,
    //           'jeniskelaminpenanggungjawab': null,
    //           'umurpenanggungjawab': null,
    //           'dokterpengirim': null,
    //           'alamatdokter': null
    //         }
    //         this.dataCache = postJson
    //         // for (let i = 0; i < this.listJK.length; i++) {
    //         //   const element = this.listJK[i];
    //         //   if (element.jeniskelamin.toLowerCase().indexOf(result.JENIS_KLMIN.toLowerCase()) > -1) {
    //         //     this.formGroup.get('jenisKelamin').setValue(element)
    //         //     break
    //         //   }
    //         // }
    //         // this.formGroup.get('tglLahir').setValue(new Date(result.TGL_LHR))
    //         // this.formGroup.get('namaPasien').setValue(result.NAMA_LGKP)
    //       } else {
    //         this.alertService.error('Info', e.content.RESPON)
    //       }
    //       this.loading = false
    //     }, error => {
    //       this.isInfoPasien = false
    //       this.loading = false
    //       this.alertService.error('Info', 'Data tidak ditemukan')
    //     })

    //   }
    // }

  }
  pilihPoli() {
    var cache = {
      0: this.dataCache,
      1: 'Umum',
    }

    this.cacheHelper.set('cacheSelfRegis', cache);
    this.router.navigate(['touchscreen/self-regis/verif-pasien/poli'], { queryParams: { nocmfk: this.idPasien, tipepasien: this.url } })
  }
}