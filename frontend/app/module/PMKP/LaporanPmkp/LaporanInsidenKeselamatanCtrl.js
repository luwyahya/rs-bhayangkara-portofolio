define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanInsidenKeselamatanCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            ComboLoad();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('LaporanInsidenKeselamatanCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                }
                else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }

            function ComboLoad() {            
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listdataRuangan = data;
                });
            }                  

            function init() {
                $scope.isRouteLoading = true;                
                var rg = ""
                if ($scope.item.dataRuangan != undefined) {
                    var rg = "&idRuangan=" + $scope.item.dataRuangan.id
                }                
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                medifirstService.get("pmkp/get-data-laporan-sensus-keselamatan-pasien?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + rg, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 10,
                            total: datas.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });                        
                        pegawaiUser = dat.data.datalogin.userData
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
                cacheHelper.set('LaporanInsidenKeselamatanCtrl', chacePeriode);
            }
            
            $scope.cariFilter = function () {
                init();
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.group = {
                field: "bulan",
                aggregates: [{
                    field: "bulan",
                    aggregate: "count"
                }, {
                    field: "bulan",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "bulan",
                aggregate: "count"
            }, {
                field: "bulan",
                aggregate: "count"
            }]
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanSensusKeselamatanBulan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Sensus Bulanan Keselamatan Pasien",
                        fontSize: 20,
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
                        "width": "45px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama",
                        "width": "100px",                        
                    },
                    {
                        "field": "tglinsiden",
                        "title": "Kejadian",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglinsiden #', '')}}</span>"                        
                    },
                    {
                        "field": "noregistrasi",
                        "title": "Registrasi",
                        "width": "100px",
                    },                    
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px",
                    },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "100px",
                    },
                    {
                        "field": "sentinel",
                        "title": "Sentinel",
                        "width": "70px",
                    },
                    {
                        "field": "ktd",
                        "title": "KTD",
                        "width": "70px",
                    },
                    {
                        "field": "ktc",
                        "title": "KTC",
                        "width": "70px",                        
                    },
                    {
                        "field": "knc",
                        "title": "KNC",
                        "width": "70px",                        
                    },
                    {
                        "field": "kpc",
                        "title": "KPC",
                        "width": "70px",                        
                    },
                    {
                        "field": "regrading",
                        "title": "Grading",
                        "width": "100px",                        
                    },
                    {
                        hidden: true,
                        field: "bulan",
                        title: "bulan",
                        aggregates: ["count"],
                        // groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    }
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatNumber = function (value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
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

            $scope.Cetak = function(){
                $scope.pegawai = medifirstService.getPegawai();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                var rg = ""
                if ($scope.item.dataRuangan != undefined) {
                    var rg = $scope.item.dataRuangan.id
                }  
                var stt = 'false'
                if (confirm('View Laporan Sensus Keselamatan Pasien Bulanan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-sensus-keselamatan-bulanan&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + rg  + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.CetakTahunan = function(){
                $scope.pegawai = medifirstService.getPegawai();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                var rg = ""
                if ($scope.item.dataRuangan != undefined) {
                    var rg = $scope.item.dataRuangan.id
                }  
                var stt = 'false'
                if (confirm('View Laporan Sensus Keselamatan Pasien Bulanan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-sensus-keselamatan-tahunan&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + rg  + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.CetakHarian = function(){
                $scope.pegawai = medifirstService.getPegawai();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                var rg = ""
                if ($scope.item.dataRuangan != undefined) {
                    var rg = $scope.item.dataRuangan.id
                }  
                var stt = 'false'
                if (confirm('View Laporan Sensus Keselamatan Pasien Harian? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-sensus-keselamatan-Harian&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + rg  + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            //***********************************
        }
    ]);
});
