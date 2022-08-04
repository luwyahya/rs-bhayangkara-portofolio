define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanResponTimeTracerCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded1 = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = $scope.now
            $scope.item.periodeAkhir = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            
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

                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                medifirstService.get("registrasi/laporan/get-data-lap-respon-time-tracer?" +
                "tglAwal=" + tglAwal +
                "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        debugger;
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.item.jumlahpasien = data.data[0].jumlahpasientotal
                        $scope.item.selisih = data.data[0].selisihtotal

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
                            {field: "total", aggregate:"sum"},
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
					cacheHelper.set('LaporanResponTimeTracerCtrl', chacePeriode);
                    });
                    medifirstService.get("registrasi/laporan/get-respon-time-tracer-online?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        debugger;
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceOnline ={
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
                            // {field: "total", aggregate:"sum"},
                        ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        var chacePeriode = tglAwal + "~" + tglAkhir
					cacheHelper.set('LaporanResponTimeTracerCtrl', chacePeriode);
                    });
                    medifirstService.get("registrasi/laporan/get-respon-time-tracer-online-total?"
                    + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function(dat) {
                        $scope.item.jumlahpasien2 = dat.data[0].jumlahpasien
                        $scope.item.selisih2 = dat.data[0].selisih
                    })
            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnGridLrtt = {
                
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "ResponTimeTracer.xlsx",
                    allPages: true,

                },
                // dataSource: $scope.dataExcel,
                // sortable: true,
                // pageable: true,
                // resizable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "ResponTimeTracer";

                        var myHeaders = [

                            {
                                value: "RESPON TIME TRACER TANGGAL " + DateHelper.formatDate($scope.item.periodeAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.periodeAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    }, 
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: false,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,    
                    columns: [
                    
                    {
                        "field": "namaruangan",
                        "title": "Poliklinik",
                        "width": "200px",
                        "template": "<span class='style-center'>#:namaruangan #</span>"
                    },
                    {
                        "field": "jumlahpasien",
                        "title": "Jumlah Pasien",
                        "width": "200px",
                        template: "<span class='center'>#:jumlahpasien #</span>",
                        // footerTemplate: $scope.item.jumlahpasien
                    },
                    {
                        "field": "selisih",
                        "title": "Rata-Rata Waktu yang dibutuhkan",
                        "width": "200px",
                        "template": "<span class='style-center'>#:selisih #</span>"
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
            $scope.columnOnline = {
                
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "ResponTimeTracer.xlsx",
                    allPages: true,

                },
                // dataSource: $scope.dataExcel,
                // sortable: true,
                // pageable: true,
                // resizable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "ResponTimeTracer";

                        var myHeaders = [

                            {
                                value: "RESPON TIME TRACER TANGGAL " + DateHelper.formatDate($scope.item.periodeAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.periodeAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    }, 
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: false,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,    
                    columns: [
                    
                    {
                        "field": "namaruangan",
                        "title": "Poliklinik",
                        "width": "200px",
                        "template": "<span class='style-center'>#:namaruangan #</span>"
                    },
                    {
                        "field": "jumlahpasien",
                        "title": "Jumlah Pasien",
                        "width": "200px",
                        template: "<span class='center'>#:jumlahpasien #</span>",
                        // footerTemplate: $scope.item.jumlahpasien
                    },
                    {
                        "field": "selisih",
                        "title": "Rata-Rata Waktu yang dibutuhkan",
                        "width": "200px",
                        "template": "<span class='style-center'>#:selisih #</span>"
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