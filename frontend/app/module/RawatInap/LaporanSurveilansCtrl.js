define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSurveilansCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper', '$http', '$state',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, dateHelper, $http, $state) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad();

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

            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;

                //Tanggal Default
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawaiLogin();

                medifirstService.get("rawatinap/get-combo-surveilan", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listPasien = dat.data.kelompokpasien;

                });
            }


            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                LoadData();
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
                medifirstService.get("rawatinap/get-data-surveilans?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
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

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.columnLaporan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "tglsurveilans",
                        "title": "Tgl Surveilans",
                        "width": "150px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>"
                    },
                    {
                        "field": "nosurvailens",
                        "title": "No Surveilans",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nosurvailens #</span>"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Masuk",
                        "width": "150px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "80px"

                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },
                    {
                        "field": "jk",
                        "title": "JK",
                        "width": "50px"
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Unit Layanan",
                        "width": "100px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    }
                ]
            };

            $scope.columnLaporanHarian = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Harian" + moment($scope.now).format('DD/MMM/YYYY') + ".xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "tglsurveilans",
                        "title": "Tgl Surveilans",
                        "width": "90px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },
                    {
                        "field": "umur",
                        "title": "U",
                        "width": "100px"
                    },
                    {
                        "field": "jk",
                        "title": "JK",
                        "width": "100px"
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Dx Medis",
                        "width": "100px"
                    },
                    {
                        "title": "Tindakan",
                        "columns": [
                            {
                                "field": "ett",
                                "title": "ETT",
                                "width": "75px"
                            },
                            {
                                "field": "cvl",
                                "title": "CVL",
                                "width": "75px"
                            },
                            {
                                "field": "ivl",
                                "title": "IVL",
                                "width": "75px"
                            },
                            {
                                "field": "uc",
                                "title": "UC",
                                "width": "75px"
                            }
                        ]
                    },
                    {
                        "title": "Infeksi HAIs",
                        "columns": [
                            {
                                "field": "PHLEBITIS",
                                "title": "PHLEBITIS",
                                "width": "75px"
                            },
                            {
                                "field": "DIARE",
                                "title": "DIARE",
                                "width": "75px"
                            },
                            {
                                "field": "ISK",
                                "title": "ISK",
                                "width": "75px"
                            },
                            {
                                "field": "SCABIES",
                                "title": "SCABIES",
                                "width": "75px"
                            }
                        ]
                    },
                    {
                        "field": "hasilkultur",
                        "title": "Hasil Kultur",
                        "width": "115px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Antibiotik",
                        "width": "115px"
                    }
                ]
            };

            $scope.columnLaporanIDO = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Harian" + moment($scope.now).format('DD/MMM/YYYY') + ".xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#:  #</span>"
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Tgl Masuk",
                        "width": "90px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        "field": "tglkeluar",
                        "title": "Tgl Keluar",
                        "width": "90px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Dx Medis",
                        "width": "115px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Tindakan",
                        "width": "115px"
                    },
                    {
                        "title": "Jenis Operasi",
                        "columns": [
                            {
                                "field": "bersih",
                                "title": "B",
                                "width": "75px"
                            },
                            {
                                "field": "bersihkotor",
                                "title": "BK",
                                "width": "75px"
                            },
                            {
                                "field": "kotor",
                                "title": "K",
                                "width": "75px"
                            },
                            {
                                "field": "kotortercemar",
                                "title": "KTR",
                                "width": "75px"
                            }
                        ]
                    },
                    {
                        "field": "scoresatu",
                        "title": "Score",
                        "width": "75px"
                    },
                    {
                        "title": "ASA Klasifikasi",
                        "columns": [
                            {
                                "field": "satu",
                                "title": "1",
                                "width": "75px"
                            },
                            {
                                "field": "dua",
                                "title": "2",
                                "width": "75px"
                            },
                            {
                                "field": "tiga",
                                "title": "3",
                                "width": "75px"
                            },
                            {
                                "field": "empat",
                                "title": "4",
                                "width": "75px"
                            },
                            {
                                "field": "lima",
                                "title": "5",
                                "width": "75px"
                            }
                        ]
                    },
                    {
                        "field": "scoredua",
                        "title": "Score",
                        "width": "75px"
                    },
                    {
                        "title": "T Time",
                        "columns": [
                            {
                                "field": "scoretiganol",
                                "title": "<",
                                "width": "75px"
                            },
                            {
                                "field": "scoretigasatu",
                                "title": ">",
                                "width": "75px"
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "Score",
                        "width": "75px"
                    },
                    {
                        "field": "totalscore",
                        "title": "Total Score",
                        "width": "75px"
                    },
                    {
                        "field": "hasilkultur",
                        "title": "Hasil Kultur",
                        "width": "115px"
                    },
                    {
                        "field": "statusimplant",
                        "title": "Implant",
                        "width": "115px"
                    }
                ]
            };

            $scope.surveilans_Harian = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
                medifirstService.get("rawatinap/get-data-harian-surveilans?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        var data2 = [];
                        for (var i = datas.length - 1; i >= 0; i--) {
                            datas[i].no = i + 1
                            var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr ';
                        }
                        $scope.sourceLaporanHarian = new kendo.data.DataSource({
                            data: datas,
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
                        $scope.popup_Harian.center().open();
                    })

            }

            $scope.surveilans_IDO = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
                medifirstService.get("rawatinap/get-data-ido-surveilans?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            datas[i].no = i + 1
                            if (datas[i].jenisoperasi == 'BERSIH') {
                                datas[i].bersih = 0
                                datas[i].scoresatu = 0
                            } else if (datas[i].jenisoperasi == 'BERSIH KOTOR') {
                                datas[i].bersihkotor = 0
                                datas[i].scoresatu = 0
                            } else if (datas[i].jenisoperasi == 'KOTOR') {
                                datas[i].kotor = 1
                                datas[i].scoresatu = 1
                            } else if (datas[i].jenisoperasi == 'KOTOR TERCEMAR') {
                                datas[i].kotortercemar = 1
                                datas[i].scoresatu = 1
                            }

                            if (datas[i].asascore == '1') {
                                datas[i].satu = 0
                                datas[i].scoredua = 0
                            } else if (datas[i].asascore == '2') {
                                datas[i].dua = 0
                                datas[i].scoredua = 0
                            } else if (datas[i].asascore == '3') {
                                datas[i].tiga =
                                    datas[i].scoredua = 1
                            } else if (datas[i].asascore == '4') {
                                datas[i].empat = 1
                                datas[i].scoredua = 1
                            } else if (datas[i].asascore == '5') {
                                datas[i].lima = 1
                                datas[i].scoredua = 1
                            }

                            if (datas[i].implant == 1) {
                                datas[i].statusimplant = 'terpasang'
                            } else {
                                datas[i].statusimplant = '-'
                            }

                            if (datas[i].scoresatu == 0 && datas[i].scoredua == 0) {
                                datas[i].scoretiganol == 0
                            } else {
                                datas[i].scoretigasatu == 0
                            }

                            if (datas[i].scoresatu == 0 && datas[i].scoredua == 0 && datas[i].scoretiganol == 0) {
                                datas[i].totalscore = 0
                            } else if (datas[i].scoresatu == 1 && datas[i].scoredua == 1 && datas[i].scoretigasatu == 1) {
                                datas[i].totalscore = 1
                            }

                        }

                        $scope.sourceLaporanIDO = new kendo.data.DataSource({
                            data: datas,
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
                        $scope.popup_Ido.center().open();
                    })
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        }
    ]);
});