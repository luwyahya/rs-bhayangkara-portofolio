define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL12IndikatorPelayananRsCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59:00');
            $scope.item.jenis = '1'
            $scope.isBulan = true
            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                if ($scope.item.jenis == '1') {
                    $scope.isBulan = true
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-01 HH:mm');
                    var tglAkhir = moment($scope.item.tglawal).format('YYYY-MM-31 HH:mm');
                    medifirstService.get("eis/get-borlostoi-polri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: data.data,
                            group: $scope.group,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        $scope.dataExcel = data;

                        $scope.sourceBed = new kendo.data.DataSource({
                            data: data.data[0].ttDetail,
                            group: $scope.group,
                            pageSize: 10,
                            total: data.data[0].ttDetail,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        $scope.dataExcelBed = data.data[0].ttDetail;

                        $scope.sourcePasienPulang = new kendo.data.DataSource({
                            data: data.data[0].pasienpulangdetail,
                            group: $scope.group,
                            pageSize: 10,
                            total: data.data[0].pasienpulangdetail,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        $scope.dataExcelPasienPulang = data.data[0].pasienpulangdetail;
                    })
                } else if ($scope.item.jenis == '2') {
                    $scope.isBulan = false
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-01-01 HH:mm');
                    var tglAkhir = moment($scope.item.tglawal).format('YYYY-12-31 HH:mm');
                    medifirstService.get("eis/get-borlostoi-polri-tahun?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir
                    ).then(function (data) {

                        $scope.isRouteLoading = false;
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: data.data,
                            group: $scope.group,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        $scope.dataExcel = data;

                    })
                }
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL1.2_IndikatorPelayananRS.xlsx",
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
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "RL 1.2 Indikator Pelayanan Rumah Sakit",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    // {
                    //     field: "no",
                    //     title: "NO",
                    //     Template: "<span class='style-center'>#: no #</span>",
                    //     width: "40px"
                    // },
                    {
                        field: "bulanregis",
                        title: "Bulan",
                        width: "120px",
                        template: "<span class='style-center'>#: bulanregis #</span>",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "tt",
                        title: "Jumlah Bed",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "hariperawatan",
                        title: "Jumlah Hari Perawatan",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "lamarawat",
                        title: "Lama Rawat",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "pasienpulang",
                        title: "Pasien Pulang",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "meninggal",
                        title: "Pasien Meninggal",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "matikurang48",
                        title: "Pasien Meninggal Kurang48",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "matilebih48",
                        title: "Pasien Meninggal Lebih48",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "bor",
                        title: "BOR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "alos",
                        title: "LOS",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "bto",
                        title: "BTO",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "toi",
                        title: "TOI",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "ndr",
                        title: "NDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "gdr",
                        title: "GDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    }
                    // {
                    //     field: "ratarataperhari",
                    //     title: "Rata-rata Kunjungan/Hari",
                    //     width: "120px",
                    //     headerAttributes: {
                    //         style: "text-align : center"
                    //     },
                    // },


                ]
            });

            $("#kGridBed").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],
                excel: {
                    fileName: "Jumlah Bed.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcelBed,
                sortable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "Detail Jumlah Bed",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "120px",
                        template: "<span class='style-center'>#: namaruangan #</span>",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "jmlbed",
                        title: "Jumlah Bed",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "bulanregis",
                        title: "Tahun Bulan",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "hariperawatan",
                        title: "Hari Perawatan",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "lamarawat",
                        title: "Lama Rawat",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jmlpasienpulangperruangan",
                        title: "Pasien Pulang",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jmlpasienmeninggalperruangan",
                        title: "Pasien Meninggal",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jmlpasienmeninggallebih48perruangan",
                        title: "Pasien Meninggal >48jam",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jmlpasienmeninggalkurang48perruangan",
                        title: "Pasien Meninggal <48jam",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "borruangan",
                        title: "BOR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "alosruangan",
                        title: "LOS",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "btoruangan",
                        title: "BTO",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "toiruangan",
                        title: "TOI",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "ndrruangan",
                        title: "NDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "gdrruangan",
                        title: "GDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                ]
            });

            $("#kGridPasienPulang").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],
                excel: {
                    fileName: "Detail Pasien Pulang.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcelPasienPulang,
                sortable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "Detail Pasien Pulang",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "120px",
                        template: "<span class='style-center'>#: noregistrasi #</span>",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "tglpulang",
                        title: "Tanggal Pualng",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "reportdisplay",
                        title: "Kondisi Pulang",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                ]
            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

        }
    ]);
});