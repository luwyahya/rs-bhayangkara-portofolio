define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPelayananPasienCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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
                    "id": 1,
                    "format": "pdf"
                },
                {
                    "id": 2,
                    "format": "xls"
                }

            ]

            //debugger;
            $scope.date = new Date();
            var date2 = moment(date2).format('DD HH:mm');
            // $scope.date2 = moment(date2).format('YYYY-MM-DD HH:mm');
            // var tanggals2 = DateHelper.getDateTimeFormatted3($scope.date2);
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


            $scope.editData = function (data) {
                debugger;
                // $scope.Detail = function () {
                if ($scope.dataSelected.koderuangan == undefined) {
                    window.messageContainer.error("Data Belum Dipilih !")
                    return
                    }
                   
                    var arrStr = {
                        0: $scope.item.id = $scope.dataSelected.id,
                        1: $scope.item.namaexternal = $scope.dataSelected.namaruangan,
                        2: $scope.item.tgl = $scope.dataSelected.bulanregis + "-" + date2,
                        3: $scope.item.jumlah = $scope.dataSelected.jmlbed,
                    }
                    $scope.edit.center().open();
                    
            }

            $scope.Detail = function (data) {
                LoadData()
                $scope.winDialogss.center().open();

            }

            $scope.DetailForm = function (data) {

                $scope.winDialogs.center().open();

            }

            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {

                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listPasien = dat.data.kelompokpasien;

                $scope.listBed = dat.data.dataRuanganBed;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
            });

            $scope.simpanRuanganBed = function (data) {
                debugger
                var objsave = {
                    "statusenabled": true,
                    "koderuangan": $scope.item.namaexternal.id,
                    "jumlah": $scope.item.jumlah != undefined ? $scope.item.jumlah : 0,
                    "tgl": moment($scope.item.tgl).format('YYYY-MM-DD HH:mm'),
                }
                debugger
                medifirstService.post('registrasi/laporan/save-ruangan-data', objsave).then(function (e) {
                    $scope.item = {}
                })
                LoadData()
                $scope.winDialogs.close();

            }




            $scope.simpanEdit = function (data) {
                if ($scope.item.namaexternal == undefined) {
                 window.messageContainer.error("Data Belum Dipilih !")
                    return
                }
                var objsave = {
                    "statusenabled": true,
                    "id": $scope.item.id,
                    "koderuangan": $scope.item.namaexternal.id,
                    "jumlah": $scope.item.jumlah != undefined ? $scope.item.jumlah : 0,
                    "tgl": moment($scope.item.tgl).format('YYYY-MM-DD HH:mm'),
                }
                debugger
                medifirstService.post('registrasi/laporan/save-edit-ruangan', objsave).then(function (e) {
                    $scope.item = {}
                })
                LoadData()
                $scope.edit.close();
            }

            $scope.saveDelete = function (data) {
                debugger;
                // $scope.Detail = function () {
                if ($scope.dataSelected.koderuangan == undefined) {
                    window.messageContainer.error("Data Belum Dipilih !")
                    return
                    }
                   
                    var arrStr = {
                        ID: $scope.item.id = $scope.dataSelected.id,
                    }

                     medifirstService.post('registrasi/laporan/save-delete-ruangan', arrStr).then(function (e) {
                    $scope.item.id = {}
                })
                LoadData()
            }


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
                var jmlHari = new Date(moment($scope.item.tglawal).format('YYYY'), moment($scope.item.tglawal).format('MM'), 0).getDate();
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglawal).format('YYYY') + '-' + moment($scope.item.tglawal).format('MM') + '-' + jmlHari + ' 23:59';

                medifirstService.get("registrasi/laporan/get-laporan-pelayanan-pasien?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    $scope.isLoadingData = false;
                    var datax = data.data.data;
                    debugger
                    // var datas = data.data.data[0].jumlahhariperawatan;
                    // var jumlahhariperawatan = 0;
                    // var lamarawat = 0;
                    // datax[0].jumlahhariperawatan = 0
                    // datax[0].lamarawat = 0
                    // datax[0].dilamarawat = 0
                    // for (var i = 0; i < datas.length; i++) {
                    //     datas[i].no = i + 1;
                    //     // var lR = dateHelper.CountAge(new Date(datas[i].tglmasuk), new Date(datas[i].tglkeluar));
                    //     // var lD = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                    //     // var lR = DateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglkeluar).format('YYYY-MM-DD')));
                    //     var lR = DateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));

                    //     var lD = DateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));
                    //     var bulaanmasuk = new Date(moment(datas[i].tglregistrasi).format('MM'));
                    //     var bulaanpulang = new Date(moment(datas[i].tglpulang).format('MM'));

                    //     bulaanmasuk = bulaanmasuk.getMonth();
                    //     bulaanpulang = bulaanpulang.getMonth();
                    //     if (bulaanmasuk == bulaanpulang) {
                    //         var hariperawatan = DateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));
                    //         if (hariperawatan.day == 0) {
                    //             datas[i].hariperawatan = 1 + ' hr ';
                    //             datas[i].hariperawatanx = 1;
                    //         } else {
                    //             datas[i].hariperawatan = hariperawatan.day + ' hr ';
                    //             datas[i].hariperawatanx = hariperawatan.day;
                    //         }
                    //     } else {
                    //         var date = new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD'))
                    //         // alert('the original date is ' + date);
                    //         var newdate = new Date(date);

                    //         newdate.setDate(newdate.getDate() + 1); // minus the date


                    //         var hariperawatan = DateHelper.CountAge(new Date(moment(datas[i].tglpulang).format('YYYY-MM-01')), newdate);
                    //         if (hariperawatan.day == 0) {
                    //             datas[i].hariperawatan = 1 + ' hr ';
                    //             datas[i].hariperawatanx = 1;
                    //         } else {
                    //             datas[i].hariperawatan = hariperawatan.day + ' hr ';
                    //             datas[i].hariperawatanx = hariperawatan.day;
                    //         }
                    //     }
                    //     if (lR.month == 0) {
                    //         if (lR.day == 0) {
                    //             datas[i].lamarawat = '1 hr';
                    //             datas[i].lamarawatx = 1;
                    //         } else {
                    //             datas[i].lamarawat = lR.day + ' hr ';
                    //             datas[i].lamarawatx = lR.day;

                    //         }
                    //     } else {
                    //         if (lR.day == 0) {
                    //             datas[i].lamarawat = (lR.month * 30) + ' hr';
                    //             datas[i].lamarawatx = (lR.month * 30);

                    //         } else {
                    //             datas[i].lamarawat = (lR.month * 30) + lR.day + ' hr ';
                    //             datas[i].lamarawatx = (lR.month * 30) + lR.day;

                    //         }
                    //     }


                    //     if (lD.month == 0) {
                    //         if (lD.day == 0) {
                    //             datas[i].haridirawat = '1 hr';
                    //             datas[i].haridirawatx = 1;
                    //         } else {
                    //             datas[i].haridirawat = lD.day + 1 + ' hr ';
                    //             datas[i].haridirawatx = lD.day + 1;

                    //         }
                    //     } else {
                    //         if (lD.day == 0) {
                    //             datas[i].haridirawat = (lD.month * 30) + 1 + ' hr';
                    //             datas[i].haridirawatx = (lD.month * 30) + 1;
                    //         } else {
                    //             datas[i].haridirawat = (lD.month * 30) + lD.day + 1 + ' hr ';
                    //             datas[i].haridirawatx = (lD.month * 30) + lD.day + 1;
                    //         }
                    //     }
                    //     datax[0].lamarawat = datax[0].lamarawat + datas[i].lamarawatx;
                    //     datax[0].dilamarawat = datax[0].dilamarawat + datas[i].haridirawatx;
                    //     datax[0].jumlahhariperawatan = datax[0].jumlahhariperawatan + datas[i].hariperawatanx;

                    // }
                    $scope.sourceLaporanDaftar = new kendo.data.DataSource({
                        data: datax,
                        pageSize: 10,
                        total: datax.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            { field: 'jumlahhariperawatan', aggregate: 'sum' },
                            { field: 'lamaRawat', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    });
                    $scope.dataPasienDetail = {
                        data: data.data.data[0].dataTTD,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            { field: 'jmlPasienBaru', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }
                     $scope.dataJumlahBed = {
                        data: data.data.data[0].dataBed,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            { field: 'jmlPasienBaru', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }

                    $scope.dataPasienDetailKunjL = {
                        data: data.data.data[0].datakunjL,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            // { field: 'jmlPasienBaru', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }

                    $scope.dataExcel = datas;
                })

            }






            $scope.columnLaporanDaftar = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpelayananpasien.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";
                    sheet.columns = 1;
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
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "rumahsakit",
                        "title": "Rumah Sakit",
                        "width": "50px",
                    },
                    {
                        "field": "bor",
                        "title": "BOR",
                        "width": "30px",
                    },
                    {
                        "field": "alos",
                        "title": "ALOS",
                        "width": "30px",
                    },
                    {
                        "field": "bto",
                        "title": "BTO",
                        "width": "30px",
                    },
                    {
                        "field": "toi",
                        "title": "TOI",
                        "width": "30px",
                    },
                    {
                        "field": "gdr",
                        "title": "GDR",
                        "width": "30px",
                    },
                    {
                        "field": "ndr",
                        "title": "NDR",
                        "width": "30px",
                    },
                    {
                        "field": "tempattidur",
                        "title": "Tempat Tidur",
                        "width": "40px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"detailTempatTidur(dataItem)\"  style=\"margin:0 0 5px\">#:  tempattidur #</button> ",
                    },
                    {
                        "field": "hari",
                        "title": "Hari",
                        "width": "30px"
                    },
                    {
                        title: "Jumlah Kunjungan",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            title: "Rawat Jalan",
                            headerAttributes: { style: "text-align : center" },
                            columns: [{
                                "field": "kunjL",
                                "title": "L",
                                "width": "20px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"detailKunjL(dataItem)\"  style=\"margin:0 0 5px\">#:  kunjL #</button> ",
                            },
                            {
                                "field": "kunjP",
                                "title": "P",
                                "width": "20px"
                            },
                            {
                                "field": "kunjLP",
                                "title": "L+P",
                                "width": "30px"
                            },
                            ]
                        },
                        {
                            title: "Rawat Inap",
                            headerAttributes: { style: "text-align : center" },
                            columns: [{
                                "field": "kunjLRI",
                                "title": "L",
                                "width": "20px"
                            },
                            {
                                "field": "kunjPRI",
                                "title": "P",
                                "width": "20px"
                            },
                            {
                                "field": "kunjLPRI",
                                "title": "L+P",
                                "width": "30px"
                            },
                            ]
                        }
                        ]
                    },
                    {
                        title: "Jumlah Kunjungan Pasien",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            title: "Pasien Gangguan Jiwa",
                            headerAttributes: { style: "text-align : center" },
                            columns: [{
                                "field": "kunjLjiwa",
                                "title": "L",
                                "width": "20px"
                            },
                            {
                                "field": "kunjPjiwa",
                                "title": "P",
                                "width": "20px"
                            },
                            {
                                "field": "kunjLPjiwa",
                                "title": "L+P",
                                "width": "30px"
                            },
                            ]
                        }]
                    },
                    {
                        "field": "jumlahhariperawatan",
                        "title": "Jumlah Hari Perawatan",
                        "width": "50px",
                        // aggregates: ["sum"],
                        // footerTemplate: "#:data.lamaRawat.sum#"
                    },
                    {
                        "field": "lamaRawat",
                        "title": "Jumlah Lama Dirawat",
                        "width": "50px",
                        // aggregates: ["sum"],
                        // footerTemplate: "#:data.lamaRawat.sum#"
                    },
                    {
                        title: "Pasien Keluar Hidup+Mati",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            "field": "pasienPulangL",
                            "title": "L",
                            "width": "20px"
                        },
                        {
                            "field": "pasienPulangP",
                            "title": "P",
                            "width": "20px"
                        },
                        {
                            "field": "jumlahpasienpulang",
                            "title": "L+P",
                            "width": "30px"
                        },
                        ]
                    },
                    {
                        title: "Pasien Keluar Mati",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            "field": "pasienPulangMatiL",
                            "title": "L",
                            "width": "20px"
                        },
                        {
                            "field": "pasienPulangMatiP",
                            "title": "P",
                            "width": "20px"
                        },
                        {
                            "field": "jumlahmeninggal",
                            "title": "L+P",
                            "width": "30px"
                        },
                        ]
                    },
                    {
                        title: "Pasien Keluar Mati > 48 Jam dirawat",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            "field": "jumlahlebih48l",
                            "title": "L",
                            "width": "20px"
                        },
                        {
                            "field": "jumlahlebih48p",
                            "title": "P",
                            "width": "20px"
                        },
                        {
                            "field": "jumlahlebih48",
                            "title": "L+P",
                            "width": "30px"
                        },
                        ]
                    },
                ]
            }

            $scope.columnBed = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpelayananpasien.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";
                    sheet.columns = 1;
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
                columns: [{
                    "field": "namaruangan",
                    "title": "POLIKLINIK",
                    "width": "50px"
                },
                {
                    "field": "jmlbed",
                    "title": "Jumlah Bed",
                    "width": "50px"
                },
                {
                    "field": "bulanregis",
                    "title": "Tahun Bulan",
                    "width": "50px"
                },
                ],
            }

            $scope.detailTempatTidur = function (dataPasienSelected) {
                $scope.isruangan = true
                $scope.iskunjL = false
                $scope.popUpDetail.center().open();
            }
            $scope.detailKunjL = function (dataPasienSelected) {
                $scope.isruangan = false
                $scope.iskunjL = true
                $scope.popUpDetail.center().open();
            }

            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "DetailLaporan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "DetailLaporan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "DETAIL",
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
                columns: [{
                    "field": "namaruangan",
                    "title": "POLIKLINIK",
                    "width": "50px"
                },
                {
                    "field": "jmlbed",
                    "title": "Jumlah Bed",
                    "width": "50px"
                },
                {
                    "field": "bulanregis",
                    "title": "Tahun Bulan",
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

            $scope.columnPasienDetailKunjL = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "DetailLaporan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "DetailLaporan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "DETAIL",
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
                columns: [{
                    "field": "nama",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "namaruangan",
                    "title": "POLIKLINIK",
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

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }


            //* BATAS//
        }
    ]);
});