define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapPendapatanDiklitbangCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};


            function LoadCombo(){
                $scope.item.tahun =  moment($scope.now).format('YYYY');
            }
            LoadData()
            LoadCombo()
            $scope.SearchData = function () {
                LoadData()
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
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

            medifirstService.get("kasir/get-data-rekap-diklat?"
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



            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pendidikan.xlsx",
                    allPages: true,

                },

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

                    { "field": "no", "title": "No", "width": "100px",footerTemplate: "Total" },
                    {
                        "field": "jenistagihan",
                        "title": "Jenis Pelayanan",
                    },
                    {
                        "field": "bulanku",
                        "title": "Bulan",
                    },
                    {
                        "field": "total",
                        "title": "Jumlah",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }                  
                ] 
            }
            
            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


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