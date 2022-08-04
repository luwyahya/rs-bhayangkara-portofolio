define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterJurusanPeminatanCtrl', ['$rootScope', '$scope', 'ModelItem', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, medifirstService) {
			$scope.item = {};
			var init = function () {
				medifirstService.get("sdm/pendidikan/get-daftar-diklat-jurusan").then(function (dat) {
					$scope.dataGrid = dat.data.data;
					for (let i = 0; i < $scope.dataGrid.length; i++) {
						const element = $scope.dataGrid[i];
						if (element.statusenabled == "1") element.statusenabled = true
						else element.statusenabled = false
					}
					$scope.dataGridMaster = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.dataGrid
					});
				});
			};
			init();
			$scope.klik = function (grid) {
				$scope.grid = grid;
				$scope.item.idJurusanPeminatan = grid.id;
				$scope.item.jurusanPeminatan = grid.diklatjurusan;
				$scope.item.statusAktif = grid.statusenabled;
			};
			$scope.mainGridOptions = {
				pageable: true,
				columns: [
					{ field: "id", title: "Id" },
					{ field: "diklatjurusan", title: "Jurusan Peminatan" },
					{ field: "statusenabled", title: "Status Aktif", template: '<input ng-model = "dataItem.statusenabled" type="checkbox" ng-change="getClick(dataItem)" disabled></input>' }],
				editable: false,
				selectable: true
			};
			$scope.getClick = function (item) {
				if (item.statusEnabled) {
					for (var i = 0; i < $scope.dataGridMaster.data().length; i++) {
						var ditem = $scope.dataGridMaster.at(i)
						if (ditem !== item) {
							ditem.set('statusEnabled', false);
						}
					}

				}
			}
			$scope.simpan = function () {
				// var data = {
				// 	"id":parseInt($scope.item.idJurusanPeminatan),
				// 	"diklatjurusan":$scope.item.jurusanPeminatan,
				// 	"statusenabled":$scope.item.statusAktif
				// }
				var IDID = ''
				if ($scope.item.idJurusanPeminatan != undefined) {
					IDID = $scope.item.idJurusanPeminatan
				}
				var enaena = false
				if ($scope.item.statusAktif != false) {
					enaena = true
				}
				var data = {
					"id": IDID,
					"diklatkategori": $scope.item.jurusanPeminatan,
					"statusenabled": enaena
				}
			medifirstService.post( "sdm/pendidikan/save-daftar-diklat-jurusan",data).then(function (e) {
					$scope.item = {};
					init();
				});
			}
			$scope.batal = function () {
				$scope.item = {};
			}
		}
	]);
});