define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarInformasiPasienReservasiOnlineCtrl', ['CacheHelper', '$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'socket', '$http', 'MedifirstService',
        function (cacheHelper, $rootScope, $scope, ModelItem, $state, dateHelper, socket, $http, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = false;
            $rootScope.isOpen = true;
            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + 1);
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.now = new Date();
            $scope.from = $scope.now;
            $scope.until = $scope.now;
            LoadCombo();
            LoadData();

            $scope.listStatus = [
                { id: 1, nama: 'Confirm' },
                { id: 2, nama: 'Reservasi' },
            ]

            $scope.kodeReservasi = '';
            $scope.Column = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarReservasiOnline.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Reservasi Online",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns:
                    [{
                        field: "noreservasi",
                        title: "Kode Reservasi",
                        width: 150
                    }, {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: 150
                    }, {
                        field: "tanggalreservasi",
                        title: "Tanggal Reservasi",

                        template: "<span class='style-left'>{{formatTanggal('#: tanggalreservasi #')}}</span>",
                        width: 120
                    }, {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: 200
                    }, {
                        field: "namaruangan",
                        title: "Ruangan Tujuan",
                        width: 200
                    }, {
                        field: "kelompokpasien",
                        title: "Tipe",
                        width: 100
                    }, {
                        field: "dokter",
                        title: "Dokter",
                        width: 200
                    }, {
                        field: "status",
                        title: "Status",
                        width: 200
                    }, {
                        field: "notelepon",
                        title: "Nomor Telepon",
                        width: 200
                    }, {
                        field: "tglinput",
                        title: "Tanggal Input",
                        width: 120,
                        template: "<span class='style-left'>{{formatTanggal('#: tglinput #')}}</span>",
                    }]
            };
            $scope.formatTanggal = function (tanggal) {
                if (tanggal != 'null')
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-';
            }
            $scope.Page = {
                refresh: true//,                
            }
            function LoadCombo() {
                medifirstService.get("humas/get-daftar-combo").then(function (e) {
                    $scope.listRuangan = e.data.ruanganrj
                })
            }
            $scope.findData = function () {
                LoadData()                
            }           

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD');
                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.nama;
                }
                var ruanganId = "";
                if ($scope.namaRuangan != undefined) {
                    ruanganId = $scope.namaRuangan.id;
                }
                var namapasienpm = ''
                var namapasienapr = ''
                if ($scope.namaPasien != undefined) {
                    namapasienpm = $scope.namaPasien;
                    namapasienapr = $scope.namaPasien;
                }
                medifirstService.get("humas/get-data-informasi-pasien-perjanjian?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kdReservasi=" + $scope.kodeReservasi
                    + "&statusRev=" + status
                    + "&namapasienpm=" + $scope.namaPasien
                    + "&ruanganId=" + ruanganId                    
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    $scope.listPasien = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }
//////////////////////////////////////////////////////////////////      END         ///////////////////////////////////////////////////////////            
        }
    ]);
});