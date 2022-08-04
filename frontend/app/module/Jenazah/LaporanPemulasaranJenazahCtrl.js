define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPemulasaranJenazahCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisialisasi Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }

            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganrajal;
                    })

                medifirstService.get("registrasi/get-data-combo-new", true).then(function (data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listJenisPelayanan = data.data.jenispelayanan;
                })
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }

                var tempJenPelId = "";
                if ($scope.item.jenisPelayanan != undefined) {
                    tempJenPelId = "&jenisPelayanan=" + $scope.item.jenisPelayanan.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

             medifirstService.get("jenazah/get-lap-pemulasaran-jenazah?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        var data =data.data
                        var length = data.data.length
                        var group =  []
                        var podo = false
                        for (var i = 0; i < length; i++) {
                            var element1 = data.data[i]
                            podo = false
                            if (podo== false) {
                                var datass = {
                                    kddiagnosa: element1.kddiagnosa,
                                    tglmeninggal: element1.tglmeninggal,
                                    tgllahir: element1.tgllahir,
                                    alamatrmh: element1.alamatrmh,
                                    kelompokpasien: element1.kelompokpasien,
                                    asalruangan: element1.namaruangan,
                                    namaruangan: element1.namaruangan,
                                    namapasien: element1.namapasien,
                                    no: element1.no,
                                    nocm: element1.nocm,
                                    nobpjs: element1.nobpjs,
                                    umur: element1.umur,
                                    petugas: '-',
                                    kondisipasien: '-',
                                    tindakan: '-',
                                    jeniskelamin: element1.jeniskelamin
                                }
                                group.push(datass)
                            }
                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                        }

                        $scope.dataSourceGridK = {
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {   
                                        no: { type: "string" },
                                        kddiagnosa: { type: "string" },
                                        tglmeninggal: { type: "string" },
                                        kelompokpasien: { type: "string" },
                                        tgllahir: { type: "string" },
                                        alamatrmh: { type: "string" },
                                        namaruangan: { type: "string" },
                                        namapasien: { type: "string" },
                                        nocm: { type: "string" },
                                        nobpjs: { type: "string" },
                                        umur: { type: "number" },
                                        kondisipasien: { type: "string" },
                                        petugas: { type: "string" },
                                        tindakan: { type: "string" },
                                        jeniskelamin: { type: "string"},
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                        }
                    })

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnGridK = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Pemulasaran Jenazah.xlsx",
                    allPages: true,

                },
                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    // sheet.name = "Laporan Pemulasaran Jenazah";
                    sheet.mergedCells = ["A1:N1"];
                    var myHeaders = [{
                        value:"Laporan Pemulasaran Jenazah",
                        fontSize: 20,
                        textAlign: "center",
                        background:"#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});

                    // var rows = e.workbook.sheets[0].rows;
                    // rows.unshift({
                    //     cells: [{ value: "Laporan Pemulasaran Jenazah", background: "#fffff" }]
                    // });
                },      
                columns: [
                    {
                        "field": "no",
                        "title": "No.",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Purna Pasien",
                        "width": "150px",
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tanggal Lahir",
                        "width": "120px",
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "70px",
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "JK",
                        "width": "100px",
                    },
                    {
                        "field": "nocm",
                        "title": "No. MR",
                        "width": "100px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                    },
                    {
                        "field": "nobpjs",
                        "title": "No. BPJS",
                        "width": "120px",
                    },
                    {
                        "field": "alamatrmh",
                        "title": "Alamat",
                        "width": "200px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",
                    },
                    {
                        "field": "tglmeninggal",
                        "title": "Waktu Meninggal",
                        "width": "150px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Asal Ruangan",
                        "width": "200px",
                    },
                    {
                        "field": "kddiagnosa",
                        "title": "Diagnosa",
                        "width": "100px",
                    },
                    // {
                    //     "field": "tindakan",
                    //     "title": "Tindakan",
                    //     "width": "80px",
                    // },
                    // {
                    //     "field": "kondisipasien",
                    //     "title": "Keterangan",
                    //     "width": "100px",
                    // },
                    // {
                    //     "field": "petugas",
                    //     "title": "Nama Petugas IPJ",
                    //     "width": "150px",
                    // },
                ]
            }

            // Fungsi Clear Kriteria Search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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
            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            // Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();
        }
    ]);
});