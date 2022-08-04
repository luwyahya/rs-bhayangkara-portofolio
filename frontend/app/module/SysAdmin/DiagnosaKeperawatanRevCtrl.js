define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DiagnosaKeperawatanRevCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window',
		function ($rootScope, $scope, medifirstService, $window) {
			$scope.item = {};
			$scope.popUp = {};

			$scope.intervensi = {};
			$scope.isRouteLoading = false;
			$scope.popUpImp = {}
			$scope.popUpInter = {}
			$scope.implementasi = {}

			$scope.popUpEva = {}
			$scope.evaluasi = {}
			// loadCombo();
			loadData();
			$scope.Search = function () {
				loadData()
			}
			$scope.Clear = function () {
				$scope.item = {}
				$scope.popUp = {}
				$scope.popUpInter = {}
				$scope.intervensi = {}
				$scope.popUpImp = {}
				$scope.implementasi = {}
				$scope.popUpEva = {}
				$scope.evaluasi = {}
				loadData()
				loadInter()
				loadImp()
				loadEva()
			}


			// function loadCombo(){
			// medifirstService.get("gizi/get-data-combo-gizi"
			// 	).then(function(e) {
			// 		$scope.listKelompokProduk = e.data.kelompokproduk
			// 		$scope.listDepartemen = e.data.departemen
			// 	})

			// }
			function loadData() {
				$scope.isRouteLoading = true;
				var id = ""
				if ($scope.item.id != undefined) {
					id = "id=" + $scope.item.id
				}
				var kdext = ""
				if ($scope.item.kodeExternal != undefined) {
					kdext = "&kodeexternal=" + $scope.item.kodeExternal
				}
				var namadiag = ""
				if ($scope.item.namaDiagnosaKep != undefined) {
					namadiag = "&namadiagnosakep=" + $scope.item.namaDiagnosaKep
				}

				medifirstService.get("sysadmin/general/get-master-diagnosa-kep?"
					+ namadiag
					+ kdext
					+ id
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}
					$scope.listDiagnosaKep = data.data.data
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
					"field": "namaDiagnosaKep",
					"title": "Nama Diagnosa Keperawatan",
					"width": "60%"
				}, {
					"field": "kodeexternal",
					"title": "Kode External",
					"width": "10%"
				}, {

					"field": "deskripsidiagnosakep",
					"title": "Deskripsi Diagnosa Kep",
					"width": "20%"
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


				if ($scope.popUp.namaDiagnosaKep == undefined) {
					toastr.error('diagnosa Keperawatan harus di isi')
					return
				}


				var des = ""
				if ($scope.popUp.deskripsi != undefined)
					des = $scope.popUp.deskripsi


				var objSave = {
					"id": id,
					"namadiagnosakep": $scope.popUp.namaDiagnosaKep,
					"deskripsidiagnosakep": des,

				}
				medifirstService.post('sysadmin/general/post-diagnosa-kep/save', objSave).then(function (e) {
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

				medifirstService.post('sysadmin/general/post-diagnosa-kep/delete', itemDelete).then(function (e) {
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
				medifirstService.get("sysadmin/general/get-master-diagnosa-kep?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUp.id = dataItem.id
				$scope.popUp.namaDiagnosaKep = dataItem.namaDiagnosaKep
				$scope.popUp.deskripsi = dataItem.deskripsidiagnosakep

				$scope.popUps.center().open();

			}

			$scope.tutup = function () {
				$scope.popUps.close();
				$scope.windowInter.close()
				$scope.windowImp.close()
				$scope.windowEva.close()
			}
			// intervensi
			$scope.columnGrid2 = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="TambahInter()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],


				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "name",
					"title": "Intervensi",
					"width": "60%"
				}, {
					"field": "kodeexternal",
					"title": "Kode External",
					"width": "10%"
				}, {

					"field": "namadiagnosakep",
					"title": "Diagnosa Keperawatan",
					"width": "20%"
				},
				{
					"command": [{
						text: "Edit",
						click: editData2,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData2,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
			};
			$scope.TambahInter = function () {
				$scope.windowInter.center().open()
			}
			$scope.cariInter = function () {
				loadInter()
			}
			loadInter()
			function loadInter() {

				var id = ""
				if ($scope.intervensi.id != undefined) {
					id = "id=" + $scope.intervensi.id
				}
				var name = ""
				if ($scope.intervensi.name != undefined) {
					name = "&name=" + $scope.intervensi.name
				}
				var diagnosaKep = ""
				if ($scope.intervensi.diagnosaKep != undefined) {
					diagnosaKep = "&iddiagnosakep=" + $scope.intervensi.diagnosaKep.id
				}

				medifirstService.get("emr/get-intervensi?"
					+ name
					+ diagnosaKep
					+ id
				).then(function (data) {
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}

					$scope.dataSource2 = new kendo.data.DataSource({
						data: data.data.data,
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,

					});

				})
			}
			$scope.saveInter = function () {
				var id = ""
				if ($scope.popUpInter.id != undefined)
					id = $scope.popUpInter.id


				if ($scope.popUpInter.name == undefined) {
					toastr.error('Intervensi harus di isi')
					return
				}

				if ($scope.popUpInter.diagnosaKep == undefined) {
					toastr.error('Diagnosa Keperawatan harus di isi')
					return
				}


				var objSave = {
					"id": id,
					"name": $scope.popUpInter.name,
					"objectdiagnosakeperawatanfk": $scope.popUpInter.diagnosaKep.id,

				}
				medifirstService.post('sysadmin/general/post-intervensi-diagnosakeperawatan/save', objSave).then(function (e) {

					$scope.Clear();
				})

			}



			function hapusData2(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post('sysadmin/general/post-intervensi-diagnosakeperawatan/delete', itemDelete).then(function (e) {
					if (e.status === 201) {
						$scope.Clear();
						grid.removeRow(row);
					}
				})

			}
			function editData2(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("sysadmin/general/get-intervensi?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUpInter.id = dataItem.id
				$scope.popUpInter.name = dataItem.name
				$scope.popUpInter.diagnosaKep = { id: dataItem.objectdiagnosakeperawatanfk, namaDiagnosaKep: dataItem.namadiagnosakep }

				$scope.windowInter.center().open();

			}

			//ennd intervensi


			// implemenytasi
			$scope.columnGrid3 = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="TambahImp()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],


				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "name",
					"title": "Implementasi",
					"width": "60%"
				}, {
					"field": "kodeexternal",
					"title": "Kode External",
					"width": "10%"
				}, {

					"field": "namadiagnosakep",
					"title": "Diagnosa Keperawatan",
					"width": "20%"
				},
				{
					"command": [{
						text: "Edit",
						click: editData3,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData3,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
			};
			$scope.TambahImp = function () {
				$scope.windowImp.center().open()
			}
			$scope.cariImp = function () {
				loadImp()
			}
			loadImp()
			function loadImp() {

				var id = ""
				if ($scope.implementasi.id != undefined) {
					id = "id=" + $scope.implementasi.id
				}
				var name = ""
				if ($scope.implementasi.name != undefined) {
					name = "&name=" + $scope.implementasi.name
				}
				var diagnosaKep = ""
				if ($scope.implementasi.diagnosaKep != undefined) {
					diagnosaKep = "&iddiagnosakep=" + $scope.implementasi.diagnosaKep.id
				}

				medifirstService.get("emr/get-implementasi?"
					+ name
					+ diagnosaKep
					+ id
				).then(function (data) {
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}

					$scope.dataSource3 = new kendo.data.DataSource({
						data: data.data.data,
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,

					});

				})
			}
			$scope.saveImp = function () {
				var id = ""
				if ($scope.popUpImp.id != undefined)
					id = $scope.popUpImp.id


				if ($scope.popUpImp.name == undefined) {
					toastr.error('Implementasi harus di isi')
					return
				}

				if ($scope.popUpImp.diagnosaKep == undefined) {
					toastr.error('Diagnosa Keperawatan harus di isi')
					return
				}


				var objSave = {
					"id": id,
					"name": $scope.popUpImp.name,
					"objectdiagnosakeperawatanfk": $scope.popUpImp.diagnosaKep.id,

				}
				medifirstService.post(objSave, 'sysadmin/general/post-implementasi-diagnosakeperawatan/save').then(function (e) {

					$scope.Clear();
				})

			}



			function hapusData3(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post(itemDelete, 'sysadmin/general/post-implementasi-diagnosakeperawatan/delete').then(function (e) {
					if (e.status === 201) {
						$scope.Clear();
						grid.removeRow(row);
					}
				})

			}
			function editData3(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("sysadmin/general/get-implementasi?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUpImp.id = dataItem.id
				$scope.popUpImp.name = dataItem.name
				$scope.popUpImp.diagnosaKep = { id: dataItem.objectdiagnosakeperawatanfk, namaDiagnosaKep: dataItem.namadiagnosakep }

				$scope.windowImp.center().open();

			}

			//ennd intervensi


			// implemenytasi
			$scope.columnGrid4 = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="TambahEva()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],


				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "name",
					"title": "Evaluasi",
					"width": "60%"
				}, {
					"field": "kodeexternal",
					"title": "Kode External",
					"width": "10%"
				}, {

					"field": "namadiagnosakep",
					"title": "Diagnosa Keperawatan",
					"width": "20%"
				},
				{
					"command": [{
						text: "Edit",
						click: editData4,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData4,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
			};
			$scope.TambahEva = function () {
				$scope.windowEva.center().open()
			}
			$scope.cariEva = function () {
				loadEva()
			}
			loadEva()
			function loadEva() {

				var id = ""
				if ($scope.evaluasi.id != undefined) {
					id = "id=" + $scope.evaluasi.id
				}
				var name = ""
				if ($scope.evaluasi.name != undefined) {
					name = "&name=" + $scope.evaluasi.name
				}
				var diagnosaKep = ""
				if ($scope.evaluasi.diagnosaKep != undefined) {
					diagnosaKep = "&iddiagnosakep=" + $scope.evaluasi.diagnosaKep.id
				}

				medifirstService.get("emr/get-evaluasi?"
					+ name
					+ diagnosaKep
					+ id
				).then(function (data) {
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}

					$scope.dataSource4 = new kendo.data.DataSource({
						data: data.data.data,
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,

					});

				})
			}
			$scope.saveEva = function () {
				var id = ""
				if ($scope.popUpEva.id != undefined)
					id = $scope.popUpEva.id


				if ($scope.popUpEva.name == undefined) {
					toastr.error('Evaluasi harus di isi')
					return
				}

				if ($scope.popUpEva.diagnosaKep == undefined) {
					toastr.error('Diagnosa Keperawatan harus di isi')
					return
				}


				var objSave = {
					"id": id,
					"name": $scope.popUpEva.name,
					"objectdiagnosakeperawatanfk": $scope.popUpEva.diagnosaKep.id,

				}
				medifirstService.post('sysadmin/general/post-evaluasi-diagnosakeperawatan/save', objSave).then(function (e) {

					$scope.Clear();
				})

			}



			function hapusData4(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post('sysadmin/general/post-evaluasi-diagnosakeperawatan/delete', itemDelete).then(function (e) {
					if (e.status === 201) {
						$scope.Clear();
						grid.removeRow(row);
					}
				})

			}
			function editData4(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("sysadmin/general/get-evaluasi?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUpEva.id = dataItem.id
				$scope.popUpEva.name = dataItem.name
				$scope.popUpEva.diagnosaKep = { id: dataItem.objectdiagnosakeperawatanfk, namaDiagnosaKep: dataItem.namadiagnosakep }

				$scope.windowEva.center().open();

			}

			//ennd evaluaso

		}
	]);
});

