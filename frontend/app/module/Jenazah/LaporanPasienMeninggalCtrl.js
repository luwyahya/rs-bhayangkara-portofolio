define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPasienMeninggalCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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
                        $scope.listRuangans=data.data.ruanganrajal;
                    })

                    medifirstService.get("registrasi/get-data-combo-new", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listJenisPelayanan = data.data.jenispelayanan;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;
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

                var tempJenPelId = "";
                if ($scope.item.jenisPelayanan != undefined) {
                    tempJenPelId = "&jenisPelayanan=" + $scope.item.jenisPelayanan.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

             medifirstService.get("jenazah/get-lap-pasien-meninggal?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        var data =data.data
                        var length = data.data.length
                        var group =  []
                        var podo = false
                        for (var i = 0; i < length; i++) {
                            var element1 = data.data[i]
                            podo = false
                            if(podo== false){
                                var datass ={
                                    kddiagnosa: element1.kddiagnosa,
                                    tglmeninggal: element1.tglmeninggal,
                                    namaruangan: element1.namaruangan,
                                    namapasien: element1.namapasien,
                                    nocm: element1.nocm,
                                    umur: element1.umur,
                                    kondisipasien: element1.kondisipasien,
                                    jeniskelamin: element1.jeniskelamin
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            // elemn.jumlah = parseFloat(elemn.laki) + parseFloat(elemn.wanita)
                            // elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridK ={
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
                                        kddiagnosa: { type: "string" },
                                        tglmeninggal: { type: "string" },
                                        namaruangan: { type: "string" },
                                        namapasien: { type: "string" },
                                        nocm: { type: "string" },
                                        umur: { type: "number" },
                                        kondisipasien: { type: "string" },
                                        jeniskelamin: { type: "string"},
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                            // group: [
                            //     {
                            //         field: "namaruangan", aggregates: [
                            //             { field: 'laki', aggregate: 'sum' },
                            //             { field: "wanita", aggregate: 'sum' },
                            //             { field: "baru", aggregate: 'sum' },
                            //             { field: "lama", aggregate: 'sum' },
                            //             { field: "tunai", aggregate: 'sum' },
                            //             { field: "bpjs", aggregate: 'sum' },
                            //             { field: "jamsostek", aggregate: 'sum' },
                            //             { field: "swasta", aggregate: 'sum' },
                            //             { field: "hardient", aggregate: 'sum' },
                            //             { field: "iks", aggregate: 'sum' },
                            //             { field: "thamrin", aggregate: 'sum' },
                            //             { field: "jamkesda", aggregate: 'sum' },
                            //             { field: "jamkesmas", aggregate: 'sum' },
                            //             { field: "skmm", aggregate: 'sum' },
                            //             { field: "karyawan", aggregate: 'sum' },
                            //         ]
                            //     },
                            // ],
                            // aggregate: [
                            //     { field: 'laki', aggregate: 'sum' },
                            //            { field: "wanita", aggregate: 'sum' },
                            //             { field: "baru", aggregate: 'sum' },
                            //             { field: "lama", aggregate: 'sum' },
                            //             { field: "tunai", aggregate: 'sum' },
                            //             { field: "bpjs", aggregate: 'sum' },
                            //             { field: "jamsostek", aggregate: 'sum' },
                            //             { field: "swasta", aggregate: 'sum' },
                            //             { field: "hardient", aggregate: 'sum' },
                            //             { field: "iks", aggregate: 'sum' },
                            //             { field: "thamrin", aggregate: 'sum' },
                            //             { field: "jamkesda", aggregate: 'sum' },
                            //             { field: "jamkesmas", aggregate: 'sum' },
                            //             { field: "skmm", aggregate: 'sum' },
                            //             { field: "karyawan", aggregate: 'sum' },
                            // ]


                        }
                        // $scope.isRouteLoading = false;
                    })

            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            // $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };
            $scope.columnGridK = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Pasien DPJP.xlsx",
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
                        cells: [{ value: "Laporan Pasien DPJP", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",
                        
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "kondisipasien",
                        "title": "Keterangan",
                        "width": "75px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "jeniskelamin",
                        "title": "JK",
                        "width": "60px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "umur",
                        "title": "Umur",
                        "width": "30px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "tglmeninggal",
                        "title": "Tgl Keluar",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "kddiagnosa",
                        "title": "Diagnosa",
                        "width": "70px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                    //  {
                    //     "field": "terataiatas",
                    //     "title": "Teratai Atas",
                    //     "width": "100px",
                    //     // groupFooterTemplate: "#=data.tunai.sum  #",
                    //     //  footerTemplate: "#:data.tunai.sum  #"

                    //  },
                    //  {
                    //     "field": "terataibawah",
                    //     "title": "Teratai Bawah",
                    //     "width": "120px",
                    //     // groupFooterTemplate: "#=data.tunai.sum  #",
                    //     //  footerTemplate: "#:data.tunai.sum  #"

                    //  },
                    //  {
                    //     "field": "flamboyan",
                    //     "title": "Flamboyan Covid",
                    //     "width": "150px",
                    //     // groupFooterTemplate: "#=data.tunai.sum  #",
                    //     //  footerTemplate: "#:data.tunai.sum  #"

                    //  }

                //     {
                //     hidden: true,
                //     field: "namaruangan",
                //     title: "Nama Ruangan",
                //     aggregates: ["count"],
                //     groupHeaderTemplate: "   #= value #    "
                // }

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