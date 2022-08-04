define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarInformasiPasienPulangCtrl', ['CacheHelper', '$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'MedifirstService',
    function (cacheHelper, $mdDialog, $timeout, $state, $q, $rootScope, $scope, medifirstService) {
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.item = {};
      $scope.isRouteLoading = false;
      $scope.showBtnBayar = false
      $scope.dataPasienSelected = {};
      $scope.norecSpLast = ''
      $scope.isSelesaiPeriksa = false
      var dataLogin = {};
      $scope.item.jmlRows = 10
      LoadCombo();
      LoadCache();
      showButton();

      function showButton() {
        $scope.showBtnDetail = true;
        $scope.showBtnCetak = false;
        $scope.showBtnVerifikasi = true;
        $scope.showBtnUbahJenis = true;
        $scope.showBtnUnVerifikasi = true;
        $scope.showBtnBatalPulang = true;
        $scope.showBtnRekap = true

      }
                 
      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarInformasiPasienPulangCtrl');
        if (chacePeriode != undefined) {
          $scope.item.tanggalRegistrasiAwal = new Date(chacePeriode[0]);
          $scope.item.tanggalRegistrasiAkhir = new Date(chacePeriode[1]);
          $scope.item.status = chacePeriode[2]
          $scope.item.namaOrReg = chacePeriode[3]

          if (chacePeriode[6] != undefined) {
            $scope.listDepartemen = [chacePeriode[6]]
            $scope.item.instalasi = chacePeriode[6]
          }
          if (chacePeriode[5] != undefined) {
            $scope.listRuangan = [chacePeriode[5]]
            $scope.item.ruangan = chacePeriode[5]
          }
          if (chacePeriode[4] != undefined) {
            // LoadData()
            $scope.item.noReg = chacePeriode[4]
          }
          if (chacePeriode[7] != undefined) {
            // LoadData()
            $scope.item.noRm = chacePeriode[7]
          }
          if (chacePeriode[8] != undefined) {
            // LoadData()
            $scope.item.jmlRows = chacePeriode[8]
          }
        }
        else {
          $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'))
          $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
          LoadData()
        }
      }

      $scope.getIsiComboRuangan = function () {
        $scope.listRuangan = $scope.item.instalasi.ruangan
      }

      function LoadCombo() {
        medifirstService.get("humas/get-daftar-combo", false).then(function (data) {
          $scope.listDepartemen = data.data.datadept;
          $scope.listKelompokPasien = data.data.kelompokpasien;
          dataLogin = data.data.pegawaiuser[0];
        })       
        $scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Belum Verifikasi" }, { "id": "3", "namaExternal": "Verifikasi" }, { "id": "4", "namaExternal": "Lunas" }]
      };

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY');
      }
      $scope.formatTanggalJam = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY HH:mm');
      }      

      $scope.columnPasienPulang = [
        {
          "field": "no",
          "title": "No",
          "width": "45px"
        },
        {
          "field": "tanggalMasuk",
          "title": "Tanggal Masuk",
          "width": "80px",
          "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalMasuk #')}}</span>"
        },
        {
          "field": "noCm",
          "title": "No.RM",
          "width": "50px",
          "template": "<span class='style-center'>#: noCm #</span>"
        },
        {
          "field": "noRegistrasi",
          "title": "No. Registrasi",
          "width": "60px",
          "template": "<span class='style-center'>#: noRegistrasi #</span>"
        },
        {
          "field": "namaPasien",
          "title": "Nama",
          "width": "120px"
        },
        {
          "field": "notelepon",
          "title": "Telp",
          "width": "150px",
          "template": "<span class='style-left'>#: notelepon #</span>"
        },
        {
          "field": "alamatlengkap",
          "title": "Alamat",
          "width": "150px",
          "template": "<span class='style-left'>#: alamatlengkap #</span>"
        },
        {
          "field": "jenisAsuransi",
          "title": "Jenis Pasien",
          "width": "100px",
          "template": "<span class='style-center'>#: jenisAsuransi #</span>"
        },
        {
          "field": "namaRuangan",
          "title": "Ruangan",
          "width": "120px"
        },
        {
          "field": "departemen",
          "title": "Departemen",
          "width": "120px",
          "template": "<span class='style-left'>#: departemen #</span>"
        },
        {
          "field": "tanggalPulang",
          "title": "Tanggal Pulang",
          "width": "80px",
          "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalPulang #')}}</span>"
        },
        {
          "field": "status",
          "title": "Status",
          "width": "70px",
          "template": "<span class='style-center'>#: status #</span>"
        },        
      ];
      
      $scope.Perbaharui = function () {
        $scope.ClearSearch();
      }
      
      $scope.ClearSearch = function () {
        $scope.item = {};
        $scope.item.ruangan = {};
        $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
        $scope.SearchData();
      }

      $scope.SearchData = function () {
        LoadData()
      }

      function LoadData() {

        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noReg != undefined) {
          tempNoReg = $scope.item.noReg;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal }
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasi != undefined) {
          tempInstalasiId = $scope.item.instalasi.id;
          tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
        }
        var tempNoRm = "";
        if ($scope.item.noRm != undefined) {
          tempNoRm = $scope.item.noRm;
        }
        var jmlRow = ""
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows
        }
        var kelompokPasienId = ""
        if ($scope.item.kelompokpasien != undefined) {
          kelompokPasienId = $scope.item.kelompokpasien.id
        }
        
        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempStatusArr,
          3: tempNamaOrReg,
          4: tempNoReg,
          5: tempRuanganIdArr,
          6: tempInstalasiIdArr,
          7: tempNoRm,
          8: jmlRow
        }
        cacheHelper.set('DaftarInformasiPasienPulangCtrl', chacePeriode);

        medifirstService.get("humas/get-data-informasi-pasien-pulang?"
          + "namaPasien=" + tempNamaOrReg
          + "&ruanganId=" + tempRuanganId
          + "&status=" + tempStatus
          + "&tglAwal=" + tglAwal
          + "&tglAkhir=" + tglAkhir
          + "&noReg=" + tempNoReg
          + "&instalasiId=" + tempInstalasiId
          + "&noRm=" + tempNoRm
          + "&jmlRows=" + jmlRow
          + "&kelompokPasienId=" + kelompokPasienId)
          .then(function (data) {         
            var data = data.data;   
            $scope.isRouteLoading = false;
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              element.no = i + 1;
            }
            $scope.dataPasienPulang = new kendo.data.DataSource({
              data: data,
              pageSize: 200,
              total: data.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                  }
                }
              }
            });
          });
      };      
///////////////////////////////////////////////////////////////////////     END     //////////////////////////////////////////////////////////////
    }
  ]);
});