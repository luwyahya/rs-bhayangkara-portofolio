define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ClinicalPathwayCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 443
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            $scope.listYaTidak = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listReaktif = [
                { name: "Non Reaktif", id: 1 },
                { name: "Reaktif", id: 2 }
            ];
            $scope.listNegatif= [
                { name: "Negatif", id: 1 },
                { name: "Positif", id: 2 }
            ];
            $scope.listAda= [
                { name: "Ada", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listCaraMasuk = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000003, "nama": "Nama", "type": "textbox"},
                        { "id": 17000004, "nama": "Pekerjaan", "type": "textbox"},
                        { "id": 17000005, "nama": "NIK", "type": "textbox"},
                        { "id": 17000006, "nama": "No.telp", "type": "textbox"},
                        { "id": 17000007, "nama": "Alamat", "type": "textbox2"}
                    ]
                }
            ]
            $scope.listCaraMasuk2 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000008, "nama": "Nama", "type": "textbox"},
                        { "id": 17000009, "nama": "Hubungan dengan Pasien", "type": "textbox"},
                        { "id": 17000010, "nama": "No.telp", "type": "textbox"},
                        { "id": 17000011, "nama": "Alamat", "type": "textarea"}
                    ]
                }
            ]

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
            }

            // var chacePeriode = cacheHelper.get('cacheHeader');
            // if (chacePeriode != undefined) {

            //     chacePeriode.umur = dateHelper.CountAge(new Date(chacePeriode.tgllahir), new Date());
            //     var bln = chacePeriode.umur.month,
            //         thn = chacePeriode.umur.year,
            //         day = chacePeriode.umur.day


            //     chacePeriode.umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
            //     $scope.cc.nocm = chacePeriode.nocm
            //     $scope.cc.namapasien = chacePeriode.namapasien;
            //     $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
            //     $scope.cc.tgllahir = chacePeriode.tgllahir;
            //     $scope.cc.umur = chacePeriode.umur;
            //     $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
            //     $scope.cc.notelepon = chacePeriode.notelepon;

            // }
            var chacePeriode = cacheHelper.get('cacheCP');
            if (chacePeriode != undefined) {
                $scope.cc.noregistrasi = chacePeriode[0]
                $scope.cc.norec_pd = chacePeriode[1]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false
           if(nomorEMR!='-'){
               cacheHelper.set('cacheEMR_TRIASE_PRIMER_UMUM', nomorEMR)
           }
           LoadData($scope.cc.noregistrasi);
            function LoadData(noregistrasi) {

                $scope.isRouteLoading = true;
                medifirstService.get("cp/get-cp-transaksi-detail?noregistrasi=" + noregistrasi  , true).then(function (dat) {                
                    $scope.item.obj = []
                    $scope.item.obj2 = []


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
                                if (dataLoad[i].emrdfk >= 5046 && dataLoad[i].emrdfk <= 5051 && chekedd) {
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
                            if (dataLoad[i].type == "radio") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                            }                        
                        }

                    }

                    
                    medifirstService.get("tatarekening/get-detail_apd?noregistrasi=" + noregistrasi , true).then(function (dat2) {  
                        $scope.itm = dat2.data[0];           
                    })
                    // medifirstService.get("emr/get-diagnosapasienbynoreg?noReg=" + noregistrasi , true).then(function (dat4) {  
                    //     $scope.listDiagnosaPasien = dat4.data.datas;  
                    //     $scope.item.diagnosa = dat4.data.datas[0];      
                    // })
                    medifirstService.get("cp/get-detail-diagnosa-pasien?noregistrasi=" + noregistrasi , true).then(function (dat3) {                
                        $scope.listDiagnosaPasien = dat3.data.data;
                        $scope.item.diagnosa = dat3.data.data[0];

                        $scope.listcp = dat3.data.cp;
                        $scope.item.cp = dat3.data.cp[0];
                        $state.go($scope.item.cp.url)

                    $scope.isRouteLoading = false;
                        
                    })
                })
            }
            $scope.getCP =function(){
                $state.go($scope.item.cp.url)
            }
            $scope.CariNoreg = function(){
                cacheHelper.set('cacheCP', {
                        0: $scope.itm.noRegistrasi,
                        1: $scope.cc.norec_pd,
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: '',
                        7: '',
                        8: '',
                        9: '',
                        10: ''
                    }
                )
                LoadData($scope.itm.noRegistrasi);
            }
            
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.openAsseementAwal = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/VitalSign", '_blank');
            }
            $scope.openTriaseIGD = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/AsesmenCovid/TriaseGawatDarurat", '_blank');
            }
            $scope.openLab = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/TransaksiPelayananLaboratoriumDokterRev", '_blank');
            }
            $scope.openRad = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/TransaksiPelayananRadiologiDokterRev", '_blank');
            }
            $scope.openEresep = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/InputResepApotikOrderRev", '_blank');
            }
            $scope.openDiagnosa = function(){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.itm.norec_apd + "/InputDiagnosaDokter", '_blank');
            }


            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'clinical'
                $scope.cc = {
                    norec_emr : '-',
                    noregistrasi : $scope.cc.noregistrasi,
                    emrfk : 1,
                    norec_pd : $scope.cc.norec_pd,
                    norec : '', //norec_apd
                    jenis : '',

                }
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('cp/save-cp-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('CP', 'norec CP', e.data.data.norec,  
                    'CPCovid19HipertensiCtrl' + ' dengan noregistrasi - ' + $scope.cc.noregistrasi 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                  
                     $rootScope.loadRiwayat()
                     var arrStr = {
                         0: e.data.data.noemr
                     }
                     cacheHelper.set('cacheNomorEMR', arrStr);
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
            $scope.cetakPdf = function () {
                if (nomorEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-triage-igd-covid&id=' + $scope.cc.nocm + '&noregistrasi=' + $scope.cc.noregistrasi + '&emr=' + nomorEMR + '&view=true', function (response) {
                    // do something with response
                });
            }

            //*** BATAS */

        }
    ]);
});