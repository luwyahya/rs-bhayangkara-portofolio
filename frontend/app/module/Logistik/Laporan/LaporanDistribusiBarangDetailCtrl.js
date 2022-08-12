define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanDistribusiBarangDetailCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', 'CacheHelper',
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
            $scope.istempatLaporan = true;
            var uang = "";
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganfarmasiall;
                    $scope.listDataDokter = dat.data.dokter;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.ruangan.id
                }
                var rgPengirim = ""
                if ($scope.item.ruanganPengirim != undefined) {
                    var rgPengirim = "&ruanganpengirimfk=" + $scope.item.ruanganPengirim.id
                }
                var produk = ""
                if ($scope.item.produk != undefined) {
                    var produk = "&produk=" + $scope.item.produk
                }
                // var jenisPengirim = ""
                // if ($scope.item.jenisKirim != undefined) {
                //     var jenisPengirim = "&jenisPengirim=" + $scope.item.jenisKirim.id
                // }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-laporan-distribusi-barang?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + rg + rgPengirim + produk, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.data
                        uang = dat.data.grandtotal;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                        }
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

                // var json = {
                //     'nama': 'yogs',
                //     'slsms':sdsds
                // }
                // medifirstService.poat('fsfs',jdon).then(function(e){
                //     $scope.listRuangan = e.data.dstsr
                // })
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('LaporanDistribusiBarangDetailCtrl', chacePeriode);


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
                    fileName: "LAPORAN DETAIL DISTRIBUSI AMPRAHAN.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: " RUMAH SAKIT UNIVERSITAS ANDALAS Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
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
                },
                {
                    "field": "id",
                    "title": "Kd Barang",
                    "width": "100px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang",
                    "width": "100px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Order",
                    "width": "100px",
                },
                {
                    "field": "qtyorder",
                    "title": "Jumlah Order",
                    "width": "100px",
                },
                {
                    "field": "ruanganpengirim",
                    "title": "Ruangan Pengirim",
                    "width": "100px",
                },
                // {
                //     "field": "nobatch",
                //     "title": "Nobatch",
                //     "width": "100px",
                // },
                {
                    "field": "satuanstandar",
                    "title": "satuans",
                    "width": "100px",
                },
                {
                    "field": "harga",
                    "title": "Harga Avg/satuan",
                    "width": "100px",
                    // template: "<span class='style-right'>{{formatRupiah('#: harga #', 'Rp. ')}}</span>",
                    template: "<span class='style-right'> Rp. #: harga #</span>"
                },
                {
                    "field": "jumlah",
                    "title": "jumlah",
                    "width": "30px",
                },
                {
                    "field": "total",
                    "title": "Total Rp.",
                    "width": "100px",

                    template: "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>",
                }
                ]
            };
            // $scope.formatRupiah = function (value, currency) {
            //     return currency + " " + parseFloat(value).toFixed().replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            // }

            $scope.formatRupiahx = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

            }
            $scope.CetakRegJasper = function () {
                $scope.isRouteLoading = true;
                var tempRuanganId = "";
                var tempRuanganIdAsal = "";
                if ($scope.item.ruanganPengirim != undefined) {
                    tempRuanganId = $scope.item.ruanganPengirim.id;
                } else {
                    toastr.error("Pilih Ruangan Pengirim !!");
                    return;
                }
                if ($scope.item.ruangan != undefined) {
                    tempRuanganIdAsal = $scope.item.ruangan.id;
                } else {
                    toastr.error("Pilih Ruangan Order !!");
                    return;
                }
                if (uang == 'NaN' || uang == undefined || uang == "") {
                    toastr.error("Clik Tombol Pencarian Terlebihdahulu !!");
                    return;
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                $scope.isRouteLoading = false;

                uang = parseFloat(uang).toFixed();
                var totalUang = $scope.formatRupiahx(uang, 'Rp. ');
                var newValue = uang;
                var terbilang = ""

                medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
                    function (dat) {
                        terbilang = dat.data.terbilang.toUpperCase();


                        debugger;
                        var data = {
                            "gambarLogo": "logo_rs.jpg",
                            "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "grandTotal", "ruangan", "ruanganAsal", "terbilang"],
                            "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176",
                                tglAwal, tglAkhir, totalUang, tempRuanganId, tempRuanganIdAsal, terbilang
                            ],
                            "paramType": ["", "", "", "", "", "", "", ""]
                        };

                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                //this.response is what you're looking for
                                // handler(this.response);
                                console.log(this.response, typeof this.response);
                                //var res = this.response
                                //var file = new Blob( [res], {type: 'application/pdf'});
                                debugger;
                                var url = window.URL.createObjectURL(this.response)
                                var pdf = document.getElementById('tempatLaporan');
                                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }

                        if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/BuktiPengeluaranBarang.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1002/generic/report/BuktiPengeluaranBarang.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1002/generic/report/BuktiPengeluaranBarang.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:1002/generic/report/BuktiPengeluaranBarang.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/BuktiPengeluaranBarang.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/BuktiPengeluaranBarang.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })


            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});