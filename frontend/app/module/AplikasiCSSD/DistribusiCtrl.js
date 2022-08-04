define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('DistribusiCtrl', ['$rootScope', '$scope', 'ModelItem', 'ManageLogistikPhp', 'ModelItemAkuntansi', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem,manageLogistikPhp,modelItemAkuntansi, DateHelper, $state, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.dataVOloaded = true;
			$scope.dataPost = [];
			$scope.listStatus = [
			{"id":1,"name":"Dikirim"},
			{"id":2,"name":"Belum Dikirim"}]
			$scope.gridDistribusiInternal = { 
				pageable: true,
				columns: [
				{ field:"produkid", title:"<center>Produk ID"},
				{ field:"namaproduk",title:"<center>Nama Barang"},
				{ field:"satuan",title:"<center>Satuan"},
				{ field:"qty",title:"<center>Jumlah"}
				],
				editable: false
			};
			var init = function () {
				// manageLogistikPhp.getDataTableTransaksi("cssd-distribusi/get-no-kirim").then(function(dat){
				// 	$scope.item.nomorKirim = dat.data.noKirim;
				// });
				manageLogistikPhp.getDataTableTransaksi("CSSD/get-permintaan-pernoorder?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 5,
						data: $scope.dataGrid,
						autoSync: true
					});
					$scope.item.jumlahCycle = $scope.dataHeader.siklus;
					$scope.item.jenisHarga = $scope.dataHeader.jenisHarga;
					$scope.item.noOrder = $scope.dataHeader.noorder;
					$scope.item.noBundle = $scope.dataHeader.noBundel;
					$scope.item.ruangan = $scope.dataHeader.namaruangan;
					$scope.item.operator = $scope.dataHeader.namalengkap;
					$scope.item.status = $scope.dataHeader.status;
					var tanggal = new Date($scope.dataHeader.tanggal);
					if ($scope.dataHeader.tanggal == undefined || $scope.dataHeader.tanggal == "-") {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = tanggal;
					}

					$scope.item.nomorKirim = $scope.dataHeader.nokirim;
					$scope.item.status = $scope.dataHeader.status;
					// $scope.item.tanggal = $scope.dataHeader.tglkirim;
				});
			};
			init();
			
			$scope.batal = function(){
				$state.go('DaftarPenerimaanSterilisasiAlat')
			}
			$scope.simpanInternal = function () {
				var dataDistribusi = []
				if($scope.item.status.id == 1){
					$scope.item.status = "Kirim"
				}else{
					$scope.item.status = "Belum Kirim"
				}
				for (var i=0;i<$scope.dataSource._data.length;i++){
					var dataTemp =
					{
						"produk": {
					    	"id": $scope.dataSource._data[i].produkId
					    },
					    "qtyProduk": $scope.dataSource._data[i].qtyProduk,
					    "noRec": $scope.dataSource._data[i].noRec
					}
					dataDistribusi.push(dataTemp);
				}
				debugger;	
				var data = 
				{
				  "strukPelayanan": {
				    "noRec": $state.params.strukPelayananId
				  },
				  "noRec": $scope.dataHeader.norec,
				  "tanggal": $scope.item.tanggal,
				  "status": $scope.item.status,
				  "noKirim": $scope.item.nomorKirim,
				  "cssdDistribusiDetailVO": dataDistribusi,
				  "objectruanganfk": $scope.dataHeader.objectruanganfk,
				  "objectruangantujuanfk": $scope.dataHeader.objectruangantujuanfk,
				}
				manageLogistikPhp.postpost( "cssd-distribusi/save-distribusi",data).then(function (e) {
					// var konfirmasi = $mdDialog.confirm()
					// .title('Peringatan !')
					// .textContent('Kembali ke Daftar Penerimaan Sterilisasi Alat?')
					// .ariaLabel('Lucky Day')
					// .ok('ya')
					// .cancel('Tidak')
					// $mdDialog.show(konfirmasi).then(function(){
						$state.go("DaftarPenerimaanSterilisasiAlat");
					// })
				});
			}

			$scope.dataSource = new kendo.data.DataSource({
				pageSize: 5,
				data: $scope.dataDitribusiEksternal,
				autoSync: true
			});
			$scope.gridDistribusiEksternal = { 
				pageable: true,
				columns: [
				{ field:"namaPaket", title:"<center>Nama Paket"},
				{ field:"namaBarang",title:"<center>Nama Barang"},
				{ field:"jumlah",title:"<center>Jumlah"},
				{ field:"satuan",title:"<center>Satuan"}
				],
				editable: false
			};
		}
		]);
});