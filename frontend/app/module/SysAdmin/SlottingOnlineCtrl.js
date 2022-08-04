define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SlottingOnlineCtrl', ['$scope', 'MedifirstService',
		function ($scope, medifirstService) {
			$scope.item = {};
			$scope.popUp = {}
			$scope.isRouteLoading = false;
			FormLoad()
			loadData();
			
			function FormLoad(){
				medifirstService.get("sysadmin/master/get-data-combo-master").then(function (dat) {
					$scope.listRuangan = dat.data.ruangan
				})
			}

			$scope.Search = function () {
				loadData()
			}

			$scope.Clear = function () {
				$scope.item = {}
				$scope.popUp = {}			
				loadData()				
			}			
			
			function loadData() {
				$scope.isRouteLoading = true;
				var id = ""
				if ($scope.item.id != undefined) {
					id = "id=" + $scope.item.id
				}
				var ruang = ""
				if ($scope.item.namaRuangan != undefined) {
					ruang = "&namaRuangan=" + $scope.item.namaRuangan
				}
				var quota = ""
				if ($scope.item.quota != undefined) {
					quota = "&quota=" + $scope.item.quota
				}

				medifirstService.get("reservasionline/get-daftar-slotting?"
					+ ruang
					+ quota
					+ id
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: data.data.data,
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}

			$scope.columnGrid = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "60%"
				}, {
					"field": "jambuka",
					"title": "Jam Buka",
					"width": "20%"
				}, {

					"field": "jamtutup",
					"title": "Jam Tutup",
					"width": "20%"
				},
				{

					"field": "quota",
					"title": "Quota",
					"width": "10%"
				},
				{
					"command": [{
						text: "Edit",
						click: editData,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
			};

			$scope.Tambah = function () {
				$scope.popUps.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id


				if ($scope.popUp.ruangan == undefined) {
					toastr.error('Ruangan harus di isi')
					return
				}
					if ($scope.popUp.quota == undefined) {
					toastr.error('Quota harus di isi')
					return
				}
					if ($scope.popUp.jamBuka == undefined) {
					toastr.error('Jam Buka harus di isi')
					return
				}
					if ($scope.popUp.jamTutup == undefined) {
					toastr.error('Jam Tutup harus di isi')
					return
				}


				var objSave = {
					"id": id,
					"objectruanganfk": $scope.popUp.ruangan.id,
					"jambuka": moment($scope.popUp.jamBuka).format('HH:mm') ,
					"jamtutup": moment($scope.popUp.jamTutup).format('HH:mm') ,
					"quota": $scope.popUp.quota ,

				}
				medifirstService.post('reservasionline/save-slotting',objSave).then(function (e) {
					loadData();
					$scope.Clear();
				})

			}



			function hapusData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post( 'reservasionline/delete-slotting',itemDelete).then(function (e) {
					if (e.status === 201) {
						loadData();
						grid.removeRow(row);
					}
				})

			}
			function editData(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.post("reservasionline/get-daftar-slotting?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUp.id = dataItem.id
				$scope.nows= new Date()

				$scope.popUp.ruangan = {id:dataItem.idruangan,namaruangan: dataItem.namaruangan}
				$scope.popUp.jamBuka = new Date( moment(	$scope.nows).format('YYYY-MM-DD') +' '+ dataItem.jambuka)
				$scope.popUp.jamTutup = new Date(  moment(	$scope.nows).format('YYYY-MM-DD') +' '+dataItem.jamtutup)
				$scope.popUp.quota =parseInt( dataItem.quota)
				$scope.popUps.center().open();

			}

			$scope.tutup = function () {
				$scope.popUps.close();
		
			}
			// intervensi
			

			//ennd evaluaso

		}
	]);
});

