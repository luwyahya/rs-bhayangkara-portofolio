
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InsidenInternalCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var idKeluhan = '';
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var noRegistrasifk = '';
            $scope.currentUmur = [];
            $scope.currentJenisInsiden = [];
            $scope.currentPelapor = [];
            $scope.currentInsiden = [];
            $scope.currentInsidenTerjadiPada = [];
            $scope.currentInsidenPesien = [];
            $scope.currentJiwa = [];
            $scope.currentAkibatInsiden = [];
            $scope.currentTindakanInsiden = [];
            $scope.currentKejadianSama = [];
            $scope.currentGrading = [];
            $scope.disabledText = false;
            LoadCombo();
            // LoadCache();                        

            function LoadCombo() {
                var nomor = 1;
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listDataRuangan = data;
                });
                // 
                medifirstService.get('sysadmin/general/get-combo-registrasi-general').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listDataJenisKelamin = dataCombo.jeniskelamin;
                    $scope.listDataKelompokPasien = dataCombo.kelompokpasien;
                });

                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    $scope.listKeselamatanInput = e.data.insidenkeselamtanpasien;
                    $scope.listRegrading = e.data.regrading;
                    LoadCache();
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDataPegawai = data;                
                });
            }

            $scope.listUmur = [
                {
                    "id": 1,
                    "nama": "Umur*",
                    "detail": [
                        { "id": 1, "nama": "0 - 1 Bulan" },
                        { "id": 2, "nama": "> 1 bulan - 1 tahun" },
                        { "id": 3, "nama": "> 1 tahun - 5 tahun" },
                        { "id": 4, "nama": "> 5 tahun - 15 tahun" },
                        { "id": 5, "nama": "> 15 tahun - 30 tahun" },
                        { "id": 6, "nama": "> 30 tahun - 65 tahun" },
                        { "id": 7, "nama": "> 65 tahun" },
                    ]
                }
            ]
            $scope.addListUmur = function (bool, data) {
                var index = $scope.currentUmur.indexOf(data);
                if (_.filter($scope.currentUmur, {
                    id: data.id
                }).length === 0)
                    $scope.currentUmur.push(data);
                else {
                    $scope.currentUmur.splice(index, 1);
                }
            }

            $scope.listJenisInsiden = [
                {
                    "id": 2,
                    "nama": "4.Jenis Insiden*",
                    "detail": [
                        { "id": 1, "nama": "Kejadian Nyaris Cedera / KNC (Near miss)" },
                        { "id": 2, "nama": "Kejadian Tidak Cedera / KTC (No Harm)" },
                        { "id": 3, "nama": "Kejadian Tidak Diharapkan / KTD (Adverse Event)" },
                        { "id": 4, "nama": "KPC" },
                        { "id": 5, "nama": "Kejadian Sentinel (Sentinel Event)*" }
                    ]
                }
            ]
            $scope.addListJenisInsiden = function (bool, data) {
                var index = $scope.currentJenisInsiden.indexOf(data);
                if (_.filter($scope.currentJenisInsiden, {
                    id: data.id
                }).length === 0)
                    $scope.currentJenisInsiden.push(data);
                else {
                    $scope.currentJenisInsiden.splice(index, 1);
                }
            }

            $scope.listPelapor = [
                {
                    "id": 3,
                    "nama": "5. Orang Pertama Yang Melaporkan Insiden*",
                    "detail": [
                        { "id": 1, "nama": "Karyawan : Dokter / Perawat / Petugas Lainnya" },
                        { "id": 2, "nama": "Keluarga / Pendamping Pasien" },
                        { "id": 3, "nama": "Pasien" },
                        { "id": 4, "nama": "Pengunjung" },
                        { "id": 5, "nama": "Lain-lain" },
                    ]
                }
            ]
            $scope.addListPelapor = function (bool, data) {
                var index = $scope.currentPelapor.indexOf(data);
                if (_.filter($scope.currentPelapor, {
                    id: data.id
                }).length === 0)
                    $scope.currentPelapor.push(data);
                else {
                    $scope.currentPelapor.splice(index, 1);
                }
            }

            $scope.listInsidenTerjadiPada = [
                {
                    "id": 4,
                    "nama": "6. Insiden terjadi pada*",
                    "detail": [
                        { "id": 1, "nama": "Pasien " },
                        { "id": 2, "nama": " Lain-lain " }
                    ]
                }
            ]
            $scope.addListInsidenTerjadiPada = function (bool, data) {
                var index = $scope.currentInsidenTerjadiPada.indexOf(data);
                if (_.filter($scope.currentInsidenTerjadiPada, {
                    id: data.id
                }).length === 0)
                    $scope.currentInsidenTerjadiPada.push(data);
                else {
                    $scope.currentInsidenTerjadiPada.splice(index, 1);
                }
            }

            $scope.listInsidenPasien = [
                {
                    "id": 5,
                    "nama": "7. Insiden Menyangkut Pasien",
                    "detail": [
                        { "id": 1, "nama": "Pasien Rawat Inap" },
                        { "id": 2, "nama": "Pasien Rawat Jalan" },
                        { "id": 3, "nama": "Pasien IGD" },
                        { "id": 4, "nama": " Lain-lain  " },
                    ]
                }
            ]
            $scope.addListInsidenPasien = function (bool, data) {
                var index = $scope.currentInsidenPesien.indexOf(data);
                if (_.filter($scope.currentInsidenPesien, {
                    id: data.id
                }).length === 0)
                    $scope.currentInsidenPesien.push(data);
                else {
                    $scope.currentInsidenPesien.splice(index, 1);
                }
            }

            // $scope.listInsiden = [
            //     {
            //         "id": 4,
            //         "nama": "Insiden Menyangkut Pasien",
            //         "detail": [
            //             { "id": 1, "nama": "Pasien Rawat Inap" },
            //             { "id": 2, "nama": "Pasien Rawat Jalan" },
            //             { "id": 3, "nama": "Pasien IGD" },
            //             { "id": 4, "nama": "Lain-lain" },
            //         ]
            //     }
            // ]
            // $scope.addListInsiden = function (bool, data) {
            //     var index = $scope.currentInsiden.indexOf(data);
            //     if (_.filter($scope.currentInsiden, {
            //         id: data.id
            //     }).length === 0)
            //         $scope.currentInsiden.push(data);
            //     else {
            //         $scope.currentInsiden.splice(index, 1);
            //     }
            // }

            $scope.listJiwa = [
                {
                    "id": 6,
                    "nama": "9. Insiden terjadi pada pasien : ( jiwa dan sub spesialisasnya)",
                    "detail": [
                        { "id": 1, "nama": "Anak Remaja" },
                        { "id": 2, "nama": "Napza" },
                        { "id": 3, "nama": "Dewasa" },
                        { "id": 4, "nama": "Lansia" },
                        { "id": 5, "nama": "GMO" },
                        { "id": 6, "nama": "ELektromedik" },
                        { "id": 7, "nama": "  Lain-lain   " },
                    ]
                }
            ]
            $scope.addListJiwa = function (bool, data) {
                var index = $scope.currentJiwa.indexOf(data);
                if (_.filter($scope.currentJiwa, {
                    id: data.id
                }).length === 0)
                    $scope.currentJiwa.push(data);
                else {
                    $scope.currentJiwa.splice(index, 1);
                }
            }

            $scope.listAkibatInsiden = [
                {
                    "id": 7,
                    "nama": "11. Akibat Insiden Terhadap Pasien*",
                    "detail": [
                        { "id": 1, "nama": "Kematian" },
                        { "id": 2, "nama": "Cedera Irreversibe / Cedera Berat" },
                        { "id": 3, "nama": "Cedera Reversibel / Cedera Sedang" },
                        { "id": 4, "nama": "Cedera Ringan" },
                        { "id": 5, "nama": "Tidak Ada Cedera" },
                    ]
                }
            ]
            $scope.addListAkibatInsiden = function (bool, data) {
                var index = $scope.currentAkibatInsiden.indexOf(data);
                if (_.filter($scope.currentAkibatInsiden, {
                    id: data.id
                }).length === 0)
                    $scope.currentAkibatInsiden.push(data);
                else {
                    $scope.currentAkibatInsiden.splice(index, 1);
                }
            }

            $scope.listKejadianSama = [
                {
                    "id": 8,
                    "nama": "14. Apakah Kejadian yang sama pernah terjadi di Unit Kerja Lain?*",
                    "detail": [
                        { "id": 1, "nama": "Ya" },
                        { "id": 2, "nama": "Tidak" },
                    ]
                }
            ]
            $scope.addListKejadianSama = function (bool, data) {
                var index = $scope.currentKejadianSama.indexOf(data);
                if (_.filter($scope.currentKejadianSama, {
                    id: data.id
                }).length === 0)
                    $scope.currentKejadianSama.push(data);
                else {
                    $scope.currentKejadianSama.splice(index, 1);
                }
            }

            $scope.listTindakan = [
                {
                    "id": 9,
                    "nama": "13. Tindakan dilakukan oleh*",
                    "detail": [
                        { "id": 1, "nama": "Dokter" },
                        { "id": 2, "nama": "Perawat" },
                    ]
                }
            ]
            $scope.addListTindakan = function (bool, data) {
                var index = $scope.currentTindakanInsiden.indexOf(data);
                if (_.filter($scope.currentTindakanInsiden, {
                    id: data.id
                }).length === 0)
                    $scope.currentTindakanInsiden.push(data);
                else {
                    $scope.currentTindakanInsiden.splice(index, 1);
                }
            }


            $scope.listGrading = [
                {
                    "id": 10,
                    "nama": "Grading Risiko Kejadian*(Diisi oleh atasan pelapor)",
                    "detail": [
                        { "id": 1, "nama": "BIRU" },
                        { "id": 2, "nama": "HIJAU" },
                        { "id": 3, "nama": "KUNING" },
                        { "id": 4, "nama": "MERAH" },
                    ]
                }
            ]
            $scope.addListGrading = function (bool, data) {
                var index = $scope.currentGrading.indexOf(data);
                if (_.filter($scope.currentGrading, {
                    id: data.id
                }).length === 0)
                    $scope.currentGrading.push(data);
                else {
                    $scope.currentGrading.splice(index, 1);
                }
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('InsidenInternalCtrl');
                if (chacePeriode != undefined) {
                    kpid = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                // LoadCombo();D
                if (noOrder != '') {
                    if (noOrder == 'EditInsiden') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            norec = kpid                            
                            var datas = dat.data.data[0];
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.TglLahir = moment(datas.tgllahir).format('YYYY-MM-DD HH:mm');
                            $scope.item.Ruangan = { value: datas.ruanganfk, id: datas.ruanganfk, text: datas.namaruangan }
                            $scope.item.TglMasuk = moment(datas.tglmasuk).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglInsiden = moment(datas.tglinsiden).format('YYYY-MM-DD HH:mm');
                            $scope.item.Insiden = datas.insiden;
                            $scope.item.KronologiInsiden = datas.kronologisinsiden;
                            $scope.item.lokasiInsiden = datas.tempatinsiden;
                            $scope.item.UnitKerja = datas.unitterkait;
                            $scope.item.Tindakan = datas.penanganan;
                            $scope.item.Penanggulangan = datas.langkahpenanganan;
                            $scope.item.TglLaporan = moment(datas.tgllapor).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglTerimaLaporan = moment(datas.tglterima).format('YYYY-MM-DD HH:mm');
                            $scope.item.PenerimaLaporan = { id: datas.penerimalaporanfk, namalengkap: datas.penerimalaporan };
                            $scope.item.PembuatLaporan = { id: datas.PembuatLaporanfk, namalengkap: datas.pembuatlaporan };
                            $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: datas.jeniskesalamatanfk, jeniskeselamatan: datas.jeniskeselamatan };
                            $scope.item.KeselamatanInput = { id: datas.insidenkeselamatanfk, keselamatan: datas.keselamatan };
                            $scope.item.JenisKelamin = { id: datas.jeniskelaminfk, jeniskelaminfk: datas.jeniskelaminfk, jeniskelamin: datas.jeniskelamin };
                            $scope.item.KelompokPasien = { id: datas.penanggungbiayapasienfk, penanggungbiayapasienfk: datas.penanggungbiayapasienfk, kelompokpasien: datas.kelompokpasien };
                            $scope.item.lain5 = datas.lain5;
                            $scope.item.lain6 = datas.lain6;
                            $scope.item.lain7 = datas.lain7;
                            $scope.item.lain9 = datas.lain9;
                            $scope.item.tim13 = datas.tim13;
                            $scope.item.petugas13 = $scope.petugas13;
                            if (datas.umur != '' || datas.umur != null) {
                                var umur = datas.umur.split(',')
                                umur.forEach(function (data) {
                                    $scope.listUmur.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentUmur.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.jenisinsiden != '' || datas.jenisinsiden != null) {
                                var jenisinsiden = datas.jenisinsiden.split(',')
                                jenisinsiden.forEach(function (data) {
                                    $scope.listJenisInsiden.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentJenisInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.pelaporinsiden != '' || datas.pelaporinsiden != null) {
                                var pelaporinsiden = datas.pelaporinsiden.split(',')
                                pelaporinsiden.forEach(function (data) {
                                    $scope.listPelapor.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentPelapor.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                           if (datas.insidenterjadipada != '' || datas.insidenterjadipada != null) {
                                var insidenterjadipada = datas.insidenterjadipada.split(',')
                                insidenterjadipada.forEach(function (data) {
                                    $scope.listInsidenTerjadiPada.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentInsidenTerjadiPada.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.insidenterjadi != '' || datas.insidenterjadi != null) {
                                var insidenterjadi = datas.insidenterjadi.split(',')
                                insidenterjadi.forEach(function (data) {
                                    $scope.listInsidenPasien.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentInsidenPesien.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.akibatinsiden != '' || datas.akibatinsiden != null) {
                                var akibatinsiden = datas.akibatinsiden.split(',')
                                akibatinsiden.forEach(function (data) {
                                    $scope.listAkibatInsiden.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentAkibatInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.dilakukanoleh != '' || datas.dilakukanoleh != null) {
                                var dilakukanoleh = datas.dilakukanoleh.split(',')
                                dilakukanoleh.forEach(function (data) {
                                    $scope.listTindakan.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentTindakanInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.kejadiansama != '' || datas.kejadiansama != null) {
                                var kejadiansama = datas.kejadiansama.split(',')
                                kejadiansama.forEach(function (data) {
                                    $scope.listKejadianSama.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentKejadianSama.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.jiwa != '' || datas.jiwa != null) {
                                var jiwa = datas.jiwa.split(',')
                                jiwa.forEach(function (data) {
                                    $scope.listJiwa.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentJiwa.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.grading != '' || datas.grading != null) {
                                var grading = datas.grading.split(',')
                                grading.forEach(function (data) {
                                    $scope.listGrading.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentGrading.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                        }); //
                    } else if (noOrder == 'InputInsidenInternal') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-pasien-registrasi?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            var pegawaiLogin = medifirstService.getPegawaiLogin();
                            $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                            noRegistrasifk = kpid;
                            $scope.item.TglInsiden = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglTerimaLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            var datas = dat.data.data[0];
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.TglLahir = new Date(datas.tgllahir);
                            $scope.item.JenisKelamin = { id: datas.objectjeniskelaminfk, jeniskelamin: datas.jeniskelamin }
                            $scope.item.Ruangan = { value: datas.id, text: datas.namaruangan, namaruangan:datas.namaruangan }
                            $scope.item.TglMasuk = new Date(datas.tglregistrasi)
                            $scope.item.KelompokPasien = { id: datas.objectkelompokpasienlastfk, kelompokpasien: datas.kelompokpasien }
                        });
                    } else if (noOrder == 'LihatInsiden') {
                        $scope.disabledText = true;
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            norec = kpid
                            var datas = dat.data.data[0];
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.TglLahir = moment(datas.tgllahir).format('YYYY-MM-DD HH:mm');
                            $scope.item.Ruangan = { value: datas.ruanganfk, id: datas.ruanganfk, text: datas.namaruangan }
                            $scope.item.TglMasuk = moment(datas.tglmasuk).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglInsiden = moment(datas.tglinsiden).format('YYYY-MM-DD HH:mm');
                            $scope.item.Insiden = datas.insiden;
                            $scope.item.KronologiInsiden = datas.kronologisinsiden;
                            $scope.item.lokasiInsiden = datas.tempatinsiden;
                            $scope.item.UnitKerja = datas.unitterkait;
                            $scope.item.Tindakan = datas.penanganan;
                            $scope.item.Penanggulangan = datas.langkahpenanganan;
                            $scope.item.TglLaporan = moment(datas.tgllapor).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglTerimaLaporan = moment(datas.tglterima).format('YYYY-MM-DD HH:mm');
                            $scope.item.PenerimaLaporan = { id: datas.penerimalaporanfk, namalengkap: datas.penerimalaporan };
                            $scope.item.PembuatLaporan = { id: datas.PembuatLaporanfk, namalengkap: datas.pembuatlaporan };
                            $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: datas.jeniskesalamatanfk, jeniskeselamatan: datas.jeniskeselamatan };
                            $scope.item.KeselamatanInput = { id: datas.insidenkeselamatanfk, keselamatan: datas.keselamatan };
                            $scope.item.JenisKelamin = { id: datas.jeniskelaminfk, jeniskelaminfk: datas.jeniskelaminfk, jeniskelamin: datas.jeniskelamin };
                            $scope.item.KelompokPasien = { id: datas.penanggungbiayapasienfk, penanggungbiayapasienfk: datas.penanggungbiayapasienfk, kelompokpasien: datas.kelompokpasien };
                            $scope.item.lain5 = datas.lain5;
                            $scope.item.lain6 = datas.lain6;
                            $scope.item.lain7 = datas.lain7;
                            $scope.item.lain9 = datas.lain9;
                            $scope.item.tim13 = datas.tim13;
                            $scope.item.petugas13 = $scope.petugas13;
                            if (datas.umur != '' || datas.umur != null) {
                                var umur = datas.umur.split(',')
                                umur.forEach(function (data) {
                                    $scope.listUmur.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentUmur.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.jenisinsiden != '' || datas.jenisinsiden != null) {
                                var jenisinsiden = datas.jenisinsiden.split(',')
                                jenisinsiden.forEach(function (data) {
                                    $scope.listJenisInsiden.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentJenisInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.pelaporinsiden != '' || datas.pelaporinsiden != null) {
                                var pelaporinsiden = datas.pelaporinsiden.split(',')
                                pelaporinsiden.forEach(function (data) {
                                    $scope.listPelapor.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentPelapor.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            // if (datas.insidenpenyangkut != '' || datas.insidenpenyangkut != null) {
                            //     var insidenpenyangkut = datas.insidenpenyangkut.split(',')
                            //     insidenpenyangkut.forEach(function (data) {
                            //         $scope.listInsiden.forEach(function (e) {
                            //             for (let i in e.detail) {
                            //                 if (e.detail[i].id == data) {
                            //                     e.detail[i].isChecked = true
                            //                     var dataid = {
                            //                         "id": e.detail[i].id, "nama": e.detail[i].nama,
                            //                         "value": e.detail[i].id,
                            //                     }
                            //                     $scope.currentInsiden.push(dataid)
                            //                 }
                            //             }
                            //         })
                            //     })
                            // }

                            if (datas.insidenterjadipada != '' || datas.insidenterjadipada != null) {
                                var insidenterjadipada = datas.insidenterjadipada.split(',')
                                insidenterjadipada.forEach(function (data) {
                                    $scope.listInsidenTerjadiPada.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentInsidenTerjadiPada.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.insidenterjadi != '' || datas.insidenterjadi != null) {
                                var insidenterjadi = datas.insidenterjadi.split(',')
                                insidenterjadi.forEach(function (data) {
                                    $scope.listInsidenPasien.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentInsidenPesien.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.akibatinsiden != '' || datas.akibatinsiden != null) {
                                var akibatinsiden = datas.akibatinsiden.split(',')
                                akibatinsiden.forEach(function (data) {
                                    $scope.listAkibatInsiden.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentAkibatInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.dilakukanoleh != '' || datas.dilakukanoleh != null) {
                                var dilakukanoleh = datas.dilakukanoleh.split(',')
                                dilakukanoleh.forEach(function (data) {
                                    $scope.listTindakan.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentTindakanInsiden.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.kejadiansama != '' || datas.kejadiansama != null) {
                                var kejadiansama = datas.kejadiansama.split(',')
                                kejadiansama.forEach(function (data) {
                                    $scope.listKejadianSama.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentKejadianSama.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.jiwa != '' || datas.jiwa != null) {
                                var jiwa = datas.jiwa.split(',')
                                jiwa.forEach(function (data) {
                                    $scope.listJiwa.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentJiwa.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                            if (datas.grading != '' || datas.grading != null) {
                                var grading = datas.grading.split(',')
                                grading.forEach(function (data) {
                                    $scope.listGrading.forEach(function (e) {
                                        for (let i in e.detail) {
                                            if (e.detail[i].id == data) {
                                                e.detail[i].isChecked = true
                                                var dataid = {
                                                    "id": e.detail[i].id, "nama": e.detail[i].nama,
                                                    "value": e.detail[i].id,
                                                }
                                                $scope.currentGrading.push(dataid)
                                            }
                                        }
                                    })
                                })
                            }

                        }); //
                    }
                } else {
                    var pegawaiLogin = medifirstService.getPegawaiLogin();
                    $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                }
            }

            $scope.CariPasien = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-data-detail-pasien-general?nocm=" + $scope.item.NoRM, true).then(function (data_ih) {
                    $scope.isRouteLoading = false;
                    var datas = data_ih.data;
                    var tanggal = $scope.now;
                    var tanggalLahir = new Date(datas.tgllahir);
                    var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                    var usia = umurzz.year;
                    $scope.item.NoRM = datas.nocm;
                    $scope.item.NamaPasien = datas.namapasien;
                    $scope.item.JenisKelamin = { id: datas.jkid, jenisKelamin: datas.jeniskelamin };
                    $scope.item.TglLahir = new Date(datas.tgllahir);

                })
            }

            $scope.getJenisKelamatan = function () {
                $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: $scope.item.KeselamatanInput.jeniskesalamatanfk, jeniskeselamatan: $scope.item.KeselamatanInput.jeniskeselamatan };
            }

            $scope.Save = function () {
                if ($scope.item.KeselamatanInput == undefined) {
                    toastr.error('Peringatan, Insiden Keselamatan Belum Dipilih');
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan!')
                    .textContent('Apakah anda yakin akan menyimpan data ini?')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')

                $mdDialog.show(confirm).then(function () {
                    $scope.Simpan();
                })
            };


            $scope.reset = function () {
                kosong();
                window.history.back();
            }

            function Kosong() {
                $scope.item = {};
            }

            $scope.Simpan = function () {
                var listUmur = ""
                var listJenisInsiden = ""
                var listPelapor = ""
                var listInsiden = ""
                var listInsidenTerjadiPada = ""
                var listInsidenPasien = ""
                var listJiwa = ""
                var listAkibatInsiden = ""
                var listTindakan = ""
                var listKejadianSama = ""
                var grading = ""
                var a = ""
                var b = ""
                var c = ""
                var d = ""
                var e = ""
                var f = ""
                var g = ""
                var h = ""
                var i = ""
                var j = ""
                var k = ""
                var l = ""
                var m = ""
                var n = ""
                var o = ""
                var p = ""
                var q = ""
                var r = ""
                var s = ""
                var t = ""
                var u = ""
                var v = ""
                var w = ""
                var x = ""
                var z = ""

                for (var i = $scope.currentUmur.length - 1; i >= 0; i--) {
                    var c = $scope.currentUmur[i].id
                    b = "," + c
                    a = a + b
                }
                listUmur = a.slice(1, a.length)
                if (listUmur == undefined) {
                    toastr.error("Umur Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentJenisInsiden.length - 1; i >= 0; i--) {
                    var c = $scope.currentJenisInsiden[i].id
                    d = "," + c
                    e = e + d
                }
                listJenisInsiden = e.slice(1, e.length)
                if (listJenisInsiden == undefined) {
                    toastr.error("Jenis Insiden Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentJenisInsiden.length - 1; i >= 0; i--) {
                    var c = $scope.currentJenisInsiden[i].id
                    f = "," + c
                    g = g + f
                }
                listPelapor = g.slice(1, g.length)
                if (listPelapor == undefined) {
                    toastr.error("Pelapor Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentPelapor.length - 1; i >= 0; i--) {
                    var c = $scope.currentPelapor[i].id
                    h = "," + c
                    x = x + h
                }
                listInsidenTerjadiPada = x.slice(1, x.length)
                if (listInsidenTerjadiPada == undefined) {
                    listInsidenTerjadiPada = ""
                }
                for (var i = $scope.currentInsidenTerjadiPada.length - 1; i >= 0; i--) {
                    var c = $scope.currentInsidenTerjadiPada[i].id
                    v = "," + c
                    w = w + v
                }
                listInsiden = w.slice(1, w.length)
                if (listInsiden == undefined) {
                    listInsiden = ""
                }
                for (var i = $scope.currentInsidenPesien.length - 1; i >= 0; i--) {
                    var c = $scope.currentInsidenPesien[i].id
                    j = "," + c
                    k = k + j
                }
                listInsidenPasien = k.slice(1, k.length)
                if (listInsidenPasien == undefined) {
                    listInsidenPasien = ""
                }

                for (var i = $scope.currentJiwa.length - 1; i >= 0; i--) {
                    var c = $scope.currentJiwa[i].id
                    l = "," + c
                    m = m + l
                }
                listJiwa = m.slice(1, m.length)
                if (listJiwa == undefined) {
                    listJiwa = ""
                }

                // for (var i = $scope.currentJiwa.length - 1; i >= 0; i--) {
                //     var c = $scope.currentJiwa[i].id
                //     v = "," + c
                //     w = w + v
                // }
                // listJiwa = w.slice(1, w.length)

                for (var i = $scope.currentAkibatInsiden.length - 1; i >= 0; i--) {
                    var c = $scope.currentAkibatInsiden[i].id
                    n = "," + c
                    o = o + n
                }
                listAkibatInsiden = o.slice(1, o.length)
                if (listAkibatInsiden == undefined) {
                    toastr.error("Akibat Insiden Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentTindakanInsiden.length - 1; i >= 0; i--) {
                    var c = $scope.currentTindakanInsiden[i].id
                    p = "," + c
                    q = q + p
                }
                listTindakan = q.slice(1, q.length)
                if (listTindakan == undefined) {
                    toastr.error("Tindakan Insiden Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentKejadianSama.length - 1; i >= 0; i--) {
                    var c = $scope.currentKejadianSama[i].id
                    r = "," + c
                    s = s + r
                }
                listKejadianSama = s.slice(1, s.length)
                if (listKejadianSama == undefined) {
                    toastr.error("Insiden Kejadian Sama Belum Dipilih!")
                    return;
                }

                for (var i = $scope.currentGrading.length - 1; i >= 0; i--) {
                    var c = $scope.currentGrading[i].id
                    t = "," + c
                    u = u + t
                }
                grading = u.slice(1, u.length)
                if (grading == undefined) {
                    toastr.error("Grading Sama Belum Dipilih!")
                    return;
                }

                var listRawRequired = [
                    "item.NamaPasien|ng-model|Nama Pasien",
                    "item.NoRM|ng-model|No Rekam Medis",
                    "item.TglLahir|k-ng-model|Tanggal Lahir",
                    "item.JenisKelamin|k-ng-model|Jenis Kelamin",
                    "item.Ruangan|k-ng-model|Ruangan",
                    "item.TglMasuk|k-ng-model|Tanggal Masuk",
                    "item.KelompokPasien|k-ng-model|Penanggung Biaya",
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var dataSave = {
                        "norec": norec != undefined ? norec : '',
                        "nocm": $scope.item.NoRM,
                        "namapasien": $scope.item.NamaPasien,
                        "tglahir": moment($scope.item.TglLahir).format('YYYY-MM-DD HH:mm'),
                        "ruanganfk": $scope.item.Ruangan.value,
                        "umur": listUmur,
                        "jeniskelaminfk": $scope.item.JenisKelamin.id,
                        "penanggungbiayapasienfk": $scope.item.KelompokPasien.id,
                        "tglmasuk": moment($scope.item.TglMasuk).format('YYYY-MM-DD HH:mm'),
                        "tglinsiden": $scope.item.TglInsiden != undefined ? moment($scope.item.TglInsiden).format('YYYY-MM-DD HH:mm') : null,
                        "insiden": $scope.item.Insiden != undefined ? $scope.item.Insiden : '',
                        "kronologisinsiden": $scope.item.KronologiInsiden != undefined ? $scope.item.KronologiInsiden : '',
                        "jenisinsiden": listJenisInsiden,
                        "pelaporinsiden": listPelapor,
                        "insidenpenyangkut": listInsiden,
                        "tempatinsiden": $scope.item.lokasiInsiden != undefined ? $scope.item.lokasiInsiden : '',
                        "insidenterjadipada": listInsidenTerjadiPada,
                        "insidenterjadi": listInsidenPasien,
                        "jiwa": listJiwa,
                        "unitterkait": $scope.item.UnitKerja != undefined ? $scope.item.UnitKerja : '',
                        "akibatinsiden": listAkibatInsiden,
                        "penanganan": $scope.item.Tindakan != undefined ? $scope.item.Tindakan : '',
                        "dilakukanoleh": listTindakan,
                        "kejadiansama": listKejadianSama,
                        "langkahpenanganan": $scope.item.Penanggulangan != undefined ? $scope.item.Penanggulangan : '',
                        "pembuatlaporan": $scope.item.PembuatLaporan != undefined ? $scope.item.PembuatLaporan.namalengkap : '',
                        "tgllapor": $scope.item.TglLaporan != undefined ? moment($scope.item.TglLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "penerimalaporan": $scope.item.PenerimaLaporan != undefined ? $scope.item.PenerimaLaporan.namalengkap : '',
                        "tglterima": $scope.item.TglTerimaLaporan != undefined ? moment($scope.item.TglTerimaLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "grading": grading,
                        "insidenkeselamatanfk": $scope.item.KeselamatanInput.id,
                        "noregistrasifk": noRegistrasifk != undefined ? noRegistrasifk : null,
                        "pembuatlaporanfk": $scope.item.PembuatLaporan != undefined ? $scope.item.PembuatLaporan.id : null,
                        "penerimalaporanfk": $scope.item.PenerimaLaporan != undefined ? $scope.item.PenerimaLaporan.id : null,
                        "lain5": $scope.item.lain5 != undefined ? $scope.item.lain5 : '',
                        "lain6": $scope.item.lain6 != undefined ? $scope.item.lain6 : '',
                        "lain7": $scope.item.lain7 != undefined ? $scope.item.lain7 : '',
                        "lain9": $scope.item.lain9 != undefined ? $scope.item.lain9 : '',
                        "tim13": $scope.item.tim13 != undefined ? $scope.item.tim13 : '',
                        "petugas13": $scope.item.petugas13 != undefined ? $scope.item.petugas13 : '',
                    }
                    var objSave = {
                        data: dataSave,
                    }
                    medifirstService.post('pmkp/save-data-insiden-internal', objSave).then(function (e) {
                        Kosong();
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }
            //** BATAS SUCI */
        }
    ]);
});