define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienForensikDanMedikolegalCtrl', ['$q', '$rootScope', '$scope', 'CacheHelper', '$state', 'DateHelper', 'MedifirstService',
		function ($q, $rootScope, $scope, cacheHelper, $state, DateHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.item = {};
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item.caritglawal = moment(new Date()).format('YYYY-MM-DD 00:00');
			$scope.item.caritglakhir = moment(new Date()).format('YYYY-MM-DD 23:59');
			FormLoad();

			function FormLoad() {				
				var chacePeriode = cacheHelper.get('DaftarPasienForensikDanMedikolegalCtrlCache');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split('~');
					$scope.item.caritglawal = new Date(arrPeriode[0]);
					$scope.item.caritglakhir = new Date(arrPeriode[1]);
				} else {
					$scope.item.caritglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.caritglakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
					// $scope.item.tglpulang = $scope.now;					
				}

				$scope.listPermohonanTindakan = [
					{
						"id" : 1,
						"permohonan" : "Meminta"
					},
					{
						"id" : 2,
						"permohonan" : "Menolak"
					}
				]

				medifirstService.get('sysadmin/general/get-combo-pegawai?', true, 10).then(function (e) {                        
					$scope.listDataPegawaiPenjawab = e;					
				})    

				medifirstService.get("jenazah/get-data-for-combo", true).then(function (dat) {
					$scope.listRuangan = dat.data.ruanganjenazah;
					$scope.listhubungankeluarga = dat.data.hubunganKeluarga;
					$scope.item.caridatajenazahbyruangan = { id: dat.data.ruanganjenazah[0].id, namaruangan: dat.data.ruanganjenazah[0].namaruangan }
					loadData();
				})
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var noCm = "";
				var nama = "";
				var noRegis = "";
				var idRuangan = "";

				if ($scope.item.caridatajenazahbynocm != undefined) {
					noCm = "&noCm=" + $scope.item.caridatajenazahbynocm;
				}

				if ($scope.item.caridatajenazahbyNoRegis != undefined) {
					noRegis = "&noRegis=" + $scope.item.caridatajenazahbyNoRegis;
				}

				if ($scope.item.caridatajenazahbynama != undefined) {
					nama = "&namaPasien=" + $scope.item.caridatajenazahbynama;
				}

				if ($scope.item.caridatajenazahbyruangan != undefined) {
					idRuangan = "&idRuangan=" + $scope.item.caridatajenazahbyruangan.id;
				}

				var tglAwal = "";
				if ($scope.item.caritglawal != undefined) {
					tglAwal = moment($scope.item.caritglawal).format('YYYY-MM-DD HH:mm:ss');
				}

				var tglAkhir = "";
				if ($scope.item.caritglawal != undefined) {
					tglAkhir = moment($scope.item.caritglakhir).format('YYYY-MM-DD HH:mm:ss');
				}


				var i = 0;
				medifirstService.get("jenazah/get-data-pasien-forensikMedikolegal?" + noCm + noRegis + nama
					+ idRuangan + "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir).then(function (dat) {
						$scope.isRouteLoading = false;
						$scope.listDataJenazah = dat.data.data;
						if ($scope.listDataJenazah != undefined) {
							for (i = 0; i < $scope.listDataJenazah.length; i++) {
								$scope.listDataJenazah[i].no = i + 1;
								var tanggal = $scope.now;
								var tanggalLahir = new Date($scope.listDataJenazah[i].tgllahir);
								var umur = DateHelper.CountAge(tanggalLahir, tanggal);
								$scope.listDataJenazah[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
								if ($scope.listDataJenazah[i].norec_pj != undefined) {
									$scope.listDataJenazah[i].status = "Sudah Diambil"
								}else{
									$scope.listDataJenazah[i].status = "Belum Diambil"
								}
							}
							$scope.dataSource = new kendo.data.DataSource({
								pageSize: 10,
								data: $scope.listDataJenazah,
								autoSync: true
							});
						}
						var chacePeriode = tglAwal + "~" + tglAkhir;
						cacheHelper.set('DaftarPasienForensikDanMedikolegalCtrlCache', chacePeriode);
					});
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.columnDataJenazah = [
				{
					"field": "no",
					"title": "No",
					"width": "50px",					
				},
				{
					"field": "tglmeninggal",
					"title": "Tgl Meninggal",
					"width": "130px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"
				},
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
					"field": "namapasien",
					"title": "Nama Pasien",
					"width": "200px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "tgllahir",
					"title": "Tgl Lahir",
					"width": "130px",
					"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
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
				// {
				// 	"field": "namaruangan2",
				// 	"title": "Ruangan Asal",
				// 	"width": "150px",
				// 	"template": "<span class='style-left'>#: namaruangan2 #</span>"
				// },
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
				// {
				// 	"field": "diagnosa",
				// 	"title": "Diagnosa",
				// 	"width": "150px",
				// 	"template": "<span class='style-center'>#: diagnosa #</span>"
				// },
				{
					"field": "status",
					"title": "Status",
					"width": "150px",
					"template": "<span class='style-center'>#: status #</span>"
				}
			];
			
			$scope.mainGridOptions = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarPasienForensikMedikolegal.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Pasien Forensik Dan Medikolegal",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns: $scope.columnDataJenazah,
				editable: "popup",
				selectable: "row",
				scrollable: false
			};

			$scope.klik = function (current) {
				$scope.current = current;
				$scope.item.norec = current.norec;
				$scope.item.objectpasiendaftarfk = current.objectpasiendaftarfk;
				$scope.item.objectantrianpasiendiperiksafk = current.objectantrianpasiendiperiksafk;
				$scope.item.noregistrasi = current.noregistrasi;
			};

			$scope.cari = function () {
				loadData()
			}

			$scope.pengambilanJenazah = function () {
				if ($scope.current == undefined) {
					toastr.warning("Info, Pilih Data Dahulu !");
					return;
				}

				if ($scope.current.status == "Sudah Diambil") {
					toastr.warning("Info, Jenazah Sudah Diambil !");
					return;
				}

				localStorage.setItem("objectpasiendaftarfk", $scope.current.norec_pd);
				$state.go('PengambilanJenazah')
			}

			$scope.cetakSuratKeteranganMeninggal = function () {
                if ($scope.current != undefined) {                                       
                    $scope.popUpSuratKeteranganMeninggal.center().open();                    
                } else {
                    toastr.warning("Info, Pilih Belum Dipilih!");
                    return;
                }
			}
			
			$scope.batalSKM = function(){
				// $scope.item.pegawaiPenJawab = undefined;
				$scope.popUpSuratKeteranganMeninggal.close();
			}

			$scope.cetakSKM = function () {
				if ( $scope.item.pegawaiPenJawab == undefined) {
					toastr.warning("Info, Penanggung Jawab Belum Dipilih !");
                    return;
				}

				var userLogin = medifirstService.getPegawaiLogin();
				var stt = 'false'
				if (confirm('Cetak Surat Keterangan Meninggal ? ')) {

					stt = 'true';
				} else {

					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-keterangan-meninggal' + '&noregistrasi=' + $scope.current.noregistrasi + '&idPegawai=' + $scope.item.pegawaiPenJawab.id + '&user=' + userLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});
				$scope.popUpSuratKeteranganMeninggal.close();
			}

			$scope.cetakSuratSerahTerimaJenazah = function () {				
				var userLogin = medifirstService.getPegawaiLogin();
				var stt = 'false'

				if ($scope.current == undefined) {
					toastr.warning("Info, Pilih Belum Dipilih!");
                    return;
				}

				if ($scope.current.status == "Belum Diambil") {
					toastr.warning("Info, Status Belum Diambil !");
					return;
				}

			
				if (confirm('Cetak Surat Serah Terima Jenazah ? ')) {
					stt = 'true';
				} else {

					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-serah-terima-jenazah&noregistrasi=' + $scope.current.noregistrasi + '&user=' + userLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});				
			}

			$scope.cetakSuratPermohonanTindakanPadaJenazah = function () {
				if ($scope.current == undefined) {
					toastr.warning("Info, Pilih Belum Dipilih!");
                    return;
				}

				$scope.popUpPermohonan.center().open();
			}

			$scope.batalPPJ = function(){
				$scope.item.pegawaiPenJawabST = undefined;
				$scope.item.PenanggungJawabPasien = undefined;
				$scope.item.hubungan = undefined;
				$scope.item.Permohonan = undefined;
				$scope.popUpPermohonan.close();
			}

			$scope.cetakPPJ = function () {
				var userLogin = medifirstService.getPegawaiLogin();
				var tahun = moment($scope.item.tahun).format('YYYY');
				var client = new HttpClient();

				if ($scope.item.pegawaiPenJawabST == undefined) {
					toastr.warning("Info, Pegawai Penanggung Jawab Belum Dipilih!");
                    return;
				}

				if ($scope.item.PenanggungJawabPasien == undefined) {
					toastr.warning("Info, Penanggung Jawab Pasien Belum Diisi !");
                    return;
				}

				if ($scope.item.hubungan == undefined) {
					toastr.warning("Info, Hubungan Dengan Pasien Belum Diisi !");
                    return;
				}

				if ($scope.item.Permohonan == undefined) {
					toastr.warning("Info, Permohonan Tindakan Belum Dipilih !");
                    return;
				}
				
				var stt = 'false'
				if (confirm('Cetak Surat Permohonan ? ')) {
					stt = 'true';
				} else {
					stt = 'false'							
				}

				client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-permohonan-tindakan-pada-jenazah&noregistrasi=' + $scope.current.noregistrasi + '&strIdPegawai=' + $scope.item.pegawaiPenJawabST.id +
					       '&PJP=' + $scope.item.PenanggungJawabPasien + '&hubungan=' + $scope.item.hubungan.hubungankeluarga + '&permohonan=' + $scope.item.Permohonan.permohonan + '&user=' + userLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});
			}

			$scope.cetakDaftarJenazah = function () {
				var tahun = moment($scope.item.tahun).format('YYYY');
				var stt = 'false'
				if (confirm('Cetak Daftar Jenazah ? ')) {

					stt = 'true';
				} else {

					stt = 'false'
				}
				var objectPegawaiFk = JSON.parse(localStorage.getItem('datauserlogin')).id;
				var client = new HttpClient();

				var tglAwal = "";
				if ($scope.item.caritglawal != undefined) {
					tglAwal = moment($scope.item.caritglawal).format('YYYY-MM-DD HH:mm:ss');
				}

				var tglAkhir = "";
				if ($scope.item.caritglawal != undefined) {
					tglAkhir = moment($scope.item.caritglakhir).format('YYYY-MM-DD HH:mm:ss');
				}

				var namaPegawai = JSON.parse(localStorage.getItem('pegawai')).namaLengkap;
				client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-daftar-jenazah' + '&namapegawai=' + namaPegawai + '&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir, function (response) {
					// do something with response
				});
			}

			$scope.inputTindakan = function () {
				if ($scope.current != undefined) {
					$state.go('InputTindakan', {
						norecPD: $scope.current.norec_pd,
						norecAPD: $scope.current.norec_apd
					});
				} else {
					messageContainer.error('Pasien belum di pilih')
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

			$scope.DetailTagihan = function () {
				if ($scope.current != undefined) {
					var obj = {
						noRegistrasi: $scope.current.noregistrasi
					}
					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
		//** BATAS SUCI */
		}
	]);
});