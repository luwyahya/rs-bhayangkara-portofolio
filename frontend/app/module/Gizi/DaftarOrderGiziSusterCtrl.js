define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarOrderGiziSusterCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			// $scope.dataPasienSelected = {};
			$scope.item.jmlRows =50
			$scope.isRouteLoading = false;
			$scope.listMakananTambahan = [
			{ text:'Putih Telur(6 Butir)', value:'Putih Telur(6 Butir)'},
			{ text:'PUTIH TELUR (3 Butir)', value:'PUTIH TELUR (3 Butir)'},
			{ text:'PUTIH TELUR (2 Butir)', value:'PUTIH TELUR (2 Butir)'},
			{ text:'PUTIH TELUR (1 Butir)', value:'PUTIH TELUR (1 Butir)'},
			{ text:'BUAH ', value:'BUAH '},
			{ text:'SUSU', value:'SUSU'},
			{ text:'JUS BUAH', value:'JUS BUAH'},
			];
			var dataMenuSiklus = [];
			var data2 = [];
			var addDataDetail = [];

			loadCombo();
			

			function loadCombo() {
				var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
				if (chacePeriode != undefined) {

					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get('sysadmin/general/get-combo-pegawai',true,true,10).then(function(e){
					$scope.listPegawai = e.data
					for (let i = 0; i < e.data.length; i++) {
						const element = e.data[i];
						// if(element.id == medifirstService.getPegawaiLogin().id){
						// 	$scope.item.pengorder = element
						// 	break
						// }
					}
				})

				medifirstService.get("gizi/get-combo", false).then(function (data) {
					$scope.listKelas = data.data.kelas;
					$scope.listDepartemen = data.data.departemen;
					debugger
					$scope.item.instalasi =data.data.departemen[32]
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listJenisDiet = data.data.jenisdiet;
					$scope.listKategoriDiet = data.data.kategorydiet;
					$scope.listJenisWaktu = data.data.jeniswaktu;
					$scope.listMenu = data.data.produk;
					loadData();
				})
				
				// $scope.listStatus = manageKasir.getStatus();
			}
			// $scope.getIsiComboRuangan = function () {
			// 	$scope.listRuangan = $scope.item.instalasi.ruangan
			// }
			$scope.$watch('item.instalasi', function(newValue, oldValue) {
	            if (newValue != oldValue  ) {
	              $scope.listRuangan =newValue.ruangan
	            }
        });
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;

				$scope.SearchData();
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.formatTanggalNoTime = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				dataMenuSiklus = [];
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				debugger
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
				var ins = ""
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
				}
				var rg = ""
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
				}
				var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}
				var noorder = ""
				if ($scope.item.noOrder != undefined) {
					noorder = "&noorder=" + $scope.item.noOrder
				}
				var jenisDietId = ""
				if ($scope.item.jenisDiets != undefined) {
					jenisDietId = "&jenisDietId=" + $scope.item.jenisDiets.id
				}
				var jenisWaktuId = ""
				if ($scope.item.jenisWaktu != undefined) {
					jenisWaktuId = "&jenisWaktuId=" + $scope.item.jenisWaktu.id
				}
				var pengorder = ""
				if ($scope.item.pengorder != undefined) {
					pengorder = "&pengorderId=" + $scope.item.pengorder.id
				}
				var jmlRows = ""
				if ($scope.item.jmlRows != undefined) {
					jmlRows = "&jmlRows=" + $scope.item.jmlRows
				}


				medifirstService.get("gizi/get-daftar-order-detail?" +
					"tglAwal=" + tglAwal +
					"&tglAkhir=" + tglAkhir +
					reg + rm + nm + ins + rg + kp + dk + noorder + pengorder+jmlRows
					+ jenisDietId + jenisWaktuId)
					.then(function (data) {
						$scope.isRouteLoading = false;
						var result = data.data.data
			

						$scope.sourceGrid = new kendo.data.DataSource({
							data: result,
							pageSize: 10,
							total: data2.length,
							serverPaging: false,
							group: $scope.group

						});

						var chacePeriode = tglAwal + "~" + tglAkhir;
						cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
					});

			};
			// $scope.group = {
            //     field: "ruanganasal",
            //     aggregates: [{
            //         field: "ruanganasal",
            //         aggregate: "count"
            //     }]
            // };
			$scope.columnGrid = [
				// {
				// 	"template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
				// 	"width": 30
				// },
				// {
				// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
				// 	template: "# if (statCheckbox) { #" +
				// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
				// 		"# } else { #" +
				// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
				// 		"# } #",
				// 	width: "30px"
				// 	},
				{
					"field": "tglorder",
					"title": "Tgl Order",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
				},
				{
					"field": "noorder",
					"title": "No Order",
					"width": "80px"
				},
				{
					"field": "tglmenu",
					"title": "Tgl Menu",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglmenu #')}}</span>"
					// "template": "<span class='style-center'>{{formatTanggalNoTime('#: tglmenu #')}}</span>"
				},
				// {
				// 	"field": "noregistrasi",
				// 	"title": "No Reg",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "nocm",
				// 	"title": "No RM",
				// 	"width": "70px",
				// },
				// {
				// 	"field": "namapasien",
				// 	"title": "Nama Pasien",
				// 	"width": "100px",
				// },
				// {
				// 	"field": "umurzz",
				// 	"title": "Umur",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "tgllahir",
				// 	"title": "Tgl Lahir",
				// 	"width": "80px",
				// 	"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
				// },
				// {
				// 	"field": "ruanganasal",
				// 	"title": "Ruangan Asal",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "namakelas",
				// 	"title": "Kelas",
				// 	"width" : "50px",
				// },
				// {
				// 	"field": "jenisdiet",
				// 	"title": "Jenis Diet",
				// 	"width": "80px"
				// },
				// {
				// 	"field": "jeniswaktu",
				// 	"title": "Jenis Waktu",
				// 	"width":"60px"
				// },
				// {
				// 	"field": "pegawaiorder",
				// 	"title": "Pengorder",
				// 	"width":"100px",
				// 	"template": "<span class='style-left'>#: pegawaiorder #</span>"
				// },	
				{
					"field": "pengorder",
					"title": "Pengorder",
					"width": "80px"
				},
				// {
				// 	"field": "cc",
				// 	"title": "CC",
				// 	"width": "50px"
				// },
				// {
				// 	"field": "volume",
				// 	"title": "Frekuensi",
				// 	"width": "50px"
				// },
				{
					"field": "keteranganorder",
					"title": "Keterangan",
					"width": "80px"
				},
				// {
				// 	"field": "nokirim",
				// 	"title": "No Kirim",
				// 	"width": "80px",
				// 	"template": '# if( nokirim==null) {# - # } else {# #= nokirim # #} #'
				// },
			];
			$scope.selectedItem= [];
			$scope.onClickItem = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#kGridDetails").data("kendoGrid"),
					dataItem = grid.dataItem(row);
				if (checked) {
					var result = $.grep($scope.selectedItem, function (e) {
						return e.norec_op == dataItem.norec_op;
					});
					if (result.length == 0) {
						$scope.selectedItem.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedItem.length; i++)
							if ($scope.selectedItem[i].norec_op === dataItem.norec_op) {
								$scope.selectedItem.splice(i, 1);
								break;
							}
						$scope.selectedItem.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedItem.length; i++)
						if ($scope.selectedItem[i].norec_op === dataItem.norec_op) {
							$scope.selectedItem.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}
			$scope.data2 = function (dataItem) {
				for (var i = 0; i < dataItem.details.length; i++) {
					dataItem.details[i].no = i + 1

				}
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details,

					}),

					selectable: true,
					columns: [
						{
							"template": "<input type='checkbox' class='checkbox' ng-click='onClickItem($event)' />",
							"width": 20
						},
						// {
						// 	"field": "tglmenu",
						// 	"title": "Tgl Menu",
						// 	"width": "50px",
						// 	"template": "<span class='style-center'>{{formatTanggalNoTime('#: tglmenu #')}}</span>"
						// },
						{
							"field": "ruangorder",
							"title": "Ruangan Asal",
							"width": "80px",
						},
						{
		                    "field": "nobed",
		                    "title": "No Bed Ruangan",
		                    "width": "80px",
		                },
		                {
		                //     // // "field": "pagi",
		                //     // "title": "Pagi",
		                //     // "width": "80px",
		                // //     // "template": '# if( pagi==true) {#  # } else {# #= - # #} #'
		                    "field": "pagi",
		                    "title": "Pagi",
		                    "width": "80px",
		                    "template": '# if( pagi==true) {# ✅ # } else {# - #} #'
		                },

		                {
		                    "field": "siang",
		                    "title": "Siang",
		                    "width": "80px",
		                    "template": '# if( siang==true) {# ✅ # } else {# - #} #'
		                },
		                {
		                    "field": "malam",
		                    "title": "Malam",
		                    "width": "80px",
		                    "template": '# if( malam==true) {# ✅ # } else {# - #} #'
		                },
		                {
		                    "field": "makanantambahan",
		                    "title": "Makanan Tambahan",
		                    "width": "80px"
		                },
		                {
		                    "field": "kalori",
		                    "title": "Kalori",
		                    "width": "80px"
		                },
						// {
						// 	"field": "jeniswaktu",
						// 	"title": "Waktu",
						// 	"width": "80px",
						// },
						{
							"field": "kategorydiet",
							"title": "Kategori",
							"width": "80px",
						},
						{
							"field": "jenisdiet",
							"title": "Diet 1",
							"width": "80px",
						},
						{
							"field": "jenisdiet1",
							"title": "Diet 2",
							"width": "80px",
						},
						{
							"field": "jenisdiet2",
							"title": "Diet 3",
							"width": "80px",
						},
						
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "50px",
						},
						{
							"field": "nocm",
							"title": "No RM",
							"width": "50px",
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "100px",
						},
					
						{
							"field": "namakelas",
							"title": "Kelas",
							"width": "50px",
						},
						{
							"field": "volume",
							"title": "Volume",
							"width": "50px",
						},
						{
							"field": "cc",
							"title": "CC",
							"width": "50px",
						},
						{
							"field": "cc",
							"title": "CC",
							"width": "50px",
						},
						{
							"field": "keteranganlainnya",
							"title": "Ket",
							"width": "70px",
						},
						{
							"field": "nokirim",
							"title": "No Kirim",
							"width": "80px",
							"template": '# if( nokirim==null) {# - # } else {# #= nokirim # #} #'
						},

						// {
						// 	"command": [{
						// 		text: "Hapus",
						// 		click: hapusOrder,
						// 		imageClass: "k-icon k-delete"
						// 	}
						// 		// ,{
						// 		// 	text: "Edit", 
						// 		// 	click: editOrder, 
						// 		// 	imageClass: "k-icon k-i-pencil"
						// 		// }
						// 	],
						// 	title: "",
						// 	width: "50px",
						// }


					]
				}
			};
			$scope.hapusPeritem = function(){
				if($scope.selectedItem.length == 0){
					toastr.error('Ceklis Peritem dulu')
					return
				}
				for (var i = 0; i < $scope.selectedItem.length; i++) {
					if($scope.selectedItem[i].nokirim != null) {
						toastr.error('Menu tidak bisa dihapus karena sudah mendapatkan nokirim')
						return
					}
				}
				var data = {
					'orderpelayanan' : $scope.selectedItem
				}
				medifirstService.post('gizi/hapus-peritem-order',data).then(function(e){
					$scope.selectedItem =[]
					loadData()

				})
			}
			function hapusOrder(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				if (dataItem.nokirim != null) {
					toastr.error("Menu sudah dikirim tidak bisa dihapus");
					return;
				}
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Apakah anda yakin mau menghapus data ? ')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {

					var itemDelete = {
						"norec_op": dataItem.norec_op
					}
					medifirstService.post('gizi/delete-orderpelayanan-gizi',itemDelete).then(function (e) {
						if (e.status === 201) {
							loadData();

						}
					})

				})

			}

			$scope.klikGrid = function (dataPasienSelected) {
				$scope.dataPasienSelected = dataPasienSelected
			}
			$scope.pop ={}
			$scope.Edit = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}


				medifirstService.get("rawatinap/get-combo-filter", false).then(function (data) {
					debugger;
					if(data.data.jeniswaktu == ""){
						alert('BELUM WAKTUNYA INPUT')
						
						$scope.popUpOrder.close();
						return;
					}
					$scope.listJenisWaktu = data.data.jeniswaktu;
				});
				// for (var i = 0; i < $scope.dataPasienSelected.details.length; i++) {
				// 	if ($scope.dataPasienSelected.details[i].nokirim !== null){
				// 		var status = true
				// 		break
				// 	}
				// }

				// if (status){
				// if ($scope.dataPasienSelected.details[0].nokirim != '-') {
				// 	toastr.error('Menu sudah dikirim, tidak bisa diedit')
				// 	return
				// }
				var select = $scope.dataPasienSelected

				if (select.details[0].nokirim != null ) {
					toastr.error('Menu tidak bisa diedit karena sudah mendapatkan nokirim')
					return
				}
				select.tglmenu = new Date(select.tglmenu)
				$scope.pop = select
				$scope.pop.jenisWaktu = {id: select.details[0].objectjeniswaktufk,jeniswaktu: select.details[0].jeniswaktu}
				$scope.pop.jenisDiet = {id: select.details[0].objectjenisdietfk,jenisdiet: select.details[0].jenisdiet}
				if(select.details[0].objectjenisdietfk1 != null)
				{
					$scope.pop.jenisDiet1 = {id: select.details[0].objectjenisdietfk1,jenisdiet: select.details[0].jenisdiet1}
				
				}
				if(select.details[0].objectjenisdietfk2 != null)
				{
					$scope.pop.jenisDiet2 = {id: select.details[0].objectjenisdietfk2,jenisdiet: select.details[0].jenisdiet2}
				}
				$scope.pop.kategoriDiet = {id: select.details[0].objectkategorydietfk,kategorydiet: select.details[0].kategorydiet}
				$scope.pop.keterangan =select.details[0].keteranganlainnya
				$scope.pop.kalori =select.details[0].kalori
				$scope.pop.pagi = select.details[0].pagi
                $scope.pop.siang = select.details[0].siang
                $scope.pop.malam = select.details[0].malam
                $scope.pop.makananTambahan = { value: select.details[0].makanantambahan, text: select.details[0].makanantambahan }
				$scope.popUpOrder.center().open()
				// cacheHelper.set('cacheEditOrderGizi', cache);
				// $state.go('EditOrderGizi')

			}
			$scope.EditPeritem = function () {
				if($scope.selectedItem.length == 0){
					toastr.error('Ceklis Peritem dulu')
					return
				}


				medifirstService.get("rawatinap/get-combo-filter", false).then(function (data) {
					debugger;
					if(data.data.jeniswaktu == ""){
						alert('BELUM WAKTUNYA INPUT')
						
						$scope.popUpOrder.close();
						return;
					}
					$scope.listJenisWaktu = data.data.jeniswaktu;
				});
			
				var select = $scope.dataPasienSelected
				if(select == undefined){
					alert('Klik Dulu No Ordernya !!!')
						
						// $scope.popUpOrder.close();
						return;
				}

				if (select.details[0].nokirim != null ) {
					toastr.error('Menu tidak bisa diedit karena sudah mendapatkan nokirim')
					return
				}
				select.tglmenu = new Date(select.tglmenu)
				$scope.pop = select
				$scope.pop.jenisWaktu = {id: select.details[0].objectjeniswaktufk,jeniswaktu: select.details[0].jeniswaktu}
				$scope.pop.jenisDiet = {id: select.details[0].objectjenisdietfk,jenisdiet: select.details[0].jenisdiet}
				if(select.details[0].objectjenisdietfk1 != null)
				{
					$scope.pop.jenisDiet1 = {id: select.details[0].objectjenisdietfk1,jenisdiet: select.details[0].jenisdiet1}
				
				}
				if(select.details[0].objectjenisdietfk2 != null)
				{
					$scope.pop.jenisDiet2 = {id: select.details[0].objectjenisdietfk2,jenisdiet: select.details[0].jenisdiet2}
				}
				$scope.pop.kategoriDiet = {id: select.details[0].objectkategorydietfk,kategorydiet: select.details[0].kategorydiet}
				$scope.pop.keterangan =select.details[0].keteranganlainnya
				$scope.pop.pagi = select.details[0].pagi
                $scope.pop.siang = select.details[0].siang
                $scope.pop.malam = select.details[0].malam
                $scope.pop.kalori =select.details[0].kalori
                $scope.pop.makananTambahan = { value: select.details[0].makanantambahan, text: select.details[0].makanantambahan }
				$scope.popUpOrderEdit.center().open()
				// cacheHelper.set('cacheEditOrderGizi', cache);
				// $state.go('EditOrderGizi')

			}
			$scope.save = function(){
				var jenisDiet1 ="";
				var jenisDiet2 ="";
				if ($scope.pop.jenisDiet == undefined) {
					toastr.error('Jenis Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisDiet1 != undefined) {
					jenisDiet1 = $scope.pop.jenisDiet1.id;
				}
				if ($scope.pop.jenisDiet2 != undefined) {
					jenisDiet2 = $scope.pop.jenisDiet2.id;
				}
				if ($scope.pop.kategoriDiet == undefined) {
					toastr.error('Kategori Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisWaktu == undefined) {
					toastr.error('Jenis Waktu belum di pilih')
					return
				}

				var ket = ''
				if ($scope.pop.keterangan != undefined) {
					ket = $scope.pop.keterangan
				}
				var makananTambahan = ''
				if ($scope.pop.makananTambahan != undefined && $scope.pop.makananTambahan != '') {
					makananTambahan = $scope.pop.makananTambahan.value
				}
				var kalori = ''
				if ($scope.pop.kalori != undefined && $scope.pop.kalori != '') {
					kalori = $scope.pop.kalori
				}
				var pagi = false
				if ($scope.pop.pagi != undefined && $scope.pop.pagi != '') {
					pagi = $scope.pop.pagi
				}
				var siang = false
				if ($scope.pop.siang != undefined && $scope.pop.siang != '') {
					siang = $scope.pop.siang
				}
				var malam = false
				if ($scope.pop.malam != undefined && $scope.pop.malam != '') {
					malam = $scope.pop.malam
				}
				$scope.tombolSimpanVis = true;
				var details  =[]
				for (var i = 0; i < $scope.dataPasienSelected.details.length; i++) {
					details.push({
						keterangan : ket,
						volume : null,
						cc : null,
						objectjenisdietfk : $scope.pop.jenisDiet.id,
						objectjenisdietfk1 : jenisDiet1,
						objectjenisdietfk2 : jenisDiet2,
						objectkategorydietfk : $scope.pop.kategoriDiet.id,
						nocmfk:$scope.dataPasienSelected.details[i].nocmfk ,
						norec_pd: $scope.dataPasienSelected.details[i].norec_pd,
						pagi : pagi,
						siang : siang,
						malam : malam,
						kalori : kalori,
						makananTambahan : makananTambahan,
						objectkelasfk :$scope.dataPasienSelected.details[i].objectkelasfk,
						objectruanganlastfk:$scope.dataPasienSelected.details[i].objectruanganfk
					})
				
				}
			
				var objSave = {
					'strukorder' : {
						"norec_so": $scope.pop.norec,
						"jenisorder": 1,
						"tglmenu" : moment($scope.pop.tglmenu).format('YYYY-MM-DD HH:mm'),
						"tglorder": $scope.pop.tglorder,
						"qtyproduk": details.length,
						"details": details,
						"jeniswaktufk": $scope.pop.jenisWaktu.id// element.id
					}
				}
	
			
				medifirstService.post('gizi/save-order-gizi', objSave).then(function (result) {
					$scope.tombolSimpanVis = false;
					$scope.pop ={}
					$scope.popUpOrder.close();
					loadData()
			
				},function (error){
					$scope.tombolSimpanVis = false;
				})
			}
			$scope.saveedit = function(){
				var jenisDiet1 ="";
				var jenisDiet2 ="";
				if ($scope.pop.jenisDiet == undefined) {
					toastr.error('Jenis Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisDiet1 != undefined) {
					jenisDiet1 = $scope.pop.jenisDiet1.id;
				}
				if ($scope.pop.jenisDiet2 != undefined) {
					jenisDiet2 = $scope.pop.jenisDiet2.id;
				}
				if ($scope.pop.kategoriDiet == undefined) {
					toastr.error('Kategori Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisWaktu == undefined) {
					toastr.error('Jenis Waktu belum di pilih')
					return
				}

				var ket = ''
				if ($scope.pop.keterangan != undefined) {
					ket = $scope.pop.keterangan
				}
				var makananTambahan = ''
				if ($scope.pop.makananTambahan != undefined && $scope.pop.makananTambahan != '') {
					makananTambahan = $scope.pop.makananTambahan.value
				}
				var kalori = ''
				if ($scope.pop.kalori != undefined && $scope.pop.kalori != '') {
					kalori = $scope.pop.kalori
				}
				var pagi = false
				if ($scope.pop.pagi != undefined && $scope.pop.pagi != '') {
					pagi = $scope.pop.pagi
				}
				var siang = false
				if ($scope.pop.siang != undefined && $scope.pop.siang != '') {
					siang = $scope.pop.siang
				}
				var malam = false
				if ($scope.pop.malam != undefined && $scope.pop.malam != '') {
					malam = $scope.pop.malam
				}
				$scope.tombolSimpanVis = true;
				var details  =[]
				debugger;
				for (var i = 0; i < $scope.selectedItem.length; i++) {
					details.push({
						keterangan : ket,
						volume : null,
						cc : null,
						objectjenisdietfk : $scope.pop.jenisDiet.id,
						objectjenisdietfk1 : jenisDiet1,
						objectjenisdietfk2 : jenisDiet2,
						objectkategorydietfk : $scope.pop.kategoriDiet.id,
						nocmfk:$scope.selectedItem[i].nocmfk ,
						norec_pd: $scope.selectedItem[i].norec_pd,
						pagi : pagi,
						siang : siang,
						malam : malam,
						kalori : kalori,
						makananTambahan : makananTambahan,
						objectkelasfk :$scope.selectedItem[i].objectkelasfk,
						objectruanganlastfk:$scope.selectedItem[i].objectruanganfk,
						norecop:$scope.selectedItem[i].norec_op,
					})
				
				}
			
				var objSave = {
					'strukorder' : {
						"norec_so": $scope.pop.norec,
						"jenisorder": 1,
						"tglmenu" : moment($scope.pop.tglmenu).format('YYYY-MM-DD HH:mm'),
						"tglorder": $scope.pop.tglorder,
						"qtyproduk": details.length,
						"details": details,
						"jeniswaktufk": $scope.pop.jenisWaktu.id// element.id
					}
				}
	
			
				medifirstService.post('gizi/save-order-giziperitem', objSave).then(function (result) {
					$scope.tombolSimpanVis = false;
					$scope.pop ={}
					$scope.popUpOrder.close();
					loadData()
					$scope.selectedItem= [];
			
				},function (error){
					$scope.tombolSimpanVis = false;
				})
			}
			$scope.batalEdit = function(){
				$scope.pop ={}
				$scope.popUpOrder.close();
				
				$scope.popUpOrderEdit.close();
			}
			$scope.hapus = function(){
				if ($scope.dataPasienSelected.details[0].nokirim != null ) {
					toastr.error('Menu tidak bisa dihapus karena sudah mendapatkan nokirim')
					return
				}
				if($scope.dataPasienSelected == undefined){
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.post('gizi/hapus-order-gizi',{norec:$scope.dataPasienSelected.norec}).then(function(e){
					loadData();
				})
			}
			
			/*END */


		}
	]);
});