define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSensusCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, dateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad();
            $scope.jumlahpasienkemarin = 0;
            $scope.jumlahpasienmasuk = 0;
            $scope.jumlahpasienaskes = 0;
            $scope.jmlpasienmeninggal = 0;
            $scope.jmlpasiendipindahkan = 0;
            $scope.jmlpasienpindah = 0;
            $scope.jmlPasienKeluar = 0;
            var data2 = [];
            $scope.model = {};

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganinap;
                    $scope.listKelas = dat.data.kelas;
                    $scope.listJenisKelompokPasien = dat.data.jeniskelompokpasien;
                    $scope.listTipePasien = dat.data.kelompokpasien;
                    $scope.listZona = dat.data.zona;
                    $scope.listRekananPasien = dat.data.rekanan2;

                });
            }

            function FormLoad() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.$watch('item.ruangan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.ruangan != undefined) {
                        var nmR = "";
                        var nmK = "";
                        if ($scope.item.ruangan != undefined) {
                            nmR = 'namaruangan=' + $scope.item.ruangan.namaruangan;
                        }

                        if ($scope.item.kelas != undefined) {
                            nmK = '&idkelas=' + $scope.item.kelas.id;
                        }

                        medifirstService.get("sysadmin/general/view-bed?" + nmR + nmK).then(function (data) {
                            var no = 0;
                            var data = data.data
                            for (var i = 0; i < data.length; i++) {
                                no = no + 1;
                                data[i].no = no;
                            }
                            var arrRuang = [];
                            var arrKamar = [];
                            var arrTT = [];
                            var arr = [];
                            var arrayS = {};
                            var arrayK = {};
                            var arrayM = {};
                            var stt = true;
                            for (var i = 0; i < data.length; i++) {
                                arrayM = {
                                    idtempattidur: data[i].idtempattidur,
                                    idruangan: data[i].idruangan,
                                    namaruangan: data[i].namaruangan,
                                    idkamar: data[i].idkamar,
                                    namakamar: data[i].namakamar,
                                    reportdisplay: data[i].reportdisplay,
                                    nomorbed: data[i].nomorbed,
                                    idstatusbed: data[i].idstatusbed,
                                    statusbed: data[i].statusbed
                                };
                                arrTT.push(arrayM)
                            }
                            for (var i = 0; i < data.length; i++) {
                                //kamar
                                stt = true;
                                for (var j = 0; j < arrKamar.length; j++) {
                                    if (data[i].idkamar == arrKamar[j].idkamar) {
                                        arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
                                        if (data[i].idstatusbed == 1) {
                                            arrKamar[j].isi = arrKamar[j].isi + 1;
                                        } else {
                                            arrKamar[j].kosong = arrKamar[j].kosong + 1;
                                        }
                                        stt = false;
                                    }
                                }
                                if (stt == true) {
                                    var arrTTT = [];
                                    for (var j = 0; j < arrTT.length; j++) {
                                        if (arrTT[j].idkamar == data[i].idkamar) {
                                            arrTTT.push(arrTT[j]);
                                        }
                                    }

                                    if (data[i].idstatusbed == 1) {
                                        arrayK = {
                                            idruangan: data[i].idruangan,
                                            idkamar: data[i].idkamar,
                                            namakamar: data[i].namakamar,
                                            idkelas: data[i].idkelas,
                                            namakelas: data[i].namakelas,
                                            qtyBed: 1,
                                            isi: 1,
                                            kosong: 0,
                                            tempattidur: arrTTT
                                        };
                                    } else {
                                        arrayK = {
                                            idruangan: data[i].idruangan,
                                            idkamar: data[i].idkamar,
                                            namakamar: data[i].namakamar,
                                            idkelas: data[i].idkelas,
                                            namakelas: data[i].namakelas,
                                            qtyBed: 1,
                                            isi: 0,
                                            kosong: 1,
                                            tempattidur: arrTTT
                                        };
                                    }
                                    arrKamar.push(arrayK);
                                }


                            }
                            for (var i = 0; i < data.length; i++) {
                                //ruang
                                stt = true;
                                for (var j = 0; j < arrRuang.length; j++) {
                                    if (data[i].idruangan == arrRuang[j].idruangan) {
                                        arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
                                        if (data[i].idstatusbed == 1) {
                                            arrRuang[j].isi = arrRuang[j].isi + 1;
                                        } else {
                                            arrRuang[j].kosong = arrRuang[j].kosong + 1;
                                        }
                                        stt = false;
                                    }
                                }
                                if (stt == true) {
                                    var arrTTT = [];
                                    for (var j = 0; j < arrKamar.length; j++) {
                                        if (arrKamar[j].idruangan == data[i].idruangan) {
                                            arrTTT.push(arrKamar[j]);
                                        }
                                    }
                                    if (data[i].idstatusbed == 1) {
                                        arrayS = {
                                            idruangan: data[i].idruangan,
                                            namaruangan: data[i].namaruangan,
                                            qtyBed: 1,
                                            isi: 1,
                                            kosong: 0,
                                            kamar: arrTTT
                                        };
                                    } else {
                                        arrayS = {
                                            idruangan: data[i].idruangan,
                                            namaruangan: data[i].namaruangan,
                                            qtyBed: 1,
                                            isi: 0,
                                            kosong: 1,
                                            kamar: arrTTT
                                        };
                                    }

                                    arrRuang.push(arrayS);
                                }

                            }
                            $scope.isRouteLoading = false;
                            $scope.dataSource2 = arrRuang;
                            console.log(arrRuang)

                            var ttlKamarIsi = 0
                            var ttlKamarKosong = 0
                            var ttlKamarProsesAdmin = 0
                            var ttlKamarTotal = 0
                            for (var i = arrRuang.length - 1; i >= 0; i--) {
                                var element = arrRuang[i]
                                ttlKamarIsi = ttlKamarIsi + element.isi
                                ttlKamarKosong = ttlKamarKosong + element.kosong
                                ttlKamarTotal = ttlKamarTotal + element.qtyBed

                            }
                            $scope.item.ttlTempatTidur = ttlKamarTotal;
                            $scope.item.ttlTmpatTidurIsi = ttlKamarIsi;
                            $scope.item.ttlTmpatTidurKosong = ttlKamarKosong;

                        });
                    }
                }
            });

            $scope.SearchData = function () {
                $scope.isRouteLoading = true;
                data2 = []
                getLaporanPasienMasuk();
                getLaporanPasienMasukri();
                getLaporanPasienKeluar();
                getLaporanPasienDipindahan();
                getLaporanPasienPindahan();
                getLaporanPasienMeninggal();
                getLaporanPasienMeninggalDOA();
                getLaporanInformasiPasienRuangan();
                getLaporanPasienMasihDirawat();
                getLaporanPasienPernahDirawat();
                $scope.isRouteLoading = false;
            }

            $scope.ClearData = function () {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.ruangan = undefined
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            function getLaporanPasienMasuk() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tglAkhirKemarin = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
                var tempRuanganId = "";
                var rekan = "";
                var tipe = "";
                if ($scope.item.rekananpasien != undefined) {
                    rekan = "&rekanan=" + $scope.item.rekananpasien.id;
                }
                if ($scope.item.tipepasien != undefined) {
                    tipe = "&tipe=" + $scope.item.tipepasien.id;
                }

                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }
                var isNotSensus = ""
                if ($scope.model.cekpilihManual == true) {
                    isNotSensus = "&isNotSensus=" + true
                } else {
                    isNotSensus = ""
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-masuk-ranap?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK + rekan + tipe + isNotSensus).then(function (data) {
                        debugger
                        var datas = data.data.data
                        var data = data.data.data
                        var sensusasli = []
                        var sensusasli2 = []
                        sensusasli.push(data[0])
                        debugger
                        for (var a = 0; a < data.length; a++) {
                            var sama = false
                            var noregistrasi = data[a].noregistrasi
                            var noregistrasireal = sensusasli[sensusasli.length - 1].noregistrasi

                            if (noregistrasi == noregistrasireal) {
                                sama = true
                            }
                            if (sama == false) {
                                sensusasli.push(data[a])
                            }
                        }
                        for (var i = 0; i < sensusasli.length; i++) {
                            var umur = dateHelper.CountAge(new Date(sensusasli[i].tgllahir), $scope.now);
                            sensusasli[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr';
                        }

                        for (var i = 0; i < sensusasli.length; i++) {
                            for (var a = 0; a < data.length; a++) {
                                if (sensusasli[i].noregistrasi == data[a].noregistrasi) {
                                    if (data[a].namadiagnosa != '-') {
                                        sensusasli[i].namadiagnosa = data[a].namadiagnosa;
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < sensusasli.length; i++) {
                            sensusasli[i].no = i + 1;
                        }

                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: sensusasli,
                            group: $scope.group,
                            pageSize: 50,
                            total: sensusasli.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }


            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienmasuk.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Masuk Rawat Inap",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "umur",
                        title: "Umur",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namarekanan",
                        title: "Nama Rekanan",
                        width: "105px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },


                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "ruanganasal",
                        title: "Ruangan Asal",
                        width: "105px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    },
                    {
                        field: "issensus",
                        title: "Sensus",
                        width: "75px",
                    },
                    {
                        field: "userdaftar",
                        title: "User Daftar",
                        width: "105px",
                    }
                ]
            }

            function getLaporanPasienMasukri() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tglAkhirKemarin = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
                var tempRuanganId = "";
                var rekan = "";
                var tipe = "";
                if ($scope.item.rekananpasien != undefined) {
                    rekan = "&rekanan=" + $scope.item.rekananpasien.id;
                }
                if ($scope.item.tipepasien != undefined) {
                    tipe = "&tipe=" + $scope.item.tipepasien.id;
                }

                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }
                var isNotSensus = ""
                if ($scope.model.cekpilihManual == true) {
                    isNotSensus = "&isNotSensus=" + true
                } else {
                    isNotSensus = ""
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-masuk-ranapri?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK + rekan + tipe + isNotSensus).then(function (data) {
                        debugger
                        var data = data.data.data
                        for (var i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }

                        $scope.sourceLaporanri = new kendo.data.DataSource({
                            data: data,
                            group: $scope.group,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }
            $scope.columnLaporanpri = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienmasuk.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Rawat Inap",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "namarekanan",
                        title: "Nama Rekanan",
                        width: "105px",
                    },

                    {
                        field: "ruanganasal",
                        title: "Ruangan Asal",
                        width: "105px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    }
                ]
            }

            function getLaporanPasienKeluar() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }
                var rekan = "";
                var tipe = "";
                if ($scope.item.rekananpasien != undefined) {
                    rekan = "&rekanan=" + $scope.item.rekananpasien.id;
                }
                if ($scope.item.tipepasien != undefined) {
                    tipe = "&tipe=" + $scope.item.tipepasien.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-data-pasien-keluar-ruangan-ranap?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK + tipe + rekan).then(function (data) {
                        var datas = data.data.data;
                        var datax = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;
                        datax[0].jumlahhariperawatan = 0
                        datax[0].lamarawat = 0
                        datax[0].dilamarawat = 0
                        var pp = 0;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            // var lR = dateHelper.CountAge(new Date(datas[i].tglmasuk), new Date(datas[i].tglkeluar));
                            // var lD = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                            // var lR = dateHelper.CountAge(new Date(moment(datas[i].tglmasuk).format('YYYY-MM-DD')), new Date(moment(datas[i].tglkeluar).format('YYYY-MM-DD')));
                            var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));
                            var lD = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));
                            var bulaanmasuk = new Date(moment(datas[i].tglregistrasi).format('MM'));
                            var bulaanpulang = new Date(moment(datas[i].tglpulang).format('MM'));

                            bulaanmasuk = bulaanmasuk.getMonth();
                            bulaanpulang = bulaanpulang.getMonth();
                            if (bulaanmasuk == bulaanpulang) {
                                var hariperawatan = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD')));
                                if (hariperawatan.day == 0) {
                                    datas[i].hariperawatan = 1 + ' hr ';
                                    datas[i].hariperawatanx = 1;
                                } else {
                                    datas[i].hariperawatan = hariperawatan.day + ' hr ';
                                    datas[i].hariperawatanx = hariperawatan.day;
                                }
                            } else {
                                var date = new Date(moment(datas[i].tglpulang).format('YYYY-MM-DD'))
                                // alert('the original date is ' + date);
                                var newdate = new Date(date);

                                newdate.setDate(newdate.getDate() + 1); // minus the date


                                var hariperawatan = dateHelper.CountAge(new Date(moment(datas[i].tglpulang).format('YYYY-MM-01')), newdate);
                                if (hariperawatan.day == 0) {
                                    datas[i].hariperawatan = 1 + ' hr ';
                                    datas[i].hariperawatanx = 1;
                                } else {
                                    datas[i].hariperawatan = hariperawatan.day + ' hr ';
                                    datas[i].hariperawatanx = hariperawatan.day;
                                }
                            }
                            if (lR.month == 0) {
                                if (lR.day == 0) {
                                    datas[i].lamarawat = '1 hr';
                                    datas[i].lamarawatx = 1;
                                } else {
                                    datas[i].lamarawat = lR.day + ' hr ';
                                    datas[i].lamarawatx = lR.day;

                                }
                            } else {
                                if (lR.day == 0) {
                                    datas[i].lamarawat = (lR.month * 30) + ' hr';
                                    datas[i].lamarawatx = (lR.month * 30);

                                } else {
                                    datas[i].lamarawat = (lR.month * 30) + lR.day + ' hr ';
                                    datas[i].lamarawatx = (lR.month * 30) + lR.day;

                                }
                            }


                            if (lD.month == 0) {
                                if (lD.day == 0) {
                                    datas[i].haridirawat = '1 hr';
                                    datas[i].haridirawatx = 1;
                                } else {
                                    datas[i].haridirawat = lD.day + 1 + ' hr ';
                                    datas[i].haridirawatx = lD.day + 1;

                                }
                            } else {
                                if (lD.day == 0) {
                                    datas[i].haridirawat = (lD.month * 30) + 1 + ' hr';
                                    datas[i].haridirawatx = (lD.month * 30) + 1;
                                } else {
                                    datas[i].haridirawat = (lD.month * 30) + lD.day + 1 + ' hr ';
                                    datas[i].haridirawatx = (lD.month * 30) + lD.day + 1;
                                }
                            }
                            pp = pp + parseInt(datas[i].lamarawatx)
                            // datax[0].lamarawat = datax[0].lamarawat + datas[i].lamarawatx;
                            // datax[0].dilamarawat = datax[0].dilamarawat + datas[i].haridirawatx;
                            // datax[0].jumlahhariperawatan = datax[0].jumlahhariperawatan + datas[i].hariperawatanx;
                        }

                        $scope.sourceLaporanPK = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                            aggregate: [
                                { field: 'haridirawatx', aggregate: 'sum' },
                                { field: 'lamarawatx', aggregate: 'sum' },
                                { field: 'hariperawatanx', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,

                        });
                    })
            }

            $scope.columnLaporanPK = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienkeluar.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Keluar Ruangan",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglkeluar",
                        title: "Tgl Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "statuskeluar",
                        title: "Cara Keluar",
                        width: "120px",
                    },

                    // {
                    //     field: "hariperawatan",
                    //     title: "Hari Perawatan",
                    //     width: "75px",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#:data.hariperawatanx.sum# hr"
                    // },
                    // {
                    //     field: "haridirawat",
                    //     title: "HD",
                    //     width: "75px",
                    //     aggregates: ["sum"],
                    //     // footerTemplate: "#:data.haridirawatx.sum# hr"
                    // },
                    {
                        field: "lamarawat",
                        title: "LD",
                        width: "75px",
                        aggregates: ["sum"],
                        footerTemplate: "#:data.lamarawatx.sum# hr"
                    },
                    // {
                    //     field: "haridirawat",
                    //     title: "HP",
                    //     width: "75px",
                    // },
                    {
                        field: "namarekanan",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienPindahan() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-pindahan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglpulang != undefined) {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                                datas[i].lamarawat = lR.day + ' hr ';
                            } else {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                        }
                        $scope.sourceLaporanP = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanP = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienpindahan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pindahan",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "ruangansblm",
                        title: "Dari Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienDipindahan() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-dipindahan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglpulang != undefined) {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                                datas[i].lamarawat = lR.day + ' hr ';
                            } else {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                        }
                        $scope.sourceLaporanDP = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanDP = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasiendipindahkan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pindahan",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "ruanganskrng",
                        title: "Ke Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienMeninggal() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-meninggal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK).then(function (data) {
                        debugger
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;


                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            // var lR = dateHelper.CountAge(new Date(datas[i].tglmasuk), new Date(datas[i].tglkeluar));
                            // var lD = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                            var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglmeninggal).format('YYYY-MM-DD')));
                            var lD = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglmeninggal).format('YYYY-MM-DD')));


                            if (lR.month == 0) {
                                if (lR.day == 0) {
                                    datas[i].lamarawat = '1 hr';
                                } else {
                                    datas[i].lamarawat = lR.day + ' hr ';
                                }
                            } else {
                                if (lR.day == 0) {
                                    datas[i].lamarawat = (lR.month * 30) + ' hr';
                                } else {
                                    datas[i].lamarawat = (lR.month * 30) + lR.day + ' hr ';
                                }
                            }


                            if (lD.month == 0) {
                                if (lD.day == 0) {
                                    datas[i].haridirawat = '1 hr';
                                } else {
                                    datas[i].haridirawat = lD.day + 1 + ' hr ';
                                }
                            } else {
                                if (lD.day == 0) {
                                    datas[i].haridirawat = (lD.month * 30) + 1 + ' hr';
                                } else {
                                    datas[i].haridirawat = (lD.month * 30) + lD.day + 1 + ' hr ';
                                }
                            }

                        }

                        // for (var i = 0; i < datas.length; i++) {
                        //     datas[i].no = i + 1;
                        //     if (datas[i].tglmeninggal != undefined) {
                        //         var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglmeninggal).format('YYYY-MM-DD')));
                        //         datas[i].lamarawat = lR.day+1 + ' hr ';
                        //     } else {
                        //         // var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                        //         var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment($scope.now).format('YYYY-MM-DD')));
                        //         datas[i].lamarawat = lR.day+1 + ' hr ';
                        //     }
                        // }

                        $scope.sourceLaporanPM = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanPM = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienMeninggal.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Meninggal Diruangan",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglmeninggal",
                        title: "Tgl Keluar Meninggal  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "kesatuanpasien",
                        title: "Kesatuan Pasien",
                        width: "105px",
                    },
                    {
                        field: "statuskeluar",
                        title: "Cara Keluar",
                        width: "120px",
                    },
                    {
                        field: "haridirawat",
                        title: "HD",
                        width: "75px",
                    },
                    // {
                    //     field: "lamarawat",
                    //     title: "LD",
                    //     width: "75px",
                    // },
                    // {
                    //     field: "smf",
                    //     title: "HR",
                    //     width: "75px",
                    // },
                    {
                        field: "penyebabkematian",
                        title: "Penyebab Kematian",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namarekanan",
                        title: "Rekanan",
                        width: "125px",
                    },
                    // {
                    //     field: "namakelas",
                    //     title: "Kelas Rawat",
                    //     width: "105px",
                    // },
                    // {
                    //     field: "smf",
                    //     title: "SMF",
                    //     width: "75px",
                    // }
                ]
            }

            function getLaporanPasienMeninggalDOA() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-meninggal-doa?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglmeninggal != undefined) {
                                var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment(datas[i].tglmeninggal).format('YYYY-MM-DD')));
                                datas[i].lamarawat = lR.day + 1 + ' hr ';
                            } else {
                                // var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                var lR = dateHelper.CountAge(new Date(moment(datas[i].tglregistrasi).format('YYYY-MM-DD')), new Date(moment($scope.now).format('YYYY-MM-DD')));
                                datas[i].lamarawat = lR.day + 1 + ' hr ';
                            }
                        }
                        $scope.sourceLaporanPDOA = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }
            $scope.columnLaporanPDOA = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienMeninggalD.O.A.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Meninggal D.O.A",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglmeninggal",
                        title: "Tgl Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "statuskeluar",
                        title: "Cara Keluar",
                        width: "120px",
                    },
                    {
                        field: "lamarawat",
                        title: "LD",
                        width: "75px",
                    },
                    // {
                    //     field: "smf",
                    //     title: "HR",
                    //     width: "75px",
                    // },
                    {
                        field: "penyebabkematian",
                        title: "Penyebab Kematian",
                        width: "105px",
                    },
                    // {
                    //     field: "namadiagnosa",
                    //     title: "Diagnosa",
                    //     width: "120px",
                    // },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namarekanan",
                        title: "Rekanan",
                        width: "125px",
                    },
                    // {
                    //     field: "namakelas",
                    //     title: "Kelas Rawat",
                    //     width: "105px",
                    // },
                    // {
                    //     field: "smf",
                    //     title: "SMF",
                    //     width: "75px",
                    // }
                ]
            }

            function getLaporanPasienMasihDirawat() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }
                var jkp = "";
                if ($scope.item.jeniskelompokpasien != undefined) {
                    jkp = '&jeniskelompokId=' + $scope.item.jeniskelompokpasien.id;
                }
                var rekanan = "";
                if ($scope.item.rekananpasien != undefined) {
                    rekanan = '&rekananId=' + $scope.item.rekananpasien.id;
                }
                var zona = "";
                if ($scope.item.zona != undefined) {
                    if ($scope.item.zona.zona == "Hijau") {
                        zona = '&zona=' + 222
                    }
                    if ($scope.item.zona.zona == "Merah") {
                        zona = '&zona=' + 19
                    }
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("rawatinap/get-daftar-pasien-masih-dirawat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK + jkp + zona + rekanan).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        $scope.sourceLaporanMD = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }
            $scope.columnLaporanMD = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienMasihDirawat.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Masih Dirawat",
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

                    // { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Nama Penjamin",
                        width: "105px",
                    },
                    {
                        field: "namarekanan",
                        title: "Nama Rekanan",
                        width: "105px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    },
                    {
                        field: "namapangkat",
                        title: "Pangkat",
                        width: "105px",
                    }
                ]
            }

            function getLaporanPasienPernahDirawat() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("rawatinap/get-sensus-pasien-masih-dirawat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId + nmK).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        $scope.sourceLaporanPD = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }
            $scope.columnLaporanPD = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienPernahDirawat.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Masih Dirawat",
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

                    // { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Nama Penjamin",
                        width: "105px",
                    },
                    {
                        field: "namarekanan",
                        title: "Nama Rekanan",
                        width: "105px",
                    },
                    {
                        field: "jeniskelompokpasien",
                        title: "Jenis Kelompok",
                        width: "105px",
                    }
                ]
            }


            function getLaporanInformasiPasienRuangan() {
                var data3 = [];
                if ($scope.item.tglawal instanceof Date) {
                    var d = $scope.item.tglawal
                } else {
                    var d = new Date($scope.item.tglawal)
                }

                // var kamari =new Date(d.setDate(d.getDate() - 1));
                var kamari = new Date(d.setDate(d.getDate()));
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tglAkhirKemarin = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-pasien-informasi-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&tglAkhirKemarin=" + tglAkhirKemarin +
                    "&kamari=" + moment(kamari).format('YYYY-MM-DD') +
                    tempRuanganId + nmK).then(function (data) {
                        var data = data.data
                        // var datamasuk = data.datamasuk;
                        // var dataKemarin = data.datakemarin;
                        // var dataAkses = data.dataaskes;
                        // var datakeluar = data.datakeluar;
                        // var datadipindahkan = data.datadipindahkan;
                        // var datapindahan = data.datapindah;
                        // var dataminggal = data.datameninggal;

                        // var jmlkemarin = 0;
                        // var jmlmasuk = 0;
                        // var jmlkeluar = 0;
                        // var jmlpindah = 0;
                        // var jmldipindah = 0;
                        // var jmlmeninggal = 0;
                        // var jmlsisa = 0;
                        // var jmlakses = 0;

                        // for (var i = 0; i < datamasuk.length; i++) {
                        //     jmlmasuk = i + 1;
                        // }

                        // for (var i = 0; i < dataKemarin.length; i++) {
                        //     jmlkemarin = i + 1;
                        // }

                        // for (var i = 0; i < dataAkses.length; i++) {
                        //     jmlakses = i + 1;
                        // }

                        // for (var i = 0; i < datakeluar.length; i++) {
                        //     jmlkeluar = i + 1;
                        // }

                        // for (var i = 0; i < datapindahan.length; i++) {
                        //     jmlpindah = i + 1;
                        // }

                        // for (var i = 0; i < datadipindahkan.length; i++) {
                        //     jmldipindah = i + 1;
                        // }

                        // for (var i = 0; i < dataminggal.length; i++) {
                        //     jmlmeninggal = i + 1;
                        // }

                        // jmlsisa = (jmlmasuk + jmlkemarin + jmlpindah) - (jmldipindah + jmlmeninggal + jmlkeluar);

                        var datau = {
                            pasienkemarin: data.datakemarin,
                            pasienmasuk: data.datamasuk,
                            pasienkeluar: data.pulang,
                            pasiendipindahkan: data.datadipindahkan,
                            pasienpindah: data.datapindahan,

                            pasienmeninggal: data.datameninggal,
                            pasienakses: data.dataaskes,
                            pasiensisa: data.datahariini
                        }

                        data3.push(datau);

                        for (var i = data3.length - 1; i >= 0; i--) {
                            data3[i].no = i + 1
                        }

                        $scope.sourceLaporanIn = new kendo.data.DataSource({
                            data: data3,
                            pageSize: 50,
                            total: data3.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanIn = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanPasienRuangan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pasien Ruangan",
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
                        field: "no",
                        title: "No",
                        width: "45px"
                    },
                    {
                        field: "pasienkemarin",
                        title: "Jml Pasien Kemarin",
                        width: "90px",
                    },
                    {
                        field: "pasienmasuk",
                        title: "Jml Pasien Masuk",
                        width: "90px",
                    },
                    {
                        field: "pasienkeluar",
                        title: "Jml Pasien Keluar",
                        width: "90px",
                    },
                    {
                        field: "pasiendipindahkan",
                        title: "Jml Pasien Dipindahkan",
                        width: "90px",
                    },
                    {
                        field: "pasienmeninggal",
                        title: "Jml Pasien Meninggal",
                        width: "90px",
                    },
                    {
                        field: "pasiensisa",
                        title: "Jml Pasien Sisa Hari Ini",
                        width: "90px",
                    },
                    {
                        field: "pasienakses",
                        title: "Jml Pasien Askes",
                        width: "90px",
                    },
                    {
                        field: "pasienpindah",
                        title: "Jml Pasien Pindahan",
                        width: "90px",
                    }
                ]
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});