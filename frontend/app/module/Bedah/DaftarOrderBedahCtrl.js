define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderBedahCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', '$window', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, $window, medifirstService) {
            debugger;
            $scope.item = {};
            $scope.item1 = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.btnSimpanVis = false;
            $scope.item.belumVerifikasi = true;

            var tempnorecjkn = '';

            var noregistrasi = '';
            var loginRadiologi = false
            var objectruanganfk = '';
            var namaRuangan = '';
            var kelompokpasien = '';
            var jenisPelayananOk = '';
            var norec_so = '';
            var norec_pp = ''
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                } else {
                    return;
                }
            }
            if ($scope.cekBelumVerifs == false) {
                tglAwal = "&tglAwalOperasi=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                tglAkhir = "&tglAkhirOperasi=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
            }
            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                $scope.dataSelected = data;
                medifirstService.get("registrasi/daftar-registrasi/get-acc-number-radiologi?noOrder=" + $scope.dataSelected.noorder)
                    .then(function (e) {
                        $scope.dataRisOrder = e.data.data[0]
                    })
                medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" + $scope.dataSelected.noregistrasi +
                    "&noorder=" + $scope.dataSelected.noorder + "&idruangan=" + $scope.dataSelected.objectruangantujuanfk).then(function (e) {
                        $scope.norec_apd = $scope.norec_apd = e.data.ruangan[0].norec_apd
                    })
            }


            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienLaboratoriumCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    $scope.item.noReg = chacePeriode[4];

                    init();
                } else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function loadCombo() {
                var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
                $scope.KelompokUser = medifirstService.getKelompokUser();
                if ($scope.KelompokUser == 'bedah') /* KEl USER ITI*/ {
                    loginRadiologi = true
                }
                // medifirstService.get("pegawai/get-kelompok-user?luId=" + datauserlogin.id, true).then(function (e) {
                //     if (e.data.data.kelompokuser.indexOf('bedah') > -1)/* KEl USER ITI*/ {
                //         loginRadiologi = true
                //     }

                // })
                medifirstService.get("radiologi/get-combo-regis", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokter = data
                })
                medifirstService.getPart("laboratorium/poli-bpjs").then(function (data) {
                    $scope.listpoli = data;
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    var dok = "&pegId=" + $scope.item.dokter.id
                }

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var noOrderan = ""
                if ($scope.item.noOrderCari != undefined) {
                    var noOrderan = "&noOrders=" + $scope.item.noOrderCari
                }
                var isNotVerif = ""
                if ($scope.item.belumVerifikasi) {
                    var isNotVerif = "isNotVerif=" + true
                    var jmlRow = ""
                    if ($scope.item.jmlRow) {
                        jmlRow = "&jmlRow=" + $scope.item.jmlRow
                    }
                }
                var jmlRow = ""
                if ($scope.item.jmlRow) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }

                var tglAwal = ""
                var tglAkhir = ""
                var tglAwaloperasi = ""
                var tglAkhiroperasi = ""
                tglAwaloperasi = "&tglAwalOperasi=" + moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00');
                tglAkhiroperasi = "&tglAkhirOperasi=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59:59');
                tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00');
                tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59:59');
                // if ($scope.cekBelumVerifs == false) {
                //     tglAwal = "&tglAwalOperasi=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                //     tglAkhir = "&tglAkhirOperasi=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // }
                medifirstService.get("radiologi/get-daftar-order?" +
                    isNotVerif + tglAwal + tglAkhir + reg + rm + nm +
                    ins + rg + kp + dok + noOrderan + jmlRow, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        }
                        var data = dat.data.data
                        var Warnaku = [];
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].statusantrianjkn) {
                                //abu
                                case "MENUNGGU":
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                //hijau
                                case "Selesai":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                                //merah
                                case "ANTREAN":
                                    data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                                    break;
                            }
                        }
                        $scope.listDataPasien =
                            new kendo.data.DataSource({
                                data: data
                            });
                        $scope.listDataPasien.fetch(function (e) {
                            var temp = [];
                            for (var key in this._data) {
                                if (this._data.hasOwnProperty(key)) {
                                    var element = this._data[key];
                                    if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                                        temp.push(element);
                                }
                            }
                            $scope.listPasien = temp;
                            cacheHelper.set('listBedahSentral', temp);
                        });
                    });

                medifirstService.get("radiologi/get-daftar-orderverif?" +
                    isNotVerif + tglAwaloperasi + tglAkhiroperasi + reg + rm + nm +
                    ins + rg + kp + dok + noOrderan + jmlRow, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        }
                        var data = dat.data.data
                        var Warnaku = [];
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].statusantrianjkn) {
                                // data[i].no = i;
                                //abu
                                case "MENUNGGU":
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                //hijau
                                case "Selesai":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                                //merah
                                case "ANTREAN":
                                    data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                                    break;
                            }
                        }
                        $scope.listDataPasien =
                            new kendo.data.DataSource({
                                data: data
                            });
                        $scope.listDataPasien.fetch(function (e) {
                            var temp = [];
                            for (var key in this._data) {
                                if (this._data.hasOwnProperty(key)) {
                                    var element = this._data[key];
                                    if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                                        temp.push(element);
                                }
                            }
                            $scope.listPasienverif = temp;
                            cacheHelper.set('listBedahSentral', temp);
                        });
                    });
                medifirstService.get("laboratorium/get-all-permintaan-operasi-jkn3").then(function (data) {
                    $scope.dataSourceJadwal = data.data.response.list;
                });
            }
            $scope.asupKaForm = function (path, nocm, namapasien, jeniskelamin, umur, kelompokpasien, tglregistrasi, norec, norec_pd, objectkelasfk, namakelas, objectruanganfk, namaruangan, noregistrasi, alamatlengkap, dokterdpjp, iddpjp, tgllahir, objectkelompokpasienlastfk) {
                debugger
                if (norec == undefined) {
                    alert("PASIEN BELUM PERNAH DI TINDAK DI PENUNJANG")
                    return;
                }
                // var json = JSON.parse(selec)

                // $scope.ResumeRI = function (dataItem) {
                debugger
                // setCache(data)
                // cacheHelper.set('cacheRekamMedis', undefined);
                cacheHelper.set('CacheInputDiagnosaDokter', undefined);
                cacheHelper.set('InputResepApotikOrderRevCtrl', undefined);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', undefined);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', undefined);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', undefined);
                cacheHelper.set('cacheRMelektronik', undefined);
                cacheHelper.set('cacheCPPT', undefined);
                cacheHelper.set('cachePengkajianPasien', undefined);
                cacheHelper.set('OdontoGramDokterCtrl', undefined);
                cacheHelper.set('PengkajianSurveilansRevCtrl', undefined);
                cacheHelper.set('OrderElektromedikCtrl', undefined);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', undefined);

                var arrStr = {
                    0: nocm,
                    1: namapasien,
                    2: jeniskelamin,
                    3: noregistrasi,
                    4: umur,
                    5: kelompokpasien,
                    6: tglregistrasi,
                    7: norec,
                    8: norec_pd,
                    9: objectkelasfk,
                    10: namakelas,
                    11: objectruanganfk,
                    12: namaruangan,
                    13: noregistrasi,
                    14: moment(tgllahir).format('DD-MM-YYYY'),
                    15: alamatlengkap,
                    16: dokterdpjp,
                    17: iddpjp,
                    18: tgllahir,
                    19: objectkelompokpasienlastfk
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheCPPT', arrStr);
                cacheHelper.set('cachePengkajianPasien', arrStr);
                cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                cacheHelper.set('OrderElektromedikCtrl', arrStr);

                // $state.goNewTab(path, {
                //     noRec: norec,
                //     emr: "ResumeRI",
                // });
                var url = $state.href(path, {
                    noRec: norec,
                    emr: "ResumeRI"
                });
                $window.open(url, '_blank');
                // window.open(path, {
                //     noRec: norec,
                //     emr: "ResumeRI"
                // });
            }
            // $scope.simpanJadwalOperasiLangsung = function (e) {
            //     debugger;
            //     var dataObjPost = {};
            //     dataObjPost = {
            //         nocm: $scope.item.nocm,
            //         namaPeserta: $scope.item.namaPeserta,
            //         nopeserta: $scope.item.nopeserta,
            //         tanggaloperasi: moment($scope.item.tanggaloperasi).format('YYYY-MM-DD HH:mm:ss'),
            //         jenistindakan: $scope.item.jenistindakan,
            //         kdpoli: $scope.item.poli.kdpoli,
            //         nmpoli: $scope.item.poli.nmpoli,
            //     }
            //     medifirstService.post('laboratorium/save-jadwal-operasi', dataObjPost).then(function (e) {
            //         var x = e
            //         init();
            //     })
            // }

            $scope.simpanJadwalOperasi = function () {
                debugger;
                var dataObjPost = {};
                dataObjPost = {
                    norec_so: norec_so,
                    nocm: $scope.item.nocm,
                    namaPeserta: $scope.item.namaPeserta,
                    nopeserta: $scope.item.nopeserta,
                    tanggaloperasi: moment($scope.item.tanggaloperasi).format('YYYY-MM-DD HH:mm:ss'),
                    jenistindakan: $scope.item.jenistindakan,
                    kdpoli: $scope.item.poli.kdpoli,
                    nmpoli: $scope.item.poli.nmpoli,
                }
                medifirstService.post('laboratorium/save-jadwal-operasi', dataObjPost).then(function (e) {
                    var x = e
                    init();
                })
            }


            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.columnJadwal = [{
                "field": "nocm",
                "title": "No RM",
                "width": "20px",
            },
            {
                "field": "nopeserta",
                "title": "No BPJS",
                "width": "150px",
            },
            {
                "field": "namapeserta",
                "title": "Nama Peserta",
                "width": "80px",
            },
            {
                "field": "tanggaloperasi",
                "title": "tanggaloperasi",
                "width": "80px",
            },
            {
                "field": "terlaksana",
                "title": "terlaksana",
                "width": "80px",
            },
            {
                "command": [{
                    text: "Update Terlaksana",
                    click: updateTerlaksana,
                    imageClass: "k-icon k-save"
                },
                {
                    text: "Hapus",
                    click: hapusJadwal,
                    imageClass: "k-icon k-save"
                },
                ],
                title: "",
                width: "100px",
            }
            ];

            function updateTerlaksana(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var dataObjPost = {
                    "norec": dataItem.norec
                }
                medifirstService.post('laboratorium/update-jadwal-operasi', dataObjPost).then(function (e) {
                    var x = e
                    init();
                })
            }
            $scope.updateTerlaksanaGabung = function (e) {
                // e.preventDefault();
                var dataItem = $scope.dataSelected;

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var dataObjPost = {
                    "norec": dataItem.norec_jadwal
                }
                medifirstService.post('laboratorium/update-jadwal-operasi', dataObjPost).then(function (e) {
                    var x = e
                    init();
                })
            }

            function hapusJadwal(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var dataObjPost = {
                    "norec": dataItem.norec
                }
                medifirstService.post('laboratorium/hapus-jadwal-operasi', dataObjPost).then(function (e) {
                    var x = e
                    init();
                })
            }
            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienLaboratoriumCtrl', chacePeriode);
            }

            $scope.editOrder = function () {
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }

                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.objectkelasfk,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.objectruanganfk,
                    11: $scope.dataSelected.norec_pd,
                    12: $scope.dataSelected.norec_so,
                    13: $scope.dataSelected.kelompokpasien
                }
                cacheHelper.set('editOrderCache', arrStr);
                $state.go('TransaksiPelayananLabRad')
            }

            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "30px",
            },

            {
                "field": "noorder",
                "title": "No Order",
                "width": "120px",
            },
            {
                "field": "tglorder",
                "title": "Tgl Order",
                "width": "120px",
                "template": "<span class='style-center'>{{formatTanggal('#: tglorder #')}}</span>"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px",
            },
            {
                "field": "nocm",
                "title": "No MR",
                "width": "70px",
            },
            {
                "field": "namapasien",
                "title": "Nama Pasien",
                "width": "150px",
            },
            {
                "field": "namaruangan",
                "title": "Ruangan Order",
                "width": "130px",
            },
            {
                "field": "ruangantujuan",
                "title": "Ruangan Tujuan",
                "width": "130px",
            },
            {
                "field": "dpjp",
                "title": "Dokter Pengirim",
                "width": "100px"
            },
            {
                "field": "pegawaiorder",
                "title": "Pengorder",
                "width": "100px"
            },
            {
                "field": "tglpelayananakhir",
                "title": "Tgl Operasi",
                "width": "100px",
                "template": "<span class='style-center'>{{formatTanggal('#: tglpelayananakhir #')}}</span>"
            }
            ];
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [{
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "50px",
                        "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "150px",

                    },
                    {
                        "field": "qtyproduk",
                        "title": "Jumlah",
                        "width": "50px",

                    }

                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn ' // + bln + ' bln'
            }


            $scope.LihatHasil = function (data) {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if (loginRadiologi == true) {
                    if ($scope.dataRisOrder != undefined) {
                        $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.dataRisOrder.patient_id +
                            '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                    } else {
                        toastr.info('Hasil Radiologi belum ada')
                    }
                } else {
                    if ($scope.norec_apd != undefined) {
                        var arrStr = {
                            0: $scope.dataSelected.nocm,
                            1: $scope.dataSelected.namapasien,
                            2: $scope.dataSelected.jeniskelamin,
                            3: $scope.dataSelected.noregistrasi,
                            4: $scope.dataSelected.umur,
                            5: $scope.dataSelected.kelompokpasien,
                            6: $scope.dataSelected.tglregistrasi,
                            7: $scope.norec_apd,
                            8: $scope.dataSelected.norec_pd,
                            9: $scope.dataSelected.objectkelasfk,
                            10: $scope.dataSelected.namakelas,
                            11: $scope.dataSelected.objectruanganfk,
                            12: $scope.dataSelected.namaruangan
                        }
                        cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                        $state.go('HasilLaboratorium', {
                            norecPd: $scope.dataSelected.norec_pd,
                            noOrder: $scope.dataSelected.noorder,
                            norecApd: $scope.norec_apd
                        })
                    } else {
                        toastr.info('Hasil Lab belum ada')
                    }

                }

            }

            $scope.verifikasi = function () {
                // isCheckAll = false
                $scope.item1.poli = '';
                $scope.item.dokterVerif = '';
                $scope.item.dokterOperasi = '';
                $scope.item1.jenistindakan = '';


                $scope.btnSimpanVis = false
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }
                $scope.item.noOrder = $scope.dataSelected.noorder;
                $scope.item.noMr = $scope.dataSelected.nocm;
                $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                noregistrasi = $scope.dataSelected.noregistrasi;
                objectruanganfk = $scope.dataSelected.objectruanganfk;
                namaRuangan = $scope.dataSelected.namaruangan;
                kelompokpasien = $scope.dataSelected.kelompokpasien;
                // jenisPelayananOk =$scope.item1.jenistindakan;
                $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                $scope.item.tglOperasi = $scope.dataSelected.tglpelayananakhir;
                $scope.popUpVerif.center().open();
                loadDataVerif();

            }
            $scope.unverifikasi = function () {

                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                noregistrasi = $scope.dataSelected.noregistrasi;
                norec_so = $scope.dataSelected.norec_so,
                    medifirstService.post('laboratorium/unverif-jadwal-operasi?noregistrasi=' + noregistrasi + '&norec_so=' + norec_so).then(function (e) {
                        var x = e
                        init();
                    })
            }

            function loadDataVerif() {
                tempnorecjkn = '';
                medifirstService.get("radiologi/get-order-pelayanan?norec_so=" + $scope.dataSelected.norec_so +
                    "&objectkelasfk=" + $scope.dataSelected.objectkelasfk, true).then(function (dat) {

                        var dataSource = dat.data.data;
                        // norec_pp = dat.data.dat[0].norec_pp;
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].statCheckbox = false;
                            dataSource[i].no = i + 1
                        }

                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: dataSource,
                            pageSize: 10,
                            total: dataSource.length,
                            serverPaging: false,

                        });

                    });
            }

            function loadDataVerifmjkn() {
                // isCheckAll = false
                $scope.item1.poli = '';
                $scope.item.dokterVerif = '';
                $scope.item.dokterOperasi = '';
                $scope.item1.jenistindakan = '';


                $scope.btnSimpanVis = false
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }
                $scope.item.noOrder = $scope.dataSelected.noorder;
                $scope.item.noMr = $scope.dataSelected.nocm;
                $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                noregistrasi = $scope.dataSelected.noregistrasi;
                objectruanganfk = $scope.dataSelected.objectruanganfk;
                namaRuangan = $scope.dataSelected.namaruangan;
                kelompokpasien = $scope.dataSelected.kelompokpasien;
                // jenisPelayananOk =$scope.item1.jenistindakan;
                $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                $scope.item.tglOperasi = $scope.dataSelected.tglpelayananakhir;
                $scope.item1.keteranganverif = $scope.dataSelected.keteranganverif;


                // medifirstService.get("radiologi/get-order-pelayanan?norec_so=" + $scope.dataSelected.norec_so +
                //     "&objectkelasfk=" + $scope.dataSelected.objectkelasfk, true).then(function(dat) {
                medifirstService.get("laboratorium/get-all-permintaan-operasi-jkn3detail?norec=" + $scope.dataSelected.norec_jadwal).then(function (data) {
                    var data = data.data.response.list[0];
                    $scope.item1.poli = { kdpoli: data.kodepoli, nmpoli: data.namapoli };
                    $scope.item.dokterOperasi = { id: data.dokteroperatorfk, namalengkap: data.namadokter };
                    $scope.item.dokterVerif = { id: data.dokteranestesi, namalengkap: data.namadokteranestesi };
                    $scope.item1.jenistindakan = data.jenistindakan;
                    $scope.item.jam = moment(data.jam).format('HH:mm');
                    $scope.item1.ok = data.ok;
                    $scope.item1.petugasok = data.petugasok;
                    $scope.item.tglmulai = moment(data.mulaiop).format('YYYY-MM-DD HH:mm');
                    $scope.item.tglselesai = moment(data.selesaiop).format('YYYY-MM-DD HH:mm');
                    tempnorecjkn = data.norec;


                    // norec_pp = dat.data.dat[0].norec_pp;

                });
            }
            $scope.columnVerif = [{
                "field": "no",
                "title": "No",
                "width": "30px",
            },
            {
                "field": "tglpelayanan",
                "title": "Tgl Pelayanan",
                "width": "90px",
            },
            // {
            //     "field": "namaproduk",
            //     "title": "Layanan",
            //     "width": "160px",
            // },
            // {
            //     "field": "qtyproduk",
            //     "title": "Jumlah",
            //     "width": "40px",
            // },
            {
                "field": "ruangantujuan",
                "title": "Ruangan Tujuan",
                "width": "140px"
            },
            {
                "field": "keterangandetail",
                "title": "Tindakan",
                "width": "140px"
            },
            {
                "field": "keterangantindakan",
                "title": "Keterangan",
                "width": "140px"
            },


            ];

            $scope.selectRow = function (dataItem) {

                var dataSelect = _.find($scope.sourceVerif._data, function (data) {
                    return data.prid == dataItem.prid;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                } else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.sourceVerif._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceVerif._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: false,

                });
                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
            }
            $scope.lihatdetail = function () {
                $scope.popUpVerif.center().open();
                loadDataVerif()
                loadDataVerifmjkn()

            }
            $scope.simpanVerifikasi = function () {
                debugger
                if ($scope.item.dokterVerif == undefined) {
                    toastr.error('Dokter Verifikasi harus di isi')
                    return
                }
                if ($scope.item1.poli.kdpoli == undefined) {
                    toastr.error('Poli  harus di isi')
                    return
                }
                var dataPost = [];
                for (var i = 0; i < $scope.sourceVerif._data.length; i++) {
                    // if($scope.sourceVerif._data[i].statCheckbox){
                    var datasys = {
                        "produkid": $scope.sourceVerif._data[i].prid,
                        "hargasatuan": $scope.sourceVerif._data[i].hargasatuan,
                        "qtyproduk": $scope.sourceVerif._data[i].qtyproduk,
                        "komponenharga": $scope.sourceVerif._data[i].details,
                    }
                    dataPost.push(datasys)
                    // }
                }

                if ($scope.sourceVerif._data[0].norec_pp != null) {
                    norec_pp = $scope.sourceVerif._data[0].norec_pp
                }
                // if (dataPost[0].hargasatuan == null) {

                //     alert("KLIK DULU TINDAKAN DI DALAM GRID  COY!!!!")
                //     return;

                // }

                // var itemsave = {
                //     "bridging": dataPost,
                //     "norec_pp": norec_pp,
                //     "noorder": $scope.item.noOrder,
                //     "norec_so": $scope.dataSelected.norec_so,
                //     "objectkelasfk": $scope.dataSelected.objectkelasfk,
                //     "norec_pd": $scope.dataSelected.norec_pd,
                //     "objectruangantujuanfk": $scope.dataSelected.objectruangantujuanfk,
                //     "objectpegawaiorderfk": $scope.dataSelected.objectpegawaiorderfk,
                //     "iddokterverif": $scope.item.dokterVerif.id,
                //     "namadokterverif": $scope.item.dokterVerif.namalengkap,
                //     "iddokterorder": $scope.item.dokterOrder.id,
                //     "namadokterorder": $scope.item.dokterOrder.namalengkap,
                //     "tgloperasi": moment($scope.item.tglOperasi).format('YYYY-MM-DD HH:mm'),
                //     "pegawaifk": $scope.item.dokterOperasi.id
                // }

                if (dataPost.length > 0) {
                    $scope.btnSimpanVis = true;
                    var departemen = $scope.sourceVerif._data[0].objectdepartemenfk;
                    if (departemen == 3) { /*lab */
                        // manageServicePhp.saveBridingSysmex(itemsave)
                        //     .then(function (e) {
                        //     });                       
                    } else if (departemen == 27) {
                        // manageServicePhp.saveBrigdingZeta(itemsave)
                        //     .then(function (e) {
                        //     });
                    }
                    // $scope.item.noOrder = $scope.dataSelected.noorder;
                    // $scope.item.noMr = $scope.dataSelected.nocm;
                    // $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                    noregistrasi = $scope.dataSelected.noregistrasi;

                    // $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                    // $scope.item.tglOperasi = $scope.dataSelected.tglpelayananakhir;
                    debugger;
                    kelompokpasien = $scope.dataSelected.kelompokpasien;
                    var dataObjPost = {};
                    dataObjPost = {
                        norec_pp: norec_pp,
                        norec_so: $scope.dataSelected.norec_so,
                        norecjkn: tempnorecjkn,
                        nocm: $scope.item.noMr,
                        namaPeserta: $scope.item.namaPasiens,
                        kelompokpasien: kelompokpasien,
                        noregistrasi: noregistrasi,
                        tanggaloperasi: moment($scope.item.tglOperasi).format('YYYY-MM-DD HH:mm:ss'),
                        jenistindakan: jenisPelayananOk,
                        kdpoli: $scope.item1.poli.kdpoli,
                        nmpoli: $scope.item1.poli.nmpoli,
                        jam: moment($scope.item.jam).format('HH:mm:ss'),
                        ok: $scope.item1.ok,
                        petugasok: $scope.item1.petugasok,
                        dokteroperatorfk: $scope.item.dokterOperasi.id,
                        dokteranestesi: $scope.item.dokterVerif.id,
                        keteranganverif: $scope.item1.keteranganverif,
                        tglmulai: moment($scope.item.tglmulai).format('YYYY-MM-DD HH:mm:ss'),
                        tglselesai: moment($scope.item.tglselesai).format('YYYY-MM-DD HH:mm:ss'),
                    }
                    // medifirstService.post('radiologi/save-pelayanan-pasien',itemsave)
                    // .then(function (e) {
                    medifirstService.post('laboratorium/save-jadwal-operasi-gabung', dataObjPost).then(function (e) {
                        var x = e
                        $scope.popUpVerif.close();
                        $scope.btnSimpanVis = false;
                        init();
                        // })
                    });



                    //     .then(function (e) {
                    //         $scope.btnSimpanVis = false;
                    //         $scope.popUpVerif.close();
                    //         init()

                    //     });
                } else {
                    toastr.error('Belum ada data yang dipilih');
                }
            }

            $scope.hapusTindakan = function () {
                if ($scope.dataSelectedVerif == undefined) {
                    toastr.error('Pilih data dahulu!');
                    return;
                }

                var objDelete = {
                    "norec_op": $scope.dataSelectedVerif.norec_op,
                    "norec_so": $scope.dataSelected.norec_so,
                };

                medifirstService.post('bedah/delete-verif-bedah', objDelete).then(function (e) {
                    $scope.popUpVerif.close();
                    init()
                });

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

            $scope.cetakBuktiLayanan = function () {
                if ($scope.dataSelected != undefined && $scope.norec_apd != null) {
                    if ($scope.dataSelected.status != 'Sudah Verifikasi') {
                        toastr.error('Pilih pasien yang sudah di verifikasi')
                        return
                    }
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient()
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' +
                        $scope.dataSelected.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&strIdRuangan=' +
                        $scope.dataSelected.objectruanganfk + '&view=' + stt,
                        function (response) { });

                }
            }

            //********************************  $scope.cekBelumVerifs=true;***

        }
    ]);
});