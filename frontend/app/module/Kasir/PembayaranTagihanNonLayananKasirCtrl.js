define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PembayaranTagihanNonLayananKasirCtrl', ['$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'MedifirstService',
		function ($state, $q, $rootScope, $scope, cacheHelper, medifirstService) {
			var data = cacheHelper.get('PembayaranTagihanNonLayananKasir');
			if (data !== undefined) {
				var splitResultData = data.split("#");
				var noRegistrasi2 = splitResultData[0]
				var cmdBayar = splitResultData[1]
				var dariSini = splitResultData[2]
			}
			$scope.item = {};

			$q.all([
				medifirstService.get("kasir/detail-tagihan-non-layanan?noRec=" + noRegistrasi2)
			])
				.then(function (data) {

					if (data[0].statResponse) {
						$scope.item = data[0].data;
						// $scope.item.totalTagihan = $scope.item.jumlahBayar;
						// $scope.item.jumlahBayarFix = $scope.item.jumlahBayar - $scope.item.totalDeposit;
						$scope.dataDaftarTagihan = new kendo.data.DataSource({
							data: data[0].data.detailTagihan
						});
					}

				});

			function showButton() {
				//$scope.showBtnCetak = true;
				debugger;
				$scope.showBtnBack = true;
				if (cmdBayar == "0") {
					$scope.showBtnBayar = true;
				}
				if (cmdBayar == "1") {
					$scope.showBtnBayar = false;
				}

				//$scope.showBtnTutup = true;
			}

			showButton();

			$scope.Back = function () {
				switch (dariSini) {
					case "PembayaranTagihanLayananKasir":
						if ($scope.showBtnSimpan) {
							$scope.changePage("PembayaranTagihanLayananKasir");
						}
						else {
							$state.go("DaftarPasienPulangKasir", {});
						}
						break;
					case "PembayaranTagihanNonLayananKasir":
						$scope.changePage("PembayaranTagihanNonLayananKasir");
						break;
					case "DaftarNonLayananKasir":
						$scope.changePage("DaftarNonLayananKasir");
						break;
					case "DaftarPenjualanApotekKasir/terimaUmum":
						$state.go("DaftarPenjualanApotekKasir", { dataFilter: "terimaUmum" });
						break;
					case "DaftarPenjualanApotekKasir/obatBebas":
						$state.go("DaftarPenjualanApotekKasir", { dataFilter: "obatBebas" });
						break;
					case "DaftarPenjualanApotekKasir/keluarUmum":
						$state.go("DaftarPenjualanApotekKasir", { dataFilter: "keluarUmum" });
						break;
					case "PenyetoranDepositKasir":
						$scope.changePage("PenyetoranDepositKasir");
						break;
					case "PembayaranPiutangKasir":
						if ($scope.showBtnSimpan) {
							$scope.changePage("PembayaranPiutangKasir");
						}
						else {
							$state.go("DaftarPiutangKasir", {});
						}
						break;
				}

				//$state.go(dariSini)
			};

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			// $scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 	data: []
			// });
			$scope.columnDaftarTagihan = [
				{
					"field": "namaLayanan",
					"title": "Tagihan",
					"width": "300px"
				},
				{
					"field": "keterangan",
					"title": "Keterangan",
					"width": "300px"
				},
				{
					"field": "jumlah",
					"title": "Qty",
					"width": "50px"
				},
				{
					"field": "qtyoranglast",
					"title": "Qty Per Org/ Per Km",
					"width": "175px"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width": "100px"
				},
				{
					"field": "totalK",
					"title": "Total",
					"width": "100px"
				}
			];

			$scope.Cetak = function () {

			}

			$scope.Batal = function () {

			}

			$scope.Bayar = function () {
				$scope.changePage("PenerimaanPembayaranKasir");
			}

			$scope.changePage = function (stateName) {
				var obj = {
					pageFrom: dariSini,//"PembayaranTagihanNonLayananKasir",
					noRegistrasi: noRegistrasi2
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.Tutup = function () {

			}

		}
	]);
});