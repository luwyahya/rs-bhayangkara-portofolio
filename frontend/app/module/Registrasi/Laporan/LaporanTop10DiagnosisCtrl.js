define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanTop10DiagnosisCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();
            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                $scope.item.isFindMPP = false
                LoadCombo();
                LoadDataGrid()
            }

            $scope.cekMPP = function (bool) {
                if (bool) {
                    $scope.item.isFindMPP = true
                    loadData()
                } else {
                    $scope.item.isFindMPP = false
                    loadData()
                }
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            

            $scope.SearchData = function () {
                LoadDataGrid()
                setDetail()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            function LoadDataGrid() {
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
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                }
                var tempDiagnosa = ""
                if ($scope.item.Diagnosa != undefined) {
                    tempDiagnosa = "&idDiagnosa=" + $scope.item.Diagnosa.id;
                }

                var isMPP = ""
                if ($scope.item.isFindMPP == true) {
                    isMPP = "&isMPP=" + 1
                } else {
                    isMPP = "&isMPP=" + 0
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-laporan-topten-diagnosa?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + isMPP).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
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
                medifirstService.get("registrasi/laporan/get-detail-topten-diagnosa?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + isMPP).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        debugger
                        $scope.sourceLaporanDetail = new kendo.data.DataSource({
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
                        debugger
                    })
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "LaporanDiagnosaPasien.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "20px" },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "345px",
                    },
                    {
                        field: "kddiagnosa",
                        title: "ICD X",
                        width: "55px",
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "50px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setDetail(dataItem)\"  style=\"margin:0 0 5px\">#:  jumlah #</button> ",
                    }
                ]
            }

            $scope.columnPasienPulang =
                {
                    toolbar: [
                        "excel",
                        // "pdf",
                    ],
                    excel: {
                        fileName: "LaporanRekapKunjungan.xlsx",
                        allPages: true,
                    },
                    // pdf: {

                    //     fileName: "LaporanRekapKunjungan.pdf",
                    //     allPages: true,
                    //     avoidLinks: true,
                    //     paperSize: "A4",
                    //     margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    //     landscape: true,
                    //     repeatHeaders: true,
                    //     template: $("#page-template").html(),
                    //     scale: 0.8
                    // },
                    excelExport: function (e) {

                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "LAPORAN";

                        var myHeaders = [

                            {
                                value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA KUNJUNGAN ",
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
                            // {
                            //     "field": "namaruangan",
                            //     "title": "POLIKLINIK",
                            //     "width": "180px"
                            // },
                            {
                                "title": "Diagnosa",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                               columns: [

                                // { field: "no", title: "No", width: "50px" },
                                {
                                    field: "namadiagnosa",
                                    title: "Diagnosa",
                                    width: "300px",
                                },
                                {
                                    field: "kddiagnosa",
                                    title: "ICD X",
                                    width: "80px",
                                }
                              ]
                            },
                            {
                                "title": "Kelompok Pasien",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "anggotapolri",
                                        "title": "Anggota Polri",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "anggotapns",
                                        "title": "PNS Polri",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienNonTracer #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienNonTracerDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "keluargaanggotapolri",
                                        "title": "Keluarga Anggota Polri",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKonsul #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKonsulDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenamin.sum  #"
                                    },
                                    {
                                        "field": "keluargaanggotapns",
                                        "title": "Keluarga Anggota PNS",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "keluargaanggotadiktuk",
                                        "title": "Keluarga Anggota Diktuk",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "keluargaanggotadikjur",
                                        "title": "Keluarga Anggota Dikjur",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "keluargaptt",
                                        "title": "Keluarga PTT",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "pnssiswadikbang",
                                        "title": "PNS Siswa Dikbang",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "pnssiswadiktuk",
                                        "title": "PNS Siswa Diktuk",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "siswadikbang",
                                        "title": "Siswa Dikbang",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "avsasuransi",
                                        "title": "Avrist Ass",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "tahananbnn",
                                        "title": "Tahanan BNN",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "tahanankejaksaan",
                                        "title": "Tahanan Kejaksaan",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "tahanankepolisian",
                                        "title": "Tahanan Kepolisian",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: namadiagnosa #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"namadiagnosaDetail(dataItem)\" style=\"margin:0 0 5px\">#: namadiagnosa #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namadiagnosa.sum  #"
                                    },
                                    {
                                        "field": "tahananlapas",
                                        "title": "Tahanan Lapas",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    },
                                     {
                                        "field": "totalkelompok",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    }
                                ]
                            },
                            {
                                "title": "Penjamin",
                                "width": "180px",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                [
                                    {
                                        "field": "mandiri",
                                        "title": "Mandiri",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienBpjsPol #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "bpjs",
                                        "title": "BPJS",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienBpjsNonPol #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsNonPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "asuransi",
                                        "title": "Asuransi",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "atensipimpinan",
                                        "title": "Atensi Pimpinan",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienPTT #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPTTDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "jaminanpolri",
                                        "title": "Jaminan Polri",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "kemenkes",
                                        "title": "Kemenkes",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "jamkesda",
                                        "title": "Jamkesda",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: " #:data.namapenjamin.sum  #"
                                    },
                                    {
                                        "field": "totalpenjamin",
                                        "title": "TOTAL",
                                        "width": "100px",
                                        // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                                        // "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: namapenjamin #</button>",
                                        // aggregates: ["sum"],
                                        // footerTemplate: "#:data.namapenjamin.sum  #"
                                    }
                                ]
                            }
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


            $scope.setDetail = function (e) {
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
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                }
                var isMPP = ""
                if (e.isMPP == 1) {
                    isMPP = "&isMPP=" + 1
                } else {
                    isMPP = "&isMPP=" + 0
                }

                medifirstService.get("registrasi/laporan/get-laporan-topten-diagnosa-detail?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + isMPP
                    + "&kddiagnosa=" + e.id).then(function (data) {
                        $scope.isRouteLoading = false;
                        $scope.popUpDetail.center().open();
                        var datas = data.data.result;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.dataPasienDetail = new kendo.data.DataSource({
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
            $scope.columnPasienDetail =
            {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "Detail.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "Detail.pdf",
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
                            value: "DETAIL  " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
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
                        {
                            "field": "kddiagnosa",
                            "title": "Kode Diagnosa",
                            "width": "50px"
                        },
                        {
                            "field": "namadiagnosa",
                            "title": "Nama Diagnosa",
                            "width": "50px"
                        },
                        {
                            "field": "namapasien",
                            "title": "Nama PAsien",
                            "width": "50px"
                        },
                        {
                            "field": "namarekanan",
                            "title": "Penjamin",
                            "width": "50px"
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "50px"
                        },
                        {
                            "field": "pekerjaan",
                            "title": "Pekerjaan",
                            "width": "50px"
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
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});