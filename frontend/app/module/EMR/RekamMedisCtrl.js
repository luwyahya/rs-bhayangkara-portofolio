
define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('RekamMedisCtrl', ['$rootScope', '$scope', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function($rootScope, $scope, $state, dateHelper, medifirstService, cacheHelper) {
  
            $scope.isNavEMR = true;
            $scope.isNonNavEMR = false;
            $scope.x = true;
            var getPegawai = medifirstService.getPegawai();
            // if(getPegawai.jenisPegawai.id == 10) {
            //     $scope.isNonNavEMR = true;
            // } else {
            //     $scope.isNavEMR = true;
            // }
            $scope.now = new Date();
  
            $scope.header = {};
  
            $scope.checkNoregis = '';
            $scope.checkNoregis = true
            var usia = ''
            var departemen = ''
            $scope.isLoadingNav = false
                // cacheHelper.set('cacheRekamMedis', undefined);
            $scope.getRekamMedisCheck = function(checkNoregis) {
                $rootScope.getRekamMedisCheck(checkNoregis);
            }
  
            $scope.showNav = function() {
                $rootScope.isShowNavEMR = !$rootScope.isShowNavEMR
            }
  
            //ash
            $scope.showNavRawat = function() {
                $rootScope.isShowNavEMRRawat = !$rootScope.isShowNavEMRRawat
                $rootScope.isShowNavEMR = !$rootScope.isShowNavEMR
            }
            
            //ash
            //key
            $scope.openRawatJalan = function() {
              var profesi = medifirstService.getKelompokUser();
              // debugger;
              if (profesi === 'dokter') {
                  $state.go('DaftarAntrianDokterRajal');
              } else if (profesi === 'suster') {
                  $state.go('RGFmdGFyQW50cmlhblN1c3RlclJhamFs');
              } else {
                  $state.go('RGFmdGFyQW50cmlhblN1c3RlclJhamFs');
              }
          }
          //   $scope.openRawatJalan = function() {
          //       $state.go('DaftarAntrianDokterRajal')
          //   }
            $scope.openRawatInap = function() {
              var profesi = medifirstService.getKelompokUser();
              if (profesi === 'dokter') {
                  $state.go('DaftarAntrianDokterRanap')
              } else {
                  $state.go('RGFmdGFyQW50cmlhblN1c3RlclJhbmFw')
              }
            }
  
            //--ash--02-08-2023 
            $scope.isBodyEMR="grid_11";
            $scope.isNavigasiEMR="grid_1";
  
            // norec Antrian Etateh
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function(e) {
                var result = e.data.result
                result.umur = dateHelper.CountAge(new Date(result.tgllahir), new Date(result.tglregistrasi));
                var bln = result.umur.month,
                    thn = result.umur.year,
                    day = result.umur.day
                usia = (result.umur.year * 12) + result.umur.month;
                departemen = result.objectdepartemenfk
                result.umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date(result.tgllahir);
                var secondDate = new Date(result.tglregistrasi);
                var countDay = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  
                var setUsiaPengkajian = {
                    'hari': countDay,
                    'umur': thn
                }
                $scope.header.generate = true;
  
                $scope.header = result
                setCache()
                if (result.foto == null)
                    $scope.header.image = "../app/images/avatar.jpg"
                else
                    $scope.header.image = result.foto
                localStorage.setItem('usiaPengkajian', JSON.stringify(setUsiaPengkajian));
                localStorage.setItem('departemenPengkajian', departemen);
                $scope.hideShowForm(setUsiaPengkajian, departemen)
            })
  
  
  
            function setCache() {
                cacheHelper.set('CacheInputDiagnosaDokter', undefined);
                cacheHelper.set('InputResepApotikOrderRevCtrl', undefined);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', undefined);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', undefined);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', undefined);
                cacheHelper.set('cacheRMelektronik', undefined);
                cacheHelper.set('cacheCPPT', undefined);
                cacheHelper.set('cachePengkajianPasien', undefined);
                cacheHelper.set('OdontoGramDokterCtrl', undefined);
                cacheHelper.set('PengkajianSurveilansRevCtrl', undefined);
                cacheHelper.set('OrderElektromedikCtrl', undefined);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', undefined);
  
                var arrStr = {
                    0: $scope.header.nocm,
                    1: $scope.header.namapasien,
                    2: $scope.header.jeniskelamin,
                    3: $scope.header.noregistrasi,
                    4: $scope.header.umur,
                    5: $scope.header.kelompokpasien,
                    6: $scope.header.tglregistrasi,
                    7: $scope.header.norec,
                    8: $scope.header.norec_pd,
                    9: $scope.header.objectkelasfk,
                    10: $scope.header.namakelas,
                    11: $scope.header.objectruanganfk,
                    12: $scope.header.namaruangan,
                    13: $scope.checkNoregis,
                    14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                    15: $scope.header.alamatlengkap,
                    16: $scope.header.dokterdpjp,
                    17: $scope.header.iddpjp,
                    18: $scope.header.tgllahir,
                    19: $scope.header.objectkelompokpasienlastfk,
                    20: $scope.header.golongandarah,
                    21: $scope.header.namarekanan,
                    22: $scope.header.objectrekananfk,
                    23: $scope.header.objectdepartemenfk,
                    24: $scope.header.ruanganterakhir,
                    25: $scope.header.nocmfk,
                    26: $scope.header.objectagamafk,
                    27: $scope.header.agama,
                    28: $scope.header.objectpendidikanfk,
                    29: $scope.header.pendidikan,
                    30: $scope.header.objectpekerjaanfk,
                    31: $scope.header.pekerjaan
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheCPPT', arrStr);
                cacheHelper.set('cachePengkajianPasien', arrStr);
                cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                cacheHelper.set('OrderElektromedikCtrl', arrStr);
                loadTreeView()
            }
  
            function setCacheRuanganLast() {
                medifirstService.get('emr/get-norecLast?norec_pd=' + $scope.header.norec_pd).then(function(dat) {
  
  
                    debugger;
                    cacheHelper.set('CacheInputDiagnosaDokter', undefined);
                    cacheHelper.set('InputResepApotikOrderRevCtrl', undefined);
                    cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', undefined);
                    cacheHelper.set('InputTindakanPelayananDokterRevCtrl', undefined);
                    cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', undefined);
                    cacheHelper.set('cacheRMelektronik', undefined);
                    cacheHelper.set('cacheCPPT', undefined);
                    cacheHelper.set('cachePengkajianPasien', undefined);
                    cacheHelper.set('OdontoGramDokterCtrl', undefined);
                    cacheHelper.set('PengkajianSurveilansRevCtrl', undefined);
                    cacheHelper.set('OrderElektromedikCtrl', undefined);
                    cacheHelper.set('InputFormulirPendelegasianObatCtrl', undefined);
                    $scope.header.norec = dat.data[0].norec;
                    $scope.header.objectruanganfk = dat.data[0].objectruanganfk;
                    $scope.header.namaruangan = dat.data[0].namaruangan;
                    var arrStr = {
                        0: $scope.header.nocm,
                        1: $scope.header.namapasien,
                        2: $scope.header.jeniskelamin,
                        3: $scope.header.noregistrasi,
                        4: $scope.header.umur,
                        5: $scope.header.kelompokpasien,
                        6: $scope.header.tglregistrasi,
                        7: dat.data[0].norec,
                        8: $scope.header.norec_pd,
                        9: $scope.header.objectkelasfk,
                        10: $scope.header.namakelas,
                        11: dat.data[0].objectruanganfk,
                        12: dat.data[0].namaruangan,
                        13: $scope.checkNoregis,
                        14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                        15: $scope.header.alamatlengkap,
                        16: $scope.header.dokterdpjp,
                        17: $scope.header.iddpjp,
                        18: $scope.header.tgllahir,
                        19: $scope.header.objectkelompokpasienlastfk,
                        20: $scope.header.golongandarah,
                        21: $scope.header.namarekanan,
                        22: $scope.header.objectrekananfk,
                        23: $scope.header.objectdepartemenfk,
                        24: $scope.header.ruanganterakhir,
                        25: $scope.header.nocmfk,
                        26: $scope.header.objectagamafk,
                        27: $scope.header.agama,
                        28: $scope.header.objectpendidikanfk,
                        29: $scope.header.pendidikan,
                        30: $scope.header.objectpekerjaanf
                    }
                    cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                    cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                    cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                    cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                    cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                    cacheHelper.set('cacheRMelektronik', arrStr);
                    cacheHelper.set('cacheCPPT', arrStr);
                    cacheHelper.set('cachePengkajianPasien', arrStr);
                    cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                    cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                    cacheHelper.set('cacheRekamMedis', arrStr);
                    cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                    cacheHelper.set('OrderElektromedikCtrl', arrStr);
                    loadTreeView()
                })
            }
  
            function loadTreeView() {
                $scope.isLoadingNav = true
                $scope.treeSourceMenu = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi").then(function(e) {
                    $scope.isLoadingNav = false
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: false
                            }
                        }
                    });
                    $scope.treeSourceMenu = inlineDefault
                    $scope.mainTreeViewMenuOption = {
                            dataBound: function(e) {
                                $('span.k-in').each(function() {
                                    if ($(this).text() == 'IGD') { $(this).addClass('navHeader') }
                                    if ($(this).text() == 'RAWAT JALAN') { $(this).addClass('navHeader') }
                                    if ($(this).text() == 'RAWAT INAP') { $(this).addClass('navHeader') }
                                    if ($(this).text() == 'PENUNJANG') { $(this).addClass('navHeader') }
                                    if ($(this).text() == 'CPPT') { $(this).addClass('hijau') }
                                    //   if ($(this).text() == 'Vital Sign') { $(this).addClass('biru') }
                                    // if ($(this).text() == 'Resep Elektronik') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Askep') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Rencana Askep') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Resume Medis') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Catatan Keperawatan') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Konsultasi') { $(this).addClass('biru') }
                                    if ($(this).text() == 'History') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Bedah') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Konsultasi') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Evaluasi Awal dan Tata Laksana Tim Integrasi Emergensi') { $(this).addClass('biru') }
                                    if ($(this).text() == 'EMR IGD') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Pengkajian Awal Keperawatan') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Pengkajian Awal Medis Pasien') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Pengkajian Awal Keperawatan IGD') { $(this).addClass('biru') }
                                    if ($(this).text() == 'EWS') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Resiko Jatuh') { $(this).addClass('biru') }
                                    if ($(this).text() == 'Pengkajian Medis IGD') { $(this).addClass('hijau') }
                                    if ($(this).text() == 'Resume Medis IGD') { $(this).addClass('hijau') }
  
                                })
                                    // var text = "CPPT Vital Sign";
                                    // e.sender.element.find("span.k-in:contains(" + text + ")").addClass('kuntul');
                            },
                            dataTextField: ["caption"],
                            datakKeyField: ["id"],
                            select: onSelect,
                            dragAndDrop: false,
                            checkboxes: false
                        }
                        // var treeview = $("#treeview").data("kendoTreeView");
                        // .expandPath([2, 5])
                    $scope.showNavigasiTree = true
  
                }, function(error) {
                    $scope.isLoadingNav = false
                })
  
            }
            // function loadTreeView() {
            //     $scope.isLoadingNav = true
            //     $scope.treeSourceMenu = [];
            //     medifirstService.get("emr/get-menu-rekam-medis-dynamic-nav?namaemr=navigasi&noregistrasi=" + $scope.header.noregistrasi).then(function(e) {
            //         $scope.isLoadingNav = false
            //         var inlineDefault = new kendo.data.HierarchicalDataSource({
            //             data: e.data.data,
            //             schema: {
            //                 model: {
            //                     children: "child",
            //                     expanded: false
            //                 }
            //             }
            //         });
            //         $scope.treeSourceMenu = inlineDefault
            //         $scope.mainTreeViewMenuOption = {
            //                 dataBound: function(e) {
            //                     $('span.k-in').each(function() {
            //                             if ($(this).text() == 'CPPT') { $(this).addClass('biru') }
            //                             // if ($(this).text() == 'Vital Sign') { $(this).addClass('biru') }
            //                             // if ($(this).text() == 'Resep Elektronik') { $(this).addClass('biru') }
            //                             if ($(this).text() == 'Askep') { $(this).addClass('biru') }
            //                             if ($(this).text() == 'Rencana Askep') { $(this).addClass('biru') }
            //                             if ($(this).text() == 'Resume Medis') { $(this).addClass('biru') }
            //                             if ($(this).text() == 'Catatan Keperawatan') { $(this).addClass('biru') }
  
            //                         })
            //                         // var text = "CPPT Vital Sign";
            //                         // e.sender.element.find("span.k-in:contains(" + text + ")").addClass('kuntul');
            //                 },
            //                 dataTextField: ["caption"],
            //                 datakKeyField: ["id"],
            //                 select: onSelect,
            //                 dragAndDrop: false,
            //                 checkboxes: false
            //             }
            //             // var treeview = $("#treeview").data("kendoTreeView");
            //             // .expandPath([2, 5])
            //         $scope.showNavigasiTree = true
  
            //     }, function(error) {
            //         $scope.isLoadingNav = false
            //     })
  
            // }
  
            function onSelect(e) {
                var data3 = e.sender.dataSource._data
  
                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                $scope.listBreadCumb = []
  
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (uid_select == data3[i].uid) {
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        break;
                    }
                    if (data3[i].child != undefined) {
                        for (var ii = data3[i].child.length - 1; ii >= 0; ii--) {
                            if (uid_select == data3[i].child[ii].uid) {
                                idTree = data3[i].child[ii].id
                                urlTrue = data3[i].child[ii].reportdisplay
                                break;
                            }
                            if (data3[i].child[ii].child != undefined) {
                                for (var iii = data3[i].child[ii].child.length - 1; iii >= 0; iii--) {
                                    if (uid_select == data3[i].child[ii].child[iii].uid) {
                                        idTree = data3[i].child[ii].child[iii].id
                                        urlTrue = data3[i].child[ii].child[iii].reportdisplay
                                        break;
                                    }
                                }
                            }
  
                        }
                    }
  
                }
                // for (let x = 0; x < data3.length; x++) {
                //   if(idTree ==data3[x].headfk){
                //     $scope.listBreadCumb.push({name:data3[x].caption}) 
                //   }                    
                // }
  
                var noemr = '-'
                    // debugger;
                    // if (urlTrue != 'HRekamMedis.HistoryEMR') {
                    //     setCacheRuanganLast();
                    // }
                if ($scope.dataSelected != undefined) {
                    noemr = $scope.dataSelected.noemr
                }
                if (urlTrue == null) {
                    $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                        namaEMR: idTree,
                        nomorEMR: noemr
                    });
                } else {
                    $state.go(urlTrue);
                }
            }
  
            $scope.nav = function(state) {
                $scope.currentState = state;
                var arrStr = {
                    0: $scope.header.nocm,
                    1: $scope.header.namapasien,
                    2: $scope.header.jeniskelamin,
                    3: $scope.header.noregistrasi,
                    4: $scope.header.umur,
                    5: $scope.header.kelompokpasien,
                    6: $scope.header.tglregistrasi,
                    7: $scope.header.norec,
                    8: $scope.header.norec_pd,
                    9: $scope.header.objectkelasfk,
                    10: $scope.header.namakelas,
                    11: $scope.header.objectruanganfk,
                    12: $scope.header.namaruangan,
                    13: $scope.checkNoregis,
                    14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                    15: $scope.header.alamatlengkap,
                    16: $scope.header.dokterdpjp,
                    17: $scope.header.iddpjp,
                    18: $scope.header.tgllahir,
                    19: $scope.header.objectkelompokpasienlastfk,
                    20: $scope.header.golongandarah,
                    21: $scope.header.namarekanan,
                    22: $scope.header.objectrekananfk,
                    23: $scope.header.objectdepartemenfk,
                    24: $scope.header.ruanganterakhir,
                    25: $scope.header.nocmfk,
                    26: $scope.header.objectagamafk,
                    27: $scope.header.agama,
                    28: $scope.header.objectpendidikanfk,
                    29: $scope.header.pendidikan,
                    30: $scope.header.objectpekerjaanf
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheCPPT', arrStr);
                cacheHelper.set('cachePengkajianPasien', arrStr);
                cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                cacheHelper.set('OrderElektromedikCtrl', arrStr);
  
                $state.go(state, $state.params);
                // console.log($scope.currentState);
  
            }
  
  
            $scope.Generate = function(data) {
  
                if (data === true) {
                    $scope.checkNoregis = true;
                } else {
                    $scope.checkNoregis = false;
                }
            };
  
            $scope.hideShowForm = function(usiaPengkajian, departemen) {
  
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
  