define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPenyerahanObatCtrl', ['$scope', 'CacheHelper', 'MedifirstService', 'DateHelper', 
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
                
                var jeniskemasan = ""
                if ($scope.item.jenisKemasan != undefined) {
                    var jeniskemasan = "&jeniskemasan=" + $scope.item.jenisKemasan.id
                }

                var farmasi = ""
                if ($scope.item.ruanganDepo != undefined) {
                    var farmasi = "&IdFarmasi=" + $scope.item.ruanganDepo.id
                }  

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                
                medifirstService.get("farmasi/get-laporan-penyerahan-obat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + farmasi + jeniskemasan
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            if (dat.data.daftar[i].tglambilorder == null){
                                dat.data.daftar[i].durasi = ""
                            }
                            else{
                                var tglambilorder = new Date(dat.data.daftar[i].tglambilorder)
                                var tglverifikasi = new Date(dat.data.daftar[i].tglverifikasi) 
                                //var durasi = dateHelper.CountAge(tglambilorder, tglverifikasi)
                                //var durasi = moment.utc(moment(tglambilorder).diff(moment(tglverifikasi))).format("HH:mm:ss")
                                var diff = Math.abs(tglambilorder - tglverifikasi)
                                var durasi = Math.round((diff/1000)/60)
                                //dat.data.daftar[i].durasi = durasi.year + " tahun " + durasi.month + " bulan " + durasi.day + " hari "     
                                dat.data.daftar[i].durasi = durasi    
                            
                            }
                            dat.data.daftar[i].no = i + 1                          
                        }
                        $scope.dataGrid = dat.data.daftar;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            schema: {
                                model: {
                                    fields: {
                                        durasi: {type: "number"}
                                    }
                                }
                            },
                            pageSize: 200,
                            // group: [{
                            //     field: "durasi", aggregate: 'average'
                            // }],
                            aggregate: [{
                                field: "durasi", aggregate: 'average'
                            }]
                        });
                        pegawaiUser = dat.data.datalogin
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
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "25px",
                    },
                    {
                        "field": "noantri",
                        "title": "No Antrian",
                        "width": "50px",
                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                    },
                    {
                        "field": "namaruanganapotik",
                        "title": "Apotik",
                        "width": "50px",
                    },
                    {
                        "field": "tglverifikasi",
                        "title": "Waktu Selesai Skrining Resep",
                        "width": "120px",
                    },
                    {
                        "field": "tglambilorder",
                        "title": "Waktu Penyerahan Obat",
                        "width": "100px",
                        footerTemplate: "Rata-rata"
                    },
                    {
                        "field": "durasi",
                        "title": "Durasi (menit)",
                        "width": "80px",
                        aggregates: ["average"],
                        footerTemplate: "<span class='style-left'> #= kendo.toString(data.durasi.average, '0.00')# menit"
                    },
                    {
                        "field": "keterangankeperluan",
                        "title": "Keterangan",
                        "width": "50px",
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
