define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('DaftarAntrianSusterRajalCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        // function(saveToWindow, $rootScope, $scope, ModelItem, $state, findPasien, dateHelper, socket, managePasien, $mdDialog, window, cetakHelper, manageSarprasPhp, cacheHelper, $q) {            
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.ruanganMulti = []
            $scope.item.isTelemedicine = false;
            $scope.konsul = {}
            // $scope.dataPasienSelected = {};
            // $scope.item.periodeAwal =  new Date();
            var tglRegistrasi
            $scope.item.kondisi = '';
            $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
            $scope.item.periodeAkhir = new Date();
            $scope.item.tglKeluar = $scope.now;
            $scope.item.tglRencanaKeluar = $scope.now;
            $scope.item.tglMeninggal = $scope.now;
            $scope.istempatLaporan = true;
            $scope.item.tglRujuk = $scope.now;
            $scope.item.tglPulang = $scope.now;
            $scope.item.noSPRI = null;
            $scope.item.norecSPRI = '';
            $scope.item.noSuratKontrol = null;
            $scope.item.norecRencanaKontrol = '';
            $scope.item.tanggalRencakaKontrol = $scope.now;
            $scope.dataPasienSelected = {};
            $scope.isRouteLoading = false;
            // Konfigurasi Kendo Grid untuk Riwayat TTV Pasien Pulang
            $scope.ttvGridOptions = {
                pageable: {
                    pageSize: 5,
                    messages: {
                        display: "{0} - {1} dari {2} data",
                        empty: "Tidak ada data TTV"
                    }
                },
                scrollable: false,
                columns: [
                    { field: "tgl", title: "Waktu / Tgl EMR", width: "160px" },
                    { field: "tekanandarah", title: "TD (mmHg)", width: "100px", attributes: { style: "text-align: center" } },
                    { field: "nadi", title: "Nadi (x/m)", width: "90px", attributes: { style: "text-align: center" } },
                    { field: "pernapasan", title: "Napas (x/m)", width: "95px", attributes: { style: "text-align: center" } },
                    { field: "suhu", title: "Suhu (°C)", width: "85px", attributes: { style: "text-align: center" } },
                    { field: "spo2", title: "SpO2 (%)", width: "85px", attributes: { style: "text-align: center" } },
                    { field: "kesadaran", title: "Kesadaran", width: "130px" }
                ]
            };
            function getRiwayatTtvPulang(noRegistrasi) {
                $scope.sourceTtv = new kendo.data.DataSource({ data: [] });
                if (!noRegistrasi) return;

                medifirstService.get('emr/get-vital-sign-2?noRegistrasi=' + noRegistrasi).then(function (res) {
                    var dataArray = [];
                    if (res && res.data) {
                        dataArray = Array.isArray(res.data) ? res.data : (res.data.data ? res.data.data : []);
                    }
                    console.log('Data TTV Noreg ' + noRegistrasi + ':', dataArray);

                    if (dataArray && dataArray.length > 0) {
                        var grouped = {};
                        for (var i = 0; i < dataArray.length; i++) {
                            var item = dataArray[i];
                            var waktu = item.tgl ? item.tgl : '-';
                            if (!grouped[waktu]) {
                                grouped[waktu] = {
                                    tgl: waktu,
                                    tekanandarah: '-',
                                    nadi: '-',
                                    pernapasan: '-',
                                    suhu: '-',
                                    spo2: '-',
                                    kesadaran: '-'
                                };
                            }
                            if (item.tekanandarah) grouped[waktu].tekanandarah = item.tekanandarah;
                            if (item.nadi) grouped[waktu].nadi = item.nadi;
                            if (item.pernapasan) grouped[waktu].pernapasan = item.pernapasan;
                            if (item.suhu) grouped[waktu].suhu = item.suhu;
                            if (item.spo2) grouped[waktu].spo2 = item.spo2;
                            if (item.kesadaran) {
                                grouped[waktu].kesadaran = item.kesadaran.indexOf('~') !== -1 ? item.kesadaran.split('~')[1] : item.kesadaran;
                            }
                        }

                        var listData = [];
                        for (var key in grouped) {
                            listData.push(grouped[key]);
                        }

                        $scope.sourceTtv = new kendo.data.DataSource({
                            data: listData,
                            pageSize: 5
                        });
                    }
                }, function (error) {
                    console.error('Gagal memuat data TTV:', error);
                });
            }
            $rootScope.isOpen = true;
            $scope.cboUbahDokter = true;
            $scope.norecPDbuttonSelected = "";
            $scope.norecAPDbuttonSelected = "";
            // $scope.savebebasnarkoba = false;
            $scope.isSelesaiPeriksa = false;
            $scope.savebebasnarkoba2 = false;
            $scope.isPulangKontrol = false;
            // $scope.cetakbebasnarkoba = false
            // $scope.title = "ini page pencarian pasien";
            // $scope.kodeRuangan = $state.params.kodeRuangan;
            // $scope.isCalling = false;
            $scope.listStatus = [
                { id: 1, status: 'Di Panggil Perawat' },
                { id: 2, status: 'Di Panggil Dokter' },
                // {id: 3, status: 'Selesai Periksa Dokter'},
            ]
            $scope.pegawai = ModelItem.getPegawai();
            $scope.popUpSurat = {};
            $scope.item.rows = 50
            $scope.userID = {};
            $scope.item.kp = 1
            loadCombo()
            dataKonsul2();
            $scope.cekTelemedicine = function (bool) {
                if (bool) {
                    $scope.item.isTelemedicine = true
                    loadData($scope.item.kondisi)
                } else {
                    $scope.item.isTelemedicine = false
                    loadData($scope.item.kondisi)
                }
            }

            // loadData($scope.item.kondisi)
            loadKonsul()
            // postRensarWTRJ();
            function postRensarWTRJ() {
                medifirstService.post('rensar/post-waktu-tunggu-rj')
                    .then(function (res) { })
            }
            // loadData($scope.item.kondisi)
            $scope.SearchEnter = function () {
                loadData($scope.item.kondisi)
            }

            function loadCombo() {
                // debugger
                var chacePeriode = cacheHelper.get('DaftarAntrianDokterRajalCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    $scope.myVar = chacePeriode[5];
                    // var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);
                    if (chacePeriode[2] != null && chacePeriode[3] != null)
                        $scope.item.ruangan = { id: chacePeriode[2], namaruangan: chacePeriode[3] }
                    if (chacePeriode[4].length > 0) {
                        $scope.item.ruanganMulti = chacePeriode[4]
                    }
                    // $scope.item.tglpulang = new Date(arrPeriode[2]);                
                } else {
                    $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    // $scope.item.tglpulang = $scope.now;                 
                }

                medifirstService.get("rawatjalan/get-data-konsul-combo", false).then(function (data) {
                    var datas = []
                    if (data.data.dataRuangan.length == 0) {
                        for (let i = 0; i < data.data.ruanganRajal.length; i++) {
                            const element = data.data.ruanganRajal[i];
                            datas.push({ id: element.id, namaruangan: element.namaruangan })
                        }
                    } else {
                        for (let i = 0; i < data.data.dataRuangan.length; i++) {
                            const element = data.data.dataRuangan[i];
                            datas.push({ id: element.id, namaruangan: element.namaruangan })
                        }
                        // $scope.item.ruangan = { id: datas[0].id, namaruangan: datas[0].namaruangan }
                        $scope.item.ruanganMulti = datas
                        // dimatikan jadi pake mappingan
                        // if (datas.length == 1) {
                        //     $scope.item.ruanganMulti = [{ id: datas[0].id, namaruangan: datas[0].namaruangan }]
                        // }
                    }


                    $scope.listRuangan = datas;
                    $scope.listKelas = data.data.kelas;
                    $scope.selectOptionsRuangan = {
                        placeholder: "Pilih Ruangan...",
                        dataTextField: "namaruangan",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,

                    };

                    loadData('data')
                });

                // medifirstService.get("tatarekening/get-data-master-select?JenisPetugasPelaksana=1&Pegawai=1").then(function (e) {
                //     $scope.listJenisPetugas = e.data.JenisPetugasPelaksana;
                //     $scope.listPetugas = e.data.Pegawai;
                //     // $scope.listRuangan = e.data.Ruangan;
                // });

                $q.all([
                    medifirstService.getServiceArray("tatarekening/get-detail_apd?noregistrasi=" + $scope.item.noRegistrasi),
                    medifirstService.getServiceArray("tatarekening/get-combo-detail-regis-select?dokter=1&ruangan=1&dataRuanganKonsul=1&kelas=1&statuspulang=1&pembatalan=1")
                ])
                    .then(function (data) {
                        // if (data[0].statResponse) {
                        //     $scope.item = data[0][0];
                        //     $scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
                        //     $scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
                        //     $scope.item.Noverifikasi = $scope.item.strukfk;

                        // }
                        if (data[1].statResponse) {
                            $scope.listDokter = data[1].dokter;
                            $scope.listRuanganDokter = data[1].ruangan;
                            $scope.listRuanganKonsul = data[1].dataRuanganKonsul;
                            // $scope.listRekanan = data[1].rekanan;
                            // $scope.listKelompokPasien = data[1].kelompokpasien;
                            $scope.listKelas = data[1].kelas
                            $scope.liststatuspulang = data[1].statuspulang
                            $scope.listPembatalan = data[1].pembatalan
                        }
                        $scope.isRouteLoading = false;
                    });

                // medifirstService.get("rawatjalan/get-data-combo-operator", false).then(function(data) {
                //     $scope.listDokter = data.data.dokter;
                //     $scope.username=data.data.pegawaiLogin;
                //     $scope.userID=data.data.datalogin.userData.id;
                // });
            }
            $scope.lanjutBatal = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?" +
                    norReg
                ).then(function (data) {
                    var datas = data.data
                    if (datas.length > 0)
                        window.messageContainer.error('Pasien sudah Mendapatkan Pelayanan');
                    else {
                        $scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
                        $scope.item.tglbatal = $scope.now;
                        medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-bataludahkso?" +
                            norReg
                        ).then(function (data) {
                            var datasx = data.data
                            if (datasx.length > 0)
                                window.messageContainer.error('Pasien sudah Verif KSO TIDAK BISA DIBATALAKAN');
                            else {
                                var BatalPeriksa = {
                                    "norec": $scope.dataPasienSelected.norec_pd,
                                    "tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD hh:mm:ss'),
                                    "pembatalanfk": $scope.item.pembatalan.id,
                                    "alasanpembatalan": $scope.item.alasanBatal != undefined ? $scope.item.alasanBatal : '',

                                }
                                medifirstService.post('registrasi/daftar-registrasi/save-batal-registrasi', BatalPeriksa).then(function (e) {
                                    loadData($scope.item.kondisi);
                                    $scope.item.pembatalan = "";
                                    $scope.item.alasanBatal = "";
                                    $scope.item.ruanganBatal = "";

                                })
                            }
                        })

                    }

                });
                $scope.winDialog.close();
            }
            $scope.simpanKonsul = function () {
                debugger;
                if ($scope.konsul.ruangan === undefined || $scope.konsul.ruangan === '' || $scope.konsul.ruangan === null) {
                    window.messageContainer.error("Ruangan Belum Di Pilih")
                    return
                }

                if ($scope.konsul.namaDokter === undefined || $scope.konsul.namaDokter === '') {
                    window.messageContainer.error("Dokter Tujuan Harus Diisi");
                    return;
                }

                if ($scope.konsul.kelas === undefined || $scope.konsul.kelas === '' || $scope.konsul.kelas === null) {
                    window.messageContainer.error("Kelas Belum Di Pilih")
                    return
                }

                if ($scope.konsul.ruangan.id === '44' || $scope.konsul.ruangan.id === '20') {
                    $scope.konsul.kelas.id = $scope.dataPasienSelected.idkelas;
                }
                var current = $scope.dataPasienSelected;
                var length = 0
                var dataKonsul = {
                    "asalrujukanfk": current.objectasalrujukanfk,
                    "kelasfk": $scope.konsul.kelas.id,
                    "noantrian": length,
                    "norec_pd": current.norec_pd,
                    "dokterfk": $scope.konsul.namaDokter.id,
                    "objectruangantujuanfk": $scope.konsul.ruangan.id,
                    "objectruanganasalfk": current.objectruanganfk
                }
                medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
                    // LoadData();
                    // $scope.saveLogKonsul();
                    debugger;
                    var dokterId = "";
                    if ($scope.konsul.namaDokter.id == undefined || $scope.item.dokter == "") {
                        dokterId = null;
                    } else
                        dokterId = $scope.konsul.namaDokter.id;
                    var json = {
                        'noregistrasi': current.noregistrasi,
                        'jenispasien': current.objectkelompokpasienfk,
                        'idruangan': $scope.konsul.ruangan.id,
                        'norec_apd': e.data.data.norec,
                        'idpegawai': dokterId,
                        'keteranganlain': 'Karcis Otomatis Daftar antrian suster rajal'
                    }
                    medifirstService.post('registrasi/save-biaya-konsul', json).then(function (x) {
                        // 
                    });
                    $scope.now = new Date();
                    var data = {
                        "norec_kdr": '',
                        "objectruangantujuanfk": $scope.konsul.ruangan.id,
                        "objectruanganasalfk": $scope.dataPasienSelected.objectruanganfk,
                        "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                        "objectstatuskendalidokumenfk": 2,
                        "nocmfk": $scope.dataPasienSelected.nocmfk,
                        "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                        "catatan": "",
                        "noregistrasifk": e.data.data.norec
                        //"tglkembali": tglkembali
                    };
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function (e) {
                        $scope.batalKonsul();
                    });
                })
            }

            $scope.BatalPeriksa = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?" +
                    norReg
                ).then(function (data) {
                    var datas = data.data
                    if (datas.length > 0)
                        window.messageContainer.error('Pasien sudah Mendapatkan Pelayanan');
                    else {
                        $scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
                        $scope.item.tglbatal = $scope.now;
                        $scope.winDialog.center().open();
                    }
                });
            }

            $scope.SaveKasus = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = $scope.dataPasienSelected.noregistrasi;
                }
                var json = {
                    'noregistrasi': norReg,
                    'kasuspenyakit': $scope.item.kp
                }
                medifirstService.post('registrasi/save-kasus-penyakit', json).then(function (x) {
                    $scope.popUpKasusPenyakit.close();
                    loadData($scope.item.kondisi);
                });
            }

            $scope.batalKonsul = function () {
                $scope.popUpSx.close();
            }

            $scope.asd = function (kondisi) {
                loadData(kondisi)
            }


            function loadData(kondisi) {
                // $scope.isRouteLoading = true;
                // kondisi
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var nocm = ""
                if ($scope.item.noCm != undefined) {
                    var nocm = "&norm=" + $scope.item.noCm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&nama=" + $scope.item.namaPasien
                }
                var noRegistrasi = ""
                if ($scope.item.noRegistrasi != undefined) {
                    var noRegistrasi = "&noreg=" + $scope.item.noRegistrasi
                }
                var dokId = ""
                if ($scope.pegawai.id != undefined) {
                    var dokId = "&dokId=" + $scope.pegawai.id
                }
                var ruangId = ""
                if ($scope.item.ruangan != undefined) {
                    var ruangId = "&ruangId=" + $scope.item.ruangan.id
                }
                var listRuangan = ""

                if ($scope.item.ruanganMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.ruanganMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.ruanganMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listRuangan = a.slice(1, a.length)
                }

                var statusPeriksa = ""
                if ($scope.item.Status != undefined) {
                    var statusPeriksa = "&statusPeriksa=" + $scope.item.Status.id
                }

                var jmlRow = ""
                if ($scope.item.rows != undefined) {
                    jmlRow = "&jmlRow=" + $scope.item.rows
                }

                $scope.isRouteLoading = true;
                if (kondisi == 'data') {
                    $scope.item.kondisi = kondisi
                    datas(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, $scope.item.isTelemedicine, ruangId, statusPeriksa, jmlRow)
                }
                else if (kondisi == 'tindak') {
                    $scope.item.kondisi = kondisi
                    dataTindak(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, $scope.item.isTelemedicine, ruangId, statusPeriksa, jmlRow)
                }
                else if (kondisi == 'konsul') {
                    $scope.item.kondisi = kondisi
                    dataKonsul(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, $scope.item.isTelemedicine, ruangId, statusPeriksa, jmlRow)
                }
                else if (kondisi == 'dikonsul') {
                    $scope.item.kondisi = kondisi
                    datadiKonsul(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, $scope.item.isTelemedicine, ruangId, statusPeriksa, jmlRow)
                }
                else if (kondisi == 'dokumen') {
                    $scope.item.kondisi = kondisi
                    dataDokumen(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, $scope.item.isTelemedicine, ruangId, statusPeriksa, jmlRow)
                }


                // $q.all([
                //     medifirstService.get("rawatjalan/get-daftar-antrian-rajal?" +
                //         "&tglAwal=" + tglAwal +
                //         "&tglAkhir=" + tglAkhir +
                //         "&norm=" + nocm +
                //         "&noreg=" + noRegistrasi +
                //         "&nama=" + nama +
                //         "&ruanganArr=" + listRuangan +
                //         "&istelemedicine=" + $scope.item.isTelemedicine +
                //         ruangId + statusPeriksa +
                //         jmlRow),
                // ]).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     // debugger;
                //     var datas = data[0].data.data;
                //     var datasTindak = data[0].data.dataTindak;
                //     var datasKonsul = data[0].data.dataKonsul;
                //     var datasDiKonsul = data[0].data.dataDiKonsul;
                //     var datasDokumen = data[0].data.dataDokumen;
                //     for (var i = 0; i < datas.length; i++) {
                //         datas[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datas[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datas[i].stts = '-'
                //         datas[i].isonline = '-'
                //         if (datas[i].noreservasi != undefined) {
                //             if (datas[i].istelemedicine == '1') {
                //                 datas[i].isonline = datas[i].notelepon
                //                 datas[i].kelompokpasien = 'Telemedicine'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             } else {
                //                 datas[i].isonline = 'Online'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             }
                //         }
                //         if (datas[i].tgldipanggilsuster != undefined) {
                //             datas[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datas[i].tgldipanggildokter != undefined) {
                //             datas[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                //             datas[i].statlayanan = "✔"
                //         } else {
                //             datas[i].statlayanan = ""
                //         }
                //         //tgldipanggildokter
                //         //tgldipanggilsuster
                //     }
                //     // grid Tindak
                //     for (var i = 0; i < datasTindak.length; i++) {
                //         datasTindak[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datasTindak[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datasTindak[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datasTindak[i].stts = '-'
                //         datasTindak[i].isonline = '-'
                //         if (datasTindak[i].noreservasi != undefined) {
                //             if (datasTindak[i].istelemedicine == '1') {
                //                 datasTindak[i].isonline = datasTindak[i].notelepon
                //                 datasTindak[i].kelompokpasien = 'Telemedicine'
                //                 datasTindak[i].tglregistrasi = datasTindak[i].tanggalreservasi
                //             } else {
                //                 datasTindak[i].isonline = 'Online'
                //                 datasTindak[i].tglregistrasi = datasTindak[i].tanggalreservasi
                //             }
                //         }
                //         if (datasTindak[i].tgldipanggilsuster != undefined) {
                //             datasTindak[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datasTindak[i].tgldipanggildokter != undefined) {
                //             datasTindak[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datasTindak[i].statuslayanan == 'true' || datasTindak[i].statuslayanan == true) {
                //             datasTindak[i].statlayanan = "✔"
                //         } else {
                //             datasTindak[i].statlayanan = ""
                //         }
                //     }
                //     // grid konsul
                //     for (var i = 0; i < datasKonsul.length; i++) {
                //         datasKonsul[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datasKonsul[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datasKonsul[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datasKonsul[i].stts = '-'
                //         datasKonsul[i].isonline = '-'
                //         if (datasKonsul[i].noreservasi != undefined) {
                //             if (datasKonsul[i].istelemedicine == '1') {
                //                 datasKonsul[i].isonline = datasKonsul[i].notelepon
                //                 datasKonsul[i].kelompokpasien = 'Telemedicine'
                //                 datasKonsul[i].tglregistrasi = datasKonsul[i].tanggalreservasi
                //             } else {
                //                 datasKonsul[i].isonline = 'Online'
                //                 datasKonsul[i].tglregistrasi = datasKonsul[i].tanggalreservasi
                //             }
                //         }
                //         if (datasKonsul[i].tgldipanggilsuster != undefined) {
                //             datasKonsul[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datasKonsul[i].tgldipanggildokter != undefined) {
                //             datasKonsul[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datasKonsul[i].statuslayanan == 'true' || datasKonsul[i].statuslayanan == true) {
                //             datasKonsul[i].statlayanan = "✔"
                //         } else {
                //             datasKonsul[i].statlayanan = ""
                //         }
                //     }
                //     // grid di konsul
                //     for (var i = 0; i < datasDiKonsul.length; i++) {
                //         datasDiKonsul[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datasDiKonsul[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datasDiKonsul[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datasDiKonsul[i].stts = '-'
                //         datasDiKonsul[i].isonline = '-'
                //         if (datasDiKonsul[i].noreservasi != undefined) {
                //             if (datasDiKonsul[i].istelemedicine == '1') {
                //                 datasDiKonsul[i].isonline = datasDiKonsul[i].notelepon
                //                 datasDiKonsul[i].kelompokpasien = 'Telemedicine'
                //                 datasDiKonsul[i].tglregistrasi = datasDiKonsul[i].tanggalreservasi
                //             } else {
                //                 datasDiKonsul[i].isonline = 'Online'
                //                 datasDiKonsul[i].tglregistrasi = datasDiKonsul[i].tanggalreservasi
                //             }
                //         }
                //         if (datasDiKonsul[i].tgldipanggilsuster != undefined) {
                //             datasDiKonsul[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datasDiKonsul[i].tgldipanggildokter != undefined) {
                //             datasDiKonsul[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datasDiKonsul[i].statuslayanan == 'true' || datasDiKonsul[i].statuslayanan == true) {
                //             datasDiKonsul[i].statlayanan = "✔"
                //         } else {
                //             datasDiKonsul[i].statlayanan = ""
                //         }
                //     }
                //     // grid dokumen
                //     for (var i = 0; i < datasDokumen.length; i++) {
                //         datasDokumen[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datasDokumen[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datasDokumen[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datasDokumen[i].stts = '-'
                //         datasDokumen[i].isonline = '-'
                //         if (datasDokumen[i].noreservasi != undefined) {
                //             if (datasDokumen[i].istelemedicine == '1') {
                //                 datasDokumen[i].isonline = datasDokumen[i].notelepon
                //                 datasDokumen[i].kelompokpasien = 'Telemedicine'
                //                 datasDokumen[i].tglregistrasi = datasDokumen[i].tanggalreservasi
                //             } else {
                //                 datasDokumen[i].isonline = 'Online'
                //                 datasDokumen[i].tglregistrasi = datasDokumen[i].tanggalreservasi
                //             }
                //         }
                //         if (datasDokumen[i].tgldipanggilsuster != undefined) {
                //             datasDokumen[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datasDokumen[i].tgldipanggildokter != undefined) {
                //             datasDokumen[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datasDokumen[i].statuslayanan == 'true' || datasDokumen[i].statuslayanan == true) {
                //             datasDokumen[i].statlayanan = "✔"
                //         } else {
                //             datasDokumen[i].statlayanan = ""
                //         }
                //     }
                //     $scope.GridPasien = new kendo.data.DataSource({
                //         data: datas,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {}
                //             }
                //         }
                //     });
                //     $scope.GridPasienTindak = new kendo.data.DataSource({
                //         data: datasTindak,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {}
                //             }
                //         }
                //     });
                //     $scope.GridPasienKonsul = new kendo.data.DataSource({
                //         data: datasKonsul,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {}
                //             }
                //         }
                //     });
                //     $scope.GridPasienDiKonsul = new kendo.data.DataSource({
                //         data: datasDiKonsul,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {}
                //             }
                //         }
                //     });
                //     $scope.GridPasienDokumen = new kendo.data.DataSource({
                //         data: datasDokumen,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {}
                //             }
                //         }
                //     });
                //     var chacePeriode = {
                //         0: tglAwal,
                //         1: tglAkhir,
                //         2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                //         3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                //         4: $scope.item.ruanganMulti,
                //         5: $scope.myVar
                //     }
                //     // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                //     cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                // });

                // $q.all([
                //     medifirstService.get("rawatjalan/get-daftar-antrian-rajal-tindak?" +
                //         "&tglAwal=" + tglAwal +
                //         "&tglAkhir=" + tglAkhir +
                //         "&norm=" + nocm +
                //         "&noreg=" + noRegistrasi +
                //         "&nama=" + nama +
                //         "&ruanganArr=" + listRuangan
                //         + "&istelemedicine=" + $scope.item.isTelemedicine
                //         + ruangId + statusPeriksa
                //         + jmlRow),
                // ]).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     var datas = data[0].data;
                //     for (var i = 0; i < datas.length; i++) {
                //         datas[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datas[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datas[i].stts = '-'
                //         datas[i].isonline = '-'
                //         if (datas[i].noreservasi != undefined) {
                //             if (datas[i].istelemedicine == '1') {
                //                 datas[i].isonline = datas[i].notelepon
                //                 datas[i].kelompokpasien = 'Telemedicine'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             } else {
                //                 datas[i].isonline = 'Online'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             }
                //         }
                //         if (datas[i].tgldipanggilsuster != undefined) {
                //             datas[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datas[i].tgldipanggildokter != undefined) {
                //             datas[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                //             datas[i].statlayanan = "✔"
                //         } else {
                //             datas[i].statlayanan = ""
                //         }
                //         //tgldipanggildokter
                //         //tgldipanggilsuster
                //     }
                //     $scope.GridPasienTindak = new kendo.data.DataSource({
                //         data: datas,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {
                //                 }
                //             }
                //         }
                //     });
                //     var chacePeriode = {
                //         0: tglAwal,
                //         1: tglAkhir,
                //         2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                //         3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                //         4: $scope.item.ruanganMulti,
                //     }
                //     // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                //     cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                // });

                // $q.all([
                //     medifirstService.get("rawatjalan/get-daftar-antrian-rajal-konsul?" +
                //         "&tglAwal=" + tglAwal +
                //         "&tglAkhir=" + tglAkhir +
                //         "&norm=" + nocm +
                //         "&noreg=" + noRegistrasi +
                //         "&nama=" + nama +
                //         "&ruanganArr=" + listRuangan
                //         + "&istelemedicine=" + $scope.item.isTelemedicine
                //         + ruangId + statusPeriksa
                //         + jmlRow),
                // ]).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     var datas = data[0].data;
                //     for (var i = 0; i < datas.length; i++) {
                //         datas[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datas[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datas[i].stts = '-'
                //         datas[i].isonline = '-'
                //         if (datas[i].noreservasi != undefined) {
                //             if (datas[i].istelemedicine == '1') {
                //                 datas[i].isonline = datas[i].notelepon
                //                 datas[i].kelompokpasien = 'Telemedicine'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             } else {
                //                 datas[i].isonline = 'Online'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             }
                //         }
                //         if (datas[i].tgldipanggilsuster != undefined) {
                //             datas[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datas[i].tgldipanggildokter != undefined) {
                //             datas[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                //             datas[i].statlayanan = "✔"
                //         } else {
                //             datas[i].statlayanan = ""
                //         }
                //         //tgldipanggildokter
                //         //tgldipanggilsuster
                //     }
                //     $scope.GridPasienKonsul = new kendo.data.DataSource({
                //         data: datas,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {
                //                 }
                //             }
                //         }
                //     });
                //     var chacePeriode = {
                //         0: tglAwal,
                //         1: tglAkhir,
                //         2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                //         3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                //         4: $scope.item.ruanganMulti,
                //     }
                //     // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                //     cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                // });

                // $q.all([
                //     medifirstService.get("rawatjalan/get-daftar-antrian-rajal-dikonsul?" +
                //         "&tglAwal=" + tglAwal +
                //         "&tglAkhir=" + tglAkhir +
                //         "&norm=" + nocm +
                //         "&noreg=" + noRegistrasi +
                //         "&nama=" + nama +
                //         "&ruanganArr=" + listRuangan
                //         + "&istelemedicine=" + $scope.item.isTelemedicine
                //         + ruangId + statusPeriksa
                //         + jmlRow),
                // ]).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     var datas = data[0].data;
                //     for (var i = 0; i < datas.length; i++) {
                //         datas[i].no = i + 1
                //         var tanggal = $scope.now;
                //         var tanggalLahir = new Date(datas[i].tgllahir);
                //         var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //         datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                //         datas[i].stts = '-'
                //         datas[i].isonline = '-'
                //         if (datas[i].noreservasi != undefined) {
                //             if (datas[i].istelemedicine == '1') {
                //                 datas[i].isonline = datas[i].notelepon
                //                 datas[i].kelompokpasien = 'Telemedicine'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             } else {
                //                 datas[i].isonline = 'Online'
                //                 datas[i].tglregistrasi = datas[i].tanggalreservasi
                //             }
                //         }
                //         if (datas[i].tgldipanggilsuster != undefined) {
                //             datas[i].stts = 'Di Panggil Perawat'
                //         }
                //         if (datas[i].tgldipanggildokter != undefined) {
                //             datas[i].stts = 'Di Panggil Dokter'
                //         }
                //         if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                //             datas[i].statlayanan = "✔"
                //         } else {
                //             datas[i].statlayanan = ""
                //         }
                //         //tgldipanggildokter
                //         //tgldipanggilsuster
                //     }
                //     $scope.GridPasienDiKonsul = new kendo.data.DataSource({
                //         data: datas,
                //         group: $scope.group,
                //         pageSize: 400,
                //         total: data.length,
                //         serverPaging: false,
                //         schema: {
                //             model: {
                //                 fields: {
                //                 }
                //             }
                //         }
                //     });
                //     var chacePeriode = {
                //         0: tglAwal,
                //         1: tglAkhir,
                //         2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                //         3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                //         4: $scope.item.ruanganMulti,
                //     }
                //     // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                //     cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                // });
            }

            function datas(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-datas?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datas = data[0].data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datas[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datas[i].stts = '-'
                        datas[i].isonline = '-'
                        if (datas[i].noreservasi != undefined) {
                            if (datas[i].istelemedicine == '1') {
                                datas[i].isonline = datas[i].notelepon
                                datas[i].kelompokpasien = 'Telemedicine'
                                datas[i].tglregistrasi = datas[i].tanggalreservasi
                            } else {
                                datas[i].isonline = 'Online'
                                datas[i].tglregistrasi = datas[i].tanggalreservasi
                            }
                        }
                        if (datas[i].tgldipanggilsuster != undefined) {
                            datas[i].stts = 'Di Panggil Perawat'
                        }
                        if (datas[i].tgldipanggildokter != undefined) {
                            datas[i].stts = 'Di Panggil Dokter'
                        }
                        if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                            datas[i].statlayanan = "✔"
                        } else {
                            datas[i].statlayanan = ""
                        }
                    }

                    $scope.GridPasien = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }
            function dataTindak(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-data-tindak?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datasTindak = data[0].data.dataTindak;// grid Tindak
                    for (var i = 0; i < datasTindak.length; i++) {
                        datasTindak[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datasTindak[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datasTindak[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datasTindak[i].stts = '-'
                        datasTindak[i].isonline = '-'
                        if (datasTindak[i].noreservasi != undefined) {
                            if (datasTindak[i].istelemedicine == '1') {
                                datasTindak[i].isonline = datasTindak[i].notelepon
                                datasTindak[i].kelompokpasien = 'Telemedicine'
                                datasTindak[i].tglregistrasi = datasTindak[i].tanggalreservasi
                            } else {
                                datasTindak[i].isonline = 'Online'
                                datasTindak[i].tglregistrasi = datasTindak[i].tanggalreservasi
                            }
                        }
                        if (datasTindak[i].tgldipanggilsuster != undefined) {
                            datasTindak[i].stts = 'Di Panggil Perawat'
                        }
                        if (datasTindak[i].tgldipanggildokter != undefined) {
                            datasTindak[i].stts = 'Di Panggil Dokter'
                        }
                        if (datasTindak[i].statuslayanan == 'true' || datasTindak[i].statuslayanan == true) {
                            datasTindak[i].statlayanan = "✔"
                        } else {
                            datasTindak[i].statlayanan = ""
                        }
                    }

                    $scope.GridPasienTindak = new kendo.data.DataSource({
                        data: datasTindak,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }
            function dataKonsul(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-data-konsul?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datasKonsul = data[0].data.dataKonsul;
                    for (var i = 0; i < datasKonsul.length; i++) {
                        datasKonsul[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datasKonsul[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datasKonsul[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datasKonsul[i].stts = '-'
                        datasKonsul[i].isonline = '-'
                        if (datasKonsul[i].noreservasi != undefined) {
                            if (datasKonsul[i].istelemedicine == '1') {
                                datasKonsul[i].isonline = datasKonsul[i].notelepon
                                datasKonsul[i].kelompokpasien = 'Telemedicine'
                                datasKonsul[i].tglregistrasi = datasKonsul[i].tanggalreservasi
                            } else {
                                datasKonsul[i].isonline = 'Online'
                                datasKonsul[i].tglregistrasi = datasKonsul[i].tanggalreservasi
                            }
                        }
                        if (datasKonsul[i].tgldipanggilsuster != undefined) {
                            datasKonsul[i].stts = 'Di Panggil Perawat'
                        }
                        if (datasKonsul[i].tgldipanggildokter != undefined) {
                            datasKonsul[i].stts = 'Di Panggil Dokter'
                        }
                        if (datasKonsul[i].statuslayanan == 'true' || datasKonsul[i].statuslayanan == true) {
                            datasKonsul[i].statlayanan = "✔"
                        } else {
                            datasKonsul[i].statlayanan = ""
                        }
                    }

                    $scope.GridPasienKonsul = new kendo.data.DataSource({
                        data: datasKonsul,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }
            function dataKonsul2() {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var nocm = ""
                if ($scope.item.noCm2 != undefined) {
                    var nocm = "&norm=" + $scope.item.noCm2
                }
                var nama = ""
                if ($scope.item.namaPasien2 != undefined) {
                    var nama = "&nama=" + $scope.item.namaPasien2
                }
                var noRegistrasi = ""
                if ($scope.item.noRegistrasi != undefined) {
                    var noRegistrasi = "&noreg=" + $scope.item.noRegistrasi
                }
                var dokId = ""
                if ($scope.pegawai.id != undefined) {
                    var dokId = "&dokId=" + $scope.pegawai.id
                }
                var ruangId = ""
                if ($scope.item.ruangan != undefined) {
                    var ruangId = "&ruangId=" + $scope.item.ruangan.id
                }
                var listRuangan = ""

                if ($scope.item.ruanganMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.ruanganMulti.length - 1; i >= 0; i--) {

                        var c = $scope.item.ruanganMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listRuangan = a.slice(1, a.length)
                }

                var statusPeriksa = ""
                if ($scope.item.Status != undefined) {
                    var statusPeriksa = "&statusPeriksa=" + $scope.item.Status.id
                }

                var jmlRow = ""
                if ($scope.item.rows != undefined) {
                    jmlRow = "&jmlRow=" + $scope.item.rows
                }
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-data-konsul?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datasKonsul2 = data[0].data.dataKonsul;
                    for (var i = 0; i < datasKonsul2.length; i++) {
                        datasKonsul2[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datasKonsul2[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datasKonsul2[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datasKonsul2[i].stts = '-'
                        datasKonsul2[i].isonline = '-'
                        if (datasKonsul2[i].noreservasi != undefined) {
                            if (datasKonsul2[i].istelemedicine == '1') {
                                datasKonsul2[i].isonline = datasKonsul2[i].notelepon
                                datasKonsul2[i].kelompokpasien = 'Telemedicine'
                                datasKonsul2[i].tglregistrasi = datasKonsul2[i].tanggalreservasi
                            } else {
                                datasKonsul2[i].isonline = 'Online'
                                datasKonsul2[i].tglregistrasi = datasKonsul2[i].tanggalreservasi
                            }
                        }
                        if (datasKonsul2[i].tgldipanggilsuster != undefined) {
                            datasKonsul2[i].stts = 'Di Panggil Perawat'
                        }
                        if (datasKonsul2[i].tgldipanggildokter != undefined) {
                            datasKonsul2[i].stts = 'Di Panggil Dokter'
                        }
                        if (datasKonsul2[i].statuslayanan == 'true' || datasKonsul2[i].statuslayanan == true) {
                            datasKonsul2[i].statlayanan = "✔"
                        } else {
                            datasKonsul2[i].statlayanan = ""
                        }
                         if (datasKonsul2[i].statuslayanan == 'true' || datasKonsul2[i].statuslayanan == true) {
                            datasKonsul2[i].statuslayanan = "Sudah di periksa"
                        } else {
                            datasKonsul2[i].statuslayanan = "Belum di periksa"
                        }
                    }
                    
                    $scope.GridPasienKonsul2 = new kendo.data.DataSource({
                        data: datasKonsul2,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    debugger;
                    if (datasKonsul2.length != 0) {
                    $scope.winKonsul.center().open()
                    }
                    

                });
            }
            
            function datas(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-datas?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datas = data[0].data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datas[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datas[i].stts = '-'
                        datas[i].isonline = '-'
                        if (datas[i].noreservasi != undefined) {
                            if (datas[i].istelemedicine == '1') {
                                datas[i].isonline = datas[i].notelepon
                                datas[i].kelompokpasien = 'Telemedicine'
                                datas[i].tglregistrasi = datas[i].tanggalreservasi
                            } else {
                                datas[i].isonline = 'Online'
                                datas[i].tglregistrasi = datas[i].tanggalreservasi
                            }
                        }
                        if (datas[i].tgldipanggilsuster != undefined) {
                            datas[i].stts = 'Di Panggil Perawat'
                        }
                        if (datas[i].tgldipanggildokter != undefined) {
                            datas[i].stts = 'Di Panggil Dokter'
                        }
                        if (datas[i].statuslayanan == 'true' || datas[i].statuslayanan == true) {
                            datas[i].statlayanan = "✔"
                        } else {
                            datas[i].statlayanan = ""
                        }
                    }
                    
                    $scope.GridPasien = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }
            function datadiKonsul(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-data-dikonsul?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datasDiKonsul = data[0].data.dataDiKonsul;
                    // grid di konsul
                    for (var i = 0; i < datasDiKonsul.length; i++) {
                        datasDiKonsul[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datasDiKonsul[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datasDiKonsul[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datasDiKonsul[i].stts = '-'
                        datasDiKonsul[i].isonline = '-'
                        if (datasDiKonsul[i].noreservasi != undefined) {
                            if (datasDiKonsul[i].istelemedicine == '1') {
                                datasDiKonsul[i].isonline = datasDiKonsul[i].notelepon
                                datasDiKonsul[i].kelompokpasien = 'Telemedicine'
                                datasDiKonsul[i].tglregistrasi = datasDiKonsul[i].tanggalreservasi
                            } else {
                                datasDiKonsul[i].isonline = 'Online'
                                datasDiKonsul[i].tglregistrasi = datasDiKonsul[i].tanggalreservasi
                            }
                        }
                        if (datasDiKonsul[i].tgldipanggilsuster != undefined) {
                            datasDiKonsul[i].stts = 'Di Panggil Perawat'
                        }
                        if (datasDiKonsul[i].tgldipanggildokter != undefined) {
                            datasDiKonsul[i].stts = 'Di Panggil Dokter'
                        }
                        if (datasDiKonsul[i].statuslayanan == 'true' || datasDiKonsul[i].statuslayanan == true) {
                            datasDiKonsul[i].statlayanan = "✔"
                        } else {
                            datasDiKonsul[i].statlayanan = ""
                        }
                    }

                    $scope.GridPasienDiKonsul = new kendo.data.DataSource({
                        data: datasDiKonsul,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }
            function dataDokumen(tglAwal, tglAkhir, nocm, noRegistrasi, nama, listRuangan, isTelemedicine, ruangId, statusPeriksa, jmlRow) {
                $q.all([
                    medifirstService.get("rawatjalan/get-daftar-antrian-rajal-data-dokumen?" +
                        "&tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        "&ruanganArr=" + listRuangan +
                        "&istelemedicine=" + isTelemedicine +
                        ruangId + statusPeriksa +
                        jmlRow),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // debugger;
                    var datasDokumen = data[0].data.dataDokumen;
                    // grid dokumen
                    for (var i = 0; i < datasDokumen.length; i++) {
                        datasDokumen[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datasDokumen[i].tgllahir);
                        var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                        datasDokumen[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datasDokumen[i].stts = '-'
                        datasDokumen[i].isonline = '-'
                        if (datasDokumen[i].noreservasi != undefined) {
                            if (datasDokumen[i].istelemedicine == '1') {
                                datasDokumen[i].isonline = datasDokumen[i].notelepon
                                datasDokumen[i].kelompokpasien = 'Telemedicine'
                                datasDokumen[i].tglregistrasi = datasDokumen[i].tanggalreservasi
                            } else {
                                datasDokumen[i].isonline = 'Online'
                                datasDokumen[i].tglregistrasi = datasDokumen[i].tanggalreservasi
                            }
                        }
                        if (datasDokumen[i].tgldipanggilsuster != undefined) {
                            datasDokumen[i].stts = 'Di Panggil Perawat'
                        }
                        if (datasDokumen[i].tgldipanggildokter != undefined) {
                            datasDokumen[i].stts = 'Di Panggil Dokter'
                        }
                        if (datasDokumen[i].statuslayanan == 'true' || datasDokumen[i].statuslayanan == true) {
                            datasDokumen[i].statlayanan = "✔"
                        } else {
                            datasDokumen[i].statlayanan = ""
                        }
                    }

                    $scope.GridPasienDokumen = new kendo.data.DataSource({
                        data: datasDokumen,
                        group: $scope.group,
                        pageSize: 400,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }

            $scope.klikGrid = function (dataPasienSelected) {
                // loadCombo();
                // $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                // $scope.item.periodeAkhir = $scope.now;
                if (dataPasienSelected != undefined) {
                    $scope.item.pilihDokter = { id: dataPasienSelected.objectpegawaifk, namalengkap: dataPasienSelected.namadokter }
                }
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [
                    // {
                    //     field: "pasien",
                    //     aggregate: "count"
                    // }, 
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    }
                ]
            };
            $scope.aggregate = [
                // {
                //     field: "pasien",
                //     aggregate: "count"
                // }, 
                {
                    field: "namaruangan",
                    aggregate: "count"
                }
            ]
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == '-') { $(this).addClass('red') }
                    if ($(this).text() == 'Di Panggil Perawat') { $(this).addClass('green') }
                    if ($(this).text() == 'Di Panggil Dokter') { $(this).addClass('blue') }
                    if ($(this).text() == 'Online') { $(this).addClass('koneng') }

                })
            }
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                {
                    "field": "no",
                    "field": "noantrianhafis",
                    "title": "No",
                    "width": "60px",
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                    "field": "namekendali",
                    "title": "Rekam Medis",
                    "width": "100px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },

                //  {
                //     "field": "namakelas",
                //     "title": "Kelas",
                //     "width": "80px"
                // },
                // {
                //     "field": "kelasdijamin",
                //     "title": "Kelas Ditanggung",
                //     "width": "80px"
                // },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px"
                },
                // {
                //     field: "statusAntrian",
                //     title: "Status",
                //     aggregates: ["count"]
                // }, 
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            }
            $scope.mainGridOptionsTindak = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienRawatJalanTindak.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Rawat Jalan Tindak",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                {
                    "field": "no",
                    "field": "noantrianhafis",
                    "title": "No",
                    "width": "60px",
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                    "field": "namekendali",
                    "title": "Rekam Medis",
                    "width": "100px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                    "field": "kasuspenyakit",
                    "title": "Status Covid-19",
                    "width": "80px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },

                //  {
                //     "field": "namakelas",
                //     "title": "Kelas",
                //     "width": "80px"
                // },
                // {
                //     "field": "kelasdijamin",
                //     "title": "Kelas Ditanggung",
                //     "width": "80px"
                // },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px",
                    // "template": '# if( diagnosa==false) {# - # } else {# #= diagnosa # #} #'
                },
                // {
                //     "field": "isdiagnosis",
                //     "title": "Diagnosa",
                //     "width": "80px"
                // },
                // {
                //     field: "statusAntrian",
                //     title: "Status",
                //     aggregates: ["count"]
                // }, 
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            }
            $scope.mainGridOptionsKonsul = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienKonsulRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Konsul Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                // {
                //     "field":"no",
                //     "field":"noantrian",
                //     "title":"No",
                //     "width":"40px",
                // },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                    "field": "namekendali",
                    "title": "Rekam Medis",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                    "field": "batalkonsul",
                    "title": "Batal Konsul",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setBatalKonsul(dataItem)\"  style=\"margin:0 0 5px\">#:  batalkonsul #</button> ",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px"
                },
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            }
            $scope.mainGridOptionsDiKonsul = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienDiKonsulRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Di Konsul Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                // {
                //     "field":"no",
                //     "field":"noantrian",
                //     "title":"No",
                //     "width":"40px",
                // },
                {
                    "field": "batalkonsul",
                    "title": "Batal Konsul",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setBatalKonsul(dataItem)\"  style=\"margin:0 0 5px\">#:  batalkonsul #</button> ",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px"
                },
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            }
            $scope.mainGridOptionsDokumen = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                {
                    "field": "no",
                    "field": "noantrianhafis",
                    "title": "No",
                    "width": "60px",
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                    "field": "namekendali",
                    "title": "Rekam Medis",
                    "width": "100px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                },
                {
                    "field": "kasuspenyakit",
                    "title": "Status Covid-19",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px",

                },
                // {
                //     field: "statusAntrian",
                //     title: "Status",
                //     aggregates: ["count"]
                // }, 
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            }
            // $scope.ColumnPasien = [
            //     {
            //         "field":"no",
            //         "title":"No",
            //         "width":"40px",
            //     },
            //     {
            //         "field":"tglregistrasi",
            //         "title":"Tgl Registrasi",
            //         "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
            //         "width":"80px"
            //     }, 
            //     {
            //         "field":"noregistrasi",
            //         "title":"No Registrasi",
            //         "width":"80px"
            //     },
            //     {
            //         "field":"nocm",
            //         "title":"No. Rekam Medis",
            //         "width":"80px"               
            //     },
            //     {
            //         "field":"namapasien",
            //         "title":"Nama Pasien",
            //         "width":"100px"
            //     }, 
            //     {
            //         "field":"umurzz",
            //         "title":"Umur",
            //         "width":"100px"      
            //     }, 
            //     {
            //         "field": "statuspasien",
            //         "title": "Status",
            //         "width": "80px"
            //     },
            //     {
            //         "field":"namadokter",
            //         "title":"Dokter",
            //         "width":"100px"     
            //     }, 
            //     {
            //         "field": "jeniskelamin",
            //         "title": "Jenis Kelamin",
            //         "width":"100px"
            //     },
            //     {
            //         "field": "kelompokpasien",
            //         "title": "Tipe Pembayaran",
            //         "width":"80px"
            //     }, 
            //     {
            //         "field": "namakelas",
            //         "title": "Kelas",
            //         "width": "80px"
            //     },
            //     {
            //         "field": "stts",
            //         "title": "Panggil",
            //         "width": "80px"
            //     },    
            //     // {
            //     //     field: "statusAntrian",
            //     //     title: "Status",
            //     //     aggregates: ["count"]
            //     // }, 
            //     {
            //         hidden: true,
            //         field: "namaruangan",
            //         title: "Nama Ruangan",
            //         aggregates: ["count"],
            //         groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
            //     }
            // ];

            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }


            $scope.checkDPJP = function () {
                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis="
                    + $scope.item.poliKontrol.kode).then(function (z) {
                        if (z.data.metaData.code == 200) {
                            $scope.listkodeDokter = z.data.response.list;
                        }
                        else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }

            $scope.setstatuspulang = function (dataPasienSelected) {

                // if (dataPasienSelected.statuspulang != "Belum Pulang") {
                //     toastr.error('Pasien Sudah Pulang', 'Info');
                //     return;
                // }
                // if (dataPasienSelected.isonline != "-") {
                // Panggil TTV Pulang
                if (dataPasienSelected && dataPasienSelected.noregistrasi) {
                    getRiwayatTtvPulang(dataPasienSelected.noregistrasi);
                }
                if (dataPasienSelected.statusschedule != "" && dataPasienSelected.objectruanganfk != "569") {
                    if (dataPasienSelected.istaskantrol == 3 || dataPasienSelected.istaskantrol == null) {
                        toastr.error('Pengiriman Task Id 5 Tidak Bisa Dilakukan, Task Id Saat ini adalah ' + dataPasienSelected.istaskantrol, 'Info')
                        return;
                    } else {
                        var a = new Date();
                        var x = Date.parse(a);
                        var data = {
                            kodebooking: dataPasienSelected.statusschedule,
                            taskid: 5,
                            waktu: x
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                            debugger
                            $scope.item.noSPRI = null;
                            $scope.item.noSuratKontrol = null;
                            debugger
                            $scope.dataPasienSelected = dataPasienSelected
                            $scope.pulang = null;
                            $scope.isPulangKontrol = false;
                            $scope.item.norec_pd = dataPasienSelected.norec_pd;
                            $scope.item.pasienSelected = dataPasienSelected;

                            medifirstService.get("rawatinap/get-nosep-by-norec-pd/" + dataPasienSelected.norec_pd).then(function (e) {
                                $scope.item.pasienSelected.noSep = e.data.nosep;
                            })
                            medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                                $scope.listpoliKontrol = data;
                            });
                            medifirstService.get("registrasi/get-pemakaian-asuransi?noregistrasi=" +
                                dataPasienSelected.noregistrasi
                            ).then(function (data) {
                                $scope.item.noSPRI = data.data.dataz[0].generatesuratkontrol;
                                $scope.item.noSuratKontrol = data.data.dataz[0].generatesuratkontrol;
                            });
                            // medifirstService.get("registrasi/get-pemakaian-asuransi", true, true, 10).then(function (data) {
                            //     $scope.listpoliKontrol = data;
                            // });
                            tglRegistrasi = dataPasienSelected.tglregistrasi;
                            $scope.listJenisRujukan = [{ 'id': 1, 'name': 'Rujuk Balik' }, { 'id': 2, 'name': 'Rujuk' }]
                            $scope.norecPDbuttonSelected = dataPasienSelected.norec_pd
                            $scope.norecAPDbuttonSelected = dataPasienSelected.norec_apd
                            $scope.objectruanganfkSelected = dataPasienSelected.objectruanganfk
                            $scope.nocmfk = dataPasienSelected.nocmfk
                            $scope.noregistrasi = dataPasienSelected.noregistrasi
                            $scope.item.nosep = dataPasienSelected.nosep
                            $scope.item.nokartuBpjs = dataPasienSelected.nobpjs
                            medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
                                $scope.listDokter = data.data.dokter;
                                medifirstService.get("rawatinap/get-combo-pindahpasien")
                                    .then(function (e) {
                                        $scope.listKondisiPasien = e.data.kondisipasien;
                                        $scope.listPenyebabKematian = e.data.penyebabkematian;
                                    })
                                $scope.popUpPulang.center().open();
                            });
                        })
                    }
                } else {
                    $scope.item.noSPRI = null;
                    $scope.item.noSuratKontrol = null;
                    debugger
                    $scope.dataPasienSelected = dataPasienSelected
                    $scope.pulang = null;
                    $scope.isPulangKontrol = false;
                    $scope.item.norec_pd = dataPasienSelected.norec_pd;
                    $scope.item.pasienSelected = dataPasienSelected;

                    medifirstService.get("rawatinap/get-nosep-by-norec-pd/" + dataPasienSelected.norec_pd).then(function (e) {
                        $scope.item.pasienSelected.noSep = e.data.nosep;
                    })
                    medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                        $scope.listpoliKontrol = data;
                    });
                    medifirstService.get("registrasi/get-pemakaian-asuransi?noregistrasi=" +
                        dataPasienSelected.noregistrasi
                    ).then(function (data) {
                        $scope.item.noSPRI = data.data.dataz[0].generatesuratkontrol;
                        $scope.item.noSuratKontrol = data.data.dataz[0].generatesuratkontrol;
                    });
                    // medifirstService.get("registrasi/get-pemakaian-asuransi", true, true, 10).then(function (data) {
                    //     $scope.listpoliKontrol = data;
                    // });
                    tglRegistrasi = dataPasienSelected.tglregistrasi;
                    $scope.listJenisRujukan = [{ 'id': 1, 'name': 'Rujuk Balik' }, { 'id': 2, 'name': 'Rujuk' }]
                    $scope.norecPDbuttonSelected = dataPasienSelected.norec_pd
                    $scope.norecAPDbuttonSelected = dataPasienSelected.norec_apd
                    $scope.objectruanganfkSelected = dataPasienSelected.objectruanganfk
                    $scope.nocmfk = dataPasienSelected.nocmfk
                    $scope.noregistrasi = dataPasienSelected.noregistrasi
                    $scope.item.nosep = dataPasienSelected.nosep
                    $scope.item.nokartuBpjs = dataPasienSelected.nobpjs
                    medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
                        $scope.listDokter = data.data.dokter;
                        medifirstService.get("rawatinap/get-combo-pindahpasien")
                            .then(function (e) {
                                $scope.listKondisiPasien = e.data.kondisipasien;
                                $scope.listPenyebabKematian = e.data.penyebabkematian;
                            })
                        $scope.popUpPulang.center().open();
                    });
                }
            }
            $scope.changeJenisPelayanan = function (e) {
                if ($scope.item.jenisRujukan.id == 2) {
                    medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes=" +
                        2, true, 10, 10)
                        .then(function (x) {
                            $scope.listFaskess = x;
                        })
                    $scope.item.noPenunjang = $scope.item.noBPJS
                    $scope.isRujuk = true
                } else {
                    medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes=" +
                        1, true, 10, 10)
                        .then(function (x) {
                            $scope.listFaskess = x;
                        })
                    $scope.isRujuk = false
                }
            }
            $scope.$watch('item.jenisRujukan', function (e) {
                if (e === undefined) return;

                medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes=" +
                    e, true, 10, 10)
                    .then(function (x) {
                        $scope.listFaskess = x;
                    })

            })

            $scope.kondisi = function () {
                debugger
                // $scope.item
                if ($scope.pulang.statuspulang.id == 13 && $scope.item.pasienSelected.objectkelompokpasienlastfk == 2) {

                    medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                        $scope.listpoliKontrol = data;
                    });
                    $scope.isPulangKontrol = true;
                } else {
                    $scope.isPulangKontrol = false;
                }
            }

            $scope.setBatalKonsul = function (dataPasienSelected) {
                // debugger;
                var data = {
                    "noregistrasifk": dataPasienSelected.norec_apd
                };
                medifirstService.post('rawatjalan/update-batal-konsul', data).then(function (e) {
                    loadData($scope.item.kondisi);
                })

            }

            $scope.generateSuratSPRI = function () {
                debugger
                // if ($scope.item.pasienSelected.diagnosa == '-' && $scope.item.pasienSelected.objectruanganfk != 569) {
                //     toastr.error('Harus Memberi Diagnosa Utama/Primary Terlebih Dahulu', 'Info');
                //     return;
                // }
                if ($scope.item.nokartuBpjs == "") {
                    toastr.error('nokartu Bpjs Kosong', 'Info');
                    return;
                }
                if ($scope.item.poliKontrol == "") {
                    toastr.error('Isi Poli', 'Info');
                    return;
                }
                if ($scope.item.poliKontrol.kode == "IGD") {
                    toastr.error('Poli IGD tidak bisa jadi spesialis', 'Info');
                    return;
                }
                if ($scope.item.kodeDokter == "") {
                    toastr.error('Isi Dokter', 'Info');
                    return;
                }

                var dataSend = {
                    "data": {
                        "request": {
                            "noKartu": $scope.item.nokartuBpjs,
                            "kodeDokter": $scope.item.kodeDokter.kode,
                            "poliKontrol": $scope.item.poliKontrol.kode,
                            "tglRencanaKontrol": moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'),
                            // "user": $scope.pegawai.tempatLahir,
                            "user": 'rsBhayCianjur'
                        }
                    }
                }
                $scope.isRouteLoading = true;
                if ($scope.item.noSPRI == null) {
                    medifirstService.postNonMessage("bridging/bpjs2/insert-spri-v2", dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.item.noSPRI = e.data.response.noSPRI;
                            if (e.data.response.noSPRI == null) {
                                toastr.error(e.data.metaData.message);
                                $scope.isRouteLoading = false;
                                return
                            }

                            // [norec] [nchar](32) NOT NULL,
                            // [noregistrasifk] [nchar](32) NULL, norec pasiendaftar
                            // [nospri] [nvarchar](25) NULL,
                            // [tglrencanakontrolspri] [datetime2](0) NULL,
                            // [objectdoktersprifk] [int] NULL,
                            // [objectruangansprifk] [int] NULL,
                            // [namadoktersprifk] [nvarchar](50) NULL,
                            // [namaruangansprifk] [nvarchar](50) NULL,
                            let dataRencanaKotrol = {
                                // norec_spri: $scope.item.norecSPRI,
                                noregistrasifk: $scope.item.norec_pd,
                                nosuratkontrol: e.data.response.noSPRI,
                                tglrencanakontrolspri: moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD HH:mm'),
                                objectdoktersprifk: $scope.item.kodeDokter.kode,
                                objectruangansprifk: $scope.item.poliKontrol.kode,
                                namadoktersprifk: $scope.item.kodeDokter.nama,
                                namaruangansprifk: $scope.item.poliKontrol.nama
                            }
                            SaveRencanaKontrol(dataRencanaKotrol)
                            $scope.saveLogging('Input SPRI', 'No Surat SPRI', e.data.response.noSPRI, 'Input SPRI ' + e.data.response.noSPRI + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))

                            $scope.isRouteLoading = false;
                            $scope.item.noSPRI = e.data.response.noSPRI
                            toastr.success('Generate SPRI Success. No SPRI : ' + e.data.response.noSPRI, 'Status');
                        } else {
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                } else {
                    var dataSend = {
                        "data": {
                            "request": {
                                "noSPRI": $scope.item.noSPRI,
                                "kodeDokter": $scope.item.kodeDokter.kode,
                                "poliKontrol": $scope.item.poliKontrol.kode,
                                "tglRencanaKontrol": moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'),
                                // "user": $scope.pegawai.tempatLahir,
                                "user": 'rsBhayCianjur'
                            }
                        }
                    }
                    medifirstService.postNonMessage("bridging/bpjs2/update-spri-v2", dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.item.noSPRI = e.data.response.noSPRI;
                            if (e.data.response.noSPRI == null) {
                                toastr.error(e.data.metaData.message);
                                $scope.isRouteLoading = false;
                                return
                            }

                            // [norec] [nchar](32) NOT NULL,
                            // [noregistrasifk] [nchar](32) NULL, norec pasiendaftar
                            // [nospri] [nvarchar](25) NULL,
                            // [tglrencanakontrolspri] [datetime2](0) NULL,
                            // [objectdoktersprifk] [int] NULL,
                            // [objectruangansprifk] [int] NULL,
                            // [namadoktersprifk] [nvarchar](50) NULL,
                            // [namaruangansprifk] [nvarchar](50) NULL,
                            let dataRencanaKotrol = {
                                // norec_spri: $scope.item.norecSPRI,
                                noregistrasifk: $scope.item.norec_pd,
                                nosuratkontrol: e.data.response.noSPRI,
                                tglrencanakontrolspri: moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD HH:mm'),
                                objectdoktersprifk: $scope.item.kodeDokter.kode,
                                objectruangansprifk: $scope.item.poliKontrol.kode,
                                namadoktersprifk: $scope.item.kodeDokter.nama,
                                namaruangansprifk: $scope.item.poliKontrol.nama
                            }
                            SaveRencanaKontrol(dataRencanaKotrol)
                            $scope.saveLogging('Edit SPRI', 'No Surat SPRI', e.data.response.noSPRI, 'Edit SPRI ' + e.data.response.noSPRI + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))

                            $scope.isRouteLoading = false;
                            $scope.item.noSPRI = e.data.response.noSPRI
                            toastr.success('Generate SPRI Success. No SPRI : ' + e.data.response.noSPRI, 'Status');
                        } else {
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                }
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.generateNoRencanaKontrol = function () {
                debugger
                if ($scope.item.pasienSelected.nosep == null || $scope.item.pasienSelected.nosep == '') {
                    toastr.error('No SEP Belum Ditemukan Pada Sistem Transmedic, Harap Hubungi Administrasi untuk memasukan SEP ke dalam Sistem Transmedic', 'Info');
                    return
                }
                if ($scope.item.nokartuBpjs == "") {
                    toastr.error('nokartu Bpjs Kosong', 'Info');
                    return;
                }
                if ($scope.item.poliKontrol == "") {
                    toastr.error('Isi Poli', 'Info');
                    return;
                }
                if ($scope.item.kodeDokter == "") {
                    toastr.error('Isi Dokter', 'Info');
                    return;
                }

                let dataSend = {
                    data: {
                        request: {
                            noSuratKontrol: $scope.item.noSuratKontrol,
                            noSEP: $scope.item.pasienSelected.nosep,
                            kodeDokter: $scope.item.kodeDokter.kode,
                            poliKontrol: $scope.item.poliKontrol.kode,
                            tglRencanaKontrol: moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'),
                            user: 'async'
                            // user: $scope.pegawai.namaLengkap
                        }
                    }
                };

                if ($scope.item.noSuratKontrol == null) {
                    medifirstService.postNonMessage("bridging/bpjs2/insert-rencana-kontrol-v2", dataSend).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.item.noSuratKontrol = e.data.response.noSuratKontrol;
                            let dataRencanaKotrol = {
                                noregistrasifk: $scope.item.pasienSelected.norec_pd,
                                nosuratkontrol: e.data.response.noSuratKontrol,
                                tglrencanakontrol: moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD HH:mm'),
                                objectdokterfk: $scope.item.kodeDokter.kode,
                                objectruanganfk: $scope.item.poliKontrol.kode,
                                namadokterfk: $scope.item.kodeDokter.nama,
                                namaruanganfk: $scope.item.poliKontrol.nama,
                                nosep: $scope.item.pasienSelected.nosep
                            }
                            SaveRencanaKontrol(dataRencanaKotrol)
                            $scope.saveLogging('Input Rencana Kontrol', 'No Surat Rencana Kontrol', e.data.response.noSuratKontrol, 'Input Rencana Kontrol ' + e.data.response.noSuratKontrol + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))
                            // document.getElementById("jsonInsert").innerHTML = JSON.stringify(e.data.response, undefined, 4); 
                        } else {
                            if (e.data.metaData.message == "Data Rujukan Tidak Sesuai - NoSep menggunakan No Rujukan Antar RS") {
                                window.messageContainer.error('PASIEN INI PASCA RAWAT. KONTROL SELANJUTNYA HARUS MENGGUNAKAN SURAT RUJUKAN, TIDAK PERLU MENERBITKAN SURKON, LANGSUNG KLIK SIMPAN SAJA')
                            } else {
                                window.messageContainer.error(e.data.metaData.message)
                            }
                        }
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    })
                } else {
                    medifirstService.putNonMessage("bridging/bpjs2/update-rencana-kontrol-v2", dataSend).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.item.noSuratKontrol = e.data.response.noSuratKontrol;
                            let dataRencanaKotrol = {
                                noregistrasifk: $scope.item.pasienSelected.norec_pd,
                                nosuratkontrol: e.data.response.noSuratKontrol,
                                tglrencanakontrol: moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD HH:mm'),
                                objectdokterfk: $scope.item.kodeDokter.kode,
                                objectruanganfk: $scope.item.poliKontrol.kode,
                                namadokterfk: $scope.item.kodeDokter.nama,
                                namaruanganfk: $scope.item.poliKontrol.nama,
                                nosep: $scope.item.pasienSelected.nosep
                            }
                            SaveRencanaKontrol(dataRencanaKotrol)
                            $scope.saveLogging('Edit Rencana Kontrol', 'No Surat Rencana Kontrol', e.data.response.noSuratKontrol, 'Edit Rencana Kontrol ' + e.data.response.noSuratKontrol + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))
                            // document.getElementById("jsonInsert").innerHTML = JSON.stringify(e.data.response, undefined, 4); 
                        } else {
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    })
                }
            }

            function SaveRencanaKontrol(dataRencanaKotrol) {
                debugger
                // let dataRencanaKotrol = {
                //     norec_suratkontrol: $scope.item.norec_suratkontrol,
                //     noregistrasifk: $scope.item.pasien.norec_pd,
                //     nosuratkontrol: e.data.response.noSuratKontrol,
                //     tglrencanakontrol: moment($scope.item.tglKontrol).format('YYYY-MM-DD'),
                //     objectdokterfk: $scope.item.kodeDokter.kode,
                //     objectruanganfk: $scope.item.poliKontrol.kode,
                //     namadokterfk: $scope.item.kodeDokter.nama,
                //     namaruanganfk: $scope.item.poliKontrol.nama
                // }
                medifirstService.post('registrasi/save-rencanakontrol', dataRencanaKotrol).then(function (e) {
                    debugger
                    e
                    // cetakSpri($scope.noregistrasi)
                })
            }

            function saveSpriLokal(norecSPRI, saveSPRI) {
                // if(norecSPRI == '') {
                medifirstService.post('registrasi/save-spri', saveSPRI).then(function (e) {
                    cetakSpri($scope.noregistrasi)
                })
                // } else {

                // }
            }

            $scope.simpanPulang = function () {
                var kondisikeluar = ""
                if ($scope.item.kondisiKeluar != undefined)
                    kondisikeluar = $scope.item.kondisiKeluar.id
                var kodeDokter = ""
                if ($scope.item.kodeDokter != undefined) {
                    kodeDokter = $scope.item.kodeDokter.nama
                }
                var objectpenyebabkematianfk = ""
                if ($scope.item.penyebabKematian != undefined)
                    objectpenyebabkematianfk = $scope.item.penyebabKematian.id
                var tglMeninggal = ""
                if ($scope.item.tglMeninggal != undefined)
                    tglMeninggal = moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss')
                if ($scope.pulang.statuspulang.id == 18 && kondisikeluar == "") {
                    toastr.error('Isi Semua ComboBox nya', 'Info');
                    return;
                }
                if ($scope.pulang.statuspulang.id == 18 && objectpenyebabkematianfk == "") {
                    toastr.error('Isi Semua ComboBox nya', 'Info');
                    return;
                }
                if ($scope.pulang.statuspulang.id == 16 && $scope.item.diRujukKe == undefined) {
                    toastr.error('Tujuan Rujukan Belum di Isi', 'Info');
                    return;
                }
                if ($scope.pulang.statuspulang.id == 16 && $scope.item.alasanRujuk == undefined) {
                    toastr.error('Alasan Rujukan Belum di Isi', 'Info');
                    return;
                }
                if ($scope.pulang.statuspulang.id == 16 && $scope.item.alamatPerujuk == undefined) {
                    toastr.error('Alamat Rujukan Belum di Isi', 'Info');
                    return;
                }
                if ($scope.pulang.statuspulang.id == 16 && $scope.item.dokterPerujuk == undefined) {
                    toastr.error('Dokter Perujuk Belum di Isi', 'Info');
                    return;
                }
                var dataJson = {
                    "noregistrasifk": $scope.norecPDbuttonSelected,
                    "objectstatuspulangfk": $scope.pulang.statuspulang.id,
                    "noregistrasifkapd": $scope.norecAPDbuttonSelected,
                    "objectruanganfk": $scope.objectruanganfkSelected,
                    'objectkondisipasienfk': kondisikeluar,
                    'objectpenyebabkematianfk': objectpenyebabkematianfk,
                    'tglmeninggal': tglMeninggal,
                    'keterangan': $scope.item.keterangan,
                    'tanggalRencakaKontrol': moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD HH:mm:ss'),
                    'dpjp': kodeDokter,
                };

                if ($scope.pulang.statuspulang.id == 13 && $scope.objectruanganfkSelected == 569) {
                    debugger
                    var tglRegistrasis = moment(tglRegistrasi).format('YYYY-MM-DD HH:mm');
                    var tglPulang = moment($scope.item.tglPulang).format('YYYY-MM-DD HH:mm');
                    var tglPulangsec = Date.parse(tglPulang);
                    var tglRegistrasisec = Date.parse(tglRegistrasis);
                    var maxtglsec = tglRegistrasisec + (6 * 60 * 60000);
                    var maxtgl = new Date(maxtglsec);
                    maxtgl = moment(maxtgl).format('YYYY-MM-DD HH:mm');
                    if (tglPulangsec < tglRegistrasisec || tglPulangsec > maxtglsec) {
                        toastr.error('Waktu Pulang Harus diAntara Waktu ' + tglRegistrasis + ' Sampai Waktu ' + maxtgl + '.', 'Info');
                        return;
                    }
                    var dataJson = {
                        "noregistrasifk": $scope.norecPDbuttonSelected,
                        "objectstatuspulangfk": $scope.pulang.statuspulang.id,
                        "noregistrasifkapd": $scope.norecAPDbuttonSelected,
                        "objectruanganfk": $scope.objectruanganfkSelected,
                        'objectkondisipasienfk': kondisikeluar,
                        'objectpenyebabkematianfk': objectpenyebabkematianfk,
                        'tanggalpulang': moment(tglPulang).format('YYYY-MM-DD HH:mm:ss'),
                    };
                } else if ($scope.pulang.statuspulang.id == 13) {

                    debugger
                    var tglRegistrasis = moment(tglRegistrasi).format('YYYY-MM-DD HH:mm');
                    var tglPulang = moment($scope.item.tglPulang).format('YYYY-MM-DD HH:mm');
                    var tglPulangsec = Date.parse(tglPulang);
                    var tglRegistrasisec = Date.parse(tglRegistrasis);
                    var maxtglsec = tglRegistrasisec + (5 * 60 * 60000);
                    var maxtgl = new Date(maxtglsec);
                    maxtgl = moment(maxtgl).format('YYYY-MM-DD HH:mm');
                    if (tglPulangsec < tglRegistrasisec) {
                        toastr.error('Waktu Pulang Harus Lebih Dari ' + tglRegistrasis + '.', 'Info');
                        return;
                    }
                    var dataJson = {
                        "noregistrasifk": $scope.norecPDbuttonSelected,
                        "objectstatuspulangfk": $scope.pulang.statuspulang.id,
                        "noregistrasifkapd": $scope.norecAPDbuttonSelected,
                        "objectruanganfk": $scope.objectruanganfkSelected,
                        'objectkondisipasienfk': kondisikeluar,
                        'objectpenyebabkematianfk': objectpenyebabkematianfk,
                        'tanggalpulang': moment(tglPulang).format('YYYY-MM-DD HH:mm:ss'),
                    };
                }

                debugger;
                var meninggal = {
                    "noregistrasi": $scope.noregistrasi,
                    "noregistrasifk": $scope.norecPDbuttonSelected
                }
                if ($scope.pulang.statuspulang.id == 16) {
                    var objRujuk = {
                        noregistrasifk: $scope.norecPDbuttonSelected,
                        nocmfk: $scope.nocmfk,
                        tglRujuk: moment($scope.item.tglRujuk).format('YYYY-MM-DD HH:mm:ss'),
                        faskestujuan: $scope.item.diRujukKe.nama,
                        alasanRujuk: $scope.item.alasanRujuk,
                        alamatPerujuk: $scope.item.alamatPerujuk,
                        kodefaskestujuan: $scope.item.diRujukKe.kode,
                        dokter: $scope.item.dokterPerujuk.id
                    }
                }


                medifirstService.post('rawatjalan/update-status-pulang', dataJson)
                    .then(function (e) {
                        if ($scope.pulang.statuspulang.id == 16) {
                            medifirstService.post('rawatinap/save-rujuk-pasien', objRujuk).then(function (e) {

                            })
                        }
                        if ($scope.pulang.statuspulang.id == 18) {
                            medifirstService.post('rawatinap/save-logging-meninggal2', meninggal).then(function (e) {

                            })
                        }
                        medifirstService.get("sysadmin/logging/save-log-pulang-pasien?norec_pd=" +
                            $scope.norecPDbuttonSelected
                        ).then(function (data) {

                        })
                        loadData($scope.item.kondisi);
                        $scope.popUpPulang.close();
                    });

            }

            $scope.cetakKontrol = function (x) {
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + $scope.item.noSuratKontrol).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        $("#noKontrolx").text($scope.item.noSuratKontrol);
                        $("#nokartuKontrol").text(e.data.response.sep.peserta.noKartu);
                        $("#namapesertaKontrol").text($scope.dataPasienSelected.namapasien);
                        $("#tgllahirKontrol").text(e.data.response.sep.peserta.tglLahir);
                        $("#diagnosaKontrol").text(e.data.response.sep.diagnosa);
                        $("#rencanakontrol").text(e.data.response.tglRencanaKontrol);
                        $("#tglcetakKontrol").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));
                        $("#dpjptujKontrol").text(e.data.response.namaDokter);
                        $("#subspetujKontrol").text('Sp./Sub.' + e.data.response.namaPoliTujuan);
                        $("#dpjppemberiSurat").text(e.data.response.namaDokterPembuat);

                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +                                
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

            }

            $scope.cetakSpri = function (x) {
                // function cetakSpri(noregistrasi) {
                debugger
                // medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-sep-v2?noSEP=" + $scope.dataPasienSelected.noSep).then(function (e) {
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + $scope.item.noSPRI).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        $("#noSPRIx").text($scope.item.noSPRI);
                        $("#nokartu").text($scope.item.nokartuBpjs);
                        $("#namapeserta").text($scope.dataPasienSelected.namapasien);
                        $("#tgllahir").text(moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD'));
                        $("#diagnosa").text('');
                        $("#rencanainap").text(e.data.response.tglRencanaKontrol);
                        $("#tglcetak").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));

                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +                                
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

            }




            $scope.setNamaKendali = function (dataPasienSelected) {
                // debugger;
                if (dataPasienSelected.namekendali == 'Belum Di Kirim') {
                    toastr.error('Dokumen Belum Di Kirim', 'Info');
                    return;
                }

                // if (dataPasienSelected.ismobilejkn == "1") {
                //     var a = new Date();
                //     var x = Date.parse(a);
                //     var data = {
                //         kodebooking: dataPasienSelected.statusschedule,
                //         taskid: 3,
                //         waktu: x
                //     }
                //     var objSave = {
                //         data: data
                //     }
                //     medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                //         debugger
                //         // body...
                //     })
                // }
                if (dataPasienSelected.statusschedule != "" && dataPasienSelected.objectruanganfk != "569") {
                    if (dataPasienSelected.istaskantrol == 3) {
                        var a = new Date();
                        var x = Date.parse(a);
                        var data = {
                            kodebooking: dataPasienSelected.statusschedule,
                            taskid: 4,
                            waktu: x
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                            debugger
                            var data = {
                                "noregistrasifk": dataPasienSelected.norec_apd,
                                "statusschedule": dataPasienSelected.statusschedule
                            };
                            medifirstService.post('registrasi/dokumenrm/update-kendali-dokumen', data).then(function (e) {
                                loadData($scope.item.kondisi);
                            })
                        })
                    } else {
                        toastr.error('Pengiriman Task Id 3 Tidak Bisa Dilakukan, Task Id Saat ini adalah ' + dataPasienSelected.istaskantrol, 'Info')
                        return;
                    }
                } else {
                    var data = {
                        "noregistrasifk": dataPasienSelected.norec_apd,
                        "statusschedule": dataPasienSelected.statusschedule
                    };
                    medifirstService.post('registrasi/dokumenrm/update-kendali-dokumen', data).then(function (e) {
                        loadData($scope.item.kondisi);
                    })
                }
            }

            $scope.diagnosaICD10 = function () {
                // debugger;
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan
                }
                cacheHelper.set('DiagnosaDokterCtrl', arrStr);
                $state.go('DiagnosaDokter')
            }
            $scope.diagnosaICD9 = function () {
                // debugger;
                // $state.go('RiwayatRegistrasi3', {
                //     nocm: $scope.dataPasienSelected.nocm,
                //     noregistrasi: $scope.dataPasienSelected.noregistrasi
                // });
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan
                }
                cacheHelper.set('DiagnosaDokterICD9Ctrl', arrStr);
                $state.go('DiagnosaDokterICD9')
            }
            $scope.showInputDiagnosaDokter = function () {
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')

            }
            $scope.rekamMedisElektronik = function () {
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis.VitalSign', {
                    norecAPD: $scope.dataPasienSelected.norec_apd,
                    noRec: $scope.dataPasienSelected.norec_apd
                })

            }


            $scope.resep = function () {
                debugger;
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }

            $scope.laboratorium = function () {
                debugger;
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }

            $scope.radiologi = function () {
                debugger;
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }

            $scope.inputTindakanDokter = function () {
                debugger;
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umurzz,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.dataPasienSelected.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.dataPasienSelected.idkelas,
                    10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.objectruanganfk,
                    12: $scope.dataPasienSelected.namaruangan + '`'
                }
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                // $state.go('inputTindakanDokterRev')

                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: $scope.dataPasienSelected.norec_pd,
                    norecAPD: $scope.dataPasienSelected.norec_apd,

                });
            }

            $scope.Monitoring = function () {
                $state.go('MonitoringPasien', {
                    noCm: $scope.dataPasienSelected.nocm
                });
            }

            $scope.PengkajianAwal = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.DashboardPAP', {
                    noCM: $scope.dataPasienSelected.nocm,
                    tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.dataPasienSelected.norec_apd,
                    ruangana: $scope.dataPasienSelected.objectruanganfk
                });
                // } else {
                //     $state.go('dashboardpasien.DashboardPAP', {
                //         noCM: $scope.item.nocm,
                //         tanggal: moment(new Date($scope.item.nocm .tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //         noRec: $scope.item.noRec,
                //         ruangana:$scope.item.ruangan.id
                //     });
                // }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianMedis = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.PengkajianMedis', {
                    noCM: $scope.dataPasienSelected.nocm,
                    tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.dataPasienSelected.norec_apd,
                    ruangana: $scope.dataPasienSelected.objectruanganfk
                });
                // } else {
                //         $state.go('dashboardpasien.PengkajianMedis', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.detailOrder = function () {
                if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                } else {
                    $state.go('dashboardpasien.BillingDetail', {
                        noRecRegistrasi: $scope.dataPasienSelected.norec_pd,
                        noRec: $scope.dataPasienSelected.norec_apd
                    });
                }
            }

            $scope.detailPasien = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pasien', {
                    noCM: $scope.dataPasienSelected.nocm,
                    tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.dataPasienSelected.norec_apd
                });
                //     } else {
                //         $state.go('dashboardpasien.pasien', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianLanjutan = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pengkajianLanjutan', {
                    noCM: $scope.dataPasienSelected.nocm,
                    tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.dataPasienSelected.norec_apd,
                    ruangana: $scope.dataPasienSelected.objectruanganfk
                });
                //     } else {
                //         $state.go('dashboardpasien.pengkajianLanjutan', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.orderPenunjang = function () {
                // * Validasi Untuk Sekali Bayar
                //if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar
                debugger

                if ($scope.dataPasienSelected.norec_pd != undefined) {
                    $state.go('OrderPenunjang', {
                        norecPD: $scope.dataPasienSelected.norec_pd,
                        norecAPD: $scope.dataPasienSelected.norec_apd,
                    });
                } else {
                    window.messageContainer.error("Pasien Belum di Pilih!!");
                    return;
                }
            }

            $scope.findData = function () {
                loadData($scope.item.kondisi)
                dataKonsul2()
            }

            $scope.pemeriksaanPasien = function () {
                var cookie = document.cookie.split(';');

                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.dataPasienSelected.nocm,
                            tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.dataPasienSelected.norec_apd
                        });
                    } else {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.dataPasienSelected.pasien.nocm,
                            tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: dataPasienSelected.norec_apd
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }

            $scope.cekStatusBeforePemeriksaan = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }
                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.status = true;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien harus di panggil dokter terlebih dahulu";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            $scope.cekStatusBeforePanggil = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": false,
                    "statusAntrian": 0
                }

                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien sudah di panggil suster";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.status = true;
                                obj.statusAntrian = 1;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                obj.statusAntrian = 2;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            //  $scope.batal = function() {
            //     $scope.showAlert();
            //  }
            // $("#confirmBtn").on("click", function () {
            //     window.myconfirm("Anda Yakin akan membatalkan pasien?").then(function () {
            //       window.myalert("Operation done!");
            //     }, function () {
            //       window.myalert("You chose to Cancel action.");
            //     });
            // });
            // function myconfirm(content){
            //     return $("<div></div>").kendoConfirm({
            //       title: "My Title",
            //       content: content
            //     }).data("kendoConfirm").open().result;
            // }
            $scope.batalPanggil = function () {
                if ($scope.item.statusAntrian !== "SELESAI_DIPERIKSA") {

                    if ($scope.item !== undefined && $scope.item.pasienDaftar !== undefined) {

                        var dataJson = {
                            "norec_apd": $scope.item.noRec
                            // "idRuangan": $scope.item.ruangan.id
                        }
                        medifirstService.post('rawatjalan/save-batal-panggil', dataJson)
                            .then(function (e) {
                                $scope.findData();

                            });
                    } else {
                        window.messageContainer.error('Pasien belum di pilih');
                    }
                } else {
                    messageContainer.error('Pasien sudah selesai diperiksa')
                }
            }

            $scope.UbahDokter = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Pilih Pasien Dahulu!!!")
                    return;
                } else {
                    medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
                        $scope.listDokter = data.data.dokter;

                        $scope.item.pilihDokter = { id: $scope.dataPasienSelected.objectpegawaifk, namalengkap: $scope.dataPasienSelected.namadokter }
                        $scope.winDialogss.center().open();
                    });
                }
            }

            $scope.diagnosaFreText = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Pilih Pasien Dahulu!!!")
                    return;
                } else {
                    $scope.popUpDiagnosa.ket = $scope.dataPasienSelected.diagnosafretext
                    $scope.popUpDiagnosa.center().open();
                }
            }

            $scope.simpanDiagnosaFreText = function () {
                var dataJson = {
                    "noregistrasifk": $scope.dataPasienSelected.norec_pd,
                    "diagnosa": $scope.popUpDiagnosa.ket,
                };
                medifirstService.post('rawatjalan/update-diagnosa-fretext', dataJson)
                    .then(function (e) {
                        loadData($scope.item.kondisi);
                        $scope.popUpDiagnosa.close();
                    });
            }
            $scope.simpanDokter = function () {
                debugger;
                // 
                // var listRawRequired = [
                //     "items.pilihDokter|k-ng-model|Dokter"
                // ];
                // var isValid = ModelItem.setValidation($scope, listRawRequired);

                // if(isValid.status){
                // munculkan nama dokter di grid
                // items.pilihDokter = data.data.dokter.namalengkap;

                // save dokter yang dipilih
                var tmpData = {
                    norec_apd: $scope.dataPasienSelected.norec_apd,
                    // iddokter: dataPasienSelected.pilihDokter.id
                    iddokter: $scope.item.pilihDokter.id
                }
                medifirstService.post('rawatjalan/save-update-dokter-antrian', tmpData).then(function (e) {
                    // update status antrian
                    $scope.winDialogss.close();
                    loadData($scope.item.kondisi);
                    // $scope.findData(); 
                    $scope.item.pilihDokter = '';

                });
                // } else {
                //     ModelItem.showMessages(isValid.messages);
                // }
            }


            $scope.batalPeriksa = function () {
                if ($scope.item.statusAntrian === "MENUNGGU") {
                    if ($scope.item !== undefined && $scope.item.pasienDaftar !== undefined) {

                        // findPasien.getListData('service/list-generic/?view=Pembatal&select=*').then(function(e){
                        //     $scope.listPembatalan = e.data;
                        // })
                        $scope.listRuangan = [];
                        $scope.listRuangan.push($scope.item.ruangan);
                        $scope.items.ruangan = $scope.listRuangan[0];
                        // $scope.item.pasienDaftar.tglRegistrasi = dateHelper.formatDate($scope.item.pasienDaftar.tglRegistrasi, 'DD-MM-YYYY');
                        $scope.winDialog.center().open();
                    } else {
                        window.messageContainer.error('Pasien belum di pilih');
                    }
                } else {
                    messageContainer.error('Pasien sudah diperiksa')
                }
            }
            $scope.CetakSumList = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + $scope.item.pasien.noCm + "&tglRegistrasi=" + new moment($scope.item.pasienDaftar.tglRegistrasi).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.item.pasien.noCm + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item != undefined) {

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')
                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&view=false', function (response) {

                    });

                }
            }
            $scope.cetakGelang = function () {
                if ($scope.item != undefined) {
                    var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/gelangPasien?id=" + $scope.item.pasien.id);
                    window.open(fixUrlLaporan, '', 'width=800,height=600')
                }
            }
            $scope.cetakHelper = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $scope.item.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }
            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetakLabel = function () {
                // if($scope.item != undefined){
                //     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')
                // }
                $scope.dats = {
                    qty: 0
                }
                $scope.dialogCetakLabel.center().open();
            }
            $scope.pilihQty = function (data) {
                var listRawRequired = [
                    "dats.qty|k-ng-model|kuantiti"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var qty = data.qty;
                    if (qty !== undefined) {
                        // var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
                        // window.open(fixUrlLaporan, '', 'width=800,height=600')
                        //cetakan langsung service VB6 by grh
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&view=false&qty=' + qty, function (response) {
                            // do something with response
                        });

                    }
                    $scope.dialogCetakLabel.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };
            $scope.cetakNoAntrian = function () {
                if ($scope.item != undefined) {

                    // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + $scope.item.noRec);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')
                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }
            $scope.cetakKartu = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.item.pasien.id + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }
            // $scope.sourceJenisDiagnosisPrimer = [{
            //     "statusEnabled": true,
            //     "namaExternal": "Diagnosa Awal",
            //     "kdProfile": 0,
            //     "qJenisDiagnosa": 5,
            //     "reportDisplay": "Diagnosa Pasca Bedah",
            //     "jenisDiagnosa": "Diagnosa Awal",
            //     "id": 5,
            //     "kodeExternal": "05",
            //     "kdJenisDiagnosa": 5,
            //     "noRec": "5                               "
            // }]
            $scope.openCetakRmk = function () {
                if ($scope.item != undefined) {
                    findPasien.getDiagnosaNyNoRec($scope.item.noRec).then(function (e) {
                        if (e.data.data.DiagnosaPasien.length > 0) {
                            $scope.cetakBro();
                        } else {
                            $scope.item.jenisDiagnosis = $scope.sourceJenisDiagnosisPrimer[4];
                            ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function (data) {
                                $scope.sourceDiagnosisPrimer = data;
                            });
                            $scope.icd10.center().open();
                        }
                    })
                    // $scope.item.jenisDiagnosis = $scope.sourceJenisDiagnosisPrimer[0];
                    // ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
                    //     $scope.sourceDiagnosisPrimer = data;
                    // });
                    // $scope.icd10.center().open();
                }
            }
            $scope.cetakRMK = function () {
                // var listRawRequired = [
                //     "item.diagnosisPrimer|k-ng-model|Diagnosa awal"
                // ]
                // var isValid = ModelItem.setValidation($scope, listRawRequired);

                // if(isValid.status){
                //     if($scope.item != undefined){
                //         var saveData = {
                //             pasien: {
                //                 id: $scope.item.pasien.id
                //             },
                //             tanggalPendaftaran: $scope.item.pasienDaftar.tglRegistrasi,
                //             diagnosis: [{
                //                 diagnosa: {
                //                     id: $scope.item.diagnosisPrimer.id
                //                 },
                //                 jenisDiagnosa: $scope.item.jenisDiagnosis,
                //                 keterangan: $scope.item.keteranganDiagnosis
                //             }],
                //             noRecPasienDaftar: $scope.item.noRec
                //         }
                //         // console.log(JSON.stringify(saveData));
                //         medifirstService.post(saveData).then(function(e){
                //             $scope.icd10.close();
                //             $scope.cetakBro();
                //             // var fixUrlLaporan = cetakHelper.open("reporting/lapRingkasanKeluarMasuk?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                //             // window.open(fixUrlLaporan, '', 'width=800,height=600')

                //             // var client = new HttpClient();
                //             // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.item.noRec + '&view=false', function(response) {
                //             //         // do something with response
                //             // });

                //             // var client = new HttpClient();
                //             // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&view=false', function(response) {
                //             //     // do something with response
                //             // }); 
                //         })
                //     }
                // } else {
                //     ModelItem.showMessages(isValid.messages);
                // }

            }
            $scope.cetakBro = function () {
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.item.noRec + '&view=false', function (response) {
                    // do something with response
                });
            }
            // //*cetak SEP
            // $scope.CetakSEP = function() {
            //     if($scope.item != undefined){
            //         var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
            //         window.open(fixUrlLaporan, '_blank')
            //     }
            // }
            $scope.inputTindakan = function (item, data) {
                debugger;
                $scope.hideBtnSimpan = true;
                if ($scope.dataPasienSelected.iddokter === undefined || $scope.dataPasienSelected.iddokter === '' || $scope.dataPasienSelected.iddokter === '1' || $scope.dataPasienSelected.iddokter === null) {

                    // $scope.UbahDokter = function (item, data) {
                    if (data === undefined)
                        data = $scope.item;

                    $scope.item = data;
                    medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                        $scope.listDokter = data.data.dokter;
                    })
                    // show popup untuk pilih dokter
                    $scope.winDialogss.center().open();
                    // }
                    // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                    $scope.hideBtnSimpan = false;
                    return;
                }

                if ($scope.dataPasienSelected.objectkelasdijaminfk === null && $scope.dataPasienSelected.objectkelompokpasienlastfk != 1) {
                    alert('Kelas Tanggungan Belum di isi, Hubungi Admisi Untuk Mengisinya')
                    return;
                }

                debugger;
                if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim' && $scope.dataPasienSelected.objectruanganfk != '309' && $scope.dataPasienSelected.objectruanganfk != '569' && $scope.dataPasienSelected.objectruanganfk != '251' && $scope.dataPasienSelected.objectruanganfk != '12' && $scope.dataPasienSelected.objectruanganfk != '322') {
                    alert('dokumen belum dikirim')
                    return;
                }
                if ($scope.dataPasienSelected.namekendali == 'DIKIRIM' && $scope.dataPasienSelected.objectruanganfk != '322') {
                    alert('Terima Dokumen Terlebih Dahulu')
                    return;
                }
                if ($scope.item) {
                    var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                        3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                        4: $scope.item.ruanganMulti,
                        5: $scope.myVar
                    }
                    // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                    cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                    $state.go('InputTindakan', {
                        norecPD: $scope.dataPasienSelected.norec_pd,
                        norecAPD: $scope.dataPasienSelected.norec_apd,
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.inputTindakanDiagnosa = function (item, data) {
                debugger;
                $scope.hideBtnSimpan = true;
                // if ($scope.dataPasienSelected.namekendali === undefined) {
                //     messageContainer.error("Pilih data terlebih dahulu");
                //     return
                // }
                if ($scope.dataPasienSelected.objectruanganfk != 20) {
                    if ($scope.dataPasienSelected.iddokter === undefined || $scope.dataPasienSelected.iddokter === '' || $scope.dataPasienSelected.iddokter === '1' || $scope.dataPasienSelected.iddokter === null) {

                        // $scope.UbahDokter = function (item, data) {
                        if (data === undefined)
                            data = $scope.item;

                        $scope.item = data;
                        medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                            $scope.listDokter = data.data.dokter;
                        })
                        // show popup untuk pilih dokter
                        $scope.winDialogss.center().open();
                        // }
                        // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                }
                if ($scope.dataPasienSelected.kasuspenyakit === null) {
                    $scope.popUpKasusPenyakit.center().open();
                    return;
                }
                if ($scope.dataPasienSelected.objectkelasdijaminfk === null && $scope.dataPasienSelected.objectkelompokpasienlastfk != 1) {
                    alert('Kelas Tanggungan Belum di isi, Hubungi Admisi Untuk Mengisinya')
                    return;
                }
                if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim' && $scope.dataPasienSelected.objectruanganfk != '309' && $scope.dataPasienSelected.objectruanganfk != '569' && $scope.dataPasienSelected.objectruanganfk != '251' && $scope.dataPasienSelected.objectruanganfk != '12' && $scope.dataPasienSelected.objectruanganfk != '322') {
                    alert('dokumen belum dikirim')
                    return;
                }
                if ($scope.dataPasienSelected.namekendali == 'DIKIRIM') {
                    alert('Terima Dokumen Terlebih Dahulu')
                    return;
                }
                if ($scope.item) {
                    var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                        3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                        4: $scope.item.ruanganMulti,
                        5: $scope.myVar
                    }
                    // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                    cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                    $state.go('InputTindakanDiagnosa', {
                        norecPD: $scope.dataPasienSelected.norec_pd,
                        norecAPD: $scope.dataPasienSelected.norec_apd,
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
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

            $scope.cetakSEP = function () {
                if ($scope.item != undefined && $scope.item.kelompokPasien !== "Umum/Pribadi") {
                    // var noSep = e.data.data === null ? "2423432" : e.data.data;
                    // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=' + $scope.item.pasienDaftar.noRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }

            // edit data registrasi pasien
            $scope.cekStatusBeforeEdit = function (statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }

                switch (statusAntrian) {
                    case "DIPANGGIL_DOKTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "DIPANGGIL_SUSTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "MENUNGGU":
                        obj.status = true;
                        break;
                }
                return obj;
            }
            $scope.BuatSurat = function () {
                debugger;
                if ($scope.dataPasienSelected.norec_pd == undefined) {
                    toastr.error('Pilih Data Dahulu')
                    return;
                } else {
                    var arrStr = {
                        0: $scope.dataPasienSelected.norec_pd,
                        1: $scope.dataPasienSelected.nocm,
                        2: $scope.dataPasienSelected.noregistrasi,
                        3: $scope.dataPasienSelected.namapasien,
                        4: $scope.dataPasienSelected.tglregistrasi,
                        5: $scope.dataPasienSelected.jeniskelamin,
                        6: $scope.dataPasienSelected.namaruangan,
                        7: $scope.dataPasienSelected.alamatlengkap,
                        8: $scope.dataPasienSelected.umurzz
                    }
                    cacheHelper.set('BuatSurat', arrStr);
                    $state.go('BuatSurat')
                }
            }
            $scope.editRegistrasi = function () {
                // var objValid = $scope.cekStatusBeforeEdit($scope.item.statusAntrian);
                // if (objValid.status) {
                $state.go('editRegistrasiPelayanan', {
                    noCm: $scope.item.pasien.noCm,
                    noRec: $scope.item.pasienDaftar.noRec
                });
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }
            $scope.formatJam24 = {
                value: new Date(), //set default value
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            }
            $scope.toogleKlikDiagnosa = function () {
                $scope.klikDiagnosa = !$scope.klikDiagnosa;
            }
            $scope.findDiagnosaPasien = function () {
                $scope.currentNorec = $scope.item.noRec;
                findPasien.getDiagnosaNyNoRec($scope.currentNorec).then(function (data) {
                    if (data.data.data.DiagnosaPasien === undefined) return;
                    if (data.data.data.DiagnosaPasien.length === 0) return;
                    $scope.listDiagnosa = ModelItem.beforePost(data.data.data.DiagnosaPasien[data.data.data.DiagnosaPasien.length - 1].diagnosis, true);
                    // $scope.item.noRec = data.data.data.DiagnosaPasien[0].noRec;
                    var temp = [];
                    var i = 1;
                    for (var key in $scope.listDiagnosa) {
                        if ($scope.listDiagnosa.hasOwnProperty(key)) {
                            var element = $scope.listDiagnosa[key];
                            temp.push({
                                jenisDiagnosis: element.jenisDiagnosa,
                                kdDiagnosa: element.diagnosa.kdDiagnosa,
                                namaDiagnosa: element.diagnosa.namaDiagnosa,
                                id: element.diagnosa.id,
                                // no: i
                            });
                            i++;
                        }
                    }
                    $scope.dataDiagnosisPrimer = new kendo.data.DataSource({
                        data: temp,
                        change: function (e) {
                            var row = 0;
                            e.items.forEach(function (data) {
                                data.rowNumber = ++row;
                            })
                        }
                    });
                });
            }
            $scope.inputDiagnosa = function () {
                if ($scope.item != undefined) {
                    if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim' && $scope.dataPasienSelected.objectruanganfk != '309' && $scope.dataPasienSelected.objectruanganfk != '569' && $scope.dataPasienSelected.objectruanganfk != '251' && $scope.dataPasienSelected.objectruanganfk != '12' && $scope.dataPasienSelected.objectruanganfk != '322') {
                        alert('dokumen belum dikirim')
                        return;
                    }
                    $scope.item.pasienDaftar.tglRegistrasi = new Date($scope.item.pasienDaftar.tglRegistrasi);
                    $scope.findDiagnosaPasien();
                    $scope.isLoadingDiagnosis = false;
                    $scope.findBy = 0;
                    $scope.toogleKlikDiagnosa();
                    // $scope.item.jenisDiagnosis = $scope.sourceJenisDiagnosisPrimer[0];
                    // ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
                    //     $scope.sourceDiagnosisPrimer = data;
                    // });
                    // $scope.WinInputDiagnosa.center().open();
                }
            }
            $scope.removeDiagnosa = function (e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");

                var selectedItem = grid.dataItem(row);

                $scope.dataDiagnosisPrimer.remove(selectedItem);
            }
            $scope.klikInputData = function () {
                $scope.inputDataDiagnosis = !$scope.inputDataDiagnosis;
            }
            $scope.gridDiagnosa = {
                columns: [{
                    "field": "rowNumber",
                    title: "#",
                    "width": 40
                }, {
                    "field": "jenisDiagnosis.jenisDiagnosa",
                    "title": "Jenis Diagnosis",
                    "width": 150
                }, {
                    "field": "kdDiagnosa",
                    "title": "Kode Diagnosa",
                    "width": 150
                }, {
                    "field": "namaDiagnosa",
                    "title": "Nama Diagnosa"
                }, {
                    "field": "ketDiagnosis",
                    "title": "Keterangan",
                    "width": 150
                }, {
                    command: {
                        text: "Hapus",
                        click: $scope.removeDiagnosa
                    },
                    title: "&nbsp;",
                    width: "100px"
                }]
            }
            $scope.gridDiagnosaBaru = {
                columns: [{
                    "field": "rowNumber",
                    title: "#",
                    "width": 40
                }, {
                    "field": "jenisDiagnosis.jenisDiagnosa",
                    "title": "Jenis Diagnosis",
                    "width": 150
                }, {
                    "field": "diagnosisPrimer.kdDiagnosa",
                    "title": "Kode Diagnosa",
                    "width": 150
                }, {
                    "field": "diagnosisPrimer.namaDiagnosa",
                    "title": "Nama Diagnosa"
                }, {
                    "field": "ketDiagnosis",
                    "title": "Keterangan",
                    "width": 150
                }, {
                    command: {
                        text: "Hapus",
                        click: $scope.removeDiagnosa
                    },
                    title: "&nbsp;",
                    width: "100px"
                }]
            }
            $scope.listInputDiagnosis = new kendo.data.DataSource({
                data: [],
                change: function (e) {
                    var row = e.index;
                    e.items.forEach(function (data) {
                        data.rowNumber = ++row;
                    })
                }
            });
            $scope.addDataDiagnosisPrimer = function () {
                var listRawRequired = [
                    "item.jenisDiagnosis|k-ng-model|Jenis Diagnosa",
                    "item.diagnosisPrimer|k-ng-model|Diagnosa",
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.listInputDiagnosis.add({
                        "jenisDiagnosis": $scope.item.jenisDiagnosis,
                        "diagnosisPrimer": $scope.item.diagnosisPrimer,
                        "ketDiagnosis": $scope.item.keteranganDiagnosis
                    });
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keteranganDiagnosis;
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }
            $scope.simpanDiagnosa = function () {
                // if($scope.item != undefined){
                //     if ($scope.listInputDiagnosis._data.length >0){
                //         var dataDiagnosis = [];
                //         $scope.listInputDiagnosis._data.forEach(function(elemen){
                //             dataDiagnosis.push({
                //                 diagnosa: {
                //                     id: elemen.diagnosisPrimer.id
                //                 },
                //                 jenisDiagnosa: elemen.jenisDiagnosis,
                //                 keterangan: elemen.ketDiagnosis
                //             })
                //         });
                //         var saveData = {
                //             pasien: {
                //                 id: $scope.item.pasien.id
                //             },
                //             tanggalPendaftaran: $scope.item.pasienDaftar.tglRegistrasi,
                //             // diagnosis: [{
                //             //     diagnosa: {
                //             //         id: $scope.item.diagnosisPrimer.id
                //             //     },
                //             //     jenisDiagnosa: $scope.item.jenisDiagnosis
                //             // }],
                //             diagnosis: dataDiagnosis,
                //             noRecPasienDaftar: $scope.item.noRec
                //         }
                //         // console.log(JSON.stringify(saveData));
                //         medifirstService.post(saveData).then(function(e){
                //             // $scope.WinInputDiagnosa.close();
                //             $scope.findDiagnosaPasien();
                //             $scope.klikInputData();
                //         }, function(error){
                //             console.log(JSON.stringify(error))
                //         })
                //     } else {
                //         messageContainer.error('Data diagnosis belum ada');
                //         return;
                //     }
                // } else {
                //     messageContainer.error('Data belum dipilih');
                //     return;
                // }
            }
            $scope.updateKelasPelayanan = function () {
                if ($scope.item) {
                    $state.go('editKelasPelayanan', {
                        noCm: $scope.item.pasien.noCm,
                        noRec: $scope.item.pasienDaftar.noRec
                    });
                }
            }

            $scope.Detail = function (data) {
                debugger;
                if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim' && $scope.dataPasienSelected.objectruanganfk != '309' && $scope.dataPasienSelected.objectruanganfk != '569' && $scope.dataPasienSelected.objectruanganfk != '251' && $scope.dataPasienSelected.objectruanganfk != '12' && $scope.dataPasienSelected.objectruanganfk != '322') {
                    alert('dokumen belum dikirim')
                    return;
                }
                if ($scope.dataPasienSelected.objectruanganfk != 20) {
                    if ($scope.dataPasienSelected.iddokter === undefined || $scope.dataPasienSelected.iddokter === '' || $scope.dataPasienSelected.iddokter === '1' || $scope.dataPasienSelected.iddokter === null) {

                        // $scope.UbahDokter = function (item, data) {
                        if (data === undefined)
                            data = $scope.item;

                        $scope.item = data;
                        medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                            $scope.listDokter = data.data.dokter;
                        })
                        // show popup untuk pilih dokter
                        $scope.winDialogss.center().open();
                        // }
                        // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                }
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }

            }

            $scope.TransaksiLayanan = function () {
                // debugger;
                if ($scope.dataPasienSelected.norec_apd == null) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                } else {
                    $state.go('DashboardPasien', {
                        noregistrasi: $scope.dataPasienSelected.noregistrasi,
                        norec_pd: $scope.dataPasienSelected.norec_pd,
                        norec_apd: $scope.dataPasienSelected.norec_apd,
                        umur: $scope.dataPasienSelected.umurzz,
                        idpegawai: $scope.pegawai.id
                    });
                }
            }

            $scope.OrderGizi = function () {
                $state.go('OrderMenuGiziRev');
            }

            $scope.skriningGizi = function () {
                // debugger
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.pengkajianLanjutan', {
                            noCM: $scope.item.pasien.noCm,
                            tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.noRec,
                            ruangana: $scope.item.ruangan.id
                        });
                    } else {
                        $state.go('dashboardpasien.pengkajianLanjutan', {
                            noCM: $scope.dataPasienSelected.nocm,
                            tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.dataPasienSelected.norec_pd,
                            ruangana: $scope.dataPasienSelected.objectruanganfk
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }
            $scope.pengkajianMedis = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih Data dulu')
                    return
                }
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.dataPasienSelected.nocm,
                            tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.dataPasienSelected.norec_pd,
                            ruangana: $scope.dataPasienSelected.objectruanganfk
                        });
                    } else {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.dataPasienSelected.nocm,
                            tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.dataPasienSelected.norec_pd,
                            ruangana: $scope.dataPasienSelected.objectruanganfk
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }
            // **** Kejadian pasien jatuh
            $scope.dialog = {
                tglJatuh: $scope.now
            }
            $scope.pasienJatuh = function () {
                if (!$scope.dataPasienSelected.norec_pd) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.dialog.nocm = $scope.dataPasienSelected.nocm
                $scope.dialog.namapasien = $scope.dataPasienSelected.namapasien
                $scope.dialog.norec_pd = $scope.dataPasienSelected.norec_pd
                $scope.dialog.nocm = $scope.dataPasienSelected.nocm

                $scope.dialogPasienJatuh.center().open()
            }
            $scope.simpanJatuh = function (data) {
                var objsave = {
                    "norec": "",
                    "statusenabled": true,
                    "nocm": $scope.dialog.nocm,
                    "noregistrasifk": $scope.dialog.norec_pd,
                    "jumlah": $scope.dialog.jumlah != undefined ? $scope.dialog.jumlah : 0,
                    "tgljatuh": moment(data.tglJatuh).format('YYYY-MM-DD HH:mm'),
                    "keterangan": data.keterangan != undefined ? data.keterangan : '-',
                }
                medifirstService.post('rawatjalan/save-pasien-jatuh', objsave).then(function (e) {
                    $scope.dialog = {}
                })
            }
            // $scope.panggil = function(){
            //     if ($scope.dataPasienSelected == undefined){
            //         toastr.error('Pilih Data dulu')
            //         return
            //     }
            //     var cookie = document.cookie.split(';');
            //     cookie = cookie[0].split('=');
            //     var data ={
            //         "norec_apd" : $scope.dataPasienSelected.norec_apd,
            //         "kelompokUser" : cookie[1]
            //     }
            //     medifirstService.post('rawatjalan/save-panggil',data)
            //     .then(function (res) {
            //         // loadData($scope.item.kondisi);
            //         // $('td').css("background-color", "");

            //         // var rowIndex = 
            //         var propertyName = 'stts'

            //         var grid = $("#grid").data("kendoGrid");
            //         var selectedItem = grid.dataItem(grid.select());
            //         var array = grid.dataSource._data
            //         var rowIndex = 0
            //         for (let i = 0; i <  array.length; i++) {
            //             if(array[i].norec_apd == selectedItem.norec_apd ){
            //                  rowIndex = i
            //                  break
            //             }
            //         }
            //         var dataItem = grid.dataSource.at(rowIndex);
            //         var rowCells = grid.element.find("tr[data-uid=" + dataItem.uid + "] td");

            //         var headerCells = grid.element.find("th");
            //         var cellIndex = headerCells.index(grid.element.find("th[data-field = '" + propertyName + "']"));

            //         var cell = $(rowCells[cellIndex]);

            //         //set CSS
            //         cell.css("background-color", "#98FB98");
            //         cell.css("color", "#000000");


            //         $scope.dataPasienSelected.stts = 'Di Panggil Perawat'
            //         var ipAddress ='127.0.0.1'
            //         if($scope.dataPasienSelected.ipaddress != undefined &&$scope.dataPasienSelected.ipaddress!=null )
            //             ipAddress = $scope.dataPasienSelected.ipaddress 
            //         var client = new HttpClient();
            //         client.get('http://'+ipAddress+':2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.dataPasienSelected.noantrian 
            //         + '&namapasien=' + $scope.dataPasienSelected.nocm + ', ' + $scope.dataPasienSelected.namapasien +
            //         '&ruangan=' + $scope.dataPasienSelected.namaruangan + '&view=true', function (response) {
            //             // do something with response
            //         });

            //     })
            // }
            $scope.panggil = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih Data dulu')
                    return
                }
                var objSave = {
                    "norec_apd": $scope.dataPasienSelected.norec_apd
                }
                medifirstService.post('rawatjalan/save-dipanggil-suster', objSave).then(function (e) {
                    loadData($scope.item.kondisi)
                })
                // var cookie = document.cookie.split(';');
                // cookie = cookie[0].split('=');
                // var data ={
                //     "norec_apd" : $scope.dataPasienSelected.norec_apd,
                //     "kelompokUser" : cookie[1]
                // }
                // medifirstService.post('rawatjalan/save-panggil',data)
                // .then(function (res) {
                //     // loadData($scope.item.kondisi);
                //     // $('td').css("background-color", "");

                //     // var rowIndex = 
                //     var propertyName = 'stts'

                //     var grid = $("#grid").data("kendoGrid");
                //     var selectedItem = grid.dataItem(grid.select());
                //     var array = grid.dataSource._data
                //     var rowIndex = 0
                //     for (let i = 0; i <  array.length; i++) {
                //         if(array[i].norec_apd == selectedItem.norec_apd ){
                //              rowIndex = i
                //              break
                //         }
                //     }
                //     var dataItem = grid.dataSource.at(rowIndex);
                //     var rowCells = grid.element.find("tr[data-uid=" + dataItem.uid + "] td");

                //     var headerCells = grid.element.find("th");
                //     var cellIndex = headerCells.index(grid.element.find("th[data-field = '" + propertyName + "']"));

                //     var cell = $(rowCells[cellIndex]);

                //     //set CSS
                //     cell.css("background-color", "#98FB98");
                //     cell.css("color", "#000000");


                //     $scope.dataPasienSelected.stts = 'Di Panggil Perawat'
                var ipAddress = '127.0.0.1'
                // if($scope.dataPasienSelected.ipaddress != undefined &&$scope.dataPasienSelected.ipaddress!=null )
                //     ipAddress = $scope.dataPasienSelected.ipaddress 
                var ruangan = 'RUANG PERAWAT'
                var client = new HttpClient();
                client.get('http://' + ipAddress + ':2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.dataPasienSelected.noantrian +
                    '&namapasien=' + $scope.dataPasienSelected.nocm + ', ' + $scope.dataPasienSelected.namapasien +
                    '&ruangan=' + ruangan + '&ruangPeriksa=' + $scope.dataPasienSelected.namaruangan + '&view=true',
                    function (response) {
                        // $scope.dataPasienSelected.namaruangan 
                        // do something with response
                    });
                toastr.info($scope.dataPasienSelected.nocm + ' - ' + $scope.dataPasienSelected.namapasien, 'Panggil')
                // })
            }
            $scope.panggilRev2 = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih Data dulu')
                    return
                }
                var ipAddress = '127.0.0.1'
                var ruangan = 'RUANG PERAWAT'
                var client = new HttpClient();
                client.get('http://' + ipAddress + ':2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.dataPasienSelected.norec_apd +
                    '&namapasien=' + $scope.dataPasienSelected.nocm + ', ' + $scope.dataPasienSelected.namapasien +
                    '&ruangan=' + ruangan + '&ruangPeriksa=' + $scope.dataPasienSelected.namaruangan + '&view=' + $scope.dataPasienSelected.norec_apd,
                    function (response) {
                        //''
                    });
                // var objSave = {
                //     'norec': nR,
                //     'statusantrian': 1,
                //     'prefixnoantrian': ""


                // }
                // medifirstService.post('rawatjalan/save-daftar-surat',objSave).then(function (e) {
                //     // $scope.tutupSurat();

                // })
                toastr.info($scope.dataPasienSelected.nocm + ' - ' + $scope.dataPasienSelected.namapasien, 'Panggil')
            }

            $scope.TambahSurat = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // $scope.popUpSurat.noRegistrasi =$scope.dataPasienSelected.noregistrasi;
                    // $scope.popUpSurat.tglSurat=moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD HH:mm');
                    // $scope.popUpSurat.pasNorec= $scope.dataPasienSelected.norec_pd;
                    // medifirstService.get("rawatjalan/get-combo-surat").then(function(data) {
                    //     $scope.listSurat = data.data.jenisSurat;
                    //     $scope.listPegawai=data.data.listPegawai;
                    //     $scope.popUpS.center().open();
                    // });


                    cacheHelper.set('noreg', $scope.dataPasienSelected.noregistrasi);
                    cacheHelper.set('nocmfk', $scope.dataPasienSelected.nocmfk);
                    cacheHelper.set('norec_pd', $scope.dataPasienSelected.norec_pd);
                    cacheHelper.set('tgl_regis', $scope.dataPasienSelected.tglregistrasi);
                    $state.go('BuatSuratMediko');



                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }

            }

            $scope.tutupSurat = function () {
                $scope.popUpSurat = {};
                $scope.popUpS.close();

            }

            $scope.saveSurat = function () {

                var nR = ""
                if ($scope.popUpSurat.norec != undefined) {
                    nR = $scope.popUpSurat.norec
                }

                if ($scope.popUpSurat.surat == undefined) {
                    toastr.error('Jenis Surat harus di isi')
                    return
                }

                if ($scope.popUpSurat.dokter == undefined) {
                    toastr.error('Dokter harus di isi')
                    return
                }

                if ($scope.popUpSurat.tglSurat == undefined) {
                    toastr.error('Tanggal surat harus di isi')
                    return
                }



                var objSave = {
                    'norec': nR,
                    'pasiendaftarfk': $scope.popUpSurat.pasNorec,
                    'namapegID': $scope.userID,
                    'dokterID': $scope.popUpSurat.dokter.id,
                    'jenissuratID': $scope.popUpSurat.surat.id,
                    // 'nosurat':$scope.model.skdp,
                    // "namadistribusi": $scope.popUp.namadistribusi,
                    // "penilaianwaktufk": $scope.popUp.penilaian.id,
                    // "pegawaifk": $scope.popUp.namapeg.id,
                    "keterangan": $scope.popUpSurat.ket,
                    "tglsurat": moment($scope.popUpSurat.tglSurat).format('YYYY-MM-DD HH:mm'),


                }
                medifirstService.post('rawatjalan/save-daftar-surat', objSave).then(function (e) {
                    // loadDataSurat();
                    // $scope.currentListMakan=[];
                    // $scope.popUp = {};
                    // $scope.popUp.close();
                    $scope.tutupSurat();

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

            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.showKompleks = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.dataPasienSelected.iskompleks == true)
                    $scope.item.isKompleks = true
                $scope.popUpKompleks.center().open()
            }

            $scope.diagnosa = function () {
                // debugger;
                // $scope.Detail = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                        3: $scope.item.ruangan != undefined ? $scope.item.ruangan.namaruangan : null,
                        4: $scope.item.ruanganMulti,
                        5: $scope.myVar
                    }
                    // var chacePeriode = tglAwal + "~" + tglAkhir + "~" + $scope.item.ruangan.id + "~" + $scope.item.ruangan.namaruangan;
                    cacheHelper.set('DaftarAntrianDokterRajalCtrl', chacePeriode);
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }
                    var arrStr = {
                        0: $scope.dataPasienSelected.nocm,
                        1: $scope.dataPasienSelected.namapasien,
                        2: $scope.dataPasienSelected.jeniskelamin,
                        3: $scope.dataPasienSelected.noregistrasi,
                        4: $scope.dataPasienSelected.umurzz,
                        5: $scope.dataPasienSelected.kelompokpasien,
                        6: $scope.dataPasienSelected.tglregistrasi,
                        7: $scope.dataPasienSelected.norec_apd,
                        8: $scope.dataPasienSelected.norec_pd,
                        9: $scope.dataPasienSelected.idkelas,
                        10: $scope.dataPasienSelected.namakelas,
                        11: $scope.dataPasienSelected.objectruanganfk,
                        12: $scope.dataPasienSelected.namaruangan
                    }
                    cacheHelper.set('InputDiagnosaDokterAllCtrl', arrStr);
                    $state.go('InputDiagnosaDokterAll', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }

                // }
                // if ($scope.dataPasienSelected.nocm == null && $scope.dataPasienSelected.norec_apd == null) {
                //     window.messageContainer.error("Pilih Dahulu Pasien!")
                //     return
                // }
                // var arrStr = {
                //     0: $scope.dataPasienSelected.nocm,
                //     1: $scope.dataPasienSelected.namapasien,
                //     2: $scope.dataPasienSelected.jeniskelamin,
                //     3: $scope.dataPasienSelected.noregistrasi,
                //     4: $scope.dataPasienSelected.umurzz,
                //     5: $scope.dataPasienSelected.kelompokpasien,
                //     6: $scope.dataPasienSelected.tglregistrasi,
                //     7: $scope.dataPasienSelected.norec_apd,
                //     8: $scope.dataPasienSelected.norec_pd,
                //     9: $scope.dataPasienSelected.idkelas,
                //     10: $scope.dataPasienSelected.namakelas,
                //     11: $scope.dataPasienSelected.objectruanganfk,
                //     12: $scope.dataPasienSelected.namaruangan
                // }
                // cacheHelper.set('InputDiagnosaDokterCtrl', arrStr);
                // // $state.go('Rekammedis.InputDiagnosaDokter');
                //  $state.go('Rekammedis.InputDiagnosaDokter', {
                //     noCM: $scope.dataPasienSelected.nocm,
                //     tanggal: moment(new Date($scope.dataPasienSelected.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //     noRec: $scope.dataPasienSelected.norec_apd,
                //     ruangana: $scope.dataPasienSelected.objectruanganfk
                // });
            }
            $scope.saveKompleks = function (komplek) {

                var data = {
                    'nocm': $scope.dataPasienSelected.nocm,
                    'iskompleks': komplek
                }
                medifirstService.post('rawatjalan/save-pasien-kompleks', data).then(function (e) {
                    loadData($scope.item.kondisi)
                    $scope.item.isKompleks = false
                })
            }
            $scope.DaftarRuangan = function () {
                debugger;
                if ($scope.dataPasienSelected === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                    return
                }
                if ($scope.dataPasienSelected.objectruanganfk == 251) {
                    $scope.popUpSx.center().open()
                    $scope.konsul.kelas = $scope.listKelas[4]

                    $scope.cboDokter = false;
                    $scope.cboUbahDokter = false;
                    $scope.cboKonsul = true;
                    $scope.showUbahTanggal = false;
                } else {
                    // debugger;
                    // if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim' && $scope.dataPasienSelected.objectruanganfk != '569' && $scope.dataPasienSelected.objectruanganfk != '251' && $scope.dataPasienSelected.objectruanganfk != '12' && $scope.dataPasienSelected.objectruanganfk != '322') {
                    //     alert('dokumen belum dikirim')
                    //     return;
                    // }

                    debugger;
                    if ($scope.dataPasienSelected.namekendali === undefined) {
                        messageContainer.error("Pilih data terlebih dahulu");
                        return
                    }
                    if ($scope.dataPasienSelected.objectruanganfk != 322 && $scope.dataPasienSelected.objectruanganfk != 569 && $scope.dataPasienSelected.objectruanganfk != 309) {
                        if ($scope.myVar == 0) {
                            alert('Dokumen Belum Diterima Nih... ketahuan nihh yaahh')
                            return;
                        }
                        if ($scope.dataPasienSelected.namekendali == 'Belum Di Kirim') {
                            alert('Dokumen Belum Dikirim')
                            return;
                        }
                        if ($scope.dataPasienSelected.namekendali == 'DIKIRIM') {
                            alert('Terima Dokumen Terlebih Dahulu')
                            return;
                        }
                    }
                    $scope.popUpSx.center().open()
                    $scope.konsul.kelas = $scope.listKelas[4]

                    $scope.cboDokter = false;
                    $scope.cboUbahDokter = false;
                    $scope.cboKonsul = true;
                    $scope.showUbahTanggal = false;
                }
            }

            $scope.pilihRuangan = function (id) {
                debugger;
                $scope.konsul.kelas = "";

                var ruanganId = $scope.konsul.ruangan.id;
                debugger;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        $scope.listKelas = dat.data.kelas;

                    });
            }
            $scope.getKelas = function (ruangan) {
                if (ruangan != undefined && ruangan.namaruangan.indexOf('Bedah') > -1) {
                    $scope.konsul.kelas = { id: $scope.currentRowData.kelasid, namakelas: $scope.currentRowData.namakelas }
                }
            }
            $scope.konsul = function () {
                loadGridKonsul()
                $scope.winKonsul.center().open()
            }

            function loadKonsul() {
                medifirstService.get("rawatjalan/get-order-konsul-count?perawatId=" + medifirstService.getUserLogin().id).then(function (e) {
                    var res = e.data.data
                    // for (var i = res.length - 1; i >= 0; i--) {
                    //     if (res[i].norec_apd != null)
                    //         res.splice([i], 1)
                    // }
                    if (res > 0) {
                        $scope.showNotif = true
                        $scope.lengthKonsul = res
                    } else
                        $scope.showNotif = false

                })
            }

            function loadGridKonsul() {
                medifirstService.get("rawatjalan/get-order-konsul?perawatId=" + medifirstService.getUserLogin().id).then(function (e) {
                    var result = e.data.data
                    if (result.length > 0) {
                        $scope.item.dokterTujuan = result[0].namalengkap
                        var j = 0
                        for (var i = 0; i < result.length; i++) {
                            result[j].no = j + 1
                            if (result[j].statusorder == null) {
                                result[j].status = 'Belum Diverif'
                                j++
                            } else
                                result.splice(j, 1)
                        }
                    }
                    result.length
                    $scope.sourceKonsul = new kendo.data.DataSource({
                        data: result,
                        pageSize: 400,
                    });
                }, (error) => {
                    throw error;
                })
            }
            $scope.konsulOpt = {

                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 40 },
                    { field: "noregistrasi", title: "No Registrasi", width: 100 },
                    { field: "nocm", title: "No RM", width: 80 },
                    { field: "namapasien", title: "Nama ", width: 120 },
                    { field: "tglorder", title: "Tanggal", width: 120 },
                    { field: "ruanganasal", title: "Ruangan Asal", width: 120 },
                    { field: "ruangantujuan", title: "Ruangan Tujuan", width: 150 },
                    { field: "pengonsul", title: "Pengonsul", width: 120 },
                    { field: "keteranganorder", title: "Keterangan", width: 120 },
                    { field: "status", title: "Status", width: 120 },
                    { command: [{ name: "edit", text: "Verifikasi", click: verif }], title: "&nbsp;", width: 120 }
                ],
            };

            $scope.konsulOpt2 = {

                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                columns: [{
                    "field": "statlayanan",
                    "title": "✔",
                    "width": "25px",
                },
                // {
                //     "field":"no",
                //     "field":"noantrian",
                //     "title":"No",
                //     "width":"40px",
                // },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                    "field": "namekendali",
                    "title": "Rekam Medis",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                    "field": "batalkonsul",
                    "title": "Batal Konsul",
                    "width": "90px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setBatalKonsul(dataItem)\"  style=\"margin:0 0 5px\">#:  batalkonsul #</button> ",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "nobpjs",
                    "title": "No BPJS",
                    "width": "80px"
                    
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px"
                    
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "80px"
                    
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px"
                    
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "100px"
                    
                },
                {
                    "field": "statuspasien",
                    "title": "Status",
                    "width": "80px"
                    
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                    
                },
                {
                    "field": "residence",
                    "title": "Dokter Residen",
                    "width": "100px"
                    
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "100px"
                    
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                    
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px"
                    
                },
                {
                    "field": "nosep",
                    "title": "No SEP",
                    "width": "130px",
                    attributes: {
                        class: "#=nosep == '' || nosep == null ? 'gaada' : 'ijo' #"
                    }
                },
                {
                    "field": "stts",
                    "title": "Panggil",
                    "width": "80px"
                },
                {
                    "field": "isonline",
                    "title": "Status",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px"
                },
                {
                    "field": "statuslayanan",
                    "title": "Status Periksa",
                    "width": "80px"
                },
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            };

            function verif(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status == 'Selesai') {
                    toastr.error('Sudah di verifkasi')
                    return
                }

                var length = $scope.sourceKonsul._data.length + 1;
                var dataKonsul = {
                    "kelasfk": 6,
                    "noantrian": length,
                    "norec_so": dataItem.norec,
                    "norec_pd": dataItem.norec_pd,
                    "dokterfk": dataItem.pegawaifk,
                    "objectruangantujuanfk": dataItem.objectruangantujuanfk,
                    "objectruanganasalfk": dataItem.objectruanganfk
                }
                medifirstService.post('rawatjalan/save-konsul-from-order', dataKonsul).then(function (e) {
                    loadGridKonsul()
                    loadData($scope.item.kondisi);
                    loadKonsul()
                    $scope.saveLogKonsul();


                })

            }
            //#save Log Konsul
            $scope.saveLogKonsul = function () {
                medifirstService.get("sysadmin/logging/save-log-konsul?norec_pd=" +
                    $scope.item.norec_pd +
                    "&dokterfk=" +
                    $scope.konsul.namaDokter.id +
                    "&kelasfk=" +
                    6 +
                    "&objectruangantujuanfk=" +
                    $scope.konsul.ruangan.id).then(function (data) { })
            }

            $scope.InsidenInternal = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec_pd,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'InputInsidenInternal'
                });
            }

            $scope.KedokteranForensik = function () {
                debugger
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Data Dahulu !');
                    return;
                }
                $scope.popUpKedokteranForensik.center().open();
            }
            $scope.saveKedokteranForensik = function () {
                debugger;
                // if ($scope.model == undefined) {
                //     toastr.error('Forensik Belum Diceklis')
                //     return;
                // }
                var isKedokteranForensik = ""
                if ($scope.model.kedokteranforensik == undefined)
                    isKedokteranForensik = "false"
                else if ($scope.model.kedokteranforensik)
                    isKedokteranForensik = "true"
                else
                    isKedokteranForensik = "false"

                var saveKedokteranForensik = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    iskedokteranforensik: isKedokteranForensik
                }
                medifirstService.post('tatarekening/save-update-kedokteran-forensik', saveKedokteranForensik).then(function (e) {

                })
                $scope.popUpKedokteranForensik.close();

                // loadData($scope.item.kondisi)
            }
            // $scope.cetakBadanSehat = function () {
            //     debugger;
            //     if ($scope.dataPasienSelected.norec_pd != '') {
            //         var local = JSON.parse(localStorage.getItem('profile'))
            //             if (local != null) {
            //                 var profile = local.id;
            //         window.open(config.baseApiBackend + "report/cetak-badan-sehat?norec=" + $scope.dataPasienSelected.norec_pd + '&kdprofile=' + profile
            //             + '&jenis=his', '_blank');
            //             }
            //     }



            // }
            function loadBPM1() {
                medifirstService.get('laboratorium/get-hasil-penyakit-menular?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                    } else {
                        $scope.norecBPM = ''
                    }
                })
            }

            function loadBPM2() {
                medifirstService.get('laboratorium/get-hasil-badan-sehat?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                    } else {
                        $scope.norecBPM = ''
                    }
                })
            }

            function loadBPM3() {
                medifirstService.get('laboratorium/get-hasil-tidak-hamil?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                    } else {
                        $scope.norecBPM = ''
                    }
                })
            }

            function loadBPM4() {
                medifirstService.get('laboratorium/get-hasil-bebas-HIV?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                    } else {
                        $scope.norecBPM = ''
                    }
                })
            }

            function loadBPM5() {
                medifirstService.get('laboratorium/get-hasil-kesehatan-jiwa?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                    } else {
                        $scope.norecBPM = ''
                    }
                })
            }

            function loadBPM6() {
                medifirstService.get('laboratorium/get-hasil-bebas-narkoba?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                        $scope.isSelesaiPeriksa = true
                    } else {
                        $scope.norecBPM = ''
                        $scope.isSelesaiPeriksa = false
                    }
                })
            }

            function loadBPM7() {
                medifirstService.get('laboratorium/get-hasil-bebas-narkoba-v2?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.norecBPM = dat.data[0].norec
                        $scope.savebebasnarkoba2 = true
                    } else {
                        $scope.norecBPM = ''
                        $scope.savebebasnarkoba2 = false
                    }
                })
            }
            $scope.BadanSehat = function () {
                $scope.norecBPM = ''
                medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                    debugger;
                    $scope.listDokterMCU = dat.data
                });
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return;
                }
                // $scope.popUpBadanSehat.center().open();
                medifirstService.get('laboratorium/get-hasil-badan-sehat?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        let tes = dat.data[0]
                        //  $scope.norecBPM = tes.norec,
                        //  $scope.item.persyaratan = tes.persyaratan,
                        //  $scope.item.tinggibadan = tes.tinggibadan,
                        //  $scope.item.beratbadan = tes.beratbadan,
                        //  $scope
                        //  $scope.item.doktermcu =  { DokterPemeriksa: tes.namalengkap, id:tes.id }
                        $scope.popUpBadanSehat.center().open();
                    } else {
                        $scope.popUpBadanSehat.center().open();
                    }
                    medifirstService.get('laboratorium/get-emr?noregistrasi=' + $scope.dataPasienSelected.noregistrasi).then(function (dat) {
                        debugger;
                        if (dat.data.length > 0) {
                            for (var i = 0; i < dat.data.length; i++) {
                                if (dat.data[i].emrdfk == 4242) {
                                    $scope.item.tinggibadan = dat.data[i].value
                                }
                            }
                            for (var i = 0; i < dat.data.length; i++) {
                                if (dat.data[i].emrdfk == 4243) {
                                    $scope.item.beratbadan = dat.data[i].value
                                }
                            }
                            for (var i = 0; i < dat.data.length; i++) {
                                if (dat.data[i].emrdfk == 4241) {
                                    $scope.item.tensidarah = dat.data[i].value
                                }
                            }
                            for (var i = 0; i < dat.data.length; i++) {
                                if (dat.data[i].emrdfk == 4244) {
                                    $scope.item.suhutubuh = dat.data[i].value
                                    $scope.popUpBadanSehat.center().open();
                                }
                            }
                        } else {
                            $scope.item.tinggibadan = ''
                            $scope.item.beratbadan = ''
                            $scope.item.tensidarah = ''
                            $scope.item.suhutubuh = ''
                        }
                    });

                })
            }
            $scope.saveBadanSehat = function () {
                debugger;
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    tinggibadan: $scope.item.tinggibadan,
                    beratbadan: $scope.item.beratbadan,
                    tensidarah: $scope.item.tensidarah,
                    suhutubuh: $scope.item.suhutubuh,
                    pegawaifk: $scope.item.doktermcu.id,
                    persyaratan: $scope.item.persyaratan,
                    norec: $scope.norecBPM
                }
                medifirstService.post('laboratorium/save-hasil-badan-sehat', objSave).then(function (e) { })
                loadBPM2()
            }
            $scope.cetakBadanSehat = function () {
                debugger;
                if ($scope.norecBPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-badan-sehat?norec=" + $scope.norecBPM + '&kdprofile=' + profile +
                            '&jenis=his' + '&noSurat=' + $scope.item.noSurat, '_blank');
                    }
                }
            }
            // for (i = 1; i <= 5; ++i) {
            //     setDelay(i);
            //   }

            //   function setDelay() {
            //     setTimeout(function(){
            //     //   console.log();
            //     }, 10);
            //   }
            $scope.BebasNarkoba = function () {
                debugger
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                }
                medifirstService.post('laboratorium/save-hasil-bebas-narkoba', objSave).then(function (e) {

                })
                debugger

                loadBPM6()
                // $scope.savebebasnarkoba = true
                // $scope.cetakbebasnarkoba = true;

                // if ($scope.dataPasienSelected.norec_pd != ''){
                //     var local = JSON.parse(localStorage.getItem('profile'))
                //         if(local != null) {
                //             var profile = local.id;
                //             window.open(config.baseApiBackend + "report/cetak-bebas-narkoba?norec=" + $scope.dataPasienSelected.norec_pd + '&kdprofile=' + profile
                //             + '&jenis=his', '_blank');
                //         }
                // }
            }
            $scope.BebasNarkoba2 = function () {
                if ($scope.dataPasienSelected.norec_pd != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-narkoba?norec=" + $scope.dataPasienSelected.norec_pd + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');

                        $scope.isSelesaiPeriksa = false;
                    }
                }
            }
            $scope.KesehatanJiwa = function () {
                $scope.norecBPM = ''
                medifirstService.get("rawatjalan/get-dokter-kesehatan-jiwa").then(function (dat) {
                    debugger;
                    $scope.listDokterPemeriksa = dat.data
                });
                if ($scope.dataPasienSelected.norec_pd == undefined) {
                    toastr.info('Pilih Data Dulu !')
                    return;
                }
                medifirstService.get('laboratorium/get-hasil-kesehatan-jiwa?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        let tes = dat.data[0]
                        //  $scope.norecBPM = tes.norec,
                        //  $scope.item.persyaratan = tes.persyaratan,
                        //  $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: tes.namalengkap, id:tes.id}
                        $scope.popUpKesehatanJiwa.center().open();
                    } else {
                        $scope.popUpKesehatanJiwa.center().open();
                    }
                })


                // $scope.popUpKesehatanJiwa.center().open();

            }
            $scope.saveKesehatanJiwa = function () {
                debugger;
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    pegawaifk: $scope.item.DokterPemeriksa.id,
                    persyaratan: $scope.item.persyaratan2,
                    norec: $scope.norecBPM
                }
                medifirstService.post('laboratorium/save-hasil-kesehatan-jiwa', objSave).then(function (e) {

                })
                loadBPM5()
            }
            $scope.cetakKesehatanJiwa = function () {
                debugger
                if ($scope.norecBPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-kesehatan-jiwa?norec=" + $scope.norecBPM + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            $scope.BebasNarkobav2Save = function () {
                debugger
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                }
                medifirstService.post('laboratorium/save-hasil-bebas-narkoba-v2', objSave).then(function (e) {

                })
                debugger

                loadBPM7()
            }
            $scope.BebasNarkobav2 = function () {
                debugger
                if ($scope.dataPasienSelected.norec_pd != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-narkobav2?norec=" + $scope.dataPasienSelected.norec_pd + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            $scope.BebasPenyakitMenular = function () {
                $scope.norecBPM = ''
                medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                    debugger;
                    $scope.listDokterPemeriksa = dat.data
                });
                if ($scope.dataPasienSelected.norec_pd == undefined) {
                    toastr.info('Pilih Data Dulu !')
                    return;
                }
                medifirstService.get('laboratorium/get-hasil-penyakit-menular?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        let tes = dat.data[0]
                        // $scope.norecBPM = tes.norec,
                        // $scope.item.persyaratan3 = tes.persyaratan,
                        // $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: tes.namalengkap, id:tes.id}
                        $scope.popUpPenyakitMenular.center().open();
                    } else {
                        $scope.popUpPenyakitMenular.center().open();
                    }
                })




            }
            $scope.savePenyakitMenular = function () {
                debugger;
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    pegawaifk: $scope.item.DokterPemeriksa2.id,
                    persyaratan: $scope.item.persyaratan3,
                    norec: $scope.norecBPM
                }
                medifirstService.post('laboratorium/save-hasil-penyakit-menular', objSave).then(function (e) {

                })
                loadBPM1()
            }
            $scope.cetakPenyakitMenular = function () {
                debugger
                if ($scope.norecBPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-penyakit-menular?norec=" + $scope.norecBPM + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            $scope.BebasHIV = function () {
                $scope.norecBPM = ''
                medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                    debugger;
                    $scope.listDokterPemeriksa = dat.data
                });
                if ($scope.dataPasienSelected.norec_pd == undefined) {
                    toastr.info('Pilih Data Dulu !')
                    return;
                }
                medifirstService.get('laboratorium/get-hasil-bebas-HIV?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        let tes = dat.data[0]
                        // $scope.norecBPM = tes.norec,
                        // $scope.item.persyaratan3 = tes.persyaratan,
                        // $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: tes.namalengkap, id:tes.id}
                        $scope.popUpBebasHIV.center().open();
                    } else {
                        $scope.popUpBebasHIV.center().open();
                    }
                })




            }
            $scope.saveBebasHIV = function () {
                debugger;
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    pegawaifk: $scope.item.DokterPemeriksa2.id,
                    persyaratan: $scope.item.persyaratan3,
                    norec: $scope.norecBPM
                }
                medifirstService.post('laboratorium/save-hasil-bebas-HIV', objSave).then(function (e) {

                })
                loadBPM4()
            }
            $scope.cetakBebasHIV = function () {
                debugger
                if ($scope.norecBPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-HIV?norec=" + $scope.norecBPM + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            // $scope.TidakHamil = function () {
            //     if ($scope.dataPasienSelected.norec_pd == undefined) {
            //         toastr.error('Pilih Data Dulu !')
            //         return;
            //     }
            //     $scope.popUpTidakHamil.close().open();
            // }
            $scope.TidakHamil = function () {
                $scope.norecBPM = ''
                medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                    debugger;
                    $scope.listDokterPemeriksa = dat.data
                });
                if ($scope.dataPasienSelected.norec_pd == undefined) {
                    toastr.info('Pilih Data Dulu !')
                    return;
                }
                medifirstService.get('laboratorium/get-hasil-tidak-hamil?norec_pd=' + $scope.dataPasienSelected.norec_pd).then(function (dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        let tes = dat.data[0]
                        // $scope.norecBPM = tes.norec,
                        // $scope.item.persyaratan3 = tes.persyaratan,
                        // $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: tes.namalengkap, id:tes.id}
                        $scope.popUpTidakHamil.center().open();
                    } else {
                        $scope.popUpTidakHamil.center().open();
                    }
                })




            }
            $scope.saveTidakHamil = function () {
                debugger;
                var objSave = {
                    norec_pd: $scope.dataPasienSelected.norec_pd,
                    pegawaifk: $scope.item.DokterPemeriksa2.id,
                    persyaratan: $scope.item.persyaratan3,
                    norec: $scope.norecBPM
                }
                medifirstService.post('laboratorium/save-hasil-tidak-hamil', objSave).then(function (e) {

                })
                loadBPM3()
            }
            $scope.cetakTidakHamil = function () {
                debugger
                if ($scope.norecBPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-hasil-tidak-hamil?norec=" + $scope.norecBPM + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            //-------------
        }
    ]);
});