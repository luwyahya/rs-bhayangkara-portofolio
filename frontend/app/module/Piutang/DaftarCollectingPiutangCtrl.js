define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarCollectingPiutangCtrl', ['CacheHelper', '$scope', 'MedifirstService', '$state', 'DateHelper',
		function (cacheHelper, $scope, medifirstService, $state, dateHelper) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.ketTransaksi =''
			$scope.item.noBukti='' 
			$scope.isRouteLoading = false;
			$scope.listStatus = [{ "id": 1, "namaStatus": "Collecting" }, { "id": 2, "namaStatus": "Selesai" }]
			init();
			function init() {
				medifirstService.get("akuntansi/get-data-map-jurnal", true).then(function (dat) { 
                    $scope.listkelompoktransaksi = dat.data;
                });
			}
			
			//ON LOAD with Params
			var tempTr = '';
			
			var chacePeriode = cacheHelper.get('filterDataParams');
			if (chacePeriode != undefined) {
				var arrPeriode = chacePeriode.split('~');
				$scope.item.tanggalAwal = new Date(arrPeriode[0]);
				$scope.item.tanggalAkhir = new Date(arrPeriode[1]);

				if (arrPeriode[2] != "undefined") {
					$scope.item.namaCollector = arrPeriode[2];
				};
				if (arrPeriode[3] != "undefined") {
					$scope.item.status = { "namaStatus": arrPeriode[3] };
				}
				if (arrPeriode[4] != "undefined") {
					$scope.item.noCollect = arrPeriode[4];
				};

				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				var np = "&namaPasien=" + $scope.item.namaCollector;
				if ($scope.item.namaCollector == undefined) {
					var np = "";
				};
				var nps = "&noposting=" + $scope.item.noCollect;
				if ($scope.item.noCollect == undefined) {
					var nps = "";
				};
				var stt = ""
				if ($scope.item.status != undefined) {
					var stt = "&status=" + $scope.item.status.namaStatus;
				};
				$scope.isRouteLoading = true;
				medifirstService.get("piutang/daftar-collected-piutang-layanan?tglAwal=" + tglAwal1 + "&tglAkhir=" + tglAkhir1 + np + nps + stt).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.length; i++) {
						data[i].sisa = parseFloat(data[i].totalKlaim) - parseFloat(data[i].totalSudahDibayar);
					}
					$scope.dataSource2 = data;
				});

			}
			else {
				$scope.item.tanggalAwal = $scope.now;
				$scope.item.tanggalAkhir = $scope.now;
			};
			///END/// ON LOAD with Params


			$scope.Ubah = function () {
				var chacePeriode = '' + ":" + $scope.dataSelected.noPosting + ":" + '' + ":" + '' + ":" + '' + ":"
					+ '' + ":" + ''
					+ ":" + '' + ":" + '' + ":" + 'as@epic'
				cacheHelper.set('periodeTransaksiPencatatanPiutangDaftarLayanan', chacePeriode);

				var obj = {
					splitString: "a s @ e p i c "
				}

				$state.go('CollectingPiutang', {
					dataFilter: JSON.stringify(obj)
				});
			}

			$scope.cariData = function () {
				//SIMPAN CAHCE
				$scope.isRouteLoading = true;
				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				if ($scope.item.namaCollector != undefined) {
					var npp = $scope.item.namaCollector;
				};
				if ($scope.item.status != undefined) {
					var sttt = $scope.item.status.namaStatus;
				};
				if ($scope.item.noCollect != undefined) {
					var npps = $scope.item.noCollect;
				};
				var chacePeriode = tglAwal1 + "~" + tglAkhir1 + "~" + npp + "~" + sttt + "~" + npps;
				cacheHelper.set('filterDataParams', chacePeriode);
				/////END

				///FILTER DATA
				var np = "&namaPasien=" + $scope.item.namaCollector;
				if ($scope.item.namaCollector == undefined) {
					var np = "";
				};
				var nps = "&noposting=" + $scope.item.noCollect;
				if ($scope.item.noCollect == undefined) {
					var nps = "";
				};
				var stt = ""
				if ($scope.item.status != undefined) {
					var stt = "&status=" + $scope.item.status.namaStatus;
				};

				medifirstService.get("piutang/daftar-collected-piutang-layanan?tglAwal=" + tglAwal1 + "&tglAkhir=" + tglAkhir1 + np + nps + stt).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.length; i++) {
						data[i].sisa = parseFloat(data[i].totalKlaim) - parseFloat(data[i].totalSudahDibayar);
					}
					$scope.dataSource2 = data;

				});
				/////END
			};
			///END/// //ON CLICK tombol CARI

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			}

			$scope.columnPencatatanPiutang = [
				{
					"field": "noPosting",
					"title": "No Collecting"
				},
				{
					"field": "tglTransaksi",
					"title": "Tanggal"
				},
				{
					"field": "collector",
					"title": "Nama Collector"
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien"
				},
				{
					"field": "namarekanan",
					"title": "Penjamin"
				},
				{
					"field": "jlhPasien",
					"title": "Total Pasien"
				},
				{
					"field": "totalKlaim",
					"title": "Total Klaim",
					"template": "<span class='style-right'>{{formatRupiah('#: totalKlaim #', 'Rp.')}}</span>"
				},
				{
					"field": "totalSudahDibayar",
					"title": "Total Sudah Dibayar",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSudahDibayar #', 'Rp.')}}</span>"
				},
				{
					"field": "status",
					"title": "Status"
				}, 
				{
					"field": "statusjurnal",
					"title": "Status Jurnal",
					"width": "100px",
					"template": "<button class=\"k-button custom-button\" ng-click=\"openpopUpVerifikasi(dataItem)\"  style=\"margin:0 0 5px\">#:  statusjurnal #</button> ",
				},
			];
			
			$scope.detail = function () {
				$scope.changePage("DetailCollectingPiutang");
			};

			$scope.changePage = function (stateName) {
				if ($scope.dataSelected.noPosting != undefined) {
					var obj = {
						splitString: $scope.dataSelected.noPosting + "~..:."
					}

					$state.go(stateName, {
						dataCollect: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data Collector terlebih dahulu");
				}
			};

			$scope.kps = function () {
				if ($scope.dataSelected.noPosting != undefined) {
					$state.go('KartuPiutangPasien', {
						id: $scope.dataSelected.idrekanan,
					});
				} else {
					alert("Silahkan pilih data Collector terlebih dahulu");
				}
			}

			$scope.bayar = function () {
				$scope.changePageS("PembayaranPiutangKasir");				
			}
			
			$scope.changePage = function (stateName) {
				var noPostingC = $scope.dataSelected.noPosting
				var obj = {
					noPosting: noPostingC
				}

				$state.go(stateName, {
					dataCollect: JSON.stringify(obj)
				});
			}

			$scope.changePageS = function (stateName) {
				var noPostingC = $scope.dataSelected.noPosting
				var obj = {
					noPosting: noPostingC
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}
			function loadComboPopup() {
				var ket = ""
			 			ket = "Penerimaan BP"
						medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
							+ ket)
							.then(function (dat) {
								$scope.listJenisTransaksi = dat.data.kelompoktransaksi;
								$scope.listMataAnggaran = dat.data.mataanggaran;

							});
			 
			}

			$scope.openpopUpVerifikasi = function (dataSelected) {
				var dataItem = dataSelected;
				var stt = 'false'
				var massage = "Yakin mau Verifikasi data ini..?"
				if (dataItem.status == 'Unverif')
					massage = "Yakin mau Unverifikasi data ini..?"
				if (confirm(massage)) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					return;
					stt = 'false'
				}
				if (stt) {
					if (dataItem.statusjurnal == 'Unverif') {
						var itemDelete = {
							"norec_closing": dataItem.norecsp,
						}
						medifirstService.post('bendaharapenerimaan/unverifikasi-Setoran', itemDelete).then(function (e) {
							$scope.cariData();
						})
					} else {
						$scope.penerimaan = true
						loadComboPopup()
						tempTr = dataItem
						// $scope.item.jumlahRp = tempTr.debit
						$scope.popUpVerifikasi.center().open()
						$scope.item.kelompoktransaksi = "" 
					 
					}
				}
			}
			$scope.$watch('item.jumlahRp', function (newValue, oldValue) {
				if (newValue != "") {
					medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
						function (dat) {
							$scope.item.terbilang = dat.data.terbilang;
						})
				}
			});
			$scope.SaveKelompokTransaksi = function(){
				 
					var strukresep = {
						nojurnal: '-',
						tglentry: moment($scope.tglbku).format('YYYY-MM-DD hh:mm:ss'),
						deskripsi: 'No Posting '+tempTr.noPosting +' ' + $scope.item.ketTransaksi+' '+ $scope.item.noBukti ,
						nobuktitransaksi: tempTr.norecsp,
						nostrukfk: tempTr.norecsp,
					}
					var data = {};
					var data2 = [];
					data = {
						no: 1,
						accountid:	$scope.item.kelompoktransaksi.idcoadebit,
						noaccount: $scope.item.kelompoktransaksi.noaccountdebit,
						namaaccount: $scope.item.kelompoktransaksi.namaaccountdebit,
						namaaccount2: $scope.item.kelompoktransaksi.namaaccountdebit,
						hargasatuand:parseFloat($scope.item.jumlahRp),
						hargasatuank: '0',
						keteranganlainnya: ''
					}
					data2.push(data)
					data = {
						no: 2,
						accountid:$scope.item.kelompoktransaksi.idcoakredit,
						noaccount:$scope.item.kelompoktransaksi.noaccountkredit,
						namaaccount: "--- " + $scope.item.kelompoktransaksi.namaaccountdebit,
						namaaccount2: $scope.item.kelompoktransaksi.namaaccountdebit,
						hargasatuand: '0',
						hargasatuank: parseFloat($scope.item.jumlahRp),
						keteranganlainnya: ''
					}
					data2.push(data)
					var objSave =
					{
						head: strukresep,
						detail: data2
					}
					medifirstService.post('akuntansi/save-entry-jurnal-bp', objSave).then(function (e) {
							
						var objSave = { 
							nostrukfk: tempTr.norecsp,
						}
						medifirstService.post('akuntansi/update-jurnalpenjamin', objSave).then(function (e) {
							 $scope.cariData();
								$scope.popUpVerifikasi.close()
						}) 
					 
					}) 
			 
			}
			$scope.batalPenerimaan = function () {
				kosongkan() 
				$scope.popUpVerifikasi.close(); 
			}
			function kosongkan() {
				// $scope.item.tglbku ='';
				$scope.item.keterangan = '';
				$scope.item.ketTransaksi = '';
				$scope.item.ketTransaksi = '';
				$scope.item.kdPerkiraan = '';
				$scope.item.jumlahRp= '';				
				$scope.item.jumlah = '';
				$scope.item.jenisTransaksi = undefined;
				$scope.item.caraBayar = undefined;
				$scope.item.namaBank = undefined;
				$scope.item.namaBankTransfer = undefined;
				$scope.item.namaKartu = '';
				$scope.item.terbilang = '';
				$scope.item.noBukti = ''; 
			}
			////////////////////////////////////////////////////////////
		}
	]);
});