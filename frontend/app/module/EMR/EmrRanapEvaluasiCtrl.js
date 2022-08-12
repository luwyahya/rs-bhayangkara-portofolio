define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EmrRanapEvaluasiCtrl', ['$q', 'SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($q, saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {

            // initialize.controller('TransaksiPelayananApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
            //     function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
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
            var paramSearch = ''
            $scope.user = {};
            $scope.istempatLaporan = true;
            $scope.datax = '';
            var tempnorec = '';
            var tempnorecpp = '';
            var abus = true;
            LoadCacheHelper();
            // tambahan
            var datalabstat = []
            var datalab = []
            var datalabs = []
            var popc = true;
            var umurDay = '';
            var tglpelayanan = ''
            var norecAPD = ''
            var norecPP = ''
            var tglhasil = ''
            var tglcetak = ''
            var ruangan = ''
            var ruanganasal = ''
            var dokterpemeriksa = ''
            var dokterpengirim = ''
            $scope.data = {
                namez: [{
                    keterangan: ''
                }],
            };

            $scope.tinggiDiagnosa = 545



            function LoadCacheHelper() {
                debugger
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

                loadDaftarRmPp($scope.cc.noregistrasi);
                // debugger
                // $scope.item.obj[230] = temp_labo
                $scope.isRouteLoading = true
                // var dokter =[];
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                loaddata();




                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=emrranapevaluasi", true).then(function (dat) {

                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheEmrIgd', undefined)
                    // debugger
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        debugger
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '517'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        debugger
                        $scope.user.poto = "data:image/jpg;base64,zC"
                        $scope.item.obj = []
                        $scope.item.obj2 = []
                        $scope.item.obj[68] = $scope.now
                        $scope.item.obj[225] = "Riwayat Penyakit Keluarga : \nPekerjaan : \nSosial Ekonomi : \nKejiwaan dan Kebiasaan : "
                        // $scope.item.obj[217] = "Diagnosa Utama : \nDiagnosa Sekunder : \nDIAGNOSA : \nMASALAH MEDIS : "
                        $scope.item.obj[217] = "Keluhan Utama :"
                        // $scope.item.obj[222] = "Laboratorium : \nRadiologi : \nLain-lain : \nExtremitas : "
                        $scope.item.obj[231] = "LAIN-LAIN : \nEKSTREMITAS : "
                        $scope.item.obj[343] = "TD : \nNadi : \nSuhu : \nPernafasan: \nCatatan: "
                        $scope.item.obj[223] = "KU : \nKES : \nGCS :        , E :        , M :        , V : \nTD :        , N :        , P :        , SO2 :        , T : \n\nKEPALA / LEHER : \n\nTHORAK : \n\nABDOMEN : \n\nEKSTREMITAS :";
                        $scope.item.obj[232] = "DIAGNOSA : "
                        $scope.item.obj[234] = "MASALAH MEDIS : "
                        medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                            // $scope.item.obj = []
                            $scope.item.obj[217] = dat.data.data[0].keluhanutama
                            $scope.item.obj[221] = dat.data.data[0].sekarang
                            $scope.item.obj[219] = dat.data.data[0].dahulu
                            $scope.item.obj[223] = dat.data.data[0].pemeriksaanfisik

                        })

                    }
                });






                function setobjectToModel(nomorEMRSS, emrfk) {

                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                        $scope.isLoading = false
                        var chekedd = false
                        $scope.item.obj = []
                        $scope.item.obj2 = []
                        $scope.item.obj[68] = $scope.now
                        $scope.item.obj[222] = "Laboratorium : \nRadiologi : \nLain-lain : \nExtremitas : "
                        $scope.item.obj[343] = "TD : \nNadi : \nSuhu : \nPernafasan: \nCatatan: "
                        $scope.item.obj[223] = "KU : \nKES : \nGCS :        , E :        , M :        , V : \nTD :        , N :        , P :        , SO2 :        , T : \n\nKEPALA / LEHER : \n\nTHORAK : \n\nABDOMEN : \n\nEKSTREMITAS :";

                        debugger
                        dataLoad = dat.data.data
                        if (dataLoad.length == 0) {
                            medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                                // $scope.item.obj = []
                                $scope.item.obj[217] = dat.data.data[0].keluhanutama
                                $scope.item.obj[221] = dat.data.data[0].sekarang
                                $scope.item.obj[219] = dat.data.data[0].dahulu
                                $scope.item.obj[223] = dat.data.data[0].pemeriksaanfisik
                            })
                        }


                        // penambahan untuk kondisi sekunder
                        $scope.data = {
                            sekunder: [],
                        };

                        var index = 1;

                        // $scope.isRouteLoading = false;

                        // if (index == 1) {
                        //     var name = {
                        //         kddiagnosa: {
                        //             id: null,
                        //             kdDiagnosa: ""
                        //         },
                        //         keterangan: "",
                        //         norec_diagnosapasien: "",
                        //         norec_apd: $scope.norecAPD,
                        //         objectjenisdiagnosafk: "",
                        //         tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                        //         iskasusbaru: 1,
                        //         iskasusulama: 0,
                        //         tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        //     };
                        //     if ($scope.data.names.length <= index + 1) {
                        //         $scope.data.names.splice(index + 1, 0, name);
                        //     }
                        // }


                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            debugger
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                                debugger
                                if (dataLoad[i].type == "textbox") {
                                    if (dataLoad[i].emrdfk == 229) {
                                        debugger
                                        $scope.data = {
                                            namez: [],
                                        };
                                        var indez = 1;
                                        var xx = dataLoad[i].value.split(" / ")
                                        // $scope.isRouteLoading = false;
                                        if (xx.length > 0) {
                                            // setRow();
                                            debugger
                                            for (var z = 0; z < xx.length; z++) {
                                                var name = {
                                                    keterangan: xx[z],
                                                    kddiagnosa: xx[z],
                                                };
                                                $scope.data.namez.splice(indez + 1, z, name);
                                                indez = indez + 1
                                                $scope.data.namez[z].kddiagnosa = {
                                                    kodeNama: xx[z]
                                                }
                                            }


                                            if (indez == 1) {
                                                var name = {
                                                    keterangan: '',
                                                    kddiagnosa: ''
                                                };
                                                if ($scope.data.namez.length <= indez + 1) {
                                                    $scope.data.namez.splice(indez + 1, 0, name);
                                                }
                                            }


                                        }

                                        $scope.listdiagnosasek = {
                                            kodeNama: dataLoad[i].value
                                        }
                                    } else {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    }

                                }
                                if (dataLoad[i].type == "checkbox") {
                                    chekedd = false
                                    if (dataLoad[i].value == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                    if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                        $scope.getSkalaNyeri(1, {
                                            descNilai: dataLoad[i].reportdisplay
                                        })
                                    }
                                    if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                        var datass = {
                                            id: dataLoad[i].emrdfk,
                                            descNilai: dataLoad[i].reportdisplay
                                        }
                                        $scope.getSkor2(datass)
                                    }
                                    if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                        var datass = {
                                            id: dataLoad[i].emrdfk,
                                            descNilai: dataLoad[i].reportdisplay
                                        }
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
                                if (dataLoad[i].type == "combobox") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = {
                                        value: res[0],
                                        text: res[1]
                                    }

                                }
                                if (dataLoad[i].type == "photo") {
                                    $scope.user.poto = dataLoad[i].value
                                }

                                // filter select
                                // if (dataLoad[i].emrdfk == 217) {
                                //     debugger
                                //     $scope.listdiagnosa = {
                                //         kodeNama: dataLoad[i].value
                                //     }
                                // }
                                if (dataLoad[i].emrdfk == 226) {
                                    debugger
                                    $scope.listdiagnosautama = {
                                        kodeNama: dataLoad[i].value
                                    }
                                }
                                var numms = 0;




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


                // Tambah select filteran 
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    debugger
                    $scope.listDiagnosa = data;
                });
            }

            function loaddata() {
                medifirstService.get("emr/get-laksana?jenis=obat&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                    for (var i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].ttddokter == null) {
                            var dataTemp = {
                                id: "-",
                                text: "-"
                            }
                        } else {
                            var dataTemp = {
                                id: dat.data.data[i].ttddokter,
                                text: dat.data.data[i].ttddokter
                            }

                        }
                        if (dat.data.data[i].ttdperawat == null) {
                            var dataTemp2 = {
                                id: "-",
                                text: "-"
                            }
                        } else {
                            var dataTemp2 = {
                                id: dat.data.data[i].ttdperawat,
                                text: dat.data.data[i].ttdperawat
                            }

                        }
                        dat.data.data[i].ttddokter = dataTemp;
                        dat.data.data[i].ttdperawat = dataTemp2;
                    }
                    $scope.dataGridobat = dat.data.data;
                    debugger
                    $scope.dataGridobat = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 2,

                        // total:data[0].data,

                        schema: {
                            model: {
                                fields: {
                                    waktu: {
                                        defaultValue: {
                                            text: 8,
                                            value: "Seafood"
                                        },
                                        editable: true,
                                        type: "string"
                                    },
                                    ttddokter: {
                                        defaultValue: {
                                            id: null,
                                            text: "--Pilih Pegawai"
                                        }
                                    },
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosis: {
                                        editable: true,
                                        type: "string"
                                    },
                                    carapemberian: {
                                        editable: true,
                                        type: "string"
                                    },
                                    waktupemberian: {
                                        editable: true,
                                        type: "string"
                                    },
                                    ttdperawat: {
                                        defaultValue: {
                                            id: null,
                                            text: "--Pilih Pegawai"
                                        }
                                    },
                                    Category: {
                                        defaultValue: {
                                            Text: 8,
                                            value: "Seafood"
                                        }
                                    },

                                }
                            }
                        }

                    });
                });
                medifirstService.get("emr/get-laksana?jenis=penunjang&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                    $scope.dataGridPenunjang = dat.data.data;
                    for (var i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].ttddokter == null) {
                            var dataTemp = {
                                id: "-",
                                text: "-"
                            }
                        } else {
                            var dataTemp = {
                                id: dat.data.data[i].ttddokter,
                                text: dat.data.data[i].ttddokter
                            }

                        }
                        if (dat.data.data[i].ttdperawat == null) {
                            var dataTemp2 = {
                                id: "-",
                                text: "-"
                            }
                        } else {
                            var dataTemp2 = {
                                id: dat.data.data[i].ttdperawat,
                                text: dat.data.data[i].ttdperawat
                            }

                        }
                        dat.data.data[i].ttddokter = dataTemp;
                        dat.data.data[i].ttdperawat = dataTemp2;
                    }
                    $scope.dataGridPenunjang = dat.data.data;
                    $scope.dataGridPenunjang = new kendo.data.DataSource({
                        data: dat.data.data,

                        // total:data[0].data,

                        schema: {
                            model: {
                                fields: {
                                    waktu: {
                                        editable: true,
                                        type: "string"
                                    },
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    waktupemberian: {
                                        editable: true,
                                        type: "string"
                                    },
                                    catatan: {
                                        editable: true,
                                        type: "string"
                                    },
                                    ttddokter: {
                                        defaultValue: {
                                            id: null,
                                            text: "--Pilih Pegawai"
                                        }
                                    },

                                }
                            }
                        }

                    });
                });
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
            $scope.cetakPdfold = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-traseprimer&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }

            function getDate(xx) {
                const yyyy = xx.getFullYear()
                let mm = xx.getMonth() + 1 // Months start at 0!
                let dd = xx.getDate()
                let hh = xx.getHours()
                let m = xx.getMinutes()
                let ss = xx.getSeconds()

                if (dd < 10) dd = '0' + dd
                if (mm < 10) mm = '0' + mm

                return dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + m + ':' + ss
            }

            function sendToArray(x) {
                debugger
                var str = x.value.split('/')
                // var zz = 
                return str.length
                // if (data.data.datas.length > 0) {
                //     // setRow();
                //     debugger
                //     for (var i = 0; i < data.data.datas.length; i++) {
                //         if (data.data.datas[i].objectjenisdiagnosafk == 1) {
                //             if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                //                 var name = {
                //                     kddiagnosa: {
                //                         id: data.data.datas[i].id,
                //                         kdDiagnosa: data.data.datas[i].kddiagnosa
                //                     },
                //                     keterangan: data.data.datas[i].keterangan,
                //                     norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                //                     norec_apd: data.data.datas[i].norec_apd,
                //                     objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                //                     tglregistrasi: $scope.tglregistrasi,
                //                     iskasusbaru: 1,
                //                     iskasusulama: 0,
                //                     tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                //                 };
                //             } else {
                //                 var name = {
                //                     kddiagnosa: {
                //                         id: data.data.datas[i].id,
                //                         kdDiagnosa: data.data.datas[i].kddiagnosa
                //                     },
                //                     keterangan: data.data.datas[i].namadiagnosa,
                //                     norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                //                     norec_apd: data.data.datas[i].norec_apd,
                //                     objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                //                     tglregistrasi: $scope.tglregistrasi,
                //                     iskasusbaru: 1,
                //                     iskasusulama: 0,
                //                     tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                //                 };
                //             }
                //             $scope.data.names.splice(index + 1, i, name);
                //             index = index + 1
                //         } 
                //     }
                // }
            }

            $scope.cetakPdf = function () {
                var xx = $scope.now




                // debugger
                // return
                // var d = $scope.cc.tglregistrasi.split(" ");
                // var date = d[0]
                // var time = d[1]
                debugger
                var count = 0
                if (nomorEMR == '') return
                // var base64 = $scope.user.poto.substring(22);
                var base64 = "";
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 67; i <= 360 - 1; i++) {
                    arrPush.push({
                        emrdfk: i.toString(),
                        value: ""
                    })
                }

                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                if (dataLoad[i].type == "combobox") {
                                    debugger
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    arrPush[x].value = res[1]

                                } else {
                                    arrPush[x].value = dataLoad[i].value
                                }
                                if (dataLoad[i].emrdfk == 229) {
                                    // debugger
                                    count++
                                    // var str = dataLoad[i].value
                                    // var res = getDate(str)
                                    // arrPush[x].value = res


                                }

                            }
                            // if (arrPush[x].emrdfk == '') {
                            //     if (dataLoad[i].type == "combobox") {
                            //         debugger
                            //         var str = dataLoad[i].value
                            //         var res = str.split("~");
                            //         arrPush[x].value = res[1]

                            //     } else {
                            //         arrPush[x].value = dataLoad[i].value
                            //     }

                            // }
                            // 228
                        }
                    }

                }
                debugger
                // alert(count)
                // return
                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "norm", "umur", "jeniskelamin", "namapasien", "test", "nomorEMR", "dataLoad", "namaruangan", "tglregistrasi", "tglsekarang"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap, $scope.cc.noregistrasi, $scope.cc.nocm, $scope.cc.umur, $scope.cc.jeniskelamin, $scope.cc.namapasien, base64, nomorEMR, arrPush, $scope.cc.namaruangan, $scope.cc.tglregistrasi, $scope.now],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                //     xhr.open('POST', 'http://192.168.0.62:1002/generic/report/evaluasiranap.pdf');
                // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/evaluasiranap.pdf');
                // } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiranap.pdf');
                // } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiranap.pdf');
                // } else {
                //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiranap.pdf');
                // }
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiranap.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/evaluasiranap.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }



            $scope.cetakPdf2 = function () {
                debugger;
                if (nomorEMR == '') return
                var base64 = "";
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 0; i <= 150 - 1; i++) {
                    arrPush.push({
                        emrdfk: i.toString(),
                        value: ""
                    })
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
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "test", "nomorEMR", "dataLoad"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap, $scope.cc.nocm, base64, nomorEMR, arrPush],
                    "paramType": ["", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/emrigd2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/emrigd2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/emrigd2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/emrigd2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
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
            $scope.baruPopUp = function () {
                $scope.item.obat = $scope.item.obat2;
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
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                var a = ""
                var b = ""
                var c = ""
                debugger
                var vals = ''

                debugger
                for (var i = 0; i < $scope.data.namez.length; i++) {
                    if ($scope.data.namez[i].keterangan != '' || $scope.data.namez[i].keterangan != undefined) {
                        if (i == 0) {
                            vals = vals + $scope.data.namez[i].keterangan
                        } else {
                            vals = vals + ' / ' + $scope.data.namez[i].keterangan
                        }
                    }
                }
                arrSave.push({
                    id: 229,
                    values: vals
                })

                // return 0

                for (var i = arrobj.length - 1; i >= 0; i--) {
                    debugger
                    arrSave.push({
                        id: arrobj[i],
                        values: $scope.item.obj[parseInt(arrobj[i])]
                    })
                    if (arrobj[i] == 217) {
                        a = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({
                            id: arrobj[i],
                            values: $scope.item.obj[parseInt(arrobj[i])]
                        })
                    }
                    if (arrobj[i] == 219) {
                        b = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({
                            id: arrobj[i],
                            values: $scope.item.obj[parseInt(arrobj[i])]
                        })
                    }
                    if (arrobj[i] == 221) {
                        c = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({
                            id: arrobj[i],
                            values: $scope.item.obj[parseInt(arrobj[i])]
                        })
                    }
                    if (arrobj[i] == 221) {
                        c = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({
                            id: arrobj[i],
                            values: $scope.item.obj[parseInt(arrobj[i])]
                        })
                    }
                }

                debugger
                // arrSave.push({ id: "132", values: photo })
                $scope.cc.jenisemr = 'emrranapevaluasi'
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
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
                var jsonSavex = {
                    norecapd: $scope.cc.norec,
                    keluhan: a,
                    dahulu: b,
                    sekarang: c
                }
                medifirstService.post('emr/save-emr-igd', jsonSavex).then(function (e) {

                });



            }

            // $scope.verifikasigrid = function (dataPasienSelected) {
            //     
            //     tempnorec =  dataPasienSelected.norec;
            //     tempnorecpp =  dataPasienSelected.norecpp;
            //     $scope.item.obat =  dataPasienSelected.namaproduk;

            //     $scope.item.waktuintruksi = dataPasienSelected.waktuintruksi;
            //     $scope.item.dosis = dataPasienSelected.dosis;
            //     $scope.item.carapemberian = dataPasienSelected.carapemberian;
            //     $scope.item.ttddokter = dataPasienSelected.ttddokter;
            //     $scope.item.waktupemberian = dataPasienSelected.waktupemberian;
            //     $scope.item.ttdperawat = dataPasienSelected.ttdperawat;
            //     $scope.popupEditdata.center().open();

            // }
            $scope.verifikasigrid = function (dataPasienSelected) {

                tempnorec = dataPasienSelected.norec;
                tempnorecpp = dataPasienSelected.norecpp;

                var objSave = {
                    "norec": tempnorec,
                    "norecpp": tempnorecpp,
                    "waktuintruksi": moment(dataPasienSelected.waktuintruksi).format('DD-MMM-YYYY HH:mm:ss'),
                    "dosis": dataPasienSelected.dosis,
                    "noregistrasi": $scope.cc.noregistrasi,
                    "carapemberian": dataPasienSelected.carapemberian,
                    "ttddokter": dataPasienSelected.ttddokter.text,
                    "waktupemberian": moment(dataPasienSelected.waktupemberian).format('DD-MMM-YYYY HH:mm:ss'),
                    "ttdperawat": dataPasienSelected.ttdperawat.text,
                    "jenis": "obat"
                }
                medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                    // // alert('yoyoyyy');
                    // medifirstService.get("emr/get-laksana?jenis=obat&noReg=" +   $scope.cc.noregistrasi , true).then(function (dat) {
                    //     $scope.dataGridobat = dat.data.data;
                    // });
                })

            }
            // $scope.verifikasigrid2 = function (dataPasienSelected) {
            //     
            //     tempnorec =  dataPasienSelected.norec;
            //     tempnorecpp =  dataPasienSelected.norecpp;
            //     $scope.item.namaproduk =  dataPasienSelected.namaproduk;

            //     $scope.item.waktu = dataPasienSelected.waktuintruksi;
            //     $scope.item.catatan = dataPasienSelected.catatan;
            //     $scope.item.ttddokter = dataPasienSelected.ttddokter;
            //     $scope.item.waktupemberian = dataPasienSelected.waktupemberian;

            //     $scope.popupEditdatapenunjang.center().open();

            // }
            $scope.verifikasigrid2 = function (dataPasienSelected) {

                tempnorec = dataPasienSelected.norec;
                tempnorecpp = dataPasienSelected.norecpp;
                var objSave = {
                    "norec": tempnorec,
                    "norecpp": tempnorecpp,
                    "waktuintruksi": moment(dataPasienSelected.waktuintruksi).format('DD-MMM-YYYY HH:mm:ss'),

                    "waktupemberian": moment(dataPasienSelected.waktupemberian).format('DD-MMM-YYYY HH:mm:ss'),
                    "noregistrasi": $scope.cc.noregistrasi,
                    "carapemberian": dataPasienSelected.carapemberian,
                    "ttddokter": dataPasienSelected.ttddokter.text,
                    "catatan": dataPasienSelected.catatan,
                    "jenis": "penunjang"
                }
                medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                    // // alert('yoyoyyy');
                    // medifirstService.get("emr/get-laksana?jenis=penunjang?noReg=" +   $scope.cc.noregistrasi , true).then(function (dat) {
                    //     $scope.dataGridPenunjang = dat.data.data;
                    // });
                })

            }

            $scope.simpaneditobat = function () {

                var objSave = {
                    "norec": tempnorec,
                    "norecpp": tempnorecpp,
                    "waktuintruksi": $scope.item.waktuintruksi,
                    "dosis": $scope.item.dosis,
                    "noregistrasi": $scope.cc.noregistrasi,
                    "carapemberian": $scope.item.carapemberian,
                    "ttddokter": $scope.item.ttddokter.text,
                    "waktupemberian": $scope.item.waktupemberian,
                    "ttdperawat": $scope.item.ttdperawat.text,
                    "jenis": "obat"
                }
                medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                    // alert('yoyoyyy');
                    medifirstService.get("emr/get-laksana?jenis=obat&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                        $scope.dataGridobat = dat.data.data;
                    });
                })
            }

            $scope.simpaneditpenunjang = function () {

                var objSave = {
                    "norec": tempnorec,
                    "norecpp": tempnorecpp,
                    "waktuintruksi": $scope.item.waktuintruksi,

                    "waktupemberian": $scope.item.waktupemberian,
                    "noregistrasi": $scope.cc.noregistrasi,
                    "carapemberian": $scope.item.carapemberian,
                    "ttddokter": $scope.item.ttddokter.text,
                    "catatan": $scope.item.catatan,
                    "jenis": "penunjang"
                }
                medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                    // alert('yoyoyyy');
                    medifirstService.get("emr/get-laksana?jenis=penunjang?noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                        $scope.dataGridPenunjang = dat.data.data;
                    });
                })
            }


            $scope.dropDownPegawai = function (container, options) {

                var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listPegawai" data-bind="value:' + options.field + '"/>')
                    .appendTo(container);
            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm:ss');
            }
            $scope.dropDownJam = function (container, options) {

                // var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listPegawai" data-bind="value:' + options.field + '"/>')
                var editor = $('<input style="width: 100%" k-ng-model="item.obj[337]" kendo-datetimepicker placeholer="yyyy-MM-dd HH:mm" k-format="\'yyyy-MM-dd HH:mm\'" parsedate=yyyy-MM-dd HH:mm" data-bind="value:' + options.field + '"//>')
                    .appendTo(container);
            };

            $scope.tataobat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="munculetiket()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat Atau Cairan</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                // editable:"popup",
                editable: "incell",
                //tanda
                columns: [{
                    field: "waktuintruksi",
                    title: "waktu intruksir",
                    width: 150,
                    editor: $scope.dropDownJam,
                    template: "<span class='style-left'>{{formatTanggal('#: waktuintruksi #')}}</span>"
                },
                {
                    field: "namaproduk",
                    title: "Obat atau Cairan",
                    width: 150
                },
                {
                    field: "dosis",
                    title: "Dosis",
                    width: 150
                },
                {
                    field: "carapemberian",
                    title: "Cara Pemberian",
                    width: 150
                },
                {
                    field: "ttddokter",
                    title: "TTD Dokter",
                    width: 100,
                    editor: $scope.dropDownPegawai,
                    template: "#=ttddokter.text#"
                },
                {
                    field: "waktupemberian",
                    title: "Waktu Pemberian",
                    width: 150,
                    editor: $scope.dropDownJam,
                    template: "<span class='style-left'>{{formatTanggal('#: waktupemberian #')}}</span>"
                },
                {
                    field: "ttdperawat",
                    title: "TTD Perawat",
                    width: 100,
                    editor: $scope.dropDownPegawai,
                    template: "#=ttdperawat.text#"
                },
                {
                    field: "status",
                    title: ".",
                    width: "90px",
                    template: "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" > Simpan </button> "
                },

                ],

            };

            $scope.tatapenunjang = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="munculpenunjang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Penunjang</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                editable: "incell",

                columns: [{
                    field: "waktuintruksi",
                    title: "waktu",
                    width: 150,
                    editor: $scope.dropDownJam,
                    template: "<span class='style-left'>{{formatTanggal('#: waktuintruksi #')}}</span>"
                },
                {
                    field: "namaproduk",
                    title: "Pemeriksaan",
                    width: 150
                },
                {
                    field: "waktupemberian",
                    title: "Waktu Pemberian",
                    width: 150,
                    editor: $scope.dropDownJam,
                    template: "<span class='style-left'>{{formatTanggal('#: waktupemberian #')}}</span>"
                },
                {
                    field: "catatan",
                    title: "catatan",
                    width: 150
                },
                {
                    field: "ttddokter",
                    title: "TTD Dokter",
                    width: 100,
                    editor: $scope.dropDownPegawai,
                    template: "#=ttddokter.text#"
                },
                {
                    field: "status",
                    title: "edit",
                    width: "90px",
                    template: "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid2(dataItem)\"  style=\"margin:0 0 5px\" > Simpan </button> "
                },
                ],

                waktu: {
                    editable: true,
                    type: "string"
                },
                pemeriksaan: {
                    editable: false,
                    type: "string"
                },
                waktupemberian: {
                    editable: true,
                    type: "string"
                },
                catatan: {
                    editable: true,
                    type: "string"
                },
                ttddokter: {
                    editable: true,
                    type: "string"
                },

            };

            $scope.munculetiket = function () {
                medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.cc.noregistrasi + "&ruanganfk=481", true).then(function (dat) {
                    $scope.dataGrid = dat.data;
                    medifirstService.get("emr/get-laksana?jenis=obat&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;

                        for (var i = 0; i < $scope.dataGrid.length; i++) {
                            for (var x = 0; x < dat.data.data.length; x++) {
                                const element = $scope.dataGrid[i];
                                if (element.norecpp == dat.data.data[x].norecpp) {
                                    element.x = true
                                }


                            }
                        }


                        $scope.dataPopUpetiket = $scope.dataGrid;
                    });
                });

                $scope.popupEtiket.center().open();

            }
            $scope.munculpenunjang = function () {

                medifirstService.get("tatarekening/detail-tagihanv3/" + $scope.cc.noregistrasi, true).then(function (dat) {
                    $scope.dataGrid = dat.data;
                    medifirstService.get("emr/get-laksana?jenis=penunjang&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;

                        for (var i = 0; i < $scope.dataGrid.length; i++) {
                            for (var x = 0; x < dat.data.data.length; x++) {
                                const element = $scope.dataGrid[i];
                                if (element.norec == dat.data.data[x].norecpp) {
                                    element.x = true
                                }


                            }
                        }


                        $scope.dataPopUppenunjang = $scope.dataGrid;
                    });
                });

                $scope.popuppenunjang.center().open();

            }
            $scope.onClick2 = function (e) {

                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {

                    var objSave = {
                        "norecpp": dataItem.norecpp,
                        "namaproduk": dataItem.namaproduk,
                        "dosisobat": dataItem.dosisobat,
                        "noregistrasi": $scope.cc.noregistrasi,
                        "jenis": "obat"
                    }
                    medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                        loaddata();
                    })
                } else {

                    var objSave = {
                        "norecpp": dataItem.norecpp,
                        "namaproduk": dataItem.namaproduk,
                        "dosisobat": dataItem.dosisobat,
                        "noregistrasi": $scope.cc.noregistrasi,
                        "jenis": "obat"
                    }
                    medifirstService.post('emr/delete-tatalaksana', objSave).then(function (e) {
                        // alert('yoyoyyy');
                        loaddata();
                    })
                }

            }
            $scope.onClick3 = function (e) {

                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridpenunjang").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {

                    var objSave = {
                        "norecpp": dataItem.norec,
                        "namaproduk": dataItem.namaproduk,
                        "dosisobat": dataItem.dosisobat,
                        "noregistrasi": $scope.cc.noregistrasi,
                        "jenis": "penunjang"
                    }
                    medifirstService.post('emr/save-tatalaksana', objSave).then(function (e) {
                        // alert('yoyoyyy');
                        medifirstService.get("emr/get-laksana?jenis=penunjang&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                            $scope.dataGridPenunjang = dat.data.data;
                        });
                    })
                } else {

                    var objSave = {
                        "norecpp": dataItem.norec,
                        "namaproduk": dataItem.namaproduk,
                        "dosisobat": dataItem.dosisobat,
                        "noregistrasi": $scope.cc.noregistrasi,
                        "jenis": "penunjang"
                    }
                    medifirstService.post('emr/delete-tatalaksana', objSave).then(function (e) {
                        // alert('yoyoyyy');
                        medifirstService.get("emr/get-laksana?jenis=penunjang&noReg=" + $scope.cc.noregistrasi, true).then(function (dat) {
                            $scope.dataGridPenunjang = dat.data.data;
                        });
                    })
                }

            }

            $scope.columnPopUpetiket = {
                selectable: 'row',
                pageable: true,
                editable: true,
                serverPaging: true,
                // dataBound: onDataBound,
                dataBound: function (e) {
                    // 
                    var grid = this;
                    var rows = grid.items();

                    $(rows).each(function (e) {
                        var row = this;
                        var dataItem = grid.dataItem(row);

                        if (dataItem.isSiang == 1) {
                            grid.select(row);
                        }

                    });
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 50
                    });
                },
                columns: [{
                    "field": "x",

                    "title": "x",
                    "template": "<input ng-model = 'dataItem.x'  type='checkbox' class='checkbox' ng-click='onClick2($event)' />",

                    //     "template": "<input ng-model = 'dataItem.ispagi' type='checkbox' ng-click='onClickpagi($event)' />",
                    "width": 15
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "80px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "80px",
                },

                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                ]
            };

            $scope.columnPopPenunjang = {
                selectable: 'row',
                pageable: true,
                editable: true,
                serverPaging: true,
                // dataBound: onDataBound,
                dataBound: function (e) {
                    // 
                    var grid = this;
                    var rows = grid.items();

                    $(rows).each(function (e) {
                        var row = this;
                        var dataItem = grid.dataItem(row);

                        if (dataItem.isSiang == 1) {
                            grid.select(row);
                        }

                    });
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 50
                    });
                },
                columns: [{
                    "field": "x",

                    "title": "x",
                    "template": "<input ng-model = 'dataItem.x'  type='checkbox' class='checkbox' ng-click='onClick3($event)' />",

                    //     "template": "<input ng-model = 'dataItem.ispagi' type='checkbox' ng-click='onClickpagi($event)' />",
                    "width": 15
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "namaruangan",
                    "title": "Namaruangan",
                    "width": "80px",
                },

                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },

                ]
            };



            $scope.columnGridss = {
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    //     attributes: {
                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    //     },
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        // "field": "claim",
                        "title": "Resume Medis",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
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
                    // {
                    // 	"field": "hargasatuan",
                    // 	"title": "Harga Satuan",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    // },
                    // {
                    // 	"field": "hargadiscount",
                    // 	"title": "Diskon",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    // 	// footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "jasa",
                    // 	"title": "Jasa Cito",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    // 	footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "total",
                    // 	"title": "Total",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    // 	aggregates: ["sum"],
                    // 	groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                    // 	footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                    // },
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
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.columnGridrad = {
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                    // "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokterpemeriksa",
                    "title": "Dokter Pemeriksa",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Pengririm",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    // "field": "claim",
                    "title": "Resume Medis",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"Cetakexpertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",

                    // "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                },
                {
                    "field": "tglhasil",
                    "title": "Tgl Hasil",
                    "width": "90px",
                },

                {
                    "field": "nofoto",
                    "title": "No Foto",
                    "width": "100px",
                }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }




            // Untuk Filteran 
            // $scope.isidiganosa = function () {
            //     debugger;
            //     $scope.item.obj[217] = $scope.listdiagnosa.namaDiagnosa;
            // }

            $scope.isidiganosautama = function () {
                debugger;
                $scope.item.obj[226] = $scope.listdiagnosautama.namaDiagnosa;
            }

            $scope.isidiganosasek = function (index) {
                // $scope.data.namey[index].keterangan = $scope.data.namey[0].kddiagnosa.namaDiagnosa;
                var yy = index
                debugger;
                // $scope.item.obj[229][index].keterangan = $scope.listdiagnosasek.obj[229][index].kddiagnosa.namaDiagnosa;
                $scope.data.namez[index].keterangan = $scope.data.namez[index].kddiagnosa.namaDiagnosa;
                // data.namez[$index].kddiagnosa
                // $scope.data.namey[0].kddiagnosa.namaDiagnosa;
                // $scope.item.obj[229] = $scope.listdiagnosasek.namaDiagnosa;
            }


            $scope.TambahD10 = function (index) {
                debugger;
                var name = {
                    keterangan: ''
                };
                if ($scope.data.namez.length <= index + 1) {
                    $scope.data.namez.splice(index + 1, 0, name);
                } else {
                    toastr.error("Tambah Diagnosa Sekunder pada Diagnosa Sekunder terakhir!!!");
                }
            }

            $scope.HapusD10 = function (index) {
                debugger;
                if ($scope.data.namez.length == 1) {
                    toastr.error("Diagnosa Sekunder 1, tidak boleh di hapus!");
                    return 0
                }
                // var norec_diagnosapasien = $scope.data.namey[index].norec_diagnosapasien;
                // if (norec_diagnosapasien != "") {
                //     deleteIcd10(norec_diagnosapasien)
                // }
                $scope.data.namez.splice(index, 1);
                $scope.Save()
            }

            // Hasil Radiologi
            $scope.AddHasilKonsul = function (ruangan) {
                $scope.isLoading = true;

                var ruid = ruangan;
                datalabs = []
                loadClaimGridPp($scope.cc.norec_pd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.cc.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        debugger
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
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
                        $scope.popUpPelayanan.center().open();
                        $scope.dataGridss = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [{
                                field: 'total',
                                aggregate: 'sum'
                            },]
                        };

                        // $scope.popUpPelayanan.center().open();
                        debugger
                        if (ruid == 575) {
                            datalab = dat.data.data;
                            popUps(datalab)
                        } else {
                            datalab = dat.data.data;
                            popUps(datalab)
                        }

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
            }

            function loadClaimGridPp(noregistrasifk, objectruanganfk) {
                debugger
                medifirstService.get("radiologi/get-lab-inacbg-grid-rm?noregistrasifk=" + noregistrasifk + "&objectruanganfk=" + objectruanganfk, true).then(function (dat) {
                    datalabstat = dat.data.data;
                    popUps();
                });
            }

            $scope.loadClaimPpLuar = function (dataItem) {
                debugger
                // function loadClaimPpLuar(dataItem) {
                // var noregistrasi = dataItem.noregistrasi
                var norec_pp = dataItem.norec_pp;
                var noregistrasifk = dataItem.norec_pd;
                var noregistrasi = dataItem.noregistrasi;
                var objectruanganfk = dataItem.objectruanganfk;
                var rmstat
                if (dataItem.rm == "Hapus") {
                    rmstat = false
                } else {
                    rmstat = true
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"
                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) '
                    medifirstService.get("emr/get-hasil-lab?norecapd=" + x + "&umur=" + umurDay + "&jeniskelamin=" + $scope.item.objectjeniskelaminfk).then(function (x) {
                        debugger
                        if ($scope.item.pemeriksaanPenunjangLab == undefined) {
                            $scope.item.pemeriksaanPenunjangLab = x.data[0].tglpelayanan + ' : ' + x.data[0].detailjenisproduk + ' : '
                        } else {
                            $scope.item.pemeriksaanPenunjangLab = $scope.item.pemeriksaanPenunjangLab + ' ' + x.data[0].tglpelayanan + ' : ' + x.data[0].detailjenisproduk + ' : '
                        }
                        for (var i = 0; i < x.data.length; i++) {
                            if ($scope.item.pemeriksaanPenunjangLab == undefined) {
                                $scope.item.pemeriksaanPenunjangLab = x.data[i].detailpemeriksaan + '/' + x.data[i].hasil + ' '
                            } else {
                                $scope.item.pemeriksaanPenunjangLab = $scope.item.pemeriksaanPenunjangLab + '  ' + x.data[i].detailpemeriksaan + '/' + x.data[i].hasil;
                            }
                        }

                    });
                }
                // var norec_ppc = ''
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': dataItem.norec_pp,
                    'isrm': rmstat
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-rm', json).then(function (e) {
                        // 	})
                        // loadClaimPp(norec_ppc)
                        medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + dataItem.norec_pp).then(function (rmpp) {
                            $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                            loadClaimGridPp(noregistrasifk, objectruanganfk);
                            loadDaftarRmPp(noregistrasi);



                        });
                    }
                })
            }

            $scope.Cetakexpertise = function (dataItem) {
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                    debugger;
                    var kalimat = e.data[0].keterangan;
                    // var panjang = kalimat.length;
                    // var temukan = kalimat.indexOf("kesan");
                    // if (temukan < 0) {
                    //     var temukan = kalimat.indexOf("Kesan");
                    // }
                    // var filter = kalimat.slice(temukan, panjang);
                    var filter = kalimat;

                    filter = filter.replace(/(<([^>]+)>)/gi, " ");
                    if ($scope.item.obj[222] == "" || $scope.item.obj[222] == undefined) {

                        $scope.item.obj[222] = filter.replace(/&nbsp;/g, " ");
                    } else {

                        $scope.item.obj[222] = $scope.item.obj[222] + "\n" + filter.replace(/&nbsp;/g, " ");
                    }
                    toastr.success('Data Radiologi Berhasil di cetak')
                    $scope.popUpPelayananrad.close();
                    $scope.popUpPelayanan.close();

                })

            }

            function popUps(datalab) {


                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }
                    debugger
                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayananrad.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGridss = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }




            // Hasil Laboratorium
            function loadDaftarRmPp(noregistrasi) {
                var temp_labo = ''
                medifirstService.get("registrasi/daftar-registrasi/get-daftar-rm-pp?noregistrasi=" + noregistrasi).then(function (dat) {
                    debugger
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    for (var i = 0; i < dat.data.data.length; i++) {
                        debugger
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

                        // tambahan
                        debugger
                        // kimia klinik bisa di ganti jadi dat.data.data[i].namaruangan
                        temp_labo += dat.data.data[i].tglpelayanan + " : " + 'Kimia Klinik : ' + dat.data.data[i].namaproduk
                        if (i != dat.data.data.length - 1) {
                            temp_labo += ' /- '
                        }
                        // if (i > 0) {
                        //     temp_labo += '/-'
                        // }
                        // $scope.item.obj[221] = dat.data.data[0].dahulu



                    }

                    if (dat.data.data.length > 0) {
                        if (dat.data.data[0].objectdepartemenfk == 3)
                            $scope.disableRad = true
                        if (dat.data.data[0].objectdepartemenfk == 27)
                            $scope.disableLab = true
                    }
                    $scope.isLoading = false;

                    debugger

                    $scope.dataGridRm = {
                        data: dat.data.data,
                        _data: dat.data.data,
                        pageSize: 2,
                        selectable: true,
                        refresh: true,
                        total: dat.data.data.length,
                        serverPaging: false,
                        aggregate: [{
                            field: 'total',
                            aggregate: 'sum'
                        },]
                    };
                    debugger
                    $scope.item.obj[230] = temp_labo

                },
                    function (error) {
                        $scope.isLoading = false;
                    });


            }

            $scope.resumeOptRm = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="AddHasilKonsul(575)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Hasil Laboratorium</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    {
                        field: "no",
                        title: "No",
                        width: 30
                    },
                    {
                        field: "tglpelayanan",
                        title: "Tgl Pelayanan",
                        width: 100
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: 150
                    },
                    {
                        field: "namaruanganasal",
                        title: "Ruangan Asal",
                        width: 150
                    },
                    {
                        field: "dokterpemeriksa",
                        title: "Dokter Pemeriksa",
                        width: 150
                    },
                    {
                        field: "namaproduk",
                        title: "Layanan",
                        width: 150
                    },
                    {
                        field: "dokterpengirim",
                        title: "Dokter Pengirim",
                        width: 150
                    },
                    {
                        field: "tglhasil",
                        title: "Tgl Hasil",
                        width: 100
                    },
                    {
                        field: "tglcetak",
                        title: "Tgl Cetak",
                        width: 100
                    },
                    {
                        command: [{
                            text: "Hapus",
                            click: simpanDeletePpRm
                        }],
                        title: "&nbsp;",
                        width: 80
                    }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };


            function simpanDeletePpRm(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var norec_pp = ''
                norec_pp = dataItem.norec_pp
                var json = {
                    'norec': norec_pp,
                    'isrm': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        loadDaftarRmPp($scope.cc.noregistrasi);
                        // $scope.Save()

                    }
                })

                // $scope.Save()

            }


            $scope.CetakLabKlinikLangsung = function (dataItem) {
                debugger
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function (data) {
                    debugger
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
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"

                    debugger
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + dataItem.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["PUSAT KEDOKTERAN DAN KESEHATAN POLRI", "RUMAH SAKIT BHAYANGKARA TK.I R. SAID SUKANTO", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Raya Bogor, Kramat Jati, Jakarta Timur 13510, Telp. (021)8093288, Psw. 177", user.namaLengkap,
                            x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });
            }










            // function loadDiagnosa(noregistrasi) {
            //     $scope.data = {
            //         namez: [],
            //     };
            //     // $scope.isRouteLoading = false;
            //     if (data.data.datas.length > 0) {
            //         // setRow();
            //         debugger
            //         for (var i = 0; i < data.data.datas.length; i++) {
            //             var name = {
            //                 keterangan: 'keterangan'
            //             };

            //             $scope.data.namez.splice(indez + 1, i, name);
            //             indez = indez + 1
            //         }
            //     }

            //     if (indez == 1) {
            //         var name = {
            //             keterangan: ''
            //         };
            //         if ($scope.data.namez.length <= indez + 1) {
            //             $scope.data.namez.splice(indez + 1, 0, name);
            //         }
            //     }

            // }









        }
    ]);
});