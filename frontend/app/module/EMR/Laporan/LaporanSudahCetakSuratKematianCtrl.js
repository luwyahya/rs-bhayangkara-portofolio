define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSudahCetakSuratKematianCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
    function (cacheHelper, $scope, medifirstService, DateHelper) {
        $scope.now = new Date();
        $scope.item = {};
        $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
        $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
        let dataReal = []
        let dataReal2 = [];
        $scope.isRouteLoading = false;
        $scope.search = function() {
            loadData();
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
            dataReal = [];
            dataReal2 = [];
            $scope.isRouteLoading = true;
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let filter = ''
            if ($scope.item.dpjp !=  undefined){
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            medifirstService.get('emr/laporan/get-laporan-sudah-cetak-surat-kematian?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir+filter).then(function(dat) {
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.data10.length; i++) {
                    for (let j = 0; j < dat.data.data11.length; j++) {
                        if (dat.data.data10[i].namaruangan == dat.data.data11[j].namaruangan) {
                            dataReal.push({ namaruangan: dat.data.data10[i].namaruangan, jmlPerawat: dat.data.data11[j].jmlPerawat, jmlPasien: dat.data.data10[i].jmlKunj, jmlKunj: dat.data.data10[i].jmlKunj})
                        }
                    }
                }
                // for (var i = 0; i < dataReal.length; i++) {
                //     dataReal[i].no = i + 1
                // }
                for (let i = 0; i < dat.data.ruangan.length; i++) {
                    let sama = false;
                    let ruang = "";
                    for (let j = 0; j < dataReal.length; j++) {
                        if (dataReal[j].namaruangan == dat.data.ruangan[i].namaruangan) {
                            sama = true
                            break
                        } else {
                            sama = false
                            ruang = dat.data.ruangan[i].namaruangan
                        }
                    }
                    if (sama == false) {
                        dataReal.push({ namaruangan: ruang, jmlPerawat: 0, jmlPasien: 0, jmlKunj: 0 })
                    }
                }
                for (let i = 0; i < dat.data.data10.length; i++) {
                    for (let j = 0; j < dataReal.length; j++) {
                        if (dat.data.data10[i].namaruangan == dataReal[j].namaruangan) {
                            dataReal2.push({ namaruangan: dat.data.data10[i].namaruangan, jmlPerawat: dataReal[j].jmlPerawat, jmlPasien: dat.data.data10[i].jmlKunj, jmlKunj: dat.data.data10[i].jmlKunj})
                        }
                    }
                }
                $scope.dataSourceResumeRi = new kendo.data.DataSource({
                    data: dataReal2,
                    schema: {
                        model: {
                           
                        }
                    },
                    pageSize: 200,
                    total: dataReal2.length,
                    serverPaging: false,
                   
                });  
            })
        }
        $scope.columnGridResumeRi = {
            toolbar: [
                "excel",

            ],
            excel: {
                fileName: "Laporan Surat Kematian.xlsx",
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
                    "field": "jmlPerawat",
                    "title": "Jumlah Sudah Diisi",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailPerawat(dataItem)\" style=\"margin:0 0 5px\">#: jmlPerawat #</button>",
                },
                {
                    "field": "jmlPasien",
                    "title": "Jumlah Pasien Meninggal",
                    "width": "50px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotal(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                },
              
            ]         
        };
        $scope.detailTotal = function(dataItem) {
            // debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            if (ruangan == "PICU & HCU ANAK") {
                ruangan = "PICU DAN HCU ANAK";
            }
            let setParam = "&setParam=1"
            let filter =''
            if ($scope.item.dpjp != undefined) {
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }

            medifirstService.get('emr/laporan/get-laporan-sudah-cetak-surat-kematian-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam + filter).then(function(dat) {
                // debugger
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
                    fileName: "Laporan Surat Kematian.xlsx",
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
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    },
                  
                    
                ]                   
            };
            $scope.popUpDetailPasien.center().open();
        }

        $scope.detailPerawat = function(dataItem) {
            // debugger
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let ruangan = dataItem.namaruangan
            if (ruangan == "PICU & HCU ANAK") {
                ruangan = "PICU DAN HCU ANAK";
            }
            let setParam = "&setParam=2"

            $scope.isRouteLoading = true;
            let filter = ''
            if ($scope.item.dpjp != undefined) {
                filter = '&dokterfk=' + $scope.item.dpjp.id
            }
            medifirstService.get('emr/laporan/get-laporan-sudah-cetak-surat-kematian-detail?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan + setParam + filter).then(function(dat) {
                $scope.isRouteLoading = false;
                // debugger
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
                    fileName: "Laporan Surat Kematian.xlsx",
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
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "10%",
                        "template": "<span class='style-center'>#: namalengkap #</span>",
                    }
                ]                   
            };
            $scope.popUpDetail.center().open();
        }
    }
])
})