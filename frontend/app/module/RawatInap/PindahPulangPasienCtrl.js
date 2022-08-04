define(['initialize'], function(initialize) {
    'use strict';
    // initialize.controller('PindahPulangPasienCtrl', ['$q', '$rootScope', '$scope', '$mdDialog', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'FindPasien', 'ManagePasien', 'ManageServicePhp',
    //     function($q, $rootScope, $scope,  $mdDialog, ModelItem, $state, cacheHelper, dateHelper, FindPasien, ManagePasien, manageServicePhp) {
    initialize.controller('PindahPulangPasienCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function(saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.isNext = true;
            var responData = '';
            var norecOrder = '';
            var norecRpp = ''
            $scope.PenyebabKematianManual = false;
            $scope.cacheruanganLast = {};
            $scope.now = new Date();
            $scope.currentNorecPD = $state.params.norecPD;
            // $scope.item.pasien.norec_apd = $state.params.norecAPD;
            $scope.doneLoad = $rootScope.doneLoad;
            $rootScope.isOpen = true;
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            };
            $scope.item.tglKeluar = $scope.now;
            $scope.item.tglRencanaKeluar = $scope.now;
            $scope.item.tglMeninggal = $scope.now;
            $scope.item.tglRujuk = $scope.now;
            $scope.listKamar = []
            $scope.listNoBed = []
            $scope.listJenisRujukan = [{ 'id': 1, 'name': 'Faskes 1' }, { 'id': 2, 'name': 'Faskes 2' }]
            firstLoad();
            getdataCombo();
            $scope.noCM = $state.params.noCM;
            $rootScope.showMenu = false;
            $rootScope.showMenuDetail = false;
            $scope.$watch('item.jenisRujukan', function(e) {
                if (e === undefined) return;

                medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes=" +
                        e, true, 10, 10)
                    .then(function(x) {
                        $scope.listFaskess = x;
                    })

            })

            function getdataCombo() {

                medifirstService.get("rawatinap/get-combo-pindahpasien")
                    .then(function(e) {
                        for (var i = 0; i < e.data.statuskeluar.length; i++) {
                            e.data.statuskeluar[i].id = parseInt(e.data.statuskeluar[i].id)
                        }

                        $scope.listStatusKeluar = e.data.statuskeluar;
                        $scope.listKondisiPasien = e.data.kondisipasien;
                        // $scope.listKelas=e.data.kelas; 
                        $scope.listStatusPulang = e.data.statuspulang;
                        $scope.listRuangan = e.data.ruanganinap;
                        // $scope.listKamar=e.data.kamar; 
                        $scope.listHubunganKel = e.data.hubungankeluarga;
                        $scope.listPenyebabKematian = e.data.penyebabkematian;
                        $scope.listDokter = e.data.dataDokters;
                    })
            }

            function firstLoad() {
                $scope.isRouteLoading = true;
                // var objectruanganlastfk='';
                //  var CachePindah = cacheHelper.get('CachePindah');
                //  if(CachePindah != undefined){
                //     objectruanganlastfk = CachePindah;
                //     $scope.cacheruanganLast=objectruanganlastfk;
                medifirstService.get("rawatinap/get-pasien-bynorec/" +
                        $state.params.norecPD +
                        "/" +
                        $state.params.norecAPD)
                    .then(function(e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data[0];
                    })

                medifirstService.get("rawatinap/get-nosep-by-norec-pd/" + $state.params.norecPD).then(function(e) {
                    $scope.item.noSep = e.data.nosep;
                })

                medifirstService.get("rawatinap/get-pelayanan/" +
                        $state.params.norecPD +
                        "/" +
                        $state.params.norecAPD)
                    .then(function(e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pelayanan = e.data;
                    })
                    //   }
            }

            $scope.pilihRuangan = function(id) {
                var ruanganId = id;
                $scope.item.kelas = ""
                $scope.item.kamar = ""
                $scope.item.nomorTempatTidur = ""
                medifirstService.get("rawatinap/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function(dat) {
                        $scope.listKelas = dat.data.kelas;
                    });
            }

            $scope.$watch('item.penyebabKematian', function(e) {
                if (e === undefined) return;
                if ($scope.item.penyebabKematian.penyebabkematian == "LAINNYA") {
                    $scope.PenyebabKematianManual = true;
                } else {
                    // $scope.item.penyebabKematian = undefined;
                    $scope.PenyebabKematianManual = false;
                }
            });

            $scope.$watch('item.kelas', function(e) {
                $scope.item.kamar = ""
                $scope.item.nomorTempatTidur = ""
                if (e === undefined) return;
                var kelasId = "idKelas=" + $scope.item.kelas.id;
                var ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                medifirstService.get("rawatinap/get-kamarbyruangankelas?" + kelasId + ruanganId)
                    .then(function(b) {
                        $scope.listKamar = _.filter(b.data.kamar, function(v) {
                            return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                        })
                    });
            });
            $scope.$watch('item.kamar', function(e) {
                $scope.item.nomorTempatTidur = ""
                if (e === undefined) return;
                var kamarId = $scope.item.kamar.id;
                medifirstService.get("rawatinap/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function(a) {
                        $scope.listNoBed = _.filter(a.data.bed, function(v) {
                            if ($scope.item.rawatGabung == true) {
                                return v.statusbed === "ISI";
                            } else {
                                return v.statusbed === "KOSONG";
                            }
                        })
                    })
            });
            $scope.item.kp = 1
            $scope.Save = function() {
                if (!$scope.item.statusKeluar) {
                    messageContainer.error('Status keluar belum di pilih');
                    return;
                } else if ($scope.item.statusKeluar.id === 2) {
                    $scope.popUpKasusPenyakit.center().open()
                } else if ($scope.item.statusKeluar.id != 2 && $scope.item.pasien.iscovid == '19' || $scope.item.pasien.iscovid == true) {
                    $scope.popUpStatusPulangCovid.center().open()
                } else {
                    $scope.Savee();
                }
            }

            $scope.Savee = function() {
                $scope.popUpKasusPenyakit.close();
                $scope.popUpStatusPulangCovid.close();
                if ($scope.item.statusKeluar.id === 2 && $scope.item.kelas == undefined) {
                    messageContainer.error('Kelas Belum Dipilih');
                    return;
                }
                if ($scope.item.statusKeluar.id === 1 || $scope.item.statusKeluar.id === 5) {
                    for (let i = 0; i < $scope.item.pelayanan.length; i++) {
                        if ($scope.item.pelayanan[i].produkfk == 4057037 || $scope.item.pelayanan[i].produkfk == 4074850 || $scope.item.pelayanan[i].produkfk == 4074857 || $scope.item.pelayanan[i].produkfk == 4075145) {
                            // alert ('Tes')
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Pastikan PELAYANAN sudah di Input semua ! Lanjut Simpan? ')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function() {
                                var objAkomodasi = {
                                    noregistrasi: $scope.item.pasien.noregistrasi
                                }
                                medifirstService.post('rawatinap/save-akomodasi-tea', objAkomodasi).then(function(data) {

                                })
                                $scope.SavePulang();


                            })
                            return;
                        } else {

                        }
                    }
                }
                if ($scope.item.statusKeluar.id === 1 || $scope.item.statusKeluar.id === 5) {
                    for (let i = 0; i < $scope.item.pelayanan.length; i++) {
                        if ($scope.item.pelayanan[i].produkfk == 4057037 || $scope.item.pelayanan[i].produkfk == 4074850 || $scope.item.pelayanan[i].produkfk == 4074857 || $scope.item.pelayanan[i].produkfk == 4075145) {
                            alert('ADMINISTRASI RAWAT INAP BELUM DIINPUT ! MOHON INPUT TERLEBIH DAHULU !')
                            return;
                        }
                    }
                }
                if (!$scope.item.statusKeluar) {
                    messageContainer.error('Status keluar belum di pilih');
                    return;
                } else if ($scope.item.statusKeluar.id === 2) {
                    $scope.SavePindah()
                }
                // else if($scope.item.statusKeluar.id===1 || $scope.item.statusKeluar.id===5) {
                //     for(let i = 0; i < $scope.item.pelayanan.length; i++){
                //         if($scope.item.pelayanan[i].produkfk == 4057037 || $scope.item.pelayanan[i].produkfk == 4074850 || $scope.item.pelayanan[i].produkfk == 4074857 || $scope.item.pelayanan[i].produkfk == 4075145){
                //         // alert ('Tes')
                //         var confirm = $mdDialog.confirm()
                //         .title('Peringatan')
                //         .textContent('Pastikan PELAYANAN sudah di Input semua ! Lanjut Simpan? ')
                //         .ariaLabel('Lucky day')
                //         .cancel('Tidak')
                //         .ok('Ya')
                //     $mdDialog.show(confirm).then(function () {
                //         var objAkomodasi = {
                //             noregistrasi: $scope.item.pasien.noregistrasi
                //         }
                //         medifirstService.post('rawatinap/save-akomodasi-tea',objAkomodasi).then(function(data){

                //         })
                //         $scope.SavePulang();


                //     })
                //         return;
                //         } else {

                //         }
                //     }
                // } 
                // else if($scope.item.statusKeluar.id===1 || $scope.item.statusKeluar.id===5) {
                //     for(let i = 0; i < $scope.item.pelayanan.length; i++){
                //         if($scope.item.pelayanan[i].produkfk != 4057037 || $scope.item.pelayanan[i].produkfk == 4074850 || $scope.item.pelayanan[i].produkfk == 4074857 || $scope.item.pelayanan[i].produkfk == 4075145){
                //             alert('ADMINISTRASI RAWAT INAP BELUM DIINPUT ! MOHON INPUT TERLEBIH DAHULU !')
                //             return;
                //         } 
                //     }
                // }
                else {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Pastikan PELAYANAN sudah di Input semua ! Lanjut Simpan? ')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function() {
                        var objAkomodasi = {
                            noregistrasi: $scope.item.pasien.noregistrasi
                        }
                        medifirstService.post('rawatinap/save-akomodasi-tea', objAkomodasi).then(function(data) {

                        })
                        $scope.SavePulang();


                    })

                }
            }
            $scope.SavePindah = function() {
                if ($scope.item.pasien.objecttitlefk != 4 && $scope.item.rawatGabung === true) {
                    alert('RAWAT GABUNG HANYA UNTUK PASIEN BAYI !')
                    return;
                }
                if ($scope.item.nomorTempatTidur == undefined) {
                    alert("Nomor Bed Harus Diisi!!")
                    return;
                }
                $scope.hideBtnSimpan = false
                var statusKeluarId = "";
                if ($scope.item.statusKeluar != undefined) {
                    statusKeluarId = $scope.item.statusKeluar.id;
                }
                // tgl 22 April 2021 hijau ke merah boleh 1 faktur
                // if($scope.item.pasien.iscovid==null && $scope.item.ruangan.iscovid==19){
                //     alert("Pasien dari Zona Hijau harus daftar ulang ke Zona Merah!!")
                //     return;
                // }else 
                if ($scope.item.pasien.iscovid == 19 && $scope.item.ruangan.iscovid == '222') {
                    alert("Pasien dari Zona Merah harus daftar ulang ke Zona Hijau!!")
                    return;
                }
                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id;
                }
                var kelasId = "";
                if ($scope.item.kelas != undefined) {
                    kelasId = $scope.item.kelas.id;
                }
                var kamarIds = null;
                if ($scope.item.kamar != undefined) {
                    kamarIds = $scope.item.kamar.id;
                }

                var nomorTempatTidurs = null;
                if ($scope.item.nomorTempatTidur != undefined) {
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;
                }

                var dokterId = "";
                if ($scope.item.dokter != undefined) {
                    dokterId = $scope.item.dokter.id;
                }

                var keterangans = "";
                if ($scope.item.keteranganLainnya != undefined) {
                    keterangans = $scope.item.keteranganLainnya;
                }
                var hubungankeluargaId = "";
                if ($scope.item.hubunganKeluarga != undefined) {
                    hubungankeluargaId = $scope.item.hubunganKeluarga.id;
                }
                var kondisiKeluarId = "";
                if ($scope.item.kondisipasien != undefined) {
                    kondisiKeluarId = $scope.item.kondisipasien.id;
                }
                var penyebabkematianId = "";
                if ($scope.item.penyebabKematian != undefined) {
                    penyebabkematianId = $scope.item.penyebabKematian.id;
                }

                var statusPulangId = "";
                if ($scope.item.statusPulang != undefined) {
                    statusPulangId = $scope.item.statusPulang.id;
                }

                var strukorder = {
                    norecorder: norecOrder,
                    norecrpp: norecRpp,
                    tglorder: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                }

                var pasiendaftar = {
                    tglregistrasi: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    tglregistrasidate: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD'),
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    objectruanganasalfk: $scope.item.pasien.objectruanganlastfk,
                    objectruanganlastfk: ruanganId,
                    objectkelasfk: kelasId,
                    objecthubungankeluargaambilpasienfk: hubungankeluargaId,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    norec_pd: $scope.currentNorecPD,
                    objectkelompokpasienlastfk: $scope.item.pasien.objectkelompokpasienlastfk,
                    nocmfk: $scope.item.pasien.nocmfk,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    statuspasien: $scope.item.pasien.statuspasien,
                    objectkasuspenyakitlastfk: $scope.item.kp,

                }
                var antrianpasiendiperiksa = {
                    tglregistrasi: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectruanganasalfk: $scope.item.pasien.objectruanganlastfk,
                    objectruanganlastfk: ruanganId,
                    objectkelasfk: kelasId,
                    objectkamarfk: kamarIds,
                    nobed: nomorTempatTidurs,
                    tglmasuk: moment($scope.item.tglRencanaKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    // israwatgabung:  $scope.model.rawatGabung === true ? 1 : 0,
                    objectasalrujukanfk: $scope.item.pasien.objectasalrujukanfk,
                    norec_apd: $scope.item.pasien.norec_apd,
                    keteranganpindah: keterangans,
                    israwatgabung: $scope.item.rawatGabung === true ? 1 : 0,
                    israwattitipan: $scope.item.rawatTitipan === true ? 1 : 0,
                }

                var objSave = {
                    strukorder: strukorder,
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }

                // manageServicePhp.saveOrderPindahPasien(objSave).then(function (e) {
                //     $scope.resultAPD=e.data.dataAPD;
                //     responData=e.data;
                //     $scope.isSimpan = true;
                //     $scope.isBatal = true;
                //     $scope.isNext=false;                                             
                // })

                medifirstService.post('rawatinap/save-pindah-pasien', objSave).then(function(e) {
                    $scope.resultAPD = e.data.dataAPD;
                    responData = e.data;
                    $scope.isSimpan = true;
                    $scope.isBatal = true;
                    $scope.isNext = false;
                    //##save Logging user
                    medifirstService.get("sysadmin/logging/save-log-pindah-ruangan?norec_apd=" +
                            $scope.resultAPD.norec
                        ).then(function(data) {
                            window.history.back();
                        })
                        //##end                                         
                })
            }

            $scope.SavePulang = function() {
                medifirstService.get("tatarekening/tindakan/get-list-pertanyaan?objectmappingindikatortoprodukfk=544").then(function(dat) {
                    $scope.item.indikator = dat.data.data[0].indikator;
                    $scope.item.tidakDitemukan = false;
                    $scope.listPertanyaan = dat.data.data;
                    $scope.popupPilihanIndikator.center().open();
                })
            }

            $scope.SaveFix = function(x) {
                debugger
                let ada = 'false';
                let dekubitus = 'false';
                let statVariable = 'false';
                let persentase = 0;
                if ($scope.listPertanyaan.length > 0) {
                    for (var i = 0; i < $scope.listPertanyaan.length; i++) {

                        if ($scope.listPertanyaan[i].status == true) {
                            ada = 'true';
                            persentase = persentase + parseInt($scope.listPertanyaan[i].bobot);
                        } else {
                            $scope.listPertanyaan[i].status == false;
                        }
                        if ($scope.item.tidakDitemukan == false) {
                            if (persentase >= 50) {
                                statVariable = 'true';
                            }
                        }
                    }
                }

                if (ada == false && $scope.item.tidakDitemukan == false) {
                    toastr.error('Pertanyaan harus di isi')
                    return
                }

                if ($scope.item.dekubitus == undefined) {
                    alert("Kasus DEKUBITUS Belum Di Pilih!!")
                    return;
                } else {
                    if ($scope.item.dekubitus == 'dekubitus') {
                        dekubitus = 'true';
                    } else {
                        dekubitus = 'false';
                    }
                }

                $scope.popupPilihanIndikator.close();

                if ($scope.item.pasien.iscovid == '19' && $scope.item.pulangCovid == undefined) {
                    alert("Kondisi Pulang Covid Belum Di Pilih!!")
                    return;
                }
                var statusKeluarId = null;
                if ($scope.item.statusKeluar != undefined) {
                    statusKeluarId = $scope.item.statusKeluar.id;
                }

                var ruanganId = null;
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id;
                }

                var hubungankeluargaId = null;
                var hubunganKeluarga = null;
                if ($scope.item.hubunganKeluarga != undefined) {
                    hubungankeluargaId = $scope.item.hubunganKeluarga.id;
                    hubunganKeluarga = $scope.item.hubunganKeluarga.hubungankeluarga;
                }
                var kondisiKeluarId = null;
                var kondisiKeluar = null;
                if ($scope.item.kondisiKeluar != undefined) {
                    kondisiKeluarId = $scope.item.kondisiKeluar.id;
                    kondisiKeluar = $scope.item.kondisiKeluar.kondisipasien
                }
                var PenyebabKematianText = ""
                if ($scope.item.PenyebabKematianText != undefined) {
                    PenyebabKematianText = $scope.item.PenyebabKematianText
                }
                var penyebabkematianId = null;
                if ($scope.item.penyebabKematian != undefined) {
                    penyebabkematianId = $scope.item.penyebabKematian.id;
                }
                var statusPulangId = null;
                if ($scope.item.statusPulang != undefined) {
                    statusPulangId = $scope.item.statusPulang.id;
                }
                var namaPembawaPulang = null;
                if ($scope.item.namaPembawaPulang != undefined) {
                    namaPembawaPulang = $scope.item.namaPembawaPulang;
                }
                var objectpulangcovidfk = null;
                if ($scope.item.pulangCovid != undefined) {
                    objectpulangcovidfk = $scope.item.pulangCovid;
                }

                var strukorder = {
                    norecorder: norecOrder,
                    norecrpp: norecRpp,
                    tglorder: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                }

                var pasiendaftar = {
                    namalengkapambilpasien: namaPembawaPulang,
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    objectruanganlastfk: ruanganId,
                    objecthubungankeluargaambilpasienfk: hubungankeluargaId,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    tglmeninggal: moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss'),
                    // tglpulang: moment($scope.item.tglRencanaKeluar).format('YYYY-MM-DD hh:mm:ss'), #yg egi
                    tglpulang: moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    norec_pd: $scope.currentNorecPD,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    nocmfk: $scope.item.pasien.nocmfk,
                    keteranganpulang: "Pulang dengan kondisi : " + kondisiKeluar,
                    keterangankematian: PenyebabKematianText,
                    objectpulangcovidfk: objectpulangcovidfk,
                    hap: statVariable,
                    dekubitus: dekubitus

                }
                var antrianpasiendiperiksa = {
                    objectruanganlastfk: $scope.item.pasien.objectruanganlastfk,
                    norec_apd: $scope.item.pasien.norec_apd,

                }
                var objSave = {
                        strukorder: strukorder,
                        pasiendaftar: pasiendaftar,
                        antrianpasiendiperiksa: antrianpasiendiperiksa
                    }
                    // var dataJson = {
                    //     "noregistrasifk": $scope.norecPDbuttonSelected,
                    //     "objectstatuspulangfk": $scope.pulang.statuspulang.id,
                    //     "noregistrasifkapd": $scope.norecAPDbuttonSelected,
                    //     'objectkondisipasienfk' :kondisikeluar,
                    //     'objectpenyebabkematianfk': objectpenyebabkematianfk,
                    //     'tglmeninggal': tglMeninggal,
                    // };
                debugger;
                var meninggal = {
                    "noregistrasi": $scope.item.pasien.noregistrasi,
                    "noregistrasifk": $scope.item.pasien.norec_pd
                }
                debugger
                if ($scope.item.statusKeluar.id == 4) {
                    if ($scope.item.diRujukKe == undefined) {
                        toastr.error('Tujuan Rujukan Belum di Isi', 'Info');
                        return;
                    }
                    if ($scope.item.alasanRujuk == undefined) {
                        toastr.error('Alasan Rujukan Belum di Isi', 'Info');
                        return;
                    }
                    if ($scope.item.alamatPerujuk == undefined) {
                        toastr.error('Alamat Rujukan Belum di Isi', 'Info');
                        return;
                    }
                    if ($scope.item.dokterPerujuk == undefined) {
                        toastr.error('Dokter Perujuk Belum di Isi', 'Info');
                        return;
                    }
                    var objRujuk = {
                        noregistrasifk: $scope.item.pasien.norec_pd,
                        nocmfk: $scope.item.pasien.nocmfk,
                        tglRujuk: moment($scope.item.tglRujuk).format('YYYY-MM-DD HH:mm:ss'),
                        faskestujuan: $scope.item.diRujukKe.nama,
                        alasanRujuk: $scope.item.alasanRujuk,
                        alamatPerujuk: $scope.item.alamatPerujuk,
                        kodefaskestujuan: $scope.item.diRujukKe.kode,
                        dokter: $scope.item.dokterPerujuk.id
                    }
                }



                // if (statusKeluarId != 5) {
                //     manageServicePhp.saveOrderPulangPasien(objSave).then(function (e) {
                //         $scope.resultAPD=e.data.dataAPD;
                //         responData=e.data;
                //         $scope.isSimpan = true;
                //         $scope.isBatal = true;
                //         $scope.isNext=false;                                             
                //     });
                // }


                medifirstService.post('rawatinap/save-pulang-pasien', objSave).then(function(e) {
                    if ($scope.item.pasien.israwatinap == 'true' && $scope.item.pasien.objectkelompokpasienlastfk == '2' &&
                        $scope.item.statusKeluar.id == 1) {
                        $scope.setTglPulangBridging()
                    }
                    if ($scope.item.statusKeluar.id == 4) {
                        medifirstService.post('rawatinap/save-rujuk-pasien', objRujuk).then(function(e) {

                        })
                    }

                    // $scope.resultAPD=e.data.dataAPD;
                    responData = e.data;
                    $scope.isSimpan = true;
                    $scope.isBatal = true;
                    $scope.isNext = false;
                    //##save Logging user
                    medifirstService.get("sysadmin/logging/save-log-pulang-pasien?norec_pd=" +
                        $scope.currentNorecPD
                    ).then(function(data) {
                        window.history.back();
                    })
                    if ($scope.item.statusKeluar.id == 5) {
                        medifirstService.post('rawatinap/save-logging-meninggal2', meninggal).then(function(e) {

                        })
                    }
                    // if($scope.pulang.statuspulang.id==18){
                    //     medifirstService.post('rawatinap/save-logging-meninggal', dataJson).then(function (e) {

                    //     })
                    // }
                    //##end         

                })
                var objAkomodasi = {
                    noregistrasi: $scope.item.pasien.noregistrasi
                }
                medifirstService.post('rawatinap/hapus-akomodasi-tea', objAkomodasi).then(function() {

                })
            }

            $scope.setTglPulangBridging = function() {
                var dateGenerate = {
                    'data': {
                        "request": {
                            "t_sep": {
                                "noSep": $scope.item.noSep,
                                "tglPulang": new moment(moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD'),
                                "user": "ramdan"
                            }
                        }

                    }
                }
                medifirstService.post('bridging/bpjs/update-tglpulang', dateGenerate).then(function(e) {
                    toastr.info(e.data.metaData.message, 'Set Tgl Pulang BPJS')
                }).then(function() {

                });
            }
            $scope.cekRawatTitipan = function(data) {
                $scope.item.rawatTitipan = data;
            }
            $scope.cekRawatGabung = function(bool) {
                if (bool === true) {
                    if ($scope.item.pasien.id_ibu != undefined) {
                        medifirstService.get("rawatinap/get-kamar-ruangan-ibu?id_ibu=" + $scope.item.pasien.id_ibu +
                                "&nocm=" + $scope.item.pasien.nocm)
                            .then(function(dat) {
                                if (dat.data.length > 0) {
                                    $scope.listKamar = []
                                    $scope.listNoBed = []
                                    $scope.ruanganIbu = dat.data[0];
                                    $scope.listKamar.push({ id: dat.data[0].objectkamarfk, namakamar: dat.data[0].namakamar })
                                    $scope.listNoBed.push({ id: dat.data[0].nobed, reportdisplay: dat.data[0].tempattidur })
                                    $scope.item.ruangan = { id: dat.data[0].objectruanganlastfk, namaruangan: dat.data[0].namaruangan }
                                    $scope.item.kelas = { id: dat.data[0].kelasfk, namakelas: dat.data[0].namakelas }
                                    $scope.item.kamar = { id: dat.data[0].objectkamarfk, namakamar: dat.data[0].namakamar }
                                    $scope.item.nomorTempatTidur = { id: dat.data[0].nobed, reportdisplay: dat.data[0].tempattidur }

                                } else {
                                    $scope.listKamar = []
                                    $scope.listNoBed = []
                                    $scope.item.ruangan = ""
                                    $scope.item.kamar = ""
                                    $scope.item.nomorTempatTidur = ""
                                    $scope.item.kelas = ""
                                }

                            })
                    } else {
                        $scope.item.rawatGabung = false
                        $scope.popUpCariRmIbu.center().open()
                    }
                } else {
                    $scope.listKamar = []
                    $scope.listNoBed = []
                    $scope.item.ruangan = ""
                    $scope.item.kamar = ""
                    $scope.item.nomorTempatTidur = ""
                    $scope.item.kelas = ""
                }
            }

            $scope.VerificationNamaIbu = function() {
                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-nocm-ibu?noCm=" + $scope.item.NoCM)
                    .then(function(e) {
                        $scope.isRouteLoading = false;
                        if (e.data.data.length == 0) {
                            $scope.isBusyNoCm = false;
                            toastr.error('Data tidak ditemukan', 'Informasi');
                        } else {
                            $scope.item.rmibu = e.data.data[0];
                            $scope.item.rmibu.noTelpon = e.data.data[0].notelepon + ' - ' + e.data.data[0].nohp
                            $scope.item.rmibu.tglLahir = new moment(e.data.data[0].tgllahir).format('YYYY-MM-DD HH:mm');
                        }
                        if (!$scope.$$phase)
                            $scope.$apply();
                    })
            }
            $scope.saveRmIbu = function() {
                if ($scope.item.rmibu.id == undefined || $scope.item.rmibu.id == null) {
                    toastr.error('RM Ibu harus diisi')
                    return
                }
                if ($scope.item.pasien.nocmfk == undefined || $scope.item.pasien.nocmfk == null) {
                    toastr.error('RM Pasien Kosong harus diisi')
                    return
                }
                var objAkomodasi = {
                    idibu: $scope.item.rmibu.id,
                    nocmfk: $scope.item.pasien.nocmfk
                }
                medifirstService.post('registrasi/update-idibu', objAkomodasi).then(function(data) {
                    if (data.status == 201) {
                        $scope.popUpCariRmIbu.close();
                        firstLoad();
                    }
                })
            }

            $scope.Back = function() {
                window.history.back()
            }

            //End
        }
    ]);
});