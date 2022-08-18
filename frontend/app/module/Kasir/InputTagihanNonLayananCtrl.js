define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InputTagihanNonLayananCtrl', ['$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.tglStruk = new Date();
			$scope.item.jumlah = 1
			$scope.item.QtyPerOrang = 1
			$scope.item.keterangan = ''
			var noRegistrasi2 = ''
			$scope.abisSimpanKauPulanglah = true;
			$scope.checkQtyOrg = '';
			$scope.checkQtyOrg = true
			$scope.QtyOrang = true;
			var data2 = [];
			var dataProduk = [];
			var norec = '';
			var NoStruk = '';
			var Kegiatan = '';

			// var data = cacheHelper.get('InputTagihanNonLayananCtrl');
			//          if (data !== undefined) {
			//              var splitResultData = data.split("#");
			//              var noRegistrasi2 = splitResultData[0]
			//              var cmdBayar = splitResultData[1]
			//              var dariSini = splitResultData[2]
			//              // $scope.item.periodeAwal = new Date(splitResultData[0]);
			//              // $scope.item.periodeAkhir = new Date(splitResultData[1]);
			//          }

			loadCombo();
			$scope.dataCheckbox = [{
				"id": 1, "name": "Persen"
			}, {
				"id": 2, "name": "Rupiah"
			}];
			$scope.item.typeDiskon = $scope.dataCheckbox[0];
			$scope.diskonPersen = true;

			function loadCombo() {
				$scope.KelompokUser = medifirstService.getKelompokUser();
				medifirstService.get("kasir/get-data-combo-kasir-select?kelFix=1&dikLit=1&dokter=1").then(function (data) {
					$scope.listKelompokTransaksi = data.data.kelfix;
					$scope.KelompokUserDiklit = data.data.diklit;
					$scope.listDokter = data.data.dokter;
					LoadCache();
				})
			}

			function LoadCache() {
				var chacePeriode = cacheHelper.get('InputTagihanNonLayananCtrl');
				if (chacePeriode != undefined) {
					norec = chacePeriode[0];
					Kegiatan = chacePeriode[1];
					NoStruk = chacePeriode[2];
					init()
					var chacePeriode = {
						0: '',
						1: '',
						2: '',
						3: '',
						4: '',
						5: '',
						6: ''
					}
					cacheHelper.set('InputTagihanNonLayananCtrl', chacePeriode);
				} else {
					init()
				}
			}

			function init() {
				if (Kegiatan != '') {
					$scope.isRouteLoading = true;
					if (Kegiatan == 'EditTagihan') {
						medifirstService.get("kasir/detail-tagihan-non-layanan?noRec=" + norec, true).then(function (data) {
							$scope.isRouteLoading = false;
							var data_ih = data.data;
							debugger;
							$scope.item.tglStruk = new Date(moment(data_ih.tglTransaksi).format('YYYY-MM-DD HH:mm'));
							$scope.item.namaPasien_klien = data_ih.namaPasien_klien;
							$scope.item.noTelp_klien = data_ih.notelepon;
							$scope.item.kelompokTransaksi = { id: data_ih.kdkelompokTransaksi, kelompoktransaksi: data_ih.kelompokTransaksi };
							$scope.item.keterangan = data_ih.keterangan;
							dataProduk = data_ih.detailTagihan;
							var subTotal = 0;
							// var total = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								dataProduk[i].no = i + 1
								subTotal = subTotal + parseFloat(dataProduk[i].totalK) - parseFloat(dataProduk[i].discount)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk,
								group: $scope.group,
								pageSize: 100,
								total: dataProduk.length,
								serverPaging: false,
								schema: {
									model: {
									}
								}
							});
						});
					}
				}
			}

			// $q.all([k
			// 	modelItemAkuntansi.getDataTableTransaksi("kasir/detail-tagihan-non-layanan/"+ noRegistrasi2 )
			// 	])
			// .then(function(data) {

			// 	if (data[0].statResponse){
			// 		$scope.item = data[0];
			// 		// $scope.item.totalTagihan = $scope.item.jumlahBayar;
			// 		// $scope.item.jumlahBayarFix = $scope.item.jumlahBayar - $scope.item.totalDeposit;
			// 		$scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 			data: data[0].detailTagihan
			// 		});
			// 	}

			// });

			function showButton() {
				//$scope.showBtnCetak = true;
				// debugger;
				// $scope.showBtnBack = true;
				// if (cmdBayar == "0"){
				// 	$scope.showBtnBayar = true;
				// }
				// if (cmdBayar == "1"){
				// 	$scope.showBtnBayar = false;
				// }

				//$scope.showBtnTutup = true;
			}

			showButton();

			$scope.Back = function () {
				window.history.back();
				//$state.go(dariSini)
			};

			$scope.$watch('item.persenDiscount', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.persenDiscount > 100) {
						$scope.item.persenDiscount = "";
					}
					$scope.item.diskonKomponen = ((parseFloat($scope.item.Total)) * $scope.item.persenDiscount) / 100
					// $scope.item.Total = $scope.item.Total - $scope.item.diskonKomponen
				}
			})

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			// $scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 	data: []
			// });
			$scope.cekRadioPersen = function (bool) {
				if (bool.id == 1)
					$scope.diskonPersen = true
				else
					$scope.diskonPersen = false
			}

			$scope.getChecked = function () {
				if ($scope.checkQtyOrg == true) {
					$scope.QtyOrang = true;
				} else {
					$scope.QtyOrang = false;
				}
			}

			$scope.columnDaftarTagihan = [
				{
					"field": "no",
					"title": "No",
					"width": "45px"
				},
				{
					"field": "namaproduk",
					"title": "Tagihan",
					"width": "300px"
				},
				{
					"field": "keterangan",
					"title": "Keterangan",
					"width": "200px"
				},
				{
					"field": "jumlah",
					"title": "Qty",
					"width": "90px"
				},
				{
					"field": "qtyoranglast",
					"title": "Qty Per Org/Per Km",
					"width": "155px"
				},
				{
					"field": "namadokter",
					"title": "Dokter",
					"width": "80px"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width": "110px"
				},
				{
					"field": "discount",
					"title": "Discount",
					"width": "110px"
				},
				{
					"field": "totalK",
					"title": "Total",
					"width": "110px"
				}
			];

			$scope.columnDaftarProduk = [
				{
					"field": "namaproduk",
					"title": "Nama Layanan",
					"width": "300px"
				}
			];

			$scope.CariProduk = function () {
				medifirstService.get("kasir/get-data-produk?namaproduk=" + $scope.item.namaproduk + "&take=50", false).then(function (data) {
					$scope.dataDaftarProduk = data.data.data;
				})
			}

			$scope.bayar = function () {
				var r = confirm("Yakin Simpan?");
				if (r == false) {
					return;
				}
				debugger; if (dataProduk.length == 0) {
					alert("Pilih produk terlebih dahulu !")
					return;
				}
				if ($scope.item.kelompokTransaksi == undefined) {
					alert("Pilih kelompok transaksi terlebih dahulu !")
				}
				if ($scope.item.namaPasien_klien == undefined) {
					alert("Isi Nama Pelanggan terlebih dahulu !")
				}
				// if ($scope.item.totalBilling == undefined) {
				// 	alert("Total tidak Boleh Kosong !")
				// 	return;
				// }
				var subTotal = 0;
				for (var i = dataProduk.length - 1; i >= 0; i--) {
					subTotal = subTotal + parseFloat(dataProduk[i].totalK) - parseFloat(dataProduk[i].discount)
				}
				if (subTotal == undefined || subTotal == 0) {
					alert("Total tidak Boleh Kosong !")
					return;
				}
				if ($scope.item.kelompokTransaksi == undefined) {
					alert("Pilih kelompok transaksi terlebih dahulu !")
				}

				var objSave = {
					norec: norec,
					kelompoktransaksifk: $scope.item.kelompokTransaksi.id,
					keteranganlainnya: $scope.item.keterangan,
					namapasien_klien: $scope.item.namaPasien_klien,
					notelp_klien: $scope.item.noTelp_klien,
					tglstruk: moment($scope.item.tglStruk).format('YYYY-MM-DD hh:mm:ss'),
					totalharusdibayar: parseFloat(subTotal),//parseFloat($scope.item.totalBilling),
					details: dataProduk

				}
				medifirstService.post('kasir/save-input-non-layanan', objSave).then(function (data) {
					if ($scope.KelompokUser != $scope.KelompokUserDiklit) {
						noRegistrasi2 = data.data.data.norec
						$scope.changePage("PenerimaanPembayaranKasir");
					} else {
						window.history.back();
					}

				})
			}

			$scope.$watch('item.jumlah', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.$watch('item.QtyPerOrang', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.$watch('item.Harga', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.changePage = function (stateName) {
				var obj = {
					pageFrom: "InputTagihanNonLayanan",
					noRegistrasi: noRegistrasi2
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.Tutup = function () {

			}

			$scope.klikGrid = function (dataSelectedProduk) {
				if (dataSelectedProduk == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				$scope.dataSelectedProduk = dataSelectedProduk;
				$scope.item.namaprodukInput = $scope.dataSelectedProduk.namaproduk;
				if (($scope.dataSelectedProduk.namaproduk == "Pelayanan Lainnya") || ($scope.dataSelectedProduk.namaproduk == "Biaya kenaikan kelas")) {
					$scope.item.KeteranganProduk = "-";
					$scope.disHarga = false;
				} else {
					$scope.disHarga = true;
				}
				$scope.item.Harga = $scope.dataSelectedProduk.harga;
				$scope.item.idProduk = $scope.dataSelectedProduk.id;
				$scope.item.jumlah = 1;
			}

			$scope.klikGridPro = function (dataSelected) {
				if (dataSelected == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				$scope.dataSelected = dataSelected;
				$scope.item.no = $scope.dataSelected.no;
				$scope.item.namaprodukInput = $scope.dataSelected.namaproduk;
				$scope.item.KeteranganProduk = $scope.dataSelected.keterangan;
				$scope.item.Harga = $scope.dataSelected.harga;
				$scope.item.idProduk = $scope.dataSelected.id;
				$scope.item.jumlah = $scope.dataSelected.jumlah;
			}

			$scope.tambah = function () {
				if ($scope.item.namaprodukInput == undefined) {
					alert("pilih produk terlebih dahulu !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.KeteranganProduk == undefined) {
					alert("Keterangan Pelayanan Harus Diisi !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.Harga == 0 || $scope.item.Harga == 0.0) {
					alert("Harga Tidak Boleh Nol !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.keterangan == undefined || $scope.item.keterangan == '') {
					alert("Keterangan Tagihan Harus Diisi !!")
					return;
				}
				var dokter = '';
				var namadokter = '';
				if ($scope.item.dokter != undefined) {
					dokter = $scope.item.dokter.id
					namadokter = $scope.item.dokter.namalengkap
				}
				var no = 0
				if (dataProduk.length == 0) {
					no = 1
				} else {
					no = dataProduk.length + 1
				}

				if ($scope.item.no != undefined) {
					no = $scope.item.no
				}
				var discount = 0
				if ($scope.item.diskonKomponen != undefined) {
					discount = $scope.item.diskonKomponen
				}
				var data = {};
				if ($scope.item.no != undefined) {//LAMA
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						if (dataProduk[i].no == $scope.item.no) {
							data.no = $scope.item.no

							data.id = $scope.item.idProduk
							data.namaproduk = $scope.item.namaprodukInput
							data.jumlah = parseFloat($scope.item.jumlah)
							data.qtyoranglast = parseFloat($scope.item.QtyPerOrang)
							data.harga = parseFloat($scope.item.Harga)
							data.totalK = $scope.item.Total //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
							data.keterangan = $scope.item.KeteranganProduk
							data.dokter = dokter
							data.namadokter = namadokter
							data.discount = discount
							dataProduk[i] = data;
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk
							});
							var subTotal = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(dataProduk[i].totalK) - parseFloat(dataProduk[i].discount)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							ClearIsian();

						}
						// break;
					}
				} else {//BARU
					data = {
						no: no,
						id: $scope.item.idProduk,
						namaproduk: $scope.item.namaprodukInput,
						jumlah: parseFloat($scope.item.jumlah),
						qtyoranglast: parseFloat($scope.item.QtyPerOrang),
						harga: parseFloat($scope.item.Harga),
						keterangan: $scope.item.KeteranganProduk,
						dokter: dokter,
						namadokter: namadokter,
						totalK: $scope.item.Total, //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
						discount: discount
					}
					dataProduk.push(data)
					// $scope.dataGrid.add($scope.dataSelectedProduk)
					$scope.dataDaftarTagihan = new kendo.data.DataSource({
						data: dataProduk
					});
					var subTotal = 0;
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						subTotal = subTotal + parseFloat(dataProduk[i].totalK) - parseFloat(dataProduk[i].discount)
					}
					$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
					ClearIsian();
				}
			}

			function ClearIsian() {
				$scope.item.no = undefined;
				$scope.item.namaprodukInput = undefined;
				$scope.item.KeteranganProduk = undefined;
				$scope.item.Harga = undefined;
				$scope.item.idProduk = undefined;
				$scope.item.jumlah = 1;
				$scope.item.Total = undefined;
				$scope.item.QtyPerOrang = 1;
				$scope.item.dokter = undefined;
				$scope.item.diskonKomponen = undefined;
			}

			$scope.hapus = function () {
				if ($scope.item.namaprodukInput == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				var data = {};
				if ($scope.item.no != undefined) {
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						if (dataProduk[i].no == $scope.item.no) {
							dataProduk.splice(i, 1);
							var subTotal = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(data2[i].total)
								dataProduk[i].no = i + 1
							}
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk
							});
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						}
					}
				}
				ClearIsian();
			}

			$scope.batal = function () {
				ClearIsian();
			}

			// BATAS //
		}
	]);
});