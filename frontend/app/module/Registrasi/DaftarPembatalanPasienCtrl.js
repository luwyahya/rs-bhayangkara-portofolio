
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('DaftarPembatalanPasienCtrl', ['MedifirstService', '$scope',
        function (medifirstService, $scope) {
            $scope.title = "Daftar Pembatalan Pasien";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };
            $scope.isTabulasi = '';
            $scope.model = {};
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

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
                var online = ""
                if ($scope.model.cekpilihManual == true) {
                    var online = "&online=" + true
                }
                var rout = "registrasi/get-daftar-pasienbatal?";
                if ($scope.isTabulasi == 'batalAntrian') {
                    rout = "registrasi/get-daftar-pasienbatalAntrian?";
                }
                medifirstService.get(rout +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + reg
                    + rm
                    + nama
                    + online).then(function (e) {
                        $scope.isRouteLoading = false;
                        if ($scope.isTabulasi == 'batalAntrian') {
                            $scope.dataPasienBatalAntrian = new kendo.data.DataSource({
                                data: e.data.data,
                                group: {
                                    field: "tanggalpembatalan",
                                    aggregates: [{
                                        field: "pembatal",
                                        aggregate: "count"
                                    }, {
                                        field: "namalengkap",
                                        aggregate: "count"
                                    }]
                                }
                            });
                        } else {
                            $scope.dataPasienBatal = new kendo.data.DataSource({
                                data: e.data.data,
                                group: {
                                    field: "tanggalpembatalan",
                                    aggregates: [{
                                        field: "pembatal",
                                        aggregate: "count"
                                    }, {
                                        field: "namalengkap",
                                        aggregate: "count"
                                    }]
                                }
                            });
                        }
                    })

            }
            $scope.asd = function (kondisi) {
                debugger
                $scope.isTabulasi = kondisi
            }
            $scope.findData();
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "daftarpasienbatal.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Pasien Batal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [{
                    field: "norec_br",
                    title: " ",
                    hidden: true
                }, {
                    field: "tanggalpembatalan",
                    title: "Tanggal"
                }, {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false
                },
                {
                    field: "nocm",
                    title: "No Rm",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                }, {
                    field: "pembatal",
                    title: "Pembatal"
                }, {
                    field: "namalengkap",
                    title: "Pegawai"
                }, {
                    field: "alasanpembatalan",
                    title: "Alasan Pembatalan"
                }, {
                    field: "namaruangan",
                    title: "Nama Ruangan"
                }, {
                    field: "status",
                    title: "Status"
                }],
                selectable: "row",
                sortable: true
            }
            $scope.mainGridOptionsAntrian = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "daftarpasienbatal.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Pasien Batal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [{
                    field: "norec_apd",
                    title: " ",
                    hidden: true
                }, {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false
                },
                {
                    field: "nocm",
                    title: "No Rm",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                }, {
                    field: "namaruangan",
                    title: "Nama Ruangan"
                }],
                selectable: "row",
                sortable: true
            }
        }
    ]);

});