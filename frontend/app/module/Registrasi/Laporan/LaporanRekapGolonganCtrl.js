define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapGolonganCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.model = {};
            var details = [];
            $scope.isRuanganRJ = true
            $scope.PilihManual1 = true
            $scope.PilihManual2 = true
            $scope.model.cekpilihManual = undefined
            $scope.model.cekpilihManual2 = undefined
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.CariLapPasienPulang = function () {
                $scope.isRouteLoading = true;
                LoadData()
                LoadDataBayar()
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.PilihManual2 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.isRuanganRJ = true
                    $scope.PilihManual2 = true
                }
            }
            $scope.ceklispilihManual2 = function (bool) {
                if (bool) {
                    $scope.PilihManual1 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.isRuanganRJ = true
                    $scope.PilihManual1 = true
                }
            }
            function LoadData() {

                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                var link = "registrasi/laporan/get-laporan-rekap-golongan?"
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                    // if($scope.item.departement.id==27 || $scope.item.departement.id==3){
                    //     link = "registrasi/laporan/get-laporan-rekap-kunjungan-radiologi?"
                    // }
                }
                // var isRJ = "";
                // if ($scope.isRuanganRJ == false) {
                //     isRJ = "&isRJ=" + true
                // }
                var isRJ = ""
                 if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if($scope.model.cekpilihManual == undefined)
                    isRJ = ""
                
                else 
                    isRJ2= ""

                var isRJ2 = ""
                 if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""
                
                else 
                    isRJ2 = ""


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRekapGolonganCtrl', chacePeriode);

                medifirstService.get(link
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + isRJ
                    + isRJ2).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        details = data.data;
                        // var doubleTotal = 0;
                        // var doubleKarcis = 0;
                        // for (var i = 0; i < data.data.length; i++) {
                        //     doubleTotal = doubleTotal + parseFloat(data.data[i].total)
                        //     doubleKarcis = doubleKarcis + parseFloat(data.data[i].karcis)
                        // }
                        // $scope.item.karcis = doubleKarcis
                        // $scope.item.total = doubleTotal
                        $scope.dataPasienPulang = {
                            // new kendo.data.DataSource({
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }, aggregate: [
                                { field: 'jmlP1', aggregate: 'sum' },
                                { field: 'jmlP2', aggregate: 'sum' },
                                { field: 'jmlP3', aggregate: 'sum' },
                                { field: 'jmlP4', aggregate: 'sum' },
                                { field: 'jmlP5', aggregate: 'sum' },
                                { field: 'jmlP6', aggregate: 'sum' },
                                { field: 'jmlP7', aggregate: 'sum' },
                                { field: 'jmlP8', aggregate: 'sum' },
                                { field: 'jmlP9', aggregate: 'sum' },
                                { field: 'jmlP10', aggregate: 'sum' },
                                { field: 'jmlP11', aggregate: 'sum' },
                                { field: 'jmlP12', aggregate: 'sum' },
                                { field: 'jmlP13', aggregate: 'sum' },
                                { field: 'jmlP14', aggregate: 'sum' },
                                { field: 'jmlP15', aggregate: 'sum' },
                                { field: 'jmlP16', aggregate: 'sum' },
                                { field: 'jmlP17', aggregate: 'sum' },
                                { field: 'jmlP18', aggregate: 'sum' },
                                { field: 'jmlP19', aggregate: 'sum' },
                                { field: 'jmlP20', aggregate: 'sum' },
                                { field: 'jmlP21', aggregate: 'sum' },
                                { field: 'jmlP22', aggregate: 'sum' },
                                { field: 'jmlP23', aggregate: 'sum' },
                                { field: 'jmlP24', aggregate: 'sum' },
                                { field: 'jmlP25', aggregate: 'sum' },
                                { field: 'jmlP26', aggregate: 'sum' },
                                { field: 'jmlP27', aggregate: 'sum' },
                                { field: 'jmlP28', aggregate: 'sum' },
                                { field: 'jmlP29', aggregate: 'sum' },
                                { field: 'jmlKosong', aggregate: 'sum' },
                                { field: 'TotalAll', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })
            }

            function LoadDataBayar() {

                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                var link = "registrasi/laporan/get-laporan-rekap-bayar?"
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                    // if($scope.item.departement.id==27 || $scope.item.departement.id==3){
                    //     link = "registrasi/laporan/get-laporan-rekap-kunjungan-radiologi?"
                    // }
                }
                // var isRJ = "";
                // if ($scope.isRuanganRJ == false) {
                //     isRJ = "&isRJ=" + true
                // }
                var isRJ = ""
                 if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if($scope.model.cekpilihManual == undefined)
                    isRJ = ""
                
                else 
                    isRJ2= ""

                var isRJ2 = ""
                 if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""
                
                else 
                    isRJ2 = ""



                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRekapGolonganCtrl', chacePeriode);

                medifirstService.get(link
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + isRJ
                    + isRJ2).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        details = data.data;
                        // var doubleTotal = 0;
                        // var doubleKarcis = 0;
                        // for (var i = 0; i < data.data.length; i++) {
                        //     doubleTotal = doubleTotal + parseFloat(data.data[i].total)
                        //     doubleKarcis = doubleKarcis + parseFloat(data.data[i].karcis)
                        // }
                        // $scope.item.karcis = doubleKarcis
                        // $scope.item.total = doubleTotal
                        $scope.dataPasienPulangBayar = {
                            // new kendo.data.DataSource({
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }, aggregate: [
                                { field: 'jmlP1', aggregate: 'sum' },
                                { field: 'jmlP2', aggregate: 'sum' },
                                { field: 'jmlP3', aggregate: 'sum' },
                                { field: 'jmlP4', aggregate: 'sum' },
                                { field: 'jmlP5', aggregate: 'sum' },
                                { field: 'jmlP6', aggregate: 'sum' },
                                { field: 'jmlP7', aggregate: 'sum' },
                                { field: 'jmlP8', aggregate: 'sum' },
                                { field: 'jmlP9', aggregate: 'sum' },
                                { field: 'jmlP10', aggregate: 'sum' },
                                { field: 'jmlP11', aggregate: 'sum' },
                                { field: 'jmlP12', aggregate: 'sum' },
                                { field: 'jmlP13', aggregate: 'sum' },
                                { field: 'jmlP14', aggregate: 'sum' },
                                { field: 'jmlP15', aggregate: 'sum' },
                                { field: 'jmlP16', aggregate: 'sum' },
                                { field: 'jmlP17', aggregate: 'sum' },
                                { field: 'jmlP18', aggregate: 'sum' },
                                { field: 'jmlP19', aggregate: 'sum' },
                                { field: 'jmlP20', aggregate: 'sum' },
                                { field: 'jmlP21', aggregate: 'sum' },
                                { field: 'jmlP22', aggregate: 'sum' },
                                { field: 'jmlP23', aggregate: 'sum' },
                                { field: 'jmlP24', aggregate: 'sum' },
                                { field: 'jmlP25', aggregate: 'sum' },
                                { field: 'jmlP26', aggregate: 'sum' },
                                { field: 'jmlP27', aggregate: 'sum' },
                                { field: 'jmlP28', aggregate: 'sum' },
                                { field: 'jmlP29', aggregate: 'sum' },
                                { field: 'jmlKosong', aggregate: 'sum' },
                                { field: 'TotalAll', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
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

            $scope.columnPasienPulangBayar =
            {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanRekapGolongan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapGolongan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "REKAPITULASI PENGUNJUNG DAN KUNJUNGAN POLIKLINIK BERDASARKAN GOLONGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                    [
                        // {
                        //     "field": "nomor",
                        //     "title": "No",
                        //     "width": "20px"
                        // },
                        {
                            "field": "ket",
                            "title": "KETERANGAN",
                            "width": "180px"
                        },
                        {
                            "title": "CARA BAYAR",
                            "width": "180px",
                            headerAttributes: { style: "text-align : center" },
                            columns:
                                [
                                    {
                                        "field": "jmlP1",
                                        "title": "UMUM",
                                        "width": "50px",
                                        template: "<span class='style-center'>#: jmlP1 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP1.sum  #"
                                    },
                                    {
                                        "field": "jmlP2",
                                        "title": "BPJS KESEHATAN",
                                        "width": "50px",
                                        template: "<span class='style-center'>#: jmlP2 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: " #:data.jmlP2.sum  #"
                                    },
                                    {
                                        "field": "jmlP3",
                                        "title": "BPJS KETENAGAKERJAAN, PT",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP3 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP3.sum  #"
                                    },
                                    {
                                        "field": "jmlP4",
                                        "title": "BPJS KESEHATAN - NON POLRI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP4 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP4.sum  #"
                                    },
                                    {
                                        "field": "jmlP5",
                                        "title": "BPJS KESEHATAN - POLRI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP5 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP5.sum  #"
                                    },
                                    {
                                        "field": "jmlP6",
                                        "title": "BPJS KESEHATAN - NON POLRI PBI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP6 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP6.sum  #"
                                    },
                                    {
                                        "field": "jmlP7",
                                        "title": "PTT RUMKIT",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP7 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP7.sum  #"
                                    },
                                    {
                                        "field": "jmlP8",
                                        "title": "PTT MABES/POLDA",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP8 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP8.sum  #"
                                    },
                                    {
                                        "field": "jmlP9",
                                        "title": "ASURANSI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP9 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP9.sum  #"
                                    },
                                    // {
                                    //     "field": "jmlP10",
                                    //     "title": "PNS SISWA DIKBANG",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP10 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP10.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP11",
                                    //     "title": "PNS SISWA DIKJUR",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP11 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP11.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP12",
                                    //     "title": "TAHANAN KEPOLISIAN",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP12 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP12.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP13",
                                    //     "title": "TAHANAN KPK",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP13 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP13.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP14",
                                    //     "title": "TAHANAN BNN",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP14 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP14.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP15",
                                    //     "title": "TAHANAN KEJAKSAAN",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP15 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP15.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP16",
                                    //     "title": "TAHANAN LAPAS",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP16 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP16.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP17",
                                    //     "title": "PNS SISWA DIKTUK",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP17 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP17.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP18",
                                    //     "title": "AVRIST ASSURANCE, PT",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP18 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP18.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP19",
                                    //     "title": "BNP2TKI",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP19 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP19.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP20",
                                    //     "title": "JASA RAHARJA, PT (UMUM)",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP20 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP20.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP20",
                                    //     "title": "JASA RAHARJA, PT (BPJS KESEHATAN)",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP20 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP20.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlP20",
                                    //     "title": "YANKESTU",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlP20 #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlP20.sum  #"
                                    // },
                                    // {
                                    //     "field": "jmlKosong",
                                    //     "title": "Kosong",
                                    //     "width": "60px",
                                    //     template: "<span class='style-center'>#: jmlKosong #</span>",
                                    //     aggregates: ["sum"],
                                    //     footerTemplate: "#:data.jmlKosong.sum  #"
                                    // },
                                    {
                                        "field": "TotalAll",
                                        "title": "Total",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: TotalAll #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.TotalAll.sum  #"
                                    },
                                ]
                        },
                    ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.columnPasienPulang =
            {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanRekapGolongan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapGolongan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "REKAPITULASI PENGUNJUNG DAN KUNJUNGAN POLIKLINIK BERDASARKAN GOLONGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                    [
                        // {
                        //     "field": "nomor",
                        //     "title": "No",
                        //     "width": "20px"
                        // },
                        {
                            "field": "ket",
                            "title": "KETERANGAN",
                            "width": "180px"
                        },
                        {
                            "title": "GOLONGAN",
                            "width": "180px",
                            headerAttributes: { style: "text-align : center" },
                            columns:
                                [
                                    {
                                        "field": "jmlP1",
                                        "title": "ANGGOTA POLRI",
                                        "width": "50px",
                                        template: "<span class='style-center'>#: jmlP1 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP1.sum  #"
                                    },
                                    {
                                        "field": "jmlP2",
                                        "title": "ANGGOTA PNS",
                                        "width": "50px",
                                        template: "<span class='style-center'>#: jmlP2 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: " #:data.jmlP2.sum  #"
                                    },
                                    {
                                        "field": "jmlP3",
                                        "title": "KELUARGA ANGGOTA POLRI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP3 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP3.sum  #"
                                    },
                                    {
                                        "field": "jmlP4",
                                        "title": "PTT",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP4 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP4.sum  #"
                                    },
                                    {
                                        "field": "jmlP5",
                                        "title": "ANGGOTA SISWA DIKBANG",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP5 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP5.sum  #"
                                    },
                                    {
                                        "field": "jmlP6",
                                        "title": "ANGGOTA SISWA DIKTUK",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP6 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP6.sum  #"
                                    },
                                    {
                                        "field": "jmlP7",
                                        "title": "ANGGOTA SISWA DIKJUR",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP7 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP7.sum  #"
                                    },
                                    {
                                        "field": "jmlP8",
                                        "title": "KELUARGA ANGGOTA PNS",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP8 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP8.sum  #"
                                    },
                                    {
                                        "field": "jmlP9",
                                        "title": "KELUARGA PTT",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP9 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP9.sum  #"
                                    },
                                    {
                                        "field": "jmlP10",
                                        "title": "PNS SISWA DIKBANG",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP10 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP10.sum  #"
                                    },
                                    {
                                        "field": "jmlP11",
                                        "title": "PNS SISWA DIKJUR",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP11 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP11.sum  #"
                                    },
                                    {
                                        "field": "jmlP12",
                                        "title": "TAHANAN KEPOLISIAN",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP12 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP12.sum  #"
                                    },
                                    {
                                        "field": "jmlP13",
                                        "title": "TAHANAN KPK",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP13 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP13.sum  #"
                                    },
                                    {
                                        "field": "jmlP14",
                                        "title": "TAHANAN BNN",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP14 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP14.sum  #"
                                    },
                                    {
                                        "field": "jmlP15",
                                        "title": "TAHANAN KEJAKSAAN",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP15 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP15.sum  #"
                                    },
                                    {
                                        "field": "jmlP16",
                                        "title": "TAHANAN LAPAS",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP16 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP16.sum  #"
                                    },
                                    {
                                        "field": "jmlP17",
                                        "title": "PNS SISWA DIKTUK",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP17 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP17.sum  #"
                                    },
                                    {
                                        "field": "jmlP18",
                                        "title": "AVRIST ASSURANCE, PT",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP18 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP18.sum  #"
                                    },
                                    {
                                        "field": "jmlP19",
                                        "title": "BNP2TKI",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP19 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP19.sum  #"
                                    },
                                    {
                                        "field": "jmlP20",
                                        "title": "JASA RAHARJA, PT (UMUM)",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP20 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP20.sum  #"
                                    },
                                    {
                                        "field": "jmlP21",
                                        "title": "JASA RAHARJA, PT (BPJS KESEHATAN)",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP20 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP20.sum  #"
                                    },
                                    {
                                        "field": "jmlP22",
                                        "title": "YANKESTU",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlP20 #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlP20.sum  #"
                                    },
                                    {
                                        "field": "jmlKosong",
                                        "title": "Kosong",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: jmlKosong #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.jmlKosong.sum  #"
                                    },
                                    {
                                        "field": "TotalAll",
                                        "title": "Total",
                                        "width": "60px",
                                        template: "<span class='style-center'>#: TotalAll #</span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "#:data.TotalAll.sum  #"
                                    },
                                ]
                        },
                    ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.Perbaharui = function () {

                $scope.ClearSearch();

            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
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
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,namaRuangan").then(function(dat) {
            // $scope.listRuangan = dat.data;
            // });
            medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                $scope.listDepartemen = data.data.departemen;
                // $scope.kelompokPasiens = e.data.data
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function(dat) {
            // $scope.listPasien = dat.data;
            // });
            // manageLogistikPhp.getDataTableTransaksi("kasir/laporan-penerimaan-kasir-datacombo", true).then(function(dat){
            //     debugger;
            //     //$scope.listPegawai = dat.data.dataDokter;
            //     $scope.listRuangan = dat.data.dataruangan;
            //     //$scope.listPegawaiKasir = dat.data.datakasir;
            //     //$scope.dataLogin = dat.data.datalogin[0];
            //     $scope.listKelompokPasien = dat.data.datakelompokpasien;
            // });

            $scope.$watch('item.namaPenjamin', function (e) {
                // debugger;
                if (e === undefined) return;
                findPasien.getDataRekanan(e.id).then(function (data) {
                    $scope.sourceDataRekanan = data.data.data.listData;
                    $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
                });
                if (e.id == 5 || e.id == 3) {
                    $scope.Perusahaan = true
                } else {
                    $scope.Perusahaan = false
                    $scope.item.institusiAsalPasien = ""
                }
            })

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
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.Cetak = function () {
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.institusiAsalPasien == undefined || $scope.item.institusiAsalPasien.id == undefined)
                    var perusahaan = "";
                else
                    var perusahaan = $scope.item.institusiAsalPasien.id;


                var data2 = details

                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    // if (details[i].rekananfk != null && details[i].statusbarang == null){
                    TempData.push(data2[i])
                    // }    
                }
                var data =
                {
                    details: TempData
                }
                medifirstService.post('registrasi/laporan/post-laporan-pasien-pulang', data).then(function (e) {
                    $scope.isRouteLoading = false;
                    var noId = e.data.noId
                    var stt = 'false'
                    if (confirm('View Laporan Pasien Pulang? ')) {
                        stt = 'true';
                    } else {
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&idlaporan=' + noId + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
                        // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true
                    });
                });
            }

        }
    ]);
});