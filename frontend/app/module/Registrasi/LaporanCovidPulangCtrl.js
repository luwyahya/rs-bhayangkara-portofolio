define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanCovidPulangCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            //debugger
            $scope.LapCP = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }


            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuangan = "";
                if ($scope.item.statRuangan != undefined) {
                    tempRuangan = "&statRuangan=" + $scope.item.statRuangan.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanCovCtrl', chacePeriode);

                medifirstService.get("registrasi/get-laporan-covid-pulang?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuangan
                ).then(function (data) {
                    var data = data.data
                    $scope.isRouteLoading = false;

                    //   debugger
                    $scope.ambildataexcel = data.data;
                    // $scope.panggil($scope.ambildataexcel);
                    $scope.dataLaporanCovid = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },  aggregate: [
                            { field: 'polri', aggregate: 'sum' },
                            { field: 'umum', aggregate: 'sum' },
                            { field: 'pria', aggregate: 'sum' },
                            { field: 'wanita', aggregate: 'sum' },
                            { field: 'positif', aggregate: 'sum' },
                            { field: 'negatif', aggregate: 'sum' },
                            { field: 'hidup', aggregate: 'sum' },
                            { field: 'meninggal', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    });


                })
            }
            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function (dat) {
                    $scope.listRuanganRanapZonaMerah = dat.data.ruanganranapzonamerah;
                });
            // debugger;
            // $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "LaporanPasienCovidMasihDirawat.xlsx",
                        filterable: true,
                        allPages: true,
                    },
                    dataSource: $scope.ambildataexcel,
                    // filterable: true,
                    resizable: true,
                    sortable: true,
                    // allPages: true,
                    // reorderable: true,
                    // filterable: true,
                    pageable: true,
                    // groupable: true,
                    // columnMenu: true,
                    // resizable: true,
                    columns: [
                        {
                            title: "UPDATE LAPORAN",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "tglregistrasi",
                                    "title": "Tanggal",
                                    width: "100px",
                                }
                            ]

                        },
                        {
                            field: "namaruangan",
                            title: "Ruangan",
                            width: "100px",
                            template: "<span class='style-center'>#: namaruangan #</span>",
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
                            field: "namapasien",
                            title: "Nama Pasien",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "noidentitas",
                            title: "NIK",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "nocm",
                            title: "Nomor RM",
                            width: "100px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "Status (Pasien Lama)",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "polri",
                                    "title": "Polri/PNS",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.polri.sum  #"
                                },
                                {
                                    "field": "umum",
                                    "title": "Umum",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.umum.sum  #"
                                }
                            ]

                        },
                        {
                            field: "namapangkat",
                            title: "Pangkat",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "nip",
                            title: "NRP/NIP",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "kesatuanpasien",
                            title: "Kesatuan",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "umur",
                            title: "Umur",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "tglregistrasi",
                            title: "Tgl Masuk",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "tglpulang",
                            title: "Tgl Pulang",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "Janis Kelamin",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "pria",
                                    "title": "Laki-laki",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.pria.sum  #"
                                },
                                {
                                    "field": "wanita",
                                    "title": "Perempuan",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.wanita.sum  #"
                                }
                            ]

                        },
                        {
                            title: "Hasil",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "positif",
                                    "title": "Positif",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.positif.sum  #"
                                },
                                {
                                    "field": "negatif",
                                    "title": "Negatif",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.negatif.sum  #"
                                }
                            ]

                        },
                        {
                            field: "diagnosa",
                            title: "Diagnosa Primary",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            field: "diagnosas",
                            title: "Diagnosa Secondary",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "Pulang",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "hidup",
                                    "title": "Hidup",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.hidup.sum  #"
                                },
                                {
                                    "field": "meninggal",
                                    "title": "Meninggal",
                                    width: "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.meninggal.sum  #"
                                }
                            ]

                        }
                    ]
                });
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

            $scope.columnLaporanCovid = 
            {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "LaporanPasienPulangCovid.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanPasienPulangCovid.pdf",
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
                    sheet.mergedCells = ["A1:U1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "LAPORAN PASIEN PULANG COVID-19 " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
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
                // title: "UPDATE LAPORAN",
                //     headerAttributes: { style: "text-align : center" },
                //     columns: [
                columns:
                    [
                        {
                            "field": "tglregistrasi",
                            "title": "Tanggal",
                            "width": "100px",
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "100px",
                            template: "<span class='style-center'>#: namaruangan #</span>",
                            headerAttributes: { style: "text-align : center" },

                        },
                        {
                            "field": "namapasien",
                            "title": "Nama Pasien",
                            "width": "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "noidentitas",
                            "title": "NIK",
                            "width": "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "nocm",
                            "title": "Nomor RM",
                            "width": "100px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "title": "Status (Pasien Lama)",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "polri",
                                    "title": "Polri/PNS",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.polri.sum  #"
                                },
                                {
                                    "field": "umum",
                                    "title": "Umum",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.umum.sum  #"
                                }
                            ]

                        },
                        {
                            "field": "namapangkat",
                            "title": "Pangkat",
                            "width": "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "nip",
                            "title": "NRP/NIP",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "kesatuanpasien",
                            "title": "Kesatuan",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "umur",
                            "title": "Umur",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Masuk",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "tglpulang",
                            "title": "Tgl Pulang",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "title": "Janis Kelamin",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "pria",
                                    "title": "Laki-laki",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.pria.sum  #"
                                },
                                {
                                    "field": "wanita",
                                    "title": "Perempuan",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.wanita.sum  #"
                                }
                            ]

                        },
                        {
                            "title": "Hasil",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "positif",
                                    "title": "Positif",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.positif.sum  #"
                                },
                                {
                                    "field": "negatif",
                                    "title": "Negatif",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.negatif.sum  #"
                                }
                            ]

                        },
                        {
                            "field": "diagnosa",
                            "title": "Diagnosa Primary",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "field": "diagnosas",
                            "title": "Diagnosa Secondary",
                            "width": "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            "title": "Pulang",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "hidup",
                                    "title": "Hidup",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.hidup.sum  #"
                                },
                                {
                                    "field": "meninggal",
                                    "title": "Meninggal",
                                    "width": "80px",
                                    aggregates: ["sum"],
                                    footerTemplate: " #:data.meninggal.sum  #"
                                }
                            ]

                        }
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
            $scope.item.tglakhir = tanggals + " 23:59";

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
                if ($scope.item.statRuangan == undefined)
                    var statRuangan = "";
                else
                    var statRuangan = $scope.item.statRuangan.id;
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