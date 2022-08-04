define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('InputResepApotikTapCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService','$state','CacheHelper',
        function($q, $rootScope, $scope,medifirstService,$state,cacheHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke =1;
            $scope.showInputObat =true
            $scope.showRacikan = false
            $scope.isRouteLoading=false;
            $scope.tombolSimpanVis =true
            $scope.disabledRuangan=false;
            $scope.statusConsis = false;
            // $scopemodel.pagi = false;
            // $scope.siang = false;
            // $scope.sore = false;
            // $scope.malam = false;
            $scope.hargaNetto =0;
            
            var pegawaiUser = {}
            var pagi = false;
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail=[];
            var noTerima ='';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var strStatus = 0
            var tarifJasa = 0
            var isPemakaianObatAlkes = false;
            $scope.item.aturanPakai = 
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            function LoadCache(){
                // medifirstService.get("akutansi/get-terakhir-posting", true).then(function(dat){
                //     var tgltgltgltgl = dat.data.data[0].max
                //     $scope.startDateOptions = {
                //         min: new Date(tgltgltgltgl),
                //         max: new Date($scope.now)
                //     };
                // })

                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function(dat){
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1 ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                });
                var chacePeriode2 = cacheHelper.get('cacheanuaing');
                if(chacePeriode2 != undefined){
                    $scope.item.ruangan = chacePeriode2[0];
                    $scope.item.aturanPakai = chacePeriode2[1];
                    $scope.item.jenisKemasan = chacePeriode2[2];
                }
                var chacePeriode = cacheHelper.get('InputResepApotikTapCtrl');
                if(chacePeriode != undefined){
                   //var arrPeriode = chacePeriode.split(':');
                   $scope.item.nocm = chacePeriode[0]
                   $scope.item.namaPasien = chacePeriode[1]
                   $scope.item.jenisKelamin = chacePeriode[2]
                   $scope.item.noRegistrasi = chacePeriode[3]

                   $scope.item.umur = chacePeriode[4]

                   $scope.listKelas =([{id:chacePeriode[5],namakelas:chacePeriode[6]}]) 
                   $scope.item.kelas ={id:chacePeriode[5],namakelas:chacePeriode[6]} 
                   $scope.item.tglregistrasi = chacePeriode[7]
                   norec_apd = chacePeriode[8]
                   noOrder = chacePeriode[9]
                   $scope.item.jenisPenjamin = chacePeriode[10]
                   $scope.item.kelompokPasien = chacePeriode[11]
                   $scope.item.beratBadan = chacePeriode[12]
                   $scope.item.AlergiYa = chacePeriode[13]
                   norecResep = chacePeriode[14]
                   $scope.item.penulisResep = chacePeriode[15]

                   $scope.item.tglAwal =  new Date($scope.now);
                   $scope.item.resep = '-';

                   init()
               }else{
                 
               }
               var cachePemakaianOA = cacheHelper.get('cachePemakaianOA');
               if (cachePemakaianOA != undefined){
                   isPemakaianObatAlkes = true
                   cacheHelper.set('cachePemakaianOA',undefined);
               }
           }
           function init() {
            $scope.isRouteLoading=true;
            // debugger;
            medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                $scope.isRouteLoading=false;
                $scope.listPenulisResep = dat.data.penulisresep;
                $scope.listRuangan = dat.data.ruangan;
                $scope.listJenisKemasan = dat.data.jeniskemasan;
                $scope.listProduk = dat.data.produk1;
                $scope.listAsalProduk = dat.data.asalproduk;
                $scope.listRoute = dat.data.route;
                $scope.listAturanPakai = dat.data.signa;
                $scope.listJenisRacikan = dat.data.jenisracikan;
                pegawaiUser = dat.data.detaillogin[0]; 
                $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield
                $scope.listsbsm = [{id:1,name:'Sebelum Makan'},{id:2,name:'Bersama'},{id:3,name:'Sesudah Makan'}]

                // $scope.item.ruangan = {id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan}
                // $scope.item.penulisResep = {id:data_ih.data.detailresep.pgid,namalengkap:data_ih.data.detailresep.namalengkap}

                debugger;
                if (noOrder != '') {
                    if (noOrder == 'EditResep') {
                        medifirstService.get("farmasi/get_detail-resep?norecResep="+norecResep, true).then(function(data_ih){
                            $scope.isRouteLoading=false;

                            $scope.disabledRuangan=true;
                            $scope.item.resep = data_ih.data.detailresep.noresep
                            $scope.item.ruangan = {id:data_ih.data.detailresep.id,namaruangan:data_ih.data.detailresep.namaruangan}
                            $scope.item.penulisResep = {id:data_ih.data.detailresep.pgid,namalengkap:data_ih.data.detailresep.namalengkap}

                            data2 = data_ih.data.pelayananPasien
                            for (var i = data2.length - 1; i >= 0; i--) {
                                // data.no = $scope.item.no

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
                            // $scope.item.ruangan = {id:dat.data.strukorder.id,namaruangan:dat.data.strukorder.namaruangan}
                            // $scope.item.penulisResep = {id:dat.data.strukorder.pgid,namalengkap:dat.data.strukorder.namalengkap}
                            var subTotal = 0 ;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal=subTotal+ parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        });
                    }else{
                        medifirstService.get("farmasi/get-detail-order?noorder="+noOrder, true).then(function(dat){
                            $scope.isRouteLoading=false;
                            $scope.item.ruangan = {id:dat.data.strukorder.id,namaruangan:dat.data.strukorder.namaruangan}
                            $scope.item.penulisResep = {id:dat.data.strukorder.pgid,namalengkap:dat.data.strukorder.namalengkap}
                            data2 = dat.data.orderpelayanan
                            for (var i = data2.length - 1; i >= 0; i--) {
                                // data.no = $scope.item.no
                                // medifirstService.get("farmasi/get-produkdetail?"+
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
                            
                            var subTotal = 0 ;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal=subTotal+ parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        });
                    }
                }
            });

        }

        $scope.model = function(){
            pagi='';
        }
        $scope.getSatuan = function(){

            /* info stok all ruangan */
           
             medifirstService.get("farmasi/get-info-stok?produkfk="+$scope.item.produk.id,true)
                    .then(function(e){
                        $scope.item.namaProduks=$scope.item.produk.namaproduk;
                          for (var i = 0; i < e.data.infostok.length; i++) {
                                e.data.infostok[i].no = i+1
                            }
                        $scope.dataGridStok=new kendo.data.DataSource({
                        data:e.data.infostok,
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
        function GETKONVERSI(){
            if ($scope.item.produk == undefined) {
                return
            }
            if ($scope.item.produk == "") {
                return
            }
            $scope.listSatuan = $scope.item.produk.konversisatuan
            if ($scope.listSatuan.length == 0) {
                $scope.listSatuan = ([{ssid:$scope.item.produk.ssid,satuanstandar:$scope.item.produk.satuanstandar}])
            }
            $scope.item.satuan = {ssid:$scope.item.produk.ssid,satuanstandar:$scope.item.produk.satuanstandar}
            $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
            if ($scope.item.ruangan == undefined) {
                //alert("Pilih Ruangan terlebih dahulu!!")
                return;
            }
            // if ($scope.item.asal == undefined) {
            //     //alert("Pilih asal terlebih dahulu!!")
            //     return;
            // }

            

            $scope.item.jumlah=0
            $scope.item.dosis=1
            $scope.item.jumlahxmakan=1
            medifirstService.get("logistik/get-produkdetailtap?"+
                "produkfk="+ $scope.item.produk.id +
                "&ruanganfk="+ $scope.item.ruangan.id , true).then(function(dat){
                    dataProdukDetail =dat.data.detail;
                    $scope.item.stok =dat.data.jmlstok / $scope.item.nilaiKonversi 
                    $scope.consis = dat.data.consis;

                    //parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                    $scope.item.hargaSatuan =0
                    $scope.item.hargadiskon =0
                    $scope.item.hargaNetto=0
                    $scope.item.total =0
                    // $scope.item.jumlahxmakan =1
                    if ($scope.dataSelected != undefined) {
                        $scope.item.jumlah =$scope.dataSelected.jumlah
                        $scope.item.dosis =$scope.dataSelected.dosis
                        $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
                        $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                        $scope.item.satuan = {ssid:$scope.dataSelected.satuanviewfk,satuanstandar:$scope.dataSelected.satuanview}
                        $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                        $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                        $scope.item.hargaNetto = $scope.dataSelected.harganetto
                        $scope.item.total = $scope.dataSelected.total 
                    }

                    
            });
                
        }
        $scope.getNilaiKonversi = function(){
            $scope.item.nilaiKonversi =  $scope.item.satuan.nilaikonversi
        }
        $scope.$watch('item.nilaiKonversi', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                if ($scope.item.stok > 0) {
                    $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                    $scope.item.jumlah =0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                    $scope.item.hargaSatuan =0//hrg1 * parseFloat(newValue)
                    $scope.item.hargadiskon =0//hrgsdk * parseFloat(newValue)
                    $scope.item.hargaNetto =0
                    $scope.item.total =0// parseFloat(newValue) * 
                           // (hrg1-hrgsdk)
                    // $scope.item.jumlahxmakan =1
                    // $scope.item.dosis =1
                }
            }
        });
        $scope.$watch('item.rke', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                if (tarifJasa == 0) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                        if (data2[i].rke == $scope.item.rke){
                            tarifJasa = 0
                            break;
                        }
                    }
                }
            }
        });
        // $scope.$watch('item.tglAwal', function(newValue, oldValue) {
        //     statusPosting == true
        //     if (newValue != oldValue  ) {
        //         statusPosting == true
        //         var tgltgl = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
        //         medifirstService.get("akutansi/get-sudah-posting?tgl="+
        //             tgltgl, true).then(function(dat){
        //                 statusPosting = dat.data.status
        //                 if (statusPosting == true) {
        //                     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
        //                 }
        //             }
        //         ) 
        //     }
        //     $scope.tombolSimpanVis = true
        // });
        $scope.$watch('item.jumlahxmakan', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                if ($scope.item.stok > 0) {
                    $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                }
            }
        });
        $scope.$watch('item.dosis', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                if ($scope.item.stok > 0) {
                    $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                }
            }
        });
        $scope.$watch('item.jenisKemasan.jeniskemasan', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                if (newValue == 'Racikan') {
                   $scope.showRacikanDose = true
                }else{
                   $scope.showRacikanDose = false
                }
                // if (newValue == 'Racikan') {
                //    $scope.showInputObat =false
                //    $scope.showRacikan = true
                // }else{

                //    $scope.showInputObat =true
                //    $scope.showRacikan = false
                // }
            }
        });

        $scope.$watch('item.hargadiskon', function(newValue, oldValue) {
            if (newValue != oldValue  ) {
                hrgsdk = $scope.item.hargadiskon
                $scope.item.total = (parseFloat($scope.item.jumlah) * (hrg1-hrgsdk)) + parseFloat(tarifJasa)
            }
        })

        $scope.$watch('item.jumlah', function(newValue, oldValue) {
            if (newValue != oldValue  ) {

                if ($scope.item.jenisKemasan == undefined) {
                    return
                }
                // if (racikan == 'Racikan') {
                //     hrg1 = parseFloat($scope.item.totalSubTotalR)
                //     hrgsdk = parseFloat($scope.item.totalDiskonR)
                //     $scope.item.hargaSatuan =hrg1
                //     $scope.item.hargadiskon =hrgsdk
                //     $scope.item.total = parseFloat($scope.item.jumlah) * (hrg1-hrgsdk)
                //     noTerima = null
                // }else{
                    // if ($scope.item.stok == 0 ) {
                    //     $scope.item.jumlah = 0
                    //     //alert('Stok kosong')

                    //     return;
                    // }
                    debugger;
                    var qty20 = 0
                    tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                    if (parseFloat(tarifJasa) != 0) {
                        if ($scope.item.jenisKemasan.id == 2) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                        }
                        if ($scope.item.jenisKemasan.id == 1) {
                            qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
                            if (parseFloat($scope.item.jumlah) % 20 == 0) {
                                qty20 = qty20 
                            }else{
                                qty20 = qty20 + 1
                            }
                            
                            if (qty20 != 0) {
                                tarifJasa = tarifJasa * qty20
                            }
                            
                        }
                    }
                    if ($scope.item.no == undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].rke  == $scope.item.rke) {
                                tarifJasa=0
                            }
                        }
                    }
                    // tarifJasa = 

                    var ada = false;
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                        // if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi) ) >= parseFloat(dataProdukDetail[i].qtyproduk) ){
                            hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual)* parseFloat($scope.item.nilaiKonversi))
                            hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                            $scope.item.hargaSatuan = hrg1
                            $scope.item.hargaNetto  = Math.round(parseFloat(dataProdukDetail[i].harganetto)* parseFloat($scope.item.nilaiKonversi))
                            if ($scope.item.hargadiskon == 0) {
                                $scope.item.hargadiskon = hrgsdk 
                            }else{
                                hrgsdk = $scope.item.hargadiskon 
                            }
                            $scope.item.total =(parseFloat($scope.item.jumlah) * (hrg1-hrgsdk)) + parseFloat(tarifJasa)
                            noTerima = dataProdukDetail[i].norec
                            $scope.item.asal={id:dataProdukDetail[i].objectasalprodukfk,asalproduk:dataProdukDetail[i].asalproduk}
                            ada=true;
                            break;
                        // }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon =0
                        $scope.item.hargaNetto =0
                        $scope.item.total = 0
                        
                        noTerima = ''
                        if (dataProdukDetail.length > 1) {
                            var stt = 'false'
                            if (confirm('Struk Penerimaan berbeda, merge/satukan stok? ')) {
                                var objSave = 
                                    {
                                        produkfk : $scope.item.produk.id,
                                        ruanganfk : $scope.item.ruangan.id
                                    }
                                
                                $scope.tombolSimpanVis =false;
                                 medifirstService.post('farmasi/save-stock-merger', objSave).then(function (e) {
                                    Kosongkan()
                                })
                            } else {
                                // Do nothing!
                                stt='false'
                            }
                            
                        }
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargaNetto =0
                    }
                // }
                // if ($scope.item.stok > 0) {
                //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                // }
            }
        });

        $scope.formatTanggal = function(tanggal){
            return moment(tanggal).format('DD-MMM-YYYY');
        }

        $scope.tambah = function () {
            debugger;
            if ($scope.item.jumlah == 0 && $scope.item.jumlah > $scope.item.stok) {
                alert("Jumlah harus di isi!")
                return;
            }
            if ($scope.item.hargaSatuan == 0) {
                alert("Harga Satuan tidak memiliki harga!")
                return;
            }
            // if ($scope.item.total == 0) {
            //     alert("Stok tidak ada harus di isi!")
            //     return;
            // }
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
            if($scope.item.aturanPakai == undefined) {
                 alert("Aturan Pakai Belum Diisi!!")
                return;
            }
            var jRacikan=null
            if ($scope.item.jenisRacikan != undefined) {
                jRacikan=$scope.item.jenisRacikan.id
            }
            var dosis =1;
            if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                dosis = $scope.item.dosis
            }
            var nomor =0
            if ($scope.dataGrid == undefined) {
                nomor = 1
            }else{
                nomor = data2.length+1
            }
            debugger;
            var pagi =false
            if ($scope.model.pagi== undefined) {
                pagi =false
            }else{
                pagi = $scope.model.pagi
            } 
            var sore =false
            if ($scope.model.sore== undefined) {
                sore =false
            }else{
                sore = $scope.model.sore
            } 
            var siang =false
            if ($scope.model.siang== undefined) {
                siang = false
            }else{
                siang = $scope.model.siang
            } 
            var malam =false
            if ($scope.model.malam== undefined) {
                malam = false
            }else{
                malam = $scope.model.malam
            } 

            $scope.disabledRuangan=true;
            var data ={};
            if ($scope.item.no != undefined){
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].no ==  $scope.item.no){
                        data.no = $scope.item.no

                        data.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                        data.tglregistrasi = moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')
                        data.generik = null
                        data.hargajual = String($scope.item.hargaSatuan)
                        data.jenisobatfk = jRacikan
                        data.kelasfk = $scope.item.kelas.id
                        data.stock = String($scope.item.stok)
                        data.harganetto = String($scope.item.hargaNetto)
                        data.nostrukterimafk = noTerima
                        data.ruanganfk = $scope.item.ruangan.id

                        data.rke = $scope.item.rke
                        data.jeniskemasanfk = $scope.item.jenisKemasan.id
                        data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                        // data.aturanpakaifk = $scope.item.aturanPakai.id
                        // data.aturanpakai = $scope.item.aturanPakai.name
                        data.aturanpakai =  $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
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
                        data.jumlah = $scope.item.jumlah
                        data.dosis = dosis
                        data.hargasatuan = String($scope.item.hargaSatuan)
                        data.hargadiscount =String($scope.item.hargadiskon)
                        data.total = $scope.item.total
                        data.jmldosis = String(($scope.item.jumlah)/dosis) + '/' + String(dosis)
                        data.jasa = tarifJasa
                        data.pagi = pagi
                        data.siang = siang
                        data.sore = sore
                        data.malam = malam
                        data2[i] = data;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2
                        });
                        var subTotal = 0 ;
                        for (var i = data2.length - 1; i >= 0; i--) {
                            subTotal=subTotal+ parseFloat(data2[i].total)
                        }
                        $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    }
                    // break;
                }

            }else{
                data={
                        no:nomor,
                        noregistrasifk:norec_apd,//$scope.item.noRegistrasi,
                        tglregistrasi:moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                        generik:null,
                        hargajual:String($scope.item.hargaSatuan),
                        jenisobatfk: jRacikan,
                        kelasfk:$scope.item.kelas.id,
                        stock:String($scope.item.stok),
                        harganetto:String($scope.item.hargaNetto),
                        nostrukterimafk:noTerima,
                        ruanganfk:$scope.item.ruangan.id,//£££
                        rke:$scope.item.rke,
                        jeniskemasanfk:$scope.item.jenisKemasan.id,
                        jeniskemasan:$scope.item.jenisKemasan.jeniskemasan,
                        // aturanpakaifk:$scope.item.aturanPakai.id,
                        // aturanpakai:$scope.item.aturanPakai.name,
                        aturanpakai: $scope.item.aturanPakai  ,//+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                        // aturanpakai2: $scope.item.aturanPakai2 ,
                        // sbsmid: $scope.item.sbsm.id,
                        // sbsmname: $scope.item.sbsm.name,
                        routefk:null,//,$scope.item.route.id,
                        route:null,//$scope.item.route.name,
                        asalprodukfk:$scope.item.asal.id,
                        asalproduk:$scope.item.asal.asalproduk,
                        produkfk:$scope.item.produk.id,
                        namaproduk:$scope.item.produk.namaproduk,
                        nilaikonversi:$scope.item.nilaiKonversi,
                        satuanstandarfk:$scope.item.satuan.ssid,
                        satuanstandar:$scope.item.satuan.satuanstandar,
                        satuanviewfk:$scope.item.satuan.ssid,
                        satuanview:$scope.item.satuan.satuanstandar,
                        jmlstok:String($scope.item.stok),
                        jumlah:$scope.item.jumlah,
                        dosis:dosis,
                        hargasatuan:String($scope.item.hargaSatuan),
                        hargadiscount:String($scope.item.hargadiskon),
                        total:$scope.item.total,
                        jmldosis:String(($scope.item.jumlah)/dosis) + '/' + String(dosis),
                        jasa:tarifJasa,
                        pagi : pagi,
                        siang : siang,
                        sore : sore,
                        malam : malam
                    }
                data2.push(data)
                // $scope.dataGrid.add($scope.dataSelected)
                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                });
                var subTotal = 0 ;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal=subTotal+ parseFloat(data2[i].total)
                }
                $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
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
            racikan =''
        }
       
        $scope.klikGrid = function(dataSelected){
            var dataProduk =[];
            var a;
            var b;
            var c;
            var d;
            //no:no,
            $scope.item.no = dataSelected.no
            $scope.item.rke = dataSelected.rke
            medifirstService.get("farmasi/get-jenis-obat?jrid="+dataSelected.jenisobatfk, true).then(function(JR){
                $scope.item.jenisRacikan = {id:JR.data.data[0].id,jenisracikan:JR.data.data[0].jenisracikan}
            });
            // 
            $scope.item.jenisKemasan = {id:dataSelected.jeniskemasanfk,jeniskemasan:dataSelected.jeniskemasan}
            $scope.item.aturanPakai = dataSelected.aturanpakai
            // $scope.item.aturanPakai2 = dataSelected.aturanpakai2
            // $scope.item.sbsm = {id:dataSelected.sbsmid,name:dataSelected.sbsmname}
            // $scope.item.route = {id:dataSelected.routefk,name:dataSelected.route}
            if (dataSelected.asalprodukfk != 0) {
                $scope.item.asal = {id:dataSelected.asalprodukfk,asalproduk:dataSelected.asalproduk}    
            }
            for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                if ($scope.listProduk[i].id == dataSelected.produkfk){
                    dataProduk = $scope.listProduk[i]
                    break;
                }
            }
            $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
            // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 
            debugger;
            $scope.item.jumlah = 0
            tarifJasa = dataSelected.jasa
            if (dataSelected.pagi == '1' || dataSelected.pagi == true){
                a=true
            }else
            {
                a= false
            }
            if (dataSelected.siang == '1' || dataSelected.siang == true){
                b=true
            }else
            {
                b= false
            }
            if (dataSelected.sore == '1' || dataSelected.sore == true){
                c=true
            }else
            {
                c= false
            }
            if (dataSelected.malam == '1' || dataSelected.malam == true){
                d=true
            }else
            {
                d= false
            }
            $scope.model.pagi = a
            $scope.model.siang = b
            $scope.model.sore = c
            $scope.model.malam = d
            // $scope.item.dosis = dataSelected.dosis
            GETKONVERSI()
            // $scope.item.nilaiKonversi = dataSelected.nilaikonversi
            // $scope.item.satuan = {ssid:dataSelected.satuanviewfk,satuanstandar:dataSelected.satuanview}
            
            
            // // $scope.item.jumlah = dataSelected.jumlah
            // $scope.item.hargaSatuan = dataSelected.hargasatuan
            // $scope.item.hargadiskon = dataSelected.hargadiscount
            // $scope.item.total = dataSelected.total
        }
        function Kosongkan(){
            $scope.item.produk =''
            $scope.item.asal =''
            $scope.item.satuan=''
            $scope.item.nilaiKonversi=0
            $scope.item.stok=0
            $scope.item.jumlah=0
            $scope.item.dosis=1
            $scope.item.jumlahxmakan=1
            $scope.item.hargadiskon=0
            $scope.item.no=undefined
            $scope.item.total=0
            $scope.item.hargaSatuan=0
            $scope.item.hargaNetto=0
            // $scope.item.aturanPakai=undefined;
            $scope.dataSelected = undefined
        }
        $scope.batal = function(){
            var chacePeriode ={ 0 : $scope.item.ruangan ,
                  1 : $scope.item.aturanPakai,
                  2 : $scope.item.jenisKemasan,
                  3 : '', 
                  4 : '',
                  5 : '',
                  6 : '',
                  7 : '',
                  8 : ''
                }
            cacheHelper.set('cacheanuaing', chacePeriode);
            Kosongkan()
        }

        $scope.columnGrid = [
        {
            "field": "no",
            "title": "No",
            "width" : "30px",
        },
        {
            "field": "rke",
            "title": "R/ke",
            "width" : "40px",
        },
        {
            "field": "jeniskemasan",
            "title": "Kemasan",
            "width" : "70px",
        },
        {
            "field": "asalproduk",
            "title": "Asal Produk",
            "width" : "100px",
        },
        {
            "field": "jmldosis",
            "title": "Jml/Dosis",
            "width" : "60px",
        },
        {
            "field": "namaproduk",
            "title": "Deskripsi",
            "width" : "200px",
        },
        {
            "field": "satuanstandar",
            "title": "Satuan",
            "width" : "80px",
        },
        {
            "field": "jumlah",
            "title": "Qty Obat",
            "width" : "70px",
        },
        {
            "field": "hargasatuan",
            "title": "Harga Satuan",
            "width" : "100px",
            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
        },
        {
            "field": "hargadiscount",
            "title": "Harga Discount",
            "width" : "100px",
            "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
        },
        {
            "field": "total",
            "title": "Total",
            "width" : "100px",
            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
        }
        ];
        // $scope.columnGridR = [
        // {
        //     "field": "no",
        //     "title": "No",
        //     "width" : "30px",
        // },
        // {
        //     "field": "rke",
        //     "title": "R/ke",
        //     "width" : "40px",
        // },
        // {
        //     "field": "jeniskemasan",
        //     "title": "Kemasan",
        //     "width" : "70px",
        // },
        // {
        //     "field": "asalproduk",
        //     "title": "Asal Produk",
        //     "width" : "100px",
        // },
        // {
        //     "field": "namaproduk",
        //     "title": "Deskripsi",
        //     "width" : "200px",
        // },
        // {
        //     "field": "satuanstandar",
        //     "title": "Satuan",
        //     "width" : "80px",
        // },
        // {
        //     "field": "jumlah",
        //     "title": "Qty",
        //     "width" : "70px",
        // },
        // {
        //     "field": "hargasatuan",
        //     "title": "Harga Satuan",
        //     "width" : "100px",
        //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
        // },
        // {
        //     "field": "hargadiscount",
        //     "title": "Harga Discount",
        //     "width" : "100px",
        //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
        // },
        // {
        //     "field": "total",
        //     "title": "Total",
        //     "width" : "100px",
        //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
        // }
        // ];
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali=function(){
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.simpan = function(){
                // medifirstService.get("tatarekening/get-sudah-verif?noregistrasi="+
                //     $scope.item.noRegistrasi, true).then(function(dat){
                //     if (dat.data.status == true) {
                //         alert('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //         return;
                //     }
                // });
                // if ($scope.item.penulisResep == undefined) {
                //     alert("Pilih Penulis Resep terlebih dahulu!!")
                //     return
                // }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].hargasatuan ==0) {
                        alert("Terdapat obat dengan harga kosong, kemungkinan stock kosong!!")
                        return
                    }
                    
                }
                debugger;
                var strukresep = {
                            tglresep: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                            pasienfk: norec_apd,//
                            nocm:$scope.item.nocm,
                            namapasien: $scope.item.namaPasien,
                            penulisresepfk: $scope.item.penulisResep != undefined ?$scope.item.penulisResep.id : null, //req nenden
                            ruanganfk: $scope.item.ruangan.id,
                            noorder:noOrder,
                            status:strStatus,
                            norecResep:norecResep,
                            noresep:$scope.item.resep,
                            retur:'-',
                            isobatalkes: isPemakaianObatAlkes,
                            noregistrasi:  $scope.item.noRegistrasi
                        }
                var objSave = 
                    {
                        strukresep:strukresep,
                        pelayananpasien:data2//$scope.dataGrid._data
                    }
                
                $scope.tombolSimpanVis =false;
                medifirstService.post("logistik/save-pelayananobattap", objSave).then(function(e) {
                    $scope.tombolSimpanVis =true;
                    $scope.item.resep = e.data.noresep.norec
                    // //Bridging Consis
                    // if ($scope.item.consisid != undefined) {
                    //     var objSave = 
                    //         {
                    //             strukresep:$scope.item.resep,
                    //             counterid:$scope.item.consisid
                    //         }
                    //     medifirstService.postbridgingconsisd(objSave).then(function(e) {
                    //     })
                    // }
                    // //Bridging Consis
                    // //Bridging MiniR45
                    //     var objSave = 
                    //         {
                    //             strukresep:$scope.item.resep
                    //         }
                    
                    //     medifirstService.postbridgingminir45(objSave).then(function(e) {
                            
                    //     })
                    // //Bridging minir45

                    //##save Logging user
                       medifirstService.get("logging/save-log-input-resep?norec_apd="
                            + norec_apd
                            + "&penulisresepfk="
                            + $scope.item.penulisResep.id
                            + "&ruanganfk="
                            +  $scope.item.ruangan.id
                            + "&tglresep="
                            + moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss')
                        ).then(function(data) {
                        }) 
                        //##end 
          
                    // var stt = 'false'
                    // if (confirm('View resep? ')) {
                    //     // Save it!
                    //     stt='true';
                    // } else {
                    //     // Do nothing!
                    //     stt='false'
                    // }
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep='+$scope.item.consisid+'&nores='+e.data.noresep.norec+'&view='+stt+'&user='+pegawaiUser.namalengkap, function(response) {
                    //     //aadc=response;
                    // });


                    
                    // if (noOrder == 'EditResep') {
                    //     var objDelete = {norec:norecResep}
                    //     medifirstService.posthapuspelayananapotik(objDelete).then(function(e) {

                    //     })
                    // }
                    window.history.back();
                },function(error){
                    $scope.tombolSimpanVis =true;
                })
                 var chacePeriode ={ 0 : $scope.item.ruangan ,
                      1 : $scope.item.aturanPakai,
                      2 : $scope.item.jenisKemasan,
                      3 : '', 
                      4 : '',
                      5 : '',
                      6 : '',
                      7 : '',
                      8 : ''
                    }
                cacheHelper.set('cacheanuaing', chacePeriode);
                
                // $state.go("TransaksiPelayananApotik")
                
            }
            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() { 
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open( "GET", aUrl, true );            
                    anHttpRequest.send( null );
                }
            }
            $scope.BatalR = function(){
                $scope.showInputObat =true
                $scope.showRacikan = false
                $scope.item.jenisKemasan =''

                racikan =''
            }
            $scope.hapus = function(){
                // if ($scope.item.jumlah == 0) {
                //     alert("Jumlah harus di isi!")
                //     return;
                // }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data ={};
                if ($scope.item.no != undefined){
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no ==  $scope.item.no){                            

                            //data2[i] = data;
                            // delete data2[i]
                            data2.splice(i, 1);

                            var subTotal = 0 ;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal=subTotal+ parseFloat(data2[i].total)
                                data2[i].no = i+1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width" : "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width" : "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width" : "50px",
                }
              
             ];
        
//***********************************

}
]);
});
