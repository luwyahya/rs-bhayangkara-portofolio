define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterRekananCtrl', ['$scope', '$state', 'ModelItem', '$http', 'CacheHelper', '$mdDialog', 'MedifirstService',
		function ($scope, $state, modelItem, $http, cacheHelper, $mdDialog, medifirstService) {
			$scope.dataSelected = {};
			$scope.item = {};
			FormLoad();
			LoadData();

			function FormLoad() {
				$scope.item.jumlahRows = 50;
				$scope.dataLogin = medifirstService.getPegawaiLogin();
				medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
					$scope.listPegawai = data;
				})

				medifirstService.get("sysadmin/master/get-data-combo-master", false).then(function (data) {
					$scope.listModulAplikasi = data.data.modulaplikasi;
					$scope.listjenisrekanan = data.data.jenisrekanan;
				})
			}

			$scope.cariFilter = function () {
				$scope.isRouteLoading = true;
				LoadData()
			}
			$scope.clearSearch = function () {
				$scope.ClearSearch();				
			}

			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.jumlahRows = 50;
				loadData()
			}

			function LoadData() {
				var tempkdRekanan = "";
				if ($scope.item.kdrekanan != undefined) {
					tempkdRekanan = "&kdrekanan=" + $scope.item.kdrekanan;
				}
				var tempIdRekanan = "";
				if ($scope.item.idRekanan != undefined) {
					tempIdRekanan = "&id=" + $scope.item.idRekanan;
				}
				var tempnamarekanan = "";
				if ($scope.item.namarekanan != undefined) {
					tempnamarekanan = "&namarekanan=" + $scope.item.namarekanan;
				}
				var tempkodeexternal = "";
				if ($scope.item.kodeexternal != undefined) {
					tempkodeexternal = "&kodeexternal=" + $scope.item.kodeexternal;
				}
				var tempjenisrekanan = "";
				if ($scope.item.jenisrekanan != undefined) {
					tempjenisrekanan = "&objectjenisrekananfk=" + $scope.item.jenisrekanan.id;
				}
				var jmlRows = "";
				if ($scope.item.jumlahRows != undefined) {
					jmlRows = '&jmlRows=' + $scope.item.jumlahRows;
				}

				cacheHelper.set('MasterRekananCtrl');
				medifirstService.get("sysadmin/master/get-data-rekanan?"
					+ tempkdRekanan
					+ tempnamarekanan
					+ tempkodeexternal
					+ tempIdRekanan
					+ tempjenisrekanan
					+ jmlRows).then(function (data) {
						$scope.isRouteLoading = false;
						var dataRekanan = data.data.rekanan;
						for (var i = 0; i < dataRekanan.length; i++) {
							dataRekanan[i].no = i + 1
						}
						$scope.dataSourceRekanan = new kendo.data.DataSource({
							data: dataRekanan,
							pageSize: 10,
							total: dataRekanan.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});
					})
			}

			$scope.click = function (dataPasienSelected) {
				var data = dataPasienSelected;
			};

			$scope.klik = function (current) {
				$scope.item.idx = current.id;
				$scope.item.id = current.id;
			}

			$scope.edit = function () {
				if ($scope.item.idx == undefined) {
					alert("Pilih 1 Data Untuk di edit!!")
				} else {
					$state.go("RekananEdit",
						{
							idx: $scope.item.idx
						})
				}
			}

			$scope.tambah = function () {
				$state.go("RekananEdit")
			}

			$scope.columnRekanan = [
				{
					"field": "no",
					"title": "<h3 align=center>No.<h3>",
					"width": "40px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						style: "text-align: center;"
					}
				},
				{
					"field": "id",
					"title": "<h3 align=center>Kd Rekanan<h3>",
					"width": "40px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}
				},
				{
					"field": "statusenabled",
					"title": "<h3 align=center>Status Enabled<h3>",
					"width": "35px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}
				},
				{
					"field": "namarekanan",
					"title": "<h3 align=center>Nama Rekanan<h3>",
					"width": "300px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}
				},
				{
					"field": "jenisrekanan",
					"title": "<h3 align=center>Jenis Rekanan<h3>",
					"width": "100px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}
				},
				{
					"command": [
						{ text: "Enable", click: enableData, imageClass: "k-icon k-i-pencil", className: "btn-enabled", },
						{ text: "Disable", click: disableData, imageClass: "k-icon k-delete", className: "btn-disabled", },
					],
					title: "<h3 align=center>Command<h3>",
					width: "100px",
				}
			];

			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columnProduk,
				editable: "popup",
				selectable: "row",
				scrollable: false
			};

			function disableData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": '0'
				}
				medifirstService.post('sysadmin/master/save-statusenabled-rekanan', objSave).then(function (e) {
					LoadData();
				})
			};

			function enableData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": '1'
				}
				medifirstService.post('sysadmin/master/save-statusenabled-rekanan', objSave).then(function (e) {
					LoadData();
				})
			};

			////////////////////////////////////////////////////////////////////	END		/////////////////////////////////////////////////////////////////////////
		}
	]);
});
