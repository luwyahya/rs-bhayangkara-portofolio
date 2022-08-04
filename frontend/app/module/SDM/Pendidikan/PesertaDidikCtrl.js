define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PesertaDidikCtrl', ['$rootScope', '$scope', 'ModelItem', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, medifirstService) {
			$scope.item = {};

			init();
			function init() {
				medifirstService.get("sdm/pendidikan/get-daftar-pesertadidik?nimOrNama=").then(function (dat) {
					$scope.dataGrid = dat.data.data;
					// $scope.dataGrid.forEach(function (data) {
					// 	data.ttl = data.tempatlahir +", "+data.tgllahir
					// })
					$scope.dataGridPesertaDidik = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.dataGrid
					});
				});
				medifirstService.get("sdm/pendidikan/get-dcbo-pesertadidik").then(function (dat) {
					$scope.listJenisKelamin = dat.data.dataJenisKelamin
					$scope.listAgama = dat.data.dataAgama
					$scope.listInstitusiPendidikan = dat.data.dataInstitusipPendidikan
					$scope.listJurusan = dat.data.dataJurusan
					$scope.listProgramStudi = dat.data.datafakultas
				});
				$scope.listPeriode = [
					{ 'id': 1, 'periode': '2017/2018' },
					{ 'id': 2, 'periode': '2018/2019' },
					{ 'id': 3, 'periode': '2019/2020' },
					{ 'id': 4, 'periode': '2020/2021' },
					{ 'id': 5, 'periode': '2021/2022' }
				]
			};
			$scope.init = function () {
				init()
			}
			$scope.cari = function () {
				var nama = ''
				if ($scope.item.cariNimNama != undefined) {
					nama = 'nama=' + $scope.item.cariNimNama
				}
				medifirstService.get("sdm/pendidikan/get-daftar-pesertadidik?" + nama).then(function (dat) {
					$scope.dataGrid = dat.data.data;
					// $scope.dataGrid.forEach(function (data) {
					// 	data.ttl = data.tempatLahir +", "+data.tglLahir
					// })
					$scope.dataGridPesertaDidik = new kendo.data.DataSource({
						pageSize: 10,
						data: $scope.dataGrid
					});
				});
			}

			// $scope.columnGridPesertaDidik = { 
			// 	// pageable: true,
			// 	// columns: [
			// 	// { field:"periodeTahunAjaran",title:"Periode Tahun Ajaran",width:100},
			// 	{ field:"nim",title:"NIM",width:100 },
			// 	{ field:"nama",title:"Nama Lengkap",width:100 },
			// 	{ field:"jeniskelamin",title:"Jenis Kelamin",width:100 },
			// 	{ field:"agama",title:"Agama",width:100},
			// 	{ field:"nomorhp",title:"No Hp",width:100 },
			// 	{ field:"ttl",title:"Tempat/Tanggal Lahir",width:200 },
			// 	{ field:"alamat",title:"Alamat",width:300 },
			// 	{ field:"institusipendidikan",title:"Institusi Pendidikan",width:200 
			// // }],
			// // 	editable: false,
			// };
			$scope.columnGridPesertaDidik = {
				// toolbar: [
				// 	"excel",

				// 	],
				// 	excel: {
				// 		fileName: "DaftarRegistrasiPasien.xlsx",
				// 		allPages: true,
				// 	},
				// 	excelExport: function(e){
				// 		var sheet = e.workbook.sheets[0];
				// 		sheet.frozenRows = 2;
				// 		sheet.mergedCells = ["A1:M1"];
				// 		sheet.name = "Orders";

				// 		var myHeaders = [{
				// 			value:"Daftar Registrasi Pasien",
				// 			fontSize: 20,
				// 			textAlign: "center",
				// 			background:"#ffffff",
				//                   // color:"#ffffff"
				//               }];

				//               sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
				//           },
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "nim",
							"title": "NIM",
							"width": "70px"
						},
						{
							"field": "nama",
							"title": "Nama",
							"width": "120px"
						},
						{
							"field": "jeniskelamin",
							"title": "JK",
							"width": "70px"
						},
						{
							"field": "agama",
							"title": "Agama",
							"width": "80px"
							// "template": "<span class='style-left'>#: namapasien #</span>"
						},
						{
							"field": "nomorhp",
							"title": "No Telepon",
							"width": "90px"
						},
						{
							"field": "ttl",
							"title": "Tempat Tgl Lahir",
							"width": "120px"
						},
						{
							"field": "alamat",
							"title": "Alamat",
							"width": "100px"
						},
						{
							"field": "institusipendidikan",
							"title": "Institusi Pendidikan",
							"width": "100px"
						}
					]
			};
			$scope.klikGrid = function (dataSelected) {
				$scope.item.norec = dataSelected.norec
				$scope.item.nim = dataSelected.nim
				$scope.item.nama = dataSelected.nama
				$scope.item.jenisKelamin = { 'id': dataSelected.jeniskelaminfk, 'jeniskelamin': dataSelected.jeniskelamin }
				$scope.item.agama = { 'id': dataSelected.agamafk, 'agama': dataSelected.agama }
				$scope.item.noHp = dataSelected.nomorhp
				$scope.item.tempatLahir = dataSelected.tempatlahir
				$scope.item.tanggalLahir = dataSelected.tanggallahir
				$scope.item.alamat = dataSelected.alamat
				$scope.item.institusiPendidikan = { 'id': dataSelected.institusipendidikanfk, 'institusipendidikan': dataSelected.institusipendidikan }
				$scope.item.jurusan = { 'id': dataSelected.jurusanpeminatanfk, 'jurusanpeminatan': dataSelected.jurusanpeminatan }
				$scope.item.programStudi = { 'id': dataSelected.fakultasfk, 'fakultas': dataSelected.fakultas }
				
			}
			$scope.hapus = function () {
				if ($scope.item.norec == undefined) {
					toastr.error('Pilih data yang mau di hapus')
					return
				}
				medifirstService.post('sdm/pendidikan/hapus-peserta-didik', { norec:$scope.item.norec }).then(function (e) {
					init();
				})
			}
			$scope.simpan = function () {
				if ($scope.item.nama == undefined) {
					toastr.error('Nama Harus di isi')
					return
				}
				if ($scope.item.alamat == undefined) {
					toastr.error('Alamat Harus di isi')
					return
				}

				if ($scope.item.tempatLahir == undefined) {
					toastr.error('Tempat Lahir Harus di isi')
					return
				}

				if ($scope.item.tanggalLahir == undefined) {
					toastr.error('Tgl Lahir Harus di isi')
					return
				}

				// var listRawRequired = [
				// "item.nim|ng-model|NIM",
				// "item.nama|ng-model|Nama Lengkap",
				// "item.jenisKelamin|k-ng-model|Jenis Kelamin",
				// "item.agama|k-ng-model|Agama",
				// "item.noHp|ng-model|No HP",
				// "item.tempatLahir|ng-model|Tampat Lahir",
				// "item.tanggalLahir|k-ng-model|Tanggal Lahir",
				// "item.alamat|ng-model|Alamat",
				// "item.institusiPendidikan|k-ng-model|Institusi Pendidikan",
				// "item.jurusan|k-ng-model|Jurusan",
				// "item.programStudi|k-ng-model|Program Studi"
				// ];

				// var isValid = ModelItem.setValidation($scope, listRawRequired);
				// if(isValid.status){
				var tempData = {
					"norec": $scope.item.norec,
					"nim": $scope.item.nim,
					"nama": $scope.item.nama,
					"jeniskelaminfk": $scope.item.jenisKelamin.id,
					"agamafk": $scope.item.agama.id,
					"nomorhp": $scope.item.noHp,
					"tempatlahir": $scope.item.tempatLahir,
					"tanggallahir": moment(new Date($scope.item.tanggalLahir)).format('YYYY-MM-DD'),
					"alamat": $scope.item.alamat,
					"institusipendidikanfk": $scope.item.institusiPendidikan == undefined ? null : $scope.item.institusiPendidikan.id,
					"jurusanpeminatanfk": $scope.item.jurusan == undefined ? null : $scope.item.jurusan.id,
					"fakultasfk": $scope.item.programStudi == undefined ? null : $scope.item.programStudi.id
				}
				medifirstService.post("sdm/pendidikan/save-pesertadidik", tempData).then(function (e) {
					$scope.item = {};
					init();
				});
				// } else {
				// 	ModelItem.showMessages(isValid.messages);
				// }

			}
			$scope.batal = function () {
				$scope.item = {};
			}
		}
	]);
});
