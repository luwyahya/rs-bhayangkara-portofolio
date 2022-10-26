define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('OrderMenuGiziRevCtrl', ['$mdDialog', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {
			$scope.isRouteLoading = false;
			// $scope.item.jenisdiet =[]
			$scope.now = new Date();
			$scope.item = {};
			$scope.item2 = {};
			$scope.listJenisOrder = [{ "id": 1, "name": "Order Makan" }]; //, { "id": 2, "name": "Order Susu" }
			$scope.item.periodeAwal = $scope.now;
			$scope.item.periodeAkhir = $scope.now;
			$scope.item.tanggalOrderGizi = $scope.now;
			$scope.listMakananTambahan = [
			{ text:'Putih Telur(6 Butir)', value:'Putih Telur(6 Butir)'},
			{ text:'PUTIH TELUR (3 Butir)', value:'PUTIH TELUR (3 Butir)'},
			{ text:'PUTIH TELUR (2 Butir)', value:'PUTIH TELUR (2 Butir)'},
			{ text:'PUTIH TELUR (1 Butir)', value:'PUTIH TELUR (1 Butir)'},
			{ text:'BUAH ', value:'BUAH '},
			{ text:'SUSU', value:'SUSU'},
			{ text:'JUS BUAH', value:'JUS BUAH'},
			];
			$scope.x = 0;
			var dataOrderFix = [];
			var data2 = []
			$scope.item.jenisOrder = $scope.listJenisOrder[0]
			loadData()
			loadCombo()
			$scope.array = [{
				id: 1,
				tgl: "",
				isDuplicate: false
			}]


			function loadCombo() {

				medifirstService.get("rawatinap/get-combo-gizi", false).then(function (data) {
					$scope.listRuangan = data.data.ruanginap;
					$scope.listKelas = data.data.kelas;
					$scope.listJenisDiet = data.data.jenisdiet;
					$scope.listJenisDiet1 = data.data.jenisdiet;
					$scope.listJenisDiet2 = data.data.jenisdiet;
					var datas = []
                    // if (data.data.jenisdiet.length == 0) {
                    //     for (let i = 0; i < data.data.jenisdiet.length; i++) {
                    //         const element = data.data.jenisdiet[i];
                    //         datas.push({ id: element.id, jenisdiet: element.jenisdiet })
                    //     }
                    // } else {
                    //     for (let i = 0; i < data.data.jenisdiet.length; i++) {
                    //         const element = data.data.jenisdiet[i];
                    //         datas.push({ id: element.id, jenisdiet: element.jenisdiet })
                    //     }
                    //     // $scope.item.ruangan = { id: datas[0].id, namaruangan: datas[0].namaruangan }
                        $scope.item.jenisdiet = datas
                    //     // dimatikan jadi pake mappingan
                    //     // if (datas.length == 1) {
                    //     //     $scope.item.ruanganMulti = [{ id: datas[0].id, namaruangan: datas[0].namaruangan }]
                    //     // }
                    // }
					// $scope.optStatus = {
                    //     placeholder: "Pilih jenisdiet...",
                    //     dataTextField: "jenisdiet",
                    //     dataValueField: "id",
                    //     // dataSource:{
                    //     //     data: $scope.listRuangan
                    //     // },
                    //     autoBind: true,
                       
                    // };
					$scope.listKategoriDiet = data.data.kategorydiet;
					$scope.listJenisWaktu = data.data.jeniswaktu;
				})


			}
			$scope.panjangPopup = 250
			//  $scope.$watch('item.jenisOrder', function(e) {
			//     if (e === undefined) return;
			// 	if (e.id ==2 ){
			// 		$scope.panjangPopup =500
			// 	}else
			// 		$scope.panjangPopup =250
			//  })

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			$scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
					return data.norec_pd == dataItem.norec_pd;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
					for (let i = 0; i < $scope.selectedData.length; i++) {
						if (dataSelect.norec_pd == $scope.selectedData[i].norec_pd) {
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
			var isCheckAll = false
			$scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataSourceGrid._data;

				if (isCheckAll) {
					isCheckAll = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
						$scope.selectedData = []
					}
				}
				else {
					isCheckAll = true;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = true;
						$scope.selectedData.push(tempData[i])
					}
				}

				console.log($scope.selectedData)
				reloaddataSourceGrid(tempData);
			}

			function reloaddataSourceGrid(ds) {

				var newDs = new kendo.data.DataSource({
					data: ds,
					pageSize: 20,
					total: ds.length,
					serverPaging: true,

				});

				var grid = $('#kGrid').data("kendoGrid");

				grid.setDataSource(newDs);
				grid.refresh();

			}

			$scope.columnOrder = [
				{
					"field": "no",
					"title": "No",
					"width": "40px",
				},
				{
					"field": "tglmenu",
					"title": "Tgl Menu",
					"width": "130px",
					// "template": "<span class='style-left'>{{formatTanggal('#: tglmenu #')}}</span>"
				},

				{
					"field": "jenisdiet",
					"title": "Jenis Diet",
					"width": "80px",
					"template": "<span class='style-center'>#: jenisdiet #</span>"
				},
				{
					"field": "kategorydiet",
					"title": "Kategori Diet",
					"width": "80px",
					"template": "<span class='style-center'>#: kategorydiet #</span>"
				},
				{
					"field": "volume",
					"title": "Frekuensi",
					"width": "50px",
					"template": "<span class='style-left'>#: volume #</span>"
				},
				{
					"field": "cc",
					"title": "CC",
					"width": "50px",
					"template": "<span class='style-left'>#: cc #</span>"
				},
				{
					"field": "keterangan",
					"title": "Ket",
					"width": "100px",
					"template": "<span class='style-left'>#: keterangan #</span>"
				}
			];
			$scope.columnGrid = [
				// {
				// 	"template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
				// 	"width": 30
				// },
				{
					"field": "no",
					"title": "No",
					"width": "40px",

				},
				{
					"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
					template: "# if (statCheckbox) { #" +
						"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
						"# } else { #" +
						"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
						"# } #",
					width: "30px"
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
				// 	"field": "statusorder",
				// 	"title": "Status Order",
				// 	"width": "80px",
				// 	"template": "<span class='style-center'>#: statusorder #</span>"
				// },
			];


			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}

			$scope.tambahData = function () {
				if ($scope.item.jenisDiet == undefined) {
					toastr.error("Pilih Jenis Diet")
					return;
				}
				if ($scope.item.kategoriDiet == undefined) {
					toastr.error("Pilih Kategori Diet")
					return;
				}
				if ($scope.item.volume == undefined) {
					toastr.error("Volume belum di isi")
					return;
				}
				if ($scope.item.cc == undefined) {
					toastr.error("CC belum di isi")
					return;
				}
				if ($scope.item.keterangan == undefined) {
					$scope.item.keterangan = '-'
				}
				if ($scope.item.jenisWaktu == undefined) {
					$scope.item.jenisWaktu = [{ id: 0, jeniswaktu: "Makan Malam & Makan Pagi" }]
				}

				var jDiet1 =0;
				if( $scope.item.jenisDiet1 != undefined)
				{
					jDiet1 = $scope.item.jenisDiet1.id
				}
				var jDiet2 =0;
				if( $scope.item.jenisDiet2 != undefined)
				{
					jDiet2 = $scope.item.jenisDiet2.id
				}
				var nomor = 0
				// if ($scope.souceGridMenu == undefined) {
				// 	nomor = 1
				// }else{
				nomor = data2.length + 1
				// }
				var data = {};
				if ($scope.item.no != undefined) {
					for (var i = data2.length - 1; i >= 0; i--) {
						if (data2[i].no == $scope.item.no) {
							data.no = $scope.item.no
							data.tglmenu = moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm')
							data.jenisdietfk = $scope.item.jenisDiet.id
							data.jenisdietfk1 = jDiet1
							data.jenisdietfk2 = jDiet2
							data.jenisdiet = $scope.item.jenisDiet.jenisdiet
							data.jenisWaktu = $scope.item.jenisWaktu.id
							data.kategorydietfk = $scope.item.kategoriDiet.id
							data.kategorydiet = $scope.item.kategoriDiet.kategorydiet
							data.volume = $scope.item.volume
							data.cc = $scope.item.cc
							data.keterangan = $scope.item.keterangan
							data2[i] = data;

							$scope.souceOrder = new kendo.data.DataSource({
								data: data2
							});
						}
					}

				} else {
					data = {
						no: nomor,
						tglmenu: moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
						jenisdietfk: $scope.item.jenisDiet.id,
						jenisdietfk1:jDiet1,
						jenisdietfk2:jDiet2,
						jenisdiet: $scope.item.jenisDiet.jenisdiet,
						kategorydietfk: $scope.item.kategoriDiet.id,
						jenisWaktu : $scope.item.jenisWaktu.id,
						kategorydiet: $scope.item.kategoriDiet.kategorydiet,
						volume: $scope.item.volume,
						cc: $scope.item.cc,
						keterangan: $scope.item.keterangan,
					}
					data2.push(data)
					$scope.souceOrder = new kendo.data.DataSource({
						data: data2,
						pageSize: 10
					});
				}
				clear();
			}
			$scope.hapusData = function () {
				if ($scope.item.no == undefined) {
					toastr.error("Pilih Data yg mau dihapus")
					return;
				}


				var nomor = 0
				// if ($scope.souceGridMenu == undefined) {
				// 	nomor = 1
				// }else{
				nomor = data2.length + 1
				// }
				var data = {};
				if ($scope.item.no != undefined) {
					for (var i = data2.length - 1; i >= 0; i--) {
						if (data2[i].no == $scope.item.no) {
							data2.splice(i, 1);
							for (var i = data2.length - 1; i >= 0; i--) {
								data2[i].no = i + 1
							}
							$scope.souceOrder = new kendo.data.DataSource({
								data: data2,
								pageSize: 10
							});
						}
					}

				}
				clear();
			}
			$scope.klik = function (dataSelect) {
				$scope.item.no = dataSelect.no
				var dataJenisDiet = [];
				for (var i = $scope.listJenisDiet.length - 1; i >= 0; i--) {
					if ($scope.listJenisDiet[i].id == dataSelect.jenisdietfk) {
						dataJenisDiet = $scope.listJenisDiet[i]
						break;
					}
				}
				var dataKatDiet = [];
				for (var i = $scope.listKategoriDiet.length - 1; i >= 0; i--) {
					if ($scope.listKategoriDiet[i].id == dataSelect.kategorydietfk) {
						dataKatDiet = $scope.listKategoriDiet[i]
						break;
					}
				}
				$scope.item.jenisDiet = dataJenisDiet;
				$scope.item.tanggalOrderGizi = dataSelect.tglmenu
				$scope.item.kategoriDiet = dataKatDiet
				$scope.item.volume = dataSelect.volume
				$scope.item.cc = dataSelect.cc
				$scope.item.keterangan = dataSelect.keterangan
			}
			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MM-YYYY HH:mm');
			}
			function clear() {
				delete $scope.item.no
				$scope.item.tanggalOrderGizi = $scope.now
				delete $scope.item.jenisDiet
				delete $scope.item.jenisDiet1
				delete $scope.item.jenisDiet2
				delete $scope.item.kategoriDiet
				delete $scope.item.volume
				delete $scope.item.cc
				delete $scope.item.keterangan
			}
			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;
				// $scope.item.ruangan = { namaExternal: "" };
				$scope.SearchData();
			}

			//fungsi search data
			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				$scope.selectedData = [];
				var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');

				if ($scope.item.ruangan == undefined) {
					var rg = ""
				} else {
					var rg = "&ruanganId=" + $scope.item.ruangan.id
				}
				if ($scope.item.noReg == undefined) {
					var reg = ""
				} else {
					var reg = "&noReg=" + $scope.item.noReg
				}
				if ($scope.item.noRm == undefined) {
					var rm = ""
				} else {
					var rm = "&noRm=" + $scope.item.noRm
				}
				if ($scope.item.nama == undefined) {
					var nm = ""
				} else {
					var nm = "namaPasien=" + $scope.item.nama
				}
				
				var kls = ""
				if ($scope.item.kelas != undefined)
					kls = "&kelasId=" + $scope.item.kelas.id

				$scope.isRouteLoading = true;
				$q.all([
					medifirstService.get("rawatinap/get-pasien-ranap-gizi?"
						+ nm + reg + rg + rm
						+ kls
						// + "&tglAwal="+ tglAwal +"&tglAkhir="+ tglAkhir
					),
				]).then(function (data) {

					if (data[0].statResponse) {
						for (var i = 0; i < data[0].data.data.length; i++) {
							data[0].data.data[i].no = i + 1
							if (data[0].data.data[i].norecorder != null && data[0].data.data[i].keteranganlainnya_quo == 'Order Gizi') {
								data[0].data.data[i].statusorder = 'Sudah Order'
							} else {
								data[0].data.data[i].statusorder = '-'
							}
							data[0].data.data[i].statCheckbox = false;
							var tanggal = $scope.now;
							var tanggalLahir = new Date(data[0].data.data[i].tgllahir);
							var umur = dateHelper.CountAge(tanggalLahir, tanggal);
							data[0].data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

						}
						$scope.isRouteLoading = false;
						$scope.dataSourceGrid = new kendo.data.DataSource({
							data: data[0].data.data,
							pageSize: 20,
							total: data[0].data.data.length,
							serverPaging: false,


						});
					}
				});
				// var chacePeriode = tglAwal + ":" + tglAkhir;
				// cacheHelper.set('DaftarPasienAktif', chacePeriode);
			}

			$scope.selectedData = [];
			$scope.onClick = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#kGrid").data("kendoGrid"),
					dataItem = grid.dataItem(row);
				if (checked) {
					var result = $.grep($scope.selectedData, function (e) {
						return e.norec_pd == dataItem.norec_pd;
					});
					if (result.length == 0) {
						$scope.selectedData.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData.length; i++)
							if ($scope.selectedData[i].norec_pd === dataItem.norec_pd) {
								$scope.selectedData.splice(i, 1);
								break;
							}
						$scope.selectedData.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData.length; i++)
						if ($scope.selectedData[i].norec_pd === dataItem.norec_pd) {
							$scope.selectedData.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}
			$scope.selectAll = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#kGrid").data("kendoGrid"),
					dataSouce = grid._data;
				// dataItem = grid.dataItem(row);			
				if (checked) {
					// var result = $.grep($scope.selectedData, function(e) { 
					// 	return e.norec_pd == dataItem.norec_pd;
					// });
					// if (result.length == 0) {
					for (let index = 0; index < dataSouce.length; index++) {
						$scope.selectedData.push(dataSouce[index])
						row.addClass("k-state-selected");
					}

					// } else {
					// 	for (var i = 0; i < $scope.selectedData.length; i++)
					// 		if ($scope.selectedData[i].norec_pd === dataItem.norec_pd) {
					// 			$scope.selectedData.splice(i, 1);
					// 			break;
					// 		}
					// 		$scope.selectedData.push(dataItem);
					// 	}

				} else {
					for (var i = 0; i < $scope.selectedData.length; i++)
						// if ($scope.selectedData[i].norec_pd === dataItem.norec_pd) {
						$scope.selectedData.splice(i, 1);
					// break;
					// }
					row.removeClass("k-state-selected");
				}
			}

			$scope.checkTimeOrder = function() {

				medifirstService.get("rawatinap/get-combo-filter", false).then(function (data) {
					debugger;
					// if(data.data.jeniswaktu == ""){
					// 	alert('BELUM WAKTUNYA INPUT')
						
					// 	$scope.popUpOrder.close();
					// 	return;
					// } else {
						$scope.Pmkp(0);
					// }
					// $scope.listJenisWaktu = data.data.jeniswaktu;
				});

			}

			$scope.Pmkp = function (x) {

				if ($scope.selectedData.length > 0) {
					$scope.item.namapasiengizi = $scope.selectedData[x].namapasien;
					$scope.item.noregistrasi = $scope.selectedData[x].noregistrasi;
					// for (let i = 0; i < $scope.selectedData.length; i++) {
						medifirstService.get("gizi/get-pertanyaan-pmkp?norec_pd=" + $scope.selectedData[x].norec_pd + "&noreg=" + $scope.selectedData[x].noregistrasi
						).then(function (e) {
							x += 1; 
							$scope.x = x;
							$scope.item2.pagi = e.data.datas[0].pagi;
							$scope.item2.siang = e.data.datas[0].siang;
							$scope.item2.malam = e.data.datas[0].malam;
							if(e.data.data.length > 0){
								$scope.item.norec_op = e.data.data[0].norec_op;
								$scope.popUpPertanyaan.center().open();
							} else {
								$scope.Pmkp(x)
							}
						})
					// }
				} else {
					toastr.error('Data Belum di Pilih !!')
					return;
				}

				if($scope.selectedData.length == x+1) {
					$scope.Order()
				}
			}

			$scope.savePmkp = function (x) {
				$scope.popUpPertanyaan.center().close();
				var data = {
					'norec_op': $scope.item.norec_op,
					'status': x
				}
				medifirstService.post('gizi/save-pertanyaan-pmkp', data).then(function (result) {
					result
					$scope.Pmkp($scope.x);
				})
			}

			$scope.Order = function () {
				kosongkan()

				medifirstService.get("rawatinap/get-combo-filter", false).then(function (data) {
					debugger;
					// if(data.data.jeniswaktu == ""){
					// 	alert('BELUM WAKTUNYA INPUT')
						
					// 	$scope.popUpOrder.close();
					// 	return;
					// }
					$scope.listJenisWaktu = data.data.jeniswaktu;
				});


				// if ($scope.selectedData.length > 0) {
				// 	medifirstService.get("gizi/get-petanyaan-sisa?jenisDietId="
				// 		+ $scope.item.jenisDiet.id
				// 		+ "&kelasId=" + items.objectkelasfk
				// 		+ "&siklusKe=" + arrTgl[2]
				// 		+ "&norec_pd=" + items.norec_pd
				// 	).then(function (e) {

				// 		var orderDetail = [];
				// 		e.data.data.forEach(function (a) {
				// 			if (items.objectkelasfk === a.objectkelasfk) {
				// 				orderDetail.push(a);
				// 			}
				// 		})
				// 		if (orderDetail.length > 0) {
				// 			dataOrderFix.push({
				// 				"nocmfk": items.nocmfk,
				// 				"objectkelasfk": items.objectkelasfk,
				// 				"noregistrasifk": items.norec_pd,
				// 				"tglorder": new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
				// 				"qtyproduk": e.data.data.length,
				// 				"objectruangantujuanfk": items.objectruanganlastfk,
				// 				"details": orderDetail,
				// 			});
				// 			// console.log(JSON.stringify(dataOrderFix));
				// 		}

				// 	})
				// }



				var tempData = [];
				if ($scope.selectedData.length > 0) {
					$scope.selectedData.forEach(function (items) {
						var item = {
							"noRec": items.norec_pd,
						}
						tempData.push(item);
					})
					$scope.popUpOrder.center().open();

					var actions = $scope.popUpOrder.options.actions;
					actions.splice(actions.indexOf("Close"), 1);
					$scope.popUpOrder.setOptions({ actions: actions });


					data2 = []
					$scope.souceOrder = new kendo.data.DataSource({
						data: data2
					});
					clear();
					toastr.info(tempData.length + ' data di pilih ')
				}
				if (tempData.length == 0) {
					toastr.error('Belum ada data yang di pilih !')
					return;
				}

			}
			$scope.getSiklusMenu = function () {
				dataOrderFix = []
				var tglOrder = moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD');
				var arrTgl = tglOrder.split('-');
				var arrKelas = [];
				var details = [];
				// var dataOrderFix=[];
				$scope.selectedData.forEach(function (items) {
					medifirstService.get("gizi/get-produk-menudiet?jenisDietId="
						+ $scope.item.jenisDiet.id
						+ "&kelasId=" + items.objectkelasfk
						+ "&siklusKe=" + arrTgl[2]
						+ "&norec_pd=" + items.norec_pd
					).then(function (e) {

						var orderDetail = [];
						e.data.data.forEach(function (a) {
							if (items.objectkelasfk === a.objectkelasfk) {
								orderDetail.push(a);
							}
						})
						if (orderDetail.length > 0) {
							dataOrderFix.push({
								"nocmfk": items.nocmfk,
								"objectkelasfk": items.objectkelasfk,
								"noregistrasifk": items.norec_pd,
								"tglorder": new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
								"qtyproduk": e.data.data.length,
								"objectruangantujuanfk": items.objectruanganlastfk,
								"details": orderDetail,
							});
							// console.log(JSON.stringify(dataOrderFix));
						}

					})
				})
			}


			$scope.BatalOrder = function () {

				data2 = []
				$scope.souceOrder = new kendo.data.DataSource({
					data: data2
				});
				clear();

				$scope.popUpOrder.close();
				kosongkan();
				dataOrderFix = [];
			}
			// $scope.SaveOrder=function(){
			// 	if ($scope.item.jenisDiet==undefined){
			// 		toastr.error('Jenis Diet belum di pilih !')
			// 		return
			// 	}
			// 	if ($scope.item.kategoriDiet==undefined){
			// 		toastr.error('Kategori Diet belum di pilih !')
			// 		return
			// 	}


			// 	var objSave = {
			// 		"order":dataOrderFix,
			// 		"objectkategorydietfk" : $scope.item.kategoriDiet.id,
			// 	}

			// 	manageServicePhp.saveOrderGizi(objSave).then(function(result) {
			// 		if (result.status == 201){
			// 			dataOrderFix =[];
			// 		}
			// 		$scope.popUpOrder.close();
			// 		kosongkan ();

			// 	})
			// }
			var balik = false;
			var ket = '';
			var jnsOrder = "";
			var jenisWaktuId = '';
			var TglOrder = "";
			var DateOrder ="";
			function saveLooping(value){
				for (var i = 0; i < $scope.selectedData.length; i++) {
					$scope.selectedData[i].keterangan = ket
					$scope.selectedData[i].volume = null
					$scope.selectedData[i].cc = null
					$scope.selectedData[i].objectjenisdietfk = value
					$scope.selectedData[i].objectkategorydietfk = $scope.item.kategoriDiet.id
					if(balik == true){
						balik=false;
						var objSave = {
							"norec_so": "",
							"jenisorder": jnsOrder,
							"tglorder": TglOrder,//new moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
							"tglmenu": new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
							"qtyproduk": $scope.selectedData.length,
							"details": $scope.selectedData,
							"makanantambahan": $scope.item.makananTambahan,
							"kalori": $scope.item.kalori,
							"pagi": $scope.item.pagi,
							"siang": $scope.item.siang,
							"malam": $scope.item.malam,
							"jeniswaktufk": $scope.item.jenisWaktu.id// element.id
						}
						
						var data = {
							"strukorder": objSave
						}
						medifirstService.post('gizi/save-order-gizi', data).then(function (result) {
							details = [];
							$scope.selectedData = [];
							balik = true;

						})
					}
				
				
				}
			}
			$scope.SaveOrderFix = function () {
				var arrayJenis=[];
				 TglOrder = new moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
				 DateOrder = new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD')
				

				if ($scope.item.jenisWaktu != undefined) {
					jenisWaktuId = "&jenisWaktuId" + $scope.item.jenisWaktu.id
				}
				var tglAwal = moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD 00:00');
				var tglAkhir = moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD 23:59');
				medifirstService.get("gizi/get-daftar-order-detail?" +
					"tglAwal=" + tglAwal +
					"&tglAkhir=" + tglAkhir + jenisWaktuId).then(function (data) {
						$scope.isRouteLoading = false;
						var result = data.data.data											
						for (let z = 0; z < $scope.selectedData.length; z++) {
							const element = $scope.selectedData[z];
							for (let x = 0; x < result.length; x++) {
								const elemenTo = result[x];
								for (let c = 0; c < elemenTo.details.length; c++) {
									const elemes = elemenTo.details[c];
									if (element.noregistrasi == elemes.noregistrasi 
										&& DateOrder == new moment(elemenTo.tglmenu).format('YYYY-MM-DD') && elemes.jeniswaktu == $scope.item.jenisWaktu.jeniswaktu) {
											toastr.error('Pasien Atas Nama : ' + element.namapasien + ' Norm/Noregistrasi : ' + element.noregistrasi + '/' + element.nocm + ' Telah Melakukan Order Tidak Bisa Order Diwaktu Yang Sama !')
											return
									}
								}
							}
						}

						if ($scope.item.jenisOrder == undefined) {
							toastr.error('Pilih jenis order')
							return
						}

						// if ($scope.item.jenisWaktu == undefined) {
						// 	toastr.error('Jenis Waktu belum di pilih')
						// 	return
						// }

						
						if ($scope.item.jenisOrder.id == 1) {
							jnsOrder = "Order Makan"
							if ($scope.item.jenisdiet == undefined) {
								toastr.error('Jenis Diet belum di pilih !')
								return
							}
							if ($scope.item.kategoriDiet == undefined) {
								toastr.error('Kategori Diet belum di pilih !')
								return
							}
							let jenisdiet1 = 0;
							let jenisdiet2 = 0;
							if($scope.item.jenisDiet2 != undefined) 
							{
								jenisdiet2 =$scope.item.jenisDiet2.id;
							}
							if($scope.item.jenisDiet1 != undefined) 
							{
								jenisdiet1 =$scope.item.jenisDiet1.id;
							}
							
							if ($scope.item.keterangan != undefined) {
								ket = $scope.item.keterangan
							}
							var kalori = '';
							if ($scope.item.kalori != undefined) {
								kalori = $scope.item.kalori
							}
							var pagi = false;
							if ($scope.item.pagi == true) {
								if ($scope.item2.pagi == true) {
								toastr.error('Anda sudah pesan jam pagi !')
								return
								}else{
									pagi = true;
								}
							}
							var siang = false;
							if ($scope.item.siang == true) {
								if ($scope.item2.siang == true) {
								toastr.error('Anda sudah pesan jam siang !')
								return
								}else{
									siang = true;
								}
							}
							var malam = false;
							if ($scope.item.malam == true) {
								if ($scope.item2.malam == true) {
								toastr.error('Anda sudah pesan jam malam !')
								return
								}else{
									malam = true;
								}
							}
							debugger;
							var makananTambahan='';
							if ($scope.item.makananTambahan != undefined) {
								makananTambahan = $scope.item.makananTambahan.value
							}
							$scope.tombolSimpanVis = true;
							
							
									for (var i = 0; i < $scope.selectedData.length; i++) {
										$scope.selectedData[i].keterangan = ket
										$scope.selectedData[i].kalori = kalori
										$scope.selectedData[i].pagi = pagi
										$scope.selectedData[i].siang = siang
										$scope.selectedData[i].malam = malam
										$scope.selectedData[i].makananTambahan = makananTambahan
										$scope.selectedData[i].volume = null
										$scope.selectedData[i].cc = null
										$scope.selectedData[i].objectjenisdietfk = $scope.item.jenisDiet.id;
										$scope.selectedData[i].objectjenisdietfk1 = jenisdiet1;
										$scope.selectedData[i].objectjenisdietfk2 = jenisdiet2;
										$scope.selectedData[i].objectkategorydietfk = $scope.item.kategoriDiet.id
										
											var objSave = {
												"norec_so": "",
												"jenisorder": jnsOrder,
												"tglorder": TglOrder,//new moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
												"tglmenu": new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
												"qtyproduk": $scope.selectedData.length,
												"details": $scope.selectedData,
												// "jeniswaktufk": $scope.item.jenisWaktu.id// element.id
											}
											
											var data = {
												"strukorder": objSave
											}
											
					}
						} else if ($scope.item.jenisOrder.id == 2) {
							jnsOrder = "Order Susu"
							if (data2.length == 0) {
								toastr.error('Data order belum diisi')
								return
							}
							$scope.tombolSimpanVis = true;
							var details = []
							var jnsWaktu="";
							for (var j = 0; j < $scope.selectedData.length; j++) {
								for (var i = 0; i < data2.length; i++) {
									details.push({
										"nocmfk": $scope.selectedData[j].nocmfk,
										"norec_pd": $scope.selectedData[j].norec_pd,
										"objectkelasfk": $scope.selectedData[j].objectkelasfk,
										"objectruanganlastfk": $scope.selectedData[j].objectruanganlastfk,
										"objectjenisdietfk": data2[i].jenisdietfk,
										"objectjenisdietfk1":data2[i].jenisdietfk1,
										"objectjenisdietfk2": data2[i].jenisdietfk2,
										"objectkategorydietfk": data2[i].kategorydietfk,
										"volume": data2[i].volume,
										"cc": data2[i].cc,
										"keterangan": data2[i].keterangan,
										"makanantambahan": data2[i].makananTambahan,
										"kalori": data2[i].kalori,
										"pagi": data2[i].pagi,
										"siang": data2[i].siang,
										"malam": data2[i].malam
									})
									jnsWaktu =data2[i].jenisWaktu;
								}
							}
							
							var objSave = {
								"norec_so": "",
								"jenisorder": jnsOrder,
								"tglorder": TglOrder,//new moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
								"tglmenu": new moment($scope.item.tanggalOrderGizi).format('YYYY-MM-DD HH:mm'),
								"details": details,
								"qtyproduk": details.length,
								"jeniswaktufk": jnsWaktu// element.id
							}
							
							var data = {
								"strukorder": objSave
							}
						
						}

					$scope.tombolSimpanVis = false;
					medifirstService.post('gizi/save-order-gizi', data).then(function (result) {
						details = [];
						$scope.selectedData = [];
						balik = true;

					})
					$scope.popUpOrder.close();
					kosongkan();
					loadData()
						
					});
					
			}

			$scope.arrJenisWaktu = []
			$scope.ceklis = function (bool, data) {
				if (bool) {
					$scope.listJenisWaktu.forEach(function (e) {
						if (data.id == e.id && bool == e.isChecked) {
							e.isChecked = false
							$scope.arrJenisWaktu.splice(e, 1);

						}
						if (data.id == e.id && bool != e.isChecked) {
							e.isChecked = true
							$scope.arrJenisWaktu.push(e)

						}
					})
				} else {
					$scope.listJenisWaktu.forEach(function (e) {
						if (data.id == e.id && bool == e.isChecked) {
							e.isChecked = true
							$scope.arrJenisWaktu.push(e)

						}
						if (data.id == e.id && bool != e.isChecked) {
							e.isChecked = false
							$scope.arrJenisWaktu.splice(e, 1);

						}
					})
				}
			}
			function kosongkan() {
				delete $scope.item.jenisDiet
				delete $scope.item.kategoriDiet
				delete $scope.item.jenisWaktu
			}
			$scope.Edit = function () {
				$state.go('DaftarOrderGiziSuster');
			}



			// ** END **//



		}
	]);
});