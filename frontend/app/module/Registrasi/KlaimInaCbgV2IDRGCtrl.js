// const { forEach } = require("underscore");

define(["initialize", "Configuration"], function (initialize, config) {
  "use strict";
  initialize.controller("KlaimInaCbgV2IDRGCtrl", [
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
      // $scope.item.tglKeluar = $scope.now;
      var tampungdiagnosa = {};
      var tampungdiagnosa9 = {};
      let tampungdiagnosaIcd10 = {};
      // $scope.dataIcd10Selected = {};
      $scope.istempatLaporan = true;
      let hasilKonsultasi = "";
      let cpptO = "";
      var set = "";
      LoadCombo();
      $scope.dataLogin = JSON.parse(window.localStorage.getItem("pegawai"));
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
      LoadCache();
      // LoadDataClosingFaktur();
      function LoadCache() {
         $timeout(function () {
         var chacePeriodeJSON = localStorage.getItem("BerkasKirimanDariRuangan");
         var chacePeriode = JSON.parse(chacePeriodeJSON);
        if (chacePeriode && chacePeriode[0] && chacePeriode[1]) {
          $scope.item.tglAwalKirim = moment(chacePeriode[0], 'YYYY-MM-DD').startOf('day').toDate(); // <-- UBAH DI SINI
          $scope.item.tglAkhirKirim = moment(chacePeriode[1], 'YYYY-MM-DD').endOf('day').toDate();
          if (chacePeriode[2] != undefined) {
            $scope.item.noRm = chacePeriode[2];
          }

          // console.log(chacePeriode[3])

          if (chacePeriode[3] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.instalasi = { id: chacePeriode[3].id, nama: chacePeriode[3].nama };
          }
          if (chacePeriode[4] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganripapj = { id: chacePeriode[4].id, nama: chacePeriode[4].nama };
          }
          if (chacePeriode[5] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganigdpapj = { id: chacePeriode[5].id, namaruangan: chacePeriode[5].namaruangan };
          }
          if (chacePeriode[6] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganrmpapj = { id: chacePeriode[6].id, namaruangan: chacePeriode[6].namaruangan };
          }
          if (chacePeriode[7] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganrjpapj = { id: chacePeriode[7].id, namaruangan: chacePeriode[7].namaruangan };
          }
          debugger;
          LoadDataKirimPAPJ(false);
        } else {
          $scope.item.tglAwalKirim = moment().startOf('day').toDate();
          $scope.item.tglAkhirKirim = moment().endOf('day').toDate();
          LoadDataKirimPAPJ(true);
        }

        var chacePeriodeJSON = localStorage.getItem("BerkasSudahVerif");
        var chacePeriode = JSON.parse(chacePeriodeJSON);
        if (chacePeriode && chacePeriode[0] && chacePeriode[1]) {
          $scope.item.tglAwalPulangVerif = moment(chacePeriode[0], 'YYYY-MM-DD').startOf('day').toDate(); //komen bentar biar getdatenya masuk
          $scope.item.tglAkhirPulangVerif = moment(chacePeriode[1], 'YYYY-MM-DD').endOf('day').toDate();
          if (chacePeriode[2] != undefined) {
            $scope.item.noRm = chacePeriode[2];
          }
          console.log(chacePeriode[3]);
          if (chacePeriode[3] != undefined) {
            $scope.item.instalasiverif = { id: chacePeriode[3].id, nama: chacePeriode[3].nama };
          }
          if (chacePeriode[4] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganripapjverif = { id: chacePeriode[4].id, nama: chacePeriode[4].nama };
          }
          if (chacePeriode[5] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganigdpapjverif = { id: chacePeriode[5].id, namaruangan: chacePeriode[5].namaruangan };
          }
          if (chacePeriode[6] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganrmpapjverif = { id: chacePeriode[6].id, namaruangan: chacePeriode[6].namaruangan };
          }
          if (chacePeriode[7] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.ruanganrjpapjverif = { id: chacePeriode[7].id, namaruangan: chacePeriode[7].namaruangan };
          }
          LoadDataVerifPAPJ(false);
        } else {
          $scope.item.tglAwalPulangVerif = moment().startOf('day').toDate();
          $scope.item.tglAkhirPulangVerif = moment().endOf('day').toDate();
          LoadDataVerifPAPJ(true);
        }

        var chacePeriodeJSON = localStorage.getItem("BerkasSiapKlaim");
        var chacePeriode = JSON.parse(chacePeriodeJSON);
        if (chacePeriode && chacePeriode[0] && chacePeriode[1]) {
          $scope.item.tanggalRegistrasiAwal = moment(chacePeriode[0], 'YYYY-MM-DD').startOf('day').toDate(); //komen bentar biar getdatenya masuk
          $scope.item.tanggalRegistrasiAkhir = moment(chacePeriode[1], 'YYYY-MM-DD').endOf('day').toDate();
          // if (chacePeriode[2] != undefined) {
          //     $scope.item.noseppapj = chacePeriode[2];
          // }

          // // console.log(chacePeriode[3])

          if (chacePeriode[2] != undefined) {
            // $scope.item.instalasi = chacePeriode[3]
            $scope.item.instalasiklaim = { id: chacePeriode[2].id, nama: chacePeriode[2].nama };
          }
          // if (chacePeriode[4] != undefined) {
          //     // $scope.item.instalasi = chacePeriode[3]
          //     $scope.item.ruanganripapj = { id : chacePeriode[4].id    ,
          //     nama : chacePeriode[4].nama
          //     }
          // }
          // if (chacePeriode[5] != undefined) {
          //     // $scope.item.instalasi = chacePeriode[3]
          //     $scope.item.ruanganigdpapj = { id : chacePeriode[5].id    ,
          //     namaruangan : chacePeriode[5].namaruangan
          //     }
          // }
          // if (chacePeriode[6] != undefined) {
          //     // $scope.item.instalasi = chacePeriode[3]
          //     $scope.item.ruanganrmpapj = { id : chacePeriode[6].id    ,
          //     namaruangan : chacePeriode[6].namaruangan
          //     }
          // }
          // if (chacePeriode[7] != undefined) {
          //     // $scope.item.instalasi = chacePeriode[3]
          //     $scope.item.ruanganrjpapj = { id : chacePeriode[7].id    ,
          //     namaruangan : chacePeriode[7].namaruangan
          //     }
          // }
          debugger;
          LoadDataKlaimPAPJ(false);
        } else {
          $scope.item.tanggalRegistrasiAwal = moment().startOf('day').toDate();
          $scope.item.tanggalRegistrasiAkhir = moment().endOf('day').toDate();

          // $scope.item.tanggalAwalKlaimBerkas = moment().startOf('day').toDate();
          // $scope.item.tanggalAkhirKlaimBerkas = moment().endOf('day').toDate();
          LoadDataKlaimPAPJ(true);
        }
        
      }, 50)
      }
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

        medifirstService.get("tatarekening/get-combo-baru").then(function (dat) {
          //debugger
          var unwantedRuanganId = [14, 247, 248, 251, 322, 448, 545, 70, 1094, 1084, 1069, 1077, 1096, 564, 1083];
          $scope.listRuanganRJPapj = dat.data.ruanganRajal.filter(function (ruangan) {
            return unwantedRuanganId.indexOf(ruangan.id) === -1;
          });

          $scope.listRuanganRIPapj = dat.data.ruanganRanap;
          $scope.listRuanganRm = dat.data.ruanganRm;
          $scope.listRuanganIgd = dat.data.ruanganIgd;

          var dataRu = [];
          for (let i = 0; i < dat.data.ruanganAll.length; i++) {
            const element = dat.data.ruanganAll[i];
            dataRu.push({ id: element.id, namaruangan: element.namaruangan });
          }
          $scope.listRuanganAll = dataRu;
          $scope.selectOptionsRuangan = {
            placeholder: "Pilih Ruangan...",
            dataTextField: "namaruangan",
            dataValueField: "id",
            autoBind: false,
          };
        });

        //   ModelItem.getDataDummyGeneric("JenisDiagnosa", true, true, 10).then(function (data) {
        //     $scope.listJenisDiagnosa = data;
        // });

        // ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
        //     $scope.listDiagnosa = data;
        // });
        medifirstService.get("tatarekening/get-combo-baru").then(function (dat) {
          $scope.listDepartemen = dat.data.departemen;
        });
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
            medifirstService.get("bridging/inacbg/get-cari-set-form-inacbg?nosep=" + set.noregistrasi).then(function (e) {
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
              $scope.item.tglKeluar = $scope.item.dataDiagnosa10[0].tglkeluar;
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
              LoadCache();
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien?nosep=" + value).then(function (e) {
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
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien?nosep=" + x.norm).then(function (e) {
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
        $scope.myVar = 3;
        //if (value == undefined){
        //    alert('Nosep/Norm Kosong!!')
        //    return;
        //}
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
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien?nosep=" + set.nosep).then(function (e) {
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
        medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien?nosep=" + set.noCm).then(function (e) {
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
          {
            title: "Diagnosa",
            width: "90px",
            template: '<button class="k-button custom-button" ng-click="setDiagnosa(dataItem)"  style="margin:0 0 5px">#:  diagnosa #</button> ',
          },
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
        medifirstService.get("bridging/inacbg/get-cari-set-form-inacbg?nosep=" + set.noregistrasi).then(function (e) {
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

                medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (res) {
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
              kode_tarif: "BP",
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
          medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
              kode_tarif: "BP",
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
          medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
        saveFilePapj(data, jenis);
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
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
      function loadKonsul() {
        medifirstService.get("emr/get-order-konsul?noregistrasi=" + $scope.dataSelected.noregistrasi).then(function (dat) {
          if (dat.data.data.length > 0) {
            hasilKonsultasi = dat.data.data[0].keteranganlainnya;
          }
        });
      }
      function loadCpptO() {
        medifirstService.get("emr/get-history-cppt?noRegistrasi=" + $scope.dataSelected.noregistrasi).then(function (dat) {
          debugger;
          let tampung = "";
          for (let i = 0; i < dat.data.length; i++) {
            if (dat.data[i].profesi == "Dokter") {
              if (dat.data[i].objective != "") {
                tampung = tampung + dat.data[i].objective + "\n";
              }
            }
          }
          if (tampung != "") {
            cpptO = tampung;
          }
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
      $scope.cetakResume = function (x) {
        let norec123 = "";
        if ($scope.dataSelected.objectdepartemenfk == 18) {
          loadDiagnosa();
          loadKonsul();
          loadCpptO();
          medifirstService.get("emr/get-norec-resume?noregistrasi=" + $scope.dataSelected.noregistrasi).then(function (dat) {
            if (dat.data.length == 0) {
              toastr.error("Resume Medis Tidak Ada !");
              return;
            }
            norec123 = dat.data[0].norec;
            medifirstService.get("emr/get-kepentingan-resume-rj?norec=" + dat.data[0].norec).then(function (dat) {
              debugger;
              let tampung = "";
              let tampung2 = "";
              let tampung3 = "";
              let tampung4 = "";
              let diagnosautama = "Diagnosis Primer / Utama : ";
              let kddiagnosautama = "";
              let diagnosasekunder = "Diagnosis Sekunder : ";
              let kddiagnosasekunder = "";
              let diagnosaawal = "Diagnosis Awal : ";
              let kddiagnosaawal = "";
              let diagnosatindakan = "";
              let kddiagnosatindakan = "";
              let nouruttindakan = 1;
              let nourutsekunder = 1;
              let emr = dat.data;
              let nourut = 1;
              let penunjang = "";
              let obat = "";
              let tampungObat = "";
              let noUrutObat = 1;
              let tindakan = "";
              let tampungTindakan = "";
              let noUrutTindakan = 1;
              let tampungGaNormal = "";
              let penunjanglab = "Laboratorium Klinik : ";
              let tindakanlab = "Laboratorium Klinik : ";
              let penunjangrad = "Radiologi : ";
              let tindakanrad = "Radiologi : ";
              let penunjangpa = "Laboratorium PA : ";
              let tindakanpa = "Laboratorium Patalogi Anatomi : ";
              for (let i = 0; i < emr.length; i++) {
                if (emr[i].jenispenunjang == "LAB") {
                  // debugger
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n";
                  tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n";
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      if (emr[i].detail[j].flaglab == "Y") {
                        tampung4 = emr[i].detail[j].hasilpenunjang;
                        tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / ";
                      }
                    } else {
                      // tampung = ''
                    }
                  }
                  penunjanglab = penunjanglab + tampung2;
                } else if (emr[i].jenispenunjang == "RAD") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanrad = tindakanrad + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("kesan");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("Kesan");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangrad = penunjangrad + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanpa = tindakanpa + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("KESIMPULAN");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("KESIMPULAN");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangpa = penunjangpa + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "OBAT") {
                  tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk + " " + emr[i].frekuensi;
                  obat = obat + tampungObat + "\n";
                  noUrutObat = noUrutObat + 1;
                  tampungObat = "";
                } else {
                  tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk;
                  tindakan = tindakan + tampungTindakan + "\n";
                  noUrutTindakan = noUrutTindakan + 1;
                  tampungTindakan = "";
                }
                if (tampung4 != "") {
                  tampung3 = tampung3 + tampung + tampung2 + "\n";
                  nourut = nourut + 1;
                }
                tampung2 = "";
                tampung = "";
                tampung4 = "";
              }
              // debugger
              tampungdiagnosa9;
              for (let i = 0; i < tampungdiagnosa.length; i++) {
                if (tampungdiagnosa[i].jenisdiagnosa == "Primary / utama") {
                  diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa;
                  kddiagnosautama = tampungdiagnosa[i].kddiagnosa;
                } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                  diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosaawal = tampungdiagnosa[i].kddiagnosa;
                } else {
                  // diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
                  // kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
                  diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa;
                }
                nourutsekunder = nourutsekunder + 1;
              }
              if (tampungdiagnosa9.length == 0) {
                diagnosatindakan = "-";
              }
              for (let i = 0; i < tampungdiagnosa9.length; i++) {
                diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + " - " + tampungdiagnosa9[i].namadiagnosatindakan + "\n";
                kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n";
                nouruttindakan = nouruttindakan + 1;
              }
              if (penunjanglab == "Laboratorium Klinik : ") {
                penunjanglab = "";
              }
              if (penunjangrad == "Radiologi : ") {
                penunjangrad = "";
              }
              if (penunjangpa == "Laboratorium PA : ") {
                penunjangpa = "";
              }
              if (tindakanlab == "Laboratorium Klinik : ") {
                tindakanlab = "";
              }
              if (tindakanrad == "Radiologi : ") {
                tindakanrad = "";
              }
              if (tindakanpa == "Laboratorium Patalogi Anatomi : ") {
                tindakanpa = "";
              }
              if (diagnosautama == "Diagnosis Primer / Utama : ") {
                diagnosautama = "";
              }
              if (diagnosasekunder == "Diagnosis Sekunder : ") {
                diagnosasekunder = "";
              }
              if (diagnosaawal == "Diagnosis Awal : ") {
                diagnosaawal = "";
              }
              let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai=" + $scope.dataSelected.pegawaifk;
              var data = {
                gambarLogo: "logodokkes.jpg",
                paramKey: [
                  "norec",
                  "tampung",
                  "diagnosautama",
                  "kddiagnosautama",
                  "diagnosasekunder",
                  "kddiagnosasekunder",
                  "diagnosatindakan",
                  "kddiagnosatindakan",
                  "penunjang",
                  "obat",
                  "tindakan",
                  "penunjanglab",
                  "penunjangrad",
                  "penunjangpa",
                  "tindakanlab",
                  "tindakanrad",
                  "tindakanpa",
                  "hasilkonsul",
                  "diagnosaawal",
                  "cpptO",
                  "ttd",
                ],
                paramValue: [
                  norec123,
                  tampung3,
                  diagnosautama,
                  kddiagnosautama,
                  diagnosasekunder,
                  kddiagnosasekunder,
                  diagnosatindakan,
                  kddiagnosatindakan,
                  penunjang,
                  obat,
                  tindakan,
                  penunjanglab,
                  penunjangrad,
                  penunjangpa,
                  tindakanlab,
                  tindakanrad,
                  tindakanpa,
                  hasilKonsultasi,
                  diagnosaawal,
                  cpptO,
                  y,
                ],
                paramType: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
              };
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  //this.response is what you're looking for
                  // handler(this.response);
                  console.log(this.response, typeof this.response);
                  //var res = this.response
                  //var file = new Blob( [res], {type: 'application/pdf'});
                  // debugger;
                  var url = window.URL.createObjectURL(this.response);
                  var pdf = document.getElementById("tempatLaporan");
                  pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                  var win = window.open(url, "_blank");
                  win.focus();
                }
              };
              if (window.location.hostname.indexOf("192.168.1.7") > -1) {
                xhr.open("POST", "http://192.168.1.7:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
                xhr.open("POST", "http://192.168.88.56:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
                xhr.open("POST", "http://10.10.20.167:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
                xhr.open("POST", "http://10.5.1.2:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
                xhr.open("POST", "http://202.51.105.98:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
                xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisRjNew.pdf");
              } else {
                xhr.open("POST", "http://127.0.0.1:8797/generic/report/ResumeMedisRjNew.pdf");
              }
              // set `Content-Type` header
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
              xhr.responseType = "blob";
              // send rquest with JSON payload
              xhr.send(JSON.stringify(data));
            });
          });
        } else if ($scope.dataSelected.objectdepartemenfk == 24) {
          loadDiagnosa();
          loadKonsul();
          medifirstService.get("emr/get-norec-resume?noregistrasi=" + $scope.dataSelected.noregistrasi).then(function (dat) {
            if (dat.data.length == 0) {
              toastr.error("Resume Medis Tidak Ada !");
              return;
            }
            medifirstService.get("emr/get-kepentingan-resume-rj?norec=" + dat.data[0].norec).then(function (dat) {
              debugger;
              let tampung = "";
              let tampung2 = "";
              let tampung3 = "";
              let tampung4 = "";
              let diagnosautama = "Diagnosis Primer / Utama : ";
              let kddiagnosautama = "";
              let diagnosasekunder = "Diagnosis Sekunder : ";
              let kddiagnosasekunder = "";
              let diagnosaawal = "Diagnosis Awal : ";
              let kddiagnosaawal = "";
              let diagnosatindakan = "";
              let kddiagnosatindakan = "";
              let nouruttindakan = 1;
              let nourutsekunder = 1;
              let emr = dat.data;
              let nourut = 1;
              let penunjang = "";
              let obat = "";
              let tampungObat = "";
              let noUrutObat = 1;
              let tindakan = "";
              let tampungTindakan = "";
              let noUrutTindakan = 1;
              let tampungGaNormal = "";
              let penunjanglab = "Laboratorium Klinik : ";
              let tindakanlab = "Laboratorium Klinik : ";
              let penunjangrad = "Radiologi : ";
              let tindakanrad = "Radiologi : ";
              let penunjangpa = "Laboratorium PA : ";
              let tindakanpa = "Laboratorium Patalogi Anatomi : ";
              for (let i = 0; i < emr.length; i++) {
                if (emr[i].jenispenunjang == "LAB") {
                  // debugger
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n";
                  tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n";
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      if (emr[i].detail[j].flaglab == "Y") {
                        tampung4 = emr[i].detail[j].hasilpenunjang;
                        tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / ";
                      }
                    } else {
                      // tampung = ''
                    }
                  }
                  penunjanglab = penunjanglab + tampung2;
                } else if (emr[i].jenispenunjang == "RAD") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanrad = tindakanrad + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("kesan");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("Kesan");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangrad = penunjangrad + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanpa = tindakanpa + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("KESIMPULAN");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("KESIMPULAN");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangpa = penunjangpa + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "OBAT") {
                  tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk;
                  obat = obat + tampungObat + "\n";
                  noUrutObat = noUrutObat + 1;
                  tampungObat = "";
                } else {
                  tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk;
                  tindakan = tindakan + tampungTindakan + "\n";
                  noUrutTindakan = noUrutTindakan + 1;
                  tampungTindakan = "";
                }
                if (tampung4 != "") {
                  tampung3 = tampung3 + tampung + tampung2 + "\n";
                  nourut = nourut + 1;
                }
                tampung2 = "";
                tampung = "";
                tampung4 = "";
              }
              // debugger
              tampungdiagnosa9;
              for (let i = 0; i < tampungdiagnosa.length; i++) {
                if (tampungdiagnosa[i].jenisdiagnosa == "Primary / utama") {
                  diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa;
                  kddiagnosautama = tampungdiagnosa[i].kddiagnosa;
                } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                  diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosaawal = tampungdiagnosa[i].kddiagnosa;
                } else {
                  // diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
                  // kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
                  diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa;
                }
                nourutsekunder = nourutsekunder + 1;
              }
              if (tampungdiagnosa9.length == 0) {
                diagnosatindakan = "-";
              }
              for (let i = 0; i < tampungdiagnosa9.length; i++) {
                diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + " - " + tampungdiagnosa9[i].namadiagnosatindakan + "\n";
                kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n";
                nouruttindakan = nouruttindakan + 1;
              }
              let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai=" + $scope.dataSelected.pegawaifk;
              var data = {
                gambarLogo: "logodokkes.jpg",
                paramKey: [
                  "norec",
                  "tampung",
                  "diagnosautama",
                  "kddiagnosautama",
                  "diagnosasekunder",
                  "kddiagnosasekunder",
                  "diagnosatindakan",
                  "kddiagnosatindakan",
                  "penunjang",
                  "obat",
                  "tindakan",
                  "penunjanglab",
                  "penunjangrad",
                  "penunjangpa",
                  "tindakanlab",
                  "tindakanrad",
                  "tindakanpa",
                  "hasilkonsul",
                  "diagnosaawal",
                  "cpptO",
                  "ttd",
                ],
                paramValue: [
                  $scope.dataSelected.norec,
                  tampung3,
                  diagnosautama,
                  kddiagnosautama,
                  diagnosasekunder,
                  kddiagnosasekunder,
                  diagnosatindakan,
                  kddiagnosatindakan,
                  penunjang,
                  obat,
                  tindakan,
                  penunjanglab,
                  penunjangrad,
                  penunjangpa,
                  tindakanlab,
                  tindakanrad,
                  tindakanpa,
                  hasilKonsultasi,
                  diagnosaawal,
                  cpptO,
                  y,
                ],
                paramType: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
              };
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  //this.response is what you're looking for
                  // handler(this.response);
                  console.log(this.response, typeof this.response);
                  //var res = this.response
                  //var file = new Blob( [res], {type: 'application/pdf'});
                  // debugger;
                  var url = window.URL.createObjectURL(this.response);
                  var pdf = document.getElementById("tempatLaporan");
                  pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                  var win = window.open(url, "_blank");
                  win.focus();
                }
              };
              if (window.location.hostname.indexOf("192.168.1.7") > -1) {
                xhr.open("POST", "http://192.168.1.7:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
                xhr.open("POST", "http://192.168.88.56:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
                xhr.open("POST", "http://10.10.20.167:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
                xhr.open("POST", "http://10.5.1.2:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
                xhr.open("POST", "http://202.51.105.98:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
                xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisIGD.pdf");
              } else {
                xhr.open("POST", "http://127.0.0.1:8797/generic/report/ResumeMedisIGD.pdf");
              }
              // set `Content-Type` header
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
              xhr.responseType = "blob";
              // send rquest with JSON payload
              xhr.send(JSON.stringify(data));
            });
          });
        }
      };
      $scope.Cetakv2 = function () {
        var user = medifirstService.getPegawaiLogin();
        medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.dataSelected.noregistrasi + "?jenisdata=bill").then(function (dat) {
          debugger;
          var deposit =
            "Rp " +
            parseFloat(dat.data.deposit)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          var billing =
            "Rp " +
            parseFloat(dat.data.billing)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          var terbilang = dat.data.terbilang;
          var kelas = dat.data.kelasRawat;
          var sisa = "Rp 0,00";
          var diskon =
            "Rp " +
            parseFloat(dat.data.diskon)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          var bayar =
            "Rp " +
            parseFloat(dat.data.sudahbayar)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          if (bayar == "Rp NaN") {
            bayar = "Rp 0,00";
          }
          if (dat.data.jenisPasien == "BPJS") {
            kelas = dat.data.kelasPenjamin;
            // bayar = "0"
          }
          if (dat.data.deposit > 0) {
            sisa = dat.data.deposit - parseFloat(dat.data.bayar);
            if (sisa > 0) {
              sisa =
                "Rp " +
                parseFloat(sisa)
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            } else {
              sisa = "RP 0,00";
            }
          }
          var nosep = "-";
          if (dat.data.nosep != "" && dat.data.nosep != null) {
            nosep = dat.data.nosep;
          }
          var x = " noregistrasi='" + dat.data.noRegistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk";
          var data = {
            gambarLogo: "logodokkes.jpg",
            paramKey: ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "diskon", "where"],
            paramValue: [
              "RS Bhayangkara Tk. I R.Said Sukanto",
              "1980-12-25 00:00:00",
              "Jl. Raya Bogor No.1, RT.1/RW.5, Kramat Jati, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13510",
              user.namaLengkap,
              dat.data.noRegistrasi,
              dat.data.noCm,
              dat.data.namaPasien,
              dat.data.lastRuangan,
              dat.data.namakamar,
              kelas,
              billing,
              deposit,
              sisa,
              dat.data.isi,
              terbilang,
              bayar,
              nosep,
              diskon,
              x,
            ],
            paramType: ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          };
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              //this.response is what you're looking for
              // handler(this.response);
              console.log(this.response, typeof this.response);
              //var res = this.response
              //var file = new Blob( [res], {type: 'application/pdf'});
              var url = window.URL.createObjectURL(this.response);
              var pdf = document.getElementById("tempatLaporan");
              pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
              var win = window.open(url, "_blank");
              win.focus();
            }
          };
          if (window.location.hostname.indexOf("192.168.1.7") > -1) {
            xhr.open("POST", "http://192.168.1.7:8797/generic/report/rincianbilling.pdf");
          } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
            xhr.open("POST", "http://192.168.88.56:8797/generic/report/rincianbilling.pdf");
          } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
            xhr.open("POST", "http://10.10.20.167:8797/generic/report/rincianbilling.pdf");
          } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
            xhr.open("POST", "http://202.51.105.98:8797/generic/report/rincianbilling.pdf");
          } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
            xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/rincianbilling.pdf");
          } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
            xhr.open("POST", "http://10.5.1.2:8797/generic/report/rincianbilling.pdf");
          } else {
            xhr.open("POST", "http://127.0.0.1:8797/generic/report/rincianbilling.pdf");
          }
          // set `Content-Type` header
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
          xhr.responseType = "blob";
          // send rquest with JSON payload
          xhr.send(JSON.stringify(data));
          $scope.isRouteLoading = false;
        });
      };
      $scope.CetakRekap = function () {
        var user = medifirstService.getPegawaiLogin();
        medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.dataSelected.noregistrasi).then(function (dat) {
          var billing =
            "Rp " +
            parseFloat(dat.data.totalbilljs)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          var deposit =
            "Rp " +
            parseFloat(dat.data.deposit)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          var kelas = dat.data.kelasRawat;
          var sisa = "Rp 0,00";
          var bayar =
            "Rp " +
            parseFloat(dat.data.dibayarjs)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          if (bayar == "Rp NaN") {
            bayar = "Rp 0,00";
          }
          if (dat.data.jenisPasien != "Umum/Pribadi") {
            if (dat.data.jenisPasien != "SWASTA") {
              kelas = dat.data.kelasPenjamin;
            }
            // bayar = "0"
          }
          if (dat.data.jenisPasien == "Tagihan") {
            var selisih = dat.data.totalbilljs - dat.data.dibayarjs;
            var billing2 =
              "Rp " +
              parseFloat(selisih)
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          }

          if (dat.data.deposit > 0) {
            sisa = dat.data.deposit - parseFloat(dat.data.dibayarjs);
            if (sisa > 0) {
              sisa =
                "Rp " +
                parseFloat(sisa)
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            } else {
              sisa = "RP 0,00";
            }
          }
          var nosep = "-";
          if (dat.data.nosep != "" && dat.data.nosep != null) {
            nosep = dat.data.nosep;
          }
          var tglayeuna = "";
          var tglpulang = moment(dat.data.tglPulang).format("YYYY-MM-DD");
          medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tglpulang).then(function (dat1) {
            tglayeuna = dat1.data.tglayeuna;
            var data = {
              gambarLogo: "logodokkes.jpg",
              paramKey: ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "tglayeuna"],
              paramValue: [
                "RS Bhayangkara Tk. I R.Said Sukanto",
                "1980-12-25 00:00:00",
                "Jl. Raya Bogor No.1, RT.1/RW.5, Kramat Jati, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13510",
                user.namaLengkap,
                dat.data.noRegistrasi,
                dat.data.noCm,
                dat.data.namaPasien,
                dat.data.lastRuangan,
                dat.data.namakamar,
                kelas,
                billing,
                deposit,
                sisa,
                dat.data.isi,
                dat.data.terbilang,
                bayar,
                nosep,
                tglayeuna,
              ],
              paramType: ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            };
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                //this.response is what you're looking for
                // handler(this.response);
                console.log(this.response, typeof this.response);
                //var res = this.response
                //var file = new Blob( [res], {type: 'application/pdf'});
                var url = window.URL.createObjectURL(this.response);
                var pdf = document.getElementById("tempatLaporan");
                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                var win = window.open(url, "_blank");
                win.focus();
              }
            };
            if (window.location.hostname.indexOf("192.168.1.7") > -1) {
              xhr.open("POST", "http://192.168.1.7:1001/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
              xhr.open("POST", "http://192.168.88.56:1001/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
              xhr.open("POST", "http://10.10.20.167:1001/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
              xhr.open("POST", "http://202.51.105.98:1001/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
              xhr.open("POST", "http://10.5.1.2:1006/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
              xhr.open("POST", "http://202.51.105.98:1001/generic/report/rekapbillingv2bmhpNew.pdf");
            } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
              xhr.open("POST", "http://simrs-rspusatpolri.com:1002/generic/report/rekapbillingv2bmhpNew.pdf");
            } else {
              xhr.open("POST", "http://127.0.0.1:8797/generic/report/rekapbillingv2bmhpNew.pdf");
            }
            // set `Content-Type` header
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.responseType = "blob";
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));
            $scope.isRouteLoading = false;
          });
        });
      };
      $scope.cetakSuratKematian = function () {
        var y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-kematian?reg=" + $scope.dataSelected.noregistrasi;
        var qrcode1 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-doktermenerangkan?reg=" + $scope.dataSelected.noregistrasi;
        var qrcode2 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-dokterdiagnosis?reg=" + $scope.dataSelected.noregistrasi;
        var data = {
          gambarLogo: "logodokkes.jpg",
          paramKey: ["namaRS", "alamatRS", "noregistrasi", "linkqr", "qrcode1", "qrcode2"],
          paramValue: ["RS Bhayangkara Tk. I R.Said Sukanto", "Jl. Raya Bogor No.1, RT.1/RW.5, Kramat Jati, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13510", $scope.dataSelected.noregistrasi, y, qrcode1, qrcode2], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
          paramType: ["", "", "", "", "", ""], // "paramType" : ["","date"] selain date, isinya kosong saja
        };
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            //this.response is what you're looking for
            // handler(this.response);
            console.log(this.response, typeof this.response);
            //var res = this.response
            //var file = new Blob( [res], {type: 'application/pdf'});
            //debugger;
            var url = window.URL.createObjectURL(this.response);
            var pdf = document.getElementById("tempatLaporan");
            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
            var win = window.open(url, "_blank");
            win.focus();
          }
        };
        if (window.location.hostname.indexOf("192.168.1.7") > -1) {
          xhr.open("POST", "http://192.168.1.7:1002/generic/report/suratkematian.pdf");
        } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
          xhr.open("POST", "http://192.168.88.56:1002/generic/report/suratkematian.pdf");
        } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
          xhr.open("POST", "http://10.5.1.2:1006/generic/report/suratkematian.pdf");
        } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
          xhr.open("POST", "http://202.51.105.98:1002/generic/report/suratkematian.pdf");
        } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
          xhr.open("POST", "http://10.10.20.167:1002/generic/report/suratkematian.pdf");
        } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
          xhr.open("POST", "http://simrs-rspusatpolri.com:1002/generic/report/suratkematian.pdf");
        } else {
          xhr.open("POST", "http://127.0.0.1:8797/generic/report/suratkematian.pdf");
        }
        // set `Content-Type` header
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.responseType = "blob";
        // send rquest with JSON payload
        xhr.send(JSON.stringify(data));
      };
      $scope.cetakAll = function () {
        debugger;
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date($scope.dataSelected.tgllahir);
        const secondDate = new Date($scope.dataSelected.tglmasuk);
        let umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        // let dataReport = {
        //     'report': 'rekapbilling'
        // };
        let dataReport = [];
        dataReport.push({ report: "rekapbilling" });
        var local = JSON.parse(localStorage.getItem("profile"));
        var profile = local.id;
        window.open(config.baseApiBackend + "report/cetak-semua-inacbg?noregistrasi=" + $scope.dataSelected.noregistrasi + "&umurday=" + umurDay + "&kdprofile=" + profile, "_blank");
        $scope.isRouteLoading = false;
      };

      $scope.kembaliDokumen = function () {
        $scope.isCetakDokumen = true;
        $scope.isCetakAll = false;
      };

      $scope.cetakAll2 = function () {
        /*- cetaksep
                - cetakresumemedis
                - cetakbilling
                - cetakrekapbilling
                - cetakspri
                - cetaksuratkematian
                - cetaklabpa
                - cetakoperasi
                - cetakanestesi
                - cetakcppt
                - cetakpengkajianigd
                - cetaklab
                - cetakrad
                - cetakpulang*/
        var data = [
          // { "nama": "SURAT PERMOHONAN RAWAT INAP", "code": "cetakspri" , "checked": true},
          // { "nama": "SURAT KETERANGAN KEMATIAN", "code": "cetaksuratkematian" , "checked": true},
          // { "nama": "SURAT PERNYATAAN PULANG ATAS PERMINTAAN SENDIRI", "code": "cetakpulang" , "checked": true},
          // { "nama": "LAPORAN OPERASI", "code": "cetakoperasi" , "checked": true},
          // { "nama": "LAPORAN ANESTESI", "code": "cetakanestesi" , "checked": true},
          // { "nama": "PEMANTAUAN PELAKSANAAN HEMODIALISIS HARIAN", "code": "cetakhemodialisa" , "checked": true},
          // { "nama": "HASIL PEMERIKSAAN LABORATORIUM PATOLOGI ANATOMIK", "code": "cetaklabpa" , "checked": true},
          // { "nama": "CATATAN PERKEMBANGAN PASIEN TERINTEGRASI", "code": "cetakcppt" , "checked": true},
          // { "nama": "PENGKAJIAN AWAL MEDIS IGD", "code": "cetakpengkajianigd" , "checked": true},
          // { "nama": "PEMAKAIAN OBAT & ALKES", "code": "cetakpemakaianobat" , "checked": true},
          // { "nama": "REKAP BIAYA PELAYANAN", "code": "cetakrekapbilling" , "checked": true},
          { nama: "FILE KEMENKES", code: "cetakkemenkes", checked: true },
          { nama: "SEP", code: "cetaksep", checked: true },
          { nama: "RESUME MEDIS", code: "cetakresumemedis", checked: true },
          { nama: "HASIL LABORATORIUM", code: "cetaklab", checked: true },
          { nama: "HASIL PEMERIKSAAN RADIOLOGI", code: "cetakrad", checked: true },
          { nama: "HASIL ECHO", code: "cetakecho", checked: false },
          { nama: "HASIL EKG", code: "cetakekg", checked: false },
          { nama: "HASIL USG", code: "cetakusg", checked: false },
          { nama: "HASIL PA", code: "cetakpa", checked: false },
          { nama: "DOKUMEN SURAT KONTROL", code: "cetaksurkon", checked: false },
          { nama: "DOKUMEN TAMBAHAN", code: "cetakdoktambahan", checked: true },
          { nama: "RINCIAN BIAYA PELAYANAN", code: "cetakbilling", checked: true },
          { nama: "PERSETUJUAN TINDAKAN INFASI", code: "cetakinfasi", checked: true },
          { nama: "TRIASE IGD", code: "cetaktriase", checked: true },
          { nama: "HEMODIALISA", code: "cetakhemodialisa", checked: true },
          { nama: "ASESMEN REHABILITASI MEDIS", code: "cetakasesmenrehab", checked: true },
          { nama: "LAPORAN OPERASI", code: "cetaklaporanoperasi", checked: true },
          { nama: "SPRI", code: "cetakspri", checked: true },
          { nama: "PENGKAJIAN MEDIS IGD", code: "cetakpengkajianigd", checked: false },
          { nama: "CATATAN PERKEMBANGAN PASIEN TERINTEGRASI", code: "cetakcppt", checked: true },
          { nama: "MONITORING TRANSFUSI DARAH", code: "cetakmtd", checked: true },
          { nama: "TRIASE FETOMATERNAL", code: "cetaktf", checked: true },
          { nama: "EWS DEWASA", code: "cetakewsdewasa", checked: false },
          { nama: "LEMBAR PENDAMPINGAN REHABILITASI MEDIK", code: "cetakpendampinganrehab", checked: true },
          { nama: "PENGKAJIAN AWAL MEDIS RI", code: "cetakpengkajianawalmedisri", checked: false },
          { nama: "PENGKAJIAN AWAL MEDIS GIZI", code: "cetakpengkajianawalmedisgizi", checked: true },
          { nama: "KONSULTASI", code: "cetakkonsul", checked: true },
          { nama: "LAPORAN KEJADIAN CODE BLUE", code: "cetakcodeblue", checked: true },
          { nama: "PENILAIAN DERAJAT DEHIDRASI", code: "cetakderajatdehidrasi", checked: true },
          { nama: "LAPORAN TINDAKAN", code: "cetaklaporantindakan", checked: true },
        ];

        // medifirstService.get('registrasi/get-dokumen-penunjang-cetak?noRegistrasi=' + $scope.dataSelected.noregistrasi + '&isInaCbg=true').then(function (dat) {
        //     for (let i = 0; i < dat.data.length; i++) {
        //         if(dat.data[i].id==46) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat1" , "checked": true})
        //         else if(dat.data[i].id==47) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat2", "checked": true })
        //         else if(dat.data[i].id==48) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat3", "checked": true })
        //         else if(dat.data[i].id==49) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat4" , "checked": true})
        //         else if(dat.data[i].id==50) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat5" , "checked": true})
        //         else if(dat.data[i].id==51) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat6" , "checked": true})
        //         else if(dat.data[i].id==52) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat7" , "checked": true})
        //         else if(dat.data[i].id==53) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat8" , "checked": true})
        //         else if(dat.data[i].id==54) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat9" , "checked": true})
        //         else if(dat.data[i].id==55) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat10" , "checked": true})
        //         else if(dat.data[i].id==56) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat11" , "checked": true})
        //         else if(dat.data[i].id==57) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat12" , "checked": true})
        //         else if(dat.data[i].id==58) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat13" , "checked": true})
        //         else if(dat.data[i].id==65) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat14", "checked": true})
        //         else if(dat.data[i].id==66) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat15" , "checked": true})
        //         else if(dat.data[i].id==67) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat16" , "checked": true})
        //         else if(dat.data[i].id==68) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat17" , "checked": true})
        //         else if(dat.data[i].id==69) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat18" , "checked": true})
        //         else if(dat.data[i].id==70) data.push({ "nama": dat.data[i].jenisdokumen.toUpperCase(), "code":"surat19" , "checked": true})

        //     }
        $scope.treeSourceDokumen = new kendo.data.HierarchicalDataSource({
          data: data,
        });
        $scope.mainTreeDokumen = {
          dataTextField: ["nama"],
          datakKeyField: ["code"],
          dragAndDrop: true,
          checkboxes: true,
        };
        // })
        $scope.isCetakDokumen = false;
        $scope.isCetakAll = true;
      };
      $scope.cetakAlldokumen = function () {
        var data = $scope.treeSourceDokumen._view;
        var dokumenall = "";
        var j = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].checked != undefined) {
            if (data[i].checked == true) {
              if (j == 0) dokumenall = dokumenall + data[i].code;
              else dokumenall = dokumenall + "," + data[i].code;

              j++;
            }
          }

          //if(i==0)  dokumenall=dokumenall + data[i].code
          //else dokumenall=dokumenall + ',' + data[i].code
        }

        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date($scope.dataSelected.tgllahir);
        const secondDate = new Date($scope.dataSelected.tglmasuk);
        let umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        // let dataReport = {
        //     'report': 'rekapbilling'
        // };
        let dataReport = [];
        dataReport.push({ report: "rekapbilling" });
        var local = JSON.parse(localStorage.getItem("profile"));
        var profile = local.id;
        window.open(config.baseApiBackend + "report/cetak-semua-inacbg?noregistrasi=" + $scope.dataSelected.noregistrasi + "&umurday=" + umurDay + "&kdprofile=" + profile + "&dokumenall=" + dokumenall, "_blank");
        $scope.isRouteLoading = false;
      };
      ////////////////////////////////
      $scope.cetakAlldokumenNew = function () {
        console.log($scope.dataSelected.norec);
        debugger;
        if (!$scope.dataSelected || !$scope.dataSelected.noregistrasi) {
          alert("Nomor registrasi tidak tersedia!");
          return;
        }

        var checkedItems = $scope.treeSourceDokumen._view.filter((item) => item.checked);
        if (checkedItems.length === 0) {
          alert("Tidak ada dokumen yang dipilih untuk dicetak!");
          return;
        }
        var dokumenall = checkedItems.map((item) => item.code).join(",");

        medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataSelected.noregistrasi + "?jenisdata=bill").then(function (e) {
          window.open(config.baseApiBackend + "report/cetak-semua-inacbg-newtes?noregistrasi=" + $scope.dataSelected.noregistrasi + "&norecpd=" + $scope.dataSelected.norec + "&dokumenall=" + dokumenall, "_blank");
          $scope.isRouteLoading = false;
        });
      };

   $scope.cetakLangsungNewTes = function () {
    // 1. Validasi Data
    if (!$scope.dataSelected || !$scope.dataSelected.noregistrasi) {
        if (window.messageContainer) {
            window.messageContainer.error("Nomor registrasi tidak tersedia!");
        } else {
            alert("Nomor registrasi tidak tersedia!");
        }
        return;
    }

    // 2. Validasi Checkbox Dokumen
    var dokumenall = ""; // Inisialisasi di awal (Best Practice)
    
    // Cek apakah treeview ada dan memiliki data
    if ($scope.treeSourceDokumen && $scope.treeSourceDokumen._view) {
        var checkedItems = $scope.treeSourceDokumen._view.filter(function(item) {
             return item.checked;
        });

        if (checkedItems.length > 0) {
            dokumenall = checkedItems.map(function(item) {
                return item.code;
            }).join(",");
        }
    }

    // 3. Susun URL Download
    // encodeURIComponent penting agar karakter spesial (misal: / atau spasi) tidak merusak URL
    var previewUrl = config.baseApiBackend + "report/cetak-semua-inacbg-newtes-donwload" + 
        "?noregistrasi=" + encodeURIComponent($scope.dataSelected.noregistrasi) +
        "&norecpd=" + encodeURIComponent($scope.dataSelected.norec) +
        "&dokumenall=" + encodeURIComponent(dokumenall) +
        "&pdf=1";

    // 4. Eksekusi Download
    // Cara ini paling aman untuk menghindari Pop-up Blocker modern
    var link = document.createElement('a');
    link.href = previewUrl;
    link.target = '_blank'; // Buka di tab baru (opsional, jika ingin download di background hapus baris ini)
    link.download = $scope.dataSelected.nosep + '.pdf'; // Memberi hint nama file
    
    document.body.appendChild(link);
    link.click();
    
    // Bersihkan elemen link setelah diklik
    setTimeout(function() {
        document.body.removeChild(link);
    }, 100);
};




      ////////////////////////////////

      // $scope.cetakAlldokumenNew = function() {
      //     debugger
      //     var data = $scope.treeSourceDokumen._view;
      //     var dokumenall="";
      //     var j=0;
      //     for (let i = 0; i < data.length; i++) {
      //         if(data[i].checked != undefined) {
      //             if(data[i].checked == true) {
      //                 if(j==0)  dokumenall=dokumenall + data[i].code
      //                 else dokumenall=dokumenall + ',' + data[i].code
      //                 j++;
      //             }
      //         }
      //         //if(i==0)  dokumenall=dokumenall + data[i].code
      //         //else dokumenall=dokumenall + ',' + data[i].code
      //     }
      //     const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      //     const firstDate = new Date($scope.dataSelected.tgllahir);
      //     const secondDate = new Date($scope.dataSelected.tglmasuk);
      //     let umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      //     // let dataReport = {
      //     //     'report': 'rekapbilling'
      //     // };
      //     let dataReport = []
      //     dataReport.push({ 'report': 'rekapbilling' })
      //     var local = JSON.parse(localStorage.getItem('profile'))
      //     var profile = local.id;
      //     window.open(config.baseApiBackend + "report/cetak-semua-inacbg-newtes?noregistrasi=" + $scope.dataSelected.noregistrasi + '&umurday=' + umurDay + '&kdprofile=' + profile + '&dokumenall=' + dokumenall, '_blank');
      //         $scope.isRouteLoading = false;
      // }
      $scope.setDiagnosa = function (dataItem) {
        if (dataItem.diagnosa == "") {
          toastr.error("Diagnosa Kosong !");
          return;
        }
        loadDiagnosa2(dataItem);
        $scope.popUpDiagnosa.center().open();
      };
      $scope.setDiagnosa3 = function (dataItem) {
        // if (dataItem.namadiagnosa == '') {
        //     toastr.error('Diagnosa Kosong !');
        //     return
        // }
        // $scope.item.norec_pd = dataItem.norec
        $scope.item.norec_apd = dataItem.norec_apd;
        $scope.item.tglregistrasi = dataItem.tanggalMasuk;
        $scope.item.noregistrasi = dataItem.noRegistrasi;
        $scope.item.nocm = dataItem.noCm;
        $scope.item.idDept = dataItem.deptid;
        $scope.item.idDpjp = dataItem.iddpjp;
        loadDiagnosa3(dataItem);
        $scope.popUpDiagnosa2.center().open();
      };

      $scope.ubahDiagnosa = function () {
        if ($scope.item === undefined) {
          messageContainer.error("Pilih data terlebih dahulu");
          return;
        }
        $scope.popupUbahdiagnosa.center().open();
        // debugger
      };

      $scope.ubahtanggal = function () {
        $scope.popupUbah.center().open();
      };
      $scope.simpanubah = function () {
        $scope.item.tglmasuk = moment($scope.item.tglmasuk).format("YYYY-MM-DD HH:mm:ss");
        $scope.item.tglkeluar = moment($scope.item.tglkeluar).format("YYYY-MM-DD HH:mm:ss");

        var objSave = {
          noregistrasi: $scope.item.noregistrasi,
          tglmasuk: $scope.item.tglmasuk,
          tglpulang: $scope.item.tglkeluar,
        };
        medifirstService.post("registrasi/update-tgl-regist-klaim", objSave).then(function (e) {
          $scope.popupUbah.close();
          $scope.setdetail(set);
        });
      };

      function loadDiagnosa2(dataItem) {
        let param = "noReg=" + dataItem.noregistrasi;
        medifirstService.get("emr/get-diagnosapasienbynoregicd9?" + param).then(function (data) {
          let dataICD9 = data.data.datas;
          $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            data: dataICD9,
            pageSize: 10,
          });
        });
        medifirstService.get("emr/get-diagnosapasienbynoreg?" + param).then(function (data) {
          var dataICD10 = data.data.datas;
          $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
            data: dataICD10,
            pageSize: 10,
          });
          tampungdiagnosaIcd10 = data.data.datas;
        });
        $scope.columnDiagnosaIcd9 = [
          {
            title: "No",
            template: "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
            width: "30px",
          },
          {
            field: "noregistrasi",
            title: "No Registrasi",
            width: "100px",
          },
          {
            field: "kddiagnosatindakan",
            title: "Kode ICD 9",
            width: "100px",
          },
          {
            field: "namadiagnosatindakan",
            title: "Nama ICD 9",
            width: "300px",
          },
          {
            field: "keterangantindakan",
            title: "Keterangan",
            width: "200px",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "200px",
          },
          {
            field: "namalengkap",
            title: "Penginput",
            width: "200px",
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl Input",
            width: "200px",
          },
        ];
        $scope.columnDiagnosaIcd10 = [
          {
            title: "No",
            template: "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
            width: "30px",
          },
          {
            field: "noregistrasi",
            title: "No Registrasi",
            width: "100px",
          },
          {
            field: "jenisdiagnosa",
            title: "Jenis Diagnosis",
            width: "150px",
          },
          {
            field: "kddiagnosa",
            title: "Kode ICD 10",
            width: "100px",
          },
          {
            field: "namadiagnosa",
            title: "Nama ICD 10",
            width: "300px",
          },
          {
            field: "keterangan",
            title: "Keterangan",
            width: "200px",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "150px",
          },
          {
            field: "namalengkap",
            title: "Penginput",
            width: "200px",
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl Input",
            width: "200px",
          },
        ];
      }

      function loadDiagnosa3(dataItem) {
        let param = "noReg=" + dataItem.noRegistrasi;
        let param2 = "noCm=" + dataItem.noCm;
        medifirstService.get("emr/get-diagnosapasienbynoregicd9?" + param).then(function (data) {
          let dataICD9 = data.data.datas || [];
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
            var dataICD10 = data.data.datas || [];
            // var totalBiayaRS = 0;

            // // Ambil total dari biayars
            // if (data.data.biayars && data.data.biayars.length > 0) {
            //     totalBiayaRS = data.data.biayars[0].total;
            // }

            // // Masukkan total ke setiap item
            // dataICD10.forEach(function (item) {
            //     item.biayars = totalBiayaRS;
            // });

            // // Simpan juga ke scope (kalau mau dipakai di luar tabel)
            // $scope.totalBiayaRS = totalBiayaRS;

            // Buat DataSource Kendo
            $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                data: dataICD10,
                pageSize: 10,
            });
            tampungdiagnosaIcd10 = data.data.datas;
        });
       medifirstService.get("emr/get-diagnosapasienbynoreg-rm?" + param2).then(function (data) {
        const rawData = data.data?.datas || [];

        // Group berdasarkan No Registrasi
        const grouped = new Map();
        rawData.forEach(item => {
          if (!grouped.has(item.noregistrasi)) {
            grouped.set(item.noregistrasi, {
              noregistrasi: item.noregistrasi,
              tglregistrasi: item.tglregistrasi,
              namaruangan: item.namaruangan,
              details: [],
            });
          }
          grouped.get(item.noregistrasi).details.push(item);
        });

        $scope.dataGridHistoryDiagnosa = Array.from(grouped.values());
        // console.log("Data history diagnosa:", $scope.dataGridHistoryDiagnosa);

        // Update ke grid
        const updateGridData = () => {
          if ($scope.historyDiagnosaGrid?.dataSource) {
            $scope.historyDiagnosaGrid.dataSource.data($scope.dataGridHistoryDiagnosa);
          }
        };

        if ($scope.historyDiagnosaGrid) updateGridData();
        else $timeout(updateGridData, 500);
      });
      medifirstService.get("emr/get-diagnosapasienbynoregicd9-rm?" + param2).then(function (data) {
        const rawData = data.data?.datas || [];

        // Group berdasarkan No Registrasi
        const grouped = new Map();
        rawData.forEach(item => {
          if (!grouped.has(item.noregistrasi)) {
            grouped.set(item.noregistrasi, {
              noregistrasi: item.noregistrasi,
              tglregistrasi: item.tglregistrasi,
              namaruangan: item.namaruangan,
              details: [],
            });
          }
          grouped.get(item.noregistrasi).details.push(item);
        });

        $scope.dataGridHistoryDiagnosa9 = Array.from(grouped.values());
        console.log("Data history diagnosa:", $scope.dataGridHistoryDiagnosa9);

        // Update ke grid
        const updateGrid9Data = () => {
          if ($scope.historyDiagnosa9Grid?.dataSource) {
            $scope.historyDiagnosa9Grid.dataSource.data($scope.dataGridHistoryDiagnosa9);
          }
        };

        if ($scope.historyDiagnosa9Grid) updateGrid9Data();
        else $timeout(updateGrid9Data, 500);
      });


        $scope.columnDiagnosaIcd9 = [
          {
            title: "No",
            template: "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
            width: "30px",
          },
          {
            field: "noregistrasi",
            title: "No Registrasi",
            width: "100px",
          },
          {
            field: "kddiagnosatindakan",
            title: "Kode ICD 9",
            width: "100px",
          },
          {
            field: "namadiagnosatindakan",
            title: "Nama ICD 9",
            width: "300px",
          },
          // {
          //   field: "biayars",
          //   title: "Tarif RS",
          //   width: "250px",
          //   template: "#= kendo.toString(biayars, 'c0', 'id-ID') #"
          // },
          {
            field: "keterangantindakan",
            title: "Keterangan",
            width: "200px",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "200px",
          },
          {
            field: "namalengkap",
            title: "Penginput",
            width: "200px",
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl Input",
            width: "200px",
          },
        ];
        $scope.columnDiagnosaIcd10 = [
          {
            title: "No",
            template: "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
            width: "30px",
          },
          {
            field: "noregistrasi",
            title: "No Registrasi",
            width: "100px",
          },
          {
            field: "jenisdiagnosa",
            title: "Jenis Diagnosis",
            width: "150px",
          },
          {
            field: "kddiagnosa",
            title: "Kode ICD 10",
            width: "100px",
          },
          {
            field: "namadiagnosa",
            title: "Nama ICD 10",
            width: "300px",
          },
          // {
          //   field: "biayars",
          //   title: "Tarif RS",
          //   width: "250px",
          // },
          {
            field: "keterangan",
            title: "Keterangan",
            width: "200px",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "150px",
          },
          {
            field: "namalengkap",
            title: "Penginput",
            width: "200px",
          },
          {
            field: "tglinputdiagnosa",
            title: "Tgl Input",
            width: "200px",
          },
        ];
       $scope.mainHistoryGridOptions = {
          dataSource: new kendo.data.DataSource({ data: [], pageSize: 10 }),
          pageable: true,
          sortable: true,
          noRecords: {
            template: "<div style='text-align:center; padding:10px;'>Tidak ada data riwayat diagnosa</div>",
          },
          detailTemplate: "<div kendo-grid k-options='detailHistoryGridOptions(dataItem)'></div>",
          columns: [
            { field: "noregistrasi", title: "No Registrasi", width: "120px" },
            { field: "tglregistrasi", title: "Tanggal Kunjungan", width: "150px" },
            { field: "namaruangan", title: "Ruangan", width: "200px" },
            {
              title: "Tindakan",
              width: "160px",
              template:
                "<button class='k-button k-primary' ng-click='gunakanDiagnosaDariHistoryGrup(dataItem)'>Gunakan Kunjungan Ini</button>",
            },
          ],
        };
       $scope.mainHistoryGrid9Options = {
          dataSource: new kendo.data.DataSource({ data: [], pageSize: 10 }),
          pageable: true,
          sortable: true,
          noRecords: {
            template: "<div style='text-align:center; padding:10px;'>Tidak ada data riwayat diagnosa</div>",
          },
          detailTemplate: "<div kendo-grid k-options='detailHistoryGrid9Options(dataItem)'></div>",
          columns: [
            { field: "noregistrasi", title: "No Registrasi", width: "120px" },
            { field: "tglregistrasi", title: "Tanggal Kunjungan", width: "150px" },
            { field: "namaruangan", title: "Ruangan", width: "200px" },
            {
              title: "Tindakan",
              width: "160px",
              template:
                "<button class='k-button k-primary' ng-click='gunakanDiagnosa9DariHistoryGrup(dataItem)'>Gunakan Kunjungan Ini</button>",
            },
          ],
        };
      }

     $scope.detailHistoryGridOptions = function (dataItem) {
      const details = (dataItem && dataItem.details) ? dataItem.details : [];
      return {
        dataSource: { data: details, pageSize: 5 },
        columns: [
          { field: "jenisdiagnosa", title: "Jenis Diagnosis", width: "150px" },
          { field: "kddiagnosa", title: "Kode ICD 10", width: "120px" },
          { field: "namadiagnosa", title: "Nama ICD 10", width: "300px" },
          { field: "namalengkap", title: "Penginput", width: "180px" },
        ],
        noRecords: { template: "<div style='text-align:center;padding:10px;'>Tidak ada detail diagnosa</div>" },
      };
    };

     $scope.detailHistoryGrid9Options = function (dataItem) {
      const details = (dataItem && dataItem.details) ? dataItem.details : [];
      return {
        dataSource: { data: details, pageSize: 5 },
        columns: [
          { field: "kddiagnosatindakan", title: "Kode ICD 10", width: "120px" },
          { field: "namadiagnosatindakan", title: "Nama ICD 10", width: "300px" },
          { field: "namalengkap", title: "Penginput", width: "180px" },
        ],
        noRecords: { template: "<div style='text-align:center;padding:10px;'>Tidak ada detail diagnosa</div>" },
      };
    };


      // FUNGSI UNTUK TOMBOL "GUNAKAN KUNJUNGAN INI"
      $scope.gunakanDiagnosaDariHistoryGrup = async function (dataItem) {
        try {
          // console.log("Data item diklik:", dataItem);
          const diagnosaItems = dataItem.details || [];

          if (diagnosaItems.length === 0) {
            toastr.warning("Tidak ada diagnosa di kunjungan ini.", "Perhatian");
            return;
          }

          const existing = ($scope.dataSourceDiagnosaIcd10?.data() || []).map(i => i.kddiagnosa);
          const newItems = diagnosaItems.filter(i => !existing.includes(i.kddiagnosa));

          if (newItems.length === 0) {
            toastr.info("Semua diagnosa dari kunjungan riwayat ini sudah ada.", "Informasi");
            return;
          }

          const promises = newItems.map(i => {
            const payload = {
              detaildiagnosapasien: {
                norec_dp: "",
                noregistrasifk: $scope.item.norec_apd,
                tglregistrasi: $scope.item.tglregistrasi,
                objectdiagnosafk: i.objectdiagnosafk,
                objectjenisdiagnosafk: i.objectjenisdiagnosafk,
                tglinputdiagnosa: moment().format("YYYY-MM-DD HH:mm:ss"),
                keterangan: i.keterangan || "-",
                tglpendaftaran: $scope.item.tglregistrasi,
              },
            };
            return medifirstService.post("emr/save-diagnosa-pasien", payload);
          });

          await Promise.all(promises);

          toastr.success(`${newItems.length} diagnosa berhasil disalin dari riwayat.`, "Sukses");
          loadDiagnosa3({ noRegistrasi: $scope.item.noregistrasi, noCm: $scope.item.nocm });

        } catch (err) {
          console.error("Error saat menyalin diagnosa:", err);
          toastr.error("Terjadi kesalahan saat menyimpan diagnosa.", "Peringatan");
        }
      };

      $scope.gunakanDiagnosa9DariHistoryGrup = async function (dataItem) {
        try {
          console.log("Data history dipilih (ICD9):", dataItem);
          const diagnosaItems = dataItem.details || [];

          if (diagnosaItems.length === 0) {
            toastr.warning("Tidak ada diagnosa ICD 9 di kunjungan ini.", "Perhatian");
            return;
          }

          // Ambil data ICD9 saat ini di grid aktif
          const existing = ($scope.dataSourceDiagnosaIcd9?.data() || []).map(i => i.kddiagnosatindakan);

          // Filter hanya diagnosa baru
          const newItems = diagnosaItems.filter(i => !existing.includes(i.kddiagnosatindakan));

          if (newItems.length === 0) {
            toastr.info("Semua diagnosa ICD 9 dari riwayat ini sudah ada.", "Informasi");
            return;
          }

          // Loop simpan ICD9 satu per satu
          const promises = newItems.map(item => {
            const payload = {
              detaildiagnosatindakanpasien: {
                norec_dp: "",
                objectpasienfk: $scope.item.norec_apd, // pasien aktif
                tglpendaftaran: $scope.item.tglregistrasi,
                objectdiagnosatindakanfk: item.id, // pastikan field yang benar
                keterangantindakan: item.keterangantindakan || "-",
              }
            };

            return medifirstService.post("emr/save-diagnosa-tindakan-pasien", payload);
          });

          // Tunggu semua simpan selesai
          await Promise.all(promises);

          toastr.success(`${newItems.length} diagnosa ICD 9 berhasil disalin dari riwayat.`, "Sukses");
          
          const currentPatientData = {
            noRegistrasi: $scope.item.noregistrasi,
            noCm: $scope.item.nocm
          };
          loadDiagnosa3(currentPatientData);

        } catch (err) {
          console.error("Error saat menyalin diagnosa ICD9:", err);
          toastr.error("Terjadi kesalahan saat menyimpan diagnosa ICD 9.", "Peringatan");
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
            id: 2,
            jenisDiagnosa: "Primary",
          };
        } else if (dataIcd10Selected.objectjenisdiagnosafk === 1) {
          $scope.item.jenisDiagnosis = {
            id: 1,
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
      $scope.$watch("item.diagnosisPrimerEklaim2", function (newVal, oldVal) {
        if (newVal.length > 2) {
          $timeout.cancel(timeoutPromise);
          timeoutPromise = $timeout(function () {
            if (newVal != oldVal) {
              var dt1 = {};
              var dt2 = [];
              dt1 = {
                metadata: {
                  method: "search_procedures_inagrouper",
                },
                data: {
                  keyword: newVal,
                },
              };
              dt2.push(dt1);

              var objData = {
                data: dt2,
              };
              medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
                debugger;
                var responDiagnosa = e.data.dataresponse;
                if (responDiagnosa[0].dataresponse.metadata.code == "200") {
                  $scope.cardsEklaim2 = [];
                  var diagnosaInacbg = responDiagnosa[0].dataresponse.response.data;
                  for (var x = diagnosaInacbg.length - 1; x >= 0; x--) {
                    let resDokter = { description: diagnosaInacbg[x].description, code: diagnosaInacbg[x].code };
                    $scope.cardsEklaim2.push(resDokter);
                  }
                  $scope.cardViewEklaim2 = true;
                } else {
                  $scope.cardViewEklaim2 = false;
                }
              });
            }
          }, 500);
        }
      });
      $scope.$watch("item.diagnosisPrimerEklaim", function (newVal, oldVal) {
        if (newVal.length > 2) {
          $timeout.cancel(timeoutPromise);
          timeoutPromise = $timeout(function () {
            if (newVal != oldVal) {
              var dt1 = {};
              var dt2 = [];
              dt1 = {
                metadata: {
                  method: "search_diagnosis_inagrouper",
                },
                data: {
                  keyword: newVal,
                },
              };
              dt2.push(dt1);

              var objData = {
                data: dt2,
              };
              medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
                debugger;
                var responDiagnosa = e.data.dataresponse;
                if (responDiagnosa[0].dataresponse.metadata.code == "200") {
                  $scope.cardsEklaim = [];
                  var diagnosaInacbg = responDiagnosa[0].dataresponse.response.data;
                  for (var x = diagnosaInacbg.length - 1; x >= 0; x--) {
                    let resDokter = { description: diagnosaInacbg[x].description, code: diagnosaInacbg[x].code };
                    $scope.cardsEklaim.push(resDokter);
                  }
                  $scope.cardViewEklaim = true;
                } else {
                  $scope.cardViewEklaim = false;
                }
              });
            }
          }, 500);
        }
      });
      $scope.clickCardEklaim = function (x) {
        debugger;
        $scope.cardViewEklaim = false;
        $scope.now = new Date();
        var detaildiagnosapasien = {
          norec_dp: "",
          noregistrasifk: $scope.item.data[0].noregistrasi,
          code: x.code,
          description: x.description,
          jenisdiagnosainacbgfk: "10",
        };
        var objSave = {
          detaildiagnosapasien: detaildiagnosapasien,
        };
        debugger;
        medifirstService.post("registrasi/save-diagnosa-inacbg", objSave).then(function (e) {
          delete $scope.item.diagnosisPrimer;

          $scope.dataSelectedDiagnosa = {};
          $scope.isRouteLoading = false;
          $scope.setdetail(set);
        });
      };

      $scope.clickCardEklaim2 = function (x) {
        debugger;
        $scope.cardViewEklaim2 = false;
        var x2 = x;
        var noantrianLoket;
        var confirm = $mdDialog.prompt().title("Silahkan Masukan Jumlah Tindakan Dalam 1x Operasi?").placeholder("Jumlah Tindakan").ariaLabel("Lucky day").cancel("Tidak").initialValue("").ok("Okay!").cancel("Tidak");
        $mdDialog.show(confirm).then(
          function (result) {
            noantrianLoket = result;
            $scope.now = new Date();
            var detaildiagnosapasien = {
              norec_dp: "",
              noregistrasifk: $scope.item.data[0].noregistrasi,
              code: x2.code,
              description: x2.description,
              jenisdiagnosainacbgfk: "9",
              jumlah: noantrianLoket,
            };
            var objSave = {
              detaildiagnosapasien: detaildiagnosapasien,
            };
            debugger;
            medifirstService.post("registrasi/save-diagnosa-inacbg9", objSave).then(function (e) {
              delete $scope.item.diagnosisPrimer;
              $scope.dataSelectedDiagnosa = {};
              $scope.isRouteLoading = false;
              $scope.setdetail(set);
            });
          },
          function () {
            return;
          }
        );
      };
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

      function LoadDataDokumen(dataItem) {
        tampungData = dataItem;
        medifirstService.get("registrasi/get-dokumen-penunjang?noRegistrasi=" + dataItem.noregistrasi + "&isInaCbg=true").then(function (dat) {
          for (let i = 0; i < dat.data.length; i++) {
            dat.data[i].no = i + 1;
          }
          $scope.sourceDokumen = new kendo.data.DataSource({
            data: dat.data,
            length: dat.data.length,
            pageSize: 20,
          });
          $scope.sourceDokumenTm = new kendo.data.DataSource({
            data: dat.data,
            length: dat.data.length,
            pageSize: 20,
          });
        });
      }
      $scope.lihatDokumen = function () {
        LoadDataDokumen2();
        $scope.popUpUploadDokumen.center().open();
      };
      function LoadDataDokumen2() {
        tampungData = dataItem;
        medifirstService.get("registrasi/get-dokumen-penunjang?noRegistrasi=" + set.noregistrasi + "&isInaCbg=true" + "&isPapj=true").then(function (dat) {
          for (let i = 0; i < dat.data.length; i++) {
            dat.data[i].no = i + 1;
          }
          $scope.sourceDokumen = new kendo.data.DataSource({
            data: dat.data,
            length: dat.data.length,
            pageSize: 20,
          });
        });
      }
      $scope.gridDokumen = {
        pageable: true,
        scrollable: true,
        columns: [
          { field: "no", title: "No", width: 40 },
          { field: "nocm", title: "No RM", width: 120 },
          { field: "noregistrasi", title: "No Registrasi", width: 120 },
          { field: "namapasien", title: "Nama Pasien", width: 150 },
          { field: "jenisdokumen", title: "Jenis Dokumen", width: 150 },
          { field: "namaruangan", title: "Ruangan", width: 120 },
          { field: "namalengkap", title: "User Upload", width: 120 },
          { field: "tglupload", title: "Tgl Upload", width: 150 },
          { title: "Hasil", width: "100px", template: '<button class="k-button custom-button" ng-click="lihatHasil(dataItem)" style="margin:0 0 5px">Lihat Hasil</button>' },
          { title: "Hapus", width: "100px", template: '<button class="k-button custom-button" ng-click="hapusDokumen(dataItem)" style="margin:0 0 5px">Hapus Dokumen</button>' },
          { title: "Kembalikan Dokumen", width: "100px", template: '<button class="k-button custom-button" ng-click="kembalikanDokumen(dataItem)" style="margin:0 0 5px">Kembalikan Dokumen</button>' },
        ],
      };
      $scope.gridDokumenTm = {
        pageable: true,
        scrollable: true,
        columns: [
          { field: "no", title: "No", width: 40 },
          { field: "nocm", title: "No RM", width: 120 },
          { field: "noregistrasi", title: "No Registrasi", width: 120 },
          { field: "namapasien", title: "Nama Pasien", width: 150 },
          { field: "jenisdokumen", title: "Jenis Dokumen", width: 150 },
          { field: "namaruangan", title: "Ruangan", width: 120 },
          { field: "namalengkap", title: "User Upload", width: 120 },
          { field: "tglupload", title: "Tgl Upload", width: 150 },
          { title: "Hasil", width: "100px", template: '<button class="k-button custom-button" ng-click="lihatHasil(dataItem)" style="margin:0 0 5px">Lihat Hasil</button>' },
          { title: "Hapus", width: "100px", template: '<button class="k-button custom-button" ng-click="hapusDokumen(dataItem)" style="margin:0 0 5px">Hapus Dokumen</button>' },
          { title: "Kembalikan Dokumen", width: "100px", template: '<button class="k-button custom-button" ng-click="kembalikanDokumen(dataItem)" style="margin:0 0 5px">Kembalikan Dokumen</button>' },
        ],
      };
      $scope.kembalikanDokumen = function (dataItem) {
        let objSave = {
          norec: dataItem.norec,
        };
        medifirstService.post("registrasi/update-kembali-dokumen", objSave).then(function (dat) {
          LoadDataDokumen2();
        });
      };
      $scope.hapusDokumen = function (dataItem) {
        // if ($scope.dataSelectedTambah == undefined) {
        //     alert("Pilih Satu Data Yang Mau di Hapus !!!")
        //     return;
        // };

        var objSave = {
          norec: dataItem.norec_doc,
          status: false,
        };

        medifirstService.post("registrasi/hapus-dokumen-papj", objSave).then(function (e) {
          if (e.data.status === 201) {
            LoadDataDokumen(tampungData);
          }
        });
      };
      // $scope.hapusDokumen = function(dataItem) {
      //     let objSave = {
      //         "norec": dataItem.norec_doc,
      //         "status": false
      //     }
      //     medifirstService.post('registrasi/hapus-dokumen-penunjang', objSave).then(function(dat) {
      //         LoadDataDokumen(tampungData)
      //     })
      // }
      $scope.lihatHasil = function (dataItem) {
        debugger;
        medifirstService.get("registrasi/ambil-dokumen-papj?norec=" + dataItem.norec_doc).then(function (dat) {
          let dokumen = dat.data[0].dokumen;
          let type = dat.data[0].type;
          const win = window.open("", "_blank");
          let html = "";

          html += "<html>";
          html += '<body style="margin:0!important">';
          html += '<embed width="100%" height="100%" src="' + dokumen + '" type="' + type + '" />';
          html += "</body>";
          html += "</html>";

          setTimeout(() => {
            win.document.write(html);
          }, 0);
        });
      };

      //-----------------------------------------------------------------------------------------
      //ash 2023-12-20 PAPJ

      var datapapj = [];

      $scope.pegawaiLogin = JSON.parse(localStorage.getItem("pegawai"));

      $scope.listInstalasi = [
        { id: 1, nama: "Rawat Inap" },
        { id: 2, nama: "Rawat Jalan" },
        { id: 3, nama: "IGD" },
        { id: 4, nama: "Rehabilitasi Medik" },

        // freetext apabila lain lain
      ];

      $scope.$watch("item.instalasi", function (e) {
        if (e.nama == "Rawat Inap") {
          $scope.isRawatInap = true;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        } else if (e.nama == "Rawat Jalan") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = true;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        } else if (e.nama == "IGD") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = true;
        } else if (e.nama == "Rehabilitasi Medik") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = true;
          $scope.isIgd = false;
        } else {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        }
      });

      $scope.$watch("item.instalasiverif", function (e) {
        if (e.nama == "Rawat Inap") {
          $scope.isRawatInap = true;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        } else if (e.nama == "Rawat Jalan") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = true;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        } else if (e.nama == "IGD") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = true;
        } else if (e.nama == "Rehabilitasi Medik") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = true;
          $scope.isIgd = false;
        } else {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        }
      });

      $scope.$watch("item.instalasiklaim", function (e) {
        if (e.nama == "Rawat Inap") {
          $scope.isRawatInap = true;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
          $scope.item.ruanganrjpapj = undefined;
          $scope.item.ruanganigdpapj = undefined;
          $scope.item.ruanganrmpapj = undefined;
        } else if (e.nama == "Rawat Jalan") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = true;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
          $scope.item.ruanganrjpapj = undefined;
          $scope.item.ruanganigdpapj = undefined;
          $scope.item.ruanganrmpapj = undefined;
        } else if (e.nama == "IGD") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = true;
          $scope.item.ruanganrjpapj = undefined;
          $scope.item.ruanganigdpapj = undefined;
          $scope.item.ruanganrmpapj = undefined;
        } else if (e.nama == "Rehabilitasi Medik") {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = true;
          $scope.isIgd = false;
          $scope.item.ruanganrjpapj = undefined;
          $scope.item.ruanganigdpapj = undefined;
          $scope.item.ruanganrmpapj = undefined;
        } else {
          $scope.isRawatInap = false;
          $scope.isRawatJalan = false;
          $scope.isRehabilitasiMedik = false;
          $scope.isIgd = false;
        }
      });

      $scope.tabkirimberkas = function () {
        LoadDataKirimPAPJ();
        LoadDataBelumKirim();
      };

      $scope.tabverifberkas = function () {
        LoadDataVerifPAPJ();
        LoadDataBelumVerif();
      };

      $scope.tabklaimberkas = function () {
        LoadDataKlaimPAPJ();
        LoadDataBelumKlaim();
      };

      $scope.tabtidaklayak = function () {
        LoadDataTidakLayak();
      };
      $scope.tabdiRajalkan = function () {
        LoadDataDirajalkan();
      };
      $scope.tabPending = function () {
        LoadDataPending();
      };

      $scope.SearchDataKirim = function () {
        LoadDataKirimPAPJ();
      };
      $scope.SearchDataVerif = function () {
        LoadDataVerifPAPJ();
      };
      $scope.SearchDataKlaim = function () {
        LoadDataKlaimPAPJ();
      };
      $scope.SearchTidakLayak = function () {
        LoadDataTidakLayak();
      };
      $scope.SearchDirajalkan = function () {
        LoadDataDirajalkan();
      };
      $scope.SearchPending = function () {
        LoadDataPending();
      };

      $scope.showpapj = function (dataselected) {
        $scope.dataSelected = dataselected;
        $scope.dataSelected.noregistrasi = dataselected.noRegistrasi;
        $scope.dataSelected.tglmasuk = dataselected.tanggalMasuk;
        if (dataselected.noRegistrasi == undefined) {
          toastr.error("Pilih Data Terlebih Dahulu", "Peringatan");
          return;
        }

        LoadDataDokumenpapj(dataselected);

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

        $scope.pilih;

        // $scope.isCetakDokumen=true
        // $scope.isCetakAll=false
        $scope.cetakAll2();

        $scope.popUpShow.center().open();
      };

      $scope.cetakAll = function () {
        debugger;
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date($scope.dataSelected.tgllahir);
        const secondDate = new Date($scope.dataSelected.tglmasuk);
        let umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        // let dataReport = {
        //     'report': 'rekapbilling'
        // };
        let dataReport = [];
        dataReport.push({ report: "rekapbilling" });
        var local = JSON.parse(localStorage.getItem("profile"));
        var profile = local.id;
        window.open(config.baseApiBackend + "report/cetak-semua-inacbg?noregistrasi=" + $scope.dataSelected.noregistrasi + "&umurday=" + umurDay + "&kdprofile=" + profile, "_blank");
        $scope.isRouteLoading = false;
      };

      function LoadDataDokumenpapj(dataItem) {
        medifirstService.get("registrasi/get-dokumen-penunjang?noRegistrasi=" + dataItem.noRegistrasi + "&isInaCbg=true").then(function (dat) {
          for (let i = 0; i < dat.data.length; i++) {
            dat.data[i].no = i + 1;
          }
          $scope.sourceDokumenTm = new kendo.data.DataSource({
            data: dat.data,
            length: dat.data.length,
            pageSize: 20,
          });
        });
      }

      $scope.columnPasienKirimPapj = {
        toolbar: ["excel"],
        excel: {
          fileName: "DaftarPasienSudahKirimBerkasKePAPJ.xlsx",
          allPages: true,
        },
        excelExport: function (e) {
          var sheet = e.workbook.sheets[0];
          sheet.frozenRows = 2;
          sheet.mergedCells = ["A1:M1"];
          sheet.name = "Orders";

          var myHeaders = [
            {
              value: "Daftar Pasien Sudah Kirim Berkas Ke CASEMIX",
              fontSize: 20,
              textAlign: "center",
              background: "#ffffff",
              // color:"#ffffff"
            },
          ];

          sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
        },
        selectable: "row",
        pageable: true,
        columns: [
          {
            field: "no",
            title: "No",
            width: "50px",
          },
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "80px",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "statuspapj",
            title: "Berkas",
            width: "80px",
            template: '<button class="k-button white1" ng-click="KirimBalik(dataItem)" style="margin:0 0 5px">KEMBALIKAN BERKAS KERUANGAN</button>',
          },
          {
            field: "jawaban",
            title: "Jawban",
            width: "200px",
            template: '<button class="k-button white1" ng-click="viewJawaban(dataItem)" style="margin:0 0 5px">JAWABAN</button>',
          },
          {
            field: "namadiagnosa",
            title: "Ubah Diagnosa",
            width: "80px",
            template: '<button class="k-button white1" ng-click="setDiagnosa3(dataItem)" style="margin:0 0 5px">Ubah Diagnosa</button>',
          },
          {
            field: "namadiagnosa",
            title: "Nama Diagnosa",
            width: "80px",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "70px",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "tgltutupfaktur",
            title: "Tgl Tutup Faktur",
            width: "70px",
            template: "<span class='style-center'>#= tgltutupfaktur ? tgltutupfaktur : 'Belum Tutup Faktur' #</span>",
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "90px",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "150px",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "90px",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "100px",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "150px",
            template: "<span class='style-center'>#: nosep #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "150px",
          },
          {
            field: "kamar",
            title: "Kamar",
            width: "150px",
          },
          {
            field: "bed",
            title: "Bed",
            width: "150px",
          },
          {
            field: "kelas",
            title: "Kelas Ditanggung",
            width: "150px",
          },
          {
            field: "ksm",
            title: "KSM",
            width: "150px",
            template: "<span class='style-left'>#: ksm #</span>",
          },
          {
            field: "dpjp",
            title: "Dokter",
            width: "150px",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "90px",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },

          {
            field: "pegawaikirim",
            title: "Pegawai Kirim Berkas",
            width: "150px",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tglkirim",
            title: "Tanggal Kirim Berkas",
            width: "90px",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "statuspapj",
            title: "Status Verif",
            width: "90px",
            template: '<button class="k-button white1" ng-click="VerifPapj(dataItem)" style="margin:0 0 5px">VERIF SELESAI</button>',
          },
        ],
      };

      $scope.VerifPapj = function (dataItem) {
        datapapj = dataItem;

        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan melakukan verifikasi data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.VerifPapjOk();
        });
      };

      $scope.VerifPapjOk = function (dataItem) {
        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          status: "2", //dalam table nilai nya kirim = 1
        };
        //send papj
        medifirstService.post("tatarekening/save-papj-verif", json).then(function (e) {
          //ok
          LoadDataKirimPAPJ();
          LoadDataTidakLayak();
        });
      };

      $scope.BatalVerifPapj = function (dataItem) {
        datapapj = dataItem;

        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan membatalkan verifikasi data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.BatalVerifPapjOk();
        });
      };
      $scope.BatalSiapKlaimPapj = function (dataItem) {
        datapapj = dataItem;

        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan membatalkan siap klaim?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.BatalSiapKlaimPapjOk();
        });
      };
      $scope.BatalSiapKlaimPapjOk = function (dataItem) {
        var json = {
          norec_pd: datapapj.norec,
          pegawai_batalsiapklaim: $scope.pegawaiLogin.id,
          status: "2", //dalam table nilai nya kirim = 2
        };
        //send papj
        medifirstService.post("tatarekening/save-papj-batalsiapklaim", json).then(function (e) {
          //ok
          LoadDataVerifPAPJ();
        });
      };

      $scope.BatalVerifPapjOk = function (dataItem) {
        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_batalverif: $scope.pegawaiLogin.id,
          status: "1", //dalam table nilai nya kirim = 1
        };
        //send papj
        medifirstService.post("tatarekening/save-papj-batalverif", json).then(function (e) {
          //ok
          LoadDataVerifPAPJ();
        });
      };

      $scope.KirimEKlaim = function (dataItem) {
        datapapj = dataItem;

        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan melakukan pengiriman untuk data EKlaim?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.KirimEKlaimOk();
        });
      };

      $scope.KirimEKlaimOk = function (dataItem) {
        datapapj = dataItem;
        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          status: "3", //dalam table nilai nya kirim = 1
        };
        //send papj
        medifirstService.post("tatarekening/save-papj-klaim", json).then(function (e) {
          //ok
          LoadDataVerifPAPJ();
          // LoadDataEKlaimPAPJ();
          cekPsnDaftarThisMonth(dataItem);
        });
      };

      $scope.BerkasTidakLayak = function (dataItem) {
        datapapj = dataItem;
        $scope.item.alasan = datapapj.alasan;
        $scope.popUpHapusSEP.center().open();
        // $scope.popUpAlasanTidakLayak.center().open();
        // var json = {
        //   'norec_pd': datapapj.norec,
        //   'pegawaifk_verif': $scope.pegawaiLogin.id,
        //   'status' : '4' //dalam table nilai nya kirim = 1
        // }
        // //send papj
        // medifirstService.post('tatarekening/save-papj-tidak-layak', json).then(function (e) {
        //   //ok
        //   LoadDataVerifPAPJ()
        //   LoadDataEKlaimPAPJ()
        // })
      };

      // HAPUS SEP
      $scope.SaveHapusSEP = function (dataItem) {
        $scope.popUpAlasanTidakLayak.center().open();
        $scope.popUpHapusSEP.close();
      };

      $scope.CloseHapusSEP = function (dataItem) {
        $scope.popUpHapusSEP.close();
      };

      // END HAPUS SEP

     $scope.SaveAlasan = async function () {
        try {
          if (!$scope.item.alasan || $scope.item.alasan.trim() === "") {
            alert("Alasan berkas tidak layak tidak boleh kosong!");
            return;
          }

          if (!datapapj || !datapapj.norec) {
            toastr.error("Data pasien tidak ditemukan!");
            return;
          }

          const payload = {
            norec_pd: datapapj.norec,
            pegawaifk_verif: $scope.pegawaiLogin.id,
            alasan: $scope.item.alasan,
            status: "4",
          };

          await medifirstService.post("tatarekening/save-papj-tidak-layak", payload);

          $scope.popUpAlasanTidakLayak.close();
          $scope.popUpHapusSEP.close();
          await LoadDataVerifPAPJ();

          if (datapapj.nosep) {
            const resDelete = await medifirstService.deleteNonMessage(
              "bridging/bpjs2/delete-sep?nosep=" + datapapj.nosep
            );

            if (resDelete.data.metaData.code === "200") {
              $scope.saveLogging(
                "Hapus SEP",
                "no SEP",
                datapapj.jenisAsuransi,
                "Hapus No SEP " + datapapj.jenisAsuransi + " otomatis melalui mutasi pada sistem Transmedic"
              );
              toastr.success("Hapus SEP otomatis berhasil!");

              // Nonaktifkan pemakaian asuransi
              if (datapapj.norec_pa) {
                await medifirstService.post("registrasi/nonaktif-pemakaian-asuransi", {
                  norec: datapapj.norec_pa,
                });
              }

            } else {
              toastr.error("Hapus SEP otomatis gagal! error : " + resDelete.data.metaData.message);
            }
          } else {
            // ✅ Kalau tidak ada SEP, proses dianggap selesai -> tutup popup
            $scope.popUpHapusSEP.close();
          }

        } catch (err) {
          console.error(err);
          toastr.error("Terjadi kesalahan saat menyimpan alasan atau menghapus SEP!");
        }
      };

      $scope.CloseAlasan = function (dataItem) {
        $scope.popUpAlasanTidakLayak.close();
      };

      $scope.KirimBalik = function (dataItem) {
        datapapj = dataItem;
        // $scope.item.ruanganMulti = []
        $scope.item.catatan = datapapj.keterangan;
        $scope.popupCatatanPapj.center().open();
      };

      $scope.viewJawaban = function (dataItem) {
        datapapj = dataItem;
        $scope.item.jawaban = datapapj.jawaban;
        $scope.popupJawabanPapj.center().open();
      };

      $scope.viewAlasan = function (dataItem) {
        datapapj = dataItem;
        $scope.item.alasan = datapapj.alasan;
        $scope.popupAlasanPapj.center().open();
      };

      $scope.CloseCatatan = function (dataItem) {
        $scope.popupCatatanPapj.close();
      };

      $scope.CloseJawaban = function (dataItem) {
        $scope.popupJawabanPapj.close();
      };

      $scope.TutupAlasan = function (dataItem) {
        $scope.popupAlasanPapj.close();
      };
      $scope.SaveCatatan = function (dataItem) {
        if ($scope.item.catatan == undefined || $scope.item.catatan == null || $scope.item.catatan == "") {
          alert("Catatan Perbaikkan tidak boleh kosong. Masukkan Catatan Perbaikan untuk Pengembalian Dokumen!");
          return;
        }

        // if ($scope.item.ruanganMulti.length <= 0) {
        //     alert('Harap pilih ruangan yang dikembalikan !')
        //     return
        // }

        // var listRuanganx = ""

        // if ($scope.item.ruanganMulti.length != 0) {
        //     var a = ""
        //     var b = ""
        //     for (var i = $scope.item.ruanganMulti.length - 1; i >= 0; i--) {

        //         var c = $scope.item.ruanganMulti[i].id
        //         b = "," + c
        //         a = a + b
        //     }
        //     listRuanganx = a.slice(1, a.length)
        // }

        var json = {
          norec_pd: datapapj.norec,
          norec_pj: datapapj.norec_pj,
          keterangan: $scope.item.catatan,
          pegawaifk_kembalikan: $scope.pegawaiLogin.id,
          status: "4", //dalam table nilai nya kirim = 1
          statusbag: datapapj.statuspapj == 1 ? 1 : 2,
          // 'ruanganArr' : listRuanganx
        };
        //send papj
        debugger;
        medifirstService.post("tatarekening/save-papj-dikembalikan", json).then(function (e) {
          //ok
          $scope.popupCatatanPapj.close();
          LoadDataKirimPAPJ();

          let datanotif = {
            title: "Pengembalian Berkas",
            namaruangan: datapapj.namaRuangan,
            namapasien: datapapj.namaPasien + "~" + datapapj.noRegistrasi,
            tglorder: moment($scope.now).format("YYYY-MM-DD HH:mm:ss"),
            nocm: datapapj.noCm,
            idruangan: datapapj.ruid,
            form: "Berkas Kembali",
          };
          medifirstService.postNonMessage("microservice/savenotif", datanotif).then(function (e) {
            var socket1 = io.connect(config.urlSocket);
            var arrayS = {
              no: 2,
            };
            socket1.emit("order-resep", arrayS);
          });
        });
      };

      // LoadDataKirimPAPJ();

      function LoadDataKirimPAPJ(shouldUpdateCache = true) {
        $scope.isRouteLoading = true;

        var tglAwal = moment($scope.item.tglAwalKirim).format("YYYY-MM-DD 00:00");
        var tglAkhir = moment($scope.item.tglAkhirKirim).format("YYYY-MM-DD 23:59");

        var tempNamaOrReg = $scope.item.namaOrReg || "";
        var tempStatus = $scope.item.status ? $scope.item.status.namaExternal : "";
        var tempStatusArr = $scope.item.status
          ? { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal }
          : {};

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasi != undefined) {
          tempInstalasiId = $scope.item.instalasi.id;
          tempInstalasiIdArr = {
            id: $scope.item.instalasi.id,
            nama: $scope.item.instalasi.nama,
          };
        }

        // ruangan
        var tempRuanganRIId = "";
        var tempRuanganRJId = "";
        var tempRuanganRigd = "";
        var tempRuanganRm = "";
        var tempRuanganRIIdArr = {};
        var tempRuanganRJIdArr = {};
        var tempRuanganRigdArr = {};
        var tempRuanganRmArr = {};

        if ($scope.item.instalasi != undefined) {
          if ($scope.item.instalasi.id == 1 && $scope.item.ruanganripapj != undefined) {
            tempRuanganRIId = $scope.item.ruanganripapj.id;
            tempRuanganRIIdArr = { id: $scope.item.ruanganripapj.id, nama: $scope.item.ruanganripapj.nama };
          } else if ($scope.item.instalasi.id == 2 && $scope.item.ruanganrjpapj != undefined) {
            tempRuanganRJId = $scope.item.ruanganrjpapj.id;
            tempRuanganRJIdArr = { id: $scope.item.ruanganrjpapj.id, nama: $scope.item.ruanganrjpapj.namaruangan };
          } else if ($scope.item.instalasi.id == 3 && $scope.item.ruanganigdpapj != undefined) {
            tempRuanganRigd = $scope.item.ruanganigdpapj.id;
            tempRuanganRigdArr = { id: $scope.item.ruanganigdpapj.id, nama: $scope.item.ruanganigdpapj.nama };
          } else if ($scope.item.ruanganrmpapj != undefined) {
            tempRuanganRm = $scope.item.ruanganrmpapj.id;
            tempRuanganRmArr = { id: $scope.item.ruanganrmpapj.id, nama: $scope.item.ruanganrmpapj.namaruangan };
          }
        }

        var tempNoRm = $scope.item.noRm;
        var tempNoReg = $scope.item.noReg;
        var tempNoSEP = $scope.item.nosepKirim;
        var jmlRow = $scope.item.jmlRows || "";

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-kirim?" +
              "namaPasien=" +
              tempNamaOrReg +
              "&noReg=" +
              tempNoReg +
              "&instalasiId=" +
              tempInstalasiId +
              "&noRm=" +
              tempNoRm +
              "&noSep=" +
              tempNoSEP +
              "&jmlRows=" +
              jmlRow +
              "&ruangRI=" +
              tempRuanganRIId +
              "&ruangRJ=" +
              tempRuanganRJId +
              "&ruangRIg=" +
              tempRuanganRigd +
              "&ruangRM=" +
              tempRuanganRm +
              "&tglAwal=" +
              tglAwal +
              "&tglAkhir=" +
              tglAkhir
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            $scope.isRouteLoading = false;
            var data = data.data;
            var datax = [];
            var tempdata = "";
            let no = 0;

            let used = new Set();

            for (let i = 0; i < data.length; i++) {

              let noReg = (data[i].noRegistrasi || "").trim();

              if (!used.has(noReg)) {

                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";

                data[i].status2 = data[i].tglclosing == null ? "CLOSING" : "BATAL";

                no++;
                data[i].no = no;

                used.add(noReg);
                datax.push(data[i]);
              }
            }
            $scope.dataPasienKirimPapj = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
            });
          });

        // ✅ hanya update cache kalau diminta
          if (shouldUpdateCache) {
            var chacePeriode = {
              0: moment($scope.item.tglAwalKirim).format('YYYY-MM-DD'), // <-- UBAH DI SINI
              1: moment($scope.item.tglAkhirKirim).format('YYYY-MM-DD'),
              2: $scope.item.noRm,
              3: $scope.item.instalasi,
              4: $scope.item.ruanganripapj,
              5: $scope.item.ruanganigdpapj,
              6: $scope.item.ruanganrmpapj,
              7: $scope.item.ruanganrjpapj,
            };
            var chacePeriodeJSON = JSON.stringify(chacePeriode); // Ubah objek jadi string
            localStorage.setItem("BerkasKirimanDariRuangan", chacePeriodeJSON);
          }
      }

      //--Verif---------------------------------------------

      $scope.columnPasienVerifPapj = {
        toolbar: ["excel"],
        excel: {
          fileName: "BerkasSudahVerifCasemix.xlsx",
          allPages: true,
        },
        excelExport: function (e) {
          var sheet = e.workbook.sheets[0];
          sheet.frozenRows = 2;
          sheet.mergedCells = ["A1:K1"];
          sheet.name = "Orders";

          var myHeaders = [
            {
              value: "Berkas Sudah Verif Casemix",
              fontSize: 20,
              textAlign: "center",
              background: "#ffffff",
              // color:"#ffffff"
            },
          ];

          sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
        },
        selectable: "row",
        pageable: true,
        columns: [
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "statuspapj",
            title: "Berkas",
            width: "6.5%",
            template: '<button class="k-button white1" ng-click="BatalVerifPapj(dataItem)" style="margin:0 0 5px">BATAL VERIFIKASI</button>',
          },
          {
            field: "statuspapj",
            title: "Berkas",
            width: "80px",
            template: '<button class="k-button white1" ng-click="KirimBalik(dataItem)" style="margin:0 0 5px">KEMBALIKAN BERKAS KERUANGAN</button>',
          },
          {
            field: "namadiagnosa",
            title: "Ubah Diagnosa",
            width: "4.5%",
            template: '<button class="k-button white1" ng-click="setDiagnosa3(dataItem)" style="margin:0 0 5px">Ubah Diagnosa</button>',
          },
          {
            field: "namadiagnosa",
            title: "Nama Diagnosa",
            width: "4.5%",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "5.5%",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "5.5%",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "5.5%",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "5.5%",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "5.5%",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "8%",
            template: "<span class='style-center'>#: nosep #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "5.5%",
          },
          {
            field: "kamar",
            title: "Kamar",
            width: "5.5%",
          },
          {
            field: "bed",
            title: "Bed",
            width: "5.5%",
          },
          {
            field: "kelas",
            title: "Kelas Ditanggung",
            width: "5.5%",
          },
          {
            field: "dpjp",
            title: "Dokter",
            width: "5.5%",
          },
          {
            field: "statusclaim",
            title: "STATUS KLAIM",
            width: "5.5%",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },
          {
            field: "pegawaikirim",
            title: "Pegawai Verif Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tanggalkirim",
            title: "Tanggal Verif Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "statuspapj",
            title: "Status Verif",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="KirimEKlaimOk(dataItem)" style="margin:0 0 5px">KIRIM DAN INPUT KE EKLAIM INACBG</button>',
          },
          {
            field: "statuspapj",
            title: "Berkas Tidak Layak",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="BerkasTidakLayak(dataItem)" style="margin:0 0 5px">BERKAS TIDAK LAYAK</button>',
          },
          {
            field: "statuspapj",
            title: "Klaim Dirajalkan",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="KlaimDirajalkan(dataItem)" style="margin:0 0 5px">KLAIM DIRAJALKAN</button>',
          },
          {
            field: "statuspapj",
            title: "Pending",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="KlaimPending(dataItem)" style="margin:0 0 5px">PENDING</button>',
          },
        ],
      };

      // LoadDataVerifPAPJ();

      function LoadDataVerifPAPJ(shouldUpdateCache2 = true) {
        // var tglAwal = moment($scope.item.tglAwalPulangVerif).format('YYYY-MM-DD HH:mm');
        // var tglAkhir = moment($scope.item.tglAkhirPulangVerif).format('YYYY-MM-DD HH:mm');
        var tglAwal = moment($scope.item.tglAwalPulangVerif).format("YYYY-MM-DD 00:00");
        var tglAkhir = moment($scope.item.tglAkhirPulangVerif).format("YYYY-MM-DD 23:59");

        $scope.isRouteLoading = true;
        var temptglverif = "";
        // var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
        //debugger;

        var tempNamaOrReg = "";
        if ($scope.item.namaOrRegverif != undefined) {
          tempNamaOrReg = $scope.item.namaOrRegverif;
        }

        // var tempNoReg = "";
        // if ($scope.item.noRegverif != undefined) {
        // tempNoReg = $scope.item.noRegverif;
        // }

        //var temptglverif = "";
        // if ($scope.item.tanggalbulan != undefined) {
        //     temptglverif = moment($scope.item.tanggalbulan).format('YYYY-MM');
        // }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasiverif != undefined) {
          tempInstalasiId = $scope.item.instalasiverif.id;
          tempInstalasiIdArr = { id: $scope.item.instalasiverif.id, nama: $scope.item.instalasiverif.nama };
        }

        var tempRuanganRIId = "";
        var tempRuanganRIIdArr = {};
        var tempRuanganRJId = "";
        var tempRuanganRJIdArr = {};
        var tempRuanganRigd = "";
        var tempRuanganRigdArr = {};
        var tempRuanganRm = "";
        var tempRuanganRmArr = {};

        $scope.$watch("item.instalasiverif", function (e) {
          if (e.nama == "Rawat Inap") {
            $scope.isRawatInap = true;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          } else if (e.nama == "Rawat Jalan") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = true;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          } else if (e.nama == "IGD") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = true;
          } else if (e.nama == "Rehabilitasi Medik") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = true;
            $scope.isIgd = false;
          } else {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          }
        });
        if ($scope.item.instalasiverif != undefined) {
          if ($scope.item.instalasiverif.id == 1) {
            if ($scope.item.ruanganripapjverif != undefined) {
              tempRuanganRIId = $scope.item.ruanganripapjverif.id;
              tempRuanganRIIdArr = { id: $scope.item.ruanganripapjverif.id, nama: $scope.item.ruanganripapjverif.nama };
            }
          } else if ($scope.item.instalasiverif.id == 2) {
            if ($scope.item.ruanganrjpapjverif != undefined) {
              tempRuanganRJId = $scope.item.ruanganrjpapjverif.id;
              tempRuanganRJIdArr = { id: $scope.item.ruanganrjpapjverif.id, nama: $scope.item.ruanganrjpapjverif.namaruangan };
            }
          } else if ($scope.item.instalasiverif.id == 3) {
            if ($scope.item.ruanganigdpapjverif != undefined) {
              tempRuanganRigd = $scope.item.ruanganigdpapjverif.id;
              tempRuanganRigdArr = { id: $scope.item.ruanganigdpapjverif.id, nama: $scope.item.ruanganigdpapjverif.namaruangan };
            }
          } else {
            if ($scope.item.ruanganrmpapjverif != undefined) {
              tempRuanganRm = $scope.item.ruanganrmpapjverif.id;
              tempRuanganRmArr = { id: $scope.item.ruanganrmpapjverif.id, nama: $scope.item.ruanganrmpapjverif.namaruangan };
            }
          }
        }

        //debugger
        // var tempNoRm = "";
        // if ($scope.item.noRmverif != undefined) {
        // tempNoRm = $scope.item.noRmverif;
        // }
        var tempNoRm = $scope.item.noRmverif;
        var tempNoReg = $scope.item.noRegVerif;
        var tempNoSEP = $scope.item.nosepVerif;
        let tempInstalasiId3 = $scope.item.instalasiverif;
        let tempRuanganRI = $scope.item.ruanganripapjverif;
        let tempRuanganRJ = $scope.item.ruanganrjpapjverif;
        let tempRuanganIGD = $scope.item.ruanganigdpapjverif;
        let tempRuanganRM = $scope.item.ruanganrmpapjverif;

        var jmlRow = "";
        if ($scope.item.jmlRowsverif != undefined) {
          jmlRow = $scope.item.jmlRowsverif;
        }

        // var chacePeriode = {
        //   0: "",
        //   1: "",
        //   2: "",
        //   3: tempNamaOrReg,
        //   4: tempNoReg,
        //   5: temptglverif,
        //   6: tempInstalasiIdArr,
        //   // 7: tempNoRm,
        //   8: jmlRow,
        //   9: tempRuanganRIIdArr,
        //   10: tempRuanganRJIdArr,
        //   11: tempRuanganRigdArr,
        //   12: tempRuanganRmArr,
        //   12: tempNoSEP,
        // };
        // cacheHelper.set("aDaftarPasienPulangCtrl", chacePeriode);

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-verif?" +
              "namaPasien=" +
              tempNamaOrReg +
              "&noReg=" +
              tempNoReg +
              "&instalasiId=" +
              tempInstalasiId +
              "&noRm=" +
              tempNoRm +
              "&noSep=" +
              tempNoSEP +
              "&jmlRows=" +
              jmlRow +
              // + "&temptglverif=" + temptglverif
              "&ruangRI=" +
              tempRuanganRIId +
              "&ruangRJ=" +
              tempRuanganRJId +
              "&ruangRIg=" +
              tempRuanganRigd +
              "&ruangRM=" +
              tempRuanganRm +
              "&tglAwal=" +
              tglAwal +
              "&tglAkhir=" +
              tglAkhir
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            $scope.isRouteLoading = false;
            var data = data.data;

            var datax = [];
            var tempdata = "";
            // debugger;
            for (let i = 0; i < data.length; i++) {
              if (data[i].noRegistrasi != tempdata) {
                // const element = data[i];
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
                if (data[i].tglclosing == null) {
                  data[i].status2 = "CLOSING";
                } else {
                  data[i].status2 = "BATAL";
                }

                tempdata = data[i].noRegistrasi;
                datax.push(data[i]);
              }
            }

            $scope.dataPasienVerifPapj = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {},
                },
              },
            });
          });
          // ✅ hanya update cache kalau diminta
          if (shouldUpdateCache2) {
            var chacePeriode = {
              0: moment($scope.item.tglAwalPulangVerif).format('YYYY-MM-DD'), // <-- UBAH DI SINI
              1: moment($scope.item.tglAkhirPulangVerif).format('YYYY-MM-DD'),
              2: $scope.item.noRmVerif,
              3: $scope.item.instalasiverif,
              4: $scope.item.ruanganripapjverif,
              5: $scope.item.ruanganigdpapjverif,
              6: $scope.item.ruanganrmpapjverif,
              7: $scope.item.ruanganrjpapjverif,
            };
            var chacePeriodeJSON = JSON.stringify(chacePeriode); // Ubah objek jadi string
            localStorage.setItem("BerkasSudahVerif", chacePeriodeJSON);
          }
      }

      //--KLAIM---------------------------------------------

      $scope.columnPasienKlaimPapj = {
        selectable: "row",
        pageable: true,
        dataSource: $scope.dataPasienKlaimPapj,
        pageable: true,
        toolbar: ["excel"],
        excel: {
          fileName: "DataPasienKlaimPapj.xlsx",
          allPages: true,
        },
        columns: [
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "5.5%",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "statuspapj",
            title: "Berkas",
            width: "4.5%",
            template: '<button class="k-button white1" ng-click="BatalSiapKlaimPapj(dataItem)" style="margin:0 0 5px">BATAL SIAP KLAIM</button>',
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "5.5%",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "5.5%",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "5.5%",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "5.5%",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "5.5%",
          },
          {
            field: "dpjp",
            title: "Dokter DPJP",
            width: "5.5%",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "9%",
            template: '<button class="k-button" ng-click="KlaimclickCard(dataItem)" style="margin:0 0 5px">#: nosep #</button>',
          },
          {
            field: "norujukan",
            title: "No Rujukan",
            width: "5.5%",
          },
          {
            field: "nosuratskdp",
            title: "No Surkon",
            width: "5.5%",
          },
          {
            field: "status",
            title: "Status Grouping",
            width: "5%",
          },
          {
            field: "statusclosing",
            title: "Status Faktur",
            width: "5%",
          },
          {
            field: "pegawaikirim",
            title: "Pegawai Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tglkirim",
            title: "Tanggal Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "totalbiayars",
            title: "Biaya RS",
            width: "5.5%",
          },
          {
            field: "totalpiutangpenjamin",
            title: "Klaim INACBG",
            width: "5.5%",
          },
          {
            field: "biayanaikkelas",
            title: "Biaya Naik Kelas",
            width: "5.5%",
          },
          {
            field: "cbgcode",
            title: "Kode CBG",
            width: "5.5%",
          },
          {
            field: "cbgdescription",
            title: "Deskripsi",
            width: "5.5%",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },
          {
            field: "statuspapj",
            title: "Berkas Tidak Layak",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="BerkasTidakLayak(dataItem)" style="margin:0 0 5px">BERKAS TIDAK LAYAK</button>',
          },
          {
            field: "statuspapj",
            title: "Klaim Dirajalkan",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="KlaimDirajalkan(dataItem)" style="margin:0 0 5px">KLAIM DIRAJALKAN</button>',
          },
          {
            field: "statuspapj",
            title: "Pending",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="KlaimPending(dataItem)" style="margin:0 0 5px">PENDING</button>',
          },
        ],
      };

      $scope.columnPasienKlaimPapjTidakLayak = {
        selectable: "row",
        pageable: true,
        dataSource: $scope.dataPasienTidakLayak,
        pageable: true,
        toolbar: ["excel"],
        excel: {
          fileName: "DataPasienKlaimPapjTidakLayak.xlsx",
          allPages: true,
        },
        columns: [
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "5.5%",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "5.5%",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "5.5%",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "5.5%",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "5.5%",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "5.5%",
          },
          {
            field: "kamar",
            title: "Kamar",
            width: "100px",
            template: "<span class='style-left'>#: kamar #</span>",
          },
          {
            field: "bed",
            title: "Bed",
            width: "70px",
            template: "<span class='style-left'>#: bed #</span>",
          },
          {
            field: "dpjp",
            title: "Dokter DPJP",
            width: "5.5%",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "9%",
          },
          {
            field: "status",
            title: "Status Grouping",
            width: "5%",
          },
          {
            field: "pegawaikirim",
            title: "Pegawai Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tglkirim",
            title: "Tanggal Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "totalbiayars",
            title: "Biaya RS",
            width: "5.5%",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalbiayars #', 'Rp. ')}}</span>",
          },
          {
            field: "totalpiutangpenjamin",
            title: "Klaim INACBG",
            width: "5.5%",
          },
          {
            field: "biayanaikkelas",
            title: "Biaya Naik Kelas",
            width: "5.5%",
          },
          {
            field: "cbgcode",
            title: "Kode CBG",
            width: "5.5%",
          },
          {
            field: "cbgdescription",
            title: "Deskripsi",
            width: "5.5%",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },
          {
            field: "alasan",
            title: "Alasan Tidak Layak",
            width: "160px",
            template: '<button class="k-button white1" ng-click="viewAlasan(dataItem)" style="margin:0 0 5px">Alasan</button>',
          },
          {
            field: "statuspapj",
            title: "Status Verif",
            width: "90px",
            template: '<button class="k-button white1" ng-click="VerifPapj(dataItem)" style="margin:0 0 5px">LAYAK</button>',
          },
        ],
      };

      // LoadDataKlaimPAPJ();

      function LoadDataKlaimPAPJ(shouldUpdateCache3 = true) {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format("YYYY-MM-DD 00:00");
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format("YYYY-MM-DD 23:59");

        // Filter Tanggal Klaim Berkas
        // var tglAwalKlaimBerkas = moment($scope.item.tanggalAwalKlaimBerkas).format("YYYY-MM-DD HH:mm");
        // var tglAkhirKlaimBerkas = moment($scope.item.tanggalAkhirKlaimBerkas).format("YYYY-MM-DD HH:mm");
        //debugger;

        var tempNosep = "";
        if ($scope.item.noseppapj != undefined) {
          tempNosep = $scope.item.noseppapj;
        }

        var tempNoCM = "";
        if ($scope.item.noRmKlaim != undefined) {
          tempNoCM = $scope.item.noRmKlaim;
        }

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noRegKlaim != undefined) {
          tempNoReg = $scope.item.noRegKlaim;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan };
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal };
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasiklaim != undefined) {
          tempInstalasiId = $scope.item.instalasiklaim.id;
          tempInstalasiIdArr = { id: $scope.item.instalasiklaim.id, nama: $scope.item.instalasiklaim.nama };
        }
        //debugger
        var tempKelompokPasienId = "";
        var tempKelompokPasienIdArr = {};
        if ($scope.item.kelompokpasien != undefined) {
          tempKelompokPasienId = $scope.item.kelompokpasien.id;
          tempKelompokPasienIdArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompok };
        }
        var tempRekananId = "";
        var tempRekananIdArr = {};
        if ($scope.item.rekanan != undefined) {
          tempRekananId = $scope.item.rekanan.id;
          tempRekananIdArr = { id: $scope.item.rekanan.id, rekanan: $scope.item.rekanan.rekanan };
        }
        var tempNoRm = "";
        if ($scope.item.noRm != undefined) {
          tempNoRm = $scope.item.noRm;
        }
        var jmlRow = "";
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows;
        }

        var instalasiId = "";
        if ($scope.item.instalasiklaim != undefined) {
          var instalasiId = "&instalasiId=" + $scope.item.instalasiklaim.id;
        }

       var statusklaim = "";
        if ($scope.item.statusklaim && $scope.item.statusklaim.length > 0) {
            // ambil value-nya lalu gabung dengan koma
            var statusValues = $scope.item.statusklaim.map(x => x.value ).join(',');
            statusklaim = "&statusGrouping=" + statusValues;
        }

        var ruanganId = "";
        if ($scope.item.ruanganrjpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrjpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganigdpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganigdpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganrmpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrmpapj.id;
          instalasiId = "";
        }

        $scope.$watch("item.instalasiklaim", function (e) {
          if (e.nama == "Rawat Inap") {
            $scope.isRawatInap = true;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rawat Jalan") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = true;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "IGD") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = true;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rehabilitasi Medik") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = true;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          }
        });

        // var chacePeriode = {
        //   0: tglAwal,
        //   1: tglAkhir,
        //   2: tempStatusArr,
        //   3: tempNamaOrReg,
        //   4: tempNoReg,
        //   5: tempRuanganIdArr,
        //   6: tempInstalasiIdArr,
        //   7: tempNoRm,
        //   8: jmlRow,
        //   9: tempKelompokPasienIdArr,
        //   10: tempRekananIdArr
        //   // 11: tglAwalKlaimBerkas,
        //   // 12: tglAkhirKlaimBerkas,
        // };
        // cacheHelper.set("aDaftarPasienPulangCtrl", chacePeriode);

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-klaim?" 
                          + "namaPasien=" + tempNamaOrReg 
                          + "&tglAwal=" + tglAwal 
                          + "&tglAkhir=" + tglAkhir 
                          + "&noSep=" + tempNosep 
                          + "&noReg=" + tempNoReg 
                          + "&noRm=" + tempNoCM + instalasiId + ruanganId + statusklaim
                          // + "&tglAwalKlaimBerkas=" + tglAwalKlaimBerkas 
                          // + "&tglAkhirKlaimBerkas=" + tglAkhirKlaimBerkas 
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            ruanganId = "";
            $scope.isRouteLoading = false;
            var data = data.data;

            var tempdata = "";
            var datax = [];
            // debugger;
            for (let i = 0; i < data.length; i++) {
              if (data[i].noRegistrasi != tempdata) {
                // const element = data[i];
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
                if (data[i].tglclosing == null) {
                  data[i].status2 = "CLOSING";
                } else {
                  data[i].status2 = "BATAL";
                }

                tempdata = data[i].noRegistrasi;
                datax.push(data[i]);
              }
            }

            $scope.dataPasienKlaimPapj = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {},
                },
              },
            });
          });

        if (shouldUpdateCache3) {
            var chacePeriode = {
              0: moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD'), // <-- UBAH DI SINI
              1: moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD'),
              3: tempInstalasiIdArr,
            };
            var chacePeriodeJSON = JSON.stringify(chacePeriode); // Ubah objek jadi string
            localStorage.setItem("BerkasSiapKlaim", chacePeriodeJSON);
          }
      }
      function LoadDataTidakLayak() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format("YYYY-MM-DD HH:mm");
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format("YYYY-MM-DD HH:mm");
        //debugger;

        var tempNosep = "";
        if ($scope.item.noseppapj != undefined) {
          tempNosep = $scope.item.noseppapj;
        }

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noRegTidakLayak != undefined) {
          tempNoReg = $scope.item.noRegTidakLayak;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan };
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal };
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasiklaim != undefined) {
          tempInstalasiId = $scope.item.instalasiklaim.id;
          tempInstalasiIdArr = { id: $scope.item.instalasiklaim.id, nama: $scope.item.instalasiklaim.nama };
        }
        //debugger
        var tempKelompokPasienId = "";
        var tempKelompokPasienIdArr = {};
        if ($scope.item.kelompokpasien != undefined) {
          tempKelompokPasienId = $scope.item.kelompokpasien.id;
          tempKelompokPasienIdArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompok };
        }
        var tempRekananId = "";
        var tempRekananIdArr = {};
        if ($scope.item.rekanan != undefined) {
          tempRekananId = $scope.item.rekanan.id;
          tempRekananIdArr = { id: $scope.item.rekanan.id, rekanan: $scope.item.rekanan.rekanan };
        }
        var tempNoRm = "";
        if ($scope.item.noRmTidakLayak != undefined) {
          tempNoRm = $scope.item.noRmTidakLayak;
        }
        var jmlRow = "";
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows;
        }

        var instalasiId = "";
        if ($scope.item.instalasiklaim != undefined) {
          var instalasiId = "&instalasiId=" + $scope.item.instalasiklaim.id;
        }

        var ruanganId = "";
        if ($scope.item.ruanganrjpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrjpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganigdpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganigdpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganrmpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrmpapj.id;
          instalasiId = "";
        }

        $scope.$watch("item.instalasiklaim", function (e) {
          if (e.nama == "Rawat Inap") {
            $scope.isRawatInap = true;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rawat Jalan") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = true;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "IGD") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = true;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rehabilitasi Medik") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = true;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          }
        });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempStatusArr,
          3: tempNamaOrReg,
          4: tempNoReg,
          5: tempRuanganIdArr,
          6: tempInstalasiIdArr,
          7: tempNoRm,
          8: jmlRow,
          9: tempKelompokPasienIdArr,
          10: tempRekananIdArr,
        };
        cacheHelper.set("aDaftarPasienPulangCtrl", chacePeriode);

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-tidak-layak?" +
              "namaPasien=" +
              tempNamaOrReg +
              "&tglAwal=" +
              tglAwal +
              "&tglAkhir=" +
              tglAkhir +
              "&noSep=" +
              tempNosep +
              "&noReg=" +
              tempNoReg +
              "&noRm=" +
              tempNoRm +
              instalasiId +
              ruanganId
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            ruanganId = "";
            $scope.isRouteLoading = false;
            var data = data.data;

            var tempdata = "";
            var datax = [];
            // debugger;
            for (let i = 0; i < data.length; i++) {
              if (data[i].noRegistrasi != tempdata) {
                // const element = data[i];
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
                if (data[i].tglclosing == null) {
                  data[i].status2 = "CLOSING";
                } else {
                  data[i].status2 = "BATAL";
                }

                tempdata = data[i].noRegistrasi;
                datax.push(data[i]);
              }
            }

            $scope.dataPasienTidakLayak = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {},
                },
              },
            });
          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempInstalasiIdArr,
        };
        cacheHelper.set("BerkasTidakLayak", chacePeriode);
      }
      var handleFileSelect = function (file) {
        var files = document.getElementById("filePicker").files;

        for (var i = 0; i < files.length; i++) {
          //cek filenya
          //   if (files[i].size > 1048576) {
          // 	  alert('Ukuran foto tidak boleh lebih dari 1 MB !')
          // 	  return
          //   }
        }
        if (files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            getBase64(files[i]);
          }
        }
      };

      if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById("filePicker").addEventListener("change", handleFileSelect, false);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }
      function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          //    tes.push(reader)
          if (pdf.length > 0) {
            pdf.splice(pdf, 1);
          }
          console.log(reader.result);
          pdf.push(reader.result);
          namaFile = file.name;
          // typeFIle = file.type
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }
      $scope.simpanDokumen = function () {
        debugger;
        var kirimfile = pdf[0];
        let result = kirimfile.substring(28);
        var dt1 = {};
        var dt2 = [];
        dt1 = {
          metadata: {
            method: "file_upload",
            nomor_sep: $scope.dataSelected.nosep,
            file_class: $scope.item.jenisDokumen.jenisdokumen,
            file_name: $scope.item.jenisDokumen.reportdisplay,
          },
          data: result,
        };
        dt2.push(dt1);
        var objData = {
          data: dt2,
        };
        medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
          responData = e.data.dataresponse;
          toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
        });
        // let objSave = {
        //     objectruanganfk: tampungData.objectruanganfk,
        //     norec_pd: tampungData.norec_pd,
        //     dokumen: pdf[0],
        //     nocmfk: tampungData.nocmfk,
        //     namafile: namaFile,
        //     namapemeriksaan: 'NULL',
        //     keterangan: 'NULL',
        //     jenisdokumenfk: $scope.item.jenisDokumen.id,
        //     type: typeFIle
        // }
        // medifirstService.post('registrasi/save-dokumen-penunjang', objSave).then(function (e) {
        //     pdf = [];
        //     namaFile = '';
        //     typeFIle = '';
        //     delete $scope.item.jenisDokumen
        //     LoadDataDokumen(tampungData)
        // })
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
      var handleFileSelect2 = function () {
        var files = document.getElementById("filePicker2").files;

        pdf2 = [];
        namaFile2 = [];
        typeFIle2 = [];

        // loop dari semua file yang dipilih
        for (var i = 0; i < files.length; i++) {
          getBase642(files[i]);
        }
      };

      // Cek dukungan File API
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById("filePicker2").addEventListener("change", handleFileSelect2, false);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }

      function getBase642(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          pdf2.push(reader.result);
          namaFile2.push(file.name);
          typeFIle2.push(file.type);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }

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

      $scope.SetAsPrimary = function () {
        if ($scope.item.diagnosa == undefined) {
          alert("Pilih data yang mau di Set As Primary!!");
          return;
        }
        var diagnosa = {
          norec_dp: $scope.dataIcd10Selected.norec_detaildpasien,
        };
        var objSave = {
          diagnosa: diagnosa,
          objectjenisdiagnosafk: 1,
          noregistrasifk: $scope.dataIcd10Selected.norec_apd,
          Iddiagnosa: $scope.dataIcd10Selected.id,
        };
        medifirstService.post("registrasi/daftar-antrian-pasien/save-primary-diagnosa-pasien", objSave).then(function (e) {
          medifirstService
            .postLogging(
              "Diagnosis",
              "Norec DiagnosaPasien_T",
              "",
              "Set Primary Diagnosis ICD 10 ( " + $scope.dataIcd10Selected.kddiagnosa + "-" + $scope.dataIcd10Selected.namadiagnosa + " )" + " No Registrasi " + $scope.item.noregistrasi + "/ " + $scope.item.noMr
            )
            .then(function (res) {});
          $scope.dataSelected.noregistrasi = $scope.dataIcd10Selected.noregistrasi;
          delete $scope.item.jenisDiagnosis;
          delete $scope.item.diagnosa;
          delete $scope.item.keterangan;
          delete $scope.dataIcd10Selected;
          loadDiagnosa();
        });

      }

      $scope.SetAsPrimary2 = function (ai) {
        $scope.dataSelectedDiagnosa = ai

        var diagnosa = {
          norec_dp: ai.norec_detaildpasien,
        };
        var objSave = {
          diagnosa: diagnosa,
          objectjenisdiagnosafk: 1,
          noregistrasifk: ai.norec_apd,
          Iddiagnosa: ai.objectdiagnosafk,
        };
        medifirstService.post("registrasi/daftar-antrian-pasien/save-primary-diagnosa-pasien", objSave).then(function (e) {
          medifirstService
            .postLogging(
              "Diagnosis",
              "Norec DiagnosaPasien_T",
              "",
              "Set Primary Diagnosis ICD 10 ( " + ai.kddiagnosa + "-" + ai.namadiagnosa + " )" + " No Registrasi " + ai.noregistrasi
            )
            .then(function (res) {});
            $scope.setdetail(set);
        });

      }

      $scope.resumeMedis = function (data) {
        if (data == undefined) {
          toastr.error("Pilih Data Dahulu !", "Peringatan");
          return;
        }
        medifirstService.get("registrasi/get-apd?noregistrasi=" + data.noRegistrasi + "&objectruanganlastfk=" + data.ruid).then(function (e) {
          if (e.data.data.length > 0) {
            var arrrStr = {
              0: data.noCm,
              1: data.namaPasien,
              2: data.jeniskelamin,
              3: data.noRegistrasi,
              // 4: data.umur,
              5: data.jenisAsuransi,
              6: data.tglregistrasi,
              7: e.data.data[0].norec_apd,
              8: data.norec,
              // 9: data.objectkelasfk,
              // 10: data.namakelas,
              11: data.ruid,
              12: data.namaRuangan,
            };
            cacheHelper.set("cacheRekamMedis", arrrStr);
            if (data.deptid == 16 || data.deptid == 25) {
              $state.go("RekamMedis.ResumeRI", {
                noRec: e.data.data[0].norec_apd,
              });
            } else if (data.deptid == 24) {
              $state.go("RekamMedis.ResumeMedisIGD", {
                noRec: e.data.data[0].norec_apd,
              });
            } else {
              $state.go("RekamMedis.ResumeRJ", {
                noRec: e.data.data[0].norec_apd,
              });
            }
          }
        });
      };
      $scope.GantiKSM = function (data) {
        if (data == undefined) {
          alert("Pilih Satu Data Yang Mau di Ganti Ruangan KSM nya !!!");
          return;
        }
        $scope.item.KsmLama = data.ksm;
        $scope.item.KsmBaru = $scope.listRuanganRIPapj;
        $scope.item.norec_pj = data.norec_pj;
        $scope.PopUpGantiKSM.center().open();
      };
      $scope.SaveGantiKSM = function () {
        if ($scope.item.KsmBaru.id == undefined) {
          alert("Pilih Dulu Ruangan KSM nya !!!");
          return;
        }

        var json = {
          norec_pj: $scope.item.norec_pj,
          KsmBaru: $scope.item.KsmBaru.id,
        };

        medifirstService.post("tatarekening/ganti-ruangan-ksm", json).then(function (e) {
          if (e.data.status === 201) {
            LoadDataKirimPAPJ();
            $scope.PopUpGantiKSM.close();
          }
        });
      };
      $scope.cetakResume = function (x) {
        let norec123 = "";
        if ($scope.item.idDept == 18) {
          loadDiagnosa();
          loadKonsul();
          loadCpptO();
          medifirstService.get("emr/get-norec-resume?noregistrasi=" + $scope.item.noregistrasi).then(function (dat) {
            if (dat.data.length == 0) {
              toastr.error("Resume Medis Tidak Ada !");
              return;
            }
            norec123 = dat.data[0].norec;
            medifirstService.get("emr/get-kepentingan-resume-rj?norec=" + dat.data[0].norec).then(function (dat) {
              debugger;
              let tampung = "";
              let tampung2 = "";
              let tampung3 = "";
              let tampung4 = "";
              let diagnosautama = "Diagnosis Primer / Utama : ";
              let kddiagnosautama = "";
              let diagnosasekunder = "Diagnosis Sekunder : ";
              let kddiagnosasekunder = "";
              let diagnosaawal = "Diagnosis Awal : ";
              let kddiagnosaawal = "";
              let diagnosatindakan = "";
              let kddiagnosatindakan = "";
              let nouruttindakan = 1;
              let nourutsekunder = 1;
              let emr = dat.data;
              let nourut = 1;
              let penunjang = "";
              let obat = "";
              let tampungObat = "";
              let noUrutObat = 1;
              let tindakan = "";
              let tampungTindakan = "";
              let noUrutTindakan = 1;
              let tampungGaNormal = "";
              let penunjanglab = "Laboratorium Klinik : ";
              let tindakanlab = "Laboratorium Klinik : ";
              let penunjangrad = "Radiologi : ";
              let tindakanrad = "Radiologi : ";
              let penunjangpa = "Laboratorium PA : ";
              let tindakanpa = "Laboratorium Patalogi Anatomi : ";
              for (let i = 0; i < emr.length; i++) {
                if (emr[i].jenispenunjang == "LAB") {
                  // debugger
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n";
                  tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n";
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      if (emr[i].detail[j].flaglab == "Y") {
                        tampung4 = emr[i].detail[j].hasilpenunjang;
                        tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / ";
                      }
                    } else {
                      // tampung = ''
                    }
                  }
                  penunjanglab = penunjanglab + tampung2;
                } else if (emr[i].jenispenunjang == "RAD") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanrad = tindakanrad + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("kesan");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("Kesan");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangrad = penunjangrad + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanpa = tindakanpa + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("KESIMPULAN");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("KESIMPULAN");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangpa = penunjangpa + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "OBAT") {
                  tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk + " " + emr[i].frekuensi;
                  obat = obat + tampungObat + "\n";
                  noUrutObat = noUrutObat + 1;
                  tampungObat = "";
                } else {
                  tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk;
                  tindakan = tindakan + tampungTindakan + "\n";
                  noUrutTindakan = noUrutTindakan + 1;
                  tampungTindakan = "";
                }
                if (tampung4 != "") {
                  tampung3 = tampung3 + tampung + tampung2 + "\n";
                  nourut = nourut + 1;
                }
                tampung2 = "";
                tampung = "";
                tampung4 = "";
              }
              // debugger
              tampungdiagnosa9;
              for (let i = 0; i < tampungdiagnosa.length; i++) {
                if (tampungdiagnosa[i].jenisdiagnosa == "Primary / utama") {
                  diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa;
                  kddiagnosautama = tampungdiagnosa[i].kddiagnosa;
                } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                  diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosaawal = tampungdiagnosa[i].kddiagnosa;
                } else {
                  // diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
                  // kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
                  diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa;
                }
                nourutsekunder = nourutsekunder + 1;
              }
              if (tampungdiagnosa9.length == 0) {
                diagnosatindakan = "-";
              }
              for (let i = 0; i < tampungdiagnosa9.length; i++) {
                diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + " - " + tampungdiagnosa9[i].namadiagnosatindakan + "\n";
                kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n";
                nouruttindakan = nouruttindakan + 1;
              }
              if (penunjanglab == "Laboratorium Klinik : ") {
                penunjanglab = "";
              }
              if (penunjangrad == "Radiologi : ") {
                penunjangrad = "";
              }
              if (penunjangpa == "Laboratorium PA : ") {
                penunjangpa = "";
              }
              if (tindakanlab == "Laboratorium Klinik : ") {
                tindakanlab = "";
              }
              if (tindakanrad == "Radiologi : ") {
                tindakanrad = "";
              }
              if (tindakanpa == "Laboratorium Patalogi Anatomi : ") {
                tindakanpa = "";
              }
              if (diagnosautama == "Diagnosis Primer / Utama : ") {
                diagnosautama = "";
              }
              if (diagnosasekunder == "Diagnosis Sekunder : ") {
                diagnosasekunder = "";
              }
              if (diagnosaawal == "Diagnosis Awal : ") {
                diagnosaawal = "";
              }
              let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai=" + $scope.item.idDpjp;
              var data = {
                gambarLogo: "logodokkes.jpg",
                paramKey: [
                  "norec",
                  "tampung",
                  "diagnosautama",
                  "kddiagnosautama",
                  "diagnosasekunder",
                  "kddiagnosasekunder",
                  "diagnosatindakan",
                  "kddiagnosatindakan",
                  "penunjang",
                  "obat",
                  "tindakan",
                  "penunjanglab",
                  "penunjangrad",
                  "penunjangpa",
                  "tindakanlab",
                  "tindakanrad",
                  "tindakanpa",
                  "hasilkonsul",
                  "diagnosaawal",
                  "cpptO",
                  "ttd",
                ],
                paramValue: [
                  norec123,
                  tampung3,
                  diagnosautama,
                  kddiagnosautama,
                  diagnosasekunder,
                  kddiagnosasekunder,
                  diagnosatindakan,
                  kddiagnosatindakan,
                  penunjang,
                  obat,
                  tindakan,
                  penunjanglab,
                  penunjangrad,
                  penunjangpa,
                  tindakanlab,
                  tindakanrad,
                  tindakanpa,
                  hasilKonsultasi,
                  diagnosaawal,
                  cpptO,
                  y,
                ],
                paramType: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
              };
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  //this.response is what you're looking for
                  // handler(this.response);
                  console.log(this.response, typeof this.response);
                  var res = this.response;
                  var file = new Blob([res], { type: "application/pdf" });
                  var url = window.URL.createObjectURL(this.response);
                  var jenis = "resumemedis";
                  getBase64Post(file, jenis);
                  var url = window.URL.createObjectURL(this.response);
                  var pdf = document.getElementById("tempatLaporan");
                  pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                  var win = window.open(url, "_blank");
                  win.focus();
                }
              };
              if (window.location.hostname.indexOf("192.168.1.7") > -1) {
                xhr.open("POST", "http://192.168.1.7:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
                xhr.open("POST", "http://192.168.88.56:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
                xhr.open("POST", "http://10.10.20.167:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
                xhr.open("POST", "http://10.5.1.2:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
                xhr.open("POST", "http://202.51.105.98:8797/generic/report/ResumeMedisRjNew.pdf");
              } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
                xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisRjNew.pdf");
              } else {
                xhr.open("POST", "http://127.0.0.1:8797/generic/report/ResumeMedisRjNew.pdf");
              }
              // set `Content-Type` header
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
              xhr.responseType = "blob";
              // send rquest with JSON payload
              xhr.send(JSON.stringify(data));
            });
          });
        } else if ($scope.item.idDept == 24) {
          loadDiagnosa();
          loadKonsul();
          medifirstService.get("emr/get-norec-resume?noregistrasi=" + $scope.item.noregistrasi).then(function (dat) {
            if (dat.data.length == 0) {
              toastr.error("Resume Medis Tidak Ada !");
              return;
            }
            medifirstService.get("emr/get-kepentingan-resume-rj?norec=" + dat.data[0].norec).then(function (dat) {
              debugger;
              let tampung = "";
              let tampung2 = "";
              let tampung3 = "";
              let tampung4 = "";
              let diagnosautama = "Diagnosis Primer / Utama : ";
              let kddiagnosautama = "";
              let diagnosasekunder = "Diagnosis Sekunder : ";
              let kddiagnosasekunder = "";
              let diagnosaawal = "Diagnosis Awal : ";
              let kddiagnosaawal = "";
              let diagnosatindakan = "";
              let kddiagnosatindakan = "";
              let nouruttindakan = 1;
              let nourutsekunder = 1;
              let emr = dat.data;
              let nourut = 1;
              let penunjang = "";
              let obat = "";
              let tampungObat = "";
              let noUrutObat = 1;
              let tindakan = "";
              let tampungTindakan = "";
              let noUrutTindakan = 1;
              let tampungGaNormal = "";
              let penunjanglab = "Laboratorium Klinik : ";
              let tindakanlab = "Laboratorium Klinik : ";
              let penunjangrad = "Radiologi : ";
              let tindakanrad = "Radiologi : ";
              let penunjangpa = "Laboratorium PA : ";
              let tindakanpa = "Laboratorium Patalogi Anatomi : ";
              for (let i = 0; i < emr.length; i++) {
                if (emr[i].jenispenunjang == "LAB") {
                  // debugger
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n";
                  tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n";
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      if (emr[i].detail[j].flaglab == "Y") {
                        tampung4 = emr[i].detail[j].hasilpenunjang;
                        tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / ";
                      }
                    } else {
                      // tampung = ''
                    }
                  }
                  penunjanglab = penunjanglab + tampung2;
                } else if (emr[i].jenispenunjang == "RAD") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanrad = tindakanrad + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("kesan");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("Kesan");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangrad = penunjangrad + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                  tampung = tampung + nourut + ". " + emr[i].namaproduk + " = ";
                  tindakanpa = tindakanpa + "- " + emr[i].namaproduk;
                  for (let j = 0; j < emr[i].detail.length; j++) {
                    if (emr[i].detail[j].hasilpenunjang != null) {
                      tampung4 = emr[i].detail[j].hasilpenunjang;
                      let kalimat = emr[i].detail[j].hasilpenunjang;
                      let panjang = kalimat.length;
                      let temukan = kalimat.indexOf("KESIMPULAN");
                      if (temukan < 0) {
                        temukan = kalimat.indexOf("KESIMPULAN");
                      }
                      let filter = kalimat.slice(temukan, panjang);
                      filter = filter.replace(/(<([^>]+)>)/gi, " ");
                      tampung2 = filter;
                      penunjangpa = penunjangpa + tampung2;
                      // debugger
                    }
                  }
                } else if (emr[i].jenispenunjang == "OBAT") {
                  tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk;
                  obat = obat + tampungObat + "\n";
                  noUrutObat = noUrutObat + 1;
                  tampungObat = "";
                } else {
                  tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk;
                  tindakan = tindakan + tampungTindakan + "\n";
                  noUrutTindakan = noUrutTindakan + 1;
                  tampungTindakan = "";
                }
                if (tampung4 != "") {
                  tampung3 = tampung3 + tampung + tampung2 + "\n";
                  nourut = nourut + 1;
                }
                tampung2 = "";
                tampung = "";
                tampung4 = "";
              }
              // debugger
              tampungdiagnosa9;
              for (let i = 0; i < tampungdiagnosa.length; i++) {
                if (tampungdiagnosa[i].jenisdiagnosa == "Primary / utama") {
                  diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa;
                  kddiagnosautama = tampungdiagnosa[i].kddiagnosa;
                } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                  diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosaawal = tampungdiagnosa[i].kddiagnosa;
                } else {
                  // diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
                  // kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
                  diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                  kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa;
                }
                nourutsekunder = nourutsekunder + 1;
              }
              if (tampungdiagnosa9.length == 0) {
                diagnosatindakan = "-";
              }
              for (let i = 0; i < tampungdiagnosa9.length; i++) {
                diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + " - " + tampungdiagnosa9[i].namadiagnosatindakan + "\n";
                kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n";
                nouruttindakan = nouruttindakan + 1;
              }
              let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai=" + $scope.item.idDpjp;
              var data = {
                gambarLogo: "logodokkes.jpg",
                paramKey: [
                  "norec",
                  "tampung",
                  "diagnosautama",
                  "kddiagnosautama",
                  "diagnosasekunder",
                  "kddiagnosasekunder",
                  "diagnosatindakan",
                  "kddiagnosatindakan",
                  "penunjang",
                  "obat",
                  "tindakan",
                  "penunjanglab",
                  "penunjangrad",
                  "penunjangpa",
                  "tindakanlab",
                  "tindakanrad",
                  "tindakanpa",
                  "hasilkonsul",
                  "diagnosaawal",
                  "cpptO",
                  "ttd",
                ],
                paramValue: [
                  dat.data[0].norec,
                  tampung3,
                  diagnosautama,
                  kddiagnosautama,
                  diagnosasekunder,
                  kddiagnosasekunder,
                  diagnosatindakan,
                  kddiagnosatindakan,
                  penunjang,
                  obat,
                  tindakan,
                  penunjanglab,
                  penunjangrad,
                  penunjangpa,
                  tindakanlab,
                  tindakanrad,
                  tindakanpa,
                  hasilKonsultasi,
                  diagnosaawal,
                  cpptO,
                  y,
                ],
                paramType: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
              };
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  //this.response is what you're looking for
                  // handler(this.response);
                  console.log(this.response, typeof this.response);
                  var res = this.response;
                  var file = new Blob([res], { type: "application/pdf" });
                  var url = window.URL.createObjectURL(this.response);
                  var jenis = "resumemedis";
                  getBase64Post(file, jenis);
                  var url = window.URL.createObjectURL(this.response);
                  var pdf = document.getElementById("tempatLaporan");
                  pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                  var win = window.open(url, "_blank");
                  win.focus();
                }
              };
              if (window.location.hostname.indexOf("192.168.1.7") > -1) {
                xhr.open("POST", "http://192.168.1.7:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
                xhr.open("POST", "http://192.168.88.56:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
                xhr.open("POST", "http://10.10.20.167:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
                xhr.open("POST", "http://10.5.1.2:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
                xhr.open("POST", "http://202.51.105.98:8797/generic/report/ResumeMedisIGD.pdf");
              } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
                xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisIGD.pdf");
              } else {
                xhr.open("POST", "http://127.0.0.1:8797/generic/report/ResumeMedisIGD.pdf");
              }
              // set `Content-Type` header
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
              xhr.responseType = "blob";
              // send rquest with JSON payload
              xhr.send(JSON.stringify(data));
            });
          });
        } else if ($scope.item.idDept == 16) {
          medifirstService.get("emr/get-resume-medis-inap-noregistrasi/" + $scope.item.noregistrasi).then(function (dat) {
            if (res[0].data.data.length > 0) {
              var result = res[0].data.data;
              $scope.norec = result[0].norec;
              $scope.item.edukasi = result[0].edukasi;
              medifirstService.get("emr/get-penunjang-resume-ranap?noregistrasifk=" + $scope.norec).then(function (dat) {
                medifirstService.get("emr/get-kepentingan-resume-rj?norec=" + $scope.norec).then(function (dat2) {
                  let penunjang2 = dat2.data;
                  let penunjang = dat.data.data;
                  let obat = "";
                  let obatCounter = 0;
                  // let obatqty = '';
                  // let obataturanpakai = '';
                  let labproduk = "";
                  let labpa = "";
                  let radiologiproduk = "";
                  let diagnosisawal = "";
                  let diagnosisprimer = "";
                  let diagnosissekunder = "";
                  let diagnosis = "";
                  let obatpulang = "";
                  let obatpulangcounter = 0;
                  let tindakanmedisicd9 = "";

                  let tampung = "";
                  let tampung2 = "";
                  let tampung3 = "";
                  let tampung4 = "";
                  let tampung5 = "";
                  let tampung6 = "";
                  let tampung7 = "";
                  let nourut = 1;
                  let penunjanglab = "";
                  let tindakanlab = "";
                  let penunjangrad = "";
                  let tindakanrad = "";
                  let penunjangpa = "";
                  let tindakanpa = "";
                  let penunjangall = "";
                  tampungdiagnosa9;
                  for (let k = 0; k < tampungdiagnosa9.length; k++) {
                    tindakanmedisicd9 += tampungdiagnosa9[k].kddiagnosatindakan + " - " + tampungdiagnosa9[k].namadiagnosatindakan + "\n";
                  }

                  for (let i = 0; i < penunjang.length; i++) {
                    if (penunjang[i].jenispenunjang === "OBAT") {
                      obatCounter++;
                      obat += `${obatCounter}. ${penunjang[i].namaproduk}  ${penunjang[i].frekuensi} \n`;
                      // obatqty += penunjang[i].qty + '\n';
                      // obataturanpakai += penunjang[i].frekuensi + '\n';
                    }
                    // else if (penunjang[i].jenispenunjang === 'LAB') {
                    //     labproduk += 'Laboratorium Patalogi Klinik : ' + penunjang[i].namaproduk + '\n';

                    //     if(penunjang[i].flaglab === 'Y') {
                    //         penunjanglab = 'Laboratorium Patologi Klinik : '
                    //         penunjanglab = penunjanglab + penunjang[i].namaproduk + '- Hasil : ' +  penunjang[i].hasilpenunjang + '\n';
                    //     }
                    // }
                    else if (penunjang[i].jenispenunjang === "LABPA") {
                      labpa += "Laboratorium Patalogi Anatomi : " + penunjang[i].namaproduk + "\n";

                      penunjangpa = "Laboratorium Patologi Anatomi : ";

                      if (penunjang[i].hasilpenunjang != null) {
                        penunjangpa = "Laboratorium Patologi Anatomi : ";
                        tampung4 = penunjang[i].hasilpenunjang;
                        let kalimat = penunjang[i].hasilpenunjang;
                        let panjang = kalimat.length;
                        let temukan = kalimat.indexOf("KESIMPULAN");
                        if (temukan < 0) {
                          temukan = kalimat.indexOf("KESIMPULAN");
                        }
                        let filter = kalimat.slice(temukan, panjang);
                        filter = filter.replace(/(<([^>]+)>)/gi, "");
                        filter = filter.replace(/&nbsp;/g, "");
                        tampung2 = filter;
                        penunjangpa = penunjangpa + tampung2;
                      }
                    } else if (penunjang[i].jenispenunjang === "RAD") {
                      radiologiproduk += "Radiologi : " + penunjang[i].namaproduk + "\n";

                      if (penunjang[i].hasilpenunjang != null) {
                        penunjangrad = penunjangrad + "Radiologi : ";
                        tampung4 = penunjang[i].hasilpenunjang;
                        let kalimat = penunjang[i].hasilpenunjang;
                        let panjang = kalimat.length;
                        let temukan = kalimat.indexOf("kesan");
                        if (temukan < 0) {
                          temukan = kalimat.indexOf("Kesan");
                        }
                        if (temukan < 0) {
                          temukan = kalimat.indexOf("KESAN");
                        }
                        if (temukan < 0) {
                          temukan = kalimat.indexOf("Kesimpulan");
                        }
                        if (temukan < 0) {
                          temukan = kalimat.indexOf("kesimpulan");
                        }
                        let filter = kalimat.slice(temukan, panjang);
                        filter = filter.replace(/(<([^>]+)>)/gi, "");
                        filter = filter.replace(/&nbsp;/g, " ");
                        tampung2 = filter;
                        penunjangrad = penunjangrad + penunjang[i].namaproduk + " " + tampung2 + " \n";
                      }
                    } else if (penunjang[i].jenispenunjang === "TINDAKAN ICD 9") {
                      // tindakanmedisicd9 += penunjang[i].namadiagnosa + '\n';
                    } else if (penunjang[i].jenispenunjang === "OBATPULANG") {
                      var num = parseInt(penunjang[i].qty);
                      var roman = {
                        M: 1000,
                        CM: 900,
                        D: 500,
                        CD: 400,
                        C: 100,
                        XC: 90,
                        L: 50,
                        XL: 40,
                        X: 10,
                        IX: 9,
                        V: 5,
                        IV: 4,
                        I: 1,
                      };
                      var str = "";

                      for (var k of Object.keys(roman)) {
                        var q = Math.floor(num / roman[k]);
                        num -= q * roman[k];
                        str += k.repeat(q);
                      }
                      penunjang[i].qty = str;
                      obatpulangcounter++;
                      obatpulang += `${obatpulangcounter}. ${penunjang[i].namaproduk} ${penunjang[i].frekuensi}   (${penunjang[i].qty}) \n`;
                    }
                  }
                  for (let i = 0; i < tampungdiagnosa.length; i++) {
                    if (tampungdiagnosa[i].jenisdiagnosa == "Primary / utama") {
                      diagnosisprimer = diagnosisprimer + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                    } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                      diagnosisawal = diagnosisawal + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                    } else {
                      diagnosissekunder = diagnosissekunder + tampungdiagnosa[i].kddiagnosa + " - " + tampungdiagnosa[i].namadiagnosa + "\n";
                    }
                  }
                  labproduk = labproduk + labpa + radiologiproduk;
                  diagnosis = diagnosisprimer + "\n" + diagnosissekunder + "\n" + diagnosisawal;

                  let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?idPegawai=" + $scope.item.idDpjp + "&pesan=RESUME MEDIS RAWAT INAP" + "&noregistrasi=" + $scope.item.noregistrasi;
                  let z = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pasien?noregistrasi=" + $scope.item.noregistrasi;
                  for (let p = 0; p < penunjang2.length; p++) {
                    if (penunjang2[p].jenispenunjang == "LAB") {
                      //
                      tampung5 = tampung5 + nourut + ". " + penunjang2[p].namaproduk + " = " + "\n";
                      labproduk = labproduk + "Laboratorium Patalogi Klinik : " + penunjang2[p].namaproduk + "\n";
                      for (let j = 0; j < penunjang2[p].detail.length; j++) {
                        if (penunjang2[p].detail[j].hasilpenunjang != null) {
                          if (penunjang2[p].detail[j].flaglab == "Y" || penunjang2[p].detail[j].flaglab == "K") {
                            tampung7 = penunjang2[p].detail[j].hasilpenunjang;
                            tampung6 = tampung6 + penunjang2[p].detail[j].detailpemeriksaan + ":" + penunjang2[p].detail[j].hasilpenunjang + " / ";
                          } else {
                          }
                        } else {
                          // tampung = ''
                        }
                      }
                      // penunjanglab = penunjanglab + tampung6
                      // tampung6 = ''
                    }
                  }
                  penunjanglab = penunjanglab + tampung6;
                  penunjanglab = "Laboratorium Patalogi Klinik : " + penunjanglab;
                  penunjangall = penunjanglab + " \n" + penunjangpa + " \n" + penunjangrad;

                  var data = {
                    gambarLogo: "logodokkes.jpg",
                    paramKey: ["norec_apd", "obat", "labproduk", "radiologiproduk", "diagnosis", "ttd", "z", "obatpulang", "tindakanmedisicd9", "penunjanglab", "penunjangpa", "penunjangrad", "edukasi"],
                    paramValue: [$scope.item.norec_apd, obat, labproduk, radiologiproduk, diagnosis, y, z, obatpulang, tindakanmedisicd9, penunjangall, penunjangpa, penunjangrad, $scope.item.edukasi],
                    paramType: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
                  };
                  var xhr = new XMLHttpRequest();
                  xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                      console.log(this.response, typeof this.response);
                      var res = this.response;
                      var file = new Blob([res], { type: "application/pdf" });
                      var url = window.URL.createObjectURL(this.response);
                      var jenis = "resumemedis";
                      getBase64Post(file, jenis);
                      console.log(this.response, typeof this.response);
                      var url = window.URL.createObjectURL(this.response);
                      var pdf = document.getElementById("tempatLaporan");
                      pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                      // var win = window.open(url, '_blank');
                      // win.focus();
                    }
                  };
                  if (window.location.hostname.indexOf("192.168.1.7") > -1) {
                    xhr.open("POST", "http://192.168.1.7:8797/generic/report/ResumeMedisRanap.pdf");
                  } else if (window.location.hostname.indexOf("192.168.88.56") > -1) {
                    xhr.open("POST", "http://192.168.88.56:8797/generic/report/ResumeMedisRanap.pdf");
                  } else if (window.location.hostname.indexOf("10.10.20.167") > -1) {
                    xhr.open("POST", "http://10.10.20.167:8797/generic/report/ResumeMedisRanap.pdf");
                  } else if (window.location.hostname.indexOf("10.5.1.2") > -1) {
                    xhr.open("POST", "http://10.5.1.2:8797/generic/report/ResumeMedisRanap.pdf");
                  } else if (window.location.hostname.indexOf("202.51.105.98") > -1) {
                    xhr.open("POST", "http://202.51.105.98:8797/generic/report/ResumeMedisRanap.pdf");
                  } else if (window.location.hostname.indexOf("simrs-rspusatpolri.com") > -1) {
                    xhr.open("POST", "http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisRanap.pdf");
                  } else {
                    xhr.open("POST", "http://127.0.0.1:8797/generic/report/ResumeMedisRanap.pdf");
                  }

                  xhr.setRequestHeader("Content-Type", "application/json");
                  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                  xhr.responseType = "blob";
                  // send rquest with JSON payload
                  xhr.send(JSON.stringify(data));
                  $scope.isRouteLoading = false;
                });
              });
            }
          });
        }
      };
      function getBase64Post(file, jenis) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          //    tes.push(reader)
          console.log(reader.result);
          // foto.push({ foto: (reader.result), id: 4 })
          saveFilePapj(reader.result, jenis);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }
      function saveFilePapj(file, jenis) {
        let objSave = {
          jenis: jenis,
          noregistrasi: $scope.item.noregistrasi,
          file: file,
        };
        medifirstService.postNonMessage("registrasi/post-file-papj", objSave).then(function (e) {});
      }

      $scope.listStatusKlaim = [
        { value: "GROUPING", name: "GROUPING" },
        { value: "SEND CLAIM", name: "SEND CLAIM" },
        { value: "EDIT CLAIM", name: "EDIT CLAIM" },
      ];

      function LoadDataSendKlaim() {
        $scope.isRouteLoading = true;

        var tglAwal = moment($scope.item.periodeAwal).format("YYYY-MM-DD");
        var tglAkhir = moment($scope.item.periodeAkhir).format("YYYY-MM-DD");

        var nosep = "";
        if ($scope.item.noSepCari != undefined && $scope.item.noSepCari != "" && $scope.item.noSepCari != null) {
          nosep = "&nosep=" + $scope.item.noSepCari;
        }
        var nocm = "";
        if ($scope.item.noRmClaim != undefined && $scope.item.noRmClaim != "" && $scope.item.noRmClaim != null) {
          nocm = "&nocm=" + $scope.item.noRmClaim;
        }
        var noreg = "";
        if ($scope.item.noRegClaim != undefined && $scope.item.noRegClaim != "" && $scope.item.noRegClaim != null) {
          noreg = "&noreg=" + $scope.item.noRegClaim;
        }

        var statusClaim = "";
        if ($scope.item.statusClaim != undefined && $scope.item.statusClaim != "" && $scope.item.statusClaim != null) {
          statusClaim = "&status=" + $scope.item.statusClaim.value;
        }

        var insta = "";
        if ($scope.item.instalasi2 != undefined && $scope.item.instalasi2 != "" && $scope.item.instalasi2 != null) {
          insta = "&departemenid=" + $scope.item.instalasi2.id;
        }

        var ruangan = "";
        if ($scope.item.ruangan2 != undefined && $scope.item.ruangan2 != "" && $scope.item.ruangan2 != null) {
          ruangan = "&ruanganid=" + $scope.item.ruangan2.id;
        }

        var ksm = "";
        if ($scope.item.ksm2 != undefined && $scope.item.ksm2 != "" && $scope.item.ksm2 != null) {
          ksm = "&ksmid=" + $scope.item.ksm2.id;
        }

        medifirstService.get("bridging/inacbg/get-cari-daftar-pasien-sendClaim?" + "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + nosep + nocm + noreg + statusClaim + insta + ruangan + ksm).then(function (e) {
          $scope.isRouteLoading = false;
          var data2 = e.data;
          // function cleanNama(nama) {
          //     return nama.replace(/\f/g, ''); // Menghapus semua karakter \f dari string nama
          // }
          // var data2 = e.data.map(function(item) {
          //     return {
          //         ...item,
          //         namaPasien: cleanNama(item.namaPasien)
          //     };
          // });
          $scope.dataDaftarSendKlaim = new kendo.data.DataSource({
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
      }

      $scope.tabsendklaim = function () {
        // $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        // $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
        LoadDataSendKlaim();
      };

      $scope.searchDataDendKlaim = function () {
        if ($scope.item.instalasi2 == undefined) {
          alert("Silahkan Masukkan Instalasi.");
          return;
        }
        LoadDataSendKlaim();
      };

      var onDataBound2 = function (e) {
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

      $scope.columnDaftarSendKlaim = {
        toolbar: ["excel"],
        excel: {
          fileName: "DaftarRegistrasiPasien.xlsx",
          allPages: true,
        },
        excelExport: function (e) {
          var sheet = e.workbook.sheets[0];
          sheet.frozenRows = 2;
          sheet.mergedCells = ["A1:K1"];
          sheet.name = "Orders";

          var myHeaders = [
            {
              value: "Daftar Registrasi Pasien",
              fontSize: 20,
              textAlign: "center",
              background: "#ffffff",
              // color:"#ffffff"
            },
          ];

          sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
        },
        selectable: "row",
        dataBound: onDataBound2,
        pageable: true,
        // sortable: true,
        // resizable: true,
        columns: [
          {
            field: "no",
            title: "No",
            width: "30px",
          },
          {
            field: "tglmasuk",
            title: "Tgl Registrasi",
            width: "80px",
            // "template": "<span class='style-center'>#: tglregistrasi #</span>"
            // "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
          },
          {
            field: "noRegistrasi",
            title: "NoReg",
            width: "90px",
          },
          {
            field: "noCm",
            title: "NoRM",
            width: "70px",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama Pasien",
            width: "150px",
            template: "<span class='style-left'>#: namaPasien #</span>",
          },
          {
            field: "nokepesertaan",
            title: "No BPJS",
            width: "100px",
            template: "<span class='style-left'>#: nokepesertaan #</span>",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "150px",
            template: "<span class='style-left'>#: namaruangan #</span>",
          },
          {
            field: "namakamar",
            title: "Kamar",
            width: "100px",
            template: "<span class='style-left'>#: namakamar #</span>",
          },
          {
            field: "bed",
            title: "Bed",
            width: "70px",
            template: "<span class='style-left'>#: bed #</span>",
          },
          {
            field: "namakelas",
            title: "Kelas Ditanggung",
            width: "70px",
            template: "<span class='style-left'>#: namakelas #</span>",
          },
          {
            field: "ksm",
            title: "KSM",
            width: "100px",
            template: "<span class='style-left'>#: ksm #</span>",
          },
          {
            field: "namadpjp",
            title: "Nama DPJP",
            width: "70px",
            template: "<span class='style-center'>#: namadpjp #</span>",
          },
          {
            field: "tglpulang",
            title: "Tgl Pulang",
            width: "80px",
            // "template": "<span class='style-center'>#: tglpulang #</span>"
            // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
          },

          {
            field: "nosep",
            title: "No SEP",
            width: "150px",
            template: '<button class="k-button" ng-click="KlaimclickCard(dataItem)" style="margin:0 0 5px">#: nosep #</button>',
          },
          // {
          //     "field": "nosep",
          //     "title": "No SEP",
          //     "width": "150px",
          //     "template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #',
          // },
          {
            field: "statusclosing",
            title: "Status Faktur",
            width: "150px",
          },
          {
            field: "statusgrouping",
            title: "Status Grouping",
            width: "150px",
            template: '# if( statusgrouping==null || statusgrouping=="") {# - # } else {# #= statusgrouping # #} #',
          },
          {
            field: "totalbiayars",
            title: "Biaya RS",
            width: "150px",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalbiayars #', 'Rp. ')}}</span>",
          },
          {
            field: "totalpiutangpenjamin",
            title: "Klaim Inacbg",
            width: "150px",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalpiutangpenjamin #', 'Rp. ')}}</span>",
          },
          {
            field: "biayanaikkelas",
            title: "Biaya Naik Kelas",
            width: "150px",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: biayanaikkelas #', 'Rp. ')}}</span>",
          },
          {
            field: "cbgcode",
            title: "Kode CBG",
            width: "70px",
            template: "<span class='style-center'>#: cbgcode #</span>",
          },
          {
            field: "cbgdescription",
            title: "Description",
            width: "150px",
          },
          // {
          //   field: "kddiagnosa",
          //   title: "Kode Diagnosa",
          //   width: "70px",
          //   template: "<span class='style-center'>#: kddiagnosa #</span>",
          // },
          {
            field: "isdiagnosis",
            title: "ICD 10",
            width: "150px",
          },
          {
            field: "diagnosa9",
            title: "ICD 9",
            width: "150px"
          },
          {
            field: "statuspapj",
            title: "Klaim Dirajalkan",
            width: "100px",
            template: '<button class="k-button white1" ng-click="KlaimDirajalkan(dataItem)" style="margin:0 0 5px">KLAIM DIRAJALKAN</button>',
          },
          {
            field: "statuspapj",
            title: "Pending",
            width: "100px",
            template: '<button class="k-button white1" ng-click="KlaimPending(dataItem)" style="margin:0 0 5px">PENDING</button>',
          },
        ],
      };

      $scope.isRawatInap2 = false;
      $scope.listRuanganz = [];

      $scope.$watch("item.instalasi2", function (e) {
        if (e && e.nama == "Rawat Inap") {
          $scope.isRawatInap2 = true;
          $scope.item.ruangan2 = undefined;
          $scope.item.ksm2 = undefined;
          $scope.listRuanganz = $scope.listRuanganRIPapj;
        } else if (e && e.nama == "Rawat Jalan") {
          $scope.isRawatInap2 = false;
          $scope.item.ksm2 = undefined;
          $scope.item.ruangan2 = undefined;
          $scope.listRuanganz = $scope.listRuanganRJPapj;
        } else if (e && e.nama == "IGD") {
          $scope.isRawatInap2 = false;
          $scope.item.ksm2 = undefined;
          $scope.item.ruangan2 = undefined;
          $scope.listRuanganz = $scope.listRuanganIgd;
        } else if (e && e.nama == "Rehabilitasi Medik") {
          $scope.isRawatInap2 = false;
          $scope.item.ksm2 = undefined;
          $scope.item.ruangan2 = undefined;
          $scope.listRuanganz = $scope.listRuanganRm;
        } else {
          $scope.isRawatInap2 = false;
          $scope.item.ksm2 = undefined;
          $scope.item.ruangan2 = undefined;
          $scope.listRuanganz = undefined;
        }
      });

      $scope.detailTagihan = function (data) {
        if (data == undefined) {
          messageContainer.error("Pilih data dulu");
          return;
        }
        let user = medifirstService.getPegawai();
        if (data.noRegistrasi != undefined) {
          if (data.tglpulang == null) {
            if (user.id != 320263) {
              if (
                data.objectruanganlastfk == 720 ||
                data.objectruanganlastfk == 777 ||
                data.objectruanganlastfk == 778 ||
                data.objectruanganlastfk == 779 ||
                data.objectruanganlastfk == 753 ||
                data.objectruanganlastfk == 754 ||
                data.objectruanganlastfk == 755 ||
                data.objectruanganlastfk == 747 ||
                data.objectruanganlastfk == 748 ||
                data.objectruanganlastfk == 769 ||
                data.objectruanganlastfk == 770 ||
                data.objectruanganlastfk == 731
              ) {
                medifirstService.get("emr/get-emr-transaksi?nocm=" + data.nocm + "&jenisEmr=askepnew&noregistrasi=" + data.noRegistrasi, true).then(function (dat) {
                  debugger;
                  if (dat.data.data.length == 0) {
                    toastr.error("Harus Mengisi SIDOPAK Terlebih Dahulu", "Info");
                  } else {
                    medifirstService.get("emr/get-combolistaskep?noregistrasi=" + data.noRegistrasi).then(function (dat) {
                      if (dat.data.askep.length == 0) {
                        toastr.error("Harus Mengisi SIDOPAK Terlebih Dahulu", "Info");
                      } else {
                        RincianTagihan();
                      }
                    });
                  }
                });
              } else {
                RincianTagihan();
              }
            } else {
              RincianTagihan();
            }
          } else {
            RincianTagihan();
          }
          function RincianTagihan() {
            var obj = {
              noRegistrasi: data.noRegistrasi,
            };
            var statusOtomatis = "YA";
            cacheHelper.set("statusOtomatis", statusOtomatis);
            $state.go("RincianTagihan", {
              dataPasien: JSON.stringify(obj),
            });
          }
        }
      };

      $scope.editRegistrasi = function (data) {
        if (data == undefined) {
          messageContainer.error("Pilih data dulu");
          return;
        } else {
          var ruangan = "";
          medifirstService.get("registrasi/get-apd?noregistrasi=" + data.noRegistrasi + "&objectruanganlastfk=" + data.objectruanganlastfk).then(function (dataa) {
            var dataAntrian = dataa.data.data[0];

            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
              noCm: data.noCm,
            });
            var cacheSet = data.norec + "~" + data.noRegistrasi + "~" + dataAntrian.norec_apd;
            cacheHelper.set("CacheRegistrasiPasien", cacheSet);
          });
        }
      };

      $scope.ubahDokter = function (data) {
        if (data == undefined) {
          messageContainer.error("Pilih data dulu");
          return;
        }
        $scope.popupDokterTab.center().open();
      };
      $scope.simpanDokter = function () {
        var objSave = {
          norec: $scope.dataPasienKirimPapjSelected.norec,
          objectpegawaifk: $scope.item.namaDokter.id,
          objectruanganlastfk: $scope.dataPasienKirimPapjSelected.objectruanganlastfk,
        };
        medifirstService.post("registrasi/daftar-registrasi/update-dokter", objSave).then(function (e) {
          $scope.popupDokterTab.close();
          LoadDataKirimPAPJ();

          $scope.cboDokter = false;
          $scope.cboSep = false;
          $scope.cboUbahDokter = true;
          $scope.cboUbahSEP = true;
        });
      };

      $scope.editSEP = function (data, flag) {
        $scope.item.noPeserta = "";
        $scope.item.noSep = "";

        if (data.norec == null) {
          messageContainer.error("Pasien Belum Dipilih!!");
          return;
        }
        if (data.jenisAsuransi == "Umum/Pribadi") {
          messageContainer.error("Tipe Pasien Umum!!");
          return;
        }
        if (data.norec_pa == null) {
          messageContainer.error("Pemakaian Asuransi tidak ada");
          return;
        }

        if (data.nokepesertaan != undefined) {
          $scope.item.noPeserta = data.nokepesertaan;
        }

        if (data.nokepesertaan != undefined) {
          $scope.item.noSep = data.nosep;
        }

        $scope.item.tampungUbahSEP = data
        $scope.item.tampungUbahSEP.flag = flag

        $scope.cboSep = true;
        $scope.cboUbahSEP = false;
        $scope.cboDokter = false;
        $scope.cboUbahDokter = false;
      };
      $scope.simpanSep = function () {
        let data = $scope.item.tampungUbahSEP
        if (data.jenisAsuransi == "BPJS") {
          var updateSep = {
            norec: data.norec,
            nokepesertaan: $scope.item.noPeserta,
            nosep: $scope.item.noSep,
          };
        } else {
          var updateSep = {
            norec: data.norec,
            nokepesertaan: $scope.item.noPeserta,
            nosep: null,
          };
        }

        medifirstService.post("registrasi/daftar-registrasi/update-nosep", updateSep).then(function (e) {
          if (data.flag == 'BKDR') {
            LoadDataKirimPAPJ();
          } else if (data.flag == 'BSVC') {
            LoadDataVerifPAPJ()
          } else if (data.flag == 'BSK') {
            LoadDataKlaimPAPJ()
          } else {
            LoadDataSendKlaim()
          }
          $scope.saveLogInputSep();
        });

        $scope.cboSep = false;
        $scope.cboUbahSEP = true;
        $scope.cboDokter = false;
        $scope.cboUbahDokter = true;
      };
      $scope.batalSep = function () {
        $scope.item.noPeserta = "";
        $scope.item.noSep = "";
        $scope.cboSep = false;
        $scope.cboUbahSEP = true;
        $scope.cboDokter = false;
        $scope.cboUbahDokter = true;
        $scope.item.tampungUbahSEP = {}
      };
      $scope.saveLogInputSep = function () {
        var jenisLog = "Input SEP";
        var referensi = "Norec Pemakaian Asuransi";
        var keterangan = "Input Sep - " + $scope.item.noSep + " No Registrasi " + $scope.item.tampungUbahSEP.noRegistrasi;
        medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenisLog + "&referensi=" + referensi + "&noreff=" + $scope.item.tampungUbahSEP.norec_pa + "&keterangan=" + keterangan).then(function (data) {
          $scope.item.noPeserta = "";
          $scope.item.noSep = "";
          $scope.item.tampungUbahSEP = {}
        });
      };

      $scope.detailRegistrasi = function (data) {
        if (data.noRegistrasi != undefined) {
          var obj = {
            noRegistrasi: data.noRegistrasi,
          };
          cacheHelper.set("AntrianPasienDiperiksaNOREG", data.noRegistrasi);
          // cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
          $state.go("DetailRegistrasi", {
            dataPasien: JSON.stringify(obj),
          });
        }
      };

      // Riwayat Registrasi --------------------------------------------------
      $scope.formatTanggaljam = function (tanggal) {
          return moment(tanggal).format('DD-MMM-YYYY hh:mm:ss');
      }

      $scope.formatTanggal = function (tanggal) {
          return moment(tanggal).format('DD-MMM-YYYY');
      }
     $scope.formatTanggalClaim = function (tanggal) {
          return moment(tanggal).format('YYYY-MM-DD');
      }


      $scope.columnRiwayatRegistrasi = {
          toolbar: [
              "excel",

          ],
          excel: {
              fileName: "DaftarRiwayatRegistrasi.xlsx",
              allPages: true,
          },
          excelExport: function (e) {
              var sheet = e.workbook.sheets[0];
              sheet.frozenRows = 2;
              sheet.mergedCells = ["A1:K1"];
              sheet.name = "Orders";

              var myHeaders = [{
                  value: "Daftar Registrasi Pasien",
                  fontSize: 20,
                  textAlign: "center",
                  background: "#ffffff",
                  // color:"#ffffff"
              }];

              sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
          },
          selectable: 'row',
          pageable: true,
          columns: [
              {
                  "field": "newno",
                  "title": "No",
                  "width": "30px",
              },
              {
                  "field": "tglregistrasi",
                  "title": "Tgl Registrasi",
                  "width": "80px",
                  "template": "<span class='style-left'>{{formatTanggaljam('#: tglregistrasi #')}}</span>"
              },
              {
                  "field": "noregistrasi",
                  "title": "No Registrasi",
                  "width": "90px"
              },
              {
                  "field": "namaruanganasal",
                  "title": "Ruanganan Layanan Asal",
                  "width": "150px",
                  "template": "<span class='style-left'>#: namaruanganasal #</span>"
              },
              {
                  "field": "namaruangan",
                  "title": "Ruanganan Layanan",
                  "width": "150px",
                  "template": "<span class='style-left'>#: namaruangan #</span>"
              },
              {
                  "field": "namarekanan",
                  "title": "Kelompok Pasien",
                  "width": "150px",
                  "template": "<span class='style-left'>#: namarekanan #</span>"
              },
              {
                  "field": "namadokter",
                  "title": "Nama Dokter",
                  "width": "150px",
                  "template": "<span class='style-left'>#: namadokter #</span>"
              },
              {
                  "field": "norujukan",
                  "title": "No Rujukan",
                  "width": "150px",
                  "template": "<span class='style-left'>#: norujukan #</span>"
              },
              {
                  "field": "nosuratskdp",
                  "title": "No Surkon",
                  "width": "150px",
                  "template": "<span class='style-left'>#: nosuratskdp #</span>"
              },
              {
                  "field": "tglpulang",
                  "title": "Tgl Pulang",
                  "width": "80px",
                  "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
              },
              {
                  "field": "lamarawat",
                  "title": "Lama Dirawat",
                  "width": "80px"
                  // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
              },
              {
                  "field": "statuspulang",
                  "title": "Status Pulang",
                  "width": "100px"
                  // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
              },
              {
                  "field": "isdiagnosis",
                  "title": "Diagnosis",
                  "width": "300px",
                  // "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
              },
              {
                  "field": "kodeDiagnosa",
                  "title": "Coding ICD-10",
                  "width": "300px",
                  // "template": '# if( kodeDiagnosa==false) {# - # } else {# #= kodeDiagnosa # #} #'
              },
              {
                  "field": "kodeicd9",
                  "title": "Coding ICD-9",
                  "width": "300px",
                  // "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
              },
              {
                field: "biayars",
                title: "Tarif RS",
                width: "250px",
                template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: biayars #', 'Rp. ')}}</span>",
              },
              {
                  "field": "kesatuanpasien",
                  "title": "Kesatuan Pasien",
                  "width": "100px",
                  "template": '# if( kesatuanpasien==false) {# - # } else {# #= kesatuanpasien # #} #'
              },
          ]
      };

      $scope.RiwayatRegistrasi = function (data) {
          debugger;
          if (data == undefined) {
              messageContainer.error("Pilih data dulu!")
          }
          
          $scope.itemD.noRM = data.noCm;
          $scope.itemD.namaPasien = data.namaPasien;
          $scope.itemD.tglLahir = moment(data.tgllahir).format('DD-MM-YYYY');
          loadDataRiwayat();
          $scope.popUpRiwayatRegistrasi.center().open();
          var actions = $scope.popUpRiwayatRegistrasi.options.actions;
          actions.splice(actions.indexOf("Close"), 1);
          $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
      }

      $scope.TutupPopUp = function () {
          $scope.itemD.noRM = undefined;
          $scope.itemD.namaPasien = undefined;
          $scope.itemD.tglLahir = undefined;
          $scope.itemD.noRegistrasi = undefined;
          $scope.itemD.JumlahRawat = undefined;
          $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
              data: []
          });
          $scope.popUpRiwayatRegistrasi.close();
      }

      function loadDataRiwayat() {
          $scope.isRouteLoading = true;
          var rm = ""
          if ($scope.itemD.noRM != undefined) {
              rm = "&norm=" + $scope.itemD.noRM
          }

          var pasien = ""
          if ($scope.itemD.namaPasien != undefined) {
              pasien = "&namaPasien=" + $scope.itemD.namaPasien
          }

          var tglLahirs = ""
          if ($scope.itemD.tglLahir != undefined) {
              tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
          }

          var noReg = ""
          if ($scope.itemD.noRegistrasi != undefined) {
              noReg = "&noReg=" + $scope.itemD.noRegistrasi;
          }

          medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
              tglLahirs + rm + noReg + pasien)
              .then(function (data) {
                  debugger;
                  $scope.isRouteLoading = false;
                  var jumlahRawat = 0;
                  var dRiwayatReg = data.data.daftar;
                  for (var i = 0; i < dRiwayatReg.length; i++) {
                      dRiwayatReg[i].no = i + 1
                      if (dRiwayatReg[i].statusinap == 1) {
                          jumlahRawat = jumlahRawat + 1;
                          if (dRiwayatReg[i].tglpulang != undefined) {
                              var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                              var bln = umur.month,
                                  thn = umur.year,
                                  day = umur.day
                              dRiwayatReg[i].lamarawat = day + " Hari";
                          } else {
                              var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                              var bln = umur.month,
                                  thn = umur.year,
                                  day = umur.day
                              dRiwayatReg[i].lamarawat = day + " Hari";
                          }
                      }
                  }
                  dRiwayatReg.sort((d1, d2) => new Date(d2.tglregistrasi).getTime() - new Date(d1.tglregistrasi).getTime());
                  for (var x = 0; x < dRiwayatReg.length; x++) {
                      dRiwayatReg[x].newno = x + 1
                  }

                  $scope.itemD.JumlahRawat = jumlahRawat;
                  $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                      data: dRiwayatReg,
                      pageSize: 10,
                      total: dRiwayatReg.length,
                      serverPaging: false,
                      schema: {
                          model: {
                              fields: {
                              }
                          }
                      }
                  });
              });
      }

      $scope.SearchEnterDetail = function () {
          loadDataRiwayat();
      }
      // END Riwayat Registrasi --------------------------------------------------

      //START KLAIM DIRAJALKAN

       function LoadDataDirajalkan() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format("YYYY-MM-DD HH:mm");
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format("YYYY-MM-DD HH:mm");
        //debugger;

        var tempNosep = "";
        if ($scope.item.noseppapj != undefined) {
          tempNosep = $scope.item.noseppapj;
        }

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noRegDirajalkan != undefined) {
          tempNoReg = $scope.item.noRegDirajalkan;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan };
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal };
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasiklaim != undefined) {
          tempInstalasiId = $scope.item.instalasiklaim.id;
          tempInstalasiIdArr = { id: $scope.item.instalasiklaim.id, nama: $scope.item.instalasiklaim.nama };
        }
        //debugger
        var tempKelompokPasienId = "";
        var tempKelompokPasienIdArr = {};
        if ($scope.item.kelompokpasien != undefined) {
          tempKelompokPasienId = $scope.item.kelompokpasien.id;
          tempKelompokPasienIdArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompok };
        }
        var tempRekananId = "";
        var tempRekananIdArr = {};
        if ($scope.item.rekanan != undefined) {
          tempRekananId = $scope.item.rekanan.id;
          tempRekananIdArr = { id: $scope.item.rekanan.id, rekanan: $scope.item.rekanan.rekanan };
        }
        var tempNoRm = "";
        if ($scope.item.noRmDirajalkan != undefined) {
          tempNoRm = $scope.item.noRmDirajalkan;
        }
        var jmlRow = "";
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows;
        }

        var instalasiId = "";
        if ($scope.item.instalasiklaim != undefined) {
          var instalasiId = "&instalasiId=" + $scope.item.instalasiklaim.id;
        }

        var ruanganId = "";
        if ($scope.item.ruanganrjpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrjpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganigdpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganigdpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganrmpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrmpapj.id;
          instalasiId = "";
        }

        $scope.$watch("item.instalasiklaim", function (e) {
          if (e.nama == "Rawat Inap") {
            $scope.isRawatInap = true;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rawat Jalan") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = true;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "IGD") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = true;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rehabilitasi Medik") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = true;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          }
        });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempStatusArr,
          3: tempNamaOrReg,
          4: tempNoReg,
          5: tempRuanganIdArr,
          6: tempInstalasiIdArr,
          7: tempNoRm,
          8: jmlRow,
          9: tempKelompokPasienIdArr,
          10: tempRekananIdArr,
        };
        cacheHelper.set("aDaftarPasienPulangCtrl", chacePeriode);

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-dirajalkan?" +
              "namaPasien=" +
              tempNamaOrReg +
              "&tglAwal=" +
              tglAwal +
              "&tglAkhir=" +
              tglAkhir +
              "&noSep=" +
              tempNosep +
              "&noReg=" +
              tempNoReg +
              "&noRm=" +
              tempNoRm +
              instalasiId +
              ruanganId
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            ruanganId = "";
            $scope.isRouteLoading = false;
            var data = data.data;

            var tempdata = "";
            var datax = [];
            // debugger;
            for (let i = 0; i < data.length; i++) {
              if (data[i].noRegistrasi != tempdata) {
                // const element = data[i];
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
                if (data[i].tglclosing == null) {
                  data[i].status2 = "CLOSING";
                } else {
                  data[i].status2 = "BATAL";
                }

                tempdata = data[i].noRegistrasi;
                datax.push(data[i]);
              }
            }

            $scope.dataPasienKlaimdirajalkan = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {},
                },
              },
            });
          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempInstalasiIdArr,
        };
        cacheHelper.set("KlaimDirajalkan", chacePeriode);
      }

      $scope.columnPasienKlaimPapjKlaimDirajalkan = {
        selectable: "row",
        pageable: true,
        dataSource: $scope.dataPasienKlaimdirajalkan,
        pageable: true,
        toolbar: ["excel"],
        excel: {
          fileName: "DataPasienKlaimPapjKlaimDirajalkan.xlsx",
          allPages: true,
        },
        columns: [
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "5.5%",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "5.5%",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "5.5%",
          },
          {
            field: "nokepesertaan",
            title: "No BPJS",
            width: "5.5%",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "5.5%",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "5.5%",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "5.5%",
          },
          {
            field: "kamar",
            title: "Kamar",
            width: "5.5%",
          },
          {
            field: "bed",
            title: "Bed",
            width: "5.5%",
          },
          {
            field: "dpjp",
            title: "Dokter DPJP",
            width: "5.5%",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "9%",
          },
          {
            field: "status",
            title: "Status Grouping",
            width: "5%",
          },
          {
            field: "pegawaikirim",
            title: "Pegawai Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tglkirim",
            title: "Tanggal Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "totalbiayars",
            title: "Biaya RS",
            width: "5.5%",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalbiayars #', 'Rp. ')}}</span>",
          },
          {
            field: "totalpiutangpenjamin",
            title: "Klaim INACBG",
            width: "5.5%",
            template: "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalpiutangpenjamin #', 'Rp. ')}}</span>",
          },
          {
            field: "biayanaikkelas",
            title: "Biaya Naik Kelas",
            width: "5.5%",
          },
          {
            field: "cbgcode",
            title: "Kode CBG",
            width: "5.5%",
          },
          {
            field: "cbgdescription",
            title: "Deskripsi",
            width: "5.5%",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },
          {
            field: "alasan",
            title: "Alasan Tidak Layak",
            width: "160px",
            template: '<button class="k-button white1" ng-click="viewAlasan(dataItem)" style="margin:0 0 5px">Alasan</button>',
          },
          {
            field: "statuspapj",
            title: "Status Verif",
            width: "90px",
            template: '<button class="k-button white1" ng-click="VerifPapj(dataItem)" style="margin:0 0 5px">LAYAK</button>',
          },
          {
            field: "statuspapj",
            title: "Batal Klaim Dirajalkan",
            width: "90px",
            template: '<button class="k-button white1" ng-click="BatalKlaimDirajalkan(dataItem)" style="margin:0 0 5px">BATAL DIRAJALKAN</button>',
          },
        ],
      };

       $scope.SaveAlasanKlaimDirajalkan = function (dataItem) {
        if ($scope.item.alasan == undefined || $scope.item.alasan == null || $scope.item.alasan == "") {
          alert("Alasan Klaim Dirajalkan tidak boleh kosong!");
          return;
        }

        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          alasan: $scope.item.alasan,
          status: "4",
        };
        medifirstService.post("tatarekening/save-papj-dirajalkan", json).then(function (e) {
          $scope.popUpAlasanKlaimDirajalkan.close();
          LoadDataSendKlaim();
          LoadDataKlaimPAPJ();
          LoadDataDirajalkan();
        });
      };

      $scope.BatalDirajalkan = function (dataItem) {
        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          alasan: $scope.item.alasan,
          status: "4",
        };
        medifirstService.post("tatarekening/save-papj-batal-dirajalkan", json).then(function (e) {
          $scope.popUpBatalKlaimDirajalkan.close();
          LoadDataKlaimPAPJ();
          LoadDataSendKlaim();
          LoadDataDirajalkan();
        });
      };

      $scope.CloseAlasan = function (dataItem) {
        $scope.popUpAlasanKlaimDirajalkan.close();
      };
      $scope.CloseBatal = function (dataItem) {
        $scope.popUpBatalKlaimDirajalkan.close();
      };

      $scope.KlaimDirajalkan = function (dataItem) {
        datapapj = dataItem;
        $scope.item.alasan = datapapj.alasan;
        $scope.popUpAlasanKlaimDirajalkan.center().open();
      };

      $scope.BatalKlaimDirajalkan = function (dataItem) {
        datapapj = dataItem;
        $scope.popUpBatalKlaimDirajalkan.center().open();
      };
      //END KLAIM DIRAJALKAN


      //START Pending
       function LoadDataPending() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format("YYYY-MM-DD HH:mm");
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format("YYYY-MM-DD HH:mm");
        //debugger;

        var tempNosep = "";
        if ($scope.item.noseppapj != undefined) {
          tempNosep = $scope.item.noseppapj;
        }

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noRegPending != undefined) {
          tempNoReg = $scope.item.noRegPending;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan };
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal };
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasiklaim != undefined) {
          tempInstalasiId = $scope.item.instalasiklaim.id;
          tempInstalasiIdArr = { id: $scope.item.instalasiklaim.id, nama: $scope.item.instalasiklaim.nama };
        }
        //debugger
        var tempKelompokPasienId = "";
        var tempKelompokPasienIdArr = {};
        if ($scope.item.kelompokpasien != undefined) {
          tempKelompokPasienId = $scope.item.kelompokpasien.id;
          tempKelompokPasienIdArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompok };
        }
        var tempRekananId = "";
        var tempRekananIdArr = {};
        if ($scope.item.rekanan != undefined) {
          tempRekananId = $scope.item.rekanan.id;
          tempRekananIdArr = { id: $scope.item.rekanan.id, rekanan: $scope.item.rekanan.rekanan };
        }
        var tempNoRm = "";
        if ($scope.item.noRmPending != undefined) {
          tempNoRm = $scope.item.noRmPending;
        }
        var jmlRow = "";
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows;
        }

        var instalasiId = "";
        if ($scope.item.instalasiklaim != undefined) {
          var instalasiId = "&instalasiId=" + $scope.item.instalasiklaim.id;
        }

        var ruanganId = "";
        if ($scope.item.ruanganrjpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrjpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganigdpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganigdpapj.id;
          instalasiId = "";
        } else if ($scope.item.ruanganrmpapj != undefined) {
          var ruanganId = "&ruanganId=" + $scope.item.ruanganrmpapj.id;
          instalasiId = "";
        }

        $scope.$watch("item.instalasiklaim", function (e) {
          if (e.nama == "Rawat Inap") {
            $scope.isRawatInap = true;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rawat Jalan") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = true;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "IGD") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = true;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else if (e.nama == "Rehabilitasi Medik") {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = true;
            $scope.isIgd = false;
            $scope.item.ruanganrjpapj = undefined;
            $scope.item.ruanganigdpapj = undefined;
            $scope.item.ruanganrmpapj = undefined;
          } else {
            $scope.isRawatInap = false;
            $scope.isRawatJalan = false;
            $scope.isRehabilitasiMedik = false;
            $scope.isIgd = false;
          }
        });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempStatusArr,
          3: tempNamaOrReg,
          4: tempNoReg,
          5: tempRuanganIdArr,
          6: tempInstalasiIdArr,
          7: tempNoRm,
          8: jmlRow,
          9: tempKelompokPasienIdArr,
          10: tempRekananIdArr,
        };
        cacheHelper.set("aDaftarPasienPulangCtrl", chacePeriode);

        medifirstService
          .get(
            "tatarekening/daftar-pasien-pulang-papj-pending?" +
              "namaPasien=" +
              tempNamaOrReg +
              "&tglAwal=" +
              tglAwal +
              "&tglAkhir=" +
              tglAkhir +
              "&noSep=" +
              tempNosep +
              "&noReg=" +
              tempNoReg +
              "&noRm=" +
              tempNoRm +
              instalasiId +
              ruanganId
          )
          .then(function (data) {
            $scope.showBtnBayar = false;
            ruanganId = "";
            $scope.isRouteLoading = false;
            var data = data.data;

            var tempdata = "";
            var datax = [];
            // debugger;
            for (let i = 0; i < data.length; i++) {
              if (data[i].noRegistrasi != tempdata) {
                // const element = data[i];
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + " thn " + umur.month + " bln " + umur.day + " hari";
                if (data[i].tglclosing == null) {
                  data[i].status2 = "CLOSING";
                } else {
                  data[i].status2 = "BATAL";
                }

                tempdata = data[i].noRegistrasi;
                datax.push(data[i]);
              }
            }

            $scope.dataPasienPending = new kendo.data.DataSource({
              data: datax,
              pageSize: 200,
              total: datax.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {},
                },
              },
            });
          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempInstalasiIdArr,
        };
        cacheHelper.set("Pending", chacePeriode);
      }

       $scope.columnPasienKlaimPapjPending = {
        selectable: "row",
        pageable: true,
        dataSource: $scope.dataPasienPending,
        pageable: true,
        toolbar: ["excel"],
        excel: {
          fileName: "DataPasienKlaimPapjPending.xlsx",
          allPages: true,
        },
        columns: [
          {
            field: "tanggalMasuk",
            title: "Tanggal Registrasi",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalMasuk #</span>",
          },
          {
            field: "noCm",
            title: "No.RM",
            width: "5.5%",
            template: "<span class='style-center'>#: noCm #</span>",
          },
          {
            field: "noRegistrasi",
            title: "No. Registrasi",
            width: "5.5%",
            template: "<span class='style-center'>#: noRegistrasi #</span>",
          },
          {
            field: "namaPasien",
            title: "Nama",
            width: "5.5%",
          },
          {
            field: "jenisAsuransi",
            title: "Tipe Pembayaran",
            width: "5.5%",
            template: "<span class='style-center'>#: jenisAsuransi #</span>",
          },
          {
            field: "namarekanan",
            title: "Nama Rekanan",
            width: "5.5%",
            template: "<span class='style-center'>#: namarekanan #</span>",
          },
          {
            field: "namaRuangan",
            title: "Ruangan",
            width: "5.5%",
          },
          {
            field: "dpjp",
            title: "Dokter DPJP",
            width: "5.5%",
          },
          {
            field: "nosep",
            title: "No SEP",
            width: "9%",
          },
          {
            field: "status",
            title: "Status Grouping",
            width: "5%",
          },
          {
            field: "pegawaikirim",
            title: "Pegawai Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: pegawaikirim #</span>",
          },
          {
            field: "tglkirim",
            title: "Tanggal Klaim Berkas",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalkirim #</span>",
          },
          {
            field: "totalbiayars",
            title: "Biaya RS",
            width: "5.5%",
          },
          {
            field: "totalpiutangpenjamin",
            title: "Klaim INACBG",
            width: "5.5%",
          },
          {
            field: "biayanaikkelas",
            title: "Biaya Naik Kelas",
            width: "5.5%",
          },
          {
            field: "cbgcode",
            title: "Kode CBG",
            width: "5.5%",
          },
          {
            field: "cbgdescription",
            title: "Deskripsi",
            width: "5.5%",
          },
          {
            field: "tanggalPulang",
            title: "Tanggal Pulang",
            width: "5.5%",
            template: "<span class='style-left'>#: tanggalPulang #</span>",
            attributes: {
              class: "#=tglresume != null ? 'blue' : 'yellow' #",
            },
          },
          {
            field: "alasan",
            title: "Alasan Tidak Layak",
            width: "160px",
            template: '<button class="k-button white1" ng-click="viewAlasan(dataItem)" style="margin:0 0 5px">Alasan</button>',
          },
          {
            field: "statuspapj",
            title: "Status Verif",
            width: "90px",
            template: '<button class="k-button white1" ng-click="VerifPapj(dataItem)" style="margin:0 0 5px">VERIF SELESAI</button>',
          },
          {
            field: "statuspapj",
            title: "Berkas Tidak Layak",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="BerkasTidakLayak(dataItem)" style="margin:0 0 5px">BERKAS TIDAK LAYAK</button>',
          },
          {
            field: "statuspapj",
            title: "Batal Pending",
            width: "5.5%",
            template: '<button class="k-button white1" ng-click="BatalKlaimPending(dataItem)" style="margin:0 0 5px">BATAL PENDING</button>',
          },
        ],
      };

       $scope.SaveAlasanPending = function (dataItem) {
        if ($scope.item.alasan == undefined || $scope.item.alasan == null || $scope.item.alasan == "") {
          alert("Alasan Pending tidak boleh kosong!");
          return;
        }

        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          alasan: $scope.item.alasan,
          status: "4",
        };
        medifirstService.post("tatarekening/save-papj-pending", json).then(function (e) {
          $scope.popUpAlasanPending.close();
          LoadDataSendKlaim();
          LoadDataKlaimPAPJ();
          LoadDataPending();
          LoadDataVerifPAPJ();
        });
      };

      $scope.CloseAlasaPending = function (dataItem) {
        $scope.popUpAlasanPending.close();
      };

      $scope.KlaimPending = function (dataItem) {
        datapapj = dataItem;
        $scope.item.alasan = datapapj.alasan;
        $scope.popUpAlasanPending.center().open();
      };

      $scope.BatalKlaimPending = function (dataItem) {
        datapapj = dataItem;
        $scope.popUpBatalKlaimPending.center().open();
      };

      $scope.BatalPending = function (dataItem) {
        var json = {
          norec_pd: datapapj.norec,
          pegawaifk_verif: $scope.pegawaiLogin.id,
          alasan: $scope.item.alasan,
          status: "4",
        };
        medifirstService.post("tatarekening/save-papj-batal-pending", json).then(function (e) {
          $scope.popUpBatalKlaimPending.close();
          LoadDataKlaimPAPJ();
          LoadDataSendKlaim();
          LoadDataPending();
          LoadDataVerifPAPJ();
        });
      };

      $scope.CloseBatalPending = function (dataItem) {
        $scope.popUpBatalKlaimPending.close();
      };

      //END Pending

      // START UBAH KAMAR-----------------------
        $scope.ubahKamar = function (data) {
          if (data == undefined) {
            toastr.error("Pilih data dulu");
            return;
          }
          $scope.listNoBed = [];
          $scope.listKamar = [];

          delete $scope.item.kamar;
          delete $scope.item.nomorTempatTidur;
          getKamar(data.objectruanganlastfk, data.objectkelasfk);

          // $scope.item.kamar = {id:data.objectkamarfk,namakamar: data.namakamar  }
          // $scope.item.nomorTempatTidur = {id:data.nobed,reportdisplay: data.namabed  }
          $scope.popUpUbahKamar.center().open();
        };
        $scope.$watch("item.kamar", function (e) {
          if (e === undefined) return;
          var kamarId = $scope.item.kamar.id;
          medifirstService.get("rawatinap/get-nobedbykamar?idKamar=" + kamarId).then(function (a) {
            $scope.listNoBed = a.data.bed;
          });
        });
        function getKamar(ruanganId, kelasId) {
          if (ruanganId == undefined && kelasId == undefined) return;
          var kelasIds = "idKelas=" + kelasId;
          var ruanganIds = "&idRuangan=" + ruanganId;
          medifirstService.get("rawatinap/get-kamarbyruangankelas?" + kelasIds + ruanganIds).then(function (b) {
            $scope.listKamar = b.data.kamar;
          });
        }
        $scope.simpanKamar = function () {
          var json = {
            norec_pd: data.norec,
            noregistrasi: data.noregistrasi,
            ruanganlastfk: data.objectruanganlastfk,
            objectkamarfk: $scope.item.kamar.id,
            nobed: $scope.item.nomorTempatTidur.id,
          };
          medifirstService.post("registrasi/daftar-registrasi/update-kamar-pasien-pulang", json).then(function (b) {
            delete $scope.item.kamar;
            delete $scope.item.nomorTempatTidur;

            loadData();
            $scope.popUpUbahKamar.close();
          });
        };
        $scope.tutup = function () {
          delete $scope.item.kamar;
          delete $scope.item.nomorTempatTidur;
          $scope.popUpUbahKamar.close();
        };
      // END UBAH KAMAR-----------------------

      //START UBAH KELAS--------------------
        $scope.ubahKelas = function (data) {
          if (data == undefined) {
            toastr.error("Pilih data dulu");
            return;
          }
          $scope.selectedData = data;
          $scope.listKelas = [
            {id: 3, namakelas: "Kelas 1"},
            {id: 2, namakelas: "Kelas 2"},
            {id: 1, namakelas: "Kelas 3"}
          ]
          $scope.popUpUbahKelas.center().open();
        };

        $scope.simpanKelas = function () {
          var json = {
            noregistrasi: $scope.selectedData.noRegistrasi,
            objectkelasditanggungfk: $scope.item.kelas.id
          };
          medifirstService.post("registrasi/ubah-kelas-ditanggung", json).then(function (b) {
            delete $scope.item.kelas;
            $scope.popUpUbahKelas.close();
          });
        };

        $scope.tutupKelas = function () {
          delete $scope.item.kelas;
          $scope.popUpUbahKelas.close();
        };
      //END UBAH KELAS--------------------

      //START EDIT PASIEN-------------------------
      $scope.EditPasien = function (data) {
          if (data.noCm != undefined) {

              cacheHelper.set('CacheRegisBayi', undefined);
              $state.go('RegistrasiPasienBaru', {
                  noRec: 0,
                  idPasien: data.nocmfk
              })


          } else {
              messageContainer.error("Pilih data dulu!")
          }
      }
      //END EDIT PASIEN---------------------------

      // Belum Kirim
        function LoadDataBelumKirim() {
          // ambil bulan sekarang
          let bulanIni = moment(); 

          // tanggal awal = 6 bulan lalu, awal bulan
          let tglAwalKemarin = bulanIni.clone().subtract(6, 'months').startOf('month').format('YYYY-MM-DD 00:00');

          // tanggal akhir = 1 bulan lalu, akhir bulan
          let tglAkhirKemarin = bulanIni.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59');

          medifirstService.get(
              "tatarekening/daftar-pasien-pulang-papj-kirim?" +
              "tglAwal=" + tglAwalKemarin +
              "&tglAkhir=" + tglAkhirKemarin
          ).then(function (e) {
                  if (e.data.length > 0) {
                      let uniqueData = {};
                      e.data.forEach(item => {
                          if (!uniqueData[item.norec]) {
                              uniqueData[item.norec] = item;
                          }
                      });
                      let filtered = Object.values(uniqueData);

                      let grouped = {};
                      filtered.forEach(item => {
                          let blnKey = moment(item.tanggalPulang).format('YYYY-MM');
                          if (!grouped[blnKey]) {
                              grouped[blnKey] = 0;
                          }
                          grouped[blnKey]++;
                      });

                      let dataTable = Object.keys(grouped).map((blnKey, index) => {
                          return {
                              no: index + 1,
                              tanggalBelum: moment(blnKey, 'YYYY-MM').format('MMMM YYYY'),
                              jumlahBelum: grouped[blnKey]
                          };
                      });

                      $scope.sourceBerkasBelumKirim = new kendo.data.DataSource({
                          data: dataTable,
                          pageSize: 200,
                          total: dataTable.length,
                          serverPaging: false
                      });

                      $scope.judulBerkas = "Terdapat Elektronik Rekam Medis yang belum di Kirim :";
                      $scope.judulBerkas2 = "Kirim";
                      $scope.activeSource = 'kirim';

                       $timeout(function () {
                            if ($scope.winBerkas) {
                                $scope.winBerkas.center().open();
                            }
                        });
                  }
              });
          }


          function LoadDataBelumVerif(){
             let bulanIni = moment(); 

              // tanggal awal = 6 bulan lalu, awal bulan
              let tglAwalKemarin = bulanIni.clone().subtract(6, 'months').startOf('month').format('YYYY-MM-DD 00:00');

              // tanggal akhir = 1 bulan lalu, akhir bulan
              let tglAkhirKemarin = bulanIni.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59');

            medifirstService.get(
                    "tatarekening/daftar-pasien-pulang-papj-verif?" +
                    "tglAwal=" + tglAwalKemarin +
                    "&tglAkhir=" + tglAkhirKemarin
                ).then(function (e) {
                    if (e.data.length > 0) {
                        let uniqueData = {};
                        e.data.forEach(item => {
                            if (!uniqueData[item.norec]) {
                                uniqueData[item.norec] = item;
                            }
                        });
                        let filtered = Object.values(uniqueData);

                        let grouped = {};
                        filtered.forEach(item => {
                            let blnKey = moment(item.tanggalPulang).format('YYYY-MM'); 
                            if (!grouped[blnKey]) {
                                grouped[blnKey] = 0;
                            }
                            grouped[blnKey]++;
                        });

                        let dataTable = Object.keys(grouped).map((blnKey, index) => {
                            return {
                                no: index + 1,
                                tanggalBelum: moment(blnKey, 'YYYY-MM').format('MMMM YYYY'), 
                                jumlahBelum: grouped[blnKey]
                            };
                        });

                        $scope.sourceBerkasBelumVerif = new kendo.data.DataSource({
                            data: dataTable,
                            pageSize: 200,
                            total: dataTable.length,
                            serverPaging: false
                        });

                        $scope.judulBerkas = "Terdapat Elektronik Rekam Medis yang belum di Verifikasi :";
                        $scope.activeSource = 'verif';
                        $timeout(function () {
                            if ($scope.winBerkas) {
                                $scope.winBerkas.center().open();
                            }
                        });
                    }
                });
          }

          $scope.gridKlaimClosed = false;

          function LoadDataBelumKlaim() {
            // kalau popup sudah pernah di-close, jangan tampilkan lagi
            if ($scope.gridKlaimClosed) {
                return;
            }

            let bulanIni = moment(); 
            let tglAwalKemarin = bulanIni.clone().subtract(6, 'months').startOf('month').format('YYYY-MM-DD 00:00');
            let tglAkhirKemarin = bulanIni.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59');

            medifirstService.get(
                "tatarekening/daftar-pasien-pulang-papj-klaim?" +
                "tglAwal=" + tglAwalKemarin +
                "&tglAkhir=" + tglAkhirKemarin +
                "&statusGrouping=GROUPING,EDIT CLAIM"
            ).then(function (e) {
                if (e.data.length > 0) {
                    // hilangkan data duplikat
                    let uniqueData = {};
                    e.data.forEach(item => {
                        if (!uniqueData[item.norec]) {
                            uniqueData[item.norec] = item;
                        }
                    });
                    let filtered = Object.values(uniqueData);

                    // group per bulan
                    let grouped = {};
                    filtered.forEach(item => {
                        let blnKey = moment(item.tanggalPulang).format('YYYY-MM');
                        if (!grouped[blnKey]) grouped[blnKey] = 0;
                        grouped[blnKey]++;
                    });

                    // buat data untuk grid
                    let dataTable = Object.keys(grouped).map((blnKey, index) => {
                        return {
                            no: index + 1,
                            tanggalBelum: moment(blnKey, 'YYYY-MM').format('MMMM YYYY'),
                            jumlahBelum: grouped[blnKey]
                        };
                    });

                    $scope.sourceBerkasBelumKlaim = new kendo.data.DataSource({
                        data: dataTable,
                        pageSize: 200
                    });

                    $scope.judulBerkas = "Terdapat Elektronik Rekam Medis yang belum di Klaim :";
                    $scope.judulBerkas2 = "Send Claim";
                    $scope.activeSource = 'klaim';

                    $timeout(function () {
                        if ($scope.winBerkas) {
                            $scope.winBerkas.center().open();
                        }
                    });
                }
            });
        }

          $scope.closeWinBerkas = function () {
              if ($scope.activeSource === 'klaim') {
                  $scope.gridKlaimClosed = true; // klaim hanya muncul sekali per sesi
              }
              if ($scope.winBerkas) {
                  $scope.winBerkas.close();
              }
          };

          $scope.item = $scope.item || {};
          $scope.item.statusklaim = $scope.item.statusklaim || [];

          $scope.listStatusKlaim = [
            { id: 1, nama: "SEND CLAIM", value: "SEND CLAIM" },
            { id: 2, nama: "BELUM CLAIM", value: "GROUPING,EDIT CLAIM,null" },
          ];

      //End Belum Kirim

      //TABLE BERKAS BELUM 
       $scope.berkasBelum = {
                pageable: true,
                scrollable: true,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: 40
                    },
                    {
                        field: "tanggalBelum",
                        title: "Bulan",
                        width: 100
                    },
                    {
                        field: "jumlahBelum",
                        title: "Jumlah",
                        width: 100
                    }
                ],
            };
        //END TABLE BERKAS BELUM

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
                    noregistrasifk: $scope.item.data[0].noregistrasifk,
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
                    kode_tarif: "BP",
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
                medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
                  responData = e.data.dataresponse;
                  toastr.info(responData[0].dataresponse.metadata.message, "INACBG");
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
                  medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
                    kode_tarif: "BP",
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
                medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
                  medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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
              medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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

              medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData)
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
                          "bridging/inacbg/save-bridging-inacbg", {
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

            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData)
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
            medifirstService.post("bridging/inacbg/save-bridging-inacbg", {
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
              const res = await medifirstService.post("bridging/inacbg/save-bridging-inacbg", {
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

            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData)
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
              medifirstService.post("bridging/inacbg/save-bridging-inacbg", {
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
              const res = await medifirstService.post("bridging/inacbg/save-bridging-inacbg", {
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

            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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

            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
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

          $scope.myVar = parseInt(localStorage.getItem('myVar')) || 0;

          // Simpan index tab aktif setiap kali berubah
          $scope.$watch('myVar', function(newVal) {
            localStorage.setItem('myVar', newVal);
          });


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
                      if ($scope.hasCmgOption) {
                          $scope.tabelTopup = true;
                          $scope.showGrouping = false;
                      }
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

          $scope.clickGroupingINACBG = async function () {
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

            try {
              let e = await medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData);
              let responData = e.data.dataresponse;

              toastr.info(responData[0].dataresponse.metadata.message, "GROUPING INACBG");

              let totaldijamin = responData[0].dataresponse.response_inacbg.tariff;
              let biayanaikkelas = "0";

              if ($scope.item.datanaikkelas[0].statusnaikkelas != "0") {
                biayanaikkelas = responData[0].dataresponse.response_inacbg.add_payment_amt;
                if (biayanaikkelas < 0) biayanaikkelas = 0;
              }

              $scope.cbgcode = responData[0].dataresponse.response_inacbg.cbg.code;
              $scope.cbgdescription = responData[0].dataresponse.response_inacbg.cbg.description;
              $scope.totalInacbg = $scope.formatRupiah(totaldijamin, "Rp. ");
              $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, "Rp. ");

              // Simpan proposi
              var dataproposi = {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                totalDijamin: totaldijamin,
                biayaNaikkelas: biayanaikkelas,
                cbgcode: $scope.cbgcode,
                cbgdescription: $scope.cbgdescription,
              };

              await medifirstService.post("bridging/inacbg/save-proposi-bridging-inacbg", dataproposi);

              // Update status grouping
              await medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", {
                noregistrasifk: $scope.item.data[0].noregistrasifk,
                status: "GROUPING INACBG"
              });

              // Cek apakah ada CMG option
              var cmgOptions = responData[0]?.dataresponse?.special_cmg_option || [];
              $scope.hasCmgOption = cmgOptions.length > 0;

              if (cmgOptions.length > 0) {
                  toastr.info("Terdeteksi Top-up CMG Options");

                  var spesialDrugx = [];
                  var specialProcedurex = [];
                  var specialProsthesisx = [];
                  var specialInvestigationx = [];

                  $scope.tabelTopup = true;
                  $scope.showGrouping = false;

                  for (let i = 0; i < cmgOptions.length; i++) {
                      const element = cmgOptions[i];
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


              $scope.GroupingInacbgSuccess = true;
              $scope.isFinalInacbg = false;

               $scope.getStatusBridgingInacbg();

            } catch (error) {
              console.error(error);
              toastr.error("Gagal grouping INACBG");
            }
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

          $scope.SendClaimKolektif = function () {
            $scope.popupSendClaim.center().open();
           }

          $scope.FinalInacbgKolektif = function () {
             $scope.popupFinalInacbg.center().open();
           }

          $scope.clickFinalInacbgKolektif = function () {
            medifirstService.get("bridging/inacbg/get-status-bridging-inacbg-grouping-all")
              .then(function (res) {
                var list = res.data; // list SEP yang masih GROUPING

                if (!list || list.length === 0) {
                  toastr.warning("Tidak ada data yang perlu difinalkan.", "INACBG");
                  return;
                }
                // return;

                // Mulai proses kolektif
                let index = 0;

                function prosesNext() {
                  if (index >= list.length) {
                    toastr.success("Final INACBG Kolektif selesai.", "INACBG");
                    return;
                  }

                  let row = list[index];

                  var dt1 = {
                    metadata: { method: "inacbg_grouper_final" },
                    data: { nomor_sep: row.nosep }
                  };

                  var objData = { 
                    data: [dt1],
                    noregistrasifk: row.noregistrasifk
                  };

                  medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData)
                    .then(function (e) {
                      let respon = e.data.dataresponse;

                      var update = {
                        noregistrasifk: row.noregistrasifk,
                        status: "FINAL INACBG"
                      };

                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", update);

                      toastr.info("FINAL: " + row.nosep, "INACBG");
                      index++;
                      prosesNext(); // lanjut ke SEP berikutnya
                    });
                }

                prosesNext();
              });
          };

          $scope.GroupingInacbgKolektif = function () {
             $scope.popupFinalInacbg.center().open();
           }

          $scope.clickGroupingInacbgKolektif = function () {
            medifirstService.get("bridging/inacbg/get-status-bridging-inacbg-import-all")
              .then(function (res) {
                var list = res.data; // list SEP yang masih IMPORT

                if (!list || list.length === 0) {
                  toastr.warning("Tidak ada data yang perlu di GROUPING INACBG.");
                  return;
                }
                // return;

                // Mulai proses kolektif
                let index = 0;

                function prosesNext() {
                  if (index >= list.length) {
                    toastr.success("GROUPING INACBG Kolektif selesai.", "INACBG");
                    return;
                  }

                  let row = list[index];

                  var dt1 = {
                    metadata: { method: "inacbg_grouper_final" },
                    data: { nomor_sep: row.nosep }
                  };

                  var objData = { 
                    data: [dt1],
                    noregistrasifk: row.noregistrasifk
                  };

                  medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData)
                    .then(function (e) {
                      let respon = e.data.dataresponse;

                      var update = {
                        noregistrasifk: row.noregistrasifk,
                        status: "FINAL INACBG"
                      };

                      medifirstService.post("bridging/inacbg/update-status-bridging-inacbg", update);

                      toastr.info("FINAL: " + row.nosep, "INACBG");
                      index++;
                      prosesNext(); // lanjut ke SEP berikutnya
                    });
                }

                prosesNext();
              });
          };


          $scope.clickSendClaimKolektif = function () {
            var dt1 = {};
            var dt2 = [];
            dt1 = {
              metadata: {
                method: "send_claim",
              },
              data: {
                start_dt: $scope.formatTanggalClaim($scope.item.tglAwalclaim),
                stop_dt: $scope.formatTanggalClaim($scope.item.tglAkhirclaim),
                jenis_rawat: $scope.item.jenisrawat.value || 3,
                date_type: $scope.item.datetype.value || 1,
              },
            };
            dt2.push(dt1);

            var objData = {
              data: dt2,
            };
            medifirstService.post("bridging/inacbg/save-bridging-inacbg", objData).then(function (e) {
            var responData = e.data.dataresponse;

            if (responData[0].dataresponse.metadata.code == "200") {
              var listSep = responData[0].dataresponse.response.data;

              angular.forEach(listSep, function (item) {
                var datasend = {
                  nosep: item.nomor_sep,
                  status: "SEND CLAIM",
                };

                medifirstService
                  .post("bridging/inacbg/update-status-bridging-inacbg2", datasend)
                  .then(function (res) {
                    // optional logging
                  });
              });

              toastr.info(
                responData[0].dataresponse.metadata.message,
                "INACBG"
              );
            }
          });

          };

          $scope.listjenisrawat = [
              { text: "Ranap", value: 1 },
              { text: "Rajal", value: 2 },
              { text: "Ranap & Rajal", value: 3 },
          ];

          $scope.listdatetype = [
              { text: "Tanggal Pulang", value: 1 },
              { text: "Tanggal Grouping", value: 2 },
          ];
      
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