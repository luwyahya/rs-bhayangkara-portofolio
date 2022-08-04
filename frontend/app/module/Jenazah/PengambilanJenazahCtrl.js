define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PengambilanJenazahCtrl', ['$state', '$q', '$rootScope', '$scope', 'DateHelper', 'CacheHelper', 'MedifirstService',
		function ($state, $q, $rootScope, $scope, dateHelper, cacheHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.item = {};
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			init();

			function init() {
				loadData();
			}

			function loadData() {
				$scope.isRouteLoading = true;
				$scope.item.tanggalpengambilan = $scope.now;
				var objectpasiendaftarfk = '';
				objectpasiendaftarfk = "&objectpasiendaftarfk=" + localStorage.getItem("objectpasiendaftarfk");
				$scope.item.objectpasiendaftarfk = localStorage.getItem("objectpasiendaftarfk");
				medifirstService.get("jenazah/get-data-pasien?" + objectpasiendaftarfk).then(function (dat) {
					$scope.item.noregistrasi = dat.data[0].noregistrasi;
					$scope.item.nocm = dat.data[0].nocm;
					$scope.item.namapasien = dat.data[0].namapasien;
					$scope.item.jeniskelamin = dat.data[0].jeniskelamin;
					$scope.item.tglpendaftaran = dat.data[0].tglregistrasi;
					$scope.item.tglmeninggal = dat.data[0].tglmeninggal;
					var tanggal = $scope.now;
					var tanggalLahir = new Date(dat.data[0].tgllahir);
					var umur = dateHelper.CountAge(tanggalLahir, tanggal);
					$scope.item.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
					$scope.isRouteLoading = false;
				});
			}

			//// save 
			$scope.simpan = function () {
				$scope.isRouteLoading = true;
				var norec = "";
				var objectpasiendaftarfk = "";
				var tanggalpengambilan = "";
				var namapengambil = null;
				var objecthubunganfk = null;
				var alamatlengkap = null;
				var keterangan = null;
				var objectpegawaifk = "";
				var noregistrasi = "";

				if ($scope.item.norec != undefined) {
					norec = $scope.item.norec
				}

				if ($scope.item.objectpasiendaftarfk == undefined || $scope.item.objectpasiendaftarfk == "") {
					alert("Data pasien harus di isi!")
					return
				} else {
					objectpasiendaftarfk = $scope.item.objectpasiendaftarfk
				}

				if ($scope.item.tanggalpengambilan != undefined) {
					tanggalpengambilan = $scope.item.tanggalpengambilan
				}

				if ($scope.item.namapengambil != undefined) {
					namapengambil = $scope.item.namapengambil
				}

				if ($scope.item.hubungan.id != undefined) {
					objecthubunganfk = $scope.item.hubungan.id
				}

				if ($scope.item.alamatlengkap != undefined) {
					alamatlengkap = $scope.item.alamatlengkap
				}

				if ($scope.item.keterangan != undefined) {
					keterangan = $scope.item.keterangan
				}

				if ($scope.item.dokterpenanggungjawab.id != undefined) {
					objectpegawaifk = $scope.item.dokterpenanggungjawab.id
				}

				var data = {
					norec: norec,
					objectpasiendaftarfk: objectpasiendaftarfk,
					tanggalpengambilan: moment(tanggalpengambilan).format('YYYY-MM-DD hh:mm:ss'),
					namapengambil: namapengambil,
					objecthubunganfk: objecthubunganfk,
					alamatlengkap: alamatlengkap,
					keterangan: keterangan,
					objectpegawaifk: objectpegawaifk,
					objectruanganmeninggalfk : $scope.item.ruanganmeninggal != undefined ? $scope.item.ruanganmeninggal.id : null,
				}

				var objSave = {
					pengambilanjenazah: data
				}

				medifirstService.post("jenazah/simpan-data-pengambilan-jenazah", objSave).then(function (e) {
					$scope.isRouteLoading = false;
					if (e.status == 201) {
						$scope.item = {};
					}
					$state.go('DaftarPasienForensikDanMedikolegal');
				});
			}

			$scope.cari = function () {
				// $scope.isRouteLoading = true;
				loadData()
			}

			$scope.batal = function () {
				$scope.item.tglmeninggal = null;
				$scope.item.ruanganmeninggal = null;
				$scope.item.dokterpenanggungjawab = null;
				$scope.item.tanggalpengambilan = null;
				$scope.item.namapengambil = null;
				$scope.item.hubungan = null;
				$scope.item.alamatlengkap = null;
				$scope.item.keterangan = null;
				$state.go('DaftarPasienForensikDanMedikolegal');
			}

			medifirstService.get("jenazah/get-data-for-combo").then(function (dat) {
				$scope.listruangan = dat.data.ruangan;
				$scope.listdokter = dat.data.dokter;
				$scope.listhubungankeluarga = dat.data.hubunganKeluarga;

			});

		//** BATAS SUCI */
		}
	]);
});