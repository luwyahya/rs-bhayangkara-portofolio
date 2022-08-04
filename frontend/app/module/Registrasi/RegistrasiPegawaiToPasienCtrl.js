define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPegawaiToPasienCtrl', ['MedifirstService', '$scope', '$state', '$mdDialog', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem',
        function(medifirstService, $scope, $state, $mdDialog, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem) {
            $scope.now = new Date();
            $scope.dataItem = {};
            $scope.itemRiwayat = {};
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
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            $scope.model.tglPelayanan = $scope.now;
            $scope.isDaftarKeDua = false;
            $scope.isLoadEdit = false;
            $scope.istempatLaporan = true;
            $scope.item.tglPositif = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglIsoman = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglIsomanSelesai = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglTestKembali = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');

            var datas = [];
            var chacePenunjang = cacheHelper.get('isPenunjang');
            var cacheRegisOnline = cacheHelper.get('CacheRegisOnline');
            if (chacePenunjang != undefined) {
                $scope.isPenunjang = chacePenunjang
                var listruangan = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                $scope.listRuangan = listruangan
            }
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.dataUser = medifirstService.getUserLogin();




            function cekPsnDaftarThisMonth(nocm) {
                medifirstService.get('registrasi/get-pegawai-use').then(function(e) {
                    $scope.listKeluarga = e.data;
                    medifirstService.get("registrasi/get-combo-registrasi").then(function(e) {
                        $scope.listStatusKeluarga = e.data.hubungankeluarga;
                        $scope.listpekerjaan = e.data.pekerjaan;
                        $scope.listruangan = e.data.ruangan;
                        medifirstService.get('registrasi/get-pasienisoman?nocmfk=' + nocm).then(function(e) {
                            if (e.data.data.length > 0) {
                                $scope.item.tglPositif = moment(e.data.data[0].tglpositif).format('YYYY-MM-DD HH:mm:ss');
                                $scope.item.tglIsoman = moment(e.data.data[0].tglisoman).format('YYYY-MM-DD HH:mm:ss');
                                $scope.item.tglIsomanSelesai = moment(e.data.data[0].tglisomanSelesai).format('YYYY-MM-DD HH:mm:ss');
                                $scope.item.tglTestKembali = moment(e.data.data[0].tgltestlabkembali).format('YYYY-MM-DD HH:mm:ss');
                                if (e.data.data[0].statuskaryawan == "Ya") {
                                    $scope.model.ya = true;
                                } else {
                                    $scope.model.tidak = true;
                                }
                                if (e.data.data[0].statuskeluargakaryawan == "Ya") {
                                    $scope.model.ya1 = true;
                                } else {
                                    $scope.model.tidak1 = true;
                                }
                                if (e.data.data[0].statuscovid == "Positif") {
                                    $scope.model.positif = true;
                                } else {
                                    $scope.model.negatif = true;
                                }
                                if (e.data.data[0].hasiltestlab == "Positif") {
                                    $scope.model.positifHasil = true;
                                } else {
                                    $scope.model.negatifHasil = true;
                                }
                                if (e.data.data[0].idpegawaifk != "0") {
                                    $scope.item.Keluarga = { namalengkap: e.data.data[0].namakeluarga, id: e.data.data[0].idpegawaifk };

                                }
                                if (e.data.data[0].hubungankeluargafk != "0") {
                                    $scope.item.setatusKeluarga = { hubungankeluarga: e.data.data[0].hubungankeluarga, id: e.data.data[0].hubungankeluargafk };
                                }
                                if (e.data.data[0].objectpekerjaanfk != "0") {
                                    $scope.item.pekerjaan = { pekerjaan: e.data.data[0].pekerjaan, id: e.data.data[0].objectpekerjaanfk };
                                }
                                if (e.data.data[0].objectruanganfk != "0") {
                                    $scope.item.ruanganKerja = { namaruangan: e.data.data[0].namaruangan, id: e.data.data[0].objectruanganfk };
                                }
                            }
                        })
                    })
                })


                // GetCombo();
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
            // medifirstService.getPart('registrasi/get-dokter-part', true, 10).then(function (e) {
            //     $scope.listDokter = e;
            // })

            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function(dat) {
                    $scope.listJenisPelayanan = dat.data.jenispelayanan;
                    $scope.item.jenisPasien = $scope.listJenisPelayanan[0];
                    $scope.listAsalRujukan = dat.data.asalrujukan;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    if (!$scope.isPenunjang)
                        $scope.listRuangan = dat.data.ruanganrajal;
                    $scope.listRuanganRajal = dat.data.ruanganrajal;
                    $scope.listRuanganRajal2 = dat.data.ruanganrajal2;
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
                if (cacheRegisOnline != undefined) {
                    // //debugger;
                    var arrOnline = cacheRegisOnline[0];
                    if (arrOnline.kelompokpasien == 'Telemedicine') {
                        $scope.item.tglRegistrasi = arrOnline.tanggalreservasi;
                        $scope.isTelemedicine = 'true';
                    } else {
                        $scope.item.tglRegistrasi = arrOnline.tanggalreservasi;
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
                    $scope.item.IsEditLoadPertama = true;
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
                        debugger;
                        if (his.data.data[0].israwatinap == 'true') {
                            $scope.model.rawatInap = true;
                            $scope.cekRawatInap($scope.model.rawatInap);
                            $scope.pasienBayi = true;
                            if (his.data.data[0].tglpulang != null) {
                                $scope.isSimpan = true;
                            }
                        }
                        $scope.item.tglRegistrasi = new Date(his.data.data[0].tglregistrasi),
                            $scope.item.ruangan = {
                                id: his.data.data[0].objectruanganlastfk,
                                namaruangan: his.data.data[0].namaruangan,
                                objectdepartemenfk: his.data.data[0].objectdepartemenfk
                            }
                        $scope.item.ruanganasal = {
                            id: his.data.data[0].objectruanganasalfk,
                            namaruanganasal: his.data.data[0].namaruanganasal
                        }
                        debugger;
                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        var dateNow = new Date();
                        var dateRegis = new Date($scope.item.tglRegistrasi);
                        var diffDays = Math.round(Math.abs((dateNow.getTime() - dateRegis.getTime()) / (oneDay)))
                        if (diffDays >= 1) {
                            $scope.disableTgl = true
                        }
                        $scope.resultEdit = his.data.data[0]
                            // ruanganLog = his.data.data[0].namaruangan
                        $scope.item.catatan = his.data.data[0].catatan
                        $scope.item.kelas = { id: his.data.data[0].objectkelasfk, namakelas: his.data.data[0].namakelas }
                        $scope.listKamar = ([{ id: his.data.data[0].objectkamarfk, namakamar: his.data.data[0].namakamar }])
                        $scope.item.kamar = { id: his.data.data[0].objectkamarfk, namakamar: his.data.data[0].namakamar }
                        $scope.listNoBed = ([{ id: his.data.data[0].objecttempattidurfk, reportdisplay: his.data.data[0].reportdisplay }])
                        $scope.item.nomorTempatTidur = { id: his.data.data[0].objecttempattidurfk, reportdisplay: his.data.data[0].reportdisplay }
                        $scope.item.asalRujukan = { id: his.data.data[0].objectasalrujukanfk, asalrujukan: his.data.data[0].asalrujukan }
                        $scope.item.kelompokPasien = { id: his.data.data[0].objectkelompokpasienlastfk, kelompokpasien: his.data.data[0].kelompokpasien }
                        $scope.item.rekanan = { id: his.data.data[0].objectrekananfk, namarekanan: his.data.data[0].namarekanan }
                        $scope.item.dokter = { id: his.data.data[0].objectpegawaifk, namalengkap: his.data.data[0].dokter }
                        $scope.item.namaruangan = { id: his.data.data[0].id, namaruangan: his.data.data[0].namaruangan }
                        $scope.item.objectdepartemenfk = { id: his.data.data[0].objectdepartemenfk, namadepartemen: his.data.data[0].namadepartemen }
                        $scope.item.pelayanan = his.data.data[0].pelayanan
                        isRegisOnline = his.data.data[0].statusschedule
                        $scope.isLoadEdit = true;
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
                debugger;
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
                debugger;
                var ruanganId = $scope.item.ruangan.id;

                medifirstService.get('registrasi/get-dokter-part?idRuangan=' + ruanganId, true, 10).then(function(e) {
                        $scope.listDokter = e.data;
                    })
                    // get ruangan with condition (rawat jalan or rawat inap)
                if ($scope.model.rawatInap === true) {
                    var ruanganId = id;
                    $scope.item.kelas = ""
                    $scope.item.kamar = ""
                    $scope.item.nomorTempatTi
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
                if ($scope.item.IsEditLoadPertama == false) {
                    $scope.item.kamar = ""
                    $scope.item.nomorTempatTidur = ""
                    $scope.item.IsEditLoadPertamaKelas = false
                }
                $scope.item.IsEditLoadPertama = false
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
                if ($scope.item.IsEditLoadPertamaKelas == false) {
                    $scope.item.nomorTempatTidur = ""
                }
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
            $scope.Save = function() {

                $scope.lanjutDaftar()


            }
            $scope.lanjutDaftar = function() {

                $scope.SimpanRegistrasi();

            }

            $scope.SimpanRegistrasi = function() {
                debugger

                var statuskaryawan = "";
                if ($scope.model.ya == true && $scope.model.tidak == undefined) {
                    statuskaryawan = "1";
                } else if ($scope.model.tidak == true && $scope.model.ya == undefined) {
                    statuskaryawan = "2";
                } else {
                    statuskaryawan = "2";
                }
                var statuscovid = "";
                if ($scope.model.positif == true && $scope.model.negatif == undefined) {
                    statuscovid = "1";
                } else if ($scope.model.negatif == true && $scope.model.positif == undefined) {
                    statuscovid = "2";
                } else {
                    statuscovid = "2";
                }
                var hasiltestlab = "";
                if ($scope.model.positif1 == true && $scope.model.negatif1 == undefined) {
                    hasiltestlab = "1";
                } else if ($scope.model.negatif1 == true && $scope.model.positif1 == undefined) {
                    hasiltestlab = "2";
                } else {
                    hasiltestlab = "2";
                }
                var statuskeluargakaryawan = "";
                if ($scope.model.ya1 == true) {
                    statuskeluargakaryawan = "1";
                } else if ($scope.model.tidak1 == true) {
                    statuskeluargakaryawan = "2";
                } else {
                    statuskeluargakaryawan = "2";
                }
                var pegawai = "";
                if ($scope.item.Keluarga == undefined && $scope.model.ya1 == true || $scope.item.Keluarga == "" && $scope.model.ya1 == true) {
                    toastr.warning('Pilih Nama Anggota Keluarga Pegawai !!!')
                    return
                } else if ($scope.item.Keluarga == undefined) {
                    pegawai = "";
                } else {
                    pegawai = $scope.item.Keluarga.id;
                }
                var hubungan = "";
                if ($scope.item.setatusKeluarga == undefined && $scope.model.ya1 == true || $scope.item.setatusKeluarga == "" && $scope.model.ya1 == true) {
                    toastr.warning('Pilih Hubungan Keluarga Pegawai !!!')
                    return
                } else if ($scope.item.setatusKeluarga == undefined) {
                    hubungan = "";
                } else {
                    hubungan = $scope.item.setatusKeluarga.id;
                }
                var pekerjaan = "";
                if ($scope.item.pekerjaan == undefined || $scope.item.pekerjaan == "") {
                    toastr.warning('Pilih Pekerjaan !!!')
                    return
                } else if ($scope.item.pekerjaan == undefined) {
                    pekerjaan = "";
                } else {
                    pekerjaan = $scope.item.pekerjaan.id;
                }
                var ruangan = "";
                if ($scope.item.ruanganKerja == undefined || $scope.item.ruanganKerja == "") {
                    toastr.warning('Pilih Ruangan !!!')
                    return
                } else if ($scope.item.ruanganKerja == undefined) {
                    ruangan = "";
                } else {
                    ruangan = $scope.item.ruanganKerja.id;
                }
                var pasiendaftar = {
                        nocmfk: $scope.item.nocmfk,
                        statuskaryawan: statuskaryawan,
                        statuskeluargakaryawan: statuskeluargakaryawan,
                        idpegawaifk: pegawai,
                        hubungankeluargafk: hubungan,
                        statuscovid: statuscovid,
                        tglpositif: moment($scope.item.tglPositif).format('YYYY-MM-DD HH:mm:ss'),
                        tglisoman: moment($scope.item.tglIsoman).format('YYYY-MM-DD HH:mm:ss'),
                        tglselesaiisoman: moment($scope.item.tglIsomanSelesai).format('YYYY-MM-DD HH:mm:ss'),
                        tgltestlabkembali: moment($scope.item.tglTestKembali).format('YYYY-MM-DD HH:mm:ss'),
                        hasiltestlab: hasiltestlab,
                        namapasien: $scope.item.pasien.namapasien,
                        pekerjaan: pekerjaan,
                        ruangan: ruangan,
                        idpasien: '',
                        pegawaiuse: ''

                    }
                    // id, nocmfk, statuskaryawan, statuskeluargakaryawan, idpegawaifk, hubungankeluargafk,
                    //  statuscovid, tglpositif, tglisoman, tglselesaiisoman, tgltestlabkembali, hasiltestlab

                var objSave = {
                    pasiendaftar: pasiendaftar,
                }
                $scope.isSimpan = true;

                medifirstService.post('registrasi/save-pasienisoman', objSave).then(function(e) {
                    $scope.isSimpan = false;


                }, function(error) {
                    // throw error;
                    $scope.isSimpan = false;

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
                        'idpegawai': dokterId,
                        'isDaftarKeDua': $scope.isDaftarKeDua
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
                        $("#kelasrawathak").text(data[0].namakelashak);
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
                    // medifirstService.get("registrasi/daftar-antrian-pasien/get-data-diagnosa-pasien?noReg="
                    //     + $scope.cacheNoRegistrasi
                    // ).then(function (r) {
                    //     if (r.data.datas.length > 0 && r.data.datas[0].norec_diagnosapasien != null) {
                    //         $scope.item.norec_apd = r.data.datas[0].norec_apd
                    //         $scope.cetakBro();
                    //     } else {
                    $scope.item.jenisDiagnosis = $scope.listJenisDiagnosa[4];
                    $scope.icd10.center().open();
                    //     }
                    // })
                }
            }

            $scope.cetakJasper = function() {
                var data = {
                    "gambarLogo": "cherry.jpg",
                    "paramKey": ["nocms", "noregistrasi", "jk", "norecapd", "umur"],
                    "paramValue": [$scope.item.pasien.nocm, $scope.cacheNoRegistrasi, $scope.item.pasien.jeniskelamin, $scope.cacheNorecAPD, $scope.item.pasien.umur], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/lembarmasukranap.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/lembarmasukranap.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/lembarmasukranap.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:1000/generic/report/lembarmasukranap.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakRMK = function() {
                // $scope.cetakJasper();
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
                    $scope.cetakJasper();
                    // $scope.cetakBro();
                })
            }
            $scope.cetakRMKDs = function() {
                // $scope.cetakJasper();
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
                    // $scope.cetakJasper();
                    $scope.cetakBro();
                })
            }

            $scope.cetakBro = function() {
                var NomorRm = $scope.item.pasien.nocm;
                var kelompokPasien = $scope.item.kelompokPasien.kelompokpasien
                var pegawai = medifirstService.getPegawai();
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.cacheNorecAPD + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.item.pasien.umur + '&petugas=' + pegawai.namaLengkap + '&view=false', function(response) {});
            }
            $scope.columnRiwayatRegistrasi = {
                columns: [{
                        "field": "newno",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        // "template": "<span class='style-left'>{{formatTanggaljam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruanganan Layanan Asal",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruanganasal #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namarekanan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                            // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "100px"
                            // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "isdiagnosis",
                        "title": "Diagnosis",
                        "width": "300px",
                        "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan Pasien",
                        "width": "100px",
                        "template": '# if( kesatuanpasien==false) {# - # } else {# #= kesatuanpasien # #} #'
                    },
                ]
            };
            $scope.RiwayatRegistrasi = function() {
                debugger;
                $scope.itemRiwayat.noRM = $scope.item.pasien.nocm;
                $scope.itemRiwayat.namaPasien = $scope.item.pasien.namapasien;
                $scope.itemRiwayat.tgllahir = $scope.item.pasien.tgllahir;
                loadRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUp = function() {
                $scope.itemRiwayat.noRM = undefined;
                $scope.itemRiwayat.namaPasien = undefined;
                $scope.itemRiwayat.tglLahir = undefined;
                $scope.itemRiwayat.noRegistrasi = undefined;
                $scope.itemRiwayat.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemRiwayat.noRm != undefined) {
                    rm = "&norm=" + $scope.itemRiwayat.noRm
                }
                var pasien = ""
                if ($scope.itemRiwayat.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemRiwayat.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemRiwayat.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemRiwayat.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemRiwayat.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemRiwayat.noRegistrasi;
                }
                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                        tglLahirs + rm + noReg + pasien)
                    .then(function(data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = dateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = dateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        dRiwayatReg.sort((d1, d2) => new Date(d2.tglregistrasi).getTime() - new Date(d1.tglregistrasi).getTime());
                        for (var x = 0; x < dRiwayatReg.length; x++) {
                            dRiwayatReg[x].newno = x + 1
                        }

                        $scope.itemRiwayat.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
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
                if ($scope.cacheNoRegistrasi != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function(response) {
                        // do something with response
                    });
                    // 			medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sjp"+
                    // 				'&norec=' +$scope.cacheNoRegistrasi
                    // 			).then(function (data) {
                    // 				debugger;
                    // 				var data = data.data.data;

                    // 				var noCm = data[0].nocm.substring(0,1) + "-";
                    // 				noCm = noCm + data[0].nocm.substring(1,3) + "-";
                    // 				noCm = noCm + data[0].nocm.substring(3,5) + "-";
                    // 				noCm = noCm + data[0].nocm.substring(5,7) ;
                    // 				if(data[0].judul == 'BPJS KESEHATAN'){	              
                    // 					$("#judul").text(data[0].namaexternal);
                    // 					$("#nosep").text(data[0].nosep);
                    // 					$("#namapasienx").text(data[0].titlepasien+'. '+data[0].namapeserta);
                    // 					$("#tanggalsep").text(data[0].tanggalsep);
                    // 					$("#kartupasien").text(data[0].nokepesertaan+' / '+data[0].nocm);
                    // 					$("#norujukan").text(data[0].norujukan);
                    // 					$("#nocmx").text(noCm);
                    // 					$("#tglrujukan").text(moment(data[0].tglrujukan).format('YYYY-MM-DD'));
                    // 					$("#jeniskelamin").text(data[0].jeniskelamin);
                    // 					$("#asalrujukan").text(data[0].nmprovider);
                    // 					$("#tanggallahirx").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                    // 					// moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    // 					$("#diagnosa").text(data[0].namadiagnosa);
                    // 					$("#tujuanrujukan").text(data[0].namapolibpjs+'/'+data[0].namaruangan);

                    // 					$("#petugas").text($scope.item.PegawaiLogin);
                    // 					$("#jeniskelamin").text(data[0].jeniskelamin);
                    // 					$("#noregistrasi").text(data[0].noregistrasi);
                    // 				}else{
                    // 					if(data[0].namaexternal!= null){
                    // 						$("#judul").text(data[0].namaexternal);
                    // 					}else{

                    // 						$("#judul").text(data[0].judul);
                    // 					}
                    // 					$("#nosep").text('');
                    // 					$("#namapasien").text(data[0].titlepasien+'. '+data[0].namapasien);
                    // 					$("#tanggalsep").text(data[0].tglregistrasi);
                    // 					$("#kartupasien").text('');
                    // 					$("#norujukan").text('');
                    // 					$("#nocm").text(noCm);
                    // 					$("#tglrujukan").text('');
                    // 					$("#jeniskelamin").text(data[0].jeniskelamin);
                    // 					$("#asalrujukan").text('');
                    // 					$("#tanggallahir").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                    // 					// moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    // 					$("#diagnosa").text();
                    // 					$("#tujuanrujukan").text(data[0].namapolibpjs+'/'+data[0].namaruangan);
                    // 					$("#petugas").text($scope.item.PegawaiLogin);
                    // 				}                                                                 
                    // 				  // var gridElement = namagrid,
                    //    //               printableContent = '';
                    // 				// win = window.open('', '', 'width=800, height=500'),
                    // 				// doc = win.document.open();
                    // 			   var htmlStart =
                    // 				   '<!DOCTYPE html>' +
                    // 				   '<html style="border:none;border-color: white">' +
                    // 				   '<head style="border:none;border-color: white">' +
                    // 				   // '<div class="header" style="position: fixed;top: 0;">'+
                    // 				   // header +
                    // 					'<style>' +
                    // 				  'html { font: 11pt sans-serif; }' +
                    // 				  '.k-grid { border-top-width: 0; }' +
                    // 				  '.k-grid, .k-grid-content { height: auto !important; }' +
                    // 				  '.k-grid-content { overflow: visible !important; }' +
                    // 				  '.k-grid .k-grid-header th { border-top: none; }' +
                    // 				  '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                    // 				  '</style>' +
                    // 				   '</div>'+
                    // 				   '</head>' +
                    // 				   '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                    // 				   '<table  style="border:none; border-color: white">' +
                    // 					 '<thead style="border:none;border-color: white">' +
                    // 					  '<tr style="border:none;border-color: white">' +
                    // 					   '<td style="border:none;border-color: white">' +
                    // 						  // '<div class="page-header-space"></div>' +
                    // 						  '<div style="border:none;border-color: white">'+
                    // 							  // header +	                             
                    // 						  '</div>'+
                    // 						'</td>' +
                    // 					  '</tr>' +
                    // 					'</thead>' +
                    // 					 '<tbody>' +
                    // 					  '<tr>' +
                    // 						'<td>' 
                    // 				  var htmlEnd =                         
                    // 							'</td>'+
                    // 						  '</tr>'+
                    // 						'</tbody>'+
                    // 					   '</body>' +
                    // 					   '</div>' +


                    // 					   '</html>';
                    // 				var printdata = document.getElementById(x);  
                    // 				printdata = printdata.innerHTML; 
                    // 				printdata = htmlStart + printdata + htmlEnd;            
                    // 				// var editor = $("#editor").data("kendoEditor");
                    // 				// editor.value(printdata);

                    // 				// var cetakan=htmlStart + printableContent + htmlEnd;
                    // 				var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                    // 				WindowObject.document.writeln(printdata);
                    // 				WindowObject.document.close();
                    // 				WindowObject.focus();

                    // 			})
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