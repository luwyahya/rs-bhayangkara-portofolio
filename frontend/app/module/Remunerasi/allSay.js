define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('allSay', ['$mdDialog', '$timeout','$parse',  '$state', '$q', '$rootScope', '$scope', 'CacheHelper','DateHelper','MedifirstService',
		function($mdDialog, $timeout,$parse, $state, $q, $rootScope, $scope, cacheHelper,dateHelper,medifirstService) {
// define(['initialize'], function (initialize) {
//     'use strict';
//     initialize.controller('allSay', ['DateHelper', '$q','$rootScope', '$scope', 'ModelItem', 'MedifirstService', '$state', '$window', 'CetakHelper', 'CacheHelper',
//         function (dateHelper,$q, $rootScope, $scope, ModelItem, medifirstService, $state, $window, cetakHelper, cacheHelper) {
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.getRajal=false;
     		 $scope.model = {};

      var norec_ppd = '';
      var norec_pp ='';
      var strukfk = '';
	  var tarif = '';
	  var isRajal ='';
	  $scope.simpaninacbg = true;
      $scope.tampil = true;
      var dataMasuk = [];
			$scope.item.periodeAwal =  new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang= new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter =false;	
			$scope.pasienPulang =false;		
			$scope.cboUbahDokter =true;
			$scope.isRouteLoading=false;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk  = 0
			$scope.jmlRujukanKeluar  = 0      
      var dataDel = [];
			loadCombo();
			var data2 = [];
      $scope.selectedData2 = [];
			$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
			// getSisrute()
			// postKunjunganYankes()
			// postRujukanYankes()

			function loadCombo(){
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienCtrl');
				var tgltgltgltgl = new Date();
	          var tglmax = new Date();
	          var tglkpnaja = new Date();
	          $scope.minDate = new Date();
	          $scope.maxDate = new Date();//new Date($scope.now);
	          $scope.startDateOptions = {
	            disableDates: function (date) {
	              var disabled = tglkpnaja;
	              if (date && disabled.indexOf(date.getDate()) > -1) {
	                return true;
	              } else {
	                return false;
	              }
	            }
	          };
				if(chacePeriode != undefined){
					$scope.item.periodeAwal = new Date(chacePeriode[0]);;
		            $scope.item.periodeAkhir = new Date(chacePeriode[1]);

		            if (chacePeriode[2] != undefined) {
		            	$scope.item.noReg = chacePeriode[2]	
		            }
		           	
		           	if (chacePeriode[3] != undefined) {
		           		$scope.item.noRm =  chacePeriode[3]
		           	}          
		            
		            if (chacePeriode[4] != undefined) {
		            	$scope.item.nama =  chacePeriode[4]
		            }		            
		            
		            if (chacePeriode[5] != undefined) {
		                $scope.listDepartemen = [chacePeriode[5]]
		                $scope.item.instalasi = chacePeriode[5]
		            }

		            if (chacePeriode[6] != undefined){
		              	$scope.listRuangan = [chacePeriode[6]]
		              	$scope.item.ruangan = chacePeriode[6]
		            }		

		            if (chacePeriode[7] != undefined) {		                
		                $scope.item.listKelompokPasien = [chacePeriode[7]]
		                $scope.item.kelompokpasien = chacePeriode[7]
		            }

		            if (chacePeriode[8] != undefined) {
		                $scope.item.dokter = chacePeriode[8]
		                $scope.item.listDokter2 = chacePeriode[8]
		            }

		            if (chacePeriode[9] != undefined) {
		                $scope.item.jmlRows = chacePeriode[9]
		            }

					// var arrPeriode = chacePeriode.split('~');
					// $scope.item.periodeAwal = new Date(arrPeriode[0]);
					// $scope.item.periodeAkhir = new Date(arrPeriode[1]);	
					// $scope.item.instalasi = {id:arrPeriode[2],departemen:arrPeriode[3]}
					// $scope.item.ruangan = {id:arrPeriode[4],ruangan:arrPeriode[5]}
					// $scope.item.tglpulang = new Date(arrPeriode[2]);				
				}else{
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
					$scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
				    $scope.listDepartemen = data.data.departemen;
				    $scope.listKelompokPasien = data.data.kelompokpasien;
				    $scope.listDokter = data.data.dokter;
				    $scope.listDokter2 = data.data.dokter;
				})
				// $scope.listStatus = manageKasir.getStatus();
			}
			$scope.getIsiComboRuangan = function(){
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function(tanggal){
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function(value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			var onDataBound = function () 
			{
	            $('td').each(function () {
	              if ($(this).text() == 'belum') {$(this).addClass('red')}
	              if ($(this).text() == 'verif') {$(this).addClass('green')}
	              // if ($(this).text() == 'Online') {$(this).addClass('koneng')}
	            
	            })
	          }
	       $scope.getHargaTindakan = function () {
	        getKomponenHarga()
	      }
	      $scope.isInArray = function (value, array) {
	        return array.indexOf(value) > -1;
	      }
	  $scope.selectedPegawai10 = [];
      $scope.showTambah1 = true;
      $scope.show = true;
      $scope.tambah = function () {
        $scope.showJenisPelaksana2 = true;
        $scope.show = false;
        $scope.show2 = true;
      };
      $scope.hapus = function () {
        $scope.show = true;
        $scope.show2 = false;
        $scope.showJenisPelaksana2 = false;
        $scope.item.jenisPelaksana2 = "";
        $scope.selectedPegawai2 = [];
      };

      $scope.tambah2 = function () {
        $scope.showJenisPelaksana3 = true;
        $scope.show3 = true;
        $scope.show2 = false;
      }
      $scope.hapus2 = function () {
        $scope.showJenisPelaksana3 = false;
        $scope.show2 = true;
        $scope.show3 = false;
        $scope.item.jenisPelaksana3 = "";
        $scope.selectedPegawai3 = [];
      };

      $scope.tambah3 = function () {
        $scope.showJenisPelaksana4 = true;
        $scope.show3 = false;
        $scope.show4 = true;
      }
      $scope.hapus3 = function () {
        $scope.showJenisPelaksana4 = false;
        $scope.show3 = true;
        $scope.show4 = false;
        $scope.item.jenisPelaksana4 = "";
        $scope.selectedPegawai4 = [];
      };

      $scope.tambah4 = function () {
        $scope.showJenisPelaksana5 = true;
        $scope.show4 = false;
        $scope.show5 = true;
      }
      $scope.hapus4 = function () {
        $scope.showJenisPelaksana5 = false;
        $scope.show4 = true;
        $scope.show5 = false;
        $scope.item.jenisPelaksana5 = "";
        $scope.selectedPegawai5 = [];
      };

      $scope.tambah5 = function () {
        $scope.showJenisPelaksana6 = true;
        $scope.show5 = false;
        $scope.show6 = true;
      }
      $scope.hapus5 = function () {
        $scope.showJenisPelaksana6 = false;
        $scope.show5 = true;
        $scope.show6 = false;
        $scope.item.jenisPelaksana5 = "";
        $scope.selectedPegawai5 = [];
      };

      $scope.tambah6 = function () {
        $scope.showJenisPelaksana7 = true;
        $scope.show6 = false;
        $scope.show7 = true;
      }
      $scope.hapus6 = function () {
        $scope.showJenisPelaksana7 = false;
        $scope.show6 = true;
        $scope.show7 = false;
        $scope.item.jenisPelaksana6 = "";
        $scope.selectedPegawai6 = [];
      };

      $scope.tambah7 = function () {
        $scope.showJenisPelaksana8 = true;
        $scope.show7 = false;
        $scope.show8 = true;
      }
      $scope.hapus7 = function () {
        $scope.showJenisPelaksana8 = false;
        $scope.show7 = true;
        $scope.show8 = false;
        $scope.item.jenisPelaksana7 = "";
        $scope.selectedPegawai7 = [];
      };

      $scope.tambah8 = function () {
        $scope.showJenisPelaksana9 = true;
        $scope.show8 = false;
        $scope.show9 = true;
      }
      $scope.hapus8 = function () {
        $scope.showJenisPelaksana9 = false;
        $scope.show8 = true;
        $scope.item.jenisPelaksana8 = "";
        $scope.selectedPegawai8 = [];
      };

      $scope.tambah9 = function () {
        $scope.showJenisPelaksana10 = true;
        $scope.show9 = false;
        $scope.show10 = true;
      }
      $scope.hapus9 = function () {
        $scope.showJenisPelaksana10 = false;
        $scope.show9 = true;
        $scope.show10 = false;
        $scope.item.jenisPelaksana9 = "";
        $scope.selectedPegawai9 = [];
      };

	  $scope.listIdPetugas = [13827, 176873]
      $scope.init = function () {
        var id = $scope.item.jenisPelaksana.id;
        var model = 'dataSource';
        var listArray = 'selectedPegawai';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai = [];
      $scope.init2 = function () {
        var id = $scope.item.jenisPelaksana2.id;
        var model = 'dataSource2';
        var listArray = 'selectedPegawai2';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai2 = [];
      $scope.init3 = function () {
        var id = $scope.item.jenisPelaksana3.id;
        var model = 'dataSource3';
        var listArray = 'selectedPegawai3';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai3 = [];
      $scope.init4 = function () {
        var id = $scope.item.jenisPelaksana4.id;
        var model = 'dataSource4';
        var listArray = 'selectedPegawai4';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai4 = [];
      $scope.init5 = function () {
        var id = $scope.item.jenisPelaksana5.id;
        var model = 'dataSource5';
        var listArray = 'selectedPegawai5';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai5 = [];
      $scope.init6 = function () {
        var id = $scope.item.jenisPelaksana6.id;
        var model = 'dataSource6';
        var listArray = 'selectedPegawai6';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai6 = [];
      $scope.init7 = function () {
        var id = $scope.item.jenisPelaksana7.id;
        var model = 'dataSource7';
        var listArray = 'selectedPegawai7';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai7 = [];
      $scope.init8 = function () {
        var id = $scope.item.jenisPelaksana8.id;
        var model = 'dataSource8';
        var listArray = 'selectedPegawai8';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai8 = [];
      $scope.init9 = function () {
        var id = $scope.item.jenisPelaksana9.id;
        var model = 'dataSource9';
        var listArray = 'selectedPegawai9';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
      $scope.selectedPegawai9 = [];
      $scope.init10 = function () {
        var id = $scope.item.jenisPelaksana10.id;
        var model = 'dataSource10';
        var listArray = 'selectedPegawai10';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };
	      function getPegawaiById(id, input, output) {
	        var selectedData = $parse(output);
	        selectedData.assign($scope, []);
	        var model = $parse(input);
	        medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function (dat) {
	          if($scope.dataPelayananSelected.ruanganfk == 575){
	            $scope.listPegawai = new kendo.data.DataSource({
	              data: [{id: "25009",
	                    jenispegawai: "DOKTER",
	                    jenispetugaspe: "Dokter Pemeriksa",
	                    namalengkap: "dr. EDY PURNOMO, M.K.K.K",
	                    objectjenispegawaifk: "1",
	                    objectjenispetugaspefk: "4"},
	                    {id: "25720",
	                    jenispegawai: "DOKTER",
	                    jenispetugaspe: "Dokter Pemeriksa",
	                    namalengkap: "dr. UFI DEWINTERA, Sp. M.K.",
	                    objectjenispegawaifk: "1",
	                    objectjenispetugaspefk: "4"},
	                    {id: "25179",
	                    jenispegawai: "DOKTER",
	                    jenispetugaspe: "Dokter Pemeriksa",
	                    namalengkap: "dr. EIRENE JAQUELENE K. TOMATALA, SpPK",
	                    objectjenispegawaifk: "1",
	                    objectjenispetugaspefk: "4"}]
	            });
	          }else{
	            $scope.listPegawai = new kendo.data.DataSource({
	              data: dat.data.jenispelaksana
	            });
	          }
	          $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
	          model.assign($scope, $scope.listPegawai);

	          var cookie = document.cookie.split(';');
	          cookie = cookie[0].split('=');
	          if (cookie[1] == 'dokter')
	            $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]

	        });
	      }
        $scope.onClickSatu = function (e) {
          var element = $(e.currentTarget);
          var checked = element.is(':checked'),
            row = element.closest('tr'),
            grid = $("#kGrid2").data("kendoGrid"),
            // grid = $("#grid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
            debugger
          // $scope.selectedData[dataItem.noRec] = checked;
          if (checked) {
            var result = $.grep($scope.selectedData2, function (e) {
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
	      function getKomponenHarga() {
	        ;
	        $scope.item.hargaTindakan = 0
	        $scope.item.jumlah = 0
	        var kelastindakan = ""
	        kelastindakan = $scope.dataPelayananSelected.kelasfk; 
	        // if ($scope.dataPelayananSelected.kelasfk == "9") {
	        //   kelastindakan = $scope.dataPelayananSelected.kelasfk
	        // } else if ($scope.item.pasien.objectkelompokpasienlastfk == "2" && $scope.item.pasien.israwatinap=="true") {
	        //   kelastindakan = $scope.item.pasien.kelastanggunganfk
	        // } else {
	        //   kelastindakan = $scope.dataPelayananSelected.kelasfk
	        // }
	        // $scope.item.Kelas = $scope.dataPelayananSelected.kelasfk
	        $scope.listKomponen = []
          debugger;
	        if ($scope.item.namaProduk != undefined) {
	           medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan="
            + $scope.dataPelayananSelected.ruanganfk
            + "&idKelas=" + kelastindakan
            + "&idProduk=" + $scope.item.namaProduk.id
            + "&idJenisPelayanan=" + 1

            // medifirstService.get("tatarekening/tindakan/get-komponenharga-pelayanan?norec_pp="
	           //  + $scope.dataPelayananSelected.norec
	           //  + "&idKelas=" + kelastindakan
	           //  + "&idProduk=" + $scope.item.namaProduk.id
	           //  + "&idJenisPelayanan=" + 1	            // +"&idKelas="
	            // +$scope.dataPelayananSelected.kelasfk
	            // +"&idJenisPelayanan="
	            // + $scope.item.pasien.objectjenispelayananfk
	          ).then(function (dat) {
	            $scope.listKomponen = dat.data.data;
	            $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
	            $scope.item.jumlah = 0;
	          })
	        }
	      }

	      $scope.selectOptions = {
	        placeholder: "Pilih Pegawai...",
	        dataTextField: "namaLengkap",
	        dataValueField: "id",
	        filter: "contains"
	      };

	      medifirstService.get("tatarekening/tindakan/get-combo")
	        .then(function (da) {
	          $scope.listJenisPelaksana = da.data.jenispelaksana;
	          $scope.listDokter = da.data.pegawai;
	          // for (var i = da.data.jenispelaksana.length - 1; i >= 0; i--) {
	          //  var elem= da.data.jenispelaksana[i]
	          //  if(elem.jenispetugaspe.indexOf('Dokter Pemeriksa') > -1){
	          //    $scope.item.jenisPelaksana= elem
	          //    $scope.init()
	          //    break
	          //  }
	          // }

	          $scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
	        })

			$scope.columnDaftarPasienPulang = {

				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "DaftarRegistrasiPasien.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:M1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Daftar Registrasi Pasien",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
				dataBound: onDataBound,
	            columns:
	            [{
					"field": "status",
					"title": "status",
					"width":"80px"
				},
				 {
                        "field": "status",
                        "title": "Verifikasi",
                        "width": "90px",

                        "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\">#:  status #</button> ",
                    },
					{
						   "field": "statusBpjs",
						   "title": "Verifikasi Keuangan",
						   "width": "90px",
   
						   "template": "<button class=\"k-button custom-button\" ng-click=\"statusBpjs(dataItem)\"  style=\"margin:0 0 5px\">#:  statusBpjs #</button> ",
					   },
				{
					"field": "tglpulang",
					"title": "Tgl Pulang",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
				},
				{
					"field": "noregistrasi",
					"title": "NoReg",
					"width":"80px"
				},
				{
					"field": "nocm",
					"title": "NoRM",
					"width":"80px",
					"template": "<span class='style-center'>#: nocm #</span>"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien",
					"width":"150px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width":"150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
				{
					"field": "namadokter",
					"title": "Nama Dokter",
					"width":"150px",
					"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien",
					"width":"100px",
					"template": "<span class='style-left'>#: kelompokpasien #</span>"
				},
				{
					"field": "tglpulang",
					"title": "Tgl Pulang",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
				},
				{
					"field": "rekanan",
					"title": "Rekanan",
					"width":"80px",
					"template": "<span class='style-center'>#: rekanan #</span>"
				},
				// {
				// 	"field": "nostruk",
				// 	"title": "NoStrukVerif",
				// 	"width":"100px",
				// 	"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
				// },
				// {
				// 	"field": "nosbm",
				// 	"title": "NoSBM",
				// 	"width":"100px",
				// 	"template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
				// },
				// {
				// 	"field": "kasir",
				// 	"title": "Kasir",
				// 	"width":"100px",
				// 	"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
				// },
				{
					"field": "totalharusdibayar",
					"title": "Total",
					"width":"150px",
					// "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
					//"template": "<span class='style-center'>#: totalharusdibayar #</span>"
					"template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",

				},
				{
					hidden: true,
					"field": "tarifINACBLast",
					"title": "tarifINACBLast",
					"width":"150px",
				

				},
				{
					hidden: true,
					"field": "persenJasaLast",
					"title": "persenJasaLast",
					"width":"150px",
				

				}
				,
				{
					// hidden: true,
					"field": "tglclosing",
					"title": "Tgl. Closing",
					"width":"150px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglclosing #')}}</span>"
				

				}
			]
		};
		$scope.columnDaftarPelayanan = {

				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "DaftarRegistrasiPasien.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:M1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Daftar Registrasi Pasien",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
				dataBound: onDataBound,
	            columns:
	            [
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width":"80px"
				},
				{
					"field": "tglpelayanan",
					"title": "Tanggal Pelayanan",
					"width":"80px",
					// "template": "<span class='style-center'>#: nocm #</span>"
				},
				{
					"field": "namaproduk",
					"title": "namaproduk",
					"width":"150px",
					"template": "<span class='style-left'>#: namaproduk #</span>"
				},
				{
					"field": "namalengkap",
					"title": "Penindak",
					"width":"150px",
					"template": "<span class='style-left'>#: namalengkap  #</span>"
				},
				
				{
					"field": "hargajual",
					"title": "Harga",
					"width":"150px",
					// "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
					//"template": "<span class='style-center'>#: totalharusdibayar #</span>"
					"template": "<span class='style-right'>{{formatRupiah('#: hargajual #', 'Rp.')}}</span>",

				},
				{
					"field": "hargadiscount",
					"title": "Harga Diskon",
					"width":"150px",
					// "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
					//"template": "<span class='style-center'>#: totalharusdibayar #</span>"
					"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', 'Rp.')}}</span>",

				},
				{
					"field": "jumlah",
					"title": "Jumlah",
					"width":"150px",					
				},
        {
          "template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
          "width": 40
        },
			]
		};
		      $scope.gridPetugasPelaksana = new kendo.data.DataSource({
		        data: []
		      })
		      function simpandata(){
		      	
		      	var dataTindakanFix = [];
		        $scope.dataTindakan.options.data.forEach(function (e) {
		          if (e.listKomponen.length <= 0) {
		            window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
		            return
		          }
		          else {
		            var petugasLayanan = [];
		             $scope.gridPetugasPelaksana._data.forEach(function (a) {
		              if (e.rowNumber === a.idParent) {
		                petugasLayanan.push({
		                  "objectjenispetugaspefk": a.jenisPetugas.id,
		                  // "objectpegawaifk": a.jenisPetugas.id
		                  "listpegawai": a.listPetugas
		                });
		              }
		            })
		            dataTindakanFix.push({
		              "noregistrasifk": $scope.currentNorecAPD,
		              "tglregistrasi": new moment ($scope.dataPasienSelected.tglpulang).format('YYYY-MM-DD HH:mm'),
		              "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
		              "ruangan": e.ruangan,
		              "produkfk": e.produk.id,
		              "hargasatuan": e.hargaSatuan,
		              "diskon": e.hargadiskon,
		              "hargajual": e.hargaSatuan,
		              "harganetto": e.hargaSatuan,
		              "jumlah": e.qty,
		              "kelasfk": $scope.dataPelayananSelected.kelasfk,
		              "pelayananpetugas": petugasLayanan,
		              "komponenharga": e.listKomponen,
		              "keterangan":  '-',
		              "iscito": 0,
		              "jasacito": 0,
		              "isparamedis": e.isparamedis,
		              "jenispelayananfk": e.jenispelayananfk,
		              "nilaicito": 0,
		              "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                  "noregistrasifk": $scope.dataPelayananSelected.norecapd,
		              "idpengirim":null
		            });
		             var objSave = {
			         pelayananpasien: dataTindakanFix

			        }
			        $scope.hideSimpan = true
			        ;
			        medifirstService.post('remunerasi/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDel = {
                  "norec_pp": $scope.dataPasienSelected.norec,
                }
                dataDel.push(objDel)
                var objDelete = {
                  "dataDel": dataDel,
                  "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                  "alasan": "Jasa Pelayanan",
                  "pegawai": nama
                };
                var objverif = {
                        "pegawaiverif":  $scope.dataLogin.id,
                        // "tglclosing" : tglclosing,
                        "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                        "produkfk": $scope.item.namaProduk.id,
                        "tglpelayanan": new moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm')
                };  
                medifirstService.post('remunerasi/save-jasapelayanandoktersatuan',objverif).then(function(e){
                  if (dataDel.length != 0) {
                    medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
                      var  objverif = {
                        "norec": $scope.dataPelayananSelected.norec        
                      }
                      medifirstService.post('remunerasi/delete-jasadokterpernorec',objverif).then(function(e){                      
                          $q.all([
                          medifirstService.get("remunerasi/detail-jasapelayanan?"+
                            "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                          ]).then(function(data) {
                            $scope.isRouteLoading=false;
                            $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                          data: data[0].data.data,
                                          // pageSize: 10,
                                          total:data[0].data,
                                          serverPaging: false,
                                          schema: {
                                              model: {
                                                  fields: {
                                                  }
                                              }
                                          }
                                      });
                          });                     
                      })         
                                
                    })

                  }       
                }) 
                
                dataTindakanFix=[];
                $scope.item.jenisPelaksana = "";
                $scope.selectedPegawai=""; 
                 $scope.dataTindakan="";
                 $scope.item.namaProduk="";
                 $scope.harga="";
                 $scope.jumlah="";
                 $scope.tampil = false;
                 data2=[];
                $scope.winDialogssx.center().close();
			          $scope.hideSimpan = true;
                $scope.dataTindakan = [];
			        }, function (error) {
                dataTindakanFix=[];
                $scope.item.jenisPelaksana = "";
                $scope.selectedPegawai=""; 
                 $scope.dataTindakan="";
                 $scope.item.namaProduk="";
                 $scope.harga="";
                 $scope.jumlah="";
                 $scope.tampil = false;
                
			          $scope.hideSimpan = false
			        })

		          }
		        })
		      }
      $scope.savex = function () {
        if ($scope.item.jumlah == 0) {
          messageContainer.error("Jumlah tidak boleh nol")
          return
        }
        data2=[];
        var nomor = 0;
        if ($scope.dataTindakan == undefined) {
          nomor = 1
        } else {
          nomor = data2.length + 1
        }
        debugger;
        var data = {};
        data = {
          rowNumber: nomor,
          tglPelayanan: $scope.item.tglPelayanan,
          produk: $scope.item.namaProduk,//$scope.item.noRegistrasi,
          qty: $scope.item.jumlah,
          hargaSatuan: $scope.item.hargaTindakan,
          hargadiskon: 0,
          subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
          listKomponen: $scope.listKomponen,
          jenispelayananfk: 1,

        }
        data2.push(data)
        $scope.dataTindakan = new kendo.data.DataSource({
          data: data2
        });
        $scope.gridPetugasPelaksana = new kendo.data.DataSource({
            data: []
          })
        if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
          var pushData = {
            "idParent": data.rowNumber,
            "jenisPetugas": {
              "id": $scope.item.jenisPelaksana[0].id,
              "jenisPelaksana": $scope.item.jenisPelaksana[0].jenispetugaspe
            },
            "listPetugas": $scope.selectedPegawai
          }
          $scope.gridPetugasPelaksana.add(pushData);
        }

        simpandata();

    }
    $scope.batalsave = function(){

                $scope.winDialogssx.center().close();
    }
			$scope.Back = function () {
          window.history.back();
       }
         $scope.click = function (dataDokterSelected) {
        if (dataDokterSelected != undefined) {
          // var id = $scope.dataDokterSelected.jpp_id;
          // medifirstService.get("pelayananpetugas/get-pegawaibyjenispetugaspe?objectjenispetugaspefk="+id).then(function(data){
          //         $scope.dataSource = data.data.pegawai;

          //     });
          medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
            .then(function (data) {

              $scope.listPegawaiPemeriksa.add(data.data[0])
              $scope.model.pegawais = data.data[0];

            })
          $scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }
          // $scope.model.pegawais={
          //  id:dataDokterSelected.pg_id,
          //  namalengkap:dataDokterSelected.namalengkap,


          // }
        }
      }
   			$scope.ubahtindakan = function(){
                $scope.tampil = true;
          debugger;
          $scope.item.tglPelayanan = $scope.dataPelayananSelected.tglpelayanan;
   				$scope.item.namapasienasal = $scope.dataPelayananSelected.namaruangan;
   				$scope.item.tindakanasal = $scope.dataPelayananSelected.namaproduk;
   				$scope.item.dokterasal = $scope.dataPelayananSelected.namalengkap;
   				$scope.item.ruanganasal = $scope.dataPelayananSelected.namaruangan;
          $scope.item.jenisPelaksana = [({ id: $scope.dataPelayananSelected.objectjenispetugaspefk, jenispetugaspe: $scope.dataPelayananSelected.jenispetugaspe })]
          $scope.selectedPegawai = [({ id: $scope.dataPelayananSelected.id, namalengkap: $scope.dataPelayananSelected.namalengkap })]

          $scope.winDialogssx.center().open();

          // $scope.item.jenisPelaksana = "Dokter Pemeriksa";
				medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan="
	              + $scope.dataPelayananSelected.ruanganfk
	              + "&idKelas="
	              // + $scope.dataPelayananSelected.kelasfk
	              + $scope.dataPelayananSelected.kelasfk
	              
	              , true, 10, 10)
	              .then(function (x) {
	                $scope.listProduk = x;
                  $scope.item.namaProduk = ({ id: $scope.dataPelayananSelected.produkfk, namaproduk: $scope.dataPelayananSelected.namaproduk });
                  getKomponenHarga();
	            });
			}
      // $scope.ubahtindakan = function(){

      //   var arrStr = {
      //       0: $scope.dataPelayananSelected.namaruangan,
      //       1: $scope.dataPelayananSelected.namaproduk,
      //       2: $scope.dataPelayananSelected.namalengkap,
      //       3: $scope.dataPelayananSelected.namaruangan
      //   }
      //   cacheHelper.set('x', arrStr);
      //   $state.go('InputTindakanJasa', {
      //       norecPD: $scope.dataPelayananSelected.norecpd,
      //       norecAPD: $scope.dataPelayananSelected.norecapd,

      //     });
      // }
	  $scope.klikGridambilRuangan = function(dataSelectedRuanganPilih){
	
	}
	  $scope.ambilRuangan = function(item, data){
		
		if ($scope.dataSelectedRuanganPilih.norecAPD != undefined) {
			$state.go('InputTindakanJasa', {
			  norecPD: $scope.dataSelectedRuanganPilih.norecPD,
			  norecAPD: $scope.dataSelectedRuanganPilih.norecAPD,
  
			});
		  } else {
			messageContainer.error('Ruangan belum di pilih')
		  }
	}
	$scope.batalAmbilRuangan = function(item, data){
		
		$scope.popuppilihuangan.close();
	}
	
	$scope.columnRuanganPilih = [
        {
			hidden:true,
          field: "norecAPD",
          title: "norecAPD",
          width: "100px",
          // template: "#= jenisPetugas.jenisPelaksana #"
        },
        {
		  hidden:true,
          field: "norecPD",
          title: "norecPD",
          width: "200px",
          // template: multiSelectArrayToString
		},
        {
          field: "tglmasuk",
          title: "Tgl. Masuk",
          width: "200px",
          "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
        },
        {
          field: "namaruangan",
          title: "Ruangan",
          width: "200px",
          // template: multiSelectArrayToString
        }
	  ];
	  
	  $scope.columnRuanganPilih1 = [
        {
			
          field: "namaproduk",
          title: "Pelayanan",
          width: "100px",
          // template: "#= jenisPetugas.jenisPelaksana #"
        },
        {
	
          field: "TotalBayar",
          title: "Tarif",
          width: "200px",
          // template: multiSelectArrayToString
		}
      ];
	 
      $scope.tambahtindakan = function(item, data){
        $scope.popuppilihuangan.center().open();
		
        // if ($scope.dataPelayananSelected == undefined) {
        //   window.messageContainer.error("Pilih pelayanan dahulu!");
        //   return;
        // }$scope.popuppilihuangan.center().open();
		
			medifirstService.get("remunerasi/detail-jasapelayanan-ruangan?"+
			"noregistrasi="+$scope.dataPasienSelected.noregistrasi).then(function(data) {
			$scope.isRouteLoading=false;
			$scope.dataGridPilihRuangan = new kendo.data.DataSource({
				data: data.data.data,
				// pageSize: 10,
				total:data.data.data.length,
				serverPaging: false,
				schema: {
					model: {
						fields: {
						}
					}
				}
			});
		
	});
}	
	  
	$scope.infoTarifYgdidapet = function(item, data){
		
		if($scope.item.getRajal != false)
		{
			isRajal ="Y";
		}else{
			isRajal ="T";
		}
		medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
				
		})
		$scope.popupinfotarif.center().open();
		medifirstService.get("remunerasi/detail-tarif-pelayan-all?"+
			"noregistrasi="+$scope.dataPasienSelected.noregistrasi + "&isRajal=" + isRajal).then(function(data) {
			$scope.isRouteLoading=false;
			$scope.dataGridPilihRuangan1 = new kendo.data.DataSource({
				data: data.data.data,
				// pageSize: 10,
				total:data.data.data.length,
				serverPaging: false,
				schema: {
					model: {
						fields: {
						}
					}
				}
			});
		
	}); }
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
      function SeeDokterPelaksana() {
        medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
          $scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
          // $scope.listPegawaiPemeriksa = data.data.pegawai;

        });
        medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
          $scope.listPegawaiPemeriksa = data;

        });
        // $scope.isRouteLoading=true;
        medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataPelayananSelected.norec).
          then(function (data) {
            $scope.sourceDokterPelaksana = data.data.data;
            // $scope.isRouteLoading=false;

          });
      }
      $scope.inputDokterPelaksana = function () {
        if ($scope.dataPelayananSelected == undefined) {
          messageContainer.error("Pilih pelayanan dahulu!");
          return;
        }

        SeeDokterPelaksana();
        $scope.item.tglPelayanans = $scope.dataPelayananSelected.tglPelayanan;
        $scope.item.namaPelayanans = $scope.dataPelayananSelected.namaproduk;
        // if ($scope.dataSelected.isparamedis == true)
        //   $scope.item.paramedis = true
        // else
          $scope.item.paramedis = false
        $scope.popup_editor.center().open();

      }
      $scope.saveLogging = function (jenis, referensi, noreff, ket) {
        medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
          + "&referensi=" + referensi
          + "&noreff=" + noreff
          + "&keterangan=" + ket
        ).then(function (data) {

        })
      }
      $scope.simpanDokterPelaksana = function () {
        if ($scope.model.jenisPelaksana == undefined && $scope.item.paramedis == undefined) {
          if ($scope.model.jenisPelaksana == undefined) {
            messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
            return
          }
          if ($scope.model.pegawais == undefined) {
            messageContainer.error("Pegawai Tidak Boleh Kosong")
            return
          }
        }


        var norec_ppp = "";
        if ($scope.dataDokterSelected != undefined) {
          norec_ppp = $scope.dataDokterSelected.norec_ppp
        }

        if (norec_ppp == "") {
          if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
            for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
              if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
                // && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
              ) {
                messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
                return
              }
            }
          }
        }


        var pelayananpasienpetugas = {
          norec_ppp: norec_ppp,
          norec_pp: $scope.dataPelayananSelected.norec,
          norec_apd: $scope.dataPelayananSelected.norecapd,
          objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
          objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
          isparamedis: $scope.item.paramedis,
        }

        var objSave = {
          pelayananpasienpetugas: pelayananpasienpetugas,
          noregistrasi : $scope.dataPasienSelected.noregistrasi

        }

        medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
          var jenis = 'Input/Ubah Petugas Layanan';
          var norec = e.data.data.norec
          $scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
          SeeDokterPelaksana();
          // LoadData();


          var data = {};
          if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
            if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
              data.dokter = $scope.model.pegawais.namalengkap
              $scope.dataSelected.dokter = data.dokter

            }
          }

          if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
            for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
              if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.item.paramedis != true && $scope.model.pegawais == undefined) {
                $scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
                break
              }

            }
          }
          // if ($scope.item.paramedis == true) {
          //   $scope.dataSelected.paramedis = "✔"

          // } else {
          //   $scope.dataSelected.paramedis = ""

          // }
          $scope.model.jenisPelaksana = undefined;
          $scope.model.pegawais = undefined;
          $scope.dataDokterSelected = undefined;
          ;

          medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {
             $scope.popup_editor.center().close();
              $q.all([
                medifirstService.get("remunerasi/detail-jasapelayanan?"+
                  "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                ]).then(function(data) {
                  $scope.isRouteLoading=false;
                  $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                data: data[0].data.data,
                                // pageSize: 10,
                                total:data[0].data,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                });
          })
        })

      }
      $scope.hapusDokterPelaksana = function () {
        if ($scope.dataDokterSelected == undefined) {
          messageContainer.error("Pilih data Pegawai dulu!!")
          return
        }

        var pelayananpasienpetugas = {
          norec_ppp: $scope.dataDokterSelected.norec_ppp,
          norec_pp: $scope.dataDokterSelected.norec_pp,

        }

        var objSave = {
          pelayananpasienpetugas: pelayananpasienpetugas,
          noregistrasi : $scope.dataPasienSelected.noregistrasi

        }
        medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
          SeeDokterPelaksana();
          // LoadData();
          $scope.model.jenisPelaksana = "";
          $scope.model.pegawais = "";
          $scope.dataDokterSelected = undefined;
          // medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {
          
          // })
        })
        var data = {};
        if ($scope.dataDokterSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
          if ($scope.dataDokterSelected.namaPelayanan == $scope.item.namaPelayanans) {
            $scope.dataDokterSelected.dokter = "-"

          }
        }
        medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {
             $scope.popup_editor.center().close();
              $q.all([
                medifirstService.get("remunerasi/detail-jasapelayanan?"+
                  "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                ]).then(function(data) {
                  $scope.isRouteLoading=false;
                  $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                data: data[0].data.data,
                                // pageSize: 10,
                                total:data[0].data,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                });
        })
        
      }
			$scope.SearchData = function(){
				loadData()
			}
			function loadData(){
				$scope.isRouteLoading=true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg =""				
				var tempNoReg = "";
				if ($scope.item.noReg != undefined){
					var reg ="&noreg=" +$scope.item.noReg
					tempNoReg = $scope.item.noReg
					
				}
				var rm =""
				var tempNoRm = "";
				if ($scope.item.noRm != undefined){
					var rm ="&norm=" +$scope.item.noRm
					tempNoRm = $scope.item.noRm;
				}	
				var nm =""
				var tempNamaOrReg= ""
				if ($scope.item.nama != undefined){
					var nm ="&nama=" +$scope.item.nama
					tempNamaOrReg = $scope.item.nama;
				}
				var ins =""
				var tempInstalasiIdArr = {};
				if ($scope.item.instalasi != undefined){
					var ins ="&deptId=" +$scope.item.instalasi.id
					tempInstalasiIdArr =  {id: $scope.item.instalasi.id,departemen : $scope.item.instalasi.departemen}
				}
				var rg =""
				var tempRuanganIdArr = {};
				if ($scope.item.ruangan != undefined){
					var rg ="&ruangId=" + $scope.item.ruangan.id
					tempRuanganIdArr =  {id: $scope.item.ruangan.id,ruangan : $scope.item.ruangan.ruangan}
				}
				var kp =""
				var tempKelompokArr = {};
				if ($scope.item.kelompokpasien != undefined){
					var kp ="&kelId=" +$scope.item.kelompokpasien.id
					tempKelompokArr = {id: $scope.item.kelompokpasien.id,kelompokpasien : $scope.item.kelompokpasien.kelompokpasien}
				}
				var dk =""
				var tempDokterArr = {};
  			var jmlRows = "";
        if ($scope.item.jmlRows != undefined) {
            jmlRows = $scope.item.jmlRows
        }
        
        var rekanan = "";
        if ($scope.item.rekanan != undefined) {
            var rekanan ="&rekanan=" + $scope.item.rekanan.id
 
        }
        

				$q.all([
					medifirstService.get("tatarekening/get-daftar-registrasi-pasienjasapelayanan?"+
						"tglAwal="+tglAwal+
						"&tglAkhir="+tglAkhir+
						reg+rm+nm+ins+rg+kp+dk+rekanan
						+ '&jmlRows='+jmlRows),
					]).then(function(data) {
						$scope.isRouteLoading=false;
						// $scope.dataDaftarPasienPulang = data[0].data;
						var onDataBound = function () {
			                $('td').each(function () {
			                  if ($(this).text() == 'belum') {$(this).addClass('red')}
							  if ($(this).text() == 'verif') {$(this).addClass('green')}
							  if ($(this).text() == 'BELUM') {$(this).addClass('red')}
			                  if ($(this).text() == 'SUDAH') {$(this).addClass('green')}
			                  // if ($(this).text() == 'Online') {$(this).addClass('koneng')}
			                
			                })
			             }

						 $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
	                        data: data[0].data,
	                        // pageSize: 10,
	                        total:data[0].data,
	                        serverPaging: false,
	                        schema: {
	                            model: {
	                                fields: {
	                                }
	                            }
	                        }
	                    });

						 var chacePeriode ={ 
						 	0 : tglAwal,
	                        1 : tglAkhir,	
	                        2 : tempNoReg,   
	                        3 : tempNoRm,                    
	                        4 : tempNamaOrReg, 
	                        5 : tempInstalasiIdArr,
	                        6 : tempRuanganIdArr,
	                        7 : tempKelompokArr,
	                        8 : tempDokterArr,                        
	                        9 : jmlRows
	                    }
					   cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode); 
					});

				}  ;
			$scope.UbahDokter = function(){
				$scope.cboDokter = true
				$scope.cboUbahDokter=false
			}			
			$scope.batal = function(){
				$scope.cboDokter = false
				$scope.cboUbahDokter=true
			}
			$scope.PasienPulang = function(){
				;
				if($scope.dataPasienSelected.tglpulang != undefined){
	        		window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
	                 	return;
        		}
				if ($scope.dataPasienSelected==undefined)
			 	{
			 		toastr.error('Pilih Data Pasien dulu','Caution');
			 	}else{
					 medifirstService.get('registrasi/get-norec-apd?noreg='+ $scope.dataPasienSelected.noregistrasi
					 	+ '&ruangId=' + $scope.dataPasienSelected.ruanganid ).then(function(e){
							if(e.data.length > 0 ){
								$state.go('PindahPulangPasien',{
									norecPD:$scope.dataPasienSelected.norec,
									norecAPD: e.data[0].norec_apd
									});
								var CachePindah = $scope.dataPasienSelected.ruanganid                                     
								cacheHelper.set('CachePindah', CachePindah);
							}
							
						 })
					
			 	}
				// var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				// $scope.cbopasienpulang = true
				// $scope.cboUbahDokter=false
				// if ($scope.dataPasienSelected.tglpulang != null){
				// 	$scope.item.tanggalPulang=$scope.dataPasienSelected.tglpulang
				// }else{
				// 	$scope.item.tanggalPulang=tglpulang
				// }				
			}

			$scope.batalsimpantglpulang = function(){
				$scope.cbopasienpulang = false 
				$scope.cboUbahDokter= true
			}

			//
			$scope.simpantglpulang = function(){
				//
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				var updateTanggal = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"tglpulang": tglpulang
				}
				medifirstService.saveupdatetglpulang(updateTanggal).then(function(e){
					LoadData();				
				})	
					$scope.cbopasienpulang=false;
					$scope.cboUbahDokter=true;
			}
			
			$scope.klikGrid = function(dataPasienSelected){
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = {id:dataPasienSelected.pgid,namalengkap:dataPasienSelected.namadokter}
				}
			}
			
			$scope.simpan = function(){
				;
				var objSave = 
                    {
                        norec:$scope.dataPasienSelected.norec,
                        objectpegawaifk:$scope.item.namaDokter.id
                    }

				medifirstService.postSaveDokter(objSave).then(function(e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter=true
				})	

				medifirstService.saveUpdateDokter(objSave).then(function(e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter=true
				})	
				
				/* update dokter pelayanan pasien yang kosong dokternya */
				var objPost = 
                {
                    "noregistrasi":$scope.dataPasienSelected.noregistrasi,
                    "objectpegawaifk":$scope.item.namaDokter.id
                }
				medifirstService.updateDokterPelPasien(objPost).then(function(e) {
				
				})
				medifirstService.updateDokterPelPasienNew(objPost).then(function(e) {
				
				})		

				

			}
			$scope.berkasrsPopup = function(){
				$scope.popup_tglupdate.center().open();
			}


      $scope.berkasrs = function(){
        // var objverif = {
        //               "noregistrasi": $scope.dataPasienSelected.noregistrasi
        //       };
        // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
        //   //   medifirstService.post('remunerasi/berkasrs',dataMasuk).then(function(e){
                          
        //   // })               
		// }) 
		if($scope.dataJasaPelayanan.options.data.length > 0){
			debugger;
			for (var i = 0; i < $scope.dataJasaPelayanan.options.data.length; i++){
				var  pelayananpasienpetugas = {
				  "norec_pp": $scope.dataJasaPelayanan.options.data[i].norec
				}
				// dataMasuk.push(masuk)
				var tglclosing = moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss');
				var objSave = {
				  pelayananpasienpetugas:pelayananpasienpetugas,
				  noregistrasi : $scope.dataPasienSelected.noregistrasi,
				  tglclosing : tglclosing,
				  tipe :1
	
				}
				medifirstService.post('remunerasi/berkasrsKeuangan', objSave).then(function (e) {
	
				})
			}
		}
        
       

        $scope.selectedData2 = [];
        $q.all([
                medifirstService.get("remunerasi/detail-jasapelayanan?"+
                  "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                ]).then(function(data) {
                  $scope.isRouteLoading=false;
                  $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                data: data[0].data.data,
                                // pageSize: 10,
                                total:data[0].data,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                });
         
        
	  }
	  $scope.berkasrsUpdate = function(){
		
			// var objverif = {
			// 			  "noregistrasi": $scope.dataPasienSelected.noregistrasi
			// 	  };
			//   medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){ 
				debugger;
				for (var i = 0; i < $scope.selectedData2.length; i++){
					var  pelayananpasienpetugas = {
					  "norec_pp": $scope.selectedData2[i].norec
					}
					// dataMasuk.push(masuk)
	
					var objSave = {
					  pelayananpasienpetugas:pelayananpasienpetugas,
					  noregistrasi : $scope.dataPasienSelected.noregistrasi,
					  tipe : 1,
					  tglclosing :  moment($scope.item.tglclosingganti).format('YYYY-MM-DD HH:mm:ss')
	
	
					}
					medifirstService.post('remunerasi/berkasrs', objSave).then(function (e) {
					  $q.all([
					  medifirstService.get("remunerasi/detail-jasapelayanan?"+
						"noregistrasi="+$scope.dataPasienSelected.noregistrasi),
					  ]).then(function(data) {
						$scope.isRouteLoading=false;
						$scope.dataJasaPelayanan = new kendo.data.DataSource({
									  data: data[0].data.data,
									  // pageSize: 10,
									  total:data[0].data,
									  serverPaging: false,
									  schema: {
										  model: {
											  fields: {
											  }
										  }
									  }
								  });
					  });
					})
				}
				$scope.selectedData2 = [];
			  
				
			//   })
			
		  
	  }
      $scope.hapustindakan = function(){
        $scope.isRouteLoading = true;
        var nama = medifirstService.getPegawaiLogin().namaLengkap
        var objDel = {
          "norec_pp": $scope.dataPelayananSelected.norec,
        }
        dataDel.push(objDel)
        var objDelete = {
          "dataDel": dataDel,
          "noregistrasi": $scope.dataPasienSelected.noregistrasi,
          "alasan": "Jasa Pelayanan",
          "pegawai": nama
        };
        if (dataDel.length != 0) {
          // medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
              var  objverif = {
                  "norec": $scope.dataPelayananSelected.norec        
              }
              medifirstService.post('remunerasi/delete-jasadokterpernorec',objverif).then(function(e){
                $q.all([
                  medifirstService.get("remunerasi/detail-jasapelayanan?"+
                    "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                  ]).then(function(data) {
                    $scope.isRouteLoading=false;
                    $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                  data: data[0].data.data,
                                  // pageSize: 10,
                                  total:data[0].data,
                                  serverPaging: false,
                                  schema: {
                                      model: {
                                          fields: {
                                          }
                                      }
                                  }
                              });
                  });
                         
			  })   
			  
			  
			  medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
				//  managePasien.hapusTindakan(tempData).then(function(e){
				// if (e.status === 201) {
				// 	medifirstService.post('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {
                   $a = e;   
					})
					
				// }
				$scope.isRouteLoading = false
				

			// })
                        
          // })

        }
      
      }
      $scope.batalDokterPelaksana = function () {
        // LoadData();
        $scope.model.jenisPelaksana = "";
        $scope.model.pegawais = "";
        $scope.dataDokterSelected = undefined;
        $scope.popup_editor.center().close();


      }
      $scope.close = function(){
		$scope.winDialogss.center().close();
		loadData();
      }
			$scope.Detail = function(){
				if($scope.dataPasienSelected.status == 'verif'){
					alert('Sudah diverifikasi')
					return;
				}
        if ($scope.item.tglclosing != ""  && $scope.item.tglclosing != undefined){
            var tglclosing = moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss');
        }else{
          alert('Isi Tanggal Closing')
          return
        }

        var tglnk = moment($scope.item.tglnk).format('YYYY-MM-DD HH:mm:ss');
        
                
				if($scope.dataPasienSelected.noregistrasi != undefined){
					// var objSave ={
					// 	noregistrasi:$scope.dataPasienSelected.noregistrasi
					// }
					// // medifirstService.postJurnalAkuntansi(objSave).then(function(data){
						
	    // //             });
					// var namakelas='nonkelas'
					// if($scope.dataPasienSelected.namakelas=='Kelas I'){
					// 	namakelas=1
					// }else if($scope.dataPasienSelected.namakelas=='Kelas II'){
					// 	namakelas=2
					// }else if($scope.dataPasienSelected.namakelas=='Kelas III'){
					// 	namakelas=3
					// }
				 //   	var obj = {
				 //   		// x:'x'
					// 	noRegistrasi : $scope.dataPasienSelected.noregistrasi,
					// 	nosep:$scope.dataPasienSelected.nosep,
					// 	objectdepartemenfk: $scope.dataPasienSelected.objectdepartemenfk,
					// 	kelasrawat: namakelas,
					// 	noka:$scope.dataPasienSelected.nokepesertaan,
					// 	tglregistrasi:moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
					// 	kdpoli:$scope.dataPasienSelected.kdinternal
				 //  	}

				 //  	$state.go('RincianPasienVerifikasi', {
				 //    	dataPasien: JSON.stringify(obj)
				 //  	});
					 var objverif = {
		                    // "data": $scope.selectedData,
		                    "pegawaiverif": $scope.dataLogin.id,
		                    "tglclosing" : tglclosing,
		                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                        "tglnk": tglnk
		            };
		            // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
						       // loadData();  
						       medifirstService.post('remunerasi/save-jasapelayanandoktersatuan-keuangan',objverif).then(function(e){
								       loadData();          
								 })	        
					// })	
				
					
				}
			}
			$scope.Detail2 = function(){
				if($scope.dataPasienSelected.noregistrasi != undefined){
					// var objSave ={
					// 	noregistrasi:$scope.dataPasienSelected.noregistrasi
					// }
					// // medifirstService.postJurnalAkuntansi(objSave).then(function(data){
						
	    // //             });
					// var namakelas='nonkelas'
					// if($scope.dataPasienSelected.namakelas=='Kelas I'){
					// 	namakelas=1
					// }else if($scope.dataPasienSelected.namakelas=='Kelas II'){
					// 	namakelas=2
					// }else if($scope.dataPasienSelected.namakelas=='Kelas III'){
					// 	namakelas=3
					// }
				 //   	var obj = {
				 //   		// x:'x'
					// 	noRegistrasi : $scope.dataPasienSelected.noregistrasi,
					// 	nosep:$scope.dataPasienSelected.nosep,
					// 	objectdepartemenfk: $scope.dataPasienSelected.objectdepartemenfk,
					// 	kelasrawat: namakelas,
					// 	noka:$scope.dataPasienSelected.nokepesertaan,
					// 	tglregistrasi:moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
					// 	kdpoli:$scope.dataPasienSelected.kdinternal
				 //  	}

				 //  	$state.go('RincianPasienVerifikasi', {
				 //    	dataPasien: JSON.stringify(obj)
				 //  	});
				 var objverif = {
	                    // "data": $scope.selectedData,
	                    // "pegawaiverif": $scope.dataLogin.id,
	                    // "penjamin" : $scope.item.namaPenjamin,
	                    "noregistrasi": $scope.dataPasienSelected.noregistrasi
	            };
				medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
					       loadData();
                 $scope.winDialogss.center().close();          
					 })	
				}
			}
      $scope.ubahrekanan = function(){
        $scope.popup_editor2.center().open();
      }
      $scope.simpanrekanan = function(){
         var objverif = {
                      "rekanan": $scope.item.rekanan.id,
                      "noregistrasi": $scope.dataPasienSelected.noregistrasi
              };
        medifirstService.post('remunerasi/ubahrekanan-jasapelayanandokter',objverif).then(function(e){
                 loadData();          
           }) 
        
      }
      $scope.kembalirekanan = function() {
        $scope.popup_editor2.center().close();
      }
      function loadKomponen() {
        medifirstService.get("remunerasi/get-komponenharga-pelayanan-keuangan?norec_pp=" + $scope.dataPelayananSelected.norec).
          then(function (data) {
            $scope.sourceKomponens = new kendo.data.DataSource({
              data: data.data.data,
              serverPaging: false,
              pageSize: 10,
              schema: {
                model: {
                  fields: {
                    komponenharga: { type: "string" },
                    jumlah: { type: "number" },
					tarif: { type: "number" },
					tarifhitung: { type: "number" },
                    hargadiscount: { type: "number" },
					jasa: { type: "number" },
					bruto: { type: "number" },
                    pph: { type: "number" },
                    netto: { type: "number" },

                  }
                }
              }, aggregate: [
				{ field: 'tarif', aggregate: 'sum' },
				{ field: 'tarifhitung', aggregate: 'sum' },
                { field: 'hargadiscount', aggregate: 'sum' },
				{ field: 'jasa', aggregate: 'sum' },
				{ field: 'bruto', aggregate: 'sum' },
				{ field: 'pph', aggregate: 'sum' },
				{ field: 'netto', aggregate: 'sum' },
              ]


            });
            // $scope.sourceKomponens = data.data.data;

          });
      }
      $scope.ubahkomponen = function () {
        if ($scope.dataPelayananSelected == undefined) {
          messageContainer.error("Pilih pelayanan dahulu!");
          return;
        }
        // 
        loadKomponen();
        $scope.item.tglPelayanans = moment(new Date($scope.dataPelayananSelected.tglPelayanan)).format('DD-MM-YYYY HH:mm')
        $scope.item.namaPelayanans = $scope.dataPelayananSelected.namaPelayanan;
        $scope.popupKomponen.center().open();
        // Get current actions
        var actions = $scope.popupKomponen.options.actions;
        // Remove "Close" button
        actions.splice(actions.indexOf("Close"), 1);
        // Set the new options
        $scope.popupKomponen.setOptions({ actions: actions });

      }
      $scope.klikKomponen = function (dataSelectedKomponen) {
        // if (dataSelectedKomponen.komponenharga != "Jasa Sarana") {
          // $scope.button = false;
          // $scope.billing = false;
          // $scope.cetak = false;
          // $scope.dtTanggal = false;
          // $scope.FilterData = false;
          $scope.DiskonKM = true;
          $scope.label = dataSelectedKomponen.komponenharga;
          $scope.item.komponenDis = dataSelectedKomponen.tarif;
          $scope.item.persenDiscount = "";
          $scope.item.diskonKomponen = "";
          $scope.item.JasaKomponen = dataSelectedKomponen.jasa;
          norec_ppd = dataSelectedKomponen.norecppd
          norec_pp = dataSelectedKomponen.norec_pp
          strukfk = $scope.dataSelected.strukfk
          tarif = dataSelectedKomponen.tarif
        // } else {
        //   $scope.DiskonKM = false;
        // }
      }
      $scope.columnKomponens = {
        sortable: true,
        // pageable: true,
        selectable: "row",
        columns: [
          {
            "field": "komponenharga",
            "title": "Komponen",
            "width": "100px",
          },
          {
            "field": "jumlah",
            "title": "Jumlah",
            "width": "50px"
          },
          {
            "field": "tarif",
            "title": "Harga Satuan",
            "width": "80px",
            "template": "<span class='style-right'>{{formatRupiah('#: tarif #', '')}}</span>",
            aggregates: ["sum"],
            footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.tarif.sum  #', '')}}</span>"
          },
          {
            "field": "tarifhitung",
            "title": "Harga Setelah Hitung",
            "width": "80px",
            "template": "<span class='style-right'>{{formatRupiah('#: tarifhitung #', '')}}</span>",
            aggregates: ["sum"],
            footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.tarifhitung.sum  #', '')}}</span>"
          },
          {
            "field": "bruto",
            "title": "Bruto",
            "width": "80px",
			"template": "<span class='style-right'>{{formatRupiah('#: bruto #', '')}}</span>",
			aggregates: ["sum"],
            footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.bruto.sum  #', '')}}</span>"
          
          },
          {
            "field": "pph",
            "title": "PPH",
            "width": "80px",
			"template": "<span class='style-right'>{{formatRupiah('#: pph #', '')}}</span>",
			aggregates: ["sum"],
            footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.pph.sum  #', '')}}</span>"
          
          },
          {
            "field": "netto",
            "title": "Netto",
            "width": "80px",
			"template": "<span class='style-right'>{{formatRupiah('#: netto #', '')}}</span>",
			aggregates: ["sum"],
            footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.netto.sum  #', '')}}</span>"
          
          },
          // {
          //   "field": "hargadiscount",
          //   "title": "Diskon",
          //   "width": "80px",
          //   "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
          //   aggregates: ["sum"],
          //   footerTemplate: "{{formatRupiah('#:data.hargadiscount.sum  #', '')}}"
          // },
          // {
          //   "field": "jasa",
          //   "title": "Jasa Cito",
          //   "width": "80px",
          //   "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
          //   aggregates: ["sum"],
          //   footerTemplate: "<span class='style-right'>{{formatRupiah('#:data.jasa.sum  #', '')}}</span>"
          // },
        ],
        sortable: {
          mode: "single",
          allowUnsort: false,
        },
      };
			$scope.Detail3 = function(){
				if($scope.dataPasienSelected.noregistrasi!= undefined){
				$scope.winDialogss.center().open();
				$q.all([
					medifirstService.get("remunerasi/detail-jasapelayanan?"+
						"noregistrasi="+$scope.dataPasienSelected.noregistrasi),
					]).then(function(data) {
						$scope.isRouteLoading=false;
						$scope.dataJasaPelayanan = new kendo.data.DataSource({
	                        data: data[0].data.data,
	                        // pageSize: 10,
	                        total:data[0].data,
	                        serverPaging: false,
	                        schema: {
	                            model: {
	                                fields: {
	                                }
	                            }
	                        }
	                    });
					});
				}
			}
			 $scope.verifikasigrid = function (dataPasienSelected) {
			 	;
                if ($scope.item.tglclosing != ""  && $scope.item.tglclosing != undefined){
                    var tglclosing = moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss');
                }else{
                  alert('Isi Tanggal Closing')
                  return
                }

                var tglnk = moment($scope.item.tglnk).format('YYYY-MM-DD HH:mm:ss');
                var objverif = {
                        "tglclosing" : tglclosing,
                        "tglnk": tglnk, 
		                    "pegawaiverif": $scope.dataLogin.id,
		                    "noregistrasi": dataPasienSelected.noregistrasi
		            };
		            // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
						       // loadData();  
						       medifirstService.post('remunerasi/save-jasapelayanandoktersatuan-keuangan',objverif).then(function(e){
								       loadData();          

								 })	  
				

			}
			
			$scope.DaftarRuangan = function(){
				if($scope.dataPasienSelected.noregistrasi != undefined){
				   	var obj = {
				    	noRegistrasi : $scope.dataPasienSelected.noregistrasi
				  	}

				  	
				  	cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
				  	// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
				  	$state.go('AntrianPasienDiperiksa', {
				    	dataPasien: JSON.stringify(obj)
				  	});
				}
			}


			$scope.hitungProposriPersen = function(){
				// $PersenHasil = $item.
				// for (var i = $scope.resultGrids._data.length -1; i >= 0; i--) 
				// {
				// 	if ($scope.resultGrids._data[i].hasil != null || $scope.resultGrids._data[i].hasil != '')
				// 	{

				// 	}
				// }
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
        $scope.cetakKartu = function() {
        	$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
        	if($scope.dataPasienSelected.tglpulang == undefined){
        		window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                 	return;
        	}
            if($scope.dataPasienSelected.noregistrasi == undefined)
                var noReg = "";
            else
                var noReg = $scope.dataPasienSelected.noregistrasi;
	            var stt = 'false'
	            if (confirm('View Kartu Pulang? ')){
	                // Save it!
	                stt='true';
	            }else {
	                // Do nothing!
	                stt='false'
	            }
	            var client = new HttpClient();        
	            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi='+noReg+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
	                // do something with response
	            });
	    }
	    $scope.SuratKontrol = function() {
	    	if($scope.dataPasienSelected.noregistrasi != undefined){
				   	var obj = {
				    	noRegistrasi : $scope.dataPasienSelected.noregistrasi
				  	}

				  	$state.go('RincianTagihanTataRekening', {
				    	dataPasien: JSON.stringify(obj)
				  	});
				}

        	$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            if($scope.dataPasienSelected.noregistrasi == undefined)
                var noregistrasi = "";
            else

                var obj = {
			    	noRegistrasi : $scope.dataPasienSelected.noregistrasi
			  	}

			  	$state.go('PerjanjianPasien', {
			    	dataPasien: JSON.stringify(obj)
			  	});
	            // var stt = 'false'
	            // if (confirm('View Surat Kontrol? ')){
	            //     // Save it!
	            //     stt='true';
	            // }else {
	            //     // Do nothing!
	            //     stt='false'
	            // }
	            // var client = new HttpClient();        
	            // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-suratPerjanjianbynocm=1&nocm='+nocm+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
	            //     // do something with response
	            // });
	    }
	    $scope.EditSEP = function(){
				$scope.item.noPeserta="";
				$scope.item.noSep="";

				if($scope.dataPasienSelected.norec == null){
					messageContainer.error("Pasien Belum Dipilih!!")
                	return;
				}
				if($scope.dataPasienSelected.kelompokpasien !="BPJS"){
					messageContainer.error("Input SEP hanya untuk pasien BPJS")
                	return;
				}
				// if($scope.dataPasienSelected.norec_pa ==null){
				// 	messageContainer.error("Pemakaian Asuransi tidak ada")
                // 	return;
				// }

				if($scope.dataPasienSelected.nokepesertaan != undefined){
					$scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
				}

				if($scope.dataPasienSelected.nokepesertaan != undefined){
					$scope.item.noSep = $scope.dataPasienSelected.nosep;
				}

				
				$scope.cboSep = true
				$scope.cboUbahSEP=false
				$scope.cboDokter = false
				$scope.cboUbahDokter =false
			}			
			$scope.simpanSep = function(){
				var norec_pa =""
				if ($scope.dataPasienSelected.norec_pa != undefined)
					norec_pa=$scope.dataPasienSelected.norec_pa
				var updateSep = {
					"norec": $scope.dataPasienSelected.norec,
					"nokepesertaan": $scope.item.noPeserta,
					"nosep": $scope.item.noSep,
					"norec_pa" : norec_pa,
					"nocm" : $scope.dataPasienSelected.nocm,
				}
				
				medifirstService.postSaveSepTarek(updateSep).then(function(e){
					loadData();				
					$scope.saveLogInputSep()
				})	
					
					$scope.cboSep = false
					$scope.cboUbahSEP=true
					$scope.cboDokter =false
					$scope.cboUbahDokter =true
			}
			$scope.saveLogInputSep=function(){
				var jenisLog ='Input SEP'
				var referensi ='Norec Pemakaian Asuransi'
				var keterangan = 'Input Sep - ' +$scope.item.noSep + ' No Registrasi ' +  $scope.dataPasienSelected.noregistrasi
				   medifirstService.get("logging/save-log-all?jenislog="
				    + jenisLog+"&referensi="+referensi
				    + "&noreff="+ $scope.dataPasienSelected.norec_pa
				     + "&keterangan=" + keterangan
				   ).then(function(data) {
				   	$scope.item.noPeserta="";
					$scope.item.noSep="";
			    }) 
			}
			//end log
			$scope.batalSep = function(){
				$scope.item.noPeserta="";
				$scope.item.noSep="";
				$scope.cboSep = false	
				$scope.cboUbahSEP=true
				$scope.cboDokter = false
				$scope.cboUbahDokter =true
			}

			$scope.resumeMedis = function(){
				if($scope.dataPasienSelected == undefined){
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.get('registrasipasien/get-apd?noregistrasi='+ $scope.dataPasienSelected.noregistrasi
				+ '&objectruanganlastfk=' + $scope.dataPasienSelected.ruanganid ).then(function(e){
				 if(e.data.data.length > 0 ){

					var arrrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						// 4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.kelompokpasien,
						6: $scope.dataPasienSelected.tglregistrasi,
						7: e.data.data[0].norec_apd,
						8: $scope.dataPasienSelected.norec,
						// 9: $scope.dataPasienSelected.objectkelasfk,
						// 10: $scope.dataPasienSelected.namakelas,
						11: $scope.dataPasienSelected.ruanganid,
						12: $scope.dataPasienSelected.namaruangan
				}
					cacheHelper.set('cacheRekamMedis', arrrStr);
					$state.go('ResumeMedisRI',{
						noRec : e.data.data[0].norec_apd
					})
				 }
				})
			
			}
				function postKunjunganYankes(){
  	  			let status = false
			    var tanggal = moment(new Date()).format('YYYY-MM-DD')
			 	medifirstService.get('yankes/get-kunjungan?tgl=' + tanggal)
			      .then(function(a){
			        var result = a
			        if (result.data.list != undefined && result.data.list.length > 0) {
			         for (var i = 0; i < result.data.list.length; i++) {
			            if (moment(new Date()).format('YYYY-MM-DD') ==  result.data.list[i].tanggal) {
			              status = true
			              medifirstService.get('yankes/count-kunjungan-pasien')
				             .then(function(d){
				              let datt = d.data
				              var jsonSave = {
				                "data": {
				                  "kode_kirim": result.data.list[i].kode,
				                  "tanggal": moment(new Date()).format('YYYY-MM-DD'),
				                  "kunjungan_rj": datt.data.rawat_jalan,
				                  "kunjungan_igd": datt.data.igd,
				                  "pasien_ri": datt.masihDirawat// result.data.rawat_inap,
				                }
				              }
				    
				            medifirstService.post('yankes/update-kunjungan',jsonSave)
				            .then(function(c){
				                var resp = c.data
				                if (resp.kode == 200) {
				                	toastr.success('Post Bridging Yankes')
				                }
				   
				              }, error => {
				              		toastr.error('Post Bridging Yankes Gagal')
				              });
				            })
			             	 break
			            }
			          }
			        }
			        if (status == false) {
			       	 	medifirstService.get('yankes/count-kunjungan-pasien')
			             .then(function(b){
			              let result = b.data
			              var jsonSave = {
			                "data": {
			                  "kode_kirim": null,
			                  "tanggal": moment(new Date()).format('YYYY-MM-DD'),
			                  "kunjungan_rj": result.data.rawat_jalan,
			                  "kunjungan_igd": result.data.igd,
			                  "pasien_ri": result.masihDirawat// result.data.rawat_inap,
			                }
			              }
			    
			            medifirstService.post('yankes/insert-kunjungan',jsonSave)
			            .then(function(c){
			                var resp = c.data
			                if (resp.kode == 200) {
			                	toastr.success('Post Bridging Yankes')
			                }
			   
			              }, error => {
			              		toastr.error('Post Bridging Yankes Gagal')
			              });
			            })
			        }
			      })
	   
	  	  		}
	  	  		 function getSisrute() {
	  	  		 	// 
				    var now = moment(new Date()).format('YYYY-MM-DD')
				    medifirstService.get('sisrute/rujukan/get?tanggal=' + now).then(function(response){			
				      $scope.jmlRujukanMasuk = response.data.total
				      console.log('rujukan masuk : ' + response.data.total)
				    })
				    medifirstService.get('sisrute/rujukan/get?tanggal=' + now+ '&create=true').then(function(response){			
				      $scope.jmlRujukanKeluar = response.data.total
				       console.log('rujukan masuk : ' + response.data.total)
				    })
				  }
	       $scope.$watch('item.kelompokpasien', function (e) {
            ;
                if (e === undefined) return;
                if($scope.isLoadEdit == true){
                    $scope.nonUmum = true;
                    $scope.isLoadEdit = false;
                    return;
                }
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                      ;
                        $scope.listRekanan = z.data.rekanan;                        
                })
            });
				 function postRujukanYankes(){
				 	// 
				    let status = false
				    medifirstService.get('yankes/get-rujukan?tgl=' + moment(new Date()).format('YYYY-MM-DD')).then(function(res){		
				     var  resultData = res.data.list
				    if( resultData!= undefined && resultData.length> 0){
				      for (var i = 0; i < resultData.length; i++) {
				        if (moment(new Date()).format('YYYY-MM-DD') ==resultData[i].tanggal) {
				          status = true
				          var jsonSave = {
				            "data": {
				              "kode_kirim": resultData[i].kode,
				              "tanggal": resultData[i].tanggal,
				              "jumlah_rujukan": $scope.jmlRujukanMasuk,
				              "jumlah_rujuk_balik": $scope.jmlRujukanKeluar,
				            }
				          }
				          medifirstService.post('yankes/update-rujukan',jsonSave)
			               .then(function(response){
			               console.log('Update Yankes Rujukan')
				          }, error => {
				          });
				          break
				        }
				      }
				    }
				 
				    if(status ==  false){
				      var da = {
				        "data": {
				          "kode_kirim": null,
				          "tanggal": moment(new Date()).format('YYYY-MM-DD'),
				          "jumlah_rujukan": $scope.jmlRujukanMasuk,
				          "jumlah_rujuk_balik":  $scope.jmlRujukanKeluar,
				  
				        }
				      }
				  
				   medifirstService.post('yankes/insert-rujukan',da)
			               .then(function(response){
			               	  console.log('Insert Yankes Rujukan')
				          }, error => {
				          });
				    }
				  })




			}
      $scope.UpdateDiskon = function () {
      debugger;
          var objSave = {
            norec : norec_ppd,
            norecpp: norec_pp,
			tarifrs: $scope.item.discount,
			// persen: $scope.item.persenPengali,
            // hargakomponen: $scope.item.komponenDis,
          }
          medifirstService.post('remunerasi/updatekomponen', objSave).then(function (data) {
            loadKomponen();
          });
         
        
	  }
	  $scope.KembalikanHarga = function () {
		debugger;
			var objSave = {
			  norec : norec_ppd,
			  norecpp: norec_pp,
			  tarifrs: $scope.item.discount,
			  persen: $scope.item.persenPengali,

			}
			medifirstService.post('remunerasi/kembalikankomponenjasa', objSave).then(function (data) {
			  loadKomponen();
			});
		   
		  
		}

		$scope.UpdateKomponenBermasalah = function () {
			debugger;
			var tgl ="";
			if($scope.item.tglclosing != null && $scope.item.tglclosing != undefined && $scope.item.tglclosing !='')
			{
				tgl =moment($scope.item.tglclosing ).format('YYYY-MM-DD'); 

			}
				var objSave = {
				  tgl : tgl,
				  norecpp: norec_pp,
				  tarifrs: $scope.item.discount,
				  persen: $scope.item.persenPengali,
	
				}
				medifirstService.post('remunerasi/kembalikankomponenjasa', objSave).then(function (data) {
				  loadKomponen();
				});
			   
			  
			}	
      $scope.getRajal =function(){

	  }
      $scope.inputtarifincbg = function () {
		// LoadData()
		//allz
		
		if($scope.item.getRajal != false)
		{
			isRajal ="Y";
		}else{
			isRajal ="T";
		}
		medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
				
		})
		$scope.popupinacbg.center().open();
	
		$scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar;
		if($scope.dataPasienSelected.persenJasaLast != null)
		{
			$scope.item.persenTake = $scope.dataPasienSelected.persenJasaLast;
			$scope.item.tarifinacbg = $scope.dataPasienSelected.tarifINACBLast;
		}
		
		// medifirstService.get("remunerasi/total-tarif-pelayan-all?noregistrasi=" + $scope.dataPasienSelected.noregistrasi +"&isRajal=" + isRajal).then(function (data){
		// 	$scope.item.tarifrs2 = data.data.data.TotalBayar;
		//   });
		 
		medifirstService.get("tatarekening/get-daftar-registrasi-pasienjasapelayanan-bynoregistrasi?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function(data) {
				$scope.item.tarifrs = data.data[0].total;
				 
		});
		medifirstService.get("remunerasi/detail-tarif-pelayan-all?"+
			"noregistrasi="+$scope.dataPasienSelected.noregistrasi+"&isRajal=" + isRajal).then(function(data) {
			var total = 0;
			for (var i = data.data.data.length - 1; i >= 0; i--) {
				total = total + parseFloat(data.data.data[i].TotalBayar)
			}
			$scope.item.tarifrs2= total;
			$scope.isRouteLoading=false;
			$scope.dataGridPilihRuangan1 = new kendo.data.DataSource({
				data: data.data.data,
				// pageSize: 10,
				total:data.data.data.length,
				serverPaging: false,
				schema: {
					model: {
						fields: {
						}
					}
				}
			});

			
		
		});

	  }
	  $scope.inputtarifincbg2 = function () {
		// LoadData()
		//allz
		
		if($scope.item.getRajal != false)
		{
			isRajal ="Y";
		}else{
			isRajal ="T";
		}
		medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
				
		})
		$scope.popupinacbg.center().open();
	
		$scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar;
		if($scope.dataPasienSelected.persenJasaLast != null)
		{
			$scope.item.persenTake = $scope.dataPasienSelected.persenJasaLast;
			$scope.item.tarifinacbg = $scope.dataPasienSelected.tarifINACBLast;
		}
		
		// medifirstService.get("remunerasi/total-tarif-pelayan-all?noregistrasi=" + $scope.dataPasienSelected.noregistrasi +"&isRajal=" + isRajal).then(function (data){
		// 	$scope.item.tarifrs2 = data.data.data.TotalBayar;
		//   });
		 
		medifirstService.get("tatarekening/get-daftar-registrasi-pasienjasapelayanan-bynoregistrasi?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function(data) {
				$scope.item.tarifrs = data.data[0].total;
				 
		});
		medifirstService.get("remunerasi/detail-tarif-pelayan-allnodistinct?"+
			"noregistrasi="+$scope.dataPasienSelected.noregistrasi+"&isRajal=" + isRajal).then(function(data) {
			var total = 0;
			for (var i = data.data.data.length - 1; i >= 0; i--) {
				total = total + parseFloat(data.data.data[i].TotalBayar)
			}
			$scope.item.tarifrs2= total;
			$scope.isRouteLoading=false;
			$scope.dataGridPilihRuangan1 = new kendo.data.DataSource({
				data: data.data.data,
				// pageSize: 10,
				total:data.data.data.length,
				serverPaging: false,
				schema: {
					model: {
						fields: {
						}
					}
				}
			});

			
		
		});

	  }
	  $scope.bukaPerbaikan = function()
	  {
		medifirstService.get("remunerasi/getkomponenhargagif").then(function(data) {
			$scope.listKomponenGif = data.data.data;
			$scope.popupKomponenPerbaiki.center().open();  
		
		});
		
	  }
	  $scope.bukaPerbaikan = function()
	  {
		$scope.popupKomponenPerbaiki.center().open();  
	  }
      $scope.kembaliinacbg = function () {
        // LoadData()
		$scope.popupinacbg.center().close();
		$scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar;
		
			$scope.item.persenTake = "";
			$scope.item.tarifinacbg = "";
			$scope.item.tarifrs2 = "";
		 
		
      }
      $scope.BatalDiskon = function () {
        // LoadData()
        $scope.popupKomponen.center().close();
	  }
	  
	  $scope.simpaninacbg = function () {
	
		  if($scope.item.tarifinacbg == undefined)
		  {
			toastr.error('Isi Tarif INACBG')
			return
		  }
		  $scope.item.persenTake = Math.round( (($scope.item.tarifinacbg  - $scope.item.tarifrs2) /  $scope.item.tarifrs) * 100, -1);
		  if($scope.item.getRajal2 == true){
			var $tglbanding = moment($scope.item.tglbanding).format('YYYY-MM-DD 00:00:00');
			  //codingan copy tarifnormal
			  var objverifx = {
				// "persen": $scope.item.persenTake,
				"noregistrasi": $scope.dataPasienSelected.noregistrasi,
				"tglverif": $tglbanding,			
			   };
				medifirstService.post('remunerasi/save-jasapelayanan-inacbgcopy',objverifx).then(function(e){
					var objverif = {
						"persen": $scope.item.persenTake,
						"noregistrasi": $scope.dataPasienSelected.noregistrasi,
						"tarifINACBG": $scope.item.tarifinacbg,
						"tarifRS": $scope.item.tarifrs2,
						"isRajal":isRajal,
						"tglverif": $scope.dataPasienSelected.tglverif
					};
				
					medifirstService.post('remunerasi/save-jasapelayanan-inacbg',objverif).then(function(e){
					
						if(parseFloat($scope.item.persenTake)<50){
							$scope.item.persenTake = Math.round( (($scope.item.tarifinacbg ) /  $scope.item.tarifrs) * 100, -1);					
						}
						var objverif = {
							"persen": $scope.item.persenTake,
							"noregistrasi": $scope.dataPasienSelected.noregistrasi,
							"tarifINACBG": $scope.item.tarifinacbg,
							"tarifRS": $scope.item.tarifrs2,
							"isRajal":isRajal,
							"tglverif":$tglbanding,
		
						};
						medifirstService.post('remunerasi/save-jasapelayanan-inacbgv2',objverif).then(function(e){
		
						});
						$scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar
						// medifirstService.get("remunerasi/total-tarif-pelayan-all?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (data){
						// 	$scope.item.tarifrs2 = data.data.data.total;
						// });
					});
			  	});
		  }else{
			var objverif = {
				"persen": $scope.item.persenTake,
				"noregistrasi": $scope.dataPasienSelected.noregistrasi,
				"tarifINACBG": $scope.item.tarifinacbg,
				"tarifRS": $scope.item.tarifrs2,
				"isRajal":isRajal
			};
		
			medifirstService.post('remunerasi/save-jasapelayanan-inacbg',objverif).then(function(e){	
				$scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar
				// medifirstService.get("remunerasi/total-tarif-pelayan-all?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (data){
				// 	$scope.item.tarifrs2 = data.data.data.total;
				// });
			});
		  }
		 
		
	  }
      //  $scope.$watch('item.discount', function (newValue, oldValue) {
      //   if (newValue != oldValue) {
        
      //     $scope.item.diskonKomponen = (parseFloat($scope.item.komponenDis)) - parseFloat($scope.item.discount)
      //   }
      // })

					  // END ################

		}
	]);
});