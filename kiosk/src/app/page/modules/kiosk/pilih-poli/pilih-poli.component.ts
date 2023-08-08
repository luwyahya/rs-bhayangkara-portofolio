import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, CacheService, AlertService, Configuration } from 'src/app/helper';
;
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as  moment from 'moment';
import { Http } from '@angular/http';
@Component({
  selector: 'app-pilih-poli',
  templateUrl: './pilih-poli.component.html',
  styleUrls: ['./pilih-poli.component.scss']
})
export class PilihPoliComponent implements OnInit {

  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  listIMG: any[] = ["../../../../../assets/humastemplate/images/icon-poli-anak.png",
    "../../../../../assets/humastemplate/images/icon-poli-gigi.png",
    "../../../../../assets/humastemplate/images/icon-poli-penyakit-dalam.png",
    "../../../../../assets/humastemplate/images/icon-poli-kandungan.png",
    "../../../../../assets/humastemplate/images/icon-poli-mata.png",
    "../../../../../assets/humastemplate/images/icon-poli-umum.png",
    "../../../../../assets/humastemplate/images/icon-poli-paru-paru.png",
    "../../../../../assets/humastemplate/images/icon-poli-rawat.png",
    "../../../../../assets/humastemplate/images/icon-poli-check-up.png",
    "../../../../../assets/humastemplate/images/icon-poli-bedah.png",
    "../../../../../assets/humastemplate/images/icon-poli-laboratorium.png",
    "../../../../../assets/humastemplate/images/icon-poli-neurologi.png",
    "../../../../../assets/humastemplate/images/icon-poli-radiologi.png",
    "../../../../../assets/humastemplate/images/icon-poli-tht.png",
    "../../../../../assets/humastemplate/images/icon-poli-thyroid.png",]
  listRuangan: any[] = []
  listDokter: any[] = []
  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  now: any = new Date()
  dataCache: any;
  item: any = {}
  showNoAntrian: boolean = false
  isPasienBaru: boolean = false
  loading: boolean
  isDaftarKedua: boolean = false
  isPoliSama: boolean = false
  catatan: any;
  catatanRekanan: any;
  jeniskunjungan: any;
  showNotip: boolean
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService,
    private service: Http) {

  }
  ngOnInit() {
    let cache = this.cacheHelper.get('cacheSelfRegis')
    if (cache != undefined) {
      if (cache[0].idpasien != undefined) {
        this.isPasienBaru = true
      } else {
        if (cache[0].noidentitas == null || cache[0].noidentitas == "")
          cache[0].noidentitas = '-'
        if (cache[0].notelepon == null || cache[0].notelepon == "")
          cache[0].notelepon = '-'
        cache[0].tempatTglLahir = cache[0].tempatlahir + ', ' + cache[0].tgllahir
      }

      // this.item = cache[0]
      this.dataCache = cache
      // this.cacheHelper.set('cacheSelfRegis', undefined);
    }
    this.formGroup = this.fb.group({
      'idRuangan': new FormControl(null),
      'idDokter': new FormControl(null),
      'tglRegis': new FormControl(new Date())
    });
    this.httpService.get('medifirst2000/reservasionline/get-list-data').subscribe(e => {
      this.listRuangan = [];
      this.listRuangan.push({ label: '--Pilih Poli --', value: null });
      e.ruanganrajalKiosk.forEach(response => {
        this.listRuangan.push({
          label: response.namaruangan, value: {
            'id': response.id,
            'namaruangan': response.namaruangan,
            'objectdepartemenfk': response.objectdepartemenfk,
            'kodebpjs': response.kdinternal
          }
        });
      });

      this.listDokter = [];
      //tambahan hafiz
      this.listDokter.push({ label: '--Pilih Dokter --', value: null });
      e.dokter.forEach(response => {
        this.listDokter.push({
          label: response.namalengkap, value: {
            'id': response.id,
            'dokter': response.namalengkap,
            'namahafis': response.namahafis

          }
        });
      });
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

    })
  }
  changeRuangan(event) {
    let ruangan = this.listRuangan.find(data => data.value == event.value)
    console.log(ruangan)
    // this.item.noKunjungan = noKunjungan.label
    // this.item.diagnosa.kode = noKunjungan.value
      this.httpService.get('medifirst2000/reservasionline/get-slotting-by-ruangan-newpoli/' + ruangan.value.id + '/'+moment(new Date()).format('YYYY-MM-DD')).subscribe(e => {
        if(e.slot == null){
          this.alertService.warn(
            "Peringatan",
            "Sloting Penuh"
          );
          //  this.formGroup.set("idRuangan").value.namaruangan;
            this.formGroup.get("idRuangan").setValue("");
          this.formGroup.value.idRuangan = '';
          return;
        }
      })
    this.cekJadwal(ruangan.value)
  }
  cekJadwal(x) {
    this.httpService.get('medifirst2000/reservasionline/get-jadwal-dokterall?idRuangan=' + x.id).subscribe(e => {
      let listDokterTemp = [];

      e.forEach(response => {
        listDokterTemp.push({
          label: response.namalengkap, value: {
            'id': response.id,
            'dokter': response.namalengkap,
            'namahafis': response.namahafis,
            'idhafis' : response.idhafis
          }
        });
      });

      this.httpService.get("medifirst2000/bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=" + x.kodebpjs
        + "&tanggal=" + moment(new Date()).format('YYYY-MM-DD')).subscribe(data => {
          if (data.metaData.code == 200) {
            this.listDokter = [];
            this.listDokter.push({ label: '--Pilih Dokter --', value: null });
            for (let i = 0; i < data.response.length; i++) {
              for (let x = 0; x < listDokterTemp.length; x++) {
                if(data.response[i].kodedokter==listDokterTemp[x].value.idhafis){
                  this.listDokter.push({
                    label: data.response[i].namadokter, value: {
                      'id': listDokterTemp[x].value.id,
                      'namalengkap': data.response[i].namadokter,
                      'idhafis': data.response[i].kodedokter,
                      'namahafis': listDokterTemp[x].value.namahafis,
                      'jadwal': data.response[i].jadwal,
                      'kodesubspesialis':data.response[i].kodesubspesialis,
                    }
                  });
                }
              }
            }
          

          } else {
            this.httpService.get('medifirst2000/reservasionline/get-jadwal-dokter?idRuangan=' + x.id).subscribe(e => {
              this.listDokter = [];
              this.listDokter.push({ label: '--Pilih Dokter --', value: null });
              e.forEach(response => {
                this.listDokter.push({
                  label: response.namalengkap, value: {
                    'id': response.id,
                    'dokter': response.namalengkap,
                    'namahafis': response.namahafis
                  }
                });
              });
              this.filteredOptions = this.myControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => this._filter(value))
                );

            })
          }

        });

      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

    })



  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listRuangan.filter(option => option.namaruangan.toLowerCase().includes(filterValue));
  }
  viewResume() {
    if (this.formGroup.get('idRuangan').value == null || this.formGroup.get('idDokter').value == null) {
      this.alertService.warn('Peringatan', 'Ruangan dan Dokter Belum di pilih')
      return;
    }
    this.isInfoPasien = true
    if (this.isPasienBaru == true) {
      this.dataCache[0].nocm = '-'
      this.dataCache[0].namapasien = this.dataCache[0].pasien.namaPasien
      this.dataCache[0].noidentitas = this.dataCache[0].pasien.noIdentitas
      this.dataCache[0].tempatTglLahir = this.dataCache[0].pasien.tempatLahir + ', ' + this.dataCache[0].pasien.tglLahir
      this.dataCache[0].noidentitas = this.dataCache[0].pasien.noIdentitas
      this.dataCache[0].alamatlengkap = this.dataCache[0].alamatLengkap
      this.dataCache[0].notelepon = '-'
      this.dataCache[0].namaruangan = this.formGroup.get('idRuangan').value.namaruangan
      this.dataCache[0].idruangan = this.formGroup.get('idRuangan').value.id
      this.dataCache[0].objectdepartemenfk = this.formGroup.get('idRuangan').value.objectdepartemenfk
      this.dataCache[0].tglregistrasi = moment(new Date()).format('DD-MM-YYYY HH:mm')
      this.item = this.dataCache[0]
    } else {
      this.dataCache[0].tglregistrasi = moment(new Date()).format('DD-MM-YYYY HH:mm')
      this.dataCache[0].namaruangan = this.formGroup.get('idRuangan').value.namaruangan
      this.dataCache[0].idruangan = this.formGroup.get('idRuangan').value.id
      this.dataCache[0].dokter = this.formGroup.get('idDokter').value.namalengkap
      this.dataCache[0].iddokter = this.formGroup.get('idDokter').value.id
      this.dataCache[0].namahafis = this.formGroup.get('idDokter').value.namahafis
      this.dataCache[0].objectdepartemenfk = this.formGroup.get('idRuangan').value.objectdepartemenfk
      this.dataCache[0].kodepoli = this.formGroup.get('idRuangan').value.kodebpjs
      this.dataCache[0].kodedokter = this.formGroup.get('idDokter').value.idhafis
      this.dataCache[0].namadokter = this.formGroup.get('idDokter').value.namalengkap
      this.dataCache[0].jadwal = this.formGroup.get('idDokter').value.jadwal
      this.dataCache[0].kodepoli = this.formGroup.get('idRuangan').value.kodebpjs
      this.dataCache[0].kodepoli = this.formGroup.get('idRuangan').value.kodebpjs
      this.dataCache[0].kodepoli = this.formGroup.get('idRuangan').value.kodebpjs
      this.dataCache[0].kodepoli = this.formGroup.get('idRuangan').value.kodebpjs
      
      this.item = this.dataCache[0]
    }


  }
  lanjutkan() {
    debugger
    if (this.isPasienBaru == true) {
      this.httpService.post('medifirst2000/registrasi/save-pasien-fix', this.item).subscribe(e => {
        this.item.nocmfk = e.data.kodeexternal
        this.savePsienDaftar()
      })
    } else {
      this.savePsienDaftar()
    }
  }
  save() {
    this.httpService.get('medifirst2000/registrasi/cek-pasien-daftar-duakali?nocm=' + this.item.nocm + '&tglregistrasi='
      + moment(new Date()).format('YYYY-MM-DD')).subscribe(y => {
        debugger
        this.catatan = '';
        this.catatanRekanan = ';'
        if (y.data.length != 0) {
          y.data.forEach(response => {
            if (this.item.idruangan == response.objectruanganlastfk) {
              this.isPoliSama = true;
            }
            this.catatan = this.catatan + ',' + response.namaruangan
            this.catatanRekanan = response.namarekanan
          });
          if (this.isPoliSama == true) {
            this.alertService.warn('Peringatan', 'Pasien tidak bisa daftar di Poli yang sama')
            return;
          }
          this.isDaftarKedua = true;
          this.showNotip = true;
          return;
          // var stt = ""
          // if (confirm('Pasien Telah Terdaptar di '+this.catatanRekanan+' Klik OK untuk Simpan')) {
          //   // Save it!
          //   stt = 'true';
          // } else {
          //   // Do nothing!
          //   stt = 'false'
          //   return
          // }
        }
        if (this.isPasienBaru == true) {
          this.httpService.post('medifirst2000/registrasi/save-pasien-fix', this.item).subscribe(e => {
            this.item.nocmfk = e.data.kodeexternal
            this.savePsienDaftar()
          })
        } else {
          this.savePsienDaftar()
        }
      })
  }
  savePsienDaftar() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.item.nocmfk,
      'objectruanganfk': this.item.idruangan,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': 1,//umum
      'objectrekananfk': 0,
      'tipelayanan': 1,//reguler
      'objectpegawaifk': this.item.iddokter,
      'nmhafis': this.item.namahafis,
      'jeniskunjungan': 3,
      'noregistrasi': '',
      'norec_pd': '',
      'israwatinap': 'false',
      'statusschedule': 'Kios-K',
      'istelemedicine': 'false',
      'jaminankhusus': '',
      'catatan': this.catatan,
      'objectruanganasalfk': this.item.idruangan,
      'statuspasien': 'LAMA',
      'objectkasuspenyakitlastfk': '1',
      'sensus': null,
      'nomorkartu': '',
      'nik': this.item.noidentitas,
      'nohp': this.item.nohp,
      'kodepoli': this.item.kodepoli,
      'namapoli': this.item.namaruangan,
      'kodedokter': this.item.kodedokter,
      'namadokter': this.item.namadokter,
      'nomorreferensi': '',
      'isjenispasienantrol': 'NON JKN',
      'normantrol': this.item.nocm,
      'noantrianLoket': 0,
      'jadwal': this.item.jadwal,
      'kodesubspesialisHafis': this.item.kodepoli,
      'jeniskunjungan': 3,
    }
    var antrianpasiendiperiksa = {
      'norec_apd': '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.item.idruangan,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.item.iddokter,
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
    this.loading = true
    this.httpService.post('medifirst2000/registrasi/save-registrasipasien', objSave).subscribe(response => {
      this.showNoAntrian = true
      this.item.noregistrasi = response.dataPD.noregistrasi
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Self Registration No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.saveBiayaKarcis(response.dataPD.noregistrasi, response.dataAPD.norec)
      this.cacheHelper.set('cacheSelfRegis', undefined)
      this.loading = false
    }, error => {
      this.loading = false
      this.showNoAntrian = false
    })
  }
  saveBiayaKarcis(noregistrasi, norec_apd) {
    var json = {
      'noregistrasi': noregistrasi,
      'jenispasien': '1',
      'idruangan': this.item.idruangan,
      'norec_apd': norec_apd,
      'idpegawai': this.item.iddokter,
      'isDaftarKeDua': this.isDaftarKedua,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'statuspasien':'LAMA',
      'jenisPel': 1
    }
    this.httpService.post('medifirst2000/registrasi/save-biaya-karcis', json).subscribe(e => {
    })
  }
  saveLogging(jenis, referensi, noreff, ket) {
    this.httpService.get("medifirst2000/sysadmin/logging/save-log-all?jenislog=" + jenis
      + "&referensi=" + referensi
      + "&noreff=" + noreff
      + "&keterangan=" + ket
    ).subscribe(e => {

    })
  }
  nomorAntrian() {
    let petugas = '-'
    window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
        + this.item.noregistrasi
        + '&kdprofile=1', '_blank');
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
    //   + this.item.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => {
    //     // do something with response
    //   }, error => {
    //     // debugger
    //     // let antrian = {
    //     //   "jenis": "K",
    //     //   "poli": "Kasir",
    //     //   "idRuanganTPP": 793,
    //     // }
    //     // this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
    //     //   this.service.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
    //     //     // do something with response
    //     //   })

    //     // }, error => {
    //     //   debugger
    //     // })
    //   });
  }
  print(jenis) {
    let antrian = {
      "jenis": jenis,
      "poli": "Kasir",
      "idRuanganTPP": 793,
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      // this.service.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
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