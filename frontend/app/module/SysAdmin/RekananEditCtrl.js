define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RekananEditCtrl', ['$q', '$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService',
		function ($q, $scope, $state, modelItem, $mdDialog, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.isRouteLoading = false;
			Formload()
			loadData()

			function Formload() {
				$scope.isRouteLoading = true;
				$scope.dataLogin = medifirstService.getPegawaiLogin();
				medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
					$scope.listPegawai = data;
				});

				medifirstService.getPart("sysadmin/general/get-desa-kelurahan", true, true, 10).then(function (data) {
					$scope.listDataKelurahan = data;
				});

				$q.all([
                    medifirstService.get("sysadmin/master/get-data-combo-master"),
                    medifirstService.get("sysadmin/general/get-combo-address"),
                ]).then(function (result) {
					$scope.isRouteLoading = false;			
					var dataCombomaMaster = result[0].data;
					var dataCombomaAlamat = result[1].data;
					$scope.listKelompokPasien = dataCombomaMaster.kelompokpasien;
					$scope.listjenisrekanan = dataCombomaMaster.jenisrekanan;

					$scope.listDataKecamatan = dataCombomaAlamat.kecamatan
					$scope.listDataKecamatan = dataCombomaAlamat.kecamatan
					$scope.listDataKotaKabupaten = dataCombomaAlamat.kotakabupaten
					$scope.listDataPropinsi = dataCombomaAlamat.propinsi
				});																
			}

			function loadData() {
				$scope.isRouteLoading = true;
				if ($state.params.idx != "") {
					$scope.item.id = $state.params.idx;
					medifirstService.get("sysadmin/master/get-rekanan-perkode?idRekanan=" + $scope.item.id, true).then(function (e) {
						var datax = e.data;	
						$scope.isRouteLoading = false;					
						$scope.item.id = e.data[0].id;
						$scope.item.kdprofile = e.data[0].kdprofile;
						$scope.item.statusenabled = e.data[0].statusenabled;
						$scope.item.norec = e.data[0].norec;
						$scope.item.kdRekanan = e.data[0].kdrekanan;
						$scope.item.namaRekanan = e.data[0].namarekanan;
						$scope.item.jenisrekanan = { id: e.data[0].objectjenisrekananfk, jenisrekanan: "" };
						$scope.item.pegawai = { id: e.data[0].objectpegawaifk, pegawai: "" };
						$scope.item.kdExternal = e.data[0].kodeexternal;
						$scope.item.namaExternal = e.data[0].namaexternal;
						$scope.item.reportDisplay = e.data[0].reportdisplay;
						$scope.item.namadirektur = e.data[0].namadirektur;
						$scope.item.jabatan = e.data[0].jabatan;
						$scope.item.alamatLengkap = e.data[0].alamatlengkap;
						$scope.item.rtrw = e.data[0].rtrw;
						$scope.item.desakelurahan = { id: e.data[0].objectdesakelurahanfk, desakelurahan: "" };
						$scope.item.kecamatan = { id: e.data[0].objectkecamatanfk, kecamatan: "" };
						$scope.item.propinsi = { id: e.data[0].objectpropinsifk, produsenProduk: "" };
						$scope.item.kotakabupaten = { id: e.data[0].objectkotakabupatenfk, kotakabupaten: "" };
						$scope.item.desaKelurahan = e.data[0].namadesakelurahan;
						$scope.item.kecamatanTx = e.data[0].namakecamatan;
						$scope.item.kodePos = e.data[0].kodepos;
						$scope.item.namaKotaKabupaten = e.data[0].namakotakabupaten;
						$scope.item.contactPerson = e.data[0].contactperson;
						$scope.item.email = e.data[0].email;
						$scope.item.faksimile = e.data[0].faksimile;
						$scope.item.telepon = e.data[0].telepon;
						$scope.item.website = e.data[0].kekuatan;
						$scope.item.bankRekeningAtasNama = e.data[0].bankrekeningatasnama;
						$scope.item.bankRekeningNama = e.data[0].bankrekeningnama;
						$scope.item.bankRekeningNomor = e.data[0].bankrekeningnomor
						$scope.item.noPkp = e.data[0].nopkp;
						$scope.item.npwp = e.data[0].npwp;
						$scope.item.perjanjianKerjasama = e.data[0].perjanjiankerjasama;
						$scope.item.idMap = e.data[0].idmap;
						$scope.item.kelompokPasien = { id: e.data[0].objectkelompokpasienfk, kelompokpasien: "" };

					})
				}else{
					$scope.isRouteLoading = false;
				}
			}

			
            $scope.findKodePos = function (kdPos) {
                if (!kdPos) return;
                $scope.isBusy = true;
                medifirstService.get('sysadmin/general/get-alamat-bykodepos?kodePos=' + kdPos).then(function (res) {
                    if (res.data.data.length > 0) {
                        var data = {
                            id: res.data.data[0].objectdesakelurahanfk,
                            namadesakelurahan: res.data.data[0].namadesakelurahan,
                            kodepos: res.data.data[0].kodepos,
                            namakecamatan: res.data.data[0].namakecamatan,
                            namakotakabupaten: res.data.data[0].namakotakabupaten,
                            namapropinsi: res.data.data[0].namapropinsi,
                            objectkecamatanfk: res.data.data[0].objectkecamatanfk,
                            objectkotakabupatenfk: res.data.data[0].objectkotakabupatenfk,
                            objectpropinsifk: res.data.data[0].objectpropinsifk,
                            desa: res.data.data[0].namadesakelurahan,
                        }
                        $scope.listDataKelurahan.add(data)
                        $scope.item.desaKelurahan = data
                        $scope.item.kecamatan = { id: data.objectkecamatanfk, namakecamatan: data.namakecamatan }
                        $scope.item.kotaKabupaten = { id: data.objectkotakabupatenfk, namakotakabupaten: data.namakotakabupaten }
                        $scope.item.propinsi = { id: data.objectpropinsifk, namapropinsi: data.namapropinsi }
                    }
                    $scope.isBusy = false;
                }, function (error) {
                    $scope.isBusy = false;
                })
			}
			
			$scope.findAddress = function (desa) {
                if (desa.objectkecamatanfk)
                    $scope.item.kecamatan = { id: desa.objectkecamatanfk, namakecamatan: desa.namakecamatan }
                if (desa.objectkotakabupatenfk)
                    $scope.item.kotaKabupaten = { id: desa.objectkotakabupatenfk, namakotakabupaten: desa.namakotakabupaten }
                if (desa.objectpropinsifk)
                    $scope.item.propinsi = { id: desa.objectpropinsifk, namapropinsi: desa.namapropinsi }
                if (desa.kodepos)
                    $scope.item.kodePos = desa.kodepos
            }

			$scope.kembali = function () {
				$state.go('MasterRekanan')
			}

			$scope.simpan = function () {
				if ($scope.item.namaRekanan == undefined) {
					alert("Nama Rekanan harus di isi!")
					return
				}

				// if ($scope.item.alamatLengkap == undefined) {
				// 	alert("Alamat harus di isi!")
				// 	return
				// }

				if ($scope.item.jenisrekanan == undefined) {
					alert("Jenis Rekanan harus di isi!")
					return
				}
				var alamatlengkap = "";
				if ($scope.item.alamatLengkap != undefined) {
					alamatlengkap = $scope.item.alamatLengkap
				} else alamatlengkap = "";

				var idRekanan = "";
				if ($scope.item.id != undefined) {
					idRekanan = $scope.item.id
				}

				var namaKotaKabupaten = "";
				if ($scope.item.id != undefined) {
					namaKotaKabupaten = $scope.item.namaKotaKabupaten
				} else namaKotaKabupaten = null;

				var desakelurahanid = "";
				if ($scope.item.desakelurahan != undefined) {
					desakelurahanid = $scope.item.desakelurahan.id
				} else desakelurahanid = null;

				var kecamatanid = "";
				if ($scope.item.kecamatan != undefined) {
					kecamatanid = $scope.item.kecamatan.id
				} else kecamatanid = null;

				var kotakabupatenid = "";
				if ($scope.item.kotakabupaten != undefined) {
					kotakabupatenid = $scope.item.kotakabupaten.id
				} else kotakabupatenid = null;

				var pegawaiid = "";
				if ($scope.item.pegawai != undefined) {
					pegawaiid = $scope.item.pegawai.id
				} else pegawaiid = null;

				var propinsiid = "";
				if ($scope.item.propinsi != undefined) {
					propinsiid = $scope.item.propinsi.id
				} else propinsiid = null;

				var bankRekeningNama = "";
				if ($scope.item.bankRekeningNama != undefined) {
					bankRekeningNama = $scope.item.bankRekeningNama
				} else bankRekeningNama = null;

				var bankRekeningNomor = "";
				if ($scope.item.bankRekeningNomor != undefined) {
					bankRekeningNomor = $scope.item.bankRekeningNomor
				} else bankRekeningNomor = null;

				var contactPerson = "";
				if ($scope.item.contactPerson != undefined) {
					contactPerson = $scope.item.contactPerson
				} else contactPerson = null;

				var desaKelurahan = "";
				if ($scope.item.desaKelurahan != undefined) {
					desaKelurahan = $scope.item.desaKelurahan
				} else desaKelurahan = null;

				var email = "";
				if ($scope.item.email != undefined) {
					email = $scope.item.email
				} else email = null;

				var faksimile = "";
				if ($scope.item.faksimile != undefined) {
					faksimile = $scope.item.faksimile
				} else faksimile = null;

				var kodePos = "";
				if ($scope.item.kodePos != undefined) {
					kodePos = $scope.item.kodePos
				} else kodePos = null;

				var kotaKabupaten = "";
				if ($scope.item.kotaKabupaten != undefined) {
					kotaKabupaten = $scope.item.kotaKabupaten
				} else kotaKabupaten = null;

				var noPkp = "";
				if ($scope.item.noPkp != undefined) {
					noPkp = $scope.item.noPkp
				} else noPkp = null;

				var npwp = "";
				if ($scope.item.npwp != undefined) {
					npwp = $scope.item.npwp
				} else npwp = null;

				var rtrw = "";
				if ($scope.item.rtrw != undefined) {
					rtrw = $scope.item.rtrw
				} else rtrw = null;

				var telepon = "";
				if ($scope.item.telepon != undefined) {
					telepon = $scope.item.telepon
				} else telepon = null;

				var website = "";
				if ($scope.item.website != undefined) {
					website = $scope.item.website
				} else website = null;

				var namaDesaKelurahan = "";
				if ($scope.item.namaDesaKelurahan != undefined) {
					namaDesaKelurahan = $scope.item.namaDesaKelurahan
				} else namaDesaKelurahan = null;
				
				var namadirektur = "";
				if ($scope.item.namadirektur != undefined) {
					namadirektur = $scope.item.namadirektur
				} else namadirektur = null;
				
				var jabatan = "";
				if ($scope.item.jabatan != undefined) {
					jabatan = $scope.item.jabatan
				} else jabatan = null;

				var namaKecamatan = "";
				if ($scope.item.namaKecamatan != undefined) {
					namaKecamatan = $scope.item.namaKecamatan
				} else namaKecamatan = null;

				var namaKotaKabupaten = "";
				if ($scope.item.namaKotaKabupaten != undefined) {
					namaKotaKabupaten = $scope.item.namaKotaKabupaten
				} else namaKotaKabupaten = null;

				var rekananmoupksfk = "";
				if ($scope.item.rekananmoupksfk != undefined) {
					rekananmoupksfk = $scope.item.rekananmoupksfk
				} else rekananmoupksfk = null;

				var perjanjianKerjasama = "";
				if ($scope.item.perjanjianKerjasama != undefined) {
					perjanjianKerjasama = $scope.item.perjanjianKerjasama
				} else perjanjianKerjasama = null;

				var kelompokpasienId = "";
				if ($scope.item.kelompokPasien != undefined) {
					kelompokpasienId = $scope.item.kelompokPasien.id
				} else kelompokpasienId = null;

				var idmap = "";
				if ($scope.item.idMap != undefined) {
					idmap = $scope.item.idMap
				}
				debugger
				var rekanan = {
					//  kdruangan: $scope.item.kdRuangan,
					idrekanan: idRekanan,
					namarekanan: $scope.item.namaRekanan,
					objectjenisrekananfk: $scope.item.jenisrekanan.id,
					alamatlengkap: alamatlengkap,
					namakotakabupaten: namaKotaKabupaten,
					//objectaccountfk: $scope.item.account.id,
					objectdesakelurahanfk: desakelurahanid,
					objectkecamatanfk: kecamatanid,
					objectkotakabupatenfk: kotakabupatenid,
					objectpegawaifk: pegawaiid,
					objectpropinsifk: propinsiid,
					// objectrekananheadfk: $scope.item.rekananhead.id,
					bankrekeningnama: bankRekeningNama,
					bankrekeningnomor: bankRekeningNomor,
					contactperson: contactPerson,
					desakelurahan: desaKelurahan,
					email: email,
					faksimile: faksimile,
					kodepos: kodePos,
					kotakabupaten: kotaKabupaten,
					nopkp: noPkp,
					npwp: npwp,
					rtrw: rtrw,
					telepon: telepon,
					website: website,
					namadirektur: namadirektur,
					jabatan: jabatan,
					namadesakelurahan: namaDesaKelurahan,
					namakecamatan: namaKecamatan,
					namakotakabupaten: namaKotaKabupaten,
					rekananmoupksfk: rekananmoupksfk,
					perjanjiankerjasama: perjanjianKerjasama,
					idMap: idmap,
					objectkelompokpasienfk: kelompokpasienId
				}
				debugger
				var objSave = {
					rekanan: rekanan
				}
				// saveDataRekanan
				medifirstService.post('sysadmin/master/save-data-rekanan',objSave).then(function (e) {
					$scope.item = {};
					var confirm = $mdDialog.confirm()
						.title('Caution')
						.textContent('Apakah Anda Akan Menambah Data Lagi?')
						.ariaLabel('Lucky day')
						.cancel('Ya')
						.ok('Tidak')
					$mdDialog.show(confirm).then(function () {
						$state.go("MasterRekanan");
					})
				});
			}

			$scope.batal = function () {
				$scope.showEdit = false;
				$scope.item = {};
			}
			/////////////////////////////////////////////////////////		END			////////////////////////////////////////////////////////////////////
		}
	]);
});