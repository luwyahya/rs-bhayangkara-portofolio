define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapPengunjungCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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
            $scope.PilihManual3 = true
            $scope.model.cekpilihManual = undefined
            $scope.model.cekpilihManual2 = undefined
            $scope.model.cekPilihManual3 = undefined
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.CariLapPasienPulang = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.PilihManual2 = false
                    $scope.PilihManual3 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan=undefined
                    $scope.item.departement=undefined
                }else{
                    $scope.isRuanganRJ = true
                    $scope.PilihManual2 = true
                    $scope.PilihManual3 = true
                }
            }
            $scope.ceklispilihManual2 = function (bool) {
                if (bool) {
                    $scope.PilihManual1 = false
                    $scope.PilihManual3 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.isRuanganRJ = true
                    $scope.PilihManual1 = true
                    $scope.PilihManual3 = true
                }
            }
            $scope.ceklispilihManual3 = function (bool) {
                debugger;
                if (bool) {
                    $scope.PilihManual1 = false
                    $scope.PilihManual2 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.PilihManual1 = true
                    $scope.PilihManual2 = true
                    $scope.isRuanganRJ = true
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
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                // var isRJ = "";
                // if($scope.isRuanganRJ==false){
                //     isRJ="&isRJ=" + true
                // }
                // var isRJ2 = "";
                // if ($scope.isRuanganRJ == true) {
                //     isRJ2 = "&isRJ2=" + true
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

                    debugger;
                var isNotLab = ""
                 if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""
                
                else 
                    isNotLab = ""
              

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRekapPengunjungCtrl', chacePeriode);
                debugger
                if ($scope.item.departement == undefined) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + isRJ
                    + isRJ2
                    + isNotLab).then(function (data) {
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
                                { field: 'jmlPasienBaru', aggregate: 'sum' },
                                { field: 'jmlPasienLama', aggregate: 'sum' },
                                { field: 'jmlPasien', aggregate: 'sum' },
                                { field: 'jmlPasienTracer', aggregate: 'sum' },
                                { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                { field: 'jmlPasienPTT', aggregate: 'sum' },
                                { field: 'jmlPasienUmum', aggregate: 'sum' },
                                { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                { field: 'jmlPasienPasca', aggregate: 'sum' },
                                { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjung', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })
                } else if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-ri?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + isRJ
                    + isRJ2
                    + isNotLab).then(function (data) {
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
                                { field: 'jmlPasienBaru', aggregate: 'sum' },
                                { field: 'jmlPasienLama', aggregate: 'sum' },
                                { field: 'jmlPasien', aggregate: 'sum' },
                                { field: 'jmlPasienTracer', aggregate: 'sum' },
                                { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                { field: 'jmlPasienPTT', aggregate: 'sum' },
                                { field: 'jmlPasienUmum', aggregate: 'sum' },
                                { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                { field: 'jmlPasienPasca', aggregate: 'sum' },
                                { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjung', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })   
                } else {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + isRJ
                    + isRJ2
                    + isNotLab).then(function (data) {
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
                                { field: 'jmlPasienBaru', aggregate: 'sum' },
                                { field: 'jmlPasienLama', aggregate: 'sum' },
                                { field: 'jmlPasien', aggregate: 'sum' },
                                { field: 'jmlPasienTracer', aggregate: 'sum' },
                                { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                { field: 'jmlPasienPTT', aggregate: 'sum' },
                                { field: 'jmlPasienUmum', aggregate: 'sum' },
                                { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                { field: 'jmlPasienPasca', aggregate: 'sum' },
                                { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                { field: 'jmlPulangPengunjung', aggregate: 'sum' },
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

            $scope.columnPasienPulang =
                {
                    toolbar: [
                        "excel",
                        "pdf",
                    ],
                    excel: {
                        fileName: "LaporanRekapKunjungan.xlsx",
                        allPages: true,
                    },
                    pdf: {

                        fileName: "LaporanRekapKunjungan.pdf",
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
                                value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA KUNJUNGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
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
                                "field": "namaruangan",
                                "title": "POLIKLINIK",
                                "width": "180px"
                            },
                            {
                                "title": "PASIEN",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "jmlPasienBaru",
                                        "title": "BARU",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienBaru #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBaruDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBaru #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienBaru.sum  #"
                                        // "footerTemplate": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBaruDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#:data.jmlPasienBaru.sum  #</button>" 
                                    },
                                    {
                                        "field": "jmlPasienLama",
                                        "title": "LAMA",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienLama #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienLamaDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienLama #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienLama.sum  #"
                                    },
                                    {
                                        "field": "jmlPasien",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasien #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTotalDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasien.sum  #"
                                    }
                                ]
                            },
                            {
                                "title": "PENGUNJUNG",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "jmlPasienTracer",
                                        "title": "TRACER",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTracer #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTracerDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienTracer #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienTracer.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienNonTracer",
                                        "title": "NON TRACER",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienNonTracer #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienNonTracerDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienNonTracer #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienNonTracer.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienKonsul",
                                        "title": "KONSUL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKonsul #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKonsulDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKonsul #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienKonsul.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienKunjungan",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKunjungan #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienKunjungan.sum  #"
                                    }
                                ]
                            },
                            {
                                "title": "PEMBAYARAN",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "jmlPasienBpjsPol",
                                        "title": "BPJS POLRI",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienBpjsPol #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBpjsPol #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienBpjsPol.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienBpjsNonPol",
                                        "title": "BPJS NONPOL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienBpjsNonPol #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsNonPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBpjsNonPol #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienBpjsNonPol.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienTagihan",
                                        "title": "TAGIHAN",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienTagihan #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienTagihan.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienPTT",
                                        "title": "PTT RUMKIT",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienPTT #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPTTDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPTT #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: "#:data.jmlPasienPTT.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienUmum",
                                        "title": "UMUM",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienUmum #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienUmumDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienUmum #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienUmum.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienPembayaran",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienPembayaran #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPembayaranDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPembayaran #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienPembayaran.sum  #"
                                    }
                                ]
                            },
                            {
                                "title": "KEDATANGAN",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "jmlPasienSendiri",
                                        "title": "SENDIRI",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienSendiri #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienSendiriDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienSendiri #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienSendiri.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienRujukan",
                                        "title": "RUJUKAN",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienRujukan #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienRujukanDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienRujukan #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienRujukan.sum  #"
                                    },
                                    {
                                        "field": "jmlPasienPasca",
                                        "title": "PASCA RAWAT",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienPasca #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPascaDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPasca #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienPasca.sum #"
                                    },
                                    {
                                        "field": "jmlPasienKedatangan",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKedatangan #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKedatanganDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKedatangan #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPasienKedatangan.sum #"
                                    }
                                ]
                            },
                            {
                                "title": "KEPULANGAN",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "jmlPulangPengunjungRegister",
                                        "title": "REG",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPulangPengunjungRegister #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRegisterDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRegister #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjungRegister.sum  #"
                                    },
                                    {
                                        "field": "jmlPulangPengunjungPulang",
                                        "title": "PLG",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPulangPengunjungPulang #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungPulangDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungPulang #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjungPulang.sum  #"
                                    },
                                    {
                                        "field": "jmlPulangPengunjungRawat",
                                        "title": "RWT",
                                        "width": "100px",
                                        //template: "<span class='style-center'>#: jmlPulangPengunjungRawat #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRawatDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRawat #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjungRawat.sum  #"
                                    },
                                    {
                                        "field": "jmlPulangPengunjungKonsul",
                                        "title": "KSL",
                                        "width": "100px",
                                        //template: "<span class='style-center'>#: jmlPulangPengunjungKonsul #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungKonsulDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungKonsul #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjungKonsul.sum  #"
                                    },
                                    {
                                        "field": "jmlPulangPengunjungRujuk",
                                        "title": "RJK",
                                        "width": "100px",
                                        //template: "<span class='style-center'>#: jmlPulangPengunjungRujuk #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRujukDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRujuk #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjungRujuk.sum  #"
                                    },
                                    // {
                                    //     "field": "jmlPulangPengunjungBatal",
                                    //     "title": "BTL",
                                    //     "width": "100px",
                                    //     template: "<span class='style-center'>#: jmlPulangPengunjungBatal #</span>",
                                    //     aggregates: ["sum"],
						            //     footerTemplate: " #:data.jmlPulangPengunjungBatal.sum  #"
                                    // },
                                    {
                                        "field": "jmlPulangPengunjung",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPulangPengunjung #</span>",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjung #</button>",
                                        aggregates: ["sum"],
						                footerTemplate: " #:data.jmlPulangPengunjung.sum  #"
                                    }
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

                $scope.columnPasienDetail =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "Laporan";

                        var myHeaders = [
                            {
                                value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                            }
                        ];
                        sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
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
                            {
                                "field": "namaruangan",
                                "title": "Nama Ruangan",
                                "width": "50px"
                            },
                            {
                                "field": "tglregistrasi",
                                "title": "Tanggal Registrasi",
                                "width": "50px"
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px"
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px"
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px"
                            },
                            {
                                "field": "ruanganasal",
                                "title": "Ruangan Asal",
                                "width": "50px"
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px"
                            }
                        ],
                        sortable: {
                            mode: "single",
                            allowUnsort: false,
                        },
                        pageable: {
                            messages: {
                                display: "Menampilkan {0} - {1} data dari {2} data"
                            },
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5
                        },
                };

                $scope.jmlPasienBaruDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=1";
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
                $scope.jmlPasienLamaDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=2";
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
                $scope.jmlPasienTotalDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=3";
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
                $scope.jmlPasienTracerDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=4";
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
                $scope.jmlPasienNonTracerDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=5";
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
                $scope.jmlPasienKonsulDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=6";
                    $scope.isRouteLoading = true;
                    debugger
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    } else {
                        medifirstService.get(link
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    }
                    
                }
                $scope.jmlPasienKunjunganDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=7";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                        medifirstService.get(link
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    }
                    
                }
                $scope.jmlPasienBpjsPolDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=8";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienBpjsNonPolDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=9";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienTagihanDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=10";

                    if ($scope.item.departement.id == 16) {
                        $scope.isRouteLoading = true;
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    $scope.isRouteLoading = true;
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienPTTDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=11";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienUmumDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=12";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienPembayaranDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=13";
                    $scope.isRouteLoading = true;

                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienSendiriDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=14";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienRujukanDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=15";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienPascaDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=16";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPasienKedatanganDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=17";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungRegisterDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=18";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungPulangDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=19";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungRawatDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=20";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungKonsulDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=21";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungRujukDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=22";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }
                $scope.jmlPulangPengunjungDetail = function (dataPasienSelected) {
                    debugger;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                    var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                    var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail?"
                    var setParam = "&setParam=23";
                    $scope.isRouteLoading = true;
                    if ($scope.item.departement.id == 16) {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail-ri?"
                            + "tglAwal=" + tglAwal
                            + "&tglAkhir=" + tglAkhir
                            + ruanganId
                            + setParam).then(function (data) {
                                debugger;
                                $scope.popUpDetail.center().open();
                                $scope.isRouteLoading = false;
                                details = data.data.data;
                                $scope.dataPasienDetail = {
                                    data: data.data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
    
                                            }
                                        }
                                    }, aggregate : [
    
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            }) 
                    } else {
                    medifirstService.get(link
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + ruanganId
                        + setParam).then(function (data) {
                            debugger;
                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                }, aggregate : [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                    }
                }

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