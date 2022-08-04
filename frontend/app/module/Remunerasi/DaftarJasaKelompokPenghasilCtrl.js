define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarJasaKelompokPenghasilCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'MedifirstService',
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
            $scope.item.cekKelompok = false
            $scope.popUp = {}

            var dataSave = []
            var data3 = []
            var data2 = []
            loadCombo();
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()
            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarRemunKel');
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

            }
            medifirstService.get('remunerasi/get-combo-rem').then(function (r) {
                $scope.listPegawai = r.data.pegawai
            })
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
                if ($scope.item.namaruangan != undefined) {
                    ruan = $scope.item.namaruangan
                }
                var cek = ""
                if ($scope.item.cekKelompok != undefined) {
                    cek = $scope.item.cekKelompok
                }
                var noclosing = ""
                if ($scope.item.noclosing != undefined) {
                    noclosing = $scope.item.noclosing
                }


                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-daftar-remunerasi-kelompok?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk
                        + '&jmlRows=' + jmlRows
                        + '&namaruangan=' + ruan
                        + '&noclosing=' + noclosing
                        + '&iskelompokpenghasil=' + cek),
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

                    var chacePeriode = tglAwal + "~" + tglAkhir + "~" + nmdokter;
                    cacheHelper.set('DaftarRemunKel', chacePeriode);
                });

            };


            $scope.klikGrid1 = function (data1Selected) {
                if (data1Selected != undefined) {
                    $scope.item.nostrukpagu = data1Selected.nostrukpagu
                }
            }
            $scope.DetailRemun = function () {
                if ($scope.data1Selected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popUp = {}
                $scope.popUp = $scope.data1Selected
                $scope.popUp.totalRemun = 0
                $scope.popUp.pagunilai = parseFloat($scope.data1Selected.total)
                loadDetail($scope.popUp.strukclosingfk, $scope.popUp.ruid)
                $scope.cancel()

                $scope.popUpDetail.center().open()
                var actions = $scope.popUpDetail.options.actions;
                // Remove "Close" button
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.popUpDetail.setOptions({ actions: actions });
            }
            function loadDetail(noclos, ruid) {
                data2 = []
                medifirstService.get('remunerasi/get-detail-kelompok?noclosing=' + noclos
                    + '&ruid=' + ruid).then(function (z) {
                        for (let i = 0; i < z.data.data.length; i++) {
                            const element = z.data.data[i];
                            element.no = i + 1
                            data2.push(element)
                        }
                        var tot = 0
                        for (let x = 0; x < data2.length; x++) {
                            const element = data2[x];
                            tot = tot + parseFloat(element.pagunilai)
                        }
                        $scope.popUp.pagunilai = parseFloat($scope.data1Selected.total) - tot
                        $scope.popUp.totalRemun = tot

                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: data2
                        });

                    })
            }
            $scope.cancel = function () {
                $scope.popUp.pegawai = ''
                // $scope.popUp.pagunilai = ''
                $scope.popUp.no = undefined
            }
            $scope.columnVerif = [

                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    "field": "namalengkap",
                    "title": "Pegawai",
                    "width": "160px",
                },
                {
                    "field": "pagunilai",
                    "title": "Jasa Remun",
                    "width": "40px",
                },
            ];
            $scope.del = function () {
                if ($scope.popUp.pegawai == undefined) {
                    toastr.error("Pilih Pegawai terlebih dahulu!!")
                    return;
                }
                if ($scope.popUp.pagunilai == undefined || $scope.popUp.pagunilai == 0) {
                    toastr.error("Jasa Remun harus di isi!")
                    return;
                }

                var nomor = 0
                if ($scope.sourceVerif == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.popUp.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.popUp.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            $scope.sourceVerif = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                var tot = 0
                for (let x = 0; x < data2.length; x++) {
                    const element = data2[x];
                    tot = tot + parseFloat(element.pagunilai)
                }
                $scope.popUp.pagunilai = parseFloat($scope.data1Selected.total) - tot
                $scope.popUp.totalRemun = tot
                $scope.cancel()
            }
            $scope.simpanVerifikasi = function () {
                if (data2.length == 0) {
                    toastr.error('Rincian Pegawai harus di isi')
                    return
                }
                var tot = 0
                for (let i = 0; i < data2.length; i++) {
                    const element = data2[i];
                    tot = tot + element.pagunilai
                }
                if (tot < parseFloat($scope.popUp.total)) {
                    toastr.error('Jumlah Harus sama dengan Total Remun')
                    return
                }
                var json = {
                    'strukclosingfk': $scope.popUp.strukclosingfk,
                    'noclosing': $scope.popUp.noclosing,
                    'ruid': $scope.popUp.ruid,
                    'djpid': $scope.popUp.djpid,
                    'jpid': $scope.popUp.jpid,
                    'details': data2
                }
                medifirstService.post('remunerasi/save-detail-kelompok', json).then(function (z) {
                    $scope.batalVerif()
                })
            }
            $scope.klikVerif = function (dataSelectedVerif) {
                var pega = [];
                for (let i = 0; i < $scope.listPegawai.length; i++) {
                    const element = $scope.listPegawai[i];
                    if (element.id == dataSelectedVerif.pegawaiid) {
                        pega = element
                        break
                    }
                }
                $scope.popUp.no = dataSelectedVerif.no
                $scope.popUp.pegawai = pega
                $scope.popUp.pagunilai = dataSelectedVerif.pagunilai
                // $scope.dataSelectedVerif = dataSelectedVerif
            }
            $scope.batalVerif = function () {
                data2 = []
                $scope.sourceVerif = new kendo.data.DataSource({
                    data: data2
                });
                $scope.popUp = {}
                $scope.popUpDetail.close()
            }
            $scope.add = function () {
                if ($scope.popUp.pegawai == undefined) {
                    toastr.error("Pilih Pegawai terlebih dahulu!!")
                    return;
                }
                if ($scope.popUp.pagunilai == undefined || $scope.popUp.pagunilai == 0) {
                    toastr.error("Jasa Remun harus di isi!")
                    return;
                }


                var nomor = 0
                if ($scope.sourceVerif == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                if (data2.length > 0) {
                    var total = 0
                    for (var i = 0; i < data2.length; i++) {
                        total = parseFloat(data2[i].pagunilai) + total
                    }
                    if (total > parseFloat($scope.data1Selected.total)) {
                        toastr.error('Total Jasa Remun harus sama dengan Total')
                        return
                    }
                }
                var data = {};
                if ($scope.popUp.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.popUp.no) {
                            data.no = $scope.popUp.no

                            data.pegawaiid = $scope.popUp.pegawai.id
                            data.namalengkap = $scope.popUp.pegawai.namalengkap
                            data.pagunilai = parseFloat($scope.popUp.pagunilai)
                            data2[i] = data;
                            $scope.sourceVerif = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        pegawaiid: $scope.popUp.pegawai.id,
                        namalengkap: $scope.popUp.pegawai.namalengkap,
                        pagunilai: parseFloat($scope.popUp.pagunilai),

                    }
                    data2.push(data)
                    $scope.sourceVerif = new kendo.data.DataSource({
                        data: data2
                    });
                }
                var tot = 0
                for (let x = 0; x < data2.length; x++) {
                    const element = data2[x];
                    tot = tot + parseFloat(element.pagunilai)
                }
                $scope.popUp.pagunilai = parseFloat($scope.data1Selected.total) - tot
                $scope.popUp.totalRemun = tot
                $scope.cancel();
            }


            $scope.columnData1 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Daftar Remunerasi Kelompok Penghasil.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
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
                        "field": "ruid",
                        "title": "ID",
                        "width": "50px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "150px"
                    },
                    // {
                    //     "field": "skpertamamasukrs",
                    //     "title": "SK Pertama",
                    //     "width": "90px"
                    // },
                    // {
                    //     "field": "golongan",
                    //     "title": "Golongan",
                    //     "width": "90px"
                    // },
                    // {
                    //     "field": "jabatan",
                    //     "title": "Jabatan",
                    //     "width": "70px"
                    // },
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