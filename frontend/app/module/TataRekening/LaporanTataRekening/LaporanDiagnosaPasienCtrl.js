define(['initialize'], function (initialize) {
'use strict';
    initialize.controller('LaporanDiagnosaPasienCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();   
            function FormLoad(){
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {}; 
                $scope.item.kodediagnosa = [];
                LoadCombo();
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                    $scope.listDepartemen = dat.data.departemen; 
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;    
                    $scope.listJenisKelompok = dat.data.jeniskelompokpasien  ;
                    $scope.listPenjamin = dat.data.kelompokpasien  ;
                    $scope.listRekanan = dat.data.rekanan  
                    $scope.listKesatuan = dat.data.kesatuan
                    debugger
                    var dataDiagnosa = [];
                    $scope.listDiagnosa2 = dat.data.kddiagnosa;
                    dataDiagnosa = dat.data.kddiagnosa

                    $scope.selectOptionsDiagnosa = {
                        placeholder: "Pilih Diagnosa ...",
                        dataTextField: "kddiagnosa",
                        dataValueField: "id",

                        autoBind: false
                    };
                    // LoadDataGrid();                          
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function(data) {
                     $scope.listDiagnosa = data;
                }); 
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan                
            }
                              
            $scope.SearchData = function () {            
                LoadDataGrid()             
            }

            $scope.ClearData = function (){
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.KelompokPasien = undefined
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            function LoadDataGrid() {  
                debugger               
                $scope.isRouteLoading = true;
                if ($scope.item.kodediagnosa.length != 0) {
                var listDiagnosa1 = "";
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kodediagnosa.length - 1; i >=0; i--) {
                        var c = $scope.item.kodediagnosa[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDiagnosa1 = a.slice(1, a.length)
                    debugger
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');;            

                var tempDepartemenId = "";              
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                } 
                var tempDiagnosa = ""
                if ($scope.item.Diagnosa != undefined) {
                    tempDiagnosa = "&idDiagnosa=" + $scope.item.Diagnosa.id;
                }                                                        
                var tempKelompokPasien = ""
                if ($scope.item.JenisKelompok != undefined) {
                    tempKelompokPasien = "&kelompokPasien=" + $scope.item.JenisKelompok.id;
                }
                var tempKelompokPasien1 = ""
                if ($scope.item.Penjamin != undefined) {
                    tempKelompokPasien1 = "&kelompokPasien1=" + $scope.item.Penjamin.id;
                }
                var tempRekananPasien  = ""
                if ($scope.item.Rekanan != undefined) {
                    tempRekananPasien  = "&RekananPasien=" + $scope.item.Rekanan.id;
                }
                var tempKesatuan = ""
                if ($scope.item.Kesatuan != undefined) {
                    tempKesatuan = "&KesatuanPasien=" + $scope.item.Kesatuan.id
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',                        
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                medifirstService.get("tatarekening/get-data-diagnosa-pasien?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempKelompokPasien  + tempKelompokPasien1 + tempRekananPasien + "&listDiagnosa=" + listDiagnosa1 + tempKesatuan ).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                       
                         datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '                        
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {                                
                            }
                        }
                    });
                })
                
                medifirstService.get("tatarekening/get-data-diagnosa-pasien-rekap?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempKelompokPasien  + tempKelompokPasien1 + tempRekananPasien + "&listDiagnosa=" + listDiagnosa1 ).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                       
                         datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '                        
                    }
                    
                    $scope.sourceLaporanRekap = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {         
                                fields: {}                          
                            }
                        },
                        aggregate: [
                            {field: "baru", aggregate:"sum"},
                            {field: "lama", aggregate:"sum"},
                            {field: "tidakdiisi", aggregate:"sum"},
                            {field: "jumlah", aggregate:"sum"}
                        ]
                    });
                })
                
                medifirstService.get("tatarekening/get-data-penyakit-ponek-igd-rekap?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempKelompokPasien  + tempKelompokPasien1 + tempRekananPasien + "&listDiagnosa=" + listDiagnosa1 ).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;                    
                    }
                    
                    $scope.sourcePenyakitPonekIGD = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {         
                                fields: {}                          
                            }
                        },
                        aggregate: [
                            {field: "gynaecology", aggregate:"sum"},
                            {field: "obstetric", aggregate:"sum"},
                            {field: "tidakdiisi", aggregate:"sum"},
                            {field: "jumlah", aggregate:"sum"}
                        ]
                    });
                })
                
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            // $scope.columnGridPenyakitPonek = {
                
            //     toolbar: ["excel"],
            //     // // , "pdf"],

            //     excel: {
            //         fileName: "Laporan Penyakit Ponek IGD.xlsx",
            //         allPages: true,

            //     },
            //     excelExport: function (e) {
            //         var rows = e.workbook.sheets[0].rows;
            //         rows.unshift({
            //             cells: [{ value: "LAPORAN PENYAKIT PONEK IGD", background: "#fffff" }]
            //         });
            //     },
            //         selectable: 'row',
            //         sortable: false,
            //         reorderable: true,
            //         filterable: false,
            //         pageable: true,
            //         columnMenu: false,
            //         resizable: true,    
            //         columns: [
                    
            //         {
            //             "field": "penyakitponekigd",
            //             "title": "Nama Penyakit",
            //             "width": "200px",
            //             "template": "<span class='style-center'>#:penyakitponekigd #</span>",
            //             footerTemplate: " Total"
            //         },
            //         {
            //             "field": "jumlah",
            //             "title": "Jumlah Pasien",
            //             "width": "200px",
            //             // template: "<span class='center'>#:jumlah #</span>",
            //             "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetailPonekIGD(dataItem)\" style=\"margin:0 0 5px\">#: jumlah #</button>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#:data.jumlah.sum #"
            //             // footerTemplate: $scope.item.jumlahpasien
            //         },
            //         // {
            //         //     "field": "persen",
            //         //     "title": "Presentase",
            //         //     "width": "200px",
            //         //     template: "<span class='center'>#:persen # % </span>",
            //         //     aggregates: ["sum"],
            //         //     footerTemplate: "100 %"
            //         // },

            //     ],
            //     sortable: {
            //         mode: "single",
            //         allowUnsort: false,
            //     }
            //     ,
            //     pageable: {
            //         messages: {
            //             display: "Menampilkan {0} - {1} data dari {2} data"
            //         },
            //         refresh: true,
            //         pageSizes: true,
            //         buttonCount: 5
            //     },
            // };

            $scope.pasienDetailPonekIGD = function (jenis, dataItem, sum) {
                debugger               
                $scope.isRouteLoading = true;
                if ($scope.item.kodediagnosa.length != 0) {
                var listDiagnosa1 = "";
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kodediagnosa.length - 1; i >=0; i--) {
                        var c = $scope.item.kodediagnosa[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDiagnosa1 = a.slice(1, a.length)
                    debugger
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');;            

                var tempDepartemenId = "";              
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                } 
                var tempDiagnosa = ""
                if ($scope.item.Diagnosa != undefined) {
                    tempDiagnosa = "&idDiagnosa=" + $scope.item.Diagnosa.id;
                }                                                        
                var tempKelompokPasien = ""
                if ($scope.item.JenisKelompok != undefined) {
                    tempKelompokPasien = "&kelompokPasien=" + $scope.item.JenisKelompok.id;
                }
                var tempKelompokPasien1 = ""
                if ($scope.item.Penjamin != undefined) {
                    tempKelompokPasien1 = "&kelompokPasien1=" + $scope.item.Penjamin.id;
                }
                var tempRekananPasien  = ""
                if ($scope.item.Rekanan != undefined) {
                    tempRekananPasien  = "&RekananPasien=" + $scope.item.Rekanan.id;
                }
                var tempKesatuan = ""
                if ($scope.item.Kesatuan != undefined) {
                    tempKesatuan = "&KesatuanPasien=" + $scope.item.Kesatuan.id
                }
                let kdDiagnosa = '';
                if(sum == 'sum') {

                } else {
                    kdDiagnosa = dataItem.kddiagnosa;
                }
                // if ($scope.item.Kesatuan != undefined) {
                //     tempKesatuan = "&KesatuanPasien=" + $scope.item.Kesatuan.id
                // }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',                        
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                
                medifirstService.get("tatarekening/get-data-penyakit-ponek-igd?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempKelompokPasien  + tempKelompokPasien1 + tempRekananPasien + "&listDiagnosa=" + listDiagnosa1 + "&kdDiagnosa=" + kdDiagnosa + "&jenisPenyakit=" + jenis ).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                       
                         datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '       
                    }
                    
                    $scope.sourcePenyakitPonekIGDDetail = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {                                
                            }
                        }
                    });
                    $scope.popUpPonek.center().open();
                })
            }
            
            $scope.columnLaporanRekap = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanDiagnosaPasienRekap.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Rekap Diagnosa Pasien",
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

                    { "field": "no", "title": "No", "width": "20px" },
                    {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": "50px"
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa",
                        "width": "200px"                    
                    },
                    {
                        title: "Status (Kasus Diagnosa)",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": "baru",
                                "title": "Baru",
                                "width": "50px",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.baru.sum #"
                            },
                            {
                                "field": "lama",
                                "title": "Lama",
                                "width": "50px",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.lama.sum #"
                            },
                            {
                                "field": "tidakdiisi",
                                "title": "Tidak DiIsi",
                                "width": "50px",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.tidakdiisi.sum #"
                            }
                        ]

                    },
                    {
                        "field": "jumlah",
                        "title": "Total Kasus",
                        "width": "50px",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jumlah.sum #"
                    }                
                ] 
            }

            
            $scope.columnGridPenyakitPonek = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanJenisPenyakitPonekIGD.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Rekap Jenis Penyakit Ponek IGD",
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

                    { "field": "no", "title": "No", "width": "20px" },
                    {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": "50px"
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa",
                        "width": "200px"                    
                    },
                    {
                        title: "Status (Jenis Penyakit)",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": "gynaecology",
                                "title": "Gynaecology",
                                "width": "50px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetailPonekIGD('gynaecology', dataItem, '')\" style=\"margin:0 0 5px\">#: gynaecology #</button>",
                                aggregates: ["sum"],
                                footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"pasienDetailPonekIGD('gynaecology', dataItem, 'sum')\" style=\"margin:0 0 5px\">#: data.gynaecology.sum #</button>",
                                // footerTemplate: "#:data.gynaecology.sum #"
                            },
                            {
                                "field": "obstetric",
                                "title": "Obstetric",
                                "width": "50px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetailPonekIGD('obstetric', dataItem, '')\" style=\"margin:0 0 5px\">#: obstetric #</button>",
                                aggregates: ["sum"],
                                footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"pasienDetailPonekIGD('obstetric', dataItem, 'sum')\" style=\"margin:0 0 5px\">#: data.obstetric.sum #</button>",
                                // footerTemplate: "#:data.obstetric.sum #"
                            },
                            {
                                "field": "tidakdiisi",
                                "title": "Tidak DiIsi",
                                "width": "50px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetailPonekIGD('tidakdiisi', dataItem, '')\" style=\"margin:0 0 5px\">#: tidakdiisi #</button>",
                                aggregates: ["sum"],
                                footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"pasienDetailPonekIGD('tidakdiisi', dataItem, 'sum')\" style=\"margin:0 0 5px\">#: data.tidakdiisi.sum #</button>",
                                // footerTemplate: "#:data.tidakdiisi.sum #"
                            }
                        ]

                    },
                    {
                        "field": "jumlah",
                        "title": "Total Kasus",
                        "width": "50px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetailPonekIGD('', dataItem, '')\" style=\"margin:0 0 5px\">#: jumlah #</button>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jumlah.sum #"
                    }                
                ] 
            }

            $scope.columnLaporan = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanDiagnosaPasien.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Pasien",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Registrasi",
                        width: "105px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglpulang",
                        title: "Tgl Pulang",
                        width: "105px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },                   
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "100px"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "105px"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "150px"                    
                    },
                    {
                        field: "jeniskelamin",
                        title: "JK",
                        width: "50px"
                    },
                    {
                        field: "umur",
                        title: "Umur",
                        width: "100px"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Rawat",
                        width: "140px"                        
                    },
                    {
                        field: "namadokter",
                        title: "Dokter",
                        width: "150px"                    
                    },
                    {
                        field: "jenisdiagnosa",
                        title: "Jenis Diagnosa",
                        width: "100px"                    
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "150px"                    
                    },
                    {
                        field: "status",
                        title: "Status Kasus Diagnosa",
                        width: "120px"                    
                    },
                    {
                        field: "penyakitponekigd",
                        title: "Status Jenis Penyakit",
                        width: "150px"                    
                    },
                    {
                        field: "statuskeluar",
                        title: "Status Keluar",
                        width: "150px"                    
                    },
                    {
                        field: "statuspulang",
                        title: "Status Pulang",
                        width: "150px"                    
                    },
                    {
                        field: "alamatlengkap",
                        title: "Alamat",
                        width: "150px"
                    },
                    {
                        field: "notelepon",
                        title: "No Telepon",
                        width: "100px"
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Kelompok Pasien",
                        width: "100px"
                    },
                    {
                        field: "namarekanan",
                        title: "Nama Rekanan",
                        width: "100px"
                    },   
                    {
                        field: "kesatuanpasien",
                        title: "Kesatuan",
                        width: "100px"
                    },  
                    {
                        field: "satuankerjapasien",
                        title: "Satuan Kerja",
                        width: "100px"
                    },    
                    {
                        field: "namapangkat",
                        title: "Pangkat",
                        width: "100px"
                    },        
                    {
                        field: "nrp",
                        title: "NRP",
                        width: "100px"
                    },      
                ] 
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});