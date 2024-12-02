define(["initialize"], function (initialize) {
  "use strict";
  initialize.controller("FormulirRisikoJatuhAnakRSMDCtrl", [
    "$q",
    "$rootScope",
    "$scope",
    "$state",
    "CacheHelper",
    "MedifirstService",
    "ModelItem",
    function (
      $q,
      $rootScope,
      $scope,
      $state,
      cacheHelper,
      medifirstService,
      ModelItem
    ) {
      $scope.item = {};
      $scope.item.skalaNyeri = 0;
      $scope.skrining = {};
      $scope.dataForm = {};
      $scope.dataFormNyeri = {};
      $scope.dataFormRisiko = {};
      $scope.arrPengkajianSkrining = [];
      $scope.arrPengkajianNyeri = [];
      $scope.arrPengkajianRisiko = [];
      $scope.ItemFRD = {};
      $scope.ItemAnti = {};
      $scope.dataVOloaded = cacheHelper.get("dataVOloaded");
      $scope.now = new Date();
      $scope.item.periodeAwal = new Date();
      var norec_apd = "";
      var norec_pd = "";
      var nocm_str = "";
      $scope.item.qty = 1;
      $scope.riwayatForm = false;
      $scope.inputOrder = true;
      $scope.CmdOrderPelayanan = true;
      $scope.OrderPelayanan = false;
      $scope.showTombol = false;
      $scope.PegawaiLogin2 = {};
      var norecSurveilans = "";
      var dataFRD = [];
      var dataAntiBio = [];
      var dataHead = [];
      $scope.item.norecval = [];
      $scope.item.obj = [];
      $scope.NorecSurveilans = "";
      $scope.pasienAnak = {};
      $scope.arrSkriningGiziAnak = [];
      var noRegistrasi = "";
      $scope.isTTP = true;
      $scope.noRecPap = cacheHelper.get("noRecPapNew"); // noRecPap
      LoadCacheHelper();
      LoadCombo();
      init();

      function LoadCombo() {
        medifirstService.get("emr/get-combo").then(function (dat) {
          $scope.listPerawat = dat.data.pegawai;
          $scope.listDokter = dat.data.pegawai;
          $scope.listRuangan = dat.data.ruangan;
        });

        medifirstService
          .getPart(
            "registrasi/daftar-registrasi/get-data-diagnosa",
            true,
            true,
            10
          )
          .then(function (data) {
            $scope.listDiagnosa = data;
          });
        medifirstService
          .get("rawatinap/get-dokters-combos", false)
          .then(function (data) {
            $scope.listDokter = data.data.dokter;
          });
      }

      function ClearAll() {
        $scope.item = {};
        $scope.ItemFRD = {};
        $scope.ItemAnti = {};
        $scope.gridFRD = new kendo.data.DataSource({
          data: [],
        });
        $scope.gridAntibiotika = new kendo.data.DataSource({
          data: [],
        });
      }

      function LoadCacheHelper() {
        $scope.disableCD = true;
        $scope.disableOperasi = true;
        $scope.disableCU = true;
        $scope.disableCP = true;
        $scope.disableFR = true;
        $scope.IsInfeksi = true;
        // var chacePeriode = cacheHelper.get('cacheRekamMedis');
        // if (chacePeriode != undefined) {
        //     //var arrPeriode = chacePeriode.split(':');
        //     $scope.item.noMr = chacePeriode[0]
        //     nocm_str = chacePeriode[0]
        //     $scope.item.namaPasien = chacePeriode[1]
        //     $scope.item.jenisKelamin = chacePeriode[2]
        //     $scope.item.noregistrasi = chacePeriode[3]
        //     noRegistrasi = chacePeriode[3]
        //     $scope.item.umur = chacePeriode[4]
        //     $scope.item.kelompokPasien = chacePeriode[5]
        //     $scope.item.tglRegistrasi = chacePeriode[6]
        //     norec_apd = chacePeriode[7]
        //     norec_pd = chacePeriode[8]
        //     $scope.item.idKelas = chacePeriode[9]
        //     $scope.item.kelas = chacePeriode[10]
        //     $scope.item.idRuangan = chacePeriode[11]
        //     $scope.item.namaRuangan = chacePeriode[12]
        //     $scope.header.DataNoregis = chacePeriode[13]
        //     if ($scope.header.DataNoregis == undefined) {
        //         $scope.header.DataNoregis = false;
        //     }

        // }
      }

      $scope.showAndHide = function () {
        $("#contentDiagnosa").fadeToggle("fast", "linear");
      };

      $scope.showAndHidee = function () {
        $("#contentDiagnosaa").fadeToggle("fast", "linear");
      };

      $scope.showAndHideee = function () {
        $("#contentDiagnosaaa").fadeToggle("fast", "linear");
      };

      $scope.showAndHideeee = function () {
        $("#contentDiagnosaaaa").fadeToggle("fast", "linear");
      };

      $scope.showAndHideCD = function () {
        $("#contentCD").fadeToggle("fast", "linear");
      };

      $scope.showAndHideOperasi = function () {
        $("#contentOperasi").fadeToggle("fast", "linear");
      };

      $scope.showAndHideAnti = function () {
        $("#contentAnti").fadeToggle("fast", "linear");
      };

      $scope.showAndHideAntii = function () {
        $("#contentAntii").fadeToggle("fast", "linear");
      };

      $scope.showAndHideBio = function () {
        $("#contentBio").fadeToggle("fast", "linear");
      };

      $scope.showAndHideKeb = function () {
        $("#contentKeb").fadeToggle("fast", "linear");
      };

      $scope.showAndHideNutrisi = function () {
        $("#contentNutrisi").fadeToggle("fast", "linear");
      };

      $scope.showAndHidePengkajian = function () {
        $("#contentPengkajian").fadeToggle("fast", "linear");
      };

      $scope.listKesimpulan = [
        {
          id: 1,
          nama: "Skor Jatuh :",
          detail: [
            {
              id: 28,
              nama: "Resiko jatuh rendah (7-11)",
              type: "checkbox",
              grid: "grid_2",
            },
            {
              id: 29,
              nama: "Risiko Jatuh Tinggi (>12)",
              type: "checkbox",
              grid: "grid_2",
            },
            { id: 30, nama: "", type: "enter", grid: "grid_1" },

            {
              id: 31,
              nama: "Jika Skor > 12 Maka :",
              type: "label",
              grid: "grid_2",
            },
            {
              id: 32,
              nama: "Pasang Pin Kuning Pada Gelang",
              type: "checkbox",
              grid: "grid_2",
            },
            {
              id: 33,
              nama: "Lakukan Tindakan Pencegahan jatuh yang terdapat pada formulir MONITORING",
              type: "checkbox",
              grid: "grid_6",
            },
          ],
        },
      ];

      //421 diagnosa

      var getTotal = function (id) {
        var skorAwal = 0;
        if (id == "a") {
          $scope.arrNIPS.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor = skorAwal;
        } else if (id == "b") {
          $scope.arrNIPSb.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor2 = skorAwal;
        } else if (id == "c") {
          $scope.arrNIPSc.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor3 = skorAwal;
        } else if (id == "d") {
          $scope.arrNIPSd.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor4 = skorAwal;
        } else if (id == "e") {
          $scope.arrNIPSe.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor5 = skorAwal;
        } else if (id == "f") {
          $scope.arrNIPSf.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor6 = skorAwal;
        } else {
          $scope.arrNIPSg.forEach(function (data) {
            skorAwal += parseInt(data.descNilai);
          });
          $scope.totalSkor7 = skorAwal;
        }
      };
      $scope.arrNIPS = [];
      $scope.arrNIPSb = [];
      $scope.arrNIPSc = [];
      $scope.arrNIPSd = [];
      $scope.arrNIPSe = [];
      $scope.arrNIPSf = [];
      $scope.arrNIPSg = [];
      $scope.cekSkor = function (id, idparent, descnilai, value) {
        if (id == "a") {
          var result = $.grep($scope.arrNIPS, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPS.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPS.length; i++) {
              if ($scope.arrNIPS[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPS.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPS.push(tempData);
            }
          }
        } else if (id == "b") {
          var result = $.grep($scope.arrNIPSb, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSb.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSb.length; i++) {
              if ($scope.arrNIPSb[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSb.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSb.push(tempData);
            }
          }
        } else if (id == "c") {
          var result = $.grep($scope.arrNIPSc, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSc.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSc.length; i++) {
              if ($scope.arrNIPSc[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSc.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSc.push(tempData);
            }
          }
        } else if (id == "d") {
          var result = $.grep($scope.arrNIPSd, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSd.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSd.length; i++) {
              if ($scope.arrNIPSd[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSd.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSd.push(tempData);
            }
          }
        } else if (id == "e") {
          var result = $.grep($scope.arrNIPSe, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSe.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSe.length; i++) {
              if ($scope.arrNIPSe[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSe.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSe.push(tempData);
            }
          }
        } else if (id == "f") {
          var result = $.grep($scope.arrNIPSf, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSf.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSf.length; i++) {
              if ($scope.arrNIPSf[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSf.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSf.push(tempData);
            }
          }
        } else {
          var result = $.grep($scope.arrNIPSg, function (e) {
            return e.id == id;
          });
          var tempData = {
            id: id,
            idParent: idparent,
            descNilai: descnilai,
            value: value,
          };
          if (result.length == 0) {
            $scope.arrNIPSg.push(tempData);
          } else {
            var x = true;
            for (var i = 0; i < $scope.arrNIPSg.length; i++) {
              if ($scope.arrNIPSg[i].idParent === idparent) {
                // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                $scope.arrNIPSg.splice(i, 1);
                x = false;
                break;
              }
            }
            if (x == true) {
              $scope.arrNIPSg.push(tempData);
            }
          }
        }

        getTotal(id);
      };

      function init() {
        var objectfk = "FAURJPARSMD";
        var noregistrasifk = $state.params.noRec;
        var status = "t";
        medifirstService
          .get(
            "emr/get-data-rekam-medis?noregistrasifk=" +
              noregistrasifk +
              "&objectfk=" +
              objectfk +
              "&riwayatfk=" +
              $scope.noRecPap
          )
          .then(function (e) {
            $scope.dataEdukasi = e.data.data;
            debugger;
            if ($scope.dataEdukasi.length != 0) {
              for (var i = 0; i < $scope.dataEdukasi.length; i++) {
                var res = $scope.dataEdukasi[i].objectfk.substring(14);
                if ($scope.dataEdukasi[i].jenisobject == "checkbox") {
                  var chekedd = false;
                  if ($scope.dataEdukasi[i].nilai == "1") {
                    chekedd = true;
                  }
                  $scope.item.obj[res] = chekedd;
                  $scope.item.norecval[res] = $scope.dataEdukasi[i].norec;
                } else if ($scope.dataEdukasi[i].jenisobject == "combobox") {
                  if (res == 1) {
                    $scope.item.obj[res] = {
                      id: $scope.dataEdukasi[i].satuan,
                      namaruangan: $scope.dataEdukasi[i].nilai,
                    };
                  }

                  $scope.item.norecval[res] = $scope.dataEdukasi[i].norec;
                } else {
                  $scope.item.obj[res] = $scope.dataEdukasi[i].nilai;
                  $scope.item.norecval[res] = $scope.dataEdukasi[i].norec;
                }
              }
            }
          });
      }

      $scope.batalFRD = function () {
        ClearDataFRD();
        $scope.popUpFRD.close();
      };

      $scope.$watch("item.obj[422]", function (nilai) {
        if (nilai == undefined) return;
        nilai = parseInt(nilai);
        if (nilai >= 0 && nilai <= 1) {
          $scope.item.obj[114] = true;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 2 && nilai <= 3) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = true;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 4 && nilai <= 5) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = true;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 6 && nilai <= 7) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = true;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 8 && nilai <= 9) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = true;
          $scope.item.obj[119] = false;
        }

        if (nilai == 10) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = true;
        }
      });
      $scope.getSkalaNyeri = function (data, stat) {
        $scope.activeStatus = stat.descNilai;
        var nilai = stat.descNilai;
        if (nilai >= 0 && nilai <= 1) {
          $scope.item.obj[114] = true;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 2 && nilai <= 3) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = true;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 4 && nilai <= 5) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = true;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 6 && nilai <= 7) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = true;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = false;
        }
        if (nilai >= 8 && nilai <= 9) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = true;
          $scope.item.obj[119] = false;
        }

        if (nilai == 10) {
          $scope.item.obj[114] = false;
          $scope.item.obj[115] = false;
          $scope.item.obj[116] = false;
          $scope.item.obj[117] = false;
          $scope.item.obj[118] = false;
          $scope.item.obj[119] = true;
        }
      };

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format("DD-MMM-YYYY");
      };

      $scope.columnDaftar = {
        selectable: "row",
        pageable: true,
        columns: [
          {
            field: "tglsurveilans",
            title: "Tgl Input",
            width: "85px",
            template:
              "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>",
          },
          {
            field: "nosurvailens",
            title: "Id Surveilans",
            width: "85px",
          },
          {
            field: "nocmregis",
            title: "No RM / Noregistrasi",
            width: "120px",
          },
          {
            field: "namapasien",
            title: "Nama Pasien",
            width: "120px",
          },
          {
            field: "namaruangan",
            title: "Ruangan",
            width: "120px",
          },
        ],
      };

      $scope.back = function () {
        window.history.back();
      };

      $scope.Batal = function () {};

      $scope.formatRupiah = function (value, currency) {
        return (
          currency +
          " " +
          parseFloat(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        );
      };

      var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest();
          anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
              aCallback(anHttpRequest.responseText);
          };
          anHttpRequest.open("GET", aUrl, true);
          anHttpRequest.send(null);
        };
      };

      $scope.Simpan = function () {
        debugger;
        if ($state.params.noRec == undefined) {
          window.messageContainer.error("Pilih Pasien Dahulu!");
          return;
        }
        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];
        var tempData = [];
        for (var i = arrobj.length - 1; i >= 0; i--) {
          if (typeof $scope.item.obj[parseInt(arrobj[i])] === "string") {
            var nilai = $scope.item.obj[parseInt(arrobj[i])];
            var jenis = "textbox";
            var satuan = "-";
          } else if (
            typeof $scope.item.obj[parseInt(arrobj[i])] === "boolean"
          ) {
            var nilai = $scope.item.obj[parseInt(arrobj[i])];
            var jenis = "checkbox";
            var satuan = "-";
          } else {
            var nilai = $scope.item.obj[parseInt(arrobj[i])].namaruangan;
            var jenis = "combobox";
            var satuan = $scope.item.obj[parseInt(arrobj[i])].id;
          }
          var urutan = arrobj[i];
          var object = "FAURJPARSMD000" + urutan;
          // var norectmp = "FAURJPARSMD000"+urutan
          var tmpDataEdukasi = {
            norec: null,
            objectfk: object,
            nilai: nilai,
            satuan: satuan,
            jenisobject: jenis,
          };
          tempData.push(tmpDataEdukasi);
        }
        debugger;

        for (var i = tempData.length - 1; i >= 0; i--) {
          if (tempData[i].nilai == undefined) {
            tempData.splice([i], 1);
          }
          if (tempData[i].norec == undefined) {
            tempData[i].norec = "-";
          }
        }

        var jsonSave = {
          data: tempData,
          noregistrasifk: $state.params.noRec,
          riwayatpapfk: $scope.noRecPap,
          objecthead: "FAURJPARSMD",
        };
        medifirstService
          .post("emr/save-data-rekam-medis", jsonSave)
          .then(function (e) {
            $scope.currentStatus = [];
            // MedifirstService.post('Pengkajian Keperawatan', 'Norec Antrian Pasien Diperiksa', $state.params.noRec, 'Pengkajian Keperawatan Kupang').then(function(res) {})
          });
      };

      $scope.Batal = function () {
        ClearAll();
        $scope.myVar = 1;
      };

      $scope.klikChange = function (data, stat) {
        // $scope.pasienDewasa.perluKonsultasi.detail.forEach(function(items){
        // 	items.value = null
        // })
        // stat.value = "true";
        var result = $.grep($scope.arrPengkajianSkrining, function (e) {
          return e.idParent == data.id;
        });
        var tempData = {
          id: stat.id,
          idParent: data.id,
          descNilai: stat.descNilai,
          namaDetail: stat.namaDetail,
          value: "true",
        };
        if (result.length == 0) {
          $scope.arrPengkajianSkrining.push(tempData);
          // console.log(JSON.stringify($scope.arrayDetilPengkajianAwal));
        } else {
          for (var i = 0; i < $scope.arrPengkajianSkrining.length; i++)
            if (
              $scope.arrPengkajianSkrining[i].idParent &&
              $scope.arrPengkajianSkrining[i].idParent === data.id
            ) {
              $scope.arrPengkajianSkrining.splice(i, 1);
              break;
            }
          $scope.arrPengkajianSkrining.push(tempData);
          console.log(JSON.stringify($scope.arrPengkajianSkrining));
        }
      };

      //***********************************
    },
  ]);
});
