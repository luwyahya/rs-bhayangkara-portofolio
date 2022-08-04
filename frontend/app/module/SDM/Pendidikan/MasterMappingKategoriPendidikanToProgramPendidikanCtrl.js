define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterMappingKategoriPendidikanToProgramPendidikanCtrl', ['$rootScope', '$scope', 'ModelItem', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, medifirstService) {
			$scope.item = {};
			var init = function () {
			medifirstService.get("sdm/pendidikan/get-combo-map-kategori").then(function (dat) {
					$scope.listKategoriPendidikan = dat.data.data3;
					$scope.listPendidikan = dat.data.data2;
					$scope.listJurusan = dat.data.data1;
				});
			medifirstService.get("sdm/pendidikan/get-mapkategoripendidikan-to-programpendidikan").then(function (dat) {
					$scope.dataGrid = dat.data.data;
					$scope.dataGridMaster = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.dataGrid
					});
				});
			};
			init();
			$scope.item.jurusan = [];
			$scope.mainGridOptions = {
				pageable: true,
				columns: [
					{ field: "diklatKategori", title: "Kategori Pendidikan" },
					{ field: "diklatProgram", title: "Pendidikan" },
					{ field: "diklatJurusan", title: "Jurusan Peminatan" }],
				editable: false
			};
			$scope.simpan = function () {
				var listDiklatJurusan = [];
				var listRawRequired = [
					"item.kategoriPendidikan|ng-model|NIM",
					"item.pendidikan|ng-model|Nama Lengkap",
					"item.jurusan|k-ng-model|Jenis Kelamin"
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					$scope.item.jurusan.forEach(function (data) {
						var temp = {
							"diklatJurusanId": data.id,
							"diklatJurusan": data.diklatJurusan
						}
						listDiklatJurusan.push(temp);
					})
					var data = {
						"kategoriPendidikanId": $scope.item.kategoriPendidikan.id,
						"namaKategoriPendidikan": $scope.item.kategoriPendidikan.diklatKategori,
						"pendidikanId": $scope.item.pendidikan.id,
						"namaPendidikan": $scope.item.pendidikan.namaPendidikan,
						"listDiklatJurusan": listDiklatJurusan
					}
					medifirstService.post( "sdm/pendidikan/map-diklat-program-to-jurusan/save",data).then(function (e) {
						$scope.item = {};
						init();
					});
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
		}
	]);
});