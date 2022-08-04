define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarPembayaranCtrl', ['$state', '$mdDialog', '$scope', 'CacheHelper','DateHelper', 'MedifirstService',
    function ($state, $mdDialog, $scope, cacheHelper, dateHelper, medifirstService) {
      $scope.isRouteLoading = false;
      $scope.now = new Date();
      $scope.item = {};
      $scope.dataSbnSelected = {};
      $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
      $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
      var pegawaiUser = [];
      LoadCache();

      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarPembayaranCtrl');
        if (chacePeriode != undefined) {
          $scope.item.tglawal = new Date(chacePeriode[0]);
          $scope.item.tglakhir = new Date(chacePeriode[1]);
          loadCombo()
          loadData();
        } else {
          $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
          $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
          loadCombo()
          loadData();
        }
      }

      function loadCombo() {
        medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
          $scope.listKasir = data;
        });        

        medifirstService.get('bendaharapengeluaran/get-data-combo').then(function (dat) {         
          $scope.listCaraBayar = dat.data.carabayar;
          pegawaiUser = medifirstService.getUserLogin();
          if (pegawaiUser.namalengkap == 'Administrator') {
            $scope.item.Kasir = undefined;
          } else {
            $scope.item.Kasir = { id: pegawaiUser.id, namalengkap: pegawaiUser.namalengkap };
          }
        });
      }


      function loadData() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:MM');
        var chacePeriode = tglAwal + "~" + tglAkhir
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);

        var Skasir = "";
        if ($scope.item.kasir != undefined) {
          Skasir = $scope.item.kasir.id;
        }

        var ScaraBayar = "";
        if ($scope.item.caraBayar != undefined) {
          ScaraBayar = $scope.item.caraBayar.id;
        }

        var noSbk = "";
        if ($scope.item.noSBK == undefined) {
          noSbk = $scope.item.noSBK;
        }

        medifirstService.get("bendaharapengeluaran/get-daftar-pembayaran?" +
          "tglAwal=" + tglAwal +
          "&tglAkhir=" + tglAkhir +
          "&Skasir=" + Skasir +
          "&ScaraBayar=" + ScaraBayar +
          "&noSbk=" + noSbk, true).then(function (dat) {
            $scope.isRouteLoading = false;
            var SubTotal = 0;
            for (var i = 0; i < dat.data.daftar.length; i++) {
              dat.data.daftar[i].no = i + 1
              SubTotal = SubTotal + parseInt(dat.data.daftar[i].totaldibayar)
            }

            $scope.dataDaftarPenerimaan = dat.data.daftar;
            pegawaiUser = dat.data.datalogin
            $scope.totalPenerimaan = 'Rp. ' + parseFloat(SubTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: '',
          3: '',
          4: '',
          5: '',
          6: ''
        }
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);
      }

      $scope.columnDaftarPenerimaan = [
        {
          "field": "nosbk",
          "title": "no SBK",
          "template": "<span class='style-center'>#: nosbk #</span>",
          "width": "120px"
        },
        {
          "field": "tglsbk",
          "title": "Tanggal",
          "template": "<span class='style-right'>{{formatTanggal('#: tglsbk #', '')}}</span>",
          "width": "120px"
        },
        // {
        //   "field": "keteranganLainnya",
        //   "title": "Keterangan",
        //   "template": "<span class='style-left'>#: keteranganLainnya #</span>",
        //   "width":"300px"
        // },
        {
          "field": "totaldibayar",
          "title": "Total Dibayar",
          "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
          "width": "200px"

        },
        {
          "field": "namalengkap",
          "title": "Kasir",
          "template": "<span class='style-center'>#: namalengkap #</span>",
          "width": "200px"
        }
      ];

      $scope.Cetak = function () {
        if ($scope.dataSbnSelected.noSbm == undefined) {

          var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
            "transaksi belum dipilih", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        } else {
          var obj = {
            noRegistrasi: [$scope.dataSbnSelected.noSbm],
            backPage: "DaftarPenerimaanKasir"
          }

          $state.go("CetakDokumenKasir", {
            dataPasien: JSON.stringify(obj)
          });
        }
      }

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.SearchData = function () {
        loadData();
      }

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD/MM/YYYY HH:mm');
      }
      ////////////////////////////////////////////////////////    END       /////////////////////////////////////////////////////////////////
    }
  ]);
});