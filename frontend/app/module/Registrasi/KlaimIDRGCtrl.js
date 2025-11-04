// const { forEach } = require("underscore");

define(["initialize", "Configuration"], function (initialize, config) {
  "use strict";
  initialize.controller("KlaimIDRGCtrl", [
    "$mdDialog",
    "$state",
    "$q",
    "$scope",
    "$timeout",
    "ModelItem",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($mdDialog, $state, $q, $scope, $timeout, ModelItem, cacheHelper, DateHelper, medifirstService) {
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.item = {};
      $scope.itemD = {};
      $scope.isRouteLoading = false;
      $scope.formCari = true;
      $scope.formGrid = false;
      $scope.formGridDetail = false;
      $scope.formGridHistory = false;
      $scope.formGridDetailKembali = false;
      $scope.tabelTopup = false;
      $scope.specialDrug = false;
      $scope.specialProsthesis = false;
      $scope.specialProsthesis = false;
      $scope.specialInvestigation = false;
      $scope.showGrouping = true;
      $scope.dataSelected = {};
      $scope.totalSpesialProcedure = 0;
      $scope.totalSpecialProsthesis = 0;
      $scope.totalSpecialInvestigation = 0;
      $scope.statusSelesaiPeriksa = false;
      $scope.cboSep = false;
      var namaFile2 = []; // Array untuk menyimpan nama file
      var typeFIle2 = []; // Array untuk menyimpan tipe file
      $scope.item.tampungUbahSEP = {}

      $scope.noregistrasi = {};

      $scope.totalSpecialDrugfix = 0;
      $scope.totalSpesialProcedurefix = 0;
      $scope.totalSpecialProsthesisfix = 0;
      $scope.totalSpecialInvestigationfix = 0;

      $scope.isIcu = false;
      $scope.item.norecpv = "-";
      $scope.item.startDttm = "";
      $scope.item.stoptDttm = "";
      $scope.item.tanggalbulan = new Date();
      // $scope.item.tglAwalPulangVerif = $scope.now;
      // $scope.item.tglAkhirPulangVerif = $scope.now;

      // $scope.item.tanggalRegistrasiAwal = $scope.now;
      // $scope.item.tanggalRegistrasiAkhir = $scope.now;

      // $scope.item.tanggalAwalKlaimBerkas = $scope.now;
      // $scope.item.tanggalAkhirKlaimBerkas = $scope.now;

      // $scope.item.periodeAwal = new Date(moment($scope.now).format("YYYY-MM-DD 00:00"));
      // $scope.item.periodeAkhir = new Date(moment($scope.now).format("YYYY-MM-DD 23:59"));
      // $scope.item.tglAwalKirim = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
      // $scope.item.tglAkhirKirim = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
      // $scope.item.tglAwalPulangVerif = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
      // $scope.item.tglAkhirPulangVerif = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))

      $scope.totalSpecialDrug = 0;
      $scope.totalGroup = 0;
      var timeoutPromise;
      $scope.item.tglMeninggal = $scope.now;
      $scope.item.tglKeluar = $scope.now;
      var tampungdiagnosa = {};
      var tampungdiagnosa9 = {};
      let tampungdiagnosaIcd10 = {};
      // $scope.dataIcd10Selected = {};
      $scope.istempatLaporan = true;
      let hasilKonsultasi = "";
      let cpptO = "";
      var set = "";
      LoadCombo();
      $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
      var responData = "";
      $scope.showdializer = false;
      $scope.showkantongdarah = false;
      $scope.showpersalinan = false;
      let pdf = [];
      let namaFile = "";
      var pdf2 = []; // Array untuk menyimpan file dalam format base64
      var namaFile2 = []; // Array untuk menyimpan nama file
      var typeFIle2 = [];
      let tampungData = [];
      $scope.buttonshow = true;

      //2023-12-28
      // $scope.isCetakDokumen=true
      $scope.isCetakDokumenInacbg = false;
      $scope.isCetakDokumenTM = true;
      $scope.isCetakAll = false;

      $scope.formatRupiah = function (value, currency) {
        return (
          currency +
          " " +
          parseFloat(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        );
      };
      medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
        $scope.sourceDiagnosisPrimer = data;
      });
      medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
        $scope.sourceDiagnosisPrimer1 = data;
      });
      // function
      //     LoadDataClosingFaktur() {
      //     medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
      //         $scope.dataParams.noRegistrasi, true).then(function (dat) {
      //             $scope.statusSelesaiPeriksa = dat.data.data
      //         });
      // }
      $scope.saveLogging = function (jenis, referensi, noreff, ket) {
        medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis + "&referensi=" + referensi + "&noreff=" + noreff + "&keterangan=" + ket).then(function (data) {});
      };
      $scope.tagihanClosing = function (data) {
        if (data == undefined) {
          alert("Pilih Satu Data Yang Mau di tutup faktur nya !!!");
          return;
        }
        var y = "";
        if ($scope.item.cetakx == undefined) {
          y = "";
        } else if ($scope.item.cetakx == "sudah") {
          y = "&cetakx=sudah";
        } else if ($scope.item.cetakx == "belum") {
          y = "&cetakx=belum";
        }
        medifirstService.get("tatarekening/detail-tagihan/" + data.noRegistrasi + "?jenisdata=bill" + y).then(function (dat) {
          for (var i = 0; i < dat.data.details.length; i++) {
            if (dat.data.details[i].dokter == "" || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
              if (dat.data.details[i].norec != null) {
                alert(
                  "data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!" +
                    "pelayanan :" +
                    dat.data.details[i].namaPelayanan +
                    "ruangan :" +
                    dat.data.details[i].ruanganTindakan +
                    "tgl.peelayanan :" +
                    dat.data.details[i].tglPelayanan
                );
                return;
              }
            }
          }
          if ($scope.item.deptidlast === "16") {
            $scope.popUpclosing.center().open();
          } else {
            var stt = "false";
            if (confirm("Pasien yang sudah ditutup Faktur tidak bisa mendapat tindakan lagi. \nApakah Anda Yakin Ingin Menutup Faktur? ")) {
              // Save it!
              stt = "true";
            } else {
              // Do nothing!
              stt = "false";
            }

            if (stt == "true") {
              $scope.closingTagihan(data.noRegistrasi);
            }
          }
        });
      };

      $scope.closingTagihan = function (noRegistrasi) {
        if ($scope.item.deptidlast === "16") {
          if ($scope.item.password != "ditutup") {
            toastr.error("Password Salah!");
            return;
          }
        }

        // var stt = 'false'
        // if (confirm('Tutup Faktur? ')) {
        // 	// Save it!
        // 	stt = 'true';
        // } else {
        // 	// Do nothing!
        // 	stt = 'false'
        // }

        // if (stt == 'true') {
        var json = {
          noregistrasi: noRegistrasi,
          close: true,
        };
        var pegawai = medifirstService.getPegawaiLogin().namaLengkap;
        // getBase64save('ada billing', 'billing');
        // function getBase64save(file, jenis) {
        //     saveFilePapj(file, jenis);

        // }

        // function saveFilePapj(file, jenis) {
        //     // var base64String = file.replace(/^data:application\/pdf;base64,/, '');
        //     let objSave = {
        //         'jenis': jenis,
        //         'noregistrasi': noRegistrasi,
        //         'file': file
        //     };
        //     medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function (e) {

        //     });
        // }
        medifirstService.post("tatarekening/save-selesai-transaksi-faktur", json).then(function (e) {
          if (e.status === 201) {
            medifirstService.post("tatarekening/save-log-closing-faktur", json).then(function (e) {
              $scope.saveLogging("Tutup Faktur", "No registrasi pasien tutup faktur", noRegistrasi, "Tutup Faktur pasien noreg " + noRegistrasi + " Oleh " + pegawai);

              // LoadDataClosingFaktur();
              LoadCache();
            });
          }
        });
        // $scope.popUpclosing.close()
        // }
      };
      $scope.batalClosing = function (data) {
        if (!data || !data.noRegistrasi) {
          alert("Pilih Satu Data Yang Mau di buka faktur nya !!!");
          return;
        }
        $scope.selectedNoRegistrasi = data.noRegistrasi;
        $scope.popUpUnclosing.center().open();
      };
      $scope.saveUnclosing = function () {
        if ($scope.item.password != "bukain") {
          toastr.error("Password Salah!");
          return;
        }
        if ($scope.item.batalClosing == undefined || $scope.item.batalClosing == " ") {
          toastr.error("Alasan Batal Closing Harus Diisi !");
          return;
        }
        var json = {
          alasanbatalclosing: $scope.item.batalClosing,
          noregistrasi: $scope.selectedNoRegistrasi,
          close: false,
        };
        var pegawai = medifirstService.getPegawaiLogin().namaLengkap;
        medifirstService.post("tatarekening/save-selesai-transaksi-faktur", json).then(function (e) {
          if (e.status === 201) {
            medifirstService.post("tatarekening/save-log-unclosing-faktur", json).then(function (e) {
              $scope.saveLogging("Buka Faktur", "No registrasi pasien buka faktur", $scope.selectedNoRegistrasi, "Buka Faktur pasien noreg " + $scope.selectedNoRegistrasi + " Oleh " + pegawai);
              // LoadDataClosingFaktur();
              LoadCache();
            });
          }
        });
        $scope.popUpUnclosing.close();
      };

      function LoadCombo() {
        $scope.isLoadingDiagnosis = true;
        medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
          $scope.listDiagnosaTindakan = data;
        });
        medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
          $scope.listDiagnosa = data;
        });
        medifirstService.get("emr/get-combo-diagnosis").then(function (data) {
          // debugger
          $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
        });

        //   ModelItem.getDataDummyGeneric("JenisDiagnosa", true, true, 10).then(function (data) {
        //     $scope.listJenisDiagnosa = data;
        // });

        // ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
        //     $scope.listDiagnosa = data;
        // });
        // medifirstService.get("tatarekening/get-combo-baru").then(function (dat) {
        //   $scope.listDepartemen = dat.data.departemen;
        // });
        medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
          $scope.listDokter = data.data.dokter;
        });
      }

      // $scope.cards = [
      //     {
      //         nama: 'opet',
      //         norm: '00000012',
      //         nokartu: 'NoKartu:0000000000000',
      //         lahir: 1231234123
      //     }
      // ];
      $scope.cardView = false;

      $scope.SearchEnter = function () {
        loadData();
      };
      $scope.findData = function () {
        loadData();
      };
      $scope.clickDokter = function () {
        medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
          $scope.listDokter = data.data.dokter;
          $listRuangan = data.data.ruanganall;
        });
        debugger;
        $scope.popupDokter.center().open();
      };
      function loadData() {
        if ($scope.item.nocari.length > 17) {
          $scope.isRouteLoading = true;
          medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.item.nocari).then(function (e) {
            if (e.data.metaData.code === "200") {
              $scope.isRouteLoading = false;
              $scope.cards = [
                {
                  nama: e.data.response.peserta.nama,
                  norm: e.data.response.peserta.noMr,
                  nokartu: "KARTU : " + e.data.response.peserta.noKartu,
                  lahir: "LAHIR : " + e.data.response.peserta.tglLahir,
                  nosep: e.data.response.noSep,
                  jenispelayanan: e.data.response.jenispelayanan,
                },
              ];
              $scope.cardView = true;
            } else {
              $scope.isRouteLoading = false;
            }
          });
        } else {
          $scope.isRouteLoading = true;
          medifirstService.get("bridging/inacbg/get-cari-daftar-pasien?nosep=" + $scope.item.nocari).then(function (e) {
            $scope.isRouteLoading = false;
            $scope.cards = e.data;
            $scope.cardView = true;
          });
        }
      }

      $scope.$watch("item.mulai", function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          setJmlJam();
        }
      });

      $scope.$watch("item.selesai", function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          setJmlJam();
        }
      });
      $scope.simpan = function () {
        debugger;
        var objSave = {
          noReg: $scope.item.noregistrasi,
          objectpegawaifk: $scope.item.namaDokter.id,
        };
        medifirstService.post("registrasi/daftar-registrasi/update-dokter2", objSave).then(function (e) {
          $scope.setdetail(set);
          $scope.popupDokter.close();
        });
      };
      function setJmlJam() {
        if ($scope.item.mulai == undefined || $scope.item.mulai == null || $scope.item.mulai == "") {
          $scope.item.jmljam = "";
        } else if ($scope.item.selesai == undefined || $scope.item.selesai == null || $scope.item.selesai == "") {
          $scope.item.jmljam = "";
        } else {
          var dt1 = new Date($scope.item.mulai);
          var dt2 = new Date($scope.item.selesai);
          var x = diff_hours(dt1, dt2);
          $scope.item.jmljam = x;
        }
      }

      function diff_hours(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(Math.round(diff));
      }

      $scope.setdetail = function (x) {
        debugger;
        set = x;
        if (set.nosep == "") {
          alert("No SEP Belum Di Input!");
          return;
        }
        $scope.isRouteLoading = true;
        $scope.buttonshow = false;
        $scope.isIcu = false;
        $scope.item.norecpv = "-";
        $scope.item.startDttm = "";
        $scope.item.stoptDttm = "";
        medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + set.nosep).then(function (e) {
          if (e.data.metaData.code === "200") {
            if (e.data.response.poli == "HEMODIALISA") {
              $scope.showdializer = true;
            } else {
              $scope.showdializer = false;
            }
            if (set.objectdepartemenfk == 24) {
              let mark = "";
              if (e.data.response.jnsPelayanan == "Rawat Inap") {
                mark = "RI";
              } else {
                mark = "RJ";
              }
              if (e.data.response.jnsPelayanan == "Rawat Jalan" && mark != "RJ") {
                if (set.objectjenispasienfk == 1) {
                  $scope.isRouteLoading = false;
                  toastr.error("SEP ini untuk Rawat Jalan");
                  return;
                }
              } else if (e.data.response.jnsPelayanan == "Rawat Inap" && mark != "RI") {
                $scope.isRouteLoading = false;
                toastr.error("SEP ini untuk Rawat Inap");
                return;
              }
            } else {
              if (e.data.response.jnsPelayanan == "Rawat Jalan" && set.tipe != "RJ") {
                if (set.objectjenispasienfk == 1) {
                  $scope.isRouteLoading = false;
                  toastr.error("SEP ini untuk Rawat Jalan");
                  return;
                }
              } else if (e.data.response.jnsPelayanan == "Rawat Inap" && set.tipe != "RI") {
                $scope.isRouteLoading = false;
                toastr.error("SEP ini untuk Rawat Inap");
                return;
              }
            }
            if (set.objectdepartemenfk != 24) {
              if (moment(set.tglmasuk).format("YYYY-MM-DD") != e.data.response.tglSep) {
                toastr.error("Tanggal SEP " + e.data.response.tglSep + " Berbeda Dengan Tanggal Registrasi " + moment(set.tglmasuk).format("YYYY-MM-DD"));
                $scope.isRouteLoading = false;
                return;
              }
            }
            medifirstService.get("bridging/inacbg/get-cari-set-form-inacbg-idrg?nosep=" + set.noregistrasi).then(function (e) {
              $scope.isRouteLoading = false;
              $scope.formGridHistory = false;
              $scope.formGridDetail = true;
              $scope.item = e.data;
              $scope.item.sistoleinacbg = $scope.item.data[0].sistoleinacbg;
              $scope.item.diastoleinacbg = $scope.item.data[0].diastoleinacbg;
              $scope.judulPasienKlaim = set.nosep + " / " + set.tipe;
              $scope.item.jaminan = set.jaminan;
              $scope.item.nokartu = set.nokepesertaan;
              $scope.item.nosep = set.nosep;
              $scope.item.cob = "-";
              var ruLast = $scope.item.data[0].objectruanganlastfk;
              if (ruLast == 64 || ruLast == 77 || ruLast == 65) {
                $scope.isIcu = true;
              } else {
                $scope.isIcu = false;
              }

              if (set.tipe == "RJ") {
                $scope.paramInacbg = "Rawat Jalan";
                $scope.targetkelas_rawat = e.data.data[0].namakelas;
                $scope.target_statusnaikkelas = "Tidak Naik Kelas";
                $scope.target_kelaspelayanan = "-";
                $scope.target_upgrade_class_payor = "Tidak Naik Kelas";
                 if (e.data.data[0].caramasuk != null) {
                    $scope.target_cara_masuk = e.data.data[0].caramasuk;
                    } else {
                      $scope.target_cara_masuk = "Rujukan FKTP";
                  }
              } else {
                $scope.paramInacbg = "Rawat Inap";
                $scope.targetkelas_rawat = e.data.data[0].namakelas;
                $scope.target_kelaspelayanan = e.data.datanaikkelas[0].kelastertinggi;
                $scope.lamarawatintensiv = e.data.datanaikkelas[0].lamarawatintensiv + " Hari";
                if (e.data.datanaikkelas[0].statusnaikkelas == "1") {
                  $scope.target_statusnaikkelas = "Naik Kelas";
                  if (e.data.data[0].namanaikkelas != null) 
                    $scope.target_upgrade_class_payor = $scope.item.data[0].namanaikkelas;
                  else $scope.target_upgrade_class_payor = "Belum Diisi";
                } else {
                  $scope.target_statusnaikkelas = "Tidak Naik Kelas";
                  $scope.target_upgrade_class_payor = "Tidak Naik Kelas";
                }
              }
              if (set.tipe == "RI") {
                // $scope.target_cara_masuk = "Dari Rawat Darurat";
                if (e.data.data[0].caramasuk == "Rujukan FKTP" && $scope.item.data[0].kodecaramasuk == "gp") {
                    $scope.target_cara_masuk = "Dari Rawat Darurat";
                    $scope.item.data[0].kodecaramasuk = "emd";
                  } else {
                      $scope.target_cara_masuk = e.data.data[0].caramasuk;
                      $scope.item.data[0].kodecaramasuk;
                  }
              }
              $scope.item.noregistrasi = e.data.data[0].noregistrasi;
              $scope.targettgl_masuk = e.data.data[0].tglregistrasi;
              $scope.targettgl_pulang = e.data.data[0].tglpulang;
              $scope.targetnama_dokter = e.data.data[0].namadokter;
              var tanggal = $scope.now;
              var tanggalLahir = new Date(e.data.data[0].tgllahir);
              var umur = DateHelper.CountAge(tanggalLahir, tanggal);
              $scope.targetumur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
              if (e.data.data[0].objectstatuspulangfk == 1 || e.data.data[0].objectstatuspulangfk == 13) {
                $scope.targetdischarge_status = "Atas persetujuan dokter";
              } else if (
                e.data.data[0].objectstatuspulangfk == 4 ||
                e.data.data[0].objectstatuspulangfk == 5 ||
                e.data.data[0].objectstatuspulangfk == 10 ||
                e.data.data[0].objectstatuspulangfk == 11 ||
                e.data.data[0].objectstatuspulangfk == 7 ||
                e.data.data[0].objectstatuspulangfk == 16
              ) {
                $scope.targetdischarge_status = "Dirujuk";
              } else if (e.data.data[0].objectstatuspulangfk == 2 || e.data.data[0].objectstatuspulangfk == 3 || e.data.data[0].objectstatuspulangfk == 12) {
                $scope.targetdischarge_status = "Atas permintaan sendiri";
              } else if (e.data.data[0].objectstatuspulangfk == 9 || e.data.data[0].objectstatuspulangfk == 18) {
                $scope.targetdischarge_status = "Meninggal";
              } else {
                $scope.targetdischarge_status = "Lain-lain";
              }
              if (e.data.dataTarif.pelayanan_darah > 0) {
                $scope.showkantongdarah = true;
              } else {
                $scope.showkantongdarah = false;
              }

              $scope.listTarifRS = [
                { namatarif: "Prosedur Non Bedah", tarif: e.data.dataTarif.prosedur_non_bedah, tarifx: $scope.formatRupiah(e.data.dataTarif.prosedur_non_bedah, "Rp. ") },
                { namatarif: "Tenaga Ahli", tarif: e.data.dataTarif.tenaga_ahli, tarifx: $scope.formatRupiah(e.data.dataTarif.tenaga_ahli, "Rp. ") },
                { namatarif: "Radiologi", tarif: e.data.dataTarif.radiologi, tarifx: $scope.formatRupiah(e.data.dataTarif.radiologi, "Rp. ") },
                { namatarif: "Rehabilitasi", tarif: e.data.dataTarif.rehabilitasi, tarifx: $scope.formatRupiah(e.data.dataTarif.rehabilitasi, "Rp. ") },
                { namatarif: "Obat", tarif: e.data.dataTarif.obat, tarifx: $scope.formatRupiah(e.data.dataTarif.obat, "Rp. ") },
                { namatarif: "Alkes", tarif: e.data.dataTarif.alkes, tarifx: $scope.formatRupiah(e.data.dataTarif.alkes, "Rp. ") },
                { namatarif: "Prosedur Bedah", tarif: e.data.dataTarif.prosedur_bedah, tarifx: $scope.formatRupiah(e.data.dataTarif.prosedur_bedah, "Rp. ") },
                { namatarif: "Keperawatan", tarif: e.data.dataTarif.keperawatan, tarifx: $scope.formatRupiah(e.data.dataTarif.keperawatan, "Rp. ") },
                { namatarif: "Laboratorium", tarif: e.data.dataTarif.laboratorium, tarifx: $scope.formatRupiah(e.data.dataTarif.laboratorium, "Rp. ") },
                { namatarif: "Kamar/Akomodasi", tarif: e.data.dataTarif.kamar, tarifx: $scope.formatRupiah(e.data.dataTarif.kamar, "Rp. ") },
                { namatarif: "Prosedur Non Bedah", tarif: e.data.dataTarif.obat_kronis, tarifx: $scope.formatRupiah(e.data.dataTarif.obat_kronis, "Rp. ") },
                { namatarif: "BMHP", tarif: e.data.dataTarif.bmhp, tarifx: $scope.formatRupiah(e.data.dataTarif.bmhp, "Rp. ") },
                { namatarif: "Konsultasi", tarif: e.data.dataTarif.konsultasi, tarifx: $scope.formatRupiah(e.data.dataTarif.konsultasi, "Rp. ") },
                { namatarif: "Penunjang", tarif: e.data.dataTarif.penunjang, tarifx: $scope.formatRupiah(e.data.dataTarif.penunjang, "Rp. ") },
                { namatarif: "Pelayanan Darah", tarif: e.data.dataTarif.pelayanan_darah, tarifx: $scope.formatRupiah(e.data.dataTarif.pelayanan_darah, "Rp. ") },
                { namatarif: "Rawat Intensif", tarif: e.data.dataTarif.rawat_intensif, tarifx: $scope.formatRupiah(e.data.dataTarif.rawat_intensif, "Rp. ") },
                { namatarif: "Obat Kemoterapi", tarif: e.data.dataTarif.obat_kemoterapi, tarifx: $scope.formatRupiah(e.data.dataTarif.obat_kemoterapi, "Rp. ") },
                { namatarif: "Sewa Alat", tarif: e.data.dataTarif.sewa_alat, tarifx: $scope.formatRupiah(e.data.dataTarif.sewa_alat, "Rp. ") },
              ];
              $scope.totalTarifRS = 0;
              for (var i = 0; i < $scope.listTarifRS.length; i++) {
                $scope.totalTarifRS = parseFloat($scope.listTarifRS[i].tarif) + $scope.totalTarifRS;
              }
              $scope.totalTarifRS = $scope.formatRupiah($scope.totalTarifRS, "Rp. ");
              $scope.totalInacbg = $scope.formatRupiah($scope.item.data[0].totalpiutangpenjamin, "Rp. ");
              $scope.totalTarifNaikKelas = $scope.formatRupiah($scope.item.data[0].biayanaikkelas !== null ? $scope.item.data[0].biayanaikkelas : 0, "Rp. ");
              $scope.item.beratBadan = $scope.item.data[0].beratbadan;
              $scope.item.kantongdarah = parseInt($scope.item.data[0].kantongdarah);
              // $scope.item.dializer = parseInt($scope.item.data[0].dializer);
              if ($scope.item.data[0].dializer != null) {
                  $scope.item.dializer = parseInt($scope.item.data[0].dializer);
              } else {
                  $scope.item.dializer = 1; // default Single Use
              }
              $scope.item.appearance = parseInt($scope.item.data[0].appearance);
              $scope.item.appearance2 = parseInt($scope.item.data[0].appearance2);
              $scope.item.pulse = parseInt($scope.item.data[0].pulse);
              $scope.item.pulse2 = parseInt($scope.item.data[0].pulse2);
              $scope.item.grimace = parseInt($scope.item.data[0].grimace);
              $scope.item.grimace2 = parseInt($scope.item.data[0].grimace2);
              $scope.item.activity = parseInt($scope.item.data[0].activity);
              $scope.item.activity2 = parseInt($scope.item.data[0].activity2);
              $scope.item.respiration = parseInt($scope.item.data[0].respiration);
              $scope.item.respiration2 = parseInt($scope.item.data[0].respiration2);
              debugger;
              if ($scope.item.data[0].norecpv != null && $scope.item.data[0].norecpv != "") {
                $scope.item.norecpv = $scope.item.data[0].norecpv;
                $scope.item.useind = "1";
              } else {
                $scope.item.norecpv = "-";
                $scope.item.useind = "0";
              }
              if ($scope.item.data[0].mulai != null && $scope.item.data[0].mulai != "") {
                $scope.item.startDttm = moment($scope.item.data[0].mulai).format("YYYY-MM-DD HH:mm:ss");
              } else {
                $scope.item.startDttm = "";
              }

              if ($scope.item.data[0].selesai != null && $scope.item.data[0].selesai != "") {
                $scope.item.stoptDttm = moment($scope.item.data[0].selesai).format("YYYY-MM-DD HH:mm:ss");
              } else {
                $scope.item.stoptDttm = "";
              }

              $scope.item.mulai = moment($scope.item.data[0].mulai).format("YYYY-MM-DD HH:mm:ss");
              $scope.item.selesai = moment($scope.item.data[0].selesai).format("YYYY-MM-DD HH:mm:ss");
              $scope.item.jmljam = $scope.item.data[0].jmljam;
              $scope.cbgcode = $scope.item.data[0].cbgcode;
              $scope.cbgdescription = $scope.item.data[0].cbgdescription;
              if ($scope.item.data[0].beratbadan == null) {
                $scope.item.beratBadan = $scope.item.data[0].beratbayi;
              }
              $scope.cbgdescription = $scope.item.data[0].cbgdescription;

              $scope.totalSpecialInvestigationfix = $scope.formatRupiah($scope.item.data[0].totalSpecialInvestigation !== null ? $scope.item.data[0].totalSpecialInvestigation : 0, "Rp. ");
              $scope.totalSpecialProsthesisfix = $scope.formatRupiah($scope.item.data[0].totalSpecialProsthesis !== null ? $scope.item.data[0].totalSpecialProsthesis : 0, "Rp. ");
              $scope.totalSpesialProcedurefix = $scope.formatRupiah($scope.item.data[0].totalSpesialProcedure !== null ? $scope.item.data[0].totalSpesialProcedure : 0, "Rp. ");
              $scope.totalSpecialDrugfix = $scope.formatRupiah($scope.item.data[0].totalSpecialDrug !== null ? $scope.item.data[0].totalSpecialDrug : 0, "Rp. ");
              $scope.totalGroup = $scope.formatRupiah($scope.item.data[0].totalgroup !== null ? $scope.item.data[0].totalgroup : 0, "Rp. ");

              var dataTea = $scope.item.dataDiagnosa10;
              $scope.listDiagnosa10 = $scope.item.dataDiagnosa10;
              $scope.listDiagnosa9 = $scope.item.dataDiagnosa9;
              $scope.listDiagnosa10Inacbg = $scope.item.dataDiagnosaInacbg10;
              $scope.listDiagnosa9Inacbg = $scope.item.dataDiagnosaInacbg9;
              for (var x = 0; x < $scope.listDiagnosa10.length; x++) {
                if ($scope.listDiagnosa10[x].kddiagnosa != null) {
                  let text = $scope.listDiagnosa10[x].kddiagnosa;
                  let result = text.match(/O82/);
                  if (result != null) {
                    $scope.showpersalinan = true;
                  }
                  let text2 = $scope.listDiagnosa10[x].kddiagnosa;
                  let result2 = text2.match(/99/);
                  if (result2 != null) {
                    $scope.showpersalinan = true;
                    $scope.showkantongdarah = true;
                  }
                }
              }
              if ($scope.item.datapersalinan.length > 0) {
                $scope.target_persalinan = "Sudah";
              } else {
                $scope.target_persalinan = "Belum Diisi";
              }
            //   LoadCache();
              if ($scope.item.data[0].noregistrasifk) {
                $scope.getStatusBridgingInacbg();
              } else {
                console.warn('noregistrasifk belum ada, getStatusBridgingInacbg tidak dipanggil');
              }
              // LoadData();
            });
            if (e.data.response.jnsPelayanan == "Rawat Jalan") {
              if (e.data.response.poli == "INSTALASI GAWAT DARURAT") {
                medifirstService.get("emr/get-resume-medis-igd-noregistrasi/" + set.noregistrasi).then(function (res) {
                  if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                    $scope.item.sistoleinacbg = res.data.data[0].tekanansystolebefore;
                    $scope.item.diastoleinacbg = res.data.data[0].tekanandiastolebefore;
                  } else if (typeof res.data.data === "object") {
                    $scope.item.sistoleinacbg = res.data.data.tekanansystolebefore;
                    $scope.item.diastoleinacbg = res.data.data.tekanandiastolebefore;
                  } else {
                    console.log("Data tidak ditemukan.");
                  }
                });
              } else {
                medifirstService.get("emr/get-resume-medis-jalan-noregistrasi/" + set.noregistrasi).then(function (res) {
                  if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                    $scope.item.sistoleinacbg = res.data.data[0].tekanansystolebefore;
                    $scope.item.diastoleinacbg = res.data.data[0].tekanandiastolebefore;
                  } else if (typeof res.data.data === "object") {
                    $scope.item.sistoleinacbg = res.data.data.tekanansystolebefore;
                    $scope.item.diastoleinacbg = res.data.data.tekanandiastolebefore;
                  } else {
                    console.log("Data tidak ditemukan.");
                  }
                });
              }
            } else if (e.data.response.jnsPelayanan == "Rawat Inap") {
              medifirstService.get("emr/get-resume-medis-inap-noregistrasi/" + set.noregistrasi).then(function (res) {
                if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                  $scope.item.sistoleinacbg = res.data.data[0].tekanansystolebefore;
                  $scope.item.diastoleinacbg = res.data.data[0].tekanandiastolebefore;
                } else if (typeof res.data.data === "object") {
                  $scope.item.sistoleinacbg = res.data.data.tekanansystolebefore;
                  $scope.item.diastoleinacbg = res.data.data.tekanandiastolebefore;
                } else {
                  console.log("Data tidak ditemukan.");
                }
              });
            } else {
              $scope.item.sistoleinacbg = "";
              $scope.item.diastoleinacbg = "";
            }
          } else {
            $scope.isRouteLoading = false;
            toastr.error(e.data.metaData.code);
            return;
          }
          // LoadCache()
          // LoadData()
        });
      };

      $scope.simpanVentilator = function () {
        // $scope.isLoading = true
        if ($scope.isIcu === false) {
          var stt = "false";
          if (confirm("Ruangan terakhir pasien bukan Ruangan Intensive - tetap lanjud simpan ?")) {
            stt = "true";
          } else {
            stt = "false";
          }

          if (stt == "true") {
            savePemakaianVentilator();
          }
        } else {
          savePemakaianVentilator();
        }
      };

      function savePemakaianVentilator() {
        if ($scope.item.mulai == undefined || $scope.item.mulai == null || $scope.item.mulai == "") {
          toastr.error("Harap input tanggal mulai", "Peringatan !");
          return;
        }

        if ($scope.item.selesai == undefined || $scope.item.selesai == null || $scope.item.selesai == "") {
          toastr.error("Harap input tanggal selesai / sampai", "Peringatan !");
          return;
        }

        if ($scope.item.jmljam == undefined || $scope.item.jmljam == null || $scope.item.jmljam == "") {
          toastr.error("Harap input jumlah jam", "Peringatan !");
          return;
        }

        var jsonSave = {
          norec: $scope.item.norecpv,
          mulai: moment($scope.item.mulai).format("YYYY-MM-DD HH:mm:ss"),
          selesai: moment($scope.item.selesai).format("YYYY-MM-DD HH:mm:ss"),
          jmljam: $scope.item.jmljam,
          norec_pd: $scope.item.data[0].noregistrasifk.trim(),
          norec_apd: "",
          objectruanganfk: $scope.item.data[0].objectruanganlastfk,
        };

        $scope.isRouteLoading = true;
        medifirstService.post("emr/save-pemakaian-ventilator", jsonSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
        });
      }

      $scope.clickKembali = function () {
        $scope.clickKembali = function () {
          if ($scope.formGridHistory == true) {
            $scope.formGrid = false;
            $scope.formGridHistory = false;
            $scope.formCari = true;
          } else if ($scope.formGridDetail == true) {
            $scope.formGridHistory = true;
            $scope.formGridDetail = false;
            $scope.buttonshow = true;
          }
        };
      };
      $scope.clickHapusClaim = function () {
        debugger;
        $scope.item;
        set;
        let delete1 = {};
        let delete2 = [];
        delete1 = {
          metadata: {
            method: "delete_claim",
          },
          data: {
            nomor_sep: set.nosep,
            coder_nik: $scope.dataLogin.noIdentitas,
          },
        };
        delete2.push(delete1);
        var objData = {
          data: delete2,
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          debugger;
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, responData[0].dataresponse.metadata.code);
          if (responData[0].dataresponse.metadata.code == 200) {
            var objDelete = {
              noregistrasi: set.noregistrasi,
            };
            medifirstService.post("bridging/inacbg/delete-hasil-grouping", objDelete).then(function (e) {
              if (e.data.status == 201) {
                if ($scope.formGridHistory == true) {
                  $scope.formGrid = false;
                  $scope.formGridHistory = false;
                  $scope.formCari = true;
                } else if ($scope.formGridDetail == true) {
                  $scope.formGridHistory = true;
                  $scope.formGridDetail = false;
                }
                $scope.tabelTopup = false;
                $scope.specialDrug = false;
                $scope.specialProsthesis = false;
                $scope.specialProsthesis = false;
                $scope.specialInvestigation = false;
                $scope.showGrouping = true;
              }
            });
          }
        });
      };

      $scope.clickCard = function (x, value) {
        if (value == undefined) {
          alert("Nosep/Norm Kosong!!");
          return;
        }
        $scope.formCari = false;
        $scope.formGrid = true;
        $scope.formGridHistory = true;
        $scope.formGridDetailKembali = true;
        $scope.judulPasien = x.nama + "-" + x.norm;
        $scope.isRouteLoading = true;
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien-idrg?nosep=" + value).then(function (e) {
          $scope.isRouteLoading = false;
          var data2 = e.data;
          $scope.dataGrid = new kendo.data.DataSource({
            data: data2,
            // group: $scope.group,
            pageSize: 100,
            total: data2.length,
            serverPaging: false,
            schema: {
              model: {},
            },
          });
        });
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien-idrg?nosep=" + x.norm).then(function (e) {
          $scope.isRouteLoading = false;
          var data2 = e.data;
          $scope.dataGrid2 = new kendo.data.DataSource({
            data: data2,
            // group: $scope.group,
            pageSize: 100,
            total: data2.length,
            serverPaging: false,
            schema: {
              model: {},
            },
          });
        });
      };

      //ash 2023-12-20
      $scope.KlaimclickCard = function (dataItem) {
        set = dataItem;
        if (set.nosep == "") {
          alert("No SEP Belum Di Input!");
          return;
        }
        $scope.buttonshow = false;
        $scope.isIcu = false;
        $scope.item.norecpv = "-";
        $scope.item.startDttm = "";
        $scope.item.stoptDttm = "";

        $scope.formCari = false;
        $scope.formGrid = true;
        $scope.formGridHistory = true;
        $scope.formGridDetailKembali = true;
        // $scope.formGridDetail = true
        $scope.judulPasien = set.namaPasien + "-" + set.noCm;
        $scope.isRouteLoading = true;
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien-idrg?nosep=" + set.nosep).then(function (e) {
          $scope.isRouteLoading = false;
          var data2 = e.data;
          $scope.dataGrid = new kendo.data.DataSource({
            data: data2,
            // group: $scope.group,
            pageSize: 100,
            total: data2.length,
            serverPaging: false,
            schema: {
              model: {},
            },
          });
        });
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien-idrg?nosep=" + set.noCm).then(function (e) {
          $scope.isRouteLoading = false;
          var data2 = e.data;
          $scope.dataGrid2 = new kendo.data.DataSource({
            data: data2,
            // group: $scope.group,
            pageSize: 100,
            total: data2.length,
            serverPaging: false,
            schema: {
              model: {},
            },
          });
        });
      };

      $scope.columnGrid = {
        selectable: "row",
        pageable: true,
        // dataBound: onDataBound,
        // columns: $scope.columnGrid
        columns: [
          {
            title: "Detail",
            width: "90px",
            template: '<button class="k-button custom-button" ng-click="setdetail(dataItem)"  style="margin:0 0 5px">#:  \'Detail\' #</button> ',
          },
          {
            field: "tglmasuk",
            title: "Tanggal Masuk",
            width: "35px",
          },
          {
            field: "tglpulang",
            title: "Tanggal Pulang",
            width: "35px",
          },
          {
            field: "jaminan",
            title: "Jaminan",
            width: "35px",
          },
          {
            field: "nosep",
            title: "No. SEP",
            width: "35px",
          },
          {
            field: "tipe",
            title: "Tipe",
            width: "35px",
          },
        //   {
        //     title: "Diagnosa",
        //     width: "90px",
        //     template: '<button class="k-button custom-button" ng-click="setDiagnosa(dataItem)"  style="margin:0 0 5px">#:  diagnosa #</button> ',
        //   },
          {
            field: "cbgcode",
            title: "CBG",
            width: "35px",
          },
          {
            field: "statusgrouping",
            title: "Status",
            width: "35px",
          },
        ],
      };

      $scope.clickTanggalPulang = function () {
        getdataPulang();
        $scope.popupEditTanggalPulang.center().open();
      };

      $scope.clickStatusPulang = function () {
        getdataCombo();
        $scope.popupEditStatusPulang.center().open();
      };
      $scope.saveCaraMasuk = function () {
        debugger;
        var caraMasuk = null;
        if ($scope.item.statusMasuk != undefined) {
          caraMasuk = $scope.item.statusMasuk.id;
        }

        var asalRujukan = null;
        if (caraMasuk == 1) {
          asalRujukan = 1;
        } else if (caraMasuk == 2) {
          asalRujukan = 2;
        } else if (caraMasuk == 3) {
          asalRujukan = 9;
        } else if (caraMasuk == 4) {
          asalRujukan = 10;
        } else if (caraMasuk == 5) {
          asalRujukan = 7;
        } else if (caraMasuk == 6) {
          asalRujukan = 11;
        } else if (caraMasuk == 7) {
          asalRujukan = 12;
        } else if (caraMasuk == 8) {
          asalRujukan = 13;
        } else if (caraMasuk == 9) {
          asalRujukan = 14;
        } else if (caraMasuk == 10) {
          asalRujukan = 15;
        } else if (caraMasuk == 11) {
          asalRujukan = 16;
        }

        var pasiendaftar = {
          noregistrasi: $scope.item.data[0].noregistrasi,
          caraMasuk: caraMasuk,
          asalRujukan: asalRujukan,
        };
        var antrianpasiendiperiksa = {
          noregistrasifk: $scope.item.data[0].noregistrasifk,
          objectasalrujukanfk: caraMasuk,
        };

        var objSave = {
          pasiendaftar: pasiendaftar,
          antrianpasiendiperiksa: antrianpasiendiperiksa,
        };

        debugger;
        medifirstService.post("rawatinap/save-cara-masuk-eklaim", objSave).then(function (e) {
          $scope.setdetail(set);
          $scope.popupEditCaraMasuk.close();
        });
      };
      $scope.clickCaraMasuk = function () {
        medifirstService.get("registrasi/daftar-antrian-pasien/get-combo-caramasukinacbg").then(function (e) {
          $scope.listCaraMasuk = e.data.dataCaraMasuk;
        });
        $scope.popupEditCaraMasuk.center().open();
      };
      $scope.simpanTekananDarah = function () {
        // if ($scope.item.sistoleinacbg == undefined) {
        //     alert("Tekanan Darah Belum Di isi!!")
        //     return
        // }
        // if ($scope.item.diastoleinacbg == undefined) {
        //     alert("Tekanan Darah mmhg Belum Di isi!!")
        //     return
        // }
        debugger;
        var objSave = {
          sistole: $scope.item.sistoleinacbg,
          diastole: $scope.item.diastoleinacbg,
          noregistrasifk: $scope.item.data[0].noregistrasifk,
        };
        medifirstService.post("bridging/inacbg/save-tekananDarah", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
        });
      };
      $scope.clickPersalinan = function () {
        $scope.listdelivery = [];
        if ($scope.target_persalinan == "Sudah") {
          $scope.item.usiakehamilan = $scope.item.datapersalinan[0].usiakehamilan;
          $scope.item.gravida = $scope.item.datapersalinan[0].gravida;
          $scope.item.partus = $scope.item.datapersalinan[0].partus;
          $scope.item.abortus = $scope.item.datapersalinan[0].abortus;
          $scope.item.onsetkontraksi = { id: $scope.item.datapersalinan[0].idonsetkontraksi, onsetkontraksi: $scope.item.datapersalinan[0].onsetkontraksi };

          for (var x = 0; x < $scope.item.datapersalinandelivery.length; x++) {
            var y = {
              delivery_sequence: x + 1,
              delivery_method: { id: $scope.item.datapersalinandelivery[x].iddelivery_method, deliverymethod: $scope.item.datapersalinandelivery[x].delivery_method },
              delivery_dttm: $scope.item.datapersalinandelivery[x].delivery_dttm,
              shk_lokasi: $scope.item.datapersalinandelivery[x].shk_lokasi,
              shk_spesimen_dttm: $scope.item.datapersalinandelivery[x].shk_spesimen_dttm,
              letak_janin: { id: $scope.item.datapersalinandelivery[x].letak_janin, letakjanin: $scope.item.datapersalinandelivery[x].idletak_janin },
              kondisi: { id: $scope.item.datapersalinandelivery[x].kondisi, kondisi: $scope.item.datapersalinandelivery[x].kondisi },
              use_manual: { id: $scope.item.datapersalinandelivery[x].iduse_manual, yatidak: $scope.item.datapersalinandelivery[x].use_manual },
              use_forcep: { id: $scope.item.datapersalinandelivery[x].iduse_forcep, yatidak: $scope.item.datapersalinandelivery[x].use_forcep },
              use_vacuum: { id: $scope.item.datapersalinandelivery[x].iduse_vacuum, yatidak: $scope.item.datapersalinandelivery[x].use_vacuum },
              shk_spesimen_ambil: { id: $scope.item.datapersalinandelivery[x].shk_spesimen_ambil, yatidak: $scope.item.datapersalinandelivery[x].shk_spesimen_ambil },
            };
            $scope.listdelivery.push(y);
          }
        } else {
          $scope.listdelivery = [
            { delivery_sequence: "1", delivery_method: "", delivery_dttm: "", shk_lokasi: "", shk_spesimen_dttm: "", letak_janin: "", kondisi: "", use_manual: "", use_forcep: "", use_vacuum: "", shk_spesimen_ambil: "" },
          ];
        }

        getdataCombo();
        $scope.popupEditPersalinan.center().open();
      };
      $scope.hapus = function () {
        var a = $scope.listdelivery.length - 1;
        $scope.listdelivery.splice(a, 1);
      };
      $scope.tambah = function () {
        var a = $scope.listdelivery.length + 1;
        var x = { delivery_sequence: a, delivery_method: "", delivery_dttm: "", shk_lokasi: "", shk_spesimen_dttm: "", letak_janin: "", kondisi: "", use_manual: "", use_forcep: "", use_vacuum: "", shk_spesimen_ambil: "" };

        $scope.listdelivery.push(x);
      };
      $scope.savePersalinan = function () {
        var listRawRequired = ["item.usiakehamilan|ng-model|Usia Kehamilan", "item.gravida|ng-model|Gravida", "item.partus|ng-model|Partus", "item.abortus|ng-model|Abortus", "item.onsetkontraksi|k-ng-model|One Set Kontraksi"];
        var isValid = ModelItem.setValidation($scope, listRawRequired);
        if (isValid.status) {
          if ($scope.listdelivery.length > 0) {
            for (var x = 0; x < $scope.listdelivery.length; x++) {
              if ($scope.listdelivery[x].delivery_sequence == "") {
                alert("delivery_sequence di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].delivery_method == "") {
                alert("delivery_method di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].delivery_dttm == "") {
                alert("delivery_dttm di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].shk_spesimen_dttm == "") {
                alert("shk_spesimen_dttm di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].letak_janin == "") {
                alert("letak_janin di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].kondisi == "") {
                alert("kondisi di seq" + $scope.listdelivery[x].delivery_sequence + " Belum  Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].use_manual == "") {
                alert("use manual di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].use_forcep == "") {
                alert("use forcep di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].use_vacuum == "") {
                alert("use vacuum di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].shk_spesimen_ambil == "") {
                alert("Shk spesimen ambil di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
              if ($scope.listdelivery[x].shk_lokasi == "") {
                alert("shk_lokasi di seq" + $scope.listdelivery[x].delivery_sequence + " Belum Di isi!!");
                return;
              }
            }
            var objSave = {
              noregistrasi: $scope.item.data[0].noregistrasi,
              usiakehamilan: $scope.item.usiakehamilan,
              gravida: $scope.item.gravida,
              partus: $scope.item.partus,
              abortus: $scope.item.abortus,
              onsetkontraksi: $scope.item.onsetkontraksi,
              delivery: $scope.listdelivery,
            };
            medifirstService.post("bridging/inacbg/save-persalinan", objSave).then(function (e) {
              $scope.isRouteLoading = false;
              $scope.popupEditPersalinan.close();
              $scope.setdetail(set);
            });
          }
        }
      };
      $scope.saveTanggalPulang = function () {
        debugger;
        var pasiendaftar = {
          noregistrasi: $scope.item.data[0].noregistrasi,
          tglpulang: moment($scope.item.tglpulang).format("YYYY-MM-DD HH:mm:ss"),
        };
        var objSave = {
          pasiendaftar: pasiendaftar,
        };
        debugger;
        medifirstService.post("rawatinap/save-tgl-pulang-pasien-inacbg", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.popupEditTanggalPulang.close();
          $scope.setdetail(set);
        });
      };
      $scope.saveStatusPulang = function () {
        debugger;
        var statusKeluarId = null;
        if ($scope.item.statusKeluar != undefined) {
          statusKeluarId = $scope.item.statusKeluar.id;
        }
        var kondisiKeluarId = null;
        var kondisiKeluar = null;
        if ($scope.item.kondisiKeluar != undefined) {
          kondisiKeluarId = $scope.item.kondisiKeluar.id;
          kondisiKeluar = $scope.item.kondisiKeluar.kondisipasien;
        }
        var PenyebabKematianText = "";
        if ($scope.item.PenyebabKematianText != undefined) {
          PenyebabKematianText = $scope.item.PenyebabKematianText;
        }
        var penyebabkematianId = null;
        if ($scope.item.penyebabKematian != undefined) {
          penyebabkematianId = $scope.item.penyebabKematian.id;
        }
        var statusPulangId = null;
        if ($scope.item.statusPulang != undefined) {
          statusPulangId = $scope.item.statusPulang.id;
        }
        var pasiendaftar = {
          noregistrasi: $scope.item.data[0].noregistrasi,
          objectruanganlastfk: $scope.item.data[0].objectruanganlastfk,
          objectkondisipasienfk: kondisiKeluarId,
          objectpenyebabkematianfk: penyebabkematianId,
          objectstatuskeluarfk: statusKeluarId,
          objectstatuspulangfk: statusPulangId,
          tglmeninggal: moment($scope.item.tglMeninggal).format("YYYY-MM-DD HH:mm:ss"),
          tglpulang: moment($scope.item.tglKeluar).format("YYYY-MM-DD HH:mm:ss"),
          norec_pd: $scope.item.data[0].noregistrasifk,
          objectstatuskeluarrencanafk: statusKeluarId,
          nocmfk: $scope.item.data[0].nocmfk,
          keteranganpulang: "Pulang dengan kondisi : " + kondisiKeluar,
          keterangankematian: PenyebabKematianText,
        };
        var antrianpasiendiperiksa = {
          objectruanganlastfk: $scope.item.data[0].objectruanganlastfk,
          tglpulangseblumnya: $scope.item.data[0].tglpulang,
        };
        var objSave = {
          pasiendaftar: pasiendaftar,
          antrianpasiendiperiksa: antrianpasiendiperiksa,
        };
        debugger;
        medifirstService.post("rawatinap/save-pulang-pasien-eklaim", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.popupEditStatusPulang.close();
          $scope.setdetail(set);
        });
      };

      function getdataPulang() {
        medifirstService.get("bridging/inacbg/get-cari-set-form-inacbg-idrg?nosep=" + set.noregistrasi).then(function (e) {
          $scope.item.tglpulang = e.data.data[0].tglpulang;
          $scope.item.noregistrasi = e.data.data[0].noregistrasi;
        });
      }

      function getdataCombo() {
        medifirstService.get("rawatinap/get-combo-pindahpasien").then(function (e) {
          for (var i = 0; i < e.data.statuskeluar.length; i++) {
            e.data.statuskeluar[i].id = parseInt(e.data.statuskeluar[i].id);
          }

          $scope.listStatusKeluar = e.data.statuskeluar;
          $scope.listKondisiPasien = e.data.kondisipasien;
          $scope.listStatusPulang = e.data.statuspulang;
          $scope.listPenyebabKematian = e.data.penyebabkematian;
          $scope.listOnesetkontrkasi = [
            { id: 1, onsetkontraksi: "spontan" },
            { id: 2, onsetkontraksi: "induksi" },
            { id: 3, onsetkontraksi: "non_spontan_non_induksi" },
          ];
          $scope.listdeliverymethod = [
            { id: "vaginal", deliverymethod: "vaginal" },
            { id: "sc", deliverymethod: "sc" },
          ];

          $scope.listLetakjanin = [
            { id: "kepala", letakjanin: "kepala" },
            { id: "sungsang", letakjanin: "sungsang" },
            { id: "lintang ", letakjanin: "lintang " },
          ];
          $scope.listKondisi = [
            { id: "livebirth", kondisi: "livebirth" },
            { id: "stillbirth", kondisi: "stillbirth" },
          ];
          $scope.listYatidak = [
            { id: 0, yatidak: "tidak" },
            { id: 1, yatidak: "ya" },
          ];
        });
      }
      var onDataBound = function (e) {
        $("td").each(function () {
          if ($(this).text() == "false") {
            $(this).text("Belum di Coder");
          }
          if ($(this).text() == "Belum di Coder") {
            $(this).addClass("koneng");
          }
          if ($(this).text() == "BELUM") {
            $(this).text("Belum di Grouping");
          }
          if ($(this).text() == "Belum di Grouping") {
            $(this).addClass("koneng");
          }
          if ($(this).text() == "Edit") {
            $(this).addClass("koneng");
          }
        });
      };
      $scope.gridDiagnosa = {
        pageable: true,
        scrollable: true,
        dataBound: onDataBound,
        selectable: "row",
        columns: [
          {
            title: "#",
            template: "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
            width: 35,
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl. Input",
            width: "85px",
          },
          {
            field: "jenisdiagnosa",
            title: "Jenis Diagnosis",
            width: 150,
          },
          {
            field: "kddiagnosa",
            title: "Kode Diagnosa",
            width: 150,
          },
          {
            field: "namadiagnosa",
            title: "Nama Diagnosa",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: 150,
          },
          {
            field: "keterangan",
            title: "Keterangan",
            width: 150,
          },
          {
            field: "namalengkap",
            title: "Petugas",
            width: "150px",
          },
          {
            title: "",
            width: "150px",
            template: '<button class="k-button custom-button" ng-click="setHapus(dataItem)"  style="margin:0 0 5px">HAPUS</button> ',
          },
        ],
      };
      $scope.gridDiagnosa1 = {
        pageable: true,
        scrollable: true,
        dataBound: onDataBound,
        selectable: "row",
        columns: [
          {
            title: "#",
            template: "{{listGridDiagnosa1.indexOf(dataItem) + 1}}",
            width: 35,
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl. Input",
            width: "85px",
          },
          {
            field: "kddiagnosatindakan",
            title: "Kode Diagnosa",
            width: 150,
          },
          {
            field: "namadiagnosatindakan",
            title: "Nama Diagnosa",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: 150,
          },
          {
            field: "keterangantindakan",
            title: "Keterangan",
            width: "100px",
          },
          {
            field: "namalengkap",
            title: "Petugas",
            width: "150px",
          },
          {
            title: "",
            width: "150px",
            template: '<button class="k-button custom-button" ng-click="setHapus1(dataItem)"  style="margin:0 0 5px">HAPUS</button> ',
          },
        ],
      };

      $scope.simpanBeratBadanBayi = function () {
        if ($scope.item.beratBadan == undefined) {
          alert("Berat Badan Belum Di isi!!");
          return;
        }
        debugger;
        var objSave = {
          beratbadan: $scope.item.beratBadan,
          noregistrasifk: $scope.item.data[0].noregistrasifk,
        };
        medifirstService.post("bridging/inacbg/save-beratbadanbayi", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
          // window.history.back();
        });
      };
      $scope.simpanKantongDarah = function () {
        if ($scope.item.kantongdarah == undefined) {
          alert("Kantong Darah Belum Di isi!!");
          return;
        }
        debugger;
        var objSave = {
          kantongdarah: $scope.item.kantongdarah,
          noregistrasifk: $scope.item.data[0].noregistrasifk,
        };
        medifirstService.post("bridging/inacbg/save-kantongdarah", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
          // window.history.back();
        });
      };
      $scope.simpanApgar = function () {
        debugger;
        var objSave = {
          appearance: $scope.item.appearance,
          pulse: $scope.item.pulse,
          grimace: $scope.item.grimace,
          activity: $scope.item.activity,
          appearance2: $scope.item.appearance2,
          pulse2: $scope.item.pulse2,
          grimace2: $scope.item.grimace2,
          activity2: $scope.item.activity2,
          respiration: $scope.item.respiration,
          respiration2: $scope.item.respiration2,
          noregistrasifk: $scope.item.data[0].noregistrasifk,
        };
        medifirstService.post("bridging/inacbg/save-apgar", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
          // window.history.back();
        });
      };

      $scope.simpanDiagnosaTarget = function () {
        debugger;
        if ($scope.item.diagnosisPrimer == undefined) {
          alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!");
          return;
        }
        if ($scope.dataSelectedDiagnosa == undefined) {
          alert("Silahkan Klik Ruangan Di List Diagnosa!!");
          return;
        }
        var norecDiagnosaPasien = "";
        if ($scope.dataSelectedDiagnosa.norec_diagnosapasien != undefined) {
          norecDiagnosaPasien = $scope.dataSelectedDiagnosa.norec_diagnosapasien;
        }
        $scope.now = new Date();
        var detaildiagnosapasien = {
          norec_dp: norecDiagnosaPasien,
          noregistrasifk: $scope.item.data[0].noregistrasi,
          tglregistrasi: $scope.item.data[0].tglregistrasi,
          objectdiagnosafk: $scope.item.diagnosisPrimer.id,
          tglinputdiagnosa: moment($scope.now).format("YYYY-MM-DD hh:mm:ss"),
          keterangan: "-",
        };
        var objSave = {
          detaildiagnosapasien: detaildiagnosapasien,
        };
        debugger;
        medifirstService.post("registrasi/save-diagnosa-pasien-target", objSave).then(function (e) {
          $scope.now = new Date();
          var detaildiagnosapasien = {
            norec_dp: "",
            noregistrasifk: $scope.item.data[0].noregistrasi,
            code: $scope.item.diagnosisPrimer.kdDiagnosa,
            description: $scope.item.diagnosisPrimer.namaDiagnosa,
            jenisdiagnosainacbgfk: "10",
          };
          var objSave = {
            detaildiagnosapasien: detaildiagnosapasien,
          };
          debugger;
          let text = $scope.item.diagnosisPrimer.kdDiagnosa;
          let result = text.match(/O82/);
          if (result != null) {
            $scope.showpersalinan = true;
          }
          let text2 = $scope.item.diagnosisPrimer.kdDiagnosa;
          let result2 = text2.match(/99/);
          if (result2 != null) {
            $scope.showpersalinan = true;
            $scope.showkantongdarah = true;
          }
          medifirstService.post("registrasi/save-diagnosa-inacbg", objSave).then(function (e) {
            delete $scope.item.diagnosisPrimer;
            $scope.dataSelectedDiagnosa = {};
            $scope.isRouteLoading = false;
            $scope.setdetail(set);
          });
          delete $scope.item.diagnosisPrimer;
          $scope.dataSelectedDiagnosa = {};
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
        });
      };

      $scope.ubahJenisDiagnosa = function (diagnosa) {
        var jenisDiagnosaBaru = diagnosa.jenisdiagnosa === "Primary" ? 2 : 1;
        // var norecdiagnosa = $scope.dataSelectedDiagnosa.norec_diagnosapasien

        medifirstService
          .post("registrasi/ubah-jenis", { detailDiagnosa_norec: diagnosa.norec, inacbgDiagnosa_norec: diagnosa.norec, jenis_diagnosa: jenisDiagnosaBaru })
          .then(function (response) {
            if (response.status === "success") {
              diagnosa.jenisdiagnosa = jenisDiagnosaBaru === 1 ? "Primary" : "Secondary";
              alert(response.message);
            } else {
              alert(response.message);
            }
          })
          .catch(function (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengubah jenis diagnosa.");
          });
      };

      $scope.simpanDiagnosaTarget1 = function () {
        if ($scope.item.diagnosisPrimer1 == undefined) {
          alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!");
          return;
        }
        // if ($scope.item.namaRuangan1.objectruanganfk == undefined) {
        //     alert("Pilih Nama Ruangan ulang!!")
        //     return
        // }
        // if ($scope.dataSelected1 == undefined) {
        //     alert("Silahkan Klik Ruangan Di List Diagnosa!!")
        //     return
        // }
        var norecDiagnosaTindakanPasien = "";
        if ($scope.dataSelected1 != undefined) {
          norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien;
        }
        var keteranganTindakan = "-";
        if ($scope.item.keteranganTindakan != undefined) {
          keteranganTindakan = $scope.item.keteranganTindakan;
        }
        var norec_apd;
        debugger;
        $scope.now = new Date();
        var detaildiagnosatindakanpasien = {
          norec_dp: norecDiagnosaTindakanPasien,
          noregistrasifk: $scope.item.data[0].noregistrasi,
          tglpendaftaran: $scope.item.data[0].tglregistrasi,
          objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
          keterangantindakan: keteranganTindakan,
          jumlah: $scope.item.jumlah,
        };
        var objSave = {
          detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
        };

        medifirstService.post("registrasi/save-diagnosa-tindakan-pasien-target", objSave).then(function (e) {
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
          var detaildiagnosapasien = {
            norec_dp: "",
            noregistrasifk: $scope.item.data[0].noregistrasi,
            code: $scope.item.diagnosisPrimer1.kdDiagnosaTindakan,
            description: $scope.item.diagnosisPrimer1.namaDiagnosaTindakan,
            jenisdiagnosainacbgfk: "9",
            jumlah: $scope.item.jumlah,
          };
          var objSave = {
            detaildiagnosapasien: detaildiagnosapasien,
          };
          debugger;
          delete $scope.item.diagnosisPrimer1;
          medifirstService.post("registrasi/save-diagnosa-inacbg9", objSave).then(function (e) {
            delete $scope.item.diagnosisPrimer1;
            $scope.dataSelectedDiagnosa = {};
            $scope.isRouteLoading = false;
            $scope.setdetail(set);
          });
        });
      };

      $scope.go = function (ai) {
        debugger;
        $scope.dataSelectedDiagnosa = ai;
        //...
      };
      $scope.go9 = function (x) {
        debugger;
        $scope.dataSelected1 = x;
        //...
      };
      $scope.clickHapus = function (ai) {
        debugger;
        var diagnosa = {
          norec_dp: ai.norec_diagnosapasien,
          noregistrasi: ai.noregistrasi,
        };
        var objDelete = {
          diagnosa: diagnosa,
        };
        medifirstService.post("registrasi/daftar-antrian-pasien/delete-diagnosa-pasien-target", objDelete).then(function (e) {
          delete $scope.item.diagnosisPrimer;
          $scope.dataSelectedDiagnosa = {};
          $scope.setdetail(set);
        });
        // $scope.dataSelected1 = ai
        //...
      };
      $scope.clickHapus9 = function (x) {
        var diagnosa = {
            norec_dp: x.norec_diagnosapasien,
            noregistrasi: x.noregistrasi,
        };
        var objDelete = { diagnosa: diagnosa };

        medifirstService.post("registrasi/delete-diagnosa-tindakan-pasien", objDelete).then(function (e) {
            if (!Array.isArray($scope.item.dataDiagnosa9InacbgImport)) {
                $scope.item.dataDiagnosa9InacbgImport = [];
            }

            $scope.item.dataDiagnosa9InacbgImport = $scope.item.dataDiagnosa9InacbgImport.filter(function (d) {
                return d.kddiagnosatindakan !== x.kddiagnosatindakan;
            });

            delete $scope.item.diagnosisPrimer1;
            $scope.dataSelected1 = {};

            $scope.setdetail(set);

            if ($scope.item.data[0].nosep) { 
                var dt1 = {
                    metadata: {
                        method: "idrg_procedure_set",
                        nomor_sep: $scope.item.data[0].nosep
                    },
                    data: {
                        procedure: $scope.item.dataDiagnosa9InacbgImport
                    }
                };
                var dt2 = [dt1];
                var objData = { data: dt2 };

                medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (res) {
                    var responData = res.data.dataresponse;
                    toastr.info("Procedure iDRG berhasil diupdate", "INACBG");

                    $scope.setdetail(set);
                });
            }
        });
    };

      $scope.clickSITB = function () {
        var dt1 = {};
        var dt2 = [];
        dt1 = {
          metadata: {
            method: "sitb_validate",
          },
          data: {
            nomor_sep: set.nosep,
            nomor_register_sitb: $scope.item.nositb,
          },
        };
        dt2.push(dt1);
        var objData = {
          data: dt2,
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
        });
      };
      $scope.clickGrouping = function () {
        debugger;
        if ($scope.item.data[0].nosep == "" || $scope.item.data[0].nosep == null || $scope.item.data[0].nosep == undefined) {
          toastr.error("NOSEP PASIEN BELUM TERISI", "INACBG");
          return;
        }

        if (set.nokepesertaan == "") {
          toastr.error("MINTA ADM SURUH ISI NO KEPESERTAAN PASIEN!!!!!!!", "INACBG");
          return;
        }
        var discharge_status = 0;
        if ($scope.item.data[0].objectstatuspulangfk == 1 || $scope.item.data[0].objectstatuspulangfk == 6 || $scope.item.data[0].objectstatuspulangfk == 13) {
          discharge_status = 1;
        } else if (
          $scope.item.data[0].objectstatuspulangfk == 4 ||
          $scope.item.data[0].objectstatuspulangfk == 5 ||
          $scope.item.data[0].objectstatuspulangfk == 10 ||
          $scope.item.data[0].objectstatuspulangfk == 11 ||
          $scope.item.data[0].objectstatuspulangfk == 7 ||
          $scope.item.data[0].objectstatuspulangfk == 16
        ) {
          discharge_status = 2;
        } else if ($scope.item.data[0].objectstatuspulangfk == 2 || $scope.item.data[0].objectstatuspulangfk == 8 || $scope.item.data[0].objectstatuspulangfk == 3 || $scope.item.data[0].objectstatuspulangfk == 12) {
          discharge_status = 3;
        } else if ($scope.item.data[0].objectstatuspulangfk == 9 || $scope.item.data[0].objectstatuspulangfk == 18) {
          discharge_status = 4;
        } else {
          discharge_status = 5;
        }
        var persalinanfix = "";
        if ($scope.item.datapersalinan.length > 0) {
          var datadelivery = [];

          for (let i = 0; i < $scope.item.datapersalinandelivery.length; i++) {
            var delivery = {
              delivery_sequence: $scope.item.datapersalinandelivery[i].delivery_sequence,
              delivery_method: $scope.item.datapersalinandelivery[i].delivery_method,
              delivery_dttm: $scope.item.datapersalinandelivery[i].delivery_dttm,
              letak_janin: $scope.item.datapersalinandelivery[i].letak_janin,
              kondisi: $scope.item.datapersalinandelivery[i].kondisi,
              use_manual: $scope.item.datapersalinandelivery[i].use_manual,
              use_forcep: $scope.item.datapersalinandelivery[i].use_forcep,
              use_vacuum: $scope.item.datapersalinandelivery[i].use_vacuum,
              shk_spesimen_ambil: $scope.item.datapersalinandelivery[i].shk_spesimen_ambil,
              shk_spesimen_dttm: $scope.item.datapersalinandelivery[i].shk_spesimen_ambil,
              shk_lokasi: $scope.item.datapersalinandelivery[i].shk_lokasi,
            };
            datadelivery.push(delivery);
          }
          for (let i = 0; i < $scope.item.datapersalinan.length; i++) {
            var persalinanfix = {
              usia_kehamilan: $scope.item.datapersalinan[i].usiakehamilan,
              gravida: $scope.item.datapersalinan[i].gravida,
              partus: $scope.item.datapersalinan[i].partus,
              abortus: $scope.item.datapersalinan[i].abortus,
              onset_kontraksi: $scope.item.datapersalinan[i].onset_kontraksi,
              delivery: datadelivery,
            };
          }
        }
        var apgar = "";
        if ($scope.item.appearance != undefined) {
          apgar = {
            menit_1: {
              appearance: $scope.item.appearance,
              pulse: $scope.item.pulse,
              grimace: $scope.item.grimace,
              activity: $scope.item.activity,
              respiration: $scope.item.respiration,
            },
            menit_5: {
              appearance: $scope.item.appearance2,
              pulse: $scope.item.pulse2,
              grimace: $scope.item.grimace2,
              activity: $scope.item.activity2,
              respiration: $scope.item.respiration2,
            },
          };
        }
        var dializer = parseInt($scope.item.dializer);
        if ($scope.item.dializer != undefined) {
          debugger;
          var objSave = {
            dializer: dializer,
            noregistrasifk: $scope.item.data[0].noregistrasifk,
          };
          medifirstService.post("bridging/inacbg/save-dializer", objSave).then(function (e) {
            // $scope.isRouteLoading = false;
            // $scope.setdetail(set)
            // window.history.back();
          });
        }
        $scope.isRouteLoading = true;
        if (set.tipe == "RJ") {
          var dt1 = {};
          var dt2 = [];
          dt1 = {
            metadata: {
              method: "new_claim",
            },
            data: {
              nomor_kartu: set.nokepesertaan,
              nomor_sep: set.nosep,
              nomor_rm: $scope.item.data[0].nocm,
              nama_pasien: $scope.item.data[0].namapasien,
              tgl_lahir: $scope.item.data[0].tgllahir,
              gender: $scope.item.data[0].objectjeniskelaminfk,
            },
          };
          dt2.push(dt1);
          var objData = {
            data: dt2,
          };
          dt1 = {
            metadata: {
              method: "set_claim_data",
              nomor_sep: set.nosep,
            },
            data: {
              nomor_sep: set.nosep, //"0901R001TEST0001",
              nomor_kartu: set.nokepesertaan, //"233333",
              tgl_masuk: $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",
              tgl_pulang: $scope.item.data[0].tglpulang, //"2017-12-01 09:55:00",
              cara_masuk: ($scope.cara_masuk = $scope.item.data[0].kodecaramasuk ? $scope.item.data[0].kodecaramasuk : "gp"),
              jenis_rawat: parseInt($scope.item.data[0].jenisrawat), //"1",
              kelas_rawat: "3", //"1",
              adl_sub_acute: "",
              adl_chronic: "",
              icu_indikator: "",
              icu_los: "",
              ventilator_hour: "",
              ventilator: {
                use_ind: "0",
                start_dttm: "",
                stop_dttm: "",
              },
              upgrade_class_ind: "0",
              upgrade_class_class: "Non Kelas",
              upgrade_class_los: "",
              add_payment_pct: "75",
              birth_weight: $scope.item.data[0].beratbadan,
              sistole: $scope.item.sistoleinacbg,
              diastole: $scope.item.diastoleinacbg,
              discharge_status: discharge_status,
              diagnosa: $scope.item.dataDiagnosa10Inacbg,
              procedure: $scope.item.dataDiagnosa9Inacbg,
              diagnosa_inagrouper: $scope.item.dataDiagnosa10Inacbg, // $scope.item.dataDiagnosaInacbg10Inacbg,
              procedure_inagrouper: $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
              tarif_rs: {
                prosedur_non_bedah: $scope.item.dataTarif.prosedur_non_bedah,
                prosedur_bedah: $scope.item.dataTarif.prosedur_bedah, //"20000000",
                konsultasi: $scope.item.dataTarif.konsultasi, //"300000",
                tenaga_ahli: $scope.item.dataTarif.tenaga_ahli, //"200000",
                keperawatan: $scope.item.dataTarif.keperawatan, // "80000",
                penunjang: $scope.item.dataTarif.penunjang, //"1000000",
                radiologi: $scope.item.dataTarif.radiologi, //"500000",
                laboratorium: $scope.item.dataTarif.laboratorium, //"600000",
                pelayanan_darah: $scope.item.dataTarif.pelayanan_darah, //"150000",
                rehabilitasi: $scope.item.dataTarif.rehabilitasi, //"100000",
                kamar: $scope.item.dataTarif.kamar, //"6000000",
                rawat_intensif: $scope.item.dataTarif.rawat_intensif, //"2500000",
                obat: $scope.item.dataTarif.obat, //"2000000",
                obat_kronis: $scope.item.dataTarif.obat_kronis,
                obat_kemoterapi: $scope.item.dataTarif.obat_kemoterapi,
                alkes: $scope.item.dataTarif.alkes, //"500000",
                bmhp: $scope.item.dataTarif.bmhp, //"400000",
                sewa_alat: $scope.item.dataTarif.sewa_alat, //"210000"
              },
              pemulasaraan_jenazah: 0,
              kantong_jenazah: 0,
              peti_jenazah: 0,
              plastik_erat: 0,
              desinfektan_jenazah: 0,
              mobil_jenazah: 0,
              desinfektan_mobil_jenazah: 0,
              covid19_status_cd: "0",
              nomor_kartu_t: $scope.item.data[0].noidentitas,
              episodes: null,
              covid19_cc_ind: "",
              tarif_poli_eks: 0,
              nama_dokter: $scope.item.data[0].namadokter, //"RUDY, DR",
              kode_tarif: "DP",
              payor_id: $scope.item.data[0].kodejaminan, //"3",
              payor_cd: $scope.item.data[0].jaminan,
              cob_cd: "#",
              // "coder_nik": '123123123123' //"123123123123"
              coder_nik: $scope.dataLogin.noIdentitas,
              persalinan: persalinanfix,
              apgar: apgar,
              kantong_darah: $scope.item.kantongdarah,
              dializer_single_use: dializer,
            },
          };
          dt2.push(dt1);
          var objData = {
            data: dt2,
          };
          medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
            responData = e.data.dataresponse;
            toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
            var dt1 = {};
            var dt2 = [];
            dt1 = {
              metadata: {
                method: "grouper",
                stage: "1",
              },
              data: {
                // "nomor_sep": dataSave[i].nomor_sep
                nomor_sep: set.nosep,
              },
            };
            dt2.push(dt1);
            var objData = {
              data: dt2,
            };
            var totaldijamin = "";
            var hakkelas = "";
            var biayanaikkelas = "0";
            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
              $scope.isRouteLoading = false;
              responData = e.data.dataresponse;
              toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
              toastr.info(responData[0].dataresponse.response.cbg.description, "INACBG");
              if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                toastr.info("JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN", "INACBG");
                return;
              }
              // totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
              totaldijamin = responData[0].dataresponse.response.cbg.tariff;
              $scope.cbgcode = responData[0].dataresponse.response.cbg.code;
              $scope.cbgdescription = responData[0].dataresponse.response.cbg.description;
              $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
              $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, "Rp. ");
              var dataproposi = {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                totalDijamin: totaldijamin,
                biayaNaikkelas: biayanaikkelas,
                cbgcode: $scope.cbgcode,
                cbgdescription: $scope.cbgdescription,
              };
              medifirstService.post("bridging/inacbg/save-proposi-bridging-inacbg", dataproposi).then(function (e) {
                //ini untuk proposional kan utang per tindakan
              });
              $scope.isRouteLoading = false;
              // setdetail(set);
              if (responData[0].dataresponse.special_cmg_option.length > 0) {
                toastr.info("Terdeteksi Top-up CMG Options");
                // dataSEPCMG = responData[0].datarequest.data.nomor_sep
                var responOptions = responData[0].dataresponse.special_cmg_option;
                var spesialDrugx = [];
                var specialProcedurex = [];
                var specialProsthesisx = [];
                var specialInvestigationx = [];
                $scope.tabelTopup = true;
                $scope.showGrouping = false;
                for (let i = 0; i < responOptions.length; i++) {
                  const element = responOptions[i];
                  if (element.type == "Special Drug") {
                    spesialDrugx.push(element);
                    $scope.specialDrug = true;
                  }
                  if (element.type == "Special Procedure") {
                    specialProcedurex.push(element);
                    $scope.specialProcedure = true;
                  }
                  if (element.type == "Special Prosthesis") {
                    specialProsthesisx.push(element);
                    $scope.specialProsthesis = true;
                  }
                  if (element.type == "Special Investigation") {
                    specialInvestigationx.push(element);
                    $scope.specialInvestigation = true;
                  }
                }
                $scope.listspecialdrug = spesialDrugx;
                $scope.listspecialprocedure = specialProcedurex;
                $scope.listspecialprosthesis = specialProsthesisx;
                $scope.listspecialinvestigation = specialInvestigationx;
              }
              $scope.isRouteLoading = false;
              $scope.setdetail(set);
            });
          });
        } else {
          // toastr.error('Grouping Rawat Inap Memakai Menu Klaim InacbgV2', 'INACBG');
          // return;
          var dt1 = {};
          var dt2 = [];
          dt1 = {
            metadata: {
              method: "new_claim",
            },
            data: {
              nomor_kartu: set.nokepesertaan,
              nomor_sep: set.nosep,
              nomor_rm: $scope.item.data[0].nocm,
              nama_pasien: $scope.item.data[0].namapasien,
              tgl_lahir: $scope.item.data[0].tgllahir,
              gender: $scope.item.data[0].objectjeniskelaminfk,
            },
          };
          dt2.push(dt1);
          var objData = {
            data: dt2,
          };
          debugger;
          dt1 = {
            metadata: {
              method: "set_claim_data",
              nomor_sep: set.nosep,
            },
            data: {
              nomor_sep: set.nosep, //"0901R001TEST0001",
              nomor_kartu: set.nokepesertaan, //"233333",
              tgl_masuk: $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",
              tgl_pulang: $scope.item.data[0].tglpulang, //"2017-12-01 09:55:00",
              cara_masuk: ($scope.cara_masuk = $scope.item.data[0].kodecaramasuk ? $scope.item.data[0].kodecaramasuk : "gp"),
              jenis_rawat: parseInt($scope.item.data[0].jenisrawat), //"1",
              kelas_rawat: $scope.item.data[0].nokelasdijamin,
              adl_sub_acute: "",
              adl_chronic: "",
              icu_indikator: $scope.item.datanaikkelas[0].statusrawatintensiv,
              icu_los: $scope.item.datanaikkelas[0].lamarawatintensiv,
              ventilator_hour: $scope.item.data[0].jmljam,
              ventilator: {
                use_ind: $scope.item.useind,
                start_dttm: $scope.item.startDttm,
                stop_dttm: $scope.item.stoptDttm,
              },
              //polri tidak ada naik kelas
              // "upgrade_class_ind": $scope.item.datanaikkelas[0].statusnaikkelas,
              // "upgrade_class_class": $scope.item.datanaikkelas[0].kelastertinggi,
              // "upgrade_class_los": $scope.item.datanaikkelas[0].lamarawatnaikkelas,
              // "upgrade_class_payor": $scope.target_upgrade_class_payor,
              upgrade_class_ind: 0,
              birth_weight: $scope.item.data[0].beratbadan,
              sistole: $scope.item.sistoleinacbg,
              diastole: $scope.item.diastoleinacbg,
              discharge_status: discharge_status,
              diagnosa: $scope.item.dataDiagnosa10Inacbg,
              procedure: $scope.item.dataDiagnosa9Inacbg,
              diagnosa_inagrouper: $scope.item.dataDiagnosa10Inacbg, // $scope.item.dataDiagnosaInacbg10Inacbg,
              procedure_inagrouper: $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
              tarif_rs: {
                prosedur_non_bedah: $scope.item.dataTarif.prosedur_non_bedah,
                prosedur_bedah: $scope.item.dataTarif.prosedur_bedah, //"20000000",
                konsultasi: $scope.item.dataTarif.konsultasi, //"300000",
                tenaga_ahli: $scope.item.dataTarif.tenaga_ahli, //"200000",
                keperawatan: $scope.item.dataTarif.keperawatan, // "80000",
                penunjang: $scope.item.dataTarif.penunjang, //"1000000",
                radiologi: $scope.item.dataTarif.radiologi, //"500000",
                laboratorium: $scope.item.dataTarif.laboratorium, //"600000",
                pelayanan_darah: $scope.item.dataTarif.pelayanan_darah, //"150000",
                rehabilitasi: $scope.item.dataTarif.rehabilitasi, //"100000",
                kamar: $scope.item.dataTarif.kamar, //"6000000",
                rawat_intensif: $scope.item.dataTarif.rawat_intensif, //"2500000",
                obat: $scope.item.dataTarif.obat, //"2000000",
                obat_kronis: $scope.item.dataTarif.obat_kronis,
                obat_kemoterapi: $scope.item.dataTarif.obat_kemoterapi,
                alkes: $scope.item.dataTarif.alkes, //"500000",
                bmhp: $scope.item.dataTarif.bmhp, //"400000",
                sewa_alat: $scope.item.dataTarif.sewa_alat, //"210000"
              },
              pemulasaraan_jenazah: 0,
              kantong_jenazah: 0,
              peti_jenazah: 0,
              plastik_erat: 0,
              desinfektan_jenazah: 0,
              mobil_jenazah: 0,
              desinfektan_mobil_jenazah: 0,
              covid19_status_cd: "0",
              nomor_kartu_t: $scope.item.data[0].noidentitas,
              episodes: null,
              covid19_cc_ind: "",
              tarif_poli_eks: "",
              nama_dokter: $scope.item.data[0].namadokter, //"RUDY, DR",
              kode_tarif: "DP",
              payor_id: $scope.item.data[0].kodejaminan, //"3",
              payor_cd: $scope.item.data[0].jaminan,
              cob_cd: "#",
              // "coder_nik": '123123123123' //"123123123123"
              coder_nik: $scope.dataLogin.noIdentitas,
              persalinan: persalinanfix,
              apgar: apgar,
              kantong_darah: $scope.item.kantongdarah,
              dializer_single_use: dializer,
            },
          };
          dt2.push(dt1);
          var objData = {
            data: dt2,
          };
          medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
            var dt1 = {};
            var dt2 = [];
            dt1 = {
              metadata: {
                method: "grouper",
                stage: "1",
              },
              data: {
                // "nomor_sep": dataSave[i].nomor_sep
                nomor_sep: set.nosep,
              },
            };
            dt2.push(dt1);
            var objData = {
              data: dt2,
            };
            var totaldijamin = "";
            var hakkelas = "";
            var biayanaikkelas = "0";
            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
              responData = e.data.dataresponse;
              if (responData[0].dataresponse.response_inagrouper != undefined) {
                if (responData[0].dataresponse.response_inagrouper.drg_code == 3600019) {
                  toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, "INACBG");
                  $scope.isRouteLoading = false;
                  $scope.showUnrelated = true;
                  return;
                }
              }
              toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
              toastr.info(responData[0].dataresponse.response.cbg.description, "INACBG");
              if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                toastr.info("JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN", "INACBG");
              }

              hakkelas = responData[0].dataresponse.response.kelas;
              if (hakkelas == "kelas_1") {
                totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg;
              } else if (hakkelas == "kelas_2") {
                totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg;
              } else if (hakkelas == "kelas_3") {
                totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg;
              }
              // if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
              if ($scope.item.datanaikkelas[0].statusnaikkelas != "0") {
                biayanaikkelas = responData[0].dataresponse.response.add_payment_amt;
                if (biayanaikkelas < 0) {
                  biayanaikkelas = 0;
                }
              }
              $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
              $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, "Rp. ");
              $scope.cbgcode = responData[0].dataresponse.response.cbg.code;
              $scope.cbgdescription = responData[0].dataresponse.response.cbg.description;
              var dataproposi = {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                totalDijamin: totaldijamin,
                biayaNaikkelas: biayanaikkelas,
                cbgcode: $scope.cbgcode,
                cbgdescription: $scope.cbgdescription,
              };
              medifirstService.post("bridging/inacbg/save-proposi-bridging-inacbg", dataproposi).then(function (e) {
                //ini untuk proposional kan utang per tindakan
              });
              $scope.isRouteLoading = false;
              // setdetail(set);
              if (responData[0].dataresponse.special_cmg_option.length > 0) {
                toastr.info("Terdeteksi Top-up CMG Options");
                // dataSEPCMG = responData[0].datarequest.data.nomor_sep
                var responOptions = responData[0].dataresponse.special_cmg_option;
                var spesialDrugx = [];
                var specialProcedurex = [];
                var specialProsthesisx = [];
                var specialInvestigationx = [];
                $scope.tabelTopup = true;
                $scope.showGrouping = false;
                for (let i = 0; i < responOptions.length; i++) {
                  const element = responOptions[i];
                  if (element.type == "Special Drug") {
                    spesialDrugx.push(element);
                    $scope.specialDrug = true;
                  }
                  if (element.type == "Special Procedure") {
                    specialProcedurex.push(element);
                    $scope.specialProcedure = true;
                  }
                  if (element.type == "Special Prosthesis") {
                    specialProsthesisx.push(element);
                    $scope.specialProsthesis = true;
                  }
                  if (element.type == "Special Investigation") {
                    specialInvestigationx.push(element);
                    $scope.specialInvestigation = true;
                  }
                }
                $scope.listspecialdrug = spesialDrugx;
                $scope.listspecialprocedure = specialProcedurex;
                $scope.listspecialprosthesis = specialProsthesisx;
                $scope.listspecialinvestigation = specialInvestigationx;
              }
              $scope.isRouteLoading = false;
              $scope.setdetail(set);
            });
          });
        }
      };
      $scope.clickTopup = function () {
        var cmg = "";
        if ($scope.item.specialprocedure != undefined) {
          if (cmg != "") {
            cmg = cmg + "#" + $scope.item.specialprocedure.code;
          } else {
            cmg = $scope.item.specialprocedure.code;
          }
        }
        if ($scope.item.specialprosthesis != undefined) {
          if (cmg != "") {
            cmg = cmg + "#" + $scope.item.specialprosthesis.code;
          } else {
            cmg = $scope.item.specialprosthesis.code;
          }
        }
        if ($scope.item.specialinvestigation != undefined) {
          if (cmg != "") {
            cmg = cmg + "#" + $scope.item.specialinvestigation.code;
          } else {
            cmg = $scope.item.specialinvestigation.code;
          }
        }
        if ($scope.item.specialdrug != undefined) {
          if (cmg != "") {
            cmg = cmg + "#" + $scope.item.specialdrug.code;
          } else {
            cmg = $scope.item.specialdrug.code;
          }
        }
        var dt1 = {};
        var dt2 = [];
        dt1 = {
          metadata: {
            method: "grouper",
            stage: "2",
            grouper: "inacbg"
          },
          data: {
            nomor_sep: set.nosep,
            special_cmg: cmg, //"ambil dari table hasil grouper 1"
          },
        };
        dt2.push(dt1);

        var objData = {
          data: dt2,
          noregistrasifk: $scope.item.data[0].noregistrasifk
        };
        var totaldijamin = "";
        var totaldijamina = "";
        var biayanaikkelas = "0";
        var hakkelas = "";
        var cmglength = "";
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          // simpan response ke database
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
          toastr.info(responData[0].dataresponse.response_inacbg.cbg.description, "INACBG");
          cmglength = responData[0].dataresponse.response_inacbg.special_cmg;
          $scope.totalSpesialProcedure = 0;
          $scope.totalSpecialProsthesis = 0;
          $scope.totalSpecialInvestigation = 0;
          $scope.totalSpecialDrug = 0;
          $scope.totalGroup = 0;
          // if(dataSave[0].jenis_rawat==2){
          if (set.tipe == "RJ") {
            totaldijamin = parseFloat(responData[0].dataresponse.response_inacbg.base_tariff);
            for (let i = 0; i < cmglength.length; i++) {
              const element = cmglength[i];
              if (element.type == "Special Drug") {
                if (totaldijamina != "") {
                  totaldijamina = totaldijamina + element.tariff;
                  $scope.totalSpecialDrug = $scope.totalSpecialDrug + element.tariff;
                } else {
                  totaldijamina = element.tariff;
                  $scope.totalSpecialDrug = element.tariff;
                }
              }
              if (element.type == "Special Procedure") {
                if (totaldijamina != "") {
                  totaldijamina = totaldijamina + element.tariff;
                  $scope.totalSpesialProcedure = $scope.totalSpesialProcedure + element.tariff;
                } else {
                  totaldijamina = element.tariff;
                  $scope.totalSpesialProcedure = element.tariff;
                }
              }
              if (element.type == "Special Prosthesis") {
                if (totaldijamina != "") {
                  totaldijamina = totaldijamina + element.tariff;
                  $scope.totalSpecialProsthesis = $scope.totalSpecialProsthesis + element.tariff;
                } else {
                  totaldijamina = element.tariff;
                  $scope.totalSpecialProsthesis = element.tariff;
                }
              }
              if (element.type == "Special Investigation") {
                if (totaldijamina != "") {
                  totaldijamina = totaldijamina + element.tariff;
                  $scope.totalSpecialInvestigation = $scope.totalSpecialInvestigation + element.tariff;
                } else {
                  totaldijamina = element.tariff;
                  $scope.totalSpecialInvestigation = element.tariff;
                }
              }
            }
            totaldijamin = parseFloat(responData[0].dataresponse.response_inacbg.base_tariff);
            totaldijamin = totaldijamin + totaldijamina;
            $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
          } else {
            hakkelas = responData[0].dataresponse.response_inacbg.kelas;
            // if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
            // 	biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
            // }

            // biayanaikkelas = Number($scope.dataPasienSelected.biayanaikkelas)
            // biayanaikkelas=biayanaikkelas.toFixed(0);
            if (hakkelas == "kelas_1") {
              for (let i = 0; i < cmglength.length; i++) {
                const element = cmglength[i];
                if (element.type == "Special Drug") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialDrug = $scope.totalSpecialDrug + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialDrug = element.tariff;
                  }
                }
                if (element.type == "Special Procedure") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpesialProcedure = $scope.totalSpesialProcedure + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpesialProcedure = element.tariff;
                  }
                }
                if (element.type == "Special Prosthesis") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialProsthesis = $scope.totalSpecialProsthesis + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialProsthesis = element.tariff;
                  }
                }
                if (element.type == "Special Investigation") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialInvestigation = $scope.totalSpecialInvestigation + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialInvestigation = element.tariff;
                  }
                }
              }
              totaldijamin = parseFloat(responData[0].dataresponse.response_inacbg.base_tariff);
              totaldijamin = totaldijamin + totaldijamina;
            } else if (hakkelas == "kelas_2") {
              for (let i = 0; i < cmglength.length; i++) {
                const element = cmglength[i];

                if (element.type == "Special Drug") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialDrug = $scope.totalSpecialDrug + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialDrug = element.tariff;
                  }
                }
                if (element.type == "Special Procedure") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpesialProcedure = $scope.totalSpesialProcedure + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpesialProcedure = element.tariff;
                  }
                }
                if (element.type == "Special Prosthesis") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialProsthesis = $scope.totalSpecialProsthesis + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialProsthesis = element.tariff;
                  }
                }
                if (element.type == "Special Investigation") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialInvestigation = $scope.totalSpecialInvestigation + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialInvestigation = element.tariff;
                  }
                }
              }
              totaldijamin = parseFloat(responData[0].dataresponse.response_inacbg.base_tariff);
              totaldijamin = totaldijamin + totaldijamina;
            } else if (hakkelas == "kelas_3") {
              for (let i = 0; i < cmglength.length; i++) {
                const element = cmglength[i];
                if (element.type == "Special Drug") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialDrug = $scope.totalSpecialDrug + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialDrug = element.tariff;
                  }
                }
                if (element.type == "Special Procedure") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpesialProcedure = $scope.totalSpesialProcedure + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpesialProcedure = element.tariff;
                  }
                }
                if (element.type == "Special Prosthesis") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialProsthesis = $scope.totalSpecialProsthesis + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialProsthesis = element.tariff;
                  }
                }
                if (element.type == "Special Investigation") {
                  if (totaldijamina != "") {
                    totaldijamina = totaldijamina + element.tariff;
                    $scope.totalSpecialInvestigation = $scope.totalSpecialInvestigation + element.tariff;
                  } else {
                    totaldijamina = element.tariff;
                    $scope.totalSpecialInvestigation = element.tariff;
                  }
                }
              }
              totaldijamin = parseFloat(responData[0].dataresponse.response_inacbg.base_tariff);
              totaldijamin = totaldijamin + totaldijamina;
            }
          }
          $scope.totalGroup = totaldijamin - $scope.totalSpecialInvestigation - $scope.totalSpecialProsthesis - $scope.totalSpesialProcedure - $scope.totalSpecialDrug;
          $scope.cbgcode = responData[0].dataresponse.response_inacbg.cbg.code;
          $scope.cbgdescription = responData[0].dataresponse.response_inacbg.cbg.description;
          $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
          $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, "Rp. ");
          var dataproposi = {
            noregistrasifk: $scope.item.data[0].noregistrasifk,
            totalDijamin: totaldijamin,
            biayaNaikkelas: biayanaikkelas,
            cbgcode: $scope.cbgcode,
            totalgroup: $scope.totalGroup,
            totalSpecialInvestigation: $scope.totalSpecialInvestigation,
            totalSpecialProsthesis: $scope.totalSpecialProsthesis,
            totalSpesialProcedure: $scope.totalSpesialProcedure,
            totalSpecialDrug: $scope.totalSpecialDrug,
          };
          medifirstService.post("bridging/inacbg/save-proposi-bridging-inacbg", dataproposi).then(function (e) {
            // ini untuk proposional kan utang penjamin per tindakan
          });
          $scope.totalSpecialInvestigationfix = $scope.formatRupiah($scope.totalSpecialInvestigation, "Rp. ");
          $scope.totalSpecialProsthesisfix = $scope.formatRupiah($scope.totalSpecialProsthesis, "Rp. ");
          $scope.totalSpesialProcedurefix = $scope.formatRupiah($scope.totalSpesialProcedure, "Rp. ");
          $scope.totalSpecialDrugfix = $scope.formatRupiah($scope.totalSpecialDrug, "Rp. ");
          $scope.totalGroup = $scope.formatRupiah($scope.totalGroup, "Rp. ");
        });
      };
      $scope.clickSendClaim = function () {
        var dt1 = {};
        var dt2 = [];
        // for (var i = dataSave.length - 1; i >= 0; i--) {
        dt1 = {
          metadata: {
            method: "send_claim_individual",
          },
          data: {
            nomor_sep: set.nosep,
          },
        };
        dt2.push(dt1);
        // }

        var objData = {
          data: dt2,
          noregistrasifk: $scope.item.data[0].noregistrasifk
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          // response simpan ke database
          responData = e.data.dataresponse;
          var datasend = {
            noregistrasifk: $scope.item.data[0].noregistrasifk,
            status: "SEND CLAIM",
          };
          if (responData[0].dataresponse.metadata.code == "200") {
            medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
              //ini untuk proposional kan utang per tindakan
            });
          }
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
        });
      };
      $scope.isClaimFinal = false;
      $scope.clickFinal = function () {
        var dt1 = {};
        var dt2 = [];
        // for (var i = dataSave.length - 1; i >= 0; i--) {
        dt1 = {
          metadata: {
            method: "claim_final",
          },
          data: {
            nomor_sep: set.nosep, //dataSave[i].nomor_sep,
            coder_nik: $scope.dataLogin.noIdentitas,
          },
        };
        dt2.push(dt1);
        // }

        var objData = {
          data: dt2,
          noregistrasifk: $scope.item.data[0].noregistrasifk
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          // response oke saja
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");

          $scope.isClaimFinal = true;
        });
      };
      $scope.clickCetakClaim = function () {
        var dt1 = {};
        var dt2 = [];
        // for (var i = dataSave.length - 1; i >= 0; i--) {
        dt1 = {
          metadata: {
            method: "claim_print",
          },
          data: {
            nomor_sep: set.nosep,
          },
        };
        dt2.push(dt1);
        // }

        var objData = {
          data: dt2,
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          // response simpan ke database
          responData = e.data.dataresponse;
          if (responData[0].dataresponse.metadata.code == 200) {
            const linkSource = "data:application/pdf;base64," + responData[0].dataresponse.data;
            const downloadLink = document.createElement("a");
            var tglprint = moment($scope.now).format("YYYY-MM-DD");
            // const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";
            var a = responData[0].datarequest.data.nomor_sep;
            var nama = a.substr(15);
            console.log(responData[0].datarequest);
            const fileName = a + ", LIP" + ".pdf";

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.setAttribute("target", "_blank");
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            getBase64cetak(linkSource, "kemenkes");
          }
          // window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
        });
      };
      function getBase64cetak(data, jenis) {
        console.log(data);
        // saveFilePapj(data, jenis);
      }

      // function getBase64cetak(data, jenis) {
      //     debugger;
      //     var reader = new FileReader();
      //     var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      //     reader.readAsDataURL(blob);
      //     reader.onload = function () {
      //         var dataWithoutHeader = reader.result.split(',')[1];
      //         console.log(dataWithoutHeader);
      //         saveFilePapj(dataWithoutHeader, jenis);
      //     };
      //     reader.onerror = function (error) {
      //         console.log('Error: ', error);
      //     };
      // }
      function saveFilePapj(file, jenis) {
        let objSave = {
          jenis: jenis,
          noregistrasi: $scope.dataSelected.noregistrasi,
          file: file,
        };
        medifirstService.postNonMessage("registrasi/post-file-papj", objSave).then(function (e) {});
      }
      $scope.clickEditClaim = function () {
        var dt1 = {};
        var dt2 = [];
        dt1 = {
          metadata: {
            method: "reedit_claim",
          },
          data: {
            nomor_sep: set.nosep, //dataSave[i].nomor_sep,
          },
        };
        dt2.push(dt1);

        var objData = {
          data: dt2,
          noregistrasifk: $scope.item.data[0].noregistrasifk
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
          // response oke saja
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
          responData = e.data.dataresponse;
          var datasend = {
            noregistrasifk: $scope.item.data[0].noregistrasifk,
            status: "EDIT CLAIM",
          };
          if (responData[0].dataresponse.metadata.code == "200") {
            medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
              //ini untuk proposional kan utang per tindakan
            });
          }

          $scope.isClaimFinal = false;
        });
      };

      //##show klaim
      $scope.show = function () {
        if ($scope.dataSelected.noregistrasi == undefined) {
          toastr.error("Pilih Data Terlebih Dahulu", "Peringatan");
          return;
        }

        // medifirstService.get('registrasi/get-data-combo-dokumen?jenisdokumen=EKLAIM').then(function (dat) {
        //     $scope.listJenisDokumen = dat.data
        // })
        //##ganti kesini arahan bang jo 26122023
        medifirstService.get("registrasi/get-data-combo-jenisdokumen").then(function (dat) {
          $scope.listJenisDokumen = dat.data.jenisdokumen;

          // Mencari indeks elemen dengan id = 67
          var index = $scope.listJenisDokumen.findIndex(function (elem) {
            return elem.id === "67";
          });

          // Memindahkan elemen dengan id = 67 ke urutan pertama jika ditemukan
          if (index !== -1) {
            var dokumenKEMENKES = $scope.listJenisDokumen.splice(index, 1)[0];
            $scope.listJenisDokumen.unshift(dokumenKEMENKES);
          }
        });

        LoadDataDokumen($scope.dataSelected);

        $scope.isCetakDokumen = true;
        $scope.isCetakAll = false;

        $scope.popUpShow.center().open();

        $scope.cetakAll2();
      };

      function loadDiagnosa() {
        $scope.isRouteLoading = true;
        var param = "";
        param = "noReg=" + $scope.dataSelected.noregistrasi;

        medifirstService.get("emr/get-diagnosapasienbynoregicd9?" + param).then(function (data) {
          tampungdiagnosa9 = data.data.datas;
          $scope.isRouteLoading = false;
          var dataICD9 = data.data.datas;
          // var totalBiayaRS = 0;
          // if (data.data.biayars && data.data.biayars.length > 0) {
          //     totalBiayaRS = data.data.biayars[0].total;
          // }
          // dataICD9.forEach(function (item) {
          //     item.biayars = totalBiayaRS;
          // });
          // $scope.totalBiayaRS = totalBiayaRS;
          $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            data: dataICD9,
            pageSize: 10,
          });
        });

        medifirstService.get("emr/get-diagnosapasienbynoreg?" + param).then(function (data) {
          // let penyakitponekigd = data.data.datas.filter(poneks => poneks.penyakitponekigd == 'gynaecology' || poneks.penyakitponekigd == 'obstetric');
          // if(penyakitponekigd.length > 0) {
          //     $scope.poneks.poneksudah = true;
          // } else {
          //     $scope.poneks.poneksudah = false;
          // }
          var dataICD10 = data.data.datas || [];
          var totalBiayaRS = 0;

          // Ambil total dari biayars
          if (data.data.biayars && data.data.biayars.length > 0) {
              totalBiayaRS = data.data.biayars[0].total;
          }

          // Masukkan total ke setiap item
          dataICD10.forEach(function (item) {
              item.biayars = totalBiayaRS;
          });

          // Simpan juga ke scope (kalau mau dipakai di luar tabel)
          $scope.totalBiayaRS = totalBiayaRS;

          // Buat DataSource Kendo
          $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
              data: dataICD10,
              pageSize: 10,
          });
          tampungdiagnosaIcd10 = data.data.datas;
      });
      }
     
      $scope.TutupPopUpPel = function () {
        $scope.popUpShow.close();
      };
      $scope.cetakSEP = function (x) {
        if ($scope.dataSelected.noregistrasi != undefined && $scope.dataSelected.kelompokpasien !== "Umum/Pribadi") {
          medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" + "&norec=" + $scope.dataSelected.noregistrasi).then(function (data) {
            var data = data.data.data;
            $("#nosepx").text(data[0].nosep);
            $("#nopendaftaran").text(data[0].noregistrasi);
            $("#tglsep").text(data[0].tanggalsep);
            $("#peserta").text(data[0].jenispeserta);
            $("#nokartu").text(data[0].nokepesertaan + " / " + data[0].nocm);
            // $("#cob").text(data[0].penjaminlaka);
            $("#namapeserta").text(data[0].namapeserta);
            $("#jenisrawat").text(data[0].jenisrawat);
            $("#tgllahir").text(moment(data[0].tgllahir).format("YYYY-MM-DD"));
            $("#kelasrawat").text(data[0].namakelas);
            $("#notelepon").text(data[0].notelpmobile);
            $("#penjamin").text(data[0].penjaminlakalantas);
            $("#politujuan").text(data[0].namaruanganfix);
            $("#prolanis").text(data[0].prolanisprb);
            $("#faskesperujuk").text(data[0].nmprovider);
            $("#diagnosaawal").text(data[0].namadiagnosa);
            $("#catatan").text(data[0].catatan);
            $("#cetakanke").text(1);
            $("#namadjpjmelayani").text(data[0].namadjpjpmelayani);

            var printdata = document.getElementById(x);
            printdata = printdata.innerHTML;
            // var editor = $("#editor").data("kendoEditor");
            // editor.value(printdata);

            var htmlStart =
              "<!DOCTYPE html>" +
              '<html style="border:none;border-color: white">' +
              '<head style="border:none;border-color: white">' +
              // '<div class="header" style="position: fixed;top: 0;">'+
              // header +
              "<style>" +
              "html { font: 11pt sans-serif; }" +
              ".k-grid { border-top-width: 0; }" +
              ".k-grid, .k-grid-content { height: auto !important; }" +
              ".k-grid-content { overflow: visible !important; }" +
              ".k-grid .k-grid-header th { border-top: none; }" +
              ".k-grid-toolbar, .k-grid-pager > .k-link { display: none; }" +
              "</style>" +
              "</div>" +
              "</head>" +
              // '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
              '<table  style="border:none; border-color: white">' +
              '<thead style="border:none;border-color: white">' +
              '<tr style="border:none;border-color: white">' +
              '<td style="border:none;border-color: white">' +
              // '<div class="page-header-space"></div>' +
              '<div style="border:none;border-color: white">' +
              // header +
              "</div>" +
              "</td>" +
              "</tr>" +
              "</thead>" +
              "<tbody>" +
              "<tr>" +
              "<td>";
            var htmlEnd = "</td>" + "</tr>" + "</tbody>" + "</body>" + "</div>" + "</html>";
            var printdata = document.getElementById(x);
            printdata = printdata.innerHTML;
            printdata = htmlStart + printdata + htmlEnd;
            // var editor = $("#editor").data("kendoEditor");
            // editor.value(printdata);

            // var cetakan=htmlStart + printableContent + htmlEnd;
            var WindowObject = window.open("", "PrintWindow", "width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

            WindowObject.document.writeln(printdata);
            WindowObject.document.close();
            WindowObject.focus();
          });
        } else {
          toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
          return;
        }
      };
     



      $scope.saveIcd10 = function () {
        if ($scope.item.diagnosa == undefined) {
          toastr.error("Pilih Dulu Kode Diagnosa ICD 10 NYA !!", "Peringatan");
          return;
        }

        validasiIcd10();
        console.log(JSON.stringify($scope.objSave));

        medifirstService
          .post("emr/save-diagnosa-pasien", $scope.objSave)
          .then(function (e) {
            // jika backend kirim status error dalam response sukses
            if (e.data.status && e.data.status != 201) {
              toastr.error(e.data.message || "Gagal menyimpan diagnosa", "Peringatan");
              return;
            }

            // sukses
            medifirstService
              .postLogging(
                "Diagnosis",
                "Norec DiagnosaPasien_T",
                e.data.data.norec,
                "Input Diagnosis ICD 10 ( " +
                  $scope.item.diagnosa.kdDiagnosa +
                  "-" +
                  $scope.item.diagnosa.namaDiagnosa +
                  " )" +
                  " No Registrasi " +
                  $scope.item.noregistrasi +
                  "/ " +
                  $scope.item.noMr
              )
              .then(function (res) {
                $scope.setdetail(set);
              });

            $scope.dataSelected.noregistrasi = $scope.item.noregistrasi_icd10;
            delete $scope.item.jenisDiagnosis;
            delete $scope.item.diagnosa;
            delete $scope.item.keterangan;
            delete $scope.dataIcd10Selected;
            loadDiagnosa();
            $scope.setdetail(set);

            toastr.success("Diagnosa berhasil disimpan", "Sukses");
          })
          .catch(function (err) {
            // tangkap error dari backend (misal validcode / accpdx gagal)
            let msg = "Terjadi kesalahan saat menyimpan data.";
            if (err.data && err.data.message) msg = err.data.message;
            toastr.error(msg, "Peringatan");
          });
      };

      $scope.klikIcd10 = function (dataIcd10Selected) {
        if (dataIcd10Selected.objectjenisdiagnosafk === 2) {
          $scope.item.jenisDiagnosis = {
            id: 1,
            jenisDiagnosa: "Primary",
          };
        } else if (dataIcd10Selected.objectjenisdiagnosafk === 1) {
          $scope.item.jenisDiagnosis = {
            id: 2,
            jenisDiagnosa: "Secondary",
          };
        } else {
          $scope.item.jenisDiagnosis = {
            id: dataIcd10Selected.objectjenisdiagnosafk,
            jenisDiagnosa: dataIcd10Selected.jenisdiagnosa,
          };
        }

        $scope.item.diagnosa = {
          id: dataIcd10Selected.id,
          namaDiagnosa: dataIcd10Selected.namadiagnosa,
          kdDiagnosa: dataIcd10Selected.kddiagnosa,
          kodeNama: dataIcd10Selected.kddiagnosa + " - " + dataIcd10Selected.namadiagnosa,
        };
      };
      function validasiIcd10() {
        var listRawRequired = ["item.diagnosa|k-ng-model|kode / Nama Diagnosa", "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"];
        var isValid = ModelItem.setValidation($scope, listRawRequired);
        if (isValid.status) {
          var norec_diagnosapasien = "";
          var tglinput = "";
          let norec_apd = "";
          // let tglregistrasi = $scope.dataIcd10Selected.tglregistrasi
          var tglregistrasi = "";
          var tglpendaftaran = "";

          if ($scope.dataIcd10Selected != undefined) {
            norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien;
            tglinput = $scope.dataIcd10Selected.tglinputdiagnosa;
            norec_apd = $scope.dataIcd10Selected.norec_apd;
            tglregistrasi = $scope.dataIcd10Selected.tglregistrasi;
            tglpendaftaran = $scope.dataIcd10Selected.tglregistrasi;
            $scope.item.noregistrasi_icd10 = $scope.dataIcd10Selected.noregistrasi;
          } else {
            tglinput = moment($scope.now).format("YYYY-MM-DD hh:mm:ss");
            norec_apd = $scope.item.norec_apd;
            tglregistrasi = $scope.item.tglregistrasi;
            tglpendaftaran = $scope.item.tglregistrasi;
            $scope.item.noregistrasi_icd10 = $scope.item.noregistrasi;
          }
          var keterangan = "";
          if ($scope.item.keterangan == undefined) {
            keterangan = "-";
          } else {
            keterangan = $scope.item.keterangan;
          }

          $scope.now = new Date();

          var data = {
            norec_dp: norec_diagnosapasien,
            noregistrasifk: norec_apd,
            tglregistrasi: tglregistrasi,
            objectdiagnosafk: $scope.item.diagnosa.id,
            objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
            tglinputdiagnosa: tglinput,
            keterangan: keterangan,
            kasusbaru: $scope.item.kasusbaru,
            kasuslama: $scope.item.kasuslama,
            tglpendaftaran: tglpendaftaran,
          };

          $scope.objSave = {
            detaildiagnosapasien: data,
          };
        } else {
          ModelItem.showMessages(isValid.messages);
        }
      }

      $scope.clickHapus10DiagnosaInacbg = function (ai) {
        debugger;
        var diagnosa = {
          norec_dp: ai.norec_diagnosapasien,
          noregistrasi: ai.noregistrasi,
        };
        var objDelete = {
          diagnosa: diagnosa,
        };
        medifirstService.post("registrasi/daftar-antrian-pasien/delete-diagnosa-inacbg10", objDelete).then(function (e) {
          delete $scope.item.diagnosisPrimer;
          $scope.dataSelectedDiagnosa = {};
          $scope.setdetail(set);
        });
        // $scope.dataSelected1 = ai
        //...
      };
      $scope.clickHapus9DiagnosaInacbg = function (ai) {
        debugger;
        var diagnosa = {
          norec_dp: ai.norec_diagnosapasien,
          noregistrasi: ai.noregistrasi,
        };
        var objDelete = {
          diagnosa: diagnosa,
        };
        medifirstService.post("registrasi/daftar-antrian-pasien/delete-diagnosa-inacbg9", objDelete).then(function (e) {
          delete $scope.item.diagnosisPrimer;
          $scope.dataSelectedDiagnosa = {};
          $scope.setdetail(set);
        });
        // $scope.dataSelected1 = ai
        //...
      };


      $scope.klikIcd9 = function (dataIcd9Selected) {
        $scope.item.diagnosaTindakan = {
          id: dataIcd9Selected.id,
          namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
          kodeNama: dataIcd9Selected.kddiagnosatindakan + " - " + dataIcd9Selected.namadiagnosatindakan,
          kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan,
        };
        $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan;
        $scope.findBy = "1";
      };

      function validasi() {
        var listRawRequired = ["item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"];
        var isValid = ModelItem.setValidation($scope, listRawRequired);
        if (isValid.status) {
          let norec_apd = "";
          var norec_diagnosapasien = "";
          var tglpendaftaran = "";
          debugger;
          if ($scope.dataIcd9Selected != undefined) {
            (norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien),
              (norec_apd = $scope.dataIcd9Selected.norec_apd),
              (tglpendaftaran = $scope.dataIcd9Selected.tglregistrasi),
              ($scope.item.noregistrasi_icd9 = $scope.dataIcd9Selected.noregistrasi);
          } else {
            (norec_apd = $scope.item.norec_apd), (tglpendaftaran = $scope.item.tglregistrasi), ($scope.item.noregistrasi_icd9 = $scope.item.noregistrasi);
            // norec_pd = $scope.item.norec
          }
          var ketTindakans = "";
          if ($scope.item.ketTindakan != undefined) {
            ketTindakans = $scope.item.ketTindakan;
          }

          // debugger
          var data = {
            norec_dp: norec_diagnosapasien,
            objectpasienfk: norec_apd,
            tglpendaftaran: tglpendaftaran,
            objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
            keterangantindakan: ketTindakans,
          };

          $scope.objSave = {
            detaildiagnosatindakanpasien: data,
          };
        } else {
          ModelItem.showMessages(isValid.messages);
        }
      }

      $scope.saveIcd9 = function () {
        if ($scope.item.diagnosaTindakan == undefined) {
          toastr.error("Pilih Dulu ICD 9 NYA !!", "Peringatan");
          return;
        }
        validasi();
        console.log(JSON.stringify($scope.objSave));
        medifirstService.post("emr/save-diagnosa-tindakan-pasien", $scope.objSave).then(function (e) {
          medifirstService
            .postLogging(
              "Diagnosis",
              "Norec DiagnosaTindakanPasien_T",
              e.data.data.norec,
              "Input Diagnosis ICD 9 ( " + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + "-" + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + " )" + " No Registrasi " + $scope.item.noregistrasi + "/ " + $scope.item.noMr
            )
            .then(function (res) {});
          $scope.dataSelected.noregistrasi = $scope.item.noregistrasi_icd9;
          delete $scope.item.diagnosaTindakan;
          delete $scope.item.ketTindakan;
          delete $scope.dataIcd9Selected;

          loadDiagnosa();
        });
      };
      // upload dokumen TM
      //   var handleFileSelect2 = function (file) {
      //     debugger
      //     var files = document.getElementById('filePicker2').files;

      //     for (var i = 0; i < files.length; i++) {
      //         //cek filenya

      //       //   if (files[i].size > 1048576) {
      //       // 	  alert('Ukuran foto tidak boleh lebih dari 1 MB !')
      //       // 	  return
      //       //   }
      //     }
      //     if (files.length > 0) {
      //       for (var i = 0; i < files.length; i++) {
      //       getBase642(files[i]);
      //       }
      //     }
      // };

      // if (window.File && window.FileReader && window.FileList && window.Blob) {
      //     document.getElementById('filePicker2').addEventListener('change', handleFileSelect2, false);
      // } else {
      //     alert('The File APIs are not fully supported in this browser.');
      // }
      //   function getBase642(file) {
      //     debugger
      //      var reader = new FileReader();
      //      reader.readAsDataURL(file);
      //      reader.onload = function () {
      //     //    tes.push(reader)
      //     if(pdf2.length > 0) {
      //         pdf2.splice(pdf, 1)
      //     }
      //        console.log(reader.result);
      //        pdf2.push(reader.result);
      //        namaFile2 = file.name
      //        typeFIle2 = file.type
      //      };
      //      reader.onerror = function (error) {
      //        console.log('Error: ', error);
      //      };
      //   }
      //   $scope.simpanDokumenTm = function () {
      //     debugger
      //       let objSave = {
      //           objectruanganfk: $scope.dataSelected.objectruanganlastfk,
      //           norec_pd: $scope.dataSelected.norec,
      //           norec_apd: 'NULL',
      //           dokumen: pdf2[0],
      //           nocmfk: $scope.dataSelected.nocmfk,
      //           namafile: namaFile2,
      //           namapemeriksaan: 'NULL',
      //           keterangan: 'NULL',
      //           jenisdokumenfk: $scope.item.jenisDokumen2.id,
      //           type: typeFIle2,
      //           jenis: $scope.item.jenisDokumen2.jenisdokumen
      //       }
      //       medifirstService.post('registrasi/save-dokumen-penunjang', objSave).then(function(e) {
      //           pdf2 = [];
      //           namaFile2 = '';
      //           typeFIle2 = '';
      //           delete $scope.item.jenisDokumen2
      //           $scope.cetakAll2()
      //           LoadDataDokumen(tampungData)
      //           saveFilePapjup(objSave.dokumen, objSave.jenis)
      //       })
      //   }
      // function saveFilePapjup(file, jenis) {
      //     let objSave = {
      //         'jenis': jenis,
      //         'noregistrasi': $scope.dataSelected.noregistrasi,
      //         'file': file
      //     }
      //     medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function (e) {

      //     });
      // }

      // key 23-12-2024
      // upload multiple dokumen

      $scope.simpanDokumenTm = function () {
        debugger;
        // pastiin semua file sudah dibaca sebelum menyimpan
        if (pdf2.length === 0) {
          alert("Tidak ada file yang dipilih.");
          return;
        }

        // loop melalui semua file yang ada di pdf2
        pdf2.forEach(function (fileData, index) {
          let objSave = {
            objectruanganfk: $scope.dataSelected.objectruanganlastfk,
            norec_pd: $scope.dataSelected.norec,
            norec_apd: "NULL",
            dokumen: fileData,
            nocmfk: $scope.dataSelected.nocmfk,
            namafile: namaFile2[index],
            namapemeriksaan: "NULL",
            keterangan: "NULL",
            jenisdokumenfk: $scope.item.jenisDokumen2.id,
            type: typeFIle2[index],
            jenis: $scope.item.jenisDokumen2.jenisdokumen,
          };

          medifirstService.post("registrasi/save-dokumen-penunjang", objSave).then(function (e) {
            // reset pdf2 dan variabel lainnya kalo perlu
            if (index === pdf2.length - 1) {
              // jika ini adalah file terakhir
              pdf2 = [];
              namaFile2 = [];
              typeFIle2 = [];
              delete $scope.item.jenisDokumen2;
              $scope.cetakAll2();
              LoadDataDokumen(tampungData);
            }
            saveFilePapjup(objSave.dokumen, objSave.jenis);
          });
        });
      };

      function saveFilePapjup(file, jenis) {
        let objSave = {
          jenis: jenis,
          noregistrasi: $scope.dataSelected.noregistrasi,
          file: file,
        };
        medifirstService.postNonMessage("registrasi/post-file-papj", objSave).then(function (e) {});
      }

      $scope.deleteIcd9 = function () {
        if ($scope.item.diagnosaTindakan == undefined) {
          alert("Pilih data yang mau di hapus!!");
          return;
        }
        var diagnosa = {
          norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien,
        };
        var objDelete = {
          diagnosa: diagnosa,
        };
        medifirstService.post("emr/delete-diagnosa-tindakan-pasien", objDelete).then(function (e) {
          medifirstService
            .postLogging(
              "Diagnosis",
              "Norec DiagnosaTindakanPasien_T",
              "",
              "Hapus Diagnosis ICD 9 ( " + $scope.dataIcd9Selected.kddiagnosatindakan + "-" + $scope.dataIcd9Selected.namadiagnosatindakan + " )" + " No Registrasi " + $scope.item.noregistrasi + "/ " + $scope.item.noMr
            )
            .then(function (res) {});
          $scope.dataSelected.noregistrasi = $scope.dataIcd9Selected.noregistrasi;
          delete $scope.item.diagnosaTindakan;
          delete $scope.item.ketTindakan;
          delete $scope.dataIcd9Selected;
          loadDiagnosa();
        });
      };

      $scope.deleteIcd10 = function () {
        if ($scope.item.diagnosa == undefined) {
          alert("Pilih data yang mau di hapus!!");
          return;
        }
        var diagnosa = {
          norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien,
        };
        var objDelete = {
          diagnosa: diagnosa,
        };
        medifirstService.post("emr/delete-diagnosa-pasien", objDelete).then(function (e) {
          medifirstService
            .postLogging(
              "Diagnosis",
              "Norec DiagnosaPasien_T",
              "",
              "Hapus Diagnosis ICD 10 ( " + $scope.dataIcd10Selected.kddiagnosa + "-" + $scope.dataIcd10Selected.namadiagnosa + " )" + " No Registrasi " + $scope.item.noregistrasi + "/ " + $scope.item.noMr
            )
            .then(function (res) {});
          $scope.dataSelected.noregistrasi = $scope.dataIcd10Selected.noregistrasi;
          delete $scope.item.jenisDiagnosis;
          delete $scope.item.diagnosa;
          delete $scope.item.keterangan;
          delete $scope.dataIcd10Selected;
          loadDiagnosa();
        });
      };

      //START IDRG
      //region IDRG
          $scope.groupingSuccess = false;
          $scope.finalIDRGSuccess = false;

          $scope.clickGroupingIDRG = async function () {
              debugger;
              if ($scope.item.data[0].nosep == "" || $scope.item.data[0].nosep == null || $scope.item.data[0].nosep == undefined) {
                toastr.error("NOSEP PASIEN BELUM TERISI", "INACBG");
                return;
              }

              if (set.nokepesertaan == "") {
                toastr.error("MINTA ADM SURUH ISI NO KEPESERTAAN PASIEN!!!!!!!", "INACBG");
                return;
              }

              var discharge_status = 0;
              if ($scope.item.data[0].objectstatuspulangfk == 1 || $scope.item.data[0].objectstatuspulangfk == 6 || $scope.item.data[0].objectstatuspulangfk == 13) {
                discharge_status = 1;
              } else if (
                $scope.item.data[0].objectstatuspulangfk == 4 ||
                $scope.item.data[0].objectstatuspulangfk == 5 ||
                $scope.item.data[0].objectstatuspulangfk == 10 ||
                $scope.item.data[0].objectstatuspulangfk == 11 ||
                $scope.item.data[0].objectstatuspulangfk == 7 ||
                $scope.item.data[0].objectstatuspulangfk == 16
              ) {
                discharge_status = 2;
              } else if ($scope.item.data[0].objectstatuspulangfk == 2 || $scope.item.data[0].objectstatuspulangfk == 8 || $scope.item.data[0].objectstatuspulangfk == 3 || $scope.item.data[0].objectstatuspulangfk == 12) {
                discharge_status = 3;
              } else if ($scope.item.data[0].objectstatuspulangfk == 9 || $scope.item.data[0].objectstatuspulangfk == 18) {
                discharge_status = 4;
              } else {
                discharge_status = 5;
              }
              var persalinanfix = "";
              if ($scope.item.datapersalinan.length > 0) {
                var datadelivery = [];

                for (let i = 0; i < $scope.item.datapersalinandelivery.length; i++) {
                  var delivery = {
                    delivery_sequence: $scope.item.datapersalinandelivery[i].delivery_sequence,
                    delivery_method: $scope.item.datapersalinandelivery[i].delivery_method,
                    delivery_dttm: $scope.item.datapersalinandelivery[i].delivery_dttm,
                    letak_janin: $scope.item.datapersalinandelivery[i].letak_janin,
                    kondisi: $scope.item.datapersalinandelivery[i].kondisi,
                    use_manual: $scope.item.datapersalinandelivery[i].use_manual,
                    use_forcep: $scope.item.datapersalinandelivery[i].use_forcep,
                    use_vacuum: $scope.item.datapersalinandelivery[i].use_vacuum,
                    shk_spesimen_ambil: $scope.item.datapersalinandelivery[i].shk_spesimen_ambil,
                    shk_spesimen_dttm: $scope.item.datapersalinandelivery[i].shk_spesimen_ambil,
                    shk_lokasi: $scope.item.datapersalinandelivery[i].shk_lokasi,
                  };
                  datadelivery.push(delivery);
                }
                for (let i = 0; i < $scope.item.datapersalinan.length; i++) {
                  var persalinanfix = {
                    usia_kehamilan: $scope.item.datapersalinan[i].usiakehamilan,
                    gravida: $scope.item.datapersalinan[i].gravida,
                    partus: $scope.item.datapersalinan[i].partus,
                    abortus: $scope.item.datapersalinan[i].abortus,
                    onset_kontraksi: $scope.item.datapersalinan[i].onset_kontraksi,
                    delivery: datadelivery,
                  };
                }
              }
              var apgar = "";
              if ($scope.item.appearance != undefined) {
                apgar = {
                  menit_1: {
                    appearance: $scope.item.appearance,
                    pulse: $scope.item.pulse,
                    grimace: $scope.item.grimace,
                    activity: $scope.item.activity,
                    respiration: $scope.item.respiration,
                  },
                  menit_5: {
                    appearance: $scope.item.appearance2,
                    pulse: $scope.item.pulse2,
                    grimace: $scope.item.grimace2,
                    activity: $scope.item.activity2,
                    respiration: $scope.item.respiration2,
                  },
                };
              }
              var dializer = parseInt($scope.item.dializer);
              if ($scope.item.dializer != undefined) {
                debugger;
                var objSave = {
                  dializer: dializer,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                medifirstService.post("bridging/inacbg/save-dializer", objSave).then(function (e) {
                  // $scope.isRouteLoading = false;
                  // $scope.setdetail(set)
                  // window.history.back();
                });
              }
              $scope.isRouteLoading = true;
              if (set.tipe == "RJ") {
                var dt1 = {};
                var dt2 = [];
                dt1 = {
                  metadata: {
                    method: "new_claim",
                  },
                  data: {
                    nomor_kartu: set.nokepesertaan,
                    nomor_sep: set.nosep,
                    nomor_rm: $scope.item.data[0].nocm,
                    nama_pasien: $scope.item.data[0].namapasien,
                    tgl_lahir: $scope.item.data[0].tgllahir,
                    gender: $scope.item.data[0].objectjeniskelaminfk,
                    // noregistrasifk: $scope.item.data[0].noregistrasifk,
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                dt1 = {
                  metadata: {
                    method: "set_claim_data",
                    nomor_sep: set.nosep,
                  },
                  data: {
                    nomor_sep: set.nosep, //"0901R001TEST0001",
                    nomor_kartu: set.nokepesertaan, //"233333",
                    tgl_masuk: $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",
                    tgl_pulang: $scope.item.data[0].tglpulang, //"2017-12-01 09:55:00",
                    cara_masuk: ($scope.cara_masuk = $scope.item.data[0].kodecaramasuk ? $scope.item.data[0].kodecaramasuk : "gp"),
                    jenis_rawat: parseInt($scope.item.data[0].jenisrawat), //"1",
                    kelas_rawat: "3", //"1",
                    adl_sub_acute: "",
                    adl_chronic: "",
                    icu_indikator: "",
                    icu_los: "",
                    ventilator_hour: "",
                    ventilator: {
                      use_ind: "0",
                      start_dttm: "",
                      stop_dttm: "",
                    },
                    upgrade_class_ind: 0,
                    upgrade_class_class: "Non Kelas",
                    upgrade_class_los: "",
                    add_payment_pct: "75",
                    birth_weight: $scope.item.data[0].beratbadan,
                    sistole: $scope.item.sistoleinacbg,
                    diastole: $scope.item.diastoleinacbg,
                    discharge_status: discharge_status,
                    // diagnosa: $scope.item.dataDiagnosa10Inacbg,
                    // procedure: $scope.item.dataDiagnosa9Inacbg,
                    // diagnosa_inagrouper: $scope.item.dataDiagnosa10Inacbg, // $scope.item.dataDiagnosaInacbg10Inacbg,
                    // procedure_inagrouper: $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
                    tarif_rs: {
                      prosedur_non_bedah: $scope.item.dataTarif.prosedur_non_bedah,
                      prosedur_bedah: $scope.item.dataTarif.prosedur_bedah, //"20000000",
                      konsultasi: $scope.item.dataTarif.konsultasi, //"300000",
                      tenaga_ahli: $scope.item.dataTarif.tenaga_ahli, //"200000",
                      keperawatan: $scope.item.dataTarif.keperawatan, // "80000",
                      penunjang: $scope.item.dataTarif.penunjang, //"1000000",
                      radiologi: $scope.item.dataTarif.radiologi, //"500000",
                      laboratorium: $scope.item.dataTarif.laboratorium, //"600000",
                      pelayanan_darah: $scope.item.dataTarif.pelayanan_darah, //"150000",
                      rehabilitasi: $scope.item.dataTarif.rehabilitasi, //"100000",
                      kamar: $scope.item.dataTarif.kamar, //"6000000",
                      rawat_intensif: $scope.item.dataTarif.rawat_intensif, //"2500000",
                      obat: $scope.item.dataTarif.obat, //"2000000",
                      obat_kronis: $scope.item.dataTarif.obat_kronis,
                      obat_kemoterapi: $scope.item.dataTarif.obat_kemoterapi,
                      alkes: $scope.item.dataTarif.alkes, //"500000",
                      bmhp: $scope.item.dataTarif.bmhp, //"400000",
                      sewa_alat: $scope.item.dataTarif.sewa_alat, //"210000"
                    },
                    pemulasaraan_jenazah: 0,
                    kantong_jenazah: 0,
                    peti_jenazah: 0,
                    plastik_erat: 0,
                    desinfektan_jenazah: 0,
                    mobil_jenazah: 0,
                    desinfektan_mobil_jenazah: 0,
                    covid19_status_cd: "0",
                    nomor_kartu_t: $scope.item.data[0].noidentitas,
                    episodes: null,
                    covid19_cc_ind: "",
                    tarif_poli_eks: 0,
                    nama_dokter: $scope.item.data[0].namadokter, //"RUDY, DR",
                    kode_tarif: "DP",
                    payor_id: $scope.item.data[0].kodejaminan, //"3",
                    payor_cd: $scope.item.data[0].jaminan,
                    cob_cd: "#",
                    // "coder_nik": '123123123123' //"123123123123"
                    coder_nik: $scope.dataLogin.noIdentitas,
                    persalinan: persalinanfix,
                    apgar: apgar,
                    kantong_darah: $scope.item.kantongdarah,
                    dializer_single_use: dializer,
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk
                };
                dt1 = {
                  metadata: {
                    method: "idrg_diagnosa_set",
                    nomor_sep: set.nosep
                  },
                  data: {
                    diagnosa: $scope.item.dataDiagnosa10Inacbg
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                dt1 = {
                  metadata: {
                    method: "idrg_procedure_set",
                    nomor_sep: set.nosep
                  },
                  data: {
                    procedure: $scope.item.dataDiagnosa9InacbgImport
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
                  responData = e.data.dataresponse;
                //   toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
                  var dt1 = {};
                  var dt2 = [];
                  dt1 = {
                    metadata: {
                      method: "grouper",
                      stage: "1",
                      grouper: "idrg"
                    },
                    data: {
                      // "nomor_sep": dataSave[i].nomor_sep
                      nomor_sep: set.nosep,
                    },
                  };
                  dt2.push(dt1);
                  var objData = {
                    data: dt2,
                    noregistrasifk: $scope.item.data[0].noregistrasifk,
                  };
                  var totaldijamin = "";
                  var hakkelas = "";
                  var biayanaikkelas = "0";
                  medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
                    $scope.isRouteLoading = false;
                    responData = e.data.dataresponse;
                    if (responData[0].dataresponse.metadata.code == 400) {
                        var message = responData[0].dataresponse.metadata.message || "Terjadi kesalahan (400)";
                        toastr.error(message, "Error");
                        $scope.isRouteLoading = false;
                        return; 
                    }
                    $scope.MdcNumber = responData[0].dataresponse.response_idrg.mdc_number;
                    $scope.MdcDescription = responData[0].dataresponse.response_idrg.mdc_description;
                    $scope.DrgCode = responData[0].dataresponse.response_idrg.drg_code;
                    $scope.DrgDescription = responData[0].dataresponse.response_idrg.drg_description;

                    if (responData[0].dataresponse.metadata.message == 'iDRG coding sudah final') {
                        $scope.groupingSuccess = true;
                    }

                    var datasend = {
                      noregistrasifk: $scope.item.data[0].noregistrasifk,
                      status: "GROUPING IDRG",
                    };
                    if (responData[0].dataresponse.metadata.code == 200 || responData[0].dataresponse.metadata.code == "200") {
                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                        // Debug log response
                        if (e && e.data && e.data.status == 201) {
                          console.log("Update status GROUPING IDRG sukses", e.data);
                        } else {
                          console.error("Gagal update status GROUPING IDRG", e);
                        }
                      });
                    }

                    // jika berhasil 
                    $scope.groupingSuccess = true;

                    $scope.isRouteLoading = false;
                    $scope.setdetail(set);
                  });
                });
              } else {
                // toastr.error('Grouping Rawat Inap Memakai Menu Klaim InacbgV2', 'INACBG');
                // return;
                var dt1 = {};
                var dt2 = [];
                dt1 = {
                  metadata: {
                    method: "new_claim",
                  },
                  data: {
                    nomor_kartu: set.nokepesertaan,
                    nomor_sep: set.nosep,
                    nomor_rm: $scope.item.data[0].nocm,
                    nama_pasien: $scope.item.data[0].namapasien,
                    tgl_lahir: $scope.item.data[0].tgllahir,
                    gender: $scope.item.data[0].objectjeniskelaminfk,
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                debugger;
                dt1 = {
                  metadata: {
                    method: "set_claim_data",
                    nomor_sep: set.nosep,
                  },
                  data: {
                    nomor_sep: set.nosep, //"0901R001TEST0001",
                    nomor_kartu: set.nokepesertaan, //"233333",
                    tgl_masuk: $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",
                    tgl_pulang: $scope.item.data[0].tglpulang, //"2017-12-01 09:55:00",
                    cara_masuk: ($scope.cara_masuk = $scope.item.data[0].kodecaramasuk ? $scope.item.data[0].kodecaramasuk : "gp"),
                    jenis_rawat: parseInt($scope.item.data[0].jenisrawat), //"1",
                    kelas_rawat: $scope.item.data[0].nokelasdijamin,
                    adl_sub_acute: "",
                    adl_chronic: "",
                    icu_indikator: $scope.item.datanaikkelas[0].statusrawatintensiv,
                    icu_los: $scope.item.datanaikkelas[0].lamarawatintensiv,
                    ventilator_hour: $scope.item.data[0].jmljam,
                    ventilator: {
                      use_ind: $scope.item.useind,
                      start_dttm: $scope.item.startDttm,
                      stop_dttm: $scope.item.stoptDttm,
                    },
                    //polri tidak ada naik kelas
                    upgrade_class_ind: $scope.item.datanaikkelas[0].statusnaikkelas,
                    upgrade_class_class: $scope.item.datanaikkelas[0].kelastertinggi,
                    upgrade_class_los: $scope.item.datanaikkelas[0].lamarawatnaikkelas,
                    // "upgrade_class_payor": $scope.target_upgrade_class_payor,
                    // upgrade_class_ind: "0",
                    birth_weight: $scope.item.data[0].beratbadan,
                    sistole: $scope.item.sistoleinacbg,
                    diastole: $scope.item.diastoleinacbg,
                    discharge_status: discharge_status,
                    // diagnosa: $scope.item.dataDiagnosa10Inacbg,
                    // procedure: $scope.item.dataDiagnosa9Inacbg,
                    // diagnosa_inagrouper: $scope.item.dataDiagnosa10Inacbg, // $scope.item.dataDiagnosaInacbg10Inacbg,
                    // procedure_inagrouper: $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
                    tarif_rs: {
                      prosedur_non_bedah: $scope.item.dataTarif.prosedur_non_bedah,
                      prosedur_bedah: $scope.item.dataTarif.prosedur_bedah, //"20000000",
                      konsultasi: $scope.item.dataTarif.konsultasi, //"300000",
                      tenaga_ahli: $scope.item.dataTarif.tenaga_ahli, //"200000",
                      keperawatan: $scope.item.dataTarif.keperawatan, // "80000",
                      penunjang: $scope.item.dataTarif.penunjang, //"1000000",
                      radiologi: $scope.item.dataTarif.radiologi, //"500000",
                      laboratorium: $scope.item.dataTarif.laboratorium, //"600000",
                      pelayanan_darah: $scope.item.dataTarif.pelayanan_darah, //"150000",
                      rehabilitasi: $scope.item.dataTarif.rehabilitasi, //"100000",
                      kamar: $scope.item.dataTarif.kamar, //"6000000",
                      rawat_intensif: $scope.item.dataTarif.rawat_intensif, //"2500000",
                      obat: $scope.item.dataTarif.obat, //"2000000",
                      obat_kronis: $scope.item.dataTarif.obat_kronis,
                      obat_kemoterapi: $scope.item.dataTarif.obat_kemoterapi,
                      alkes: $scope.item.dataTarif.alkes, //"500000",
                      bmhp: $scope.item.dataTarif.bmhp, //"400000",
                      sewa_alat: $scope.item.dataTarif.sewa_alat, //"210000"
                    },
                    pemulasaraan_jenazah: 0,
                    kantong_jenazah: 0,
                    peti_jenazah: 0,
                    plastik_erat: 0,
                    desinfektan_jenazah: 0,
                    mobil_jenazah: 0,
                    desinfektan_mobil_jenazah: 0,
                    covid19_status_cd: "0",
                    nomor_kartu_t: $scope.item.data[0].noidentitas,
                    episodes: null,
                    covid19_cc_ind: "",
                    tarif_poli_eks: "",
                    nama_dokter: $scope.item.data[0].namadokter, //"RUDY, DR",
                    kode_tarif: "DP",
                    payor_id: $scope.item.data[0].kodejaminan, //"3",
                    payor_cd: $scope.item.data[0].jaminan,
                    cob_cd: "#",
                    // coder_nik: '123123123123' //"123123123123"
                    coder_nik: $scope.dataLogin.noIdentitas,
                    persalinan: persalinanfix,
                    apgar: apgar,
                    kantong_darah: $scope.item.kantongdarah,
                    dializer_single_use: dializer,
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk
                };
                dt1 = {
                  metadata: {
                    method: "idrg_diagnosa_set",
                    nomor_sep: set.nosep
                  },
                  data: {
                    diagnosa: $scope.item.dataDiagnosa10Inacbg
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                };
                dt1 = {
                  metadata: {
                    method: "idrg_procedure_set",
                    nomor_sep: set.nosep
                  },
                  data: {
                    procedure: $scope.item.dataDiagnosa9InacbgImport
                  },
                };
                dt2.push(dt1);
                var objData = {
                  data: dt2,
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                };
                medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
                  var dt1 = {};
                  var dt2 = [];
                  dt1 = {
                    metadata: {
                      method: "grouper",
                      stage: "1",
                      grouper: "idrg"
                    },
                    data: {
                      // "nomor_sep": dataSave[i].nomor_sep
                      nomor_sep: set.nosep,
                    },
                  };
                  dt2.push(dt1);
                  var objData = {
                    data: dt2,
                    noregistrasifk: $scope.item.data[0].noregistrasifk,
                  };
                  medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
                    responData = e.data.dataresponse;
                    if (responData[0].dataresponse.metadata.code == 400) {
                        var message = responData[0].dataresponse.metadata.message || "Terjadi kesalahan (400)";
                        toastr.error(message, "Error");
                        $scope.isRouteLoading = false;
                        return; 
                    }
                    $scope.MdcNumber = responData[0].dataresponse.response_idrg.mdc_number;
                    $scope.MdcDescription = responData[0].dataresponse.response_idrg.mdc_description;
                    $scope.DrgCode = responData[0].dataresponse.response_idrg.drg_code;
                    $scope.DrgDescription = responData[0].dataresponse.response_idrg.drg_description;

                    if (responData[0].dataresponse.metadata.message == 'iDRG coding sudah final') {
                        $scope.groupingSuccess = true;
                    }

                    var datasend = {
                      noregistrasifk: $scope.item.data[0].noregistrasifk,
                      status: "GROUPING IDRG",
                    };
                    if (responData[0].dataresponse.metadata.code == 200 || responData[0].dataresponse.metadata.code == "200") {
                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                        // Debug log response
                        if (e && e.data && e.data.status == 201) {
                          console.log("Update status GROUPING IDRG sukses", e.data);
                        } else {
                          console.error("Gagal update status GROUPING IDRG", e);
                        }
                      });
                    }

                    $scope.groupingSuccess = true;
                    $scope.isRouteLoading = false;
                    $scope.setdetail(set);
                  });
                });
              }
          };

          $scope.clickFinalIDRG = function () {
              var dt1 = {};
              var dt2 = [];
              dt1 = {
                metadata: {
                  method: "idrg_grouper_final",
                },
                data: {
                  nomor_sep: set.nosep,
                },
              };
              dt2.push(dt1);

              var objData = {
                data: dt2,
                noregistrasifk: $scope.item.data[0].noregistrasifk
              };
              medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
                // response simpan ke database
                responData = e.data.dataresponse;
                var datasend = {
                  noregistrasifk: $scope.item.data[0].noregistrasifk,
                  status: "FINAL IDRG",
                };
                if (responData[0].dataresponse.metadata.code == "200") {
                  medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                    //ini untuk proposional kan utang per tindakan
                  });

                  $scope.finalIDRGSuccess = true;
                  $scope.reeditSuccess = false;
                  $scope.listDiagnosa10Inacbg = [];
                  $scope.item.diagnosastring = "";
                }
                toastr.info(responData[0].dataresponse.metadata.message, "FINAL IDRG");
              });
              $scope.finalIDRGSuccess = true;
              $scope.reeditSuccess = false;
              // Paksa Angular update view
                $scope.$applyAsync();
          };

          $scope.clickImportToINACBG = function () {
              var dt1 = {
                  metadata: { method: "idrg_to_inacbg_import" },
                  data: { nomor_sep: set.nosep },
              };

              var objData = { 
                data: [dt1],
                noregistrasifk: $scope.item.data[0].noregistrasifk,
               };

              medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData)
                  .then(function (e) {
                      responData = e.data.dataresponse;

                      var datasend = {
                        noregistrasifk: $scope.item.data[0].noregistrasifk,
                        status: "IMPORT TO INACBG",
                      };
                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                        });
                      if (responData[0].dataresponse.metadata.code == "200") {
                          toastr.info(responData[0].dataresponse.metadata.message, "IMPORT To INACBG");

                      } else {
                          toastr.error(responData[0].dataresponse.metadata.message, "IMPORT To INACBG Belum Berhasil");
                      }

                      $scope.getDiagnosaInacbg();
                      $scope.getProcedureInacbg();
                  });
                  $scope.ImportSuccess = true;
          };
 
          $scope.reeditClaimIdrg = async function () { 
              if (window.confirm('Yakin edit ulang idrg ?')) {
                  try {
                      const r = await medifirstService.post(
                          "bridging/inacbg/save-bridging-inacbg-idrg", {
                              data: [{
                                  metadata: { method: "idrg_grouper_reedit" },
                                  data: { nomor_sep: set.nosep }
                              }],
                              noregistrasifk: $scope.item.data[0].noregistrasifk
                          }
                      );

                      // Update state
                      $scope.reeditSuccess = true;
                      $scope.finalIDRGSuccess = false;

                      // Paksa Angular update view
                      $scope.$applyAsync();

                      var datasend = {
                        noregistrasifk: $scope.item.data[0].noregistrasifk,
                        status: "EDIT IDRG",
                      };
                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                      });

                      console.log("EDIT", $scope.reeditSuccess);
                      console.log("FINAL IDRG", $scope.finalIDRGSuccess);

                      toastr.success('Edit ulang IDRG berhasil, silakan lakukan grouping kembali.', 'INACBG');

                  } catch (error) {
                      toastr.error('Gagal re-edit claim IDRG!', 'INACBG');
                      console.error(error);
                  }
              }
          };

          // Inisialisasi objek item
          $scope.item = {
            diagnosa10: null,
            diagnosastring: "",
            diagnosa9: null,
            procedurestring: ""
          };

          $scope.getDiagnosaInacbg = function () {
            var dt1 = {
              metadata: { method: "inacbg_diagnosa_get" },
              data: { nomor_sep: set.nosep },
            };

            var objData = { 
              data: [dt1],
              noregistrasifk: $scope.item.data[0].noregistrasifk,

             };

            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData)
              .then(function (res) {
                let responData = res.data.dataresponse;

                // ambil expanded array langsung
                let expanded = responData[0].dataresponse.data?.expanded || [];
                $scope.listDiagnosa10Inacbg = Array.isArray(expanded) ? expanded : [];

                // simpan string juga kalau butuh
                $scope.item.diagnosastring = responData[0].dataresponse.data?.string || "";
                $scope.$applyAsync();
              });
          };

          // SIMPAN ICD-10
          $scope.saveICD10inacbg = function () {
            if (!$scope.item.diagnosa10) {
              toastr.error("Diagnosa harus diisi!");
              return;
            }

            if (!$scope.item.diagnosa10.kdDiagnosa) {
              toastr.error("Harap pilih Diagnosa dengan benar!");
              return;
            }

            let kode = $scope.item.diagnosa10.kdDiagnosa;

            // cek duplikat di list
            let exists = $scope.listDiagnosa10Inacbg.some(d => d.code === kode);
            if (!exists) {
              // kalau belum ada, masukkan ke list
              $scope.listDiagnosa10Inacbg.push({
                code: kode,
                display: $scope.item.diagnosa10.namaDiagnosa,
                metadata: { code: "200", message: "Ok" }
              });
            }

            // rakit ulang diagnosastring dari seluruh isi list
            $scope.item.diagnosastring = $scope.listDiagnosa10Inacbg
              .map(d => d.code)
              .join("#");

            // kirim ke server dengan semua diagnosa
            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", {
              data: [
                {
                  metadata: {
                    method: "inacbg_diagnosa_set",
                    nomor_sep: set.nosep
                  },
                  data: {
                    diagnosa: $scope.item.diagnosastring
                  }
                }
              ],
              noregistrasifk: $scope.item.data[0].noregistrasifk
            }).then(res => {
              const meta = res.dataresponse[0].dataresponse.metadata;
              if (meta.code == 200) {
                toastr.success("Semua diagnosa tersimpan!");
                $scope.$applyAsync();
              } else {
                toastr.error(meta.message);
              }
            });

            // reset combobox
            $scope.item.diagnosa10 = null;
          };

          // buka modal edit
          $scope.editICD10 = function (list) {
            $scope.popupEditDiagnosa.center().open();
            $scope.itemBeingEdited = list; // simpan item yg diedit
            $scope.editItem = null;        // reset combo box
          };

          // simpan hasil edit
          $scope.updateDiagnosa = async function () {
            if (!$scope.editItem || !$scope.editItem.kdDiagnosa) {
              toastr.error("Harap pilih diagnosa yang valid!");
              return;
            }

            // update item di list
            $scope.itemBeingEdited.code = $scope.editItem.kdDiagnosa;
            $scope.itemBeingEdited.display = $scope.editItem.namaDiagnosa;
            $scope.itemBeingEdited.metadata = { code: "200", message: "Ok" };

            $scope.popupEditDiagnosa.close();

            // kirim ulang semua diagnosa
            await $scope.saveAllDiagnosa();
          };

          // hapus diagnosa
          $scope.hapusICD10Inacbg = async function (item) {
            $scope.listDiagnosa10Inacbg = $scope.listDiagnosa10Inacbg.filter(d => d.code !== item.code);
            await $scope.saveAllDiagnosa();
          };

          // fungsi utama simpan semua diagnosa
          $scope.saveAllDiagnosa = async function () {
            let diagnosaString = $scope.listDiagnosa10Inacbg
              .map(d => d.code)
              .filter(c => c && c.toLowerCase() !== "undefined")
              .join("#");

            try {
              const res = await medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", {
                data: [{
                  metadata: {
                    method: "inacbg_diagnosa_set",
                    nomor_sep: set.nosep
                  },
                  data: { diagnosa: diagnosaString }
                }],
                noregistrasifk: $scope.item.data[0].noregistrasifk
              });

              const meta = res.data.dataresponse[0].dataresponse.metadata;
              if (meta.code == 200) {
                toastr.success("Diagnosa berhasil diperbarui");
                $scope.getDiagnosaInacbg();
              } else {
                toastr.error(meta.message || "Gagal update diagnosa");
              }
            } catch (err) {
              toastr.error("Error simpan diagnosa");
              console.error(err);
            }
          };

          $scope.getProcedureInacbg = function () {
              var dt1 = {
                  metadata: { method: "inacbg_procedure_get" },
                  data: { nomor_sep: set.nosep },
              };

              var objData = { 
                data: [dt1],
                noregistrasifk: $scope.item.data[0].noregistrasifk
               };

            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData)
              .then(function (res) {
                let responData = res.data.dataresponse;

                // ambil expanded array langsung
                let expanded = responData[0].dataresponse.data?.expanded || [];
                $scope.listProcedureInacbg = Array.isArray(expanded) ? expanded : [];

                // simpan string juga kalau butuh
                $scope.item.procedurestring = responData[0].dataresponse.data?.string || "";
                $scope.$applyAsync();
              });
          };

        // SIMPAN ICD-9
          $scope.listProcedureInacbg = $scope.listProcedureInacbg || [];

          $scope.saveICD9Inacbg = function () {
              if (!$scope.item.diagnosa9) {
                toastr.error("Diagnosa harus diisi!");
                return;
              }

              // ambil kode & nama dari combo-box response
              let kode = $scope.item.diagnosa9.kddiagnosatindakan;
              let nama = $scope.item.diagnosa9.namaDiagnosaTindakan;

              if (!kode) {
                toastr.error("Harap pilih Diagnosa dengan benar!");
                return;
              }

              // cek duplikat
              let exists = $scope.listProcedureInacbg.some(d => d.code === kode);
              if (!exists) {
                $scope.listProcedureInacbg.push({
                  code: kode,
                  display: nama,
                  metadata: { code: "200", message: "Ok" }
                });
              }

              // rakit ulang procedurestring
              $scope.item.procedurestring = $scope.listProcedureInacbg
                .map(d => d.code)
                .join("#");

              // kirim ke server
              medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", {
                data: [
                  {
                    metadata: {
                      method: "inacbg_procedure_set",
                      nomor_sep: set.nosep
                    },
                    data: {
                      procedure: $scope.item.procedurestring
                    }
                  }
                ],
                noregistrasifk: $scope.item.data[0].noregistrasifk
              }).then(res => {
                const meta = res.dataresponse[0].dataresponse.metadata;
                if (meta.code == 200) {
                  toastr.success("Semua procedure tersimpan!");
                  $scope.$applyAsync();
                } else {
                  toastr.error(meta.message);
                }
              });

              // reset combobox
              $scope.item.diagnosa9 = null;
            };

            // buka modal edit diagnosa 9
            $scope.editICD9 = function (list) {
              $scope.popupEditDiagnosa9.center().open();
              $scope.itemBeingEdited9 = list; // simpan item yg diedit
              $scope.editItem9 = null;        // reset combo box
            };

            // simpan hasil edit diagnosa 9
            $scope.updateDiagnosa9 = async function () {
              console.log("editItem9 >>>", $scope.editItem9);

              if (!$scope.editItem9 || !$scope.editItem9.kddiagnosatindakan) {
                toastr.error("Harap pilih diagnosa ICD_9 yang valid!");
                return;
              }

              $scope.itemBeingEdited9.code = $scope.editItem9.kddiagnosatindakan;
              $scope.itemBeingEdited9.display = $scope.editItem9.namaDiagnosaTindakan;
              $scope.itemBeingEdited9.metadata = { code: "200", message: "Ok" };

              $scope.popupEditDiagnosa9.close();

              await $scope.saveAllDiagnosa9();
            };

            // hapus diagnosa 9
            $scope.hapusICD9Inacbg = async function (item) {
              $scope.listProcedureInacbg = $scope.listProcedureInacbg.filter(d => d.code !== item.code);
              await $scope.saveAllDiagnosa9();
            };

            // fungsi utama simpan semua diagnosa 9
            $scope.saveAllDiagnosa9 = async function () {
            let procedureString = $scope.listProcedureInacbg
              .map(d => d.code)
              .filter(c => c && c.toLowerCase() !== "undefined")
              .join("#");

            try {
              const res = await medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", {
                data: [{
                  metadata: {
                    method: "inacbg_procedure_set",
                    nomor_sep: set.nosep
                  },
                  data: { procedure: procedureString }   // <== HARUS procedure, bukan diagnosa
                }],
                noregistrasifk: $scope.item.data[0].noregistrasifk
              });

              const meta = res.data.dataresponse[0].dataresponse.metadata;
              if (meta.code == 200) {
                toastr.success("Procedure ICD-9 berhasil diperbarui");
                $scope.getProcedureInacbg(); // ganti sesuai function refresh list ICD-9
              } else {
                toastr.error(meta.message || "Gagal update procedure");
              }
            } catch (err) {
              toastr.error("Error simpan procedure");
              console.error(err);
            }
          };

          $scope.isFinalInacbg = false;

          $scope.clickFinalInacbg = function () {
            var dt1 = {
              metadata: { method: "inacbg_grouper_final" },
              data: { nomor_sep: set.nosep }
            };
            var objData = { 
              data: [dt1],
              noregistrasifk: $scope.item.data[0].noregistrasifk
             };

            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
              responData = e.data.dataresponse;
              var datasend = {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                status: "FINAL INACBG",
              };
              medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
              });
              toastr.info(responData[0].dataresponse.metadata.message, "INACBG");

              $scope.isFinalInacbg = true;
            });
          };

          $scope.clickEditInacbg = function () {
            var dt1 = {
              metadata: { method: "inacbg_grouper_reedit" },
              data: { nomor_sep: set.nosep }
            };
            var objData = { 
              data: [dt1],
              noregistrasifk: $scope.item.data[0].noregistrasifk,
             };

            medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData).then(function (e) {
              responData = e.data.dataresponse;
              var datasend = {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                status: "EDIT INACBG",
              };
              medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
              });
              toastr.info(responData[0].dataresponse.metadata.message, "INACBG");

              $scope.isFinalInacbg = false;
            });
          };


          // Fungsi untuk ambil status bridging dari backend dan update semua variabel tombol
          $scope.getStatusBridgingInacbg = function() {
            if (!$scope.item || !$scope.item.data || !$scope.item.data[0] || !$scope.item.data[0].noregistrasifk) return;
            medifirstService.get("bridging/inacbg/get-status-bridging-inacbg?noregistrasifk=" + $scope.item.data[0].noregistrasifk)
              .then(function(res) {
                var data = res.data;
                // Reset semua status
                $scope.groupingSuccess = false;
                $scope.finalIDRGSuccess = false;
                $scope.isFinalInacbg = false;
                $scope.GroupingInacbgSuccess = false;
                $scope.isClaimFinal = false;
                $scope.reeditSuccess = false;
                $scope.ImportSuccess = false;
                $scope.tabelTopup = false;
                $scope.showGrouping = true;
                if (data && data.length > 0) {
                  // Loop semua status yang dikirim backend
                  data.forEach(function(s) {
                    switch ((s.status || "").toUpperCase()) {
                      case "GROUPING IDRG":
                        $scope.groupingSuccess = true;
                        break;
                      case "FINAL IDRG":
                        $scope.finalIDRGSuccess = true;
                        break;
                      case "EDIT IDRG":
                        $scope.reeditSuccess = true;
                        $scope.finalIDRGSuccess = false;
                        break;
                     case "IMPORT TO INACBG":
                        $scope.finalIDRGSuccess = true; 
                        $scope.ImportSuccess = true;
                        $scope.reeditSuccess = false;
                        $scope.GroupingInacbgSuccess = false;
                        $scope.isFinalInacbg = false;
                        $scope.isClaimFinal = false;
                        break;
                     case "GROUPING INACBG":
                        $scope.finalIDRGSuccess = true; 
                        $scope.ImportSuccess = true;
                        $scope.GroupingInacbgSuccess = true;
                        $scope.isFinalInacbg = false;
                        break;
                     case "FINAL INACBG":
                        $scope.finalIDRGSuccess = true;
                        $scope.ImportSuccess = true;
                        $scope.GroupingInacbgSuccess = true;
                        $scope.isFinalInacbg = true;
                        $scope.reeditSuccess = false;
                        $scope.isClaimFinal = false;
                        break;
                     case "EDIT INACBG":
                        $scope.finalIDRGSuccess = true;
                        $scope.ImportSuccess = true;
                        $scope.GroupingInacbgSuccess = true; 
                        $scope.isFinalInacbg = false;
                        break;
                      case "FINAL CLAIM":
                        $scope.isClaimFinal = true;
                        break;
                      case "TOPUP":
                        $scope.tabelTopup = true;
                        break;
                      case "SEND CLAIM":
                        $scope.finalIDRGSuccess = true;
                        $scope.GroupingInacbgSuccess = true;
                        $scope.isFinalInacbg = true;
                        $scope.isClaimFinal = true;
                        $scope.tabelTopup = false;
                        break;
                      default:
                        // status lain, bisa ditambah jika ada
                        break;
                    }
                  });
                }
                $scope.$applyAsync();
              });
          };

          // $scope.onTabChanges = function(tabIndex) {
          //   // Jika tab Klaim IDRG dibuka, update status tombol dari backend
          //   if (tabIndex === 9) {
          //     $scope.getStatusBridgingInacbg();
          //   }
          // };

          $scope.clickGroupingINACBG = function () {
              var dt1 = {
                  metadata: { 
                    method: "grouper",
                    stage: "1",
                    grouper: "inacbg",
                  },
                  data: { nomor_sep: set.nosep },
              };

              var objData = { 
                data: [dt1],
                noregistrasifk: $scope.item.data[0].noregistrasifk
               };
              var totaldijamin = "";
              var hakkelas = "";
              var biayanaikkelas = "0";
              medifirstService.post("bridging/inacbg/save-bridging-inacbg-idrg", objData)
                  .then(function (e) {
                      responData = e.data.dataresponse;
                      toastr.info(responData[0].dataresponse.metadata.message, "GROUPING INACBG");

                      // hakkelas = responData[0].dataresponse.response_inacbg.kelas;
                      // if (hakkelas == "kelas_1") {
                      //   totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg;
                      // } else if (hakkelas == "kelas_2") {
                      //   totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg;
                      // } else if (hakkelas == "kelas_3") {
                      //   totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg;
                      // }

                      if ($scope.item.datanaikkelas[0].statusnaikkelas != "0") {
                        biayanaikkelas = responData[0].dataresponse.response_inacbg.add_payment_amt;
                        if (biayanaikkelas < 0) {
                          biayanaikkelas = 0;
                        }
                      }

                      totaldijamin = responData[0].dataresponse.response_inacbg.tariff;
                      $scope.cbgcode = responData[0].dataresponse.response_inacbg.cbg.code;
                      $scope.cbgdescription = responData[0].dataresponse.response_inacbg.cbg.description;
                      $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
                      $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, "Rp. ");

                      var dataproposi = {
                        noregistrasifk: $scope.item.data[0].noregistrasifk,
                        totalDijamin: totaldijamin,
                        biayaNaikkelas: biayanaikkelas,
                        cbgcode: $scope.cbgcode,
                        cbgdescription: $scope.cbgdescription,
                      };
                      medifirstService.post("bridging/inacbg/save-proposi-bridging-inacbg", dataproposi).then(function (e) {
                        //ini untuk proposional kan utang per tindakan
                      });

                      var datasend = {
                        noregistrasifk: $scope.item.data[0].noregistrasifk,
                        status: "GROUPING INACBG",
                      };
                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", datasend).then(function (e) {
                      });

                    if (responData[0].dataresponse.special_cmg_option.length > 0) {
                      toastr.info("Terdeteksi Top-up CMG Options");
                      // dataSEPCMG = responData[0].datarequest.data.nomor_sep
                      var responOptions = responData[0].dataresponse.special_cmg_option;
                      var spesialDrugx = [];
                      var specialProcedurex = [];
                      var specialProsthesisx = [];
                      var specialInvestigationx = [];
                      $scope.tabelTopup = true;
                      $scope.showGrouping = false;
                      for (let i = 0; i < responOptions.length; i++) {
                        const element = responOptions[i];
                        if (element.type == "Special Drug") {
                          spesialDrugx.push(element);
                          $scope.specialDrug = true;
                        }
                        if (element.type == "Special Procedure") {
                          specialProcedurex.push(element);
                          $scope.specialProcedure = true;
                        }
                        if (element.type == "Special Prosthesis") {
                          specialProsthesisx.push(element);
                          $scope.specialProsthesis = true;
                        }
                        if (element.type == "Special Investigation") {
                          specialInvestigationx.push(element);
                          $scope.specialInvestigation = true;
                        }
                      }
                      $scope.listspecialdrug = spesialDrugx;
                      $scope.listspecialprocedure = specialProcedurex;
                      $scope.listspecialprosthesis = specialProsthesisx;
                      $scope.listspecialinvestigation = specialInvestigationx;
                    } 
                  });
                  $scope.GroupingInacbgSuccess = true;
          };

          //VALIDCODE
          medifirstService.getPart("emr/get-combo-icd10-idrg", true, true, 10)
          .then(function(data) {
              $scope.sourceDiagnosisPrimeridrg = data;
          });

          medifirstService.getPart("emr/get-combo-icd9-idrg", true, true, 10)
          .then(function(data) {
              $scope.sourceDiagnosis9idrg = data;
          });

          $scope.onDiagnosisChange = function (e) {
              var widget = e.sender;
              
              var dataItem = widget.dataItem();

              if (dataItem && dataItem.validcode === 0) {
                  toastr.warning("Diagnosa ini tidak Valid untuk Grouping");

                  widget.value(null);
              }
          };

          $scope.isItemDisabled = function (dataItem) {
              return dataItem.validcode === 0;
          };
          //END VALIDCODE


          $scope.simpanDiagnosaTargetIDRG = function () {
            debugger;
            if ($scope.item.diagnosisPrimer == undefined) {
              alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!");
              return;
            }
            // if ($scope.dataSelectedDiagnosa == undefined) {
            //   alert("Silahkan Klik Ruangan Di List Diagnosa!!");
            //   return;
            // }
            // var norecDiagnosaPasien = "";
            // if ($scope.dataSelectedDiagnosa.norec_diagnosapasien != undefined) {
            //   norecDiagnosaPasien = $scope.dataSelectedDiagnosa.norec_diagnosapasien;
            // }
            $scope.now = new Date();
            var detaildiagnosapasien = {
              // norec_dp: norecDiagnosaPasien,
              noregistrasifk: $scope.item.data[0].noregistrasi,
              tglregistrasi: $scope.item.data[0].tglregistrasi,
              objectdiagnosafk: $scope.item.diagnosisPrimer.id,
              tglinputdiagnosa: moment($scope.now).format("YYYY-MM-DD hh:mm:ss"),
              keterangan: "-",
            };
            var objSave = {
              detaildiagnosapasien: detaildiagnosapasien,
            };
            debugger;
            medifirstService.post("registrasi/save-diagnosa-pasien-target-idrg", objSave).then(function (e) {
              $scope.now = new Date();
              var detaildiagnosapasien = {
                // norec_dp: "",
                noregistrasifk: $scope.item.data[0].noregistrasi,
                code: $scope.item.diagnosisPrimer.kdDiagnosa,
                description: $scope.item.diagnosisPrimer.namaDiagnosa,
                jenisdiagnosaidrgfk: "10",
              };
              var objSave = {
                detaildiagnosapasien: detaildiagnosapasien,
              };
              debugger;
              let text = $scope.item.diagnosisPrimer.kdDiagnosa;
              let result = text.match(/O82/);
              if (result != null) {
                $scope.showpersalinan = true;
              }
              let text2 = $scope.item.diagnosisPrimer.kdDiagnosa;
              let result2 = text2.match(/99/);
              if (result2 != null) {
                $scope.showpersalinan = true;
                $scope.showkantongdarah = true;
              }
              medifirstService.post("registrasi/save-diagnosa-idrg", objSave).then(function (e) {
                delete $scope.item.diagnosisPrimer;
                $scope.dataSelectedDiagnosa = {};
                $scope.isRouteLoading = false;
                $scope.setdetail(set);
              });
              delete $scope.item.diagnosisPrimer;
              $scope.dataSelectedDiagnosa = {};
              $scope.isRouteLoading = false;
              $scope.setdetail(set);
            });
          };

          $scope.clickHapusICD10IDRG = function (ai) {
            debugger;
            var diagnosa = {
              norec_dp: ai.norec_diagnosapasien,
              noregistrasi: ai.noregistrasi,
            };
            var objDelete = {
              diagnosa: diagnosa,
            };
            medifirstService.post("registrasi/daftar-antrian-pasien/delete-diagnosa-pasien-target-idrg", objDelete).then(function (e) {
              delete $scope.item.diagnosisPrimer;
              $scope.dataSelectedDiagnosa = {};
              $scope.setdetail(set);
            });
          };

          $scope.clickEditICD10IDRG = function(ai) {
              debugger;
              $scope.dataSelectedDiagnosa = ai;
              console.log("Data yang dipilih untuk diedit:", $scope.dataSelectedDiagnosa);
              $scope.popupEditDiagnosaIdrg.open().center();
          };


          $scope.updateDiagnosaIdrg = function() {
            console.log("Data yang diedit:", $scope.editItem10Idrg);

            if (!$scope.editItem10Idrg || !$scope.editItem10Idrg.id) {
                toastr.warning("Pilih diagnosa baru terlebih dahulu!");
                return;
            }

            var detaildiagnosapasien = {
                norec: $scope.dataSelectedDiagnosa.norec_detaildpasien,
                noregistrasifk: $scope.dataSelectedDiagnosa.noregistrasifk,
                tglregistrasi: $scope.dataSelectedDiagnosa.tglregistrasi,
                objectdiagnosafk: $scope.editItem10Idrg.id,
                keterangan: $scope.editItem10Idrg.keterangan || "-",
            };

            var objSave = {
                userData: $scope.dataLogin,
                detaildiagnosapasien: detaildiagnosapasien,
            };

            medifirstService.post("registrasi/update-diagnosa-pasien-target-idrg", objSave)
                .then(function(e) {
                    toastr.success("Diagnosa berhasil diperbarui");

                    $scope.popupEditDiagnosaIdrg.close();
                    $scope.editItem10Idrg = null;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.setdetail(set);
                })
                .catch(function(err) {
                    toastr.error("Gagal memperbarui diagnosa");
                    console.error(err);
                });
        };

          $scope.clickEditICD9IDRG = function (ai) {
              $scope.dataSelectedDiagnosa9 = ai;
              console.log("Data yang dipilih untuk diedit:", $scope.dataSelectedDiagnosa9);
              $scope.editItem9Idrg = null;
              $scope.editJumlahDiagnosa9 = ai.jumlah || 1;
              $scope.popupEditDiagnosa9Idrg.open().center();
          };

          $scope.updateDiagnosa9Idrg = function () {
              if (!$scope.editItem9Idrg) {
                  toastr.warning("Pilih diagnosa tindakan baru terlebih dahulu!");
                  return;
              }
              if (!$scope.editJumlahDiagnosa9 || $scope.editJumlahDiagnosa9 < 1) {
                  toastr.warning("Jumlah harus minimal 1!");
                  return;
              }

              var detaildiagnosatindakanpasien = {
                  norec_dp: $scope.dataSelectedDiagnosa9.norec_detaildpasien,
                  noregistrasifk: $scope.dataSelectedDiagnosa9.noregistrasifk,
                  tglpendaftaran: $scope.dataSelectedDiagnosa9.tglpendaftaran,
                  objectdiagnosatindakanfk: $scope.editItem9Idrg.id,
                  keterangantindakan: $scope.dataSelectedDiagnosa9.keterangantindakan || "-",
                  jumlah: $scope.editJumlahDiagnosa9,
              };

              var objSave = {
                  userData: $scope.dataLogin,
                  detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
              };

              medifirstService.post("registrasi/update-diagnosa-tindakan-pasien-target-idrg", objSave)
                  .then(function (res) {
                      toastr.success("Diagnosa tindakan berhasil diperbarui");
                      $scope.popupEditDiagnosa9Idrg.close();
                      $scope.setdetail(set); // reload data tabel
                  })
                  .catch(function (err) {
                      toastr.error("Gagal memperbarui diagnosa tindakan");
                      console.error(err);
                  });
          };


          $scope.simpanDiagnosaTindakanTargetIdrg = function () {
            if ($scope.item.diagnosisPrimer1 == undefined) {
              alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!");
              return;
            }
            // if ($scope.item.namaRuangan1.objectruanganfk == undefined) {
            //     alert("Pilih Nama Ruangan ulang!!")
            //     return
            // }
            // if ($scope.dataSelected1 == undefined) {
            //     alert("Silahkan Klik Ruangan Di List Diagnosa!!")
            //     return
            // }
            var norecDiagnosaTindakanPasien = "";
            if ($scope.dataSelected1 != undefined) {
              norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien;
            }
            var keteranganTindakan = "-";
            if ($scope.item.keteranganTindakan != undefined) {
              keteranganTindakan = $scope.item.keteranganTindakan;
            }
            var norec_apd;
            debugger;
            $scope.now = new Date();
            var detaildiagnosatindakanpasien = {
              norec_dp: norecDiagnosaTindakanPasien,
              noregistrasifk: $scope.item.data[0].noregistrasi,
              tglpendaftaran: $scope.item.data[0].tglregistrasi,
              objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
              keterangantindakan: keteranganTindakan,
              jumlah: $scope.item.jumlah,
            };
            var objSave = {
              detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
            };

            medifirstService.post("registrasi/save-diagnosa-tindakan-pasien-target-idrg", objSave).then(function (e) {
              $scope.isRouteLoading = false;
              $scope.setdetail(set);
              var detaildiagnosapasien = {
                norec_dp: "",
                noregistrasifk: $scope.item.data[0].noregistrasi,
                code: $scope.item.diagnosisPrimer1.kdDiagnosaTindakan,
                description: $scope.item.diagnosisPrimer1.namaDiagnosaTindakan,
                jenisdiagnosaidrgfk: "9",
                jumlah: $scope.item.jumlah,
              };
              var objSave = {
                detaildiagnosapasien: detaildiagnosapasien,
              };
              debugger;
              delete $scope.item.diagnosisPrimer1;
              medifirstService.post("registrasi/save-diagnosa-idrg9", objSave).then(function (e) {
                delete $scope.item.diagnosisPrimer1;
                $scope.dataSelectedDiagnosa = {};
                $scope.isRouteLoading = false;
                $scope.setdetail(set);
              });
            });
          };

      
      //end region IDRG
      //END IDRG

      //CEK PASIEN DAFTAR BULAN INI 
          function cekPsnDaftarThisMonth(dataItem) {
              // Panggil service untuk mendapatkan riwayat pendaftaran bulan ini
              medifirstService.get('registrasi/get-pasien-pernah-daftar/' + dataItem.noCm).then(function (e) {
                  // Cek jika pasien punya riwayat pendaftaran (jumlah > 0)
                  if (e.data.pernahDaftar && e.data.jml > 0) {
                      
                      // 1. Tampilkan notifikasi jumlah kunjungan
                      var jml = e.data.jml + 1; // Kunjungan saat ini adalah jumlah sebelumnya + 1
                      toastr.info('Kunjungan ke- ' + jml + ' di bulan yang sama!', 'Peringatan', {
                          "closeButton": true,
                          "positionClass": "toast-top-right",
                          "timeOut": "5000" // Sebaiknya berikan timeout agar tidak menutupi layar
                      });

                      // 2. Cek apakah ruangan pendaftaran terakhir sama dengan yang sekarang
                      // PERBAIKAN: Gunakan e.data.ruanganTerakhir, bukan e.data.namaruangan
                      if (dataItem.namaRuangan == e.data.ruanganTerakhir) {
                          
                          // PERBAIKAN: Gunakan properti yang benar di dalam pesan toastr
                          var pesan = 'Pasien ini sudah terdaftar di ruangan ' + e.data.ruanganTerakhir + 
                                      ' pada ' + e.data.selisihHari + ' hari yang lalu!';

                          toastr.warning(pesan, 'Peringatan Ruangan Sama', {
                              "closeButton": true,
                              "positionClass": "toast-top-right",
                              "timeOut": "5000",
                          });
                      }
                  }
              });
          }
        //END PASIEN DAFTAR BULAN INI
    }, //BATAS SUCI
  ]);
});