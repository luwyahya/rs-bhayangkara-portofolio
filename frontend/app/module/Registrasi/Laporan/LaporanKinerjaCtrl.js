define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKinerjaCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {

            // $scope.yearSelected = {
            //     format: "MMMM yyyy",
            //     start: "year",
            //     depth: "month"
            // };
            $scope.isRouteLoading = false
            $scope.yearSelected = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "yyyy",
                }
            }
            $scope.listTahun = [];
            if (new Date().getMonth() == 11) {
                for (var i = new Date().getFullYear() - 5; i <= new Date().getFullYear() + 1; i++)
                    $scope.listTahun.push({ id: i });
            } else {
                for (var i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++)
                    $scope.listTahun.push({ id: i });
            }
            var tahunIni = new Date().getFullYear() - 5;
            if (new Date().getMonth() == 11) {
                tahunIni = $scope.listTahun.length - 2
            } else {
                tahunIni = $scope.listTahun.length - 1
            }

            $scope.item = {

                tahun: $scope.listTahun[tahunIni]
            };

            $scope.monthSelected = function () {
                return {
                    start: "month",
                    depth: "month",
                    format: "MMMM yyyy",
                }
            }
            $scope.find1 = function () {
                loadKinerja1()
            }
            $scope.clear1 = function () {
                $scope.item = {
                    tahun: $scope.listTahun[tahunIni]
                };
                // loadKinerja1()
            }
            $scope.find2 = function () {
                loadKinerja2()
            }
            $scope.clear2 = function () {
                $scope.item = {
                    tahun: $scope.listTahun[tahunIni]
                };
                // loadKinerja1()
            }
            function loadKinerja1() {
                $scope.isRouteLoading = true;
                if ($scope.item.bulan == undefined) return
                var bulan = moment($scope.item.bulan).format('YYYY-MM')
                medifirstService.get('registrasi/laporan/get-kinerja-pelayanan-ranap?bulan=' + bulan).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;

                    }
                    $scope.datagridKinerja1 = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });
                })
            }
            function loadKinerja2() {
                $scope.isRouteLoading = true;
                if ($scope.item.tahun == undefined) return
                var tahun = moment($scope.item.tahun).format('YYYY')
                medifirstService.get('registrasi/laporan/get-kinerja-pelayanan-ranap-tahunan?tahun=' + tahun).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;

                    }
                    $scope.datagridKinerja2 = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });
                })
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            $scope.opsiGridKinerja1 = {
                toolbar: [
                    {
                        text: "export", name: "Export detail",
                        template: '<button ng-click="exportKinerja1()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export to Excel</button>'
                    }

                ],
                // filterable: {
                //     extra: false,
                //     operators: {
                //         string: {
                //             startswith: "Dimulai dengan",
                //             contains: "mengandung kata",
                //             neq: "Tidak mengandung kata"
                //         }
                //     }
                // },

                pageable: true,
                selectable: "row",
                scrollable: false,

                columns: [
                    { field: "namakelas", title: "Ruang Kelas", "width": 280 },
                    { field: "tt", title: "TT", "width": 100 },
                    {
                        field: "hp", title: "Jumlah HP", "width": 100,
                        //  template: "<span class='style-right'>{{formatRupiah('#: hp #','')}}</span>",
                    },
                    {
                        field: "ld", title: "Jumlah LD", "width": 100,
                        // template: "<span class='style-right'>{{formatRupiah('#: ld #','')}}</span>",
                    },
                    {
                        field: "jmlpasienkeluar", title: "Jumlah Pasien Keluar", "width": 100,
                        // template: "<span class='style-right'>{{formatRupiah('#: jmlpasienkeluar #','')}}</span>",
                    },
                    { field: "bor", title: "BOR %", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: bor #','')}}</span>", },
                    { field: "los", title: "LOS", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: los #','')}}</span>", },
                    { field: "toi", title: "TOI", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: toi #','')}}</span>", },
                    { field: "bto", title: "BTO", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: bto #','')}}</span>", },
                    { field: "ndr", title: "NDR", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: ndr #','')}}</span>", },
                    { field: "gdr", title: "GDR", "width": 100, template: "<span class='style-right'>{{formatRupiah('#: gdr #','')}}</span>", },

                ]
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.exportKinerja1 = function () {
                var tempDataExport = [];
                var rows = [
                    {
                        cells: [
                            { value: "Ruang Kelas" },
                            { value: "TT" },
                            { value: "Jumlah HP" },
                            { value: "Jumlah LD" },
                            { value: "Jumlah Pasien Keluar" },
                            { value: "BOR %" },
                            { value: "LOS" },
                            { value: "TOI" },
                            { value: "BTO" },
                            { value: "NDR" },
                            { value: "GDR" }
                        ]
                    }
                ];

                tempDataExport = $scope.datagridKinerja1;
                tempDataExport.fetch(function () {
                    var data = this.data();
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        //push single row for every record
                        rows.push({
                            cells: [
                                { value: data[i].namakelas },
                                { value: data[i].tt },
                                { value: data[i].hp },
                                { value: data[i].ld },
                                { value: data[i].jmlpasienkeluar },
                                { value: data[i].bor },
                                { value: data[i].los },
                                { value: data[i].toi },
                                { value: data[i].bto },
                                { value: data[i].ndr },
                                { value: data[i].gdr },
                            ]
                        })
                    }
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [
                            {
                                freezePane: {
                                    rowSplit: 1
                                },
                                columns: [
                                    // Column settings (width)
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                ],
                                // Title of the sheet
                                title: "Kinerja 1",
                                // Rows of the sheet
                                rows: rows
                            }
                        ]
                    });
                    //save the file as Excel file with extension xlsx
                    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "KINERJA 1 -" + moment($scope.bulan).format('MMMM-YYYY') + ".xlsx" });
                });
            };
            $scope.opsiGridKinerja2 = {
                toolbar: [
                    {
                        text: "export", name: "Export detail",
                        template: '<button ng-click="exportDetail2()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export to Excel</button>'
                    }

                ],

                pageable: true,
                selectable: "row",
                scrollable: false,

                columns: [
                    { field: "namakelas", title: "Ruang Kelas", "width": 280 },
                    {
                        title: "Januari", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "januari_hp", "title": "HP" },
                            { "field": "januari_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Februari", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "februari_hp", "title": "HP" },
                            { "field": "februari_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Maret", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "maret_hp", "title": "HP" },
                            { "field": "maret_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "April", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "april_hp", "title": "HP" },
                            { "field": "april_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Mei", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "mei_hp", "title": "HP" },
                            { "field": "mei_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Juni", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "juni_hp", "title": "HP" },
                            { "field": "juni_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Juli", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "juli_hp", "title": "HP" },
                            { "field": "juli_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Agustus", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "agustus_hp", "title": "HP" },
                            { "field": "agustus_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "September", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "september_hp", "title": "HP" },
                            { "field": "september_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Oktober", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "oktober_hp", "title": "HP" },
                            { "field": "oktober_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "November", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "november_hp", "title": "HP" },
                            { "field": "november_bor", "title": "BOR %" }
                        ]
                    },
                    {
                        title: "Desember", headerAttributes: { style: "text-align : center" },
                        columns: [
                            { "field": "desember_hp", "title": "HP" },
                            { "field": "desember_bor", "title": "BOR %" }
                        ]
                    },

                ]
            };



            $scope.exportDetail2 = function () {
                var tempDataExport = [];
                var rows = [
                    {
                        cells: [
                            { value: "NIP" },
                            { value: "Nama" },
                            { value: "Unit Kerja" },
                            { value: "No. SIP" },
                            { value: "Tanggal Berakhir" },
                            { value: "No. STR" },
                            { value: "Tanggal Berakhir" }
                        ]
                    }
                ];

                tempDataExport = $scope.datagridSip;
                tempDataExport.fetch(function () {
                    var data = this.data();
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        //push single row for every record
                        rows.push({
                            cells: [
                                { value: data[i].nipPns },
                                { value: data[i].namapegawai },
                                { value: data[i].unitkerja },
                                { value: data[i].nosip },
                                { value: moment(new Date(data[i].berakhirsip)).format('DD-MM-YYYY') },
                                { value: data[i].nostr },
                                { value: moment(new Date(data[i].berakhirstr)).format('DD-MM-YYYY') },
                            ]
                        })
                    }
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [
                            {
                                freezePane: {
                                    rowSplit: 1
                                },
                                columns: [
                                    // Column settings (width)
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true }
                                ],
                                // Title of the sheet
                                title: "SIP",
                                // Rows of the sheet
                                rows: rows
                            }
                        ]
                    });
                    //save the file as Excel file with extension xlsx
                    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "Daftar Masa Berlaku SIP STR -" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY') + ".xlsx" });
                });
            };
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});