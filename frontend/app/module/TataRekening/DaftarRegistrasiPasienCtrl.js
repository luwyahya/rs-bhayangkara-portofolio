define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarRegistrasiPasienCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
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
			loadData();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienCtrl');
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
				// var idDokter = ""
				// if (medifirstService.getPegawaiLogin().jenisPegawai.id == 1) {

				// 	idDokter = medifirstService.getPegawaiLogin().id
				// }
				medifirstService.get("tatarekening/get-data-combo-daftarregpasien").then(function (dat) {
					$scope.listDepartemen = dat.data.departemen;
					$scope.listKelompokPasien = dat.data.kelompokpasien;
					$scope.listDokter = dat.data.dokter;
					$scope.listDokter2 = dat.data.dokter;
				})
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
			$scope.clickPlapon = function () {
				if ($scope.dataPasienSelected == undefined) {
					messageContainer.error("Pilih data dulu")
					return
				} else {
					$scope.popupPlapon.center().open();
				}
			}
			$scope.clickSavePlapon = function () {
				debugger
				var objSave = {
					norec: $scope.dataPasienSelected.norec,
					totalPlapon: $scope.item.totalPlapon
				}

				medifirstService.post('tatarekening/save-plapon', objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})
			}

			$scope.EditPemakaianAsuransi = function () {
				if ($scope.dataPasienSelected == undefined) {
					messageContainer.error("Pilih data dulu")
					return
				} else {

					medifirstService.get("registrasi/get-apd?noregistrasi=" +
						$scope.dataPasienSelected.noregistrasi +
						"&objectruanganlastfk=" + $scope.dataPasienSelected.ruanganid
					).then(function (data) {
						var dataAntrian = data.data.data[0];
						if (dataAntrian != undefined) {
							$state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
								// $state.go('PemakaianAsuransi',{
								norecPD: $scope.dataPasienSelected.norec,
								norecAPD: dataAntrian.norec_apd,
							});

							var cacheSet = $scope.dataPasienSelected.objectasuransipasienfk +
								"~" + $scope.dataPasienSelected.norec_pa +
								"~" + $scope.dataPasienSelected.noregistrasi;

							cacheHelper.set('CachePemakaianAsuransi', cacheSet);
						}
					})
				}
			}

			debugger;
			$scope.columnDaftarPasienPulang = {
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
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Registrasi Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, {
						cells: myHeaders,
						type: "header",
						height: 70
					});
				},
				selectable: 'row',
				pageable: true,
				columns: [{
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
					"title": "No SEP2",
					"width": "150px",
					"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
				},
				{
					"field": "totalplapon",
					"title": "Total Plafon",
					"width": "150px",
					"template": '# if( totalplapon==null) {# - # } else {# #= totalplapon # #} #'
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
					tempInstalasiIdArr = {
						id: $scope.item.instalasi.id,
						departemen: $scope.item.instalasi.departemen
					}
				}
				var rg = ""
				var tempRuanganIdArr = {};
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
					tempRuanganIdArr = {
						id: $scope.item.ruangan.id,
						ruangan: $scope.item.ruangan.ruangan
					}
				}
				var kp = ""
				var tempKelompokArr = {};
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
					tempKelompokArr = {
						id: $scope.item.kelompokpasien.id,
						kelompokpasien: $scope.item.kelompokpasien.kelompokpasien
					}
				}
				var dk = ""
				var tempDokterArr = {};
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
					tempDokterArr = {
						id: $scope.item.dokter.id,
						kelompokpasien: $scope.item.dokter.namalengkap
					}
				}

				var idDokter = ""
				if (medifirstService.getPegawaiLogin().jenisPegawai.id == 1) {
					idDokter = "&idDokter=" + medifirstService.getPegawaiLogin().id
				}

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}



				$q.all([
					medifirstService.get("tatarekening/get-daftar-registrasi-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk +
						'&jmlRows=' + jmlRows),
					// idDokter
				]).then(function (data) {
					$scope.isRouteLoading = false;
					// $scope.dataDaftarPasienPulang = data[0].data;
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 10,
						total: data[0].data,
						serverPaging: false,
						schema: {
							model: {
								fields: {}
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
					cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
				});

			};
			$scope.UbahDokter = function () {
				$scope.cboDokter = true
				$scope.cboUbahDokter = false
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.PasienPulang = function () {
				if ($scope.dataPasienSelected.tglpulang != undefined) {
					window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('tatarekening/get-norec-apd?noreg=' + $scope.dataPasienSelected.noregistrasi +
						'&ruangId=' + $scope.dataPasienSelected.ruanganid).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.dataPasienSelected.norec,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.dataPasienSelected.ruanganid
								cacheHelper.set('CachePindah', CachePindah);
							}

						})
				}
			}

			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}

			$scope.simpantglpulang = function () {
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				var updateTanggal = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"tglpulang": tglpulang
				}
				manageTataRekening.saveupdatetglpulang(updateTanggal).then(function (e) {
					LoadData();
				})
				$scope.cbopasienpulang = false;
				$scope.cboUbahDokter = true;
			}

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = {
						id: dataPasienSelected.pgid,
						namalengkap: dataPasienSelected.namadokter
					}
				}
			}

			$scope.simpan = function () {
				var objSave = {
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id
				}

				medifirstService.post('tatarekening/save-update-dokter', objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				medifirstService.post('tatarekening/save-update-dokter_apd', objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				/* update dokter pelayanan pasien yang kosong dokternya */
				var objPost = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"objectpegawaifk": $scope.item.namaDokter.id
				}
				medifirstService.post('tatarekening/tindakan/update-dokter-pel-pasien', objPost).then(function (e) { })
				medifirstService.post('tatarekening/tindakan/update-dokter-pel-pasien-new', objPost).then(function (e) { })
			}

			$scope.Detail = function () {
				debugger
				let user = medifirstService.getPegawai();
				// let users = medifirstService.getKelompokUser();
				// let usersa = medifirstService.getPegawai();
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					if ($scope.dataPasienSelected.tglpulang == null) {
						if (user.id != 320263) {
							if ($scope.dataPasienSelected.objectruanganlastfk == 720 || $scope.dataPasienSelected.objectruanganlastfk == 777 || $scope.dataPasienSelected.objectruanganlastfk == 778 || $scope.dataPasienSelected.objectruanganlastfk == 779 || $scope.dataPasienSelected.objectruanganlastfk == 753 || $scope.dataPasienSelected.objectruanganlastfk == 754 || $scope.dataPasienSelected.objectruanganlastfk == 755 || $scope.dataPasienSelected.objectruanganlastfk == 747 || $scope.dataPasienSelected.objectruanganlastfk == 769 || $scope.dataPasienSelected.objectruanganlastfk == 770 || $scope.dataPasienSelected.objectruanganlastfk == 731) {
								medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.dataPasienSelected.nocm + "&jenisEmr=askepnew&noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
									debugger
									if (dat.data.data.length == 0) {
										toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
									} else {
										medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (dat) {
											if (dat.data.askep.length == 0) {
												toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
											} else {
												RincianTagihan();
											}
										});
									}
								});
							} else {
								RincianTagihan();
							}
						} else {
							RincianTagihan();
						}
					} else {
						RincianTagihan();
					}

					function RincianTagihan() {
						var obj = {
							noRegistrasi: $scope.dataPasienSelected.noregistrasi
						}
						var statusOtomatis = "YA"
						cacheHelper.set('statusOtomatis', statusOtomatis);
						$state.go('RincianTagihan', {
							dataPasien: JSON.stringify(obj)
						});
					}
				}

				// if ($scope.dataPasienSelected.noregistrasi != undefined) {
				// 	var objSave = {
				// 		noregistrasi: $scope.dataPasienSelected.noregistrasi
				// 	}
				// 	medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t',objSave).then(function (data) {

				// 	});
				// 	var obj = {
				// 		noRegistrasi: $scope.dataPasienSelected.noregistrasi,

				// 	}
				// 	var statusOtomatis = "YA"
				// 	cacheHelper.set('statusOtomatis', statusOtomatis);
				// 	$state.go('RincianTagihan', {
				// 		dataPasien: JSON.stringify(obj),

				// 	});
				// }
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

			$scope.cetakKartu = function () {
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.tglpulang == undefined) {
					window.messageContainer.error("Pasien Belum Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noReg = "";
				else
					var noReg = $scope.dataPasienSelected.noregistrasi;
				var stt = 'false'
				if (confirm('View Kartu Pulang? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});
			}

			$scope.SuratKontrol = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}

				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noregistrasi = "";
				else

					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

				$state.go('PerjanjianPasien', {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.EditSEP = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";

				if ($scope.dataPasienSelected.norec == null) {
					messageContainer.error("Pasien Belum Dipilih!!")
					return;
				}
				if ($scope.dataPasienSelected.kelompokpasien != "BPJS") {
					messageContainer.error("Input SEP hanya untuk pasien BPJS")
					return;
				}

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
				}

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noSep = $scope.dataPasienSelected.nosep;
				}


				$scope.cboSep = true
				$scope.cboUbahSEP = false
				$scope.cboDokter = false
				$scope.cboUbahDokter = false
			}

			$scope.simpanSep = function () {
				var norec_pa = ""
				if ($scope.dataPasienSelected.norec_pa != undefined)
					norec_pa = $scope.dataPasienSelected.norec_pa
				var updateSep = {
					"norec": $scope.dataPasienSelected.norec,
					"nokepesertaan": $scope.item.noPeserta,
					"nosep": $scope.item.noSep,
					"norec_pa": norec_pa,
					"nocm": $scope.dataPasienSelected.nocm,
				}

				medifirstService.post('tatarekening/save-pemakaian-asuransi', updateSep).then(function (e) {
					loadData();
					$scope.saveLogInputSep()
				})

				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.saveLogInputSep = function () {
				var jenisLog = 'Input SEP'
				var referensi = 'Norec Pemakaian Asuransi'
				var keterangan = 'Input Sep - ' + $scope.item.noSep + ' No Registrasi ' + $scope.dataPasienSelected.noregistrasi
				medifirstService.get("sysadmin/logging/save-log-all?jenislog=" +
					jenisLog + "&referensi=" + referensi +
					"&noreff=" + $scope.dataPasienSelected.norec_pa +
					"&keterangan=" + keterangan
				).then(function (data) {
					$scope.item.noPeserta = "";
					$scope.item.noSep = "";
				})
			}
			//end log
			$scope.batalSep = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";
				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.get('tatarekening/get-data-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi +
					'&objectruanganlastfk=' + $scope.dataPasienSelected.ruanganid).then(function (e) {
						if (e.data.data.length > 0) {

							var arrrStr = {
								0: $scope.dataPasienSelected.nocm,
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
							if ($scope.dataPasienSelected.objectdepartemenfk == 16 || $scope.dataPasienSelected.objectdepartemenfk == 25) {
								$state.go('RekamMedis.ResumeRI', {
									noRec: e.data.data[0].norec_apd
								})
							} else {
								$state.go('RekamMedis.ResumeRJ', {
									noRec: e.data.data[0].norec_apd
								})
							}
						}
					})

			}

			function postKunjunganYankes() {
				let status = false
				var tanggal = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('Bridging/yankes-get-kunjungan?tgl=' + tanggal)
					.then(function (a) {
						var result = a
						if (result.data.list != undefined && result.data.list.length > 0) {
							for (var i = 0; i < result.data.list.length; i++) {
								if (moment(new Date()).format('YYYY-MM-DD') == result.data.list[i].tanggal) {
									status = true
									manageTataRekening.getDataTableTransaksi('yankes/count-kunjungan-pasien')
										.then(function (d) {
											let datt = d.data
											var jsonSave = {
												"data": {
													"kode_kirim": result.data.list[i].kode,
													"tanggal": moment(new Date()).format('YYYY-MM-DD'),
													"kunjungan_rj": datt.data.rawat_jalan,
													"kunjungan_igd": datt.data.igd,
													"pasien_ri": datt.masihDirawat // result.data.rawat_inap,
												}
											}

											medifirstService.post('Bridging/yankes-update-kunjungan', jsonSave)
												.then(function (c) {
													var resp = c.data
													if (resp.kode == 200) {
														toastr.success('Post Bridging Yankes')
													}

												}, error => {
													toastr.error('Post Bridging Yankes Gagal')
												});
										})
									break
								}
							}
						}
						if (status == false) {
							medifirstService.get('Bridging/yankes-count-kunjungan-pasien')
								.then(function (b) {
									let result = b.data
									var jsonSave = {
										"data": {
											"kode_kirim": null,
											"tanggal": moment(new Date()).format('YYYY-MM-DD'),
											"kunjungan_rj": result.data.rawat_jalan,
											"kunjungan_igd": result.data.igd,
											"pasien_ri": result.masihDirawat // result.data.rawat_inap,
										}
									}

									medifirstService.post('Bridging/yankes-insert-kunjungan', jsonSave)
										.then(function (c) {
											var resp = c.data
											if (resp.kode == 200) {
												toastr.success('Post Bridging Yankes')
											}

										}, error => {
											toastr.error('Post Bridging Yankes Gagal')
										});
								})
						}
					})

			}

			function getSisrute() {
				// debugger
				var now = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now).then(function (response) {
					$scope.jmlRujukanMasuk = response.data.total
					console.log('rujukan masuk : ' + response.data.total)
				})
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now + '&create=true').then(function (response) {
					$scope.jmlRujukanKeluar = response.data.total
					console.log('rujukan masuk : ' + response.data.total)
				})
			}

			function postRujukanYankes() {
				// debugger
				let status = false
				medifirstService.get('Bridging/yankes-get-rujukan?tgl=' + moment(new Date()).format('YYYY-MM-DD')).then(function (res) {
					var resultData = res.data.list
					if (resultData != undefined && resultData.length > 0) {
						for (var i = 0; i < resultData.length; i++) {
							if (moment(new Date()).format('YYYY-MM-DD') == resultData[i].tanggal) {
								status = true
								var jsonSave = {
									"data": {
										"kode_kirim": resultData[i].kode,
										"tanggal": resultData[i].tanggal,
										"jumlah_rujukan": $scope.jmlRujukanMasuk,
										"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,
									}
								}
								medifirstService.post('Bridging/yankes/update-rujukan', jsonSave)
									.then(function (response) {
										console.log('Update Yankes Rujukan')
									}, error => { });
								break
							}
						}
					}

					if (status == false) {
						var da = {
							"data": {
								"kode_kirim": null,
								"tanggal": moment(new Date()).format('YYYY-MM-DD'),
								"jumlah_rujukan": $scope.jmlRujukanMasuk,
								"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,

							}
						}

						medifirstService.post('Bridging/yankes-insert-rujukan', da)
							.then(function (response) {
								console.log('Insert Yankes Rujukan')
							}, error => { });
					}
				})
			}

			$scope.InsidenInternal = function () {
				if ($scope.dataPasienSelected.norec == undefined) {
					alert("Data Belum Dipilih!")
					return;
				}
				var chacePeriode = {
					0: $scope.dataPasienSelected.norec,
					1: 'InputInsidenInternal',
					2: '',
					3: '',
					4: '',
					5: '',
					6: ''
				}

				cacheHelper.set('InsidenInternalCtrl', chacePeriode);
				$state.go('InsidenInternal', {
					kpid: $scope.dataPasienSelected.norec,
					noOrder: 'InputInsidenInternal'
				});
			}

			// END ################
		}
	]);
});