define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarDistribusiBarangInvestasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.bukanLogistik = true;
            $scope.now = new Date();
            $scope.item = {};
            // LoadCache();
            LoadDataCombo();

            function LoadDataCombo() {
                var DataRuanganAll = [];
                var chacePeriode = cacheHelper.get('DaftarDistribusiBarangInvestasiCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                } else {

                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                }

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.sourceDetailJenis = dataCombo.detailjenisproduk
                });
                medifirstService.get("sysadmin/general/get-combo-ruangan-general").then(function (dat) {
                    $scope.sourceRuangan = dat.data.ruangan;
                });
                LoadData();
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&ruangancurrenfk=" + $scope.item.ruangan.id
                }
                var ruanganAsal = "";
                if ($scope.item.ruanganAsal != undefined) {
                    ruanganAsal = "&ruanganasalfk=" + $scope.item.ruanganAsal.id
                }
                var kdDetailJenis = "";
                if ($scope.item.DetailJenis != undefined) {
                    kdDetailJenis = "&kdDetailJenis=" + $scope.item.DetailJenis.id;
                }
                var namaproduk = "";
                if ($scope.item.NamaProduk != undefined) {
                    namaproduk = "&namaproduk=" + $scope.item.NamaProduk;
                }
                medifirstService.get("logistik/get-daftar-distribusi-barang-aset?"
                    + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganAsal + ruanganId + kdDetailJenis + namaproduk, true).then(function (dat) {
                        //debugger
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }

                        $scope.sourceBarang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('DaftarDistribusiBarangInvestasiCtrl', chacePeriode);

                    });
            };

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "50px",
                },
                {
                    "field": "tglkirim",
                    "title": "Tanggal"
                },
                {
                    "field": "noregisteraset",
                    "title": "No Aset"
                },
                {
                    "field": "nokirim",
                    "title": "No Kirim"
                },                
                {
                    "field": "ruanganpengirim",
                    "title": "Ruangan Asal"
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang"
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty Asset"
                }
            ]
            $scope.Search = function () {
                // if ($scope.item.ruangan == undefined) {
                //     alert('Pilih Ruangan terlebih dahulu!!!')
                // }
                LoadData();
                // var ruanganId, awal, akhir, periode;
                // if ($scope.item.ruangan !== undefined) {
                //     ruanganId = $scope.item.ruangan.id;
                // }else {
                //     ruanganId = '';
                // }
                // if (!$scope.item.awal !== undefined) {
                //     awal = DateHelper.getPeriodeFormatted($scope.item.awal);
                // }else {
                //     awal = '';
                // }
                // if (!$scope.item.akhir !== undefined) {
                //     akhir = DateHelper.getPeriodeFormatted($scope.item.akhir);
                // }else {
                //     akhir = '';
                // }
                // periode = "&periodeAwal=" + awal + "&periodeAhir=" + akhir;

                // manageSarpras.getListAset(ruanganId, awal, akhir).then(function(dat) {
                //     $scope.sourceBarang = new kendo.data.DataSource({
                //         data: dat.data.data
                //     });
                ////debugger;
                // });
            };

            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }

            $scope.DetailAsset = function () {
                //debugger;
                if ($scope.dataSelected == undefined) {
                    alert("Data Asset Belum Dipilih!!")
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'InputDetailAsset',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('MasterBarangInvestasiCtrl', chacePeriode);
                $state.go('MasterBarangInvestasi');
            }

            $scope.KirimAsset = function () {
                debugger;
                if ($scope.dataSelected == undefined) {
                    alert("Data Asset Belum Dipilih!!")
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'KirimBarangAsset',
                    2: $scope.dataSelected.noregisteraset,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangAsetCtrl', chacePeriode);
                $state.go('KirimBarangAset');
            }

            $scope.getIsiComboRuangan = function () {
                $scope.sourceRuangan = $scope.item.departemen.ruangan
            }
        }
    ])
})