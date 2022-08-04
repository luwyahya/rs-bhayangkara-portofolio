define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RekamMedisIGDCtrl', ['$rootScope', '$scope', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($rootScope, $scope, $state, dateHelper, medifirstService, cacheHelper) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.header = {};
            $scope.header.DataNoregis = '';
            $scope.checkNoregis =true
            var usia = ''
            var departemen = ''           
            $scope.getRekamMedisCheck = function() {
                $rootScope.getRekamMedisCheck($scope.checkNoregis);
            }
            // FormLoad();
            LoadCacheHelper();
            // $scope.cekGetData(true);
            // $scope.Generate($scope.header.Generate);
            // $scope.Generate=true; 
            // norec Antrian Etateh
            function LoadCacheHelper(){
                var chacePeriode = cacheHelper.get('cacheHeader');
                if(chacePeriode != undefined){
                      var UmurPasien = ""
                      if (chacePeriode.umur == undefined) {
                            var umur = dateHelper.CountAge(new Date(chacePeriode.tgllahir), $scope.now);
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            // departemen = result.objectdepartemenfk
                            umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                            UmurPasien = umur                           
                      }else{
                          UmurPasien=chacePeriode.umur
                      }
                      $scope.item.nocm = chacePeriode.nocm;
                      $scope.item.namaPasien = chacePeriode.namapasien;
                      $scope.item.jenisKelamin = chacePeriode.jeniskelamin;
                      $scope.item.tgllahir = moment(chacePeriode.tgllahir).format('DD-MM-YYYY HH:mm');
                      $scope.item.umur = UmurPasien;
                      $scope.item.alamatlengkap = chacePeriode.alamatlengkap;
                      $scope.item.notelepon = chacePeriode.notelepon;
                      // pm.id as nocmfk,pm.nocm,pm.namapasien,pm.tgllahir,
                             // pm.objectjeniskelaminfk,jk.jeniskelamin,alm.alamatlengkap,pm.notelepon
                      var datas = {
                          nocm : chacePeriode.nocm,
                          namapasien : chacePeriode.namapasien,
                          jeniskelamin : chacePeriode.jeniskelamin,
                          tgllahir : moment(chacePeriode.tgllahir).format('DD-MM-YYYY HH:mm'),
                          umur : UmurPasien,
                          alamatlengkap : chacePeriode.alamatlengkap,
                          notelepon : chacePeriode.notelepon,
                      }
                      $scope.header.generate = true;
                      $scope.header = datas  
                      // FormLoad();                
                }else{
                    FormLoad();
                }
                // init()                
            }


            function FormLoad(){               
                medifirstService.get('igd/get-data-pasien/' + $scope.item.nocm).then(function (e) {
                    debugger;
                    var result = e.result
                    result.umur = dateHelper.CountAge(new Date(result.tgllahir), $scope.now);
                    var bln = result.umur.month,
                        thn = result.umur.year,
                        day = result.umur.day
                    usia = (result.umur.year * 12) + result.umur.month;                    
                    result.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDate = new Date(result.tgllahir);
                    var secondDate = $scope.now;
                    var countDay = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    var setUsiaPengkajian = {
                        'hari': countDay,
                        'umur': thn
                    }                   
                    cacheHelper.set('RekamMedisIGDCtrl',     $scope.header);                    
                    localStorage.setItem('usiaPengkajian', JSON.stringify(setUsiaPengkajian));                    
                }) 
            }
            
         
            // $rootScope.cekGetData = $scope.cekGetData()            
            $scope.nav = function (state) {
                $scope.currentState = state;
                var arrStr = {
                    0: $scope.header.nocm,
                    1: $scope.header.namapasien,
                    2: $scope.header.jeniskelamin,
                    3: $scope.header.tgllahir,
                    4: $scope.header.umur,
                    5: $scope.header.alamatlengkap,
                    6: $scope.header.notelepon,                   
                }                
                cacheHelper.set('RekamMedisIGDCtrl', arrStr);
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }            

            $scope.Generate = function (data) {
                if (data === true) {
                    $scope.header.DataNoregis = true;
                } else {
                    $scope.header.DataNoregis = false;
                }
            };
            
            $scope.hideShowForm = function (usiaPengkajian, departemen) {                
                if (usiaPengkajian.hari >= 1 && usiaPengkajian.hari <= 31) { $scope.isNeonatal = true }
                if (usiaPengkajian.hari > 31 && usiaPengkajian.umur <= 17) { $scope.isAnak = true }
                if (usiaPengkajian.umur >= 18 && usiaPengkajian.umur <= 49) { $scope.isDewasa = true }
                if (usiaPengkajian.umur > 50) { $scope.isGeriatri = true }
                if (departemen == 18 || departemen == 28 || departemen == 24) { $scope.isRawatJalan = true }
                if (departemen == 16 || departemen == 35) { $scope.isRawatInap = true }
            }
        }
    ]);
});