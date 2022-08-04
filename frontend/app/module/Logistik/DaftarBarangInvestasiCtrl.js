define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarBarangInvestasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function($scope, $state, cacheHelper, medifirstService) {
            $scope.isRouteLoading=false;            
            $scope.bukanLogistik = true;
            $scope.now = new Date();
            $scope.item = {};
            LoadDataCombo();
            

             function LoadDataCombo() {
                var DataRuanganAll = [];
                var chacePeriode = cacheHelper.get('DaftarBarangInvestasiCtrl');
                if(chacePeriode != undefined){
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.Awal = new Date(arrPeriode[0]);
                    $scope.item.Akhir = new Date(arrPeriode[1]);

                }else{

                    $scope.item.Awal=$scope.now;
                    $scope.item.Akhir=$scope.now;              
                }

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {                    
                    var dataCombo = data.data;                    
                    $scope.sourceDetailJenis = dataCombo.detailjenisproduk                    
                });                                                              
                // $scope.sourceRuangan = medifirstService.getMapLoginUserToRuangan();
                // if ($scope.sourceRuangan != undefined) {
                //     $scope.item.ruangan = {id:$scope.sourceRuangan[0].id,namaruangan:$scope.sourceRuangan[0].namaruangan};
                // }else{
                medifirstService.get("sysadmin/general/get-combo-ruangan-general").then(function (dat) {
                    $scope.sourceDepartemen = dat.data.departemen;
                }); 
                //}
                
                LoadData();                                             
             }

            function LoadData() {
                $scope.isRouteLoading=true;
                var tglAwal = moment($scope.item.Awal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.Akhir).format('YYYY-MM-DD HH:mm:ss');

                var ruanganId="";
                if ($scope.item.ruangan != undefined) {
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
                if ($scope.item.NamaProduk != undefined) {
                    namaproduk = "&namaproduk=" + $scope.item.NamaProduk;
                }
                medifirstService.get("logistik/get-daftar-asset?"
                    // +"tglAwal="+tglAwal+
                    // "&tglAkhir="+tglAkhir
                    +ruanganId+kdDetailJenis+namaproduk, true).then(function(dat){
                    //debugger
                    $scope.isRouteLoading=false;
                    var datas = dat.data.datas;
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
                    cacheHelper.set('DaftarBarangInvestasiCtrl', chacePeriode);
                    
                });
            };
            
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "50px",
                    // filterable: false
                },
                {
                    "field": "noregisteraset",
                    "title": "No Aset"
                },
                {
                    "field": "kdbmn",
                    "title": "Kode BMN"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang"
                },
                {
                    "field": "spesifikasi",
                    "title": "Spesifikasi"                    
                },
                {
                    "field": "jenisaset",
                    "title": "Jenis Asset"                    
                },
                {
                    "field": "qtyprodukaset",
                    "title": "Qty Asset"                    
                },
                {
                    "field": "ruangancurrent",
                    "title": "Ruangan"
                },
                {
                    "field": "asalproduk",
                    "title": "SumberDana"
                }]

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
                // if ($scope.item.ruangan == undefined){
                //     alert('Pilih Ruangan terlebih dahulu!!!')
                // }
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

            $scope.getIsiComboRuangan = function () {
                $scope.sourceRuangan = $scope.item.departemen.ruangan
            }             
        }
    ])
})