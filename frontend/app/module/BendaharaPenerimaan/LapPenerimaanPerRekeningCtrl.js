define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LapPenerimaanPerRekeningCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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
                cacheHelper.set('LapPenerimaanPerRekeningCtrl', chacePeriode);

                medifirstService.get("kasir/get-data-lap-penerimaan-rekening?"
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
                field: "grup",
                aggregates: [
                    {
                        field: "grup",
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
                        fileName: "LaporanPenerimaanPerRekening.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "LAPORAN";
                        var myHeaders = [
                            {
                                value: "LAPORAN PENERIMAANPERREKENING " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",                            
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
                                "field": "",
                                "title": "<h3 align=center>Kode Rekening<h3>",
                                "width": "140px"                                
                            },
                            {
                                "field": "namadepartemen",
                                "title": "<h3 align=center>Uraian<h3>",
                                "width": "220px",                               
                            },
                            {
                                "field": "",
                                "title": "<h3 align=center>Jumlah Anggaran<h3>",
                                "width": "140px",                               
                            },
                            {
                                "field": "",
                                "title": "<h3 align=center>Penerimaan<h3>",
                                "width": "140px",
                                "columns":[
                                    {
                                        "field": "",
                                        "title": "<h3 align=center>s/d Bulan yang lalu<h3>",
                                        "width": "100px",                               
                                    },
                                    {
                                        "field": "total",
                                        "title": "<h3 align=center>Bulan ini<h3",
                                        "width": "100px",                               
                                    },
                                    {
                                        "field": "total",
                                        "title": "<h3 align=center>Jumlah<h3>",
                                        "width": "100px",                               
                                    }
                                ]                             
                            },
                            {
                                "field": "",
                                "title": "<h3 align=center>Sisa Kurang / (Lebih)<h3>",
                                "width": "140px",                               
                            }, 
                            {
                                "field": "",
                                "title": "<h3 align=center>(%)<h3>",
                                "width": "90px",                               
                            },                           
                            // {
                            //     "field": "penerimaankasir",
                            //     "title": "Jenis Penerimaan",
                            //     "width": "180px",
                            //     "template": "<span class='style-center'>#: penerimaankasir #</span>",
                            //     footerTemplate: "<span>Total </span>"
                            // },
                            // {
                            //     "field": "total",
                            //     "title": "Penerimaan",
                            //     "width": "180px",
                            //     "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>",
                            //     aggregates: ["sum"],
                            //     footerTemplate: "#: data.total.sum #",
                            //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                            //     footerAttributes: { style: "text-align: right;" }
                            // },
                            {
                                hidden: true,
                                field: "grup",
                                title: "grup",
                                aggregates: ["count"],
                                groupHeaderTemplate: "#= value #"
                            }
                        ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }                    
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