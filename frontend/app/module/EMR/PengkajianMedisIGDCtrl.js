define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianMedisIGDCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var statusTambah = true
            var nomorEMR = '-'
            $scope.cc.emrfk = 869
            var dataLoad = []
            var dataRadiologi = [];
            var dataRadiologiPush = [];
            var dataLaboratorium = [];
            var dataLaboratoriumPush = [];
            $scope.item = {};
            $scope.item.obj = []
            $scope.item.objcbo = []
            $scope.item.layanan = []
            $scope.item.layanan2 = []
            var dataProdukDetail = [];
            $scope.isCetak = true
            var noTerima = '';
            var norec_apd = '';
            $scope.isKembali = true
            $scope.show = true;
            var paramSearch = ''
            $scope.norecOrder = ''
            // $scope.item.nilaiKonversi = 0
            // $scope.item.hargaNetto = 0;
            $scope.item.nilaiKonversi = 0
            $scope.item.totalSubTotal = 0
            $scope.item.stok = 0
            $scope.item.hargaSatuan = 0
            var hrg1 = 0
            // $scope.item.hargaSatuan = 0
            // $scope.item.totalSubTotal = 0
            $scope.user = {};
            $scope.istempatLaporan = true;
            var userlogin = {};
            $scope.now = new Date()
            $scope.item.rke = 1;
            var dataObat = [];
            $scope.isCetak = false
            $scope.logo = medifirstService.getLogo()
            LoadCacheHelper();
            LoadCombo();

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
                    //debugger
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
                    $scope.cc.objectkelompokpasienfk = chacePeriode[19]
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    $scope.item.namaRuangan = $scope.cc.namaruangan
                    // $scope.item.obj[2404] = moment($scope.now).format('YYYY-MM-DD HH:mm')                   
                    init()
                    loadLaboratorium()
                    loadRadiologi()
                    $scope.listKesadaran = [
                        { text: "Compos Mentis", value: 1 },
                        { text: "Apatis", value: 2 },
                        { text: "Delirium", value: 3 },
                        { text: "Somnolent", value: 4 },
                        { text: "Sopor", value: 5 },
                        { text: "Semi Coma", value: 6 },
                        { text: "Coma", value: 7 }
                    ];
                    $scope.listGcs = [
                        { text: "E", value: 1 },
                        { text: "M", value: 2 },
                        { text: "V", value: 3 }
                    ];
                    $scope.listGcsE = [
                        { text: "1", value: 1 },
                        { text: "2", value: 2 },
                        { text: "3", value: 3 },
                        { text: "4", value: 4 }
                    ];
                    $scope.listGcsM = [
                        { text: "1", value: 1 },
                        { text: "2", value: 2 },
                        { text: "3", value: 3 },
                        { text: "4", value: 4 },
                        { text: "5", value: 5 },
                        { text: "6", value: 6 }
                    ];
                    $scope.listGcsV = [
                        { text: "1", value: 1 },
                        { text: "2", value: 2 },
                        { text: "3", value: 3 },
                        { text: "4", value: 4 },
                        { text: "5", value: 5 }
                    ];
                    $scope.ListLaborat = [{
                        "id": 12,
                        "nama": "LABORATORIUM",
                        "detail": [
                            { "id": 4056686, "nama": "Hematologi I ", "type": "checkbox", "no": 1 },
                            { "id": 4056687, "nama": "Hematologi II ", "type": "checkbox", "no": 2 },
                            { "id": 4056688, "nama": "Hematologi III", "type": "checkbox", "no": 3 },
                            { "id": 4056772, "nama": "GDS", "type": "checkbox", "no": 4 },
                            { "id": 4056768, "nama": "Ureum", "type": "checkbox", "no": 5 },
                            { "id": 4056769, "nama": "Creatinin", "type": "checkbox", "no": 6 },
                            // { "id": 5, "nama": "", "type": "textbox" },
                            { "id": 4056760, "nama": "SGOT / AST ( 37 C )", "type": "checkbox", "no": 7 },
                            { "id": 4056761, "nama": "SGPT / ALT ( 37 C )", "type": "checkbox", "no": 8 },
                            { "id": 4056784, "nama": "Troponin I", "type": "checkbox", "no": 9 },
                            { "id": 4056781, "nama": "CK-MB", "type": "checkbox", "no": 10 },
                            { "id": 4056891, "nama": "URINE RUTIN", "type": "checkbox", "no": 11 },
                            { "id": 4076580, "nama": "SARS COV-2 Antigen Rapid Test", "type": "checkbox", "no": 12 },
                            { "id": 4076908, "nama": "N-Cov 2 RT- PCR", "type": "checkbox", "no": 13 },
                            { "id": 4056777, "nama": "Elektrolit", "type": "checkbox", "no": 14 },
                            { "id": 4056778, "nama": "AGD(Analisa Gas Darah)", "type": "checkbox", "no": 15 },
                            // { "id": 4076909, "nama": "Keterangan", "type": "textbox","no":16 }
                        ]
                    }]
                    $scope.ListRadiologi = [{
                        "id": 13,
                        "nama": "RADIOLOGI",
                        "detail": [
                            { "id": 4052974, "nama": "Rontgen thorax ", "type": "checkbox", "no": 1 },
                            { "id": 4053310, "nama": "CT Kepala", "type": "checkbox", "no": 2 },
                            { "id": 4052977, "nama": "RO Abdomen 3 Posisi ", "type": "checkbox", "no": 3 },
                            { "id": 4053309, "nama": "Rontgen BNO", "type": "checkbox", "no": 4 },
                            // { "id": 4053311, "nama": "Keterangan", "type": "textbox","no":5 }
                            // { "id": 3488, "nama": "", "type": "textbox2" },                              
                        ]
                    }]
                    $scope.listTatalaksana = [{
                        "id": 14,
                        "nama": "TATALAKSANA/TERAPI",
                        "detail": [
                            { "id": 2636, "nama": "Oksigen", "type": "checkbox" },
                            { "id": 2637, "nama": "Konsultasi Dokter :", "type": "checkbox" },
                            { "id": 2638, "nama": "", "type": "textbox" },
                            { "id": 2639, "nama": "", "type": "textbox" },
                            // { "id": 4027, "nama": "", "type": "textbox" },

                        ]
                    }
                    ]

                    $scope.listDisposisi = [{
                        "id": 15,
                        "nama": "",
                        "detail": [
                            { "id": 3468, "nama": "Boleh Pulang", "type": "checkbox" },
                            { "id": 3469, "nama": "tanggal", "type": "date" },


                        ]
                    },
                    {
                        "id": 17,
                        "nama": "kondisi saat pulang",
                        "detail": [
                            { "id": 4032, "nama": "Sembuh", "type": "checkbox", "urutan": 1 },
                            { "id": 4033, "nama": "Belum sembuh", "type": "checkbox", "urutan": 2 },
                            { "id": 4034, "nama": "Meninggal", "type": "checkbox", "urutan": 3 },

                        ]
                    },
                    {
                        "id": 16,
                        "nama": "Kontrol Poliklinik",
                        "detail": [

                            { "id": 3470, "nama": "tidak", "type": "checkbox" },
                            { "id": 3471, "nama": "ya", "type": "checkbox" },
                            { "id": 3472, "nama": "tanggal", "type": "date" },
                            // { "id": 3488, "nama": " ", "type": "textbox" },                                        
                        ]
                    },

                    {

                        "id": 18,
                        "nama": "dirawat di ruang",
                        "detail": [

                            { "id": 3490, "nama": " ", "type": "textbox", "urutan": 2 },
                            { "id": 3473, "nama": "intensif", "type": "checkbox", "urutan": 1 },
                            { "id": 3489, "nama": " ", "type": "textbox", "urutan": 4 },
                            { "id": 3474, "nama": "ruangan lain", "type": "checkbox", "urutan": 3 },

                        ]
                    },
                    ]

                    $scope.listIzin = [{
                        "id": 19,
                        "nama": "IZIN KELUAR",
                        "detail": [
                            { "id": 3475, "nama": "Atas Permintaa Dokter ", "type": "checkbox" },
                            { "id": 3476, "nama": "Melarikan Diri", "type": "checkbox" },
                            { "id": 3477, "nama": "Atas Permintaan sendiri/keluarga ", "type": "checkbox" },
                            { "id": 3478, "nama": "Pindah ke RS lain", "type": "checkbox" },
                        ]
                    }
                    ]
                    $scope.data = {
                        names: [{ p: "P :" }]
                    };
                    $scope.listRisikoJatuh = [{
                        "id": 8,
                        "nama": "Kepala :",
                        "detail": [
                            { "id": 2618, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2619, "nama": "Ada Kelainan", "type": "checkbox" },
                            { "id": 2620, "nama": " Jelaskan :", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 9,
                        "nama": "Leher :",
                        "detail": [
                            { "id": 2621, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2622, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2623, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 10,
                        "nama": "Thorax :",
                        "detail": [
                            { "id": 2624, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2625, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2626, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 11,
                        "nama": "Abdomen :",
                        "detail": [
                            { "id": 2627, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2628, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2629, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 20,
                        "nama": "Extremitas :",
                        "detail": [
                            { "id": 2630, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2631, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2632, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 21,
                        "nama": "Genitalia :",
                        "detail": [
                            { "id": 2633, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2634, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2635, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 22,
                        "nama": "Anus :",
                        "detail": [
                            { "id": 2676, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2677, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2678, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    },
                    {
                        "id": 23,
                        "nama": "Pemeriksaan Neurologis :",
                        "detail": [
                            { "id": 2679, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                            { "id": 2680, "nama": "Ada Kelainan ", "type": "checkbox" },
                            { "id": 2681, "nama": "Jelaskan ", "type": "textbox" },
                        ]
                    }
                    ]
                }
            }
            
            function LoadCombo() {
                medifirstService.get('emr/get-combo').then(function (dat) {
                    // $scope.listPerawat = dat.data.perawatBidan
                    $scope.listDokter = dat.data.dokter
                })
                medifirstService.get('emr/get-image-from-jenis-surat?').then(function (dat) {
                    //debugger
                    $scope.user.poto2 = dat.data[6].template
                    $scope.user.poto = dat.data[5].template
                })
                $scope.item.obj = []
                medifirstService.get("emr/get-combo-resep-emr-2", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false;
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    // $scope.listRuangan.splice(9);                     
                    $scope.listProduk = dat.data.produk;
                    $scope.listAturanPakai = dat.data.aturanpakai;
                    $scope.item.tarifadminresep = dat.data.tarifadminresep
                    $scope.item.ruangan = dat.data.ruanganfarmasi[2];
                    $scope.item.tarifadminresep = dat.data.tarifadminresep[0].nilaifield;
                    $scope.item.jenisKemasan = dat.data.jeniskemasan[1];
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }
            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianmedisigd", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('pengkajianmedisigd', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '869'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    }
                    else {
                        $scope.item.obj[2404] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                        $scope.item.obj[2446] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                        $scope.item.obj[2447] = {namalengkap: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
                        $scope.item.obj[2618] = true
                        $scope.item.obj[2621] = true
                        $scope.item.obj[2624] = true
                        $scope.item.obj[2627] = true
                        $scope.item.obj[2630] = true
                        $scope.item.obj[2633] = true                      
                        $scope.item.obj[2676] = true                      
                        $scope.item.obj[2679] = true                      
                        chekedd = true                 
                        // medifirstService.get('emr/get-image-from-jenis-surat?').then(function (dat) {
                        //     //debugger
                        //     $scope.user.poto2 = dat.data[6].template
                        //     $scope.user.poto = dat.data[5].template
                        //     $scope.item.obj = []
                        // })                                              
                    }

                    // medifirstService.get('emr/get-pegawai-parts?id=' + medifirstService.getPegawaiLogin().id).then(function (dat) {
                    //     //debugger
                    //     userlogin = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                    // })
                });

                // $scope.LastVitalSign = function () {
                //     medifirstService.get("emr/get-emr-transaksi?" +paramSearch + "&jenisEmr=navigasi", true).then(function (dat) {
                //         $scope.isRouteLoading = false
                //         var nomorEMRSS = ''
                //         cacheHelper.set('cacheVitalSign',undefined)
                //         if( dat.data.data.length > 0){
                //             for (var i = 0; i <  dat.data.data.length; i++) {
                //                 const element =  dat.data.data[i];
                //                 element.no = i +1
                //             }
                //             nomorEMRSS =  dat.data.data[0].noemr
                //             $scope.cc.emrfk = '147'
                //             setobjectToModel(nomorEMRSS,  $scope.cc.emrfk )
                //         }

                //         $scope.dataDaftar = new kendo.data.DataSource({
                //             data: dat.data.data,
                //             pageSize: 10,
                //             serverPaging: false,
                //             schema: {
                //                 model: {
                //                     fields: {
                //                     }
                //                 }
                //             }
                //         });
                //         // $scope.popUpRiwayat.center().open();
                //     });
                // }

                function setobjectToModel(nomorEMRSS, emrfk) {
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                        $scope.isLoading = false
                        var chekedd = false  
                        $scope.item.obj = []                      
                        $scope.item.obj2 = []
                        // $scope.item.obj[1901300075] = $scope.now
                        dataLoad = dat.data.data
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                if (dataLoad[i].type == "textbox") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "checkbox") {
                                    chekedd = false
                                    if (dataLoad[i].value == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                    // if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                    //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                                    // }
                                    // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                    //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                    //     $scope.getSkor2(datass)
                                    // }
                                    // if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                    //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                    //     $scope.getSkorNutrisi(datass)
                                    // }
                                }

                                if (dataLoad[i].type == "datetime") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "time") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "date") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }

                                if (dataLoad[i].type == "checkboxtextbox") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    $scope.item.obj2[dataLoad[i].emrdfk] = true
                                }
                                if (dataLoad[i].type == "textarea") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].emrdfk == "2421") {
                                    $scope.user.poto = dataLoad[i].value
                                }
                                if (dataLoad[i].emrdfk == "2422") {
                                    $scope.user.poto2 = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2447") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2426") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], kodeNama: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2448") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2418") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2419") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2420") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2414") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5132") {
                                    // $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaDiagnosa: str}
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5133") {
                                    // $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaDiagnosa: str}
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5134") {
                                    // $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaDiagnosa: str}
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5135") {
                                    // $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaDiagnosa: str}
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5136") {
                                    // $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaDiagnosa: str}
                                }
                            }

                        }
                    })
                }

                $scope.treeSourceRuangan = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi").then(function (e) {
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: true
                            }
                        }
                    });
                    $scope.treeSourceBedah = inlineDefault
                    $scope.mainTreeViewBedahOption = {
                        dataTextField: ["caption"],
                        datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                    // var treeview = $("#treeview").data("kendoTreeView");
                    // .expandPath([2, 5])
                })

                $scope.tambah1 = function () {
                    $scope.show = false;
                    $scope.show2 = true;
                    $scope.showlah2 = true;
                };
                $scope.hapus2 = function () {
                    $scope.show = true;
                    $scope.show2 = false;
                    $scope.showlah2 = false;
                };
                $scope.tambah2 = function () {
                    $scope.show2 = false;
                    $scope.show3 = true;
                    $scope.showlah3 = true;
                };
                $scope.hapus3 = function () {
                    $scope.show2 = true;
                    $scope.show3 = false;
                    $scope.showlah3 = false;
                };
                $scope.tambah3 = function () {
                    $scope.show3 = false;
                    $scope.show4 = true;
                    $scope.showlah4 = true;
                };
                $scope.hapus4 = function () {
                    $scope.show3 = true;
                    $scope.show4 = false;
                    $scope.showlah4 = false;
                };
                $scope.tambah4 = function () {
                    $scope.show4 = false;
                    $scope.show5 = true;
                    $scope.showlah5 = true;
                };
                $scope.hapus5 = function () {
                    $scope.show4 = true;
                    $scope.show5 = false;
                    $scope.showlah5 = false;
                };
                $scope.tambah5 = function () {
                    $scope.show5 = false;
                    $scope.show6 = true;
                    $scope.showlah6 = true;
                };
                $scope.hapus6 = function () {
                    $scope.show5 = true;
                    $scope.show6 = false;
                    $scope.showlah6 = false;
                };
            }

            $scope.RiwayatVitalSign = function () {
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-vital-sign-igd?" + paramSearch, true).then(function (dat) {
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                    }
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.popUpRiwayat.center().open();
                });
            }

            $scope.Clear = function () {
                ////debugger
                $scope.item.obj[1901300122] = undefined
                $scope.item.obj[1901300123] = undefined
                $scope.item.obj[1901300124] = undefined
                $scope.item.obj[1901300125] = undefined
                $scope.item.obj[1901300126] = undefined
                $scope.item.obj[1901300127] = undefined
                $scope.item.obj[1901300128] = undefined
                $scope.item.obj[1901300129] = undefined
                $scope.item.obj[1901300130] = undefined
                $scope.item.obj[1901300131] = undefined
                $scope.item.obj[1901300132] = undefined
                $scope.item.obj[1901300133] = undefined
                $scope.dataSelected = undefined
            }
            $scope.Batal = function () {
                $scope.popUpRiwayat.center().close();
            }

            $scope.tambahriwayat = function () {
                ////debugger
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                nomorEMR = $scope.dataSelected.noemr
                loadVitalSign()
                $scope.popUpRiwayat.center().close();
            }

            loadVitalSign()
            function loadVitalSign() {
                ////debugger
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMR, true).then(function (dat) {
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (dataLoad[i].emrdfk == 4241) {
                            $scope.item.obj[2409] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4242) {
                            $scope.item.obj[2417] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4243) {
                            $scope.item.obj[2416] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4244) {
                            $scope.item.obj[2411] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4245) {
                            $scope.item.obj[2412] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4246) {
                            $scope.item.obj[2410] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116064) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[2414] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].emrdfk == 116065) {
                            $scope.item.obj[2413] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116066) {
                            $scope.item.obj[2415] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116067) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[2418] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].emrdfk == 116068) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[2419] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].emrdfk == 116069) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[2420] = { value: res[0], text: res[1] }
                        }
                    }
                })
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

            //InputObat
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
                    })
                GETKONVERSI()
                // cekObatPsikotropika()
            }
            function GETKONVERSI() {
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                // $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                $scope.item.nilaiKonversi = 1
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
                // statusTambah = false
                //debugger
                // $scope.isRouteLoading = false;
                medifirstService.get("farmasi/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id +
                    "&kelompokpasien=" + $scope.cc.objectkelompokpasienfk, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        // $scope.item.stok = dat.data.jmlstok
                        $scope.item.kekuatan = dat.data.kekuatan
                        $scope.item.sediaan = dat.data.sediaan
                        // $scope.item.hargaSatuan = 0
                        // $scope.item.hargadiskon = 0
                        // $scope.item.hargaNetto = 0
                        // $scope.item.total = 0
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
                            if ($scope.item.kekuatan != undefined && $scope.item.kekuatan != 0) {
                                $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                            }
                        }
                        // statusTambah = true
                        gettotal();
                    });
            }
            $scope.getNilaiKonversi = function () {
                //debugger
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                    $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                    // $scope.item.jumlah = 1//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                    $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                    // $scope.item.hargadiskon =0//hrgsdk * parseFloat(newValue)
                    $scope.item.total = 0// parseFloat(newValue) * 
                    $scope.item.hargaNetto = 0
                    $scope.item.jumlahbulat = 0;
                    // (hrg1-hrgsdk)
                    // }
                }
            });
            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    gettotal()
                }
            });
            function gettotal() {
                //debugger
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
                ////debugger
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
            }
            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = ''
                $scope.item.jumlahbulat = $scope.item.jumlah;// Math.ceil($scope.item.jumlah);
                // $scope.item.dosis=1
                $scope.item.jumlahxmakan = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.hargaNetto = 0
                // $scope.item.aturanPakai=undefined;
                $scope.dataSelected = undefined
                $scope.item.KeteranganPakai = undefined
                $scope.item.jumlahpemakaian = 0
                $scope.item.waktuminum = undefined
                $scope.item.sediaanobat = undefined
                $scope.item.dosisobat = ''
                $scope.item.aturanPakai = undefined
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
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
                $scope.dataSelected = undefined
            }
            function cleargrid() {
                for (var i = 0; i < dataObat.length; i++) {
                    dataObat.splice(i, 1);

                    var subTotal = 0;
                    for (var i = dataObat.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(dataObat[i].total)
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dataObat
                    });
                    $scope.item.totalSubTotal = subTotal
                }
            }
            $scope.klikGrid = function (dataSelected) {
                // //debugger
                // if (statusTambah == false)
                //     return
                // if ($scope.item.jenisKemasan.id == 3){
                //     $scope.ShowSigna2 = false
                // } else {
                //     $scope.ShowSigna3 = true
                // }

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
                $scope.item.jumlah = dataSelected.jumlah
                $scope.item.dosis = dataSelected.dosis
                // $scope.item.aturanPakai = { id: dataSelected.aturanpakaifk, name: dataSelected.aturanpakai }
                $scope.item.aturanPakai = { id: dataSelected.id, name: dataSelected.aturanpakai }
                $scope.item.aturanpakaitxt = dataSelected.aturanpakai
                $scope.item.KeteranganPakai = dataSelected.keterangan
                $scope.item.waktuminum = { id: dataSelected.objectwaktuminumfk, waktuminum: dataSelected.waktuminum }
                $scope.item.sediaanobat = { id: dataSelected.objectsediaanobatfk, sediaanobat: dataSelected.sediaanobat }
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
            $scope.hapus1 = function () {
                // if ($scope.item.jumlah == 0) {
                //     alert("Jumlah harus di isi!")
                //     return;
                // }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                // if ($scope.item.jenisKemasan == undefined) {
                //     alert("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                debugger
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.satuan == undefined) {
                //     alert("Pilih Satuan terlebih dahulu!!")
                //     return;
                // }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = dataObat.length - 1; i >= 0; i--) {
                        if (dataObat[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            dataObat.splice(i, 1);

                            var subTotal = 0;
                            for (var i = dataObat.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(dataObat[i].total)
                                dataObat[i].no = i + 1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: dataObat
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
            $scope.tambah = function () {
                if (statusTambah == false) {
                    return
                }
                // if ($scope.dataGridRiwayat != undefined && $scope.norecOrder == '' && $scope.item.ruangan.id == 94) {
                //     if ($scope.dataGridRiwayat._data.length > 0) {
                //         var orderanDepoRajal = []
                //         for (let i = 0; i < $scope.dataGridRiwayat._data.length; i++) {
                //             const element = $scope.dataGridRiwayat._data[i];
                //             if (element.namaruangan == 'DEPO RAJAL') {
                //                 orderanDepoRajal.push(element)
                //             }
                //         }
                //         if (orderanDepoRajal.length > 0) {
                //             // toastr.error('Hanya Bisa Order Satu Kali !', 'Peringatan')
                //             // return
                //         }
                //     }
                // }
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
                    nomor = dataObat.length + 1
                }
                var data = {};
                $scope.disabledRuangan = true;
                if ($scope.item.no != undefined) {
                    for (var i = dataObat.length - 1; i >= 0; i--) {
                        if (dataObat[i].no == $scope.item.no) {
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
                            data.ruanganfk = 569
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

                            dataObat[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: dataObat
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
                        ruanganfk: 569,//£££
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
                        sediaanobat: $scope.item.sediaanobat != undefined ? $scope.item.sediaanobat.id : null
                    }
                    ////
                    dataObat.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dataObat
                    });
                    ////
                    var subTotal = 0;
                    for (var i = dataObat.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(dataObat[i].total)
                    }
                    $scope.item.totalSubTotal = subTotal
                }
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                }
                Kosongkan();
                clear();
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
                {
                    "field": "namaproduk",
                    "title": "Nama Obat",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "60px",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                    "width": "35px",
                },
                {
                    "field": "aturanpakai",
                    "title": "Aturan Pakai",
                    "width": "100px",
                },
                // {
                //     "field": "waktuminum",
                //     "title": "Cara Penggunaan",
                //     "width": "100px",
                // },
                // {
                //     "field": "keteranganracikan",
                //     "title": "Keterangan Racikan",
                //     "width": "300px",
                // }
            ];
            //End Obat

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        {
                            "field": "no",
                            "title": "No ",
                            "width": "15px"
                        },

                        {
                            "field": "tglemr",
                            "title": "Tgl EMR",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Registrasi",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        },
                        {
                            "field": "noregistrasifk",
                            "title": "No Registrasi",
                            "width": "50px",
                        },
                        {
                            "field": "noemr",
                            "title": "No EMR Vital Sign",
                            "width": "85px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Pegawai",
                            "width": "100px"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Nama Ruangan",
                            "width": "100px"
                        }
                    ]
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }


            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })


            $scope.kembali = function () {
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.Save = function () {
                var photo = ""
                kendo.drawing.drawDOM($(".surface"))
                    .then(function (group) {
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function (data) {
                        photo = data
                    })
                var photo2 = ""
                kendo.drawing.drawDOM($(".surface2"))
                    .then(function (group2) {
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group2);
                    }).done(function (data2) {
                        photo2 = data2
                    })
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    var currentId = arrobj[i];
                    var currentObj = $scope.item.obj[parseInt(currentId)];
                
                    if (currentId == 2447 || currentId == 2448) {
                        arrSave.push({ id: currentId, values: currentObj ? currentObj.namalengkap : null });
                    } else if ((currentId >= 5132 && currentId <= 5136)) {
                        arrSave.push({ id: currentId, values: currentObj ? currentObj.namaDiagnosa : null });
                    } else {
                        arrSave.push({ id: currentId, values: currentObj });
                    }
                }
                arrSave.push({ id: "2421", values: photo })
                arrSave.push({ id: "2422", values: photo2 })
                $scope.cc.jenisemr = 'pengkajianmedisigd'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }

                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
                //savelab
                //debugger
                $scope.userlogin = medifirstService.getPegawaiLogin()
                let haha = "";
                var arrobj = Object.keys($scope.item.layanan)
                //debugger
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    //debugger
                    if ($scope.item.layanan[parseInt(arrobj[i])] == true) {
                        // if (arrobj[i] == 4056686 || arrobj[i] == 4056687 || arrobj[i] == 4056688 || arrobj[i] == 4056772 || arrobj[i] == 4056768 || arrobj[i] == 4056769 ||
                        //     arrobj[i] == 4056760 || arrobj[i] == 4056761 || arrobj[i] == 4056784 || arrobj[i] == 4056781 || arrobj[i] == 4056891 || arrobj[i] == 4076580 ||
                        //     arrobj[i] == 4076908 || arrobj[i] == 4056777 || arrobj[i] == 4056778) {
                        //     arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].nama })
                        //debugger
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            // namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: 569,
                            objectruangantujuanfk: 575,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: 1,
                            objectkelasfk: 6,
                            nourut: null,
                        }
                        haha = haha + "," + parseInt(arrobj[i])
                        data2.push(data)
                    }
                }
                haha = haha.slice(1, haha.length)
                //debugger
                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: 569,
                    objectruangantujuanfk: 575,
                    departemenfk: 3,
                    pegawaiorderfk: $scope.userlogin.id != undefined ? $scope.item.userlogin : null,
                    // pegawaiorderfk: null,
                    keterangan: $scope.item.keteranganlab != undefined ? $scope.item.keteranganlab : null,
                    iscito: 1,
                    details: data2,
                }

                $scope.isSimpan = true
                debugger
                if (haha.length != 0) {
                    medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                        if (e.data.status == 201) {
                            // $rootScope.isShowLab = !$rootScope.isShowLab
                            medifirstService.get('emr/get-tindakan-for-cppt?idProduk=' + haha).then(function (a) {
                                let namaproduk = ""
                                //
                                for (let i = 0; i < a.data.length; i++) {
                                    namaproduk = namaproduk + " LAB : " + a.data[i].namaproduk + "\n"
                                }
                                $scope.data.names[0].p = $scope.data.names[0].p + namaproduk
                            })
                        }
                        $scope.item.layanan = []
                        // $scope.isSimpan = false
                        medifirstService.postLogging('Order Laboratorium', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Laboratorium No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })
                    })
                }
                //saverad
                //debugger
                $scope.userlogin = medifirstService.getPegawaiLogin()
                let hihi = "";
                var arrobj = Object.keys($scope.item.layanan2)
                //debugger
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    //debugger
                    if ($scope.item.layanan2[parseInt(arrobj[i])] == true) {
                        //debugger
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            // namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: 569,
                            objectruangantujuanfk: 576,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: 1,
                            objectkelasfk: 6,
                            nourut: null,
                        }
                        hihi = hihi + "," + parseInt(arrobj[i])
                        data2.push(data)
                    }
                }
                hihi = hihi.slice(1, hihi.length)

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: 569,
                    objectruangantujuanfk: 576,
                    departemenfk: 27,
                    pegawaiorderfk: $scope.userlogin.id != undefined ? $scope.item.userlogin : null,
                    // pegawaiorderfk: null,
                    keterangan2: $scope.item.keteranganrad != undefined ? $scope.item.keteranganrad : null,
                    iscito: 1,
                    details: data2,
                }

                $scope.isSimpan = true
                if (hihi.length != 0) {
                    medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                        if (e.data.status == 201) {
                            // $rootScope.isShowLab = !$rootScope.isShowLab
                            medifirstService.get('emr/get-tindakan-for-cppt?idProduk=' + haha).then(function (a) {
                                let namaproduk = ""
                                //
                                for (let i = 0; i < a.data.length; i++) {
                                    namaproduk = namaproduk + " LAB : " + a.data[i].namaproduk + "\n"
                                }
                                $scope.data.names[0].p = $scope.data.names[0].p + namaproduk
                            })
                        }
                        $scope.item.layanan2 = []
                        // $scope.isSimpan = false
                        medifirstService.postLogging('Order Radiologi', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Laboratorium No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })
                    })
                }

                //SaveObat
                //debugger
                // $scope.simpan = function () {    
                // if (dataObat.length == 0) {
                //     alert("Pilih Produk terlebih dahulu!!")
                //     return
                // }
                $scope.userlogin = medifirstService.getPegawaiLogin()
                //debugger
                var strukorder = {
                    norec: $scope.norecOrder,
                    tglresep: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    penulisresepfk: $scope.userlogin.id,
                    ruanganfk: 481,
                    noregistrasifk: $scope.cc.norec,
                    qtyproduk: $scope.dataGrid._data.length,
                    noruangan: null,
                    isreseppulang: null,
                    caraambil: null
                }
                //debugger
                var objSave = [
                    {
                        strukorder: strukorder,
                        orderfarmasi: dataObat
                    }
                ]
                ////debugger
                // $scope.hideSimpan = false
                if (dataObat.length != 0) {
                    medifirstService.post('emr/simpan-order-pelayananobatfarmasi', objSave).then(function (e) {
                        for (let i = 0; i < data2.length; i++) {
                            // if(data2[i].jeniskemasan == "Racikan") {
                            //     $scope.data.names[0].p = $scope.data.names[0].p + " E-Resep : " + data2[i].keteranganracikan + "\n"
                            // } else {
                            $scope.data.names[0].p = $scope.data.names[0].p + " E-Resep : " + data2[i].namaproduk + "\n"
                            // }
                        }
                        $scope.item.resep == undefined
                        $scope.norecOrder = ''
                        medifirstService.postLogging('Order Resep', 'Norec strukresep_t', e.data.noresep.norec,
                            'Order Resep No Order - ' + e.data.noresep.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                            })
                        // $scope.item.resep = e.data.noresep.noorder
                        // $scope.hideSimpan = false
                        Kosongkan();
                        clear();
                        cleargrid();
                        // init();
                        $scope.batal();
                        $scope.disabledRuangan = false
                        if ($scope.item.noRuang != undefined)
                            cacheHelper.set('noRuangInputResep', $scope.item.noRuang)
                    })
                }
                // }
                // init()
            }
            $scope.getProduk = function(ruangan){
                var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
                //  medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
                medifirstService.getPart("tatarekening/tindakan/get-tindakan?idRuangan="
                        + ruangan.id
                        + "&idKelas="
                        + 6
                        + RuangRanap
                        + "&idDepartemenAsal="
                        + $scope.cc.objectdepartemenfk
                        + "&idKelompokPasien="
                        + $scope.cc.objectkelompokpasienfk
                        + "&idJenisPelayanan="
                        + 1, true, 10, 10)
                        .then(function (x) {
                            $scope.listLayanan = x;
                            //    $scope.isRouteLoading = false;

                        })
            }

            $scope.getProdukLab = function(ruangan){
                var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
                //  medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
                medifirstService.getPart("tatarekening/tindakan/get-tindakan?idRuangan="
                        + ruangan.id
                        + "&idKelas="
                        + 6
                        + RuangRanap
                        + "&idDepartemenAsal="
                        + $scope.cc.objectdepartemenfk
                        + "&idKelompokPasien="
                        + $scope.cc.objectkelompokpasienfk
                        + "&idJenisPelayanan="
                        + 1, true, 10, 10)
                        .then(function (x) {
                            $scope.listLayananLab = x;
                            //    $scope.isRouteLoading = false;

                        })
            }

            function loadLaboratorium() {
                medifirstService.get("emr/get-combo-penunjang?departemenfk=3", true).then(function (dat) {
                    $scope.item.ruanganAsalLab = $scope.item.namaRuangan
                    
                    $scope.listRuanganTujuanLab =  dat.data.ruangantujuan//  dat.data.ruangantujuan;
                    $scope.item.ruangantujuanLab = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan
                    };
                     $scope.getProdukLab (   $scope.item.ruangantujuanLab )
                });
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                medifirstService.get("radiologi/get-rincian-pelayanan-emr?noregistrasi=" + $scope.cc.noregistrasi + "&ruid=576"
                , true).then(function (dat) {
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
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
                        if( dat.data.data[i].statusperiksa == 1)
                        {
                            dat.data.data[i].statusperiksa = "✔";
                        }else
                        {
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

                    // debugger
                    $scope.dataGridRadio = {
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
                function (error) {
                    $scope.isLoading = false;
                });
            }

            function loadRadiologi() {
                medifirstService.get("emr/get-combo-penunjang?departemenfk=27", true).then(function (dat) {
                    $scope.item.ruanganAsal = $scope.item.namaRuangan
                    
                    $scope.listRuanganTujuan =  dat.data.ruangantujuan//  dat.data.ruangantujuan;
                    $scope.item.ruangantujuan = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan
                    };
                     $scope.getProduk (   $scope.item.ruangantujuan )
                });
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                medifirstService.get("radiologi/get-rincian-pelayanan-emr?noregistrasi=" + $scope.cc.noregistrasi + "&ruid=576"
                , true).then(function (dat) {
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
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
                        if( dat.data.data[i].statusperiksa == 1)
                        {
                            dat.data.data[i].statusperiksa = "✔";
                        }else
                        {
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

                    // debugger
                    $scope.dataGridRadio = {
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
                function (error) {
                    $scope.isLoading = false;
                });
            }

            $scope.addLab = function () {
                //    if ($scope.item.statusVerif == true) {
                //       toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //       return;
                //   }
                if ($scope.item.ruangantujuanLab == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layananlab == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGridOrderLab == undefined) {
                    nomor = 1
                } else {
                    nomor = dataLaboratorium.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = dataLaboratorium.length - 1; i >= 0; i--) {
                        if (dataLaboratorium[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.produkfk = $scope.item.layananlab.id
                            data.namaproduk = $scope.item.layananlab.namaproduk
                            data.keteranganlab = $scope.item.keteranganlab
                            data.qtyproduk = parseFloat(1)
                            data.objectruanganfk = 569
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.objectkelasfk = 6

                            dataLaboratorium[i] = data;
                            $scope.dataGridOrderLab = new kendo.data.DataSource({
                                data: dataLaboratorium
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layananlab.id,
                        namaproduk: $scope.item.layananlab.namaproduk,
                        keteranganlab: $scope.item.keteranganlab,
                        qtyproduk: parseFloat(1),
                        objectruanganfk: 569,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        objectkelasfk: 6
                    }
                    dataLaboratorium.push(data)
                    dataLaboratoriumPush.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrderLab = new kendo.data.DataSource({
                        data: dataLaboratorium
                    });
                }
                // $scope.item.obj[2639] = $scope.item.obj[2639] + 'Rad : ' + $scope.item.layananrad.namaproduk + "\n";
                // $scope.simpanOrderRadiologi();
                $scope.batalLab();
            }
            $scope.formatTanggal = function(tanggal) {
                if (!tanggal) return '';
                return moment(tanggal).format('DD-MM-YYYY HH:mm'); // Gunakan moment.js
            };
            
            $scope.hapusLab = function () {
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layananlab == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = dataLaboratorium.length + 1
                }
                debugger
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = dataLaboratorium.length - 1; i >= 0; i--) {
                        if (dataLaboratorium[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            dataLaboratorium.splice(i, 1);

                            var subTotal = 0;
                            for (var i = dataLaboratorium.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(dataLaboratorium[i].total)
                                dataLaboratorium[i].no = i + 1
                            }
                            // dataLaboratorium[i] = data;
                            $scope.dataGridOrderLab = new kendo.data.DataSource({
                                data: dataLaboratorium
                            });
                        }
                    }
                }
                debugger
                $scope.batalLab();
            }
            $scope.batalLab = function () {
                $scope.item.layananlab = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
                $scope.item.keteranganlab = ''
            }
            
            $scope.columnGridOrderLab = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "keteranganlab",
                    "title": "Keterangan",
                    "width": "40px",
                }
            ];

            $scope.klikGridOrderLab = function (dataSelectedOrderLab) {
                debugger
                $scope.item.layananlab = { id: dataSelectedOrderLab.produkfk, namaproduk: dataSelectedOrderLab.namaproduk }
                $scope.item.qty = dataSelectedOrderLab.qty
                $scope.item.no = dataSelectedOrderLab.no
                $scope.item.keteranganlab = dataSelectedOrderLab.keteranganlab
            }

            $scope.simpanOrderLaboratorium = function () {
                //saverad
                debugger
                if (dataLaboratorium.length == 0) {
                    toastr.error('Data Belum Ditambahkan !')
                    return
                }
                $scope.userlogin = medifirstService.getPegawaiLogin()
                let hihi = "";
                // var arrobj = Object.keys($scope.item.layanan2)
                //debugger
                var data2 = []
                for (var i = dataLaboratorium.length - 1; i >= 0; i--) {
                    //debugger
                    // if ($scope.item.layanan2[parseInt(arrobj[i])] == true) {
                        //debugger
                        var data = {
                            no: i + 1,
                            produkfk: dataLaboratorium[i].produkfk,
                            // namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: 569,
                            objectruangantujuanfk: 575,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: 1,
                            objectkelasfk: 6,
                            nourut: null,
                        }
                        hihi = hihi + "," + parseInt(dataLaboratorium[i].produkfk)
                        data2.push(data)
                    // }
                }
                hihi = hihi.slice(1, hihi.length)

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: 569,
                    objectruangantujuanfk: 575,
                    departemenfk: 3,
                    pegawaiorderfk: $scope.userlogin.id,
                    keterangan: $scope.item.keteranganlab != undefined ? $scope.item.keteranganlab : null,
                    iscito: 1,
                    details: data2,
                }

                $scope.isSimpan = true
                if (hihi.length != 0) {
                    medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                        if (e.data.status == 201) {
                            $scope.item.obj[2639] = 'Lab : ' + dataLaboratorium[0].namaproduk + "\n";
                        }
                        $scope.item.layanan2 = []
                        dataLaboratorium = []
                        medifirstService.postLogging('Order Laboratorium', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Laboratorium No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })
                    })
                }
            }

            $scope.add = function () {
                //    if ($scope.item.statusVerif == true) {
                //       toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //       return;
                //   }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layananrad == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGridOrder == undefined) {
                    nomor = 1
                } else {
                    nomor = dataRadiologi.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = dataRadiologi.length - 1; i >= 0; i--) {
                        if (dataRadiologi[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.produkfk = $scope.item.layananrad.id
                            data.namaproduk = $scope.item.layananrad.namaproduk
                            data.keteranganrad = $scope.item.keteranganrad
                            data.qtyproduk = parseFloat(1)
                            data.objectruanganfk = 569
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.objectkelasfk = 6

                            dataRadiologi[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: dataRadiologi
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layananrad.id,
                        namaproduk: $scope.item.layananrad.namaproduk,
                        keteranganrad: $scope.item.keteranganrad,
                        qtyproduk: parseFloat(1),
                        objectruanganfk: 569,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        objectkelasfk: 6
                    }
                    dataRadiologi.push(data)
                    dataRadiologiPush.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: dataRadiologi
                    });
                }
                // $scope.item.obj[2639] = $scope.item.obj[2639] + 'Rad : ' + $scope.item.layananrad.namaproduk + "\n";
                // $scope.simpanOrderRadiologi();
                $scope.batal();
            }
            $scope.hapus = function () {
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layananrad == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = dataRadiologi.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = dataRadiologi.length - 1; i >= 0; i--) {
                        if (dataRadiologi[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            dataRadiologi.splice(i, 1);

                            var subTotal = 0;
                            for (var i = dataRadiologi.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(dataRadiologi[i].total)
                                dataRadiologi[i].no = i + 1
                            }
                            // dataRadiologi[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: dataRadiologi
                            });
                        }
                    }
                }
                $scope.batal();
            }
            $scope.batal = function () {
                $scope.item.layananrad = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
                $scope.item.keteranganrad = ''
            }
            
            $scope.columnGridOrderRad = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "keteranganrad",
                    "title": "Keterangan",
                    "width": "40px",
                }
            ];

            $scope.klikGridOrderRad = function (dataSelectedOrderRad) {
                debugger
                $scope.item.layananrad = { id: dataSelectedOrderRad.produkfk, namaproduk: dataSelectedOrderRad.namaproduk }
                $scope.item.qty = dataSelectedOrderRad.qty
                $scope.item.no = dataSelectedOrderRad.no
                $scope.item.keteranganrad = dataSelectedOrderRad.keteranganrad
            }

            $scope.simpanOrderRadiologi = function () {
                //saverad
                debugger
                if (dataRadiologi.length == 0) {
                    toastr.error('Data Belum Ditambahkan !')
                    return
                }
                $scope.userlogin = medifirstService.getPegawaiLogin()
                let hihi = "";
                // var arrobj = Object.keys($scope.item.layanan2)
                //debugger
                var data2 = []
                for (var i = dataRadiologi.length - 1; i >= 0; i--) {
                    //debugger
                    // if ($scope.item.layanan2[parseInt(arrobj[i])] == true) {
                        //debugger
                        var data = {
                            no: i + 1,
                            produkfk: dataRadiologi[i].produkfk,
                            // namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: 569,
                            objectruangantujuanfk: 576,
                            // pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: 1,
                            objectkelasfk: 6,
                            nourut: null,
                        }
                        hihi = hihi + "," + parseInt(dataRadiologi[i].produkfk)
                        data2.push(data)
                    // }
                }
                hihi = hihi.slice(1, hihi.length)

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: $scope.cc.norec,
                    norec_pd: $scope.cc.norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: 569,
                    objectruangantujuanfk: 576,
                    departemenfk: 27,
                    pegawaiorderfk: $scope.userlogin.id,
                    keterangan: $scope.item.keteranganrad != undefined ? $scope.item.keteranganrad : null,
                    iscito: 1,
                    details: data2,
                }

                $scope.isSimpan = true
                if (hihi.length != 0) {
                    medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                        if (e.data.status == 201) {
                            $scope.item.obj[2639] = $scope.item.obj[2639] + 'Rad : ' + dataRadiologi[0].namaproduk + "\n";
                        }
                        $scope.item.layanan2 = []
                        dataRadiologi = []
                        medifirstService.postLogging('Order Radiologi', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Radiologi No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })
                    })
                }
            }
        }
    ]);
});