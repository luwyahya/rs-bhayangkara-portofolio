define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('ModulAplikasiCtrl', ['$scope', '$timeout', 'MedifirstService',
		function ($scope, $timeout, medifirstService) {
			$scope.item = {};			
			$scope.now = new Date();
			$scope.isRouteLoading = true;
			function modulAplikasiHeadDropdown(container, options) {
				$('<input name="' + options.field + '"/>')
					.appendTo(container)
					.kendoDropDownList({
						dataTextField: "modulaplikasi",
						dataValueField: "id",
						dataSource: $scope.listModulAplikasi,
						filter: "contains"
					});
			}
			function noUrutEditor(container, options) {
				$('<input name="' + options.field + '"/>')
					.appendTo(container)
					.kendoNumericTextBox({
						decimals: 0
					});
			}

			$scope.optionGrid = {
				toolbar: [{
					name: "create", text: "Input Baru"
				}],
				pageable: true,
				scrollable: true,
				columns: [
					// { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
					{
						field: "modulAplikasiHead", title: "Modul Aplikasi Head",
						editor: modulAplikasiHeadDropdown,
						"template": "# if (modulAplikasiHead != undefined) {# #= modulAplikasiHead.modulaplikasi # #} else {# #= '-' # #}#"
					},


					{ field: "modulaplikasi", title: "Nama Modul Aplikasi " },
					// {
					// 	field: "nourut", title: "No Urut",
					// 	editor: noUrutEditor,
					// },
					{ field: "reportdisplay", title: "Report Display", attributes: { style: "text-align:right; padding-right: 15px;" } },
					// { field: "statusenabled", title: "Status Enabled", width: 100, attributes: { style: "text-align:right; padding-right: 15px;"}},
					{ command: [{ name: "destroy", text: "Hapus" }, { name: "edit", text: "Edit" }], title: "&nbsp;", width: 160 }
				],
				editable: "popup",
				save: function (e) {
					$scope.Save(e.model);
				},
				edit: function (e) {
					e.sender.columns.forEach(function (element, index /*, array */) {
						if (element.hideMe) {
							e.container.find(".k-edit-label:eq(" + index + "), "
								+ ".k-edit-field:eq( " + index + ")"
							).hide();
						}
					});
				}
			};
			init();
			// $scope.Cancel = function(){
			// 	delete $scope.item;
			// 	$scope.item = {};
			// }
			// $scope.Delete = function(){
			// 	ManageSdm.getOrderList("/jabatan/delete-jabatan/?id=" + $scope.item.id, true).then(function (dat) {        
			// 		init();
			// 	});
			// };
			function init() {
				$scope.item = {}; // set defined object
				medifirstService.get("sysadmin/menu/get-master-modul-aplikasi", true).then(function (dat) {					
					$scope.listModulAplikasi = dat.data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: $scope.listModulAplikasi,
						// sort: {
						// 	field: "namaJabatan", 
						// 	dir: "asc"
						// },
						pageSize: 20,
						schema: {
							model: {
								id: "id",
								fields: {
									id: { editable: false },
									modulaplikasi: {
										editable: true
										// , validation: {
										// 	validasimodulaplikasi: function (input) {
										// 		if (input.is("[name='modulaplikasi']") && input.val() === "") {
										// 			return false;
										// 		}
										// 		return true;
										// 	}
										// }
									},
									nourut: { editable: true },
									reportdisplay: { editable: true },
									modulAplikasiHead: {
										editable: true
									}
								}
							}
						},
						change: function (e) {
							// if(!e.action || e.action == "sync"){
							// 	// set row number on detail grid
							// 	e.items.forEach(function(lis, index){
							// 		lis.rowNumber = ++index;
							// 	})
							// } else 
							if (e.action == "itemchange") {
								e.items[0].modulAplikasiHead = e.items[0].modulAplikasiHead.id ? e.items[0].modulAplikasiHead.id : e.items[0].modulAplikasiHead;
							}
							if (e.action === "remove") {
								var item = e.items[0];
								if (item.jenisJabatanId !== "" && item.namaJabatan !== "") {
									item.action = e.action;
									item.modulAplikasiHead = item.modulAplikasiHead != undefined ? item.modulAplikasiHead.id : item.modulAplikasiHead;
									$scope.Save(item);
									//$scope.Disabling(e.items[0]);
								} else {
									$scope.daftarJabatan.sync(); // call sync function to auto update row number w/o click on grid
								}
							}
						}
					});

					$scope.isRouteLoading = false;
				}, (error) => {
					$scope.isRouteLoading = false;
					throw error;
				})
			};

			$scope.Save = function (data) {
				var item = {
					id: data.id,
					statusenabled: true,
					modulAplikasiHead: data.modulAplikasiHead,
					modulaplikasi: data.modulaplikasi,
					reportdisplay: data.reportdisplay,
					// nourut: parseInt(data.nourut),
				}
				if (data.action && data.action === "remove") item.statusenabled = false;
				medifirstService.post('sysadmin/menu/save-modul-aplikasi', item).then(function (e) {
					// delete $scope.item;
					// $scope.item = {};
					init();
				}, (error) => {

					init();
				});
			};

			var timeoutPromise;
			$scope.$watch('item.modulAplikasiHead', function (newVal, oldVal) {
				if (newVal && newVal.id && newVal !== oldVal) {
					applyFilter("modulAplikasiHead", newVal)
				}
			})
			$scope.$watch('item.modulAplikasi', function (newVal, oldVal) {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(function () {
					if (newVal && newVal !== oldVal) {
						applyFilter("modulaplikasi", newVal)
					}
				}, 500)
			})
			function applyFilter(filterField, filterValue) {
				var dataGrid = $("#gridID").data("kendoGrid");
				var currFilterObject = dataGrid.dataSource.filter();
				var currentFilters = currFilterObject ? currFilterObject.filters : [];

				if (currentFilters && currentFilters.length > 0) {
					for (var i = 0; i < currentFilters.length; i++) {
						if (currentFilters[i].field == filterField) {
							currentFilters.splice(i, 1);
							break;
						}
					}
				}

				if (filterValue.id) {
					currentFilters.push({
						field: filterField,
						operator: "eq",
						value: filterValue.id
					});
				} else {
					currentFilters.push({
						field: filterField,
						operator: "contains",
						value: filterValue
					})
				}

				dataGrid.dataSource.filter({
					logic: "and",
					filters: currentFilters
				})
			}
			$scope.resetFilter = function () {
				var dataGrid = $("#gridID").data("kendoGrid");
				dataGrid.dataSource.filter({});
				$scope.item = {};
			}
		}
	]);
});