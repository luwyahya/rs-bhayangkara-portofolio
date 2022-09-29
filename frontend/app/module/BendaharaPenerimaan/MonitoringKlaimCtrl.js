//Owari Start here....
//“Good programmer write code for machine, great programmer write code for other programmer”, laravel
define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MonitoringKlaimCtrl', ['$q', '$scope', 'DateHelper', 'CacheHelper', 'MedifirstService',
		function ($q, $scope, dateHelper, cacheHelper, medifirstService) {

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
			$scope.totalPengajuan = 0;
			$scope.totalDisetujui = 0;
			$scope.totalTarifRs = 0;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.jmlRujukanKeluar = 0
			$scope.isHasil = false
			var responData = "";
			var data2 = []
			var dataSave = []
			var dataSEPCMG = []
			var dataRow = {}
			$scope.show_btn = true
			loadCombo();
			// loadData();
			// getSisrute()
			// postKunjunganYankes()
			function loadCombo() {
				$scope.item.tahun = $scope.now.getFullYear();
				$scope.listjenispelayanan = [{ id: 1, name: 'Rawat Inap' }, { id: 2, name: 'Rawat Jalan' }];
				$scope.listbulan = [
					{ id: 1, mm: '01', name: 'Januari' },
					{ id: 2, mm: '02', name: 'Februari' },
					{ id: 3, mm: '03', name: 'Maret' },
					{ id: 4, mm: '04', name: 'April' },
					{ id: 5, mm: '05', name: 'Mei' },
					{ id: 6, mm: '06', name: 'Juni' },
					{ id: 7, mm: '07', name: 'Juli' },
					{ id: 8, mm: '08', name: 'Agustus' },
					{ id: 9, mm: '09', name: 'September' },
					{ id: 10, mm: '10', name: 'Oktober' },
					{ id: 11, mm: '11', name: 'November' },
					{ id: 12, mm: '12', name: 'Desember' }
				]


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

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "noSEP",
							"title": "NOSEP",
							"width": "10%"
						},
						{
							"field": "noFPK",
							"title": "NO FPK",
							"width": "10%"
						},
						{
							"field": "peserta.nama",
							"title": "Nama Pasien",
							"width": "20%",
							"template": "<span class='style-left'>#: peserta.nama #</span>"
						},
						{
							"field": "Inacbg.nama",
							"title": "Nama Inacbg",
							"width": "20%",
							"template": "<span class='style-center'>#: Inacbg.nama #</span>"
						},
						{
							"field": "peserta.noKartu",
							"title": "Nokartu",
							"width": "150px",
							"template": "<span class='style-left'>#: peserta.noKartu #</span>"
						},
						{
							"field": "peserta.noMR",
							"title": "NOMR",
							"width": "15%",
							"template": "<span class='style-left'>#: peserta.noMR #</span>"
						},
						{
							"field": "poli",
							"title": "Poli",
							"width": "100px",
							"template": "<span class='style-left'>#: poli #</span>"
						},
						{
							"field": "kelasRawat",
							"title": "Kelas Rawat",
							"width": "100px",
							"template": "<span class='style-left'>#: kelasRawat #</span>"
						},
						{
							"field": "status",
							"title": "Status",
							"width": "100px",
							"template": "<span class='style-left'>#: status #</span>"
						},
						{
							"field": "biaya.byTarifRS",
							"title": "Biaya Tarif RS",
							"width": "100px",
							"template": "<span class='style-left'>#: biaya.byTarifRS #</span>"
						},
						{
							"field": "biaya.byPengajuan",
							"title": "Biaya Pengajuan",
							"width": "100px",
							"template": "<span class='style-left'>#: biaya.byPengajuan #</span>"
						},
						{
							"field": "biaya.bySetujui",
							"title": "Biaya Setujui",
							"width": "100px",
							"template": "<span class='style-left'>#: biaya.bySetujui #</span>"


						},
						{
							"field": "tglSep",
							"title": "Tanggal SEP",
							"width": "100px",
							"template": "<span class='style-left'>#: tglSep #</span>"
						},
						{
							"field": "tglPulang",
							"title": "Tanggal Pulang",
							"width": "100px",
							"template": "<span class='style-left'>#: tglPulang #</span>"
						}
					]
			};

			$scope.columnDaftarPasienPulangHasil = {
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

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "biayanosep",
							"title": "NOSEP",
							"width": "10%"
						},
						{
							"field": "biayanofpk",
							"title": "NO FPK",
							"width": "10%"
						},
						{
							"field": "pesertanama",
							"title": "Nama Pasien",
							"width": "20%",
							"template": "<span class='style-left'>#: pesertanama #</span>"
						},
						{
							"field": "inacbgnama",
							"title": "Nama Inacbg",
							"width": "20%",
							"template": "<span class='style-center'>#: inacbgnama #</span>"
						},
						{
							"field": "pesertanokartu",
							"title": "Nokartu",
							"width": "150px",
							"template": "<span class='style-left'>#: pesertanokartu #</span>"
						},
						{
							"field": "pesertanomr",
							"title": "NOMR",
							"width": "15%",
							"template": "<span class='style-left'>#: pesertanomr #</span>"
						},
						{
							"field": "namaruangan",
							"title": "Poli",
							"width": "100px",
							"template": "<span class='style-left'>#: namaruangan #</span>"
						},
						{
							"field": "biayakelasrawat",
							"title": "Kelas Rawat",
							"width": "100px",
							"template": "<span class='style-left'>#: biayakelasrawat #</span>"
						},
						{
							"field": "pesertastatus",
							"title": "Status",
							"width": "100px",
							"template": "<span class='style-left'>#: pesertastatus #</span>"
						},
						{
							"field": "biayabytarifrs",
							"title": "Biaya Tarif RS",
							"width": "100px",
							"template": "<span class='style-left'>#: biayabytarifrs #</span>"
						},
						{
							"field": "biayabypengajuan",
							"title": "Biaya Pengajuan",
							"width": "100px",
							"template": "<span class='style-left'>#: biayabypengajuan #</span>"
						},
						{
							"field": "biayabysetujui",
							"title": "Biaya Setujui",
							"width": "100px",
							"template": "<span class='style-left'>#: biayabysetujui #</span>"


						},
						{
							"field": "pesertatglsep",
							"title": "Tanggal SEP",
							"width": "100px",
							"template": "<span class='style-left'>#: pesertatglsep #</span>"
						},
						{
							"field": "jenispelayanan",
							"title": "Tanggal Pulang",
							"width": "100px",
							"template": "<span class='style-left'>#: jenispelayanan #</span>"
						},
						{
							"field": "tglnofpk",
							"title": "Tanggal NoFpk",
							"width": "100px",
							"template": "<span class='style-left'>#: tglnofpk #</span>"
						}
					]
			};
			$scope.dbklik = function (data) {
				$scope.popupDetail.center().open();
				var jenis_rawat = 1 //ranap
				if (data.deptid != 16) {
					jenis_rawat = 2
				}
				var upgrade_class_ind = 0
				var upgrade_class_class = ''
				var add_payment_pct = 0
				if (data.nokelasdijamin != data.nokelasdaftar) {
					upgrade_class_ind = 1
					upgrade_class_class = data.namakelas
					add_payment_pct = 0
				}
				var discharge_status = 0
				if (data.objectstatuspulangfk == 1 || data.objectstatuspulangfk == 6) {
					discharge_status = 1
				} else if (data.objectstatuspulangfk == 4 || data.objectstatuspulangfk == 5 || data.objectstatuspulangfk == 10 ||
					data.objectstatuspulangfk == 11) {
					discharge_status = 2
				} else if (data.objectstatuspulangfk == 2 || data.objectstatuspulangfk == 8 || data.objectstatuspulangfk == 3) {
					discharge_status = 3
				} else if (data.objectstatuspulangfk == 9) {
					discharge_status = 4
				} else {
					discharge_status = 5
				}


				$scope.item.detail =
					'nomor_sep = ' + data.nosep + '\n' +
					'nomor_kartu = ' + data.nokepesertaan + '\n' +
					'tgl_masuk = ' + data.tglregistrasi + '\n' +
					'tgl_pulang = ' + data.tglpulang + '\n' +
					'jenis_rawat = ' + jenis_rawat + '\n' +
					'kelas_rawat = ' + data.nokelasdaftar + '\n' +
					'adl_sub_acute = null \n' +
					'adl_chronic = null \n' +
					'icu_indikator = null \n' +
					'icu_los = null \n' +
					'ventilator_hour = null \n' +
					'upgrade_class_ind = ' + upgrade_class_ind + '\n' +
					'upgrade_class_class = ' + upgrade_class_class + '\n' +
					'upgrade_class_los = ' + null + '\n' +
					'add_payment_pct = ' + add_payment_pct + '\n' +
					'birth_weight = ' + 0 + '\n' +
					'discharge_status = ' + discharge_status + '\n' +
					'diagnosa = ' + data.icd10 + '\n' +
					'procedure = ' + data.icd9 + '\n' +
					'tarif_rs = ' + data.tarif_rs + '\n' + +
					'tarif_poli_eks = ' + 0 + "\n" +
					'nama_dokter = ' + data.namadokter + "\n" +
					'kode_tarif = ' + 'BP' + "\n" +
					'payor_id = ' + '3' + "\n" +
					'payor_cd = ' + 'JKN' + "\n" +
					'cob_cd = ' + '#' + "\n" +
					'coder_nik = ' + data.codernik
			}
			$scope.tutup = function () {
				$scope.popupDetail.center().close();
			}

			function cleargrid() {
				for (var i = 0; i < data2.length; i++) {
					data2 = [];
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data2
					});

				}
				for (var i = 0; i < data2.length; i++) {
					data2 = [];
					$scope.dataDaftarPasienPulangHasil = new kendo.data.DataSource({
						data: data2
					});

				}

				$scope.totalPengajuan = 0;
				$scope.totalDisetujui = 0;
				$scope.totalTarifRs = 0;
				$scope.surplusDefisit = 0;
			}
			$scope.kelolaData = function () {
				$scope.isRouteLoading = true;
				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}
				var dataget = {
					jenispelayanan: jnspelayanan,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: $scope.item.statusKlaim.value,
					nofpk: $scope.item.noFpk
				}

				medifirstService.get("bendaharapenerimaan/get-monitoring-klaim-per-bulan?tglsep="
					+ dataget.tahun + "-" + dataget.bulan
					+ "&jenispelayanan="
					+ dataget.jenispelayanan
					+ "&status="
					+ dataget.status
					+ "&noFpk="
					+ dataget.nofpk
				).then(function (data) {

					$scope.isRouteLoading = false;
					$scope.isHasil = true;
					data2 = data.data;

					$scope.dataDaftarPasienPulangHasil = new kendo.data.DataSource({
						// data: data.data,
						data: data2,
						pageSize: 10,
						total: data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});

					var subTotalA = 0;
					var subTotalB = 0;
					for (var z = data2.length - 1; z >= 0; z--) {
						subTotalA = subTotalA + parseFloat(data2[z].biayabysetujui)
						subTotalB = subTotalB + parseFloat(data2[z].biayabytarifrs)
					}

					$scope.totalDisetujui = subTotalA;
					$scope.totalTarifRs = subTotalB;
					$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;



					// var chacePeriode = tglAwal + "~" + tglAkhir;
					// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
				});
			}
			$scope.SimpanData = function () {
				debugger
				if ($scope.isHasil == true) {
					toastr.error('Data Belum di Tarik', 'Peringatan');
					return;
				}
				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}
				var data = {
					"push": data2,
					"jnspelayanan": jnspelayanan
				}
				$scope.isRouteLoading = true;
				medifirstService.post("bendaharapenerimaan/save-monitoringklaim", data).then(function (e) {
					$scope.isRouteLoading = false;
				});
			}
			$scope.SearchData = function () {
				cleargrid();
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Klaim RI"
				$scope.popupStatus.open().center()
				loadData();

			}
			$scope.SearchDataRiPending = function () {
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Pending RI"
				loadDataRiPending();

			}
			$scope.SearchDataRjPending = function () {
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Pending RJ"
				loadDataRjPending();

			}
			$scope.SearchDataRj = function () {
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Klaim RJ"
				loadDataRj();

			}
			$scope.SearchDataRiProsesKlaim = function () {
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Verifikasi RI"
				loadDataRiProsesKlaim();

			}
			$scope.SearchDataRjProsesKlaim = function () {
				$scope.isRouteLoading = true;
				$scope.isHasil = false;
				a = 1;
				yeuh = 1;
				awal = 1;
				var ini = 0;
				var elem = document.getElementById("myBar");
				var width = 0;
				awal = awal + 1;
				var id = setInterval(frame, 1);
				function frame() {
					if (width >= ini) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + "%";
						elem.innerHTML = width + "%";
					}
				}
				$scope.statusPenarikanData = "Proses Penarikan Data Verifikasi RJ"
				loadDataRjProsesKlaim();

			}
			var a = 1;
			function startProgres() {
				loadData();
			}
			function startProgresRj() {
				loadDataRj();
			}
			function startProgresRiPending() {
				loadDataRiPending();
			}
			function startProgresRjPending() {
				loadDataRjPending();
			}
			function startProgresRiProsesKlaim() {
				loadDataRiProsesKlaim();
			}
			function startProgresRjProsesKlaim() {
				loadDataRjProsesKlaim();
			}
			var yeuh = 1;
			var awal = 1;
			function loadData() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 1,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 3
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgres();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgres();
						} else if (data.status == 500) {
							startProgres();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgres();
						if (a == lengthakhir)
							$scope.SearchDataRj()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgres();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};
			function loadDataRiPending() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 1,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 2
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgresRiPending();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgresRiPending();
						} else if (data.status == 500) {
							startProgresRiPending();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgresRiPending();
						if (a == lengthakhir)
							$scope.SearchDataRjPending()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgresRiPending();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};
			function loadDataRjPending() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 2,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 2
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgresRjPending();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgresRjPending();
						} else if (data.status == 500) {
							startProgresRjPending();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgresRjPending();
						if (a == lengthakhir)
							$scope.SearchDataRiProsesKlaim()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgresRjPending();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};
			function loadDataRj() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 2,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 3
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgresRj();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgresRj();
						} else if (data.status == 500) {
							startProgresRj();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgresRj();
						if (a == lengthakhir)
							$scope.SearchDataRiPending()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgresRj();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};
			function loadDataRiProsesKlaim() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 1,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 1
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgresRiProsesKlaim();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgresRiProsesKlaim();
						} else if (data.status == 500) {
							startProgresRiProsesKlaim();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgresRiProsesKlaim();
						if (a == lengthakhir)
							$scope.SearchDataRjProsesKlaim()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgresRiProsesKlaim();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};
			function loadDataRjProsesKlaim() {
				$scope.isRouteLoading = true;
				var dataget = {
					jenispelayanan: 2,
					tahun: $scope.item.tahun,
					bulan: $scope.item.bulan.mm,
					status: 1
				}
				yeuh = a;
				awal = a;
				// debugger
				var lengthakhir = new Date(dataget.tahun, dataget.bulan, 0).getDate() + 1;
				// var lengthakhir = 32;
				var lop = true;

				for (; a < lengthakhir; a++) {


					medifirstService.get("bridging/bpjs2/get-monitoring-klaim-per-bulan?tglsep="
						+ dataget.tahun + "-" + dataget.bulan + "-" + a
						+ "&jenispelayanan="
						+ dataget.jenispelayanan
						+ "&status="
						+ dataget.status
					).then(function (data) {
						lop = false
						if (data == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
							startProgresRjProsesKlaim();
						} else if (data == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
							startProgresRjProsesKlaim();
						} else if (data.status == 500) {
							startProgresRjProsesKlaim();
						}
						$scope.isRouteLoading = false;

						// datas=data.data.response.klaim;

						// data2.push(data.data.response.klaim[i])
						if (data.data.metaData.code == 200) {
							for (var b = 0; b < data.data.response.klaim.length; b++) {
								// debugger;
								$scope.isRouteLoading = true;

								// data2.push(data.data.response.klaim[b])
								// jmlKlaim =0;
								// // jmlKlaim = $jmlKlaim + float($dataSaldoLama->debit);
								if ($scope.item.noFpk == undefined || $scope.item.noFpk == "") {
									data.data.response.klaim[b] = data.data.response.klaim[b];
									data2.push(data.data.response.klaim[b])
								} else {
									var noFpk = $scope.item.noFpk;
									if (data.data.response.klaim[b].noFPK.match(noFpk)) {
										data2.push(data.data.response.klaim[b])
									}
									// dataB = data.data.response.klaim[b].noFpk.match(/^noFpk.*$/);
									// data2.push(dataB)
									// data2.push(data.data.response.klaim[b].noFpk.match(/noFpk.*/)
								}
								$scope.isRouteLoading = false;
							}
						}

						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							// data: data.data,
							data: data2,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						var subTotalA = 0;
						var subTotalB = 0;
						for (var z = data2.length - 1; z >= 0; z--) {
							subTotalA = subTotalA + parseFloat(data2[z].biaya.bySetujui)
							subTotalB = subTotalB + parseFloat(data2[z].biaya.byTarifRS)
						}

						$scope.totalDisetujui = subTotalA;
						$scope.totalTarifRs = subTotalB;
						$scope.surplusDefisit = $scope.totalDisetujui - $scope.totalTarifRs;

						yeuh = yeuh + 1;
						var ini = (yeuh / lengthakhir) * 100;
						var elem = document.getElementById("myBar");
						var width = 0;
						awal = awal + 1;
						var id = setInterval(frame, 1);
						function frame() {
							if (width >= ini) {
								clearInterval(id);
							} else {
								width++;
								elem.style.width = width + "%";
								elem.innerHTML = width + "%";
							}
						}
						a = a + 1
						startProgresRjProsesKlaim();
						if (a == lengthakhir)
							$scope.popupStatus.close()
						// var chacePeriode = tglAwal + "~" + tglAkhir;
						// cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
					}, function (err) {
						debugger
						startProgresRjProsesKlaim();
						// $scope.isRouteLoading = false;
					});
					if (lop == true) {
						break;
					}

				}
				$scope.isRouteLoading = false;
			};

			function searchTable() {
				var input;
				var saring;
				var status;
				var tbody;
				var tr;
				var td;
				var s;
				var j;
				input = document.getElementById("noFpk");
				saring = input.value.toUpperCase();
				tbody = document.getElementsByTagName("tbody")[0];;
				tr = tbody.getElementsByTagName("tr");
				for (s = 0; s < tr.length; s++) {
					td = tr[s].getElementsByTagName("td");
					for (j = 0; j < td.length; j++) {
						if (td[j].innerHTML.toUpperCase().indexOf(saring) > -1) {
							status = true;
						}
					}
					if (status) {
						tr[s].style.display = "";
						status = false;
					} else {
						tr[s].style.display = "none";
					}
				}
			}

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			$scope.listStatusKlaim = [{
				"id": 3, "statusklaim": "Proses Verifikasi", "value": 1
			}, {
				"id": 4, "statusklaim": "Pending Verifikasi", "value": 2
			}, {
				"id": 5, "statusklaim": "Klaim", "value": 3
			}];
			$scope.UbahDokter = function () {
				$scope.cboDokter = true
				$scope.cboUbahDokter = false
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			// END ################

		}
	]);
});