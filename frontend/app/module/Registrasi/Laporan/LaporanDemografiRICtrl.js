define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('LaporanDemografiRICtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function(cacheHelper, $scope, medifirstService, DateHelper, ) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


            loadCombo()
            LoadData()
            $scope.SearchData = function() {
                LoadData()
            }

            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function(data) {
                        $scope.listRuangans = data.data.ruanganrajal
                    })

                medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function(data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                })

            }

            $scope.CariLapPendapatanPoli = function() {
                LoadData()
            }

            function LoadData() {

                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date($scope.item.tglawal);
                var secondDate = new Date($scope.item.tglakhir);

                var diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }



                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-kel?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridK = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-pen?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridP = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-daer?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridD = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-daerkec?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridDkec = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-pek?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridPek = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-usia?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridDP = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jml: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jml", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-agama?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridAg = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });

                medifirstService.get("registrasi/laporan/get-data-lap-demografi-ri-item?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function(data) {
                    $scope.isRouteLoading = false;
                    var data2 = data.data;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataSourceGridIt = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                }
                            }
                        },
                        aggregate: [
                            { field: "jumlah", aggregate: "sum" },
                        ]
                    });
                });
            }




            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnGridK = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Cara Bayar.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Cara Bayar)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Cara Pembayaran",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }

            $scope.columnGridP = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Cara Bayar.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Cara Bayar)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }

            $scope.columnGridD = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "namakotakabupaten",
                        "title": "Asal Daerah",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }
            $scope.columnGridDkec = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah Kecamatan.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah Kecamatan)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "namakotakabupaten",
                        "title": "Asal Daerah",

                    },
                    {
                        "field": "namakecamatan",
                        "title": "Nama Kecamatan",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }

            $scope.columnGridPek = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }

            $scope.columnGridDP = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "usia",
                        "title": "Usia",

                    },
                    {
                        "field": "jml",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jml.sum #",

                    }
                ]

            }

            $scope.columnGridAg = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "agama",
                        "title": "Agama",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jumlah.sum #",

                    }
                ]

            }

            $scope.columnGridIt = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Rawat Inap - Daerah.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function(e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Inap (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                    },
                    {
                        "field": "ket",
                        "title": "Item",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",

                    }
                ]

            }



            //fungsi clear kriteria search
            $scope.ClearSearch = function() {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
            }



            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() {
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