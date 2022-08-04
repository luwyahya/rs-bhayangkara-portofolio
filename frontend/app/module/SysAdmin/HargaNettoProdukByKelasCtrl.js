define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('HargaNettoProdukByKelasCtrl', ['$state', '$scope', 'CacheHelper', 'MedifirstService',
		function ($state, $scope, cacheHelper, medifirstService) {
			$scope.item = {};
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			var idSeterusnya = 0;
			$scope.isRouteLoading = false;
			var loginITI = true
			var init = function () {
				var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
				medifirstService.get("sysadmin/master/get-kelompok-user?luId=" + datauserlogin.id, true).then(function (e) {
					if (e.data.data.id != 47)/* KEl USER ITI*/ {
						loginITI = false
					}					
				})			
				$scope.isRouteLoading = true;
				medifirstService.get("sysadmin/master/get-data-combo-master", true).then(function (dat) {
					$scope.listkelas = dat.data.kelas;
				});
				medifirstService.get("sysadmin/master/get-tarif-harganettoprodukbykelas", true).then(function (dat) {
					var no = 0;
					for (var i = 0; i < dat.data.length; i++) {
						no = no + 1;
						dat.data[i].no = no;
					}
					$scope.isRouteLoading = false;

					$scope.listDataMaster = dat.data//.data.data.HargaNettoProdukByKelas;
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.listDataMaster,
						autoSync: true
					});

				});
			}
			init();

			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.gridColumn,
				editable: "popup",
				selectable: "row",
				scrollable: false,
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "20px"
					},
					{
						"field": "objectprodukfk",
						"title": "Id Produk",
						"width": "30px"
					},
					{
						"field": "namaproduk",
						"title": "Nama Produk",
						"width": "240px"
					},
					{
						"field": "asalproduk",
						"title": "Asal Produk",
						"width": "200px"
					},
					{
						"field": "jenistarif",
						"title": "Jenis Tarif",
						"width": "120px"
					},
					{
						"field": "namakelas",
						"title": "Nama Kelas",
						"width": "100px"
					},
					{
						"field": "matauang",
						"title": "Mata Uang",
						"width": "60px"
					},
					{
						"field": "statusenabled",
						"title": "Status Enabled",
						"width": "20px"
					},
					{
						"field": "hargasatuan",
						"title": "Harga Satuan",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
					},
					{
						"field": "jenispelayanan",
						"title": "Jenis Pelayanan",
						"width": "60px"
					},
					
					// {
					// 	"field": "harganetto1",
					// 	"title": "harganetto1",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "harganetto2",
					// 	"title": "harganetto2",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "hargadiscount",
					// 	"title": "hargadiscount",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "persendiscount",
					// 	"title": "persendiscount",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "factorrate",
					// 	"title": "factorrate",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "qtycurrentstok",
					// 	"title": "qtycurrentstok",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "tglberlakuakhir",
					// 	"title": "tglberlakuakhir",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "tglberlakuawal",
					// 	"title": "tglberlakuawal",
					// 	"width": "20px"
					// },
					// {
					// 	"field": "tglkadaluarsalast",
					// 	"title": "tglkadaluarsalast",
					// 	"width": "20px"
					// },
					{
						"command": [{
							text: "Hapus",
							click: hapusData,
							imageClass: "k-icon k-delete"
						}],
						title: "",
						width: "100px",
					}

				]
			};


			function hapusData(e) {
				if (loginITI ==false){
					toastr.error('Tidak Bisa Menghapus Data','Info')
					return
				}
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post('sysadmin/master/hapus-tarif-harganetto',itemDelete).then(function (e) {
					if (e.status === 201) {
						init();

						grid.removeRow(row);
					}
				})

			}

			$scope.klik = function (current) {
				idSeterusnya = current.id;				
			};

			// $scope.disableData = function () {
			// 	IPSRSService.getClassMaster("delete-master-table?className=HargaNettoProdukByKelas&&id=" + $scope.item.id + "&&statusEnabled=false").then(function (dat) {
			// 		//init();
			// 		Carii();
			// 	});
			// };
			// $scope.enableData = function () {
			// 	IPSRSService.getClassMaster("delete-master-table?className=HargaNettoProdukByKelas&&id=" + $scope.item.id + "&&statusEnabled=true").then(function (dat) {
			// 		//init();
			// 		Carii();
			// 	});
			// };

			function HakEditHapus (){
			
			}

			$scope.edit = function () {
				if (loginITI ==false){
					toastr.error('Tidak Bisa Merubah Data','Info')
					return
				}
				cacheHelper.set('HargaNettoProdukByKelasEdit', idSeterusnya);
				$state.go('HargaNettoProdukByKelasEdit')
			}

			$scope.tambah = function () {
				if (loginITI ==false){
					toastr.error('Tidak Bisa Menambah Data','Info')
					return
				}
				cacheHelper.set('HargaNettoProdukByKelasEdit', 'fsdjhfkjdshfusfhsdfhsk');
				$state.go('HargaNettoProdukByKelasEdit')
			}

			
			$scope.CariProduk = function () {
				Carii();
			}

			$scope.CariKodeProduk = function () {
				Carii();
			}

			$scope.CariProdukCombo = function () {				
				var nmP = "";
				if ($scope.item.produk != undefined) {
					nmP = 'namaproduk=' + $scope.item.produk.namaProduk;
				}
				medifirstService.get("sysadmin/master/get-tarif-produk?" + nmP).then(function (dat) {
					$scope.listproduk = dat;
				});
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			}

			$scope.Cari = function () {
				Carii();
			}

			function Carii() {
				$scope.isRouteLoading = true;
				var nmP = "";
				if ($scope.item.cariProduk != undefined) {
					nmP = 'namaproduk=' + $scope.item.cariProduk;
				}
				var nmkP = "";
				if ($scope.item.kodeProduk != undefined) {
					nmkP = '&objectprodukfk=' + $scope.item.kodeProduk;
				}
				var idKelas = "";
				if ($scope.item.kelas != undefined) {
					idKelas = '&objectkelasfk=' + $scope.item.kelas.id;
				}
				medifirstService.get("sysadmin/master/get-tarif-harganettoprodukbykelas?" + nmP + nmkP + idKelas, true).then(function (dat) {
					var no = 0;
					for (var i = 0; i < dat.data.length; i++) {
						no = no + 1;
						dat.data[i].no = no;
					}
					$scope.isRouteLoading = false;
					$scope.listDataMaster = dat.data//.data.data.HargaNettoProdukByKelas;
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.listDataMaster,
						autoSync: true

					});

				});
			}
		}
	]);
});

