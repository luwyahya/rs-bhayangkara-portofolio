define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiJadwalDokterCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.grishoW = false;
			$scope.now = new Date();
			var startTimes = "01-01-" + moment($scope.now).format('YYYY');
			var startDate = "01-" + moment($scope.now).format('MM-YYYY');
			var dates = moment(startTimes).format('YYYY-MM-DD');
			var Awal = moment($scope.now).format('YYYY-MM-DD 00:00')
			var Akhir = moment($scope.now).format('YYYY-MM-DD 23:59')
			var datatemp = [];
			$scope.isRouteLoading = false;
			loadDataCombo();


			function loadDataCombo() {
				medifirstService.getPart("humas/get-daftar-combo-pegawai", true, true, 20).then(function (data) {
					$scope.listdokter = data;
				});

				medifirstService.get("humas/get-daftar-combo?", true).then(function (dat) {
					$scope.ListRuangan = dat.data.ruangan;
				});
				LoadData();
			}

			function LoadData() {
				var tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
				var tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
				$scope.isRouteLoading = true;

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
						$scope.sourceJadwal = new kendo.data.DataSource({
							data: datas,
							group: [
								{ field: "namaruangan" }
							],
						});
						for (var i = 0; i < datas.length; i++) {
							datas[i].no = i + 1
							var datap = {
								"id": datas[i].no,
								"title": datas[i].namaruangan + ' ' + ':' + ' ' + datas[i].namalengkap,
								"namalengkap": datas[i].namalengkap,
								"namaruangan": datas[i].namaruangan,
								"start": datas[i].start,
								"end": datas[i].end,
							}
							datatemp.push(datap);
						}

						$scope.schedulerOptions = {
							date: new Date(Awal),
							height: 600,
							views: [
								"agenda",
								{ type: "month", selected: true, allDaySlot: false },
								{ selectedDateFormat: "{0:dd-MM-yyyy}" }
							],
							dataSource: datatemp,
						};
						$scope.isRouteLoading = false;
					});
			}

			$scope.columndata = [
				{
					"field": "namalengkap",
					"title": "Dokter",
					"width": "120px"
				},
				{
					"field": "start",
					"title": "Jadwal Awa",
					"width": "120px"
				},
				{
					"field": "end",
					"title": "Jadwal Akhir",
					"width": "100px"

				}
			];

			$scope.SearchData = function () {
				LoadData();
			}



























		}
	]);
});