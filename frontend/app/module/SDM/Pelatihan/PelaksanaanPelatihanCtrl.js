define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PelaksanaanPelatihanCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
		function($scope, $state, cacheHelper, medifirstService) {
			$scope.item = {};
			$scope.dataVOloaded = true;
			$scope.isRouteLoading=false;
			$scope.now = new Date();
			$scope.item.KelompokUser='';
			$scope.item.idPegawai='';
			loadDataCombo();	

			function loadDataCombo(){	
	            medifirstService.get("sdm/pelatihan/get-combo-pelatihan?", true).then(function(datas){
                    var dat = datas.data;
	            	$scope.listNarasumber=dat.narasumber;
	            	$scope.listJenisPelatihan=dat.jenispelatihan;
                    $scope.item.KelompokUser=dat.datapegawai.objectkelompokuserfk;
                    $scope.item.idPegawai=dat.datapegawai.objectpegawaifk;
	            });

	            medifirstService.get("sdm/pelatihan/get-combo-data-pelatihan?", true).then(function(datas){
                    var dat = datas.data;
	            	$scope.listPelatihan=dat.strukplanning;
	            });
		    }

		    function init() {
                $scope.isRouteLoading=true;
                var jenisPelatihan =""
                if ($scope.item.jenisPelatihan != undefined){
                    jenisPelatihan ="&jenisPelatihan=" +$scope.item.jenisPelatihan.id
                }
                var Pelatihan =""
                if ($scope.item.Pelatihan != undefined){
                    Pelatihan ="&Pelatihan=" +$scope.item.Pelatihan.noplanning
                }
                // var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("sdm/pelatihan/get-data-pelaksanaan-pelatihan?"+
                    // "tglAwal=" + tglAwal + 
                    // "&tglAkhir=" + tglAkhir +
                    jenisPelatihan+Pelatihan, true).then(function(dat){
                    $scope.isRouteLoading=false;
                    var nilai = "";
                    for (var i = 0; i < dat.data.daftar.length; i++) {
                        dat.data.daftar[i].no = i+1
                        if (dat.data.daftar[i].evaluasinarasumber == null) {
                            dat.data.daftar[i].nilainarasumber = undefined
                        }else{
                            dat.data.daftar[i].nilainarasumber = "Terevaluasi"
                        }

                        if (dat.data.daftar[i].evaluasipenyelenggarafk == null) {
                            dat.data.daftar[i].nilaipenyelenggara = undefined
                        }else{
                            dat.data.daftar[i].nilaipenyelenggara = "Terevaluasi"
                        }
                    }
                    $scope.item.namaPaketPelatihan=dat.data.daftar[0].namaplanning
                    $scope.item.totalPeserta=dat.data.daftar[0].totalpeserta
                    $scope.dataSource = dat.data.daftar;
                });                       
            }

            $scope.SearchData = function (){
            	if ($scope.item.Pelatihan == undefined) {
                    alert("Pelatihan Tidak Boleh Kosong!")
                    return;
                }; 

				init()
			}

			$scope.mainGridOptions = {
				pageable: true,
				scrollable: true,
				columns:[{ field:"penyelenggara",title:"Penyelenggara"},
				{ field:"tanggalpelaksanaan",title:"Tanggal Pelaksanaan"},
				// { field:"namalengkap",title:"Narasumber"},
				{ field:"keteranganlainnya",title:"Kegiatan"},
				{ field:"nilainarasumber",title:"Evaluasi Narasumber"},
				{ field:"nilaipenyelenggara",title:"Evaluasi Penyelenggara"}],
				editable: false
			}

			$scope.EvaluasiNarasumber = function(current){

                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                if ($scope.dataSelected.nilainarasumber != undefined) {
                    alert("Data Sudah Terevaluasi")
                    return;
                };                       
                
                var chacePeriode ={ 
                    0 : $scope.dataSelected.norec,
                    1 : 'EvaluasiNarasumber',
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }

                cacheHelper.set('InputEvaluasiNarasumberCtrl', chacePeriode);
                $state.go('InputEvaluasiNarasumber', {
                    kpid:  $scope.dataSelected.norec,
                    noOrder:'EvaluasiNarasumber'
                });
            }

            $scope.EvaluasiPenyelenggara = function(current){

                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                if ($scope.dataSelected.nilaipenyelenggara != undefined) {
                    alert("Data Sudah Terevaluasi")
                    return;
                };                       
                
                var chacePeriode ={ 
                    0 : $scope.dataSelected.norec,
                    1 : 'EvaluasiPenyelenggara',
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }

                cacheHelper.set('InputEvaluasiPenyelenggaraanCtrl', chacePeriode);
                $state.go('InputEvaluasiPenyelenggaraan', {
                    kpid:  $scope.dataSelected.norec,
                    noOrder:'EvaluasiPenyelenggara'
                });
            }
		}
	]);
});