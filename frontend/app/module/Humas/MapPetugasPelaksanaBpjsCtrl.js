define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MutasiRawatInapCtrl', [ '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ( $state, $q, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			// $scope.cboDokter =false;	
			// $scope.pasienPulang =false;		
			// $scope.cboUbahDokter =true;
			$scope.isRouteLoading = false;

			loadCombo();
			loadData();

			loadData()
			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarPasienEmergencyRevCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')//$scope.now;
					$scope.item.periodeAkhir =moment($scope.now).format('YYYY-MM-DD 23:59:00')//$scope.now;
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get("igd/get-data-combo", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
				})
				// $scope.listStatus = manageKasir.getStatus();
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

			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}
				var rm = ""
				if ($scope.item.noRm != undefined) {
					var reg = "&norm=" + $scope.item.noRm
				}
				var nm = ""
				if ($scope.item.nama != undefined) {
					var nm = "&nama=" + $scope.item.nama
				}
				var ins = ""
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
				}
				var rg = ""
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
				}
				var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}


				$q.all([
					medifirstService.get("igd/get-daftar-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.daftar.length; i++) {
						data[0].data.daftar[i].no = i + 1
						var tanggal = $scope.now;
						var tanggalLahir = new Date(data[0].data.daftar[i].tgllahir);
						var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
						data[0].data.daftar[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
						//itungUsia(dat.data[i].tgllahir)
					}

					$scope.dataDaftarPasienPulang = data[0].data.daftar;
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarPasienEmergencyRevCtrl', chacePeriode);
				});

			};
			$scope.columnDaftarPasienPulang = [
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
					"field": "jeniskelamin",
					"title": "Jenis Kelamin",
					"width": "100px",
					"template": "<span class='style-center'>#: jeniskelamin #</span>"
				},
				{
					"field": "umurzz",
					"title": "Umur",
					"width": "100px",
					"template": "<span class='style-center'>#: umurzz #</span>"
				},
				{
					"field": "namaruangan",
					"title": "Ruangan",
					"width": "150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
				{
					"field": "namadokter",
					"title": "Nama Dokter",
					"width": "130px",
					"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien",
					"width": "100px",
					"template": "<span class='style-left'>#: kelompokpasien #</span>"
				},
				{
					"field": "namakelas",
					"title": "Kelas",
					"width": "100px",
					"template": "<span class='style-left'>#: namakelas #</span>"
				},
				{
					"field": "nostruk",
					"title": "No Verifikasi",
					"width": "100px",
					"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
				},


			];

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
				}
			}


		}
	]);
});