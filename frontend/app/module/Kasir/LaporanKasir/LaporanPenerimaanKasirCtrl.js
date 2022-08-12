define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPenerimaanKasirCtrl', ['CacheHelper', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, $http, $state, medifirstService) {
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.item.KasirMulti = []
            $scope.istempatLaporan = true;
            medifirstService.get("kasir/get-data-combo-kasir", true).then(function (dat) {
                $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.datakasir;                
                $scope.listKelompokPasien = dat.data.kelompokpasien;
                $scope.listKasir = dat.data.datakasir;
                $scope.listRekanan = dat.data.rekanan;
                $scope.listJenisLap = [
                    { id: 1, names: "Laporan Penerimaan Kasir Harian" },
                    { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }
                ];
                $scope.dataLogin = medifirstService.getPegawaiLogin();
            });
            $scope.selectOptionsKasir = {
                placeholder: "Pilih Kasir...",
                dataTextField: "namalengkap",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,

            };
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.CariLapPenerimaanKasir = function () {
                if ($scope.item.jenisLap == undefined) {
                    alert("Pilih dulu Jenis Laporan")
                    return;
                }
                LoadData()

                if ($scope.item.jenisLap.names == 'Laporan Penerimaan Kasir Harian') {
                    $scope.laporanPenerimaanHarian = false;
                    $scope.laporanPenerimaanPerusahaan = false;
                } else {
                    $scope.laporanPenerimaanPerusahaan = true;
                    $scope.laporanPenerimaanHarian = true;
                }

            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var tempKasirId = "";
                var listKasir = ""
                if ($scope.item.KasirMulti != undefined) {
                    if ($scope.item.KasirMulti.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                            var c = $scope.item.KasirMulti[i].id
                            b = "," + c
                            a = a + b
                        }
                        listKasir = a.slice(1, a.length)
                        listKasir = "&listKasir=" + listKasir;
                    }
                }
                // if ($scope.item.KasirMulti != undefined) {
                //     tempKasirId = "&listKasir=" + listKasir;
                // }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDokterId = "";
                if ($scope.item.namaPegawai != undefined) {
                    tempDokterId = "&idDokter=" + $scope.item.namaPegawai.id;
                }
                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPenerimaanKasirCtrl', chacePeriode);

                if ($scope.item.jenisLap.id == 1) {
                    $scope.item.total = 0;
                    $scope.laporanPenerimaanPerusahaan == false
                    // if ($scope.laporanPenerimaanHarian == true) {
                    medifirstService.get("kasir/get-data-lap-penerimaan-kasir-harian?"
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + listKasir
                        + tempRuanganId
                        + tempDokterId
                        + tempDepartemen
                        + tempKelPasienId).then(function (data) {
                            var doubleTotal = 0;

                            for (var i = 0; i < data.data.data.length; i++) {
                                doubleTotal = doubleTotal + parseFloat(data.data.data[i].totaldibayar)

                            }


                            $scope.item.total = doubleTotal;
                            $scope.dataPenerimaanKasir = new kendo.data.DataSource({
                                data: data.data.data,
                                pageSize: 10,
                                total: data.data.data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                        })
                }
                // if ($scope.laporanPenerimaanPerusahaan == true)

                if ($scope.item.jenisLap.id == 2) {
                    $scope.item.total = 0;
                    $scope.laporanPenerimaanPerusahaan == true
                    $scope.laporanPenerimaanHarian == false
                    medifirstService.get("kasir/get-data-lap-penerimaan-kasir-perusahaan?"
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + "&idRuangan=" + tempRuanganId
                        + "&idDokter=" + tempDokterId
                        // + "&kelompokPasien=" + tempKelPasienId
                    ).then(function (data) {
                        var dbtotal = 0;
                        for (var i = 0; i < data.data.length; i++) {
                            dbtotal = dbtotal + parseFloat(data.data[i].totalppenjamin)

                        }


                        $scope.item.total = dbtotal;
                        $scope.dataPenerimaanKasirPerusahaan = new kendo.data.DataSource({
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    })
                }
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                //debugger;
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnPenerimaanKasir = [
                {
                    "field": "noregistrasi",
                    "title": "No. Registrasi",
                    "width": "120px",
                    "template": "<span class='style-center'>#: noregistrasi #</span>"
                },
                {
                    "field": "tglsbm",
                    "title": "Tgl Bayar",
                    "width": "180px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglsbm #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No. RM",
                    "width": "120px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama",
                    "width": "180px"
                },

                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "180px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "120px"
                },
                {
                    "field": "namaLengkap",
                    "title": "Dokter",
                    "width": "180px"
                },
                {
                    "field": "kasir",
                    "title": "Kasir",
                    "width": "150px",
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Biaya",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #','')}}</span>",
                },
                {
                    "field": "hutangpenjamin",
                    "title": "Hutang Penjamin",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hutangpenjamin #','')}}</span>",
                },
                {
                    "field": "totaldibayar",
                    "title": "Jml Bayar",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #','')}}</span>",
                },
                {
                    "field": "tunai",
                    "title": "Tunai",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: tunai #','')}}</span>",
                },
                {
                    "field": "nontunai",
                    "title": "Card/CC",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: nontunai #','')}}</span>",
                },
                {
                    "field": "tglclosing",
                    "title": "Tgl Setor",
                    "width": "100px",
                }
            ];

            $scope.columnPenerimaanKasirPerusahaan = [
                {
                    "field": "noregistrasi",
                    "title": "No. Registrasi",
                    "width": "100px",
                    "template": "<span class='style-center'>#: noregistrasi #</span>"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "120px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No. RM",
                    "width": "80px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama",
                    "width": "180px"
                },

                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "120px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "120px"
                },
                {
                    "field": "namaLengkap",
                    "title": "Dokter",
                    "width": "180px"
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Bayar",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #','')}}</span>",
                },
                {
                    "field": "totalppenjamin",
                    "title": "Piutang Penjamin",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalppenjamin #','')}}</span>",
                },
                // {
                //     "field": "totalsudahdibayar",
                //     "title": "Total ",
                //     "width": "120px",
                //     "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #','')}}</span>",
                // },
                {
                    "field": "sisabayar",
                    "title": "Di Tanggung Pasien",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: sisabayar #','')}}</span>",
                },

            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPenerimaanKasir();
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

            $scope.CetakLaporanPenerimaanHarian = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = $scope.item.departement.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.namaKasir != undefined) {
                    idPegawai = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var tempKasirId = "";
                var listKasir = ""
                if ($scope.item.KasirMulti != undefined) {
                    if ($scope.item.KasirMulti.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                            var c = $scope.item.KasirMulti[i].id
                            b = "," + c
                            a = a + b
                        }
                        idPegawai = a.slice(1, a.length)
                        // idPegawai = "&listKasir=" + idPegawai;
                        idPegawai = idPegawai;
                    }
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + "&listKasir=" + idPegawai + '&idDept=' + tempDepartemen + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
                // });
                var kondisi = " sbm.tglsbm between '" + tglAwal + "' and '" + tglAkhir + "'";
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.dataLogin.namaLengkap, kondisi],
                    "paramType": ["", "date", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporanpenerimaankasirharian.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/laporanpenerimaankasirharian.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanPenerimaanHarianRJ = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = $scope.item.departement.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.namaKasir != undefined) {
                    idPegawai = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-setorRJ=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + tempDepartemen + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
                });
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan='+$scope.dataLogin.id+
                //     '&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&idRuangan='+ruanganId+'&idDokter='+dokter+'&namaKasir='+$scope.dataLogin.namaLengkap+'&view=true', function(response) {

                // });
            }
            $scope.CetakLaporanRekonTindakan = function () {
                var dokter = ''
                var listKasir = ""
                if ($scope.item.KasirMulti != undefined) {
                    if ($scope.item.KasirMulti.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                            var c = $scope.item.KasirMulti[i].id
                            b = "," + c
                            a = a + b
                        }
                        listKasir = a.slice(1, a.length)
                        listKasir = "&listKasir=" + listKasir;
                    } else {
                        listKasir = "&listKasir=" + "";
                    }

                }
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = $scope.item.departement.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.KasirMulti != undefined) {
                    idPegawai = listKasir
                } else {
                    idPegawai = "&listKasir=" + "";
                }
                var tempKelPasienId = "";
                if ($scope.item.rekanan != undefined) {
                    tempKelPasienId = $scope.item.rekanan.id;
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-rekontindakan=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&kelompokpasien=' + tempKelPasienId + '&idDept=' + tempDepartemen + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true' + idPegawai, function (response) {
                });
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan='+$scope.dataLogin.id+
                //     '&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&idRuangan='+ruanganId+'&idDokter='+dokter+'&namaKasir='+$scope.dataLogin.namaLengkap+'&view=true', function(response) {

                // });
            }
            $scope.CetakLaporanRekonPendaftaran = function () {
                var dokter = ''
                var listKasir = ""
                if ($scope.item.KasirMulti != undefined) {
                    if ($scope.item.KasirMulti.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                            var c = $scope.item.KasirMulti[i].id
                            b = "," + c
                            a = a + b
                        }
                        listKasir = a.slice(1, a.length)
                        listKasir = "&listKasir=" + listKasir;
                    } else {
                        listKasir = "&listKasir=" + "";
                    }

                }
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = $scope.item.departement.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.KasirMulti != undefined) {
                    idPegawai = listKasir;
                } else {
                    idPegawai = listKasir;
                }

                var tempKelPasienId = "";
                if ($scope.item.rekanan != undefined) {
                    tempKelPasienId = $scope.item.rekanan.id;
                }

                var kelompok = "";
                if ($scope.item.kelompokPasien != undefined) {
                    kelompok = $scope.item.kelompokPasien.id;
                }

                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-rekonpendaftaran=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&kelompokpasien=' + tempKelPasienId + '&idDept=' + tempDepartemen + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true' + '&kelompok=' + kelompok + idPegawai + '&rekanan=' + tempKelPasienId, function (response) {
                });
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan='+$scope.dataLogin.id+
                //     '&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&idRuangan='+ruanganId+'&idDokter='+dokter+'&namaKasir='+$scope.dataLogin.namaLengkap+'&view=true', function(response) {

                // });
            }

            $scope.CetakLaporanHtml = function () {
                $("#totalpostklaim").text("Test");
                $("#namapasien").text("tes");
                $("#noregistrasi").text("test");
                $("#tglpulang").text("test");
                $("#kelompokpasien").text("test");
                var htmlStart =
                    '<!DOCTYPE html>' +
                    '<html style="border:none;border-color: white">' +
                    '<head style="border:none;border-color: white">' +
                    // '<div class="header" style="position: fixed;top: 0;">'+
                    // header +
                    '<style>' +
                    'html { font: 11pt sans-serif; }' +
                    '.k-grid { border-top-width: 0; }' +
                    '.k-grid, .k-grid-content { height: auto !important; }' +
                    '.k-grid-content { overflow: visible !important; }' +
                    '.k-grid .k-grid-header th { border-top: none; }' +
                    '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                    '</style>' +
                    '</div>' +
                    '</head>' +
                    '<body  style="border:none; border-color: white">' +
                    '<table  style="border:none; border-color: white">' +
                    '<thead style="border:none;border-color: white">' +
                    '<tr style="border:none;border-color: white">' +
                    '<td style="border:none;border-color: white">' +
                    // '<div class="page-header-space"></div>' +
                    '<div style="border:none;border-color: white">' +
                    // header +	                             
                    '</div>' +
                    '</td>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr>' +
                    '<td>'
                var htmlEnd =
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</body>' +
                    '</div>' +


                    '</html>';
                var printdata = document.getElementById("laporanHtml");
                printdata = printdata.innerHTML;
                printdata = htmlStart + printdata + htmlEnd;
                var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                WindowObject.document.writeln(printdata);
                WindowObject.document.close();
                WindowObject.focus();
            }

            $scope.CetakLaporanPenerimaanPerusahaan = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.namaKasir != undefined) {
                    idPegawai = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-perusahaan=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
                });
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan='+$scope.dataLogin.id+
                //     '&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&idRuangan='+ruanganId+'&idDokter='+dokter+'&namaKasir='+$scope.dataLogin.namaLengkap+'&view=true', function(response) {

                // });
            }

            $scope.CetakRincianPendapatanAdminMaterai = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.namaKasir != undefined) {
                    idPegawai = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-pendapatan-adminmaterai=1' +//$scope.item.namaKasir.id+
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&PrinteDBY=' + $scope.dataLogin.namaLengkap + '&idDokter=1' + '&tgllibut=1' + '&view=1', function (response) {

                    });
            }

            $scope.CetakLaporanPenerimaan = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var idPegawai = ''
                if ($scope.item.namaKasir != undefined) {
                    idPegawai = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=' + idPegawai +
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

                    });
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan='+$scope.dataLogin.id+
                //     '&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&idRuangan='+ruanganId+'&idDokter='+dokter+'&namaKasir='+$scope.dataLogin.namaLengkap+'&view=true', function(response) {

                // });
            }

            $scope.CetakRekapPenerimaanKasir = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-rekap-penerimaan=' + $scope.item.namaKasir.id +
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

                    });
            }

            $scope.CetakLaporanPenerimaanFFS = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-ffs=' + $scope.item.namaKasir.id +
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

                    });
            }

            $scope.CetakLaporanPenerimaanRemun = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-remun=' + $scope.item.namaKasir.id +
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

                    });
            }

            // $scope.CetaklapPenerimaanPertransaksi=function(){
            //     var dokter = ''
            //     if ($scope.item.namaPegawai != undefined) {
            //         dokter = $scope.item.namaPegawai.id
            //     }
            //     var ruanganId = ''
            //     if ($scope.item.ruangan != undefined) {
            //         ruanganId = $scope.item.ruangan.id
            //     }

            //     var kasirId = ''
            //     if ($scope.item.namaKasir != undefined) {
            //         kasirId = $scope.item.namaKasir.id
            //     }
            //     var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            //     var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=' + kasirId+
            //         '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

            //         });
            //    }

            $scope.CetaklapPenerimaanPertransaksi = function () {
                var dokter = ''
                if ($scope.item.namaPegawai != undefined) {
                    dokter = $scope.item.namaPegawai.id
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }

                var kasirId = ''
                if ($scope.item.namaKasir != undefined) {
                    kasirId = $scope.item.namaKasir.id
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-lapporan-detailkasir-pertransaksi=' + kasirId +
                    '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

                    });
            }

            //       $scope.tglPelayanan = $scope.item.pelayanan;
            //       $scope.dokter = $scope.item.namaPegawai;

            //       $scope.listDataFormat = [

            //            {
            //            "id":1, "format":"pdf"
            //            },
            //            {
            //             "id":2, "format":"xls"
            //            }

            // 	 ]

            //       debugger;
            //       $scope.date = new Date();
            //       var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //       //Tanggal Default
            //       $scope.item.tglawal = tanggals+" 00:00";
            //       $scope.item.tglakhir= tanggals+" 12:59";

            //       // Tanggal Inputan
            //       $scope.tglawal = $scope.item.tglawal;
            //       $scope.tglakhir = $scope.item.tglakhir;

            //       $scope.CetakGeneral = function() {
            //       if($scope.item.format == undefined){
            //       	alert('format file harus dipilih terlebih dahulu !!!')
            //       }
            //       if($scope.item.tglawal == $scope.tglawal || $scope.item.tglakhir == $scope.tglakhir){
            //       var tglawal = $scope.item.tglawal;
            //       var tglakhir = $scope.item.tglakhir;
            //       }else{
            //       var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
            //       var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
            //       }
            //       if($scope.item.KelompokPasien == undefined && $scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasien?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasien?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien="+$scope.item.KelompokPasien.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.KelompokPasien == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasien?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }else{
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasien?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien="+$scope.item.KelompokPasien.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //    };


            //    $scope.CetakKarcis = function() {
            //       if($scope.item.format == undefined){
            //       	alert('format file harus dipilih terlebih dahulu !!!')
            //       }
            //       if($scope.item.tglawal == $scope.tglawal || $scope.item.tglakhir == $scope.tglakhir){
            //       var tglawal = $scope.item.tglawal;
            //       var tglakhir = $scope.item.tglakhir;
            //       }else{
            //       var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
            //       var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
            //       }
            // if($scope.item.KelompokPasien == undefined && $scope.item.ruangan == undefined){	
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienKarcis?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.KelompokPasien == undefined){	
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienKarcis?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.ruangan == undefined){	
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienKarcis?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien="+$scope.item.KelompokPasien.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }else{
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienKarcis?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien="+$scope.item.KelompokPasien.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //    };

            //    $scope.CetakTanpaKarcis = function() {
            //    if($scope.item.format == undefined){
            //       	alert('format file harus dipilih terlebih dahulu !!!')
            //       }
            //       if($scope.item.tglawal == $scope.tglawal || $scope.item.tglakhir == $scope.tglakhir){
            //       var tglawal = $scope.item.tglawal;
            //       var tglakhir = $scope.item.tglakhir;
            //       }else{
            //       var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
            //       var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
            //       }
            //    if($scope.item.KelompokPasien == undefined && $scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien=&idDokter="+$scope.item.namaPegawai.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //    }

            //    else if($scope.item.KelompokPasien == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien=&idDokter="+$scope.item.namaPegawai.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //    }
            //    else if ($scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien="+$scope.item.KelompokPasien.id+"&idDokter="+$scope.item.namaPegawai.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //    }else{
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien="+$scope.item.KelompokPasien.id+"&idDokter="+$scope.item.namaPegawai.id+"&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //    }
            //    };

            //    $scope.CetakTanpaKarcisAll = function() {
            //    if($scope.item.format == undefined){
            //       	alert('format file harus dipilih terlebih dahulu !!!')
            //       }
            //       if($scope.item.tglawal == $scope.tglawal || $scope.item.tglakhir == $scope.tglakhir){
            //       var tglawal = $scope.item.tglawal;
            //       var tglakhir = $scope.item.tglakhir;
            //       }else{
            //       var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
            //       var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
            //       }
            //    if($scope.item.KelompokPasien == undefined && $scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByAllDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien=&idDokter=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.KelompokPasien == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByAllDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien=&idDokter=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }
            //       else if($scope.item.ruangan == undefined){
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByAllDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan=&idjenisPasien="+$scope.item.KelompokPasien.id+"&idDokter=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //       }else{
            //       var urlLaporan = ReportPelayanan.open("reporting/lapPelayananPasienByAllDokter?startDate="+tglawal+"&endDate="+tglakhir+"&idRuangan="+$scope.item.ruangan.id+"&idjenisPasien="+$scope.item.KelompokPasien.id+"&idDokter=&format="+$scope.item.format.format);
            //       window.open(urlLaporan, '_blank');
            //    }
            //    };

        }

    ]);
});