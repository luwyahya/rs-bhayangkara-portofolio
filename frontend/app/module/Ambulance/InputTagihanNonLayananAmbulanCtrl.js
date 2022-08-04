define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InputTagihanNonLayananAmbulanCtrl', ['$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.tglStruk = new Date();
			$scope.item.jumlah = 1
			$scope.item.QtyPerOrang = 1
			$scope.item.keterangan = '-'
			var noRegistrasi2 = ''
			$scope.abisSimpanKauPulanglah = true;			
			$scope.checkQtyOrg = false;
			$scope.checkPerawat = false;
			$scope.checkDokter = false;
			$scope.QtyOrang = true;
			$scope.KelUserLoginKasir = undefined;
			var data2 = [];
			var dataProduk = [];
			var norec = '';
			var NoStruk = '';
			var Kegiatan = '';

			// var data = cacheHelper.get('InputTagihanNonLayananAmbulanCtrl');
			//          if (data !== undefined) {
			//              var splitResultData = data.split("#");
			//              var noRegistrasi2 = splitResultData[0]
			//              var cmdBayar = splitResultData[1]
			//              var dariSini = splitResultData[2]
			//              // $scope.item.periodeAwal = new Date(splitResultData[0]);
			//              // $scope.item.periodeAkhir = new Date(splitResultData[1]);
			//          }

			loadCombo();

			function loadCombo() {
				$scope.KelompokUser = medifirstService.getKelompokUser();
				medifirstService.get("ambulance/get-data-for-combo").then(function (data) {
					var dataCombo = data.data;
					$scope.listKelompokTransaksi = dataCombo.kelompoktransaksi;
					$scope.item.kelompokTransaksi = dataCombo.kelompoktransaksi[0];
					$scope.KelUserLoginKasir = dataCombo.keluserkasir;
					LoadCache();
				})
			}

			function LoadCache() {                
                var chacePeriode = cacheHelper.get('InputTagihanNonLayananAmbulanCtrl');
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
                    cacheHelper.set('InputTagihanNonLayananAmbulanCtrl', chacePeriode);
                } else {
                    init()
                }
			}
			
			function init() {
				if (Kegiatan != '') {
					$scope.isRouteLoading = true;
					if (Kegiatan == 'EditTagihan') {
						medifirstService.get("ambulance/detail-tagihan-non-layanan?noRec=" + norec, true).then(function (data) {
							$scope.isRouteLoading = false;							
							var data_ih = data.data.data;
							var data_ih_detail = data.data.detail;							
							$scope.item.tglStruk = new Date(moment(data_ih.tglstruk).format('YYYY-MM-DD HH:mm'));
							$scope.item.namaPasien_klien = data_ih.namapasien_klien;
							$scope.item.noTelp_klien = data_ih.notelepon;
							$scope.item.tglLahir = new Date(data_ih.tgllahir)							
							$scope.item.alamat = data_ih.alamatlengkap
							$scope.item.kelompokTransaksi = {id:data_ih.kdkelompokTransaksi , kelompoktransaksi:data_ih.kelompokTransaksi};
							$scope.item.keterangan = data_ih.keteranganlainnya;
							dataProduk = data_ih_detail;
							var subTotal = 0;							
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								dataProduk[i].no = i + 1
								subTotal = subTotal + parseFloat(dataProduk[i].totalk)
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

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			// $scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 	data: []
			// });

			$scope.getChecked = function(){
				if ($scope.checkQtyOrg == true) {
					$scope.QtyOrang = true;
				}else{
					$scope.QtyOrang = false;
				}
			}

			$scope.getChecked1 = function(){
				if ($scope.checkPerawat == true) {
					$scope.checkPerawat = true;
				}else{
					$scope.checkPerawat = false;
				}
			}

			$scope.getChecked2 = function(){
				if ($scope.checkDokter == true) {
					$scope.checkDokter = true;
				}else{
					$scope.checkDokter = false;
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
				// {
				// 	"field": "qtyoranglast",
				// 	"title": "Qty Per Org/Per Km",
				// 	"width": "155px"
				// },
				{
					"field": "harga",
					"title": "Harga",
					"width": "110px"
				},
				{
					"field": "jasaperawat",
					"title": "Jasa Perawat",
					"width": "110px"
				},
				{
					"field": "jasadokter",
					"title": "Jasa Dokter",
					"width": "110px"
				},
				{
					"field": "totalk",
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
				medifirstService.get("ambulance/get-data-produk?namaproduk=" + $scope.item.namaproduk + "&take=50", false).then(function (data) {
					$scope.dataDaftarProduk = data.data.data;
				})
			}
			
			$scope.simpan = function () {
				if (dataProduk.length == 0) {
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
					subTotal = subTotal + parseFloat(dataProduk[i].totalK)
				}
				if (subTotal == undefined || subTotal == 0) {
					alert("Total tidak Boleh Kosong !")
					return;
				}
				var objSave = {
					norec: norec,
					kelompoktransaksifk: $scope.item.kelompokTransaksi.id,
					keteranganlainnya: $scope.item.keterangan,
					namaPasien_klien: $scope.item.namaPasien_klien,
					notelp_klien: $scope.item.noTelp_klien,
					tglstruk: moment($scope.item.tglStruk).format('YYYY-MM-DD hh:mm:ss'),
					totalharusdibayar: parseFloat(subTotal),//parseFloat($scope.item.totalBilling),
					tglLahir: $scope.item.tglLahir,
					alamat: $scope.item.alamat,
					perawat: $scope.checkPerawat,
					dokter: $scope.checkDokter,
					nocm: $scope.item.nocm,
					details: dataProduk

				}
				medifirstService.post('ambulance/save-input-non-layanan',objSave).then(function (data) {
					if ($scope.KelompokUser == $scope.KelUserLoginKasir) {
						noRegistrasi2 = data.data.data.norec
						$scope.changePage("PenerimaanPembayaranKasir");
						// window.history.back();
					}else{
						window.history.back();
					}
					
				})
			}

			$scope.$watch('item.jumlah', function(newValue, oldValue) {
				if (newValue != oldValue  ) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))							
					}
				}
			});

			$scope.$watch('item.QtyPerOrang', function(newValue, oldValue) {
				if (newValue != oldValue  ) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))							
					}
				}
			});

			$scope.$watch('item.Harga', function(newValue, oldValue) {
				if (newValue != oldValue  ) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))							
					}
				}
			});

			$scope.changePage = function (stateName) {				
				var obj = {
					pageFrom: "InputTagihanNonLayananAmbulan",
					noRegistrasi: noRegistrasi2
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.Tutup = function () {

			}

			$scope.klikGrid = function(dataSelectedProduk){				
				if (dataSelectedProduk == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
                    return
				}
				$scope.dataSelectedProduk = dataSelectedProduk;				
				$scope.item.namaprodukInput = $scope.dataSelectedProduk.namaproduk;
				if ($scope.dataSelectedProduk.namaproduk != "Pelayanan Lainnya") {
					$scope.item.KeteranganProduk = "-";
					$scope.disHarga = true;
				}else{	
					$scope.disHarga = false;									
				}
				$scope.item.Harga = $scope.dataSelectedProduk.harga;
				$scope.item.idProduk = $scope.dataSelectedProduk.id;
				$scope.item.jumlah = 1;
			}

			$scope.klikGridPro = function(dataSelected){				
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
				if($scope.dataSelected.isjasaperawat == true){
					$scope.checkPerawat = true;
				}else{
					$scope.checkPerawat = false;
				}
				if($scope.dataSelected.isjasadokter == true){
					$scope.checkDokter = true;
				}else{
					$scope.checkDokter = false;
				}
			}		

			$scope.tambah = function () {
				var JasaP = 0;
				var JasaD = 0;								
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

				var no = 0
				if (dataProduk.length == 0) {
					no = 1
				} else {
					no = dataProduk.length + 1
				}

				if ($scope.item.no != undefined) {
					no = $scope.item.no
				}				

				var data = {};
				if ($scope.item.no != undefined) {//LAMA
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						if (dataProduk[i].no == $scope.item.no) {
							if ($scope.checkPerawat == true) {
								JasaP = parseFloat($scope.item.Harga) * 25/100;
							}
							if ($scope.checkDokter == true) {
								JasaD = parseFloat($scope.item.Harga) * 25/100;
							}
							data.no = $scope.item.no
							data.id = $scope.item.idProduk
							data.namaproduk = $scope.item.namaprodukInput
							data.jumlah = parseFloat($scope.item.jumlah)
							data.qtyoranglast = parseFloat($scope.item.QtyPerOrang)
							data.jasaperawat = parseFloat(JasaP)
							data.jasadokter = parseFloat(JasaD)
							data.harga = parseFloat($scope.item.Harga)							
							data.totalk = parseFloat($scope.item.Total)+parseFloat(JasaP)+parseFloat(JasaD) //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
							data.keterangan = $scope.item.KeteranganProduk
							dataProduk[i] = data;
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk
							});
							var subTotal = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(dataProduk[i].totalk)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							ClearIsian();

						}
						// break;
					}
				} else {//BARU
					if ($scope.checkPerawat == true) {
						JasaP = parseFloat($scope.item.Harga) * 25/100;
					}
					if ($scope.checkDokter == true) {
						JasaD = parseFloat($scope.item.Harga) * 25/100;
					}
					data = {
						no: no,
						id: $scope.item.idProduk,
						namaproduk: $scope.item.namaprodukInput,
						jumlah: parseFloat($scope.item.jumlah),
						qtyoranglast: parseFloat($scope.item.QtyPerOrang),
						harga: parseFloat($scope.item.Harga),
						jasaperawat: parseFloat(JasaP),
						jasadokter: parseFloat(JasaD),
						keterangan: $scope.item.KeteranganProduk,
						totalk: parseFloat($scope.item.Total)+parseFloat(JasaP)+parseFloat(JasaD) //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
					}
					dataProduk.push(data)
					// $scope.dataGrid.add($scope.dataSelectedProduk)
					$scope.dataDaftarTagihan = new kendo.data.DataSource({
						data: dataProduk
					});
					var subTotal = 0;
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						subTotal = subTotal + parseFloat(dataProduk[i].totalk)
					}
					$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
					ClearIsian();
				}
			}

			function ClearIsian(){
				$scope.item.no = undefined;
				$scope.item.namaprodukInput = undefined;
				$scope.item.KeteranganProduk = undefined;
				$scope.item.Harga = undefined;
				$scope.item.idProduk = undefined;
				$scope.item.jumlah = 1;
				$scope.item.Total = undefined;
				$scope.item.QtyPerOrang = 1;
				$scope.checkPerawat = false;
				$scope.checkDokter = false;
			}

			$scope.hapus = function () {
				if ($scope.item.namaprodukInput == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
                    return
				}
				var data ={};
                if ($scope.item.no != undefined){
                    for (var i = dataProduk.length - 1; i >= 0; i--) {
                        if (dataProduk[i].no ==  $scope.item.no){                            
                            dataProduk.splice(i, 1);
                            var subTotal = 0 ;
                            for (var i = dataProduk.length - 1; i >= 0; i--) {
                                subTotal=subTotal+ parseFloat(data2[i].total)
                                dataProduk[i].no = i+1
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

			$scope.CariPasien = function () {
                if ($scope.item.nocm == "" || $scope.item.nocm == "-") {
                    $scope.item.namaPasien_klien = undefined
                    $scope.item.tglLahir = undefined
                    $scope.item.noTelp_klien = undefined
                    $scope.item.alamat = undefined
                    return
                }
                $scope.isLoadingNoCM = true;
                medifirstService.get("sysadmin/general/get-data-detail-pasien-general?nocm=" + $scope.item.nocm, true).then(function (data_ih) {
                    $scope.item.nocm = data_ih.data.nocm
                    $scope.item.namaPasien_klien = data_ih.data.namapasien
                    $scope.item.tglLahir = new Date(data_ih.data.tgllahir);
                    $scope.item.noTelp_klien = data_ih.data.notelepon
                    $scope.item.alamat = data_ih.data.alamatlengkap
                    $scope.isLoadingNoCM = false;
                })
			}
			
			$scope.kembali = function(){
				window.history.back();
			}

		// BATAS //
		}
	]);
});