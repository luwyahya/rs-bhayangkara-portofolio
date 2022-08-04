define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSummaryCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }



                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-lap-summary?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId).then(function (data) {
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
                               if(element.namaruangan == element1.namaruangan && element.kelompokpasien == element1.kelompokpasien){
                                    
                                    // $scope.totallaki= $scope.totallaki + parseFloat(group[x].laki)
                                    // $scope.totalwanita= $scope.totalwanita + parseFloat(group[x].wanita)
                                    // $scope.totalbaru= $scope.totalbaru + parseFloat(group[x].baru)
                                    // $scope.totallama= $scope.totallama + parseFloat(group[x].lama)
                                    // $scope.totaljumlah = $scope.totaljumlah + parseFloat(group[x].jumlah)

                                    element.laki = parseFloat(element.laki) + parseFloat(element1.laki)
                                    element.wanita = parseFloat(element.wanita) + parseFloat(element1.wanita)        
                                    element.baru = parseFloat(element.baru) + parseFloat(element1.baru)       
                                    element.lama = parseFloat(element.lama) + parseFloat(element1.lama)
                                    // element.jumlah = parseFloat(element.laki) + parseFloat(element.wanita)
                                    // element.total = parseFloat(element.jumlah) + parseFloat(element1.jumlah)  
                                    podo = true  
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    namaruangan: element1.namaruangan,
                                    wanita: element1.wanita,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.laki) + parseFloat(elemn.wanita)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGrid ={
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: 
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {   
                                        namaruangan: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                            group: [
                                {
                                    field: "namaruangan", aggregates: [
                                        { field: 'laki', aggregate: 'sum' },
                                        { field: "wanita", aggregate: 'sum' },
                                        { field: "baru", aggregate: 'sum' },
                                        { field: "lama", aggregate: 'sum' },
                                        { field: "jumlah", aggregate: 'sum'},
                                    ]
                                },
                            ],
                            aggregate: [
                                { field: 'laki', aggregate: 'sum' },
                                { field: "wanita", aggregate: 'sum' },
                                { field: 'baru', aggregate: 'sum' },
                                { field: "lama", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum'},
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
            $scope.columnGrid = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Buku SUMMARY Register Pendaftaran Rawat Jalan.xlsx",
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
                        cells: [{ value: "Buku SUMMARY Register Pendaftaran Rawat Jalan", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "kelompokpasien",
                        "title": "Jenis Pasien",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",

                        "columns":
                        [{
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            aggregates: ["sum"],        
                             groupFooterTemplate: "#=data.laki.sum  #",
                            footerTemplate: "#:data.laki.sum  #"
                            
                        }, {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.wanita.sum  #",
                            footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },

                    {
                        "title": "Kunjungan",
                        "width": "200px",
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.baru.sum  #",
                            footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.lama.sum  #",
                            footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, {
                        "field": "jumlah",
                        "title": "Jumlah Kunjungan",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                         footerTemplate: "#:data.jumlah.sum  #"

                     },
                      {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "   #= value #    "
                }

                ]
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