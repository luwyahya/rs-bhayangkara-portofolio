define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiRuanganCtrl', ['MedifirstService', '$scope', '$state', '$mdDialog', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem',
        function (medifirstService, $scope, $state, $mdDialog, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem) {
            $scope.now = new Date();
            $scope.dataItem = {};
            $scope.itemRiwayat = {};
            $scope.currentNoCm = $state.params.noCm;
            $scope.currentNorec = $state.params.noRec;
            $scope.currentbpJS = $state.params.bpJS;
            $scope.currentnorujukan = $state.params.norujukan;
            $scope.currentfaskes = $state.params.faskes;
            var norecPD = '';
            var noRegistrasis = '';
            var norecAPD = '';
            var isRegisOnline = '';
            var NomorRm = '';
            var sensus
            var kdProviderP
            var nmProvider
            var noantrianLoket = 0;
            $scope.isTelemedicine = 'false';
            $scope.isSimpanAsuransi = true;
            $scope.isNext = true;
            var dirawat = 0;
            var kunjungan = 0;
            $scope.item = {};
            $scope.itemD = {};
            $scope.diag = {};
            $scope.item.tglRegistrasi = $scope.now;
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            $scope.model.tglPelayanan = $scope.now;
            $scope.isDaftarKeDua = false;
            $scope.isLoadEdit = false;
            $scope.istempatLaporan = true;
            $scope.isPasienBpjs = false
            $scope.isBpjsRJ = false
            $scope.isBpjsRJsep = false
            $scope.bpjs = true;
            $scope.penjagaanTidakDitanggung = false;
            $scope.penjagaanBedaInstalasi = false;
            var ppkRumahSakit = "0119R004"
            var namappkRumahSakit = "RS BHAYANGKARA TK IV CIANJUR"
            var namafield = "kodePPKRujukan"
            $scope.listDPJP = []
            $scope.listDPJP2 = []
            $scope.listDPJPTujuanEdit = []
            var datas = [];
            var kelasDitanggungCodeInaCbg = null
            var kelasDitanggungNamaInaCbg = null
            var jenisPel = ""
            var responData = "";
            var kdSpesialis = '';
            $scope.insert = {};
            var chacePenunjang = cacheHelper.get('isPenunjang');
            var cacheRegisOnline = cacheHelper.get('CacheRegisOnline');
            var chacKhususAja = cacheHelper.get('cacheKhusus');

            $scope.isKunjunganPertamaBPJS = true;
            $scope.isPemberiSurat = true
            $scope.isTujuanKunjungan = true
            $scope.isflagProcedure = true
            $scope.iskdPenunjang = true
            $scope.isassesmentPel = true
            $scope.isDpjpMelayani = true

            if (chacePenunjang != undefined) {
                if (chacKhususAja != undefined) {
                    $scope.listRuangan = $scope.listRuanganRajal;
                } else {
                    $scope.isPenunjang = chacePenunjang
                    var listruangan = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                    $scope.listRuangan = listruangan
                }

            }
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.dataUser = medifirstService.getUserLogin();
            medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                $scope.listPoli = data;

            });
            $scope.captionRujukan = 'No Rujukan'
            medifirstService.get('sysadmin/settingdatafixed/get/' + namafield).then(function (dat) {
                ppkRumahSakit = dat.data
            })
            medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })

            medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                    if (data.data.metaData.code == 200) {
                        $scope.listDPJP2 = data.data.response.list;
                        $scope.listDPJP = data.data.response.list;
                    } else
                        toastr.info('Dokter DPJP tidak ada', 'Info')
                });

            $scope.isShowLaka = false
            $scope.showLakaLantas = function () {
                $scope.isShowLaka = !$scope.isShowLaka;
            }

            $scope.listPenjaminLaka = [{
                "id": 12,
                "name": "Jasa Raharja PT",
                "value": 1
            }, {
                "id": 13,
                "name": "BPJS Ketenagakerjaan",
                "value": 2
            }, {
                "id": 14,
                "name": "TASPEN PT",
                "value": 3
            }, {
                "id": 15,
                "name": "ASABRI PT",
                "value": 4
            }];

            $scope.ListAsuransi = [
                { "id": "1", "name": "No. SEP Otomatis" }
            ];
            $scope.listLakaLantas = [
                { "id": "0", "name": "Tidak Lakalantas" },
                { "id": "1", "name": "Ya Lakalantas" }
            ];
            $scope.listtujuanKunj = [
                { "id": "0", "name": "Normal" },
                { "id": "1", "name": "Prosedur" },
                { "id": "2", "name": "Konsul Dokter" }
            ];
            $scope.listflagProcedure = [
                { "id": "0", "name": "Prosedur Tidak Berkelanjutan" },
                { "id": "1", "name": "Prosedur dan Terapi Berkelanjutan" },
            ];
            $scope.listkdPenunjang = [
                { "id": "1", "name": "Radioterapi" },
                { "id": "2", "name": "Kemoterapi" },
                { "id": "3", "name": "Rehabilitasi Medik" },
                { "id": "4", "name": "Rehabilitasi Psikososial" },
                { "id": "5", "name": "Transfusi Darah" },
                { "id": "6", "name": "Pelayanan Gigi" },
                { "id": "7", "name": "Laboratorium" },
                { "id": "8", "name": "USG" },
                { "id": "9", "name": "Farmasi" },
                { "id": "10", "name": "Lain-Lain" },
                { "id": "11", "name": "MRI" },
                { "id": "12", "name": "HEMODIALISA" },
            ];
            $scope.listassesmentPel = [
                { "id": "1", "name": "Poli spesialis tidak tersedia pada hari sebelumnya" },
                { "id": "2", "name": "Jam Poli telah berakhir pada hari sebelumnya" },
                { "id": "3", "name": "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
                { "id": "4", "name": "Atas Instruksi RS" },
                { "id": "5", "name": "Tujuan Kontrol" },
            ];
            var cacheAsalRujuk = ''
            $scope.model.lakalantas = $scope.listLakaLantas[0]
            $scope.isCheckSEP = true;
            $scope.model.lakalantas = false;

            medifirstService.getPart("bridging/bpjs2/get-ref-propinsi", true, true, 10).then(function (data) {
                $scope.listPropinsi = data;
            });
            var kodePropinsi = "";
            var kodeKab = "";
            $scope.$watch('model.propinsi', function (e) {
                if (e === undefined) return;
                kodePropinsi = e.kode
                medifirstService.getPart("bridging/bpjs2/get-ref-kabupaten?kodePropinsi=" + kodePropinsi, true, true, 10).then(function (data) {
                    $scope.listKabupaten = data;
                    if (dataKabupaten != '')
                        $scope.model.kabupaten = dataKabupaten
                });
            })

            $scope.$watch('insert.poli', function (e) {
                if (e.kode == "IGD") {
                    if ($scope.poliRujukanKode != e.kode) {
                        $scope.isPemberiSurat = false
                        $scope.isTujuanKunjungan = false
                        $scope.isflagProcedure = false
                        $scope.iskdPenunjang = false
                        $scope.isassesmentPel = false
                        $scope.isDpjpMelayani = true
                        delete $scope.model.skdp
                        delete $scope.model.DPJPMelayani
                        delete $scope.model.dokterDPJP
                        delete $scope.model.flagProcedure
                        delete $scope.model.kdPenunjang
                        delete $scope.model.assesmentPel
                        $scope.model.noRujukan = ""
                        $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                    }
                } else {
                    if ($scope.poliRujukanKode != undefined) {
                        if ($scope.poliRujukanKode == 'HDL') {

                        } else if ($scope.poliRujukanKode != e.kode) {
                            $scope.isTujuanKunjungan = false
                            $scope.isflagProcedure = false
                            $scope.iskdPenunjang = false
                            $scope.isassesmentPel = true
                            $scope.isDpjpMelayani = true
                            $scope.isPemberiSurat = false
                            delete $scope.model.skdp
                            delete $scope.model.DPJPMelayani
                            delete $scope.model.dokterDPJP
                            delete $scope.model.flagProcedure
                            delete $scope.model.kdPenunjang
                            delete $scope.model.assesmentPel
                            $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                            $scope.listassesmentPel = [
                                { "id": "1", "name": "Poli spesialis tidak tersedia pada hari sebelumnya" },
                                { "id": "2", "name": "Jam Poli telah berakhir pada hari sebelumnya" },
                                { "id": "3", "name": "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
                                { "id": "4", "name": "Atas Instruksi RS" },
                            ];
                        }
                    }
                }
            })

            $scope.$watch('model.kabupaten', function (e) {
                if (e === undefined) return;
                kodeKab = e.kode
                medifirstService.getPart("bridging/bpjs2/get-ref-kecamatan?kodeKabupaten=" + kodeKab, true, true, 10).then(function (data) {
                    $scope.listKecamatan = data;
                    if (dataKecamatan != '')
                        $scope.model.kecamatan = dataKecamatan
                });
            })
            $scope.$watch('model.lakalantas', function (e) {
                if (e === false) {
                    delete $scope.model.propinsi
                    delete $scope.model.kabupaten
                    delete $scope.model.kecamatan
                    delete $scope.model.nomorSepSuplesi
                    delete $scope.model.keteranganLaka
                }
            })

            GetCombo();

            function cekPsnDaftarThisMonth(nocm) {
                medifirstService.get('registrasi/get-pasien-pernah-daftar/' + nocm).then(function (e) {
                    debugger;
                    if (e.data.jml > 0) {
                        $scope.diag = e.data;
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
            $scope.checkKepesertaanByNoBpjs = function () {
                // if (!$scope.model.cekNomorPeserta) return;

                if ($scope.model.sendiri === true) return;
                if ($scope.model.cekNomorPeserta == true) {

                    if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                    if ($scope.model.rawatInap === true || $scope.item.pasien.kdinternal == "IGD") {
                        $scope.isLoadingNoKartu = true;
                        medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                var tglLahir = new Date(e.data.response.peserta.tglLahir);
                                $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                                $scope.model.namaPeserta = e.data.response.peserta.nama;
                                $scope.model.tglLahir = tglLahir;
                                $scope.model.noIdentitas = e.data.response.peserta.nik;
                                $scope.model.kelasBridg = {
                                    id: parseInt(e.data.response.peserta.hakKelas.kode),
                                    kdKelas: e.data.response.peserta.hakKelas.kode,
                                    nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                    namakelas: e.data.response.peserta.hakKelas.keterangan,
                                };
                                if ($scope.model.kelasBridg.id == 1) {
                                    $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                } else if ($scope.model.kelasBridg.id == 2) {
                                    $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                } else if ($scope.model.kelasBridg.id == 3) {
                                    $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                }
                                $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                                $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                                $scope.model.faskesRujukan = false;
                                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                                toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                                $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                                toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                                if (e.data.response.peserta.statusPeserta.kode == 6) {
                                    $scope.penjagaanTidakDitanggung = true
                                }
                                var jenisFaskes = "rs"
                                if ($scope.item.asalRujukan.id != undefined) {
                                    if ($scope.item.asalRujukan.id == 1)
                                        jenisFaskes = "pcare"
                                    if ($scope.item.asalRujukan.id == 2)
                                        jenisFaskes = "rs"
                                }

                                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                    "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                        if (data.data.metaData.code == 200) {
                                            $scope.listDPJP = data.data.response.list;
                                            $scope.listDPJP2 = data.data.response.list;
                                        } else
                                            toastr.info('Dokter DPJP tidak ada', 'Info')
                                    });
                                // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                            } else {
                                window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    } else {
                        var jenisFaskes = "rs"
                        if ($scope.item.asalRujukan.id != undefined) {
                            if ($scope.item.asalRujukan.id == 1)
                                jenisFaskes = "pcare"
                            if ($scope.item.asalRujukan.id == 2)
                                jenisFaskes = "rs"
                        }
                        medifirstService.get("bridging/bpjs2/get-rujukan-" + jenisFaskes + "-nokartu?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                // polirujukanbpjs = e.data.response.rujukan.poliRujukan.kode;
                                $scope.model.noRujukan = e.data.response.rujukan.noKunjungan;
                                $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);
                                var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                                $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                                $scope.model.tglLahir = tglLahir;
                                $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                                $scope.model.kelasBridg = {
                                    id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                                    kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                                    nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                    namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                };
                                if ($scope.model.kelasBridg.id == 1) {
                                    $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                } else if ($scope.model.kelasBridg.id == 2) {
                                    $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                } else if ($scope.model.kelasBridg.id == 3) {
                                    $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                }
                                $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                                $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                                $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                                $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                                $scope.model.faskesRujukan = false;
                                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                                toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                                $scope.model.prolanis = e.data.response.rujukan.peserta.informasi.prolanisPRB;
                                // $scope.model.noTelpons = e.data.response.rujukan.peserta.mr.noTelepon;
                                $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);

                                medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                    .then(function (data) {
                                        $scope.sourceDiagnosa.add(data.data[0])
                                        $scope.model.diagnosa = data.data[0]
                                    })

                                // get Dokter DPJP By Histori
                                $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)

                                // medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" 
                                //     + kdSpesialis ).then(function (z) {
                                //         if (z.data.metaData.code == 200)
                                //             $scope.listDPJP = z.data.response.list;
                                //         else
                                //             toastr.info('Dokter DPJP tidak ada', 'Info')
                                // });

                                toastr.info(e.data.response.rujukan.noKunjungan, 'No Rujukan');
                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });

                    }
                } else if ($scope.model.cekNomorRujukanMulti == true) {
                    if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                    $scope.isLoadingNoKartu = true;
                    var jenisFaskes = "rs"
                    if ($scope.item.asalRujukan.id != undefined) {
                        if ($scope.item.asalRujukan.id == 1)
                            jenisFaskes = "pcare"
                        if ($scope.item.asalRujukan.id == 2)
                            jenisFaskes = "rs"
                    }
                    if ($scope.item.asalRujukan.id == 7) {
                        medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                // for (var i = 0; i < e.data.response.histori.length; i++) {
                                //     e.data.response.histori[i].no = i+1;
                                // };
                                // $scope.sourceHistoryPelayanan =  e.data.response.histori;
                                // $scope.popupHistoryPelayanan.center().open();
                                // $scope.showPilihNomor=true;

                                $scope.listHistori = e.data.response.histori;

                                for (let i = 0; i < e.data.response.histori.length; i++) {
                                    const element = e.data.response.histori[i];
                                    element.no = i + 1
                                }
                                $scope.popUpHistoriPelayananPeserta.center().open()
                                $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                                    data: e.data.response.histori,
                                    pageSize: 10,
                                    total: e.data.response.histori.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    }
                                });


                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                                // window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    } else {
                        medifirstService.get("bridging/bpjs2/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                e.data.response.rujukan.sort((a, b) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
                                for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                    e.data.response.rujukan[i].no = i + 1;
                                };
                                $scope.sourceNoRujukanMulti = new kendo.data.DataSource({
                                    data: e.data.response.rujukan,
                                    pageSize: 10,
                                    total: e.data.response.rujukan.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    }
                                });
                                // $scope.sourceNoRujukanMulti =  e.data.response.rujukan;
                                $scope.popupRujukan.center().open();
                                $scope.showPilihNomor = true;

                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                                // window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    }
                }
            }
            $scope.columnNoRujukanMulti = {

                selectable: 'cell',
                pageable: true,
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noKunjungan",
                        "title": "Nomor Rujukan",
                        "width": "150px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setRujukan(dataItem)\"  style=\"margin:0 0 5px\">#:  noKunjungan #</button> ",

                    },
                    {
                        "field": "poliRujukan.nama",
                        "title": "Nama Poli",
                        "width": "120px",
                    },
                    {
                        "field": "tglKunjungan",
                        "title": "Tanggal Dirujuk",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.kode",
                        "title": "Kode Asal Rujukan",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.nama",
                        "title": "Kode Asal Rujukan",
                        "width": "200px"
                    },

                ]
            };
            $scope.columnHistoriPeserta = {

                selectable: 'cell',
                pageable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "noSep",
                    "title": "No SEP",
                    "width": "130px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSep(dataItem)\"  style=\"margin:0 0 5px\">#:  noSep #</button> ",

                },
                {
                    "field": "ppkPelayanan",
                    "title": "Rumah Sakit",
                    "width": "100px"
                },
                {
                    "field": "tglSep",
                    "title": "Tgl SEP",
                    "width": "100px"
                },
                {
                    "field": "noRujukan",
                    "title": "No Rujukan",
                    "width": "90px"
                },
                {
                    "field": "noKartu",
                    "title": "No Kartu",
                    "width": "90px"
                },
                {
                    "field": "namaPeserta",
                    "title": "Nama Pasien",
                    "width": "90px"
                },
                {
                    "field": "kelasRawat",
                    "title": "Kelas",
                    "width": "90px"
                },
                {
                    "field": "poli",
                    "title": "Poli",
                    "width": "90px"
                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "150px"
                },

                ]
            };
            $scope.columnHistoriSuratKontrol = {

                selectable: 'cell',
                pageable: true,
                columns: [{
                    "field": "tglRencanaKontrol",
                    "title": "Tanggal Rencana Kontrol",
                    "width": "130px",
                },
                {
                    "field": "noSuratKontrol",
                    "title": "No Surat Kontrol",
                    "width": "130px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSuratKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  noSuratKontrol #</button> ",

                },
                {
                    "field": "namaJnsKontrol",
                    "title": "Jenis Kontrol",
                    "width": "100px"
                },
                {
                    "field": "namaPoliAsal",
                    "title": "Poli Asal",
                    "width": "100px"
                },
                {
                    "field": "namaPoliTujuan",
                    "title": "Poli Tujuan",
                    "width": "90px"
                },
                {
                    "field": "namaDokter",
                    "title": "Dokter Tujuan",
                    "width": "90px"
                },
                {
                    "field": "terbitSEP",
                    "title": "Sudah Dipakai",
                    "width": "90px"
                },
                {
                    "title": "Edit Tanggal Surat Kontrol",
                    "width": "90px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setEditSuratKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  'Edit' #</button> ",
                },
                {
                    "title": "Cetak",
                    "width": "90px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"cetakKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  'Cetak' #</button> ",
                },
                ]
            };
            $scope.cetakKontrol = function (x) {
                debugger
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + x.noSuratKontrol).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        $("#noKontrolx").text(e.data.response.noSuratKontrol);
                        $("#nokartuKontrol").text(e.data.response.sep.peserta.noKartu);
                        $("#namapesertaKontrol").text(e.data.response.sep.peserta.nama);
                        $("#tgllahirKontrol").text(e.data.response.sep.peserta.tglLahir);
                        $("#diagnosaKontrol").text(e.data.response.sep.diagnosa);
                        $("#rencanakontrol").text(e.data.response.tglRencanaKontrol);
                        $("#tglcetakKontrol").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));
                        $("#dpjptujKontrol").text(e.data.response.namaDokter);
                        $("#subspetujKontrol").text('Sp./Sub.' + e.data.response.namaPoliTujuan);
                        if (e.data.response.namaDokterPembuat == null) {
                            $("#dpjppemberiSurat").text(e.data.response.namaDokter);
                        } else {
                            $("#dpjppemberiSurat").text(e.data.response.namaDokterPembuat);
                        }


                        var printdata = document.getElementById("kontrol");
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
                        var printdata = document.getElementById("kontrol");
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
            $scope.setRujukan = function (data) {
                if (data != undefined) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.model.noRujukan = data.noKunjungan;
                        $scope.popupRujukan.close()
                    } else {
                        $scope.isBpjsRJsep = true
                        $scope.model.generateNoSEP = true
                        $scope.insert.poli = $scope.insert.poli = { kode: data.poliRujukan.kode, nama: data.poliRujukan.nama }
                        $scope.model.noRujukan = data.noKunjungan;
                        $scope.model.tglRujukan = new Date(data.tglKunjungan);
                        var tglLahir = new Date(data.peserta.tglLahir);
                        $scope.model.namaPeserta = data.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        $scope.model.noIdentitas = data.peserta.nik;
                        $scope.model.kelasBridg = {
                            id: parseInt(data.peserta.hakKelas.kode),
                            kdKelas: data.peserta.hakKelas.kode,
                            nmKelas: data.peserta.hakKelas.keterangan,
                            namakelas: data.peserta.hakKelas.keterangan,
                        };
                        if ($scope.model.kelasBridg.id == 1) {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if ($scope.model.kelasBridg.id == 2) {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else if ($scope.model.kelasBridg.id == 3) {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }
                        $scope.poliRujukanKode = data.poliRujukan.kode
                        $scope.poliRujukanNama = data.poliRujukan.nama
                        $scope.kodeProvider = data.provPerujuk.kode;
                        $scope.namaProvider = data.provPerujuk.nama;
                        $scope.model.faskesRujukan = false;
                        $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                        $scope.model.jenisPeserta = data.peserta.jenisPeserta.keterangan;
                        toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                        $scope.model.prolanis = data.peserta.informasi.prolanisPRB;
                        // $scope.model.noTelpons = data.peserta.mr.noTelepon;
                        $scope.model.tglRujukan = new Date(data.tglKunjungan);

                        toastr.info(data.peserta.statusPeserta.keterangan, 'Status Peserta');

                        medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + data.diagnosa.kode, true, true, 10)
                            .then(function (xx) {
                                $scope.sourceDiagnosa.add(xx.data[0])
                                $scope.model.diagnosa = xx.data[0]
                            })
                        medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                            "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" +
                            $scope.poliRujukanKode).then(function (z) {
                                if (z.data.metaData.code == 200) {
                                    $scope.listDPJP2 = z.data.response.list;
                                    $scope.listDPJP = z.data.response.list;
                                } else
                                    toastr.info('Dokter DPJP tidak ada', 'Info')
                            });
                        // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                        $scope.isLoadingRujukan = false;
                        $scope.popupRujukan.close()
                        if (data.no == 1) {
                            medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                                if (data.data.metaData.code == 200) {
                                    for (let i = 0; i < data.data.response.histori.length; i++) {
                                        if ($scope.model.noRujukan == data.data.response.histori[i].noRujukan) {
                                            $scope.isKunjunganPertamaBPJS = false
                                            break;
                                        }
                                    }
                                    if ($scope.isKunjunganPertamaBPJS == true) {
                                        $scope.isPemberiSurat = false
                                        $scope.isTujuanKunjungan = false
                                        $scope.isflagProcedure = false
                                        $scope.iskdPenunjang = false
                                        $scope.isassesmentPel = false
                                        $scope.isDpjpMelayani = true
                                        delete $scope.model.skdp
                                        delete $scope.model.DPJPMelayani
                                        delete $scope.model.dokterDPJP
                                        delete $scope.model.flagProcedure
                                        delete $scope.model.kdPenunjang
                                        delete $scope.model.assesmentPel
                                        $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                                        toastr.info('Kunjungan Pertama Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                                        $scope.isLoadingNoKartu = false;
                                    } else {
                                        $scope.listtujuanKunj = [
                                            { "id": "1", "name": "Prosedur" },
                                            { "id": "2", "name": "Konsul Dokter" }
                                        ];
                                        $scope.isTujuanKunjungan = true
                                        $scope.isflagProcedure = false
                                        $scope.iskdPenunjang = false
                                        $scope.isassesmentPel = false
                                        $scope.isPemberiSurat = true
                                        toastr.info('Pasien Kontrol Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                                        $scope.isLoadingNoKartu = false;
                                    }
                                } else {
                                    medifirstService.get("bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                                        debugger
                                        if (data.data.metaData.code == 200) {
                                            for (let i = 0; i < data.data.response.list.length; i++) {
                                                if (new moment($scope.model.tglSEP).format('YYYY-MM-DD') == data.data.response.list[i].tglRencanaKontrol) {
                                                    $scope.isKunjunganPertamaBPJS = false
                                                    break;
                                                }
                                            }
                                            if ($scope.isKunjunganPertamaBPJS == true) {
                                                $scope.isPemberiSurat = false
                                                $scope.isTujuanKunjungan = false
                                                $scope.isflagProcedure = false
                                                $scope.iskdPenunjang = false
                                                $scope.isassesmentPel = false
                                                $scope.isDpjpMelayani = true
                                                delete $scope.model.skdp
                                                delete $scope.model.DPJPMelayani
                                                delete $scope.model.dokterDPJP
                                                delete $scope.model.flagProcedure
                                                delete $scope.model.kdPenunjang
                                                delete $scope.model.assesmentPel
                                                $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                                                toastr.info('Kunjungan Pertama Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                                                $scope.isLoadingNoKartu = false;
                                            } else {
                                                $scope.listtujuanKunj = [
                                                    { "id": "1", "name": "Prosedur" },
                                                    { "id": "2", "name": "Konsul Dokter" }
                                                ];
                                                $scope.isTujuanKunjungan = true
                                                $scope.isflagProcedure = false
                                                $scope.iskdPenunjang = false
                                                $scope.isassesmentPel = false
                                                $scope.isPemberiSurat = true
                                                toastr.info('Pasien Kontrol Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                                                $scope.isLoadingNoKartu = false;
                                            }
                                        } else {
                                            toastr.info(data.data.metaData.message, 'Status Peserta');
                                            $scope.isKunjunganPertamaBPJS = false
                                            $scope.isPemberiSurat = false
                                            $scope.isTujuanKunjungan = false
                                            $scope.isflagProcedure = false
                                            $scope.iskdPenunjang = false
                                            $scope.isassesmentPel = false
                                            delete $scope.model.skdp
                                            delete $scope.model.DPJPMelayani
                                            delete $scope.model.dokterDPJP
                                            delete $scope.model.flagProcedure
                                            delete $scope.model.kdPenunjang
                                            delete $scope.model.assesmentPel
                                            $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                                            toastr.info('Kunjungan Pertama Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                                            $scope.isLoadingNoKartu = false;
                                        }

                                    })
                                }
                            })
                        } else {
                            $scope.listtujuanKunj = [
                                { "id": "1", "name": "Prosedur" },
                                { "id": "2", "name": "Konsul Dokter" }
                            ];
                            $scope.isTujuanKunjungan = true
                            $scope.isflagProcedure = false
                            $scope.iskdPenunjang = false
                            $scope.isassesmentPel = false
                            $scope.isPemberiSurat = true
                            toastr.info('Pasien Kontrol Dengan Nomor Rujukan ' + $scope.model.noRujukan, 'Status Peserta');
                            $scope.isLoadingNoKartu = false;
                        }
                    }

                }
            }
            $scope.checkDataRujukans = function () {
                if (!$scope.model.cekNomorRujukan) return;
                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                if ($scope.item.asalRujukan != undefined) {
                    if ($scope.item.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.item.asalRujukan.id == 2)
                        jenisFaskes = "rs"

                }
                if ($scope.model.cekpilihPascaranap == true) {
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.model.noKepesertaan).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
                            $scope.disableSEP = true;
                            var tglLahir = new Date(e.data.response.peserta.tglLahir);
                            $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                            $scope.model.namaPeserta = e.data.response.peserta.nama;
                            $scope.model.tglLahir = tglLahir;
                            // $scope.model.noIdentitas = e.data.response.peserta.nik;

                            if (e.data.response.peserta.hakKelas == 'Kelas 1') {
                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                            } else if (e.data.response.peserta.hakKelas == 'Kelas 2') {
                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                            } else {
                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                            }
                            $scope.model.jenisPeserta = e.data.response.peserta.jnsPeserta;
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            $scope.model.noRujukan = e.data.response.noRujukan
                            $scope.model.tglSEP = new Date(e.data.response.tglSep)

                            medifirstService.get("registrasi/get-diagnosa-saeutik?namadiagnosa=" + e.data.response.diagnosa, true, true, 10)
                                .then(function (data) {
                                    if (data.data.length > 0) {
                                        for (let i = 0; i < data.data.length; i++) {
                                            const element = data.data[i];
                                            if (element.namadiagnosa == e.data.response.diagnosa) {
                                                $scope.sourceDiagnosa.add(element)
                                                $scope.model.diagnosa = element
                                                break
                                            }
                                        }
                                    }


                                })
                            // if (e.data.response.lakaLantas.status === "0") {
                            //     // magics will appear
                            // } else {
                            //     $scope.model.lakalantas = true;
                            //     $scope.model.lokasiLakaLantas = e.data.response.lakaLantasketerangan;
                            // }
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        $scope.isLoadingSEP = false;
                    });
                } else if ($scope.model.cekpilihRujukan == true) {
                    medifirstService.get("bridging/bpjs2/get-rujukan-" + jenisFaskes + "?norujukan=" + $scope.model.noKepesertaan).then(function (e) {
                        // debugger;
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
                            if (e.data.response.rujukan.pelayanan.kode == "2") {
                                $scope.insert.poli = e.data.response.rujukan.poliRujukan
                            }
                            var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                            $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan)
                            $scope.model.noKepesertaan = $scope.noKartu = e.data.response.rujukan.peserta.noKartu;
                            $scope.model.noRujukan = e.data.response.rujukan.noKunjungan;
                            $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                            $scope.model.tglLahir = tglLahir;
                            $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                            $scope.model.kelasBridg = {
                                id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                                kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                                nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                            };
                            if ($scope.model.kelasBridg.id == 1) {
                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                            } else if ($scope.model.kelasBridg.id == 2) {
                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                            } else {
                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                            }
                            $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                            $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                            $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                            $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                .then(function (data) {
                                    $scope.sourceDiagnosa.add(data.data[0])
                                    $scope.model.diagnosa = data.data[0]
                                })
                            $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                            toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingRujukan = false;
                    }, function (err) {
                        $scope.isLoadingRujukan = false;
                    });
                } else {
                    $scope.isLoadingNoKartu = true;
                    medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
                            $scope.model.noRujukan = $scope.model.skdp
                            var tglLahir = new Date(e.data.response.peserta.tglLahir);
                            $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                            $scope.model.namaPeserta = e.data.response.peserta.nama;
                            $scope.model.tglLahir = tglLahir;
                            $scope.model.noIdentitas = e.data.response.peserta.nik;
                            $scope.model.kelasBridg = {
                                id: parseInt(e.data.response.peserta.hakKelas.kode),
                                kdKelas: e.data.response.peserta.hakKelas.kode,
                                nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                namakelas: e.data.response.peserta.hakKelas.keterangan,
                            };
                            if ($scope.model.kelasBridg.id == 1) {
                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                            } else if ($scope.model.kelasBridg.id == 2) {
                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                            } else if ($scope.model.kelasBridg.id == 3) {
                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                            }
                            $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                            $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                            $scope.model.faskesRujukan = false;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                            toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                            if (e.data.response.peserta.statusPeserta.kode == 6) {
                                $scope.penjagaanTidakDitanggung = true
                            }
                            var jenisFaskes = "rs"
                            if ($scope.item.asalRujukan.id != undefined) {
                                if ($scope.item.asalRujukan.id == 1)
                                    jenisFaskes = "pcare"
                                if ($scope.item.asalRujukan.id == 2)
                                    jenisFaskes = "rs"
                            }

                            medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                    if (data.data.metaData.code == 200) {
                                        $scope.listDPJP = data.data.response.list;
                                        $scope.listDPJP2 = data.data.response.list;
                                    } else
                                        toastr.info('Dokter DPJP tidak ada', 'Info')
                                });
                            // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                }

            };
            $scope.checkKepesertaanBySep = function () {

                if ($scope.model.sendiri) return;
                if ($scope.model.isCheckSEP) return;
                $scope.penjagaanBedaInstalasi = false
                $scope.isLoadingSEP = true;
                if ($scope.model.noSep === "" || $scope.model.noSep === undefined) {
                    window.messageContainer.error("No SEP Tidak Ada");
                    return;
                }
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                    // $scope.model.noSep = $scope.model.noSep.toLowerCase();
                    if (e.data.metaData.code === "200") {
                        if (e.data.response.jnsPelayanan == "Rawat Inap") {
                            if ($scope.model.rawatInap == false) {
                                $scope.penjagaanBedaInstalasi = true
                                toastr.error('SEP INI ADALAH SEP RAWAT INAP YANG DI COPY PASTE KE RAWAT JALAN, SEGERA TERBITKAN SEP RAWAT JALANNYA!.');
                                $scope.hideBtnSimpan = false;
                                return;
                            }
                        }
                        if (e.data.response.jnsPelayanan == "Rawat Jalan") {
                            if ($scope.model.rawatInap == true) {
                                $scope.penjagaanBedaInstalasi = true
                                toastr.error('SEP INI ADALAH SEP RAWAT JALAN YANG DI COPY PASTE KE RAWAT INAP, SEGERA TERBITKAN SEP RAWAT INAPNYA!.');
                                $scope.hideBtnSimpan = false;
                                return;
                            }
                        }
                        if ($scope.isSetSEP == true) {
                            $scope.model.noSep = ""
                            $scope.isSetSEP = false
                            $scope.model.tglSEP = $scope.now
                        } else {
                            $scope.model.tglSEP = new Date(e.data.response.tglSep)
                        }
                        $scope.disableSEP = true;
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.model.namaPeserta = e.data.response.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        // $scope.model.noIdentitas = e.data.response.peserta.nik;

                        if (e.data.response.peserta.hakKelas == 'Kelas 1') {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if (e.data.response.peserta.hakKelas == 'Kelas 2') {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }
                        $scope.model.jenisPeserta = e.data.response.peserta.jnsPeserta;
                        toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                        if (e.data.response.jnsPelayanan == "Rawat Jalan") {
                            $scope.model.noRujukan = e.data.response.noRujukan
                        }


                        medifirstService.get("registrasi/get-diagnosa-saeutik?namadiagnosa=" + e.data.response.diagnosa, true, true, 10)
                            .then(function (data) {
                                if (data.data.length > 0) {
                                    for (let i = 0; i < data.data.length; i++) {
                                        const element = data.data[i];
                                        if (element.namadiagnosa == e.data.response.diagnosa) {
                                            $scope.sourceDiagnosa.add(element)
                                            $scope.model.diagnosa = element
                                            break
                                        }
                                    }
                                }


                            })
                    } else {
                        $scope.penjagaanBedaInstalasi = true
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingSEP = false;
                }, function (err) {
                    $scope.isLoadingSEP = false;
                });
            };
            $scope.checkKepesertaanBySepPascaRanap = function (noSepPasca) {

                if ($scope.model.sendiri) return;
                if ($scope.model.isCheckSEP) return;

                $scope.isLoadingSEP = true;
                if (noSepPasca === "" || noSepPasca === undefined) {
                    window.messageContainer.error("No SEP Tidak Ada");
                    return;
                }
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + noSepPasca).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        if ($scope.isSetSEP == true) {
                            $scope.model.noSep = ""
                            $scope.isSetSEP = false
                            $scope.model.tglSEP = $scope.now
                        } else {
                            $scope.model.tglSEP = new Date(e.data.response.tglSep)
                        }
                        $scope.disableSEP = true;
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.model.namaPeserta = e.data.response.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        // $scope.model.noIdentitas = e.data.response.peserta.nik;

                        if (e.data.response.peserta.hakKelas == 'Kelas 1') {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if (e.data.response.peserta.hakKelas == 'Kelas 2') {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }
                        $scope.model.jenisPeserta = e.data.response.peserta.jnsPeserta;
                        toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                        if (e.data.response.jnsPelayanan == "Rawat Jalan") {
                            $scope.model.noRujukan = e.data.response.noRujukan
                        }


                        medifirstService.get("registrasi/get-diagnosa-saeutik?namadiagnosa=" + e.data.response.diagnosa, true, true, 10)
                            .then(function (data) {
                                if (data.data.length > 0) {
                                    for (let i = 0; i < data.data.length; i++) {
                                        const element = data.data[i];
                                        if (element.namadiagnosa == e.data.response.diagnosa) {
                                            $scope.sourceDiagnosa.add(element)
                                            $scope.model.diagnosa = element
                                            break
                                        }
                                    }
                                }


                            })
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingSEP = false;
                }, function (err) {
                    $scope.isLoadingSEP = false;
                });
            };
            $scope.setSep = function (dataHistorySelect) {
                $scope.isBpjsRJsep = true
                $scope.model.noRujukan = dataHistorySelect.noSep
                $scope.kodeProvider = ppkRumahSakit
                $scope.namaProvider = namappkRumahSakit
                $scope.model.faskesRujukan = false;
                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                $scope.isSetSEP = true
                // $scope.model.noSep = dataHistorySelect.noSep
                $scope.checkKepesertaanBySepPascaRanap(dataHistorySelect.noSep);
                $scope.popUpHistoriPelayananPeserta.close()
                $scope.isPemberiSurat = true
                $scope.isDpjpMelayani = true
                $scope.isTujuanKunjungan = false
                $scope.isflagProcedure = false
                $scope.iskdPenunjang = false
                $scope.isassesmentPel = false
                delete $scope.model.skdp
                delete $scope.model.DPJPMelayani
                delete $scope.model.dokterDPJP
                delete $scope.model.flagProcedure
                delete $scope.model.kdPenunjang
                delete $scope.model.assesmentPel
                $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                $scope.isLoadingNoKartu = false;

                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                    "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            $scope.listDPJP = data.data.response.list;
                            $scope.listDPJP2 = data.data.response.list;
                        } else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
                //     // $scope.dataHistorySelect = dataHistorySelect
            }
            $scope.cariRujukanMulti = function () {
                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                $scope.item.asalRujukan = $scope.item.asalRujukan
                if ($scope.item.asalRujukan != undefined) {
                    if ($scope.item.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.item.asalRujukan.id == 2)
                        jenisFaskes = "rs"

                }
                if ($scope.model.cekpilihRujukan == true) {
                    medifirstService.get("bridging/bpjs2/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            e.data.response.rujukan.sort((a, b) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
                            for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                e.data.response.rujukan[i].no = i + 1;
                            };
                            $scope.sourceNoRujukanMulti = new kendo.data.DataSource({
                                data: e.data.response.rujukan,
                                pageSize: 10,
                                total: e.data.response.rujukan.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                            // $scope.sourceNoRujukanMulti =  e.data.response.rujukan;
                            $scope.popupRujukan.center().open();
                            $scope.showPilihNomor = true;

                        } else {
                            toastr.error(e.data.metaData.message, 'Info');
                            // window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                } else if ($scope.model.cekpilihPascaranap == true) {
                    medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            for (let i = 0; i < data.data.response.histori.length; i++) {
                                const element = data.data.response.histori[i];
                                element.no = i + 1
                            }
                            $scope.popUpHistoriPelayananPeserta.center().open()
                            $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                                data: data.data.response.histori,
                                pageSize: 10,
                                total: data.data.response.histori.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                        } else {
                            toastr.info(data.data.metaData.message, 'Status Peserta');
                            $scope.isLoadingNoKartu = false;
                        }
                    })
                } else {
                    $scope.isLoadingNoKartu = true;
                    medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
                            // $scope.model.noRujukan = $scope.model.skdp
                            var tglLahir = new Date(e.data.response.peserta.tglLahir);
                            $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                            $scope.model.namaPeserta = e.data.response.peserta.nama;
                            $scope.model.tglLahir = tglLahir;
                            $scope.model.noIdentitas = e.data.response.peserta.nik;
                            $scope.model.kelasBridg = {
                                id: parseInt(e.data.response.peserta.hakKelas.kode),
                                kdKelas: e.data.response.peserta.hakKelas.kode,
                                nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                namakelas: e.data.response.peserta.hakKelas.keterangan,
                            };
                            if ($scope.model.kelasBridg.id == 1) {
                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                            } else if ($scope.model.kelasBridg.id == 2) {
                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                            } else if ($scope.model.kelasBridg.id == 3) {
                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                            }
                            $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                            $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                            $scope.model.faskesRujukan = false;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                            toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                            if (e.data.response.peserta.statusPeserta.kode == 6) {
                                $scope.penjagaanTidakDitanggung = true
                            }
                            var jenisFaskes = "rs"
                            if ($scope.item.asalRujukan.id != undefined) {
                                if ($scope.item.asalRujukan.id == 1)
                                    jenisFaskes = "pcare"
                                if ($scope.item.asalRujukan.id == 2)
                                    jenisFaskes = "rs"
                            }

                            medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                    if (data.data.metaData.code == 200) {
                                        $scope.listDPJP = data.data.response.list;
                                        $scope.listDPJP2 = data.data.response.list;
                                    } else
                                        toastr.info('Dokter DPJP tidak ada', 'Info')
                                });
                            // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                            medifirstService.get("bridging/bpjs2/get-rujukan-pcare-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                                if (e.data.metaData.code === "200") {
                                    e.data.response.rujukan.sort((a, b) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
                                    for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                        e.data.response.rujukan[i].no = i + 1;
                                    };
                                    $scope.sourceNoRujukanMulti = new kendo.data.DataSource({
                                        data: e.data.response.rujukan,
                                        pageSize: 10,
                                        total: e.data.response.rujukan.length,
                                        serverPaging: false,
                                        schema: {
                                            model: {
                                                fields: {}
                                            }
                                        }
                                    });
                                    $scope.popupRujukan.center().open();
                                    $scope.showPilihNomor = true;

                                } else {
                                    toastr.error(e.data.metaData.message, 'Info');
                                    // window.messageContainer.error(e.data.metaData.message);
                                }
                                $scope.isLoadingNoKartu = false;
                            }, function (err) {
                                $scope.isLoadingNoKartu = false;
                            });
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                }

            }

            function GetCombo() {
                medifirstService.get('registrasi/daftar-antrian-pasien/get-combo').then(function (e) {
                    $scope.listJenisDiagnosa = e.data.jenisdiagnosa
                })

                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
                    $scope.listDataPegawai = e;
                });

                medifirstService.getPart("registrasi/daftar-antrian-pasien/get-diagnosa", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }

            medifirstService.get("registrasi/get-pasienbynocm?noCm=" + $scope.currentNoCm)
                .then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.item.pasien = e.data.data[0];
                    $scope.item.nocmfk = e.data.data[0].nocmfk;
                    dirawat = e.data.data[0].dirawat;
                    kunjungan = e.data.data[0].kunjungan;
                    $scope.model.noTelpons = $scope.item.pasien.notelepon;
                    $scope.model.noKepesertaan = $scope.item.pasien.nobpjs;

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
            // loadPertama();
            // medifirstService.getPart('registrasi/get-dokter-part', true, 10).then(function (e) {
            //     $scope.listDokter = e;
            // })

            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function (dat) {
                    $scope.listJenisPelayanan = dat.data.jenispelayanan;
                    if ($scope.item.jenisPasien == undefined) {
                        $scope.item.jenisPasien = $scope.listJenisPelayanan[0];
                    }
                    $scope.listAsalRujukan = dat.data.asalrujukan;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    if (!$scope.isPenunjang)
                        $scope.listRuangan = dat.data.ruanganrajal;
                    $scope.listRuanganRajal = dat.data.ruanganrajal;
                    $scope.listRuanganRajal2 = dat.data.ruanganrajal2;
                    $scope.listRuanganRanap = dat.data.ruanganranap;
                    $scope.listjaminanKhusus = dat.data.jaminankhusus;
                    $scope.listJenisPasien = dat.data.jenispasien;
                    if ($scope.item.jenispasien == undefined) {
                        $scope.item.jenispasien = $scope.listJenisPasien[0];
                    }
                    $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                    $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                    $scope.sourceKelasDitanggung = dat.data.kelas;
                    $scope.sourceAsalRujukan = dat.data.asalrujukan;
                    // $scope.item.asalRujukan = { id: dat.data.asalrujukan[3].id, asalrujukan: dat.data.asalrujukan[3].asalrujukan }
                    $scope.model.namaPenjamin = { id: dat.data.kelompokpasien[1].id, kelompokpasien: dat.data.kelompokpasien[1].kelompokpasien }
                    $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                    if (norecPD == '') {
                        $scope.item.asalRujukan = { id: dat.data.asalrujukan[1].id, asalrujukan: dat.data.asalrujukan[1].asalrujukan }
                    }
                    if ($scope.model.rawatInap == true) {
                        $scope.cekRawatInap($scope.model.rawatInap);
                    }
                    if ($scope.currentbpJS == "true") {
                        $scope.item.kelompokPasien = { id: dat.data.kelompokpasien[1].id, kelompokpasien: dat.data.kelompokpasien[1].kelompokpasien }
                        $scope.model.noRujukan = $scope.currentnorujukan
                        if ($scope.currentfaskes == 1) {
                            $scope.item.asalRujukan = { id: dat.data.asalrujukan[1].id, asalrujukan: dat.data.asalrujukan[1].asalrujukan }
                            medifirstService.get("bridging/bpjs2/get-rujukan-pcare?norujukan=" + $scope.currentnorujukan).then(function (e) {
                                debugger;
                                if (e.data.metaData.code === "200") {
                                    $scope.isBpjsRJsep = true
                                    $scope.model.generateNoSEP = true
                                    if (e.data.response.rujukan.pelayanan.kode == "2") {
                                        $scope.insert.poli = e.data.response.rujukan.poliRujukan
                                    }
                                    var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                                    $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan)
                                    $scope.model.noKepesertaan = $scope.noKartu = e.data.response.rujukan.peserta.noKartu;
                                    $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                                    $scope.model.tglLahir = tglLahir;
                                    $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                                    $scope.model.kelasBridg = {
                                        id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                                        kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                                        nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                        namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                    };
                                    if ($scope.model.kelasBridg.id == 1) {
                                        $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                    } else if ($scope.model.kelasBridg.id == 2) {
                                        $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                    } else {
                                        $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                    }
                                    $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                                    $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                                    // $scope.insert.poli = { kode: data.poliRujukan.kode, nama: data.poliRujukan.nama }
                                    $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                                    $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                                    $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                    $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                                    toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                                    medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                        .then(function (data) {
                                            $scope.sourceDiagnosa.add(data.data[0])
                                            $scope.model.diagnosa = data.data[0]
                                        })
                                    $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                                    toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                                } else {
                                    window.messageContainer.error(e.data.metaData.message);
                                }
                                $scope.isLoadingRujukan = false;
                            }, function (err) {
                                $scope.isLoadingRujukan = false;
                            });
                        } else if ($scope.currentfaskes == 2) {
                            $scope.item.asalRujukan = { id: dat.data.asalrujukan[2].id, asalrujukan: dat.data.asalrujukan[2].asalrujukan }
                            medifirstService.get("bridging/bpjs2/get-rujukan-rs?norujukan=" + $scope.currentnorujukan).then(function (e) {
                                // debugger;
                                if (e.data.metaData.code === "200") {
                                    $scope.isBpjsRJsep = true
                                    $scope.model.generateNoSEP = true
                                    if (e.data.response.rujukan.pelayanan.kode == "2") {
                                        $scope.insert.poli = e.data.response.rujukan.poliRujukan
                                    }
                                    var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                                    $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan)
                                    $scope.model.noKepesertaan = $scope.noKartu = e.data.response.rujukan.peserta.noKartu;
                                    $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                                    $scope.model.tglLahir = tglLahir;
                                    $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                                    $scope.model.kelasBridg = {
                                        id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                                        kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                                        nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                        namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                    };
                                    if ($scope.model.kelasBridg.id == 1) {
                                        $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                    } else if ($scope.model.kelasBridg.id == 2) {
                                        $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                    } else {
                                        $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                    }
                                    $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                                    $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                                    // $scope.insert.poli = { kode: data.poliRujukan.kode, nama: data.poliRujukan.nama }
                                    $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                                    $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                                    $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                    $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                                    toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                                    medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                        .then(function (data) {
                                            $scope.sourceDiagnosa.add(data.data[0])
                                            $scope.model.diagnosa = data.data[0]
                                        })
                                    $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                                    toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                                } else {
                                    window.messageContainer.error(e.data.metaData.message);
                                }
                                $scope.isLoadingRujukan = false;
                            }, function (err) {
                                $scope.isLoadingRujukan = false;
                            });
                        } else if ($scope.currentfaskes == 3) {
                            $scope.model.cekpilihRujukan = false
                            $scope.model.cekpilihPascaranap = true
                            $scope.item.asalRujukan = { id: dat.data.asalrujukan[2].id, asalrujukan: dat.data.asalrujukan[2].asalrujukan }
                            $scope.isBpjsRJsep = true
                            $scope.model.noRujukan = $scope.currentnorujukan
                            $scope.kodeProvider = ppkRumahSakit
                            $scope.namaProvider = namappkRumahSakit
                            $scope.model.faskesRujukan = false;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.isSetSEP = true
                            $scope.model.noSep = $scope.currentnorujukan
                            $scope.checkKepesertaanBySep();
                            $scope.model.generateNoSEP = true
                            medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                    if (data.data.metaData.code == 200) {
                                        $scope.listDPJP = data.data.response.list;
                                        $scope.listDPJP2 = data.data.response.list;
                                    } else
                                        toastr.info('Dokter DPJP tidak ada', 'Info')
                                });
                        }
                    }

                    loadPertama();
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
                        $scope.model.tglSEP = arrOnline.tanggalreservasi;
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
                    $scope.item.rekanan = {
                        id: arrOnline.idrekanan,
                        namarekanan: arrOnline.namarekanan,
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
                    .then(function (res) {
                        $scope.isRouteLoading = false;
                        $scope.CekPasienDaftar = res.data.data;
                    })


            };
            if (norecPD == '') {
                cekPsnDaftarThisMonth($scope.currentNoCm)
            }

            function loadAsuransi() {
                // debugger;
                $scope.isRouteLoading = true;
                $scope.nonUmum = true;
                $scope.isPasienBpjs = true
                $scope.isBpjsRJ = true
                $scope.isBpjsRJsep = false
                $scope.model.cekpilihRujukan = true
                // $scope.generateSKDP(true)
                medifirstService.get("registrasi/get-pasien-bynorec/" +
                    norecPD +
                    "/" +
                    norecAPD)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasienx = e.data[0];
                        noRegistrasis = e.data[0].noregistrasi
                        $scope.item.pasienx.tglregistrasi = moment(new Date($scope.item.pasienx.tglregistrasi)).format('YYYY-MM-DD HH:mm')
                        $scope.item.pasienx.tgllahir = moment(new Date($scope.item.pasienx.tgllahir)).format('YYYY-MM-DD')

                        // $scope.model.noTelpons = e.data[0].notelepon;
                        $scope.model.noKepesertaan = e.data[0].nobpjs;
                        $scope.model.noIdentitas = e.data[0].noidentitas;
                        // $scope.listKelompokPasien = ([{ id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien }]);
                        $scope.item.kelompokPasien = { id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien };
                        $scope.sourceRekanan = ([{ id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }])
                        $scope.model.institusiAsalPasien = { id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }
                        $scope.item.jenispelayanan = e.data[0].jenispelayanan;
                        if ($scope.item.kelompokPasien.id == 2) {
                            $scope.isPasienBpjs = true
                            debugger
                            if ($scope.item.objectdepartemenfk.id == 24 || $scope.item.objectdepartemenfk.id == 16) {
                                $scope.model.cekpilihManual = true
                                let x = true
                                $scope.ceklispilihManual(x);
                            } else {
                                $scope.model.cekpilihRujukan = true
                            }
                            $scope.model.Cito = 1
                            $scope.isBpjsRJ = true
                            $scope.isBpjsRJsep = true
                            // $scope.generateSKDP(true)
                            getPemakaianAsuransiByNoReg(noRegistrasis)
                        } else if ($scope.item.kelompokPasien.id != 1) {
                            $scope.isPasienAsuransi = true
                        }
                        if ($scope.item.jenispelayanan == "EKSEKUTIF") {
                            $scope.model.poliEksekutif = true;
                        } else
                            $scope.model.poliEksekutif = false;
                        if (e.data[0].israwatinap == "true") {
                            $scope.model.rawatInap = true;
                            $scope.captionRujukan = 'No SPRI'
                            jenisPel = "1"
                        } else {
                            $scope.model.rawatInap = false;
                            $scope.captionRujukan = 'No Rujukan'
                            jenisPel = "2"
                        }
                        kdSpesialis = $scope.item.pasien.kdinternal
                        $scope.model.kelasDitanggung = { id: $scope.item.pasien.idkelasditanggung, namakelas: $scope.item.pasien.namakelasditanggung }
                        if ($scope.model.noIdentitas == "0000000000000000") {

                        } else {
                            if ($scope.item.pasien.israwatinap == 'true' || $scope.item.pasien.objectruanganfk == '569') {
                                if ($scope.item.pasien.objectrekananfk == '2552' || $scope.item.pasien.objectrekananfk == '5906' || $scope.item.pasien.objectrekananfk == '581367' || $scope.item.pasien.objectrekananfk == '581368' || $scope.item.pasien.objectrekananfk == '581405' || $scope.item.pasien.objectrekananfk == '581669' || $scope.item.pasien.objectrekananfk == '581673') {
                                    $scope.isRouteLoading = true;
                                    medifirstService.get("bridging/bpjs2/get-nik?nik=" + $scope.model.noIdentitas + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                                        if (e.data.metaData.code == 200) {
                                            $scope.model.cekpilihRujukan = false
                                            $scope.model.cekpilihPascaranap = false
                                            $scope.isBpjsRJsep = true
                                            kelasDitanggungCodeInaCbg = e.data.response.peserta.hakKelas.kode
                                            kelasDitanggungNamaInaCbg = e.data.response.peserta.hakKelas.keterangan
                                            if (kelasDitanggungCodeInaCbg == 1) {
                                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                                kelasDitanggungCodeInaCbg = '3';
                                                kelasDitanggungNamaInaCbg = 'Kelas I';
                                            } else if (kelasDitanggungCodeInaCbg == 2) {
                                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                                kelasDitanggungCodeInaCbg = '2';
                                                kelasDitanggungNamaInaCbg = 'Kelas II';
                                            } else if (kelasDitanggungCodeInaCbg == 3) {
                                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                                kelasDitanggungCodeInaCbg = '1';
                                                kelasDitanggungNamaInaCbg = 'Kelas III';
                                            }
                                        }
                                        // $scope.model.kelasDitanggung = { id: kelasDitanggungCodeInaCbg, namakelas: kelasDitanggungNamaInaCbg }
                                    }).then(function () {
                                        $scope.isRouteLoading = false;
                                    });
                                    $scope.model.cekpilihRujukan = false
                                    $scope.model.cekpilihPascaranap = false
                                    $scope.isBpjsRJsep = true
                                }
                            }
                        }

                    });
            }
            $scope.Sendiriaaa = function (data) {
                // if ($scope.insert.poli.kode != undefined || $scope.insert.poli.kode != "") {
                //     medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                //         + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + $scope.insert.poli.kode).then(function (data) {
                //             if (data.data.metaData.code == 200) {
                //                 // $scope.listDPJP = data.data.response.list;
                //                 $scope.listDPJP2 = data.data.response.list;
                //             }
                //             else
                //                 toastr.info('Dokter DPJP tidak ada', 'Info')
                //         });
                // } else {
                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                    "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            // $scope.listDPJP = data.data.response.list;
                            $scope.listDPJP2 = data.data.response.list;
                        } else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
                // }
            }

            function getPemakaianAsuransiByNoReg(noreg) {
                medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi="
                    // +$scope.item.pasien.noregistrasi
                    +
                    noreg
                )
                    .then(function (x) {
                        if (x.data.data.length > 0) {
                            $scope.cacheIdAP = x.data.data[0].norec_ap;
                            $scope.cacheNorecPA = x.data.data[0].norec;
                            if (x.data.data[0].objectkelompokpasienlastfk == 2) {
                                $scope.isBpjsRJsep = true
                                $scope.model.DPJPMelayani = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                                // $scope.insert.poli = { kode: x.data.data[0].polirujukankode, nama: x.data.data[0].polirujukannama }

                                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + x.data.data[0].nosep).then(function (e) {
                                    if (e.data.metaData.code === "200") {
                                        $scope.insert.poli = { kode: x.data.data[0].polirujukankode, nama: e.data.response.poli }
                                        medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                            "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" +
                                            $scope.insert.poli.kode).then(function (z) {
                                                if (z.data.metaData.code == 200) {
                                                    $scope.listDPJP2 = z.data.response.list;
                                                    $scope.listDPJP = z.data.response.list;
                                                } else
                                                    toastr.info('Dokter DPJP tidak ada', 'Info')
                                            });
                                    } else {
                                        window.messageContainer.error(e.data.metaData.message);
                                    }
                                    $scope.isLoadingSEP = false;
                                }, function (err) {
                                    $scope.isLoadingSEP = false;
                                });
                            }
                            $scope.model.noKepesertaan = x.data.data[0].nokepesertaan
                            $scope.model.namaPeserta = x.data.data[0].namapeserta
                            $scope.model.noIdentitas = x.data.data[0].noidentitas
                            // $scope.model.alamatPeserta ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            $scope.model.jenisPeserta = x.data.data[0].jenisPeserta
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            // $scope.model.noTelpons ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            $scope.model.hubunganPeserta = { id: x.data.data[0].objecthubunganpesertafk, hubunganpeserta: x.data.data[0].hubunganpeserta }
                            $scope.model.noSep = x.data.data[0].nosep
                            $scope.model.tglSEP = x.data.data[0].tanggalsep
                            // $scope.sourceKelasDitanggung = [{ id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }]
                            $scope.model.kelasDitanggung = { id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }
                            $scope.model.catatan = x.data.data[0].catatan
                            $scope.model.noRujukan = x.data.data[0].norujukan
                            if (cacheAsalRujuk == undefined || cacheAsalRujuk == '') {
                                if (x.data.data[0].asalrujukanfk)
                                    $scope.item.asalRujukan = { id: x.data.data[0].asalrujukanfk, asalrujukan: x.data.data[0].asalrujukan }
                            }

                            // $scope.item.asalRujukan ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            if ($scope.model.rawatInap == true) {
                                if (x.data.data[0].norujukan != null && x.data.data[0].norujukan != '') {
                                    $scope.model.noRujukan = x.data.data[0].norujukan
                                } else {
                                    $scope.model.noRujukan = $scope.model.skdp
                                }
                                $scope.model.namaAsalRujukan = ppkRumahSakit + " - " + namappkRumahSakit
                            } else {
                                $scope.model.namaAsalRujukan = x.data.data[0].kdprovider + " - " + x.data.data[0].nmprovider
                            }
                            $scope.model.tglRujukan = x.data.data[0].tglrujukan
                            if (x.data.data[0].objectdiagnosafk)
                                $scope.model.diagnosa = { id: x.data.data[0].objectdiagnosafk, kddiagnosa: x.data.data[0].kddiagnosa, nama: x.data.data[0].kddiagnosa + ' - ' + x.data.data[0].namadiagnosa }
                            $scope.model.tglLahir = x.data.data[0].tgllahir
                            $scope.item.kelompokPasien = { id: x.data.data[0].objectkelompokpasienlastfk, kelompokpasien: x.data.data[0].kelompokpasien }
                            // $scope.model.institusiAsalPasien ={id:x.data.data[0].kdpenjaminpasien,namarekanan:x.data.data[0].namarekanan}
                            $scope.model.institusiAsalPasien = { id: x.data.data[0].objectrekananfk, namarekanan: x.data.data[0].namarekananpd }
                            $scope.model.lokasiLakaLantas = x.data.data[0].lokasilakalantas
                            $scope.model.jenisPeserta = x.data.data[0].jenispeserta
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            if (x.data.data[0].kodedpjp) {
                                let resDpjp = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                                $scope.listDPJP.push(resDpjp);
                                $scope.model.DPJPMelayani = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                            }
                            if (x.data.data[0].kodedpjpmelayani) {
                                let resDpjp = { kode: x.data.data[0].kodedpjpmelayani, nama: x.data.data[0].namadjpjpmelayani }
                                $scope.listDPJP2.push(resDpjp);
                                $scope.model.DPJPMelayani = { kode: x.data.data[0].kodedpjpmelayani, nama: x.data.data[0].namadjpjpmelayani }
                            }

                            if (x.data.data[0].lakalantas == 1) {
                                $scope.model.lakalantas = true
                                $scope.model.tglLakalantas = x.data.data[0].tglkejadian
                                if (x.data.data[0].kdpropinsi != null) {
                                    $scope.listPropinsi.add({ kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi });
                                    $scope.model.propinsi = { kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi }
                                }
                                dataKabupaten = { kode: x.data.data[0].kdkabupaten, nama: x.data.data[0].namakabupaten }
                                dataKecamatan = { kode: x.data.data[0].kdkecamatan, nama: x.data.data[0].namakecamatan }
                                $scope.model.keteranganLaka = x.data.data[0].keteranganlaka
                                if (x.data.data[0].suplesi == true) {
                                    $scope.model.suplesi = true
                                    $scope.model.nomorSepSuplesi = x.data.data[0].nosepsuplesi
                                }
                            }

                            if (x.data.data[0].penjaminlaka != '' && x.data.data[0].penjaminlaka != null) {
                                var penjaminsLaka = x.data.data[0].penjaminlaka.split(',')
                                penjaminsLaka.forEach(function (data) {
                                    $scope.listPenjaminLaka.forEach(function (e) {
                                        if (e.value == data) {
                                            e.isChecked = true
                                            var dataid = {
                                                "id": e.id,
                                                "name": e.name,
                                                "value": data
                                            }
                                            $scope.currentListPenjaminLaka.push(dataid)
                                        }
                                    })
                                })
                            }
                            $scope.model.skdp = x.data.data[0].nosuratskdp
                            // $scope.model.DPJPMelayani = x.data.data[0].cob
                            $scope.model.cob = x.data.data[0].cob
                            $scope.model.katarak = x.data.data[0].katarak
                        }
                    });
            }

            function getPasienByNorecPD() {
                medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + norecPD + "&norecAPD=" + norecAPD)
                    .then(function (his) {
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
                        $scope.item.jenispasien = {
                            id: his.data.data[0].objectjenispasienfk,
                            jenispasien: his.data.data[0].jenispasien
                        }
                        $scope.item.jenisPasien = { id: his.data.data[0].objectjenispelayananfk, jenispelayanan: his.data.data[0].jenispelayanan }
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
                        $scope.item.dokter = { id: his.data.data[0].objectpegawaifk, namalengkap: his.data.data[0].dokter, idhafis: his.data.data[0].idhafis, namahafis: his.data.data[0].namahafis }
                        $scope.item.namaruangan = { id: his.data.data[0].id, namaruangan: his.data.data[0].namaruangan }
                        $scope.item.objectdepartemenfk = { id: his.data.data[0].objectdepartemenfk, namadepartemen: his.data.data[0].namadepartemen }
                        $scope.item.jaminankhusus = { id: his.data.data[0].objectjaminankhusus, namaexternal: his.data.data[0].namaexternal }
                        $scope.item.pelayanan = his.data.data[0].pelayanan
                        isRegisOnline = his.data.data[0].statusschedule
                        $scope.item.tglcsr = his.data.data[0].tglcsr
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
                        if ($scope.item.kelompokPasien.kelompokpasien == ('BPJS')) {
                            loadAsuransi();
                        }
                    });
            }
            $scope.cekpenanggungJawab = function (data) {
                if (data === true) {

                } else if (data === false || data === undefined) {

                } else {
                    return;
                }
            }
            $scope.cekRawatInap = function (data) {
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
            $scope.$watch('model.rawatInap', function (data) {
                if (!data) return;
                $scope.cekRawatInap(data);
            })
            $scope.$watch('model.tujuanKunj', function (data) {
                if (!data) return;
                if (data.id == 1) {
                    $scope.isflagProcedure = true
                    $scope.isassesmentPel = false
                    delete $scope.model.assesmentPel
                } else if (data.id == 2) {
                    $scope.isflagProcedure = false
                    $scope.isassesmentPel = true
                    $scope.iskdPenunjang = false
                    delete $scope.model.flagProcedure
                    delete $scope.model.kdPenunjang
                }
            })

            $scope.$watch('model.flagProcedure', function (data) {
                if (!data) return;
                $scope.iskdPenunjang = true
                if (data.id == 0) {
                    $scope.listkdPenunjang = [
                        { "id": "7", "name": "Laboratorium" },
                        { "id": "8", "name": "USG" },
                        { "id": "9", "name": "Farmasi" },
                        { "id": "10", "name": "Lain-Lain" },
                        { "id": "11", "name": "MRI" },
                    ];
                } else if (data.id == 1) {
                    $scope.listkdPenunjang = [
                        { "id": "1", "name": "Radioterapi" },
                        { "id": "2", "name": "Kemoterapi" },
                        { "id": "3", "name": "Rehabilitasi Medik" },
                        { "id": "4", "name": "Rehabilitasi Psikososial" },
                        { "id": "5", "name": "Transfusi Darah" },
                        { "id": "6", "name": "Pelayanan Gigi" },
                        { "id": "12", "name": "HEMODIALISA" },
                    ];
                }
            })

            $scope.$watch('item.asalRujukan', function (data) {
                if (!data) return;
                debugger
                if ($scope.item.ruangan.objectdepartemenfk == 24 || $scope.item.ruangan.objectdepartemenfk == 16) {
                    $scope.model.cekpilihRujukan = false
                    $scope.model.cekpilihPascaranap = false
                    $scope.model.cekpilihManual = true
                    $scope.isBpjsRJsep = true
                    let x = true
                    $scope.ceklispilihManual(x);
                } else {
                    if (data.id == 7) {
                        $scope.model.cekpilihManual = false
                        $scope.isBpjsRJsep = false
                        $scope.model.generateNoSEP = true
                        $scope.model.cekpilihRujukan = false
                        $scope.model.cekpilihPascaranap = true
                    } else if (data.id == 1) {
                        $scope.model.cekpilihRujukan = true
                        $scope.model.cekpilihPascaranap = false
                        $scope.model.cekpilihManual = false
                        $scope.isBpjsRJsep = false
                    } else if (data.id == 2) {
                        $scope.model.cekpilihRujukan = true
                        $scope.model.cekpilihPascaranap = false
                        $scope.model.cekpilihManual = false
                        $scope.isBpjsRJsep = false
                    } else {
                        $scope.model.cekpilihRujukan = false
                        $scope.model.cekpilihPascaranap = false
                        $scope.model.cekpilihManual = true
                        $scope.isBpjsRJsep = true
                    }
                }
                if ($scope.model.noSep != "" && $scope.model.noSep != undefined && $scope.item.kelompokPasien.kelompokpasien == ('BPJS')) {
                    $scope.isBpjsRJsep = true
                }
            })

            $scope.pilihRuangan = function (id) {
                var jml = 1;
                var diagnosa = '';
                if ($scope.diag.data != undefined) {
                    // var jml = 1;
                    // var diagnosa = '';
                    for (var i = 0; i < $scope.diag.data.length; i++) {
                        if ($scope.item.ruangan.id == $scope.diag.data[i].objectruanganasalfk) {
                            jml = jml + 1;
                        }
                    };
                    if ($scope.diag.datadiag != undefined) {
                        for (var i = 0; i < $scope.diag.datadiag.length; i++) {
                            if ($scope.item.ruangan.id == $scope.diag.datadiag[i].objectruanganasalfk) {
                                diagnosa = $scope.diag.datadiag[i].namadiagnosa;
                            }
                        };
                    }
                    toastr.error('Kunjungan ke- ' + jml + ' Di Ruang ' + $scope.item.ruangan.namaruangan + ' Di Bulan yang sama ! Dengan Diagnosa Akhir ' + diagnosa + '.', 'Peringatan', {
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
                var ruanganId = $scope.item.ruangan.id;


                // get ruangan with condition (rawat jalan or rawat inap)
                if ($scope.model.rawatInap === true) {
                    medifirstService.get('registrasi/get-dokter-part?idRuangan=' + ruanganId, true, 10).then(function (e) {
                        $scope.listDokter = e.data;
                    })
                    var ruanganId = id;
                    $scope.item.kelas = ""
                    $scope.item.kamar = ""
                    $scope.item.nomorTempatTi
                    medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                        .then(function (dat) {
                            $scope.listKelas = dat.data.kelas;

                        });
                } else if ($scope.model.allDokter === true) {
                    medifirstService.get('registrasi/get-dokter-part?idRuangan=' + ruanganId, true, 10).then(function (e) {
                        $scope.listDokter = e.data;
                    })
                } else if (id == 569 || id == 12 || id == 447 || id == 255 || id == 31 || id == 462 || id == 575 ||
                    id == 453 || id == 449 || id == 576 || id == 20 || id == 132 ||
                    id == 322 || id == 198 || id == 44 || id == 70 || id == 460) {
                    medifirstService.get('registrasi/get-dokter-part?idRuangan=' + ruanganId, true, 10).then(function (e) {
                        $scope.listDokter = e.data;
                    })
                } else {
                    $scope.listDokter = []
                    medifirstService.get('registrasi/get-dokter-part?idRuangan=' + ruanganId, true, 10).then(function (e) {
                        var tempListDokter = e.data;
                        medifirstService.get("bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=" + $scope.item.ruangan.kdinternal + "&tanggal=" +
                            new moment($scope.item.tglRegistrasi).format('YYYY-MM-DD')).then(function (data) {
                                if (data.status == 500) {
                                    toastr.error('TIDAK DAPAT TERHUBUNG KE SERVER ANTROL', 'Jadwal Hafis');
                                    return
                                }
                                toastr.info(data.data.metaData.message, 'Jadwal Hafis');
                                var tempListDokterHafis = data.data.response
                                for (var i = tempListDokterHafis.length - 1; i >= 0; i--) {
                                    for (var x = tempListDokter.length - 1; x >= 0; x--) {
                                        if (tempListDokterHafis[i].kodedokter == tempListDokter[x].idhafis) {
                                            let resDokter = { id: tempListDokter[x].id, namalengkap: tempListDokter[x].namalengkap, idhafis: tempListDokter[x].idhafis, namahafis: tempListDokter[x].namahafis, jadwal: tempListDokterHafis[i].jadwal, kodesubspesialis: tempListDokterHafis[i].kodesubspesialis }
                                            $scope.listDokter.push(resDokter);
                                        }
                                    }
                                }
                            })
                    })
                }
            }
            $scope.$watch('item.kelas', function (e) {
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
                    .then(function (b) {

                        if ($scope.model.rawatGabung) {
                            $scope.listKamar = b.data.kamar;
                        } else {
                            $scope.listKamar = _.filter(b.data.kamar, function (v) {
                                return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                            })
                        }
                    });
            });
            $scope.$watch('item.kamar', function (e) {
                if (e === undefined) return;
                if (e.id == null) return;
                // if (!$scope.item.kamar && $scope.item.kamar.id == null) return
                var kamarId = $scope.item.kamar.id;
                if ($scope.item.IsEditLoadPertamaKelas == false) {
                    $scope.item.nomorTempatTidur = ""
                }
                medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function (a) {
                        if ($scope.model.rawatGabung) {
                            $scope.listNoBed = a.data.bed;
                        } else {
                            $scope.listNoBed = _.filter(a.data.bed, function (v) {
                                return v.statusbed === "KOSONG";
                            })
                        }
                    })
            });

            $scope.ceklisNomorRujukanMulti = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = true
                    $scope.model.cekNomorPeserta = false
                } else
                    $scope.model.generateNoSEP = false
            }
            $scope.ceklispilihRujukan = function (bool) {
                // body...
                if (bool) {
                    $scope.model.cekpilihPascaranap = false
                    $scope.model.cekpilihManual = false
                    $scope.isBpjsRJsep = false
                }
            }


            $scope.ceklispilihPascaranap = function (bool) {
                if (bool) {
                    $scope.model.cekpilihRujukan = false
                    $scope.model.cekpilihManual = false
                    $scope.isBpjsRJsep = false
                    $scope.model.generateNoSEP = true
                    $scope.isPemberiSurat = true
                    $scope.isTujuanKunjungan = false
                    $scope.isflagProcedure = false
                    $scope.iskdPenunjang = false
                    $scope.isassesmentPel = false
                    $scope.isDpjpMelayani = true
                    delete $scope.model.skdp
                    delete $scope.model.DPJPMelayani
                    delete $scope.model.dokterDPJP
                    delete $scope.model.flagProcedure
                    delete $scope.model.kdPenunjang
                    delete $scope.model.assesmentPel
                    $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                }
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = false
                    $scope.model.cekpilihRujukan = false
                    $scope.model.cekpilihPascaranap = false
                    $scope.isBpjsRJsep = true
                    $scope.isPemberiSurat = true
                    $scope.isTujuanKunjungan = false
                    $scope.isflagProcedure = false
                    $scope.iskdPenunjang = false
                    $scope.isassesmentPel = false
                    $scope.isDpjpMelayani = false
                    delete $scope.model.skdp
                    delete $scope.model.DPJPMelayani
                    delete $scope.model.dokterDPJP
                    delete $scope.model.flagProcedure
                    delete $scope.model.kdPenunjang
                    delete $scope.model.assesmentPel
                    $scope.model.tujuanKunj = { id: '0', nama: 'Normal' }
                }
            }
            $scope.ceklispilihNoRujukan = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = true
                } else {
                    $scope.model.generateNoSEP = false
                }
            }
            $scope.generateSKDP = function (data) {
                if (data === true) {
                    $scope.model.cekNoSkdp = true
                    medifirstService.get("bridging/bpjs2/generateskdp", true).then(function (dat) {
                        var noSKDP = dat.data.noskdp
                        if (noSKDP != undefined)
                            $scope.model.skdp = noSKDP

                    })
                } else {
                    delete $scope.model.skdp
                }
            };
            $scope.cekSuratKontrol = function (data) {
                if (data === true) {
                    $scope.model.cekNosuratKontrol = true
                    medifirstService.get("bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                        $scope.popUpHistoriSuratKontrol.center().open()
                        $scope.dataSourceHistoriSuratKontrol = new kendo.data.DataSource({
                            data: data.data.response.list,
                            pageSize: 10,
                            total: data.data.response.list.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });

                    })
                } else {
                    delete $scope.model.skdp
                    delete $scope.model.DPJPMelayani
                    delete $scope.model.dokterDPJP
                }
            }
            $scope.cekRiwayat = function (data) {
                if ($scope.model.cekRiwayat == false) {
                    $scope.popUpRiwayatRegistrasi.close();
                    return;
                }
                debugger;
                // if ($scope.dataPasienSelected == undefined) {
                //     messageContainer.error("Pilih data dulu!")
                // }
                $scope.itemD.noRM = $scope.currentNoCm;
                $scope.itemD.namaPasien = $scope.item.pasien.namapasien;
                $scope.itemD.tglLahir = moment($scope.model.tglLahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                    tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
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

                        $scope.itemD.JumlahRawat = jumlahRawat;
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
            $scope.simpanEditSuratKontrol = function () {
                debugger
                var dataSend = {
                    data: {
                        request: {
                            noSuratKontrol: $scope.item.noSuratKontrolEdit,
                            noSEP: $scope.item.noSepEdit,
                            kodeDokter: $scope.item.dokterTujuanEdit.kode,
                            poliKontrol: $scope.item.kodepoliTujuanEdit,
                            tglRencanaKontrol: moment($scope.item.tanggalRencanaKontrol).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                medifirstService.putNonMessage("bridging/bpjs2/update-rencana-kontrol-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        window.messageContainer.info(e.data.metaData.message)
                        // document.getElementById("jsonUpdateRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            $scope.setEditSuratKontrol = function (x) {
                if (x.terbitSEP == 'Sudah') {
                    window.messageContainer.error('Surat Kontrol Ini Sudah Terpakai, Tidak Bisa Di Edit');
                    return
                }

                $scope.popUpHistoriSuratKontrol.close()
                $scope.popUpEditSuratKontrol.center().open()
                $scope.item.noSuratKontrolEdit = x.noSuratKontrol
                $scope.item.noSepEdit = x.noSepAsalKontrol
                // $scope.item.dokterTujuanEdit = x.namaDokter
                // $scope.item.kodedokterTujuanEdit = x.kodeDokter
                $scope.item.poliTujuanEdit = x.namaPoliTujuan
                $scope.item.kodepoliTujuanEdit = x.poliTujuan
                $scope.item.tanggalRencanaKontrol = x.tglRencanaKontrol

                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2 +
                    "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + $scope.item.kodepoliTujuanEdit).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            $scope.listDPJPTujuanEdit = data.data.response.list;
                            $scope.item.dokterTujuanEdit = { kode: x.kodeDokter, nama: x.namaDokter }
                        } else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }
            $scope.setSuratKontrol = function (dataHistorySuratKontrolSelect) {
                $scope.popUpHistoriSuratKontrol.close()
                if (new moment($scope.model.tglSEP).format('YYYY-MM-DD') != dataHistorySuratKontrolSelect.tglRencanaKontrol) {
                    window.messageContainer.error('Tanggal Surat Kontrol Tidak Sama Dengan Tanggal SEP');
                    return
                }
                if ($scope.model.rawatInap == true && dataHistorySuratKontrolSelect.jnsKontrol == 2) {
                    window.messageContainer.error('Nomor Surat Yang Anda Pilih Itu Untuk Rajal, Bukan Untuk Rawat Inap.');
                    return
                } else if ($scope.model.rawatInap == false && dataHistorySuratKontrolSelect.jnsKontrol == 1) {
                    window.messageContainer.error('Nomor Surat Yang Anda Pilih Itu Untuk Ranap, Bukan Untuk Rawat Rajal.');
                    return
                } else if ($scope.model.rawatInap == undefined && dataHistorySuratKontrolSelect.jnsKontrol == 1) {
                    window.messageContainer.error('Nomor Surat Yang Anda Pilih Itu Untuk Ranap, Bukan Untuk Rawat Rajal.');
                    return
                }
                if (dataHistorySuratKontrolSelect.jnsKontrol == 1) {
                    $scope.model.skdp = dataHistorySuratKontrolSelect.noSuratKontrol
                    $scope.model.noRujukan = dataHistorySuratKontrolSelect.noSuratKontrol
                    $scope.model.dokterDPJP = { kode: dataHistorySuratKontrolSelect.kodeDokter, nama: dataHistorySuratKontrolSelect.namaDokter }
                } else {
                    medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + dataHistorySuratKontrolSelect.noSuratKontrol).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.model.skdp = e.data.response.noSuratKontrol
                            $scope.model.DPJPMelayani = { kode: e.data.response.kodeDokter, nama: e.data.response.namaDokter }
                            $scope.model.dokterDPJP = { kode: e.data.response.kodeDokterPembuat, nama: e.data.response.namaDokterPembuat }
                            if ($scope.insert.poli.kode == 'HDL') {

                            } else {
                                $scope.insert.poli = { kode: e.data.response.poliTujuan, nama: e.data.response.namaPoliTujuan }
                            }
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                }
            }

            $scope.$watch('item.kelompokPasien', function (e) {
                if (e === undefined) return;
                if ($scope.isLoadEdit == true) {
                    $scope.nonUmum = true;
                    $scope.isLoadEdit = false;
                    return;
                }
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.listRekanan = z.data.rekanan;
                        if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.item.rekanan = '';
                            $scope.isPasienBpjs = false
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                        } else if (e.kelompokpasien.indexOf('BPJS') > -1) {
                            if (norecPD == '') {
                                if (cacheRegisOnline == undefined) {
                                    $scope.item.rekanan = { id: $scope.listRekanan[1].id, namarekanan: $scope.listRekanan[1].namarekanan };
                                }
                                $scope.nonUmum = true;
                                $scope.isPasienBpjs = true
                                $scope.isBpjsRJ = true
                                debugger
                                $scope.model.cekpilihRujukan = true
                                if ($scope.currentfaskes == 3) {
                                    $scope.model.cekpilihRujukan = false
                                    $scope.model.cekpilihPascaranap = true
                                }
                            } else {
                                $scope.nonUmum = true;
                                $scope.isPasienBpjs = true
                                $scope.isBpjsRJ = true
                                debugger
                                if ($scope.item.objectdepartemenfk.id == 24 || $scope.item.objectdepartemenfk.id == 16) {
                                    $scope.model.cekpilihManual = true
                                    let x = true
                                    $scope.ceklispilihManual(x);
                                } else {
                                    $scope.model.cekpilihRujukan = true
                                }
                                if ($scope.currentfaskes == 3) {
                                    $scope.model.cekpilihRujukan = false
                                    $scope.model.cekpilihPascaranap = true
                                }
                            }
                            // $scope.generateSKDP(true)
                            medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                                if (e.data.metaData.code === "200") {
                                    $scope.model.kelasBridg = {
                                        id: parseInt(e.data.response.peserta.hakKelas.kode),
                                        kdKelas: e.data.response.peserta.hakKelas.kode,
                                        nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                        namakelas: e.data.response.peserta.hakKelas.keterangan,
                                    };
                                    if ($scope.model.kelasBridg.id == 1) {
                                        $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                    } else if ($scope.model.kelasBridg.id == 2) {
                                        $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                    } else if ($scope.model.kelasBridg.id == 3) {
                                        $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                    }
                                    toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                                    if (e.data.response.peserta.statusPeserta.kode == 6) {
                                        $scope.penjagaanTidakDitanggung = true
                                    }

                                    kdProviderP = e.data.response.peserta.provUmum.kdProvider;
                                    nmProvider = e.data.response.peserta.provUmum.nmProvider;


                                    var json = {
                                        'nocm': $scope.item.pasien.nocm,
                                        'kdProvider': kdProviderP,
                                        'nmProvider': nmProvider
                                    }
                                    medifirstService.post('registrasi/save-master-faskes', json).then(function (e) {
                                        if (e.status === 201) { }
                                    })
                                    medifirstService.post('registrasi/save-faskes-pasien', json).then(function (z) {
                                        if (z.status === 201) { }
                                    })
                                } else {
                                    window.messageContainer.error(e.data.metaData.message);
                                }
                                $scope.isLoadingNoKartu = false;
                            }, function (err) {
                                $scope.isLoadingNoKartu = false;
                            });
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }

                        } else if (e.kelompokpasien == 'Jamkesda') {
                            if (cacheRegisOnline == undefined) {
                                $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            }
                            $scope.nonUmum = true;
                            $scope.isPasienBpjs = false
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }

                        } else if (e.kelompokpasien == 'Non Kuota') {
                            $scope.item.rekanan = undefined
                            // $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }

                        } else if (e.kelompokpasien == 'Telemedicine') {
                            $scope.item.rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                            $scope.isTelemedicine = 'true';

                        } else {
                            $scope.nonUmum = true;
                            $scope.isPasienBpjs = false
                            if (cacheRegisOnline == undefined) {
                                $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            }
                            $scope.item.jenisPasien = {
                                id: $scope.listJenisPelayanan[0].id,
                                jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan
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
            $scope.cekRawatGabung = function (data) {
                // opsi untuk pasien bayi
                // apakah pasien bayi satu ruangan dengan ibunya (true/false) ?
                $scope.model.rawatGabung = data;
            }
            $scope.cekRawatTitipan = function (data) {
                $scope.model.rawatTitipan = data;
            }
            $scope.cekallDokter = function (data) {
                $scope.model.allDokter = data;
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
            // $scope.Save = function(){
            //     $scope.popUpKasusPenyakit.center().open()
            // }

            $scope.Save = function () {
                debugger
                if ($scope.cacheNoRegistrasi == undefined) {
                    if ($scope.model.rawatInap == true) {
                        $scope.popupPilihan.center().open();
                    } else {
                        $scope.Saver(null);
                    }
                } else {
                    if ($scope.model.rawatInap == true) {
                        $scope.popupPilihan.center().open();
                    } else {
                        $scope.Saver(null);
                    }
                }
            }
            $scope.Saver = function (asui) {
                if ($scope.model.rawatInap == true) {
                    $scope.popupPilihan.close();
                }
                sensus = asui;
                debugger
                if (norecPD == '') {
                    if ($scope.item.kelompokPasien.id == 2 || $scope.item.kelompokPasien.id == 4 || $scope.item.kelompokPasien.id == 9 || $scope.item.kelompokPasien.id == 11 || $scope.item.kelompokPasien.id == 12 || $scope.item.kelompokPasien.id == 13) {
                        var tglRegis = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD')
                        medifirstService.get("registrasi/cek-pasien-bpjs-daftar?nocm=" +
                            $scope.noCm +
                            "&tglRegis=" + tglRegis + "&objectkelompokpasienfk=" + $scope.item.kelompokPasien.id).then(function (x) {
                                debugger;
                                if (x.data.data.length > 0) {
                                    // alert("Pasien BPJS ini Sudah Daftar di poli ( ' + x.data.data[0].namaruangan + ' )")
                                    if ($scope.item.ruangan.id == 569) {
                                        lanjut();
                                    } else if (x.data.data[0].id == 569 && $scope.item.ruangan.id != 569) {
                                        lanjut();
                                    } else {
                                        if (x.data.data[0].statusschedule == '') {
                                            $scope.item.pesan2kali = "Pasien Sudah Terdaftar Secara on Site ke Ruang " + x.data.data[0].namaruangan;
                                        } else {
                                            $scope.item.pesan2kali = "Pasien Sudah Terdaftar Secara Online ke Ruang " + x.data.data[0].namaruangan;
                                        }
                                        $scope.popUpGagal.center().open();
                                        return
                                    }
                                } else {
                                    debugger
                                    var cacheBaruLama = cacheHelper.get('cacheStatusPasien')
                                    if ($scope.item.ruangan.id != 569 && $scope.model.rawatInap != true && cacheBaruLama != "LAMA") {
                                        var confirm = $mdDialog.prompt()
                                            .title('Silahkan Masukan Nomor Antrian Loket Pasien?')
                                            .placeholder('No Antrian')
                                            .ariaLabel('Lucky day')
                                            .cancel('Tidak')
                                            .initialValue('')
                                            .ok('Okay!')
                                            .cancel('Tidak');
                                        $mdDialog.show(confirm).then(function (result) {
                                            noantrianLoket = result
                                            lanjut();
                                        }, function () {
                                            return
                                        });
                                    } else {
                                        lanjut();
                                    }
                                }
                            })
                    } else {
                        debugger
                        var cacheBaruLama = cacheHelper.get('cacheStatusPasien')
                        if ($scope.item.ruangan.id != 569 && $scope.model.rawatInap != true && cacheBaruLama != "LAMA") {
                            var confirm = $mdDialog.prompt()
                                .title('Silahkan Masukan Nomor Antrian Loket Pasien?')
                                .placeholder('No Antrian')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .initialValue('')
                                .ok('Okay!')
                                .cancel('Tidak');
                            $mdDialog.show(confirm).then(function (result) {
                                noantrianLoket = result
                                lanjut();
                            }, function () {
                                return
                            });
                        } else {
                            lanjut();
                        }
                    }
                } else {
                    lanjut();
                }

                function lanjut() {
                    $scope.popUpKasusPenyakit.close()
                    $scope.hideBtnSimpan = true;
                    if ($scope.item.ruangan == undefined || $scope.item.ruangan === '') {
                        toastr.error('Ruangan Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if (norecPD == '') {
                        if ($scope.item.kelompokPasien && $scope.item.kelompokPasien.id == 1 && $scope.item.ruangan.namaruangan.indexOf('Eksekutif') <= 0) {
                            medifirstService.get("registrasi/cek-pasien-bayar/" +
                                $scope.noCm).then(function (x) {
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
                                        $mdDialog.show(confirm).then(function () {
                                            $scope.lanjutDaftar();
                                        })

                                    } else {
                                        $scope.lanjutDaftar()
                                    }
                                })
                        } else if ($scope.item.kelompokPasien && $scope.item.kelompokPasien.id != 1 && $scope.item.ruangan.namaruangan.indexOf('Eksekutif') <= 0) {
                            medifirstService.get("registrasi/cek-piutang-pasien/" +
                                $scope.noCm).then(function (x) {
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
                                        $mdDialog.show(confirm).then(function () {
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
            }
            $scope.lanjutDaftar = function () {
                if (norecPD == '') {
                    debugger;
                    if ($scope.item.ruangan.id == 251) {
                        if ($scope.item.kelompokPasien.id == 11) {
                            cekAsuransi();
                            // })
                        } else {
                            alert("Pasien Harus Menggunakan Jaminan Yankes")
                            return;
                        }
                    } else
                        // if ($scope.CekPasienDaftar.length > 0 && $scope.CekPasienDaftar[0].objectruanganlastfk == $scope.item.ruangan.id && $scope.item.ruangan.objectdepartemenfk != '24') {
                        if ($scope.item.ruangan.id != 251) {
                            if ($scope.CekPasienDaftar.length > 0 && $scope.item.kelompokPasien.id == 1 && $scope.item.ruangan.objectdepartemenfk != '24') {
                                // toastr.error("Pasien Tidak Bisa Daftar Dipoli yang sama!");
                                // return;
                                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Pasien Sudah Daftar Dipoli ( ' + $scope.CekPasienDaftar[0].namaruangan + ' ) ! Lanjut Simpan? ')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function () {
                                    $scope.isDaftarKeDua = true;
                                    cekAsuransi();
                                })

                            } else if ($scope.item.kelompokPasien.id == 2 || $scope.item.kelompokPasien.id == 4 || $scope.item.kelompokPasien.id == 9 || $scope.item.kelompokPasien.id == 11 || $scope.item.kelompokPasien.id == 12 || $scope.item.kelompokPasien.id == 13) {
                                var tglRegis = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD')
                                medifirstService.get("registrasi/cek-pasien-bpjs-daftar?nocm=" +
                                    $scope.noCm +
                                    "&tglRegis=" + tglRegis + "&objectkelompokpasienfk=" + $scope.item.kelompokPasien.id).then(function (x) {
                                        debugger;
                                        if (x.data.data.length > 0) {
                                            // alert("Pasien BPJS ini Sudah Daftar di poli ( ' + x.data.data[0].namaruangan + ' )")
                                            var confirm = $mdDialog.confirm()
                                                .title('Peringatan')
                                                .textContent('Pasien ' + $scope.item.kelompokPasien.kelompokpasien + ' ini Sudah Daftar di poli ( ' + x.data.data[0].namaruangan + ' ) ! Lanjut Simpan? ')
                                                .ariaLabel('Lucky day')
                                                .cancel('Tidak')
                                                .ok('Ya')
                                            $mdDialog.show(confirm).then(function () {
                                                debugger;
                                                $scope.isDaftarKeDua = true;
                                                if ($scope.item.ruangan.id == 569) {
                                                    cekAsuransi();
                                                } else if (x.data.data[0].id == 569 && $scope.item.ruangan.id != 569) {
                                                    cekAsuransi();
                                                } else {
                                                    if (x.data.data[0].statusschedule == '') {
                                                        $scope.item.pesan2kali = "Pasien Sudah Terdaftar Secara on Site ke Ruang " + x.data.data[0].namaruangan;
                                                    } else {
                                                        $scope.item.pesan2kali = "Pasien Sudah Terdaftar Secara Online ke Ruang " + x.data.data[0].namaruangan;
                                                    }
                                                    $scope.popUpGagal.center().open();
                                                }
                                            })
                                        } else {
                                            cekAsuransi();
                                        }
                                    })
                            } else {
                                cekAsuransi();
                            }
                        }
                } else
                    cekAsuransi();

            }

            function cekAsuransi() {
                // $scope.cekAsuransi = function (){
                debugger
                if ($scope.item.objectdepartemenfk != undefined) {
                    if ($scope.item.objectdepartemenfk.id != $scope.item.ruangan.objectdepartemenfk) {
                        alert('Pasien Tidak Bisa Diedit Dengan Departemen yang Berbeda')
                        return;
                    }
                }
                var kelasId = null;
                if (!$scope.isPenunjang) {
                    if ($scope.item.kelas == undefined || $scope.item.kelas == "") {
                        kelasId = null;
                    } else
                        kelasId = $scope.item.kelas.id;
                } else {
                    kelasId = null;
                }
                var rekananId = "";
                if ($scope.item.rekanan == undefined || $scope.item.rekanan == "") {
                    rekananId = 0;
                } else
                    rekananId = $scope.item.rekanan.id;
                if (rekananId == "581669") {
                    if ($scope.model.rawatInap == true) {
                        if (kelasId != "1" && kelasId != null && $scope.item.kelas.id != 9 && $scope.item.kelas.id != 7 && $scope.item.kelas.id != 5) {
                            window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                            $scope.hideBtnSimpan = false;
                            return
                        }
                    }

                }
                var nomorTempatTidurs = "";
                if ($scope.item.nomorTempatTidur == undefined || $scope.item.nomorTempatTidur == "") {
                    if ($scope.model.rawatInap == true) {
                        messageContainer.error("Nomor Tempat Tidur Harus Di isi / Bed Penuh")
                        return
                    } else {
                        nomorTempatTidurs = null;
                    }
                } else if ($scope.model.rawatGabung == true) {
                    nomorTempatTidurs = null;
                } else
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;

                var jenisPel = "";
                if ($scope.item.jenisPasien != undefined)
                    jenisPel = $scope.item.jenisPasien.id
                else {
                    messageContainer.error("Jenis Pelayanan Harus Di isi")
                    return
                }

                var catatan = "";
                if ($scope.item.catatan == undefined || $scope.item.catatan == "") {
                    catatan = null
                } else
                    catatan = $scope.item.catatan

                if (catatan != null) {
                    if (catatan.length >= 250) {
                        alert('Catatan Terlalu Panjang, Harap Persingkat Catatan Terlebih Dahulu');
                        $scope.hideBtnSimpan = false;
                        return
                    }
                }
                if ($scope.item.ruangan.objectdepartemenfk != 16) {
                    $scope.item.ruanganasal = $scope.item.ruangan
                }
                if ($scope.model.rawatGabung === true && $scope.item.pasien.objecttitlefk != 4) {
                    alert('TIDAK BISA RAWAT GABUNG JIKA BUKAN PASIEN BAYI ! :)')
                    $scope.hideBtnSimpan = false;
                    return
                }
                if ($scope.item.kelompokPasien.kelompokpasien != ('BPJS')) {
                    $scope.SimpanRegistrasi();
                } else {
                    if (norecPD == '' && $scope.model.cekpilihPascaranap == true && $scope.model.generateNoSEP == false) {
                        toastr.error('Nomor SEP Harus Di Ceklis', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if (norecPD == '' && $scope.model.cekpilihPascaranap == true && $scope.model.generateNoSEP == undefined) {
                        toastr.error('Nomor SEP Harus Di Ceklis', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if (norecPD == '' && $scope.model.cekpilihPascaranap == true && $scope.model.cekNoSkdp == false) {
                        toastr.error('Nomor SKDP Otomatis Harus Di Ceklis', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    // ini buat rujukan
                    if (norecPD == '' && $scope.model.cekpilihRujukan == true && $scope.model.generateNoSEP == false) {
                        toastr.error('Nomor SEP Harus Di Ceklis', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if (norecPD == '' && $scope.model.cekpilihRujukan == true && $scope.model.generateNoSEP == undefined) {
                        toastr.error('Nomor SEP Harus Di Ceklis', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    // end
                    if ($scope.model.kelasDitanggung == undefined || $scope.model.kelasDitanggung == null || $scope.model.kelasDitanggung.id == undefined || $scope.model.kelasDitanggung.id == null || $scope.model.kelasDitanggung === '') {
                        toastr.error('Kelas Ditanggung Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if (kelasDitanggungCodeInaCbg != null) {
                        if (kelasDitanggungCodeInaCbg != $scope.model.kelasDitanggung.id) {
                            toastr.error('Kelas Ditanggung Yang Dipilih ' + $scope.model.kelasDitanggung.namakelas + '. Tidak Sesuai Dengan Kelas Ditanggung BPJS ' + kelasDitanggungNamaInaCbg + '.', 'Peringatan');
                            $scope.hideBtnSimpan = false;
                            return;
                        }
                    }
                    if ($scope.model.noTelpons == undefined || $scope.model.noTelpons == '-' || $scope.model.noTelpons == null || $scope.model.noTelpons == undefined || $scope.model.noTelpons === '') {
                        toastr.error('No Telefon Belum Di Isi', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if ($scope.model.generateNoSEP) {
                        $scope.generateSEP();
                    } else {
                        if (moment($scope.item.tglRegistrasi).format('YYYY-MM-DD') != moment($scope.model.tglSEP).format('YYYY-MM-DD')) {
                            toastr.error('TANGGAL SEP BERBEDA DENGAN TANGGAL REGISTRASI', 'Peringatan');
                            $scope.hideBtnSimpan = false;
                            return;
                        }
                        if ($scope.penjagaanBedaInstalasi == true) {
                            toastr.error('SEP INI BEDA INSTALASI', 'Peringatan');
                            $scope.hideBtnSimpan = false;
                            return;
                        }
                        $scope.SimpanRegistrasi();
                    }
                }
            }

            $scope.generateSEP = function () {
                debugger
                if ($scope.penjagaanTidakDitanggung == true) {
                    toastr.error('PASIEN INI SUDAH ADA NOTIFNYA TIDAK DITANGGUNG, KENAPA TETEP MAU DI GENERATE SEP???', 'Peringatan');
                    $scope.hideBtnSimpan = false;
                    return;
                }
                if (moment($scope.item.tglRegistrasi).format('YYYY-MM-DD') != moment($scope.model.tglSEP).format('YYYY-MM-DD')) {
                    toastr.error('TANGGAL SEP BERBEDA DENGAN TANGGAL REGISTRASI', 'Peringatan');
                    $scope.hideBtnSimpan = false;
                    return;
                }
                if (!$scope.model.generateNoSEP) return;
                var listRawRequired = [
                    "item.pasien.namaruangan|k-ng-model|Ruangan",
                    // "item.asalRujukan|ng-model|Asal Rujukan",
                    "item.kelompokPasien|ng-model|Kelompok Pasien",
                    // "item.pegawai|ng-model|Dokter Tidak ada jadwal hari ini",
                    // "model.namaPenjamin|k-ng-model|Nama Penjamin",
                    "item.rekanan|ng-model|Institusi Asal Pasien",
                    "model.noKepesertaan|ng-model|No Kepesertaan",
                    "item.asalRujukan|k-ng-model|Asal Rujukan",
                    // "model.noRujukan|ng-model|No Rujukan",
                    "model.tglRujukan|ng-model|Tgl Rujukan",
                    "model.diagnosa|k-ng-model|Diagnosa",
                    "model.kelasDitanggung|k-ng-model|Kelas ditanggung"
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var kelasJaminan;
                    // if ($scope.model.rawatInap == false) {
                    //     kelasJaminan = "3";
                    // } else {
                    // if ($scope.model.kelasBridg != undefined) {
                    //     kelasJaminan = $scope.model.kelasBridg.id.toString();
                    // } else {
                    if ($scope.model.kelasDitanggung != undefined) {
                        if ($scope.model.kelasDitanggung.id == "1")
                            kelasJaminan = "3"
                        if ($scope.model.kelasDitanggung.id == "2")
                            kelasJaminan = "2"
                        if ($scope.model.kelasDitanggung.id == "3")
                            kelasJaminan = "1"
                    } else
                        kelasJaminan = "3"
                    // }
                    // }
                    var noKartu = "";
                    if ($scope.model.noKepesertaan != undefined) {
                        var noKartu = $scope.model.noKepesertaan;
                    } else {
                        var noKartu = '';
                    }

                    var kdPpkRujukan = "";
                    if ($scope.model.faskesRujukan == true) {
                        if ($scope.model.namaAsalRujukanBrid != undefined) {
                            kdPpkRujukan = $scope.model.namaAsalRujukanBrid.kode;
                        }
                    } else {
                        if ($scope.model.namaAsalRujukan != undefined) {
                            var arrKdPpkRUjukan = $scope.model.namaAsalRujukan.split(' - ');
                            kdPpkRujukan = arrKdPpkRUjukan[0];
                        }
                    }


                    var kdJenisPelayanan = "";
                    var poliTujuans = "";
                    if ($scope.model.rawatInap === true) {
                        if ($scope.item.jenispasien == undefined) {
                            toastr.error('Jenis Pasien Harus Diisi', 'Peringatan');
                            return
                        } else {
                            if ($scope.item.jenispasien.id != 1) {
                                if ($scope.insert.poli == undefined) {
                                    toastr.error('Poli Tujuan Belum Diisi', 'Peringatan');
                                    $scope.hideBtnSimpan = false;
                                    return;
                                } else {
                                    poliTujuans = $scope.insert.poli.kode;
                                    kdJenisPelayanan = "2";
                                }
                            } else {
                                kdJenisPelayanan = "1";
                                kdPpkRujukan = "0119R004";
                                $scope.model.noRujukan = $scope.model.skdp;
                            }
                        }
                    } else {
                        if ($scope.insert.poli == undefined) {
                            toastr.error('Poli Tujuan Belum Diisi', 'Peringatan');
                            $scope.hideBtnSimpan = false;
                            return;
                        }
                        poliTujuans = $scope.insert.poli.kode;
                        kdJenisPelayanan = "2";
                    }

                    var kddiagnosaawal = "";
                    if ($scope.model.diagnosa != undefined)
                        kddiagnosaawal = $scope.model.diagnosa.kddiagnosa;
                    else
                        kddiagnosaawal = "";

                    var catatan = "";
                    if ($scope.model.catatan != undefined)
                        catatan = $scope.model.catatan;
                    else
                        catatan = "";

                    var polisEksekutif = "";
                    if ($scope.model.poliEksekutif)
                        polisEksekutif = "1"
                    else
                        polisEksekutif = "0"

                    var lokasiLakaLantas = "";
                    if ($scope.model.lokasiLakaLantas != undefined)
                        lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                    else
                        lokasiLakaLantas = "";


                    var noTelp = "";
                    if ($scope.model.noTelpons != undefined)
                        noTelp = $scope.model.noTelpons;
                    else
                        noTelp = "";

                    var KdAsalRujukan = "";
                    if ($scope.item.asalRujukan != undefined) {
                        if ($scope.item.asalRujukan.asalrujukan === "Puskesmas / Klinik") {
                            KdAsalRujukan = "1"
                        } else {
                            KdAsalRujukan = "2"
                        }
                    }

                    // 0904R004
                    // var poliTujuans = $scope.insert.poli.kode;
                    // if ($scope.item.pasien.kdinternal != null)
                    //     poliTujuans = $scope.item.pasien.kdinternal;
                    // else
                    //     poliTujuans = "";

                    var listPenjaminLakas = ""
                    if ($scope.model.lakalantas) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                            var c = $scope.currentListPenjaminLaka[i].value
                            b = "," + c
                            a = a + b
                        }
                        listPenjaminLakas = a.slice(1, a.length)
                    }
                    var kdPropinsi = ""
                    if ($scope.model.propinsi != undefined)
                        kdPropinsi = $scope.model.propinsi.kode

                    var kdKabupaten = ""
                    if ($scope.model.kabupaten != undefined)
                        kdKabupaten = $scope.model.kabupaten.kode

                    var kdKecamatan = ""
                    if ($scope.model.kecamatan != undefined)
                        kdKecamatan = $scope.model.kecamatan.kode

                    var tujuanKunj = ""
                    if ($scope.model.tujuanKunj != undefined)
                        tujuanKunj = $scope.model.tujuanKunj.id

                    var flagProcedure = ""
                    if ($scope.model.flagProcedure != undefined)
                        flagProcedure = $scope.model.flagProcedure.id

                    var kdPenunjang = ""
                    if ($scope.model.kdPenunjang != undefined)
                        kdPenunjang = $scope.model.kdPenunjang.id

                    var assesmentPel = ""
                    if ($scope.model.assesmentPel != undefined)
                        assesmentPel = $scope.model.assesmentPel.id


                    var dataUpdate = {
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noSep": $scope.model.noSep == undefined ? "" : $scope.model.noSep,
                                    "klsRawat": kelasJaminan,
                                    "noMR": $scope.item.pasien.nocm,
                                    "rujukan": {
                                        "asalRujukan": KdAsalRujukan,
                                        "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                                        "noRujukan": $scope.model.noRujukan == undefined ? 0 : $scope.model.noRujukan,
                                        "ppkRujukan": kdPpkRujukan
                                    },
                                    "catatan": catatan,
                                    "diagAwal": kddiagnosaawal,
                                    "poli": {
                                        "eksekutif": polisEksekutif
                                    },
                                    "cob": {
                                        "cob": $scope.model.cob == true ? "1" : "0",
                                    },
                                    "katarak": {
                                        "katarak": $scope.model.katarak == true ? "1" : "0",
                                    },
                                    "skdp": {
                                        "noSurat": $scope.model.skdp != undefined ? $scope.model.skdp : "",
                                        "kodeDPJP": $scope.model.DPJPMelayani != undefined ? $scope.model.DPJPMelayani.kode : "",
                                    },
                                    "jaminan": {
                                        "lakaLantas": $scope.model.lakalantas == true ? "1" : "0",
                                        "penjamin": {
                                            "penjamin": listPenjaminLakas,
                                            "tglKejadian": new moment($scope.model.tglKejadian).format('YYYY-MM-DD'),
                                            "keterangan": $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                                            "suplesi": {
                                                "suplesi": $scope.model.suplesi == true ? "1" : "0",
                                                "noSepSuplesi": $scope.model.nomorSepSuplesi != undefined ? $scope.model.nomorSepSuplesi : "",
                                                "lokasiLaka": {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "noTelp": noTelp,
                                    "user": $scope.item.pegawaiLogin.namaLengkap //"Ramdanegie"
                                }
                            }
                        }
                    }

                    let jenisPas = '';
                    debugger
                    if ($scope.item.ruangan.objectdepartemenfk != 16) { } else {
                        if ($scope.item.jenispasien != undefined) {
                            jenisPas = $scope.item.jenispasien.id;
                            if ($scope.item.jenispasien.id != 1) {
                                if ($scope.model.nomorSepSuplesi == undefined) {
                                    messageContainer.error("Jenis Pasien Harus Di isi")
                                    return
                                }
                            }
                            // else {
                            //     messageContainer.error("Jenis Pasien Harus Di isi")
                            //     return
                            // }
                        }
                        // if ($scope.model.nomorSepSuplesi == undefined) {
                        //     messageContainer.error("Spesialis/SubSpesialis Harus Di isi")
                        //     return
                        // }
                    }
                    // var dataSend = {
                    //     "data": {
                    //         "request": {
                    //             "t_sep": {
                    //                 "noKartu": noKartu,
                    //                 "tglSep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                    //                 "ppkPelayanan": ppkRumahSakit.trim(),
                    //                 "jnsPelayanan": kdJenisPelayanan,
                    //                 "klsRawat": kelasJaminan,
                    //                 "noMR": $scope.item.pasien.nocm,
                    //                 "rujukan": {
                    //                     "asalRujukan": KdAsalRujukan,
                    //                     "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                    //                     "noRujukan": $scope.model.noRujukan === undefined ? "0" : $scope.model.noRujukan,
                    //                     "ppkRujukan": kdPpkRujukan
                    //                 },
                    //                 "catatan": catatan,
                    //                 "diagAwal": kddiagnosaawal,
                    //                 "poli": {
                    //                     "tujuan": poliTujuans,
                    //                     "eksekutif": polisEksekutif
                    //                 },
                    //                 "cob": {
                    //                     "cob": $scope.model.cob === true ? "1" : "0"
                    //                 },
                    //                 "katarak": {
                    //                     "katarak": $scope.model.katarak === true ? "1" : "0"
                    //                 },
                    //                 "jaminan": {
                    //                     "lakaLantas": $scope.model.lakalantas === true ? "1" : "0",
                    //                     "penjamin": {
                    //                         "penjamin": listPenjaminLakas,
                    //                         "tglKejadian": new moment($scope.model.tglKejadian).format('YYYY-MM-DD'),
                    //                         "keterangan": $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                    //                         "suplesi": {
                    //                             "suplesi": $scope.model.suplesi === true ? "1" : "0",
                    //                             "noSepSuplesi": $scope.model.nomorSepSuplesi != undefined ? $scope.model.nomorSepSuplesi : "",
                    //                             "lokasiLaka": {
                    //                                 "kdPropinsi": kdPropinsi,
                    //                                 "kdKabupaten": kdKabupaten,
                    //                                 "kdKecamatan": kdKecamatan
                    //                             }
                    //                         }
                    //                     }
                    //                 },
                    //                 "skdp": {
                    //                     "noSurat": $scope.model.skdp != undefined ? $scope.model.skdp : "",
                    //                     "kodeDPJP": $scope.model.DPJPMelayani != undefined ? $scope.model.DPJPMelayani.kode : ""
                    //                 },
                    //                 "noTelp": noTelp,
                    //                 "user": $scope.item.pegawaiLogin.namaLengkap //"Ramdanegie"
                    //             }
                    //         }
                    //     }
                    // };

                    // ini vclaim v 2
                    var dataSend = {
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noKartu": noKartu,
                                    "tglSep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                                    "ppkPelayanan": ppkRumahSakit.trim(),
                                    "jnsPelayanan": kdJenisPelayanan,
                                    "klsRawat": {
                                        "klsRawatHak": kelasJaminan,
                                        "klsRawatNaik": "",
                                        "pembiayaan": "",
                                        "penanggungJawab": ""
                                    },
                                    "noMR": $scope.item.pasien.nocm,
                                    "rujukan": {
                                        "asalRujukan": KdAsalRujukan,
                                        "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                                        "noRujukan": $scope.model.noRujukan === undefined ? "" : $scope.model.noRujukan,
                                        "ppkRujukan": kdPpkRujukan
                                    },
                                    "catatan": catatan,
                                    "diagAwal": kddiagnosaawal,
                                    "poli": {
                                        "tujuan": poliTujuans,
                                        "eksekutif": polisEksekutif
                                    },
                                    "cob": {
                                        "cob": $scope.model.cob === true ? "1" : "0"
                                    },
                                    "katarak": {
                                        "katarak": $scope.model.katarak === true ? "1" : "0"
                                    },
                                    "jaminan": {
                                        "lakaLantas": $scope.model.lakalantas === true ? "1" : "0",
                                        "penjamin": {
                                            "penjamin": listPenjaminLakas,
                                            "tglKejadian": new moment($scope.model.tglKejadian).format('YYYY-MM-DD'),
                                            "keterangan": $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                                            "suplesi": {
                                                "suplesi": $scope.model.suplesi === true ? "1" : "0",
                                                "noSepSuplesi": $scope.model.nomorSepSuplesi != undefined ? $scope.model.nomorSepSuplesi : "",
                                                "lokasiLaka": {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "tujuanKunj": tujuanKunj,
                                    "flagProcedure": flagProcedure,
                                    "kdPenunjang": kdPenunjang,
                                    "assesmentPel": assesmentPel,
                                    "skdp": {
                                        "noSurat": $scope.model.skdp != undefined ? $scope.model.skdp : "",
                                        "kodeDPJP": $scope.model.dokterDPJP != undefined ? $scope.model.dokterDPJP.kode : ""
                                    },
                                    "dpjpLayan": $scope.model.DPJPMelayani != undefined ? $scope.model.DPJPMelayani.kode : "",
                                    "noTelp": noTelp,
                                    "user": $scope.item.pegawaiLogin.namaLengkap //"Ramdanegie"
                                }
                            }
                        }
                    };


                    $scope.isSimpan = true;
                    //##Generate SEP
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        // medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v1.1", dataSend).then(function (e) {
                        medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v2", dataSend).then(function (e) {
                            if (e.data.response) {
                                $scope.successGenerateSep = e.data.metaData.code;
                                if (e.data.response.sep == null) {
                                    toastr.error(e.data.metaData.message);
                                    $scope.isSimpan = false;
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                if (e.data.response.sep.peserta.noKartu != $scope.model.noKepesertaan) {
                                    toastr.error('Generate SEP Gagal, Nosep Dari BPJS Salah ');
                                    $scope.isSimpan = false;
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                $scope.model.noSep = e.data.response.sep.noSep;
                                $scope.model.generateNoSEP = false;
                                $scope.disableSEP = true;
                                // $scope.isHapusSep = true;
                                toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                                // $scope.SimpanNonGenerate();
                                $scope.SimpanRegistrasi();
                                // $scope.isSimpan = false;
                            } else {
                                $scope.isSimpan = false;
                                $scope.hideBtnSimpan = false;
                                // $scope.isNext = false;
                                window.messageContainer.error(e.data.metaData.message)
                            }
                            $scope.isLoadingRujukan = false;
                        }, function (err) {
                            $scope.isLoadingRujukan = false;
                        });
                    }
                    //## Update SEP
                    else if ($scope.model.noSep != undefined) {
                        // if ($scope.model.generateNoSEP == true) {
                        //     if ($scope.model.noSep.length > 10) {
                        //         medifirstService.deleteNonMessage("bridging/bpjs2/delete-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        //             if (e.data.metaData.code === "200") {
                        //                 window.messageContainer.log("Success Delete SEP");
                        //                 $scope.model.noSep = '';
                        //                 medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v1.1", dataSend).then(function (e) {
                        //                     if (e.data.response) {
                        //                         $scope.successGenerateSep = e.data.metaData.code;
                        //                         $scope.model.noSep = e.data.response.sep.noSep;
                        //                         $scope.model.generateNoSEP = false;
                        //                         $scope.disableSEP = true;
                        //                         // $scope.isHapusSep = true;
                        //                         toastr.success('Update SEP Success', 'Status');
                        //                         $scope.SimpanRegistrasi();
                        //                         $scope.isSimpan = false;
                        //                     } else {
                        //                         window.messageContainer.error(e.data.metaData.message)
                        //                         $scope.hideBtnSimpan = false;
                        //                         $scope.isSimpan = false;
                        //                     }
                        //                     $scope.isLoadingRujukan = false;
                        //                 }, function (err) {
                        //                     $scope.isLoadingRujukan = false;
                        //                 });
                        //             }
                        //             else {
                        //                 window.messageContainer.error(e.data.metaData.message);
                        //             }
                        //         })
                        //     }
                        // } else {
                        // $scope.SimpanNonGenerate();
                        $scope.SimpanRegistrasi();
                        $scope.isSimpan = false;
                        // }

                        //## End Update SEP
                    }
                } else {
                    $scope.hideBtnSimpan = false;
                }
            };


            $scope.SimpanRegistrasi = function () {
                debugger

                if ($scope.item.objectdepartemenfk != undefined) {
                    if ($scope.item.objectdepartemenfk.id != $scope.item.ruangan.objectdepartemenfk) {
                        alert('Pasien Tidak Bisa Diedit Dengan Departemen yang Berbeda')
                        return;
                    }
                }


                if ($scope.item.ruangan.objectdepartemenfk === '16' || $scope.item.ruangan.id === '569') {
                    if ($scope.item.namaruangan != undefined) {
                        if ($scope.item.namaruangan.id != $scope.item.ruangan.id) {
                            if ($scope.item.pelayanan === "false") {
                                // alert('Pasien Tidak Bisa diEdit Registrasi Karena Sudah Memiliki Pelayanan/Obat')
                                // return;
                                // dimatikan supaya edit registrasi bisa
                            }
                        }
                    }
                }

                var kelasId = "";
                if ($scope.item.kelas == undefined || $scope.item.kelas == "") {
                    kelasId = null;
                } else
                    kelasId = $scope.item.kelas.id;

                var rekananId = "";
                if ($scope.item.rekanan == undefined || $scope.item.rekanan == "") {
                    rekananId = 0;
                } else
                    rekananId = $scope.item.rekanan.id;
                if (rekananId == "581669") {
                    if ($scope.model.rawatInap == true) {
                        if (kelasId != "1" && kelasId != null && $scope.item.kelas.id != 9 && $scope.item.kelas.id != 7 && $scope.item.kelas.id != 5) {
                            window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                            $scope.hideBtnSimpan = false;
                            return
                        }
                    }

                }
                var dokterId = "";
                var idhafis = "";
                var nmhafis = "";
                var namadokter = "";
                var jadwal = "";
                var kodesubspesialisHafis = "";
                if ($scope.item.dokter == undefined || $scope.item.dokter == "") {
                    dokterId = null;
                } else {
                    dokterId = $scope.item.dokter.id;
                    idhafis = $scope.item.dokter.idhafis;
                    nmhafis = $scope.item.dokter.namahafis;
                    namadokter = $scope.item.dokter.namalengkap;
                    if ($scope.item.dokter.jadwal != undefined) {
                        jadwal = $scope.item.dokter.jadwal;
                        kodesubspesialisHafis = $scope.item.dokter.kodesubspesialis;
                    }
                }

                var kamarIds = "";
                if ($scope.item.kamar == undefined || $scope.item.kamar == "") {
                    kamarIds = null;
                } else
                    kamarIds = $scope.item.kamar.id;


                var nomorTempatTidurs = "";
                if ($scope.item.nomorTempatTidur == undefined || $scope.item.nomorTempatTidur == "") {
                    if ($scope.model.rawatInap == true) {
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

                var isPenanggungJawab = ""
                if ($scope.model.penanggungJawab == undefined)
                    isPenanggungJawab = "false"
                else if ($scope.model.penanggungJawab)
                    isPenanggungJawab = "true"
                else
                    isPenanggungJawab = "false"


                // if (isRawatInap == "true" && norec_Antrian != ""){
                //     messageContainer.error("Edit Registrasi Untuk Pasien Rawat Inap Tidak Bisa")
                //     return
                // }
                var tglcsr = null;
                var jaminankhusus = "";
                if ($scope.item.jaminankhusus == undefined || $scope.item.jaminankhusus == "") {
                    jaminankhusus = null
                } else {
                    jaminankhusus = $scope.item.jaminankhusus.id
                    if ($scope.item.tglcsr == undefined || $scope.item.tglcsr == null) {
                        if ($scope.model.norec_pd != undefined) {
                            // norec_PasienDaftar = $scope.model.norec_pd;
                            tglcsr = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        } else {
                            tglcsr = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss')
                        }
                    } else {
                        tglcsr = moment($scope.item.tglcsr).format('YYYY-MM-DD HH:mm:ss')
                    }
                }

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
                debugger
                if (cacheBaruLama != undefined) {
                    statusPasien = cacheBaruLama
                }
                debugger;

                if (catatan != null) {
                    if (catatan.length >= 250) {
                        alert('Catatan Terlalu Panjang, Harap Persingkat Catatan Terlebih Dahulu');
                        $scope.hideBtnSimpan = false;
                        return
                    }
                }
                debugger
                var jenisPas = "";
                if ($scope.item.ruangan.objectdepartemenfk != 16) {
                    $scope.item.ruanganasal = $scope.item.ruangan
                } else {
                    if ($scope.item.jenispasien != undefined)
                        jenisPas = $scope.item.jenispasien.id
                    else {
                        messageContainer.error("Jenis Pasien Harus Di isi")
                        return
                    }
                }
                if ($scope.model.rawatGabung === true && $scope.item.pasien.objecttitlefk != 4) {
                    alert('TIDAK BISA RAWAT GABUNG JIKA BUKAN PASIEN BAYI ! :)')
                    $scope.hideBtnSimpan = false;
                    return
                }
                var isjenispasienantrol = ""
                if ($scope.item.kelompokPasien.id == 2) {
                    isjenispasienantrol = "JKN"
                } else {
                    isjenispasienantrol = "NON JKN"
                }
                var noKartu = "";
                if ($scope.model.noKepesertaan != undefined) {
                    var noKartu = $scope.model.noKepesertaan;
                } else {
                    var noKartu = '';
                }
                debugger
                var pasiendaftar = {
                    tglregistrasi: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    tglcsr: tglcsr,
                    tglregistrasidate: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                    nocmfk: $scope.item.nocmfk,
                    objectruanganfk: $scope.item.ruangan.id,
                    objectruanganasalfk: $scope.item.ruanganasal.id,
                    objectdepartemenfk: $scope.item.ruangan.objectdepartemenfk,
                    objectkelasfk: kelasId,
                    objectkelompokpasienlastfk: $scope.item.kelompokPasien.id,
                    objectrekananfk: rekananId,
                    tipelayanan: jenisPel,
                    jenispasien: jenisPas,
                    objectpegawaifk: dokterId,
                    noregistrasi: noRegistrasizz,
                    norec_pd: norec_PasienDaftar,
                    israwatinap: isRawatInap,
                    statusschedule: isRegisOnline,
                    statuspasien: statusPasien,
                    istelemedicine: $scope.isTelemedicine,
                    jaminankhusus: jaminankhusus,
                    catatan: catatan,
                    objectkasuspenyakitlastfk: $scope.item.kp,
                    sensus: sensus,
                    // antrol
                    nomorkartu: noKartu,
                    nik: $scope.item.pasien.noidentitas,
                    nohp: $scope.item.pasien.notelepon,
                    kodepoli: $scope.item.ruangan.kdinternal,
                    namapoli: $scope.item.ruangan.namaruangan,
                    kodedokter: idhafis,
                    nmhafis: nmhafis,
                    namadokter: namadokter,
                    nomorreferensi: $scope.model.noRujukan == undefined ? "0000000000000000000" : $scope.model.noRujukan,
                    isjenispasienantrol: isjenispasienantrol,
                    normantrol: $scope.item.pasien.nocm,
                    noantrianLoket: noantrianLoket,
                    jadwal: jadwal,
                    penanggungjawab: $scope.item.PenanggungJawab != undefined ? $scope.item.PenanggungJawab : null,
                    hubungankeluargapj: $scope.item.Hubungan != undefined ? $scope.item.Hubungan : null,
                    teleponpenanggungjawab: $scope.item.TeleponP != undefined ? $scope.item.TeleponP : null,
                    isPenanggungJawab: isPenanggungJawab,
                    kodesubspesialisHafis: kodesubspesialisHafis
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
                    israwattitipan: $scope.model.rawatTitipan === true ? 1 : 0,
                }
                var objSave = {
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }
                $scope.isSimpan = true;

                medifirstService.post('registrasi/save-registrasipasien', objSave).then(function (e) {
                    $scope.isSimpan = false;
                    $scope.resultAPD = e.data.dataAPD;
                    toastr.info('ANTRIAN POLI', $scope.resultAPD.namahafis + '-' + $scope.resultAPD.noantrian);
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
                            saveBiayaKarcis($scope.model.noRegistrasi, e.data.dataAPD.norec)
                            //##log Pasien Daftar
                            medifirstService.get("sysadmin/logging/save-log-pendaftaran-pasien?norec_pd=" +
                                $scope.model.norec_pd).then(function (x) { })
                            //## end log    
                            if (isRegisOnline != '') {
                                var data = {
                                    "noreservasi": isRegisOnline,
                                }
                                medifirstService.post('registrasi/confirm-pasien-online', data).then(function (e) {
                                    if (e.data.ismobilejkn == true) {
                                        var x = Date.now();
                                        var data = {
                                            kodebooking: isRegisOnline,
                                            taskid: 3,
                                            waktu: x
                                        }
                                        var objSave = {
                                            data: data
                                        }
                                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                                            debugger
                                            // body...
                                        })
                                    }
                                    // body...
                                })
                            } else if ($scope.model.rawatInap === true) {
                                // ales
                                // var mjknJenisPasien = "NON JKN";
                                // if ($scope.item.kelompokPasien.kelompokpasien == ('BPJS')) {
                                //     mjknJenisPasien = "JKN"
                                // }
                                // var dataSend = {
                                //     "data": {
                                //         "kodebooking": $scope.Noregistrasi,
                                //         "jenispasien": mjknJenisPasien,
                                //         "nomorkartu": $scope.model.nokepesertaan,
                                //         "nik": $scope.model.noIdentitas,
                                //         "nohp": $scope.model.noTelpons,
                                //         "kodepoli": $scope.item.ruangan.kdinternal,
                                //         "namapoli": $scope.item.ruangan.namaruangan,
                                //         "pasienbaru": 0,
                                //         "norm": $scope.item.pasien.nocm,
                                //         "tanggalperiksa": moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                                //         "kodedokter": 12345,
                                //         "namadokter": "Dr. Hendra",
                                //         "jampraktek": "08:00-16:00",
                                //         "jeniskunjungan": 1,
                                //         "nomorreferensi": "0001R0040116A000001",
                                //         "nomorantrean": "A-12",
                                //         "angkaantrean": 12,
                                //         "estimasidilayani": 1615869169000,
                                //         "sisakuotajkn": 5,
                                //         "kuotajkn": 30,
                                //         "sisakuotanonjkn": 5,
                                //         "kuotanonjkn": 30,
                                //         "keterangan": "Peserta harap 30 menit lebih awal guna pencatatan administrasi."
                                //     }
                                // }
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



                        if ($scope.item.kelompokPasien.kelompokpasien != ('BPJS')) {
                            if ($scope.item.kelompokPasien.kelompokpasien != ('Umum/Pribadi')) {
                                if (norecPD == '') {
                                    $scope.inputPemakaianAsuransi();
                                }
                            }
                        } else if ($scope.item.kelompokPasien.kelompokpasien == ('BPJS')) {
                            $scope.SimpanNonGenerate();
                        }
                        if (norecPD == '' && $scope.item.ruangan.namaruangan != 'INSTALASI GAWAT DARURAT' && $scope.model.rawatInap != true &&
                            $scope.item.ruangan.namaruangan != 'Hemodialisa' && $scope.item.ruangan.namaruangan != 'RADIOLOGI' &&
                            $scope.item.ruangan.namaruangan != 'LABORATORIUM' && $scope.item.ruangan.namaruangan != 'ELEKTROMEDIK') {
                            // $scope.nomorAntrian()
                        }

                    }

                    if ($scope.nocmIgd != undefined) {
                        updateTriage();
                    }

                }, function (error) {
                    // throw error;
                    $scope.hideBtnSimpan = false
                    $scope.isSimpan = false;
                    $scope.isBatal = false;
                    if (error.data.message == "Pasien Belum Dipulangkan") {
                        // alert(error.data.message)
                        // return;
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Pasien Masih Terdaptar di Rawat Inap/ Pasien Belum Dipulangkan')
                            .ariaLabel('Lucky day')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            return;
                        })
                    }
                })
            }
            $scope.currentListPenjaminLaka = [];
            $scope.addListPenjamin = function (data) {
                var index = $scope.currentListPenjaminLaka.indexOf(data);
                if (_.filter($scope.currentListPenjaminLaka, {
                    id: data.id
                }).length === 0)
                    $scope.currentListPenjaminLaka.push(data);
                else {
                    $scope.currentListPenjaminLaka.splice(index, 1);
                }
            }
            $scope.SimpanNonGenerate = function () {
                $scope.hideBtnSimpan = true
                var noasuransi = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noasuransi = '';
                } else
                    noasuransi = $scope.model.noKepesertaan;

                var noidentitas = "";
                if ($scope.model.noIdentitas == undefined) {
                    noidentitas = '';
                } else
                    noidentitas = $scope.model.noIdentitas;

                var diagnosisfk = null;
                if ($scope.model.diagnosa == undefined) {
                    diagnosisfk = null;
                } else
                    diagnosisfk = $scope.model.diagnosa.id;

                var norujukan = "";
                if ($scope.model.noRujukan == undefined) {
                    norujukan = '';
                } else
                    norujukan = $scope.model.noRujukan;

                var noKepesertaans = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noKepesertaans = '';
                } else
                    noKepesertaans = $scope.model.noKepesertaan;

                var nosep = "";
                if ($scope.model.noSep == undefined) {
                    nosep = '';
                } else
                    nosep = $scope.model.noSep;

                var tanggalsep = "";
                if ($scope.model.tglSEP == undefined) {
                    tanggalsep = null;
                } else
                    tanggalsep = new moment($scope.model.tglSEP).format('YYYY-MM-DD HH:mm:ss');;

                var tglRujukan = "";
                if ($scope.model.tglRujukan == undefined) {
                    tglRujukan = '';
                } else
                    tglRujukan = new moment($scope.model.tglRujukan).format('YYYY-MM-DD HH:mm:ss');


                var noCM = "";
                if ($scope.item.pasien.nocm == undefined)
                    noCM = ''
                else
                    noCM = $scope.item.pasien.nocm

                var catatans = "";
                if ($scope.model.catatan == undefined) {
                    catatans = '';
                } else
                    catatans = $scope.model.catatan;

                var kdProviders = "-";
                var namaProviders = "-";
                if ($scope.model.faskesRujukan == true) {
                    if ($scope.model.namaAsalRujukanBrid != undefined) {
                        kdProviders = $scope.model.namaAsalRujukanBrid.kode
                        namaProviders = $scope.model.namaAsalRujukanBrid.nama
                    }
                } else {
                    if ($scope.model.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.model.namaAsalRujukan.split(' - ');
                        kdProviders = arrKdPpkRUjukan[0];
                        namaProviders = arrKdPpkRUjukan[1];
                    }
                }

                if (namaProviders == undefined) {
                    namaProviders = "-";
                }

                medifirstService.get("registrasi/get-asuransipasienbynocm?nocm=" +
                    $scope.item.pasien.nocm)
                    .then(function (f) {
                        $scope.cekTableAsuransiPas = f.data.data[0];
                    });

                // debugger
                var id_AsPasien = "";
                if ($scope.cacheIdAP != undefined) {
                    id_AsPasien = $scope.cacheIdAP;
                }
                if (id_AsPasien == "null") {
                    id_AsPasien = ""
                }

                var norec_PA = "";

                if ($scope.cacheNorecPA != undefined) {
                    norec_PA = $scope.cacheNorecPA;
                }
                if (norec_PA == "null") {
                    norec_PA = ""
                }


                var alamatPesertas = "";
                if ($scope.model.alamatPeserta != undefined)
                    alamatPesertas = $scope.model.alamatPeserta;

                var kelasDitanggungs = null;
                if ($scope.model.kelasDitanggung != undefined)
                    kelasDitanggungs = $scope.model.kelasDitanggung.id;


                if ($scope.item.rekanan == undefined) {
                    window.messageContainer.error("Institusi Asal Pasien harus di isi")
                    return
                }
                if ($scope.item.rekanan.id == "581669") {
                    if ($scope.model.kelasDitanggung.id != "1" && $scope.model.kelasDitanggung.id != "6" && $scope.item.kelas.id != 5) {
                        window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                        $scope.hideBtnSimpan = false;
                        return
                    }

                }


                var namaPesertas = "";
                if ($scope.model.namaPeserta != undefined)
                    namaPesertas = $scope.model.namaPeserta;

                var jenisPesertas = "";
                if ($scope.model.jenisPeserta != undefined)
                    jenisPesertas = $scope.model.jenisPeserta;
                var lokasiLakaLantas = "";
                if ($scope.model.lokasiLakaLantas != undefined)
                    lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                else
                    lokasiLakaLantas = "";

                var listPenjaminLakas = ""
                if ($scope.model.lakalantas) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = "," + c
                        a = a + b
                    }
                    listPenjaminLakas = a.slice(1, a.length)
                }

                var noTelp = "";
                if ($scope.model.noTelpons != undefined)
                    noTelp = $scope.model.noTelpons;
                var jenisPeserta = ""
                if ($scope.model.jenisPeserta != undefined)
                    jenisPeserta = $scope.model.jenisPeserta

                var asuransipasien = {
                    id_ap: id_AsPasien,
                    noregistrasi: $scope.cacheNoRegistrasi, //$scope.item.pasien.noregistrasi,
                    nocm: noCM,
                    alamatlengkap: alamatPesertas,
                    objecthubunganpesertafk: $scope.model.hubunganPeserta.id,
                    objectjeniskelaminfk: $scope.item.pasien.objectjeniskelaminfk,
                    kdinstitusiasal: $scope.item.rekanan.id,
                    kdpenjaminpasien: $scope.item.rekanan.id,
                    objectkelasdijaminfk: kelasDitanggungs,
                    namapeserta: namaPesertas,
                    nikinstitusiasal: $scope.item.rekanan.id,
                    noasuransi: noasuransi,
                    alamat: $scope.item.pasien.alamatlengkap,
                    nocmfkpasien: $scope.item.pasien.nocmfk,
                    noidentitas: noidentitas,
                    qasuransi: $scope.item.kelompokPasien.id,
                    kelompokpasien: $scope.item.kelompokPasien.id,
                    tgllahir: $scope.model.tglLahir != undefined ? moment($scope.model.tglLahir).format('YYYY-MM-DD') : null,
                    jenispeserta: jenisPesertas,
                    kdprovider: kdProviders,
                    nmprovider: namaProviders,
                    notelpmobile: noTelp,
                    jenispeserta: jenisPeserta,
                }

                var polikode = '';
                var polinama = '';
                if ($scope.insert.poli == undefined) {
                    polikode = $scope.item.ruangan.id;
                    polinama = $scope.item.ruangan.namaruangan;
                } else {
                    polikode = $scope.insert.poli.kode;
                    polinama = $scope.insert.poli.nama;
                }
                debugger;
                var pemakaianasuransi = {
                    norec_pa: norec_PA,
                    noregistrasifk: $scope.model.norec_pd, //$scope.currentNorecPD,
                    tglregistrasi: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    diagnosisfk: diagnosisfk,
                    lakalantas: $scope.model.lakalantas === true ? 1 : 0,
                    nokepesertaan: noKepesertaans,
                    norujukan: norujukan,
                    nosep: nosep,
                    tglrujukan: tglRujukan,
                    // objectasuransipasienfk: $scope.model.noKepesertaan,
                    objectdiagnosafk: diagnosisfk,
                    tanggalsep: tanggalsep,
                    catatan: catatans,
                    lokasilaka: lokasiLakaLantas,
                    penjaminlaka: listPenjaminLakas,
                    cob: $scope.model.cob != undefined ? $scope.model.cob : false,
                    katarak: $scope.model.katarak != undefined ? $scope.model.katarak : false,
                    keteranganlaka: $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                    tglkejadian: $scope.model.lakalantas === true && $scope.model.tglLakalantas !== undefined ? moment($scope.model.tglLakalantas).format("YYYY-MM-DD") : null,
                    suplesi: $scope.model.suplesi != undefined ? $scope.model.suplesi : false,
                    nosepsuplesi: $scope.model.nomorSepSuplesi !== undefined ? $scope.model.nomorSepSuplesi : "",
                    kdpropinsi: $scope.model.propinsi !== undefined ? $scope.model.propinsi.kode : null,
                    namapropinsi: $scope.model.propinsi !== undefined ? $scope.model.propinsi.nama : null,
                    kdkabupaten: $scope.model.kabupaten !== undefined ? $scope.model.kabupaten.kode : null,
                    namakabupaten: $scope.model.kabupaten !== undefined ? $scope.model.kabupaten.nama : null,
                    kdkecamatan: $scope.model.kecamatan !== undefined ? $scope.model.kecamatan.kode : null,
                    namakecamatan: $scope.model.kecamatan !== undefined ? $scope.model.kecamatan.nama : null,
                    nosuratskdp: $scope.model.skdp !== undefined ? $scope.model.skdp : "",
                    kodedpjp: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.kode : null,
                    namadpjp: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.nama : null,
                    prolanisprb: $scope.model.prolanis !== undefined && $scope.model.prolanis !== null ? $scope.model.prolanis : null,
                    asalrujukanfk: $scope.item.asalRujukan != undefined ? $scope.item.asalRujukan.id : null,
                    polirujukankode: polikode, //$scope.item.pasien.kdinternal,
                    polirujukannama: polinama, //$scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    // polirujukankode: $scope.insert.poli.kode,//$scope.item.pasien.kdinternal,
                    // polirujukannama: $scope.insert.poli.nama,//$scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    kodedpjpmelayani: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.kode : null,
                    namadjpjpmelayanni: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.nama : null,
                    user: $scope.item.pegawaiLogin.id,

                }
                var objSave = {
                    kdProvider: kdProviderP,
                    asuransipasien: asuransipasien,
                    pemakaianasuransi: pemakaianasuransi
                }
                medifirstService.post("registrasi/save-asuransipasien", objSave).then(function (e) {

                    responData = e.data;
                    $scope.resultPA = e.data.PA;
                    $scope.isBatal = true;
                    $scope.isKembaliSEP = true;

                    $scope.saveLogging('Menerbitkan SEP', 'norec Pasien Daftar',
                        norecPD, 'Menerbitkan SEP ' + nosep + ' pada No Registrasi ' + $scope.model.noRegistrasi)

                }, function (error) {
                    $scope.hideBtnSimpan = false
                })
            }

            function saveBiayaKarcis(noregistrasi, norec_apd) {
                if ($scope.model.rawatInap != true) {
                    debugger;
                    var statusPasien = ''
                    var cacheBaruLama = cacheHelper.get('cacheStatusPasien')
                    if (cacheBaruLama != undefined) {
                        statusPasien = cacheBaruLama
                    }
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
                        'isDaftarKeDua': $scope.isDaftarKeDua,
                        'statuspasien': statusPasien,
                        'jenisPel': $scope.item.jenisPasien.id
                    }
                    medifirstService.post('registrasi/save-biaya-karcis', json).then(function (e) { });

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

                medifirstService.post('registrasi/update-data-emrpasien-pd', objSave).then(function (e) { });


            }

            // end Save Function
            $scope.updateNoreg = function () {
                medifirstService.get("registrasi/update-noregistrasi?norec_pd=" +
                    $scope.model.norec_pd).then(function (x) {
                        //debugger
                    })
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }



            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetakLabel = function (tempNoCm) {
                $scope.dats = {
                    qty: 0
                }
                $scope.winDialog.center().open();
            }
            $scope.pilihQty2 = function () {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))" +
                    'where noregistrasi = ' + "'" + $scope.cacheNoRegistrasi + "'"
                Labelpasienjaspera4(sintak)
            }

            function Labelpasienjaspera4(datas) {
                var qrcode = $scope.cacheNoRegistrasi
                // var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.cacheNoRegistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }


                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasienA4.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasienA4.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }
            $scope.pilihQty = function (data) {
                let query = "";
                loopCetakan(data, query)

                // if (isValid.status) {
                //     var qty = data.qty;
                //     var qtyhasil = data.qty * 2;
                //     if (qty !== undefined) {
                //         // window.open(window.location.origin + window.location.pathname +"#/LabelPhoto/"+$scope.item.pasien.nocm);
                //         //##save identifikasi label pasien
                //         // medifirstService.get("registrasi/identifikasi-label?norec_pd="
                //         //     + $scope.cacheNorecPD + '&islabel=' + qtyhasil
                //         // ).then(function (data) {

                //         // })
                //         // // saveImageToFile($scope.item.pasien.nocm,qty)
                //         // //##end


                //         var client = new HttpClient();
                //         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function (response) {
                //             // do something with response
                //         });
                //         $scope.winDialog.close();
                //     }

                // } else {
                //     ModelItem.showMessages(isValid.messages);
                // }
            };

            function loopCetakan(data, query) {
                debugger
                let queryjadi = ""
                for (let i = 1; data.qty >= i; i++) {

                    // for (const item of data) {
                    // query = ``
                    if (queryjadi == "") {
                        queryjadi = `SELECT * from V_labelPasien where noregistrasi = ${$scope.cacheNoRegistrasi}`;
                    } else {
                        queryjadi = `${queryjadi} UNION ALL SELECT * from V_labelPasien where noregistrasi = ${$scope.cacheNoRegistrasi}`;
                    }
                }
                Labelpasienjasper(queryjadi)
            }

            function Labelpasienjasper(datas) {
                debugger
                // var query = " SELECT * from V_labelPasien where noregistrasi = " + $scope.dataPasienSelected.noregistrasi + ""
                // var query = [];
                // for (var i = $scope.dats.qty - 1; i >= 0; i--){
                // 	if (query == ""){
                // 		query = "'"+$scope.dats.qty[i]+"'";
                // 	} else {
                // 		query = "'"+$scope.dats.qty[i]+"'";
                // 	}
                // }

                var qrcode = $scope.cacheNoRegistrasi
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.cacheNorecPD
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.cacheNoRegistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/labelPasien.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/labelPasien.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/labelPasien.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasien.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function saveImageToFile(nocm, qty) {
                medifirstService.get('registrasi/store-image-to-folder/' + nocm).then(function (e) {

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function (response) {
                        // do something with response
                    });
                    toastr.info(e.data.status, 'Info')
                    $scope.winDialog.close();
                })
            }
            $scope.cetak = function () {
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

                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    // do something with response
                });

            }

            $scope.cetakGelang = function () {
                var stt = 'false'
                if (confirm('View Gelang Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.cacheNoRegistrasi + '&view=' + stt + '&qty=' + 1, function (response) {
                    // do something with response
                });
            }

            $scope.cetakBuktiLayanan = function () {
                if ($scope.item != undefined) {
                    //##save identifikasibuktiLayanan
                    medifirstService.get("registrasi/identifikasi-buktiLayanan?norec_pd=" +
                        $scope.cacheNorecPD
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //##end 

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' + $scope.cacheNoRegistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&view=false', function (response) {
                        // do something with response
                    });

                }
            }

            $scope.CetakSumList = function () {
                if ($scope.item != undefined) {
                    //##save identifikasi summary list
                    medifirstService.get("registrasi/identifikasi-sum-list?norec_pd=" +
                        $scope.cacheNorecPD
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //## end identifikasi summary list

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + tempNoCm + "&tglRegistrasi=" + new moment(new Date()).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.currentNoCm + '&view=false', function (response) {
                        // do something with response
                    });

                }

            }
            $scope.cetakSEP = function (x) {
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
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                    }
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                                '&norec=' + $scope.cacheNoRegistrasi
                            ).then(function (data) {
                                debugger;
                                var data = data.data.data;
                                if (data[0].nokepesertaan != e.data.response.peserta.noKartu) {
                                    toastr.error('Generate SEP Gagal, Nosep Dari BPJS Salah ');
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                if (data[0].jenisrawat == 'R. Jalan') {
                                    if (e.data.response.jnsPelayanan == 'Rawat Inap') {
                                        toastr.error('SEP INI ADALAH SEP RAWAT INAP YANG DI COPY PASTE KE RAWAT JALAN, SEGERA TERBITKAN SEP RAWAT JALANNYA!.');
                                        $scope.hideBtnSimpan = false;
                                        return
                                    }
                                } else if (data[0].jenisrawat == 'R. Inap') {
                                    data[0].namadjpjpmelayani = e.data.response.kontrol.nmDokter
                                    if (e.data.response.jnsPelayanan == 'Rawat Jalan') {
                                        toastr.error('SEP INI ADALAH SEP RAWAT JALAN YANG DI COPY PASTE KE RAWAT INAP, SEGERA TERBITKAN SEP RAWAT INAPNYA!.');
                                        $scope.hideBtnSimpan = false;
                                        return
                                    }
                                }
                                if (new moment(data[0].tanggalsep).format('YYYY-MM-DD') != e.data.response.tglSep) {
                                    toastr.error('TANGGAL SEP DI VCLAIM BERBEDA DENGAN DANGAN TANGGAL REGISTRASI DI RS.');
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                $("#nosepx").text(data[0].nosep);
                                $("#nopendaftaran").text(data[0].noregistrasi);
                                $("#tglsep").text(data[0].tanggalsep);
                                $("#peserta").text(data[0].jenispeserta);
                                $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                                // $("#cob").text(data[0].penjaminlaka);
                                // $("#namapeserta").text(data[0].namapeserta);
                                $("#namapeserta").text(e.data.response.peserta.nama);
                                $("#jenisrawat").text(data[0].jenisrawat);
                                // $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                                $("#tgllahir").text(e.data.response.peserta.tglLahir);
                                $("#kelasrawathak").text(data[0].namakelashak);
                                $("#kelasrawat").text(data[0].namakelas);
                                $("#notelepon").text(data[0].notelpmobile);
                                $("#penjamin").text(data[0].penjaminlakalantas);
                                $("#politujuan").text(e.data.response.poli);
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
                            toastr.warning("Nosep Tidak ada!");
                            return;
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                        $scope.isLoadingSEP = false;
                    });


                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
                    return;
                }
            }
            $scope.tracerBon = function () {
                if ($scope.item != undefined) {

                    //##save identifikasi tracer
                    medifirstService.get("registrasi/identifikasi-tracer?norec_pd=" +
                        $scope.cacheNorecPD
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //##end

                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $state.params.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            // $scope.cetakKartu = function () {
            //     if ($scope.item != undefined) {

            //         //##save identifikasi kartu pasien
            //         medifirstService.get("registrasi/identifikasi-kartu-pasien?norec_pd="
            //             + $scope.cacheNorecPD
            //         ).then(function (data) {
            //             var datas = data.data;
            //         })
            //         //##end 

            //         // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
            //         // window.open(fixUrlLaporan, '', 'width=800,height=600')
            //         //cetakan langsung service VB 6 by grh   
            //         var client = new HttpClient();
            //         // //debugger;             
            //         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.item.pasien.nocmfk + '&view=false', function (response) {
            //             // do something with response
            //         });

            //     }
            // }
            $scope.showPopUpEMR = function () {

                var nocm = $scope.item.pasien.nocm
                $scope.listCetakan = [
                    { id: 1, nama: 'RM1.IRJ (Ringkasan Riwayat Kliink)', url: 'rm1' },
                    { id: 1, nama: 'SJP', url: 'SJP' },
                    // { id: 2, nama: 'Pemberian Informasi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id=' + nocm + '&view=true' },
                    // { id: 3, nama: 'Surat Pernyatakan Penolakan', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id=' + nocm + '&view=true' },
                    // { id: 4, nama: 'Tindakan ECT', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id=' + nocm + '&view=true' },
                    // { id: 5, nama: 'Tindakan Injeksi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id=' + nocm + '&view=true' },
                    // { id: 6, nama: 'Tindakan Fiksasi Mekanik', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id=' + nocm + '&view=true' },
                    // { id: 7, nama: 'Tindakan Anastesi Umum', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id=' + nocm + '&view=true' },
                    // { id: 8, nama: 'Kebutuhan Rencana Pulang', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id=' + nocm + '&view=true' },
                    // { id: 9, nama: 'Tindakan Infus', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id=' + nocm + '&view=true' },
                    // { id: 10, nama: 'Tindakan Kateter', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id=' + nocm + '&view=true' },
                ]
                $scope.popUpCetakanEMR.center().open()
            }
            $scope.cetakEMR = function (params) {
                if (!params) return
                if (params.url == 'rm1') {
                    rm1();
                } else if (params.url == 'SJP' && $scope.item.kelompokPasien.kelompokpasien == 'Umum/Pribadi') {
                    sjprjumum();
                } else if (params.url == 'SJP' && $scope.item.kelompokPasien.kelompokpasien != 'Umum/Pribadi') {
                    sjprjpenjamin();
                }

                // var client = new HttpClient();
                // client.get(params.url, function(response) {
                //     //aadc=response; 
                // });
            }

            function rm1() {

                debugger
                var qrcode = $scope.item.pasien.nocm
                var norec = $scope.item.pasien.nocm
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "nocm", "ruangan", "tglregistrasi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.item.pasien.nocm, $scope.item.ruangan.namaruangan, moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rmales.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/rmales.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function sjprjumum() {

                debugger
                var qrcode = $scope.item.pasien.nocm
                var norec = $scope.item.pasien.nocm
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.cacheNoRegistrasi, $scope.item.pegawaiLogin.namaLengkap], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sjprjumum.pdf');
                } else if (window.location.hostname.indexOf('http://appsimrs.rsp.unand.ac.id') > -1) {
                    xhr.open('POST', 'http://appsimrs.rsp.unand.ac.id:8797/generic/report/sjprjumum.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/sjprjumum.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function sjprjpenjamin() {

                debugger
                var qrcode = $scope.item.pasien.nocm
                var norec = $scope.item.pasien.nocm
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.cacheNoRegistrasi, $scope.item.pegawaiLogin.namaLengkap], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sjprjpenjamin.pdf');
                } else if (window.location.hostname.indexOf('http://appsimrs.rsp.unand.ac.id') > -1) {
                    xhr.open('POST', 'http://appsimrs.rsp.unand.ac.id:8797/generic/report/sjprjpenjamin.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/sjprjpenjamin.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.kartupasien = function () {
                debugger
                var qrcode = $scope.item.pasien.nocm
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.item.pasien.nocmfk
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norec", "qrcode"],
                    "paramValue": [norec, $scope.item.nocmfk], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                debugger
                medifirstService.get("registrasi/identifikasi-kartu-pasien?nocmfk=" +
                    $scope.item.pasien.nocmfk
                ).then(function (data) {
                    var datas = data.data;
                    debugger
                })
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/kartupasien2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kartupasien2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
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


            $scope.ringkasanInOut = function () {
                // if ($scope.item != undefined) {
                //     // medifirstService.get("registrasi/daftar-antrian-pasien/get-data-diagnosa-pasien?noReg="
                //     //     + $scope.cacheNoRegistrasi
                //     // ).then(function (r) {
                //     //     if (r.data.datas.length > 0 && r.data.datas[0].norec_diagnosapasien != null) {
                //     //         $scope.item.norec_apd = r.data.datas[0].norec_apd
                //     //         $scope.cetakBro();
                //     //     } else {
                //     $scope.item.jenisDiagnosis = $scope.listJenisDiagnosa[4];
                //     $scope.icd10.center().open();
                //     //     }
                //     // })
                // }
                $scope.cetakJasper();
            }

            $scope.cetakJasper = function () {
                debugger
                var pegawai = medifirstService.getPegawai();
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.cacheNoRegistrasi, pegawai.namaLengkap], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/lembarmasukranapunand.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/lembarmasukranapunand.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.suratpernyataaan = function () {
                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "nocms", "noregistrasi", "jk", "norecapd", "umur", "dirawat", "kunjungan"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR",
                        "1980-12-25 00:00:00",
                        "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.item.pasien.nocm, $scope.cacheNoRegistrasi, $scope.item.pasien.jeniskelamin, $scope.cacheNorecAPD, $scope.item.pasien.umur, dirawat.toString(), kunjungan.toString()
                    ], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratpernyataanfix.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratpernyataanfix.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.cetakMCU = function () {
                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["nocms", "noregistrasi", "norecapd"],
                    "paramValue": [$scope.item.pasien.nocm, $scope.cacheNoRegistrasi, $scope.cacheNorecAPD,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakmcu2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakmcu2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakmcu2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakmcu2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakmcu2.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakmcu2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakmcu2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakRMK = function () {
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
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();
                    $scope.cetakJasper();
                    // $scope.cetakBro();
                })
            }
            $scope.cetakRMKDs = function () {
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
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();
                    // $scope.cetakJasper();
                    $scope.cetakBro();
                })
            }

            $scope.cetakBro = function () {
                var NomorRm = $scope.item.pasien.nocm;
                var kelompokPasien = $scope.item.kelompokPasien.kelompokpasien
                var pegawai = medifirstService.getPegawai();
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.cacheNorecAPD + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.item.pasien.umur + '&petugas=' + pegawai.namaLengkap + '&view=false', function (response) { });
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
            $scope.RiwayatRegistrasi = function () {
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

            $scope.TutupPopUp = function () {
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
                    .then(function (data) {
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
            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                $scope.sourceDiagnosa = data;

            });

            $scope.inputPemakaianAsuransi = function () {
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
            $scope.inputTindakan = function () {
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
            $scope.inputTindakanNew = function () {
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

            $scope.find = function () {
                $state.go('RegistrasiPasienLama');
            }

            $scope.Next = function () {
                $state.go('RegistrasiPasienBaru');
            }

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }

            $scope.nomorAntrian = function () {
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
                    function (response) {
                        // do something with response
                    });
            }


            // function HapusPenanggungJawab(){
            //    $scope.dataItem = {};
            // }


            $scope.cetakIdentifikasiPasien = function () {
                $scope.popUp.center().open();
            }

            $scope.BatalCetak = function () {
                HapusPenanggungJawab();
                $scope.popUp.close();
            }

            $scope.CetakAh = function () {
                $scope.NocmTea = null;
                medifirstService.get("registrasi/get-data-detail-pasien?nocm=" +
                    $scope.currentNoCm)
                    .then(function (dat) {
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
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-identitas=1&noCm=' + NomorRm + '&noregis=' + $scope.cacheNoRegistrasi + '&caraBayar=' + $scope.item.kelompokPasien.kelompokpasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawai.namalengkap + '&view=' + stt, function (response) {
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


            $scope.cetakDataTriage = function () {
                if ($scope.cacheNoRegistrasi != undefined) {

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-triage=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.Back = function () {
                window.history.back()
            }
            $scope.rincianPelayananPenunjang = function () {
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

            $scope.cetakBlangkoBpjs = function () {
                if ($scope.cacheNoRegistrasi != undefined && $scope.item.kelompokPasien.kelompokpasien !== "Umum/Pribadi") {
                    // delete $scope.dataItem.pegawaiBlanko

                    medifirstService.get('registrasi/get-daftar-combo-pegawai-all?pgid=2025', true, 10).then(function (e) {
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
            $scope.cetakBlanko = function () {
                if ($scope.dataItem.pegawaiBlanko != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-blangko-bpjs=1&norec=' + $scope.cacheNoRegistrasi + '&Petugas=' + $scope.dataItem.pegawaiBlanko.id + '&view=false', function (response) {
                        // do something with response
                    });
                    $scope.popUpBlanko.close()
                }

            }
            $scope.batalBlanko = function () {
                // delete $scope.dataItem.pegawaiBlanko
                // $scope.pegawaiBlanko = {};
                $scope.popUpBlanko.close()
            }

            $scope.cetakLembarRawatInap = function (x) {
                if ($scope.cacheNoRegistrasi != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function (response) {
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

            $scope.BatalCetakDua = function () {
                $scope.dataItem.pegawaiDua = {};
                $scope.popUpDua.close();
            }

            $scope.CetakLembarRanap = function () {
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
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-ranap=1&noCm=' + NomorRm + '&caraBayar=' + $scope.item.kelompokPasien.kelompokpasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawaiDua.namalengkap + '&noRegis=' + $scope.cacheNoRegistrasi + '&view=' + stt, function (response) {
                    //aadc=response; 
                });
                $scope.NocmTea = null;
                $scope.dataItem.pegawaiDua = undefined;
                $scope.popUpDua.close();
            }
            $scope.GelangPasien = function () {
                $scope.popUpGelang.center().open();
            }
            $scope.cetakGelang = function () {
                debugger;
                // if($scope.dataPasienSelected.noregistrasi != undefined){
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelang=1&nocm=' + $scope.item.pasien.nocm + '&kelamin=' + $scope.itemCetakGelang.jenis, function (response) {
                    // do something with response
                });
                // }
            }
            // Batas */
        }
    ]);
});