define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarPembayaranCtrl', ['$state', '$mdDialog', '$scope', 'CacheHelper','DateHelper', 'MedifirstService',
    function ($state, $mdDialog, $scope, cacheHelper, dateHelper, medifirstService) {
      $scope.isRouteLoading = false;
      $scope.now = new Date();
      $scope.item = {};
      $scope.dataSbnSelected = {};
      $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
      $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
      var pegawaiUser = [];
      var resultKelompok = []
      LoadCache();

      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarPembayaranCtrl');
        if (chacePeriode != undefined) {
          $scope.item.tglawal = new Date(chacePeriode[0]);
          $scope.item.tglakhir = new Date(chacePeriode[1]);
          loadCombo()
          loadData();
        } else {
          $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
          $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
          loadCombo()
          loadData();
        }
      }

      function loadCombo() {
        medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
          $scope.listKasir = data;
        });        

        medifirstService.get('bendaharapengeluaran/get-data-combo').then(function (dat) {         
          $scope.listCaraBayar = dat.data.carabayar;
          pegawaiUser = medifirstService.getUserLogin();
          if (pegawaiUser.namalengkap == 'Administrator') {
            $scope.item.Kasir = undefined;
          } else {
            $scope.item.Kasir = { id: pegawaiUser.id, namalengkap: pegawaiUser.namalengkap };
          }
        });
      }


      function loadData() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:MM');
        var chacePeriode = tglAwal + "~" + tglAkhir
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);

        var Skasir = "";
        if ($scope.item.kasir != undefined) {
          Skasir = $scope.item.kasir.id;
        }

        var ScaraBayar = "";
        if ($scope.item.caraBayar != undefined) {
          ScaraBayar = $scope.item.caraBayar.id;
        }

        var noSbk = "";
        if ($scope.item.noSBK == undefined) {
          noSbk = $scope.item.noSBK;
        }

        medifirstService.get("bendaharapengeluaran/get-daftar-pembayaran?" +
          "tglAwal=" + tglAwal +
          "&tglAkhir=" + tglAkhir +
          "&Skasir=" + Skasir +
          "&ScaraBayar=" + ScaraBayar +
          "&noSbk=" + noSbk, true).then(function (dat) {
            $scope.isRouteLoading = false;
            var SubTotal = 0;
            for (var i = 0; i < dat.data.daftar.length; i++) {
              dat.data.daftar[i].no = i + 1
              SubTotal = SubTotal + parseInt(dat.data.daftar[i].totaldibayar)
            }

            $scope.dataDaftarPenerimaan = dat.data.daftar;
            pegawaiUser = dat.data.datalogin
            $scope.totalPenerimaan = 'Rp. ' + parseFloat(SubTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: '',
          3: '',
          4: '',
          5: '',
          6: ''
        }
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);
      }

      $scope.columnDaftarPenerimaan = [
        {
          "field": "nosbk",
          "title": "no SBK",
          "template": "<span class='style-center'>#: nosbk #</span>",
          "width": "120px"
        },
        {
          "field": "tglsbk",
          "title": "Tanggal",
          "template": "<span class='style-right'>{{formatTanggal('#: tglsbk #', '')}}</span>",
          "width": "120px"
        },
        // {
        //   "field": "keteranganLainnya",
        //   "title": "Keterangan",
        //   "template": "<span class='style-left'>#: keteranganLainnya #</span>",
        //   "width":"300px"
        // },
        {
          "field": "totaldibayar",
          "title": "Total Dibayar",
          "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
          "width": "200px"

        },
        {
          "field": "namalengkap",
          "title": "Kasir",
          "template": "<span class='style-center'>#: namalengkap #</span>",
          "width": "200px"
        },
        {
          "field": "status",
          "title": "",
          "width": "100px",

          "template": "<button class=\"k-button custom-button\" ng-click=\"openpopUpVerifikasi(dataItem)\"  style=\"margin:0 0 5px\">#:  status #</button> ",
        },
      ];

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
          $scope.popUpVerifikasi.center().open()
          medifirstService.get('bendaharapengeluaran/get-daftar-kelompok-transaksi-pengeluaran?norec_closing=' + dataItem.norec_sbk
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
				if (resultKelompok.data.noverifikasiveriffk != null) {
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
					// tempresultKelompok = resultKelompok
					var strukresep = {
						nojurnal: '-',
						tglentry: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
						deskripsi: resultKelompok.data[0].keterangan + ' ' + resultKelompok.data[0].carabayar,
						nobuktitransaksi: resultKelompok.data[0].norec,
						nostrukfk: resultKelompok.data[0].norec,
					}
					var data = {};
					var data2 = [];
					data = {
						no: 1,
						accountid: resultKelompok.data[0].objectcoadebitfk,
						noaccount: resultKelompok.data[0].noaccountdebit,
						namaaccount: resultKelompok.data[0].namaaccountdebit,
						namaaccount2: resultKelompok.data[0].namaaccountdebit,
						hargasatuand: resultKelompok.data[0].total,
						hargasatuank: '0',
						keteranganlainnya: ''
					}
					data2.push(data)
					data = {
						no: 2,
						accountid: resultKelompok.data[0].objectcoakreditfk,
						noaccount: resultKelompok.data[0].noaccountkredit,
						namaaccount: "--- " + resultKelompok.data[0].namaaccountkredit,
						namaaccount2: resultKelompok.data[0].namaaccountkredit,
						hargasatuand: '0',
						hargasatuank: resultKelompok.data[0].total,
						keteranganlainnya: ''
					}
					data2.push(data)
					var objSave =
					{
						head: strukresep,
						detail: data2
					}
					medifirstService.post('akuntansi/save-entry-jurnal-bp', objSave).then(function (e) {
						tempresultKelompok.data.splice(i, 1);
						// pushSave()
					})
					var itemDelete = {
						"norec_closing": resultKelompok.data[0].norec,
						// "tglsetor": moment($scope.now).format('YYYY-MM-DD HH:mm'),
						// "tgltransferkerekbank": moment($scope.now).format('YYYY-MM-DD HH:mm'),
						// "noBukti": '-',
						// "ketTransaksi": resultKelompok.data[0].norec
					}
					medifirstService.post('bendaharapengeluaran/verifikasi-Setoran', itemDelete).then(function (e) {
						if (e.status === 201) {

							loadData();
						}
					})
				}
			}

      $scope.columnGridKelompokTransaksi = {
				excel: {
					fileName: "Posting Setoran " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
						+ moment($scope.item.tglAwal).format('DD/MMM/YYYY') + ".xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:H1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Posting Setoran",
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

      $scope.Cetak = function () {
        if ($scope.dataSbnSelected.noSbm == undefined) {

          var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
            "transaksi belum dipilih", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        } else {
          var obj = {
            noRegistrasi: [$scope.dataSbnSelected.noSbm],
            backPage: "DaftarPenerimaanKasir"
          }

          $state.go("CetakDokumenKasir", {
            dataPasien: JSON.stringify(obj)
          });
        }
      }

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.SearchData = function () {
        loadData();
      }

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD/MM/YYYY HH:mm');
      }
      ////////////////////////////////////////////////////////    END       /////////////////////////////////////////////////////////////////
    }
  ]);
});