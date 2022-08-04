define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRincianPenerimaanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            var details = [];
            var cboKelompok = []
            var cboKelompokLayanan = []
            var cboLayanan = []
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));   

                $scope.now = new Date();
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');;
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');;         
            LoadData()
            medifirstService.get("kasir/get-data-combo-penerimaan").then(function (data) {      

                cboKelompok = data.data.kelompok
                cboKelompokLayanan = data.data.kelomopoklayanan
                cboLayanan = data.data.layanan      
            })

            $scope.CariLapPasienPulang = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
            function LoadData() {


                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                var tempKelPasienId = "";
                if ($scope.item.namaPenjamin != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.namaPenjamin.id;
                }
                var tempRekananId = "";
                if ($scope.item.institusiAsalPasien != undefined) {
                    tempRekananId = "&institusiAsalPasien=" + $scope.item.institusiAsalPasien.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienPulangCtrl', chacePeriode);

                medifirstService.get("kasir/get-data-lap-perincian-penerimaan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        $scope.isRouteLoading = false;
                        details = data.data;
                        for (var i = 0; i < details.length; i++) {
                            if (details[i].total == undefined) {
                                details[i].total = 0;
                            }
                        }
                        $scope.dataPasienPulang = new kendo.data.DataSource({
							data: details,
							group: $scope.group,							
							total: details.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										total: { type: "number" }
									}
								}
							},
							aggregate: [
								{ field: 'total', aggregate: 'sum' },
							]
						});                        
                    })
            }

            $scope.click = function (dataPasienSelected) { var data = dataPasienSelected };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}


            $scope.group = {
                field: "kelompokpenerimaan",
                aggregates: [
                    {
                        field: "kelompokpenerimaan",
                        aggregate: "count"
                    }
                ]
            };   
            $scope.groupDetail = {
                field: "namaruangan",
                aggregates: [
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    }
                ]
            };         
            $scope.columnPasienPulang =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "LaporanRincianPenerimaan.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "LAPORAN";
                        var myHeaders = [
                            {
                                value: "LAPORAN RINCIAN PENERIMAAN " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }
                        ];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
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
                                // "field": "penerimaankasir",
                                "field": "kelompok",
                                "title": "Jenis Penerimaan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: kelompok #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                "field": "total",
                                "title": "Penerimaan",
                                "width": "30%",
                                "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.total.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                hidden: true,
                                field: "kelompokpenerimaan",
                                title: "Kelompok Penerimaan",
                                aggregates: ["count"],
                                groupHeaderTemplate: "#= value #"
                            },
                            { command: [
                                { imageClass: "k-icon k-i-search", text: "Detail", click: detail }, 
                                { name: "edit", text: "Mapping", click: mapping },], 
                                title: "&nbsp;", width:"10%", }
                        ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                    // ,pageable: {
                    //     messages: {
                    //         display: "Menampilkan {0} - {1} data dari {2} data"
                    //     },
                    //     refresh: true,
                    //     pageSizes: true,
                    //     buttonCount: 5
                    // },
                };
                $scope.columnPasienDetail =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "LaporanRincianPenerimaanDetail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "LAPORAN";
                        var myHeaders = [
                            {
                                value: "LAPORAN RINCIAN PENERIMAAN DETAIL " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }
                        ];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: true,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,
                    columns:
                        [
                            {
                                // "field": "penerimaankasir",
                                "field": "namaproduk",
                                "title": "Pelayanan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: namaproduk #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "nosbm",
                                "title": "No Kwitansi",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: nosbm #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: noregistrasi #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: namapasien #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "nostruk",
                                "title": "No Struk",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: nostruk #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                "field": "total",
                                "title": "Penerimaan",
                                "width": "30%",
                                "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.total.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                hidden: true,
                                field: "namaruangan",
                                title: "Nama Ruangan",
                                aggregates: ["count"],
                                groupHeaderTemplate: "#= value #"
                            }
                        ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                    // ,pageable: {
                    //     messages: {
                    //         display: "Menampilkan {0} - {1} data dari {2} data"
                    //     },
                    //     refresh: true,
                    //     pageSizes: true,
                    //     buttonCount: 5
                    // },
                };
                $scope.columnPasienmapping =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "LaporanRincianPenerimaanDetail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "LAPORAN";
                        var myHeaders = [
                            {
                                value: "LAPORAN RINCIAN PENERIMAAN DETAIL " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }
                        ];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: true,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,
                    columns:
                        [
                            {
                                // "field": "penerimaankasir",
                                "field": "namaruangan",
                                "title": "Nama Ruangan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: namaruangan #</span>",
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "namaproduk",
                                "title": "Pelayanan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: namaproduk #</span>",
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "kelompokpenerimaan",
                                "title": "Kelompok Penerimaan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: kelompokpenerimaan #</span>",
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "kelompok",
                                "title": "Kelompok",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: kelompok #</span>",
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "kelompoklayanan",
                                "title": "Kelompok Layanan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: kelompoklayanan #</span>",
                            },
                            {
                                // "field": "penerimaankasir",
                                "field": "layanan",
                                "title": "Layanan",
                                "width": "50%",
                                // "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                "template": "<span class='style-left'>#: layanan #</span>",
                            },
                            {
                                hidden: true,
                                field: "namaruangan",
                                title: "Nama Ruangan",
                                aggregates: ["count"],
                                groupHeaderTemplate: "#= value #"
                            }
                        ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                    // ,pageable: {
                    //     messages: {
                    //         display: "Menampilkan {0} - {1} data dari {2} data"
                    //     },
                    //     refresh: true,
                    //     pageSizes: true,
                    //     buttonCount: 5
                    // },
                };
            function detail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                $scope.item.nama = dataItem.kelompok

                $scope.popUpDetail.center().open()
                 var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                medifirstService.get("kasir/get-data-lap-perincian-penerimaan-detail?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kdkelompok=" + dataItem.kdkelompokpenerimaan).then(function (data) {
                        $scope.isRouteLoading = false;
                        details = data.data;
                        for (var i = 0; i < details.length; i++) {
                            if (details[i].total == undefined) {
                                details[i].total = 0;
                            }
                        }
                        $scope.dataPasienDetail = new kendo.data.DataSource({
                            data: details,
                            group: $scope.groupDetail,                            
                            total: details.length,
                            serverPaging: false,
                            pageSize:50,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });                        
                    })

            }
            function mapping(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }

                $scope.item.nama = dataItem.kelompok
                $scope.popUpMap.center().open()
                // medifirstService.get("kasir/get-data-combo-penerimaan").then(function (data) {
                        $scope.listKelompok = cboKelompok
                        $scope.listKelompokLayanan = cboKelompokLayanan
                        $scope.listLayanan       = cboLayanan   

                    //     cboKelompok = data.data.kelompok
                    //     cboKelompokLayanan = data.data.kelomopoklayanan
                    //     cboLayanan = data.data.layanan      
                    // })
                medifirstService.get("kasir/get-data-map-penerimaan?"
                    + "&kdkelompok=" + dataItem.kdkelompokpenerimaan).then(function (data) {
                        $scope.isRouteLoading = false;
                        details = data.data;
                        for (var i = 0; i < details.length; i++) {
                            if (details[i].total == undefined) {
                                details[i].total = 0;
                            }
                        }
                        $scope.dataPasienmapping = new kendo.data.DataSource({
                            data: details,
                            group: $scope.groupDetail,                            
                            total: details.length,
                            serverPaging: false,
                            pageSize:50,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });                        
                    })

            }
            $scope.NewMapping = function(){
                $scope.item.nama = "-"
                $scope.popUpMap.center().open()
                $scope.listKelompok = cboKelompok
                $scope.listKelompokLayanan = cboKelompokLayanan
                $scope.listLayanan       = cboLayanan   
                 medifirstService.get("kasir/get-data-map-penerimaan?"
                    + "&kdkelompok=-" ).then(function (data) {
                        $scope.isRouteLoading = false;
                        details = data.data;
                        for (var i = 0; i < details.length; i++) {
                            if (details[i].total == undefined) {
                                details[i].total = 0;
                            }
                        }
                        $scope.dataPasienmapping = new kendo.data.DataSource({
                            data: details,
                            group: $scope.groupDetail,                            
                            total: details.length,
                            serverPaging: false,
                            pageSize:50,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });                        
                    })
            }
            $scope.getIsiComboKelompokLayanan = function () {
                if ($scope.item.kelompok == undefined) {return}
                let arr1 = []
                for (var i = 0; i < cboKelompokLayanan.length; i++) {
                    if (cboKelompokLayanan[i].kdkelompokpenerimaan == $scope.item.kelompok.kdkelompokpenerimaan) {
                        arr1.push({
                            kdkelompoklayanan: cboKelompokLayanan[i].kdkelompoklayanan,
                            kelompoklayanan: cboKelompokLayanan[i].kelompoklayanan
                        })
                    }
                }
                $scope.listKelompokLayanan = arr1
                $scope.item.kelompokLayanan = { kdkelompoklayanan: arr1[0].kdkelompoklayanan, kelompoklayanan: arr1[0].kelompoklayanan }

                arr1 = []
                for (var i = 0; i < cboLayanan.length; i++) {
                    if (cboLayanan[i].kdkelompokpenerimaan == $scope.item.kelompok.kdkelompokpenerimaan) {
                        if (cboLayanan[i].kdkelompoklayanan == $scope.item.kelompokLayanan.kdkelompoklayanan) {
                            arr1.push({
                                kdlayanan: cboLayanan[i].kdlayanan,
                                layanan: cboLayanan[i].layanan,
                                idlap: cboLayanan[i].idlap
                            })
                        }
                    }
                }
                $scope.listLayanan = arr1
                $scope.item.layanan = { kdlayanan: arr1[0].kdlayanan, layanan: arr1[0].layanan,
                                    idlap: arr1[0].idlap  }
            }
            $scope.getIsiComboLayanan = function () {
                if ($scope.item.kelompokLayanan == undefined) {return}
                let arr1 = []
                for (var i = 0; i < cboLayanan.length; i++) {
                    if (cboLayanan[i].kdkelompokpenerimaan == $scope.item.kelompok.kdkelompokpenerimaan) {
                        if (cboLayanan[i].kdkelompoklayanan == $scope.item.kelompokLayanan.kdkelompoklayanan) {
                            arr1.push({
                                kdlayanan: cboLayanan[i].kdlayanan,
                                layanan: cboLayanan[i].layanan,
                                idlap: cboLayanan[i].idlap
                            })
                        }
                    }
                }
                $scope.listLayanan = arr1
                $scope.item.layanan = { kdlayanan: arr1[0].kdlayanan, layanan: arr1[0].layanan,
                                    idlap: arr1[0].idlap  }
            }
            $scope.klikMap = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.item.idmap =dataSelected.id
                    $scope.item.nmRuangan =dataSelected.namaruangan
                    $scope.item.nmLayanan = dataSelected.namaproduk
                    $scope.item.kelompok = { kdkelompokpenerimaan: dataSelected.kdkelompokpenerimaan, kelompok: dataSelected.kelompok }
                    let arr1 = []
                    for (var i = 0; i < cboKelompokLayanan.length; i++) {
                        if (cboKelompokLayanan[i].kdkelompokpenerimaan == $scope.item.kelompok.kdkelompokpenerimaan) {
                            arr1.push({
                                kdkelompoklayanan: cboKelompokLayanan[i].kdkelompoklayanan,
                                kelompoklayanan: cboKelompokLayanan[i].kelompoklayanan
                            })
                        }
                    }
                    $scope.listKelompokLayanan = arr1
                    $scope.item.kelompokLayanan = { kdkelompoklayanan: dataSelected.kdkelompoklayanan, kelompoklayanan: dataSelected.kelompoklayanan }
                    arr1 = []
                    for (var i = 0; i < cboLayanan.length; i++) {
                        if (cboLayanan[i].kdkelompokpenerimaan == $scope.item.kelompok.kdkelompokpenerimaan) {
                            if (cboLayanan[i].kdkelompoklayanan == $scope.item.kelompokLayanan.kdkelompoklayanan) {
                                arr1.push({
                                    kdlayanan: cboLayanan[i].kdlayanan,
                                    layanan: cboLayanan[i].layanan,
                                    idlap: cboLayanan[i].idlap
                                })
                            }
                        }
                    }
                    $scope.listLayanan = arr1
                    $scope.item.layanan = { kdlayanan: dataSelected.kdlayanan, layanan: dataSelected.layanan  }
                }
            }
            $scope.klikDetail = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.item.idmap =dataSelected.mmid
                    $scope.item.nmRuangan =dataSelected.namaruangan
                    $scope.item.nmLayanan = dataSelected.namaproduk
                    let arr1 = []
                    for (var i = 0; i < cboKelompokLayanan.length; i++) {
                        if (cboKelompokLayanan[i].kdkelompokpenerimaan == dataSelected.kdkelompokpenerimaan) {
                            arr1.push({
                                kdkelompoklayanan: cboKelompokLayanan[i].kdkelompoklayanan,
                                kelompoklayanan: cboKelompokLayanan[i].kelompoklayanan
                            })
                        }
                    }
                    $scope.listKelompok = cboKelompok
                    $scope.listKelompokLayanan = arr1
                    $scope.item.kelompok = { kdkelompokpenerimaan: dataSelected.kdkelompokpenerimaan, kelompok: dataSelected.kelompok }
                    arr1 = []
                    for (var i = 0; i < cboLayanan.length; i++) {
                        if (cboLayanan[i].kdkelompokpenerimaan == dataSelected.kdkelompokpenerimaan) {
                            if (cboLayanan[i].kdkelompoklayanan == dataSelected.kdkelompoklayanan) {
                                arr1.push({
                                    kdlayanan: cboLayanan[i].kdlayanan,
                                    layanan: cboLayanan[i].layanan,
                                    idlap: cboLayanan[i].idlap
                                })
                            }
                        }
                    }
                    $scope.listLayanan = arr1
                    $scope.item.kelompokLayanan = { kdkelompoklayanan: dataSelected.kdkelompoklayanan, kelompoklayanan: dataSelected.kelompoklayanan }
                    $scope.item.layanan = { kdlayanan: dataSelected.kdlayanan, layanan: dataSelected.layanan  }
                }
            }
            $scope.SaveMapping = function () {
                if ($scope.item.layanan == undefined) {return}
                var objSave =
                {
                    idmap: $scope.item.idmap,
                    idlap: $scope.item.layanan.idlap
                }

                medifirstService.post('kasir/save-maplap-penerimaan',objSave).then(function (e) {
                    // loadData();
                })

                
            }
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
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

            // medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
            //     $scope.listDepartemen = data.data.departemen;
            //     $scope.listKelompokPasien = data.data.kelompokpasien;
            // })

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.$watch('item.namaPenjamin', function (e) {
                // debugger;
                if (e === undefined) return;
                findPasien.getDataRekanan(e.id).then(function (data) {
                    $scope.sourceDataRekanan = data.data.data.listData;
                    $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
                });
                if (e.id == 5 || e.id == 3) {
                    $scope.Perusahaan = true
                } else {
                    $scope.Perusahaan = false
                    $scope.item.institusiAsalPasien = ""
                }
            })
            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [
                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }
            ];


            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.Cetak = function () {
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.institusiAsalPasien == undefined || $scope.item.institusiAsalPasien.id == undefined)
                    var perusahaan = "";
                else
                    var perusahaan = $scope.item.institusiAsalPasien.id;


                var data2 = details

                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    // if (details[i].rekananfk != null && details[i].statusbarang == null){
                    TempData.push(data2[i])
                    // }    
                }
                var data =
                {
                    details: TempData
                }
                medifirstService.post('registrasi/laporan/post-laporan-pasien-pulang', data).then(function (e) {
                    $scope.isRouteLoading = false;
                    var noId = e.data.noId
                    var stt = 'false'
                    if (confirm('View Laporan Pasien Pulang? ')) {
                        stt = 'true';
                    } else {
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&idlaporan=' + noId + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
                        // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true
                    });
                });
            }

        }
    ]);
});