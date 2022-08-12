define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EmrIgdCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 515
            var dataLoad = []
            $scope.item = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            $scope.isKembali = true
            var paramSearch = ''
            $scope.user = {};
            $scope.istempatLaporan = true;

            LoadCacheHelper();
            LoadCombo();

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

            function LoadCombo() {
                medifirstService.get('emr/get-combo').then(function (dat) {
                    $scope.listPerawat = dat.data.pegawai
                    $scope.listDokter = dat.data.pegawai
                })

                medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {

                    $scope.listDiagnosa = data;
                });
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=emrigd", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheEmrIgd', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '515'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {

                        $scope.user.poto = "data:image/jpg;base64,i"
                        medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                            if ($scope.item.obj == undefined) {
                                $scope.item.obj = []
                            }
                            $scope.item.obj[144] = dat.data.data[0].keluhanutama
                            $scope.item.obj[145] = dat.data.data[0].sekarang
                            $scope.item.obj[146] = dat.data.data[0].dahulu

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
                        // $scope.item.obj[146] = "tes";
                        dataLoad = dat.data.data
                        if (dataLoad.length == 0) {
                            medifirstService.get("emr/get-temp-igd?" + "norecapd=" + $scope.cc.norec, true).then(function (dat) {
                                // $scope.item.obj = []
                                $scope.item.obj[144] = dat.data.data[0].keluhanutama
                                $scope.item.obj[145] = dat.data.data[0].sekarang
                                $scope.item.obj[146] = dat.data.data[0].dahulu

                            })
                        }
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
                                    $scope.item.obj[dataLoad[i].emrdfk] = true
                                }
                                if (dataLoad[i].type == "textarea") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "122") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], diagnosa: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "39") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "124") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], diagnosa: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "129") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], diagnosa: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "130") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], diagnosa: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "131") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], diagnosa: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "888") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "889") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");

                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                                }
                                // if (dataLoad[i].type == "combobox") {
                                //     var str = dataLoad[i].value
                                //     var res = str.split("~");
                                //    
                                //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                                // }
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
                debugger
                if (nomorEMR == '') return
                // var base64 = $scope.user.poto.substring(22);
                var base64 = "";
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 0; i <= 150 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 888; i <= 892 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 1145; i <= 1162 - 1; i++) {
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

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "penjamin", "umur", "test", "nomorEMR", "dataLoad"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap, $scope.cc.noregistrasi, $scope.cc.kelompokpasien, $scope.cc.umur, base64, nomorEMR, arrPush],
                    "paramType": ["", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/report2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/report2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.cetakPdf2 = function () {
                debugger
                if (nomorEMR == '') return
                var base64 = $scope.user.poto.substring(22);
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 0; i <= 150 - 1; i++) {
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
                        debugger;
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
            $scope.listCaraMasuk = [{
                "id": 1,
                "nama": "Golongan",
                "detail": [
                    { "id": 1, "nama": "Polri ", "type": "checkbox" },
                    { "id": 2, "nama": "Anggota :", "type": "checkbox" },
                    { "id": 3, "nama": "Pati ", "type": "checkbox" },
                    { "id": 4, "nama": "Non Polri :", "type": "checkbox" },
                    { "id": 5, "nama": "PNS ", "type": "checkbox" },
                    { "id": 6, "nama": "Pamen ", "type": "checkbox" },
                    { "id": 7, "nama": "Umum ", "type": "checkbox" },
                    { "id": 8, "nama": "Keluarga :", "type": "checkbox" },
                    { "id": 9, "nama": "Pama ", "type": "checkbox" },
                    { "id": 10, "nama": "Brigadir ", "type": "checkbox" },
                    { "id": 11, "nama": "Tamtama ", "type": "checkbox" },
                ]
            },
            {
                "id": 2,
                "nama": "Cara Pembayaran",
                "detail": [
                    { "id": 12, "nama": "Tunai ", "type": "checkbox" },
                    { "id": 13, "nama": "BPJS Kesehatan ", "type": "checkbox" },
                    { "id": 14, "nama": "Lain-lain ", "type": "checkbox" },
                ]
            },
            {
                "id": 3,
                "nama": "Cara Datang",
                "detail": [
                    { "id": 15, "nama": "Sendiri ", "type": "checkbox" },
                    { "id": 16, "nama": "Rujukan ", "type": "checkbox" },
                    { "id": 17, "nama": "Visum ", "type": "checkbox" },
                    { "id": 18, "nama": "Diantar Polisi, No. Telp ", "type": "checkbox" },
                    { "id": 19, "nama": "", "type": "textbox" },
                    { "id": 20, "nama": "Asal Rujukan", "type": "textbox" },
                    { "id": 21, "nama": "Pengantar Pasien", "type": "textbox" },
                    { "id": 22, "nama": "Riwayat Alergi", "type": "textbox" },
                ]
            }
            ]

            $scope.listTrauma = [{
                "id": 4,
                "nama": "Tanda Kehidupan",
                "detail": [
                    { "id": 23, "nama": "Tanda Kehidupan(-) ", "type": "checkbox" },
                    { "id": 24, "nama": "Reflek cahaya(-/-)", "type": "checkbox" },
                    // { "id": 25, "nama": "Obstetri Ginecology ", "type": "checkbox" },
                    { "id": 26, "nama": "Tidak ada denyut nadi", "type": "checkbox" },
                    { "id": 27, "nama": "EKG Flat ", "type": "checkbox" },
                    { "id": 18, "nama": "Jam DOA", "type": "checkbox" },
                    { "id": 1158, "nama": " ", "type": "textbox" },
                ]
            }]
            $scope.listSkorNRC = [{
                "id": 5,
                "nama": "Score ",
                "detail": [
                    { "id": 70, "nama": "0", "type": "checkbox", "ket": "= Tidak Nyeri" },
                    { "id": 71, "nama": "1 - 3", "type": "checkbox", "ket": "= Nyeri Ringan" },
                    { "id": 72, "nama": "4 - 6", "type": "checkbox", "ket": "= Nyeri Sedang" },
                    { "id": 73, "nama": "7 - 10", "type": "checkbox", "ket": "= Nyeri Berat" },
                ]
            }]
            $scope.listNyeriAnak = [{
                "id": 6,
                "nama": "Hurts",
                "detail": [{ "id": 74, "nama": "No Hurt", "descNilai": 4 },
                { "id": 75, "nama": "Hurts Little Bit", "descNilai": 6 }, { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                { "id": 76, "nama": "Hurts Even More", "descNilai": 8 }, { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                { "id": 77, "nama": "Hurts whorts", "descNilai": 10 }
                ]
            }]
            $scope.listSkorWong = [{
                "id": 7,
                "nama": "Score ",
                "detail": [
                    { "id": 78, "nama": "0 - 3 Ringan", "type": "checkbox", "ket": "" },
                    { "id": 79, "nama": "4 - 6 Sedang", "type": "checkbox", "ket": "" },
                    { "id": 80, "nama": "7 - 10 Berat", "type": "checkbox", "ket": "" },
                    { "id": 81, "nama": "Akut", "type": "checkbox", "ket": "" },
                    { "id": 82, "nama": "Kronis", "type": "checkbox", "ket": "" },
                    // { "id": 83, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
                ]
            }]

            $scope.listRisikoJatuh = [{
                "id": 8,
                "nama": " ",
                "detail": [
                    { "id": 84, "nama": "Lokasi ", "type": "textbox" },
                    { "id": 85, "nama": "Durasi :", "type": "textbox" },
                ]
            },
            {
                "id": 9,
                "nama": "Risiko Jatuh",
                "detail": [
                    { "id": 86, "nama": "Risiko Rendah ", "type": "checkbox" },
                    { "id": 87, "nama": "Tidak berisiko ", "type": "checkbox" },
                    { "id": 88, "nama": "Risiko tinggi ", "type": "checkbox" },
                ]
            }
            ]

            $scope.listPsikososial = [{
                "id": 10,
                "nama": "Psikologi",
                "detail": [
                    { "id": 89, "nama": "Marah ", "type": "checkbox" },
                    { "id": 90, "nama": "Takut :", "type": "checkbox" },
                    { "id": 91, "nama": "Cemas", "type": "checkbox" },
                    { "id": 92, "nama": "Depresi :", "type": "checkbox" },
                    { "id": 93, "nama": "Gelisah :", "type": "checkbox" },
                    { "id": 94, "nama": "Bunuhdiri :", "type": "checkbox" },
                    // { "id": 95, "nama": "", "type": "textbox" },
                    { "id": 1158, "nama": "Tidak ada masalah :", "type": "checkbox" },
                    { "id": 1159, "nama": "Lain-lain", "type": "checkbox" },
                ]
            },
                // {
                //     "id": 11,
                //     "nama": "Risiko Jatuh",
                //     "detail": [
                //         { "id": 96, "nama": "Risiko Rendah ", "type": "checkbox" },
                //         { "id": 97, "nama": "Tidak berisiko ", "type": "checkbox" },
                //         { "id": 98, "nama": "Risiko tinggi ", "type": "checkbox" },
                //     ]
                // },
                // {
                //     "id": 12,
                //     "nama": "Warganegara",
                //     "detail": [
                //         { "id": 99, "nama": "WNI ", "type": "checkbox" },
                //         { "id": 100, "nama": "WNA ", "type": "checkbox" },
                //     ]
                // },
                // {
                //     "id": 13,
                //     "nama": "Tinggal bersama",
                //     "detail": [
                //         { "id": 101, "nama": "Orangtua ", "type": "checkbox" },
                //         { "id": 102, "nama": "Sendiri ", "type": "checkbox" },
                //         { "id": 103, "nama": "Lainnya : ", "type": "checkbox" },
                //         { "id": 104, "nama": "", "type": "textbox" },
                //     ]
                // },
                // {
                //     "id": 14,
                //     "nama": "Kebiasaan",
                //     "detail": [
                //         { "id": 105, "nama": "Merokok ", "type": "checkbox" },
                //         { "id": 106, "nama": "Alkohol ", "type": "checkbox" },
                //         { "id": 107, "nama": "Lainnya : ", "type": "checkbox" },
                //         { "id": 108, "nama": "", "type": "textbox" },
                //     ]
                // },
                // {
                //     "id": 15,
                //     "nama": "Pekerjaan",
                //     "detail": [
                //         { "id": 109, "nama": "PNS ", "type": "checkbox" },
                //         { "id": 110, "nama": "Swasta ", "type": "checkbox" },
                //         { "id": 111, "nama": "Wiraswasta ", "type": "checkbox" },
                //         { "id": 112, "nama": "Lainnya : ", "type": "checkbox" },
                //         { "id": 113, "nama": "", "type": "textbox" },
                //     ]
                // },
                // {
                //     "id": 16,
                //     "nama": "Agama",
                //     "detail": [
                //         { "id": 114, "nama": "Hindu ", "type": "checkbox" },
                //         { "id": 115, "nama": "Islam ", "type": "checkbox" },
                //         { "id": 116, "nama": "Budha ", "type": "checkbox" },
                //         { "id": 117, "nama": "Kristen ", "type": "checkbox" },
                //         { "id": 118, "nama": "Katholik ", "type": "checkbox" },
                //         { "id": 119, "nama": "Lainnya : ", "type": "checkbox" },
                //         { "id": 120, "nama": "", "type": "textbox" },
                //     ]
                // },
                // {
                //     "id": 16,
                //     "nama": "Diagnosa Kerja",
                //     "detail": [
                //         { "id": 121, "nama": "Diagnosa Utama ", "type": "checkbox" },
                //         { "id": 122, "nama": " ", "type": "textbox" },
                //         { "id": 123, "nama": "Diagnosa Sekunder: ", "type": "checkbox" },
                //         { "id": 124, "nama": " ", "type": "textbox" },
                //     ]
                // },
                // {
                //     "id": 17,
                //     "nama": "LABORATORIUM",
                //     "detail": [
                //         { "id": 125, "nama": "DPL ", "type": "checkbox" },
                //         { "id": 126, "nama": "AGD ", "type": "checkbox" },
                //         { "id": 127, "nama": "Elektrolit ", "type": "checkbox" },
                //         { "id": 128, "nama": "Urin ", "type": "checkbox" },
                //         { "id": 129, "nama": "CK/CKMB ", "type": "checkbox" },
                //         { "id": 130, "nama": "GDS  ", "type": "checkbox" },
                //         { "id": 131, "nama": "Ur/Cr ", "type": "checkbox" },
                //     ]
                // }
            ]

            $scope.listPenanda = [{
                "id": 18,
                "nama": " ",
                "detail": [
                    { "id": 134, "nama": "Luka / Lesi ", "type": "checkbox" },
                    { "id": 135, "nama": "Perdarahan :", "type": "checkbox" },
                    { "id": 136, "nama": " ", "type": "textbox" },
                ]
            },
            {
                "id": 19,
                "nama": "Radiologi ",
                "detail": [
                    { "id": 137, "nama": "Thoraxs ", "type": "checkbox" },
                    { "id": 138, "nama": "CT Scan ", "type": "checkbox" },
                    { "id": 139, "nama": "Abdomen 3 Posisi ", "type": "checkbox" },
                    { "id": 140, "nama": "Lain-lain :", "type": "checkbox" },
                    { "id": 141, "nama": " ", "type": "textbox" },
                ]
            },
            {
                "id": 20,
                "nama": " ",
                "detail": [
                    { "id": 142, "nama": "EKG : ", "type": "textarea" },
                    { "id": 143, "nama": "Hasil : ", "type": "textarea" },
                ]
            },
            ]


            $scope.$watch('item.obj[69]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[70] = true
                    $scope.item.obj[71] = false
                    $scope.item.obj[72] = false
                    $scope.item.obj[73] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[70] = false
                    $scope.item.obj[71] = true
                    $scope.item.obj[72] = false
                    $scope.item.obj[73] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[70] = false
                    $scope.item.obj[71] = false
                    $scope.item.obj[72] = true
                    $scope.item.obj[73] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[70] = false
                    $scope.item.obj[71] = false
                    $scope.item.obj[72] = false
                    $scope.item.obj[73] = true
                }
            });

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[78] = true
                    $scope.item.obj[79] = false
                    $scope.item.obj[80] = false
                    $scope.item.obj[81] = false
                    $scope.item.obj[82] = false
                    $scope.item.obj[83] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[78] = false
                    $scope.item.obj[79] = true
                    $scope.item.obj[80] = false
                    $scope.item.obj[81] = false
                    $scope.item.obj[82] = false
                    $scope.item.obj[83] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[78] = false
                    $scope.item.obj[79] = false
                    $scope.item.obj[80] = true
                    $scope.item.obj[81] = false
                    $scope.item.obj[82] = false
                    $scope.item.obj[83] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[78] = false
                    $scope.item.obj[79] = false
                    $scope.item.obj[80] = false
                    $scope.item.obj[81] = true
                    $scope.item.obj[82] = false
                    $scope.item.obj[83] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[78] = false
                    $scope.item.obj[79] = false
                    $scope.item.obj[80] = false
                    $scope.item.obj[81] = false
                    $scope.item.obj[82] = true
                    $scope.item.obj[83] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[78] = false
                    $scope.item.obj[79] = false
                    $scope.item.obj[80] = false
                    $scope.item.obj[81] = false
                    $scope.item.obj[82] = false
                    $scope.item.obj[83] = true
                }

            }
            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }
            $scope.totalSkorAses = 0
            $scope.getSkorAsesmen = function (stat, skor) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
                            break
                        } else {
                            $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[5194] = $scope.totalSkorAses
            }
            $scope.getSkor2 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor2 = $scope.totalSkor2 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor2 = $scope.totalSkor2 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[5084] = $scope.totalSkor + $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.skorNutrisi = 0
            $scope.getSkorNutrisi = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(stat.descNilai)
                            break
                        }
                    } else { }
                }
                $scope.item.obj[5094] = $scope.skorNutrisi
            }

            function setSkorAkhir(total) {

                if (total < 7) {
                    $scope.item.obj[3149] = true
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = false
                }

                if (total >= 7 && total <= 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = true
                    $scope.item.obj[3151] = false
                }

                if (total > 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = true
                }



            }
            $scope.kembali = function () {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.Save = function () {
                var photo = ""
                kendo.drawing.drawDOM($(".surface"))
                    .then(function (group) {
                        debugger;
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function (data) {
                        photo = data
                        debugger;
                    })
                debugger;
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                var arrSave2 = []
                var a = ""
                var b = ""
                var c = ""
                debugger
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 888 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 889 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 39 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        if ($scope.item.obj[parseInt(arrobj[i])].namalengkap == undefined)
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].diagnosa })
                        else
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 890 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 891 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 122 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].diagnosa })
                    } else if (arrobj[i] == 124 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].diagnosa })
                    } else if (arrobj[i] == 129 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        if ($scope.item.obj[parseInt(arrobj[i])].namalengkap == undefined)
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].diagnosa })
                        else
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 130 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 131 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 144 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        a = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } else if (arrobj[i] == 145 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        b = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } else if (arrobj[i] == 146 && $scope.item.obj[parseInt(arrobj[i])] != null) {
                        c = $scope.item.obj[parseInt(arrobj[i])];
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                debugger
                // arrSave.push({ id: "132", values: photo })
                $scope.cc.jenisemr = 'emrigd'
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
                    sekarang: b
                }
                medifirstService.post('emr/save-emr-igd', jsonSavex).then(function (e) {

                });
            }

        }
    ]);
});