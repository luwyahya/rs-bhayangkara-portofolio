define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('MonitoringDecontaminasiEOCtrl', ['$rootScope', '$scope', 'ModelItem','ManageLogistikPhp', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem, manageLogistikPhp, DateHelper, $state, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.jammulaisterilisasi = $scope.now;
			$scope.item.jamselesaisterilisasi = $scope.now;
			$scope.dataVOloaded = true;
			$scope.dataPost = [];
			var init = function () {
				manageLogistikPhp.getDataTableTransaksi("cssd-monitoring-eo/detail-monitoring-eo/?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
					debugger;
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					$scope.dataGrid.forEach(function (data) {
						if (data.kebersihanalat == "" || data.kebersihanalat == null ) {
							data.alatberkarat = "";
							data.kebersihanalat = "";
							data.kelenturanalat = "";
							data.keutuhanalat = "";
							data.warnaalat = "";
							data.ketajamanalat = "";
							data.kemampuanmenjepit = "";
							data.kondisialat = "";
							data.kelayakanalat = "";
							data.linenyangdikemas = "";
							data.jammulaisterilisasi = "";
							data.jamselesaisterilisasi = "";
							data.hasilchemicalindikator = "";
							data.hasillabelindikator = "";
							data.tindakan = "";
						} else {
							if (data.alatberkarat == 1){
								data.alatberkaratname = "Alat Berkarat"
							} else {
								data.alatberkaratName = "Tidak Berkarat"
							}
							if (data.kebersihanalat == 1){
								data.kebersihanalatname = "Alat Bersih"
							} else if(data.kebersihanalat == 2) {
								data.kebersihanalatname = "Kotor"
							} else {
								data.kebersihanalatname = "Ada Darah"
							}
							if (data.kelenturanalat == 1){
								data.kelenturanalatname = "Alat Lentur"
							} else {
								data.kelenturanalatname = "Tidak Lentur"
							}
							if (data.keutuhanalat == 1){
								data.keutuhanalatname = "Mur"
							} else {
								data.keutuhanalatname = "Baut"
							}
							if (data.warnaalat == 1){
								data.warnaalatname = "Bening"
							} else if(data.warnaalat == 2){
								data.warnaalatname = "Buram"
							} else {
								data.warnaalatname = "Hitam"
							}
							if (data.ketajamanalat == 1){
								data.ketajamanalatname = "Alat Tajam"
							} else {
								data.ketajamanalatname = "Tidak Tajam"
							}
							if (data.kemampuanmenjepit == 1){
								data.kemampuanalatname = "Bisa"
							} else {
								data.kemampuanalatname = "Tidak"
							}
							if (data.kondisialat == 1){
								data.kondisialatname = "Alat Kering"
							} else if(data.kondisialat == 2) {
								data.kondisialatname = "Basah"
							} else {
								data.kondisialatname = "Ada Air"
							}
							if (data.kelayakanalat == 1){
								data.kelayakanalatname = "Layak Pakai"
							} else {
								data.kelayakanalatname = "Tidak Layak Pakai"
							}
							if (data.linenyangdikemas == 1){
								data.linenyangdikemasname = "Utuh"
							} else {
								data.linenyangdikemasname = "Robek"
							}
							if (data.tindakan == 1){
								data.tindakanname = "Dekontaminasi Kembali"
							} else {
								data.tindakanname = "Dikembalikan Ke Ruangan"
							}
							data.jammulaisterilisasi = new Date(data.jammulaisterilisasi);
							data.jamselesaisterilisasi = new Date(data.jamselesaisterilisasi);
						}
					})
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 5,
						data: $scope.dataGrid,
						autoSync: true
					});
					$scope.item.noOrder = $scope.dataHeader.noorder;
					// $scope.item.noBundle = $scope.dataHeader.noBundel;
					$scope.item.ruanganAsal = $scope.dataHeader.namaruangan;
					$scope.item.ruanganTujuan = $scope.dataHeader.ruangantujuan;
					$scope.item.operator = $scope.dataHeader.namalengkap;
					var tanggal = new Date($scope.dataHeader.tanggaleo);
					if ($scope.dataHeader.tanggaleo == "" || $scope.dataHeader.tanggaleo == undefined) {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = tanggal;
					}

				});
			};
			init();
			$scope.dataSourceTemp = new kendo.data.DataSource({
				pageSize: 5,
	        	data: [],
	        	batch: true
			});
			$scope.mainGridOptionAlat = { 
				pageable: true,
				columns: [
				{ field:"namaProduk", title:"<h3 align=center>Nama Alat<h3>", width: 200},
				{ field:"qty",title:"<h3 align=center>Jumlah<h3>", width: 70},
				{ field:"ujiVisual",title:"<h3 align=center>Uji Visual<h3>", columns:[
					{ field:"alatberkaratname",title:"<h3 align=center>Alat Berkarat<h3>", width: 100},
					{ field:"kebersihanalatname",title:"<h3 align=center>Kebersihan Alat<h3>", width: 120},
					{ field:"kelenturanalatname",title:"<h3 align=center>Kelenturan Alat<h3>", width: 120},
					{ field:"keutuhanalatname",title:"<h3 align=center>Keutuhan Alat<h3>", width: 120},
					{ field:"warnaalatname",title:"<h3 align=center>Warna Alat<h3>", width: 120},
					{ field:"ketajamanalatname",title:"<h3 align=center>Ketajaman Alat<h3>", width: 120},
					{ field:"kemampuanalatname",title:"<h3 align=center>Kemampuan Menjepit<h3>", width: 150},
					{ field:"kondisialatname",title:"<h3 align=center>Kondisi Alat<h3>", width: 120},
					{ field:"kelayakanalatname",title:"<h3 align=center>Kelayakan Alat<h3>", width: 120},
					{ field:"linenyangdikemasname",title:"<h3 align=center>Linen yang Dikemas<h3>", width: 120}]},
				{ field:"jammulaisterilisasi",title:"<h3 align=center>Jam Mulai<h3>", width: 100, format:"{0:HH:mm}"},
				{ field:"jamselesaisterilisasi",title:"<h3 align=center>Jam Selesai<h3>", width: 100, format:"{0:HH:mm}"},
				{ field:"hasilchemicalindikator",title:"<h3 align=center>Hasil Chemical Indikator<h3>", width: 170},
				{ field:"hasillabelindikator",title:"<h3 align=center>Hasil Label Indikator<h3>", width: 150},
				{ field:"tindakan.name",title:"<h3 align=center>Tindakan<h3>", width: 200},
				{ command: 
					{
						text: "Hapus",
						click: $scope.removeItemGrid
					},title:"", width:100}
				],
				editable: false
			};
			$scope.removeItemGrid = function(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				grid.removeRow(row);
			};
			
			
			$scope.gridMonitoringDecontaminasi = { 
				pageable: true,
				columns: [
				{
					width: "50px",
					title:  "<center><input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
					template: "<div class='center'><input type='checkbox' class='checkbox' ng-model='dataItem.selected' ng-click='pilihBaris(dataItem)' </div>"
				},
				{ field:"namaproduk", title:"<h3 align=center>Nama Alat<h3>", width: 200},
				{ field:"qty",title:"<h3 align=center>Jumlah<h3>", width: 70},
				{ field:"ujiVisual",title:"<h3 align=center>Uji Visual<h3>",
				columns:
				[
					{ field:"alatberkaratname",title:"<h3 align=center>Alat Berkarat<h3>", width: 100},
					{ field:"kebersihanalatname",title:"<h3 align=center>Kebersihan Alat<h3>", width: 120},
					{ field:"kelenturanalatname",title:"<h3 align=center>Kelenturan Alat<h3>", width: 120},
					{ field:"keutuhanalatname",title:"<h3 align=center>Keutuhan Alat<h3>", width: 120},
					{ field:"warnaalatname",title:"<h3 align=center>Warna Alat<h3>", width: 120},
					{ field:"ketajamanalatname",title:"<h3 align=center>Ketajaman Alat<h3>", width: 120},
					{ field:"kemampuanmenjepitname",title:"<h3 align=center>Kemampuan Menjepit<h3>", width: 150},
					{ field:"kondisialatname",title:"<h3 align=center>Kondisi Alat<h3>", width: 120},
					{ field:"kelayakanalatname",title:"<h3 align=center>Kelayakan Alat<h3>", width: 120},
					{ field:"linenyangdikemasname",title:"<h3 align=center>Linen yang Dikemas<h3>", width: 120},
				]},
				{ field:"jammulaisterilisasi",title:"<h3 align=center>Jam Mulai<h3>", width: 100,format:"{0:HH:mm}"},
				{ field:"jamselesaisterilisasi",title:"<h3 align=center>Jam Selesai<h3>", width: 100,format:"{0:HH:mm}"},
				{ field:"hasilchemicalindikator",title:"<h3 align=center>Hasil Chemical Indikator<h3>", width: 170},
				{ field:"hasillabelindikator",title:"<h3 align=center>Hasil Label Indikator<h3>", width: 150},
				{ field:"tindakanname",title:"<h3 align=center>Tindakan<h3>", width: 200}

				],
				editable: false,
				selectable:true
			};
			$scope.klik = function(current){
				$scope.current = current;
				$scope.item.alatberkarat = current.alatberkarat;
				$scope.item.kebersihanalat = current.kebersihanalat;
				$scope.item.kelenturanalat = current.kelenturanalat;
				$scope.item.keutuhanalat = current.keutuhanalat;
				$scope.item.warnaalat = current.warnaalat;
				$scope.item.ketajamanalat = current.ketajamanalat;
				$scope.item.kemampuanmenjepit = current.kemampuanmenjepit;
				$scope.item.kondisialat = current.kondisialat;
				$scope.item.kelayakanalat = current.kelayakanalat;
				$scope.item.linenyangdikemas = current.linenyangdikemas;
				$scope.item.hasilchemicalindikator = current.hasilchemicalindikator;
				$scope.item.hasillabelindikator = current.hasillabelindikator;
				$scope.item.jammulaisterilisasi = current.jammulaisterilisasi;
				$scope.item.jamselesaisterilisasi = current.jamselesaisterilisasi;
				$scope.item.tindakan = {"id":current.tindakan, "name":current.tindakanName};
			};
			$scope.ketKebersihan = [
			{"id":1, "name":"Alat Bersih"},
			{"id":2, "name":"Kotor"},
			{"id":3, "name":"Ada Darah"}
			];
			$scope.ketKondisi = [
			{"id":1, "name":"Alat Kering"},
			{"id":2, "name":"Basah"},
			{"id":3, "name":"Ada Air"}
			];
			$scope.ketKelenturan = [
			{"id":1, "name":"Alat Lentur"},
			{"id":2, "name":"Tidak Lentur"}
			];
			$scope.ketKetajaman = [
			{"id":1, "name":"Alat Tajam"},
			{"id":2, "name":"Tidak Tajam"}
			];
			$scope.ketKarat = [
			{"id":1, "name":"Alat Berkarat"},
			{"id":2, "name":"Tidak Berkarat"}
			];
			$scope.ketWarna = [
			{"id":1, "name":"Bening"},
			{"id":2, "name":"Buram"},
			{"id":3, "name":"Hitam"}
			];
			$scope.ketLayak = [
			{"id":1, "name":"Layak Pakai"},
			{"id":2, "name":"Tidak Layak Pakai"}
			];
			$scope.ketMenjepit = [
			{"id":1, "name":"Bisa"},
			{"id":2, "name":"Tidak"}
			];
			$scope.ketUtuh = [
			{"id":1, "name":"Mur"},
			{"id":2, "name":"Baut"}
			];
			$scope.ketLinen = [
			{"id":1, "name":"Utuh"},
			{"id":2, "name":"Robek"}
			];
			$scope.listTindakan = [
			{"id":1, "name":"Dekontaminasi Kembali"},
			{"id":2, "name":"Dikembalikan Ke Ruangan"}
			];
			$scope.toggleSelectAll = function(ev) {
				var grids = $('#kGrid').data("kendoGrid");
				var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
				var items = grid.dataSource.data();
				items.forEach(function(item){
					item.selected = ev.target.checked;
					if (item.selected == true) {
						$scope.pilihBaris(item);
					} else {
						$scope.pilihBaris(item);
					}

				});
			};
			$scope.pilihBaris = function(dataItem)
			{
				$scope.DataCheck = true;
				var dataObj = {
					produkId : dataItem.produkid,
					namaProduk : dataItem.namaproduk,
					jumlah : dataItem.qty,
					noRec : dataItem.norec
				}

				var isExist = _.find($scope.dataPost, function(dataExist){ 
					if (
						dataExist.produkId == dataObj.produkid &&
						dataExist.namaProduk == dataObj.namaproduk &&
						dataExist.jumlah == dataObj.jumlah &&
						dataExist.noRec == dataObj.norec) {
						return true;
				} else {
					return undefined;
				}
			});

				if(isExist == undefined)
				{
					$scope.dataPost.push(dataObj);
				}
				else
				{
					$scope.dataPost =  _.without($scope.dataPost, _.findWhere($scope.dataPost, {
						produkId: dataObj.produkid,
						namaProduk: dataObj.namaproduk,
						jumlah: dataObj.jumlah,
						noRec: dataObj.norec
					}));
				}
			};
			$scope.getProduk=function(){
				$scope.dataId = [];
				$scope.dataNamaProduk= [];
				$scope.dataJumlah= [];
				$scope.dataNoRec= [];
				for (var key in $scope.dataPost) {
					if ($scope.dataPost.hasOwnProperty(key)) {
						var element = $scope.dataPost[key];
						if ( element.produkId != undefined) {
							$scope.dataId.push({"produkId":element.produkId}),
							$scope.dataNamaProduk.push({"namaProduk":element.namaProduk}),
							$scope.dataJumlah.push({"jumlah":element.jumlah}),
							$scope.dataNoRec.push({"noRec":element.noRec})
						}else{
							var confirm = $mdDialog.confirm()
							.title('Peringatan!')
							.textContent('Data belum di pilih?')
							.ariaLabel('Lucky day')
							.ok('OK')

							$mdDialog.show(confirm).then(function() {
								$scope.findData();
							});
						}
					}
				}
			};
			$scope.batalTemp = function () {
				
				var dataInGrid = [];
				$scope.dataSourceTemp = new kendo.data.DataSource({
					pageSize: 5,
					data: dataInGrid
				});
			};

			$scope.batal = function(){
				$state.go('DaftarPenerimaanSterilisasiAlat')
			}

			
			$scope.tambahDataTemp = function () {
				
				if($scope.DataCheck == undefined || $scope.DataCheck == false){
					window.messageContainer.error("Pilih Check Grid Terlebih dahulu !!");
				}{
				    var listRawRequired = [
	      					"item.alatberkarat|ng-model|Alat Berkarat",
	     					"item.kebersihanalat|ng-model|Kebersihan Alat",
	      					"item.kelenturanalat|ng-model|Kelenturan Alat",
	       					"item.keutuhanalat|ng-model|Keutuhan Alat",
	      					"item.warnaalat|ng-model|Warna Alat",
	      					"item.ketajamanalat|ng-model|Ketajaman Alat",
	      					"item.kemampuanmenjepit|ng-model|Kemampuan Menjepit",
	      					"item.kondisialat|ng-model|Kondisi Alat",
	      					"item.kelayakanalat|ng-model|Kelayakan Alat",
	      					"item.linenyangdikemas|ng-model|Linen Yang di kemas",
	      					"item.hasilchemicalindikator|ng-model|Hasil Chemical Indikator",
							"item.hasillabelindikator|ng-model|Hasil Label Indikator",
							"item.tindakan|k-ng-model|Tindakan"
	    			];
			       var isValid = ModelItem.setValidation($scope, listRawRequired);  
 			       if(isValid.status){
 			       		$scope.getProduk();
						if ($scope.item.alatberkarat == 1){
							$scope.alatberkaratname = "Alat Berkarat"
						} else {
							$scope.alatberkaratname = "Tidak Berkarat"
						}
						if ($scope.item.kebersihanalat == 1){
							$scope.kebersihanalatname = "Alat Bersih"
						} else if($scope.item.kebersihanalat == 2) {
							$scope.kebersihanalatname = "Kotor"
						} else {
							$scope.kebersihanalatname = "Ada Darah"
						}
						if ($scope.item.kelenturanalat == 1){
							$scope.kelenturanalatname = "Alat Lentur"
						} else {
							$scope.kelenturanalatname = "Tidak Lentur"
						}
						if ($scope.item.keutuhanalat == 1){
							$scope.keutuhanalatname = "Mur"
						} else {
							$scope.keutuhanalatname = "Baut"
						}
						if ($scope.item.warnaalat == 1){
							$scope.warnaalatname = "Bening"
						} else if($scope.item.warnaalat == 2){
							$scope.warnaalatname = "Buram"
						} else {
							$scope.warnaalatname = "Hitam"
						}
						if ($scope.item.ketajamanalat == 1){
							$scope.ketajamanalatname = "Alat Tajam"
						} else {
							$scope.ketajamanalatname = "Tidak Tajam"
						}
						if ($scope.item.kemampuanmenjepit == 1){
							$scope.kemampuanalatname = "Bisa"
						} else {
							$scope.kemampuanalatname = "Tidak"
						}
						if ($scope.item.kondisialat == 1){
							$scope.kondisialatname = "Alat Kering"
						} else if($scope.item.kondisialat == 2) {
							$scope.kondisialatname = "Basah"
						} else {
							$scope.kondisialatname = "Ada Air"
						}
						if ($scope.item.kelayakanalat == 1){
							$scope.kelayakanalatname = "Layak Pakai"
						} else {
							$scope.kelayakanalatname = "Tidak Layak Pakai"
						}
						if ($scope.item.linenyangdikemas == 1){
							$scope.linenyangdikemasname = "Utuh"
						} else {
							$scope.linenyangdikemasname = "Robek"
						}
						for (var i=0; i<$scope.dataNamaProduk.length;i++){
							var dataTemp = {
								"namaProduk": $scope.dataNamaProduk[i].namaProduk,
								"qty": $scope.dataJumlah[i].jumlah,
								"norec": $scope.dataNoRec[i].norec,
								"produkid": $scope.dataId[i].produkId,
								"alatberkarat" : $scope.item.alatberkarat,
								"kebersihanalat" : $scope.item.kebersihanalat,
								"kelenturanalat" : $scope.item.kelenturanalat,
								"keutuhanalat" : $scope.item.keutuhanalat,
								"warnaalat" : $scope.item.warnaalat,
								"ketajamanalat" : $scope.item.ketajamanalat,
								"kemampuanmenjepit" : $scope.item.kemampuanmenjepit,
								"kondisialat" : $scope.item.kondisialat,
								"kelayakanalat" : $scope.item.kelayakanalat,
								"linenyangdikemas" : $scope.item.linenyangdikemas,
								"jammulaisterilisasi": $scope.item.jammulaisterilisasi,
								"jamselesaisterilisasi": $scope.item.jamselesaisterilisasi,
								"hasilchemicalindikator": $scope.item.hasilchemicalindikator,
								"hasillabelindikator": $scope.item.hasillabelindikator,
								"tindakan": {"id":$scope.item.tindakan.id, "name":$scope.item.tindakan.name},
								"alatberkaratname" : $scope.alatberkaratname,
								"kebersihanalatname" : $scope.kebersihanalatname,
								"kelenturanalatname" : $scope.kelenturanalatname,
								"keutuhanalatname" : $scope.keutuhanalatname,
								"warnaalatname" : $scope.warnaalatname,
								"ketajamanalatname" : $scope.ketajamanalatname,
								"kemampuanalatname" : $scope.kemampuanalatname,
								"kondisialatname" : $scope.kondisialatname,
								"kelayakanalatname" : $scope.kelayakanalatname,
								"linenyangdikemasname" : $scope.linenyangdikemasname
							};
							$scope.dataSourceTemp.add(dataTemp);
							$scope.DataCheck = false;
						}
 				   
 				   }else{
		  	     		 ModelItem.showMessages(isValid.messages);
		           }
				}

			}
			
			$scope.simpan = function () {
				
			var cssdMonitoringEoDetailVO = []
			for (var i=0;i<$scope.dataSourceTemp._data.length;i++){
				var dataTemp =
				{
					"kebersihanalat":$scope.dataSourceTemp._data[i].kebersihanalat,
					"kondisialat":$scope.dataSourceTemp._data[i].kondisialat,
					"kelenturanalat":$scope.dataSourceTemp._data[i].kelenturanalat,
					"ketajamanalat":$scope.dataSourceTemp._data[i].ketajamanalat,
					"alatberkarat":$scope.dataSourceTemp._data[i].alatberkarat,
					"warnaalat":$scope.dataSourceTemp._data[i].warnaalat,
					"kelayakanalat":$scope.dataSourceTemp._data[i].kelayakanalat,
					"kemampuanmenjepit":$scope.dataSourceTemp._data[i].kemampuanmenjepit,
					"keutuhanalat":$scope.dataSourceTemp._data[i].keutuhanalat,
					"linenyangdikemas":$scope.dataSourceTemp._data[i].linenyangdikemas,
					"jammulaisterilisasi":$scope.dataSourceTemp._data[i].jammulaisterilisasi,
					"jamselesaisterilisasi":$scope.dataSourceTemp._data[i].jamselesaisterilisasi,
					"hasilchemicalindikator":$scope.dataSourceTemp._data[i].hasilchemicalindikator,
					"hasillabelindikator":$scope.dataSourceTemp._data[i].hasillabelindikator,
					"tindakan":$scope.dataSourceTemp._data[i].tindakan.id,
					"produk":{
						"id":$scope.dataSourceTemp._data[i].produkid
					},
					"qty":$scope.dataSourceTemp._data[i].qty,
					"norec":$scope.dataSourceTemp._data[i].norec
				}
				cssdMonitoringEoDetailVO.push(dataTemp);
			}
			var data = 
			{
				"strukPelayanan":{
					"noRec":$state.params.strukPelayananId
				},
				"noRec":$scope.dataHeader.norec,
				"tanggal":$scope.item.tanggal,
				"cssdMonitoringEoDetailVO":cssdMonitoringEoDetailVO
			}

			manageLogistikPhp.postpost("cssd-monitoring-eo/save-monitoring-eo/",data).then(function (e) {
				$scope.item = {};
			    $scope.item.jammulaisterilisasi = $scope.now;
			    $scope.item.jamselesaisterilisasi = $scope.now;
				init();
				$scope.batalTemp();
				$scope.dataPost = [];
				$scope.dataSourceTemp._data = [];
				var konfirmasi = $mdDialog.confirm()
				.title("Peringatan!")
				.textContent("Kembali ke Daftar Penerimaan Sterilisasi Alat?")
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