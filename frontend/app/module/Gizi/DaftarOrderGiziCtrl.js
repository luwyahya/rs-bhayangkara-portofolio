define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderGiziCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            // $scope.dataPasienSelected = {};
            $scope.item.jmlRows = 50
            $scope.isRouteLoading = false;
            var dataMenuSiklus = [];
            var data2 = [];
            var addDataDetail = [];
            $scope.istempatLaporan = true;
            $scope.istempatLaporan2 = true;

            loadCombo();
            loadData();

            function loadCombo() {
                var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
                if (chacePeriode != undefined) {

                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }

                medifirstService.get("gizi/get-combo", false).then(function (data) {
                    $scope.listKelas = data.data.kelas;
                    $scope.listDepartemen = data.data.departemen;
                    $scope.item.instalasi = data.data.departemen[36]
                    $scope.listJenisDiet = data.data.jenisdiet;
                    $scope.listJenisDiet1 = data.data.jenisdiet;
                    $scope.listJenisDiet2 = data.data.jenisdiet;

                    $scope.listKategoriDiet = data.data.kategorydiet;
                    $scope.listJenisWaktu = data.data.jeniswaktu;
                    $scope.listMenu = data.data.produk;
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatTanggalNoTime = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function () {
                loadData()
            }
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'BELUM') { $(this).addClass('red') }
                    if ($(this).text() == 'SUDAH') { $(this).addClass('green') }
                    if ($(this).text() == 'KURANG') { $(this).addClass('yellow') }

                })
            }
            $scope.SearchData2 = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                medifirstService.get("gizi/get-daftar-order2?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data
                        var no = 0;

                        $scope.sourceGridx = new kendo.data.DataSource({
                            data: result,
                            // pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,
                            schema: {
                                model: {

                                }
                            },


                        });
                        $scope.selectedOnCheck = [];
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });
                $scope.popupgizi2.center().open();
            }
            $scope.SearchData3 = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                medifirstService.get("gizi/get-daftar-order2x?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data
                        var no = 0;

                        $scope.sourceGridxx = new kendo.data.DataSource({
                            data: result,
                            // pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,
                            schema: {
                                model: {

                                }
                            },


                        });
                        $scope.selectedOnCheck = [];
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });
                $scope.popupgizi3.center().open();
            }
            $scope.verifikasigrid = function (dataPasienSelected) {


                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var objectruanganfk = dataPasienSelected.objectruanganfk;
                medifirstService.get("gizi/get-daftar-order3?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&objectruanganfk=" + objectruanganfk)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data
                        var no = 0;

                        for (var i = result.length - 1; i >= 0; i--) {
                            // no= no+1;
                            result[i].no = i + 1;


                        }
                        debugger;

                        $scope.sourceGrid2 = new kendo.data.DataSource({
                            data: result,
                            // pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,
                            schema: {
                                model: {

                                }
                            },


                        });

                    });

                $scope.popupgizi.center().open();

            }
            $scope.verifikasigrid2 = function (dataPasienSelected) {


                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var objectruanganfk = dataPasienSelected.objectruanganfk;
                medifirstService.get("gizi/get-daftar-order3x?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&objectruanganfk=" + objectruanganfk)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data
                        var no = 0;

                        for (var i = result.length - 1; i >= 0; i--) {
                            // no= no+1;
                            result[i].no = i + 1;


                        }
                        debugger;

                        $scope.sourceGrid2x = new kendo.data.DataSource({
                            data: result,
                            // pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,
                            schema: {
                                model: {

                                }
                            },


                        });

                    });

                $scope.popupgizix.center().open();

            }

            function loadData() {
                dataMenuSiklus = [];
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }
                var noorder = ""
                if ($scope.item.noOrder != undefined) {
                    noorder = "&noorder=" + $scope.item.noOrder
                }
                var jenisDietId = ""
                if ($scope.item.jenisDiets != undefined) {
                    jenisDietId = "&jenisDietId=" + $scope.item.jenisDiets.id
                }
                var kategoriDiet = ""
                if ($scope.item.kategoriDiet != undefined) {
                    kategoriDiet = "&kategoriDietId=" + $scope.item.kategoriDiet.id
                }
                var jenisWaktuId = ""
                if ($scope.item.jenisWaktu != undefined) {
                    jenisWaktuId = "&jenisWaktuId=" + $scope.item.jenisWaktu.id
                }
                var jmlRows = ""
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = "&jmlRows=" + $scope.item.jmlRows
                }
                var isPulang = ""
                if ($scope.item.isPulang != undefined) {
                    isPulang = "&isPulang=" + $scope.item.isPulang
                }
                debugger
                medifirstService.get("gizi/get-daftar-order?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    reg + rm + nm + ins + rg + kp + dk + noorder +
                    jenisDietId + kategoriDiet + jenisWaktuId +
                    jmlRows + isPulang)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data.data
                        for (var i = 0; i < result.length; i++) {
                            result[i].no = i + 1
                            result[i].statCheckbox = false
                            var tanggal = new Date(result[i].tglregistrasi);
                            var tanggalLahir = new Date(result[i].tgllahir);
                            var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                            result[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                            // if (result[i].strukkirimfk != null)
                            // 	result[i].status= "✔" ;
                            // else
                            // 	result[i].status= "✘" ;
                        }
                        $scope.sourceGrid = new kendo.data.DataSource({
                            data: result,
                            // pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,
                            schema: {
                                model: {

                                }
                            },


                        });
                        $scope.selectedOnCheck = [];
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });

            };
            $scope.group = {
                field: "jeniswaktu",
                aggregates: [{
                    field: "jeniswaktu",
                    aggregate: "count"
                }]
            };
            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.sourceGrid._data, function (data) {
                    return data.norec_op == dataItem.norec_op;
                });
                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
                        if (dataSelect.norec_op == $scope.selectedOnCheck[i].norec_op) {
                            $scope.selectedOnCheck.splice([i], 1)
                            break
                        }
                    }
                } else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedOnCheck.push(dataSelect)
                }


                /*GET MENU */
                if (dataSelect.statCheckbox) {
                    var tglMenu = moment(dataSelect.tglmenu).format('YYYY-MM-DD');
                    var arrTgl = tglMenu.split('-');
                    // var arrTgl = tglMenu.split('-');
                    if (arrTgl[2] == 31) {
                        arrTgl[2] = 11;
                    } else if ((arrTgl[2] % 10) == 0) {
                        arrTgl[2] = 10;
                    } else {
                        arrTgl[2] = arrTgl[2] % 10;
                    }
                    medifirstService.get("gizi/get-produk-menudiet?jenisDietId=" +
                        dataSelect.objectjenisdietfk +
                        "&kelasId=" + dataSelect.objectkelasfk +
                        "&siklusKe=" + arrTgl[2] +
                        "&jenisWaktuId=" + dataSelect.objectjeniswaktufk +
                        "&kategoryDiet=" + dataSelect.objectkategorydietfk +
                        "&norec_op=" + dataSelect.norec_op +
                        "&norec_pd=" + dataSelect.norec_pd
                    ).then(function (e) {
                        var result = e.data.data
                        result.forEach(function (res) {
                            dataMenuSiklus.push(res)

                        })
                        console.log(JSON.stringify(dataMenuSiklus));

                    })
                } else {
                    for (var i = dataMenuSiklus.length - 1; i >= 0; i--)
                        if (dataMenuSiklus[i].norec_op === dataSelect.norec_op) {
                            dataMenuSiklus.splice(i, 1);
                            // break;
                        }
                    row.removeClass("k-state-selected");
                    console.log(JSON.stringify(dataMenuSiklus));
                }

                /*end Get */
                console.log($scope.sourceGrid)
            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceGrid._data;
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedOnCheck = []
                    }
                } else {
                    isCheckAll = true;

                    for (var i = 0; i < tempData.length; i++) {

                        tempData[i].statCheckbox = true;
                        $scope.selectedOnCheck.push(tempData[i])

                        var tglMenu = moment(tempData[i].tglmenu).format('YYYY-MM-DD');
                        var arrTgl = tglMenu.split('-');
                        medifirstService.get("gizi/get-produk-menudiet?jenisDietId=" +
                            tempData[i].objectjenisdietfk +
                            "&kelasId=" + tempData[i].objectkelasfk +
                            "&siklusKe=" + arrTgl[2] +
                            "&jenisWaktuId=" + tempData[i].objectjeniswaktufk +
                            "&norec_op=" + tempData[i].norec_op +
                            "&norec_pd=" + tempData[i].norec_pd
                        ).then(function (e) {
                            var result = e.data.data
                            result.forEach(function (res) {
                                dataMenuSiklus.push(res)

                            })
                            console.log(JSON.stringify(dataMenuSiklus));

                        })
                    }
                }
                console.log($scope.selectedOnCheck)
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: true,
                });
                var grid = $('#kGrid').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarOrderGizi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Order Gizi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                // dataBound: onDataBound,
                columns: [{
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                        "# } #",
                    width: "30px"
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "80px"
                },
                {
                    "field": "tglmenu",
                    "title": "Tgl Menu",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglmenu #')}}</span>"
                    // "template": "<span class='style-center'>{{formatTanggalNoTime('#: tglmenu #')}}</span>"
                },
                {
                    "field": "jeniswaktu",
                    "title": "Jenis Waktu",
                    "width": "60px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Regis",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Reg",
                    "width": "80px",
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px",
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "80px",
                },
                {
                    "field": "tgllahir",
                    "title": "Tgl Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "80px",
                },
                {
                    "field": "namakelas",
                    "title": "Kelas",
                    "width": "50px",
                },
                {
                    "field": "kategorydiet",
                    "title": "Kategori Diet",
                    "width": "80px",
                },
                {
                    "field": "jenisdiet",
                    "title": "Jenis Diet 1",
                    "width": "80px"
                },
                {
                    "field": "jenisdiet1",
                    "title": "Jenis Diet 2",
                    "width": "80px"
                },
                {
                    "field": "jenisdiet2",
                    "title": "Jenis Diet 3",
                    "width": "80px"
                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "60px"
                },
                // {
                // 	"field": "pegawaiorder",
                // 	"title": "Pengorder",
                // 	"width":"100px",
                // 	"template": "<span class='style-left'>#: pegawaiorder #</span>"
                // },	
                {
                    "field": "jenisorder",
                    "title": "Jenis Order",
                    "width": "70px"
                },
                // ,
                // {
                // 	"field": "cc",
                // 	"title": "CC",
                // 	"width": "50px"
                // },
                // {
                // 	"field": "volume",
                // 	"title": "Frekuensi",
                // 	"width": "50px"
                // },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px"
                },
                {
                    "field": "nokirim",
                    "title": "No Kirim",
                    "width": "80px",
                    "template": '# if( nokirim==null) {# - # } else {# #= nokirim # #} #'
                },
                ]
            };

            $scope.columnGridxx = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarOrderGizi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Order Gizi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "80px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "pasien",
                    "title": "Jumlah Pasien",
                    "width": "80px"
                },
                {
                    "field": "pagi",
                    "title": "Makan Siang + Sore [Susulan]",
                    "width": "60px",
                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid2(dataItem)\"  style=\"margin:0 0 5px\" >#:  pagi #</button> ",
                },
                {
                    "field": "statuspagi",
                    "title": "Makan Siang + Sore [Susulan]",
                    "width": "60px",


                },
                {
                    "field": "malam",
                    "title": "Makan Pagi [Susulan]",
                    "width": "60px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid2(dataItem)\"  style=\"margin:0 0 5px\" >#:  malam #</button> ",
                },
                {
                    "field": "statusmalam",
                    "title": "Makan Pagi [Susulan]",
                    "width": "60px",

                },


                ]
            };

            $scope.columnGridx = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarOrderGizi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Order Gizi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "80px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "pasien",
                    "title": "Jumlah Pasien",
                    "width": "80px"
                },
                {
                    "field": "pagi",
                    "title": "Snack Pagi, Makan Siang & Snack Sore",
                    "width": "60px",
                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  pagi #</button> ",
                },
                {
                    "field": "statuspagi",
                    "title": "Jumlah Order Snack Pagi, Makan Siang & Snack Sore",
                    "width": "60px",


                },
                {
                    "field": "malam",
                    "title": "Makan Malam & Makan Pagi",
                    "width": "60px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  malam #</button> ",
                },
                {
                    "field": "statusmalam",
                    "title": "Jumlah Order Makan Malam & Makan Pagi",
                    "width": "60px",

                },


                ]
            };
            $scope.columnGrid2 = {

                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "no",
                    "title": "NO",
                    "width": "20px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "80px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "nocm",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "namapasien",
                    "width": "60px"
                },

                {
                    "field": "statuspagi",
                    "title": "Snack Pagi, Makan Siang & Snack Sore",
                    "width": "60px"
                },
                {
                    "field": "tglpelayananawalpagi",
                    "title": "Jam Order",
                    "width": "60px",

                    // "template": "<span class='style-left'>{{formatTanggal('#: tglpelayananawalpagi #')}}</span>"
                },

                {
                    "field": "statusmalam",
                    "title": "Makan Malam & Makan Pagi",
                    "width": "60px"
                },
                {
                    "field": "tglpelayananawamalam",
                    "title": "Jam Order",
                    "width": "60px",

                    // "template": "<span class='style-left'>{{formatTanggal('#: tglpelayananawamalam #')}}</span>"
                },

                {
                    "field": "tglpulang",
                    "title": "tglpulang",
                    "width": "60px"
                }

                ]
            };
            $scope.columnGrid2x = {

                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "no",
                    "title": "NO",
                    "width": "20px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "80px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "nocm",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "namapasien",
                    "width": "60px"
                },

                {
                    "field": "statuspagi",
                    "title": "Makan Siang + Sore [Susulan]",
                    "width": "60px"
                },
                {
                    "field": "tglpelayananawalpagi",
                    "title": "Jam Order",
                    "width": "60px",

                    // "template": "<span class='style-left'>{{formatTanggal('#: tglpelayananawalpagi #')}}</span>"
                },

                {
                    "field": "statusmalam",
                    "title": "Makan Pagi [Susulan]",
                    "width": "60px"
                },
                {
                    "field": "tglpelayananawamalam",
                    "title": "Jam Order",
                    "width": "60px",

                    // "template": "<span class='style-left'>{{formatTanggal('#: tglpelayananawamalam #')}}</span>"
                },

                {
                    "field": "tglpulang",
                    "title": "tglpulang",
                    "width": "60px"
                }

                ]
            };
            $scope.kirim = function () {
                if ($scope.selectedOnCheck.length == 0) {
                    toastr.error('Ceklis data yang mau dikirim !')
                    return
                }
                if (dataMenuSiklus.length == 0) {
                    toastr.info('Siklus Menu tidak ada !')

                }

                $scope.getSiklusMenus()
                $scope.popUpMenu.center().open();
                var actions = $scope.popUpMenu.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpMenu.setOptions({ actions: actions });
            }

            $scope.columnGridMenu = [
                // {
                // 	"template": "<input type='checkbox' class='checkbox' ng-click='onClickDetails($event)' />",
                // 	"width": 30
                // },
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Menu",
                    "width": "100px"
                },
                {
                    "field": "qtyproduk",
                    "title": "Jumlah",
                    "width": "40px",

                },

            ];

            $scope.tambah = function () {
                if ($scope.item.qtyProduk == 0) {
                    toastr.error("Qty harus di isi!")
                    return;
                }

                if ($scope.item.namaProduk == undefined) {
                    toastr.error("Pilih Menu terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                // if ($scope.souceGridMenu == undefined) {
                // 	nomor = 1
                // }else{
                nomor = data2.length + 1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.produkfk = $scope.item.namaProduk.id
                            data.namaproduk = $scope.item.namaProduk.namaproduk
                            data.qtyproduk = parseFloat($scope.item.qtyProduk)
                            data2[i] = data;
                            $scope.souceGridMenu = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.namaProduk.id,
                        namaproduk: $scope.item.namaProduk.namaproduk,
                        qtyproduk: parseFloat($scope.item.qtyProduk),
                    }
                    data2.push(data)
                    $scope.souceGridMenu = new kendo.data.DataSource({
                        data: data2
                    });
                }
                clear();
            }
            $scope.klikMenu = function (dataSelectedMenu) {
                var dataMenu = [];

                $scope.item.no = dataSelectedMenu.no
                for (var i = $scope.listMenu.length - 1; i >= 0; i--) {
                    if ($scope.listMenu[i].id == dataSelectedMenu.produkfk) {
                        dataMenu = $scope.listMenu[i]
                        break;
                    }
                }
                $scope.item.namaProduk = dataMenu;
                $scope.item.qtyProduk = parseFloat(dataSelectedMenu.qtyproduk)
            }
            $scope.hapus = function () {
                if ($scope.item.qtyProduk == 0) {
                    toastr.error("Qty harus di isi!")
                    return;
                }

                if ($scope.item.namaProduk == undefined) {
                    toastr.error("Pilih Data terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                // if ($scope.souceGridMenu == undefined) {
                // 	nomor = 1
                // }else{
                nomor = data2.length + 1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            $scope.souceGridMenu = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                }
                clear();
            }

            function clear() {
                delete $scope.item.namaProduk
                delete $scope.item.qtyProduk
                delete $scope.item.no
            }
            $scope.batal = function () {
                data2 = []
                $scope.souceGridMenu = new kendo.data.DataSource({
                    data: data2
                });
                clear();
            }

            $scope.$watch('item.qtyProduk', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.qtyProduk < 0) {
                        $scope.item.qtyProduk = "";
                    }
                }
            })



            $scope.selectedOnCheck = [];
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);


                /*GET MENU */
                if (checked) {
                    var tglMenu = moment(dataItem.tglmenu).format('YYYY-MM-DD');
                    var arrTgl = tglMenu.split('-');

                    // var arrTgl = tglMenu.split('-');
                    if (arrTgl[2] == 31) {
                        arrTgl[2] = 11;
                    } else if ((arrTgl[2] % 10) == 0) {
                        arrTgl[2] = 10;
                    } else {
                        arrTgl[2] = arrTgl[2] % 10;
                    }
                    medifirstService.get("gizi/get-produk-menudiet?jenisDietId=" +
                        dataItem.objectjenisdietfk +
                        "&kelasId=" + 6 //dataItem.objectkelasfk 
                        +
                        "&siklusKe=" + arrTgl[2] +
                        "&jenisWaktuId=" + dataItem.objectjeniswaktufk +
                        "&kategoryDiet=" + dataItem.objectkategorydietfk +
                        "&norec_op=" + dataItem.norec_op +
                        "&norec_pd=" + dataItem.norec_pd
                    ).then(function (e) {
                        var result = e.data.data
                        result.forEach(function (res) {
                            dataMenuSiklus.push(res)

                        })
                        console.log(JSON.stringify(dataMenuSiklus));

                    })
                } else {
                    for (var i = dataMenuSiklus.length - 1; i >= 0; i--)
                        if (dataMenuSiklus[i].norec_op === dataItem.norec_op) {
                            dataMenuSiklus.splice(i, 1);
                            // break;
                        }
                    row.removeClass("k-state-selected");
                    console.log(JSON.stringify(dataMenuSiklus));
                }

                /*end Get */

                if (checked) {
                    var result = $.grep($scope.selectedOnCheck, function (e) {
                        return e.norec_op == dataItem.norec_op;
                    });
                    if (result.length == 0) {
                        $scope.selectedOnCheck.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedOnCheck.length; i++)
                            if ($scope.selectedOnCheck[i].norec_op === dataItem.norec_op) {
                                $scope.selectedOnCheck.splice(i, 1);
                                break;
                            }
                        $scope.selectedOnCheck.push(dataItem);
                    }
                    row.addClass("k-state-selected");



                } else {
                    for (var i = 0; i < $scope.selectedOnCheck.length; i++)
                        if ($scope.selectedOnCheck[i].norec_op === dataItem.norec_op) {
                            $scope.selectedOnCheck.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.getSiklusMenus = function () {

                var qtyProduk = 0
                var totalMenu = 0;
                var dataDetail = [];
                var dataDetail2 = [];
                var adaDetail = 0;
                if (dataMenuSiklus.length > 0) {

                    for (var i = 0; i < dataMenuSiklus.length; i++) {
                        totalMenu = totalMenu + 1;
                        adaDetail = 0
                        for (var x = 0; x < dataDetail2.length; x++) {
                            if (dataDetail2[x].produkfk == dataMenuSiklus[i].produkfk) {
                                dataDetail2[x].qtyproduk = parseFloat(dataDetail2[x].qtyproduk) + parseFloat(dataMenuSiklus[i].qtyproduk)
                                adaDetail = 1;
                            }
                        };
                        if (adaDetail == 0) {
                            dataDetail = {
                                "produkfk": dataMenuSiklus[i].produkfk,
                                "namaproduk": dataMenuSiklus[i].namaproduk,
                                "qtyproduk": dataMenuSiklus[i].qtyproduk,
                                "norec_op": dataMenuSiklus[i].norec_op,

                            }
                            dataDetail2.push(dataDetail)
                        }
                    }

                }

                for (var i = 0; i < dataDetail2.length; i++) {
                    dataDetail2[i].no = i + 1
                }
                data2 = dataDetail2;
                $scope.souceGridMenu = new kendo.data.DataSource({
                    data: data2
                });

            }
            $scope.rekaphariangizi = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                var kondisi = "tglorder between '" + tglAwal + "' and '" + tglAkhir + "'";
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["tglawal", "tglakhir", "kondisi"],
                    "paramValue": [tglAwal, tglAkhir, kondisi],
                    "paramType": ["", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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

                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekaphariangizi.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/rekaphariangizi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.rekapgizikelas = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var kondisi = "tglorder between '" + tglAwal + "' and '" + tglAkhir + "'";
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["tglawal", "tglakhir", "kondisi"],
                    "paramValue": [tglAwal.toString(), tglAkhir.toString(), kondisi],
                    "paramType": ["", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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

                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapgizikelas.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/rekapgizikelas.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.rekapitulasi = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var kondisi = "tglorder between '" + tglAwal + "' and '" + tglAkhir + "'";
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["tglawal", "tglakhir", "kondisi"],
                    "paramValue": [tglAwal.toString(), tglAkhir.toString(), kondisi],
                    "paramType": ["", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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

                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/orderkelasgizi.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/orderkelasgizi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.cetakJasper = function () {
                debugger
                if ($scope.selectedOnCheck.length == 0) {
                    toastr.error('Ceklis data yang mau dicetak					 !')
                    return
                }
                var DataGizi = []
                var umur = [];
                for (var i = $scope.selectedOnCheck.length - 1; i >= 0; i--) {
                    if (DataGizi == "") {
                        DataGizi = "'" + $scope.selectedOnCheck[i].norec_op + "'";
                        umur = "'" + $scope.selectedOnCheck[i].umurzz + "'";
                    } else {
                        DataGizi = DataGizi + ',' + "'" + $scope.selectedOnCheck[i].norec_op + "'";
                        umur = umur + ',' + "'" + $scope.selectedOnCheck[i].umurzz + "'";
                    }


                }

                if ($scope.selectedOnCheck.length != 0) {

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["norec", "umur"],
                        "paramValue": [DataGizi, umur],
                        "paramType": ["", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/labelGizi.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/labelGizi.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:1002/generic/report/labelGizi.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:1002/generic/report/labelGizi.pdf');
                    } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/labelGizi.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelGizi.pdf');
                    }

                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;


                    $scope.isRouteLoading = false;
                }

            }

            $scope.selectedDetails = [];
            $scope.onClickDetails = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridDetails").data("kendoGrid"),
                    dataItem = grid.dataItem(row);


                if (checked) {
                    var result = $.grep($scope.selectedDetails, function (e) {
                        return e.norec_op == dataItem.norec_op;
                    });
                    if (result.length == 0) {
                        $scope.selectedDetails.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedDetails.length; i++)
                            if ($scope.selectedDetails[i].norec_op === dataItem.norec_op) {
                                $scope.selectedDetails.splice(i, 1);
                                break;
                            }
                        $scope.selectedOnCheck.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDetails.length; i++)
                        if ($scope.selectedDetails[i].norec_op === dataItem.norec_op) {
                            $scope.selectedDetails.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            $scope.saveKirimMenu = function () {
                // if (data2.length == 0) {
                // 	toastr.error("Pilih Menu terlebih dahulu!!")
                // 	return
                // }
                // if ($scope.item.jenisWaktu == undefined) {
                // 	toastr.error("Pilih Jenis Waktu terlebih dahulu!!")
                // 	return
                // }
                var norec_sk = "";
                if ($scope.norecSK != undefined) {
                    norec_sk = $scope.norecSK
                }
                // for (var i = 0; i < $scope.selectedOnCheck.length; i++) {
                // 	$scope.selectedOnCheck[i].objectjeniswaktufk = $scope.item.jenisWaktu.id
                // }
                var objSave = {
                    "norec_sk": norec_sk,
                    "objectruanganasalfk": $scope.selectedOnCheck[0].objectruangantujuanfk,
                    // "objectruangantujuanfk" :$scope.dataPasienSelected.objectruanganfk,
                    // "norec_pd" : $scope.item.pasien.norec_pd,
                    "keterangan": $scope.item.keterangan != undefined ? $scope.item.keterangan : '',
                    "qtyproduk": data2.length,
                    // "objectjeniswaktufk": $scope.item.jenisWaktu.id,
                    "details": data2,
                    "datapasien": $scope.selectedOnCheck,
                }
                var post = {
                    "strukkirim": objSave
                }
                medifirstService.post('gizi/save-kirimmenu-gizi', post).then(function (e) {
                    if (e.status == 201) {
                        $scope.noKirim = e.data.nokirim.norec
                        var dataz = {};
                        $scope.showLabel = true;
                        loadData();
                        $scope.selectedOnCheck = [];
                        dataMenuSiklus = [];
                    }

                })
                if ($scope.selectedOnCheck.length != 0) {
                    var DataGizi = ''
                    for (var i = $scope.selectedOnCheck.length - 1; i >= 0; i--) {
                        DataGizi = DataGizi + ',' + "'" + $scope.selectedOnCheck[i].norec_op + "'"
                    }

                    var norec = DataGizi;
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/gizi?cetak-label-gizi=' + norec + '&view=' + 'false' + '&qty=' + 5 + '&noRegis=' + 5, function (response) {

                });

            }

            $scope.tutup = function () {
                $scope.batal();
                $scope.popUpMenu.close();
            }



            $scope.showCetak = function () {

                if ($scope.selectedOnCheck.length == 0) {
                    toastr.error('Pilih data terlebih dahulu')
                    return
                }
                $scope.popUpCetakLabel.center().open();
                $scope.popUpCetakLabel.qty = 1;
            }

            $scope.cetak = function () {

                if ($scope.popUpCetakLabel.qty == 0) {
                    toastr.error('qty tidak boleh nol')
                    return
                }

                if ($scope.selectedOnCheck.length != 0) {
                    var DataGizi = ''
                    for (var i = $scope.selectedOnCheck.length - 1; i >= 0; i--) {
                        DataGizi = DataGizi + ',' + "'" + $scope.selectedOnCheck[i].norec_op + "'"
                    }

                    var norec = DataGizi; //$scope.selectedOnCheck[0].norec_op
                    var stt = 'false'
                    if (confirm('View Label Gizi? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/gizi?cetak-label-gizi=' + norec + '&view=' + stt + '&qty=' + $scope.popUpCetakLabel.qty + '&noRegis=' + $scope.popUpCetakLabel.qty, function (response) {
                        $scope.popUpCetakLabel.close();
                    });

                }
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
            $scope.pop = {}
            $scope.EditOrder = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                var select = $scope.dataPasienSelected
                select.tglmenu = new Date(select.tglmenu)
                $scope.pop = select
                $scope.pop.jenisWaktu = { id: select.objectjeniswaktufk, jeniswaktu: select.jeniswaktu }
                $scope.pop.jenisDiet = { id: select.objectjenisdietfk, jenisdiet: select.jenisdiet }
                $scope.pop.jenisDiet1 = { id: select.objectjenisdietfk1, jenisdiet: select.jenisdiet1 }
                $scope.pop.jenisDiet2 = { id: select.objectjenisdietfk2, jenisdiet: select.jenisdiet2 }
                $scope.pop.kategoriDiet = { id: select.objectkategorydietfk, kategorydiet: select.kategorydiet }
                $scope.pop.keterangan = select.keteranganlainnya
                $scope.pop.pengorder = select.pegawaiorder

                $scope.popUpOrder.center().open()
                // cacheHelper.set('cacheEditOrderGizi', cache);
                // $state.go('EditOrderGizi')

            }
            $scope.saveEditOrder = function () {
                if ($scope.pop.jenisDiet == undefined) {
                    toastr.error('Jenis Diet belum di pilih !')
                    return
                }
                var jd1 = "";
                var jd2 = "";
                if ($scope.pop.jenisDiet1 != undefined) {
                    jd1 = $scope.pop.jenisDiet1.id;
                }
                if ($scope.pop.jenisDiet2 != undefined) {
                    jd2 = $scope.pop.jenisDiet2.id;
                }
                if ($scope.pop.kategoriDiet == undefined) {
                    toastr.error('Kategori Diet belum di pilih !')
                    return
                }
                if ($scope.pop.jenisWaktu == undefined) {
                    toastr.error('Jenis Waktu belum di pilih')
                    return
                }

                var ket = ''
                if ($scope.pop.keterangan != undefined) {
                    ket = $scope.pop.keterangan
                }
                $scope.tombolSimpanVis = true;

                var objSave = {
                    'strukorder': {
                        "norec": $scope.pop.norec_so,
                        "tglmenu": moment($scope.pop.tglmenu).format('YYYY-MM-DD HH:mm'),
                    },
                    'orderpelayanan': {
                        "norec": $scope.pop.norec_op,
                        "objectjeniswaktufk": $scope.pop.jenisWaktu.id,
                        "objectkategorydietfk": $scope.pop.kategoriDiet.id,
                        "keterangan": ket,
                        "objectjenisdietfk": $scope.pop.jenisDiet.id,
                        "objectjenisdietfk1": jd1,
                        "objectjenisdietfk2": jd2
                    }
                }


                medifirstService.post('gizi/update-peritem-order', objSave).then(function (result) {
                    $scope.tombolSimpanVis = false;
                    $scope.pop = {}
                    $scope.popUpOrder.close();
                    loadData()

                }, function (error) {
                    $scope.tombolSimpanVis = false;
                })
            }
            $scope.batalEdit = function () {
                $scope.pop = {}
                $scope.popUpOrder.close();
            }
            $scope.hapusOrder = function () {

                if ($scope.selectedOnCheck.length == 0) {
                    toastr.error('Ceklis Peritem dulu')
                    return
                }
                for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
                    const element = $scope.selectedOnCheck[i];
                    if (element.strukkirimfk != null) {
                        toastr.error('Tidak bisa hapus data yang sudah dikirim')
                        return
                    }
                }
                var data = {
                    'orderpelayanan': $scope.selectedOnCheck
                }
                medifirstService.post('gizi/hapus-peritem-order', data).then(function (e) {
                    $scope.selectedOnCheck = []
                    loadData()

                })

            }

            /*END */


        }
    ]);
});