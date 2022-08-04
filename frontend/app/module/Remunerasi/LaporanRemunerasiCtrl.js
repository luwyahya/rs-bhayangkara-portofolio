define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRemunerasiCtrl', ['CacheHelper',  '$scope', 'MedifirstService',
        function (cacheHelper, $scope, medifirstService) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemR = {};
            $scope.itemDR = {};
            $scope.itemEmpat = {};
            $scope.isRouteLoading = false;
            var judul = "Detail Remunerasi.xlsx";
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarianSatu').fadeToggle("fast", "linear");
            }

            $scope.showAndHideDua = function () {
                $('#contentPencarianDua').fadeToggle("fast", "linear");
            }

            $scope.showAndHideTiga = function () {
                $('#contentPencarianTiga').fadeToggle("fast", "linear");
            }

            $scope.showAndHideEmpat = function () {
                $('#contentPencarianEmpat').fadeToggle("fast", "linear");
            }


            function LoadCombo() {
                medifirstService.get("remunerasi/get-data-combo-laporan", true).then(function (dat) {
                    var dat = dat.data
                    $scope.listDokter = dat.dokter;
                    $scope.listDepartemen = dat.departemen;
                    $scope.listPasien = dat.kelompokpasien;
                    $scope.namaLengkap = dat.user.namalengkap;
                });
            }


            function FormLoad() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemDR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemDR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemEmpat.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemEmpat.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.getIsiComboRuangan = function () {
                if ($scope.item.departement != undefined) {
                    $scope.listRuangan = $scope.item.departement.ruangan
                } else if ($scope.itemDR.departement != undefined) {
                    $scope.listRuangan = $scope.itemDR.departement.ruangan
                } else if ($scope.itemEmpat.departement != undefined) {
                    $scope.listRuangan = $scope.itemEmpat.departement.ruangan
                }
            }

            $scope.SearchData = function () {
                LoadDataDetail()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.listRuangan = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.SearchDataDua = function () {
                LoadDataRekap();
            }

            $scope.ClearDataDua = function () {
                $scope.itemR.NamaDokter = undefined
                $scope.itemR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.ClearDataEmpat = function () {
                $scope.itemEmpat.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemEmpat.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemEmpat.departement = undefined;
                $scope.itemEmpat.ruangan = undefined;
                $scope.listRuangan = undefined
            }

            $scope.ClearDataTiga = function () {
                $scope.itemDR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemDR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemDR.departement = undefined;
                $scope.itemDR.ruangan = undefined;
                $scope.listRuangan = undefined
            }

            $scope.SearchDataTiga = function () {
                LoadDataDetailDokter();
            }

            // LoadDataDetailDokter
            function LoadDataDetail() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                judul = "Detail Remunerasi.xlsx";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }


                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "&isExsekutif=" + true;
                } else {
                    isEksekutif = "&isExsekutif=" + false;
                }
                // var tempDokter = "";
                // if ($scope.item.NamaDokter != undefined) {
                //     tempDokter = "&IdDokter=" + $scope.item.NamaDokter.id;
                //     judul = "Detail Remunerasi "+ $scope.item.NamaDokter.namalengkap ;
                // }
                // var tempNoClosing = "";
                // if ($scope.item.noclosing != undefined) {
                //     tempNoClosing = "&noclosing=" + $scope.item.noclosing;
                // }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    // 6: $scope.item.ruangan.id,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-detail-laporan-remun?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + isEksekutif).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            // if(datas[i].isparamedis == "1"){
                            //     datas[i].statusparamedis = "✔"
                            // }else{
                            //     datas[i].statusparamedis = ""
                            // }
                            // if(datas[i].iscito == "1"){
                            //     datas[i].statuscito = "✔"
                            // }else{
                            //     datas[i].statuscito = ""
                            // }
                            // datas[i].Ruangan = datas[i].namaruangan
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        direksi: { type: "number" },
                                        struktural: { type: "number" },
                                        administrasi: { type: "number" },
                                        jpl: { type: "number" },
                                        jptl: { type: "number" },
                                        gabungan: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'direksi', aggregate: 'sum' },
                                { field: 'struktural', aggregate: 'sum' },
                                { field: 'administrasi', aggregate: 'sum' },
                                { field: 'jpl', aggregate: 'sum' },
                                { field: 'jptl', aggregate: 'sum' },
                                { field: 'gabungan', aggregate: 'sum' },
                            ]
                        });
                    })
            }



            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [

                {
                    field: "direksi",
                    aggregate: "sum"
                },
                {
                    field: "struktural",
                    aggregate: "sum"
                },
                {
                    field: "administrasi",
                    aggregate: "sum"
                },
                {
                    field: "jpl",
                    aggregate: "sum"
                },
                {
                    field: "jptl",
                    aggregate: "sum"
                },
                {
                    field: "gabungan",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "detaillaporanremunerasi.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
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

                    { field: "no", title: "No", width: "30px" },
                    // {
                    //     field: "tglpelayanan",
                    //     title: "Tanggal ",
                    //     width: "80px",
                    //     template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    // },
                    {
                        field: "namaruangan",
                        title: "Nama Unit",
                        width: "120px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    // {
                    //     field: "",
                    //     title: "Jasa RS",
                    //     width: "70px",
                    //     // template: "<span class='style-center'>#: noregistrasi #</span>"
                    // },
                    {
                        field: "direksi",
                        title: "DIREKSI",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: direksi #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.direksi.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.direksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "struktural",
                        title: "STRUKTURAL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: struktural #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.struktural.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.struktural.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "administrasi",
                        title: "ADMINISTRASI",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: administrasi #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.administrasi.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.administrasi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "jpl",
                        title: "JPL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: jpl #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jpl.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jpl.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "jptl",
                        title: "JPTL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: jptl #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jptl.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jptl.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "gabungan",
                        title: "GABUNGAN",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: gabungan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.gabungan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.gabungan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                    // {
                    //     field: "hargasatuan",
                    //     title: "Tarif Layanan",
                    //     width: "80px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                    //     // aggregates: ["sum"],
                    //     // footerTemplate: "#: data.hargasatuan.sum #",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                    //     // footerAttributes: {style: "text-align: right;"}

                    // },
                    // {
                    //     field: "jenispagunilai",
                    //     title: "Jasa Remun",
                    //     width: "100px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jenispagunilai.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     hidden: true,
                    //     field: "dokter",
                    //     title: "Nama Dokter",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Nama Dokter #= value #"
                    // },
                    // {
                    //     "command": [
                    //         {
                    //             text: "Detail",
                    //             click: detailfromgrid,
                    //             imageClass: "k-icon k-i-pencil"
                    //         }
                    //     ],
                    //     title: "",
                    //     width: "60px",
                    // }

                ]
            }


            function LoadDataRekap() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemR.tglakhir).format('YYYY-MM-DD HH:mm');;
                //

                // var tempDepartemenId = "";  
                // var tempDepartemenNm = "";   
                // judul =  "Detail Remunerasi.xlsx";           
                // if ($scope.item.departement != undefined) {
                //     tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                // }
                // var tempRuanganId = "";
                // if ($scope.item.ruangan != undefined) {
                //     tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                // }

                var tempDokter = "";
                if ($scope.itemR.NamaDokter != undefined) {
                    tempDokter = "&IdDokter=" + $scope.itemR.NamaDokter.id;
                    judul = "Detail Remunerasi " + $scope.itemR.NamaDokter.namalengkap;
                }


                var isEksekutif = ''
                if ($scope.itemR.isEksekutifR == true) {
                    isEksekutif = "&isExsekutif=" + true;
                } else {
                    isEksekutif = "&isExsekutif=" + false;
                }
                // var tempNoClosing = "";
                // if ($scope.item.noclosing != undefined) {
                //     tempNoClosing = "&noclosing=" + $scope.item.noclosing;
                // }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    // 6: $scope.item.ruangan.id,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-rekap-laporan-remun?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDokter + isEksekutif).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.sourceLaporanDua = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        direksi: { type: "number" },
                                        struktural: { type: "number" },
                                        administrasi: { type: "number" },
                                        jpl: { type: "number" },
                                        jptl: { type: "number" },
                                        gabungan: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'direksi', aggregate: 'sum' },
                                { field: 'struktural', aggregate: 'sum' },
                                { field: 'administrasi', aggregate: 'sum' },
                                { field: 'jpl', aggregate: 'sum' },
                                { field: 'jptl', aggregate: 'sum' },
                                { field: 'gabungan', aggregate: 'sum' },
                            ]
                        });
                    })
            }


              $scope.aggregate = [

                {
                    field: "direksi",
                    aggregate: "sum"
                },
                {
                    field: "struktural",
                    aggregate: "sum"
                },
                {
                    field: "administrasi",
                    aggregate: "sum"
                },
                {
                    field: "jpl",
                    aggregate: "sum"
                },
                {
                    field: "jptl",
                    aggregate: "sum"
                },
                {
                    field: "gabungan",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporanDua = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "rekaplaporanremunerasi.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
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

                    { field: "no", title: "No", width: "30px" },
                    {
                        field: "namalengkap",
                        title: "Nama Dokter",
                        width: "120px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    // {
                    //     field: "",
                    //     title: "Jasa RS",
                    //     width: "70px",
                    //     // template: "<span class='style-center'>#: noregistrasi #</span>"
                    // },
                     {
                        field: "direksi",
                        title: "DIREKSI",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: direksi #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.direksi.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.direksi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "struktural",
                        title: "STRUKTURAL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: struktural #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.struktural.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.struktural.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "administrasi",
                        title: "ADMINISTRASI",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: administrasi #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.administrasi.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.administrasi.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "jpl",
                        title: "JPL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: jpl #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jpl.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jpl.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "jptl",
                        title: "JPTL",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: jptl #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jptl.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jptl.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "gabungan",
                        title: "GABUNGAN",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: gabungan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.gabungan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.gabungan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            }

            function LoadDataDetailDokter() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemDR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemDR.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                judul = "Detail Remunerasi.xlsx";
                if ($scope.itemDR.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.itemDR.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemDR.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.itemDR.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.itemDR.NamaDokter != undefined) {
                    tempDokter = "&dokterid=" + $scope.itemDR.NamaDokter.id;
                    judul = "Detail Remunerasi " + $scope.itemDR.NamaDokter.namalengkap;
                }

                var isEksekutif = ''
                if ($scope.itemDR.EksekutifDR == true) {
                    isEksekutif = "&isExsekutif=" + true;
                } else {
                    isEksekutif = "&isExsekutif=" + false;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    // 6: $scope.item.ruangan.id,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-detail-laporan-remun-dokter?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempDokter + isEksekutif).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].isparamedis == "1") {
                                datas[i].statusparamedis = "✔"
                            } else {
                                datas[i].statusparamedis = ""
                            }
                            if (datas[i].iscito == "1") {
                                datas[i].statuscito = "✔"
                            } else {
                                datas[i].statuscito = ""
                            }
                        }
                        $scope.sourceLaporanTiga = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargasatuan: { type: "number" },
                                        total: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });
                    })
            }



            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [
                {
                    field: "hargasatuan",
                    aggregate: "sum"
                },
                {
                    field: "total",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporanTiga = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "detaillaporanremunerasidokter.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
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

                    { field: "no", title: "No", width: "50px" },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noreigtrasi",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaproduk",
                        title: "Nama layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "qty",
                        title: "Jumlah",
                        width: "80px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statusparamedis",
                        title: "P",
                        width: "20px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "50px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "hargasatuan",
                        title: "Harga Satuan",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.hargasatuan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                    // {
                    //     field: "hargasatuan",
                    //     title: "Tarif Layanan",
                    //     width: "80px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                    //     // aggregates: ["sum"],
                    //     // footerTemplate: "#: data.hargasatuan.sum #",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                    //     // footerAttributes: {style: "text-align: right;"}

                    // },
                    // {
                    //     field: "jenispagunilai",
                    //     title: "Jasa Remun",
                    //     width: "100px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jenispagunilai.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     hidden: true,
                    //     field: "dokter",
                    //     title: "Nama Dokter",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Nama Dokter #= value #"
                    // },
                    // {
                    //     "command": [
                    //         {
                    //             text: "Detail",
                    //             click: detailfromgrid,
                    //             imageClass: "k-icon k-i-pencil"
                    //         }
                    //     ],
                    //     title: "",
                    //     width: "60px",
                    // }

                ]
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
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

            $scope.Cetak = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.item.NamaDokter != undefined) {
                    tempDokter = $scope.item.NamaDokter.id;
                }

                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = $scope.item.noclosing;
                }

                var stt = 'false'
                if (confirm('View Laporan Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-remunerasi=1&idRuangan=' + tempRuanganId + '&idDept=' + tempDepartemenId + '&noclosing=' + tempNoClosing + '&IdDokter=' + tempDokter + '&view=' + stt, function (response) {
                    // do something with response
                });

            }

            $scope.SearchDataEmpat = function () {
                LoadDataDetailParamedis();
            }

            function LoadDataDetailParamedis() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemEmpat.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemEmpat.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                if ($scope.itemEmpat.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.itemEmpat.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemEmpat.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.itemEmpat.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.itemEmpat.NamaDokter != undefined) {
                    tempDokter = "&dokterid=" + $scope.itemEmpat.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.itemEmpat.EksekutifEmpat == true) {
                    isEksekutif = "&isExsekutif=" + true;
                } else {
                    isEksekutif = "&isExsekutif=" + false;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    // 6: $scope.item.ruangan.id,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-detail-laporan-remun-paramedis?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempDokter + isEksekutif).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].isparamedis == "1") {
                                datas[i].statusparamedis = "✔"
                            } else {
                                datas[i].statusparamedis = ""
                            }
                            if (datas[i].iscito == "1") {
                                datas[i].statuscito = "✔"
                            } else {
                                datas[i].statuscito = ""
                            }
                        }
                        $scope.sourceLaporanEmpat = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargasatuan: { type: "number" },
                                        total: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });
                    })
            }


            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [
                {
                    field: "hargasatuan",
                    aggregate: "sum"
                },
                {
                    field: "total",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporanEmpat = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "detaillaporanremunerasiparamedis.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
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

                    { field: "no", title: "No", width: "50px" },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noreigtrasi",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaproduk",
                        title: "Nama layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "qty",
                        title: "Jumlah",
                        width: "80px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statusparamedis",
                        title: "P",
                        width: "20px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "50px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "hargasatuan",
                        title: "Harga Satuan",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.hargasatuan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                    // {
                    //     field: "hargasatuan",
                    //     title: "Tarif Layanan",
                    //     width: "80px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                    //     // aggregates: ["sum"],
                    //     // footerTemplate: "#: data.hargasatuan.sum #",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                    //     // footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     field: "jenispagunilai",
                    //     title: "Jasa Remun",
                    //     width: "100px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jenispagunilai.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     hidden: true,
                    //     field: "dokter",
                    //     title: "Nama Dokter",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Nama Dokter #= value #"
                    // },
                    // {
                    //     "command": [
                    //         {
                    //             text: "Detail",
                    //             click: detailfromgrid,
                    //             imageClass: "k-icon k-i-pencil"
                    //         }
                    //     ],
                    //     title: "",
                    //     width: "60px",
                    // }

                ]
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

            $scope.cetakSatu = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }
                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId
                    + '&strEksekutif=' + isEksekutif + '&view=' + stt, function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakDua = function () {
                var tglAwal = moment($scope.itemR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemR.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDokter = "";
                if ($scope.itemR.NamaDokter != undefined) {
                    tempDokter = $scope.itemR.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-rekap-remunerasi=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdDokter=' + tempDokter + '&strEksekutif=' + isEksekutif + '&view=' + stt, function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakTiga = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemDR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemDR.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.itemDR.departement != undefined) {
                    tempDepartemenId = $scope.itemDR.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemDR.ruangan != undefined) {
                    tempRuanganId = $scope.itemDR.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.itemDR.NamaDokter != undefined) {
                    tempDokter = $scope.itemDR.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi Dokter? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi-dokter=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId
                    + '&strIdDokter=' + tempDokter + '&strEksekutif=' + isEksekutif + '&view=' + stt, function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakEmpat = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemEmpat.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemEmpat.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.itemEmpat.departement != undefined) {
                    tempDepartemenId = $scope.itemEmpat.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemEmpat.ruangan != undefined) {
                    tempRuanganId = $scope.itemEmpat.ruangan.id;
                }

                var isEksekutif = ''
                if ($scope.itemEmpat.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi Paramedis? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi-paramedis=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId
                    + '&strEksekutif=' + isEksekutif + '&view=' + stt, function (response) {
                        // do something with response                
                    });
            }
            /////////////////////////////////////////
        }
    ]);
});