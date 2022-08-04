define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RekapTagihanCtrl', ['$state', '$scope', 'MedifirstService', 'DateHelper',
		function ($state, $scope, medifirstService, dateHelper) {
			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.dataParams = JSON.parse($state.params.dataPasien);
			$scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));

			var judul = "Rekap Tagihan Pasien";

			$scope.totalDeposit = 0
			$scope.totalTagihan = 0
			$scope.totalDibayar = 0
			$scope.sisaTagihan = 0
			$scope.rincianPelayanan = []
			var arrayCeklisDelete = []
			var tglMaxPosting = ''
			var arrayTglPosting = []

			formLoad();
			getHeaderPasien()
			getRekapTagihan()
			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.formatTanggalAjah = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			function formLoad() {

				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: []
				});


			}

			function getHeaderPasien(noregis) {
				var noRegistrasi = ""
				if (noregis != undefined) {
					noRegistrasi = noregis
				} else {
					noRegistrasi = $scope.dataParams.noRegistrasi
				}


				medifirstService.get("tatarekening/get-header-data-pasien/" + noRegistrasi).then(function (e) {
					if (e.data.data != null) {
						var result = e.data.data
						var tanggalLahir = new Date(result.tgllahir);
						var umur = dateHelper.CountAge(tanggalLahir, new Date());
						result.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
						result.tglregistrasi = $scope.formatTanggal(result.tglregistrasi)
						if (result.tglpulang)
							result.tglpulang = $scope.formatTanggal(result.tglpulang)
						result.tgllahir = $scope.formatTanggalAjah(result.tgllahir)
						$scope.item = result
					} else {
						$scope.item = {}
					}


				})
			}
			$scope.CariNoreg = function () {
				getHeaderPasien($scope.item.noregistrasi)
				getRekapTagihan($scope.item.noregistrasi)
			}
			function getRekapTagihan(noregis) {
				var noRegistrasi = ""
				if (noregis != undefined) {
					noRegistrasi = noregis
				} else {
					noRegistrasi = $scope.dataParams.noRegistrasi
				}
				$scope.isRouteLoading = true
				$scope.totalDeposit = 0
				medifirstService.get("tatarekening/get-rekap-tagihan-pasien/" + noRegistrasi).then(function (e) {
					$scope.isRouteLoading = false
					if (e.statResponse) {


						var result = e.data.details

						$scope.totalDeposit = e.data.deposit
						$scope.totalDibayar = 0
						for (let i = 0; i < result.length; i++) {
							if (result[i].sbmfk != null)
								$scope.totalDibayar = $scope.totalDibayar + result[i].total

							if (result[i].strukresepfk != null) {
								result[i].ruanganTindakan = 'Pemakaian Obat & Alkes - ' + result[i].ruanganTindakan
								result[i].jenis = 'Resep'
							} else {
								result[i].jenis = 'Layanan'
							}
						}
						$scope.rincianPelayanan = result
						let sama = false
						let arrGroup = [];
						for (let i = 0; i < result.length; i++) {
							sama = false
							for (let x = 0; x < arrGroup.length; x++) {
								if (arrGroup[x].ruanganTindakan == result[i].ruanganTindakan) {
									arrGroup[x].jasa = arrGroup[x].jasa + result[i].jasa
									arrGroup[x].jumlah = arrGroup[x].jumlah + result[i].jumlah
									arrGroup[x].diskon = arrGroup[x].diskon + result[i].diskon
									arrGroup[x].harga = arrGroup[x].harga + result[i].harga
									arrGroup[x].total = arrGroup[x].total + result[i].total

									sama = true;
								}
							}
							if (sama == false) {
								let data = {
									'ruanganTindakan': result[i].ruanganTindakan,
									'total': result[i].total,
									'kelasTindakan': result[i].kelasTindakan,
									'jumlah': result[i].jumlah,
									'harga': result[i].harga,
									'diskon': result[i].diskon,
									'jasa': result[i].jasa,
									'ruid': result[i].ruid,
									'norec_apd': result[i].norec_apd,
									'jenis': result[i].jenis,
								}
								arrGroup.push(data)
							}
						}
						let totals = 0
						$scope.totalTagihan = 0
						arrGroup.sort(function (a, b) {
							if (a.ruanganTindakan < b.ruanganTindakan) { return -1; }
							if (a.ruanganTindakan > b.ruanganTindakan) { return 1; }
							return 0;
						})
						for (let i = 0; i < arrGroup.length; i++) {
							const element = arrGroup[i];
							element.no = i + 1
							totals = element.total + totals
							$scope.totalTagihan = element.total + $scope.totalTagihan
							// element.total = $scope.formatRupiah(element.total, 'Rp. ');
						}
						// $scope.totalDibayar =  parseFloat($scope.totalTagihan) -parseFloat($scope.totalDeposit)
						$scope.sisaTagihan = parseFloat($scope.totalTagihan) - $scope.totalDibayar - parseFloat($scope.totalDeposit)
						// $scope.totalTagihan = $scope.formatRupiah($scope.totalTagihan, 'Rp. ');

						$scope.dataRincianTagihan = new kendo.data.DataSource({
							data: arrGroup,
							schema: {
								model: {
									fields: {
										ruanganTindakan: { type: "string" },
										kelasTindakan: { type: "string" },
										jumlah: { type: "number" },
										harga: { type: "number" },
										diskon: { type: "number" },
										total: { type: "number" },
										jasa: { type: "number" },
										jenis: { type: "string" },
									}
								}
							},
							serverPaging: false,
							pageSize: 10,
							group: [
								{
									field: "jenis", aggregates: [
										{ field: 'total', aggregate: 'sum' },

									]
								},
							],
						});
					}

					var objSave = {
						'noregistrasi': $scope.item.noregistrasi
					}
					medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (res) {})
				}, function (error) {
					$scope.sisaTagihan = 0
					$scope.totalDeposit = 0
					$scope.totalDibayar = 0
					$scope.totalTagihan = 0
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: []
					});

					$scope.isRouteLoading = false
				})
			}



			$scope.columnGrid = {
				toolbar: [
					"excel",
				],
				excel: { fileName: judul + ".xlsx", allPages: true, },
				// pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 3;
					sheet.mergedCells = ["A1:H1"];
					sheet.name = "Rekap Tagihan";

					var myHeaders = [{
						value: judul,
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				sortable: true,
				// pageable: true,
				selectable: "row",
				columns: [
					// {
					// 	"field": "no",
					// 	"title": "No",
					// 	"width": "20px",
					// },
					{
						"field": "ruanganTindakan",
						"title": "Deskripsi",
						"width": "200px",
						groupFooterTemplate: "Total",
					},
					{
						"field": "kelasTindakan",
						"title": "Kelas",
						"width": "100px",
					},
					{
						"field": "jumlah",
						"title": "Jumlah",
						"width": "50px",
						"template": "<span class='style-right'>#: jumlah #</span>"
					},
					{
						"field": "harga",
						"title": "Harga",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: harga #','Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "diskon",
						"title": "Harga Diskon",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: diskon #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "jasa",
						"title": "Jasa",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },

					},
					{
						"field": "total",
						"title": "Total",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
						groupFooterTemplate: "<span>  {{formatRupiah('#=data.total.sum  #', 'Rp. ')}}</span>",
					},
					{
						hidden: true,
						"field": "jenis",
						"title": "Jenis",
						"width": "80px",
						"attributes": { class: "text-center" },
						aggregates: ["count"],
						groupHeaderTemplate: " #= value # "
					},
					// {
					// 	"field": "strukfk",
					// 	"title": "NoStruk/NoSbm",
					// 	"width": "120px"
					// }
					{
						"command": [
							{
								text: "Detail",
								click: getDetailPelayanan,
								imageClass: "k-icon k-i-search"
							}
						],
						title: "",
						width: "70px",
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
			}
			$scope.columnRincians = {
				sortable: true,
				// pageable: true,
				selectable: "row",
				columns: [
					{
						"template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
						"width": "30px",
						"title": "✔"
					},
					{
						field: "tglPelayanan",
						title: "Tanggal ",
						width: "100px",
						template: "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>",
						footerTemplate: "<span class='style-center'>Jumlah</span>",
					},
					{
						"field": "namaPelayanan",
						"title": "Pelayanan",
						"width": "130px"
					},
					{
						"field": "isparamedis",
						"title": "P",
						"width": "30px",
						"template": '# if( isparamedis==1) {# ✔ # } else {# - #} #'
					},
					{
						"field": "iscito",
						"title": "Status Cito ",
						"width": "50px",
						"template": '# if( iscito==1 ) {# ✔ # } else {# - #} #'
					},
					{
						"field": "jumlah",
						"title": "Jumlah",
						"width": "50px",
						attributes: { style: "text-align:right;" },
						aggregates: ["sum"],
						footerTemplate: "<span > {{ #:data.jumlah.sum  # }}</span>"
					},
					{
						"field": "harga",
						"title": "Harga ",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: harga #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
						aggregates: ["sum"],
						footerTemplate: "<span >Rp. {{formatRupiah('#:data.harga.sum  #', '')}}</span>"
					},
					{
						"field": "diskon",
						"title": "Diskon",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: diskon #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
						aggregates: ["sum"],
						footerTemplate: "<span >Rp. {{formatRupiah('#:data.diskon.sum  #', '')}}</span>"
					},
					{
						"field": "jasa",
						"title": "Jasa ",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', 'Rp. ')}}</span>",
						attributes: { style: "text-align:right;" },
						aggregates: ["sum"],
						footerTemplate: "<span >Rp. {{formatRupiah('#:data.jasa.sum  #', '')}}</span>"

					},

					{
						"field": "total",
						"title": "Total",
						"width": "80px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
						aggregates: ["sum"],
						footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
					},

					{
						"field": "strukfk",
						"title": "Verif ",
						"width": "40px",
						"template": '# if( strukfk!=null ) {# ✔ # } else {# - #} #'
					},
					{
						"field": "sbmfk",
						"title": "Bayar ",
						"width": "40px",
						"template": '# if( sbmfk!=null ) {# ✔ # } else {# - #} #'
					},

				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
			};
			$scope.ceklisData = [];
			$scope.onClick = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#kGrid2").data("kendoGrid"),
					dataItem = grid.dataItem(row);

				// $scope.selectedData[dataItem.noRec] = checked;
				if (checked) {
					var result = $.grep($scope.ceklisData, function (e) {
						return e.norec == dataItem.norec;
					});
					if (result.length == 0) {
						$scope.ceklisData.push(dataItem);
					} else {
						for (var i = 0; i < $scope.ceklisData.length; i++)
							if ($scope.ceklisData[i].norec === dataItem.norec) {
								$scope.ceklisData.splice(i, 1);
								break;
							}
						$scope.ceklisData.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.ceklisData.length; i++)
						if ($scope.ceklisData[i].norec === dataItem.norec) {
							$scope.ceklisData.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}
			$scope.TutupPopUp = function () {
				delete $scope.item.ruanganTindakan
				delete $scope.item.kelasTindakan
				$scope.popUpLayanan.close()
			}
			function getDetailPelayanan(e) {
				e.preventDefault();
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				var dataSource = []
				if ($scope.rincianPelayanan.length > 0) {

					for (let i = 0; i < $scope.rincianPelayanan.length; i++) {
						const element = $scope.rincianPelayanan[i];
						if (element.norec_apd == dataItem.norec_apd && element.jenis == dataItem.jenis) {
							dataSource.push(element)
						}
					}
				}

				$scope.item.ruanganTindakan = dataItem.ruanganTindakan
				$scope.item.kelasTindakan = dataItem.kelasTindakan
				$scope.sourceRincians = new kendo.data.DataSource({
					data: dataSource,
					serverPaging: false,
					pageSize: 10,
					schema: {
						model: {
							fields: {
								namaPelayanan: { type: "string" },
								tglPelayanan: { type: "string" },
								iscito: { type: "string" },
								isparamedis: { type: "string" },
								jumlah: { type: "number" },
								harga: { type: "number" },
								diskon: { type: "number" },
								jasa: { type: "number" },
								total: { type: "number" },
							}
						}
					}, aggregate: [
						{ field: 'jumlah', aggregate: 'sum' },
						{ field: 'harga', aggregate: 'sum' },
						{ field: 'diskon', aggregate: 'sum' },
						{ field: 'jasa', aggregate: 'sum' },
						{ field: 'total', aggregate: 'sum' },
					]


				});
				medifirstService.get("tatarekening/tindakan/get-tanggal-posting", true).then(function (dat) {
					tglMaxPosting = dat.data.mindate[0].max
					arrayTglPosting = dat.data.datedate
					$scope.popUpLayanan.center().open()

				})

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
			$scope.CetakBuktiLayanan = function () {
				if ($scope.dataSelected == undefined) {
					toastr.error("Pilih pelayanan dahulu!");
					return;
				}

				var stt = 'false'
				if (confirm('View Bukti Layanan? ')) {

					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();

				client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' +
					$scope.item.noregistrasi + '&strIdPegawai=' + $scope.dataLogin.id + '&strIdRuangan=' +
					$scope.dataSelected.ruid + '&view=' + stt, function (response) {
					});

			}
			$scope.CetakRincianRanap = function () {

				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;

					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya Rawat Inap? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}

					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapRincianBiaya=1&strNoregistrasi='
						+ $scope.item.noregistrasi + '&strNoStruk='
						+ struk + '&strNoKwitansi='
						+ kwitansi + '&strIdPegawai='
						+ $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
							// do something with response
						});

				});
			}
			$scope.Cetak = function () {

				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var NoStruk = $scope.dataRincianTagihan;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}


					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi='
						+ $scope.item.noregistrasi + '&strNoStruk='
						+ struk + '&strNoKwitansi=' +
						kwitansi + '&strIdPegawai=' +
						$scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
							// do something with response
						});
				})

			}

			$scope.CetakRekap = function () {
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rekap Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi='
					+ $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
						// do something with response
					});

			}
			$scope.CetakBillingTotal = function () {
				var struk = "TOTALTOTALTOTAL";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' +
					$scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
						// do something with response
					});
			}

			$scope.CetakBillingNaikKelas = function () {
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya-kelas-dijamin=1&strNoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai='
					+ $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
						// do something with response
					});

			}

			$scope.RincianObat = function () {
				$scope.isRouteLoading = true;
				medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Obat & Alkes? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}

					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strNoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +
						'&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
							// do something with response
						});

				});

			}
			$scope.kembali = function () {
				window.history.back()
			}

			$scope.inputTindakan = function () {
				if ($scope.dataSelected == undefined) {
					toastr.error("Pilih pelayanan dahulu!");
					return;
				}
				medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
					$scope.item.noregistrasi, true).then(function (dat) {
						$scope.statusSelesaiPeriksa = dat.data.data
						if ($scope.statusSelesaiPeriksa) {
							toastr.error('Data Sudah di closing')
							return
						} else {
							if ($scope.item) {
								$state.go('InputTindakan', {
									norecPD: $scope.item.norec_pd,
									norecAPD: $scope.dataSelected.norec_apd,

								});
							} else {
								toastr.error('Pasien belum di pilih')
							}
						}
					});

			}

			$scope.cetakBuktiLayananJasa = function () {
				var daftarCetak = [];
				if ($scope.ceklisData.length > 0) {
					$scope.ceklisData.forEach(function (items) {
						daftarCetak.push(items)
					})
					var resultCetak = daftarCetak.map(a => a.norec).join("|");

					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-jasa-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + $scope.dataLogin.id + '&strIdRuangan=-&view=true', function (response) {
						// do something with response
					});

				} else {
					toastr.error('Ceklis Data Dulu')
				}
			}

			$scope.cetakBuktiLayananPerTindakan = function () {
				var daftarCetak = [];
				if ($scope.ceklisData.length > 0) {
					$scope.ceklisData.forEach(function (items) {
						daftarCetak.push(items)
					})
					var resultCetak = daftarCetak.map(a => a.norec).join("|");

					var client = new HttpClient();
					if (daftarCetak[0].ruid == 44) {
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayananBedah-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + $scope.dataLogin.id + '&strIdRuangan=-&view=true', function (response) {
							// do something with response
						});
					} else {
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + $scope.dataLogin.id + '&strIdRuangan=-&view=true', function (response) {
							// do something with response
						});
					}

				} else {
					toastr.error('Ceklis Data Dulu')
				}
			}
			var logData = []
			$scope.hapusTindakan = function () {

				var tglajah = ''

				if ($scope.ceklisData.length == 0 || $scope.ceklisData.length == undefined) {
					toastr.error('Checklist Data Yang Akan Dihapus!');
					return;
				}

				if ($scope.ceklisData[0].jenis == 'Resep') {
					toastr.error("Data Resep Tidak Bisa Dihapus, Harap Hubungi Farmasi!");
					return;
				}

				if ($scope.ceklisData.length > 0) {

					$scope.ceklisData.forEach(function (items) {
						if (items.strukfk != null) {
							toastr.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
							return;
						}

						if (moment(tglMaxPosting).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
							for (var i = arrayTglPosting.length - 1; i >= 0; i--) {
								if (arrayTglPosting[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
									toastr.error("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
									return;
								}
							}
						} else {
							tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
							medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
								if (dat.data.sudahblm == true) {
									toastr.error("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
									return;
								}
							})
						}
						logData.push(items);
						// tempData.push(item);

						// del pel pasien 
						var objDel = {
							"norec_pp": items.norec,
						}
						arrayCeklisDelete.push(objDel)
						// end


					})
					HapuskanTindkan();
				}


			}

			function HapuskanTindkan() {
				var objDelete = {
					"dataDel": arrayCeklisDelete,
				};

				medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
					if (e.status === 201) {
						var objLog = {
							pelayananpasiendelete: logData
						}
						medifirstService.postNonMessage('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {
						})
					}
					getRekapTagihan($scope.item.noregistrasi)
					var data = $scope.sourceRincians._data
					if (data.length > 0) {
						for (let i = 0; i < data.length; i++) {
							for (let j = 0; j < arrayCeklisDelete.length; j++) {
								if (data[i].norec == arrayCeklisDelete[j].norec_pp) {
									data.splice(i, 1)
								}

							}
						}
					} else {
						data = []
					}

					$scope.sourceRincians = new kendo.data.DataSource({
						data: data,
						serverPaging: false,
						pageSize: 10,
						schema: {
							model: {
								fields: {
									namaPelayanan: { type: "string" },
									tglPelayanan: { type: "string" },
									iscito: { type: "string" },
									isparamedis: { type: "string" },
									jumlah: { type: "number" },
									harga: { type: "number" },
									diskon: { type: "number" },
									jasa: { type: "number" },
									total: { type: "number" },
								}
							}
						}, aggregate: [
							{ field: 'jumlah', aggregate: 'sum' },
							{ field: 'harga', aggregate: 'sum' },
							{ field: 'diskon', aggregate: 'sum' },
							{ field: 'jasa', aggregate: 'sum' },
							{ field: 'total', aggregate: 'sum' },
						]


					});
				})


			}

			$scope.dokter = {}
			$scope.detailDokter = function () {
				if ($scope.dataSelectedRincian == undefined) {
					toastr.error("Pilih pelayanan dahulu!");
					return;
				}

				SeeDokterPelaksana();
				$scope.dokter.tglPelayanans = $scope.formatTanggal($scope.dataSelectedRincian.tglPelayanan)
				$scope.dokter.namaPelayanans = $scope.dataSelectedRincian.namaPelayanan;
				if ($scope.dataSelectedRincian.isparamedis == true)
					$scope.dokter.paramedis = true
				else
					$scope.dokter.paramedis = false
				$scope.popUpDetailDokter.center().open();

			}
			function SeeDokterPelaksana() {
				medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
					$scope.listJenisPelaksana = data.data.jenispetugaspelaksana;

				});
				medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
					$scope.listPegawaiPemeriksa = data;

				});

				medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataSelectedRincian.norec).
					then(function (data) {
						$scope.sourceDokterPelaksana = new kendo.data.DataSource({
							data: data.data.data,
							serverPaging: false,
							pageSize: 10,
						});
					});
			}

			$scope.simpanDokterPelaksana = function () {
				if ($scope.dokter.jenisPelaksana == undefined && $scope.dokter.paramedis == undefined) {
					if ($scope.dokter.jenisPelaksana == undefined) {
						messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
						return
					}
					if ($scope.model.pegawais == undefined) {
						messageContainer.error("Pegawai Tidak Boleh Kosong")
						return
					}
				}


				var norec_ppp = "";
				if ($scope.dataDokterSelected != undefined) {
					norec_ppp = $scope.dataDokterSelected.norec_ppp
				}

				if (norec_ppp == "") {
					if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
						for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
							if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.dokter.jenisPelaksana.jenisPetugasPelaksana
								// && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
							) {
								messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
								return
							}
						}
					}
				}


				var pelayananpasienpetugas = {
					norec_ppp: norec_ppp,
					norec_pp: $scope.dataSelectedRincian.norec,
					norec_apd: $scope.dataSelectedRincian.norec_apd,
					objectjenispetugaspefk: $scope.dokter.jenisPelaksana != undefined ? $scope.dokter.jenisPelaksana.id : undefined,
					objectpegawaifk: $scope.dokter.pegawais != undefined ? $scope.dokter.pegawais.id : undefined,
					isparamedis: $scope.dokter.paramedis,
				}

				var objSave = {
					pelayananpasienpetugas: pelayananpasienpetugas,

				}

				medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
					var jenis = 'Input/Ubah Petugas Layanan';
					var norec = e.data.data.norec
					$scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, 'Input/Ubah Petugas Layanan ' + $scope.dataSelectedRincian.namaPelayanan + ' No Registrasi ' + $scope.item.noregistrasi)
					SeeDokterPelaksana();
					// LoadData();


					if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
						for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
							if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.dokter.paramedis != true && $scope.dokter.pegawais == undefined) {
								$scope.dataSelectedRincian.dokter = $scope.sourceDokterPelaksana[i].namalengkap
								break
							}
							if ($scope.dokter.paramedis == true) {
								$scope.dataSelectedRincian.isparamedis = '✔'
								break
							}
							if ($scope.dokter.paramedis == false) {
								$scope.dataSelectedRincian.isparamedis = '-'
								break
							}
						}
					}
					$scope.dokter.jenisPelaksana = undefined;
					$scope.dokter.pegawais = undefined;
					$scope.dataDokterSelected = undefined;
				})

			}
			$scope.saveLogging = function (jenis, referensi, noreff, ket) {
				medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
					+ "&referensi=" + referensi
					+ "&noreff=" + noreff
					+ "&keterangan=" + ket
				).then(function (data) {

				})
			}

			$scope.hapusDokterPelaksana = function () {
				if ($scope.dataDokterSelected == undefined) {
					messageContainer.error("Pilih data Pegawai dulu!!")
					return
				}

				var pelayananpasienpetugas = {
					norec_ppp: $scope.dataDokterSelected.norec_ppp,

				}

				var objSave = {
					pelayananpasienpetugas: pelayananpasienpetugas,

				}
				medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
					SeeDokterPelaksana();

					$scope.dokter.jenisPelaksana = "";
					$scope.dokter.pegawais = "";
					$scope.dataDokterSelected = undefined;
				})
				// var data = {};
				// if ($scope.dataSelected != undefined && $scope.dokter.jenisPelaksana.id == 4) {
				// 	if ($scope.dataSelected.namaPelayanan == $scope.dokter.namaPelayanans) {
				// 		$scope.dataSelected.dokter = "-"

				// 	}
				// }
			}

			$scope.batalDokterPelaksana = function () {

				$scope.dokter.jenisPelaksana = "";
				$scope.dokter.pegawais = "";
				$scope.dataDokterSelected = undefined;
				$scope.popUpDetailDokter.center().close();


			}
			$scope.columnDokters = [
				{
					field: "jenispetugaspe",
					title: "Jenis Pelaksana",
					width: "100px",

				},
				{
					field: "namalengkap",
					title: "Nama Pegawai",
					width: "200px",

				}
			];

			$scope.komponen = {}
			$scope.komponenHarga = function () {
				if ($scope.dataSelectedRincian == undefined) {
					messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}

				loadKomponen();
				$scope.komponen.tglPelayanans = $scope.formatTanggal($scope.dataSelectedRincian.tglPelayanan)
				$scope.komponen.namaPelayanans = $scope.dataSelectedRincian.namaPelayanan;
				$scope.popupKomponen.center().open();
				// Get current actions
				var actions = $scope.popupKomponen.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popupKomponen.setOptions({ actions: actions });

			}

			function loadKomponen() {
				medifirstService.get("tatarekening/get-komponenharga-pelayanan?norec_pp=" + $scope.dataSelectedRincian.norec).
					then(function (data) {
						$scope.sourceKomponens = new kendo.data.DataSource({
							data: data.data.data,
							serverPaging: false,
							pageSize: 30,
						})
					});
			}
			$scope.klikKomponen = function (dataSelectedKomponen) {
				if (dataSelectedKomponen.komponenharga != "Jasa RS") {
					$scope.DiskonKM = true;
					$scope.label = dataSelectedKomponen.komponenharga;
					$scope.komponen.komponenDis = dataSelectedKomponen.hargasatuan;
					$scope.komponen.persenDiscount = "";
					$scope.komponen.diskonKomponen = "";
					$scope.komponen.JasaKomponen = dataSelectedKomponen.jasa;

				} else {
					$scope.DiskonKM = false;
				}
			}


			$scope.$watch('komponen.persenDiscount', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.komponen.persenDiscount > 100) {
						$scope.komponen.persenDiscount = "";
					}
					$scope.komponen.diskonKomponen = ((parseFloat($scope.komponen.komponenDis)) * $scope.komponen.persenDiscount) / 100
				}
			})
			$scope.columnKomponens = [
				{
					"field": "komponenharga",
					"title": "Komponen",
					"width": "100px",
				},
				{
					"field": "jumlah",
					"title": "Jumlah",
					"width": "50px"
				},
				{
					"field": "hargasatuan",
					"title": "Harga Satuan",
					"width": "80px",
					"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
				},
				{
					"field": "hargadiscount",
					"title": "Diskon",
					"width": "80px",
					"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
				},
				{
					"field": "jasa",
					"title": "Jasa Cito",
					"width": "80px",
					"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
				}

			];
			$scope.UpdateDiskon = function () {
				if ($scope.dataSelectedRincian.strukfk != null) {
					toastr.error('Sudah di Verifikasi  tidak bisa diskon!')
					return
				}

				if ($scope.komponen.diskonKomponen > $scope.dataSelectedKomponen.hargasatuan) {
					toastr.error('Diskon tidak boleh lebih besar dari total jasa!!!')
				} else {
					var objSave = {
						"norec_ppd": $scope.dataSelectedKomponen.norec,
						"norec_pp": $scope.dataSelectedKomponen.norec_pp,
						"hargadiskon": $scope.komponen.diskonKomponen,
						"hargakomponen": $scope.komponen.komponenDis,
						"hargajasa": $scope.komponen.JasaKomponen,
					}
					medifirstService.post('tatarekening/save-update-harga-diskon-komponen', objSave).then(function (data) {
						$scope.saveLogging('Diskon Layanan', 'norec Pelayanan Pasien', $scope.dataSelectedKomponen.norec_pp, 'Diskon Layanan ' + $scope.dataSelectedRincian.namaPelayanan + ' No Registrasi ' + $scope.item.noregistrasi)
						loadKomponen();
					});

					var dataz = {};
					if ($scope.dataSelectedKomponen != undefined) {
						if ($scope.dataRincianTagihan.namaPelayanan == $scope.komponen.namaPelayanans) {
							if ($scope.label == $scope.dataSelectedKomponen.komponenharga) {
								dataz.hargadiscount = $scope.komponen.diskonKomponen
								$scope.dataSelectedKomponen.hargadiscount = $scope.komponen.diskonKomponen
							}
						}
					}
				}
			}
			$scope.BatalDiskon = function () {
				getRekapTagihan($scope.item.noregistrasi)
				$scope.popupKomponen.close();
				$scope.popUpLayanan.close();
			}
			$scope.ubahtangggal = {
				'tanggalPelayanan': new Date()
			}
			$scope.showUbahTanggal = false
			$scope.ubahTanggal = function () {
				if ($scope.dataSelectedRincian == undefined) {
					toastr.error("Pilih pelayanan dahulu!");
					return;
				}

				medifirstService.get("tatarekening/tindakan/get-tanggal-posting", true).then(function (dat) {
					tglMaxPosting = dat.data.mindate[0].max
					arrayTglPosting = dat.data.datedate

					if (moment(tglMaxPosting).format('YYYY-MM-DD 00:00:00') < $scope.dataSelectedRincian.tglPelayanan) {
						for (var i = arrayTglPosting.length - 1; i >= 0; i--) {
							if (arrayTglPosting[i] == parseFloat(moment($scope.dataSelectedRincian.tglPelayanan).format('D'))) {
								toastr.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
								return;
							}

						}
					} else {
						toastr.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
						return;
					}
					$scope.showUbahTanggal = true

				})
			}
			$scope.simpanTanggal = function () {

				var objSave = {
					norec_pp: $scope.dataSelectedRincian.norec,
					tanggalPelayanan: moment($scope.ubahtangggal.tanggalPelayanan).format('YYYY-MM-DD HH:mm:ss')
				}
				medifirstService.post('tatarekening/save-update-tanggal_pelayanan', objSave).then(function (data) {
					getRekapTagihan($scope.item.noregistrasi)

					$scope.popUpLayanan.close();
					$scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelectedRincian.norec, 'Ubah Tanggal Layanan ' + $scope.dataSelectedRincian.namaPelayanan + ' No Registrasi ' + $scope.item.noregistrasi)
					// LoadData()
				});
				$scope.showUbahTanggal = false;
			}
			$scope.batalTanggal = function () {
				$scope.showUbahTanggal = false;
				$scope.ubahtangggal.tanggalPelayanan = "";
			}
			// ##########END##########//
		}
	]);
});