define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('VerifikasiSetoranCtrl', ['$scope', '$state', '$mdDialog', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($scope, $state, $mdDialog, cacheHelper, dateHelper, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.isRouteLoading = false;
			var sourceDataGrid = [];
			$scope.dataLogin = medifirstService.getPegawaiLogin();
			$scope.item.tglAwal = new Date();
			$scope.item.tglbku = new Date();
			$scope.item.tglTransferKeBank = new Date();
			$scope.item.tglAkhir = new Date();
			$scope.kas = {}
			$scope.bank = {}
			$scope.lampiran = {}
			$scope.kas.periode = new Date()
			var tempTr = '';
			var kdKelompokTransaksi
			var resultKelompok = []
			loadCombo();
			showButton();
			loadCache();

			function showButton() {
				$scope.showBtnTerima = true;
				$scope.showBtnDetail = true;
			};

			function loadCombo() {
				$scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
				$scope.item.ruangan = $scope.listRuangan[0].namaruangan
				$scope.listKdPerkiraan = [{ "id": 1, "name": "41112100000000" }, { "id": 2, "name": "4111001" }];
				medifirstService.get('bendaharapenerimaan/get-data-combo').then(function (dat) {
					var dataCombo = dat.data;
					$scope.listNamaBank = dataCombo.listbank;
					$scope.listCaraBayar = dataCombo.carabayar;
					$scope.listnamaBankTransfer = dataCombo.listbankaccount;
					$scope.listAsalProduk = dataCombo.asalproduk;
				});
			};

			$scope.formatRupiah = function (value, currency) {
				if (value == "undefined" || value == "null") {
					value = 0;
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				} else {
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				}
			};

			function simpanCache() {
				//SIMPAN CAHCE
				var tglAwal1 = dateHelper.formatDate($scope.item.tglAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tglAkhir, "YYYY-MM-DD");
				var chaceFilter = tglAwal1 + "~" + tglAkhir1 + "~"
				cacheHelper.set('filterHistory', chaceFilter);
				///END
			};

			function loadCache() {
				//ON LOAD with Params
				var chaceFilter = cacheHelper.get('filterHistory');
				if (chaceFilter != undefined) {
					var arrPeriode = chaceFilter.split('~');
					$scope.item.tglAwal = new Date(arrPeriode[0]);
					$scope.item.tglAkhir = new Date(arrPeriode[1]);
					loadData()
				}
				else {
					$scope.item.tanggalAwal = $scope.now;
					$scope.item.tanggalAkhir = $scope.now;
				};
				///END/// ON LOAD with Params
			}

			$scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataSource._data, function (data) {
					return data.nohistori == dataItem.nohistori;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
					for (let i = 0; i < $scope.selectedData.length; i++) {
						if (dataSelect.nohistori == $scope.selectedData[i].nohistori) {
							$scope.selectedData.splice([i], 1)
							break
						}
					}
				}
				else {
					dataSelect.statCheckbox = true;
					$scope.selectedData.push(dataSelect)
				}
				console.log($scope.selectedData)
			}

			function loadData() {
				$scope.selectedData = [];

				var tglAwal1 = dateHelper.formatDate($scope.item.tglAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tglAkhir, "YYYY-MM-DD");

				if ($scope.item.kelompokTransaksi != undefined) {
					var jt = $scope.item.kelompokTransaksi.id
				};
				if ($scope.item.noRekening != undefined) {
					var nr = $scope.item.noRekening.nama
				};
				var namaPerkiraan = ""
				if ($scope.item.namaPerkiraan != undefined) {
					namaPerkiraan = $scope.item.namaPerkiraan
				}
				var keterangan = ""
				if ($scope.item.keterangan != undefined) {
					keterangan = $scope.item.keterangan
				}
				var keterangan = ""
				if ($scope.item.keterangan != undefined) {
					keterangan = $scope.item.keterangan
				}
				var nohitori = ""
				if ($scope.item.nohitori != undefined) {
					nohitori = $scope.item.nohitori
				}
				nohitori
				$scope.isRouteLoading = true;
				medifirstService.get('bendaharapenerimaan/get-daftar-setoran-kasir?tglAwal=' + tglAwal1 + "&tglAkhir=" +
					tglAkhir1
					+ "&jenisTransaksi=" + jt
					+ "&noRekening=" + nr
					+ "&namaPerkiraan=" + namaPerkiraan
					+ "&keterangan=" + keterangan
					+ "&nohitori=" + nohitori
				).then(function (data) {
					$scope.isRouteLoading = false;
					$scope.saldoLama = data.data.saldolama
					$scope.saldoAkhir = data.data.saldoAkhir
					$scope.jumlahK = data.data.jumlahK
					$scope.newtotaldebit = 0
					$scope.newtotaltransfer = 0
					$scope.newtotalkredit = 0
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
						data.data.data[i].nontunai = parseFloat(data.data.data[i].nontunai)
						if (data.data.data[i].penyetor != null)
							data.data.data[i].kettransaksi = 'a.n ' + data.data.data[i].penyetor
						data.data.data[i].statCheckbox = false;

						$scope.newtotaldebit = $scope.newtotaldebit + data.data.data[i].debit
						$scope.newtotaltransfer = $scope.newtotaltransfer + data.data.data[i].nontunai
						$scope.newtotalkredit = $scope.newtotalkredit + data.data.data[i].kredit
					}
					//$scope.newsaldoakhir = parseFloat($scope.newtotalkredit) - (parseFloat($scope.newtotaldebit) + parseFloat($scope.newtotaltransfer))
					$scope.newsaldoakhir = data.data.data[data.data.data.length - 1].saldo

					var result = []
					result = data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: result.data,//data,
						//pageSize: 10,
						total: result.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
									jasa: { type: "nontunai" }
								}
							}
						},
						aggregate: [

							{ field: 'nontunai', aggregate: 'sum' },
							// { field: 'saldo', aggregate: 'sum' },
						]
					});

				});

			};

			$scope.columnGridKelompokTransaksi = {
				excel: {
					fileName: "Buku Kas UMUM " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
						+ moment($scope.item.tglAwal).format('DD/MMM/YYYY') + ".xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:H1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Buku Kas Umum",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						field: "total", title: "Total", width: "150px"
					},
					{
						field: "kelompoktransaksi", title: "Nama Transaksi", width: "150px"
					},
					// {
					// 	field: "carabayar", title: "Cara Bayar", width: "150px"
					// },
					// {
					// 	field: "kelompoktransaksi", title: "Nama kelompok transaksi", width: "150px"
					// },
					// {
					// 	field: "totalpenerimaan", title: "Account Debit", width: "150px",
					// 	"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp. ')}}</span>"
					// },
					// {
					// 	field: "totalpenerimaan", title: "Account Kredit", width: "150px",
					// 	template: "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp. ')}}</span>",
					// }
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
				pageable: {
					messages: {
						display: "Menampilkan {0} - {1} data dari {2} data"
					},
					refresh: true,
					pageSizes: true,
					buttonCount: 5
				}
			};

			$scope.columnGrid = {
				toolbar: [
					"excel",
					{
						name: "penerimaan", text: "Penerimaan",
						template: '<button ng-click="Terima()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Penerimaan</button>'
					},
					{
						name: "create", text: "Pengeluaran",
						template: '<button ng-click="Pengeluaran()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-cancel"></span>Pengeluaran</button>'
					},
					{
						name: "saldoLama", text: "Saldo Lama",
						template: '<button ng-click="" class="k-button k-button-icontext k-grid-upload">Saldo Awal : {{formatRupiah(saldoLama,"Rp. ")}}</button>'
					},
				],
				excel: {
					fileName: "Buku Kas UMUM " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
						+ moment($scope.item.tglAwal).format('DD/MMM/YYYY') + ".xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:H1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Buku Kas Umum",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					// { 
					// 	field: "no", title: "No", width:"60px", 
					// },
					{
						"title": "",
						template: "# if (statCheckbox) { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							"# } else { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							"# } #",
						width: "30px"
					},
					{
						field: "tglStruk", title: "Tanggal", width: "100px",
						// template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
					},
					{
						field: "tgltransferkerekbank", title: "Tanggal Transfer Ke Rek Bank", width: "100px",
						// template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
					},
					{
						field: "nobukti", title: "No. Bukti", width: "130px"
					},
					{
						field: "nohistori", title: "No. Histori", width: "100px"
					},
					// {  
					// 	field: "kdmataanggaran",title: "MAK",width:"100px"  
					// },
					// {
					// 	field: "kdperkiraan", title: "Kd. Perkiraan", width: "150px"
					// },
					// {
					// 	field: "namaperkiraan", title: "Nama Perkiraan", width: "230px"
					// },
					{
						field: "jenisTransaksi", title: "Jenis Transaksi", width: "150px",
						template: "<span class='style-left'>#: jenisTransaksi #</span>"
					},
					{
						field: "kettransaksi", title: "Keterangan Transaksi", width: "150px",
						template: "<span class='style-left'>#: kettransaksi #</span>"
					},
					{
						field: "debit", title: "Penerimaan (Debit)", width: "180px",
						template: "<span class='style-right'>{{formatRupiah('#: debit #', 'Rp. ')}}</span>",
					},
					{
						field: "nontunai", title: "Transfer", width: "180px",
						template: "<span class='style-right'>{{formatRupiah('#: nontunai #', 'Rp. ')}}</span>",
						aggregates: ["sum"],
						attributes: { style: "text-align:right;" },
						//footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#:data.nontunai.sum  #', '')}}</span>"
					},
					{
						field: "kredit", title: "Pengeluaran (Kredit)", width: "180px",
						template: "<span class='style-right'>{{formatRupiah('#: kredit #', 'Rp. ')}}</span>",
						footerTemplate: "<span class='style-right'>{{formatRupiah(jumlahK,'Rp. ')}}</span>"
					},
					{
						field: "saldo", title: "Saldo", width: "180px",
						template: "<span class='style-right'>{{formatRupiah('#: saldo #', 'Rp. ')}}</span>",
						footerTemplate: "<span class='style-right'>{{formatRupiah(newsaldoakhir,'Rp. ')}}</span>"
					},
					{
						command: {
							text: "Verifikasi", width: "40px", align: "center",
							attributes: { align: "center" },
							click: openpopUpVerifikasi,
							imageClass: "k-icon k-delete"
							// template: "<div class='k-button  k-button-icontext k-grid-upload'><span class='k-icon k-delete'></span>Hapus</div>"
						},
						title: "",
						width: "100px",
					}
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
				pageable: {
					messages: {
						display: "Menampilkan {0} - {1} data dari {2} data"
					},
					refresh: true,
					pageSizes: true,
					buttonCount: 5
				}
			};

			function openpopUpVerifikasi(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				var stt = 'false'
				if (confirm('Yakin mau Verifikasi data ini? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					return;
					stt = 'false'
				}
				if (stt) {
					$scope.penerimaan = true
					loadComboPopup()
					tempTr = dataItem
					$scope.item.jumlahRp = tempTr.debit
					$scope.popUpVerifikasi.center().open()
					$scope.item.kelompoktransaksi = ""
					// grid kelompok transaksi
					medifirstService.get('bendaharapenerimaan/get-daftar-kelompok-transaksi?norec_closing=' + tempTr.norec_closing
					).then(function (data) {
						debugger
						resultKelompok = data.data
						$scope.dataSourceKelompokTransaksi = new kendo.data.DataSource({
							data: resultKelompok.data,//data,
							//pageSize: 10,
							total: resultKelompok.data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										jasa: { type: "nontunai" }
									}
								}
							},

						});

					});
				}
			}

			$scope.SaveKelompokTransaksi = function () {
				debugger
				var dataItem = tempTr;
				if (dataItem.noverifikasiveriffk != null) {
					toastr.info('Transaksi Sudah Di Verifikasi')
					return
				}
				var stt = 'false'
				if (confirm('Yakin mau Verifikasi data ini? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					return;
					stt = 'false'
				}
				if (stt) {
					var strukresep = {
						nojurnal: '-',
						tglentry: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
						deskripsi: '-'
					}
					for (var i = resultKelompok.data.length - 1; i >= 0; i--) {
						var data = {};
						var data2 = [];
						data = {
							no: 1,
							accountid: resultKelompok.data[i].objectcoadebitfk,
							noaccount: resultKelompok.data[i].noaccountdebit,
							namaaccount: resultKelompok.data[i].namaaccountdebit,
							namaaccount2: resultKelompok.data[i].namaaccountdebit,
							hargasatuand: resultKelompok.data[i].total,
							hargasatuank: '0',
							keteranganlainnya: ''
						}
						data2.push(data)
						data = {
							no: 2,
							accountid: resultKelompok.data[i].objectcoakreditfk,
							noaccount: resultKelompok.data[i].noaccountkredit,
							namaaccount: "--- " + resultKelompok.data[i].namaaccountkredit,
							namaaccount2: resultKelompok.data[i].namaaccountkredit,
							hargasatuand: '0',
							hargasatuank: resultKelompok.data[i].total,
							keteranganlainnya: ''
						}
						data2.push(data)
						var objSave =
						{
							head: strukresep,
							detail: data2
						}
						medifirstService.post('akuntansi/save-entry-jurnal', objSave).then(function (e) {

						})
					}
					var itemDelete = {
						"norec_closing": dataItem.norec_closing,
						"tglsetor": moment($scope.item.tglbku).format('YYYY-MM-DD HH:mm'),
						"tgltransferkerekbank": moment($scope.item.tglTransferKeBank).format('YYYY-MM-DD HH:mm'),
						"noBukti": $scope.item.noBukti,
						"ketTransaksi": $scope.item.ketTransaksi
					}
					medifirstService.post('bendaharapenerimaan/verifikasi-Setoran', itemDelete).then(function (e) {
						if (e.status === 201) {

							loadData();
						}
					})
				}
			}

			$scope.SearchData = function () {
				loadData();
				simpanCache()
			};

			$scope.$watch('item.caraBayar', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.caraBayarNonTunai = false
					if ($scope.item.caraBayar.caraBayar != "TUNAI") {
						$scope.caraBayarNonTunai = true
					}
				}
			});

			// $scope.handleInputBlur = function () {
			// 	var duit = $scope.item.jumlah
			// 	medifirstService.get("sysadmin/general/valet/terbilang/" + duit).then(
			// 		function (data) {
			// 			$scope.item.terbilang = data.terbilang;
			// 		})
			// 	$scope.item.jumlah = duit;
			// }

			$scope.$watch('item.jumlahRp', function (newValue, oldValue) {
				if (newValue != "") {
					medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
						function (dat) {
							$scope.item.terbilang = dat.data.terbilang;
						})
				}
			});


			$scope.Terima = function () {
				kosongkan()
				$scope.txtDisable = false
				$scope.penerimaan = true
				$scope.popUpPenerimaan.center().open();
				// Get current actions
				var actions = $scope.popUpPenerimaan.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popUpPenerimaan.setOptions({ actions: actions });
				loadComboPopup()
			};

			$scope.Pengeluaran = function () {
				kosongkan()
				var tempData = [];
				$scope.item.jumlahRp = 0
				if ($scope.selectedData.length > 0) {
					for (var i = 0; i < $scope.selectedData.length; i++) {
						$scope.item.jumlahRp = $scope.item.jumlahRp + $scope.selectedData[i].debit + $scope.selectedData[i].nontunai
						var item = {
							"nohistori": $scope.selectedData[i].nohistori,
						}
						tempData.push(item);
					}
					// $scope.selectedData.forEach(function (items) {
					// 	$scope.item.jumlahRp = $scope.item.jumlahRp + $scope.selectedData.debit 
					// 	var item = {
					// 		"nohistori": items.nohistori,
					// 	}
					// 	tempData.push(item);
					// })
					$scope.item.jumlah = "Rp " + parseFloat($scope.item.jumlahRp).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
					$scope.penerimaan = false
					$scope.txtDisable = false
					$scope.item.asalProduk = { id: "17", asalproduk: "Retribusi Pelayanan Kesehatan" }
					$scope.popUpPengeluaran.center().open();

					//Get current actions
					var actions = $scope.popUpPengeluaran.options.actions;
					// Remove "Close" button
					actions.splice(actions.indexOf("Close"), 1);
					// Set the new options
					$scope.popUpPengeluaran.setOptions({ actions: actions });

					toastr.info(tempData.length + ' data di pilih ')
					loadComboPopup()
				}
				if (tempData.length == 0) {
					toastr.error('Belum ada data yang di pilih !')
					return;
				}



				// kosongkan()
				// $scope.item.jumlahRp = $scope.dataSelected.debit 
				// $scope.item.jumlah = "Rp " + parseFloat($scope.dataSelected.debit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") 
				// $scope.penerimaan = false
				// $scope.txtDisable = false
				// $scope.item.asalProduk = {id: "17", asalproduk: "Retribusi Pelayanan Kesehatan"}
				// $scope.popUpPengeluaran.center().open();
				// // Get current actions
				// var actions = $scope.popUpPengeluaran.options.actions;
				// // Remove "Close" button
				// actions.splice(actions.indexOf("Close"), 1);
				// // Set the new options
				// $scope.popUpPengeluaran.setOptions({ actions: actions });
				// loadComboPopup()
			};

			$scope.batalPenerimaan = function () {
				kosongkan()
				$scope.popUpPengeluaran.close();
				$scope.popUpPenerimaan.close();
				$scope.popUpVerifikasi.close();
				loadCombo()
			}

			function loadComboPopup() {
				var ket = ""
				if ($scope.item.ruangan == "Bendahara Penerimaan") {
					if ($scope.penerimaan == true) {
						ket = "Penerimaan BP"
						medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
							+ ket)
							.then(function (dat) {
								$scope.listJenisTransaksi = dat.data.kelompoktransaksi;
								$scope.listMataAnggaran = dat.data.mataanggaran;

							});
					} else {
						ket = "Pengeluaran BP"
						medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
							+ ket)
							.then(function (data) {
								$scope.listJenisTransaksi = data.data.kelompoktransaksi;
								$scope.listMataAnggaran = data.data.mataanggaran;
							});
					}
				} else {
					if ($scope.penerimaan == true) {
						ket = "Penerimaan BK"
						medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
							+ ket)
							.then(function (dat) {
								$scope.listJenisTransaksi = dat.data.kelompoktransaksi;
								$scope.listMataAnggaran = dat.data.mataanggaran;

							});
					} else {
						ket = "Pengeluaran BK"
						medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
							+ ket)
							.then(function (data) {
								$scope.listJenisTransaksi = data.data.kelompoktransaksi;
								$scope.listMataAnggaran = data.data.mataanggaran;
							});
					}
				}

			}

			$scope.SavePenerimaan = function () {
				if ($scope.item.jumlahRp == "") {
					toastr.error("Jumlah belum diisi!");
					return;
				}
				if ($scope.item.ketTransaksi == "") {
					toastr.error("Nama Perkiraan belum diisi!");
					return;
				}
				if ($scope.item.jenisTransaksi == undefined) {
					toastr.error("Keompok Transaksi belum di pilih!");
					return;
				}
				var sumberDana = null
				if ($scope.item.asalProduk != undefined) {
					sumberDana = $scope.item.asalProduk.id
				}

				var kdPerkiraan = ""
				if ($scope.item.kdPerkiraan != undefined)
					kdPerkiraan = $scope.item.kdPerkiraan

				var ketTransaksi = ""
				if ($scope.item.ketTransaksi != undefined)
					ketTransaksi = $scope.item.ketTransaksi

				var dataObjPost = {};

				dataObjPost = {
					keterangan: $scope.item.keterangan,
					tglbku: moment($scope.item.tglbku).format('YYYY-MM-DD HH:mm'),
					totalSetor: $scope.item.jumlahRp,
					jenisTransaksi: $scope.item.jenisTransaksi.kelompoktransaksifk,//$scope.item.jenisTransaksi.id,
					caraBayar: 1,//$scope.item.caraBayar.id,
					detailBank: 'KOSONG',
					penerimaan: $scope.penerimaan,
					keterangantransaksi: $scope.item.ketTransaksi,
					kdperkiraan: $scope.item.kdPerkiraan,
					nobukti: $scope.item.noBukti,
					sumberdana: sumberDana
					// objectmataanggaranfk:$scope.item.mataAnggaran.norec,
				}
				// }
				medifirstService.post('bendaharapenerimaan/simpan-penerimaan-bank', dataObjPost).then(function (e) {
					kosongkan();
					loadData()
				})
			}

			function kosongkan() {
				// $scope.item.tglbku ='';
				$scope.item.keterangan = '';
				$scope.item.ketTransaksi = '';
				$scope.item.ketTransaksi = '';
				$scope.item.kdPerkiraan = '';
				$scope.item.jumlah = '';
				$scope.item.jenisTransaksi = undefined;
				$scope.item.caraBayar = undefined;
				$scope.item.namaBank = undefined;
				$scope.item.namaBankTransfer = undefined;
				$scope.item.namaKartu = '';
				$scope.item.terbilang = '';

			}
			$scope.klikGridKelompokTransaksi = function (dataSelectedKelompokTransaksi) {
				// kdKelompokTransaksi = dataSelectedKelompokTransaksi.objectkelompoktransaksifk
				// $scope.popUpVerifikasi.close()
				// var confirm = $mdDialog.prompt()
				// 	.title('Kelompok Transaksi Yang Anda Pilih Adalah...')
				// 	.placeholder('Kelompok Transaksi')
				// 	.ariaLabel('Lucky day')
				// 	.cancel('Tidak')
				// 	.initialValue(dataSelectedKelompokTransaksi.kelompoktransaksi)
				// 	.ok('Okay!')
				// 	.cancel('Tidak');
				// $mdDialog.show(confirm).then(function (result) {
				// 	kdKelompokTransaksi = dataSelectedKelompokTransaksi.objectkelompoktransaksifk
				// 	$scope.item.kelompoktransaksi = dataSelectedKelompokTransaksi.kelompoktransaksi
				// 	$scope.popUpVerifikasi.center().open()
				// }, function () {
				// 	return
				// });
			}
			$scope.Detail = function () {
				$scope.txtDisable = false
				// $scope.showBtnSimpan = true
				$scope.showJenisTransaksi1 = true
				$scope.showJenisTransaksi2 = false
				$scope.showCaraBayar1 = true
				$scope.showCaraBayar2 = false
				$scope.showNamaBank1 = true
				$scope.showNamaBank2 = false
				loadComboPopup()
				$scope.listJenisTransaksi = ([{ id: $scope.dataSelected.idJenisTransaksi, kelompokTransaksi: $scope.dataSelected.jenisTransaksi }])

				$scope.item.keterangan = $scope.dataSelected.keterangan
				$scope.item.jumlah = $scope.dataSelected.totalSetor
				$scope.item.jenisTransaksi = { id: $scope.dataSelected.idJenisTransaksi, kelompokTransaksi: $scope.dataSelected.jenisTransaksi }
				$scope.popUpPenerimaan.center().open();

			};
			$scope.changePage2 = function (stateName) {
				var noSetorr = "No Data !!"
				if ($scope.dataSelected != undefined) {
					noSetorr = $scope.dataSelected.noStruk
				};
				var obj = {
					splitString: "MonitoringRekeningKoranBendaharaPenerimaan" + "~" + noSetorr + "~Detail~"
				};

				$state.go(stateName, {
					dataFilter: JSON.stringify(obj)
				});
			};
			$scope.ClearData = function () {
				$scope.item.kelompokTransaksi = ''
				$scope.item.noRekening = ''
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

			$scope.cetakLapHarianKasBank = function () {
				$scope.isRouteLoading = true;
				var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
				var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');


				var data =
				{
					tempbku: sourceDataGrid,
					saldoakhir: $scope.saldoAkhir,
					saldoawal: $scope.saldoLama

				}
				medifirstService.post('bendaharapenerimaan/save-temp-bku', data).then(function (e) {
					$scope.isRouteLoading = false;
					var kelompokTransaksi = 'BANK BENDAHARA PENERIMAAN';
					if ($scope.item.kelompokTransaksi != undefined) {
						kelompokTransaksi = $scope.item.kelompokTransaksi.kelompokTransaksi
					}
					var idBKU = e.data.data.idbukukasumum
					if (confirm('View Lapopra Harian Kas Bank? ')) {
						stt = 'true';
					} else {
						var stt = 'false'
					}
					// Do nothing!
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-harian-kasbank=' + idBKU
						+ '&tglAwal=' + tglawal
						+ '&tglAkhir=' + tglakhir
						+ '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap
						+ '&judul=' + kelompokTransaksi, function (response) {
						});
				})
			}

			$scope.cetakBerita = function () {
				var tmp = []
				tmp.push({
					'jenis': 'kas',
					'penerimaan': parseFloat($scope.kas.penerimaan),
					'pengeluaran': parseFloat($scope.kas.pengeluaran),
					'jumlah': parseFloat($scope.kas.jumlah),
					'saldoawal': parseFloat($scope.kas.saldoAwal),
					'saldoakhir': parseFloat($scope.kas.saldoAkhir),
				})
				tmp.push({
					'jenis': 'bank',
					'penerimaan': parseFloat($scope.bank.penerimaan),
					'pengeluaran': parseFloat($scope.bank.pengeluaran),
					'jumlah': parseFloat($scope.bank.jumlah),
					'saldoawal': parseFloat($scope.bank.saldoAwal),
					'saldoakhir': parseFloat($scope.bank.saldoAkhir),
				})

				var obj = {
					tempdata: tmp
				}
				medifirstService.post('bendaharapenerimaan/save-temp-beritaacara', obj).then(function (e) {
					var idTemp = e.data.data.idtempberita
					var now = $scope.kas.periode
					var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
					var _hari = now.getDay();
					var hari = hari[_hari]
					var tgl = dateHelper.getTanggalFormatted(now)
					var jam = moment(now).format('HH:mm') + ' WIB'
					if (confirm('View Berita Acara? ')) {
						var stt = 'true';
					} else {
						var stt = 'false'
					}
					// Do nothing!
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-berita-acara-kasbank=' + hari
						+ '&tgl=' + tgl
						+ '&jam=' + jam
						+ '&idTemp=' + idTemp
						+ '&view=' + stt
						, function (response) {
						});
				})
			}

			$scope.$watch('kas.periode', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.calculateKasBank(newValue)
				}
			});

			$scope.calculateKasBank = function (newValue) {
				var now = newValue
				var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
				var _hari = new Date().getDay();
				var hari = hari[_hari]

				var tglAwal = now.setMonth(now.getMonth())
				tglAwal = moment(new Date(tglAwal)).format('YYYY-MM-01')
				var tglAkhir = moment(now).format('YYYY-MM-DD')

				var sKreditAkhir = 0
				var sDebetAkhir = 0
				var kasPenerimaan = 0
				var kasPengeluaran = 0
				var kasJumlah = 0
				var kasSaldoAwal = 0
				var kasSaldoAkhir = 0

				var bankPenerimaan = 0
				var bankPengeluaran = 0
				var bankJumlah = 0
				var bankSaldoAwal = 0
				var bankSaldoAkhir = 0
				medifirstService.get('bendaharapenerimaan/get-trial-balance?tglAwal='
					+ tglAwal
					+ '&tglAkhir=' + tglAkhir).then(function (e) {
						if (e.statResponse) {
							for (let i in e.data) {
								e.data[i].debetAwal = parseFloat(e.data[i].debetAwal)
								e.data[i].kreditAwal = parseFloat(e.data[i].kreditAwal)
								e.data[i].debetMutasi = parseFloat(e.data[i].debetMutasi)
								e.data[i].kreditMutasi = parseFloat(e.data[i].kreditMutasi)
								sDebetAkhir = parseFloat(e.data[i].debetAwal) + parseFloat(e.data[i].debetMutasi)
								sKreditAkhir = parseFloat(e.data[i].kreditAwal) + parseFloat(e.data[i].kreditMutasi)
								if (sDebetAkhir > sKreditAkhir) {
									e.data[i].debetAkhir = sDebetAkhir - sKreditAkhir
									e.data[i].kreditAkhir = 0
								} else {
									e.data[i].debetAkhir = 0
									e.data[i].kreditAkhir = sKreditAkhir - sDebetAkhir
								}
							}
							var res = e.data
							for (let i in res) {
								if (res[i].idaccount = 1754) {
									kasPenerimaan = res[i].debetMutasi
									kasPengeluaran = res[i].kreditMutasi
									kasJumlah = kasPenerimaan - kasPengeluaran
									kasSaldoAwal = res[i].debetAwal
									kasSaldoAkhir = res[i].debetAkhir
									break
								}
								if (res[i].idaccount = 1760) {//Bank
									bankPenerimaan = res[i].debetMutasi
									bankPengeluaran = res[i].kreditMutasi
									bankJumlah = bankPenerimaan - bankJumlah
									bankSaldoAwal = res[i].debetAwal
									bankSaldoAkhir = res[i].debetAkhir
									break
								}
							}
							$scope.kas.penerimaan = parseFloat(kasPenerimaan).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.kas.pengeluaran = parseFloat(kasPengeluaran).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.kas.jumlah = parseFloat(kasJumlah).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.kas.saldoAwal = parseFloat(kasSaldoAwal).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.kas.saldoAkhir = parseFloat(kasSaldoAkhir).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

							$scope.bank.penerimaan = parseFloat(bankPenerimaan).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.bank.pengeluaran = parseFloat(bankPengeluaran).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.bank.jumlah = parseFloat(bankJumlah).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.bank.saldoAwal = parseFloat(bankSaldoAwal).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.bank.saldoAkhir = parseFloat(bankSaldoAkhir).toFixed(2)//.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

						}

					})
			}
			$scope.showPopUpBerita = function () {
				$scope.calculateKasBank($scope.kas.periode)
				$scope.popUpBeritaAca.center().open()
			}
			$scope.batal = function () {
				$scope.popUpBeritaAca.close()
				$scope.popUpLampiran.close()
			}
			$scope.showLampiran = function () {
				$scope.popUpLampiran.center().open()
			}

			$scope.cetakLampiran = function () {
				var data = {
					pecahan100k: $scope.lampiran.seratusK != undefined ? $scope.lampiran.seratusK : 0,
					pecahan50k: $scope.lampiran.limaPuluhK != undefined ? $scope.lampiran.limaPuluhK : 0,
					pecahan20k: $scope.lampiran.duaPuluhK != undefined ? $scope.lampiran.duaPuluhK : 0,
					pecahan10k: $scope.lampiran.sepuluhK != undefined ? $scope.lampiran.sepuluhK : 0,
					pecahan5k: $scope.lampiran.limaK != undefined ? $scope.lampiran.limaK : 0,
					pecahan2k: $scope.lampiran.duaK != undefined ? $scope.lampiran.duaK : 0,
					pecahan1k: $scope.lampiran.satuK != undefined ? $scope.lampiran.satuK : 0,
					pecahan500: $scope.lampiran.limaRatus != undefined ? $scope.lampiran.limaRatus : 0,
					pecahan200: $scope.lampiran.duaRatus != undefined ? $scope.lampiran.duaRatus : 0,
					pecahan100: $scope.lampiran.seratus != undefined ? $scope.lampiran.seratus : 0,
					bribank: $scope.lampiran.briBank != undefined ? $scope.lampiran.briBank : 0,
					depositobank: $scope.lampiran.depositoBank != undefined ? $scope.lampiran.depositoBank : 0,
					terbilangbank: $scope.lampiran.terbilangBank != undefined ? $scope.lampiran.terbilangBank : null,
				}
				var objsave = {
					'tempdata': data
				}
				medifirstService.post('bendaharapenerimaan/save-lampiran-beritaacara', objsave).then(function (e) {
					var idTemp = e.data.data.idtemplampiran
					if (confirm('View  Lampiran Berita Acara? ')) {
						var stt = 'true';
					} else {
						var stt = 'false'
					}
					// Do nothing!
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-lampiran-berita-acara-kasbank=' + idTemp
						+ '&view=' + stt
						, function (response) {
						});
				})
			}
			$scope.$watch('lampiran.depositoBank', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.lampiran.briBank != undefined)
						$scope.lampiran.totalBank = parseFloat(newValue) + parseFloat($scope.lampiran.briBank)
					else
						$scope.lampiran.totalBank = parseFloat(newValue) + 0
				}
			});
			$scope.getTerbilang = function () {
				var duit = $scope.lampiran.totalBank
				medifirstService.getDataGlobal("valet/terbilang/" + duit).then(
					function (data) {
						$scope.lampiran.terbilangBank = data.terbilang;
					})

				$scope.lampiran.totalBank = duit// parseFloat(duit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			}
			////////////// -TAMAT- ////////////////////

		}
	]);
});