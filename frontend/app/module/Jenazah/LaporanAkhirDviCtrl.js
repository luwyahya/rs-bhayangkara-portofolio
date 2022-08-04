define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('LaporanAkhirDviCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        loadCombo()
        // loadSemuaLaporan()
        // loadAjah2()
        var laporanakhir = [];
        var laporanakhirbingits = [];
        var tampungan = [];
        var tampungan2 = [];
        var details = [];

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana
            })
        }
        $scope.cari = function() {
            $scope.isRouteLoading = true;
            // if ($scope.item.jenisbencana == undefined) {
            //     toastr.error('Pilih Dahulu Jenis Bencana !')
            //     return;
            // }
            loadAjah2()
        }
        function loadAjah2() {
            var JenisBencana = "";
                if ($scope.item.jenisbencana != undefined) {
                    JenisBencana = "&jenisbencana=" + $scope.item.jenisbencana.id;
                }
            medifirstService.get('jenazah/dvi/get-laporan-akhir-2?' + JenisBencana).then(function(dat) {
                debugger
                $scope.isRouteLoading = false;
                if (dat.status == 200) {
                var laporan = dat.data
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: laporan,
                    group: $scope.group,
                    pageSize: 50,
                    // total: laporan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                });
            } else {
                var laporan = [];
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: laporan,
                    group: $scope.group,
                    pageSize: 50,
                    // total: laporan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                });
                toastr.error('Data Tidak Ditemukan !')
                return;
            }
            })
            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "LaporanAkhirDVI.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Akhir DVI",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    // { field: "no", title: "No", width: "45px" },
                    {
                        field: "jenisbencana",
                        title: "Jenis Bencana",
                        width: "450px",
                    },
                    {
                        title: "Jumlah Body Bag",
                        width: "50px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "jumlahbadanutuh",
                            "title" : "Bagian Tubuh Utuh",
                            
                        }, {
                            "field" : "jumlahbadanbagian",
                            "title" : "Bagian Tubuh Potongan",
                        }
                        ],
                    },
                    {
                        field: "jumlahpm",
                        title: "Postmortem",
                        width: "155px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"jumlahpmdetail(dataItem)\" style=\"margin:0 0 5px\">#: jumlahpm #</button>",
                    },
                    {
                        field: "jumlaham",
                        title: "Antemortem",
                        width: "155px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"jumlahamdetail(dataItem)\" style=\"margin:0 0 5px\">#: jumlaham #</button>",
                    },
                    {
                        field: "teridentifikasi",
                        title: "Teridentifikasi",
                        width: "155px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"teridentifikasidetail(dataItem)\" style=\"margin:0 0 5px\">#: teridentifikasi #</button>",
                    }
                ]
            }
        }
        function loadAjah() {
            medifirstService.get('jenazah/dvi/get-laporan-akhir?jenisbencana=' + $scope.item.jenisbencana.id).then(function(dat) {
                debugger
                var laporan = dat.data
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: laporan,
                    group: $scope.group,
                    pageSize: 50,
                    // total: laporan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                });
            })
            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "LaporanAkhirDVI.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Akhir DVI",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    // { field: "no", title: "No", width: "45px" },
                    {
                        field: "jenisbencana",
                        title: "Jenis Bencana",
                        width: "250px",
                    },
                    {
                        title: "Jumlah Body Bag",
                        width: "50px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "badanutuh",
                            "title" : "Bagian Tubuh Utuh",
                            
                        }, {
                            "field" : "badanbagian",
                            "title" : "Bagian Tubuh Potongan",
                        }
                        ],
                    },
                    {
                        field: "jumlahpm",
                        title: "Postmortem",
                        width: "155px",
                    },
                    {
                        field: "jumlaham",
                        title: "Antemortem",
                        width: "155px",
                    },
                    {
                        field: "teridentifikasi",
                        title: "Teridentifikasi",
                        width: "155px",
                    }
                ]
            }
        }
        function loadSemuaLaporan() {
            medifirstService.get('jenazah/dvi/get-laporan-postmortem').then(function(dat) {
                debugger
                var antemortem = dat.data

                for (var i = 0; i < antemortem.length; i++) {
                    laporanakhir.push(antemortem[i])
                }
            medifirstService.get('jenazah/dvi/get-laporan-antemortem').then(function(dat) {
                debugger
                var postmortem = dat.data

                for (var i = 0; i < postmortem.length; i++) {
                    for (var j = 0; j < laporanakhir.length; j++) {
                        if (postmortem[i].jenisbencana == laporanakhir[j].jenisbencana) {
                            laporanakhir.push({ jenisbencana: laporanakhir[j].jenisbencana, jumlahpm: laporanakhir[j].jumlahpm, teridentifikasi: laporanakhir[j].teridentifikasi, jumlaham: postmortem[i].jumlaham})
                        } else if (postmortem[i].jenisbencana != laporanakhir[j].jenisbencana) {
                            if (postmortem[j] == undefined) {
                                postmortem[j] = {
                                    jumlaham: '0'
                                }
                            }
                            laporanakhirbingits.push({ jenisbencana: laporanakhir[j].jenisbencana, jumlahpm: laporanakhir[j].jumlahpm, teridentifikasi: laporanakhir[j].teridentifikasi, jumlaham: postmortem[j].jumlaham})
                        } else {

                        }
                    }
                }
                // debugger
                // laporanakhirbingits
                // tampungan.push(laporanakhirbingits[0])
                // for (var i = 0; i < laporanakhirbingits.length; i++) {
                //     var sama = false
                //     var jenisbencana = laporanakhirbingits[i].jenisbencana
                //     var jenisbencanareal = tampungan[tampungan.length - 1].jenisbencana

                //     if (jenisbencana == jenisbencanareal) {
                //         sama = true
                //         laporanakhirbingits.splice(laporanakhirbingits[i], 1)
                //         tampungan.push(laporanakhirbingits[i])
                //         i = i + 1
                //     }
                //     if (sama == false) {
                //         // tampungan.push(laporanakhirbingits[i])
                //     }
                // }
                // debugger
                // tampungan
            })
            })
        }
        $scope.jumlahamdetail = function(dataItem) {
            debugger
            var jenisbencana = "jenisbencana=" + dataItem.jenisbencana
            var setParam = "&setParam=1"
            var link = "jenazah/dvi/get-laporan-akhir-detail?"
            medifirstService.get(link + jenisbencana + setParam).then(function (dat) {
                debugger
            $scope.popUpDetailAntemortem.center().open();
            // details = dat.data.data
            var detail = dat.data.data
            $scope.dataAntemortemDetail = {
                data: detail,
                pageSize: 10,
                total: detail.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }, aggregate : [

                ],
                refresh: true,
                selectable: true,
                refresh: true,
                groupable: true,
                allowCopy: true,
            }
            $scope.columnAntemortemDetail =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "Laporan";

                        var myHeaders = [
                            {
                                value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                            }
                        ];
                        sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
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
                                "field": "namapelapor",
                                "title": "Nama Pelapor",
                                "width": "50px"
                            },
                            {
                                "field": "namadilaporkan",
                                "title": "Nama Dilaporkan",
                                "width": "50px"
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px"
                            },
                            {
                                "field": "alamat",
                                "title": "Alamat",
                                "width": "50px"
                            },
                            {
                                "field": "sumbersidikjari",
                                "title": "Sumber Sidik Jari",
                                "width": "50px"
                            },
                            {
                                "field": "sumbergigi",
                                "title": "Sumber Gigi",
                                "width": "50px"
                            },
                            {
                                "field": "sumberdna",
                                "title": "Sumber DNA",
                                "width": "50px"
                            },
                            {
                                "field": "jenisbencana",
                                "title": "Jenis Bencana",
                                "width": "50px"
                            }
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
            })
        }
        $scope.jumlahpmdetail = function (dataItem) {
            var jenisbencana = "jenisbencana=" + dataItem.jenisbencana
            var setParam = "&setParam=2"
            var link = "jenazah/dvi/get-laporan-akhir-detail?"
            medifirstService.get(link + jenisbencana + setParam).then(function(dat) {
            $scope.popUpDetailPostmortem.center().open();
            var detail = dat.data.data
            $scope.dataPostmortemDetail = {
                data: detail,
                pageSize: 10,
                total: detail.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }, aggregate : [

                ],
                refresh: true,
                selectable: true,
                refresh: true,
                groupable: true,
                allowCopy: true,
            }
            $scope.columnPostmortemDetail =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "Laporan";

                        var myHeaders = [
                            {
                                value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                            }
                        ];
                        sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
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
                                "field": "labeldvi",
                                "title": "Label DVI",
                                "width": "50px"
                            },
                            {
                                "field": "barangbukti",
                                "title": "Barang Bukti",
                                "width": "50px"
                            },
                            {
                                "field": "labeltkp",
                                "title": "Label TKP",
                                "width": "50px"
                            },
                            {
                                "field": "jenisbencana",
                                "title": "Jenis Bencana",
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
            })
        }
        $scope.teridentifikasidetail = function (dataItem) {
            var jenisbencana = "jenisbencana=" + $scope.item.jenisbencana.id
            var setParam = "&setParam=3"
            var link = "jenazah/dvi/get-laporan-akhir-detail?"

            medifirstService.get(link + jenisbencana + setParam).then(function(dat) {
                $scope.popUpDetailTeridentifikasi.center().open();
                if(dat.data.data.length > 0) {
                var detail = dat.data.data
                $scope.dataTeridentifikasiDetail = {
                    data: detail,
                    pageSize: 10,
                    total: detail.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }, aggregate : [
    
                    ],
                    refresh: true,
                    selectable: true,
                    refresh: true,
                    groupable: true,
                    allowCopy: true,
                }
            } else {
                $scope.popUpDetailTeridentifikasi.close();
                toastr.error('Data Tidak Ditemukan')
                return;
            }
            })
            $scope.columnTeridentifikasiDetail = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanPenerimaanJenazah.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:U1"];
                    sheet.name = "Laporan";

                    var myHeaders = [
                        {
                            value: "LAPORAN PENERIMAAN JENAZAH",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                        }
                    ];
                    sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
                },
                // scrollable: true,
                // selectable: "row",
                // pageable: true,
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    {
                        "field": "jenisbencana",
                        "title": "Jenis Bencana",
                        "width": "170px",
                        attributes: {
                            class: "biru"
                        },
                    },
                    {
                        title: "Data Antemortem",
                        // width: "400px",
                        headerAttributes: { style: "text-align: center"},
                        columns: [
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "170px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "namadilaporkan",
                                "title": "Nama Korban",
                                "width": "170px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            // {
                            //     "field": "noregistrasi",
                            //     "title": "No Registrasi",
                            //     "width": "170px",
                            // },
                            {
                                title: "Sumber Sidik Jari",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumbersidikjari",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiansidikjari",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangansidikjari",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoSidikJariAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                title: "Sumber Gigi",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumbergigi",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiangigi",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangangigi",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoGigiAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                title: "Sumber Dna",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumberdna",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiandna",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangandna",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoDnaAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                "field": "ciricirifisik",
                                "title": "Ciri Ciri Fisik",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "keteranganfisik",
                                "title": "Keterangan Fisik",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "barangkepemilikan",
                                "title": "Barang Kepemilikan",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "keteranganbarang",
                                "title": "Keterangan Barang",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                        ]
                    },
                    {
                        title: "Data Postmortem",
                        // width: "400px",
                        headerAttributes: { style: "text-align: center"},
                        columns: [
                            {
                                "field": "labeldvi",
                                "title": "Label DVI",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "sidikjari",
                                "title": "Sidik Jari",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto Sidik Jari",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoSidikJariPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "gigi",
                                "title": "Gigi",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto Gigi",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoGigiPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "dna",
                                "title": "DNA",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto DNA",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoDnaPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                        ]
                    }
                ]
            }
        }
        $scope.fotoSidikJariAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoSidikJari.length > 0) {
                    $scope.images1 = [];
                    var fotoSidikJari = dat.data.fotoSidikJari
                    for (let i = 0; i < fotoSidikJari.length; i++) {
                        $scope.images1.push({
                            dataURL1: fotoSidikJari[i].foto
                        });
                    }
                    $scope.popUpFotoSidikJariAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoGigiAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoGigi.length > 0) {
                    $scope.images2 = [];
                    var fotoGigi = dat.data.fotoGigi
                    for (let i = 0; i < fotoGigi.length; i++) {
                        $scope.images2.push({
                            dataURL2: fotoGigi[i].foto
                        });
                    }
                    $scope.popUpFotoGigiAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoDnaAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoDna.length > 0) {
                    $scope.images3 = [];
                    var fotoDna = dat.data.fotoDna
                    for (let i = 0; i < fotoDna.length; i++) {
                        $scope.images3.push({
                            dataURL3: fotoDna[i].foto
                        });
                    }
                    $scope.popUpFotoDnaAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoSidikJariPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoSidikJari.length > 0) {
                    $scope.images4 = [];
                    var fotoSidikJari = dat.data.fotoSidikJari
                    for (let i = 0; i < fotoSidikJari.length; i++) {
                        $scope.images4.push({
                            dataURL4: fotoSidikJari[i].foto
                        });
                    }
                    $scope.popUpFotoSidikJariPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoGigiPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoGigi.length > 0) {
                    $scope.images5 = [];
                    var fotoGigi = dat.data.fotoGigi
                    for (let i = 0; i < fotoGigi.length; i++) {
                        $scope.images5.push({
                            dataURL5: fotoGigi[i].foto
                        });
                    }
                    $scope.popUpFotoGigiPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoDnaPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoDna.length > 0) {
                    $scope.images6 = [];
                    var fotoDna = dat.data.fotoDna
                    for (let i = 0; i < fotoDna.length; i++) {
                        $scope.images6.push({
                            dataURL6: fotoDna[i].foto
                        });
                    }
                    $scope.popUpFotoDnaPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            }) 
        }
    }
])
})