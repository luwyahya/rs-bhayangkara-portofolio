define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('CatatanDokterCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state',
        'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog, FormGroup, FormArray, FormBuilder) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.now = new Date();
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            var statusTambah = true
            $scope.cc = {}
            $scope.modelgrid = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 518
            var dataLoad = []
            let tampungOrderLab = [];
            let tampungOrderRad = [];
            $scope.item = {};
            $scope.item.rke = 1;
            $scope.inputObatOrder = true
            $scope.item.tglPelayanan = moment($scope.now).format('YYYY-MM-DD HH:mm')
            $scope.item.tglPelayanan2 = moment($scope.now).format('YYYY-MM-DD HH:mm')
            $scope.item.tglcetak = moment($scope.now).format('YYYY-MM-DD HH:mm')
            $scope.item.objcbo = []
            $scope.isCetak = true
            var paramSearch = ''
            $scope.noemr = ''
            $scope.user = {};
            $scope.modelGrid = {}
            $scope.item.tgl = []
            $scope.item.jp = []
            $scope.item.hp = []
            var produkDef = []
            var jenisPelayananId = ''
            $scope.showbtn = true
            $scope.item.it = []
            $scope.item.dk = []
            var dataProdukDetail = [];
            var data2 = [];
            var noTerima = '';
            var hrg1 = 0
            $scope.istempatLaporan = true;
            $scope.inputOrder = true;
            $scope.inputOrderRad = true;
            $scope.grid = true;
            $scope.btnTambah = true;
            $scope.input = false;
            var jenisPegawaiLogin = {};
            var temphasil = [];
            var namalengkap = {};
            let isPrimary = false
            var nomorEMRSS = ''
            $scope.perawat = false
            $scope.dokter = false
            $scope.saveIcd10Button = true
            $scope.rajal = true
            $scope.ranap = false
            $scope.bidan = false
            $scope.mata = false
            $scope.igd = false;
            $scope.InputLab= false
            $scope.InputRadiologi = false
            $scope.InputObat = false
            $scope.dataSelectedVitalSign = {}
            let tampungVitalSign = ''
            var aksescetak = true;
            getPegawai()
            SetCacheHelper();
            // disini untuk kepentingan e-resep
            $scope.norecOrder = ''
            var norec_apd = '';
            var norec_pd = '';
            var nocm_str = '';
            $scope.item.rke = 1;
            $scope.item.tglresep = $scope.now;
            $scope.item.tglresepAkhir = $scope.now;
            $scope.item.nilaiKonversi = 0
            $scope.item.jumlah = 1
            $scope.item.totalSubTotal = 0
            $scope.item.stok = 0
            $scope.item.hargaSatuan = 0
            $scope.item.total = 0
            var diffDays = 1
            var date1 = new Date($scope.item.tglresep);
            var date2 = new Date($scope.item.tglresepAkhir);
            diffDays = date2.getDate() - date1.getDate();
            diffDays = diffDays + 1
            $scope.kAngka = diffDays
            var detail = ''
            $scope.item.aturanPakai = "";
            var dataPaket = [];
            $scope.statusSelesaiPeriksa = false

            $scope.showRacikanDose = false

            function getPegawai() {
                var user = medifirstService.getPegawaiLogin().jenisPegawai
                if (user.jenispegawai == 'DOKTER') {
                    jenisPegawaiLogin = {id : 23, jenispetugaspe: 'Dokter'}
                    $scope.dokter = true
                } else if (user.jenispegawai == 'Apoteker') {
                    jenisPegawaiLogin = {id : 7, jenispetugaspe: 'Apoteker'}
                } else if (user.jenispegawai == 'Laboratorium') {
                    jenisPegawaiLogin = {id : 10, jenispetugaspe: 'Laborat'}
                } else if (user.jenispegawai == 'Ahli Gizi') {
                    jenisPegawaiLogin = {id : 15, jenispetugaspe: 'Ahli Gizi'}
                } else if (user.jenispegawai == 'PERAWAT') {
                    jenisPegawaiLogin = {id : 23, jenispetugaspe: 'Perawat'}
                    $scope.perawat = true
                } else if (user.jenispegawai == 'BIDAN') {
                    jenisPegawaiLogin = {id : 25, jenispetugaspe: 'Bidan'}
                    $scope.perawat = true
                } else if (user.jenispegawai == 'PSIKOLOG') {
                    jenisPegawaiLogin = {id : 25, jenispetugaspe: 'Psikolog'}
                } else if (user.jenispegawai == 'PELAKSANA') {
                    jenisPegawaiLogin = {id : 2, jenispetugaspe: 'Petugas Pelaksana'}
                    $scope.perawat = true
                } else if (user.jenispegawai == 'Fisioterapis') {
                    jenisPegawaiLogin = {id : 32, jenispetugaspe: 'Fisioterapis'}
                    $scope.perawat = true
                } else {
                    jenisPegawaiLogin = {}
                }
                namalengkap = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
            }
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
                            31: $scope.header.pekerjaan
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
                    $scope.cc.dpjp = chacePeriode[16]
                    $scope.cc.iddpjp = chacePeriode[17]
                    $scope.cc.norec_emr = '-'
                    $scope.item.kdKelompokPasien = chacePeriode[19]
                    $scope.cc.objectrekananfk = chacePeriode[22]
                    $scope.cc.objectdepartemenfk = chacePeriode[23]
                    $scope.cc.noregistrasi2 = chacePeriode[25]
                    if ($scope.cc.objectdepartemenfk == 18 || $scope.cc.objectdepartemenfk == 79 || $scope.cc.objectdepartemenfk == 28) {
                        $scope.rajal = false;
                    } else if ($scope.cc.objectdepartemenfk == 24) {
                        $scope.igd = true;
                    }
                    $scope.cc.isHistory = chacePeriode[20]
                    if ($scope.cc.objectruanganfk == 552) {
                        $scope.bidan = true;
                    }
                    if ($scope.cc.objectruanganfk == 8) {
                        $scope.mata = true;
                        $scope.rajal = true;
                    }
                    if ($scope.cc.objectdepartemenfk == 16) {
                        $scope.ranap = true;
                    }
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    if($scope.cc.noregistrasi2 != $scope.cc.noregistrasi){
                        $scope.btnTambah = false;
                    }
                    init()
                    LoadData();
                    LoadCombo();
                }
            }
            
            function LoadCombo() {
                medifirstService.get("emr/get-combo-cppt").then(function(dat) {
                    $scope.listJenisPetugas = dat.data.jenispetugas
                    $scope.listDokter = dat.data.pegawaiAll
                    $scope.listPerawat = dat.data.pegawai
                    $scope.listTandaTangan = dat.data.pegawaiAll
                })
                medifirstService.get('emr/get-combo-cppt-p').then(function(dat) {
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa
                })
                medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.cc.noregistrasi).then(function(dat) {
                    $scope.listAskep = dat.data.askep
                })

                medifirstService.get('emr/get-pegawai-parts?id=' + medifirstService.getPegawaiLogin().id).then(function (dat) {
                    namalengkap = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                })
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa10 = data;
                });
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosa9 = data;
                });
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatandokter" + "&namaruangan=" + $scope.cc.namaruangan, true).then(function(dat) {
                    $scope.isRouteLoading = false
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    if (dat.data.data.length > 0) {
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '518'
                    } else {
                        $scope.noemr = ''
                        $scope.cc.norec_emr = ''
                        nomorEMRSS = ''
                        nomorEMR = ''
                        $scope.cc.emrfk = '518'
                    }
                });
                // key 03-17-2024
                medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
                $scope.cc.noregistrasi, true).then(function (dat) {
                        $scope.statusSelesaiPeriksa = dat.data.data
                    });
            }
                $scope.resumeOptHead = {
                    refresh: true,
                    selectable: true,
                    refresh: true,
                    groupable: true,
                    allowCopy: true,
                    columns: [
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "120px"
                        },
                        {
                            "field": "tgljam",
                            "title": "Tgl CPPT",
                            "width": "120px"
                        },
                        {
                            "field": "profesi",
                            "title": "Profesi / Bagian",
                            "width": "120px",
                        },
                        {
                            "field": "subjective",
                            "title": "S",
                            "width": "120px",
                        },
                        {
                            "field": "objective",
                            "title": "O",
                            "width": "120px",
                        },
                        {
                            "field": "assesment",
                            "title": "A",
                            "width": "120px",
                        },
                        {
                            "field": "plann",
                            "title": "P",
                            "width": "120px",
                        },
                        {
                            "field": "instruksitenaga",
                            "title": "Planning",
                            "width": "120px",
                        },
                        {
                            "field": "pegawai",
                            "title": "Verifikasi DPJP",
                            "width": "120px",
                        },
                        {
                            "field": "isverif",
                            "title": "Status Verif",
                            "width": "120px",
                            attributes: {
                                class: "#=isverif != 'Sudah di Verifikasi' ? 'red' : 'hejo' #"
                            },
                        },
                    ],

                };
            function LoadData() {
                medifirstService.get("emr/get-history-cppt?nocm=" + $scope.cc.nocm).then(function(dat) {
                    var cppt = dat.data
                    $scope.sourceResumeHead = new kendo.data.DataSource({
                        data: cppt,
                        length: cppt.length
                        // pageSize: 5,
                    });
                })
            }
            $scope.showInput = function() {
                // debugger    
                // if (nomorEMRSS == '') {
                //     $scope.grid = false;
                //     $scope.input = true;
                //     $scope.inputsave = true;
                //     $scope.editsave = false;
                //     var allElems = document.getElementsByTagName('input');
                //     for (let i = 0; i < allElems.length; i++) {
                //         if (allElems[i].type == 'radio' && allElems[i].value == 'kasusbaru') {
                //             allElems[i].checked = true;
                //         }
                //     }
                //     $scope.data = {
                //         names: [{ idtgl: "153", tgl: moment($scope.now).format('YYYY-MM-DD HH:mm'), idjp: "154", jp: jenisPegawaiLogin, idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: namalengkap, idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :", kasusbaru: true, kasuslama: false }]
                //     };
                //     loadIcd10()
                //     loadIcd9()
                //     loadOrderPenunjang()

                //     if($scope.cc.objectruanganfk == 552 || $scope.cc.objectruanganfk == 1032 || $scope.cc.objectruanganfk == 787) {
                //         cekVitalSign()
                //     }
                //     if ($scope.cc.objectruanganfk == 20) {
                //         loadAssesmentRehab()
                //     }
                //     $scope.InputLab = true;
                //     $scope.InputRadiologi = true;
                //     $scope.InputObat = true;
                //     return
                // }
                $scope.InputLab = true;
                $scope.InputRadiologi = true;
                $scope.InputObat = true;
                $scope.grid = false;
                $scope.input = true;
                $scope.inputsave = true;
                $scope.editsave = false;
                 
                $scope.data = {
                    names: [{ idtgl: "153", tgl: moment($scope.now).format('YYYY-MM-DD HH:mm'), idjp: "154", jp: jenisPegawaiLogin, idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "I :", iddk: "157", dk: namalengkap, norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: namalengkap, idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :", kasusbaru: true, kasuslama: false }]
                };
                var allElems = document.getElementsByTagName('input');
                for (let i = 0; i < allElems.length; i++) {
                    if (allElems[i].type == 'radio' && allElems[i].value == 'kasusbaru') {
                        allElems[i].checked = true;
                    }
                }
                 
                loadIcd10()
                loadIcd9()
                loadOrderPenunjang()
                if ($scope.cc.objectruanganfk == 580) {
                    getValueAsesmenRehab()
                }
                if($scope.cc.objectruanganfk == 552 || $scope.cc.objectruanganfk == 1032) {
                    cekVitalSign()
                }
                if ($scope.cc.objectruanganfk == 20) {
                    loadAssesmentRehab()
                }
            }
            $scope.data = {
                names: [{ idtgl: "153", tgl: moment($scope.now).format('YYYY-MM-DD HH:mm'), idjp: "154", jp: jenisPegawaiLogin, idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "I :", iddk: "157", dk: namalengkap, norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: namalengkap, idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :", kasusbaru: true, kasuslama: false }]
            };
            $scope.TambahSoap = function(index) {
                var ax = $scope.data.names[index].list
                $scope.data.names[index].o = ax.caption;
                medifirstService.get("emr/get-dataaskep?noemr=" + ax.emrpasienfk + "&emrfk=" +
                    ax.id).then(function(dat) {
                    var a = '';
                    var o = '';
                    var p = '';
                    var tempa = '';
                    var tempo = '';
                    var tempp = '';
                    var data = dat.data.askep
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].kolom == 1) {
                            if(tempa!=data[i].captionemr) { //ash 2023-09011
                                a = a + data[i].captionemr + "\n"
                                tempa=data[i].captionemr
                            }
                        }
                        if (data[i].kolom == 2) {
                            if(tempo!=data[i].captionemr) {//ash 2023-09011
                                o = o + data[i].captionemr + "\n"
                                tempo=data[i].captionemr
                            }
                        }
                        if (data[i].kolom == 3) {
                            if(tempp!=data[i].captionemr) {//ash 2023-09011
                                p = p + data[i].captionemr + "\n"
                                tempp=data[i].captionemr
                            }
                        }
                    }
                    $scope.data.names[index].a = a;
                    $scope.data.names[index].p = p;
                    $scope.data.names[index].it = p;
                    $scope.data.names[index].o = o;
                })

            }
             
            $scope.Tambah = function(index) {
                 
                var name = { idtgl: "153", tgl: moment($scope.now).format('YYYY-MM-DD HH:mm'), idjp: "154", jp: jenisPegawaiLogin, idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "I :", iddk: "157", dk: namalengkap, norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: namalengkap, idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :", kasusbaru: true, kasuslama: false };
                if ($scope.data.names.length <= index + 1) {
                    $scope.data.names.splice(index + 1, 0, name);
                }
            }
            $scope.kembali = function() {
                 
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }
            $scope.Save = function() {
                $scope.inputsave = false
                let adaInstruksi = false
                let tampungInstruksifk = '';
                var arrobj = $scope.data.names
                var arrSave = []
                var arrTemp = []
                 
                for (var j = 0; j < arrobj.length; j++) {
                    if (arrobj[j].menyerahkan == "" || arrobj[j].menyerahkan == null) {
                        arrobj[j].menyerahkan = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].ttd == "" || arrobj[j].ttd == null) {
                        arrobj[j].ttd = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].menerima == null || arrobj[j].menerima.namalengkap == undefined) {
                        arrobj[j].menerima = {
                            namalengkap: ""
                        }
                    }
                    // if (arrobj[j].pi.namalengkap == "" || arrobj[j].pi.namalengkap == null) {
                    //     toastr.error('Pilih Penerima Instruksi dahulu!');
                    //     $scope.inputsave = true
                    //     return
                    // }
                    if (arrobj[j].pi.namalengkap == undefined) {
                        arrobj[j].pi = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].instruksi.namalengkap == undefined) {
                        arrobj[j].instruksi = {
                            namalengkap: ""
                        }
                    } else {
                        adaInstruksi = true;
                        tampungInstruksifk = arrobj[j].instruksi.id
                    }
                    if (arrobj[j].dk == undefined || arrobj[j].dk == null || arrobj[j].dk == "") {
                        arrobj[j].dk = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].tgllapor == "Invalid date") {
                        arrobj[j].tgllapor = ""
                    }
                    if (arrobj[j].tgljawab == "Invalid date") {
                        arrobj[j].tgljawab = ""
                    }
                    if (arrobj[j].pk == undefined) {
                        arrobj[j].pk = ""
                    }
                    if (arrobj[j].jp == null) {
                        alert('Profesi/Bagian belum diisi !')
                        $scope.inputsave = true
                        return
                    }
                    arrobj[j].hp = arrobj[j].s + "\n\n" + arrobj[j].o + "\n\n" + arrobj[j].a + "\n\n" + arrobj[j].p
                }

                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "") {
                        arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss') })
                        arrSave.push({ id: arrobj[i].idjp, values: arrobj[i].jp.jenispetugaspe })
                        arrSave.push({ id: arrobj[i].idhp, values: arrobj[i].hp })
                        arrSave.push({ id: arrobj[i].idit, values: arrobj[i].it })
                        arrSave.push({ id: arrobj[i].iddk, values: arrobj[i].dk.namalengkap })
                        arrSave.push({ id: arrobj[i].ids, values: arrobj[i].s })
                        arrSave.push({ id: arrobj[i].ido, values: arrobj[i].o })
                        arrSave.push({ id: arrobj[i].ida, values: arrobj[i].a })
                        arrSave.push({ id: arrobj[i].idp, values: arrobj[i].p })

                    }
                    if (arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "" && arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap == "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].pi.namalengkap == "" && arrobj[i].instruksi.namalengkap == "") {
                        arrSave.push({ id: arrobj[i].idpi, values: arrobj[i].pi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgllapor, values: arrobj[i].tgllapor })
                        arrSave.push({ id: arrobj[i].idinstruksi, values: arrobj[i].instruksi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgljawab, values: arrobj[i].tgljawab })
                    }
                    if (arrobj[i].pi.namalengkap != "" && arrobj[i].instruksi.namalengkap != "") {
                        arrSave.push({ id: arrobj[i].idpi, values: arrobj[i].pi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgllapor, values: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss') })
                        arrSave.push({ id: arrobj[i].idinstruksi, values: arrobj[i].instruksi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgljawab, values: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss') })
                    }
                    if (arrobj[i].tgl == "" && arrobj[i].jp == "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan == "" && arrobj[i].menerima == "" && arrobj[i].pk == "") {


                    } else {

                    }
                }

                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap == "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, instruksifk: arrobj[i].instruksi.id, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, instruksifk: arrobj[i].instruksi.id, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, instruksifk: arrobj[i].instruksi.id, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap == "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, instruksifk: arrobj[i].instruksi.id, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else {

                    }
                }
                $scope.cc.jenisemr = 'catatandokter'

                var gasSave = {
                    head: $scope.cc,
                    data: arrSave,
                    temp: arrTemp,
                }
                medifirstService.post('emr/save-catatan-dokter', gasSave).then(function(e) {
                    // $scope.inputsave = false
                    let objSave = {
                        noRegistrasi: $scope.cc.noregistrasi
                    }
                    medifirstService.postNonMessage('emr/update-is-cppt', objSave).then(function(a) {

                    })
                    // if (adaInstruksi == true) {
                    //     let datanotif = {
                    //         "title": 'Verif Intruksi CPPT',
                    //         "namaruangan": $scope.cc.namaruangan,
                    //         "namapasien": $scope.cc.namapasien,
                    //         "tglorder": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    //         "nocm": $scope.cc.nocm,
                    //         "idruangan": $scope.cc.objectruanganfk,
                    //         "form": "-",
                    //         "pegawaitujuanfk": tampungInstruksifk
                    //     }
                    //     medifirstService.postNonMessage('microservice/savenotif', datanotif).then(function (e) {
                    //         var socket1 = io.connect(config.urlSocket)
                    //         var arrayS = {
                    //             no: 2,
                    //         };
                    //         socket1.emit('notif-ruangan', arrayS)  
                    //     });
                    // }
                    var jsonLog = {
                        'jenislog': 'Save CPPT',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Catatan Dokter ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {

                    })
                    // set Interval
    					// setTimeout(function () {
      					//   loadData();
    					// }, 10000); // 10000 milisecond = 10 detik
                    init()
                    LoadData();
                    // LoadCacheHelper();
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.grid = true;
                    $scope.input = false;
                }, error => {
                    $scope.inputsave = true
                })
            }
            $scope.Verifikasi = function() {
                if ($scope.modelGrid.isverif == "Sudah di Verifikasi") {
                    toastr.error('Data Sudah Di Verif', 'Peringatan !');
                    return;
                }
                if ($scope.modelGrid.norec == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                 
                var stt = 'false'
                if (confirm('Verifikasi CPPT ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }
                 
                if (stt == 'true') {
                    var update = {
                        // norecemr: $scope.modelGrid.noemr
                        norecemr: $scope.modelGrid.norec
                    }
                    medifirstService.post('emr/save-verifikasi-dokter-cppt', update).then(function(dat) {

                        // set Interval
    					// setTimeout(function () {
      					//   loadData();
    					// }, 10000); // 10000 milisecond = 10 detik

                        // init()
                        LoadCacheHelper();
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    })
                }
            }
            $scope.Unverifikasi2 = function() {
                $scope.popUpUnVerifikasi.center().open()
            }
            $scope.Unverifikasi = function() {
                
                if ($scope.modelGrid.isverif != "Sudah di Verifikasi") {
                    toastr.error('Data Belum Di Verif', 'Peringatan !');
                    return;
                }

                if ($scope.item.password2 != "sehatselalu") {
                    toastr.error('Password Salah !')
                    return
                }
                var stt = 'false'
                if (confirm('Unerifikasi CPPT ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                    $scope.popUpUnVerifikasi.close()
                    $scope.item.password2 = undefined
                }
                 
                if (stt == 'true') {
                    $scope.popUpUnVerifikasi.close()
                    $scope.item.password2 = undefined
                    var update = {
                        //norecemr: $scope.modelGrid.noemr
                        norecemr: $scope.modelGrid.norec
                    }
                    medifirstService.post('emr/save-unverifikasi-dokter-cppt?norecemr=' + $scope.modelGrid.norec).then(function(dat) {

                        // set Interval
    					// setTimeout(function () {
      					//   loadData();
    					// }, 10000); // 10000 milisecond = 10 detik

                        // init()
                        LoadCacheHelper();
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    })
                }
            }
            $scope.cetakPdf = function() {

                if($scope.modelGrid.noemr == undefined) {
                    toastr.error('Tidak Bisa Cetak, Mohon Klik Salah Satu Data yang ada di CPPT !!')
                    return
                }
                
                // Penjagaan Limit Akses cetak hanya 3 user dibawah ini aja
                // 25388(Rosita), 26920(wiwit), 26687(teguh), 320263(admin)                
                namalengkap = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };                
                if(namalengkap.id != 25388 && namalengkap.id != 26920 && namalengkap.id != 26687 && namalengkap.id != 320263 && namalengkap.id != 27116 && namalengkap.id != 27368 && namalengkap.id != 27127 && namalengkap.id != 27429 && namalengkap.id != 27114 && namalengkap.id != 27348 && namalengkap.id != 27424 && namalengkap.id != 27388 && 
                namalengkap.id != 27427 && namalengkap.id != 27024 && namalengkap.id != 27316 && namalengkap.id != 26945 && namalengkap.id != 27295 && namalengkap.id != 27418 && namalengkap.id != 27175 && namalengkap.id != 27492 && namalengkap.id != 25589  && namalengkap.id != 27323 && namalengkap.id != 320261232 && namalengkap.id != 27041 && namalengkap.id != 320261586
                //biling
                && namalengkap.id != 25554 && namalengkap.id != 25525 && namalengkap.id != 26911 && namalengkap.id != 26933 && namalengkap.id != 26995 && namalengkap.id != 27464 && namalengkap.id != 27482 && namalengkap.id != 27494 && namalengkap.id != 27491 && namalengkap.id != 27455 && namalengkap.id != 320261569 && namalengkap.id != 320261639) {
                    // toastr.error('Akses Dikunci, Silahkan Konfirmasi ke bagian Rekam Medis apabila mau Cetak CPPT pasien ini !!')
                    // return
                    aksescetak = false;
                }

                // if ($scope.cc.namaruangan == "BOUGENVILE-NICU" || $scope.cc.namaruangan == "ICU BEDAH JANTUNG" || $scope.cc.namaruangan == "CENDRAWASIH 2  ICU " || $scope.cc.namaruangan == "HCU 1" || $scope.cc.namaruangan == "HCU 2" || $scope.cc.namaruangan == "HCU 3  dr.GALIH" || $scope.cc.namaruangan == "ECU" || $scope.cc.namaruangan == "ICCU" ||
                //     $scope.cc.namaruangan == "ICU A 1" || $scope.cc.namaruangan == "ICU A 2" || $scope.cc.namaruangan == "ICU KHUSUS" || $scope.cc.namaruangan == "NICU B" || $scope.cc.namaruangan == "ICU PROMOTER LT.6" || $scope.cc.namaruangan == "ICU B" || $scope.cc.namaruangan == "NICU BX") {
                //     var namapasien = $scope.cc.namapasien
                //     var norm = $scope.cc.nocm
                //     var jeniskelamin = $scope.cc.jeniskelamin
                //     var umur = $scope.cc.umur

                //     var data = {
                //         "gambarLogo": "logodokkes.jpg",
                //         "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur"],
                //         "paramValue": [namapasien, $scope.noemr, norm, jeniskelamin, umur],
                //         "paramType": ["", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                //     };
                //     var xhr = new XMLHttpRequest();
                //     xhr.onreadystatechange = function() {
                //         if (this.readyState == 4 && this.status == 200) {
                //             //this.response is what you're looking for
                //             // handler(this.response);
                //             console.log(this.response, typeof this.response);
                //             //var res = this.response
                //             //var file = new Blob( [res], {type: 'application/pdf'});

                //             var url = window.URL.createObjectURL(this.response)
                //             var pdf = document.getElementById('tempatLaporan');
                //             pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                //             var win = window.open(url, '_blank');
                //             win.focus();
                //         }
                //     }
                //     if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                //         xhr.open('POST', 'http://192.168.1.7:1002/generic/report/catatandoktericu.pdf');
                //     } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //         xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandoktericu.pdf');
                //     } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                //         xhr.open('POST', 'http://10.5.1.2:1003/generic/report/catatandoktericu.pdf');
                //     } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                //         xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatandoktericu.pdf');
                //     } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                //         xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatandoktericu.pdf');
                //     } else {
                //         xhr.open('POST', 'http://127.0.0.1:1002/generic/report/catatandoktericu.pdf');
                //     }
                //     // set `Content-Type` header
                //     xhr.setRequestHeader('Content-Type', 'application/json');
                //     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                //     xhr.responseType = 'blob';
                //     // send rquest with JSON payload
                //     xhr.send(JSON.stringify(data));
                // } else {
                var namapasien = $scope.cc.namapasien
                var norm = $scope.cc.nocm
                var jeniskelamin = $scope.cc.jeniskelamin
                var umur = '-';
                if($scope.cc.umur != null) {
                    umur = $scope.cc.umur;
                }
                var ruangan = $scope.cc.namaruangan
                let dpjp = $scope.cc.dpjp
                let noregistrasi = $scope.cc.noregistrasi
                medifirstService.get('emr/get-ttd-ppa?idDpjp=' + $scope.cc.iddpjp)
                .then(function(dat) {
                    let ttd = '';
                    if (dat.data[0] != undefined) {
                        ttd = dat.data[0].tandatangan
                    }

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur", "ruangan", "ttd", "dpjp","noregistrasi"],
                        "paramValue": [namapasien, $scope.modelGrid.noemr, norm, jeniskelamin, umur, $scope.modelGrid.namaruangan, ttd, dpjp,noregistrasi],
                        "paramType": ["", "", "", "", "", "",""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});

                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                if(aksescetak == true ){
                    if (window.location.hostname.indexOf('localhost') > -1) {
                        xhr.open('POST', 'http://localhost:8797/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                        xhr.open('POST', 'http://103.151.226.36:2222/generic/report/catatandokter2.pdf');
                    } else {
                        xhr.open('POST', '/jasper1/generic/report/catatandokter2.pdf');
                    }
                    // if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    //     xhr.open('POST', 'http://192.168.1.7:1002/generic/report/catatandokter2.pdf');
                    // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    //     xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandokter2.pdf');
                    // } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    //     xhr.open('POST', 'http://10.5.1.2:1003/generic/report/catatandokter2.pdf');
                    // } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    //     xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatandokter2.pdf');
                    // } else if (window.location.hostname.indexOf('192.168.1.74') > -1) {
                    //     xhr.open('POST', 'http://192.168.1.74:1002/generic/report/catatandokter2.pdf');
                    // } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    //     xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatandokter2.pdf');
                    // // } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    // //     xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatandokter2.pdf');
                    // } else {
                    //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandokter2.pdf');
                    // }
                } else {
                    if (window.location.hostname.indexOf('localhost') > -1) {
                        xhr.open('POST', 'http://localhost:8797/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                        xhr.open('POST', 'http://36.78.27.51:8201/generic/report/catatandokter2.pdf');
                    } else {
                        xhr.open('POST', '/jasper1/generic/report/catatandokter2.pdf');
                    }
                    // if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    //     xhr.open('POST', 'http://192.168.1.7:1002/generic/report/catatandokter2Salinan.pdf');
                    // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    //     xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandokter2Salinan.pdf');
                    // } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    //     xhr.open('POST', 'http://10.5.1.2:1003/generic/report/catatandokter2Salinan.pdf');
                    // } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    //     xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatandokter2Salinan.pdf');
                    // } else if (window.location.hostname.indexOf('192.168.1.74') > -1) {
                    //     xhr.open('POST', 'http://192.168.1.74:1002/generic/report/catatandokter2Salinan.pdf');
                    // } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    //     xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatandokter2Salinan.pdf');
                    // // } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    // //     xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatandokter2.pdf');
                    // } else {
                    //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandokter2Salinan.pdf');
                    // }
                }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                })
            }
                var jsonLog = {
                    'jenislog': 'Cetak CPPT',
                    'referensi': 'noregistrasi',
                    'noreff': $scope.cc.noregistrasi,
                    'keterangan': 'Cetak CPPT ' + ' dengan No EMR - ' + $scope.noemr + ' Dan No Registrasi ' + $scope.cc.noregistrasi + ' ' + 'Oleh User ' + '' + namalengkap.namalengkap
                    + ' ' + 'Pada ' + $scope.item.tglcetak,
                    'jenisemr': 'Catatan Dokter',                    
                }
                // medifirstService.postLoggingEMRCetak(jsonLog).then(function(e) {
                // })
            // }

            $scope.Back = function() {
                 
                $scope.InputLab = false;
                $scope.InputRadiologi = false;
                $scope.InputObat = false;
                $scope.grid = true;
                $scope.input = false;
                $scope.inputsave = false;
                $scope.editsave = true;
                
                LoadCacheHelper();
                // for(let i = 0; i < $scope.data.names.length; i++) {
                //     delete $scope.data.names[i]
                // }
                // delete $scope.data
                // $scope.data.names = []
            }
            $scope.klik = function(modelGrid) {
                // debugger
                $scope.modelGrid = modelGrid
                // if (modelGrid.verifikasi == 1) {
                    if (modelGrid.isverif == "Sudah di Verifikasi") {
                    $scope.showbtn = false
                } else {
                    $scope.showbtn = true
                }
            }
            $scope.editGrid = function() {

                // if ($scope.modelGrid == undefined) {
                if ($scope.modelGrid.norec == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                if ($scope.modelGrid.isverif == "Sudah di Verifikasi") {
                    toastr.error('Data Sudah di Verifikasi Tidak Dapat di Edit', 'Peringatan !');
                    return
                }
                // medifirstService.get('emr/get-status-verif?emrpasien=' + nomorEMRSS).then(function(dat) {
                     
                //     if (dat.data.length > 0) {
                //         if (dat.data[0].verifikasi == 1) {
                //             alert('Data Sudah Di Verifikasi ! Tidak Dapat Diedit Lagi !')
                //             $scope.grid = true;
                //             $scope.input = false;
                //             return;

                //         } else {

                //         }
                //     } else {

                //     }
                // })
                var norec = $scope.modelGrid.norec
                $scope.input = true;
                $scope.grid = false;
                $scope.inputsave = false;
                $scope.editsave = true;
                $scope.InputObat = true;
                medifirstService.get('emr/get-cppt-edit?norec=' + norec).then(function(dat) {

                    $scope.data.names[0].tgl = dat.data[0].tgljam
                    $scope.data.names[0].jp = { id: dat.data[0].id, jenispetugaspe: dat.data[0].profesi }
                    $scope.data.names[0].hp = dat.data[0].hasilpemeriksaan
                    $scope.data.names[0].it = dat.data[0].instruksitenaga
                    $scope.data.names[0].dk = { id: dat.data[0].id, namalengkap: dat.data[0].pegawai }
                    $scope.data.names[0].menyerahkan = { id: dat.data[0].id, namalengkap: dat.data[0].menyerahkan }
                    $scope.data.names[0].menerima = { id: dat.data[0].id, namalengkap: dat.data[0].menerima }
                    $scope.data.names[0].pk = dat.data[0].pasienkeluarga
                    $scope.data.names[0].ttd = { id: dat.data[0].id, namalengkap: dat.data[0].ttd }
                    $scope.data.names[0].tgllapor = dat.data[0].tgllapor
                    $scope.data.names[0].pi = { id: dat.data[0].id, namalengkap: dat.data[0].penerimainstruksi }
                    $scope.data.names[0].tgljawab = dat.data[0].tgljawab
                    $scope.data.names[0].instruksi = { id: dat.data[0].id, namalengkap: dat.data[0].pemberiinstruksi }
                    $scope.data.names[0].norec = dat.data[0].norec
                    $scope.data.names[0].s = dat.data[0].subjective
                    $scope.data.names[0].o = dat.data[0].objective
                    $scope.data.names[0].a = dat.data[0].assesment
                    $scope.data.names[0].p = dat.data[0].plann
                })
            }
            $scope.Edit = function() {
                var arrobj = $scope.data.names
                var arrTempEdit = []
                var arrSave = []
                 
                for (var j = 0; j < arrobj.length; j++) {
                    if (arrobj[j].menyerahkan == "" || arrobj[j].menyerahkan == null) {
                        arrobj[j].menyerahkan = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].ttd == "" || arrobj[j].ttd == null) {
                        arrobj[j].ttd = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].menerima == null || arrobj[j].menerima.namalengkap == undefined) {
                        arrobj[j].menerima = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].pi.namalengkap == undefined) {
                        arrobj[j].pi = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].instruksi.namalengkap == undefined) {
                        arrobj[j].instruksi = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].dk == undefined || arrobj[j].dk == null || arrobj[j].dk == "") {
                        arrobj[j].dk = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].tgllapor == "Invalid date") {
                        arrobj[j].tgllapor = ""
                    }
                    if (arrobj[j].tgljawab == "Invalid date") {
                        arrobj[j].tgljawab = ""
                    }
                    if (arrobj[j].pk == undefined) {
                        arrobj[j].pk = ""
                    }
                    arrobj[j].hp = arrobj[j].s + "\n\n" + arrobj[j].o + "\n\n" + arrobj[j].a + "\n\n" + arrobj[j].p
                }

                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap == "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap == "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else {

                    }
                }
                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "") {
                        arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss') })
                        arrSave.push({ id: arrobj[i].idjp, values: arrobj[i].jp.jenispetugaspe })
                        arrSave.push({ id: arrobj[i].idhp, values: arrobj[i].hp })
                        arrSave.push({ id: arrobj[i].idit, values: arrobj[i].it })
                        arrSave.push({ id: arrobj[i].iddk, values: arrobj[i].dk.namalengkap })
                        arrSave.push({ id: arrobj[i].ids, values: arrobj[i].s })
                        arrSave.push({ id: arrobj[i].ido, values: arrobj[i].o })
                        arrSave.push({ id: arrobj[i].ida, values: arrobj[i].a })
                        arrSave.push({ id: arrobj[i].idp, values: arrobj[i].p })

                    }
                    if (arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "" && arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap == "") {
                        arrSave.push({ id: arrobj[i].idmenyerahkan, values: arrobj[i].menyerahkan.namalengkap })
                        arrSave.push({ id: arrobj[i].idmenerima, values: arrobj[i].menerima.namalengkap })
                        arrSave.push({ id: arrobj[i].idpk, values: arrobj[i].pk })
                        arrSave.push({ id: arrobj[i].idttd, values: arrobj[i].ttd.namalengkap })
                    }
                    if (arrobj[i].pi.namalengkap == "" && arrobj[i].instruksi.namalengkap == "") {
                        arrSave.push({ id: arrobj[i].idpi, values: arrobj[i].pi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgllapor, values: arrobj[i].tgllapor })
                        arrSave.push({ id: arrobj[i].idinstruksi, values: arrobj[i].instruksi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgljawab, values: arrobj[i].tgljawab })
                    }
                    if (arrobj[i].pi.namalengkap != "" && arrobj[i].instruksi.namalengkap != "") {
                        arrSave.push({ id: arrobj[i].idpi, values: arrobj[i].pi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgllapor, values: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss') })
                        arrSave.push({ id: arrobj[i].idinstruksi, values: arrobj[i].instruksi.namalengkap })
                        arrSave.push({ id: arrobj[i].idtgljawab, values: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss') })
                    }
                    if (arrobj[i].tgl == "" && arrobj[i].jp == "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan == "" && arrobj[i].menerima == "" && arrobj[i].pk == "") {


                    } else {

                    }
                }

                var gasSave = {
                    // head: $scope.cc,
                    // data: arrSave,
                    temp: arrTempEdit,
                }
                medifirstService.post('emr/edit-catatan-dokter', gasSave).then(function(e) {
                     
                    // init()
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    // cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.grid = true;
                    $scope.input = false;
                    var jsonLog = {
                        'jenislog': 'Edit CPPT',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Edit CPPT ' + ' dengan No EMR - ' + e.data.data[0].emrpasienfk + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {

                    })

                    // // set Interval
    				// 	setTimeout(function () {
      				// 	  loadData();
    				// 	}, 10000); // 10000 milisecond = 10 detik
                        
                    LoadData();
                    LoadCacheHelper();
                })
            }
            //ini awal kodingan untuk e resep
            $scope.eResep = function() {
                $scope.popUpEResep.center().open()
            }
            // function loadComboEResep() {
            //     medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
            //         //
            //         $scope.isRouteLoading = false;
            //         // $scope.listPenulisResep = dat.data.penulisresep;
            //         $scope.listRuangan = dat.data.ruanganfarmasi;
            //         // $scope.listRuangan.splice(9);
            //         $scope.listJenisKemasan = dat.data.jeniskemasan;
            //         $scope.listProduk = dat.data.produk;
            //         $scope.listAsalProduk = dat.data.asalproduk;
            //         $scope.listRoute = dat.data.route;
            //         $scope.listAturanPakai = dat.data.signa;
            //         $scope.listJenisRacikan = dat.data.jenisracikan;
            //         $scope.listwaktuminum = dat.data.waktuminum;
            //         $scope.listsediaanobat = dat.data.sediaanobat;
            //         $scope.item.tarifadminresep = dat.data.tarifadminresep
                   
            //         // }
            //         //581368= bpjs pol
            //         if ($scope.item.objectrekananfk == 581368) {
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[6];
                     
            //             //581367= bpjs non pol 581669= non pol pbi  581673= non pol pbi scr
            //         } else if($scope.item.objectrekananfk == 581367 || $scope.item.objectrekananfk == 581669 || $scope.item.objectrekananfk == 581673){
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[3];

            //             //581724 = swasta atau poli swasta  
            //         }  else if($scope.item.objectrekananfk == 581724){
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[8];

            //             //ini kalo diluar pol dan non pol masuknya kesini yaaa  
            //         }else {
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[4];
            //         }

            //         //
            //         if ($scope.item.kdKelompokPasien == 105) {
            //             $scope.item.tarifadminresep = dat.data.tarifadminresep[1].nilaifield;
            //         }else {
            //             $scope.item.tarifadminresep = dat.data.tarifadminresep[0].nilaifield;
            //         }
                  
            //         $scope.item.jenisKemasan = dat.data.jeniskemasan[1];
            //     });
            // }
            $scope.ambilPengkajianMedisRawatInap = function(index) {
                medifirstService.get('emr/get-pengkajian-awal-medis-ranap?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.data.names[index].s = pengkajianmedis[i].riwayatpenyakit
                    }
                    toastr.success('Berhasil ambil dari Pengkajian Rawat Inap!', 'Success !')
                })
            }

            $scope.ambilDiagnosaPengkajianMedisRawatInap = function(index) {
                medifirstService.get('emr/get-pengkajian-awal-medis-ranap?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.data.names[index].a = "Diagnosa Kerja/Banding : " + pengkajianmedis[i].diagnosakerjamedis + "\n" + "\n" + "Diagnosa Kerja/Banding : " + pengkajianmedis[i].diagnosakerjabanding + "\n"
                    }
                    toastr.success('Berhasil ambil Diagnosa Kerja/Banding dari Pengkajian Rawat Inap!', 'Success !')
                })
            }

            $scope.ambilPengkajian = function(index) {
                medifirstService.get('emr/get-value-from-pengkajian-awal-3?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                     
                    let tampung = ''
                    let pengkajian = dat.data
                    for (let i = 0; i < pengkajian.length; i++) {
                        if (pengkajian[i].emrdfk == 1169) {
                            tampung = tampung + "Tekanan Darah : " + pengkajian[i].value + " mmHg\n"
                        }
                        if (pengkajian[i].emrdfk == 1170) {
                            tampung = tampung + "Nadi : " + pengkajian[i].value + " kali/menit\n"
                        }
                        if (pengkajian[i].emrdfk == 1172) {
                            tampung = tampung + "Suhu : " + pengkajian[i].value + " Celcius\n"
                        }
                        if (pengkajian[i].emrdfk == 1173) {
                            tampung = tampung + "Pernafasan : " + pengkajian[i].value + " kali/menit\n"
                        }
                        if (pengkajian[i].emrdfk == 1171) {
                            tampung = tampung + "EWS : " + pengkajian[i].value + " \n"
                        }
                        if (pengkajian[i].emrdfk == 1175) {
                            tampung = tampung + "Berat Badan : " + pengkajian[i].value + " kg\n"
                        }
                        if (pengkajian[i].emrdfk == 1174) {
                            tampung = tampung + "Tinggi Badan : " + pengkajian[i].value + " cm\n"
                        }
                        // if (pengkajian[i].emrdfk == 1176) {
                            if (pengkajian[i].emrdfk == 1178) {
                                tampung = tampung + "Alergi : " + pengkajian[i].value + " kali/menit\n"
                            }
                        // }
                        if (pengkajian[i].emrdfk == 1259) {
                            tampung = tampung + "E : " + pengkajian[i].value + " \n"
                        }
                        if (pengkajian[i].emrdfk == 1502) {
                            tampung = tampung + "M : " + pengkajian[i].value + " \n"
                        }
                        if (pengkajian[i].emrdfk == 1503) {
                            tampung = tampung + "V : " + pengkajian[i].value + " \n"
                        }
                    }
                    $scope.data.names[index].o = $scope.data.names[index].o + tampung
                })
            }
            $scope.ambilPengkajianMedis = function(index) {
                $scope.dokter = false;
                medifirstService.get('emr/get-pengkajian-awal-medisD?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let tampungo = ''
                    let tampunga = ''
                    let tampungp = ''
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        if (pengkajianmedis[i].emrdfk == 1238) {
                            $scope.data.names[index].s = $scope.data.names[index].s + " Anamnesis Keluhan Utama " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1168) {
                            tampungo = tampungo + " Kesadaran : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2241) {
                            tampungp = tampungp + " E : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2242) {
                            tampungp = tampungp + " M : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2243) {
                            tampungp = tampungp + " V : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1169) {
                            tampungo = tampungo + " Tekanan Darah : " + pengkajianmedis[i].value + " mmHg " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1170) {
                            tampungo = tampungo + " Nadi : " + pengkajianmedis[i].value + " x/menit " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1171) {
                            tampungo = tampungo + " Suhu : " + pengkajianmedis[i].value + " °C " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1172) {
                            tampungo = tampungo + " Pernapasan : " + pengkajianmedis[i].value + " x/menit " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1173) {
                            tampungo = tampungo + " Keadaan Umum : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1174) {
                            tampungo = tampungo + " Tinggi Badan : " + pengkajianmedis[i].value + " cm " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1175) {
                            tampungo = tampungo + " Berat Badan : " + pengkajianmedis[i].value + " kg " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1245) {
                            tampungo = tampungo + " KEPALA DAN LEHER : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1246) {
                            tampungo = tampungo + " DADA DAN PUNGGUNG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1247) {
                            tampungo = tampungo + " PARU : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1248) {
                            tampungo = tampungo + " JANTUNG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1249) {
                            tampungo = tampungo + " PERUT DAN PINGGANG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1250) {
                            tampungo = tampungo + " ANGGOTA GERAK : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1251) {
                            tampungo = tampungo + " GENITALIA DAN ANUS : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1252) {
                            tampunga = tampunga + " DAFTAR MASALAH / DIAGNOSIS : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1253) {
                            tampunga = tampunga + " PENGKAJIAN MASALAH : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1254) {
                            tampungp = tampungp + " RENCANA PENATALAKSANAAN : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1255) {
                            tampungp = tampungp + " INSTRUKSI MEDIS : " + pengkajianmedis[i].value + "\n"
                        }
                    }
                    $scope.data.names[index].o = $scope.data.names[index].o + tampungo
                    $scope.data.names[index].a = $scope.data.names[index].a + tampunga
                    $scope.data.names[index].p = $scope.data.names[index].p + tampungp
                    tampungo = ''
                    tampunga = ''
                    tampungp = ''
                })
            }
            $scope.ambilDariMedisIgd = function(index) {
                $scope.igd = false;
                medifirstService.get('emr/get-pengkajian-awal-medis?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let tampungs = ''
                    let tampungo = ''
                    let tampunga = ''
                    let tampungp = ''
                    let pengkajianmedis = dat.data
                    pengkajianmedis.sort(function(a, b) {
                        if (a.nourut < b.nourut) { return -1; }
                        if (a.nourut > b.nourut) { return 1; }
                        return 0;
                    })
                    for(let i = 0; i < pengkajianmedis.length; i++) {
                        if (pengkajianmedis[i].emrdfk == 2408) {
                            tampungs = tampungs + " Anamnesis: " + pengkajianmedis[i].value
                        }
                        if (pengkajianmedis[i].emrdfk == 2409) {
                            tampungo = tampungo + " Tekanan Darah: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2410) {
                            tampungo = tampungo + " Pernapasan: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2411) {
                            tampungo = tampungo + " Suhu: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2412) {
                            tampungo = tampungo + " Nadi: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2413) {
                            tampungo = tampungo + " Spo2: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2414) {
                            tampungo = tampungo + " Kesadaran: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2415) {
                            tampungo = tampungo + " Keadaan Umum: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2416) {
                            tampungo = tampungo + " Berat Badan: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2417) {
                            tampungo = tampungo + " Tinggi Badan: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2418) {
                            let e = pengkajianmedis[i].value.split("~")
                            tampungo = tampungo + " E: " + e[1] + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2419) {
                            let m = pengkajianmedis[i].value.split("~")
                            tampungo = tampungo + " M: " + m[1] + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2420) {
                            let o = pengkajianmedis[i].value.split("~")
                            tampungo = tampungo + " V: " + o[1] + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2618) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Kepala : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2619) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Kepala : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2620) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2621) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Leher : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2622) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Leher : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2623) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2624) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Thorax : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2625) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Thorax : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2626) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2627) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Abdomen : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2628) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Abdomen : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2629) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2630) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Extremitas : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2631) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Extremitas : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2632) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2633) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Genitalia : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2634) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Genitalia : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2635) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2676) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Anus : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2677) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Anus : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2678) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2679) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Pemeriksaan Neurologis : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2680) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Pemeriksaan Neurologis : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 2681) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 3615) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Kulit : " + "Tidak Ada Kelainan" + "\n"
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 3616) {
                            if (pengkajianmedis[i].value == 1) {
                                tampungo = tampungo + " Kulit : " + "Ada Kelainan"
                                for (let j = 0; j < pengkajianmedis.length; j++) {
                                    if (pengkajianmedis[j].emrdfk == 3617) {
                                        tampungo = tampungo + pengkajianmedis[j].value + "\n"
                                    }
                                }
                            }
                        }
                        if (pengkajianmedis[i].emrdfk == 2425) {
                            tampunga = tampunga + " Daftar Masalah: " + pengkajianmedis[i].value + "\n"
                        }
                        // if (pengkajianmedis[i].emrdfk == 2426) {
                        //     tampunga = tampunga + " ICD 10: " + pengkajianmedis[i].value + "\n"
                        // }
                        if (pengkajianmedis[i].emrdfk == 2639) {
                            tampungp = tampungp + " Tatalaksana: " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2440) {
                            tampungp = tampungp + " Instruksi Rawat Inap: " + pengkajianmedis[i].value + "\n"
                        }
                    }
                    $scope.data.names[index].s = $scope.data.names[index].s + tampungs
                    $scope.data.names[index].o = $scope.data.names[index].o + tampungo
                    $scope.data.names[index].a = $scope.data.names[index].a + tampunga
                    $scope.data.names[index].p = $scope.data.names[index].p + tampungp
                    tampungs = ''
                    tampungo = ''
                    tampunga = ''
                    tampungp = ''
                })
            }
            //Order Radiologi
            $scope.riwayatRad = function () {
                 
                $scope.riwayatFormRad = true
                $scope.inputOrderRad = false;
                loadRiwayatRad($scope.cc.nocm)
            }
            $scope.paket2 = {}
            $scope.cekPaket2 = function (bool) {
                 
                if (bool) {
                    if ($scope.item.ruangantujuan2 == undefined) {
                        toastr.error('Pilih ruangan dulu')
                        return
                    }
                    $scope.popUpPaket2.center().open()
                    medifirstService.get('sysadmin/general/get-paket-tindakan?idRuangan=' + $scope.item.ruangantujuan2.id).then(function (e) {
                        $scope.sourcePaket2 = new kendo.data.DataSource({
                            data: e.data,
                            pageSize: 10,
                        });
                    })

                } else {

                }

            }
            $scope.optionsPaket2 = {
                // dataBound: function () {
                //     this.expandRow(this.tbody.find("tr.k-master-row"));
                // },
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "namapaket", title: "Nama Paket", width: 120, },
                    { field: "jml", title: "Jumlah Tindakan", width: 80 },
                ],
            };
            $scope.dataRad = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Nama Tindakan",
                            width: "300px"
                        }]
                };
            };
            $scope.tambahPaketRad = function () {
                 
             if ($scope.dataPaketSelect2 == undefined) {
                 toastr.error('Pilih Paket dulu')
                 return
             }

             var arr = $scope.dataPaketSelect2.details
             $scope.loading = true
             var arrobj = Object.keys($scope.item.layanan2)
             for (var i = 0; i < arr.length; i++) {
                 const element = arr[i];
                 if (arrobj.length > 0) {
                     for (let x = 0; x < arrobj.length; x++) {
                         const element = arrobj[x];
                         if (element != element.objectprodukfk)
                             $scope.item.layanan2[element.objectprodukfk] = true
                     }
                 } else {
                     $scope.item.layanan2[element.objectprodukfk] = true
                 }
             }
              
             $scope.loading = false
             $scope.popUpPaket2.close()
             toastr.success('Berhasil Tambah Paket')
             // $scope.batal()
         }
            $scope.showRad = function () {
                $scope.InputRadiologi = true
                $scope.PegawaiLogin3 = medifirstService.getPegawaiLogin()
                $rootScope.isShowRad = !$rootScope.isShowRad

                $scope.showNavigasiTree = false
                medifirstService.get("emr/get-combo-penunjang?departemenfk=27", true).then(function (dat) {
                     
                    $scope.item.ruanganAsal2 = $scope.cc.namaruangan
                    $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    $scope.item.ruangantujuan2 = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan,
                        ipaddress: dat.data.ruangantujuan[0].ipaddress != undefined ? dat.data.ruangantujuan[0].ipaddress : null
                    }
                    $scope.getProduk($scope.item.ruangantujuan2)
                    // // $scope.listLayanan = dat.data.produk;
                    // namaRuanganFk = dat.data.data[0].objectruanganfk
                    // norec_pd = dat.data.data[0].noregistrasifk
                });
                $scope.getProduk = function (ruangan) {
                      
                    $scope.listProdukCekRad = []
                    $scope.item.layanan2 = []
                    produkDef = []
                    medifirstService.get("sysadmin/general/get-tindakan-with-details?idRuangan="
                        + ruangan.id
                        + "&idKelas="
                        + $scope.cc.objectkelasfk
    
                        + "&idJenisPelayanan="
                        + jenisPelayananId
                        + "&isLabRad=true"
                        + "&departemenfk="
                        + $scope.cc.objectdepartemenfk)
                        .then(function (x) {
                            $scope.listProdukCekRad = x.data.details
                            produkDef = x.data.details
                            // $scope.listLayanan = x;
                            // $scope.item.layanan = '';
                            // $scope.item.hargaTindakan = '';
                            //    $scope.isRouteLoading = false;
    
                        })
                }
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2hasil?nocm=" +  $scope.cc.nocm + "&ruid=" + 576, true).then(function(dat) {
                    temphasil = dat.data;

                    medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2?nocm=" +  $scope.cc.nocm + "&ruid=" + 576
                        // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                        , true).then(function(dat) {
                             
                            if (dat.data.data.length > 0) {
                                $scope.item.tgllahir = dat.data.data[0].tgllahir
                                $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                            }
                            for (var i = 0; i < dat.data.data.length; i++) {
                                dat.data.data[i].no = i + 1
                                dat.data.data[i].statCheckbox = false;
                                //tanda trisno
                                for (var j = 0; j < temphasil.data.length; j++) {
                                    if (dat.data.data[i].norec_pp == temphasil.data[j].norec) {
                                        dat.data.data[i].flaglab = temphasil.data[j].flag;
                                        dat.data.data[i].tglcetak = temphasil.data[j].tglcetak;
                                        dat.data.data[i].tglhasil = temphasil.data[j].tglhasil;
                                        // dat.data.data[i].pp.data.tglcetak = temphasil.data[j].tglcetak;
                                        // dat.data.data[i].pp.data[0].tglcetak = temphasil.data[j].tglcetak;
                                    }
                                }

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

                             
                            $scope.dataGridRad = {
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

                            // $scope.popUpPelayanan.center().open();

                        },
                        function(error) {
                            $scope.isLoading = false;
                        });
                        loadRiwayatRad('NoCM=' + $scope.cc.nocm)

                        $scope.newOrderRad = function () {
                            $scope.riwayatFormRad = false
                            $scope.inputOrderRad = true;
                        }
                        function loadRiwayatRad(params) {
                            medifirstService.get('emr/get-riwayat-order-penunjang-rad?' + params).then(function (e) {
                                for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                                    e.data.daftar[i].no = i + 1
                                }
                                $scope.dataGridRiwayatRad = new kendo.data.DataSource({
                                    data: e.data.daftar,
                                    pageSize: 10
                                });
            
                            });
                        }
                        $scope.columnGridRiwayatRad = [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "20px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "70px",
                            },
                            {
                                "field": "tglorder",
                                "title": "Tgl Order",
                                "width": "50px",
                            },
                            {
                                "field": "noorder",
                                "title": "No Order",
                                "width": "60px",
                            },
                            {
                                "field": "dokter",
                                "title": "Dokter",
                                "width": "100px"
                            },
                            {
                                "field": "namaruanganasal",
                                "title": "Ruangan Asal",
                                "width": "100px",
                            },
                            {
                                "field": "namaruangantujuan",
                                "title": "Ruangan",
                                "width": "100px",
                            },
                        ];
                        $scope.detailGridOptionsRad = function (dataItem) {
                            return {
                                dataSource: new kendo.data.DataSource({
                                    data: dataItem.details
                                }),
                                columns: [
                                    {
                                        field: "namaproduk",
                                        title: "Deskripsi",
                                        width: "300px"
                                    },
                                    {
                                        field: "qtyproduk",
                                        title: "Qty",
                                        width: "100px"
                                    }]
                            };
                        };
                        $scope.columnGridRad = {
                            scrollable: true,
                            selectable: false,
                            pageable: true,
                            columns: [{
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "tglpelayanan",
                                    "title": "Tgl Pelayanan",
                                    "width": "90px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "ruangan",
                                    "title": "Ruangan",
                                    "width": "120px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "namaruanganasal",
                                    "title": "Ruangan Asal",
                                    "width": "120px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Layanan",
                                    "width": "160px",
                                    // "template": "<button class=\"k-button custom-button #=resumemedis != 'Belum diisi' ? 'dark-green' : 'dark-red' # \" ng-click=\"ResumeRI(dataItem)\" style=\"margin:0 5px 5px\">#:  resumemedis #</button>",
            
                                    "template": "<button class=\"k-button custom-button #=flaglab != 'N' ? 'dark-red' : 'dark-green' # \" ng-click=\"LihatEkpertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                                    //     attributes: {
                                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    //    },
                                },
                                {
                                    "field": "dokterpemeriksa",
                                    "title": "Dokter Pemeriksa",
                                    "width": "140px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "dokterpengirim",
                                    "title": "Dokter Pengririm",
                                    "width": "140px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "tglhasil",
                                    "title": "Tgl Hasil",
                                    "width": "90px",
                                },
                                {
                                    "field": "tglcetak",
                                    "title": "Tgl Cetak",
                                    "width": "90px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "40px",
                                },
                                {
                                    "field": "noorder",
                                    "title": "No Order",
                                    "width": "100px",
                                },
                                {
                                    "field": "nostruk",
                                    "title": "No Struk",
                                    "width": "80px"
                                },
                                {
                                    "field": "statusbridging",
                                    "title": "Status Kirim",
                                    "width": "50px",
                                },
                                {
                                    "field": "statusperiksa",
                                    "title": "Status Periksa",
                                    "width": "100px",
            
                                },
                                {
                                    "field": "statuscito",
                                    "title": "Status Cito",
                                    "width": "100px",
                                },
                                {
                                    "field": "nofoto",
                                    "title": "No Foto",
                                    "width": "100px",
                                },
                            ]
                        };
                        $scope.add = function () {
                            //    if ($scope.item.statusVerif == true) {
                            //           toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                            //           return;
                            //       }
                            if ($scope.isSelesaiPeriksa == true) {
                                toastr.error("Data Sudah Diclosing!");
                                return;
                            }
                            if ($scope.item.qty == 0) {
                                alert("Qty harus di isi!")
                                return;
                            }
                            if ($scope.item.ruangantujuan == undefined) {
                                alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                                return;
                            }
                            if ($scope.item.layanan == undefined) {
                                alert("Pilih Layanan terlebih dahulu!!")
                                return;
                            }
                            var nomor = 0
                            if ($scope.dataGridOrder == undefined) {
                                nomor = 1
                            } else {
                                nomor = data2.length + 1
                            }
                            var data = {};
                            if ($scope.item.no != undefined) {
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    if (data2[i].no == $scope.item.no) {
                                        data.no = $scope.item.no
                                        data.produkfk = $scope.item.layanan.id
                                        data.namaproduk = $scope.item.layanan.namaproduk
                                        data.qtyproduk = parseFloat($scope.item.qty)
                                        data.objectruanganfk = $scope.cc.objectruanganfk
                                        data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                                        // data.pemeriksaanluar = $scope.item.pemeriksaanKeluar === true ? 1 : 0
                                        data.iscito = $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false
                                        data.objectkelasfk = $scope.item.idKelas
                                        data.nourut = null
                                        data2[i] = data;
                                        $scope.dataGridOrder = new kendo.data.DataSource({
                                            data: data2
                                        });
                                    }
                                }
            
                            } else {
                                data = {
                                    no: nomor,
                                    produkfk: $scope.item.layanan.id,
                                    namaproduk: $scope.item.layanan.namaproduk,
                                    qtyproduk: parseFloat($scope.item.qty),
                                    objectruanganfk: $scope.cc.objectruanganfk,
                                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                                    // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                                    iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                                    objectkelasfk: $scope.cc.objectkelasfk,
                                    nourut: null,
                                }
                                data2.push(data)
                                // $scope.dataGrid.add($scope.dataSelected)
                                $scope.dataGridOrder = new kendo.data.DataSource({
                                    data: data2
                                });
                            }
                            $scope.batal();
                        }
                        $scope.batal = function () {
                            $scope.item.layanan = []
                            $scope.item.hargaTindakan = ''
                            $scope.item.qty = 1
                            $scope.item.no = undefined
                        }
                        $scope.BatalOrder = function () {
                            data2 = []
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.item.layanan = []
                            delete $scope.item.keterangan
                            $scope.CmdOrderPelayanan = true;
                            $scope.OrderPelayanan = false;
                        }
                })
            // }
            }
            $scope.SimpanRad = function () {
                 //
                 let haha = ""
                // if( $scope.statusstruk = true){
                //      alert("Data sudah di closing!!")
                //     return
                // }
                   if ($scope.item.statusVerif == true) {
                          toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                          return;
                      }
                if ($scope.item.ruangantujuan2 == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if ($scope.item.tglPelayanan2 == undefined) {
                    alert("Pilih Tgl Order  terlebih dahulu!!")
                    return
                }
                if ($scope.item.layanan2 == undefined || $scope.item.layanan2.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                var arrobj = Object.keys($scope.item.layanan2)
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.layanan2[parseInt(arrobj[i])] == true) {
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: $scope.cc.objectruanganfk,
                            objectruangantujuanfk: $scope.item.ruangantujuan2.id,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: $scope.item.iscitoRad != undefined && $scope.item.iscitoRad == true ? $scope.item.iscitoRad : false,
                            objectkelasfk: $scope.cc.objectkelasfk,
                            nourut: null,
                        }
                        haha = haha + "," + parseInt(arrobj[i])
                        data2.push(data)
                    }
                }

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: $scope.cc.objectruanganfk,
                    objectruangantujuanfk: $scope.item.ruangantujuan2.id,
                    departemenfk: 27,
                    pegawaiorderfk: $scope.PegawaiLogin3.id,
                    keterangan: $scope.item.keteranganRad != undefined ? $scope.item.keteranganRad : null,
                    iscito: $scope.item.iscitoRad != undefined && $scope.item.iscitoRad == true ? $scope.item.iscitoRad : false,
                    details: data2,
                }

                $scope.isSimpan = true
                medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                    if (e.data.status == 201) {
                        $rootScope.isShowRad = !$rootScope.isShowRad
                        medifirstService.get('emr/get-tindakan-for-cppt?idProduk=' + haha).then(function(a) {
                            let namaproduk = ""
                            //
                            for(let i = 0; i < a.data.length; i++) {
                                if(a.data[i].namaproduk != null) { //ash 2023-09-05
                                    namaproduk = namaproduk + " RAD : " + a.data[i].namaproduk + "\n"
                                }
                            }
                            $scope.data.names[0].p = $scope.data.names[0].p + namaproduk
                        })
                    }
                    // $sco
                    $scope.item.layanan = []
                    $scope.isSimpan = false
                    medifirstService.postLogging('Order Radiologi', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Radiologi No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                    })
                    /*
                    call notif ds
                    */
                    // var noorder = e.data.strukorder.noorder
                    // var tglorder = e.data.strukorder.tglorder
                    // tglorder = tglorder.replace(' ', '%20');
                    // var namaPasien = $scope.item.namaPasien
                    // namaPasien = namaPasien.replace(' ', '%20');

                    // if ($scope.item.ruangantujuan != undefined) {
                    //     if ($scope.item.ruangantujuan.ipaddress) {
                    //         var ip = $scope.item.ruangantujuan.ipaddress.split(',')
                    //         if (ip.length > 0) {
                    //             for (var i = 0; i < ip.length; i++) {
                    //                 const ips = ip[i]
                    //                 if (ips == null) return

                    //                 var client = new HttpClient();
                    //                 client.get('http://' + ips + ':3385/epicnotif/bewara?add-notif=1&noorder=' +
                    //                     noorder + '&tglorder=' + tglorder + '&noregistrasi=' + $scope.item.noregistrasi
                    //                     + '&nocm=' + $scope.item.noMr + '&namapasien=' + namaPasien
                    //                     + '&namaruangan=' + $scope.item.ruangantujuan.namaruangan
                    //                     , function (s) { });

                    //             }
                    //         }
                    //     }
                    // }

                    // init();
                    // loadOrderPenunjang()
                    $scope.BatalOrder();


                })
            }
            //end order radiologi
            //Order Lab
            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
                loadRiwayat($scope.cc.nocm)
            }
            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
            }
            function loadRiwayat(params) {
                medifirstService.get('emr/get-riwayat-order-penunjang?NoCM=' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });
                })
            }
            
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
            ];
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };
            $scope.paket = {}
            $scope.cekPaket = function (bool) {
                 
                if (bool) {
                    if ($scope.item.ruangantujuan == undefined) {
                        toastr.error('Pilih ruangan dulu')
                        return
                    }
                    $scope.popUpPaket.center().open()
                    medifirstService.get('sysadmin/general/get-paket-tindakan?idRuangan=' + $scope.item.ruangantujuan.id).then(function (e) {
                        $scope.sourcePaket = new kendo.data.DataSource({
                            data: e.data,
                            pageSize: 10,
                        });
                    })

                } else {

                }

            }
            $scope.optionsPaket = {
                // dataBound: function () {
                //     this.expandRow(this.tbody.find("tr.k-master-row"));
                // },
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "namapaket", title: "Nama Paket", width: 120, },
                    { field: "jml", title: "Jumlah Tindakan", width: 80 },
                ],
            };
            $scope.dataLab = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Nama Tindakan",
                            width: "300px"
                        }]
                };
            };
            $scope.showLab = function () {
                $scope.InputLab = true
                $rootScope.isShowLab = !$rootScope.isShowLab

                $scope.showNavigasiTree = false

                medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                        $scope.cc.noregistrasi, true).then(function (dat) {
                            // $scope.item.statusVerif = dat.data.status
                        });
                        //  ** cek status closing
                        medifirstService.get("sysadmin/general/get-status-close/" + $scope.cc.noregistrasi, false).then(function (rese) {
                            if (rese.data.status == true) {
                                toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                                $scope.isSelesaiPeriksa = true
                                 $scope.statusstruk = true;
                            }
                        })
                        medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + $scope.cc.norec_pd).then(function (e) {
                            jenisPelayananId = e.data.jenispelayanan
                            // init()
                        })
                        var urlHasilVansLab = ''
                        medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                            urlHasilVansLab = dat.data
            
                        })
                        medifirstService.get("emr/get-combo-penunjang?departemenfk=3", true).then(function (dat) {
                             
                            $scope.item.ruanganAsal = $scope.cc.namaruangan
                            $scope.listRuanganTujuan = dat.data.ruangantujuan;
                            $scope.item.ruangantujuan = {
                                id: dat.data.ruangantujuan[0].id,
                                namaruangan: dat.data.ruangantujuan[0].namaruangan,
                                ipaddress: dat.data.ruangantujuan[0].ipaddress != undefined ? dat.data.ruangantujuan[1].ipaddress : null
                            }
                            $scope.getProduk($scope.item.ruangantujuan)
                            // // $scope.listLayanan = dat.data.produk;
                            // namaRuanganFk = dat.data.data[0].objectruanganfk
                            // norec_pd = dat.data.data[0].noregistrasifk
                        });
                        var data2 = [];
                        // $scope.PegawaiLogin2 = {};
                        // var namaRuangan = ''
                        // var namaRuanganFk = ''
                        $scope.listProdukCek = []
                        $scope.getProduk = function (ruangan) {
                              
                            $scope.listProdukCek = []
                            $scope.item.layanan = []
                            produkDef = []
                            medifirstService.get("sysadmin/general/get-tindakan-with-details?idRuangan="
                                + ruangan.id
                                + "&idKelas="
                                + $scope.cc.objectkelasfk
            
                                + "&idJenisPelayanan="
                                + jenisPelayananId
                                + "&isLabRad=true"
                                + "&departemenfk="
                                + $scope.cc.objectdepartemenfk)
                                .then(function (x) {
                                    $scope.listProdukCek = x.data.details
                                    produkDef = x.data.details
                                    // $scope.listLayanan = x;
                                    // $scope.item.layanan = '';
                                    // $scope.item.hargaTindakan = '';
                                    //    $scope.isRouteLoading = false;
            
                                })
                        }
                        $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                })
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                // });

                if ($scope.header.DataNoregis == true) {
                    loadRiwayat('noregistrasi=' + $scope.cc.noregistrasi)

                } else {
                    loadRiwayat('NoCM=' + $scope.cc.nocm)

                }
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()

                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2hasil?nocm=" +  $scope.cc.nocm + "&ruid=" + 575, true).then(function(dat) {
                    temphasil = dat.data;

                    medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2?nocm=" +  $scope.cc.nocm + "&ruid=" + 575
                        // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                        , true).then(function(dat) {
                             
                            if (dat.data.data.length > 0) {
                                $scope.item.tgllahir = dat.data.data[0].tgllahir
                                $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                            }
                            for (var i = 0; i < dat.data.data.length; i++) {
                                dat.data.data[i].no = i + 1
                                dat.data.data[i].statCheckbox = false;
                                //tanda trisno
                                for (var j = 0; j < temphasil.data.length; j++) {
                                    if (dat.data.data[i].norec_pp == temphasil.data[j].norec) {
                                        dat.data.data[i].flaglab = temphasil.data[j].flag;
                                        dat.data.data[i].tglcetak = temphasil.data[j].tglcetak;
                                        dat.data.data[i].tglhasil = temphasil.data[j].tglhasil;
                                        // dat.data.data[i].pp.data.tglcetak = temphasil.data[j].tglcetak;
                                        // dat.data.data[i].pp.data[0].tglcetak = temphasil.data[j].tglcetak;
                                    }
                                }

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

                             
                            $scope.dataGridLab = {
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

                            // $scope.popUpPelayanan.center().open();

                        },
                        function(error) {
                            $scope.isLoading = false;
                        });
                        loadRiwayat('NoCM=' + $scope.cc.nocm)

                        function loadRiwayat(params) {
                            medifirstService.get('emr/get-riwayat-order-penunjang?' + params).then(function (e) {
                                for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                                    e.data.daftar[i].no = i + 1
                                }
                                $scope.dataGridRiwayat = new kendo.data.DataSource({
                                    data: e.data.daftar,
                                    pageSize: 10
                                });
            
                            });
                        }
                        $scope.columnGridLab = {
                            scrollable: true,
                            selectable: false,
                            pageable: true,
                            columns: [{
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "tglpelayanan",
                                    "title": "Tgl Pelayanan",
                                    "width": "90px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "ruangan",
                                    "title": "Ruangan",
                                    "width": "120px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "namaruanganasal",
                                    "title": "Ruangan Asal",
                                    "width": "120px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Layanan",
                                    "width": "160px",
                                    // "template": "<button class=\"k-button custom-button #=resumemedis != 'Belum diisi' ? 'dark-green' : 'dark-red' # \" ng-click=\"ResumeRI(dataItem)\" style=\"margin:0 5px 5px\">#:  resumemedis #</button>",
            
                                    "template": "<button class=\"k-button custom-button #=flaglab != 'N' ? 'dark-red' : 'dark-green' # \" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                                    //     attributes: {
                                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    //    },
                                },
                                {
                                    "field": "dokterpemeriksa",
                                    "title": "Dokter Pemeriksa",
                                    "width": "140px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "dokterpengirim",
                                    "title": "Dokter Pengririm",
                                    "width": "140px",
                                    // attributes: {
                                    //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                                    // },
                                },
                                {
                                    "field": "tglhasil",
                                    "title": "Tgl Hasil",
                                    "width": "90px",
                                },
                                {
                                    "field": "tglcetak",
                                    "title": "Tgl Cetak",
                                    "width": "90px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "40px",
                                },
                                {
                                    "field": "noorder",
                                    "title": "No Order",
                                    "width": "100px",
                                },
                                {
                                    "field": "nostruk",
                                    "title": "No Struk",
                                    "width": "80px"
                                },
                                {
                                    "field": "statusbridging",
                                    "title": "Status Kirim",
                                    "width": "50px",
                                },
                                {
                                    "field": "statusperiksa",
                                    "title": "Status Periksa",
                                    "width": "100px",
            
                                },
                                {
                                    "field": "statuscito",
                                    "title": "Status Cito",
                                    "width": "100px",
                                },
                                {
                                    "field": "nofoto",
                                    "title": "No Foto",
                                    "width": "100px",
                                },
                            ]
                        };
                        $scope.add = function () {
                            //    if ($scope.item.statusVerif == true) {
                            //           toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                            //           return;
                            //       }
                            if ($scope.isSelesaiPeriksa == true) {
                                toastr.error("Data Sudah Diclosing!");
                                return;
                            }
                            if ($scope.item.qty == 0) {
                                alert("Qty harus di isi!")
                                return;
                            }
                            if ($scope.item.ruangantujuan == undefined) {
                                alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                                return;
                            }
                            if ($scope.item.layanan == undefined) {
                                alert("Pilih Layanan terlebih dahulu!!")
                                return;
                            }
                            var nomor = 0
                            if ($scope.dataGridOrder == undefined) {
                                nomor = 1
                            } else {
                                nomor = data2.length + 1
                            }
                            var data = {};
                            if ($scope.item.no != undefined) {
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    if (data2[i].no == $scope.item.no) {
                                        data.no = $scope.item.no
                                        data.produkfk = $scope.item.layanan.id
                                        data.namaproduk = $scope.item.layanan.namaproduk
                                        data.qtyproduk = parseFloat($scope.item.qty)
                                        data.objectruanganfk = $scope.cc.objectruanganfk
                                        data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                                        // data.pemeriksaanluar = $scope.item.pemeriksaanKeluar === true ? 1 : 0
                                        data.iscito = $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false
                                        data.objectkelasfk = $scope.item.idKelas
                                        data.nourut = null
                                        data2[i] = data;
                                        $scope.dataGridOrder = new kendo.data.DataSource({
                                            data: data2
                                        });
                                    }
                                }
            
                            } else {
                                data = {
                                    no: nomor,
                                    produkfk: $scope.item.layanan.id,
                                    namaproduk: $scope.item.layanan.namaproduk,
                                    qtyproduk: parseFloat($scope.item.qty),
                                    objectruanganfk: $scope.cc.objectruanganfk,
                                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                                    // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                                    iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                                    objectkelasfk: $scope.cc.objectkelasfk,
                                    nourut: null,
                                }
                                data2.push(data)
                                // $scope.dataGrid.add($scope.dataSelected)
                                $scope.dataGridOrder = new kendo.data.DataSource({
                                    data: data2
                                });
                            }
                            $scope.batal();
                        }
                        $scope.batal = function () {
                            $scope.item.layanan = []
                            $scope.item.hargaTindakan = ''
                            $scope.item.qty = 1
                            $scope.item.no = undefined
                        }
                        $scope.BatalOrder = function () {
                            data2 = []
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.item.layanan = []
                            delete $scope.item.keterangan
                            $scope.CmdOrderPelayanan = true;
                            $scope.OrderPelayanan = false;
                        }
                })
            }
            $scope.SimpanLab = function () {
                 
                // if( $scope.statusstruk = true){
                //      alert("Data sudah di closing!!")
                //     return
                // }
                   if ($scope.item.statusVerif == true) {
                          toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                          return;
                      }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if ($scope.item.tglPelayanan == undefined) {
                    alert("Pilih Tgl Order  terlebih dahulu!!")
                    return
                }
                if ($scope.item.layanan == undefined || $scope.item.layanan.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                let haha = "";
                var arrobj = Object.keys($scope.item.layanan)
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.layanan[parseInt(arrobj[i])] == true) {
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: $scope.cc.objectruanganfk,
                            objectruangantujuanfk: $scope.item.ruangantujuan.id,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                            objectkelasfk: $scope.cc.objectkelasfk,
                            nourut: null,
                        }
                        haha = haha + "," + parseInt(arrobj[i])
                        data2.push(data)
                    }
                }
                haha = haha.slice(1, haha.length)

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: $scope.cc.objectruanganfk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    departemenfk: 3,
                    pegawaiorderfk: $scope.PegawaiLogin2.id,
                    keterangan: $scope.item.keterangan != undefined ? $scope.item.keterangan : null,
                    iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                    details: data2,
                }

                $scope.isSimpan = true
                medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                    if (e.data.status == 201) {
                        $rootScope.isShowLab = !$rootScope.isShowLab
                        medifirstService.get('emr/get-tindakan-for-cppt?idProduk=' + haha).then(function(a) {
                            let namaproduk = ""
                            //
                            for(let i = 0; i < a.data.length; i++) {
                                
                                if(a.data[i].namaproduk != null) { //ash 2023-09-05
                                namaproduk = namaproduk + " LAB : " + a.data[i].namaproduk + "\n"
                                }
                            }
                            $scope.data.names[0].p = $scope.data.names[0].p + namaproduk
                        })
                    }
                    $scope.item.layanan = []
                    $scope.isSimpan = false
                    medifirstService.postLogging('Order Laboratorium', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Laboratorium No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                    })
                    /*
                    call notif ds
                    */
                    // var noorder = e.data.strukorder.noorder
                    // var tglorder = e.data.strukorder.tglorder
                    // tglorder = tglorder.replace(' ', '%20');
                    // var namaPasien = $scope.item.namaPasien
                    // namaPasien = namaPasien.replace(' ', '%20');

                    // if ($scope.item.ruangantujuan != undefined) {
                    //     if ($scope.item.ruangantujuan.ipaddress) {
                    //         var ip = $scope.item.ruangantujuan.ipaddress.split(',')
                    //         if (ip.length > 0) {
                    //             for (var i = 0; i < ip.length; i++) {
                    //                 const ips = ip[i]
                    //                 if (ips == null) return

                    //                 var client = new HttpClient();
                    //                 client.get('http://' + ips + ':3385/epicnotif/bewara?add-notif=1&noorder=' +
                    //                     noorder + '&tglorder=' + tglorder + '&noregistrasi=' + $scope.item.noregistrasi
                    //                     + '&nocm=' + $scope.item.noMr + '&namapasien=' + namaPasien
                    //                     + '&namaruangan=' + $scope.item.ruangantujuan.namaruangan
                    //                     , function (s) { });

                    //             }
                    //         }
                    //     }
                    // }

                    // init();
                    // loadOrderPenunjang()
                    $scope.BatalOrder();


                })
            }
            $scope.CetakLabKlinikLangsung = function(dataItem) {
                           var user = medifirstService.getPegawaiLogin();
                           var diagnosa = "";
                           medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function(data) {
                               if (data.data.datas == undefined) {
                                   diagnosa = "-";
                               } else {
                                   if (data.data.datas[0].namadiagnosa != null) {
                                       diagnosa = data.data.datas[0].namadiagnosa;
                                   } else {
                                       diagnosa = "-";
                                   }
                               }
                           });
           
                           if (dataItem.tglhasil == null) {
                               alert("Hasil Tidak Ditersedia.");
                               return;
                           } else {
                               var umurDay = dataItem.umur
                               var tglpelayanan = dataItem.tglpelayanan
                               var tglhasil = dataItem.tglhasil
                               var tglcetak = dataItem.tglcetak
                               var norecPP = "'" + dataItem.norec_pp + "'"
                               var norecAPD = dataItem.norec_apd
                               var ruangan = dataItem.ruangan
                               var ruanganasal = dataItem.namaruanganasal
                               var dokterpemeriksa = dataItem.dokterpemeriksa
                               var dokterpengirim = dataItem.dokterpengirim
                               var norec_pp = ''
                               $scope.item.norec_pp = dataItem.norec_pp;
                               norec_pp = "'" + dataItem.norec_pp + "'"
           
                               var catatan = "-";
                               if ($scope.item.catatan != undefined) {
                                   catatan = $scope.item.catatan;
                               }
                               umurDay = parseInt(umurDay);
                               var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                               var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noReg
                               var data = {
                                   "gambarLogo": "logodokkes.jpg",
                                   "paramKey": ["namaRS","namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "tglpengambilan", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                                   "paramValue": ["PUSAT KEDOKTERAN DAN KESEHATAN POLRI","RUMAH SAKIT BHAYANGKARA TK.I R. SAID SUKANTO", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jalan Parit Haji Husin 1 Blok MD No. 1 Telp: 0561- 5688558", user.namaLengkap,
                                       x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, tglpelayanan, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                                   ],
                                   "paramType": ["","", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                               };
                               var xhr = new XMLHttpRequest();
                               xhr.onreadystatechange = function() {
                                   if (this.readyState == 4 && this.status == 200) {
                                       console.log(this.response, typeof this.response);
                                       ;
                                       var url = window.URL.createObjectURL(this.response)
                                       var pdf = document.getElementById('tempatLaporan');
                                       pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                       var win = window.open(url, '_blank');
                                       win.focus();
                                   }
                               }
                            if (window.location.hostname.indexOf('172.20.21.223') > -1) {
                                xhr.open('POST', 'http://172.20.21.223:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                                xhr.open('POST', 'http://10.5.1.2:1003/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                                xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinik.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                            }
                            //xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                               // set `Content-Type` header
                               xhr.setRequestHeader('Content-Type', 'application/json');
                               xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                               xhr.responseType = 'blob';
                               // send rquest with JSON payload
                               xhr.send(JSON.stringify(data));
                           }
                       }
            
                       $scope.tambahPaketLab = function () {
                            
                        if ($scope.dataPaketSelect == undefined) {
                            toastr.error('Pilih Paket dulu')
                            return
                        }
        
                        var arr = $scope.dataPaketSelect.details
                        $scope.loading = true
                        var arrobj = Object.keys($scope.item.layanan)
                        for (var i = 0; i < arr.length; i++) {
                            const element = arr[i];
                            if (arrobj.length > 0) {
                                for (let x = 0; x < arrobj.length; x++) {
                                    const element = arrobj[x];
                                    if (element != element.objectprodukfk)
                                        $scope.item.layanan[element.objectprodukfk] = true
                                }
                            } else {
                                $scope.item.layanan[element.objectprodukfk] = true
                            }
                        }
                         
                        $scope.loading = false
                        $scope.popUpPaket.close()
                        toastr.success('Berhasil Tambah Paket')
                        // $scope.batal()
                    }
            // end order lab
            // order resep
                // $scope.listDataSigna = [
                //     {
                //         "id": 1,
                //         "nama": "Aturan Pakai",
                //         "detail": [
                //             { "id": 1, "nama": "Pagi", 'isChecked': sp },
                //             { "id": 2, "nama": "Siang", 'isChecked': ss },
                //             { "id": 3, "nama": "Sore", 'isChecked': sr },
                //             { "id": 4, "nama": "Malam", 'isChecked': sm }
                //         ]
                //     }
                // ];
            // $scope.showRE = function () {
            //     $scope.PegawaiLogin3 = medifirstService.getPegawaiLogin()
            //     $rootScope.isShowRE = !$rootScope.isShowRE
            //     medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
            //         var tgltgltgltgl = dat.data.mindate[0].max
            //         var tglkpnaja = dat.data.datedate
            //         $scope.minDate = new Date(tgltgltgltgl);
            //         $scope.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1))//new Date($scope.now);
            //         $scope.startDateOptions = {
            //             disableDates: function (date) {
            //                 var disabled = tglkpnaja;
            //                 if (date && disabled.indexOf(date.getDate()) > -1) {
            //                     return true;
            //                 } else {
            //                     return false;
            //                 }
            //             }
            //         };
            //     });
            //     medifirstService.getPart('emr/get-pegawai-parts', true, 10).then(function (e) {
            //         $scope.listPenulisResep = e
            //         // $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
            //     })
            //     medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
            //         $scope.listRuangan = dat.data.ruanganfarmasi;
            //         $scope.listJenisRacikan = dat.data.jenisracikan;
            //         $scope.listProduk = dat.data.produk;
            //         $scope.listAturanPakai = dat.data.signa;
            //         $scope.listsediaanobat = dat.data.sediaanobat;
            //         $scope.listwaktuminum = dat.data.waktuminum;
            //         //
            //         if ($scope.cc.objectrekananfk == 581368) {
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[6];
                     
            //             //581367= bpjs non pol 581669= non pol pbi  581673= non pol pbi scr
            //         } else if($scope.cc.objectrekananfk == 581367 || $scope.cc.objectrekananfk == 581669 || $scope.cc.objectrekananfk == 581673){
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[3];

            //             //581724 = swasta atau poli swasta  
            //         }  else if($scope.cc.objectrekananfk == 581724){
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[8];

            //             //ini kalo diluar pol dan non pol masuknya kesini yaaa  
            //         }else {
            //             $scope.item.ruangan = dat.data.ruanganfarmasi[4];
            //         }
            //         $scope.item.jenisKemasan = dat.data.jeniskemasan[1];
            //     })
            //     $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
            //         if (newValue != oldValue) {
            //             if (newValue == 'Racikan') {
            //                 $scope.showRacikanDose = true
            //             } else {
            //                 $scope.showRacikanDose = false
            //             }
            //         }
            //     });
            //     $scope.getSatuan = function () {
            //         medifirstService.get("emr/get-info-stok?produkfk=" + $scope.item.produk.id, true)
            //             .then(function (e) {
            //                 //
            //                 //penjgaan stok
            //                 // if ($scope.item.stok=0) {
            //                 //     alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
            //                 //     return;
            //                 // }
    
            //                 $scope.item.namaProduks = $scope.item.produk.namaproduk;
            //                 //penjgaan stok
            //                 // for (var i = 0; i < e.data.infostok.length; i++) {
            //                 //     e.data.infostok[i].no = i + 1
            //                 // }
            //                 // if ($scope.item.stok < $scope.item.jumlah) {
            //                 //     alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
            //                 //     return;
            //                 // }
                            
            //                 $scope.dataGridStok = new kendo.data.DataSource({
            //                     data: e.data.infostok,
            //                     pageable: true,
            //                     pageSize: 5,
            //                     total: e.data.infostok.length,
            //                     serverPaging: false,
            //                     schema: {
            //                         model: {
            //                             fields: {
            //                             }
            //                         }
            //                     }
            //                 })
            //                 // if ($scope.item.stok < $scope.item.jumlah) {
            //                 //     toastr.warning('tes!');
            //                 //     return;
                            
            //                 // }
            //             })
            //         // ////
            //         // if ($scope.item.stok < $scope.item.jumlah) {
            //         //     toastr.warning('tes!');
            //         //     return;
                    
            //         // }
                    
    
            //         GETKONVERSI()
            //         cekObatPsikotropika()
    
            //     }
            //     function GETKONVERSI() {
            //         //
            //         $scope.listSatuan = $scope.item.produk.konversisatuan
            //         if ($scope.listSatuan.length == 0) {
            //             $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
            //         }
            //         $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
            //         $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
            //         if ($scope.item.ruangan == undefined) {
            //             //alert("Pilih Ruangan terlebih dahulu!!")
            //             return;
            //         }
            //         // if ($scope.item.asal == undefined) {
            //         //     //alert("Pilih asal terlebih dahulu!!")
            //         //     return;
            //         // }
            //         // if ($scope.item.stok < $scope.item.jumlah) {
            //         //             alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
            //         //             return;
            //         //         }
            //         statusTambah = false
            //         $scope.isRouteLoading = false;
            //         medifirstService.get("farmasi/get-produkdetail?" +
            //             "produkfk=" + $scope.item.produk.id +
            //             "&ruanganfk=" + $scope.item.ruangan.id +
            //             "&kelompokpasien=" + $scope.item.kdKelompokPasien, true).then(function (dat) {
            //                 $scope.isRouteLoading = false;
            //                 dataProdukDetail = dat.data.detail;
            //                 $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
            //                 // $scope.item.stok = dat.data.jmlstok
            //                 $scope.item.kekuatan = dat.data.kekuatan
            //                 $scope.item.sediaan = dat.data.sediaan
    
            //                 // $scope.item.dosis =$scope.dataSelected.dosis
            //                 // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
            //                 if ($scope.dataSelected != undefined) {
            //                     $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
            //                     // $scope.item.satuan = {ssid:$scope.dataSelected.satuanstandarfk,satuanstandar:$scope.dataSelected.satuanstandar}
            //                     $scope.item.stok = $scope.dataSelected.jmlstok //* $scope.item.nilaiKonversi 
            //                     $scope.item.jumlah = $scope.dataSelected.jumlah
            //                     $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
            //                     // $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
            //                     $scope.item.total = $scope.dataSelected.total
            //                     if ($scope.item.kekuatan != undefined && $scope.item.kekuatan != 0) {
            //                         $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
            //                     }
            //                 }
            //                 statusTambah = true
            //                 gettotal();
            //             });
            //             function gettotal() {
            
            //                 //penjgaan stok
            //                 // if ($scope.item.stok == 0) {
            //                 //     $scope.item.jumlah = 1
            //                 //     //alert('Stok kosong')
            
            //                 //     return;
            //                 // }
            
            //                 // var tarifJasa = 0
            //                 // var qty20 = 0
            //                 // if ($scope.item.jenisKemasan.id == 2) {
            //                 //     tarifJasa = 800
            //                 // }
            //                 // if ($scope.item.jenisKemasan.id == 1) {
            //                 //     qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
            //                 //     if (parseFloat($scope.item.jumlah) % 20 == 0) {
            //                 //         qty20 = qty20 
            //                 //     }else{
            //                 //         qty20 = qty20 + 1
            //                 //     }
            
            //                 //     tarifJasa = 800 * qty20
            //                 // }
            
            //                 // var ada = false;
            //                 ////
            //                 for (var i = 0; i < dataProdukDetail.length; i++) {
            //                     // ada = false
            //                     // if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
            //                     if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi))) {
            //                         hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
            //                         $scope.item.hargaSatuan = parseFloat(hrg1)
            //                         $scope.item.total = parseFloat((parseFloat($scope.item.jumlah) * (hrg1)))//+tarifJasa
            //                         noTerima = dataProdukDetail[i].norec
            //                         // ada = true;
            //                         break;
            //                     }
            //                 }
            //                 // if (ada == false) {
            //                 //     $scope.item.hargaSatuan = 0
            //                 //     $scope.item.total = 0
            
            //                 //     noTerima = ''
            //                 // }
            //                 // if ($scope.item.jumlah == 0) {
            //                 //     $scope.item.hargaSatuan = 0
            //                 // }
            //                 // if ($scope.item.stok > 0) {
            //                 //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
            //                 // }
            //             }
            //     }
            //     function cekObatPsikotropika() {
            //         medifirstService.get("farmasi/cek-obat-psikotropika?idproduk=" + $scope.item.produk.id, true)
            //             .then(function (e) {
            //                 var datas = e.data.data
            //                 if (datas.ispsikotropika == 1) {
            //                     toastr.info(datas.namaproduk + ' Obat Psikotropika')
            //                     $scope.item.caraAmbil = { "id": 1, "caraambil": "Diambil Sendiri" }
            //                     $scope.disabledCaraAmbil = true
            //                 }
            //                 if (datas.isnarkotika == 1) {
            //                     toastr.info(datas.namaproduk + ' Obat Narkotika')
            //                     $scope.item.caraAmbil = { "id": 1, "caraambil": "Diambil Sendiri" }
            //                     $scope.disabledCaraAmbil = true
            //                 }
            //             })
            //     }
            // }
            $scope.simpanIcd10 = function(index) {
                 
                if ($scope.data.names[index].jenisDiagnosa.id == 1) {
                    if (isPrimary == true) {
                        alert('Diagnosa Primary hanya bisa diisi 1 kali atau diagnosa primary sudah diisi sebelumnya !')
                        return
                    }
                }
                $scope.saveIcd10Button = false
                let norec_diagnosapasien = "";
                let keterangan = ""
                let haha = " ICD 10 : " + $scope.data.names[index].jenisDiagnosa.jenisdiagnosa + " - " + $scope.data.names[index].diagnosa10.kodeNama

                var data = {
                    norec_dp: norec_diagnosapasien,
                    noregistrasifk: $scope.cc.norec,
                    tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectdiagnosafk: $scope.data.names[index].diagnosa10.id,
                    objectjenisdiagnosafk: $scope.data.names[index].jenisDiagnosa.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    keterangan: keterangan,
                    kasusbaru: $scope.data.names[index].kasusbaru,
                    kasuslama: $scope.data.names[index].kasuslama
                }
                let objSave = {
                    detaildiagnosapasien: data
                }
                medifirstService.post('emr/save-diagnosa-pasien', objSave).then(function(e) {
                    // loadIcd10()
                $scope.saveIcd10Button = true
                    if (e.data.status == 201) {
                        $scope.data.names[index].a = $scope.data.names[index].a + haha + "\n"
                        
                    }
                })
            }
            function loadIcd10() {
                medifirstService.get('emr/get-diagnosapasienbynoreg?noReg=' + $scope.cc.noregistrasi).then(function(dat) {
                     
                    let hasil = $scope.data.names[0].a;
                    if (dat.data.datas.length > 0) {
                        for(let i = 0; i < dat.data.datas.length; i++) {
                            hasil = hasil + " ICD 10 : " + dat.data.datas[i].jenisdiagnosa + " - " + dat.data.datas[i].kodeexternal + " - " + dat.data.datas[i].namadiagnosa + "\n"
                            if (dat.data.datas[i].objectjenisdiagnosafk == 1) {
                                isPrimary = true
                            }
                        }
                        if ($scope.item.idRuangan == 580) {
                           $scope.data.names[0].a = hasil
                        }
                    }
                })
            }
            $scope.simpanIcd9 = function(index) {
                let norec_diagnosapasien = "";
                let keterangan = ""
                let haha = " ICD 9 : " + $scope.data.names[index].diagnosa9.kodeNama
                let data = {
                    norec_dp: norec_diagnosapasien,
                    objectpasienfk: $scope.cc.norec,
                    tglpendaftaran: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectdiagnosatindakanfk: $scope.data.names[index].diagnosa9.id,
                    keterangantindakan: keterangan
                }
                let objSave = {
                    detaildiagnosatindakanpasien: data
                }
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', objSave).then(function(e) {
                    // loadIcd9()
                    if (e.data.status == 201) {
                        $scope.data.names[index].p = $scope.data.names[index].p + haha + "\n"
                    }
                })
            }
            function loadIcd9() {
                medifirstService.get('emr/get-diagnosapasienbynoregicd9?noReg=' + $scope.cc.noregistrasi).then(function(dat) {
                     
                    let hasil = $scope.data.names[0].p;
                    if (dat.data.datas.length > 0) {
                        for(let i = 0; i < dat.data.datas.length; i++ ) {
                            hasil = hasil + " ICD 9 : " + dat.data.datas[i].kddiagnosatindakan + " - " + dat.data.datas[i].namadiagnosatindakan + "\n"
                        } 
                        $scope.data.names[0].p = hasil;
                    }
                })
            }

            function cekVitalSign() {
                medifirstService.get('emr/get-vital-sign-kebidanan?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let tampungo = $scope.data.names[0].o + "\n";
                    let pengkajianmedis = dat.data
                    if (pengkajianmedis.length > 0) {
                        
                         
                        for (let i = 0; i < pengkajianmedis.length; i++) {
                             
                            if (pengkajianmedis[i].emrdfk == 1168) {
                                 
                                tampungo = tampungo + " Kesadaran : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1169) {
                                tampungo = tampungo + " Tekanan Darah : " + pengkajianmedis[i].value + " mmHg " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1170) {
                                tampungo = tampungo + " Nadi : " + pengkajianmedis[i].value + " x/menit " + "\n"
                            }

                            if (pengkajianmedis[i].emrdfk == 2367) {
                                tampungo = tampungo + " E : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }

                            if (pengkajianmedis[i].emrdfk == 2368) {
                                tampungo = tampungo + " M : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }

                            if (pengkajianmedis[i].emrdfk == 2369) {
                                tampungo = tampungo + " V : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }

                            if (pengkajianmedis[i].emrdfk == 1172) {
                                tampungo = tampungo + " Suhu : " + pengkajianmedis[i].value + " °C " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1173) {
                                tampungo = tampungo + " Pernapasan : " + pengkajianmedis[i].value + " x/menit " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1171) {
                                tampungo = tampungo + " EWS : " + pengkajianmedis[i].value + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1174) {
                                tampungo = tampungo + " Tinggi Badan : " + pengkajianmedis[i].value + " cm " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 1175) {
                                tampungo = tampungo + " Berat Badan : " + pengkajianmedis[i].value + " kg " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 472) {
                                tampungo = tampungo + " Odema : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 240) {
                                tampungo = tampungo + " Lila : " + pengkajianmedis[i].value  + " cm " + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 473) {
                                tampungo = tampungo + " Refleks Patela : " + pengkajianmedis[i].value.split("~")[1] + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 2370) {
                                tampungo = tampungo + " Ispeksi : " + pengkajianmedis[i].value + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 2371) {
                                tampungo = tampungo + " Palpasi : " + pengkajianmedis[i].value + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 2372) {
                                tampungo = tampungo + " Auskultasi : " + pengkajianmedis[i].value + "\n"
                            }

                            if (pengkajianmedis[i].emrdfk == 2373) {
                                tampungo = tampungo + " TBJ : " + pengkajianmedis[i].value + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 2374) {
                                tampungo = tampungo + " Inspekulo : " + pengkajianmedis[i].value + "\n"
                            }
                            if (pengkajianmedis[i].emrdfk == 2375) {
                                 
                                tampungo = tampungo + " Periksa Dalam : " + pengkajianmedis[i].value + "\n"
                            }
                            
                        }

                        $scope.data.names[0].o = tampungo
                        
                    }
                })
            }
            function loadOrderPenunjang() {
                medifirstService.get('emr/get-order-penunjang-to-cppt?norec_pd=' + $scope.cc.norec_pd).then(function(dat) {
                    let hasil = '';
                    if (dat.data.length > 0) {
                        
                        for (let i = 0; i < dat.data.length; i++) {
                            if (dat.data[i].keteranganorder == "Order Farmasi") {
                                hasil = hasil + "E-Resep : " + dat.data[i].namaproduk + " \n"
                            } else if (dat.data[i].keteranganorder == "Order Laboratorium") {
                                
                                if(a.data[i].namaproduk != null) { //ash 2023-09-05
                                hasil = hasil + "LAB : " + dat.data[i].namaproduk + " \n"
                                }
                            } else if (dat.data[i].keteranganorder == "Order Radiologi") {
                                
                                if(a.data[i].namaproduk != null) { //ash 2023-09-05
                                hasil = hasil + "RAD : " + dat.data[i].namaproduk + " \n"
                                }
                            }
                        }

                        $scope.data.names[0].p = hasil;
                    }
                })
            }
            $scope.$watch('item.filterLayanan', function (newVal, oldVal) {
                 
                if (newVal !== oldVal) {
                    if (newVal == "") {
                        $scope.listProdukCek = produkDef
                        return
                    }
                    if (newVal == undefined) return

                    $scope.listTempProduk = []
                    var name = newVal.toLowerCase()
                    for (var i = produkDef.length - 1; i >= 0; i--) {
                        const elem = produkDef[i]
                        $scope.listTempProduk.push({
                            id: elem.id,
                            detailjenisproduk: elem.detailjenisproduk,
                            details: []
                        })
                        for (var x = elem.details.length - 1; x >= 0; x--) {
                            const element = elem.details[x];
                            var arr = element.namaproduk.toLowerCase()
                            if ((arr.indexOf(name) > -1)) {
                                for (let y = 0; y < $scope.listTempProduk.length; y++) {
                                    const element2 = $scope.listTempProduk[y];
                                    if (element2.id == elem.id)
                                        element2.details.push(element)
                                }
                            }
                            // if ($scope.item.layanan != undefined) {
                            //     var arrobj = Object.keys($scope.item.layanan)
                            //     for (let x = 0; x < arrobj.length; x++) {
                            //         const element3 = arrobj[x];
                            //         for (let y = 0; y < $scope.listTempProduk.length; y++) {
                            //             const element2 = $scope.listTempProduk[y];
                            //             if ($scope.item.layanan[element3] == true && element.id != element3) {
                            //                 element2.details.push(element)
                            //             }
                            //         }
                            //     }
                            // }
                        }

                    }
                    $scope.listProdukCek = []
                    $scope.listProdukCek = $scope.listTempProduk
                    if ($scope.item.layanan != undefined && $scope.item.layanan != '') {
                        for (let i = 0; i < $scope.listProdukCek.length; i++) {
                            const element1 = $scope.listProdukCek[i];
                            var arrobj = Object.keys($scope.item.layanan)
                            for (let x = 0; x < element1.details.length; x++) {
                                const element2 = element1.details[x];
                                for (let x = 0; x < arrobj.length; x++) {
                                    const element3 = arrobj[x];
                                    if (element2.id == element3) {
                                        $scope.item.layanan[element3] = true
                                        // element.isChecked = true
                                    }
                                }
                            }
                        }
                    }
                }
            })
            $scope.$watch('item.filterLayanan2', function (newVal, oldVal) {
                 
                if (newVal !== oldVal) {
                    if (newVal == "") {
                        $scope.listProdukCekRad = produkDef
                        return
                    }
                    if (newVal == undefined) return

                    $scope.listTempProduk = []
                    var name = newVal.toLowerCase()
                    for (var i = produkDef.length - 1; i >= 0; i--) {
                        const elem = produkDef[i]
                        $scope.listTempProduk.push({
                            id: elem.id,
                            detailjenisproduk: elem.detailjenisproduk,
                            details: []
                        })
                        for (var x = elem.details.length - 1; x >= 0; x--) {
                            const element = elem.details[x];
                            var arr = element.namaproduk.toLowerCase()
                            if ((arr.indexOf(name) > -1)) {
                                for (let y = 0; y < $scope.listTempProduk.length; y++) {
                                    const element2 = $scope.listTempProduk[y];
                                    if (element2.id == elem.id)
                                        element2.details.push(element)
                                }
                            }
                            // if ($scope.item.layanan != undefined) {
                            //     var arrobj = Object.keys($scope.item.layanan)
                            //     for (let x = 0; x < arrobj.length; x++) {
                            //         const element3 = arrobj[x];
                            //         for (let y = 0; y < $scope.listTempProduk.length; y++) {
                            //             const element2 = $scope.listTempProduk[y];
                            //             if ($scope.item.layanan[element3] == true && element.id != element3) {
                            //                 element2.details.push(element)
                            //             }
                            //         }
                            //     }
                            // }
                        }

                    }
                    $scope.listProdukCekRad = []
                    $scope.listProdukCekRad = $scope.listTempProduk
                    if ($scope.item.layanan != undefined && $scope.item.layanan != '') {
                        for (let i = 0; i < $scope.listProdukCekRad.length; i++) {
                            const element1 = $scope.listProdukCekRad[i];
                            var arrobj = Object.keys($scope.item.layanan)
                            for (let x = 0; x < element1.details.length; x++) {
                                const element2 = element1.details[x];
                                for (let x = 0; x < arrobj.length; x++) {
                                    const element3 = arrobj[x];
                                    if (element2.id == element3) {
                                        $scope.item.layanan[element3] = true
                                        // element.isChecked = true
                                    }
                                }
                            }
                        }
                    }
                }
            })
            $scope.resetFilter = function () {
                delete $scope.item.filterLayanan
                $scope.listProdukCek = []
                $scope.listProdukCek = produkDef
                if ($scope.item.layanan != undefined) {
                    for (let i = 0; i < $scope.listProdukCek.length; i++) {
                        const element1 = $scope.listProdukCek[i];
                        var arrobj = Object.keys($scope.item.layanan)
                        for (let x = 0; x < element1.details.length; x++) {
                            const element2 = element1.details[x];
                            for (let x = 0; x < arrobj.length; x++) {
                                const element3 = arrobj[x];
                                if (element2.id == element3) {
                                    $scope.item.layanan[element3] = true
                                    // element.isChecked = true
                                }
                            }
                        }
                    }
                }
            }
            $scope.resetFilter2 = function () {
                delete $scope.item.filterLayanan2
                $scope.listProdukCekRad = []
                $scope.listProdukCekRad = produkDef
                if ($scope.item.layanan != undefined) {
                    for (let i = 0; i < $scope.listProdukCekRad.length; i++) {
                        const element1 = $scope.listProdukCekRad[i];
                        var arrobj = Object.keys($scope.item.layanan)
                        for (let x = 0; x < element1.details2.length; x++) {
                            const element2 = element1.details2[x];
                            for (let x = 0; x < arrobj.length; x++) {
                                const element3 = arrobj[x];
                                if (element2.id == element3) {
                                    $scope.item.layanan[element3] = true
                                    // element.isChecked = true
                                }
                            }
                        }
                    }
                }
            }
            $scope.LihatEkpertise = function (dataItem) {
                //  ;
                // if ($scope.dataItem == undefined) {
                // 	window.messageContainer.error("Pilih Data Dulu!");
                // 	return;
                // }
                 
                $scope.hideExper = false
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = dataItem.namaproduk
                $scope.item.norec_pp = dataItem.norec_pp
                // $scope.item.dokters = dataItem.dokter
                if(dataItem.iddokterpengirim != undefined && dataItem.iddokterpengirim != "" && dataItem.iddokterpengirim != 0)
                {
                    $scope.item.dokterperujuk = { id: dataItem.iddokterpengirim, namalengkap: dataItem.dokterpengirim }
                }
                // $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                $scope.item.dokter = { id: dataItem.dokterid, namalengkap:  dataItem.dokter}
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        // if(e.data[0].keterangan == undefined || e.data[0].keterangan == null || e.data[0].keterangan == '')
                        // {
                        //     medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataItem.produkfk + '&objectpegawaifk=' + $scope.dataItem.dokterid).then(function (res) {
                        //         if (res.data.data.length > 0) 
                        //                  $scope.item.keterangan = res.data.data[0].keterangan;//.replace(/~/g, "\n")
    
                        //         })
                        //     $scope.norecHasilRadiologi = e.data[0].norec
                        //     $scope.item.nofoto = e.data[0].nofoto
                        //     $scope.item.tglInput = new Date(e.data[0].tanggal)
                        //     $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                            

                        //     $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                        //     $scope.item.ruanganperujuk = { id: e.data[0].ruanganperujukfk, namaruangan: e.data[0].namaruangan }
                        
                        // }else
                        // {

                            // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataItem.produkfk + '&objectpegawaifk=' + $scope.dataItem.dokterid).then(function (res) {
                            //     if (res.data.data.length == 0) 
                            //         var objSave = {
                            //             id :"",
                            //             produkfk: $scope.dataItem.produkfk,
                            //             keterangan: e.data[0].keterangan,
                            //             objectpegawaifk: $scope.dataItem.dokterid,
                            //             "method": 'save'
                            //         }   
                            //         // medifirstService.post('sysadmin/general/save-template-hasil', objSave).then(function (e) { 
                            //         // }, function (error) {
                            //         //     $scope.hideExper = false
                            //         // })
                            //     })
                             
                            $scope.statusSelesaiPeriksa = e.data[0].isclaim
                            $scope.norecHasilRadiologi = e.data[0].norec
                            $scope.item.nofoto = e.data[0].nofoto
                            $scope.item.tglInput = new Date(e.data[0].tanggal)
                            $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                            $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")

                            $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                            $scope.item.ruanganperujuk = { id: e.data[0].ruanganperujukfk, namaruangan: e.data[0].namaruangan }
                        // }
                    }
                    else
                    {
                        // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataItem.produkfk + '&objectpegawaifk=' + $scope.dataItem.dokterid).then(function (res) {
                        //     if (res.data.data.length > 0) 
                        //              $scope.item.keterangan = res.data.data[0].keterangan;//.replace(/~/g, "\n")
                        //              $scope.item.tglInput = new Date()
                        //              $scope.item.dokter = { id:  $scope.dataItem.dokterid, namalengkap:  $scope.dataItem.dokter}
                        //     })
                    }
                    
                    if ($scope.norecHasilRadiologi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        var nama = medifirstService.getPegawaiLogin().namaLengkap
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                                + '&nama=' + nama, '_blank');
                        }
                    }
                    // $scope.popUpEkpertise.center().open();
                    
                })
                
                // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                //         if (res.data.data.length > 0) 
                //                  $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")
                //                  $scope.popUpEkpertise.center().open();
                //         })
                    
            
                
                
            }
            //*inputan eresep*//
            $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
            $scope.showRE = function () {
                $rootScope.isShowRE = !$rootScope.isShowRE
                $scope.ShowTanggal = true;
                //     init();
            // function init() {
                // ////;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1))//new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                });
                var chacePeriode = cacheHelper.get('InputResepApotikOrderRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.item.ceklisNoRegis = chacePeriode[13]
                    $scope.item.rekananPasien = chacePeriode[21]
                    $scope.item.objectrekananfk = chacePeriode[22]
                    $scope.item.ruanganterakhir = chacePeriode[24]
                    $scope.item.jenisruangan = chacePeriode[33]
                    if (chacePeriode[19] != undefined)
                        $scope.item.kdKelompokPasien = chacePeriode[19]
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            // $scope.item.statusVerif = dat.data.status
                        });
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    //** */
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                }

                var cacheNoRuang = cacheHelper.get('noRuangInputResep');
                if (cacheNoRuang != undefined) {
                    $scope.item.noRuang = cacheNoRuang
                }
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
                    //  
                    $scope.isRouteLoading = false;
                    // $scope.listPenulisResep = dat.data.penulisresep;
                    if ($scope.cc.objectdepartemenfk == 24) {
                        $scope.listRuangan = dat.data.ruanganfarmasi;
                        $scope.item.ruangan = dat.data.ruanganfarmasi[1];
                    } else {
                        $scope.listRuangan = dat.data.ruanganfarmasi;
                        $scope.item.ruangan = dat.data.ruanganfarmasi[0];
                    }
                    // $scope.listRuangan.splice(9);
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produk;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    $scope.listRoute = dat.data.route;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    $scope.listwaktuminum = dat.data.waktuminum;
                    $scope.listsediaanobat = dat.data.sediaanobat;
                    $scope.item.tarifadminresep = dat.data.tarifadminresep
                    $scope.listDosis = dat.data.satuandosis;
                   
                    // if($scope.item.namaRuangan == "Poli Eksekutif"){    
                    //     $scope.item.ruangan = dat.data.ruanganfarmasi[5];//depo umum 2
                    // } 
                    //Mapping Depo Ranap
                    /*medifirstService.get("farmasi/get-depo-ranap?idRuangan=" + $scope.item.idRuangan, true).then(function(dat) {
    
                        if ($scope.cc.objectdepartemenfk == '16') {
                            $scope.item.ruangan = dat.data.ruanganranap[0]
                        }  
                        else if($scope.item.jenisruangan == "EKS"){  //semua ruangan yang belakangnya ada /E
                            $scope.item.ruangan = dat.data.ruanganfarmasi[5];//depo umum 2
                        } else if($scope.item.ruanganterakhir == "Hemodialisa"){
                            $scope.item.ruangan = dat.data.ruanganfarmasi[0];//depo AC
                        }else if($scope.item.ruanganterakhir == "Poli Eksekutif"){ //baik itu murni ke eksekutif atau ruanganasalnya eksekutif
                            $scope.item.ruangan = dat.data.ruanganfarmasi[5];//depo umum 2
                        }else if ($scope.item.namaRuangan == "Instalasi Gawat Darurat (IGD)") {
                            $scope.item.ruangan = dat.data.ruanganfarmasi[2];//depo igd
                        }else if
                         ($scope.item.namaRuangan == "Poli Bedah Vaskuler"){ 
                            if($scope.item.kelompokPasien == "Umum/Pribadi" || $scope.item.kelompokPasien == "Tagihan"){
                            $scope.item.ruangan = dat.data.ruanganfarmasi[5];//depo umum 2
                            } else {
                                $scope.item.ruangan = {id: 508, namaruangan: "DEPO BLOK F"}
                            }
                        } 
                        else if
                         ($scope.item.namaRuangan == "Poli Bedah Digestive (Sore)"){
                          if($scope.item.kelompokPasien == "Umum/Pribadi" || $scope.item.kelompokPasien == "Tagihan") {
                            $scope.item.ruangan = dat.data.ruanganfarmasi[5]; //depo umum 2
                            } else {
                                $scope.item.ruangan = {id: 508, namaruangan: "DEPO BLOK F"}
                            }
                        } 
                        else if
                         ($scope.item.objectrekananfk == 581368) {
                            $scope.item.ruangan = dat.data.ruanganfarmasi[6];
                        } //581367= bpjs non pol 581669= non pol pbi  581673= non pol pbi scr
                        else if($scope.item.objectrekananfk == 581367 || $scope.item.objectrekananfk == 581669 || $scope.item.objectrekananfk == 581673){
                            $scope.item.ruangan = dat.data.ruanganfarmasi[3];
    
                            //581724 = swasta atau poli swasta  
                        }  else if($scope.item.objectrekananfk == 581724){
                            $scope.item.ruangan = dat.data.ruanganfarmasi[8];
    
                            //PTT
                        }else if($scope.item.kelompokPasien == "PHL"){
                            $scope.item.ruangan = dat.data.ruanganfarmasi[0];
                        }
                        // else if($scope.item.kelompokPasien == "Tagihan"){
                        //     $scope.item.ruangan = dat.data.ruanganfarmasi[4];
                        // }
                        else {
                            $scope.item.ruangan = dat.data.ruanganfarmasi[4];
                        }
                    }) */

                    if ($scope.item.kdKelompokPasien == 105) {
                        //$scope.item.tarifadminresep = dat.data.tarifadminresep[1].nilaifield;
                        $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield;
                    }else {
                        //$scope.item.tarifadminresep = dat.data.tarifadminresep[0].nilaifield;
                        $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield;
                    }
                  
                    $scope.item.jenisKemasan = dat.data.jeniskemasan[1];
                });
            
                // medifirstService.getPart('emr/get-pegawai-parts', true, 10).then(function (e) {
                //             $scope.listPenulisResep = e
                //             $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                //         })
                // medifirstService.get("get-data-login", true).then(function (dat) {
                // var penulis = []
                // penulis.push({id:medifirstService.getPegawaiLogin().id,namalengkap:medifirstService.getPegawaiLogin().namaLengkap})
                // $scope.listPenulisResep = penulis
                // $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                // });
                medifirstService.get('emr/get-daftar-detail-order?nocm=' + $scope.cc.nocm).then(function (e) {
                    for (var i = e.data.length - 1; i >= 0; i--) {
                        e.data[i].no = i + 1
                        if (e.data[i].reseppulang == 1) {
                            e.data[i].cekreseppulang = "✔"
                        } else {
                            e.data[i].cekreseppulang = "-"
                        }
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data,
                        pageSize: 10
                    });


                });
                medifirstService.get('emr/get-daftar-obat-sering-diresepkan').then(function (e) {
                    var array = e.data.data
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        element.no = i + 1
                    }

                    $scope.dataGridResepExist = new kendo.data.DataSource({
                        data: array,
                        pageSize: 10
                    });


                });

                $scope.listCaraAmbil = [
                    { "id": 1, "caraambil": "Diambil Sendiri" },
                    { "id": 2, "caraambil": "Diantar ke Rumah" }
                ]
                medifirstService.get('emr/get-pasien-telemedicine?noregistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                    var datas = e.data.data
                    if (datas.istelemedicine == 1) {
                        $scope.item.caraAmbil = null
                    } else {
                        $scope.item.caraAmbil = { "id": 1, "caraambil": "Diambil Sendiri" }
                    }
                });


                if ($scope.item.ceklisNoRegis == true) {
                    loadRiwayat('noReg=' + $scope.cc.noregistrasi)


                } else {
                    loadRiwayat('nocm=' + $scope.item.noMr)
                }
            // }
            // medifirstService.getPart('emr/get-pegawai-parts', true, 10).then(function (e) {
            //     $scope.listPenulisResep = e
            //     // $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
            // })
        }
            
            $scope.getSatuan = function () {
                medifirstService.get("emr/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {

                        //penjgaan stok
                        // if ($scope.item.stok=0) {
                        //     alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
                        //     return;
                        // }

                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        //penjgaan stok
                        // for (var i = 0; i < e.data.infostok.length; i++) {
                        //     e.data.infostok[i].no = i + 1
                        // }
                        // if ($scope.item.stok < $scope.item.jumlah) {
                        //     alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
                        //     return;
                        // }
                        
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        })
                        // if ($scope.item.stok < $scope.item.jumlah) {
                        //     toastr.warning('tes!');
                        //     return;
                        
                        // }
                    })
                // ////
                // if ($scope.item.stok < $scope.item.jumlah) {
                //     toastr.warning('tes!');
                //     return;
                
                // }
                

                GETKONVERSI()
                cekObatPsikotropika()

            }


            $scope.kembali = function () {
                ////
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.norecAPD,
                    emr: 'LaporanOperasi',
                });
            }

            function cekObatPsikotropika() {
                medifirstService.get("farmasi/cek-obat-psikotropika?idproduk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        var datas = e.data.data
                        if (datas.ispsikotropika == 1) {
                            toastr.info(datas.namaproduk + ' Obat Psikotropika')
                            $scope.item.caraAmbil = { "id": 1, "caraambil": "Diambil Sendiri" }
                            $scope.disabledCaraAmbil = true
                        }
                        if (datas.isnarkotika == 1) {
                            toastr.info(datas.namaproduk + ' Obat Narkotika')
                            $scope.item.caraAmbil = { "id": 1, "caraambil": "Diambil Sendiri" }
                            $scope.disabledCaraAmbil = true
                        }
                    })
            }
            function GETKONVERSI() {
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     //alert("Pilih asal terlebih dahulu!!")
                //     return;
                // }
                // if ($scope.item.stok < $scope.item.jumlah) {
                //             alert("Stok Obat ini Kosong, Silahkan Pilih Obat yang lain !!")
                //             return;
                //         }
                statusTambah = false
                $scope.isRouteLoading = false;
                medifirstService.get("farmasi/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id +
                    "&kelompokpasien=" + $scope.item.kdKelompokPasien, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        // $scope.item.stok = dat.data.jmlstok
                        $scope.item.kekuatan = dat.data.kekuatan
                        $scope.item.sediaan = dat.data.sediaan

                        // $scope.item.dosis =$scope.dataSelected.dosis
                        // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
                        if ($scope.dataSelected != undefined) {
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                            // $scope.item.satuan = {ssid:$scope.dataSelected.satuanstandarfk,satuanstandar:$scope.dataSelected.satuanstandar}
                            $scope.item.stok = $scope.dataSelected.jmlstok //* $scope.item.nilaiKonversi 
                            $scope.item.jumlah = $scope.dataSelected.jumlah
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            // $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.total = $scope.dataSelected.total
                            // if ($scope.item.kekuatan != undefined && $scope.item.kekuatan != 0) {
                            //     $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                            // }
                        }
                        statusTambah = true
                        gettotal();
                    });
            }
            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        // $scope.item.hargadiskon =0//hrgsdk * parseFloat(newValue)
                        $scope.item.total = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    // }
                }
            });
            $scope.$watch('item.tglresepAkhir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var date1 = new Date($scope.item.tglresep);
                    var date2 = new Date($scope.item.tglresepAkhir);
                    var Difference_In_Time = date2.getTime() - date1.getTime();
                    diffDays = date2.getDate() - date1.getDate();
                    diffDays = diffDays + 1
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    $scope.kAngka = Difference_In_Days//diffDays
                }
            });
            // $scope.$watch('item.jumlahxmakan', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         if ($scope.item.stok > 0) {
            //             // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
            //             $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
            //         }
            //     }
            // });
            // $scope.$watch('item.dosis', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         if ($scope.item.stok > 0) {
            //             // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
            //             $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
            //         }
            //     }
            // });
            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Racikan') {
                        $scope.showRacikanDose = true
                        $scope.ShowProduk = true
                        $scope.ShowQty = true 
                        $scope.ShowAturanPakai = true 
                        $scope.ShowSediaanObat = true 
                        $scope.ShowWaktuMinum = true 
                        $scope.ShowKeterangan = true
                        $scope.ShowSigna1 = true  
                        $scope.ShowSigna2 = true
                        $scope.ShowSigna3 = true
                        Kosongkan();
                    } else {
                        $scope.showRacikanDose = false  
                        $scope.ShowProduk = true
                        $scope.ShowQty = true 
                        $scope.ShowAturanPakai = true 
                        $scope.ShowSediaanObat = true 
                        $scope.ShowWaktuMinum = true 
                        $scope.ShowKeterangan = true
                        $scope.ShowSigna1 = true  
                        $scope.ShowSigna2 = true
                        $scope.ShowSigna3 = true
                        Kosongkan();
                    }
                }
            });
            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    gettotal()
                }
            });

            function gettotal() {

                //penjgaan stok
                // if ($scope.item.stok == 0) {
                //     $scope.item.jumlah = 1
                //     //alert('Stok kosong')

                //     return;
                // }

                // var tarifJasa = 0
                // var qty20 = 0
                // if ($scope.item.jenisKemasan.id == 2) {
                //     tarifJasa = 800
                // }
                // if ($scope.item.jenisKemasan.id == 1) {
                //     qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
                //     if (parseFloat($scope.item.jumlah) % 20 == 0) {
                //         qty20 = qty20 
                //     }else{
                //         qty20 = qty20 + 1
                //     }

                //     tarifJasa = 800 * qty20
                // }

                // var ada = false;
                ////
                for (var i = 0; i < dataProdukDetail.length; i++) {
                    // ada = false
                    // if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                    if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi))) {
                        hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
                        $scope.item.hargaSatuan = parseFloat(hrg1)
                        $scope.item.total = parseFloat((parseFloat($scope.item.jumlah) * (hrg1)))//+tarifJasa
                        noTerima = dataProdukDetail[i].norec
                        // ada = true;
                        break;
                    }
                }
                // if (ada == false) {
                //     $scope.item.hargaSatuan = 0
                //     $scope.item.total = 0

                //     noTerima = ''
                // }
                // if ($scope.item.jumlah == 0) {
                //     $scope.item.hargaSatuan = 0
                // }
                // if ($scope.item.stok > 0) {
                //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                // }
            }
            $scope.hapus1 = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }

                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            data2.splice(i, 1);

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            // $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalSubTotal = subTotal
                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if (statusTambah == false) {
                    return
                }
                if ($scope.statusSelesaiPeriksa != false) {
                    toastr.error("Faktur sudah ditutup, tidak bisa order resep!")
                    return;
                }
                if ($scope.dataGridRiwayat != undefined && $scope.norecOrder == '' && $scope.item.ruangan.id == 94) {
                    if ($scope.dataGridRiwayat._data.length > 0) {
                        var orderanDepoRajal = []
                        for (let i = 0; i < $scope.dataGridRiwayat._data.length; i++) {
                            const element = $scope.dataGridRiwayat._data[i];
                            if (element.namaruangan == 'DEPO RAJAL') {
                                orderanDepoRajal.push(element)
                            }
                        }
                        if (orderanDepoRajal.length > 0) {
                            // toastr.error('Hanya Bisa Order Satu Kali !', 'Peringatan')
                            // return
                        }
                    }
                }
                if ($scope.isSelesaiPeriksa == true) {
                    toastr.error("Data Sudah Diclosing!");
                    return;
                }
                // if ($scope.item.statusVerif == true) {
                //     toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //     return;
                // }
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.aturanPakai == null || $scope.item.aturanPakai == undefined || $scope.item.aturanPakai == 'null' || $scope.item.aturanPakai == 'undefined' || $scope.item.aturanPakai == '') {
                    alert("Aturan pakai harus di isi walaupun hanya '-/strip'!")
                    return;
                }
                //penjgaan stok
                // if ($scope.item.stok == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                //
                if (($scope.item.produk == undefined || $scope.item.produk == "") && $scope.item.jenisKemasan.id != 3) {
                  
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if (($scope.item.satuan == undefined || $scope.item.satuan == "") && $scope.item.jenisKemasan.id != 3) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.aturanPakai.id == undefined && $scope.item.jenisKemasan.id != 3) {
                //     alert("Aturan Pakai Belum diisi!!")
                //     return;
                // }
                // if ($scope.item.waktuminum == undefined) {
                //     alert("Waktu Penggunaan Obat Belum diisi!!")
                //     return;
                // }
                ////
                // if ($scope.item.sediaanobat == undefined) {
                //     alert("Jenis Penggunaan Obat Belum diisi!!")
                //     return;
                // }
                ////
                // if ($scope.item.stok < $scope.item.jumlah) {
                //     alert("Stok tidak cukup!!")
                //     return;
                // }
                var KetPakai = "";
                if ($scope.item.KeteranganPakai) {
                    KetPakai = $scope.item.KeteranganPakai;
                }
                //
                var keteranganracikan = "";
                if ($scope.item.keteranganracikan) {
                    keteranganracikan = $scope.item.keteranganracikan;
                }
                // var waktuminum = null
                // if ($scope.item.waktuminum != undefined) {
                //     waktuminum = $scope.item.waktuminum.id
                // }
                // var sediaanobat = null
                // if ($scope.item.sediaanobat != undefined) {
                //     sediaanobat = $scope.item.sediaanobat.id
                // }

                var aturanpakai = "";
                if ($scope.item.aturanPakai) {
                    aturanpakai = $scope.item.aturanPakai.name;
                }
                var produkfk = null
                if ($scope.item.produk != undefined) {
                    produkfk = $scope.item.produk.id;
                }
                var namaproduk = null
                if ($scope.item.produk != undefined) {
                    namaproduk = $scope.item.produk.namaproduk;
                }
                var satuanstandarfk = null
                if ($scope.item.satuan != undefined) {
                    satuanstandarfk = $scope.item.satuan.ssid;
                }
                var satuanstandar = null
                if ($scope.item.satuan != undefined) {
                    satuanstandar = $scope.item.satuan.satuanstandar;
                }
                var satuanviewfk = null
                if ($scope.item.satuan != undefined) {
                    satuanviewfk = $scope.item.satuan.ssid;
                }
                var satuanview = null
                if ($scope.item.satuan != undefined) {
                    satuanview = $scope.item.satuan.satuanstandar;
                }
                var objectwaktuminumfk = null
                if($scope.item.waktuminum != undefined){
                    objectwaktuminumfk = $scope.item.waktuminum.id
                }
                var waktuminum = null
                if($scope.item.waktuminum != undefined){
                    waktuminum = $scope.item.waktuminum.waktuminum
                }
                // var carapenggunaan = null
                // if($scope.item.waktuminum != undefined){
                //     carapenggunaan = $scope.item.waktuminum.waktuminum
                // }
                var sediaanobat = null
                if($scope.item.sediaanobat != undefined){
                    sediaanobat = $scope.item.sediaanobat.id
                }
                var aturanPakai = null
                if($scope.item.aturanPakai != undefined){
                    aturanPakai = $scope.item.aturanPakai.name
                }
                var obatpulangket = 'Obat'
                var isobatpulang = 'false'
                if ($scope.model?.isObatPulang == true) {
                    obatpulangket = 'Obat Pulang'
                    isobatpulang = 'true'
                }
                var dosis = 1;
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    dosis = $scope.item.dosis
                }
                var jumlah = '';
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    jumlah = 1
                } else {
                    jumlah = $scope.item.jumlah
                }
                var jRacikan = null
                if ($scope.item.jenisRacikan != undefined) {
                    jRacikan = $scope.item.jenisRacikan.id
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                $scope.disabledRuangan = true;
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                            //data.tglregistrasi = $scope.item.tglregistrasi
                            data.generik = null
                            data.hargajual = $scope.item.hargaSatuan
                            data.jenisobatfk = jRacikan
                            //data.kelasfk = $scope.item.kelas.id
                            data.stock = $scope.item.stok
                            data.harganetto = $scope.item.hargaSatuan
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id
                            data.routefk = $scope.item.route != undefined ? $scope.item.route.id : null
                            data.route = $scope.item.route != undefined ? $scope.item.route.name : null
                            data.rke = $scope.item.rke
                            data.jeniskemasanfk = $scope.item.jenisKemasan.id
                            data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                            // data.aturanpakaifk = 0//$scope.item.aturanPakai.id
                            // data.aturanpakai = $scope.item.aturanPakai.name//aturanPakai.name
                            data.aturanpakai = $scope.item.aturanPakai != undefined ? $scope.item.aturanPakai.name : null//aturanPakai.name
                            data.ispagi = $scope.item.chkp
                            data.issiang = $scope.item.chks
                            data.issore = $scope.item.chksr
                            data.ismalam = $scope.item.chkm
                            data.asalprodukfk = 0//$scope.item.asal.id
                            data.asalproduk = ''//$scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = $scope.item.stok
                            data.jumlah = jumlah
                            data.hargasatuan = $scope.item.hargaSatuan
                            data.hargadiscount = 0
                            data.total = $scope.item.total
                            data.dosis = dosis
                            data.jumlahxmakan = $scope.item.jumlahxmakan
                            data.jmldosis = String(($scope.item.jumlah) / dosis) + '/' + String(dosis)
                            data.keterangan = KetPakai
                            data.keteranganracikan = keteranganracikan
                            data.objectwaktuminumfk = objectwaktuminumfk
                            data.waktuminum = waktuminum
                            data.sediaanobat = sediaanobat
                            data.isobatpulang = isobatpulang
                            data.ketobatpulang = obatpulangket

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });

                        }
                    }

                } else {
                    // //
                    data = {
                        no: nomor,
                        generik: null,
                        hargajual: $scope.item.hargaSatuan,
                        jenisobatfk: jRacikan,
                        //kelasfk:$scope.item.kelas.id,
                        stock: $scope.item.stok,
                        harganetto: $scope.item.hargaSatuan,
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,//£££
                        routefk: $scope.item.route != undefined ? $scope.item.route.id : null,
                        route: $scope.item.route != undefined ? $scope.item.route.name : null,
                        rke: $scope.item.rke,
                        jeniskemasanfk: $scope.item.jenisKemasan.id,
                        jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                        // aturanpakaifk: 0,//$scope.item.aturanPakai.id, 
                        // aturanpakai: $scope.item.aturanPakai.name,//aturanPakai.name,
                        aturanpakai: $scope.item.aturanPakai != undefined ? $scope.item.aturanPakai.name : null,//aturanPakai.name,
                        ispagi: $scope.item.chkp,
                        issiang: $scope.item.chks,
                        issore: $scope.item.chksr,
                        ismalam: $scope.item.chkm,
                        asalprodukfk: 0,//$scope.item.asal.id,
                        asalproduk: '',//$scope.item.asal.asalproduk,
                        // produkfk: $scope.item.produkid,
                        produkfk: $scope.item.produk != undefined ? $scope.item.produk.id : null,
                        // namaproduk: $scope.item.produk.namaproduk,
                        namaproduk: $scope.item.produk != undefined ? $scope.item.produk.namaproduk : null,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        // satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandarfk: $scope.item.satuan != undefined ? $scope.item.satuan.ssid : null,
                        // satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanstandar: $scope.item.satuan != undefined ? $scope.item.satuan.satuanstandar : null,
                        // satuanviewfk: $scope.item.satuan.ssid,
                        satuanviewfk: $scope.item.satuan != undefined ? $scope.item.satuan.ssid : null,
                        // satuanview: $scope.item.satuan.satuanstandar,
                        satuanview: $scope.item.satuan != undefined ? $scope.item.satuan.satuanstandar : null,
                        jmlstok: $scope.item.stok,
                        jumlah: jumlah,
                        hargasatuan: $scope.item.hargaSatuan,
                        hargadiscount: 0,
                        total: $scope.item.total,
                        dosis: dosis,
                        jumlahxmakan: $scope.item.jumlahxmakan,
                        jmldosis: String(($scope.item.jumlah) / dosis) + '/' + String(dosis),
                        keterangan: KetPakai,
                        keteranganracikan: keteranganracikan,
                        // objectwaktuminumfk: $scope.item.waktuminum.id,
                        objectwaktuminumfk: $scope.item.waktuminum != undefined ? $scope.item.waktuminum.id : null,
                        // waktuminum: $scope.item.waktuminum.waktuminum,
                        waktuminum: $scope.item.waktuminum != undefined ? $scope.item.waktuminum.waktuminum : null,
                        // sediaanobat: $scope.item.sediaanobat.id
                        // carapenggunaan: $scope.item.waktuminum.waktuminum,
                        sediaanobat: $scope.item.sediaanobat != undefined ? $scope.item.sediaanobat.id : null,
                        isobatpulang: isobatpulang,
                        ketobatpulang: obatpulangket
                    }
                    ////
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    ////
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = subTotal
                }
                var allTotal = 0
                data2.forEach(function (item) {
                    allTotal += item.total
                })
                if ($scope.cc.objectruanganfk != 927 && $scope.cc.objectruanganfk != 917 && $scope.cc.objectruanganfk != 64 && $scope.cc.objectruanganfk != 77 && $scope.cc.objectruanganfk != 922 && $scope.cc.objectruanganfk != 920 && $scope.cc.objectruanganfk != 923 && $scope.cc.objectruanganfk != 919 && $scope.cc.objectruanganfk != 926 && $scope.cc.objectruanganfk != 928 && $scope.cc.objectruanganfk != 934 && $scope.cc.objectruanganfk != 921 && $scope.cc.objectruanganfk != 929 && $scope.cc.objectruanganfk != 931 && $scope.cc.objectruanganfk != 918 && $scope.cc.objectruanganfk != 65 && $scope.cc.objectruanganfk != 924 && $scope.cc.objectruanganfk != 936 && $scope.cc.objectruanganfk != 925) {
                    if (parseFloat(allTotal) > 80000 && !$scope.dialogShown) {
                        var confirm = $mdDialog.confirm()
                                        .title('Peringatan')
                                        .textContent('Peringatan, Obat sudah mencapai lebih dari 80.000 yaitu sebesar Rp. ' + allTotal + '\n' + 'Apakah anda tetap akan menlanjutkan?')
                                        .ariaLabel('Lucky day')
                                        .cancel('Tidak')
                                        .ok('Ya')
                                    $mdDialog.show(confirm).then(function() {
                                        $scope.dialogShown = true
                                    })
                    }
                }
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                }
                Kosongkan();
                clear();
            }

            $scope.klikGrid = function (dataSelected) {
                //
                if (statusTambah == false)
                    return
                if ($scope.item.jenisKemasan.id == 3){
                    $scope.ShowSigna2 = false
                } else {
                    $scope.ShowSigna3 = true
                }

                var dataProduk = [];
                // $scope.item.jumlah = parseFloat(0)
                // console.log(typeof $scope.item.jumlah)
                // $scope.item.jumlah = (dataSelected.kekuatan)
                //no:no,
                // $scope.item.jumlah = Number(dataSelected.jumlah)
                $scope.item.no = dataSelected.no
                $scope.item.rke = dataSelected.rke
                $scope.item.keteranganracikan = dataSelected.keteranganracikan 
                medifirstService.get("emr/get-jenis-obat?jrid=" + dataSelected.jeniskemasanfk, true).then(function (JR) {
                    $scope.item.jenisRacikan = { id: JR.data.data[0].id, jenisracikan: JR.data.data[0].jenisracikan }
                });
                $scope.item.jenisKemasan = { id: dataSelected.jeniskemasanfk, jeniskemasan: dataSelected.jeniskemasan }
                $scope.item.jumlahxmakan = dataSelected.jumlahxmakan
                $scope.item.dosis = dataSelected.dosis
                // $scope.item.aturanPakai = { id: dataSelected.aturanpakaifk, name: dataSelected.aturanpakai }
                $scope.item.aturanPakai = { id: dataSelected.id, name: dataSelected.aturanpakai }
                $scope.item.aturanpakaitxt = dataSelected.aturanpakai
                $scope.item.KeteranganPakai = dataSelected.keterangan
                $scope.item.waktuminum = {id: dataSelected.objectwaktuminumfk, waktuminum: dataSelected.waktuminum}
                $scope.item.sediaanobat = {id: dataSelected.objectsediaanobatfk, sediaanobat: dataSelected.sediaanobat}
                $scope.currentAturanPakai = []
                $scope.item.route = { id: dataSelected.routefk, name: dataSelected.route }
                // $scope.item.keteranganracikan = dataSelected.keteranganracikan 
                // $scope.item.jumlah = dataSelected.jumlah
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                // let sp = dataSelected.ispagi
                // let ss = dataSelected.issiang
                // let sm = dataSelected.ismalam
                $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "Pagi", 'isChecked': sp },
                            { "id": 2, "nama": "Siang", 'isChecked': ss },
                            { "id": 3, "nama": "Sore", 'isChecked': sr },
                            { "id": 4, "nama": "Malam", 'isChecked': sm }
                        ]
                    }
                ];
                $scope.item.asal = { id: dataSelected.asalprodukfk, asalproduk: dataSelected.asalproduk }
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                GETKONVERSI()

            }
            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.waktuminum = ''
                $scope.item.aturanPakai = ''
                $scope.item.sediaanobat = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = undefined
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                $scope.item.KeteranganPakai = undefined;
                $scope.item.keteranganracikan = undefined;

                $scope.item.jenisRacikan=''
                $scope.item.jumlahxmakan=''
                $scope.item.dosis=''                
                $scope.item.satuandosis=''         
                $scope.item.kekuatan=''
                $scope.item.jumlah=''
                $scope.item.route=''
                // $scope.listDataSigna = [
                //     {
                //         "id": 1,
                //         "nama": "Aturan Pakai",
                //         "detail": [
                //             { "id": 1, "nama": "Pagi", 'isChecked': false },
                //             { "id": 2, "nama": "Siang", 'isChecked': false },
                //             { "id": 3, "nama": "Sore", 'isChecked': false },
                //             { "id": 4, "nama": "Malam", 'isChecked': false }
                //         ]
                //     }
                // ];
            }
            function clear() {
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.jenisRacikan = ''
                }

                // $scope.item.aturanPakai = ''
                // $scope.item.aturanpakaitxt = ''
            }
            function clearIter() {
                $scope.listJenisKemasan2 = [
                    { id: 1, nama: '1x', selected: false },
                    { id: 2, nama: '2x', selected: false },
                    { id: 3, nama: '3x', selected: false },
                    { id: 4, nama: '4x', selected: false },
                    { id: 5, nama: '5x', selected: false },
                    { id: 6, nama: '6x', selected: false },
                    // Dan seterusnya...
                ];               
            }
            function cleargrid() {
                for (var i = 0; i < data2.length; i++) {
                    data2.splice(i, 1);

                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.item.totalSubTotal = subTotal
                }
            }
            $scope.batal1 = function () {
                Kosongkan();
                clear();
            }
            $scope.batal = function () {
                $scope.disabledRuangan = false
                Kosongkan();
                clear();
                cleargrid();
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "40px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "70px",
                },
                // {
                //     "field": "jmldosis",
                //     "title": "Jml/Dosis",
                //     "width": "70px",
                // },
                // {
                //     "field": "waktuminum",
                //     "title": "Waktu Penggunaan",
                //     "width": "120px",
                // },
                {
                    "field": "namaproduk",
                    "title": "Nama Obat",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "40px",
                },
                // {
                //     "field": "stock",
                //     "title": "Stok",
                //     "width": "50px",
                // },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "25px",
                },
                {
                    "field": "aturanpakai",
                    "title": "Aturan Pakai",
                    "width": "100px",
                },
                {
                    "field": "waktuminum",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Catatan",
                    "width": "100px",
                },
                {
                    "field": "keteranganracikan",
                    "title": "Keterangan Racikan",
                    "width": "250px",
                },
                {
                    "field": "ketobatpulang",
                    "title": "Jenis Obat",
                    "width": "70px",
                },
                // {
                //     "field": "hargasatuan",
                //     "title": "Harga Satuan",
                //     "width": "100px",
                //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                // },
                // {
                //     "field": "total",
                //     "title": "Total",
                //     "width": "100px",
                //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                // }
            ];
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                }
                // {
                //     "field": "cekreseppulang",
                //     "title": "Resep Pulang",
                //     "width": "50px",
                // }
            ];
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Kemasan",
                            width: "100px",
                        },
                        {
                            field: "deskripsi2",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Satuan",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Aturan Pakai",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Qty",
                            width: "100px"
                        }
                    ]
                };
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.save = function () {
                if ($scope.dataGridRiwayat != undefined && $scope.dataGridRiwayat._data.length > 0 && $scope.norecOrder == '' && $scope.item.ruangan.id == 94) {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Order Resep sudah dilakukan, Apakah ingin order lagi ?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('OK')
                    $mdDialog.show(confirm).then(function () {
                        $scope.simpan();
                    })
                } else {
                    $scope.simpan();
                }

            }
            $scope.simpan = function () {
                 
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                if (diffDays < 1) {
                    alert("Tanggal Akhir tidak boleh lebih kecil!!")
                    return
                }

                // if ($scope.item.noRuang == undefined) {
                //     alert("Nomor Ruangan Tidak Boleh Kosong!!")
                //     return
                // }
                if ($scope.item.caraAmbil == undefined) {
                    alert("Cara Ambil Mohon Diisi Terlebih Dahulu!!")
                    return
                }

                var checkRP = 0;
                if ($scope.checkResepPulang == true) {
                    checkRP = 1;
                }

                var tglResepHari = ''
                for (var i = diffDays - 1; i >= 0; i--) {
                    var someDate = moment($scope.item.tglresep).toDate();//new Date(moment($scope.item.tglresep).format('YYYY-MM-DD hh:mm:ss'));
                    var numberOfDaysToAdd = i;
                    tglResepHari = moment(someDate.setDate(someDate.getDate() + numberOfDaysToAdd)).format('YYYY-MM-DD hh:mm:ss');
                     
                    var strukorder = {
                        norec: $scope.norecOrder,
                        tglresep: tglResepHari,//moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss'),
                        penulisresepfk: $scope.item.penulisResep.id,
                        ruanganfk: $scope.item.ruangan.id,
                        noregistrasifk: norec_apd,
                        qtyproduk: $scope.dataGrid._data.length,
                        noruangan: $scope.item.noRuang != undefined ? $scope.item.noRuang : null,
                        isreseppulang: checkRP != undefined ? checkRP : null,
                        caraambil: $scope.item.caraAmbil != undefined ? $scope.item.caraAmbil.caraambil : null,
                        jumlahiter: $scope.item.jumlahiter != '' ? $scope.item.jumlahiter : null,
                    }
                    ////
                    var objSave = [
                        {
                            strukorder: strukorder,
                            orderfarmasi: data2
                        }
                    ]
                    ////
                    $scope.hideSimpan = false
                    medifirstService.post('emr/simpan-order-pelayananobatfarmasi', objSave).then(function (e) {
                        for(let i = 0; i < data2.length; i++) {
                            if(data2[i].jeniskemasan == "Racikan") {
                                $scope.data.names[0].p = $scope.data.names[0].p + " E-Resep : " + data2[i].keteranganracikan + "\n"
                            } else {
                                $scope.data.names[0].p = $scope.data.names[0].p + " E-Resep : " + data2[i].namaproduk + "\n"
                            }
                        }
                        $rootScope.isShowRE = !$rootScope.isShowRE
                        $scope.item.resep == undefined
                        $scope.norecOrder = ''
                        medifirstService.postLogging('Order Resep', 'Norec strukresep_t', e.data.noresep.norec,
                            'Order Resep No Order - ' + e.data.noresep.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                            })
                        // $scope.item.resep = e.data.noresep.noorder
                        $scope.hideSimpan = false
                        $scope.item.jumlahiter = ''
                        Kosongkan();
                        clearIter()
                        clear();
                        cleargrid();
                        // LoadData();
                        $scope.batal();
                        $scope.disabledRuangan = false
                        if ($scope.item.noRuang != undefined)
                            cacheHelper.set('noRuangInputResep', $scope.item.noRuang)
                    })
                    if ($scope.cc.objectruanganfk == 927 || $scope.cc.objectruanganfk == 917 || $scope.cc.objectruanganfk == 64 || $scope.cc.objectruanganfk == 77 || $scope.cc.objectruanganfk == 922 || $scope.cc.objectruanganfk == 920 || $scope.cc.objectruanganfk == 923 || $scope.cc.objectruanganfk == 919 || $scope.cc.objectruanganfk == 926 || $scope.cc.objectruanganfk == 928 || $scope.cc.objectruanganfk == 934 || $scope.cc.objectruanganfk == 921 || $scope.cc.objectruanganfk == 929 || $scope.cc.objectruanganfk == 927 || $scope.cc.objectruanganfk == 931 || $scope.cc.objectruanganfk == 918 || $scope.cc.objectruanganfk == 65 || $scope.cc.objectruanganfk == 924 || $scope.cc.objectruanganfk == 936) {
                        let datanotif = {
                            "title": 'Resep Elektronik RI',
                            "namaruangan": $scope.cc.namaruangan,
                            "namapasien": $scope.cc.namapasien + '~' + $scope.cc.noregistrasi,
                            "tglorder": tglResepHari,
                            "nocm": $scope.cc.nocm,
                            // "idruangan": $scope.cc.objectruanganfk,
                            "idruangan": 555,
                            "form": "Order Resep Obat"
                        }
                        medifirstService.postNonMessage('microservice/savenotif', datanotif).then(function (e) {
                            var socket1 = io.connect(config.urlSocket)
                            var arrayS = {
                                no: 2,
                            };
                            socket1.emit('order-resep', arrayS)  
                        });
                    } else if ($scope.cc.objectruanganfk == 569 || $scope.cc.objectruanganfk == 936) {
                        let datanotif = {
                            "title": 'Resep Elektronik IGD',
                            "namaruangan": $scope.cc.namaruangan,
                            "namapasien": $scope.cc.namapasien + '~' + $scope.cc.noregistrasi,
                            "tglorder": tglResepHari,
                            "nocm": $scope.cc.nocm,
                            // "idruangan": $scope.cc.objectruanganfk,
                            "idruangan": 481,
                            "form": "Order Resep Obat"
                        }
                        medifirstService.postNonMessage('microservice/savenotif', datanotif).then(function (e) {
                            var socket1 = io.connect(config.urlSocket)
                            var arrayS = {
                                no: 2,
                            };
                            socket1.emit('order-resep', arrayS)  
                        });
                    }
                    init();
                }
            }

            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.riwayatFormResep = false
                $scope.inputObatOrder = false;
            }
            function loadRiwayat(params) {
                $scope.isRouteLoading = true;
                // medifirstService.get("emr/get-transaksi-pelayanan?nocm=" + $scope.cc.nocm, true).then(function (dat) {
                    medifirstService.get("farmasi/get-histori-obat?&nocm=" + $scope.cc.nocm, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            } else {
                                dat.data[i].cekreseppulang = '-'
                            }
                            if (dat.data[i].jumlahkronis == null) {
                                dat.data[i].jumlahkronis = "✘";
                                // ✅
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    norec_resep: array[i].norec_resep,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridResep = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                });
                // $scope.riwayatForm = false
                // $scope.riwayatFormResep = true
                // $scope.inputObatOrder = false;
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noReg=' + $scope.item.noregistrasi)
                }
                else {
                    loadRiwayat('nocm=' + $scope.item.noMr)
                }
            }
            $scope.riwayatResep = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi
                    // nocm=" + $scope.item.noMr
                    // + "&noregistrasifk=" + norec_apd
                    , true).then(function (dat) {
                        let group = [];
                        if (dat.statResponse == true) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount));
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa);
                                if (dat.data[i].reseppulang == '1') {
                                    dat.data[i].cekreseppulang = "✔"
                                } else {
                                    dat.data[i].cekreseppulang = "-"
                                }
                            }
                            var array = dat.data;
                            let sama = false

                            for (let i in array) {
                                array[i].count = 1
                                sama = false
                                for (let x in group) {
                                    if (group[x].noresep == array[i].noresep) {
                                        sama = true;
                                        group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                    }
                                }
                                if (sama == false) {
                                    var dataDetail0 = [];
                                    for (var f = 0; f < array.length; f++) {
                                        if (array[i].noresep == array[f].noresep) {
                                            dataDetail0.push(array[f]);
                                        };
                                    }
                                    let result = {
                                        noregistrasi: array[i].noregistrasi,
                                        norec_resep: array[i].norec_resep,
                                        tglpelayanan: array[i].tglpelayanan,
                                        noresep: array[i].noresep,
                                        aturanpakai: array[i].aturanpakai,
                                        namaruangandepo: array[i].namaruangandepo,
                                        namaruangan: array[i].namaruangan,
                                        dokter: array[i].dokter,
                                        count: array[i].count,
                                        cekreseppulang: array[i].cekreseppulang,
                                        details: dataDetail0
                                    }
                                    group.push(result)
                                }
                            }
                        }

                        $scope.dataGridResep = group
                        console.log(group)
                        $scope.isRouteLoading = false;
                    });
                $scope.riwayatForm = false
                $scope.riwayatFormResep = true
                $scope.inputObatOrder = false;
            }
            $scope.columnGridResep = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                    "template": "<span class='style-center'>#: cekreseppulang #</span>"
                },
                {
                    "field": "",
                    "title": "",
                    "width": "90px",
                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >Cetak</button> ",

                }
            ];
            $scope.verifikasigrid = function (dataPasienSelected) {

                ////;
                $scope.isRouteLoading = true;

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec"],
                    "paramValue": ["RS Bhayangkara Tk. I R.Said Sukanto", "1980-12-25 00:00:00", "Jl. Raya Bogor No.1, RT.1/RW.5, Kramat Jati, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13510", dataPasienSelected.norec_resep],
                    "paramType": ["", "date", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        ////;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/eresep.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/eresep.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.data2 = function (dataItem) {
                // ////
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                            attributes: {
                                class: "#=jumlahkronis != '✘' ? 'red' : 'hejo' #"
                            },
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "totaljumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        }

                    ]
                }
            };
            $scope.newOrder = function () {
                $scope.riwayatFormResep = false
                $scope.riwayatForm = false
                $scope.inputObatOrder = true;
            }
            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl')

                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderRevCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }
            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width": "50px",
                }

            ];
            $scope.editOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.dataSelectedRiwayat.statusorder != "Menunggu") {
                    toastr.error('Tidak bisa di edit sudah di verifikasi')
                    return
                }

                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.norecOrder = $scope.dataSelectedRiwayat.norec_order
                    $scope.item.resep = $scope.dataSelectedRiwayat.noorder
                    $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                    $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                    $scope.item.tglresep = new Date(dat.data.strukorder.tglorder)
                    $scope.item.tglresepAkhir = new Date(dat.data.strukorder.tglorder)
                    if ($scope.dataSelectedRiwayat.reseppulang == '1') {
                        $scope.checkResepPulang = true;
                    } else {
                        $scope.checkResepPulang = false;
                    }

                    data2 = dat.data.orderpelayanan
                    for (var i = data2.length - 1; i >= 0; i--) {



                        data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                        data2[i].tglregistrasi = $scope.item.tglregistrasi

                        data2[i].kelasfk = $scope.item.kelas.id

                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });


                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = subTotal
                    $scope.riwayatFormResep = false
                    $scope.riwayatForm = false
                    $scope.inputObatOrder = true;
                });
            }
            $scope.listJenisKemasan2 = [
                { id: 1, nama: '1x', selected: false },
                { id: 2, nama: '2x', selected: false },
                { id: 3, nama: '3x', selected: false },
                { id: 4, nama: '4x', selected: false },
                { id: 5, nama: '5x', selected: false },
                { id: 6, nama: '6x', selected: false },
                // Dan seterusnya...
            ];
            $scope.toggleKemasan = function (item) {
                $scope.item.jumlahiter = item.nama
            }; 
            $scope.listDataSigna = [
                {
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [
                        { "id": 1, "nama": "Pagi", 'isChecked': false },
                        { "id": 2, "nama": "Siang", 'isChecked': false },
                        { "id": 3, "nama": "Sore", 'isChecked': false },
                        { "id": 4, "nama": "Malam", 'isChecked': false }
                    ]
                }
            ];
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0
            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }
                $scope.item.aturanpakaitxt = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1' 
                if (jml == 0) {
                    $scope.item.aturanpakaitxt = ''
                }

            }
            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) return
                if ($scope.dataSelectedRiwayat.statusorder != "Menunggu") {
                    toastr.error('Tidak bisa di Hapus sudah di verifikasi')
                    return
                }
                var stt = '';
                if (confirm('Yakin Mau Menghapus Orderan? ')) {
                    stt = 'true';
                } else {
                    return;
                }
                medifirstService.post('emr/hapus-order-pelayananobatfarmasi', { norec: $scope.dataSelectedRiwayat.norec_order }).then(function (e) {
                    init();
                })
            }
            $scope.columnGridResepExist = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "100px",
                },

            ];
            $scope.klikExist = function (dataSelectedResepExist) {
                var dataProduk = []
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelectedResepExist.id) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk
                $scope.getSatuan()
            }

            $scope.PaketObat = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Masih Kosong");
                    return;
                }
    
                dataPaket=[]
                medifirstService.get("sysadminpaket/get-paket-obat?").then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.popUpPaketObat.center().open();
                })
            }

            $scope.SearchPaket = function () {
                loadDataPaket()
            }
            //ash
            function loadDataPaket(userId) {

                $scope.isRouteLoading = true;
                var paketId = ""
                var namaPaket = ""
                if ($scope.item.namaPaketS != undefined) {
                    namaPaket = "&namaPaket=" + $scope.item.namaPaketS
                }
                var userLogin = '';
                if (userId != undefined) {
                    userLogin = `&userLogin=${userId}`;
                }
                
                medifirstService.get("sysadminpaket/get-paket-obat?"
                    + paketId
                    + namaPaket
                    + userLogin
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        // group: ,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                })
            }

            $scope.PaketObat = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Masih Kosong");
                    return;
                }
    
                dataPaket=[]
                medifirstService.get("sysadminpaket/get-paket-obat?").then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.popUpPaketObat.center().open();
                })
            }
            $scope.columnGridSsS = [
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "40px"
                // },
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px"
                },
                {
                    "field": "namapaket",
                    "title": "Nama Paket Obat",
                    "width": "600px"
                }
            ]

            $scope.data2s = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qty",
                            "title": "Qty",
                            "width": "30px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "70px"
                        },
                        {
                            "field": "waktuminum",
                            "title": "Keterangan",
                            "width": "100px"
                        }
                    ]
                }
            };
            
            $scope.BatalPaket = function () {
                dataPaket =[];
                $scope.dataSource = new kendo.data.DataSource({
                    data: [],
                });
                $scope.popUpPaketObat.close();
            }

            $scope.tambahPaket = function () {
                //  
                if (dataPaket.length == 0) {
                    toastr.error("Pilih Paket Terlebih Dahulu !");
                    return;
                }
                // $scope.butPaket = false;
                $scope.popUpPaketObat.close();
                
                // data2.push(dataPaket)
                data2 = dataPaket
                $scope.dataGrid = new kendo.data.DataSource({
                    data: dataPaket
                });
                var subTotal = 0;
                for (var i = dataPaket.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(dataPaket[i].total)
                }
                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    
                // if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                //     $scope.item.rke = parseFloat($scope.item.rke) + 1
                // }
                // if ($scope.consis == 1) {
                //     $scope.statusConsis = true;
                // }
                // 26  0   t       jasa produksi non steril
                // 27  0   t       jasa pelayanan TPN
                // 28  0   t       jasa pelayanan handling cytotoxic
                // 29  0   t       jasa pelayanan IV Admixture
                // 30  0   t       jasa pelayanan Repacking obat injeksi
                // strStatus= $scope.item.produk.id
    
                Kosongkan()
    
                $scope.butPaket = false
                racikan = ''
                // statusTambah = false
            }
            $scope.klikGridSsS = function (dataSelectedSsS) {
                // $scope.butPaket = false;
                //  
                if(dataSelectedSsS == undefined){
                    toastr.error("tes!")
                        return;
                }

                $scope.isRouteLoading = true;
                dataPaket = [];
                if (dataSelectedSsS != undefined) {                    
                    $scope.dataSelectedSsS = dataSelectedSsS
                    var KetPakai = "";
                    if ($scope.item.KeteranganPakai) {
                        KetPakai = $scope.item.KeteranganPakai;
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan) {
                        KetPaketerangankai = $scope.item.keterangan;
                    }
    
                    var jRacikan = null
                    if ($scope.item.jenisRacikan != undefined) {
                        jRacikan = $scope.item.jenisRacikan.id
                    }
                    var dosis = 1;
                    var datas = 0;
                    for (let i = 0; i < $scope.dataSelectedSsS.details.length; i++) {
                        $scope.isRouteLoading = true;
                        const element = $scope.dataSelectedSsS.details[i];
                        if (element.produkfk != undefined) {
                            medifirstService.get("farmasi/get-produkdetail-emr?" +
                                "produkfk=" + element.produkfk +
                                "&ruanganfk=" + $scope.item.ruangan.id, true).then(function (dat) {
                                    dataProdukDetail = dat.data.detail[0];
                                    var nilaiKonversi = 1;
                                    datas = datas + 1;
                                    var stok = dat.data.jmlstok / nilaiKonversi
                                    var kekuatan = dat.data.kekuatan
                                    var sediaan = dat.data.sediaan
                                    // if (parseFloat(stok) < parseFloat(element.qty)) {
                                    //     toastr.error("Stok untuk obat " + element.namaproduk + " kurang dari stok ruangan")
                                    //     return;
                                    // }
                                    var nomor = 0
                                    if (dataPaket == undefined) {
                                        nomor = 1
                                    } else {
                                        nomor = dataPaket.length + 1
                                    }
                                    let ispagi =1
                                    if (element.ispagi == false){
                                        ispagi=0
                                    }
                                    let issiang=1
                                    if (element.issiang == false) {
                                        issiang =0
                                    }
                                    let issore=1
                                    if (element.issore == false) {
                                        issore =0
                                    }
                                    let ismalam=1
                                    if  (element.ismalam == false){
                                        ismalam=0
                                    }
                                    var data = {
                                        no: nomor,
                                        noregistrasifk: norec_apd,
                                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                                        generik: null,
                                        hargajual: String(dataProdukDetail.hargajual),
                                        jenisobatfk: jRacikan,
                                        kelasfk: $scope.item.kelas.id,
                                        stock: String(stok),
                                        harganetto: String(dataProdukDetail.hargajual),
                                        nostrukterimafk: dataProdukDetail.nostrukterimafk,
                                        ruanganfk: $scope.item.ruangan.id,
                                        rke: nomor,
                                        jeniskemasanfk: element.jeniskemasanfk,
                                        jeniskemasan: element.jeniskemasan,
                                        aturanpakai: element.aturanpakai,
                                        ispagi: ispagi,
                                        issiang: issiang,
                                        issore: issore,
                                        ismalam: ismalam,
                                        routefk: null,
                                        route: null,
                                        asalprodukfk: dataProdukDetail.objectasalprodukfk,
                                        asalproduk: dataProdukDetail.asalproduk,
                                        produkfk: element.produkfk,
                                        namaproduk: element.namaproduk,
                                        nilaikonversi: nilaiKonversi,
                                        satuanstandarfk: element.objectsatuanstandarfk,
                                        satuanstandar: element.satuanstandar,
                                        satuanviewfk: element.objectsatuanstandarfk,
                                        satuanview: element.satuanstandar,
                                        jmlstok: String(stok),
                                        jumlah: element.qty,
                                        jumlahobat: String(element.qty),
                                        dosis: 1,
                                        hargasatuan: String(dataProdukDetail.hargajual),
                                        hargadiscount: String(0),
                                        total: (parseFloat(element.qty)*parseFloat(dataProdukDetail.hargajual)),
                                        jmldosis: String(element.qty) + '/' + String(1) + '/' + String(kekuatan),
                                        jasa: 0,
                                        waktuminum: element.waktuminum
                                    }
                                    dataPaket.push(data);
                                    $scope.isRouteLoading = false;
                                    if (datas == $scope.dataSelectedSsS.details.length) {
                                        $scope.butPaket = true    
                                    }
                                    
                                });
                            
                            
                            
                                
                        }
                    }
    
                }
            }

            $scope.reOrder = function (){
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                medifirstService.get("farmasi/reorder-eresep?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                    //
                    $scope.isRouteLoading = false;
                    $scope.norecOrder = ''
                    $scope.item.resep = $scope.dataSelectedRiwayat.noorder
                    $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                    // $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                    $scope.item.tglresep = new Date($scope.item.tglresep);
                    $scope.item.tglresepAkhir = new Date($scope.item.tglresepAkhir);
                    if ($scope.dataSelectedRiwayat.cekreseppulang == "✔") {
                        $scope.checkResepPulang = true;
                    }else{
                        $scope.checkResepPulang = false;
                    }
                    
                    data2 = dat.data.orderpelayanan
                    for (var i = data2.length - 1; i >= 0; i--) {



                        data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                        data2[i].tglregistrasi = $scope.item.tglregistrasi

                        data2[i].kelasfk = $scope.item.kelas.id

                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });


                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.rke = data2.length + 1
                    $scope.item.totalSubTotal = subTotal
                    $scope.riwayatFormResep = false
                    $scope.riwayatForm = false
                    $scope.inputObatOrder = true;
                });
            }
        // }
            //*batas apotik*//
            function loadAssesmentRehab() {
                medifirstService.get('emr/get-assesment-fisioterapi?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                     
                    $scope.data.names[0].s = dat.data.s;
                    $scope.data.names[0].o = dat.data.o;
                    $scope.data.names[0].a = dat.data.a;
                    $scope.data.names[0].p = dat.data.p;
                    loadIcd10()
                })
            }
            $scope.hapusGrid = function() {
                 
                if ($scope.modelGrid.norec == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return
                }
                $scope.popUpDeletePassword.center().open()
            }
            $scope.savePasswordDelete = function() {
                if ($scope.item.password12 != "bener") {
                    toastr.error('Password Salah !')
                    return
                }
                let objSave = {
                    norec: $scope.modelGrid.norec
                }
                medifirstService.post('emr/delete-cppt', objSave).then(function(e) {
                    let jsonLog = {
                        'jenislog': "Delete CPPT",
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Delete CPPT ' + 'Alasan : ' + $scope.item.alasanHapus + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': [],
                        'jenisemr': 'Catatan Dokter',
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {
                        // debugger
                        //$scope.popUpDeletePassword.close()
                        //$scope.item.alasanHapus = undefined
                        //init()
                        //LoadData();
                    })
                })
                $scope.popUpDeletePassword.close()
                $scope.item.alasanHapus = undefined
                LoadCacheHelper();

            }
            $scope.ambilDariVitalSign = function() {
                medifirstService.get('emr/get-vital-sign-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                     
                    let vs = dat.data
                    let tampungnoregis = vs[0].noregistrasifk
                    let tampungtgl = vs[0].tgl
                    const dataReal = [];
                    let tinggibadan = ''
                    let beratbadan = ''
                    let nadi = ''
                    let kesadaran = ''
                    let spo2 = ''
                    let keadaanumum = ''
                    let e = ''
                    let m = ''
                    let v = ''
                    let tekanandarah = ''
                    let suhu = ''
                    let pernapasan = ''
                    for(let i = 0; i < vs.length; i++) {
                        if (tampungnoregis == vs[i].noregistrasifk) {
                            if (tampungtgl == vs[i].tgl) {
                                if (vs[i].tinggibadan != '') {
                                    tinggibadan = vs[i].tinggibadan
                                }
                                if (vs[i].beratbadan != '') {
                                    beratbadan = vs[i].beratbadan
                                }
                                if (vs[i].nadi != '') {
                                    nadi = vs[i].nadi
                                }
                                if (vs[i].kesadaran != '') {
                                    let panjang = vs[i].kesadaran.length
                                    let temukan = vs[i].kesadaran.indexOf("~");
                                    let filter = vs[i].kesadaran.slice(temukan, panjang)
                                    filter = filter.replace("~", "")
                                    kesadaran = filter
                                }
                                if (vs[i].spo2 != '') {
                                    spo2 = vs[i].spo2
                                }
                                if (vs[i].keadaanumum != '') {
                                    keadaanumum = vs[i].keadaanumum
                                }
                                if (vs[i].e != '') {
                                    let panjang = vs[i].e.length
                                    let temukan = vs[i].e.indexOf("~");
                                    let filter = vs[i].e.slice(temukan, panjang)
                                    filter = filter.replace("~", "")
                                    e = filter
                                }
                                if (vs[i].m != '') {
                                    let panjang = vs[i].m.length
                                    let temukan = vs[i].m.indexOf("~");
                                    let filter = vs[i].m.slice(temukan, panjang)
                                    filter = filter.replace("~", "")
                                    m = filter
                                }
                                if (vs[i].v) {
                                    let panjang = vs[i].v.length
                                    let temukan = vs[i].v.indexOf("~");
                                    let filter = vs[i].v.slice(temukan, panjang)
                                    filter = filter.replace("~", "")
                                    v = filter
                                }
                                if (vs[i].tekanandarah != '') {
                                    tekanandarah = vs[i].tekanandarah
                                }
                                if (vs[i].suhu != '') {
                                    suhu = vs[i].suhu
                                }
                                if (vs[i].pernapasan != '') {
                                    pernapasan = vs[i].pernapasan
                                }
                                if (tinggibadan != '') {
                                    if (beratbadan != '') {
                                        if (nadi != '') {
                                            if (kesadaran != '') {
                                                if (spo2 != '') {
                                                    if (keadaanumum != '') {
                                                        if (e != '') {
                                                            if (m != '') {
                                                                if (v != '') {
                                                                    if (tekanandarah != '') {
                                                                        if (suhu != '') {
                                                                            if (pernapasan != '') {
                                                                                dataReal.push({ namapasien: vs[i].namapasien, nocm: vs[i].nocm, tgl: vs[i].tgl, tinggibadan: tinggibadan, beratbadan: beratbadan, nadi: nadi, kesadaran: kesadaran, spo2: spo2, keadaanumum: keadaanumum, e: e, m: m, v: v, tekanandarah: tekanandarah, suhu: suhu, pernapasan: pernapasan});
                                                                                tampungnoregis = vs[i].noregistrasifk
                                                                                tampungtgl = vs[i].tgl
                                                                                tinggibadan = ''
                                                                                beratbadan = ''
                                                                                nadi = ''
                                                                                kesadaran = ''
                                                                                spo2 = ''
                                                                                keadaanumum = ''
                                                                                e = ''
                                                                                m = ''
                                                                                v = ''
                                                                                tekanandarah = ''
                                                                                suhu = ''
                                                                                pernapasan = ''
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                tampungnoregis = vs[i].noregistrasifk
                                tampungtgl = vs[i].tgl
                                i = i - 1;
                            }
                        } else {
                            tampungnoregis = vs[i].noregistrasifk
                            tampungtgl = vs[i].tgl
                            i = i - 1;
                        }
                    }
                     
                    $scope.sourceVitalSign = new kendo.data.DataSource({
                        data: dataReal,
                        length: dataReal.length,
                        pageSize: 20
                    });
                    $scope.gridVitalSign = {
                        pageable: true,
                        scrollable: true,
                        columns: [
                            { field: "nocm", title: "No CM", width: 80 },
                            { field: "namapasien", title: "Nama Pasien", width: 120 },
                            { field: "tgl", title: "Tgl Input Vital Sign", width: 140 },
                            { field: "tinggibadan", title: "Tinggi Badan", width: 150 },
                            { field: "beratbadan", title: "Berat Badan", width: 120 },
                            { field: "nadi", title: "Nadi", width: 120 },
                            { field: "kesadaran", title: "Kesadaran", width: 150 },
                            // { field: "spo2", title: "SPO 2", width: 120 },
                            // { field: "keadaanumum", title: "Keadaan Umum", width: 120 },
                            { field: "tekanandarah", title: "Tekanan Darah", width: 120 },
                            { field: "pernapasan", title: "Pernapasan", width: 120 },
                            { field: "suhu", title: "Suhu", width: 120 },
                            { field: "e", title: "E", width: 120 },
                            { field: "m", title: "M", width: 120 },
                            { field: "v", title: "V", width: 120 },
                        ],
                    };
                })
                $scope.popUpVitalSign.center().open();
            }
            $scope.ambilVitalSign = function() {
                // debugger
                $scope.dataSelectedVitalSign
                if ($scope.dataSelectedVitalSign.keadaanumum != undefined) {
                    tampungVitalSign = tampungVitalSign + "Keadaan Umum : " + $scope.dataSelectedVitalSign.keadaanumum + "\n"
                }
                if ($scope.dataSelectedVitalSign.kesadaran != undefined) {
                    tampungVitalSign = tampungVitalSign + "Kesadaran : " + $scope.dataSelectedVitalSign.kesadaran + "\n"
                }
                if ($scope.dataSelectedVitalSign.e != undefined) {
                    tampungVitalSign = tampungVitalSign + "E : " + $scope.dataSelectedVitalSign.e + "\n"
                }
                if ($scope.dataSelectedVitalSign.m != undefined) {
                    tampungVitalSign = tampungVitalSign + "M : " + $scope.dataSelectedVitalSign.m + "\n"
                }
                if ($scope.dataSelectedVitalSign.v != undefined) {
                    tampungVitalSign = tampungVitalSign + "V : " + $scope.dataSelectedVitalSign.v + "\n"
                }
                if ($scope.dataSelectedVitalSign.beratbadan != undefined) {
                    tampungVitalSign = tampungVitalSign + "Berat Badan : " + $scope.dataSelectedVitalSign.beratbadan + "\n"
                }
                if ($scope.dataSelectedVitalSign.tekanandarah != undefined) {
                    tampungVitalSign = tampungVitalSign + "Tekanan Darah : " + $scope.dataSelectedVitalSign.tekanandarah + "\n"
                }
                if ($scope.dataSelectedVitalSign.nadi != undefined) {
                    tampungVitalSign = tampungVitalSign + "Nadi : " + $scope.dataSelectedVitalSign.nadi + "\n"
                }
                if ($scope.dataSelectedVitalSign.pernapasan != undefined) {
                    tampungVitalSign = tampungVitalSign + "Pernapasan : " + $scope.dataSelectedVitalSign.pernapasan + "\n"
                }
                if ($scope.dataSelectedVitalSign.spo2 != undefined) {
                    tampungVitalSign = tampungVitalSign + "Spo 2 : " + $scope.dataSelectedVitalSign.spo2 + "\n"
                }
                if ($scope.dataSelectedVitalSign.suhu != undefined) {
                    tampungVitalSign = tampungVitalSign + "Suhu : " + $scope.dataSelectedVitalSign.suhu + "\n"
                }
                $scope.data.names[0].o = tampungVitalSign
                toastr.success('Berhasil !', 'Success !')
                $scope.popUpVitalSign.close();
            }
            $scope.ambilPengkajianMedisKebidanan = function(index) {
                // debugger
                $scope.dokter = false;
                medifirstService.get('emr/get-pengkajian-awal-medis-kebidanan?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let tampungo = ''
                    let tampunga = ''
                    let tampungp = ''
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        if (pengkajianmedis[i].emrdfk == 2345) {
                            $scope.data.names[index].s = $scope.data.names[index].s + " Anamnesis Keluhan Utama " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1168) {
                            tampungo = tampungo + " Kesadaran : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2367) {
                            tampungp = tampungp + " E : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2368) {
                            tampungp = tampungp + " M : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2369) {
                            tampungp = tampungp + " V : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1169) {
                            tampungo = tampungo + " Tekanan Darah : " + pengkajianmedis[i].value + " mmHg " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1170) {
                            tampungo = tampungo + " Nadi : " + pengkajianmedis[i].value + " x/menit " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1172) {
                            tampungo = tampungo + " Suhu : " + pengkajianmedis[i].value + " °C " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1173) {
                            tampungo = tampungo + " Pernapasan : " + pengkajianmedis[i].value + " x/menit " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2365) {
                            tampungo = tampungo + " Keadaan Umum : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1174) {
                            tampungo = tampungo + " Tinggi Badan : " + pengkajianmedis[i].value + " cm " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1175) {
                            tampungo = tampungo + " Berat Badan : " + pengkajianmedis[i].value + " kg " + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2352) {
                            tampungo = tampungo + " KEPALA DAN LEHER : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2353) {
                            tampungo = tampungo + " DADA DAN PUNGGUNG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2354) {
                            tampungo = tampungo + " PARU : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2355) {
                            tampungo = tampungo + " JANTUNG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2356) {
                            tampungo = tampungo + " PERUT DAN PINGGANG : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2357) {
                            tampungo = tampungo + " ANGGOTA GERAK : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2358) {
                            tampungo = tampungo + " GENITALIA DAN ANUS : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2359) {
                            tampunga = tampunga + " DAFTAR MASALAH / DIAGNOSIS : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2360) {
                            tampunga = tampunga + " PENGKAJIAN MASALAH : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2361) {
                            tampungp = tampungp + " RENCANA PENATALAKSANAAN : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2362) {
                            tampungp = tampungp + " INSTRUKSI MEDIS : " + pengkajianmedis[i].value + "\n"
                        }
                    }
                    $scope.data.names[index].o = $scope.data.names[index].o + tampungo
                    $scope.data.names[index].a = $scope.data.names[index].a + tampunga
                    $scope.data.names[index].p = $scope.data.names[index].p + tampungp
                    tampungo = ''
                    tampunga = ''
                    tampungp = ''
                })
            }
            $scope.ambilPengkajianMedisMata = function(index) {
                // debugger
                $scope.dokter = false;
                medifirstService.get('emr/get-pengkajian-awal-medis-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                    let tampungs = ''
                    let tampungo = ''
                    let tampunga = ''
                    let tampungp = ''
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        if (pengkajianmedis[i].emrdfk == 1261) {
                            tampungs = tampungs + "Keluhan Utama : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1262) {
                            tampungs = tampungs + "Keluhan Tambahan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1263) {
                            tampungs = tampungs + "Riwayat Penyakit Lalu : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1325) {
                            tampungo = tampungo + " Visus Sine Koreksi Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1324) {
                            tampungo = tampungo + " Visus Sine Koreksi Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1327) {
                            tampungo = tampungo + " Visus Kacamata Koreksi Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1326) {
                            tampungo = tampungo + " Visus Kacamata Koreksi Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1329) {
                            tampungo = tampungo + " Addisi Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1328) {
                            tampungo = tampungo + " Addisi Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1331) {
                            tampungo = tampungo + " Kacamata Lama Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1330) {
                            tampungo = tampungo + " Kacamata Lama Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1586) {
                            tampungo = tampungo + " Streak Retinoskopi Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1585) {
                            tampungo = tampungo + " Streak Retinoskopi Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1588) {
                            tampungo = tampungo + " Kedudukan Bola Mata Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1587) {
                            tampungo = tampungo + " Kedudukan Bola Mata Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1590) {
                            tampungo = tampungo + " Gerakan Bola Mata Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1589) {
                            tampungo = tampungo + " Gerakan Bola Mata Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1592) {
                            tampungo = tampungo + " Palpebra Superior Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1591) {
                            tampungo = tampungo + " Palpebra Superior Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1594) {
                            tampungo = tampungo + " Palrebra Inferior Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1593) {
                            tampungo = tampungo + " Palrebra Inferior Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1596) {
                            tampungo = tampungo + " Konjungtiva Palpebralis Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1595) {
                            tampungo = tampungo + " Konjungtiva Palpebralis Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1598) {
                            tampungo = tampungo + " Konjungtiva Bulbi Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1597) {
                            tampungo = tampungo + " Konjungtiva Bulbi Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1600) {
                            tampungo = tampungo + " Kornea Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1599) {
                            tampungo = tampungo + " Kornea Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1602) {
                            tampungo = tampungo + " Kamera Oculi Anterior Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1601) {
                            tampungo = tampungo + " Kamera Oculi Anterior Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1604) {
                            tampungo = tampungo + " Iris Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1603) {
                            tampungo = tampungo + " Iris Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1606) {
                            tampungo = tampungo + " Pupil Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1605) {
                            tampungo = tampungo + " Pupil Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1608) {
                            tampungo = tampungo + " Lensa Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1607) {
                            tampungo = tampungo + " Lensa Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1610) {
                            tampungo = tampungo + " Vitreous Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1609) {
                            tampungo = tampungo + " Vitreous Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1613) {
                            tampungo = tampungo + " Keterangan Gambar Funduskopi / Retina Kiri : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1614) {
                            tampungo = tampungo + " Keterangan Gambar Funduskopi / Retina Kanan : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1264) {
                            tampungo = tampungo + " Pemeriksaan Khusus : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1265) {
                            tampunga = tampunga + " Diagnosa Kerja : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1266) {
                            tampunga = tampunga + " Diagnosa Banding : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 1267) {
                            tampungp = tampungp + " Rencana Pengobatan / Tindakan : " + pengkajianmedis[i].value + "\n"
                        }
                    }
                    $scope.data.names[index].s = $scope.data.names[index].s + tampungs
                    $scope.data.names[index].o = $scope.data.names[index].o + tampungo
                    $scope.data.names[index].a = $scope.data.names[index].a + tampunga
                    $scope.data.names[index].p = $scope.data.names[index].p + tampungp
                    tampungs = ''
                    tampungo = ''
                    tampunga = ''
                    tampungp = ''
                })
            }
            // kepentingan diagnosa
            $scope.checkboxClicked = function (dat, index) {
                 
                if ($scope.data.names[index].kasusbaru == true) {
                    $scope.data.names[index].kasusbaru = true
                    $scope.data.names[index].kasuslama = false
                } else {
                    $scope.data.names[index].kasusbaru = false
                    $scope.data.names[index].kasuslama = true
                }
            }
            $scope.checkboxClicked2 = function (dat, index) {
                if ($scope.data.names[index].kasuslama == false) {
                    $scope.data.names[index].kasusbaru = true
                    $scope.data.names[index].kasuslama = false
                } else {
                    $scope.data.names[index].kasusbaru = false
                    $scope.data.names[index].kasuslama = true
                }
            }

            function getValueAsesmenRehab() {
                medifirstService.get('emr/get-value-asesmen-rehab?nocm=' + $scope.cc.nocm).then(function (e) {
                    if (e.data.data.length > 0) {
                        let combineValuesS = ''
                        let combineValuesO = ''
                        let combineValuesA = '\n'
                        let combineValuesP = '\n'
                        let alergi = ''
                        let keterangan = ''
                        let otherValuesS = ''
                        let kesadaran = ''
                        let td = ''
                        let n = ''
                        let r = ''
                        let s = ''
                        let nyeri = ''
                        let lokasi = ''
                        let intensitas = ''
                        let score = ''
                        let tb = ''
                        let bb = ''
                        let resikojatuh = ''
                        let ssp = ''
                        let atregio = ''
                        let otherValuesO1 = ''
                        let otherValuesO2 = ''
            
                        for (let i = 0; i < e.data.data.length; i++) {
                            if (e.data.data[i].emrdfk == 8211) {
                                if (e.data.data[i].value == "1") {
                                    alergi = 'Riwayat Alergi : Ya'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8212) {
                                if (e.data.data[i].value == "1") {
                                    alergi = 'Riwayat Alergi : Tidak'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8213) {
                                keterangan = ' Ket : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8219) {
                                otherValuesS += 'Pemeriksaan Rehabilitasi Medik (dr.SpKFR) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8220) {
                                otherValuesS += 'Anamnesa (Keluhan Utama, RPS, RPD) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8221) {
                                otherValuesS += 'Riwayat Sosial Ekonomi : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8222) {
                                otherValuesS += 'Riwayat Avocasional & Vocasional : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8223) {
                                kesadaran = 'Kesadaran : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8224) {
                                td = 'Td : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8225) {
                                n = ' N : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8226) {
                                r = ' R : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8227) {
                                s = ' S : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8228) {
                                if (e.data.data[i].value == "1") {
                                    nyeri = 'Nyeri : Ya'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8229) {
                                if (e.data.data[i].value == "1") {
                                    nyeri = 'Nyeri : Tidak'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8230) {
                                lokasi = ' Lokasi : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8231) {
                                intensitas = ' Intensitas (1-10) : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 3275) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Tidak ada nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 3276) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Sedikit nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 3277) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Cukup nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 3278) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Lumayan Nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 3279) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Sangat Nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 3280) {
                                if (e.data.data[i].value == "1") {
                                    score = 'Score : Amat sangat nyeri'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8232) {
                                tb = 'TB : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8233) {
                                bb = ' BB : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8234) {
                                otherValuesO1 += 'Postur : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8235) {
                                otherValuesO1 += 'Ambulasi : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8237) {
                                if (e.data.data[i].value == "1") {
                                    resikojatuh = 'Resiko jatuh : Ya'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8236) {
                                if (e.data.data[i].value == "1") {
                                    resikojatuh = 'Resiko jatuh : Tidak'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8238) {
                                ssp = 'Pemeriksaan SSP (Nerves : I - XII) : ' + e.data.data[i].value
                            }
                            if (e.data.data[i].emrdfk == 8239) {
                                if (e.data.data[i].value == "1") {
                                    atregio = 'Pemeriksaan at Regio (a/r) : a'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8240) {
                                if (e.data.data[i].value == "1") {
                                    atregio = 'Pemeriksaan at Regio (a/r) : r'
                                }
                            }
                            if (e.data.data[i].emrdfk == 8241) {
                                otherValuesO2 += 'head and neck : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8242) {
                                otherValuesO2 += 'a/r thoraks : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8243) {
                                otherValuesO2 += 'a/r abdomen : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8244) {
                                otherValuesO2 += 'a/r back (punggung) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8245) {
                                otherValuesO2 += 'a/r anggota gerak : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8246) {
                                otherValuesO2 += 'Look (deformitas, pola jalan) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8247) {
                                otherValuesO2 += 'Feel (Tanda Radang, Nyeri Tekan, Tonus, Turgor) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8248) {
                                otherValuesO2 += 'Movement (ROM, MMT, Nyeri Gerak) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8249) {
                                otherValuesO2 += 'Test Provokasi : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8250) {
                                otherValuesO2 += 'Test Fungsional (lampiran) : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8251) {
                                otherValuesO2 += 'Pemeriksaan Penunjang : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8252) {
                                combineValuesA += 'Impairment : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8253) {
                                combineValuesA += 'Disability : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8254) {
                                combineValuesA += 'Handycap : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8256) {
                                combineValuesA += 'Problem : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8257) {
                                combineValuesP += 'Program : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8258) {
                                combineValuesP += 'Goal : ' + e.data.data[i].value + '\n'
                            }
                            if (e.data.data[i].emrdfk == 8259) {
                                combineValuesP += 'Evaluasi : ' + e.data.data[i].value + '\n'
                            }
                        }
            
                        combineValuesS += alergi + keterangan + '\n' + otherValuesS
                        $scope.data.names[0].s += combineValuesS.trim()

                        combineValuesO += kesadaran + '\n' + td + n + r + s + '\n' + nyeri + lokasi + intensitas + '\n' + score + '\n' + tb + bb + '\n' + otherValuesO1 + '\n' + resikojatuh + '\n' + ssp + '\n' + atregio + '\n' + otherValuesO2
                        $scope.data.names[0].o += combineValuesO.trim()

                        $scope.data.names[0].a += combineValuesA.trim()

                        $scope.data.names[0].p += combineValuesP.trim()
                    }
                });

                var combineValuesI = ''
                medifirstService.get('emr/get-data-konsul-rehab?nocm=' + $scope.cc.nocm).then(function (e) {
                    var getData = e.data.data
                    if (getData != null) {
                        combineValuesI += 'Diagnosa : ' + getData.diagnosa + '\n' + 'Permintaan Terapi : ' + getData.terapi
                    }

                    $scope.data.names[0].it += combineValuesI.trim()
                })
            }
            
        }
    ])
})