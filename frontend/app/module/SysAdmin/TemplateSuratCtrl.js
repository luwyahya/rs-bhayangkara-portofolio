define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('TemplateSuratCtrl', ['$scope', 'MedifirstService',
		function ($scope, medifirstService) {
			$scope.item = {};
			$scope.popUp = {}
			$scope.isRouteLoading = false;

			loadData();

			$scope.optionEdit = {
				tools: [
					"bold",
					"italic",
					"underline",
					"strikethrough",
					"justifyLeft",
					"justifyCenter",
					"justifyRight",
					"justifyFull",
					"insertUnorderedList",
					"insertOrderedList",
					"indent",
					"outdent",
					"createLink",
					"unlink",
					"insertImage",
					"insertFile",
					"subscript",
					"superscript",
					"tableWizard",
					"createTable",
					"addRowAbove",
					"addRowBelow",
					"addColumnLeft",
					"addColumnRight",
					"deleteRow",
					"deleteColumn",
					"mergeCellsHorizontally",
					"mergeCellsVertically",
					"splitCellHorizontally",
					"splitCellVertically",
					"viewHtml",
					"formatting",
					"cleanFormatting",
					"copyFormat",
					"applyFormat",
					"foreColor",
					"backColor",
					"print"],
				resizable: {
					content: true,
					toolbar: true
				}

			};

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
				if ($scope.item.qDeskripsi != undefined) {
					ruang = "&des=" + $scope.item.qDeskripsi
				}
				var quota = ""
				if ($scope.item.quota != undefined) {
					quota = "&quota=" + $scope.item.quota
				}

				medifirstService.get("sysadmin/general/get-daftar-template?"
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
				columns: [
				// 	{
				// 	"field": "no",
				// 	"title": "No",
				// 	"width": "5%",
				// 	"attributes": { align: "center" }

				// },
				{
					"field": "id",
					"title": "Id Template",
					"width": "10%"
				},
				{
					"field": "deskripsidokumen",
					"title": "Deskripsi",
					"width": "70%"
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
					width: "20%",
				}

				]
			};

			$scope.Tambah = function () {
				$scope.isInput = true
				$scope.item = {}
				$scope.item.method = 'save'
				$scope.item.template = ''
				// $scope.popUps.center().open();
			}
			$scope.save = function () {
				if ($scope.item.deskripsi == undefined) {
					toastr.error('Deskripsi harus di isi')
					return
				}
				if ($scope.item.template == undefined) {
					toastr.error('Template harus di isi')
					return
				}


				var objSave = {
					"id": $scope.item.id != undefined ? $scope.item.id : '',
					"deskripsidokumen": $scope.item.deskripsi,
					"template": $scope.item.template,
					"method": 'save'

				}
				medifirstService.post('sysadmin/general/save-template-dok', objSave).then(function (e) {
					loadData();
					$scope.Clear();
					$scope.isInput = false
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
					"id": dataItem.id,
					"method": 'delete'
				}

				medifirstService.post('sysadmin/general/save-template-dok', itemDelete).then(function (e) {
					loadData();
					$scope.isInput = false
					grid.removeRow(row);
				})

			}
			function editData(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("sysadmin/general/get-daftar-template?id"+dataItem.id).then(function(e){
					
				})
				$scope.item.id = dataItem.id
				$scope.item.deskripsi = dataItem.deskripsidokumen
				$scope.item.template = dataItem.template
				$scope.isInput = true
				// $scope.popUps.center().open();

			}

			$scope.tutup = function () {
				$scope.isInput = false

			}
			// intervensi


			//ennd evaluaso

		}
	]);
});

