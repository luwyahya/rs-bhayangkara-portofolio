define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BukuBantuPenerimaanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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
                cacheHelper.set('LaporanRekapPendapatanHarianCtrl', chacePeriode);

                medifirstService.get("kasir/get-data-lap-rekap-pendapatan-harian?"
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


            $scope.group = [
                {
                    field: "kelompokpenerimaan",
                    aggregates: [
                        {
                            field: "kelompokpenerimaan",
                            aggregate: "count"
                        }
                    ]
                },
                {
                    field: "penerimaankasir",
                    aggregates: [
                        {
                            field: "penerimaankasir",
                            aggregate: "count"
                        }
                    ]
                },
                {
                    field: "kelompoklayanan",
                    aggregates: [
                        {
                            field: "kelompoklayanan",
                            aggregate: "count"
                        }
                    ]
                }
            ];
            $scope.columnPasienPulang =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "LaporanRekapananPendapatanHarian.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:C1"];
                        sheet.name = "LAPORAN";
                        var myHeaders = [
                            {
                                value: "LAPORAN REKAPAN PENDAPATAN HARIAN " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' sampai ' +
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
                                "title": "Pembayaran langsung Instalasi",
                                "width": "180px",
                                "columns": [
                                    {
                                        //"field": "",
                                        "title": "Rawat Jalan",
                                        "width": "180px",
                                        //"template": "<span class='style-center'>#:  #</span>"
                                        columns : [
                                            {
                                                "title" : "Rekam Medik",
                                                "width" : "80px",
                                                "columns": [
                                                    {
                                                        "title": "Cetak Kartu",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Psikiatri",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "MMPI",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Psikoterapi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Saraf",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis PD",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Anak",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Obsygn",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Paru",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Spesialis Rehab Medik",
                                                "width" : "200px",
                                                "columns": [
                                                    {
                                                        "title": "Psn/ L/B",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Pemr dr",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Tindakan",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title" : "Poli Sub Spesialis",
                                                "width" : "200px"
                                            },
                                            {
                                                "title" : "Poli Umum",
                                                "width" : "200px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Pelayanan IGD dan HCU/PICU/NICU",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "Rekam Medik IGD",
                                                "width": "80px",
                                            },
                                            {
                                                "title": "Askep",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Pemr dr",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Tindakan",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Rawat Inap",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "VVIP",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Biasa",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Intensif Care",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "VIP",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Biasa",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Intensif Care",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "I",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Biasa",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Intensif Care",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "II",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Biasa",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Intensif Care",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "III",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Biasa",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Intensif Care",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "Psikoterapi",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Visite Dokter",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Pelayanan NAPZA",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Pelayanan Psikogeriatri",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Tumbuh Kembang Anak",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Rehab Medik",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "TM DR",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Tindakan Rehab Medik",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Laboratorium",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "Lab Umum",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "SKBN",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Radiologi",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Elektromedik",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Rehab Mental",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Ply. Gigi & Mulut",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Farmasi",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "R. Jalan",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "R. Inap",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Visite Apt",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Psikologi",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "RI + RJ",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Psi SK",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Inst. Gizi",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "Konslts, Ash Gizi, Tindkn",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Asuhan Keperawatan",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Medikolegal",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "SHJ",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "SK Sakit Jiwa (pernah dirawat) Rp. 40.000",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "SK Kondisi Ksh Jiwa (kasus Hukum) Rp. 225.000",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "Visum",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "SKBN",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "Rapid Test Covid",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "SK Sehat Fisik",
                                                "width": "80px",
                                                "columns": [
                                                    {
                                                        "title": "Pem. Medis",
                                                        "width": "80px"
                                                    },
                                                    {
                                                        "title": "Administrasi",
                                                        "width": "80px"
                                                    }
                                                ]
                                            },
                                            {
                                                "title": "Pemulasaran Jenazah",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Jumlah Pembayaran Langsung Instalasi",
                                                "width": "80px"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "title": "Pembayaran dengan Jaminan",
                                "width": "200px",
                                "columns": [
                                    {
                                        "title": "BPJS",
                                        "width": "80px"
                                    },
                                    {
                                        "title": "Jamkesda",
                                        "width": "80px"
                                    },
                                    {
                                        "title": "IPWL",
                                        "width": "80px"
                                    },
                                    {
                                        "title": "Klaim Covid",
                                        "width": "80px"
                                    },
                                    {
                                        "title": "Jumlah",
                                        "width": "80px"
                                    }
                                ]
                            },
                            {
                                "title": "Jumlah Pendapatan",
                                "width": "80px"
                            },
                            {
                                "title": "Diklat",
                                "width": "200px",
                                "columns": [
                                    {
                                        "title": "Diklat",
                                        "width": "80px"
                                    },
                                    {
                                        "title": "Asrama",
                                        "width": "80px"
                                    }
                                ]
                            },
                            {
                                "title": "Jasa Ketatausahaan",
                                "width": "80px"
                            },
                            {
                                "title": "Jumlah Pendapatan",
                                "width": "80px"
                            },
                            {
                                "title": "Pemakaian Kekayaan Daerah",
                                "width": "200px",
                                "columns": [
                                    {
                                        "title": "Sewa",
                                        "width": "200px",
                                        "columns": [
                                            {
                                                "title": "Sewa Ambulance",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Sewa Kendaraan",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Sewa GOR",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Sewa Kantin",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Sewa Ruang",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Lahan Parkir",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Sewa ATM",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Lahan RS",
                                                "width": "80px"
                                            },
                                            {
                                                "title": "Peralatan RS",
                                                "width": "80px"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Jumlah Pemakaian",
                                        "width": "80px"
                                    }
                                ]
                            },
                            {
                                "title": "Laundry",
                                "width": "80px"
                            },
                            {
                                "title": "Pemakaian Kekayaan Daerah",
                                "width": "200px",
                                "columns": [
                                    {
                                        "title": "Jasa Giro",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Denda BPJS",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "Denda pihak ke-3",
                                        "width": "200px"
                                    },
                                    {
                                        "title": "lain-lain",
                                        "width": "200px"
                                    }
                                ]
                            },
                            {
                                "title": "Jumlah Pendapatan lain-lain",
                                "width": "200px"
                            },
                            {
                                "title": "x",
                                "width": "200px"
                            }
                        ],
                    sortable: {
                        mode: "single",
                        allowUnsort: true,
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