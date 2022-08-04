define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiJadwalPelayananDokterCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.isRouteLoading = false;
			loadDataCombo();

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			function loadDataCombo() {
				$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
				$scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')

				medifirstService.getPart("humas/get-daftar-combo-pegawai", true, true, 20).then(function (data) {
					$scope.ListDokter = data;
				});

				medifirstService.get("humas/get-daftar-combo?", true).then(function (dat) {
					$scope.ListRuangan = dat.data.dataruangan;
				});
				LoadData();
			}

			function LoadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm')
				var dokter = "";
				if ($scope.item.dokter != undefined) {
					dokter = $scope.item.dokter.id
				}
				var ruangan = "";
				if ($scope.item.ruangan != undefined) {
					ruangan = $scope.item.ruangan.id
				}
				medifirstService.get("humas/get-daftar-jadwal-dokter?"
					+ "tglAwal=" + tglAwal
					+ "&tglAkhir=" + tglAkhir
					+ "&dokterId=" + dokter
					+ "&ruanganId=" + ruangan, true).then(function (dat) {
						var datas = dat.data.callback;
						$scope.isRouteLoading = false;
						$scope.sourceJadwal = new kendo.data.DataSource({
							data: datas,
							group: [
								{ field: "namaruangan" }
							],
						});
					})
			}

			$scope.columndataMasterDataJadwal = [

				{
					"field": "namalengkap",
					"title": "Nama Dokter",
					"width": "300px"
				},				
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "100px"
				},			
				{
					"field": "tanggaljadwal",
					"title": "Tanggal Praktek",
					"width": "100px"
				},
				{
					"field": "jampraktek",
					"title": "Jam Praktek",
					"width": "100px"

				}

			];

			$scope.SearchData = function () {
				LoadData();
			}
//////////////////////////////////////////////////////////////////////		END		///////////////////////////////////////////////////////////////////////////////////////////
		}
	]);
});