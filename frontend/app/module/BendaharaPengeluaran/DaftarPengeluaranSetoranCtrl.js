
define(['initialize'], function(initialize) {
'use strict';
initialize.controller('DaftarPengeluaranSetoranCtrl', ['$scope', 'CacheHelper', 'MedifirstService',
	function($scope, cacheHelper, medifirstService) {
			$scope.isRouteLoading=false;
			$scope.item = {};
			$scope.now = new Date();				
			FormLoad();

			$scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatNumber = function(value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
            }
            $scope.formatTanggal = function(tanggal){
              return moment(tanggal).format('DD/MM/YYYY');
            }

			function FormLoad(){
				$scope.item.tglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                $scope.item.tglakhir = new Date();	
                
				medifirstService.get("bendaharapengeluaran/get-data-combo", true).then(function(dat){
					$scope.listAsalProduk = dat.data.asalproduk;
					$scope.item.AsalProduk = {id:dat.data.asalproduk[3].id,asalProduk:dat.data.asalproduk[3].asalProduk};                	               
                    $scope.listRuangan =  dat.data.ruanganall;
                    $scope.listDataJabatan = dat.data.jabatan;
				});               

                medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                });				               

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function(data) {
                    $scope.ListDataPegawai = data;
                });

				$scope.columnGrid = [
		            {
		                "field": "no",
		                "title": "No",
		                "width" : "30px",
		            },
		            {
		                "field": "nofaktur",
		                "title": "No Faktur",
		                "width" : "100px",
		            },
		            {
		                "field": "nokk",
		                "title": "No Struk",
		                "width" : "100px",
		                "template": "#if (nosppb) {# #= nokk # #} else {# - #} #",
		            },		            
		            {
		                "field": "tglstruk",
		                "title": "Tanggal",
		                "width" : "65px",
		                "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
		            },		            
		            {
		                "field": "namarekanan",
		                "title": "Supplier",
		                "width" : "120px",
		            },
		            {
		                "field": "jmlitem",
		                "title": "Item",
		                "width" : "35px",
		                "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
		            },		            
		            {
		                "field": "totalharusdibayar",
		                "title": "Total Tagihan",
		                "width" : "100px",
		                "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>"
		            }	            		      
            	];
           
			}

			function DataSearch(){
				$scope.isRouteLoading=true;
				var nostruk="";
				if ($scope.item.nostruk != undefined) {
					nostruk = "&noStruk=" + $scope.item.nostruk
				}                
                var ruangan =""
                if ($scope.item.ruangan != undefined){
                    var ruangan ="&ruid=" + $scope.item.ruangan.id
                }
                var rekanan =""
                if ($scope.item.Rekanan != undefined){
                    rekanan ="&Rekananfk=" + $scope.item.Rekanan.id
                }
                var asalproduk =""
                if ($scope.item.AsalProduk != undefined){
                    asalproduk ="&AsalProduk=" + $scope.item.AsalProduk.id
                }                 
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                medifirstService.get("bendaharapengeluaran/get-data-penerimaan-kas-kecil?" +
                    "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir 
                    + nostruk + ruangan + rekanan + asalproduk, true).then(function(dat){
                        $scope.isRouteLoading=false;
	                    for (var i = 0; i < dat.data.daftar.length; i++) {
	                        dat.data.daftar[i].no = i+1                      
	                    }
	                    $scope.dataGrid = dat.data.daftar;
	                    $scope.item.pegawaiUser = dat.data.datalogin[0];
                });
                               
                var chacePeriode ={ 0 : tglAwal ,
                    1 : tglAkhir,
                    2 : '',
                    3 : '', 
                    4 : '',
                    5 : '',
                    6 : ''
                }
                cacheHelper.set('DaftarPengeluaranSetoranCtrl', chacePeriode);               
			};

			$scope.Cari = function(){
				DataSearch();
			}

			$scope.data2 = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width" : "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width" : "30px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width" : "30px",
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width" : "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "hargadiscount",
                            "title": "Discount",
                            "width" : "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                        },
                        {
                            "field": "hargappn",
                            "title": "PPn",
                            "width" : "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width" : "70px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Kadaluarsa",
                            "width" : "70px",
                            "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                        },
                        {
                            "field": "nobatch",
                            "title": "nobatch",
                            "width" : "50px"
                        }
                    ]
                }
            };

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() { 
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open( "GET", aUrl, true );            
                    anHttpRequest.send( null );
                }
            }

            $scope.BatalCetak = function(){
                $scope.popUp.close();                                
            }

            $scope.cetak = function(){ 
            	if ($scope.dataSelected == undefined) {
            		toastr.error('Data Belum Dipilih')
                	return;
            	}              
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function(){               
                var jabatan1 =''
                if($scope.item.DataJabatan1 != undefined){
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }            
                
                var pegawai1 = ''
                if($scope.item.DataPegawai1 != undefined){
                    pegawai1 =$scope.item.DataPegawai1.id;
                }

                var jabatan2 =''
                if($scope.item.DataJabatan2 != undefined){
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }            
                
                var pegawai2 = ''
                if($scope.item.DataPegawai2 != undefined){
                    pegawai2 =$scope.item.DataPegawai2.id;
                }

                 var jabatan3 =''
                if($scope.item.DataJabatan3 != undefined){
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }            
                
                var pegawai3 = ''
                if($scope.item.DataPegawai3 != undefined){
                    pegawai3 =$scope.item.DataPegawai3.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Kas Kecil? ')) {
                    // Save it!
                    stt='true';
                } else {
                    // Do nothing!
                    stt='false'
                }
               
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores='+$scope.dataSelected.norec+'&pegawaiPenerima='+pegawai2+'&pegawaiPenyerahan='+pegawai1+'&pegawaiMengetahui='+pegawai3
                    +'&jabatanPenerima='+jabatan2+'&jabatanPenyerahan='+jabatan1+'&jabatanMengetahui='+jabatan3+'&view='+stt+'&user='+$scope.item.pegawaiUser.namalengkap, function(response) {                    

                });                                                
                $scope.popUp.close();                
            }

		}
	]);
});