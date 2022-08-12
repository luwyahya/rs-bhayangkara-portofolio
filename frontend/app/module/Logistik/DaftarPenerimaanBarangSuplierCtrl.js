define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPenerimaanBarangSuplierCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();

            $scope.muncul = false;
            $scope.dataPasienSelected = {};
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            var noOrder = '';
            var hargalamatetep = '';

            var pegawaiUser = {}
            var norec_Realisasi = '';
            var norec_RealisasiKontrak = '';
            var norecRR = '';
            var keltrans = '';
            var verifikasifk = '';
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var NoOrderFk = undefined;
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var nilai = 0
            var kelTrans = '';
            var qty = 0
            var hrgsatuan = 0
            var ppn = 0
            var hargadiskon = 0
            var ppnprs = 0
            var hargadiskonprs = 0
            var sppb = '';
            var ttlTotal = 0;
            var ttlDiskon = 0;
            var ttlPpn = 0;
            var grandTotal = 0;
            var persenpp = 0;
            var norecTerima = ''
            var norecSPPB = ''
            var loadSPK = 'tidak'
            var loadSPPB = 'tidak'
            var loadSPPBDetail = 'tidak'
            var dataIN = '';
            var persenppn = 0;
            var subTtlSetelahDiskon = 0
            $scope.disableSppb = false;
            var pegawaiUser = {}
            LoadCache();
            ComboLoad();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPenerimaanBarangSuplierCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                } else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function ComboLoad() {
                medifirstService.get('logistik/get-combo-logistik').then(function (dat) {
                    $scope.listDataJabatan = dat.data.jabatan;
                    $scope.ruanganUser = dat.data.ruangan[0].namaruangan;
                    init();
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });

                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });

                medifirstService.getPart("logistik/get-combo-rekanan-logistik", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                });
                init();
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
                // $scope.item.DataJabatan1 = undefined;                 
                // $scope.item.DataPegawai1 = undefined;
                // $scope.item.DataJabatan2 = undefined;                 
                // $scope.item.DataPegawai2 = undefined;
                // $scope.item.DataJabatan3 = undefined;
                // $scope.item.DataPegawai3 = undefined
            }

            $scope.CetakAh = function () {
                var jabatan1 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan3 != undefined) {
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawai3 != undefined) {
                    pegawai3 = $scope.item.DataPegawai3.id;
                }


                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&pegawaiPenerima=' + pegawai2 + '&pegawaiPenyerahan=' + pegawai1 + '&pegawaiMengetahui=' + pegawai3 +
                    '&jabatanPenerima=' + jabatan2 + '&jabatanPenyerahan=' + jabatan1 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser,
                    function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
            }
            $scope.LaporanSupplier = function () {
                var stt = 'false'
                if (confirm('View Laporan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var objPrd = "";
                if ($scope.item.namaBarang != undefined) {
                    objPrd = $scope.item.namaBarang.id;
                }
                var jns = "";
                if ($scope.item.jenisBarang != undefined) {
                    jns = $scope.item.jenisBarang.id;
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-laporan-penerimaan-supplier-rekap=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }

            $scope.CetaPermohonan = function () {
                var data = {
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "printedBy", "nofaktur"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",
                        pegawaiUser.userData.namauser, $scope.dataSelected.nofaktur
                    ],
                    "paramType": ["", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/PermohonanBayarFaktur.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PermohonanBayarFaktur.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/PermohonanBayarFaktur.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PermohonanBayarFaktur.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }
            $scope.CetakBeritaAcara = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglayeuna = ''
                var tglnow = ''
                var tglsekarang = "Jakarta, " + moment($scope.now).format('DD-MM-YYYY');
                medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tglAwal).then(function (dat) {
                    debugger
                    tglnow = dat.data.tglsekarang;
                    tglayeuna = dat.data.tglayeuna;

                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var norec = $scope.dataSelected.norec

                    // var x = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    //  var y = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    //  var romawi = moment($scope.item.tglAwal).format('MM');
                    //  var bulan = moment($scope.item.tglAwal).format('MMMM YY');
                    //  bulan = "Jakarta, " + bulan;
                    //  debugger;
                    //  if(romawi == 1){
                    //     romawi = 'I'
                    //  }else if(romawi == 2){
                    //     romawi = 'II'
                    //  }else if(romawi == 3){
                    //     romawi = 'III'
                    //  }else if(romawi == 4){
                    //     romawi = 'IV'
                    //  }else if(romawi == 5){
                    //     romawi = 'V'
                    //  }else if(romawi == 6){
                    //     romawi = 'VI'
                    //  }else if(romawi == 7){
                    //     romawi = 'VII'
                    //  }else if(romawi == 8){
                    //     romawi = 'VIII'
                    //  }else if(romawi == 9){
                    //     romawi = 'IX'
                    //  }else if(romawi == 10){
                    //     romawi = 'X'
                    //  }else if(romawi == 11){
                    //     romawi = 'XI'
                    //  }else if(romawi == 12){
                    //     romawi = 'XII'
                    //  }

                    //  var h = "B / /" + romawi + "/2021/INSTALASI FARMASI"
                    //  var keterangan = "";
                    $scope.isRouteLoading = true;
                    // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                    // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                    // var catatan = "";
                    // if($scope.dataSelected11.catatan !== null){
                    //    catatan= $scope.dataSelected11.catatan.toString()
                    // };
                    // medifirstService.get("logistik/totalperencanaan?"
                    //     + "&tglAwal=" + tglAwal
                    //     + "&tglAkhir=" + tglAkhir, true)
                    //     .then(function (dat) {
                    //         debugger;
                    //         for (var i = dat.data.daftar.length - 1; i >= 0; i--) {
                    //            keterangan = keterangan + dat.data.daftar[i].detailjenisproduk + " : Rp " +  parseFloat(dat.data.daftar[i].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")+ "\n";
                    //         }

                    debugger;
                    var data = {
                        "gambarLogo": "lambangpolri.jpg",
                        "paramKey": ["tglawal", "tglakhir", "norec", "tglnow", "tglayeuna"],
                        "paramValue": [tglAwal.toString(), tglAkhir.toString(), norec, tglnow.toString(), tglayeuna.toString()],
                        "paramType": ["", "", "", "", "", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/beritaacara.pdf');

                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/beritaacara.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/beritaacara.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/beritaacara.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/beritaacara.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/beritaacara.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;;
                })
            }
            $scope.CetakBeritaAcara2 = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglayeuna = ''
                var tglnow = ''
                var tglsekarang = "Jakarta, " + moment($scope.now).format('DD-MM-YYYY');
                medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tglAwal).then(function (dat) {
                    debugger
                    tglnow = dat.data.tglsekarang;
                    tglayeuna = dat.data.tglayeuna;

                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var norec = $scope.dataSelected.norec

                    // var x = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    //  var y = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    //  var romawi = moment($scope.item.tglAwal).format('MM');
                    //  var bulan = moment($scope.item.tglAwal).format('MMMM YY');
                    //  bulan = "Jakarta, " + bulan;
                    //  debugger;
                    //  if(romawi == 1){
                    //     romawi = 'I'
                    //  }else if(romawi == 2){
                    //     romawi = 'II'
                    //  }else if(romawi == 3){
                    //     romawi = 'III'
                    //  }else if(romawi == 4){
                    //     romawi = 'IV'
                    //  }else if(romawi == 5){
                    //     romawi = 'V'
                    //  }else if(romawi == 6){
                    //     romawi = 'VI'
                    //  }else if(romawi == 7){
                    //     romawi = 'VII'
                    //  }else if(romawi == 8){
                    //     romawi = 'VIII'
                    //  }else if(romawi == 9){
                    //     romawi = 'IX'
                    //  }else if(romawi == 10){
                    //     romawi = 'X'
                    //  }else if(romawi == 11){
                    //     romawi = 'XI'
                    //  }else if(romawi == 12){
                    //     romawi = 'XII'
                    //  }

                    //  var h = "B / /" + romawi + "/2021/INSTALASI FARMASI"
                    //  var keterangan = "";
                    $scope.isRouteLoading = true;
                    // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                    // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                    // var catatan = "";
                    // if($scope.dataSelected11.catatan !== null){
                    //    catatan= $scope.dataSelected11.catatan.toString()
                    // };
                    // medifirstService.get("logistik/totalperencanaan?"
                    //     + "&tglAwal=" + tglAwal
                    //     + "&tglAkhir=" + tglAkhir, true)
                    //     .then(function (dat) {
                    //         debugger;
                    //         for (var i = dat.data.daftar.length - 1; i >= 0; i--) {
                    //            keterangan = keterangan + dat.data.daftar[i].detailjenisproduk + " : Rp " +  parseFloat(dat.data.daftar[i].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")+ "\n";
                    //         }

                    debugger;
                    var data = {
                        "gambarLogo": "lambangpolri.jpg",
                        "paramKey": ["tglawal", "tglakhir", "norec", "tglnow", "tglayeuna"],
                        "paramValue": [tglAwal.toString(), tglAkhir.toString(), norec, tglnow.toString(), tglayeuna.toString()],
                        "paramType": ["", "", "", "", "", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/beritaacara2.pdf');

                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/beritaacara2.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/beritaacara2.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/beritaacara2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/beritaacara2.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/beritaacara2.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;;
                })
            }
            $scope.Tambah = function () {
                $state.go('PenerimaanBarangSuplier')
            }

            $scope.BatalTerima = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.nosbm != undefined) {
                    alert("Sudah di bayar tidak dapat di hapus!!")
                    return;
                }
                $scope.deleteShow = false;
                var stt = 'false'
                if (confirm('Hapus Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave = {
                    nostruk: $scope.dataSelected.norec,
                    noorderfk: $scope.dataSelected.noorderfk
                }
                medifirstService.post('logistik/delete-data-penerimaan', objSave).then(function (e) {
                    var forsave = {
                        nostruk: $scope.dataSelected.nostruk,
                    }
                    medifirstService.post('sysadmin/general/hapus-jurnal-penerimaan-barang', forsave).then(function (e) {
                        init();
                    });
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var namaruangan = ""
                if ($scope.ruanganUser != undefined) {
                    var namaruangan = "&namaruangan=" + $scope.ruanganUser
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var noSppb = ""
                if ($scope.item.noSppb != undefined) {
                    noSppb = "&noSppb=" + $scope.item.noSppb
                }
                var keterangan = ""
                if ($scope.item.keterangan != undefined) {
                    keterangan = "&keterangan=" + $scope.item.keterangan
                }
                var rekanan = ""
                if ($scope.item.namarekanan != undefined) {
                    rekanan = "&namarekanan=" + $scope.item.namarekanan.namarekanan
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-penerimaan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&keterangan=" + $scope.item.keterangan +
                    rekanan +
                    produkfk +
                    noSppb +
                    namaruangan +
                    keterangan, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.daftar;
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            for (let e = 0; e < data2[i].details.length; e++) {
                                data2[i].details[e].no = e + 1;
                                data2[i].details[e].qtyproduk = Number(data2[i].details[e].qtyproduk).toFixed(2);
                                data2[i].details[e].hargasatuan = Number(data2[i].details[e].hargasatuan).toFixed(2);
                                data2[i].details[e].hargaSekarang = (parseFloat(data2[i].details[e].hargasekarang))
                                data2[i].details[e].hargalama = (parseFloat(data2[i].details[e].hargalama))
                                data2[i].details[e].namapenerima = (data2[i].namapenerima)

                            }
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {}
                            }
                        });
                        pegawaiUser = dat.data.datalogin
                        $scope.deleteShow = true;
                    });
                var objSave = {
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }

                // medifirstService.post('sysadmin/general/save-jurnal-penerimaan-barang', objSave).then(function (data) { });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPenerimaanBarangSuplierCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.CetakBukti = function () {
                $scope.popUp.center().open();
            }

            $scope.ubahdetail = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + 24, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                })
                // if (noOrder == 'EditTerima') {
                $scope.disableSppb = true;
                medifirstService.get("logistik/get-detail-penerimaan?norec=" + $scope.dataSelected.norec, true).then(function (data_ih) {
                    $scope.isRouteLoading = false;
                    NoOrderFk = data_ih.data.detailterima.noorderfk
                    $scope.item.noTerima = data_ih.data.detailterima.nostruk
                    $scope.item.noUsulan = data_ih.data.detailterima.nousulan
                    $scope.item.noOrder = data_ih.data.detailterima.nosppb
                    $scope.item.noKontrak = data_ih.data.detailterima.nokontrak
                    $scope.item.tglTerima = moment(data_ih.data.detailterima.tglstruk).format('DD-MM-YYYY HH:mm'); //data_ih.data.detailterima.tglstruk
                    $scope.item.tglUsulan = data_ih.data.detailterima.tglrealisasi
                    $scope.item.tglAwal = data_ih.data.detailterima.tgldokumen
                    $scope.item.ketTerima = data_ih.data.detailterima.keteranganambil
                    $scope.item.namaPengadaan = data_ih.data.detailterima.namapengadaan
                    $scope.item.keterangan1 = data_ih.data.detailterima.keteranganlainnya
                    $scope.item.tahun = moment(data_ih.data.detailterima.tglstruk).format('YYYY');
                    $scope.item.kelompokproduk = { id: data_ih.data.pelayananPasien[0].kpid, kelompokproduk: data_ih.data.pelayananPasien[0].kelompokproduk }
                    $scope.item.asalproduk = { id: data_ih.data.pelayananPasien[0].asalprodukfk, asalProduk: data_ih.data.pelayananPasien[0].asalproduk }
                    $scope.item.ruanganPenerima = { id: data_ih.data.detailterima.id, namaruangan: data_ih.data.detailterima.namaruangan }
                    $scope.item.pegawaiPenerima = { id: data_ih.data.detailterima.pgid, namalengkap: data_ih.data.detailterima.namalengkap }
                    $scope.item.pegawaiPembuat = { id: data_ih.data.detailterima.objectpegawaipenanggungjawabfk, namalengkap: data_ih.data.detailterima.penanggungjawab }
                    $scope.item.tglFaktur = moment(data_ih.data.detailterima.tglfaktur).format('DD-MM-YYYY HH:mm'); //data_ih.data.detailterima.tglfaktur
                    $scope.item.noFaktur = data_ih.data.detailterima.nofaktur
                    $scope.item.namaRekanan = { id: data_ih.data.detailterima.objectrekananfk, namarekanan: data_ih.data.detailterima.namarekanan }
                    norec_Realisasi = data_ih.data.detailterima.norecrealisasi;
                    $scope.item.mataAnggaran = { norec: data_ih.data.detailterima.mataanggranid, mataanggaran: data_ih.data.detailterima.namamataanggaran }
                    $scope.item.TglJatuhTempo = moment(data_ih.data.detailterima.tgljatuhtempo).format('DD-MM-YYYY HH:mm');
                    kelTrans = 35
                    data2 = data_ih.data.pelayananPasien
                    medifirstService.get("logistik/get-data-produk-detail?" + data_ih.data.pelayananPasien[0].kpid, true).then(function (dat) {
                        $scope.listProduk = dat.data.produk;
                    });
                    $scope.dataGrid2 = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                    ttlTotal = 0;
                    ttlDiskon = 0;
                    ttlPpn = 0;
                    grandTotal = 0;

                    for (var i = data2.length - 1; i >= 0; i--) {
                        ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                        ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                        //ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                        //ttlPpn = ttlPpn + (parseFloat(data2[i].persenppn)/100 * ((parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan)) - parseFloat(data2[i].hargadiscount)))
                        $scope.persenppn = parseFloat(data2[i].persenppn)
                    }
                    $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    $scope.item.totalPpn = parseFloat($scope.persenppn) / 100 * (parseFloat(ttlTotal) - parseFloat(ttlDiskon))
                    // @all
                    // $scope.item.totalPpn = parseFloat($scope.persenppn) * (parseFloat(ttlTotal) - parseFloat(ttlDiskon))
                    $scope.item.totalPpn = parseFloat($scope.item.totalPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    // ttlPpn = $scope.persenppn/100 * (ttlTotal - ttlDiskon)
                    // diganti karena perubahan perhitungan @all
                    ttlPpn = (parseFloat($scope.persenppn) / 100) * (ttlTotal - ttlDiskon)
                    grandTotal = parseFloat(ttlTotal) - parseFloat(ttlDiskon) + parseFloat(ttlPpn)
                    $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                });

                $scope.columnGrid = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "statusharga",
                    "title": "status harga",
                    "width": "50px",
                },
                {
                    "field": "hargaLama",
                    "title": "Harga Sebelumnya",
                    "width": "100px",
                    // "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "120px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "50px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "50px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "ppn",
                    "title": "Ppn/Item",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "SubTotal",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nobatch",
                    "title": "No Batch",
                    "width": "50px",
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "Tgl Kadaluarsa",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                },
                    //                  {
                    //     "field": "",
                    //     "title": "Hapus",
                    //     "width": "90px",

                    //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >Hapus</button> ",
                    // },               {
                    //     "field": "",
                    //     "title": "Ubah",
                    //     "width": "90px",
                    //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  Ubah #</button> ",
                    // },
                ];

                $scope.popUp2.center().open();
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
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier')
                // cacheHelper.set('UbahPenerimaanBarangSuplierCtrl', chacePeriode);
                // $state.go('UbahPenerimaanBarangSuplier')
            }

            $scope.RegisAset = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'RegisAset',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('RegisterAsetCtrl', chacePeriode);
                $state.go('RegisterAset')
            }
            $scope.ubahPenerimaanDetail = function () {
                if ($scope.dataSelected.norec == undefined) {
                    alert("Pilih yg akan di Rubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'ubahPenerimaanDetail',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('UpdatePenerimaanDetailBarangCtrl', chacePeriode);
                $state.go('UpdatePenerimaanDetailBarangCtrl')
                // $state.go('UpdatePenerimaanDetailBarang')
            }
            $scope.HapusPenerimaan = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.nosbm != undefined) {
                    alert("Sudah di bayar tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                manageLogistikPhp.getDataTableTransaksi("penerimaan-suplier/delete-terima-barang-suplier?" + "norec_sp=" + $scope.dataSelected.norec, true).then(function (dat) {
                    init()
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "PenerimaanBarangSUpplier.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Penerimaan Barang Supplier",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                // columns: $scope.columnGrid
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "35px",
                },
                {
                    "field": "nofaktur",
                    "title": "No Dokumen",
                    "width": "100px",
                },
                {
                    "field": "nosppb",
                    "title": "No PO",
                    "width": "100px",
                    "template": "#if (nosppb) {# #= nosppb # #} else {# - #} #",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "100px",
                    "template": "#if (namaruangan) {# #= namaruangan # #} else {# - #} #",
                },
                {
                    "field": "tglstruk",
                    "title": "Tanggal Penerimaan",
                    "width": "55px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Supplier",
                    "width": "120px",
                },
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Tagihan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>"
                },
                {
                    "field": "namapegawaipenerima",
                    "title": "user terima",
                    "width": "120px",
                },
                ]
            };

            // $scope.columnGrid = [{
            //         "field": "no",
            //         "title": "No",
            //         "width": "35px",
            //     },
            //     {
            //         "field": "nofaktur",
            //         "title": "No Dokumen",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "nosppb",
            //         "title": "No PO",
            //         "width": "100px",
            //         "template": "#if (nosppb) {# #= nosppb # #} else {# - #} #",
            //     },
            //     {
            //         "field": "namaruangan",
            //         "title": "Nama Ruangan",
            //         "width": "100px",
            //         "template": "#if (namaruangan) {# #= namaruangan # #} else {# - #} #",
            //     },
            //     {
            //         "field": "tglstruk",
            //         "title": "Tanggal Penerimaan",
            //         "width": "55px",
            //         "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
            //     },
            //     {
            //         "field": "namarekanan",
            //         "title": "Supplier",
            //         "width": "120px",
            //     },
            //     {
            //         "field": "jmlitem",
            //         "title": "Item",
            //         "width": "35px",
            //         "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
            //     },
            //     {
            //         "field": "totalharusdibayar",
            //         "title": "Total Tagihan",
            //         "width": "100px",
            //         "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>"
            //     },
            //     {
            //         "field": "namapegawaipenerima",
            //         "title": "user terima",
            //         "width": "120px",
            //     },
            // ];

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "statusharga",
                        "title": "statusharga",
                        "width": "100px",
                    },
                    {
                        "field": "hargalama",
                        "title": "hargalama",
                        "width": "100px",
                    },

                    {
                        "field": "hargaSekarang",
                        "title": "hargaSekarang",
                        "width": "100px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
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
                        "width": "30px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Discount",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                    },
                    {
                        "field": "hargappn",
                        "title": "PPn",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp')}}</span>"
                    },
                    {
                        "field": "tglkadaluarsa",
                        "title": "Tgl Kadaluarsa",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                    },
                    {
                        "field": "nobatch",
                        "title": "nobatch",
                        "width": "50px"
                    },
                        //                  {
                        //     "field": "",
                        //     "title": "Hapus",
                        //     "width": "90px",

                        //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >Turun</button> ",
                        // },               {
                        //     "field": "status",
                        //     "title": "Verifikasi",
                        //     "width": "90px",
                        //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  status #</button> ",
                        // },
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatNumber = function (value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
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


            //*** edit penerimaan
            var onDataBound = function () {
                $('td').each(function () {
                    // if ($(this).text() == 'Tetap') {$(this).addClass('red')}
                    if ($(this).text() == 'Naik') { $(this).addClass('red') }
                    if ($(this).text() == 'Turun') { $(this).addClass('green') }
                    if ($(this).text() == 'SIMPAN') { $(this).addClass('red') }

                })
            }
            $scope.verifikasigrid = function (dataPasienSelected) {
                debugger;
                if (dataPasienSelected == undefined) {
                    alert("clik grid yang mau di simpan")
                    return;

                }
                if ($scope.dataSelected == undefined) {
                    alert("mohon di ulangi")
                    return;

                }

                data2 = (dataPasienSelected)
                var struk = {
                    nostruk: norecTerima,
                    noorder: noOrder,
                    rekananfk: $scope.item.namaRekanan.id,
                    namarekanan: $scope.item.namaRekanan.namarekanan,
                    ruanganfk: $scope.item.ruanganPenerima.id,
                    nofaktur: $scope.item.noFaktur,
                    qtyproduk: data2.length,
                    totalharusdibayar: grandTotal,
                    totalppn: ttlPpn,
                    totaldiscount: ttlDiskon,
                    totalhargasatuan: ttlTotal,
                    asalproduk: parseFloat($scope.item.asalproduk.id),
                    norecsppb: norecSPPB,
                    kelompoktranskasi: kelTrans,
                    norecrealisasi: norec_Realisasi,
                    noterima: $scope.item.noTerima,
                    noBuktiKK: $scope.item.noBuktiKK,
                    tgljatuhtempo: $scope.item.TglJatuhTempo, //moment($scope.item.TglJatuhTempo).format('YYYY-MM-DD HH:mm'),
                }
                var objSave = {
                    struk: struk,
                    details: data2,
                    statuskirim: "1"
                }

                medifirstService.post('logistik/save-data-penerimaan-revisi', objSave).then(function (e) {

                })



            }
            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                // columns: $scope.columnGrid
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "statusharga",
                    "title": "status harga",
                    "width": "50px",
                },
                {
                    "field": "hargaLama",
                    "title": "Harga Sebelumnya",
                    "width": "100px",
                    // "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "120px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "50px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "50px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "ppn",
                    "title": "Ppn/Item",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "SubTotal",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nobatch",
                    "title": "No Batch",
                    "width": "50px",
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "Tgl Kadaluarsa",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                },
                    // {
                    //     "field": "",
                    //     "title": "Hapus",
                    //     "width": "90px",

                    //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataPasienSelected)\"  style=\"margin:0 0 5px\" >Hapus</button> ",
                    // },               {
                    //     "field": "",
                    //     "title": "Ubah",
                    //     "width": "90px",
                    //     "template": "<button color=\"red\"  class=\"button button3\" ng-click=\"verifikasigrid(dataPasienSelected)\"  style=\"margin:0 0 5px\" >Ubah</button> ",
                    // },
                    //    {
                    //    command: {
                    //              text: "Ubah",
                    //             click: ubah
                    //             },
                    //              title: "Tools",
                    //              width: "100px"
                    //           }, {
                    //             command: {
                    //                 text: "Hapus",
                    //                click: hapus
                    //                },
                    //                title: "Tools",
                    //                width: "100px"

                    //         },
                ]
            }
            //   $scope.verifikasigrid = function (dataSelected2) {

            $scope.getSatuan = function () {
                GETKONVERSI(0)
            }

            function ubah(e) {
                $scope.isRouteLoading = true;
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var dataArray = [];

                if (dataItem.selisih == null) {
                    dataArray.push({
                        "produkfk": dataItem.kodeProduk,
                        "stokSistem": dataItem.qtyProduk,
                        "stokReal": dataItem.stokReal,
                        "selisih": dataItem.qtyProduk
                    });
                } else {
                    dataArray.push({
                        "produkfk": dataItem.kodeProduk,
                        "stokSistem": dataItem.qtyProduk,
                        "stokReal": dataItem.stokReal,
                        "selisih": dataItem.selisih
                    });
                }



                if (dataArray.length !== 0) {
                    var objSave = {
                        "ruanganId": $scope.item.ruangan.id,
                        "namaRuangan": $scope.item.ruangan.namaruangan,
                        "tglClosing": moment($scope.now).format('YYYY-MM-DD HH:mm'), //DateHelper.getPeriodeFormatted($scope.item.tanggal),
                        "stokProduk": dataArray
                    }
                    medifirstService.post('logistik/save-data-stock-opname', objSave).then(function (e) {
                        // $scope.item.resep = e.data.noresep.noorder
                        $scope.isRouteLoading = false;
                        var norecSC = e.data.noSO
                        if (norecSC != undefined) {
                            $scope.saveLogging('Stok Opname', 'norec Struk Closing', norecSC.norec, 'Stok Opname dengan No Closing ' + norecSC.noclosing + ' di ruangan ' + $scope.item.ruangan.namaruangan)

                        }


                        // $scope.dataExcel = datas;
                        $scope.cari()
                        // refreshSelisih()                          
                    })
                } else {
                    window.messageContainer.error('Saldo Real barang belum di isi');
                }
            }

            function hapus(e) {
                // $scope.klikGrid = function (dataSelected) {    
                debugger;
                var databarang = (dataSelected)

                var struk = {
                    nostruk: norecTerima,
                    noorder: noOrder,
                    rekananfk: $scope.item.namaRekanan.id,
                    namarekanan: $scope.item.namaRekanan.namarekanan,
                    ruanganfk: $scope.item.ruanganPenerima.id,
                    nofaktur: $scope.item.noFaktur,
                    tglfaktur: $scope.item.tglFaktur, //moment($scope.item.tglFaktur).format('YYYY-MM-DD HH:mm'),
                    tglstruk: $scope.item.tglTerima, //moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    tglorder: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm'),
                    tglrealisasi: $scope.item.tglTerima, //moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    tglkontrak: moment($scope.item.tglUsulan).format('YYYY-MM-DD HH:mm'),
                    objectpegawaipenanggungjawabfk: pegawaiPembuat,
                    pegawaimenerimafk: $scope.item.pegawaiPenerima.id,
                    namapegawaipenerima: $scope.item.pegawaiPenerima.namalengkap,
                    qtyproduk: data2.length,
                    totalharusdibayar: grandTotal,
                    totalppn: ttlPpn,
                    totaldiscount: ttlDiskon,
                    totalhargasatuan: ttlTotal,
                    asalproduk: $scope.item.asalproduk != undefined ? parseFloat($scope.item.asalproduk.id) : null,
                    norecsppb: norecSPPB,
                    kelompoktranskasi: kelTrans,
                    norecrealisasi: norec_Realisasi,
                    noterima: $scope.item.noTerima,
                    noBuktiKK: $scope.item.noBuktiKK,
                    tgljatuhtempo: $scope.item.TglJatuhTempo, //moment($scope.item.TglJatuhTempo).format('YYYY-MM-DD HH:mm'),
                }

                var objSave = {
                    struk: struk,
                    details: databarang
                }

                // medifirstService.post('logistik/save-ubah-data-penerimaan', objSave).then(function (e) {
                medifirstService.post('logistik/save-data-penerimaan', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    NorecCetak = e.data.data.norec
                    var forSave = {
                        struk: struk,
                        norec: NorecCetak,
                        details: data2
                    }
                })



            }

            function GETKONVERSI(jml) {
                if ($scope.item.produk == undefined) {
                    return
                }
                if ($scope.item.produk == "") {
                    return
                }
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1 // $scope.item.satuan.nilaikonversi
                $scope.item.jumlah = 0;
                $scope.item.hargaSatuan = 0;
                // $scope.item.ppn = 0;
                $scope.item.ppnpersen = 0;
                $scope.item.hargaDiskon = 0;
                $scope.item.hargaDiskonPersen = 0;
                $scope.item.subTotaltxt = 0;

                // $scope.item.keterangan = '-';
                $scope.item.keterangan = $scope.item.produk.spesifikasi;
                $scope.item.nobatch = '-';
                $scope.item.tglkadaluarsa = new Date();
                // if ($scope.item.ruangan == undefined) {
                //     //alert("Pilih Ruangan terlebih dahulu!!")
                //     return;
                // }
                $scope.item.hargaLama = 0;
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + 56, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        $scope.item.jumlah = 0
                        if (dat.data.detail.length != 0) {
                            $scope.item.hargaSatuan = parseFloat(dat.data.detail[0].harga).toFixed(2)
                            $scope.item.hargaSatuan = parseFloat($scope.item.hargaSatuan)
                            hargalamatetep = $scope.item.hargaSatuan
                            // $scope.item.hargaSatuan = Math.round($scope.item.hargaSatuan)
                            $scope.item.hargaLama = $scope.item.hargaSatuan;
                        } else {
                            $scope.item.hargaSatuan = 0;

                            hargalamatetep = 0;
                            // $scope.item.hargaSatuan = Math.round($scope.item.hargaSatuan)
                            $scope.item.hargaLama = 0;
                        }

                    });
                medifirstService.get("logistik/get-cekstokaja?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + 59, true).then(function (dat1) {
                        medifirstService.get("logistik/get-cekstok?" +
                            "produkfk=" + $scope.item.produk.id +
                            "&ruanganfk=" + 59, true).then(function (dat2) {

                                var currentDate = '';
                                if (parseFloat(dat1.data.datastok[0].qty) != parseFloat(dat2.data.kartustoklast[0].saldoawal)) {
                                    if (dat2.data.kartustoksebelum.length == 0) {
                                        currentDate = dat2.data.kartustoklast[0].created_at;
                                    } else {
                                        currentDate = dat2.data.kartustoksebelum[0].created_at;
                                    }
                                    var objSave = {
                                        "ruanganfk": 59,
                                        "produkfk": $scope.item.produk.id,
                                        "tglawal": moment(currentDate).format('YYYY-MM-DD 00:00:00')
                                    }
                                    medifirstService.post('logistik/save-perbaiki-kartu-stok', objSave).then(function (e) {
                                        // alert('yoyoyyy');
                                    })
                                }
                            });

                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + 59, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        $scope.item.jumlah = 0
                        $scope.item.hargaSatuan = dat.data.detail[0].hargapenerimaan
                    });
            }

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0 //parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0 //hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0 //hrgsdk * parseFloat(newValue)
                        $scope.item.total = 0 // parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    }
                }
            });
            $scope.$watch('item.satuan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                    // $scope.item.hargaLama = parseFloat(hargalamatetep) * (parseFloat($scope.item.satuan.nilaikonversi))

                    // (hrg1-hrgsdk)
                    // }
                }
            });

            $scope.$watch('item.noTerima', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    medifirstService.get("logistik/get-nomor-struk?NoSPK=" + $scope.item.noTerima, true).then(function (data_ih) {
                        var datas = data_ih.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            if (datas[i].nostruk == $scope.item.noTerima && noOrder != 'EditTerima') {
                                // alert("No Terima Tidak Boleh Sama!")
                                // $scope.item.noTerima = "";
                                // break
                            }
                        }
                        // if (datas == $scope.item.hps) {

                        // }
                    })

                }
            });

            $scope.$watch('item.noFaktur', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    medifirstService.get("logistik/get-nomor-faktur?NoSPK=" + $scope.item.noFaktur, true).then(function (data_ih) {
                        var datas = data_ih.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            if (datas[i].nofaktur == $scope.item.noFaktur && noOrder != '') {
                                alert("No Terima Tidak Boleh Sama!")
                                // $scope.item.noFaktur = "";
                                break
                            }
                        }
                        // if (datas == $scope.item.hps) {

                        // }
                    })

                }
            });

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    // qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotaltxt = qty*(hrgsatuan+ppn-hargadiskon)

                    qty = parseFloat($scope.item.jumlah)
                    persenppn = parseFloat($scope.item.ppnpersen)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    ppn = ((hrgsatuan - hargadiskon) * persenppn / 100) * qty
                    subTtlSetelahDiskon = (qty * (hrgsatuan - hargadiskon)) + ppn
                    $scope.item.subTotaltxt = subTtlSetelahDiskon
                }
            });

            $scope.$watch('item.hargaSatuan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    // qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotaltxt = qty*(hrgsatuan+ppn-hargadiskon)
                    qty = parseFloat($scope.item.jumlah)
                    persenppn = parseFloat($scope.item.ppnpersen)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    ppn = ((hrgsatuan - hargadiskon) * persenppn / 100) * qty
                    subTtlSetelahDiskon = (qty * (hrgsatuan - hargadiskon)) + ppn
                    if ($scope.persenppnedit == undefined) {
                        $scope.item.ppnpersen = 10
                    } else {
                        $scope.item.ppnpersen = $scope.persenppnedit
                    }
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat($scope.item.hargaSatuan)) / 100
                    $scope.item.subTotaltxt = subTtlSetelahDiskon + $scope.item.ppn
                    //detail harga kiri bawah
                    $scope.item.hargasatuanincludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / parseFloat($scope.item.nilaiKonversi) * ((100 + parseFloat($scope.item.ppnpersen)) / 100)
                    $scope.item.hargasatuanincludeppn = $scope.item.hargasatuanincludeppn.toFixed(2)
                    $scope.item.hargasatuanexcludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / (parseFloat($scope.item.nilaiKonversi) * ((110 - parseFloat($scope.item.ppnpersen)) / 100))
                    $scope.item.hargasatuanexcludeppn = $scope.item.hargasatuanexcludeppn.toFixed(2)
                    $scope.item.hargajual = parseFloat($scope.item.hargasatuanincludeppn) * 1.25
                    $scope.item.hargajual = $scope.item.hargajual.toFixed(2)
                    $scope.item.hna = (parseFloat(hrgsatuan) - parseFloat(hargadiskon)) / parseFloat($scope.item.nilaiKonversi)
                }
            });

            $scope.$watch('item.ppn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    qty = parseFloat($scope.item.jumlah)
                    persenppn = parseFloat($scope.item.ppnpersen)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    ppn = ((hrgsatuan - hargadiskon) * persenppn / 100) * qty
                    subTtlSetelahDiskon = (qty * (hrgsatuan - hargadiskon)) + ppn
                    $scope.item.subTotaltxt = subTtlSetelahDiskon // + ppn
                    $scope.item.hna = (parseFloat(hrgsatuan) - parseFloat(hargadiskon)) / parseFloat($scope.item.nilaiKonversi)
                }
            });

            $scope.$watch('item.hargaDiskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    qty = parseFloat($scope.item.jumlah)
                    persenppn = parseFloat($scope.item.ppnpersen)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    ppn = ((hrgsatuan - hargadiskon) * persenppn / 100) * qty
                    subTtlSetelahDiskon = (qty * (hrgsatuan - hargadiskon)) + ppn
                    $scope.item.subTotaltxt = subTtlSetelahDiskon // + ppn
                    //detail harga kiri bawah
                    $scope.item.hargasatuanincludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / parseFloat($scope.item.nilaiKonversi) * ((100 + parseFloat($scope.item.ppnpersen)) / 100)
                    $scope.item.hargasatuanincludeppn = $scope.item.hargasatuanincludeppn.toFixed(2)
                    $scope.item.hargasatuanexcludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / (parseFloat($scope.item.nilaiKonversi) * ((110 - parseFloat($scope.item.ppnpersen)) / 100))
                    $scope.item.hargasatuanexcludeppn = $scope.item.hargasatuanexcludeppn.toFixed(2)
                    $scope.item.hargajual = parseFloat($scope.item.hargasatuanincludeppn) * 1.25
                    $scope.item.hargajual = $scope.item.hargajual.toFixed(2)
                    $scope.item.hna = (parseFloat(hrgsatuan) - parseFloat(hargadiskon)) / parseFloat($scope.item.nilaiKonversi)
                }
            });

            $scope.$watch('item.ppnpersen', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    // $scope.item.ppn = (parseFloat($scope.item.ppnpersen)*parseFloat($scope.item.hargaSatuan))/100
                    qty = parseFloat($scope.item.jumlah)
                    persenppn = parseFloat($scope.item.ppnpersen)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    ppn = ((hrgsatuan - hargadiskon) * persenppn / 100) * qty
                    subTtlSetelahDiskon = (qty * (hrgsatuan - hargadiskon)) + ppn
                    // $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat(subTtlSetelahDiskons)) / 100
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat($scope.item.hargaSatuan)) / 100
                    //detail harga kiri bawah
                    $scope.item.hargasatuanincludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / parseFloat($scope.item.nilaiKonversi) * ((100 + parseFloat($scope.item.ppnpersen)) / 100)
                    $scope.item.hargasatuanincludeppn = $scope.item.hargasatuanincludeppn.toFixed(2)
                    $scope.item.hargasatuanexcludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / (parseFloat($scope.item.nilaiKonversi) * ((110 - parseFloat($scope.item.ppnpersen)) / 100))
                    $scope.item.hargasatuanexcludeppn = $scope.item.hargasatuanexcludeppn.toFixed(2)
                    $scope.item.hargajual = parseFloat($scope.item.hargasatuanincludeppn) * 1.25
                    $scope.item.hargajual = $scope.item.hargajual.toFixed(2)
                    $scope.item.hna = (parseFloat(hrgsatuan) - parseFloat(hargadiskon)) / parseFloat($scope.item.nilaiKonversi)
                }
            });

            $scope.$watch('item.hargaDiskonPersen', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // $scope.item.hargaDiskon = (parseFloat($scope.item.hargaDiskonPersen) * (parseFloat($scope.item.hargaSatuan) * parseFloat($scope.item.jumlah))) / 100
                    $scope.item.hargaDiskon = (parseFloat($scope.item.hargaDiskonPersen) * parseFloat($scope.item.hargaSatuan)) / 100
                    var hargadiskons = parseFloat($scope.item.hargaDiskon)
                    //detail harga kiri bawah
                    $scope.item.hargasatuanincludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / parseFloat($scope.item.nilaiKonversi) * ((100 + parseFloat($scope.item.ppnpersen)) / 100)
                    $scope.item.hargasatuanincludeppn = $scope.item.hargasatuanincludeppn.toFixed(2)
                    $scope.item.hargasatuanexcludeppn = (parseFloat($scope.item.hargaSatuan) - hargadiskon) / (parseFloat($scope.item.nilaiKonversi) * ((110 - parseFloat($scope.item.ppnpersen)) / 100))
                    $scope.item.hargasatuanexcludeppn = $scope.item.hargasatuanexcludeppn.toFixed(2)
                    $scope.item.hargajual = parseFloat($scope.item.hargasatuanincludeppn) * 1.25
                    $scope.item.hargajual = $scope.item.hargajual.toFixed(2)
                    $scope.item.hna = (parseFloat(hrgsatuan) - parseFloat(hargadiskon)) / parseFloat($scope.item.nilaiKonversi)
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {

                var statusharga = '';
                // if ($scope.item.subTotaltxt == 0) {
                //     alert("SubTotal harus di isi!")
                //     return;
                // }
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asalproduk == undefined) {
                //     alert("Pilih Sumber Dana Dahulu!!")
                //     return;
                // }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};

                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            if (parseFloat($scope.item.hna) < parseFloat($scope.item.hargaLama)) {
                                statusharga = "Turun";
                            } else if (parseFloat($scope.item.hna) > parseFloat($scope.item.hargaLama)) {
                                statusharga = "Naik";
                            } else {
                                statusharga = "Tetap";
                            }
                            data.statusharga = statusharga
                            data.hargaLama = $scope.item.hargaLama
                            data.no = $scope.item.no
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.ruanganfk = 59
                            data.asalprodukfk = $scope.item.asalproduk.id
                            data.asalproduk = $scope.item.asalproduk.asalProduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jumlah = $scope.item.jumlah
                            data.hargadiscount = String($scope.item.hargaDiskon)
                            data.persendiscount = String($scope.item.hargaDiskonPersen)
                            data.ppn = String($scope.item.ppn)
                            data.persenppn = String($scope.item.ppnpersen)
                            data.total = $scope.item.subTotaltxt
                            data.keterangan = $scope.item.keterangan
                            data.nobatch = $scope.item.nobatch
                            data.tglkadaluarsa = $scope.item.tglkadaluarsa
                            data.status = 'SIMPAN'

                            data2[i] = data;
                            $scope.dataGrid2 = new kendo.data.DataSource({
                                data: data2,
                                group: $scope.group,
                                pageSize: 100,
                                total: data2.length,
                                serverPaging: false,
                                schema: {
                                    model: {}
                                }
                            });
                            ttlTotal = 0;
                            ttlDiskon = 0;
                            ttlPpn = 0;
                            grandTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                ttlDiskon = ttlDiskon + ((parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah)))
                                // ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                // ttlPpn = ttlPpn + (parseFloat(data2[i].persenppn)/100 * ((parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan)) - parseFloat(data2[i].hargadiscount)))
                                $scope.persenppn = parseFloat(data2[i].persenppn)
                            }
                            $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            $scope.item.totalPpn = parseFloat($scope.persenppn) / 100 * ((parseFloat(ttlTotal) - parseFloat(ttlDiskon)))
                            // @all
                            // $scope.item.totalPpn = parseFloat($scope.persenppn) * (parseFloat(ttlTotal) - parseFloat(ttlDiskon))
                            $scope.item.totalPpn = parseFloat($scope.item.totalPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            // ttlPpn = $scope.persenppn/100 * (ttlTotal - ttlDiskon)
                            // diganti karena perubahan perhitungan @all
                            ttlPpn = (parseFloat($scope.persenppn) / 100) * (ttlTotal - ttlDiskon)
                            grandTotal = parseFloat(ttlTotal) - parseFloat(ttlDiskon) + parseFloat(ttlPpn)
                            $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    if (parseFloat($scope.item.hna) < parseFloat($scope.item.hargaLama)) {
                        statusharga = "Turun";
                    } else if (parseFloat($scope.item.hna) > parseFloat($scope.item.hargaLama)) {
                        statusharga = "Naik";
                    } else {
                        statusharga = "Tetap";
                    }
                    data = {
                        no: nomor,

                        statusharga: statusharga,
                        hargaLama: $scope.item.hargaLama,
                        hargasatuan: String($scope.item.hargaSatuan),
                        ruanganfk: 59,
                        asalprodukfk: $scope.item.asalproduk != undefined ? $scope.item.asalproduk.id : null,
                        asalproduk: $scope.item.asalproduk != undefined ? $scope.item.asalproduk.asalProduk : null,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jumlah: $scope.item.jumlah,
                        hargadiscount: String($scope.item.hargaDiskon),
                        persendiscount: String($scope.item.hargaDiskonPersen),
                        ppn: String($scope.item.ppn),
                        persenppn: String($scope.item.ppnpersen),
                        total: $scope.item.subTotaltxt,
                        keterangan: $scope.item.keterangan,
                        nobatch: $scope.item.nobatch,
                        tglkadaluarsa: $scope.item.tglkadaluarsa,
                        status: 'SIMPAN'
                    }
                    data2.push(data)
                    $scope.dataGrid2 = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                    ttlTotal = 0;
                    ttlDiskon = 0;
                    ttlPpn = 0;
                    grandTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                        ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                        //ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                        //ttlPpn = ttlPpn + (parseFloat(data2[i].persenppn)/100 * ((parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan)) - parseFloat(data2[i].hargadiscount)))
                        $scope.persenppn = parseFloat(data2[i].persenppn)
                    }
                    $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalPpn = parseFloat($scope.persenppn) / 100 * (parseFloat(ttlTotal) - parseFloat(ttlDiskon))
                    // // @all
                    // $scope.item.totalPpn = parseFloat($scope.persenppn) * (parseFloat(ttlTotal) - parseFloat(ttlDiskon))
                    $scope.item.totalPpn = parseFloat($scope.item.totalPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    // ttlPpn = $scope.persenppn/100 * (ttlTotal - ttlDiskon)
                    // diganti karena perubahan perhitungan @all
                    ttlPpn = (parseFloat($scope.persenppn) / 100) * (ttlTotal - ttlDiskon)
                    grandTotal = parseFloat(ttlTotal) - parseFloat(ttlDiskon) + parseFloat(ttlPpn)
                    $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }

                Kosongkan()
                $scope.muncul = false;
                racikan = ''
            }
            $scope.klikGrid = function (dataSelected2) {
                debugger;
                var k = dataSelected2;
            }
            $scope.klikGrid = function (dataSelected) {
                $scope.muncul = true;
                var dataProduk = [];
                if ($scope.item.produk != undefined) {
                    if ($scope.item.produk.id == dataSelected.produkfk) {
                        return false
                    }
                }
                $scope.item.no = dataSelected.no
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                //$scope.listProduk = {id:dataSelected.produkfk, namaproduk:dataSelected.namaproduk}
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                });
                $scope.item.produk = { id: dataSelected.produkfk, namaproduk: dataSelected.namaproduk } //dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                $scope.listSatuan = [{ ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }] //dataProduk.konversisatuan
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 


                $scope.item.jumlah = dataSelected.jumlah
                $scope.item.hargaSatuan = parseFloat(dataSelected.hargasatuan)
                var qtys = parseFloat(dataSelected.jumlah)
                var hrgsatuans = parseFloat(dataSelected.hargasatuan)
                var hargadiskons = parseFloat(dataSelected.hargadiscount)
                var subTtlSetelahDiskons = (qtys * hrgsatuans) - hargadiskons
                $scope.persenppnedit = dataSelected.persenppn

                if (dataSelected.persenppn == 0 && parseFloat(dataSelected.ppn) == 10) {
                    $scope.item.ppnpersen = parseFloat(dataSelected.ppn)
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat(dataSelected.hargasatuan)) / 100
                } else if (dataSelected.persenppn == "10") {
                    $scope.item.ppnpersen = parseFloat(dataSelected.persenppn)
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat(dataSelected.hargasatuan)) / 100
                } else if (dataSelected.ppn != "10" && dataSelected.ppn != 0) {
                    var ppnu = 0;
                    var ppnu = (parseFloat(dataSelected.ppn) / parseFloat(dataSelected.hargasatuan) * qtys) * 100
                    $scope.item.ppn = parseFloat(dataSelected.ppn)
                    $scope.item.ppnpersen = parseFloat(ppnu);
                    //                 $scope.item.ppn = (parseFloat($scope.item.ppnpersen)*parseFloat(dataSelected.hargasatuan))/100
                } else {
                    // var ppnu = parseFloat(dataSelected.hargasatuan)/parseFloat(dataSelected.ppn)
                    $scope.item.ppnpersen = 0
                    $scope.item.ppn = 0
                }

                // $scope.item.ppn = dataSelected.ppn
                $scope.item.hargaDiskon = dataSelected.hargadiscount
                $scope.item.hargaDiskonPersen = dataSelected.persendiscount
                $scope.item.keterangan = dataSelected.keterangan
                $scope.item.nobatch = dataSelected.nobatch
                $scope.item.tglkadaluarsa = dataSelected.tglkadaluarsa

                $scope.item.hargaLama = parseFloat(dataSelected.hargaLama).toFixed(2)
                $scope.item.hargaLama = parseFloat($scope.item.hargaLama)
                hargalamatetep = dataSelected.hargalama
                // GETKONVERSI(dataSelected.jumlah)
                if (dataSelected.nilaikonversi == null) {
                    $scope.item.nilaiKonversi = 1;
                } else {
                    $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                }
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }


            }

            function Kosongkan() {
                $scope.item.produk = ''
                // $scope.item.asal =''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.hargaSatuan = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.ppn = 0
                $scope.item.hargaDiskon = 0
                $scope.item.subTotaltxt = 0
                $scope.item.ppnpersen = 0
            }
            $scope.batal = function () {
                Kosongkan()
                $scope.muncul = false;
                // $scope.popUp.center().open();
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //***********************************
        }
    ]);
});