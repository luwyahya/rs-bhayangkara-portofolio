define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapKunjunganPerRekananCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;

            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            loadCombo()
            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-pengunjung")
                    .then(function (data) {
                        $scope.listRuangans = data.data.ruangan
                        $scope.listDokter = data.data.dokter
                    })

                medifirstService.get("sysadmin/general/get-combo-address")
                    .then(function (data) {
                        $scope.listKotaKabupaten = data.data.kotakabupaten
                    })   

            }
            loadFirst()
            function loadFirst() {
               
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            loadData()
            function loadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');

                

                medifirstService.get("radiologi/get-laporan-rekap-tindakan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir )
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                     
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                            total: data.data.data.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                        $scope.dataSourceGrid1 = new kendo.data.DataSource({
                            data: data.data.data1,
                            pageSize: 10,
                            total: data.data.data1.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                        $scope.dataSourceGrid2 = new kendo.data.DataSource({
                            data: data.data.data2,
                            pageSize: 10,
                            total: data.data.data2.length,

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


            $scope.columnGrid = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanRekapTindakan.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Rekap Tindakan", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "namaproduk",
                        "title": "Pemeriksaan",
                        "width": "150px",
                    },
                    {
                        title: "STATUS PASIEN",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                        {
                            "field": "jmlPasienPol",
                            "title": "POL",
                            "width": "50px",
                            
                        },
                        {
                            "field": "jmlPasienNonPol",
                            "title": "Non Pol",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienTag",
                            "title": "TAG",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienPtt",
                            "title": "PTT",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienUmum",
                            "title": "UMUM",
                            "width": "50px",
                        }
                    ]

                    }
                   
                ]
            
        }
        $scope.columnGrid2 = {
            toolbar: ["excel"],
            // , "pdf"],

            excel: {
                fileName: "LaporanRekapTindakanMCU.xlsx",
                allPages: true,

            },
            // pdf: {
            //     fileName: "LaporanPasienMasuk.pdf",
            //     allPages: true,
            // },

            dataSource: $scope.dataExcel,
            sortable: true,
            // reorderable: true,
            // filterable: true,
            pageable: true,
            // groupable: true,
            // columnMenu: true,
            resizable: true,
            excelExport: function (e) {
                var rows = e.workbook.sheets[0].rows;
                rows.unshift({
                    cells: [{ value: "Laporan Rekap Tindakan MCU", background: "#fffff" }]
                });
            },
            columns: [
                {
                    "field": "namaproduk",
                    "title": "Pemeriksaan",
                    "width": "150px",
                },
                {
                    title: "STATUS PASIEN",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                    {
                        "field": "jmlPasienPol",
                        "title": "POL",
                        "width": "50px",
                        
                    },
                    {
                        "field": "jmlPasienNonPol",
                        "title": "Non Pol",
                        "width": "50px",
                    },
                    {
                        "field": "jmlPasienTag",
                        "title": "TAG",
                        "width": "50px",
                    },
                    {
                        "field": "jmlPasienPtt",
                        "title": "PTT",
                        "width": "50px",
                    },
                    {
                        "field": "jmlPasienUmum",
                        "title": "UMUM",
                        "width": "50px",
                    }
                ]

                }
               
            ]
        
    }
        $scope.columnGrid1 = {
            
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanRekapKunjungan.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Rekap Kunjungan", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "instalasi",
                        "title": "Instalasi",
                        "width": "150px",
                    },
                    {
                        title: "STATUS PASIEN",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                        {
                            "field": "jmlPasienPol",
                            "title": "POL",
                            "width": "50px",
                            
                        },
                        {
                            "field": "jmlPasienNonPol",
                            "title": "Non Pol",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienTag",
                            "title": "TAG",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienPtt",
                            "title": "PTT",
                            "width": "50px",
                        },
                        {
                            "field": "jmlPasienUmum",
                            "title": "UMUM",
                            "width": "50px",
                        }
                    ]
                    }
                ]
            
        }

           
            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            // $scope.formatJam = function (tanggal) {
            //     return moment(tanggal).format('HH:mm');
            // }
            


            
            

            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});