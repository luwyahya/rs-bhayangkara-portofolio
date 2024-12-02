define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianAwalKeperawatanJiwaCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.cc = {};
        $scope.item.obj = []
        var dataLoad = []
        $scope.cc.emrfk = 679;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        // var nomorEMR = '-'
        var nomorEMR = ''
        $scope.lainnya = false;
        $scope.penyakit1 = false;
        $scope.penyakit2 = false;
        $scope.penyakit3 = false;
        $scope.penyakit4 = false;
        $scope.penyakit5 = false;
        $scope.penyakit6 = false;
        $scope.penyakit7 = false;
        $scope.jenisoperasi = false;
        $scope.jenisoperasi2 = false;
        $scope.jelaskan1 = false;
        $scope.jelaskan2 = false;
        $scope.jelaskan3 = false;
        $scope.obat = false;
        $scope.nilai = false;
        $scope.privasi = false;
        $scope.lihat = false;
        $scope.ya = false;
        $scope.sebutkan = false;
        var lanjut = false;
        var totalNilai = 0;
        LoadCacheHelper()
        loadCombo()

        
        $scope.listNyeriAnak = [
            {
                "id": 6, "nama": "Hurts", "detail": [
                { "id": 74, "nama": "No Hurt", "descNilai": 4 },
                { "id": 75, "nama": "Hurts Little Bit", "descNilai": 6 }, 
                { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                { "id": 76, "nama": "Hurts Even More", "descNilai": 8 }, 
                { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                { "id": 77, "nama": "Hurts whorts", "descNilai": 10 }]
            }
        ]
        $scope.listSkorWong = [{
            "id": 7, "nama": "Score ",
            "detail": [
                { "id": 1207, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                { "id": 1208, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                { "id": 1209, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                { "id": 1210, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                { "id": 1211, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                { "id": 1212, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
            ]
        }]
     

        $scope.$watch('item.obj[1336]', function(e) {
            if (e == true) {
                $scope.lainnya = true;
                $scope.item.obj[1335] = undefined
                $scope.item.obj[1334] = undefined
            } else {
                $scope.lainnya = false;
            }
        })

        $scope.$watch('item.obj[1335]', function(e) {
            if (e == true) {
                $scope.item.obj[1336] = undefined
                $scope.item.obj[1334] = undefined
            } 
        })

        $scope.$watch('item.obj[1334]', function(e) {
            if (e == true) {
                $scope.item.obj[1336] = undefined
                $scope.item.obj[1335] = undefined
            } 
        })

        //1
        $scope.$watch('item.obj[1341]', function(e) {
            if (e == true) {
                $scope.penyakit1 = true;
                $scope.item.obj[1340] = undefined
                $scope.item.obj[1339] = undefined
            } else {
                $scope.penyakit1 = false;
            }
        })

        $scope.$watch('item.obj[1340]', function(e) {
            if (e == true) {
                $scope.item.obj[1341] = undefined
                $scope.item.obj[1339] = undefined
            } 
        })

        $scope.$watch('item.obj[1339]', function(e) {
            if (e == true) {
                $scope.item.obj[1341] = undefined
                $scope.item.obj[1340] = undefined
            } 
        })
        //2
        $scope.$watch('item.obj[1345]', function(e) {
            if (e == true) {
                $scope.penyakit2 = true;
                $scope.item.obj[1344] = undefined
                $scope.item.obj[1343] = undefined
            } else {
                $scope.penyakit2 = false;
            }
        })

        $scope.$watch('item.obj[1344]', function(e) {
            if (e == true) {
                $scope.item.obj[1345] = undefined
                $scope.item.obj[1343] = undefined
            } 
        })

        $scope.$watch('item.obj[1343]', function(e) {
            if (e == true) {
                $scope.item.obj[1345] = undefined
                $scope.item.obj[1344] = undefined
            } 
        })
        //3
        $scope.$watch('item.obj[1349]', function(e) {
            if (e == true) {
                $scope.jenisoperasi = true;
                $scope.item.obj[1348] = undefined
                $scope.item.obj[1347] = undefined
            } else {
                $scope.jenisoperasi = false;
            }
        })

        $scope.$watch('item.obj[1348]', function(e) {
            if (e == true) {
                $scope.item.obj[1349] = undefined
                $scope.item.obj[1347] = undefined
            } 
        })

        $scope.$watch('item.obj[1347]', function(e) {
            if (e == true) {
                $scope.item.obj[1349] = undefined
                $scope.item.obj[1348] = undefined
            } 
        })
        //4
        $scope.$watch('item.obj[1353]', function(e) {
            if (e == true) {
                $scope.obat = true;
                $scope.item.obj[1352] = undefined
                $scope.item.obj[1351] = undefined
            } else {
                $scope.obat = false;
            }
        })

        $scope.$watch('item.obj[1352]', function(e) {
            if (e == true) {
                $scope.item.obj[1353] = undefined
                $scope.item.obj[1351] = undefined
            } 
        })

        $scope.$watch('item.obj[1351]', function(e) {
            if (e == true) {
                $scope.item.obj[1353] = undefined
                $scope.item.obj[1352] = undefined
            } 
        })
        //5
        $scope.$watch('item.obj[1357]', function(e) {
            if (e == true) {
                $scope.penyakit3 = true;
                $scope.item.obj[1356] = undefined
                $scope.item.obj[1355] = undefined
            } else {
                $scope.penyakit3 = false;
            }
        })

        $scope.$watch('item.obj[1356]', function(e) {
            if (e == true) {
                $scope.item.obj[1357] = undefined
                $scope.item.obj[1355] = undefined
            } 
        })

        $scope.$watch('item.obj[1355]', function(e) {
            if (e == true) {
                $scope.item.obj[1357] = undefined
                $scope.item.obj[1356] = undefined
            } 
        })
        //6
        $scope.$watch('item.obj[1361]', function(e) {
            if (e == true) {
                $scope.penyakit4 = true;
                $scope.item.obj[1360] = undefined
                $scope.item.obj[1359] = undefined
            } else {
                $scope.penyakit4 = false;
            }
        })

        $scope.$watch('item.obj[1360]', function(e) {
            if (e == true) {
                $scope.item.obj[1361] = undefined
                $scope.item.obj[1359] = undefined
            } 
        })

        $scope.$watch('item.obj[1359]', function(e) {
            if (e == true) {
                $scope.item.obj[1361] = undefined
                $scope.item.obj[1360] = undefined
            } 
        })
        //7
        $scope.$watch('item.obj[1365]', function(e) {
            if (e == true) {
                $scope.penyakit5 = true;
                $scope.item.obj[1364] = undefined
                $scope.item.obj[1363] = undefined
            } else {
                $scope.penyakit5 = false;
            }
        })

        $scope.$watch('item.obj[1364]', function(e) {
            if (e == true) {
                $scope.item.obj[1365] = undefined
                $scope.item.obj[1363] = undefined
            } 
        })

        $scope.$watch('item.obj[1363]', function(e) {
            if (e == true) {
                $scope.item.obj[1365] = undefined
                $scope.item.obj[1364] = undefined
            } 
        })
        //8
        $scope.$watch('item.obj[1369]', function(e) {
            if (e == true) {
                $scope.penyakit6 = true;
                $scope.item.obj[1368] = undefined
                $scope.item.obj[1367] = undefined
            } else {
                $scope.penyakit6 = false;
            }
        })

        $scope.$watch('item.obj[1368]', function(e) {
            if (e == true) {
                $scope.item.obj[1369] = undefined
                $scope.item.obj[1367] = undefined
            } 
        })

        $scope.$watch('item.obj[1367]', function(e) {
            if (e == true) {
                $scope.item.obj[1369] = undefined
                $scope.item.obj[1368] = undefined
            } 
        })
        //9
        $scope.$watch('item.obj[1374]', function(e) {
            if (e == true) {
                $scope.penyakit7 = true;
                $scope.item.obj[1373] = undefined
                $scope.item.obj[1372] = undefined
            } else {
                $scope.penyakit7 = false;
            }
        })

        $scope.$watch('item.obj[1373]', function(e) {
            if (e == true) {
                $scope.item.obj[1374] = undefined
                $scope.item.obj[1372] = undefined
            } 
        })

        $scope.$watch('item.obj[1372]', function(e) {
            if (e == true) {
                $scope.item.obj[1374] = undefined
                $scope.item.obj[1373] = undefined
            } 
        })
        //10
        $scope.$watch('item.obj[1378]', function(e) {
            if (e == true) {
                $scope.jenisoperasi2 = true;
                $scope.item.obj[1377] = undefined
                $scope.item.obj[1376] = undefined
            } else {
                $scope.jenisoperasi2 = false;
            }
        })

        $scope.$watch('item.obj[1377]', function(e) {
            if (e == true) {
                $scope.item.obj[1378] = undefined
                $scope.item.obj[1376] = undefined
            } 
        })

        $scope.$watch('item.obj[1376]', function(e) {
            if (e == true) {
                $scope.item.obj[1378] = undefined
                $scope.item.obj[1377] = undefined
            } 
        })
        //11
        $scope.$watch('item.obj[1382]', function(e) {
            if (e == true) {
                $scope.jelaskan1 = true;
                $scope.item.obj[1381] = undefined
                $scope.item.obj[1380] = undefined
            } else {
                $scope.jelaskan1 = false;
            }
        })

        $scope.$watch('item.obj[1381]', function(e) {
            if (e == true) {
                $scope.item.obj[1382] = undefined
                $scope.item.obj[1380] = undefined
            } 
        })

        $scope.$watch('item.obj[1380]', function(e) {
            if (e == true) {
                $scope.item.obj[1382] = undefined
                $scope.item.obj[1381] = undefined
            } 
        })
        //12
        $scope.$watch('item.obj[1386]', function(e) {
            if (e == true) {
                $scope.jelaskan2 = true;
                $scope.item.obj[1385] = undefined
                $scope.item.obj[1384] = undefined
            } else {
                $scope.jelaskan2 = false;
            }
        })

        $scope.$watch('item.obj[1385]', function(e) {
            if (e == true) {
                $scope.item.obj[1386] = undefined
                $scope.item.obj[1384] = undefined
            } 
        })

        $scope.$watch('item.obj[1384]', function(e) {
            if (e == true) {
                $scope.item.obj[1386] = undefined
                $scope.item.obj[1385] = undefined
            } 
        })
        //13
        $scope.$watch('item.obj[1390]', function(e) {
            if (e == true) {
                $scope.jelaskan3 = true;
                $scope.item.obj[1389] = undefined
                $scope.item.obj[1388] = undefined
            } else {
                $scope.jelaskan3 = false;
            }
        })

        $scope.$watch('item.obj[1389]', function(e) {
            if (e == true) {
                $scope.item.obj[1390] = undefined
                $scope.item.obj[1388] = undefined
            } 
        })

        $scope.$watch('item.obj[1388]', function(e) {
            if (e == true) {
                $scope.item.obj[1390] = undefined
                $scope.item.obj[1389] = undefined
            } 
        })

        $scope.$watch('item.obj[1393]', function(e) {
            if (e == true) {
                $scope.nilai = true
            } else {
                $scope.nilai = false
            } 
        })

        $scope.$watch('item.obj[1395]', function(e) {
            if (e == true) {
                $scope.privasi = true
            } else {
                $scope.privasi = false
            }
        })

        $scope.$watch('item.obj[1176]', function(e) {
            if (e == true) {
                $scope.lihat = true
                $scope.item.obj[1177] = undefined
            } else {
                $scope.lihat = false
            }
        })

        $scope.$watch('item.obj[1177]', function(e) {
            if (e == true) {
                $scope.lihat = false
                $scope.item.obj[1176] = undefined
            }
        })

        $scope.$watch('item.obj[1421]', function(e) {
            if (e == true) {
                $scope.ya = true
            } else {
                $scope.ya = false
            }
        })

        $scope.$watch('item.obj[1458]', function(e) {
            if (e == true) {
                $scope.sebutkan = true
            } else {
                $scope.sebutkan = false
            }
        })

        // $scope.$watch('item.obj[1179]', function(e) {
        //     debugger
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1180]', function(e) {
        //     debugger
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1182]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })
        
        // $scope.$watch('item.obj[1183]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1184]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 3
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 3
        //     }
        // })
        
        // $scope.$watch('item.obj[1185]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 4
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 4
        //     }
        // })
        
        // $scope.$watch('item.obj[1186]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1187]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })

        $scope.getSkalaNyeri = function (data, stat) {
            $scope.activeStatus = stat.descNilai
            var nilai = stat.descNilai
            if (nilai >= 0 && nilai <= 1) {
                $scope.item.obj[1207] = true
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 2 && nilai <= 3) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = true
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 4 && nilai <= 5) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = true
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 6 && nilai <= 7) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = true
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 8 && nilai <= 9) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = true
                $scope.item.obj[1212] = false
            }

            if (nilai == 10) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = true
            }

        }

        // $scope.$watch('item.obj[1466]', function(e) {
        //     debugger
        //     if (e != undefined) {
        //         medifirstService.get('emr/get-combo-diagnosa-pengkajian?kodeDiagnosa=' + e).then(function(dat) {
        //             debugger
        //             $scope.listDiagnosa = dat.data.diagnosa
        //         })
        //     } else {
        //         loadCombo()
        //     }
        // })

        function loadCombo() {
            // medifirstService.get('emr/get-combo-diagnosa-pengkajian?').then(function(dat) {
            //     $scope.listDiagnosa = dat.data.diagnosa
            // })
            medifirstService.getPart("emr/get-combo-diagnosa-pengkajian", true, true, 10).then(function(data) {
                $scope.listDiagnosa = data;
           }); 
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
                { text: "E = 1-15", value: 1},
                { text: "M = 1-15", value: 2},
                { text: "V = 1-15", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5}
            ];
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
                $scope.cc.jenisemr = "pengkajianawalkeperawatanjiwa"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                $scope.item.obj[1332] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                $scope.item.obj[1333] = moment($scope.now).format('HH:mm')
                init()
                cekVitalSign()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalkeperawatanjiwa", true).then(function(dat) {
                $scope.isRouteLoading = false
                debugger
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'pengkajianawalkeperawatanjiwa') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 679;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        cekDiagnosa()
                    }
                    // if (dat.data.data[0].jenisemr == 'pengkajianawal') {
                    //     $scope.noemr = dat.data.data[0].noemr
                    //     $scope.cc.norec_emr = dat.data.data[0].noemr
                    //         nomorEMRSS = ''
                    //         nomorEMRSS = dat.data.data[0].noemr
                    //         nomorEMR = nomorEMRSS
                    //         $scope.cc.emrfk = 674;
                    //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    // } else {
                    //     cekDiagnosa()
                    // }
                } else {
                    cekDiagnosa()
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                debugger
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
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1466") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1168") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1418") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        // if (dataLoad[i].type == "combobox") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        // }
                        if (dataLoad[i].type == "photo") {
                            $scope.user.poto = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == "1188") {
                            debugger
                            // totalNilai = dataLoad[i].value
                            // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                            totalcost[0].value = dataLoad[i].value
                        }
                    }

                }
            })
            cekVitalSign()
        }
        $scope.Save = function() {
            debugger
            var user = medifirstService.getPegawaiLogin();
            $scope.item.obj[1332] = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.obj[1333] = moment($scope.now).format('HH:mm:ss')
            $scope.item.obj[1234] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 1466) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namadiagnosa })
                    } else if (arrobj[i] == 1168) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1418) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            if (totalcost[0].value != "") {
                arrSave.push ({ id: "1188", values: totalcost[0].value})
            }
            $scope.cc.jenisemr = 'pengkajianawalkeperawatanjiwa'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })

                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })
                    var jsonLog = {
                        'jenislog': 'Simpan Pengkajian Keperawatan Jiwa',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Pengkajian Keperawatan Jiwa ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLogging(jsonLog).then(function(e) {

                    })
                        init()
                        // init2()
                        // init3()
                    //     init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
        }
        $scope.Cetak = function () {
            debugger
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 1147; i <= 1236 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "date") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                }
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
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan

            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan"],
                "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan],
                "paramType" : ["","","","","","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
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
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        }
        function cekVitalSign() {
            medifirstService.get('emr/get-vital-sign-pengkajian?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                if (dat.data.length > 0) {
                    for (let i = 0; i < dat.data.length; i++) {
                        if (dat.data[i].caption == 'Tekanan Darah') {
                            $scope.item.obj[1408] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Tinggi badan') {
                            $scope.item.obj[1413] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Berat Badan') {
                            $scope.item.obj[1414] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Suhu') {
                            $scope.item.obj[1172] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Nadi') {
                            $scope.item.obj[1409] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Pernapasan') {
                            $scope.item.obj[1173] = dat.data[i].value
                        } else if (dat.data[i].caption == 'kesadaran') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1407] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang E') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1582] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang M') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1583] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang V') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1584] = { value: res[0], text: res[1] }
                        }
                    }
                }
            })
        }
        function cekDiagnosa() {
            medifirstService.get('emr/get-diagnosa-from-pengkajian-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                $scope.item.obj[1466] = { namadiagnosa: dat.data[0].value }
            })
        }
    }
])
})