define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterBarangInvestasiCtrl', ['$q', '$scope', 'ModelItem', 'CacheHelper', 'DateHelper','MedifirstService', '$mdDialog',
		function ($q, $scope, ModelItem, cacheHelper,dateHelper, medifirstService, $mdDialog) {
			$scope.item = {};
			$scope.isUnitt = true;
			var norecNoAsset = ''
			var JenisOrder = '';
			$scope.now = new Date();
			$scope.dataVOloaded = true;
			$scope.isRouteLoading = false;
			var norecNoAsset = '';
			var norecKalibrasi = '';
			var norecPemeliharaan = '';
			var JenisOrder = '';

			loadDataCombo();
			LoadCache();

			$scope.monthSelectorOptions = function () {
				return {
					start: "year",
					depth: "year"
				}
			}

			function loadDataCombo() {
				$scope.isRouteLoading = true;
				$scope.item.QtyAset = 1;
				medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
					$scope.ListPegawaiBPKB = data;
					$scope.ListPegawai = data;
				});

				medifirstService.getPart("logistik/get-daftar-produk-by-kodebmn", true, true, 20).then(function (data) {
					$scope.listProdukByKodeBMN = data;
				});

				medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
					$scope.listProduk = data;
					//$scope.listProdukByKodeBMN = data;
				});

				medifirstService.getPart("logistik/get-combo-rekanan-logistik", true, true, 20).then(function (data) {
					$scope.ListRekanan = data;
				});
				medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listStaff = data;
                }); 

				medifirstService.getPart("registrasi/get-desa-kelurahan-paging", true, true, 10).then(function (e) {
					$scope.listDataKelurahan = e;
				});
				
				$q.all([
					medifirstService.get("logistik/get-combo-logistik"),
					medifirstService.get("sysadmin/general/get-combo-address"),
				]).then(function (result) {
					$scope.isRouteLoading = false;
					var dataComboMaster = result[0].data;
					var dataComboAlamat = result[1].data;
					$scope.ListRuanganAsal = dataComboMaster.ruanganall;
					$scope.ListRuangan = dataComboMaster.ruanganall;
					$scope.ListJenisProduk = dataComboMaster.jenisproduk;
					$scope.ListDetailJenis = dataComboMaster.detailjenisproduk;
					$scope.ListFungsiProduk = dataComboMaster.fungsiproduk;
					$scope.ListBahanProduk = dataComboMaster.bahanproduk;
					$scope.ListTypeProduk = dataComboMaster.tipeproduk;
					$scope.ListWarnaProduk = dataComboMaster.warna;
					$scope.ListMerkProduk = dataComboMaster.merkproduk;
					$scope.ListSatuanStandar = dataComboMaster.satuan;
					$scope.ListJenisSertifikat = dataComboMaster.jenissertifikat;
					$scope.ListProdusenProduk = dataComboMaster.produsen;
					$scope.ListRekanan = dataComboMaster.rekanan;
					$scope.ListAsalBarang = dataComboMaster.asalproduk;
					$scope.ListKelompokAset = dataComboMaster.kelompokaset;


					$scope.listDataKecamatan = dataComboAlamat.kecamatan
					$scope.listDataKecamatan = dataComboAlamat.kecamatan
					$scope.listDataKotaKabupaten = dataComboAlamat.kotakabupaten
					$scope.listDataPropinsi = dataComboAlamat.propinsi
				});
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
						$scope.listDataKelurahan = data
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

			function LoadCache() {
				var chacePeriode = cacheHelper.get('MasterBarangInvestasiCtrl');
				if (chacePeriode != undefined) {
					norecNoAsset = chacePeriode[0]
					JenisOrder = chacePeriode[1]
					$scope.item.TglRegistrasi = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.TglProduksi = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm');
					if (norecNoAsset == '') {
						$scope.isUnit = false;
						// getDataLain();
					} else {
						$scope.isUnit = true;
						load();
					}
					var chacePeriode = {
						0: '',
						1: '',
						2: '',
						3: '',
						4: '',
						5: '',
						6: ''
					}
					cacheHelper.set('MasterBarangInvestasiCtrl', chacePeriode);
				} else {
					$scope.item.TglRegistrasi = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.TglProduksi = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm');
					$scope.item.kdRs='11.01.11.32.010207.00000.00000';
					load();
					// getDataLain();
					$scope.isUnit = false;
				}
			}

			$scope.getDataLain = function () {				
				var produkId = '';
				if ($scope.item.produk != undefined) {
					$scope.item.kodeBmn = {id:$scope.item.produk.id, kodebmn:$scope.item.produk.kodebmn};
					produkId = $scope.item.produk.id;
				} else {
					$scope.item.produk = {id:$scope.item.kodeBmn.id, namaproduk:$scope.item.kodeBmn.namaproduk};
					produkid = $scope.item.kodeBmn.id;
				}

				medifirstService.get("logistik/get-barang-for-regis?" + "kodeproduk=" + produkId, true).then(function (data) {
					var datas = data.data.datas[0];
					$scope.item.kdProduk = datas.kodeproduk;
					$scope.item.jenisProduk = { id: datas.jpid, jenisproduk: datas.jenisproduk };
					$scope.item.detailJenisProduk = { id: datas.djpid, detailjenisproduk: datas.detailjenisproduk };
					$scope.item.satuanStandar = { id: datas.ssid, satuanstandar: datas.satuanstandar };
					$scope.item.Lebar = 0;
					$scope.item.Panjang = 0;
					$scope.item.Tinggi = 0;
					$scope.item.Listrik = 0;
					$scope.item.UsiaPakai = 0;
					$scope.item.UsiaTeknis = 0;
					$scope.item.SisaUmur = 0;
					$scope.item.TglProduksi = $scope.now;
					$scope.item.MasaBerlakuSertifikat = 0;
					$scope.item.HargaPengadaan = 0;
					$scope.item.TahunPerolehan = moment($scope.now).format('YYYY');
					$scope.item.TglRegistrasi = moment($scope.now).format('YYYY-MM-DD HH:mm');
				});
			}

			function load() {
				if (JenisOrder != '') {
					if (JenisOrder == 'InputDetailAsset') {
						$scope.isRouteLoading = true;
						medifirstService.get("logistik/get-detail-registrasiasset?" + "norecAsset=" + norecNoAsset, true).then(function (data) {
							var datas = data.data.datas[0];
							// * UMUM
							$scope.item.noRegisterAset = datas.noregisteraset;
							$scope.item.kdProduk = datas.idproduk;
							$scope.item.kodeBmn = datas.kodebmn;
							$scope.item.kdEksternal = datas.kodeexternal;
							$scope.item.kdAspak = " ";
							$scope.item.noaset = datas.noregisteraset_int;
							$scope.item.TahunPerolehan = datas.tahunperolehan;
							//$scope.item.kdRs=datas.kdproduk;
							//$scope.item.kdRs='11.01.11.32.010207.00000.00000';
							$scope.item.produk = { id: datas.idproduk, namaproduk: datas.namaproduk };
							// $scope.item.namaProduk=datas.namaproduk;
							$scope.item.ruanganAsal = { id: datas.ruanganasalfk, namaruangan: datas.namaruanganasal };
							$scope.item.ruangan = { id: datas.ruangancurrenfk, namaruangan: datas.ruangancurrent };
							$scope.item.TahunPerolehan = datas.tahunperolehan;
							$scope.item.TglRegistrasi = moment(datas.tglregisteraset).format('YYYY-MM-DD HH:mm');
							$scope.item.HargaPengadaan = datas.hargaperolehan;
							// * END UMUM

							// * ALAMAT
							// $scope.item.alamatLengkap="";
							// $scope.item.kodePos="";
							// $scope.item.desaKelurahan="";
							// $scope.item.kecamatan="";
							// $scope.item.kotaKabupaten="";
							// $scope.item.propinsi="";
							// * END ALAMAT

							// * KATEGORY
							$scope.item.jenisProduk = { id: datas.jpid, jenisproduk: datas.jenisproduk };
							$scope.item.detailJenisProduk = { id: datas.djpid, detailjenisproduk: datas.detailjenisproduk };
							$scope.item.asalproduk = { id: datas.apid, asalproduk: datas.asalproduk };
							$scope.item.kelompokaset = { id: datas.kaid, kelompokaset: datas.kelompokaset };
							// * END KATEGORY

							// * SPESIFIKASI
							//$scope.item.fungsiProduk="";
							// $scope.item.bahanProduk="";
							// $scope.item.typeProduk="";
							// $scope.item.warnaProduk="";
							// $scope.item.merkProduk="";
							// $scope.item.spesifikasi="";
							$scope.item.Lebar = 0;
							$scope.item.Panjang = 0;
							$scope.item.Tinggi = 0;
							$scope.item.Listrik = 0;
							// $scope.item.Teknologir="";
							$scope.item.NoSeri = datas.noseri;
							// $scope.item.sisaumur = datas.sisaumur
							$scope.item.merkProduk = { id: datas.merkid, merkproduk: datas.merkproduk };
							$scope.item.typeProduk = { id: datas.typeid, typeproduk: datas.typeproduk };
							$scope.item.UsiaPakai = 0;
							$scope.item.UsiaTeknis = 0;
							$scope.item.TglProduksi = $scope.now;
							// * END SPESIFIKASI

							// * SATUAN
							// $scope.item.satuanStandar="";
							// * END SATUAN

							// * KENDARAAN
							// $scope.item.NoMesin="";
							// $scope.item.NoBPKB="";
							// $scope.item.NoModel="";
							// $scope.item.NoRangka="";
							// $scope.item.NoSeri="";
							// $scope.item.NoPolisi="";
							// $scope.item.BPKBPegawai="";
							// * END KENDARAAN

							// * SERTIFIKAT
							// $scope.item.JenisSertifikat="";
							// $scope.item.NoSertifikat="";
							// $scope.item.Pegawai="";
							$scope.item.MasaBerlakuSertifikat = 0;
							// * END SERTIFIKAT

							// * REKANAN
							$scope.item.rekanan = { id: datas.idsupplier, namarekanan: datas.namasupplier };
							// $scope.item.item.produsenProduk= "";
							// * END REKANAN

							$scope.item.nilaiSisa = datas.nilaisisa;
							$scope.item.umurEkonomis = datas.umurasset;

							hitungPenyusutanFunc();
							historyPindahAssetFunc();
							DaftarJadwalKalibrasiPemeliharaan();
							$scope.isRouteLoading = false;
						})
					}
				}
			}

			function Kosongkan() {

				// * UMUM
				$scope.item.noRegisterAset = "";
				$scope.item.kdProduk = "";
				$scope.item.kodeBmn = "";
				$scope.item.kdEksternal = "";
				$scope.item.kdAspak = "";
				//$scope.item.kdRs = "";
				//$scope.item.kdRs='11.01.11.32.010207.00000.00000';
				$scope.item.produk = "";
				$scope.item.ruanganAsal = undefined;
				$scope.item.ruangan = undefined;
				$scope.item.TahunPerolehan = "";
				$scope.item.HargaPengadaan = "";
				$scope.item.TglRegistrasi = $scope.now;
				$scope.item.noaset = "";
				// * END UMUM

				// * ALAMAT
				$scope.item.alamatLengkap = "";
				$scope.item.kodePos = "";
				$scope.item.desaKelurahan = undefined;
				$scope.item.kecamatan = undefined;
				$scope.item.kotaKabupaten = undefined;
				$scope.item.propinsi = undefined;
				// * END ALAMAT

				// * KATEGORY
				$scope.item.jenisProduk = undefined;
				$scope.item.detailJenisProduk = undefined;
				$scope.item.asalproduk = undefined;
				$scope.item.kelompokaset = undefined;
				// * END KATEGORY

				// * SPESIFIKASI
				$scope.item.fungsiProduk = undefined;
				$scope.item.bahanProduk = undefined;
				$scope.item.typeProduk = undefined;
				$scope.item.warnaProduk = undefined;
				$scope.item.merkProduk = undefined;
				$scope.item.spesifikasi = undefined;
				$scope.item.Lebar = 0;
				$scope.item.Panjang = 0;
				$scope.item.Tinggi = 0;
				$scope.item.Listrik = 0;
				$scope.item.Teknologir = "";
				$scope.item.UsiaPakai = 0;
				$scope.item.UsiaTeknis = 0;
				$scope.item.SisaUmur = 0;
				$scope.item.TglProduksi = $scope.now;
				$scope.item.NoSeri = "";
				// * END SPESIFIKASI

				// * SATUAN
				$scope.item.satuanStandar = "";
				// * END SATUAN

				// * KENDARAAN
				$scope.item.NoMesin = "";
				$scope.item.NoBPKB = "";
				$scope.item.NoModel = "";
				$scope.item.NoRangka = "";
				$scope.item.NoSeri = "";
				$scope.item.NoPolisi = "";
				$scope.item.BPKBPegawai = undefined;
				// * END KENDARAAN

				// * SERTIFIKAT
				$scope.item.JenisSertifikat = undefined;
				$scope.item.NoSertifikat = "";
				$scope.item.Pegawai = undefined;
				$scope.item.MasaBerlakuSertifikat = 0;
				// * END SERTIFIKAT

				// * REKANAN
				$scope.item.rekanan = undefined;
				$scope.item.produsenProduk = undefined;
				// * END REKANAN
			}

			$scope.Batal = function () {
				Kosongkan();
			}

			$scope.Kembali = function () {
				Kosongkan();
				$state.go('DaftarBarangInvestasiCtrl');
			}

			$scope.SimpanDetail = function () {

				var listRawRequired = [
					// * UMUM
					// "item.noRegisterAset|ng-model|No Asset",
					"item.kdProduk|ng-model|Kode Produk",
					// "item.ruanganAsal|k-ng-model|Ruangan Asal",
					"item.ruangan|k-ng-model|Ruangan Current",
					"item.TahunPerolehan|ng-model|Tahun Perolehan",
					// * END UMUM

					// * ALAMAT
					// "item.alamatLengkap|ng-model|Alamat Lengkap",
					// "item.kodePos|ng-model|Kode Pos",
					// "item.desaKelurahan|k-ng-model|Desa Kelurahan",
					// "item.kecamatan|k-ng-model|Kecamatan",
					// "item.kotaKabupaten|k-ng-model|Kota Kabupaten",
					// "item.propinsi|k-ng-model|Provinsi",
					// * END ALAMAT


					// * KATEGORY
					// "item.jenisProduk|k-ng-model|Jenis Produk",
					// "item.detailJenisProduk|k-ng-model|Detail Jenis Produk",
					// "item.asalproduk|k-ng-model|Sumber Dana",
					// "item.kelompokaset|k-ng-model|Kelompok Aset",
					// * END KATEGORY

					// * SPESIFIKASI
					// "item.fungsiProduk|k-ng-model|Fungsi Produk",
					// "item.bahanProduk|k-ng-model|Bahan Produk",
					// "item.typeProduk|k-ng-model|Type Produk",
					// "item.warnaProduk|k-ng-model|Warna Produk",
					// "item.merkProduk|k-ng-model|Merk Produk",
					// "item.spesifikasi|ng-model|Spesifikasi",
					// "item.Lebar|ng-model|Lebar",
					// "item.Panjang|ng-model|Panjang",
					// "item.Tinggi|ng-model|Tinggi",
					// "item.Listrik|ng-model|Listrik",
					// "item.UsiaPakai|ng-model|UsiaPakai",
					// "item.UsiaTeknis|ng-model|UsiaTeknis",
					"item.SisaUmur|ng-model|SisaUmur",
					// "item.Teknologi|ng-model|klasifikasiteknologi",
					// * END SPESIFIKASI

					// * SATUAN
					// "item.satuanStandar|k-ng-model|Satuan",
					// * END SATUAN

					// * KENDARAAN
					// "item.NoMesin|ng-model|No Mesin",
					//          "item.NoBPKB|ng-model|No BPKB",
					//          "item.NoModel|ng-model|No Model",
					//          "item.NoSeri|ng-model|No Seri",
					//          "item.NoPolisi|ng-model|No Polisi",
					//          "item.BPKBPegawai|k-ng-model|BPKB Atas Nama",
					//          "item.NoRangka|ng-model|No Rangka",   		
					// * END KENDARAAN

					// * SERTIFIKAT
					// "item.JenisSertifikat|k-ng-model|BPKB Atas Nama",	
					// "item.NoSertifikat|ng-model|No Sertifikat",
					//"item.MasaBerlakuSertifikat|ng-model|Masa Berlaku Sertifikat",
					// "item.Pegawai|k-ng-model|Sertifikat Atas Nama",	
					// * END SERTIFIKAT

					// * REKANAN
					// "item.rekanan|k-ng-model|Sertifikat Atas Nama",	
					// "item.produsenProduk|k-ng-model|Sertifikat Atas Nama",
					// * END REKANAN
				]
				var isValid = medifirstService.setValidation($scope, listRawRequired);

				if (isValid.status) {
					if ($scope.item != undefined) {
						var confirm = $mdDialog.confirm()
							.title('Peringatan')
							.textContent('Apakah Anda Yakin Menyimpan Data?')
							.ariaLabel('Lucky day')
							.cancel('Tidak')
							.ok('Ya')
						$mdDialog.show(confirm).then(function () {
							SaveRegistrasiAset();
						})
					} else {
						medifirstService.showMessages(isValid.messages)
						// alert(isValid.messages);
					}
				} else {
					medifirstService.showMessages(isValid.messages)
				}
			}
			$scope.getIsiComboJenisProduk = function(){
				$scope.item.umurEkonomis = $scope.item.jenisProduk.umurasset
				$scope.item.SisaUmur = $scope.item.jenisProduk.umurasset
			}

			function SaveRegistrasiAset() {
				// * UMUM
				var noRegisaset = '';
				if ($scope.item.noRegisterAset != undefined) {
					noRegisaset = $scope.item.noRegisterAset;
				}

				var KodeBmn = '';
				if ($scope.item.kodeBmn != undefined) {
					KodeBmn = $scope.item.kodeBmn.id;
				}

				var kodeRS = '';
				if ($scope.item.kdRs != undefined) {
					kodeRS = $scope.item.kdRs;
				}

				var hargaperolehan = 0;
				if ($scope.item.HargaPengadaan != undefined) {
					hargaperolehan = parseFloat($scope.item.HargaPengadaan);
				}

				var noaset = '-';
				if ($scope.item.noaset != undefined) {
					noaset = $scope.item.noaset;
				}

				var ruanganasalfk = null;
				if ($scope.item.ruanganAsal != undefined) {
					ruanganasalfk = $scope.item.ruanganAsal.id;
				}
				// * END UMUM

				// * ALAMAT
				var alamatlengkap = '-';
				if ($scope.item.alamatLengkap != undefined) {
					alamatlengkap = $scope.item.alamatLengkap;
				}
				var kodepos = '-'
				if ($scope.item.kodePos != undefined) {
					kodepos = $scope.item.kodePos
				}
				var objectdesakelurahanfk = null;
				var desakelurahan = '';
				if ($scope.item.desaKelurahan != undefined) {
					objectdesakelurahanfk = $scope.item.desaKelurahan.id;
					desakelurahan = $scope.item.desaKelurahan.namadesakelurahan;
				}
				var objectkecamatanfk = null;
				var kecamatan = '';
				if ($scope.item.kecamatan != undefined) {
					objectkecamatanfk = $scope.item.kecamatan.id;
					kecamatan = $scope.item.kecamatan.namakecamatan;
				}
				var objectkotakabupatenfk = null;
				var kotakabupaten = '';
				if ($scope.item.kotaKabupaten != undefined) {
					objectkotakabupatenfk = $scope.item.kotaKabupaten.id;
					kotakabupaten = $scope.item.kotaKabupaten.namakotakabupaten;
				}
				var objectpropinsifk = null;
				if ($scope.item.propinsi != undefined) {
					objectpropinsifk = $scope.item.propinsi.id;
				}
				// * END ALAMAT

				// * SERTIFIKAT
				var jenissertifikat = null;
				if ($scope.item.JenisSertifikat != undefined) {
					jenissertifikat = $scope.item.JenisSertifikat.id;
				}
				var Nosertifikat = '';
				if ($scope.item.NoSertifikat != undefined) {
					Nosertifikat = $scope.item.NoSertifikat;
				}
				var pegawaiSertifikat = null;
				if ($scope.item.Pegawai != undefined) {
					pegawaiSertifikat = $scope.item.Pegawai.id;
				}
				var MasaBerlakuSertifikat = '';
				if ($scope.item.MasaBerlakuSertifikat != undefined) {
					MasaBerlakuSertifikat = $scope.item.MasaBerlakuSertifikat + " " + "Tahun";
				}
				// * END SERTIFIKAT

				// * KENDARAAN
				var nomesin = '';
				if ($scope.item.NoMesin != undefined) {
					nomesin = $scope.item.NoMesin;
				}
				var nobpkb = '';
				if ($scope.item.NoBPKB != undefined) {
					nobpkb = $scope.item.NoBPKB;
				}
				var nomodel = '';
				if ($scope.item.NoModel != undefined) {
					nomodel = $scope.item.NoModel;
				}
				var norangka = '';
				if ($scope.item.NoRangka != undefined) {
					norangka = $scope.item.NoRangka;
				}
				var noseri = '-';
				if ($scope.item.NoSeri != undefined) {
					noseri = $scope.item.NoSeri;
				}
				var nopolisi = '';
				if ($scope.item.NoPolisi != undefined) {
					nopolisi = $scope.item.NoPolisi;
				}
				var bpkb_atasnama = null;
				if ($scope.item.BPKBPegawai != undefined) {
					bpkb_atasnama = $scope.item.BPKBPegawai.id;
				}
				var noSeri = '';
				if ($scope.item.NoSeri != undefined) {
					noSeri = $scope.item.NoSeri
				}
				// * END KENDARAAN  

				// * REKANAN
				var objectprodusenprodukfk = null;
				if ($scope.item.produsenProduk != undefined) {
					objectprodusenprodukfk = $scope.item.produsenProduk.id;
				}
				var rekanan = null;
				if ($scope.item.rekanan != undefined) {
					rekanan = $scope.item.rekanan.id;
				}
				// * END REKANAN

				var objectasalprodukfk = null;
				if ($scope.item.asalproduk != undefined) {
					objectasalprodukfk = $scope.item.asalproduk.id;
				}

				var kelompokaset = null;
				if ($scope.item.kelompokaset != undefined) {
					kelompokaset = $scope.item.kelompokaset.id;
				}

				var judul = "";
				if ($scope.item.judul != undefined) {
					judul = $scope.item.judul;
				}

				var SpesifikasiDet = "";
				if ($scope.item.Spesifikasi != undefined) {
					SpesifikasiDet = $scope.item.Spesifikasi;
				}

				var JenisAset = "-";
				if ($scope.item.JenisAset != undefined) {
					JenisAset = $scope.item.JenisAset;
				}

				var NilaiSisa = 0;
				if ($scope.item.nilaiSisa != undefined) {
					NilaiSisa = $scope.item.nilaiSisa;
				}

				var UmurAsset = 0;
				if ($scope.item.umurEkonomis != undefined) {
					UmurAsset = $scope.item.umurEkonomis;
				}


				var regAset = {

					// * UMUM
					tglregisteraset: moment($scope.item.TglRegistrasi).format('YYYY-MM-DD HH:mm'),
					noRegisaset: noRegisaset,
					objectprodukfk: $scope.item.kdProduk,
					kdbmn: KodeBmn,
					hargaperolehan: hargaperolehan,
					noaset: noaset,
					// :$scope.item.kdEksternal,
					// :$scope.item.kdAspak,
					kdrsabhk: kodeRS,
					objectruanganfk: ruanganasalfk,
					objectruanganposisicurrentfk: $scope.item.ruangan.id,
					tahunperolehan: moment($scope.item.TahunPerolehan).format('YYYY'),
					objectruanganfk: ruanganasalfk,
					objectruanganposisicurrentfk: $scope.item.ruangan.id,
					objectruanganfk: ruanganasalfk,
					judul: judul,
					spesifikasi: SpesifikasiDet,
					jenisaset: JenisAset,
					qtyprodukaset: $scope.item.QtyAset,
					// * END UMUM

					// * ALAMAT
					alamatlengkap: alamatlengkap,
					kodepos: kodepos,
					objectdesakelurahanfk: objectdesakelurahanfk,
					desakelurahan: desakelurahan,
					objectkecamatanfk: objectkecamatanfk,
					kecamatan: kecamatan,
					objectkotakabupatenfk: objectkotakabupatenfk,
					kotakabupaten: kotakabupaten,
					objectpropinsifk: objectpropinsifk,
					// * END ALAMAT

					// * KATEGORY
					objectjenisproduk: $scope.item.jenisProduk.id,
					objectdetailjenisproduk: $scope.item.detailJenisProduk.id,
					objectasalprodukfk: objectasalprodukfk,
					objectkelompokasetfk: kelompokaset,
					// * END KATEGORY

					// * SPESIFIKASI
					fungsikegunaan: $scope.item.fungsiProduk != undefined?  $scope.item.fungsiProduk.fungsiproduk:null,
					objectbahanprodukfk: $scope.item.bahanProduk!=undefined?$scope.item.bahanProduk.id:null,
					objecttypeprodukfk: $scope.item.typeProduk!= undefined? $scope.item.typeProduk.id :null,
					objectwarnaprodukfk: $scope.item.warnaProduk!= undefined?$scope.item.warnaProduk.id:null,
					objectmerkprodukfk: $scope.item.merkProduk !=undefined?$scope.item.merkProduk.id : null,
					keteranganlainnya: $scope.item.spesifikasi,
					lb_lebar: $scope.item.Lebar,
					lb_panjang: $scope.item.Panjang,
					lb_tinggi: $scope.item.Tinggi,
					dayalistrik: $scope.item.Listrik,
					klasifikasiteknologi: $scope.item.Teknologi,
					usiapakai: $scope.item.UsiaPakai,
					usiateknis: $scope.item.UsiaTeknis,
					sisaumur: $scope.item.SisaUmur,
					tglproduksi: moment($scope.item.TglProduksi).format('YYYY-MM-DD HH:mm'),
					noseri: noSeri,
					// * END SPESIFIKASI

					// * SATUAN
					objectsatuan: $scope.item.satuanStandar.id,
					// * END SATUAN

					// * KENDARAAN
					nomesin: nomesin,
					nobpkb: nobpkb,
					nomodel: nomodel,
					norangka: norangka,
					noseri: noseri,
					nopolisi: nopolisi,
					bpkb_atasnama: bpkb_atasnama,
					// * END KENDARAAN

					// * SERTIFIKAT
					kdjenissertifikat: jenissertifikat,
					nosertifikat: Nosertifikat,
					sertifikat_atasnama: pegawaiSertifikat,
					masaberlakusertifikat: MasaBerlakuSertifikat,
					// * END SERTIFIKAT

					// * REKANAN
					objectsupplier: rekanan,
					objectprodusenprodukfk: objectprodusenprodukfk,
					// * END REKANAN

					// * PENYUSUTAN
					nilaisisa : NilaiSisa,
					umurasset : UmurAsset
					// * END PENYUSUTAN
				}

				var objSave = {
					regAset: regAset
				}

				medifirstService.post('logistik/simpan-detail-regisaset', objSave).then(function (e) {
					// Kosongkan();
					$state.go('DaftarBarangInvestasiCtrl');
				})
			}

			$scope.columnGridPenyusutan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarPenyusutanAset.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Penyusutan Aset",
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
						"width": "20px",
					},
					{
						"field": "eoy",
						"title": "EOY",
						"width": "50px",
					},
					{
						"field": "inttahun",
						"title": "Tahun",
						"width": "50px",
					},
					{
						"field": "hargaperolehan",
						"title": "Harga Perolehan",
						"width": "70px"
					},
					{
						"field": "nilaisisa",
						"title": "Nilai Sisa",
						"width": "70px",
					},
					{
						"field": "lifetime",
						"title": "Life Time",
						"width": "60px",
					},
					{
						"field": "nilaipenyusutan",
						"title": "Penyusutan",
						"width": "70px",
					},
					{
						"field": "akumpenyusutan",
						"title": "Akum. Penyusutan",
						"width": "80px",
					},
					{
						"field": "nilaibuku",
						"title": "Nilai Buku",
						"width": "80px",
					},
					{
						"field": "status",
						"title": "Status",
						"width": "80px",
					},
					{
						"command": [
							{ text: "Save", click: btnSave, imageClass: "k-icon k-i-save", className: "btn-enabled", },
							{ text: "Del", click: btnDeletePenyusutan, imageClass: "k-icon k-i-save", className: "btn-enabled", }
						],
						title: "<h3 align=center>Command<h3>",
						width: "100px",
					}
                ]
            };

			// $scope.columnGridPenyusutan = [
                
			// ];
			
            function btnDeletePenyusutan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"norecAsset" : norecNoAsset,
					"datasimpan": dataItem
				}
				medifirstService.post('logistik/simpan-delete-penyusutan-aset', objSave).then(function (e) {
					hitungPenyusutanFunc();
				})
			};
            function btnSave(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"norecAsset" : norecNoAsset,
					"datasimpan": dataItem
				}
				medifirstService.post('logistik/simpan-penyusutan-aset', objSave).then(function (e) {
					var strukresep = {
	                    nojurnal: '-',
	                    tglentry: new Date(),
	                    deskripsi: 'Penyusutan asset ' + $scope.item.produk.namaproduk 
	                }
	                var objSave =
	                {
	                    head: strukresep,
	                    detail: [
		                    {
		                    	no : 1,
	                            accountid : 12632,
	                            noaccount : '9.1.07.01.07',
	                            namaaccount : 'Beban Penyusutan Alat Kedokteran dan Kesehatan',
	                            namaaccount2 : 'Beban Penyusutan Alat Kedokteran dan Kesehatan',
	                            hargasatuand : dataItem.nilaipenyusutan,
	                            hargasatuank : 0,
	                            keteranganlainnya : ''
	                        },
	                        {
		                    	no : 2,
	                            accountid : 11741,
	                            noaccount : '1.3.07.01.07',
	                            namaaccount : 'Akumulasi Penyusutan Alat Kedokteran dan Kesehatan',
	                            namaaccount2 : 'Akumulasi Penyusutan Alat Kedokteran dan Kesehatan ',
	                            hargasatuand : 0,
	                            hargasatuank : dataItem.nilaipenyusutan,
	                            keteranganlainnya : ''
	                        }
                        ]
	                }
	                medifirstService.post('akuntansi/save-entry-jurnal', objSave).then(function (e) {
	                })
					hitungPenyusutanFunc();
				})
			};
            $scope.hitungPenyusutan = function(){
            	hitungPenyusutanFunc()
            }
            function hitungPenyusutanFunc(){
            	var data ={};
            	var data2 = [];
            	var akumpenyusutanaing = 0
            	var nilaipenyusutanaing = parseFloat($scope.item.HargaPengadaan) / parseInt($scope.item.umurEkonomis)
            	var intTahun = parseInt(moment($scope.item.TahunPerolehan).format('YYYY'))
            	for (var i = 0; i < parseInt($scope.item.umurEkonomis)+1  ; i++) {
            		if	(i == 0){
						data={
							no : i+1,
							eoy : i,
							hargaperolehan : parseFloat($scope.item.HargaPengadaan),
							nilaisisa : parseFloat($scope.item.nilaiSisa),
							lifetime : parseInt($scope.item.umurEkonomis),
							nilaipenyusutan : 0,
							akumpenyusutan : akumpenyusutanaing,
							nilaibuku : parseFloat($scope.item.HargaPengadaan) - akumpenyusutanaing,
							inttahun : intTahun,
							norec : ''
						}
            		}else{
            			intTahun = intTahun +  1
            			akumpenyusutanaing = akumpenyusutanaing + nilaipenyusutanaing
            			data={
							no : i+1,
							eoy : i,
							hargaperolehan : parseFloat($scope.item.HargaPengadaan),
							nilaisisa : parseFloat($scope.item.nilaiSisa),
							lifetime : parseInt($scope.item.umurEkonomis),
							nilaipenyusutan : nilaipenyusutanaing,
							akumpenyusutan : akumpenyusutanaing,
							nilaibuku : parseFloat($scope.item.HargaPengadaan) - akumpenyusutanaing,
							inttahun : intTahun,
							norec : ''
						}
            		}
            		
                	data2.push(data)
                
            	}
            	// get-data-penyusutan-asset
            	medifirstService.get("logistik/get-data-penyusutan-asset?" + "norecAsset=" + norecNoAsset, true).then(function (data) {
					var datas = data.data[0].data;
					for (var i = 0; i < datas.length; i++) {
						for (var j = 0; j < data2.length; j++) {
							if (parseInt(datas[i].eoy) == data2[j].eoy) {

								data2[j].status = datas[i].status
								data2[j].hargaperolehan = datas[i].hargaperolehan
								data2[j].nilaisisa = datas[i].nilaisisa
								data2[j].lifetime = datas[i].lifetime
								data2[j].nilaipenyusutan = datas[i].penyusutan
								data2[j].akumpenyusutan = datas[i].akumulasipenyusutan
								data2[j].nilaibuku = datas[i].nilaibuku
								data2[j].norec = datas[i].norec
							}
						}
						
					}
					$scope.dataGridPenyusutan = new kendo.data.DataSource({
	                    data: data2
	                });
				});
            	
            }
            function historyPindahAssetFunc(){
            	
            	medifirstService.get("logistik/get-daftar-history-pindah-asset?" + "noregisterasetfk=" + norecNoAsset, true).then(function (data) {
					var datas = data.data[0].data;
					$scope.dataGridHistoryAsset = new kendo.data.DataSource({
	                    data: datas
	                });
				});
            	
            }

			$scope.columnGridHistoryAsset = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatPerpindahanAset.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Riwayat Perpindahan Aset",
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
						"width": "20px",
					},
					{
						"field": "NoStruk",
						"title": "NoStruk",
						"width": "50px",
					},
					{
						"field": "inttahun",
						"title": "Tgl Pindah",
						"width": "50px",
					},
					{
						"field": "hargaperolehan",
						"title": "Dari Ruangan",
						"width": "70px"
					},
					{
						"field": "nilaisisa",
						"title": "Ke Ruangan",
						"width": "70px",
					}
                ]
            };
			
			$scope.columnGridHistoryKalibrasiAsset = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatKalibrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Riwayat Kalibrasi",
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
						"field": "tglplanning",
						"title": "Tgl Kalibrasi",
						"width": "50px",
					},
					{
						"field": "keteranganlainnya",
						"title": "Keterangan",
						"width": "50px",
					},
					{
						"field": "namalengkap",
						"title": "Nama PIC",
						"width": "70px",
					},
					{
						"field": "startdate",
						"title": "Mulai",
						"width": "50px",
					},
					{
						"field": "duedate",
						"title": "Selesai",
						"width": "50px",
					}
                ]
            };

			$scope.columnGridHistoryPemeliharaanAsset = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatPemeliharaan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Riwayat Pemeliharaan",
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
						"field": "tglplanning",
						"title": "Tgl Pemeliharaan",
						"width": "50px",
					},
					{
						"field": "keteranganlainnya",
						"title": "Keterangan",
						"width": "50px",
					},
					{
						"field": "namalengkap",
						"title": "Nama PIC",
						"width": "70px",
					},
					{
						"field": "startdate",
						"title": "Mulai",
						"width": "50px",
					},
					{
						"field": "duedate",
						"title": "Selesai",
						"width": "50px",
					}
                ]
            };
           
            $scope.batalKalibrasi = function(){
            	$scope.item.jadwalKalibrasi =  new Date();
            	$scope.item.keteranganKalibrasi = ''
            	$scope.item.staff = {};
            	norecKalibrasi = ''
            }
            $scope.saveKalibrasi = function () {        
                var objSave = 
                    {
                        norec : norecKalibrasi,
                        tglplanning : $scope.item.jadwalKalibrasi,
                        keteranganlainnya : $scope.item.keteranganKalibrasi,
                        noregisterassetfk : norecNoAsset,
                        objectpegawaipjawabfk : $scope.item.staff.id,
                    }
                medifirstService.post('asset/save-data-jadwal-kalibrasi',objSave).then(function(e) {
                    $scope.popupAlokasiStaff.close();
                    DaftarJadwalKalibrasiPemeliharaan()
                })    
                   
            }
            $scope.batalPemeliharaan = function(){
            	$scope.item.jadwalPemeliharaan =  new Date();
            	$scope.item.keteranganPemeliharaan = ''
            	$scope.item.staff = {};
            	norecPemeliharaan = ''
            }
            $scope.savePemeliharaan = function () {        
                var objSave = 
                    {
                        norec : norecPemeliharaan,
                        tglplanning : $scope.item.jadwalPemeliharaan,
                        keteranganlainnya : $scope.item.keteranganPemeliharaan,
                        noregisterassetfk : norecNoAsset,
                        objectpegawaipjawabfk : $scope.item.staff.id,
                    }
                medifirstService.post('asset/save-data-jadwal-pemeliharaan',objSave).then(function(e) {
                    $scope.popupAlokasiStaff.close();
                    DaftarJadwalKalibrasiPemeliharaan()
                })    
                   
            }
            $scope.cariFilterJadwalKalibrasiPemeliharaan = function(){
            	DaftarJadwalKalibrasiPemeliharaan()
            }
            function DaftarJadwalKalibrasiPemeliharaan(){

				var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
            	medifirstService.get("asset/get-data-jadwal-kalibrasi?" + "norecAsset=" + norecNoAsset + 
            		"&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir, true).then(function (data) {
					var datas = data.data;
					$scope.dataGridHistoryKalibrasiAsset = new kendo.data.DataSource({
	                    data: datas
	                });
				});
            	
            	medifirstService.get("asset/get-data-jadwal-pemeliharaan?" + "norecAsset=" + norecNoAsset + 
            		"&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir, true).then(function (data) {
					var datas = data.data;
					$scope.dataGridHistoryPemeliharaanAsset = new kendo.data.DataSource({
	                    data: datas
	                });
				});
            }
            $scope.klikGridKalibrasi = function(dataSelected){
            	norecKalibrasi = dataSelected.norec
            	$scope.item.jadwalKalibrasi =  dataSelected.tglplanning;
            	$scope.item.keteranganKalibrasi = dataSelected.keteranganlainnya;
            	$scope.item.staff = {id : dataSelected.objectpegawaipjawabfk , namalengkap : dataSelected.namalengkap};
            }
            $scope.klikGridPemeliharaan = function(dataSelected){
            	norecPemeliharaan = dataSelected.norec
            	$scope.item.jadwalPemeliharaan =  dataSelected.tglplanning;
            	$scope.item.keteranganPemeliharaan = dataSelected.keteranganlainnya;
            	$scope.item.staff = {id : dataSelected.objectpegawaipjawabfk , namalengkap : dataSelected.namalengkap};
            }
            

            $scope.worklist = function () {               
                $scope.popupWorkList.center().open();
                $scope.item.norecAL =  norecPemeliharaan
                $scope.item.desc =  $scope.item.keteranganPemeliharaan
            }
            $scope.worklist2 = function () {               
                $scope.popupWorkList.center().open();
                $scope.item.norecAL =  norecKalibrasi
                $scope.item.desc =  $scope.item.keteranganKalibrasi
            }
            $scope.batalWL = function () {            
                $scope.popupWorkList.close();   
            }
            $scope.saveWL = function () {        
                var objSave = 
                    {
                        norec : $scope.item.norecAL,
                        deskripsiplanning : $scope.item.worklist
                    }
                medifirstService.post('sanitasi/save-worklist',objSave).then(function(e) {
                    $scope.popupWorkList.close();
                    init2()
                })    
                   
            }

            $scope.Inspeksi = function () {               
                $scope.popupInspeksi.center().open();
                $scope.item.norecAL =  norecPemeliharaan
                $scope.item.desc =  $scope.item.keteranganPemeliharaan
            }
            $scope.Inspeksi2 = function () {               
                $scope.popupInspeksi.center().open();
                $scope.item.norecAL =  norecKalibrasi
                $scope.item.desc =  $scope.item.keteranganKalibrasi
            }
            $scope.bataIS = function () {            
                $scope.popupInspeksi.close();   
            }
            $scope.saveIS = function () {        
                var objSave = 
                    {
                        norec : $scope.item.norecAL,
                        keteranganverifikasi : $scope.item.inspeksi,
                        objectpegawaipjawabevaluasifk : $scope.item.staff.id
                    }
                medifirstService.post('sanitasi/save-inspeksi',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.startBtn = function () {        
                var objSave = 
                    {
                        norec : norecPemeliharaan
                    }
                medifirstService.post('sanitasi/save-startdate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.startBtn2 = function () {        
                var objSave = 
                    {
                        norec : norecKalibrasi
                    }
                medifirstService.post('sanitasi/save-startdate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.finishBtn = function () {        
                var objSave = 
                    {
                        norec : norecPemeliharaan
                    }
                medifirstService.post('sanitasi/save-duedate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.finishBtn2 = function () {        
                var objSave = 
                    {
                        norec : norecKalibrasi
                    }
                medifirstService.post('sanitasi/save-duedate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }

			//////////////			`
		}
	]);
});