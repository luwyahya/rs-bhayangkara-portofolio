define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarPasienPulangKasirCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.item = {};
      $scope.item.periodeAwal = new Date();
      $scope.item.periodeAkhir = new Date();
      $scope.dataPasienSelected = {};
      $scope.isRouteLoading = false;      
      $scope.istempatLaporan = true;
      $scope.istempatLaporan2 = true;
      loadCombo();
      loadData();

      function loadCombo() {
        var chacePeriode = cacheHelper.get('DaftarPasienPulangKasir');
        if (chacePeriode != undefined) {
          var arrPeriode = chacePeriode.split('~');
          $scope.item.periodeAwal = new Date(arrPeriode[0]);
          $scope.item.periodeAkhir = new Date(arrPeriode[1]);
        } else {
          $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'))
          $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
        }

        medifirstService.get("kasir/get-data-combo-kasir").then(function (data) {
          $scope.listRuangan = data.ruangan;
          $scope.listKelompokPasien = data.kelompokpasien;
          var dataPegawai = data.datapegawai;
          if (dataPegawai != undefined) {
            $scope.NamaKasir = dataPegawai.namalengkap;
          } else {
            $scope.NamaKasir = "";
          }
        })      
        $scope.listStatus = [{id:1, namaExternal:"Lunas"},{id:2, namaExternal:"Belum Bayar"} ]
      }

      // $q.all([
      // 	//medifirstService.getDataTableTransaksi("kasir/daftar-tagihan-pasien?namaPasien="+ dataHelper.isUndefinedField($scope.item.nama) +"&noReg=" + dataHelper.isUndefinedField($scope.item.noReg) + "&status=" + dataHelper.isUndefinedObjectField($scope.item.status) +"&tglAwal="+ dateHelper.getTanggalFormattedNew($scope.item.periodeAwal)  +"&tglAkhir="+ dateHelper.getTanggalFormattedNew($scope.item.periodeAwal)  + "&ruanganId="+dataHelper.isUndefinedObjectField($scope.item.ruangan)),
      // 	medifirstService.getDataGeneric("ruangan", false),
      // 	medifirstService.getDataTableTransaksi("akuntansi/mapping-coa/get-penjamin-list?sort=namaRekanan:asc")
      //          ]).then(function(data) {
      //              if (data[0].statResponse){
      //              	$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
      // 			data: data[0],
      // 			pageSize: 10,
      // 			total: data[0].length,
      // 			serverPaging: false,
      // 			schema:  {
      //                 model: {
      //                    fields: {
      //                        tglMasuk: { type: "date" },
      //                        tglPulang: { type: "date" }
      //                            }
      //                       }
      //                }  
      // 		});
      //              }

      //              if (data[0].statResponse)
      //              {
      //              	$scope.listRuangan = data[0]
      //              	$scope.listRuangan.push({namaExternal:""});
      //              }

      //              if (data[1].statResponse)
      //              {
      //              	$scope.listPenjamin = data[1]
      //              }

      //              $scope.listStatus = manageKasir.getStatus();

      //              var chacePeriode = cacheHelper.get('DaftarPasienPulangKasir');
      // 	if(chacePeriode != undefined){
      // 		var arrPeriode = chacePeriode.split(':');
      // 		$scope.item.periodeAwal = new Date(arrPeriode[0]);
      // 		$scope.item.periodeAkhir = new Date(arrPeriode[1]);
      //              }
      //              else
      //              {
      //              	$scope.item.periodeAwal = $scope.now;
      // 		$scope.item.periodeAkhir = $scope.now;
      //              }
      // 	//$timeout($scope.SearchData, 500);
      //              $scope.SearchData();
      //          });

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY');
      }

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.columnDaftarPasienPulang = [
        {
          "field": "tglMasuk",
          "title": "Tanggal Masuk",
          "width": "100px",
          "template": "<span class='style-left'>{{formatTanggal('#: tglMasuk #')}}</span>"
        },
        {
          "field": "tglPulang",
          "title": "Tanggal Pulang",
          "width": "100px",
          "template": "<span class='style-left'>{{formatTanggal('#: tglPulang #')}}</span>"
        },
        {
          "field": "noCm",
          "title": "No RM",
          "width": "100px",
          "template": "<span class='style-center'>#: noCm #</span>"
        },
        {
          "field": "noRegistrasi",
          "title": "No Reg",
          "width": "100px",
          "template": "<span class='style-center'>#: noRegistrasi #</span>"
        },
        {
          "field": "namaPasien",
          "title": "Nama Pasien",
          "width": "200px",
          "template": "<span class='style-left'>#: namaPasien #</span>"
        },
        {
          "field": "jenisPasien",
          "title": "Tipe Pasien",
          "width": "200px",
          "template": "<span class='style-left'>#: jenisPasien #</span>"
        },
        {
          "field": "lastRuangan",
          "title": "Ruangan",
          "width": "250px",
          "template": "<span class='style-left'>#: lastRuangan #</span>"
        },
        {
          "field": "totalBayar",
          "title": "Total Bayar",
          "width": "150px",
          "template": "<span class='style-right'>{{formatRupiah('#: totalBayar #', 'Rp.')}}</span>"
        },
        {
          "field": "statusBayar",
          "title": "Status",
          "width": "150px",
          "template": "<span class='style-center'>#: statusBayar #</span>"
        }
      ];

      $scope.Cetak = function () {
        if ($scope.dataPasienSelected.statusBayar == "Belum Bayar") {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Pasien belum melakukan pembayaran", "Ok");
          $mdDialog.show(alertDialog).then(function () { });
        } else {
          $scope.changePage("CetakDokumenKasir");
        }
      }

      $scope.SearchEnter = function () {
                loadData()
            }

      var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest();
          anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
              aCallback(anHttpRequest.responseText);
          }
          anHttpRequest.open("GET", aUrl, true);
          anHttpRequest.send(null);
        }
      }

      $scope.CetakKwitansiLayanan = function () {
        if ($scope.dataPasienSelected == undefined) {
          toast.warning('Data Belum Dipilih, Peringatan!!!')
          return
        }
        var stt = 'false'
        if (confirm('View Kwitansi Layanan? ')) {
          // Save it!
          stt = 'true';
        } else {
          // Do nothing!
          stt = 'false'
        }
        var client = new HttpClient();
        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataPasienSelected.noRec + '&strKeterangan=-' + '&strIdPegawai=' + $scope.NamaKasir + '&strIdRuangan=-&view=' + stt, function (response) {
          // do something with response
        });
      }

      $scope.KembaliDeposit = function () {
        if (parseFloat($scope.dataPasienSelected.totalBayar) > 0) {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Tidak ada pengembalian deposit.", "Ok");
          $mdDialog.show(alertDialog).then(function () { });
          return
        }
        if ($scope.dataPasienSelected.statusBayar == "Lunas") {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Pasien sudah melakukan pembayaran", "Ok");
          $mdDialog.show(alertDialog).then(function () { });
        } else {
          $scope.changePage("PembayaranKembaliDepositKasir");
        }
      }

      $scope.BayarTagihan = function () {
        if ($scope.dataPasienSelected.totalBayar < 0) {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Tidak dapat bayar untuk total tagihan minus.", "Ok");
          $mdDialog.show(alertDialog).then(function () { });
          return
        }
        if ($scope.dataPasienSelected.statusBayar == "Lunas") {

          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Pasien sudah melakukan pembayaran", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        } else {
          $scope.changePage("PembayaranTagihanLayananKasir");
        }
      }

      $scope.Perbaharui = function () {
        $scope.ClearSearch();
      }

      $scope.DetailBiaya = function () {
        $scope.changePage2("RincianTagihan");
      }

      $scope.changePage2 = function (stateName) {
        if ($scope.dataPasienSelected.noRec != undefined) {
          var obj = {
            noRegistrasi: $scope.dataPasienSelected.noRegistrasi
          }

          $state.go(stateName, {
            dataPasien: JSON.stringify(obj)
          });
        } else {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Silahkan pilih data pasien terlebih dahulu", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        }
      }

      $scope.changePage = function (stateName) {
        if ($scope.dataPasienSelected.noRec != undefined) {
          var obj = {
            noRegistrasi: $scope.dataPasienSelected.noRec
          }

          $state.go(stateName, {
            dataPasien: JSON.stringify(obj)
          });
        } else {
          var alertDialog = medifirstService.showAlertDialog("Informasi",
            "Silahkan pilih data pasien terlebih dahulu", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        }
      }

      function checkValue(obj, param) {
        var res = "";
        var data = undefined;

        if (param.length > 1) {
          if (obj[param[0]] != undefined)
            data = obj[param[0]][param[1]];
        }
        else {
          data = obj[param[0]];
        }

        if (data != undefined)
          var res = data;

        return res;
      }

      function isInt(value) {
        var er = /^-?[0-9]+$/;
        return er.test(value);
      }

      //fungsi clear kriteria search
      $scope.ClearSearch = function () {
        $scope.item = {};
        $scope.item.periodeAwal = $scope.now;
        $scope.item.periodeAkhir = $scope.now;
        $scope.item.ruangan = { namaExternal: "" };
        $scope.SearchData();
      }

      //fungsi search data
      $scope.SearchData = function () {
        loadData()
      }

      function loadData() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');
        if ($scope.item.nama == undefined) {
          var nm = ""
        } else {
          var nm = "namaPasien=" + $scope.item.nama
        }
        if ($scope.item.KelompokPasien == undefined) {
          var kl = ""
        } else {
          var kl = "&kelompokPasienId=" + $scope.item.KelompokPasien.id
        }
        if ($scope.item.ruangan == undefined) {
          var rg = ""
        } else {
          var rg = "&ruanganId=" + $scope.item.ruangan.id
        }
        if ($scope.item.noReg == undefined) {
          var reg = ""
        } else {
          var reg = "&noReg=" + $scope.item.noReg
        }

        if ($scope.item.status == undefined) {
          var st = ""
        } else {
          var st = "&status=" + $scope.item.status.namaExternal
        }

        if ($scope.item.noRm == undefined) {
          var noRm = ""
        } else {
          var noRm = "&noRm=" + $scope.item.noRm
        }

        $q.all([
          medifirstService.get("kasir/daftar-tagihan-pasien?"
            + nm + reg + st + kl + "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + rg + noRm),]).then(function (data) {              
              if (data[0].statResponse) {
                $scope.isRouteLoading = false;
                $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                  data: data[0].data,
                  pageSize: 10,
                  total: data[0].data.length,
                  serverPaging: false,
                  schema: {
                    model: {
                      fields: {
                        tglMasuk: { type: "date" },
                        tglPulang: { type: "date" }
                      }
                    }
                  }
                });
              }
              var chacePeriode = tglAwal + "~" + tglAkhir;
              cacheHelper.set('DaftarPasienPulangKasir', chacePeriode);
            });
      };
    }
  ]);
});