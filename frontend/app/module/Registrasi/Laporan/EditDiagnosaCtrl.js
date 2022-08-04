define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EditDiagnosaCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded1 = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            // var responData='';
            
            LoadCache();
            loadCombo()
            LoadData() 

            function LoadCache() {
                var chacePeriode = cacheHelper.get('cacheEditDiagnosa')
                if (chacePeriode != undefined) {
                    $scope.item.diagnosa = chacePeriode[0]

                    LoadData()
                }
                else { LoadData()
                }
            }
            function loadCombo(){
            //      medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
            //         .then(function (data) {
            //             $scope.listRuangans=data.data.ruanganrajal
            //         })

            //         medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
            //     $scope.listKelompokPasien = data.data.kelompokpasien;
            // })
            medifirstService.get("registrasi/laporan/get-combo-edit-diagnosa", false).then(function (data) {
                var data = data.data
                $scope.listDiagnosa = data.kdDiagnosa;
                //$scope.listjaminanKhusus = data.data.jaminankhusus;

            });
                    
            }

            $scope.SearchData = function () {
                LoadData()
            }
            function LoadData() {
                var tempkddArr = {}

                if ($scope.item.diagnosa == undefined) {
                    var dg = ""
                } else {
                    var dg = "&kdDiagnosa=" + $scope.item.diagnosa.id
                    tempkddArr = { id: $scope.item.diagnosa.id, kddiagnosa: $scope.item.diagnosa.kddiagnosa}
                }
                // if ($scope.item.nodtd == undefined) {
                //     var dtd = ""
                // } else {
                //     var dtd = "&noDtd=" + $scope.item.nodtd.id
                //     tempkddArr = { id: $scope.item.nodtd.id, kdnodtd: $scope.item.nodtd.nodtd}
                // }
                var chacePeriode = {
                    0: tempkddArr
                }
                cacheHelper.set('cacheEditDiagnosa', chacePeriode);

                $scope.isRouteLoading = true;

                medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                 + dg 
                ).then(function (data) {
                    debugger;
                    if (data.statResponse) {
						var data = data.data
						for (var i = 0; i < data.data.length; i++) {
						}
						$scope.isRouteLoading = false;
					} else {
                        $scope.isRouteLoading = false;
                    }
                    $scope.item.kddiagnosa = data[0].kddiagnosa
                    $scope.item.nodtd = data.data[0].nodtd
                    $scope.item.gsp = data.data[0].golongansebabpenyakit

                });
				// medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                //     + dtd + kdd + gsp

                // ).then(function (data) {
                //     var data = data.data
                //     for (var i = 0; i < data.data.length; i++) {
                //         data.data[i].no = i + 1
                //     }


				// 	//var chacePeriode = tglAwal + "~" + tglAkhir
				// 	// + "~" +cacheNoreg + "~" +cacheNoRm
				// 	// + "~" +cacheNama
				// 	// + "~" +$scope.item.instalasi 
				// 	// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
				// 	// + "~" +$scope.item.dokter;
				// 	cacheHelper.set('EditDiagnosaCtrl', chacePeriode);
				// });
                
			};
            $scope.Save=function(){
                 debugger;
                if($scope.item.nodtd === ''){
                    messageContainer.error('No Dtd tidak boleh dikosongkan !');
                    return;
                }
                if($scope.item.gsp == ''){
                    messageContainer.error('Golongan Sebab Penyakit tidak boleh dikosongkan !');
                    return;
                }
                var nodtd= null;
                if ( $scope.item.nodtd!=  undefined) {
                    nodtd =  $scope.item.nodtd;
                }
                var golongansebabpenyakit=null;
                if ($scope.item.gsp!=undefined){
                    golongansebabpenyakit=$scope.item.gsp;
                }
                var kddiagnosa=null;
                if ($scope.item.diagnosa!=undefined) {
                    kddiagnosa=$scope.item.diagnosa;
                }
                                    
                var mappingrlmorbiditas = {
                    kddiagnosa:kddiagnosa,
                    nodtd:nodtd,
                    golongansebabpenyakit:golongansebabpenyakit
    
                }
                var objSave = {
                    mappingrlmorbiditas:mappingrlmorbiditas
                }
    
    
                // if (statusKeluarId != 5) {
                //     manageServicePhp.saveOrderPulangPasien(objSave).then(function (e) {
                //         $scope.resultAPD=e.data.dataAPD;
                //         responData=e.data;
                //         $scope.isSimpan = true;
                //         $scope.isBatal = true;
                //         $scope.isNext=false;                                             
                //     });
                // }
               
              
                medifirstService.post('registrasi/laporan/save-hasil-edit-diagnosa',objSave).then(function (data) {
                    // $scope.resultAPD=e.data.dataAPD;
                     var data=data.data;
                     $scope.isSimpan = true;
                     $scope.isBatal = true;
                     $scope.isNext=false;
                //##end         
                    
               })
               $scope.Back = function(){
                window.history.back()
            }
                                                             
            
                // if($scope.item.nodtd === ''){
                //     messageContainer.error('No Dtd tidak boleh dikosongkan !');
                //     return;
                // }
                // if($scope.item.gsp == ''){
                //     messageContainer.error('Golongan Sebab Penyakit tidak boleh dikosongkan !');
                //     return;
                // }
                //         medifirstService.post('registrasi/laporan/save-hasil-edit-diagnosa').then(function(data){
    
                //         })
            }
        }     
    ]);
});