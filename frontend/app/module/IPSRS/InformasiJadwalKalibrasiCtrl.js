define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiJadwalKalibrasiCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
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
				// medifirstService.getPart("humas/get-daftar-combo-pegawai", true, true, 20).then(function (data) {
				// 	$scope.listdokter = data;
				// });

				// medifirstService.get("humas/get-daftar-combo?", true).then(function (dat) {
				// 	$scope.ListRuangan = dat.data.ruangan;
				// });
				LoadData();
			}
			function getLastDay(y, m) {
                if (m == 2 && y % 4 != 0) {
                    return 28
                }
                else {
                    return 31 + (m <= 7 ? ((m % 2) ? 1 : 0) : (!(m % 2) ? 1 : 0)) - (m == 2) - (m == 2 && y % 4 != 0 || !(y % 100 == 0 && y % 400 == 0));
                }
            }

			function LoadData() {
				// var tglAwal = moment($scope.now).format('YYYY-MM-01 00:00')
				// var tglAkhir = moment($scope.now).format('YYYY-MM')getLastDay(tahun, bulan)
				// var tglAkhir1 = tahun + "-" + bulan + "-" + getLastDay(tahun, bulan)
				var bulan = dateHelper.formatDate($scope.now, "MM")
                var tahun = dateHelper.formatDate($scope.now, "YYYY")
                var tglAwal = tahun + "-" + bulan + "-01 00:00"
                var tglAkhir = tahun + "-" + bulan + "-" + getLastDay(tahun, bulan) + ' 23:59'
				$scope.isRouteLoading = true;

				var dokter = "";
				if ($scope.item.dokter != undefined) {
					dokter = $scope.item.dokter.id
				}
				var ruangan = "";
				if ($scope.item.ruangan != undefined) {
					ruangan = $scope.item.ruangan.id
				}

				medifirstService.get("asset/get-jadwal-kalibrasi?"  + 
            		"tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir, true).then(function (dat) {
						var datas = dat.data;
						$scope.sourceJadwal = new kendo.data.DataSource({
							data: datas,
							group: [
								{ field: "namaproduk" }
							],
						});
						for (var i = 0; i < datas.length; i++) {
							datas[i].no = i + 1
							var datap = {
								"id": datas[i].no,
								"title": datas[i].namaproduk ,
								"namaproduk": datas[i].namaproduk,
								"start": datas[i].start,
								"end": datas[i].ends,
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