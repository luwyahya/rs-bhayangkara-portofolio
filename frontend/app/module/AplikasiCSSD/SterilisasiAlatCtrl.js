define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('SterilisasiAlatCtrl', ['$rootScope', '$scope', 'ModelItem', 'ManageLogistikPhp', 'ModelItemAkuntansi', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem, manageLogistikPhp,modelItemAkuntansi, DateHelper, $state, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.jamMulai = $scope.now;
			$scope.item.jamSelesai = $scope.now;
			$scope.dataVOloaded = true;
			$scope.dataPost = [];

			$scope.batal = function(){
				$state.go('DaftarPenerimaanSterilisasiAlat');
			}
			var init = function () {
				
				manageLogistikPhp.getDataTableTransaksi("cssd-sterilisasi/list-sterilisasi?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
					debugger;	
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					for (var i = 0; i < $scope.dataGrid.length; i++) {
                            

                            if ($scope.dataGrid[i].kondisi!='Rusak') {
                            	$scope.dataGrid[i].kondisi='Baik';
                            	$scope.isBaik=true;
                            } else {
                            	$scope.dataGrid[i].kondisi='Rusak';
                            	$scope.isRusak=true;
                            }

                            
                        }
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 5,
						data: $scope.dataGrid,
						autoSync: true
					});
					$scope.item.jumlahCycle = $scope.dataHeader.siklus;
					if($scope.dataHeader.jenisHarga == ""){
						$scope.item.jenisHarga = "Per Item";
					}else{
						$scope.item.jenisHarga = $scope.dataHeader.jenisHarga;	
					}
					$scope.item.noOrder = $scope.dataHeader.noOrder;
					$scope.item.noBundle = $scope.dataHeader.noBundel;
					$scope.item.ruangan = $scope.dataHeader.ruanganAsal;
					$scope.item.operator = $scope.dataHeader.petugas;
					$scope.item.jenisSterilisasi = {"name": $scope.dataHeader.jenisSterilisasi}
					if($scope.dataHeader.tanggal ==  undefined){
						var tanggal = new Date();
					}else{
						var tanggal = new Date($scope.dataHeader.tanggal);
					}
					//var tanggal = new Date($scope.dataHeader.tanggalPlanning);
					if($scope.dataHeader.jammulai == undefined){
						var jamMulai = new Date();
					}else{
						var jamMulai = new Date($scope.dataHeader.jammulai);
					}
					/*var jamMulai = new Date($scope.dataHeader.jamMulai)*/;
					if($scope.dataHeader.jamakhir == undefined){
						var jamSelesai = new Date();
					}else{
						var jamSelesai = new Date($scope.dataHeader.jamakhir);
					}
					//var jamSelesai = new Date($scope.dataHeader.jamAkhir);

					if($scope.dataHeader.tanggalexpired ==  undefined){
						var tanggalexpired = new Date();
					}else{
						var tanggalexpired = new Date($scope.dataHeader.tanggalexpired);
					}
					
					if ($scope.dataHeader.jammulaisterilisasi == undefined || $scope.dataHeader.jammulaisterilisasi == "-") {
						debugger
						//$scope.item.jamMulai = $scope.dataHeader.jamMulai;
						//$scope.item.jamSelesai = $scope.dataHeader.jamAkhir;
						$scope.item.jamMulai = new Date();
						$scope.item.jamSelesai = new Date();
					} else {
						$scope.item.jamMulai = $scope.dataHeader.jammulaisterilisasi;
						$scope.item.jamSelesai = $scope.dataHeader.jamakhirsterilisasi;
					}

					if ($scope.dataHeader.tanggalsterilisasi == undefined || $scope.dataHeader.tanggalsterilisasi == "-") {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal =  $scope.dataHeader.tanggalsterilisasi;
					}

					if ($scope.dataHeader.tanggalexpired == undefined || $scope.dataHeader.tanggalexpired == "-") {
						$scope.item.tanggalexpired = new Date();
					} else {
						$scope.item.tanggalexpired =  $scope.dataHeader.tanggalexpired;
					}

					$scope.item.jenisSterilisasi2 = $scope.dataHeader.jenissterilisasi;
					

				});
			};
			init();
			function saveBaik(e){
				debugger;
				e.preventDefault();
				debugger;
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				
				var stt = 'false'
                if (confirm('Barang baik? ')) {
                    var itemKondisi = {
						"norec": dataItem.Expr1,
						"kondisi": 'Baik'
					}
					manageLogistikPhp.postpost("cssd-steril/update-kondisi",itemKondisi).then(function (e) {
						if (e.status === 201) {
							init();
						}
					})
                } else {
                    // Do nothing!
                    stt='false'
                }
				

			}

			function saveRusak(e){
				debugger;
				e.preventDefault();
				
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				
				var stt = 'false'
                if (confirm('Barang rusak? ')) {
                    var itemKondisi = {
						"norec": dataItem.Expr1,
						"kondisi": 'Rusak'
					}
					debugger;
					manageLogistikPhp.postpost("cssd-steril/update-kondisi",itemKondisi).then(function (e) {
						if (e.status === 201) {
							init();
						}
					})
                } else {
                    // Do nothing!
                    stt='false'
                }
				

			}
			$scope.gridSterilisasi = { 
				pageable: true,
				columns: [
				{ field:"namaProduk",title:"<center>Nama Barang"},
				{ field:"qtyProduk",title:"<center>Jumlah"},
				{ field:"satuanStandar",title:"<center>Satuan"},
				{ field:"kondisi",title:"<center>Kondisi"},
				{
					"command":[{
						text: "✔ Baik", 
						click: saveBaik
					},{
						text: "Rusak", 
						click: saveRusak, 
						imageClass: "k-icon k-delete"
					}],
					title: "Update Kondisi",
					width: "200px",
				}
				// {
				// 	template: "<div class='c-button success' ng-click='saveBaik(e)' ng-show='isRusak'>✔ Baik</div> <div class='c-button cancel' ng-click='saveRusak(e)' ng-show='isBaik'><span class='k-icon k-delete'></span> Rusak</div>",
				// 	title: "Action",
				// 	width: "100px",
				// }
				],
				editable: false
			};
			$scope.listJenisSterilisasi = [
			{"id":1,"name":"Sterilisasi Suhu Tinggi"},
			{"id":2,"name":"Sterilisasi Suhu Rendah"}]
			$scope.jenisHarga = [
			{"id":1,"name":"Per Item"},
			{"id":2,"name":"Per Cycle"}]
			// $scope.listKondisi = [
			// {"id":1,"name":"Baik"},
			// {"id":2,"name":"Rusak"}]

			$scope.listKondisi=[
		         {"id":1,"nama":"Kondisi","detail":[{"id":1,"nama":"Tidak"},{"id":2,"nama":"Ya"}]}
		      ]

			$scope.simpan = function () {
				var dataProduk = []
				for (var i=0;i<$scope.dataSource._data.length;i++){
					var dataTemp =
					{
						"produk":{
							"id":$scope.dataSource._data[i].produkId
						},
						"qtyProduk":$scope.dataSource._data[i].qtyProduk,
						"noRec":$scope.dataSource._data[i].noRec
					}
					dataProduk.push(dataTemp);
				}
				var data = 
				{
					"jenisSterilisasi":$scope.item.jenisSterilisasi.name,
					"norec": $scope.dataHeader.norec,
					"tanggal":$scope.item.tanggal,
					"jammulai":moment($scope.item.jamMulai).format('HH:mm'),
					"jamakhir":moment($scope.item.jamSelesai).format('HH:mm'),
					"tanggalexpired":$scope.item.tanggalexpired,
					// "jenissterilisasi": $scope.item.jenisSterilisasi
					// "siklus":$scope.item.jumlahCycle,
					// "jenisHarga":$scope.item.jenisHarga,
					// "cssdSterilDetail":dataProduk
				}
				debugger;
				manageLogistikPhp.postpost("cssd-steril/save-steril",data).then(function (e) {
					init();
					var konfirmasi = $mdDialog.confirm()
					.title("Peringatan!")
					.textContent("Kembali Ke Daftar Penerimaan Sterilisasi Alat?")
					.ariaLabel("Lucky Day")
					.ok("Ya")
					.cancel("Tidak")
					$mdDialog.show(konfirmasi).then(function(){
						$state.go("DaftarPenerimaanSterilisasiAlat")
					})

				});
			}
		}
		]);
});
