define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PembayaranKembaliDepositKasirCtrl', ['$state', '$q', '$rootScope', '$scope', 'MedifirstService',
		function ($state, $q, $rootScope, $scope, medifirstService) {

			$scope.dataParams = JSON.parse($state.params.dataPasien);

			$scope.item = {};
			$scope.isRouteLoading = true
			$q.all([
				medifirstService.get("kasir/detail-tagihan-pasien?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi)
			])
				.then(function (data) {
					debugger
					$scope.isRouteLoading = false
					if (data[0].statResponse) {
						$scope.item = data[0].data;
						var total = 0
						for (let i = 0; i < data[0].data.detailTagihan.length; i++) {
							const element = data[0].data.detailTagihan[i];
							total = total + element.total
						}
						$scope.item.totalTagihan = total;// $scope.item.jumlahBayar;
						if($scope.item.jumlahBayar<0){
							$scope.item.jumlahBayarFix = $scope.item.jumlahBayar
						}else{
							$scope.item.jumlahBayarFix = total - $scope.item.totalDeposit;//$scope.item.totalDeposit -total// $scope.item.jumlahBayar
						}
						$scope.dataDaftarTagihan = new kendo.data.DataSource({
							data: data[0].data.detailTagihan
						});
					}

				},function(error){
					$scope.isRouteLoading = false
				});

			function showButton() {
				//$scope.showBtnCetak = true;
				//$scope.showBtnBatal = true;
				$scope.showBtnBayar = true;
				$scope.showBtnKembali = true;
			}

			showButton();

			$scope.dataVOloaded = true;
			$scope.now = new Date();



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

			$scope.Cetak = function () {

			}

			$scope.Batal = function () {

			}

			$scope.Bayar = function () {
				var listRawRequired = [
					"item.jumlahBayarFix|ng-model|Jumlah",
				];
				var isValid = medifirstService.setValidation($scope, listRawRequired);

				if (isValid.status) {
					$scope.changePage("PenerimaanPembayaranKasir");
				}
				else {
					medifirstService.showMessages(isValid.messages);
				}
			}

			$scope.changePage = function (stateName) {
				var obj = {
					pageFrom: "PenyetoranDepositKasirKembali",
					jumlahBayar: $scope.item.jumlahBayarFix,
					noRegistrasi: $scope.item.noRegistrasi
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