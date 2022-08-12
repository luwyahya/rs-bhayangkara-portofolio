define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanDokterCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state',
        'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, FormGroup, FormArray, FormBuilder) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            $scope.modelgrid = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 518
            var dataLoad = []
            $scope.item = {};
            // $scope.checked = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            var paramSearch = ''
            $scope.noemr = ''
            $scope.user = {};
            $scope.item.tgl = []
            $scope.item.jp = []
            $scope.item.hp = []
            $scope.showbtn = true
            $scope.item.it = []
            $scope.item.dk = []
            $scope.istempatLaporan = true;
            $scope.grid = true;
            $scope.input = false;
            var nomorEMRSS = ''
            LoadCacheHelper();
            LoadCombo();

            function LoadCombo() {

                medifirstService.get("emr/get-combo").then(function (dat) {
                    $scope.listJenisPetugas = dat.data.jenispetugas
                    $scope.listDokter = dat.data.pegawaiAll
                    $scope.listPerawat = dat.data.pegawai
                    $scope.listTandaTangan = dat.data.pegawaiAll
                })

                medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.cc.noregistrasi).then(function (dat) {

                    $scope.listAskep = dat.data.askep
                })
            }

            function LoadCacheHelper() {

                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
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
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatandokter", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    // var nomorEMRSS = ''
                    cacheHelper.set('cacheEmrIgd', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '518'
                        LoadData();
                        // setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {

                    }
                });

                function setobjectToModel(nomorEMRSS, emrfk) {
                    medifirstService.get("emr/get-emr-transaksi-detail-polri-2?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {

                        $scope.isLoading = false
                        var chekedd = false
                        // $scope.item.obj = []

                        // $scope.item.obj2 = []
                        // $scope.item.obj[68] = $scope.now
                        dataLoad = dat.data.data
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                if (dataLoad[i].emrdfk == 153) {
                                    $scope.item.tgl.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                    // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 154) {
                                    $scope.item.jp.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                    // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 155) {
                                    $scope.item.hp.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                    // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 156) {
                                    $scope.item.it.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                    // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 157) {
                                    $scope.item.dk.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                    // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                            }

                        }
                        debugger
                        if ($scope.item.tgl.length > 20 && $scope.item.jp.length > 20 && $scope.item.hp.length > 20 && $scope.item.it.length > 20) {
                            // setRow();
                            // setRow2();
                        } else {
                            // setRow();
                        }
                    })

                }

            }

            function LoadData() {
                debugger
                var emr = ''
                if (nomorEMRSS != undefined) {
                    emr = "emrpasien=" + nomorEMRSS
                } else {
                    emr = ''
                }
                medifirstService.get("emr/get-history-cppt?" + emr).then(function (dat) {


                    var cppt = dat.data
                    if (cppt[0].verifikasi == 1) {
                        $scope.showbtn = false
                    } else {
                        $scope.showbtn = true
                    }

                    $scope.sourceResumeHead = new kendo.data.DataSource({
                        data: cppt,
                        pageSize: 5,

                    });
                })
                $scope.resumeOptHead = {
                    // toolbar: [{
                    //     name: "create", text: "Tambah",
                    //     template: '<button ng-click="AddObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    // },],
                    selectable: "row",
                    pageable: true,
                    scrollable: true,
                    columns: [{
                        "field": "tgljam",
                        "title": "Tgl CPPT",
                        "width": "50px"
                    },
                    {
                        "field": "handover",
                        "title": "Profesi / Bagian",
                        "width": "120px",
                    },
                    // {
                    //     "field": "hasilpemeriksaan",
                    //     "title": "Hasil Pemeriksaan",
                    //     "width": "120px",
                    // },
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
                        "field": "instruksi",
                        "title": "Planning",
                        "width": "120px",
                    },
                    {
                        "field": "dpjp",
                        "title": "Verifikasi DPJP",
                        "width": "120px",
                    },
                        // { field: "emrpasienfk", title: "No", width: 40 },
                        // { field: "tglresume", title: "Tgl Resume", width: 150 },
                        // { field: "koderesume", title: "Kode Resume", width: 150 },
                        // { field: "noregistrasi", title: "No Registrasi", width: 150 },
                        // { field: "namaruangan", title: "Ruangan", width: 150 },
                        // { field: "tglkontrolpoli", title: "Tgl Kontrol Poliklinik", width: 150 },
                        // { field: "namadokter", title: "Pegawai", width: 150 },
                        // { field: "ringkasanriwayatpenyakit", title: "Ringkasan Riwayat Penyakit", width: 250 },
                        // { field: "pemeriksaanfisik", title: "Pemerisaan Fisik", width: 250 },
                        // { field: "pemeriksaanpenunjangaddlab", title: "Pemerisaan Penunjang", width: 250 },
                        // { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 250 },
                        // { field: "diagnosisawal", title: "Diagnosi Awal", width: 150 },
                        // { field: "diagnosissekunder", title: "Diagnosis Sekunder", width: 150 },
                        // { field: "diet", title: "Diet", width: 150 },
                        // // { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                        // { field: "hasillab", title: "Hasil Lab", width: 150 },
                        // { field: "instruksianjuran", title: "Intruksi", width: 150 },
                        // { field: "kondisiwaktukeluar", title: "Kondisi Keluar", width: 150 },
                        // { field: "pengobatandilanjutkan", title: "Pengobatan Dilanjutkan", width: 150 },
                        // { field: "tindakanprosedur", title: "Tindakan Prosedur", width: 150 },
                        // { field: "terapi", title: "Terapi", width: 120 },
                        // { field: "alasanrawat", title: "Alasan diRawat", width: 150 },
                        // { field: "kondisiklinis", title: "Kondisi Klinis", width: 150 },
                        // { field: "obatobatakhir", title: "Obat Pulang", width: 150 },
                        // { field: "pasienkeluarga", title: "Pasien Keluarga", width: 250 },

                        // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
                    ],

                };
            }
            $scope.showInput = function () {

                if (nomorEMRSS == '') {
                    $scope.grid = false;
                    $scope.input = true;
                    $scope.inputsave = true;
                    $scope.editsave = false;
                    return
                }
                medifirstService.get('emr/get-status-verif?emrpasien=' + nomorEMRSS).then(function (dat) {
                    debugger
                    if (dat.data.length > 0) {
                        if (dat.data[0].verifikasi == 1) {
                            alert('Data Sudah Di Verifikasi ! Tidak Dapat Ditambah Lagi !')
                            $scope.grid = true;
                            $scope.input = false;
                            return;

                        } else {

                        }
                    } else {

                    }
                })

                $scope.grid = false;
                $scope.input = true;
                $scope.inputsave = true;
                $scope.editsave = false;
                $scope.data = {
                    names: [{ idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :" }]
                };
            }
            $scope.data = {
                names: [{ idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :" }]
            };
            $scope.TambahSoap = function (index) {

                var ax = $scope.data.names[index].list
                $scope.data.names[index].o = ax.caption;
                medifirstService.get("emr/get-dataaskep?noemr=" + ax.emrpasienfk + "&emrfk=" +
                    ax.id).then(function (dat) {
                        var a = '';
                        var o = '';
                        var p = '';
                        var data = dat.data.askep
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].kolom == 1) {
                                a = a + data[i].captionemr + "\n"
                            }
                            if (data[i].kolom == 2) {
                                o = o + data[i].captionemr + "\n"
                            }
                            if (data[i].kolom == 3) {
                                p = p + data[i].captionemr + "\n"
                            }
                        }
                        $scope.data.names[index].a = a;
                        $scope.data.names[index].p = p;
                        $scope.data.names[index].it = p;
                        $scope.data.names[index].o = o;
                    })

            }
            $scope.Tambah = function (index) {

                var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :" };
                if ($scope.data.names.length <= index + 1) {
                    $scope.data.names.splice(index + 1, 0, name);
                }
            }

            function setRow(index = 1) {

                for (var i = 0; i < $scope.item.tgl.length; i++) {
                    if ($scope.data.names[i] != undefined) {
                        // $scope.data.names[i].tgl = $scope.item.tgl[i].values
                        // $scope.data.names[i].norectgl = $scope.item.tgl[i].norec
                    }
                    for (var j = 0; j < $scope.item.jp.length; j++) {
                        if ($scope.data.names[j] != undefined) {
                            // $scope.data.names[j].tkh = $scope.item.tkh[j].values
                            // $scope.data.names[j].norectkh = $scope.item.tkh[j].norec
                        }
                        for (var k = 0; k < $scope.item.hp.length; k++) {
                            if ($scope.data.names[k] != undefined) {
                                // $scope.data.names[k].dg = {id: $scope.item.dg[k].id, caption: $scope.item.dg[k].values}
                                // $scope.data.names[k].norecdg = $scope.item.dg[k].norec
                            }
                            for (var l = 0; l < $scope.item.it.length; l++) {
                                if ($scope.data.names[l] != undefined) {
                                    // if ()
                                    // $scope.data.names[l].pg = {id: $scope.item.pg[l].id, namalengkap: $scope.item.pg[l].values}
                                    // $scope.data.names[l].norecpg = $scope.item.pg[l].norec
                                }
                                for (var n = 0; n < $scope.item.dk.length; n++) {
                                    if ($scope.data.names[n] != undefined) {

                                    }

                                    var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "" };
                                    if ($scope.data.names.length <= index + 1 && i == j && j == k && k == l && l == n) {
                                        $scope.data.names.splice(index + 1, 0, name);
                                        index = index + 1
                                    }
                                }
                            }
                        }
                    }
                }
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function (dat) {

                    for (var m = 0; m < dat.data.length; m++) {
                        $scope.data.names[m].tgl = dat.data[m].tgljam
                        $scope.data.names[m].jp = { id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi }
                        $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                        $scope.data.names[m].it = dat.data[m].instruksitenaga
                        $scope.data.names[m].dk = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                        $scope.data.names[m].norec = dat.data[m].norec
                        $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                        $scope.data.names[m].menyerahkan = { id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan }
                        $scope.data.names[m].menerima = { id: dat.data[m].id, namalengkap: dat.data[m].menerima }
                        $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                        $scope.data.names[m].ttd = { id: dat.data[m].id, namalengkap: dat.data[m].ttd }
                        if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgllapor = ""
                        } else {
                            $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].pi = { id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi }
                        if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgljawab = ""
                        } else {
                            $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].instruksi = { id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi }


                        if ($scope.data.names[m].verifikasi == 1) {
                            $scope.tgl = true;
                            $scope.jp = true;
                            $scope.hp = true;
                            $scope.it = true;
                            $scope.dk = true;
                            $scope.btn = true;
                            $scope.showbtn = false;
                        } else {
                            $scope.tgl = false;
                            $scope.jp = false;
                            $scope.hp = false;
                            $scope.it = false;
                            $scope.dk = false;
                            $scope.btn = false;
                            $scope.showbtn = true;
                        }
                    }
                })
            }

            function setRow2(index = 1) {

                for (var i = 0; i < 10; i++) {
                    if ($scope.data.names[i] != undefined) {
                        // $scope.data.names[i].tgl = $scope.item.tgl[i].values
                        // $scope.data.names[i].norectgl = $scope.item.tgl[i].norec
                    }
                    for (var j = 0; j < 10; j++) {
                        if ($scope.data.names[j] != undefined) {
                            // $scope.data.names[j].tkh = $scope.item.tkh[j].values
                            // $scope.data.names[j].norectkh = $scope.item.tkh[j].norec
                        }
                        for (var k = 0; k < 10; k++) {
                            if ($scope.data.names[k] != undefined) {
                                // $scope.data.names[k].dg = {id: $scope.item.dg[k].id, caption: $scope.item.dg[k].values}
                                // $scope.data.names[k].norecdg = $scope.item.dg[k].norec
                            }
                            for (var l = 0; l < 10; l++) {
                                if ($scope.data.names[l] != undefined) {
                                    // if ()
                                    // $scope.data.names[l].pg = {id: $scope.item.pg[l].id, namalengkap: $scope.item.pg[l].values}
                                    // $scope.data.names[l].norecpg = $scope.item.pg[l].norec
                                }
                                for (var n = 0; n < 10; n++) {
                                    if ($scope.data.names[n] != undefined) {

                                    }

                                    var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "" };
                                    if ($scope.data.names.length <= index + 1 && i == j && j == k && k == l && l == n) {
                                        $scope.data.names.splice(index + 1, 0, name);
                                        index = index + 1
                                    }
                                }
                            }
                        }
                    }
                }
                // medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function(dat) {
                //    
                //     for (var m = 0; m < 5; m++) {
                //         $scope.data.names[m].tgl = dat.data[m].tgljam
                //         $scope.data.names[m].jp = {id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi}
                //         $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                //         $scope.data.names[m].it = dat.data[m].instruksitenaga
                //         $scope.data.names[m].dk = {id: dat.data[m].id, namalengkap: dat.data[m].pegawai}
                //         $scope.data.names[m].norec = dat.data[m].norec
                //         $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                //         $scope.data.names[m].menyerahkan = {id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan}
                //         $scope.data.names[m].menerima = {id: dat.data[m].id, namalengkap: dat.data[m].menerima}
                //         $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                //         $scope.data.names[m].ttd = {id: dat.data[m].id, namalengkap: dat.data[m].ttd}
                //         if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                //             $scope.data.names[m].tgllapor = ""
                //         } else {
                //             $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                //         }
                //         $scope.data.names[m].pi = {id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi}
                //         if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                //             $scope.data.names[m].tgljawab = ""
                //         } else {
                //             $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                //         }
                //         $scope.data.names[m].instruksi = {id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi}


                //         if ($scope.data.names[m].verifikasi == 1) {
                //             $scope.tgl = true;
                //             $scope.jp = true;
                //             $scope.hp = true;
                //             $scope.it = true;
                //             $scope.dk = true;
                //             $scope.btn = true;
                //             $scope.showbtn = false;
                //         } else {
                //             $scope.tgl = false;
                //             $scope.jp = false;
                //             $scope.hp = false;
                //             $scope.it = false;
                //             $scope.dk = false;
                //             $scope.btn = false;
                //             $scope.showbtn = true; 
                //         }
                //     }
                // })
                loadTempEmr()
                setTimeout(function () {


                }, 5500);
                setRow3()
                // loadTempEmr2()
            }

            function setRow3(index = 11) {

                for (var i = 10; i < $scope.item.tgl.length; i++) {
                    if ($scope.data.names[i] != undefined) {
                        // $scope.data.names[i].tgl = $scope.item.tgl[i].values
                        // $scope.data.names[i].norectgl = $scope.item.tgl[i].norec
                    }
                    for (var j = 10; j < $scope.item.jp.length; j++) {
                        if ($scope.data.names[j] != undefined) {
                            // $scope.data.names[j].tkh = $scope.item.tkh[j].values
                            // $scope.data.names[j].norectkh = $scope.item.tkh[j].norec
                        }
                        for (var k = 10; k < $scope.item.hp.length; k++) {
                            if ($scope.data.names[k] != undefined) {
                                // $scope.data.names[k].dg = {id: $scope.item.dg[k].id, caption: $scope.item.dg[k].values}
                                // $scope.data.names[k].norecdg = $scope.item.dg[k].norec
                            }
                            for (var l = 10; l < $scope.item.it.length; l++) {
                                if ($scope.data.names[l] != undefined) {
                                    // if ()
                                    // $scope.data.names[l].pg = {id: $scope.item.pg[l].id, namalengkap: $scope.item.pg[l].values}
                                    // $scope.data.names[l].norecpg = $scope.item.pg[l].norec
                                }
                                for (var n = 10; n < $scope.item.dk.length; n++) {
                                    if ($scope.data.names[n] != undefined) {

                                    }

                                    var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "" };
                                    if ($scope.data.names.length <= index + 1 && i == j && j == k && k == l && l == n) {
                                        $scope.data.names.splice(index + 1, 0, name);
                                        index = index + 1
                                    }
                                }
                            }
                        }
                    }
                }
                // medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function(dat) {
                //    
                //     for (var m = 5; m < 10; m++) {
                //         $scope.data.names[m].tgl = dat.data[m].tgljam
                //         $scope.data.names[m].jp = {id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi}
                //         $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                //         $scope.data.names[m].it = dat.data[m].instruksitenaga
                //         $scope.data.names[m].dk = {id: dat.data[m].id, namalengkap: dat.data[m].pegawai}
                //         $scope.data.names[m].norec = dat.data[m].norec
                //         $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                //         $scope.data.names[m].menyerahkan = {id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan}
                //         $scope.data.names[m].menerima = {id: dat.data[m].id, namalengkap: dat.data[m].menerima}
                //         $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                //         $scope.data.names[m].ttd = {id: dat.data[m].id, namalengkap: dat.data[m].ttd}
                //         if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                //             $scope.data.names[m].tgllapor = ""
                //         } else {
                //             $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                //         }
                //         $scope.data.names[m].pi = {id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi}
                //         if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                //             $scope.data.names[m].tgljawab = ""
                //         } else {
                //             $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                //         }
                //         $scope.data.names[m].instruksi = {id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi}


                //         if ($scope.data.names[m].verifikasi == 1) {
                //             $scope.tgl = true;
                //             $scope.jp = true;
                //             $scope.hp = true;
                //             $scope.it = true;
                //             $scope.dk = true;
                //             $scope.btn = true;
                //             $scope.showbtn = false;
                //         } else {
                //             $scope.tgl = false;
                //             $scope.jp = false;
                //             $scope.hp = false;
                //             $scope.it = false;
                //             $scope.dk = false;
                //             $scope.btn = false;
                //             $scope.showbtn = true; 
                //         }
                //     }
                // })
                // setRow4()
                // setTimeout(function () {

                // }, 5000);

            }

            function loadTempEmr() {
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function (dat) {

                    for (var m = 0; m < 10; m++) {
                        $scope.data.names[m].tgl = dat.data[m].tgljam
                        $scope.data.names[m].jp = { id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi }
                        $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                        $scope.data.names[m].it = dat.data[m].instruksitenaga
                        $scope.data.names[m].dk = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                        $scope.data.names[m].norec = dat.data[m].norec
                        $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                        $scope.data.names[m].menyerahkan = { id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan }
                        $scope.data.names[m].menerima = { id: dat.data[m].id, namalengkap: dat.data[m].menerima }
                        $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                        $scope.data.names[m].ttd = { id: dat.data[m].id, namalengkap: dat.data[m].ttd }
                        if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgllapor = ""
                        } else {
                            $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].pi = { id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi }
                        if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgljawab = ""
                        } else {
                            $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].instruksi = { id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi }


                        if ($scope.data.names[m].verifikasi == 1) {
                            $scope.tgl = true;
                            $scope.jp = true;
                            $scope.hp = true;
                            $scope.it = true;
                            $scope.dk = true;
                            $scope.btn = true;
                            $scope.showbtn = false;
                        } else {
                            $scope.tgl = false;
                            $scope.jp = false;
                            $scope.hp = false;
                            $scope.it = false;
                            $scope.dk = false;
                            $scope.btn = false;
                            $scope.showbtn = true;
                        }
                    }
                })
                // setTimeout(function () {

                // }, 3000);
                // loadTempEmr2()
            }

            function loadTempEmr2() {
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function (dat) {

                    for (var m = 5; m < 10; m++) {
                        $scope.data.names[m].tgl = dat.data[m].tgljam
                        $scope.data.names[m].jp = { id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi }
                        $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                        $scope.data.names[m].it = dat.data[m].instruksitenaga
                        $scope.data.names[m].dk = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                        $scope.data.names[m].norec = dat.data[m].norec
                        $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                        $scope.data.names[m].menyerahkan = { id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan }
                        $scope.data.names[m].menerima = { id: dat.data[m].id, namalengkap: dat.data[m].menerima }
                        $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                        $scope.data.names[m].ttd = { id: dat.data[m].id, namalengkap: dat.data[m].ttd }
                        if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgllapor = ""
                        } else {
                            $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].pi = { id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi }
                        if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgljawab = ""
                        } else {
                            $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].instruksi = { id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi }


                        if ($scope.data.names[m].verifikasi == 1) {
                            $scope.tgl = true;
                            $scope.jp = true;
                            $scope.hp = true;
                            $scope.it = true;
                            $scope.dk = true;
                            $scope.btn = true;
                            $scope.showbtn = false;
                        } else {
                            $scope.tgl = false;
                            $scope.jp = false;
                            $scope.hp = false;
                            $scope.it = false;
                            $scope.dk = false;
                            $scope.btn = false;
                            $scope.showbtn = true;
                        }
                    }
                })
                setTimeout(function () {

                }, 3000);
                loadTempEmr3()
            }

            function loadTempEmr3() {
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function (dat) {

                    for (var m = 10; m < dat.data.length; m++) {
                        $scope.data.names[m].tgl = dat.data[m].tgljam
                        $scope.data.names[m].jp = { id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi }
                        $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                        $scope.data.names[m].it = dat.data[m].instruksitenaga
                        $scope.data.names[m].dk = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                        $scope.data.names[m].norec = dat.data[m].norec
                        $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                        $scope.data.names[m].menyerahkan = { id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan }
                        $scope.data.names[m].menerima = { id: dat.data[m].id, namalengkap: dat.data[m].menerima }
                        $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                        $scope.data.names[m].ttd = { id: dat.data[m].id, namalengkap: dat.data[m].ttd }
                        if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgllapor = ""
                        } else {
                            $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].pi = { id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi }
                        if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgljawab = ""
                        } else {
                            $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].instruksi = { id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi }


                        if ($scope.data.names[m].verifikasi == 1) {
                            $scope.tgl = true;
                            $scope.jp = true;
                            $scope.hp = true;
                            $scope.it = true;
                            $scope.dk = true;
                            $scope.btn = true;
                            $scope.showbtn = false;
                        } else {
                            $scope.tgl = false;
                            $scope.jp = false;
                            $scope.hp = false;
                            $scope.it = false;
                            $scope.dk = false;
                            $scope.btn = false;
                            $scope.showbtn = true;
                        }
                    }
                })
                // setTimeout(function () {

                // }, 3000);
                // loadTempEmr3()
            }


            $scope.kembali = function () {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            function setRow4(index = 11) {

                for (var i = 10; i < $scope.item.tgl.length; i++) {
                    if ($scope.data.names[i] != undefined) {
                        // $scope.data.names[i].tgl = $scope.item.tgl[i].values
                        // $scope.data.names[i].norectgl = $scope.item.tgl[i].norec
                    }
                    for (var j = 10; j < $scope.item.jp.length; j++) {
                        if ($scope.data.names[j] != undefined) {
                            // $scope.data.names[j].tkh = $scope.item.tkh[j].values
                            // $scope.data.names[j].norectkh = $scope.item.tkh[j].norec
                        }
                        for (var k = 10; k < $scope.item.hp.length; k++) {
                            if ($scope.data.names[k] != undefined) {
                                // $scope.data.names[k].dg = {id: $scope.item.dg[k].id, caption: $scope.item.dg[k].values}
                                // $scope.data.names[k].norecdg = $scope.item.dg[k].norec
                            }
                            for (var l = 10; l < $scope.item.it.length; l++) {
                                if ($scope.data.names[l] != undefined) {
                                    // if ()
                                    // $scope.data.names[l].pg = {id: $scope.item.pg[l].id, namalengkap: $scope.item.pg[l].values}
                                    // $scope.data.names[l].norecpg = $scope.item.pg[l].norec
                                }
                                for (var n = 10; n < $scope.item.dk.length; n++) {
                                    if ($scope.data.names[n] != undefined) {

                                    }

                                    var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "" };
                                    if ($scope.data.names.length <= index + 1 && i == j && j == k && k == l && l == n) {
                                        $scope.data.names.splice(index + 1, 0, name);
                                        index = index + 1
                                    }
                                }
                            }
                        }
                    }
                }
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function (dat) {

                    for (var m = 10; m < dat.data.length; m++) {
                        $scope.data.names[m].tgl = dat.data[m].tgljam
                        $scope.data.names[m].jp = { id: dat.data[m].id, jenispetugaspe: dat.data[m].profesi }
                        $scope.data.names[m].hp = dat.data[m].hasilpemeriksaan
                        $scope.data.names[m].it = dat.data[m].instruksitenaga
                        $scope.data.names[m].dk = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                        $scope.data.names[m].norec = dat.data[m].norec
                        $scope.data.names[m].verifikasi = dat.data[m].verifikasi
                        $scope.data.names[m].menyerahkan = { id: dat.data[m].id, namalengkap: dat.data[m].menyerahkan }
                        $scope.data.names[m].menerima = { id: dat.data[m].id, namalengkap: dat.data[m].menerima }
                        $scope.data.names[m].pk = dat.data[m].pasienkeluarga
                        $scope.data.names[m].ttd = { id: dat.data[m].id, namalengkap: dat.data[m].ttd }
                        if (dat.data[m].tgllapor == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgllapor = ""
                        } else {
                            $scope.data.names[m].tgllapor = new moment(dat.data[m].tgllapor).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].pi = { id: dat.data[m].id, namalengkap: dat.data[m].penerimainstruksi }
                        if (dat.data[m].tgljawab == "1900-01-01 00:00:00.000") {
                            $scope.data.names[m].tgljawab = ""
                        } else {
                            $scope.data.names[m].tgljawab = new moment(dat.data[m].tgljawab).format('YYYY-MM-DD HH:mm:ss')
                        }
                        $scope.data.names[m].instruksi = { id: dat.data[m].id, namalengkap: dat.data[m].pemberiinstruksi }


                        if ($scope.data.names[m].verifikasi == 1) {
                            $scope.tgl = true;
                            $scope.jp = true;
                            $scope.hp = true;
                            $scope.it = true;
                            $scope.dk = true;
                            $scope.btn = true;
                            $scope.showbtn = false;
                        } else {
                            $scope.tgl = false;
                            $scope.jp = false;
                            $scope.hp = false;
                            $scope.it = false;
                            $scope.dk = false;
                            $scope.btn = false;
                            $scope.showbtn = true;
                        }
                    }
                })
            }
            $scope.Save = function () {
                $scope.inputsave = false
                var arrobj = $scope.data.names
                var arrSave = []
                var arrTemp = []
                debugger
                for (var j = 0; j < arrobj.length; j++) {
                    if (arrobj[j].menyerahkan == "" || arrobj[j].menyerahkan == null) {
                        arrobj[j].menyerahkan = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].ttd == "") {
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
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap == "") {
                        arrTemp.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else {

                    }
                }
                $scope.cc.jenisemr = 'catatandokter'

                var gasSave = {
                    head: $scope.cc,
                    data: arrSave,
                    temp: arrTemp,
                }
                medifirstService.post('emr/save-catatan-dokter', gasSave).then(function (e) {
                    init()
                    LoadData();
                    // LoadCacheHelper();
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.grid = true;
                    $scope.input = false;
                })
            }
            $scope.Verifikasi = function () {
                debugger
                var stt = 'false'
                if (confirm('Verifikasi CPPT ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }
                debugger
                if (stt == 'true') {
                    var update = {
                        norecemr: $scope.cc.norec_emr
                    }
                    medifirstService.post('emr/save-verifikasi-dokter-cppt', update).then(function (dat) {
                        // init()
                        LoadCacheHelper();
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    })
                }
            }
            $scope.Unverifikasi2 = function () {
                $scope.popUpUnVerifikasi.center().open()
            }
            $scope.Unverifikasi = function () {
                debugger
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
                debugger
                if (stt == 'true') {
                    $scope.popUpUnVerifikasi.close()
                    $scope.item.password2 = undefined
                    var update = {
                        norecemr: $scope.cc.norec_emr
                    }
                    medifirstService.post('emr/save-unverifikasi-dokter-cppt', update).then(function (dat) {
                        init()
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    })
                }
            }
            $scope.cetakPdf = function () {
                debugger
                if ($scope.cc.namaruangan == "BOUGENVILE-NICU" || $scope.cc.namaruangan == "ICU BEDAH JANTUNG" || $scope.cc.namaruangan == "CENDRAWASIH 2  ICU " || $scope.cc.namaruangan == "HCU 1" || $scope.cc.namaruangan == "HCU 2" || $scope.cc.namaruangan == "HCU 3  dr.GALIH" || $scope.cc.namaruangan == "ECU" || $scope.cc.namaruangan == "ICCU" ||
                    $scope.cc.namaruangan == "ICU A 1" || $scope.cc.namaruangan == "ICU A 2" || $scope.cc.namaruangan == "ICU KHUSUS" || $scope.cc.namaruangan == "NICU B" || $scope.cc.namaruangan == "ICU PROMOTER LT.6" || $scope.cc.namaruangan == "ICU B" || $scope.cc.namaruangan == "NICU BX") {
                    var namapasien = $scope.cc.namapasien
                    var norm = $scope.cc.nocm
                    var jeniskelamin = $scope.cc.jeniskelamin
                    var umur = $scope.cc.umur

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur"],
                        "paramValue": [namapasien, $scope.noemr, norm, jeniskelamin, umur],
                        "paramType": ["", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
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
                    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/catatandoktericu.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandoktericu.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/catatandoktericu.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatandoktericu.pdf');
                    } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                        xhr.open('POST', 'http://36.92.186.59:1002/generic/report/catatandoktericu.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandoktericu.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                } else {
                    var namapasien = $scope.cc.namapasien
                    var norm = $scope.cc.nocm
                    var jeniskelamin = $scope.cc.jeniskelamin
                    var umur = $scope.cc.umur
                    var ruangan = $scope.cc.namaruangan

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur", "ruangan"],
                        "paramValue": [namapasien, $scope.noemr, norm, jeniskelamin, umur, ruangan],
                        "paramType": ["", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
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
                    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.1.74') > -1) {
                        xhr.open('POST', 'http://192.168.0.624:1002/generic/report/catatandokter2.pdf');
                    } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                        xhr.open('POST', 'http://36.92.186.59:1002/generic/report/catatandokter2.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandokter2.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
            }
            $scope.Back = function () {
                $scope.grid = true;
                $scope.input = false;
            }
            $scope.editGrid = function () {

                if ($scope.modelGrid == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                medifirstService.get('emr/get-status-verif?emrpasien=' + nomorEMRSS).then(function (dat) {
                    debugger
                    if (dat.data.length > 0) {
                        if (dat.data[0].verifikasi == 1) {
                            alert('Data Sudah Di Verifikasi ! Tidak Dapat Diedit Lagi !')
                            $scope.grid = true;
                            $scope.input = false;
                            return;

                        } else {

                        }
                    } else {

                    }
                })
                var norec = $scope.modelGrid.norec
                $scope.input = true;
                $scope.grid = false;
                $scope.inputsave = false;
                $scope.editsave = true;
                $scope.editsave = true;
                medifirstService.get('emr/get-cppt-edit?norec=' + norec).then(function (dat) {

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
            $scope.Edit = function () {
                var arrobj = $scope.data.names
                var arrTempEdit = []
                debugger
                for (var j = 0; j < arrobj.length; j++) {
                    if (arrobj[j].menyerahkan == "" || arrobj[j].menyerahkan == null) {
                        arrobj[j].menyerahkan = {
                            namalengkap: ""
                        }
                    }
                    if (arrobj[j].ttd == "") {
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
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap != "" && arrobj[i].menerima.namalengkap != "" && arrobj[i].ttd.namalengkap != "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else if (arrobj[i].tgl != "" && arrobj[i].jp != "" && arrobj[i].hp != "" && arrobj[i].it != "" && arrobj[i].menyerahkan.namalengkap == "" && arrobj[i].menerima.namalengkap == "" && arrobj[i].ttd.namalengkap != "") {
                        arrTempEdit.push({ idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss.000'), idjp: arrobj[i].idjp, jp: arrobj[i].jp.jenispetugaspe, idhp: arrobj[i].idhp, hp: arrobj[i].hp, idit: arrobj[i].idit, it: arrobj[i].it, iddk: arrobj[i].iddk, dk: arrobj[i].dk.namalengkap, norec: arrobj[i].norec, idmenerima: arrobj[i].idmenerima, menerima: arrobj[i].menerima.namalengkap, idmenyerahkan: arrobj[i].idmenyerahkan, menyerahkan: arrobj[i].menyerahkan.namalengkap, idpk: arrobj[i].idpk, pk: arrobj[i].pk, idttd: arrobj[i].idttd, ttd: arrobj[i].ttd.namalengkap, idtgllapor: arrobj[i].idtgllapor, tgllapor: new moment(arrobj[i].tgllapor).format('YYYY-MM-DD HH:mm:ss.000'), idpi: arrobj[i].idpi, pi: arrobj[i].pi.namalengkap, idtgljawab: arrobj[i].idtgljawab, tgljawab: new moment(arrobj[i].tgljawab).format('YYYY-MM-DD HH:mm:ss.000'), idinstruksi: arrobj[i].idinstruksi, instruksi: arrobj[i].instruksi.namalengkap, ids: arrobj[i].ids, s: arrobj[i].s, ido: arrobj[i].ido, o: arrobj[i].o, ida: arrobj[i].ida, a: arrobj[i].a, idp: arrobj[i].idp, p: arrobj[i].p })
                    } else {

                    }
                }

                var gasSave = {
                    // head: $scope.cc,
                    // data: arrSave,
                    temp: arrTempEdit,
                }
                medifirstService.post('emr/edit-catatan-dokter', gasSave).then(function (e) {
                    // init()
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    // cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.grid = true;
                    $scope.input = false;
                    LoadData();
                    LoadCacheHelper();
                })
            }
        }
    ])
})