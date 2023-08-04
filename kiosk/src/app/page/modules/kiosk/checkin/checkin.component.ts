import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, CacheService, AlertService, Configuration } from 'src/app/helper';
import { Http } from '@angular/http';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';

import { Observable } from 'rxjs';
interface selecthafis{
    jadwal: string,
    kodepoli: string,
    namapoli:string,
    kodedokter: string,
}
@Component({
  selector: "app-checkin",
  templateUrl: "./checkin.component.html",
  styleUrls: ["./checkin.component.scss"],
})
export class CheckinComponent implements OnInit {
  url: any;
  sub: any;
  jampraktek: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false;
  item: any = {};
  item2: any = {};
  dataCache: any;
  listDokter: SelectItem[];
  listDokterhafis: selecthafis[];
  listDokterTemp: SelectItem[];
  listDokterMelayani: SelectItem[];
  listRujukan: SelectItem[];
  listHistori: any[];
  pasien: any = {};
  ppkPelayananRS: any = "0119R004";
  showCetaks: boolean = false;
  showrujukan: boolean = true;
  showcekin: boolean = false;
  buttons: SelectItem[];
  isKunjunganPertamaBPJS: boolean = true;

  item1: any = {};
  noPascaRanap: any;
  listPoliTemp: any = [];
  diagnosa: any = {};
  showPasca: boolean = true;
  dataSEP: any = {};
  showTujuanKunj: boolean = false;
  showPilihan: boolean = false;
  showFlag: boolean = false;
  showassesmentPel: boolean = false;
  showakdPenunjang: boolean = false;
  tujuanKunj: any = "";
  flagProcedure: any = "";
  kdPenunjang: any = "";
  assesmentPel: any = "";

