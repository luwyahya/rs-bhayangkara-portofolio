define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('RincianPasienVerifikasiCtrl', ['$sce', '$state', '$q', '$rootScope', '$scope', '$window', 'MedifirstService','$mdDialog',
		function($sce, $state, $q, $rootScope, $scope, window, medifirstService, $mdDialog) {
			$scope.now = new Date();

// define(['initialize'], function (initialize) {
//     'use strict';
//     initialize.controller('RincianPasienVerifikasiCtrl', ['DateHelper', '$rootScope', '$scope', 'ModelItem', 'MedifirstService', '$state', '$window', 'CetakHelper', 'CacheHelper',
//         function (dateHelper, $rootScope, $scope, ModelItem, medifirstService, $state, $window, cetakHelper, cacheHelper) {			
// 			$scope.now = new Date();

			$scope.dataParams = JSON.parse($state.params.dataPasien);
			// 
			$scope.showBilling = false;
			//$scope.urlBilling = $sce.trustAsResourceUrl(manageTataRekening.openPageBilling($scope.dataParams.noRegistrasi));
			var tempData = [];
			var logData=[];
			var dataDel = [];
			$scope.item = {};
			$scope.model={};
			$scope.button = true;
			$scope.billing = true;
			$scope.cetak = true;
			$scope.DiskonKM = false;
			$scope.ubahTanggal = false;
			$scope.FilterData = false;
            var statusPosting = true


			var dibayar=0
			var verifTotal=0

			
			$scope.isRouteLoading=false;
			var norec_ppd = ''
			var norec_pp = ''
			var norec_pd=''
			var strukfk = ''
			var hargasatuan = '';
			var data3 = [];
			var dataLogin =[];
			var KelompokUser =[];
			// $scope.dataDokterSelected={};
			var dataLayanan =[];
			var dataResep =[];
			var ruangaan2 = {};
			var komponeen={};
			var tgltgltgltgl = ''
			var tglkpnaja = []
			$scope.selectedData2 =[];
			var data2=[];
			var dataTampil = 'layanan';
			$scope.item.PegawaiLoginfk = '';
			$scope.item.PegawaiPenindak = '';
			$scope.item.komponen="";
			$scope.statusSelesaiPeriksa = false
			//$scope.Pegawai=medifirstService.getPegawai();
			
			LoadData();

			function LoadData(){
				$scope.isRouteLoading=true;
				// medifirstService.get("akutansi/get-tgl-posting", true).then(function(dat){
    //                 tgltgltgltgl = dat.data.mindate[0].max
    //         		tglkpnaja = dat.data.datedate
                    
    //             })
				$scope.selectedData =[];
				$scope.selectedData2 =[];				
				dataLayanan=[];
				dataResep=[];
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: []
				});
				medifirstService.get("tatarekening/get-data-login?noRegistrasi="+$scope.dataParams.noRegistrasi).then(function (e) {
                	// $scope.listJenisPetugas = e.data.JenisPetugasPelaksana;
                	// $scope.listPetugas = e.data.Pegawai;
                	// $scope.listRuangan = e.data.Ruangan;
                	// $scope.listDokter = e.data.dokter;
                	dataLogin = e.data.datalogin;
                	KelompokUser = e.data.kelompokuser;
					$scope.listRuangAPD = e.data.listRuangan;
					$scope.listKomponen = e.data.komponen;
					$scope.item.PegawaiLoginfk = e.data.pegawailoginfk;
					$scope.listDaftarPrinter = e.data.daftarPrinter;
					var brs = e.data.listRuangan.length
					// ruangaan2 = {id:e.data.listRuangan[brs-1].id,namaruangan:e.data.listRuangan[brs-1].namaruangan}
					$scope.item.ruang2= ruangaan2;
					$scope.item.komponen = komponeen;
             	

					var objSave ={
	    				noregistrasi:$scope.dataParams.noRegistrasi
	    			}
	    			// manageTataRekening.saveakomodasitea(objSave).then(function(data){
						$q.all([
							medifirstService.get("tatarekening/detail-tagihankomponen/"+ $scope.dataParams.noRegistrasi + '?jenisdata=layanan&idruangan='+$scope.item.ruang2.id+ '&komponen='+$scope.item.komponen.id)
							])
						.then(function(data) {
							$scope.IsDataResep = false;
							if (data[0].statResponse){
								dataLayanan=[];
								dataResep=[];
								dibayar=0
								verifTotal=0
								for (var i = data[0].data.details.length - 1; i >= 0; i--) {
									if (data[0].data.details[i].strukfk != null) {
										if (data[0].data.details[i].strukfk.length > 20 ) {
											dibayar=dibayar+data[0].data.details[i].total
										}
										if (data[0].data.details[i].strukfk.length < 20 && data[0].data.details[i].strukfk.length > 5 ) {
											verifTotal=verifTotal+data[0].data.details[i].total
										}
									}
									if (data[0].data.details[i].aturanpakai == null) {
										// dataLayanan[] = data[0].data.details[i]
										dataLayanan.push(data[0].data.details[i])
									}else{
										dataResep.push(data[0].data.details[i])
										// dataResep[] = data[0].data.details[i]
									}
									// if(data[0].data.details[i].namaPelayanan){
									// 	if(data[0].data.details[i].namaPelayanan.indexOf('Konsul') > -1 && data[0].data.details[i].dokter =='-' || data[0].data.details[i].dokter == null ){
									// 		toastr.warning('Mohon isi Dokter Pemeriksa pada layanan '
									// 		+ data[0].data.details[i].namaPelayanan ,'Peringatan !')
									// 	}
									// }
									// if(data[0].data.details[i].iscito == "1"){
									// 	data[0].data.details[i].statuscito = "✔"
									// }else{
									// 	data[0].data.details[i].statuscito = ""
									// }

									// if(data[0].data.details[i].isparamedis == "1"){
									// 	data[0].data.details[i].paramedis = "✔"
									// }else{
									// 	data[0].data.details[i].paramedis = ""
									// }								
								}
								data[0].data.bayar=data[0].data.dibayar
								data[0].data.verifTotal=data[0].data.diverif//verifTotal
								data[0].data.sisa=parseFloat(data[0].data.billing) - data[0].data.dibayar - parseFloat(data[0].data.deposit) 
								debugger;
								$scope.item = data[0].data;
								norec_pd = data[0].data.norec_pd
								$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
								$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
								$scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
								data3 = data[0].data.details
								// ruangaan2 = {id:data[0].data.ruanganlastid,namaruangan:data[0].lastRuangan}
								// $scope.item.ruang2= ruangaan2
								var onDataBound = function () {
						                $('td').each(function () {
						                  if ($(this).text() == 'belum') {$(this).addClass('red')}
						                  if ($(this).text() == 'verif') {$(this).addClass('green')}
						                  // if ($(this).text() == 'Online') {$(this).addClass('koneng')}
						                
						                })
						              }
								$scope.dataRincianTagihan = new kendo.data.DataSource({
									data: dataLayanan,//data[0].details,
	                        		pageSize: 100,
									group: [
			                            //{field: "ruanganTindakan"}
			                        ],

			                        aggregate: [
							
									{ field: 'totaltarif', aggregate: 'sum' },
									{ field: 'totalkomponen', aggregate: 'sum' },

								],
		                        	// pageSize: 10,
								});
								$scope.item.ruang2= ruangaan2
								$scope.isRouteLoading=false;
								
								medifirstService.get("tatarekening/get-sudah-verif?noregistrasi="+
				                    $scope.item.noRegistrasi, true).then(function(dat){
				                    	$scope.item.statusVerif=dat.data.status
								});
								medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi="+
				                    $scope.item.noRegistrasi, true).then(function(dat){
				                    	$scope.statusSelesaiPeriksa= dat.data
				                });
							}

						});
	                });
                // })							
			}
			$scope.loadDataResep = function(){
				$scope.IsDataResep = true;
				dataTampil = 'resep'
				if (dataResep.length !=0) {
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: dataResep,//data[0].details,
	            		pageSize: 20,
						group: [
	                        //{field: "ruanganTindakan"}
	                    ],
	                	// pageSize: 10,
					});
					return
				}
				
				$scope.isRouteLoading=true;
				
				$scope.selectedData =[];
				$scope.selectedData2 =[];
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: [],//data[0].details,
            		pageSize: 20,
					group: [
                        //{field: "ruanganTindakan"}
                    ],
                	// pageSize: 10,
				});

					$q.all([
						medifirstService.get("tatarekening/detail-tagihankomponen/"+ $scope.dataParams.noRegistrasi + '?jenisdata=resep&idruangan='+$scope.item.ruang2.id+ '&komponen='+$scope.item.komponen.id)
						])
					.then(function(data) {

						if (data[0].statResponse){
							dataResep=[];
							dibayar=0
							verifTotal=0
							for (var i =data[0].data.details.length - 1; i >= 0; i--) {
								if (data[0].data.details[i].strukfk != null) {
									if (data[0].data.details[i].strukfk.length > 20 ) {
										dibayar=dibayar+data[0].data.details[i].total
									}
									if (data[0].data.details[i].strukfk.length < 20 &&data[0].data.data.details[i].strukfk.length > 5 ) {
										verifTotal=verifTotal+data[0].data.details[i].total
									}
								}
								if (data[0].data.details[i].aturanpakai == null) {
									// dataLayanan[] =data[0].data.data.details[i]
									dataLayanan.push(data[0].data.details[i])
								}else{
									dataResep.push(data[0].data.details[i])
									// dataResep[] =data[0].data.data.details[i]
								}
								
							}
							data[0].bayar=data[0].dibayar
							data[0].verifTotal=data[0].diverif//verifTotal
							data[0].sisa=parseFloat(data[0].billing) -data[0].data.dibayar - parseFloat(data[0].deposit) 
							$scope.item =data[0].data.data;
							norec_pd =data[0].data.norec_pd
							$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
							$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
							$scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
							data3 =data[0].data.details

							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: dataResep,//data[0].details,
                        		pageSize: 20,
								group: [
		                            //{field: "ruanganTindakan"}
		                        ],
		                        aggregate: [
							
									{ field: 'total', aggregate: 'sum' },
								],
	                        	// pageSize: 10,
							});
							$scope.item.ruang2= ruangaan2
							
						}

							$scope.isRouteLoading=false;
					});
			}
			$scope.loadDataLayanan = function(){
				$scope.IsDataResep = false;
				dataTampil = 'layanan';
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: dataLayanan,//data[0].details,
            		pageSize: 30,
					group: [
                        //{field: "ruanganTindakan"}
                    ],
                	// pageSize: 10,
				});
			}

			$scope.ubahDokterPemeriksa = function(){
				$scope.cboDokter =  true
			}
			$scope.ubahTanggal = function(){
				
                // if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') > $scope.dataSelected.tglPelayanan) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < $scope.dataSelected.tglPelayanan) {
        			for (var i = tglkpnaja.length - 1; i >= 0; i--) {
        				if (tglkpnaja[i] == parseFloat(moment($scope.dataSelected.tglPelayanan).format('D')) ) {
                			alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
		                    return;
        				}
        				
        			}
				}
				// else{
        		// 	alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
		        //     return;
        		// } ales
				$scope.dtTanggal =  true
			}
			$scope.batalTanggal = function(){
				$scope.dtTanggal =  false;
				$scope.item.tanggalPelayanan = "";
			}
			$scope.batalDokterPemeriksa = function(){
				$scope.cboDokter =  false
			}
			$scope.FilterDataCMD = function(){
				$scope.FilterData =  true
			}
			$scope.BatalFilter = function(){
				$scope.FilterData =  false
				$scope.item.namaPelayanan = ''
				$scope.item.namaruangan ={}
			}
			// $scope.CariFilter = function(){
			$scope.$watch('item.filter', function(newValue, oldValue) {
				var layananFilter =[];
				var txtnaonwelah ='';

				if (dataTampil == 'layanan') {

					for (var i = dataLayanan.length - 1; i >= 0; i--) {
						txtnaonwelah=' ' + dataLayanan[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								layananFilter.push(dataLayanan[i])
							}	
						}
						
					}
					if ($scope.item.filter == '') {
						layananFilter = dataLayanan
					}
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: layananFilter,
	            		pageSize: 20,
						group: [
	                        //{field: "ruanganTindakan"}
	                    ],
					});
				}else{
					var resepFilter =[];
					for (var i = dataResep.length - 1; i >= 0; i--) {
						txtnaonwelah= ' ' + dataResep[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								resepFilter.push(dataResep[i])
							}
						}
						
					}
					if ($scope.item.filter == '') {
						resepFilter = dataResep
					}
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: resepFilter,
	            		pageSize: 20,
						group: [
	                        //{field: "ruanganTindakan"}
	                    ],
					});
				}
				
			});
			$scope.CariFilterRuangan = function(){
				$scope.isRouteLoading=true;

				var strRUanganFilter = '';
				if ($scope.item.ruang2 != null) {
					strRUanganFilter = '&jenisdata=layanan&idruangan='+$scope.item.ruang2.id
					ruangaan2 = {id:$scope.item.ruang2.id,namaruangan:$scope.item.ruang2.namaruangan}
				}else{
					ruangaan2 = {}
				}
				debugger;
				if ($scope.item.komponen != null) {
					strRUanganFilter = strRUanganFilter + '&komponen='+$scope.item.komponen.id
					komponeen = {id:$scope.item.komponen.id,komponenharga:$scope.item.komponen.komponenharga}
				}else{
					komponeen = {}
				}
				
							


				$scope.selectedData =[];

				dataLayanan=[];
				dataResep=[];
				var objSave ={
					noregistrasi:$scope.item.noRegistrasi
				}
				// manageTataRekening.postJurnalAkuntansi(objSave).then(function(data){
				// })

    			// manageTataRekening.saveakomodasitea(objSave).then(function(data){
    				debugger;
					$q.all([
						medifirstService.get("tatarekening/detail-tagihankomponen/"+ $scope.item.noRegistrasi + '?jenisdata=layanan' + strRUanganFilter  )
						])
					.then(function(data) {

						if (data[0].statResponse){
							dataLayanan=[];
							dataResep=[];
							dibayar=0
							verifTotal=0
							for (var i = data[0].data.details.length - 1; i >= 0; i--) {
								if (data[0].data.details[i].strukfk != null) {
									if (data[0].data.details[i].strukfk.length > 20 ) {
										dibayar=dibayar+data[0].data.details[i].total
									}
									if (data[0].data.details[i].strukfk.length < 20 && data[0].data.details[i].strukfk.length > 5 ) {
										verifTotal=verifTotal+data[0].data.details[i].total
									}
								}
								if (data[0].data.details[i].aturanpakai == null) {
									// dataLayanan[] = data[0].data.details[i]
									dataLayanan.push(data[0].data.details[i])
								}else{
									dataResep.push(data[0].data.details[i])
									// dataResep[] = data[0].data.details[i]
								}
								// if(data[0].data.details[i].isparamedis == "1"){
								// 		data[0].data.details[i].dokter = "Paramedis"
								// }	
								if(data[0].data.details[i].iscito == "1"){
									data[0].data.details[i].statuscito = "✔"
								}else{
									data[0].data.details[i].statuscito = ""
								}

								if(data[0].data.details[i].isparamedis == "1"){
									data[0].data.details[i].paramedis = "✔"
								}else{
									data[0].data.details[i].paramedis = ""
								}		
							}
							
							data[0].data.bayar=data[0].data.dibayar
							data[0].data.verifTotal=data[0].data.diverif//verifTotal
							data[0].data.sisa=parseFloat(data[0].data.billing) - data[0].data.dibayar - parseFloat(data[0].data.deposit) 
							$scope.item = data[0].data;
							norec_pd = data[0].data.norec_pd
							$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
							$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
							$scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
							data3 = data[0].data.details

							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: dataLayanan,//details,
								group: [
		                            //{field: "ruanganTindakan"}
		                        ],
            					pageSize: 20,
            					aggregate: [
							
									{ field: 'total', aggregate: 'sum' },
								],
		                        
	                        	// pageSize: 10,
							});
							$scope.item.ruang2= ruangaan2;
							$scope.item.komponen= komponeen;
							
						}
							$scope.isRouteLoading=false;

					});
                // });
				
				// var objSave ={}
				// managePasien.akomodasiOtomatis("registrasi-pelayanan/save-akomodasi?noRecPasienDaftar="+norec_pd,objSave).then(function(data){
				// 	// LoadData()
    //             });
    	// 		var objSave ={
    	// 			noregistrasi:$scope.item.noRegistrasi
    	// 		}
    	// 		manageTataRekening.saveakomodasitea(objSave).then(function(data){
					// // LoadData()
     //            });
			}
			$scope.CariNoreg = function(){
				$scope.isRouteLoading=true;
				$scope.selectedData =[];

				medifirstService.get("tatarekening/get-data-login?noRegistrasi="+$scope.item.noRegistrasi).then(function (e) {
                	dataLogin = e.data.datalogin;
                	KelompokUser = e.data.kelompokuser;
					$scope.listRuangAPD = e.data.listRuangan
					ruangaan2 = {id:e.data.listRuangan[0].id,namaruangan:e.data.listRuangan[0].namaruangan}
					$scope.item.ruang2= ruangaan2
             	

					dataLayanan=[];
					dataResep=[];
					var objSave ={
						noregistrasi:$scope.item.noRegistrasi
					}
					// manageTataRekening.postJurnalAkuntansi(objSave).then(function(data){
					// })

	    			manageTataRekening.saveakomodasitea(objSave).then(function(data){
						$q.all([
							medifirstService.get("tatarekening/detail-tagihankomponen/"+ $scope.item.noRegistrasi + '?jenisdata=layanan&idruangan='+$scope.item.ruang2.id + '&komponen='+$scope.item.komponen.id)
							])
						.then(function(data) {

							if (data[0].statResponse){
								dataLayanan=[];
								dataResep=[];
								dibayar=0
								verifTotal=0
								for (var i = data[0].details.length - 1; i >= 0; i--) {
									if (data[0].data.details[i].strukfk != null) {
										if (data[0].data.details[i].strukfk.length > 20 ) {
											dibayar=dibayar+data[0].data.details[i].total
										}
										if (data[0].data.details[i].strukfk.length < 20 && data[0].data.details[i].strukfk.length > 5 ) {
											verifTotal=verifTotal+data[0].data.details[i].total
										}
									}
									if (data[0].data.details[i].aturanpakai == null) {
										// dataLayanan[] = data[0].data.details[i]
										dataLayanan.push(data[0].data.details[i])
									}else{
										dataResep.push(data[0].data.details[i])
										// dataResep[] = data[0].data.details[i]
									}
									if(data[0].data.details[i].iscito == "1"){
										data[0].data.details[i].statuscito = "✔"
									}else{
										data[0].data.details[i].statuscito = ""
									}

									if(data[0].data.details[i].isparamedis == "1"){
										data[0].data.details[i].paramedis = "✔"
									}else{
										data[0].data.details[i].paramedis = ""
									}		
								}
								data[0].bayar=data[0].dibayar
								data[0].verifTotal=data[0].diverif//verifTotal
								data[0].sisa=parseFloat(data[0].billing) - data[0].dibayar - parseFloat(data[0].deposit) 
								$scope.item = data[0];
								norec_pd = data[0].norec_pd
								$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
								$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
								$scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
								data3 = data[0].details

								$scope.dataRincianTagihan = new kendo.data.DataSource({
									data: dataLayanan,//details,
									group: [
			                            //{field: "ruanganTindakan"}
			                        ],
	            					pageSize: 20,
			                        
		                        	// pageSize: 10,
								});
								$scope.item.ruang2= ruangaan2
								$scope.isRouteLoading=false;

								medifirstService.get("tatarekening/get-sudah-verif?noregistrasi="+
				                    $scope.item.noRegistrasi, true).then(function(dat){
				                    	$scope.item.statusVerif=dat.data.status
				                });
							}

						});
	                });
                })
				
				// var objSave ={}
				// managePasien.akomodasiOtomatis("registrasi-pelayanan/save-akomodasi?noRecPasienDaftar="+norec_pd,objSave).then(function(data){
				// 	// LoadData()
    //             });
    	// 		var objSave ={
    	// 			noregistrasi:$scope.item.noRegistrasi
    	// 		}
    	// 		manageTataRekening.saveakomodasitea(objSave).then(function(data){
					// // LoadData()
     //            });
			}
			$scope.simpanDokterPemeriksa = function(){
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
                    return;
				}
				var objSave ={
					norec_pp:$scope.dataSelected.norec,
					objectpegawaifk:$scope.item.namaDokter.id,
					norec_apd:$scope.dataSelected.norec_apd
				}
				manageTataRekening.postUpdatepelayananpasienpetugas(objSave).then(function(data){
					LoadData()
                });
				$scope.DiskonKM = false;
			}
			$scope.saveLogging=function(jenis,referensi,noreff,ket){
				manageTataRekening.get("logging/save-log-all?jenislog="+ jenis
					+ "&referensi="+referensi
					+ "&noreff="+noreff
					+ "&keterangan="+ ket
					).then(function(data) {
		
			    }) 
			}
			$scope.simpanTanggal = function(){
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
                    return;
				}
				
				var objSave ={
					norec_pp: $scope.dataSelected.norec,
					tanggalPelayanan : moment($scope.item.tanggalPelayanan).format('YYYY-MM-DD HH:mm:ss')
				}
				manageTataRekening.postUpdatetglpelayanan(objSave).then(function(data){
					$scope.saveLogging('Ubah Tgl Pelayanan','norec Pelayanan Pasien',$scope.dataSelected.norec ,'menu Detail Tagihan')
					LoadData()
                });
				$scope.dtTanggal = false;
			}

			function showButton(){
				$scope.showBtnKembali = true;
				$scope.showBtnCetak = true;
			}

			// $scope.pilihProdukByRuangan =function(){
   //              medifirstService.get("tatarekening/get-produkbyruangan?objectruanganfk="+$scope.item.ruangan.id).then(function(data){
   //                  $scope.listPelayanan = data;
   //                  $scope.item.kelas ='';
   //                  $scope.item.pelayanan ='';
   //              });
   //          }
			// $scope.pilihKelasByProduk =function(){
   //              medifirstService.get("tatarekening/get-kelasbyproduk?objectprodukfk="+$scope.item.pelayanan.id).then(function(data){
   //                  $scope.listKelas = data;
   //                  $scope.item.kelas ='';
   //              });
   //          }
			$scope.pilihHargaByKelas =function(){
                $scope.item.harga = $scope.item.kelas.hargasatuan
            }

			showButton();

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			$scope.rowNumber = 0;
			$scope.renderNumber = function(){
				return ++$scope.rowNumber;
			}
			$scope.klikDetail = function(data){
				
				if (data.komponenharga != "Jasa Sarana"){
					$scope.button = false;
					$scope.billing = false;
					$scope.cetak = false;
					$scope.dtTanggal = false;
					$scope.FilterData = false;
					$scope.DiskonKM = true;
					$scope.label=data.komponenharga;
					$scope.item.komponen.idDis=data.hargasatuan;
					$scope.item.persenDiscount="";
					$scope.item.diskonKomponen="";
					norec_ppd=data.norec
					norec_pp=data.norec_pp
					strukfk=data.strukfk
					hargasatuan=data.hargasatuan
				}else if (data.komponenharga == "Jasa Sarana"){
					$scope.button = true;
					$scope.billing = true;
					$scope.cetak = true;
					$scope.dtTanggal = false;
					$scope.FilterData = false;
					$scope.DiskonKM = false;
				}
			}

			 $scope.$watch('item.persenDiscount', function(newValue, oldValue) {
		            if (newValue != oldValue  ) {
		            	if ($scope.item.persenDiscount>100)
		            	{
		            		$scope.item.persenDiscount="";
		            	}
			           $scope.item.diskonKomponen =((parseFloat($scope.item.komponen.idDis)) *  $scope.item.persenDiscount) /100
		            }
		      })

			$scope.UpdateDiskon = function(){
				
				if (strukfk != " / "){
					alert('Sudah di Verifikasi Tatarekening tidak bisa diskon!')
					return
				}
				// if (KelompokUser[0].id != 52) {
				// 	alert('Hanya TataRekening/Admin yg boleh memberikan diskon!')
				// 	return
				// }
				if($scope.item.diskonKomponen > hargasatuan){
					alert('Diskon tidak boleh lebih besar dari total jasa!!!')
				}else{
					var objSave ={
						norec_ppd:norec_ppd,
						norec_pp:norec_pp,
						hargadiskon:$scope.item.diskonKomponen,
						hargakomponen:$scope.item.komponen.idDis,
						hargajasa:$scope.item.JasaKomponen,
					}
					manageTataRekening.postUpdateHargaDiskonKomponen(objSave).then(function(data){
						// LoadData()
						$scope.saveLogging('Diskon Layanan','norec Pelayanan Pasien',norec_pp ,'menu Detail Tagihan')
						loadKomponen();
	                });
	                // $scope.BatalDiskon();
					// $scope.DiskonKM = false;
					$scope.button = true;
					$scope.billing = true;
					$scope.cetak = true;
					$scope.dtTanggal = false;
					 var dataz ={};
	            	     if ($scope.dataSelectedKomponen != undefined ){
		                    if ($scope.dataSelected.namaPelayanan ==  $scope.item.namaPelayanans){
		                    	if(	$scope.label== $scope.dataSelectedKomponen.komponenharga){
 									dataz.hargadiscount = $scope.item.diskonKomponen
		                       		 $scope.dataSelectedKomponen.hargadiscount=  $scope.item.diskonKomponen
		                    	}
		                    }
           			 }      
				}
			}
			  $scope.BatalDiskon =function(){
			  			// LoadData()
	                	$scope.popupKomponen.center().close();
	           }
			// $scope.BatalDiskon = function(){
			// 	$scope.DiskonKM = false;
			// 	$scope.button = true;
			// 	$scope.billing = true;
			// 	$scope.cetak = true;
			// }

			$scope.$watch('item.namaPelayanan', function(newValue, oldValue) {
            	var data2 = [];
            	var data ={};
	            for (var i = data3.length - 1; i >= 0; i--) {
	            	if (data3[i].namaPelayanan.match(newValue)) {
	            		data = data3[i];
	            		data2.push(data)
	            	}
	            }
	            $scope.dataRincianTagihan = new kendo.data.DataSource({
                    data: data2
                });
	        })
	        $scope.$watch('item.namaruangan.ruanganTindakan', function(newValue, oldValue) {
            	var data2 = [];
            	var data ={};
	            for (var i = data3.length - 1; i >= 0; i--) {
	            	if (data3[i].ruanganTindakan.match(newValue)) {
	            		data = data3[i];
	            		data2.push(data)
	            	}
	            }
	            $scope.dataRincianTagihan = new kendo.data.DataSource({
                    data: data2,
                    group: [
                            //{field: "ruanganTindakan"}
                        ],
                });
	        })


			// $scope.Cetak=function(){
   //              var confirm = $mdDialog.confirm()
   //                    .title('Informasi!')
   //                    .textContent('tes?')
   //                    .ariaLabel('Lucky day')
   //                    .ok('Ya')
   //                    .cancel('Tidak')

                
   //          };
   			
   			$scope.CetakBuktiLayanan = function()
			{
				// $mdDialog.show(confirm).then(function() {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
                    return;
				}
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
				    // Save it!
				    stt='true';
				} else {
				    // Do nothing!
				    stt='false'
				}
				medifirstService.get("get-data-login").then(function (e) {
                	var client = new HttpClient(); 
	                //client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
	                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' + $scope.item.noRegistrasi + '&strIdPegawai='+ e.data[0].id + '&strIdRuangan='+$scope.dataSelected.ruid+'&view=' + stt, function(response) {
	                	//http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
	                    // do something with response
	                });
             	})
                
                    // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=' + $scope.item.noRegistrasi + '&strIdPegawai='+ $scope.Pegawai.id + '&view=' + stt, function(response) {
                    //     // do something with response
                    // });
                // })

				
				// $scope.showBilling = true;
				// $scope.showBtnCetak = false;
			}
			$scope.CetakBuktiLayananPerTindakan = function()
			{
				var daftarCetak = [];
                if($scope.selectedData.length > 0){
                    $scope.selectedData.forEach(function(items){
                        daftarCetak.push(items)
                    })
                    var resultCetak = daftarCetak.map(a => a.norec).join("|");
					medifirstService.get("get-data-login").then(function (e) {
						var client = new HttpClient();
						if(daftarCetak[0].ruid==44){  
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayananBedah-norec_apd=1&norec=' + resultCetak + '&strIdPegawai='+e.data[0].id+'&strIdRuangan=-&view=true', function(response) {
								// do something with response
							});
						}else{
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai='+e.data[0].id+'&strIdRuangan=-&view=true', function(response) {
								// do something with response
							});
						}
					});
                }else{
                    messageContainer.error('Data belum dipilih')
                }

                // ####
     //            if($scope.selectedData.length > 0){
     //                $scope.selectedData.forEach(function(items){
     //                    daftarCetak.push(items)
     //                })
     //                var resultCetak = daftarCetak.map(a => a.norec).join("|");
					// medifirstService.get("get-data-login").then(function (e) {
					// 	var client = new HttpClient();     
					// 	client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai='+e.data[0].id+'&strIdRuangan=-&view=true', function(response) {
					// 		// do something with response
					// 	});
					// });
     //            }else{
     //                messageContainer.error('Data belum dipilih')
     //            }
                // ####

				// // $mdDialog.show(confirm).then(function() {
				// if ($scope.dataSelected == undefined) {
				// 	alert("Pilih pelayanan dahulu!");
                //     return;
				// }else{
				// 	
				// 	var dataSelected = $scope.dataSelected.prid;
				// }
				// var NoStruk = $scope.dataRincianTagihan;
				// var struk = "";
				// var kwitansi = "";
				// var stt = 'false'
				// if (confirm('View Rincian Biaya? ')) {
				//     // Save it!
				//     stt='true';
				// } else {
				//     // Do nothing!
				//     stt='false'
				// }
				// medifirstService.get("get-data-login").then(function (e) {
                // 	var client = new HttpClient(); 
	            //     //client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
	            //     client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan-pertindakan=1&norec=' + $scope.item.noRegistrasi + '&strIdPegawai='+ e.data[0].id + '&strIdRuangan='+$scope.dataSelected.ruid+ '&strIdTindakan=' +dataSelected+'&view=' + stt, function(response) {
	            //     	//http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
	            //         // do something with response
	            //     });
             	// })
                
                //     // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=' + $scope.item.noRegistrasi + '&strIdPegawai='+ $scope.Pegawai.id + '&view=' + stt, function(response) {
                //     //     // do something with response
                //     // });
                // // })

				
				// // $scope.showBilling = true;
				// // $scope.showBtnCetak = false;
			}

			$scope.CetakBuktiLayananJasa = function()
			{
				var daftarCetak = [];
                if($scope.selectedData.length > 0){
                    $scope.selectedData.forEach(function(items){
                        daftarCetak.push(items)
                    })
                    var resultCetak = daftarCetak.map(a => a.norec).join("|");
					medifirstService.get("get-data-login").then(function (e) {
						var client = new HttpClient();     
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-jasa-norec_apd=1&norec=' + resultCetak + '&strIdPegawai='+e.data[0].id+'&strIdRuangan=-&view=true', function(response) {
							// do something with response
						});
					});
                }else{
                    messageContainer.error('Data belum dipilih')
                }
			}

			$scope.Cetak = function()
			{
				// $mdDialog.show(confirm).then(function() {
				// debugger
				$scope.isRouteLoading=true;
				medifirstService.get("tatarekening/detail-tagihankomponen/"+ $scope.item.noRegistrasi + '?jenisdata=bill' + '&komponen='+$scope.item.komponen.id ).then(function(dat){
                    $scope.isRouteLoading=false;
                    var NoStruk = $scope.dataRincianTagihan;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya? ')) {
					    // Save it!
					    stt='true';
					} else {
					    // Do nothing!
					    stt='false'
					} 
					// if ($scope.item.jenisPasien != "BPJS") {
						medifirstService.get("get-data-login").then(function (e) {
		                	var client = new HttpClient(); 
			                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
			                    // do something with response
			                });
		             	})
					// }else{
					// 	medifirstService.get("get-data-login").then(function (e) {
		   //              	var client = new HttpClient(); 
			  //               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
			  //                   // do something with response
			  //               });
		   //           	})
					// }
            	});
			}

			$scope.CetakRincianRanap = function(){
				// $mdDialog.show(confirm).then(function() {
				// debugger
				$scope.isRouteLoading=true;
				medifirstService.get("tatarekening/detail-tagihan/"+ $scope.item.noRegistrasi + '?jenisdata=bill' ).then(function(dat){
                    $scope.isRouteLoading=false;
                    var NoStruk = $scope.dataRincianTagihan;
					var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Biaya Rawat Inap? ')) {
					    // Save it!
					    stt='true';
					} else {
					    // Do nothing!
					    stt='false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("get-data-login").then(function (e) {
	                	var client = new HttpClient(); 
		                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaRanap=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt+'&print='+$scope.item.daftarprinter.namaprinter, function(response) {
		                    // do something with response
		                });
	             	})
					// }else{
					// 	medifirstService.get("get-data-login").then(function (e) {
		   //              	var client = new HttpClient(); 
			  //               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
			  //                   // do something with response
			  //               });
		   //           	})
					// }
            	});
			}

			$scope.RincianObat = function(){
				$scope.isRouteLoading=true;
				medifirstService.get("tatarekening/detail-tagihan/"+ $scope.item.noRegistrasi + '?jenisdata=bill' ).then(function(dat){
                    $scope.isRouteLoading=false;
                    var struk = "";
					var kwitansi = "";
					var stt = 'false'
					if (confirm('View Rincian Obat & Alkes? ')) {
					    // Save it!
					    stt='true';
					} else {
					    // Do nothing!
					    stt='false'
					}
					// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("get-data-login").then(function (e) {
	                	var client = new HttpClient(); 
		                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
		                    // do something with response
		                });
	             	})
            	});

			}

			// c
			$scope.CetakBillingNaikKelas = function(){
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
				    // Save it!
				    stt='true';
				} else {
				    // Do nothing!
				    stt='false'
				}
				medifirstService.get("get-data-login").then(function (e) {
	            	var client = new HttpClient(); 
	                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya-kelas-dijamin=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
	                    // do something with response
	                });
	         	})
			}
			$scope.CetakBillingTotal = function()
			{
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "TOTALTOTALTOTAL";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rincian Biaya? ')) {
				    // Save it!
				    stt='true';
				} else {
				    // Do nothing!
				    stt='false'
				}
				// if ($scope.item.jenisPasien != "BPJS") {
					medifirstService.get("get-data-login").then(function (e) {
	                	var client = new HttpClient(); 
		                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
		                    // do something with response
		                });
	             	})
				// }else{
					// medifirstService.get("get-data-login").then(function (e) {
	    //             	var client = new HttpClient(); 
		   //              client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
		   //                  // do something with response
		   //              });
	    //          	})
				// }
				

             	
                
			}
			$scope.CetakRekap = function()
			{
				// $mdDialog.show(confirm).then(function() {
				debugger
				var NoStruk = $scope.dataRincianTagihan;
				var struk = "";
				var kwitansi = "";
				var stt = 'false'
				if (confirm('View Rekap Biaya? ')) {
				    // Save it!
				    stt='true';
				} else {
				    // Do nothing!
				    stt='false'
				}
				medifirstService.get("get-data-login").then(function (e) {
                	var client = new HttpClient(); 
	                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
	                    // do something with response
	                });
             	})
            }

			$scope.$watch('item.qty', function(newValue, oldValue) {
			 	if (newValue != oldValue  ) {
			 		$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga)-parseFloat($scope.item.diskon))
			 	}
			 });
			$scope.$watch('item.diskon', function(newValue, oldValue) {
			 	if (newValue != oldValue  ) {
			 		$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga)-parseFloat($scope.item.diskon))
			 	}
			 });
			$scope.$watch('item.harga', function(newValue, oldValue) {
			 	if (newValue != oldValue  ) {
			 		$scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga)-parseFloat($scope.item.diskon))
			 	}
			 });
			 $scope.selectedData = [];
			 $scope.onClick = function(e){
                var element =$(e.currentTarget);
                	
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                    if(dataItem.status == "verif"){

						alert("Data Sudah Di verif");
						element[0].checked = false;
	                    return;
					
                    }
                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function(e) { 
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

            // $scope.selectedData = [];
            // var isCheckAll = false
            // $scope.selectUnselectAllRow = function(e)
            // {
            // 	var element =$(e.currentTarget);
            //     var tempData = $scope.dataRincianTagihan._data;
            //     var checked = element.is(':checked');

            //     if(checked)
            //     {
            //         for(var i=0; i<tempData.length; i++)
            //         {
            //             tempData[i].statCheckbox = false;
            //         }
            //     }
            //     else{
            //         isCheckAll = true;
            //         for(var i=0; i<tempData.length; i++)
            //         {
            //             tempData[i].statCheckbox = true;
            //         }
            //     }
            //     // UbahGrid(tempData);
            //     reloaddataSourceGrid(tempData); 
            // }

            $scope.selectUnselectAll = function(e) {

            	$('#selectall').click(function () {
			        $('.selectedId').prop('checked', this.checked);
			    });

			    $('.selectedId').change(function () {
			        var check = ($('.selectedId').filter(":checked").length == $('.selectedId').length);
			        $('#selectall').prop("checked", check);
			    });
   //          	function checkAll() {

			//   var inputs = document.querySelectorAll('#data_check');
			//   for (var i = 0; i < inputs.length; i++) {
			//     inputs[i].checked = true;
			//   }

			//   this.onclick = uncheckAll;
			// }

			// function uncheckAll() {
			//   var inputs = document.querySelectorAll('#data_check');
			//   for (var i = 0; i < inputs.length; i++) {
			//     inputs[i].checked = false;
			//   }

			//   this.onclick = checkAll; //function reference to original function
			// }

			// var el = document.getElementById("checkAll"); //let for ES6 aficionados 
			// el.onclick = checkAll; //again, function reference, no ()
            }
            

			var onDataBound = function () 
			{
	            $('td').each(function () {
	              if ($(this).text() == 'belum') {$(this).addClass('red')}
	              if ($(this).text() == 'verif') {$(this).addClass('green')}
	              // if ($(this).text() == 'Online') {$(this).addClass('koneng')}
	            
	            })
	          }

			$scope.columnRincianTagihan ={
			 scrollable: true,
                dataBound: onDataBound,
                columns :
			 [
			{
				"title": "<input type='checkbox' class='checkbox' id='selectall' ng-click='selectUnselectAll()' />",
				"template": "<input type='checkbox' class='checkbox selectedId' ng-click='onClick($event)' />",
                "width": 40

			},
			{
				"field": "status",
				"title": "Status",
				"width":"100px",
			},
			{
				"field": "tglPelayanan",
				"title": "Tanggal",
				"width":"100px",
				"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
				 // "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
			},
			{
				"field": "namaPelayanan",
				"title": "Nama Pelayanan",
				"width":"200px",
			},
			{
				"field": "kelasTindakan",
				"title": "Kelas",
				"width":"70px",
			},
			{
				"field": "dokter",
				"title": "Dokter",
				"width":"170px",
			},
			{
				"field": "komponenharga",
				"title": "Nama Komponen",
				"width":"130px",
			},
			{
				"field": "ruanganTindakan",
				"title": "Ruangan",
				"width":"200px",
			},
			{
				"field": "jumlah",
				"title": "Qty",
				"width":"50px",
				"template": "<span class='style-right'>#: jumlah #</span>"
			},
			{
				"field": "hargakomponen",
				"title": "Harga Jasa",
				"width":"120px",
				"template": "<span class='style-right'>{{formatRupiah('#: hargakomponen #', '')}}</span>"
			},
			{
				"field": "tarif",
				"title": "Tarif",
				"width":"120px",
				"template": "<span class='style-right'>{{formatRupiah('#: tarif #', '')}}</span>"
			},
			{
				"field": "produkfk",
				"title": "produkfk",
				"width":"0px"
			},
			// {
			// 	"field": "jasa",
			// 	"title": "Jasa",
			// 	"width":"100px",
			// 	"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
			// },
			{
				"field": "totalkomponen",
				"title": "Total Komponen",
				"width":"120px",
				"template": "<span class='style-right'>{{formatRupiah('#: totalkomponen #', '')}}</span>",
				// "aggregates": ["sum"],
				// "footerTemplate": "<span class='style-right'>Rp. {{formatRupiah('#:data.totalkomponen.sum  #', '')}}</span>"
			},
			{
				"field": "totaltarif",
				"title": "Total Tarif",
				"width":"120px",
				"template": "<span class='style-right'>{{formatRupiah('#: totaltarif #', '')}}</span>",
				// "aggregates": ["sum"],
				// "footerTemplate": "<span class='style-right'>Rp. {{formatRupiah('#:data.totaltarif.sum  #', '')}}</span>"
			},
		
			]};

 			$scope.inputDokterPelaksana = function(){
              if ($scope.dataSelected == undefined) {
					messageContainer.error("Pilih pelayanan dahulu!");
                    return;
				}	   
            
               SeeDokterPelaksana();
			   $scope.item.tglPelayanans=$scope.dataSelected.tglPelayanan;
			   $scope.item.namaPelayanans=$scope.dataSelected.namaPelayanan;
			   if( $scope.dataSelected.isparamedis == true)
			   		$scope.item.paramedis = true
			   else
			 	  	$scope.item.paramedis = false
			   $scope.popup_editor.center().open();
            
            }
            $scope.click=function(dataDokterSelected){
	            if (dataDokterSelected!=undefined){
	            	// var id = $scope.dataDokterSelected.jpp_id;
		            // 	manageTataRekening.get("pelayananpetugas/get-pegawaibyjenispetugaspe?objectjenispetugaspefk="+id).then(function(data){
		            //         $scope.dataSource = data.pegawai;
		                 
		            //     });
	            medifirstService.get("pelayananpetugas/get-pegawai-saeutik?namapegawai="+dataDokterSelected.namalengkap, true, true, 10)
	            	.then(function(data) {
             
	                $scope.listPegawaiPemeriksa.add(data[0])
	                $scope.model.pegawais = data[0];

         	    })
					$scope.model.jenisPelaksana={id:dataDokterSelected.jpp_id,jenisPetugasPelaksana:dataDokterSelected.jenispetugaspe}
					// $scope.model.pegawais={
					// 	id:dataDokterSelected.pg_id,
					// 	namalengkap:dataDokterSelected.namalengkap,


					// }
				}
            }
			function SeeDokterPelaksana (){
			    manageTataRekening.get("pelayananpetugas/get-data-combo").then(function(data){
                    $scope.listJenisPelaksana = data.jenispetugaspelaksana;
                    // $scope.listPegawaiPemeriksa = data.pegawai;
                  
                });
              medifirstService.getDataDummyPHP("pelayananpetugas/get-pegawai-saeutik", true, true, 10).then(function(data) {
                     $scope.listPegawaiPemeriksa= data;

               });
			   // $scope.isRouteLoading=true;
				manageTataRekening.get("pelayananpetugas/get-petugasbypelayananpasien?norec_pp="+$scope.dataSelected.norec).
					  then(function(data){
		                    $scope.sourceDokterPelaksana = data.data;
		                    // $scope.isRouteLoading=false;
		                 
		        });
			} 
      
           
			$scope.columnDokters = [
                           {
	                            field: "jenispetugaspe",
	                            title: "Jenis Pelaksana",
	                            width: "100px",
	                            // template: "#= jenisPetugas.jenisPelaksana #"
                           },
                           {
	                            field: "namalengkap",
	                            title: "Nama Pegawai",
	                            width: "200px",
	                            // template: multiSelectArrayToString
                           }
             ];
                $scope.simpanDokterPelaksana = function () {
                	if($scope.model.jenisPelaksana == undefined && $scope.item.paramedis == undefined){
						if ($scope.model.jenisPelaksana == undefined ) {
		                    messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
		                    return
		                 }
		                 if ($scope.model.pegawais == undefined) {
		                    messageContainer.error("Pegawai Tidak Boleh Kosong")
		                    return
						 }
                	}
	                
					 
	                 var norec_ppp="";
	                 if ($scope.dataDokterSelected!=undefined ){
	               		norec_ppp= $scope.dataDokterSelected.norec_ppp
	                 }
	                
					if(norec_ppp == ""){
						if( $scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length> 0 && $scope.model.jenisPelaksana != undefined){
							for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
								if($scope.sourceDokterPelaksana[i].jenispetugaspe ==$scope.model.jenisPelaksana.jenisPetugasPelaksana
								// && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
								){
									  messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
									 return
								}
							}
					   }
					}	   
	               

	               var pelayananpasienpetugas = {
		                   norec_ppp:norec_ppp,
		                   norec_pp:$scope.dataSelected.norec,
		                   norec_apd:$scope.dataSelected.norec_apd,	
		                   objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
		                   objectpegawaifk:$scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,  
		                   isparamedis:$scope.item.paramedis,  
	                }

	                var objSave = {
	                    pelayananpasienpetugas: pelayananpasienpetugas,
	                    
	                }
	    
	                manageTataRekening.postPelayananPetugas(objSave).then(function (e) {
						var jenis = 'Input/Ubah Petugas Layanan';
						var norec = e.data.norec
						$scope.saveLogging(jenis,'norec Pelayanan Pasien Petugas',norec,'')
	                    SeeDokterPelaksana();
	                    // LoadData();
	              

	                   var data ={};
	            	     if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana!= undefined&&  $scope.model.jenisPelaksana.id==4 ){
		                    if ($scope.dataSelected.namaPelayanan ==  $scope.item.namaPelayanans){
		                        data.dokter = $scope.model.pegawais.namalengkap
		                        $scope.dataSelected.dokter=data.dokter
		                     
		                    }
           			 	} 

           			 	if( $scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length> 0 ){
           			 		for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
           			 			if($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.item.paramedis != true && $scope.model.pegawais == undefined){
           			 				$scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
									break
           			 			}
           			 			if($scope.item.paramedis == true){
           			 				$scope.dataSelected.dokter = 'Paramedis'
           			 				break
           			 			}
           			 		}
           			 	}
           			 	$scope.model.jenisPelaksana = undefined;
	                    $scope.model.pegawais = undefined;
	                    $scope.dataDokterSelected= undefined;	
	                })
	                 
           		 }

           		
				 $scope.hapusDokterPelaksana = function () {
	                if ($scope.dataDokterSelected == undefined) {
	                    messageContainer.error("Pilih data Pegawai dulu!!")
	                    return
	                }
	                
	                var pelayananpasienpetugas = {
	                   norec_ppp:$scope.dataDokterSelected.norec_ppp,
	                  
	                }

	                var objSave = {
	                    pelayananpasienpetugas: pelayananpasienpetugas,
	                    
	                }
	                manageTataRekening.deletePelayananPetugas(objSave).then(function (e) {
	                    SeeDokterPelaksana();
	                    // LoadData();
	                    $scope.model.jenisPelaksana = "";
	                    $scope.model.pegawais = "";
	                    $scope.dataDokterSelected= undefined;               			                   
	                })
              			var data ={};
	            	     if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana.id==4 ){
		                    if ($scope.dataSelected.namaPelayanan ==  $scope.item.namaPelayanans){
		                        $scope.dataSelected.dokter="-"
		                     
		                    }
           			 	}    
            }

            $scope.batalDokterPelaksana=function(){
            	// LoadData();
             	$scope.model.jenisPelaksana = "";
	            $scope.model.pegawais = "";
	            $scope.dataDokterSelected= undefined;
                $scope.popup_editor.center().close();


            }
            
			$scope.Save = function(){
				window.messageContainer.log("Sukses");
				$scope.showBtnSimpan = false;
			}

			$scope.verifikasiberkas =function(){
				// $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				// manageTataRekening.post('lab-radiologi/delete-pelayanan-pasien',objDelete).then(function(e){
				// 	       LoadData();          
				// 	 })
			}

			$scope.batalverifikasiberkas = function(){
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				var objSave = {
                    noregistrasi: $scope.item.noRegistrasi,
					idlogin: $scope.dataLogin.id,
					status:'batalverif'
                }
				
				manageTataRekening.saveVerifikasiBerkas(objSave).then(function(e){
					var resp =e.data
				});
			}

			$scope.Back = function(){
				if($scope.showBilling)
				{
					$scope.showBilling = false;
					$scope.showBtnCetak = true;
				}
				else
				{
					window.history.back();
					//$state.go('DaftarPasienPulang', {});
				}
				
			}

			$scope.formatRupiah = function(value, currency) {
			    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.formatTanggal = function(tanggal)
			{
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.formatTanggalAjah = function(tanggal)
			{
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.klik = function(current){
				// manageTataRekening.get("akutansi/get-sudah-posting?tgl="+
    //                 current.tglPelayanan, true).then(function(dat){
    //                     statusPosting = dat.data.status
    //                 }
    //             )
				// $scope.item.tanggalPelayanan=current.tglPelayanan;
				// $scope.item.jenisPetugas={id:current.jppid,jenispetugaspe:current.jenispetugaspe};
				// $scope.item.petugas={id:current.pgid,paramedis:current.dokter};
				// $scope.item.ruangan={id:current.ruid,ruanganTindakan:current.ruanganTindakan};

				 // medifirstService.get("tatarekening/get-produkbyruangan?objectruanganfk="+current.ruid).then(function(data){
     //                $scope.listPelayanan = data;
     //                $scope.item.pelayanan={id:current.prid,namaPelayanan:current.namaPelayanan};
     //                medifirstService.get("tatarekening/get-kelasbyproduk?objectprodukfk="+current.prid).then(function(data){
	    //                 $scope.listKelas = data;
	    //                 $scope.item.kelas={id:current.klid,kelasTindakan:current.kelasTindakan};
	    //             });
     //            });
				
				// $scope.item.qty=current.jumlah;
				// $scope.item.harga=current.harga;
				// $scope.item.diskon=current.diskon;
				// $scope.item.subTotal=current.total;
			}

			$scope.batal = function(){
				$scope.item.tanggalPelayanan=  $scope.now;
				$scope.item.jenisPetugas='';
				$scope.item.petugas='';
				$scope.item.ruangan='';
				$scope.item.pelayanan='';
                $scope.item.kelas='';
				
				$scope.item.qty=0;
				$scope.item.harga=0;
				$scope.item.subTotal=0;
			}

			$scope.UpdateHarga = function(){
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
                    return;
				}
				if ($scope.dataSelected.strukfk != null) {
					alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                    return;
				}
				if($scope.item.qty == undefined){
                    alert("Jumlah belum di isi!");
                    return;
                }
				if($scope.item.harga == undefined){
                    alert("Harga belum di isi!");
                    return;
                }
				if($scope.item.subTotal == undefined){
                    alert("SubTotal belum di isi!");
                    return;
                }
            	var objSave = {
					"norec": $scope.dataSelected.norec,
					"jumlah": $scope.item.qty,
					"harga": $scope.item.harga,
					"total": $scope.item.subTotal
				};
            	medifirstService.UpdateHargaPelayananPasien(objSave).then(function (e) {
                	//initModulAplikasi(); 
                	LoadData();
             	})

			}
			$scope.diskon = function(){
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
				}else{
					var confirm = $mdDialog.confirm()
			          .title('Informasi')
			          .textContent('Apakah anda yakin memberikan diskon semua jasa kecuali jasa sarana ?')
				      .ok('Ya')
				      .cancel('Tidak')
				    $mdDialog.show(confirm).then(function() {
					    var dat = $scope.dataSelected.komponen;
						var i=0;
						var objSave = [];
						dat.forEach(function(value){
							var data ={
								norec_ppd:value.norec,
								norec_pp:value.norec_pp,
								hargadiskon:value.hargasatuan
								}
							objSave[i] =data;
							i++;
						})
		            	manageTataRekening.postUpdateHargaDiskon(objSave).then(function(data){
							LoadData()
		                })
				    });
				}

			}
			$scope.verif_tarek = function(){
				if (KelompokUser[0].id != 52) {
					alert('Menu ini khusus untuk akses user TataRekening/Admin!')
					return
				}
				var obj = {
				    noRegistrasi : $scope.item.noRegistrasi
				  }
				  $state.go("VerifikasiTagihan", {
				    dataPasien: JSON.stringify(obj)
				  });
			}
			$scope.kwitansiTotal = function(){
					
		    	var stt = 'false'
	            if (confirm('View Kwitansi? ')){
	                // Save it!
	                stt='true';
	            }else {
	                // Do nothing!
	                stt='false'
	            }
	            var sudahTerimaDari = ''
		    	if($scope.item.STD != undefined){
		    		sudahTerimaDari=$scope.item.STD
		    	}
		    	var client = new HttpClient();
		    	client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=KWITANSITOTAL'+$scope.item.noRegistrasi+'&idPegawai='+dataLogin.userData.namauser+'&STD='+$scope.item.billing+'&view='+ stt, function(response) {
				    // do something with response
				});
				
			}

			$scope.verifikasijasa = function(){
				if ($scope.IsDataResep == true) {
					window.messageContainer.error("Data Resep Tidak Bisa Dihapus, Harap Hubungi Farmasi!");
                    return;
				}
				var tglajah = ''

				if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
	            	toastr.warning('Checklist Data Yang Akan Dihapus, Peringatan!');
				    return; 
	            }
    			if($scope.selectedData.length > 0){
    			
	                // $scope.selectedData.forEach(function(items){
	                	// if (items.strukfk != " / ") {
						// 	alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
		    //                 return;
						// }
					// }

    						                
				}
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));	
							debugger;
				var objverif = {
	                    "data": $scope.selectedData,
	                    "pegawaiverif": $scope.dataLogin.id,
	                    "penjamin" : $scope.item.namaPenjamin,
	                    "noregistrasi": $scope.item.noRegistrasi
	            };
				medifirstService.post('remunerasi/save-jasapelayanandokter',objverif).then(function(e){
					       LoadData();          
					 })		
			}

			function HapuskanTindkan(){
				// 
				var objLog={ 
                    pelayananpasiendelete:logData

				} 
				var objDelete = {
					"dataDel": dataDel,
					"noregistrasi": $scope.item.noRegistrasi,
                };
                if (dataDel.length != 0) {
                	manageTataRekening.post('lab-radiologi/delete-pelayanan-pasien',objDelete).then(function(e){
		            //  managePasien.hapusTindakan(tempData).then(function(e){
					    //   if(e.status === 201){
					    //       manageTataRekening.saveLogHapusTindakan(objLog).then(function(e){
		            
		        		// 	})
					    //    }
					       LoadData();          
					 })
					 console.log(JSON.stringify(tempData)); 
                }	               
			}

			
			$scope.inputTindakan = function(){
				if ($scope.item.statusVerif == true) {
					window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                    return;
				}
				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
				}
				// if ($scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
    //                 return;
				// }
                if ($scope.item){
                    $state.go('dashboardpasien.InputBilling',{
                    	noRec:$scope.dataSelected.norec_apd,
                        noAntrianPasien: $scope.dataSelected.norec_apd,
                        noRegister: $scope.item.norec_pd   
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

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
			$scope.TESTCETAK = function(){

             	var client = new HttpClient();
				client.get('http://localhost:8080/cetak-antrian?cetak=1&norec=ff8081815d9810c2015d984db6790010', function(response) {
				    // do something with response
				});
			}

			$scope.inputTindakanBeta = function(){

				// * Validasi Untuk Sekali Bayar
					// if ($scope.item.statusVerif == true) {
					// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
	    			//return;
					// }
				// * Validasi Untuk Sekali Bayar


				// if ($scope.item.strukfk != undefined || $scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
    			//return;
				// }

				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
				}

				// if ($scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
    			//return;
				// }
                
                if ($scope.item){
                    $state.go('InputTindakanPelayananRev',{
                    	norecPD:$scope.item.norec_pd,
                        norecAPD: $scope.dataSelected.norec_apd,
                      
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            // **Show Komponen **//
            	
           $scope.showKomponenHarga = function(){
               if ($scope.dataSelected == undefined) {
					messageContainer.error("Pilih pelayanan dahulu!");
                    return;
				}	   
				// 
				loadKomponen();
			   $scope.item.tglPelayanans= moment(new Date($scope.dataSelected.tglPelayanan)).format('DD-MM-YYYY HH:mm')
			   $scope.item.namaPelayanans=$scope.dataSelected.namaPelayanan;
			   $scope.popupKomponen.center().open();
			    // Get current actions
				var actions = $scope.popupKomponen.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popupKomponen.setOptions({ actions : actions });
            
            }

            function loadKomponen(){
            	manageTataRekening.get("tatarekening/get-komponenharga-pelayanan?norec_pp="+$scope.dataSelected.norec).
					  then(function(data){
		                    $scope.sourceKomponens = data.data;
		                 
		        });
            }
            $scope.klikKomponen=function(dataSelectedKomponen){	          
				if (dataSelectedKomponen.komponenharga != "Jasa Sarana"){
					// $scope.button = false;
					// $scope.billing = false;
					// $scope.cetak = false;
					// $scope.dtTanggal = false;
					// $scope.FilterData = false;
					$scope.DiskonKM = true;
					$scope.label=dataSelectedKomponen.komponenharga;
					$scope.item.komponen.idDis=dataSelectedKomponen.hargasatuan;
					$scope.item.persenDiscount="";
					$scope.item.diskonKomponen="";
					$scope.item.JasaKomponen=dataSelectedKomponen.jasa;
					norec_ppd=dataSelectedKomponen.norec
					norec_pp=dataSelectedKomponen.norec_pp
					strukfk=$scope.dataSelected.strukfk
					hargasatuan=dataSelectedKomponen.hargasatuan
				}else{
					$scope.DiskonKM = false;
				}
            }
			
           
			$scope.columnKomponens = [
             		    {
							"field": "komponenharga",
							"title": "Komponen",
							"width" : "100px",
						},
						{
							"field": "jumlah",
							"title": "Jumlah",
							"width" : "50px"
						},
						{
							"field": "hargasatuan",
							"title": "Harga Satuan",
							"width" : "80px",
							"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
						},
						{
							"field": "hargadiscount",
							"title": "Diskon",
							"width" : "80px",
							"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
						},
						{
							"field": "jasa",
							"title": "Jasa Cito",
							"width" : "80px",
							"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
						}
						
             ];	
            // **end ShowKomponen
	        $scope.cetakSurat = function(){
				// $mdDialog.show(confirm).then(function() {
				debugger
				var stt = 'false'
				if (confirm('View Surat Tagihan? ')) {
				    // Save it!
				    stt='true';
				} else {
				    // Do nothing!
				    stt='false'
				}
				var total = $scope.item.billing
				var deposit = $scope.item.deposit
	        	var client = new HttpClient(); 
	            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-suratTagihanDeposit=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&total=' + total + '&deposit=' + deposit + '&view=' + stt, function(response) {
	                // do something with response
	            });
			}

			$scope.TambahTindakanTerKlaim = function(){


				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
    //                 return;
				// }
                
				// if (KelompokUser[0].id != 52) {
				// 	alert('Hanya TataRekening/Admin yg boleh mengklaim!')
				// 	return
				// }
			
    // 			var tempData = [];
				// var logData=[];
				// var dataDel = [];
				// var tglajah = '';
				// var dataKlaim=[];
    // 			if($scope.selectedData.length > 0){ 

	   //              $scope.selectedData.forEach(function(items){
	   //              	if (items.strukfk != " / ") {
				// 			alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
		  //                   return;
				// 		}

    //             		if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
    //             			for (var i = tglkpnaja.length - 1; i >= 0; i--) {
    //             				if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D')) ) {
		  //               			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				//                     return;
    //             				}
                				
    //             			}
    //             		}else{
				//             tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
				//             medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function(dat){
			 //                    if (dat.data.sudahblm == true) {
			 //                    	alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				//                     return;
			 //                    }
			 //                })
    //             		} 
    //             		dataKlaim.push(items); 
    //             		data2.push(items);              		
	   //                  var item = {
	   //                      "noRec": items.norec,
	   //                      "noRecStruk": null
	   //                  }
	   //                  logData.push(items);
				// 		tempData.push(item);
						
				// 		// del pel pasien 
				// 		var objDel = {
    //                         "norec_pp": items.norec,
				// 		}
				// 		dataDel.push(objDel)
				// 		// end
	   //              })
				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
                //     return;
				// }
                
				if (KelompokUser[0].id != 52) {
					alert('Hanya TataRekening/Admin yg boleh mengklaim!')
					return
				}
			
    			var tempData = [];
				var logData=[];
				var dataDel = [];
				var tglajah = '';
				var dataKlaim=[];
    			if($scope.selectedData.length > 0){ 

	                $scope.selectedData.forEach(function(items){
	                	dataKlaim.push(items);
	                	if (items.strukfk != " / ") {
							alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
		                    return;
						}

                		if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
                			for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                				if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D')) ) {
		                			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				                    return;
                				}
                				
                			}
                		}else{
				            tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
				            medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function(dat){
			                    if (dat.data.sudahblm == true) {
			                    	alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				                    return;
			                    }
			                })
                		}                		                		
	                })
	               
				}					
	            if (dataKlaim.length == 0) {
	            	alert('Checklist yang akan di hapus!')
	            	return;
	            }

				var objKlaim = {
                    "pelayananpasien": dataKlaim,
                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
                };

	            manageTataRekening.post('inputtindakan/save-tindakan-tidak-terklaim',objKlaim).then(function(e){
				    // LoadData(); 
				    loadListTindakanTakTerklaim();
					$scope.popupList.center().open();         
				});
				console.log(JSON.stringify(tempData));
			}

			function loadListTindakanTakTerklaim(){
				manageTataRekening.get("tatarekening/detail-tindakan-takterklaim?noregistrasi=" 
					+ $scope.dataParams.noRegistrasi).then(function(data) {
						data2= data.data
						var total = 0;
						for (var i = 0; i < data2.length; i++) {
							total = parseFloat(total) + parseFloat(data2[i].total);
						}
						$scope.item.TotalTakterklaim = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
						$scope.sourceTindakan = new kendo.data.DataSource({
		                    data: data2
		                });		
			    });            	
            }

			$scope.ListTindakanTakTerklaim = function(){
				loadListTindakanTakTerklaim();
				$scope.popupList.center().open();
			}

			$scope.selectedData2 =[];
			$scope.onClickSatu = function(e){
                var element =$(e.currentTarget);                
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#Kgrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function(e) { 
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec === dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            $scope.HapusTindakanTakTerklaim= function(){
            		var dataHapus=[];
            		var tempData = [];
            	 // if ($scope.selectedData2 != undefined){            	 	
              //       for (var i = data2.length - 1; i >= 0; i--) {
              //       	for (var j = $scope.selectedData2.length - 1; j >=0; j--) {
              //       		if ($scope.selectedData2[j].norec === data2[i].norec){                            
	             //               dataHapus.push[$scope.selectedData2[j]]                           	                                
	             //        	}
              //           }
              //       }
              //       $scope.sourceTindakan = new kendo.data.DataSource({
              //           data: data2
              //       }); 
              //   }
	              	if($scope.selectedData2.length > 0){ 
		          		 $scope.selectedData2.forEach(function(items){
		          		 	dataHapus.push(items);
		          		 	tempData.push(items);
		          		 });
		            }
		            var objKlaim = {
	                    "pelayananpasiendelete": dataHapus,
	                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
	                };

	            manageTataRekening.post('inputtindakan/hapus-tindakan-tidak-terklaim',objKlaim).then(function(e){
				    // LoadData(); 
				    loadListTindakanTakTerklaim();
					$scope.popupList.center().open();         
				});
				console.log(JSON.stringify(tempData));
            }

            $scope.SimpanTindakanTakTerklaim = function(){
				// if ($scope.item.statusVerif == true) {
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
                //     return;
				// }
                
				if (KelompokUser[0].id != 52) {
					alert('Hanya TataRekening/Admin yg boleh mengklaim!')
					return
				}
			
    			var tempData = [];
				var logData=[];
				var dataDel = [];
				var tglajah = '';
				var dataKlaim=[];
    			if($scope.selectedData2.length > 0){ 

	                $scope.selectedData2.forEach(function(items){
	                	if (items.strukfk != " / ") {
							alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
		                    return;
						}

                		if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
                			for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                				if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D')) ) {
		                			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				                    return;
                				}
                				
                			}
                		}else{
				            tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
				            medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function(dat){
			                    if (dat.data.sudahblm == true) {
			                    	alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
				                    return;
			                    }
			                })
                		}                 		
	                })
				}
								
	            if (data2.length == 0) {
	            	alert('Checklist yang akan di hapus!')
	            	return;
	            }

				var objKlaim = {
                    "pelayananpasien": data2,
                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
                };

	            manageTataRekening.post('inputtindakan/save-tindakan-tidak-terklaim',objKlaim).then(function(e){
				//    if(e.status === 201){
				//         manageTataRekening.saveLogHapusTindakan(objLog).then(function(e){
	   			//	  })
				//        }
				       LoadData();          
				});
				console.log(JSON.stringify(tempData));           
			}

			$scope.columnTindakan = [	
				{
					"template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
	                "width": 40
				},
				{
					"field": "tglPelayanan",
					"title": "Tanggal",
					"width":"100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
					 // "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
				},
				{
					"field": "namaPelayanan",
					"title": "Nama Pelayanan",
					"width":"200px",
				},
				{
					"field": "kelasTindakan",
					"title": "Kelas",
					"width":"100px",
				},
				{
					"field": "dokter",
					"title": "Dokter",
					"width":"170px",
				},
				{
					"field": "ruanganTindakan",
					"title": "Ruangan",
					"width":"200px",
				},
				{
					"field": "jumlah",
					"title": "Qty",
					"width":"50px",
					"template": "<span class='style-right'>#: jumlah #</span>"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width":"120px",
					"template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
				},
				{
					"field": "diskon",
					"title": "Harga Diskon",
					"width":"120px",
					"template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
				},
				{
					"field": "jasa",
					"title": "Jasa",
					"width":"100px",
					"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
				},
				{
					"field": "total",
					"title": "Total",
					"width":"120px",
					"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
				}
			];

			$scope.selesaiPeriksa = function(){
				var confirm = $mdDialog.confirm()
			          .title('Informasi')
			          .textContent('Selesai Periksa akan menutup tagihan pasien, Lanjut simpan ?')
				      .ok('Ya')
				      .cancel('Tidak')
				    $mdDialog.show(confirm).then(function() {
					var json = {
						'norec_pd':norec_pd
					}
					manageTataRekening.post('tatarekening/close-pemeriksaan',json).then(function(e){
								
					});
				})
			}

		}
	]);
});