define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResumeMedisIGDCtrl', ['$mdDialog','ModelItem', 'CacheHelper', '$scope','$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, ModelItem, cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
        $scope.item = {}
        $scope.item.obj = []
        $scope.cc = {}
        // $scope.dataIcd9Selected = {}
        // $scope.dataIcd10Selected = {}
        $scope.cc.emrfk = 2005
        $scope.now = new Date();
        $scope.istempatLaporan = true
        $scope.depan = false;
        $scope.belakang = true;
        let tampungdiagnosa9 = '';
        let tampungdiagnosa = '';
        let hasilKonsultasi = ''
        let norecresume = '-';
        let cpptO = ''
        let lab = [];
        let rad = [];
        let obat = [];
        let obatpulang = [];
        let obatawal = [];
        var namalengkap = {};
        $scope.ketdiet = false;
        $scope.kontrol = false;
        $scope.carakeluarlain = false;
        $scope.kondisiMeninggalkanLain = false
        let tampungNorecObatPulang = '';
        let tampungNorecObat = '';
        let noreceditobatresume = '';
        $scope.dirujuk = false;
        $scope.penyebab1 = false;
        $scope.penyebab2 = false;
        let usia = '';
        var noreckematian = '';
        var nosuratkematian = '';
        let norec_emrr = '-';
        SetCacheHelper();
        LoadCombo();
        
        function SetCacheHelper() {
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function(e) {
                var result = e.data.result 
                $scope.header = result
                var arrStr = {
                        0: $scope.header.nocm,
                        1: $scope.header.namapasien,
                        2: $scope.header.jeniskelamin,
                        3: $scope.header.noregistrasi,
                        4: $scope.header.umur,
                        5: $scope.header.kelompokpasien,
                        6: $scope.header.tglregistrasi,
                        7: $scope.header.norec,
                        8: $scope.header.norec_pd,
                        9: $scope.header.objectkelasfk,
                        10: $scope.header.namakelas,
                        11: $scope.header.objectruanganfk,
                        12: $scope.header.namaruangan,
                        13: $scope.checkNoregis,
                        14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                        15: $scope.header.alamatlengkap,
                        16: $scope.header.dokterdpjp,
                        17: $scope.header.iddpjp,
                        18: $scope.header.tgllahir,
                        19: $scope.header.objectkelompokpasienlastfk,
                        20: $scope.header.golongandarah,
                        21: $scope.header.namarekanan,
                        22: $scope.header.objectrekananfk,
                        23: $scope.header.objectdepartemenfk,
                        24: $scope.header.ruanganterakhir,
                        25: $scope.header.nocmfk,
                        26: $scope.header.objectagamafk,
                        27: $scope.header.agama,
                        28: $scope.header.objectpendidikanfk,
                        29: $scope.header.pendidikan,
                        30: $scope.header.objectpekerjaanfk,
                        31: $scope.header.pekerjaan,
                        32: $scope.header.noidentitas,
                        33: $scope.header.objectjeniskelaminfk,
                        34: $scope.header.tempatlahir,
                        35: $scope.header.notelepon
                    } 
                    cacheHelper.set('cacheRMelektronik', arrStr); 
                    LoadCacheHelper();
            })     
        }
        function LoadCacheHelper() {
            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.tgllahir = chacePeriode[14]
                $scope.cc.dpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                $scope.cc.norec_emr = '-'
                $scope.item.kdKelompokPasien = chacePeriode[19]
                $scope.cc.namarekanan = chacePeriode[21]
                $scope.cc.objectrekananfk = chacePeriode[22]
                $scope.cc.objectdepartemenfk = chacePeriode[23]
                $scope.cc.noregistrasi2 = chacePeriode[25]
                $scope.cc.noidentitas = chacePeriode[32]
                $scope.cc.objectjeniskelaminfk = chacePeriode[33]
                $scope.cc.tempatlahir = chacePeriode[34]
                $scope.cc.notelepon = chacePeriode[35]
                init()
                kematian()
            }
            let pegawai = JSON.parse(localStorage.getItem('pegawai'));
            $scope.item.poliklinik = {id:$scope.cc.objectruanganfk, namaruangan: $scope.cc.namaruangan}
            $scope.item.jenisKelamin = {id:$scope.cc.objectjeniskelaminfk, jeniskelamin: $scope.cc.jeniskelamin}
            $scope.item.noRm = $scope.cc.nocm
            $scope.item.namaPasien = $scope.cc.namapasien
            $scope.item.ttdPasien = $scope.cc.namapasien
            $scope.item.nik = $scope.cc.noidentitas
            $scope.item.tglLahir = $scope.cc.tgllahir
            $scope.item.tempatLahir = $scope.cc.tempatlahir
            $scope.item.penjamin = {id:$scope.cc.objectrekananfk, namarekanan: $scope.cc.namarekanan}
            $scope.item.noTelpPenjamin = $scope.cc.notelepon
            $scope.item.dpjp = { id: $scope.cc.iddpjp, namalengkap: $scope.cc.dpjp }
        }
        function init() {
            $scope.isRouteLoading = true;
            medifirstService.get('emr/get-resume-medis-igd/' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                if (dat.statResponse) {
                    let result = dat.data.data
                    debugger
                    if (result.length > 0) {
                        for (let index = 0; index < result.length; index++) {
                            result[index].no = index + 1
                        }
                        norecresume = result[0].norec
                        $scope.item.tglMasuk = $scope.cc.tglregistrasi
                        $scope.item.tglPulang = $scope.cc.tglpulang
                        // $scope.item.keluhanUtama = result[0].keluhanutama
                        // $scope.item.alergi = result[0].alergi,
                        // $scope.item.tingkatKesadaran = result[0].kesadaran 
                        // $scope.item.keadaanUmum = result[0].keadaanumum
                        // $scope.item.denyutJantung = result[0].denyutjantung
                        // $scope.item.pernapasan = result[0].pernapasan
                        // $scope.item.systole = result[0].systole
                        // $scope.item.diastole = result[0].diastole
                        // $scope.item.suhu = result[0].suhu
                        // $scope.item.pemeriksaanFisik = result[0].pemeriksaandisik
                        $scope.item.diet = { diet:result[0].diet }
                        $scope.item.keterangandiet = result[0].keterangandiet,
                        $scope.item.edukasi = result[0].edukasi,
                        $scope.item.prognosis = { prognosis: result[0].prognosis }
                        $scope.item.carakeluar = { statuspulang: result[0].rencanatindaklanjut }
                        if (result[0].tglkontrol != null) {
                            $scope.item.yapoli = true;
                            $scope.kontrol = true;
                            $scope.item.kontrolPoli = { namaruangan: result[0].kontrol }
                            $scope.item.tglKontrol = moment(result[0].tglkontrol).format('YYYY-MM-DD HH:mm')
                        } else {
                            $scope.item.tidakpoli = true;
                        }
                        $scope.item.darurat = result[0].keadaandarurat2
                        $scope.item.kondisiMeninggalkan = { kondisi: result[0].kondisimeninggalkan }
                        $scope.item.tglCetak = result[0].tglcetak
                        // $scope.item.kondisiMeninggalkanLain = 
                        $scope.item.ttdPasien = result[0].pasienkeluarga
                        $scope.item.dpjp = { id: result[0].pegawaifk, namalengkap: result[0].namadokter }
                        norec_emrr = result[0].emrpasienfk
                        // untuk cek obat, karena ada obat yang dihapus
                        loadDiagnosa()
                        valueOtomatis()
                    } else {
                        $scope.item.tglMasuk = $scope.cc.tglregistrasi
                        $scope.item.tglPulang = $scope.cc.tglpulang
                        // $scope.item.keadaanUmum = 'Sakit Ringan'
                        $scope.item.diet = { id: 18, diet:'-' }
                        $scope.item.keterangandiet = '-'
                        $scope.item.prognosis = { id: 2, prognosis:'Dubia Et Bonam / Cenderung Baik' }
                        $scope.item.carakeluar = { id: 1, statuspulang:'Pulang Atas Persetujuan Dokter' }
                        $scope.item.kondisiMeninggalkan = { id: 1, kondisi:'Stabil' }
                        //Pulang Atas Persetujuan Dokter
                        cekYangBisaOtomatis()
                        valueOtomatis()
                    }
                    inputOtomatisSegelaPenunjang()
                    $scope.sourceResume = new kendo.data.DataSource({
                        data: result,
                        pageSize: 20,
                    });
                }
                $scope.isRouteLoading = false;
            }, (error) => {
                $scope.isRouteLoading = false;
                throw error;
            })
			$scope.resumeOpt = {
				toolbar: [{
					name: "create", text: "Input Baru",
					template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Input Baru</button>'
				},],
				pageable: true,
				scrollable: true,
				columns: [
					{ 
                        field: "no", 
                        title: "No", 
                        width: 40 
                    },
					{ 
                        field: "tglmasuk", 
                        title: "Tanggal", 
                        width: 120 
                    },
					{ 
                        field: "namaruangan", 
                        title: "Unit/Klinik", 
                        width: 120 
                    },
					{ 
                        field: "diagnosis", 
                        title: "Diagnosis", 
                        width: 150 
                    },
					{ 
                        field: "icd", 
                        title: "ICD", 
                        width: 120 
                    },
					{ 
                        field: "jenispemeriksaan", 
                        title: "Obat-obatan/Jenis Pemeriksaan", 
                        width: 120 
                    },
					{ 
                        field: "riwayatlalu", 
                        title: "Riwayat Rawat Inap & Prosedur Bedah/Operasi yang lalu", 
                        width: 150 
                    },
					{ 
                        field: "namadokter", 
                        title: "Dokter", 
                        width: 120 
                    },
					{ command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }], title: "&nbsp;", width: 150 }
				],
			};
        }

        function valueOtomatis () {
            if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == '') {
                toastr.error("Ada kesalahan saat ambil isian Triase IGD, Mohon refresh kembali!");
            } else {
                medifirstService.get('emr/get-value-triase?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                    if (e.data.messageCode == 200) {
                        var value = e.data.data
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].emrdfk == 1901300130) {
                                $scope.item.keadaanUmum = value[i].value
                            }
                            if (value[i].emrdfk == 1901300127) {
                                $scope.item.pernapasan = value[i].value
                            }
                            if (value[i].emrdfk == 1901300125) {
                                $scope.item.suhu = value[i].value
                            }
                            if (value[i].emrdfk == 1901300122) {
                                let tekananDarah = value[i].value.split('/')
                                if (tekananDarah.length === 2) {
                                    $scope.item.systole = tekananDarah[0]
                                    $scope.item.diastole = tekananDarah[1]
                                } else {
                                    $scope.item.systole = value[i].value
                                }
                            }
                            if (value[i].emrdfk == 1901300126) {
                                $scope.item.denyutJantung = value[i].value
                            }
                            if (value[i].emrdfk == 1901300128) {
                                $scope.item.tingkatKesadaran = value[i].value.split('~')[1]
                            }
                        }
                    }
                })
                medifirstService.get('emr/get-value-pengkajian-medis-igd?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                    if (e.data.messageCode == 200) {
                        var value = e.data.data
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].emrdfk == 2408) {
                                $scope.item.keluhanUtama = value[i].value
                            }
                            if (value[i].emrdfk == 2426) {
                                $scope.item.diagnosaDokter = value[i].value
                            }
                            if ($scope.item.pemeriksaanFisik == null || $scope.item.pemeriksaanFisik == '' || $scope.item.pemeriksaanFisik == undefined) {
                                if (value[i].emrdfk == 2423) {
                                    $scope.item.pemeriksaanFisik = $scope.item.pemeriksaanFisik || ''
                                    $scope.item.pemeriksaanFisik += 'Depan : ' + value[i].value + '\n'
                                }
                                if (value[i].emrdfk == 2424) {
                                    $scope.item.pemeriksaanFisik = $scope.item.pemeriksaanFisik || ''
                                    $scope.item.pemeriksaanFisik += 'Belakang : ' + value[i].value + '\n'
                                }
                            }
                            if (value[i].emrdfk == 2638) {
                                $scope.item.pengobatan = value[i].value
                            }
                        }
                    }
                })
            }
        }

        function hapus(e) {
            // debugger
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            if (!dataItem) {
                toastr.error("Data Tidak Ditemukan");
                return
            }
            var itemDelete = {
                "norec": dataItem.norec,
                "noregistrasi": dataItem.noregistrasi
            }

            medifirstService.post('emr/post-resume-medis/delete', itemDelete).then(function (e) {
                if (e.status == 201) {
                    init()
                }
            })

        }
        function LoadCombo() {
            medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                $scope.listDiagnosaTindakan = data;
            });
            medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                $scope.listDiagnosa = data;
            });
            medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
            });
            medifirstService.get('emr/get-combo').then(function(dat) {
                $scope.listDokter = dat.data.dokter
				$scope.listRuangan = dat.data.ruanganrajal
				$scope.listJenisKelamin = dat.data.jeniskelamin
				$scope.listPenjamin = dat.data.rekanan
            })
            
            $scope.listJenisRujukan = [
                { 'id': 1, 'name': 'Faskes 1' }, 
                { 'id': 2, 'name': 'Faskes 2' }
            ]
            $scope.listPrognosis = [
                {"id": "1", "prognosis": "Baik"},
                {"id": "2", "prognosis": "Dubia Et Bonam / Cenderung Baik"},
                {"id": "3", "prognosis": "Dunia Et Malam / Cenderung Tidak Baik"},
                {"id": "4", "prognosis": "Tidak Baik"},
            ]
            $scope.listStatusPulang = [
                {"id": "1", "statuspulang": "Pulang Atas Persetujuan Dokter"},
                {"id": "2", "statuspulang": "Pulang Atas Permintaan Sendiri"},
                {"id": "3", "statuspulang": "Dirujuk"},
                {"id": "4", "statuspulang": "Rawat Inap"},
                {"id": "5", "statuspulang": "Lain - lain"},
            ]
            $scope.listTransportasi = [
                { 'id': 1, 'transportasi': 'Ambulance' }, 
                { 'id': 2, 'transportasi': 'Lain - lain' }
            ]
            $scope.listKondisi = [
                { 'id': 1, 'kondisi': 'Stabil' }, 
                { 'id': 2, 'kondisi': 'Tidak Stabil' },
                { 'id': 3, 'kondisi': 'Perbaikan' },
                { 'id': 4, 'kondisi': 'Pulang Paksa' },
                { 'id': 5, 'kondisi': 'Dirujuk' },
                { 'id': 6, 'kondisi': 'Meninggal < 48 Jam' },
                { 'id': 7, 'kondisi': 'Meninggal > 48 Jam' },
                { 'id': 8, 'kondisi': 'Lain - lain' },
            ]
            $scope.listKeadaanUmum = [
                { 'id': 1, 'keadaanumum': 'Baik' }, 
                { 'id': 2, 'keadaanumum': 'Tampak Sakit Ringan' },
                { 'id': 3, 'keadaanumum': 'Tampak Sakit Sedang' },
                { 'id': 4, 'keadaanumum': 'Tampak Sakit Berat' },
            ]
            $scope.listDiet = [
                { 'id': 18, 'diet': '-' }, 
                { 'id': 1, 'diet': 'Diet Makanan Cair' }, 
                { 'id': 2, 'diet': 'Diet Makanan Lunak' },
                { 'id': 3, 'diet': 'Diet Biasa' },
                { 'id': 4, 'diet': 'Diet Rendah Kalori' },
                { 'id': 5, 'diet': 'Diet Rendah Protein' }, 
                { 'id': 6, 'diet': 'Diet Rendah Lemak' },
                { 'id': 7, 'diet': 'Diet Rendah Garam' },
                { 'id': 8, 'diet': 'Diet Tinggi Kalori' },
                { 'id': 9, 'diet': 'Diet Tinggi Protein' }, 
                { 'id': 10, 'diet': 'Diet DM' },
                { 'id': 11, 'diet': 'Diet Jantung' },
                { 'id': 12, 'diet': 'Diet Luka Bakar' },
                { 'id': 13, 'diet': 'Diet Makanan Saring' }, 
                { 'id': 14, 'diet': 'Diet Tlepar' },
                { 'id': 15, 'diet': 'Diet Rendah Karbohidrat' },
                { 'id': 16, 'diet': 'Diet Hipertensi' },
                { 'id': 17, 'diet': 'Diet Palatoplasty' },
                { 'id': 18, 'diet': 'Lain - Lain' },
            ]
        }
        function cekYangBisaOtomatis() {
            medifirstService.get('emr/get-otomatis?noregistrasi=' + $scope.cc.noregistrasi + "&namaRuangan=" + $scope.cc.namaruangan).then(function(dat) {
                if(dat.data.data[0].objectstatuspulangfk == 13) {
                    $scope.item.sembuh = true
                } else if (dat.data.data[0].objectstatuspulangfk == 15) {
                    $scope.item.dirawat = true
                } else if (dat.data.data[0].objectstatuspulangfk == 16) {
                    $scope.item.dirujuk = true
                }
                if (dat.data.data[0].id != null) {
                    $scope.item.namadokter = { id: dat.data.data[0].id, namalengkap: dat.data.data[0].namalengkap }
                }
                $scope.item.tglMasuk = new Date(dat.data.data[0].tglregistrasi)
                $scope.item.tglPulang = new Date(dat.data.data[0].tglpulang)
                // $scope.item.keluhanUtama = dat.data.cppt[0].subjective
            })
            medifirstService.get('emr/get-pengkajian-awal-medis?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                // debugger
                let pemeriksaanfisik = ''
                let data = dat.data
                if (data.length > 0) {
                    data.sort(function(a, b) {
                        if (a.nourut < b.nourut) { return -1; }
                        if (a.nourut > b.nourut) { return 1; }
                        return 0;
                    })
                    for(let i = 0; i < data.length; i++) {
                        if (data[i].emrdfk == 2405) {
                            $scope.item.alergi = data[i].value
                        }
                        // if (data[i].emrdfk == 2408) {
                        //     $scope.item.keluhanUtama = data[i].value
                        // }
                        // if (data[i].emrdfk == 2409) {
                        //     var str = data[i].value
                        //     var res = str.split("/");
                        //     $scope.item.systole = res[0]
                        //     $scope.item.diastole = res[1]
                        // }
                        // if (data[i].emrdfk == 2410) {
                        //     $scope.item.pernapasan = data[i].value
                        // }
                        // if (data[i].emrdfk == 2411) {
                        //     $scope.item.suhu = data[i].value
                        // }
                        // if (data[i].emrdfk == 2412) {
                        //     $scope.item.denyutJantung = data[i].value
                        // }
                        // if (data[i].emrdfk == 2414) {
                        //     $scope.item.tingkatKesadaran = data[i].value
                        // }
                        // if (data[i].emrdfk == 2415) {
                        //     $scope.item.keadaanUmum = { id: data[i].value, keadaanumum: data[i].value }
                        // } 
                        // if (data[i].emrdfk == 2618) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2619) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Kepala : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2620) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2621) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2622) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Leher : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2623) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2624) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2625) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Thorax : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2626) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2627) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2628) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Abdomen : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2629) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2630) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2631) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Extremitas : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2632) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2633) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2634) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Genitalia : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2635) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2676) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2677) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Anus : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2678) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2679) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 2680) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Pemeriksaan Neurologis : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 2681) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 3615) {
                        //     if (data[i].value == "1") {

                        //     }
                        // } else if (data[i].emrdfk == 3616) {
                        //     if (data[i].value == "1") {
                        //         pemeriksaanfisik = pemeriksaanfisik + " Kulit : " + "Ada Kelainan "
                        //         for (let j = 0; j < data.length; j++) {
                        //             if (data[j].emrdfk == 3617) {
                        //                 pemeriksaanfisik = pemeriksaanfisik + data[j].value + "\n"
                        //             }
                        //         }
                        //     }
                        // } else if (data[i].emrdfk == 2423) {
                        //     pemeriksaanfisik = pemeriksaanfisik + data[i].value + " \n"
                        // } else if (data[i].emrdfk == 2424) {
                        //     pemeriksaanfisik = pemeriksaanfisik + data[i].value + " \n"
                        // }
                    }
                    // if (pemeriksaanfisik == '') {
                    //     $scope.item.pemeriksaanFisik = 'Tidak Ada Kelainan'
                    // } else {
                    //     $scope.item.pemeriksaanFisik = pemeriksaanfisik
                    // }
                }
            })
            medifirstService.get("emr/get-edukasi-pasien?norec=" + $scope.cc.norec_pd).then(function(dat) {
                let no = 0;
                $scope.item.edukasi = '';
                for (let i = 0; i < dat.data.length; i++) {
                    no = no + 1;
                    $scope.item.edukasi = $scope.item.edukasi + no + ". " + dat.data[i].materiedukasi + "\n"; 
                }
            })
            medifirstService.get("emr/get-order-konsul?noregistrasi=" + $scope.cc.noregistrasi).then(function (res) {
                $scope.isRouteLoading = false;
                let konsultasi = res.data.data;
                let hasilKonsultasi = '';
                let datakonsultasi = '';
                for (let i = 0; i < konsultasi.length; i++) {
                    if(konsultasi[i].keteranganlainnya != null) {
                        datakonsultasi = konsultasi[i].keteranganlainnya
                        if(konsultasi[i].saran != null) {
                            datakonsultasi = datakonsultasi + ' ,Saran : ' + konsultasi[i].saran
                        }
                        hasilKonsultasi += konsultasi[i].namalengkap + " " + ':' + " " + datakonsultasi + '\n';
                    }
                }
                // $scope.item.hasilKonsul = hasilKonsultasi;
            });
            // medifirstService.get('emr/get-value-from-ass-igd?noRegistrasi=' + $scope.cc.noregistrasi)
            // .then(function(dat) {
            //     if (dat.data.data.length > 0) {
            //         for(let i = 0; i < dat.data.data.length; i++) {
            //             if (dat.data.data[i].emrdfk == 2426) {
            //                 $scope.item.diagnosaDokter = dat.data.data[i].value
            //             }
            //         }
            //     }
            // })
            $scope.item.darurat ="IGD RS Bhayangkara TK. IV Cianjur Telp. (0263) 285299";
            loadDiagnosa()
        }
        function loadDiagnosa() {
            $scope.isRouteLoading = true;
            var param =""
               param = "noReg=" + $scope.cc.noregistrasi;
          
            medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                + param
            ).then(function (data) {
                tampungdiagnosa9 = data.data.datas
                $scope.isRouteLoading = false;
                var dataICD9 = data.data.datas;
                $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                    data: dataICD9,
                    pageSize: 10
                });
                $scope.columnDiagnosaIcd9 = [{
                    "title": "No",
                    "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                    "width": "30px"
                }, 
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px"
                }, {
                    "field": "kddiagnosatindakan",
                    "title": "Kode ICD 9",
                    "width": "100px"
                }, {
                    "field": "namadiagnosatindakan",
                    "title": "Nama ICD 9",
                    "width": "300px"
                }, {
                    "field": "keterangantindakan",
                    "title": "Keterangan",
                    "width": "200px"
                }, {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "200px"
                },
                {
                    "field": "namalengkap",
                    "title": "Penginput",
                    "width": "200px"
                },
                {
                    "field": "tglinputdiagnosa",
                    "title": "Tgl Input",
                    "width": "200px"
                }];
            });

            medifirstService.get("emr/get-diagnosapasienbynoreg?"
                + param
            ).then(function (data) {
                tampungdiagnosa = data.data.datas;
                var dataICD10 = data.data.datas;
                $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                    data: dataICD10,
                    pageSize: 10
                });
                $scope.columnDiagnosaIcd10 = [{
                    "title": "No",
                    "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                    "width": "30px"
                }, 
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px"
                },{
                    "field": "jenisdiagnosa",
                    "title": "Jenis Diagnosis",
                    "width": "150px"
                }, {
                    "field": "kddiagnosa",
                    "title": "Kode ICD 10",
                    "width": "100px"
                }, {
                    "field": "namadiagnosa",
                    "title": "Nama ICD 10",
                    "width": "300px"
                }, {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "200px"
                }, {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "150px"
                },
                {
                    "field": "namalengkap",
                    "title": "Penginput",
                    "width": "200px"
                },
                {
                    "field": "tglinputdiagnosa",
                    "title": "Tgl Input",
                    "width": "200px"
                }];
            });
            loadLab()
        }
        function loadLab() {
            medifirstService.get('emr/get-lab-resume-rj?noregistrasi=' + $scope.cc.noregistrasi, true).then(function(dat) {
                $scope.isRouteLoading = false;
                lab = dat.data.data
                for (var i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1
                    dat.data.data[i].statCheckbox = false;
                    if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                        dat.data.data[i].statusbridging = "✔";
                        // ✅
                        // ✔
                    } else {
                        dat.data.data[i].statusbridging = "✘";
                        // ✘
                        // ❎
                    }
                    if (dat.data.data[i].iscito == "1") {
                        dat.data.data[i].statuscito = "✔";
                        // ✅
                        // ✔
                    } else {
                        dat.data.data[i].statuscito = "✘";
                        // ✘
                        // ❎
                    }
                    if (dat.data.data[i].statusperiksa == 1) {
                        dat.data.data[i].statusperiksa = "✔";
                    } else {
                        dat.data.data[i].statusperiksa = "✘";
                    }

                }
                if (dat.data.data.length > 0) {
                    if (dat.data.data[0].objectdepartemenfk == 3)
                        $scope.disableRad = true
                    if (dat.data.data[0].objectdepartemenfk == 27)
                        $scope.disableLab = true
                }
                $scope.isLoading = false;

                $scope.dataGrid = {
                    data: dat.data.data,
                    _data: dat.data.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            },
            function(error) {
                $scope.isLoading = false;
            });
			$scope.columnGrid = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                                // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab == 'N' ? 'red' : #=flaglab == 'Belum Input Lab' ? 'blue' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "command": [
                            // { text: "Hapus", click: hapusLab, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            loadRad()
        }
        function loadRad() {
            medifirstService.get('emr/get-rad-resume-rj?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.cc.objectruanganfk, true).then(function(dat) {
                $scope.isRouteLoading = false;
                rad = dat.data.data
                for (var i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1
                    dat.data.data[i].statCheckbox = false;
                    if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                        dat.data.data[i].statusbridging = "✔";
                        // ✅
                        // ✔
                    } else {
                        dat.data.data[i].statusbridging = "✘";
                        // ✘
                        // ❎
                    }
                    if (dat.data.data[i].iscito == "1") {
                        dat.data.data[i].statuscito = "✔";
                        // ✅
                        // ✔
                    } else {
                        dat.data.data[i].statuscito = "✘";
                        // ✘
                        // ❎
                    }
                    if (dat.data.data[i].statusperiksa == 1) {
                        dat.data.data[i].statusperiksa = "✔";
                    } else {
                        dat.data.data[i].statusperiksa = "✘";
                    }
                    if (dat.data.data[i].hr_norec != null) {
                        dat.data.data[i].flagrad = 'Ada';
                    } else {
                        dat.data.data[i].flagrad = 'Tidak Ada';
                    }

                }
                if (dat.data.data.length > 0) {
                    if (dat.data.data[0].objectdepartemenfk == 3)
                        $scope.disableRad = true
                    if (dat.data.data[0].objectdepartemenfk == 27)
                        $scope.disableLab = true
                }
                $scope.isLoading = false;
                $scope.dataGridRadiologi = {
                    data: dat.data.data,
                    _data: dat.data.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            },
            function(error) {
                $scope.isLoading = false;
            });
			$scope.columnGridRadiologi = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"cetakEkspertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "command": [
                            // { text: "Hapus", click: hapusRad, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
							class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            if (norecresume == "-") {
                loadObat()
            } else {
                loadObatResume()
            }
        }
        function loadObat() {
            medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&isresume=" + "true").then(function(dat) {
                let tampungloadobat = [];
                for (let i = 0; i < dat.data.length; i++) {
                    if (dat.data[i].kelompokprodukbpjs == 'Obat' || dat.data[i].kelompokprodukbpjs == 'Obat Kronis') {
                        tampungloadobat.push(dat.data[i])
                    }
                }
                dat.data = tampungloadobat
                obat = dat.data
                for (let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1;
                }
                $scope.dataGridObat = {
                    data: dat.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            })
			$scope.columnGridObat = {toolbar: [{
				name: "create", text: "Input Baru",
				template: '<button ng-click="tambahDataObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
					},],
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "namaruangandepo",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            if (norecresume == "-") {
                loadObatPulang()
            } else {
                loadObatResume()
            }
        }
        function loadObatPulang() {
            medifirstService.get('emr/get-obat-pulang?noregistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                let tampungloadobat = [];
                for (let i = 0; i < dat.data.data.length; i++) {
                    if (dat.data.data[i].kelompokprodukbpjs == 'Obat' || dat.data.data[i].kelompokprodukbpjs == 'Obat Kronis') {
                        dat.data.data[i].jumlah = parseInt(dat.data.data[i].jumlah)
                        tampungloadobat.push(dat.data.data[i])
                    }
                }
                debugger
                dat.data.data = tampungloadobat
                obatpulang = dat.data.data
                for (let i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1;
                }
                $scope.dataGridObatPulang = {
                    data: dat.data.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            })
            $scope.columnGridObatPulang = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="tambahDataObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
                },],
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "15px"
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Pelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "180px"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah Obat",
                        "width": "50px",
                        template: "<span class='style-center'>{{formatDecimal('#: jumlah #', '')}}</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Depo",
                        "width": "80px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pemberi Resep",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusObatPulang, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "50px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
        }
        function hapusObatPulang(e) {
            // debugger
            let obatpulangfix = [];
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            if (dataItem == undefined) {
                alert("Data Belum Dipilih!")
                return;
            };
            var grid = this;
            var row = $(e.currentTarget).closest("tr");
            var tr = $(e.target).closest("tr");
            for (let i = 0; i < obatpulang.length; i++) {
                if (obatpulang[i].norecpp == dataItem.norecpp) {
                    delete obatpulang[i];
                    grid.removeRow(row);
                } else {
                    obatpulangfix.push(obatpulang[i])
                }
            }
            obatpulang = obatpulangfix
        }
        $scope.tambahDataObatPulang = function() {
            $scope.isRouteLoading = true;
            tampungNorecObatPulang = '';
            let a = ""
            let b = ""
            for(let i = 0; i < obatpulang.length; i++) {
                let c = obatpulang[i].norecpp
                b = "," + c
                a = a + b
            }
            tampungNorecObatPulang = a.slice(1, a.length);
            // debugger
            // medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec).then(function(dat) {
                medifirstService.get("emr/get-obat-pulang?noregistrasi=" + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorecObatPulang).then(function (dat) {
                    // debugger
                 
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1;
                }
                $scope.dataGridObatPulangDelete = {
                    data: dat.data.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            })
            $scope.columnGridObatPulangDelete = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Resep",
                        "width": "90px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "160px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "30px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Tambah", click: tambahObatPulang, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.popUpObatPulangDelete.center().open()
        }
        function hapusObat(e) {
            let obatfix = [];
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            if (dataItem == undefined) {
                alert("Data Belum Dipilih!")
                return;
            };
            var grid = this;
            var row = $(e.currentTarget).closest("tr");
            var tr = $(e.target).closest("tr");
            for (let i = 0; i < obat.length; i++) {
                if (obat[i].norecpp == dataItem.norecpp) {
                    delete obat[i];
                    grid.removeRow(row);
                } else {
                    obatfix.push(obat[i])
                }
            }
            obat = obatfix
        }
        function tambahObatPulang(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
             
            if (dataItem == undefined) {
                alert("Data Belum Dipilih!")
                return;
            };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");

                obatpulang.push(dataItem)
                obatpulang.sort()
                for (let i = 0; i < obatpulang.length; i++) {
                    obatpulang[i].no = i + 1
                }
                $scope.dataGridObatPulang = {
                    data: obatpulang,
                    _data: obatpulang,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: obat.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
                $scope.columnGridObatPulang = {toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="tambahDataObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
                        },],
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "30px"
                        },
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "90px"
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "120px"
                        },
                        {
                            "field": "noresep",
                            "title": "No Resep",
                            "width": "120px"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "160px",
                        },
                        {
                            "field": "namaruangandepo",
                            "title": "Depo",
                            "width": "140px"
                        },
                        {
                            "field": "dokter",
                            "title": "Dokter",
                            "width": "140px"
                        },
                        {
                            "command": [
                                { text: "Hapus", click: hapusObatPulang, imageClass: "k-icon k-i-read" }
                            ],
                            title: "Action",
                            width: "100px"
                        }
    
                    ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                }
                grid.removeRow(row);
        }
        $scope.tambahDataObat = function () {
            $scope.isRouteLoading = true;
            let tampungNorec = '';
            let a = ""
            let b = ""
            for (let i = 0; i < obat.length; i++) {
                let c = obat[i].norecpp
                b = "," + c
                a = a + b
            }
            tampungNorec = a.slice(1, a.length);
            medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec).then(function (dat) {

                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1;
                }
                $scope.dataGridObatDelete = {
                    data: dat.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            })
            $scope.columnGridObatDelete = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "namaruangandepo",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Tambah", click: tambahObat, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.popUpObatDelete.center().open()
        }
        function tambahObat(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            if (dataItem == undefined) {
                alert("Data Belum Dipilih!")
                return;
            };
            var grid = this;
            var row = $(e.currentTarget).closest("tr");
            var tr = $(e.target).closest("tr");

            obat.push(dataItem)
            obat.sort()
            for (let i = 0; i < obat.length; i++) {
                obat[i].no = i + 1
            }
            $scope.dataGridObat = {
                data: obat,
                _data: obat,
                // pageSize: 10,
                selectable: true,
                refresh: true,
                total: obat.length,
                serverPaging: false,
                aggregate: [
                    { field: 'total', aggregate: 'sum' },
                ]
            };
            $scope.columnGridObat = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="tambahDataObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Obat</button>'
                },],
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "namaruangandepo",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            grid.removeRow(row);
        }
        $scope.tambahDataObatPulang = function() {
            $scope.isRouteLoading = true;
            tampungNorecObatPulang = '';
            let a = ""
            let b = ""
            for(let i = 0; i < obatpulang.length; i++) {
                let c = obatpulang[i].norecpp
                b = "," + c
                a = a + b
            }
            tampungNorecObatPulang = a.slice(1, a.length);
            // debugger
            // medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec).then(function(dat) {
                medifirstService.get("emr/get-obat-pulang?noregistrasi=" + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorecObatPulang).then(function (dat) {
                    // debugger
                 
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1;
                }
                $scope.dataGridObatPulangDelete = {
                    data: dat.data.data,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            })
            $scope.columnGridObatPulangDelete = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Resep",
                        "width": "90px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "160px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "30px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Tambah", click: tambahObatPulang, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.popUpObatPulangDelete.center().open()
        }
        function validasi() {
            var listRawRequired = [
                "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
            ]
            var isValid = ModelItem.setValidation($scope, listRawRequired);
            if (isValid.status) {
                var norec_diagnosapasien = "";
                if ($scope.dataIcd9Selected != undefined) {
                    norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var ketTindakans = "";
                if ($scope.item.ketTindakan != undefined) {
                    ketTindakans = $scope.item.ketTindakan
                }
                var data = {
                    norec_dp: norec_diagnosapasien,
                    objectpasienfk: $scope.cc.norec,
                    tglpendaftaran: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                    keterangantindakan: ketTindakans
                }

                $scope.objSave =
                    {
                        detaildiagnosatindakanpasien: data,
                    }
            } else {
                ModelItem.showMessages(isValid.messages)
            }
        }
        function validasiIcd10() {
            var listRawRequired = [
                "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
            ]
            var isValid = ModelItem.setValidation($scope, listRawRequired);
            if (isValid.status) {
                var norec_diagnosapasien = "";
                var tglinput = "";
                if ($scope.dataIcd10Selected != undefined) {
                    norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                    tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                } else {
                    tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                }
                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = "-"
                }
                else {
                    keterangan = $scope.item.keterangan
                }

                $scope.now = new Date();
                var data = {
                    norec_dp: norec_diagnosapasien,
                    noregistrasifk: $scope.cc.norec,
                    tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    objectdiagnosafk: $scope.item.diagnosa.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglinputdiagnosa: tglinput,
                    keterangan: keterangan,
                    kasusbaru: $scope.item.kasusbaru,
                    kasuslama: $scope.item.kasuslama
                }

                $scope.objSave =
                    {
                        detaildiagnosapasien: data,
                    }
            } else {
                ModelItem.showMessages(isValid.messages)
            }
        }
        function loadKonsul() {
            medifirstService.get('emr/get-order-konsul?noregistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                if (dat.data.data.length > 0) {
                    hasilKonsultasi = dat.data.data[0].keteranganlainnya
                }
            })
        }
        $scope.$watch('item.diet', function (e) {
            if (e.diet != undefined) {
                $scope.ketdiet = true
            } else {
                $scope.ketdiet = false
            }
        })
        $scope.$watch('item.yapoli', function(e) {
            if (e == true) {
                $scope.kontrol = true;
                $scope.item.tidakpoli = false
            } else {
                $scope.kontrol = false;
            }
        })
        $scope.$watch('item.tidakpoli', function(e) {
            if (e == true) {
                $scope.kontrol = false;
                $scope.item.yapoli = false;
                delete $scope.item.kontrolPoli
                delete $scope.item.tglKontrol
            }
        })
        $scope.$watch('item.carakeluar', function (e) {
            if (e.statuspulang == "Dirujuk") {
                $scope.carakeluarlain = true;
                $scope.dirujuk = true;
            } else if (e.kondisi == "Lain - lain") {
                $scope.kondisiMeninggalkanLain = true;
                $scope.dirujuk = false;
            } else {
                $scope.kondisiMeninggalkanLain = false;
                $scope.dirujuk = false;
            }
        })
        $scope.inputBaru = function () {
            $scope.depan = false;
            $scope.belakang = true;
            cekYangBisaOtomatis()
            valueOtomatis()
            let pegawai = JSON.parse(localStorage.getItem('pegawai'));
            $scope.item.tglMasuk = $scope.cc.tglregistrasi
            $scope.item.poliklinik = {id:$scope.cc.objectruanganfk, namaruangan: $scope.cc.namaruangan}
            $scope.item.jenisKelamin = {id:$scope.cc.objectjeniskelaminfk, jeniskelamin: $scope.cc.jeniskelamin}
            $scope.item.noRm = $scope.cc.nocm
            $scope.item.namaPasien = $scope.cc.namapasien
            $scope.item.ttdPasien = $scope.cc.namapasien
            $scope.item.nik = $scope.cc.noidentitas
            $scope.item.tglLahir = $scope.cc.tgllahir
            $scope.item.tempatLahir = $scope.cc.tempatlahir
            $scope.item.penjamin = {id:$scope.cc.objectrekananfk, namarekanan: $scope.cc.namarekanan}
            $scope.item.noTelpPenjamin = $scope.cc.notelepon
            $scope.item.dpjp = { id: $scope.cc.iddpjp, namalengkap: $scope.cc.dpjp }
        }
        $scope.cetakEkspertise = function(dataItem) {
            if (dataItem.hr_norec == null) {
                alert('Hasil Tidak Ada !')
                return
            } else {
                var local = JSON.parse(localStorage.getItem('profile'))
                var profile = local.id;
                window.open(config.baseApiBackend + "report/cetak-ekspertise-from-resume?norec=" + dataItem.hr_norec + "&kdprofile=" +  profile, '_blank');
            }
        }
        $scope.saveIcd10 = function () {
            if (tampungdiagnosa.length > 0) {
                for (let i = 0; i < tampungdiagnosa.length; i++) {
                    if (tampungdiagnosa[i].objectjenisdiagnosafk == "1") {
                        if ($scope.item.jenisDiagnosis.id == "1") {
                        toastr.error('Diagnosa Primary / Utama Hanya Boleh Diinput 1 Kali !')
                        return
                        }
                    }
                }
            }
            validasiIcd10();
            console.log(JSON.stringify($scope.objSave));
            medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {

                $scope.savePeriksaDokter()
                medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                    'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    + '/ ' + $scope.item.noMr
                ).then(function (res) {
                })
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosa;
                delete $scope.item.keterangan;
                delete $scope.dataIcd10Selected;
                loadDiagnosa()
            })
        }
        $scope.saveIcd9 = function () {
            validasi();
            console.log(JSON.stringify($scope.objSave));
            medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

                medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                    'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    + '/ ' + $scope.item.noMr

                ).then(function (res) {
                })
                delete $scope.item.diagnosaTindakan;
                delete $scope.item.ketTindakan;
                delete $scope.dataIcd9Selected;
                loadDiagnosa()
            })
        }
        $scope.deleteIcd9 = function () {
            if ($scope.item.diagnosaTindakan == undefined) {
                alert("Pilih data yang mau di hapus!!")
                return
            }
            var diagnosa = {
                norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
            }
            var objDelete =
            {
                diagnosa: diagnosa,
            }
            medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                    'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    + '/ ' + $scope.item.noMr

                ).then(function (res) {
                })
                delete $scope.item.diagnosaTindakan;
                delete $scope.item.ketTindakan;
                delete $scope.dataIcd9Selected
                loadDiagnosa()

            })
        }
        $scope.klikIcd10 = function (dataIcd10Selected) {
            $scope.item.jenisDiagnosis = {
                id: dataIcd10Selected.objectjenisdiagnosafk,
                jenisdiagnosa: dataIcd10Selected.jenisdiagnosa
            }

            $scope.item.diagnosa = {
                id: dataIcd10Selected.id,
                namaDiagnosa: dataIcd10Selected.namadiagnosa,
                kdDiagnosa: dataIcd10Selected.kddiagnosa,
                kodeNama: dataIcd10Selected.kddiagnosa + ' - ' +dataIcd10Selected.namadiagnosa    
            }
            $scope.item.keterangan = dataIcd10Selected.keterangan
            if (dataIcd10Selected.iskasusbaru == '1') {
                $scope.item.kasusbaru = true
                $scope.item.kasuslama = false
            } else {
                $scope.item.kasusbaru = false
                $scope.item.kasuslama = true
            }
            $scope.findBy = "1";
        }
        $scope.deleteIcd10 = function () {
            if ($scope.item.diagnosa == undefined) {
                alert("Pilih data yang mau di hapus!!")
                return
            }
            var diagnosa = {
                norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
            }
            var objDelete =
            {
                diagnosa: diagnosa,
            }
            medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                    'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.cc.noregistrasi
                    + '/ ' + $scope.cc.nocm

                ).then(function (res) {
                })
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosa;
                delete $scope.item.keterangan;
                delete $scope.dataIcd10Selected;
                delete $scope.poneks.penyakitponekigd;
                loadDiagnosa()
            })
            loadDiagnosa()
        }
        $scope.klikIcd9 = function (dataIcd9Selected) {
            $scope.item.diagnosaTindakan = {
                id: dataIcd9Selected.id,
                namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' +  dataIcd9Selected.namadiagnosatindakan,
                kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
            }
            $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
            $scope.findBy = "1";
        }
        $scope.savePeriksaDokter=  function(){
            var kelompokUser = medifirstService.getKelompokUser()
            if(kelompokUser== 'dokter' ){
                var data ={
                "norec_apd" :norec_apd,
                "kelompokUser" : kelompokUser
            }
            medifirstService.postNonMessage('rawatjalan/save-periksa',data)
            .then(function (res) {

            })
            }
        }
        $scope.save = function() {
            // debugger
            if ($scope.item.keadaanUmum == '') {
                toastr.error('Keadaan Umum belum diisi');
                return
            }
            let keadaanUmum  = ''
            if ($scope.item.keadaanUmum != '') {
                keadaanUmum = $scope.item.keadaanUmum
            }
            let diet = ''
            if ($scope.item.diet != undefined) {
                diet = $scope.item.diet.diet
            }
            let prognosis = ''
            if ($scope.item.prognosis != undefined) {
                prognosis = $scope.item.prognosis.prognosis
            }
            let carakeluar = ''
            if ($scope.item.carakeluar != undefined) {
                carakeluar = $scope.item.carakeluar.statuspulang
            }
            let diagnosaDokter = ""
				if ($scope.item.diagnosaDokter != undefined) {
					diagnosaDokter = $scope.item.diagnosaDokter
				} else {
					diagnosaDokter = '-'
				}
            let sarana = ''
            if ($scope.item.transportasi != undefined) {
                sarana = $scope.item.transportasi.transportasi
            }
            let kontrol = ''
            let tglkontrol = 'NULL'
            if ($scope.item.kontrolPoli != undefined) {
                kontrol = $scope.item.kontrolPoli.namaruangan
                tglkontrol = moment($scope.item.tglKontrol).format('YYYY-MM-DD HH:mm')
            }
            let meninggalkanrs = ''
            if ($scope.item.kondisiMeninggalkan != undefined) {
                meninggalkanrs = $scope.item.kondisiMeninggalkan.kondisi
            }
            tampungNorecObatPulang = '';
            let a = ""
            let b = ""
            for(let i = 0; i < obatpulang.length; i++) {
                let c = obatpulang[i].norecpp
                b = "," + c
                a = a + b
            }
            tampungNorecObatPulang = a.slice(1, a.length);
            let keluhanutama = ''
            if ($scope.item.keluhanUtama != undefined) {
                keluhanutama = $scope.item.keluhanUtama
            }
            let alergi = ''
            if ($scope.item.alergi != undefined) {
                alergi = $scope.item.alergi
            }
            let kesadaran = ''
            if ($scope.item.tingkatKesadaran != undefined) {
                kesadaran = $scope.item.tingkatKesadaran
            }
            let jantung = ''
            if ($scope.item.denyutJantung != undefined) {
                jantung = $scope.item.denyutJantung
            }
            let pernapasan = ''
            if ($scope.item.pernapasan != undefined) {
                pernapasan = $scope.item.pernapasan
            }
            let systole = ''
            if ($scope.item.systole != undefined) {
                systole = $scope.item.systole
            }
            let diastole = ''
            if ($scope.item.diastole != undefined) {
                diastole = $scope.item.diastole
            }
            let suhu = ''
            if ($scope.item.suhu != undefined) {
                suhu = $scope.item.suhu
            }
            let pemeriksaanfisik = ''
            if ($scope.item.pemeriksaanFisik != undefined) {
                pemeriksaanfisik = $scope.item.pemeriksaanFisik
            }
            debugger
            let objSave = {
                norecresumeigd: norecresume,
                satusehat: $scope.item.noSatuSehat,
                passpor: $scope.item.passpor,
                telppenjamin: $scope.item.noTelpPenjamin,
                tglmasuk: moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm'),
                tglresume: moment($scope.now).format('YYYY-MM-DD HH:mm'),
                tglkeluar: moment($scope.item.tglPulang).format('YYYY-MM-DD HH:mm'),
                keluhanutama: keluhanutama,
                alergi: alergi,
                kesadaran: kesadaran,
                keadaanumum: keadaanUmum,
                jantung: jantung,
                pernapasan: pernapasan,
                systole: systole,
                diastole: diastole,
                suhu: suhu,
                diet: diet,
                diagdok: diagnosaDokter,
                pengobatan: $scope.item.pengobatan,
                edukasi: $scope.item.edukasi,
                prognosis: prognosis,
                carakeluar: carakeluar,
                kontrol: kontrol,
                tglKontrol: tglkontrol,
                keadaandarurat: $scope.item.darurat,
                transportasi: sarana,
                meninggalkanrs: meninggalkanrs,
                ttdpasien: $scope.item.ttdPasien,
                dpjp: $scope.item.dpjp.namalengkap,
                pegawaifk: $scope.item.dpjp.id,
                ketdiet: $scope.item.keterangandiet,
                pemeriksaanfisik: pemeriksaanfisik,
                keteranganlainnya: 'IGD',
                lab: lab,
                rad: rad,
                obat: obat,
                obatpulang: obatpulang,
                head: $scope.cc,
                hasilKonsul: $scope.item.hasilKonsul
            }
            medifirstService.post('emr/save-resume-medis-igd', objSave).then(function(e) {
                init()
            })
        }
        $scope.kembali = function () {
            $scope.depan = true;
            $scope.belakang = false;
        }
        $scope.cetak = function () {
            // Penjagaan Limit Akses cetak hanya 3 user dibawah ini aja
            // 25388(Rosita), 26920(wiwit), 26687(teguh), 320263(admin)
            /*namalengkap = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };                
            if(namalengkap.id != 25388 && namalengkap.id != 26920 && namalengkap.id != 26687 && namalengkap.id != 320263 && namalengkap.id != 27382 && namalengkap.id != 27233
                && namalengkap.id != 27334 && namalengkap.id != 27387  && namalengkap.id != 320261201) {
                toastr.error('Akses Dikunci, Silahkan Konfirmasi ke bagian Rekam Medis apabila mau Cetak Resume Medis pasien ini !!')
                return
            }*/

            loadDiagnosa()
            loadKonsul()
            init()
            // loadCpptO()
        // 	if (confirm('View Resume? ')) {
        // 		var stt = 'true';
        // 	} else {
        // 		var stt = 'false'
        // 	}
        // 	// Do nothing!
        // 	var client = new HttpClient();
        // 	client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-resume-rj=' + $scope.nocm
        // 		+ '&view=' + stt
        // 		, function (response) {
        // 		});
        // }
        // var HttpClient = function () {
        // 	this.get = function (aUrl, aCallback) {
        // 		var anHttpRequest = new XMLHttpRequest();
        // 		anHttpRequest.onreadystatechange = function () {
        // 			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        // 				aCallback(anHttpRequest.responseText);
        // 		}

        // 		anHttpRequest.open("GET", aUrl, true);
        // 		anHttpRequest.send(null);
        // 	}
        medifirstService.get('emr/get-kepentingan-resume-rj?norec=' + norecresume).then(function(dat) {
            //  debugger
            
             let tampung = '';
             let tampung2 = '';
             let tampung3 = '';
             let tampung4 = '';
             let diagnosautama = 'Diagnosis Primer / Utama : ';
             let kddiagnosautama = '';
             let diagnosasekunder = 'Diagnosis Sekunder : ';
             let kddiagnosasekunder = '';
             let diagnosaawal = 'Diagnosis Awal : ';
             let kddiagnosaawal = '';
             let diagnosatindakan = '';
             let kddiagnosatindakan = ''
             let nouruttindakan = 1;
             let nourutsekunder = 1;
             let emr = dat.data
             let nourut = 1;
             let penunjang = '';
             let obat = ''
             let tampungObat = ''
             let noUrutObat = 1;
             let obatpulang = ''
             let tampungObatpulang = ''
             let noUrutObatpulang = 1;
             let tindakan = ''
             let tampungTindakan = '';
             let noUrutTindakan = 1;
             let tampungGaNormal = '';
             let penunjanglab = 'Laboratorium Patologi Klinik : '
             let tindakanlab = 'Laboratorium Patologi Klinik : '
             let penunjangrad = 'Radiologi : '
             let tindakanrad = 'Radiologi : '
             let penunjangpa = 'Laboratorium Patologi Anatomik : '
             let tindakanpa = 'Laboratorium Patologi Anatomik : '
             let alldiagnosa = '';
            for(let i = 0; i < emr.length; i++) {
                if (emr[i].jenispenunjang == 'LAB') {
                    // debugger
                    tampung = tampung + nourut + ". " + emr[i].namaproduk + " = " + "\n"
                    tindakanlab = tindakanlab + "- " + emr[i].namaproduk + "\n"
                    for (let j = 0; j < emr[i].detail.length; j++) {
                        if (emr[i].detail[j].hasilpenunjang != null) {
                            if(emr[i].detail[j].flaglab == 'Y') {
                                tampung4 = emr[i].detail[j].hasilpenunjang
                                tampung2 = tampung2 + emr[i].detail[j].detailpemeriksaan + ":" + emr[i].detail[j].hasilpenunjang + " / "
                            }
                        } else {
                            // tampung = ''
                        }
                    }
                    penunjanglab = penunjanglab + tampung2
                } else if (emr[i].jenispenunjang == 'RAD') {
                    tampung = tampung + nourut + ". " + emr[i].namaproduk + " = "
                    tindakanrad = tindakanrad  + "- " + emr[i].namaproduk
                    for (let j = 0; j < emr[i].detail.length; j++) {
                        if (emr[i].detail[j].hasilpenunjang != null) {
                            tampung4 = emr[i].detail[j].hasilpenunjang
                            let kalimat = emr[i].detail[j].hasilpenunjang;
                            let panjang = kalimat.length;
                            let temukan = kalimat.indexOf("kesan");
                            if (temukan < 0) {
                                temukan = kalimat.indexOf("Kesan");
                            }
                            if (temukan < 0) {
                                temukan = kalimat.indexOf("KESAN");
                            }
                            let filter = kalimat.slice(temukan, panjang)
                            filter = filter.replace(/(<([^>]+)>)/gi, " ");
                            tampung2 = filter
                            penunjangrad = penunjangrad + emr[i].namaproduk + " " + tampung2 + " \n"
                            // debugger
                        }
                    }
                } else if (emr[i].jenispenunjang == 'LABORATORIUM PATALOGI ANATOMI') {
                    tampung = tampung + nourut + ". " + emr[i].namaproduk + " = "
                    tindakanpa = tindakanpa + "- " + emr[i].namaproduk
                    for (let j = 0; j < emr[i].detail.length; j++) {
                        if (emr[i].detail[j].hasilpenunjang != null) {
                            tampung4 = emr[i].detail[j].hasilpenunjang
                            let kalimat = emr[i].detail[j].hasilpenunjang;
                            let panjang = kalimat.length;
                            let temukan = kalimat.indexOf("KESIMPULAN");
                            if (temukan < 0) {
                                temukan = kalimat.indexOf("KESIMPULAN");
                            }
                            let filter = kalimat.slice(temukan, panjang)
                            filter = filter.replace(/(<([^>]+)>)/gi, " ");
                            tampung2 = filter
                            penunjangpa = penunjangpa + tampung2
                            // debugger
                        }
                    }
                } else if (emr[i].jenispenunjang == 'OBAT') {
                    if (emr[i].objectkelompokprodukbpjsfk == 13 || emr[i].objectkelompokprodukbpjsfk == 14) {
                        tampungObat = tampungObat + noUrutObat + ". " + emr[i].namaproduk
                        obat = obat + tampungObat + "\n";
                        noUrutObat = noUrutObat + 1;
                        tampungObat = ''
                    }
                } else if (emr[i].jenispenunjang == 'OBATPULANG') {
                    if (emr[i].objectkelompokprodukbpjsfk == 13 || emr[i].objectkelompokprodukbpjsfk == 14) {
                        tampungObatpulang = tampungObatpulang + noUrutObatpulang + ". " + emr[i].namaproduk
                        obatpulang = obatpulang + tampungObatpulang + "\n";
                        noUrutObatpulang = noUrutObatpulang + 1;
                        tampungObatpulang = ''
                    }
                } else {
                    tampungTindakan = tampungTindakan + noUrutTindakan + ". " + emr[i].namaproduk
                    tindakan = tindakan + tampungTindakan + "\n";
                    noUrutTindakan = noUrutTindakan + 1;
                    tampungTindakan = ''
                }
                if (tampung4 != '') {
                    tampung3 = tampung3 + tampung + tampung2 + "\n"
                    nourut = nourut + 1;
                }
                tampung2 = ''
                tampung = ''
                tampung4 = '';
            }
            // debugger
            tampungdiagnosa9
            for(let i = 0; i < tampungdiagnosa.length; i++) {
                if (tampungdiagnosa[i].jenisdiagnosa == "Primary") {
                    diagnosautama = diagnosautama + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa
                    kddiagnosautama = tampungdiagnosa[i].kddiagnosa
                } else if (tampungdiagnosa[i].jenisdiagnosa == "Diagnosa Awal") {
                    diagnosaawal = diagnosaawal + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa +"\n"
                    kddiagnosaawal = tampungdiagnosa[i].kddiagnosa
                } else {
                    // diagnosasekunder = diagnosasekunder + nourutsekunder + ". " + tampungdiagnosa[i].namadiagnosa + "\n"
                    // kddiagnosasekunder = kddiagnosasekunder + "Kode:	  ICD - 10 : " + tampungdiagnosa[i].kddiagnosa + "\n"
                    diagnosasekunder = diagnosasekunder + tampungdiagnosa[i].kddiagnosa + ' - ' + tampungdiagnosa[i].namadiagnosa +"\n"
                    kddiagnosasekunder = tampungdiagnosa[i].kddiagnosa
                }
                nourutsekunder = nourutsekunder + 1
            }
            if (tampungdiagnosa9.length == 0) {
                diagnosatindakan = '-'
            }
            for(let i = 0; i < tampungdiagnosa9.length; i++) {
                diagnosatindakan = diagnosatindakan + nouruttindakan + ". " + tampungdiagnosa9[i].kddiagnosatindakan + ' - ' + tampungdiagnosa9[i].namadiagnosatindakan + "\n"
                kddiagnosatindakan = kddiagnosatindakan + "Kode: ICD - 9 - CM : " + tampungdiagnosa9[i].kddiagnosatindakan + "\n"
                nouruttindakan = nouruttindakan + 1;
            }
            if (penunjanglab == 'Laboratorium Patologi Klinik : ') {
                penunjanglab = ''
            }
            if (penunjangrad == 'Radiologi : ') {
                penunjangrad = ''
            }
            if (penunjangpa == 'Laboratorium Patologi Anatomik : ') {
                penunjangpa = ''
            }
            if (tindakanlab == 'Laboratorium Patologi Klinik : ') {
                tindakanlab = ''
            }
            if (tindakanrad == 'Radiologi : ') {
                tindakanrad = ''
            }
            if (tindakanpa == 'Laboratorium Patologi Anatomik : ') {
                tindakanpa = ''
            }
            if (obatpulang == '') {
                obatpulang = '-'
            }
            if (diagnosautama != 'Diagnosis Primer / Utama : ') {
                // diagnosautama = ''
                alldiagnosa = alldiagnosa + diagnosautama + " \n";
            }
            if (diagnosasekunder != 'Diagnosis Sekunder : ') {
                // diagnosasekunder = ''
                alldiagnosa = alldiagnosa + diagnosasekunder + " \n";
            }
            if (diagnosaawal != 'Diagnosis Awal : ') {
                // diagnosaawal = ''
                alldiagnosa = alldiagnosa + diagnosaawal + " \n";
            }
            if (alldiagnosa == '') {
                alldiagnosa = '-'
            }
            // if (hasilKonsultasi == '') {
            //     hasilKonsultasi = '-'
            // }
            if (penunjanglab == '' && penunjangrad == '' && penunjangpa == '') {
                penunjanglab = '-'
            }
            if (tindakanlab == '' && tindakanrad == '' && tindakanpa == '') {
                tindakanlab = '-'
            }
            let kontrolpoli = '-'
            if ($scope.item.kontrolPoli != undefined) {
                kontrolpoli = $scope.item.kontrolPoli.namaruangan
            }
            let tindaklanjut = "Kontrol ke Poli : Tidak" + " \n" + "Pada Tanggal : -" + " \n" + "Dalam Keadaan Darurat Dapat Menghubungi : RS Bhayangkara Cianjur 02263285299";
            if ($scope.item.yapoli == true) {
                tindaklanjut = "Kontrol ke Poli : " + kontrolpoli + " \n" + "Pada Tanggal : " + moment($scope.item.tglKontrol).format('DD-MM-YYYY') + " \n" + "Dalam Keadaan Darurat Dapat Menghubungi : RS Bhayangkara Cianjur 02263285299"
            }
            if ($scope.item.hasilKonsul == '' || $scope.item.hasilKonsul == undefined) {
                hasilKonsultasi = '-'
            } else {
                hasilKonsultasi = $scope.item.hasilKonsul
            }
            var qr = "https://rsbcianjur.com/service/medifirst2000/report/cetak-ttd-new?idPegawai="+$scope.item.namadokter.id
            // let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?idPegawai="+ $scope.item.dpjp.id + "&pesan=" + "RESUME MEDIS" + "&noregistrasi=" + $scope.cc.noregistrasi
            // let z = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pasien?noregistrasi=" + $scope.cc.noregistrasi
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["norec", "tampung", "diagnosautama", "kddiagnosautama", "diagnosasekunder", "kddiagnosasekunder", "diagnosatindakan", "kddiagnosatindakan", "penunjang", "obat", "tindakan","penunjanglab","penunjangrad","penunjangpa","tindakanlab","tindakanrad","tindakanpa","hasilkonsul","diagnosaawal","cpptO","alldiagnosa","tindaklanjut","obatpulang","qr"],
                "paramValue": [norecresume, tampung3, diagnosautama, kddiagnosautama, diagnosasekunder, kddiagnosasekunder, diagnosatindakan, kddiagnosatindakan, penunjang, obat, tindakan,penunjanglab,penunjangrad,penunjangpa,tindakanlab,tindakanrad,tindakanpa,hasilKonsultasi,diagnosaawal,cpptO, alldiagnosa,tindaklanjut,obatpulang,qr],
                "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "","","","","","","","","",""]
            };
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //this.response is what you're looking for
                    // handler(this.response);
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                    //debugger;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                    saveTglCetak();
                }
            }


            //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
            // var datauserkelompok = medifirstService.getKelompokUser();

             
            if (window.location.hostname.indexOf('localhost') > -1) {
                xhr.open('POST', 'http://localhost:8797/generic/report/ResumeMedisIGD.pdf');
            } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                xhr.open('POST', 'http://103.151.226.36:2222/generic/report/ResumeMedisIGD.pdf');
            } else {
                xhr.open('POST', '/jasper1/generic/report/ResumeMedisIGD.pdf');
            }
            // else {
            //     if (window.location.hostname.indexOf('192.168.1.7') > -1) {
            //         xhr.open('POST', 'http://192.168.1.7:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
            //         xhr.open('POST', 'http://192.168.88.56:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
            //         xhr.open('POST', 'http://10.10.20.167:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
            //         xhr.open('POST', 'http://10.5.1.2:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
            //         xhr.open('POST', 'http://202.51.105.98:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
            //         xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisIGDSalinan.pdf');
            //     } else {
            //         xhr.open('POST', '/jasper1/generic/report/ResumeMedisIGDSalinan.pdf');
            //     }
            // }



            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));
        })
        var jsonLog = {
            'jenislog': 'Cetak Resume Medis',
            'referensi': 'noregistrasi',
            'noreff': $scope.cc.noregistrasi,
            'keterangan': 'Cetak Resume Medis' +  ' Dengan No Registrasi ' + $scope.cc.noregistrasi + ' ' + 'Oleh User ' + '' + namalengkap.namalengkap
            + ' ' + 'Pada ' + $scope.item.tglcetak,
            'jenisemr': 'Resume Medis',                    
        }
        medifirstService.postLoggingEMRCetak(jsonLog).then(function(e) {
        })
        saveTglCetak();
        }
        function loadObatResume() {
            medifirstService.get('emr/get-pelayanan-from-temp-resume?norec=' + norecresume).then(function(dat) {
                obat = dat.data.obat
                let a = ""
                let b = ""
                tampungNorecObatPulang = a.slice(1, a.length);
                for (let i = 0; i < dat.data.obat.length; i++) {
                    dat.data.obat[i].no = i + 1;
                    let c = obat[i].norec_pp
                    b = "," + c
                    a = a + b
                    dat.data.obat[i].jumlah = parseInt(dat.data.obat[i].jumlah)
                }
                noreceditobatresume = a.slice(1, a.length);
                // debugger
                $scope.dataGridObat = {
                    data: dat.data.obat,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.obat.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
                $scope.columnGridObat = {
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "30px"
                        },
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "90px"
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "120px"
                        },
                        {
                            "field": "noresep",
                            "title": "No Resep",
                            "width": "120px"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "160px",
                        },
                        {
                            "field": "namaruangandepo",
                            "title": "Depo",
                            "width": "140px"
                        },
                        {
                            "field": "dokter",
                            "title": "Dokter",
                            "width": "140px"
                        },
                        {
                            "command": [
                                { text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
                            ],
                            title: "Action",
                            width: "100px"
                        }
    
                    ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                }
                //ini obat pulang
                
                obatpulang = dat.data.obatpulang
                for (let i = 0; i < dat.data.obatpulang.length; i++) {
                    dat.data.obatpulang[i].no = i + 1;
                    dat.data.obatpulang[i].jumlah = parseInt(dat.data.obatpulang[i].jumlah)
                }
                $scope.dataGridObatPulang = {
                    data: dat.data.obatpulang,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: dat.data.obatpulang.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
            $scope.columnGridObatPulang = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "15px"
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Pelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "180px"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah Obat",
                        "width": "50px",
                        template: "<span class='style-center'>{{formatDecimal('#: jumlah #', '')}}</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Depo",
                        "width": "80px",
                    },
                    {
                        "field": "dokterobat",
                        "title": "Pemberi Resep",
                        "width": "140px"
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusObatPulang, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "50px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            })
        }
        $scope.editDataObat = function() {
            medifirstService.get('farmasi/get-transaksi-pelayanan?norec_pp=' + noreceditobatresume).then(function(dat) {
                // debugger
            })
        }
        $scope.$watch('item.kondisiMeninggalkan', function(e) {
            if (e.id == 6 || e.id == 7) {               
                medifirstService.get('ambulance/get-status-kependudukan?nocm=' + $scope.header.nocm).then(function(dat) {
                    $scope.item.statuskependudukan = {statuskependudukan:dat.data.data.statuskependudukan, id:dat.data.data.id  } 
                })                
                var selisihWaktu = new Date($scope.header.tglregistrasi) - new Date($scope.header.tgllahir);
                var selisihHari = selisihWaktu / (1000 * 60 * 60 * 24);            
                if (selisihHari > 7) {
                   $scope.penyebab1 = true;
                   $scope.penyebab2 = false;
                } else {
                   $scope.penyebab1 = false;
                   $scope.penyebab2 = true;
                }
                $scope.item.kondisiMeninggalkan =  { kondisi: $scope.item.kondisiMeninggalkan.kondisi }
                //**Cek Kematiannya Dulu */
                medifirstService.get('ambulance/get-status-kematian?noregistrasi=' + $scope.header.noregistrasi).then(function(dat) {
                    noreckematian = dat.data.data.norec 
                    nosuratkematian = dat.data.data.nosuratkematian 
                    $scope.item.hubungankeluarga = {hubungankeluargakematian:dat.data.data.hubungankeluargakematian, hubungankeluargakematianfk:dat.data.data.hubungankeluargakematianfk  } 
                    $scope.item.tglmeninggal = dat.data.data.tglmeninggalkematian
                    $scope.item.dasardiagnosis =  {dasardiagnosis:dat.data.data.dasardiagnosis, id:dat.data.data.ddid  } 
                    $scope.item.penyebabkematian =  {penyebabkematian:dat.data.data.penyebabkematian, id:dat.data.data.pkid  } 
                    $scope.item.doktermenerangkan =  {namadokter:dat.data.data.namalengkap, id:dat.data.data.pgid  } 
                    $scope.item.penyebablangsunga = {kodeNama:dat.data.data.penyebablangsunga  } 
                    $scope.item.penyebablangsungb = {kodeNama:dat.data.data.penyebablangsungb  } 
                    $scope.item.penyebablangsungc = {kodeNama:dat.data.data.penyebablangsunga  } 
                    $scope.item.penyebablangsungd = {kodeNama:dat.data.data.penyebablangsungd  } 
                    $scope.item.kondisilain = dat.data.data.kondisilain
                    $scope.item.penyebabutamabayi = {kodeNama:dat.data.data.penyebabutamabayi  } 
                    $scope.item.penyebablainbayi = {kodeNama:dat.data.data.penyebablainbayi  } 
                    $scope.item.penyebabutamaibu = {kodeNama:dat.data.data.penyebabutamaibu  } 
                    $scope.item.penyebablainibu = dat.data.data.penyebablainibu
                })   

                $scope.PopUpInputKematian.center().open();
            }
        })
        function kematian(){               
            $scope.item.nama = $scope.header.namapasien;
            medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                $scope.liststatuskependudukan = dat.data.statuskependudukan;
                $scope.listhubungankeluargakematian = dat.data.hubungankeluargakematian;                
                $scope.listdasardiagnosis = dat.data.dasardiagnosis;                
                $scope.listdokter = dat.data.dokter;                                    
                $scope.listpenyebabkematian = dat.data.penyebabkematian;                                    
            })
            medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                $scope.listDiagnosa = data;
            });
        }
        function Kosongkankematian() {
            $scope.item.statuskependudukan = undefined;
            $scope.item.hubungankeluarga = undefined;            
            $scope.item.tglmeninggal = '';
            $scope.item.dasardiagnosis = undefined;
            $scope.item.penyebablangsunga = undefined;
            $scope.item.penyebablangsungb = undefined;
            $scope.item.penyebablangsungc = undefined;
            $scope.item.penyebablangsungd = undefined;
            $scope.item.kondisilain = undefined;
            $scope.item.penyebabutamabayi = undefined;
            $scope.item.penyebablainbayi = undefined;
            $scope.item.penyebabutamaibu = undefined;
            $scope.item.penyebablainibu = undefined;
            $scope.item.doktermenerangkan = undefined;
        }
        $scope.simpankematian = function () {               
            if($scope.item.penyebabkematian == undefined){
                toastr.error('Penyebab Kematian Wajib Diisi!')
                return;
            }
            if($scope.item.tglmeninggal == undefined){
                toastr.error('Tgl Meninggal Wajib Diisi!')
                return;
            }
            if($scope.item.hubungankeluarga == undefined){
                toastr.error('Hubungan Keluarga Wajib Diisi!')
                return;
            }
            if($scope.item.dasardiagnosis == undefined){
                toastr.error('Dasar Diagnosis Wajib Diisi!')
                return;
            }
            if($scope.item.doktermenerangkan == undefined){
                toastr.error('Dokter Yang Menerangkan Wajib Diisi!')
                return;
            }
            if($scope.item.tglmeninggal == undefined){
                toastr.error('Tanggal Meninggal Wajib Diisi!')
                return;
            }
            var statuskependudukan = null;
            if ($scope.item.statuskependudukan != undefined) {
                statuskependudukan = $scope.item.statuskependudukan.id;
            }
            var penyebablangsunga = null;
            if ($scope.item.penyebablangsunga != undefined) {
                penyebablangsunga = $scope.item.penyebablangsunga.kodeNama;
            }
            var penyebablangsungb = null;
            if ($scope.item.penyebablangsungb != undefined) {
                penyebablangsungb = $scope.item.penyebablangsungb.kodeNama;
            }
            var penyebablangsungc = null;
            if ($scope.item.penyebablangsungc != undefined) {
                penyebablangsungc = $scope.item.penyebablangsungc.kodeNama;
            }
            var penyebablangsungd = null;
            if ($scope.item.penyebablangsungd != undefined) {
                penyebablangsungd = $scope.item.penyebablangsungd.kodeNama;
            }
            var kondisilain = null;
            if ($scope.item.kondisilain != undefined) {
                kondisilain = $scope.item.kondisilain;
            }
            var penyebabutamabayi = null;
            if ($scope.item.penyebabutamabayi != undefined) {
                penyebabutamabayi = $scope.item.penyebabutamabayi.kodeNama;
            }
            var penyebablainbayi = null;
            if ($scope.item.penyebablainbayi != undefined) {
                penyebablainbayi = $scope.item.penyebablainbayi.kodeNama;
            }
            var penyebabutamaibu = null;
            if ($scope.item.penyebabutamaibu != undefined) {
                penyebabutamaibu = $scope.item.penyebabutamaibu.kodeNama;
            }
            var penyebablainibu = null;
            if ($scope.item.penyebablainibu != undefined) {
                penyebablainibu = $scope.item.penyebablainibu;
            }
            var objSave = {
                norec: noreckematian,
                nosuratkematian: nosuratkematian,
                statuskependudukan: statuskependudukan,
                hubunganKeluarga: $scope.item.hubungankeluarga.hubungankeluargakematianfk,                
                dasardiagnosis: $scope.item.dasardiagnosis.id,
                penyebablangsunga: penyebablangsunga,
                penyebablangsungb: penyebablangsungb,
                penyebablangsungc: penyebablangsungc,
                penyebablangsungd: penyebablangsungd,
                kondisilain: kondisilain,
                penyebabutamabayi: penyebabutamabayi,
                penyebablainbayi: penyebablainbayi,
                penyebabutamaibu: penyebabutamaibu,
                penyebablainibu: penyebablainibu,
                tglmeninggal: moment($scope.item.tglmeninggal).format('YYYY-MM-DD HH:mm:ss'),                
                noregistrasi: $scope.header.noregistrasi,
                doktermenerangkan: $scope.item.doktermenerangkan.id,
                penyebabkematian: $scope.item.penyebabkematian.id,
                asalinputankematian: 'Resume IGD',
                namajenazah: $scope.header.namapasien,
            }
            // debugger
            medifirstService.post('ambulance/save-surat-kematian-resume', objSave).then(function (e) {
                if (e.status == 201) {
                $scope.isRouteLoading = true;
                $scope.PopUpInputKematian.center().close();   
                $scope.isRouteLoading = false;
                Kosongkankematian();
            }               
            
            });
        }
        function inputOtomatisSegelaPenunjang() {
            let objSave = {
                norec: norecresume,
                noregistrasi: $scope.cc.noregistrasi,
                noemr: norec_emrr
            }
            medifirstService.postNonMessage('emr/cek-otomatis-penunjang-resume-igd', objSave).then(function(e) {
                if (e.data.message != "Tidak ada penunjang") {
                    loadDiagnosa()
                }
            })
        }
        function saveTglCetak() {
            let objSave = {
                norec: norecresume
            }
            medifirstService.postNonMessage('emr/update-tgl-cetak-resume', objSave).then(function(e) {
                $scope.item.tglCetak = e.data.time
            })
        }
    }
])
})