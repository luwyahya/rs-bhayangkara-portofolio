// define(['initialize'], function (initialize) {

//     'use strict';
//     initialize.controller('DaftarDokumenRekamMedisRevCtrl', ['$state', 'ManagePhp', '$timeout','$rootScope', '$scope', 'DateHelper',
//         function ($state, managePhp,$timeout, $rootScope, $scope, dateHelper) {
define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarDokumenRekamMedisRevCtrl', ['$q', '$scope', 'ModelItem', 'MedifirstService',
        function ($q, $scope, ModelItem, medifirstService) {
            $scope.title = "Daftar Bayi Baru Lahir";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pasien = {}
            $scope.model = {};
            $scope.isPushOnClick = true;
            $scope.istempatLaporan = true;
            $scope.item = {
                from: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                from2: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until2: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                from3: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until3: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                rows: 100
            }
            let nocm = '';
            $scope.pasienBatal = false;
            $scope.tglregistrasi = true
            $scope.tglkembali = false
            var test = []
            $scope.setSourceRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.tglregistrasi = false
                    $scope.tglkembali = true
                    $scope.item.tglkembaliawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'))
                    $scope.item.tglkembaliakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                } else {
                    $scope.tglregistrasi = true
                    $scope.tglkembali = false
                    $scope.item.from = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'))
                    $scope.item.until = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                }
            }

            function loadCombo() {
                medifirstService.get("registrasi/dokumenrm/get-combo-dokumen-rekmed", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listRuanganTujuan = data.data.ruangan;
                    $scope.listRuanganAsal = data.data.ruanganrak;
                    $scope.item.ruanganAsal = data.data.ruanganrak[0];
                    $scope.listRuanganTerima = data.data.ruanganrak;
                    $scope.item.ruanganTerima = data.data.ruanganrak[0];
                });
            }
            loadCombo()
            $scope.refresh = function () {
                $scope.item = {
                    from: $scope.now,
                    until: $scope.now,
                    rows: 100
                };
                $scope.findData()
            }
            $scope.refreshData = function () {
                $scope.pasien = {}
                loadDataPasien()
            }
            $scope.SearchDatatab = function () {
                $scope.findData()
            }
            $scope.SearchDatatabb = function () {
                $scope.findData3()
            }
            $scope.SearchDatatabbb = function () {
                $scope.findData()
            }

            function loadDataPasien() {

                $scope.isRouteLoading = true;


                var rm = ""
                if ($scope.pasien.noRM != undefined) {
                    rm = "&norm=" + $scope.pasien.noRM
                }

                var pasien = ""
                if ($scope.pasien.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.pasien.namaPasien
                }
                var ayah = ""
                if ($scope.pasien.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.pasien.namaAyah
                }
                var almat = ""
                if ($scope.pasien.alamat != undefined) {
                    almat = "&alamat=" + $scope.pasien.alamat
                }

                var tglLahirs = ""
                if ($scope.pasien.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + dateHelper.formatDate($scope.pasien.tglLahir, 'YYYY-MM-DD');
                }

                medifirstService.get("registrasipasien/get-pasien?" +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat)
                    .then(function (data) {
                        $scope.isRouteLoading = false;

                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.daftar,
                            // pageSize: 10,

                        });
                    });

            };

            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD HH:mm');

                debugger;
                var tglKembaliAwal = ""
                if ($scope.item.tglkembaliawal != undefined) {
                    var tglKembaliAwal = "&tglkembaliawal=" + moment($scope.item.tglkembaliawal).format('YYYY-MM-DD HH:mm');
                }
                var tglKembaliAkhir = ""
                if ($scope.item.tglkembaliakhir != undefined) {
                    var tglKembaliAkhir = "&tglkembaliakhir=" + moment($scope.item.tglkembaliakhir).format('YYYY-MM-DD HH:mm');
                }
                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                var deptId = ""
                if ($scope.item.instalasi != undefined) {
                    var deptId = "&deptId=" + $scope.item.instalasi.id
                }
                var ruangan = ""
                if ($scope.item.ruangan != undefined) {
                    var ruangan = "&ruangId=" + $scope.item.ruangan.id
                }

                var rows = ""
                if ($scope.item.rows != undefined) {
                    var rows = "&rows=" + $scope.item.rows
                }
                var diterima = ""
                if ($scope.item.diterima != undefined) {
                    var diterima = "&diterima=" + $scope.item.diterima
                }
                var dikirim = ""
                if ($scope.item.dikirim != undefined) {
                    var dikirim = "&dikirim=" + $scope.item.dikirim
                }

                var status = "&status=NULL"
                debugger;
                if ($scope.model.cekpilihManual == true) {
                    debugger
                    medifirstService.get("registrasi/dokumenrm/get-daftar-dokumen-rekmed-rjri-2?" +
                        tglKembaliAwal +
                        tglKembaliAkhir +
                        reg +
                        rm +
                        nama +
                        ruangan +
                        deptId +
                        rows +
                        dikirim +
                        '&status=2' +
                        diterima).then(function (e) {
                            debugger;
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < e.data.length; i++) {
                                e.data[i].statCheckbox = false;
                            }
                            $scope.dataPasienBatal11 = new kendo.data.DataSource({
                                data: e.data,
                                // pageSize: 10,
                                serverPaging: false,
                                // group: {
                                //     field: "tglmeninggal",
                                //     aggregates: [{
                                //         field: "noregistrasi",
                                //         aggregate: "count"
                                //     }, {
                                //         field: "namapasien",
                                //         aggregate: "count"
                                //     }]
                                // }
                            });
                        })
                } else {


                    medifirstService.get("registrasi/dokumenrm/get-daftar-dokumen-rekmed?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg +
                        rm +
                        nama +
                        ruangan +
                        deptId +
                        rows +
                        dikirim +
                        status +
                        diterima).then(function (e) {
                            $scope.isRouteLoading = true;
                            $scope.pasienBatal = false
                            for (var i = 0; i < e.data.length; i++) {
                                e.data[i].statCheckbox = false;
                            }
                            test = e.data
                            $scope.dataPasienBatal = new kendo.data.DataSource({
                                data: e.data,
                                pageSize: 500,
                                serverPaging: false,
                                // group: {
                                //     field: "tglmeninggal",
                                //     aggregates: [{
                                //         field: "noregistrasi",
                                //         aggregate: "count"
                                //     }, {
                                //         field: "namapasien",
                                //         aggregate: "count"
                                //     }]
                                // }
                            });
                        })
                    medifirstService.get("registrasi/dokumenrm/get-daftar-dokumen-rekmed-rjri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg +
                        rm +
                        nama +
                        ruangan +
                        deptId +
                        rows +
                        dikirim +
                        '&status=2' +
                        diterima).then(function (e) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < e.data.length; i++) {
                                e.data[i].statCheckbox = false;
                            }
                            $scope.dataPasienBatal11 = new kendo.data.DataSource({
                                data: e.data,
                                // pageSize: 10,
                                serverPaging: false,
                                // group: {
                                //     field: "tglmeninggal",
                                //     aggregates: [{
                                //         field: "noregistrasi",
                                //         aggregate: "count"
                                //     }, {
                                //         field: "namapasien",
                                //         aggregate: "count"
                                //     }]
                                // }
                            });
                        })
                }

            }

            $scope.findData2 = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from2).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.until2).format('YYYY-MM-DD HH:mm');


                // var diterima = ""
                // if ($scope.item.terima2 == true) {
                //     var diterima = "&diterima=" + 'diterima'
                // }
                var dikirim = ""
                if ($scope.item.dikirim2 == true) {
                    var dikirim = "&dikirim=" + 'dikirim'
                }
                var dipinjam = ""
                if ($scope.item.dipinjam2 == true) {
                    var dipinjam = "&dipinjam=" + 'dipinjam'
                }


                medifirstService.get("registrasi/dokumenrm/get-rekap-dokumen-rekmed?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    dikirim +
                    dipinjam).then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.dataRekapDokumen = e.data.data;
                        // $scope.dataRekapDokumen = new kendo.data.DataSource({
                        //     data: e.data,

                        // });
                    })

            }

            function f3() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from3).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.until3).format('YYYY-MM-DD HH:mm');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                var deptId = ""
                if ($scope.item.instalasi != undefined) {
                    var deptId = "&deptId=" + $scope.item.instalasi.id
                }
                var ruangan = ""
                if ($scope.item.ruangan != undefined) {
                    var ruangan = "&ruangId=" + $scope.item.ruangan.id
                }

                var rows = ""
                if ($scope.item.rows != undefined) {
                    var rows = "&rows=" + $scope.item.rows
                }
                var diterima = ""
                if ($scope.item.diterima != undefined) {
                    var diterima = "&diterima=" + $scope.item.diterima
                }
                var dikirim = ""
                if ($scope.item.dikirim != undefined) {
                    var dikirim = "&dikirim=" + $scope.item.dikirim
                }

                medifirstService.get("registrasi/dokumenrm/get-daftar-dokumen-rekmed-belumkembali?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    reg +
                    rm +
                    nama +
                    ruangan +
                    deptId).then(function (e) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < e.data.length; i++) {
                            e.data[i].statCheckbox = false;
                        }
                        $scope.dataPasienBatal2 = new kendo.data.DataSource({
                            data: e.data.data,
                            // pageSize: 10,
                            serverPaging: false,
                            // group: {
                            //     field: "tglmeninggal",
                            //     aggregates: [{
                            //         field: "noregistrasi",
                            //         aggregate: "count"
                            //     }, {
                            //         field: "namapasien",
                            //         aggregate: "count"
                            //     }]
                            // }
                        });
                    })
            }
            $scope.findData3 = function () {
                f3();

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.selectedData = [];
            $scope.selectedData2 = [];
            $scope.onClickold = function (e) {

                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData.length; i++)
                            if ($scope.selectedData[i].norec === dataItem.norec) {
                                $scope.selectedData.splice(i, 1);
                                break;
                            }
                        $scope.selectedData.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData.length; i++)
                        if ($scope.selectedData[i].norec === dataItem.norec) {
                            $scope.selectedData.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }

                if (dataItem["kendali2"].length !== 0) {

                    alert("Dokumen Belum dikembalikan dari ruangan " + dataItem["kendali2"][0]["namaruangan"]);
                    if (checked) {
                        var result = $.grep($scope.selectedData2, function (e) {
                            return e.norec == dataItem.norec;
                        });
                        if (result.length == 0) {
                            $scope.selectedData2.push(dataItem);
                        } else {
                            for (var i = 0; i < $scope.selectedData2.length; i++)
                                if ($scope.selectedData2[i].norec === dataItem.norec) {
                                    $scope.selectedData2.splice(i, 1);
                                    break;
                                }
                            $scope.selectedData2.push(dataItem);
                        }
                        row.addClass("k-state-selected");
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        row.removeClass("k-state-selected");
                    }
                    terima();
                    $scope.winTerima.center().open()
                }
            }
            $scope.onClickTest = function (e) {
                debugger
                 
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                    debugger
                for (var i = test.length - 1; i >= 0; i--) {
                    if (test[i].norec == dataItem.norec) {
                        test.splice(i, 1);
                        break;
                    }
                }
                debugger
                $scope.selectedData.push(dataItem);
                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'kirim',
                    'pasien': $scope.selectedData,
                    'ruanganasalfk': 469,
                    'ruangantujuanfk': dataItem.objectruanganlastfk,
                    'tglkeluar': moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
                 
                medifirstService.post('registrasi/dokumenrm/save-dokumen-rekmed', json).then(function (e) {
                    $scope.pasienBatal = true;
                    $scope.findData();
                }, function error(e) {
                    
                })
               
                for (var i = 0; i < test.length; i++) {
                    test[i].statCheckbox = false;
                }
                
                $scope.dataPasienBatal = new kendo.data.DataSource({
                    data: test,
                    pageSize: 500,
                    serverPaging: false,
                });
                $scope.pasienBatal = false
            }
            $scope.onClick = function (e) {
                debugger
                $scope.isRouteLoading = true;
                if ($scope.isPushOnClick == false) {
                    toastr.error('Proses Penyimpanan sedang berlangsung, Tunggu Sebentar')
                    return;
                }
                $scope.isPushOnClick = false;
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    $scope.selectedData.push(dataItem);
                    var json = {
                        'norec_kdr': '',
                        'pegawaifk': $scope.pegawai.id,
                        'keterangan': '',
                        'statuskendali': 'kirim',
                        'pasien': $scope.selectedData,
                        'ruanganasalfk': 469,
                        'ruangantujuanfk': dataItem.objectruanganlastfk,
                        'tglkeluar': moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    }

                    medifirstService.post('registrasi/dokumenrm/save-dokumen-rekmed', json).then(function (e) {
                        $scope.selectedData = [];
                        if (dataItem.objectruanganlastfk == '569') {
                            $scope.findData();
                        } else {
                            panggilsemua();
                        }
                        $scope.isPushOnClick = true
                        $scope.isRouteLoading = false;
                    }, function error(e) {
                        $scope.isPushOnClick = true
                        $scope.isRouteLoading = false;
                    })
                    $scope.winKirim.close();

                    row.addClass("k-state-selected");
                }
                //  else {
                //     for (var i = 0; i < $scope.selectedData.length; i++)
                //         if ($scope.selectedData[i].norec === dataItem.norec) {
                //             $scope.selectedData.splice(i, 1);
                //             break;
                //         }
                //     row.removeClass("k-state-selected");
                // }


            }

            $scope.onClick2old = function (e) {

                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid2").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec === dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }


            }
            $scope.onClick2 = function (e) {

                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid2").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    $scope.selectedData2.push(dataItem);
                    var json = {
                        'norec_kdr': '',
                        'pegawaifk': $scope.pegawai.id,
                        'keterangan': '',
                        'statuskendali': 'terima',
                        'pasien': $scope.selectedData2,
                        'ruanganterimafk': $scope.item.ruanganTerima.id,
                        'tglkembali': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        'loop': 'y'
                    }
                    medifirstService.post('registrasi/dokumenrm/updatetglterima', json).then(function (e) {
                        $scope.selectedData2 = [];
                        panggilsemua();
                    }, function error(e) {

                    })
                    row.addClass("k-state-selected");
                }


            }
            $scope.columnGrid = {

                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DOKUMENSEDANGDISIAPKAN.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "DOKUMEN SEDANG DISIAPKAN",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                // dataBound: onDataBound,
                columns: [{
                    "field": "nocm",
                    "title": "No Rekam Medis",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                    // "template": "<span class='style-center'>#: namapasien #</span>"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                },

                {
                    "field": "namaayah",
                    "title": "Nama Ayah Kandung",
                    "width": "100px",
                    "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                    // "template": "<span class='style-center'>#: namaayah #</span>"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                // {
                //     "field": "umurzz",
                //     "title": "Umur",
                //     "width":240

                // },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "200px",

                },
                {
                    "field": "notelepon",
                    "title": "No Telepon",
                    "width": "80px",
                    "template": '# if( notelepon==null) {# - # } else {# #= notelepon # #} #'
                },
                {
                    "field": "nohp",
                    "title": "No HP",
                    "width": "80px",
                    "template": '# if( nohp==null) {# - # } else {# #= nohp # #} #'
                },
                ]
            };

            $scope.mainGridOptions = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DOKUMEN SEDANG DISIAPKAN.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "DOKUMEN SEDANG DISIAPKAN",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                // dataBound: onDataBound,
                // selectable: 'row',

                columns: [{
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    "width": 40,
                },
                {
                    field: "tglregistrasi",
                    title: "Tgl Registrasi",
                    template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },

                {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false
                },
                {
                    field: "namaruangan",
                    title: "Ruangan Daftar",
                    hidden: false
                },
                {
                    field: "nocm",
                    title: "No RM",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                },
                {
                    field: "kelompokpasien",
                    title: "Jaminan"
                },
                // {
                //     field: "tgllahir",
                //     title: "Tgl Lahir",
                //     template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                // },
                {
                    field: "jeniskelamin",
                    title: "Jenis Kelamin"
                },
                // {
                //     field: "alamatlengkap",
                //     title: "Alamat"
                // }
                {
                    field: "ruangantujuanx",
                    title: "Ruangan Konsul"
                },
                {
                    field: "tglkeluar",
                    title: "Tanggal Keluar"
                },
                {
                    field: "tglkembali",
                    title: "Tanggal Kembali"
                },
                {
                    field: "selisih",
                    title: "Selisih dari daftar ke kirim"
                },
                {
                    field: "noantrian",
                    title: "No Antrian"
                },
                {
                    field: "catatan",
                    title: "Catatan"
                },
                {
                    field: "statuspelayanan",
                    title: "Cara Daftar"
                },
                {
                    field: "statuspulang",
                    title: "Status Pulang"
                },
                    // {
                    //     // "field": "statuspulang",
                    //     // "title": "Status Pulang",
                    //     // "width": "90px",

                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"terimadokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  'Terima' #</button> ",
                    // },

                ],
                selectable: "row"
            }
            $scope.mainGridOptions11 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DOKUMEN SUDAH DITERIMA.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "DOKUMEN SUDAH DITERIMA",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },

                selectable: 'row',

                columns: [

                    {
                        field: "tglregistrasi",
                        title: "Tgl Registrasi",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },

                    {
                        field: "noregistrasi",
                        title: "No Reg",
                        hidden: false
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan Daftar",
                        hidden: false
                    },
                    {
                        field: "nocm",
                        title: "No RM",
                        hidden: false
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien"
                    },
                    {
                        field: "kelompokpasien",
                        title: "Jaminan"
                    },
                    // {
                    //     field: "tgllahir",
                    //     title: "Tgl Lahir",
                    //     template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    // },
                    {
                        field: "jeniskelamin",
                        title: "Jenis Kelamin"
                    },
                    // {
                    //     field: "alamatlengkap",
                    //     title: "Alamat"
                    // }
                    {
                        field: "ruangantujuanx",
                        title: "Ruangan Konsul"
                    },
                    {
                        field: "tglkeluar",
                        title: "Tanggal Keluar"
                    },
                    {
                        field: "tglkembali",
                        title: "Tanggal Kembali"
                    },
                    {
                        field: "selisih",
                        title: "Selisih dari daftar ke kirim"
                    },
                    {
                        field: "noantrian",
                        title: "No Antrian"
                    },
                    {
                        field: "documents",
                        title: "Dokumen",
                        width: "100px",
                        template: "<button class=\"k-button custom-button\" ng-click=\"documents(dataItem)\"  style=\"margin:0 0 5px\">Dokumen</button> "
                    },
                    {
                        field: "catatan",
                        title: "Catatan"
                    },
                    {
                        field: "statuspulang",
                        title: "Status Pulang"
                    },
                    // {
                    //     // "field": "statuspulang",
                    //     // "title": "Status Pulang",
                    //     // "width": "90px",

                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"terimadokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  'Terima' #</button> ",
                    // },

                ],
                selectable: "row"
            }

            $scope.mainGridOptions2 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DAFTAR DOKUMEN BELUM KEMBALI.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "DAFTAR DOKUMEN BELUM KEMBALI",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,

                columns: [{
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick2($event)' />",
                    "width": 40
                },
                {
                    field: "tglupdate",
                    title: "Tgl Dipinjam",
                    template: "<span class='style-left'>{{formatTanggal('#: tglupdate #')}}</span>"
                },
                {
                    field: "ruangantujuan",
                    title: "Ke Ruangan",
                    hidden: false
                },
                {
                    field: "ruangantujuanx",
                    title: "Ruangan Konsul",
                    hidden: false,
                    width: 200,
                },
                {
                    field: "nocm",
                    title: "No RM",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                },
                {
                    field: "kelompokpasien",
                    title: "Jaminan"
                },
                // {
                //     field: "tgllahir",
                //     title: "Tgl Lahir",
                //     template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                // },
                {
                    field: "jeniskelamin",
                    title: "Jenis Kelamin"
                },
                {
                    field: "name",
                    title: "Status"
                },
                {
                    field: "catatan",
                    title: "Catatan"
                },
                {
                    field: "statuspulang",
                    title: "Status Pulang"
                },
                {
                    "field": "",
                    "title": "Hapus",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"hapusdokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  'Hapus' #</button> ",
                },
                ],
                selectable: "row"
            }
            $scope.riwayatOpt = {

                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 40 },
                    { field: "noregistrasi", title: "No Registrasi", width: 100 },
                    { field: "ruanganasal", title: "Ruangan Asal", width: 80 },
                    { field: "ruangantujuan", title: "Ruangan Tujuan", width: 150 },
                    { field: "status", title: "Status Dokumen", width: 120 },
                    { field: "tglupdate", title: "Tgl Pinjam", template: "<span class='style-left'>{{formatTanggal('#: tglupdate #')}}</span>", width: 120 },
                    { field: "tglkembali", title: "Tgl Kembali", template: "<span class='style-left'>{{formatTanggal('#: tglkembali #')}}</span>", width: 120 },

                    { field: "namalengkap", title: "Pegawai", width: 120 },
                    { field: "catatan", title: "Keterangan", width: 120 },


                ],
            };
            $scope.documents = function (data) {
                //disini
                debugger
                nocm = data.nocm
                medifirstService.get("registrasi/get-ruangan-pasien?norec_pd=" + data.norecpd)
                    .then(function (dat) {
                        $scope.listRuangan = dat.data;
                    });
                medifirstService.get("registrasi/get-data-combo-dokumen?jenisdokumen=EMR")
                    .then(function (dat) {
                        $scope.listDokumen = dat.data;
                    });
                $scope.selectedDocuments = data;
                getListDokumen(data.norecpd)
            }
            function getListDokumen(norec_pd) {
                medifirstService.get("registrasi/get-data-list-dokumen?norec_pd=" + norec_pd)
                    .then(function (dat) {
                        $scope.sourceDataListDokumen = new kendo.data.DataSource({
                            data: dat.data,
                            pageSize: 10,
                            total: dat.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
                $scope.popupDokumen.center().open()
            }

            $scope.terimadokumen = function (dataPasienSelected) {

                if (dataPasienSelected.tglkeluar == "") {
                    toastr.error('Dokumen belum di kirim')
                    return
                }
                if (dataPasienSelected.tglkembali != null) {
                    toastr.error('Dokumen sudah dikirim')
                    return
                }
                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'terima',
                    'pasien': dataPasienSelected,
                    'ruanganterimafk': '469',

                    'tglkembali': moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    'loop': 'x'
                }
                medifirstService.post('registrasi/dokumenrm/updatetglterima', json).then(function (e) {

                }, function error(e) {

                })
                $scope.winTerima2.close();
                panggilsemua();

            }
            $scope.upload = function () {                
                if ($scope.item.tglDokumen == undefined || $scope.item.tglDokumen == "") {
                    toastr.error('Tanggal Dokumen Belum diPilih')
                    return
                }
                if ($scope.item.namaruangan == undefined || $scope.item.namaruangan == "") {
                    toastr.error('Ruangan Pasien Belum diPilih')
                    return
                }
                if ($scope.item.jenisdokumen == undefined || $scope.item.jenisdokumen == "") {
                    toastr.error('Jenis Dokumen Belum diPilih')
                    return
                }
    
                let a = document.getElementById("base64textarea").value
                let b = document.getElementById("base64textarea").name

                if (a == "") {
                    toastr.error('Dokumen Belum diPilih')
                    return
                }
                

                var objData = {
                    nocmfk: $scope.selectedDocuments.nocmfk,
                    namafile: b,
                    base64File: a,
                    norec_pd: $scope.selectedDocuments.norecpd,
                    norec_apd: $scope.selectedDocuments.norecapd,
                    tglDokumen: new moment($scope.item.tglDokumen).format('YYYY-MM-DD HH:mm:ss'),
                    // norecpd: $scope.selectedDocuments.norecpd,
                    objectruanganfk: $scope.item.namaruangan.id,
                    jenisdokumenfk: $scope.item.jenisdokumen.id,
                    // objectjenisdokumencasemix: $scope.item.namadokumen.id,
                    // tglDokumen: $scope.item.tglDokumen
                }

                medifirstService.post('registrasi/upload-dokumen', objData).then(function (e) {
                    getListDokumen($scope.selectedDocuments.norecpd);
                    document.getElementById("base64textarea").value = "";
                    document.getElementById("base64textarea").name = "";
                    document.getElementById("filePicker").value = ""; // Reset nilai input file
                    document.getElementById("filePicker").setAttribute("placeholder", "Choose file"); // Atur placeholder
                    // $scope.sourceDataListDokumen = new kendo.data.DataSource({
                    //     data: e.data.data,
                    //     pageSize: 10,
                    //     total: e.data.data.length,
                    //     serverPaging: false,
                    //     schema: {
                    //         model: {
                    //             fields: {}
                    //         }
                    //     }
                    // });
                })
            }
            $scope.ClosePopUpDokumen = function () {                
                $scope.item.namaruangan = ''
                $scope.item.jenisdokumen = ''
                $scope.item.tglDokumen = ''
                $scope.selectedDocuments.norecpd = ''
                $scope.popupDokumen.center().close()
            }
            $scope.hapusdokumen = function (dataPasienSelected) {
                debugger;
                if (dataPasienSelected.name != "DIKIRIM") {
                    toastr.error('Dokumen sudah diterima POLIKLINIK')
                    return
                }

                var json = {
                    'norec_kdr': dataPasienSelected.norec,
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'terima',
                    'pasien': dataPasienSelected,
                    'ruanganterimafk': '469',
                    'noregistrasi': dataPasienSelected.noregistrasi,

                    'tglkembali': moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    'loop': 'x'
                }
                medifirstService.post('registrasi/dokumenrm/hapuskendali', json).then(function (e) {

                }, function error(e) {

                })
                $scope.winTerima2.close();
                panggilsemua();

            }
            $scope.history = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                medifirstService.get('registrasi/dokumenrm/get-histori-dokumen-rekmed/' + $scope.dataSelected.nocm).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceRiwayat = new kendo.data.DataSource({
                        data: e.data.data,
                        // pageSize: 10,

                    });
                })
                $scope.dataSelected.tgllahir = $scope.formatTanggal($scope.dataSelected.tgllahir)
                $scope.item.pasien = $scope.dataSelected
                $scope.winHistori.center().open()
            }
            $scope.peminjaman = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data dulu')
                    return
                }

                $scope.winPinjam.center().open()
            }

            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            $scope.ruanganLogin = JSON.parse(window.localStorage.getItem('mapLoginUserToRuangan'))
            $scope.simpanPinjam = function () {
                if ($scope.item.keteranganPinjam == undefined) {
                    toastr.error('Keterangan harus di isi')
                    return
                }
                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': $scope.item.keteranganPinjam,
                    'statuskendali': 'pinjam',
                    'pasien': $scope.selectedData,
                }
                medifirstService.post('registrasi/dokumenrm/save-dokumen-rekmed', json).then(function (e) {
                    $scope.selectedData = [];

                }, function error(e) {

                })
                $scope.winPinjam.close();
                panggilsemua();
            }

            $scope.kirim = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data dulu')
                    return
                }

                // if ($scope.ruanganLogin.length > 0) {
                //     $scope.listRuanganAsal = $scope.ruanganLogin
                //     $scope.item.ruanganAsal = $scope.ruanganLogin[0]
                // }
                $scope.winKirim.center().open()
            }
            $scope.simpanKirim = function () {
                if ($scope.item.ruanganTujuan == undefined) {
                    toastr.error('Keterangan harus di isi')
                    return
                }

                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'kirim',
                    'pasien': $scope.selectedData,
                    'ruanganasalfk': $scope.item.ruanganAsal.id,
                    'ruangantujuanfk': $scope.item.ruanganTujuan.id,
                    'tglkeluar': moment(new Date()).format('YYYY-MM-DD HH:mm')
                }
                medifirstService.post('registrasi/dokumenrm/save-dokumen-rekmed', json).then(function (e) {
                    $scope.selectedData = [];
                }, function error(e) {

                })
                $scope.winKirim.close();
                panggilsemua();
            }
            $scope.columnGrid2 = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Dokumen Rekam Medis" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                // filterable: {
                //     extra: false,
                //     operators: {
                //         string: {
                //             contains: "Contains",
                //             startswith: "Starts with"
                //         }
                //     }
                // },
                selectable: 'row',
                pageable: true,
                // dataBound: onDataBound,
                // editable: true,  
                columns: [{
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px",
                },
                {
                    "field": "tglupdate",
                    "title": "Tanggal Pinjam",
                    "width": "50px",
                },
                {
                    "field": "tglkembali",
                    "title": "Tanggal Kembali",
                    "width": "50px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px",
                },
                // {
                //     "field": "kdsirs",
                //     "title": "Kode Sirs",
                //     "width": "50px",
                // },
                {
                    "field": "name",
                    "title": "Status Kendali",
                    "width": "50px",
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "80px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "80px",
                },
                {
                    "field": "catatan",
                    "title": "catatan",
                    "width": "80px",
                }
                ],
                selectable: "row"

            };

            function terima() {
                if ($scope.selectedData2.length == 0) {
                    toastr.error('Ceklis data dulu')
                    return
                }
                // if ($scope.ruanganLogin.length > 0) {
                //     $scope.listRuanganTerima = $scope.ruanganLogin
                //     $scope.item.ruanganTerima = $scope.ruanganLogin[0]
                // }
            }
            $scope.terima = function () {
                terima();
                $scope.winTerima2.center().open()
            }
            $scope.simpanTerima = function () {

                if ($scope.item.ruanganTerima == undefined) {
                    toastr.error('Keterangan harus di isi')
                    return
                }
                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'terima',
                    'pasien': $scope.selectedData2,
                    'ruanganterimafk': $scope.item.ruanganTerima.id,
                    'tglkembali': moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    'loop': 'y'
                }
                medifirstService.post('registrasi/dokumenrm/updatetglterima', json).then(function (e) {

                }, function error(e) {

                })
                $scope.winTerima.close();
                panggilsemua();
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
            // $scope.cetakLabel = function () {
            //     var client = new HttpClient();
            //     // client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-labelpasien-satubynocm=1&nocm='+$scope.dataSelected.nocm , function(response) {
            //     //       // aadc=response;

            //     // });
            //     client.get(' http://127.0.0.1:1237/printvb/rekammedis?cetak-labelpasien-satubynocm=1&norec=' + $scope.dataSelected.nocm + '&view=false&qty=1', function (response) {
            //         // aadc=response;
            //     });
            // }

            // $scope.cetakFormKunjungan = function () {

            //     var client = new HttpClient();

            //     client.get(' http://127.0.0.1:1237/printvb/Pendaftaran?cetak-form-kunjungan-pasien-byNorecPd=1&norec=' + $scope.dataSelected.norecpd + '&view=1', function (response) {
            //         // aadc=response;
            //     });
            // }
            // $scope.cetakFormKunjungan2 = function () {

            //     var client = new HttpClient();

            //     client.get(' http://127.0.0.1:1237/printvb/Pendaftaran?cetak-form-kunjungan-pasien-byNorecPd=1&norec=' + $scope.dataSelected2.norecpd + '&view=1', function (response) {
            //         // aadc=response;
            //     });
            // }
            $scope.cetakFormKunjungan = function () {
                debugger
                $scope.isRouteLoading = true;
                // $scope.dataSelected.norec
                var norec = $scope.dataSelected.norecpd
                // var total = $scope.dataSelected.total
                // uang = parseFloat(total).toFixed();
                // var totalUang = $scope.formatRupiahx(uang, 'Rp. ');
                // var newValue = uang;
                // var terbilang = ""
                // medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
                //     function (dat) {
                        // terbilang = dat.data.terbilang.toUpperCase();
debugger
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "alamatRS", "norec"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.dataSelected.norecpd],
                            "paramType": ["", "", "", ""]
                        };
                        //debugger
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {

                                // cetakttd();
                                //this.response is what you're looking for
                                // handler(this.response);
                                console.log(this.response, typeof this.response);
                                //var res = this.response
                                //var file = new Blob( [res], {type: 'application/pdf'});
                                //debugger;
                                var url = window.URL.createObjectURL(this.response)
                                var pdf = document.getElementById('tempatLaporan');
                                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }
                        // if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                        //     xhr.open('POST', 'http://192.168.1.7:8797/generic/report/formkunjunganrm.pdf');
                        // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/formkunjunganrm.pdf');
                        // } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        //     xhr.open('POST', 'http://10.10.20.167:8797/generic/report/formkunjunganrm.pdf');
                        // } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        //     xhr.open('POST', 'http://202.51.105.98:8797/generic/report/formkunjunganrm.pdf');
                        // } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                        //     xhr.open('POST', 'http://10.5.1.2:8797/generic/report/formkunjunganrm.pdf');
                        // } else {
                        //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/formkunjunganrm.pdf');
                        // }
                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/formkunjunganrm.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/formkunjunganrm.pdf');
                        }
                        //debugger
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    // })


            }
            $scope.cetakFormKunjungan2 = function () {

                var client = new HttpClient();

                client.get(' http://127.0.0.1:1237/printvb/Pendaftaran?cetak-form-kunjungan-pasien-byNorecPd=1&norec=' + $scope.dataSelected2.norecpd + '&view=1', function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakTracer = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Dulu NoRegistrasi Pasien')
                    return
                }
                if ($scope.dataSelected.noregistrasi != undefined) {

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.cetakTracer2 = function () {
                if ($scope.dataSelected2 == undefined) {
                    toastr.error('Pilih Dulu NoRegistrasi Pasien')
                    return
                }
                if ($scope.dataSelected2.noregistrasi != undefined) {

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected2.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.labelpasien = function () {
                // if($scope.item != undefined){
                //     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')
                // }
                debugger
                $scope.dats = {
                    qty: 0
                }
                $scope.dialogCetakLabel.center().open();
            }
            $scope.pilihQty2 = function () {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))" +
                    'where noregistrasi = ' + "'" + $scope.dataSelected.noregistrasi + "'"
                Labelpasienjaspera4(sintak)
            }
            function Labelpasienjaspera4(datas) {
                var qrcode = $scope.dataSelected.noregistrasi
                var norec = $scope.dataSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.dataSelected.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }


                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasienA4.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasienA4.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }
             function Labelpasienjasper(datas) {
                var qrcode = $scope.dataSelected.noregistrasi
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataSelected.noregistrasi
                var norec = $scope.dataSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.dataSelected.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasien.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
             $scope.pilihQty = function (data) {
                let query = "";
                loopCetakan(data, query)
                // var listRawRequired = [
                //  "dats.qty|k-ng-model|kuantiti"
                // ];
                // var isValid = ModelItem.setValidation($scope, listRawRequired);
                // debugger

                // if (isValid.status) {
                //  var qty = data.qty;
                //  var qtyhasil = data.qty * 2;
                //  if (qty !== undefined) {
                //      // var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
                //      // window.open(fixUrlLaporan, '', 'width=800,height=600')
                //      //cetakan langsung service VB6 by grh

                //      //##save identifikasi label pasien
                //      medifirstService.get("registrasi/identifikasi-label?norec_pd="
                //          + $scope.dataSelected.norec + '&islabel=' + qtyhasil
                //      ).then(function (data) {
                //          var datas = data.data;
                //          loopCetakan(datas, query)
                //      })

                //      // loopCetakan(dats.qty, query)
                //      //##end

                //      // var client = new HttpClient();
                //      // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
                //      //  // do something with response
                //      // });

                //  }
                //  $scope.dialogCetakLabel.close();
                // } else {
                //  ModelItem.showMessages(isValid.messages);
                // }
            };
            function loopCetakan(data, query) {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMmon-YYYY'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))"
                for (let i = 1; data.qty >= i; i++) {

                    // for (const item of data) {
                    // query = ``
                    if (queryjadi == "") {
                        // queryjadi = 'SELECT * from "V_labelPasien" where noregistrasi = ' + $scope.dataSelected.noregistrasi;
                        queryjadi = sintak + 'where noregistrasi = ' + "'" + $scope.dataSelected.noregistrasi + "'";
                    } else {
                        // queryjadi = $queryjadi + " UNION ALL SELECT * from V_labelPasien where noregistrasi = " + $scope.dataSelected.noregistrasi;
                        queryjadi = queryjadi + " UNION ALL " + sintak + 'where noregistrasi = ' + "'" + $scope.dataSelected.noregistrasi + "'";
                    }
                }
                Labelpasienjasper(queryjadi)
            }
            // $scope.cetakTracer = function () {
            //     if ($scope.dataSelected == undefined) {
            //         toastr.error('Pilih Dulu NoRegistrasi Pasien')
            //         return
            //     }
            //     if ($scope.dataSelected.noregistrasi != undefined) {

            //         //cetakan langsung service VB6 by grh    
            //         var client = new HttpClient();
            //         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected.noregistrasi + '&view=false', function (response) {
            //             // do something with response
            //         });
            //     }
            // }
            // $scope.cetakTracer2 = function () {
            //     if ($scope.dataSelected2 == undefined) {
            //         toastr.error('Pilih Dulu NoRegistrasi Pasien')
            //         return
            //     }
            //     if ($scope.dataSelected2.noregistrasi != undefined) {

            //         //cetakan langsung service VB6 by grh    
            //         var client = new HttpClient();
            //         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected2.noregistrasi + '&view=false', function (response) {
            //             // do something with response
            //         });
            //     }
            // }
            $scope.cetakulangtracer = function () {
                debugger
                var noregistrasi = $scope.dataSelected.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noregistrasi"],
                    "paramValue": [$scope.dataSelected.noregistrasi,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakulangtracer.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakulangtracer.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.cetakulangtracer2 = function () {
                debugger
                var noregistrasi = $scope.dataSelected2.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noregistrasi"],
                    "paramValue": [$scope.dataSelected2.noregistrasi,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakulangtracer.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakulangtracer.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.simpanTerima2 = function () {

                if ($scope.item.ruanganTerima == undefined) {
                    toastr.error('Keterangan harus di isi')
                    return
                }
                var json = {
                    'norec_kdr': '',
                    'pegawaifk': $scope.pegawai.id,
                    'keterangan': '',
                    'statuskendali': 'terima',
                    'pasien': $scope.selectedData2,
                    'ruanganterimafk': $scope.item.ruanganTerima.id,
                    'tglkembali': moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    'loop': 't'
                }
                medifirstService.post('registrasi/dokumenrm/updatetglterima', json).then(function (e) {

                }, function error(e) {

                })
                $scope.winTerima2.close();
                panggilsemua();
            }

            function panggilsemua() {
                $scope.findData();
                $scope.findData2();
                f3();
            }
            // $scope.$watch('item.noRm', function (e) {
            //     //  
            //     if (e.length <= 7) return;
            //      $scope.onClick();
            // });

            // //////////////
        }
    ]);

});