  idhafis: any = "";
  kdinternal: any = "";
  jeniskunjungan : any = 3;
  test: any = "PILIH DOKTER";
  noSKDP: any;
  isCekSuratKontrol: boolean = false;
  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpClient,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService,
    private service: Http
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      noReservasi: new FormControl(""),
    });
    this.sub = this.route.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.url = params["page"];
    });
    let noreservasi = this.cacheHelper.get("cacheAutoNoReservasi");
    if (noreservasi != undefined) {
      this.formGroup.get("noReservasi").setValue(noreservasi);
      this.getInfoByNoReservasi();
      this.cacheHelper.set("cacheAutoNoReservasi", undefined);
    }
  }
  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(diff); //Math.abs(Math.round(diff));
  }
  setradio(e: string): void {
    this.formGroup.get("rumahSakit").setValue("");
    this.formGroup.get("pascaRanap").setValue("");
    this.formGroup.get("pCare").setValue("Option 1");
   
    // this.getNoRujukan()
  }
  setradio2(e: string): void {
    this.formGroup.get("pCare").setValue("");
    this.formGroup.get("pascaRanap").setValue("");
    this.formGroup.get("rumahSakit").setValue("Option 2");
 
    // this.getNoRujukan()
  }
  setradio3(e: string): void {
    this.formGroup.get("pCare").setValue("");
    this.formGroup.get("rumahSakit").setValue("");
    this.formGroup.get("pascaRanap").setValue("Option 3");
    
    // this.getNoRujukan()
  }
  getInfoByNoReservasi() {
    this.httpservice
      .get(
        "medifirst2000/reservasionline/get-history?noReservasi=" +
          this.formGroup.get("noReservasi").value
      )
      .subscribe(
        (e) => {
          if (e.data.length > 0) {
            let result = e.data[0];
            let now = new Date(); // new Date(new Date(tglRes).setHours(new Date(tglRes).getHours() - 1))
            let tglResDate = new Date(result.tanggalreservasi);
            var hours = this.diff_hours(tglResDate, now);
            // if (hours > 6 ) {
            //   this.alertService.error('Info', 'Check-In hanya bisa dilakukan ENAM Jam sebelum jam reservasi')
            //   return
            // }
            // if (new Date() > new Date(result.tanggalreservasi)) {
            //   this.alertService.error('Info', 'Batas Waktu Check-In anda melebihi batas yang ditentukan')
            //   return
            // }

            if (result.tgllahir == null) result.tgllahir = "-";
            else
              result.tgllahir = moment(new Date(result.tgllahir)).format(
                "YYYY-MM-DD"
              );
            if (result.tempatlahir == null) result.tempatlahir = "-";
            if (result.alamatlengkap == null) result.alamatlengkap = "-";
            if (result.notelepon == null || result.notelepon == "")
              result.notelepon = "-";
            result.tanggalreservasi = moment(
              new Date(result.tanggalreservasi)
            ).format("YYYY-MM-DD HH:mm");
            this.isInfoPasien = true;
            this.idhafis = result.idhafis;
            this.kdinternal = result.kdinternal;
            this.item = result;
            debugger;
               this.getjadwalhafis();
            if (this.item.type == "BARU") {
              this.showrujukan = false;
              this.isInfoPasien = false;
              this.alertService.info("Checkin Hanya Untuk Pasien Lama", "Info");
              this.item = {};
              return;
            }
            this.formGroup = this.fb.group({
              noRujukan: new FormControl(""),
              dokterDPJP: new FormControl(""),
              multiRujukan: new FormControl(""),
              pCare: new FormControl(""),
              rumahSakit: new FormControl(""),
              poliTujuan: new FormControl(""),
              pascaRanap: new FormControl(""),
              dokterDPJPMelayani: new FormControl(""),
              noReservasi: new FormControl(""),
            });
            this.httpservice
              .get(
                "medifirst2000/reservasionline/cek-pemakaianasuransi?norecpd=" +
                  result.norecpd
              )
              .subscribe((e) => {
                if (e.data.length > 0) {
                  this.alertService.info("Pasien Sudah Cekin", "Info");
                  this.showcekin = false;
                  this.showrujukan = false;
                  this.showCetaks = true;
                  this.cetakSep();
                } else {
                  this.showcekin = false;
                  this.showrujukan = true;
                }
              });
            this.getPasienByNoCM(this.item.nocm);
          } else {
            this.isInfoPasien = false;
            this.alertService.error("Info", "Data tidak ditemukan");
          }
        },
        (error) => {
          this.isInfoPasien = false;
          this.alertService.error("Info", "Data tidak ditemukan");
        }
      );
  }

  getPasienByNoCM(nocm) {
    this.httpservice
      .get(
        "medifirst2000/reservasionline/get-pasien-kioskcekin/" + nocm + "/null"
      )
      .subscribe((e) => {
        if (e.data.length > 0) {
          this.pasien = e.data[0];
          if (this.pasien.nocm == "0") {
            let dataSend = {
              idpasien: this.pasien.nocmfk,
            };
          } else {
            this.item.peserta.mr.noMR = this.pasien.nocm;
          }
        } else {
        }
      });
  }

  cekPesertaByNoKartu(noKa) {
    debugger;
    let jenis = "rs";
    if (this.formGroup.get("pCare").value != "") {
      jenis = "pcare";
    }

    if (this.formGroup.get("pascaRanap").value != "") {
      this.showPasca = false;
      this.httpservice
        .get(
          "medifirst2000/bridging/bpjs2/get-no-peserta?nokartu=" +
            noKa +
            "&tglsep=" +
            moment(new Date()).format("YYYY-MM-DD")
        )
        .subscribe(
          (e) => {
            if (e.metaData.code === "200") {
              this.item1 = e.response.peserta;
              this.getHistoriPelayananPesesta1(e.response.peserta.noKartu);
              // if (e.response.peserta.mr.noMR != null) {
              //   if (e.response.peserta.mr.noMR.length == 1) {
              //     e.response.peserta.mr.noMR = "000000" + e.response.peserta.mr.noMR
              //   } else if (e.response.peserta.mr.noMR.length == 2) {
              //     e.response.peserta.mr.noMR = "00000" + e.response.peserta.mr.noMR
              //   } else if (e.response.peserta.mr.noMR.length == 3) {
              //     e.response.peserta.mr.noMR = "0000" + e.response.peserta.mr.noMR
              //   } else if (e.response.peserta.mr.noMR.length == 4) {
              //     e.response.peserta.mr.noMR = "000" + e.response.peserta.mr.noMR
              //   } else if (e.response.peserta.mr.noMR.length == 5) {
              //     e.response.peserta.mr.noMR = "00" + e.response.peserta.mr.noMR
              //   } else if (e.response.peserta.mr.noMR.length == 6) {
              //     e.response.peserta.mr.noMR = "0" + e.response.peserta.mr.noMR
              //   }
              // }

              this.getDiagnosaByKode("Z09.8");

              // this.getMultiRujukan(e.response.peserta.noKartu)
              // end Histori
              this.isInfoPasien = true;
              // this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
              if (e.response.peserta.statusPeserta.kode == 6) {
                this.isInfoPasien = false;
                this.alertService.error(
                  "SILAHKAN MENGAMBIL NO ANTRIAN",
                  e.response.peserta.statusPeserta.keterangan
                );
                var stt = "";
                if (confirm(e.response.peserta.statusPeserta.keterangan)) {
                  // Save it!
                  stt = "true";
                } else {
                  // Do nothing!
                  stt = "false";
                  //return
                }
              }
            } else {
              this.isInfoPasien = false;
              // this.alertService.error('Error', e.metaData.message);
              this.alertService.error(
                "SILAHKAN MENGAMBIL NO ANTRIAN",
                e.metaData.message
              );
              var stt = "";
              if (confirm(e.metaData.message)) {
                // Save it!
                stt = "true";
              } else {
                // Do nothing!
                stt = "false";
                //return
              }
            }
          },
          (error) => {
            this.isInfoPasien = false;
            this.alertService.error("SILAHKAN MENGAMBIL NO ANTRIAN", error);
            var stt = "";
            if (confirm(error)) {
              // Save it!
              stt = "true";
            } else {
              // Do nothing!
              stt = "false";
              //return
            }
          }
        );
    } else {
      this.httpservice
        .get(
          "medifirst2000/bridging/bpjs2/get-rujukan-" +
            jenis +
            "-nokartu?nokartu=" +
            noKa
        )
        .subscribe(
          (e) => {
            if (e.metaData.code === "200") {
              this.item2 = e.response.rujukan;
              // if (e.response.rujukan.peserta.mr.noMR != null) {
              //   if (e.response.rujukan.peserta.mr.noMR.length == 1) {
              //     e.response.rujukan.peserta.mr.noMR = "000000" + e.response.rujukan.peserta.mr.noMR
              //   } else if (e.response.rujukan.peserta.mr.noMR.length == 2) {
              //     e.response.rujukan.peserta.mr.noMR = "00000" + e.response.rujukan.peserta.mr.noMR
              //   } else if (e.response.rujukan.peserta.mr.noMR.length == 3) {
              //     e.response.rujukan.peserta.mr.noMR = "0000" + e.response.rujukan.peserta.mr.noMR
              //   } else if (e.response.rujukan.peserta.mr.noMR.length == 4) {
              //     e.response.rujukan.peserta.mr.noMR = "000" + e.response.rujukan.peserta.mr.noMR
              //   } else if (e.response.rujukan.peserta.mr.noMR.length == 5) {
              //     e.response.rujukan.peserta.mr.noMR = "00" + e.response.rujukan.peserta.mr.noMR
              //   } else if (e.response.rujukan.peserta.mr.noMR.length == 6) {
              //     e.response.rujukan.peserta.mr.noMR = "0" + e.response.rujukan.peserta.mr.noMR
              //   }
              // }
              // for (var i = this.listPoliTemp.length - 1; i >= 0; i--) {
              //   if (this.listPoliTemp[i].kditernal == this.item.poliRujukan.kode) {
              //     this.getRuanganInternal(this.item.poliRujukan.kode)
              //     break
              //   } else {
              //     this.getRuanganInternal(this.item.poliRujukan.kode)
              //     break
              //   }
              // }

              this.getDiagnosaByKode(this.item2.diagnosa.kode);
              // get Dokter DPJP By Histori
              this.getHistoriPelayananPesesta(
                e.response.rujukan.peserta.noKartu
              );
              // this.getMultiRujukan(e.response.rujukan.peserta.noKartu)
              // end Histori
              this.isInfoPasien = true;
              this.alertService.info(
                "Status Peserta",
                e.response.rujukan.peserta.statusPeserta.keterangan
              );
              if (e.response.rujukan.peserta.statusPeserta.kode == 6) {
                this.isInfoPasien = false;
                this.alertService.error(
                  "SILAHKAN MENGAMBIL NO ANTRIAN",
                  e.response.rujukan.peserta.statusPeserta.keterangan
                );
                var stt = "";
                if (
                  confirm(e.response.rujukan.peserta.statusPeserta.keterangan)
                ) {
                  // Save it!
                  stt = "true";
                } else {
                  // Do nothing!
                  stt = "false";
                  //return
                }
              }
            } else {
              this.showrujukan = true;
              // this.isInfoPasien = false
              this.alertService.error(
                "SILAHKAN MENGAMBIL NO ANTRIAN",
                e.metaData.message
              );
              var stt = "";
              if (confirm(e.metaData.message)) {
                // Save it!
                stt = "true";
              } else {
                // Do nothing!
                stt = "false";
                //return
              }
            }
          },
          (error) => {
            this.showrujukan = true;
            // this.isInfoPasien = false
            this.alertService.error("SILAHKAN MENGAMBIL NO ANTRIAN", error);
            var stt = "";
            if (confirm(error)) {
              // Save it!
              stt = "true";
            } else {
              // Do nothing!
              stt = "false";
              //return
            }
          }
        );
    }
  }
  getDiagnosaByKode(kode) {
    this.httpservice
      .get("medifirst2000/kiosk/get-diagnosabykode/" + kode)
      .subscribe((res) => {
        this.diagnosa = res.data;
      });
  }

  getHistoriPelayananPesesta1(noKartu) {
    this.isKunjunganPertamaBPJS = false;
    this.httpservice
      .get(
        "medifirst2000/bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" +
          noKartu
      )
      .subscribe((data) => {
        if (data.metaData.code == 200) {
          this.listHistori = data.response.histori;
          if (this.listHistori.length > 0) {
            for (let i in this.listHistori) {
              if (this.listHistori[i].jnsPelayanan == "1") {
                this.noPascaRanap = this.listHistori[i].noSep;
                var a = {
                  nama: "RSUD SUMEDANG",
                  kode: this.ppkPelayananRS,
                };
                var b = {
                  kode: "Z09.8",
                };
                var c = {
                  kode: "2",
                };
                var d = {
                  kode: "Pasca",
                  nama: "Pasca Ranap",
                };
                this.item2 = {
                  noKunjungan: this.noPascaRanap,
                  peserta: this.item1,
                  tglKunjungan: moment(new Date()).format("YYYY-MM-DD"),
                  provPerujuk: a,
                  diagnosa: b,
                  pelayanan: c,
                  poliRujukan: d,
                };
                this.httpservice
                  .get(
                    "medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" +
                      1 +
                      "&tglPelayanan=" +
                      moment(new Date()).format("YYYY-MM-DD") +
                      "&kodeSpesialis=" +
                      ""
                  )
                  .subscribe((data) => {
                    if (data.metaData.code == 200) {
                      this.listDokter = [];
                      // this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                      data.response.list.forEach((response) => {
                        this.listDokter.push({
                          label: response.nama,
                          value: {
                            kode: response.kode,
                            nama: response.nama,
                          },
                        });
                      });
                      this.formGroup
                        .get("dokterDPJP")
                        .setValue({
                          kode: this.listDokter[0].value.kode,
                          nama: this.listDokter[0].value.nama,
                        });
                      this.listDokterMelayani = [];
                      this.buttons = [];
                      this.listDokterMelayani.push({
                        label: "-- Dokter Melayani --",
                        value: null,
                      });
                      data.response.list.forEach((response) => {
                        this.listDokterMelayani.push({
                          label: response.nama,
                          value: {
                            kode: response.kode,
                            nama: response.nama,
                          },
                        });
                        this.buttons.push({
                          label: response.nama,
                          value: {
                            kode: response.kode,
                            nama: response.nama,
                          },
                        });
                      });
                    }
                  });
                let noSepTerakhir = "";
                let updateSurkon = "";
                let updateSurkonDokter = "";
                let updateSurkonKodePoli = "";
                this.httpservice
                  .get(
                    "medifirst2000/bridging/bpjs2/listsuratkontrol-duabulan/NoKartu/" +
                      this.item2.peserta.noKartu
                  )
                  .subscribe((data) => {
                    for (let i = 0; i < data.response.list.length; i++) {
                      if (
                        data.response.list[i].terbitSEP == "Belum" &&
                        data.response.list[i].jnsKontrol == "2" &&
                        data.response.list[i].jnsPelayanan == "Rawat Inap"
                      ) {
                        if (
                          moment(new Date()).format("YYYY-MM-DD") ==
                          data.response.list[i].tglRencanaKontrol
                        ) {
                          this.isCekSuratKontrol = true;
                          this.noSKDP = data.response.list[i].noSuratKontrol;
                          break;
                        } else {
                          debugger;
                          updateSurkon = "true";
                          this.noSKDP = data.response.list[i].noSuratKontrol;
                          updateSurkonDokter = data.response.list[i].kodeDokter;
                          updateSurkonKodePoli =
                            data.response.list[i].poliTujuan;
                          noSepTerakhir =
                            data.response.list[i].noSepAsalKontrol;
                        }
                      }
                    }
                    if (this.isCekSuratKontrol == true) {
                      this.httpservice
                        .get(
                          "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                            this.noSKDP
                        )
                        .subscribe((data) => {
                          if (data.metaData.code == 200) {
                            this.test = data.response.namaDokter;
                            this.formGroup.get("dokterDPJPMelayani").setValue({
                              kode: data.response.kodeDokter,
                              nama: data.response.namaDokter,
                            });
                            this.formGroup.get("dokterDPJP").setValue({
                              kode: data.response.namaDokter,
                              nama: data.response.namaDokter,
                            });
                            // this.getRuanganInternal(data.response.poliTujuan)
                            this.showPasca = true;
                          }
                        });
                    } else if (updateSurkon == "true") {
                      let dataSend = {
                        data: {
                          request: {
                            noSuratKontrol: this.noSKDP,
                            noSEP: noSepTerakhir,
                            kodeDokter: updateSurkonDokter,
                            poliKontrol: updateSurkonKodePoli,
                            tglRencanaKontrol: moment(new Date()).format(
                              "YYYY-MM-DD"
                            ),
                            user: "trans",
                          },
                        },
                      };
                      this.httpservice
                        .update(
                          "medifirst2000/bridging/bpjs2/update-rencana-kontrol-v2",
                          dataSend
                        )
                        .subscribe((e) => {
                          if (e.metaData.code == 200) {
                            this.httpservice
                              .get(
                                "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                                  this.noSKDP
                              )
                              .subscribe((data) => {
                                if (data.metaData.code == 200) {
                                  this.test = data.response.namaDokter;
                                  this.formGroup
                                    .get("dokterDPJPMelayani")
                                    .setValue({
                                      kode: data.response.kodeDokter,
                                      nama: data.response.namaDokter,
                                    });
                                  this.formGroup.get("dokterDPJP").setValue({
                                    kode: data.response.kodeDokterPembuat,
                                    nama: data.response.namaDokterPembuat,
                                  });
                                  // this.getRuanganInternal(data.response.poliTujuan)
                                  this.showPasca = true;
                                }
                              });
                          } else {
                            alert(e.metaData.message);
                            this.showcekin = false;
                            this.showrujukan = true;
                          }
                          this.showcekin = true;
                        });
                    } else {
                      this.noSKDP = "";
                      this.alertService.info(
                        "Nomor Rujukan " +
                          this.item.noKunjungan +
                          " Tidak Mempunyai Surat Kontrol",
                        "Info"
                      );
                      this.showrujukan = true;
                    }
                  });
              }
            }
          }
        }
      });
  }
  cetakBukti() {
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran-online=1&norec='
    //   + this.item.noregistrasi + '&view=false'
    //   + '&noReservasi=' + this.item.noreservasi).subscribe(response => {
    //     // do something with response
    //   });
    window.open(
      Configuration.get().apiBackend +
        "medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi=" +
        this.item.noregistrasi +
        "&kdprofile=1",
      "_blank"
    );
  }
  checkIn(x) {
    if (this.item.type == "BARU") {
      // this.savePasienPerjanjian()
      this.alertService.info("Checkin Hanya Untuk Pasien Lama", "Info");
    }
    if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
      //ini dimatiin request bang jho di sumedang langsung cetak sep karena pas registrasi online sudah terdaftar di ruangan
      // this.cacheHelper.set('cacheOnlineBPJS', this.item)
      // this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: 'BPJS' } })
      if (x == 1) {
        this.formGroup.get("rumahSakit").setValue("");
        this.formGroup.get("pascaRanap").setValue("");
        this.formGroup.get("pCare").setValue("Option 1");
        this.jeniskunjungan = 1
      } else if (x == 2) {
        this.formGroup.get("pCare").setValue("");
        this.formGroup.get("pascaRanap").setValue("");
        this.formGroup.get("rumahSakit").setValue("Option 2");
        this.jeniskunjungan = 4;
      } else if (x == 3) {
        this.formGroup.get("pCare").setValue("");
        this.formGroup.get("rumahSakit").setValue("");
        this.formGroup.get("pascaRanap").setValue("Option 3");
        this.jeniskunjungan = 3;
      }
      this.cekPesertaByNoKartu(this.item.nobpjs);
      // this.getHistoriPelayananPesesta(this.item.nobpjs);
      this.showcekin = false;
      this.showrujukan = false;
    } else {
      // this.savePasienDaftar()
      this.alertService.info("Checkin Hanya Untuk Pasien BPJS", "Info");
    }
  }
  checkInfix() {
    this.createAntrol();
    this.cekKondisi();
  }
  getHistoriPelayananPesesta(noKartu) {
    // debugger
    let jenisPel = "";
    let kdSpesialis = "";
    let noSepTerakhir = "";
    let updateSurkon = "";
    let updateSurkonDokter = "";
    let updateSurkonKodePoli = "";
    this.httpservice
      .get(
        "medifirst2000/bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" +
          noKartu
      )
      .subscribe((data) => {
        if (data.metaData.code == 200) {
          this.listHistori = data.response.histori;
          this.item.noKunjungan = this.item.norujukan;
          if (this.listHistori.length > 0) {
            for (let i = 0; i < this.listHistori.length; i++) {
              if (this.item.noKunjungan == this.listHistori[i].noRujukan) {
                this.isKunjunganPertamaBPJS = false;
                noSepTerakhir = this.listHistori[i].noSep;
                break;
              }
            }
            if (this.isKunjunganPertamaBPJS == true) {
              this.alertService.info(
                "Kunjungan Pertama Dengan Nomor Rujukan " +
                  this.item.noKunjungan,
                "Info"
              );
            } else {
              this.httpservice
                .get(
                  "medifirst2000/bridging/bpjs2/listsuratkontrol-duabulan/NoKartu/" +
                    noKartu
                )
                .subscribe((data) => {
                  if (data.metaData.code == "200") {
                    for (let i = 0; i < data.response.list.length; i++) {
                      if (
                        data.response.list[i].terbitSEP == "Belum" &&
                        data.response.list[i].jnsKontrol == "2" &&
                        data.response.list[i].jnsPelayanan == "Rawat Jalan"
                      ) {
                        if (
                          moment(new Date()).format("YYYY-MM-DD") ==
                          data.response.list[i].tglRencanaKontrol
                        ) {
                          this.isCekSuratKontrol = true;
                          this.noSKDP = data.response.list[i].noSuratKontrol;
                          break;
                        } else {
                          debugger;
                          updateSurkon = "true";
                          this.noSKDP = data.response.list[i].noSuratKontrol;
                          updateSurkonDokter = data.response.list[i].kodeDokter;
                          updateSurkonKodePoli =
                            data.response.list[i].poliTujuan;
                          noSepTerakhir =
                            data.response.list[i].noSepAsalKontrol;
                        }
                      }
                    }
                    if (this.isCekSuratKontrol == true) {
                      this.httpservice
                        .get(
                          "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                            this.noSKDP
                        )
                        .subscribe((data) => {
                          this.showcekin = true;
                          if (data.metaData.code == 200) {
                            debugger;
                            for (let i = 0; i < this.listDokter.length; i++) {
                              if (this.listDokter[i].value != null) {
                                if (
                                  this.listDokter[i].value.kode ==
                                  data.response.kodeDokter
                                ) {
                                  this.formGroup
                                    .get("dokterDPJPMelayani")
                                    .setValue({
                                      kode: data.response.kodeDokter,
                                      nama: data.response.namaDokter,
                                      jadwal: this.listDokter[i].value.jadwal,
                                      id: this.listDokter[i].value.id,
                                      namahafis:
                                        this.listDokter[i].value.namahafis,
                                    });
                                  this.formGroup.get("dokterDPJP").setValue({
                                    kode: data.response.kodeDokter,
                                    nama: data.response.namaDokter,
                                    jadwal: this.listDokter[i].value.jadwal,
                                    id: this.listDokter[i].value.id,
                                    namahafis:
                                      this.listDokter[i].value.namahafis,
                                  });
                                  this.test = data.response.namaDokter;
                                }
                              }
                            }
                          }
                        });
                    } else if (updateSurkon == "true") {
                      let dataSend = {
                        data: {
                          request: {
                            noSuratKontrol: this.noSKDP,
                            noSEP: noSepTerakhir,
                            kodeDokter: updateSurkonDokter,
                            poliKontrol: updateSurkonKodePoli,
                            tglRencanaKontrol: moment(new Date()).format(
                              "YYYY-MM-DD"
                            ),
                            user: "trans",
                          },
                        },
                      };
                      this.httpservice
                        .update(
                          "medifirst2000/bridging/bpjs2/update-rencana-kontrol-v2",
                          dataSend
                        )
                        .subscribe((e) => {
                          if (e.metaData.code == 200) {
                            this.httpservice
                              .get(
                                "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                                  this.noSKDP
                              )
                              .subscribe((data) => {
                                this.showcekin = true;
                                if (data.metaData.code == 200) {
                                  debugger;
                                  for (
                                    let i = 0;
                                    i < this.listDokter.length;
                                    i++
                                  ) {
                                    if (this.listDokter[i].value != null) {
                                      if (
                                        this.listDokter[i].value.kode ==
                                        data.response.kodeDokter
                                      ) {
                                        this.formGroup
                                          .get("dokterDPJPMelayani")
                                          .setValue({
                                            kode: data.response.kodeDokter,
                                            nama: data.response.namaDokter,
                                            jadwal:
                                              this.listDokter[i].value.jadwal,
                                            id: this.listDokter[i].value.id,
                                          });
                                        this.formGroup
                                          .get("dokterDPJP")
                                          .setValue({
                                            kode: data.response.kodeDokter,
                                            nama: data.response.namaDokter,
                                            jadwal:
                                              this.listDokter[i].value.jadwal,
                                            id: this.listDokter[i].value.id,
                                          });
                                        this.test = data.response.namaDokter;
                                      }
                                    }
                                  }
                                }
                              });
                          } else {
                            alert(e.metaData.message);
                            this.showcekin = false;
                            this.showrujukan = true;
                          }
                        });
                    } else {
                      this.httpservice
                        .get(
                          "medifirst2000/bridging/bpjs2/cek-sep?nosep=" +
                            noSepTerakhir
                        )
                        .subscribe((data) => {
                          this.showcekin = true;
                          if (data.metaData.code == 200) {
                            let dataSend = {
                              data: {
                                request: {
                                  noSEP: noSepTerakhir,
                                  kodeDokter: this.idhafis,
                                  poliKontrol: this.kdinternal,
                                  tglRencanaKontrol: moment(new Date()).format(
                                    "YYYY-MM-DD"
                                  ),
                                  user: "trans",
                                },
                              },
                            };
                            this.httpservice
                              .post(
                                "medifirst2000/bridging/bpjs2/insert-rencana-kontrol-v2",
                                dataSend
                              )
                              .subscribe((e) => {
                                this.showcekin = true;
                                if (e.metaData.code == 200) {
                                  this.noSKDP = e.response.noSuratKontrol;
                                  this.httpservice
                                    .get(
                                      "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                                        e.response.noSuratKontrol
                                    )
                                    .subscribe((data) => {
                                      if (data.metaData.code == 200) {
                                        for (
                                          let i = 0;
                                          i < this.listDokter.length;
                                          i++
                                        ) {
                                          if (
                                            this.listDokter[i].value != null
                                          ) {
                                            if (
                                              this.listDokter[i].value.kode ==
                                              data.response.kodeDokter
                                            ) {
                                              this.formGroup
                                                .get("dokterDPJPMelayani")
                                                .setValue({
                                                  kode: data.response
                                                    .kodeDokter,
                                                  nama: data.response
                                                    .namaDokter,
                                                  jadwal:
                                                    this.listDokter[i].value
                                                      .jadwal,
                                                  id: this.listDokter[i].value
                                                    .id,
                                                });
                                              this.formGroup
                                                .get("dokterDPJP")
                                                .setValue({
                                                  kode: data.response
                                                    .kodeDokter,
                                                  nama: data.response
                                                    .namaDokter,
                                                  jadwal:
                                                    this.listDokter[i].value
                                                      .jadwal,
                                                  id: this.listDokter[i].value
                                                    .id,
                                                });
                                              this.test =
                                                data.response.namaDokter;
                                            }
                                          }
                                        }
                                      }
                                    });
                                } else {
                                  alert(e.metaData.message);
                                  this.showcekin = false;
                                  this.showrujukan = true;
                                }
                              });
                          }
                        });
                    }
                  } else {
                    this.httpservice
                      .get(
                        "medifirst2000/bridging/bpjs2/cek-sep?nosep=" +
                          noSepTerakhir
                      )
                      .subscribe((data) => {
                        if (data.metaData.code == 200) {
                          debugger;
                          let dataSend = {
                            data: {
                              request: {
                                noSEP: noSepTerakhir,
                                kodeDokter: data.response.dpjp.kdDPJP,
                                poliKontrol:
                                  this.formGroup.get("poliTujuan").value.kode,
                                tglRencanaKontrol: moment(new Date()).format(
                                  "YYYY-MM-DD"
                                ),
                                user: "trans",
                              },
                            },
                          };
                          this.httpservice
                            .post(
                              "medifirst2000/bridging/bpjs2/insert-rencana-kontrol-v2",
                              dataSend
                            )
                            .subscribe((e) => {
                              if (e.metaData.code == 200) {
                                this.noSKDP = e.response.noSuratKontrol;
                                this.httpservice
                                  .get(
                                    "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                                      e.response.noSuratKontrol
                                  )
                                  .subscribe((data) => {
                                    if (data.metaData.code == 200) {
                                      for (
                                        let i = 0;
                                        i < this.listDokter.length;
                                        i++
                                      ) {
                                        if (this.listDokter[i].value != null) {
                                          if (
                                            this.listDokter[i].value.kode ==
                                            data.response.kodeDokter
                                          ) {
                                            this.formGroup
                                              .get("dokterDPJPMelayani")
                                              .setValue({
                                                kode: data.response.kodeDokter,
                                                nama: data.response.namaDokter,
                                                jadwal:
                                                  this.listDokter[i].value
                                                    .jadwal,
                                                id: this.listDokter[i].value.id,
                                              });
                                            this.formGroup
                                              .get("dokterDPJP")
                                              .setValue({
                                                kode: data.response.kodeDokter,
                                                nama: data.response.namaDokter,
                                                id: this.listDokter[i].value.id,
                                              });
                                            this.test =
                                              data.response.namaDokter;
                                          }
                                        }
                                      }
                                    }
                                  });
                              } else {
                                alert(e.metaData.message);
                                this.showcekin = false;
                                this.showrujukan = true;
                              }
                            });
                        }
                        this.showcekin = true;
                      });
                  }
                });
            }

            jenisPel = this.listHistori[0].jnsPelayanan;
            let kodeNamaPoli = this.listHistori[0].poli.split(" ");
            if (kodeNamaPoli.length > 0)
              this.httpservice
                .get(
                  "medifirst2000/bridging/bpjs2/get-poli?kodeNamaPoli=" +
                    kodeNamaPoli[0]
                )
                .subscribe((e) => {
                  if (e.metaData.code == 200) {
                    let resPoli = e.response.poli;
                    if (resPoli.length > 0) {
                      for (let i in resPoli) {
                        if (this.listHistori[0].poli == resPoli[i].nama) {
                          kdSpesialis = resPoli[i].kode;
                          break;
                        }
                      }

                      this.httpservice
                        .get(
                          "medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" +
                            jenisPel +
                            "&tglPelayanan=" +
                            moment(new Date()).format("YYYY-MM-DD") +
                            "&kodeSpesialis=" +
                            kdSpesialis
                        )
                        .subscribe((data) => {
                          this.showcekin = true;
                          if (data.metaData.code == 200) {
                            this.listDokter = [];
                            // this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                            data.response.list.forEach((response) => {
                              this.listDokter.push({
                                label: response.nama,
                                value: {
                                  kode: response.kode,
                                  nama: response.nama,
                                },
                              });
                            });
                            this.formGroup
                              .get("dokterDPJP")
                              .setValue({
                                kode: this.item.idhafis,
                                nama: this.item.dokter,
                              });
                            this.formGroup
                              .get("dokterDPJPMelayani")
                              .setValue({
                                kode: this.item.idhafis,
                                nama: this.item.dokter,
                              });
                            // this.formGroup.get('dokterDPJP').setValue({ kode: this.listDokter[0].value.kode, nama: this.listDokter[0].value.nama })
                            // this.formGroup.get('dokterDPJPMelayani').setValue({ kode: this.listDokter[0].value.kode, nama: this.listDokter[0].value.nama })
                          } else {
                            if (
                              data.metaData.code == 201 &&
                              kdSpesialis == "HDL"
                            ) {
                              this.httpservice
                                .get(
                                  "medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" +
                                    jenisPel +
                                    "&tglPelayanan=" +
                                    moment(new Date()).format("YYYY-MM-DD") +
                                    "&kodeSpesialis=" +
                                    "INT"
                                )
                                .subscribe((data) => {
                                  if (data.metaData.code == 200) {
                                    this.listDokter = [];
                                    this.listDokter.push({
                                      label: "-- Dokter Perujuk --",
                                      value: null,
                                    });
                                    data.response.list.forEach((response) => {
                                      this.listDokter.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                    });
                                    this.listDokterMelayani = [];
                                    this.buttons = [];
                                    this.listDokterMelayani.push({
                                      label: "-- Dokter Melayani --",
                                      value: null,
                                    });
                                    data.response.list.forEach((response) => {
                                      this.listDokterMelayani.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                      this.buttons.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                    });
                                  }
                                });
                            } else if (data.metaData.code == 201) {
                              this.httpservice
                                .get(
                                  "medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" +
                                    1 +
                                    "&tglPelayanan=" +
                                    moment(new Date()).format("YYYY-MM-DD") +
                                    "&kodeSpesialis=" +
                                    "INT"
                                )
                                .subscribe((data) => {
                                  if (data.metaData.code == 200) {
                                    this.listDokter = [];
                                    this.listDokter.push({
                                      label: "-- Dokter Perujuk --",
                                      value: null,
                                    });
                                    data.response.list.forEach((response) => {
                                      this.listDokter.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                    });
                                    this.listDokterMelayani = [];
                                    this.buttons = [];
                                    this.listDokterMelayani.push({
                                      label: "-- Dokter Melayani --",
                                      value: null,
                                    });
                                    data.response.list.forEach((response) => {
                                      this.listDokterMelayani.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                      this.buttons.push({
                                        label: response.nama,
                                        value: {
                                          kode: response.kode,
                                          nama: response.nama,
                                        },
                                      });
                                    });
                                  }
                                });
                            }
                            this.listDokter = [];
                            this.listDokterMelayani = [];
                            this.buttons = [];
                            this.alertService.info(
                              "Dokter DPJP tidak ada",
                              "Info"
                            );
                          }
                        });
                    }
                  }
                });
          }
        } else {
          this.listDokter = [];
          this.listDokterMelayani = [];
          // this.listDokter.push({ label: '--Pilih Dokter --', value: null });
          this.listHistori = [];
        }
      });
  }
  savePasienPerjanjian() {
    let antrian = {
      jenis: this.item.prefixnoantrian, //"D"
    };
    this.httpservice
      .post("medifirst2000/kiosk/save-antrian", antrian)
      .subscribe(
        (response) => {
          // this.service.get('http://127.0.0.1:1237/printvb/cetak-antrian-online?cetak=1&norec=' + response.noRec
          //   + '&noReservasi=' + this.item.noreservasi).subscribe(result => {
          //     // do something with response

          //   })
          window.open(
            Configuration.get().apiBackend +
              "medifirst2000/report/cetak-antrian?norec=" +
              response.noRec +
              "&kdprofile=1",
            "_blank"
          );
          window.history.back();
        },
        (error) => {}
      );
  }
  savePasienDaftar() {
    var pasiendaftar = {
      tglregistrasi: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      tglregistrasidate: moment(new Date()).format("YYYY-MM-DD"),
      nocmfk: this.item.nocmfk,
      objectruanganfk: this.item.objectruanganfk,
      objectdepartemenfk: this.item.objectdepartemenfk,
      objectkelasfk: 6, //nonkelas
      objectkelompokpasienlastfk:
        this.item.objectkelompokpasienfk != null
          ? this.item.objectkelompokpasienfk
          : 1, //umum
      objectrekananfk: null,
      // jeniskunjungan = this.jeniskunjungan,
      tipelayanan: 1, //reguler
      objectpegawaifk: this.item.objectpegawaifk,
      noregistrasi: "",
      norec_pd: "",
      israwatinap: "false",
      statusschedule: this.item.noreservasi, // this.formGroup.get('noReservasi').value != '' ? this.formGroup.get('noReservasi').value : '',
      jaminankhusus: "",
    };
    var antrianpasiendiperiksa = {
      norec_apd: "",
      tglregistrasi: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      objectruanganfk: this.item.objectruanganfk,
      objectkelasfk: 6, //nonkelas
      objectpegawaifk: this.item.objectpegawaifk,
      objectkamarfk: null,
      nobed: null,
      objectdepartemenfk: this.item.objectdepartemenfk,
      objectasalrujukanfk: 5, //Datang Sendiri
      israwatgabung: 0,
    };
    var objSave = {
      pasiendaftar: pasiendaftar,
      antrianpasiendiperiksa: antrianpasiendiperiksa,
    };

    this.httpservice
      .post("medifirst2000/registrasi/save-registrasipasien", objSave)
      .subscribe(
        (response) => {
          this.item.noregistrasi = response.dataPD.noregistrasi;
          this.cetakBukti();
          // if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
          //   this.alertService.info('Peringatan','Pastikan SEP Di Cetak di Loket Pendaftaran !!')
          // }
          this.saveLogging(
            "Pendaftaran Pasien",
            "norec Pasien Daftar",
            response.dataPD.norec,
            "Check-In No Registrasi (" + response.dataPD.noregistrasi + ") "
          );
          this.updateStatusConfirm();
          window.history.back();
        },
        (error) => {}
      );
  }
  updateStatusConfirm() {
    let data = {
      noreservasi: this.item.noreservasi,
    };
    this.httpservice
      .post("medifirst2000/reservasionline/update-data-status-reservasi", data)
      .subscribe((e) => {});
  }
  saveLogging(jenis, referensi, noreff, ket) {
    this.httpservice
      .get(
        "medifirst2000/sysadmin/logging/save-log-all?jenislog=" +
          jenis +
          "&referensi=" +
          referensi +
          "&noreff=" +
          noreff +
          "&keterangan=" +
          ket
      )
      .subscribe((e) => {});
  }

  cekKondisi() {
    if (this.isKunjunganPertamaBPJS == true) {
      this.tujuanKunj = "0";
      this.flagProcedure = "";
      this.kdPenunjang = "";
      this.assesmentPel = "";
      this.noSKDP = "";
      this.insertLiveBridging();
    } else if (this.formGroup.get("pascaRanap").value != "") {
      if (this.noSKDP == "") {
        this.httpservice
          .get(
            "medifirst2000/bridging/bpjs2/cek-sep?nosep=" +
              this.item.noKunjungan
          )
          .subscribe((data) => {
            if (data.metaData.code == 200) {
              debugger;
              let dataSend = {
                data: {
                  request: {
                    noSEP: this.item.noKunjungan,
                    kodeDokter: this.formGroup.get("dokterDPJP").value.kode,
                    poliKontrol: this.formGroup.get("poliTujuan").value.kode,
                    tglRencanaKontrol: moment(new Date()).format("YYYY-MM-DD"),
                    user: "trans",
                  },
                },
              };
              this.httpservice
                .post(
                  "medifirst2000/bridging/bpjs2/insert-rencana-kontrol-v2",
                  dataSend
                )
                .subscribe((e) => {
                  if (e.metaData.code == 200) {
                    this.noSKDP = e.response.noSuratKontrol;
                    this.httpservice
                      .get(
                        "medifirst2000/bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" +
                          e.response.noSuratKontrol
                      )
                      .subscribe((data) => {
                        if (data.metaData.code == 200) {
                          this.test = data.response.namaDokter;
                          this.formGroup.get("dokterDPJPMelayani").setValue({
                            kode: data.response.kodeDokter,
                            nama: data.response.namaDokter,
                          });
                          this.formGroup.get("dokterDPJP").setValue({
                            kode: data.response.kodeDokterPembuat,
                            nama: data.response.namaDokterPembuat,
                          });
                          this.tujuanKunj = "0";
                          this.flagProcedure = "";
                          this.kdPenunjang = "";
                          this.assesmentPel = "";
                          this.insertLiveBridging();
                        }
                      });
                  } else {
                    alert(e.metaData.message);
                    this.showcekin = false;
                    this.showrujukan = true;
                  }
                });
            }
          });
      } else {
        this.tujuanKunj = "0";
        this.flagProcedure = "";
        this.kdPenunjang = "";
        this.assesmentPel = "";
        this.insertLiveBridging();
      }
    } else {
      // this.showPilihan = true
      // this.showTujuanKunj = true
      this.tujuanKunj = "2";
      this.assesmentPel = "5";
      this.kdPenunjang = "";
      this.flagProcedure = "";
      this.insertLiveBridging();
      // this.savePasienDatfatar()
    }
  }
  insertLiveBridging() {
     
    // if (this.pasien.nocmfk == undefined) {
    //   var stt = ""
    //   if (confirm('NoRM Pasien belum tersimpan di BPJS, sialhkan ambil antrian')) {
    //     // Save it!
    //     stt = 'true';
    //     return;
    //   } else {
    //     // Do nothing!
    //     stt = 'false'
    //     return;
    //   }
    //   return;
    //   // this.savePasien()
    // }
    // this.showCetaks = true
    let asalRujukan = "2";
    // this.formGroup.get('dokterDPJP').setValue(this.formGroup.get("dokterDPJPMelayani").value)
    if (this.formGroup.get("pCare").value != "") {
      asalRujukan = "1";
    } else if (this.formGroup.get("pascaRanap").value != "") {
      asalRujukan = "2";
      // this.formGroup.get('dokterDPJP').setValue(this.formGroup.get("dokterDPJPMelayani").value)
    }
    let poliTujuan = this.item.kdinternal;
    // if (this.formGroup.get('poliTujuan').value != '')
    // poliTujuan = this.formGroup.get('poliTujuan').value.kode

    var dataSend = {
      data: {
        request: {
          t_sep: {
            noKartu: this.item2.peserta.noKartu,
            tglSep: moment(new Date()).format("YYYY-MM-DD"),
            ppkPelayanan: this.ppkPelayananRS,
            jnsPelayanan: "2", //this.item2.pelayanan.kode,
            klsRawat: {
              klsRawatHak: this.item2.peserta.hakKelas.kode.toString(),
              klsRawatNaik: "",
              pembiayaan: "",
              penanggungJawab: "",
            },
            noMR: this.item2.peserta.mr.noMR,
            rujukan: {
              asalRujukan: asalRujukan, //RS
              tglRujukan: this.item2.tglKunjungan,
              noRujukan: this.item2.noKunjungan,
              ppkRujukan: this.item2.provPerujuk.kode,
            },
            catatan: "",
            diagAwal: this.item2.diagnosa.kode,
            poli: {
              tujuan: poliTujuan,
              eksekutif: "0",
            },
            cob: {
              cob: "0",
            },
            katarak: {
              katarak: "0",
            },
            jaminan: {
              lakaLantas: "0",
              penjamin: {
                penjamin: "",
                tglKejadian: "",
                keterangan: "",
                suplesi: {
                  suplesi: "0",
                  noSepSuplesi: "",
                  lokasiLaka: {
                    kdPropinsi: "",
                    kdKabupaten: "",
                    kdKecamatan: "",
                  },
                },
              },
            },
            tujuanKunj: this.tujuanKunj,
            flagProcedure: this.flagProcedure,
            kdPenunjang: this.kdPenunjang,
            assesmentPel: this.assesmentPel,
            skdp: {
              noSurat: this.noSKDP,
              kodeDPJP:
                this.formGroup.get("dokterDPJP").value != ""
                  ? this.formGroup.get("dokterDPJP").value.kode
                  : "",
            },
            dpjpLayan:
              this.formGroup.get("dokterDPJPMelayani").value != ""
                ? this.formGroup.get("dokterDPJPMelayani").value.kode
                : "",
            noTelp: this.item2.peserta.mr.noTelepon,
            user: "transmedic",
          },
        },
      },
    };
    this.httpservice
      .post("medifirst2000/bridging/bpjs2/insert-sep-v2", dataSend)
      .subscribe(
        (e) => {
          // if (e.response.sep != null) {
          if (e.metaData.code == "200") {
            this.showCetaks = true;
            this.showcekin = false;
            this.dataSEP.nosep = e.response.sep.noSep;
            this.dataSEP.tglSep = e.response.sep.tglSep;
            debugger;
          
            this.simpanPemakaianAsuransi();
           

            this.alertService.success(
              "Status",
              "Generate SEP Success. No SEP : " + e.response.sep.noSep
            );
            // this.savePasienDatfatar();
          } else {
            this.showCetaks = false;
            this.showrujukan = true;
            this.alertService.error("Gagal Generate SEP", e.metaData.message);
            var stt = "";
            if (confirm(e.metaData.message)) {
              // Save it!
              stt = "true";
            } else {
              // Do nothing!
              stt = "false";
              //return
            }
          }
        },
        function (err) {}
      );
  }

  public getJSON(jenis): Observable<any> {
    return this.service
      .get("assets/jsonbridging/bpjs2/" + jenis + ".json")
      .map((response) => response.json())
      .catch((e) => {
        console.log(e);
        return Observable.throw(e);
      });
  }
  goTo(name) {
    this.router.navigate(["touchscreen/" + name]);
  }
  simpanPemakaianAsuransi() {
    let kelas: any = "";
    if (this.item2.peserta.hakKelas.kode == "1") kelas = 3;
    else if (this.item2.peserta.hakKelas.kode == "2") kelas = 2;
    else if (this.item2.peserta.hakKelas.kode == "3") kelas = 1;

    let asuransipasien = {
      id_ap: "",
      noregistrasi: this.item.noregistrasi,
      nocm: this.item.nocm,
      alamatlengkap: "",
      objecthubunganpesertafk: 1, //Peserta
      objectjeniskelaminfk: this.pasien.objectjeniskelaminfk,
      kdinstitusiasal: 581367,
      kdpenjaminpasien: 581367,
      objectkelasdijaminfk: kelas,
      namapeserta: this.item2.peserta.nama,
      nikinstitusiasal: 581367,
      noasuransi: this.item2.peserta.noKartu,
      alamat: "",
      nocmfkpasien: this.pasien.nocmfk,
      noidentitas: this.item2.peserta.nik,
      qasuransi: 2,
      kelompokpasien: 2,
      tgllahir: moment(new Date(this.item2.peserta.tglLahir)).format(
        "YYYY-MM-DD"
      ),
      jenispeserta: this.item2.peserta.jenisPeserta.keterangan,
      kdprovider: this.item2.provPerujuk.kode,
      nmprovider: this.item2.provPerujuk.nama,
      notelpmobile: this.item2.peserta.mr.noTelepon,
    };

    let pemakaianasuransi = {
      norec_pa: "",
      noregistrasifk: this.item.norecpd,
      tglregistrasi: moment(new Date(this.item.tglregistrasi)).format(
        "YYYY-MM-DD HH:mm"
      ),
      diagnosisfk: this.diagnosa.id,
      lakalantas: 0,
      nokepesertaan: this.item2.peserta.noKartu,
      norujukan: this.item2.noKunjungan,
      nosep: this.dataSEP.nosep,
      tglrujukan: this.item2.tglKunjungan,
      objectdiagnosafk: this.diagnosa.id,
      tanggalsep: this.dataSEP.tglSep,
      catatan: "",
      lokasilaka: null,
      penjaminlaka: null,
      cob: false,
      katarak: false,
      keteranganlaka: "",
      tglkejadian: null,
      suplesi: false,
      nosepsuplesi: "",
      kdpropinsi: null,
      namapropinsi: null,
      kdkabupaten: null,
      namakabupaten: null,
      kdkecamatan: null,
      namakecamatan: null,
      nosuratskdp: "",
      kodedpjp: this.formGroup.get("dokterDPJP").value.kode,
      namadpjp: this.formGroup.get("dokterDPJP").value.nama,
      prolanisprb: null,
      kodedpjpmelayani: this.formGroup.get("dokterDPJPMelayani").value.kode,
      namadjpjpmelayanni: this.formGroup.get("dokterDPJPMelayani").value.nama,
      polirujukankode: this.item.kdinternal,
      polirujukannama: this.item.namaruangan,
      hasilbridging: true,
    };
    var objSave = {
      asuransipasien: asuransipasien,
      pemakaianasuransi: pemakaianasuransi,
    };
    this.httpservice
      .post("medifirst2000/registrasi/save-asuransipasien", objSave)
      .subscribe((e) => {
        this.showCetaks = true;
        this.cetakSep();
      });
  }
  createAntrol() {

     let poliTujuan = this.item.kdinternal;
     let itemx: any = [];
     debugger;
     for (let i = 0; i < this.listDokterhafis.length; i++) {
        if(this.formGroup.get("dokterDPJP").value.kode == this.listDokterhafis[i].kodedokter){
          itemx = this.listDokterhafis[i];
        }
     }
         if (this.isKunjunganPertamaBPJS != true) {
            this.jeniskunjungan = 3
         }
    
       let objSave = {
         kodebooking: this.item.noreservasi,
         jenispasien: 'JKN"',
         nomorkartu: this.item2.peserta.noKartu,
         nik: this.item2.peserta.nik,
         nohp: this.item2.peserta.mr.noTelepon,
         kodepoli: poliTujuan,
         namapoli: itemx.namapoli,
         pasienbaru: 0,
         norm: this.item.nocm,
         tanggalperiksa: moment(new Date(this.item.tglregistrasi)).format(
           "YYYY-MM-DD HH:mm"
         ),
         kodedokter: this.formGroup.get("dokterDPJP").value.kode,
         namadokter: this.formGroup.get("dokterDPJP").value.nama, 
         jampraktek: itemx.jadwal,
         jeniskunjungan: this.jeniskunjungan,
         nomorreferensi: this.noSKDP, 
         keterangan:
           "Peserta harap 30 menit lebih awal guna pencatatan administrasi.",
         norecpd: this.item.norecpd,
         statusschedule: this.item.noreservasi,
         noregistrasi: this.item.noregistrasi,
         ruangan: this.item.objectruanganfk,
         tanggalperiksasekarang: moment(new Date()).format("YYYY-MM-DD"),
         dokterpd: this.item.objectpegawaifk,
       };

      
    this.httpservice
      .post("medifirst2000/registrasi/save-createpasienonline", objSave)
      .subscribe((e) => {
        this.showCetaks = true;
        this.cetakSep();
      });
  }
  getjadwalhafis() {
      this.httpservice
        .get(
          "medifirst2000/bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=" +
            this.item.kdinternal +
            "&tanggal=" +
            moment(new Date()).format("YYYY-MM-DD")
        )
        .subscribe((data) => {
          if (data.metaData.code == 200) {
            this.listDokterhafis = [];
            for (let i = 0; i < data.response.length; i++) { 
                 this.listDokterhafis.push({
                   jadwal: data.response[i].jadwal,
                   kodepoli: data.response[i].kodepoli,
                   namapoli: data.response[i].namapoli, 
                   kodedokter: data.response[i].kodedokter
                 }); 
            }
          }
        });
  }
  cetakSep() {
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + this.item.noregistrasi + '&view=false').subscribe(e => {
    //   // do something with response
    // });

    window.open(
      Configuration.get().apiBackend +
        "medifirst2000/report/cetak-sep?noregistrasi=" +
        this.item.noregistrasi +
        "&kdprofile=1",
      "_blank"
    );
  }
}