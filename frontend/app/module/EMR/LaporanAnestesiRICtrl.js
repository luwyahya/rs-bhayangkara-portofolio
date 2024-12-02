define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanAnestesiRICtrl', ['$q', '$mdDialog', '$rootScope', '$scope', 'ModelItem', '$state',
        'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $mdDialog, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, FormGroup, FormArray, FormBuilder) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.now = new Date()
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            var norec_Emr = ''
            var norec_Emr2 = ''
            var norec_apd = ''
            $scope.cc.emrfk = 2023
            var dataLoad = []
            $scope.item = {};
            $scope.model = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            $scope.isKembali = true
            var paramSearch = ''
            $scope.noemr = '-'
            $scope.noemranestesi = ''
            $scope.noemrgrafik = '-'
            $scope.user = {};
            var datana = [];
            var datana2 = [];
            $scope.item.tgl = []
            $scope.item.jp = []
            $scope.item.hp = []
            $scope.item.it = []
            $scope.item.dk = []
            var data_head = [];
            var data_head2 = [];
            var data_Save = [];
            var data_Save2 = [];
            var data_Intra = [];
            var data_Pasca = [];
            var idd = 700
            $scope.isYaAsma = false
            $scope.isRanap = true;
            $scope.yaOperasi = false;
            $scope.istempatLaporan = true;
            $scope.isskor = false;
            $scope.item.obj2 = []
            $scope.item.obj3 = []
            $scope.isriwayatmakan = false;
            $scope.isblokade = false;
            $scope.iskonversi = false;
            $scope.issecio = false;
            $scope.isbromage = false;
            $scope.isaldrete = false;
            $scope.issteward = false;
            $scope.isYaAsma = false;
            $scope.isdiabetes = false;
            $scope.isalergi = false;
            $scope.isriwayatmakan = false;
            $scope.yaGaKompilkasi= false;
            var nomorEMRSS = '';
            $scope.item.buatbaru = false;
            var noemr = ''

            $scope.isPertama = true;
            $scope.isKedua = false;
            $scope.isKetiga = false;
            $scope.isKeempat = false;
            $scope.sebelum1 = true;
            $scope.sebelum2 = true;
            $scope.sebelum3 = true;
            $scope.lanjut1 = true
            $scope.lanjut2 = true
            $scope.lanjut3 = true
            $scope.islihat = true
            $scope.islihatkembali = false

            $scope.ishipertenesi= false;
            $scope.isjantung= false;
            $scope.item.buatbarugrafik = false;

            // var qrcode = '';

            $scope.logo = medifirstService.getLogo()
            LoadCacheHelper();
            LoadCombo();
            // getApd();

            function LoadCombo() {
                ;
                medifirstService.get("emr/get-combo").then(function (dat) {
                    $scope.listDokterBedah = dat.data.dokter
                    $scope.listAsistenBedah = dat.data.pegawaiAll
                    $scope.listDokterAnestesi = dat.data.dokter
                    $scope.listPerawatAnestesi = dat.data.perawat
                    // $scope.listAdaTidak = dat.data.adaTidak
                    $scope.listSedasi = dat.data.sedasi
                    $scope.listAnestesi = dat.data.anestesi
                    $scope.listTeknik = dat.data.teknik
                    // $scope.listYaTidak = dat.data.yatidak
                    $scope.listLetak = dat.data.letak
                    $scope.listAirway = dat.data.airway
                    $scope.listKeadaan = dat.data.keadaan
                    $scope.listJenisKelamin = dat.data.jeniskelamin
                    $scope.listKesadaran = dat.data.kesadaran
                    $scope.listDibantu = dat.data.dibantu
                    $scope.listPegawai = dat.data.pegawaiAll
                    $scope.listAsa = [
                        { "text": "1", "value": "I" },
                        { "text": "2", "value": "II" },
                        { "text": "3", "value": "III" },
                        { "text": "4", "value": "IV" },
                        { "text": "5", "value": "V" },
                        { "text": "6", "value": "VI" }
                    ]
                    $scope.listEr = [
                        { "text": "0", "value": "E" },
                        { "text": "0", "value": "R" }
                    ]
                    $scope.listSedasi2 = [
                        { "text": "1", "value": "Moderat" },
                        { "text": "2", "value": "Dalam" }
                    ]
                    $scope.listAnestesiUmum = [
                        { "text": "0", "value": "LMA" },
                        { "text": "0", "value": "Intubasi" }
                    ]
                    $scope.listRegional = [
                        { "text": "1", "anestesiregional": "Spinal" },
                        { "text": "2", "anestesiregional": "Epidural" },
                        { "text": "3", "anestesiregional": "Kaudal" },
                        { "text": "4", "anestesiregional": "Blok Prefier" },
                        { "text": "5", "anestesiregional": "CSE" },
                    ]
                    $scope.listPuasa = [
                        { "text": "0", "value": "4 Jam" },
                        { "text": "0", "value": "6 Jam" },
                        { "text": "0", "value": "8 Jam" },
                        { "text": "0", "value": "12 Jam" }
                    ]
                    $scope.listDarah = [
                        { "text": "0", "value": "WB" },
                        { "text": "0", "value": "PRC" },
                        { "text": "0", "value": "Trombovyt" },
                        { "text": "0", "value": "Lain - lain" }
                    ]
                    $scope.listriwayatmakanobat = [
                        { "id": "1", "value": "Ada" },
                        { "id": "2", "value": "Tidak" },
                    ]

                    $scope.listASA = [
                        { "text": "1", "value": "1" },
                        { "text": "2", "value": "2" },
                        { "text": "3", "value": "3" },
                        { "text": "4", "value": "4" },
                        { "text": "5", "value": "5" },
                        { "text": "6", "value": "6" }
                    ]

                    $scope.listR = [
                        { "text": "Cito", "value": "Cito" },
                        { "text": "Elektif", "value": "Elektif" }
                    ]
                    $scope.listYaTidak = [
                        { "text": "Ya", "value": "Ya" },
                        { "text": "Tidak", "value": "Tidak" }
                    ]
                    $scope.listAdaTidak = [
                        { "text": "Ada", "value": "Ada" },
                        { "text": "Tidak", "value": "Tidak" }
                    ]
                    $scope.listEr = [
                        { "text": "0", "value": "E" },
                        { "text": "0", "value": "R" }
                    ]
                    var dataCombo = dat.data.vitalsigns
                    for (var i = 0; i < dataCombo.length; i++) {
                        if (dataCombo[i].id == 3) {
                            dataCombo[i].simbol = "●";
                        } else if (dataCombo[i].id == 5) {
                            dataCombo[i].simbol = "▲";
                        } else if (dataCombo[i].id == 6) {
                            dataCombo[i].simbol = "ꓦ";
                        } else if (dataCombo[i].id == 7) {
                            dataCombo[i].simbol = "^";
                        } else if (dataCombo[i].id == 8) {
                            dataCombo[i].simbol = "x";
                        } else if (dataCombo[i].id == 9) {
                            dataCombo[i].simbol = "o";
                        } else if (dataCombo[i].id == 10) {
                            dataCombo[i].simbol = "T";
                        } else if (dataCombo[i].id == 11) {
                            dataCombo[i].simbol = "E";
                        } else if (dataCombo[i].id == 12) {
                            dataCombo[i].simbol = "NTAR YA SIMBOLNYA BELUM NEMU";
                        } else if (dataCombo[i].id == 13) {
                            dataCombo[i].simbol = "▬";
                        } else if (dataCombo[i].id == 14) {
                            dataCombo[i].simbol = "NTAR YA SIMBOLNYA BELUM NEMU (2)";
                        }
                    }
                    $scope.listVitalSigns = dataCombo;
                })
                medifirstService.get('emr/get-image-anestesi?').then(function (dat) {
                    //debugger
                    $scope.user.kaki1 = dat.data[0].template
                    $scope.user.kaki2 = dat.data[1].template
                    $scope.user.kaki3 = dat.data[2].template
                    $scope.user.kaki4 = dat.data[3].template
                })

            }
            var sesiesSuhu = []
            var seriesNadi = []
            var seriesSistole = []
            var seriesDistole = []
            var seriesRespirasi = []
            var seriesSaturasi = []
            var seriesO2 = []
            var seriesN2O = []
            var seriesVolatile = []
            var sesiesSuhu2 = []
            var seriesNadi2 = []
            var seriesSistole2 = []
            var seriesDistole2 = []
            var seriesRespirasi2 = []
            var seriesSaturasi2 = []
            var seriesO22 = []
            var seriesN2O2 = []
            var seriesVolatile2 = []
            var seriesAIR = []
            loadChart()
            function loadChart() {
                // default grafik 1
                if ($scope.item.obj2[1901300393] == undefined) {
                    $scope.item.obj2[1901300393] = moment($scope.now).format('YYYY-MM-DD 00:00')
                }
                if ($scope.item.obj2[1901300394] == undefined) {
                    $scope.item.obj2[1901300394] = moment($scope.item.obj2[1901300393]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300395] == undefined) {
                    $scope.item.obj2[1901300395] = moment($scope.item.obj2[1901300394]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300396] == undefined) {
                    $scope.item.obj2[1901300396] = moment($scope.item.obj2[1901300395]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300397] == undefined) {
                    $scope.item.obj2[1901300397] = moment($scope.item.obj2[1901300396]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300398] == undefined) {
                    $scope.item.obj2[1901300398] = moment($scope.item.obj2[1901300397]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300399] == undefined) {
                    $scope.item.obj2[1901300399] = moment($scope.item.obj2[1901300398]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300400] == undefined) {
                    $scope.item.obj2[1901300400] = moment($scope.item.obj2[1901300399]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300401] == undefined) {
                    $scope.item.obj2[1901300401] = moment($scope.item.obj2[1901300400]).add('minute', 15)._d
                }
                // default grafik 2
                if ($scope.item.obj2[1901300402] == undefined) {
                    $scope.item.obj2[1901300402] = moment($scope.now).format('YYYY-MM-DD 00:00')
                }
                if ($scope.item.obj2[1901300403] == undefined) {
                    $scope.item.obj2[1901300403] = moment($scope.item.obj2[1901300402]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300404] == undefined) {
                    $scope.item.obj2[1901300404] = moment($scope.item.obj2[1901300403]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300405] == undefined) {
                    $scope.item.obj2[1901300405] = moment($scope.item.obj2[1901300404]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300406] == undefined) {
                    $scope.item.obj2[1901300406] = moment($scope.item.obj2[1901300405]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300407] == undefined) {
                    $scope.item.obj2[1901300407] = moment($scope.item.obj2[1901300406]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300408] == undefined) {
                    $scope.item.obj2[1901300408] = moment($scope.item.obj2[1901300407]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300409] == undefined) {
                    $scope.item.obj2[1901300409] = moment($scope.item.obj2[1901300408]).add('minute', 15)._d
                }
                if ($scope.item.obj2[1901300410] == undefined) {
                    $scope.item.obj2[1901300410] = moment($scope.item.obj2[1901300409]).add('minute', 15)._d
                }
                $("#chartNadi").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 0,
                        max: 220,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        // categories: [6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24],
                        // categories: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240
                        // ],
                        // categories: ['01:15','01:30','01:45','02:00','02:15','02:30'],
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartNadiPrint").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 0,
                        max: 220,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        // categories: [6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24],
                        // categories: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960, 975, 990, 1005, 1020, 1035, 1050, 1065, 1080, 1095, 1110, 1125, 1140, 1155, 1170, 1185, 1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335, 1350, 1365, 1380, 1395, 1410, 1425, 1440, 1455, 1470, 1485, 1500
                        // ],
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartNadi2").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi2,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 0,
                        max: 220,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        // categories: [6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24],
                        // categories: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960, 975, 990, 1005, 1020, 1035, 1050, 1065, 1080, 1095, 1110, 1125, 1140, 1155, 1170, 1185, 1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335, 1350, 1365, 1380, 1395, 1410, 1425, 1440, 1455, 1470, 1485, 1500
                        // ],
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartNadi2Print").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi2,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 0,
                        max: 220,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        // categories: [6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24],
                        // categories: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960, 975, 990, 1005, 1020, 1035, 1050, 1065, 1080, 1095, 1110, 1125, 1140, 1155, 1170, 1185, 1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335, 1350, 1365, 1380, 1395, 1410, 1425, 1440, 1455, 1470, 1485, 1500
                        // ],
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartSuhu").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 34,
                            max: 44,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSuhuPrint").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 34,
                            max: 44,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSuhu2").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu2,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 35,
                            max: 42,
                            majorUnit: 0.5
                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSuhu2Print").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu2,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 35,
                            max: 42,
                            majorUnit: 0.5
                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiSistole").kendoChart({
                    title: {
                        text: "Grafik Tensi Sistole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSistole,
                        name: "Tensi Sistole",
                        color: "#02FE0D",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TS",
                            title: { text: "TS" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiSistolePrint").kendoChart({
                    title: {
                        text: "Grafik Tensi Sistole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSistole,
                        name: "Tensi Sistole",
                        color: "#02FE0D",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TS",
                            title: { text: "TS" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiSistole2").kendoChart({
                    title: {
                        text: "Grafik Tensi Sistole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSistole2,
                        name: "Tensi Sistole",
                        color: "#02FE0D",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TS",
                            title: { text: "TS" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiSistole2Print").kendoChart({
                    title: {
                        text: "Grafik Tensi Sistole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSistole2,
                        name: "Tensi Sistole",
                        color: "#02FE0D",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TS",
                            title: { text: "TS" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiDiastole").kendoChart({
                    title: {
                        text: "Grafik Tensi Diastole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesDistole,
                        name: "Tensi Diastole",
                        color: "#02FEFE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TD",
                            title: { text: "TD" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiDiastolePrint").kendoChart({
                    title: {
                        text: "Grafik Tensi Diastole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesDistole,
                        name: "Tensi Diastole",
                        color: "#02FEFE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TD",
                            title: { text: "TD" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiDiastole2").kendoChart({
                    title: {
                        text: "Grafik Tensi Diastole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesDistole2,
                        name: "Tensi Diastole",
                        color: "#02FEFE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TD",
                            title: { text: "TD" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTensiDiastole2Print").kendoChart({
                    title: {
                        text: "Grafik Tensi Diastole"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesDistole2,
                        name: "Tensi Diastole",
                        color: "#02FEFE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "TD",
                            title: { text: "TD" },
                            min: 20,
                            max: 260,
                            majorUnit: 20,

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartRespirasi").kendoChart({
                    title: {
                        text: "Grafik Respirasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesRespirasi,
                        name: "Respirasi",
                        color: "#FE02EE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "R",
                            title: { text: "R" },
                            min: 0,
                            max: 60,
                            majorUnit: 2

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartRespirasiPrint").kendoChart({
                    title: {
                        text: "Grafik Respirasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesRespirasi,
                        name: "Respirasi",
                        color: "#FE02EE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "R",
                            title: { text: "R" },
                            min: 0,
                            max: 60,
                            majorUnit: 2

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartRespirasi2").kendoChart({
                    title: {
                        text: "Grafik Respirasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesRespirasi2,
                        name: "Respirasi",
                        color: "#FE02EE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "R",
                            title: { text: "R" },
                            min: 0,
                            max: 60,
                            majorUnit: 2

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartRespirasi2Print").kendoChart({
                    title: {
                        text: "Grafik Respirasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesRespirasi2,
                        name: "Respirasi",
                        color: "#FE02EE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "R",
                            title: { text: "R" },
                            min: 0,
                            max: 60,
                            majorUnit: 2

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartSaturasi").kendoChart({
                    title: {
                        text: "Grafik Saturasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSaturasi,
                        name: "Saturasi",
                        color: "#F6FE02",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "SR",
                            title: { text: "SR" },
                            min: 0,
                            max: 100,
                            majorUnit: 10

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSaturasiPrint").kendoChart({
                    title: {
                        text: "Grafik Saturasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSaturasi,
                        name: "Saturasi",
                        color: "#F6FE02",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "SR",
                            title: { text: "SR" },
                            min: 0,
                            max: 100,
                            majorUnit: 10

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSaturasi2").kendoChart({
                    title: {
                        text: "Grafik Saturasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSaturasi2,
                        name: "Saturasi",
                        color: "#F6FE02",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "SR",
                            title: { text: "SR" },
                            min: 0,
                            max: 100,
                            majorUnit: 10

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSaturasi2Print").kendoChart({
                    title: {
                        text: "Grafik Saturasi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSaturasi2,
                        name: "Saturasi",
                        color: "#F6FE02",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "SR",
                            title: { text: "SR" },
                            min: 0,
                            max: 100,
                            majorUnit: 10

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartO2").kendoChart({
                    title: {
                        text: "Grafik O2"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesO2,
                        name: "O2",
                        color: "#FEB502",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "O",
                            title: { text: "O2" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartO2Print").kendoChart({
                    title: {
                        text: "Grafik O2"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesO2,
                        name: "O2",
                        color: "#FEB502",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "O",
                            title: { text: "O2" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartO22").kendoChart({
                    title: {
                        text: "Grafik O2"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesO22,
                        name: "O2",
                        color: "#FEB502",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "O",
                            title: { text: "O2" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartO22Print").kendoChart({
                    title: {
                        text: "Grafik O2"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesO22,
                        name: "O2",
                        color: "#FEB502",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "O",
                            title: { text: "O2" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartN2O").kendoChart({
                    title: {
                        text: "Grafik N2O"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesN2O,
                        name: "N2O",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "N2O",
                            title: { text: "N2O" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartN2OPrint").kendoChart({
                    title: {
                        text: "Grafik N2O"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesN2O,
                        name: "N2O",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "N2O",
                            title: { text: "N2O" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartAIRPrint").kendoChart({
                    title: {
                        text: "Grafik AIR"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesAIR,
                        name: "AIR",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "AIR",
                            title: { text: "AIR" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartN2O2").kendoChart({
                    title: {
                        text: "Grafik N2O"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesN2O2,
                        name: "N2O",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "N2O",
                            title: { text: "N2O" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartN2O2Print").kendoChart({
                    title: {
                        text: "Grafik N2O"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesN2O2,
                        name: "N2O",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "N2O",
                            title: { text: "N2O" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300402]).format('HH:mm'),moment($scope.item.obj2[1901300403]).format('HH:mm'),moment($scope.item.obj2[1901300404]).format('HH:mm'),moment($scope.item.obj2[1901300405]).format('HH:mm'),moment($scope.item.obj2[1901300406]).format('HH:mm'),
                            moment($scope.item.obj2[1901300407]).format('HH:mm'),moment($scope.item.obj2[1901300408]).format('HH:mm'),moment($scope.item.obj2[1901300409]).format('HH:mm'),moment($scope.item.obj2[1901300410]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartVolatile").kendoChart({
                    title: {
                        text: "Grafik Volatile"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesVolatile,
                        name: "Volatile",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "Volatile",
                            title: { text: "Volatile" },
                            min: 1,
                            max: 20,
                            majorUnit: 0.5

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartVolatilePrint").kendoChart({
                    title: {
                        text: "Grafik Volatile"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesVolatile,
                        name: "Volatile",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "Volatile",
                            title: { text: "Volatile" },
                            min: 1,
                            max: 20,
                            majorUnit: 0.5

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartVolatile2").kendoChart({
                    title: {
                        text: "Grafik Volatile"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesVolatile2,
                        name: "Volatile",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "Volatile",
                            title: { text: "Volatile" },
                            min: 1,
                            max: 20,
                            majorUnit: 0.5

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartVolatile2Print").kendoChart({
                    title: {
                        text: "Grafik Volatile"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesVolatile2,
                        name: "Volatile",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "Volatile",
                            title: { text: "Volatile" },
                            min: 1,
                            max: 20,
                            majorUnit: 0.5

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartAIR").kendoChart({
                    title: {
                        text: "Grafik AIR"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesAIR,
                        name: "AIR",
                        color: "#EB02FE",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "AIR",
                            title: { text: "AIR" },
                            min: 0,
                            max: 15,
                            majorUnit: 1

                        }
                    ],
                    categoryAxis: {
                        categories: [
                            moment($scope.item.obj2[1901300393]).format('HH:mm'),moment($scope.item.obj2[1901300394]).format('HH:mm'),moment($scope.item.obj2[1901300395]).format('HH:mm'),moment($scope.item.obj2[1901300396]).format('HH:mm'),moment($scope.item.obj2[1901300397]).format('HH:mm'),
                            moment($scope.item.obj2[1901300398]).format('HH:mm'),moment($scope.item.obj2[1901300399]).format('HH:mm'),moment($scope.item.obj2[1901300400]).format('HH:mm'),moment($scope.item.obj2[1901300401]).format('HH:mm')
                        ],
                        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                        axisCrossingValues: [0, 35]
                    }
                });
            }

            function LoadCacheHelper() {
                ;
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
                    $scope.cc.objectdepartemenfk = chacePeriode[23]
                    if ($scope.cc.objectdepartemenfk == 18 || $scope.cc.objectdepartemenfk == 79) {
                        $scope.isRanap = false;
                    }
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                    $scope.item.obj = []
                    // $scope.item.doktermenerangkan = $scope.item.obj[5822].namalengkap
                    // $scope.item.obj[369] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                    // $scope.item.obj[682] = { id: pegawai.id, namalengkap: pegawai.namaLengkap }

                    // medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + $scope.cc.norec_pd, true).then(function (dat) { 
                    //     var dataRiwayat = dat.data.data_riwayat
                    //     $scope.isRouteLoading = false;
                    //     for (var i = 0; i < dataRiwayat.length; i++) {
                    //         dataRiwayat[i].no = i + 1
                    //     }
                    //     $scope.dataDaftar = new kendo.data.DataSource({
                    //         data: dataRiwayat,
                    //         total: dataRiwayat,
                    //     });
                    // });
                    init()
                    // cekanestesirajal()
                    initgrafik()
                    // init2()
                    // init3()
                    $scope.visible = true
                    $scope.myVar = 2
                    GridColumnLoad();
                    GridColumnLoad2();
                    // FormLoad()
                }
                if ($scope.isRanap == false) {
                    medifirstService.get('emr/get-value-from-pengkajian-awal-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                        if (dat.data.length > 0) {
                            for (let i = 0; i < dat.data.length; i++) {
                                if (dat.data[i].emrdfk == 1175) {
                                    $scope.item.obj[370] = dat.data[i].value
                                }
                                if (dat.data[i].emrdfk == 1174) {
                                    $scope.item.obj[371] = dat.data[i].value
                                }
                                if (dat.data[i].emrdfk == 1169) {
                                    $scope.item.obj[384] = dat.data[i].value
                                }
                                if (dat.data[i].emrdfk == 1170) {
                                    $scope.item.obj[385] = dat.data[i].value
                                }
                                if (dat.data[i].emrdfk == 1172) {
                                    $scope.item.obj[387] = dat.data[i].value
                                }
                                if (dat.data[i].emrdfk == 1173) {
                                    $scope.item.obj[386] = dat.data[i].value
                                }
                            }
                        }
                    })
                }
            }
            function cekanestesirajal() {
                medifirstService.get('emr/get-anestesi-rajal?nocm=' + $scope.cc.nocm).then(function(dat) {
                    // let tampungo = $scope.data.names[0].o + "\n";
                    let pengkajianmedis = dat.data
                    var chekedd = false
                    if (pengkajianmedis.length > 0) {
                        
                         
                        for (let i = 0; i < pengkajianmedis.length; i++) {
                            if (pengkajianmedis[i].emrdfk == 2263) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5827] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2264) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5828] = chekedd
                            }

                            if (pengkajianmedis[i].emrdfk == 2268) {
                                $scope.item.obj[5829] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 2269) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5830] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2270) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5831] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2271) {
                                $scope.item.obj[5832] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 2275) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5833] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2276) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5834] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2277) {
                                $scope.item.obj[5835] = pengkajianmedis[i].value
                            }
                            
                            if (pengkajianmedis[i].emrdfk == 2281) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5836] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 2282) {
                                chekedd = false
                                if (pengkajianmedis[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[5837] = chekedd
                            }
                            if (pengkajianmedis[i].emrdfk == 379) {
                                $scope.item.obj[2265] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 3114) {
                                var str = pengkajianmedis[i].value
                                var res = str.split("~");
                                $scope.item.obj[5839] = str
                                // $scope.item.obj[5839] = { id: 1, yatidak: "Compos Mentis" }
                            }
                            if (pengkajianmedis[i].emrdfk == 383) {
                                $scope.item.obj[5417] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 384) {
                                $scope.item.obj[5418] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 385) {
                                $scope.item.obj[5419] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 386) {
                                $scope.item.obj[5420] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 387) {
                                $scope.item.obj[5421] = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 388) {
                                $scope.item.obj[5422] = pengkajianmedis[i].value
                            }
                            
                            
                            // if (pengkajianmedis[i].emrdfk == 373) {
                            //     $scope.item.obj[5410] = pengkajianmedis[i].value
                            //     if (dataLoad[i].value == '1') {
                            //         chekedd = true
                            //         debugger
                            //     }
                            // }
                            // if (pengkajianmedis[i].emrdfk == 373) {
                            //     chekedd = false
                            //     debugger
                            //     if (pengkajianmedis[i].value == '1') {
                            //         $scope.item.obj[5410] = true
                            //         debugger
                            //     }
                            // }
                            // if (pengkajianmedis[i].emrdfk == 116065) {
                            //     $scope.item.obj[5406] = pengkajianmedis[i].value
                            // }
                            if (pengkajianmedis[i].emrdfk == 116066) {
                                var str = pengkajianmedis[i].value
                                var res = str.split("~");
                                keadaanumum = res[1]
                            }
                        
                    }
                    }
                })
            }
            
            function init() {
                
                $scope.isRouteLoading = true

                medifirstService.get("emr/get-riwayat-anestesi?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                $scope.isRouteLoading = false;   
                // debugger                     
                let data = dat.data.data
                let data2 = dat.data.data2
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                for(let i = 0; i < data2.length; i++) {
                    data2[i].no = i + 1;
                }
                $scope.dataRiwayatAnestesi = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
                $scope.dataRiwayatGrafik = new kendo.data.DataSource({
                    data: data2,
                    schema: {
                        model: {
                        }
                    },
                    pageSize: 10,
                    total: data2.length,
                    serverPaging: false,
                   
                });  
            })

                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporananestesiranap", true).then(function (dat) {
                    // debugger
                    $scope.isRouteLoading = false
                    // debugger
                    if (dat.data.data.length > 0) {
                        $scope.noemr = dat.data.data[0].noemr
                        $scope.cc.norec_emr = dat.data.data[0].noemr
                        var nomorEMRSS = ''
                        cacheHelper.set('cacheEmrIgd', undefined)
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '2023'

                        //ambil qrcode
                        medifirstService.get("report/cetak-ttd-anestesi?emrpasienfk=" + nomorEMRSS).then(function (dat) {
                            var imageUrl = dat.data.imageUrl;           
                            $("#qrcode").attr('src', imageUrl);
                        })
                        //end ambil qrcode

                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        $scope.cc.norec_emr = '-'
                    }
                });
    

                $scope.EditLihat = function () {
                    if ($scope.dataSelectedRiwayatAnestesi == undefined) {
                        alert("Pilih Riwayat Anestesi Yang Mau di Edit / Lihat !!")
                        return;
                    }
                    $scope.isRouteLoading = true
                    noemr = '&noemr=' + $scope.dataSelectedRiwayatAnestesi.noemr
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporananestesiranap" + noemr, true).then(function(dat) {
                        // debugger
                        $scope.isRouteLoading = false
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 2023;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    })
                }
                $scope.EditLihatGrafik = function () {
                    if ($scope.dataSelectedRiwayatGrafik == undefined) {
                        alert("Pilih Riwayat Grafik Anestesi Yang Mau di Edit / Lihat !!")
                        return;
                    }
                    $scope.isRouteLoading = true
                    noemr = '&noemr=' + $scope.dataSelectedRiwayatGrafik.noemr
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatangrafiktandavital" + noemr, true).then(function(dat) {
                        // debugger
                        $scope.isRouteLoading = false
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 188;
                            setobjectToModelGrafik(nomorEMRSS, $scope.cc.emrfk)                            
                    })
                }
                
                function setobjectToModel(nomorEMRSS, emrfk) {
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                        $scope.isLoading = false
                        var chekedd = false
                        $scope.item.obj = []
                        $scope.item.obj2 = []
                        // $scope.item.obj[68] = $scope.now
                        dataLoad = dat.data.data
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                if (dataLoad[i].type == "textbox") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "textarea") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "checkbox") {
                                    chekedd = false
                                    if (dataLoad[i].value == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                }

                                // if (dataLoad[i].type == "datetime") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                // }

                                if (dataLoad[i].emrdfk == "5406") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                                }
                                if (dataLoad[i].emrdfk == "5591") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                                }
                                if (dataLoad[i].emrdfk == "5650") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                                }
                                // if (dataLoad[i].emrdfk == "5650") {
                                //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                // }
                                if (dataLoad[i].emrdfk == "5672") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].emrdfk == "5673") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].emrdfk == "5674") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5402") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5403") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5404") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5405") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5410") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5411") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                              
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5446") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], sedasi: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5821") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5447") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], anestesi: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5448") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], anestesiregional: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5413") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], value: str }
                                }
                                if (dataLoad[i].type == "datetime") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5839") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5937") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5938") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5933") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5822") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }  
                                    $scope.item.doktermenerangkan = $scope.item.obj[5822].namalengkap
                                    
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6163") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                                if (dataLoad[i].emrdfk == "5605") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5613") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5617") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5621") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5625") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5628") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5631") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5634") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5637") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "5609") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5675") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                
                                if (dataLoad[i].emrdfk == "5471") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                    // $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                                }    
                                if (dataLoad[i].emrdfk == "5475") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5479") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5483") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5487") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5491") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5495") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5499") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5503") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5507") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5511") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5514") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5517") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5520") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5523") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5526") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5529") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5532") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5535") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                if (dataLoad[i].emrdfk == "5538") {
                                    $scope.item.obj[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }    
                                
                            }
                            
                        }
                    })                
                    
                    // cekanestesirajal();    
                }
            }

            function initgrafik (){               
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatangrafiktandavital", true).then(function (dat) {
                    $scope.isRouteLoading = false                   
                    // if($scope.item.buatbarugrafik == false){                    
                    if (dat.data.data.length > 0) {
                        if($scope.item.buatbarugrafik == true){
                        $scope.noemrgrafik = '-'
                    } else {
                        $scope.noemrgrafik = dat.data.data[0].noemr
                    }
                        medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + $scope.noemrgrafik + "&emrfk=" + 188, true).then(function (dat) {
                            $scope.isLoading = false
                            // $scope.item.obj = []
                            $scope.item.obj2 = []
                            dataLoad = dat.data.data
                            for (var i = 0; i <= dataLoad.length - 1; i++) {
                                if (dataLoad[i].type == "textbox") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "date") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "time") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = dataLoad[i].value
                                    // $scope.item.obj2[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                                }
                                if (dataLoad[i].emrdfk == "1901300393") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300394") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300395") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300396") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300397") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300398") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300399") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300400") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300401") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300402") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300403") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300404") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300405") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300406") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300407") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300408") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300409") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300410") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                            }
                            var arrobj = Object.keys($scope.item.obj2)
                            if($scope.item.buatbarugrafik == false){
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let z = 0; z < 9; z++) {
                                    if (arrobj[i] == 1901300193 + z)
                                        sesiesSuhu[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let y = 0; y < 9; y++) {
                                    if (arrobj[i] == 1901300168 + y)
                                        seriesNadi[y] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let w = 0; w < 9; w++) {
                                    if (arrobj[i] == 1901300218 + w)
                                        seriesSistole[w] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let v = 0; v < 9; v++) {
                                    if (arrobj[i] == 1901300243 + v)
                                        seriesDistole[v] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let q = 0; q < 9; q++) {
                                    if (arrobj[i] == 1901300268 + q)
                                        seriesRespirasi[q] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let m = 0; m < 9; m++) {
                                    if (arrobj[i] == 1901300293 + m)
                                        seriesSaturasi[m] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let n = 0; n < 9; n++) {
                                    if (arrobj[i] == 1901300318 + n)
                                        seriesO2[n] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let j = 0; j < 9; j++) {
                                    if (arrobj[i] == 1901300343 + j)
                                        seriesN2O[j] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let b = 0; b < 9; b++) {
                                    if (arrobj[i] == 1901300414 + b)
                                        seriesAIR[b] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let t = 0; t < 9; t++) {
                                    if (arrobj[i] == 1901300368 + t)
                                        seriesVolatile[t] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }

                            //grafik2
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let a = 0; a < 9; a++) {
                                    if (arrobj[i] == 1901300202 + a)
                                        sesiesSuhu2[a] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let c = 0; c < 9; c++) {
                                    if (arrobj[i] == 1901300177 + c)
                                        seriesNadi2[c] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let d = 0; d < 9; d++) {
                                    if (arrobj[i] == 1901300227 + d)
                                        seriesSistole2[d] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let e = 0; e < 9; e++) {
                                    if (arrobj[i] == 1901300252 + e)
                                        seriesDistole2[e] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let f = 0; f < 9; f++) {
                                    if (arrobj[i] == 1901300277 + f)
                                        seriesRespirasi2[f] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let g = 0; g < 9; g++) {
                                    if (arrobj[i] == 1901300302 + g)
                                        seriesSaturasi2[g] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let h = 0; h < 9; h++) {
                                    if (arrobj[i] == 1901300327 + h)
                                        seriesO22[h] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                        }
                            // for (var i = arrobj.length - 1; i >= 0; i--) {
                            //     for (let j = 0; j < 10; j++) {
                            //         if (arrobj[i] == 1901300343 + j)
                            //             seriesN2O[j] = $scope.item.obj2[parseFloat(arrobj[i])]
                            //     }
                            // }
                            // for (var i = arrobj.length - 1; i >= 0; i--) {
                            //     for (let b = 0; b < 10; b++) {
                            //         if (arrobj[i] == 1901300414 + b)
                            //             seriesAIR[b] = $scope.item.obj2[parseFloat(arrobj[i])]
                            //     }
                            // }
                            // for (var i = arrobj.length - 1; i >= 0; i--) {
                            //     for (let t = 0; t < 10; t++) {
                            //         if (arrobj[i] == 1901300368 + t)
                            //             seriesVolatile[t] = $scope.item.obj2[parseFloat(arrobj[i])]
                            //     }
                            // }
                            

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < sesiesSuhu.length; x++) {
                                    sesiesSuhu[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < sesiesSuhu.length; x++) {
                                    if (!isNaN(parseFloat(sesiesSuhu[x]))) {
                                        sesiesSuhu[x] = parseFloat(sesiesSuhu[x]);
                                    }
                                    else {
                                        sesiesSuhu[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesNadi.length; x++) {
                                    seriesNadi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesNadi.length; x++) {
                                    if (!isNaN(parseFloat(seriesNadi[x]))) {
                                        seriesNadi[x] = parseFloat(seriesNadi[x]);
                                    }
                                    else {
                                        seriesNadi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesSistole.length; x++) {
                                    seriesSistole[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesSistole.length; x++) {
                                    if (!isNaN(parseFloat(seriesSistole[x]))) {
                                        seriesSistole[x] = parseFloat(seriesSistole[x]);
                                    }
                                    else {
                                        seriesSistole[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesDistole.length; x++) {
                                    seriesDistole[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesDistole.length; x++) {
                                    if (!isNaN(parseFloat(seriesDistole[x]))) {
                                        seriesDistole[x] = parseFloat(seriesDistole[x]);
                                    }
                                    else {
                                        seriesDistole[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesRespirasi.length; x++) {
                                    seriesRespirasi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesRespirasi.length; x++) {
                                    if (!isNaN(parseFloat(seriesRespirasi[x]))) {
                                        seriesRespirasi[x] = parseFloat(seriesRespirasi[x]);
                                    }
                                    else {
                                        seriesRespirasi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesSaturasi.length; x++) {
                                    seriesSaturasi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesSaturasi.length; x++) {
                                    if (!isNaN(parseFloat(seriesSaturasi[x]))) {
                                        seriesSaturasi[x] = parseFloat(seriesSaturasi[x]);
                                    }
                                    else {
                                        seriesSaturasi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesO2.length; x++) {
                                    seriesO2[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesO2.length; x++) {
                                    if (!isNaN(parseFloat(seriesO2[x]))) {
                                        seriesO2[x] = parseFloat(seriesO2[x]);
                                    }
                                    else {
                                        seriesO2[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesN2O.length; x++) {
                                    seriesN2O[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesN2O.length; x++) {
                                    if (!isNaN(parseFloat(seriesN2O[x]))) {
                                        seriesN2O[x] = parseFloat(seriesN2O[x]);
                                    }
                                    else {
                                        seriesN2O[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesAIR.length; x++) {
                                    seriesAIR[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesAIR.length; x++) {
                                    if (!isNaN(parseFloat(seriesAIR[x]))) {
                                        seriesAIR[x] = parseFloat(seriesAIR[x]);
                                    }
                                    else {
                                        seriesAIR[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesVolatile.length; x++) {
                                    seriesVolatile[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesVolatile.length; x++) {
                                    if (!isNaN(parseFloat(seriesVolatile[x]))) {
                                        seriesVolatile[x] = parseFloat(seriesVolatile[x]);
                                    }
                                    else {
                                        seriesVolatile[x] = 0;
                                    }
                                }
                            }
                            
                            // for (let x = 0; x < seriesNadi.length; x++) {
                            //     if (!isNaN(parseInt(seriesNadi[x])))
                            //         seriesNadi[x] = parseInt(seriesNadi[x])
                            //     else
                            //         seriesNadi[x] = 0
                            // }
                            // for (let x = 0; x < seriesSistole.length; x++) {
                            //     if (!isNaN(parseInt(seriesSistole[x])))
                            //         seriesSistole[x] = parseInt(seriesSistole[x])
                            //     else
                            //         seriesSistole[x] = 0
                            // }
                            // for (let x = 0; x < seriesDistole.length; x++) {
                            //     if (!isNaN(parseInt(seriesDistole[x])))
                            //         seriesDistole[x] = parseInt(seriesDistole[x])
                            //     else
                            //         seriesDistole[x] = 0
                            // }
                            // for (let x = 0; x < seriesRespirasi.length; x++) {
                            //     if (!isNaN(parseInt(seriesRespirasi[x])))
                            //         seriesRespirasi[x] = parseInt(seriesRespirasi[x])
                            //     else
                            //         seriesRespirasi[x] = 0
                            // }
                            // for (let x = 0; x < seriesSaturasi.length; x++) {
                            //     if (!isNaN(parseInt(seriesSaturasi[x])))
                            //         seriesSaturasi[x] = parseInt(seriesSaturasi[x])
                            //     else
                            //         seriesSaturasi[x] = 0
                            // }
                            // for (let x = 0; x < seriesO2.length; x++) {
                            //     if (!isNaN(parseInt(seriesO2[x])))
                            //         seriesO2[x] = parseInt(seriesO2[x])
                            //     else
                            //         seriesO2[x] = 0
                            // }
                            // for (let x = 0; x < seriesN2O.length; x++) {
                            //     if (!isNaN(parseInt(seriesN2O[x])))
                            //         seriesN2O[x] = parseInt(seriesN2O[x])
                            //     else
                            //         seriesN2O[x] = 0
                            // }
                            // for (let x = 0; x < seriesAIR.length; x++) {
                            //     if (!isNaN(parseInt(seriesAIR[x])))
                            //     seriesAIR[x] = parseInt(seriesAIR[x])
                            //     else
                            //         seriesAIR[x] = 0
                            // }
                            // for (let x = 0; x < seriesVolatile.length; x++) {
                            //     if (!isNaN(parseInt(seriesVolatile[x])))
                            //         seriesVolatile[x] = parseInt(seriesVolatile[x])
                            //     else
                            //         seriesVolatile[x] = 0
                            // }

                            //grafik2
                            for (let x = 0; x < sesiesSuhu2.length; x++) {
                                if (!isNaN(parseFloat(sesiesSuhu2[x])))
                                sesiesSuhu2[x] = parseFloat(sesiesSuhu2[x])
                                else
                                sesiesSuhu2[x] = 0
                            }
                            for (let x = 0; x < seriesNadi2.length; x++) {
                                if (!isNaN(parseInt(seriesNadi2[x])))
                                seriesNadi2[x] = parseInt(seriesNadi2[x])
                                else
                                seriesNadi2[x] = 0
                            }
                            for (let x = 0; x < seriesSistole2.length; x++) {
                                if (!isNaN(parseInt(seriesSistole2[x])))
                                seriesSistole2[x] = parseInt(seriesSistole2[x])
                                else
                                seriesSistole2[x] = 0
                            }
                            for (let x = 0; x < seriesDistole2.length; x++) {
                                if (!isNaN(parseInt(seriesDistole2[x])))
                                seriesDistole2[x] = parseInt(seriesDistole2[x])
                                else
                                seriesDistole2[x] = 0
                            }
                            for (let x = 0; x < seriesRespirasi2.length; x++) {
                                if (!isNaN(parseInt(seriesRespirasi2[x])))
                                seriesRespirasi2[x] = parseInt(seriesRespirasi2[x])
                                else
                                seriesRespirasi2[x] = 0
                            }
                            for (let x = 0; x < seriesSaturasi2.length; x++) {
                                if (!isNaN(parseInt(seriesSaturasi2[x])))
                                seriesSaturasi2[x] = parseInt(seriesSaturasi2[x])
                                else
                                seriesSaturasi2[x] = 0
                            }
                            for (let x = 0; x < seriesO22.length; x++) {
                                if (!isNaN(parseInt(seriesO22[x])))
                                seriesO22[x] = parseInt(seriesO22[x])
                                else
                                seriesO22[x] = 0
                            }
                            loadChart()
                            // console.log(seriesNadi)
                            // console.log(sesiesSuhu)
                        })
                        }         
                    // }            
                })                   
            }

            // function FormLoad() {
            //     $scope.isRouteLoading = false;
            //     LoadCacheHelper()
            //     medifirstService.get("emr/get-data-combo-emr", true).then(function (dat) {
            //         var dataCombo = dat.data.vitalsigns
            //         for (var i = 0; i < dataCombo.length; i++) {
            //             if (dataCombo[i].id == 1) {
            //                 dataCombo[i].simbol = "⮟";
            //             } else if (dataCombo[i].id == 2) {
            //                 dataCombo[i].simbol = "⮝";
            //             } else if (dataCombo[i].id == 3) {
            //                 dataCombo[i].simbol = "●";
            //             } else if (dataCombo[i].id == 4) {
            //                 dataCombo[i].simbol = "▲";
            //             }
            //         }
            //         $scope.listVitalSigns = dataCombo;
            //     });

            //     medifirstService.get("emr/get-data-keterangan-pengkajianicu", true).then(function (dat) {
            //         var data_gcs = dat.data.gcs;
            //         var data_infus = dat.data.infus;
            //         var data_jenisvent = dat.data.jenisvent;
            //         for (var i = 0; i < data_gcs.length; i++) {
            //             data_gcs[i].no = i + 1
            //         }
            //         for (var i = 0; i < data_jenisvent.length; i++) {
            //             data_jenisvent[i].no = i + 1
            //         }
            //         for (var i = 0; i < data_jenisvent.length; i++) {
            //             data_jenisvent[i].no = i + 1
            //         }

            //         $scope.GridPasien = new kendo.data.DataSource({
            //             data: data_gcs,
            //             group: $scope.groups,
            //             pageSize: 15,
            //             total: data_gcs.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                     }
            //                 }
            //             }
            //         });

            //         $scope.dataInfus = new kendo.data.DataSource({
            //             data: data_infus,
            //             pageSize: 50,
            //             total: data_infus.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                     }
            //                 }
            //             }
            //         });

            //         $scope.dataJenisVent = new kendo.data.DataSource({
            //             data: data_jenisvent,
            //             pageSize: 50,
            //             total: data_jenisvent.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                     }
            //                 }
            //             }
            //         });
            //     });
            // }
            // $scope.columnDaftar = {
            //     // toolbar: [{
            //     //     name: "create", text: "Input Baru",
            //     //     template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Konsul</button>'
            //     // },],
            //     pageable: true,
            //     scrollable: true,
            //     columns: [
            //         // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
            //         { field: "no", title: "No", width: 40 },
            //         { field: "tglemr", title: "Tanggal", width: 120 },
            //         { field: "namaruangan", title: "Ruangan", width: 120 },
            //         { field: "namalengkap", title: "Dokter", width: 120 },
            //         // { field: "", title: "Keterangan", width: 120 },
            //         // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 120 }
            //     ],
            // };
            // $scope.create = function () {
            //     $scope.visible =true
            //     $scope.myVar = 2
            //     GridColumnLoad();
            // }
            // function init2() {
            //     datana = [
            //         {
            //             'group': '1. SUHU', 'desc': '33', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '34', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '35', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '36', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '37', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '38', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '39', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '41', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '42', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '43', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         // {
            //         //     'group': 'SUHU', 'desc': '170', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '150', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '130', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '110', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '90', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '70', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '50', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '30', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '10', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': 'SUHU', 'desc': '0', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         {
            //             'group': '2. TENSI', 'desc': '6', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },

            //         {
            //             'group': '2. TENSI', 'desc': '12', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '18', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '24', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '30', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '36', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '42', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '48', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '54', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '66', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '180', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '200', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '220', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '180', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '200', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '220', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'MAKAN MINUM', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'N.G.T', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'OBAT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'IVFD : 1', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'IVFD : 2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': 'IVFD : 3', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '5. INTAKE', 'desc': '1 Jam/KUMULATIF', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'URINE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'NGT/DARAH +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'BAB/DARAH +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'DRAIN : 1', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'DRAIN :2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'INSENSIBLE LOSS', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '6. OUTPUT', 'desc': 'SHIFT TOTAL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'PH', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'PA CO2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'PA O2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'BE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'H CO3', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'C2 SAT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'K', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'NA/CL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'CREATININE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'BUN/UREUM', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'GLUCOSE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'HB/HT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'LEUCOCYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'ALB/GLOB', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'THROMBOCYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'BIL DIRECT/inputTindakanDokter', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'CA/', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : BD/NA', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : PROT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : RED/ACETON', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : CREATININE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : LEUCO/ERYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'LP : N +-/P +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // },
            //         // {
            //         //     'group': '7. DATA LABORATORIUM', 'desc': 'LP : SEL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //         //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //         //     'c400': '', 'c500': '', 'c600': ''
            //         // }

            //     ];

            //     // GridColumnLoad();
            //     $scope.data1 = new kendo.data.DataSource({
            //         data: datana,
            //         total: datana,
            //         group: { field: "group" },
            //         schema: {
            //             model: {
            //             }
            //         }
            //     });
            // }
            // function init3() {
            //     datana2 = [
            //         {
            //             'group': '1. SUHU', 'desc': '33', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '34', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '35', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '36', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '37', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '38', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '39', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '41', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '42', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '1. SUHU', 'desc': '43', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },

            //         {
            //             'group': '2. TENSI', 'desc': '6', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },

            //         {
            //             'group': '2. TENSI', 'desc': '12', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '18', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '24', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '30', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '36', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '42', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '48', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '54', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '2. TENSI', 'desc': '66', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '180', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '200', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '3. PERNAFASAN', 'desc': '220', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '180', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '200', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },
            //         {
            //             'group': '4. NADI', 'desc': '220', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
            //             'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
            //             'c400': '', 'c500': '', 'c600': ''
            //         },

            //     ];

            //     // GridColumnLoad();
            //     $scope.data2 = new kendo.data.DataSource({
            //         data: datana2,
            //         total: datana2,
            //         group: { field: "group" },
            //         schema: {
            //             model: {
            //             }
            //         }
            //     });
            // }
            function GridColumnLoad2() {
                $scope.group = {
                    field: "group"
                };

                $scope.columnData2 = {
                    selectable: 'cell',
                    pageable: true,
                    dataBound: $scope.onDataBound,
                    columns: [
                        {
                            hidden: true,
                            field: "group",
                            title: "."
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "200px",
                            "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700",
                            "title": "07.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c800",
                            "title": "08.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "09.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24.00 ",
                            "width": "50px"
                        },
                        // {
                        //     "field": "c100",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c200",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c300",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c400",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c500",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c600",
                        //     "title": " ",
                        //     "width": "50px"
                        // }
                    ]
                };
            }

            function GridColumnLoad() {
                $scope.group = {
                    field: "group"
                };

                $scope.columnData1 = {
                    selectable: 'cell',
                    pageable: true,
                    // dataBound: $scope.onDataBound,
                    columns: [
                        {
                            hidden: true,
                            field: "group",
                            title: "."
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "200px",
                            "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700",
                            "title": "07.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c800",
                            "title": "08.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "09.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23.00 ",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24.00 ",
                            "width": "50px"
                        },
                        // {
                        //     "field": "c100",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c200",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c300",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c400",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c500",
                        //     "title": " ",
                        //     "width": "50px"
                        // },
                        // {
                        //     "field": "c600",
                        //     "title": " ",
                        //     "width": "50px"
                        // }
                    ]
                };
            }
            
            // $scope.showDetail = function (data_head, selectedData) {
            //     ;
            //     if (data_head.length > 0) {
            //         var getlastdata = data_head.length - 1
            //         $scope.item.GroupHeader = data_head[getlastdata].group;
            //         $scope.item.Deskripsi = data_head[getlastdata].judulsamping;
            //         $scope.item.JamInput = data_head[getlastdata].judulatas;
            //         for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
            //             for (var j = 0; j < data_head.length; j++) {
            //                 if (data_head[getlastdata].group == "1. SUHU" || data_head[getlastdata].group == "2. TENSI" || data_head[getlastdata].group == "3. PERNAFASAN" || data_head[getlastdata].group == "4. NADI") {
            //                     $scope.SistoleChart = true;
            //                     $scope.NonSistoleChart = false;
            //                     if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
            //                         if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
            //                             var isi = $scope.selectedData[Object.keys($scope.selectedData)[i]].split(" ");
            //                             // var isiCombo = isi[1].split(" ");
            //                             medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {

            //                                 var datas = dat.data.data_riwayat;
            //                                 for (var i = 0; i < datas.length; i++) {
            //                                     if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
            //                                         if (datas[i].objectvitalsigns == 1) {
            //                                             datas[i].simbol = "⮟";
            //                                         } else if (datas[i].objectvitalsigns == 2) {
            //                                             datas[i].simbol = "⮝";
            //                                         } else if (datas[i].objectvitalsigns == 3) {
            //                                             datas[i].simbol = "●";
            //                                         } else if (datas[i].objectvitalsigns == 4) {
            //                                             datas[i].simbol = "▲";
            //                                         }
            //                                         $scope.item.VSigns = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
            //                                     }
            //                                 }
            //                                 $scope.item.Isian = isi[1]
            //                             });
            //                         }
            //                     }
            //                 } else {
            //                     $scope.SistoleChart = false;
            //                     $scope.NonSistoleChart = true;
            //                     if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
            //                         if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
            //                             $scope.item.Isian = $scope.selectedData[Object.keys($scope.selectedData)[i]]
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         $scope.PopUpDetailPeserta.center().open();
            //     } else {
            //         $scope.PopUpDetailPeserta.center().open();
            //     }

            // }
            // $scope.showDetail2 = function (data_head2, selectedData2) {
            //     ;
            //     if (data_head2.length > 0) {
            //         var getdataterakhir = data_head2.length - 1
            //         $scope.item.GroupHeader2 = data_head2[getdataterakhir].group;
            //         $scope.item.Deskripsi2 = data_head2[getdataterakhir].judulsamping;
            //         $scope.item.JamInput2 = data_head2[getdataterakhir].judulatas;
            //         for (var i = 0; i < Object.keys($scope.selectedData2).length; i++) {
            //             for (var j = 0; j < data_head2.length; j++) {
            //                 if (data_head2[getdataterakhir].group == "1. SUHU" || data_head2[getdataterakhir].group == "2. TENSI" || data_head2[getdataterakhir].group == "3. PERNAFASAN" || data_head2[getdataterakhir].group == "4. NADI") {
            //                     $scope.SistoleChart = true;
            //                     $scope.NonSistoleChart = false;
            //                     if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
            //                         if ($scope.selectedData2[Object.keys($scope.selectedData2)[i]] != "") {
            //                             var isi = $scope.selectedData2[Object.keys($scope.selectedData2)[i]].split(" ");
            //                             // var isiCombo = isi[1].split(" ");
            //                             medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {

            //                                 var datas = dat.data.data_riwayat;
            //                                 for (var i = 0; i < datas.length; i++) {
            //                                     if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
            //                                         if (datas[i].objectvitalsigns == 1) {
            //                                             datas[i].simbol = "⮟";
            //                                         } else if (datas[i].objectvitalsigns == 2) {
            //                                             datas[i].simbol = "⮝";
            //                                         } else if (datas[i].objectvitalsigns == 3) {
            //                                             datas[i].simbol = "●";
            //                                         } else if (datas[i].objectvitalsigns == 4) {
            //                                             datas[i].simbol = "▲";
            //                                         }
            //                                         $scope.item.VSigns2 = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
            //                                     }
            //                                 }
            //                                 $scope.item.Isian2 = isi[1]
            //                             });
            //                         }
            //                     }
            //                 } else {
            //                     $scope.SistoleChart = false;
            //                     $scope.NonSistoleChart = true;
            //                     if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
            //                         if ($scope.selectedData2[Object.keys($scope.selectedData2)[i]] != "") {
            //                             $scope.item.Isian2 = $scope.selectedData2[Object.keys($scope.selectedData2)[i]]
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         $scope.PopUpDetailPeserta2.center().open();
            //     } else {
            //         $scope.PopUpDetailPeserta2.center().open();
            //     }

            // }
            // $scope.tambah = function () {
            //     // if (data_head.length == 0) {
            //     //     toastr.warning('Data Belum Terambil, Peringatan!')
            //     //     return;
            //     // }

            //     // if (data_head.length == 0) {
            //     //     toastr.warning('Data Belum Terambil, Peringatan!')
            //     //     return;
            //     // }

            //     // if (data_head[0].group == "1. SUHU" && $scope.item.VSigns == undefined) {
            //     //     toastr.warning('Vital Signs harus diisi, Peringatan!')
            //     //     return;
            //     // }

            //     var vital = null;
            //     if ($scope.item.VSigns != undefined) {
            //         vital = $scope.item.VSigns.id
            //     }
            //     ;
            //     for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
            //         for (var j = 0; j < data_head.length; j++) {
            //             if (data_head[0].group == "1. SUHU" || data_head[0].group == "2. TENSI" || data_head[0].group == "3. PERNAFASAN" || data_head[0].group == "4. NADI") {
            //                 if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
            //                     $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.VSigns.simbol + " " + $scope.item.Isian
            //                     $scope.label = $scope.item.VSigns.simbol + " " + data_head[0].judulsamping
            //                     data_head[0].judulatas = moment($scope.item.JamInput).format('HH:mm')
            //                     var datas = {
            //                         column: data_head[0].judulatas,
            //                         desc: data_head[0].judulsamping,
            //                         group: data_head[0].group,
            //                         field: data_head[0].field,
            //                         keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
            //                         vitalsigns: vital
            //                     }
            //                     data_Save.push(datas);
            //                     var isis = {
            //                         jenisintra: data_head[0].group,
            //                         labelintra: $scope.item.VSigns.simbol + " " + data_head[0].judulsamping,
            //                         nilaiintra: data_head[0].judulsamping,
            //                         tanggalintra: data_head[0].judulatas,
            //                         jenispasca: " ",
            //                         labelpasca: " ",
            //                         nilaipasca: "",
            //                         tanggalpasca: " ",
            //                     }
            //                     data_Intra.push(isis);
            //                 }
            //             } else {
            //                 if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
            //                     $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.Isian
            //                     var datas = {
            //                         column: data_head[0].judulatas,
            //                         desc: data_head[0].judulsamping,
            //                         group: data_head[0].group,
            //                         field: data_head[0].field,
            //                         keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
            //                         vitalsigns: vital,
            //                         label: $scope.label
            //                     }
            //                     data_Save.push(datas);
            //                 }
            //             }
            //         }
            //     }
            //     kosongkeun()
            //     $scope.PopUpDetailPeserta.close();
            // }
            // $scope.tambah2 = function () {
            //     if (data_head2.length == 0) {
            //         toastr.warning('Data Belum Terambil, Peringatan!')
            //         return;
            //     }

            //     if (data_head2.length == 0) {
            //         toastr.warning('Data Belum Terambil, Peringatan!')
            //         return;
            //     }

            //     if (data_head2[0].group == "1. SUHU" && $scope.item.VSigns2 == undefined) {
            //         toastr.warning('Vital Signs harus diisi, Peringatan!')
            //         return;
            //     }

            //     var vital = null;
            //     if ($scope.item.VSigns2 != undefined) {
            //         vital = $scope.item.VSigns2.id
            //     }
            //     ;
            //     for (var i = 0; i < Object.keys($scope.selectedData2).length; i++) {
            //         for (var j = 0; j < data_head2.length; j++) {
            //             if (data_head2[0].group == "1. SUHU" || data_head2[0].group == "2. TENSI" || data_head2[0].group == "3. PERNAFASAN" || data_head2[0].group == "4. NADI") {
            //                 if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
            //                     $scope.selectedData2[Object.keys($scope.selectedData2)[i]] = $scope.item.VSigns2.simbol + " " + $scope.item.Isian2
            //                     $scope.label2 = $scope.item.VSigns2.simbol + " " + data_head2[0].judulsamping
            //                     data_head2[0].judulatas = moment($scope.item.JamInput2).format('HH:mm')
            //                     var datas = {
            //                         column: data_head2[0].judulatas,
            //                         desc: data_head2[0].judulsamping,
            //                         group: data_head2[0].group,
            //                         field: data_head2[0].field,
            //                         keteranganobservasi: $scope.selectedData2[Object.keys($scope.selectedData2)[i]],
            //                         vitalsigns: vital
            //                     }
            //                     data_Save2.push(datas);
            //                     var isis = {
            //                         jenisintra: " ",
            //                         labelintra: " ",
            //                         nilaiintra: "",
            //                         tanggalintra: " ",
            //                         jenispasca: data_head2[0].group,
            //                         labelpasca: $scope.item.VSigns2.simbol + " " + data_head2[0].judulsamping,
            //                         nilaipasca: data_head2[0].judulsamping,
            //                         tanggalpasca: data_head2[0].judulatas,
            //                     }
            //                     data_Pasca.push(isis);
            //                 }
            //             } else {
            //                 if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
            //                     $scope.selectedData2[Object.keys($scope.selectedData2)[i]] = $scope.item.Isian2
            //                     var datas = {
            //                         column: data_head2[0].judulatas,
            //                         desc: data_head2[0].judulsamping,
            //                         group: data_head2[0].group,
            //                         field: data_head2[0].field,
            //                         keteranganobservasi: $scope.selectedData2[Object.keys($scope.selectedData2)[i]],
            //                         vitalsigns: vital,
            //                     }
            //                     data_Save2.push(datas);
            //                 }
            //             }
            //         }
            //     }
            //     kosongkeun2()
            //     $scope.PopUpDetailPeserta2.close();
            // }

            $scope.batal2 = function () {
                kosongkeun2()
                $scope.PopUpDetailPeserta2.close();
            }

            function kosongkeun() {
                $scope.selectedData = undefined;
                data_head = [];
                $scope.item.Isian = undefined;
                $scope.item.VSigns = undefined;
            }
            function kosongkeun2() {
                $scope.selectedData2 = undefined;
                data_head2 = [];
                $scope.item.Isian2 = undefined;
                $scope.item.VSigns2 = undefined;
            }
           
          
            
            
            $scope.Simpan = function () {
                ;
                if (data_Save.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                var objSave = {
                    norec: norec_Emr,
                    norec_apd: norec_apd,
                    noregistrasi: $scope.cc.noregistrasi,
                    tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                    details: data_Save,//$scope.data1._data
                    intra: data_Intra,
                    jenisemr: "intra"
                }
                console.log(objSave);
                medifirstService.post('emr/save-data-emr-intra-anestesi', objSave).then(function (e) {
                    // init();
                    // $scope.BatalOrder();
                    // managePhp.postLogging('Simpan EMR ICU', 'Norec strukorder_t',e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                    // })
                    LoadCacheHelper();
                    getRmi();
                    $scope.myVar = 1;
                })
            }
            $scope.Simpan2 = function () {
                ;
                if (data_Save2.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                var objSave = {
                    norec: norec_Emr2,
                    norec_apd: norec_apd,
                    noregistrasi: $scope.cc.noregistrasi,
                    tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                    details: data_Save2,//$scope.data1._data
                    jenisemr: "pasca",
                    pasca: data_Pasca
                }
                // console.log(objSave);
                medifirstService.post('emr/save-data-emr-pasca-anestesi', objSave).then(function (e) {
                    // init();
                    // $scope.BatalOrder();
                    // managePhp.postLogging('Simpan EMR ICU', 'Norec strukorder_t',e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                    // })
                    LoadCacheHelper();
                    getRmi2();
                    $scope.myVar = 1;
                })
            }
            $scope.Save = function () {                
                // debugger
                var arrobj = Object.keys($scope.item.obj) 
                var arrSave = [] 
                 for (let i = arrobj.length - 1; i >= 0; i--) {
                if (arrobj[i] == 5402 || arrobj[i] == 5403 || arrobj[i] == 5404 || arrobj[i] == 5405) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].namalengkap })                
                } else if (arrobj[i] == 5410 || arrobj[i] == 5411 ){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].adatidak }) 
                } else if (arrobj[i] == 5446){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].sedasi }) 
                } else if (arrobj[i] == 5447){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].anestesi }) 
                } else if (arrobj[i] == 5448){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].anestesiregional }) 
                } else if (arrobj[i] == 5413){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].value }) 
                } else if (arrobj[i] == 5821){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].namalengkap }) 
                } else if (arrobj[i] == 5822){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].namalengkap }) 
                } else if (arrobj[i] == 5839){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].text }) 
                } else if (arrobj[i] == 5937){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].text }) 
                } else if (arrobj[i] == 5938){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].text }) 
                } else if (arrobj[i] == 5933){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].text }) 
                } else if(arrobj[i] == 5406){
                    arrSave.push({ id: arrobj[i], values: (moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')) })
                } else if(arrobj[i] == 5591){
                    arrSave.push({ id: arrobj[i], values: (moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')) })
                } else if(arrobj[i] == 5650){
                    arrSave.push({ id: arrobj[i], values: (moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')) })
                } else if(arrobj[i] == 6163){
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])].text }) 
                }
                else {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])] })
                    }
                }

                // debugger
                if (totalcost7.value != "") {
                    arrSave.push ({ id: "5660", values: totalcost7.value})
                }
                if (totalcost8.value != "") {
                    arrSave.push ({ id: "5661", values: totalcost8.value})
                }
                if (totalcost9.value != "") {
                    arrSave.push ({ id: "5662", values: totalcost9.value})
                }``
                if (totalcost10.value != "") {
                    arrSave.push ({ id: "5663", values: totalcost10.value})
                }
                if (totalcost11.value != "") {
                    arrSave.push ({ id: "5664", values: totalcost11.value})
                }
                if (totalcost12.value != "") {
                    arrSave.push ({ id: "5665", values: totalcost12.value})
                }
                if (totalcost13.value != "") {
                    arrSave.push ({ id: "5666", values: totalcost13.value})
                }
                if (totalcost14.value != "") {
                    arrSave.push ({ id: "5667", values: totalcost14.value})
                }
                if (totalcost15.value != "") {
                    arrSave.push ({ id: "5668", values: totalcost15.value})
                }
                if (totalcost16.value != "") {
                    arrSave.push ({ id: "5669", values: totalcost16.value})
                }
                if (totalcost17.value != "") {
                    arrSave.push ({ id: "5670", values: totalcost17.value})
                }
                if (totalcost18.value != "") {
                    arrSave.push ({ id: "5671", values: totalcost18.value})
                }
                // if(totalcost7[0] != undefined){
                //     if (totalcost7[0].value != "") {
                //         arrSave.push ({ id: "5660", values: totalcost7[0].value})
                //     }
                // }
                // if(totalcost8[0] != undefined){
                //     if (totalcost8[0].value != "") {
                //         arrSave.push ({ id: "5661", values: totalcost8[0].value})
                //     }
                // }
                // if(totalcost9[0] != undefined){
                //     if (totalcost9[0].value != "") {
                //         arrSave.push ({ id: "5662", values: totalcost9[0].value})
                //     }
                // }
                // if(totalcost10[0] != undefined){
                //     if (totalcost10[0].value != "") {
                //         arrSave.push ({ id: "5663", values: totalcost10[0].value})
                //     }
                // }
                // if(totalcost11[0] != undefined){
                //     if (totalcost11[0].value != "") {
                //         arrSave.push ({ id: "5664", values: totalcost11[0].value})
                //     }
                // }
                // if(totalcost12[0] != undefined){
                //     if (totalcost12[0].value != "") {
                //         arrSave.push ({ id: "5665", values: totalcost12[0].value})
                //     }
                // }
                // if(totalcost13[0] != undefined){
                //     if (totalcost13[0].value != "") {
                //         arrSave.push ({ id: "5666", values: totalcost13[0].value})
                //     }
                // }
                // if(totalcost14[0] != undefined){
                //     if (totalcost14[0].value != "") {
                //         arrSave.push ({ id: "5667", values: totalcost14[0].value})
                //     }
                // }
                // if(totalcost15[0] != undefined){
                //     if (totalcost15[0].value != "") {
                //         arrSave.push ({ id: "5668", values: totalcost15[0].value})
                //     }
                // }
                // if(totalcost16[0] != undefined){
                //     if (totalcost16[0].value != "") {
                //         arrSave.push ({ id: "5669", values: totalcost16[0].value})
                //     }
                // }
                // if(totalcost17[0] != undefined){
                //     if (totalcost17[0].value != "") {
                //         arrSave.push ({ id: "5670", values: totalcost17[0].value})
                //     }
                // }
                // if(totalcost18[0] != undefined){
                //     if (totalcost18[0].value != "") {
                //         arrSave.push ({ id: "5671", values: totalcost18[0].value})
                //     }
                // }

                $scope.cc.jenisemr = 'laporananestesiranap'
                debugger
                if($scope.item.buatbaru == true){
                    $scope.cc.norec_emr = '-'
                } 
                // else{
                //     $scope.cc.norec_emr = $scope.noemr
                // }                
                // debugger
                
                $scope.cc.emrfk = 2023
                // debugger
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Laporan Anestesi RI ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        // debugger
                    // $scope.tes(e.data.data.noemr)
                    $scope.SaveGrafik();
                    // $scope.SaveGrafik2(); 
                    setTimeout(function() {
                        init()
                    }, 5000);   
                    // init()
                    initgrafik()
                    setTimeout(function() {
                        $scope.tes(e.data.data.noemr)
                    }, 9000);
                    // $scope.tes(e.data.data.noemr)
                    // debugger
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
                // debugger
                //perpage
                $scope.item.buatbaru = false
                if ($scope.isPertama) {
                    $scope.isPertama = false
                    $scope.isKedua = true
                    $scope.isKetiga = false
                    $scope.isKeempat = false
                } else if ($scope.isKedua) {
                    $scope.isKedua = false
                    $scope.isPertama = false
                    $scope.isKetiga = true
                    $scope.isKeempat = false
                } else if ($scope.isKetiga) {
                    $scope.isKedua = false
                    $scope.isPertama = false
                    $scope.isKetiga = false
                    $scope.isKeempat = true
                } else if ($scope.isKeempat) {
                    $scope.isKedua = false
                    $scope.isPertama = false
                    $scope.isKetiga = false
                    $scope.isKeempat = true
                }
            }

            $scope.kembali = function () {
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }
            $scope.tes = function(nokintil){
                var textToRemove = "\n";
                var css = document.getElementById('printing-css').value;

                var cek = document.querySelectorAll("#cetakRm input[type='checkbox']");
                for (let i = 0; i < cek.length; i++) {
                    if (cek[i].checked) {
                        cek[i].setAttribute("checked", "checked");
                    } else {
                        cek[i].removeAttribute("checked", "checked");
                    }
                } 
                var hal1 = document.getElementById('cetakRm').innerHTML;
                var hal1fix = hal1.replace("\n", ""); 

                var cek = document.querySelectorAll("#cetakRm2 input[type='checkbox']");
                for (let i = 0; i < cek.length; i++) {
                    if (cek[i].checked) {
                        cek[i].setAttribute("checked", "checked");
                    } else {
                        cek[i].removeAttribute("checked", "checked");
                    }
                }
                var hal2 = document.getElementById('cetakRm2').innerHTML;
                var hal2fix = hal2.replace(textToRemove, "");

                var cek = document.querySelectorAll("#cetakRm2 input[type='checkbox']");
                for (let i = 0; i < cek.length; i++) {
                    if (cek[i].checked) {
                        cek[i].setAttribute("checked", "checked");
                    } else {
                        cek[i].removeAttribute("checked", "checked");
                    }
                }
                var hal2 = document.getElementById('cetakRm2').innerHTML;
                var hal2fix = hal2.replace(textToRemove, "");

                var cek = document.querySelectorAll("#cetakRm3 input[type='checkbox']");
                for (let i = 0; i < cek.length; i++) {
                    if (cek[i].checked) {
                        cek[i].setAttribute("checked", "checked");
                    } else {
                        cek[i].removeAttribute("checked", "checked");
                    }
                } 
                let cekBromage = document.getElementById('btnCetak3').dataset.bromage;
                let cekAldrete = document.getElementById('btnCetak3').dataset.aldrete;
                let cekSteward = document.getElementById('btnCetak3').dataset.steward;

                var isBromage = document.querySelectorAll("#isBromage");
                var isAldrete = document.querySelectorAll("#isAldrete");
                var isSteward = document.querySelectorAll("#isSteward");

                if (cekBromage == 'true') {
                    for (let i = 0; i < isBromage.length; i++) {
                        isBromage[i].style.display = "inline";
                    } 
                }
                if (cekAldrete == 'true') { 
                    for (let i = 0; i < isAldrete.length; i++) {
                        isAldrete[i].style.display = "inline";
                    } 
                }
                var hal3 = document.getElementById('cetakRm3').innerHTML;
                var hal3fix = hal3.replace(textToRemove, "");

                var cek = document.querySelectorAll("#cetakRm4 input[type='checkbox']");
                for (let i = 0; i < cek.length; i++) {
                    if (cek[i].checked) {
                        cek[i].setAttribute("checked", "checked");
                    } else {
                        cek[i].removeAttribute("checked", "checked");
                    }
                }
                var hal4 = document.getElementById('cetakRm4').innerHTML;
                var hal4fix = hal2.replace(textToRemove, "");

                var all =   hal1 +hal2+hal3+hal4;

                var fixall = all.replace(/\n/g, "");
                var jsonSave = {
                        noemr: nokintil,
                        data: fixall,
                    }
                medifirstService.post('emr/save-emr-heml-anastesi', jsonSave).then(function (e) {
                    })
                // const base64String = btoa(fixall);
                // var blob = new Blob(
                //     // I'm using page innerHTML as data
                //     // note that you can use the array
                //     // to concatenate many long strings EFFICIENTLY
                //     [fixall],
                //     // Mime type is important for data url
                //     { type: 'text/html' }
                // );
                // // This FileReader works asynchronously, so it doesn't lag
                // // the web application
                // var a = new FileReader();
                // a.onload = function (e) {
                //     // Capture result here
                //     debugger;
                //     var base64String = e.target.result;
                //     debugger;
                //     var jsonSave = {
                //         noemr: nokintil,
                //         data: base64String,
                //     }
                //     medifirstService.post('emr/save-emr-heml-anastesi', jsonSave).then(function (e) {
                //     })
                // };
                // a.readAsDataURL(blob);
                
            }
            $scope.cetakPdf = function () {

                if (nomorEMR == '') return
                // if ($scope.cc.objectdepartemenfk == 18) {
                //     // var user = medifirstService.getPegawaiLogin();
                //     // var arrPush = []
                //     // for (var i = 358; i <= 701 - 1; i++) {
                //     //     arrPush.push({ emrdfk: i.toString(), value: "" })
                //     // }
                //     // for (var i = 0; i <= dataLoad.length - 1; i++) {
                //     //     if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                //     //         for (var x = 0; x <= arrPush.length - 1; x++) {
                //     //             if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                //     //                 arrPush[x].value = dataLoad[i].value
                //     //             }
                //     //         }
                //     //     }
                //     // }
                //     // for (var i = 779; i <= 795 - 1; i++) {
                //     //     arrPush.push({ emrdfk: i.toString(), value: "" })
                //     // }
                //     // for (var i = 0; i <= dataLoad.length - 1; i++) {
                //     //     if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                //     //         for (var x = 0; x <= arrPush.length - 1; x++) {
                //     //             if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                //     //                 arrPush[x].value = dataLoad[i].value
                //     //             }
                //     //         }
                //     //     }
                //     // }
                //     // for (let i = 2263; i <= 2318; i++) {
                //     //     arrPush.push({ emrdfk: i.toString(), value: "" })
                //     // }
                //     // for (let i = 0; i <= dataLoad.length - 1; i++) {
                //     //     if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                //     //         for (let x = 0; x <= arrPush.length - 1; x++) {
                //     //             if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                //     //                 arrPush[x].value = dataLoad[i].value
                //     //             }
                //     //         }
                //     //     }
                //     // }
                //     // for (let i = 0; i < arrPush.length; i++) {
                //     //     if (arrPush[i].emrdfk == 2293 && arrPush[i].value == "1") {
                //     //         arrPush[46].value = "Moderat"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2294 && arrPush[i].value == "1") {
                //     //         arrPush[46].value = "Dalam"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2295 && arrPush[i].value == "1") {
                //     //         arrPush[47].value = "LMA"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2296 && arrPush[i].value == "1") {
                //     //         arrPush[47].value = "Intubasi"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2301 && arrPush[i].value == "1") {
                //     //         arrPush[67].value = "WB"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2302 && arrPush[i].value == "1") {
                //     //         arrPush[67].value = "PRC"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2303 && arrPush[i].value == "1") {
                //     //         arrPush[67].value = "Trombocyt"
                //     //     }
                //     //     if (arrPush[i].emrdfk == 2304 && arrPush[i].value == "1") {
                //     //         arrPush[67].value = arrPush[401].value
                //     //     }
                //     // }
                //     debugger
                //     var nama = $scope.cc.namapasien
                //     var nocm = $scope.cc.nocm
                //     var tgllahir = $scope.cc.tglLahir
                //     var jk = $scope.cc.jeniskelamin
                //     var umur = $scope.cc.umur
                //     var ruangan = $scope.cc.namaruangan

                //     var data = {
                //         "gambarLogo": "logodokkes.jpg",
                //         "paramKey": ["printedBy", "dataLoad", "nomorEMR", "noregistrasi", "ruanganfk", "nama", "nocm", "tgllahir", "jeniskelamin", "umur", "ruangan"],
                //         "paramValue": [user.namaLengkap, arrPush, nomorEMR, $scope.cc.noregistrasi, $scope.cc.objectruanganfk, nama, nocm, tgllahir, jk, umur, ruangan],
                //         "paramType": ["", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                //     };
                //     var xhr = new XMLHttpRequest();
                //     xhr.onreadystatechange = function () {
                //         if (this.readyState == 4 && this.status == 200) {
                //             //this.response is what you're looking for
                //             // handler(this.response);
                //             console.log(this.response, typeof this.response);
                //             //var res = this.response
                //             //var file = new Blob( [res], {type: 'application/pdf'});
                //             ;
                //             var url = window.URL.createObjectURL(this.response)
                //             var pdf = document.getElementById('tempatLaporan');
                //             pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                //             var win = window.open(url, '_blank');
                //             win.focus();
                //         }
                //     }
                //     if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                //         xhr.open('POST', 'http://192.168.1.7:8797/generic/report/laporananestesirajal.pdf');
                //     } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //         xhr.open('POST', 'http://192.168.88.56:8797/generic/report/laporananestesirajal.pdf');
                //     } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                //         xhr.open('POST', 'http://10.5.1.2:8797/generic/report/laporananestesirajal.pdf');
                //     } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                //         xhr.open('POST', 'http://202.51.105.98:8797/generic/report/laporananestesirajal.pdf');
                //     } else {
                //         xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporananestesirajal.pdf');
                //     }
                //     // set `Content-Type` header
                //     xhr.setRequestHeader('Content-Type', 'application/json');
                //     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                //     xhr.responseType = 'blob';
                //     // send rquest with JSON payload
                //     xhr.send(JSON.stringify(data));
                // } else {
                    // var base64 = $scope.user.poto.substring(22);
                    var user = medifirstService.getPegawaiLogin();
                    var arrPush = []
                    for (var i = 358; i <= 701 - 1; i++) {
                        arrPush.push({ emrdfk: i.toString(), value: "" })
                    }
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            for (var x = 0; x <= arrPush.length - 1; x++) {
                                if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                    arrPush[x].value = dataLoad[i].value
                                }
                            }
                        }


                    }
                    for (var i = 779; i <= 795 - 1; i++) {
                        arrPush.push({ emrdfk: i.toString(), value: "" })
                    }
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            for (var x = 0; x <= arrPush.length - 1; x++) {
                                if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                    arrPush[x].value = dataLoad[i].value
                                }
                            }
                        }


                    }
                    var nama = $scope.cc.namapasien
                    var nocm = $scope.cc.nocm
                    var tgllahir = $scope.cc.tgllahir
                    var jk = $scope.cc.jeniskelamin
                    var umur = $scope.cc.umur
                    var ruangan = $scope.cc.namaruangan



                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["printedBy", "dataLoad", "nomorEMR", "noregistrasi", "ruanganfk", "nama", "nocm", "tgllahir", "jeniskelamin", "umur", "ruangan"],
                        "paramValue": [user.namaLengkap, arrPush, nomorEMR, $scope.cc.noregistrasi, $scope.cc.objectruanganfk, nama, nocm, tgllahir, jk, umur, ruangan],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});
                            ;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }

                    
                    //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
                    var datauserkelompok = medifirstService.getKelompokUser();


                    if(datauserkelompok == "ppa") {
                            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/laporananestesiranap.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/laporananestesiranap.pdf');
                            } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/laporananestesiranap.pdf');
                            } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/laporananestesiranap.pdf');
                            } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                                xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/laporananestesiranap.pdf');
                            }else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporananestesiranap.pdf');
                            }
                    } else {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/laporananestesiranapSalinan.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/laporananestesiranapSalinan.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/laporananestesiranapSalinan.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/laporananestesiranapSalinan.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/laporananestesiranapSalinan.pdf');
                        }else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporananestesiranapSalinan.pdf');
                        }

                    } 



                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                // }
            }
            //## watch
            // $scope.$watch('item.obj[5839]', function (e) {
            //     if (e.value == 'Ya' || $scope.item.obj[5839].text == 'Ya') {
            //         $scope.yaOperasi = true
            //     } else {
            //         $scope.yaOperasi = false
            //     }
            // })
            $scope.$watch('item.obj[5840]', function (e) {
                if (e == true) {
                    $scope.yaGaRa = true
                    // $scope.item.obj[2284] = false
                } else {
                    $scope.yaGaRa = false
                }
            })
            $scope.$watch('item.obj[5841]', function (e) {
                if (e == true) {
                    $scope.yaGaRa = true
                    // $scope.item.obj[2284] = false
                } else {
                    $scope.yaGaRa = false
                }
            })

            $scope.$watch('item.obj[5828]', function (e) {
                if (e == true) {
                    $scope.item.obj[5827] = false
                    $scope.isYaAsma = true
                } else {
                    $scope.isYaAsma = false
                }
            });
            $scope.$watch('item.obj[5827]', function (e) {
                if (e == true) {
                    $scope.item.obj[5828] = false
                    $scope.isYaAsma = false
                }
            });

            $scope.$watch('item.obj[5831]', function (e) {
                if (e == true) {
                    $scope.item.obj[5830] = false
                    $scope.isdiabetes = true
                } else {
                    $scope.isdiabetes = false
                }
            });
            $scope.$watch('item.obj[5830]', function (e) {
                if (e == true) {
                    $scope.item.obj[5831] = false
                    $scope.isdiabetes = false
                }
            });

            $scope.$watch('item.obj[5834]', function (e) {
                if (e == true) {
                    $scope.item.obj[5833] = false
                    $scope.isalergi = true
                } else {
                    $scope.isalergi = false
                }
            });
            $scope.$watch('item.obj[5833]', function (e) {
                if (e == true) {
                    $scope.item.obj[5834] = false
                    $scope.isalergi = false
                }
            });

            $scope.$watch('item.obj[5837]', function (e) {
                if (e == true) {
                    $scope.item.obj[5836] = false
                    $scope.isriwayatmakan = true
                } else {
                    $scope.isriwayatmakan = false
                }
            });
            $scope.$watch('item.obj[5836]', function (e) {
                if (e == true) {
                    $scope.item.obj[5837] = false
                    $scope.isriwayatmakan = false
                }
            });

            $scope.$watch('item.obj[5928]', function (e) {
                if (e == true) {
                    $scope.item.obj[5927] = false
                    $scope.ishipertenesi = true
                } else {
                    $scope.ishipertenesi = false
                }
            });
            $scope.$watch('item.obj[5927]', function (e) {
                if (e == true) {
                    $scope.item.obj[5928] = false
                    $scope.ishipertenesi = false
                }
            });

            $scope.$watch('item.obj[5930]', function (e) {
                if (e == true) {
                    $scope.item.obj[5929] = false
                    $scope.isjantung = true
                } else {
                    $scope.isjantung = false
                }
            });
            $scope.$watch('item.obj[5929]', function (e) {
                if (e == true) {
                    $scope.item.obj[5930] = false
                    $scope.isjantung = false
                }
            });


            // $scope.$watch('item.obj[5413]', function(e) {
            //     debugger
            //     if (e.id == 1) {   
            //         $scope.isriwayatmakan = true
            //     } else{
            //         $scope.isriwayatmakan = false
            //     }
            // })

            $scope.$watch('item.obj[5743]', function(e) {
                if (e == true) {
                    $scope.isblokade = true;
                } else {
                    $scope.isblokade = false;
                }
            })
            $scope.$watch('item.obj[5744]', function(e) {
                if (e == true) {
                    $scope.issecio = true;
                } else {
                    $scope.issecio = false;
                }
            })
            $scope.$watch('item.obj[5839]', function (e) {
                if (e.text == 'Ya') {
                    $scope.yaOperasi = true
                } else {
                    $scope.yaOperasi = false
                }
 
            })
            $scope.$watch('item.obj[6163]', function (e) {
                if (e.text == 'Ya') {
                    $scope.iskonversi = true
                } else {
                    $scope.iskonversi = false
                }
 
            })
            $scope.$watch('item.obj[5933]', function (e) {
                if (e.text == 'Ya') {
                    $scope.yaGaKompilkasi = true
                } else {
                    $scope.yaGaKompilkasi = false
                }

            })
            $scope.$watch('item.obj[5745]', function(e) {
                if (e == true) {
                    $scope.isbromage = true;
                } else {
                    $scope.isbromage = false;
                }
            })
            $scope.$watch('item.obj[5746]', function(e) {
                if (e == true) {
                    $scope.isaldrete = true;
                } else {
                    $scope.isaldrete = false;
                }
            })
            $scope.$watch('item.obj[5747]', function(e) {
                if (e == true) {
                    $scope.issteward = true;
                } else {
                    $scope.issteward = false;
                }
            })

            //##ISSKOR
            $scope.$watch('item.isskor', function (e) {
                if (e == true) {
                    $scope.isskor = true
                } else {
                    $scope.isskor = false
                }
            });

            $scope.$watch('item.obj[2264]', function (e) {
                if (e == true) {
                    $scope.item.obj[2263] = false
                    $scope.isYaAsma = true
                } else {
                    $scope.isYaAsma = false
                }
            });
            $scope.$watch('item.obj[2263]', function (e) {
                if (e == true) {
                    $scope.item.obj[2264] = false
                    $scope.isYaAsma = false
                }
            });
            $scope.$watch('item.obj[2267]', function (e) {
                if (e == true) {
                    $scope.item.obj[2266] = false
                    $scope.isYaHipertensi = true
                } else {
                    $scope.isYaHipertensi = false
                }
            });
            $scope.$watch('item.obj[2266]', function (e) {
                if (e == true) {
                    $scope.item.obj[2267] = false
                    $scope.isYaHipertensi = false
                }
            });
            $scope.$watch('item.obj[2270]', function (e) {
                if (e == true) {
                    $scope.item.obj[2269] = false
                    $scope.isYaDiabetes = true
                } else {
                    $scope.isYaDiabetes = false
                }
            });
            $scope.$watch('item.obj[2269]', function (e) {
                if (e == true) {
                    $scope.item.obj[2270] = false
                    $scope.isYaDiabetes = false
                }
            });
            $scope.$watch('item.obj[2273]', function (e) {
                if (e == true) {
                    $scope.item.obj[2272] = false
                    $scope.isYaJantung = true
                } else {
                    $scope.isYaJantung = false
                }
            });
            $scope.$watch('item.obj[2272]', function (e) {
                if (e == true) {
                    $scope.item.obj[2273] = false
                    $scope.isYaJantung = false
                }
            });
            $scope.$watch('item.obj[2276]', function (e) {
                if (e == true) {
                    $scope.item.obj[2275] = false
                    $scope.isYaObat = true
                } else {
                    $scope.isYaObat = false
                }
            });
            $scope.$watch('item.obj[2275]', function (e) {
                if (e == true) {
                    $scope.item.obj[2276] = false
                    $scope.isYaObat = false
                }
            });
            $scope.$watch('item.obj[2279]', function (e) {
                if (e == true) {
                    $scope.item.obj[2278] = false
                    $scope.isYaLain = true
                } else {
                    $scope.isYaLain = false
                }
            });
            $scope.$watch('item.obj[2278]', function (e) {
                if (e == true) {
                    $scope.item.obj[2279] = false
                    $scope.isYaLain = false
                }
            });
            $scope.$watch('item.obj[2282]', function (e) {
                if (e == true) {
                    $scope.item.obj[2281] = false
                    $scope.isMakanObat = true
                } else {
                    $scope.isMakanObat = false
                }
            });
            $scope.$watch('item.obj[2281]', function (e) {
                if (e == true) {
                    $scope.item.obj[2282] = false
                    $scope.isMakanObat = false
                }
            });
            // $scope.$watch('item.obj[2284]', function (e) {
            //     if (e == true) {
            //         $scope.item.obj[2283] = false
            //         $scope.isOperasi = true
            //     } else {
            //         $scope.isOperasi = false
            //     }
            // });
            // $scope.$watch('item.obj[2283]', function (e) {
            //     if (e == true) {
            //         $scope.item.obj[2284] = false
            //         $scope.isOperasi = false
            //     }
            // });
            // $scope.$watch('item.obj[3116]', function (e) {
            //     if (e.yatidak == 'Ya') {
            //         $scope.yaKomplikasi = true
            //     } else {
            //         $scope.yaKomplikasi = false
            //     }
            // })
            // $scope.$watch('item.obj[3124]', function (e) {
            //     if (e.text == 'Lain - lain') {
            //         $scope.lainlain = true
            //     } else {
            //         $scope.lainlain = false
            //     }
            // })
            $scope.SaveGrafik = function () {
                // debugger
                $scope.isRouteLoading = true
                $scope.cc.emrfk = 188
                var arrobj = Object.keys($scope.item.obj2)                
                var arrSave = []                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                   
                    // if (arrobj[i] == 1901300393 || arrobj[i] == 1901300394 || arrobj[i] == 1901300395 || arrobj[i] == 1901300396 
                    //     || arrobj[i] == 1901300397 || arrobj[i] == 1901300398 || arrobj[i] == 1901300398 || arrobj[i] == 1901300399 
                    //     || arrobj[i] == 1901300400 || arrobj[i] == 1901300401) {
                    //     // arrSave.push(moment($scope.item.obj2[parseInt(arrobj[i])]).format('HH:mm')) 
                    //     arrSave.push({ id: arrobj[i], values: (moment($scope.item.obj2[parseInt(arrobj[i])]).format('HH:mm')) })
                    // }
                    // else {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj2[parseInt(arrobj[i])] })
                    // }                    
                }           
                // debugger     
                $scope.cc.jenisemr = 'catatangrafiktandavital'
                // debugger
                if($scope.item.buatbargrafik == true){
                    $scope.cc.norec_emr = '-'
                } else{
                    $scope.cc.norec_emr = $scope.noemrgrafik
                } 
                // $scope.cc.norec_emr = $scope.noemrgrafik               
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave,                  
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Grafik Tanda - Tanda Vital ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    var arrobj = Object.keys($scope.item.obj2)

                    for (var i = arrobj.length - 1; i >= 0; i--) {
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300193 + z)
                                sesiesSuhu[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300168 + z)
                                seriesNadi[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300218 + z)
                                seriesSistole[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300243 + z)
                                seriesDistole[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300268 + z)
                                seriesRespirasi[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300293 + z)
                                seriesSaturasi[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300318 + z)
                                seriesO2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300343 + z)
                                seriesN2O[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300343 + z)
                                seriesAIR[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300368 + z)
                                seriesVolatile[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                    }
                    for (let x = 0; x < sesiesSuhu.length; x++) {
                        if (!isNaN(parseFloat(sesiesSuhu[x])))
                            sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                    }
                    for (let x = 0; x < seriesNadi.length; x++) {
                        if (!isNaN(parseInt(seriesNadi[x])))
                            seriesNadi[x] = parseInt(seriesNadi[x])
                    }
                    for (let x = 0; x < seriesSistole.length; x++) {
                        if (!isNaN(parseInt(seriesSistole[x])))
                            seriesSistole[x] = parseInt(seriesSistole[x])
                    }
                    for (let x = 0; x < seriesDistole.length; x++) {
                        if (!isNaN(parseInt(seriesDistole[x])))
                            seriesDistole[x] = parseInt(seriesDistole[x])
                    }
                    for (let x = 0; x < seriesRespirasi.length; x++) {
                        if (!isNaN(parseInt(seriesRespirasi[x])))
                            seriesRespirasi[x] = parseInt(seriesRespirasi[x])
                    }
                    for (let x = 0; x < seriesSaturasi.length; x++) {
                        if (!isNaN(parseInt(seriesSaturasi[x])))
                            seriesSaturasi[x] = parseInt(seriesSaturasi[x])
                    }
                    for (let x = 0; x < seriesO2.length; x++) {
                        if (!isNaN(parseInt(seriesO2[x])))
                            seriesO2[x] = parseInt(seriesO2[x])
                    }
                    for (let x = 0; x < seriesN2O.length; x++) {
                        if (!isNaN(parseInt(seriesN2O[x])))
                            seriesN2O[x] = parseInt(seriesN2O[x])
                    }
                    for (let x = 0; x < seriesAIR.length; x++) {
                        if (!isNaN(parseInt(seriesAIR[x])))
                            seriesAIR[x] = parseInt(seriesAIR[x])
                    }
                    for (let x = 0; x < seriesVolatile.length; x++) {
                        if (!isNaN(parseInt(seriesVolatile[x])))
                            seriesVolatile[x] = parseInt(seriesVolatile[x])
                    }
                    $scope.isRouteLoading = false
                    init()
                    initgrafik()
                    loadChart()
                    
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Grafik Tanda - Tanda Vital' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    // $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
                $scope.item.buatbarugrafik = false
            }
            $scope.SaveGrafik2 = function () {
                // debugger
                $scope.isRouteLoading = true
                $scope.cc.emrfk = 188
                var arrobj = Object.keys($scope.item.obj2)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                   
                    // if (arrobj[i] == 1901300402 || arrobj[i] == 1901300403 || arrobj[i] == 1901300404 || arrobj[i] == 1901300405 
                    //     || arrobj[i] == 1901300406 || arrobj[i] == 1901300407 || arrobj[i] == 1901300408 || arrobj[i] == 1901300409 
                    //     || arrobj[i] == 1901300410) {
                    //     // arrSave.push(moment($scope.item.obj2[parseInt(arrobj[i])]).format('HH:mm')) 
                    //     arrSave.push({ id: arrobj[i], values: (moment($scope.item.obj2[parseInt(arrobj[i])]).format('HH:mm')) })
                    // }
                    // else {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj2[parseInt(arrobj[i])] })
                    // }                    
                } 
                // debugger
                $scope.cc.jenisemr = 'catatangrafiktandavital'
                if($scope.item.buatbargrafik == true){
                    $scope.cc.norec_emr = '-'
                } else{
                    $scope.cc.norec_emr = $scope.noemrgrafik
                }
                // $scope.cc.norec_emr = $scope.noemrgrafik
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Grafik Tanda - Tanda Vital Pasca Anestesi' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    var arrobj = Object.keys($scope.item.obj2)

                    for (var i = arrobj.length - 1; i >= 0; i--) {
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300202 + z)
                                sesiesSuhu2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300177 + z)
                                seriesNadi2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300227 + z)
                                seriesSistole2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300252 + z)
                                seriesDistole2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300277 + z)
                                seriesRespirasi2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300302 + z)
                                seriesSaturasi2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 10; z++) {
                            if (arrobj[i] == 1901300327 + z)
                                seriesO22[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        }
                        // for (let z = 0; z < 10; z++) {
                        //     if (arrobj[i] == 1901300343 + z)
                        //         seriesN2O2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        // }
                        // for (let z = 0; z < 10; z++) {
                        //     if (arrobj[i] == 1901300368 + z)
                        //         seriesVolatile2[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                        // }
                    }
                    for (let x = 0; x < sesiesSuhu2.length; x++) {
                        if (!isNaN(parseFloat(sesiesSuhu2[x])))
                            sesiesSuhu2[x] = parseFloat(sesiesSuhu2[x])
                    }
                    for (let x = 0; x < seriesNadi2.length; x++) {
                        if (!isNaN(parseInt(seriesNadi2[x])))
                            seriesNadi2[x] = parseInt(seriesNadi2[x])
                    }
                    for (let x = 0; x < seriesSistole2.length; x++) {
                        if (!isNaN(parseInt(seriesSistole2[x])))
                            seriesSistole2[x] = parseInt(seriesSistole2[x])
                    }
                    for (let x = 0; x < seriesDistole2.length; x++) {
                        if (!isNaN(parseInt(seriesDistole2[x])))
                            seriesDistole2[x] = parseInt(seriesDistole2[x])
                    }
                    for (let x = 0; x < seriesRespirasi2.length; x++) {
                        if (!isNaN(parseInt(seriesRespirasi2[x])))
                            seriesRespirasi2[x] = parseInt(seriesRespirasi2[x])
                    }
                    for (let x = 0; x < seriesSaturasi2.length; x++) {
                        if (!isNaN(parseInt(seriesSaturasi2[x])))
                            seriesSaturasi2[x] = parseInt(seriesSaturasi2[x])
                    }
                    for (let x = 0; x < seriesO22.length; x++) {
                        if (!isNaN(parseInt(seriesO22[x])))
                            seriesO22[x] = parseInt(seriesO22[x])
                    }
                    // for (let x = 0; x < seriesN2O2.length; x++) {
                    //     if (!isNaN(parseInt(seriesN2O2[x])))
                    //         seriesN2O2[x] = parseInt(seriesN2O2[x])
                    // }
                    // for (let x = 0; x < seriesVolatile2.length; x++) {
                    //     if (!isNaN(parseInt(seriesVolatile2[x])))
                    //         seriesVolatile2[x] = parseInt(seriesVolatile2[x])
                    // }
                    $scope.isRouteLoading = false
                    init()
                    initgrafik()
                    loadChart()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Grafik Tanda - Tanda Vital' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    // $rootScope.loadRiwayat()
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
                $scope.item.buatbarugrafik = false
            }
            //     debugger
            //     //perpage
            //     if ($scope.isPertama) {
            //         $scope.isPertama = false
            //         $scope.isKedua = true
            //         $scope.isKetiga = false
            //         $scope.isKeempat = false
            //     } else if ($scope.isKedua) {
            //         $scope.isKedua = false
            //         $scope.isPertama = true
            //         $scope.isKetiga = false
            //         $scope.isKeempat = false
            //     } else if ($scope.isKetiga) {
            //         $scope.isKedua = false
            //         $scope.isPertama = false
            //         $scope.isKetiga = false
            //         $scope.isKeempat = true
            //     } else if ($scope.isKeempat) {
            //         $scope.isKedua = false
            //         $scope.isPertama = false
            //         $scope.isKetiga = false
            //         $scope.isKeempat = true
            //     }
            // }
            $scope.tanyaSave = function () {
                var confirm = $mdDialog.confirm()
                    .title('Konfirmasi')
                    .textContent('Anda yakin akan melanjutkan proses?')
                    .ariaLabel('Lucky day')
                    .cancel('SELANJUTNYA')
                    .ok('SIMPAN DAN SELANJUTNYA')
                $mdDialog.show(confirm).then(function () {
                    $scope.Save();
                }, function () {

                    if ($scope.isPertama) {
                        $scope.isPertama = false
                        $scope.isKedua = true
                        $scope.isKetiga = false
                        $scope.isKeempat = false
                    } else if ($scope.isKedua) {
                        $scope.isKedua = false
                        $scope.isPertama = false
                        $scope.isKetiga = true
                        $scope.isKeempat = false
                    } else if ($scope.isKetiga) {
                        $scope.isKedua = false
                        $scope.isPertama = false
                        $scope.isKetiga = false
                        $scope.isKeempat = true
                    } else if ($scope.isKeempat) {
                        $scope.isKedua = false
                        $scope.isPertama = false
                        $scope.isKetiga = false
                        $scope.isKeempat = true
                    }
                });

            }

            $scope.lihatsemuakembali = function () {
                $scope.isPertama = true
                $scope.isKedua = false
                $scope.isKetiga = false
                $scope.isKeempat = false

                $scope.lanjut1 = true
                $scope.lanjut2 = true
                $scope.lanjut3 = true


                $scope.islihat = true
                $scope.islihatkembali = false
            }

            $scope.next1 = function () {
                $scope.isPertama = false
                $scope.isKedua = true
                $scope.isKetiga = false
                $scope.isKeempat = false
            }

            $scope.next2 = function () {
                $scope.isKedua = false
                $scope.isPertama = true
                $scope.isKetiga = false
                $scope.isKeempat = false
            }

            $scope.next3 = function () {
                $scope.isKedua = false
                $scope.isPertama = false
                $scope.isKetiga = false
                $scope.isKeempat = true
            }


            $scope.back2 = function () {
                $scope.isPertama = true
                $scope.isKedua = false
                $scope.isKetiga = false
                $scope.isKeempat = false
            }

            $scope.back3 = function () {
                $scope.isKedua = true
                $scope.isPertama = false
                $scope.isKetiga = false
                $scope.isKeempat = false
            }

            $scope.back4 = function () {
                $scope.isKedua = false
                $scope.isPertama = false
                $scope.isKetiga = true
                $scope.isKeempat = false
            }

            $scope.ambilemr = function (){
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporananestesi", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    if (dat.data.data.length > 0) {
                       
                        setobjectToModel2(dat.data.data[0].noemr,520)
                    }
                })
            }

            function setobjectToModel2(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false
                    var chekedd = false
                    $scope.item.obj = []
                    $scope.item.obj2 = [] 
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (dataLoad[i].emrdfk == "370") {
                            $scope.item.obj[5407] = dataLoad[i].value 
                        } else if (dataLoad[i].emrdfk == "371") {
                            $scope.item.obj[5408] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "372") {
                            $scope.item.obj[5409] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2263") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5827] = true
                            } 
                        } else if (dataLoad[i].emrdfk == "2264") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5828] = true
                            } 
                        } else if (dataLoad[i].emrdfk == "2265") {
                            $scope.item.obj[5829] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2266") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5927] = true
                            } 
                        } else if (dataLoad[i].emrdfk == "2267") {
                            $scope.item.obj[5928] = dataLoad[i].value
                        }  else if (dataLoad[i].emrdfk == "2269") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5830] = true
                            } 
                        } else if (dataLoad[i].emrdfk == "2270") {
                            $scope.item.obj[5831] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2271") {
                            $scope.item.obj[5832] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2272") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5929] = true
                            } 
                            
                        } else if (dataLoad[i].emrdfk == "2273") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5930] = true
                            }  
                        } else if (dataLoad[i].emrdfk == "2275") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5833] = true
                            }   
                        } else if (dataLoad[i].emrdfk == "2276") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5834] = true
                            }    
                        } else if (dataLoad[i].emrdfk == "2277") {
                            $scope.item.obj[5835] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2278") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5931] = true
                            }   
                        } else if (dataLoad[i].emrdfk == "2279") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5932] = true
                            }  
                        } else if (dataLoad[i].emrdfk == "2280") {
                            $scope.item.obj[5412] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2281") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5836] = true
                            }  
                            
                        } else if (dataLoad[i].emrdfk == "2282") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5837] = true
                            }   
                        } else if (dataLoad[i].emrdfk == "379") {
                            $scope.item.obj[2265] = dataLoad[i].value
                        }  else if ( dataLoad[i].emrdfk == "3114") {
                            var str = dataLoad[i].value
                            var res = str.split("~"); 
                            $scope.item.obj[5839] = { id: res[0], text: str }
                           
                                $scope.yaOperasi = true
                                $scope.yaGaRa = true
                       

                        } else if (dataLoad[i].emrdfk == "2283") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5840] = true
                            }
                        } else if (dataLoad[i].emrdfk == "2284") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5841] = true
                            }
                        } else if (dataLoad[i].emrdfk == "3115") {
                            $scope.item.obj[5842] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "3116") { 
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5933] = { id: res[0], text: str }
                            $scope.yaGaKompilkasi = true
                        } else if (dataLoad[i].emrdfk == "3117") {
                            $scope.item.obj[5416] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "383") {
                            $scope.item.obj[5417] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "384") {
                            $scope.item.obj[5418] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "385") {
                            $scope.item.obj[5419] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "386") {
                            $scope.item.obj[5420] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "387") {
                            $scope.item.obj[5421] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "388") {
                            $scope.item.obj[5422] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "389") {
                            $scope.item.obj[5934] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "390") {
                            $scope.item.obj[5935] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "391") {
                            $scope.item.obj[5936] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2285") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5426] = true
                            }
                        } else if (dataLoad[i].emrdfk == "2286") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5427] = true
                            }
                        } else if (dataLoad[i].emrdfk == "392") {
                            $scope.item.obj[5428] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2287") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5429] = true
                            }
                        } else if (dataLoad[i].emrdfk == "2288") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5430] = true
                            }
                        } else if (dataLoad[i].emrdfk == "393") {
                            $scope.item.obj[5431] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "2289") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5432] = true
                            }
                        } else if (dataLoad[i].emrdfk == "2290") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5433] = true
                            }
                        } else if (dataLoad[i].emrdfk == "394") {
                            $scope.item.obj[5434] = dataLoad[i].value
                            
                        }  else if (dataLoad[i].emrdfk == "2291") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5435] = true
                            }
                        } else if (dataLoad[i].emrdfk == "2292") {
                            if (dataLoad[i].value == '1') {
                                $scope.item.obj[5436] = true
                            }
                        } else if (dataLoad[i].emrdfk == "395") {
                            $scope.item.obj[5437] = dataLoad[i].value

                        } else if (dataLoad[i].emrdfk == "397") {
                            $scope.item.obj[5439] = dataLoad[i].value
                        } else if (dataLoad[i].emrdfk == "400") {
                            if (dataLoad[i].value == '1') {
                                // $scope.item.obj[5442] = dataLoad[i].value
                                $scope.item.obj[5442] = true
                            }  
                        } else if (dataLoad[i].emrdfk == "3118") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5937] = { id: res[0], text: str }

                        } else if (dataLoad[i].emrdfk == "3119") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5938] = { id: res[0], text: str }

                        } else if (dataLoad[i].emrdfk == "402") {
                            if (dataLoad[i].value == '1') {
                                // $scope.item.obj[5444] = dataLoad[i].value
                                $scope.item.obj[5444] = true
                            }  
                        } else if (dataLoad[i].emrdfk == "403") {
                            $scope.item.obj[5443] = dataLoad[i].value
                        // } 
                        // else if (dataLoad[i].emrdfk == "3120") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     $scope.item.obj[5446] = { id: res[0], text: str }

                        } else if (dataLoad[i].emrdfk == "3120") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5446] = { id: res[0], sedasi: str }

                        } else if (dataLoad[i].emrdfk == "3121") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5447] = { id: res[0], anestesi: str }

                        } else if (dataLoad[i].emrdfk == "3122") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[5448] = { id: res[0], anestesiregional: str }

                        } 
                        
                    }

                })
                // cekanestesirajal();    
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnRiwayatAnestesi = [
                {
                    "field": "no",  
                    "title": "No",
                    "width": "5px",
                    "template": "<span class='style-center'>#: no #</span>",
                },  
                {
                    "field": "tglemr",
                    "title": "Tanggal EMR",
                    "width": "10px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                },  
                // {
                //     "field": "noemr",
                //     "title": "No EMR",
                //     "width": "15px",
                // },          
                {
                    "field": "namalengkap",
                    "title": "Petugas Input",
                    "width": "15px",
                }               
            ];
            $scope.columnRiwayatGrafik = [
                {
                    "field": "no",  
                    "title": "No",
                    "width": "5px",
                    "template": "<span class='style-center'>#: no #</span>",
                },  
                {
                    "field": "tglemr",
                    "title": "Tanggal EMR",
                    "width": "10px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                },  
                // {
                //     "field": "noemr",
                //     "title": "No EMR",
                //     "width": "15px",
                // },          
                {
                    "field": "namalengkap",
                    "title": "Petugas Input",
                    "width": "15px",
                }               
            ];
            $scope.BuatBaru = function (){
            var chekedd = false
            $scope.item.obj = []
            nomorEMRSS = ''
            $scope.cc.norec_emr = '-'
            $scope.item.buatbaru = true

            //tambahan dari grafik2
            $scope.item.obj2 = []
            nomorEMRSS = ''
            $scope.noemrgrafik = '-'
            $scope.item.buatbarugrafik = true
            initgrafik();
            // debugger
            // $scope.item.obj[4491] = moment($scope.now).format('YYYY-MM-DD')
            }

            $scope.BuatBaruGrafik = function (){
            var chekedd = false
            $scope.item.obj2 = []
            nomorEMRSS = ''
            $scope.noemrgrafik = '-'
            // sesiesSuhu[x] = 0
            // seriesNadi[x] = 0
            // seriesSistole[x] = 0
            // seriesDistole[x] = 0
            // seriesRespirasi[x] = 0
            // seriesSaturasi[x] = 0
            // seriesO2[x] = 0
            // seriesN2O[x] = 0
            // seriesAIR[x] = 0
            // seriesVolatile[x] = 0
            // sesiesSuhu2[x] = 0
            // seriesNadi2[x] = 0
            // seriesSistole2[x] = 0
            // seriesDistole2[x] = 0
            // seriesRespirasi2[x] = 0
            // seriesSaturasi2[x] = 0
            // seriesO22[x] = 0
            $scope.item.buatbarugrafik = true
            initgrafik();
            // debugger
            // $scope.item.obj[4491] = moment($scope.now).format('YYYY-MM-DD')
            }

            $scope.deleteLaporan = function() {
                if ($scope.dataSelectedRiwayatGrafik == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return
                }
                $scope.popUpPassword2.center().open();
            }
            $scope.deleteLaporan2 = function() {
                if ($scope.item.password2 != "surabi") {
                    toastr.error('Password Salah !')
                    return
                }
                $scope.popUpPassword2.close();
                let objSave = {
                    // noemr : $scope.dataSelectedRiwayatGrafik.noemr,
                    norec: $scope.dataSelectedRiwayatGrafik.norec
                }
                medifirstService.post('emr/delete-grafik-anestesi', objSave).then(function(e) {
                    if (e.data.status == 201) {
                        initgrafik()
                    }
                })
            }

            $scope.deleteanestesi = function() {
                if ($scope.dataSelectedRiwayatAnestesi == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return
                }
                $scope.popUpPassword23.center().open();
            }
            $scope.deleteanestesi2 = function() {
                if ($scope.item.password2 != "surabi") {
                    toastr.error('Password Salah !')
                    return
                }
                $scope.popUpPassword23.close();
                let objSave = {
                    // noemr : $scope.dataSelectedRiwayatGrafik.noemr,
                    norec: $scope.dataSelectedRiwayatAnestesi.norec
                }
                medifirstService.post('emr/delete-grafik-anestesi', objSave).then(function(e) {
                    if (e.data.status == 201) {
                        init()
                    }
                })
            }
            function setobjectToModelGrafik (nomorEMRSS){               
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatangrafiktandavital", true).then(function (dat) {
                    $scope.isRouteLoading = false                   
                    // if($scope.item.buatbarugrafik == false){                    
                    if (dat.data.data.length > 0) {
                        if($scope.item.buatbarugrafik == true){
                        $scope.noemrgrafik = '-'
                    } else {
                        $scope.noemrgrafik = dat.data.data[0].noemr
                    }
                        medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMRSS + "&emrfk=" + 188, true).then(function (dat) {
                            $scope.isLoading = false
                            // $scope.item.obj = []
                            $scope.item.obj2 = []
                            dataLoad = dat.data.data
                            for (var i = 0; i <= dataLoad.length - 1; i++) {
                                if (dataLoad[i].type == "textbox") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "date") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "time") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] = dataLoad[i].value
                                    // $scope.item.obj2[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                                }
                                if (dataLoad[i].emrdfk == "1901300393") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300394") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300395") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300396") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300397") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300398") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300399") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300400") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300401") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300402") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300403") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300404") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300405") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300406") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300407") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300408") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300409") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].emrdfk == "1901300410") {
                                    $scope.item.obj2[dataLoad[i].emrdfk] =  new Date(dataLoad[i].value)
                                }
                            }
                            var arrobj = Object.keys($scope.item.obj2)
                            if($scope.item.buatbarugrafik == false){
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let z = 0; z < 9; z++) {
                                    if (arrobj[i] == 1901300193 + z)
                                        sesiesSuhu[z] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let y = 0; y < 9; y++) {
                                    if (arrobj[i] == 1901300168 + y)
                                        seriesNadi[y] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let w = 0; w < 9; w++) {
                                    if (arrobj[i] == 1901300218 + w)
                                        seriesSistole[w] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let v = 0; v < 9; v++) {
                                    if (arrobj[i] == 1901300243 + v)
                                        seriesDistole[v] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let q = 0; q < 9; q++) {
                                    if (arrobj[i] == 1901300268 + q)
                                        seriesRespirasi[q] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let m = 0; m < 9; m++) {
                                    if (arrobj[i] == 1901300293 + m)
                                        seriesSaturasi[m] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let n = 0; n < 9; n++) {
                                    if (arrobj[i] == 1901300318 + n)
                                        seriesO2[n] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let j = 0; j < 9; j++) {
                                    if (arrobj[i] == 1901300343 + j)
                                        seriesN2O[j] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let b = 0; b < 9; b++) {
                                    if (arrobj[i] == 1901300414 + b)
                                        seriesAIR[b] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let t = 0; t < 9; t++) {
                                    if (arrobj[i] == 1901300368 + t)
                                        seriesVolatile[t] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }

                            //grafik2
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let a = 0; a < 9; a++) {
                                    if (arrobj[i] == 1901300202 + a)
                                        sesiesSuhu2[a] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let c = 0; c < 9; c++) {
                                    if (arrobj[i] == 1901300177 + c)
                                        seriesNadi2[c] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let d = 0; d < 9; d++) {
                                    if (arrobj[i] == 1901300227 + d)
                                        seriesSistole2[d] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let e = 0; e < 9; e++) {
                                    if (arrobj[i] == 1901300252 + e)
                                        seriesDistole2[e] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let f = 0; f < 9; f++) {
                                    if (arrobj[i] == 1901300277 + f)
                                        seriesRespirasi2[f] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let g = 0; g < 9; g++) {
                                    if (arrobj[i] == 1901300302 + g)
                                        seriesSaturasi2[g] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                            for (var i = arrobj.length - 1; i >= 0; i--) {
                                for (let h = 0; h < 9; h++) {
                                    if (arrobj[i] == 1901300327 + h)
                                        seriesO22[h] = $scope.item.obj2[parseFloat(arrobj[i])]
                                }
                            }
                        }
                            

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < sesiesSuhu.length; x++) {
                                    sesiesSuhu[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < sesiesSuhu.length; x++) {
                                    if (!isNaN(parseFloat(sesiesSuhu[x]))) {
                                        sesiesSuhu[x] = parseFloat(sesiesSuhu[x]);
                                    }
                                    else {
                                        sesiesSuhu[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesNadi.length; x++) {
                                    seriesNadi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesNadi.length; x++) {
                                    if (!isNaN(parseFloat(seriesNadi[x]))) {
                                        seriesNadi[x] = parseFloat(seriesNadi[x]);
                                    }
                                    else {
                                        seriesNadi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesSistole.length; x++) {
                                    seriesSistole[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesSistole.length; x++) {
                                    if (!isNaN(parseFloat(seriesSistole[x]))) {
                                        seriesSistole[x] = parseFloat(seriesSistole[x]);
                                    }
                                    else {
                                        seriesSistole[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesDistole.length; x++) {
                                    seriesDistole[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesDistole.length; x++) {
                                    if (!isNaN(parseFloat(seriesDistole[x]))) {
                                        seriesDistole[x] = parseFloat(seriesDistole[x]);
                                    }
                                    else {
                                        seriesDistole[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesRespirasi.length; x++) {
                                    seriesRespirasi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesRespirasi.length; x++) {
                                    if (!isNaN(parseFloat(seriesRespirasi[x]))) {
                                        seriesRespirasi[x] = parseFloat(seriesRespirasi[x]);
                                    }
                                    else {
                                        seriesRespirasi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesSaturasi.length; x++) {
                                    seriesSaturasi[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesSaturasi.length; x++) {
                                    if (!isNaN(parseFloat(seriesSaturasi[x]))) {
                                        seriesSaturasi[x] = parseFloat(seriesSaturasi[x]);
                                    }
                                    else {
                                        seriesSaturasi[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesO2.length; x++) {
                                    seriesO2[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesO2.length; x++) {
                                    if (!isNaN(parseFloat(seriesO2[x]))) {
                                        seriesO2[x] = parseFloat(seriesO2[x]);
                                    }
                                    else {
                                        seriesO2[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesN2O.length; x++) {
                                    seriesN2O[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesN2O.length; x++) {
                                    if (!isNaN(parseFloat(seriesN2O[x]))) {
                                        seriesN2O[x] = parseFloat(seriesN2O[x]);
                                    }
                                    else {
                                        seriesN2O[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesAIR.length; x++) {
                                    seriesAIR[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesAIR.length; x++) {
                                    if (!isNaN(parseFloat(seriesAIR[x]))) {
                                        seriesAIR[x] = parseFloat(seriesAIR[x]);
                                    }
                                    else {
                                        seriesAIR[x] = 0;
                                    }
                                }
                            }

                            if ($scope.item.buatbarugrafik === true) {
                                for (let x = 0; x < seriesVolatile.length; x++) {
                                    seriesVolatile[x] = 0;
                                }
                            } else {
                                for (let x = 0; x < seriesVolatile.length; x++) {
                                    if (!isNaN(parseFloat(seriesVolatile[x]))) {
                                        seriesVolatile[x] = parseFloat(seriesVolatile[x]);
                                    }
                                    else {
                                        seriesVolatile[x] = 0;
                                    }
                                }
                            }
                            
                          

                            //grafik2
                            for (let x = 0; x < sesiesSuhu2.length; x++) {
                                if (!isNaN(parseFloat(sesiesSuhu2[x])))
                                sesiesSuhu2[x] = parseFloat(sesiesSuhu2[x])
                                else
                                sesiesSuhu2[x] = 0
                            }
                            for (let x = 0; x < seriesNadi2.length; x++) {
                                if (!isNaN(parseInt(seriesNadi2[x])))
                                seriesNadi2[x] = parseInt(seriesNadi2[x])
                                else
                                seriesNadi2[x] = 0
                            }
                            for (let x = 0; x < seriesSistole2.length; x++) {
                                if (!isNaN(parseInt(seriesSistole2[x])))
                                seriesSistole2[x] = parseInt(seriesSistole2[x])
                                else
                                seriesSistole2[x] = 0
                            }
                            for (let x = 0; x < seriesDistole2.length; x++) {
                                if (!isNaN(parseInt(seriesDistole2[x])))
                                seriesDistole2[x] = parseInt(seriesDistole2[x])
                                else
                                seriesDistole2[x] = 0
                            }
                            for (let x = 0; x < seriesRespirasi2.length; x++) {
                                if (!isNaN(parseInt(seriesRespirasi2[x])))
                                seriesRespirasi2[x] = parseInt(seriesRespirasi2[x])
                                else
                                seriesRespirasi2[x] = 0
                            }
                            for (let x = 0; x < seriesSaturasi2.length; x++) {
                                if (!isNaN(parseInt(seriesSaturasi2[x])))
                                seriesSaturasi2[x] = parseInt(seriesSaturasi2[x])
                                else
                                seriesSaturasi2[x] = 0
                            }
                            for (let x = 0; x < seriesO22.length; x++) {
                                if (!isNaN(parseInt(seriesO22[x])))
                                seriesO22[x] = parseInt(seriesO22[x])
                                else
                                seriesO22[x] = 0
                            }
                            loadChart()
                            // console.log(seriesNadi)
                            // console.log(sesiesSuhu)
                        })
                        }         
                    // }            
                })                   
            }
        
            

        }
    ])
})