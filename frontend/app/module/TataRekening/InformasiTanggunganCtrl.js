define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiTanggunganCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

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
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.jmlRujukanKeluar = 0
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

				var chacePeriode = cacheHelper.get('InformasiTanggung');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get("bridging/inacbg/get-combo", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					var ruangands = []
					for (let i = 0; i < $scope.listDepartemen.length; i++) {
						const element = $scope.listDepartemen[i];
						if (element.id == 16) {
							ruangands = element.ruangan
							break
						}
					}
					$scope.listKelas = data.data.kelas
					$scope.item.instalasi = {
						id: 16,
						departemen: "Instalasi Rawat Inap",
						ruangan: ruangands
					}
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listRuangan = ruangands
					// $scope.item.kelompokpasien = {
					// 	id: 2,
					// 	kelompokpasien: "BPJS"
					// }
					$scope.selectOptionsKelompok = {
						placeholder: "Pilih Kelompok...",
						dataTextField: "kelompokpasien",
						dataValueField: "id",
						// dataSource:{
						//     data: $scope.listRuangan
						// },
						autoBind: false,

					};
					var kelompok = []
					for (let i = 0; i < $scope.listKelompokPasien.length; i++) {
						const element = $scope.listKelompokPasien[i];
						if (element.kelompokpasien.indexOf('BPJS') > -1)
							kelompok.push(element)
					}
					$scope.item.kelompokpasien = kelompok
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
				})
				// $scope.listStatus = manageKasir.getStatus();
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return '-'
				else
					return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				if (value == 'null')
					value = 0
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			var onDataBound = function (e) {
				var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
				var rows = e.sender.element.find("tbody tr"); // get all rows

				// iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var ditanggung = parseFloat(kendoGrid.dataItem(row).totalpiutangpenjamin)
					var totaltagihan = kendoGrid.dataItem(row).totaltagihan;

					if (ditanggung == 0) break;
					if (totaltagihan >= ditanggung) {
						$(row.cells).addClass("red");
						break
					}
					var presn = ditanggung * 0.1
					var totalPersen = ditanggung - presn
					if (totaltagihan <= totalPersen)
						$(row.cells).addClass("koneng");
				}
			}
			$scope.columnDaftarPasienPulang = {

				dataBound: onDataBound,
				toolbar: [
					{
						text: "export", name: "Export detail",
						template: '<button ng-click="exportDetailSTR()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export to Excel</button>'
					},

				],
				excel: {
					fileName: "InformasiTanggungan.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Informasi Tanggungan",
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
							"field": "tglregistrasi",
							"title": "Tgl Registrasi",
							"width": "7%",
							"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
						},
						{
							"field": "noregistrasi",
							"title": "NoReg",
							"width": "7%"
						},
						{
							"field": "nocm",
							"title": "NoRM",
							"width": "7%",
							"template": "<span class='style-center'>#: nocm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "20%",
							"template": "<span class='style-left'>#: namapasien #</span>"
						},

						{
							"field": "namadokter",
							"title": "Nama Dokter",
							"width": "15%",
							"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
						},
						{
							"field": "namaruangan",
							"title": "Nama Ruangan",
							"width": "15%",
							//"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
						},
						// {
						// 	"field": "tglpulang",
						// 	"title": "Tgl Pulang",
						// 	"width": "10%",
						// 	"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
						// },
						{
							"field": "lamadirawat",
							"title": "Lama Dirawat",
							"width": "10%"
						},
						{
							"field": "nosep",
							"title": "No SEP",
							"width": "10%",
							"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
						},

						{
							"field": "namakelas",
							"title": "Kelas Dijamin",
							"width": "9%",
							"template": '# if( namakelas==null) {# - # } else {# #= namakelas # #} #'
						},
						{
							"field": "namakelasdaftar",
							"title": "Kelas Terakhir",
							"width": "10%"
						},

						{
							"field": "totalpiutangpenjamin",
							"title": "Tarif INACBG",
							"width": "10%",
							"template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalpiutangpenjamin #', 'Rp. ')}}</span>",
						},
						{
							"field": "biayanaikkelas",
							"title": "Biaya Naik Kelas",
							"width": "10%",
							"template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: biayanaikkelas #', 'Rp. ')}}</span>",
						},
						{
							"field": "totaltagihan",
							"title": "Total Tagihan",
							"width": "10%",
							"template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totaltagihan #', 'Rp. ')}}</span>",
						},
						{
							"field": "icd10",
							"title": "Diagnosa",
							"width": "10%",

						}

					]
			};
			$scope.exportDetailSTR = function () {
				var tempDataExport = [];
				var rows = [
					{
						cells: [
							{ value: "Tgl Registrasi" },
							{ value: "NoReg" },
							{ value: "NoRM" },
							{ value: "Nama Pasien" },
							{ value: "Nama Dokter" },
							{ value: "Lama Dirawat" },
							{ value: "No SEP" },
							{ value: "Kelas Dijamin" },
							{ value: "Kelas Terakhir" },
							{ value: "Tarif INACBG" },
							{ value: "Biaya Naik Kelas" },
							{ value: "Total Tagihan" },
							{ value: "Diagnosa" },

						]
					}
				];

				tempDataExport = $scope.dataDaftarPasienPulang;
				tempDataExport.fetch(function () {
					var data = this.data();
					console.log(data);
					for (var i = 0; i < data.length; i++) {
						//push single row for every record
						rows.push({
							cells: [
								{ value: moment(new Date(data[i].tglregistrasi)).format('DD-MM-YYYY') },
								{ value: data[i].noregistrasi },
								{ value: data[i].nocm },
								{ value: data[i].namapasien },
								{ value: data[i].namadokter },
								{ value: data[i].lamadirawat },
								{ value: data[i].nosep },
								{ value: data[i].namakelas },
								{ value: data[i].namakelasdaftar },
								{ value: data[i].totalpiutangpenjamin },
								{ value: data[i].biayanaikkelas },
								{ value: data[i].totaltagihan },
								{ value: data[i].icd10 },

							]
						})
					}
					var workbook = new kendo.ooxml.Workbook({
						sheets: [
							{
								freezePane: {
									rowSplit: 1
								},
								columns: [
									// Column settings (width)
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true },
									{ autoWidth: true }
								],
								// Title of the sheet
								title: "Informasi Tanggungan",
								// Rows of the sheet
								rows: rows
							}
						]
					});
					//save the file as Excel file with extension xlsx
					kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "Informasi Tanggungan -" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY') + "	.xlsx" });
				});
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
				var kls = ""
				if ($scope.item.kelas != undefined) {
					var kls = "&kelasId=" + $scope.item.kelas.id
				}
				// var kp = ""
				// if ($scope.item.kelompokpasien != undefined) {
				// 	var kp = "&kelId=" + $scope.item.kelompokpasien.id
				// }
				var kp = ""

				if ($scope.item.kelompokpasien != undefined && $scope.item.kelompokpasien.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.kelompokpasien.length - 1; i >= 0; i--) {
						var c = $scope.item.kelompokpasien[i].id
						b = "," + c
						a = a + b
					}
					kp = a.slice(1, a.length)
				}
				if (kp != "") {
					kp = "&kelId=" + kp
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}

				medifirstService.get("bridging/inacbg/get-daftar-informasi-tanggungan?" +
					"tglAwal=" + tglAwal +
					"&tglAkhir=" + tglAkhir +
					reg + rm + nm + ins + rg + kp + dk + kls
					+ '&jmlRows=' + jmlRows
				).then(function (data) {
					debugger
					$scope.isRouteLoading = false;
					data2 = data.data

					dataSave = []
					for (var i = data2.length - 1; i >= 0; i--) {
						var diff = Math.abs(new Date() - new Date(data2[i].tglregistrasi))
						var lamadirawat = Math.ceil(diff / 1000 / 60 / 60 / 24) + ' hari'
						data2[i].lamadirawat = lamadirawat

						if (data2[i].icd10 != false) {

							var jenis_rawat = 1 //ranap
							if (data2[i].deptid != 16) {
								jenis_rawat = 2
							}
							var upgrade_class_ind = 0
							var upgrade_class_class = ''
							var add_payment_pct = 0
							if (data2[i].nokelasdijamin != data2[i].nokelasdaftar) {
								upgrade_class_ind = 1
								upgrade_class_class = data2[i].namakelasdaftar
								add_payment_pct = 0
							}
							// if(data2[i].statusnaikkelas==1){
							// 	upgrade_class_ind = 1
							// 	upgrade_class_class = data2[i].kelastertinggi
							// 	add_payment_pct = 0
							// 	upgrade_class_los = data2[i].lamarawatnaikkelas
							// }
							var discharge_status = 0
							if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6) {
								discharge_status = 1
							} else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
								data2[i].objectstatuspulangfk == 11) {
								discharge_status = 2
							} else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3) {
								discharge_status = 3
							} else if (data2[i].objectstatuspulangfk == 9) {
								discharge_status = 4
							} else {
								discharge_status = 5
							}
							if (jenis_rawat == 2) {
								data2[i].nokelasdijamin = ''
							}
							dataRow = {
								"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
								"nomor_kartu": data2[i].nokepesertaan,    //"233333",    
								"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
								"tgl_pulang": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//data2[i].tglpulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": jenis_rawat,    //"1",    
								"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
								"adl_sub_acute": '',    //"15",    
								"adl_chronic": '',    //"12",    
								"icu_indikator": '',    //"1",    
								"icu_los": '',    //"2",    
								"ventilator_hour": '',    //"5",    
								"upgrade_class_ind": upgrade_class_ind,    //"1",    
								"upgrade_class_class": upgrade_class_class,    //"vip",    
								"upgrade_class_los": '',    //"5",    
								"add_payment_pct": '',    //"35",    
								"birth_weight": '',    //"0",    
								"discharge_status": discharge_status,    //"1",    
								"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
								"procedure": data2[i].icd9,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": data2[i].tarif_rs.obat,    //"2000000",      
									"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
									"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
									"alkes": data2[i].tarif_rs.alkes,    //"500000",      
									"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"tarif_poli_eks": 0,    //"100000",    
								"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
								"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
								"payor_id": '3',    //"3",    
								"payor_cd": 'JKN',    //"JKN",    
								"cob_cd": '#',    //"0001",    
								"coder_nik": data2[i].codernik,    //"123123123123"  
								"nomor_rm": data2[i].nocm,    //"123-45-28",
								"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
								"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
								"gender": data2[i].objectjeniskelaminfk,    //"2"
								"norec_pd": data2[i].norec
							}
							dataSave.push(dataRow)
						}
					}
					$scope.show_btn = true
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nosep == '') {
							$scope.show_btn = false
							break;
						}
					}


					//check data klaim
					// {
					// 	var dt1 ={}
					// 	var dt2 =[]
					// 	for (var i = dataSave.length - 1; i >= 0; i--) {
					// 		dt1 = {   
					// 			"metadata": {      
					// 				"method":"get_claim_data"   
					// 			},   
					// 			"data": {      
					// 				"nomor_sep": dataSave[i].nomor_sep
					// 			} 
					// 		} 
					// 		dt2.push(dt1)
					// 	}

					// 	var objData = {
					// 		  "data": dt2
					// 		}
					// 	medifirstService.savebridginginacbg(objData).then(function(e){
					// 		for (var i = 0; i < data2.length; i++) {
					// 			for (var i = 0; i < e.data.dataresponse.length; i++) {
					// 				if (e.data.dataresponse[i].datarequest.data.nomor_sep == data2[i].nosep) {
					// 					if (e.data.dataresponse[i].dataresponse.metadata.code == 200) {
					// 						data2[i].status = 'Send Claim'
					// 					}else{
					// 						data2[i].status = ''
					// 					}

					// 				}
					// 			}


					// 		}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data.data,
						pageSize: 15,
						total: data.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					// }) 
					// }
					//end //check data klaim


					//end Transpose
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('InformasiTanggung', chacePeriode);
				});

			};




			$scope.new_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "new_claim"
						},
						"data": {
							"nomor_kartu": dataSave[i].nomor_kartu,
							"nomor_sep": dataSave[i].nomor_sep,
							"nomor_rm": dataSave[i].nomor_rm,
							"nama_pasien": dataSave[i].nama_pasien,
							"tgl_lahir": dataSave[i].tgl_lahir,
							"gender": dataSave[i].gender
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}
			$scope.new_claim2 = function () {

				$scope.isRouteLoading = true;
				var datass = []
				for (let i = 0; i < data2.length; i++) {
					const element = data2[i];
					datass.push({ noreg: element.norec, namakelas: element.namakelas, nosep: element.nosep, deptid: element.deptid })
				}
				medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas', { data: datass }).then(function (e) {
					var resp = e.data
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {
						for (var z = resp.length - 1; z >= 0; z--) {
							const element = resp[z];
							if (dataSave[i].nomor_sep == element.nosep) {// $scope.dataPasienSelected.nosep) {
								dt1 = {
									"metadata": {
										"method": "new_claim"
									},
									"data": {
										"nomor_kartu": dataSave[i].nomor_kartu,
										"nomor_sep": dataSave[i].nomor_sep,
										"nomor_rm": dataSave[i].nomor_rm,
										"nama_pasien": dataSave[i].nama_pasien,
										"tgl_lahir": dataSave[i].tgl_lahir,
										"gender": dataSave[i].gender
									}
								}
								dt2.push(dt1)
							}
						}
					}

					var objData = {
						"data": dt2
					}
					// medifirstService.savebridginginacbg(objData).then(function(e){
					for (var i = dataSave.length - 1; i >= 0; i--) {
						for (var z = resp.length - 1; z >= 0; z--) {
							const element = resp[z];
							if (dataSave[i].nomor_sep == element.nosep) {//$scope.dataPasienSelected.nosep) {
								dt1 = {
									"metadata": {
										"method": "set_claim_data",
										"nomor_sep": dataSave[i].nomor_sep
									},
									"data": {
										"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
										"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
										"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
										"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
										"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
										"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
										"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
										"adl_chronic": dataSave[i].adl_chronic,    //"12",    
										"icu_indikator": element.statusrawatintensiv,// resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
										"icu_los": element.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
										"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
										"upgrade_class_ind": element.statusnaikkelas,//dataSave[i].upgrade_class_ind ,    //"1",    
										"upgrade_class_class": element.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
										"upgrade_class_los": element.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
										"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
										"birth_weight": '',//,$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
										"discharge_status": dataSave[i].discharge_status,    //"1",    
										"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
										"procedure": dataSave[i].procedure,    //"81.52#88.38",    
										"tarif_rs": {
											"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
											"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
											"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
											"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
											"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
											"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
											"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
											"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
											"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
											"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
											"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
											"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
											"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
											"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
											"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
											"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
											"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
											"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
										},
										"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
										"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
										"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
										"payor_id": dataSave[i].payor_id,    //"3",    
										"payor_cd": dataSave[i].payor_cd,    //"JKN",    
										"cob_cd": dataSave[i].cob_cd,    //"0001",    
										"coder_nik": dataSave[i].coder_nik    //"123123123123"  
									}
								}
								dt2.push(dt1)
							}
						}
					}

					var objData = {
						"data": dt2
					}
					medifirstService.postNonMessage('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						var dt1 = {}
						var dt2 = []

						for (var i = resp.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1"
								},
								"data": {
									// "nomor_sep": dataSave[i].nomor_sep 
									"nomor_sep": resp[i].nosep// $scope.dataPasienSelected.nosep
								}
							}
							dt2.push(dt1)
						}


						var objData = {
							"data": dt2
						}
						// var totaldijamin = "";
						// var hakkelas = "";
						// var biayanaikkelas = "0";
						medifirstService.postNonMessage('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							// simpan response ke database
							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
							// if(dataSave[0].jenis_rawat==2){
							var proporsiPush = []
							for (let x = 0; x < responData.length; x++) {
								const elementRes = responData[x];
								for (var i = resp.length - 1; i >= 0; i--) {
									const element = resp[i]
									if (elementRes.datarequest.data.nomor_sep == element.nosep) {
										var totaldijamin = "";
										var hakkelas = "";
										var biayanaikkelas = "0";
										if (element.deptid != "16") {
											totaldijamin = elementRes.dataresponse.tarif_alt[2].tarif_inacbg// responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										} else {
											if (elementRes.dataresponse.metadata.code != 400) {
												hakkelas = elementRes.dataresponse.response.kelas
												if (hakkelas == "kelas_1") {
													totaldijamin = elementRes.dataresponse.tarif_alt[0].tarif_inacbg
												} else if (hakkelas == "kelas_2") {
													totaldijamin = elementRes.dataresponse.tarif_alt[1].tarif_inacbg
												} else if (hakkelas == "kelas_3") {
													totaldijamin = elementRes.dataresponse.tarif_alt[2].tarif_inacbg
												}
												// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){

												if (element.statusnaikkelas != '0') {
													biayanaikkelas = elementRes.dataresponse.response.add_payment_amt
													if (biayanaikkelas < 0) {
														biayanaikkelas = 0
													}
												}
											}

										}

										var dataproposi = {
											"noregistrasifk": element.norec_pd,//$scope.dataPasienSelected.norec,
											"totalDijamin": totaldijamin,
											"biayaNaikkelas": biayanaikkelas
										}
										proporsiPush.push(dataproposi)
									}
								}


							}
							medifirstService.post('bridging/inacbg/save-informasi-tanggungan', { 'proporsi': proporsiPush }).then(function (e) {
								//ini untuk proposional kan utang per tindakan
								var dt1 = {}
								var dt2 = []
								for (var i = resp.length - 1; i >= 0; i--) {
									dt1 = {
										"metadata": {
											"method": "delete_claim"
										},
										"data": {
											"nomor_sep": resp[i].nosep,///$scope.dataPasienSelected.nosep,
											"coder_nik": '123123123123',//dataSave[i].coder_nik   
										}
									}
									dt2.push(dt1)
								}
								$scope.isRouteLoading = false;
								var objData = {
									"data": dt2
								}
								medifirstService.postNonMessage('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
									//
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
								})
							})
							loadData()

						})


					})

				})
				// })
			}
			$scope.finalprintklaim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": '123123123123',
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "claim_print"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// response simpan ke database	
						responData = e.data.dataresponse;
						if (responData[0].dataresponse.metadata.code == 200) {
							const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
							const downloadLink = document.createElement("a");
							var tglprint = moment($scope.now).format('YYYY-MM-DD');
							const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";

							downloadLink.href = linkSource;
							downloadLink.download = fileName;
							downloadLink.click();
						}
						// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					})
				})
			}
			$scope.grouping = function () {
				$scope.isRouteLoading = true;
				if ($scope.dataPasienSelected.deptid != 16) {
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
							dt1 = {
								"metadata": {
									"method": "new_claim"
								},
								"data": {
									"nomor_kartu": dataSave[i].nomor_kartu,
									"nomor_sep": dataSave[i].nomor_sep,
									"nomor_rm": dataSave[i].nomor_rm,
									"nama_pasien": dataSave[i].nama_pasien,
									"tgl_lahir": dataSave[i].tgl_lahir,
									"gender": dataSave[i].gender
								}
							}
							dt2.push(dt1)
						}
					}

					var objData = {
						"data": dt2
					}
					// medifirstService.savebridginginacbg(objData).then(function(e){
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
							dt1 = {
								"metadata": {
									"method": "set_claim_data",
									"nomor_sep": dataSave[i].nomor_sep
								},
								"data": {
									"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
									"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
									"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
									"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
									"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
									"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
									"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
									"adl_chronic": dataSave[i].adl_chronic,    //"12",    
									"icu_indikator": dataSave[i].icu_indikator,    //"1",    
									"icu_los": dataSave[i].icu_los,    //"2",    
									"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
									"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
									"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
									"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
									"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
									"birth_weight": '',//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
									"discharge_status": dataSave[i].discharge_status,    //"1",    
									"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
									"procedure": dataSave[i].procedure,    //"81.52#88.38",    
									"tarif_rs": {
										"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
										"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
										"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
										"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
										"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
										"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
										"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
										"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
										"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
										"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
										"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
										"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
										"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
										"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
										"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
										"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
										"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
										"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
									},
									"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
									"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
									"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
									"payor_id": dataSave[i].payor_id,    //"3",    
									"payor_cd": dataSave[i].payor_cd,    //"JKN",    
									"cob_cd": dataSave[i].cob_cd,    //"0001",    
									"coder_nik": dataSave[i].coder_nik    //"123123123123"  
								}
							}
							dt2.push(dt1)
						}
					}

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						var dt1 = {}
						var dt2 = []

						// for (var i = dataSave.length - 1; i >= 0; i--) {
						dt1 = {
							"metadata": {
								"method": "grouper",
								"stage": "1"
							},
							"data": {
								// "nomor_sep": dataSave[i].nomor_sep 
								"nomor_sep": $scope.dataPasienSelected.nosep
							}
						}
						dt2.push(dt1)
						// }


						var objData = {
							"data": dt2
						}
						var totaldijamin = "";
						var hakkelas = "";
						var biayanaikkelas = "0";
						medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							// simpan response ke database
							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
							// if(dataSave[0].jenis_rawat==2){
							if ($scope.dataPasienSelected.deptid != 16) {
								totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
							} else {
								hakkelas = responData[0].dataresponse.response.kelas
								if (hakkelas == "kelas_1") {
									totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
								} else if (hakkelas == "kelas_2") {
									totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
								} else if (hakkelas == "kelas_3") {
									totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
								}
								if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
									biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
									if (biayanaikkelas < 0) {
										biayanaikkelas = 0
									}
								}
							}
							var dataproposi = {
								"noregistrasifk": $scope.dataPasienSelected.norec,
								"totalDijamin": totaldijamin,
								"biayaNaikkelas": biayanaikkelas
							}
							medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
								//ini untuk proposional kan utang per tindakan
							})
							loadData()
							if (responData[0].dataresponse.special_cmg_option.length > 1) {
								toastr.info('Terdeteksi Top-up CMG Options')
								dataSEPCMG = responData[0].datarequest.data.nomor_sep
								var responOptions = responData[0].dataresponse.special_cmg_option
								var spesialDrug = []
								var specialProcedure = []
								var specialProsthesis = []
								var specialInvestigation = []
								for (let i = 0; i < responOptions.length; i++) {
									const element = responOptions[i];
									if (element.type == 'Special Drug') {
										spesialDrug.push(element)
									}
									if (element.type == 'Special Procedure') {
										specialProcedure.push(element)
									}
									if (element.type == 'Special Prosthesis') {
										specialProsthesis.push(element)
									}
									if (element.type == 'Special Investigation') {
										specialInvestigation.push(element)
									}
								}
								$scope.listspecialdrug = spesialDrug
								$scope.listspecialprocedure = specialProcedure
								$scope.listspecialprosthesis = specialProsthesis
								$scope.listspecialinvestigation = specialInvestigation
							}
						})

						$scope.isRouteLoading = false;
					})
				} else {
					medifirstService.get('inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.dataPasienSelected.norec
						+ '&namakelas=' + $scope.dataPasienSelected.namakelas).then(function (e) {
							var resp = e.data
							var dt1 = {}
							var dt2 = []
							for (var i = dataSave.length - 1; i >= 0; i--) {
								if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
									dt1 = {
										"metadata": {
											"method": "new_claim"
										},
										"data": {
											"nomor_kartu": dataSave[i].nomor_kartu,
											"nomor_sep": dataSave[i].nomor_sep,
											"nomor_rm": dataSave[i].nomor_rm,
											"nama_pasien": dataSave[i].nama_pasien,
											"tgl_lahir": dataSave[i].tgl_lahir,
											"gender": dataSave[i].gender
										}
									}
									dt2.push(dt1)
								}
							}

							var objData = {
								"data": dt2
							}
							// medifirstService.savebridginginacbg(objData).then(function(e){
							for (var i = dataSave.length - 1; i >= 0; i--) {
								if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
									dt1 = {
										"metadata": {
											"method": "set_claim_data",
											"nomor_sep": dataSave[i].nomor_sep
										},
										"data": {
											"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
											"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
											"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
											"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
											"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
											"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
											"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
											"adl_chronic": dataSave[i].adl_chronic,    //"12",    
											"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
											"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
											"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
											"upgrade_class_ind": resp.statusnaikkelas,//dataSave[i].upgrade_class_ind ,    //"1",    
											"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
											"upgrade_class_los": resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
											"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
											"birth_weight": '',// $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
											"discharge_status": dataSave[i].discharge_status,    //"1",    
											"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
											"procedure": dataSave[i].procedure,    //"81.52#88.38",    
											"tarif_rs": {
												"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
												"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
												"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
												"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
												"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
												"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
												"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
												"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
												"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
												"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
												"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
												"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
												"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
												"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
												"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
												"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
												"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
												"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
											},
											"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
											"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
											"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
											"payor_id": dataSave[i].payor_id,    //"3",    
											"payor_cd": dataSave[i].payor_cd,    //"JKN",    
											"cob_cd": dataSave[i].cob_cd,    //"0001",    
											"coder_nik": dataSave[i].coder_nik    //"123123123123"  
										}
									}
									dt2.push(dt1)
								}
							}

							var objData = {
								"data": dt2
							}
							medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
								var dt1 = {}
								var dt2 = []

								// for (var i = dataSave.length - 1; i >= 0; i--) {
								dt1 = {
									"metadata": {
										"method": "grouper",
										"stage": "1"
									},
									"data": {
										// "nomor_sep": dataSave[i].nomor_sep 
										"nomor_sep": $scope.dataPasienSelected.nosep
									}
								}
								dt2.push(dt1)
								// }


								var objData = {
									"data": dt2
								}
								var totaldijamin = "";
								var hakkelas = "";
								var biayanaikkelas = "0";
								medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
									// simpan response ke database
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
									toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
									// if(dataSave[0].jenis_rawat==2){
									if ($scope.dataPasienSelected.deptid != 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else {
										hakkelas = responData[0].dataresponse.response.kelas
										if (hakkelas == "kelas_1") {
											totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
										} else if (hakkelas == "kelas_2") {
											totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
										} else if (hakkelas == "kelas_3") {
											totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										}
										// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
										if (resp.statusnaikkelas != '0') {
											biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
											if (biayanaikkelas < 0) {
												biayanaikkelas = 0
											}
										}
									}
									var dataproposi = {
										"noregistrasifk": $scope.dataPasienSelected.norec,
										"totalDijamin": totaldijamin,
										"biayaNaikkelas": biayanaikkelas
									}
									medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
										//ini untuk proposional kan utang per tindakan
									})
									loadData()
									if (responData[0].dataresponse.special_cmg_option.length > 1) {
										toastr.info('Terdeteksi Top-up CMG Options')
										dataSEPCMG = responData[0].datarequest.data.nomor_sep
										var responOptions = responData[0].dataresponse.special_cmg_option
										var spesialDrug = []
										var specialProcedure = []
										var specialProsthesis = []
										var specialInvestigation = []
										for (let i = 0; i < responOptions.length; i++) {
											const element = responOptions[i];
											if (element.type == 'Special Drug') {
												spesialDrug.push(element)
											}
											if (element.type == 'Special Procedure') {
												specialProcedure.push(element)
											}
											if (element.type == 'Special Prosthesis') {
												specialProsthesis.push(element)
											}
											if (element.type == 'Special Investigation') {
												specialInvestigation.push(element)
											}
										}
										$scope.listspecialdrug = spesialDrug
										$scope.listspecialprocedure = specialProcedure
										$scope.listspecialprosthesis = specialProsthesis
										$scope.listspecialinvestigation = specialInvestigation
									}
								})

								$scope.isRouteLoading = false;
							})

						})
				}


			}
			$scope.update_patient = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "update_patient",
								"nomor_rm": dataSave[i].nomor_rm
							},
							"data": {
								"nomor_kartu": dataSave[i].nomor_kartu,
								"nomor_rm": dataSave[i].nomor_rm,
								"nama_pasien": dataSave[i].nama_pasien,
								"tgl_lahir": dataSave[i].tgl_lahir,
								"gender": dataSave[i].gender
							}
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}
			$scope.set_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": dataSave[i].add_payment_pct,    //"35",    
								"birth_weight": dataSave[i].birth_weight,    //"0",    
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": "0",
									"obat_kemoterapi": "0",
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							}
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}

			$scope.grouper_1 = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien Terlebih dahulu!!!')
					return;
				}

				var dt1 = {}
				var dt2 = []

				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "1"
					},
					"data": {
						// "nomor_sep": dataSave[i].nomor_sep 
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }


				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var hakkelas = "";
				var biayanaikkelas = "0";
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.dataPasienSelected.deptid != 16) {
						totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						if (hakkelas == "kelas_1") {
							totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
						} else if (hakkelas == "kelas_2") {
							totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
						} else if (hakkelas == "kelas_3") {
							totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
						}
						if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
							biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
							if (biayanaikkelas < 0) {
								biayanaikkelas = 0
							}
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas
					}
					medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
						//ini untuk proposional kan utang per tindakan
					})
					loadData()
					if (responData[0].dataresponse.special_cmg_option.length > 1) {
						toastr.info('Terdeteksi Top-up CMG Options')
						dataSEPCMG = responData[0].datarequest.data.nomor_sep
						var responOptions = responData[0].dataresponse.special_cmg_option
						var spesialDrug = []
						var specialProcedure = []
						var specialProsthesis = []
						var specialInvestigation = []
						for (let i = 0; i < responOptions.length; i++) {
							const element = responOptions[i];
							if (element.type == 'Special Drug') {
								spesialDrug.push(element)
							}
							if (element.type == 'Special Procedure') {
								specialProcedure.push(element)
							}
							if (element.type == 'Special Prosthesis') {
								specialProsthesis.push(element)
							}
							if (element.type == 'Special Investigation') {
								specialInvestigation.push(element)
							}
						}
						$scope.listspecialdrug = spesialDrug
						$scope.listspecialprocedure = specialProcedure
						$scope.listspecialprosthesis = specialProsthesis
						$scope.listspecialinvestigation = specialInvestigation
					}
				})
			}
			$scope.simpangrouper2 = function () {
				var cmg = "";
				if ($scope.item.specialprocedure != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}
				var dt1 = {}
				var dt2 = []

				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "2"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"special_cmg": cmg//"ambil dari table hasil grouper 1"   
					}
				}
				dt2.push(dt1)




				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var totaldijamina = "";
				var biayanaikkelas = "0";
				var hakkelas = "";
				var cmglength = "";
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					cmglength = responData[0].dataresponse.response.special_cmg
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.dataPasienSelected.deptid != 16) {
						totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
						for (let i = 0; i < cmglength.length; i++) {
							const element = cmglength[i];
							if (element.type == 'Special Drug') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Procedure') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Prosthesis') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Investigation') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
						}
						totaldijamina = responData[0].dataresponse.tarif_alt[2].tarif_sd
						totaldijamin = totaldijamin + totaldijamina
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
						// 	biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
						// }

						biayanaikkelas = Number($scope.dataPasienSelected.biayanaikkelas)
						// biayanaikkelas=biayanaikkelas.toFixed(0);
						if (hakkelas == "kelas_1") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_2") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[1].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_3") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas
					}
					medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
						// ini untuk proposional kan utang penjamin per tindakan
					})
					loadData()
				})
			}
			$scope.grouper_2 = function () {
				if (dataSEPCMG == $scope.dataPasienSelected.nosep) {
					$scope.item.specialprocedure = ""
					$scope.item.specialprosthesis = ""
					$scope.item.specialinvestigation = ""
					$scope.item.specialdrug = ""
					$scope.popupCMG.center().open();
				}
				else {
					toastr.error('Pasien ini Bukan Top-up CMG Options!')
				}
				// var dt1 ={}
				// var dt2 =[]
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				// 	dt1 = {   
				// 		"metadata": {      
				// 			"method":"grouper",      
				// 			"stage":"2"   
				// 		},   
				// 		"data": {      
				// 			"nomor_sep":dataSave[i].nomor_sep ,      
				// 			"special_cmg": "ambil dari table hasil grouper 1"   
				// 		} 
				// 	} 
				// 	dt2.push(dt1)
				// }

				// var objData = {
				// 	  "data": dt2
				// 	}
				// medifirstService.savebridginginacbg(objData).then(function(e){
				// 	// simpan response ke database	
				// })
			}
			$scope.claim_final = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": '123123123123',
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.edit_claim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "reedit_claim"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.send_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "send_claim"
						},
						"data": {
							"start_dt": "",//"2016-01-07",      
							"stop_dt": "",//"2016-01-07",      
							"jenis_rawat": "",//"1",      
							"date_type": "",//"2"   
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database			
				})
			}
			$scope.send_claim_individual = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "send_claim_individual"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.claim_print = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_print"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.delete_claim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "delete_claim"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"coder_nik": '123123123123',//dataSave[i].coder_nik   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					//
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}
			$scope.delete_patient = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {

				dt1 = {
					"metadata": {
						"method": "delete_patient"
					},
					"data": {
						"nomor_rm": $scope.dataPasienSelected.noRm,
						"coder_nik": '123123123123'//dataSave[i].coder_nik   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_status = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_status"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_data"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.pull_claim2 = function () {
				var dt1 = {}
				var dt2 = []
				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "pull_claim"
					},
					"data": {
						"start_dt": moment($scope.item.periodeAwalPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"stop_dt": moment($scope.item.periodeAkhirPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"jenis_rawat": jnspelayanan//"1"   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						const fileName = "pull_claim" + "_" + tglprint + ".txt";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}
			$scope.pull_claim = function () {
				$scope.popupPull_Claim.center().open();

			}
			$scope.search_diagnosis = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_diagnosis"
						},
						"data": {
							"keyword": ""
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.search_procedures = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_procedures"
						},
						"data": {
							"keyword": ""
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}

			$scope.groupingMasal = function () {
				$scope.isRouteLoading = true;
				if (dataSave.length == 0) {
					toastr.info('Diagnosa belum di isi semua');
					return;
				}

				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "new_claim"
						},
						"data": {
							"nomor_kartu": dataSave[i].nomor_kartu,
							"nomor_sep": dataSave[i].nomor_sep,
							"nomor_rm": dataSave[i].nomor_rm,
							"nama_pasien": dataSave[i].nama_pasien,
							"tgl_lahir": dataSave[i].tgl_lahir,
							"gender": dataSave[i].gender
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				// medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function(e)
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {

						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": "75",    //"35",    
								"birth_weight": dataSave[i].birth_weight,    //"0",    
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": "0",
									"obat_kemoterapi": "0",
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": "123123123123"
							}
						}
						dt2.push(dt1)

					}

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// LoadData();	
						var dt1 = {}
						var dt2 = []

						for (var i = dataSave.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1"
								},
								"data": {
									"nomor_sep": dataSave[i].nomor_sep
								}
							}
							dt2.push(dt1)
						}



						var objData = {
							"data": dt2
						}
						medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							var proporsiPush = []
							var dijamin = "0"
							for (var i = dataSave.length - 1; i >= 0; i--) {
								for (var x = e.data.dataresponse.length - 1; x >= 0; x--) {
									if (e.data.dataresponse[x].dataresponse.metadata.code != 400) {
										if (dataSave[i].nomor_sep == e.data.dataresponse[x].datarequest.data.nomor_sep) {
											dijamin = e.data.dataresponse[x].dataresponse.response.cbg.tariff
											if (dijamin == undefined) { dijamin = "0" }
											debugger
											var dataproposi = {
												"noregistrasifk": dataSave[i].norec_pd,
												"totalDijamin": dijamin,//e.data.dataresponse[x].dataresponse.response.cbg.tariff,
												"biayaNaikkelas": "0",
												"diagnosa": dataSave[i].diagnosa,
												"tglcek": moment($scope.now).format('YYYY-MM-DD')
											}
											proporsiPush.push(dataproposi)
										}
									}
								}
							}
							var objData = {
								"data": proporsiPush
							}
							var objData2 = {
								"proporsi": proporsiPush
							}
							if (objData.data.length == 0) {
								var dt1 = {}
								var dt2 = []
								for (var i = dataSave.length - 1; i >= 0; i--) {
									dt1 = {
										"metadata": {
											"method": "delete_claim"
										},
										"data": {
											"nomor_sep": dataSave[i].nomor_sep,///$scope.dataPasienSelected.nosep,
											"coder_nik": '123123123123',//dataSave[i].coder_nik   
										}
									}
									dt2.push(dt1)
								}
								var objData = {
									"data": dt2
								}
								medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
									//
									$scope.isRouteLoading = false;
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
								})
							} else {
								// medifirstService.saveInformasiTanggungan(objData).then(function (e)
								medifirstService.post('bridging/inacbg/save-informasi-tanggungan', objData2).then(function (e) {
									debugger
									//ini untuk proposional kan utang per tindakan
									var dt1 = {}
									var dt2 = []
									for (var i = dataSave.length - 1; i >= 0; i--) {
										dt1 = {
											"metadata": {
												"method": "delete_claim"
											},
											"data": {
												"nomor_sep": dataSave[i].nomor_sep,///$scope.dataPasienSelected.nosep,
												"coder_nik": '123123123123',//dataSave[i].coder_nik   
											}
										}
										dt2.push(dt1)
									}
									var objData = {
										"data": dt2
									}
									medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
										//
										// 			
										//
										$scope.isRouteLoading = false;
										responData = e.data.dataresponse;
										toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
									})
								})
							}
							loadData()
						})
					})

				})
			}


			// END ################

		}
	]);
});