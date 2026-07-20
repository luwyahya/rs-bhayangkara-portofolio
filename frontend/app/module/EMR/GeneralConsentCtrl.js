define(["initialize"], function (initialize) {
  "use strict";

  initialize.controller("GeneralConsentCtrl", [
    "$mdDialog",
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($mdDialog, $q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
      $scope.item = {};
      $scope.user = {};
      $scope.noCM = $state.params.noCM;
      $scope.tombolSimpanVis = true;
      $scope.isCetak = true;
      $scope.isKembali = true;
      $scope.noRecPap = cacheHelper.get("noRecPap");
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMR = "-";
      var nomorEMRSS = "";
      var paramSearch = "";
      $scope.isAdmin = false
      $scope.item.qrnama = ''
      $scope.isSave = true;
      $scope.isUpdate = false;
      $scope.isUpdateCetak = false;
      
      $scope.cetak = function () {
          $scope.popUpCetak.center().open();
      };
      
      $scope.tutupSurat = function () {
          $scope.popUpCetak.close();
      };

      //inisialisasi untuk id emr pada pengkajian medis pasien ctrl
      $scope.cc.emrfk = 2153;

      $scope.now = new Date();
      var dataLoad = [];
      $scope.listData1 = [];
      $scope.listData2 = [];
      $scope.listData3 = [];
      $scope.item.objcbo = [];
      $scope.dataSource = [];
      $scope.item.obj = [];
      $scope.item.obj2 = [];
      $scope.item.image = "../app/images/svg/no-image.svg";
      $scope.InputLab = true;
      $scope.InputRadiologi = true;
      $scope.InputObat = true;

      //UNTUK KOMUNIKASI PARENT DENGAN CHILD
      $scope.tipemodul = "generalconsent";

      var lanjut = false;
      LoadCacheHelper();
      function LoadCacheHelper() {
        var chacePeriode = cacheHelper.get("cacheRMelektronik");
        if (chacePeriode != undefined) {
          $scope.cc.nocm = chacePeriode[0];
          $scope.cc.namapasien = chacePeriode[1];
          $scope.cc.jeniskelamin = chacePeriode[2];
          $scope.cc.noregistrasi = chacePeriode[3];
          $scope.cc.umur = chacePeriode[4];
          $scope.cc.kelompokpasien = chacePeriode[5];
          $scope.cc.tglregistrasi = chacePeriode[6];
          $scope.cc.norec = chacePeriode[7];
          $scope.cc.norec_pd = chacePeriode[8];
          $scope.cc.objectkelasfk = chacePeriode[9];
          $scope.cc.namakelas = chacePeriode[10];
          $scope.cc.objectruanganfk = chacePeriode[11];
          $scope.cc.namaruangan = chacePeriode[12];
          $scope.cc.DataNoregis = chacePeriode[13];
          $scope.cc.tglLahir = chacePeriode[14];
          $scope.cc.namadpjp = chacePeriode[16];
          $scope.cc.pgId = chacePeriode[17];
          $scope.cc.alamat = chacePeriode[15];
          $scope.cc.nohp = chacePeriode[35];
          $scope.cc.namaibu = chacePeriode[36];
          $scope.cc.namaayah = chacePeriode[37];
          $scope.cc.ruangakakhir = chacePeriode[24];
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "generalconsent";
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
          $scope.item.obj[1901308207] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD");

          init();
        }
        if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
          $scope.isAdmin = true
        }
      }
      var chekedd = false;

      function init() {
        $scope.isLoading = true;

        medifirstService.get("emr/get-riwayat-transfer-internal?noregistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {
          $scope.isRouteLoading = false;
          let data = dat.data
          for (let i = 0; i < data.length; i++) {
            data[i].no = i + 1;
          }
          $scope.dataRiwayatgeneralconsent = new kendo.data.DataSource({
            data: data,
            schema: {
              model: {
              }
            },
            pageSize: 10,
            total: data.length,
            serverPaging: false,

          });
        })
        $scope.item.obj = [];
        $scope.item.obj2 = [];
        $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD HH:mm");
        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
        getPenunjang('noregistrasi=' + $scope.cc.noregistrasi);

        medifirstService.get("emr/get-combo").then(function (data) {
          $scope.listPegawai = data.data.pegawai;
          $scope.listRuangan = data.data.ruangan;
        });
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=generalconsent", true).then(function (dat) {
          $scope.isRouteLoading = false;
          nomorEMRSS = "";
          if (dat.data.data.length > 0) {
            for (let i = 0; i < dat.data.data.length; i++) {
              if (dat.data.data[i].jenisemr == "generalconsent") {
                lanjut = true;
              }
            }
            if (lanjut == true) {
              $scope.isSave = false;
              $scope.isUpdate = true;
              $scope.isUpdateCetak = true;
              $scope.cc.noemr = dat.data.data[0].noemr;
              $scope.cc.norec_emr = dat.data.data[0].noemr;
              nomorEMRSS = dat.data.data[0].noemr;
              nomorEMR = nomorEMRSS;
              $scope.cc.emrfk = 2153;
              setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
            }
          } else {
            $scope.item.obj[1901304997] = $scope.cc.nocm;
            $scope.item.obj[1901304998] = $scope.cc.namapasien;
            $scope.item.obj[1901304999] = $scope.cc.tglLahir;
            $scope.item.obj[1901305003] = $scope.cc.kelompokpasien;
            $scope.item.obj[1901305000] = $scope.cc.namaruangan;
            $scope.item.obj[1901305011] = $scope.cc.ruangakakhir;
            $scope.item.obj[1901305094] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp };
            if ($scope.cc.jeniskelamin == "LAKI-LAKI") {
              $scope.item.obj[1901305001] = true;
              $scope.item.obj[1901305002] = false;
            } else {
              $scope.item.obj[1901305001] = false;
              $scope.item.obj[1901305002] = true;
            }

            valueOtomatis();
            getValueSPRI();
            loadOrderPenunjang();
            loadOrderFarmasi(); // Fungsi ini sekarang kosong agar tidak memanggil API
          }
        });
        $scope.isLoading = false;
      }

      function setobjectToModel(nomorEMRSS, emrfk) {
        let namaPegawai = "";
        let namaPegawai2 = "";
        let namaPegawai3 = "";

        $scope.item.obj = {};
        $scope.item.obj2 = {};
        $scope.user.poto = null;

        medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {

          $scope.isLoading = false;
          var chekedd = false;
          dataLoad = dat.data.data;
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              if (dataLoad[i].type == "textbox" || !dataLoad[i].type) {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "checkbox") {
                chekedd = false;
                if (dataLoad[i].value == "1") {
                  chekedd = true;
                }
                $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
              } else if (dataLoad[i].type == "datetime") {
                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
              } else if (dataLoad[i].type == "time") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "date") {
                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
              } else if (dataLoad[i].type == "checkboxtextbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                $scope.item.obj2[dataLoad[i].emrdfk] = true;
              } else if (dataLoad[i].type == "textarea") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "text") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "photo") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "image") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "12344") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305076") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305077") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305078") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305079") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305080") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305081") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305082") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305083") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305084") {
                var str = dataLoad[i].value
                var res = str.split("~");
                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901308749") {
                var str = dataLoad[i].value
                var res = str.split("~");
                namaPegawai = res[0];
                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901311528") {
                var str = dataLoad[i].value
                var res = str.split("~");
                namaPegawai2 = res[0];
                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305096") {
                var str = dataLoad[i].value
                var res = str.split("~");
                namaPegawai3 = res[0];
                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304996") {
                var str = dataLoad[i].value
                var res = str.split("~");
                namaPegawai3 = res[0];
                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304995") {
                var str = dataLoad[i].value
                var res = str.split("~");
                namaPegawai3 = res[0];
                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaruangan: str }

              }
            }
          }
          if (namaPegawai) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }
          if (namaPegawai2) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr2 = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }
          if (namaPegawai3) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr3 = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }

        });
      }

      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

      $scope.Save = function () {
        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan menyimpan data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.Saveok();
        });
      };

      $scope.Saveok = function () {
        $scope.isUpdateCetak = false;
        $scope.isLoading = true;
        var photo = "";
        kendo.drawing
          .drawDOM($(".surface"))
          .then(function (group) {
            return kendo.drawing.exportImage(group);
          })
          .done(function (data) {
            photo = data;
          });

        $scope.item.obj[1239] = moment($scope.item.obj[1239]).format("YYYY-MM-DD");
        if ($scope.item.obj[1901311527] != undefined) {
          $scope.item.obj[1901311527] = moment($scope.item.obj[1901311527]).format("YYYY-MM-DD HH:mm");
        }

        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];

        for (let i = arrobj.length - 1; i >= 0; i--) {
          var currentId = arrobj[i];
          var currentObj = $scope.item.obj[parseInt(currentId)];

          if (currentObj != undefined && currentObj !== "") {
            var valueToPush = currentObj;

            if (currentId == 1901311528 || currentId == 1901308749 || currentId == 1901305096 || currentId == 1901304996) {
              if (typeof currentObj === 'object') {
                if (currentObj.value !== undefined) {
                  valueToPush = currentObj;
                } else if (currentObj.id !== undefined) {
                  valueToPush = { value: currentObj.id, text: currentObj.namalengkap };
                }
              }
            } else if (currentId == 1901304995) {
              if (typeof currentObj === 'object') {
                if (currentObj.value !== undefined) {
                  valueToPush = currentObj;
                } else if (currentObj.id !== undefined) {
                  valueToPush = { value: currentObj.id, text: currentObj.namaruangan };
                }
              }
            } else if (typeof currentObj === 'object' && currentObj instanceof Date) {
              valueToPush = moment(currentObj).format("YYYY-MM-DD HH:mm");
            }

            // Safeguard against objects missing the 'value' key causing PHP to crash
            if (typeof valueToPush === 'object' && valueToPush !== null) {
              if (valueToPush.value === undefined) {
                valueToPush = JSON.stringify(valueToPush);
              }
            }

            arrSave.push({ id: currentId, values: valueToPush });
          }
        }

        $scope.cc.jenisemr = "generalconsent";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
          image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null,
        };

        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          $scope.isSave = false;
          $scope.isUpdate = true;
          $scope.isUpdateCetak = true;
          $scope.noemr = e.data.data.noemr;
          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Formulir Skrinning " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
            var arrStr = {
              0: $scope.noemr,
            };
            cacheHelper.set("cacheNomorEMR", arrStr);
            LoadCacheHelper();
            $scope.isLoading = false;
          });
        });
      };

      $scope.cetakPdf = function () {
        $scope.popUpCetak.center().open();
      };
      $scope.tutupSurat = function () {
        $scope.popUpCetak.close();
      };

      function valueOtomatis() {
        if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == "") {
          toastr.error("Ada kesalahan saat ambil isian Pengkajian Medis IGD, Mohon refresh kembali!");
        } else {
          medifirstService.get("emr/get-value-pengkajian-medis-igd?noRegistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            if (e.data.messageCode == 200) {
              var value = e.data.data;
              for (let i = 0; i < value.length; i++) {
                //penyakit sekarang
                if (value[i].emrdfk == 2408) {
                  $scope.item.obj[1901305005] = value[i].value;
                }
                //keterangan pemeriksaan fisik
                if (value[i].emrdfk == 2423) {
                  $scope.item.obj[1901305006] = value[i].value;
                }
                //diagnosa kerja
                if (value[i].emrdfk == 2426) {
                  $scope.item.obj[1901305008] = value[i].value;
                }
                if (value[i].emrdfk == 1901300313) {
                  $scope.item.obj[1901305009] = value[i].value;
                }
              }
            }
          });
        }
      }

      function loadOrderPenunjang() {
        medifirstService.get('emr/get-order-penunjang-to-cppt?norec_pd=' + $scope.cc.norec_pd).then(function (dat) {

          if (dat.data && dat.data.length > 0) {
            let textLab = "";
            let textRad = "";
            let textResep = "";

            let adaLab = false;
            let adaRad = false;
            let adaResep = false;

            for (let i = 0; i < dat.data.length; i++) {
              let item = dat.data[i];

              if (item.namaproduk != null) {

                if (item.keteranganorder == "Order Laboratorium") {
                  if (!adaLab) {
                    textLab += "LAB :\n";
                    adaLab = true;
                  }
                  textLab += " - " + item.namaproduk + "\n";
                }

                else if (item.keteranganorder == "Order Radiologi") {
                  if (!adaRad) {
                    textRad += "RAD :\n";
                    adaRad = true;
                  }
                  textRad += " - " + item.namaproduk + "\n";
                }

                else if (item.keteranganorder == "Order Farmasi") {
                  if (!adaResep) {
                    textResep += "E-resep :\n";
                    adaResep = true;
                  }
                  let aturan = item.aturanpakai ? " " + item.aturanpakai : "";
                  textResep += " - " + item.namaproduk + aturan + "\n";
                }
              }
            }

            let hasilAkhir = "";
            if (adaLab) hasilAkhir += textLab + "\n";
            if (adaRad) hasilAkhir += textRad + "\n";
            if (adaResep) hasilAkhir += textResep;

            if (!$scope.item) $scope.item = {};
            if (!$scope.item.obj) $scope.item.obj = {};

            $scope.item.obj[1901305007] = hasilAkhir.trim();
          }
        });
      }



      $scope.listGcs = [
        { text: "E", value: 1 },
        { text: "M", value: 2 },
        { text: "V", value: 3 }
      ];
      $scope.listGcsE = [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "-", value: 5 }
      ];
      $scope.listGcsM = [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6", value: 6 },
        { text: "-", value: 7 }
      ];
      $scope.listGcsV = [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "-", value: 6 },
        { text: "Afasia", value: 7 },
        { text: "Terintubasi", value: 8 }
      ];

      $scope.listKondisiUmum = [
        { text: "Ringan", value: 1 },
        { text: "Sedang", value: 2 },
        { text: "Berat", value: 3 },
      ];

      $scope.listKesadaran = [
        { text: "Compos Mentis", value: 1 },
        { text: "Apatis", value: 2 },
        { text: "Delirium", value: 3 },
        { text: "Somnolent", value: 4 },
        { text: "Sopor", value: 5 },
        { text: "Semi Coma", value: 6 },
        { text: "Coma", value: 7 },
      ];

      $scope.listRoute = [
        { text: "PO", value: 1 },
        { text: "IV", value: 2 },
        { text: "IT", value: 3 },
        { text: "SC", value: 4 },
        { text: "IM", value: 5 },
        { text: "TETES HIDUNG", value: 6 },
        { text: "TETES TELINGA", value: 7 },
        { text: "TETES MATA", value: 8 },
        { text: "SUP", value: 9 },
        { text: "OLEH DI KULIT", value: 10 },
        { text: "OLEH DI BIBIR/MULUT", value: 11 },
        { text: "NEBULISASI", value: 12 },
        { text: "HISAP", value: 13 },
        { text: "SEMPROT", value: 14 },
        { text: "KUMUR-KUMUR", value: 15 },
      ];

      //Isian Default
      $scope.item.obj[238] = 'TAK';
      $scope.item.obj[239] = 'TAK';
      $scope.item.obj[242] = 'TAK';
      $scope.item.obj[243] = 'TAK';
      $scope.item.obj[244] = 'TAK';
      $scope.item.obj[245] = 'TAK';
      $scope.item.obj[247] = 'TAK';
      $scope.item.obj[248] = 'TAK';
      $scope.item.obj[249] = 'TAK';
      $scope.item.obj[250] = 'TAK';
      $scope.item.obj[251] = 'TAK';
      $scope.item.obj[254] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[257] = 'TAK';
      $scope.item.obj[259] = 'TAK';
      $scope.item.obj[260] = 'TAK';
      //end Isian Default

      function getPenunjang(paramSearch) {
        medifirstService.get('emr/get-riwayat-order-penunjang-lab-rad?' + paramSearch).then(function (e) {

          let daftar = e.data.daftar || [];

          // Masukkan nomor urut
          for (var i = daftar.length - 1; i >= 0; i--) {
            daftar[i].no = i + 1;
          }

          // Ambil semua details → namaproduk
          let semuaProduk = [];

          daftar.forEach(item => {
            if (item.details && item.details.length > 0) {
              item.details.forEach(det => {
                semuaProduk.push(det.namaproduk);
              });
            }
          });

          // Gabungkan ke textarea
          // Pisahkan dengan enter (\n)
          if (semuaProduk.length > 0) {
            $scope.item.obj[261] = semuaProduk.join('\n');
          }

          // Masukkan ke grid
          $scope.dataGridRiwayat = new kendo.data.DataSource({
            data: daftar,
            pageSize: 10
          });

        });
      }

      function getValueSPRI() {
        medifirstService.get('emr/get-value-spri?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
          let pemeriksaanfisik = '';
          if (e.data.messageCode == 200) {
            var value = e.data.data
            if (value.length > 0) {
              for (let i = 0; i < value.length; i++) {
                if (value[i].emrdfk == 358) {
                  $scope.item.obj[1901305004] = value[i].value
                }
              }
            }
          } else {
          }
        })
      }


      $scope.getLinkQr = function (namaPegawai) {
        if (!namaPegawai || namaPegawai === '-') return '';
        return 'report/create-qr?namaPegawai=' + encodeURIComponent(namaPegawai);
      }


      // 
      $scope.listNyeriAnak = [
        {
          "id": 3392, "nama": "Hurts", "detail": [
            { "id": 3393, "nama": "No Hurt", "descNilai": 0 },
            { "id": 3394, "nama": "Hurts Little Bit", "descNilai": 2 },
            { "id": 3395, "nama": "Hurts Little More", "descNilai": 4 },
            { "id": 3396, "nama": "Hurts Even More", "descNilai": 6 },
            { "id": 3397, "nama": "Hurts Whole Lot", "descNilai": 8 },
            { "id": 3398, "nama": "Hurts whorts", "descNilai": 10 }]
        }
      ]
      $scope.listSkorWong = [{
        "id": 3399, "nama": "Score ",
        "detail": [
          { "id": 3275, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
          { "id": 3276, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
          { "id": 3277, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
          { "id": 3278, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
          { "id": 3279, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
          { "id": 3280, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
        ]
      }]

      $scope.getSkalaNyeri = function (data, stat) {

        $scope.item.obj[3283] = undefined
        $scope.activeStatus = stat.descNilai
        var nilai = stat.descNilai
        if (nilai >= 0 && nilai <= 1) {
          $scope.item.obj[3275] = true
          $scope.item.obj[3283] = '0 - 1'
          $scope.item.obj[3276] = false
          $scope.item.obj[3277] = false
          $scope.item.obj[3278] = false
          $scope.item.obj[3279] = false
          $scope.item.obj[3280] = false
        }

        if (nilai >= 2 && nilai <= 3) {
          $scope.item.obj[3275] = false
          $scope.item.obj[3276] = true
          $scope.item.obj[3283] = '2 - 3'
          $scope.item.obj[3277] = false
          $scope.item.obj[3278] = false
          $scope.item.obj[3279] = false
          $scope.item.obj[3280] = false
        }
        if (nilai >= 4 && nilai <= 5) {
          $scope.item.obj[3275] = false
          $scope.item.obj[3276] = false
          $scope.item.obj[3277] = true
          $scope.item.obj[3283] = '4 - 5'
          $scope.item.obj[3278] = false
          $scope.item.obj[3279] = false
          $scope.item.obj[3280] = false
        }
        if (nilai >= 6 && nilai <= 7) {
          $scope.item.obj[3275] = false
          $scope.item.obj[3276] = false
          $scope.item.obj[3277] = false
          $scope.item.obj[3278] = true
          $scope.item.obj[3283] = '6 - 7'
          $scope.item.obj[3279] = false
          $scope.item.obj[3280] = false
        }
        if (nilai >= 8 && nilai <= 9) {
          $scope.item.obj[3275] = false
          $scope.item.obj[3276] = false
          $scope.item.obj[3277] = false
          $scope.item.obj[3278] = false
          $scope.item.obj[3279] = true
          $scope.item.obj[3283] = '8 - 9'
          $scope.item.obj[3280] = false
        }

        if (nilai == 10) {
          $scope.item.obj[3275] = false
          $scope.item.obj[3276] = false
          $scope.item.obj[3277] = false
          $scope.item.obj[3278] = false
          $scope.item.obj[3279] = false
          $scope.item.obj[3280] = true
          $scope.item.obj[3283] = '10'
        }

      }
    },

  ]);
});