define(['initialize'], function(initialize) {
'use strict';
    initialize.controller('LaporanPenjualanObatCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService',
        function($scope, dateHelper, $http, $state, medifirstService) {    	
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};                       
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');   
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;                     
            FormLoad();             

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {                                                   
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listDataDokter = dat.data.dokter; 
                    $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var dok = ""
                if ($scope.item.dokter != undefined) {
                   dok = "&dokid=" + $scope.item.dokter.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kp = "&kpid=" + $scope.item.kelompokPasien.id
                }
                var ru = ""
                if ($scope.item.ruangan != undefined) {
                    ru = "&ruid=" + $scope.item.ruangan.id
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-laporan-pengeluaran-obat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                   dok + kp + ru
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        $scope.totaltunai = 0;
                        $scope.totalpenjamin = 0;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            $scope.totaltunai= $scope.totaltunai + parseFloat(dat.data.daftar[i].tunai)
                            $scope.totalpenjamin= $scope.totalpenjamin + parseFloat(dat.data.daftar[i].penjamin)
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            schema: {
                                model: {
                                    fields: {
                                        kelompokpasien: { type: "string" },
                                        tunai: { type: "number" },
                                        penjamin: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            group: [
                                {
                                    field: "kelompokpasien", aggregates: [
                                        { field: 'tunai', aggregate: 'sum' },
                                        { field: "penjamin", aggregate: 'sum' },
                                    ]
                                },
                            ],
                            aggregate: [
                                { field: 'tunai', aggregate: 'sum' },
                                { field: "penjamin", aggregate: 'sum' },
                            ]
                        });                        
                    });

// var json = {
//     'nama': 'yogs',
//     'slsms':sdsds
// }
// medifirstService.poat('fsfs',jdon).then(function(e){
//     $scope.listRuangan = e.data.dstsr
// })
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

            function FormLoad(){                
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
               LoadCombo();
            }                               

            $scope.ClearData = function () {
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
               $scope.item.ruangan = undefined;
               $scope.item.kelompokPasien = undefined;
               $scope.item.dokter = undefined;
            }

            $scope.cariFilter = function () {

                init();
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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

            $scope.CetakLapDetail = function() {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }

            $scope.CetakLapRekap = function(){
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }            
            

            $scope.CetakLapBhpDetail = function() {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat BHP? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat-Bhp='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }

            $scope.CetakLapBhpRekap = function(){
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat BHP? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat-Bhp='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }      
            
            $scope.CetakLapApotik = function() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Kwitansi Apotik? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient();                     
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-KwitansiApotik='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {                    
                });
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanPengeluaranObat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Laporan Pengeluaran Obat",
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
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "60px",
                    },
                    {
                        "field": "nocm",
                        "title": "No. RM",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                       footerTemplate: "<span>Total </span>"
                    },
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "70px",
                        aggregates: ["sum"],
                        template: "<span class='style-right'>{{formatRupiah('#: tunai  #', '')}}",
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}"
                    },
                    {
                        "field": "penjamin",
                        "title": "Penjamin",
                        "width": "50px",
                        aggregates: ["sum"],
                        template: "<span class='style-right'>{{formatRupiah('#: penjamin  #', '')}}",
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.penjamin.sum  #', '')}}",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.penjamin.sum  #', '')}}"
                    },
                    {
                        hidden: true,
                        field: "kelompokpasien",
                        title: "Kelompok Pasien",
                        aggregates: ["count"],
                        groupHeaderTemplate: " #= value # "
                    }
                ]                   
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
//////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});