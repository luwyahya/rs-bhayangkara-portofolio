define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienTidakPunyaRujukanRsCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
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
			$scope.item.jmlRows = 1000;
            $scope.item.NoRujukSdh = true;
            $scope.item.NoRujukBlm = false;
			loadCombo();
			loadData();
			// postIKTvisite()

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarPasienTidakPunyaRujukanRsCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					// if(arrPeriode[2]!= "")
					// 	$scope.item.noReg = arrPeriode[2];	
					// if(arrPeriode[3]!= "")	
					// 	$scope.item.noRm = arrPeriode[3];	
					// if(arrPeriode[4]!= "")
					// 	$scope.item.nama = arrPeriode[4];			
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					// $scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-faskes", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listjaminanKhusus = data.data.jaminankhusus;
					$scope.listDokter = data.data.dokter;
					$scope.listFaskes = data.data.faskes;
					$scope.listDokter2 = data.data.dokter;
					$scope.listRuanganBatal = data.data.ruanganall;
					$scope.listRuanganRJ = data.data.ruanganRi;
					$scope.item.PegawaiLogin = data.data.pegawaiLogin;
					// $scope.listRuanganApd = data.data.ruanganall;
					$scope.listPembatalan = data.data.pembatalan;
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[0].id, jenisdiagnosa: data.data.jenisdiagnosa[0].jenisdiagnosa };

				});
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
					//  debugger;
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
					$scope.listDataPegawai = e;
				})
				$scope.listJenis = [{ "id": 1, "name": "Hapus Semua" }, { "id": 2, "name": "Batal Rawat Inap" }]
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


			// function getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk){
			//              if (unitBpjs == "BPJS" && (unitSep==null || unitSep==undefined || unitSep=="")) {
			//                  return "red";
			//              }else if(unitBpjs=="BPJS" && unitDept=="16" && unitPpk !="0240R008"){
			//                  return "koneng";
			//              }
			//          }

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
			// $("#kGrid").kendoGrid({
			$scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarpasienTidakPunyaRujukan.xlsx",
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
				// selectable: 'row',
				dataBound: onDataBound,
				// pageable: true,
				// sortable: true,
				// resizable: true,
				selectable: 'row',
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				scrollable: false,
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "40px",
						"template": "<span class='style-left'>#: no #</span>"
					},
					{
						"field": "nmProvider",
						"title": "Nama Faskes",
						"width": "150px",
						"template": "<span class='style-center'>#: nmProvider #</span>"
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
						"field": "nobpjs",
						"title": "No BPJS",
						"width": "150px",
						"template": "<span class='style-left'>#: nobpjs #</span>"
					},
					{
						"field": "tglregistrasi",
						"title": "Tgl Registrasi",
						"width": "150px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},
					{
						"field": "namaruanganrujukan",
						"title": "Ruangan Rujuk",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruanganrujukan #</span>"
					},
					{
						"field": "namadokter",
						"title": "Nama Dokter",
						"width": "150px",
						"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
					},
					{
						"field": "nosepinap",
						"title": "No SEP Pasca Inap",
						"width": "150px",
						
						"template": "<button class=\"k-button custom-button #=nosepinap != '-' ? 'dark-green' : 'dark-red' # \" ng-click=\"pemakaianAsuransi(dataItem)\" style=\"margin:0 0 5px\">#: nosepinap #</button>",
						// "template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
					},
					{
						// "field": "nosep",
						"title": "Status No Rujukan",
						// "width": "150px",
						// "template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
                        // "title": "Resume Medis",
                        "width": "100px",
						
						"template": "<button class=\"k-button custom-button #=status != 'Belum ada' ? 'dark-green' : 'dark-red' # \" ng-click=\"cekNoRujukan(dataItem)\" style=\"margin:0 0 5px\">#: status #</button>",

                        // "template": "<button class=\"k-button custom-button\" ng-click=\"cekNoRujukan(dataItem)\" style=\"margin:0 0 5px\">Klik</button>",
					},
					{
						"field": "isdiagnosis",
						"title": "Diagnosis",
						"width": "200px",
						"template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
					},
					{
						// "field": "norujukanfromfaskes",
						"title": "Nomor Rujukan",
						"width": "150px",
						
						"template": "<button class=\"k-button custom-button #=norujukanfromfaskes != '-' ? 'dark-green' : 'dark-red' # \" ng-click=\"pemakaianAsuransi(dataItem)\" style=\"margin:0 0 5px\">#: norujukanfromfaskes #</button>",

						// "template": "<button class=\"k-button custom-button #=norujukanfromfaskes != '-' ? 'dark-green' : 'dark-red' # \" ng-click=\"pemakaianAsuransi(dataItem)\" style=\"margin:0 0 5px\">#: norujukanfromfaskes #</button>",
					},
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
			// });
			$scope.pemakaianAsuransi = function (dataItem) {
				debugger
				if (dataItem.nosepinap != '-') {
					
					var json = {
						'norec_pa': dataItem.norec_pa,
						'norujukan': dataItem.nosepinap,
						'objectruanganrujukfk': dataItem.objectruanganinaplast
					}
					medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
						if (e.status === 201) {
							medifirstService.get("registrasi/get-apd?noregistrasi="
							+ dataItem.noregistrasi
							+ "&objectruanganlastfk=" + dataItem.objectruanganlastfk
							).then(function (data) {
								// var dataAntrian = data.data.data[0];
								debugger;
								if (dataItem != undefined) {
									debugger
									$state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
										// $state.go('PemakaianAsuransi',{
										norujukan: dataItem.norujukanfromfaskes,
										norecPD: dataItem.norec,
										norecAPD: dataItem.norec_apd
									});
		
									// var arrStr = {
									// 	0: dataItem.norujukanfromfaskes
									// }
		
									// cacheHelper.set('cacheNorujukan', arrStr);
		
									var cacheSet = dataItem.objectasuransipasienfk
										+ "~" + dataItem.norec_pa
										+ "~" + dataItem.noregistrasi
										+ "~" + dataItem.norujukanfromfaskes;
		
									cacheHelper.set('CachePemakaianAsuransi', cacheSet);
								}
							})
							// ketemu = true;
							// loadData()
						}
					})
					
				} else {
					if (dataItem.norujukanfromfaskes == '-') {
						messageContainer.error("Pasien Belum Memiliki No Rujukan")
						return
					} else {
	
						medifirstService.get("registrasi/get-apd?noregistrasi="
							+ dataItem.noregistrasi
							+ "&objectruanganlastfk=" + dataItem.objectruanganlastfk
						).then(function (data) {
							// var dataAntrian = data.data.data[0];
							debugger;
							if (dataItem != undefined) {
								debugger
								$state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
									// $state.go('PemakaianAsuransi',{
									norujukan: dataItem.norujukanfromfaskes,
									norecPD: dataItem.norec,
									norecAPD: dataItem.norec_apd
								});
	
								// var arrStr = {
								// 	0: dataItem.norujukanfromfaskes
								// }
	
								// cacheHelper.set('cacheNorujukan', arrStr);
	
								var cacheSet = dataItem.objectasuransipasienfk
									+ "~" + dataItem.norec_pa
									+ "~" + dataItem.noregistrasi
									+ "~" + dataItem.norujukanfromfaskes;
	
								cacheHelper.set('CachePemakaianAsuransi', cacheSet);
							}
						})
					}
				}
			}

			$scope.cekNoRujukan = function (dataItem) {
				var ketemu = false;
				medifirstService.get("bridging/bpjs/get-rujukan-pcare-nokartu-multi?nokartu=" + dataItem.nobpjs).then(function (e) {
					if (e.data.metaData.code === "200") {
						debugger
						for (var i = 0; i < e.data.response.rujukan.length; i++) {
							if(dataItem.objectruanganlastfk == 132) {
								if(dataItem.kdinternalrujuk == e.data.response.rujukan[i].poliRujukan.kode) {
									debugger
									if(ketemu == false) {
										var tglreg = new Date(moment(dataItem.tglregistrasi).format('MM/DD/YYYY'));
										var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
										var difreg = getDifferenceInDays(tglreg, tglrujuk);

										function getDifferenceInDays(date1, date2) {
											const diffInMs = Math.abs(date2 - date1);
											return diffInMs / (1000 * 60 * 60 * 24);
										}

										if(difreg < 90) {
											var json = {
												'norec_pa': dataItem.norec_pa,
												'norujukan': e.data.response.rujukan[i].noKunjungan,
												'objectruanganrujukfk': dataItem.objectruangnrujukfk
											}
											medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
												if (e.status === 201) {
													ketemu = true;
													loadData()
												}
											})
										}
									}
								}
							} else 
							if(dataItem.kdinternal == e.data.response.rujukan[i].poliRujukan.kode) {
								if(ketemu == false) {
									var tglreg = new Date(moment(dataItem.tglregistrasi).format('MM/DD/YYYY'));
									// moment(dataItem.tglregistrasi).format('MM/DD/YYYY');
									var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
									// moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY');
									var difreg = getDifferenceInDays(tglreg, tglrujuk);

									function getDifferenceInDays(date1, date2) {
										const diffInMs = Math.abs(date2 - date1);
										return diffInMs / (1000 * 60 * 60 * 24);
									}

									if(difreg < 90) {
										var json = {
											'norec_pa': dataItem.norec_pa,
											'norujukan': e.data.response.rujukan[i].noKunjungan,
											'objectruanganrujukfk': dataItem.objectruanganlastfk
										}
										medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
											if (e.status === 201) {
												ketemu = true;
												loadData()
											}
										})
									}
								}
							}
						}
					} else {
						toastr.error(e.data.metaData.message, 'Info');
					}
					$scope.isRouteLoading = false;
				}, function (err) {
					$scope.isRouteLoading = false;
				});
				// if(ketemu == true) {
				// 	LoadData();
				// }
			}

			// var yeuh = 1;
			// var awal = 1;
			var a = 0;
			var yeuh = 1;
			var awal = 1;
			var j = 0;
			$scope.CekNoRujukanAll = function (j) {
				yeuh = j;
				awal = j;
				var lengthakhir = $scope.dataDaftarPasienPulang.options.data.length;
				var lop = true;
				var ketemu = false;
				for(; j < $scope.dataDaftarPasienPulang.options.data.length; j++) {
					// ini nanti
					// if($scope.dataDaftarPasienPulang.options.data[j].statisinaplast == true) {
					// 	yeuh = j + 1;
					// 	var ini = (yeuh / lengthakhir) * 100;
					// 	var elem = document.getElementById("myBar");
					// 	var width = 0;
					// 	awal = awal + 1;
					// 	var id = setInterval(frame, 1);
					// 	function frame() {
					// 		if (width >= ini) {
					// 			clearInterval(id);
					// 		} else {
					// 			width++;
					// 			elem.style.width = width + "%";
					// 			elem.innerHTML = width + "%";
					// 		}
					// 	}
					// 	a = a + 1;
					// 	$scope.CekNoRujukanAll(j+1)

					// 	if($scope.dataDaftarPasienPulang.options.data[j].nobpjs == undefined || $scope.dataDaftarPasienPulang.options.data[j].nobpjs == null || $scope.dataDaftarPasienPulang.options.data[j].nobpjs == "") {
					// 		yeuh = j + 1;
					// 		var ini = (yeuh / lengthakhir) * 100;
					// 		var elem = document.getElementById("myBar");
					// 		var width = 0;
					// 		awal = awal + 1;
					// 		var id = setInterval(frame, 1);
					// 		function frame() {
					// 			if (width >= ini) {
					// 				clearInterval(id);
					// 			} else {
					// 				width++;
					// 				elem.style.width = width + "%";
					// 				elem.innerHTML = width + "%";
					// 			}
					// 		}
					// 		a = a + 1;
					// 		$scope.CekNoRujukanAll(j+1)
					// 	} else {
					// 		medifirstService.get("bridging/bpjs/get-rujukan-pcare-nokartu-multi?nokartu=" + $scope.dataDaftarPasienPulang.options.data[j].nobpjs).then(function (e) {
					// 			lop = false
					// 			if (e.data.metaData == undefined) {
					// 				$scope.CekNoRujukanAll(j+1);
					// 			} else if (e.data.metaData == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
					// 				$scope.CekNoRujukanAll(j);
					// 			} else if (e.data.metaData == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
					// 				$scope.CekNoRujukanAll(j);
					// 			} else if (e.data.metaData.code == 500) {
					// 				$scope.CekNoRujukanAll(j);
					// 			} else {
					// 				$scope.CekNoRujukanAll(j+1)
					// 			}
					// 			if (e.data.metaData.code === "200") {
					// 				for (var i = 0; i < e.data.response.rujukan.length; i++) {
					// 					if($scope.dataDaftarPasienPulang.options.data[j].objectruanganlastfk == 132) {
					// 						if($scope.dataDaftarPasienPulang.options.data[j].kdinternalrujuk == e.data.response.rujukan[i].poliRujukan.kode) {
					// 							if(ketemu == false) {
					// 								var tglreg = new Date(moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY'));
					// 								var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
					// 								var difreg = getDifferenceInDays(tglreg, tglrujuk);
			
					// 								function getDifferenceInDays(date1, date2) {
					// 									const diffInMs = Math.abs(date2 - date1);
					// 									return diffInMs / (1000 * 60 * 60 * 24);
					// 								}
			
					// 								if(difreg < 90) {
					// 									var json = {
					// 										'norec_pa': $scope.dataDaftarPasienPulang.options.data[j].norec_pa,
					// 										'norujukan': e.data.response.rujukan[i].noKunjungan,
					// 										'objectruanganrujukfk': $scope.dataDaftarPasienPulang.options.data[j].objectruangnrujukfk
					// 									}
					// 									medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
					// 										if (e.status === 201) {
					// 											ketemu = true;
					// 											// loadData()
					// 										}
					// 									})
					// 								}
					// 							}
					// 						}
					// 					} else 
					// 					if($scope.dataDaftarPasienPulang.options.data[j].kdinternal == e.data.response.rujukan[i].poliRujukan.kode) {
					// 						if(ketemu == false) {
					// 							var tglreg = new Date(moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY'));
					// 							// moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY');
					// 							var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
					// 							// moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY');
					// 							var difreg = getDifferenceInDays(tglreg, tglrujuk);
			
					// 							function getDifferenceInDays(date1, date2) {
					// 								const diffInMs = Math.abs(date2 - date1);
					// 								return diffInMs / (1000 * 60 * 60 * 24);
					// 							}
			
					// 							if(difreg < 90) {
					// 								var json = {
					// 									'norec_pa': $scope.dataDaftarPasienPulang.options.data[j].norec_pa,
					// 									'norujukan': e.data.response.rujukan[i].noKunjungan,
					// 									'objectruanganrujukfk': $scope.dataDaftarPasienPulang.options.data[j].objectruanganlastfk
					// 								}
					// 								medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
					// 									if (e.status === 201) {
					// 										ketemu = true;
					// 										// loadData()
					// 									}
					// 								})
					// 							}
					// 						}
					// 					}
					// 				}
					// 			} else {
					// 				toastr.error(e.data.metaData.message, 'Info');
					// 			}
								
					// 			$scope.isRouteLoading = false;
					// 			yeuh = j + 1;
					// 			var ini = (yeuh / lengthakhir) * 100;
					// 			var elem = document.getElementById("myBar");
					// 			var width = 0;
					// 			awal = awal + 1;
					// 			var id = setInterval(frame, 1);
					// 			function frame() {
					// 				if (width >= ini) {
					// 					clearInterval(id);
					// 				} else {
					// 					width++;
					// 					elem.style.width = width + "%";
					// 					elem.innerHTML = width + "%";
					// 				}
					// 			}
					// 			a = a + 1
					// 		}, function (err) {
					// 			$scope.isRouteLoading = false;
					// 		});
					// 	}
					// } else {
					// }
					if($scope.dataDaftarPasienPulang.options.data[j].statusinaplast == true) {
						
						var json = {
							'norec_pa': $scope.dataDaftarPasienPulang.options.data[j].norec_pa,
							'norujukan': e.data.response.rujukan[i].nosepinap,
							// 'objectruanganrujukfk': dataItem.objectruanganinaplast
							'objectruanganrujukfk': $scope.dataDaftarPasienPulang.options.data[j].objectruanganinaplast
						}
						medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
							if (e.status === 201) {
								// ketemu = true;
								// loadData()yeuh = j + 1;
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
								a = a + 1;
								$scope.CekNoRujukanAll(j+1)
							}
						})
						
					} else {
						if($scope.dataDaftarPasienPulang.options.data[j].nobpjs == undefined || $scope.dataDaftarPasienPulang.options.data[j].nobpjs == null || $scope.dataDaftarPasienPulang.options.data[j].nobpjs == "") {
							yeuh = j + 1;
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
							a = a + 1;
							$scope.CekNoRujukanAll(j+1)
						} else {
							medifirstService.get("bridging/bpjs/get-rujukan-pcare-nokartu-multi?nokartu=" + $scope.dataDaftarPasienPulang.options.data[j].nobpjs).then(function (e) {
								lop = false
								if (e.data.metaData == undefined) {
									$scope.CekNoRujukanAll(j+1);
								} else if (e.data.metaData == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
									$scope.CekNoRujukanAll(j);
								} else if (e.data.metaData == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
									$scope.CekNoRujukanAll(j);
								} else if (e.data.metaData.code == 500) {
									$scope.CekNoRujukanAll(j);
								} else {
									$scope.CekNoRujukanAll(j+1)
								}
								if (e.data.metaData.code === "200") {
									for (var i = 0; i < e.data.response.rujukan.length; i++) {
										if($scope.dataDaftarPasienPulang.options.data[j].objectruanganlastfk == 132) {
											if($scope.dataDaftarPasienPulang.options.data[j].kdinternalrujuk == e.data.response.rujukan[i].poliRujukan.kode) {
												if(ketemu == false) {
													var tglreg = new Date(moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY'));
													var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
													var difreg = getDifferenceInDays(tglreg, tglrujuk);
			
													function getDifferenceInDays(date1, date2) {
														const diffInMs = Math.abs(date2 - date1);
														return diffInMs / (1000 * 60 * 60 * 24);
													}
			
													if(difreg < 90) {
														var json = {
															'norec_pa': $scope.dataDaftarPasienPulang.options.data[j].norec_pa,
															'norujukan': e.data.response.rujukan[i].noKunjungan,
															'objectruanganrujukfk': $scope.dataDaftarPasienPulang.options.data[j].objectruangnrujukfk
														}
														medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
															if (e.status === 201) {
																ketemu = true;
																// loadData()
															}
														})
													}
												}
											}
										} else 
										if($scope.dataDaftarPasienPulang.options.data[j].kdinternal == e.data.response.rujukan[i].poliRujukan.kode) {
											if(ketemu == false) {
												var tglreg = new Date(moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY'));
												// moment($scope.dataDaftarPasienPulang.options.data[j].tglregistrasi).format('MM/DD/YYYY');
												var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
												// moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY');
												var difreg = getDifferenceInDays(tglreg, tglrujuk);
			
												function getDifferenceInDays(date1, date2) {
													const diffInMs = Math.abs(date2 - date1);
													return diffInMs / (1000 * 60 * 60 * 24);
												}
			
												if(difreg < 90) {
													var json = {
														'norec_pa': $scope.dataDaftarPasienPulang.options.data[j].norec_pa,
														'norujukan': e.data.response.rujukan[i].noKunjungan,
														'objectruanganrujukfk': $scope.dataDaftarPasienPulang.options.data[j].objectruanganlastfk
													}
													medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
														if (e.status === 201) {
															ketemu = true;
															// loadData()
														}
													})
												}
											}
										}
									}
								} else {
									toastr.error(e.data.metaData.message, 'Info');
									// lop = false
									// $scope.CekNoRujukanAll(j+1)
									// yeuh = yeuh + 1;
									// var ini = (yeuh / lengthakhir) * 100;
									// var elem = document.getElementById("myBar");
									// var width = 0;
									// awal = awal + 1;
									// var id = setInterval(frame, 1);
									// function frame() {
									// 	if (width >= ini) {
									// 		clearInterval(id);
									// 	} else {
									// 		width++;
									// 		elem.style.width = width + "%";
									// 		elem.innerHTML = width + "%";
									// 	}
									// }
									// a = a + 1
								}
								
								$scope.isRouteLoading = false;
								yeuh = j + 1;
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
							}, function (err) {
								$scope.isRouteLoading = false;
							});
						}
					}
					if (lop == true) {
						if((lengthakhir) == j-1) {
							debugger
							loadData();
							break;
						} else {
							break;
						}
					}

					// if((lengthakhir-1) == j) {
					// 	debugger
					// 	loadData();
					// }
				}
			}

			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				debugger
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}

				var NoRujukSdh = ""
				if ($scope.item.NoRujukSdh != undefined) {
					var NoRujukSdh = "&NoRujukSdh=" + $scope.item.NoRujukSdh
				}
				
				var NoRujukBlm = ""
				if ($scope.item.NoRujukBlm != undefined) {
					var NoRujukBlm = "&NoRujukBlm=" + $scope.item.NoRujukBlm
				}

				var faskes = ""
				if ($scope.item.nmProvider != undefined) {
					var faskes = "&faskes=" + $scope.item.nmProvider.kdProvider
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
				var jaminankhusus = ""
				if ($scope.item.jaminankhusus != undefined) {
					var jaminankhusus = "&jaminankhusus=" + $scope.item.jaminankhusus.namaexternal
				}


				$q.all([
					medifirstService.get("registrasi/daftar-registrasi/get-daftar-pasien-non-rujukan?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows + faskes + NoRujukSdh + NoRujukBlm +
						isBlmInputSep + isSepTdkSesuai + blmInputDiag + jaminankhusus),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.length; i++) {
						data[0].data[i].no = i + 1
						var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
						data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr';

						if (data[0].data[i].istelemedicine == '1') {
							data[0].data[i].kelompokpasien = 'Telemedicine'
						}
					}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 1000,
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
					cacheHelper.set('DaftarPasienTidakPunyaRujukanRsCtrl', chacePeriode);
				});

			};
			$scope.rekamMedisElektronik = function () {


				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Dahulu Pasien!")
					return
				}
				medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
					+ $scope.dataPasienSelected.noregistrasi
					+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
				).then(function (data) {




					// debugger;
					var arrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.kelompokpasien,
						6: $scope.dataPasienSelected.tglregistrasi,
						7: data.data.ruangan[0].norec_apd,
						8: $scope.dataPasienSelected.norec,
						9: $scope.dataPasienSelected.objectkelasfk,
						10: $scope.dataPasienSelected.namakelas,
						11: $scope.dataPasienSelected.objectruanganlastfk,
						12: $scope.dataPasienSelected.namaruangan + '`'
					}
					cacheHelper.set('cacheRMelektronik', arrStr);
					$state.go('RekamMedis.VitalSign', {
						noRec: data.data.ruangan[0].norec_apd
					})
				})
			}
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

			// var onDataBound = function (e) {
			//              var columns = e.sender.columns;
			//              var rows = e.sender.tbody.children();

			//              for (var j = 0; j < rows.length; j++) {
			//                // sisa sekarang
			//                var row = $(rows[j]);
			//                var dataItem = e.sender.dataItem(row);

			//                var unitBpjs = dataItem.get("kelompokpasien");
			//                var unitDept = dataItem.get("deptid");
			//                var unitPpk = dataItem.get("ppkrujukan");
			//                var unitSep = dataItem.get("nosep");
			//                var cellSEP= row.children().eq(12);       
			//                cellSEP.addClass(getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk));

			//              }
			//            }
			$scope.UbahDokter = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');

					return
				}
				$scope.popupDokter.center().open();
				// $scope.cboDokter = true
				// $scope.cboUbahDokter=false
				// $scope.cboUbahSEP=false
			}
			$scope.EditSEP = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";

				if ($scope.dataPasienSelected.norec == null) {
					messageContainer.error("Pasien Belum Dipilih!!")
					return;
				}
				if ($scope.dataPasienSelected.kelompokpasien == "Umum/Pribadi") {
					messageContainer.error("Tipe Pasien Umum!!")
					return;
				}
				if ($scope.dataPasienSelected.norec_pa == null) {
					messageContainer.error("Pemakaian Asuransi tidak ada")
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
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboSep = false
				$scope.cboUbahDokter = true
				$scope.cboUbahSEP = true
			}
			$scope.PasienPulang = function () {
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				$scope.cbopasienpulang = true
				$scope.cboUbahDokter = false
				if ($scope.dataPasienSelected.tglpulang != null) {
					$scope.item.tanggalPulang = $scope.dataPasienSelected.tglpulang
				} else {
					$scope.item.tanggalPulang = tglpulang
				}
			}
			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}
			//debugger
			$scope.simpantglpulang = function () {
				//debugger
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				var updateTanggal = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"tglpulang": tglpulang
				}
				medifirstService.post('registrasi/daftar-registrasi/update-tgl-pulang', updateTanggal).then(function (e) {
					loadData();
				})
				$scope.cbopasienpulang = false;
				$scope.cboUbahDokter = true;
			}
			$scope.kartupasien = function () {

				if ($scope.dataPasienSelected != undefined) {

					//##save identifikasi kartu pasien
					medifirstService.get("registrasi/identifikasi-kartu-pasien?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end 

					// var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
					// window.open(fixUrlLaporan, '', 'width=800,height=600')

					//cetakan langsung service VB 6 by grh   
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.dataPasienSelected.nocmfk + '&view=false', function (response) {
						// do something with response
					});
				}
			}
			$scope.simpanSep = function () {
				if ($scope.dataPasienSelected.kelompokpasien == "BPJS") {
					var updateSep = {
						"norec": $scope.dataPasienSelected.norec,
						"nokepesertaan": $scope.item.noPeserta,
						"nosep": $scope.item.noSep
					}
				} else {
					var updateSep = {
						"norec": $scope.dataPasienSelected.norec,
						"nokepesertaan": $scope.item.noPeserta,
						"nosep": null
					}
				}

				medifirstService.post('registrasi/daftar-registrasi/update-nosep', updateSep).then(function (e) {
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
				medifirstService.get("sysadmin/logging/save-log-all?jenislog="
					+ jenisLog + "&referensi=" + referensi
					+ "&noreff=" + $scope.dataPasienSelected.norec_pa
					+ "&keterangan=" + keterangan
				).then(function (data) {
					$scope.item.noPeserta = "";
					$scope.item.noSep = "";
				})
			}
			$scope.batalSep = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";
				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
					// $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
				}
			}
			$scope.simpan = function () {
				var objSave =
				{
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id,
					objectruanganlastfk: $scope.dataPasienSelected.objectruanganlastfk
				}
				medifirstService.post('registrasi/daftar-registrasi/update-dokter', objSave).then(function (e) {
					$scope.popupDokter.close();
					loadData();

					$scope.cboDokter = false
					$scope.cboSep = false
					$scope.cboUbahDokter = true
					$scope.cboUbahSEP = true
				})
			}
			$scope.Detail = function () {
				if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
					// window.messageContainer.error('Pasien Sudah Batal');
					alert("Pasien Sudah Batal!!!")
					return;
				}

				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					// var objSave = {
					// 	noregistrasi: $scope.dataPasienSelected.noregistrasi
					// }
					// manageTataRekening.postJurnalAkuntansi(objSave).then(function (data) {

					// });
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
			$scope.rekapTagihan = function () {

				if ($scope.dataPasienSelected.noregistrasi != undefined) {

					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RekapTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.DaftarRuangan = function () {
				if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
					// window.messageContainer.error('Pasien Sudah Batal');
					alert("Pasien Sudah Batal!!!")
					return;
				}

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

			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			$scope.labelpasien = function () {
				// if($scope.item != undefined){
				//     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
				//     window.open(fixUrlLaporan, '', 'width=800,height=600')
				// }
				$scope.dats = {
					qty: 0
				}
				$scope.dialogCetakLabel.center().open();
			}

			$scope.pilihQty = function (data) {
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {
					var qty = data.qty;
					var qtyhasil = data.qty * 2;
					if (qty !== undefined) {
						// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
						// window.open(fixUrlLaporan, '', 'width=800,height=600')
						//cetakan langsung service VB6 by grh

						//##save identifikasi label pasien
						medifirstService.get("registrasi/identifikasi-label?norec_pd="
							+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil
						).then(function (data) {
							var datas = data.data;
						})
						//##end

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
							// do something with response
						});

					}
					$scope.dialogCetakLabel.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			};

			$scope.SummaryList = function () {
				if ($scope.dataPasienSelected.nocm != undefined) {
					// var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + $scope.item.pasien.noCm + "&tglRegistrasi=" + new moment($scope.item.pasienDaftar.tglRegistrasi).format('DD-MM-YYYY'));
					// window.open(fixUrlLaporan, '', 'width=800,height=600')

					//##save identifikasi summary list
					medifirstService.get("registrasi/identifikasi-sum-list?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})

					//cetakan langsung service VB6 by grh    
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.dataPasienSelected.nocm + '&view=false', function (response) {
						// do something with response
					});


				}
			}

			$scope.GelangPasien = function () {
				$scope.popUpGelang.center().open();
			}


			$scope.columnGrid = {
				columns: [
					{
						"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						template: "# if (statCheckbox) { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							"# } else { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							"# } #",
						width: "30px"
					},
					{
						"field": "no",
						"title": "No",
						"width": "30px",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "tglpelayanan",
						"title": "Tgl Pelayanan",
						"width": "90px",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "ruangan",
						"title": "Ruangan",
						"width": "120px",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "namaproduk",
						"title": "Layanan",
						"width": "160px",
						"template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "dokter",
						"title": "Dokter Pemeriksa",
						"width": "140px",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "dokterpengirim",
						"title": "Dokter Pengririm",
						"width": "140px",
						attributes: {
							class: "#=flag != 'N' ? 'red' : 'green' #"
						},
					},
					{
						"field": "jumlah",
						"title": "Qty",
						"width": "40px",
					},
					{
						"field": "hargasatuan",
						"title": "Harga Satuan",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
					},
					{
						"field": "hargadiscount",
						"title": "Diskon",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
						// footerTemplate: "<span class='style-center'>Total</span>",
					},
					{
						"field": "jasa",
						"title": "Jasa Cito",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
						footerTemplate: "<span class='style-center'>Total</span>",
					},
					{
						"field": "total",
						"title": "Total",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
						aggregates: ["sum"],
						groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
						footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
					},
					{
						"field": "noorder",
						"title": "No Order",
						"width": "100px",
					},
					{
						"field": "nostruk",
						"title": "No Struk",
						"width": "80px"
					},
					{
						"field": "statusbridging",
						"title": "Status Kirim",
						"width": "50px",
					},
					{
						"field": "statusperiksa",
						"title": "Status Periksa",
						"width": "100px",

					},
					{
						"field": "statuscito",
						"title": "Status Cito",
						"width": "100px",
					},
					{
						"field": "nofoto",
						"title": "No Foto",
						"width": "100px",
					}

				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
			}

		}
	]);
});