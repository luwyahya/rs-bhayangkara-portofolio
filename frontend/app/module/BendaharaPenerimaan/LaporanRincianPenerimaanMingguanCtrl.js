define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRincianPenerimaanMingguanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            var details = [];
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

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
                cacheHelper.set('LaporanRincianPenerimaanMingguanCtrl', chacePeriode);

                medifirstService.get("kasir/get-data-lap-perincian-penerimaan-mingguan?"
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
                                value: "LAPORAN RINCIAN PENERIMAAN MINGGUAN " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
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
                                "field": "penerimaankasir",
                                "title": "Jenis Penerimaan",
                                "width": "170px",
                                "template": "<span class='style-center'>#: penerimaankasir #</span>",
                                footerTemplate: "<span>Total </span>"
                            },
                            {
                                "field": "c1",
                                "title": "1",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c1 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c1.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c1.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c2",
                                "title": "2",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c2 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c2.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c2.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c3",
                                "title": "3",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c3 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c3.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c3.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c4",
                                "title": "4",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c4 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c4.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c4.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c5",
                                "title": "5",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c5 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c5.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c5.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c6",
                                "title": "6",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c6 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c6.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c6.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c7",
                                "title": "7",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c7 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c7.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c7.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c8",
                                "title": "8",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c8 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c8.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c8.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c9",
                                "title": "9",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c9 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c9.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c9.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c10",
                                "title": "10",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c10 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c10.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c10.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c11",
                                "title": "11",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c11 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c11.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c11.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c12",
                                "title": "12",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c12 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c12.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c12.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c13",
                                "title": "13",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c13 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c13.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c13.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c14",
                                "title": "14",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c14 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c14.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c14.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c15",
                                "title": "15",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c15 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c15.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c15.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c16",
                                "title": "16",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c16 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c16.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c16.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c17",
                                "title": "17",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c17 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c17.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c17.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c18",
                                "title": "18",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c18 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c18.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c18.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c19",
                                "title": "19",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c19 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c19.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c19.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c20",
                                "title": "20",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c20 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c20.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c20.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c21",
                                "title": "21",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c21 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c21.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c21.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c22",
                                "title": "22",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c22 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c22.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c22.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c23",
                                "title": "23",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c23 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c23.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c23.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c24",
                                "title": "24",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c24 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c24.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c24.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c25",
                                "title": "25",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c25 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c25.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c25.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c26",
                                "title": "26",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c26 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c26.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c26.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c27",
                                "title": "27",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c27 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c27.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c27.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c28",
                                "title": "28",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c28 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c28.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c28.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c29",
                                "title": "29",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c29 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c29.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c29.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c30",
                                "title": "30",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c30 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c30.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c30.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                "field": "c31",
                                "title": "31",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: c31 #', 'Rp.')}}</span>",
                                aggregates: ["sum"],
                                footerTemplate: "#: data.c31.sum #",
                                footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.c31.sum #', 'Rp.')}}</span>",
                                footerAttributes: { style: "text-align: right;" }
                            },
                            {
                                hidden: true,
                                field: "kelompokpenerimaan",
                                title: "kelompokpenerimaan",
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

            medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                $scope.listDepartemen = data.data.departemen;
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })

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