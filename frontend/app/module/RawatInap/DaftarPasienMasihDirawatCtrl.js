define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienMasihDirawatCtrl', ['MedifirstService', 'CacheHelper', '$state', '$q', '$scope', 'DateHelper', '$mdDialog',
		function (medifirstService, cacheHelper, $state, $q, $scope, DateHelper, $mdDialog) {
			// a
			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			var data2 = [];
			var dataInap = [];
			$scope.tombolSimpanBatalPindah = true
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
			$scope.item.periodeAkhir = $scope.now;

			$scope.item.jmlRows = 100
			LoadCache();
			loadData()
			loadCombo()

			function LoadCache() {
				var chacePeriode = cacheHelper.get('cacheDaftarMasihDirawat');
				if (chacePeriode != undefined) {
					$scope.item.ruangan = chacePeriode[0]
					if (chacePeriode[1] != '')
						$scope.item.jmlRows = chacePeriode[1]
					if (chacePeriode[2] != '')
						$scope.item.noRm = chacePeriode[2]
					$scope.item.kelompok = chacePeriode[3]
					$scope.item.rekanan = chacePeriode[4]

					loadData()
				}
				else {
					loadData()
				}
			}
			function loadCombo() {
				medifirstService.get("rawatinap/get-combo-pasien-masih-dirawat", false).then(function (data) {
					// $scope.listDepartemen = data.data.departemen;
					// $scope.listKelompokPasien = data.data.kelompokpasien;
					var data = data.data
					$scope.listRuangan = data.ruanganRi
					$scope.listKelompok = data.kelompokPasien
					var datasu = data;
					$scope.item.kdPelayananRanap = datasu.kddeptlayananranap.nilaifield;
					$scope.item.kdPelayananOk = datasu.kddeptlayananok.nilaifield;
				})
				// modelItemAkuntansi.getDataGeneric("ruangan", false).then(function(data) {
				// 	$scope.listRuangan = data;
				// })
			}


			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarPasienMasihDirawat.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Pasien Masih Dirawat",
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
						"field": "tglregistrasi",
						"title": "Tgl Registrasi",
						"width": "130px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
					},

					{
						"field": "nocm",
						"title": "No RM",
						"width": "80px",
						"template": "<span class='style-center'>#: nocm #</span>"
					},
					{
						"field": "noregistrasi",
						"title": "No Registrasi",
						"width": "100px",
						"template": "<span class='style-center'>#: noregistrasi #</span>"
					},
					{
						"field": "nobpjs",
						"title": "No BPJS",
						"width": "100px",
						"template": "<span class='style-center'>#: nobpjs #</span>"
					},
					{
						"field": "noidentitas",
						"title": "No Identitas",
						"width": "100px",
						"template": "<span class='style-center'>#: noidentitas #</span>"
					},
					{
						"field": "namapasien",
						"title": "Nama Pasien",
						"width": "200px",
						"template": "<span class='style-left'>#: namapasien #</span>"
					},
					{
						"field": "alamatlengkap",
						"title": "Alamat",
						"width": "150px",
						"template": "<span class='style-center'>#: alamatlengkap #</span>"
					},
					{
						"field": "umur",
						"title": "Umur",
						"width": "150px",
						"template": "<span class='style-left'>#: umur #</span>"
					},
					{
						"field": "namadokter",
						"title": "Dokter",
						"width": "150px",
						// "template": "<span class='style-left'>#: namadokter #</span>"
						"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
					},
					{
						"field": "jeniskelamin",
						"title": "JK",
						"width": "80px",
						"template": "<span class='style-left'>#: jeniskelamin #</span>"
					},
					{
						"field": "namaruangan",
						"title": "Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},
					{
						"field": "namakamar",
						"title": "Kamar",
						"width": "100px",
						"template": '# if( namakamar==null) {# - # } else {# #= namakamar # #} #'
					},
					{
						"field": "namabed",
						"title": "Bed",
						"width": "80px",
						"template": '# if( namabed==null) {# - # } else {# #= namabed # #} #'
					},
					{
						"field": "namakelas",
						"title": "Kelas",
						"width": "80px",
						"template": "<span class='style-left'>#:  namakelas #</span>"
					},
					{
						"field": "kelompokpasien",
						"title": "Tipe Pembayaran",
						"width": "150px",
						"template": "<span class='style-center'>#: kelompokpasien #</span>"
					},
					{
						"field": "namarekanan",
						"title": "Rekanan",
						"width": "150px",
						"template": "<span class='style-center'>#: namarekanan #</span>"
					},

				]
			}


			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}



			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;
				$scope.item.ruangan = { namaExternal: "" };
				$scope.item.kelompok = { namaExternal: "" };
				$scope.item.rekanan = { namaExternal: "" };
				$scope.SearchData();
			}


			$scope.$watch('item.kelompok', function (e) {
				if (e === undefined) return;
				if ($scope.isLoadEdit == true) {
					$scope.nonUmum = true;
					$scope.isLoadEdit = false;
					return;
				}
				medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
					.then(function (z) {
						$scope.listRekanan = z.data.rekanan;
						if (e.kelompokpasien == 'Umum/Pribadi') {
							$scope.item.rekanan = '';
							$scope.nonUmum = false;
							$scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
						}
						else if (e.kelompokpasien.indexOf('BPJS') > -1) {
							$scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
							$scope.nonUmum = true;
							$scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

						}
						else if (e.kelompokpasien == 'Jamkesda') {
							$scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
							$scope.nonUmum = true;
							$scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

						}
						else if (e.kelompokpasien == 'Non Kuota') {
							$scope.item.rekanan = undefined
							// $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
							$scope.nonUmum = false;
							$scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

						} else if (e.kelompokpasien == 'Telemedicine') {
							$scope.item.rekanan = '';
							$scope.nonUmum = false;
							$scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
							$scope.isTelemedicine = 'true';

						}
						else {
							$scope.nonUmum = true;
							$scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
							$scope.item.jenisPasien = {
								id: $scope.listJenisPelayanan[1].id,
								jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan
							}


						}
						if ($scope.resultEdit != undefined)

							$scope.item.jenisPasien = {
								id: parseInt($scope.resultEdit.objectjenispelayananfk),
								jenispelayanan: $scope.resultEdit.jenispelayanan
							}

					})
			});

			//fungsi search data
			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');
				var tempRuanganArr = {}
				var tempKelompokArr = {}
				var tempRekananArr = {}
				if ($scope.item.ruangan == undefined) {
					var rg = ""
				} else {
					var rg = "&ruanganId=" + $scope.item.ruangan.id
					tempRuanganArr = { id: $scope.item.ruangan.id, namaruangan: $scope.item.ruangan.namaruangan }
				}
				if ($scope.item.kelompok == undefined) {
					var kp = ""
				} else {
					var kp = "&kelompokId=" + $scope.item.kelompok.id
					tempKelompokArr = { id: $scope.item.kelompok.id, kelompokpasien: $scope.item.kelompok.kelompokpasien }
				}
				if ($scope.item.rekanan == undefined) {
					var rk = ""
				} else {
					debugger;
					var rk = "&rekananId=" + $scope.item.rekanan.id
					tempRekananArr = { id: $scope.item.rekanan.id, namarekanan: $scope.item.rekanan.namarekanan }
				}
				if ($scope.item.noReg == undefined) {
					var reg = ""
					var tempNoREG = ""
				} else {
					var reg = "&noReg=" + $scope.item.noReg
					var tempNoREG = $scope.item.noReg
				}
				if ($scope.item.noRm == undefined) {
					var rm = ""
					var tempRM = ""
				} else {
					var rm = "&noRm=" + $scope.item.noRm
					var tempRM = $scope.item.noRm
				}
				if ($scope.item.nama == undefined) {
					var nm = ""
				} else {
					var nm = "namaPasien=" + $scope.item.nama
				}

				var jmlRow = ""
				if ($scope.item.jmlRows != undefined) {
					jmlRow = $scope.item.jmlRows
				}
				var chacePeriode = {
					0: tempRuanganArr,
					1: jmlRow,
					2: tempRM,
					3: tempRekananArr
				}
				cacheHelper.set('cacheDaftarMasihDirawat', chacePeriode);

				$scope.isRouteLoading = true;

				medifirstService.get("rawatinap/get-daftar-pasien-masih-dirawat?"
					+ nm + reg + rg + kp + rk + rm + "&jmlRow=" + jmlRow
					// + "&tglAwal="+ tglAwal +"&tglAkhir="+ tglAkhir

				).then(function (data) {
					if (data.statResponse) {
						var data = data.data
						for (var i = 0; i < data.data.length; i++) {
							// data.data[i].no = i+1
							var tanggal = $scope.now;
							var tanggalLahir = new Date(data.data[i].tgllahir);
							var umur = DateHelper.CountAge(tanggalLahir, tanggal);
							data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

						}
						$scope.isRouteLoading = false;
						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							data: data.data,
							pageSize: 10,
							total: data.data.length,
							serverPaging: false,


						});
					} else {
						$scope.isRouteLoading = false;
					}


				});
				// var chacePeriode = tglAwal + ":" + tglAkhir;
				// cacheHelper.set('DaftarPasienAktif', chacePeriode);
			}


			$scope.pindah = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('rawatinap/get-antrian-pasien-diperiksa?noreg=' + $scope.dataPasienSelected.noregistrasi
						+ '&ruangId=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.dataPasienSelected.norec_pd,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.dataPasienSelected.ruanganid
								cacheHelper.set('CachePindah', CachePindah);
							}

						})

				}
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

			$scope.BatalRanap = function () {
				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Pasien Dahulu!");
					return;
				}

				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Apakah Anda Yakin Akan Membatalkan Pelayanan Rawat Inap Pasien Ini?')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					HapusRanap();
				})

				//                		}
				// // });			  	
				// }
			}

			function HapusRanap() {
				var objSave = {
					data: $scope.dataPasienSelected
				}
				// 
				$scope.tombolBatalRanap = true
				$scope.isRouteLoading = true
				medifirstService.post('rawatinap/save-batal-rawat-inap', objSave).then(function (e) {
					$scope.tombolBatalRanap = false
					$scope.isRouteLoading = false

					loadData();
				}, function (error) {
					$scope.tombolBatalRanap = false
				});

			}
			$scope.batalPindah = function () {
				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Pasien Dahulu!");
					return;
				}
				$scope.tombolSimpanBatalPindah = false
				medifirstService.post('rawatinap/save-batal-pindah-ruangan', $scope.dataPasienSelected).then(function (e) {
					loadData();
					$scope.tombolSimpanBatalPindah = true
				}, function (error) {
					$scope.tombolSimpanBatalPindah = true
				});
			}
			$scope.terimaKamar = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.listNoBed = []
				$scope.listKamar = []

				delete $scope.item.kamar
				delete $scope.item.nomorTempatTidur
				getKamar($scope.dataPasienSelected.objectruanganlastfk, $scope.dataPasienSelected.objectkelasfk)

				// $scope.item.kamar = {id:$scope.dataPasienSelected.objectkamarfk,namakamar: $scope.dataPasienSelected.namakamar  }
				// $scope.item.nomorTempatTidur = {id:$scope.dataPasienSelected.nobed,reportdisplay: $scope.dataPasienSelected.namabed  }
				$scope.winDialog.center().open()
			}
			$scope.$watch('item.kamar', function (e) {
				if (e === undefined) return;
				var kamarId = $scope.item.kamar.id;
				medifirstService.get("rawatinap/get-nobedbykamar?idKamar=" + kamarId)
					.then(function (a) {
						if ($scope.item.rawatGabung) {
							$scope.listNoBed = a.data.bed;
						} else {
							$scope.listNoBed = _.filter(a.data.bed, function (v) {
								return v.statusbed === "KOSONG";
							})
						}
					})
			});
			function getKamar(ruanganId, kelasId) {
				if (ruanganId == undefined && kelasId == undefined) return;
				var kelasIds = "idKelas=" + kelasId
				var ruanganIds = "&idRuangan=" + ruanganId
				medifirstService.get("rawatinap/get-kamarbyruangankelas?" + kelasIds + ruanganIds)
					.then(function (b) {
						if ($scope.item.rawatGabung) {
							$scope.listKamar = b.data.kamar;
						} else {
							$scope.listKamar = _.filter(b.data.kamar, function (v) {
								return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
							})
						}
					});
			}
			$scope.simpanKamar = function () {
				var json = {
					'norec_pd': $scope.dataPasienSelected.norec_pd,
					'ruanganlastfk': $scope.dataPasienSelected.objectruanganlastfk,
					'objectkamarfk': $scope.item.kamar.id,
					'nobed': $scope.item.nomorTempatTidur.id,
					'nobedasal': $scope.dataPasienSelected.nobed,

				}
				medifirstService.post("rawatinap/update-kamar", json)
					.then(function (b) {
						delete $scope.item.kamar
						delete $scope.item.nomorTempatTidur

						loadData()
						$scope.winDialog.close()

					});
			}
			$scope.tutup = function () {
				delete $scope.item.kamar
				delete $scope.item.nomorTempatTidur
				$scope.winDialog.close()
			}
			////////////////////// -TAMAT- /////////////////////////
		}
	]);
});