define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('ManajemenSanitasiCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

			if ($state.params.jenis == 1) {
				$scope.title = 'Manajemen Kebersihan Tempat Tidur'
			}
			if ($state.params.jenis == 2) {
				$scope.title = 'Manajemen Kebersihan Area RS'
			}
			if ($state.params.jenis == 3) {
				$scope.title = 'Manajemen Pest Control'
			}
			if ($state.params.jenis == 4) {
				$scope.title = 'Manajemen Saluran Air Limbah'
			}

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = $scope.now
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.cboUbahSEP = true;
			$scope.cboSep = false;
			$scope.item.jmlRows = 50
			loadCombo();
			loadData();
			// postIKTvisite()

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienOperatorCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					// if(arrPeriode[2]!= "")
					// 	$scope.item.noReg = arrPeriode[2];	
					// if(arrPeriode[3]!= "")	
					// 	$scope.item.noRm = arrPeriode[3];	
					// if(arrPeriode[4]!= "")
					// 	$scope.item.nama = arrPeriode[4];			
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					// $scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("sanitasi/get-combo-sanitasi", false).then(function (data) {
					$scope.listRuangan = data.data.dataruangan;
					$scope.listKelas = data.data.kelas;
				

				});
			
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return ''
				else
					return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}


			$scope.columnGrid = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarRegistrasiPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:K1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Registrasi Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "30px",
					},
				
				
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},
					{
						"field": "namakelas",
						"title": "Kelas ",
						"width": "80px",
						// "template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
					},
					{
						"field": "namakamar",
						"title": "Nama Kamar",
						"width": "150px",
						"template": '# if( namakamar==null) {# - # } else {# #= namakamar # #} #'
					},
					{
						"field": "reportdisplay",
						"title": "Tempat Tidur",
						"width": "100px",
						// "template": "<span class='style-left'>#: kelompokpasien #</span>"
					},
							
				]
			};


			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				$scope.isRouteLoading = true;
				var ruanganId = ''
				if($scope.item.ruangan != undefined)
				ruanganId = $scope.item.ruangan.id
				
				var kelasId = ''
				if($scope.item.kelas != undefined)
				kelasId = $scope.item.kelas
				
				var tempatTidur = ''
				if($scope.item.tempatTidur != undefined)
				tempatTidur = $scope.item.tempatTidur

				medifirstService.get("sanitasi/get-tempat-tidur?ruangaId="+ruanganId+ 
				"&idkelas="+ kelasId+ "&namabed="+tempatTidur )
					.then(function (data) {
						$scope.isRouteLoading = false;
					
						for (let i = 0; i <  data.data.length; i++) {
							const element =  data.data[i];
							element.no = i +1
						}
						$scope.dataSource = new kendo.data.DataSource({
							data: data.data,
							pageSize: 10,
							// total: data[0].data,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});


				
					});

			};


			var HttpClient = function () {
				this.get = function (aUrl, aCallback) {
					var anHttpRequest = new XMLHttpRequest();
					anHttpRequest.onreadystatechange = function () {
						if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
							aCallback(anHttpRequest.responseText);
					}

					anHttpRequest.open("GET", aUrl, true);
					anHttpRequest.send(null);
				}
			}

			//emd
		}
	]);
});