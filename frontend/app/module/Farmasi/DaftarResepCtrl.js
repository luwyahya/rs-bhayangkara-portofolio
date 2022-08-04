define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarResepCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {

            // initialize.controller('DaftarResepCtrl', ['$q', '$rootScope', '$scope', 'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.jmlRows = 50;
            $scope.isRouteLoading = false;
            $scope.item.ruangans = '';
            $scope.currentNoRegistrasi = $state.params.noRegistrasi;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepCtrl2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.noReg = chacePeriode[2];
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listRuanganDepo = dat.data.ruanganfarmasi;
                });
                $scope.listJenisRacikan = [{ id: 1, jenisracikan: 'Puyer' }]
            }
            $scope.cariEnter  = function(){
                init()
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var farmasi = ""
                if ($scope.item.ruanganDepo != undefined) {
                    var farmasi = "&IdFarmasi=" + $scope.item.ruanganDepo.id
                }
                var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {                   
                    $scope.listPenulisResep = dat.data.penulisresep;
                  
                })
                medifirstService.get("farmasi/get-daftar-resep?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noresep=" + $scope.item.noResep +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + farmasi 
                    + '&jmlRows=' + jmlRows//+Jra
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.daftar[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                            if (dat.data.daftar[i].isreseppulang == 1) {
                                dat.data.daftar[i].cekreseppulang = "✔"                            
                            }else{
                                dat.data.daftar[i].cekreseppulang = "-"
                            }
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });                        
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarResepCtrl2', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.TransaksiPelayanan = function () {
                //debugger;
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec_apd,
                    9: 'resep'
                }
                cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                $state.go('TransaksiPelayananApotik')

                var arrStr2 = {
                    0: $scope.dataSelected.norec
                }
                cacheHelper.set('DaftarResepCtrl', arrStr2);
                $state.go('DaftarResepCtrl')
            }
            $scope.UbahDokter = function () { 
                debugger;
                $scope.item.penulisResep = { id: $scope.dataSelected.pgid, namalengkap: $scope.dataSelected.dokter }
                $scope.popupCetak.center().open()
             
            }
            $scope.UbahTglResep = function () { 
                debugger;
				var noregistrasi = $scope.dataSelected.noregistrasi;
				var ruapotikid = $scope.dataSelected.ruapotikid;
                // $scope.item.tglresep = $scope.dataSelected.tglresep
                $scope.item.ruangans = { namaruangan:  $scope.dataSelected.namaruangan, norec_apd: $scope.dataSelected.norec_apd}
                $scope.item.tglresep = new Date(moment($scope.dataSelected.tglresep).format('YYYY-MM-DD HH:mm'));
                medifirstService.get("rawatinap/get-ruangan-blok-depo?noregistrasi=" + noregistrasi + '&ruapotikid=' + ruapotikid)
				.then(function (dat) {
					$scope.listRuangan = dat.data.ruangan;

				});
                $scope.popUpTglResep.center().open()
             
            }
             $scope.simpandokter = function () {
                var objSave =
                {
                    norec: $scope.dataSelected.norec,
                    pegawaifk : $scope.item.penulisResep.id
                }
                medifirstService.post('farmasi/save-ubahdokter', objSave).then(function (e) {
                    init();
                })
            }
            $scope.simpanTglResep = function () {
				if ($scope.item.password != "diubah") {
					toastr.error("Password Salah!")
					return;
				}
                debugger;
                if($scope.item.ruangans.norec_apd === undefined){
                    $scope.item.ruangans.norec_apd = $scope.item.ruangans.norec
                }
				var json = {
                'norec': $scope.dataSelected.norec,
                'namaruangan': $scope.dataSelected.namaruangan,
				'noresep': $scope.dataSelected.noresep,
                'tglresep': moment($scope.item.tglresep).format('YYYY-MM-DD HH:mm:ss'),
                'norec_to': $scope.item.ruangans.norec_apd,
                'namaruangan_to': $scope.item.ruangans.namaruangan,
                'tglawalresep': $scope.dataSelected.tglresep,
				}
				debugger;
				medifirstService.post('farmasi/update-tanggal-resep', json).then(function (e) { 
					if (e.status === 201) {
					debugger;
					medifirstService.post('sysadmin/logging/save-log-ganti-tanggal-resep', json).then(function (e) {
						LoadCache();
						})
					}
				})
				$scope.popUpTglResep.close()
			}


            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarResepPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Resep Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Resep",
                        "width": "50px",
                    },
                    {
                        "field": "noresep",
                        "title": "NoResep",
                        "width": "60px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "60px",
                    },
                    {
                        "field": "nocm",
                        "title": "No MR",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "100px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pembayaran",
                        "width": "80px",
                    },
                    
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px"
                    },
                    {
                        "field": "namaruanganapotik",
                        "title": "Apotik",
                        "width": "70px",
                    },
                    {
                        "field": "cekreseppulang",
                        "title": "Resep Pulang",
                        "width": "70px",
                    }
                ]					
			};
            
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            $scope.CetakSEP = function (x) {
				if ($scope.dataSelected.noregistrasi != undefined && $scope.dataSelected.kelompokpasien !== "Umum/Pribadi") {
					// // var noSep = e.data.data === null ? "2423432" : e.data.data;
					// // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
					// // window.open(fixUrlLaporan, '', 'width=800,height=600')


					// //##save identifikasi sep
					// medifirstService.get("registrasi/identifikasi-sep?norec_pd="
					// 	+ $scope.dataPasienSelected.norec
					// ).then(function (data) {
					// 	var datas = data.data;
					// })
					// //##end

					// //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
					// //cetakan langsung service VB6 by grh    
					// var client = new HttpClient();
					// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false', function (response) {
					// 	// do something with response
					// });
					medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep"+
                        '&norec=' + $scope.dataSelected.noregistrasi 
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;
                        $("#nosepx").text(data[0].nosep);
                        $("#nopendaftaran").text(data[0].noregistrasi);
                        $("#tglsep").text(data[0].tanggalsep);
                        $("#peserta").text(data[0].jenispeserta);
                        $("#nokartu").text(data[0].nokepesertaan+' / '+ data[0].nocm);
                        // $("#cob").text(data[0].penjaminlaka);
                        $("#namapeserta").text(data[0].namapeserta);
                        $("#jenisrawat").text(data[0].jenisrawat);
                        $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                        $("#kelasrawathak").text(data[0].namakelashak);
						$("#kelasrawat").text(data[0].namakelas);
                        $("#notelepon").text(data[0].notelpmobile);
                        $("#penjamin").text(data[0].penjaminlakalantas);
                        $("#politujuan").text(data[0].namaruanganfix);
                        $("#prolanis").text(data[0].prolanisprb);
                        $("#faskesperujuk").text(data[0].nmprovider);
                        $("#diagnosaawal").text(data[0].namadiagnosa);
                        $("#catatan").text(data[0].catatan);
						$("#cetakanke").text(1);     
						$("#namadjpjmelayani").text(data[0].namadjpjpmelayani);                                           

                        var printdata = document.getElementById(x);  
                        printdata = printdata.innerHTML;             
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                               '<!DOCTYPE html>' +
                               '<html style="border:none;border-color: white">' +
                               '<head style="border:none;border-color: white">' +
                               // '<div class="header" style="position: fixed;top: 0;">'+
                               // header +
                                '<style>' +
                              'html { font: 11pt sans-serif; }' +
                              '.k-grid { border-top-width: 0; }' +
                              '.k-grid, .k-grid-content { height: auto !important; }' +
                              '.k-grid-content { overflow: visible !important; }' +
                              '.k-grid .k-grid-header th { border-top: none; }' +
                              '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                              '</style>' +
                               '</div>'+
                               '</head>' +
                               '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                               '<table  style="border:none; border-color: white">' +
                                 '<thead style="border:none;border-color: white">' +
                                  '<tr style="border:none;border-color: white">' +
                                   '<td style="border:none;border-color: white">' +
                                      // '<div class="page-header-space"></div>' +
                                      '<div style="border:none;border-color: white">'+
                                          // header +                                
                                      '</div>'+
                                    '</td>' +
                                  '</tr>' +
                                '</thead>' +
                                 '<tbody>' +
                                  '<tr>' +
                                    '<td>' 
                              var htmlEnd =                         
                                        '</td>'+
                                      '</tr>'+
                                    '</tbody>'+
                                   '</body>' +
                                   '</div>' +
                                
                                   
                                   '</html>';
                            var printdata = document.getElementById(x);  
                            printdata = printdata.innerHTML; 
                            printdata = htmlStart + printdata + htmlEnd;            
                            // var editor = $("#editor").data("kendoEditor");
                            // editor.value(printdata);

                            // var cetakan=htmlStart + printableContent + htmlEnd;
                            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                            WindowObject.document.writeln(printdata);
                            WindowObject.document.close();
                            WindowObject.focus();

                    })
				}
			}

            function itungUsia(tgl) {
                //debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }
            //***********************************

        }
    ]);
});
