define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL54PenyakitRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            //debugger
            $scope.CariRL54 = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }


            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRL_54Ctrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-rl54?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    $scope.isRouteLoading = false;

                    //   debugger
                    $scope.ambildataexcel = data.data;
                    // $scope.panggil($scope.ambildataexcel);
                    $scope.dataPasienPulang = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }, aggregate: [
                            { field: 'jumlahLKH', aggregate: 'sum' },
                            { field: 'jumlahPRH', aggregate: 'sum' },
                            { field: 'totalbaru', aggregate: 'sum' },
                            { field: 'jumlahLKL', aggregate: 'sum' },
                            { field: 'jumlahPRL', aggregate: 'sum' },
                            { field: 'totallama', aggregate: 'sum' },
                            { field: 'jumlah', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    });


                })
            }
            // $scope.panggil = function (cokot) {

            $scope.columnPasienPulang = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL54.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                // groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Formulir RL 5.4", background: "#fffff" }]
                    });
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
                        field: "kddiagnosa",
                        title: "KODE ICD 10",
                        width: "120px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        headerAttributes: { style: "text-align : center" },
                        rows: [
                            {
                                cells: [
                                    {
                                        value: "Border",
                                        borderTop: { color: "#ff0000", size: 3 }
                                    }]
                            }
                        ]

                    },
                    {
                        field: "namadiagnosa",
                        title: "DESKRIPSI",
                        width: "120px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        title: "KASUS BARU MENURUT JENIS KELAMIN",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": "jumlahLKH",
                                "title": "Laki-laki",
                                width: "80px",
                                template: "<span class='style-center'>#: jumlahLKH #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jumlahLKH.sum  #"
                            },
                            {
                                "field": "jumlahPRH",
                                "title": "Perempuan",
                                width: "80px",
                                template: "<span class='style-center'>#: jumlahPRH #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jumlahPRH.sum  #"
                            }
                        ]

                    },
                    {
                        field: "totalbaru",
                        title: "JUMLAH KASUS BARU (4+5)",
                        width: "80px",
                        headerAttributes: { style: "text-align : center" },
                        template: "<span class='style-center'>#: totalbaru #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.totalbaru.sum  #"
                    },
                    {
                        title: "KASUS LAMA MENURUT JENIS KELAMIN",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": "jumlahLKL",
                                "title": "Laki-laki",
                                width: "80px",
                                template: "<span class='style-center'>#: jumlahLKL #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jumlahLKL.sum  #"
                            },
                            {
                                "field": "jumlahPRL",
                                "title": "Perempuan",
                                width: "80px",
                                template: "<span class='style-center'>#: jumlahPRL #</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#:data.jumlahPRL.sum  #"
                            }
                        ]

                    },
                    {
                        field: "totallama",
                        title: "JUMLAH KASUS LAMA (7+8)",
                        width: "80px",
                        headerAttributes: { style: "text-align : center" },
                        template: "<span class='style-center'>#: totallama #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.totallama.sum  #"
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah Kunjungan",
                        width: "120px",
                        headerAttributes: { style: "text-align : center" },
                        template: "<span class='style-center'>#: jumlah #</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.jumlah.sum  #"
                    }
                ]

            };
            // };

            // $scope.panggil();

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.createColumn = function () {
                var list = [
                    {
                        "field": "jumlahLKH",
                        "title": "LK"
                    },
                    {
                        "field": "jumlahPRH",
                        "title": "LP"
                    }
                ];

                return list;
            };

            $scope.columndataRL54 = [

                {
                    "field": "kddiagnosa",
                    "title": "KODE ICD 10",
                    "width": "150px",
                    "align": "center"
                },
                {
                    "field": "namadiagnosa",
                    "title": "<center>DESKRIPSI</center>",
                    "width": "150px"
                },
                {
                    title: "<center>KASUS BARU MENURUT JENIS KELAMIN</center>",
                    columns: $scope.createColumn()

                },
                {
                    "field": "total",
                    "title": "Jumlah Kausu Baru (4+5)"
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah Kunjungan",
                    "width": "180px"
                }
            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
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

            //   manageTataRekening.getDataTableTransaksi("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
            //       $scope.listDepartemen = data.data.departemen;
            //       $scope.listKelompokPasien = data.data.kelompokpasien;
            //   })

            //   $scope.getIsiComboRuangan = function(){
            //       $scope.listRuangan = $scope.item.departement.ruangan
            //   }


            $scope.$watch('item.namaPenjamin', function (e) {
                //debugger
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
            $scope.item.tglakhir = tanggals + " 12:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.Cetak = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
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
                var stt = 'false'
                if (confirm('View Laporan Pasien Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
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
            }

        }
    ]);
});