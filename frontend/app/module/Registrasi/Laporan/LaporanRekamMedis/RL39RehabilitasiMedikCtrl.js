define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL39RehabilitasiMedikCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper', 
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.CariRegistrasiPasien = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }

            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
              
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRl39Ctrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-rl39?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        var data = data.data
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].no = i + 1
                        }
                        $scope.isRouteLoading = false;
                        $scope.ambildataexcel = data.data;
                        $scope.panggil($scope.ambildataexcel);
                        $scope.dataRL52 = new kendo.data.DataSource({
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
                        fileName: "Laporan Pelayanan Rehabilitasi Medik.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    pageable: true,
                    resizable: true,
                    // columnMenu: true,
                    columns: [
                        {
                            field: "no",
                            title: "No",
                            Template: "<span class='style-center'>#: no #</span>",
                            width: "50px"
                        },
                        {
                            field: "namaproduk",
                            title: "Jenis Kegiatan"
                        },
                        {
                            field: "jmltindakan",
                            title: "Jumlah"
                        }
                    ]
                })
            };

            $scope.panggil();

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnRL52 = [

                {
                    field: "no",
                    title: "No",
                    Template: "<span class='style-center'>#: no #</span>",
                    width: "50px"
                },
                {
                    title: "Jenis Kegiatan",
                    field: "namaproduk"
                },
                {
                    title: "Jumlah",
                    field: "jmltindakan"
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

            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [
                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }
            ];


            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 12:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();



        }
    ]);
});