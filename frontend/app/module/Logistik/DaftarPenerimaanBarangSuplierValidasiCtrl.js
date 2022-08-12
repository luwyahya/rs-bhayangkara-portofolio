define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPenerimaanBarangSuplierValidasiCtrl', ['$scope', '$state', '$q', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, $q, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var data2 = [];
            var data = [];
            var data3 = [];
            var temptotalfaktur = "";
            var tempnorecfaktur = "";
            $scope.istempatLaporan = false;
            LoadCache();
            ComboLoad();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPenerimaanBarangSuplierValidasiCtrl');
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
            $scope.klikGrid = function (dataSelected) {

                $scope.item.totalubahfaktur = parseFloat(dataSelected.totalharusdibayar)
                tempnorecfaktur = dataSelected.norec
            }
            $scope.ubah = function () {
                $scope.popUpubahtotal.center().open();

            }

            var onDataBound = function () {
                $('td').each(function () {
                    //   if ($(this).text() == 'Belum') {$(this).addClass('red')}
                    //   if ($(this).text() == 'Sudah') {$(this).addClass('green')}
                    // if ($(this).text() == 'Online') {$(this).addClass('koneng')}

                })
            }
            $scope.cetakpengajuan = function () {
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var nobukti = $scope.dataSelected11.notukarfaktur + " - Tanggal " + moment($scope.dataSelected11.waktupembuatan).format('YYYY-MM-DD')
                var catatan = "";
                if ($scope.dataSelected11.catatan !== null) {
                    catatan = $scope.dataSelected11.catatan.toString()
                };

                debugger;
                var data = {
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "nobukti", "supplier", "catatan", "notukarfaktur", "grandtotal"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211 Telp. 021-8465000 / 8090559", nobukti.toString(), $scope.dataSelected11.namarekanan.toString(), catatan.toString(), $scope.dataSelected11.notukarfaktur.toString(), bayar.toString()],
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1001/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1001/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1001/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/permohonanpersetujuanpembayaranobat.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }
            $scope.cetakpengajuan2 = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
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
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211 Telp. 021-8465000 / 8090559", tglAwal.toString(), tglAkhir.toString()],
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/selisihfaktur.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1001/generic/report/selisihfaktur.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1001/generic/report/selisihfaktur.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/selisihfaktur.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1001/generic/report/selisihfaktur.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/selisihfaktur.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }
            $scope.cetakpengajuan3 = function () {
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var nobukti = $scope.dataSelected11.notukarfaktur + " - Tanggal " + moment($scope.dataSelected11.waktupembuatan).format('YYYY-MM-DD')
                var catatan = "";
                if ($scope.dataSelected11.catatan !== null) {
                    catatan = $scope.dataSelected11.catatan.toString()
                };

                debugger;
                var data = {
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "nobukti", "supplier", "catatan", "notukarfaktur", "grandtotal"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211 Telp. 021-8465000 / 8090559", nobukti.toString(), $scope.dataSelected11.namarekanan.toString(), catatan.toString(), $scope.dataSelected11.notukarfaktur.toString(), bayar.toString()],
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/permohonanpersetujuanpembayaranobat2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/permohonanpersetujuanpembayaranobat2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/permohonanpersetujuanpembayaranobat2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {

                    xhr.open('POST', '/jasper1/generic/report/permohonanpersetujuanpembayaranobat2.pdf');

                    // xhr.open('POST', 'http://10.10.20.167:1002/generic/report/permohonanpersetujuanpembayaranobat2.pdf');

                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/permohonanpersetujuanpembayaranobat2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/permohonanpersetujuanpembayaranobat2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
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
                var rek = ""
                if ($scope.item.namarekanan2 != undefined) {
                    var rek = "&namarekanan=" + $scope.item.namarekanan2.namarekanan
                }
                var fak = ""
                if ($scope.item.nofaktur != undefined) {
                    var fak = "&nofaktur=" + $scope.item.nofaktur
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');

                $q.all([
                    medifirstService.get("logistik/get-daftar-penerimaan?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&nostruk=" + $scope.item.struk +
                        "&nofaktur=" + $scope.item.nofaktur +
                        rek +
                        produkfk +
                        noSppb +
                        namaruangan, true),
                ]).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var data2 = dat[0].data.daftar;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                        for (let e = 0; e < data2[i].details.length; e++) {
                            data2[i].details[e].no = e + 1;
                            data2[i].details[e].qtyproduk = Number(data2[i].details[e].qtyproduk).toFixed(2);
                            data2[i].details[e].hargasatuan = Number(data2[i].details[e].hargasatuan).toFixed(2);
                            if (data2[i].verifikasifaktur == 1 || data2[i].verifikasifaktur == 'Sudah') {
                                data2[i].verifikasifaktur = 'Sudah';
                            } else {
                                data2[i].verifikasifaktur = 'Belum';
                            }
                            if (data2[i].tukarfaktur == 0 || data2[i].tukarfaktur == null || data2[i].tukarfaktur == 'Belum') {
                                data2[i].tukarfaktur = 'Belum';
                            } else {
                                data2[i].tukarfaktur = 'Sudah';
                            }
                            if (data2[i].pengajuanbayar == 0 || data2[i].pengajuanbayar == null || data2[i].pengajuanbayar == 'Belum') {
                                data2[i].pengajuanbayar = 'Belum';
                            } else {
                                data2[i].pengajuanbayar = 'Sudah';
                            }

                            if (data2[i].totalfisikdifaktur == null) {
                                data2[i].totalfisikdifaktur = data2[i].totalharusdibayar
                            }
                            if (data2[i].selisih == null) {
                                data2[i].selisih = 0
                            }
                        }
                    }

                    var onDataBound = function () {
                        $('td').each(function () {
                            //   if ($(this).text() == 'Belum') {$(this).addClass('red')}
                            //   if ($(this).text() == 'Sudah') {$(this).addClass('green')}
                            // if ($(this).text() == '-') {$(this).addClass('green')}

                        })
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

                $q.all([
                    medifirstService.get("logistik/get-daftar-tukarfaktur?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        rek, true),
                ]).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var data2 = dat[0].data.daftar;
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                        for (let e = 0; e < data2[i].details.length; e++) {
                            data2[i].details[e].no = e + 1;
                            data2[i].details[e].hargasatuan = Number(data2[i].details[e].totalharusdibayar).toFixed(2);

                            if (data2[i].statuspengajuan == 1) {
                                data2[i].statuspengajuan = 'Sudah';
                            } else {
                                data2[i].statuspengajuan = 'Belum';
                            }

                        }
                    }
                    $scope.dataGrid11 = new kendo.data.DataSource({
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
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPenerimaanBarangSuplierValidasiCtrl', chacePeriode);
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
            $scope.buatfaktur = function () {
                $scope.popUpTukarfaktur.center().open();
                Kosongkan();
                $scope.disabledsimpan = true;
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
            $scope.getFaktur = function () {
                medifirstService.get("logistik/get-combo-nofaktur?" +
                    "objectrekananfk=" + $scope.item.namarekanan.id, true).then(function (dat) {
                        $scope.listFaktur = dat.data;
                    });
            }
            $scope.getTotal = function () {
                medifirstService.get("logistik/get-combo-totalfaktur?" +
                    "norec=" + $scope.item.faktur.norec, true).then(function (dat) {
                        debugger;
                        $scope.item.totalfaktur = parseFloat(dat.data[0].totalfisikdifaktur);
                        $scope.item.qty = parseFloat(dat.data[0].qtyproduk);
                        $scope.item.catatanfaktur = dat.data[0].keteranganambil;
                        $scope.item.tglfaktur = moment(dat.data[0].tglfaktur).format('DD/MM/YYYY');
                    });
            }
            $scope.tambah = function () {
                $scope.disabledRuangan = true;
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data3.length + 1
                }


                if ($scope.item.no != undefined) {
                    for (var i = data3.length - 1; i >= 0; i--) {
                        if (data3[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.norec = $scope.item.faktur.norec
                            data.nofaktur = String($scope.item.faktur.nofaktur)
                            data.item = $scope.item.qty
                            data.totalfaktur = String($scope.item.totalfaktur)


                            data3[i] = data;
                            $scope.dataGrid2 = new kendo.data.DataSource({
                                data: data3,
                                group: $scope.group,
                                pageSize: 100,
                                total: data3.length,
                                serverPaging: false,
                                schema: {
                                    model: {}
                                }
                            });


                        }
                        // break;
                    }

                } else {
                    for (var i = data3.length - 1; i >= 0; i--) {
                        if (data3[i].norec == $scope.item.faktur.norec) {
                            alert("Faktur sudah ada")
                            return;
                        }
                    }
                    data = {
                        no: nomor,
                        norec: $scope.item.faktur.norec,
                        nofaktur: String($scope.item.faktur.nofaktur),
                        item: $scope.item.qty,
                        totalfaktur: String($scope.item.totalfaktur),
                    }
                    data3.push(data)
                    $scope.dataGrid2 = new kendo.data.DataSource({
                        data: data3,
                        group: $scope.group,
                        pageSize: 100,
                        total: data3.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                }
                for (var i = data3.length - 1; i >= 0; i--) {
                    var ttlTotal = 0;
                    for (var i = data3.length - 1; i >= 0; i--) {
                        ttlTotal = ttlTotal + (parseFloat(data3[i].totalfaktur))
                    }
                    $scope.item.grandtotal = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                debugger;
                Kosongkan()
            }

            function Kosongkan() {
                // $scope.item.produk = ''

                $scope.item.faktur = ''
                $scope.item.qty = ''
                $scope.item.totalfaktur = ''
                $scope.item.no = undefined
                $scope.dataSelected = undefined

            }
            $scope.bataltukar = function () {
                // $scope.item.produk = ''
                Kosongkan()
                data3 = [];
                $scope.dataGrid2 = new kendo.data.DataSource({
                    data: data3,
                    group: $scope.group,
                    pageSize: 100,
                    total: data3.length,
                    serverPaging: false,
                    schema: {
                        model: {}
                    }
                });
                $scope.disabledRuangan = false


            }
            $scope.klikGrid2 = function (dataSelected) {
                var dataProduk = [];
                //no:no,                
                debugger
                $scope.item.no = dataSelected.no
                $scope.item.faktur = { norec: dataSelected.norec, namaproduk: dataSelected.nofaktur } //dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                $scope.item.qty = dataSelected.item
                $scope.item.totalfaktur = dataSelected.totalfaktur
                $scope.item.totalubahfaktur = dataSelected.totalfaktur
            }
            $scope.hapus = function () {
                if ($scope.item.no == undefined) {
                    alert("Jumlah harus di isi!")
                    return;
                }

                if ($scope.item.faktur == undefined) {
                    alert("Pilih Faktur terlebih dahulu!!")
                    return;
                }

                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data3.length - 1; i >= 0; i--) {
                        if (data3[i].no == $scope.item.no) {
                            data3.splice(i, 1);
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data3
                            });
                            var ttlTotal = 0;
                            for (var i = data3.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data3[i].totalfaktur))
                            }
                            $scope.item.grandtotal = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }
                    $scope.dataGrid2 = new kendo.data.DataSource({
                        data: data3,
                        group: $scope.group,
                        pageSize: 100,
                        total: data3.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });

                }
                Kosongkan()
            }

            $scope.verifikasi = function () {
                var objSave = {
                    norec: $scope.dataSelected.norec
                    // noorderfk: $scope.dataSelected.noorderfk
                }
                medifirstService.post('logistik/save-validasi-faktur', objSave).then(function (e) {
                    init();
                });
            }
            $scope.unverifikasi = function () {
                var objSave = {
                    norec: $scope.dataSelected.norec
                    // noorderfk: $scope.dataSelected.noorderfk
                }
                medifirstService.post('logistik/save-unvalidasi-faktur', objSave).then(function (e) {
                    init();
                });
            }

            $scope.simpantukarfaktur = function () {
                var totalall = 0;
                for (var i = 0; i < data3.length; i++) {
                    totalall = parseFloat(totalall) + parseFloat(data3[i].totalfaktur);
                }
                var objSave = {
                    nofaktur: $scope.item.nofaktur,
                    supplier: $scope.item.namarekanan.id,
                    jumlahfaktur: data3.length,
                    total: parseFloat(totalall),
                    catatan: $scope.item.Catatan,
                    detail: data3
                    // noorderfk: $scope.dataSelected.noorderfk
                }
                debugger;
                medifirstService.post('logistik/save-tukfarfaktur', objSave).then(function (e) {
                    init();
                    Kosongkan();
                    $scope.disabledsimpan = false;
                    data3 = [];
                    $scope.dataGrid2 = new kendo.data.DataSource({
                        data: data3,
                        group: $scope.group,
                        pageSize: 100,
                        total: data3.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                });

            }
            $scope.simpanubahtotal = function () {

                var objSave = {
                    norec: tempnorecfaktur,
                    total: $scope.item.totaldifaktur,
                    selisih: $scope.item.selisih

                    // noorderfk: $scope.dataSelected.noorderfk
                }
                debugger;
                medifirstService.post('logistik/save-ubah-total', objSave).then(function (e) {
                    init();
                    Kosongkan();

                });

            }
            $scope.hapustukarfaktur = function () {

                if ($scope.dataSelected11.statuspengajuan == 'Sudah') {
                    alert("data sudah di ajukan");
                    return;
                }
                var objSave = {
                    norec: $scope.dataSelected11.norec,
                    notukarfaktur: $scope.dataSelected11.notukarfaktur
                }
                medifirstService.post('logistik/hapus-tukfarfaktur', objSave).then(function (e) {
                    init();
                });
            }
            $scope.verifikasipengajuan = function () {

                if ($scope.dataSelected11.statuspengajuan == 'Sudah') {
                    alert("data sudah di ajukan");
                    return;
                }
                var objSave = {
                    norec: $scope.dataSelected11.norec,
                    notukarfaktur: $scope.dataSelected11.notukarfaktur
                }
                medifirstService.post('logistik/save-verifikasipengajuanfaktur', objSave).then(function (e) {
                    init();
                });
            }
            $scope.unverifikasipengajuan = function () {

                if ($scope.dataSelected11.statuspengajuan == 'Belum') {
                    alert("data belum di ajukan");
                    return;
                }
                var objSave = {
                    norec: $scope.dataSelected11.norec,
                    notukarfaktur: $scope.dataSelected11.notukarfaktur
                }
                medifirstService.post('logistik/save-unverifikasipengajuanfaktur', objSave).then(function (e) {
                    init();
                });
            }

            // $scope.columnGrid = [
            //     {
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
            //         "field": "verifikasifaktur",
            //         "title": "Verifikasi",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "tukarfaktur",
            //         "title": "Tukar Faktur",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "pengajuanbayar",
            //         "title": "pengajuanbayar",
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
            //     }
            // ];
            $scope.columnGrid = {

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
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "35px",
                },
                {
                    "field": "nofaktur",
                    "title": "No Dokumen",
                    "width": "250px",
                },
                {
                    "field": "verifikasifaktur",
                    "title": "Verifikasi",
                    "width": "100px",
                },
                {
                    "field": "tukarfaktur",
                    "title": "Tukar Faktur",
                    "width": "100px",
                },
                {
                    "field": "pengajuanbayar",
                    "title": "pengajuanbayar",
                    "width": "100px",
                },

                {
                    "field": "nosppb",
                    "title": "No PO",
                    "width": "100px",
                    "template": "#if (nosppb) {# #= nosppb # #} else {# - #} #",
                },
                {
                    "field": "tglfaktur",
                    "title": "Tanggal Faktur",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglfaktur #', '')}}</span>"
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
                    "field": "totalfisikdifaktur",
                    "title": "Total Fisik",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalfisikdifaktur #', '')}}</span>"
                },
                {
                    "field": "selisih",
                    "title": "Selisih",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: selisih #', '')}}</span>"
                },
                {
                    "field": "catatan",
                    "title": "Catatan",
                    "width": "120px",
                },
                ]
            };

            $scope.columnGrid2 = [{
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
                "field": "item",
                "title": "Item",
                "width": "35px",
                "template": "<span class='style-right'>#= kendo.toString(item) #</span>",
            },
            {
                "field": "totalfaktur",
                "title": "Total Tagihan",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: totalfaktur #', '')}}</span>"
            }
            ];
            $scope.columnGrid11 = [
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "35px",
                // },
                {
                    "field": "waktupembuatan",
                    "title": "Tanggal Verifikasi Tukar faktur",
                    "width": "55px",
                    "template": "<span class='style-right'>{{formatTanggal('#: waktupembuatan #', '')}}</span>"
                },
                // {
                //     "field": "tglfaktur",
                //     "title": "Tanggal faktur",
                //     "width": "55px",
                //     "template": "<span class='style-right'>{{formatTanggal('#: tglfaktur #', '')}}</span>"
                // },
                {
                    "field": "notukarfaktur",
                    "title": "No Tukar Faktur",
                    "width": "55px",
                    // "template": "<span class='style-right'>{{formatTanggal('#: waktupembuatan #', '')}}</span>"
                },

                {
                    "field": "namarekanan",
                    "title": "Supplier",
                    "width": "120px",
                },
                {
                    "field": "jumlahfaktur",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jumlahfaktur) #</span>",
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "statuspengajuan",
                    "title": "Status Pengajuan",
                    "width": "120px",
                },

            ];
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
                    }
                    ]
                }
            };
            $scope.data11 = function (dataItem) {
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
                        "field": "nofaktur",
                        "title": "No Faktur",
                        "width": "100px",
                    },

                    {
                        "field": "tglfaktur",
                        "title": "Tgl Faktur",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglfaktur #', '')}}</span>"
                    },
                    {
                        "field": "tgljatuhtempo",
                        "title": "Tgl Jatuh Tempo",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tgljatuhtempo #', '')}}</span>"
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Terima",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                    },


                    {
                        "field": "totalharusdibayar",
                        "title": "Total",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp')}}</span>"
                    }
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
            $scope.$watch('item.totaldifaktur', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // debugger;
                    var faktur = parseFloat($scope.item.totalubahfaktur)
                    var difaktur = parseFloat(newValue)
                    var total = faktur - difaktur
                    total = parseFloat(total)
                    total = total.toPrecision(2)
                    $scope.item.selisih = parseFloat(total)
                }
            });
            //***********************************
        }
    ]);
});