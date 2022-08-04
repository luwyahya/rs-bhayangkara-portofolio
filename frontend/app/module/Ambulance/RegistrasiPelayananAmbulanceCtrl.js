define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPelayananAmbulanceCtrl', ['MedifirstService', '$scope', '$state', '$mdDialog', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem',
        function(medifirstService, $scope, $state, $mdDialog, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem) {
            $scope.now = new Date();
            $scope.dataItem = {};
            $scope.currentNoCm = $state.params.noCm;
            $scope.currentNorec = $state.params.noRec;
            var norecPD = '';
            var noRegistrasis = '';
            var norecAPD = '';
            var isRegisOnline = '';
            var NomorRm = '';
            $scope.isTelemedicine = 'false';
            $scope.isSimpanAsuransi = true;
            $scope.isNext = true;
            $scope.item = {};
            $scope.item.tglRegistrasi = $scope.now;
            $scope.item.tglMeninggal = $scope.now;
            $scope.item.tglpulang = $scope.now;
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            $scope.model.tglPelayanan = $scope.now;
            var datas = [];
            var chacePenunjang = cacheHelper.get('isJenazah');
            if (chacePenunjang != undefined) {
                $scope.isPenunjang = chacePenunjang
                var listruangan = [{ id: "72", namaruangan: "Ambulance", objectdepartemenfk: "31" }]
                $scope.listRuangan = listruangan
            }
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.dataUser = medifirstService.getUserLogin();



            GetCombo();

            function cekPsnDaftarThisMonth(nocm) {
                medifirstService.get('registrasi/get-pasien-pernah-daftar/' + nocm).then(function(e) {
                    if (e.data.jml > 0) {
                        var jml = e.data.jml + 1
                        toastr.info('Kunjungan ke- ' + jml + ' Di Bulan yang sama ! ', 'Peringatan', {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": false,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": false,
                            "onclick": null,
                            "showDuration": "300",
                            "hideDuration": "0",
                            "timeOut": "0",
                            "extendedTimeOut": "0",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",

                        });

                    }
                })
            }

            function GetCombo() {
                medifirstService.get('registrasi/daftar-antrian-pasien/get-combo').then(function(e) {
                    $scope.listJenisDiagnosa = e.data.jenisdiagnosa
                })

                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function(e) {
                    $scope.listDataPegawai = e;
                });

                medifirstService.getPart("registrasi/daftar-antrian-pasien/get-diagnosa", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                });
            }

            medifirstService.get("registrasi/get-pasienbynocm?noCm=" + $scope.currentNoCm)
                .then(function(e) {
                    $scope.isRouteLoading = false;
                    $scope.item.pasien = e.data.data[0];
                    $scope.item.nocmfk = e.data.data[0].nocmfk;

                    if (e.data.data[0].foto == null)
                        $scope.item.pasien.foto = "../app/images/avatar.jpg"

                    var now = new Date();
                    var umur = dateHelper.CountAge(new Date($scope.item.pasien.tgllahir), now);
                    $scope.item.pasien.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                    $scope.item.pasien.tgllahir = moment(new Date(e.data.data[0].tgllahir)).format('DD-MM-YYYY');
                    var parameterBayi = $scope.item.pasien.namapasien;
                    if (parameterBayi.indexOf('By Ny') >= 0) {
                        $scope.item.tglRegistrasi = new Date($scope.item.pasien.tgllahir);

                        $scope.model.rawatInap = true;

                    }



                });
            loadPertama();
            medifirstService.getPart('registrasi/get-dokter-part', true, 10).then(function(e) {
                $scope.listDokter = e;
            })

            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function(dat) {
                    $scope.listJenisPelayanan = dat.data.jenispelayanan;
                    $scope.item.jenisPasien = $scope.listJenisPelayanan[0];
                    $scope.listAsalRujukan = dat.data.asalrujukan;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    if (!$scope.isPenunjang)
                        $scope.listRuangan = dat.data.ruanganrajal;
                    $scope.listRuanganRajal = dat.data.ruanganrajal;
                    $scope.listRuanganRanap = dat.data.ruanganranap;
                    $scope.listjaminanKhusus = dat.data.jaminankhusus;
                    $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                    $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                    $scope.sourceKelasDitanggung = dat.data.kelas;
                    $scope.sourceAsalRujukan = dat.data.asalrujukan;
                    $scope.model.namaPenjamin = { id: dat.data.kelompokpasien[1].id, kelompokpasien: dat.data.kelompokpasien[1].kelompokpasien }
                    $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                    $scope.model.asalRujukan = { id: dat.data.asalrujukan[3].id, asalrujukan: dat.data.asalrujukan[3].asalrujukan }
                    if ($scope.model.rawatInap == true)
                        $scope.cekRawatInap($scope.model.rawatInap);



                });

            function loadPertama() {
                $scope.nocmIgd = cacheHelper.get('CacheRegisTriage')
                var cacheRegisOnline = cacheHelper.get('CacheRegisOnline');
                if (cacheRegisOnline != undefined) {
                    // //debugger;
                    var arrOnline = cacheRegisOnline[0];
                    if (arrOnline.kelompokpasien == 'Telemedicine') {
                        $scope.item.tglRegistrasi = arrOnline.tanggalreservasi;
                        $scope.isTelemedicine = 'true';
                    } else {
                        $scope.item.tglRegistrasi = $scope.now;
                        $scope.isTelemedicine = 'false';
                    }
                    //$scope.item.tglRegistrasi = $scope.now;//arrOnline.tanggalreservasi,
                    $scope.item.ruangan = {
                        id: arrOnline.objectruanganfk,
                        namaruangan: arrOnline.namaruangan
                    }
                    $scope.item.kelompokPasien = {
                        id: arrOnline.objectkelompokpasienfk,
                        kelompokpasien: arrOnline.kelompokpasien,
                    }
                    $scope.item.dokter = { id: arrOnline.objectpegawaifk, namalengkap: arrOnline.dokter }
                    isRegisOnline = arrOnline.noreservasi


                }
                cacheHelper.set('CacheRegisOnline', undefined);

                var cacheOnlineBaru = cacheHelper.get('CacheRegisOnlineBaru');
                if (cacheOnlineBaru != undefined) {
                    // //debugger;
                    isRegisOnline = cacheOnlineBaru[1]
                    $scope.item.ruangan = {
                        id: cacheOnlineBaru[2].objectruanganfk,
                        namaruangan: cacheOnlineBaru[2].ruangantujuan,
                    }
                    $scope.item.kelompokPasien = {
                        id: cacheOnlineBaru[2].objectkelompokpasienfk,
                        kelompokpasien: cacheOnlineBaru[2].kelompokpasien,
                    }

                }
                cacheHelper.set('CacheRegisOnlineBaru', undefined);
                if ($scope.nocmIgd != undefined) {

                }
                norecPD = ''
                var cachePasienDaftar = cacheHelper.get('CacheRegistrasiPasien');
                if (cachePasienDaftar != undefined) {
                    var arrPasienDaftar = cachePasienDaftar.split('~');
                    $scope.item.IsEdit = true;
                    norecPD = arrPasienDaftar[0];
                    noRegistrasis = arrPasienDaftar[1];
                    norecAPD = arrPasienDaftar[2];
                    $scope.cacheNorecPD = norecPD;
                    $scope.cacheNorecAPD = norecAPD;
                    $scope.cacheNoRegistrasi = noRegistrasis;
                    //jika cache ada get riwayat pasien
                    getPasienByNorecPD();

                }
                $scope.isRouteLoading = true;

                var tglReg = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD');
                medifirstService.get("registrasi/cek-pasien-daftar-duakali?nocm=" +
                        $scope.currentNoCm +
                        "&tglregistrasi=" +
                        tglReg)
                    .then(function(res) {
                        $scope.CekPasienDaftar = res.data.data;
                    })


            };
            if (norecPD == '') {
                cekPsnDaftarThisMonth($scope.currentNoCm)
            }

            function getPasienByNorecPD() {
                medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + norecPD + "&norecAPD=" + norecAPD)
                    .then(function(his) {

                        if (his.data.data[0].israwatinap == 'true') {
                            $scope.model.rawatInap = true;
                            $scope.cekRawatInap($scope.model.rawatInap);
                            $scope.pasienBayi = true;
                        }
                        $scope.item.tglRegistrasi = new Date(his.data.data[0].tglregistrasi),
                            $scope.item.ruangan = {
                                id: his.data.data[0].objectruanganlastfk,
                                namaruangan: his.data.data[0].namaruangan,
                                objectdepartemenfk: his.data.data[0].objectdepartemenfk
                            }
                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        var dateNow = new Date();
                        var dateRegis = new Date($scope.item.tglRegistrasi);
                        var diffDays = Math.round(Math.abs((dateNow.getTime() - dateRegis.getTime()) / (oneDay)))
                        if (diffDays >= 1) {
                            $scope.disableTgl = true
                        }
                        $scope.resultEdit = his.data.data[0]
                            // ruanganLog = his.data.data[0].namaruangan
                        $scope.item.kelas = { id: his.data.data[0].objectkelasfk, namakelas: his.data.data[0].namakelas }
                        $scope.listKamar = ([{ id: his.data.data[0].objectkamarfk, namakamar: his.data.data[0].namakamar }])
                        $scope.item.kamar = { id: his.data.data[0].objectkamarfk, namakamar: his.data.data[0].namakamar }
                        $scope.listNoBed = ([{ id: his.data.data[0].objecttempattidurfk, reportdisplay: his.data.data[0].reportdisplay }])
                        $scope.item.nomorTempatTidur = { id: his.data.data[0].objecttempattidurfk, reportdisplay: his.data.data[0].reportdisplay }
                        $scope.item.asalRujukan = { id: his.data.data[0].objectasalrujukanfk, asalrujukan: his.data.data[0].asalrujukan }
                        $scope.item.kelompokPasien = { id: his.data.data[0].objectkelompokpasienlastfk, kelompokpasien: his.data.data[0].kelompokpasien }
                        $scope.item.rekanan = { id: his.data.data[0].objectrekananfk, namarekanan: his.data.data[0].namarekanan }
                        $scope.item.dokter = { id: his.data.data[0].objectpegawaifk, namalengkap: his.data.data[0].dokter }
                        isRegisOnline = his.data.data[0].statusschedule
                        if (!$scope.isPenunjang) {
                            $scope.isInputAsuransi = true;
                            $scope.isNext = false;
                            $scope.isBatal = true;
                            $scope.isReport = true;
                            $scope.isReportPendaftaran = true;
                            if ($scope.model.rawatInap == true) {
                                $scope.isReportRawatInap = true;
                            } else {
                                $scope.isReportIgd = true;
                            }

                            $scope.isAsuransi = true;
                        } else {
                            $scope.isBatal = true;
                            $scope.isSelesaiSimpan = true
                        }

                    });
            }
            $scope.cekRawatInap = function(data) {
                if (data === true) {

                    if (norecPD == '') {
                        delete $scope.item.ruangan;
                    }

                    $scope.listRuangan = []
                    $scope.listRuangan = $scope.listRuanganRanap

                } else if (data === false || data === undefined) {

                    if (norecPD == '') {
                        delete $scope.item.ruangan;
                    }

                    $scope.listRuangan = []
                    $scope.listRuangan = $scope.listRuanganRajal;
                    $scope.item.kelas = undefined;
                    $scope.item.nomorTempatTidur = undefined;
                    $scope.item.kamar = undefined;

                } else {
                    return;
                }
            }
            $scope.$watch('model.rawatInap', function(data) {
                if (!data) return;
                $scope.cekRawatInap(data);
            })

            $scope.pilihRuangan = function(id) {
                // get ruangan with condition (rawat jalan or rawat inap)
                if ($scope.model.rawatInap === true) {
                    var ruanganId = id;
                    medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                        .then(function(dat) {
                            $scope.listKelas = dat.data.kelas;

                        });
                }
            }
            $scope.$watch('item.kelas', function(e) {
                if (e === undefined) return;
                if (!$scope.item.kelas && !$scope.item.ruangan) return;
                var kelasId = "idKelas=" + $scope.item.kelas.id;
                var ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                medifirstService.get("registrasi/get-kamarbyruangankelas?" + kelasId + ruanganId)
                    .then(function(b) {

                        if ($scope.model.rawatGabung) {
                            $scope.listKamar = b.data.kamar;
                        } else {
                            $scope.listKamar = _.filter(b.data.kamar, function(v) {
                                return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                            })
                        }
                    });
            });
            $scope.$watch('item.kamar', function(e) {
                if (e === undefined) return;
                if (e.id == null) return;
                // if (!$scope.item.kamar && $scope.item.kamar.id == null) return
                var kamarId = $scope.item.kamar.id;
                medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function(a) {
                        if ($scope.model.rawatGabung) {
                            $scope.listNoBed = a.data.bed;
                        } else {
                            $scope.listNoBed = _.filter(a.data.bed, function(v) {
                                return v.statusbed === "KOSONG";
                            })
                        }
                    })
            });



            $scope.$watch('item.kelompokPasien', function(e) {
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function(z) {
                        $scope.listRekanan = z.data.rekanan;
                        if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.item.rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
                        } else if (e.kelompokpasien.indexOf('BPJS') > -1) {
                            $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        } else if (e.kelompokpasien == 'Jamkesda') {
                            $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        } else if (e.kelompokpasien == 'Non Kuota') {
                            $scope.item.rekanan = undefined
                                // $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        } else if (e.kelompokpasien == 'Telemedicine') {
                            $scope.item.rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
                            $scope.isTelemedicine = 'true';

                        } else {
                            $scope.nonUmum = true;
                            // $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.item.jenisPasien = {
                                id: $scope.listJenisPelayanan[1].id,
                                jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan
                            }


                        }
                        if ($scope.resultEdit != undefined)

                            $scope.item.jenisPasien = {
                            id: parseInt($scope.resultEdit.objectjenispelayananfk),
                            jenispelayanan: $scope.resultEdit.jenispelayanan
                        }


                    })
            });



            $scope.noCm = $state.params.noCm;
            $scope.cekRawatGabung = function(data) {
                // opsi untuk pasien bayi
                // apakah pasien bayi satu ruangan dengan ibunya (true/false) ?
                $scope.model.rawatGabung = data;
            }
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            };

            $scope.pegawai = medifirstService.getPegawaiLogin();

            $scope.listPasien = [];
            $scope.doneLoad = $rootScope.doneLoad;
            $scope.showFind = true;
            $scope.showTindakan = false;
            $scope.dataModelGrid = [];
            $scope.item.kp = 1
            $scope.Save = function() {
                $scope.popUpKasusPenyakit.center().open()
            }
            $scope.Savee = function() {
                if (norecPD == '') {
                    if ($scope.item.kelompokPasien && $scope.item.kelompokPasien.id == 1 && $scope.item.ruangan.namaruangan.indexOf('Eksekutif') <= 0) {
                        medifirstService.get("registrasi/cek-pasien-bayar/" +
                            $scope.noCm).then(function(x) {
                            if (x.data.status == false) { //&& moment(x.data.tglregistrasi).format('YYYY-MM-DD') != moment($scope.now).format('YYYY-MM-DD')){

                                if (x.data.data.length > 0) {
                                    var listNoReg = ""
                                    for (var i = x.data.data.length - 1; i >= 0; i--) {
                                        var a = ""
                                        var b = ""
                                        var c = x.data.data[i].noregistrasi
                                        b = "," + c
                                        a = a + b
                                    }
                                    listNoReg = a.slice(1, a.length)
                                }

                                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Peringatan, Pasien belum bayar pada Noregistrasi ( ' + listNoReg + ' )!' + '\n' + 'Apakah anda tetap akan menlanjutkan pendaftaran pasien?')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function() {
                                    $scope.lanjutDaftar();
                                })

                            } else {
                                $scope.lanjutDaftar()
                            }
                        })
                    } else if ($scope.item.kelompokPasien && $scope.item.kelompokPasien.id != 1 && $scope.item.ruangan.namaruangan.indexOf('Eksekutif') <= 0) {
                        medifirstService.get("registrasi/cek-piutang-pasien/" +
                            $scope.noCm).then(function(x) {
                            if (x.data.status == false) {
                                if (x.data.data.length > 0) {
                                    var listNoReg = ""
                                    for (var i = x.data.data.length - 1; i >= 0; i--) {
                                        var a = ""
                                        var b = ""
                                        var c = x.data.data[i].noregistrasi
                                        b = "," + c
                                        a = a + b
                                    }
                                    listNoReg = a.slice(1, a.length)
                                }

                                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Peringatan, Pasien masih memilik piutang pada Noregistrasi ( ' + listNoReg + ' )!' + '\n' + 'Apakah anda tetap akan menlanjutkan pendaftaran pasien?')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function() {
                                    $scope.lanjutDaftar();
                                })

                            } else {
                                $scope.lanjutDaftar()
                            }
                        })
                    } else {
                        $scope.lanjutDaftar()
                    }
                } else {
                    $scope.lanjutDaftar()
                }

            }
            $scope.lanjutDaftar = function() {
                if (norecPD == '') {
                    // if ($scope.CekPasienDaftar.length > 0 && $scope.CekPasienDaftar[0].objectruanganlastfk == $scope.item.ruangan.id && $scope.item.ruangan.objectdepartemenfk != '24') {
                    if ($scope.CekPasienDaftar.length > 0 && $scope.item.kelompokPasien.id != 2 && $scope.item.ruangan.objectdepartemenfk != '24') {
                        // toastr.error("Pasien Tidak Bisa Daftar Dipoli yang sama!");
                        // return;
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Pasien Sudah Daftar Dipoli Lain ! Lanjut Simpan? ')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function() {
                            $scope.SimpanRegistrasi();
                        })

                    } else if ($scope.item.kelompokPasien.id == 2) {
                        var tglRegis = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD')
                        medifirstService.get("registrasi/cek-pasien-bpjs-daftar?nocm=" +
                            $scope.noCm +
                            "&tglRegis=" + tglRegis).then(function(x) {
                            if (x.data.data.length > 0) {
                                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Pasien BPJS ini Sudah Daftar di poli lain ! Lanjut Simpan? ')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function() {
                                    $scope.SimpanRegistrasi();
                                })
                            } else {
                                $scope.SimpanRegistrasi();
                            }
                        })
                    } else {
                        $scope.SimpanRegistrasi();
                    }



                } else
                    $scope.SimpanRegistrasi();

            }

            $scope.SimpanRegistrasi = function() {


                var kelasId = "";
                if ($scope.item.kelas == undefined || $scope.item.kelas == "") {
                    kelasId = null;
                } else
                    kelasId = $scope.item.kelas.id;

                var rekananId = "";
                if ($scope.item.rekanan == undefined || $scope.item.rekanan == "") {
                    rekananId = null;
                } else
                    rekananId = $scope.item.rekanan.id;

                var dokterId = "";
                if ($scope.item.dokter == undefined || $scope.item.dokter == "") {
                    dokterId = null;
                } else
                    dokterId = $scope.item.dokter.id;

                var kamarIds = "";
                if ($scope.item.kamar == undefined || $scope.item.kamar == "") {
                    kamarIds = null;
                } else
                    kamarIds = $scope.item.kamar.id;


                var nomorTempatTidurs = "";
                if ($scope.item.nomorTempatTidur == undefined || $scope.item.nomorTempatTidur == "") {
                    if ($scope.model.rawatInap != undefined) {
                        messageContainer.error("Nomor Tempat Tidur Harus Di isi / Bed Penuh")
                        return
                    } else {
                        nomorTempatTidurs = null;
                    }
                } else if ($scope.model.rawatGabung == true) {
                    nomorTempatTidurs = null;
                } else
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;

                var noRegistrasi = "";
                if ($scope.model.noRegistrasi == undefined || $scope.model.noRegistrasi == "") {
                    noRegistrasi = "";
                } else
                    noRegistrasi = $scope.model.noRegistrasi;

                var norec_PasienDaftar = "";
                if ($scope.model.norec_pd != undefined) {
                    norec_PasienDaftar = $scope.model.norec_pd;
                } else if ($scope.cacheNorecPD != undefined) {
                    norec_PasienDaftar = $scope.cacheNorecPD;
                } else
                    norec_PasienDaftar = "";


                var norec_Antrian = "";
                if ($scope.cacheNorecAPD != undefined) {
                    norec_Antrian = $scope.cacheNorecAPD;
                } else if ($scope.resultAPD != undefined) {
                    norec_Antrian = $scope.resultAPD.norec;
                } else norec_Antrian = "";

                var jenisPel = "";
                if ($scope.item.jenisPasien != undefined)
                    jenisPel = $scope.item.jenisPasien.id
                else {
                    messageContainer.error("Jenis Pelayanan Harus Di isi")
                    return
                }
                var isRawatInap = ""
                if ($scope.model.rawatInap == undefined)
                    isRawatInap = "false"
                else if ($scope.model.rawatInap)
                    isRawatInap = "true"
                else
                    isRawatInap = "false"

                var jaminankhusus = "";
                if ($scope.item.jaminankhusus == undefined || $scope.item.jaminankhusus == "") {
                    jaminankhusus = null
                } else
                    jaminankhusus = $scope.item.jaminankhusus.id

                var catatan = "";
                if ($scope.item.catatan == undefined || $scope.item.catatan == "") {
                    catatan = null
                } else
                    catatan = $scope.item.catatan

                var noRegistrasizz = ""
                if ($scope.cacheNoRegistrasi != undefined) {
                    noRegistrasizz = $scope.cacheNoRegistrasi
                }

                var statusPasien = ''
                var cacheBaruLama = cacheHelper.get('cacheStatusPasien')
                if (cacheBaruLama != undefined) {
                    statusPasien = cacheBaruLama
                }
                var pasiendaftar = {
                    tglregistrasi: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    tglregistrasidate: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                    tglmeninggal: moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss'),
                    tglpulang: moment($scope.item.tglPulang).format('YYYY-MM-DD HH:mm:ss'),
                    nocmfk: $scope.item.nocmfk,
                    objectruanganfk: $scope.item.ruangan.id,
                    objectdepartemenfk: $scope.item.ruangan.objectdepartemenfk,
                    objectkelasfk: kelasId,
                    objectkelompokpasienlastfk: $scope.item.kelompokPasien.id,
                    objectrekananfk: rekananId,
                    tipelayanan: jenisPel,
                    objectpegawaifk: dokterId,
                    noregistrasi: noRegistrasizz,
                    norec_pd: norec_PasienDaftar,
                    israwatinap: isRawatInap,
                    statusschedule: isRegisOnline,
                    statuspasien: statusPasien,
                    istelemedicine: $scope.isTelemedicine,
                    jaminankhusus: jaminankhusus,
                    catatan: catatan,
                    objectstatuskeluarfk: '5',
                    objectstatuspulangfk: '9',
                    objectkasuspenyakitlastfk: $scope.item.kp,
                }
                var antrianpasiendiperiksa = {
                    norec_apd: norec_Antrian,
                    tglregistrasi: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectruanganfk: $scope.item.ruangan.id,
                    objectkelasfk: kelasId,
                    objectpegawaifk: dokterId,
                    objectkamarfk: kamarIds,
                    nobed: nomorTempatTidurs,
                    objectdepartemenfk: $scope.item.ruangan.objectdepartemenfk,
                    objectasalrujukanfk: $scope.item.asalRujukan.id,
                    israwatgabung: $scope.model.rawatGabung === true ? 1 : 0,
                }
                var objSave = {
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }
                $scope.isSimpan = true;

                medifirstService.post('registrasi/save-registrasijenazah', objSave).then(function(e) {
                    $scope.isSimpan = false;
                    $scope.resultAPD = e.data.dataAPD;

                    // responData = e.data;
                    $scope.resultPD = e.data.dataPD;
                    $scope.Noregistrasi = e.data.dataPD.noregistrasi;
                    $scope.cacheNoRegistrasi = e.data.dataPD.noregistrasi;
                    $scope.model.noRegistrasi = e.data.dataPD.noregistrasi;
                    $scope.model.norec_pd = e.data.dataPD.norec;
                    var cachePasienDaftar = $scope.model.norec_pd +
                        "~" + $scope.model.noRegistrasi +
                        "~" + $scope.resultAPD.norec;

                    cacheHelper.set('CacheRegistrasiPasien', cachePasienDaftar);
                    if (e.data.status == 201) {

                        if ($scope.item.asalRujukan != undefined) {
                            var asalRujukan = $scope.item.asalRujukan
                            cacheHelper.set('cacheAsalRujukan', asalRujukan);
                        }
                        if (norecPD != '') {
                            $scope.saveLogging('Edit Registrasi', 'norec Pasien Daftar',
                                norecPD, 'Edit Registrasi ke ruangan ' + $scope.item.ruangan.namaruangan + ' pada No Registrasi ' + $scope.model.noRegistrasi)
                        } else {
                            // debugger;
                            // saveBiayaKarcis($scope.model.noRegistrasi,e.data.dataAPD.norec)
                            //##log Pasien Daftar
                            medifirstService.get("sysadmin/logging/save-log-pendaftaran-pasien?norec_pd=" +
                                    $scope.model.norec_pd).then(function(x) {})
                                //## end log    
                            if (isRegisOnline != '') {
                                var data = {
                                    "noreservasi": isRegisOnline,
                                }
                                medifirstService.post('registrasi/confirm-pasien-online', data).then(function(e) {
                                    // body...
                                })
                            }


                        }
                        if (!$scope.isPenunjang) {
                            $scope.isNext = false;
                            $scope.isBatal = true;
                            $scope.isReport = true;
                            $scope.isReportPendaftaran = true;
                            if ($scope.model.rawatInap == true) {
                                $scope.isReportRawatInap = true;
                            } else {
                                $scope.isReportIgd = true;
                            }
                            $scope.isInputAsuransi = true;
                            $scope.isAsuransi = true;
                        } else {
                            $scope.isSelesaiSimpan = true
                        }



                        if ($scope.item.kelompokPasien.kelompokpasien != ('Umum/Pribadi' || 'Telemedicine')) {
                            if (norecPD == '') {
                                $scope.inputPemakaianAsuransi();
                            }
                        }
                        if (norecPD == '' && $scope.item.ruangan.namaruangan != 'INSTALASI GAWAT DARURAT' && $scope.model.rawatInap != true &&
                            $scope.item.ruangan.namaruangan != 'Hemodialisa' && $scope.item.ruangan.namaruangan != 'RADIOLOGI' &&
                            $scope.item.ruangan.namaruangan != 'LABORATORIUM' && $scope.item.ruangan.namaruangan != 'ELEKTROMEDIK') {
                            $scope.nomorAntrian()
                        }

                    }

                    if ($scope.nocmIgd != undefined) {
                        updateTriage();
                    }

                }, function(error) {
                    // throw error;
                    $scope.isSimpan = false;
                    $scope.isBatal = false;
                })
            }

            function saveBiayaKarcis(noregistrasi, norec_apd) {
                if ($scope.model.rawatInap != true) {
                    debugger;
                    var dokterId = "";
                    if ($scope.item.dokter == undefined || $scope.item.dokter == "") {
                        dokterId = null;
                    } else
                        dokterId = $scope.item.dokter.id;
                    var json = {
                        'noregistrasi': noregistrasi,
                        'jenispasien': $scope.item.kelompokPasien.id,
                        'idruangan': $scope.item.ruangan.id,
                        'norec_apd': norec_apd,
                        'idpegawai': dokterId
                    }
                    medifirstService.post('registrasi/save-biaya-karcis', json).then(function(e) {});

                }

            }

            function updateTriage() {

                var objSave = {
                    norecapd: $scope.resultAPD.norec,
                    noemr: $scope.nocmIgd,
                    norecpd: $scope.resultPD.norec,
                    noregistrasi: $scope.Noregistrasi,
                    kelas: $scope.resultAPD.objectkelasfk,
                    tglregistrasi: $scope.resultPD.tglregistrasi,
                    kelompokpasien: $scope.resultPD.objectkelompokpasienlastfk
                }

                medifirstService.post('registrasi/update-data-emrpasien-pd', objSave).then(function(e) {});


            }

            // end Save Function
            $scope.updateNoreg = function() {
                medifirstService.get("registrasi/update-noregistrasi?norec_pd=" +
                    $scope.model.norec_pd).then(function(x) {
                    //debugger
                })
            }
            $scope.saveLogging = function(jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function(data) {

                })
            }



            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetakLabel = function(tempNoCm) {
                $scope.dats = {
                    qty: 0
                }
                $scope.winDialog.center().open();
            }
            $scope.pilihQty = function(data) {
                var listRawRequired = [
                    "dats.qty|k-ng-model|kuantiti"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var qty = data.qty;
                    var qtyhasil = data.qty * 2;
                    if (qty !== undefined) {
                        // window.open(window.location.origin + window.location.pathname +"#/LabelPhoto/"+$scope.item.pasien.nocm);
                        //##save identifikasi label pasien
                        // medifirstService.get("registrasi/identifikasi-label?norec_pd="
                        //     + $scope.cacheNorecPD + '&islabel=' + qtyhasil
                        // ).then(function (data) {

                        // })
                        // // saveImageToFile($scope.item.pasien.nocm,qty)
                        // //##end


                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function(response) {
                            // do something with response
                        });
                        $scope.winDialog.close();
                    }

                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };

            function saveImageToFile(nocm, qty) {
                medifirstService.get('registrasi/store-image-to-folder/' + nocm).then(function(e) {

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function(response) {
                        // do something with response
                    });
                    toastr.info(e.data.status, 'Info')
                    $scope.winDialog.close();
                })
            }
            $scope.cetak = function() {
                if ($scope.model.rawatInap == true) {
                    messageContainer.error("Cetak Antrian hanya untuk rawat jalan")
                    return
                }
                // cetak antrian
                // window.location = configuration.urlPrinting + "registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec + "&X-AUTH-TOKEN=" + modelItem.getAuthorize()
                // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')

                //cetakan langsung service VB 6 by grh   
                var client = new HttpClient();

                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function(response) {
                    // do something with response
                });

            }

            $scope.cetakGelang = function() {
                var stt = 'false'
                if (confirm('View Gelang Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.cacheNoRegistrasi + '&view=' + stt + '&qty=' + 1, function(response) {
                    // do something with response
                });
            }

            $scope.cetakBuktiLayanan = function() {
                if ($scope.item != undefined) {
                    //##save identifikasibuktiLayanan
                    medifirstService.get("registrasi/identifikasi-buktiLayanan?norec_pd=" +
                            $scope.cacheNorecPD
                        ).then(function(data) {
                            var datas = data.data;
                        })
                        //##end 

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' + $scope.cacheNoRegistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&view=false', function(response) {
                        // do something with response
                    });

                }
            }

            $scope.CetakSumList = function() {
                if ($scope.item != undefined) {
                    //##save identifikasi summary list
                    medifirstService.get("registrasi/identifikasi-sum-list?norec_pd=" +
                            $scope.cacheNorecPD
                        ).then(function(data) {
                            var datas = data.data;
                        })
                        //## end identifikasi summary list

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + tempNoCm + "&tglRegistrasi=" + new moment(new Date()).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.currentNoCm + '&view=false', function(response) {
                        // do something with response
                    });

                }

            }
            $scope.cetakSEP = function(x) {
                if ($scope.cacheNoRegistrasi != undefined && $scope.item.kelompokPasien.kelompokpasien !== "Umum/Pribadi") {

                    // //##save identifikasi sep
                    // medifirstService.get("registrasi/identifikasi-sep?norec_pd="
                    //     + $scope.cacheNorecPD
                    // ).then(function (data) {
                    //     var datas = data.data;
                    // })
                    // //##end

                    // // var noSep = e.data.data === null ? "2423432" : e.data.data;
                    // // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
                    // // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    // //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
                    // //cetakan langsung service VB6 by grh    
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    //     // do something with response
                    // });
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                        '&norec=' + $scope.cacheNoRegistrasi
                    ).then(function(data) {
                        debugger;
                        var data = data.data.data;
                        $("#nosepx").text(data[0].nosep);
                        $("#nopendaftaran").text(data[0].noregistrasi);
                        $("#tglsep").text(data[0].tanggalsep);
                        $("#peserta").text(data[0].jenispeserta);
                        $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                        // $("#cob").text(data[0].penjaminlaka);
                        $("#namapeserta").text(data[0].namapeserta);
                        $("#jenisrawat").text(data[0].jenisrawat);
                        $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                        $("#kelasrawat").text(data[0].namakelas);
                        $("#notelepon").text(data[0].notelpmobile);
                        $("#penjamin").text(data[0].penjaminlakalantas);
                        $("#politujuan").text(data[0].namaruanganfix);
                        $("#prolanis").text(data[0].prolanisprb);
                        $("#faskesperujuk").text(data[0].nmprovider);
                        $("#diagnosaawal").text(data[0].namadiagnosa);
                        $("#catatan").text(data[0].catatan);
                        $("#cetakanke").text(1);
                        $("#namadjpjmelayani").text(data[0].namadjpjpmelayani);

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

                    })
                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
                    return;
                }
            }
            $scope.tracerBon = function() {
                if ($scope.item != undefined) {

                    //##save identifikasi tracer
                    medifirstService.get("registrasi/identifikasi-tracer?norec_pd=" +
                            $scope.cacheNorecPD
                        ).then(function(data) {
                            var datas = data.data;
                        })
                        //##end

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $state.params.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function(response) {
                        // do something with response
                    });
                }
            }
            $scope.cetakKartu = function() {
                if ($scope.item != undefined) {

                    //##save identifikasi kartu pasien
                    medifirstService.get("registrasi/identifikasi-kartu-pasien?norec_pd=" +
                            $scope.cacheNorecPD
                        ).then(function(data) {
                            var datas = data.data;
                        })
                        //##end 

                    // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')
                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();
                    // //debugger;             
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.item.pasien.nocmfk + '&view=false', function(response) {
                        // do something with response
                    });

                }
            }
            $scope.sourceJenisDiagnosisPrimer = [{
                "statusEnabled": true,
                "namaExternal": "Diagnosa Awal",
                "kdProfile": 0,
                "qJenisDiagnosa": 5,
                "reportDisplay": "Diagnosa Pasca Bedah",
                "jenisDiagnosa": "Diagnosa Awal",
                "id": 5,
                "kodeExternal": "05",
                "kdJenisDiagnosa": 5,
                "noRec": "5                               "
            }]


            $scope.ringkasanInOut = function() {
                if ($scope.item != undefined) {
                    medifirstService.get("registrasi/daftar-antrian-pasien/get-data-diagnosa-pasien?noReg=" +
                        $scope.cacheNoRegistrasi
                    ).then(function(r) {
                        debugger
                        if (r.data.datas.length > 0 && r.data.datas[0].norec_diagnosapasien != null) {
                            $scope.item.norec_apd = r.data.datas[0].norec_apd
                            $scope.cetakBro();
                        } else {
                            $scope.item.jenisDiagnosis = $scope.listJenisDiagnosa[4];
                            $scope.icd10.center().open();
                        }
                    })
                }
            }

            $scope.cetakRMK = function() {
                var norReg = ""
                if ($scope != undefined) {
                    norReg = "noReg=" + $scope.cacheNoRegistrasi;
                }

                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }

                var keterangan = "";
                if ($scope.item.keteranganDiagnosis == undefined) {
                    keterangan = "-"
                } else {
                    keterangan = $scope.item.keteranganDiagnosis;
                }

                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: "",
                    noregistrasifk: $scope.cacheNorecAPD,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglpendaftaran: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function(e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();

                    $scope.cetakBro();
                })
            }

            $scope.cetakBro = function() {
                var NomorRm = $scope.item.pasien.nocm;
                var kelompokPasien = $scope.item.kelompokPasien.kelompokpasien
                var pegawai = medifirstService.getPegawai();
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.item.norec_apd + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.item.pasien.umur + '&petugas=' + pegawai.namalengkap + '&view=false', function(response) {});
            }

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function(data) {
                $scope.sourceDiagnosa = data;

            });

            $scope.inputPemakaianAsuransi = function() {
                if ($scope.resultPD != undefined) {
                    $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                        norecPD: $scope.resultPD.norec,
                        norecAPD: $scope.resultAPD.norec,
                    });
                    var cacheSet = undefined;
                    cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                } else {
                    $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                        norecPD: $scope.cacheNorecPD,
                        norecAPD: $scope.cacheNorecAPD,
                    });
                    var cacheSet = undefined;
                    cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                }
            }

            // $scope.inputTindakan = function(){
            //   if ($scope.cacheNorecAPD==undefined)
            //   {
            //      $state.go('dashboardpasien.InputBilling',{
            //             noRec:$scope.resultAPD.norec,
            //             noAntrianPasien: $scope.resultAPD.norec,
            //             noRegister:$scope.resultAPD.norec  
            //         });
            //   }
            //   else
            //   {
            //         $state.go('dashboardpasien.InputBilling',{
            //             noRec:$scope.cacheNorecAPD,
            //             noAntrianPasien: $scope.cacheNorecAPD,
            //             noRegister:$scope.cacheNorecPD  
            //         });
            //       }
            // }
            $scope.inputTindakan = function() {
                if ($scope.resultPD != undefined) {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.resultPD.norec,
                        norecAPD: $scope.resultAPD.norec

                    });
                } else {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.cacheNorecPD,
                        norecAPD: $scope.cacheNorecAPD

                    });
                }
            }
            $scope.inputTindakanNew = function() {
                if ($scope.resultPD != undefined) {
                    $state.go('InputTindakan', {
                        norecPD: $scope.resultPD.norec,
                        norecAPD: $scope.resultAPD.norec

                    });
                } else {
                    $state.go('InputTindakan', {
                        norecPD: $scope.cacheNorecPD,
                        norecAPD: $scope.cacheNorecAPD

                    });
                }
            }

            $scope.find = function() {
                $state.go('RegistrasiPasienLama');
            }

            $scope.Next = function() {
                $state.go('RegistrasiPasienBaru');
            }

            $scope.pasienBaru = function() {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }

            $scope.nomorAntrian = function() {
                let noreg = ''
                if ($scope.Noregistrasi != undefined) {
                    noreg = $scope.Noregistrasi
                } else {
                    noreg = $scope.cacheNoRegistrasi
                }
                if (noreg == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + noreg + '&petugas=' + $scope.item.pegawaiLogin.namaLengkap +
                    '&view=false',
                    function(response) {
                        // do something with response
                    });
            }


            // function HapusPenanggungJawab(){
            //    $scope.dataItem = {};
            // }


            $scope.cetakIdentifikasiPasien = function() {
                $scope.popUp.center().open();
            }

            $scope.BatalCetak = function() {
                HapusPenanggungJawab();
                $scope.popUp.close();
            }

            $scope.CetakAh = function() {
                $scope.NocmTea = null;
                medifirstService.get("registrasi/get-data-detail-pasien?nocm=" +
                        $scope.currentNoCm)
                    .then(function(dat) {
                        datas = dat.data.data;
                        var umur = dateHelper.CountAge(new Date(datas.tgllahir), $scope.now);
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day
                        var usia = (umur.year * 12) + umur.month;
                        $scope.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                        $scope.NocmTea = datas.nocm;
                        if ($scope.dataItem != undefined && datas != undefined) {
                            CetakWeh();
                        } else {
                            toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
                            return;
                        }

                    })
            }

            function CetakWeh() {

                var NomorRm = ""
                if ($scope.currentNoCm != undefined || $scope.currentNoCm != "") {
                    NomorRm = $scope.currentNoCm;
                }

                var stt = 'false'
                if (confirm('View Lembar Identitas Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-identitas=1&noCm=' + NomorRm + '&noregis=' + $scope.cacheNoRegistrasi + '&caraBayar=' + $scope.item.kelompokPasien.kelompokpasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawai.namalengkap + '&view=' + stt, function(response) {
                    //aadc=response; 

                });
                $scope.NocmTea = null;
                $scope.dataItem = {}
                $scope.popUp.close();
                // if ($scope.dataItem != undefined && datas != undefined) {                       
                //         CetakIdentitas()
                // }else{
                //     toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
                //     return;
                // }
            }


            $scope.cetakDataTriage = function() {
                if ($scope.cacheNoRegistrasi != undefined) {

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-triage=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function(response) {
                        // do something with response
                    });
                }
            }
            $scope.Back = function() {
                window.history.back()
            }
            $scope.rincianPelayananPenunjang = function() {
                var noreg = "";
                var norecPD = "";
                var norecAPD = "";
                if ($scope.resultPD != undefined) {
                    norecPD = $scope.resultPD.norec
                    norecAPD = $scope.resultAPD.norec
                    noreg = $scope.resultPD.noregistrasi
                } else {
                    norecPD = $scope.cacheNorecPD
                    norecAPD = $scope.cacheNorecAPD
                    noreg = $scope.cacheNoRegistrasi
                }

                var tanggal = $scope.now;
                var tanggalLahir = new Date($scope.item.pasien.tgllahir);
                var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                var hasilumur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

                var dokterId = "";
                if ($scope.item.dokter != undefined) {
                    dokterId = $scope.item.dokter.id
                }

                var arrStr = {
                    0: $scope.item.pasien.nocm,
                    1: $scope.item.pasien.namapasien,
                    2: $scope.item.pasien.jeniskelamin,
                    3: noreg,
                    4: hasilumur,
                    5: 6, //kelas
                    6: "Non Kelas",
                    7: $scope.item.tglRegistrasi,
                    8: norecAPD, //NOREC ANTRIAN
                    9: $scope.item.ruangan.namaruangan,
                    10: $scope.item.ruangan.id,
                    11: norecPD,
                    12: "", //nor
                    13: $scope.item.kelompokPasien.kelompokpasien,
                    14: dokterId,
                    15: $scope.item.ruangan.id
                }
                cacheHelper.set('RincianTagihanPenunjang', arrStr);
                $state.go('RincianTagihanPenunjang')
            }

            $scope.cetakBlangkoBpjs = function() {
                if ($scope.cacheNoRegistrasi != undefined && $scope.item.kelompokPasien.kelompokpasien !== "Umum/Pribadi") {
                    // delete $scope.dataItem.pegawaiBlanko

                    medifirstService.get('registrasi/get-daftar-combo-pegawai-all?pgid=2025', true, 10).then(function(e) {
                            $scope.listDataPegawai.add(e.data[0])
                            $scope.dataItem.pegawaiBlanko = e.data[0]

                            $scope.popUpBlanko.center().open()
                        })
                        // var PegawaiLogin = medifirstService.getPegawaiLogin();
                        //##save identifikasi sep

                    //##end                    

                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Blangko!");
                    return;
                }
            }
            $scope.cetakBlanko = function() {
                if ($scope.dataItem.pegawaiBlanko != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-blangko-bpjs=1&norec=' + $scope.cacheNoRegistrasi + '&Petugas=' + $scope.dataItem.pegawaiBlanko.id + '&view=false', function(response) {
                        // do something with response
                    });
                    $scope.popUpBlanko.close()
                }

            }
            $scope.batalBlanko = function() {
                // delete $scope.dataItem.pegawaiBlanko
                // $scope.pegawaiBlanko = {};
                $scope.popUpBlanko.close()
            }

            $scope.cetakLembarRawatInap = function(x) {
                // $scope.popUpDua.center().open();
                if ($scope.cacheNoRegistrasi != undefined) {
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sjp" +
                        '&norec=' + $scope.cacheNoRegistrasi
                    ).then(function(data) {
                        debugger;
                        var data = data.data.data;

                        var noCm = data[0].nocm.substring(0, 1) + "-";
                        noCm = noCm + data[0].nocm.substring(1, 3) + "-";
                        noCm = noCm + data[0].nocm.substring(3, 5) + "-";
                        noCm = noCm + data[0].nocm.substring(5, 7);
                        if (data[0].judul == 'BPJS KESEHATAN') {
                            $("#judul").text(data[0].namaexternal);
                            $("#nosep").text(data[0].nosep);
                            $("#namapasienx").text(data[0].titlepasien + '. ' + data[0].namapeserta);
                            $("#tanggalsep").text(data[0].tanggalsep);
                            $("#kartupasien").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                            $("#norujukan").text(data[0].norujukan);
                            $("#nocmx").text(noCm);
                            $("#tglrujukan").text(moment(data[0].tglrujukan).format('YYYY-MM-DD'));
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text(data[0].nmprovider);
                            $("#tanggallahirx").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text(data[0].namadiagnosa);
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);

                            $("#petugas").text($scope.item.PegawaiLogin);
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#noregistrasi").text(data[0].noregistrasi);
                        } else {
                            if (data[0].namaexternal != null) {
                                $("#judul").text(data[0].namaexternal);
                            } else {

                                $("#judul").text(data[0].judul);
                            }
                            $("#nosep").text('');
                            $("#namapasien").text(data[0].titlepasien + '. ' + data[0].namapasien);
                            $("#tanggalsep").text(data[0].tglregistrasi);
                            $("#kartupasien").text('');
                            $("#norujukan").text('');
                            $("#nocm").text(noCm);
                            $("#tglrujukan").text('');
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text('');
                            $("#tanggallahir").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text();
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);
                            $("#petugas").text($scope.item.PegawaiLogin);
                        }
                        // var gridElement = namagrid,
                        //               printableContent = '';
                        // win = window.open('', '', 'width=800, height=500'),
                        // doc = win.document.open();
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

                    })
                }
            }

            $scope.BatalCetakDua = function() {
                $scope.dataItem.pegawaiDua = {};
                $scope.popUpDua.close();
            }

            $scope.CetakLembarRanap = function() {
                    var NomorRm = ""
                    if ($scope.currentNoCm != undefined || $scope.currentNoCm != "") {
                        NomorRm = $scope.currentNoCm;
                    }
                    var stt = 'false'
                    if (confirm('View Lembar Rawat Inap? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-ranap=1&noCm=' + NomorRm + '&caraBayar=' + $scope.item.kelompokPasien.kelompokpasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawaiDua.namalengkap + '&noRegis=' + $scope.cacheNoRegistrasi + '&view=' + stt, function(response) {
                        //aadc=response; 
                    });
                    $scope.NocmTea = null;
                    $scope.dataItem.pegawaiDua = undefined;
                    $scope.popUpDua.close();
                }
                // Batas */
        }
    ]);
});