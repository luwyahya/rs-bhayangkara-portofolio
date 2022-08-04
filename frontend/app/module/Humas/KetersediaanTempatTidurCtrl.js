define(['initialize'], function(initialize){
	'use strict';
	initialize.controller('KetersediaanTempatTidurCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
		function($rootScope, $scope, ModelItem, DateHelper, medifirstService){
		$scope.title = "";
		$scope.item = {};
		$scope.dataVOloaded = true;
		$scope.isRouteLoading=false;
		loadDataCombo();
		$scope.item = {};

		function loadDataCombo(){					

            medifirstService.get("humas/get-daftar-combo?", true).then(function(dat){
            	$scope.ListKelas = dat.data.kelaskamar;
            	$scope.ListRuangan = dat.data.ruanganrawatinap;
            })                
            LoadData();
		}

		function LoadData(){
			$scope.isRouteLoading=true;
			var nmR = "";
			if ($scope.item.ruangan != undefined) {
				nmR ='namaruangan=' + $scope.item.ruangan.namaruangan;
			}				
			var nmK = "";
			if ($scope.item.kelas != undefined) {
				nmK ='&idkelas=' + $scope.item.kelas.id;
			}
			
			medifirstService.get("humas/get-data-view-bed?" + nmR + nmK).then(function(data){
				var data = data.data;
				$scope.isRouteLoading=false;					
				var no = 0;
				for (var i = 0; i < data.length; i++) {
					no = no + 1;
					data[i].no = no;
				}
				var arrRuang = [];
				var arrKamar = [];
				var arrTT = [];
				var arr = [];
				var arrayS = {};
				var arrayK = {};
				var arrayM = {};
				var arraySP = {};
				var arrayR = {};
				var arrayD = {};
				var arrayW = {};
				var stt=true;
				for (var i = 0; i < data.length; i++) {
					// debugger;
					arrayM={idtempattidur:data[i].idtempattidur,
							idruangan:data[i].idruangan,
							namaruangan:data[i].namaruangan,
							idkamar:data[i].idkamar,
							namakamar:data[i].namakamar,
							reportdisplay:data[i].reportdisplay,
							nomorbed:data[i].nomorbed,
							idstatusbed:data[i].idstatusbed,
							statusbed:data[i].statusbed,
							kondisibed:data[i].kondisibed};
					arrTT.push(arrayM)
				}
				for (var i = 0; i < data.length; i++) {
					// debugger
					// arrayW={idkamar: data[i].idkamar,
					// 		idkelas: data[i].idkelas,
					// 		idkamar: data[i].idkamar,
					// 		namakamar: data[i].namakamar,
					// 		namakelas: data[i].namakelas,
					// 		qtybed: 0,
					// 		isi: 0,
					// 		sp: 0,
					// 		rs: 0,
					// 		db: 0,
					// 		kosong: 0};
					// arrKamar.push(arrayW)
					//kamar
					// debugger
					stt=true;
					for (var j = 0; j < arrKamar.length; j++) {
						if (data[i].idkamar == arrKamar[j].idkamar) {
							arrKamar[j].qtyBed = arrKamar[j].qtyBed +1;
							if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
								arrKamar[j].isi = arrKamar[j].isi +1;
								arrKamar[j].sp = arrKamar[j].sp + 1;
							}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
								arrKamar[j].isi = arrKamar[j].isi +1;
								arrKamar[j].rs = arrKamar[j].rs + 1;
							}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
								arrKamar[j].isi = arrKamar[j].isi +1;
								arrKamar[j].db = arrKamar[j].db + 1 ;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
								arrKamar[j].kosong = arrKamar[j].kosong +1;
								arrKamar[j].sp = arrKamar[j].sp + 1;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
								arrKamar[j].kosong = arrKamar[j].kosong +1;
								arrKamar[j].rs = arrKamar[j].rs + 1;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
								// arrKamar[j].kosong = arrKamar[j].kosong +1;
								arrKamar[j].db = arrKamar[j].db + 1 ;
							}else{
								arrKamar[j].kosong = arrKamar[j].kosong +1;
							}
							stt=false;
						}
					}
					// debugger;
					if (stt == true) {
						var arrTTT = [];
						for (var j = 0; j < arrTT.length; j++) {
							if (arrTT[j].idkamar == data[i].idkamar) {
								arrTTT.push(arrTT[j]);
							}
						}
						
						if (data[i].idstatusbed == 1 ) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									isi:1,
									kosong:0,
									
									tempattidur:arrTTT};
						}else{
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									isi:0,
									kosong:1,
									
									tempattidur:arrTTT};
						}
						if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									isi:1,
									kosong:0,
									sp:1,
							        rs:0,
									db:0,
									tempattidur:arrTTT};
						}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									// isi:1,
									// kosong:0,
									sp:0,
							        rs:1,
									db:0,
									tempattidur:arrTTT};
						}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									// isi:1,
									// kosong:0,
									sp:0,
							        rs:0,
									db:1,
									tempattidur:arrTTT};
						}
						else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									isi:0,
									kosong:1,
									sp:1,
							        rs:0,
									db:0,
									tempattidur:arrTTT};
						}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									// isi:0,
									// kosong:1,
									sp:0,
							        rs:1,
									db:0,
									tempattidur:arrTTT};
						}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
							arrayK={idruangan:data[i].idruangan,
									idkamar:data[i].idkamar,
									namakamar:data[i].namakamar,
									idkelas:data[i].idkelas,
									namakelas:data[i].namakelas,
									qtyBed:1,
									isi:0,
									// kosong:1,
									sp:0,
							        rs:0,
									db:1,
									tempattidur:arrTTT};
						}
						arrKamar.push(arrayK);
					}
					
					
				}
				// debugger;
				for (var i = 0; i < data.length; i++) {
					stt=true;
					// debugger
					for (var j = 0; j < arrRuang.length; j++) {
						if (data[i].idruangan == arrRuang[j].idruangan) {
							arrRuang[j].qtyBed = arrRuang[j].qtyBed +1;
							if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
								arrRuang[j].isi = arrRuang[j].isi +1;
								arrRuang[j].sp = arrRuang[j].sp +1;
							}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
								arrRuang[j].isi = arrRuang[j].isi +1;
								arrRuang[j].rs = arrRuang[j].rs  +1;
							}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
								arrRuang[j].isi = arrRuang[j].isi +1;
								arrRuang[j].db = arrRuang[j].db  +1 ;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
								arrRuang[j].kosong = arrRuang[j].kosong +1;
								arrRuang[j].sp = arrRuang[j].sp +1;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
								// arrRuang[j].kosong = arrRuang[j].kosong +1;
								arrRuang[j].rs = arrRuang[j].rs  +1;
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
								// arrRuang[j].kosong = arrRuang[j].kosong +1;
								arrRuang[j].db = arrRuang[j].db  +1 ;
							}else
							{
								// arrRuang[j].kosong = arrRuang[j].kosong +1;
								// arrRuang[j].db = arrRuang[j].db  +1 ;
							}
							stt=false;
						}
					}
					if (stt == true) {
						// debugger;
						var arrTTT = [];
						for (var j = 0; j < arrKamar.length; j++) {
							if (arrKamar[j].idruangan == data[i].idruangan) {
								arrTTT.push(arrKamar[j]);
							}
						}
						if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
							arrayS={idruangan:data[i].idruangan,
									namaruangan:data[i].namaruangan,
									qtyBed:1,
									isi:1,
									kosong:0,
									sp:1,
							        rs:0,
									db:0,
									kamar:arrTTT};
						}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
							arrayS={idruangan:data[i].idruangan,
									namaruangan:data[i].namaruangan,
									qtyBed:1,
									isi:0,
									kosong:0,
									sp:0,
							        rs:1,
									db:0,
									kamar:arrTTT};
						}else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
							arrayS={idruangan:data[i].idruangan,
									namaruangan:data[i].namaruangan,
									qtyBed:1,
									isi:0,
									kosong:0,
									sp:0,
							        rs:0,
									db:1,
									kamar:arrTTT};
						} else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
							arrayS={idruangan:data[i].idruangan,
									namaruangan:data[i].namaruangan,
									qtyBed:1,
									isi:0,
									kosong:1,
									sp:1,
							        rs:0,
									db:0,
									kamar:arrTTT};
							}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
								arrayS={idruangan:data[i].idruangan,
										namaruangan:data[i].namaruangan,
										qtyBed:1,
										isi:0,
										kosong:0,
										sp:0,
										rs:1,
										db:0,
										kamar:arrTTT};
								}else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
									arrayS={idruangan:data[i].idruangan,
											namaruangan:data[i].namaruangan,
											qtyBed:1,
											isi:0,
											kosong:0,
											sp:0,
											rs:0,
											db:1,
											kamar:arrTTT}
									}
						else{
						// if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
						// 	arrayS={idruangan:data[i].idruangan,
						// 			namaruangan:data[i].namaruangan,
						// 			qtyBed:0,
						// 			isi:0,
						// 			kosong:1,
						// 			sp:1,
						// 	        rs:0,
						// 			db:0,
						// 			kamar:arrTTT};
						// }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
						// 	arrayS={idruangan:data[i].idruangan,
						// 			namaruangan:data[i].namaruangan,
						// 			qtyBed:0,
						// 			isi:0,
						// 			kosong:1,
						// 			sp:0,
						// 	        rs:1,
						// 			db:0,
						// 			kamar:arrTTT};
						// }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
							arrayS={idruangan:data[i].idruangan,
									namaruangan:data[i].namaruangan,
									qtyBed:1,
									isi:0,
									kosong:0,
									sp:0,
							        rs:0,
									db:0,
									kamar:arrTTT};
						}
						
						arrRuang.push(arrayS);
					}
					
				}
				
				
				// debugger;
				$scope.isRouteLoading=false;
				debugger;
				$scope.dataSource2=arrRuang;
				console.log(arrRuang)
				var ttlKamarIsi = 0
				var ttlKamarKosong = 0
				var ttlKamarProsesAdmin = 0
				var ttlKamarTotal = 0
				var ttlKamarSiapPakai = 0
				var ttlKamarRusak = 0
				var ttlKamarDibersihkan = 0
				for (var i = arrRuang.length - 1; i >= 0; i--) {
					
					var element =arrRuang[i]
					ttlKamarIsi = ttlKamarIsi + element.isi
					ttlKamarKosong = ttlKamarKosong + element.kosong
					ttlKamarTotal = ttlKamarTotal + element.qtyBed
					ttlKamarSiapPakai= ttlKamarSiapPakai + element.sp
					ttlKamarRusak = ttlKamarRusak + element.rs
					ttlKamarDibersihkan= ttlKamarDibersihkan + element.db
				
				}
				$scope.infoKamar = [
					{
						"id": "1",
						"title": "Tempat Tidur Terpakai",
						"value": ttlKamarIsi,
						"path": "stylesheets/redbed.png"
					},
					{
						"id": "2",
						"title": "Tempat Tidur Kosong",
						"value": ttlKamarKosong,
						"path": "stylesheets/greenbed.png"
					},
					{
						"id": "2",
						"title": "Sedang Dalam Proses Administrasi",
						"value":ttlKamarProsesAdmin,
						"path": "stylesheets/yellow.png"
					}
					,
					{
						//siap pakai
						"id": "5",
						"title": "Siap Pakai",
						"value": ttlKamarSiapPakai,
						"path": "stylesheets/putih.png"
					}
					,
					{
						// rusak
						"id": "6",
						"title": "Rusak",
						"value": ttlKamarRusak,
						"path": "stylesheets/orange.png"
					}
					,
					{
						// dibersihkan
						"id": "7",
						"title": "Dibersihkan",
						"value": ttlKamarDibersihkan,
						"path": "stylesheets/pink.png"
					},
					{
						"id": "4",
						"title": "Total Tempat Tidur",
						"value": ttlKamarTotal,
						"path": "stylesheets/greybed.png"
					}
				];
			});
		}

		function LoadDataViewBed(){
			$scope.isRouteLoading=true;
			var nmR = "";
			if ($scope.item.ruangan != undefined) {
				nmR ='namaruangan=' + $scope.item.ruangan.namaruangan;
			}
			
			var nmK = "";
			if ($scope.item.kelas != undefined) {
				nmK ='&idkelas=' + $scope.item.kelas.id;
			}
			
			medifirstService.get("humas/get-ketersediaan-tempat-tidur-view?").then(function(data){
				debugger;
				var dataView = data.data[0];
				$scope.infoKamar = [
					{
						"id": "1",
						"title": "Tempat Tidur Terpakai",
						"value": dataView.kamarisi,
						"path": "stylesheets/redbed.png"
					},
					{
						"id": "2",
						"title": "Tempat Tidur Kosong",
						"value": dataView.kamarkosong,
						"path": "stylesheets/greenbed.png"
					},
					{
						"id": "2",
						"title": "Sedang Dalam Proses Administrasi",
						"value": dataView.kamarprosesadmin,
						"path": "stylesheets/yellow.png"
					},
					{
						"id": "4",
						"title": "Total Tempat Tidur",
						"value": dataView.kamartotal,
						"path": "stylesheets/greybed.png"
					}
				];
					
			});
		}

		$scope.SearchData = function(){
			LoadData();				
		}

		$scope.columnPencatatanPiutang = [
			{
				"field": "no",
				"title": "No",
				"width" : "50px",
			},
			{
				"field": "namaruangan",
				"title": "Nama Ruangan",
				"width" : "150px",
			},
			{
				"field": "namakamar",
				"title": "Nama Kamar",
				"width" : "150px",
			},
			{
				"field": "reportdisplay",
				"title": "Nama Bed",
				"width" : "150px",
			},
			{
				"field": "nomorbed",
				"title": "No Bed",
				"width" : "80px",
			},
			{
				"field": "statusbed",
				"title": "Status",
				"width" : "80px",
			}
		];

		$scope.columnPencatatanPiutang2 = [
			{
				"field": "namaruangan",
				"title": "Nama Ruangan",
				"width" : "150px",
			},
			{
				"field": "qtyBed",
				"title": "Qty Bed",
				"width" : "80px",
			},
			{
				"field": "isi",
				"title": "Jumlah Bed Isi",
				"width" : "80px",
			},
			{
				"field": "kosong",
				"title": "Jumlah Bed Kosong",
				"width" : "80px",
			},
			{
				"field": "rs",
				"title": "Jumlah Bed Rusak",
				"width" : "80px",
			},
			{
				"field": "db",
				"title": "Jumlah Bed Dibersihkan",
				"width" : "80px",
			}
		];

		$scope.data2 = function(dataItem) {
			// debugger
			return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.kamar
					}),
          			columns: [
					{
						"field": "namakamar",
						"title": "Nama Kamar",
						"width" : "150px",
					},
					{
						"field": "namakelas",
						"title": "Kelas",
						"width" : "100px",
					},
					{
						"field": "qtyBed",
						"title": "Qty Bed",
						"width" : "80px",
					},
					{
						"field": "isi",
						"title": "Jumlah Bed Isi",
						"width" : "80px",
					},
					{
						"field": "kosong",
						"title": "Jumlah Bed Kosong",
						"width" : "80px",
					},
					{
						"field": "rs",
						"title": "Jumlah Bed Rusak",
						"width" : "80px",
					},
					{
						"field": "db",
						"title": "Jumlah Bed Dibersihkan",
						"width" : "80px",
					}
				]
			}
		};	

		$scope.data3 = function(dataItem) {
			debugger
			return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.tempattidur
					}),
          			columns: [
          			{
						"field": "reportdisplay",
						"title": "Nama Bed",
						"width" : "150px"//,
						//"template": "<input  class='k-textbox' ng-model='dataModelGrid[#: idtempattidur #].reportdisplay'/>"
					},
					{
						"field": "nomorbed",
						"title": "No Bed",
						"width" : "80px"
					},
					{
						"field": "statusbed",
						"title": "Status",
						"width" : "80px"
					},
					{
						"field": "kondisibed",
						"title": "Kondisi Bed",
						"width" : "80px"
					}
				]
			}
		};	

		$scope.columnKamar = [
			{
				"field": "namaKamar",
				"title": "Kamar"
			},
			{
				"field": "namaKelas",
				"title": "Kelas"
			},
			{
				"field": "tempatTidurTerpakai",
				"title": "Tempat Tidur Isi"
			},
			{
				"field": "tempatTidurKosong",
				"title": "Tempat Tidur Kosong"
			},
			{
				"field": "tempatTidurProsesAdministrasi",
				"title": "Sedang Dalam Proses Administrasi"
			}
		];			

		$scope.batal = function(){
			 $scope.item= {};
		}			

		$scope.now = new Date();
		$scope.tanggal = DateHelper.getTanggalFormatted($scope.now);
		var HH = $scope.now.getHours();
		var mm = $scope.now.getMinutes();
		var ss = $scope.now.getSeconds();
		if(HH<10) HH = "0" + HH;
		if(mm<10) mm = "0" + mm;
		if(ss<10) ss = "0" + ss;
		$scope.jam = HH + ":" + mm + ":" + ss;

		$scope.Search = function(){
			var ruangan = $scope.item.ruangan.id;
			var kelas = $scope.item.kelas.id;
			// console.log(JSON.stringify(kamar));

			ManageSarpras.getOrderList("ketersediaan-tempat-tidur/find-kamar-by-ruangan-and-kelas/"+ruangan+"/"+kelas).then(function(data){
				// debugger;
				$scope.sourceInfoKamar = data.data.data;
			});
		}
	}])
})