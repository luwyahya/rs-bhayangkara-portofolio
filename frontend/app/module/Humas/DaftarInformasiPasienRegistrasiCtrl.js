define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarInformasiPasienRegistrasiCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.jmlRujukanKeluar = 0
			loadCombo();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarInformasiPasienRegistrasiCtrl');
				if (chacePeriode != undefined) {
					$scope.item.periodeAwal = new Date(chacePeriode[0]);;
					$scope.item.periodeAkhir = new Date(chacePeriode[1]);

					if (chacePeriode[2] != undefined) {
						$scope.item.noReg = chacePeriode[2]
					}

					if (chacePeriode[3] != undefined) {
						$scope.item.noRm = chacePeriode[3]
					}

					if (chacePeriode[4] != undefined) {
						$scope.item.nama = chacePeriode[4]
					}

					if (chacePeriode[5] != undefined) {
						$scope.listDepartemen = [chacePeriode[5]]
						$scope.item.instalasi = chacePeriode[5]
					}

					if (chacePeriode[6] != undefined) {
						$scope.listRuangan = [chacePeriode[6]]
						$scope.item.ruangan = chacePeriode[6]
					}

					if (chacePeriode[7] != undefined) {
						$scope.item.listKelompokPasien = [chacePeriode[7]]
						$scope.item.kelompokpasien = chacePeriode[7]
					}

					if (chacePeriode[8] != undefined) {
						$scope.item.dokter = chacePeriode[8]
						$scope.item.listDokter2 = chacePeriode[8]
					}

					if (chacePeriode[9] != undefined) {
						$scope.item.jmlRows = chacePeriode[9]
					}

				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get("humas/get-daftar-combo", false).then(function (data) {
					$scope.listDepartemen = data.data.datadept;
					$scope.listKelompokPasien = data.data.kelompokpasien;
				})

				medifirstService.getPart("humas/get-daftar-combo-pegawai", true, true, 20).then(function (data) {
					$scope.listDokter2 = data
				});
			}

			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = {
				toolbar: ["excel"],
				excel: {
					fileName: "DaftarRegistrasiPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
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
				columns:
					[
						{
							"field": "no",
							"title": "No",
							"width": "45px"
						},
						{
							"field": "tglregistrasi",
							"title": "Tgl Registrasi",
							"width": "80px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
						},
						{
							"field": "noregistrasi",
							"title": "NoReg",
							"width": "80px"
						},
						{
							"field": "nocm",
							"title": "NoRM",
							"width": "80px",
							"template": "<span class='style-center'>#: nocm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "150px",
							"template": "<span class='style-left'>#: namapasien #</span>"
						},
						{
							"field": "notelepon",
							"title": "Telp",
							"width": "150px",
							"template": "<span class='style-left'>#: notelepon #</span>"
						},
						{
							"field": "alamatlengkap",
							"title": "Alamat",
							"width": "150px",
							"template": "<span class='style-left'>#: alamatlengkap #</span>"
						},
						{
							"field": "namaruangan",
							"title": "Nama Ruangan",
							"width": "150px",
							"template": "<span class='style-left'>#: namaruangan #</span>"
						},
						{
							"field": "departemen",
							"title": "Departemen",
							"width": "150px",
							"template": "<span class='style-left'>#: departemen #</span>"
						},
						{
							"field": "namadokter",
							"title": "Nama Dokter",
							"width": "150px",
							"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
						},
						{
							"field": "kelompokpasien",
							"title": "Kelompok Pasien",
							"width": "100px",
							"template": "<span class='style-left'>#: kelompokpasien #</span>"
						},
						{
							"field": "tglpulang",
							"title": "Tgl Pulang",
							"width": "80px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
						},
						{
							"field": "statuspasien",
							"title": "Status",
							"width": "80px",
							"template": "<span class='style-center'>#: statuspasien #</span>"
						},
						{
							"field": "nostruk",
							"title": "NoStrukVerif",
							"width": "100px",
							"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
						},
						{
							"field": "nosbm",
							"title": "NoSBM",
							"width": "100px",
							"template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
						},
						{
							"field": "kasir",
							"title": "Kasir",
							"width": "100px",
							"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
						},
						{
							"field": "nosep",
							"title": "No SEP",
							"width": "150px",
							"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
						}
					]
			};


			$scope.SearchData = function () {
				loadData()
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg = ""
				var tempNoReg = "";
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
					tempNoReg = $scope.item.noReg

				}
				var rm = ""
				var tempNoRm = "";
				if ($scope.item.noRm != undefined) {
					var rm = "&norm=" + $scope.item.noRm
					tempNoRm = $scope.item.noRm;
				}
				var nm = ""
				var tempNamaOrReg = ""
				if ($scope.item.nama != undefined) {
					var nm = "&nama=" + $scope.item.nama
					tempNamaOrReg = $scope.item.nama;
				}
				var ins = ""
				var tempInstalasiIdArr = {};
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
					tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
				}
				var rg = ""
				var tempRuanganIdArr = {};
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
					tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
				}
				var kp = ""
				var tempKelompokArr = {};
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
					tempKelompokArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompokpasien }
				}
				var dk = ""
				var tempDokterArr = {};
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
					tempDokterArr = { id: $scope.item.dokter.id, kelompokpasien: $scope.item.dokter.namalengkap }
				}

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}

				$q.all([
					medifirstService.get("humas/get-daftar-registrasi-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (let i = 0; i < data[0].data.length; i++) {
						const element = data[0].data[i];
						element.no = i + 1;						
					}
					// $scope.dataDaftarPasienPulang = data[0].data;
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

					var chacePeriode = {
						0: tglAwal,
						1: tglAkhir,
						2: tempNoReg,
						3: tempNoRm,
						4: tempNamaOrReg,
						5: tempInstalasiIdArr,
						6: tempRuanganIdArr,
						7: tempKelompokArr,
						8: tempDokterArr,
						9: jmlRows
					}
					cacheHelper.set('DaftarInformasiPasienRegistrasi', chacePeriode);
				});

			};

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
				}
			}

			//////////////////////////////////////////////////////////////////		END		////////////////////////////////////////////////////////////////////////

		}
	]);
});