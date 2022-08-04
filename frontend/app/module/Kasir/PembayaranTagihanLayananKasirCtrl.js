define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PembayaranTagihanLayananKasirCtrl', ['$state', '$q', '$scope', 'MedifirstService',
		function ($state, $q, $scope, medifirstService) {
			$scope.dataParams = JSON.parse($state.params.dataPasien);
			$scope.now = new Date();
			$scope.item = {};
			var tampungruangan = '';
			$scope.isRouteLoading = true
			showButton();
			$q.all([
				medifirstService.get("kasir/detail-tagihan-pasien?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi)])
				.then(function (data) {
					debugger
					tampungruangan = data[0].data.detailTagihan[0].ruangan
					$scope.isRouteLoading = false
					if (data[0].statResponse) {
						$scope.item = data[0].data;
						var totalPRekanan = 0
						if (data[0].data.totalPenjamin != undefined) {
							totalPRekanan = parseFloat(data[0].data.totalPenjamin)
						}
						var total = 0
						for (let i = 0; i < data[0].data.detailTagihan.length; i++) {
							const element = data[0].data.detailTagihan[i];
							total = total + element.total
						}
						$scope.item.totalTagihan = total// $scope.item.jumlahBayar;
						// $scope.item.jumlahBayarFix = total-$scope.item.totalDeposit-totalPRekanan;
						$scope.item.jumlahBayarFix = $scope.item.jumlahBayar;
						$scope.item.jumlahDiJamin = totalPRekanan;
						$scope.dataDaftarTagihan = new kendo.data.DataSource({
							data: data[0].data.detailTagihan
						});
						// $scope.item = data[0].data;
						// $scope.item.totalTagihan = $scope.item.jumlahBayar;
						// $scope.item.jumlahBayarFix = $scope.item.jumlahBayar - $scope.item.totalDeposit;
						// $scope.dataDaftarTagihan = new kendo.data.DataSource({
						// 	data: data[0].data.detailTagihan
						// });
					}

				}, function (error) {
					$scope.isRouteLoading = false
				});

			function showButton() {
				$scope.showBtnBayar = true;
				$scope.showBtnKembali = true;
			}

			$scope.columnDaftarTagihan = [
				{
					"field": "namaLayanan",
					"title": "Layanan",
					"width": "200px",
					"template": "<span class='style-left'>#: namaLayanan #</span>"
				},
				{
					"field": "jumlah",
					"title": "Jumlah",
					"width": "50px",
					"template": "<span class='style-right'>#: jumlah #</span>"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width": "150px",
					"template": "<span class='style-right'>{{formatRupiah('#: harga #', 'Rp.')}}</span>"
				},
				{
					"field": "diskon",
					"title": "Harga Diskon",
					"width": "150px",
					"template": "<span class='style-right'>{{formatRupiah('#: diskon #', 'Rp.')}}</span>"
				},
				{
					"field": "total",
					"title": "Total",
					"width": "150px",
					"template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>"
				}
			];

			$scope.Bayar = function () {
				$scope.changePage("PenerimaanPembayaranKasir");
			}

			$scope.changePage = function (stateName) {
				debugger
				var obj = {
					pageFrom: "PembayaranTagihanLayananKasir",
					noRegistrasi: $scope.dataParams.noRegistrasi,
					ruangan: tampungruangan
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}


			$scope.Kembali = function () {
				$state.go('DaftarPasienPulangKasir', {});
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

		}
	]);
});