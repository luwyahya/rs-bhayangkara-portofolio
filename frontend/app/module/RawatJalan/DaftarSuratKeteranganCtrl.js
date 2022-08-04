define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarSuratKeteranganCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService', '$window',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService, $window) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.popUpSurat = {};
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
			// loadData();
			loadDataSurat();

			medifirstService.get("rawatjalan/get-combo-surat").then(function (data) {
				$scope.listSurat = data.data.jenisSurat;
				$scope.listPegawai = data.data.listPegawai;
			});

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
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
					$scope.username = data.data.pegawaiLogin;
					$scope.userID = data.data.datalogin.userData.id;
					$scope.listRuanganBatal = data.data.ruanganall;
					// $scope.listRuanganApd = data.data.ruanganall;
					$scope.listDataJenisKelamin = data.data.jeniskelamin;
					$scope.listPembatalan = data.data.pembatalan;
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[1].id, jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa };

				});
				// medifirstService.get("lab-radiologi/get-data-combo-labrad", true).then(function (data) {
				// 	$scope.listGolDarah = data.data.golongandarah;
				// });
				// modelItemAkuntansi.getDataDummyPHP("operator/get-data-diagnosa", true, true, 10).then(function(data) {
				//                  // debugger;
				//                  $scope.sourceDiagnosisPrimer= data;
				//             });			
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMMM-YYYY HH:mm');
			}
			$scope.formatTanggalLahir = function (tanggal) {
				return moment(tanggal).format('DD-MMMM-YYYY');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}


			$scope.columnDaftarSurat = {
				columns: [

					{
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
						"field": "noCm",
						"title": "NoRM",
						"width": "70px",
						"template": "<span class='style-center'>#: nocm #</span>"
					},
					{
						"field": "namapasien",
						"title": "Nama Pasien",
						"width": "120px",
						"template": "<span class='style-left'>#: namapasien #</span>"
					},
					{
						"field": "jeniskelamin",
						"title": "Jenis Kelamin",
						"width": "85px",
						"template": "<span class='style-left'>#: jeniskelamin #</span>"
					},
					{
						"field": "tgllahir",
						"title": "Tanggal Lahir",
						"width": "80px",
						"template": "<span class='style-left'>{{formatTanggalLahir('#: tgllahir #')}}</span>"
					},

					{
						"field": "namadokter",
						"title": "Nama Dokter",
						"width": "120px",
						// "template": "<span class='style-left'>#: namadokter #</span>"
						"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'

					},
					{
						"field": "namapegawai",
						"title": "Nama Pegawai",
						"width": "85px",
						"template": '# if( namapegawai==null) {# - # } else {# #= namapegawai # #} #'

					},
					{
						"field": "namasurat",
						"title": "Jenis Surat",
						"width": "85px",
						"template": "<span class='style-left'>#: namasurat #</span>"
					},
					{
						"field": "nosurat",
						"title": "No Surat",
						"width": "130px",
						"template": "<span class='style-left'>#: nosurat #</span>"
					},

					{
						"field": "alamatlengkap",
						"title": "Alamat",
						"width": "100px",
						"template": '# if( alamatlengkap==null) {# - # } else {# #= alamatlengkap # #} #'

					},
					{
						"field": "keterangan",
						"title": "Keterangan",
						"width": "100px",
						"template": '# if( keterangan==null) {# - # } else {# #= keterangan # #} #'

					},
					{
						"command": [{
							text: "Edit",
							click: editData,
							imageClass: "k-icon k-i-pencil"
						},
						{
							text: "Hapus",
							click: hapusData,
							imageClass: "k-icon k-delete"
						}],
						title: "",
						width: "120px",
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

			$scope.Tambah = function () {
				$scope.popUpS.center().open();

			}

			$scope.tutup = function () {
				$scope.Clear()
				$scope.popUpS.close();

			}

			$scope.Clear = function () {
				$scope.popUpSurat = {}
				// $scope.popUpS = {}

			}

			function editData(e) {
				e.preventDefault();
				$scope.currentListAM = []
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("rawatjalan/get-daftar-surat?norec=" + dataItem.norec).then(function (e) {

				})
				// cariPasien()

				$scope.popUpSurat.noRegistrasi = dataItem.noregistrasi
				$scope.CariNoreg()

				$scope.popUpSurat.norec = dataItem.norec
				$scope.popUpSurat.namapeg = dataItem.user
				$scope.popUpSurat.ket = dataItem.keterangan
				$scope.popUpSurat.tglSurat = dataItem.tglsurat
				$scope.popUpSurat.dokter = { id: dataItem.dokterfk, namalengkap: dataItem.namadokter }
				$scope.popUpSurat.surat = { id: dataItem.jenissuratfk, name: dataItem.namasurat }

				$scope.popUpS.center().open();
				// $scope.popUp.norec = dataItem.norec
				// $scope.popUp.pendidikan =dataItem.pendidikan
				// $scope.popUp.jenispend ={id: dataItem.objectjenispendidikanfk ,jenispendidikan: dataItem.jenispendidikan}


			}
			// function editData(e) {
			//     e.preventDefault();
			//     $scope.currentListAM=[]
			//     var grid = this;
			//     var row = $(e.currentTarget).closest("tr");
			//     var tr = $(e.target).closest("tr");
			//     var dataItem = this.dataItem(tr);
			//     medifirstService.get("pasien/get-daftar-surat?norec=" + dataItem.norec).then(function (e) {

			//     })
			//     // cariPasien()

			//     $scope.item.noRegistrasi = dataItem.noregistrasi
			//     $scope.CariNoreg()

			//     $scope.item.norec = dataItem.norec
			//     $scope.item.namapeg = dataItem.user
			//     $scope.item.ket = dataItem.keterangan
			//     $scope.item.tglSurat = dataItem.tglsurat
			//     $scope.item.dokter = {id: dataItem.dokterfk ,namalengkap: dataItem.namadokter}
			//     $scope.item.surat ={id: dataItem.jenissuratfk ,name: dataItem.namasurat}

			//     $scope.popUpS.center().open();
			//     // $scope.popUp.norec = dataItem.norec
			//     // $scope.popUp.pendidikan =dataItem.pendidikan
			//     // $scope.popUp.jenispend ={id: dataItem.objectjenispendidikanfk ,jenispendidikan: dataItem.jenispendidikan}


			// }
			function hapusData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"norec": dataItem.norec
				}

				medifirstService.post('pasien/delete-daftar-surat', itemDelete).then(function (e) {
					if (e.status === 201) {
						loadDataSurat();
						grid.removeRow(row);
					}
				})

			}
			$scope.SearchData = function () {
				loadDataSurat()
			}

			// $scope.CariNoreg = function(){
			// 	if ($scope.item.noRegistrasi == '' ){
			// 		return;
			// 	}
			// 	if ($scope.item.noRegistrasi == '0' ){
			// 		return;
			// 	}
			// 	if ($scope.item.noRegistrasi == undefined ){
			// 		return;
			// 	}
			// 	$scope.isRouteLoading=true;

			// 	cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.item.noRegistrasi)
			// //add Akomodasi

			// medifirstService.get("pasien/get-detail-pasien-surat?noregistrasi="+ $scope.item.noRegistrasi)
			//                  .then(function (e) {
			//                  $scope.item.pasNorec=e.data[0].norec_pd
			// 		$scope.item.nocmfk = e.data[0].nocmfk
			//                  $scope.item.noCm = e.data[0].noCm
			//                  $scope.item.namaPasien = e.data[0].namaPasien
			//                  $scope.item.jenisKelamin = e.data[0].jenisKelamin
			//                  $scope.item.tglMasuk = e.data[0].tglMasuk
			//                  $scope.item.tglPulang = e.data[0].tglPulang
			//                  $scope.item.lastRuangan = e.data[0].lastRuangan
			//                  $scope.item.kelasRawat = e.data[0].kelasRawat
			//                  $scope.item.tgllahir = e.data[0].tgllahir
			//                  $scope.item.jenisPasien = e.data[0].jenisPasien
			//                  $scope.item.StatusPasien = e.data[0].StatusPasien
			//                  $scope.item.namaPenjamin = e.data[0].namaPenjamin
			//                  // $scope.item.Noverifikasi = e.data[0].Noverifikasi
			//                  $scope.item.alamatlengkap = e.data[0].alamatlengkap
			//                  $scope.item.pendidikan = e.data[0].pendidikan
			//                  $scope.item.pekerjaan = e.data[0].pekerjaan
			//                  $scope.isRouteLoading = false;	
			// 	});
			//          }

			$scope.CariNoreg = function () {
				if ($scope.popUpSurat.noRegistrasi == '') {
					return;
				}
				if ($scope.popUpSurat.noRegistrasi == '0') {
					return;
				}
				if ($scope.popUpSurat.noRegistrasi == undefined) {
					return;
				}
				$scope.isRouteLoading = true;

				cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.popUpSurat.noRegistrasi)
				//add Akomodasi

				medifirstService.get("rawatjalan/get-detail-pasien-surat?noregistrasi=" + $scope.popUpSurat.noRegistrasi)
					.then(function (e) {
						$scope.popUpSurat.pasNorec = e.data[0].norec_pd
						$scope.popUpSurat.nocmfk = e.data[0].nocmfk
						$scope.popUpSurat.noCm = e.data[0].noCm
						$scope.popUpSurat.namaPasien = e.data[0].namaPasien
						$scope.popUpSurat.jenisKelamin = e.data[0].jenisKelamin
						$scope.popUpSurat.tglMasuk = e.data[0].tglMasuk
						$scope.popUpSurat.tglPulang = e.data[0].tglPulang
						$scope.popUpSurat.lastRuangan = e.data[0].lastRuangan
						$scope.popUpSurat.kelasRawat = e.data[0].kelasRawat
						$scope.popUpSurat.tgllahir = e.data[0].tgllahir
						$scope.popUpSurat.jenisPasien = e.data[0].jenisPasien
						$scope.popUpSurat.StatusPasien = e.data[0].StatusPasien
						$scope.popUpSurat.namaPenjamin = e.data[0].namaPenjamin
						$scope.popUpSurat.tglSurat = e.data[0].tglMasuk
						// $scope.item.Noverifikasi = e.data[0].Noverifikasi
						$scope.popUpSurat.alamatlengkap = e.data[0].alamatlengkap
						$scope.popUpSurat.pendidikan = e.data[0].pendidikan
						$scope.popUpSurat.pekerjaan = e.data[0].pekerjaan
						$scope.isRouteLoading = false;
					});
			}




			$scope.SearchEnter = function () {
				CariNoreg()
				// Clear()
			}

			function loadDataSurat() {
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

				// var tglLahirs =""
				//             if ($scope.item.tglLahir != undefined){
				//                  tglLahirs ="tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
				//             }

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
					medifirstService.get("rawatjalan/get-daftar-surat?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir + reg +
						rm + nm + dk
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
					$scope.dataDaftarSurat = {
						data: result.data,
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
						}
						// ,
						//    group:[
						//    {
						//        field:"kelompokpasien", aggregates:[
						//            {field:'noregistrasi', aggregate:'count'},

						//        ]                            
						//    },                        
						// ],
						// aggregate:[
						//     {field:'noregistrasi', aggregate:'count'}, 
						// ] 
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

			// $scope.generateSKDP = function (data) {
			//           if (data === true) {
			//               medifirstService.get("pasien/generate-nosurat?jenissuratfk=",$scope.popUpSurat.surat.id).then(function (dat) {
			//                   var noSKDP = dat.data.noskdp
			//                   if (noSKDP != undefined)
			//                       $scope.model.skdp =noSKDP

			//               })
			//           } else {
			//               delete $scope.model.skdp
			//           }
			//       };



			$scope.pegawai = ModelItem.getPegawai();





			$scope.save = function () {

				var nR = ""
				if ($scope.popUpSurat.norec != undefined) {
					nR = $scope.popUpSurat.norec
				}

				if ($scope.popUpSurat.surat == undefined) {
					toastr.error('Jenis Surat harus di isi')
					return
				}

				if ($scope.popUpSurat.dokter == undefined) {
					toastr.error('Dokter harus di isi')
					return
				}

				// if ($scope.popUpSurat.tglSurat == undefined) {
				//     toastr.error('Tanggal surat harus di isi')
				//     return
				// }



				var objSave = {
					'norec': nR,
					'pasiendaftarfk': $scope.popUpSurat.pasNorec,
					'namapegID': $scope.userID,
					'dokterID': $scope.popUpSurat.dokter.id,
					'jenissuratID': $scope.popUpSurat.surat.id,
					// 'nosurat':$scope.model.skdp,
					// "namadistribusi": $scope.popUp.namadistribusi,
					// "penilaianwaktufk": $scope.popUp.penilaian.id,
					// "pegawaifk": $scope.popUp.namapeg.id,
					"keterangan": $scope.popUpSurat.ket,
					"tglsurat": moment($scope.popUpSurat.tglSurat).format('YYYY-MM-DD HH:mm'),


				}
				medifirstService.post('rawatjalan/save-daftar-surat', objSave).then(function (e) {
					loadDataSurat();
					// $scope.currentListMakan=[];
					// $scope.popUp = {};
					// $scope.popUp.close();
					$scope.tutup();

				})


			}




			/* END */
		}
	]);
});