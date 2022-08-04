define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL51PengunjungRumahSakitCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {
                tglawal : $scope.now,
                tglakhir     : $scope.now,
            };
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.CariRegistrasiPasien = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }


            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRl51Ctrl', chacePeriode);

                   medifirstService.get("registrasi/laporan/get-laporan-rl51?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    var data = data.data
                    $scope.ambildataexcel = data.data;
                    $scope.panggil($scope.ambildataexcel);
                    $scope.dataRL51 = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });


                })
            }

            $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Laporan Register Penomoran Pasien.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    pageable: true,
                    resizable: true,
                    columnMenu: true,
                    columns: [
                        {
                            title: "Jumlah Pasien",
                            field: "jumlah"
                        },
                        {
                            title: "Status Pasien",
                            field: "statuspasien"
                        }
                    ]
                })
            };

            $scope.panggil();

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            
            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {
           
                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listPasien = dat.data.kelompokpasien;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
            });
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnRL51 = [

                {
                    field: "",
                    title: "Jenis Kegiatan",
                    columns: [
                        {
                            "title": "Kunjungan Baru"
                        }
                    ]
                },
                {
                    field: "",
                    title: "Jumlah"
                }
            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariRegistrasiPasien();
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



        }
    ]);
});