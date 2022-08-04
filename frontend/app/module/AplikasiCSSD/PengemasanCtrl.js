define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PengemasanCtrl', ['$rootScope', '$scope', 'ModelItem',  'ManageLogistikPhp', 'ModelItemAkuntansi', 'DateHelper', '$state','$mdDialog',
		function($rootScope, $scope, ModelItem,  manageLogistikPhp, modelItemAkuntansi, DateHelper, $state,$mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.dataVOloaded = true;
			$scope.item.jamMulai = $scope.now;
			$scope.item.jamAkhir = $scope.now;
			$scope.dataPost = [];
			var init = function () {
				manageLogistikPhp.getDataTableTransaksi("CSSD/get-permintaan-pernoorder?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){
					debugger;
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					$scope.dataGrid.forEach(function (data) {
						if (data.jamAkhir == "-") {
							//data.jamMulai = "-";
							//data.jamAkhir = "-";
							data.jamMulai = $scope.now;
							data.jamAkhir = $scope.now;
						} else {
							var dateAwal = new Date(data.jamMulai);
							var dateAkhir = new Date (data.jamAkhir);
							data.jamMulai = dateAwal;
							data.jamAkhir = dateAkhir;
						}
						
					})	
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 5,
						data: $scope.dataGrid,
						batch: true,
						schema: {
	                        model: {
	                            fields: {
	                                namaProduk: { editable: false},
	                                satuanStandar: { editable: false},
	                                qtyProduk: { editable: false},
	                                jamMulai: { editable: true},
	                                jamSelesai: { editable: true}
	                            }
	                        }
                   		}
					});
					debugger;
					// $scope.item.jumlahCycle = $scope.dataHeader.siklus;
					// $scope.item.jenisHarga = $scope.dataHeader.jenisHarga;
					$scope.item.noorder = $scope.dataHeader.noorder;
					// $scope.item.noBundle = $scope.dataHeader.noBundel;
					$scope.item.ruangan = $scope.dataHeader.namaruangan;
					$scope.item.operator = $scope.dataHeader.namalengkap;
					var tanggal = new Date($scope.dataHeader.tanggal);
					if ($scope.dataHeader.tanggal == undefined || $scope.dataHeader.tanggal == "-") {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = $scope.dataHeader.tanggal;
					}

					if($scope.dataHeader.jammulai == undefined){
						var jamMulai = new Date();
					}else{
						var jamMulai = new Date($scope.dataHeader.jammulai);
					}
					/*var jamMulai = new Date($scope.dataHeader.jamMulai)*/;
					if($scope.dataHeader.jamakhir == undefined){
						var jamAkhir = new Date();
					}else{
						var jamAkhir = new Date($scope.dataHeader.jamakhir);
					}
				});
			};
			init();
			ComboLoad();

			function ComboLoad () {
               
                manageLogistikPhp.getDataTableTransaksi("humas/get-daftar-combo-pegawai-all").then(function(data) {
                    $scope.listPegawai=data;
                });
             //    modelItemAkuntansi.getDataDummyPHP('rekam-medis/get-ruangan-part', true, true, 10).then(function (e) {
             //    $scope.listRuangan = e
            	// })
             //    //  modelItemAkuntansi.getDataDummyPHP("ruangan/get-data-ruangan", true, true, 20).then(function(data) {
                //     $scope.listRuangan=data.ruangan;
                // });
            }

			$scope.batal = function(){
				$state.go('DaftarPenerimaanSterilisasiAlat');
			}
			
			$scope.timeEditor = function(container, options) {
                $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
		            .appendTo(container)
		            .kendoTimePicker({});
            }
			$scope.gridDistribusiInternal = { 
				pageable: true,
				toolbar: ["cancel"],
				columns: [
				{ field:"namaproduk",title:"<center>Nama Barang", width:200},
				{ field:"satuanstandar",title:"<center>Satuan", width:100},
				{ field:"qty",title:"<center>Jumlah", width:100},
				// { field:"jamMulai",title:"<center>Jam Mulai", width:100, format:"{0:HH:mm}", editor: $scope.timeEditor},
				// { field:"jamAkhir",title:"<center>Jam Selesai", width:100, format:"{0:HH:mm}", editor: $scope.timeEditor}
				],
				editable: true
			};
			$scope.simpanInternal = function () {
				debugger;
				var dataPengemasan = []
				for (var i=0;i<$scope.dataSource._data.length;i++){
					var dataTemp =
					{
						"produk": {
					    	"id": $scope.dataSource._data[i].produkId
					    },
					    "qtyProduk": $scope.dataSource._data[i].qtyProduk,
					    "noRec": $scope.dataSource._data[i].noRec,
					    "jamMulai":$scope.dataSource._data[i].jamMulai,
         				"jamSelesai":$scope.dataSource._data[i].jamAkhir
					}
					dataPengemasan.push(dataTemp);
				}
				// var data = 
				// {
				//   "strukPelayanan": {
				//     "noRec": $state.params.strukPelayananId
				//   },
				//   "noRec": $scope.dataHeader.noRec,
				//   "tanggal": $scope.item.tanggal,
				//   "cssdPengemasanDetail": dataPengemasan
				// }
				// var jamawall = $scope.item.jamMulai;
				var data  = {
					"noorder": $scope.item.noorder,
					'jammulai': moment($scope.item.jamMulai).format('HH:mm'),
					"jamakhir": moment($scope.item.jamAkhir).format('HH:mm'),
					"tanggal": $scope.item.tanggal,
					"petugaspenerima": $scope.item.namaPegawai.id
				}
				debugger;
				manageLogistikPhp.postpost("cssd-pengemasan/save-pengemasan",data).then(function (e) {
					init();
					var konfirmasi = $mdDialog.confirm()
					.title("Peringatan!")
					.textContent("Kembali ke daftar Penerimaan Sterilisasi?")
					.ariaLabel("Lucky Day")
					.ok("Ya")
					.cancel("Tidak")
					$mdDialog.show(konfirmasi).then(function(){
						$state.go("DaftarPenerimaanSterilisasiAlat");
					})
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