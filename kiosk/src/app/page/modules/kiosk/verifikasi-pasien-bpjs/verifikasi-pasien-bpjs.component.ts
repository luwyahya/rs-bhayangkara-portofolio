
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
  selector: 'app-verifikasi-pasien-bpjs',
  templateUrl: './verifikasi-pasien-bpjs.component.html',
  styleUrls: ['./verifikasi-pasien-bpjs.component.scss']
})
export class VerifikasiPasienBpjsComponent implements OnInit {
  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  pasien: any = {}
  dataCache: any
  item: any = {}
  pasienDaftar: any = {}
  pemAsuransi: any = {}
  dataSEP: any = {}
  diagnosa: any = {}
  listDokter: SelectItem[]
  listDokterMelayani: SelectItem[]
  listRujukan: SelectItem[]
  listHistori: any[]
  isTemporaryBrigding: boolean = false
  showCetak: boolean = false
  showCetaks: boolean = false
  isSuksesSEP: boolean = false
  showDPJP: boolean = false
  showPasca: boolean = true
  ppkPelayananRS: any = "0119R004"
  test: any = "PILIH DOKTER"
  tests: any = "PILIH POLI"
  listPoli: SelectItem[]
  listPoliTemp: any = []
  noSKDP: any
  noPascaRanap: any
  item1: any = {}
  noReservasi: any
  showPenjagaan: boolean = false
  showGantiDokter: boolean
  showGantiPoli: boolean
  CurrentPage: string;
  CurrentPages: string;
  CurrentShowPilihan: string;
  buttons: SelectItem[]
  buttonss: SelectItem[]
  isKunjunganPertamaBPJS: boolean = true
  showTujuanKunj: boolean = false
  showPilihan: boolean = false
  showFlag: boolean = false
  showassesmentPel: boolean = false
  showakdPenunjang: boolean = false
  tujuanKunj: any = ''
  flagProcedure: any = ''
  kdPenunjang: any = ''
  assesmentPel: any = ''
  isCekSuratKontrol: boolean = false
  listtujuanKunj: any = [
    { "id": "1", "name": "Prosedur" },
    { "id": "2", "name": "Konsul Dokter" }];
  listflagProcedure: any = [
    { "id": "0", "name": "Prosedur Tidak Berkelanjutan" },
    { "id": "1", "name": "Prosedur dan Terapi Berkelanjutan" }];
  listassesmentPel: any = [
    { "id": "1", "name": "Poli spesialis tidak tersedia pada hari sebelumnya" },
    { "id": "2", "name": "Jam Poli telah berakhir pada hari sebelumnya" },
    { "id": "3", "name": "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
    { "id": "4", "name": "Atas Instruksi RS" },
    { "id": "5", "name": "Tujuan Kontrol" },
  ]
  listkdPenunjang: any = []
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService,
    private service: Http,) {

  }

  // buttons: Array<{label: string}> = [
  //   {
  //     label: 'Global'
  //   },
  //   {
  //     label: 'Test'
  //   },
  //   {
  //     label: 'Settings'
  //   },
  //   {
  //     label: 'Profile'
  //   },
  //   {
  //     label: 'Transactions'
  //   }
  // ]

