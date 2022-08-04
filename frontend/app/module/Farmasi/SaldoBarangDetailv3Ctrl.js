define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('SaldoBarangDetailv3Ctrl', ['$q', '$rootScope', '$scope', 'MedifirstService','$state','CacheHelper','DateHelper',
        function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading=false;
            // $scope.dataLogin = JSON.parse(window.localStorage.get('pegawai'));
            $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
            var details =[];
             var details =[];
            var details2 =[];
            var details3 =[];
            var details4 =[];
            var details5 =[];
            var details6 =[];
            var details7 =[];
            var details8 =[];
            var detailsAll =[];
            var tempdata = [];
            var tempprodukfk ="";
            var tempnostrukterimafk="";
            var tempnorecdetail="";
            $scope.item.passwordSo;
            $scope.selectedJenisProduk =[]
            $scope.selectedDetailJenis =[]
            $scope.item.neraca = false
            LoadCache();
            loadCombo();
            $scope.item.neraca = false;
            $scope.saveShow=true;
            $scope.neracashow=false;
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
            function LoadCache(){
                //  medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                //     $scope.listKdSirs = data
                //     $scope.listKdSirs1 = data
                //     $scope.listProduk = data
                // }); 
                medifirstService.get("logistik/get-data-stock-flow", true).then(function(dat){
                    $scope.listRuangan = dat.data.ruangan
                    $scope.listJenisProduk = dat.data.jenisproduk
                    $scope.listDetailJenis = dat.data.detailjenisproduk
                    $scope.item.ruangan = {id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan}
                    var chacePeriode = cacheHelper.get('SaldoBarangDetailCtrl');
                      if(chacePeriode != undefined){
                       //var arrPeriode = chacePeriode.split(':');
                        $scope.item.tglAwal = new Date(chacePeriode[0]);
                        $scope.item.tglAkhir = new Date(chacePeriode[1]);
                       
                        // $scope.item.tglAwal = new Date(chacePeriode[0]);
                        // $scope.item.tglAkhir = new Date(chacePeriode[1]);
                                              $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                       // $scope.item.tglAkhir = $scope.now;
                       $scope.item.tglAkhir =  new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                        // init();
                     }
                     else{
                       $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                       $scope.item.tglAkhir = $scope.now;
                       // $scope.item.tglAkhir = $scope.now;
                       $scope.item.tglAkhir =  new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                       // init();
                     }
                });
                  
           }
            function loadCombo(){
                //  medifirstService.getDataDummyPHPV2("aset/get-data-barang", true, true, 20).then(function(data) {
                //     $scope.listKdSirs = data
                //     $scope.listKdSirs1 = data
                //     $scope.listProduk = data
                // });
                  medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listKdSirs = data
                    $scope.listKdSirs1 = data
                    $scope.listProduk = data
                }); 
            }
            $scope.newOrder =  function(){
                $state.go('OrderBarangLogistik')
            }
            function init2() {
                 var datax=[];
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk = "&IdProduk=" + $scope.item.Produk.id
                }
                var rg =""
                if ($scope.item.ruangan != undefined){
                    var rg = +$scope.item.ruangan.id
                }
                    medifirstService.get("logistik/get-daftar-stock-flowcekstok2?"+
                    "tglawal=" + tglAwal + 
                    "&tglakhir=" + tglAkhir +
                    "&ruanganfk=" + rg +
                    // "&jenisprodukfk=" +listJenisProd+
                    // "&detailjenisprodukfk=" +  listDetailJenis +
                     IdProduk
                    , true).then(function(dat){
                        debugger;
                        details=dat.data.data;
                        $scope.isRouteLoading=false;
                       
                        $scope.dataGrid4 = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageSize: 20,
                            total: dat.data.data.length,
                            serverPaging: false,

                            editable: true
                        });
                       
                    });

            }
            function init() {
                
                $scope.isRouteLoading=true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg =""
                if ($scope.item.ruangan != undefined){
                    var rg = +$scope.item.ruangan.id
                }

                var listJenisProd = ""
                if ($scope.selectedJenisProduk.length != 0){
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedJenisProduk.length - 1; i >= 0; i--) {
                        var c = $scope.selectedJenisProduk[i].id
                        b = "," + c
                        a = a + b
                    }
                    listJenisProd = a.slice(1, a.length)
                }
                var listDetailJenis =""
                if ($scope.selectedDetailJenis.length != 0){
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)

                }
                 var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 =  "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 =  "&KdSirs2=" + $scope.item.KdSirs2
                }
                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk = "&IdProduk=" + $scope.item.Produk.id
                }
                //  var produkfk =""
                // if ($scope.item.namaBarang != undefined){
                //     var produkfk ="&produkfk=" + $scope.item.namaBarang.id
                // }
                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0

                // var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // if ($scope.item.neraca == false){
                //     medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                //     "tglawal=" + tglAwal + 
                //     "&tglakhir=" + tglAkhir +
                //     "&ruanganfk=" + rg +
                //     "&jenisprodukfk=" +listJenisProd+
                //     "&detailjenisprodukfk=" +  listDetailJenis +
                //     KdSirs1 + KdSirs2 + IdProduk
                //     , true).then(function(dat){
                //     details=dat.data.data;
                //     $scope.isRouteLoading=false;
                //     for (var i = 0; i < dat.data.data.length; i++) {
                //         dat.data.data[i].no = i+1
                //         ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(dat.data.data[i].ttlawal)
                //         ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(dat.data.data[i].ttlmasuk)
                //         ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(dat.data.data[i].ttlkeluar)
                //         ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(dat.data.data[i].ttlakhir)
                //         // debugger;
                //         var objSave = {
                //         "ruanganfk":dat.data.data[i].objectruanganfk,
                //         "produkfk":dat.data.data[i].objectprodukfk,
                //         "tglawal":  moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00')
                //         }
          
                        
                //         // var tanggal = $scope.now;
                //         // var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                //         // var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                //         // dat.data.daftar[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                //         //itungUsia(dat.data[i].tgllahir)
                //     }
                //     debugger;

                //     $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    
                //      $scope.dataGrid = new kendo.data.DataSource({
                //         data: dat.data.data,
                //         pageSize: 20,
                //         total: dat.data.data.length,
                //         serverPaging: false,
                //         // sort:[
                //         //     {
                //         //         field: "namaproduk",
                //         //         dir:"asc"
                //         //     }
                //         // ],
                       
                //     });
                //       $scope.dataExcel = dat.data.data;
                //    // $scope.dataGrid = dat.data.data;
                //    // pegawaiUser = dat.data.datalogin
                // });
                // }else{
                //     medifirstService.get("logistik-stok/get-daftar-stock-flowneraca?"+
                //     "tglawal=" + tglAwal + 
                //     "&tglakhir=" + tglAkhir +
                //     "&ruanganfk=" + rg +
                //     "&jenisprodukfk=" +listJenisProd+
                //     "&detailjenisprodukfk=" +  listDetailJenis +
                //     KdSirs1 + KdSirs2 + IdProduk
                //     , true).then(function(dat){
                //     details=dat.data.data;
                //     $scope.isRouteLoading=false;
                //     for (var i = 0; i < dat.data.data.length; i++) {
                //         dat.data.data[i].no = i+1
                //         // ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(dat.data.data[i].ttlawal)
                //         // ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(dat.data.data[i].ttlmasuk)
                //         // ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(dat.data.data[i].ttlkeluar)
                //         // ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(dat.data.data[i].ttlakhir)
                //         ttlsaldoawal = parseFloat(ttlsaldoawal) + (parseFloat(dat.data.data[i].qtyawal) * parseFloat(dat.data.data[i].hargaawal))
                //         ttlpenerimaan = parseFloat(ttlpenerimaan) + (parseFloat(dat.data.data[i].qtymasuk) * parseFloat(dat.data.data[i].harga))
                //         ttlpengeluaran = parseFloat(ttlpengeluaran) + (parseFloat(dat.data.data[i].qtykeluar) * parseFloat(dat.data.data[i].harga))
                //         dat.data.data[i].qtyakhir = parseFloat(dat.data.data[i].qtyawal) + parseFloat(dat.data.data[i].qtymasuk) - parseFloat(dat.data.data[i].qtykeluar) 
                //          ttlsaldoakhir = parseFloat(ttlsaldoakhir)+ parseFloat(dat.data.data[i].qtyakhir ) * dat.data.data[i].harga 
                //         // ttlsaldoakhir=  ttlsaldoakhir + ttlsaldoawal +  ttlpenerimaan -  ttlpengeluaran

                //         // var tanggal = $scope.now;
                //         // var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                //         // var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                //         // dat.data.daftar[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                //         //itungUsia(dat.data[i].tgllahir)
                //     }

                //     $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                //     $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    
                //      $scope.dataGrid = new kendo.data.DataSource({
                //         data: dat.data.data,
                //         pageSize: 20,
                //         total: dat.data.data.length,
                //         serverPaging: false,
                //         // sort:[
                //         //     {
                //         //         field: "namaproduk",
                //         //         dir:"asc"
                //         //     }
                //         // ],
                       
                //     });
                //       $scope.dataExcel = dat.data.data;
                //    // $scope.dataGrid = dat.data.data;
                //    // pegawaiUser = dat.data.datalogin
                // });
                // }
                var datax=[];
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                if ($scope.item.ruangan != "") {
                    medifirstService.get("logistik/get-daftar-stock-flowcekstok?"+
                    "tglawal=" + tglAwal + 
                    "&tglakhir=" + tglAkhir +
                    "&ruanganfk=" + rg +
                    "&jenisprodukfk=" +listJenisProd+
                    "&detailjenisprodukfk=" +  listDetailJenis +
                    KdSirs1 + KdSirs2 + IdProduk
                    , true).then(function(dat){
                        details=dat.data.data;
                        $scope.isRouteLoading=false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i+1
                            ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(dat.data.data[i].ttlawal)
                            ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(dat.data.data[i].ttlmasuk)
                            ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(dat.data.data[i].ttlkeluar)
                            ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(dat.data.data[i].ttlakhir)                
                            dat.data.data[i].ttlakhir = parseFloat(dat.data.data[i].qtyawal) + parseFloat(dat.data.data[i].qtymasuk) - parseFloat(dat.data.data[i].qtykeluar) 
                        }
                        for (var i = 0; i < dat.data.data2.length; i++) {
                            dat.data.data2[i].no = i+1
                           
                        }
                        debugger;
                        var t=1;
                        for (var i = 0; i < dat.data.data3.length; i++) {
                            for (var j = 0; j < dat.data.data4.length; j++) {
                                if(dat.data.data3[i].objectprodukfk == dat.data.data4[j].produkfk && dat.data.data3[i].total != dat.data.data4[j].saldoawal){                                   
                                            
                                            tempdata={
                                                no : t,                                           
                                                namaproduk : dat.data.data3[i].namaproduk,
                                                ruangan : dat.data.data3[i].namaruangan                              
                                            }                                   
                                            datax.push(tempdata) 
                                            t=t+1;

                                }
                           
                            }
                        }
                        $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageSize: 20,
                            total: dat.data.data.length,
                            serverPaging: false,
                        });
                        $scope.dataGrid2 = new kendo.data.DataSource({
                            data: dat.data.data2,
                            pageSize: 20,
                            total: dat.data.data2.length,
                            serverPaging: false,
                        });
                        $scope.dataExcel = dat.data.data;
                        $scope.dataGrid3 = new kendo.data.DataSource({
                            data: datax,
                            pageSize: 20,
                            total: dat.data.data.length,
                            serverPaging: false,
                        });
                    });
                }else{
                        medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                            "tglawal=" + tglAwal + 
                            "&tglakhir=" + tglAkhir +
                            "&ruanganfk=553" + //rg +
                            "&jenisprodukfk=" +listJenisProd+
                            "&detailjenisprodukfk=" +  listDetailJenis +
                            KdSirs1 + KdSirs2 + IdProduk
                            , true).then(function(dat){
                                details=dat.data.data;
                                medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                    "tglawal=" + tglAwal + 
                                    "&tglakhir=" + tglAkhir +
                                    "&ruanganfk=554" + //rg +
                                    "&jenisprodukfk=" +listJenisProd+
                                    "&detailjenisprodukfk=" +  listDetailJenis +
                                    KdSirs1 + KdSirs2 + IdProduk
                                    , true).then(function(dat){
                                        details2=dat.data.data;
                                        medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                            "tglawal=" + tglAwal + 
                                            "&tglakhir=" + tglAkhir +
                                            "&ruanganfk=452" + //rg +
                                            "&jenisprodukfk=" +listJenisProd+
                                            "&detailjenisprodukfk=" +  listDetailJenis +
                                            KdSirs1 + KdSirs2 + IdProduk
                                            , true).then(function(dat){
                                                details3=dat.data.data;
                                                medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                                    "tglawal=" + tglAwal + 
                                                    "&tglakhir=" + tglAkhir +
                                                    "&ruanganfk=555" + //rg +
                                                    "&jenisprodukfk=" +listJenisProd+
                                                    "&detailjenisprodukfk=" +  listDetailJenis +
                                                    KdSirs1 + KdSirs2 + IdProduk
                                                    , true).then(function(dat){
                                                        details4=dat.data.data;
                                                        medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                                            "tglawal=" + tglAwal + 
                                                            "&tglakhir=" + tglAkhir +
                                                            "&ruanganfk=556" + //rg +
                                                            "&jenisprodukfk=" +listJenisProd+
                                                            "&detailjenisprodukfk=" +  listDetailJenis +
                                                            KdSirs1 + KdSirs2 + IdProduk
                                                            , true).then(function(dat){
                                                                details5=dat.data.data;
                                                                medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                                                    "tglawal=" + tglAwal + 
                                                                    "&tglakhir=" + tglAkhir +
                                                                    "&ruanganfk=601" + //rg +
                                                                    "&jenisprodukfk=" +listJenisProd+
                                                                    "&detailjenisprodukfk=" +  listDetailJenis +
                                                                    KdSirs1 + KdSirs2 + IdProduk
                                                                    , true).then(function(dat){
                                                                        details6=dat.data.data;
                                                                        medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                                                            "tglawal=" + tglAwal + 
                                                                            "&tglakhir=" + tglAkhir +
                                                                            "&ruanganfk=602" + //rg +
                                                                            "&jenisprodukfk=" +listJenisProd+
                                                                            "&detailjenisprodukfk=" +  listDetailJenis +
                                                                            KdSirs1 + KdSirs2 + IdProduk
                                                                            , true).then(function(dat){
                                                                                details7=dat.data.data;
                                                                                medifirstService.get("logistik-stok/get-daftar-stock-flow?"+
                                                                                    "tglawal=" + tglAwal + 
                                                                                    "&tglakhir=" + tglAkhir +
                                                                                    "&ruanganfk=558" + //rg +
                                                                                    "&jenisprodukfk=" +listJenisProd+
                                                                                    "&detailjenisprodukfk=" +  listDetailJenis +
                                                                                    KdSirs1 + KdSirs2 + IdProduk
                                                                                    , true).then(function(dat){
                                                                                        details8=dat.data.data;
                                                detailsAll = details
                                                let sama = false;
                                                for (var i = 0; i < details2.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details2[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details2[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details2[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details2[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details2[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details2[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details2[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details2[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details2[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details2[i])
                                                    }
                                                    
                                                }
                                                for (var i = 0; i < details3.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details3[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details3[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details3[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details3[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details3[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details3[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details3[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details3[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details3[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details3[i])
                                                    }
                                                    
                                                }

                                                for (var i = 0; i < details4.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details4[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details4[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details4[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details4[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details4[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details4[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details4[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details4[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details4[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details4[i])
                                                    }
                                                    
                                                }

                                                for (var i = 0; i < details5.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details5[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details5[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details5[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details5[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details5[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details5[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details5[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details5[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details5[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details5[i])
                                                    }
                                                    
                                                }

                                                for (var i = 0; i < details6.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details6[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details6[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details6[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details6[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details6[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details6[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details6[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details6[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details6[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details6[i])
                                                    }
                                                    
                                                }

                                                for (var i = 0; i < details7.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details7[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details7[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details7[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details7[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details7[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details7[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details7[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details7[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details7[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details7[i])
                                                    }
                                                    
                                                }
                                                for (var i = 0; i < details8.length; i++) {
                                                    sama = false;
                                                    for (var j = 0; j < detailsAll.length; j++) {
                                                        if (details8[i].objectprodukfk == detailsAll[j].objectprodukfk) {
                                                            sama = true;
                                                            detailsAll[j].qtyawal = parseFloat(detailsAll[j].qtyawal) + parseFloat(details8[i].qtyawal)
                                                            detailsAll[j].ttlawal = parseFloat(detailsAll[j].qtyawal) * parseFloat(details8[i].hargaawal)
                                                            detailsAll[j].qtymasuk = parseFloat(detailsAll[j].qtymasuk) + parseFloat(details8[i].qtymasuk)
                                                            detailsAll[j].ttlmasuk = parseFloat(detailsAll[j].qtymasuk) * parseFloat(details8[i].harga)
                                                            detailsAll[j].qtykeluar = parseFloat(detailsAll[j].qtykeluar) + parseFloat(details8[i].qtykeluar)
                                                            detailsAll[j].ttlkeluar = parseFloat(detailsAll[j].qtykeluar) * parseFloat(details8[i].harga)
                                                            detailsAll[j].qtyakhir = parseFloat(detailsAll[j].qtyakhir) + parseFloat(details8[i].qtyakhir)
                                                            detailsAll[j].ttlakhir = parseFloat(detailsAll[j].qtyakhir) * parseFloat(details8[i].harga)
                                                        }
                                                    }
                                                    if (sama == false) {
                                                        detailsAll.push(details8[i])
                                                    }
                                                    
                                                }

                                                    $scope.isRouteLoading=false;
                                                    for (var i = 0; i < detailsAll.length; i++) {
                                                        // detailsALL[i].no = i+1
                                                        ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(detailsAll[i].ttlawal)
                                                        ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(detailsAll[i].ttlmasuk)
                                                        ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(detailsAll[i].ttlkeluar)
                                                        ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(detailsAll[i].ttlakhir)
                                                    }

                                                    $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                                    $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                                    $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                                    $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                                    
                                                     $scope.dataGrid = new kendo.data.DataSource({
                                                        data: detailsAll,
                                                        pageSize: 20,
                                                        total: detailsAll.length,
                                                        serverPaging: false,
                                                       
                                                    });
                                                      $scope.dataExcel = detailsAll;
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                                
                                        });
                                });
                        });
                }
                

                var chacePeriode ={ 0 : tglAwal ,
                    1 : tglAkhir,
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('SaldoBarangDetailCtrl', chacePeriode);

                
            }
            $scope.klikGrid = function (dataSelected) {
                
                tempnostrukterimafk = dataSelected.noterima
                
               
            }
            $scope.perbaikiData = function () {
                 medifirstService.get('logistik-stok/get-data-combo-so').then(function(data){
                    var Pass = data.data.passwordvalidasi[0]
                    $scope.item.passwordSo = Pass.nilaifield
                })
                $scope.popUp.center().open();
            }
            $scope.Validasi = function(){
                debugger;
               
                var rg =""
                if ($scope.item.ruangan != undefined){
                    var rg = +$scope.item.ruangan.id
                }

               
                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk =  $scope.item.Produk.id
                }
                //  var produkfk =""
                // if ($scope.item.namaBarang != undefined){
                //     var produkfk ="&produkfk=" + $scope.item.namaBarang.id
                // }
                 var objSave = {
                    "ruanganfk": rg,
                    "produkfk": IdProduk,
                    "tglawal": moment($scope.item.from).format('YYYY-MM-DD 00:00:00'),
                    "notstrukterimafk": tempnostrukterimafk
                }
                medifirstService.post('logistik/save-perbaiki-kartu-stok2',objSave).then(function (e) {
                    tempnostrukterimafk = "";
                    init2();
                })
                
             
            }
             $scope.Validasi3 = function(){
                debugger;
               
                var rg =""
                if ($scope.item.ruangan != undefined){
                    var rg = +$scope.item.ruangan.id
                }

               
                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk =  $scope.item.Produk.id
                }
                //  var produkfk =""
                // if ($scope.item.namaBarang != undefined){
                //     var produkfk ="&produkfk=" + $scope.item.namaBarang.id
                // }
                 var objSave = {
                    "ruanganfk": rg,
                    "produkfk": IdProduk,
                    "tglawal": moment($scope.item.from).format('YYYY-MM-DD 00:00:00'),
                    "nostrukterimafk": $scope.item.nostukterima,
                    "norec": tempnorecdetail
                }
                medifirstService.post('logistik/save-perbaiki-kartu-stok3',objSave).then(function (e) {
                    tempnostrukterimafk = "";
                    init2();
                })
                
             
            }
            $scope.getRuangan = function(){
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function(){
                // $scope.popUpCari.center().open()
                init();
            }
             $scope.cariFilter2 = function(){
                // $scope.popUpCari.center().open()
                init2();
                 $scope.popUp2.center().open();
            }
            // cariFilter2
            $scope.cariPopUp = function(){
                console.log($scope.selectedJenisProduk)
                init();
                $scope.popUpCari.close()
            }
            $scope.batal = function(){
                $scope.popUpCari.close()
            }

            // $scope.TransaksiPelayanan = function(){
            //     
            //     var arrStr ={ 0 : $scope.dataSelected.nocm ,
            //         1 : $scope.dataSelected.namapasien,
            //         2 : $scope.dataSelected.jeniskelamin,
            //         3 : $scope.dataSelected.noregistrasi, 
            //         4 : $scope.dataSelected.umur,
            //         5 : $scope.dataSelected.klid,
            //         6 : $scope.dataSelected.namakelas,
            //         7 : $scope.dataSelected.tglregistrasi,
            //         8 : $scope.dataSelected.norec_apd,
            //         9 : 'resep'
            //     }
            //     cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
            //     $state.go('TransaksiPelayananApotik')

            //     var arrStr2 ={ 0 : $scope.dataSelected.norec 
            //     }
            //     cacheHelper.set('DaftarResepCtrl', arrStr2);
            //     $state.go('DaftarResepCtrl')
            // }
            $scope.Neraca = function(){
                // debugger;
                if ($scope.item.neraca == true){
                    $scope.item.ruangan =''
                    
                }
            }
            $scope.CetakBuktiLayanan = function(){
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt='true';
                } else {
                    // Do nothing!
                    stt='false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan'+$scope.dataSelected.norec+'&view='+stt+'&user='+pegawaiUser.userData.namauser, function(response) {
                    //aadc=response;
                });
            }
            $scope.EditOrder = function(){
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode ={ 0 : $scope.dataSelected.norec ,
                    1 : 'EditOrder',
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('OrderBarangLogistikCtrl', chacePeriode);
                $state.go('OrderBarangLogistik')
            }
            $scope.KirimBarang = function(){
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode ={ 0 : '' ,
                    1 : $scope.dataSelected.norec,
                    2 : 'KirimBarang',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }

            $scope.HapusPenerimaan = function(){
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
                    stt='true';
                } else {
                    // Do nothing!
                    return;
                }
                medifirstService.get("penerimaan-suplier/delete-terima-barang-suplier?"+"norec_sp=" + $scope.dataSelected.norec, true).then(function(dat){
                    init()
                });
            }
            $scope.BatalStokOpname = function(){

                $scope.item.Keterangannoterima=""
                $scope.item.nostukterima = ""
                $scope.popUp.close();
            }
            $scope.closingPersediaan = function(){
                $scope.popUp.center().open();
            }
            $scope.lanjutkan = function(){
                var stt = 'false'
                if (confirm('Close Persediaan bulan "' + dateHelper.formatDate($scope.item.tglAkhir,"MMMM YYYY") + '"')) {
                    // Save it!
                    stt='true';
                    // var norec_tea = $scope.item.norecSaldo
                    // if ($scope.item.norecSaldo ==  undefined){
                    //     norec_tea ='-'
                    // }
                    var tgltgl = moment($scope.item.tglAkhir).format('YYYYMM');
                    var objSave = 
                    {
                        ym : tgltgl,
                        data : details
                    }
                    medifirstService.postclosingpersediaan(objSave).then(function(e) {
                        
                    })
                } else {
                    // Do nothing!
                    stt='false'
                }

                $scope.item.kataKunciPass="";
                $scope.item.kataKunciConfirm="";
                $scope.popUp.close();
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid2 = {
                toolbar:["excel"],
                excel: {
                    fileName:"Saldo Penerimaan & Pengeluaran"+moment($scope.now).format( 'DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable:true,
                columns: [
                   {
                        field: "no",
                        title: "No",
                        width : "30px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width : "200px"
                    }

                ],

            };
             $scope.columnGrid3 = {
                toolbar:["excel"],
                excel: {
                    fileName:"Saldo Penerimaan & Pengeluaran"+moment($scope.now).format( 'DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable:true,
                columns: [
                   {
                        field: "no",
                        title: "No",
                        width : "30px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width : "200px"
                    },
                    {
                        field: "ruangan",
                        title: "Nama Ruangan",
                        width : "200px"
                    }


                ],

            };
            $scope.columnGrid4 = {
                toolbar:["excel"],
                excel: {
                    fileName:"x"+moment($scope.now).format( 'DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable:true,
                columns: [
                   {
                        field: "no",
                        title: "No",
                        width : "30px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width : "200px"
                    },
                     {
                        field: "noterima",
                        title: "No terima",
                        width : "200px"
                    }

                ],

            };
            $scope.verifikasigrid = function (dataPasienSelected) {
                
                $scope.popUp.center().open();
                $scope.item.Keterangannoterima=dataPasienSelected.keterangan
                $scope.item.nostukterima = dataPasienSelected.nostrukterimafk
                tempnorecdetail = dataPasienSelected.norec
                

            }
            $scope.data4 = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.detail
                    }),
                    columns: [
                        {
                            "field": "keterangan",
                            "title": "keterangan",
                            "width" : "30px",
                        },
                        {
                            "field": "tanggal",
                            "title": "tanggal",
                            "width" : "20px",
                        },
                        {
                            "field": "saldonoterima",
                            "title": "Saldo Noterima",
                            "width" : "10px",
                        },
                        {
                            "field": "jumlah",
                            "title": "jumlah",
                            "width" : "10px",
                            "editable": "true"
                        },
                        {
                        "field": "jumlah",
                        "title": "Verifikasi",
                        "width": "10px",

                        "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\">  ubah </button> ",
                        },
                        // {
                        //     "field": "nostukterima",
                        //     "title": "",
                        //     "width" : "1px",
                        //     "editable": "true"
                        // },{
                        //     "field": "norec",
                        //     "title": "",
                        //     "width" : "1px",
                        //     "editable": "true"
                        // },
                    ]
                }
            };
            $scope.data2 = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "keterangan",
                            "title": "keterangan",
                            "width" : "30px",
                        },
                        {
                            "field": "tanggal",
                            "title": "tanggal",
                            "width" : "30px",
                        }
                    ]
                }
            };  
            $scope.columnGrid = {
                toolbar:["excel"],
                excel: {
                    fileName:"Saldo Penerimaan & Pengeluaran"+moment($scope.now).format( 'DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable:true,
                columns: [
                   {
                        field: "no",
                        title: "No",
                        width : "20px",
                    },
                    
                    // {
                    //     field: "kodeproduk",
                    //     title: "Kode Sirs",
                    //     width : "30px"
                    // },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width : "90px"
                    },
                    {
                        field: "satuanstandar",
                        title: "Satuan",
                        width : "20px",
                    },{
                        field: "jenisProduk",
                        title: "Jnis Produk",
                        width : "90px"
                    },

                    {
                        
                            field: "qtyawal",
                            title: "stok awal",
                            width : "30px",
                            template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
                     
                    },
                   
                    {
                            field: "qtymasuk",
                            title: "masuk",
                            width : "30px",
                            template: "<span class='style-right'>{{formatRupiah('#: qtymasuk #', '')}}</span>"
                       
                    },
                    {
                       
                       
                            field: "qtykeluar",
                            title: "keluar",
                            width : "30px",
                            template: "<span class='style-right'>{{formatRupiah('#: qtykeluar #', '')}}</span>"
                       
                    },
                    {
                       
                            field: "qtyakhir",
                            title: "Qty akhir dari kartustok",
                            width : "30px",
                            template: "<span class='style-right'>{{formatRupiah('#: qtyakhir #', '')}}</span>"
                       
                    },
                    {
                       
                            field: "qtyakhirjumlah",
                            title: "Qty jumlah",
                            width : "30px",
                            template: "<span class='style-right'>{{formatRupiah('#: qtyakhirjumlah   #', '')}}</span>"
                       
                    }
                ],

            };

            // $scope.columnGrid = [
            //     {
            //         field: "no",
            //         title: "No",
            //         width : "20px",
            //     },
            //     {
            //         field: "kodebmn",
            //         title: "Kode",
            //         width : "50px"
            //     },
            //     {
            //         field: "kodeproduk",
            //         title: "Kode Sirs",
            //         width : "50px"
            //     },
            //     {
            //         field: "namaproduk",
            //         title: "Nama Barang",
            //         width : "50px"
            //     },
            //     {
            //         field: "satuanstandar",
            //         title: "Satuan",
            //         width : "20px",
            //     },
            //     {
            //         field: "harga",
            //         title: "Harga Satuan",
            //         width : "40px",
            //         template: "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            //     },
            //     {
            //         title: "Saldo Awal",
            //         columns : [
            //         {
            //             field: "qtyawal",
            //             title: "Qty",
            //             width : "30px",
            //             template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
            //         },
            //         {
            //             field: "ttlawal",
            //             title: "Jumlah (Rp)",
            //             width : "60px",
            //             template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
            //         }],
            //         width : "90px",
            //     },
            //     {
            //         title: "Penerimaan",
            //         columns : [
            //         {
            //             field: "qtymasuk",
            //             title: "Qty",
            //             width : "30px",
            //             template: "<span class='style-right'>{{formatRupiah('#: qtymasuk #', '')}}</span>"
            //         },
            //         {
            //             field: "ttlmasuk",
            //             title: "Jumlah (RP)",
            //             width : "60px",
            //             template: "<span class='style-right'>{{formatRupiah('#: ttlmasuk #', '')}}</span>"
            //         }],
            //         width : "90px",
            //     },
            //     {
            //         title: "Pengeluaran",
            //         columns : [
            //         {
            //             field: "qtykeluar",
            //             title: "Qty",
            //             width : "30px",
            //             template: "<span class='style-right'>{{formatRupiah('#: qtykeluar #', '')}}</span>"
            //         },
            //         {
            //             field: "ttlkeluar",
            //             title: "Jumlah (Rp)",
            //             width : "60px",
            //             template: "<span class='style-right'>{{formatRupiah('#: ttlkeluar #', '')}}</span>"
            //         }],
            //         width : "90px",
            //     },
            //     {
            //         title: "Saldo Akhir",
            //         columns : [
            //         {
            //             field: "qtyakhir",
            //             title: "Qty",
            //             width : "30px",
            //             template: "<span class='style-right'>{{formatRupiah('#: qtyakhir #', '')}}</span>"
            //         },
            //         {
            //             field: "ttlakhir",
            //             title: "Jumlah (Rp)",
            //             width : "60px",
            //             template: "<span class='style-right'>{{formatRupiah('#: ttlakhir #', '')}}</span>"
            //         }],
            //         width : "90px",
            //     }
            // ];

            // $("#kGrid").kendoGrid({
            //     toolbar: ["excel"],
            //         excel: {
            //             fileName: "SaldoPenerimaanDanPengeluaranBarang.xlsx",
            //             allPages: true,
            //         },
                
            //     dataSource: $scope.dataExcel,
            //     sortable: true,
            //     pageable: true,
            //     resizable: true,
            //     columns: [
            //         {
            //             field: "no",
            //             title: "No",
            //             width : "20px",
            //         },
            //         {
            //             field: "kodebmn",
            //             title: "Kode",
            //             width : "30px"
            //         },
            //         {
            //             field: "kodeproduk",
            //             title: "Kode Sirs",
            //             width : "50px"
            //         },
            //         {
            //             field: "namaproduk",
            //             title: "Nama Barang",
            //             width : "50px"
            //         },
            //         {
            //             field: "satuanstandar",
            //             title: "Satuan",
            //             width : "20px",
            //         },
            //         {
            //             field: "harga",
            //             title: "Harga Satuan",
            //             width : "40px",
            //             template: "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            //         },
            //         {
            //             title: "Saldo Awal",
            //             columns : [
            //             {
            //                 field: "qtyawal",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlawal",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Penerimaan",
            //             columns : [
            //             {
            //                 field: "qtymasuk",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtymasuk #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlmasuk",
            //                 title: "Jumlah (RP)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlmasuk #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Pengeluaran",
            //             columns : [
            //             {
            //                 field: "qtykeluar",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtykeluar #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlkeluar",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlkeluar #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Saldo Akhir",
            //             columns : [
            //             {
            //                 field: "qtyakhir",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtyakhir #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlakhir",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlakhir #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         }
            //     ]

             // });

            // $scope.data2 = function(dataItem) {
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [
            //             {
            //                 "field": "namaproduk",
            //                 "title": "Nama Produk",
            //                 "width" : "100px",
            //             },
            //             {
            //                 "field": "satuanstandar",
            //                 "title": "Satuan",
            //                 "width" : "30px",
            //             },
            //             {
            //                 "field": "qtyproduk",
            //                 "title": "Qty",
            //                 "width" : "30px",
            //             }
            //         ]
            //     }
            // };  
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
            $scope.formatTanggal = function(tanggal){
              return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl){
                
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih/(1000*60*60*24*365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
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
            $scope.CetakLap = function() {
                var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
                var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
                if($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                
                var stt = 'false'
                if (confirm('View Laporan Stok Opname? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }
                // old
                // var client = new HttpClient();        
                // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname=1&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&ruangan='+ruangan+'&view='+ stt+'&user='+ $scope.dataLogin.namaLengkap, function(response) {
                // });
                var client = new HttpClient();        
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname2=1&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&ruangan='+ruangan+'&view='+ stt+'&user='+ $scope.dataLogin.namaLengkap, function(response) {
                });
            };

            $scope.CetakRiwayat = function() {                
                $scope.isRouteLoading=true;
                var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
                var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
                if($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;

                var data2 = details

                var  TempData = []
                        for(var i=0;i<data2.length; i++){
                           // if (details[i].rekananfk != null && details[i].statusbarang == null){
                               TempData.push(data2[i])
                            // }    
                        }
                var data = 
                    {
                        details:TempData
                    }
                    medifirstService.riwayatrealisasi(data).then(function(e) {
                    $scope.isRouteLoading=false;
                    // debugger;
                    var noIr = e.data.noIr
                    if (confirm('View Riwayat Persediaan? ')) {
                        stt='true';
                    } else {                   
                    var stt = 'false'
                    }
                    // Do nothing!
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/logistik?cetak-riwayatpersediaan=1&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&idriwayat='+noIr+'&view='+ stt+'&user='+ $scope.dataLogin.namaLengkap, function(response) {
                    });
                        // stt='false'
                })
            };

           
//***********************************

}
]);
});
