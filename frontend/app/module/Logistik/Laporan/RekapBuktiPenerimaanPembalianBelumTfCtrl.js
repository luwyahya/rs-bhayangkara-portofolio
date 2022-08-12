define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapBuktiPenerimaanPembalianBelumTfCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', 'CacheHelper',
        function ($scope, dateHelper, $http, $state, medifirstService, cacheHelper) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listDataDokter = dat.data.dokter;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                });
            }

            function init() {
                $scope.isRouteLoading = true;

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-laporan-rekap-bukti-penerimaan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&status=" + "RP", true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.data
                        var total = 0;

                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            total = parseFloat(data2[i].totalharusdibayar) + total;
                        }
                        $scope.item.totalSemua = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.data,
                            schema: {
                                model: {

                                }
                            },
                            pageSize: 200,
                            total: dat.data.data.length,
                            serverPaging: false,

                        });
                    });


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('RekapBuktiPenerimaanPembalianBelumTfCtrl', chacePeriode);


            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.ruangan = undefined;
                $scope.item.kelompokPasien = undefined;
                $scope.item.dokter = undefined;
            }

            $scope.cariFilter = function () {

                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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

            $scope.CetakLapDetail = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt,
                    function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapRekap = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt,
                    function (response) {
                        // do something with response

                    });
            }


            $scope.CetakLapBhpDetail = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat BHP? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat-Bhp=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt,
                    function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapBhpRekap = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat BHP? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat-Bhp=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt,
                    function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapApotik = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Kwitansi Apotik? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-KwitansiApotik=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt,
                    function (response) { });
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "RekapBuktiPenerimaanPembalianBelumTf.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: " RS BHAYANGKARA TK IV CIANJUR Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
                        fontSize: 18,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];


                    // var sheet1 = e.workbook.sheets[0];
                    // sheet1.frozenRows = 2;
                    // sheet1.mergedCells = ["B1:M1"];
                    // sheet1.name = "Report";

                    // var myHeaders1 = [{
                    //     value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
                    //     fontSize: 12,
                    //     textAlign: "center",
                    //     background: "#ffffff",
                    //     // color:"#ffffff"
                    // }];

                    // sheet1.rows.splice(0, 0, { cells: myHeaders1, type: "header", height: 70 });
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "45px",
                }, {
                    "field": "namarekanan",
                    "title": "Nama Penyedia",
                    "width": "100px",
                },
                {
                    "field": "nostruk",
                    "title": "No Bukti",
                    "width": "100px",
                },
                {
                    "field": "nostruk",
                    "title": "Nomor D/O",
                    "width": "100px",
                },
                {
                    "field": "tglfaktur",
                    "title": "Tgl. Faktur",
                    "width": "100px",
                },
                {
                    "field": "tglstruk",
                    "title": "Tgl. Terima",
                    "width": "100px",
                },
                {
                    "field": "nofaktur",
                    "title": "Nomor Faktur",
                    "width": "100px",
                },

                {
                    "field": "tgljatuhtempo",
                    "title": "tgl. jatuh tempo",
                    "width": "100px",
                }
                    // {
                    //     "field": "satuanstandar",
                    //     "title": "satuans",
                    //     "width": "100px",
                    // },
                    , {
                    "field": "totalharusdibayar",
                    "title": "Total Rp.",
                    "width": "100px",
                    template: "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp. ')}}</span>",
                }
                    // {
                    //     "field": "jumlah",
                    //     "title": "jumlah",
                    //     "width": "30px",
                    // },
                    // {
                    //     "field": "total",
                    //     "title": "Total Rp.",
                    //     "width": "100px",

                    //     template: "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>",
                    // }
                ]
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});