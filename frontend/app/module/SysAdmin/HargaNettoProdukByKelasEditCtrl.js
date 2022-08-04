define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('HargaNettoProdukByKelasEditCtrl', ['$state', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($state, $scope, cacheHelper, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			var Idsakarepmu = '';
			var idDetail = '';
			$scope.isRouteLoading = false;
			$scope.item.tglBerlakuAwal = $scope.now;
			$scope.item.tglKadaluarsaLast = $scope.now;
			$scope.item.tglBerlakuAkhir = $scope.now;
			var data2 = [];
			$scope.item.persenDiscount = 0;
			$scope.item.hargaDiscount = 0;
			$scope.item.hargaSatuan = 0;
			$scope.item.factorRate = 0;
			$scope.item.qtyCurrentStok = 1;
			$scope.item.factorRate2 = 0;
			$scope.item.hargaDiscount2 = 0;
			$scope.item.persenDiscount2 = 0;
			$scope.item.hargaNetto22 = 0;
			$scope.item.hargaNetto12 = 0;
			$scope.item.hargaNetto2 = 0;
			$scope.item.hargaNetto1 = 0;

			
			medifirstService.get("sysadmin/master/get-combo-tarif", true).then(function (dat) {
				var dataCombo = dat.data
				debugger
				$scope.listkelas = dataCombo.kelas;
				$scope.listasalproduk = dataCombo.asalproduk;
				$scope.item.asalProduk = { id: dataCombo.asalproduk[0].id, asalProduk: dataCombo.asalproduk[0].asalProduk }
				$scope.listjenistarif = dataCombo.jenistarif;
				$scope.item.jenisTarif = { id: dataCombo.jenistarif[0].id, jenisTarif: dataCombo.jenistarif[0].jenisTarif }
				$scope.listmatauang = dataCombo.matauang;
				$scope.item.mataUang = { id: dataCombo.matauang[0].id, mataUang: dataCombo.matauang[0].mataUang }
				$scope.listSK = dataCombo.suratkeputusan
				$scope.item.suratKeputusan = { id: dataCombo.suratkeputusan[0].id, sk: dataCombo.suratkeputusan[0].sk }
				$scope.listJenisPelayanan = dataCombo.jenispelayanan
			});

			var chacePeriode = cacheHelper.get('HargaNettoProdukByKelasEdit');
			if (chacePeriode != undefined) {
				var objectprodukfkS = 0;
				var objectkelasfkS = 0;
				var objectasalprodukfkS = 0;
				var objectjenistariffkS = 0;
				var objectmatauangfkS = 0;
				//var arrPeriode = chacePeriode.split('~');
				Idsakarepmu = chacePeriode;//arrPeriode(0);
				if (Idsakarepmu != 'fsdjhfkjdshfusfhsdfhsk') {
					$scope.produkInput = false;
					$scope.produkCombo = true;
					LoadData();
				} else {
					$scope.produkInput = false;
					$scope.produkCombo = true;
					medifirstService.getPart("sysadmin/general/get-datacombo-produk", true, true, 200).then(function (data) {
						$scope.listproduk = data;
					});
				}

				function LoadData() {
					$scope.isRouteLoading = true;
					medifirstService.get("sysadmin/master/get-tarif-harganettoprodukbykelas?id=" + Idsakarepmu, true).then(function (dat) {
						$scope.disabledProduk = true;
						$scope.disabledJenisTarif = true;
						$scope.disabledAsalProduk = true;
						$scope.disabledKelas = true;
						$scope.disabledMataUang = true;


						$scope.item.factorRate = dat.data[0].factorrate;
						$scope.item.hargaDiscount = dat.data[0].hargadiscount;
						$scope.item.hargaNetto1 = dat.data[0].harganetto1;
						$scope.item.hargaNetto2 = dat.data[0].harganetto2;
						$scope.item.hargaSatuan = dat.data[0].hargasatuan;
						$scope.item.asalProduk = { id: dat.data[0].objectasalprodukfk, asalProduk: dat.data[0].asalproduk };
						$scope.item.jenisTarif = { id: dat.data[0].objectjenistariffk, jenisTarif: dat.data[0].jenistarif };;
						$scope.item.kelas = { id: dat.data[0].objectkelasfk, namaKelas: dat.data[0].namakelas };
						$scope.item.mataUang = { id: dat.data[0].objectmatauangfk, mataUang: dat.data[0].matauang };
						//$scope.item.produk = {id: dat[0].objectprodukfk ,namaProduk:dat[0].namaproduk};
						$scope.item.produkNama = dat.data[0].namaproduk;
						$scope.item.produk = { id: dat.data[0].objectprodukfk, namaProduk: dat.data[0].namaproduk };

						$scope.item.persenDiscount = dat.data[0].persendiscount;
						$scope.item.qtyCurrentStok = dat.data[0].qtycurrentstok;
						$scope.item.tglBerlakuAkhir = dat.data[0].tglberlakuakhir;
						$scope.item.tglBerlakuAwal = dat.data[0].tglberlakuawal;
						$scope.item.tglKadaluarsaLast = dat.data[0].tglkadaluarsalast;
						$scope.item.id = dat.data[0].id;
						$scope.item.noRec = dat.data[0].norec;
						$scope.item.reportDisplay = dat.data[0].reportdisplay;
						$scope.item.kodeExternal = dat.data[0].kodeexternal;
						$scope.item.namaExternal = dat.data[0].namaexternal;
						$scope.item.statusEnabled = dat.data[0].statusenabled;
						$scope.item.jenisPelayanan = { id: dat.data[0].objectjenispelayananfk, jenispelayanan: dat.data[0].jenispelayanan };
						objectprodukfkS = dat.data[0].objectprodukfk;
						objectkelasfkS = dat.data[0].objectkelasfk;
						objectasalprodukfkS = dat.data[0].objectasalprodukfk;
						objectjenistariffkS = dat.data[0].objectjenistariffk;
						objectmatauangfkS = dat.data[0].objectmatauangfk;

						$scope.item.id_hn_m = dat.data[0].id_hn_m;

						medifirstService.get("sysadmin/master/get-tarif-harganettoprodukbykelas_d?" +
							"objectprodukfk=" + objectprodukfkS +
							"&objectkelasfk=" + objectkelasfkS +
							"&objectasalprodukfk=" + objectasalprodukfkS +
							"&objectjenistariffk=" + objectjenistariffkS +
							"&objectmatauangfk=" + objectmatauangfkS +
							"&objectjenispelayananfk=" + dat.data[0].objectjenispelayananfk
							, true).then(function (dat1) {
								$scope.isRouteLoading = false;
								for (var i = 0; i < dat1.data.length; i++) {
									dat1.data[i].no = i + 1
									dat1.data[i].total = dat1.data[i].hargasatuan
								}
								// $scope.isRouteLoading = false;
								$scope.dataKomponen = dat1.data;
								data2 = dat1.data;
								var subTotal = 0;

								for (var i = data2.length - 1; i >= 0; i--) {
									subTotal = subTotal + parseFloat(data2[i].hargasatuan)
								}
								// $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
								$scope.item.hargaNetto1 = subTotal;
								$scope.item.hargaNetto2 = subTotal;
								$scope.item.hargaSatuan = subTotal;
							});
					});

				}
			}


			medifirstService.get("sysadmin/master/get-list-komponen?jenis=komponenharga", true).then(function (dat) {
				$scope.listKomponen = dat;
			});

			medifirstService.getPart("sysadmin/general/get-datacombo-produk", true, true, 200).then(function (data) {
				$scope.listproduk = data;
			});

			$scope.batal = function () {
				$state.go('HargaNettoProdukByKelas')
			}

			$scope.save = function () {
				SimpanHead()
			}

			$scope.tambah = function () {
				if ($scope.item.komponen == undefined) {
					alert("Komponen Harga harus di isi!")
					return;
				}
				if ($scope.item.hargaNetto12 == undefined) {
					alert("Harga Netto 1 belum di isi")
					return;
				}
				if ($scope.item.hargaNetto22 == undefined) {
					alert("Harga Netto 2 belum di isi")
					return;
				}
				if ($scope.item.hargaSatuan2 == undefined) {
					alert("Harga Satuan belum di isi")
					return;
				}


				var nomor = 0
				if ($scope.dataKomponen == undefined) {
					nomor = 1
				} else {
					nomor = data2.length + 1
				}
				var data = {};
				var id_hn_d = '';



				if ($scope.item.no != undefined) {
					for (var i = data2.length - 1; i >= 0; i--) {
						if (data2[i].no == $scope.item.no) {

							data.id_hn_d = data2[i].id_hn_d
							data.no = $scope.item.no
							data.komponenharga = $scope.item.komponen.komponenharga
							data.objectkomponenhargafk = $scope.item.komponen.id
							data.factorrate = String($scope.item.factorRate2)
							data.hargadiscount = String($scope.item.hargaDiscount2)
							data.harganetto1 = String($scope.item.hargaNetto12)
							data.harganetto2 = String($scope.item.hargaNetto22)
							data.hargasatuan = String($scope.item.hargaSatuan2)
							data.persendiscount = String($scope.item.persenDiscount2)
							data.total = $scope.item.hargaSatuan2

							data2[i] = data;
							$scope.dataKomponen = new kendo.data.DataSource({
								data: data2
							});
							var subTotal = 0;
							for (var i = data2.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(data2[i].hargasatuan)
							}
							// $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.item.hargaNetto1 = subTotal
							$scope.item.hargaNetto2 = subTotal
							$scope.item.hargaSatuan = subTotal
						}
						// break;
					}

				} else {
					data = {
						no: nomor,
						id_hn_d: id_hn_d,
						// noregistrasifk:norec_apd,//$scope.item.noRegistrasi,                  
						komponenharga: $scope.item.komponen.komponenharga,
						objectkomponenhargafk: $scope.item.komponen.id,
						factorrate: String($scope.item.factorRate2),
						hargadiscount: String($scope.item.hargaDiscount2),
						harganetto1: String($scope.item.hargaNetto12),
						harganetto2: String($scope.item.hargaNetto22),
						hargasatuan: String($scope.item.hargaSatuan2),
						persendiscount: String($scope.item.persenDiscount2),
						total: $scope.item.hargaSatuan2,

					}
					data2.push(data)
					// $scope.dataGrid.add($scope.dataSelected)
					$scope.dataKomponen = new kendo.data.DataSource({
						data: data2
					});
					var subTotal = 0;
					for (var i = data2.length - 1; i >= 0; i--) {
						subTotal = subTotal + parseFloat(data2[i].total)
					}
					$scope.item.hargaNetto1 = subTotal
					$scope.item.hargaNetto2 = subTotal
					$scope.item.hargaSatuan = subTotal
				}
				Kosongkan()

			}

			$scope.hapus = function () {
				if ($scope.item.hargaSatuan == 0) {
					alert("Harga Satuan harus di isi!")
					return;
				}

				if ($scope.item.komponen == undefined) {
					alert("Pilih Komponen Harga terlebih dahulu!!")
					return;
				}

				// var nomor =0
				// if ($scope.dataGrid == undefined) {
				//     nomor = 1
				// }else{
				//     nomor = data2.length+1
				// }
				var data = {};
				if ($scope.item.no != undefined) {
					for (var i = data2.length - 1; i >= 0; i--) {
						if (data2[i].no == $scope.item.no) {

							//data2[i] = data;
							// delete data2[i]
							data2.splice(i, 1);

							var subTotal = 0;
							for (var i = data2.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(data2[i].hargasatuan)
								data2[i].no = i + 1
							}
							// data2.length = data2.length -1
							$scope.dataKomponen = new kendo.data.DataSource({
								data: data2
							});
							// for (var i = data2.length - 1; i >= 0; i--) {
							//     subTotal=subTotal+ parseFloat(data2[i].total)
							// }
							// $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.item.hargaSatuan = subTotal
							$scope.item.harganetto1 = subTotal
							$scope.item.harganetto2 = subTotal
						}
						// break;
					}

				}
				Kosongkan()
			}
			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			function Kosongkan() {
				$scope.item.no = undefined
				$scope.item.komponen = ''
				$scope.item.factorRate2 = 0
				$scope.item.hargaDiscount2 = 0
				$scope.item.hargaNetto12 = 0
				$scope.item.hargaNetto22 = 0
				$scope.item.hargaSatuan2 = 0
				$scope.item.persenDiscount2 = 0

			}
			$scope.saveHead = function () {
				if (Idsakarepmu == 'fsdjhfkjdshfusfhsdfhsk') {

				} else {
					alert("Ada kesalahan loading data!!");
				}
			}

			$scope.delete = function () {
				if (Idsakarepmu == '') {
					alert("Ada kesalahan loading data!!");
				} else {
					if (Idsakarepmu == 'fsdjhfkjdshfusfhsdfhsk') {
						alert("Fitur tambah tidak bisa hapus");
					} else {
						if (idDetail == '') {
							alert("Pilih komponen yg akan di hapus!!");
						} else {
							Simpan('delete');
							kosongKan();
						}
					}
				}
			}
			$scope.cancel = function () {
				kosongKan();
			}

			function kosongKan() {
				idDetail = '';
				$scope.item.komponen = $scope.listKomponen[0];
				$scope.item.factorRate2 = '';
				$scope.item.hargaDiscount2 = '';
				$scope.item.hargaNetto12 = '';
				$scope.item.hargaNetto22 = '';
				$scope.item.hargaSatuan2 = '';
				$scope.item.persenDiscount2 = '';
			}
			function SimpanHead() {
				if ($scope.item.suratKeputusan == undefined) {
					toastr.error('Surat Keputusan Harus di isi')
					return
				}
				if ($scope.item.jenisPelayanan == undefined) {
					toastr.error('Jenis Pelayanan Harus di isi')
					return
				}
				if ($scope.item.jenisTarif == undefined) {
					toastr.error('Jenis Tarif Harus di isi')
					return
				}
				if ($scope.item.mataUang == undefined) {
					toastr.error('Mata Uang Harus di isi')
					return
				}
				if($scope.item.jenisTarif != undefined && $scope.item.jenisTarif.id == null){
					toastr.error('Jenis Tarif Harus di isi')
					return
				}
				if($scope.item.mataUang != undefined && $scope.item.mataUang.id == null){
					toastr.error('Mata Uang Harus di isi')
					return
				}
				var validasi = true;
				// if (Idsakarepmu != 'fsdjhfkjdshfusfhsdfhsk') {
				// 	var validasi = false;
				// }
				if (validasi == true) {

					var objectprodukfkS = "";
					if ($scope.item.produk != undefined) { objectprodukfkS = $scope.item.produk.id }
					else {
						alert("Produk Harus di pilih!")
						return
					};

					var STR_asalProduk = "";
					if ($scope.item.asalProduk != undefined) { STR_asalProduk = $scope.item.asalProduk.id };
					var STR_jenisTarif = "";
					if ($scope.item.jenisTarif != undefined) { STR_jenisTarif = $scope.item.jenisTarif.id };
					var STR_kelas = "";
					if ($scope.item.kelas != undefined) { STR_kelas = $scope.item.kelas.id };

					var STR_mataUang = "";
					if ($scope.item.mataUang != undefined) { STR_mataUang = $scope.item.mataUang.id };
					var STR_persenDiscount = "";
					if ($scope.item.persenDiscount != undefined) { STR_persenDiscount = $scope.item.persenDiscount };
					var STR_factorRate = "";
					if ($scope.item.factorRate != undefined) { STR_factorRate = $scope.item.factorRate };
					var STR_qtyCurrentStok = "";
					if ($scope.item.qtyCurrentStok != undefined) { STR_qtyCurrentStok = $scope.item.qtyCurrentStok };
					var STR_tglBerlakuAkhir = "";
					if ($scope.item.tglBerlakuAkhir != undefined) { STR_tglBerlakuAkhir = dateHelper.formatDate($scope.item.tglBerlakuAkhir, "YYYY-MM-DD") };//
					var STR_tglBerlakuAwal = "";
					if ($scope.item.tglBerlakuAwal != undefined) { STR_tglBerlakuAwal = dateHelper.formatDate($scope.item.tglBerlakuAwal, "YYYY-MM-DD") };//$scope.item.tglBerlakuAwal};
					var STR_tglKadaluarsaLast = "";
					if ($scope.item.tglKadaluarsaLast != undefined) { STR_tglKadaluarsaLast = dateHelper.formatDate($scope.item.tglKadaluarsaLast, "YYYY-MM-DD") };//$scope.item.tglKadaluarsaLast};
					var STR_reportDisplay = "";
					if ($scope.item.reportDisplay != undefined) { STR_reportDisplay = $scope.item.reportDisplay };
					var STR_kodeExternal = "";
					if ($scope.item.kodeExternal != undefined) { STR_kodeExternal = $scope.item.kodeExternal };
					var STR_namaExternal = "";
					if ($scope.item.namaExternal != undefined) { STR_namaExternal = $scope.item.namaExternal };

					var STR_hargaSatuan = "";
					if ($scope.item.hargaSatuan != undefined) { STR_hargaSatuan = $scope.item.hargaSatuan };
					var STR_hargaNetto1 = "";
					if ($scope.item.hargaNetto1 != undefined) { STR_hargaNetto1 = $scope.item.hargaNetto1 };

					var STR_hargaNetto2 = "";
					if ($scope.item.hargaNetto2 != undefined) { STR_hargaNetto2 = $scope.item.hargaNetto2 };

					var STR_hargaDiscount = "";
					if ($scope.item.hargaDiscount != undefined) { STR_hargaDiscount = $scope.item.hargaDiscount };

					var STR_Id_hargaNetto_M = "";
					if ($scope.item.id_hn_m != undefined) { STR_Id_hargaNetto_M = $scope.item.id_hn_m };

					var dataObjPostH = {};
					var dataObjPostD = {};
					var dataObjPost = [];
					dataObjPostD = {}
					dataObjPostH = {
						"id_hn_m": STR_Id_hargaNetto_M,
						"idHead": Idsakarepmu,
						"objectprodukfk": objectprodukfkS,
						"objectjenistariffk": STR_jenisTarif,
						"objectasalprodukfk": STR_asalProduk,
						"objectkelasfk": STR_kelas,
						"objectmatauangfk": STR_mataUang,
						"persendiscount": STR_persenDiscount,
						"factorrate": STR_factorRate,
						"qtycurrentstok": STR_qtyCurrentStok,
						"tglberlakuakhir": STR_tglBerlakuAkhir,
						"tglberlakuawal": STR_tglBerlakuAwal,
						"tglkadaluarsalast": STR_tglKadaluarsaLast,
						"reportdisplay": STR_reportDisplay,
						"kodeexternal": STR_kodeExternal,
						"namaexternal": STR_namaExternal,
						"harganetto1": STR_hargaNetto1,
						"harganetto2": STR_hargaNetto2,
						"hargasatuan": STR_hargaSatuan,
						"hargadiscount": STR_hargaDiscount,
						"suratkeputusanfk": $scope.item.suratKeputusan.id,
						"objectjenispelayananfk": $scope.item.jenisPelayanan.id
					};
					dataObjPost = {
						"jenis": 'simpan',
						"head": dataObjPostH,
						// "detail":dataObjPostD
						"detail": data2
					};
					medifirstService.post('sysadmin/master/save-harganettoprodukbykelas', dataObjPost).then(function (e) {
						// debugger;
						Idsakarepmu = e.data.id;//arrPeriode(0);
						// $scope.produkInput = true;
						// $scope.produkCombo = false;
						LoadData();
						$state.go("HargaNettoProdukByKelas");
					})

					
				}
			}

			$scope.columnKomponen = [
				{
					"field": "no",
					"title": "No",
					"width": "30px",
				},
				{
					"field": "komponenharga",
					"title": "Komponen Harga",
					"width": "100px"
				},
				{
					"field": "factorrate",
					"title": "Factor Rate",
					"width": "50px"
				},
				{
					"field": "hargadiscount",
					"title": "Harga Discount",
					"width": "70px",
					"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
				},
				{
					"field": "harganetto1",
					"title": "Harga Netto1",
					"width": "70px",
					"template": "<span class='style-right'>{{formatRupiah('#: harganetto1 #', '')}}</span>"
				},
				{
					"field": "harganetto2",
					"title": "Harga Netto2",
					"width": "70px",
					"template": "<span class='style-right'>{{formatRupiah('#: harganetto2 #', '')}}</span>"
				},
				{
					"field": "hargasatuan",
					"title": "Harga Satuan",
					"width": "70px",
					"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
				},
				{
					"field": "persendiscount",
					"title": "Persen Discount",
					"width": "50px"
				}
			];

			$scope.klik = function (current) {
				// debugger;
				// idDetail = current.id;
				$scope.item.komponen = { id: current.objectkomponenhargafk, komponenharga: current.komponenharga };
				$scope.item.factorRate2 = current.factorrate;
				$scope.item.hargaDiscount2 = current.hargadiscount;
				$scope.item.hargaNetto12 = current.harganetto1;
				$scope.item.hargaNetto22 = current.harganetto2;
				$scope.item.hargaSatuan2 = current.hargasatuan;
				$scope.item.persenDiscount2 = current.persendiscount;
				$scope.item.no = current.no
			}
		}
	]);
});

