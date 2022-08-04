define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DataPasienPoldaCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded1 = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = $scope.now
            $scope.item.periodeAkhir = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.selectedKesatuan = [];
            var details = [];
            
            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienOperatorCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					// if(arrPeriode[2]!= "")
					// 	$scope.item.noReg = arrPeriode[2];	
					// if(arrPeriode[3]!= "")	
					// 	$scope.item.noRm = arrPeriode[3];	
					// if(arrPeriode[4]!= "")
					// 	$scope.item.nama = arrPeriode[4];			
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					// $scope.item.tglpulang = $scope.now;					
				}
            //      medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
            //         .then(function (data) {
            //             $scope.listRuangans=data.data.ruanganrajal
            //         })

            //         medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
            //     $scope.listKelompokPasien = data.data.kelompokpasien;
            // })
                    
            }

            $scope.SearchData = function () {
                LoadData()
            }
            function LoadData() {

                var listKesatuan = []
                if ($scope.selectedKesatuan.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedKesatuan.length - 1; i >= 0; i--) {
                        var c = $scope.selectedKesatuan[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKesatuan = a.slice(1, a.length)
                } 
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var DepartemenId = "";
                if ($scope.item.departement != undefined) {
                    DepartemenId = "&departemenid=" + $scope.item.departement.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('DataPasienPoldaCtrl', chacePeriode);

                debugger
                medifirstService.get("registrasi/laporan/get-data-pasien-polda?" +
                "tglAwal=" + tglAwal +
                "&tglAkhir=" + tglAkhir 
                + "&departemenid=" + DepartemenId
                + "&listkesatuan=" + listKesatuan
                    ).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridLrtt ={
                            data: data.data,
                            pageSize: 40,
                            total: data.data.length,
                            serverPaging: false,
                            schema: {
                                model: { 
                                    fields: {
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "jumlah", aggregate:"sum"},
                            {field: "persen", aggregate:"sum"},
                        ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        var chacePeriode = tglAwal + "~" + tglAkhir
					// + "~" +cacheNoreg + "~" +cacheNoRm
					// + "~" +cacheNama
					// + "~" +$scope.item.instalasi 
					// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
					// + "~" +$scope.item.dokter;
					cacheHelper.set('DataPasienPoldaCtrl', chacePeriode);
                    });

                    
                medifirstService.get("registrasi/laporan/get-data-pasien-polda-sudah-pulang?" +
                "tglAwal=" + tglAwal +
                "&tglAkhir=" + tglAkhir 
                + "&departemenid=" + DepartemenId
                + "&listkesatuan=" + listKesatuan
                    ).then(function (data) {
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridSudahPulang = {
                            data: data.data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
    
                                    }
                                }
                            }, aggregate: [
    
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // aggregate: [
                        //     {field: "jumlah", aggregate:"sum"},
                        //     {field: "persen", aggregate:"sum"},
                        // ],
                        //     refresh: true,
                        //     selectable: true,
                        //     refresh: true,
                        //     groupable: true,
                        //     allowCopy: true,
                        // }
                    //     var chacePeriode = tglAwal + "~" + tglAkhir
					// // + "~" +cacheNoreg + "~" +cacheNoRm
					// // + "~" +cacheNama
					// // + "~" +$scope.item.instalasi 
					// // + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
					// // + "~" +$scope.item.dokter;
					// cacheHelper.set('DataPasienPoldaCtrl', chacePeriode);
                    });
                    
                medifirstService.get("registrasi/laporan/get-data-pasien-polda-belum-pulang?" +
                "tglAwal=" + tglAwal +
                "&tglAkhir=" + tglAkhir 
                + "&departemenid=" + DepartemenId
                + "&listkesatuan=" + listKesatuan
                    ).then(function (data) {
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridBelumPulang = {
                            data: data.data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
    
                                    }
                                }
                            }, aggregate: [
    
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    });
            }


            
            $scope.selectKesatuan = {                
                dataTextField: "kesatuanpasien",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnGridLrtt = {
                
                toolbar: ["excel"],
                // // , "pdf"],

                excel: {
                    fileName: "Laporan Pasien Berdasarkan Kesatuan.xlsx",
                    allPages: true,

                },
                // // dataSource: $scope.dataExcel,
                // // sortable: true,
                // // pageable: true,
                // // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "LAPORAN PASIEN BERDASARKAN KESATUAN", background: "#fffff" }]
                    });
                },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //         sheet.frozenRows = 2;
                //         sheet.mergedCells = ["A1:C1"];
                //         sheet.name = "Sheet 1";

                //         var myHeaders = [

                //             {
                //                 value: "LAPORAN PASIEN BERDASARKAN KESATUAN TANGGAL " + DateHelper.formatDate($scope.item.periodeAwal, 'DD-MM-YY') + ' sampai ' +
                //                     DateHelper.formatDate($scope.item.periodeAkhir, 'DD-MM-YY'),
                //                 fontSize: 15,
                //                 textAlign: "center",
                //                 background: "#c1d2d2",
                //                 // color:"#ffffff"
                //             }];

                //         sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                //     }, 
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: false,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,    
                    columns: [
                    
                    {
                        "field": "namakesatuan",
                        "title": "Kesatuan",
                        "width": "200px",
                        "template": "<span class='style-center'>#:namakesatuan #</span>",
                        footerTemplate: " Total"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah Pasien",
                        "width": "200px",
                        // template: "<span class='center'>#:jumlah #</span>",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"pasienDetail(dataItem)\" style=\"margin:0 0 5px\">#: jumlah #</button>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jumlah.sum #"
                        // footerTemplate: $scope.item.jumlahpasien
                    },
                    {
                        "field": "persen",
                        "title": "Presentase",
                        "width": "200px",
                        template: "<span class='center'>#:persen # % </span>",
                        aggregates: ["sum"],
                        footerTemplate: "100 %"
                    },

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapResponTimeTracer();
            }
            $scope.pasienDetail = function (dataItem) {
                debugger;
                var listKesatuan = []
                if ($scope.selectedKesatuan.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedKesatuan.length - 1; i >= 0; i--) {
                        var c = $scope.selectedKesatuan[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKesatuan = a.slice(1, a.length)
                }
                
                var DepartemenId = "";
                if ($scope.item.departement != undefined) {
                    DepartemenId = "&departemenid=" + $scope.item.departement.id;
                }
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');
                var kesatuan = "&kesatuan=" + dataItem.namakesatuan;
                var link = "registrasi/daftar-registrasi/get-rawat-detail?"
                $scope.isRouteLoading = true;
                medifirstService.get(link
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&departemenid=" + DepartemenId
                    + "&listkesatuan=" + listKesatuan
                    + kesatuan).then(function (data) {
                    debugger;
                    $scope.popUpDetail.center().open();
                    $scope.isRouteLoading = false;
                    details = data.data;
                    $scope.dataPasienDetail = {
                        data: data.data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }, aggregate: [

                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }
                })
            }
            $scope.columnPasienDetail = {
                
                toolbar: ["excel"],
                // // , "pdf"],

                excel: {
                    fileName: "detail laporan pasien sudah pulang berdasarkan kesatuan.xlsx",
                    allPages: true,

                },
                // // dataSource: $scope.dataExcel,
                // // sortable: true,
                // // pageable: true,
                // // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "DETAIL LAPORAN PASIEN SUDAH PULANG BERDASARKAN KESATUAN", background: "#fffff" }]
                    });
                },

                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "50px"
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "50px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "50px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "50px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "50px"
                    },
                    {
                        "field": "namapangkatpolisi",
                        "title": "Pangkat Polisi",
                        "width": "50px"
                    },
                    {
                        "field": "namapangkat",
                        "title": "Pangkat PNS",
                        "width": "50px"
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "50px"
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan",
                        "width": "50px"
                    },
                    {
                        "field": "satuankerjapasien",
                        "title": "Satuan Kerja",
                        "width": "50px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Rekanan",
                        "width": "50px"
                    },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            
            $scope.columnPasienDetailBelumPulang = {
                
                toolbar: ["excel"],
                // // , "pdf"],

                excel: {
                    fileName: "detail laporan pasien belum pulang berdasarkan kesatuan.xlsx",
                    allPages: true,

                },
                // // dataSource: $scope.dataExcel,
                // // sortable: true,
                // // pageable: true,
                // // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "DETAIL LAPORAN PASIEN BELUM PULANG BERDASARKAN KESATUAN", background: "#fffff" }]
                    });
                },
                
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "50px"
                    },
                    {
                        "field": "nocm",
                        "title": "No CM",
                        "width": "50px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "50px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "50px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "50px"
                    },
                    {
                        "field": "namapangkatpolisi",
                        "title": "Pangkat Polisi",
                        "width": "50px"
                    },
                    {
                        "field": "namapangkat",
                        "title": "Pangkat PNS",
                        "width": "50px"
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "50px"
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan",
                        "width": "50px"
                    },
                    {
                        "field": "satuankerjapasien",
                        "title": "Satuan Kerja",
                        "width": "50px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Rekanan",
                        "width": "50px"
                    },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };



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
            //
            medifirstService.get("registrasi/laporan/get-combo-polda", true).then(function (data) {
                $scope.listDepartemen = data.data.departemen;
                $scope.listKesatuan = data.data.kesatuan;
            })

            $scope.yearUngkul1 = {
                start: "decade",
                depth: "decade"
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