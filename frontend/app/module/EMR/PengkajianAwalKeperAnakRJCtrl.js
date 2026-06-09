define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianAwalKeperAnakRJCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.dataSelectedTambah = {}
        $scope.cc = {};
        $scope.item.obj = []
        const dataTambah = []
        var dataLoad = []
        $scope.cc.emrfk = 2034;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        // var nomorEMR = '-'
        var nomorEMR = ''
        $scope.lainnya = false;
        $scope.lainnyaalergi = false;
        $scope.nilai = false;
        $scope.privasi = false;
        $scope.lihat = false;
        $scope.ya = false;
        $scope.sebutkan = false;
        $scope.lainnyaketergantungan = false;
        var lanjut = false;
        var totalNilai = 0;
        LoadCacheHelper()
        loadCombo()
        loadRekon()

        
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
        $scope.$watch('item.obj[1152]', function(e) {
            if (e == true) {
                $scope.lainnya = true;
                $scope.item.obj[1151] = undefined
                $scope.item.obj[1150] = undefined
            } else {
                $scope.lainnya = false;
            }
        })

        $scope.$watch('item.obj[1151]', function(e) {
            if (e == true) {
                $scope.item.obj[1152] = undefined
                $scope.item.obj[1150] = undefined
            } 
        })

        $scope.$watch('item.obj[1150]', function(e) {
            if (e == true) {
                $scope.item.obj[1152] = undefined
                $scope.item.obj[1151] = undefined
            } 
        })

        $scope.$watch('item.obj[1156]', function(e) {
            if (e == true) {
                $scope.nilai = true
            } else {
                $scope.nilai = false
            } 
        })

        $scope.$watch('item.obj[1158]', function(e) {
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

        $scope.$watch('item.obj[1181]', function(e) {
            if (e == true) {
                $scope.ya = true
            } else {
                $scope.ya = false
            }
        })

        $scope.$watch('item.obj[1224]', function(e) {
            if (e == true) {
                $scope.sebutkan = true
            } else {
                $scope.sebutkan = false
            }
        })

        $scope.$watch('item.obj[1197]', function(e) {
            if (e == true) {
                $scope.lainnyaketergantungan = true;               
            } else {
                $scope.lainnyaketergantungan = false;
            }
        })
        $scope.$watch('item.obj[1901304863]', function(e) {
            if (e == true) {
                $scope.lainnyaalergi = true;               
            } else {
                $scope.lainnyaalergi = false;
            }
        })

        $scope.$watch('item.obj[1207]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '0 - 1'              
            } else {
                $scope.item.obj[1215] = undefined
            }
        })
        $scope.$watch('item.obj[1208]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '2 - 3'              
            } else {
                $scope.item.obj[1215] = undefined
            }
        })
        $scope.$watch('item.obj[1209]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '4 - 5'              
            } else {
                $scope.item.obj[1215] = undefined
            }
        })
        $scope.$watch('item.obj[1210]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '6 - 7'              
            } else {
                $scope.item.obj[1215] = undefined
            }
        })
        $scope.$watch('item.obj[1211]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '8 - 9'              
            } else {
                $scope.item.obj[1215] = undefined
            }
        })
        $scope.$watch('item.obj[1212]', function(e) {
            if (e == true) {
                $scope.item.obj[1215] = '10'              
            } else {
                $scope.item.obj[1215] = undefined
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
            debugger
            $scope.item.obj[1215] = undefined
            $scope.activeStatus = stat.descNilai
            var nilai = stat.descNilai
            if (nilai >= 0 && nilai <= 1) {
                $scope.item.obj[1207] = true
                $scope.item.obj[1215] = '0 - 1' 
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 2 && nilai <= 3) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = true
                $scope.item.obj[1215] = '2 - 3' 
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 4 && nilai <= 5) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = true
                $scope.item.obj[1215] = '4 - 5' 
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 6 && nilai <= 7) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = true
                $scope.item.obj[1215] = '6 - 7' 
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 8 && nilai <= 9) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = true
                $scope.item.obj[1215] = '8 - 9' 
                $scope.item.obj[1212] = false
            }

            if (nilai == 10) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = true
                $scope.item.obj[1215] = '10' 
            }

        }

        // $scope.$watch('item.obj[1149]', function(e) {
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
            medifirstService.get("emr/get-combo").then(function (data) {
                $scope.listPegawai = data.data.pegawai
                $scope.listDokter = data.data.dokter
                $scope.listPerawatBidan = data.data.perawatBidan
            });
            // medifirstService.get('emr/get-combo-diagnosa-pengkajian?').then(function(dat) {
            //     $scope.listDiagnosa = dat.data.diagnosa
            // })
            // debugger
            // if ($scope.cc.objectruanganfk == 8 || $scope.cc.objectruanganfk == 250 || $scope.cc.objectruanganfk == 268 || $scope.cc.objectruanganfk == 130 || $scope.cc.objectruanganfk == 446 || $scope.cc.objectruanganfk == 97 || $scope.cc.objectruanganfk == 89 || $scope.cc.objectruanganfk == 459) {
            //     medifirstService.get("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk).then(function(data) {
            //         $scope.listDiagnosa = data.data;
            //     })
            // } else {
                medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                })
            // }
        //     medifirstService.getPart("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk, true, true, 10).then(function(data) {
        //         debugger
        //         if (data.length > 0) {
        //             $scope.listDiagnosa = data;
        //         } else {
        //             medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
        //                 $scope.listDiagnosa = data;
        //             })
        //         }
        //    }); 
           $scope.listKesadaran = [
            { text: "Compos Mentis", value: 1 },
            { text: "Apatis", value: 2 },
            { text: "Delirium", value: 3 },
            { text: "Somnolent", value: 4 },
            { text: "Sopor", value: 5 },
            { text: "Semi Coma", value: 6 },
            { text: "Coma", value: 7 },
            { text: "-", value: 8 }
            ];
            $scope.listGcs = [
                { text: "E", value: 1},
                { text: "M", value: 2},
                { text: "V", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "-", value: 5}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6},
                { text: "-", value: 7}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "-", value: 6}
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
                $scope.cc.jenisemr = "pengkajianawalkeperanakrj"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                $scope.item.obj[1901305147] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                $scope.item.obj[1901305148] = moment($scope.now).format('HH:mm')
                init()
                cekVitalSign()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalkeperanakrj", true).then(function(dat) {
                $scope.isRouteLoading = false
                debugger
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'pengkajianawalkeperanakrj') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 2034;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        cekDiagnosa()
                    }
                    // if (dat.data.data[0].jenisemr == 'pengkajianawalkeperanakrj') {
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
                    if ($scope.cc.objectruanganfk == 12) {
                        valueOtomatis()
                    }
                    cekDiagnosa()
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
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
                        if (dataLoad[i].type == "text") {
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304972") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304868") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305253") {
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304869") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304870") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304871") {
                            debugger
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
            $scope.item.obj[1232] = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.obj[1233] = moment($scope.now).format('HH:mm:ss')
            $scope.item.obj[1234] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 1149) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namadiagnosa })
                    } else if (arrobj[i] == 1901305253) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 1901304868) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1901304869) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1901304870) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1901304871) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            // if (totalcost[0].value != "") {
            //     arrSave.push ({ id: "1188", values: totalcost[0].value})
            // }
            $scope.cc.jenisemr = 'pengkajianawalkeperanakrj'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-new', jsonSave).then(function (e) {
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
                            $scope.item.obj[1169] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Tinggi badan') {
                            $scope.item.obj[1174] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Berat Badan') {
                            $scope.item.obj[1175] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Suhu') {
                            $scope.item.obj[1172] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Nadi') {
                            $scope.item.obj[1170] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Pernapasan') {
                            $scope.item.obj[1173] = dat.data[i].value
                        } else if (dat.data[i].caption == 'kesadaran') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1168] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang E') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1259] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang M') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1502] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang V') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1503] = { value: res[0], text: res[1] }
                        }
                    }
                }
            })
        }
        function cekDiagnosa() {
            medifirstService.get('emr/get-diagnosa-from-pengkajian-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                $scope.item.obj[1149] = { namadiagnosa: dat.data[0].value }
            })
        }
        function loadRekon() {
            medifirstService.get('emr/get-rekonsiliasi-obat?norec=' + $scope.cc.norec_pd).then(function(dat) {
                for(let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1
                }
                $scope.sourceRekon = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
            $scope.gridRekon = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Input Baru</button>'
                },],
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "namaobat", title: "Nama Obat", width: 120 },
                    { field: "dosis", title: "Dosis", width: 120 },
                    { field: "frekuensi", title: "Frekuensi", width: 150 },
                    { field: "carapemberian", title: "Cara Pemberian", width: 120 },
                    { field: "pemberianterakhir", title: "Waktu Pemberian Terakhir", width: 120 },
                    { field: "tindaklanjut", title: "Tindak Lanjut", width: 150 },
                    { field: "perubahanaturanpakai", title: "Perubahan Aturan Pakai", width: 120 },
                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 150 }
                ],
            };
        }
        $scope.inputBaru = function() {
            jiahaha()
            $scope.popUpTambahRekonsiliasi.center().open()
        }
        function jiahaha() {
            if (dataTambah.length > 0) {
                for(let i = 0; i < dataTambah.length; i++) {
                    dataTambah[i].no = i + 1
                }
            }
            $scope.sourceTambah = new kendo.data.DataSource({
                data: dataTambah,
                length: dataTambah.length,
                pageSize: 20
            });
            $scope.gridTambah = {
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "namaobat", title: "Nama Obat", width: 120 },
                    { field: "dosis", title: "Dosis", width: 120 },
                    { field: "frekuensi", title: "Frekuensi", width: 150 },
                    { field: "carapemberian", title: "Cara Pemberian", width: 120 },
                    { field: "pemberianterakhir", title: "Waktu Pemberian Terakhir", width: 120 },
                    { field: "tindaklanjut", title: "Tindak Lanjut", width: 150 },
                    { field: "perubahanaturanpakai", title: "Perubahan Aturan Pakai", width: 120 },
                ],
            };
        }
        $scope.simpanBohongan = function() {
            let waktu = undefined
            if ($scope.item.waktuPemberianTerakhir != undefined) {
                waktu = moment($scope.item.waktuPemberianTerakhir).format('YYYY-MM-DD 00:00:00')
            }
            dataTambah.push({namaobat: $scope.item.namaObat, dosis: $scope.item.dosis, frekuensi: $scope.item.frekuensi, carapemberian: $scope.item.caraPemberian, pemberianterakhir: waktu, tindaklanjut: $scope.item.tindakLanjut, perubahanaturanpakai: $scope.item.perubahanAturanPakai})
            delete $scope.item.namaObat
            delete $scope.item.dosis
            delete $scope.item.frekuensi
            delete $scope.item.caraPemberian
            delete $scope.item.waktuPemberianTerakhir
            delete $scope.item.tindakLanjut
            delete $scope.item.perubahanAturanPakai
            jiahaha()
        }
        $scope.hapusBohongan = function() {
            $scope.dataSelectedTambah
            for(let i = 0; i < dataTambah.length; i++) {
                if (dataTambah[i].no == $scope.dataSelectedTambah.no) {
                    delete dataTambah[i]
                }
            }
            dataTambah.length = dataTambah.length - 1
            jiahaha()
        }
        $scope.simpanBeneran = function() {
            let pegawaiid = JSON.parse(localStorage.getItem('pegawai')).id;
            // if (dataTambah.length == 0) {
            //     toastr.error('Tambah Data Terlebih Dahulu !', 'Peringatan !')
            //     return
            // }
            let objSave = {
                norec_pd: $scope.cc.norec_pd,
                data: dataTambah,
                idpegawai: pegawaiid
            }
            medifirstService.post('emr/save-rekonsiliasi-obat', objSave).then(function(e) {
                debugger
                if (e.status == 201) {
                    $scope.popUpTambahRekonsiliasi.close();
                    loadRekon()
                }
            })
        }
        $scope.cetakRekonObat = function() {
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["norec_pd"],
                "paramValue": [$scope.cc.norec_pd],
                "paramType" : [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data)); 
        }

        function valueOtomatis() {
        if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == "") {
          toastr.error("Ada kesalahan saat ambil isian Pengkajian Hemodialisa, Mohon refresh kembali!");
        } else {
          medifirstService.get("emr/get-value-pengkajian-hemodialisa?noRegistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            if (e.data.messageCode == 200) {
              var value = e.data.data;
              for (let i = 0; i < value.length; i++) {
                //tekanan darah
                if (value[i].emrdfk == 3256) {
                  $scope.item.obj[1169] = value[i].value;
                }
                //Pernapasan
                if (value[i].emrdfk == 3257) {
                  $scope.item.obj[1173] = value[i].value;
                }
                //suhu
                if (value[i].emrdfk == 3258) {
                  $scope.item.obj[1172] = value[i].value;
                }
                //nadi
                if (value[i].emrdfk == 3259) {
                  $scope.item.obj[1170] = value[i].value;
                }
                //berat badan
                if (value[i].emrdfk == 3263) {
                  $scope.item.obj[1175] = value[i].value;
                }
                //tinggi badan
                if (value[i].emrdfk == 3264) {
                  $scope.item.obj[1174] = value[i].value;
                }
              }
            }
          });
        }
      }

      // --- TAMBAHAN UNTUK SKRINING NUTRISI ANAK (STRONG KIDS) ---
        $scope.kalkulasiStrongKids = function() {
            // Mengubah nilai boolean dari radio button menjadi skor angka
            var skor1 = $scope.item.obj[1901305215] === true ? 1 : 0;
            var skor2 = $scope.item.obj[1901305217] === true ? 1 : 0;
            var skor3 = $scope.item.obj[1901305219] === true ? 1 : 0;
            var skor4 = $scope.item.obj[1901305221] === true ? 2 : 0;
            
            $scope.item.totalSkorNutrisi = skor1 + skor2 + skor3 + skor4;

            // Reset Checkbox Kesimpulan
            $scope.item.obj[1901305222] = false;
            $scope.item.obj[1901305223] = false;
            $scope.item.obj[1901305224] = false;

            // Logika Strong Kids: Rendah (0), Sedang (1-4), Tinggi (5)
            if ($scope.item.totalSkorNutrisi === 0) {
                $scope.item.obj[1901305222] = true;
            } else if ($scope.item.totalSkorNutrisi >= 1 && $scope.item.totalSkorNutrisi <= 4) {
                $scope.item.obj[1901305223] = true;
            } else if ($scope.item.totalSkorNutrisi === 5) {
                $scope.item.obj[1901305224] = true;
            }
        };

        // Watcher untuk memantau perubahan pada 4 pertanyaan gizi
        $scope.$watchGroup([
            'item.obj[1901305215]', 
            'item.obj[1901305217]', 
            'item.obj[1901305219]', 
            'item.obj[1901305221]'
        ], function(newValues) {
            $scope.kalkulasiStrongKids();
        });
        // -----------------------------------------------------------

    }
])
})