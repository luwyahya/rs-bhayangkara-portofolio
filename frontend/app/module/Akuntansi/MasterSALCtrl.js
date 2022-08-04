define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterSALCtrl', ['$q', '$scope', 'MedifirstService', '$timeout',
        function ($q, $scope, medifirstService, $timeout) {
            $scope.isRouteLoading = false;
            $scope.cari = {};
            $scope.item = {};
            var Norec = "";
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            LoadData();

            function LoadData() {
                $scope.isRouteLoading = true;
                var uu = undefined
                if ($scope.cari.Uraian != undefined) {
                    uu = "&Uraian=" + $scope.cari.Uraian
                }

                var th = ""
                if ($scope.cari.tahun != undefined) {
                    var th = "&Tahun=" + moment($scope.cari.tahun).format('YYYY')
                }

                medifirstService.get("akuntansi/get-data-sal?" + uu + th, true).then(function (dat) {
                    $scope.isRouteLoading = false;                    
                    var data2 = dat.data.data
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1                        
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data2,                        
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });                    
                });
            }

            $scope.cariFilter = function(){
                LoadData();
            }
            
            $scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

            $scope.daftarMasterOpt = {
                pageable: true,
                scrollable: true,
                columns: [
                    { 
                        field: "no", 
                        title: "No", 
                        width: 35 
                    },
                    { 
                        field: "uraian", 
                        title: "Uraian", 
                        width: 250 
                    },
                    { 
                        field: "tahun", 
                        title: "Tahun", 
                        width: 80 
                    },
                    { 
                        field: "nilaiuang", 
                        title: "Nominal", 
                        width: 100,
                        "template": "<span class='style-right'>{{formatRupiah('#: nilaiuang #', 'Rp.')}}</span>",
                    },
                ],
            };

            $scope.klik = function (modelGrid) {
                if (modelGrid != undefined) {
                    $scope.modelGrid = modelGrid
                }
            }

            $scope.tambah = function () {
                $scope.item = {}
                $scope.dialogPopup.center().open()
            }

            $scope.simpan = function () {
                if ($scope.item.Uraian == undefined) {
                    toastr.error("Uraian Tidak Boleh Kosong");
                    return;
                }
                if ($scope.item.Tahun == undefined) {
                    toastr.error("Tahun Tidak Boleh Kosong");
                    return;
                }
                if ($scope.item.Nilai == undefined) {
                    toastr.error("Nilai Tidak Boleh Kosong");
                    return;
                }

                var objSave = {
                    norec: Norec,
                    uraian: $scope.item.Uraian,
                    tahun: moment($scope.item.Tahun).format('YYYY'),
                    nilaiuang: parseFloat($scope.item.Nilai),
                }

                medifirstService.post('akuntansi/save-data-sal', objSave).then(function (e) {
                    $scope.item = {};
                    $scope.dialogPopup.close();
                    LoadData();
                });
            }

            $scope.Batal = function () {
                $scope.item = {};
            }

            $scope.Edit = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error("Data Belum Dipilih")
                    return;
                }
                Norec = $scope.modelGrid.norec;
                $scope.item.Uraian = $scope.modelGrid.uraian;
                $scope.item.Tahun = moment($scope.modelGrid.tahun).format('YYYY');
                $scope.item.Nilai = parseFloat($scope.modelGrid.nilaiuang);
                $scope.dialogPopup.center().open()
            }

            $scope.hapus = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('pilih data dulu')
                    return
                }
                var item = {
                    norec: $scope.modelGrid.norec
                }
                medifirstService.post('akuntansi/delete-data-sal', item).then(function (e) {
                    LoadData();
                    $scope.modelGrid = undefined
                });
            }

            //** BATAS SUCI */
        }
    ]);
});