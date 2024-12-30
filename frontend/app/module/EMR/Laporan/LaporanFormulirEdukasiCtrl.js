define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanFormulirEdukasiCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
    function (cacheHelper, $scope, medifirstService, DateHelper) {
        $scope.now = new Date();
        $scope.item = {};
        $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
        $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
        let dataReal = [];
        $scope.isRouteLoading = false;

        $scope.search = function() {
            loadData();
        }

        function loadData() {
            dataReal = [];
            $scope.isRouteLoading = true;
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')

            medifirstService.get('emr/laporan/get-laporan-sudah-isi-formulir-edukasi-ri?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir).then(function(dat) {
                debugger
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.data10.length; i++) {
                    for (let j = 0; j < dat.data.data11.length; j++) {
                        if (dat.data.data10[i].namaruangan == dat.data.data11[j].namaruangan) {
                            dataReal.push({ namaruangan: dat.data.data10[i].namaruangan, jmlPerawat: dat.data.data11[j].jmlPerawat, jmlDokter: dat.data.data11[j].jmlDokter, jmlPelaksana: dat.data.data11[j].jmlPelaksana, jmlPasien: dat.data.data10[i].jmlKunj, jmlKunj: dat.data.data10[i].jmlKunj})
                        }
                    }
                }
                for (var i = 0; i < dataReal.length; i++) {
                    dataReal[i].no = i + 1
                }
                $scope.dataSourceCpptRi = new kendo.data.DataSource({
                    data: dataReal,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 200,
                    total: dataReal.length,
                    serverPaging: false,
                   
                });  
            })
        }
        $scope.columnGridCpptRi = {
            toolbar: [
                "excel",

            ],
            excel: {
                fileName: "Laporan Data Poliklinik Sudah isi Formulir Edukasi.xlsx",
                allPages: true,
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                sheet.frozenRows = 4;
                sheet.mergedCells = ["A1:M1"];
                sheet.name = "Report";

                var myHeaders = [{
                    value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                    // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                    fontSize: 18,
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
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "150px",
                },
                {
                    "field": "jmlDokter",
                    "title": "Dokter",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailDokter(dataItem)\" style=\"margin:0 0 5px\">#: jmlDokter #</button>",
                },
                {
                    "field": "jmlPerawat",
                    "title": "Perawat",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailPerawat(dataItem)\" style=\"margin:0 0 5px\">#: jmlPerawat #</button>",
                },
                {
                    "field": "jmlPelaksana",
                    "title": "Pelaksana",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailPelaksana(dataItem)\" style=\"margin:0 0 5px\">#: jmlPelaksana #</button>",
                },
                {
                    "field": "jmlPasien",
                    "title": "Jumlah Pasien",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotal(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                },
              
            ]                   
        };
        $scope.detailTotal = function(dataItem) {
            debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let setParam = "&setParam=1"

            medifirstService.get('emr/laporan/get-laporan-sudah-isi-cppt-emr-ri-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam).then(function(dat) {
                debugger
                let data = dat.data.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataPasienDetailPasien = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
            $scope.columnPasienDetailPasien = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        fontSize: 18,
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
                        "width": "4%",
                        "template": "<span class='style-center'>#: no #</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Poliklinik",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "6%",
                        "template": "<span class='style-center'>#: nocm #</span>",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: noregistrasi #</span>",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namapasien #</span>",
                    },
                  
                ]                   
            };
            $scope.popUpDetailPasien.center().open();
        }
        $scope.detailDokter = function(dataItem) {
            debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let setParam = "&setParam=5"

            $scope.isRouteLoading = true;
            medifirstService.get('emr/laporan/get-laporan-sudah-isi-cppt-emr-ri-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                let data = dat.data.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataPasienDetail = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        fontSize: 18,
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
                        "width": "4%",
                        "template": "<span class='style-center'>#: no #</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Poliklinik",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "6%",
                        "template": "<span class='style-center'>#: nocm #</span>",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: noregistrasi #</span>",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namapasien #</span>",
                    },
                    {
                        "field": "tgljamedukasi",
                        "title": "Tgl Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: tgljamedukasi #</span>",
                    },
                    {
                        "field": "materiedukasi",
                        "title": "Materi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: materiedukasi #</span>",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pemberi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                    // {
                    //     "field": "hasilpemeriksaan",
                    //     "title": "Hasil Pemeriksaan",
                    //     "width": "60%",
                    //     "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                    // }
                  
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
        $scope.detailPerawat = function(dataItem) {
            debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let setParam = "&setParam=6"

            $scope.isRouteLoading = true;
            medifirstService.get('emr/laporan/get-laporan-sudah-isi-cppt-emr-ri-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                let data = dat.data.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataPasienDetail = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        fontSize: 18,
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
                        "width": "4%",
                        "template": "<span class='style-center'>#: no #</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Poliklinik",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "6%",
                        "template": "<span class='style-center'>#: nocm #</span>",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: noregistrasi #</span>",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namapasien #</span>",
                    },
                    {
                        "field": "tgljamedukasi",
                        "title": "Tgl Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: tgljamedukasi #</span>",
                    },
                    {
                        "field": "materiedukasi",
                        "title": "Materi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: materiedukasi #</span>",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pemberi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                    // {
                    //     "field": "hasilpemeriksaan",
                    //     "title": "Hasil Pemeriksaan",
                    //     "width": "60%",
                    //     "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                    // }
                  
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
        $scope.detailPelaksana = function(dataItem) {
            debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let setParam = "&setParam=7"

            $scope.isRouteLoading = true;
            medifirstService.get('emr/laporan/get-laporan-sudah-isi-cppt-emr-ri-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                let data = dat.data.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataPasienDetail = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                        fontSize: 18,
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
                        "width": "4%",
                        "template": "<span class='style-center'>#: no #</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Poliklinik",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "6%",
                        "template": "<span class='style-center'>#: nocm #</span>",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: noregistrasi #</span>",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namapasien #</span>",
                    },
                    {
                        "field": "tgljamedukasi",
                        "title": "Tgl Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: tgljamedukasi #</span>",
                    },
                    {
                        "field": "materiedukasi",
                        "title": "Materi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: materiedukasi #</span>",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pemberi Edukasi",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                    // {
                    //     "field": "hasilpemeriksaan",
                    //     "title": "Hasil Pemeriksaan",
                    //     "width": "60%",
                    //     "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                    // }
                  
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
    }
])
})