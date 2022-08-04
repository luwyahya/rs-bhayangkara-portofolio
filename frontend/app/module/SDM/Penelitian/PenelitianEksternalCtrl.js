define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PenelitianEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
		function($scope, $state, dateHelper, cacheHelper, medifirstService) {
			$scope.dataVOloaded = true;
			$scope.isRouteLoading=false;
			$scope.now = new Date();
			$scope.item={};
			$scope.currentKeterangan=[];
			var noOrder='';
			var NorecKpe='';
			var norec_kpe ='';
			loadDataCombo();
			LoadCache();

			function LoadCache(){
                var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                if(chacePeriode != undefined){
                   NorecKpe = chacePeriode[0]
                   noOrder = chacePeriode[1]
                   init()
                   var chacePeriode ={ 0 : '' ,
                        1 : '',
                        2 : '',
                        3 : '', 
                        4 : '',
                        5 : '',
                        6 : ''
                    }
                    cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
               }else{
                    init()
               }
           }			

			function loadDataCombo(){			
	            medifirstService.get("sdm/penelitian/get-data-combo-penelitian?", true).then(function(datas){
                    var dat = datas.data
	            	$scope.ListInstitusiPendidikan=dat.institusi;
	            	$scope.ListjurusanPeminatan=dat.jurusanpeminatan;
	            	$scope.ListFakultas=dat.fakultas;
	            });
		    }

			function init(){
			   	if (noOrder == 'EditPenelitianEksternal') {
                    $scope.isRouteLoading=true;
                    medifirstService.get("sdm/penelitian/get-detail-penelitian-eksternal?"
                    +"Norec="+NorecKpe, true).then(function(dat){
                        $scope.isRouteLoading=false;
                        var datas = dat.data.datas[0];
                        norec_kpe = datas.norec;
                        $scope.item.nim = datas.nim;
                        $scope.item.namaPeneliti = datas.namapeneliti;
                        $scope.item.periodePengajaran = datas.periodepengajaran;                           
                        $scope.item.institusiPendidikan = {id:datas.institusipendidikanfk,institusipendidikan:datas.institusipendidikan};
                        $scope.item.jurusanPeminatan = {id:datas.jurusanpeminatanfk,jurusanpeminatan:datas.jurusanpeminatan};
                        $scope.item.fakultas = {id:datas.fakultasfk,fakultas:datas.fakultas};
                        $scope.item.judulPenelitian = datas.judulpeneltian;
                        $scope.item.lokasiPenelitian = datas.lokasipenelitian;
                        $scope.item.tanggalMulai =moment(datas.tanggalmulai).format('YYYY-MM-DD HH:mm');     
                        $scope.item.namaPendamping = datas.namapendamping;
                        $scope.item.biayaPenelitian = datas.biayapenelitian;
                        $scope.item.tanggalPembayaran =moment(datas.tanggalpembayaran).format('YYYY-MM-DD HH:mm');   

                        $scope.item.nomorKwitansi = datas.nomorkwitansi;
                        $scope.item.tanggalSelesai = moment(datas.tanggalselesai).format('YYYY-MM-DD HH:mm');                     
                        $scope.item.tanggalPresentasi = moment(datas.tanggalpresentasi).format('YYYY-MM-DD HH:mm'); 
                        $scope.item.tanggalPresentasiProposal = moment($scope.now).format('YYYY-MM-DD HH:mm'); 
                        $scope.item.laporanPenelitian = datas.laporanpenelitian;
                        // $scope.item.publikasiJurnal = datas.periodepengajaran;   
                        // $scope.item.tindakLanjut = datas.periodepengajaran;  

                        if (datas.kelengkapanadministrasi !='' || datas.kelengkapanadministrasi != null){
                             var ListcurrentKeterangan= datas.kelengkapanadministrasi.split(',')
                             if(ListcurrentKeterangan.length > 0){
                             	for (var i = 0; i < ListcurrentKeterangan.length; i++) {
                             		for (var j = 0; j <  $scope.Listketerangan.length; j++) {
                             			if( $scope.Listketerangan[j].id == ListcurrentKeterangan[i]){
                             				$scope.Listketerangan[i].isChecked = true
                                            var dataid = {"id": $scope.Listketerangan[i].id,
                                            "keterangan":$scope.Listketerangan[i].keterangan,
                                            "value":$scope.Listketerangan[i].id,
                             			} 
                             			 $scope.currentKeterangan.push(dataid)

                             		}
                             	}
                             }

                            //  ListcurrentKeterangan.forEach(function(data){
                            //     $scope.Listketerangan.forEach(function(e){                                        
                            //         for (let i in e.detail){
                            //             if(e.detail[i].id ==data){
                            //                  e.detail[i].isChecked = true
                            //                 var dataid = {"id": e.detail[i].id,"keterangan": e.detail[i].keterangan,
                            //                 "value": e.detail[i].id,
                            //               }  
                            //                 $scope.currentKeterangan.push(dataid)
                            //             }
                            //         }
                            //     })
                            // })



                         }                            
                    }
	         	})
	        }
	    }

		    $scope.Listketerangan = [
			  	{
					"id": 1,
					"keterangan": "KTP"
				},
				{
					"id": 2,
					"keterangan": "Kartu Mahasiswa"
				},
				{
					"id": 3,
					"keterangan": "CV"
					
				},
				{
					"id": 4,
					"keterangan": "Ethical Clearance"
				},
				{
					"id": 4,
					"keterangan": "Proposal Penelitian"	
				},
				{
					"id": 5,
					"keterangan": "Kuesioner Penelitian"		
				}

			];

			$scope.addListKeterangan = function(bool,data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }
                
            }

			$scope.Batal = function(){
				$scope.item = {};
			}

			$scope.Save = function(){
				var listKeterangan=""
                var TglSelesai = moment($scope.item.tanggalSelesai).format('YYYY-MM-DD HH:mm');
                var a = ""
                var b = ""
                var c = ""

                if ($scope.item.namaPendamping == undefined) {
                    alert("Hasil Nama Pendamping Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.judulPenelitian == undefined) {
                    alert("Hasil Judul Penelitian Tidak Boleh Kosong!")
                    return;
                }

                if ($scope.item.laporanPenelitian == undefined) {
                    alert("Hasil Laporan Penelitian Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.lokasiPenelitian == undefined) {
                    alert("Hasil Lokasi Penelitian Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.namaPeneliti == undefined) {
                    alert("Hasil Nama Peneliti Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.nim == undefined) {
                    alert("Hasil nim Peneliti Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.tanggalMulai == undefined) {
                    alert("Hasil Tanggal Mulai Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.tanggalPembayaran == undefined) {
                    alert("Hasil Tanggal Pembayaran Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.tanggalPresentasi == undefined) {
                    alert("Hasil Tanggal Presentasi Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.tanggalSelesai == undefined) {
                    alert("Hasil Tanggal Selesai Tidak Boleh Kosong!")
                    return;
                } 
				
                var biaya = 0;
                if ($scope.item.biayaPenelitian != undefined) {
                	biaya = $scope.item.biayaPenelitian;
                }

                var nomorkwitansi ="-"
                if ($scope.item.nomorKwitansi != undefined) {
                	nomorkwitansi = $scope.item.nomorKwitansi;
                }

                var TahunAjaran =moment($scope.now).format('YYYY')
                if ($scope.item.periodePengajaran != undefined) {
                	TahunAjaran = $scope.item.periodePengajaran;
                }
                
                for (var i =  $scope.currentKeterangan.length - 1; i >= 0; i--) {
                    var c = $scope.currentKeterangan[i].id
                    b = ","+ c
                    a = a + b
                }

                listKeterangan= a.slice(1, a.length)

				var data = {
					"norec_kpe":norec_kpe,
					"namapendamping":$scope.item.namaPendamping,
					"biayapenelitian":biaya,
					"fakultasfk":$scope.item.fakultas.id,
					"institusipendidikanfk":$scope.item.institusiPendidikan.id,
					"judulpeneltian":$scope.item.judulPenelitian,
					"jurusanpeminatanfk":$scope.item.jurusanPeminatan.id,
					"laporanpenelitian":$scope.item.laporanPenelitian,
					"lokasipenelitian":$scope.item.lokasiPenelitian,
					"namapeneliti":$scope.item.namaPeneliti,
					"nim":$scope.item.nim,
					"nomorkwitansi":nomorkwitansi,
					"periodepengajaran":TahunAjaran,
					"tanggalmulai":moment($scope.item.tanggalMulai).format('YYYY-MM-DD HH:mm'),
					"tanggalpembayaran":moment($scope.item.tanggalPembayaran).format('YYYY-MM-DD HH:mm'),
					"tanggalpresentasi":moment($scope.item.tanggalPresentasi).format('YYYY-MM-DD HH:mm'),
					"tanggalselesai":TglSelesai,
					"kelengkapanadministrasi":listKeterangan
				};	

				var objSave = {
                    data: data,
                }

                medifirstService.post('sdm/penelitian/save-kegiatan-penelitian-eksternal',objSave).then(function (e) {
                    $scope.item = {};  
                    $state.go('DaftarPenelitianEksternal')     
                })

			}
			
		}
	]);
});