  ChangeScreen(button: string) {
    debugger
    this.CurrentPage = button;
    this.test = this.CurrentPage['label'];
    this.formGroup.get('dokterDPJPMelayani').setValue(this.CurrentPage['value'])
    this.showGantiDokter = false;
  }
  ChangeScreens(button: string) {
    this.CurrentPages = button;
    this.tests = this.CurrentPages['label'];
    this.formGroup.get('poliTujuan').setValue(this.CurrentPages['value'])
    this.showGantiPoli = false;
    this.changePoli(button);
  }
  ChangeTujuan(button: string) {
    this.CurrentShowPilihan = button
    this.showTujuanKunj = false
    this.tujuanKunj = this.CurrentShowPilihan['id']
    if (this.CurrentShowPilihan['id'] == 1) {
      this.showFlag = true
    } else if (this.CurrentShowPilihan['id'] == 2) {
      this.showassesmentPel = true
    }
  }
  ChangeFlag(button: string) {
    this.CurrentShowPilihan = button
    this.showFlag = false
    this.showakdPenunjang = true
    this.flagProcedure = this.CurrentShowPilihan['id']
    if (this.CurrentShowPilihan['id'] == 0) {
      this.listkdPenunjang = [{ "id": "7", "name": "Laboratorium" },
      { "id": "8", "name": "USG" },
      { "id": "9", "name": "Farmasi" },
      { "id": "10", "name": "Lain-Lain" },
      { "id": "11", "name": "MRI" }]
    } else if (this.CurrentShowPilihan['id'] == 1) {
      this.listkdPenunjang = [{ "id": "1", "name": "Radioterapi" },
      { "id": "2", "name": "Kemoterapi" },
      { "id": "3", "name": "Rehabilitasi Medik" },
      { "id": "4", "name": "Rehabilitasi Psikososial" },
      { "id": "5", "name": "Transfusi Darah" },
      { "id": "6", "name": "Pelayanan Gigi" },
      { "id": "12", "name": "HEMODIALISA" }]
    }
  }
  ChangeAsesment(button: string) {
    this.CurrentShowPilihan = button
    this.assesmentPel = this.CurrentShowPilihan['id']
    this.showPilihan = false
    this.insertLiveBridging()
  }
  ChangePenunjang(button: string) {
    this.CurrentShowPilihan = button
    this.kdPenunjang = this.CurrentShowPilihan['id']
    this.showPilihan = false
    this.insertLiveBridging()
  }
  ngOnInit() {


    // let namafieldPPK = ''
    // this.httpService.get('medifirst2000/settingdatafixed/get/kodePPKRujukan').subscribe(resps => {
    //   this.ppkPelayananRS = resps
    //   console.log(resps)
    // })

    this.httpService.get('medifirst2000/bridging/bpjs2/generateskdp').subscribe(resp => {
      this.noSKDP = resp.noskdp

    })

    let namafield = 'isTemporaryBrigding'
    this.httpService.get('medifirst2000/sysadmin/general/settingdatafixed/get/' + namafield).subscribe(resp => {
      this.isTemporaryBrigding = resp
    }, error => {
      this.isTemporaryBrigding = false
    })

    this.cacheHelper.set('cacheSelfRegis', undefined);
    this.formGroup = this.fb.group({
      'noRujukan': new FormControl(''),
      'dokterDPJP': new FormControl(''),
      'multiRujukan': new FormControl(''),
      'pCare': new FormControl(''),
      'rumahSakit': new FormControl(''),
      'poliTujuan': new FormControl(''),
      'pascaRanap': new FormControl(''),
      'dokterDPJPMelayani': new FormControl(''),
    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });

    this.httpService.get('medifirst2000/bridging/bpjs/get-daftar-poli-internal').subscribe(response => {
      this.listPoli = [];
      this.buttonss = [];
      this.listPoli.push({ label: '-- Poli Tujuan --', value: null });
      response.forEach(response => {
        this.listPoli.push({
          label: response.namaruangan, value: {
            'kode': response.kdinternal,
            'nama': response.namaruangan,
            'kodeinternal': response.id,
            'objectdepartemenfk': response.objectdepartemenfk,
          }
        });
        this.buttonss.push({
          label: response.namaruangan, value: {
            'kode': response.kdinternal,
            'nama': response.namaruangan,
            'kodeinternal': response.id,
            'objectdepartemenfk': response.objectdepartemenfk,
          }
        });
      });
      this.listPoliTemp = response

    }, error => {
      this.listPoli = [];
      this.listPoliTemp = []
    })

    let cacheOnlineBPJS = this.cacheHelper.get('cacheOnlineBPJS')
    if (cacheOnlineBPJS != undefined) {
      this.formGroup.get('noRujukan').setValue(cacheOnlineBPJS.nobpjs)
      this.noReservasi = cacheOnlineBPJS.noreservasi
      this.cacheHelper.set('cacheOnlineBPJS', undefined)
    }

  }
  changeNoRujukan(event) {
    let noKunjungan = this.listRujukan.find(data => data.value == event.value)
    console.log(noKunjungan)
    // this.item.noKunjungan = noKunjungan.label
    // this.item.diagnosa.kode = noKunjungan.value
    this.cekPesertaByNoRujukan(noKunjungan.label)
  }
  changePoli(event) {
    var kdinternal = this.listPoli.find(data => data.value == event.value);
    if (this.showPasca == false) {
      kdinternal = event
    }
    console.log(kdinternal);


    debugger
    this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
      + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdinternal.value.kode).subscribe(data => {
        if (data.metaData.code == 200) {
          this.listDokterMelayani = [];
          this.buttons = [];
          this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
          data.response.list.forEach(response => {
            this.listDokterMelayani.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
            this.buttons.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
          });

        } else {
          if (data.metaData.code == 201 && kdinternal.value.kode == "HDL") {
            this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
              + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "INT").subscribe(data => {
                if (data.metaData.code == 200) {
                  this.listDokterMelayani = [];
                  this.buttons = [];
                  this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                  data.response.list.forEach(response => {
                    this.listDokterMelayani.push({
                      label: response.nama, value: {
                        'kode': response.kode,
                        'nama': response.nama
                      }
                    });
                    this.buttons.push({
                      label: response.nama, value: {
                        'kode': response.kode,
                        'nama': response.nama
                      }
                    });
                  });

                }
              });
          }
          this.listDokter = []
          this.listDokterMelayani = [];
          this.buttons = [];
          this.alertService.info('Dokter DPJP tidak ada', 'Info')
        }

      });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //  getPegawaiByName(event) {
  //   this.httpService.get('master/pegawai/get-pegawai-by-nama/' + event.query).subscribe(data => {
  //     this.listPegawai = data.data;
  //   });
  // }

  getNoRujukan() {
    if (this.formGroup.get('noRujukan').value == '') return;
    if (this.formGroup.get('pCare').value == '' && this.formGroup.get('rumahSakit').value == '' && this.formGroup.get('pascaRanap').value == '') {
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

    if (this.formGroup.get('noRujukan').value != null) {
      if (this.formGroup.get('noRujukan').value.length == 1) {
        this.formGroup.get('noRujukan').setValue("0000000" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 2) {
        this.formGroup.get('noRujukan').setValue("000000" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 3) {
        this.formGroup.get('noRujukan').setValue("00000" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 4) {
        this.formGroup.get('noRujukan').setValue("0000" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 5) {
        this.formGroup.get('noRujukan').setValue("000" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 6) {
        this.formGroup.get('noRujukan').setValue("00" + this.formGroup.get('noRujukan').value)
      } else if (this.formGroup.get('noRujukan').value.length == 7) {
        this.formGroup.get('noRujukan').setValue("0" + this.formGroup.get('noRujukan').value)
      }
    }

    // var re = /[a-zA-Z]/;
    // if (re.test(this.formGroup.get('noRujukan').value))
    // {
    //   this.alertService.warn('Peringatan', 'Nomor RM harus 8 digit ANGKA')
    //   return
    //     //there are only alphanumeric characters
    // }


    let nomor = this.formGroup.get('noRujukan').value
    if (this.isTemporaryBrigding == true) {
      this.getNoKaTemporaryBrigding()
    } else {
      if (nomor.toString().length < 8) {
        this.alertService.warn('Peringatan', 'Nomor RM harus 8 digit. Tambahkan 0 di depan supaya 8 digit')
        return;
      }
      else if (nomor.toString().length == 8) {
        this.getPasienByNoCM1(nomor)
      }
      else if (nomor.toString().length <= 14) {
        this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
      } else {
        this.cekPesertaByNoRujukan(this.formGroup.get('noRujukan').value)
      }
    }

  }

  getNoKaTemporaryBrigding() {
    this.getJSON('rujukan').subscribe(e => {
      let res = e.response
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        let nomorPembanding = ''
        if (this.formGroup.get('noRujukan').value.toString().length <= 14)
          nomorPembanding = element.rujukan.peserta.noKartu
        else
          nomorPembanding = element.rujukan.noKunjungan

        if (nomorPembanding == this.formGroup.get('noRujukan').value) {

          this.item = element.rujukan;

          if (element.rujukan.peserta.mr.noMR != null)
            this.getPasienByNoCM(element.rujukan.peserta.mr.noMR)
          else
            element.rujukan.peserta.mr.noMR = '-'
          this.httpService.get('medifirst2000/kiosk/get-ruanganbykode/' + element.rujukan.poliRujukan.kode).subscribe(res => {
            if (res.data != null) {
              this.formGroup.get('poliTujuan').setValue({
                'kode': res.data.kdinternal,
                'nama': res.data.namaruangan,
                'kodeinternal': res.data.id,
                'objectdepartemenfk': res.data.objectdepartemenfk,
              })
              this.pasienDaftar.idruangan = res.data.id
              this.pasienDaftar.objectdepartemenfk = res.data.objectdepartemenfk
            }

          })
          this.getDiagnosaByKode(element.rujukan.diagnosa.kode)

          // this.diagnosa.kddiagnosa = 'R62.0'
          // this.diagnosa.id = 6164
          this.listDokter = [
            {
              label: '-- Dokter -- ',
              value: null
            }, {
              label: 'DR.I NYOMAN DWIJA PUTRA, SP.B',
              value: {
                'kode': '1',
                'nama': 'DR.I NYOMAN DWIJA PUTRA, SP.B'
              }
            },
            {
              label: 'dr. Devi Rina M Tarigan',
              value: {
                'kode': '2',
                'nama': 'dr. Devi Rina M Tarigan'
              }
            },
            {
              label: 'VERRA',
              value: {
                'kode': '3',
                'nama': 'VERRA'
              }
            }
          ];


          // this.getRuanganInternal(this.item.poliRujukan.kode)
          // this.getDiagnosaByKode(this.item.diagnosa.kode)
          // get Dokter DPJP By Histori
          // this.getHistoriPelayananPesesta(element.rujukan.peserta.noKartu)
          // end Histori
          this.isInfoPasien = true
          this.alertService.info('Status Peserta', element.rujukan.peserta.statusPeserta.keterangan);
          break
        }
      }
    });
  }
  setradio(e: string): void {
    this.formGroup.get('rumahSakit').setValue('')
    this.formGroup.get('pascaRanap').setValue('')
  }
  setradio2(e: string): void {
    this.formGroup.get('pCare').setValue('')
    this.formGroup.get('pascaRanap').setValue('')
  }
  setradio3(e: string): void {
    this.formGroup.get('pCare').setValue('')
    this.formGroup.get('rumahSakit').setValue('')
  }
  cekPesertaByNoKartu(noKa) {
    let jenis = "rs"
    if (this.formGroup.get('pCare').value != '') {
      jenis = 'pcare'
    }

    if (this.formGroup.get('pascaRanap').value != '') {
      this.showPasca = false;
      this.httpService.get("medifirst2000/bridging/bpjs2/get-no-peserta?nokartu=" + noKa + "&tglsep=" + moment(new Date()).format('YYYY-MM-DD')).subscribe(e => {
        if (e.metaData.code === "200") {
          this.item1 = e.response.peserta;

          this.getHistoriPelayananPesesta1(e.response.peserta.noKartu)
          if (e.response.peserta.mr.noMR != null) {
            if (e.response.peserta.mr.noMR.length == 1) {
              e.response.peserta.mr.noMR = "0000000" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 2) {
              e.response.peserta.mr.noMR = "000000" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 3) {
              e.response.peserta.mr.noMR = "00000" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 4) {
              e.response.peserta.mr.noMR = "0000" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 5) {
              e.response.peserta.mr.noMR = "000" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 6) {
              e.response.peserta.mr.noMR = "00" + e.response.peserta.mr.noMR
            } else if (e.response.peserta.mr.noMR.length == 7) {
              e.response.peserta.mr.noMR = "0" + e.response.peserta.mr.noMR
            }
          }
          this.getPasienByNoCM(e.response.peserta.mr.noMR)


          this.getDiagnosaByKode("Z09.8")


          // this.getMultiRujukan(e.response.peserta.noKartu)
          // end Histori
          this.isInfoPasien = true
          // this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
          if (e.response.peserta.statusPeserta.kode == 6) {
            this.isInfoPasien = false
            this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.response.peserta.statusPeserta.keterangan);
            var stt = ""
            if (confirm(e.response.peserta.statusPeserta.keterangan)) {
              // Save it!
              stt = 'true';
            } else {
              // Do nothing!
              stt = 'false'
              //return
            }
          }
        } else {
          this.isInfoPasien = false
          // this.alertService.error('Error', e.metaData.message);
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
        this.isInfoPasien = false
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
    } else {
      this.httpService.get("medifirst2000/bridging/bpjs2/get-rujukan-" + jenis + "-nokartu?nokartu=" + noKa).subscribe(e => {
        if (e.metaData.code === "200") {
          this.item = e.response.rujukan;
          if (e.response.rujukan.peserta.mr.noMR != null) {
            if (e.response.rujukan.peserta.mr.noMR.length == 1) {
              e.response.rujukan.peserta.mr.noMR = "0000000" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 2) {
              e.response.rujukan.peserta.mr.noMR = "000000" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 3) {
              e.response.rujukan.peserta.mr.noMR = "00000" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 4) {
              e.response.rujukan.peserta.mr.noMR = "0000" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 5) {
              e.response.rujukan.peserta.mr.noMR = "000" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 6) {
              e.response.rujukan.peserta.mr.noMR = "00" + e.response.rujukan.peserta.mr.noMR
            } else if (e.response.rujukan.peserta.mr.noMR.length == 7) {
              e.response.rujukan.peserta.mr.noMR = "0" + e.response.rujukan.peserta.mr.noMR
            }
          }
          this.getPasienByNoCM(e.response.rujukan.peserta.mr.noMR)
          for (var i = this.listPoliTemp.length - 1; i >= 0; i--) {
            if (this.listPoliTemp[i].kditernal == this.item.poliRujukan.kode) {
              this.getRuanganInternal(this.item.poliRujukan.kode)
              break
            } else {
              this.getRuanganInternal(this.item.poliRujukan.kode)
              break
            }
          }

          this.getDiagnosaByKode(this.item.diagnosa.kode)
          // get Dokter DPJP By Histori
          this.getHistoriPelayananPesesta(e.response.rujukan.peserta.noKartu)
          this.getMultiRujukan(e.response.rujukan.peserta.noKartu)
          // end Histori
          this.isInfoPasien = true
          this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
          if (e.response.rujukan.peserta.statusPeserta.kode == 6) {
            this.isInfoPasien = false
            this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.response.rujukan.peserta.statusPeserta.keterangan);
            var stt = ""
            if (confirm(e.response.rujukan.peserta.statusPeserta.keterangan)) {
              // Save it!
              stt = 'true';
            } else {
              // Do nothing!
              stt = 'false'
              //return
            }
          }
        } else {
          this.isInfoPasien = false
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
        this.isInfoPasien = false
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

  cekPesertaByNoRujukan(noKa) {
    let jenis = "rs"
    if (this.formGroup.get('pCare').value != '')
      jenis = 'pcare'
    this.httpService.get('medifirst2000/bridging/bpjs2/get-rujukan-' + jenis + '?norujukan=' + noKa).subscribe(e => {
      if (e.metaData.code === "200") {
        this.item = e.response.rujukan;
        if (e.response.rujukan.peserta.mr.noMR != null) {
          if (e.response.rujukan.peserta.mr.noMR == 1) {
            e.response.rujukan.peserta.mr.noMR = "0000000" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR == 2) {
            e.response.rujukan.peserta.mr.noMR = "000000" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR.length == 3) {
            e.response.rujukan.peserta.mr.noMR = "00000" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR.length == 4) {
            e.response.rujukan.peserta.mr.noMR = "0000" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR.length == 5) {
            e.response.rujukan.peserta.mr.noMR = "000" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR.length == 6) {
            e.response.rujukan.peserta.mr.noMR = "00" + e.response.rujukan.peserta.mr.noMR
          } else if (e.response.rujukan.peserta.mr.noMR.length == 7) {
            e.response.rujukan.peserta.mr.noMR = "0" + e.response.rujukan.peserta.mr.noMR
          }
        }
        this.getPasienByNoCM(e.response.rujukan.peserta.mr.noMR)
        for (var i = this.listPoliTemp.length - 1; i >= 0; i--) {
          if (this.listPoliTemp[i].kditernal == this.item.poliRujukan.kode) {
            this.getRuanganInternal(this.item.poliRujukan.kode)
            break
          } else {
            this.getRuanganInternal(this.item.poliRujukan.kode)
            break
          }
        }
        // this.getRuanganInternal(this.item.poliRujukan.kode)
        this.getDiagnosaByKode(this.item.diagnosa.kode)
        this.isInfoPasien = true
        // var tglLahir = new Date(e.response.rujukan.peserta.tglLahir);
        // $scope.model.tglRujukan = new Date(e.response.rujukan.tglKunjungan)
        // $scope.model.noKepesertaan = $scope.noKartu = e.response.rujukan.peserta.noKartu;
        // $scope.model.namaPeserta = e.response.rujukan.peserta.nama;
        // $scope.model.tglLahir = tglLahir;
        // $scope.model.noIdentitas = e.response.rujukan.peserta.nik;
        // $scope.model.kelasBridg = {
        //   id: parseInt(e.response.rujukan.peserta.hakKelas.kode),
        //   kdKelas: e.response.rujukan.peserta.hakKelas.kode,
        //   nmKelas: e.response.rujukan.peserta.hakKelas.keterangan,
        //   namakelas: e.response.rujukan.peserta.hakKelas.keterangan,
        // };
        // if ($scope.model.kelasBridg.id == 1) {
        //   $scope.model.kelasDitanggung = { id: 3, namakelas: 'Kelas I' }
        // } else if ($scope.model.kelasBridg.id == 2) {
        //   $scope.model.kelasDitanggung = { id: 2, namakelas: 'Kelas II' }
        // } else {
        //   $scope.model.kelasDitanggung = { id: 1, namakelas: 'Kelas III' }
        // }

        // $scope.kodeProvider = e.response.rujukan.provPerujuk.kode;
        // $scope.namaProvider = e.response.rujukan.provPerujuk.nama;
        // $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
        // $scope.model.jenisPeserta = e.response.rujukan.peserta.jenisPeserta.keterangan;
        // this.httpService.get("transaksi/registrasipasien/get-diagnosa-saeutik?kddiagnosa=" + e.response.rujukan.diagnosa.kode)
        //   .subscribe(res => {
        //     $scope.sourceDiagnosa.add(res[0])
        //     $scope.model.diagnosa = res[0]
        //   })

        // get Dokter DPJP By Histori
        this.getHistoriPelayananPesesta(e.response.rujukan.peserta.noKartu)
        // end Histori

        this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
        if (e.response.rujukan.peserta.statusPeserta.kode == 6) {
          this.isInfoPasien = false
          this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.response.rujukan.peserta.statusPeserta.keterangan);
          var stt = ""
          if (confirm(e.response.rujukan.peserta.statusPeserta.keterangan)) {
            // Save it!
            stt = 'true';
          } else {
            // Do nothing!
            stt = 'false'
            //return
          }
        }
      } else {
        this.isInfoPasien = false
        this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.metaData.message);
      }

    }, error => {
      this.isInfoPasien = false
      this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', error);
    })
  }
  getDiagnosaByKode(kode) {
    this.httpService.get('medifirst2000/kiosk/get-diagnosabykode/' + kode).subscribe(res => {
      this.diagnosa = res.data
    })
  }
  getRuanganInternal(kode: any) {
    this.httpService.get('medifirst2000/kiosk/get-ruanganbykode/' + kode).subscribe(res => {
      if (res.data != null) {
        this.listPoli = [];
        this.buttonss = [];
        this.listPoli.push({ label: '-- Poli Tujuan --', value: null });
        this.listPoli.push({
          label: res.data.namaruangan, value: {
            'kode': res.data.kdinternal,
            'nama': res.data.namaruangan,
            'kodeinternal': res.data.id,
            'objectdepartemenfk': res.data.objectdepartemenfk,
          }
        });
        this.buttonss.push({
          label: res.data.namaruangan, value: {
            'kode': res.data.kdinternal,
            'nama': res.data.namaruangan,
            'kodeinternal': res.data.id,
            'objectdepartemenfk': res.data.objectdepartemenfk,
          }
        });
        this.listPoliTemp = this.listPoli

        this.formGroup.get('poliTujuan').setValue({
          'kode': res.data.kdinternal,
          'nama': res.data.namaruangan,
          'kodeinternal': res.data.id,
          'objectdepartemenfk': res.data.objectdepartemenfk,
        })

        this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
          + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + kode).subscribe(data => {
            if (data.metaData.code == 200) {
              this.listDokter = [];
              this.listDokter.push({ label: '-- Dokter --', value: null });
              data.response.list.forEach(response => {
                this.listDokter.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
              });
              this.listDokterMelayani = [];
              this.buttons = [];
              this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
              data.response.list.forEach(response => {
                this.listDokterMelayani.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
                this.buttons.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
              });

            } else {
              this.listDokter = []
              this.listDokterMelayani = [];
              this.buttons = [];
              this.alertService.info('Dokter DPJP tidak ada', 'Info')
            }

          });
        this.pasienDaftar.idruangan = res.data.id
        this.pasienDaftar.objectdepartemenfk = res.data.objectdepartemenfk
      }

    })
  }
  getPasienByNoCM(nocm) {
    this.httpService.get('medifirst2000/reservasionline/get-pasien-kiosk/' + nocm + '/null').subscribe(e => {
      if (e.data.length > 0) {
        this.pasien = e.data[0]
        // if(e.data[0].penanggungjawab == null){
        //   alert("Penanggung Jawab Pasein Tidak Lengkap,  SILAHKAN AMBIL ANTRIAN")
        //   this.showPenjagaan = true
        // }
        // if(e.data[0].alamatlengkap == null){
        //   alert("Alamat Lengkap Pasien Tidak Lengkap,  SILAHKAN AMBIL ANTRIAN")
        //   this.showPenjagaan = true
        // }
        // if(e.data[0].ktppenanggungjawab == null){
        //   alert("KTP Penanggung Jawab Pasien Tidak Lengkap,  SILAHKAN AMBIL ANTRIAN")
        //   this.showPenjagaan = true
        // }
        // if(e.data[0].objectdesakelurahanfk == null){
        //   alert("Desa Kelurahan Pasien Tidak Lengkap,  SILAHKAN AMBIL ANTRIAN")
        //   this.showPenjagaan = true
        // }
        // if(e.data[0].namaibu == null){
        //   alert("Nama Ibu Pasien Tidak Lengkap,  SILAHKAN AMBIL ANTRIAN")
        //   this.showPenjagaan = true
        // }
        // this.httpService.get("transaksi/registrasipasien/cek-nobpjsaja?nobpjs="+ this.item.peserta.noKartu+"&idnocm="+this.pasien.nocmfk)
        //                 .subscribe(e => {
        //                     let ceks = e.data;
        //                     var nocm =  ceks[0].nocm;
        //                     if (ceks.length >=1){
        //                     alert("NO BPJS SUDAH DI PAKAI OLEH NO CM " + nocm + "!!!!!,  SILAHKAN AMBIL ANTRIAN")
        //                     // $state.go('RegistrasiPasienLamaRev');
        //                     this.showPenjagaan = true
        //                     // return;
        //                     }
        //                 })
      } else {

      }
    })

  }




  getHistoriPelayananPesesta(noKartu) {
    // debugger
    let jenisPel = ''
    let kdSpesialis = ''
    this.httpService.get("medifirst2000/bridging/bpjs2/monitoring/HistoriPelayanan/NoKartu/" + noKartu).subscribe(data => {
      if (data.metaData.code == 200) {
        this.listHistori = data.response.histori;
        if (this.listHistori.length > 0) {
          for (let i = 0; i < this.listHistori.length; i++) {
            if (this.item.noKunjungan == this.listHistori[i].noRujukan) {
              this.isKunjunganPertamaBPJS = false
              break;
            }
          }
          if (this.isKunjunganPertamaBPJS == true) {
            this.alertService.info('Kunjungan Pertama Dengan Nomor Rujukan ' + this.item.noKunjungan, 'Info')
          } else {
            this.httpService.get("medifirst2000/bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + this.item.peserta.noKartu
            ).subscribe(data => {
              if (data.metaData.code == "200") {
                for (let i = 0; i < data.response.list.length; i++) {
                  if (moment(new Date()).format('YYYY-MM-DD') == data.response.list[i].tglRencanaKontrol) {
                    this.isCekSuratKontrol = true
                    this.noSKDP = data.response.list[i].noSuratKontrol
                    break;
                  }
                }
                if (this.isCekSuratKontrol == true) {
                  this.httpService.get("medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + this.noSKDP
                  ).subscribe(data => {
                    if (data.metaData.code == 200) {
                      this.test = data.response.namaDokter
                      this.formGroup.get('dokterDPJPMelayani').setValue({
                        "kode": data.response.kodeDokter,
                        "nama": data.response.namaDokter
                      })
                      this.formGroup.get('dokterDPJP').setValue({
                        "kode": data.response.kodeDokterPembuat,
                        "nama": data.response.namaDokterPembuat
                      })
                    }
                  })
                } else {
                  this.alertService.error('Nomor Rujukan ' + this.item.noKunjungan + ' Tidak Mempunyai Surat Kontrol', 'Info')
                }
              } else {
                this.alertService.error('Nomor Rujukan ' + this.item.noKunjungan + ' Tidak Mempunyai Surat Kontrol', 'Info')
              }
            })
          }


          jenisPel = this.listHistori[0].jnsPelayanan
          let kodeNamaPoli = this.listHistori[0].poli.split(' ');
          if (kodeNamaPoli.length > 0)
            this.httpService.get("medifirst2000/bridging/bpjs2/get-poli?kodeNamaPoli=" + kodeNamaPoli[0]).subscribe(e => {
              if (e.metaData.code == 200) {
                let resPoli = e.response.poli;
                if (resPoli.length > 0) {
                  for (let i in resPoli) {
                    if (this.listHistori[0].poli == resPoli[i].nama) {
                      kdSpesialis = resPoli[i].kode
                      break
                    }
                  }

                  this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                    + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).subscribe(data => {
                      if (data.metaData.code == 200) {
                        this.listDokter = [];
                        // this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                        data.response.list.forEach(response => {
                          this.listDokter.push({
                            label: response.nama, value: {
                              'kode': response.kode,
                              'nama': response.nama
                            }
                          });
                        });
                        this.formGroup.get('dokterDPJP').setValue({ kode: this.listDokter[0].value.kode, nama: this.listDokter[0].value.nama })
                        // this.listDokterMelayani = [];
                        // this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                        // data.response.list.forEach(response => {
                        //   this.listDokterMelayani.push({
                        //     label: response.nama, value: {
                        //       'kode': response.kode,
                        //       'nama': response.nama
                        //     }
                        //   });
                        // });

                      } else {
                        if (data.metaData.code == 201 && kdSpesialis == "HDL") {
                          this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                            + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "INT").subscribe(data => {
                              if (data.metaData.code == 200) {
                                this.listDokter = [];
                                this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                                data.response.list.forEach(response => {
                                  this.listDokter.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                });
                                this.listDokterMelayani = [];
                                this.buttons = [];
                                this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                                data.response.list.forEach(response => {
                                  this.listDokterMelayani.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                  this.buttons.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                });

                              }
                            });
                        } else if (data.metaData.code == 201) {
                          this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                            + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "INT").subscribe(data => {
                              if (data.metaData.code == 200) {
                                this.listDokter = [];
                                this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                                data.response.list.forEach(response => {
                                  this.listDokter.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                });
                                this.listDokterMelayani = [];
                                this.buttons = [];
                                this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                                data.response.list.forEach(response => {
                                  this.listDokterMelayani.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                  this.buttons.push({
                                    label: response.nama, value: {
                                      'kode': response.kode,
                                      'nama': response.nama
                                    }
                                  });
                                });

                              }
                            });
                        }
                        this.listDokter = []
                        this.listDokterMelayani = [];
                        this.buttons = [];
                        this.alertService.info('Dokter DPJP tidak ada', 'Info')
                      }

                    });
                }
              }

            });
        }
      }
      else {
        this.listDokter = [];
        this.listDokterMelayani = [];
        // this.listDokter.push({ label: '--Pilih Dokter --', value: null });
        this.listHistori = []



      }
    });
  }

  insertSep() {
    if (this.showPenjagaan == true) {
      var stt = ""
      if (confirm('DATA PASIEN BELUM LENGKAP/NO BPJS SUDAH DI PAKAI DUA NORM, INFO SILAHKAN AMBIL ANTRIAN')) {
        // Save it!
        stt = 'true';
      } else {
        // Do nothing!
        stt = 'false'
        //return
      }
      this.alertService.error('DATA PASIEN BELUM LENGKAP/NO BPJS SUDAH DI PAKAI DUA NORM ', 'INFO SILAHKAN AMBIL ANTRIAN');
      return;
    }
    if (this.isTemporaryBrigding == true) {
      this.insertTempBrigding()
    } else {
      if (this.item.peserta.mr.noTelepon == null) {
        this.item.peserta.mr.noTelepon = '12345678'
      } else if (this.item.peserta.mr.noTelepon.length > 12) {
        this.item.peserta.mr.noTelepon = '12345678'
      }
      // this.getRuanganInternal(this.formGroup.get('poliTujuan').value.kode)
      if (this.formGroup.get('poliTujuan').value != '') {
        if (this.formGroup.get('poliTujuan').value.kode != "HDL") {
          this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
            + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + this.formGroup.get('poliTujuan').value.kode).subscribe(data => {
              if (data.metaData.code == 200) {
                // this.insertLiveBridging()
                this.cekKondisi()
              } else {
                this.alertService.info('SIP Dokter DPJP POLI TUJUAN HABIS', 'Info')
                var stt = ""
                if (confirm('SIP Dokter DPJP POLI TUJUAN HABIS')) {
                  // Save it!
                  stt = 'true';
                } else {
                  // Do nothing!
                  stt = 'false'
                  //return
                }
              }
            });
        } else {
          // this.insertLiveBridging()
          this.cekKondisi()
        }
      }
    }
  }



  getMultiRujukan(noKartu) {
    let jenisfaskes = "rs"
    if (this.formGroup.get('pCare').value != '')
      jenisfaskes = "pcare"
    this.httpService.get("medifirst2000/bridging/bpjs2/get-rujukan-" + jenisfaskes + "-nokartu-multi?nokartu=" + noKartu).subscribe(data => {
      if (data.metaData.code == 200) {
        this.listRujukan = [];

        this.listRujukan.push({ label: "--Histori No Rujukan--", value: null });
        this.listRujukan.push({ label: data.response.rujukan[0].noKunjungan, value: data.response.rujukan[0].diagnosa.kode });
        this.listRujukan.push({ label: data.response.rujukan[1].noKunjungan, value: data.response.rujukan[1].diagnosa.kode });
        this.listRujukan.push({ label: data.response.rujukan[2].noKunjungan, value: data.response.rujukan[2].diagnosa.kode });
        // data.response.rujukan[0].noKunjungan.forEach(noKunjungan => {
        //   this.listRujukan.push({
        //     label: noKunjungan, value: {
        //       'kode': noKunjungan,
        //       'nama': noKunjungan
        //     }
        //   });
        // });
      } else {
        this.listRujukan = [];
        this.listRujukan.push({ label: "--Histori No Rujukan--", value: null });
      }
    })
  }
  getHistoriPelayananPesesta1(noKartu) {
    this.httpService.get("medifirst2000/bridging/bpjs2/monitoring/HistoriPelayanan/NoKartu/" + noKartu).subscribe(data => {
      if (data.metaData.code == 200) {
        this.listHistori = data.response.histori;
        if (this.listHistori.length > 0) {
          for (let i in this.listHistori) {
            if (this.listHistori[i].jnsPelayanan == "1") {
              this.noPascaRanap = this.listHistori[i].noSep
              var a = {
                'nama': "RS PUSAT POLRI SAID SUKANTO",
                'kode': this.ppkPelayananRS
              }
              var b = {
                'kode': "Z09.8"
              }
              var c = {
                'kode': "2"
              }
              var d = {
                'kode': "Pasca",
                'nama': "Pasca Ranap"
              }
              this.item = {
                'noKunjungan': this.noPascaRanap,
                'peserta': this.item1,
                'tglKunjungan': moment(new Date()).format('YYYY-MM-DD'),
                'provPerujuk': a,
                'diagnosa': b,
                'pelayanan': c,
                'poliRujukan': d,
              }
              this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "").subscribe(data => {
                  if (data.metaData.code == 200) {
                    this.listDokter = [];
                    // this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                    data.response.list.forEach(response => {
                      this.listDokter.push({
                        label: response.nama, value: {
                          'kode': response.kode,
                          'nama': response.nama
                        }
                      });
                    });
                    this.formGroup.get('dokterDPJP').setValue({ kode: this.listDokter[0].value.kode, nama: this.listDokter[0].value.nama })
                    this.listDokterMelayani = [];
                    this.buttons = [];
                    this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                    data.response.list.forEach(response => {
                      this.listDokterMelayani.push({
                        label: response.nama, value: {
                          'kode': response.kode,
                          'nama': response.nama
                        }
                      });
                      this.buttons.push({
                        label: response.nama, value: {
                          'kode': response.kode,
                          'nama': response.nama
                        }
                      });
                    });

                  }
                });

              this.httpService.get("medifirst2000/bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + this.item.peserta.noKartu
              ).subscribe(data => {
                for (let i = 0; i < data.response.list.length; i++) {
                  if (moment(new Date()).format('YYYY-MM-DD') == data.response.list[i].tglRencanaKontrol) {
                    this.isCekSuratKontrol = true
                    this.noSKDP = data.response.list[i].noSuratKontrol
                    break;
                  }
                }
                if (this.isCekSuratKontrol == true) {
                  this.httpService.get("medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + this.noSKDP
                  ).subscribe(data => {
                    if (data.metaData.code == 200) {
                      this.test = data.response.namaDokter
                      this.formGroup.get('dokterDPJPMelayani').setValue({
                        "kode": data.response.kodeDokter,
                        "nama": data.response.namaDokter
                      })
                      this.formGroup.get('dokterDPJP').setValue({
                        "kode": data.response.namaDokter,
                        "nama": data.response.namaDokter
                      })
                    }
                  })
                } else {
                  this.alertService.info('Nomor Rujukan ' + this.item.noKunjungan + ' Tidak Mempunyai Surat Kontrol', 'Info')
                }
              })
            }
          }
        }
      }
    })
  }
  cekKondisi() {
    if (this.isKunjunganPertamaBPJS == true) {
      this.tujuanKunj = '0'
      this.flagProcedure = ''
      this.kdPenunjang = ''
      this.assesmentPel = ''
      this.insertLiveBridging()
    } else if (this.formGroup.get('pascaRanap').value != '') {
      this.tujuanKunj = '0'
      this.flagProcedure = ''
      this.kdPenunjang = ''
      this.assesmentPel = ''
      this.insertLiveBridging()
    } else {
      this.showPilihan = true
      this.showTujuanKunj = true
    }
  }
  insertLiveBridging() {
    this.showCetaks = true
    let asalRujukan = "2"
    // this.formGroup.get('dokterDPJP').setValue(this.formGroup.get("dokterDPJPMelayani").value)
    if (this.formGroup.get('pCare').value != '') {
      asalRujukan = "1"
    } else if (this.formGroup.get('pascaRanap').value != '') {
      asalRujukan = "2"
      // this.formGroup.get('dokterDPJP').setValue(this.formGroup.get("dokterDPJPMelayani").value)
    }
    let poliTujuan = ""
    if (this.formGroup.get('poliTujuan').value != '')
      poliTujuan = this.formGroup.get('poliTujuan').value.kode
    // var dataSend = {
    //   "data": {
    //     "request": {
    //       "t_sep": {
    //         "noKartu": this.item.peserta.noKartu,
    //         "tglSep": moment(new Date()).format('YYYY-MM-DD'),
    //         "ppkPelayanan": this.ppkPelayananRS,
    //         "jnsPelayanan": "2",//this.item.pelayanan.kode,
    //         "klsRawat": this.item.peserta.hakKelas.kode.toString(),
    //         "noMR": this.item.peserta.mr.noMR,
    //         "rujukan": {
    //           "asalRujukan": asalRujukan,//RS
    //           "tglRujukan": this.item.tglKunjungan,
    //           "noRujukan": this.item.noKunjungan,
    //           "ppkRujukan": this.item.provPerujuk.kode
    //         },
    //         "catatan": "",
    //         "diagAwal": this.item.diagnosa.kode,
    //         "poli": {
    //           "tujuan": poliTujuan,
    //           "eksekutif": "0"
    //         },
    //         "cob": {
    //           "cob": "0"
    //         },
    //         "katarak": {
    //           "katarak": "0"
    //         },
    //         "jaminan": {
    //           "lakaLantas": "0",
    //           "penjamin": {
    //             "penjamin": "",
    //             "tglKejadian": "",
    //             "keterangan": "",
    //             "suplesi": {
    //               "suplesi": "0",
    //               "noSepSuplesi": "",
    //               "lokasiLaka": {
    //                 "kdPropinsi": "",
    //                 "kdKabupaten": "",
    //                 "kdKecamatan": ""
    //               }
    //             }
    //           }
    //         },
    //         "skdp": {
    //           "noSurat": this.noSKDP,
    //           "kodeDPJP": this.formGroup.get("dokterDPJP").value != '' ? this.formGroup.get("dokterDPJP").value.kode : ""
    //         },
    //         "noTelp": this.item.peserta.mr.noTelepon,
    //         "user": "transmedic"
    //       }
    //     }
    //   }
    // };
    var dataSend = {
      "data": {
        "request": {
          "t_sep": {
            "noKartu": this.item.peserta.noKartu,
            "tglSep": moment(new Date()).format('YYYY-MM-DD'),
            "ppkPelayanan": this.ppkPelayananRS,
            "jnsPelayanan": "2",//this.item.pelayanan.kode,
            "klsRawat": {
              "klsRawatHak": this.item.peserta.hakKelas.kode.toString(),
              "klsRawatNaik": "",
              "pembiayaan": "",
              "penanggungJawab": ""
            },
            "noMR": this.item.peserta.mr.noMR,
            "rujukan": {
              "asalRujukan": asalRujukan,//RS
              "tglRujukan": this.item.tglKunjungan,
              "noRujukan": this.item.noKunjungan,
              "ppkRujukan": this.item.provPerujuk.kode
            },
            "catatan": "",
            "diagAwal": this.item.diagnosa.kode,
            "poli": {
              "tujuan": poliTujuan,
              "eksekutif": "0"
            },
            "cob": {
              "cob": "0"
            },
            "katarak": {
              "katarak": "0"
            },
            "jaminan": {
              "lakaLantas": "0",
              "penjamin": {
                "penjamin": "",
                "tglKejadian": "",
                "keterangan": "",
                "suplesi": {
                  "suplesi": "0",
                  "noSepSuplesi": "",
                  "lokasiLaka": {
                    "kdPropinsi": "",
                    "kdKabupaten": "",
                    "kdKecamatan": ""
                  }
                }
              }
            },
            "tujuanKunj": this.tujuanKunj,
            "flagProcedure": this.flagProcedure,
            "kdPenunjang": this.kdPenunjang,
            "assesmentPel": this.assesmentPel,
            "skdp": {
              "noSurat": this.noSKDP,
              "kodeDPJP": this.formGroup.get("dokterDPJP").value != '' ? this.formGroup.get("dokterDPJP").value.kode : "",
            },
            "dpjpLayan": this.formGroup.get("dokterDPJPMelayani").value != '' ? this.formGroup.get("dokterDPJPMelayani").value.kode : "",
            "noTelp": this.item.peserta.mr.noTelepon,
            "user": "transmedic"
          }
        }
      }
    };
    this.httpService.post("medifirst2000/bridging/bpjs2/insert-sep-v2", dataSend).subscribe(e => {
      // if (e.response.sep != null) {
      if (e.metaData.code == "200") {
        this.dataSEP.nosep = e.response.sep.noSep
        this.dataSEP.tglSep = e.response.sep.tglSep

        this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + e.response.sep.noSep);
        this.savePasienDatfatar();

      } else {
        this.showCetaks = false
        this.alertService.error('Gagal Generate SEP', e.metaData.message);
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

    }, function (err) {

    });
  }
  public getJSON(jenis): Observable<any> {
    return this.service.get("assets/jsonbridging/bpjs2/" + jenis + ".json")
      .map(response => response.json())
      .catch(e => { console.log(e); return Observable.throw(e); })

  }

  insertTempBrigding() {
    this.getJSON('sep').subscribe(e => {
      let res = e.response
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        if (element.sep.peserta.noKartu == this.formGroup.get('noRujukan').value) {
          this.dataSEP.nosep = element.sep.noSep
          this.dataSEP.tglSep = element.sep.tglSep
          this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + element.sep.noSep);
          this.showCetak = true
          this.savePasienDatfatar();
          break
        }
      }
    });
  }

  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }

  savePasienDatfatar() {
    if (this.pasien.nocmfk == undefined) {
      var stt = ""
      if (confirm('NoRM Pasien belum tersimpan di BPJS, sialhkan ambil antrian')) {
        // Save it!
        stt = 'true';
        return;
      } else {
        // Do nothing!
        stt = 'false'
        return;
      }
      return;
      // this.savePasien()
    } else {
      this.savePasienDaftarFix()
    }

  }
  savePasienDaftarFix() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.pasien.nocmfk,
      'objectruanganfk': this.formGroup.get('poliTujuan').value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.objectdepartemenfk, //this.pasienDaftar.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': 2,//umum
      'objectrekananfk': 581367,
      'tipelayanan': 1,//reguler
      'objectpegawaifk': null,
      'noregistrasi': '',
      'norec_pd': '',
      'israwatinap': 'false',
      'statusschedule': this.noReservasi != undefined ? this.noReservasi : 'Kios-K',
      'statustitipan': false,
      'istelemedicine': 'false',
      'jaminankhusus': '',
      'catatan': null,
      'objectruanganasalfk': this.formGroup.get('poliTujuan').value.kodeinternal,
      'statuspasien': 'LAMA',
      'objectkasuspenyakitlastfk': '1',
      'sensus': null
    }
    var antrianpasiendiperiksa = {
      'norec_apd': '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.formGroup.get('poliTujuan').value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': null,
      'objectkamarfk': null,
      'nobed': null,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.objectdepartemenfk, //this.pasienDaftar.objectdepartemenfk,
      'objectasalrujukanfk': 2,//Datang Sendiri
      'israwatgabung': 0,
    }
    var objSave = {
      'pasiendaftar': pasiendaftar,
      'antrianpasiendiperiksa': antrianpasiendiperiksa
    }

    this.httpService.post('medifirst2000/registrasi/save-registrasipasien', objSave).subscribe(response => {
      this.pasienDaftar.noregistrasi = response.dataPD.noregistrasi
      this.pasienDaftar.norec_pd = response.dataPD.norec
      this.pasienDaftar.tglregistrasi = response.dataPD.tglregistrasi
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Self Registration No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.simpanPemakaianAsuransi()
      this.updateStatusConfirm()
      this.saveBiayaKarcis(response.dataPD.noregistrasi, response.dataAPD.norec)
    }, error => {

    })
  }

  saveBiayaKarcis(noregistrasi, norec_apd) {
    var json = {
      'noregistrasi': noregistrasi,
      'jenispasien': '2',
      'idruangan': this.formGroup.get('poliTujuan').value.kodeinternal,
      'norec_apd': norec_apd,
      'idpegawai': null,
      'isDaftarKeDua': false
    }
    this.httpService.post('medifirst2000/registrasi/save-biaya-karcis', json).subscribe(e => {
    })
  }

  updateStatusConfirm() {
    let data = {
      "noreservasi": this.noReservasi,
    }
    this.httpService.post('medifirst2000/reservasionline/update-data-status-reservasi', data).subscribe(e => {

    })
  }
  savePasien() {
    var postJson = {
      'isbayi': false,
      'isPenunjang': false,
      'idpasien': '',
      'pasien': {
        'namaPasien': this.item.peserta.nama,
        'noIdentitas': this.item.peserta.nik,
        'namaSuamiIstri': null,
        'noAsuransiLain': null,
        'noBpjs': this.item.peserta.noKartu,
        'noHp': this.item.peserta.mr.noTelepon,
        'tempatLahir': '',
        'namaKeluarga': null,
        'tglLahir': this.item.peserta.tglLahir
      },
      'agama': {
        'id': null,
      },
      'jenisKelamin': {
        'id': this.item.peserta.sex == 'L' ? 1 : 2,
      },
      'pekerjaan': {
        'id': null,
      },
      'pendidikan': {
        'id': null,
      },
      'statusPerkawinan': {
        'id': 0,
      },
      'namaIbu': null,
      'noTelepon': this.item.peserta.mr.noTelepon,
      'noAditional': null,
      'kebangsaan': {
        'id': 1,//WNI
      },
      'negara': {
        'id': 0,
      },
      'namaAyah': null,
      'alamatLengkap': '-',
      'desaKelurahan': {
        'id': null,
        'namaDesaKelurahan': null,
      },
      'kecamatan': {
        'id': null,
        'namaKecamatan': null,
      },
      'kotaKabupaten': {
        'id': null,
        'namaKotaKabupaten': null,
      },
      'propinsi': {
        'id': null,
      },
      'kodePos': null,
    }
    this.httpService.post('medifirst2000/registrasi/save-pasien-fix', postJson)
      .subscribe(
        res => {
          let tempId = res.data.id;
          this.pasien.nocmfk = res.data.kodeexternal
          this.pasien.nocm = res.data.nocm
          this.pasien.objectjeniskelaminfk = res.data.objectjeniskelaminfk
          this.savePasienDaftarFix()
        }, error => {

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


  simpanPemakaianAsuransi() {

    let kelas: any = ""
    if (this.item.peserta.hakKelas.kode == "1")
      kelas = 3
    else if (this.item.peserta.hakKelas.kode == "2")
      kelas = 2
    else if (this.item.peserta.hakKelas.kode == "3")
      kelas = 1

    let asuransipasien = {
      'id_ap': '',
      'noregistrasi': this.pasienDaftar.noregistrasi,
      'nocm': this.pasien.nocm,
      'alamatlengkap': '',
      'objecthubunganpesertafk': 1,//Peserta
      'objectjeniskelaminfk': this.pasien.objectjeniskelaminfk,
      'kdinstitusiasal': 581367,
      'kdpenjaminpasien': 581367,
      'objectkelasdijaminfk': kelas,
      'namapeserta': this.item.peserta.nama,
      'nikinstitusiasal': 581367,
      'noasuransi': this.item.peserta.noKartu,
      'alamat': '',
      'nocmfkpasien': this.pasien.nocmfk,
      'noidentitas': this.item.peserta.nik,
      'qasuransi': 2,
      'kelompokpasien': 2,
      'tgllahir': moment(new Date(this.item.peserta.tglLahir)).format('YYYY-MM-DD'),
      'jenispeserta': this.item.peserta.jenisPeserta.keterangan,
      'kdprovider': this.item.provPerujuk.kode,
      'nmprovider': this.item.provPerujuk.nama,
      'notelpmobile': this.item.peserta.mr.noTelepon,
    }

    let pemakaianasuransi = {
      'norec_pa': '',
      'noregistrasifk': this.pasienDaftar.norec_pd,
      'tglregistrasi': moment(new Date(this.pasienDaftar.tglregistrasi)).format('YYYY-MM-DD HH:mm'),
      'diagnosisfk': this.diagnosa.id,
      'lakalantas': 0,
      'nokepesertaan': this.item.peserta.noKartu,
      'norujukan': this.item.noKunjungan,
      'nosep': this.dataSEP.nosep,
      'tglrujukan': this.item.tglKunjungan,
      'objectdiagnosafk': this.diagnosa.id,
      'tanggalsep': this.dataSEP.tglSep,
      'catatan': '',
      'lokasilaka': null,
      'penjaminlaka': null,
      'cob': false,
      'katarak': false,
      'keteranganlaka': "",
      'tglkejadian': null,
      'suplesi': false,
      'nosepsuplesi': "",
      'kdpropinsi': null,
      'namapropinsi': null,
      'kdkabupaten': null,
      'namakabupaten': null,
      'kdkecamatan': null,
      'namakecamatan': null,
      'nosuratskdp': "",
      'kodedpjp': this.formGroup.get('dokterDPJP').value.kode,
      'namadpjp': this.formGroup.get('dokterDPJP').value.nama,
      'prolanisprb': null,
      'kodedpjpmelayani': this.formGroup.get('dokterDPJPMelayani').value.kode,
      'namadjpjpmelayanni': this.formGroup.get('dokterDPJPMelayani').value.nama,
      'polirujukankode': this.formGroup.get('poliTujuan').value.kode,
      'polirujukannama': this.formGroup.get('poliTujuan').value.nama,
    }
    var objSave = {
      'asuransipasien': asuransipasien,
      'pemakaianasuransi': pemakaianasuransi
    }
    this.httpService.post('medifirst2000/registrasi/save-asuransipasien', objSave).subscribe(e => {
      this.showCetak = true
      this.isSuksesSEP = true
    })
  }
  cetakSep() {
    this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + this.pasienDaftar.noregistrasi + '&view=false').subscribe(e => {
      // do something with response
    });
  }
  getPasienByNoCM1(nocm) {
    this.httpService.get('medifirst2000/reservasionline/get-pasien-kiosk/' + nocm + '/null').subscribe(e => {
      if (e.status == 400) {
        var stt = ""
        if (confirm(e.message)) {
          // Save it!
          stt = 'true';
        } else {
          // Do nothing!
          stt = 'false'
          //return
        }
      } else {
        if (e.data.length > 0) {
          this.formGroup.get('noRujukan').setValue(e.data[0].nobpjs)
          this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
        } else {
          var stt = ""
          if (confirm('Data Pasien Tidak Di Temukan')) {
            // Save it!
            stt = 'true';
          } else {
            // Do nothing!
            stt = 'false'
            //return
          }
        }
      }
    })
  }
  cetakAntrian() {
    let petugas = '-'

    this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
      + this.pasienDaftar.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => {
        // do something with response
      });
  }





  //jQUERY

}
