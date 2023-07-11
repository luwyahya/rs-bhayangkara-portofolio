define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterTipeLayananCtrl', ['$q', '$scope', 'MedifirstService', '$timeout',
		function ($q, $scope, medifirstService, $timeout) {
			$scope.isRouteLoading = true;
			$scope.daftarMasterOpt = {
				 
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "id", title: "id", width: 50 },
					{ field: "namaexternal", title: "Tipe Layanan" },
					{ field: "kelompoktransaksi", title: "Kelompok Transaksi" },
					{ field: "", title: " ",
						template: "<button   class=\"k-button custom-button\"    ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >Edit</button> " }, 
					// { field: "Status", title: "Status Enabled" },
					// { command: [  { name: "edit", text: "Edit" }], title: "&nbsp;", width: 160 }
				],
				 
			};
			init();
			$scope.verifikasigrid = function(e) {
					$scope.popupketerangan.center().open()
					$scope.item.id = e.id
					$scope.item.tipelayanan = e.tipelayanan
					$scope.item.kelompoktransaksi = {id:e.idkt , kelompoktransaksi:e.kelompoktransaksi}
			}
			function init() {
				$scope.item = {}; // set defined object
				$q.all([
					medifirstService.get("sysadmin/general/rensar/get-tipe-layanan", true),
				]).then(function (res) {
					if (res[0].statResponse) {
						$scope.dataSource = new kendo.data.DataSource({
							data: res[0].data.data,
							sort: {
								field: "kelompoktransaksi",
								dir: "asc"
							},
							pageSize: 20,
							 
							 
						});
					}

					$scope.isRouteLoading = false;
				}, (error) => {
					$scope.isRouteLoading = false;
					throw error;
				})
				
				medifirstService.get("sysadmin/general/rensar/get-kelompok-transaksi", true).then(function (dat) { 
                    $scope.listkelompoktransaksi = dat.data.data;
                });
			};
			$scope.CetakPopUpclose = function () {
				$scope.popupketerangan.close();
			}
			$scope.Save = function () {
				 if ($scope.item.kelompoktransaksi == undefined  ) {
                    alert("Isi Kelompok Transaksi")
                    return;
                }
				var item = {
					id: $scope.item.id, 
					kelompoktransaksi: $scope.item.kelompoktransaksi.id 
				}
				 
				medifirstService.post('sysadmin/general/rensar/save-tipelayanan',item).then(function (e) {
					// delete $scope.item;
					// $scope.item = {};
					$scope.popupketerangan.close();
					init();
				});
			};
			
			 
			//** BATAS SUCI */
		}
	]);
});