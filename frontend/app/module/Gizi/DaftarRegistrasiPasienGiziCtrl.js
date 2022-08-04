define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarRegistrasiPasienGiziCtrl', ['$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService', 'ModelItem',
		function ($state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService, ModelItem) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = false;
			$scope.isRouteLoading = false;
			$scope.cboUbahSEP = true;
			$scope.cboSep = false;
			$scope.item.jmlRows = 50
			$scope.tombolSimpanVis = true;
			loadCombo();
			loadData();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienLabRadCtrl');
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
				medifirstService.get('radiologi/get-combo-regis', false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDataJenisKelamin = data.data.jeniskelamin;
					$scope.listDokter2 = data.data.dokter;

					$scope.listGolDarah = data.data.golongandarah;
				});


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
						"field": "golongandarah",
						"title": "Gol Darah",
						"width": "85px",
						"template": '# if( golongandarah==null) {# - # } else {# #= golongandarah # #} #'
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
					// {
					// 	"field": "nosep",
					// 	"title": "No SEP",
					// 	"width":"80px",
					// 	"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'

					// },
					{
						"field": "alamatlengkap",
						"title": "Alamat",
						"width": "100px",
						"template": '# if( alamatlengkap==null) {# - # } else {# #= alamatlengkap # #} #'

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
					medifirstService.get("radiologi/get-daftar-pasien-labrad?" +
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
						//    group:[
						//    {
						//        field:"kelompokpasien", aggregates:[
						//            {field:'noregistrasi', aggregate:'count'},

						//        ]                            
						//    },                        
						// ],
						aggregate: [
							{ field: 'noregistrasi', aggregate: 'count' },
						]
					}
					// $scope.ruanganLogin=data[0].data.ruanganlogin[0];

					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasienLabRadCtrl', chacePeriode);
				});


			};



			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
					$scope.dataPasienSelected = dataPasienSelected
					$scope.noRekamMedis = dataPasienSelected.nocm;
					// $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
				}
			}

			var status = '';


			$scope.pegawai = ModelItem.getPegawai();

			$scope.transaksiPelayanan = function () {
				//  ** cek status closing
				medifirstService.get("sysadmin/general/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {
					if (rese.data.status == true) {
						toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
						$scope.isSelesaiPeriksa = true
						return
					} else {
						$scope.listRuanganApd = []
						$scope.listRuanganApd = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
						$scope.item.ruanganAntrian = $scope.listRuanganApd[0]
						$scope.popupAntrians.center().open()

					}
				})
			}
			$scope.showRincian = function () {
				medifirstService.get("radiologi/get-apd?noregistrasi="
					+ $scope.dataPasienSelected.noregistrasi
				).then(function (data) {
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
					"dokterfk": $scope.dataPasienSelected.pgid,
					"objectruangantujuanfk": $scope.item.ruanganAntrian.id,
					"objectruanganasalfk": $scope.dataPasienSelected.objectruanganlastfk,
					"tglregistrasidate": moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
				}
				medifirstService.post('radiologi/save-apd', dataKonsul).then(function (e) {
					$scope.tombolSimpanVis = true;
					var norec_apd = e.data.data.norec
					// var arrStr = {
					// 	0: $scope.dataPasienSelected.nocm,
					// 	1: $scope.dataPasienSelected.namapasien,
					// 	2: $scope.dataPasienSelected.jeniskelamin,
					// 	3: $scope.dataPasienSelected.noregistrasi,
					// 	4: $scope.dataPasienSelected.umur,
					// 	5: $scope.dataPasienSelected.objectkelasfk,
					// 	6: $scope.dataPasienSelected.namakelas,
					// 	7: $scope.dataPasienSelected.tglregistrasi,
					// 	8: norec_apd,//NOREC ANTRIAN
					// 	9: $scope.dataPasienSelected.namaruangan,
					// 	10: $scope.dataPasienSelected.objectruanganlastfk,
					// 	11: $scope.dataPasienSelected.norec,
					// 	12: "",//nor
					// 	13: $scope.dataPasienSelected.kelompokpasien,
					// 	14: $scope.dataPasienSelected.pgid,
					// 	15: $scope.item.ruanganAntrian.id,
					// 	16: $scope.item.ruanganAntrian.objectdepartemenfk,
					// 	17: $scope.dataPasienSelected.rekanan,
					// 	19: $scope.dataPasienSelected.golongandarah
					// }
					// cacheHelper.set('RincianTagihanPenunjang', arrStr);
					// $state.go('RincianTagihanPenunjang')
                    if ($scope.dataPasienSelected.noregistrasi != undefined) {
                        var obj = {
                            noRegistrasi: $scope.dataPasienSelected.noregistrasi
                        }
    
                        cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);                        
                        $state.go('DetailRegistrasi', {
                            dataPasien: JSON.stringify(obj)
                        });
                    }
				}, function (error) {
					$scope.tombolSimpanVis = true;
				})
			}
			$scope.lihatRincian = function (norec_apd) {
				// var idKelas = 0;
				// var namaKelas = '';
				// if ($scope.dataPasienSelected.objectkelasfk != 6) {
				// 	idKelas = 6;
				// 	namaKelas = "Non Kelas";
				// } else {
				// 	idKelas = $scope.dataPasienSelected.objectkelasfk;
				// 	namaKelas = $scope.dataPasienSelected.namakelas;
				// }
				// var arrStr = {
				// 	0: $scope.dataPasienSelected.nocm,
				// 	1: $scope.dataPasienSelected.namapasien,
				// 	2: $scope.dataPasienSelected.jeniskelamin,
				// 	3: $scope.dataPasienSelected.noregistrasi,
				// 	4: $scope.dataPasienSelected.umur,
				// 	5: idKelas,//$scope.dataPasienSelected.objectkelasfk,
				// 	6: namaKelas,//$scope.dataPasienSelected.namakelas,
				// 	7: $scope.dataPasienSelected.tglregistrasi,
				// 	8: norec_apd,//NOREC ANTRIAN
				// 	9: $scope.dataPasienSelected.namaruangan,
				// 	10: $scope.dataPasienSelected.objectruanganlastfk,
				// 	11: $scope.dataPasienSelected.norec,
				// 	12: "",//nor
				// 	13: $scope.dataPasienSelected.kelompokpasien,
				// 	14: $scope.dataPasienSelected.pgid,
				// 	15: $scope.item.ruanganAntrian.id,
				// 	16: $scope.item.ruanganAntrian.objectdepartemenfk,
				// 	17: $scope.dataPasienSelected.rekanan,
				// 	19: $scope.dataPasienSelected.golongandarah
				// }
				// cacheHelper.set('RincianTagihanPenunjang', arrStr);
                // $state.go('RincianTagihanPenunjang')
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);                        
                    $state.go('DetailRegistrasi', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
			}

			$scope.BatalJk = function () {
				$scope.item.JenisKelamin = {};
				$scope.item.JenisKelamin = undefined;
				$scope.popUp.close();
			}

			$scope.UbahJk = function () {

				$scope.popUp.center().open();
			}

			$scope.SimpanJk = function () {
				if ($scope.item.JenisKelamin == undefined) {
					window.messageContainer.error("Jenis Kelamin Tidak Boleh Kosong!");
					return;
				}

				var objSave = {
					norm: $scope.noRekamMedis,
					jeniskelamin: $scope.item.JenisKelamin.id
				}

				medifirstService.posst('radiologi/update-jenis-kelamin', objSave).then(function (e) {
					$scope.item.JenisKelamin = {};
					$scope.item.JenisKelamin = undefined;
					$scope.popUp.close();
					loadData();
				})
			}
			$scope.UbahGolDar = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.popUpGolDarah.center().open();
			}

			$scope.BatalGol = function () {

				$scope.item.golonganDarah = undefined
				$scope.popUpGolDarah.close();
			}

			$scope.SimpanGol = function () {
				if ($scope.item.golonganDarah == undefined) {
					window.messageContainer.error("Golongan Darah Tidak Boleh Kosong!");
					return;
				}

				var objSave = {
					norm: $scope.noRekamMedis,
					golongandarahfk: $scope.item.golonganDarah.id
				}

				medifirstService.post('radiologi/update-gol-darah', objSave).then(function (e) {

					$scope.item.golonganDarah = undefined
					$scope.popUpGolDarah.close();
					loadData();
				}, function (error) {

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

			/* END */
		}
	]);
});