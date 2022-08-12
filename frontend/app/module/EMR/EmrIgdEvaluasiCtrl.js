define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EmrIgdEvaluasiCtrl', ['$q', 'SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
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
                // var dokter =[];
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                loaddata();




                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=emrigdevaluasi", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheEmrIgd', undefined)

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
                        $scope.user.poto = "data:image/jpg;base64,zC"
                        $scope.item.obj = []
                        $scope.item.obj2 = []
                        $scope.item.obj[68] = $scope.now
                        $scope.item.obj[222] = "Laboratorium : \nRadiologi : \nLain-lain : \nExtremitas : "
                        $scope.item.obj[343] = "TD : \nNadi : \nSuhu : \nPernafasan: \nCatatan: "
                        $scope.item.obj[223] = "KU : \nKES : \nGCS :        , E :        , M :        , V : \nTD :        , N :        , P :        , SO2 :        , T : \n\nKEPALA / LEHER : \n\nTHORAK : \n\nABDOMEN : \n\nEKSTREMITAS :";

                        medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                            // $scope.item.obj = []
                            $scope.item.obj[217] = dat.data.data[0].keluhanutama
                            $scope.item.obj[219] = dat.data.data[0].sekarang
                            $scope.item.obj[221] = dat.data.data[0].dahulu

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


                        dataLoad = dat.data.data
                        if (dataLoad.length == 0) {
                            medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                                // $scope.item.obj = []
                                $scope.item.obj[217] = dat.data.data[0].keluhanutama
                                $scope.item.obj[219] = dat.data.data[0].sekarang
                                $scope.item.obj[221] = dat.data.data[0].dahulu

                            })
                        }
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            debugger
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                                debugger
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
                    $scope.dataGridobat = new kendo.data.DataSource({
                        data: dat.data.data,

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

            $scope.cetakPdf = function () {

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
                debugger;
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                if (dataLoad[i].type == "combobox") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    arrPush[x].value = res[1]

                                } else {
                                    arrPush[x].value = dataLoad[i].value
                                }

                            }
                        }
                    }

                }
                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "norm", "umur", "jeniskelamin", "namapasien", "test", "nomorEMR", "dataLoad"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.cc.noregistrasi, $scope.cc.nocm, $scope.cc.umur, $scope.cc.jeniskelamin, $scope.cc.namapasien, base64, nomorEMR, arrPush],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                //     xhr.open('POST', 'http://192.168.0.62:1002/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else {
                //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiigd.pdf');
                // }
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiigd.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
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
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.cc.nocm, base64, nomorEMR, arrPush],
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
                var d = ""
                for (var i = arrobj.length - 1; i >= 0; i--) {
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
                    if (arrobj[i] == 223) {
                        d = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({
                            id: arrobj[i],
                            values: $scope.item.obj[parseInt(arrobj[i])]
                        })
                    }
                }
                // arrSave.push({ id: "132", values: photo })
                $scope.cc.jenisemr = 'emrigdevaluasi'
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
                    sekarang: c,
                    pemeriksaanfisik: d
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

        }
    ]);
});