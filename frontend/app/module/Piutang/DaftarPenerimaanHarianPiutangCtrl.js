define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPenerimaanHarianPiutangCtrl', ['$scope', 'MedifirstService', '$state', 'DateHelper', 'CacheHelper',
		function ($scope, medifirstService, $state, dateHelper, cacheHelper) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.tanggalAwal = new Date();
			$scope.item.tanggalAkhir = new Date();
			loadCache();

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			};

			function simpanCache() {
				//SIMPAN CAHCE
				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				var chaceFilter = tglAwal1 + "~" + tglAkhir1 + "~"// + jt + "~" + nr + "~"
				cacheHelper.set('filterHistory', chaceFilter);
				///END
			};

			function loadCache() {
				//ON LOAD with Params
				var chaceFilter = cacheHelper.get('filterHistory');
				if (chaceFilter != undefined) {
					////debugger;
					var arrPeriode = chaceFilter.split('~');
					$scope.item.tanggalAwal = new Date(arrPeriode[0]);
					$scope.item.tanggalAkhir = new Date(arrPeriode[1]);
					loadData()
				}
				else {
					$scope.item.tanggalAwal = $scope.now;
					$scope.item.tanggalAkhir = $scope.now;
				};
				///END/// ON LOAD with Params
			}

			function loadData() {
				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				medifirstService.get("bendaharapenerimaan/get-daftar-penerimaan-bank?tglAwal=" + tglAwal1
					+ "&tglAkhir=" + tglAkhir1 + "&jenisTransaksiLike=64").then(function (dat) {
						var data = dat.data;
						$scope.dataSource = new kendo.data.DataSource({
							data: data
						});
					});
			};

			$scope.columnGrid = [
				{
					"field": "noStruk",
					"title": "No Struk",
					"width": "100px",
					"template": "<span class='style-center'>#: noStruk #</span>"
				},
				{
					"field": "tglStruk",
					"title": "Tanggal Struk",
					"width": "100px",
					"template": "<span class='style-center'>#: tglStruk #</span>"
				},
				{
					"field": "keterangan",
					"title": "Keterangan",
					"width": "200px"
				},
				{
					"field": "jenisTransaksi",
					"title": "Jenis Transaksi",
					"width": "150px",
					"template": "<span class='style-center'>#: jenisTransaksi #</span>"
				},
				{
					"field": "totalSetor",
					"title": "Total",
					"width": "150px",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSetor #', 'Rp. ')}}</span>"
				},
				{
					"field": "status",
					"title": "Status",
					"width": "100px"
				}
			];

			$scope.SearchData = function () {
				loadData();
				simpanCache()
			};

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			};

			$scope.Kompensasi = function () {
				if ($scope.dataSelected.status == '-') {
					$scope.changePage("PembayaranPiutang");
				} else {
					alert("Sudah Di Kompensasi!");
					return;
				}

			};

			$scope.changePage = function (stateName) {
				//debugger;
				var noSetorr = "No Data !!"
				if ($scope.dataSelected != undefined) {
					noSetorr = $scope.dataSelected.noStruk
				};

				var chaceFilter = "DaftarPenerimaanHarianPiutang" + "~" + noSetorr + "~" + $scope.dataSelected.tglStruk + "~" + $scope.dataSelected.jenisTransaksi + "~" + $scope.dataSelected.totalSetor + "~" + $scope.dataSelected.keterangan
				cacheHelper.set('PembayaranPiutangCache', chaceFilter)
				$state.go(stateName, { noSetor: noSetorr });
			};
			///////////////////////////////////// -TAMAT- /////////////////////////////////////////////////
		}
	]);
});