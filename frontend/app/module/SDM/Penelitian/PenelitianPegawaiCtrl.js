define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PenelitianPegawaiCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
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
                var chacePeriode = cacheHelper.get('PenelitianPegawaiCtrl');
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
                    cacheHelper.set('PenelitianPegawaiCtrl', chacePeriode);
               }else{
                    init()
               }
           }			

			function loadDataCombo(){
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai=data;
                });
				
	            medifirstService.get("sdm/penelitian/get-data-combo-penelitian?", true).then(function(datas){
                    var dat = datas.data;
	            	$scope.ListInstitusiPendidikan=dat.institusi;
	            	$scope.ListjurusanPeminatan=dat.jurusanpeminatan;
	            	$scope.ListFakultas=dat.fakultas;
	            });
		    }

            $scope.CariPegawai = function(){
                if ($scope.item.Pegawai != undefined) {
                    medifirstService.get("sdm/penelitian/get-data-pegawai?IdPegawai="+$scope.item.Pegawai.id, true).then(function(data_ih){
                        var datas = data_ih.data.data[0];
                        $scope.item.nim = datas.nip_pns;
                        $scope.item.UnitKerja = datas.unitkerja;
                    });
                };
            }      

			function init(){
			   	if (noOrder == 'EditPenelitianPegawai') {
                    $scope.isRouteLoading=true;
                    medifirstService.get("sdm/penelitian/get-detail-penelitian-pegawai?"
                    +"Norec="+NorecKpe, true).then(function(dat){
                        $scope.isRouteLoading=false;
                        var datas = dat.data.datas[0];
                        norec_kpe = datas.norec;
                        $scope.item.nim = datas.nip_pns;
                        $scope.item.Pegawai = {id:datas.pegawaifk,namalengkap:datas.namalengkap};                        
                        $scope.item.UnitKerja = datas.unitkerja; 
                        $scope.item.lokasiPenelitian = datas.unitkerja;
                        $scope.item.judulPenelitian = datas.judulpenelitian;;
                        $scope.item.tanggalMulai = moment(datas.tanggalmulai).format('YYYY-MM-DD HH:mm');
                        $scope.item.tanggalSelesai = moment(datas.tanggalselesai).format('YYYY-MM-DD HH:mm');
                        $scope.item.biayaPenelitian =  parseFloat(datas.biayapenelitian);   
                        $scope.item.JumlahDisetujui = parseFloat(datas.bantuanditerima);   
                        $scope.item.JumlahBantuan = parseFloat(datas.jumlahbantuan);   
                        $scope.item.tanggalPembayaran =moment(datas.tanggalpembayaran).format('YYYY-MM-DD HH:mm');   
                        $scope.item.nomorKwitansi = datas.nokwitansi;
                        $scope.item.tanggalPresentasi = moment(datas.tanggalpresentasi).format('YYYY-MM-DD HH:mm');                     
                        $scope.item.tanggalPresentasiProposal = moment(datas.tanggalproposal).format('YYYY-MM-DD HH:mm'); 
                        $scope.item.laporanPenelitian = datas.laporanpenelitian; 
                        $scope.item.tanggalLolosKajiKelayakan =  moment(datas.tanggalkajian).format('YYYY-MM-DD HH:mm'); 

                        $scope.item.publikasiJurnal = datas.publikasijurnal;                   
                        $scope.item.tanggalPublikasi = moment(datas.tanggalpublikasi).format('YYYY-MM-DD HH:mm'); 
                        $scope.item.tindakLanjut = datas.tindaklanjut;

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

                if ($scope.item.Pegawai == undefined) {
                    alert("Nama Pegawai Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.judulPenelitian == undefined) {
                    alert("Judul Penelitian Tidak Boleh Kosong!")
                    return;
                }
            
                if ($scope.item.tanggalMulai == undefined) {
                    alert("Tanggal Mulai Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.tanggalSelesai == undefined) {
                    alert("Tanggal Selesai Tidak Boleh Kosong!")
                    return;
                } 

                if ($scope.item.biayaPenelitian == undefined) {
                    alert("Biaya Penelitian Tidak Boleh Kosong!")
                    return;
                }  

                if ($scope.item.laporanPenelitian == undefined) {
                    alert("Laporan Penelitian Tidak Boleh Kosong!")
                    return;
                } 

            			
                var jumlahbantuan = 0;
                if ($scope.item.JumlahDisetujui != undefined) {
                	jumlahbantuan = $scope.item.JumlahDisetujui;
                }

                var bantuanditerima = 0;
                if ($scope.item.JumlahBantuan != undefined) {
                    bantuanditerima = $scope.item.JumlahBantuan;
                }

                var nomorkwitansi ="-"
                if ($scope.item.nomorKwitansi != undefined) {
                	nomorkwitansi = $scope.item.nomorKwitansi;
                }

                var tanggalPembayaran =null
                if ($scope.item.tanggalPembayaran != undefined) {
                	tanggalPembayaran = moment($scope.item.tanggalPembayaran).format('YYYY-MM-DD HH:mm');
                }

                var tanggalPresentasi =null
                if ($scope.item.tanggalPresentasi != undefined) {
                    tanggalPresentasi = moment($scope.item.tanggalPresentasi).format('YYYY-MM-DD HH:mm');
                }

                var tanggalLolosKajiKelayakan =null
                if ($scope.item.tanggalLolosKajiKelayakan != undefined) {
                    tanggalLolosKajiKelayakan = moment($scope.item.tanggalLolosKajiKelayakan).format('YYYY-MM-DD HH:mm');
                }

                var tanggalPublikasi =null
                if ($scope.item.tanggalPublikasi != undefined) {
                    tanggalPublikasi = moment($scope.item.tanggalPublikasi).format('YYYY-MM-DD HH:mm');
                }

                var tanggalPresentasiProposal =null
                if ($scope.item.tanggalPresentasiProposal != undefined) {
                    tanggalPresentasiProposal = moment($scope.item.tanggalPresentasiProposal).format('YYYY-MM-DD HH:mm');
                }

                var tindaklanjut ="";
                if ($scope.item.tindakLanjut != undefined) {
                    tindaklanjut=$scope.item.tindakLanjut
                }

                var publikasijurnal ="";
                if ($scope.item.publikasiJurnal != undefined) {
                    publikasijurnal=$scope.item.publikasiJurnal
                }

                var lokasipenelitian="-";
                if ($scope.item.lokasiPenelitian != undefined) {
                    lokasipenelitian = $scope.item.lokasiPenelitian
                }

                var unitkerja="-";
                if ($scope.item.UnitKerja != undefined) {
                    unitkerja = $scope.item.UnitKerja
                }
                
                for (var i =  $scope.currentKeterangan.length - 1; i >= 0; i--) {
                    var c = $scope.currentKeterangan[i].id
                    b = ","+ c
                    a = a + b
                }

                listKeterangan= a.slice(1, a.length)

				var data = {
					"norec_kpe":norec_kpe,
                    "pegawaifk":$scope.item.Pegawai.id,
                    "unitkerja":unitkerja,
                    "lokasipenelitian":lokasipenelitian,
                    "judulpenelitian":$scope.item.judulPenelitian,
                    "tanggalmulai":moment($scope.item.tanggalMulai).format('YYYY-MM-DD HH:mm'),
                    "tanggalselesai":moment($scope.item.tanggalSelesai).format('YYYY-MM-DD HH:mm'),
                    "biayapenelitian":$scope.item.biayaPenelitian,
                    "jumlahbantuan":jumlahbantuan,
                    "bantuanditerima":bantuanditerima,
                    "tanggalpembayaran":tanggalPembayaran,
                    "nokwitansi":nomorkwitansi,
                    "kelengkapanadministrasi":listKeterangan,
                    "tanggalpresentasi":tanggalPresentasi,
                    "tanggalproposal":tanggalPresentasiProposal,
                    "laporanpenelitian":$scope.item.laporanPenelitian,
                    "tanggalkajian":tanggalLolosKajiKelayakan,
                    "publikasijurnal":publikasijurnal,
                    "tanggalpublikasi":tanggalPublikasi,
                    "tindaklanjut":tindaklanjut
				};	

				var objSave = {
                    data: data,
                }

                medifirstService.post('sdm/penelitian/save-kegiatan-penelitian-pegawai',objSave).then(function (e) {
                    $scope.item = {};  
                    $state.go('DaftarPenelitianPegawai')     
                })

			}
			
		}
	]);
});