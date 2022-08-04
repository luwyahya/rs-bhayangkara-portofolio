define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPendapatanRumahSakitCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function (cacheHelper, $q, $rootScope, $scope, DateHelper, $http, $state, medifirstService) {
            //Inisial Variable
            $scope.isRouteLoading = false;     
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');//new Date();
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');//new Date();
            $scope.nonbpjs = { id: 153, kelompokpasien: "Non BPJS" };
            LoadDataCombo();

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            function LoadDataCombo(){
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/get-combo-detail-regis", true).then(function (dat) {                                  
                    var dat = dat.data;                  
                    $scope.isRouteLoading = false;
                    $scope.listDepartemen = dat.departemen;
                    $scope.listKelompokPasien = dat.kelompokpasien;     
                    $scope.listKelompokPasien.push($scope.nonbpjs);                                           
                });
            }

            $scope.getIsiComboRuangan = function(){                
				$scope.listRuangan = $scope.item.departement.ruangan;
            }

            $scope.ClearData = function(){
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');//new Date();
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');//new Date();
                $scope.item.departement = undefined;
                $scope.item.ruangan = undefined;
                $scope.item.kelompokPasien = undefined;
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data:[],                    
                });
            }
            
            $scope.SearchData = function(){
                $scope.isRouteLoading = true;
                getDataPendapatanInstalasi();
                getDataPendapatanPasien();
            }
            
            function getDataPendapatanInstalasi(){  
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempDeptId = "";
                if ($scope.item.departement != undefined) {
                    tempDeptId = "&idDept=" + $scope.item.departement.id;
                }                         
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempKelompokPasien = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasien = "&idKelompokPasien=" + $scope.item.kelompokPasien.id;
                }                                  
                medifirstService.get("tatarekening/get-laporan-pendapatan-instalasi?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir                    
                    + tempRuanganId + tempDeptId + tempKelompokPasien, true).then(function (dat) {                                              
                    var datas = dat.data.data;
                    $scope.isRouteLoading = false;
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({                            
                        data: datas,
                        // group: $scope.group,
                        pageSize: 50,
                        total: dat.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    total: { type: "number" }                                      
                                }
                            }
                        },
                        aggregate: [
                            { field: 'total', aggregate: 'sum' },            
                        ]                
                    });                                                     
                });
            }

            function getDataPendapatanPasien(){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempDeptId = "";
                if ($scope.item.departement != undefined) {
                    tempDeptId = "&idDept=" + $scope.item.departement.id;
                }                         
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempKelompokPasien = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasien = "&idKelompokPasien=" + $scope.item.kelompokPasien.id;
                }                                  
                medifirstService.get("tatarekening/get-laporan-pendapatan-perpasien?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir                    
                    + tempRuanganId + tempDeptId + tempKelompokPasien, true).then(function (dat) {                                              
                    var datas = dat.data.data;
                    $scope.isRouteLoading = false;
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                    }
                    $scope.sourceLaporanPP = new kendo.data.DataSource({                            
                        data: datas,
                        // group: $scope.group,
                        pageSize: 50,
                        total: dat.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    total: { type: "number" }                                      
                                }
                            }
                        },
                        aggregate: [
                            { field: 'total', aggregate: 'sum' },            
                        ]                
                    });                                                     
                });
            }

            $scope.aggregate = [                         
                {
                    field: "total",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporan = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "laporanpendapatanperinstalasi.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";
                    var myHeaders = [{
                        value: "Laporan Pendapatan Perinstalasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [
                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglpencarian",
                        title: "Tanggal",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpencarian #')}}</span>"
                    },
                    {
                        field: "namadepartemen",
                        title: "Instalasi",
                        width: "120px",                                     
                    },  
                    {
                        field: "layanan",
                        title: "Jenis Layanan",
                        width: "100px",                                                        
                    },                    
                    {
                        field: "kelompokpasien",
                        title: "Kelompok Pasien",
                        width: "100px",  
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"                                   
                    },  
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",  
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                        footerAttributes: {style: "text-align: right;"}                               
                    }                   
                ] 
            }
            
            $scope.aggregates = [                         
                {
                    field: "total",
                    aggregates: "sum"
                }
            ]
            $scope.columnLaporanPP = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "laporanpendapatanperpasien.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";
                    var myHeaders = [{
                        value: "Laporan Pendapatan Perpasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [
                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglpencarian",
                        title: "Tanggal",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpencarian #')}}</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",                                     
                    },
                    {
                        field: "nocm",
                        title: "No Rm",
                        width: "100px",                                     
                    }, 
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "100px",                                     
                    }, 
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "120px",                                     
                    }, 
                    {
                        field: "namadepartemen",
                        title: "Departemen",
                        width: "120px",                                     
                    },  
                    {
                        field: "layanan",
                        title: "Jenis Layanan",
                        width: "100px",                                                        
                    },                    
                    {
                        field: "kelompokpasien",
                        title: "Kelompok Pasien",
                        width: "100px",  
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"                                   
                    },  
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",  
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregate: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                        footerAttributes: {style: "text-align: right;"}                               
                    }                                       
                ] 
            }
            //** BATAS SUCI */
        }
    ]);
});