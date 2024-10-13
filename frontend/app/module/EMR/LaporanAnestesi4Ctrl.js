define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanAnestesi4Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state',
        'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, FormGroup, FormArray, FormBuilder) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            var norec_Emr = ''
            var norec_Emr2 = ''
            var norec_apd = ''
            $scope.cc.emrfk = 520
            var dataLoad = []
            $scope.item = {};
            $scope.model = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            $scope.isKembali = true
            var paramSearch = ''
            $scope.noemr = ''
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
            $scope.istempatLaporan = true;
            LoadCacheHelper();
            LoadCombo();
            getApd();

            function LoadCombo() {
                debugger;
                medifirstService.get("emr/get-combo").then(function (dat) {
                    $scope.listDokterBedah = dat.data.dokter
                    $scope.listAsistenBedah = dat.data.pegawaiAll
                    $scope.listDokterAnestesi = dat.data.dokter
                    $scope.listPerawatAnestesi = dat.data.perawat
                    $scope.listAdaTidak = dat.data.adaTidak
                    $scope.listSedasi = dat.data.sedasi
                    $scope.listAnestesi = dat.data.anestesi
                    $scope.listTeknik = dat.data.teknik
                    $scope.listYaTidak = dat.data.yatidak
                    $scope.listLetak = dat.data.letak
                    $scope.listAirway = dat.data.airway
                    $scope.listKeadaan = dat.data.keadaan
                    $scope.listJenisKelamin = dat.data.jeniskelamin
                    $scope.listKesadaran = dat.data.kesadaran
                    $scope.listDibantu = dat.data.dibantu
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
            }

            function LoadCacheHelper() {
                debugger;
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
                    $scope.cc.tgllahir = chacePeriode[14]
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                    // medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + $scope.cc.norec_pd, true).then(function (dat) {debugger
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
                    init2()
                    init3()
                    $scope.visible = true
                    $scope.myVar = 2
                    GridColumnLoad();
                    GridColumnLoad2();
                    // FormLoad()
                }
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporananestesi", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
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
                        $scope.cc.emrfk = '520'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        debugger
                        var grid = $("#kGrid").data("kendoGrid");
                        $(grid.tbody).on("click", "td", function (e) {
                            var row = $(this).closest("tr");
                            var colIdx = $("td", row).index(this);
                            $scope.selectedData = grid.dataItem(row);
                            if (colIdx >= 1) {
                                var colDateIdx = colIdx - 1;
                                var columns = grid.options.columns[colDateIdx].title;
                                debugger;
                                var field = grid.options.columns[colDateIdx].field;
                                var datas = {
                                    judulatas: columns,
                                    judulsamping: $scope.selectedData.desc,
                                    group: $scope.selectedData.group,
                                    field: field
                                };
                                data_head.push(datas);

                                if ($scope.selectedData.group == "1. SUHU" || $scope.selectedData.group == "2. TENSI" || $scope.selectedData.group == "3. PERNAFASAN" || $scope.selectedData.group == "4. NADI") {
                                    $scope.vitalSigns = true;
                                } else {
                                    $scope.vitalSigns = false;
                                }
                                $scope.showDetail(data_head, $scope.selectedData);
                            }
                        });

                        debugger
                        var grid2 = $("#kGrid2").data("kendoGrid");
                        $(grid2.tbody).on("click", "td", function (e) {
                            var row2 = $(this).closest("tr");
                            var colIdx2 = $("td", row2).index(this);
                            $scope.selectedData2 = grid2.dataItem(row2);
                            if (colIdx2 >= 1) {
                                var colDateIdx = colIdx2 - 1;
                                var columns = grid2.options.columns[colDateIdx].title;
                                debugger;
                                var field = grid2.options.columns[colDateIdx].field;
                                var datas = {
                                    judulatas: columns,
                                    judulsamping: $scope.selectedData2.desc,
                                    group: $scope.selectedData2.group,
                                    field: field
                                };
                                data_head2.push(datas);

                                if ($scope.selectedData2.group == "1. SUHU" || $scope.selectedData2.group == "2. TENSI" || $scope.selectedData2.group == "3. PERNAFASAN" || $scope.selectedData2.group == "4. NADI") {
                                    $scope.vitalSigns = true;
                                } else {
                                    $scope.vitalSigns = false;
                                }
                                $scope.showDetail2(data_head2, $scope.selectedData2);
                            }
                        });
                    }
                });

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
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "405") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], anestesi: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "404") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], sedasi: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "378") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "377") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "376") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "375") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "374") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "373") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], adatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "368") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "367") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "366") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "365") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "460") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], teknik: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "465") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], yatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "468") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], yatidak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "470") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], letak: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "471") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], airway: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "472") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], keadaan: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "473") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], jeniskelamin: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "478") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], kesadaran: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "682") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "784") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], dibantu: str }

                                }
                            }

                        }

                    })
                    //disini
                    // $scope.onDataBound = function (e) {
                    debugger
                    var grid = $("#kGrid").data("kendoGrid");
                    $(grid.tbody).on("click", "td", function (e) {
                        var row = $(this).closest("tr");
                        var colIdx = $("td", row).index(this);
                        $scope.selectedData = grid.dataItem(row);
                        if (colIdx >= 1) {
                            var colDateIdx = colIdx - 1;
                            var columns = grid.options.columns[colDateIdx].title;
                            debugger;
                            var field = grid.options.columns[colDateIdx].field;
                            var datas = {
                                judulatas: columns,
                                judulsamping: $scope.selectedData.desc,
                                group: $scope.selectedData.group,
                                field: field
                            };
                            data_head.push(datas);

                            if ($scope.selectedData.group == "1. SUHU" || $scope.selectedData.group == "2. TENSI" || $scope.selectedData.group == "3. PERNAFASAN" || $scope.selectedData.group == "4. NADI") {
                                $scope.vitalSigns = true;
                            } else {
                                $scope.vitalSigns = false;
                            }
                            $scope.showDetail(data_head, $scope.selectedData);
                        }
                    });

                    debugger
                    var grid2 = $("#kGrid2").data("kendoGrid");
                    $(grid2.tbody).on("click", "td", function (e) {
                        var row2 = $(this).closest("tr");
                        var colIdx2 = $("td", row2).index(this);
                        $scope.selectedData2 = grid2.dataItem(row2);
                        if (colIdx2 >= 1) {
                            var colDateIdx = colIdx2 - 1;
                            var columns = grid2.options.columns[colDateIdx].title;
                            debugger;
                            var field = grid2.options.columns[colDateIdx].field;
                            var datas = {
                                judulatas: columns,
                                judulsamping: $scope.selectedData2.desc,
                                group: $scope.selectedData2.group,
                                field: field
                            };
                            data_head2.push(datas);

                            if ($scope.selectedData2.group == "1. SUHU" || $scope.selectedData2.group == "2. TENSI" || $scope.selectedData2.group == "3. PERNAFASAN" || $scope.selectedData2.group == "4. NADI") {
                                $scope.vitalSigns = true;
                            } else {
                                $scope.vitalSigns = false;
                            }
                            $scope.showDetail2(data_head2, $scope.selectedData2);
                        }
                    });
                    // }
                }
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
            function init2() {
                datana = [{
                    'group': '1. SUHU',
                    'desc': '33',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '34',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '35',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '36',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '37',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '38',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '39',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '41',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '42',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '43',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                // {
                //     'group': 'SUHU', 'desc': '170', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '160', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '150', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '140', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '130', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '120', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '110', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '100', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '90', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '80', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '70', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '60', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '50', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '40', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '30', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '20', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '10', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                // {
                //     'group': 'SUHU', 'desc': '0', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                //     'c400': '', 'c500': '', 'c600': ''
                // },
                {
                    'group': '2. TENSI',
                    'desc': '6',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },

                {
                    'group': '2. TENSI',
                    'desc': '12',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '18',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '24',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '30',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '36',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '42',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '48',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '54',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '66',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '20',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '80',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '100',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '120',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '140',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '160',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '180',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '200',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '220',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '20',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '80',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '100',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '120',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '140',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '160',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '180',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '200',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '220',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'MAKAN MINUM', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'N.G.T', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'OBAT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'IVFD : 1', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'IVFD : 2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': 'IVFD : 3', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '5. INTAKE', 'desc': '1 Jam/KUMULATIF', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'URINE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'NGT/DARAH +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'BAB/DARAH +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'DRAIN : 1', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'DRAIN :2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'INSENSIBLE LOSS', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '6. OUTPUT', 'desc': 'SHIFT TOTAL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'PH', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'PA CO2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'PA O2', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'BE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'H CO3', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'C2 SAT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'K', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'NA/CL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'CREATININE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'BUN/UREUM', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'GLUCOSE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'HB/HT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'LEUCOCYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'ALB/GLOB', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'THROMBOCYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'BIL DIRECT/inputTindakanDokter', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'CA/', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : BD/NA', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : PROT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : RED/ACETON', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : CREATININE', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'URINE : LEUCO/ERYT', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'LP : N +-/P +-', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // },
                    // {
                    //     'group': '7. DATA LABORATORIUM', 'desc': 'LP : SEL', 'c700': '', 'c800': '', 'c900': '', 'c1000': '', 'c1100': '', 'c1200': '', 'c1300': '', 'c1400': '', 'c1500': '', 'c1600': '',
                    //     'c1700': '', 'c1800': '', 'c1900': '', 'c2000': '', 'c2100': '', 'c2200': '', 'c2300': '', 'c2400': '', 'c100': '', 'c200': '', 'c300': '',
                    //     'c400': '', 'c500': '', 'c600': ''
                    // }

                ];

                // GridColumnLoad();
                $scope.data1 = new kendo.data.DataSource({
                    data: datana,
                    total: datana,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
            }

            function init3() {
                datana2 = [{
                    'group': '1. SUHU',
                    'desc': '33',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '34',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '35',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '36',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '37',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '38',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '39',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '41',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '42',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '1. SUHU',
                    'desc': '43',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },

                {
                    'group': '2. TENSI',
                    'desc': '6',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },

                {
                    'group': '2. TENSI',
                    'desc': '12',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '18',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '24',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '30',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '36',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '42',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '48',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '54',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '2. TENSI',
                    'desc': '66',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '20',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '80',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '100',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '120',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '140',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '160',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '180',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '200',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '3. PERNAFASAN',
                    'desc': '220',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '20',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '40',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '60',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '80',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '100',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '120',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '140',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '160',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '180',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '200',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },
                {
                    'group': '4. NADI',
                    'desc': '220',
                    'c700': '',
                    'c800': '',
                    'c900': '',
                    'c1000': '',
                    'c1100': '',
                    'c1200': '',
                    'c1300': '',
                    'c1400': '',
                    'c1500': '',
                    'c1600': '',
                    'c1700': '',
                    'c1800': '',
                    'c1900': '',
                    'c2000': '',
                    'c2100': '',
                    'c2200': '',
                    'c2300': '',
                    'c2400': '',
                    'c100': '',
                    'c200': '',
                    'c300': '',
                    'c400': '',
                    'c500': '',
                    'c600': ''
                },

                ];

                // GridColumnLoad();
                $scope.data2 = new kendo.data.DataSource({
                    data: datana2,
                    total: datana2,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
            }

            function GridColumnLoad2() {
                $scope.group = {
                    field: "group"
                };

                $scope.columnData2 = {
                    selectable: 'cell',
                    pageable: true,
                    dataBound: $scope.onDataBound,
                    columns: [{
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
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c800",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c900",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1000",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1500",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1600",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1700",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1800",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1900",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2000",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c500",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c600",
                        "title": " ",
                        "width": "50px"
                    }
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
                    columns: [{
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
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c800",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c900",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1000",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1500",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1600",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1700",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1800",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c1900",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2000",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c2400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c100",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c200",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c300",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c400",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c500",
                        "title": " ",
                        "width": "50px"
                    },
                    {
                        "field": "c600",
                        "title": " ",
                        "width": "50px"
                    }
                    ]
                };
            }
            // $scope.onDataBound = function (e) {
            //     debugger
            //     var grid = $("#kGrid").data("kendoGrid");
            //     $(grid.tbody).on("click", "td", function (e) {
            //         var row = $(this).closest("tr");
            //         var colIdx = $("td", row).index(this);
            //         $scope.selectedData = grid.dataItem(row);
            //         if (colIdx >= 1) {
            //             var colDateIdx = colIdx - 1;
            //             var columns = grid.options.columns[colDateIdx].title;
            //             var field = grid.options.columns[colDateIdx].field;
            //             var datas = {
            //                 judulatas: columns,
            //                 judulsamping: $scope.selectedData.desc,
            //                 group: $scope.selectedData.group,
            //                 field: field
            //             };
            //             data_head.push(datas);

            //             if ($scope.selectedData.group == "1. VITAL SIGNS") {
            //                 $scope.vitalSigns = true;
            //             } else {
            //                 $scope.vitalSigns = false;
            //             }
            //             $scope.showDetail(data_head, $scope.selectedData);
            //         }
            //     });
            // }
            $scope.showDetail = function (data_head, selectedData) {
                debugger;
                if (data_head.length > 0) {
                    var getlastdata = data_head.length - 1
                    $scope.item.GroupHeader = data_head[getlastdata].group;
                    $scope.item.Deskripsi = data_head[getlastdata].judulsamping;
                    $scope.item.JamInput = data_head[getlastdata].judulatas;
                    for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                        for (var j = 0; j < data_head.length; j++) {
                            if (data_head[getlastdata].group == "1. SUHU" || data_head[getlastdata].group == "2. TENSI" || data_head[getlastdata].group == "3. PERNAFASAN" || data_head[getlastdata].group == "4. NADI") {
                                $scope.SistoleChart = true;
                                $scope.NonSistoleChart = false;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        var isi = $scope.selectedData[Object.keys($scope.selectedData)[i]].split(" ");
                                        // var isiCombo = isi[1].split(" ");
                                        medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {
                                            debugger
                                            var datas = dat.data.data_riwayat;
                                            for (var i = 0; i < datas.length; i++) {
                                                if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
                                                    if (datas[i].objectvitalsigns == 1) {
                                                        datas[i].simbol = "⮟";
                                                    } else if (datas[i].objectvitalsigns == 2) {
                                                        datas[i].simbol = "⮝";
                                                    } else if (datas[i].objectvitalsigns == 3) {
                                                        datas[i].simbol = "●";
                                                    } else if (datas[i].objectvitalsigns == 4) {
                                                        datas[i].simbol = "▲";
                                                    }
                                                    $scope.item.VSigns = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
                                                }
                                            }
                                            $scope.item.Isian = isi[1]
                                        });
                                    }
                                }
                            } else {
                                $scope.SistoleChart = false;
                                $scope.NonSistoleChart = true;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        $scope.item.Isian = $scope.selectedData[Object.keys($scope.selectedData)[i]]
                                    }
                                }
                            }
                        }
                    }
                    $scope.PopUpDetailPeserta.center().open();
                } else {
                    $scope.PopUpDetailPeserta.center().open();
                }

            }
            $scope.showDetail2 = function (data_head2, selectedData2) {
                debugger;
                if (data_head2.length > 0) {
                    var getdataterakhir = data_head2.length - 1
                    $scope.item.GroupHeader2 = data_head2[getdataterakhir].group;
                    $scope.item.Deskripsi2 = data_head2[getdataterakhir].judulsamping;
                    $scope.item.JamInput2 = data_head2[getdataterakhir].judulatas;
                    for (var i = 0; i < Object.keys($scope.selectedData2).length; i++) {
                        for (var j = 0; j < data_head2.length; j++) {
                            if (data_head2[getdataterakhir].group == "1. SUHU" || data_head2[getdataterakhir].group == "2. TENSI" || data_head2[getdataterakhir].group == "3. PERNAFASAN" || data_head2[getdataterakhir].group == "4. NADI") {
                                $scope.SistoleChart = true;
                                $scope.NonSistoleChart = false;
                                if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
                                    if ($scope.selectedData2[Object.keys($scope.selectedData2)[i]] != "") {
                                        var isi = $scope.selectedData2[Object.keys($scope.selectedData2)[i]].split(" ");
                                        // var isiCombo = isi[1].split(" ");
                                        medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {
                                            debugger
                                            var datas = dat.data.data_riwayat;
                                            for (var i = 0; i < datas.length; i++) {
                                                if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
                                                    if (datas[i].objectvitalsigns == 1) {
                                                        datas[i].simbol = "⮟";
                                                    } else if (datas[i].objectvitalsigns == 2) {
                                                        datas[i].simbol = "⮝";
                                                    } else if (datas[i].objectvitalsigns == 3) {
                                                        datas[i].simbol = "●";
                                                    } else if (datas[i].objectvitalsigns == 4) {
                                                        datas[i].simbol = "▲";
                                                    }
                                                    $scope.item.VSigns2 = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
                                                }
                                            }
                                            $scope.item.Isian2 = isi[1]
                                        });
                                    }
                                }
                            } else {
                                $scope.SistoleChart = false;
                                $scope.NonSistoleChart = true;
                                if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
                                    if ($scope.selectedData2[Object.keys($scope.selectedData2)[i]] != "") {
                                        $scope.item.Isian2 = $scope.selectedData2[Object.keys($scope.selectedData2)[i]]
                                    }
                                }
                            }
                        }
                    }
                    $scope.PopUpDetailPeserta2.center().open();
                } else {
                    $scope.PopUpDetailPeserta2.center().open();
                }

            }
            $scope.tambah = function () {
                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head[0].group == "1. SUHU" && $scope.item.VSigns == undefined) {
                    toastr.warning('Vital Signs harus diisi, Peringatan!')
                    return;
                }

                var vital = null;
                if ($scope.item.VSigns != undefined) {
                    vital = $scope.item.VSigns.id
                }
                debugger;
                for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                    for (var j = 0; j < data_head.length; j++) {
                        if (data_head[0].group == "1. SUHU" || data_head[0].group == "2. TENSI" || data_head[0].group == "3. PERNAFASAN" || data_head[0].group == "4. NADI") {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.VSigns.simbol + " " + $scope.item.Isian
                                $scope.label = $scope.item.VSigns.simbol + " " + data_head[0].judulsamping
                                data_head[0].judulatas = moment($scope.item.JamInput).format('HH:mm')
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital
                                }
                                data_Save.push(datas);
                                var isis = {
                                    jenisintra: data_head[0].group,
                                    labelintra: $scope.item.VSigns.simbol + " " + data_head[0].judulsamping,
                                    nilaiintra: data_head[0].judulsamping,
                                    tanggalintra: data_head[0].judulatas,
                                    jenispasca: " ",
                                    labelpasca: " ",
                                    nilaipasca: "",
                                    tanggalpasca: " ",
                                }
                                data_Intra.push(isis);
                            }
                        } else {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.Isian
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital,
                                    label: $scope.label
                                }
                                data_Save.push(datas);
                            }
                        }
                    }
                }
                kosongkeun()
                $scope.PopUpDetailPeserta.close();
            }
            $scope.tambah2 = function () {
                if (data_head2.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head2.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head2[0].group == "1. SUHU" && $scope.item.VSigns2 == undefined) {
                    toastr.warning('Vital Signs harus diisi, Peringatan!')
                    return;
                }

                var vital = null;
                if ($scope.item.VSigns2 != undefined) {
                    vital = $scope.item.VSigns2.id
                }
                debugger;
                for (var i = 0; i < Object.keys($scope.selectedData2).length; i++) {
                    for (var j = 0; j < data_head2.length; j++) {
                        if (data_head2[0].group == "1. SUHU" || data_head2[0].group == "2. TENSI" || data_head2[0].group == "3. PERNAFASAN" || data_head2[0].group == "4. NADI") {
                            if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
                                $scope.selectedData2[Object.keys($scope.selectedData2)[i]] = $scope.item.VSigns2.simbol + " " + $scope.item.Isian2
                                $scope.label2 = $scope.item.VSigns2.simbol + " " + data_head2[0].judulsamping
                                data_head2[0].judulatas = moment($scope.item.JamInput2).format('HH:mm')
                                var datas = {
                                    column: data_head2[0].judulatas,
                                    desc: data_head2[0].judulsamping,
                                    group: data_head2[0].group,
                                    field: data_head2[0].field,
                                    keteranganobservasi: $scope.selectedData2[Object.keys($scope.selectedData2)[i]],
                                    vitalsigns: vital
                                }
                                data_Save2.push(datas);
                                var isis = {
                                    jenisintra: " ",
                                    labelintra: " ",
                                    nilaiintra: "",
                                    tanggalintra: " ",
                                    jenispasca: data_head2[0].group,
                                    labelpasca: $scope.item.VSigns2.simbol + " " + data_head2[0].judulsamping,
                                    nilaipasca: data_head2[0].judulsamping,
                                    tanggalpasca: data_head2[0].judulatas,
                                }
                                data_Pasca.push(isis);
                            }
                        } else {
                            if (data_head2[j].field == Object.keys($scope.selectedData2)[i]) {
                                $scope.selectedData2[Object.keys($scope.selectedData2)[i]] = $scope.item.Isian2
                                var datas = {
                                    column: data_head2[0].judulatas,
                                    desc: data_head2[0].judulsamping,
                                    group: data_head2[0].group,
                                    field: data_head2[0].field,
                                    keteranganobservasi: $scope.selectedData2[Object.keys($scope.selectedData2)[i]],
                                    vitalsigns: vital,
                                }
                                data_Save2.push(datas);
                            }
                        }
                    }
                }
                kosongkeun2()
                $scope.PopUpDetailPeserta2.close();
            }

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

            function getApd() {
                medifirstService.get('emr/get-apd?' + "norec_pd=" + $scope.cc.norec_pd + "&ruangan=" + $scope.cc.objectruanganfk).then(function (dat) {
                    debugger;
                    norec_apd = dat.data[0].norec
                    getRmi();
                    getRmi2();
                })
            }

            function getRmi() {
                // debugger;
                medifirstService.get('emr/get-rmi?' + "norec_pd=" + $scope.cc.norec_pd + "&jenisemr=intra").then(function (dat) {
                    debugger;
                    if (dat.data.Data.length > 0) {
                        norec_Emr = dat.data.Data[0].norec
                        getHistoryRmi();
                        getIntraAnestesi();

                    } else {
                        norec_Emr = ''
                    }
                })
            }

            function getRmi2() {
                // debugger;
                medifirstService.get('emr/get-rmi?' + "norec_pd=" + $scope.cc.norec_pd + "&jenisemr=pasca").then(function (dat) {
                    debugger;
                    if (dat.data.Data.length > 0) {
                        norec_Emr2 = dat.data.Data[0].norec
                        getHistoryRmi2();
                        getPascaAnestesi();
                    } else {
                        norec_Emr2 = ''
                    }
                })
            }

            function getHistoryRmi() {
                $scope.visible = true
                // norec_Emr = $scope.dataSelected.norec;
                GridColumnLoad();
                medifirstService.get("emr/get-data-detail-emr-icu?NorecRmi=" + norec_Emr, true).then(function (dat) {
                    debugger
                    var Data = dat.data.Details;
                    debugger;

                    for (var i = 0; i < Data.length; i++) {

                        var vital = null;
                        // if (Data.[i].group == '1. VITAL SIGNS') {
                        //     vital = $scope.item.VSigns.id
                        // }
                        var datas = {
                            column: Data[i].jam,
                            desc: Data[i].column,
                            group: Data[i].group,
                            field: Data[i].field,
                            keteranganobservasi: Data[i].nilaiobservasi,
                            vitalsigns: vital
                        }
                        data_Save.push(datas);
                    }
                    debugger
                    var Datas = $scope.data1._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }
                });
            }

            function getHistoryRmi2() {
                $scope.visible = true
                // norec_Emr = $scope.dataSelected.norec;
                GridColumnLoad2();
                medifirstService.get("emr/get-data-detail-emr-icu?NorecRmi=" + norec_Emr2, true).then(function (dat) {
                    debugger
                    var Data = dat.data.Details;
                    debugger;

                    for (var i = 0; i < Data.length; i++) {

                        var vital = null;
                        // if (Data.[i].group == '1. VITAL SIGNS') {
                        //     vital = $scope.item.VSigns.id
                        // }
                        var datas = {
                            column: Data[i].jam,
                            desc: Data[i].column,
                            group: Data[i].group,
                            field: Data[i].field,
                            keteranganobservasi: Data[i].nilaiobservasi,
                            vitalsigns: vital
                        }
                        data_Save2.push(datas);
                    }
                    debugger
                    var Datas = $scope.data2._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }
                });
            }

            function getIntraAnestesi() {
                medifirstService.get('emr/get-history-intra-anestesi?' + "noregistrasifk=" + norec_Emr).then(function (dat) {
                    debugger
                    var isi = dat.data
                    if (isi.length > 0) {
                        for (var i = 0; i < isi.length; i++) {
                            var isi2 = {
                                jenisintra: isi[i].jenisintra,
                                labelintra: isi[i].labelintra,
                                nilaiintra: isi[i].nilaiintra,
                                tanggalintra: isi[i].tanggalintra,
                                jenispasca: isi[i].jenispasca,
                                labelpasca: isi[i].labelpasca,
                                nilaipasca: isi[i].nilaipasca,
                                tanggalpasca: isi[i].tanggalpasca
                            }
                            data_Intra.push(isi2);
                        }
                    } else {

                    }
                })
            }

            function getPascaAnestesi() {
                medifirstService.get('emr/get-history-pasca-anestesi?' + "norecemr=" + norec_Emr2).then(function (dat) {
                    debugger
                    var isi = dat.data
                    if (isi.length > 0) {
                        for (var i = 0; i < isi.length; i++) {
                            var isi3 = {
                                jenisintra: isi[i].jenisintra,
                                labelintra: isi[i].labelintra,
                                nilaiintra: isi[i].nilaiintra,
                                tanggalintra: isi[i].tanggalintra,
                                jenispasca: isi[i].jenispasca,
                                labelpasca: isi[i].labelpasca,
                                nilaipasca: isi[i].nilaipasca,
                                tanggalpasca: isi[i].tanggalpasca
                            }
                            data_Pasca.push(isi3);
                        }
                    } else {

                    }
                })
            }
            $scope.Simpan = function () {
                debugger;
                if (data_Save.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                var objSave = {
                    norec: norec_Emr,
                    norec_apd: norec_apd,
                    noregistrasi: $scope.cc.noregistrasi,
                    tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                    details: data_Save, //$scope.data1._data
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
                debugger;
                if (data_Save2.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                var objSave = {
                    norec: norec_Emr2,
                    norec_apd: norec_apd,
                    noregistrasi: $scope.cc.noregistrasi,
                    tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                    details: data_Save2, //$scope.data1._data
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
                debugger
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 405) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].anestesi })
                    } else if (arrobj[i] == 404) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].sedasi })
                    } else if (arrobj[i] == 378) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 377) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 376) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 375) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 374) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 373) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].adatidak })
                    } else if (arrobj[i] == 368) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 367) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 366) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 365) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 460) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].teknik })
                    } else if (arrobj[i] == 465) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].yatidak })
                    } else if (arrobj[i] == 468) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].yatidak })
                    } else if (arrobj[i] == 470) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].letak })
                    } else if (arrobj[i] == 471) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].airway })
                    } else if (arrobj[i] == 472) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].keadaan })
                    } else if (arrobj[i] == 473) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].jeniskelamin })
                    } else if (arrobj[i] == 478) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].kesadaran })
                    } else if (arrobj[i] == 682) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 369) {
                        arrSave.push({ id: arrobj[i], values: moment($scope.item.obj[parseInt(arrobj[i])]).format('DD-MM-YYYY HH:mm') })
                    } else if (arrobj[i] == 671) {
                        arrSave.push({ id: arrobj[i], values: moment($scope.item.obj[parseInt(arrobj[i])]).format('DD-MM-YYYY HH:mm') })
                    } else if (arrobj[i] == 784) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].dibantu })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                if (totalcost.value != "") {
                    arrSave.push({ id: "683", values: totalcost.value })
                }
                if (totalcost2.value != "") {
                    arrSave.push({ id: "684", values: totalcost2.value })
                }
                if (totalcost3.value != "") {
                    arrSave.push({ id: "685", values: totalcost3.value })
                }
                if (totalcost4.value != "") {
                    arrSave.push({ id: "686", values: totalcost4.value })
                }
                if (totalcost5.value != "") {
                    arrSave.push({ id: "687", values: totalcost5.value })
                }
                if (totalcost6.value != "") {
                    arrSave.push({ id: "688", values: totalcost6.value })
                }
                if (totalcost7.value != "") {
                    arrSave.push({ id: "689", values: totalcost7.value })
                }
                if (totalcost8.value != "") {
                    arrSave.push({ id: "690", values: totalcost8.value })
                }
                if (totalcost9.value != "") {
                    arrSave.push({ id: "691", values: totalcost9.value })
                }
                if (totalcost10.value != "") {
                    arrSave.push({ id: "692", values: totalcost10.value })
                }
                if (totalcost11.value != "") {
                    arrSave.push({ id: "693", values: totalcost11.value })
                }
                if (totalcost12.value != "") {
                    arrSave.push({ id: "694", values: totalcost12.value })
                }
                if (totalcost13.value != "") {
                    arrSave.push({ id: "695", values: totalcost13.value })
                }
                if (totalcost14.value != "") {
                    arrSave.push({ id: "696", values: totalcost14.value })
                }
                if (totalcost15.value != "") {
                    arrSave.push({ id: "697", values: totalcost15.value })
                }
                if (totalcost16.value != "") {
                    arrSave.push({ id: "698", values: totalcost16.value })
                }
                if (totalcost17.value != "") {
                    arrSave.push({ id: "699", values: totalcost17.value })
                }
                if (totalcost18.value != "") {
                    arrSave.push({ id: "700", values: totalcost18.value })
                }
                $scope.cc.jenisemr = 'laporananestesi'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) { })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) { })
                    init()
                    init2()
                    init3()
                    //     init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.kembali = function () {
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.cetakPdf = function () {
                debugger
                if (nomorEMR == '') return
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


                debugger
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
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/laporananestesi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/laporananestesi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/laporananestesi.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/laporananestesi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporananestesi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
        }
    ])
})