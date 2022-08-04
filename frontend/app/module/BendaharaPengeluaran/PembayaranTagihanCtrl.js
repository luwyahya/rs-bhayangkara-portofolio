define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('PembayaranTagihanCtrl', ['CacheHelper', '$scope', '$state', 'MedifirstService',
    function (cacheHelper, $scope, $state, medifirstService) {

      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.saveShow = true;
      $scope.item = {};
      $scope.item.tglBayar = $scope.now;
      $scope.show1 = false;
      $scope.show2 = false;
      var tagihan = 0;
      var noRECC = "";
      var judul = "";
      var dariSini = "";
      var nosbk = "";
      var sisautang = 0;
      LoadCombo();

      $scope.$watch('item.caraBayar', function (newValue, oldValue) {
        if (newValue != undefined && newValue.caraBayar == "TUNAI") {
          $scope.show1 = false;
          $scope.show2 = false;
        }
        else {
          $scope.show1 = true;
          $scope.show2 = true;
        }
      });

      if ($state.params.noTerima !== "") {        
        var chacePeriode = cacheHelper.get('PembayaranTagihan');
        if (chacePeriode != undefined) {
          var arrPeriode = chacePeriode.split('#');
          $scope.item.deskripsiTransaksi = arrPeriode[1];
          noRECC = arrPeriode[5];
          $scope.item.subTotal = "Rp. " + parseFloat(arrPeriode[6]).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");//arrPeriode[6];
          medifirstService.get("sysadmin/general/get-terbilang/" + arrPeriode[6]).then(
            function (dat) {
              $scope.item.terbilang = dat.data.terbilang;
            })
          tagihan = parseFloat(arrPeriode[6]);
          sisautang = parseFloat(arrPeriode[6]);
          judul = arrPeriode[7]
          dariSini = arrPeriode[8]
        }
      }

      function LoadCombo() {
        medifirstService.get("bendaharapengeluaran/get-data-combo", true).then(function (dat) {
          var datas = dat.data;
          $scope.listDataCaraBayar = datas.carabayar;
          $scope.item.caraBayar = { "id": 1, "caraBayar": "TUNAI" }
          $scope.listUraianTransaksi = datas.kelompoktransaksi;
          if (judul == "PembayaranTagihanSuplier") {
            $scope.item.uraianTransaksi = { "id": 107, "kelompokTransaksi": "PEMBAYARAN TAGIHAN SUPLIER" }
            $scope.pororo = true;
          }
        });
      }

      $scope.$watch('item.totalBayar', function (newValue, oldValue) {
        if (newValue != "") {
          medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
            function (dat) {
              $scope.item.tebilangBayar = dat.data.terbilang;
            })
        }
      });

      $scope.Back = function () {
        if (dariSini == "DaftarPenjualanApotekKasir/keluarUmum") {
          $state.go("DaftarPenjualanApotekKasir", { dataFilter: "keluarUmum" });
        } else {
          $state.go(dariSini)
        }

      }

      $scope.Bayar = function () {
        if ($scope.item.caraBayar == undefined) {
          alert("Cara Bayar belum dipilih!");
          return;
        }
        if ($scope.item.uraianTransaksi == undefined) {
          alert("uraian Transaksi belum dipilih!");
          return;
        }
        if ($scope.item.totalBayar == undefined || $scope.item.totalBayar == "" || $scope.item.totalBayar == 0) {
          alert("Total Bayar belum diisi!");
          return;
        }

        var namaBankRkn = ""
        if ($scope.item.namaBankRkn != undefined) {
          namaBankRkn = $scope.item.namaBankRkn
        }

        var noRekeningRkn = ""
        if ($scope.item.noRekeningRkn != undefined) {
          noRekeningRkn = $scope.item.noRekeningRkn
        }

        var namaPemilikRekeningRkn = ""
        if ($scope.item.namaPemilikRekeningRkn != undefined) {
          namaPemilikRekeningRkn = $scope.item.namaPemilikRekeningRkn
        }

        var namaBank = ""
        if ($scope.item.namaBank != undefined) {
          namaBank = $scope.item.namaBank
        }

        var noRekening = ""
        if ($scope.item.noRekening != undefined) {
          noRekeningRkn = $scope.item.noRekening
        }

        var namaPemilikRekening = ""
        if ($scope.item.namaPemilikRekening != undefined) {
          namaPemilikRekeningRkn = $scope.item.namaPemilikRekening
        }

        var sbk = {
          nosbk: nosbk,
          carabayar: $scope.item.caraBayar.id,
          kelompoktransaksi: $scope.item.uraianTransaksi.id,
          keteranganlainnya: $scope.item.deskripsiTransaksi,
          tagihan: tagihan,
          totalbayar: parseFloat($scope.item.totalBayar),
          tglsbk: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
          bankrekanan: namaBankRkn,
          rekeningrekanan: noRekeningRkn,
          pemilikrekanan: namaPemilikRekeningRkn,
          bank: namaBank,
          rekening: noRekening,
          pemilik: namaPemilikRekening,
          sisautang: sisautang,
          nostruk: noRECC,
          keterangan: $scope.item.deskripsiTransaksi
        }

        var objSave = {
          sbk: sbk
        }

        medifirstService.post('bendaharapengeluaran/save-pembayaran-tagihan-suplier', objSave).then(function (e) {
          $scope.saveShow = false;
          window.history.back();
        })
      }
      ///////////////////////// -TAMAT- //////////////////////////
    }
  ]);
});