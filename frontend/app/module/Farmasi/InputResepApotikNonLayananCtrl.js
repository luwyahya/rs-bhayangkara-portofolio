define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputResepApotikNonLayananCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglAwal = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.isRouteLoading = false;
            $scope.tombolSimpanVis = true;
            $scope.item.hargaNetto = 0;
            var pegawaiUser = {}
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail = [];
            $scope.currentAturanPakai = []
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var strStatus = 0
            var tarifJasa = 0
            var jasa = 0
            var jmlQty = 0
            var Totals = 0
            $scope.listDataSigna = [
                {
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [
                        { "id": 1, "nama": "P", 'isChecked': false },
                        { "id": 2, "nama": "S", 'isChecked': false },
                        { "id": 3, "nama": "Sr", 'isChecked': false },
                        { "id": 4, "nama": "M", 'isChecked': false }
                    ]
                }
            ];
             var combolaporan={};
             combolaporan = [
                {id:101 , laporan:"Bebas"},
                {id:102 , laporan:"Resep"},           
            ];
            $scope.listLaporan = combolaporan;  
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0
            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }
                $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1' 
                if (jml == 0) {
                    $scope.item.aturanPakai = ''
                }

            }
            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('InputResepApotikNonLayananCtrl');                
                var chacePeriode2 = cacheHelper.get('cacheanuaing');
                if (chacePeriode2 != undefined) {
                    $scope.item.ruangan = chacePeriode2[0];
                    $scope.item.aturanPakai = chacePeriode2[1];
                    $scope.item.jenisKemasan = chacePeriode2[2];
                }                
                if(chacePeriode != undefined){
                    norecResep = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode ={ 0 : '' ,
                         1 : '',
                         2 : '',
                         3 : '', 
                         4 : '',
                         5 : '',
                         6 : ''
                     }
                     cacheHelper.set('InputResepApotikNonLayananCtrl', chacePeriode);
                } else {
                    init()
                }                
            }

            $scope.LoadResep = function () {
                medifirstService.get('farmasi/get-norec_bebas?nostruk=' + $scope.item.resep, true).then(function (dat) {
                    norecResep = dat.data[0].norec
                    noOrder = 'EditResep'
                    init();
                })
            }

            function init() {
                $scope.isRouteLoading = true;                
                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listPenulisResep = dat.data.penulisresep;
                    $scope.listRuangan = dat.data.ruangan;
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produk;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    $scope.listRoute = dat.data.route;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    pegawaiUser = dat.data.detaillogin[0];
                    $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield
                    $scope.listsbsm = [{ id: 1, name: 'Sebelum Makan' }, { id: 2, name: 'Bersama' }, { id: 3, name: 'Sesudah Makan' }]
                    if (noOrder != '') {
                        if (noOrder == 'EditResep') {
                            medifirstService.get("farmasi/get-detail-obat-bebas?norecResep=" + norecResep, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                $scope.item.resep = data_ih.data.detailresep.nostruk
                                $scope.item.ruangan = { id: data_ih.data.detailresep.id, namaruangan: data_ih.data.detailresep.namaruangan }
                                $scope.item.penulisResep = { id: data_ih.data.detailresep.pgid, namalengkap: data_ih.data.detailresep.namalengkap }
                                $scope.item.nocm = data_ih.data.detailresep.nocm
                                $scope.item.namapasien = data_ih.data.detailresep.nama
                                $scope.item.tglLahir = data_ih.data.detailresep.tgllahir
                                $scope.item.noTelepon = data_ih.data.detailresep.notlp
                                $scope.item.alamat = data_ih.data.detailresep.alamat
                                $scope.item.tglAwal = moment(data_ih.data.detailresep.tglresep).format('YYYY-MM-DD HH:mm:ss'),
                                data2 = data_ih.data.pelayananPasien
                                
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });                               
                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        } else {
                            medifirstService.get("farmasi/get-detail-order?noorder=" + noOrder, true).then(function (dat) {
                                $scope.isRouteLoading = false;
                                $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                                $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                                data2 = dat.data.orderpelayanan
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    // data.no = $scope.item.no
                                    // medifirstService.getDataTableTransaksi("logistik/get-produkdetail?"+
                                    //     "produkfk="+ data2[i].produkfk +
                                    //     "&ruanganfk="+ $scope.item.ruangan.id , true).then(function(dat){
                                    //         //dataProdukDetail =dat.data.detail;
                                    //         // data2[i].jmlstok =dat.data.jmlstok / data2[i].nilaiKonversi 
                                    //         // data2[i].jumlah =dat.data.detail.jumlah//parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                                    //         // $scope.item.hargaSatuan =0
                                    //         // $scope.item.hargadiskon =0
                                    //         // $scope.item.total =0
                                    //         // $scope.item.jumlahxmakan =1
                                    //         // $scope.item.dosis =dat.data.detail.dosis
                                    //         // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)

                                    //         // $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                                    //         // $scope.item.satuan = {ssid:$scope.dataSelected.satuanviewfk,satuanstandar:$scope.dataSelected.satuanview}
                                    //         for (var i = 0; i < dat.data.detail.length; i++) {
                                    //             if (parseFloat(data2[i].jumlah * parseFloat(data2[i].nilaikonversi) ) <= parseFloat(dat.data.detail[i].qtyproduk) ){
                                    //                 hrg1 = parseFloat(dat.data.detail[i].hargajual)* parseFloat(data2[i].nilaikonversi)
                                    //                 hrgsdk = parseFloat(dat.data.detail[i].hargadiscount) * parseFloat(data2[i].nilaikonversi)
                                    //                 data2[i].hargasatuan = hrg1 
                                    //                 data2[i].hargadiscount = hrgsdk 
                                    //                 data2[i].total = parseFloat(data2[i].jumlah) * (hrg1-hrgsdk)
                                    //                 data2[i].nostrukterimafk = dat.data.detail[i].norec
                                    //                 data2[i].asalproduk=dat.data.detail[i].asalproduk
                                    //                 data2[i].asalprodukfk=dat.data.detail[i].objectasalprodukfk
                                    //                 break;
                                    //             }
                                    //         }
                                    //         // data2[i].hargasatuan =dat.data.detail.hargajual
                                    //         // data2[i].hargadiscount = dat.data.detail.hargadiscount
                                    //         // data2[i].total = (dat.data.detail.hargajual-dat.data.detail.hargadiscount)*data2[i].jumlah
                                    // });

                                    data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                    data2[i].tglregistrasi = $scope.item.tglregistrasi
                                    // data.generik = null
                                    //data2[i].hargajual = $scope.item.hargaSatuan
                                    // data.jenisobatfk = null
                                    data2[i].kelasfk = $scope.item.kelas.id
                                    //data2[i].stock = $scope.item.stok
                                    //data2[i].harganetto = $scope.item.hargaSatuan
                                    //data2[i].nostrukterimafk = noTerima
                                    // data.ruanganfk = $scope.item.ruangan.id

                                    // data.rke = $scope.item.rke
                                    // data.jeniskemasanfk = $scope.item.jenisKemasan.id
                                    // data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                    // data2[i].aturanpakaifk = $scope.item.aturanPakai.id
                                    // data2[i].aturanpakai = $scope.item.aturanPakai.nama
                                    // data.routefk = $scope.item.route.id
                                    // data.route = $scope.item.route.name
                                    //data2[i].asalprodukfk = $scope.item.asal.id
                                    //data2[i].asalproduk = $scope.item.asal.asalproduk
                                    // data.produkfk = $scope.item.produk.id
                                    // data.namaproduk = $scope.item.produk.namaproduk
                                    // data.nilaikonversi = $scope.item.nilaiKonversi
                                    // data.satuanstandarfk = $scope.item.satuan.id
                                    // data.satuanstandar = $scope.item.satuan.satuanstandar
                                    // data.satuanviewfk = $scope.item.satuan.ssid
                                    // data.satuanview = $scope.item.satuan.satuanstandar
                                    //data2[i].jmlstok = $scope.item.stok
                                    // data.jumlah = $scope.item.jumlah
                                    //data2[i].hargasatuan = $scope.item.hargaSatuan
                                    //data2[i].hargadiscount = $scope.item.hargadiskon
                                    //data2[i].total = $scope.item.total
                                }
                                // $scope.dataGrid.add($scope.dataSelected)
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                // $scope.dataGrid = dat.data.orderpelayanan

                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                    }
                });

            }

            $scope.getSatuan = function () {
                /* info stok all ruangan */
                medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        for (var i = 0; i < e.data.infostok.length; i++) {
                            e.data.infostok[i].no = i + 1
                        }
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        })
                    })
                /* end info stok all ruangan */

                GETKONVERSI()
            }

            function GETKONVERSI() {
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
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = 0;
                $scope.item.dosis = 1
                $scope.item.jumlahxmakan = 1
                if ($scope.item.kdkelompokPasien.laporan == "Resep"){

                    $scope.item.tarifadminresep = 800

                }else{

                    $scope.item.tarifadminresep = 0
                }
                medifirstService.get("farmasi/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id+
                    "&kelompokpasien=" + $scope.item.kdkelompokPasien.id, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        $scope.item.kekuatan = dat.data.kekuatan
                        $scope.item.sediaan = dat.data.sediaan
                        $scope.consis = dat.data.consis;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        if ($scope.dataSelected != undefined) {
                            $scope.item.jumlah = $scope.dataSelected.jumlahobat
                            $scope.item.jumlahbulat = Math.ceil($scope.dataSelected.jumlah);
                            $scope.item.dosis = $scope.dataSelected.dosis
                            $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                            $scope.item.satuan = { ssid: $scope.dataSelected.satuanviewfk, satuanstandar: $scope.dataSelected.satuanview }
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.hargaNetto = $scope.dataSelected.harganetto
                            $scope.item.total = $scope.dataSelected.total
                        }

                        // dataProdukDetail =dat.data.detail;
                        // $scope.item.stok =dat.data.jmlstok / $scope.item.nilaiKonversi 
                        // $scope.item.jumlah =$scope.dataSelected.jumlah//parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                        // $scope.item.hargaSatuan =0
                        // $scope.item.hargadiskon =0
                        // $scope.item.hargaNetto=0
                        // $scope.item.total =0                    
                        // $scope.item.dosis =$scope.dataSelected.dosis
                        // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
                        // $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                        // $scope.item.satuan = {ssid:$scope.dataSelected.satuanviewfk,satuanstandar:$scope.dataSelected.satuanview}
                        // $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                        // $scope.item.hargaNetto  = $scope.dataSelected.harganetto
                        // $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                        // $scope.item.total = $scope.dataSelected.total 
                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0// parseFloat(newValue) *                           
                    }
                }
            });

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.jumlahbulat = 0;
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0// parseFloat(newValue) *                            
                    }
                }
            });

            $scope.$watch('item.rke', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (tarifJasa == 0) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                                break;
                            }
                        }
                    }
                }
            });

            $scope.$watch('item.jumlahxmakan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                        $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                    }
                }
            });
            $scope.$watch('item.dosis', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                        $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                    }
                }
            });

            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Racikan') {
                        $scope.showRacikanDose = true
                    } else {
                        $scope.showRacikanDose = false
                    }
                }
            });

            $scope.$watch('item.hargadiskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    hrgsdk = $scope.item.hargadiskon
                    $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                }
            })

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.kdkelompokPasien.laporan == "Resep"){

                        $scope.item.tarifadminresep = 800

                    }else{

                        $scope.item.tarifadminresep = 0
                    }
                    if ($scope.item.jenisKemasan == undefined) {
                        return
                    }
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        return;
                    }
                    var qty20 = 0
                    tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                    if (parseFloat(tarifJasa) != 0) {
                        if ($scope.item.jenisKemasan.id == 2) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                        }
                        if ($scope.item.jenisKemasan.id == 1) {
                            qty20 = Math.floor(parseFloat($scope.item.jumlah) / 20)
                            if (parseFloat($scope.item.jumlah) % 20 == 0) {
                                qty20 = qty20
                            } else {
                                qty20 = qty20 + 1
                            }

                            if (qty20 != 0) {
                                tarifJasa = tarifJasa * qty20
                            }

                        }
                    }
                    if ($scope.item.no == undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                            }
                        }
                    }
                    // tarifJasa = 
                    $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                    var ada = false;
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                        if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                            hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
                            hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                            $scope.item.hargaSatuan = hrg1
                            $scope.item.hargaNetto = Math.round(parseFloat(dataProdukDetail[i].harganetto) * parseFloat($scope.item.nilaiKonversi))
                            if ($scope.item.hargadiskon == 0) {
                                $scope.item.hargadiskon = hrgsdk
                            } else {
                                hrgsdk = $scope.item.hargadiskon
                            }
                            $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                            noTerima = dataProdukDetail[i].norec
                            $scope.item.asal = { id: dataProdukDetail[i].objectasalprodukfk, asalproduk: dataProdukDetail[i].asalproduk }
                            ada = true;
                            break;
                        }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0

                        noTerima = ''
                        if (dataProdukDetail.length > 1) {
                            var stt = 'false'
                            if (confirm('Struk Penerimaan berbeda, merge/satukan stok? ')) {
                                var objSave =
                                {
                                    produkfk: $scope.item.produk.id,
                                    ruanganfk: $scope.item.ruangan.id
                                }

                                $scope.tombolSimpanVis = false;
                                medifirstService.post('farmasi/save-stock-merger', objSave).then(function (e) {
                                    Kosongkan()
                                })
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }

                        }
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargaNetto = 0
                    }

                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if ($scope.item.penulisResep == undefined) {
                    alert("Penulis Resep Belum Diisi!")
                    return;
                }

                if ($scope.item.ruangan == undefined) {
                    alert("Ruangan Belum Diisi!")
                    return;
                }

                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }

                if ($scope.item.hargaSatuan == 0) {
                    alert("Harga Satuan tidak memiliki harga!")
                    return;
                }
                
                if ($scope.item.total == 0) {
                    alert("Stok tidak ada harus di isi!")
                    return;
                }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    alert("Jumlah blm di isi!!")
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
                if ($scope.item.aturanPakai == undefined) {
                    alert("Aturan Pakai Belum Diisi!!")
                    return;
                }
                var jRacikan = null
                if ($scope.item.jenisRacikan != undefined) {
                    jRacikan = $scope.item.jenisRacikan.id
                }
                var dosis = 1;
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    dosis = $scope.item.dosis;
                    $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                } else {
                    dosis = 1;
                    $scope.item.jumlahxmakan = $scope.item.jumlah
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                $scope.disabledRuangan = true;
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                            data.tglregistrasi = moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')
                            data.generik = null
                            data.hargajual = String($scope.item.hargaSatuan)
                            data.jenisobatfk = jRacikan
                            data.stock = String($scope.item.stok)
                            data.harganetto = String($scope.item.hargaNetto)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id
                            data.rke = $scope.item.rke
                            data.jeniskemasanfk = $scope.item.jenisKemasan.id
                            data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                            data.aturanpakai = $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
                            data.ispagi = $scope.item.chkp
                            data.issiang = $scope.item.chks
                            data.issore = $scope.item.chksr
                            data.ismalam = $scope.item.chkm
                            // data.aturanpakai2 = $scope.item.aturanPakai2 
                            // data.sbsmid = $scope.item.sbsm.id
                            // data.sbsmname = $scope.item.sbsm.name
                            data.routefk = null//$scope.item.route.id
                            data.route = null//$scope.item.route.name
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = String($scope.item.stok)
                            data.jumlah = $scope.item.jumlahbulat
                            data.jumlahobat = $scope.item.jumlah
                            data.dosis = dosis
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargadiskon)
                            data.total = $scope.item.total
                            data.jmldosis = String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan)
                            data.jasa = tarifJasa

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                pageSize: 10,
                                total: data2[0].length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        noregistrasifk: norec_apd,//$scope.item.noRegistrasi,
                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                        generik: null,
                        hargajual: String($scope.item.hargaSatuan),
                        jenisobatfk: jRacikan,
                        stock: String($scope.item.stok),
                        harganetto: String($scope.item.hargaNetto),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,//£££
                        rke: $scope.item.rke,
                        jeniskemasanfk: $scope.item.jenisKemasan.id,
                        jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                        // aturanpakaifk:$scope.item.aturanPakai.id,
                        // aturanpakai:$scope.item.aturanPakai.name,
                        aturanpakai: $scope.item.aturanPakai,//+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                        ispagi: $scope.item.chkp,
                        issiang: $scope.item.chks,
                        issore: $scope.item.chksr,
                        ismalam: $scope.item.chkm,
                        // aturanpakai2: $scope.item.aturanPakai2 ,
                        // sbsmid: $scope.item.sbsm.id,
                        // sbsmname: $scope.item.sbsm.name,
                        routefk: null,//,$scope.item.route.id,
                        route: null,//$scope.item.route.name,
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: String($scope.item.stok),
                        jumlah: $scope.item.jumlahbulat,
                        jumlahobat: $scope.item.jumlah,
                        dosis: dosis,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargadiskon),
                        total: $scope.item.total,
                        jmldosis: String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan),
                        jasa: tarifJasa
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        pageSize: 10,
                        total: data2[0].length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                }
                if ($scope.consis == 1) {
                    $scope.statusConsis = true;
                }
                // 26  0   t       jasa produksi non steril
                // 27  0   t       jasa pelayanan TPN
                // 28  0   t       jasa pelayanan handling cytotoxic
                // 29  0   t       jasa pelayanan IV Admixture
                // 30  0   t       jasa pelayanan Repacking obat injeksi
                // strStatus= $scope.item.produk.id
                Kosongkan()
                racikan = ''
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                $scope.item.no = dataSelected.no
                $scope.item.rke = dataSelected.rke
                medifirstService.get("farmasi/get-jenis-obat?jrid=" + dataSelected.jenisobatfk, true).then(function (JR) {
                    $scope.item.jenisRacikan = { id: JR.data.data[0].id, jenisracikan: JR.data.data[0].jenisracikan }
                });
                $scope.item.jenisKemasan = { id: dataSelected.jeniskemasanfk, jeniskemasan: dataSelected.jeniskemasan }
                $scope.item.aturanPakai = dataSelected.aturanpakai
                $scope.currentAturanPakai = []
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "P", 'isChecked': sp },
                            { "id": 2, "nama": "S", 'isChecked': ss },
                            { "id": 3, "nama": "Sr", 'isChecked': sr },
                            { "id": 4, "nama": "M", 'isChecked': sm }
                        ]
                    }
                ];
                // let jml = 0
                // if (sp == true) {
                //     jml = jml+1
                // }
                // if (ss == true) {
                //     jml = jml+1
                // }
                // if (sm == true) {
                //     jml = jml+1
                // }
                // $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai2 = dataSelected.aturanpakai2
                // $scope.item.sbsm = {id:dataSelected.sbsmid,name:dataSelected.sbsmname}
                // $scope.item.route = {id:dataSelected.routefk,name:dataSelected.route}
                if (dataSelected.asalprodukfk != 0) {
                    $scope.item.asal = { id: dataSelected.asalprodukfk, asalproduk: dataSelected.asalproduk }
                }
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                tarifJasa = dataSelected.jasa
                GETKONVERSI()
            }

            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                // $scope.item.dosis = 1
                $scope.item.jumlahxmakan = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.hargaNetto = 0
                // $scope.item.aturanPakai = undefined;
                $scope.dataSelected = undefined
                // $scope.listDataSigna = [
                //     {
                //         "id": 1,
                //         "nama": "Aturan Pakai",
                //         "detail": [
                //             { "id": 1, "nama": "P", 'isChecked': false },
                //             { "id": 2, "nama": "S", 'isChecked': false },
                //             { "id": 3, "nama": "Sr", 'isChecked': false },
                //             { "id": 4, "nama": "M", 'isChecked': false }
                //         ]
                //     }
                // ];
                $scope.dataSelected = undefined
            }

            $scope.batal = function () {
                var chacePeriode = {
                    0: $scope.item.ruangan,
                    1: $scope.item.aturanPakai,
                    2: $scope.item.jenisKemasan,
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: ''
                }
                cacheHelper.set('cacheanuaing', chacePeriode);
                Kosongkan();
            }

            $scope.BatalInput = function () {
                BaruLagi();
            }

            function BaruLagi() {
                $scope.item.nocm = ''
                $scope.item.namapasien = ''
                $scope.item.tglLahir = ''
                $scope.item.noTelepon = ''
                $scope.item.alamat = ''
                $scope.item.rke = 1
                $scope.dataGrid = []
                data2 = []
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "40px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "70px",
                },
                {
                    "field": "jmldosis",
                    "title": "Jml/Dss/kkuatan",
                    "width": "105px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "aturanpakai",
                    "title": "Aturan Pakai",
                    "width": "100px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty ,",
                    "width": "65px",
                },
                {
                    "field": "jumlahobat",
                    "title": "Qty o",
                    "width": "65px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                }
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.CariPasien = function () {
                if ($scope.item.nocm == "" || $scope.item.nocm == "-") {
                    $scope.item.namapasien = undefined
                    $scope.item.tglLahir = undefined
                    $scope.item.noTelepon = undefined
                    $scope.item.alamat = undefined
                    return
                }
                $scope.isLoadingNoCM = true;
                medifirstService.get("farmasi/get-detail-pasien?nocm=" + $scope.item.nocm, true).then(function (data_ih) {
                    $scope.item.nocm = data_ih.data.nocm
                    $scope.item.namapasien = data_ih.data.namapasien
                    $scope.item.tglLahir = new Date(data_ih.data.tgllahir);
                    $scope.item.noTelepon = data_ih.data.notelepon
                    $scope.item.alamat = data_ih.data.alamatlengkap
                    $scope.isLoadingNoCM = false;
                })
            }

            $scope.simpan = function () {
                var penulis = null
                if ($scope.item.penulisResep != undefined) {
                    // alert("Pilih Penulis Resep terlebih dahulu!!")
                    // return
                    penulis = $scope.item.penulisResep.id
                }
                if ($scope.item.tglLahir == undefined || $scope.item.tglLahir == "") {
                    alert("Tanggal lahir harap di isi!!")
                    return
                }
                if ($scope.item.noTelepon == undefined || $scope.item.noTelepon == "") {
                    alert("No Telephone harap di isi!!")
                    return
                }
                if ($scope.item.alamat == undefined  || $scope.item.alamat == "") {
                    alert("Alamat harap di isi!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                if ($scope.item.karyawan == true) {
                    if ($scope.item.polikaryawan == true) {
                        alert("Pilih salah satu!!")
                        return
                    }

                }
                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(data2[i].total)
                }
                var nrssp = '';
                if (norecResep != undefined) {
                    nrssp = norecResep
                }
                var kry = '';
                if ($scope.item.karyawan == true) {
                    kry = "Karyawan"
                }
                if ($scope.item.polikaryawan == true) {
                    kry = "Poli Karyawan"
                }
                var keteranBeli ="";
                if($scope.item.kdkelompokPasien.id == 101)
                {
                    keteranBeli ='Penjualan Obat Bebas';
                }else
                {
                    keteranBeli ='Penjualan Resep Obat Bebas ';
                }
                var noCMada ="";
                if($scope.item.nocm == "" || $scope.item.nocm == undefined)
                {
                    noCMada ='-';
                }else
                {
                    noCMada =$scope.item.nocm;
                }
                var strukresep = {
                    noresep: nrssp,
                    tglresep: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                    nocm: noCMada,
                    namapasien: $scope.item.namapasien,
                    penulisresepfk: penulis,
                    ruanganfk: $scope.item.ruangan.id,
                    
                    keteranganlainnya:keteranBeli ,
                    totalharusdibayar: subTotal,
                    tglLahir: moment($scope.item.tglLahir).format('YYYY-MM-DD HH:mm:ss'),
                    noTelepon: $scope.item.noTelepon,
                    alamat: $scope.item.alamat,
                    karyawan: kry,
                }

                var objSave = {
                    strukresep: strukresep,
                    details: data2
                }

                $scope.tombolSimpanVis = false;
                medifirstService.post('farmasi/save-input-non-layanan-obat', objSave).then(function (e) {

                    $scope.item.resep = e.data.data.nostruk
                        var stt = 'false'
                    // if (confirm('View resep? ')) {
                    //     // Save it!
                    //     stt = 'true';
                    // } else {
                    //     // Do nothing!
                    //     stt = 'false'
                    // }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + e.data.data.norec + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response;
                    });
                    BaruLagi()
                    if (norecResep != '') {
                        var chacePeriode = {
                            0: '',
                            1: '',
                            2: '',
                            3: '',
                            4: '',
                            5: '',
                            6: ''
                        }
                        cacheHelper.set('InputResepApotikNonLayananCtrl', chacePeriode);
                        window.history.back();
                    }
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

            $scope.BatalR = function () {
                $scope.showInputObat = true
                $scope.showRacikan = false
                $scope.item.jenisKemasan = ''
                racikan = ''
            }

            $scope.hapus = function () {
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
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
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2, pageSize: 10,
                                total: data2[0].length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                    }
                }
                Kosongkan();
            }

            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width": "50px",
                }

            ];

            //*BATAS SUCI//
        }
    ]);
});
