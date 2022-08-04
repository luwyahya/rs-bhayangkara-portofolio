define(['initialize'], function(initialize) {
	'use strict';
	 initialize.controller('TarifLayananCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'MedifirstService',
        function($rootScope, $scope, ModelItem, $state, medifirstService) {
		$scope.isRouteLoading=false;
		$scope.item = {};
		

		loadDataCombo();

		
			function loadDataCombo(){
				$scope.ListRuangan= [{id:44,namaruangan:'Ruang Bedah Sentral ( OK )'}]
				$scope.item = {id:44,namaruangan:'Ruang Bedah Sentral ( OK )'}
				
				medifirstService.getPart("humas/get-daftar-data-produk", true, true, 20).then(function(data) {
                    $scope.listProduk=data;
                });

                medifirstService.get("humas/get-daftar-combo?", true).then(function(dat){
                	$scope.ListKelas = dat.data.kelas;
                	$scope.ListRuangan = dat.data.ruangan;
                })

                $scope.ListJenisPelayanan = [
                	{id:1,jenispelayanan:'Reguler'},
                	{id:2,jenispelayanan:'Eksekutif'},
                ]
                
                LoadData();
                
			}

			function LoadData(){
				$scope.isRouteLoading=true;
				var nmproduk="";
				if($scope.item.namaproduk != undefined){
					nmproduk = $scope.item.namaproduk
				}
				var produk="";
				if($scope.item.produk != undefined){
					produk = $scope.item.produk.kdproduk
				}
				var kelas="";
				if($scope.item.kelas != undefined){
					kelas = $scope.item.kelas.id
				}
				var ruangan="";
				if($scope.item.ruangan != undefined){
					ruangan = $scope.item.ruangan.id
				}
				var jenispelayanan="";
				if($scope.item.jenisPelayanan != undefined){
					jenispelayanan = $scope.item.jenisPelayanan.id
				}
				medifirstService.get("humas/get-daftar-tarif-layanan?"
					+ "produkId=" + produk
					+ "&namaproduk=" + nmproduk
					+ "&kelasId=" + kelas
					+ "&jenispelayananId=" + jenispelayanan
					+ "&ruanganId=" + ruangan, true).then(function(dat){
					var datas = dat.data.data;
					$scope.isRouteLoading=false;
		            $scope.sourceTarif = new kendo.data.DataSource({
						data: datas
					});
                })
			}

			$scope.formatRupiah = function(value, currency) {
            	return currency  + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        	}

			$scope.columndata= [
			{
				"field": "id",
				"title": "ID",
				"width": "50px"
			}, 
			{
				"field": "namaproduk",
				"title": "Layanan",
				"width": "200px"
			}, 
			{
				"field": "namakelas",
				"title": "Kelas",
				"width": "60px"
					
			},
			{
				"field": "jenispelayanan",
				"title": "Jenis Pelayanan",
				"width": "60px"
					
			},
			{
				"field": "namaruangan",
				"title": "Ruangan",
				"width": "120px"
					
			},
			{
				"field": "hargalayanan",
				"title": "Tarif",
				"width": "100px",
				"template": "<span class='style-right'>{{formatRupiah('#: hargalayanan #', '')}}</span>",
				"attributes": {align:"right"}

		    }
		    ];
		    $scope.columndatadetail= [
			{
				"field": "kdeproduk",
				"title": "ID",
				"width": "50px"
			}, 
			{
				"field": "namaproduk",
				"title": "Layanan",
				"width": "200px"
			}, 
			{
				"field": "namakelas",
				"title": "Kelas",
				"width": "60px"
					
			},
			{
				"field": "jenispelayanan",
				"title": "Jenis Pelayanan",
				"width": "60px"
					
			},
			{
				"field": "komponenharga",
				"title": "Komponen",
				"width": "70px"
					
			},
			{
				"field": "harganetto1",
				"title": "Harga",
				"width": "100px",
				"template": "<span class='style-right'>{{formatRupiah('#: harganetto1 #', '')}}</span>",
				"attributes": {align:"right"}

		    }];
		    $scope.klik =function(data){
		    	$scope.isRouteLoading=true;
		    	var produk="";
				if(data.id != undefined){
					produk =data.id
				}
				var kelas="";
				if(data.idkelas != undefined){
					kelas = data.idkelas
				}
				var ruangan="";
				if(data.ruid != undefined){
					ruangan = data.ruid
				}
				var jenispelayanan="";
				if(data.jenispelayananid != undefined){
					jenispelayanan = data.jenispelayananid
				}
		    	medifirstService.get("humas/get-daftar-tarif-layanan-detail?"
					+ "produkId=" + produk
					+ "&kelasId=" + kelas
					+ "&jenispelayananId=" + jenispelayanan
					+ "&ruanganId=" + ruangan, true).then(function(dat){
					var datas = dat.data.data;
					$scope.popupHitungRemunerasi.center().open();
					$scope.isRouteLoading=false;
		            $scope.sourceTarifdetail = new kendo.data.DataSource({
						data: datas
					});
					var hrg =0 
					for (var i = 0; i < datas.length; i++) {
						hrg = hrg + parseFloat(datas[i].harganetto1)
						
					}
					$scope.item.ttlharga = parseFloat(hrg).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                })
		    	
		    }

		    $scope.data2 = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "komponenharga",
                            "title": "Nama Komponen",
                            "width": "40px",
                        },
                        {
                            "field": "harganetto1",
                            "title": "Tarif",
                            "template": "<span class='style-right'>{{formatRupiah('#: harganetto1 #', '')}}</span>",
                            "width" : "100px",
                            "attributes": {align:"right"}
                        }
                        // {
                        //     "field": "harganetto2",
                        //     "title": "Harga Netto2",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: harganetto2 #', '')}}</span>",
                        //     "width" : "100px",
                        // },
                        // {
                        //     "field": "hargasatuan",
                        //     "title": "Harga Satuan",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>",
                        //     "width" : "100px",
                        // }
                    ]
                }
            };  

			$scope.SearchData = function()
			{
				LoadData();
			}
		}
	]);
});