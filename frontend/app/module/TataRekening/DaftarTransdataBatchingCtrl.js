define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarTransdataBatchingCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = $scope.now
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
			loadCombo();
			loadData();
			// postIKTvisite()

			function loadCombo() {
				var chacePeriode = cacheHelper.get('SyncData');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);

				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					// $scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
					$scope.listRuanganBatal = data.data.ruanganall;
					$scope.item.PegawaiLogin = data.data.pegawaiLogin;
					// $scope.listRuanganApd = data.data.ruanganall;
					$scope.listPembatalan = data.data.pembatalan;
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[1].id, jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa };

				});

			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return ''
				else
					return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}



			var onDataBound = function (e) {
				var columns = e.sender.columns;
				var rows = e.sender.tbody.children();

				for (var j = 0; j < rows.length; j++) {
					// sisa sekarang
					var row = $(rows[j]);
					var dataItem = e.sender.dataItem(row);

					var unitBpjs = dataItem.get("kelompokpasien");
					var unitDept = dataItem.get("deptid");
					var unitPpk = dataItem.get("ppkrujukan");
					var unitSep = dataItem.get("nosep");

					var cellSEP = row.children().eq(12);
					cellSEP.addClass(getNotifSEP(unitBpjs, unitSep, unitDept, unitPpk));

					var isdiag = dataItem.get("isdiagnosis");
					var cellDiag = row.children().eq(13);
					cellDiag.addClass(getNotifDiag(isdiag));

				}
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
					sheet.mergedCells = ["A1:K1"];
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
				dataBound: onDataBound,
				pageable: true,
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
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},
					{
						"field": "namakelas",
						"title": "Kelas ",
						"width": "80px",
						// "template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
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
					// {
					// 	"field": "namarekanan",
					// 	"title": "Penjamin",
					// 	"width": "100px",
					// 	"template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
					// },
					{
						"field": "tglpulang",
						"title": "Tgl Pulang",
						"width": "80px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
					},
					{
						"field": "kelasditanggung",
						"title": "Kelas Ditanggung",
						"width": "80px",
						"template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
					},
					{
						"field": "nosep",
						"title": "No SEP",
						"width": "150px",
						"template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
					},
					{
						"field": "noidentitas",
						"title": "NIK",
						"width": "120px"
					},
					{
						"field": "kddiagnosa",
						"title": "Kode Diagnosa",
						"width": "100px"
					},
					// {
					// 	"field": "isdiagnosis",
					// 	"title": "Diagnosis",
					// 	"width": "60px",
					// 	"template": '# if( isdiagnosis==true) {# ✔ # } else {# - #} #'
					// },
					{
						hidden: true,
						"field": "ppkrujukan",
						"title": "PPK",
						"width": "150px",
					},
					{
						hidden: true,
						"field": "deptid",
						"title": "DeptId",
						"width": "150px",
					},

					// {
					// 	"field": "statuspasien",
					// 	"title": "Status Pasien",
					// 	"width":"100px",
					// }				
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
				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				var isBlmInputSep = ""
				if ($scope.item.blmInputSep != undefined) {
					var isBlmInputSep = "&isBlmInputSep=" + $scope.item.blmInputSep
				}
				var isSepTdkSesuai = ""
				if ($scope.item.sepTdkSesuai != undefined) {
					var isSepTdkSesuai = "&isSepTdkSesuai=" + $scope.item.sepTdkSesuai
				}
				var blmInputDiag = ""
				if ($scope.item.blmInputDiag != undefined) {
					var blmInputDiag = "&isnotdiagnosis=" + $scope.item.blmInputDiag
				}


				$q.all([
					medifirstService.get("tatarekening/get-daftar-sync-trans?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows +
						isBlmInputSep + isSepTdkSesuai + blmInputDiag),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.length; i++) {
						data[0].data[i].no = i + 1
						var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
						data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr'
					}
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


					var chacePeriode = tglAwal + "~" + tglAkhir
					// + "~" +cacheNoreg + "~" +cacheNoRm
					// + "~" +cacheNama
					// + "~" +$scope.item.instalasi 
					// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
					// + "~" +$scope.item.dokter;
					cacheHelper.set('SyncData', chacePeriode);
				});

			};

			function getNotifSEP(unitBpjs, unitSep, unitDept, unitPpk) {
				if (unitBpjs.indexOf("BPJS") > -1 && (unitSep == null || unitSep == undefined || unitSep == "")) {
					return "red";
				} else if (unitBpjs.indexOf("BPJS") > -1 && unitDept == "16" && unitPpk != "1124R004") {
					return "koneng";
				}
				// else if(unitBpjs.indexOf("BPJS") > -1 &&  (unitSep!=null && unitSep!=undefined && unitSep!="") ){
				// 	return "hejo";
				// }
			}
			function getNotifDiag(isdiag) {
				if (isdiag == false) {
					return "red";
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


			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			$scope.syncPasien = function () {
				let data2 = []
				if ($scope.dataDaftarPasienPulang._data.length == 0) {
					toastr.error('data tidak ada')
					return
				}
				for (let i = 0; i < $scope.dataDaftarPasienPulang._data.length; i++) {
					const element = $scope.dataDaftarPasienPulang._data[i];
					if ((element.noidentitas != null && element.noidentitas != '' )) {

						data2.push({

							"namapasien": element.namapasien,
							"tgllahir": moment(new Date(element.tgllahir)).format('YYYY/MM/DD'),
							"tempatlahir": element.tempatlahir,
							"nik": element.noidentitas,
							"nobpjs": element.nobpjs,
							"nokk": null,
							"kewarganegaraan": "Indonesia",
							"jeniskelaminfk": element.objectjeniskelaminfk != null ? parseInt(element.objectjeniskelaminfk) : null,
							"agamafk": element.objectagamafk != null ? parseInt(element.objectagamafk) : null,
							"golongandarahfk": element.objectgolongandarahfk != null ? parseInt(element.objectgolongandarahfk) : null,
							"pekerjaanfk": element.objectpekerjaanfk != null ? parseInt(element.objectpekerjaanfk) : null,
							"pendidikanfk": element.objectpendidikanfk != null ? parseInt(element.objectpendidikanfk) : null,
							"statusperkawinanfk": element.objectstatusperkawinanfk != null ? parseInt(element.objectstatusperkawinanfk) : null,
							"notelpon": element.notelepon,
							"nohp": element.nohp,

						})
						
					}else{
						toastr.error('NIK masih kosong')
						// return
					}
				

				}
				$scope.isRouteLoading = true
				medifirstService.post('tatarekening/sync-trandata-pasien', { data: data2 }).then(function (e) {
					$scope.isRouteLoading = false
				}, function (err) {
					$scope.isRouteLoading = false
				})

				data2 = [];
				for (let i = 0; i < $scope.dataDaftarPasienPulang._data.length; i++) {
					const element = $scope.dataDaftarPasienPulang._data[i];
					if ((element.noidentitas != null && element.noidentitas != '' ) ) {

						data2.push({
							"nik": element.noidentitas,
							"alamatlengkap": element.alamatlengkap != null ? (element.alamatlengkap) : null,
							"desakelurahanfk": element.objectdesakelurahanfk != null ? parseInt(element.objectdesakelurahanfk) : null,
							"rtrw": element.rtrw != null ? (element.rtrw) : null,
							"kecamatanfk": element.objectkecamatanfk != null ? parseInt(element.objectkecamatanfk) : null,
							"kotakabupatenfk": element.objectkotakabupatenfk != null ? parseInt(element.objectkotakabupatenfk) : null,
							"provinsifk": element.objectpropinsifk != null ? parseInt(element.objectpropinsifk) : null,
							"kodepos": element.kodepos != null ? (element.kodepos) : null,
							"negarafk": element.objectnegarafk != null ? parseInt(element.objectnegarafk) : null,

						})
						
					}else{
						toastr.error('NIK / No BPJS masih kosong')
						// return
					}
				

				}
				$scope.isRouteLoading = true
				medifirstService.post('tatarekening/sync-trandata-alamat-pasien', { data: data2 }).then(function (e) {
					$scope.isRouteLoading = false
				}, function (err) {
					$scope.isRouteLoading = false
				})
				
			}
			$scope.syncEMR = function () {

				if ($scope.dataDaftarPasienPulang._data.length == 0) {
					toastr.error('data tidak ada')
					return
				}
				$scope.progress = '0/0';
				// $scope.number = 0;
				for (let i = 0; i < $scope.dataDaftarPasienPulang._data.length; i++) {
					const element = $scope.dataDaftarPasienPulang._data[i];
					if(element.kddiagnosa!= null && element.kddiagnosa!= '-'){
						var data2 = {
							"nik": element.noidentitas,
							"noregistrasi": element.noregistrasi,
							"profilefk": 5,
							"tglregistrasi": moment(new Date(element.tglregistrasi)).format('YYYY/MM/DD'),
							"norm": element.nocm,
							// "pasienfk": 1,
							"tglpulang": moment(new Date(element.tglpulang)).format('YYYY/MM/DD'),
							"norujukan": element.norujukan,
							"tglrujukan": element.tglrujukan!= null ? moment(new Date(element.tglrujukan)).format('YYYY/MM/DD'):null,
							"nosep": element.nosep,
							"tglsep": element.tglsep != null && element.tglsep != '' ? moment(new Date(element.tglsep)).format('YYYY/MM/DD') : null,
							"ppkpelayanan": element.ppkrujukan,
							"diagnosafk": element.objectdiagnosafk != null ? parseInt(element.objectdiagnosafk) : null,
							"lokasilakalantas": element.lokasilakalantas,
							"penjaminlaka": element.lokasilakalantas,
							"cob": element.lokasilakalantas,
							"katarak": element.lokasilakalantas,
							"keteranganlaka": element.keteranganlaka,
							"tglkejadian": element.tglkejadian != null && element.tglkejadian != '' ? moment(new Date(element.tglkejadian)).format('YYYY/MM/DD') : null,
							"suplesi": element.suplesi,
							"nosepsuplesi": element.nosepsuplesi,
							"iddpjp": element.iddpjp,
							"dpjp": element.namadokter,
							"prolanisprb": element.prolanisprb,
							"kelasfk": element.kelastgfk != null ? parseInt(element.kelastgfk) : null,
							"kddiagnosa": element.kddiagnosa,
							"namadiagnosa": element.namadiagnosa,
							// "pelayananmedisdetail": []
						}
						// $scope.isRouteLoading = true
						medifirstService.postNonMessage('tatarekening/sync-trandata-pasien-emr', { data: data2 }).then(function (e) {
							// $scope.isRouteLoading = false
							// this.progress = 100 - sec * 100 / seconds;
							var d = i+1
							$scope.progress = d + "/" + $scope.dataDaftarPasienPulang._data.length;
						}, function (err) {
							// $scope.isRouteLoading = false
						})

					}
					
				}


			}


			$scope.pegawai = ModelItem.getPegawai();
			$scope.buktiLayanan = function () {
				if ($scope.item != undefined) {
					//cetakan langsung service VB6 by grh
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec='
						+ $scope.dataPasienSelected.noregistrasi + '&strIdPegawai='
						+ $scope.pegawai.id
						+ '&view=false', function (response) {

						});

				}
			}
			$scope.cetakNoAntrian = function () {
				if ($scope.item != undefined) {
					//cetakan langsung service VB 6 by grh   
					var client = new HttpClient();

					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
						+ $scope.dataPasienSelected.noregistrasi + '&petugas=' + $scope.item.PegawaiLogin + '&view=false', function (response) {
							// do something with response
						});


				}
			}
			$scope.batalRawat = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
				$scope.item.tglbatal = $scope.now;
				$scope.popUpHapusRegis.center().open();
			}

			$scope.saveHapusRegis = function () {
				if ($scope.item.pembatalan == undefined) {
					toastr.error('Pembatalan belum dipilih!')
					return
				}
				if ($scope.item.alasanBatal == undefined) {
					toastr.error('Alasan harus diisi!')
					return
				}
				if ($scope.item.jenis == undefined) {
					toastr.error('Jenis belum dipilih!')
					return
				}
				$scope.popUpHapusRegis.close();
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Semua PELAYANAN akan dihapus! Lanjut Simpan? ')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					$scope.masukanPassword();
				})

			}
			$scope.password = '|';
			$scope.masukanPassword = function () {
				$scope.popUpPassword.center().open()
				//var person = prompt("Masukan tgl libur", "");
			}
			$scope.nextSave = function () {
				if ($scope.item.password != undefined && $scope.item.password == $scope.password) {
					var BatalPeriksa = {
						"norec": $scope.dataPasienSelected.norec,
						"tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD HH:mm:ss'),
						"pembatalanfk": $scope.item.pembatalan.id,
						"alasanpembatalan": $scope.item.alasanBatal,
						"jenishapus": $scope.item.jenis.id == 1 ? "hapusregis" : "batalranap",
					}
					managePhp.postData2('registrasipasien/batal-periksa-delete', BatalPeriksa).then(function (e) {
						clearHapusRegis()
						$scope.popUpPassword.close()
						loadData();
					})
				} else {
					toastr.error('Password Salah!', 'Error')
				}
			}
			$scope.batalHapusRegis = function () {
				$scope.popUpHapusRegis.close();
				clearHapusRegis()
			}
			function clearHapusRegis() {
				delete $scope.item.pembatalan
				delete $scope.item.alasanBatal
				delete $scope.item.ruanganBatal
				delete $scope.item.password
				delete $scope.item.jenis
			}

			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&objectruanganlastfk=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
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
			// hasil hasil
			$scope.hasil = function (criteria) {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				// $scope.isRouteLoading = true
				$scope.sourceHasilRad = new kendo.data.DataSource({
					data: [],
					pageSize: 10
				});
				if (criteria == 1) {
					$scope.showRadiologi = false
					$scope.ruanganMana = 'lab'
				} else {
					$scope.ruanganMana = 'rad'
					$scope.showRadiologi = true
				}


				var tanggal = $scope.now;
				var tanggalLahir = new Date($scope.dataPasienSelected.tgllahir);
				var umur = dateHelper.CountAge(tanggalLahir, tanggal);
				$scope.dataPasienSelected.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
				$scope.popupRad = $scope.dataPasienSelected
				//  managePhp.getData('laporan/get-order-' + $scope.ruanganMana + '?noregistrasi='
				medifirstService.get('registrasi/daftar-registrasi/get-daftar-order-hasil-' + $scope.ruanganMana + '?noregistrasi='
					+ $scope.dataPasienSelected.noregistrasi).then(function (e) {
						for (var i = e.data.daftar.length - 1; i >= 0; i--) {
							e.data.daftar[i].no = i + 1
						}
						$scope.isRouteLoading = false
						$scope.sourceHasilRad = new kendo.data.DataSource({
							data: e.data.daftar,
							pageSize: 10
						});
					});
				$scope.popUpHasilRad.center().open()
			}
			$scope.columnHasilRad = [
				{
					"field": "no",
					"title": "No",
					"width": "20px",
				},
				{
					"field": "tglorder",
					"title": "Tgl Order",
					"width": "50px",
				},
				{
					"field": "noorder",
					"title": "No Order",
					"width": "60px",
				},
				{
					"field": "dokter",
					"title": "Dokter",
					"width": "100px"
				},
				{
					"field": "namaruangantujuan",
					"title": "Ruangan",
					"width": "100px",
				},
				{
					"field": "statusorder",
					"title": "Keterangan",
					"width": "80px",
				}
			];
			$scope.detailHasilRad = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details
					}),
					columns: [
						{
							field: "namaproduk",
							title: "Deskripsi",
							width: "300px"
						},
						{
							field: "qtyproduk",
							title: "Qty",
							width: "100px"
						}]
				};
			};

			$scope.klikHasilRad = function (data, ruang) {
				if (data != undefined) {
					if (ruang == 'rad') {
						$scope.noOrder = data.noorder;

						medifirstService.get("registrasi/daftar-registrasi/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
							.then(function (e) {
								$scope.dataRisOrder = e.data.data[0]
							})
					}
					if (ruang == 'lab') {

						medifirstService.get("registrasi/get-apd-detail?noregistrasi="
							+ $scope.dataPasienSelected.noregistrasi
							+ "&ruanganlast=" + $scope.dataPasienSelected.objectruanganlastfk)
							.then(function (e) {
								$scope.resDataAPD = e.data.data
							})
					}

				}
			}

			$scope.lihatHasilRad = function () {
				if ($scope.dataHasilRad == undefined) {
					toastr.error('Pilih data dulu', 'Info')
				}

				if ($scope.dataRisOrder != undefined) {
					// 192.168.12.11:8080
					$window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID="
						+ $scope.popupRad.nocm
						+ '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
				} else {
					toastr.info('Hasil tidak ada', 'Info')

				}

			}
			$scope.tutup = function () {
				$scope.popUpHasilRad.close()
			}

			$scope.lihatHasilLab = function () {
				if ($scope.dataHasilRad == undefined) {
					toastr.error('Pilih data dulu');
					return
				}
				var arrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.resDataAPD.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					4: $scope.dataPasienSelected.umur,
					5: $scope.dataPasienSelected.kelompokpasien,
					6: $scope.dataPasienSelected.tglregistrasi,
					7: $scope.resDataAPD.norec_apd,
					8: $scope.dataPasienSelected.norec_pd,
					9: $scope.resDataAPD.idkelas,
					10: $scope.resDataAPD.namakelas,
					11: $scope.resDataAPD.objectruanganfk,
					12: $scope.resDataAPD.namaruangan + '`'
				}

				cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
				$state.go('HasilLaboratorium', {
					norecPd: $scope.dataHasilRad.norecpd,
					noOrder: $scope.dataHasilRad.noorder,
					norecApd: $scope.resDataAPD.norec_apd,
				})

			}

			$scope.cetakIdentifikasiPasien = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.popUpIdentitas.center().open();
			}

			$scope.BatalCetak = function () {
				// HapusPenanggungJawab();
				$scope.popUpIdentitas.close();
			}
			var datas = [];
			$scope.CetakAh = function () {
				$scope.NocmTea = null;
				medifirstService.get("registrasi/get-data-detail-pasien?nocm="
					+ $scope.dataPasienSelected.nocm)
					.then(function (dat) {
						datas = dat.data.data;
						var umur = dateHelper.CountAge(new Date(datas.tgllahir), $scope.now);
						var bln = umur.month,
							thn = umur.year,
							day = umur.day
						var usia = (umur.year * 12) + umur.month;
						$scope.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
						$scope.NocmTea = datas.nocm;
						if ($scope.dataItem != undefined && datas != undefined) {
							CetakWeh();
						} else {
							toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
							return;
						}

					})
			}

			function CetakWeh() {

				var NomorRm = ""
				if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
					NomorRm = $scope.dataPasienSelected.nocm;
				}
				var kelompokPasien = ""
				if ($scope.dataPasienSelected.kelompokpasien != undefined || $scope.dataPasienSelected.kelompokpasien != "") {
					kelompokPasien = $scope.dataPasienSelected.kelompokpasien;
				}
				var stt = 'false'
				if (confirm('View Lembar Identitas Pasien? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-identitas=1&noCm=' + NomorRm + '&noregis=' + $scope.dataPasienSelected.noregistrasi + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawai.namalengkap + '&view=' + stt, function (response) {
					//aadc=response; 
				});
				$scope.NocmTea = null;
				$scope.dataItem = {}
				$scope.popUpIdentitas.close();
				// if ($scope.dataItem != undefined && datas != undefined) {                       
				//         CetakIdentitas()
				// }else{
				//     toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
				//     return;
				// }
			}
			$scope.dataItem = {}
			$scope.cetakBlangkoBpjs = function () {
				if ($scope.dataPasienSelected != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
					// var PegawaiLogin = medifirstService.getPegawaiLogin();
					//##save identifikasi sep
					medifirstService.get('registrasi/get-daftar-combo-pegawai-all?pgid=2025', true, 10).then(function (e) {
						$scope.listDataPegawai.add(e.data[0])
						$scope.dataItem.pegawaiBlanko = e.data[0]

						$scope.popUpBlanko.center().open()
					})

				} else {
					toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Blangko!");
					return;
				}
			}
			$scope.cetakBlanko = function () {
				if ($scope.dataItem.pegawaiBlanko != undefined) {
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-blangko-bpjs=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&Petugas=' + $scope.dataItem.pegawaiBlanko.id + '&view=false', function (response) {
						// do something with response
					});
					$scope.popUpBlanko.close()
				}

			}
			$scope.batalBlanko = function () {
				// delete $scope.dataItem.pegawaiBlanko
				$scope.popUpBlanko.close()
			}

			$scope.cetakLembarRanap = function () {
				$scope.popUpDua.center().open();
			}

			$scope.BatalCetakDua = function () {
				$scope.dataItem.pegawaiDua = {};
				$scope.popUpDua.close();
			}

			$scope.CetakRanap = function () {
				var NomorRm = ""
				if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
					NomorRm = $scope.dataPasienSelected.nocm;
				}
				var kelompokPasien = ""
				if ($scope.dataPasienSelected.kelompokpasien != undefined || $scope.dataPasienSelected.kelompokpasien != "") {
					kelompokPasien = $scope.dataPasienSelected.kelompokpasien;
				}
				var stt = 'false'
				if (confirm('View Lembar Rawat Inap? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-ranap=1&noCm=' + NomorRm + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.dataPasienSelected.umur + '&petugas=' + $scope.dataItem.pegawaiDua.namalengkap + '&noRegis=' + $scope.dataPasienSelected.noregistrasi + '&view=' + stt, function (response) {
					//aadc=response; 
				});
				$scope.NocmTea = null;
				$scope.dataItem.pegawaiDua = undefined;
				$scope.popUpDua.close();
			}
			$scope.hapusPemakaianAsuransi = function () {
				if ($scope.dataPasienSelected == undefined) return;
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Yakin mau menghapus data ?')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					medifirstService.post('registrasi/hapus-pemakaian-asuransi', { norec: $scope.dataPasienSelected.norec_pa }).then(function (e) {
						loadData()
					})
				})

			}
			$scope.showPopUpEMR = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				var nocm = $scope.dataPasienSelected.nocm
				$scope.listCetakan = [
					{ id: 1, nama: 'Barang Milik Pasien', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-barang-milik-pasien&id=' + nocm + '&view=true' },
					{ id: 2, nama: 'Pemberian Informasi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id=' + nocm + '&view=true' },
					{ id: 3, nama: 'Surat Pernyatakan Penolakan', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id=' + nocm + '&view=true' },
					{ id: 4, nama: 'Tindakan ECT', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id=' + nocm + '&view=true' },
					{ id: 5, nama: 'Tindakan Injeksi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id=' + nocm + '&view=true' },
					{ id: 6, nama: 'Tindakan Fiksasi Mekanik', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id=' + nocm + '&view=true' },
					{ id: 7, nama: 'Tindakan Anastesi Umum', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id=' + nocm + '&view=true' },
					{ id: 8, nama: 'Kebutuhan Rencana Pulang', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id=' + nocm + '&view=true' },
					{ id: 9, nama: 'Tindakan Infus', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id=' + nocm + '&view=true' },
					{ id: 10, nama: 'Tindakan Kateter', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id=' + nocm + '&view=true' },
				]
				$scope.popUpCetakanEMR.center().open()
			}
			$scope.cetakEMR = function (params) {
				if (!params) return
				var client = new HttpClient();
				client.get(params.url, function (response) {
					//aadc=response; 
				});
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
			//emd
		}
	]);
});