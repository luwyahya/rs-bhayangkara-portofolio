define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('KartuPemeliharaanCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function($scope, $state, cacheHelper, medifirstService) {
            $scope.isRouteLoading=false;            
            $scope.bukanLogistik = true;
            $scope.now = new Date();
            $scope.item = {};
            LoadDataCombo();
            

             function LoadDataCombo() {
                var DataRuanganAll = [];
                var chacePeriode = cacheHelper.get('KartuPemeliharaanCtrl');
                if(chacePeriode != undefined){
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglAwal = new Date(arrPeriode[0]);
                    $scope.item.tglAkhir = new Date(arrPeriode[1]);

                }else{

                    $scope.item.tglAwal=$scope.now;
                    $scope.item.tglAkhir=$scope.now;              
                }

                medifirstService.getPart("asset/get-produk-asset-part", true, true, 20).then(function (data) {
                    $scope.sourceProduk = data;
                }); 

                // medifirstService.get('get-produk-asset-part').then(function (data) {                    
                //     var dataCombo = data.data;                    
                //     $scope.sourceDetailJenis = dataCombo.detailjenisproduk                    
                // });                                                              
                // $scope.sourceRuangan = medifirstService.getMapLoginUserToRuangan();
                // if ($scope.sourceRuangan != undefined) {
                //     $scope.item.ruangan = {id:$scope.sourceRuangan[0].id,namaruangan:$scope.sourceRuangan[0].namaruangan};
                // }else{
                //     medifirstService.getPart("sysadmin/general/get-combo-ruangan-general", true, true, 20).then(function (data) {
                //         $scope.sourceRuangan = data;
                //     }); 
                // }
                
                LoadData();                                             
             }

            function LoadData() {
                $scope.isRouteLoading=true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');

                var ruanganId="";
                if ($scope.item.ruangan !== undefined) {
                    ruanganId ="&ruangancurrenfk=" +$scope.item.ruangan.id
                }
                // var kdproduk="";
                // if ($scope.item.produk !== undefined) {
                //     kdproduk = "&kdproduk=" +$scope.item.produk.id;
                // }
                 var kdDetailJenis="";
                if ($scope.item.DetailJenis != undefined) {
                    kdDetailJenis = "&kdDetailJenis=" +$scope.item.DetailJenis.id;
                }
                var namaproduk="";
                if ($scope.item.produk != undefined) {
                    namaproduk = "&norecAsset=" + $scope.item.produk.id;
                }
                medifirstService.get("asset/get-data-jadwal-pemeliharaan?"
                    +"tglAwal="+tglAwal+
                    "&tglAkhir="+tglAkhir+"&jenis=kartu"
                    +ruanganId+kdDetailJenis+namaproduk, true).then(function(dat){
                    //debugger
                    $scope.isRouteLoading=false;
                    var datas = dat.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i+1
                    }

                    $scope.sourceBarang = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    var chacePeriode = tglAwal + "~" + tglAkhir ;
                    cacheHelper.set('KartuPemeliharaanCtrl', chacePeriode);
                    
                });
            };
            
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                    // filterable: false
                },
                {
                    "field": "tglplanning",
                    "title": "Tgl Pemeliharaan",
                    "width": "50px"
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px"
                },
                {
                    "field": "namalengkap",
                    "title": "PIC",
                    "width": "50px"
                },
                {
                    "field": "startdate",
                    "title": "Mulai"   ,
                    "width": "50px"                 
                },
                {
                    "field": "duedate",
                    "title": "Selesai" ,
                    "width": "50px"                   
                },
                {
                    "field": "keteranganverifikasi",
                    "title": "Inspeksi"  ,
                    "width": "90px"                  
                }
            ]

            // };
            // manageSarpras.getOrderList("anggaran/get-ruangan", true).then(function(e){
            //     $scope.item.ruangan = e.data.data;
                // console.log(JSON.stringify($scope.item.ruangan));

                // manageSarpras.getListAset($scope.item.ruangan.id, '', '').then(function(dat) {
                //     $scope.sourceBarang = new kendo.data.DataSource({
                //         data: dat.data.data
                //     });
                // });
                // //debugger;
            // });

            $scope.Search = function() {
                LoadData();
                // var ruanganId, awal, akhir, periode;
                // if ($scope.item.ruangan !== undefined) {
                //     ruanganId = $scope.item.ruangan.id;
                // }else {
                //     ruanganId = '';
                // }
                // if (!$scope.item.awal !== undefined) {
                //     awal = DateHelper.getPeriodeFormatted($scope.item.awal);
                // }else {
                //     awal = '';
                // }
                // if (!$scope.item.akhir !== undefined) {
                //     akhir = DateHelper.getPeriodeFormatted($scope.item.akhir);
                // }else {
                //     akhir = '';
                // }
                // periode = "&periodeAwal=" + awal + "&periodeAhir=" + akhir;

                // manageSarpras.getListAset(ruanganId, awal, akhir).then(function(dat) {
                //     $scope.sourceBarang = new kendo.data.DataSource({
                //         data: dat.data.data
                //     });
                    ////debugger;
                // });
            };

            $scope.klikGrid = function(dataSelected){
                $scope.dataSelected = dataSelected
            }

            $scope.DetailAsset = function() {
                //debugger;
                if($scope.dataSelected == undefined){
                     alert("Data Asset Belum Dipilih!!")
                     return
                }
                var chacePeriode ={ 0 : $scope.dataSelected.norec ,
                    1 : 'InputDetailAsset',
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('MasterBarangInvestasiCtrl', chacePeriode);
                $state.go('MasterBarangInvestasi');                
            }

            $scope.KirimAsset = function() {
                debugger;
                if($scope.dataSelected == undefined){
                     alert("Data Asset Belum Dipilih!!")
                     return
                }
                var chacePeriode ={ 0 : $scope.dataSelected.norec,
                    1 : 'KirimBarangAsset',
                    2 : $scope.dataSelected.noregisteraset,
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('KirimBarangAsetCtrl', chacePeriode);
                $state.go('KirimBarangAset');                
            }             
        }
    ])
})