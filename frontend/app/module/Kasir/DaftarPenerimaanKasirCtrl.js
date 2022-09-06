define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPenerimaanKasirCtrl', ['$state', '$mdDialog', '$q', '$scope', 'CacheHelper', 'MedifirstService',
        function ($state, $mdDialog, $q, $scope, cacheHelper, medifirstService) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataSbnSelected = {};
            $scope.btn_1 = false;
            $scope.btn_0 = true;
            var NRG = "";
            var dataLogin = {};
            var dataPegawai = [];
            $scope.item.KasirMulti = []
            $scope.istempatLaporan = true;
            $scope.isRouteLoading = false;
            $scope.tampungidruangan = '';
            $scope.pegawai = medifirstService.getPegawaiLogin();
            loadCombo();
            // loadData();


            function loadData() {
                var idPegawai = medifirstService.getPegawaiLogin().id
                medifirstService.get('registrasi/get-ruangan-login-user?idPegawai=' + idPegawai).then(function (dat) {
                    debugger
                    $scope.tampungidruangan = dat.data[0].objectruanganfk
                    if (dat.data[0].objectruanganfk == 693) {
                        var result2 = []
                        var result3 = []
                        var result4 = []
                        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                        var chacePeriode = tglAwal + "~" + tglAkhir //+":"+$scope.item.noFaktur+":"+$scope.item.NamaSupplier;
                        cacheHelper.set('DaftarPenerimaanKasirCtrl', chacePeriode);
                        // var Skasir = "";
                        // if ($scope.item.kasir != undefined) {
                        // 	Skasir = $scope.item.kasir.id;
                        // }
                        var listKasir = ""
                        if ($scope.item.KasirMulti.length != 0) {
                            var a = ""
                            var b = ""
                            for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                                var c = $scope.item.KasirMulti[i].id
                                b = "," + c
                                a = a + b
                            }
                            listKasir = a.slice(1, a.length)
                        }

                        var ScaraBayar = "";
                        if ($scope.item.caraBayar != undefined) {
                            ScaraBayar = $scope.item.caraBayar.id;
                        }

                        var SkelompokTransaksi = "";
                        if ($scope.item.kelompokTransaksi != undefined) {
                            SkelompokTransaksi = $scope.item.kelompokTransaksi.id;
                        }
                        var Sins = "";
                        if ($scope.item.ins != undefined) {
                            Sins = $scope.item.ins.id;
                        }
                        var SnoSbm = $scope.item.nosbm;

                        $q.all([

                            medifirstService.get("kasir/data-daftar-sbm?" +
                                "dateStartTglSbm=" + tglAwal +
                                "&dateEndTglSbm=" + tglAkhir +
                                "&idPegawai=" + listKasir +
                                "&ins=" + Sins +
                                "&idCaraBayar=" + ScaraBayar +
                                "&idKelTransaksi=" + SkelompokTransaksi +
                                "&nosbm=" + SnoSbm +
                                "&nocm=" + $scope.item.norm +
                                "&nama=" + $scope.item.nama +
                                "&desk=" + $scope.item.desk)
                        ]).then(function (data) {
                            medifirstService.get('kasir/data-daftar-sbm-rajal-non-layanan?' +
                                "dateStartTglSbm=" + tglAwal +
                                "&dateEndTglSbm=" + tglAkhir +
                                "&idPegawai=" + listKasir +
                                "&ins=" + Sins +
                                "&idCaraBayar=" + ScaraBayar +
                                "&idKelTransaksi=" + SkelompokTransaksi +
                                "&nosbm=" + SnoSbm +
                                "&nocm=" + $scope.item.norm +
                                "&nama=" + $scope.item.nama +
                                "&desk=" + $scope.item.desk).then(function (data2) {
                                    for (var i = 0; i < data[0].data.length; i++) {
                                        result3.push(data[0].data[i])
                                    };
                                    for (var j = 0; j < data2.data.length; j++) {
                                        result3.push(data2.data[j])
                                    };
                                    result3
                                    // result3.push(result2)
                                    debugger


                                    var cash = 0;
                                    var debit = 0;
                                    var kredit = 0;
                                    var donasi = 0;
                                    var trf = 0;
                                    var mix = 0;

                                    if (data[0].statResponse) {
                                        var result = result3 //.data.result;
                                        for (var x = 0; x < result.length; x++) {

                                            var element = result[x];
                                            element.no = x + 1;
                                            element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
                                            if (element.nocm == null) {
                                                element.nocm = '-'
                                            }
                                            if (element.namapasien == null) {
                                                element.namapasien = '-'
                                            }
                                            if (element.namapasien_klien == null) {
                                                element.namapasien_klien = '-'
                                            }
                                            element.namapasien = element.nocm + ' ' + element.namapasien
                                            if (element.namaruangan == null) {
                                                element.namaruangan = "-"
                                            }
                                            if (element.noClosing != null) {
                                                element.status = "Setor";
                                            } else {
                                                element.status = "Belum Setor";
                                            }

                                            if (element.caraBayar == "TUNAI") {
                                                cash = parseFloat(element.totalPenerimaan) + cash;
                                            };

                                            if (element.caraBayar == "KARTU DEBIT") {
                                                debit = parseFloat(element.totalPenerimaan) + debit;
                                            }

                                            if (element.caraBayar == "KARTU KREDIT") {
                                                kredit = parseFloat(element.totalPenerimaan) + kredit;
                                            };

                                            if (element.caraBayar == "TRANSFER BANK") {
                                                trf = parseFloat(element.totalPenerimaan) + trf;
                                            }

                                            if (element.caraBayar == "DONASI") {
                                                donasi = parseFloat(element.totalPenerimaan) + donasi;
                                            };

                                            if (element.caraBayar == "MIX") {
                                                mix = parseFloat(element.totalPenerimaan) + mix;
                                            }

                                            if (element.iscorona == 1 || element.iscorona == '1') {
                                                element.kasus = "Gratis"
                                            } else {
                                                element.kasus = "-"
                                            }


                                        }
                                        debugger
                                        $scope.item.totalCash = "Rp. " + parseFloat(cash).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalDebit = "Rp. " + parseFloat(debit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalKredit = "Rp. " + parseFloat(kredit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalDonasi = "Rp. " + parseFloat(donasi).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalMix = "Rp. " + parseFloat(mix).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalTrf = "Rp. " + parseFloat(trf).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        debugger
                                        $scope.dataDaftarPenerimaan = new kendo.data.DataSource({
                                            data: result,
                                            // group: $scope.group,
                                            // pageSize: 50,
                                            total: result.length,
                                            serverPaging: false,
                                            schema: {
                                                model: {
                                                    fields: {
                                                        totalPenerimaan: { type: "number" }
                                                    }
                                                }
                                            },
                                            aggregate: [
                                                { field: 'totalPenerimaan', aggregate: 'sum' },
                                            ]
                                        });
                                    }
                                    var onDataBound = function () {
                                        $('td').each(function () {

                                            if ($(this).text() == 'Setor') { $(this).addClass('green') }
                                            if ($(this).text() == 'Belum Setor') { $(this).addClass('red') }

                                        })
                                    }
                                });
                        });
                    } else if (dat.data[0].objectruanganfk == 673) {
                        var result2 = []
                        var result3 = []
                        var result4 = []
                        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                        var chacePeriode = tglAwal + "~" + tglAkhir //+":"+$scope.item.noFaktur+":"+$scope.item.NamaSupplier;
                        cacheHelper.set('DaftarPenerimaanKasirCtrl', chacePeriode);
                        // var Skasir = "";
                        // if ($scope.item.kasir != undefined) {
                        // 	Skasir = $scope.item.kasir.id;
                        // }
                        var listKasir = ""
                        if ($scope.item.KasirMulti.length != 0) {
                            var a = ""
                            var b = ""
                            for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                                var c = $scope.item.KasirMulti[i].id
                                b = "," + c
                                a = a + b
                            }
                            listKasir = a.slice(1, a.length)
                        }

                        var ScaraBayar = "";
                        if ($scope.item.caraBayar != undefined) {
                            ScaraBayar = $scope.item.caraBayar.id;
                        }

                        var SkelompokTransaksi = "";
                        if ($scope.item.kelompokTransaksi != undefined) {
                            SkelompokTransaksi = $scope.item.kelompokTransaksi.id;
                        }
                        var Sins = "";
                        if ($scope.item.ins != undefined) {
                            Sins = $scope.item.ins.id;
                        }
                        var SnoSbm = $scope.item.nosbm;
                        $q.all([
                            medifirstService.get("kasir/data-daftar-sbm-igd?" +
                                "dateStartTglSbm=" + tglAwal +
                                "&dateEndTglSbm=" + tglAkhir +
                                "&idPegawai=" + listKasir +
                                "&ins=" + Sins +
                                "&idCaraBayar=" + ScaraBayar +
                                "&idKelTransaksi=" + SkelompokTransaksi +
                                "&nosbm=" + SnoSbm +
                                "&nocm=" + $scope.item.norm +
                                "&nama=" + $scope.item.nama +
                                "&desk=" + $scope.item.desk)
                        ]).then(function (data) {
                            medifirstService.get('kasir/data-daftar-sbm-igd-non-layanan?' +
                                "dateStartTglSbm=" + tglAwal +
                                "&dateEndTglSbm=" + tglAkhir +
                                "&idPegawai=" + listKasir +
                                "&ins=" + Sins +
                                "&idCaraBayar=" + ScaraBayar +
                                "&idKelTransaksi=" + SkelompokTransaksi +
                                "&nosbm=" + SnoSbm +
                                "&nocm=" + $scope.item.norm +
                                "&nama=" + $scope.item.nama +
                                "&desk=" + $scope.item.desk).then(function (data2) {
                                    for (var i = 0; i < data[0].data.length; i++) {
                                        result3.push(data[0].data[i])
                                    };
                                    for (var j = 0; j < data2.data.length; j++) {
                                        result3.push(data2.data[j])
                                    };
                                    result3
                                    // result3.push(result2)
                                    debugger


                                    var cash = 0;
                                    var debit = 0;
                                    var kredit = 0;
                                    var donasi = 0;
                                    var trf = 0;
                                    var mix = 0;

                                    if (data[0].statResponse) {
                                        var result = result3 //.data.result;
                                        for (var x = 0; x < result.length; x++) {

                                            var element = result[x];
                                            element.no = x + 1;
                                            element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
                                            if (element.nocm == null) {
                                                element.nocm = '-'
                                            }
                                            if (element.namapasien == null) {
                                                element.namapasien = '-'
                                            }
                                            if (element.namapasien_klien == null) {
                                                element.namapasien_klien = '-'
                                            }
                                            element.namapasien = element.nocm + ' ' + element.namapasien
                                            if (element.namaruangan == null) {
                                                element.namaruangan = "-"
                                            }
                                            if (element.noClosing != null) {
                                                element.status = "Setor";
                                            } else {
                                                element.status = "Belum Setor";
                                            }

                                            if (element.caraBayar == "TUNAI") {
                                                cash = parseFloat(element.totalPenerimaan) + cash;
                                            };

                                            if (element.caraBayar == "KARTU DEBIT") {
                                                debit = parseFloat(element.totalPenerimaan) + debit;
                                            }

                                            if (element.caraBayar == "KARTU KREDIT") {
                                                kredit = parseFloat(element.totalPenerimaan) + kredit;
                                            };

                                            if (element.caraBayar == "TRANSFER BANK") {
                                                trf = parseFloat(element.totalPenerimaan) + trf;
                                            }

                                            if (element.caraBayar == "DONASI") {
                                                donasi = parseFloat(element.totalPenerimaan) + donasi;
                                            };

                                            if (element.caraBayar == "MIX") {
                                                mix = parseFloat(element.totalPenerimaan) + mix;
                                            }

                                            if (element.iscorona == 1 || element.iscorona == '1') {
                                                element.kasus = "Gratis"
                                            } else {
                                                element.kasus = "-"
                                            }


                                        }
                                        debugger
                                        $scope.item.totalCash = "Rp. " + parseFloat(cash).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalDebit = "Rp. " + parseFloat(debit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalKredit = "Rp. " + parseFloat(kredit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalDonasi = "Rp. " + parseFloat(donasi).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalMix = "Rp. " + parseFloat(mix).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        $scope.item.totalTrf = "Rp. " + parseFloat(trf).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                        debugger
                                        $scope.dataDaftarPenerimaan = new kendo.data.DataSource({
                                            data: result,
                                            // group: $scope.group,
                                            // pageSize: 50,
                                            total: result.length,
                                            serverPaging: false,
                                            schema: {
                                                model: {
                                                    fields: {
                                                        totalPenerimaan: { type: "number" }
                                                    }
                                                }
                                            },
                                            aggregate: [
                                                { field: 'totalPenerimaan', aggregate: 'sum' },
                                            ]
                                        });
                                    }
                                    var onDataBound = function () {
                                        $('td').each(function () {

                                            if ($(this).text() == 'Setor') { $(this).addClass('green') }
                                            if ($(this).text() == 'Belum Setor') { $(this).addClass('red') }

                                        })
                                    }
                                });
                        });
                    } else {
                        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                        var chacePeriode = tglAwal + "~" + tglAkhir //+":"+$scope.item.noFaktur+":"+$scope.item.NamaSupplier;
                        cacheHelper.set('DaftarPenerimaanKasirCtrl', chacePeriode);
                        // var Skasir = "";
                        // if ($scope.item.kasir != undefined) {
                        // 	Skasir = $scope.item.kasir.id;
                        // }
                        var listKasir = ""
                        if ($scope.item.KasirMulti.length != 0) {
                            var a = ""
                            var b = ""
                            for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                                var c = $scope.item.KasirMulti[i].id
                                b = "," + c
                                a = a + b
                            }
                            listKasir = a.slice(1, a.length)
                        }

                        var ScaraBayar = "";
                        if ($scope.item.caraBayar != undefined) {
                            ScaraBayar = $scope.item.caraBayar.id;
                        }

                        var SkelompokTransaksi = "";
                        if ($scope.item.kelompokTransaksi != undefined) {
                            SkelompokTransaksi = $scope.item.kelompokTransaksi.id;
                        }
                        var Sins = "";
                        if ($scope.item.ins != undefined) {
                            Sins = $scope.item.ins.id;
                        }
                        var SnoSbm = $scope.item.nosbm;
                        $q.all([
                            medifirstService.get("kasir/data-daftar-sbm?" +
                                "dateStartTglSbm=" + tglAwal +
                                "&dateEndTglSbm=" + tglAkhir +
                                "&idPegawai=" + listKasir +
                                "&ins=" + Sins +
                                "&idCaraBayar=" + ScaraBayar +
                                "&idKelTransaksi=" + SkelompokTransaksi +
                                "&nosbm=" + SnoSbm +
                                "&nocm=" + $scope.item.norm +
                                "&nama=" + $scope.item.nama +
                                "&desk=" + $scope.item.desk)
                        ]).then(function (data) {
                            var cash = 0;
                            var debit = 0;
                            var kredit = 0;
                            var donasi = 0;
                            var trf = 0;
                            var mix = 0;

                            if (data[0].statResponse) {
                                var result = data[0].data //.data.result;
                                for (var x = 0; x < result.length; x++) {

                                    var element = result[x];
                                    element.no = x + 1;
                                    element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
                                    if (element.nocm == null) {
                                        element.nocm = '-'
                                    }
                                    if (element.namapasien == null) {
                                        element.namapasien = '-'
                                    }
                                    if (element.namapasien_klien == null) {
                                        element.namapasien_klien = '-'
                                    }
                                    element.namapasien = element.nocm + ' ' + element.namapasien
                                    if (element.namaruangan == null) {
                                        element.namaruangan = "-"
                                    }
                                    if (element.noClosing != null) {
                                        element.status = "Setor";
                                    } else {
                                        element.status = "Belum Setor";
                                    }

                                    if (element.caraBayar == "TUNAI") {
                                        cash = parseFloat(element.totalPenerimaan) + cash;
                                    };

                                    if (element.caraBayar == "KARTU DEBIT") {
                                        debit = parseFloat(element.totalPenerimaan) + debit;
                                    }

                                    if (element.caraBayar == "KARTU KREDIT") {
                                        kredit = parseFloat(element.totalPenerimaan) + kredit;
                                    };

                                    if (element.caraBayar == "TRANSFER BANK") {
                                        trf = parseFloat(element.totalPenerimaan) + trf;
                                    }

                                    if (element.caraBayar == "DONASI") {
                                        donasi = parseFloat(element.totalPenerimaan) + donasi;
                                    };

                                    if (element.caraBayar == "MIX") {
                                        mix = parseFloat(element.totalPenerimaan) + mix;
                                    }

                                    if (element.iscorona == 1 || element.iscorona == '1') {
                                        element.kasus = "Gratis"
                                    } else {
                                        element.kasus = "-"
                                    }


                                }

                                $scope.item.totalCash = "Rp. " + parseFloat(cash).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDebit = "Rp. " + parseFloat(debit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalKredit = "Rp. " + parseFloat(kredit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDonasi = "Rp. " + parseFloat(donasi).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalMix = "Rp. " + parseFloat(mix).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalTrf = "Rp. " + parseFloat(trf).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.dataDaftarPenerimaan = new kendo.data.DataSource({
                                    data: result,
                                    // group: $scope.group,
                                    // pageSize: 50,
                                    total: result.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
                                                totalPenerimaan: { type: "number" }
                                            }
                                        }
                                    },
                                    aggregate: [
                                        { field: 'totalPenerimaan', aggregate: 'sum' },
                                    ]
                                });
                            }
                            var onDataBound = function () {
                                $('td').each(function () {

                                    if ($(this).text() == 'Setor') { $(this).addClass('green') }
                                    if ($(this).text() == 'Belum Setor') { $(this).addClass('red') }

                                })
                            }
                        });
                    }
                    //
                })
            }

            function loadCombo() {
                $scope.item.totalCash = 0;
                $scope.item.totalDebit = 0;
                $scope.item.totalKredit = 0;
                $scope.item.totalDonasi = 0;
                $scope.item.totalMix = 0;
                $scope.item.totalTrf = 0;

                var chacePeriode = cacheHelper.get('DaftarPenerimaanKasirCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00'); //$scope.now;
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59'); //$scope.now;

                }

                medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
                    $scope.listKasir = dat.data.datakasir;
                    $scope.listInstalasi = dat.data.dataInstalasi;
                    debugger;
                    $scope.listKelompokTransaksi = dat.data.kelompoktransaksi;
                    $scope.listCaraBayar = dat.data.dataCB;
                    dataLogin = dat.data.datalogin;
                    dataPegawai = dat.data.datapegawai;
                    if (dataPegawai != undefined) {
                        $scope.item.KasirMulti = [{ id: dataPegawai.objectpegawaifk, namalengkap: dataPegawai.namalengkap }];
                    }
                    $scope.selectOptionsKasir = {
                        placeholder: "Pilih Kasir...",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,

                    };
                    loadData();
                });
            }

            $scope.klik = function (dataSbnSelected) {
                if (dataSbnSelected != undefined) {
                    $scope.dataSbnSelected = dataSbnSelected;
                }
            };

            $scope.SearchEnter = function () {
                loadData()
            }

            $scope.aggregate = [{
                field: "totalPenerimaan",
                aggregate: "sum"
            }]

            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Setor') { $(this).addClass('green') }
                    if ($(this).text() == 'Belum Setor') { $(this).addClass('red') }

                })
            }

            $scope.columnDaftarPenerimaan = {
                sortable: true,
                pageable: true,
                selectable: "row",

                dataBound: onDataBound,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "template": "<span class='style-center'>#: no #</span>",
                    "width": "45px"
                },
                {
                    "field": "noSbm",
                    "title": "NoSbm",
                    "template": "<span class='style-center'>#: noSbm #</span>",
                    "width": "65px"
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "template": "<span class='style-left'>#: namaruangan #</span>",
                    "width": "100px"
                },
                {
                    "field": "tglSbm",
                    "title": "Tanggal",
                    "template": "<span class='style-center'>#: tglSbm #</span>",
                    "width": "75px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama",
                    "template": "<span class='style-left'>#: namapasien #</span>",
                    "width": "80px"
                },
                {
                    "field": "namapasien_klien",
                    "title": "Deskripsi",
                    "template": "<span class='style-left'>#: namapasien_klien #</span>",
                    "width": "80px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "template": "<span class='style-left'>#: keterangan #</span>",
                    "width": "80px"
                },
                {
                    "field": "caraBayar",
                    "title": "Cara Bayar",
                    "template": "<span class='style-center'>#: caraBayar #</span>",
                    "width": "70px",
                    groupFooterTemplate: "Jumlah",
                    footerTemplate: "Total Penerimaan"
                },
                {
                    "field": "totalPenerimaan",
                    "title": "Total Penerimaan",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",
                    "width": "85px",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.totalPenerimaan.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalPenerimaan.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                },
                {
                    "field": "namaPenerima",
                    "title": "Kasir",
                    "template": "<span class='style-center'>#: namaPenerima #</span>",
                    "width": "80px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "template": "<span class='style-center'>#: status #</span>",
                    "width": "50px"
                },
                {
                    "field": "kasus",
                    "title": "Keterangan",
                    "template": "<span class='style-center'>#: kasus #</span>",
                    "width": "50px"
                }
                ]
            }

            $scope.CetakReg = function () {

                if ($scope.dataSbnSelected.noSbm == undefined) {
                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "transaksi belum dipilih", "Ok");
                    $mdDialog.show(alertDialog).then(function () { });
                } else {
                    switch ($scope.dataSbnSelected.keterangan) {
                        case "Pembayaran Tagihan Pasien":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                        case "PELAYANAN TINDAKAN":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                        case "PELAYANAN APOTIK":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                        case "Pembayaran Tagihan Non Layanan":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                        case "Pembayaran Deposit Pasien":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=DEPOSIT' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                        case "Pengembalian Deposit Pasien":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=KEMBALIDEPOSIT' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;

                        case "Pembayaran Cicilan Tagihan Pasien":
                            var stt = 'false'
                            if (confirm('View Kwitansi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var sudahTerimaDari = ''
                            if ($scope.item.STD != undefined) {
                                sudahTerimaDari = $scope.item.STD
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=CICILANTAGIHAN' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
                                // do something with response
                            });

                            break;
                    }

                }
            }

            $scope.CetakRegJasper = function () {
                $scope.isRouteLoading = true;

                if ($scope.dataSbnSelected.noSbm == undefined) {
                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "transaksi belum dipilih", "Ok");
                    $mdDialog.show(alertDialog).then(function () { });
                } else {
                    var noTransaksi = "";
                    var sudahTerimaDari = '';
                    var terbilang = "";
                    var keterangan = "";
                    var keteranganD = "";
                    var untukPembayaran = "";
                    var uang = $scope.dataSbnSelected.totalPenerimaan;
                    var totalUang = $scope.formatRupiah(uang, '');
                    if ($scope.item.STD != undefined) {
                        sudahTerimaDari = $scope.item.STD
                    } else {
                        sudahTerimaDari = $scope.dataSbnSelected.namapasien;
                    }
                    debugger
                    if ($scope.dataSbnSelected.noregistrasi == null) {
                        noTransaksi = "-";
                    } else {
                        noTransaksi = $scope.dataSbnSelected.noregistrasi;
                    }
                    var newValue = $scope.dataSbnSelected.totalPenerimaan;

                    medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
                        function (dat) {
                            terbilang = dat.data.terbilang.toUpperCase();
                        })


                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = $scope.item.sisa;
                        if ($scope.item.jenisPasien == "BPJS") {
                            kelas = $scope.item.kelasPenjamin
                            if ($scope.item.deposit > 0) {
                                sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                            }
                        }
                        // var keterangan = $scope.item.namaPasien.$scope.item.noCm ;
                        if (noTransaksi != "-") {
                            if ($scope.tampungidruangan == 693 || $scope.tampungidruangan == 673) {
                                keteranganD = "RM - NAMA/NO.REG/KET  : " + $scope.dataSbnSelected.namapasien + "/" + $scope.dataSbnSelected.noregistrasi + "/" + $scope.dataSbnSelected.keterangan;
                                untukPembayaran = $scope.dataSbnSelected.keterangan + " / " + $scope.dataSbnSelected.namaruangan + " / Umum / Diri Sendiri";
                                debugger;
                                var data = {
                                    "gambarLogo": "logodokkes.jpg",
                                    "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD", "pembayaran"],
                                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.pegawai.namaLengkap.toString(), noTransaksi.toString(), $scope.dataSbnSelected.keterangan.toString(), totalUang.toString(), terbilang.toString(), $scope.dataSbnSelected.noSbm.toString(), $scope.dataSbnSelected.namaPenerima.toString(), $scope.dataSbnSelected.keterangan.toString(), keteranganD.toString(), untukPembayaran.toString()],
                                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", ""]
                                };
                            } else {
                                keteranganD = "RM - NAMA/NO.REG/KET  : " + $scope.dataSbnSelected.namapasien + "/" + $scope.dataSbnSelected.noregistrasi + "/" + $scope.dataSbnSelected.keterangan;
                                debugger;
                                var data = {
                                    "gambarLogo": "logodokkes.jpg",
                                    "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD"],
                                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.pegawai.namaLengkap.toString(), noTransaksi.toString(), $scope.dataSbnSelected.keterangan.toString(), totalUang.toString(), terbilang.toString(), $scope.dataSbnSelected.noSbm.toString(), $scope.dataSbnSelected.namaPenerima.toString(), $scope.dataSbnSelected.keterangan.toString(), keteranganD.toString()],
                                    "paramType": ["", "", "", "", "", "", "", "", "", "", ""]
                                };
                            }
                        } else {
                            keteranganD = "RM - NAMA/NO.REG/KET  : " + $scope.dataSbnSelected.namapasien_klien + "/" + noTransaksi + "/" + $scope.dataSbnSelected.keterangan;
                            debugger;
                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD"],
                                "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.pegawai.namaLengkap.toString(), noTransaksi.toString(), $scope.dataSbnSelected.namapasien_klien.toString(), totalUang.toString(), terbilang.toString(), $scope.dataSbnSelected.noSbm.toString(), $scope.dataSbnSelected.namaPenerima.toString(), $scope.dataSbnSelected.keterangan.toString(), keteranganD.toString()],
                                "paramType": ["", "", "", "", "", "", "", "", "", "", ""]
                            };
                        }
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
                        if (noTransaksi != "-") {
                            if ($scope.tampungidruangan == 693 || $scope.tampungidruangan == 673) {
                                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('simrs') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/kwSbmTotalRajal.pdf');
                                } else {
                                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotalRajal.pdf');
                                }
                            } else {
                                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('simrs') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/kwSbmTotal.pdf');
                                } else {
                                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotal.pdf');
                                }
                            }

                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('simrs') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            }
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

            }
            $scope.CetakKwL = function () {

                if ($scope.dataSbnSelected == undefined) {
                    toastr.warning('Data Belum Dipilih, Peringatan!');
                    return;
                }
                switch ($scope.dataSbnSelected.keterangan) {
                    case "Pembayaran Tagihan Pasien":
                        var stt = 'false'
                        if (confirm('View Kwitansi Layanan? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
                        var sudahTerimaDari = ''
                        if ($scope.item.STD != undefined) {
                            sudahTerimaDari = $scope.item.STD
                        }
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataSbnSelected.norec_sp + '&strKeterangan=' + $scope.dataSbnSelected.keterangan + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&strIdRuangan=-&view=' + stt, function (response) {
                            // do something with response
                        });
                        break;
                    case "Pembayaran Tagihan Non Layanan":
                        var stt = 'false'
                        if (confirm('View Kwitansi Layanan? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
                        var sudahTerimaDari = ''
                        if ($scope.item.STD != undefined) {
                            sudahTerimaDari = $scope.item.STD
                        }
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataSbnSelected.norec_sp + '&strKeterangan=' + $scope.dataSbnSelected.keterangan + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&strIdRuangan=-&view=' + stt, function (response) {
                            // do something with response
                        });
                        break;
                }
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

            $scope.Cetak = function () {
                if ($scope.dataSbnSelected.noSbm == undefined) {

                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "transaksi belum dipilih", "Ok");

                    $mdDialog.show(alertDialog).then(function () {

                    });
                } else {
                    switch ($scope.dataSbnSelected.keterangan) {
                        case "Pembayaran Tagihan Pasien":

                            var obj = {
                                noRegistrasi: [$scope.dataSbnSelected.noSbm],
                                backPage: "DaftarPenerimaanKasir"
                            }

                            $state.go("CetakDokumenKasir", {
                                dataPasien: JSON.stringify(obj)
                            });
                            break;
                        case "Pembayaran Tagihan Non Layanan":
                            var obj = {
                                noRegistrasi: [$scope.dataSbnSelected.noSbm],
                                backPage: 'DaftarPenerimaanKasir',
                                jenis: 'PembayaranTagihanNonLayananKasir'
                            }

                            $state.go("CetakKwitansi", {
                                dataPasien: JSON.stringify(obj)
                            });
                            break;
                        case "DaftarNonLayananKasir":
                            var obj = {
                                noRegistrasi: [$scope.dataSbnSelected.noSbm],
                                backPage: 'DaftarPenerimaanKasir',
                                jenis: 'DaftarNonLayananKasir'
                            }

                            $state.go("CetakKwitansi", {
                                dataPasien: JSON.stringify(obj)
                            });
                            break;
                        case "DaftarPenjualanApotekKasir/terimaUmum":
                        // $state.go("DaftarPenjualanApotekKasir",{dataFilter: "terimaUmum"});
                        // break;
                        case "DaftarPenjualanApotekKasir/obatBebas":
                        // $state.go("DaftarPenjualanApotekKasir",{dataFilter: "obatBebas"});
                        // break;
                        case "Pembayaran Deposit Pasien":
                            var obj = {
                                noRegistrasi: [$scope.dataSbnSelected.noSbm],
                                backPage: 'DaftarPenerimaanKasir',
                                jenis: 'PenyetoranDepositKasir'
                            }

                            $state.go("CetakKwitansi", {
                                dataPasien: JSON.stringify(obj)
                            });
                            break;
                        case "Pembayaran Cicilan Tagihan Pasien":
                            var obj = {
                                noRegistrasi: [$scope.dataSbnSelected.noSbm],
                                backPage: 'DaftarPenerimaanKasir',
                                jenis: 'PembayaranPiutangKasir'
                            }

                            $state.go("CetakKwitansi", {
                                dataPasien: JSON.stringify(obj)
                            });
                            break;
                    }
                }
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');
                var objSave = {
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }
                medifirstService.post('sysadmin/general/save-jurnal-pembayaran_tagihan', objSave).then(function (data) { });
                loadData();
            }

            $scope.HapusSBM = function () {
                if ($scope.dataSbnSelected.status != 'Setor') {
                    var stt = 'true';
                    if (confirm('Batalkan pembayaran ? ')) {
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    if (stt == 'true') {
                        var isDeposit = '';
                        if ($scope.dataSbnSelected.keterangan == 'Pembayaran Deposit Pasien')
                            isDeposit = true
                        else
                            isDeposit = false

                        var objSave = {
                            norec_sp: $scope.dataSbnSelected.norec_sp,
                            noregistrasi: $scope.dataSbnSelected.noregistrasi,
                            isdeposit: isDeposit,
                            totalpenerimaan: $scope.dataSbnSelected.totalPenerimaan,
                            nosbm: $scope.dataSbnSelected.noSbm
                        }
                        medifirstService.post('kasir/save-batal-bayar', objSave).then(function (data) {
                            // jurnal bataal bayar
                            var dataSave = {
                                "nosbm": $scope.dataSbnSelected.noSbm,
                            }
                            medifirstService.post('sysadmin/general/hapus-jurnal-pembayarantagihan', dataSave).then(function (e) {

                            })
                            // end jurnal batal bayar
                            $scope.saveLogBatalBayar();
                            loadData();

                        });
                    }
                } else {
                    alert('Sudah di setor tidak dapat di batalkan!')
                }
            }
            $scope.clickVerifKasir = function () {
                debugger;
                if ($scope.dataSbnSelected.isverifkasir == true) {
                    var stt = 'true';
                    if (confirm('Batalkan Verif ? ')) {
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    if (stt == 'true') {
                        debugger;
                        var objSbm = []
                        objSbm.push({
                            'norec_sbm': $scope.dataSbnSelected.noRec,
                        })
                        var objSaveNew = {
                            "details": objSbm
                        }

                        medifirstService.post('bendaharapenerimaan/batal-verif-kasir',
                            objSaveNew
                            // objSave
                        ).then(function () {
                            loadData();
                        })
                    }
                } else {

                    $scope.popUpVerif.center().open();

                }
            }
            $scope.HapusSetoran = function () {
                debugger;
                if ($scope.dataSbnSelected.isverifkasir != true) {
                    toastr.warning('Nomor SBM Belum di Verifikasi...!');
                    return;
                }
                if ($scope.dataSbnSelected.status == 'Setor') {
                    var stt = 'true';
                    if (confirm('Batalkan Setoran ? ')) {
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    if (stt == 'true') {

                        // var objSave = {
                        // 	norec_sp: $scope.dataSbnSelected.norec_sp,
                        // 	noregistrasi: $scope.dataSbnSelected.noregistrasi,
                        // 	isdeposit: isDeposit
                        // }
                        debugger;
                        var objSbm = []
                        objSbm.push({
                            'norec_sbm': $scope.dataSbnSelected.noRec,
                            'noclosing': $scope.dataSbnSelected.noClosing
                        })
                        var objSaveNew = {
                            "details": objSbm
                        }

                        medifirstService.post('bendaharapenerimaan/batal-setoran-kasir',
                            objSaveNew
                            // objSave
                        ).then(function () {
                            loadData();
                        })
                    }
                } else {

                    $scope.popUp.center().open();

                }
            }
            $scope.kembali = function () {

                $scope.popUp.close();
            }
            $scope.kembaliVerif = function () {

                $scope.popUpVerif.close();
            }

            $scope.lanjutsimpanVerif = function () {
                var tgl = moment($scope.item.tglsetor).format('YYYY-MM-DD')
                var tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm')
                var tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm')
                var tglSetor = moment($scope.item.tglsetor).format('YYYY-MM-DD HH:mm')
                var ttlSsetor = $scope.dataSbnSelected.totalPenerimaan;
                var objSBM = [];
                var objSave = [];
                if ($scope.item.KasirMulti.length == 0) {
                    alert('isi nama kasir');
                    return;
                }
                objSBM.push({ 'norec_sbm': $scope.dataSbnSelected.noRec })
                objSave = {
                    "tglPenerimaan": tgl,
                    "tglAwal": tglAwal,
                    "tglAkhir": tglAkhir,
                    "tglsetor": tglSetor,
                    "kdPegawai": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.id : $scope.item.KasirMulti[0].id,
                    "kdPegawaiLu": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.luid : $scope.item.KasirMulti[0].id,
                    "totalSetoran": ttlSsetor,
                    // "detailSetoran": objData,
                    "detailSBM": objSBM
                }
                debugger
                medifirstService.post('bendaharapenerimaan/verif-kasir-persbm', objSave).then(function () {
                    loadData();

                    $scope.popUpVerif.close();
                });
            }

            $scope.lanjutsimpan = function () {
                var tgl = moment($scope.item.tglsetor).format('YYYY-MM-DD')
                var tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm')
                var tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm')
                var tglSetor = moment($scope.item.tglsetor).format('YYYY-MM-DD HH:mm')
                var ttlSsetor = $scope.dataSbnSelected.totalPenerimaan;
                var objSBM = [];
                var objSave = [];
                if ($scope.item.KasirMulti.length == 0) {
                    alert('isi nama kasir');
                    return;
                }
                objSBM.push({ 'norec_sbm': $scope.dataSbnSelected.noRec })
                objSave = {
                    "tglPenerimaan": tgl,
                    "tglAwal": tglAwal,
                    "tglAkhir": tglAkhir,
                    "tglsetor": tglSetor,
                    "kdPegawai": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.id : $scope.item.KasirMulti[0].id,
                    "kdPegawaiLu": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.luid : $scope.item.KasirMulti[0].id,
                    "totalSetoran": ttlSsetor,
                    // "detailSetoran": objData,
                    "detailSBM": objSBM
                }
                debugger
                medifirstService.post('bendaharapenerimaan/setoran-kasir-persbm', objSave).then(function () {
                    medifirstService.get("bendaharapenerimaan/get-penjamin?" +
                        "noregistrasi=" + $scope.dataSbnSelected.noregistrasi
                    ).then(function (e) {
                        debugger;
                        if (e.status == '200') {
                            $scope.saveLogging('Setor kasir', 'noSBM', $scope.dataSbnSelected.noSbm, 'Setor Penerimaan Dengan Nomor SBM ' + $scope.dataSbnSelected.noSbm + ' Dan Jumlah Nominal Sebesar ' + ttlSsetor);
                        }
                        if (e.data[0].objectkelompokpasienlastfk == 1) {
                            var objverif = {
                                "tglclosing": tgl,
                                // "tglnk": tglnk, 
                                "pegawaiverif": $scope.item.KasirMulti[0].id,
                                "noregistrasi": $scope.dataSbnSelected.noregistrasi
                            };
                            medifirstService.post('remunerasi/save-jasapelayanandokterdeletinsert', objverif).then(function (e) {

                            })
                        }
                    })
                    loadData();

                    $scope.popUp.close();
                });
            }
            //*log Batal Bayar
            $scope.saveLogBatalBayar = function () {
                var objSave = {
                    "noregistrasi": $scope.dataSbnSelected.noregistrasi,
                    "nosbm": $scope.dataSbnSelected.noSbm
                }

                medifirstService.post('kasir/save-log-batal-bayar', objSave).then(function (e) { })
            }
            //*endlog Batal Bayar*

            $scope.ubahCarabayar = function () {
                if ($scope.dataSbnSelected.status != 'Setor') {
                    $scope.btn_0 = false;
                    $scope.btn_1 = true;
                } else {
                    alert('Sudah di setor tidak dapat di batalkan!')
                }

            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.saveCarabayar = function () {
                var stt = 'true';
                if (confirm('Ubah cara bayar ? ')) {
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if (stt == 'true') {
                    var objSave = {
                        norec_sbm: $scope.dataSbnSelected.noRec,
                        idCaraBayar: $scope.item.caraBayar1.id
                    }
                    medifirstService.post('kasir/save-ubah-cara-bayar', objSave).then(function (data) {
                        loadData();
                        $scope.btn_0 = true;
                        $scope.btn_1 = false;
                    });
                }
            }

            $scope.batal = function () {
                $scope.btn_0 = true;
                $scope.btn_1 = false;
            }

            $scope.CetakLaporanKasir = function () {
                var dokter = ''
                var Sins = "";
                if ($scope.item.ins != undefined) {
                    Sins = $scope.item.ins.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                // var idPegawai = ''
                // if ($scope.item.kasir != undefined) {
                // 	idPegawai = $scope.item.kasir.id
                // }
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + dataLogin.userData.namauser + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + listKasir + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) { });
            }

            $scope.CetakLaporanKasirDetail = function () {
                var dokter = ''
                var Sins = "";
                if ($scope.item.ins != undefined) {
                    Sins = $scope.item.ins.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                // var idPegawai = ''
                // if ($scope.item.kasir != undefined) {
                // 	idPegawai = $scope.item.kasir.id
                // }
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-apd=' + dataLogin.userData.namauser + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + listKasir + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) { });
            }
            debugger
            $scope.laporankasirdetailjasper = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                var kondisi = "  (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') "

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal.toString(), tglAkhir.toString(), x.toString(), y.toString(), kondisi],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/laporankasirdetailjasper.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/laporankasirdetailjasper.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/laporankasirdetailjasper.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/laporankasirdetailjasper.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/laporankasirdetailjasper.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/laporankasirdetailjasper.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporankasirdetailjasper.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanKasirJasper = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                //  var namauser = dataLogin.userData.namauser;
                //  var namauser = dataLogin.userData.namauser
                var listKasir = ""
                var listKasirnama = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    var anama = ""
                    var bnama = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                        var cnama = $scope.item.KasirMulti[i].namalengkap
                        bnama = "," + cnama
                        anama = anama + bnama
                    }
                    listKasir = a.slice(1, a.length)
                    listKasirnama = anama.slice(1, anama.length)
                }

                var Sins = "";
                var kondisi = "";
                var listKasirKondisi = "";
                if (listKasir != "")
                    listKasirKondisi = " AND (pg2.id in (" + listKasir + ")) "
                if ($scope.item.ins != undefined) {
                    Sins = $scope.item.ins.id;
                    kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')  " + listKasirKondisi + " AND (ru.objectdepartemenfk = " + Sins + ") order by namaruangan, tglsbm"
                } else {
                    kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')  " + listKasirKondisi + " order by namaruangan, tglsbm"
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                debugger
                // var kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"



                // var Sins = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins =  ' = '+ $scope.item.ins.id;
                // }else{
                // 	Sins =  'is null'
                // }
                debugger
                // var Sins = " ";
                // if ($scope.item.ins != undefined) {
                // 	Sins = " AND (ru.objectdepartemenfk = "+ $scope.item.ins.id + ")";
                // }
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
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "listKasir", "Sins", "idRuangan", "kondisi", "listKasirnama"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal.toString(),
                        tglAkhir.toString(), x.toString(), y.toString(), listKasir.toString(), Sins, ruanganId, kondisi, listKasirnama
                    ],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetaklaporankasirjasper2.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetaklaporankasirjasper2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetaklaporankasirjasper2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirjasper2.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/cetaklaporankasirjasper2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetaklaporankasirjasper2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanKasirDetailNew = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                var total = $scope.dataDaftarPenerimaan
                //  var namauser = dataLogin.userData.namauser;
                //  var namauser = dataLogin.userData.namauser
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }

                // var Sins = "";
                // var kondisi = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins = $scope.item.ins.id;
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"
                // } else {
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ")"
                // }
                // var ruanganId = ''
                // if ($scope.item.ruangan != undefined) {
                // 	ruanganId = $scope.item.ruangan.id
                // }
                debugger
                // var kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"



                // var Sins = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins =  ' = '+ $scope.item.ins.id;
                // }else{
                // 	Sins =  'is null'
                // }
                debugger
                // var Sins = " ";
                // if ($scope.item.ins != undefined) {
                // 	Sins = " AND (ru.objectdepartemenfk = "+ $scope.item.ins.id + ")";
                // }

                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                var kondisi = "  (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ")"

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "listKasir", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal,
                        tglAkhir, x.toString(), y.toString(), listKasir.toString(), kondisi.toString()
                    ],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetaklaporankasirdetailnew.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetaklaporankasirdetailnew.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetaklaporankasirdetailnew.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirdetailnew.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/cetaklaporankasirdetailnew.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirdetailnew.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetaklaporankasirdetailnew.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanKasirLaboratorium = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                //  var namauser = dataLogin.userData.namauser;
                //  var namauser = dataLogin.userData.namauser
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }

                // var Sins = "";
                // var kondisi = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins = $scope.item.ins.id;
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"
                // } else {
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ")"
                // }
                // var ruanganId = ''
                // if ($scope.item.ruangan != undefined) {
                // 	ruanganId = $scope.item.ruangan.id
                // }
                debugger
                // var kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"



                // var Sins = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins =  ' = '+ $scope.item.ins.id;
                // }else{
                // 	Sins =  'is null'
                // }
                debugger
                // var Sins = " ";
                // if ($scope.item.ins != undefined) {
                // 	Sins = " AND (ru.objectdepartemenfk = "+ $scope.item.ins.id + ")";
                // }

                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                var kondisi = "  (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')  AND (pg2.id = " + listKasir + ")"
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "listKasir", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal.toString(),
                        tglAkhir.toString(), x.toString(), y.toString(), listKasir.toString(), kondisi
                    ],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetaklaporankasirlaboratorium.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetaklaporankasirlaboratorium.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetaklaporankasirlaboratorium.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirlaboratorium.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/cetaklaporankasirlaboratorium.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirlaboratorium.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetaklaporankasirlaboratorium.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanKasirRadiologi = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                //  var namauser = dataLogin.userData.namauser;
                //  var namauser = dataLogin.userData.namauser
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }
                var kondisi = "  (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')  AND (pg2.id = " + listKasir + ")"
                // var Sins = "";
                // var kondisi = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins = $scope.item.ins.id;
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"
                // } else {
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ")"
                // }
                // var ruanganId = ''
                // if ($scope.item.ruangan != undefined) {
                // 	ruanganId = $scope.item.ruangan.id
                // }
                debugger
                // var kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"



                // var Sins = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins =  ' = '+ $scope.item.ins.id;
                // }else{
                // 	Sins =  'is null'
                // }
                debugger
                // var Sins = " ";
                // if ($scope.item.ins != undefined) {
                // 	Sins = " AND (ru.objectdepartemenfk = "+ $scope.item.ins.id + ")";
                // }

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
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "listKasir", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal.toString(),
                        tglAkhir.toString(), x.toString(), y.toString(), listKasir.toString(), kondisi
                    ],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetaklaporankasirradiologi.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetaklaporankasirradiologi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetaklaporankasirradiologi.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirradiologi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/cetaklaporankasirradiologi.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirradiologi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetaklaporankasirradiologi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakLaporanKasirdetailFarmasi = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                //  var namauser = dataLogin.userData.namauser;
                //  var namauser = dataLogin.userData.namauser
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }

                // var Sins = "";
                // var kondisi = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins = $scope.item.ins.id;
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"
                // } else {
                // 	kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ")"
                // }
                // var ruanganId = ''
                // if ($scope.item.ruangan != undefined) {
                // 	ruanganId = $scope.item.ruangan.id
                // }
                debugger
                // var kondisi = " WHERE (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "') AND (pg2.id = " + listKasir + ") AND (ru.objectdepartemenfk = " + Sins + ")"



                // var Sins = "";
                // if ($scope.item.ins != undefined) {
                // 	Sins =  ' = '+ $scope.item.ins.id;
                // }else{
                // 	Sins =  'is null'
                // }
                debugger
                // var Sins = " ";
                // if ($scope.item.ins != undefined) {
                // 	Sins = " AND (ru.objectdepartemenfk = "+ $scope.item.ins.id + ")";
                // }

                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                var kondisi = "  (sbm.tglsbm BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')  AND (pg2.id = " + listKasir + ")"
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir", "x", "y", "listKasir", "kondisi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", tglAwal.toString(),
                        tglAkhir.toString(), x.toString(), y.toString(), listKasir.toString(), kondisi
                    ],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetaklaporankasirfarmasi.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetaklaporankasirfarmasi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetaklaporankasirfarmasi.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirfarmasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/cetaklaporankasirfarmasi.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetaklaporankasirfarmasi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetaklaporankasirfarmasi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.simpansuratjalan = function () {
                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    petugasfk: $scope.item.petugas.id,
                    tglberangkat: moment($scope.item.tglberangkat).format('YYYY-MM-DD HH:mm:ss'),
                    nopol: $scope.item.nopol,
                    keperluan: $scope.item.keperluan,
                    tujuan: $scope.item.tujuan,
                    keluargapasien: $scope.item.keluargapasien,
                }
                medifirstService.post('ambulance/save-suratjalan', objSave).then(function (e) {

                });
            }
            $scope.kembalirekanan = function () {
                $scope.popup_editor.close();
            }
            $scope.suratjalan = function () {
                $scope.item.noregistrasi = $scope.dataSbnSelected.noregistrasi;
                if ($scope.dataSbnSelected.noregistrasi != undefined) {
                    medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                        $scope.listRuangan = dat.data.ruanganambulan;
                        debugger;
                        $scope.ListDataPegawai = dat.data.pegawai;
                        $scope.item.caridatajenazahbyruangan = { id: dat.data.ruanganambulan[0].id, namaruangan: dat.data.ruanganambulan[0].namaruangan }
                        LoadCache();
                    })
                    medifirstService.get("ambulance/get-suratjalan?noregistrasi=" + $scope.dataSbnSelected.noregistrasi).then(function (dat) {
                        $scope.item.nopol = dat.data.data.nopol
                        $scope.item.tujuan = dat.data.data.tujuan
                        $scope.item.keperluan = dat.data.data.keperluan
                        $scope.item.tglberangkat = dat.data.data.tanggalberangkat
                        $scope.item.petugas = { id: dat.data.data.id, namalengkap: dat.data.data.namalengkap }
                        $scope.item.keluargapasien = dat.dat.data.keluargapasien

                    });
                }
                $scope.popup_editor.center().open();
            }

            $scope.cetaksuratjalan = function () {

                var user = medifirstService.getPegawaiLogin();
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.item.noregistrasi],
                    "paramType": ["", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});

                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratjalan.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratjalan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.CetakLaporanKasirDetailFarmasi = function () {
                var dokter = ''
                var Sins = "";
                if ($scope.item.ins != undefined) {
                    Sins = $scope.item.ins.id;
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                // var idPegawai = ''
                // if ($scope.item.kasir != undefined) {
                // 	idPegawai = $scope.item.kasir.id
                // }
                var listKasir = ""
                if ($scope.item.KasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.KasirMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.KasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-apd1=' + dataLogin.userData.namauser + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + listKasir + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) { });
            }

        }
    ]);
});