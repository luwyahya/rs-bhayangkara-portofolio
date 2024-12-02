define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PemantauanPemberianCairanCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.user = {};
        $scope.cc = {};
        $scope.cc.emrfk = 894;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        var dataLoad = []
        $scope.istempatLaporan = true;
        $scope.ispagi = false;
        $scope.issore = false;
        $scope.ismalam = false;
        $scope.isRouteLoading = false;
        $scope.item.obj = []

       
        LoadCombo()
        LoadCacheHelper()

        function LoadCombo() {
            medifirstService.get('emr/get-combo?').then(function(dat) {
                $scope.listDokter = dat.data.dokter
            })
        }
        $scope.listshiftkerja = [
            { text: "Pagi (07.00 - 14.00)", value: 1 },
            { text: "Sore (15.00 - 20.00)", value: 2 },
            { text: "Malam (21.00 - 06.00)", value: 3 },                     
        ];           

        $scope.$watch('item.shiftkerja.value', function (newValue, oldValue) {
            debugger
            if (newValue != oldValue) {
                if (newValue == '1') {
                    $scope.ispagi = true
                    $scope.issore = false
                    $scope.ismalam = false   
                } 
                if (newValue == '2') {
                    $scope.ispagi = false
                    $scope.issore = true
                    $scope.ismalam = false   
                }
                if (newValue == '3') {
                    $scope.ispagi = false
                    $scope.issore = false
                    $scope.ismalam = true   
                }
            }
        });

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
                $scope.cc.jenisemr = "pemantauanpemberiancairan"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                $scope.item.obj[4172] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                init()

                
                medifirstService.get("emr/get-riwayat-pemberian-cairan?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                    $scope.isRouteLoading = false;                        
                    let data = dat.data
                    for(let i = 0; i < data.length; i++) {
                        data[i].no = i + 1;
                    }
                    $scope.dataGridRacikan = new kendo.data.DataSource({
                        data: data,
                        schema: {
                            model: {
                            }
                        },
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                       
                    });  
                })
            }
        }
        function clearAll() {
            $scope.item = {}
        }
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pemantauanpemberiancairan", true).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                if (dat.data.data.length > 0) {
                    $scope.noemr = dat.data.data[0].noemr
                    //$scope.cc.norec_emr = dat.data.data[0].noemr
                    
                    $scope.cc.norec_emr = '-'
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 894;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                } else {
                    $scope.item.obj[4172] = moment($scope.now).format('YYYY-MM-DD HH:mm')

                    $scope.cc.norec_emr = '-'
                    $scope.item.obj = []
                    $scope.item.obj[4172] = tgl    
                    $scope.item.obj[4171] = {namalengkap: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[3908] = {namalengkap: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[4166] = {namalengkap: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[4009] = {namalengkap: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
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

                        if (dataLoad[i].type == "textbox" || dataLoad[i].type == null) { //ash
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd                          
                        }
                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
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
                    }

                }
            })
        }       
        
        $scope.simpan = function() {
            debugger
            // var user = medifirstService.getPegawaiLogin();
            // $scope.item.obj[1504] = moment($scope.now).format('YYYY-MM-DD')           
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                // if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                //     if (arrobj[i] == 1580) {
                //         arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })                   
                //     } else {
                //         arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                //     } 
                // }
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })

            }

            
            $scope.cc.jenisemr = 'pemantauanpemberiancairan'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                debugger
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Simpan Emr Pemantauan Pemberian Cairan ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });

                medifirstService.get("emr/get-riwayat-pemberian-cairan?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                    $scope.isRouteLoading = false;                        
                    let data = dat.data
                    for(let i = 0; i < data.length; i++) {
                        data[i].no = i + 1;
                    }
                    $scope.dataGridRacikan = new kendo.data.DataSource({
                        data: data,
                        schema: {
                            model: {
                            }
                        },
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                       
                    });  
                })
        }
        $scope.Cetak = function () {
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 3780; i <= 4172 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "datetime") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                }
                if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                    for (var x = 0; x <= arrPush.length - 1; x++) {
                        if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                            arrPush[x].value = dataLoad[i].value
                        }
                    }
                }
            }
                // debugger
                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan
                // var qrcode1 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pengkajianawalkeperawatanigd?noregistrasifk="+$scope.cc.noregistrasi

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
                     ;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/PemantauanPemberianCairan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PemantauanPemberianCairan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/PemantauanPemberianCairan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/PemantauanPemberianCairan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PemantauanPemberianCairan.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        }


        
        $scope.columnGridRacikan = [
            {
                "field": "no",  
                "title": "No",
                "width": "5px",
                "template": "<span class='style-center'>#: no #</span>",
            },  
            {
                "field": "tglemr",
                "title": "Tanggal Pemberian",
                "width": "20px",
            },               
            {
                "field": "namalengkap",
                "title": "Nama Petugas",
                "width": "30px",
            }               
        ];
    }
])
})