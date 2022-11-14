define(['initialize'], function (initialize) {
	'use strict';
	// initialize.controller('PermintaanSterilisasiAlatCtrl', ['$rootScope', '$scope', 'ModelItem', 'ManageLogistikPhp', 'ModelItemAkuntansi','DateHelper', '$mdDialog',
	// 	function ($rootScope, $scope, ModelItem, manageLogistikPhp,medifirstService,  DateHelper, $mdDialog) {
		initialize.controller('PermintaanSterilisasiAlatCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper','MedifirstService', '$state',
		function($rootScope, $scope, ModelItem, DateHelper,medifirstService, $state){
			$scope.item = {};
			$scope.isShowPopUp = false;
			$scope.item.tglPermintaan = new Date();
			$scope.now = new Date();
			$scope.dataVOloaded = true;
			$scope.item.jenisPermintaan = 1;
			$scope.jenisPermintaan = [
				{ "id": 1, "name": "Internal" }]
			//keheula
			// manageLogistikPhp.getDataTableTransaksi("cssd-sterilisasi/get-no-urut").then(function (dat) {
			// 	$scope.item.noBundel = dat.data.noUrut;
			// });
			$scope.NoOrderFresh = function () {
				//keheula
				// manageLogistikPhp.getDataTableTransaksi("cssd-sterilisasi/get-no-order").then(function (dat) {
				// 	$scope.item.noOrder = dat.data.noOrderPerbaikan;
				// });
			}
		 $scope.model = function(){
            if ($scope.model.tinggi	== undefined) {
                $scope.model.tinggi == false
            }
            if ($scope.model.rendah == undefined) {
                $scope.model.rendah == false
		        }
		 }
			$scope.listDataSpesifikasi = [
				{id: 1, nama:'Instrumen'}, {id: 2, nama:'Plastik'}, {id: 3, nama:'Karet'}, {id: 4, nama:'Silikon'}, {id: 5, nama:'Kain'}, {id:6, nama:'Kasa'}
			];
			let init = function () {
				$scope.item.BS = '-';
				$scope.item.B = '-';
				$scope.item.S = '-';
				$scope.item.K = '-';
				$scope.item.linen = undefined;
				$scope.item.pouches = undefined;
			}
			init();

			$scope.NoOrderFresh();
			medifirstService.get("CSSD/get-paket").then(function (dat) {
				$scope.listPaket = dat.data;
			});
			medifirstService.get("CSSD/get-produk-cssd").then(function (dat) {
				$scope.listNonPaket = dat.data;
			});
			ComboLoad();
			function ComboLoad () {
               
                medifirstService.get("humas/get-daftar-combo-pegawai-all", true, true, 20).then(function(data) {
                    $scope.listPegawai=data;
                });
                medifirstService.get('rekam-medis/get-ruangan-part', true, true, 10).then(function (e) {
                $scope.listRuangan = e
            	})
                //  medifirstService.getDataDummyPHP("ruangan/get-data-ruangan", true, true, 20).then(function(data) {
                //     $scope.listRuangan=data.ruangan;
                // });
            }
			// $scope.listRuangan = medifirstService.get('ruangan/get-data-ruangan');
			// $scope.listPegawai = medifirstService.get('service/list-generic/?view=Pegawai&select=namaLengkap,id', true);
			$scope.item.waktuSerahTerima = new Date();
			medifirstService.get("CSSD/get-Carasterilisasi").then(function (dat) {
								$scope.dataCheckbox = dat.data;
			});	

			medifirstService.get("CSSD/get-Prosessterilisasi").then(function (dat) {
				$scope.jenisBarang = dat.data;
			});
			$scope.dataPost = [];
			$scope.arrCaraSterilisasi = [];
			$scope.cekCaraSterilisasi = function (listId) {

				var idx = $scope.arrCaraSterilisasi.indexOf(listId);
				// is currently selected
				if (idx > -1) {
					$scope.arrCaraSterilisasi.splice(idx, 1);
				}

				// is newly selected
				else {
					$scope.arrCaraSterilisasi.push({ "idCaraSterilisasi": listId });
				}

				console.log(JSON.stringify($scope.arrCaraSterilisasi));
			};
			$scope.prosesSterilisasiEksternal = [
				{ id: 1, name: "Kemasan Siap Steril" },
				{ id: 2, name: "Pengemasan s/d Steril" },
				{ id: 3, name: "Dekontaminasi s/d Sterilisasi" }]
			$scope.arrInternal = [];
			$scope.arrBarangBersih = [];
			$scope.arrBarangKotor = [];
			$scope.cekArrInternal = function (listId) {
				var idx = $scope.arrInternal.indexOf(listId);

				// is currently selected
				if (idx > -1) {
					$scope.arrInternal.splice(idx, 1);
				}

				// is newly selected
				else {
					$scope.arrInternal.push(listId);
				}
				console.log('list arrInternal : ' + $scope.arrInternal);
			};


			$scope.detailPaket = function () {
				$scope.dataPost = [];
				medifirstService.get("CSSD/get-map_paket-to-produk?idPaket=" + $scope.item.paket.id, true).then(function (dat) {
					// $scope.item.hargaSet = dat.data.data[0].harga;
					$scope.item.hargaSet=0;
					$scope.dataPost = [];
					$scope.dataSourcePaket = dat.data.data;
				});
			}


			$scope.toggleSelectAll = function (ev) {
				// debugger
				var grids = $('#kGrid').data("kendoGrid");
				var grid = $(ev.target).closest("manageLogistikPhp.getDataTableTransaksio-grid]").data("kendoGrid");
				var items = grid.dataSource.data();
				items.forEach(function (item) {
					item.selected = ev.target.checked;
					if (item.selected == true) {
						$scope.pilihBaris(item);
					} else {
						$scope.pilihBaris(item);
					}

				});
			};
			$scope.pilihBaris = function (dataItem) {
				var dataObj = {
					id: dataItem.id,
					namaProduk: dataItem.namaProduk,
					jumlah: dataItem.qty,
					satuan: dataItem.satuanStandar,
					satuanId: dataItem.satuanId,
					harga: dataItem.hargaSatuan
				}

				var isExist = _.find($scope.dataPost, function (dataExist) {
					if (
						dataExist.id == dataObj.id &&
						dataExist.namaProduk == dataObj.namaProduk &&
						dataExist.jumlah == dataObj.jumlah &&
						dataExist.satuan == dataObj.satuan &&
						dataExist.harga == dataObj.harga) {
						return true;
					} else {
						return undefined;
					}
				});

				if (isExist == undefined) {
					//if exist undefined add new array to datapost
					$scope.dataPost.push(dataObj);
				} else {
					//if exist remove array where datapost match
					$scope.dataPost = _.without($scope.dataPost, _.findWhere($scope.dataPost, {
						id: dataObj.id,
						namaProduk: dataObj.namaProduk,
						jumlah: dataObj.jumlah,
						satuan: dataObj.satuan,
						satuanId: dataObj.satuanId,
						harga: dataObj.harga
					}));
				}
			};
			$scope.getProduk = function () {
				// debugger
				$scope.dataId = [];
				$scope.dataNamaProduk = [];
				$scope.dataSatuan = [];
				$scope.dataSatuanId = []
				$scope.dataJumlah = [];
				$scope.dataHarga = [];
				for (var key in $scope.dataPost) {
					if ($scope.dataPost.hasOwnProperty(key)) {
						var element = $scope.dataPost[key];
						if (element.id != undefined) {
							$scope.dataId.push({ "id": element.id }),
								$scope.dataNamaProduk.push({ "namaProduk": element.namaProduk }),
								$scope.dataSatuan.push({ 
									"satuan": element.satuan,
									"satuanId": element.satuanId
								}),
								
								$scope.dataJumlah.push({ "jumlah": element.jumlah }),
								$scope.dataHarga.push({ "harga": element.harga })
						} else {
							var confirm = $mdDialog.confirm()
								.title('Peringatan!')
								.textContent('Data belum di pilih?')
								.ariaLabel('Lucky day')
								.ok('OK')

							$mdDialog.show(confirm).then(function () {
								//$scope.findData();
							});
						}
					}
				}
			};
			$scope.tambahPaket = function () {
				$scope.getProduk();
				if ($scope.item.jenisBarang == undefined) {
					window.messageContainer.error('Pilih Proses Sterilisasi')
				} else if ($scope.item.paket == undefined) {
					window.messageContainer.error('Harap Pilih Paket')
				} else if ($scope.item.spesifikasiPaket == undefined) {
					window.messageContainer.error('Harap Isi Spesifikasi')
				} else if ($scope.dataId.length == 0) {
					window.messageContainer.error('Harap Pilih Barang Yang Akan DiStrerilisasi')
				} else {
					for (var i = 0; i < $scope.dataId.length; i++) {
						/*	if(dataTemp.produkId == $scope.dataId[i].id){*/
						if ($scope.item.jenisBarang == 1) {
							var prosesSteril = "Dekontaminasi s/d Sterilisasi";
						} else if ($scope.item.jenisBarang == 2) {
							var prosesSteril = "Pengemasan s/d Steril";
						} else {
							var prosesSteril = "Kemasan Siap Steril";
						}
						var dataTemp = {
							"produkId": $scope.dataId[i].id,
							"noOrder": $scope.item.noOrder,
							"namaPaket": $scope.item.paket.namapaket,
							"namaBarang": $scope.dataNamaProduk[i].namaProduk,
							"jumlah": $scope.dataJumlah[i].jumlah,
							"satuan": $scope.dataSatuan[i].satuan,
							"satuanId": $scope.dataSatuan[i].satuanId,
							"harga": $scope.item.hargaSet,
							"prosesSterilisasi": prosesSteril,
							"spesifikasi": $scope.item.spesifikasiPaket.nama
						};
						$scope.dataSourceSterelisasi.add(dataTemp);
						// debugger;
						console.log(dataTemp);
					}
				}
			};

			$scope.tambahNonPaket = function () {
				// // debugger
				if ($scope.item.jenisBarang == undefined || $scope.item.jenisBarang == "") {
					window.messageContainer.error('Pilih Proses Sterilisasi');
				}
				else if ($scope.item.barangNonPaket == undefined || $scope.item.barangNonPaket == "") {
					window.messageContainer.error('Pilih Barang Non Paket');
				}
				else if ($scope.item.spesifikasiNonPaket == undefined || $scope.item.spesifikasiNonPaket == "") {
					window.messageContainer.error('Harap Isi spesifikasi');
				}
				else {
					var dataNonPaket = {
						"produkId": $scope.item.barangNonPaket.id,
						"noOrder": $scope.item.noOrder,
						"namaPaket": "NON PAKET",
						"namaBarang": $scope.item.barangNonPaket.namaProduk,
						"jumlah": $scope.item.jumlah,
						"harga": $scope.item.hargaInternal,
						"satuan": $scope.item.barangNonPaket.satuanStandar,
						"prosesSterilisasi": $scope.item.jenisBarang,
						"spesifikasi": $scope.item.spesifikasiNonPaket
					};
					$scope.dataSourceSterelisasi.add(dataNonPaket);
					$scope.item.barangNonPaket = "";
					$scope.item.jumlah = "";
					// $scope.item.hargaInternal = "";
					$scope.item.spesifikasiNonPaket = "";
				}
			}
			$scope.gridPaket = {
				pageable: true,
				columns: [
					{
						width: "50px",
						title: "<center><input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
						template: "<div class='center'><input type='checkbox' class='checkbox' ng-model='dataItem.selected' ng-click='pilihBaris(dataItem)' </div>"
					},
					{ field: "namaProduk", title: "<h3 align=center>Nama Barang Re-Use<h3>" },
					{ field: "qty", title: "<h3 align=center>Jumlah<h3>" },
					{ field: "satuanStandar", title: "<h3 align=center>Satuan<h3>" },
					// { field: "harga", title: "<h3 align=center>Harga<h3>" }
				],
				editable: true
			};
			$scope.dataSourceSterelisasi = new kendo.data.DataSource({
				pageSize: 5,
				data: [],
				batch: true,
				schema: {
					model: {
						fields: {
							noOrder: { editable: false },
							namaPaket: { editable: false },
							namaBarang: { editable: false },
							jumlah: {  validation: { min: 0, required: true } },
							satuan: { editable: false },
							// harga: { editable: true },
							spesifikasi: { editable: false },
							prosesSterilisasi: { editable: false }

						}
					}
				}
			});
			$scope.gridPermintaanSterilisasi = {
				pageable: true,
				toolbar: ["cancel"],
				columns: [
					{ field: "noOrder", title: "<h3 align=center>No Order<h3>", width: 100 },
					{ field: "namaPaket", title: "<h3 align=center>Nama Paket<h3>", width: 100 },
					{ field: "namaBarang", title: "<h3 align=center>Nama Barang<h3>", width: 200 },
					{ field: "jumlah", title: "<h3 align=center>Jumlah<h3>", width: 100 },
					// { field: "satuan", title: "<h3 align=center>Satuan<h3>", width: 100 },
					{ field: "harga", title: "<h3 align=center>Harga<h3>", width: 100 },
					{ field: "spesifikasi", title: "<h3 align=center>Spesifikasi<h3>", width: 100 },
					{ field: "prosesSterilisasi", title: "<h3 align=center>Proses Sterelisasi<h3>", width: 150 },
					{
						command:[
							{
								text: "Hapus",
								click: $scope.removeItemGrid
							}
							// ,{
							// 	text: "Detail",
							// 	click: function(e) {
							// 		e.preventDefault();
							// 		var grid = $('#gridBarangDetail').data('kendoGrid');
							// 		var item = grid.dataItem($(e.target).closest('tr'));
							// 		var popUp = $('#winPopUp').data('kendoWindow');
							// 		popUp.open().center();
							// 		// e.preventDefault();
							// 	}
							// }

						]
						, title: "", width: 100
					}
				],
				editable: true,
				selectable: true
			};
			$scope.mainGridOptionBarang = {
				pageable: true,
				columns: [
					{ field: "namaBarang", title: "<h3 align=center>Nama Barang<h3>", width: 200 },
					{ field: "jumlah", title: "<h3 align=center>Jumlah<h3>", width: 100 },
					{ field: "satuan", title: "<h3 align=center>Satuan<h3>", width: 100 },
				]
				
			}
			$scope.removeItemGrid = function (e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				grid.removeRow(row);
			};
			$scope.simpanInternal = function () {
				var $rendah='';
				var $tinggi='';
				if ($scope.model.tinggi == undefined || $scope.model.tinggi ==false){
					$tinggi=false
				}else{
					$tinggi = true
				}
				if ($scope.model.rendah == undefined || $scope.model.rendah ==false){
					$rendah=false
				}else{
					$rendah = true
				}

				if($scope.item.linen == undefined){
					$scope.item.pouchesBS = $scope.item.BS
					$scope.item.pouchesB = $scope.item.B
					$scope.item.pouchesS = $scope.item.S
					$scope.item.pouchesK = $scope.item.K
				}else{
					$scope.item.linenBS = $scope.item.BS
					$scope.item.linenB = $scope.item.B
					$scope.item.linenS = $scope.item.S
					$scope.item.linenK = $scope.item.K
				}

				var listRawRequired = [
					"item.ruangan|k-ng-model|Ruangan",
					"item.BS|ng-model|Linen/Pouches BS",
					"item.B|ng-model|Linen/Pouches B",
					"item.S|ng-model|Linen/Pouches S",
					"item.K|ng-model|Linen/Pouches K",
					"item.namaPegawai|k-ng-model|Pegawai"
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				var tanggal = DateHelper.getTanggalFormattedNew($scope.item.tglPermintaan)

				// if ($scope.arrCaraSterilisasi.length == 0) {
				// 	window.messageContainer.error('Cara Sterilisasi Belum Dipilih')
				// } else {
					if (isValid.status) {
						var itemSterilisasi = [];
						for (var i = 0; i < $scope.dataSourceSterelisasi._data.length; i++) {
							var dataTemp =
							{
								"produkId":$scope.dataSourceSterelisasi._data[i].produkId,
								"qty": $scope.dataSourceSterelisasi._data[i].jumlah,
								"satuanId":$scope.dataSourceSterelisasi._data[i].satuanId,
								// "harga": $scope.dataSourceSterelisasi._data[i].harga,
								"spesifikasi": $scope.dataSourceSterelisasi._data[i].spesifikasi
							}
							itemSterilisasi.push(dataTemp);
						}
						// {
						// 	"ruanganAsalId":93,
						// 	"noOrder":"000088912",
						// 	"tanggal":"2018-10-29",
						// 	"cssdProsesSterilisasi" : {"id":1},
						// 	"petugasYangMenyerahkan" : {"id":567},
						// 	"cssdSterilisasiDetail": [
						// 		{"produkId":16386,"satuanId":179,"qty":1}, 
						// 		{"produkId":16447,"satuanId":179,"qty":1}
						// 	],
						// 	"cssdCaraSterilisasi":[
						// 		{"idCaraSterilisasi":1},
						// 		{"idCaraSterilisasi":2}
						// 	]
						// }
						var data = {
							"linenBs": $scope.item.linenBS,
							"linenB": $scope.item.linenB,
							"linenS": $scope.item.linenS,
							"linenK": $scope.item.linenK,
							"poucesBs": $scope.item.pouchesBS,
							"poucesB": $scope.item.pouchesB,
							"poucesS": $scope.item.pouchesS,
							"poucesK": $scope.item.pouchesK,
							"noOrder": $scope.item.noOrder,
							"ruanganAsalId": $scope.item.ruangan.id,
							"tanggal": tanggal,
							"cssdProsesSterilisasi": $scope.item.jenisBarang,
					
							"petugasYangMenyerahkan": {
								"id": $scope.item.namaPegawai.id
							},
							// "cssdCaraSterilisasi": $scope.arrCaraSterilisasi,
							"cssCaraSterilisasiSuhutinggi": $tinggi,
							"cssCaraSterilisasiSuhurendah": $rendah,
							"cssdSterilisasiDetail": itemSterilisasi,
							"spesifikasi": $scope.item.spesifikasiPaket.nama
						}
						console.log(JSON.stringify(data))
						medifirstService.post( "CSSD/save-permintaan-cssd",data).then(function (e) {
							$scope.NoOrderFresh();
						});

			  $state.go('home');
						
					} else {
						ModelItem.showMessages(isValid.messages);
					}

			  $state.go('home');

				// }
			}
			$scope.simpanEksternal = function () {
				var listRawRequired = [
					"item.namaRumahSakit|ng-model|Nama Rumah Sakit",
					"item.nama|ng-model|Nama",
					"item.alamat|ng-model|Alamat",
					"item.noTelepon|ng-model|No Telepon",
					"item.linenBS|ng-model|Linen BS",
					"item.linenB|ng-model|Linen B",
					"item.linenS|ng-model|Linen S",
					"item.linenK|ng-model|Linen K",
					"item.pouchesBS|ng-model|Pouches BS",
					"item.pouchesB|ng-model|Pouches B",
					"item.pouchesS|ng-model|Pouches S",
					"item.pouchesK|ng-model|Pouches K",
					"item.namaPegawai|k-ng-model|Pegawai"
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				var tanggal = DateHelper.getTanggalFormattedNew($scope.item.tglPermintaan)

				if ($scope.arrCaraSterilisasi.length == 0) {
					window.messageContainer.error('Cara Sterilisasi Belum Dipilih')
				} else {
					if (isValid.status) {
						var itemSterilisasi = [];
						for (var i = 0; i < $scope.dataSourceSterelisasi._data.length; i++) {
							var dataTemp = {
								"produk": {
									"id": $scope.dataSourceSterelisasi._data[i].produkId
								},
								"qty": $scope.dataSourceSterelisasi._data[i].jumlah,
								"harga": $scope.dataSourceSterelisasi._data[i].harga,
								"spesifikasi": $scope.dataSourceSterelisasi._data[i].spesifikasi
							}
							itemSterilisasi.push(dataTemp);
						}
						if ($scope.item.jenisPermintaan == 1) {
							var jenisCustomer = "internal"
						} else {
							var jenisCustomer = "exsternal"
						}
						var data = {
							"jenisCustomer": jenisCustomer,
							"namaRumahSakit": $scope.item.namaRumahSakit,
							"nama": $scope.item.nama,
							"alamat": $scope.item.alamat,
							"noTelepon": $scope.item.noTelepon,
							"tanggal": tanggal,
							"linenBs": $scope.item.linenBS,
							"linenB": $scope.item.linenB,
							"linenS": $scope.item.linenS,
							"linenK": $scope.item.linenK,
							"poucesBs": $scope.item.pouchesBS,
							"poucesB": $scope.item.pouchesB,
							"poucesS": $scope.item.pouchesS,
							"poucesK": $scope.item.pouchesK,
							"petugasYangMenyerahkan": {
								"id": $scope.item.namaPegawai.id
							},
							"ruangan": {
								"id": ""
							},
							"cssdProsesSterilisasi": {
								"id": parseInt($scope.item.jenisBarang)
							},
							"cssdCaraSterilisasi": $scope.arrCaraSterilisasi,
							"cssdSterilisasiDetail": itemSterilisasi
						}
						medifirstService.post("cssd-sterilisasi/save-cssd-sterilisasi/",data).then(function (e) {
							$scope.NoOrderFresh();
						});
					} else {
						ModelItem.showMessages(isValid.messages);
					}
				}
			}
			$scope.simpan = function () {
				if ($scope.item.jenisPermintaan == 1) {
					$scope.simpanInternal();

			  $state.go('home');


				} else {
					$scope.simpanEksternal();
					
			  $state.go('home');
				}

			  $state.go('home');				
			}
		}
	]);
});


//======================================SOURCE DATA OLD=======================================================//
//ListPaket
/* ManageCSSD.getItem("cssd-permintaan-sterilisasi/get-reload-page", true).then(function(dat){
$scope.listPaket = dat.data.data.comboPaket.listPaket;
});*/

//List Ruangan
/*ManageCSSD.getItem("cssd-permintaan-sterilisasi/find-ruangan-pelayanan/", true).then(function(dat){
$scope.listRuangan = dat.data.data.data;
});*/

/*$scope.dataSourcePaket = new kendo.data.DataSource({
pageSize: 5,
data: $scope.listBarangPaket,
autoSync: true
});*/