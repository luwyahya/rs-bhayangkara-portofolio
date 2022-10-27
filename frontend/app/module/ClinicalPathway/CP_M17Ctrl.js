define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CP_M17Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = true;
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            $scope.itm = {}
            $scope.item = []
            var nomorEMR = '-'
            var norecEMR
            $scope.cc.emrfk = 1
            $scope.item.clr = []
            var minx =2
            var maxx =8
            var dataLoad = []
            $scope.item.objcbo= []
            $scope.kodeCP ='CP_M17'
            // console.log($rootScope.editCP)
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            var chacePeriode = cacheHelper.get('cacheCP');
            if (chacePeriode != undefined) {
                $scope.cc.noregistrasi = chacePeriode[0]
                $scope.cc.norec_pd = chacePeriode[1]
                $scope.cc.norec_apd = chacePeriode[2]
                // if (nomorEMR == '-') {
                //     $scope.cc.norec_emr = '-'
                // } else {
                //     $scope.cc.norec_emr = nomorEMR
                // }
            }
            var chekedd = false
           if(nomorEMR!='-'){
               cacheHelper.set('cacheEMR_TRIASE_PRIMER_UMUM', nomorEMR)
           }
           $scope.range = function(min, max, step){
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) input.push(i);
                return input;
              };
            $scope.ranged = function(q){
                var input = [];
                minx =(8*q)+1
                maxx=(8*q)+8
                for (var i = minx; i <= maxx; i += 1) input.push(i);
                return input;
              };
           LoadData($scope.cc.noregistrasi);
            function LoadData(noregistrasi) {
                $scope.cc.norec_emr = '-'
                // $scope.isRouteLoading = true;
                medifirstService.get("cp/get-cp-transaksi-detail?cp=CP_M17&noregistrasi=" + noregistrasi  , true).then(function (dat) {                
                    $scope.item.obj = []
                    $scope.item.obj2 = []


                    dataLoad = dat.data.data
                    $scope.cc.norec_emr = dat.data.data[0].emrpasienfk
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                
                        }

                    }
                    $scope.isRouteLoading = false;
                })
                medifirstService.get("cp/get-colorchk?kodecp=CP_M17"  , true).then(function (dat) {     
                    dataLoad = dat.data.data           
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (dataLoad[i].checkisred == true) {
                            $scope.item.clr[dataLoad[i].idobjectcp] = "background-color: #FF0000;"
                        }
                    }
                    $scope.isRouteLoading = false;
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

            $scope.openAsseementAwal = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/VitalSign", '_blank');
                //$scope.item.obj[dataId]
                saveObj(dataId,$scope.item.obj[dataId])
            }
            $scope.openTriaseIGD = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/AsesmenCovid/TriaseGawatDarurat", '_blank');
                saveObj(dataId,$scope.item.obj[dataId])
            }
            $scope.openLab = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/TransaksiPelayananLaboratoriumDokterRev", '_blank');
                saveObj(dataId,$scope.item.obj[dataId])
            }
            $scope.openRad = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/TransaksiPelayananRadiologiDokterRev", '_blank');
                saveObj(dataId,$scope.item.obj[dataId])
            }
            $scope.openEresep = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/InputResepApotikOrderRev", '_blank');
                saveObj(dataId,$scope.item.obj[dataId])
            }
            $scope.openDiagnosa = function(dataId){
                window.open(globalThis.location.origin + "/app/#/RekamMedis/" + $scope.cc.norec_apd + "/InputDiagnosaDokter", '_blank');
                saveObj(dataId,$scope.item.obj[dataId])
            }

            function saveObj(cId,cValues){
                var arrSave = []
                $scope.cc = {
                    norec_emr : $scope.cc.norec_emr,
                    noregistrasi : $scope.cc.noregistrasi,
                    emrfk : 1,
                    norec_pd : $scope.cc.norec_pd,
                    norec_apd : $scope.cc.norec_apd,
                    norec : '', //norec_apd
                    jenis : '',
                    cp : 'CP_M17',

                }
                arrSave = [{
                    id: cId,
                    values: cValues
                }]
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('cp/save-cp-dinamis', jsonSave).then(function (e) {
                    // medifirstService.postLogging('CP', 'norec CP', e.data.data.norec,  
                    // 'CP_M17' + ' dengan noregistrasi - ' + $scope.cc.noregistrasi 
                    // + $scope.cc.noregistrasi).then(function (res) {
                    // })
                  
                    //  $rootScope.loadRiwayat()
                    //  var arrStr = {
                    //      0: e.data.data.noemr
                    //  }
                    //  cacheHelper.set('cacheNomorEMR', arrStr);
                });
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
                    norec_emr : $scope.cc.norec_emr,
                    noregistrasi : $scope.cc.noregistrasi,
                    emrfk : 1,
                    norec_pd : $scope.cc.norec_pd,
                    norec : '', //norec_apd
                    jenis : '',
                    cp : 'CP_M17',

                }
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('cp/save-cp-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('CP', 'norec CP', e.data.data.norec,  
                    'CP_M17' + ' dengan noregistrasi - ' + $scope.cc.noregistrasi 
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
           
            $rootScope.checkEdit = function (bool) {
                if (bool) {
                   $rootScope.isEditCP =bool
                } else {
                   $rootScope.isEditCP =bool
                }
                console.log($rootScope.isEditCP)
                
            }
            $scope.kodeCP = 'CP_M17'
            $scope.openLink = function(id){
               console.log('CP Click object id ->>>' +id)
               var obj = ''
               id = id.toString()
               if($scope.item.obj[id] == true){
                   obj = 'object'
               }
               if(id.indexOf(',') > -1){
                   obj = 'array'
               }
               if(obj != ''){
                 if($rootScope.isEditCP ==true){
                       $rootScope.showPopUp(id,$scope.kodeCP)
                   }else{
                         cacheHelper.set('CP_Cache',undefined)
                         medifirstService.get("cp/get-mapping?kodecp="+$scope.kodeCP+"&idobjectcp="+id).then(function (data) {
                             if(data.data.data.length > 0){
                                var routing = data.data.data[0].url
                                if(routing != null && $scope.cc.norec_apd != undefined){
                                    if(data.data.data[0].jenis =='resep'){
                                       var arrC = []
                                        for (var i = 0; i <  data.data.data.length; i++) {
                                             const element = data.data.data[i]
                                             arrC.push({produkfk:  element.produkfk,qty:parseFloat(element.jumlah)})
                                             if(obj =='object'){
                                               saveObj(id,$scope.item.obj[id])  
                                             }else{
                                               saveObj(parseInt(element.idobjectcp),true)  
                                             }    
                                        }
                                        cacheHelper.set('CP_Cache',JSON.stringify(arrC))  
                                    }else{
                                        saveObj(id,$scope.item.obj[id])  
                                    }
                                   
                                    var url = $state.href(routing , {
                                        noRec: $scope.cc.norec_apd
                                    });
                                    window.open(globalThis.location.origin + "/app/"+ url,'_blank').focus();                  
                                    
                                }
                             }else{
                                 saveObj(id,$scope.item.obj[id])  
                             }
                         })
                    }   
               }
                
            }

            //*** BATAS */

        }
    ]);
});