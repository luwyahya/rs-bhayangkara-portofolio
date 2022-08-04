define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict'
    initialize.controller('PemakaianAsuransiCtrl', ['$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($scope, modelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {
            $scope.now = new Date();

            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            var dataKabupaten = '';
            var dataKecamatan = '';
            loadCombo()
            loadPertama();
            $scope.item = {};
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            var tanggals = dateHelper.getDateTimeFormatted3($scope.now);
            $scope.model.tglRujukan = tanggals + " 00:00";
            $scope.model.tglPelayanan = $scope.now;
            $scope.model.tglLakalantas = $scope.now;
            $scope.penjagaanTidakDitanggung = false;
            $scope.penjagaanBedaInstalasi = false;
            $scope.bpjs = true;
            $scope.isNext = true;
            $scope.isHapusSep = true;
            $scope.isBatal = true;
            $scope.isKembaliSEP = true;
            var kelasDitanggungCodeInaCbg = null
            var kelasDitanggungNamaInaCbg = null
            var cacheNoreg = '';
            var responData = "";
            var kdSpesialis = '';
            var jenisPel = ""
            var ppkRumahSakit = "0903R004"
            var namappkRumahSakit = "RS PUSAT POLRI SAID SUKANTO - KOTA JAKARTA TIMUR"
            var namafield = "kodePPKRujukan"
            var noRegistrasis = ""
            var statusBridgingTemporary = 'false'
            $scope.listDPJP = []
            $scope.listDPJP2 = []
            $scope.isPasienBpjs = false
            $scope.isBpjsRJ = false
            $scope.insert = {};



            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            medifirstService.getPart("bridging/bpjs/get-poli-part", true, true, 10).then(function (data) {
                $scope.listPoli = data;

            });


            $scope.captionRujukan = 'No Rujukan'
            medifirstService.get('sysadmin/settingdatafixed/get/' + namafield).then(function (dat) {
                ppkRumahSakit = dat.data
            })
            medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
            // medifirstService.get('sysadmin/settingdatafixed/get/statusBridgingTemporary').then(function (dat) {
            //     statusBridgingTemporary = dat.data
            // })

            medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                    if (data.data.metaData.code == 200) {
                        $scope.listDPJP2 = data.data.response.list;
                        $scope.listDPJP = data.data.response.list;
                    }
                    else
                        toastr.info('Dokter DPJP tidak ada', 'Info')
                });

            $scope.isShowLaka = false
            $scope.showLakaLantas = function () {
                $scope.isShowLaka = !$scope.isShowLaka;
            }

            $scope.listPenjaminLaka = [{
                "id": 12, "name": "Jasa Raharja PT", "value": 1
            }, {
                "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2
            }, {
                "id": 14, "name": "TASPEN PT", "value": 3
            }, {
                "id": 15, "name": "ASABRI PT", "value": 4
            }
            ];

            $scope.ListAsuransi = [
                { "id": "1", "name": "No. SEP Otomatis" }
            ];
            $scope.listLakaLantas = [
                { "id": "0", "name": "Tidak Lakalantas" },
                { "id": "1", "name": "Ya Lakalantas" }
            ];
            var cacheAsalRujuk = ''
            $scope.model.lakalantas = $scope.listLakaLantas[0]
            $scope.isCheckSEP = true;
            $scope.model.lakalantas = false;
            function loadCombo() {
                medifirstService.get("registrasi/get-combo-pemakaian-asuransi", true)
                    .then(function (dat) {
                        $scope.listAsalRujukan = dat.data.asalrujukan;
                        $scope.listKelompokPasien = dat.data.kelompokpasien;
                        $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                        $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                        // $scope.sourceRekanan= dat.data.rekanan;
                        $scope.sourceKelasDitanggung = dat.data.kelas;
                        $scope.sourceAsalRujukan = dat.data.asalrujukan;
                        // $scope.item.kelompokPasien={id:dat.data.kelompokpasien[1].id,kelompokpasien:dat.data.kelompokpasien[1].kelompokpasien}
                        // $scope.model.institusiAsalPasien={id:dat.data.rekanan[689].id,namarekanan:dat.data.rekanan[689].namarekanan}
                        $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                        cacheAsalRujuk = cacheHelper.get('cacheAsalRujukan')
                        if (cacheAsalRujuk != '' && cacheAsalRujuk != undefined) {
                            $scope.model.asalRujukan = cacheAsalRujuk
                        } else {

                            $scope.model.asalRujukan = { id: dat.data.asalrujukan[0].id, asalrujukan: dat.data.asalrujukan[0].asalrujukan }
                        }

                        //$scope.model.kelasDitanggung = { id: dat.data.kelas[2].id, namakelas: dat.data.kelas[2].namakelas }
                    });
            }

            function loadPertama() {
                // debugger;
                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-pasien-bynorec/"
                    + $scope.currentNorecPD
                    + "/"
                    + $scope.currentNorecAPD)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data[0];
                        noRegistrasis = $scope.item.pasien.noregistrasi
                        $scope.item.pasien.tglregistrasi = moment(new Date($scope.item.pasien.tglregistrasi)).format('YYYY-MM-DD HH:mm')
                        $scope.item.pasien.tgllahir = moment(new Date($scope.item.pasien.tgllahir)).format('YYYY-MM-DD')

                        $scope.model.noTelpons = e.data[0].notelepon;
                        $scope.model.noKepesertaan = e.data[0].nobpjs;
                        $scope.model.noIdentitas = e.data[0].noidentitas;
                        $scope.listKelompokPasien = ([{ id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien }]);
                        $scope.item.kelompokPasien = { id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien };
                        $scope.sourceRekanan = ([{ id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }])
                        $scope.model.institusiAsalPasien = { id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }
                        $scope.item.jenispelayanan = e.data[0].jenispelayanan;
                        if ($scope.item.kelompokPasien.id == 2) {
                            $scope.isPasienBpjs = true
                            $scope.model.cekpilihRujukan = true
                            $scope.model.Cito = 1
                            $scope.isBpjsRJ = true
                            $scope.isBpjsRJsep = false
                        } else if ($scope.item.kelompokPasien.id != 1) {
                            $scope.isPasienAsuransi = true
                        }
                        if ($scope.item.jenispelayanan == "EKSEKUTIF") {
                            $scope.model.poliEksekutif = true;
                        }
                        else
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
                        // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                        //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        //         if (data.data.metaData.code == 200)
                        //             $scope.listDPJP = data.data.response.list;
                        //         else
                        //             toastr.info('Dokter DPJP tidak ada', 'Info')
                        //     });
                        // ** rujukan dari transdata eklikik
                        if ($scope.model.noIdentitas == "0000000000000000") {

                            debugger
                        } else {
                            debugger
                            if ($scope.item.pasien.israwatinap == 'true' || $scope.item.pasien.objectruanganfk == '569') {
                                if ($scope.item.pasien.objectrekananfk == '2552' || $scope.item.pasien.objectrekananfk == '5906' || $scope.item.pasien.objectrekananfk == '581367' || $scope.item.pasien.objectrekananfk == '581368' || $scope.item.pasien.objectrekananfk == '581405' || $scope.item.pasien.objectrekananfk == '581669' || $scope.item.pasien.objectrekananfk == '581673') {
                                    $scope.isRouteLoading = true;
                                    if ($scope.model.noIdentitas == "") {
                                        toastr.error('NIK PASIEN KOSONG, SILAHKAN ISI DULU DIEDIT PASIEN! ...')
                                        $scope.isRouteLoading = false;
                                        return
                                    }
                                    medifirstService.get("bridging/bpjs/get-nik?nik=" + $scope.model.noIdentitas + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                                        $scope.isRouteLoading = false;
                                        if (e.data.metaData.code == 200) {
                                            $scope.model.cekpilihRujukan = false
                                            $scope.model.cekpilihPascaranap = false
                                            $scope.isBpjsRJsep = true
                                            debugger
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
                        var cacheTransdata = cacheHelper.get('cacheRujukanTransdataPA');
                        if (cacheTransdata != undefined) {
                            $scope.model.noRujukan = cacheTransdata.norujukan
                            $scope.model.namaAsalRujukan = cacheTransdata.kodeppkasal + " - " + cacheTransdata.asalrujukan
                            if (cacheTransdata.kddiagnosa) {
                                medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + cacheTransdata.kddiagnosa, true, true, 10)
                                    .then(function (data) {
                                        $scope.sourceDiagnosa.add(data.data[0])
                                        $scope.model.diagnosa = data.data[0]
                                    })

                            }
                            cacheHelper.set('cacheRujukanTransdataPA', undefined);
                        }
                        // ** rujukan dari transdata eklikik                   
                        var cachePasienDaftar = cacheHelper.get('CachePemakaianAsuransi');

                        $scope.cachePasienDaftar = cacheHelper.get('CachePemakaianAsuransi');
                        if (cachePasienDaftar != undefined) {
                            var arrPasienDaftar = cachePasienDaftar.split('~');
                            if (arrPasienDaftar[0] == 'null' && arrPasienDaftar[1] == 'null')
                                return
                            $scope.cacheIdAP = arrPasienDaftar[0];
                            $scope.cacheNorecPA = arrPasienDaftar[1];
                            cacheNoreg = arrPasienDaftar[2];
                            if ($scope.item.pasien.noregistrasi != cacheNoreg)
                                $scope.cacheNorecPA = undefined;
                            $scope.generateSKDP(true)
                            getPemakaianAsuransiByNoReg($scope.cacheNorecPA)
                            // medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi="
                            //     // +$scope.item.pasien.noregistrasi
                            //     + $scope.cacheNorecPA
                            // )
                            //     .then(function (x) {

                            //         $scope.model.noKepesertaan = x.data.data[0].nokepesertaan
                            //         $scope.model.namaPeserta = x.data.data[0].namapeserta
                            //         $scope.model.noIdentitas = x.data.data[0].noidentitas
                            //         // $scope.model.alamatPeserta ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            //         $scope.model.jenisPeserta = x.data.data[0].jenisPeserta
                            //         // $scope.model.noTelpons ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            //         $scope.model.hubunganPeserta = { id: x.data.data[0].objecthubunganpesertafk, hubunganpeserta: x.data.data[0].hubunganpeserta }
                            //         $scope.model.noSep = x.data.data[0].nosep
                            //         $scope.model.tglSEP = x.data.data[0].tanggalsep

                            //         // $scope.sourceKelasDitanggung = [{ id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }]
                            //         $scope.model.kelasDitanggung = { id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }
                            //         $scope.model.catatan = x.data.data[0].catatan

                            //         if(cacheAsalRujuk == ''){
                            //             if (x.data.data[0].asalrujukanfk)
                            //             $scope.model.asalRujukan = { id: x.data.data[0].asalrujukanfk, asalrujukan: x.data.data[0].asalrujukan }
                            //         }
                            //         if($scope.model.rawatInap == true){
                            //             if(x.data.data[0].norujukan != null  && x.data.data[0].norujukan!=''){
                            //                 $scope.model.noRujukan = x.data.data[0].norujukan
                            //             }else{
                            //                 $scope.model.noRujukan =  $scope.model.skdp 
                            //             }

                            //             $scope.model.namaAsalRujukan = ppkRumahSakit + " - " + namappkRumahSakit
                            //         }else{
                            //             $scope.model.namaAsalRujukan = x.data.data[0].kdprovider + " - " + x.data.data[0].nmprovider
                            //         }

                            //         $scope.model.tglRujukan = x.data.data[0].tglrujukan
                            //         if (x.data.data[0].objectdiagnosafk)
                            //             $scope.model.diagnosa = { id: x.data.data[0].objectdiagnosafk, kddiagnosa: x.data.data[0].kddiagnosa, nama: x.data.data[0].kddiagnosa + ' - ' + x.data.data[0].namadiagnosa }
                            //         $scope.model.tglLahir = x.data.data[0].tgllahir
                            //         $scope.item.kelompokPasien = { id: x.data.data[0].objectkelompokpasienlastfk, kelompokpasien: x.data.data[0].kelompokpasien }
                            //         // $scope.model.institusiAsalPasien ={id:x.data.data[0].kdpenjaminpasien,namarekanan:x.data.data[0].namarekanan}
                            //         $scope.model.institusiAsalPasien = { id: x.data.data[0].objectrekananfk, namarekanan: x.data.data[0].namarekananpd }
                            //         $scope.model.lokasiLakaLantas = x.data.data[0].lokasilakalantas
                            //         $scope.model.jenisPeserta = x.data.data[0].jenispeserta
                            //         if (x.data.data[0].kodedpjp) {
                            //             let resDpjp = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                            //             $scope.listDPJP.push(resDpjp);
                            //             $scope.model.dokterDPJP = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                            //         }

                            //         if (x.data.data[0].lakalantas == 1) {
                            //             $scope.bpjs = true
                            //             $scope.isShowLaka = true
                            //             $scope.model.lakalantas = true
                            //             $scope.model.tglLakalantas = x.data.data[0].tglkejadian
                            //             if (x.data.data[0].kdpropinsi != null) {
                            //                 $scope.listPropinsi.add({ kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi });
                            //                 $scope.model.propinsi = { kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi }
                            //             }
                            //             dataKabupaten = { kode: x.data.data[0].kdkabupaten, nama: x.data.data[0].namakabupaten }
                            //             dataKecamatan = { kode: x.data.data[0].kdkecamatan, nama: x.data.data[0].namakecamatan }
                            //             $scope.model.keteranganLaka = x.data.data[0].keteranganlaka
                            //             if (x.data.data[0].suplesi == true) {
                            //                 $scope.model.suplesi = true
                            //                 $scope.model.nomorSepSuplesi = x.data.data[0].nosepsuplesi
                            //             }
                            //         }




                            //         if (x.data.data[0].penjaminlaka != '' && x.data.data[0].penjaminlaka != null) {
                            //             var penjaminsLaka = x.data.data[0].penjaminlaka.split(',')
                            //             penjaminsLaka.forEach(function (data) {
                            //                 $scope.listPenjaminLaka.forEach(function (e) {
                            //                     if (e.value == data) {
                            //                         e.isChecked = true
                            //                         var dataid = {
                            //                             "id": e.id,
                            //                             "name": e.name,
                            //                             "value": data
                            //                         }
                            //                         $scope.currentListPenjaminLaka.push(dataid)
                            //                     }
                            //                 })
                            //             })
                            //         }
                            //         $scope.model.skdp = x.data.data[0].nosuratskdp
                            //         // $scope.model.dokterDPJP = x.data.data[0].cob
                            //         $scope.model.cob = x.data.data[0].cob
                            //         $scope.model.katarak = x.data.data[0].katarak


                            //     });
                        } else {
                            $scope.generateSKDP(true)
                            getPemakaianAsuransiByNoReg($scope.item.pasien.noregistrasi)

                        }

                    });
            }

            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                $scope.sourceDiagnosa = data;

            });

            function getPemakaianAsuransiByNoReg(noreg) {
                medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi="
                    // +$scope.item.pasien.noregistrasi
                    + noreg
                )
                    .then(function (x) {
                        if (x.data.data.length > 0) {
                            debugger
                            $scope.noRujukan = x.data.data[0].norujukanfromfaskes;
                            if (x.data.data[0].isinaplast == 'true') {
                                debugger
                                $scope.model.asalRujukan = { id: $scope.sourceAsalRujukan[3].id, asalrujukan: $scope.sourceAsalRujukan[3].asalrujukan }
                                checkDataRujukanPcare('pasca', $scope.noRujukan);
                            } else {
                                $scope.model.asalRujukan = { id: $scope.sourceAsalRujukan[1].id, asalrujukan: $scope.sourceAsalRujukan[1].asalrujukan }
                                checkDataRujukanPcare('pcare', $scope.noRujukan);
                            }
                            $scope.cacheIdAP = x.data.data[0].norec_ap;
                            $scope.cacheNorecPA = x.data.data[0].norec;
                            if (x.data.data[0].objectkelompokpasienlastfk == 2) {
                                $scope.isBpjsRJsep = true
                                $scope.model.DPJPMelayani = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                                // $scope.insert.poli = { kode: x.data.data[0].polirujukankode, nama: x.data.data[0].polirujukannama }
                                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + x.data.data[0].nosep).then(function (e) {
                                    if (e.data.metaData.code === "200") {
                                        $scope.insert.poli = { kode: x.data.data[0].polirujukankode, nama: e.data.response.poli }
                                        medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                            + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis="
                                            + $scope.insert.poli.kode).then(function (z) {
                                                if (z.data.metaData.code == 200) {
                                                    $scope.listDPJP2 = z.data.response.list;
                                                    $scope.listDPJP = z.data.response.list;
                                                }
                                                else
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
                                    $scope.model.asalRujukan = { id: x.data.data[0].asalrujukanfk, asalrujukan: x.data.data[0].asalrujukan }
                            }

                            // $scope.model.asalRujukan ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
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



            $scope.$watch('item.kelompokPasien', function (e) {
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.sourceRekanan = z.data.rekanan;
                        if (e.kelompokpasien.indexOf('BPJS') >= -1) {
                            // $scope.model.institusiAsalPasien = { id: $scope.sourceRekanan[0].id, namarekanan: $scope.sourceRekanan[0].namarekanan };
                            $scope.isCheckSEP = true;
                            $scope.noBPJS = true;
                            $scope.asuransilain = false;
                            $scope.bpjs = true;
                        } else if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.model.institusiAsalPasien = { id: $scope.sourceRekanan[0].id, namarekanan: $scope.sourceRekanan[0].namarekanan };
                            $scope.asuransilain = true;
                            $scope.bpjs = false;
                            $scope.isCheckSEP = false;
                            kosongkan()
                        }
                        else {
                            // $scope.model.institusiAsalPasien='';
                            $scope.model.sendiri = true;
                            $scope.Sendiri($scope.model.sendiri);
                            $scope.asuransilain = true;
                            $scope.bpjs = false;
                            $scope.isCheckSEP = false;
                            // kosongkan()
                        }

                    })
            });
            function kosongkan() {
                $scope.model.noKepesertaan = '';
                $scope.model.namaPeserta = '';
                $scope.model.noIdentitas = '';
                $scope.model.alamatPeserta = '';
                $scope.model.jenisPeserta = '';
                $scope.model.noTelpons = '';
                $scope.model.noSep = '';
                // $scope.model.tglsep='';
                // $scope.model.kelasDitanggung='';
                $scope.model.catatan = '';
                $scope.model.noRujukan = '';
                $scope.model.namaAsalRujukan = '';
                // $scope.model.tglRujukan='';
                // $scope.model.diagnosa='';
                $scope.model.lokasiLakaLantas = '';
            }

            $scope.Sendiri = function (data) {
                if (data === true) {
                    $scope.model.namaPeserta = $scope.item.pasien.namapasien;
                    $scope.model.tglLahir = new Date($scope.item.pasien.tgllahir)
                    $scope.model.noIdentitas = $scope.item.pasien.noidentitas;
                    $scope.model.alamatPeserta = $scope.item.pasien.alamatlengkap;
                    $scope.model.noKepesertaan = $scope.item.pasien.nobpjs;
                    $scope.model.noTelpons = $scope.item.pasien.notelepon;
                    $scope.model.noIdentitas = $scope.item.pasien.noidentitas;

                    $scope.kelasBpjs = false;
                    $scope.kelasPenjamin = true;
                } else {
                    $scope.model.noKepesertaan = "";
                    $scope.model.namaPeserta = "";
                    $scope.model.tglLahir = "";
                    $scope.model.noIdentitas = "";
                    $scope.model.alamatPeserta = "";
                    $scope.model.noTelpons = "";
                    $scope.model.noKepesertaan = "";
                    $scope.model.noIdentitas = "";


                    $scope.kelasBpjs = true;
                    $scope.kelasPenjamin = false;
                }
                $scope.disableSEP = data;
            };
            $scope.tutup = function () {
                $scope.popupRujukan.close()
            }
            $scope.klikNoRujukanMulti = function (data) {
                if (data != undefined) {
                    $scope.model.noRujukan = data.noKunjungan
                    $scope.model.tglRujukan = data.tglKunjungan
                    $scope.kodeProvider = data.provPerujuk.kode
                    $scope.namaProvider = data.provPerujuk.nama
                    $scope.model.faskesRujukan = false;
                    $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                }
            }
            $scope.setRujukan = function (data) {
                if (data != undefined) {
                    // $scope.model.noRujukan = data.noKunjungan
                    // $scope.model.tglRujukan = data.tglKunjungan
                    // $scope.kodeProvider = data.provPerujuk.kode
                    // $scope.namaProvider = data.provPerujuk.nama
                    // $scope.model.faskesRujukan = false;
                    // $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                    $scope.isBpjsRJsep = true
                    $scope.model.generateNoSEP = true
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
                    $scope.model.prolanis = data.peserta.informasi.prolanisPRB;
                    $scope.model.noTelpons = data.peserta.mr.noTelepon;
                    $scope.model.tglRujukan = new Date(data.tglKunjungan);

                    toastr.info(data.peserta.statusPeserta.keterangan, 'Status Peserta');

                    medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + data.diagnosa.kode, true, true, 10)
                        .then(function (xx) {
                            $scope.sourceDiagnosa.add(xx.data[0])
                            $scope.model.diagnosa = xx.data[0]
                        })
                    medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                        + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis="
                        + $scope.poliRujukanKode).then(function (z) {
                            if (z.data.metaData.code == 200) {
                                $scope.listDPJP2 = z.data.response.list;
                                $scope.listDPJP = z.data.response.list;
                            }
                            else
                                toastr.info('Dokter DPJP tidak ada', 'Info')
                        });
                    // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                    $scope.isLoadingRujukan = false;
                    $scope.popupRujukan.close()
                }
            }
            $scope.Sendiria = function (data) {
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            $scope.listDPJP = data.data.response.list;
                            // $scope.listDPJP2 = z.data.response.list;
                        }
                        else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }
            $scope.Sendiriaa = function (data) {
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            // $scope.listDPJP = data.data.response.list;
                            $scope.listDPJP2 = data.data.response.list;
                        }
                        else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }
            $scope.Sendiriaaa = function (data) {
                // debugger;
                // if ($scope.insert.poli.kode != undefined || $scope.insert.poli.kode != "") {
                //     medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                //         + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + $scope.insert.poli.kode).then(function (data) {
                //             if (data.data.metaData.code == 200) {
                //                 // $scope.listDPJP = data.data.response.list;
                //                 $scope.listDPJP2 = data.data.response.list;
                //             }
                //             else
                //                 toastr.info('Dokter DPJP tidak ada', 'Info')
                //         });
                // } else {
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            // $scope.listDPJP = data.data.response.list;
                            $scope.listDPJP2 = data.data.response.list;
                        }
                        else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
                // }
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


            $scope.checkKepesertaanByNoBpjs = function () {
                // if (!$scope.model.cekNomorPeserta) return;

                if ($scope.model.sendiri === true) return;
                if ($scope.model.cekNomorPeserta == true) {

                    if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                    if ($scope.model.rawatInap === true || $scope.item.pasien.kdinternal == "IGD") {
                        $scope.isLoadingNoKartu = true;
                        medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
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
                                $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                                toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                                if (e.data.response.peserta.statusPeserta.kode == 6) {
                                    $scope.penjagaanTidakDitanggung = true
                                }
                                var jenisFaskes = "rs"
                                if ($scope.model.asalRujukan.id != undefined) {
                                    if ($scope.model.asalRujukan.id == 1)
                                        jenisFaskes = "pcare"
                                    if ($scope.model.asalRujukan.id == 2)
                                        jenisFaskes = "rs"
                                }

                                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                        if (data.data.metaData.code == 200) {
                                            $scope.listDPJP = data.data.response.list;
                                            $scope.listDPJP2 = data.data.response.list;
                                        }
                                        else
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
                        if ($scope.model.asalRujukan.id != undefined) {
                            if ($scope.model.asalRujukan.id == 1)
                                jenisFaskes = "pcare"
                            if ($scope.model.asalRujukan.id == 2)
                                jenisFaskes = "rs"
                        }
                        medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
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
                                $scope.model.prolanis = e.data.response.rujukan.peserta.informasi.prolanisPRB;
                                $scope.model.noTelpons = e.data.response.rujukan.peserta.mr.noTelepon;
                                $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);

                                medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                    .then(function (data) {
                                        $scope.sourceDiagnosa.add(data.data[0])
                                        $scope.model.diagnosa = data.data[0]
                                    })

                                // get Dokter DPJP By Histori
                                $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)

                                // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
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
                    if ($scope.model.asalRujukan.id != undefined) {
                        if ($scope.model.asalRujukan.id == 1)
                            jenisFaskes = "pcare"
                        if ($scope.model.asalRujukan.id == 2)
                            jenisFaskes = "rs"
                    }
                    if ($scope.model.asalRujukan.id == 7) {
                        medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.model.noKepesertaan).then(function (e) {
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
                                            fields: {
                                            }
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
                    }
                    else {
                        medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
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
                                            fields: {
                                            }
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

                // medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                //     if (e.data.metaData.code === "200") {
                //         var tglLahir = new Date(e.data.response.peserta.tglLahir);
                //         $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                //         $scope.model.namaPeserta = e.data.response.peserta.nama;
                //         $scope.model.tglLahir = tglLahir;
                //         $scope.model.noIdentitas = e.data.response.peserta.nik;
                //         $scope.model.kelasBridg = {
                //             id: parseInt(e.data.response.peserta.hakKelas.kode),
                //             kdKelas: e.data.response.peserta.hakKelas.kode,
                //             nmKelas: e.data.response.peserta.hakKelas.keterangan,
                //             namakelas: e.data.response.peserta.hakKelas.keterangan,
                //         };
                //         if ($scope.model.kelasBridg.id == 1) {
                //             $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                //         } else if ($scope.model.kelasBridg.id == 2) {
                //             $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                //         } else if ($scope.model.kelasBridg.id == 3) {
                //             $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                //         }
                //         $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                //         $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                //         $scope.model.faskesRujukan = false;
                //         $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                //         $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                //         $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                //         toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                //         var jenisFaskes = "rs"
                //         if ($scope.model.asalRujukan != undefined) {
                //             if ($scope.model.asalRujukan.id == 1)
                //                 jenisFaskes = "pcare"
                //             if ($scope.model.asalRujukan.id == 2)
                //                 jenisFaskes = "rs"

                //         }
                //         if ($scope.model.asalRujukan.id == 7) {
                //             medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + e.data.response.peserta.noKartu).then(function (data) {
                //                 if (data.data.metaData.code == 200) {
                //                     $scope.listHistori = data.data.response.histori;

                //                     for (let i = 0; i < data.data.response.histori.length; i++) {
                //                         const element = data.data.response.histori[i];
                //                         element.no = i + 1
                //                     }
                //                     $scope.popUpHistoriPelayananPeserta.center().open()
                //                     $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                //                         data: data.data.response.histori,
                //                         pageSize: 10,
                //                         total: data.data.response.histori.length,
                //                         serverPaging: false,
                //                         schema: {
                //                             model: {
                //                                 fields: {
                //                                 }
                //                             }
                //                         }
                //                     });
                //                 }
                //             })

                //         }

                //         medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                //             if (e.data.metaData.code === "200") {
                //                 $scope.model.noRujukan = e.data.response.rujukan.noKunjungan;
                //                 $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);
                //                 var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                //                 $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                //                 $scope.model.tglLahir = tglLahir;
                //                 $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                //                 $scope.model.kelasBridg = {
                //                     id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                //                     kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                //                     nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                //                     namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                //                 };
                //                 if ($scope.model.kelasBridg.id == 1) {
                //                     $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                //                 } else if ($scope.model.kelasBridg.id == 2) {
                //                     $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                //                 } else if ($scope.model.kelasBridg.id == 3) {
                //                     $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                //                 }
                //                 // debugger
                //                 $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                //                 $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                //                 $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                //                 $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                //                 $scope.model.faskesRujukan = false;
                //                 $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                //                 $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                //                 $scope.model.prolanis = e.data.response.rujukan.peserta.informasi.prolanisPRB;
                //                 $scope.model.noTelpons = e.data.response.rujukan.peserta.mr.noTelepon;
                //                 $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);

                //                 medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                //                     .then(function (data) {
                //                         $scope.sourceDiagnosa.add(data.data[0])
                //                         $scope.model.diagnosa = data.data[0]
                //                     })

                //                 // get Dokter DPJP By Histori
                //                 $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                //                 // end Histori

                //                 // var kodespe = e.data.response.rujukan.poliRujukan.kode
                //                 // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                //                 //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kodespe).then(function (data) {
                //                 //         if (data.data.metaData.code == 200)
                //                 //             $scope.listDPJP = data.data.response.list;
                //                 //         else
                //                 //             toastr.info('Dokter DPJP tidak ada', 'Info')
                //                 //     });

                //                 toastr.info(e.data.response.rujukan.noKunjungan, 'No Rujukan');
                //             } else {
                //                 toastr.error(e.data.metaData.message, 'Info');
                //             }
                //         })
                //     } else {
                //         window.messageContainer.error(e.data.metaData.message);
                //     }
                //     $scope.isLoadingNoKartu = false;
                // }, function (err) {
                //     $scope.isLoadingNoKartu = false;
                // });



            }


            // check kepesertaan berdasarkan NIK
            $scope.checkKepesertaanByNik = function () {
                if (!$scope.model.cekNikPeserta) return;
                if (!$scope.model.noIdentitas) return;
                if ($scope.model.sendiri) return;
                if ($scope.model.noIdentitas.length > 16) {
                    window.messageContainer.error("NIK Lebih Dari 16 Digit");
                    return;
                }
                if ($scope.model.noIdentitas.length < 16) {
                    window.messageContainer.error("NIK Kurang Dari 16 Digit");
                    return;
                }

                $scope.isLoadingNIK = true;

                medifirstService.get("bridging/bpjs/get-nik?nik=" + $scope.model.noIdentitas + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
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
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }

                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                        $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.nmJenisPeserta;
                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                        if (e.data.response.peserta.statusPeserta.kode == 6) {
                            $scope.penjagaanTidakDitanggung = true
                        }
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNIK = false;
                }, function (err) {
                    $scope.isLoadingNIK = false;
                });
            };

            $scope.cariRujukanMulti = function () {
                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                if ($scope.model.asalRujukan != undefined) {
                    if ($scope.model.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.model.asalRujukan.id == 2)
                        jenisFaskes = "rs"

                }
                debugger
                if ($scope.model.cekpilihRujukan == true) {
                    medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                        if (e.data.metaData.code === "200") {
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
                                        fields: {
                                        }
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
                    medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
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
                                        fields: {
                                        }
                                    }
                                }
                            });
                        } else {
                            toastr.info(data.data.metaData.message, 'Status Peserta');
                            $scope.isLoadingNoKartu = false;
                        }
                    })
                }

            }

            $scope.checkDataRujukans = function () {
                if (!$scope.model.cekNomorRujukan) return;
                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                if ($scope.model.asalRujukan != undefined) {
                    if ($scope.model.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.model.asalRujukan.id == 2)
                        jenisFaskes = "rs"

                }
                if ($scope.model.cekpilihPascaranap == true) {
                    medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.model.noKepesertaan).then(function (e) {
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
                    medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "?norujukan=" + $scope.model.noKepesertaan).then(function (e) {
                        // debugger;
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
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
                            $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                            $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
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
                    medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
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
                            $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                            toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                            if (e.data.response.peserta.statusPeserta.kode == 6) {
                                $scope.penjagaanTidakDitanggung = true
                            }
                            var jenisFaskes = "rs"
                            if ($scope.model.asalRujukan.id != undefined) {
                                if ($scope.model.asalRujukan.id == 1)
                                    jenisFaskes = "pcare"
                                if ($scope.model.asalRujukan.id == 2)
                                    jenisFaskes = "rs"
                            }

                            medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                    if (data.data.metaData.code == 200) {
                                        $scope.listDPJP = data.data.response.list;
                                        $scope.listDPJP2 = data.data.response.list;
                                    }
                                    else
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

            $scope.checkDataRujukan = function () {
                if (!$scope.model.cekNomorRujukan) return;
                if (!$scope.model.noRujukan) return;
                if ($scope.model.sendiri) return;

                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                if ($scope.model.asalRujukan != undefined) {
                    if ($scope.model.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.model.asalRujukan.id == 2)
                        jenisFaskes = "rs"

                }
                medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "?norujukan=" + $scope.model.noRujukan).then(function (e) {
                    // debugger;
                    if (e.data.metaData.code === "200") {
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
                        $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                        $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                        $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                        $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                        medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                            .then(function (data) {
                                $scope.sourceDiagnosa.add(data.data[0])
                                $scope.model.diagnosa = data.data[0]
                            })

                        // get Dokter DPJP By Histori
                        $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                        // end Histori

                        // var kodespe = e.data.response.rujukan.poliRujukan.kode
                        // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                        //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        //         if (data.data.metaData.code == 200)
                        //             $scope.listDPJP = data.data.response.list;
                        //         else
                        //             toastr.info('Dokter DPJP tidak ada', 'Info')
                        //     });

                        // $scope.sourceDiagnosa.add({ kddiagnosa: e.data.response.rujukan.diagnosa.kode });
                        // $scope.model.diagnosa = { kddiagnosa: e.data.response.rujukan.diagnosa.kode };
                        toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingRujukan = false;
                }, function (err) {
                    $scope.isLoadingRujukan = false;
                });
            };

            // $scope.checkDataRujukanPcare = function (jenisFaskes,noRujukan) {
            function checkDataRujukanPcare(jenisFaskes, noRujukan) {
                debugger
                // if (!$scope.model.cekNomorRujukan) return;
                // if (!$scope.model.noRujukan) return;
                // if ($scope.model.sendiri) return;

                $scope.isLoadingRujukan = true;
                if (jenisFaskes == 'pasca') {
                    $scope.model.cekpilihRujukan = false;
                    $scope.model.cekpilihPascaranap = true;
                    $scope.model.cekpilihManual = false;
                    medifirstService.get("bridging/bpjs/cek-sep?nosep=" + noRujukan).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true;
                            $scope.disableSEP = true;
                            $scope.model.generateNoSEP = true;
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
                            $scope.model.noRujukan = e.data.response.noSep;
                            $scope.model.tglSEP = new Date(e.data.response.tglSep)
                            $scope.model.namaAsalRujukan = ppkRumahSakit + " - " + namappkRumahSakit

                            $scope.model.asalRujukan = { id: $scope.sourceAsalRujukan[3].id, asalrujukan: $scope.sourceAsalRujukan[3].asalrujukan }
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
                        $scope.isLoadingRujukan = false;
                    }, function (err) {
                        $scope.isLoadingSEP = false;
                        $scope.isLoadingRujukan = false;
                    });
                    debugger
                } else {
                    medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "?norujukan=" + noRujukan).then(function (e) {
                        // debugger;
                        if (e.data.metaData.code === "200") {
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
                            $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                            $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                            $scope.model.noRujukan = noRujukan;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                            medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                .then(function (data) {
                                    $scope.sourceDiagnosa.add(data.data[0])
                                    $scope.model.diagnosa = data.data[0]
                                })
                            debugger

                            // get Dokter DPJP By Histori
                            $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                            // end Histori

                            // var kodespe = e.data.response.rujukan.poliRujukan.kode
                            // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                            //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                            //         if (data.data.metaData.code == 200)
                            //             $scope.listDPJP = data.data.response.list;
                            //         else
                            //             toastr.info('Dokter DPJP tidak ada', 'Info')
                            //     });

                            // $scope.sourceDiagnosa.add({ kddiagnosa: e.data.response.rujukan.diagnosa.kode });
                            // $scope.model.diagnosa = { kddiagnosa: e.data.response.rujukan.diagnosa.kode };
                            toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                            // $scope.generateSEP();
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingRujukan = false;
                    }, function (err) {
                        $scope.isLoadingRujukan = false;
                    });
                }
            };

            $scope.getHistoriPelayananPesesta = function (noKartu) {
                medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + noKartu).then(function (data) {
                    if (data.data.metaData.code == 200) {
                        $scope.listHistori = data.data.response.histori;

                        if ($scope.listHistori.length > 0) {
                            var countKunjungan = 0

                            for (let i = 0; i < $scope.listHistori.length; i++) {
                                if ($scope.model.noRujukan != undefined && $scope.model.noRujukan.length > 8
                                    && $scope.listHistori[i].noRujukan == $scope.model.noRujukan) {
                                    countKunjungan = countKunjungan + 1
                                }
                            }
                            var jml = 0
                            jml = countKunjungan + 1

                            toastr.info('Kunjungan ke- ' + jml + ' Dengan Rujukan yang sama.', 'Info')

                            jenisPel = $scope.listHistori[0].jnsPelayanan
                            var kodeNamaPoli = $scope.listHistori[0].poli.split(' ');
                            if (kodeNamaPoli.length > 0)
                                medifirstService.get("bridging/bpjs/get-poli?kodeNamaPoli=" + kodeNamaPoli[0]).then(function (e) {
                                    if (e.data.metaData.code == 200) {
                                        var resPoli = e.data.response.poli;
                                        if (resPoli.length > 0) {
                                            for (let i in resPoli) {
                                                if ($scope.listHistori[0].poli == resPoli[i].nama) {
                                                    kdSpesialis = resPoli[i].kode
                                                    break
                                                }
                                            }
                                            // var kodespe = e.data.response.rujukan.poliRujukan.kode
                                            if ($scope.item.pasien.kdinternal == "IGD") {
                                                jenisPel = "1"
                                            }
                                            medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                                + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                                                    if (data.data.metaData.code == 200) {
                                                        $scope.listDPJP2 = data.data.response.list;
                                                        $scope.listDPJP = data.data.response.list;
                                                    }
                                                    else
                                                        toastr.info('Dokter DPJP tidak ada', 'Info')
                                                });
                                        }
                                    }

                                });
                        }
                    }
                    else
                        $scope.listHistori = []
                });
            }
            //delete sep
            $scope.DeleteSep = function () {
                // hapusSep()
                $scope.popUpPassword2.center().open();
            }
            $scope.hapusSEP = function () {
                debugger
                if ($scope.item.password2 != "kueapem") {
                    toastr.error('Password Salah !')
                    return
                }
                $scope.popUpPassword2.close();
                $scope.item.password2 = undefined
                hapusSep()
            }
            function hapusSep() {
                var sep = $scope.model.noSep;
                var passcode = 'egie';
                if (passcode == 'egie') {
                    medifirstService.deleteNonMessage("bridging/bpjs/delete-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.saveLogging('Hapus SEP', 'no SEP', sep, 'Hapus No SEP ' + sep + ' dengan noregistrasi ' + $scope.item.pasien.noregistrasi);
                            window.messageContainer.log("Success Delete SEP");
                            $scope.model.generateNoSEP = false;
                            $scope.disableSEP = false;
                            $scope.model.noSep = '';


                        }
                        else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                    })
                } else {
                    window.messageContainer.error("Tidak Bisa Delete SEP, Passcode Salah");
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

            // check kepesertaan berdasarkan SEP
            $scope.checkKepesertaanBySep = function () {

                if ($scope.model.sendiri) return;
                if ($scope.model.isCheckSEP) return;
                $scope.penjagaanBedaInstalasi = false
                $scope.isLoadingSEP = true;
                if ($scope.model.noSep === "" || $scope.model.noSep === undefined) {
                    window.messageContainer.error("No SEP Tidak Ada");
                    return;
                }
                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
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
                        if (e.data.response.jnsPelayanan == "Rawat Jalan") {
                            $scope.model.noRujukan = e.data.response.noRujukan
                        }
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
            };

            $scope.generateSEP = function () {
                debugger
                if ($scope.penjagaanTidakDitanggung == true) {
                    toastr.error('PASIEN INI SUDAH ADA NOTIFNYA TIDAK DITANGGUNG, KENAPA TETEP MAU DI GENERATE SEP???', 'Peringatan');
                    $scope.hideBtnSimpan = false;
                    return;
                }
                if (moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD') != moment($scope.model.tglSEP).format('YYYY-MM-DD')) {
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
                    "model.institusiAsalPasien|ng-model|Institusi Asal Pasien",
                    "model.noKepesertaan|ng-model|No Kepesertaan",
                    "model.asalRujukan|k-ng-model|Asal Rujukan",
                    // "model.noRujukan|ng-model|No Rujukan",
                    "model.tglRujukan|ng-model|Tgl Rujukan",
                    "model.diagnosa|k-ng-model|Diagnosa",
                    "model.kelasDitanggung|k-ng-model|Kelas ditanggung"
                ];

                var isValid = modelItem.setValidation($scope, listRawRequired);
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
                    }
                    else
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
                        kdJenisPelayanan = "1";
                        kdPpkRujukan = "0903R004";
                    }
                    else {
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
                    if ($scope.model.asalRujukan != undefined) {
                        if ($scope.model.asalRujukan.asalrujukan === "Puskesmas / Klinik") {
                            KdAsalRujukan = "1"
                        }
                        else {
                            KdAsalRujukan = "2"
                        }
                    }



                    // 0904R004

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
                                        "penjamin":
                                        {
                                            "penjamin": listPenjaminLakas,
                                            "tglKejadian": new moment($scope.model.tglKejadian).format('YYYY-MM-DD'),
                                            "keterangan": $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                                            "suplesi":
                                            {
                                                "suplesi": $scope.model.suplesi == true ? "1" : "0",
                                                "noSepSuplesi": $scope.model.nomorSepSuplesi != undefined ? $scope.model.nomorSepSuplesi : "",
                                                "lokasiLaka":
                                                {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "noTelp": noTelp,
                                    "user": $scope.item.pegawaiLogin.namaLengkap//"Ramdanegie"
                                }
                            }
                        }
                    }

                    var dataSend = {
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noKartu": noKartu,
                                    "tglSep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                                    "ppkPelayanan": ppkRumahSakit.trim(),
                                    "jnsPelayanan": kdJenisPelayanan,
                                    "klsRawat": kelasJaminan,
                                    "noMR": $scope.item.pasien.nocm,
                                    "rujukan": {
                                        "asalRujukan": KdAsalRujukan,
                                        "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                                        "noRujukan": $scope.model.noRujukan === undefined ? "0" : $scope.model.noRujukan,
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
                                    "skdp": {
                                        "noSurat": $scope.model.skdp != undefined ? $scope.model.skdp : "",
                                        "kodeDPJP": $scope.model.DPJPMelayani != undefined ? $scope.model.DPJPMelayani.kode : ""
                                    },
                                    "noTelp": noTelp,
                                    "user": $scope.item.pegawaiLogin.namaLengkap//"Ramdanegie"
                                }
                            }
                        }
                    };


                    $scope.isSimpan = true;
                    debugger
                    //##Generate SEP
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        medifirstService.postNonMessage("bridging/bpjs/insert-sep-v1.1", dataSend).then(function (e) {
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
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                $scope.model.noSep = e.data.response.sep.noSep;
                                $scope.model.generateNoSEP = false;
                                $scope.disableSEP = true;
                                $scope.isHapusSep = true;
                                toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                                $scope.SimpanNonGenerate();
                                $scope.isSimpan = false;
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
                        //         medifirstService.deleteNonMessage("bridging/bpjs/delete-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        //             if (e.data.metaData.code === "200") {
                        //                 window.messageContainer.log("Success Delete SEP");
                        //                 $scope.model.noSep = '';
                        //                 medifirstService.postNonMessage("bridging/bpjs/insert-sep-v1.1", dataSend).then(function (e) {
                        //                     if (e.data.response) {
                        //                         $scope.successGenerateSep = e.data.metaData.code;
                        //                         $scope.model.noSep = e.data.response.sep.noSep;
                        //                         $scope.model.generateNoSEP = false;
                        //                         $scope.disableSEP = true;
                        //                         // $scope.isHapusSep = true;
                        //                         toastr.success('Update SEP Success', 'Status');
                        //                         $scope.SimpanNonGenerate();
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
                        //     //  ini untuk update sep
                        //     //     medifirstService.putNonMessage("bridging/bpjs/update-sep-v1.1", dataUpdate).then(function (e) {
                        //     //     if (e.data.response) {
                        //     //         debugger
                        //     //         $scope.successGenerateSep = e.data.metaData.code;
                        //     //         $scope.model.noSep = e.data.response.sep.noSep;
                        //     //         $scope.model.generateNoSEP = false;
                        //     //         $scope.disableSEP = true;
                        //     //         $scope.isHapusSep = true;
                        //     //         toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                        //     //         $scope.SimpanNonGenerate();
                        //     //         $scope.isSimpan = false;
                        //     //     } else {
                        //     //         // $scope.isNext = false;
                        //     //         window.messageContainer.error(e.data.metaData.message)
                        //     //         $scope.isSimpan = false;
                        //     //     }
                        //     //     $scope.isLoadingRujukan = false;
                        //     // }, function (err) {
                        //     //     $scope.isLoadingRujukan = false;
                        //     // });
                        //     }
                        // } else {
                        $scope.SimpanNonGenerate();
                        $scope.isSimpan = false;
                        // }


                        // if ($scope.model.noSep.length > 10) {
                        //     medifirstService.postNonMessage("bridging/bpjs/insert-sep-v1.1", dataSend).then(function (e) {
                        //         if (e.data.response) {
                        //             $scope.successGenerateSep = e.data.metaData.code;
                        //             $scope.model.noSep = e.data.response.sep.noSep;
                        //             $scope.model.generateNoSEP = false;
                        //             $scope.disableSEP = true;
                        //             $scope.isHapusSep = true;
                        //             toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                        //             $scope.SimpanNonGenerate();
                        //             $scope.isSimpan = false;
                        //         } else {
                        //             // $scope.isNext = false;
                        //             window.messageContainer.error(e.data.metaData.message)
                        //             $scope.isSimpan = false;
                        //         }
                        //         $scope.isLoadingRujukan = false;
                        //     }, function (err) {
                        //         $scope.isLoadingRujukan = false;
                        //     });
                        // }
                        //## End Update SEP
                    }
                } else {
                    $scope.hideBtnSimpan = false;
                }
            };

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

                medifirstService.get("registrasi/get-asuransipasienbynocm?nocm="
                    + $scope.item.pasien.nocm)
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


                if ($scope.model.institusiAsalPasien == undefined) {
                    window.messageContainer.error("Institusi Asal Pasien harus di isi")
                    return
                }
                if ($scope.model.institusiAsalPasien.id == "581669") {
                    if ($scope.model.kelasDitanggung.id != "1" && $scope.model.kelasDitanggung.id != "6") {
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

                debugger
                var asuransipasien = {
                    id_ap: id_AsPasien,
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    nocm: noCM,
                    alamatlengkap: alamatPesertas,
                    objecthubunganpesertafk: $scope.model.hubunganPeserta.id,
                    objectjeniskelaminfk: $scope.item.pasien.objectjeniskelaminfk,
                    kdinstitusiasal: $scope.model.institusiAsalPasien.id,
                    kdpenjaminpasien: $scope.model.institusiAsalPasien.id,
                    objectkelasdijaminfk: kelasDitanggungs,
                    namapeserta: namaPesertas,
                    nikinstitusiasal: $scope.model.institusiAsalPasien.id,
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

                var pemakaianasuransi = {
                    norec_pa: norec_PA,
                    noregistrasifk: $scope.currentNorecPD,
                    tglregistrasi: $scope.item.pasien.tglregistrasi,
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
                    asalrujukanfk: $scope.model.asalRujukan != undefined ? $scope.model.asalRujukan.id : null,
                    polirujukankode: $scope.item.pasien.kdinternal,
                    polirujukannama: $scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    kodedpjpmelayani: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.kode : null,
                    namadjpjpmelayanni: $scope.model.DPJPMelayani !== undefined ? $scope.model.DPJPMelayani.nama : null,
                    user: $scope.item.pegawaiLogin.id,

                }
                var objSave = {
                    asuransipasien: asuransipasien,
                    pemakaianasuransi: pemakaianasuransi
                }
                medifirstService.post("registrasi/save-asuransipasien", objSave).then(function (e) {

                    responData = e.data;
                    $scope.resultPA = e.data.PA;
                    $scope.isBatal = true;
                    $scope.isKembaliSEP = true;

                    debugger

                    $scope.saveLogging('Menerbitkan SEP', 'norec Pasien Daftar',
                        $scope.currentNorecPD, 'Menerbitkan SEP ' + nosep + ' pada No Registrasi ' + $scope.item.pasien.noregistrasi)
                    debugger

                    var cachePasienDaftars = $scope.resultPA.objectasuransipasienfk
                        + "~" + $scope.resultPA.norec
                        + "~" + $scope.item.pasien.noregistrasi;
                    cacheHelper.set('CachePemakaianAsuransi', cachePasienDaftars);

                    if (e.data.status == 201 && $scope.cachePasienDaftar == undefined) {
                        $scope.Back();
                    } else {
                        $scope.hideBtnSimpan = false
                    }

                }, function (error) {
                    $scope.hideBtnSimpan = false
                })
            }


            $scope.Save = function () {
                debugger
                $scope.hideBtnSimpan = true;
                if ($scope.item.kelompokPasien.id != 1) {
                    if ($scope.model.kelasDitanggung == undefined || $scope.model.kelasDitanggung == null || $scope.model.kelasDitanggung.id == null || $scope.model.kelasDitanggung.id == undefined || $scope.model.kelasDitanggung === '') {
                        toastr.error('Kelas Ditanggung Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
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

                    // if(statusBridgingTemporary =='false'){
                    // if ($scope.poliRujukanKode != undefined && $scope.item.pasien.kdinternal != $scope.poliRujukanKode) {
                    //     var confirm = $mdDialog.confirm()
                    //         .title('Informasi')
                    //         .textContent('Pasien Kontrol ? Jika ya maka poli yg dikirim ke BPJS = ' + $scope.item.pasien.namaruangan
                    //             + ', jika tidak maka ' + $scope.poliRujukanNama)
                    //         .ariaLabel('Lucky day')
                    //         .cancel('Tidak')
                    //         .ok('Ya')
                    //     $mdDialog.show(confirm).then(function (e) {
                    //         // alert('COnfirm')
                    //         $scope.generateSEP();
                    //     }, function () {
                    //         // alert('cancel')
                    //         $scope.item.pasien.kdinternal = $scope.poliRujukanKode
                    //         $scope.item.pasien.namaruangan = $scope.poliRujukanNama
                    //         $scope.generateSEP();
                    //     });

                    // } else {
                    $scope.generateSEP();
                    // }

                    // }else{

                    //     $scope.createDummySEP()

                    // }                   
                } else {
                    if (moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD') != moment($scope.model.tglSEP).format('YYYY-MM-DD') && $scope.item.pasien.objectkelompokpasienlastfk == 2) {
                        toastr.error('TANGGAL SEP BERBEDA DENGAN TANGGAL REGISTRASI', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if ($scope.penjagaanBedaInstalasi == true) {
                        toastr.error('SEP INI BEDA INSTALASI', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    $scope.SimpanNonGenerate();
                }
            }
            $scope.createDummySEP = function () {
                if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                    medifirstService.get('bridging/bpjs/generate-sep-dummy?kodeppk=' + ppkRumahSakit).then(function (e) {
                        // debugger
                        $scope.successGenerateSep = 200;
                        $scope.model.noSep = e.data;
                        $scope.model.generateNoSEP = false;
                        $scope.disableSEP = true;
                        $scope.isHapusSep = true;
                        toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                        $scope.SimpanNonGenerate();
                    })
                } else {
                    $scope.successGenerateSep = 200;
                    // $scope.model.noSep = e.data;
                    $scope.model.generateNoSEP = false;
                    $scope.disableSEP = true;
                    $scope.isHapusSep = true;
                    toastr.success('Update SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                    $scope.SimpanNonGenerate();
                }

            }
            $scope.Back = function () {
                window.history.back();

                // $state.go('RegistrasiPasienLamaRev');
            }
            $scope.BackSEP = function () {
                if ($scope.model.kelasDitanggung == undefined || $scope.model.kelasDitanggungn === '') {
                    toastr.error('Kelas Ditanggung Belum Di Pilih', 'Peringatan');
                    return;
                }
                window.history.back();

                // $state.go('RegistrasiPasienLamaRev');
            }

            medifirstService.getPart("bridging/bpjs/get-ref-faskes", true, true, 10).then(function (data) {
                $scope.listFaskesRujukan = data;
            });



            // medifirstService.getDataDummyPHP("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + $scope.model.rawatInap == true ? "1" : "2"
            // + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis, true, true, 10).then(function (data) {
            //     $scope.listDPJP = data;
            // });

            medifirstService.getPart("bridging/bpjs/get-ref-propinsi", true, true, 10).then(function (data) {
                $scope.listPropinsi = data;
            });
            var kodePropinsi = "";
            var kodeKab = "";
            $scope.$watch('model.propinsi', function (e) {
                if (e === undefined) return;
                kodePropinsi = e.kode
                medifirstService.getPart("bridging/bpjs/get-ref-kabupaten?kodePropinsi=" + kodePropinsi, true, true, 10).then(function (data) {
                    $scope.listKabupaten = data;
                    if (dataKabupaten != '')
                        $scope.model.kabupaten = dataKabupaten
                });
            })

            $scope.$watch('model.kabupaten', function (e) {
                if (e === undefined) return;
                kodeKab = e.kode
                medifirstService.getPart("bridging/bpjs/get-ref-kecamatan?kodeKabupaten=" + kodeKab, true, true, 10).then(function (data) {
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
                    // // remove item
                    // $scope.currentListPenjaminLaka.forEach(function (item) {
                    //     for (var i = 0; i < $scope.currentListPenjaminLaka.length; i++) {
                    //         if ($scope.currentListPenjaminLaka[i].id == item.id) {
                    //             $scope.currentListPenjaminLaka.splice(i, 1);
                    //         }
                    //     }
                    // })
                    // $scope.listPenjaminLaka.forEach(function (e) {
                    //     e.isChecked = false
                    // })

                }
            })

            // medifirstService.getDataDummyPHP("bridging/bpjs/get-ref-faskes-part", true, true, 10).then(function (data) {
            //     $scope.listPpkRujukan = data;

            // });
            $scope.$watch('model.asalRujukan', function (e) {
                if (e === undefined) return;
                var jenis = ""
                if (e.id == 1)
                    jenis = 1
                else if (e.id == 2)
                    jenis = 2
                else if (e.id == 3)
                    jenis = 1
                else
                    jenis = 2
                medifirstService.getPart("bridging/bpjs/get-ref-faskes-part?jenisFaskes="
                    + jenis, true, 10, 10)
                    .then(function (x) {
                        $scope.listPpkRujukan = x;
                    })

            })
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
            $scope.generateSKDP = function (data) {
                if (data === true) {
                    $scope.model.cekNoSkdp = true
                    medifirstService.get("bridging/bpjs/generateskdp", true).then(function (dat) {
                        var noSKDP = dat.data.noskdp
                        if (noSKDP != undefined)
                            $scope.model.skdp = noSKDP

                    })
                } else {
                    delete $scope.model.skdp
                }
            };
            $scope.ceklisNoKartu = function (bool) {
                // body...
                if (bool) {
                    $scope.model.generateNoSEP = true
                    $scope.model.cekNomorRujukanMulti = false
                }
                else
                    $scope.model.generateNoSEP = false
            }



            $scope.ceklisNomorRujukanMulti = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = true
                    $scope.model.cekNomorPeserta = false
                }
                else
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
                }
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.model.cekpilihRujukan = false
                    $scope.model.cekpilihPascaranap = false
                    $scope.isBpjsRJsep = true
                }
            }
            $scope.ceklispilihNoRujukan = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = true
                } else {
                    $scope.model.generateNoSEP = false
                }
            }
            $scope.cetakSEP = function (x) {

                if (noRegistrasis != "") {

                    // // //##save identifikasi sep
                    // // medifirstService.get("operator/identifikasi-sep?norec_pd="
                    // //     + $scope.cacheNorecPD
                    // // ).then(function (data) {
                    // //     var datas = data.data;
                    // // })
                    // // //##end


                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + noRegistrasis + '&view=false', function (response) {
                    //     // do something with response
                    // });
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                    }
                    medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                                '&norec=' + noRegistrasis
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
                            toastr.warning("Nosep Tidak Ditemukan di Vclaim, SILAHKAN TERBITKAN ULANG SEP!");
                            return;
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        $scope.isLoadingSEP = false;
                    });

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
            $scope.columnHistoriPeserta = {

                selectable: 'cell',
                pageable: true,
                columns: [
                    {
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

            $scope.checkKepesertaanBySepPascaRanap = function (noSepPasca) {

                if ($scope.model.sendiri) return;
                if ($scope.model.isCheckSEP) return;

                $scope.isLoadingSEP = true;
                if (noSepPasca === "" || noSepPasca === undefined) {
                    window.messageContainer.error("No SEP Tidak Ada");
                    return;
                }
                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + noSepPasca).then(function (e) {
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
                // $scope.checkKepesertaanBySep();
                $scope.checkKepesertaanBySepPascaRanap(dataHistorySelect.noSep);
                $scope.popUpHistoriPelayananPeserta.close()
                //     // $scope.dataHistorySelect = dataHistorySelect
            }
            $scope.historiPelayanan = function (data) {
                if (data === true) {
                    if ($scope.model.noKepesertaan == undefined) return
                    medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
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
                                        fields: {
                                        }
                                    }
                                }
                            });
                        }
                    })
                } else {
                    $scope.popUpHistoriPelayananPeserta.close()
                    $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                        data: [],
                        pageSize: 10,
                        total: 0,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                }

            };


        }
    ]);
});