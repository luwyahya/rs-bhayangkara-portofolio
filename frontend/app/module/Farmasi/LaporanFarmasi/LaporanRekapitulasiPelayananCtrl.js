define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapitulasiPelayananCtrl', ['$scope', 'CacheHelper', 'MedifirstService', 'DateHelper', 
        function ($scope, cacheHelper, medifirstService, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}            
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarReturObatCtrl');
                if (chacePeriode != undefined) {                    
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                } else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
                    init();
                }
            }

            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listRuanganDepo = dat.data.ruanganfarmasi;
                });

                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                 
                var farmasi = ""
                if ($scope.item.ruanganDepo != undefined) {
                    var farmasi = "&IdFarmasi=" + $scope.item.ruanganDepo.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                
                medifirstService.get("farmasi/get-laporan-rekapitulasi-pelayanan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + farmasi 
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var result = dat.data.daftar;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: result,
                            
                            pageSize: 200
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
                cacheHelper.set('LaporanPenyerahanObatCtrl', chacePeriode);
            }           
            
            $scope.cariFilter = function () {
                init();
            }            
            
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {fileName: "LaporanPenyerahanObat.xlsx",allPages: true},
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Penyerahan Obat",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: false,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kategori",
                        "width": "350px",
                    },
                    {
                        "title": "Jumlah",
                        "width": "50px",
                        "columns":[{
                                "field": "jumlahresep",
                                "title": "Lembar"
                            },
                            {
                                "field": "jumlahRke",
                                "title": "R/"
                            }

                        ],
                    }  
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
                    
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
           //** BATAS SUCI */
        }
    ]);
});
