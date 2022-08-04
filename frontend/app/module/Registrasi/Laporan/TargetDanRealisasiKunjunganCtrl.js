define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TargetDanRealisasiKunjunganCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                 medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganrajal
                    })

                    medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;
                var tahun = moment($scope.item.tahun).format('YYYY');


                var chacePeriode = {
                    0: tahun,

                }
                cacheHelper.set('TargetDanRealisasiKunjunganCtrl', chacePeriode);


                    medifirstService.get("registrasi/laporan/get-data-lap-target-realisasi?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridP ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                        ]


                        }
                        // $scope.isRouteLoading = false;
                    })




            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    }]
            };


            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pendidikan.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pendidikan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "namaruangan",
                        "title": "Poliklinik",
                        "width": "200px"
                    },
                    {
                        "title": "Realisasi",
                        "width": "200px",

                        "columns":
                        [{
                            "field" : "Januari",
                            "title" : "Januari",
                        },
                        {
                            "field" : "Februari",
                            "title" : "Februari",
                        },
                        {
                            "field" : "Maret",
                            "title" : "Maret",
                        },
                        {
                            "field" : "April",
                            "title" : "April",
                        },
                        {
                            "field" : "Mei",
                            "title" : "Mei",
                        },
                        {
                            "field" : "",
                            "title" : "Juni",
                        },
                        {
                            "field" : "Juli",
                            "title" : "Juli",
                        },
                        {
                            "field" : "Agustus",
                            "title" : "Agustus",
                        },
                        {
                            "field" : "September",
                            "title" : "September",
                        },
                        {
                            "field" : "Oktober",
                            "title" : "Oktober",
                        },
                        {
                            "field" : "November",
                            "title" : "November",
                        },
                        {
                            "field" : "Desember",
                            "title" : "Desember",
                        }
                        ],

                    }

                ]
            }


            $scope.aggregate = [
                {
                    field: "jumlah",
                    aggregate: "sum"
                }
            ]




            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.$watch('cari.tahun', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    newVal = moment(newVal).format('YYYY')
                    oldVal = moment(oldVal).format('YYYY')
                    if (newVal != oldVal) {
                        applyFilter("tahuns", newVal)
                    }
                }, 500)
            })



            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


        }
    ]);
});