define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKegiatanCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;

            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }


            loadData()
            function loadData() {
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                medifirstService.get("registrasi/laporan/get-data-lap-kegiatan-rj?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data =data.data
                        var group =  []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.poli == element1.poli && element.namalengkap == element1.namalengkap){
                                    element.lama = parseFloat(element.lama) + parseFloat(element1.lama)
                                    element.baru = parseFloat(element.baru) + parseFloat(element1.baru)
                                    
                                    podo = true   
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    poli: element1.poli,
                                    namalengkap: element1.namalengkap,
                                    lama: element1.lama,
                                    baru: element1.baru,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.lama) + parseFloat(elemn.baru)
                        }   


                        $scope.dataSourceGrid ={
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: 
                            {
                                model: {
                                    fields: {   
                                        poli: { type: "string" },
                                        lama: { type: "number" },
                                        baru: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,

                            group: [
                                {
                                    field: "poli", aggregates:[
                                        { field: 'lama', aggregate: 'sum' },
                                        { field: 'baru', aggregate: 'sum' },
                                        { field: 'jumlah', aggregate: 'sum' },
                                    ]
                                },
                            ],

                            aggregate: [
                                { field: 'poli', aggregate: 'sum' },
                                { field: 'lama', aggregate: 'sum' },
                                { field: 'baru', aggregate: 'sum' },
                                { field: 'jumlah', aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                }

            $scope.columnGrid = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kegiatan Instalasi Rawat Jalan.xlsx",
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
                        cells: [{ value: "Laporan Kegiatan Instalasi Rawat Jalan", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "200px"
                    },
                    {
                        "title": "Poli",
                        "width": "200px",

                        "columns":
                        [
                            {
                                "field" : "baru",
                                "title" : "Baru"
                                
                            }, {
                                "field" : "lama",
                                "title" : "Lama"
                            }
                        ],

                    },
                     {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px"
                     },
                     {
                    hidden: true,
                    field: "poli",
                    title: "Poli",
                    aggregates: ["count"],
                    groupHeaderTemplate: "   #= value #    "
                }



                ]
            }

           

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            // $scope.formatJam = function (tanggal) {
            //     return moment(tanggal).format('HH:mm');
            // }
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })

        }
    ]);
}); 