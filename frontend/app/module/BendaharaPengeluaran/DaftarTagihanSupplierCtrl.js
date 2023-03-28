define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarTagihanSupplierCtrl', ['CacheHelper', '$scope', '$state', 'MedifirstService',
    function (cacheHelper, $scope, $state, medifirstService) {
      $scope.now = new Date();
      $scope.dataSelected = {};
      $scope.selectedData = [];
      $scope.item = {};
      var resultKelompok = []
      LoadCombo()
      var chacePeriode = cacheHelper.get('DaftarTagihanSupplierCtrl');

      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarTagihanSupplierCtrl');
        if (chacePeriode != undefined) {
          $scope.item.periodeAwal = new Date(chacePeriode[0]);
          $scope.item.periodeAkhir = new Date(chacePeriode[1]);
          init();
        } else {
          $scope.item.periodeAkhir = $scope.now;
          $scope.item.periodeAkhir = $scope.now;
          init();
        }
      }

      function init() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00');
        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59');
        var noFaktur = "";
        if ($scope.item.noFaktur != undefined) {
          noFaktur = "&NoFaktur=" + $scope.item.noFaktur;
        }

        var NamaSupplier = "";
        if ($scope.item.NamaSupplier != undefined) {
          NamaSupplier = "&Supplier=" + $scope.item.NamaSupplier;
        }

        var noTerima = "";
        if ($scope.item.noTerima != undefined) {
          noTerima = "&NoStruk=" + $scope.item.noTerima;
        }

        var tempStatus = "";
        if ($scope.item.status != undefined) {
          tempStatus = "&status=" + $scope.item.status.namaExternal;
          if ($scope.item.status.namaExternal == "SEMUA") {
            tempStatus = "";
          }
        }

        medifirstService.get("bendaharapengeluaran/get-data-tagihan-suplier?"
          + "tglAwal=" + tglAwal +
          "&tglAkhir=" + tglAkhir
          + tempStatus + noFaktur + NamaSupplier + noTerima, true).then(function (dat) {
            $scope.isRouteLoading = false;
            var datas = dat.data.daftar;
            for (var i = 0; i < datas.length; i++) {
              datas[i].no = i + 1
            }
            $scope.dataGrid = new kendo.data.DataSource({
              data: datas,
              total: datas.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                  }
                }
              }
            });
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
        cacheHelper.set('DaftarTagihanSupplierCtrl', chacePeriode);

      }

      function LoadCombo() {
        //List Status
        $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD');
        $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD');
        var tglJatuhTempo = moment($scope.dataSelected.tglJatuhTempo).format('YYYY-MM-DD');
        var tglTerima = moment($scope.dataSelected.tglTerima).format('YYYY-MM-DD');
        var tglfaktur = moment($scope.dataSelected.tglfaktur).format('YYYY-MM-DD')
        $scope.listStatus = [
          { id: 3, namaExternal: "SEMUA" },
          { id: 1, namaExternal: "LUNAS" },
          { id: 2, namaExternal: "BELUM LUNAS" }
        ];
        $scope.item.status = $scope.listStatus[0];
      }

      $scope.onClickSatu = function (e) {
        var element = $(e.currentTarget);
        var checked = element.is(':checked'),
          row = element.closest('tr'),
          grid = $("#kGrid").data("kendoGrid"),
          dataItem = grid.dataItem(row);

        if (checked) {
          var result = $.grep($scope.selectedData, function (e) {
            return e.norec == dataItem.norec;
          });
          if (result.length == 0) {
            $scope.selectedData.push(dataItem);
          } else {
            for (var i = 0; i < $scope.selectedData.length; i++)
              if ($scope.selectedData[i].norec === dataItem.norec) {
                $scope.selectedData.splice(i, 1);
                break;
              }
            $scope.selectedData.push(dataItem);
          }
          row.addClass("k-state-selected");
        } else {
          for (var i = 0; i < $scope.selectedData.length; i++)
            if ($scope.selectedData[i].norec === dataItem.norec) {
              $scope.selectedData.splice(i, 1);
              break;
            }
          row.removeClass("k-state-selected");
        }
      }

      $scope.columnGrid = [
        {
          "template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
          "width": 40,
          "title": "✔"
        },
        {
          "field": "no",
          "title": "No",
          "width": "35px",
        },
        {
          "field": "nostruk",
          "title": "NoTerima",
          "width": "100px",
        },
        {
          "field": "tglstruk",
          "title": "Tgl Terima",
          "width": "110px",
          "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
        },
        {
          "field": "namarekanan",
          "title": "Nama Rekanan",
          "width": "120px",
        },
        {
          "field": "nodokumen",
          "title": "No Dokumen",
          "width": "100px",
        },
        {
          "field": "tgljatuhtempo",
          "title": "Tgl Jatuh Tempo",
          "width": "110px",
          "template": "<span class='style-right'>{{formatTanggal('#: tgljatuhtempo #', '')}}</span>"
        },
        {
          "field": "total",
          "title": "Total",
          "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "totalppn",
          "title": "Total PPN",
          "template": "<span class='style-right'>{{formatRupiah('#: totalppn #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "totaldiskon",
          "title": "Total Diskon",
          "template": "<span class='style-right'>{{formatRupiah('#: totaldiskon #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "subtotal",
          "title": "Sub Total",
          "template": "<span class='style-right'>{{formatRupiah('#: subtotal #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "sisautang",
          "title": "Sisa Hutang",
          "template": "<span class='style-right'>{{formatRupiah('#: sisautang #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "status",
          "title": "Status",
          "width": "100px",
        },
        {
          "field": "verifhutang",
          "title": "Action",
          "width": "100px",
          "template": "<button class=\"k-button custom-button\" ng-click=\"openpopUpVerifikasi(dataItem)\"  style=\"margin:0 0 5px\">#:  verifhutang #</button> ",
        }
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
          medifirstService.get('bendaharapengeluaran/get-daftar-kelompok-transaksi-penentuan-hutang?norec_closing=' + dataItem.norec
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
					medifirstService.post('bendaharapengeluaran/verifikasi-Hutang', itemDelete).then(function (e) {
						if (e.status === 201) {

							loadData();
						}
					})
				}
			}

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      };

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD/MM/YYYY');
      }

      $scope.Cetak = function () {
        var xxx = $scope.dataPasienSelected.detail;
        var yyy = "aasas";
      }

      //Pindah Halaman ke Detail tagihan Rekanan/Suplier   
      $scope.Detail = function () {
        if ($scope.dataSelected.nostruk == undefined) {
          alert("Silahkan Pilih Tagihan Rekanan");
          return;
        }
        var tglJatuhTempo = moment($scope.dataSelected.tgljatuhtempo).format('YYYY-MM-DD');
        var tglTerima = moment($scope.dataSelected.tglstruk).format('YYYY-MM-DD');
        var tglfaktur = moment($scope.dataSelected.tgldokumen).format('YYYY-MM-DD')
        // $state.go("RekamDataPegawai",{idPegawai: $scope.idPegawai});
        var tempData = tglTerima + "#" +
          $scope.dataSelected.namarekanan + "#" +
          $scope.dataSelected.nodokumen + "#" +
          tglJatuhTempo + "#" +
          tglfaktur + "#" +
          $scope.dataSelected.norec
          + "#DaftarTagihanSupplier#"
          + $scope.dataSelected.nostruk;
        //setting caching
        cacheHelper.set('DetailTagihanRekanan', tempData);
        $state.go('DetailTagihanRekanan', { noTerima: '0308' })
      }

      //Pencarian data
      $scope.SearchData = function () {
        init()
      }
      //end SearchData

      $scope.Bayar = function () {
        if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
          toastr.warning('Checklist Data Yang Akan Dibayar, Peringatan!');
          return;
        }
        
        $scope.dataSelected = $scope.selectedData['0']
        if ($scope.dataSelected.nostruk == undefined) {
          alert("Silahkan Pilih Tagihan Rekanan");
          return;
        }
        let totalHutang = 0 
        let arrNorec = ""
        for (let i = 0; i < $scope.selectedData.length; i++) {
          if ($scope.selectedData[i].verifhutang == 'Unverifikasi') {
            toastr.warning('Data Sudah Diverifikasi Tidak Bisa Di Bayarkan, Peringatan!');
            return;
          }
          totalHutang = parseFloat(totalHutang) + parseFloat($scope.selectedData[i].sisautang)
          if(arrNorec==""){
            arrNorec = $scope.selectedData[i].norec.replace(/\s/g, '');
          }else{
            arrNorec = arrNorec+','+$scope.selectedData[i].norec.replace(/\s/g, '');
          }
        }
        var judul = "PembayaranTagihanSuplier";
        var tglJatuhTempo = moment($scope.dataSelected.tgljatuhtempo).format('YYYY-MM-DD');
        var tglTerima = moment($scope.dataSelected.tglstruk).format('YYYY-MM-DD');
        var tglfaktur = moment($scope.dataSelected.tgldokumen).format('YYYY-MM-DD')
        // $state.go("RekamDataPegawai",{idPegawai: $scope.idPegawai});
        var tempData = tglTerima
          + "#Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan
          + "#" + $scope.dataSelected.nodokumen
          + "#" + tglJatuhTempo
          + "#" + tglfaktur
          + "#" + $scope.dataSelected.norec
          + "#" + totalHutang//$scope.dataSelected.sisautang
          + "#" + judul
          + "#DaftarTagihanSupplier"
          + "#" + arrNorec
        //setting caching
        cacheHelper.set('PembayaranTagihan', tempData);
        $state.go('PembayaranTagihan')
      }

    }
  ]);
});