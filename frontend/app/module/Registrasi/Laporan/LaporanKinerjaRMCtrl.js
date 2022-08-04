define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKinerjaRMCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                 medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganrajal
                    })

                    medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;

                var tahun = moment($scope.item.tahun).format('YYYY');



                var chacePeriode = {
                    0: tahun,
                }
                cacheHelper.set('LaporanKinerjaRMCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-lap-kinerja-pengunjung?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridPeng ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-kinerja-kunjungan?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridKunj ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                    })


                    medifirstService.get("registrasi/laporan/get-data-lap-kinerja-bayar-rj?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridPembayaranRJ ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    JanL: {type: "number"},
                                    JanW: {type: "number"},
                                    FebL: {type: "number"},
                                    FebW: {type: "number"},
                                    MarL: {type: "number"},
                                    MarW: {type: "number"},
                                    MeiL: {type: "number"},
                                    MeiW: {type: "number"},
                                    JunL: {type: "number"},
                                    JunW: {type: "number"},
                                    JulL: {type: "number"},
                                    JulW: {type: "number"},
                                    AguL: {type: "number"},
                                    AguW: {type: "number"},
                                    SepL: {type: "number"},
                                    SepW: {type: "number"},
                                    OktL: {type: "number"},
                                    OktW: {type: "number"},
                                    NovL: {type: "number"},
                                    NovW: {type: "number"},
                                    DesL: {type: "number"},
                                    DesW: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "JanL", aggregate:"sum"},
                            {field: "JanW", aggregate:"sum"},
                            {field: "FebL", aggregate:"sum"},
                            {field: "FebW", aggregate:"sum"},
                            {field: "MarL", aggregate:"sum"},
                            {field: "MarW", aggregate:"sum"},
                            {field: "MeiL", aggregate:"sum"},
                            {field: "MeiW", aggregate:"sum"},
                            {field: "JunL", aggregate:"sum"},
                            {field: "JunW", aggregate:"sum"},
                            {field: "JulL", aggregate:"sum"},
                            {field: "JulW", aggregate:"sum"},
                            {field: "AguL", aggregate:"sum"},
                            {field: "AguW", aggregate:"sum"},
                            {field: "SepL", aggregate:"sum"},
                            {field: "SepW", aggregate:"sum"},
                            {field: "OktL", aggregate:"sum"},
                            {field: "OktW", aggregate:"sum"},
                            {field: "NovL", aggregate:"sum"},
                            {field: "NovW", aggregate:"sum"},
                            {field: "DesL", aggregate:"sum"},
                            {field: "DesW", aggregate:"sum"},
                        ]


                        }
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-kinerja-kun-igd?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridIGD ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-kinerja-rawat-inap?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridRanap ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-kinerja-bayar-ri?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridPembayaranRI ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                    })


            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnGridPeng = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Instalasi (Pengunjung).xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Instalasi (Pengunjung)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "KET",
                        "title": "Cara Pembayaran RJ",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],


                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }

            $scope.columnGridKunj = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Instalasi (Pengunjung).xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Instalasi (Pengunjung)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "KET",
                        "title": "Cara Pembayaran RJ",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],


                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }


            $scope.columnGridPembayaranRJ = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Instalasi (Cara Pembayaran RJ).xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Instalasi (Cara Pembayaran RJ)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "kelompokpasien",
                        "title": "Cara Pembayaran RJ",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],


                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }

            $scope.columnGridIGD = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Instalasi (Kunjungan IGD).xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Instalasi (Kunjungan IGD)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "KET",
                        "title": "Cara Pembayaran RJ",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],


                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }

            $scope.columnGridRanap = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Rawat Inap.xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Rawat Inap", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "KET",
                        "title": "Rawat Inap",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],


                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }

            $scope.columnGridPembayaranRI = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Instalasi (Cara Pembayaran RI).xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Kinerja Instalasi (Cara Pembayaran RI)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "kelompokpasien",
                        "title": "Cara Pembayaran RJ",
                        "width": "200px",
                    },
                    {
                        "title" : "Januari",
                        "columns":
                            [{
                                "field" : "JanL",
                                "title" : "L",
                            },{
                                "field" : "JanW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Februari",
                        "columns":
                            [{
                                "field" : "FebL",
                                "title" : "L",
                            },{
                                "field" : "FebW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Maret",
                        "columns":
                            [{
                                "field" : "MarL",
                                "title" : "L",
                            },{
                                "field" : "MarW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "April",
                        "columns":
                            [{
                                "field" : "AprL",
                                "title" : "L",
                            },{
                                "field" : "AprW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Mei",
                        "columns":
                            [{
                                "field" : "MeiL",
                                "title" : "L",
                            },{
                                "field" : "MeiW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juni",
                        "columns":
                            [{
                                "field" : "JunL",
                                "title" : "L",
                            },{
                                "field" : "JunW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Juli",
                        "columns":
                            [{
                                "field" : "JulL",
                                "title" : "L",
                            },{
                                "field" : "JulW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Agustus",
                        "columns":
                            [{
                                "field" : "AguL",
                                "title" : "L",
                            },{
                                "field" : "AguW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "September",
                        "columns":
                            [{
                                "field" : "SepL",
                                "title" : "L",
                            },{
                                "field" : "SepW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Oktober",
                        "columns":
                            [{
                                "field" : "OktL",
                                "title" : "L",
                            },{
                                "field" : "OktW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "November",
                        "columns":
                            [{
                                "field" : "NovL",
                                "title" : "L",
                            },{
                                "field" : "NovW",
                                "title" : "P",
                            }
                            ],
                    }, {
                        "title" : "Desember",
                        "columns":
                            [{
                                "field" : "DesL",
                                "title" : "L",
                            },{
                                "field" : "DesW",
                                "title" : "P",
                            }
                            ],
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                    }

                ]
            }



            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.$watch('cari.tahun', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    newVal = moment(newVal).format('YYYY')
                    oldVal = moment(oldVal).format('YYYY')
                    if (newVal != oldVal) {
                        applyFilter("tahuns", newVal)
                    }
                }, 500)
            })
            
            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


        }
    ]);
});