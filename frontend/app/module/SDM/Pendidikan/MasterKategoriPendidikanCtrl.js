define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterKategoriPendidikanCtrl', ['$rootScope', '$scope', 'ModelItem', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, medifirstService) {
			$scope.item = {};
			var init = function () {
				medifirstService.get("sdm/pendidikan/get-daftar-diklat-kategory").then(function (dat) {
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
				$scope.item.idKategori = grid.id;
				$scope.item.kategoriPendidikan = grid.diklatkategori;
				$scope.item.statusAktif = grid.statusenabled;
			};
			$scope.mainGridOptions = {
				pageable: true,
				columns: [
					{ field: "id", title: "Id", "width": "20px" },
					{ field: "diklatkategori", title: "Kategori Pendidikan", "width": "60px" },
					{ field: "statusenabled", title: "Status Aktif", "width": "20px", template: '<input ng-model = "dataItem.statusenabled" type="checkbox" ng-change="getClick(dataItem)" disabled></input>' }],
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
				var IDID = ''
				if ($scope.item.idKategori != undefined) {
					IDID = $scope.item.idKategori
				}
				var enaena = false
				if ($scope.item.statusAktif != false) {
					enaena = true
				}
				var data = {
					"id": IDID,
					"diklatkategori": $scope.item.kategoriPendidikan,
					"statusenabled": enaena
				}
				medifirstService.post("sdm/pendidikan/save-daftar-diklat-kategory", data).then(function (e) {
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