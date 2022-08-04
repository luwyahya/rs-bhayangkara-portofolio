define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarRiwayatPasienCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

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
				var chacePeriode = cacheHelper.get('DaftarRiwayatPasienCtrl');
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
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					$scope.listDepartemen = data.data.ruanganall;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;							

				});
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
					//  debugger;
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
					$scope.listDataPegawai = e;
				})
				$scope.listJenis = [{ "id": 1, "name": "Hapus Semua" }, { "id": 2, "name": "Batal Rawat Inap" }]
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


			$scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarRiwayatPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:H1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Riwayat Pasien",
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
						"field": "tglregistrasi",
						"title": "Tgl Registrasi",
						"width": "80px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
					},
					{
						"field": "notransaksi",
						"title": "No Transaksi",
						"width": "90px"
					},
					{
						"field": "norec",
						"title": "NoRM",
						"width": "70px",
						"template": "<span class='style-center'>#: norec #</span>"
					},
					{
						"field": "namapasien",
						"title": "Nama Pasien",
						"width": "150px",
						"template": "<span class='style-left'>#: namapasien #</span>"
					},
					{
						"field": "namaruangan",
						"title": "Poliklinik",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},					
					{
						"field": "namadokter",
						"title": "Nama Dokter",
						"width": "150px",
						"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
					},
					// {
					// 	"field": "carabayar",
					// 	"title": "Penjamin",
					// 	"width": "100px",
					// 	"template": '# if( carabayar==null) {# - # } else {# #= carabayar # #} #'
					// },
					// {
					// 	"field": "statuspasien",
					// 	"title": "Status Pasien",
					// 	"width":"100px",
					// }				
				]
			};


			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				
				var rm = ""
				if ($scope.item.noRm != undefined) {
					var rm = "&norm=" + $scope.item.noRm
				}
				var nm = ""
				if ($scope.item.nama != undefined) {
					var nm = "&nama=" + $scope.item.nama
				}				
				var rg = ""
				if ($scope.item.instalasi != undefined) {
					var rg = "&ruangId=" + $scope.item.instalasi.id
				}
				var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}				
				var cacheNoRm = ""
				if ($scope.item.noRm != undefined) {
					cacheNoRm = $scope.item.noRm
				}
				var cacheNama = ""
				if ($scope.item.nama != undefined) {
					cacheNama = $scope.item.nama
				}
				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}


				$q.all([
					medifirstService.get("registrasi/daftar-registrasi/get-daftar-registrasi-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir + rm + nm  + rg + kp + dk
						+ '&jmlRows=' + jmlRows),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.length; i++) {
						data[0].data[i].no = i + 1
						var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
						data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr'
					}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 10,
						total: data[0].data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});


					var chacePeriode = tglAwal + "~" + tglAkhir
					// + "~" +cacheNoreg + "~" +cacheNoRm
					// + "~" +cacheNama
					// + "~" +$scope.item.instalasi 
					// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
					// + "~" +$scope.item.dokter;
					cacheHelper.set('DaftarRiwayatPasienCtrl', chacePeriode);
				});

			};
						
						

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
					// $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
				}
			}
						

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
			
			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			
			
			$scope.formatJam24 = {
				value: new Date(),			//set default value
				format: "dd-MM-yyyy HH:mm",	//set date format
				timeFormat: "HH:mm",		//set drop down time format to 24 hours
			}			
					
			
			function clearHapusRegis() {
				delete $scope.item.pembatalan
				delete $scope.item.alasanBatal
				delete $scope.item.ruanganBatal
				delete $scope.item.password
				delete $scope.item.jenis
			}

			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					).then(function (e) {
						if (e.data.data.length > 0) {

							var arrrStr = {
								0: e.data.data[0].norm,
								1: $scope.dataPasienSelected.namapasien,
								2: $scope.dataPasienSelected.jeniskelamin,
								3: $scope.dataPasienSelected.noregistrasi,
								// 4: $scope.dataPasienSelected.umur,
								5: $scope.dataPasienSelected.kelompokpasien,
								6: $scope.dataPasienSelected.tglregistrasi,
								7: e.data.data[0].norec_apd,
								8: $scope.dataPasienSelected.norec,
								// 9: $scope.dataPasienSelected.objectkelasfk,
								// 10: $scope.dataPasienSelected.namakelas,
								11: $scope.dataPasienSelected.ruanganid,
								12: $scope.dataPasienSelected.namaruangan
							}
							cacheHelper.set('cacheRekamMedis', arrrStr);
							
								$state.go('RekamMedisDbLama.ResumeDBLama', {
									noRec: e.data.data[0].notransaksi
								})							
						}
					})

			}
			// hasil hasil
			
			//emd
		}
	]);
});