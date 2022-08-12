define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarSPKCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = false;
            $scope.istempatLaporan2 = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarSPKCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                } else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
                    init();
                }
            }

            function loadCombo() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });
                medifirstService.getPart("logistik/get-combo-rekanan-logistik", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                });
            }
            $scope.Tambah = function () {
                $state.go('KegiatanSPK')
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var rek = ""
                if ($scope.item.namarekanan != undefined) {
                    var rek = "&namarekanan=" + $scope.item.namarekanan.namarekanan
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-spk?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noKontrak=" + $scope.item.nousulan +
                    "&keterangan=" + $scope.item.jenisusulan +
                    "&namarekanan=" + $scope.item.namarekanan +
                    produkfk +
                    rek, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var dataPasien = [];
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            if (dat.data.daftar[i].status == 1) {
                                dat.data.daftar[i].status2 = "Done"
                            } else {
                                dat.data.daftar[i].status2 = ""
                            }
                        }
                        $scope.dataGrid = dat.data.daftar;
                        pegawaiUser = dat.data.datalogin
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
                cacheHelper.set('DaftarSPKCtrl', chacePeriode);
            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.newSPPB = function () {
                // debugger;
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangSPPBCtrl', chacePeriode);
                $state.go('OrderBarangSPPB', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'EditOrder'
                });
            }

            $scope.PenerimaanSPK = function () {
                var chacePeriode = {
                    0: '',
                    1: 'SPK',
                    2: $scope.dataSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'SPK'
                });
            }
            // function cetakdetail() {

            $scope.cetakdetail = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59:00');

                var x = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                var romawi = moment($scope.item.tglAwal).format('MM');
                var bulan = moment($scope.item.tglAwal).format('MMMM YY');
                bulan = "Padang, " + bulan;
                debugger;
                if (romawi == 1) {
                    romawi = 'I'
                } else if (romawi == 2) {
                    romawi = 'II'
                } else if (romawi == 3) {
                    romawi = 'III'
                } else if (romawi == 4) {
                    romawi = 'IV'
                } else if (romawi == 5) {
                    romawi = 'V'
                } else if (romawi == 6) {
                    romawi = 'VI'
                } else if (romawi == 7) {
                    romawi = 'VII'
                } else if (romawi == 8) {
                    romawi = 'VIII'
                } else if (romawi == 9) {
                    romawi = 'IX'
                } else if (romawi == 10) {
                    romawi = 'X'
                } else if (romawi == 11) {
                    romawi = 'XI'
                } else if (romawi == 12) {
                    romawi = 'XII'
                }

                var h = "B / /" + romawi + "/2021/INSTALASI FARMASI"
                var keterangan = "";
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                medifirstService.get("logistik/totalperencanaan?" +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, true)
                    .then(function (dat) {
                        debugger;
                        for (var i = dat.data.daftar.length - 1; i >= 0; i--) {
                            keterangan = keterangan + dat.data.daftar[i].detailjenisproduk + " : Rp " + parseFloat(dat.data.daftar[i].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + "\n";
                        }
                        var where = "   (orderpelayanan_t.tglpelayanan BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')"
                        debugger;
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "z", "h", "bulan"],
                            "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", where, tglAkhir.toString(), x.toString(), y.toString(), keterangan.toString(), h.toString(), bulan.toString()],
                            "paramType": ["", "", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/perencanaan.pdf');

                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/perencanaan.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/perencanaan.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/perencanaan.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/perencanaan.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/perencanaan.pdf');
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

            }

            $scope.CetakJasper = function () {

                $scope.isRouteLoading = true;
                $scope.dataSelected.norec
                var norec = $scope.dataSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "norec"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", $scope.dataSelected.norec.toString()],
                    "paramType": ["", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan2');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('http://appsimrs.rsp.unand.ac.id') > -1) {
                    xhr.open('POST', 'http://http://appsimrs.rsp.unand.ac.id:8797/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/CetakSPK.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/CetakSPK.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/CetakSPK.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }



            // function cetakttd() {
            $scope.cetakttd = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');

                var tglAwal2 = moment($scope.item.tglAwal).format('YYYY-MM');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), tglAwal2.toString()],
                    "paramType": ["", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan2');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/perencanaanttd.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/perencanaanttd.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/perencanaanttd.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/perencanaanttd.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/perencanaanttd.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/perencanaanttd.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.Perencanaan = function () {
                cetakdetail();

            }

            $scope.Verifikasi = function () {
                var chacePeriode = {
                    0: '',
                    1: 'VerifSPK',
                    2: $scope.dataSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('InputSPKBaruCtrl', chacePeriode);
                $state.go('InputSPKBaru', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'VerifSPK'
                });
            }

            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti SPK? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-spk=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }

            $scope.EditTerima = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('InputSPKCtrl', chacePeriode);
                $state.go('InputSPK', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'EditTerima'
                });
            }

            $scope.HapusSPK = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }

                if ($scope.dataSelected.norecpenerimaan != undefined) {
                    alert("SPK Sudah Diterima, Tidak Dapat Dihapus!!")
                    return;
                }

                medifirstService.get("logistik/get-data-spkkeupk?" +
                    "&ketOrder=" + $scope.dataSelected.keterangan +
                    "&rekananfk=" + $scope.dataSelected.rekananfk, true)
                    .then(function (dat) {
                        var data = dat.data;
                        var datae = {
                            "data": data,
                        }
                        var datas = {
                            "norec_so": $scope.dataSelected.norec,
                            "nokontrakspk": $scope.dataSelected.nospk
                        }

                        if (data != undefined) {
                            medifirstService.post('logistik/save-ubah-status-spk', datae).then(function (e) {
                                // init()
                            })
                            medifirstService.post('logistik/delete-data-spk', datas).then(function (e) {
                                init()
                            })
                        }
                    });
            }

            $scope.TambahSPK = function () {
                $state.go('InputSPK');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "35px",
            },
            {
                "field": "nospk",
                "title": "No PO",
                "width": "120px"
            },
            {
                "field": "tglorder",
                "title": "Tanggal",
                "width": "58px",
                "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
            },
            {
                "field": "supplier",
                "title": "Supplier",
                "width": "120px"
            },
            {
                "field": "jmlitem",
                "title": "Item",
                "width": "35px",
                "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
            },
            {
                "field": "ruangan",
                "title": "Unit Pembuat",
                "width": "120px",
            },
            {
                "field": "penanggungjawab",
                "title": "Pembuat PO",
                "width": "110px",
            },
            {
                "field": "mengetahui",
                "title": "Mengetahui",
                "width": "110px",
            },
            {
                "field": "ruangantujuan",
                "title": "Unit Peminta",
                "width": "120px",
            }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "tglkebutuhan",
                        "title": "Tgl Kebutuhan",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
                    },
                    {
                        "field": "prid",
                        "title": "Kode Produk",
                        "width": "40px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "90px",
                    },
                    {
                        "field": "spesifikasi",
                        "title": "Spesifikasi",
                        "width": "100px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "30px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "50px",
                    },
                    {
                        "field": "qtyterimalast",
                        "title": "Sdh Terima",
                        "width": "65px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn ' // + bln + ' bln'
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
            //***********************************
        }
    ]);
});