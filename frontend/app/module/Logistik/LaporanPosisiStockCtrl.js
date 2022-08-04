define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPosisiStockCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            var details = [];
            var details2 = [];
            var details3 = [];
            var details4 = [];
            var details5 = [];
            var details6 = [];
            var details7 = [];
            var details8 = [];
            var detailsAll = [];
            $scope.selectedJenisProduk = []
            $scope.selectedDetailJenis = []
            LoadCache();
            loadCombo();
            $scope.item.neraca = false;
            // var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
            var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
            $scope.selectOptionsDetailJenis = {
                // placeholder: "Pilih Detail Jenis Produk...",
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            $scope.selectOptJenisProduk = {
                // placeholder: "Pilih Jenis Produk...",
                dataTextField: "jenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            function LoadCache() {
                medifirstService.get("logistik/get-data-stock-flow", true).then(function (dat) {
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan()
                    $scope.listJenisProduk = dat.data.jenisproduk
                    $scope.listDetailJenis = dat.data.detailjenisproduk
                    $scope.item.ruangan =  $scope.listRuangan[0];//{ id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.depoRajal = dat.data.deporajal;
                    $scope.depoRanap = dat.data.deporanap;
                    $scope.depoIgd = dat.data.depoigd;
                    $scope.gdFarmasi = dat.data.gdfarmasi;
                    $scope.gdLogistik = dat.data.gdlogistik;
                    var chacePeriode = cacheHelper.get('NeracaPersediaanCtrl');
                    if (chacePeriode != undefined) {
                        $scope.item.tglAwal = new Date(chacePeriode[0]);
                        $scope.item.tglAkhir = new Date(chacePeriode[1]);
                        // $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                        // $scope.item.tglAkhir = $scope.now;
                        // $scope.item.tglAkhir =  new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                        // init();
                    }
                    else {
                        $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                        $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                        // init();
                    }
                });

            }

            function loadCombo() {
                //  modelItemAkuntansi.getDataDummyPHP("aset/get-data-barang", true, true, 20).then(function(data) {
                //     $scope.listKdSirs = data
                //     $scope.listKdSirs1 = data
                //     $scope.listProduk = data
                // });
            }

            function init() {

                $scope.isRouteLoading = true;
                // var rg =""
                // if ($scope.item.ruangan != undefined){
                //     var rg = +$scope.item.ruangan.id
                // }

                // var listJenisProd = ""
                // if ($scope.selectedJenisProduk.length != 0){
                //     var a = ""
                //     var b = ""
                //     for (var i = $scope.selectedJenisProduk.length - 1; i >= 0; i--) {
                //         var c = $scope.selectedJenisProduk[i].id
                //         b = "," + c
                //         a = a + b
                //     }
                //     listJenisProd = a.slice(1, a.length)
                // }
                var listDetailJenis = ""
                if ($scope.selectedDetailJenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)

                }
                //  var KdSirs1 = ""
                // if ($scope.item.KdSirs1 != undefined) {
                //     KdSirs1 =  "&KdSirs1=" + $scope.item.KdSirs1
                // }
                // var KdSirs2 = ""
                // if ($scope.item.KdSirs2 != undefined) {
                //     KdSirs2 =  "&KdSirs2=" + $scope.item.KdSirs2
                // }
                var IdProduk = ""
                if ($scope.item.nmProduk != undefined) {
                    IdProduk = "&nmproduk=" + $scope.item.nmProduk
                }
                var idRuangan = "";
                if ($scope.item.ruangan != undefined) {
                    idRuangan = "&idRuangan=" + $scope.item.ruangan.id
                }

                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0



                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');

                medifirstService.get("logistik/get-neraca-persediaan?" +
                    "tglawal=" + tglAwal +
                    "&tglakhir=" + tglAkhir +
                    "&djp=" + listDetailJenis +
                    IdProduk + idRuangan
                    , true).then(function (dat) {
                        details = dat.data.produk;
                        for (var i = 0; i < details.length; i++) {//stockawal
                            details[i].no = i + 1
                            details[i].stok = 0
                            var qtyinrajal = 0;
                            var qtyinranap = 0;
                            var qtyinigd = 0;
                            var qtyingdfarmasi = 0;
                            var qtyingdlogistik = 0;
                            var qtyoutrajal = 0;
                            var qtyoutranap = 0;
                            var qtyoutigd = 0;
                            var qtyoutgdfarmasi = 0;
                            var qtyoutgdlogistik = 0;
                            var salrajal = 0;
                            var salranap = 0;
                            var saligd = 0;
                            var salgdfarmasi = 0;
                            var salgdlogistik = 0;

                            if (dat.data.stockawal.length > 0) {
                                for (var j = 0; j < dat.data.stockawal.length; j++) {
                                    if (details[i].id == dat.data.stockawal[j].produkfk) {
                                        if ($scope.depoRajal == parseInt(dat.data.stockawal[j].ruanganfk)) {
                                            salrajal = parseFloat(details[i].stok) + parseFloat(dat.data.stockawal[j].saldoawal)
                                        }

                                        if ($scope.depoRanap == parseInt(dat.data.stockawal[j].ruanganfk)) {
                                            salranap = parseFloat(details[i].stok) + parseFloat(dat.data.stockawal[j].saldoawal)
                                        }

                                        if ($scope.depoIgd == parseInt(dat.data.stockawal[j].ruanganfk)) {
                                            saligd = parseFloat(details[i].stok) + parseFloat(dat.data.stockawal[j].saldoawal)
                                        }

                                        if ($scope.gdFarmasi == parseInt(dat.data.stockawal[j].ruanganfk)) {
                                            salgdfarmasi = parseFloat(details[i].stok) + parseFloat(dat.data.stockawal[j].saldoawal)
                                        }

                                        if ($scope.gdLogistik == parseInt(dat.data.stockawal[j].ruanganfk)) {
                                            salgdlogistik = parseFloat(details[i].stok) + parseFloat(dat.data.stockawal[j].saldoawal)
                                        }

                                        details[i].salrajal = salrajal;
                                        details[i].salranap = salranap;
                                        details[i].saligd = saligd;
                                        details[i].salgdfarmasi = salgdfarmasi;
                                        details[i].salgdlogistik = salgdlogistik;

                                    } else {
                                        details[i].salrajal = salrajal;
                                        details[i].salranap = salranap;
                                        details[i].saligd = saligd;
                                        details[i].salgdfarmasi = salgdfarmasi;
                                        details[i].salgdlogistik = salgdlogistik;
                                    }
                                }
                            } else {
                                details[i].salrajal = salrajal;
                                details[i].salranap = salranap;
                                details[i].saligd = saligd;
                                details[i].salgdfarmasi = salgdfarmasi;
                                details[i].salgdlogistik = salgdlogistik;
                            }

                            details[i].hargapokok = 0
                            for (var j = 0; j < dat.data.hargapokok.length; j++) {
                                if (details[i].id == dat.data.hargapokok[j].objectprodukfk) {
                                    if (dat.data.hargapokok[j].hargaawal == null) {
                                        details[i].hargapokok = 0
                                    } else {
                                        details[i].hargapokok = parseFloat(dat.data.hargapokok[j].hargaawal)
                                    }
                                }
                            }

                            // details[i].hargaakhir = 0
                            for (var j = 0; j < dat.data.hargaakhir.length; j++) {
                                if (details[i].id == dat.data.hargaakhir[j].objectprodukfk) {
                                    if (dat.data.hargaakhir[j].hargaakhir == null) {
                                        details[i].hargaakhir = 0
                                    } else {
                                        details[i].hargaakhir = parseFloat(dat.data.hargaakhir[j].hargaakhir)
                                    }
                                }
                            }

                            details[i].rpstokawal = parseFloat(details[i].hargapokok) * parseFloat(details[i].stok)
                            details[i].pembelian = 0
                            for (var j = 0; j < dat.data.pembelian.length; j++) {
                                if (details[i].id == dat.data.pembelian[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.pembelian[j].ruanganfk)) {
                                        qtyinrajal = parseFloat(qtyinrajal) + parseFloat(dat.data.pembelian[j].qty)
                                    }

                                    if ($scope.depoRanap == parseInt(dat.data.pembelian[j].ruanganfk)) {
                                        qtyinranap = parseFloat(qtyinranap) + parseFloat(dat.data.pembelian[j].qty)
                                    }

                                    if ($scope.depoIgd == parseInt(dat.data.pembelian[j].ruanganfk)) {
                                        qtyinigd = parseFloat(qtyinigd) + parseFloat(dat.data.pembelian[j].qty)
                                    }

                                    if ($scope.gdFarmasi == parseInt(dat.data.pembelian[j].ruanganfk)) {
                                        qtyingdfarmasi = parseFloat(qtyingdfarmasi) + parseFloat(dat.data.pembelian[j].qty)
                                    }

                                    if ($scope.gdLogistik == parseInt(dat.data.pembelian[j].ruanganfk)) {
                                        qtyingdlogistik = parseFloat(qtyingdlogistik) + parseFloat(dat.data.pembelian[j].qty)
                                    }

                                    details[i].qtyinrajal = qtyinrajal;
                                    details[i].qtyinranap = qtyinranap;
                                    details[i].qtyinigd = qtyinigd;
                                    details[i].qtyingdfarmasi = qtyingdfarmasi;
                                    details[i].qtyingdlogistik = qtyingdlogistik;

                                    // details[i].pembelian = parseFloat(dat.data.pembelian[j].qty)
                                } else {
                                    details[i].qtyinrajal = qtyinrajal;
                                    details[i].qtyinranap = qtyinranap;
                                    details[i].qtyinigd = qtyinigd;
                                    details[i].qtyingdfarmasi = qtyingdfarmasi;
                                    details[i].qtyingdlogistik = qtyingdlogistik;
                                }
                            }

                            details[i].rppembelian = parseFloat(details[i].hargapokok) * parseFloat(details[i].pembelian)
                            details[i].rpratarata = parseFloat(details[i].hargaakhir)
                            details[i].pinjamplus = 0
                            var pinjamanrj = 0;
                            var pinjamanri = 0;
                            var pinjamanigd = 0;
                            var pinjamangdfarmasi = 0;
                            var pinjamangdlogistik = 0;
                            for (var j = 0; j < dat.data.pinjamplus.length; j++) {
                                if (details[i].id == dat.data.pinjamplus[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.pinjamplus[j].ruanganfk)) {
                                        pinjamanrj = parseFloat(qtyinrajal) + parseFloat(dat.data.pinjamplus[j].qty)
                                    }

                                    if ($scope.depoRanap == parseInt(dat.data.pinjamplus[j].ruanganfk)) {
                                        pinjamanri = parseFloat(qtyinranap) + parseFloat(dat.data.pinjamplus[j].qty)
                                    }

                                    if ($scope.depoIgd == parseInt(dat.data.pinjamplus[j].ruanganfk)) {
                                        pinjamanigd = parseFloat(qtyinigd) + parseFloat(dat.data.pinjamplus[j].qty)
                                    }

                                    if ($scope.gdFarmasi == parseInt(dat.data.pinjamplus[j].ruanganfk)) {
                                        pinjamangdfarmasi = parseFloat(qtyingdfarmasi) + parseFloat(dat.data.pinjamplus[j].qty)
                                    }

                                    if ($scope.gdLogistik == parseInt(dat.data.pinjamplus[j].ruanganfk)) {
                                        pinjamangdlogistik = parseFloat(qtyingdlogistik) + parseFloat(dat.data.pinjamplus[j].qty)
                                    }

                                    details[i].qtyinrajal = pinjamanrj;
                                    details[i].qtyinranap = pinjamanri;
                                    details[i].qtyinigd = pinjamanigd;
                                    details[i].qtyingdfarmasi = pinjamangdfarmasi;
                                    details[i].qtyingdlogistik = pinjamangdlogistik;

                                } else {

                                    details[i].qtyinrajal = pinjamanrj + parseFloat(qtyinrajal);
                                    details[i].qtyinranap = pinjamanri + parseFloat(qtyinranap);
                                    details[i].qtyinigd = pinjamanigd + parseFloat(qtyinigd);
                                    details[i].qtyingdfarmasi = pinjamangdfarmasi + parseFloat(qtyingdfarmasi);
                                    details[i].qtyingdlogistik = pinjamangdlogistik + parseFloat(qtyingdlogistik);
                                }
                            }

                            details[i].koreksiplus = 0
                            var koreksiplusrj = 0;
                            var koreksiplusri = 0;
                            var koreksiplusigd = 0;
                            var koreksiplusgdfarmasi = 0;
                            var koreksiplusgdlogistik = 0;
                            for (var j = 0; j < dat.data.koreksiplus.length; j++) {
                                if (details[i].id == dat.data.koreksiplus[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.koreksiplus[j].ruanganfk)) {
                                        koreksiplusrj = parseFloat(qtyinrajal) + parseFloat(dat.data.koreksiplus[j].qty)
                                    }

                                    if ($scope.depoRanap == parseInt(dat.data.koreksiplus[j].ruanganfk)) {
                                        koreksiplusri = parseFloat(qtyinranap) + parseFloat(dat.data.koreksiplus[j].qty)
                                    }

                                    if ($scope.depoIgd == parseInt(dat.data.koreksiplus[j].ruanganfk)) {
                                        koreksiplusigd = parseFloat(qtyinigd) + parseFloat(dat.data.koreksiplus[j].qty)
                                    }

                                    if ($scope.gdFarmasi == parseInt(dat.data.koreksiplus[j].ruanganfk)) {
                                        koreksiplusgdfarmasi = parseFloat(qtyingdfarmasi) + parseFloat(dat.data.koreksiplus[j].qty)
                                    }

                                    if ($scope.gdLogistik == parseInt(dat.data.koreksiplus[j].ruanganfk)) {
                                        koreksiplusgdlogistik = parseFloat(qtyingdlogistik) + parseFloat(dat.data.koreksiplus[j].qty)
                                    }

                                    details[i].qtyinrajal = koreksiplusrj;
                                    details[i].qtyinranap = koreksiplusri;
                                    details[i].qtyinigd = koreksiplusigd;
                                    details[i].qtyingdfarmasi = koreksiplusgdfarmasi;
                                    details[i].qtyingdlogistik = koreksiplusgdlogistik;

                                } else {
                                    details[i].qtyinrajal = koreksiplusrj + parseFloat(qtyinrajal);
                                    details[i].qtyinranap = koreksiplusri + parseFloat(qtyinranap);
                                    details[i].qtyinigd = koreksiplusigd + parseFloat(qtyinigd);
                                    details[i].qtyingdfarmasi = koreksiplusgdfarmasi + parseFloat(qtyingdfarmasi);
                                    details[i].qtyingdlogistik = koreksiplusgdlogistik + parseFloat(qtyingdlogistik);
                                }
                            }

                            details[i].penerimaan = parseFloat(details[i].pembelian)
                            details[i].persediaan = parseFloat(details[i].stok) + parseFloat(details[i].pinjamplus) + parseFloat(details[i].koreksiplus) + parseFloat(details[i].pembelian)
                            details[i].rppersediaan = parseFloat(details[i].persediaan) * parseFloat(details[i].rpratarata)
                            details[i].resep = 0
                            var resepRj = 0;
                            var resepRi = 0;
                            var resepIgd = 0;
                            var resepGdFarmasi = 0;
                            var resepGdLogistik = 0;
                            for (var j = 0; j < dat.data.resep.length; j++) {
                                if (details[i].id == dat.data.resep[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.resep[j].ruanganfk)) {
                                        resepRj = parseFloat(qtyoutrajal) + parseFloat(dat.data.resep[j].qty)
                                    }

                                    if ($scope.depoRanap == parseInt(dat.data.resep[j].ruanganfk)) {
                                        resepRi = parseFloat(qtyoutranap) + parseFloat(dat.data.resep[j].qty)
                                    }

                                    if ($scope.depoIgd == parseInt(dat.data.resep[j].ruanganfk)) {
                                        resepIgd = parseFloat(qtyoutigd) + parseFloat(dat.data.resep[j].qty)
                                    }

                                    if ($scope.gdFarmasi == parseInt(dat.data.resep[j].ruanganfk)) {
                                        resepGdFarmasi = parseFloat(qtyoutgdfarmasi) + parseFloat(dat.data.resep[j].qty)
                                    }

                                    if ($scope.gdLogistik == parseInt(dat.data.resep[j].ruanganfk)) {
                                        resepGdLogistik = parseFloat(qtyoutgdlogistik) + parseFloat(dat.data.resep[j].qty)
                                    }

                                    details[i].qtyoutrajal = resepRj;
                                    details[i].qtyoutranap = resepRi;
                                    details[i].qtyoutigd = resepIgd;
                                    details[i].qtyoutgdfarmasi = resepGdFarmasi;
                                    details[i].qtyoutgdlogistik = resepGdLogistik;

                                } else {

                                    details[i].qtyoutrajal = resepRj + parseFloat(qtyoutrajal);
                                    details[i].qtyoutranap = resepRi + parseFloat(qtyoutranap);
                                    details[i].qtyoutigd = resepIgd + parseFloat(qtyoutigd);
                                    details[i].qtyoutgdfarmasi = resepGdFarmasi + parseFloat(qtyoutgdfarmasi);
                                    details[i].qtyoutgdlogistik = resepGdLogistik + parseFloat(qtyoutgdlogistik);
                                }
                            }

                            details[i].floorstok = 0
                            var floorstokRj = 0;
                            var floorstokRi = 0;
                            var floorstokIgd = 0;
                            var floorstokGdFarmasi = 0;
                            var floorstokGdLogistik = 0;
                            for (var j = 0; j < dat.data.floorstock.length; j++) {
                                if (details[i].id == dat.data.floorstock[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.floorstock[j].ruanganfk)) {
                                        floorstokRj = parseFloat(qtyoutrajal) + parseFloat(dat.data.floorstock[j].qty)
                                    }
                                    if ($scope.depoRanap == parseInt(dat.data.floorstock[j].ruanganfk)) {
                                        floorstokRi = parseFloat(qtyoutranap) + parseFloat(dat.data.floorstock[j].qty)
                                    }
                                    if ($scope.depoIgd == parseInt(dat.data.floorstock[j].ruanganfk)) {
                                        floorstokIgd = parseFloat(qtyoutigd) + parseFloat(dat.data.floorstock[j].qty)
                                    }
                                    if ($scope.gdFarmasi == parseInt(dat.data.floorstock[j].ruanganfk)) {
                                        floorstokGdFarmasi = parseFloat(qtyoutgdfarmasi) + parseFloat(dat.data.floorstock[j].qty)
                                    }
                                    if ($scope.gdLogistik == parseInt(dat.data.floorstock[j].ruanganfk)) {
                                        floorstokGdLogistik = parseFloat(qtyoutgdlogistik) + parseFloat(dat.data.floorstock[j].qty)
                                    }

                                    details[i].qtyoutrajal = floorstokRj;
                                    details[i].qtyoutranap = floorstokRi;
                                    details[i].qtyoutigd = floorstokIgd;
                                    details[i].qtyoutgdfarmasi = floorstokGdFarmasi;
                                    details[i].qtyoutgdlogistik = floorstokGdLogistik;

                                } else {

                                    details[i].qtyoutrajal = floorstokRj + parseFloat(qtyoutrajal);
                                    details[i].qtyoutranap = floorstokRi + parseFloat(qtyoutranap);
                                    details[i].qtyoutigd = floorstokIgd + parseFloat(qtyoutigd);
                                    details[i].qtyoutgdfarmasi = floorstokGdFarmasi + parseFloat(qtyoutgdfarmasi);
                                    details[i].qtyoutgdlogistik = floorstokGdLogistik + parseFloat(qtyoutgdlogistik);

                                }
                            }

                            details[i].penghapusan = 0
                            details[i].pinjammin = 0
                            var pinjamminRj = 0;
                            var pinjamminRi = 0;
                            var pinjamminIgd = 0;
                            var pinjamminGdFarmasi = 0;
                            var pinjamminGdLogistik = 0;
                            for (var j = 0; j < dat.data.pinjammin.length; j++) {
                                if (details[i].id == dat.data.pinjammin[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.pinjammin[j].ruanganfk)) {
                                        pinjamminRj = parseFloat(qtyoutrajal) + parseFloat(dat.data.pinjammin[j].qty)
                                    }
                                    if ($scope.depoRanap == parseInt(dat.data.pinjammin[j].ruanganfk)) {
                                        pinjamminRi = parseFloat(qtyoutranap) + parseFloat(dat.data.pinjammin[j].qty)
                                    }
                                    if ($scope.depoIgd == parseInt(dat.data.pinjammin[j].ruanganfk)) {
                                        pinjamminIgd = parseFloat(qtyoutigd) + parseFloat(dat.data.pinjammin[j].qty)
                                    }
                                    if ($scope.gdFarmasi == parseInt(dat.data.pinjammin[j].ruanganfk)) {
                                        pinjamminGdFarmasi = parseFloat(qtyoutgdfarmasi) + parseFloat(dat.data.pinjammin[j].qty)
                                    }
                                    if ($scope.gdLogistik == parseInt(dat.data.pinjammin[j].ruanganfk)) {
                                        pinjamminGdLogistik = parseFloat(qtyoutgdlogistik) + parseFloat(dat.data.pinjammin[j].qty)
                                    }

                                    details[i].qtyoutrajal = pinjamminRj;
                                    details[i].qtyoutranap = pinjamminRi;
                                    details[i].qtyoutigd = pinjamminIgd;
                                    details[i].qtyoutgdfarmasi = pinjamminGdFarmasi;
                                    details[i].qtyoutgdlogistik = pinjamminGdLogistik;

                                } else {

                                    details[i].qtyoutrajal = pinjamminRj + parseFloat(qtyoutrajal);
                                    details[i].qtyoutranap = pinjamminRi + parseFloat(qtyoutranap);
                                    details[i].qtyoutigd = pinjamminIgd + parseFloat(qtyoutigd);
                                    details[i].qtyoutgdfarmasi = pinjamminGdFarmasi + parseFloat(qtyoutgdfarmasi);
                                    details[i].qtyoutgdlogistik = pinjamminGdLogistik + parseFloat(qtyoutgdlogistik);
                                }
                            }

                            details[i].koreksimin = 0
                            var koreksiminRj = 0;
                            var koreksiminRi = 0;
                            var koreksiminIgd = 0;
                            var koreksiminGdFarmasi = 0;
                            var koreksiminGdLogistik = 0;
                            for (var j = 0; j < dat.data.koreksimin.length; j++) {
                                if (details[i].id == dat.data.koreksimin[j].produkfk) {
                                    if ($scope.depoRajal == parseInt(dat.data.koreksimin[j].ruanganfk)) {
                                        koreksiminRj = parseFloat(qtyoutrajal) + parseFloat(dat.data.koreksimin[j].qty)
                                    }
                                    if ($scope.depoRanap == parseInt(dat.data.koreksimin[j].ruanganfk)) {
                                        koreksiminRi = parseFloat(qtyoutranap) + parseFloat(dat.data.koreksimin[j].qty)
                                    }
                                    if ($scope.depoIgd == parseInt(dat.data.koreksimin[j].ruanganfk)) {
                                        koreksiminIgd = parseFloat(qtyoutigd) + parseFloat(dat.data.koreksimin[j].qty)
                                    }
                                    if ($scope.gdFarmasi == parseInt(dat.data.koreksimin[j].ruanganfk)) {
                                        koreksiminGdFarmasi = parseFloat(qtyoutgdfarmasi) + parseFloat(dat.data.koreksimin[j].qty)
                                    }
                                    if ($scope.gdLogistik == parseInt(dat.data.koreksimin[j].ruanganfk)) {
                                        koreksiminGdLogistik = parseFloat(qtyoutgdlogistik) + parseFloat(dat.data.koreksimin[j].qty)
                                    }

                                    details[i].qtyoutrajal = koreksiminRj;
                                    details[i].qtyoutranap = koreksiminRi;
                                    details[i].qtyoutigd = koreksiminIgd;
                                    details[i].qtyoutgdfarmasi = koreksiminGdFarmasi;
                                    details[i].qtyoutgdlogistik = koreksiminGdLogistik;

                                } else {

                                    details[i].qtyoutrajal = koreksiminRj + parseFloat(qtyoutrajal);
                                    details[i].qtyoutranap = koreksiminRi + parseFloat(qtyoutranap);
                                    details[i].qtyoutigd = koreksiminIgd + parseFloat(qtyoutigd);
                                    details[i].qtyoutgdfarmasi = koreksiminGdFarmasi + parseFloat(qtyoutgdfarmasi);
                                    details[i].qtyoutgdlogistik = koreksiminGdLogistik + parseFloat(qtyoutgdlogistik);

                                }
                            }

                            // details[i].pengeluaran = parseFloat(details[i].resep) + parseFloat(details[i].floorstok) + parseFloat(details[i].penghapusan) + parseFloat(details[i].pinjammin) + parseFloat(details[i].koreksimin)
                            // details[i].rppengeluaran = parseFloat(details[i].pengeluaran) * parseFloat(details[i].hargaakhir)
                            // details[i].stokakhir = parseFloat(details[i].persediaan) - parseFloat(details[i].pengeluaran)
                            // details[i].rpstokakhir = parseFloat(details[i].rppersediaan) - parseFloat(details[i].rppengeluaran)

                            details[i].sakrajal = parseFloat(details[i].salrajal) + parseFloat(details[i].qtyinrajal) - parseFloat(details[i].qtyoutrajal)
                            details[i].sakranap = parseFloat(details[i].salranap) + parseFloat(details[i].qtyinranap) - parseFloat(details[i].qtyoutranap)
                            details[i].sakigd = parseFloat(details[i].saligd) + parseFloat(details[i].qtyinigd) - parseFloat(details[i].qtyoutigd)
                            details[i].sakgdfarmasi = parseFloat(details[i].salgdfarmasi) + parseFloat(details[i].qtyingdfarmasi) - parseFloat(details[i].qtyoutgdfarmasi)
                            // details[i].sakgdlogistik = parseFloat(details[i].salgdlogistik) + parseFloat(details[i].qtyingdlogistik) - parseFloat(details[i].qtyoutgdlogistik)

                            details[i].salaktotal = details[i].sakrajal + details[i].sakranap + details[i].sakigd + details[i].sakgdfarmasi// + details[i].sakgdlogistik
                        }
                        for (var i = 0; i < details.length; i++) {
                            details[i].no = i + 1
                            // ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(details[i].rpstokawal)
                            // ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(details[i].rppersediaan)
                            // ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(details[i].rppengeluaran)
                            // ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(details[i].rpstokakhir)
                        }

                        // $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: details,
                            pageSize: 20,
                            total: details.length,
                            serverPaging: false,
                            // sort:[
                            //     {
                            //         field: "namaproduk",
                            //         dir:"asc"
                            //     }
                            // ],

                        });
                        $scope.dataExcel = dat.data.data;
                        $scope.isRouteLoading = false;
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
                cacheHelper.set('NeracaPersediaanCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.cariPopUp = function () {
                console.log($scope.selectedJenisProduk)
                init();
                $scope.popUpCari.close()
            }

            $scope.batal = function () {
                $scope.popUpCari.close()
            }

            $scope.Neraca = function () {
                if ($scope.item.neraca == true) {
                    $scope.item.ruangan = ''

                }
            }

            $scope.closingPersediaan = function () {
                $scope.popUp.center().open();
            }

            $scope.lanjutkan = function () {
                var stt = 'false'
                if (confirm('Close Persediaan bulan "' + dateHelper.formatDate($scope.item.tglAkhir, "MMMM YYYY") + '"')) {
                    // Save it!
                    stt = 'true';
                    // var norec_tea = $scope.item.norecSaldo
                    // if ($scope.item.norecSaldo ==  undefined){
                    //     norec_tea ='-'
                    // }
                    var tgltgl = moment($scope.item.tglAkhir).format('YYYYMM');
                    var objSave =
                    {
                        ym: tgltgl,
                        data: details
                    }
                    manageLogistikPhp.postclosingpersediaan(objSave).then(function (e) {

                    })
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Posisi Stock" + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + '-' + moment($scope.item.tglAkhir).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [
                    {
                        field: "no",
                        title: "<h3 align=center>No<h3>",
                        width: "55px",
                    },
                    {
                        field: "id",
                        title: "<h3 align=center>Kode<h3>",
                        width: "100px"
                    },
                    {
                        field: "namaproduk",
                        title: "<h3 align=center>Nama Barang<h3>",
                        width: "130px"
                    },
                    {
                        title: "<h3 align=center>Apotik R. Jalan<h3>",
                        width: "130px",
                        columns: [
                            {
                                field: "salrajal",
                                title: "<h3 align=center>S. Awal<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyinrajal",
                                title: "<h3 align=center>M. IN<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyoutrajal",
                                title: "<h3 align=center>M. OUT<h3>",
                                width: "90px"
                            },
                            {
                                field: "sakrajal",
                                title: "<h3 align=center>S. Akhir<h3>",
                                width: "90px"
                            }

                        ]
                    },
                    {
                        title: "<h3 align=center>Apotik R. Ranap<h3>",
                        width: "130px",
                        columns: [
                            {
                                field: "salranap",
                                title: "<h3 align=center>S. Awal<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyinranap",
                                title: "<h3 align=center>M. IN<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyoutranap",
                                title: "<h3 align=center>M. OUT<h3>",
                                width: "90px"
                            },
                            {
                                field: "sakranap",
                                title: "<h3 align=center>S. Akhir<h3>",
                                width: "90px"
                            }
                        ]
                    },
                    {
                        title: "<h3 align=center>Apotik R. IGD<h3>",
                        width: "130px",
                        columns: [
                            {
                                field: "saligd",
                                title: "<h3 align=center>S. Awal<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyinigd",
                                title: "<h3 align=center>M. IN<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyoutigd",
                                title: "<h3 align=center>M. OUT<h3>",
                                width: "90px"
                            },
                            {
                                field: "sakigd",
                                title: "<h3 align=center>S. Akhir<h3>",
                                width: "90px"
                            }
                        ]
                    },
                    {
                        title: "<h3 align=center>Gudang Farmasi<h3>",
                        width: "130px",
                        columns: [
                            {
                                field: "salgdfarmasi",
                                title: "<h3 align=center>S. Awal<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyingdfarmasi",
                                title: "<h3 align=center>M. IN<h3>",
                                width: "90px"
                            },
                            {
                                field: "qtyoutgdfarmasi",
                                title: "<h3 align=center>M. OUT<h3>",
                                width: "90px"
                            },
                            {
                                field: "sakgdfarmasi",
                                title: "<h3 align=center>S. Akhir<h3>",
                                width: "90px"
                            }
                        ]
                    },
                    // {
                    //     title: "<h3 align=center>Gudang Logistik<h3>",
                    //     width: "130px",
                    //     columns: [
                    //         {
                    //             field: "salgdlogistik",
                    //             title: "<h3 align=center>S. Awal<h3>",
                    //             width: "90px"
                    //         },
                    //         {
                    //             field: "qtyingdlogistik",
                    //             title: "<h3 align=center>M. IN<h3>",
                    //             width: "90px"
                    //         },
                    //         {
                    //             field: "qtyoutgdlogistik",
                    //             title: "<h3 align=center>M. OUT<h3>",
                    //             width: "90px"
                    //         },
                    //         {
                    //             field: "sakgdlogistik",
                    //             title: "<h3 align=center>S. Akhir<h3>",
                    //             width: "90px"
                    //         }
                    //     ]
                    // },
                    {
                        field: "salaktotal",
                        title: "<h3 align=center>Total Saldo Akhir<h3>",
                        width: "150px"
                    },
                    {
                        title: "<h3 align=center>Total Rupiah<h3>",
                        width: "150px",
                        columns: [
                            {
                                field: "hargapokok",
                                title: "<h3 align=center>Harga Pokok<h3>",
                                width: "120px"
                            },
                            {
                                field: "jumlahrupiah",
                                title: "<h3 align=center>Jumlah<h3>",
                                width: "120px"
                            }
                        ]
                    },
                    {
                        title: "<h3 align=center>Keterangan Obat Expire<h3>",
                        width: "150px",
                        columns: [
                            {
                                field: "expiredate",
                                title: "<h3 align=center>ED<h3>",
                                width: "110px"
                            },
                            {
                                field: "hargaed",
                                title: "<h3 align=center>Rp.<h3>",
                                width: "110px"
                            }
                        ]
                    }
                    // {
                    //     field: "isgeneric",
                    //     title: "Jenis",
                    //     width: "60px"
                    // },
                    // {
                    //     field: "satuanstandar",
                    //     title: "Satuan",
                    //     width: "20px",
                    // },
                    // {
                    //     field: "stok",
                    //     title: "Stok",
                    //     width: "30px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: stok #', '')}}</span>"
                    // },
                    // {
                    //     field: "hargapokok",
                    //     title: "Harga Pokok",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargapokok #', '')}}</span>"
                    // },
                    // {
                    //     field: "rpstokawal",
                    //     title: "Rp. Stok Awal",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rpstokawal #', '')}}</span>"
                    // },
                    // {
                    //     field: "pembelian",
                    //     title: "Pembelian",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: pembelian #', '')}}</span>"
                    // },
                    // {
                    //     field: "rppembelian",
                    //     title: "Rp.Pembelian",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rppembelian #', '')}}</span>"
                    // },
                    // {
                    //     field: "rpratarata",
                    //     title: "Rp.Rata-Rata",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rpratarata #', '')}}</span>"
                    // },
                    // {
                    //     field: "pinjamplus",
                    //     title: "Pinjam (+)",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: pinjamplus #', '')}}</span>"
                    // },
                    // {
                    //     field: "koreksiplus",
                    //     title: "Koreksi (+)",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: koreksiplus #', '')}}</span>"
                    // },
                    // {
                    //     field: "penerimaan",
                    //     title: "Penerimaan",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: penerimaan #', '')}}</span>"
                    // },
                    // {
                    //     field: "persediaan",
                    //     title: "Persediaan",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: persediaan #', '')}}</span>"
                    // },
                    // {
                    //     field: "rppersediaan",
                    //     title: "Rp. Persediaan",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rppersediaan #', '')}}</span>"
                    // },
                    // {
                    //     field: "resep",
                    //     title: "Resep",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: resep #', '')}}</span>"
                    // },
                    // {
                    //     field: "floorstok",
                    //     title: "Floorstok",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: floorstok #', '')}}</span>"
                    // },
                    // {
                    //     field: "penghapusan",
                    //     title: "Penghapusan",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: penghapusan #', '')}}</span>"
                    // },
                    // {
                    //     field: "pinjammin",
                    //     title: "Pinjam (-)",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: pinjammin #', '')}}</span>"
                    // },
                    // {
                    //     field: "koreksimin",
                    //     title: "Koreksi (-)",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: koreksimin #', '')}}</span>"
                    // },
                    // {
                    //     field: "pengeluaran",
                    //     title: "Pengeluaran",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: pengeluaran #', '')}}</span>"
                    // },
                    // {
                    //     field: "rppengeluaran",
                    //     title: "Rp. Pengeluaran",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rppengeluaran #', '')}}</span>"
                    // },
                    // {
                    //     field: "stokakhir",
                    //     title: "Stok Akhir",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: stokakhir #', '')}}</span>"
                    // },
                    // {
                    //     field: "rpstokakhir",
                    //     title: "Rp. Stok Akhir",
                    //     width: "50px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: rpstokakhir #', '')}}</span>"
                    // },


                ],

            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
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

            //***********************************BATAS
        }
    ]);
});
