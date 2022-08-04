define(['initialize'], function (initialize) {
'use strict';
    initialize.controller('LaporanPendapatanPelayananDiklitbangCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();   
            function FormLoad(){
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {}; 
                LoadCombo();
                LoadDataGrid();
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("kasir/get-data-combo-kasir").then(function (data) {  
                        $scope.listKelompokTransaksi = data.data.kelompoktransaksi
                        var h=''
                });
            }
                 
            $scope.SearchData = function () {            
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var kelompokTransaksi = $scope.item.kelompokTransaksi.kelompoktransaksi;          

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: kelompokTransaksi                     
                }
                cacheHelper.set('LaporanPendapatanPelayananDiklitbangCtrl', chacePeriode);
                medifirstService.get("kasir/get-data-lap-non-layanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kelompokTransaksi=" + kelompokTransaksi).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                                                
                    }
                    $scope.dataLaporan = new kendo.data.DataSource({                            
                        data: data.data,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: { 
                                fields: {
                                    totalharusdibayar: {type: "number"},
                                    jasa: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "totalharusdibayar", aggregate:"sum"},
                            {field: "jasa", aggregate:"sum"},
                        ]
                    });
                })             
            }

            $scope.ClearData = function (){
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined;
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.kelompokTransaksi = undefined;
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function LoadDataGrid() {                 
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var kelompokTransaksi = ""

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: kelompokTransaksi                     
                }
                cacheHelper.set('LaporanPendapatanPelayananDiklitbangCtrl', chacePeriode);
                medifirstService.get("kasir/get-data-lap-non-layanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kelompokTransaksi=" + kelompokTransaksi).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                                                
                    }
                    $scope.dataLaporan = new kendo.data.DataSource({                            
                        data: data.data,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: { 
                                fields: {
                                    totalharusdibayar: {type: "number"},
                                    jasa: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "totalharusdibayar", aggregate:"sum"},
                            {field: "jasa", aggregate:"sum"},
                        ]
                    });
                })
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            // $scope.aggregate = [
            //     {
            //         field: "totalharusdibayar",
            //         aggregate: "sum"
            //     },
            //     {
            //         field: "jasa",
            //         aggregate: "sum"
            //     }
            // ]



            $scope.columnLaporan = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "Rekapitulasi Pendapatan Pelayanan SUB BAG DIKLITBANG.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekapitulasi Pendapatan Pelayanan SUB BAG DIKLITBANG",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [  

                    { "field": "no", "title": "No", "width": "45px",footerTemplate: "Total" },
                    {
                        "field": "tglstruk",
                        "title": "Tanggal",
                        "width": "105px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglstruk #')}}</span>",
                        
                    },
                    {
                        "field": "jenistagihan",
                        "title": "Kelompok Transaksi",
                        "width": "150px"                    
                    },
                    {
                        "field": "namapasien_klien",
                        "title": "Pelayanan Diklat",
                        "width": "150px"                    
                    },
                    {
                        "field": "totalharusdibayar",
                        "title": "Jumlah",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
                         aggregates: ["sum"],
                        footerTemplate: "#: data.totalharusdibayar.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalharusdibayar.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "jasa",
                        "title": "Jasa Pelayanan",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasa #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jasa.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasa.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }                  
                ] 
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});