define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanDetailPenerimaanKasirCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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

            $scope.selectRuanganPelayanan = {                
                dataTextField: "namaruangan",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.selectedRuanganPelayanan = []
            function LoadDataCombo(){
                $scope.isRouteLoading = true;
                medifirstService.get("bendaharapenerimaan/get-data-combo", true).then(function (dat) {                                  
                    var dat = dat.data;                  
                    $scope.isRouteLoading = false;
                    $scope.listRuangan = dat.ruangan;                                                        
                });
            }

            $scope.ClearData = function(){
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');//new Date();
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');//new Date();
                $scope.selectedRuanganPelayanan = [];
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data:[],                    
                });
            }
            
            $scope.SearchData = function(){
                $scope.isRouteLoading = true;
                getDataPendapatanInstalasi()
            }
            
            function getDataPendapatanInstalasi(){  
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var listRuangan = ""
                if ($scope.selectedRuanganPelayanan.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedRuanganPelayanan.length - 1; i >= 0; i--) {
                        var c = $scope.selectedRuanganPelayanan[i].id
                        b = "," + c
                        a = a + b
                    }
                    listRuangan = a.slice(1, a.length)
                }                              
                medifirstService.get("bendaharapenerimaan/get-data-laporan-penerimaan-detail?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir                    
                    + '&idRuangan=' + listRuangan
                    ,true).then(function (dat) {                                              
                    var datas = dat.data;
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
                excel: { fileName: "laporanpendetailpenerimaan.xlsx", allPages: true, },                
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
                        field: "tglsbm",
                        title: "Tanggal SBM",
                        width: "100px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglsbm #')}}</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "100px",                                     
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien / Klien",
                        width: "140px",                                     
                    },  
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "140px",                                                        
                    },                    
                    {
                        field: "penerimaankasir",
                        title: "Jenis Penerimaan",
                        width: "140px",  
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
            //** BATAS SUCI */
        }
    ]);
});