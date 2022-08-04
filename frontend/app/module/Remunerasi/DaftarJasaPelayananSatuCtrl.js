define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarJasaPelayananSatuCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 50
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0

            var dataSave = []
            var dataPegawaiAll = []
            var data3 = []
            loadCombo();
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()
            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarJasaPelayananSatuCtrl2');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = moment(new Date(arrPeriode[0])).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment(new Date(arrPeriode[1])).format('YYYY-MM-DD 23:59');
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');;
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');;
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("remunerasi/get-combo", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.Hitung = function () {
                $scope.popupHitungRemunerasi.center().open();
                //remunerasi/get-hitung-jasa-pelayanan-satu
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                medifirstService.get("remunerasi/get-hitung-jasa-pelayanan-satu-rev2?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, false).then(function (data) {
                        $scope.isRouteLoading = false;
                        dataSave = data.data.datasave
                        $scope.dataHitung1 = new kendo.data.DataSource({
                            data: data.data.pegawaijasapelayanan,
                            pageSize: 10,
                            serverPaging: false
                        });
                        dataPegawaiAll = data.data.dataPegawaiRemunTidakLangsung
                        $scope.dataHitung2 = new kendo.data.DataSource({
                            data: data.data.dataPegawaiRemunTidakLangsung,
                            pageSize: 10,
                            serverPaging: false
                        });
                        $scope.isRouteLoading = false;
                    })
            }

            $scope.columndataHitung1 = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "pgid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "80px"
                    }
                ]
            };

            $scope.columndataHitung1D = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "70px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl. Pelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "150px"
                    },
                    // {
                    // 	"field": "jumlah",
                    // 	"title": "Jml. Pelayanan",
                    // 	"width":"80px"
                    // },
                    {
                        "field": "jenispaginilaitotal",
                        "title": "Jasa Pelayanan",
                        "width": "80px"
                    }
                ]
            };

            $scope.columndataHitung2 = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "pgid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    }
                    // ,
                    // {
                    // 	"field": "jenispagu",
                    // 	"title": "Jenis Pagu",
                    // 	"width":"80px"
                    // }
                ]
            };
            $scope.columndataHitung2D = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "70px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Layanan",
                        "width": "80px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Layanan",
                        "width": "150px"
                    },
                    {
                        "field": "jenispaginilaitotal",
                        "title": "Nilai",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jenispaginilaitotal #', '')}}</span>"
                    }
                ]
            };


            $scope.dklikGriddataHitung2 = function (dataHitung2DSelected) {
                var dataGrid = []
                var sama = false
                var tototototal = 0
                for (var i = 0; i < dataSave.length; i++) {
                    sama = false
                    if (dataSave[i].pegawaiid == dataHitung2DSelected.pgid) {
                        tototototal = tototototal + parseFloat(dataSave[i].jenispaginilaitotal)
                        // for (var j = 0; j < dataGrid.length; j++) {
                        // 	if (dataGrid[j].jenispagu == dataSave[i].jenispagu) {
                        // 		dataGrid[j].jenispaginilaitotal = parseFloat(dataGrid[j].jenispaginilaitotal) + parseFloat(dataSave[i].jenispaginilaitotal)
                        // 		sama = true
                        // 		break;
                        // 	}
                        // }
                        // if (sama ==  false) {
                        dataGrid.push(dataSave[i])
                        // }
                    }
                }
                $scope.item.totaltotaltea = parseFloat(tototototal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                $scope.dataHitung2D = new kendo.data.DataSource({
                    data: dataGrid,
                    pageSize: 10,
                    serverPaging: false
                });
            }
            // $scope.Cari()=Function {
            $scope.Cari = function (data) {
                var strinFilter = ''
                var dtgrd = []
                if ($scope.item.namapegawai != '') {
                    for (var i = 0; i < dataPegawaiAll.length; i++) {
                        strinFilter = dataPegawaiAll[i].namalengkap
                        if (strinFilter.toLowerCase().indexOf($scope.item.namapegawai) !== -1) {
                            dtgrd.push(dataPegawaiAll[i])
                        }

                    }
                    $scope.dataHitung2 = new kendo.data.DataSource({
                        data: dtgrd,
                        pageSize: 10,
                        serverPaging: false
                    });
                } else {
                    $scope.dataHitung2 = new kendo.data.DataSource({
                        data: dataPegawaiAll,
                        pageSize: 10,
                        serverPaging: false
                    });
                }

            };
            $scope.dklikGriddataHitung1 = function (dataHitung1Selected) {
                var dataGrid2 = []
                for (var i = 0; i < dataSave.length; i++) {
                    if (dataSave[i].pegawaiid == dataHitung1Selected.pgid) {
                        dataGrid2.push(dataSave[i])
                    }
                }
                $scope.dataHitung1D = new kendo.data.DataSource({
                    data: dataGrid2,
                    pageSize: 10,
                    serverPaging: false
                });
            }


            $scope.columnData1 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Pagu Remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Pagu Remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "tglstrukpagu",
                        "title": "Tgl Struk Pagu",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglstrukpagu #')}}</span>",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "nostrukpagu",
                        "title": "Nostrukpagu",
                        "width": "100px"
                    },
                    {
                        "field": "periodeawal",
                        "title": "Tgl Pelayanan",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: periodeawal #')}}</span>"
                    },
                    //         	{
                    // 	"field": "periodeakhir",
                    // 	"title": "Periode Akhir",
                    // 	"width":"100px",
                    // 	"template": "<span class='style-left'>{{formatTanggal('#: periodeakhir #')}}</span>"
                    // },
                    {
                        "field": "totalrcdokter",
                        "title": "DIREKSI",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrcdokter #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalrcdokter.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalrc",
                        "title": "STRUKTURAL",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrc #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalrc.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalpostrm",
                        "title": "ADMINISTRASI",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalpostrm #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalpostrm.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccdireksi",
                        "title": "JPL",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccstaffdireksi",
                        "title": "JPTL",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccstaffdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccstaffdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccmanajemen",
                        "title": "GABUNGAN",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccmanajemen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccmanajemen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            };


            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-daftar-jasa-layanan-pagu-rev2?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // data1 = data[0].data.data1
                    data3 = data[0].data.datapersen
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    totalrcdokter: { type: "number" },
                                    totalpostrm: { type: "number" },
                                    totalrc: { type: "number" },
                                    totalccdireksi: { type: "number" },
                                    totalccstaffdireksi: { type: "number" },
                                    totalccmanajemen: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'totalrcdokter', aggregate: 'sum' },
                            { field: 'totalpostrm', aggregate: 'sum' },
                            { field: 'totalrc', aggregate: 'sum' },
                            { field: 'totalccdireksi', aggregate: 'sum' },
                            { field: 'totalccstaffdireksi', aggregate: 'sum' },
                            { field: 'totalccmanajemen', aggregate: 'sum' }

                        ]
                    });
                    var chacePeriode = tglAwal + "~" + tglAkhir;
                    cacheHelper.set('DaftarJasaPelayananSatuCtrl', chacePeriode);
                    var chacePeriode = tglAwal + "~" + tglAkhir;
                    cacheHelper.set('DaftarJasaPelayananSatuCtrl2', chacePeriode);
                });

            };


            $scope.klikGrid1 = function (data1Selected) {
                if (data1Selected != undefined) {
                    $scope.item.nostrukpagu = data1Selected.nostrukpagu
                }
            }
            $scope.MapPegawai = function () {
                $state.go("MappingJasaPelayananToPegawai")
            }
            $scope.potongan = function () {
                $state.go("PotonganRemunPegawai")
            }
            $scope.detail = function () {
                $scope.popupKomponen.center().open();
                var nostruk = ''
                if ($scope.item.nostrukpagu != undefined) {
                    nostruk = $scope.item.nostrukpagu
                }
                medifirstService.get("remunerasi/get-detail-jasa-layanan-pagu?" + "&nostrukpagu=" + nostruk, false).then(function (data) {
                    $scope.isRouteLoading = false;
                    // datagrid2 = data.data.data2
                    // data3 = data.data.datasave
                    $scope.ddata1 = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    ttlremunDokter: { type: "number" },
                                    ttlremunParamedis: { type: "number" },
                                    ttlremunRekamMedis: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'ttlremunDokter', aggregate: 'sum' },
                            { field: 'ttlremunParamedis', aggregate: 'sum' },
                            { field: 'ttlremunRekamMedis', aggregate: 'sum' }

                        ]
                    });
                    $scope.ddata2 = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        // total:data2.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    ttljasaSDM: { type: "number" },
                                    ttljasaManajemen: { type: "number" },
                                    ttljasaNonStruktural: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'ttljasaSDM', aggregate: 'sum' },
                            { field: 'ttljasaManajemen', aggregate: 'sum' },
                            { field: 'ttljasaNonStruktural', aggregate: 'sum' }

                        ]
                    });
                    $scope.ddata2rincian = new kendo.data.DataSource({
                        data: data.data.datakelompokpegawai,
                        pageSize: 10,
                        // total:data2.data,
                        serverPaging: false//,
                        //  schema: {
                        //     model: {
                        //         fields: {
                        //             ttljasaSDM: { type: "number" },
                        //             ttljasaManajemen: { type: "number" },
                        //             ttljasaNonStruktural: { type: "number" }
                        //         }
                        //     }
                        // },
                        // aggregate: [
                        //     { field: 'ttljasaSDM', aggregate: 'sum' },
                        //     { field: 'ttljasaManajemen', aggregate: 'sum' },
                        //     { field: 'ttljasaNonStruktural', aggregate: 'sum' }

                        // ]
                    });
                })
            }
            $scope.dcolumnData1 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Pagu Remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Pagu Remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "produkfk",
                        "title": "Kode Produk",
                        "width": "50px",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "150px"
                    },
                    {
                        "field": "totalpostrm",
                        "title": "totalpostrm",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalpostrm #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalpostrm.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalrc",
                        "title": "totalrc",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrc #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalrc.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalrcdokter",
                        "title": "totalrcdokter",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrcdokter #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalrcdokter.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccdireksi",
                        "title": "totalccdireksi",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccstaffdireksi",
                        "title": "totalccstaffdireksi",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccstaffdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccstaffdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "totalccmanajemen",
                        "title": "totalccmanajemen",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalccmanajemen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalccmanajemen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            };
            $scope.dcolumnData2 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Nilai Pagu remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Nilai Pagu remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "produkfk",
                        "title": "Kode Produk",
                        "width": "50px",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "150px"
                    },
                    {
                        "field": "ttljasaSDM",
                        "title": "Jasa SDM",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaSDM #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaSDM.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ttljasaManajemen",
                        "title": "Jasa Manajemen",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaManajemen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaManajemen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ttljasaNonStruktural",
                        "title": "Jasa Non Struktural",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaNonStruktural #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaNonStruktural.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            };

            $scope.dcolumnData2rincian = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jpid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "150px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml. Pegawai",
                        "width": "80px"
                    }
                ]
            };



            $scope.saveClosingRemunerasi = function () {
                let norecsc = ''
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                var objSave =
                {
                    head: {
                        periodeawal: tglAwal,
                        periodeakhir: tglAkhir,
                        norecsc: norecsc
                    }
                }

                medifirstService.post('remunerasi/save-closing-pr', objSave).then(function (e) {
                    norecsc = e.data.norecsc
                    var objSave =
                    {
                        head: {
                            periodeawal: tglAwal,
                            periodeakhir: tglAkhir,
                            norecsc: norecsc
                        }
                    }
                    medifirstService.post('remunerasi/save-closing-rcd', objSave).then(function (e) {
                        medifirstService.post('remunerasi/save-closing-rc', objSave).then(function (e) {
                            medifirstService.post('remunerasi/save-closing-cc', objSave).then(function (e) {
                                medifirstService.post('remunerasi/save-closing-ccs', objSave).then(function (e) {
                                    medifirstService.post('remunerasi/save-closing-potongan', objSave).then(function (e) {
                                        $scope.isRouteLoading = false;
                                    })
                                })
                            })
                        })
                    })
                })
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
            $scope.cetakKartu = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.tglpulang == undefined) {
                    window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noReg = "";
                else
                    var noReg = $scope.dataPasienSelected.noregistrasi;
                var stt = 'false'
                if (confirm('View Kartu Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.detailSumberDana = function(){
                $scope.popupDetailSumberDana.center().open()
            }

            $scope.columnDetailSumberDana = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Pagu Remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Pagu Remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        //"field": "",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        //"field": "",
                        "title": "Jenis",
                        "width": "150px",
                        footerTemplate: "Jumlah Dibagi"
                    },
                    {
                        //"field": "",
                        "title": "%",
                        "width": "150px"
                    }
                ]
            };
            // END ################

        }
    ]);
});