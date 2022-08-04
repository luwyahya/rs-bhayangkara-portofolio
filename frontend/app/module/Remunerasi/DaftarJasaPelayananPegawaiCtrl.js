define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarJasaPelayananPegawaiCtrl', [ '$state', '$q',  '$scope', 'CacheHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 100
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0
            $scope.item.cekKelompok =false

            var dataSave = []
            var data3 = []
            loadCombo();
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()
            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarJasaPelayananPegawaiCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.nmpegawai = arrPeriode[2];
                    // $scope.item.namaruangan = arrPeriode[3];
                    loadData()
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00');;
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59:59');
                    $scope.item.nmpegawai = '';
                    // $scope.item.namaruangan = '';
                }
                // manageTataRekening.getDataTableTransaksi("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
                //     $scope.listDepartemen = data.data.departemen;
                //     $scope.listKelompokPasien = data.data.kelompokpasien;
                //     $scope.listDokter = data.data.dokter;
                //     $scope.listDokter2 = data.data.dokter;
                // })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.Hitung = function () {
                $scope.popupHitungRemunerasi.center().open();
                //remunerasi/get-hitung-jasa-pelayanan-satu
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                medifirstService.get("remunerasi/get-hitung-jasa-pelayanan-satu?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, false).then(function (data) {
                        $scope.isRouteLoading = false;
                        dataSave = data.data.datasave
                        $scope.dataHitung1 = new kendo.data.DataSource({
                            data: data.data.pegawaijasapelayanan,
                            pageSize: 10,
                            serverPaging: false
                        });
                        $scope.dataHitung2 = new kendo.data.DataSource({
                            data: data.data.dataPegawaiRemunTidakLangsung,
                            pageSize: 10,
                            serverPaging: false
                        });
                    })
            }

            $scope.columndataHitung1 = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "pgid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "80px"
                    }
                ]
            };

            $scope.columndataHitung1D = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "70px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl. Pelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "150px"
                    },
                    // {
                    // 	"field": "jumlah",
                    // 	"title": "Jml. Pelayanan",
                    // 	"width":"80px"
                    // },
                    {
                        "field": "jenispaginilaitotal",
                        "title": "Jasa Pelayanan",
                        "width": "80px"
                    }
                ]
            };

            $scope.columndataHitung2 = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "pgid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "80px"
                    }
                ]
            };
            $scope.columndataHitung2D = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "70px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "tglpelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "jenispaginilaitotal",
                        "title": "jenispaginilaitotal",
                        "width": "150px"
                    }
                ]
            };


            $scope.dklikGriddataHitung2 = function (dataHitung2DSelected) {
                var dataGrid = []
                for (var i = 0; i < dataSave.length; i++) {
                    if (dataSave[i].pegawaiid == dataHitung2DSelected.pgid) {
                        dataGrid.push(dataSave[i])
                    }
                }
                $scope.dataHitung2D = new kendo.data.DataSource({
                    data: dataGrid,
                    pageSize: 10,
                    serverPaging: false
                });
            }
            $scope.dklikGriddataHitung1 = function (dataHitung1Selected) {
                var dataGrid2 = []
                for (var i = 0; i < dataSave.length; i++) {
                    if (dataSave[i].pegawaiid == dataHitung1Selected.pgid) {
                        dataGrid2.push(dataSave[i])
                    }
                }
                $scope.dataHitung1D = new kendo.data.DataSource({
                    data: dataGrid2,
                    pageSize: 10,
                    serverPaging: false
                });
            }




            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                var nmdokter = ""
                if ($scope.item.nmpegawai != undefined) {
                    var nm = "&namalengkap=" + $scope.item.nmpegawai
                    nmdokter = $scope.item.nmpegawai
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }
                var ruan = ""
                if ($scope.item.namaruangan!= undefined) {
                     ruan = $scope.item.namaruangan
                }
                var cek = ""
                if ($scope.item.cekKelompok!= undefined) {
                     cek = $scope.item.cekKelompok
                }
                var noclosing = ""
                if ($scope.item.noclosing!= undefined) {
                    noclosing = $scope.item.noclosing
                }


                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-daftar-remunerasi-pegawai?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk
                        + '&jmlRows=' + jmlRows
                        + '&namaruangan='+ruan
                        + '&noclosing='+noclosing
                         + '&iskelompokpenghasil='+cek),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // data1 = data[0].data.data1
                    data3 = data[0].data.datapersen
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    totaljasalayanan: { type: "number" },
                                    totaljasaremun: { type: "number" },
                                    totaljasamanajemen: { type: "number" },
                                    total: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'totaljasalayanan', aggregate: 'sum' },
                            { field: 'totaljasaremun', aggregate: 'sum' },
                            { field: 'totaljasamanajemen', aggregate: 'sum' },
                            { field: 'total', aggregate: 'sum' }

                        ]
                    });
                    // var iddokter = ''
                    // var nmdokter = ''
                    // if ($scope.data1Selected != undefined) {
                    // 	iddokter = $scope.data1Selected.pgid
                    // 	nmdokter = $scope.data1Selected.namakaryawan
                    // }
                    var chacePeriode = tglAwal + "~" + tglAkhir + "~" + nmdokter;
                    cacheHelper.set('DaftarJasaPelayananPegawaiCtrl', chacePeriode);
                });

            };


            $scope.klikGrid1 = function (data1Selected) {
                if (data1Selected != undefined) {
                    $scope.item.nostrukpagu = data1Selected.nostrukpagu
                }
            }
            $scope.MapPegawai = function () {
                $state.go("MappingJasaPelayananToPegawai")
            }
            $scope.DetailRemun = function () {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                var iddokter = ''
                var nmdokter = ''
                var noclosing = ''
                var jenis = ''
                // var ruanganfk = ''
                if ($scope.data1Selected != undefined) {
                    iddokter = $scope.data1Selected.pgid
                    nmdokter = $scope.data1Selected.namakaryawan
                    noclosing = $scope.data1Selected.noclosing
                    jenis = $scope.data1Selected.jabatan
                    // ruanganfk = $scope.data1Selected.ruanganfk
                }
                var chacePeriode = tglAwal + "~" + tglAkhir + "~" 
                + iddokter + "~" + nmdokter + "~" + noclosing+ "~" + jenis;
                cacheHelper.set('DaftarJasaPelayananSatuCtrl', chacePeriode);
                $state.go('LaporanTransaksiInstalasi')
            }
            $scope.detail = function () {
                $scope.popupKomponen.center().open();
                var nostruk = ''
                if ($scope.item.nostrukpagu != undefined) {
                    nostruk = $scope.item.nostrukpagu
                }
                medifirstService.get("remunerasi/get-detail-jasa-layanan-pagu?" + "&nostrukpagu=" + nostruk, false).then(function (data) {
                    $scope.isRouteLoading = false;
                    // datagrid2 = data.data.data2
                    // data3 = data.data.datasave
                    $scope.ddata1 = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    ttlremunDokter: { type: "number" },
                                    ttlremunParamedis: { type: "number" },
                                    ttlremunRekamMedis: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'ttlremunDokter', aggregate: 'sum' },
                            { field: 'ttlremunParamedis', aggregate: 'sum' },
                            { field: 'ttlremunRekamMedis', aggregate: 'sum' }

                        ]
                    });
                    $scope.ddata2 = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        // total:data2.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    ttljasaSDM: { type: "number" },
                                    ttljasaManajemen: { type: "number" },
                                    ttljasaNonStruktural: { type: "number" }
                                }
                            }
                        },
                        aggregate: [
                            { field: 'ttljasaSDM', aggregate: 'sum' },
                            { field: 'ttljasaManajemen', aggregate: 'sum' },
                            { field: 'ttljasaNonStruktural', aggregate: 'sum' }

                        ]
                    });
                    $scope.ddata2rincian = new kendo.data.DataSource({
                        data: data.data.datakelompokpegawai,
                        pageSize: 10,
                        // total:data2.data,
                        serverPaging: false//,
                        //  schema: {
                        //     model: {
                        //         fields: {
                        //             ttljasaSDM: { type: "number" },
                        //             ttljasaManajemen: { type: "number" },
                        //             ttljasaNonStruktural: { type: "number" }
                        //         }
                        //     }
                        // },
                        // aggregate: [
                        //     { field: 'ttljasaSDM', aggregate: 'sum' },
                        //     { field: 'ttljasaManajemen', aggregate: 'sum' },
                        //     { field: 'ttljasaNonStruktural', aggregate: 'sum' }

                        // ]
                    });
                })
            }
            $scope.columnData1 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Daftar Remunerasi Pegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "Remun";

                    var myHeaders = [{
                        value: " Remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "noclosing",
                        "title": "Noclosing",
                        "width": "50px",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "tglawal",
                        "title": "Tgl Awal",
                        "width": "50px"
                    },
                    {
                        "field": "tglakhir",
                        "title": "Tgl Akhir",
                        "width": "50px"
                    },
                    {
                        "field": "pgid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namakaryawan",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "skpertamamasukrs",
                        "title": "SK Pertama",
                        "width": "90px"
                    },
                    {
                        "field": "golongan",
                        "title": "Golongan",
                        "width": "90px"
                    },
                    {
                        "field": "jabatan",
                        "title": "Jabatan",
                        "width": "70px"
                    },
                    {
                        "field": "total",
                        "title": "Total Remunerasi",
                        "width": "120px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            };
            $scope.dcolumnData2 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Nilai Pagu remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Nilai Pagu remunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "produkfk",
                        "title": "Kode Produk",
                        "width": "50px",
                        footerTemplate: "Total"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": "150px"
                    },
                    {
                        "field": "ttljasaSDM",
                        "title": "Jasa SDM",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaSDM #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaSDM.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ttljasaManajemen",
                        "title": "Jasa Manajemen",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaManajemen #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaManajemen.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        "field": "ttljasaNonStruktural",
                        "title": "Jasa Non Struktural",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: ttljasaNonStruktural #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.ttljasaNonStruktural.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                ]
            };

            $scope.dcolumnData2rincian = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "jpid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "150px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml. Pegawai",
                        "width": "80px"
                    }
                ]
            };



            $scope.saveClosingRemunerasi = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                var data1 = {
                    periodeawal: tglAwal,
                    periodeakhir: tglAkhir
                }
                var objSave =
                {
                    head: data1,
                    data: dataSave
                }

                medifirstService.post('remunerasi/save-closing-jasa-pelayanan-satu', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                })
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
            $scope.cetakKartu = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.tglpulang == undefined) {
                    window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noReg = "";
                else
                    var noReg = $scope.dataPasienSelected.noregistrasi;
                var stt = 'false'
                if (confirm('View Kartu Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            // END ################

        }
    ]);
});