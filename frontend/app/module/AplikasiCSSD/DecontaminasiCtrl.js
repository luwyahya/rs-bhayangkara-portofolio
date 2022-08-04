define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('DecontaminasiCtrl', ['$rootScope', '$scope', 'ModelItem','ManageLogistikPhp', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem, manageLogistikPhp, DateHelper, $state, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.jamMulai = $scope.now;
			$scope.item.jamSelesai = $scope.now;
			$scope.dataVOloaded = true;
			var init = function () {
                manageLogistikPhp.getDataTableTransaksi("cssd-decontaminasi/detail-decontaminasi/?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
                    $scope.dataHeader = dat.data.header;
                    $scope.dataGrid = dat.data.detail;
                    $scope.dataSource = new kendo.data.DataSource({
                        pageSize: 5,
                        data: $scope.dataGrid,
                        autoSync: true
                    });
                    $scope.item.noOrder = $scope.dataHeader.noorder;
                    $scope.item.ruangan = $scope.dataHeader.namaruangan;
                    $scope.item.petugas = $scope.dataHeader.namalengkap;
               
                    if($scope.dataHeader.tanggalujiswab == undefined){
                    	var tanggal = new Date();
                    }else{
                    	var tanggal = new Date($scope.dataHeader.tanggalujiswab);	
                    }	
                    if($scope.dataHeader.jammasuk == undefined){
                    	var jamMulai = new Date();
                    }else{
                    	var jamMulai = new Date($scope.dataHeader.jammasukujiswab);
                    }

                    if($scope.dataHeader.jamkeluar == undefined){
                    	var jamSelesai = new Date();
                    }else{
                    	var jamSelesai = new Date($scope.dataHeader.jamkeluarujisawb)
                    }
					
					if ($scope.dataHeader.jammasukujiswab == "" || $scope.dataHeader.jammasukujiswab == undefined) {
						//$scope.item.jamMulai = $scope.dataHeader.jamMulai;
						//$scope.item.jamSelesai = $scope.dataHeader.jamAkhir;
						$scope.item.jamMulai = new Date();
						$scope.item.jamSelesai = new Date();
					} else {
						$scope.item.jamMulai = jamMulai;
						$scope.item.jamSelesai = jamSelesai;
					}

					if ($scope.dataHeader.tanggalujiswab == "" || $scope.dataHeader.tanggalujiswab == undefined) {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = tanggal;
					}
					debugger;
                });
            };
            init();

            $scope.batal = function(){
            	$state.go('DaftarPenerimaanSterilisasiAlat');
            }
			$scope.gridDecontaminasi = { 
				pageable: true,
				columns: [
				{ field:"namaproduk",title:"<center>Nama Barang"},
				{ field:"qty",title:"<center>Jumlah"},
				{ field:"satuanstandar",title:"<center>Satuan"}
				],
				editable: false
			};
			$scope.simpan = function () {
				var dataGridNew = [];
				for (var i=0;i<$scope.dataGrid.length;i++) {
					var dataTemp =
					{
						"produk":{
							"id":$scope.dataSource._data[i].produkid
						},
						"qtyProduk":$scope.dataSource._data[i].qty,
						"noRec":$scope.dataSource._data[i].norec
					}
					dataGridNew.push(dataTemp);
					
				}
				var data = 
				{
					"strukPelayanan":{
						"noRec":$state.params.strukPelayananId
					},
					"noRec":$scope.dataHeader.norec,
					"tanggal":$scope.item.tanggal,
					"jamMulai":$scope.item.jamMulai,
					"jamSelesai":$scope.item.jamSelesai,
					"permintaan": $scope.dataHeader.norecpermintaan,
					"petugas": $scope.dataHeader.objectpegawaiorderfk,
					"cssdDecontaminasiDetail": dataGridNew
				}
				manageLogistikPhp.postpost("cssd-decontaminasi/save-decontaminasi/",data).then(function(e) {
					init();
					 var konfirmasi = $mdDialog.confirm()
					.title("Peringatan!")
					.textContent("Kembali Ke Daftar Penerimaan Sterilisasi Alat?")
					.ariaLabel("Lucky Day")
					.ok("Ya")
					.cancel("Tidak")

					$mdDialog.show(konfirmasi).then(function(){
						$state.go("DaftarPenerimaanSterilisasiAlat");
					})
				});
			}
		}
		]);
});