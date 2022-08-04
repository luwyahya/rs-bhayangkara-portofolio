define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarRegistrasiPasienJenazahCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {
			// DaftarRegistrasiPasienJenazahCtrl
			$scope.dataVOloaded = true;
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
			$scope.cboUbahSEP = true;
			$scope.cboSep = false;
			$scope.item.jmlRows = 50
			$scope.tombolSimpanVis = true;
			$scope.noDefault = '';
			$scope.norecPermohonan = '';
			loadCombo();
			loadData();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienJenazahCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					// $scope.item.noReg = arrPeriode[2];		
					// $scope.item.noRm = arrPeriode[3];	
					// $scope.item.nama = arrPeriode[4];			
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
					// $scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("jenazah/get-data-combo-operator", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
					$scope.listRuanganBatal = data.data.ruanganall;
					$scope.listHubunganKel = data.data.hubungankeluarga;
					$scope.listJenisKelamin = data.data.jeniskelamin;
					$scope.listPembatalan = data.data.pembatalan;
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.item.noSuratKematian = data.data.suratkematian;
					$scope.noDefault = data.data.suratkematian;
					$scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[1].id, jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa };

				});
				medifirstService.getPart("jenazah/get-data-diagnosa", true, true, 20).then(function (data) {
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart('sysadmin/general/get-combo-pegawai', true, 10).then(function (e) {
					$scope.listDataPegawai = e;
					$scope.listDataPegawais = e;
					$scope.listDataPegawaiw = e;
				})
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasien = {
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
						"field": "noregistrasi",
						"title": "NoReg",
						"width": "90px"
					},
					{
						"field": "nocm",
						"title": "NoRM",
						"width": "70px",
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
						"width": "85px",
						"template": "<span class='style-left'>#: jeniskelamin #</span>"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
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
						"field": "namarekanan",
						"title": "Penjamin",
						"width": "100px",
						"template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
					},
					{
						"field": "tglpulang",
						"title": "Tgl Pulang",
						"width": "80px",
						"template": '# if( tglpulang==null) {# - # } else {# #= tglpulang # #} #'

					},
					{
						"field": "nosep",
						"title": "No SEP",
						"width": "80px",
						"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'

					},
					{
						"field": "alamatlengkap",
						"title": "Alamat",
						"width": "100px",
						"template": '# if( alamatlengkap==null) {# - # } else {# #= alamatlengkap # #} #'

					},
					{
						"field": "diagnosa",
						"title": "Diagnosa",
						"width": "100px",
						// "template": "<span class='style-left'>#: kelompokpasien #</span>"
					},

				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
				,
				pageable: {
					messages: {
						// display: "Menampilkan {2} data"
						display: "Menampilkan {0} - {1} data dari {2} data"
					}
				}
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
					var rm = "&norm=" + $scope.item.noRm
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
				var cacheNoreg = ""
				if ($scope.item.noReg != undefined) {
					cacheNoreg = $scope.item.noReg
				}
				var cacheNoRm = ""
				if ($scope.item.noRm != undefined) {
					cacheNoRm = $scope.item.noRm
				}
				var cacheNama = ""
				if ($scope.item.nama != undefined) {
					cacheNama = $scope.item.nama
				}
				var jmlRow = ""
				if ($scope.item.jmlRows != undefined) {
					jmlRow = "&jmlRows=" + $scope.item.jmlRows
				}

				$q.all([
					medifirstService.get("jenazah/get-data-registrasi-pasien-Jenazah?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ jmlRow),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					var result = data[0].data //.data;
					for (var i = 0; i < result.length; i++) {
						result[i].no = i + 1
						var tanggal = $scope.now;
						var tanggalLahir = new Date(result[i].tgllahir);
						var umur = dateHelper.CountAge(tanggalLahir, tanggal);
						result[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
					}
					$scope.dataDaftarPasien = {
						data: result,
						pageSize: 10,
						// total: data.length,
						// serverPaging: false,
						selectable: true,
						refresh: true,
						schema: {
							model: {
								fields: {
								}
							}
						},
						aggregate: [
							{ field: 'noregistrasi', aggregate: 'count' },
						]
					}
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasienJenazahCtrl', chacePeriode);
				});


			};



			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.dataPasienSelected = dataPasienSelected;
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter };
					$scope.noRekamMedis = dataPasienSelected.nocm;
					// $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
				}
			}

			var status = '';
			$scope.popUpInputTindakan = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');
					return
				}

				medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (e) {
					status = e.data.status;
					if (status == true) {
						toastr.error('Data Sudah Diclosing, Hubungi Tatarekening', 'Info');
						return;

					}
					medifirstService.get("sysadmin/general/get-apd-general?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
					).then(function (data) {
						$scope.listRuanganApd = data.data.ruangan;
						$scope.item.ruanganAntrian = {
							id: $scope.listRuanganApd[0].id,
							namaruangan: $scope.listRuanganApd[0].namaruangan,
							norec_apd: $scope.listRuanganApd[0].norec_apd
						}
					})
					$scope.popupAntrians.center().open();
					$scope.showInputTindakan = true;
					$scope.showBuktiLayanan = false;
				});


			}


			$scope.pegawai = ModelItem.getPegawai();

			$scope.registrasiJenazah = function () {
				cacheHelper.set('CacheRegistrasiPasien', undefined);
				cacheHelper.set('cacheStatusPasien', 'BARU');
                cacheHelper.set('isJenazah', true);
                $state.go('UmVnaXN0cmFzaVBlbGF5YW5hbkplbmF6YWg=', {
                    noCm: $scope.dataPasienSelected.nocm
                });
			}

			$scope.transaksiPelayanan = function () {

				medifirstService.get("jenazah/get-data-for-combo", true).then(function (dat) {
					$scope.listRuanganApd = dat.data.ruanganjenazah;
					$scope.item.ruanganAntrian = $scope.listRuanganApd[0];
					$scope.popupAntrians.center().open();
				})
			}
			$scope.showRincian = function () {
				medifirstService.get("jenazah/get-apd?noregistrasi="
					+ $scope.dataPasienSelected.noregistrasi
				).then(function (data) {
					debugger;
					$scope.daftarApd = data.data.ruangan;
					if ($scope.daftarApd.length > 0) {
						var status = false
						var norec_apd = ''
						for (var i = 0; i < $scope.daftarApd.length; i++) {
							status = false
							if ($scope.daftarApd[i].id == $scope.item.ruanganAntrian.id) {
								status = true
								norec_apd = $scope.daftarApd[i].norec_apd
								break
							}
						}
						if (status == true) {
							$scope.lihatRincian(norec_apd)
						} else {
							$scope.saveKonsul()
						}
					}
				})


			}
			$scope.saveKonsul = function (argument) {
				$scope.tombolSimpanVis = false;
				var dataKonsul = {
					"asalrujukanfk": 5, //datang sendiri
					"norec_pd": $scope.dataPasienSelected.norec,
					"dokterfk": $scope.item.dokter,
					"objectruangantujuanfk": $scope.item.ruanganAntrian.id,
					"objectruanganasalfk": $scope.dataPasienSelected.objectruanganlastfk,
					"tglregistrasidate": moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
				}
				medifirstService.post('jenazah/save-apd', dataKonsul).then(function (e) {
					$scope.tombolSimpanVis = true;
					var norec_apd = e.data.data.norec
					debugger;
					var arrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.objectkelasfk,
						6: $scope.dataPasienSelected.namakelas,
						7: $scope.dataPasienSelected.tglregistrasi,
						8: norec_apd,//NOREC ANTRIAN
						9: $scope.dataPasienSelected.namaruangan,
						10: $scope.dataPasienSelected.objectruanganlastfk,
						11: $scope.dataPasienSelected.norec,
						12: "",//nor
						13: $scope.dataPasienSelected.kelompokpasien,
						14: $scope.dataPasienSelected.pgid,
						15: $scope.item.ruanganAntrian.id,
						16: $scope.item.ruanganAntrian.objectdepartemenfk,
						17: $scope.dataPasienSelected.rekanan,
						18: $scope.dataPasienSelected.idjenispelayanan,
						19: $scope.dataPasienSelected.jenispelayanan,
						20: $scope.dataPasienSelected.agama
					}
					cacheHelper.set('RincianPelayananJenazahCtrl', arrStr);
					$state.go('RincianPelayananJenazah')

				}, function (error) {
					$scope.tombolSimpanVis = true;
				})
			}

			$scope.lihatRincian = function (norec_apd) {
				var idKelas = 0;
				var namaKelas = '';
				if ($scope.dataPasienSelected.objectkelasfk != 6) {
					idKelas = 6;
					namaKelas = "Non Kelas";
				} else {
					idKelas = $scope.dataPasienSelected.objectkelasfk;
					namaKelas = $scope.dataPasienSelected.namakelas;
				}
				var arrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.dataPasienSelected.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					4: $scope.dataPasienSelected.umur,
					5: idKelas,//$scope.dataPasienSelected.objectkelasfk,
					6: namaKelas,//$scope.dataPasienSelected.namakelas,
					7: $scope.dataPasienSelected.tglregistrasi,
					8: norec_apd,//NOREC ANTRIAN
					9: $scope.dataPasienSelected.namaruangan,
					10: $scope.dataPasienSelected.objectruanganlastfk,
					11: $scope.dataPasienSelected.norec,
					12: "",//nor
					13: $scope.dataPasienSelected.kelompokpasien,
					14: $scope.dataPasienSelected.pgid,
					15: $scope.item.ruanganAntrian.id,
					16: $scope.item.ruanganAntrian.objectdepartemenfk,
					17: $scope.dataPasienSelected.kelompokpasien,
					18: $scope.dataPasienSelected.idjenispelayanan,
					19: $scope.dataPasienSelected.jenispelayanan,
					20: $scope.dataPasienSelected.agama
				}
				cacheHelper.set('RincianPelayananJenazahCtrl', arrStr);
				$state.go('RincianPelayananJenazah')
			}

			$scope.BatalJk = function () {
				$scope.item.JenisKelamin = {};
				$scope.item.JenisKelamin = undefined;
				$scope.popUp.close();
			}

			$scope.UbahJk = function () {

				$scope.popUp.center().open();
			}

			$scope.DaftarRuangan = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
					// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
					$state.go('DetailRegistrasi', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			$scope.Detail = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var objSave = {
						noregistrasi: $scope.dataPasienSelected.noregistrasi
					}
					medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (data) {

					});
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			$scope.batalMeninggal = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.info("Data Belum Dipilih")
					return;
				}

				var objSave = {
					'noregistrasi': $scope.dataPasienSelected.noregistrasi
				}

				medifirstService.post('jenazah/batal-meninggal-pasien', objSave).then(function (e) {
					LoadData();
				})
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

			function batalPermohonan() {
				$scope.item.noSuratKematian = $scope.noDefault;
				$scope.item.penanggungJawab = undefined;
				$scope.item.jenisKelamin = undefined;
				$scope.item.hubunganKeluarga = undefined;
				$scope.item.alamatLengkap = undefined;
				$scope.item.pegawaiSatu = undefined;
				$scope.item.pegawaiDua = undefined;
				$scope.item.pegawaiTiga = undefined;
				$scope.item.pegawaiEmpat = undefined;
				$scope.item.pegawaiLima = undefined;
				$scope.Pemulasaraan = undefined;
				$scope.Pengkafanan = undefined;
				$scope.Plastisisasi = undefined;
				$scope.KantongJenazah = undefined;
				$scope.PetiJenazah = undefined;
				$scope.DisinfektanJenazah = undefined;
				$scope.PelayananKerohanian = undefined;
				$scope.TransportasiAmbulan = undefined;
				$scope.DisinfektanAmbulan = undefined;
				$scope.StatusJenazah = undefined;
				$scope.popupPermohonan.close();
			}

			$scope.cetakPermohonan = function () {
				$scope.norecPermohonan = undefined;
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');
					return
				}

				medifirstService.get("jenazah/get-data-permohonan-pelayanan-jenazah?norec_pd="
					+ $scope.dataPasienSelected.norec).then(function (data) {
						var datas = data.data.data[0];
						if (datas != undefined) {
							$scope.norecPermohonan = datas.norec;
							$scope.item.noSuratKematian = datas.nosurat;
							$scope.item.penanggungJawab = datas.penanggungjawab;
							$scope.item.jenisKelamin = {id:datas.objectjeniskelaminfk,jeniskelamin:datas.jeniskelamin};
							$scope.item.hubunganKeluarga = {id:datas.objecthubungankeluargafk,hubungankeluarga:datas.hubungankeluarga};
							$scope.item.alamatLengkap = datas.alamat;
							$scope.item.pegawaiSatu = {id:datas.petugassatu,namalengkap:datas.namapetugassatu};
							$scope.item.pegawaiDua = {id:datas.petugasdua,namalengkap:datas.namapetugasdua};
							$scope.item.pegawaiTiga = {id:datas.petugastiga,namalengkap:datas.namapetugastiga};
							$scope.item.pegawaiEmpat = {id:datas.petugasempat,namalengkap:datas.namapetugasempat};
							$scope.item.pegawaiLima = {id:datas.petugaslima,namalengkap:datas.namapetugaslima};
							if (datas.covid == true) {
								$scope.StatusJenazah = false;
							}else if (datas.noncovid == true) {
								$scope.StatusJenazah = true;
							}						
							$scope.Pemulasaraan = datas.pemulasaraanjenazah;
							$scope.Pengkafanan = datas.pengkafanan;
							$scope.Plastisisasi = datas.plastisisasi;
							$scope.KantongJenazah = datas.kantongjenazah;
							$scope.PetiJenazah = datas.petijenazah;
							$scope.DisinfektanJenazah = datas.disinfektanjenazah;
							$scope.PelayananKerohanian = datas.pelayanankerohanian;
							$scope.TransportasiAmbulan = datas.transportasiambulan;
							$scope.DisinfektanAmbulan = datas.disinfektanambulan;	
						}
						$scope.hideExper = false;
						$scope.popupPermohonan.center().open();
					})

			}

			$scope.batalPermohonan = function () {
				batalPermohonan();
			}

			$scope.cetakSuratPermohonan = function(){
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');
					return
				}

				if ($scope.norecPermohonan == undefined || $scope.norecPermohonan == '') {
					toastr.error("Data Tidak Ditemukan")
					return;
				}	
				
				var user = medifirstService.getPegawaiLogin().namaLengkap
				var stt = 'false'
				if (confirm('View Surat Permohonan Pelayanan Jenazah? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-permohonan-tindakan-pada-jenazah=1&norec=' + $scope.norecPermohonan + '&user=' + user + '&view=' + stt, function (response) {
					// do something with response
				});
			}

			$scope.savePermohonan = function () {
				if ($scope.item.noSuratKematian == $scope.noDefault) {
					toastr.error("Tanda (_) Pada No Surat Belum Diisi!!!")
					return;
				}
				if ($scope.item.penanggungJawab == undefined) {
					toastr.error("Nama Pemohon/Penanggung Jawab Belum Diisi!!!")
					return;
				}
				if ($scope.item.jenisKelamin == undefined) {
					toastr.error("Jenis Kelamin Belum Diisi!!!")
					return;
				}
				if ($scope.StatusJenazah == undefined) {
					toastr.error("Status Belum Dipilih!!!")
					return;
				}

				var StatusJenazahCovid = false;
				var StatusJenazahNonCovid = false;
				if ($scope.StatusJenazah == "0") {
					StatusJenazahCovid = true
					StatusJenazahNonCovid = false;
				} else {
					StatusJenazahNonCovid = true;
					StatusJenazahCovid = false					
				}

				var objSave = {
					'norec': $scope.norecPermohonan,
					'nores_pd': $scope.dataPasienSelected.norec,
					'penanggungjawab': $scope.item.penanggungJawab,
					'nosurat': $scope.item.noSuratKematian,
					'objectjeniskelaminfk': $scope.item.jenisKelamin.id,
					'objecthubungankeluargafk': $scope.item.hubunganKeluarga != undefined ? $scope.item.hubunganKeluarga.id : null,
					'alamat': $scope.item.alamatLengkap != undefined ? $scope.item.alamatLengkap : null,
					'covid': StatusJenazahCovid,
					'noncovid': StatusJenazahNonCovid,
					'petugassatu': $scope.item.pegawaiSatu != undefined ? $scope.item.pegawaiSatu.id : null,
					'petugasdua': $scope.item.pegawaiDua != undefined ? $scope.item.pegawaiDua.id : null,
					'petugastiga': $scope.item.pegawaiTiga != undefined ? $scope.item.pegawaiTiga.id : null,
					'petugasempat': $scope.item.pegawaiEmpat != undefined ? $scope.item.pegawaiEmpat.id : null,
					'petugaslima': $scope.item.pegawaiLima != undefined ? $scope.item.pegawaiLima.id : null,
					'pemulasaraanjenazah': $scope.Pemulasaraan != undefined ? $scope.Pemulasaraan : null,
					'pengkafanan': $scope.Pengkafanan != undefined ? $scope.Pengkafanan : null,
					'plastisisasi': $scope.Plastisisasi != undefined ? $scope.Plastisisasi : null,
					'kantongjenazah': $scope.KantongJenazah != undefined ? $scope.KantongJenazah : null,
					'petijenazah': $scope.PetiJenazah != undefined ? $scope.PetiJenazah : null,
					'disinfektanjenazah': $scope.DisinfektanJenazah != undefined ? $scope.DisinfektanJenazah : null,
					'pelayanankerohanian': $scope.PelayananKerohanian != undefined ? $scope.PelayananKerohanian : null,
					'transportasiambulan': $scope.TransportasiAmbulan != undefined ? $scope.TransportasiAmbulan : null,
					'disinfektanambulan': $scope.DisinfektanAmbulan != undefined ? $scope.DisinfektanAmbulan : null,
				}

				$scope.hideExper = true
				medifirstService.post('jenazah/save-permohonan-pelayanan-jenazah', objSave).then(function (e) {
					$scope.norecPermohonan = e.data.strukorder.norec;
					loadData();
				}, function (error) {
					$scope.hideExper = false
				})
			}

			$scope.hapusPermohonan= function(){
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');
					return
				}

				if ($scope.norecPermohonan == undefined || $scope.norecPermohonan == '') {
					toastr.error("Data Tidak Ditemukan")
					return;
				}	

				var objSave = {
					'norec' : $scope.norecPermohonan,
					'noregistrasi' : $scope.dataPasienSelected.noregistrasi
				}

				medifirstService.post('jenazah/hapus-permohonan-pelayanan-jenazah', objSave).then(function (e) {
					batalPermohonan();
					loadData();				
				})				
			}

			//** BATAS */
		}
	]);
});