define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPasienDaftarCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;

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

            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [

                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }

            ]

            //debugger;
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.CetakPasienDaftar = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
                //debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");

                if ($scope.item.KelompokPasien == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.KelompokPasien.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                var stt = 'false'
                if (confirm('View Laporan Pasien Daftar? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&strIdDepartement=' + departement + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&view=' + stt, function (response) {
                    // do something with response
                });
                // if(client.status==0){
                //     if($scope.item.format == undefined){
                //         alert('format file harus dipilih terlebih dahulu !!!');
                //     }else{
                //         var urlLaporan = ReportPelayanan.open('preporting/lapPelayananPasien?startDate=''+tglawal+'+tglawal+'&tglAkhir='+tglakhir+'&strIdRuangan='+ruangan+'&strIdDepartement='+departement+'&strIdKelompokPasien='+kelompokPasien+'&strIdDokter='+namaPegawai+'&format='+$scope.item.format.format);
                //         window.open(urlLaporan, '_blank');
                //     }
                // }   
            };

            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {

                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listPasien = dat.data.kelompokpasien;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
            });
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData()

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAwalOnline = moment($scope.item.tglawal).format('YYYY-MM-01 HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                //debugger;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }

                var isTglPulang = ''
                if ($scope.item.cekTglPulang != undefined) {
                    isTglPulang = "&isTglPulang=" + $scope.item.cekTglPulang
                }

                var user = "";
                if ($scope.item.user != undefined) {
                    user = "&userinput=" + $scope.item.user;
                }

                var nocm = "";
                if ($scope.item.nocm != undefined) {
                    user = "&nocm=" + $scope.item.nocm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-pasien-daftar-user?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId
                    + isTglPulang
                    + user
                    + nocm).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                            datas[i].isonline = '-'
                            debugger;
                            if (datas[i].noreservasi != undefined) {
                                if (datas[i].istelemedicine == '1') {
                                    datas[i].isonline = datas[i].notelepon
                                    datas[i].kelompokpasien = 'Telemedicine'
                                    datas[i].tglregistrasi = datas[i].tanggalreservasi
                                } else {
                                    datas[i].isonline = 'Online'
                                    datas[i].tglregistrasi = datas[i].tanggalreservasi
                                }
                            }
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
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
                medifirstService.get("registrasi/laporan/get-laporan-pasien-daftar-unand?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId
                    + isTglPulang
                    + user
                    + nocm).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                        }
                        $scope.sourceLaporanDaftar = new kendo.data.DataSource({
                            data: datas,
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
                medifirstService.get('registrasi/laporan/get-rekap-pasien-online?'
                    + "tglAwal=" + tglAwalOnline
                    // + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempKelPasienId
                    + tempDepartemenId
                    + tempRuanganId).then(function (dat) {
                        debugger;
                        var data = dat.data;

                        $scope.sourceLaporanOnline = new kendo.data.DataSource({
                            data: data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }, aggregate: [
                                { field: 'tanggal1', aggregate: 'sum' },
                                { field: 'tanggal2', aggregate: 'sum' },
                                { field: 'tanggal3', aggregate: 'sum' },
                                { field: 'tanggal4', aggregate: 'sum' },
                                { field: 'tanggal5', aggregate: 'sum' },
                                { field: 'tanggal6', aggregate: 'sum' },
                                { field: 'tanggal7', aggregate: 'sum' },
                                { field: 'tanggal8', aggregate: 'sum' },
                                { field: 'tanggal9', aggregate: 'sum' },
                                { field: 'tanggal10', aggregate: 'sum' },
                                { field: 'tanggal11', aggregate: 'sum' },
                                { field: 'tanggal12', aggregate: 'sum' },
                                { field: 'tanggal13', aggregate: 'sum' },
                                { field: 'tanggal14', aggregate: 'sum' },
                                { field: 'tanggal15', aggregate: 'sum' },
                                { field: 'tanggal16', aggregate: 'sum' },
                                { field: 'tanggal17', aggregate: 'sum' },
                                { field: 'tanggal18', aggregate: 'sum' },
                                { field: 'tanggal19', aggregate: 'sum' },
                                { field: 'tanggal20', aggregate: 'sum' },
                                { field: 'tanggal21', aggregate: 'sum' },
                                { field: 'tanggal22', aggregate: 'sum' },
                                { field: 'tanggal23', aggregate: 'sum' },
                                { field: 'tanggal24', aggregate: 'sum' },
                                { field: 'tanggal25', aggregate: 'sum' },
                                { field: 'tanggal26', aggregate: 'sum' },
                                { field: 'tanggal27', aggregate: 'sum' },
                                { field: 'tanggal28', aggregate: 'sum' },
                                { field: 'tanggal29', aggregate: 'sum' },
                                { field: 'tanggal30', aggregate: 'sum' },
                                { field: 'tanggal31', aggregate: 'sum' },
                            ],
                        });
                    })
                medifirstService.get('registrasi/laporan/get-rekap-pasien-online-poli?'
                    + "tglAwal=" + tglAwalOnline
                    // + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId).then(function (dat) {
                        debugger;
                        var data = dat.data;

                        $scope.sourceLaporanRekap = new kendo.data.DataSource({
                            data: data,
                            pageSize: 60,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }, aggregate: [
                                { field: 'tanggal1', aggregate: 'sum' },
                                { field: 'tanggal2', aggregate: 'sum' },
                                { field: 'tanggal3', aggregate: 'sum' },
                                { field: 'tanggal4', aggregate: 'sum' },
                                { field: 'tanggal5', aggregate: 'sum' },
                                { field: 'tanggal6', aggregate: 'sum' },
                                { field: 'tanggal7', aggregate: 'sum' },
                                { field: 'tanggal8', aggregate: 'sum' },
                                { field: 'tanggal9', aggregate: 'sum' },
                                { field: 'tanggal10', aggregate: 'sum' },
                                { field: 'tanggal11', aggregate: 'sum' },
                                { field: 'tanggal12', aggregate: 'sum' },
                                { field: 'tanggal13', aggregate: 'sum' },
                                { field: 'tanggal14', aggregate: 'sum' },
                                { field: 'tanggal15', aggregate: 'sum' },
                                { field: 'tanggal16', aggregate: 'sum' },
                                { field: 'tanggal17', aggregate: 'sum' },
                                { field: 'tanggal18', aggregate: 'sum' },
                                { field: 'tanggal19', aggregate: 'sum' },
                                { field: 'tanggal20', aggregate: 'sum' },
                                { field: 'tanggal21', aggregate: 'sum' },
                                { field: 'tanggal22', aggregate: 'sum' },
                                { field: 'tanggal23', aggregate: 'sum' },
                                { field: 'tanggal24', aggregate: 'sum' },
                                { field: 'tanggal25', aggregate: 'sum' },
                                { field: 'tanggal26', aggregate: 'sum' },
                                { field: 'tanggal27', aggregate: 'sum' },
                                { field: 'tanggal28', aggregate: 'sum' },
                                { field: 'tanggal29', aggregate: 'sum' },
                                { field: 'tanggal30', aggregate: 'sum' },
                                { field: 'tanggal31', aggregate: 'sum' },
                                { field: 'jumlahpasien', aggregate: 'sum' },
                            ],
                        });
                    })
            }


            // $("#kGrid").kendoGrid({
            //     toolbar: ["excel"],
            //     // , "pdf"],

            //     excel: {
            //         fileName: "LaporanPasienDaftar.xlsx",
            //         allPages: true,

            //     },
            //     // pdf: {
            //     //     fileName: "LaporanPasienMasuk.pdf",
            //     //     allPages: true,
            //     // },

            //     dataSource: $scope.dataExcel,
            //     sortable: true,
            //     // reorderable: true,
            //     // filterable: true,
            //     pageable: true,
            //     // groupable: true,
            //     // columnMenu: true,
            //     resizable: true,
            //     excelExport: function (e) {
            //         var rows = e.workbook.sheets[0].rows;
            //         rows.unshift({
            //             cells: [{ value: "Pasien Daftar", background: "#fffff" }]
            //         });
            //     },
            //     columns: [
            //         {
            //             "field": "tglregistrasi",
            //             "title": "Tgl Masuk",
            //             "width": "150px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
            //         },
            //         {
            //             "field": "noregistrasi",
            //             "title": "No Registrasi",
            //             "width": "100px",
            //             "template": "<span class='style-center'>#: noregistrasi #</span>"
            //         },
            //         {
            //             "field": "namapasien",
            //             "title": "Nama Pasien",
            //             "width": "180px",

            //         },

            //         {
            //             "field": "ruangandaftar",
            //             "title": "Unit Layanan",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "nocm",
            //             "title": "No Rm",
            //             "width": "80px"

            //         },
            //         {
            //             "field": "kelompokpasien",
            //             "title": "Tipe Pasien",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "namarekanan",
            //             "title": "Penjamin",
            //             "width": "150px"
            //         },
            //         {
            //             "field": "jk",
            //             "title": "JK",
            //             "width": "50px"
            //         },
            //         {
            //             "field": "tgllahir",
            //             "title": "Tgl Lahir",
            //             "width": "100px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
            //         },
            //         {
            //             "field": "umur",
            //             "title": "Umur",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "namakelas",
            //             "title": "Kelas",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "dokterapd",
            //             "title": "Dokter",
            //             "width": "100px"
            //         },
            //         // {
            //         //     "field": "asalrujukan",
            //         //     "title": "Asal Pasien",
            //         //     "width": "100px"
            //         // },
            //         {
            //             "field": "tglpulang",
            //             "title": "Tgl Keluar",
            //             "width": "150px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
            //         },
            //         // {
            //         //     "field": "kondisipasien",
            //         //     "title": "Keadaan",
            //         //     "width": "100px"
            //         // },
            //         {
            //             "field": "alamatlengkap",
            //             "title": "Alamat",
            //             "width": "400px"
            //         },
            //         {
            //             "field": "userdaftar",
            //             "title": "User Daftar",
            //             "width": "400px"
            //         }
            //     ]
            // });
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == '-') { $(this).addClass('red') }
                    if ($(this).text() == 'Online') { $(this).addClass('koneng') }

                })
            }
            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienmasuk.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Masuk Rawat Inap",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                dataBound: onDataBound,
                selectable: "row",
                columns: [

                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Masuk",
                        "width": "150px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px",
                        template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },

                    {
                        "field": "ruangandaftar",
                        "title": "Unit Layanan",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "80px"

                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Penjamin",
                        "width": "150px"
                    },
                    {
                        "field": "jk",
                        "title": "JK",
                        "width": "50px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "100px"
                    },
                    {
                        "field": "dokterapd",
                        "title": "Dokter",
                        "width": "100px"
                    },

                    {
                        "field": "tglpulang",
                        "title": "Tgl Keluar",
                        "width": "150px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },

                    // {
                    //     "field": "alamatlengkap",
                    //     "title": "Alamat",
                    //     "width": "400px"
                    // },
                    {
                        "field": "userdaftar",
                        "title": "User Daftar",
                        "width": "400px"
                    },
                    {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                    }
                ]
            }

            $scope.columnLaporanDaftar = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasiendaftar.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Daftar",
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

                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Masuk",
                        "width": "150px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px",
                        template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },

                    {
                        "field": "ruangandaftar",
                        "title": "Unit Layanan",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "80px"

                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Penjamin",
                        "width": "150px"
                    },
                    {
                        "field": "jk",
                        "title": "JK",
                        "width": "50px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "100px"
                    },
                    {
                        "field": "dokterapd",
                        "title": "Dokter",
                        "width": "100px"
                    },

                    {
                        "field": "tglpulang",
                        "title": "Tgl Keluar",
                        "width": "150px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    }
                ]
            }

            $scope.columnLaporanOnline = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "rekappasienonline.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:AF1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekap Pasien Online",
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

                    {
                        "field": "kelompokpasien",
                        "title": "Jaminan",
                        "width": "150px",
                        footerTemplate: "Total :"
                    },
                    {
                        "title": "Tanggal",
                        "width": "180px",
                        headerAttributes: { style: 'text-align: center' },
                        columns:
                            [
                                {
                                    "field": "tanggal1",
                                    "title": "1",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal1.sum  #"
                                },
                                {
                                    "field": "tanggal2",
                                    "title": "2",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal2.sum  #"
                                },
                                {
                                    "field": "tanggal3",
                                    "title": "3",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal3.sum  #"
                                },
                                {
                                    "field": "tanggal4",
                                    "title": "4",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal4.sum  #"
                                },
                                {
                                    "field": "tanggal5",
                                    "title": "5",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal5.sum  #"
                                },
                                {
                                    "field": "tanggal6",
                                    "title": "6",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal6.sum  #"
                                },
                                {
                                    "field": "tanggal7",
                                    "title": "7",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal7.sum  #"
                                },
                                {
                                    "field": "tanggal8",
                                    "title": "8",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal8.sum  #"
                                },
                                {
                                    "field": "tanggal9",
                                    "title": "9",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal9.sum  #"
                                },
                                {
                                    "field": "tanggal10",
                                    "title": "10",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal10.sum  #"
                                },
                                {
                                    "field": "tanggal11",
                                    "title": "11",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal11.sum  #"
                                },
                                {
                                    "field": "tanggal12",
                                    "title": "12",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal12.sum  #"
                                },
                                {
                                    "field": "tanggal13",
                                    "title": "13",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal13.sum  #"
                                },
                                {
                                    "field": "tanggal14",
                                    "title": "14",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal14.sum  #"
                                },
                                {
                                    "field": "tanggal15",
                                    "title": "15",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal15.sum  #"
                                },
                                {
                                    "field": "tanggal16",
                                    "title": "16",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal16.sum  #"
                                },
                                {
                                    "field": "tanggal17",
                                    "title": "17",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal17.sum  #"
                                },
                                {
                                    "field": "tanggal18",
                                    "title": "18",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal18.sum  #"
                                },
                                {
                                    "field": "tanggal19",
                                    "title": "19",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal19.sum  #"
                                },
                                {
                                    "field": "tanggal20",
                                    "title": "20",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal20.sum  #"
                                },
                                {
                                    "field": "tanggal21",
                                    "title": "21",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal21.sum  #"
                                },
                                {
                                    "field": "tanggal22",
                                    "title": "22",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal22.sum  #"
                                },
                                {
                                    "field": "tanggal23",
                                    "title": "23",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal23.sum  #"
                                },
                                {
                                    "field": "tanggal24",
                                    "title": "24",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal24.sum  #"
                                },
                                {
                                    "field": "tanggal25",
                                    "title": "25",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal25.sum  #"
                                },
                                {
                                    "field": "tanggal26",
                                    "title": "26",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal26.sum  #"
                                },
                                {
                                    "field": "tanggal27",
                                    "title": "27",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal27.sum  #"
                                },
                                {
                                    "field": "tanggal28",
                                    "title": "28",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal28.sum  #"
                                },
                                {
                                    "field": "tanggal29",
                                    "title": "29",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal29.sum  #"
                                },
                                {
                                    "field": "tanggal30",
                                    "title": "30",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal30.sum  #"
                                },
                                {
                                    "field": "tanggal31",
                                    "title": "31",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal31.sum  #"
                                },
                            ]
                    },
                ]
            }

            $scope.columnLaporanRekap = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "rekappasienonline.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:AG1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekap Pasien Online",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: true,
                refresh: true,
                scrollable: false,
                columns: [

                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "150px",
                        footerTemplate: "Total :"
                    },
                    {
                        "title": "Tanggal",
                        "width": "180px",
                        headerAttributes: { style: 'text-align: center' },
                        columns:
                            [
                                {
                                    "field": "tanggal1",
                                    "title": "1",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal1.sum  #"
                                },
                                {
                                    "field": "tanggal2",
                                    "title": "2",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal2.sum  #"
                                },
                                {
                                    "field": "tanggal3",
                                    "title": "3",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal3.sum  #"
                                },
                                {
                                    "field": "tanggal4",
                                    "title": "4",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal4.sum  #"
                                },
                                {
                                    "field": "tanggal5",
                                    "title": "5",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal5.sum  #"
                                },
                                {
                                    "field": "tanggal6",
                                    "title": "6",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal6.sum  #"
                                },
                                {
                                    "field": "tanggal7",
                                    "title": "7",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal7.sum  #"
                                },
                                {
                                    "field": "tanggal8",
                                    "title": "8",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal8.sum  #"
                                },
                                {
                                    "field": "tanggal9",
                                    "title": "9",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal9.sum  #"
                                },
                                {
                                    "field": "tanggal10",
                                    "title": "10",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal10.sum  #"
                                },
                                {
                                    "field": "tanggal11",
                                    "title": "11",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal11.sum  #"
                                },
                                {
                                    "field": "tanggal12",
                                    "title": "12",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal12.sum  #"
                                },
                                {
                                    "field": "tanggal13",
                                    "title": "13",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal13.sum  #"
                                },
                                {
                                    "field": "tanggal14",
                                    "title": "14",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal14.sum  #"
                                },
                                {
                                    "field": "tanggal15",
                                    "title": "15",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal15.sum  #"
                                },
                                {
                                    "field": "tanggal16",
                                    "title": "16",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal16.sum  #"
                                },
                                {
                                    "field": "tanggal17",
                                    "title": "17",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal17.sum  #"
                                },
                                {
                                    "field": "tanggal18",
                                    "title": "18",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal18.sum  #"
                                },
                                {
                                    "field": "tanggal19",
                                    "title": "19",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal19.sum  #"
                                },
                                {
                                    "field": "tanggal20",
                                    "title": "20",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal20.sum  #"
                                },
                                {
                                    "field": "tanggal21",
                                    "title": "21",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal21.sum  #"
                                },
                                {
                                    "field": "tanggal22",
                                    "title": "22",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal22.sum  #"
                                },
                                {
                                    "field": "tanggal23",
                                    "title": "23",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal23.sum  #"
                                },
                                {
                                    "field": "tanggal24",
                                    "title": "24",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal24.sum  #"
                                },
                                {
                                    "field": "tanggal25",
                                    "title": "25",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal25.sum  #"
                                },
                                {
                                    "field": "tanggal26",
                                    "title": "26",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal26.sum  #"
                                },
                                {
                                    "field": "tanggal27",
                                    "title": "27",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal27.sum  #"
                                },
                                {
                                    "field": "tanggal28",
                                    "title": "28",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal28.sum  #"
                                },
                                {
                                    "field": "tanggal29",
                                    "title": "29",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal29.sum  #"
                                },
                                {
                                    "field": "tanggal30",
                                    "title": "30",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal30.sum  #"
                                },
                                {
                                    "field": "tanggal31",
                                    "title": "31",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    footerTemplate: "#:data.tanggal31.sum  #"
                                },
                            ]
                    },
                    {
                        "field": "jumlahpasien",
                        "title": "Jumlah Pasien",
                        "width": "50px",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jumlahpasien.sum #"
                    }
                ]
            }




            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.RincianPelayanan = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var isTglPulang = ''
                if ($scope.item.cekTglPulang != undefined) {
                    isTglPulang = "&isTglPulang=" + $scope.item.cekTglPulang
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-data-lap-rincian-pelayanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + isTglPulang).then(function (data) {
                        $scope.isLoadingData = false;
                        $scope.popup_Laporan.center().open();
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahirReal), new Date(datas[i].tglregistrasiReal));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                        }
                        $scope.sourceLaporanSatu = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 1000,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    })
            }

            $scope.columnLaporanSatu = {
                toolbar: ["excel"],
                excel: {
                    fileName: "DataLaporanRincianPelayanan.xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "90px",
                        "template": "<span class='style-left'>#: tglregistrasi #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "90px",
                        "template": "<span class='style-center'>#: tglpulang #</span>"
                    },
                    {
                        "field": "jamperiksa",
                        "title": "Jam Periksa",
                        "width": "90px",
                        "template": "<span class='style-center'>#: jamperiksa #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },
                    {
                        "field": "ruanganakhir",
                        "title": "Ruangan Akhir",
                        "width": "120px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px",
                        "template": "<span class='style-center'>#: dokter #</span>"
                    },
                    {
                        "field": "tipepasien",
                        "title": "Tipe Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tipepasien #</span>"
                    },
                    {
                        "field": "jenispasien",
                        "title": "Jenis Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jenispasien #</span>"
                    },
                    // {
                    //     "field": "carabayar",
                    //     "title": "Cara Bayar",
                    //     "width": "100px",
                    //     "template": "<span class='style-center'>#: carabayar #</span>"
                    // },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rm",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-center'>#: namapasien #</span>"
                    },
                    {
                        "field": "nohp",
                        "title": "No Telepon",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nohp #</span>"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tgllahir #</span>"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px",
                        "template": "<span class='style-center'>#: umur #</span>"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "agama",
                        "title": "Agama",
                        "width": "100px",
                        "template": "<span class='style-center'>#: agama #</span>"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pendidikan #</span>"
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pekerjaan #</span>"
                    },
                    {
                        "field": "statusperkawinan",
                        "title": "Status Perkawinan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: statusperkawinan #</span>"
                    },
                    {
                        "field": "alamat",
                        "title": "Alamat",
                        "width": "100px",
                        "template": "<span class='style-center'>#: alamat #</span>"
                    },
                    {
                        "field": "kelurahan",
                        "title": "Kelurahan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kelurahan #</span>"
                    },
                    {
                        "field": "kecamatan",
                        "title": "Kecamatan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kecamatan #</span>"
                    },
                    {
                        "field": "kabupaten",
                        "title": "Kabupaten",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kabupaten #</span>"
                    },
                    {
                        "field": "kodepenyakit",
                        "title": "Kode Penyakit",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kodepenyakit #</span>"
                    },
                ]
            };

            //* BATAS//
        }
    ]);
});