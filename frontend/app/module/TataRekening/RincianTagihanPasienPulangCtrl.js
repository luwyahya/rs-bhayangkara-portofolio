define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RincianTagihanPasienPulangCtrl', ['MedifirstService', '$state', '$q', '$scope', '$window', '$mdDialog','CacheHelper',
		function (medifirstService, $state, $q, $scope, window, $mdDialog,cacheHelper) {
			$scope.now = new Date();

			$scope.dataParams = JSON.parse($state.params.dataPasien);

			$scope.showBilling = false;

			var tempData = [];
			var logData = [];
			var dataDel = [];
			$scope.item = {};
			$scope.model = {};
			$scope.button = true;
			$scope.billing = true;
			$scope.cetak = true;
			$scope.DiskonKM = false;
			$scope.ubahTanggal = false;
			$scope.FilterData = false;
			var statusPosting = true

			var dibayar = 0
			var verifTotal = 0


			$scope.isRouteLoading = false;
			var norec_ppd = ''
			var norec_pp = ''
			var norec_pd = ''
			var strukfk = ''
			var hargasatuan = '';
			var data3 = [];
			var dataLogin = [];
			var KelompokUser = [];
			var idKelompokPasienLastfk = "";

			var dataLayanan = [];
			var dataResep = [];
			var ruangaan2 = {};
			var tgltgltgltgl = ''
			var tglkpnaja = []
			$scope.selectedData2 = [];
			var data2 = [];
			var dataTampil = 'layanan';
			$scope.item.PegawaiLoginfk = '';
			$scope.item.PegawaiPenindak = '';
			$scope.statusSelesaiPeriksa = false


			LoadData();

			function LoadData() {
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/tindakan/get-tanggal-posting", true).then(function (dat) {
					tgltgltgltgl = dat.data.mindate[0].max
					tglkpnaja = dat.data.datedate

				})
				$scope.selectedData = [];
				$scope.selectedData2 = [];
				dataLayanan = [];
				dataResep = [];
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: []
				});
				medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
					$scope.dataParams.noRegistrasi, true).then(function (dat) {
						$scope.item.statusVerif = dat.data.status
					});
				medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
					$scope.dataParams.noRegistrasi, true).then(function (dat) {
						$scope.statusSelesaiPeriksa = dat.data
					});
				medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataParams.noRegistrasi).then(function (e) {

					dataLogin = e.data.datalogin;
					idKelompokPasienLastfk = e.data.listRuangan[0].objectkelompokpasienlastfk;
					KelompokUser = e.data.kelompokuser;
					$scope.listRuangAPD = e.data.listRuangan
					$scope.item.PegawaiLoginfk = e.data.pegawailoginfk;
					var brs = e.data.listRuangan.length
					ruangaan2 = { id: e.data.listRuangan[brs - 1].id, namaruangan: e.data.listRuangan[brs - 1].namaruangan }
					$scope.item.ruang2 = ruangaan2


					var objSave = {
						noregistrasi: $scope.dataParams.noRegistrasi
					}
					medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
						$scope.IsDataResep = false
						loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id)
					});
				})
				
				$scope.klikGrid = function (item) {
					// loadCombo();
					// $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
					// $scope.item.periodeAkhir = $scope.now;
					if (item != undefined) {
						$scope.item.pilihDokter = { id: item.pgpjid, namalengkap: item.namadokter }
					}
				}
			}
			function loadGrid(noreg, idRuangan, jenisdata) {
				if (jenisdata == undefined)
					jenisdata = 'layanan'
				$scope.isRouteLoading = true;
				$q.all([
					medifirstService.getServiceArray("tatarekening/detail-tagihan/" + noreg + '?jenisdata=' + jenisdata + '&idruangan=' + idRuangan)
				])
					.then(function (data) {
						debugger;
						if (data[0].statResponse) {
							dataLayanan = [];
							dataResep = [];
							dibayar = 0
							verifTotal = 0
							for (var i = data[0].details.length - 1; i >= 0; i--) {
								if (data[0].details[i].strukfk != null) {
									if (data[0].details[i].strukfk.length > 20) {
										dibayar = dibayar + data[0].details[i].total
									}
									if (data[0].details[i].strukfk.length < 20 && data[0].details[i].strukfk.length > 5) {
										verifTotal = verifTotal + data[0].details[i].total
									}
								}
								if (data[0].details[i].aturanpakai == null) {
									// dataLayanan[] = data[0].details[i]
									dataLayanan.push(data[0].details[i])
								} else {
									dataResep.push(data[0].details[i])
									// dataResep[] = data[0].details[i]
								}
								if (data[0].details[i].namaPelayanan) {
									if (data[0].details[i].namaPelayanan.indexOf('Konsul') > -1 && data[0].details[i].dokter == '-' || data[0].details[i].dokter == null) {
										toastr.warning('Mohon isi Dokter Pemeriksa pada layanan '
											+ data[0].details[i].namaPelayanan, 'Peringatan !')
									}
								}
								if (data[0].details[i].iscito == "1") {
									data[0].details[i].statuscito = "✔"
								} else {
									data[0].details[i].statuscito = ""
								}

								if (data[0].details[i].isparamedis == "1") {
									data[0].details[i].paramedis = "✔"
								} else {
									data[0].details[i].paramedis = ""
								}
							}
							data[0].bayar = data[0].dibayar
							data[0].verifTotal = data[0].diverif//verifTotal
							data[0].sisa = parseFloat(data[0].billing) - data[0].dibayar - parseFloat(data[0].deposit)
							$scope.item = data[0];
							norec_pd = data[0].norec_pd
							$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
							$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
							$scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
							data3 = data[0].details
							if ($scope.IsDataResep) {
								dataLayanan = dataResep
							}
							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: dataLayanan,//details,
								group: [
									//{field: "ruanganTindakan"}
								],
								pageSize: 20,

								// pageSize: 10,
							});
							$scope.item.ruang2 = ruangaan2
						} else {
							$scope.item.bayar = 0
							$scope.item.billing = 0
							$scope.item.deposit = 0
							$scope.item.sisa = 0
							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: [],
							});
						}
						$scope.isRouteLoading = false;

					});
			}
			$scope.loadDataResep = function () {
				$scope.IsDataResep = true
				loadGrid($scope.item.noRegistrasi, $scope.item.ruang2.id, 'resep')

			}
			$scope.loadDataLayanan = function () {
				$scope.IsDataResep = false
				loadGrid($scope.item.noRegistrasi, $scope.item.ruang2.id, 'layanan')
			}

			$scope.ubahDokterPemeriksa = function () {
				$scope.cboDokter = true
			}
			$scope.ubahTanggal = function () {

				if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < $scope.dataSelected.tglPelayanan) {
					for (var i = tglkpnaja.length - 1; i >= 0; i--) {
						if (tglkpnaja[i] == parseFloat(moment($scope.dataSelected.tglPelayanan).format('D'))) {
							alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
							return;
						}

					}
				} else {
					alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
					return;
				}
				$scope.dtTanggal = true
			}
			$scope.batalTanggal = function () {
				$scope.dtTanggal = false;
				$scope.item.tanggalPelayanan = "";
			}
			$scope.batalDokterPemeriksa = function () {
				$scope.cboDokter = false
			}
			$scope.FilterDataCMD = function () {
				$scope.FilterData = true
			}
			$scope.BatalFilter = function () {
				$scope.FilterData = false
				$scope.item.namaPelayanan = ''
				$scope.item.namaruangan = {}
			}
			// $scope.CariFilter = function(){
			$scope.$watch('item.filter', function (newValue, oldValue) {
				var layananFilter = [];
				var txtnaonwelah = '';

				if (dataTampil == 'layanan') {

					for (var i = dataLayanan.length - 1; i >= 0; i--) {
						txtnaonwelah = ' ' + dataLayanan[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								layananFilter.push(dataLayanan[i])
							}
						}

					}
					if ($scope.item.filter == '') {
						layananFilter = dataLayanan
					}
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: layananFilter,
						pageSize: 20,
						group: [
							//{field: "ruanganTindakan"}
						],
					});
				} else {
					var resepFilter = [];
					for (var i = dataResep.length - 1; i >= 0; i--) {
						txtnaonwelah = ' ' + dataResep[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								resepFilter.push(dataResep[i])
							}
						}

					}
					if ($scope.item.filter == '') {
						resepFilter = dataResep
					}
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: resepFilter,
						pageSize: 20,
						group: [
							//{field: "ruanganTindakan"}
						],
					});
				}

			});
			$scope.CariFilterRuangan = function () {
				if ($scope.IsDataResep)
					var jenisdata = 'resep'
				else
					var jenisdata = 'layanan'

				var strRUanganFilter = '';
				if ($scope.item.ruang2 != null) {
					strRUanganFilter = '&jenisdata=layanan&idruangan=' + $scope.item.ruang2.id
					ruangaan2 = { id: $scope.item.ruang2.id, namaruangan: $scope.item.ruang2.namaruangan }
				} else {
					ruangaan2 = {}
				}

				$scope.selectedData = [];

				dataLayanan = [];
				dataResep = [];
				var objSave = {
					noregistrasi: $scope.item.noRegistrasi
				}
				medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (data) {
				})

				loadGrid($scope.item.noRegistrasi, $scope.item.ruang2 != null ? $scope.item.ruang2.id : '', jenisdata)
			}
			$scope.CariNoreg = function () {
				$scope.IsDataResep = false
				$scope.selectedData = [];

				medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.item.noRegistrasi).then(function (e) {
					dataLogin = e.data.datalogin;
					KelompokUser = e.data.kelompokuser;
					$scope.listRuangAPD = e.data.listRuangan
					if (e.data.listRuangan.length > 0) {
						ruangaan2 = { id: e.data.listRuangan[0].id, namaruangan: e.data.listRuangan[0].namaruangan }
						$scope.item.ruang2 = ruangaan2
					}

					dataLayanan = [];
					dataResep = [];
					var objSave = {
						noregistrasi: $scope.item.noRegistrasi
					}
					medifirstService.post('akuntansi/save-jurnal-pelayananpasien_t', objSave).then(function (data) {
					})
					medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
						loadGrid($scope.item.noRegistrasi, $scope.item.ruang2 != null ? $scope.item.ruang2.id : '', 'layanan')
					})
				})


			}
			$scope.simpanDokterPemeriksa = function () {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
					return;
				}
				var objSave = {
					norec_pp: $scope.dataSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id,
					norec_apd: $scope.dataSelected.norec_apd
				}
				medifirstService.post('tatarekening/save-update-dokter_ppp', objSave).then(function (data) {
					LoadData()
				});
				$scope.DiskonKM = false;
			}
			$scope.saveLogging = function (jenis, referensi, noreff, ket) {
				medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
					+ "&referensi=" + referensi
					+ "&noreff=" + noreff
					+ "&keterangan=" + ket
				).then(function (data) {

				})
			}
			$scope.simpanTanggal = function () {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
					return;
				}

				var objSave = {
					norec_pp: $scope.dataSelected.norec,
					tanggalPelayanan: moment($scope.item.tanggalPelayanan).format('YYYY-MM-DD HH:mm:ss')
				}
				medifirstService.post('tatarekening/save-update-tanggal_pelayanan', objSave).then(function (data) {
					$scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
					LoadData()
				});
				$scope.dtTanggal = false;
			}

			function showButton() {
				$scope.showBtnKembali = true;
				$scope.showBtnCetak = true;
			}


			$scope.pilihHargaByKelas = function () {
				$scope.item.harga = $scope.item.kelas.hargasatuan
			}

			showButton();

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			$scope.rowNumber = 0;
			$scope.renderNumber = function () {
				return ++$scope.rowNumber;
			}
			$scope.klikDetail = function (data) {

				if (data.komponenharga != "Jasa Sarana") {
					$scope.button = false;
					$scope.billing = false;
					$scope.cetak = false;
					$scope.dtTanggal = false;
					$scope.FilterData = false;
					$scope.DiskonKM = true;
					$scope.label = data.komponenharga;
					$scope.item.komponenDis = data.hargasatuan;
					$scope.item.persenDiscount = "";
					$scope.item.diskonKomponen = "";
					norec_ppd = data.norec
					norec_pp = data.norec_pp
					strukfk = data.strukfk
					hargasatuan = data.hargasatuan
				} else if (data.komponenharga == "Jasa Sarana") {
					$scope.button = true;
					$scope.billing = true;
					$scope.cetak = true;
					$scope.dtTanggal = false;
					$scope.FilterData = false;
					$scope.DiskonKM = false;
				}
			}

			$scope.$watch('item.persenDiscount', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.persenDiscount > 100) {
						$scope.item.persenDiscount = "";
					}
					$scope.item.diskonKomponen = ((parseFloat($scope.item.komponenDis)) * $scope.item.persenDiscount) / 100
				}
			})

			$scope.UpdateDiskon = function () {
				if (strukfk != " / ") {
					alert('Sudah di Verifikasi Tatarekening tidak bisa diskon!')
					return
				}
				// if (KelompokUser[0].id != 52) {
				// 	alert('Hanya TataRekening/Admin yg boleh memberikan diskon!')
				// 	return
				// }
				if ($scope.item.diskonKomponen > hargasatuan) {
					alert('Diskon tidak boleh lebih besar dari total jasa!!!')
				} else {
					var objSave = {
						norec_ppd: norec_ppd,
						norec_pp: norec_pp,
						hargadiskon: $scope.item.diskonKomponen,
						hargakomponen: $scope.item.komponenDis,
						hargajasa: $scope.item.JasaKomponen,
					}
					medifirstService.post('tatarekening/save-update-harga-diskon-komponen', objSave).then(function (data) {
						LoadData()
						$scope.saveLogging('Diskon Layanan', 'norec Pelayanan Pasien', norec_pp, 'menu Detail Tagihan')
						loadKomponen();
					});
					// $scope.BatalDiskon();
					// $scope.DiskonKM = false;
					$scope.button = true;
					$scope.billing = true;
					$scope.cetak = true;
					$scope.dtTanggal = false;
					var dataz = {};
					if ($scope.dataSelectedKomponen != undefined) {
						if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
							if ($scope.label == $scope.dataSelectedKomponen.komponenharga) {
								dataz.hargadiscount = $scope.item.diskonKomponen
								$scope.dataSelectedKomponen.hargadiscount = $scope.item.diskonKomponen
							}
						}
					}
				}
			}
			$scope.BatalDiskon = function () {
				// LoadData()
				$scope.popupKomponen.center().close();
			}
			// $scope.BatalDiskon = function(){
			// 	$scope.DiskonKM = false;
			// 	$scope.button = true;
			// 	$scope.billing = true;
			// 	$scope.cetak = true;
			// }

			$scope.$watch('item.namaPelayanan', function (newValue, oldValue) {
				var data2 = [];
				var data = {};
				for (var i = data3.length - 1; i >= 0; i--) {
					if (data3[i].namaPelayanan.match(newValue)) {
						data = data3[i];
						data2.push(data)
					}
				}
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: data2
				});
			})
			$scope.$watch('item.namaruangan.ruanganTindakan', function (newValue, oldValue) {
				var data2 = [];
				var data = {};
				for (var i = data3.length - 1; i >= 0; i--) {
					if (data3[i].ruanganTindakan.match(newValue)) {
						data = data3[i];
						data2.push(data)
					}
				}
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: data2,
					group: [
						//{field: "ruanganTindakan"}
					],
				});
			})

			$scope.CetakBuktiLayanan = function () {
				// $mdDialog.show(confirm).then(function() {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
					return;
				}
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
					var client = new HttpClient();
					//client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' + $scope.item.noRegistrasi + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=' + $scope.dataSelected.ruid + '&view=' + stt, function (response) {
						//http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
						// do something with response
					});
				})

				// client.get('http://127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=' + $scope.item.noRegistrasi + '&strIdPegawai='+ $scope.Pegawai.id + '&view=' + stt, function(response) {
				//     // do something with response
				// });
				// })


				// $scope.showBilling = true;
				// $scope.showBtnCetak = false;
			}
			$scope.CetakBuktiLayananPerTindakan = function () {
				var daftarCetak = [];
				if ($scope.selectedData.length > 0) {
					$scope.selectedData.forEach(function (items) {
						daftarCetak.push(items)
					})
					var resultCetak = daftarCetak.map(a => a.norec).join("|");
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						if (daftarCetak[0].ruid == 44) {
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayananBedah-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
								// do something with response
							});
						} else {
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
								// do something with response
							});
						}
					});
				} else {
					messageContainer.error('Data belum dipilih')
				}


			}

			$scope.CetakBuktiLayananJasa = function () {
				var daftarCetak = [];
				if ($scope.selectedData.length > 0) {
					$scope.selectedData.forEach(function (items) {
						daftarCetak.push(items)
					})
					var resultCetak = daftarCetak.map(a => a.norec).join("|");
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-jasa-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
							// do something with response
						});
					});
				} else {
					messageContainer.error('Data belum dipilih')
				}
			}

			$scope.Cetak = function () {
				// $mdDialog.show(confirm).then(function() {
				// debugger
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var NoStruk = $scope.dataRincianTagihan;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						debugger;
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&cetakan=' + $scope.item.cetakx +'&view=' + stt, function (response) {
							// do something with response
						});
					})
					// }else{
					// 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
					//              	var client = new HttpClient(); 
					//               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
					//                   // do something with response
					//               });
					//           	})
					// }
				});
			}
			$scope.Cetakv2 = function () {
				$scope.popupCetak2.center().open();
			}

			$scope.CetakRincianRanap = function () {
				// $mdDialog.show(confirm).then(function() {
				// debugger
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var NoStruk = $scope.dataRincianTagihan;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya Rawat Inap? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapRincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
							// do something with response
						});
					})
					// }else{
					// 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
					//              	var client = new HttpClient(); 
					//               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
					//                   // do something with response
					//               });
					//           	})
					// }
				});
			}
			$scope.CetakRincianRanapv2 = function () {
				$scope.popupCetak.center().open();

			}
			$scope.cetakdetailrincian = function(){
					$scope.isRouteLoading = true;
					medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
						$scope.isRouteLoading = false;
						var NoStruk = $scope.dataRincianTagihan;
						var struk = "";
						var kwitansi = "";
						var stt = 'false'
						if (confirm('View Rincian Biaya Rawat Inap? ')) {
							// Save it!
							stt = 'true';
						} else {
							// Do nothing!
							stt = 'false'
						}
						medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
							var client = new HttpClient();
							debugger;
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapRincianBiayav2=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&cetakan=' + $scope.item.cetakz + '&view=' + stt, function (response) {
								// do something with response
							});
						})
					});	
			}

			$scope.RincianObat = function () {
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Obat & Alkes? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt, function (response) {
							// do something with response
						});
					})
				});

			}

			// c
			$scope.CetakBillingNaikKelas = function () {
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya-kelas-dijamin=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
						// do something with response
					});
				})
			}
			$scope.CetakBillingTotal = function () {
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "TOTALTOTALTOTAL";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				// if ($scope.item.jenisPasien != "BPJS") {
				medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
						// do something with response
					});
				})
				// }else{
				// medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
				//             	var client = new HttpClient(); 
				//              client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
				//                  // do something with response
				//              });
				//          	})
				// }




			}
			$scope.CetakRekap = function () {
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rekap Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}	
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
							// do something with response
						});
					})
				})
				
			}

			$scope.CetakRekapRincianLama = function () {
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Obat & Alkes? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaRanap=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
							// do something with response
						});
					})
				});				
			}

			$scope.$watch('item.qty', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
				}
			});
			$scope.$watch('item.diskon', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
				}
			});
			$scope.$watch('item.harga', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
				}
			});
			$scope.selectedData = [];
			$scope.onClick = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#grid").data("kendoGrid"),
					dataItem = grid.dataItem(row);

				// $scope.selectedData[dataItem.noRec] = checked;
				if (checked) {
					var result = $.grep($scope.selectedData, function (e) {
						return e.norec == dataItem.norec;
					});
					if (result.length == 0) {
						$scope.selectedData.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData.length; i++)
							if ($scope.selectedData[i].norec === dataItem.norec) {
								$scope.selectedData.splice(i, 1);
								break;
							}
						$scope.selectedData.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData.length; i++)
						if ($scope.selectedData[i].norec === dataItem.norec) {
							$scope.selectedData.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}
			$scope.columnRincianTagihan =
				[
					/*{
						"field": "no",
						"title": "No",
						"width":"50px",
						"template": "<span> {{renderNumber()}} </span>"
					},*/
					{
						"template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
						"width": 40,
						"title": "✔"
					},
					{
						"field": "tglPelayanan",
						"title": "Tanggal",
						"width": "100px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
						// "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
					},
					{
						"field": "namaPelayanan",
						"title": "Nama Pelayanan",
						"width": "200px",
					},
					{
						"field": "kelasTindakan",
						"title": "Kelas",
						"width": "70px",
					},
					{
						"field": "dokter",
						"title": "Dokter/Pelaksana",
						"width": "170px",
					},
					{
						"field": "paramedis",
						"title": "P",
						"width": "30px",
					},
					{
						"field": "ruanganTindakan",
						"title": "Ruangan",
						"width": "200px",
					},
					{
						"field": "jumlah",
						"title": "Qty",
						"width": "50px",
						"template": "<span class='style-right'>#: jumlah #</span>"
					},
					{
						"field": "harga",
						"title": "Harga",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
					},
					{
						"field": "diskon",
						"title": "Harga Diskon",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
					},
					{
						"field": "jasa",
						"title": "Jasa",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
					},
					{
						"field": "total",
						"title": "Total",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
					},
					{
						"field": "statuscito",
						"title": "Status Cito",
						"width": "80px",
						"attributes": { class: "text-center" },
					},
					{
						"field": "strukfk",
						"title": "NoStruk/NoSbm",
						"width": "120px"
					}//,
					// {
					// 	"field": "sbmfk",
					// 	"title": "NoSBM",
					// 	"width":"120px"
					// }
				];
			// $scope.data2 = function(dataItem) {
			// 	return {
			// 		dataSource: new kendo.data.DataSource({
			// 			data: dataItem.komponen
			// 		}),
			//            		columns: [
			// 			{
			// 				"field": "komponenharga",
			// 				"title": "Komponen",
			// 				"width" : "150px",
			// 			},
			// 			{
			// 				"field": "jumlah",
			// 				"title": "Jumlah",
			// 				"width" : "50px"
			// 			},
			// 			{
			// 				"field": "hargasatuan",
			// 				"title": "Harga Satuan",
			// 				"width" : "50px",
			// 				"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
			// 			},
			// 			{
			// 				"field": "hargadiscount",
			// 				"title": "Diskon",
			// 				"width" : "50px",
			// 				"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
			// 			},
			// 			{
			// 				"width" : "50px"
			// 			}
			// 		]
			// 	}
			// };	

			$scope.inputDokterPelaksana = function () {
				if ($scope.dataSelected == undefined) {
					messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}

				SeeDokterPelaksana();
				$scope.item.tglPelayanans = $scope.dataSelected.tglPelayanan;
				$scope.item.namaPelayanans = $scope.dataSelected.namaPelayanan;
				if ($scope.dataSelected.isparamedis == true)
					$scope.item.paramedis = true
				else
					$scope.item.paramedis = false
				$scope.popup_editor.center().open();

			}
			$scope.click = function (dataDokterSelected) {
				if (dataDokterSelected != undefined) {
					// var id = $scope.dataDokterSelected.jpp_id;
					// medifirstService.get("pelayananpetugas/get-pegawaibyjenispetugaspe?objectjenispetugaspefk="+id).then(function(data){
					//         $scope.dataSource = data.data.pegawai;

					//     });
					medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
						.then(function (data) {

							$scope.listPegawaiPemeriksa.add(data.data[0])
							$scope.model.pegawais = data.data[0];

						})
					$scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }
					// $scope.model.pegawais={
					// 	id:dataDokterSelected.pg_id,
					// 	namalengkap:dataDokterSelected.namalengkap,


					// }
				}
			}
			function SeeDokterPelaksana() {
				medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
					$scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
					// $scope.listPegawaiPemeriksa = data.data.pegawai;

				});
				medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
					$scope.listPegawaiPemeriksa = data;

				});
				// $scope.isRouteLoading=true;
				medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataSelected.norec).
					then(function (data) {
						$scope.sourceDokterPelaksana = data.data.data;
						// $scope.isRouteLoading=false;

					});
			}


			$scope.columnDokters = [
				{
					field: "jenispetugaspe",
					title: "Jenis Pelaksana",
					width: "100px",
					// template: "#= jenisPetugas.jenisPelaksana #"
				},
				{
					field: "namalengkap",
					title: "Nama Pegawai",
					width: "200px",
					// template: multiSelectArrayToString
				}
			];
			$scope.simpanDokterPelaksana = function () {
				if ($scope.model.jenisPelaksana == undefined && $scope.item.paramedis == undefined) {
					if ($scope.model.jenisPelaksana == undefined) {
						messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
						return
					}
					if ($scope.model.pegawais == undefined) {
						messageContainer.error("Pegawai Tidak Boleh Kosong")
						return
					}
				}


				var norec_ppp = "";
				if ($scope.dataDokterSelected != undefined) {
					norec_ppp = $scope.dataDokterSelected.norec_ppp
				}

				if (norec_ppp == "") {
					if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
						for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
							if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
								// && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
							) {
								messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
								return
							}
						}
					}
				}


				var pelayananpasienpetugas = {
					norec_ppp: norec_ppp,
					norec_pp: $scope.dataSelected.norec,
					norec_apd: $scope.dataSelected.norec_apd,
					objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
					objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
					isparamedis: $scope.item.paramedis,
				}

				var objSave = {
					pelayananpasienpetugas: pelayananpasienpetugas,

				}

				medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
					var jenis = 'Input/Ubah Petugas Layanan';
					var norec = e.data.data.norec
					$scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
					SeeDokterPelaksana();
					// LoadData();


					var data = {};
					if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
						if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
							data.dokter = $scope.model.pegawais.namalengkap
							$scope.dataSelected.dokter = data.dokter

						}
					}

					if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
						for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
							if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.item.paramedis != true && $scope.model.pegawais == undefined) {
								$scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
								break
							}

						}
					}
					if ($scope.item.paramedis == true) {
						$scope.dataSelected.paramedis = "✔"

					} else {
						$scope.dataSelected.paramedis = ""

					}
					$scope.model.jenisPelaksana = undefined;
					$scope.model.pegawais = undefined;
					$scope.dataDokterSelected = undefined;
					debugger;
					medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {

					})
				})

			}


			$scope.hapusDokterPelaksana = function () {
				if ($scope.dataDokterSelected == undefined) {
					messageContainer.error("Pilih data Pegawai dulu!!")
					return
				}

				var pelayananpasienpetugas = {
					norec_ppp: $scope.dataDokterSelected.norec_ppp,
					norec_pp: $scope.dataSelected.norec,

				}

				var objSave = {
					pelayananpasienpetugas: pelayananpasienpetugas,

				}
				medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
					SeeDokterPelaksana();
					// LoadData();
					$scope.model.jenisPelaksana = "";
					$scope.model.pegawais = "";
					$scope.dataDokterSelected = undefined;
					medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {
					
					})
				})
				var data = {};
				if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
					if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
						$scope.dataSelected.dokter = "-"

					}
				}
			}

			$scope.batalDokterPelaksana = function () {
				// LoadData();
				$scope.model.jenisPelaksana = "";
				$scope.model.pegawais = "";
				$scope.dataDokterSelected = undefined;
				$scope.popup_editor.center().close();


			}

			$scope.Save = function () {
				window.messageContainer.log("Sukses");
				$scope.showBtnSimpan = false;
			}

			$scope.Back = function () {
				if ($scope.showBilling) {
					$scope.showBilling = false;
					$scope.showBtnCetak = true;
				}
				else {
					window.history.back();
					//$state.go('DaftarPasienPulang', {});
				}

			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.formatTanggalAjah = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.klik = function (current) {
				// manageTataRekening.getDataTableTransaksi("akutansi/get-sudah-posting?tgl="+
				//                 current.tglPelayanan, true).then(function(dat){
				//                     statusPosting = dat.data.status
				//                 }
				//             )
				// $scope.item.tanggalPelayanan=current.tglPelayanan;
				// $scope.item.jenisPetugas={id:current.jppid,jenispetugaspe:current.jenispetugaspe};
				// $scope.item.petugas={id:current.pgid,paramedis:current.dokter};
				// $scope.item.ruangan={id:current.ruid,ruanganTindakan:current.ruanganTindakan};

				// medifirstService.get("tatarekening/get-produkbyruangan?objectruanganfk="+current.ruid).then(function(data){
				//                $scope.listPelayanan = data;
				//                $scope.item.pelayanan={id:current.prid,namaPelayanan:current.namaPelayanan};
				//                medifirstService.get("tatarekening/get-kelasbyproduk?objectprodukfk="+current.prid).then(function(data){
				//                 $scope.listKelas = data;
				//                 $scope.item.kelas={id:current.klid,kelasTindakan:current.kelasTindakan};
				//             });
				//            });

				// $scope.item.qty=current.jumlah;
				// $scope.item.harga=current.harga;
				// $scope.item.diskon=current.diskon;
				// $scope.item.subTotal=current.total;
			}

			$scope.batal = function () {
				$scope.item.tanggalPelayanan = $scope.now;
				$scope.item.jenisPetugas = '';
				$scope.item.petugas = '';
				$scope.item.ruangan = '';
				$scope.item.pelayanan = '';
				$scope.item.kelas = '';

				$scope.item.qty = 0;
				$scope.item.harga = 0;
				$scope.item.subTotal = 0;
			}

			$scope.UpdateHarga = function () {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
					return;
				}
				if ($scope.dataSelected.strukfk != null) {
					alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
					return;
				}
				if ($scope.item.qty == undefined) {
					alert("Jumlah belum di isi!");
					return;
				}
				if ($scope.item.harga == undefined) {
					alert("Harga belum di isi!");
					return;
				}
				if ($scope.item.subTotal == undefined) {
					alert("SubTotal belum di isi!");
					return;
				}
				var objSave = {
					"norec": $scope.dataSelected.norec,
					"jumlah": $scope.item.qty,
					"harga": $scope.item.harga,
					"total": $scope.item.subTotal
				};
				medifirstService.post('tatarekening/update-harga-pelayanan-pasien', objSave).then(function (e) {
					//initModulAplikasi(); 
					LoadData();
				})

			}
			$scope.diskon = function () {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
				} else {
					var confirm = $mdDialog.confirm()
						.title('Informasi')
						.textContent('Apakah anda yakin memberikan diskon semua jasa kecuali jasa sarana ?')
						.ok('Ya')
						.cancel('Tidak')
					$mdDialog.show(confirm).then(function () {
						var dat = $scope.dataSelected.komponen;
						var i = 0;
						var objSave = [];
						dat.forEach(function (value) {
							var data = {
								norec_ppd: value.norec,
								norec_pp: value.norec_pp,
								hargadiskon: value.hargasatuan
							}
							objSave[i] = data;
							i++;
						})
						medifirstService.post('tatarekening/save-update-harga-diskon-komponen', objSave).then(function (data) {
							LoadData()
						})
					});
				}

			}
			$scope.verif_tarek = function () {
				if (KelompokUser[0].id != 52) {
					alert('Menu ini khusus untuk akses user TataRekening/Admin!')
					return
				}
				var obj = {
					noRegistrasi: $scope.item.noRegistrasi
				}
				$state.go("VerifikasiTagihan", {
					dataPasien: JSON.stringify(obj)
				});
			}
			$scope.kwitansiTotal = function () {

				var stt = 'false'
				if (confirm('View Kwitansi? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var sudahTerimaDari = ''
				if ($scope.item.STD != undefined) {
					sudahTerimaDari = $scope.item.STD
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=KWITANSITOTAL' + $scope.item.noRegistrasi + '&idPegawai=' + dataLogin.userData.namauser + '&STD=' + $scope.item.billing + '&view=' + stt, function (response) {
					// do something with response
				});

			}
			$scope.HapusTindakan = function(){	
				if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
					toastr.warning('Checklist Data Yang Akan Dihapus, Peringatan!');
					return;
				}			
                $scope.popUpHapus.center().open();
			}

			$scope.HapusTindakan2 = function () {
				// if ($scope.item.strukfk != undefined || $scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//                 return;
				// }

				if ($scope.IsDataResep == true) {
					window.messageContainer.error("Data Resep Tidak Bisa Dihapus, Harap Hubungi Farmasi!");
					return;
				}
				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
				//     return;
				// }
				// if (statusPosting == true) {
				//     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
				//     return;
				// }

				// if ($scope.dataSelected == undefined) {
				// 	alert("Pilih pelayanan dahulu!");
				//                 return;
				// }
				// if ($scope.dataSelected.strukfk.indexOf("/") <= 0 ) {
				// 	alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//                 return;
				// }
				// if (KelompokUser[0].id != 52 && KelompokUser[0].id != 5) {
				// 	alert('Hanya TataRekening/Admin/Dokter Penginput yg boleh menghapus!')
				// 	return
				// }
				// if($scope.item.qty == undefined){
				//                 alert("Jumlah belum di isi!");
				//                 return;
				//             }
				// if($scope.item.harga == undefined){
				//                 alert("Harga belum di isi!");
				//                 return;
				//             }
				// if($scope.item.subTotal == undefined){
				//                 alert("SubTotal belum di isi!");
				//                 return;
				//             }
				//         	var objSave = [{
				// 	"noRec": $scope.dataSelected.norec,
				//                 "noRecStruk": $scope.dataSelected.norec_sp === null ? "" : $scope.dataSelected.norec_sp
				// }];
				// managePasien.hapusTindakan(objSave).then(function(e){
				//                 LoadData();
				//             })


				// 			var tempData = [];
				// var logData=[];
				// var dataDel = []
				var tglajah = ''

				if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
					toastr.warning('Checklist Data Yang Akan Dihapus, Peringatan!');
					return;
				}

				if ($scope.selectedData.length > 0) {
					//  $scope.selectedData.forEach(function(items){
					//      daftarCetak.push(items)
					//  })
					// }

					$scope.selectedData.forEach(function (items) {
						if (items.strukfk != " / ") {
							alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
							return;
						}

						medifirstService.get("tatarekening/tindakan/get-pegawaipenginput?norec_pp=" + items.norec).
							then(function (data) {
								// $scope.item.PegawaiLoginfk =13;		                 
								var datas = data.data.data[0];
								var dataLogin = data.data.datalogin.objectpegawaifk;
								$scope.item.PegawaiLoginfk = dataLogin;
								// $scope.item.PegawaiPenindak = datas.objectpegawaifk;

								if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
									for (var i = tglkpnaja.length - 1; i >= 0; i--) {
										if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
											alert("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
											return;
										}
									}
								} else {
									tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
									medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
										if (dat.data.sudahblm == true) {
											alert("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
											return;
										}
									})
								}

								// if ($scope.item.PegawaiLoginfk != $scope.item.PegawaiPenindak){
								// 		toastr.warning('Maaf Anda Tidak Memiliki Kewenangan Untuk Menghapus, Hubungi ' 
								//         + datas.namalengkap + ' Sebagai User Penginput Bila Ingin Tetap Menghapus, Peringatan!');
								//         return;				                	
								// }else {

								var item = {
									"noRec": items.norec,
									"noRecStruk": null
								}
								logData.push(items);
								tempData.push(item);

								// del pel pasien 
								var objDel = {
									"norec_pp": items.norec,
								}
								dataDel.push(objDel)
								// end
								HapuskanTindkan();
								// }				 				               
							})
					})
				}

				// if (dataDel.length == 0) {
				// 	alert('Checklist yang akan di hapus!')
				// 	return;
				// }

			}

			function HapuskanTindkan() {
				$scope.isRouteLoading = true
				var objLog = {
					pelayananpasiendelete: logData

				}
				var nama = medifirstService.getPegawaiLogin().namaLengkap
				var objDelete = {
					"dataDel": dataDel,
					"noregistrasi": $scope.item.noRegistrasi,
                    "alasan": $scope.item.alasan,
                    "pegawai": nama
				};
				if (dataDel.length != 0) {
					medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
						//  managePasien.hapusTindakan(tempData).then(function(e){
						if (e.status === 201) {
							medifirstService.post('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {

							})
							$scope.popUpHapus.close();
						}
						$scope.isRouteLoading = false
						LoadData();

					})

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
			$scope.TESTCETAK = function () {

				var client = new HttpClient();
				client.get('http://localhost:8080/cetak-antrian?cetak=1&norec=ff8081815d9810c2015d984db6790010', function (response) {
					// do something with response
				});
			}

			$scope.simpanDokter = function () {
                debugger;
                // var listRawRequired = [
                //     "items.pilihDokter|k-ng-model|Dokter"
                // ];
                // var isValid = ModelItem.setValidation($scope, listRawRequired);

                // if(isValid.status){
                // munculkan nama dokter di grid
                // items.pilihDokter = data.data.dokter.namalengkap;

                // save dokter yang dipilih
                var tmpData = {
                    norec_apd: $scope.item.norec_apd,
                    // iddokter: dataPasienSelected.pilihDokter.id
                    iddokter: $scope.item.pilihDokter.id
				}
				if ($scope.item.deptid === '16' || $scope.item.deptid === '17' || $scope.item.deptid === '35') {
					medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
						// update status antrian
						$scope.winDialogss.close();
						// loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id);
						LoadData();
						// $scope.findData(); 
						$scope.item.pilihDokter = '';

					});
					// } else {
					//     ModelItem.showMessages(isValid.messages);
					// }
				} else {
					medifirstService.post('rawatjalan/save-update-dokter-antrian', tmpData).then(function (e) {
						// update status antrian
						$scope.winDialogss.close();
						// loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id);
						loadData();
						// $scope.findData(); 
						$scope.item.pilihDokter = '';

					});
				}
            }

			$scope.inputTindakanBeta = function (item, data) {
				// loaddata();
				debugger;
				$scope.hideBtnSimpan = true;
				if ($scope.item.deptid === '16' || $scope.item.deptid === '17' || $scope.item.deptid === '35') {
                	if ($scope.item.pgpjid === undefined || $scope.item.pgpjid === '' || $scope.item.pgpjid === '1' || $scope.item.pgpjid === null) {
						// $scope.UbahDokter = function (item, data) {
							if (data === undefined)
							data = $scope.item;

							$scope.item = data;
							medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
							$scope.listDokter = data.data.dokter;
						})
						// show popup untuk pilih dokter
						$scope.winDialogss.center().open();
						// }
						// toastr.error('Dokter Belum Di Pilih', 'Peringatan');
						$scope.hideBtnSimpan = false;
						return;
					}
				} else {
                	if ($scope.item.pgpjid === undefined || $scope.item.pgpjid === '' || $scope.item.pgpjid === '1' || $scope.item.pgpjid === null) {
						// $scope.UbahDokter = function (item, data) {
							if (data === undefined)
							data = $scope.item;

							$scope.item = data;
							medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
							$scope.listDokter = data.data.dokter;
						})
						// show popup untuk pilih dokter
						$scope.winDialogss.center().open();
						// }
						// toastr.error('Dokter Belum Di Pilih', 'Peringatan');
						$scope.hideBtnSimpan = false;
						return;
					}
				}
				debugger;

				// * Validasi Untuk Sekali Bayar
				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar


				// if ($scope.item.strukfk != undefined || $scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//return;
				// }

				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}

				// if ($scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//return;
				// }

				if ($scope.item) {
					$state.go('InputTindakanDiagnosa', {
						norecPD: $scope.item.norec_pd,
						norecAPD: $scope.dataSelected.norec_apd,

					});
				} else {
					messageContainer.error('Pasien belum di pilih')
				}
			}
            // $scope.simpanDokter = function () {
			// 	debugger;
            //     // 
            //     // var listRawRequired = [
            //     //     "items.pilihDokter|k-ng-model|Dokter"
            //     // ];
            //     // var isValid = ModelItem.setValidation($scope, listRawRequired);

            //     // if(isValid.status){
            //     // munculkan nama dokter di grid
            //     // items.pilihDokter = data.data.dokter.namalengkap;

            //     // save dokter yang dipilih
            //     var tmpData = {
            //         norec_apd: $scope.item.norec_apd,
            //         // iddokter: dataPasienSelected.pilihDokter.id
            //         iddokter: $scope.item.pilihDokter.id
            //     }
            //     medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
            //         // update status antrian
            //         $scope.winDialogss.close();
            //         loadData();
            //         // $scope.findData(); 
            //         $scope.item.pilihDokter = '';

            //     });
            //     // } else {
            //     //     ModelItem.showMessages(isValid.messages);
            //     // }
			// }
			


			$scope.UbahDokterResep = function () {

				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}


				if ($scope.item) {
					var chacePeriode = {
						0: new moment($scope.item.tglMasuk).format('YYYY-MM-DD 00:00'),
						1: new moment($scope.now).format('YYYY-MM-DD 23:59'),
						2: $scope.item.noRegistrasi,
						3: '',
						4: '',
						5: '',
						6: ''
					}
					cacheHelper.set('DaftarResepCtrl2', chacePeriode);
					$state.go('DaftarResep');
					// $state.go('InputTindakanDiagnosa', {
					// 	norecPD: $scope.item.norec_pd,
					// 	norecAPD: $scope.dataSelected.norec_apd,

					// });
				} else {
					messageContainer.error('Pasien belum di pilih')
				}
			}

			$scope.diagnosa = function () {
				debugger;
				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}
                // $scope.Detail = function () {
                if ($scope.item.noRegistrasi != undefined) {
                    
                    var obj = {
                        noRegistrasi: $scope.item.noRegistrasi
                    }
                    var arrStr = {
                        0: $scope.item.noCm,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noRegistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.jenisPasien,
                        6: $scope.item.tglMasuk,
                        7: $scope.dataSelected.norec_apd,
                        8: $scope.item.norec_pd,
                        9: $scope.item.kelasId,
                        10: $scope.item.kelasRawat,
                        11: $scope.dataSelected.ruid,
                        12: $scope.item.lastRuangan
                    }
                    cacheHelper.set('InputDiagnosaDokterAllCtrl', arrStr);
                    $state.go('InputDiagnosaDokterAll', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }
			}

			$scope.DaftarRuangan = function () {
                debugger;
                if ($scope.dataSelected === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                    return
                } else {
					medifirstService.getServiceArray("tatarekening/get-combo-detail-regis").then(function (data) {
						$scope.listRuanganDokter = data.ruangan;
						$scope.listKelas = data.kelas
						$scope.listDokter = data.dokter;
						$scope.item.kelasKonsul = {id:$scope.item.kelasId,namakelas:$scope.item.kelasRawat}
						$scope.popUpSx.center().open()
	
						$scope.cboDokter = false;
						$scope.cboUbahDokter = false;
						$scope.cboKonsul = true;
						$scope.showUbahTanggal = false;
					  });
                }
            }
			$scope.batalKonsul = function () {
                $scope.popUpSx.close();
			}
			
			$scope.simpanKonsul = function () {
				debugger;
				var length = 0
				var dataKonsul = {
					"asalrujukanfk": 6,
					"kelasfk": $scope.item.kelasKonsul.id,
					"noantrian": length,
					"norec_pd": $scope.dataSelected.norec_pd,
					"dokterfk": $scope.item.namaDokter.id,
					"objectruangantujuanfk": $scope.item.ruanganKonsul.id,
					"objectruanganasalfk": $scope.dataSelected.ruid
				}
				medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
					// LoadData();
					// $scope.saveLogKonsul();
					debugger;
					var dokterId = "";
					if ($scope.item.namaDokter.id == undefined || $scope.item.dokter == "") {
						dokterId = null;
					} else
						dokterId = $scope.item.namaDokter.id;
					var json = {
						'noregistrasi': $scope.item.noRegistrasi,
						'jenispasien': idKelompokPasienLastfk,
						'idruangan': $scope.item.ruanganKonsul.id,
						'norec_apd': e.data.data.norec,
						'idpegawai': dokterId
					}
					medifirstService.post('registrasi/save-biaya-konsul', json).then(function (e) {
						// 
					});
					$scope.now = new Date();
					var data = {
						"norec_kdr": '',
						"objectruangantujuanfk": $scope.item.ruanganKonsul.id,
						"objectruanganasalfk": $scope.dataSelected.ruid,
						"tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
						"objectstatuskendalidokumenfk": 2,
						"nocmfk": $scope.item.pasienID,
						"tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
						"catatan": "",
						"noregistrasifk": e.data.data.norec
						//"tglkembali": tglkembali
					};
					medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function (e) {
		
					});
				})
			}
			// **Show Komponen **//

			$scope.showKomponenHarga = function () {
				if ($scope.dataSelected == undefined) {
					messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}
				// 
				loadKomponen();
				$scope.item.tglPelayanans = moment(new Date($scope.dataSelected.tglPelayanan)).format('DD-MM-YYYY HH:mm')
				$scope.item.namaPelayanans = $scope.dataSelected.namaPelayanan;
				$scope.popupKomponen.center().open();
				// Get current actions
				var actions = $scope.popupKomponen.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popupKomponen.setOptions({ actions: actions });

			}

			function loadKomponen() {
				medifirstService.get("tatarekening/get-komponenharga-pelayanan?norec_pp=" + $scope.dataSelected.norec).
					then(function (data) {
						$scope.sourceKomponens = new kendo.data.DataSource({
							data: data.data.data,
							serverPaging: false,
							pageSize: 10,
							schema: {
								model: {
									fields: {
										komponenharga: { type: "string" },
										jumlah: { type: "number" },
										hargasatuan: { type: "number" },
										hargadiscount: { type: "number" },
										jasa: { type: "number" },

									}
								}
							}, aggregate: [
								{ field: 'hargasatuan', aggregate: 'sum' },
								{ field: 'hargadiscount', aggregate: 'sum' },
								{ field: 'jasa', aggregate: 'sum' },
							]


						});
						// $scope.sourceKomponens = data.data.data;

					});
			}
			$scope.klikKomponen = function (dataSelectedKomponen) {
				if (dataSelectedKomponen.komponenharga != "Jasa Sarana") {
					// $scope.button = false;
					// $scope.billing = false;
					// $scope.cetak = false;
					// $scope.dtTanggal = false;
					// $scope.FilterData = false;
					$scope.DiskonKM = true;
					$scope.label = dataSelectedKomponen.komponenharga;
					$scope.item.komponenDis = dataSelectedKomponen.hargasatuan;
					$scope.item.persenDiscount = "";
					$scope.item.diskonKomponen = "";
					$scope.item.JasaKomponen = dataSelectedKomponen.jasa;
					norec_ppd = dataSelectedKomponen.norec
					norec_pp = dataSelectedKomponen.norec_pp
					strukfk = $scope.dataSelected.strukfk
					hargasatuan = dataSelectedKomponen.hargasatuan
				} else {
					$scope.DiskonKM = false;
				}
			}

			$scope.columnKomponens = {
				sortable: true,
				// pageable: true,
				selectable: "row",
				columns: [
					{
						"field": "komponenharga",
						"title": "Komponen",
						"width": "100px",
					},
					{
						"field": "jumlah",
						"title": "Jumlah",
						"width": "50px"
					},
					{
						"field": "hargasatuan",
						"title": "Harga Satuan",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>",
						aggregates: ["sum"],
						footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.hargasatuan.sum  #', '')}}</span>"
					},
					{
						"field": "hargadiscount",
						"title": "Diskon",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
						aggregates: ["sum"],
						footerTemplate: "{{formatRupiah('#:data.hargadiscount.sum  #', '')}}"
					},
					{
						"field": "jasa",
						"title": "Jasa Cito",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
						aggregates: ["sum"],
						footerTemplate: "<span class='style-right'>{{formatRupiah('#:data.jasa.sum  #', '')}}</span>"
					},
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
			};

			// **end ShowKomponen
			$scope.cetakSurat = function () {
				// $mdDialog.show(confirm).then(function() {
				debugger
				var stt = 'false'
				if (confirm('View Surat Tagihan? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var total = $scope.item.billing
				var deposit = $scope.item.deposit
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-suratTagihanDeposit=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&total=' + total + '&deposit=' + deposit + '&view=' + stt, function (response) {
					// do something with response
				});
			}

			$scope.TambahTindakanTerKlaim = function () {

				// if (KelompokUser[0].id != 52) {
				// 	alert('Hanya TataRekening/Admin yg boleh mengklaim!')
				// 	return
				// }

				var tempData = [];
				var logData = [];
				var dataDel = [];
				var tglajah = '';
				var dataKlaim = [];
				if ($scope.selectedData.length > 0) {

					$scope.selectedData.forEach(function (items) {
						dataKlaim.push(items);
						if (items.strukfk != " / ") {
							alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
							return;
						}

						// if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
						// 	for (var i = tglkpnaja.length - 1; i >= 0; i--) {
						// 		if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
						// 			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
						// 			return;
						// 		}

						// 	}
						// } else {
						// 	tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
						// 	medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
						// 		if (dat.data.sudahblm == true) {
						// 			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
						// 			return;
						// 		}
						// 	})
						// }
					})

				}
				if (dataKlaim.length == 0) {
					alert('Checklist yang akan di hapus!')
					return;
				}

				var objKlaim = {
					"pelayananpasien": dataKlaim,
					"tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
				};

				medifirstService.post('tatarekening/tindakan/save-tindakan-tidak-terklaim', objKlaim).then(function (e) {
					// LoadData(); 
					loadListTindakanTakTerklaim();
					$scope.popupList.center().open();
				});

			}

			function loadListTindakanTakTerklaim() {
				medifirstService.get("tatarekening/detail-tindakan-takterklaim?noregistrasi="
					+ $scope.dataParams.noRegistrasi).then(function (data) {
						data2 = data.data.data
						var total = 0;
						for (var i = 0; i < data2.length; i++) {
							total = parseFloat(total) + parseFloat(data2[i].total);
						}
						$scope.item.TotalTakterklaim = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
						$scope.sourceTindakan = new kendo.data.DataSource({
							data: data2
						});
					});
			}

			$scope.ListTindakanTakTerklaim = function () {
				loadListTindakanTakTerklaim();
				$scope.popupList.center().open();
			}

			$scope.selectedData2 = [];
			$scope.onClickSatu = function (e) {
				var element = $(e.currentTarget);
				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#Kgrid").data("kendoGrid"),
					// grid = $("#grid").data("kendoGrid"),
					dataItem = grid.dataItem(row);

				// $scope.selectedData[dataItem.noRec] = checked;
				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.norec == dataItem.norec;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].norec === dataItem.norec) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].norec === dataItem.norec) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}

			$scope.HapusTindakanTakTerklaim = function () {
				var dataHapus = [];
				var tempData = [];
				// if ($scope.selectedData2 != undefined){            	 	
				//       for (var i = data2.length - 1; i >= 0; i--) {
				//       	for (var j = $scope.selectedData2.length - 1; j >=0; j--) {
				//       		if ($scope.selectedData2[j].norec === data2[i].norec){                            
				//               dataHapus.push[$scope.selectedData2[j]]                           	                                
				//        	}
				//           }
				//       }
				//       $scope.sourceTindakan = new kendo.data.DataSource({
				//           data: data2
				//       }); 
				//   }
				if ($scope.selectedData2.length > 0) {
					$scope.selectedData2.forEach(function (items) {
						dataHapus.push(items);
						tempData.push(items);
					});
				}
				var objKlaim = {
					"pelayananpasiendelete": dataHapus,
					"tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
				};

				medifirstService.post('tatarekening/tindakan/hapus-tindakan-tidak-terklaim', objKlaim).then(function (e) {
					// LoadData(); 
					loadListTindakanTakTerklaim();
					$scope.popupList.center().open();
				});

			}

			$scope.SimpanTindakanTakTerklaim = function () {
				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
				//     return;
				// }

				if (KelompokUser[0].id != 52) {
					alert('Hanya TataRekening/Admin yg boleh mengklaim!')
					return
				}

				var tempData = [];
				var logData = [];
				var dataDel = [];
				var tglajah = '';
				var dataKlaim = [];
				if ($scope.selectedData2.length > 0) {

					$scope.selectedData2.forEach(function (items) {
						if (items.strukfk != " / ") {
							alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
							return;
						}

						if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
							for (var i = tglkpnaja.length - 1; i >= 0; i--) {
								if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
									alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
									return;
								}

							}
						} else {
							tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
							medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
								if (dat.data.sudahblm == true) {
									alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
									return;
								}
							})
						}
					})
				}

				if (data2.length == 0) {
					alert('Checklist yang akan di hapus!')
					return;
				}

				var objKlaim = {
					"pelayananpasien": data2,
					"tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
				};

				manageTataRekening.post('tatarekening/tindakan/save-tindakan-tidak-terklaim', objKlaim).then(function (e) {
					//    if(e.status === 201){
					//         manageTataRekening.saveLogHapusTindakan(objLog).then(function(e){
					//	  })
					//        }
					LoadData();
				});

			}

			$scope.columnTindakan = [
				{
					"template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
					"width": 40
				},
				{
					"field": "tglPelayanan",
					"title": "Tanggal",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
					// "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
				},
				{
					"field": "namaPelayanan",
					"title": "Nama Pelayanan",
					"width": "200px",
				},
				{
					"field": "kelasTindakan",
					"title": "Kelas",
					"width": "100px",
				},
				{
					"field": "dokter",
					"title": "Dokter",
					"width": "170px",
				},
				{
					"field": "ruanganTindakan",
					"title": "Ruangan",
					"width": "200px",
				},
				{
					"field": "jumlah",
					"title": "Qty",
					"width": "50px",
					"template": "<span class='style-right'>#: jumlah #</span>"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width": "120px",
					"template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
				},
				{
					"field": "diskon",
					"title": "Harga Diskon",
					"width": "120px",
					"template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
				},
				{
					"field": "jasa",
					"title": "Jasa",
					"width": "100px",
					"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
				},
				{
					"field": "total",
					"title": "Total",
					"width": "120px",
					"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
				}
			];

			$scope.selesaiPeriksa = function () {
				var confirm = $mdDialog.confirm()
					.title('Informasi')
					.textContent('Selesai Periksa akan menutup tagihan pasien, Lanjut simpan ?')
					.ok('Ya')
					.cancel('Tidak')
				$mdDialog.show(confirm).then(function () {
					var json = {
						'norec_pd': norec_pd
					}
					manageTataRekening.post('tatarekening/close-pemeriksaan', json).then(function (e) {

					});
				})
			}

		}
	]);
});