define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JasaPelayananSatuRev2Ctrl', ['$q', '$scope', 'CacheHelper', 'MedifirstService',
        function ($q, $scope, cacheHelper, medifirstService) {

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

            var data3 = []
            var datagrid2 = []
            loadCombo();
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()
            function loadCombo() {
                var chacePeriode = cacheHelper.get('JasaPelayananSatuCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = moment(new Date(arrPeriode[0])).format('YYYY-MM-DD 00:00')//new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = moment(new Date(arrPeriode[1])).format('YYYY-MM-DD 23:59')//new Date(arrPeriode[1]);	
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00')//$scope.now;
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')//$scope.now;
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("remunerasi/get-combo", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                })

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
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "160px"
                    },
                    {
                        "field": "hargakomponen",
                        "title": "Jasa Pelayanan",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargakomponen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargakomponen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "30px",
                        "template": "<span class='style-center'>#: jumlah #</span>"
                    },
                    {
                        "field": "jasa",
                        "title": "Jasa Cito",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasa.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "jasapelayanan",
                        "title": "Total",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasapelayanan #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasapelayanan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "dokterpj",
                        "title": "Dokter Pelaksana",
                        "width": "150px",
                        "template": "<span class='style-left'>#: dokterpj #</span>"
                    },
                    {
                        "field": "statusparamedis",
                        "title": "P",
                        "width": "20px",
                        "template": "<span class='style-center'>#: statusparamedis #</span>"
                    },
                    {
                        "field": "tipedokter",
                        "title": "Tipe Jasa",
                        "width": "100px",
                        "template": "<span class='style-left'>#: tipedokter #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "100px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    }
                ]
            };
            $scope.columnData2 = {
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
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "160px"
                    },
                    // {
                    //     "field": "statusparamedis",
                    //     "title": "P",
                    //     "width": "20px",
                    //     "template": "<span class='style-center'>#: statusparamedis #</span>"
                    // },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: namaruangan #</span>"
                    },
                    {
                        "field": "ccdireksi",
                        "title": "Direksir",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: rcdokter #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: ccdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.rcdokter.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ccdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ccstaffdireksi",
                        "title": "Struktural",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: postremun #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: ccstaffdireksi #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.postremun.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ccstaffdireksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ccmanajemen",
                        "title": "Administrasi",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: rc #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: ccmanajemen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.rc.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ccmanajemen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "rcdokter",
                        "title": "JPL",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: ccdireksi #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: rcdokter #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.ccdireksi.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.rcdokter.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "rc",
                        "title": "JPTL",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: ccstaffdireksi #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: rc #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.ccstaffdireksi.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.rc.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "postremun",
                        "title": "Gabungan",
                        "width": "80px",
                        // "template": "<span class='style-right'>#: ccmanajemen #</span>",
                        "template": "<span class='style-right'>{{formatRupiah('#: postremun #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>#: data.ccmanajemen.sum #</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.postremun.sum #', '')}}</span>",
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
                var tglAkhir = moment($scope.item.periodeAwal).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var produk = ""
                if ($scope.item.produk != undefined ) {
                    var produk = "&produk=" + $scope.item.produk
                }else if($scope.item.produk==''){
                    $scope.item.produk == undefined
                }
                var nm = ""
                if ($scope.item.nama != undefined ) {
                    var nm = "&nama=" + $scope.item.nama
                }else if($scope.item.nama==''){
                    $scope.item.nama == undefined
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
                    medifirstService.get("remunerasi/get-jasa-layanan-pagu-rev2?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + produk + nm + ins + rg + kp + dk + "&status=tgl"
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;

                    for (var i = data[0].data.data1.length - 1; i >= 0; i--) {
                        data[0].data.data1[i].hargakomponen = parseFloat(data[0].data.data1[i].jasapelayanan) - parseFloat(data[0].data.data1[i].jasa)
                        if (data[0].data.data1[i].isparamedis == "1") {
                            data[0].data.data1[i].statusparamedis = "✔"
                        } else {
                            data[0].data.data1[i].statusparamedis = ""
                        }
                    }

                    for (var i = data[0].data.data2.length - 1; i >= 0; i--) {
                        if (data[0].data.data2[i].isparamedis == "1") {
                            data[0].data.data2[i].statusparamedis = "✔"
                        } else {
                            data[0].data.data2[i].statusparamedis = ""
                        }
                    }
                    datagrid2 = data[0].data.data2
                    data3 = data[0].data.data2
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data1,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jasapelayanan: { type: "number" },
                                    jasa: { type: "number" },
                                    hargakomponen: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'jasapelayanan', aggregate: 'sum' },
                            { field: 'jasa', aggregate: 'sum' },
                            { field: 'hargakomponen', aggregate: 'sum' }

                        ]
                    });
                    $scope.data2 = new kendo.data.DataSource({
                        data: data[0].data.data2,
                        pageSize: 10,
                        // total:data2.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    postremun: { type: "number" },
                                    rc: { type: "number" },
                                    rcdokter: { type: "number" },
                                    ccdireksi: { type: "number" },
                                    ccstaffdireksi: { type: "number" },
                                    ccmanajemen: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'postremun', aggregate: 'sum' },
                            { field: 'rc', aggregate: 'sum' },
                            { field: 'rcdokter', aggregate: 'sum' },
                            { field: 'ccdireksi', aggregate: 'sum' },
                            { field: 'ccstaffdireksi', aggregate: 'sum' },
                            { field: 'ccmanajemen', aggregate: 'sum' }

                        ]
                    });
                    $scope.item.statuspagu = ''
                    if (data[0].data.strukpagu == true) {
                        $scope.item.statuspagu = 'Pagu pada periode ini sudah tersimpan.!'
                    }
                    var chacePeriode = tglAwal + "~" + tglAkhir;
                    cacheHelper.set('JasaPelayananSatuCtrl', chacePeriode);
                });
                if ($scope.item.produk == undefined) {
                    if ($scope.item.nama == undefined) {
                        $scope.item.tmblsimpan = true
                    } else {
                        $scope.item.tmblsimpan = false
                    }
                } else {
                    $scope.item.tmblsimpan = false
                }
            };


            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
                }
            }

            $scope.savePagu = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAwal).format('YYYY-MM-DD 23:59:59');
                var a = 0
                var b = 0
                var c = 0
                var e = 0
                var f = 0
                var g = 0
                for (var i = 0; i < data3.length; i++) {
                    a = a + parseFloat(data3[i].postremun)
                    b = b + parseFloat(data3[i].rcdokter)
                    c = c + parseFloat(data3[i].rc)
                    e = e + parseFloat(data3[i].ccdireksi)
                    f = f + parseFloat(data3[i].ccstaffdireksi)
                    g = g + parseFloat(data3[i].ccmanajemen)
                }
                var data1 = {
                    periodeawal: tglAwal,
                    periodeakhir: tglAkhir,
                    postremun: a,
                    rcdokter: b,
                    rc: c,
                    ccdireksi: e,
                    ccstaffdireksi: f,
                    ccmanajemen: g
                }
                var objSave =
                {
                    head: data1,
                    data: data3
                }

                medifirstService.post('remunerasi/save-struk-pagu-rev2', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
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
            // END ################

        }
    ]);
});