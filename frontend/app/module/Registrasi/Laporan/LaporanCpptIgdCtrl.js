define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanCpptIgdCtrl', ['$mdDialog','CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, $state, medifirstService, DateHelper, $window) {
        $scope.item = {}
        $scope.now = new Date();
        $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
        $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
        $scope.isRouteLoading = false;
        let dataReal = []
        // loadData()
        $scope.cariFilter = function() {
            loadData()
        } 
        firstLoad()
        function firstLoad(){
            medifirstService.get("emr/get-combo").then(function (e) {
                $scope.listDokter = e.data.dokter
                $scope.listRuangan = e.data.ruanganrajal
                $scope.listJenisKelamin = e.data.jeniskelamin
                $scope.listPenjamin = e.data.rekanan
            })
        }


        function loadData() {
            $scope.isRouteLoading = true;
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let filter = ''
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            medifirstService.get("registrasi/laporan/get-laporan-sudah-isi-cppt-emr-igd?tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir+ filter).then(function(dat) {
                dataReal = []
                for (let i = 0; i < dat.data.data10.length; i++) {
                    for (let j = 0; j < dat.data.data11.length; j++) {
                        if (dat.data.data10[i].namaruangan == dat.data.data11[j].namaruangan) {
                            dataReal.push({ namaruangan: dat.data.data10[i].namaruangan, jmlDokter: dat.data.data11[j].jmlDokter, jmlPerawat: dat.data.data11[j].jmlPerawat, jmlPasien: dat.data.data10[i].jmlPasien, jmlKunj: dat.data.data10[i].jmlKunj, jmlBelumIsi: dat.data.data10[i].jmlBelumIsi})
                        }
                    }
                }
                $scope.isRouteLoading = false;
                var data2 =  dat.data
                for (var i = 0; i < dataReal.length; i++) {
                    dataReal[i].no = i + 1
                } 
                $scope.isRouteLoading = false;
                $scope.dataGrid = new kendo.data.DataSource({
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
            $scope.columnGrid = {
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
                        "field": "namaruangan",
                        "title": "Nama Poliklinik",
                        "width": "150px",
                        // "template": "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        "field": "jmlDokter",
                        "title": "Dokter",
                        "width": "50px",
                        // "template": "<span class='style-center'>#: dokter #</span>",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"detailDokter(dataItem)\" style=\"margin:0 0 5px\">#: jmlDokter #</button>",
                    },
                    {
                        "field": "jmlPerawat",
                        "title": "Perawat",
                        "width": "50px",
                        // "template": "<span class='style-center'>#: perawat #</span>",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"detailPerawat(dataItem)\" style=\"margin:0 0 5px\">#: jmlPerawat #</button>",
                    },
                    // {
                    //     "field": "total",
                    //     "title": "Jumlah Yang Sudah Di isi",
                    //     "width": "50px",
                    //     "template": "<span class='style-center'>#: total #</span>",
                    // },
                    {
                        "field": "jmlBelumIsi",
                        "title": "Jumlah Belum Isi",
                        "width": "50px",
                        // "template": "<span class='style-center'>#: totalpasien #</span>",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotalBelum(dataItem)\" style=\"margin:0 0 5px\">#: jmlBelumIsi #</button>",
                    },
                    {
                        "field": "jmlPasien",
                        "title": "Jumlah Pasien",
                        "width": "50px",
                        // "template": "<span class='style-center'>#: totalpasien #</span>",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotal(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                    },
                  
                ]                   
            };
        }
        $scope.detailDokter = function(dataItem) {
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let filter = ''
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            $scope.isRouteLoading = true;
            medifirstService.get('emr/get-detail-dokter-cppt-new?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + filter).then(function(dat) {
                $scope.isRouteLoading = false;
                let data = dat.data
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
                        "field": "hasilpemeriksaan",
                        "title": "Hasil Pemeriksaan",
                        "width": "50%",
                        "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
        $scope.detailPerawat = function(dataItem) {
            // debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let filter = ''
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            $scope.isRouteLoading = true;
            medifirstService.get('emr/get-detail-perawat-cppt-new?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan +filter).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                let data = dat.data
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
                        "field": "hasilpemeriksaan",
                        "title": "Hasil Pemeriksaan",
                        "width": "60%",
                        "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    }
                  
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
        $scope.detailTotalBelum = function(dataItem) {
            // debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let filter = ''
            let filter2 = '&belumIsi='+ true
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            medifirstService.get('emr/get-total-pasien-cppt?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter+filter2).then(function(dat) {
                // debugger
                let data = dat.data
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
                        attributes: {
                            class: "#=isBelumCppt === 'true' ? 'red' : 'hejo2' #"
                        },
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
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                  
                ]                   
            };
            $scope.popUpDetailPasien.center().open();
        }
        $scope.detailTotal = function(dataItem) {
            // debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            let filter = ''
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            medifirstService.get('emr/get-total-pasien-cppt?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter).then(function(dat) {
                // debugger
                let data = dat.data
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
                        attributes: {
                            class: "#=isBelumCppt === 'true' ? 'red' : 'hejo2' #"
                        },
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
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                  
                ]                   
            };
            $scope.popUpDetailPasien.center().open();
        }
    }
])
})