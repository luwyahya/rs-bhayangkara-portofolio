define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL2a1PenyakitMenularRawatInapCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                // var idDiagnosaAwal = "";
                // if ($scope.item.diagnosa1 != undefined) {
                //     idDiagnosaAwal = "&idDiagnosaAwal=" + $scope.item.diagnosa1.kddiagnosa;
                // }
                // var idDiagnosaAkhir = "";
                // if ($scope.item.diagnosa2 != undefined) {
                //     idDiagnosaAkhir = "&idDiagnosaAkhir=" + $scope.item.diagnosa2.kddiagnosa;
                // }


                // medifirstService.get("registrasi/laporan/get-laporan-rl4a-new?"
                //     + "tglAwal=" + tglAwal
                //     + "&tglAkhir=" + tglAkhir

                // ).then(function (data) {
                //     var data = data.data
                //     for (var i = 0; i < data.data.length; i++) {
                //         data.data[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(data.data[i].tglLahir);
                //         var umurzz = DateHelper.CountAge(tanggalLahir, tanggal);
                //         data.data[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'

                //     }
                //     $scope.isRouteLoading = false;

                //     $scope.dataPasienPulang = new kendo.data.DataSource({

                //         data: data.data,
                //         group: $scope.group,
                //         pageSize: 10,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {
                //                 }
                //             }
                //         }, aggregate: [
                //             { field: 'jmlAmabes', aggregate: 'sum' },
                //             { field: 'jmlApmj', aggregate: 'sum' },
                //             { field: 'jmlApl', aggregate: 'sum' },
                //             { field: 'jmlSmabes', aggregate: 'sum' },
                //             { field: 'jmlSpmj', aggregate: 'sum' },
                //             { field: 'jmlSpl', aggregate: 'sum' },
                //             { field: 'jmlKmabes', aggregate: 'sum' },
                //             { field: 'jmlKpmj', aggregate: 'sum' },
                //             { field: 'jmlKpl', aggregate: 'sum' },
                //             { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                //             { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                //             { field: 'jmlPasienUmum', aggregate: 'sum' },
                //             { field: 'jmlPasienPTT', aggregate: 'sum' },
                //             { field: 'jmlPasienTahanan', aggregate: 'sum' },
                //             { field: 'jml28HariL', aggregate: 'sum' },
                //             { field: 'jml28HariP', aggregate: 'sum' },
                //             { field: 'jml1ThnL', aggregate: 'sum' },
                //             { field: 'jml1ThnP', aggregate: 'sum' },
                //             { field: 'jml4ThnL', aggregate: 'sum' },
                //             { field: 'jml4ThnP', aggregate: 'sum' },
                //             { field: 'jml14ThnL', aggregate: 'sum' },
                //             { field: 'jml14ThnP', aggregate: 'sum' },
                //             { field: 'jml24ThnL', aggregate: 'sum' },
                //             { field: 'jml24ThnP', aggregate: 'sum' },
                //             { field: 'jml44ThnL', aggregate: 'sum' },
                //             { field: 'jml44ThnP', aggregate: 'sum' },
                //             { field: 'jml64ThnL', aggregate: 'sum' },
                //             { field: 'jml64ThnP', aggregate: 'sum' },
                //             { field: 'jml65ThnL', aggregate: 'sum' },
                //             { field: 'jmlPulangH', aggregate: 'sum' },
                //             { field: 'jmlPulangM', aggregate: 'sum' },
                //             { field: 'jml65ThnP', aggregate: 'sum' },
                //         ],
                //         refresh: true,
                //         selectable: true,
                //         refresh: true,
                //         groupable: true,
                //         allowCopy: true,
                //     });

                //     $scope.dataExcel = data.data;
                // })
                
                medifirstService.get("registrasi/laporan/get-laporan-rl4a-new-menular?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir

                ).then(function (data) {
                    var data = data.data
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(data.data[i].tglLahir);
                        var umurzz = DateHelper.CountAge(tanggalLahir, tanggal);
                        data.data[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'

                    }
                    $scope.isRouteLoading = false;

                    $scope.dataPasienPulangMenular = new kendo.data.DataSource({

                        data: data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }, aggregate: [
                            { field: 'jmlAmabes', aggregate: 'sum' },
                            { field: 'jmlApmj', aggregate: 'sum' },
                            { field: 'jmlApl', aggregate: 'sum' },
                            { field: 'jmlSmabes', aggregate: 'sum' },
                            { field: 'jmlSpmj', aggregate: 'sum' },
                            { field: 'jmlSpl', aggregate: 'sum' },
                            { field: 'jmlKmabes', aggregate: 'sum' },
                            { field: 'jmlKpmj', aggregate: 'sum' },
                            { field: 'jmlKpl', aggregate: 'sum' },
                            { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                            { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                            { field: 'jmlPasienUmum', aggregate: 'sum' },
                            { field: 'jmlPasienPTT', aggregate: 'sum' },
                            { field: 'jmlPasienTahanan', aggregate: 'sum' },
                            { field: 'jml28HariL', aggregate: 'sum' },
                            { field: 'jml28HariP', aggregate: 'sum' },
                            { field: 'jml1ThnL', aggregate: 'sum' },
                            { field: 'jml1ThnP', aggregate: 'sum' },
                            { field: 'jml4ThnL', aggregate: 'sum' },
                            { field: 'jml4ThnP', aggregate: 'sum' },
                            { field: 'jml14ThnL', aggregate: 'sum' },
                            { field: 'jml14ThnP', aggregate: 'sum' },
                            { field: 'jml24ThnL', aggregate: 'sum' },
                            { field: 'jml24ThnP', aggregate: 'sum' },
                            { field: 'jml44ThnL', aggregate: 'sum' },
                            { field: 'jml44ThnP', aggregate: 'sum' },
                            { field: 'jml64ThnL', aggregate: 'sum' },
                            { field: 'jml64ThnP', aggregate: 'sum' },
                            { field: 'jml65ThnL', aggregate: 'sum' },
                            { field: 'jmlPulangH', aggregate: 'sum' },
                            { field: 'jmlPulangM', aggregate: 'sum' },
                            { field: 'jml65ThnP', aggregate: 'sum' },
                            { field: 'jmlKasusBaruL', aggregate: 'sum' },
                            { field: 'jmlKasusBaruP', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    });

                    $scope.dataExcel = data.data;
                })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnPasienPulang = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL2a1RawatInapMenular.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                // groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP SURVEILANS", background: "#fffff" }]
                    });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    {
                        field: "no",
                        title: "No. Urut",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "70px"
                    },
                    {
                        field: "nodtd",
                        title: "No. DTD",
                        width: "80px",
                        template: "<span class='style-center'>#: nodtd  #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "kddiagnosa",
                        title: "No. Daftar Terperinci",
                        width: "100px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "golongansebabpenyakit",
                        title: "Golongan Sebab Penyakit",
                        width: "150px",
                        template: "<span class='style-center'>#: golongansebabpenyakit #</span>",
                    },
                    {
                        title: "STATUS / GOLONGAN PASIEN",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {

                                title: "POLRI",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            title: "ANGGOTA",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            columns:
                                                [
                                                    {
                                                        field: "jmlAmabes",
                                                        title: "MABES POLRI",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlAmabes #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlAmabes.sum  #"
                                                    },
                                                    {
                                                        field: "jmlApmj",
                                                        title: "PMJ",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlApmj #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlApmj.sum  #"
                                                    },
                                                    {
                                                        field: "jmlApl",
                                                        title: "POLDA LAIN",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlApl #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlApl.sum  #"
                                                    },
                                                ]
                                        },
                                        {
                                            title: "SIPIL",
                                            width: "60px",
                                            headerAttributes: { style: "text-align : center" },
                                            columns:
                                                [
                                                    {
                                                        field: "jmlSmabes",
                                                        title: "MABES POLRI",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlSmabes #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlSmabes.sum  #"
                                                    },
                                                    {
                                                        field: "jmlSpmj",
                                                        title: "PMJ",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlSpmj #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlSpmj.sum  #"
                                                    },
                                                    {
                                                        field: "jmlSpl",
                                                        title: "POLDA LAIN",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlSpl #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlSpl.sum  #"
                                                    },
                                                ]
                                        },
                                        {
                                            title: "KELUARGA",
                                            width: "60px",
                                            headerAttributes: { style: "text-align : center" },
                                            columns:
                                                [
                                                    {
                                                        field: "jmlKmabes",
                                                        title: "MABES POLRI",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlKmabes #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlKmabes.sum  #"
                                                    },
                                                    {
                                                        field: "jmlKpmj",
                                                        title: "PMJ",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlKpmj #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlKpmj.sum  #"
                                                    },
                                                    {
                                                        field: "jmlKpl",
                                                        title: "POLDA LAIN",
                                                        width: "60px",
                                                        headerAttributes: { style: "text-align : center" },
                                                        template: "<span class='style-center'>#: jmlKpl #</span>",
                                                        aggregates: ["sum"],
                                                        footerTemplate: "#:data.jmlKpl.sum  #"
                                                    },
                                                ]
                                        },
                                    ]
                            },
                            {

                                title: "BPJS",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jmlPasienBpjsNonPol",
                                            title: "BPJS NON POLRI",
                                            width: "60px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jmlPasienBpjsNonPol #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jmlPasienBpjsNonPol.sum  #"
                                        },
                                        {
                                            field: "jmlPasienBpjsPol",
                                            title: "LAIN-2",
                                            width: "60px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jmlPasienBpjsPol #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jmlPasienBpjsPol.sum  #"
                                        }
                                    ]
                            },
                            {
                                field: "jmlPasienUmum",
                                title: "UMUM",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                                template: "<span class='style-center'>#: jmlPasienUmum #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jmlPasienUmum.sum  #"
                            },
                            {

                                title: "TKW/TKI",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                            },
                            {

                                title: "GAKIN",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                            },
                            {
                                field: "jmlPasienPTT",
                                title: "P.P.T",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                                template: "<span class='style-center'>#: jmlPasienPTT #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jmlPasienPTT.sum  #"
                            },
                            {

                                title: "TAGIHAN",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                            },
                            {

                                title: "JAMSOSTEK",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                            },
                            {
                                field: "jmlPasienTahanan",
                                title: "TAHANAN",
                                headerAttributes: { style: "text-align : center" },
                                width: "60px",
                                template: "<span class='style-center'>#: jmlPasienTahanan #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jmlPasienTahanan.sum  #"
                            }
                        ]
                    },
                    {
                        title: "Pasien Keluar (Hidup & Mati) Menurut Golongan Umur & Sex",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {

                                title: "0-28hr",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml28HariL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml28HariL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml28HariL.sum  #"
                                        },
                                        {
                                            field: "jml28HariP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml28HariP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml28HariP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "28hr-<1th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml1ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml1ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml1ThnL.sum  #"
                                        },
                                        {
                                            field: "jml1ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml1ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml1ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "1-4th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml4ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml4ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml4ThnL.sum  #"
                                        },
                                        {
                                            field: "jml4ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml4ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml4ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "5-14th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml14ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml14ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml14ThnL.sum  #"
                                        },
                                        {
                                            field: "jml14ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml14ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml14ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "15-24th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml24ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml24ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml24ThnL.sum  #"
                                        },
                                        {
                                            field: "jml24ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml24ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml24ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "55-44th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml44ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml44ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml44ThnL.sum  #"
                                        },
                                        {
                                            field: "jml44ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml44ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml44ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "45-64th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml64ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml64ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml64ThnL.sum  #"
                                        },
                                        {
                                            field: "jml64ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml64ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml64ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: ">65",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml65ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml65ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml65ThnL.sum  #"
                                        },
                                        {
                                            field: "jml65ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml65ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml65ThnP.sum  #"
                                        }
                                    ]
                            },
                        ]
                    },
                    
                    {
                        field: "jmlPulangH",
                        title: "Jml. Pasien Keluar",
                        width: "150px",
                        template: "<span class='style-center'>#: jmlPulangH #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jmlPulangH.sum  #"
                    },
                    {
                        field: "jmlPulangM",
                        title: "Jml. Pasien Keluar Mati",
                        width: "150px",
                        template: "<span class='style-center'>#: jmlPulangM #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jmlPulangM.sum  #"
                    },
                ]

            };

            $scope.columnPasienPulangMenular = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL2a1RawatInap.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                // groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP SURVEILANS", background: "#fffff" }]
                    });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    {
                        field: "no",
                        title: "No. Urut",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "70px"
                    },
                    {
                        field: "nodtd",
                        title: "No. DTD",
                        width: "80px",
                        template: "<span class='style-center'>#: nodtd  #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "kddiagnosa",
                        title: "No. Daftar Terperinci",
                        width: "100px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "golongansebabpenyakit",
                        title: "Golongan Sebab Penyakit",
                        width: "150px",
                        template: "<span class='style-center'>#: golongansebabpenyakit #</span>",
                    },
                    // {
                    //     title: "STATUS / GOLONGAN PASIEN",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns: [
                    //         {

                    //             title: "POLRI",
                    //             headerAttributes: { style: "text-align : center" },
                    //             columns:
                    //                 [
                    //                     {
                    //                         title: "ANGGOTA",
                    //                         width: "40px",
                    //                         headerAttributes: { style: "text-align : center" },
                    //                         columns:
                    //                             [
                    //                                 {
                    //                                     field: "jmlAmabes",
                    //                                     title: "MABES POLRI",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlAmabes #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlAmabes.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlApmj",
                    //                                     title: "PMJ",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlApmj #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlApmj.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlApl",
                    //                                     title: "POLDA LAIN",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlApl #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlApl.sum  #"
                    //                                 },
                    //                             ]
                    //                     },
                    //                     {
                    //                         title: "SIPIL",
                    //                         width: "60px",
                    //                         headerAttributes: { style: "text-align : center" },
                    //                         columns:
                    //                             [
                    //                                 {
                    //                                     field: "jmlSmabes",
                    //                                     title: "MABES POLRI",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlSmabes #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlSmabes.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlSpmj",
                    //                                     title: "PMJ",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlSpmj #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlSpmj.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlSpl",
                    //                                     title: "POLDA LAIN",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlSpl #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlSpl.sum  #"
                    //                                 },
                    //                             ]
                    //                     },
                    //                     {
                    //                         title: "KELUARGA",
                    //                         width: "60px",
                    //                         headerAttributes: { style: "text-align : center" },
                    //                         columns:
                    //                             [
                    //                                 {
                    //                                     field: "jmlKmabes",
                    //                                     title: "MABES POLRI",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlKmabes #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlKmabes.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlKpmj",
                    //                                     title: "PMJ",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlKpmj #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlKpmj.sum  #"
                    //                                 },
                    //                                 {
                    //                                     field: "jmlKpl",
                    //                                     title: "POLDA LAIN",
                    //                                     width: "60px",
                    //                                     headerAttributes: { style: "text-align : center" },
                    //                                     template: "<span class='style-center'>#: jmlKpl #</span>",
                    //                                     aggregates: ["sum"],
                    //                                     footerTemplate: "#:data.jmlKpl.sum  #"
                    //                                 },
                    //                             ]
                    //                     },
                    //                 ]
                    //         },
                    //         {

                    //             title: "BPJS",
                    //             headerAttributes: { style: "text-align : center" },
                    //             columns:
                    //                 [
                    //                     {
                    //                         field: "jmlPasienBpjsNonPol",
                    //                         title: "BPJS NON POLRI",
                    //                         width: "60px",
                    //                         headerAttributes: { style: "text-align : center" },
                    //                         template: "<span class='style-center'>#: jmlPasienBpjsNonPol #</span>",
                    //                         aggregates: ["sum"],
                    //                         footerTemplate: "#:data.jmlPasienBpjsNonPol.sum  #"
                    //                     },
                    //                     {
                    //                         field: "jmlPasienBpjsPol",
                    //                         title: "LAIN-2",
                    //                         width: "60px",
                    //                         headerAttributes: { style: "text-align : center" },
                    //                         template: "<span class='style-center'>#: jmlPasienBpjsPol #</span>",
                    //                         aggregates: ["sum"],
                    //                         footerTemplate: "#:data.jmlPasienBpjsPol.sum  #"
                    //                     }
                    //                 ]
                    //         },
                    //         {
                    //             field: "jmlPasienUmum",
                    //             title: "UMUM",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //             template: "<span class='style-center'>#: jmlPasienUmum #</span>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienUmum.sum  #"
                    //         },
                    //         {

                    //             title: "TKW/TKI",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //         },
                    //         {

                    //             title: "GAKIN",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //         },
                    //         {
                    //             field: "jmlPasienPTT",
                    //             title: "P.P.T",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //             template: "<span class='style-center'>#: jmlPasienPTT #</span>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienPTT.sum  #"
                    //         },
                    //         {

                    //             title: "TAGIHAN",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //         },
                    //         {

                    //             title: "JAMSOSTEK",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //         },
                    //         {
                    //             field: "jmlPasienTahanan",
                    //             title: "TAHANAN",
                    //             headerAttributes: { style: "text-align : center" },
                    //             width: "60px",
                    //             template: "<span class='style-center'>#: jmlPasienTahanan #</span>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienTahanan.sum  #"
                    //         }
                    //     ]
                    // },
                    {
                        title: "Pasien Keluar (Hidup & Mati) Menurut Golongan Umur & Sex",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {

                                title: "0-28hr",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml28HariL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml28HariL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml28HariL.sum  #"
                                        },
                                        {
                                            field: "jml28HariP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml28HariP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml28HariP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "28hr-<1th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml1ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml1ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml1ThnL.sum  #"
                                        },
                                        {
                                            field: "jml1ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml1ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml1ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "1-4th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml4ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml4ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml4ThnL.sum  #"
                                        },
                                        {
                                            field: "jml4ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml4ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml4ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "5-14th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml14ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml14ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml14ThnL.sum  #"
                                        },
                                        {
                                            field: "jml14ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml14ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml14ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "15-24th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml24ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml24ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml24ThnL.sum  #"
                                        },
                                        {
                                            field: "jml24ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml24ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml24ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "55-44th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml44ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml44ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml44ThnL.sum  #"
                                        },
                                        {
                                            field: "jml44ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml44ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml44ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: "45-64th",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml64ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml64ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml64ThnL.sum  #"
                                        },
                                        {
                                            field: "jml64ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml64ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml64ThnP.sum  #"
                                        }
                                    ]
                            },
                            {

                                title: ">65",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jml65ThnL",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml65ThnL #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml65ThnL.sum  #"
                                        },
                                        {
                                            field: "jml65ThnP",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" },
                                            template: "<span class='style-center'>#: jml65ThnP #</span>",
                                            aggregates: ["sum"],
                                            footerTemplate: "#:data.jml65ThnP.sum  #"
                                        }
                                    ]
                            },
                        ]
                    },
                    {
                        title: "Kasus Baru Menurut Jenis Kelamin",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                // field: "jmlKasusBaruL",
                                field: "jmlKasusBaruL",
                                title: "LK",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#: jmlKasusBaruL #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jmlKasusBaruL.sum  #"
                            },
                            {
                                // field: "jmlKasusBaruP",
                                field: "jmlKasusBaruP",
                                title: "PR",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#: jmlKasusBaruP #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jmlKasusBaruP.sum  #"
                            },

                        ]
                    },
                    {
                        field: "jmlPulangH",
                        title: "Jml. Pasien Keluar",
                        width: "150px",
                        template: "<span class='style-center'>#: jmlPulangH #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jmlPulangH.sum  #"
                    },
                    {
                        field: "jmlPulangM",
                        title: "Jml. Pasien Keluar Mati",
                        width: "150px",
                        template: "<span class='style-center'>#: jmlPulangM #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jmlPulangM.sum  #"
                    },
                ]

            };
            
            // $scope.menular= function (dataPasienSelected) {
            //     // debugger;
            //     // if (dataPasienSelected.statuspulang != "Belum Pulang") {
            //     //     toastr.error('Pasien Sudah Pulang', 'Info');
            //     //     return;
            //     // }
            //     $scope.listJenisRujukan = [{ 'id': 1, 'name': 'Faskes 1' }, { 'id': 2, 'name': 'Faskes 2' }]
            //     $scope.norecPDbuttonSelected = dataPasienSelected.norec_pd
            //     $scope.norecAPDbuttonSelected = dataPasienSelected.norec_apd
            //     $scope.nocmfk = dataPasienSelected.nocmfk
            //     medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
            //         $scope.listDokter = data.data.dokter;
            //         medifirstService.get("rawatinap/get-combo-pindahpasien")         
            //         .then(function (e) {
            //             $scope.listKondisiPasien=e.data.kondisipasien; 
            //             $scope.listPenyebabKematian=e.data.penyebabkematian; 
            //         })
            //         $scope.popUpPulang.center().open();
            //     });
            // }


            // ini laporan standart
            // $("#kGrid").kendoGrid({
            //     toolbar: ["excel"],
            //     // , "pdf"],

            //     excel: {
            //         fileName: "RL4BRawatJalan.xlsx",
            //         allPages: true,

            //     },
            //     // pdf: {
            //     //     fileName: "LaporanPasienMasuk.pdf",
            //     //     allPages: true,
            //     // },

            //     dataSource: $scope.dataExcel,
            //     sortable: true,
            //     reorderable: true,
            //     filterable: true,
            //     pageable: true,
            //     // groupable: true,
            //     columnMenu: true,
            //     resizable: true,
            //     excelExport: function (e) {
            //         var rows = e.workbook.sheets[0].rows;
            //         rows.unshift({
            //             cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP", background: "#fffff" }]
            //         });
            //     },
            //     columns: [
            //         {
            //             field: "no",
            //             title: "No. Urut",
            //             Template: "<span class='style-center'>#: no #</span>",
            //             width: "70px"
            //         },
            //         {
            //             field: "nodtd",
            //             title: "No. DTD",
            //             width: "80px",
            //             template: "<span class='style-center'>#: nodtd  #</span>",
            //             // headerAttributes: { style: "text-align : center" },
            //         },
            //         {
            //             field: "kddiagnosa",
            //             title: "No. Daftar Terperinci",
            //             width: "100px",
            //             template: "<span class='style-center'>#: kddiagnosa #</span>",
            //             // headerAttributes: { style: "text-align : center" },
            //         },
            //         {
            //             field: "golongansebabpenyakit",
            //             title: "Golongan Sebab Penyakit",
            //             width: "150px",
            //             template: "<span class='style-center'>#: golongansebabpenyakit #</span>",
            //             // headerAttributes: { style: "text-align : center" },
            //         },
            //         {
            //             title: "Jumlah Pasien Kasus Menurut Golongan Umur & Sex",
            //             headerAttributes: { style: "text-align : center" },
            //             columns: [
            //                 {

            //                     title: "0-6hr",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml6HariL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml6HariP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "7-28hr",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml28HariL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml28HariP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "28hr-<1th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml1ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml1ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "1-4th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml4ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml4ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "5-14th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml14ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml14ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "15-24th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml24ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml24ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "55-44th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml44ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml44ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: "45-64th",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml64ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml64ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //                 {

            //                     title: ">65",
            //                     headerAttributes: { style: "text-align : center" },
            //                     columns:
            //                         [
            //                             {
            //                                 field: "jml65ThnL",
            //                                 title: "L",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             },
            //                             {
            //                                 field: "jml65ThnP",
            //                                 title: "P",
            //                                 width: "40px",
            //                                 headerAttributes: { style: "text-align : center" }
            //                             }
            //                         ]
            //                 },
            //             ]
            //         },

            //         {
            //             title: "Kasus Baru Menurut Jenis Kelamin",
            //             headerAttributes: { style: "text-align : center" },
            //             columns: [
            //                 {
            //                     // field: "jmlKasusBaruL",
            //                     field: "totalMenurutL",
            //                     title: "LK",
            //                     width: "60px",
            //                     headerAttributes: { style: "text-align : center" }
            //                 },
            //                 {
            //                     // field: "jmlKasusBaruP",
            //                     field: "totalMenurutP",
            //                     title: "PR",
            //                     width: "60px",
            //                     headerAttributes: { style: "text-align : center" },
            //                 },

            //             ]
            //         },
            //         {
            //             // field: "totalKasusBaru",
            //             field: "jmlPL",
            //             title: "Jumlah Pasien Baru (23+24)",
            //             width: "100px",
            //             headerAttributes: { style: "text-align : center" },
            //         },
            //         {
            //             field: "totalAll",
            //             title: "Jumlah Kunjungan",
            //             width: "120px",
            //             headerAttributes: { style: "text-align : center" },
            //         }

            //     ]

            // });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            
            $scope.UbahDokter = function () {
                // medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
                //     $scope.listDokter = data.data.dokter;

                    
                medifirstService.get('emr/get-combo-icd10').then(function (data) {
                    $scope.listJenisDiagnosa = data;
                    // $scope.item.pilihDokter = { id: $scope.dataPasienSelected.objectpegawaifk, namalengkap: $scope.dataPasienSelected.namadokter }
                    $scope.winDialogss.center().open();
                });
            }

            // medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
            //     $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
            // });

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }



        }
    ]);
});