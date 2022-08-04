define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PenyimpananCtrl', ['$rootScope', '$scope', 'ModelItem', 'ManageLogistikPhp', 'ModelItemAkuntansi', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem, manageLogistikPhp,modelItemAkuntansi, DateHelper, $state, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.waktuMulai = $scope.now;
			$scope.item.waktuSelesai = $scope.now;
			$scope.dataVOloaded = true;
			$scope.dataPost = [];
			var init = function () {
				modelItemAkuntansi.getDataDummyPHP("humas/get-daftar-combo-pegawai-all", true, true, 20)
				manageLogistikPhp.getDataTableTransaksi("CSSD/get-penyimpanan-permintaan-pernoorder?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
					debugger;
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					$scope.dataGrid.forEach(function (data) {
						if (data.autoclavetape == "" || data.autoclavetape == null ) {
							data.autoclavetape= "";
							data.label = "";
							data.indikatorinternal = "";
							data.indikatorexternal = "";
							data.bowidick = "";
							data.attest = "";
							data.kemasan = "";
						} else {
							if (data.autoclavetape == 1){
								data.autoClavetapename = "Berubah"
							} else {
								data.autoclavetapename = "Tidak"
							}
							if (data.label == 1){
								data.labelname = "Berubah"
							} else {
								data.labelname = "Tidak"
							}
							if (data.indikatorinternal == 1){
								data.indicatorinternalname = "Berubah"
							} else {
								data.indicatorinternalname = "Tidak"
							}
							if (data.indikatorexternal == 1){
								data.indicatorexternalname = "Berubah"
							} else {
								data.indicatorexternalname = "Tidak"
							}
							if (data.bowidick == 1){
								data.bowidickname = "Berubah"
							} else {
								data.bowidickname = "Tidak"
							}
							if (data.attest == 1){
								data.attestname = "Berubah"
							} else {
								data.attestname = "Tidak"
							}
							if (data.kemasan == 1){
								data.kemasanname = "Baik"
							} else {
								data.kemasanname = "Tidak Baik"
							}
						}
					})
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 5,
						data: $scope.dataGrid,
						autoSync: true
					});
					$scope.item.noOrder = $scope.dataHeader.noorder;
					$scope.item.ruangan = $scope.dataHeader.namaruangan;
					$scope.item.operator = $scope.dataHeader.namalengkap;
					var tanggal = new Date($scope.dataHeader.tanggal);
					var jamMulai = new Date($scope.dataHeader.jammulai);
					var jamSelesai = new Date($scope.dataHeader.jamakhir);
					if ($scope.dataHeader.jammulai == undefined || $scope.dataHeader.jammulai == "-") {
						$scope.item.jamMulai = $scope.dataHeader.jammulai;
						$scope.item.jamSelesai = $scope.dataHeader.jamakhir;
					} else {
						$scope.item.waktuMulai = jamMulai;
						$scope.item.waktuSelesai = jamSelesai;
					}

					if ($scope.dataHeader.tanggal == undefined || $scope.dataHeader.tanggal == "-") {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = tanggal;
					}

				});
			};
			init();

			$scope.batalTemp = function(){
				var DataGrid = [];
				$scope.dataSourceIndikator = new kendo.data.DataSource({
					pageSize : 5,
					data : DataGrid
				});
			}

		    $scope.batal = function(){
		    	$state.go('DaftarPenerimaanSterilisasiAlat');
		    }

		    $scope.ketautoclave = [
			{"id":1, "name":"Berubah"},
			{"id":2, "name":"Tidak"},
			];

			$scope.ketlabel = [
			{"id":1, "name":"Berubah "},
			{"id":2, "name":"Tidak "}
			];

			$scope.ketindikatorinternal = [
			{"id":1, "name":"Berubah  "},
			{"id":2, "name":"Tidak  "}
			];

			$scope.ketindikatorexternal = [
			{"id":1, "name":"Berubah        	"},
			{"id":2, "name":"Tidak               "}
			];

			$scope.ketbowidick = [
			{"id":1, "name":"Berubah   "},
			{"id":2, "name":"Tidak   "}
			];

			$scope.ketattest = [
			{"id":1, "name":"Berubah    "},
			{"id":2, "name":"Tidak    "}
			];

			$scope.ketkemasan = [
			{"id":1, "name":"Berubah     "},
			{"id":2, "name":"Tidak Baik     "}
			];

			$scope.gridPenyimpanan = { 
				pageable: true,
				columns: [
				{
					width: "50px",
					title:  "<center><input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
					template: "<div class='center'><input type='checkbox' class='checkbox' ng-model='dataItem.selected' ng-click='pilihBaris(dataItem)' </div>"
				},
				{ field:"namaproduk",title:"<center>Nama Barang", width:150},
				{ field:"qty",title:"<center>Jumlah", width:50},
				{ field:"satuanstandar",title:"<center>Satuan", width:50},
				{ field:"hasilindikator",title:"<center>Hasil Indikator",
				columns: [
					{ field:"autolavetapename",title:"<center>Auto Clave Tape", width: 100},
					{ field:"labelname",title:"<center>Label", width: 100},
					{ field:"indicatorinternalname",title:"<center>Indicator Internal", width: 100},
					{ field:"indicatorexternalname",title:"<center>Indicator External", width: 100},
					{ field:"bowidickname",title:"<center>Bowidick", width: 100},
					{ field:"attestname",title:"<center>Attest", width: 100},
					{ field:"kemasanname",title:"<center>Kemasan", width: 100}
				]	
				}
				],
				editable: false,
				selectable: true
			};
			$scope.gridIndikator = { 
				pageable: true,
				columns: [
				{ field:"no",title:"<center>No", width: 40},
				{ field:"namaproduk",title:"<center>Nama Barang", width: 150},
				{ field:"qty",title:"<center>Jumlah", width: 100},
				{ field:"satuanstandar",title:"<center>Satuan", width: 100},
				{ field:"hasilIndikator",title:"<center>Hasil Indikator",
				columns: [
					{ field:"autoclavetapename",title:"<center>Auto Clave Tape", width: 100},
					{ field:"labelname",title:"<center>Label", width: 100},
					{ field:"indikatorinternalname",title:"<center>Indicator Internal", width: 100},
					{ field:"indikatorexternalname",title:"<center>Indicator External", width: 100},
					{ field:"bowidickname",title:"<center>Bowidick", width: 100},
					{ field:"attestname",title:"<center>Attest", width: 100},
					{ field:"kemasanname",title:"<center>Kemasan", width: 100}
				]	
				},
				{ command: 
					{
						text: "Hapus",
						click: $scope.removeItemGrid
					}, 
					title:"",
					width:100
				}
				],
				editable: false
			};
		$scope.klik = function(current){
			$scope.current = current;
			$scope.item.autoclavetape = current.autoclavetape;
			$scope.item.autoclavetapename = current.autoclavetapename;
			$scope.item.label = current.label;
			$scope.item.labelname = current.labelname;
			$scope.item.indikatorinternal = current.indikatorinternal;
			$scope.item.indikatorinternalname = current.indikatorinternalname;
			$scope.item.indikatorexternal = current.indikatorexternal;
			$scope.item.indikatorexternalname = current.indikatorexternalname;
			$scope.item.bowidick = current.bowidick;
			$scope.item.bowidickname = current.bowidickname;
			$scope.item.attest = current.attest;
			$scope.item.attestname = current.attestname;
			$scope.item.kemasan = current.kemasan;
			$scope.item.kemasanname = current.kemasanname;
		};
		$scope.removeItemGrid = function(e) {
			e.preventDefault();
			var grid = this;
			var baris = $scope.dataSourceIndikator.data();
			var row = $(e.currentTarget).closest("tr");
			grid.removeRow(row);
		};
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
			var dataObj = {
				produkId : dataItem.produkid,
				namaProduk : dataItem.namaproduk,
				jumlah : dataItem.qty,
				satuan : dataItem.satuanstandar,
				noRec : dataItem.norec
			}

			var isExist = _.find($scope.dataPost, function(dataExist){ 
				if (
					dataExist.produkId == dataObj.produkId &&
					dataExist.namaProduk == dataObj.namaProduk &&
					dataExist.jumlah == dataObj.jumlah &&
					dataExist.satuan == dataObj.satuan &&
					dataExist.noRec == dataObj.noRec) {
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
					produkId: dataObj.produkId,
					namaProduk: dataObj.namaProduk,
					jumlah: dataObj.jumlah,
					satuan: dataObj.satuan,
					noRec: dataObj.noRec
				}));
			}


		};
		$scope.getProduk=function(){
			$scope.dataId = [];
			$scope.dataNamaProduk= [];
			$scope.dataSatuan= [];
			$scope.dataJumlah= [];
			$scope.dataNoRec= [];
			for (var key in $scope.dataPost) {
				if ($scope.dataPost.hasOwnProperty(key)) {
					var element = $scope.dataPost[key];
					if ( element.produkId != undefined) {
						$scope.dataId.push({"produkId":element.produkId}),
						$scope.dataNamaProduk.push({"namaProduk":element.namaProduk}),
						$scope.dataSatuan.push({"satuan":element.satuan}),
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
		$scope.dataSourceIndikator = new kendo.data.DataSource({
			pageSize: 5,
			data: []
		});
		$scope.tambahHasil = function () {
			$scope.getProduk();
			if ($scope.dataId.length == 0) {
				window.messageContainer.error('Silahkan Pilih Produk atau Barang')
			} else {
				var listRawRequired = [
				"item.autoclavetape|k-ng-model|Auto Clave Tape",
				"item.label|k-ng-model|label",
				"item.indikatorinternal|k-ng-model|Indicator Internal",
				"item.indikatorexternal|k-ng-model|Indicator External",
				"item.bowidick|k-ng-model|Bowidick",
				"item.attest|k-ng-model|Attest",
				"item.kemasan|k-ng-model|Kemasan"
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if(isValid.status){
					$scope.getProduk();
					if ($scope.item.autoclavetape == 1){
						$scope.item.autoclavetapename = "Berubah"
					} else {
						$scope.item.autoclavetapename = "Tidak"
					}
					if ($scope.item.label == 1){
						$scope.item.labelname = "Berubah"
					} else {
						$scope.item.labelname = "Tidak"
					}
					if ($scope.item.indikatorinternal == 1){
						$scope.item.indikatorinternalname = "Berubah"
					} else {
						$scope.item.indikatorinternalname = "Tidak"
					}
					if ($scope.item.indikatorexternal == 1){
						$scope.item.indikatorexternalname = "Berubah"
					} else {
						$scope.item.indikatorexternalname = "Tidak"
					}
					if ($scope.item.bowidick == 1){
						$scope.item.bowidickname = "Berubah"
					} else {
						$scope.item.bowidickname = "Tidak"
					}
					if ($scope.item.attest == 1){
						$scope.item.attestname = "Berubah"
					} else {
						$scope.item.attestname = "Tidak"
					}
					if ($scope.item.kemasan == 1){
						$scope.item.kemasanname = "Baik"
					} else {
						$scope.item.kemasanname = "Tidak Baik"
					}
					var number = 1;
					for (var i=0; i<$scope.dataId.length;i++){
						var dataTemp = {
							"no": number++,
							"namaproduk": $scope.dataNamaProduk[i].namaProduk,
							"qty": $scope.dataJumlah[i].jumlah,
							"satuanstandar": $scope.dataSatuan[i].satuan,
							"norec": $scope.dataNoRec[i].noRec,
							"produk":{
								"id":$scope.dataId[i].produkId
							},
							"qtyProduk":$scope.dataJumlah[i].jumlah,
							"noRec":$scope.dataNoRec[i].noRec,
							"autoclavetape":$scope.item.autoclavetape,
							"autoclavetapename":$scope.item.autoclavetapename,
								"label":$scope.item.label,
								"labelname":$scope.item.labelname,
								"indikatorinternal":$scope.item.indikatorinternal,
								"indikatorinternalname":$scope.item.indikatorinternalname,
								"indikatorexternal":$scope.item.indikatorexternal,
								"indikatorexternalname":$scope.item.indikatorexternalname,
								"bowidick":$scope.item.bowidick,
								"bowidickname":$scope.item.bowidickname,
								"attest":$scope.item.attest,
								"attestname":$scope.item.attestname,
								"kemasan":$scope.item.kemasan,
								"kemasanname":$scope.item.kemasanname,
						};
						$scope.dataSourceIndikator.add(dataTemp);
					}
					//loadGrid();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
		}
		$scope.simpan = function () {
			var dataCssdPenyimpananDetail = []
			debugger;
			for (var i=0;i<$scope.dataSourceIndikator._data.length;i++){
				var dataTemp =
				{
					"produk":{
						"id":$scope.dataSourceIndikator._data[i].produk.id
					},
					"qty":$scope.dataSourceIndikator._data[i].jumlah,
					"noRec":$scope.dataSourceIndikator._data[i].noRec,
					"autoclavetape":$scope.dataSourceIndikator._data[i].autoclavetape,
					"autoclavetapename":$scope.dataSourceIndikator._data[i].autoclavetapename,
					"label":$scope.dataSourceIndikator._data[i].label,
					"labelname":$scope.dataSourceIndikator._data[i].labelname,
					"indikatorinternal":$scope.dataSourceIndikator._data[i].indikatorinternal,
					"indikatorinternalname":$scope.dataSourceIndikator._data[i].indikatorinternalname,
					"indikatorexternal":$scope.dataSourceIndikator._data[i].indikatorexternal,
					"indikatorexternalname":$scope.dataSourceIndikator._data[i].indikatorexternalname,
					"bowidick":$scope.dataSourceIndikator._data[i].bowidick,
					"bowidickname":$scope.dataSourceIndikator._data[i].bowidickname,
					"attest":$scope.dataSourceIndikator._data[i].attest,
					"attestname":$scope.dataSourceIndikator._data[i].attestname,
					"kemasan":$scope.dataSourceIndikator._data[i].kemasan,
					"kemasanname":$scope.dataSourceIndikator._data[i].kemasanname
				}
				dataCssdPenyimpananDetail.push(dataTemp);
			}
			var data = 
			{
				"strukPelayanan":{
					"noRec":$state.params.strukPelayananId
				},
				"noRec":$scope.dataHeader.norec,
				"tanggal": $scope.item.tanggal,
				// "jamMulai":$scope.item.waktuMulai,
				// "jamSelesai":$scope.item.waktuSelesai,
				'jammulai': moment($scope.item.waktuMulai).format('HH:mm'),
				"jamakhir": moment($scope.item.waktuSelesai).format('HH:mm'),
				"cssdPenyimpananDetail":dataCssdPenyimpananDetail
			}
			manageLogistikPhp.postpost("cssd-penyimpanan/save-penyimpanan/",data).then(function (e) {
				init();
				$scope.item.autoClaveTape = "";
				$scope.item.label = "";
				$scope.item.indicatorInternal = "";
				$scope.item.indicatorExternal = "";
				$scope.item.bowidick = "";
				$scope.item.attest = "";
				$scope.item.kemasan = "";
				$scope.dataGridHasil = [];
				var konfirmasi = $mdDialog.confirm()
				.title("Peringatan!")
				.textContent("Kembali ke Daftar Penerimaan Sterilisasi Alat?")
				.ariaLabel("Lucky Day")
				.ok("Ya")
				.cancel("Tidak")
				$mdDialog.show(konfirmasi).then(function(){
					$state.go("DaftarPenerimaanSterilisasiAlat");
				})
				//loadGrid();
			});
		}
	}
	]);
});