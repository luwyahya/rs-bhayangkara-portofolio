define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('CatatanKeperawatanCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state',
        'CacheHelper', 'DateHelper', 'MedifirstService',
        function($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, FormGroup, FormArray, FormBuilder) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 517
            var dataLoad = []
            $scope.item = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            $scope.isKembali = true
            $scope.isProsesSave = true;
            var paramSearch = ''
            $scope.noemr = ''
            $scope.user = {};
            $scope.item.tgl = []
            $scope.item.tkh = []
            $scope.item.dg = []
            $scope.item.pg = []
            $scope.istempatLaporan = true;
            $scope.grid = true;
            $scope.input = false;
            var nomorEMRSS = ''
            // LoadCacheHelper();
            SetCacheHelper();

            function LoadCombo() {
                // medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=askep").then(function(e) {
                //     $scope.listAskep = e.data
                // })
                medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.cc.noregistrasi).then(function(dat) {

                    $scope.listAskep = dat.data.askep
                })
                medifirstService.get("emr/get-combo").then(function(dat) {
                    //debugger;
                    $scope.listPegawai = dat.data.pegawai
                })
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
                    $scope.cc.tglLahir = chacePeriode[14]
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    LoadCombo();
                    init()
                }
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatankeperawatan", true).then(function(dat) {
                    //debugger
                    $scope.isRouteLoading = false
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    cacheHelper.set('cacheEmrIgd', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '517'
                        LoadData();
                        // setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {

                    }
                });

                function setobjectToModel(nomorEMRSS, emrfk) {
                    medifirstService.get("emr/get-emr-transaksi-detail-polri-2?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function(dat) {
                        //debugger;
                        $scope.isLoading = false
                        var chekedd = false
                            // $scope.item.obj = []

                        // $scope.item.obj2 = []
                        // $scope.item.obj[68] = $scope.now
                        dataLoad = dat.data.data
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                if (dataLoad[i].emrdfk == 149) {
                                    $scope.item.tgl.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                        // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 151) {
                                    $scope.item.tkh.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                        // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 150) {
                                    $scope.item.dg.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                        // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                if (dataLoad[i].emrdfk == 152) {
                                    $scope.item.pg.push({ emrdfk: dataLoad[i].emrdfk, values: dataLoad[i].value, norec: dataLoad[i].norec })
                                        // $scope.data.names[0].tgl = dataLoad[0].value

                                    // setRow();
                                }
                                // if (dataLoad[i].type == "textbox") {
                                //     $scope.data.names[i].dg = dataLoad[i].value
                                // }
                                // if (dataLoad[i].type == "textarea") {
                                //     [dataLoad[i].emrdfk] = dataLoad[i].value
                                // }
                                // if (dataLoad[i].type == "textbox") {
                                //     [dataLoad[i].emrdfk] = dataLoad[i].value
                                // }

                                // if (dataLoad[i].type == "datetime") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                // }
                                // if (dataLoad[i].type == "time") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                // }
                                // if (dataLoad[i].type == "date") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                // }

                                // if (dataLoad[i].type == "checkboxtextbox") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                                // }
                                // if (dataLoad[i].type == "textarea") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                // }
                                // if (dataLoad[i].type == "combobox") {
                                //     var str = dataLoad[i].value
                                //     var res = str.split("~");
                                //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                                // }
                                // if (dataLoad[i].type == "photo") {
                                //     $scope.user.poto = dataLoad[i].value
                                // }
                            }

                        }
                        //debugger;
                        // $scope.item.fix = $scope.item.tgl.map((item, i) => Object.assign({}, item, $scope.item.tkh[i]))
                        const map = new Map();
                        $scope.item.tgl.forEach(item => map.set(item.emrdfk, item));
                        $scope.item.tkh.forEach(item => map.set(item.emrdfk, {...map.get(item.nameId), ...item }));
                        const mergedArr = Array.from(map.values());
                        //debugger
                        if ($scope.item.tgl.length > 0 && $scope.item.dg.length > 0 && $scope.item.tkh.length > 0) {
                            setRow();
                            // setRow2();
                        } else {
                            $scope.data.names[0].tgl = $scope.item[0].tgl
                            $scope.data.names[0].tkh = $scope.item[0].tkh
                            $scope.data.names[0].dg = $scope.item[0].dg
                        }
                    })

                }

            }

            function LoadData() {
                //debugger
                var emr = ''
                if (nomorEMRSS != undefined) {
                    emr = "emrpasien=" + nomorEMRSS
                } else {
                    emr = ''
                }
                medifirstService.get("emr/get-history-cpt?" + emr).then(function(dat) {
                    //debugger;

                    var cppt = dat.data

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
                            "field": "diagnosa",
                            "title": "Diagnosa",
                            "width": "120px",
                        },
                        {
                            "field": "hasilkeperawatan",
                            "title": "Hasil Keperawatan",
                            "width": "120px",
                        },
                        {
                            "field": "pegawai",
                            "title": "Tanda Tangan Nama",
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
            $scope.showInput = function() {
                $scope.grid = false;
                $scope.input = true;
                $scope.inputsave = true;
                $scope.editsave = false;
                $scope.data = {
                    names: [{ idtkh: "151", tkh: "", idtgl: "149", tgl: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" }]
                };
            }
            $scope.Back = function() {
                $scope.grid = true;
                $scope.input = false;
            }
            $scope.editGrid = function() {
                //debugger;
                if ($scope.modelGrid == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                $scope.data = {
                    names: [{ idtkh: "151", tkh: "", idtgl: "149", tgl: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" }]
                };
                var norec = $scope.modelGrid.norec
                $scope.input = true;
                $scope.grid = false;
                $scope.inputsave = false;
                $scope.editsave = true;
                $scope.editsave = true;
                medifirstService.get('emr/get-cpt-edit?norec=' + norec).then(function(dat) {
                    //debugger;
                    $scope.data.names[0].tgl = dat.data[0].tgljam
                    $scope.data.names[0].dg = { id: dat.data[0].id, caption: dat.data[0].diagnosa }
                    $scope.data.names[0].tkh = dat.data[0].hasilkeperawatan
                    $scope.data.names[0].pg = { id: dat.data[0].id, namalengkap: dat.data[0].pegawai }
                    $scope.data.names[0].norec = dat.data[0].norec
                })
            }

            $scope.data = {
                names: [{ idtkh: "151", tkh: "", idtgl: "149", tgl: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" }]
            };

            $scope.Tambah = function(index) {
                //debugger;
                var name = { idtkh: "151", tkh: "", idtgl: "149", tgl: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" };
                if ($scope.data.names.length <= index + 1) {
                    $scope.data.names.splice(index + 1, 0, name);
                }
            }

            function setRow(index = 1) {
                //debugger;
                for (var i = 0; i < $scope.item.tgl.length; i++) {
                    if ($scope.data.names[i] != undefined) {
                        // $scope.data.names[i].tgl = $scope.item.tgl[i].values
                        // $scope.data.names[i].norectgl = $scope.item.tgl[i].norec
                    }
                    for (var j = 0; j < $scope.item.tkh.length; j++) {
                        if ($scope.data.names[j] != undefined) {
                            // $scope.data.names[j].tkh = $scope.item.tkh[j].values
                            // $scope.data.names[j].norectkh = $scope.item.tkh[j].norec
                        }
                        for (var k = 0; k < $scope.item.dg.length; k++) {
                            if ($scope.data.names[k] != undefined) {
                                // $scope.data.names[k].dg = {id: $scope.item.dg[k].id, caption: $scope.item.dg[k].values}
                                // $scope.data.names[k].norecdg = $scope.item.dg[k].norec
                            }
                            for (var l = 0; l < $scope.item.pg.length; l++) {
                                if ($scope.data.names[l] != undefined) {
                                    // $scope.data.names[l].pg = {id: $scope.item.pg[l].id, namalengkap: $scope.item.pg[l].values}
                                    // $scope.data.names[l].norecpg = $scope.item.pg[l].norec
                                }
                                var name = { idtgl: "149", tgl: "", idtkh: "151", tkh: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" };
                                if ($scope.data.names.length <= index + 1 && i == j && j == k && k == l) {
                                    $scope.data.names.splice(index + 1, 0, name);
                                    index = index + 1
                                }
                            }
                        }
                    }
                }
                medifirstService.get("emr/get-temp-emr?&emrpasien=" + $scope.cc.norec_emr).then(function(dat) {
                        //debugger;
                        for (var m = 0; m < dat.data.length; m++) {
                            $scope.data.names[m].tgl = dat.data[m].tgljam
                            $scope.data.names[m].tkh = dat.data[m].hasilkeperawatan
                            $scope.data.names[m].dg = { id: dat.data[m].id, caption: dat.data[m].diagnosa }
                            $scope.data.names[m].pg = { id: dat.data[m].id, namalengkap: dat.data[m].pegawai }
                            $scope.data.names[m].norec = dat.data[m].norec
                                // $scope.data.names[m].norecemr = dat.data[m].norec_emrpd
                        }
                    })
                    // //debugger;
                    // $scope.data.names[0].dg
            }

            function setRow2(index = 1) {
                //debugger;
                for (var i = 1; i < $scope.data.names.length; i++) {
                    for (var j = 0; j < $scope.item.tkh.length; j++) {
                        var name = { idtgl: $scope.data.names[i].idtgl, tgl: $scope.data.names[i].tgl, idtkh: "151", tkh: $scope.item.tkh[j].values, iddg: "150", dg: $scope.item.dg[k].values };
                        if ($scope.data.names.length <= index + 3) {
                            $scope.data.names.splice(index + 1, 0, name);
                            index = index + 1
                        }
                    }
                }
            }


            $scope.kembali = function() {
                //debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.Save = function() {
                if ($scope.isProsesSave == false) {
                    toastr.error('Proses Penyimpanan sedang berlangsung, MOHON BERSABAR, JANGAN KLIK BERULANG-ULANG')
                    return;
                }
                $scope.isProsesSave = false;
                //debugger;
                // var TKH = [];
                // var TGL = [];
                // var DG = [];
                // var mumet = $scope.data.names

                // for(let i = 0; i < mumet.length; i++) {
                //     //debugger;
                //     var AnyarTKH = {
                //         "emrdfk": mumet[i].idtkh,
                //         "value": mumet[i].tkh,
                //     }
                //     TKH.push(AnyarTKH);
                // }
                // for(let i = 0; i < mumet.length; i++) {
                //     //debugger;
                //     var AnyarTGL = {
                //         "emrdfk": mumet[i].idtgl,
                //         "value": new moment(mumet[i].tgl).format('YYYY-MM-DD 00:00:00'),
                //     }
                //     TGL.push(AnyarTGL);
                // }
                // for(let i = 0; i < mumet.length; i++) {
                //     //debugger;
                //     var AnyarDG = {
                //         "emrdfk": mumet[i].iddg,
                //         "value": mumet[i].dg.caption,
                //     }
                //     DG.push(AnyarDG);
                // }
                // var objMumet = {
                //     "mumetTKH": AnyarTKH,
                //     "mumetTGL": AnyarTGL,
                //     "mumetDG": AnyarDG,
                //     "head": $scope.cc
                // }
                // medifirstService.post('emr/save-catatan-keperawatan',objMumet).then(function (e) {

                // })
                var arrobj = $scope.data.names
                var arrSave = []
                var arrTemp = []
                //debugger;
                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].dg != "" && arrobj[i].pg != "" && arrobj[i].tgl != "" && arrobj[i].tkh != "") {
                        arrSave.push({ id: arrobj[i].idtkh, values: arrobj[i].tkh, norec: arrobj[i].norectkh })
                        arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss'), norec: arrobj[i].norectgl })
                        arrSave.push({ id: arrobj[i].iddg, values: arrobj[i].dg.caption, norec: arrobj[i].norecdg })
                        arrSave.push({ id: arrobj[i].idpg, values: arrobj[i].pg.namalengkap, norec: arrobj[i].norecpg })
                            // arrSave.push({ id: arrobj[i].idpg, values: arrobj[i].pg.namalengkap })
                        $scope.cc.jenisemr = 'catatankeperawatan'
                    } else if (arrobj[i].dg == "" && arrobj[i].pg != "" && arrobj[i].tgl != "" && arrobj[i].tkh != "") {
                        arrSave.push({ id: arrobj[i].idtkh, values: arrobj[i].tkh, norec: arrobj[i].norectkh })
                        arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss'), norec: arrobj[i].norectgl })
                        arrSave.push({ id: arrobj[i].iddg, values: "", norec: arrobj[i].norecdg })
                        arrSave.push({ id: arrobj[i].idpg, values: arrobj[i].pg.namalengkap, norec: arrobj[i].norecpg })
                            // arrSave.push({ id: arrobj[i].idpg, values: arrobj[i].pg.namalengkap })
                        $scope.cc.jenisemr = 'catatankeperawatan'
                    } else {

                    }
                }
                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].dg != "" && arrobj[i].pg != "" && arrobj[i].tgl != "" && arrobj[i].tkh != "") {
                        arrTemp.push({ idtkh: arrobj[i].idtkh, tkh: arrobj[i].tkh, idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss'), iddg: arrobj[i].iddg, dg: arrobj[i].dg.caption, idpg: arrobj[i].idpg, pg: arrobj[i].pg.namalengkap, norec: arrobj[i].norec })
                            // arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD 00:00:00') })
                            // arrSave.push({ id: arrobj[i].iddg, values: arrobj[i].dg.caption })
                            // $scope.cc.jenisemr = 'catatankeperawatan'
                    } else if (arrobj[i].dg == "" && arrobj[i].pg != "" && arrobj[i].tgl != "" && arrobj[i].tkh != "") {
                        arrTemp.push({ idtkh: arrobj[i].idtkh, tkh: arrobj[i].tkh, idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss'), iddg: arrobj[i].iddg, dg: "", idpg: arrobj[i].idpg, pg: arrobj[i].pg.namalengkap, norec: arrobj[i].norec })
                    } else {

                    }
                }
                //debugger;
                var gasSave = {
                    head: $scope.cc,
                    data: arrSave,
                    temp: arrTemp,
                }
                medifirstService.post('emr/save-catatan-keperawatan', gasSave).then(function(e) {
                    $scope.isProsesSave = true;
                    $scope.isRouteLoading = true;
                    setTimeout(function() {
                        init()
                        $scope.grid = true;
                        $scope.input = false;
                        $scope.isRouteLoading = false
                        // LoadData();
                    }, 10000);
                        // var arrStr = {
                        //     0: e.data.data.noemr
                        // }
                        // cacheHelper.set('cacheNomorEMR', arrStr);
                })
            }
            $scope.Edit = function() {
                var arrobj = $scope.data.names
                var arrTempEdit = []
                //debugger
                for (var i = 0; i < arrobj.length; i++) {
                    if (arrobj[i].dg != "" && arrobj[i].pg != "" && arrobj[i].tgl != "" && arrobj[i].tkh != "") {
                        arrTempEdit.push({ idtkh: arrobj[i].idtkh, tkh: arrobj[i].tkh, idtgl: arrobj[i].idtgl, tgl: new moment(arrobj[i].tgl).format('YYYY-MM-DD HH:mm:ss'), iddg: arrobj[i].iddg, dg: arrobj[i].dg.caption, idpg: arrobj[i].idpg, pg: arrobj[i].pg.namalengkap, norec: arrobj[i].norec })
                            // arrSave.push({ id: arrobj[i].idtgl, values: new moment(arrobj[i].tgl).format('YYYY-MM-DD 00:00:00') })
                            // arrSave.push({ id: arrobj[i].iddg, values: arrobj[i].dg.caption })
                            // $scope.cc.jenisemr = 'catatankeperawatan'
                    } else {

                    }
                }
                //debugger;
                var gasSave = {
                    // head: $scope.cc,
                    // data: arrSave,
                    temp: arrTempEdit,
                }
                medifirstService.post('emr/edit-catatan-keperawatan', gasSave).then(function(e) {
                    // init()
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    // cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.grid = true;
                    $scope.input = false;
                    LoadData();
                })
            }
            $scope.cetakPdf = function() {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-traseprimer&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function(response) {
                    // do something with response
                });
            }
            $scope.TambahSoap = function(index) {
debugger
                    var ax = $scope.data.names[index].dg
                        // $scope.data.names[index].o = ax.caption;
                    medifirstService.get("emr/get-dataaskep?noemr=" + ax.emrpasienfk + "&emrfk=" +
                        ax.id).then(function(dat) {
                        var p = '';
                        var data = dat.data.askep
                        for (var i = 0; i < data.length; i++) {

                            if (data[i].kolom == 3) {
                                p = p + data[i].captionemr + "\n"
                            }
                            if (data[i].kolom == 2) {
                                p = p + data[i].captionemr + "\n"
                            }
                        }
                        $scope.data.names[index].tkh = p;
                    })

                }
                // $scope.Tambah = function(index) {

            //     var name = { idtgl: "153", tgl: "", idjp: "154", jp: "", idhp: "155", hp: "S:\nO:\nA:\nP:", idit: "156", it: "P:", iddk: "157", dk: "", norec: "", verifikasi: "", idmenyerahkan: "158", menyerahkan: "", idmenerima: "159", menerima: "", idpk: "160", pk: "", idttd: "161", ttd: "", idtgllapor: "162", tgllapor: "", idpi: "163", pi: "", idtgljawab: "164", tgljawab: "", idinstruksi: "165", instruksi: "", ids: "851", s: "S :", ido: "852", o: "O :", ida: "853", a: "A :", idp: "854", p: "P :" };
            //     if ($scope.data.names.length <= index + 1) {
            //         $scope.data.names.splice(index + 1, 0, name);
            //     }
            // }

            $scope.cetakPdf = function() {
                //debugger
                // if (nomorEMR == '') return
                // var base64 = $scope.user.poto.substring(22);
                // var user = medifirstService.getPegawaiLogin();
                // var arrPush = []
                // //debugger;
                // for (var i = 0; i <= 150 - 1; i++) {
                //     arrPush.push({ emrdfk: i.toString(), value: "" })
                // }
                // for (var i = 0; i <= dataLoad.length - 1; i++) {
                //     if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                //         for (var x = 0; x <= arrPush.length - 1; x++) {
                //             if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                //                 arrPush[x].value = dataLoad[i].value
                //             }
                //         }
                //     }
                // var arrTgl = ''
                // for (var i = 0; i < $scope.item.tgl.length; i++) {
                //     if ($scope.item.tgl.length != 0 ) {
                //         arrTgl = arrTgl + ',' + $scope.item.tgl[i].values
                //         // arrTgl.push({ emrdfk: $scope.item.tgl[i].emrdfk.toString(), value: $scope.item.tgl[i].values.toString()})
                //     }
                // }

                // }
                var namapasien = $scope.cc.namapasien
                var norm = $scope.cc.nocm
                var jeniskelamin = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan
                //debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur", "ruangan","noregistrasi"],
                    "paramValue": [namapasien, $scope.noemr, norm, jeniskelamin, umur, ruangan,$scope.cc.noregistrasi],
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
                        //debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:1002/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:1002/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1002/generic/report/catatankeperawatan.pdf');
                } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:1002/generic/report/catatankeperawatan.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatankeperawatan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.HapusMasalah2 = function() {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                $scope.popUpHapus.center().open()
            }
            $scope.HapusMasalah = function() {
                // debugger
                if ($scope.modelGrid == undefined) {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return;
                }
                if ($scope.item.password2 != "bener") {
                    toastr.error('Password Salah !')
                    return
                }               
                var stt = 'false'
                if (confirm('Hapus Catatan Keperawatan ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                    $scope.popUpHapus.close()
                    $scope.item.password2 = undefined
                }
                if (stt == 'true') {
                var objSave = {
                    "norec": $scope.modelGrid.norec,
                    "status": false
                }
                medifirstService.post('emr/hapus-cpt', objSave).then(function (e) {
                    if (e.data.status === 201) {
                        let jsonLog = {
                            'jenislog': "Delete Catatan Keperawatan",
                            'referensi': 'noregistrasi',
                            'noreff': $scope.cc.noregistrasi,
                            'keterangan': 'Delete Catatan Keperawatan ' + 'Alasan : ' + $scope.item.alasanHapus + ' pada No Registrasi '
                            + $scope.cc.noregistrasi,
                            'data': [],
                            'jenisemr': 'Catatan Keperawatan',
                            'emrfk': $scope.cc.emrfk
                        }
                        medifirstService.postLoggingEMR(jsonLog).then(function(e) {
                            $scope.popUpHapus.close()
                            init();
                        })
                    }
                })
                }
            }
        }
    ])
})