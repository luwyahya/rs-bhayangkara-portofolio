define(['initialize', 'Configuration'], function (initialize, config) {
	'use strict';
	initialize.controller('ResumeRJCtrl', ['$q','ModelItem', '$scope', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope',
		function ($q, ModelItem, $scope, $state, medifirstService, $timeout, cacheHelper, $rootScope) {
			$scope.isRouteLoading = false;
			$scope.now = new Date()
			$scope.tampilanDepan = true;
			$scope.tampilanBelakang = false;
            $scope.istempatLaporan = true
            var tampungdiagnosa = {};
            var tampungdiagnosa9 = {};
            $scope.poneks = {};
			$scope.item = {};
			$scope.cc = {};
			$scope.dataSelected = {};
            $scope.poneks.penyakitponekigd = null;
			let norec_apd = ''
			var namalengkap = {};
            SetCacheHelper();
			LoadCombo();
			$scope.item = {
				tglresume: $scope.now 
			} // set defined object
			$scope.input = ''
			$scope.item.tglcetak = moment($scope.now).format('YYYY-MM-DD HH:mm')
			let lab = [];
			let rad = [];
			let obat = [];
			let tindakan = []
			let cpptO = ''
			let hasilKonsultasi = ''
			let norecresume = '-';
			$scope.rujuk = false;
			$scope.carakeluarlain = false;
			$scope.kondisiMeninggalkanLain = false
			$scope.item.tglResume = moment($scope.now).format('YYYY-MM-DD HH:mm')

			$scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
			var cookie = document.cookie.split(';')
			var kelompokUser = cookie[0].split('=')
			
            function SetCacheHelper() {
                medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function(e) {
                    var result = e.data.result 
                    $scope.header = result
                    var arrStr = {
                            0: $scope.header.nocm,
                            1: $scope.header.namapasien,
                            2: $scope.header.jeniskelamin,
                            3: $scope.header.noregistrasi,
                            4: $scope.header.umur,
                            5: $scope.header.kelompokpasien,
                            6: $scope.header.tglregistrasi,
                            7: $scope.header.norec,
                            8: $scope.header.norec_pd,
                            9: $scope.header.objectkelasfk,
                            10: $scope.header.namakelas,
                            11: $scope.header.objectruanganfk,
                            12: $scope.header.namaruangan,
                            13: $scope.checkNoregis,
                            14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                            15: $scope.header.alamatlengkap,
                            16: $scope.header.dokterdpjp,
                            17: $scope.header.iddpjp,
                            18: $scope.header.tgllahir,
                            19: $scope.header.objectkelompokpasienlastfk,
                            20: $scope.header.golongandarah,
                            21: $scope.header.namarekanan,
                            22: $scope.header.objectrekananfk,
                            23: $scope.header.objectdepartemenfk,
                            24: $scope.header.ruanganterakhir,
                            25: $scope.header.nocmfk,
                            26: $scope.header.objectagamafk,
                            27: $scope.header.agama,
                            28: $scope.header.objectpendidikanfk,
                            29: $scope.header.pendidikan,
                            30: $scope.header.objectpekerjaanfk,
                            31: $scope.header.pekerjaan,
							32: $scope.header.noidentitas,
							33: $scope.header.objectjeniskelaminfk,
							34: $scope.header.tempatlahir,
							35: $scope.header.tglpulang,
                        } 
                        cacheHelper.set('cacheRMelektronik', arrStr); 
                        LoadCacheHelper();
                })     
             }
			 function LoadCacheHelper() {
				 var chacePeriode = cacheHelper.get('cacheRMelektronik');
				 if (chacePeriode != undefined) {
					 $scope.cc.nocm = chacePeriode[0]
					 $scope.cc.namapasien = chacePeriode[1]
					 $scope.cc.jeniskelamin = chacePeriode[2]
					 $scope.cc.noregistrasi = chacePeriode[3]
					 $scope.cc.umur = chacePeriode[4]
					 $scope.cc.kelompokpasien = chacePeriode[5]
					 $scope.cc.tglregistrasi = chacePeriode[6]
					 $scope.cc.norec = chacePeriode[7]
					 $scope.cc.norec_pd = chacePeriode[8]
					 $scope.cc.objectkelasfk = chacePeriode[9]
					 $scope.cc.namakelas = chacePeriode[10]
					 $scope.cc.objectruanganfk = chacePeriode[11]
					 $scope.cc.namaruangan = chacePeriode[12]
					 $scope.cc.DataNoregis = chacePeriode[13]
					 $scope.cc.tgllahir = chacePeriode[14]
					 $scope.cc.dpjp = chacePeriode[16]
					 $scope.cc.iddpjp = chacePeriode[17]
					 $scope.cc.norec_emr = '-'
					 $scope.item.kdKelompokPasien = chacePeriode[19]
					 $scope.cc.namarekanan = chacePeriode[21]
					 $scope.cc.objectrekananfk = chacePeriode[22]
					 $scope.cc.objectdepartemenfk = chacePeriode[23]
					 $scope.cc.noregistrasi2 = chacePeriode[25]
					 $scope.cc.noidentitas = chacePeriode[32]
					 $scope.cc.objectjeniskelaminfk = chacePeriode[33]
					 $scope.cc.tempatlahir = chacePeriode[34]
					 $scope.cc.tglpulang = chacePeriode[35]
					 norec_apd = $scope.cc.norec
					 init()
				 }
			 }
			function LoadCombo() {
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });
				medifirstService.get('emr/get-combo').then(function(dat) {
					$scope.listDokter = dat.data.dokter
				})
				
                $scope.listJenisRujukan = [
					{ 'id': 1, 'name': 'Faskes 1' }, 
					{ 'id': 2, 'name': 'Faskes 2' }
				]
				$scope.listPrognosis = [
					{"id": "1", "prognosis": "Baik"},
					{"id": "2", "prognosis": "Dubia Et Bonam / Cenderung Baik"},
					{"id": "3", "prognosis": "Dunia Et Malam / Cenderung Tidak Baik"},
					{"id": "4", "prognosis": "Tidak Baik"},
				]
				$scope.listStatusPulang = [
					{"id": "1", "statuspulang": "Pulang Atas Persetujuan Dokter"},
					{"id": "2", "statuspulang": "Pulang Atas Permintaan Sendiri"},
					{"id": "3", "statuspulang": "Dirujuk"},
					{"id": "4", "statuspulang": "Rawat Inap"},
					{"id": "5", "statuspulang": "Lain - lain"},
				]
                $scope.listTransportasi = [
					{ 'id': 1, 'transportasi': 'Ambulance' }, 
					{ 'id': 2, 'transportasi': 'Lain - lain' }
				]
                $scope.listKondisi = [
					{ 'id': 1, 'kondisi': 'Stabil' }, 
					{ 'id': 2, 'kondisi': 'Tidak Stabil' },
					{ 'id': 3, 'kondisi': 'Perbaikan' },
					{ 'id': 4, 'kondisi': 'Pulang Paksa' },
					{ 'id': 5, 'kondisi': 'Dirujuk' },
					{ 'id': 6, 'kondisi': 'Meninggal < 48 Jam' },
					{ 'id': 7, 'kondisi': 'Meninggal > 48 Jam' },
					{ 'id': 8, 'kondisi': 'Lain - lain' },
				]
			}
			$scope.resumeOpt = {
				toolbar: [{
					name: "create", text: "Input Baru",
					template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Input Baru</button>'
				},],
				pageable: true,
				scrollable: true,
				columns: [
					// { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
					{ field: "no", title: "No", width: 40 },
					{ field: "tglresume", title: "Tanggal", width: 120 },
					{ field: "namaruangan", title: "Unit/Klinik", width: 120 },
					{ field: "diagnosis", title: "Diagnosis", width: 150 },
					{ field: "icd", title: "ICD", width: 120 },
					{ field: "jenispemeriksaan", title: "Obat-obatan/Jenis Pemeriksaan", width: 120 },
					{ field: "riwayatlalu", title: "Riwayat Rawat Inap & Prosedur Bedah/Operasi yang lalu", width: 150 },
					{ field: "namadokter", title: "Dokter", width: 120 },
					// { field: "jenisJabatanId", title: "Jenis Jabatan ", editor: categoryDropDownEditor, "template": "# if (jenisJabatanId === 1) {# #= 'Fungsional/struktural' # #} else if (jenisJabatanId === 3){# #= 'Internal' # #} else {# #= '-' # #}#" },
					// { field: "namaJabatan", title: "Nama Jabatan" },
					// { field: "usiaPensiun", title: "Usia Pensiun", width: 120, attributes: { style: "text-align:right; padding-right: 15px;" } }, , { name: "edit", text: "Edit", click: editData }
					{ command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }], title: "&nbsp;", width: 150 }
				],
				// editable: "popup",
				// save: function (e) {
				// 	$scope.Save(e.model);
				// },
				// edit: function (e) {
				// 	e.sender.columns.forEach(function (element, index /*, array */) {
				// 		if (element.hideMe) {
				// 			e.container.find(".k-edit-label:eq(" + index + "), "
				// 				+ ".k-edit-field:eq( " + index + ")"
				// 			).hide();
				// 		}
				// 	});
				// }
			};
			$scope.inputBaru = function () {
				cekYangBisaOtomatis()
				loadTindakan()
				$scope.checkboxClicked = function (dat) {
					if ($scope.item.kasusbaru == true) {
						$scope.item.kasusbaru = true
						$scope.item.kasuslama = false
					} else {
						$scope.item.kasusbaru = false
						$scope.item.kasuslama = true
					}
				}
	
				$scope.checkboxClicked2 = function (dat) {
					if ($scope.item.kasuslama == false) {
						$scope.item.kasusbaru = true
						$scope.item.kasuslama = false
					} else {
						$scope.item.kasusbaru = false
						$scope.item.kasuslama = true
					}
				}
				// if (kelompokUser[1] == 'dokter') {
				// 	$scope.item.namadokter = { id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap }
				// }
				// $scope.popUp.center().open()
				$scope.isRouteLoading = true;
				$scope.tampilanDepan = false;
				$scope.tampilanBelakang = true;
				$scope.item.poliklinik = {id:$scope.cc.objectruanganfk, namaruangan: $scope.cc.namaruangan}
				$scope.item.jenisKelamin = {id:$scope.cc.objectjeniskelaminfk, jeniskelamin: $scope.cc.jeniskelamin}
				$scope.item.noRm = $scope.cc.nocm
				$scope.item.namaPasien = $scope.cc.namapasien
				$scope.item.nik = $scope.cc.noidentitas
				$scope.item.tglLahir = $scope.cc.tgllahir
				$scope.item.tempatLahir = $scope.cc.tempatlahir
				$scope.item.penjamin = {id:$scope.cc.objectrekananfk, namarekanan: $scope.cc.namarekanan}
				
				$scope.item.tglMasuk = $scope.cc.tglregistrasi
				$scope.item.tglPulang = $scope.cc.tglpulang
				$scope.item.ttdPasien = $scope.cc.namapasien
				$scope.item.dpjp= {"id":$scope.cc.iddpjp,"namalengkap":$scope.cc.dpjp}

				medifirstService.get('emr/get-lab-resume-rj?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.cc.objectruanganfk, true).then(function(dat) {
					$scope.isRouteLoading = false;
					lab = dat.data.data
					for (var i = 0; i < dat.data.data.length; i++) {
						dat.data.data[i].no = i + 1
						dat.data.data[i].statCheckbox = false;
						if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
							dat.data.data[i].statusbridging = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statusbridging = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].iscito == "1") {
							dat.data.data[i].statuscito = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statuscito = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}

					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;

					$scope.dataGrid = {
						data: dat.data.data,
						_data: dat.data.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};

					// $scope.popUpPelayanan.center().open();
					 
					// datalab = dat.data.data;
					// popUps(datalab)

				},
				function(error) {
					$scope.isLoading = false;
				});
				medifirstService.get('emr/get-rad-resume-rj?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.cc.objectruanganfk, true).then(function(dat) {
					$scope.isRouteLoading = false;
					rad = dat.data.data
					for (var i = 0; i < dat.data.data.length; i++) {
						dat.data.data[i].no = i + 1
						dat.data.data[i].statCheckbox = false;
						if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
							dat.data.data[i].statusbridging = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statusbridging = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].iscito == "1") {
							dat.data.data[i].statuscito = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statuscito = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}
						if (dat.data.data[i].hr_norec != null) {
							dat.data.data[i].flagrad = 'Ada';
						} else {
							dat.data.data[i].flagrad = 'Tidak Ada';
						}
	
					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;
					$scope.dataGridRadiologi = {
						data: dat.data.data,
						_data: dat.data.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
	
					// $scope.popUpPelayanan.center().open();
					 
					// datalab = dat.data.data;
					// popUps(datalab)
	
				},
				function(error) {
					$scope.isLoading = false;
				});
				medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi).then(function(dat) {
					obat = dat.data
					for (let i = 0; i < dat.data.length; i++) {
						dat.data[i].no = i + 1;
					}
					$scope.dataGridObat = {
						data: dat.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				loadDiagnosa();
				// medifirstService.get("emr/get-diagnosapasienbynoreg?"
                //             + "noReg=" + $scope.noRegistrasi
                //         ).then(function (data) {
				// 			 
                //             // $scope.isRouteLoading = false;
                //             var dataICD10 = data.data.datas;
                //             $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                //                 data: dataICD10,
                //                 pageSize: 10
                //             });
                //         });
						$scope.columnDiagnosaIcd9 = [{
							"title": "No",
							"template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
							"width": "30px"
						}, 
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "100px"
						}, {
							"field": "kddiagnosatindakan",
							"title": "Kode ICD 9",
							"width": "100px"
						}, {
							"field": "namadiagnosatindakan",
							"title": "Nama ICD 9",
							"width": "300px"
						}, {
							"field": "keterangantindakan",
							"title": "Keterangan",
							"width": "200px"
						}, {
							"field": "namaruangan",
							"title": "Ruangan",
							"width": "200px"
						},
						{
							"field": "namalengkap",
							"title": "Penginput",
							"width": "200px"
						},
						{
							"field": "tglinputdiagnosa",
							"title": "Tgl Input",
							"width": "200px"
						}];
						$scope.columnDiagnosaIcd10 = [{
							"title": "No",
							"template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
							"width": "30px"
						}, 
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "100px"
						},{
							"field": "jenisdiagnosa",
							"title": "Jenis Diagnosis",
							"width": "150px"
						}, {
							"field": "kddiagnosa",
							"title": "Kode ICD 10",
							"width": "100px"
						}, {
							"field": "namadiagnosa",
							"title": "Nama ICD 10",
							"width": "300px"
						}, {
							"field": "keterangan",
							"title": "Keterangan",
							"width": "200px"
						}, {
							"field": "namaruangan",
							"title": "Ruangan",
							"width": "150px"
						},
						{
							"field": "namalengkap",
							"title": "Penginput",
							"width": "200px"
						},
						{
							"field": "tglinputdiagnosa",
							"title": "Tgl Input",
							"width": "200px"
						}];
			
			}
			$scope.columnGrid = {toolbar: [{
				name: "create", text: "Input Baru",
				template: '<button ng-click="tambahDataLab()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
					},],
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    //     attributes: {
                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    //     },
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                                // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab == 'N' ? 'red' : #=flaglab == 'Belum Input Lab' ? 'blue' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusLab, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
			// ini disini
			$scope.columnGridRadiologi = {toolbar: [{
				name: "create", text: "Input Baru",
				template: '<button ng-click="tambahDataRad()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Radiologi</button>'
					},],
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"cetakEkspertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusRad, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
			$scope.columnGridObat = {toolbar: [{
				name: "create", text: "Input Baru",
				template: '<button ng-click="tambahDataObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
					},],
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "namaruangandepo",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
			function hapusLab(e) {
				let labfix = [];
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
				for (let i = 0; i < lab.length; i++) {
					if (lab[i].norec_pp == dataItem.norec_pp) {
						delete lab[i];
						grid.removeRow(row);
					} else {
						labfix.push(lab[i])
					}
				}
				lab = labfix
			}
			function hapusRad(e) {
				let radfix = [];
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
				for (let i = 0; i < rad.length; i++) {
					if (rad[i].norec_pp == dataItem.norec_pp) {
						delete rad[i];
						grid.removeRow(row);
					} else {
						radfix.push(rad[i])
					}
				}
				rad = radfix
			}
			function loadKonsul() {
				medifirstService.get('emr/get-order-konsul?noregistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
					if (dat.data.data.length > 0) {
						hasilKonsultasi = dat.data.data[0].keteranganlainnya
					}
				})
			}
			function hapusObat(e) {
				let obatfix = [];
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
				for (let i = 0; i < obat.length; i++) {
					if (obat[i].norecpp == dataItem.norecpp) {
						delete obat[i];
						grid.removeRow(row);
					} else {
						obatfix.push(obat[i])
					}
				}
				obat = obatfix
			}
			$scope.tambahDataLab = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < lab.length; i++) {
					let c = lab[i].norec_pp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('emr/get-lab-resume-rj-deleted?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.item.objectruanganfk + "&norec=" + tampungNorec, true).then(function(dat) {
					 
					$scope.isRouteLoading = false;
					for (var i = 0; i < dat.data.data.length; i++) {
						dat.data.data[i].no = i + 1
						dat.data.data[i].statCheckbox = false;
						if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
							dat.data.data[i].statusbridging = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statusbridging = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].iscito == "1") {
							dat.data.data[i].statuscito = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statuscito = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}

					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;

					$scope.dataGridLabDelete = {
						data: dat.data.data,
						_data: dat.data.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				$scope.columnGridLabDelete = {
					columns: [
						// {
						// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						// 	template: "# if (statCheckbox) { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
						// 		"# } else { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
						// 		"# } #",
						// 	width: "30px",
						// 	attributes: {
						// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
						//    },
						// },
						{
							"field": "no",
							"title": "No",
							"width": "30px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglpelayanan",
							"title": "Tgl Pelayanan",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "ruangan",
							"title": "Ruangan",
							"width": "120px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "namaruanganasal",
							"title": "Ruangan Asal",
							"width": "120px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						// {
						//     "field": "namaproduk",
						//     "title": "Layanan",
						//     "width": "160px",
						//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						//     attributes: {
						//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
						//     },
						// },
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
							"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
									// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "dokterpemeriksa",
							"title": "Dokter Pemeriksa",
							"width": "140px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "dokterpengirim",
							"title": "Dokter Pengririm",
							"width": "140px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglhasil",
							"title": "Tgl Hasil",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglcetak",
							"title": "Tgl Cetak",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"command": [
								{ text: "Tambah", click: tambahLab, imageClass: "k-icon k-i-read" }
							],
							title: "Action",
							width: "100px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpLabDelete.center().open()
			}
			$scope.tambahDataRad = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < rad.length; i++) {
					let c = rad[i].norec_pp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('emr/get-rad-resume-rj?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.item.objectruanganfk + "&norec=" + tampungNorec, true).then(function(dat) {
					 
					$scope.isRouteLoading = false;
					for (var i = 0; i < dat.data.data.length; i++) {
						dat.data.data[i].no = i + 1
						dat.data.data[i].statCheckbox = false;
						if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
							dat.data.data[i].statusbridging = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statusbridging = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].iscito == "1") {
							dat.data.data[i].statuscito = "✔";
							// ✅
							// ✔
						} else {
							dat.data.data[i].statuscito = "✘";
							// ✘
							// ❎
						}
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}
						if (dat.data.data[i].hr_norec != null) {
							dat.data.data[i].flagrad = 'Ada';
						} else {
							dat.data.data[i].flagrad = 'Tidak Ada';
						}

					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;

					$scope.dataGridRadDelete = {
						data: dat.data.data,
						_data: dat.data.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				$scope.columnGridRadDelete = {
					columns: [
						// {
						// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						// 	template: "# if (statCheckbox) { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
						// 		"# } else { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
						// 		"# } #",
						// 	width: "30px",
						// 	attributes: {
						// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
						//    },
						// },
						{
							"field": "no",
							"title": "No",
							"width": "30px",
						},
						{
							"field": "tglpelayanan",
							"title": "Tgl Pelayanan",
							"width": "90px",
						},
						{
							"field": "ruangan",
							"title": "Ruangan",
							"width": "120px",
						},
						{
							"field": "namaruanganasal",
							"title": "Ruangan Asal",
							"width": "120px",
						},
						// {
						//     "field": "namaproduk",
						//     "title": "Layanan",
						//     "width": "160px",
						//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						//     attributes: {
						//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
						//     },
						// },
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
							"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						},
						{
							"field": "dokterpemeriksa",
							"title": "Dokter Pemeriksa",
							"width": "140px",
						},
						{
							"field": "dokterpengirim",
							"title": "Dokter Pengririm",
							"width": "140px",
						},
						{
							"field": "tglhasil",
							"title": "Tgl Hasil",
							"width": "90px",
						},
						{
							"field": "tglcetak",
							"title": "Tgl Cetak",
							"width": "90px",
						},
						{
							"command": [
								{ text: "Tambah", click: tambahRad, imageClass: "k-icon k-i-read" }
							],
							title: "Action",
							width: "100px",
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpRadDelete.center().open()
			}
			$scope.tambahDataObat = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < obat.length; i++) {
					let c = obat[i].norecpp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec).then(function(dat) {
					 
					$scope.isRouteLoading = false;
					for (let i = 0; i < dat.data.length; i++) {
						dat.data[i].no = i + 1;
					}
					$scope.dataGridObatDelete = {
						data: dat.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				$scope.columnGridObatDelete = {
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "30px"
						},
						{
							"field": "tglpelayanan",
							"title": "Tgl Pelayanan",
							"width": "90px"
						},
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "120px"
						},
						{
							"field": "noresep",
							"title": "No Resep",
							"width": "120px"
						},
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
						},
						{
							"field": "namaruangandepo",
							"title": "Depo",
							"width": "140px"
						},
						{
							"field": "dokter",
							"title": "Dokter",
							"width": "140px"
						},
						{
							"command": [
								{ text: "Tambah", click: tambahObat, imageClass: "k-icon k-i-read" }
							],
							title: "Action",
							width: "100px"
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpObatDelete.center().open()
			}
			function tambahLab(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");

					lab.push(dataItem)
					lab.sort()
					for (let i = 0; i < lab.length; i++) {
						lab[i].no = i + 1
					}
					$scope.dataGrid = {
						data: lab,
						_data: lab,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: lab.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
					$scope.columnGrid = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataLab()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
							},],
						columns: [
							// {
							// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
							// 	template: "# if (statCheckbox) { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							// 		"# } else { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							// 		"# } #",
							// 	width: "30px",
							// 	attributes: {
							// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
							//    },
							// },
							{
								"field": "no",
								"title": "No",
								"width": "30px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglpelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "ruangan",
								"title": "Ruangan",
								"width": "120px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "namaruanganasal",
								"title": "Ruangan Asal",
								"width": "120px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							// {
							//     "field": "namaproduk",
							//     "title": "Layanan",
							//     "width": "160px",
							//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							//     attributes: {
							//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
							//     },
							// },
							{
								"field": "namaproduk",
								"title": "Layanan",
								"width": "160px",
								"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
										// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "dokterpemeriksa",
								"title": "Dokter Pemeriksa",
								"width": "140px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "dokterpengirim",
								"title": "Dokter Pengririm",
								"width": "140px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglhasil",
								"title": "Tgl Hasil",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglcetak",
								"title": "Tgl Cetak",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"command": [
									{ text: "Hapus", click: hapusLab, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					grid.removeRow(row);
			}
			function tambahRad(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");

					rad.push(dataItem)
					rad.sort()
					for (let i = 0; i < rad.length; i++) {
						rad[i].no = i + 1
					}
					$scope.dataGridRadiologi = {
						data: rad,
						_data: rad,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: rad.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
					$scope.columnGridRadiologi = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataRad()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
							},],
						columns: [
							// {
							// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
							// 	template: "# if (statCheckbox) { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							// 		"# } else { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							// 		"# } #",
							// 	width: "30px",
							// 	attributes: {
							// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
							//    },
							// },
							{
								"field": "no",
								"title": "No",
								"width": "30px",
							},
							{
								"field": "tglpelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
							},
							{
								"field": "ruangan",
								"title": "Ruangan",
								"width": "120px",
							},
							{
								"field": "namaruanganasal",
								"title": "Ruangan Asal",
								"width": "120px",
							},
							// {
							//     "field": "namaproduk",
							//     "title": "Layanan",
							//     "width": "160px",
							//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							//     attributes: {
							//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
							//     },
							// },
							{
								"field": "namaproduk",
								"title": "Layanan",
								"width": "160px",
								"template": "<button class=\"k-button custom-button\" ng-click=\"cetakEkspertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							},
							{
								"field": "dokterpemeriksa",
								"title": "Dokter Pemeriksa",
								"width": "140px",
							},
							{
								"field": "dokterpengirim",
								"title": "Dokter Pengririm",
								"width": "140px",
							},
							{
								"field": "tglhasil",
								"title": "Tgl Hasil",
								"width": "90px",
							},
							{
								"field": "tglcetak",
								"title": "Tgl Cetak",
								"width": "90px",
							},
							{
								"command": [
									{ text: "Hapus", click: hapusRad, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					grid.removeRow(row);
			}
			function tambahObat(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");

					obat.push(dataItem)
					obat.sort()
					for (let i = 0; i < obat.length; i++) {
						obat[i].no = i + 1
					}
					$scope.dataGridObat = {
						data: obat,
						_data: obat,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: obat.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
					$scope.columnGridObat = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
							},],
						columns: [
							{
								"field": "no",
								"title": "No",
								"width": "30px"
							},
							{
								"field": "tglpelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px"
							},
							{
								"field": "noregistrasi",
								"title": "No Registrasi",
								"width": "120px"
							},
							{
								"field": "noresep",
								"title": "No Resep",
								"width": "120px"
							},
							{
								"field": "namaproduk",
								"title": "Layanan",
								"width": "160px",
							},
							{
								"field": "namaruangandepo",
								"title": "Depo",
								"width": "140px"
							},
							{
								"field": "dokter",
								"title": "Dokter",
								"width": "140px"
							},
							{
								"command": [
									{ text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px"
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					grid.removeRow(row);
			}
			$scope.CetakLabKlinikLangsung = function(dataItem) {
                 
				var umurDay = '';
				var tglpelayanan = ''
				var norecAPD = ''
				var norecPP = ''
				var tglhasil = ''
				var tglcetak = ''
				var ruangan = ''
				var ruanganasal = ''
				var dokterpemeriksa = ''
				var dokterpengirim = ''
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function(data) {
                     
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }
                    }
                });

                if (dataItem.tglhasil == null) {
                    alert("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"

                     
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + dataItem.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["PUSAT KEDOKTERAN DAN KESEHATAN POLRI", "RUMAH SAKIT BHAYANGKARA TK.I R. SAID SUKANTO", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Raya Bogor, Kramat Jati, Jakarta Timur 13510, Telp. (021)8093288, Psw. 177", user.namaLengkap,
                            x, umurDay, $scope.cc.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});
                             ;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                        xhr.open('POST', 'http://192.168.1.7:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                        xhr.open('POST', 'http://10.5.1.2:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                        xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });
            }
			$scope.save = function() {
				debugger
				var prognosis="";
				var carakeluar="";
				var kontrol="";
				var transportasi="";
				var meninggalkanrs="";
				var keadaan="";

				if($scope.item.prognosis!=undefined) prognosis=$scope.item.prognosis.prognosis
				else prognosis="";


				if($scope.item.carakeluar!=undefined) carakeluar= $scope.item.carakeluar.statuspulang
				else carakeluar="";
				if($scope.item.kontrolPoli!=undefined) kontrol= $scope.item.kontrolPoli.namaruangan
				else kontrol="";
				if($scope.item.transportasi!=undefined) transportasi= $scope.item.transportasi.transportasi
				else transportasi="";
				if($scope.item.kondisiMeninggalkan!=undefined) meninggalkanrs= $scope.item.kondisiMeninggalkan.kondisi
				else meninggalkanrs="";
				if($scope.item.keadaanUmum!=undefined) keadaan= $scope.item.keadaanUmum
				else keadaan="";

				var keluhanUtama = ""
				if ($scope.item.keluhanUtama != undefined) {
					keluhanUtama = $scope.item.keluhanUtama
				} else {
					keluhanUtama = '-'
				}

				if ($scope.item.diagnosaDokter == '' || $scope.item.diagnosaDokter == null || $scope.item.diagnosaDokter == undefined) {
					toastr.info('Diagnosa dokter tidak boleh kosong!')
					return
				}

				var diagnosaDokter = ""
				if ($scope.item.diagnosaDokter != undefined) {
					diagnosaDokter = $scope.item.diagnosaDokter
				} else {
					diagnosaDokter = '-'
				}

				var alergi = ""
				if ($scope.item.alergi != undefined) {
					alergi = $scope.item.alergi
				} else {
					alergi = '-'
				}

				var kesadaran = ""
				if ($scope.item.tingkatKesadaran != undefined) {
					kesadaran = $scope.item.tingkatKesadaran
				} else {
					kesadaran = '-'
				}

				var keadaanumum = ""
				if ($scope.item.keadaanUmum != undefined) {
					keadaanumum = $scope.item.keadaanUmum
				} else {
					keadaanumum = '-'
				}

				var jantung = ""
				if ($scope.item.denyutJantung != undefined) {
					jantung = $scope.item.denyutJantung
				} else {
					jantung = '-'
				}

				var pernapasan = ""
				if ($scope.item.pernapasan != undefined) {
					pernapasan = $scope.item.pernapasan
				} else {
					pernapasan = '-'
				}

				var systole = ""
				if ($scope.item.systole != undefined) {
					systole = $scope.item.systole
				} else {
					systole = '-'
				}

				var diastole = ""
				if ($scope.item.diastole != undefined) {
					diastole = $scope.item.diastole
				} else {
					diastole = '-'
				}

				var suhu = ""
				if ($scope.item.suhu != undefined) {
					suhu = $scope.item.suhu
				} else {
					suhu = '-'
				}

				var diet = ""
				if ($scope.item.diet != undefined) {
					diet = $scope.item.diet
				} else {
					diet = '-'
				}

				var edukasi = ""
				if ($scope.item.edukasi != undefined) {
					edukasi = $scope.item.edukasi
				} else {
					edukasi = '-'
				}

				let objSave = {
					satusehat: $scope.item.noSatuSehat,
					passpor: $scope.item.passpor,
					telppenjamin: $scope.item.noTelpPenjamin,
					tglmasuk: moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm'),
					tglkeluar: moment($scope.item.tglPulang).format('YYYY-MM-DD HH:mm'),
					keluhanutama: keluhanUtama,
					alergi: alergi,
					kesadaran: kesadaran,
					keadaanumum: keadaanumum,
					jantung: jantung,
					pernapasan: pernapasan,
					systole: systole,
					diastole: diastole,
					suhu: suhu,
					diet: diet,
					edukasi: edukasi,
					diagdok: diagnosaDokter,

					prognosis: prognosis,
					carakeluar: carakeluar,
					kontrol: kontrol,
					transportasi: transportasi,
					meninggalkanrs: meninggalkanrs,

					tglKontrol: moment($scope.item.tglKontrol).format('YYYY-MM-DD HH:mm'),
					keadaandarurat: $scope.item.darurat,

					ttdpasien: $scope.item.ttdPasien,
					dpjp: $scope.item.dpjp.namalengkap,
					pegawaifk: $scope.item.dpjp.id,
					lab: lab,
					rad: rad,
					obat: obat,
					tindakan: tindakan,
					head: $scope.cc,
					ruanganfk : $scope.cc.objectruanganfk,
					namapasien : $scope.cc.namapasien,
					jeniskelaminfk : $scope.cc.objectjeniskelaminfk,
					nocm : $scope.cc.nocm,
					tgllahir : $scope.cc.tgllahir,
					keadaan: keadaan,


				}
				medifirstService.post('emr/save-resume-medis-rj', objSave).then(function(e) {
					$scope.tampilanDepan = true;
					$scope.tampilanBelakang = false;
					init()
				})
			}
			$scope.kembali = function () {
				$scope.tampilanDepan = true;
                $scope.tampilanBelakang = false;
			}
			$scope.batal = function () {
				$scope.popUp.close()
			}
			init();

			function hapus(e) {
				// debugger
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return
				}
				var itemDelete = {
					"norec": dataItem.norec,
					"noregistrasi": dataItem.noregistrasi
				}

				medifirstService.post('emr/post-resume-medis/delete', itemDelete).then(function (e) {
					if (e.status == 201) {
						init()
					}
				})

			}
			function editData(e) {
				debugger
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return
				}

			}
			function init() {
				 
				$scope.isRouteLoading = true;
				medifirstService.get("emr/get-combo").then(function (e) {
					$scope.listDokter = e.data.dokter
					$scope.listRuangan = e.data.ruanganrajal
					$scope.listJenisKelamin = e.data.jeniskelamin
					$scope.listPenjamin = e.data.rekanan
				})
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });

				$q.all([
					medifirstService.get("emr/get-resume-medis/" + $scope.cc.nocm)
				]).then(function (res) {
					if (res[0].statResponse) {
						var result = res[0].data.data
						if (result.length > 0) {
							for (let index = 0; index < result.length; index++) {
								result[index].no = index + 1
							}
						}
						debugger
						norecresume = result[0].norec

						$scope.sourceResume = new kendo.data.DataSource({
							data: result,
							pageSize: 20,
						});
					}

					$scope.isRouteLoading = false;
				}, (error) => {
					$scope.isRouteLoading = false;
					throw error;
				})


			};


			$scope.Save = function (data) {
				var item = {
					"norec": $scope.item.norec != undefined ? $scope.item.norec : "",
					"tglresume": moment($scope.item.tglresume).format('YYYY-MM-DD HH:mm'),
					"diagnosis": $scope.item.diagnosis != undefined ? $scope.item.diagnosis : "",
					"icd": $scope.item.icd != undefined ? $scope.item.icd : "",
					"jenispemeriksaan": $scope.item.jenispemeriksaan != undefined ? $scope.item.jenispemeriksaan : "",
					"riwayatlalu": $scope.item.riwayatlalu != undefined ? $scope.item.riwayatlalu : "",
					// "namadokter": $scope.item.namadokter != undefined ? $scope.item.namadokter.id : null,
					"pegawaifk": $scope.item.namadokter != undefined ? $scope.item.namadokter.id : null,
					"noregistrasifk": $state.params.noRec
				}

				medifirstService.post('emr/post-resume-medis/save', item).then(function (e) {
					// delete $scope.item;
					clear()
					init();
					medifirstService.postLogging('Summary List', 'Norec resumemedis_t', e.data.resume.norec, 'Resume RJ').then(function (res) {
					})
				});
			};
			function clear() {
				delete $scope.item.namadokter
				delete $scope.item.diagnosis
				delete $scope.item.icd
				delete $scope.item.jenispemeriksaan
				delete $scope.item.riwayatlalu
			}
			function categoryDropDownEditor(container, options) {
				$('<input required name="' + options.field + '"/>')
					.appendTo(container)
					.kendoDropDownList({
						dataTextField: "jenisJabatan",
						dataValueField: "id",
						dataSource: $scope.listJenisJabatan
					});
			}
			var timeoutPromise;
			$scope.$watch('item.filterDiagnosis', function (newVal, oldVal) {
				if (newVal != oldVal) {
					applyFilter("diagnosis", newVal)
				}
			})
			$scope.$watch('item.filterJenisPemeriksaan', function (newVal, oldVal) {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(function () {
					if (newVal != oldVal) {
						applyFilter("jenispemeriksaan", newVal)
					}
				}, 500)
			})
			$scope.$watch('item.filterRiwayatLalu', function (newVal, oldVal) {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(function () {
					if (newVal != oldVal) {
						applyFilter("riwayatlalu", newVal)
					}
				}, 500)
			})

			function applyFilter(filterField, filterValue) {
				var dataGrid = $("#gridResume").data("kendoGrid");
				var currFilterObject = dataGrid.dataSource.filter();
				var currentFilters = currFilterObject ? currFilterObject.filters : [];

				if (currentFilters && currentFilters.length > 0) {
					for (var i = 0; i < currentFilters.length; i++) {
						if (currentFilters[i].field == filterField) {
							currentFilters.splice(i, 1);
							break;
						}
					}
				}

				if (filterValue.id) {
					currentFilters.push({
						field: filterField,
						operator: "eq",
						value: filterValue.id
					});
				} else {
					currentFilters.push({
						field: filterField,
						operator: "contains",
						value: filterValue
					})
				}

				dataGrid.dataSource.filter({
					logic: "and",
					filters: currentFilters
				})
			}
			$scope.resetFilter = function () {
				var dataGrid = $("#gridResume").data("kendoGrid");
				dataGrid.dataSource.filter({});
				delete $scope.item.filterDiagnosis
				delete $scope.item.filterJenisPemeriksaan
				delete $scope.item.filterRiwayatLalu
			}

			$scope.cetak = function () {
				// Penjagaan Limit Akses cetak hanya 3 user dibawah ini aja
                // 25388(Rosita), 26920(wiwit), 26687(teguh), 320263(admin)
                namalengkap = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };                
                // if(namalengkap.id != 25388 && namalengkap.id != 26920 && namalengkap.id != 26687 && namalengkap.id != 320263) {
                //     toastr.error('Akses Dikunci, Silahkan Konfirmasi ke bagian Rekam Medis apabila mau Cetak Resume Medis pasien ini !!')
                //     return
                // }
				loadDiagnosa()
				loadKonsul()
				init()
				// loadCpptO()
			// 	if (confirm('View Resume? ')) {
			// 		var stt = 'true';
			// 	} else {
			// 		var stt = 'false'
			// 	}
			// 	// Do nothing!
			// 	var client = new HttpClient();
			// 	client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-resume-rj=' + $scope.nocm
			// 		+ '&view=' + stt
			// 		, function (response) {
			// 		});
			// }
			// var HttpClient = function () {
			// 	this.get = function (aUrl, aCallback) {
			// 		var anHttpRequest = new XMLHttpRequest();
			// 		anHttpRequest.onreadystatechange = function () {
			// 			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
			// 				aCallback(anHttpRequest.responseText);
			// 		}
	
			// 		anHttpRequest.open("GET", aUrl, true);
			// 		anHttpRequest.send(null);
			// 	}
			medifirstService.get('emr/get-kepentingan-resume-rj?norec=' + $scope.dataSelected.norec).then(function(dat) {
				//  debugger
				
				 let tampung = '';
				 let tampung2 = '';
				 let tampung3 = '';
				 let tampung4 = '';
				 let diagnosautama = 'Diagnosis Primer / Utama : ';
				 let kddiagnosautama = '';
				 let diagnosasekunder = 'Diagnosis Sekunder : ';
				 let kddiagnosasekunder = '';
				 let diagnosaawal = 'Diagnosis Awal : ';
				 let kddiagnosaawal = '';
				 let diagnosatindakan = '';
				 let kddiagnosatindakan = ''
				 let nouruttindakan = 1;
				 let nourutsekunder = 1;
				 let emr = dat.data
				 let nourut = 1;
				 let penunjang = '';
				 let obat = ''
				 let tampungObat = ''
				 let noUrutObat = 1;
				 let obatpulang = ''
				 let tampungObatpulang = ''
				 let noUrutObatpulang = 1;
				 let tindakan = ''
				 let tampungTindakan = '';
				 let noUrutTindakan = 1;
				 let tampungGaNormal = '';
				 let penunjanglab = 'Laboratorium Patologi Klinik : '
				 let tindakanlab = 'Laboratorium Patologi Klinik : '
				 let penunjangrad = 'Radiologi : '
				 let tindakanrad = 'Radiologi : '
				 let penunjangpa = 'Laboratorium Patologi Anatomik : '
				 let tindakanpa = 'Laboratorium Patologi Anatomik : '
				 let alldiagnosa = '';
				for(let i = 0; i < emr.length; i++) {
					if (emr[i].jenispenunjang == 'LAB') {
						// debugger
						tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n"
						tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n"
						for (let j = 0; j < emr[i].detail.length; j++) {
							if (emr[i].detail[j].hasilpenunjang != null) {
								if(emr[i].detail[j].flaglab == 'Y') {
									tampung4 = emr[i].detail[j].hasilpenunjang
									tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / "
								}
							} else {
								// tampung = ''
							}
						}
						penunjanglab = penunjanglab + tampung2
					} else if (emr[i].jenispenunjang == 'RAD') {
						tampung = tampung + nourut + ". " + emr[i].namaproduk + " = "
						tindakanrad = tindakanrad  + "- " + emr[i].namaproduk
						for (let j = 0; j < emr[i].detail.length; j++) {
							if (emr[i].detail[j].hasilpenunjang != null) {
								tampung4 = emr[i].detail[j].hasilpenunjang
								let kalimat = emr[i].detail[j].hasilpenunjang;
								let panjang = kalimat.length;
								let temukan = kalimat.indexOf("kesan");
								if (temukan < 0) {
									temukan = kalimat.indexOf("Kesan");
								}
								if (temukan < 0) {
									temukan = kalimat.indexOf("KESAN");
								}
								let filter = kalimat.slice(temukan, panjang)
								filter = filter.replace(/(<([^>]+)>)/gi, " ");
								tampung2 = filter
								penunjangrad = penunjangrad + emr[i].namaproduk + " " + tampung2 + " \n"
								// debugger
							}
						}
					} else if (emr[i].jenispenunjang == 'LABORATORIUM PATALOGI ANATOMI') {
						tampung = tampung + nourut + ". " + emr[i].namaproduk + " = "
						tindakanpa = tindakanpa + "- " + emr[i].namaproduk
						for (let j = 0; j < emr[i].detail.length; j++) {
							if (emr[i].detail[j].hasilpenunjang != null) {
								tampung4 = emr[i].detail[j].hasilpenunjang
								let kalimat = emr[i].detail[j].hasilpenunjang;
								let panjang = kalimat.length;
								let temukan = kalimat.indexOf("KESIMPULAN");
								if (temukan < 0) {
									temukan = kalimat.indexOf("KESIMPULAN");
								}
								let filter = kalimat.slice(temukan, panjang)
								filter = filter.replace(/(<([^>]+)>)/gi, " ");
								tampung2 = filter
								penunjangpa = penunjangpa + tampung2
								// debugger
							}
						}
					} else if (emr[i].jenispenunjang == 'OBAT') {
						if (emr[i].objectkelompokprodukbpjsfk == 13 || emr[i].objectkelompokprodukbpjsfk == 14) {
							tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk
							obat = obat + tampungObat + "\n";
							noUrutObat = noUrutObat + 1;
							tampungObat = ''
						}
					} else if (emr[i].jenispenunjang == 'OBATPULANG') {
						if (emr[i].objectkelompokprodukbpjsfk == 13 || emr[i].objectkelompokprodukbpjsfk == 14) {
							tampungObatpulang = tampungObatpulang + noUrutObatpulang + ". " + emr[i].namaproduk
							obatpulang = obatpulang + tampungObatpulang + "\n";
							noUrutObatpulang = noUrutObatpulang + 1;
							tampungObatpulang = ''
						}
					} else {
						tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk
						tindakan = tindakan + tampungTindakan + "\n";
						noUrutTindakan = noUrutTindakan + 1;
						tampungTindakan = ''
					}
					if (tampung4 != '') {
						tampung3 = tampung3 + tampung + tampung2 + "\n"
						nourut = nourut + 1;
					}
					tampung2 = ''
					tampung = ''
					tampung4 = '';
				}
				// debugger
				tampungdiagnosa9
				for(let i = 0; i < tampungdiagnosa.length; i++) {
					if (tampungdiagnosa[i].jenisdiagnosa == "Primary") {
						diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa
						kddiagnosautama = tampungdiagnosa[i].kddiagnosa
					} else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
						diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa +"\n"
						kddiagnosaawal = tampungdiagnosa[i].kddiagnosa
					} else {
						// diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
						// kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
						diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa +"\n"
						kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa
					}
					nourutsekunder = nourutsekunder + 1
				}
				if (tampungdiagnosa9.length == 0) {
					diagnosatindakan = '-'
				}
				for(let i = 0; i < tampungdiagnosa9.length; i++) {
					diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + ' - ' + tampungdiagnosa9[i].namadiagnosatindakan + "\n"
					kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n"
					nouruttindakan = nouruttindakan + 1;
				}
				if (penunjanglab == 'Laboratorium Patologi Klinik : ') {
					penunjanglab = ''
				}
				if (penunjangrad == 'Radiologi : ') {
					penunjangrad = ''
				}
				if (penunjangpa == 'Laboratorium Patologi Anatomik : ') {
					penunjangpa = ''
				}
				if (tindakanlab == 'Laboratorium Patologi Klinik : ') {
					tindakanlab = ''
				}
				if (tindakanrad == 'Radiologi : ') {
					tindakanrad = ''
				}
				if (tindakanpa == 'Laboratorium Patologi Anatomik : ') {
					tindakanpa = ''
				}
				if (obatpulang == '') {
					obatpulang = '-'
				}
				if (diagnosautama != 'Diagnosis Primer / Utama : ') {
					// diagnosautama = ''
					alldiagnosa = alldiagnosa + diagnosautama + " \n";
				}
				if (diagnosasekunder != 'Diagnosis Sekunder : ') {
					// diagnosasekunder = ''
					alldiagnosa = alldiagnosa + diagnosasekunder + " \n";
				}
				if (diagnosaawal != 'Diagnosis Awal : ') {
					// diagnosaawal = ''
					alldiagnosa = alldiagnosa + diagnosaawal + " \n";
				}
				if (alldiagnosa == '') {
					alldiagnosa = '-'
				}
				// if (hasilKonsultasi == '') {
				//     hasilKonsultasi = '-'
				// }
				if (penunjanglab == '' && penunjangrad == '' && penunjangpa == '') {
					penunjanglab = '-'
				}
				if (tindakanlab == '' && tindakanrad == '' && tindakanpa == '') {
					tindakanlab = '-'
				}
				let kontrolpoli = '-'
				if ($scope.item.kontrolPoli != undefined) {
					kontrolpoli = $scope.item.kontrolPoli.namaruangan
				}
				let tindaklanjut = "Kontrol ke Poli : Tidak" + " \n" + "Pada Tanggal : -" + " \n" + "Dalam Keadaan Darurat Dapat Menghubungi : RS Bhayangkara Cianjur 02263285299";
				if ($scope.item.yapoli == true) {
					tindaklanjut = "Kontrol ke Poli : " + kontrolpoli + " \n" + "Pada Tanggal : " + moment($scope.item.tglKontrol).format('DD-MM-YYYY') + " \n" + "Dalam Keadaan Darurat Dapat Menghubungi : RS Bhayangkara Cianjur 02263285299"
				}
				if ($scope.item.hasilKonsul == '' || $scope.item.hasilKonsul == undefined) {
					hasilKonsultasi = '-'
				} else {
					hasilKonsultasi = $scope.item.hasilKonsul
				}
				// let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?idPegawai="+ $scope.item.dpjp.id + "&pesan=" + "RESUME MEDIS" + "&noregistrasi=" + $scope.cc.noregistrasi
				// let z = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pasien?noregistrasi=" + $scope.cc.noregistrasi
				var data = {
					"gambarLogo": "logodokkes.jpg",
					"paramKey": ["norec", "tampung", "diagnosautama", "kddiagnosautama", "diagnosasekunder", "kddiagnosasekunder", "diagnosatindakan", "kddiagnosatindakan", "penunjang", "obat", "tindakan","penunjanglab","penunjangrad","penunjangpa","tindakanlab","tindakanrad","tindakanpa","hasilkonsul","diagnosaawal","cpptO","alldiagnosa","tindaklanjut","obatpulang"],
					"paramValue": [ $scope.dataSelected.norec, tampung3, diagnosautama, kddiagnosautama, diagnosasekunder, kddiagnosasekunder, diagnosatindakan, kddiagnosatindakan, penunjang, obat, tindakan,penunjanglab,penunjangrad,penunjangpa,tindakanlab,tindakanrad,tindakanpa,hasilKonsultasi,diagnosaawal,cpptO, alldiagnosa,tindaklanjut,obatpulang],
					"paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "","","","","","","","","",""]
				};
				debugger
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						//this.response is what you're looking for
						// handler(this.response);
						console.log(this.response, typeof this.response);
						//var res = this.response
						//var file = new Blob( [res], {type: 'application/pdf'});
						// debugger;
						var url = window.URL.createObjectURL(this.response)
						var pdf = document.getElementById('tempatLaporan');
						pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
						var win = window.open(url, '_blank');
						win.focus();
					}
				}
				if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://localhost:8797/generic/report/ResumeMedisRj.pdf');
                } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                    xhr.open('POST', 'http://103.151.226.36:2222/generic/report/ResumeMedisRj.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/ResumeMedisRj.pdf');
                }
				// set `Content-Type` header
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
				xhr.responseType = 'blob';
				// send rquest with JSON payload
				xhr.send(JSON.stringify(data));
			})
			var jsonLog = {
				'jenislog': 'Cetak Resume Medis',
				'referensi': 'noregistrasi',
				'noreff': $scope.cc.noregistrasi,
				'keterangan': 'Cetak Resume Medis' +  ' Dengan No Registrasi ' + $scope.cc.noregistrasi + ' ' + 'Oleh User ' + '' + namalengkap.namalengkap
				+ ' ' + 'Pada ' + $scope.item.tglcetak,
				'jenisemr': 'Resume Medis',                    
			}
			medifirstService.postLoggingEMRCetak(jsonLog).then(function(e) {
			})
			}
			function cekYangBisaOtomatis() {
				medifirstService.get('emr/get-otomatis?noregistrasi=' + $scope.cc.noregistrasi + "&namaRuangan=" + $scope.cc.namaruangan).then(function(dat) {
					if(dat.data.data[0].objectstatuspulangfk == 13) {
						$scope.item.sembuh = true
					} else if (dat.data.data[0].objectstatuspulangfk == 15) {
						$scope.item.dirawat = true
					} else if (dat.data.data[0].objectstatuspulangfk == 16) {
						$scope.item.dirujuk = true
					}
					if (dat.data.data[0].id != null) {
						$scope.item.namadokter = { id: dat.data.data[0].id, namalengkap: dat.data.data[0].namalengkap }
					}
					$scope.item.tglMasuk = new Date(dat.data.data[0].tglregistrasi)
					$scope.item.tglPulang = new Date(dat.data.data[0].tglpulang)
					$scope.item.keluhanUtama = dat.data.cppt[0].subjective
				})
				medifirstService.get('emr/get-value-from-pengkajian-awal-3?noRegistrasi=' + $scope.cc.noregistrasi)
				.then(function(dat) {
					console.log(dat);
					if (dat.data.length > 0) {
						for(let i = 0; i < dat.data.length; i++) {
							if (dat.data[i].emrdfk == 1168 || dat.data[i].emrdfk == 1407 || dat.data[i].emrdfk == 2471 || dat.data[i].emrdfk == 3647 ) {
								$scope.item.tingkatKesadaran = dat.data[i].value
							}
							if (dat.data[i].emrdfk == 1170 || dat.data[i].emrdfk == 1409 || dat.data[i].emrdfk == 2473 || dat.data[i].emrdfk == 3649 ) {
								$scope.item.denyutJantung = dat.data[i].value
							}
							if (dat.data[i].emrdfk == 1173 || dat.data[i].emrdfk == 1412 || dat.data[i].emrdfk == 2476 || dat.data[i].emrdfk == 3654 ) {
								$scope.item.pernapasan = dat.data[i].value
							}
							if (dat.data[i].emrdfk == 1169 || dat.data[i].emrdfk == 1408 || dat.data[i].emrdfk == 2472 || dat.data[i].emrdfk == 3648 ) {
								let str = dat.data[i].value
								let res = str.split("/");
								$scope.item.systole = res[0]
								$scope.item.diastole = res[1]
							}
							if (dat.data[i].emrdfk == 1172 || dat.data[i].emrdfk == 1411 || dat.data[i].emrdfk == 2475 || dat.data[i].emrdfk == 3653 ) {
								$scope.item.suhu = dat.data[i].value
							}
						}
					}
				})
				// medifirstService.get('emr/get-value-from-cppt?noRegistrasi=' + $scope.cc.noregistrasi)
				// .then(function(dat) {
				// 	console.log(dat.data.data);
				// 	if (dat.data.data.length > 0) {
				// 		for(let i = 0; i < dat.data.data.length; i++) {
				// 			if (dat.data.data[i].emrdfk == 851) {
				// 				$scope.item.keluhanUtama = dat.data.data[i].value
				// 			}
				// 		}
				// 	}
				// })
				let orf = 'false'
				if ($scope.cc.objectruanganfk == '580') {
					orf = 'false'
				} else {
					orf = 'true'
				}
				medifirstService.get('emr/get-value-from-cppt-dok?noRegistrasi=' + $scope.cc.noregistrasi + '&orf=' + orf)
				.then(function(dat) {
					console.log(dat.data.data);
					if (dat.data.data.length > 0) {
						for(let i = 0; i < dat.data.data.length; i++) {
							if (dat.data.data[i].emrdfk == 853) {
								$scope.item.diagnosaDokter = dat.data.data[i].value
							}
							if (dat.data.data[i].emrdfk == 851) {
								$scope.item.keluhanUtama = dat.data.data[i].value
							}
						}
					}
				})
                medifirstService.get("farmasi/get-pengkajian-pasien?nocm=" + $scope.cc.nocm, true).then(function (m) {                         
                    $scope.item.alergi = "";
                    if (m.data.Alergi[0] != undefined) {
                        $scope.item.alergi = m.data.Alergi[0].statusalergi;
                    } 
                });
				medifirstService.get("emr/get-edukasi-pasien?norec=" + $scope.cc.norec_pd).then(function(dat) {
					debugger
					let no = 0;
					$scope.item.edukasi = '';
					for (let i = 0; i < dat.data.length; i++) {
						no = no + 1;
						$scope.item.edukasi = $scope.item.edukasi + no + ". " + dat.data[i].materiedukasi + "\n"; 
					}
				})
				//$scope.item.darurat = "RS Bhayangkara TK.I Pusdokkes Polri 0218093288 / 0218090559"
				$scope.item.darurat ="IGD RS Bhayangkara TK. IV Cianjur Telp. (0263) 285299";
				loadDiagnosa()
			}
			function loadTindakan() {
				medifirstService.get('tatarekening/detail-tagihanv2/' + $scope.cc.noregistrasi + "?" + "jenisdata=layanan").then(function(dat) {
					// debugger
					let tindakan3 = [];
					let tindakan2 = dat.data.details;
					for (let i = 0; i < tindakan2.length; i++) {
						if (tindakan2[i].namaPelayanan != null) {
							tindakan3.push(tindakan2[i])
						}
					}
					tindakan = tindakan3
					$scope.dataGridTindakan = {
						data: tindakan,
						selectable: true,
						refresh: true,
						total: tindakan.length,
						serverPaging: false,
					};
					$scope.columnGridTindakan = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataTindakan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Tindakan</button>'
							},],
						columns: [
							{
								"field": "tglPelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
							},
							{
								"field": "ruanganTindakan",
								"title": "Ruangan",
								"width": "120px",
							},
							{
								"field": "namaPelayanan",
								"title": "Tindakan",
								"width": "120px",
							},
							{
								"field": "dokter",
								"title": "Dokter Pemeriksa",
								"width": "140px",
							},
							{
								"command": [
									{ text: "Hapus", click: hapusTindakan, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
				})
			}
			function hapusTindakan(e) {
				debugger
				let tindakanfix = [];
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
				for (let i = 0; i < tindakan.length; i++) {
					if (tindakan[i].norec == dataItem.norec) {
						delete tindakan[i];
						grid.removeRow(row);
					} else {
						tindakanfix.push(tindakan[i])
					}
				}
				tindakan = tindakanfix
			}
			$scope.tambahDataTindakan = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < tindakan.length; i++) {
					let c = tindakan[i].norec
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('tatarekening/detail-tagihanv2/' + $scope.cc.noregistrasi + "?" + "jenisdata=layanan" + "&norec=" + tampungNorec).then(function(dat) {
					// debugger
					$scope.isRouteLoading = false;
					let tindakan2 = dat.data.details;
					$scope.dataGridTindakanDelete = {
						data: tindakan2,
						selectable: true,
						refresh: true,
						total: tindakan2.length,
						serverPaging: false,
					};
					$scope.columnGridTindakanDelete = {
						columns: [
							{
								"field": "tglPelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
							},
							{
								"field": "ruanganTindakan",
								"title": "Ruangan",
								"width": "120px",
							},
							{
								"field": "namaPelayanan",
								"title": "Tindakan",
								"width": "120px",
							},
							{
								"field": "dokter",
								"title": "Dokter Pemeriksa",
								"width": "140px",
							},
							{
								"command": [
									{ text: "Tambah", click: tambahTindakan, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					$scope.popUpTindDelete.center().open()
				})
			}
			function tambahTindakan(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");

					tindakan.push(dataItem)
					tindakan.sort()
					for (let i = 0; i < tindakan.length; i++) {
						tindakan[i].no = i + 1
					}
					$scope.dataGridTindakan = {
						data: tindakan,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: tindakan.length,
						serverPaging: false,
					};
					$scope.columnGridTindakan = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataTindakan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Tindakan</button>'
							},],
						columns: [
							{
								"field": "tglPelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
							},
							{
								"field": "ruanganTindakan",
								"title": "Ruangan",
								"width": "120px",
							},
							{
								"field": "namaPelayanan",
								"title": "Tindakan",
								"width": "120px",
							},
							{
								"field": "dokter",
								"title": "Dokter Pemeriksa",
								"width": "140px",
							},
							{
								"command": [
									{ text: "Hapus", click: hapusTindakan, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
				grid.removeRow(row);
			}
			$scope.cetakEkspertise = function(dataItem) {
				if (dataItem.hr_norec == null) {
					alert('Hasil Tidak Ada !')
					return
				} else {
                    var local = JSON.parse(localStorage.getItem('profile'))
					var profile = local.id;
					window.open(config.baseApiBackend + "report/cetak-ekspertise2?norec=" + dataItem.hr_norec + "&kdprofile=" +  profile, '_blank');
				}
			}
            function loadDiagnosa() {
                $scope.isRouteLoading = true;
                var param =""
                   param = "noReg=" + $scope.cc.noregistrasi;
              
                medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg?"
                    + param
                ).then(function (data) {
                    let penyakitponekigd = data.data.datas.filter(poneks => poneks.penyakitponekigd == 'gynaecology' || poneks.penyakitponekigd == 'obstetric');
                    if(penyakitponekigd.length > 0) {
                        $scope.poneks.poneksudah = true;
                    } else {
                        $scope.poneks.poneksudah = false;
                    }
                    tampungdiagnosa = data.data.datas;
                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });
                });
            }
            $scope.saveIcd10 = function () {
                if (tampungdiagnosa.length > 0) {
                    for (let i = 0; i < tampungdiagnosa.length; i++) {
                        if (tampungdiagnosa[i].objectjenisdiagnosafk == "1") {
                            if ($scope.item.jenisDiagnosis.id == "1") {
                            toastr.error('Diagnosa Primary / Utama Hanya Boleh Diinput 1 Kali !')
                            return
                            }
                        }
                    }
                }
                validasiIcd10();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {

                    $scope.savePeriksaDokter()
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                        + '/ ' + $scope.item.noMr
                    ).then(function (res) {
                    })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.poneks.penyakitponekigd;
                    loadDiagnosa()
                })
            }
            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-"
                    }
                    else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.cc.norec,
                        tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama
                    }

                    $scope.objSave =
                        {
                            detaildiagnosapasien: data,
                        }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }
			$scope.saveIcd9 = function () {
                //  if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
                //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
                //     return
                // }
                validasi();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected;
                    loadDiagnosa($scope.cc.noregistrasi)
                })
            }
			function validasi() {
                var listRawRequired = [
                    "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    if ($scope.dataIcd9Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                    }
                    var ketTindakans = "";
                    if ($scope.item.ketTindakan != undefined) {
                        ketTindakans = $scope.item.ketTindakan
                    }
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        objectpasienfk: norec_apd,
                        tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                        keterangantindakan: ketTindakans
                    }

                    $scope.objSave = {
                        detaildiagnosatindakanpasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }
			$scope.klikIcd9 = function (dataIcd9Selected) {
                $scope.item.diagnosaTindakan = {
                    id: dataIcd9Selected.id,
                    namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                    kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' + dataIcd9Selected.namadiagnosatindakan,
                    kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
                }
                $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
                $scope.findBy = "1";
            }
			$scope.deleteIcd9 = function () {
                if ($scope.item.diagnosaTindakan == undefined) {
                    toastr.warning('Pilih data yang mau di hapus!!')
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected
                    loadDiagnosa($scope.cc.noregistrasi)

                })
            }
            $scope.savePeriksaDokter=  function(){
                var kelompokUser = medifirstService.getKelompokUser()
                if(kelompokUser== 'dokter' ){
                    var data ={
                    "norec_apd" :norec_apd,
                    "kelompokUser" : kelompokUser
                }
                medifirstService.postNonMessage('rawatjalan/save-periksa',data)
                .then(function (res) {

                })
                }
            }
            $scope.columnDiagnosaIcd10 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                "width": "30px"
            }, 
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            },{
                "field": "jenisdiagnosa",
                "title": "Jenis Diagnosis",
                "width": "150px"
            }, {
                "field": "kddiagnosa",
                "title": "Kode ICD 10",
                "width": "100px"
            }, {
                "field": "namadiagnosa",
                "title": "Nama ICD 10",
                "width": "300px"
            }, {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "150px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }];
            $scope.klikIcd10 = function (dataIcd10Selected) {
                $scope.item.jenisDiagnosis = {
                    id: dataIcd10Selected.objectjenisdiagnosafk,
                    jenisdiagnosa: dataIcd10Selected.jenisdiagnosa
                }

                $scope.item.diagnosa = {
                    id: dataIcd10Selected.id,
                    namaDiagnosa: dataIcd10Selected.namadiagnosa,
                    kdDiagnosa: dataIcd10Selected.kddiagnosa,
                    kodeNama: dataIcd10Selected.kddiagnosa + ' - ' +dataIcd10Selected.namadiagnosa    
                }
                $scope.item.keterangan = dataIcd10Selected.keterangan
                if (dataIcd10Selected.iskasusbaru == '1') {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
                $scope.findBy = "1";
            }
            $scope.deleteIcd10 = function () {
                if ($scope.item.diagnosa == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.cc.noregistrasi
                        + '/ ' + $scope.cc.nocm

                    ).then(function (res) {
                    })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.poneks.penyakitponekigd;
                    loadDiagnosa()

                })
            }
			$scope.$watch('item.carakeluar', function (e) {
				if (e.statuspulang == "Dirujuk" || e.statuspulang == "Lain - lain") {
					$scope.carakeluarlain = true;
				} else {
					$scope.carakeluarlain = false;
				}
			})
			$scope.$watch('item.kondisiMeninggalkan', function(e) {
				if (e.kondisi == "Dirujuk" || e.kondisi == "Lain - lain") {
					$scope.kondisiMeninggalkanLain = true;
				} else {
					$scope.kondisiMeninggalkanLain = false;
				}
			})
		}
	]);
});