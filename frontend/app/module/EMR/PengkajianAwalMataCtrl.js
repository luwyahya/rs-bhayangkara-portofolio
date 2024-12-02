define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PengkajianAwalMataCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.user = {};
        $scope.cc = {};
        $scope.cc.emrfk = 676;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        var dataLoad = []
        $scope.istempatLaporan = true;
        LoadCombo()
        LoadCacheHelper()

        function LoadCombo() {
            medifirstService.get('emr/get-combo?').then(function(dat) {
                $scope.listDokter = dat.data.dokter
            })
            medifirstService.getPart("emr/get-combo-diagnosa-pengkajian", true, true, 10).then(function(data) {
                $scope.listDiagnosa = data;
           }); 
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
                $scope.cc.jenisemr = "soaprj"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        function clearAll() {
            $scope.item = {}
        }
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalmata", true).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                if (dat.data.data.length > 0) {
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 676;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                } else {
                    medifirstService.get('emr/get-image-from-jenis-surat?').then(function(dat) {
                        debugger
                        $scope.user.poto2 = dat.data[0].template
                        $scope.user.poto = dat.data[1].template
                        $scope.user.poto3 = dat.data[2].template
                        $scope.user.poto4 = dat.data[3].template
                    })
                    $scope.item.obj = []
                    cekDiagnosa()
                    cekValue()
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
                        if (dataLoad[i].emrdfk == "1270") {
                            $scope.user.poto = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == "1271") {
                            $scope.user.poto2 = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1274") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1265") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                    }

                }
            })
        }
        $scope.simpan = function() {
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
            var photo2 = ""
                kendo.drawing.drawDOM($(".surface2"))
                    .then(function (group2) {
                        debugger;
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group2);
                    }).done(function (data2) {
                        photo2 = data2
                        debugger;
                    })
            var photo3 = ""
                kendo.drawing.drawDOM($(".surface3"))
                    .then(function (group3) {
                        debugger;
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group3);
                    }).done(function (data3) {
                        photo3 = data3
                        debugger;
                    })
            var photo4 = ""
                kendo.drawing.drawDOM($(".surface4"))
                    .then(function (group4) {
                        debugger;
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group4);
                    }).done(function (data4) {
                        photo4 = data4
                        debugger;
                    })
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if (arrobj[i] == 1274) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                }  else {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
            }
            arrSave.push({ id: "1270", values: photo })
            arrSave.push({ id: "1271", values: photo2 })
            arrSave.push({ id: "1611", values: photo3 })
            arrSave.push({ id: "1612", values: photo4 })
            $scope.cc.jenisemr = 'pengkajianawalmata'
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
                    'jenislog': 'Simpan Pengkajian Awal Mata',
                    'referensi': 'noregistrasi',
                    'noreff': $scope.cc.noregistrasi,
                    'keterangan': 'Simpan Pengkajian Awal Mata ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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
        $scope.cetak = function() {
            debugger
                if (nomorEMR == '') return
                var kiri = $scope.user.poto;
                var kanan = $scope.user.poto2;
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 1261; i <= 1270 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 1272; i <= 1275 - 1; i++) {
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
                    "paramKey": ["norm","dataLoad","namaPasien","jeniskelamin","umur","ruangan","kiri","kanan"],
                    "paramValue": [$scope.cc.nocm,arrPush,$scope.cc.namapasien,$scope.cc.jeniskelamin,$scope.cc.umur,$scope.cc.namaruangan,kiri,kanan],
                    "paramType" : ["","","","","","","",""]
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
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/poli-mata.pdf');
                }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/poli-mata.pdf');
                }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/poli-mata.pdf');
                }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/poli-mata.pdf');
                }else{
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/poli-mata.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));	
        }
        function cekDiagnosa() {
            medifirstService.get('emr/get-diagnosa-from-pengkajian-awal?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                if(dat.data.length > 0) {
                    $scope.item.obj[1265] = { namadiagnosa: dat.data[0].value }
                }
            })
        }
        function cekValue() {
            medifirstService.get('emr/get-value-from-pengkajian-kep-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                if(dat.data.length > 0) {
                    $scope.item.obj[1324] = dat.data[0].value
                    $scope.item.obj[1325] = dat.data[1].value
                    $scope.item.obj[1326] = dat.data[2].value
                    $scope.item.obj[1327] = dat.data[3].value
                    $scope.item.obj[1328] = dat.data[4].value
                    $scope.item.obj[1329] = dat.data[5].value
                    $scope.item.obj[1330] = dat.data[6].value
                    $scope.item.obj[1331] = dat.data[7].value
                }
            })
        }
    }
])
})