define(['initialize'], function(initialize) {
    'use strict';
        initialize.controller('DaftarRegistrasiPasienOperatorAntrolCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService','CacheHelper',
            function($scope, dateHelper, $http, $state, medifirstService,cacheHelper) {    	
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
                    // medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {                                                   
                    //     $scope.listRuangan = dat.data.ruanganfarmasi;
                    //     $scope.listDataDokter = dat.data.dokter; 
                    //     $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                    //     $scope.namaLengkap = medifirstService.getPegawaiLogin();
                    // });
                }
    
                function init() {
                    $scope.isRouteLoading = true;
                   
                    var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                    medifirstService.get("registrasi/daftar-registrasi/get-daftar-registrasi-pasien-antrol?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir 
                        , true).then(function (data) {
							debugger
                            $scope.isRouteLoading = false;
                            var data2 =  data.data
                            for (var i = 0; i < data.data.length; i++) {
                                data.data[i].no = i + 1
                            } 
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data.data,
                                schema: {
                                    model: {
                                       
                                    }
                                },
                                pageSize: 200000,
                                total: data.data.length,
                                serverPaging: false,
                               
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
                    cacheHelper.set('DaftarRegistrasiPasienOperatorAntrolCtrl', chacePeriode);
    
    
                }
    
                function FormLoad(){                
                   $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                   $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
                   LoadCombo();
                }                               
    
                    
                $scope.cariFilter = function () {
    
                    init();
                }
    
                $scope.formatTanggal = function (tanggal) {
                    return moment(tanggal).format('DD-MM-YYYY');
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
                 
                $scope.columnGrid = {
                    toolbar: [
                        "excel",
    
                    ],
                    excel: {
                        fileName: "Daftar Registrasi Pasien.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 4;
                        sheet.mergedCells = ["A1:M1"];
                        sheet.name = "Report";
    
                        var myHeaders = [{
                            value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                            // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                            fontSize: 18,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];
    
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    selectable: 'row',
                    pageable: true,
                  columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "20px",
                            // "template": "<span class='style-center'>#: namaruangan #</span>",
                        },
                        {
                            "field": "noregistrasi",
                            "title": "Noregistrasi",
                            "width": "50px",
                            "template": "<span class='style-center'>#: noregistrasi #</span>",
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Registrasi",
                            "width": "50px",
                            "template": "<span class='style-center'>#: tglregistrasi #</span>",
                        },
                        {
                            "field": "nocm",
                            "title": "No RM",
                            "width": "50px",
                            "template": "<span class='style-center'>#: nocm #</span>",
                        },
                        {
                            "field": "namapasien",
                            "title": "Nama Pasien",
                            "width": "80px",
                            "template": "<span class='style-center'>#: namapasien #</span>",
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "60px",
                            "template": "<span class='style-center'>#: namaruangan #</span>",
                        },
                        {
                            "field": "namadokter",
                            "title": "Dokter",
                            "width": "60px",
                            "template": "<span class='style-center'>#: namadokter #</span>",
                        },
                        {
                            "field": "kelompokpasien",
                            "title": "Kelompok Pasien",
                            "width": "50px",
                            "template": "<span class='style-center'>#: kelompokpasien #</span>",
                        },
                        {
                            "field": "namarekanan",
                            "title": "Penjamin",
                            "width": "50px",
                            "template": "<span class='style-center'>#: namarekanan #</span>",
                        },
                        {
                            "field": "nosep",
                            "title": "No SEP",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: nosep #</span>",
							"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        },
						{
							"field": "statuspulang",
							"title": "Status Pulang",
							"width": "40px",
							"template": '# if( statuspulang==null) {# - # } else {# #= statuspulang # #} #'
						},
						{
							 "field": "response",
							 "title": "Ketetrangan Antrol",
							 "width": "150px",
							 "template": '# if( response==null || response=="") {# - # } else {# #= response # #} #'
						 },
						 {
							 "field": "responselast",
							 "title": "Task Id Terakhir",
							 "width": "50px",
							 "template": '# if( response==null || response=="") {# - # } else {# #= responselast # #} #'
						 },
						 {
							"field": "asalsep",
							"title": "Asal SEP",
							"width": "50px",
						}                      
                    ]                   
                };
                
    //////////////////////////////////////////////////////////////      BATAS SUCI            /////////////////////////////////////////////////////////////////////////////////////       
            }
        ]);
    });