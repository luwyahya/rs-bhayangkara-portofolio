define(['initialize'], function(initialize) {
    'use strict';
        initialize.controller('LaporanTriaseIgdCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService','CacheHelper',
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
                $scope.listStatus = [{ id: 1, status: 'BARU' }, { id: 2, status: 'LAMA' }]
                FormLoad();             
    
                $scope.showAndHide = function () {
                    $('#contentPencarian').fadeToggle("fast", "linear");
                }
    
                
    
                function init() {
                    $scope.isRouteLoading = true;
                   
                    var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');                   
                    medifirstService.get("registrasi/laporan/get-laporan-sudah-isi-triase-igd?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir, true).then(function (data) {                            
                            $scope.isRouteLoading = false;
                            var data2 =  data.data.data
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                schema: {
                                    model: {
                                       
                                    }
                                },
                                pageSize: 200,
                                total: data.data.data.length,
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
                    cacheHelper.set('LaporanTriaseIgdCtrl', chacePeriode);
    
    
                }
    
                function FormLoad(){                
                   $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                   $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
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
                        fileName: "Laporan Data Sudah isi Triase IGD.xlsx",
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
                            "field": "namaruangan",
                            "title": "Nama Ruangan",
                            "width": "100px",
                            // "template": "<span class='style-center'>#: namaruangan #</span>",
                        },                        
                        {
                            "field": "jumlahisi",
                            "title": "Jumlah Yang Sudah Di isi",
                            "width": "50px",
                            "template": "<span class='style-center'>#: jumlahisi #</span>",
                        },
                        {
                            "field": "jumlahkunjungan",
                            "title": "Jumlah Kunjungan",
                            "width": "50px",
                            "template": "<span class='style-center'>#: jumlahkunjungan #</span>",
                        }
                      
                    ]                   
                };
                
    //////////////////////////////////////////////////////////////      BATAS SUCI            /////////////////////////////////////////////////////////////////////////////////////       
            }
        ]);
    });